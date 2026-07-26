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

export async function POST(request: Request) {
  const fingerprint = await requestFingerprint();
  if (!checkRateLimit(`event:${fingerprint}`, 30, 60_000).allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 1_024) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const parsed = clientEventSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }

  const participantId = await currentParticipantId();
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
