import { afterEach, describe, expect, it } from "vitest";

import { checkRateLimit, resetRateLimitsForTests } from "./rate-limit";

afterEach(resetRateLimitsForTests);

describe("rate limiter", () => {
  it("blocks requests over the limit until the window resets", () => {
    expect(checkRateLimit("signup:local", 1, 1_000, 100).allowed).toBe(true);
    expect(checkRateLimit("signup:local", 1, 1_000, 200).allowed).toBe(false);
    expect(checkRateLimit("signup:local", 1, 1_000, 1_101).allowed).toBe(true);
  });
});
