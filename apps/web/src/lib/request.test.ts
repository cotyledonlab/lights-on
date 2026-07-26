import { describe, expect, it } from "vitest";

import { fingerprintFromHeaders } from "./request";

describe("request fingerprint", () => {
  it("ignores spoofable forwarding headers unless a proxy is explicitly trusted", () => {
    const firstRequest = new Headers({
      "x-forwarded-for": "198.51.100.10",
      "x-real-ip": "198.51.100.11"
    });
    const secondRequest = new Headers({
      "x-forwarded-for": "203.0.113.20",
      "x-real-ip": "203.0.113.21"
    });

    expect(fingerprintFromHeaders(firstRequest, false)).toBe("untrusted-direct");
    expect(fingerprintFromHeaders(secondRequest, false)).toBe("untrusted-direct");
  });

  it("uses the first forwarded address behind an explicitly trusted proxy", () => {
    const requestHeaders = new Headers({
      "x-forwarded-for": "198.51.100.10, 10.0.0.2",
      "x-real-ip": "198.51.100.11"
    });

    expect(fingerprintFromHeaders(requestHeaders, true)).toBe("198.51.100.10");
  });
});
