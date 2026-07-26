import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  capture: vi.fn(),
  checkRateLimit: vi.fn(() => ({ allowed: true })),
  currentParticipantId: vi.fn<() => Promise<string | null>>().mockResolvedValue(null),
  requestFingerprint: vi
    .fn<() => Promise<string>>()
    .mockResolvedValue("test-fingerprint"),
  submissionCount: vi.fn<() => Promise<number>>().mockResolvedValue(0)
}));

vi.mock("@lights-on/database", () => ({
  database: { submission: { count: mocks.submissionCount } }
}));
vi.mock("@lights-on/product-analytics", () => ({
  analytics: { capture: mocks.capture },
  analyticsEvents: {
    landingPageView: "landing_page_view",
    resultViewed: "result_viewed",
    submissionStarted: "submission_started"
  }
}));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: mocks.checkRateLimit }));
vi.mock("@/lib/request", () => ({ requestFingerprint: mocks.requestFingerprint }));
vi.mock("@/lib/session", () => ({
  currentParticipantId: mocks.currentParticipantId
}));

import { POST } from "@/app/api/events/route";

function eventRequest(body: BodyInit): Request {
  return new Request("http://localhost/api/events", { body, method: "POST" });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.checkRateLimit.mockReturnValue({ allowed: true });
  mocks.currentParticipantId.mockResolvedValue(null);
});

describe("analytics event endpoint", () => {
  it("rejects an oversized streamed body without Content-Length", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("x".repeat(1_025)));
        controller.close();
      }
    });
    const request = new Request("http://localhost/api/events", {
      body: stream,
      duplex: "half",
      method: "POST"
    } as RequestInit & { duplex: "half" });

    const response = await POST(request);

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({ error: "payload_too_large" });
  });

  it("maps malformed JSON to a client error", async () => {
    const response = await POST(eventRequest("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid_event" });
  });

  it("rejects an anonymous submission association", async () => {
    const response = await POST(
      eventRequest(
        JSON.stringify({
          event: "landing_page_view",
          submissionId: "a58f1f18-a94c-4c03-8869-1b458e957fc2"
        })
      )
    );

    expect(response.status).toBe(401);
    expect(mocks.capture).not.toHaveBeenCalled();
  });

  it("accepts an anonymous landing event without a submission", async () => {
    const response = await POST(
      eventRequest(JSON.stringify({ event: "landing_page_view" }))
    );

    expect(response.status).toBe(202);
    expect(mocks.capture).toHaveBeenCalledWith({
      name: "landing_page_view",
      participantId: undefined,
      submissionId: undefined
    });
  });
});
