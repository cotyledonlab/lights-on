import { database } from "@lights-on/database";
import { analytics, analyticsEvents } from "@lights-on/product-analytics";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requestFingerprint } from "@/lib/request";
import { checkRateLimit } from "@/lib/rate-limit";
import { currentParticipantId } from "@/lib/session";

const clientEventSchema = z.object({
  event: z.enum([
    analyticsEvents.landingPageView,
    analyticsEvents.resultViewed,
    analyticsEvents.submissionStarted
  ]),
  submissionId: z.uuid().optional()
});

const maximumBodyBytes = 1_024;

class PayloadTooLargeError extends Error {}

async function readBoundedJson(request: Request): Promise<unknown> {
  if (!request.body) {
    throw new SyntaxError("Request body is empty.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    byteLength += value.byteLength;
    if (byteLength > maximumBodyBytes) {
      await reader.cancel("payload_too_large");
      throw new PayloadTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)) as unknown;
}

export async function POST(request: Request) {
  const fingerprint = await requestFingerprint();
  if (!checkRateLimit(`event:${fingerprint}`, 30, 60_000).allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maximumBodyBytes) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await readBoundedJson(request);
  } catch (error) {
    const status = error instanceof PayloadTooLargeError ? 413 : 400;
    const code = status === 413 ? "payload_too_large" : "invalid_event";
    return NextResponse.json({ error: code }, { status });
  }

  const parsed = clientEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }

  const participantId = await currentParticipantId();
  if (parsed.data.submissionId && !participantId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (parsed.data.event !== analyticsEvents.landingPageView && !participantId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (parsed.data.submissionId && participantId) {
    const owned = await database.submission.count({
      where: { id: parsed.data.submissionId, participantId }
    });
    if (!owned) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
  }

  await analytics.capture({
    name: parsed.data.event,
    participantId: participantId ?? undefined,
    submissionId: parsed.data.submissionId
  });

  return new NextResponse(null, { status: 202 });
}
