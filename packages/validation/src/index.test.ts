import { describe, expect, it } from "vitest";

import {
  earlyAccessSchema,
  reviewReceiptSchema,
  syntheticReceiptSchema
} from "./index";

describe("input validation", () => {
  it("requires explicit early-access consent", () => {
    expect(earlyAccessSchema.safeParse({ email: "person@example.test" }).success).toBe(
      false
    );
  });

  it("rejects short synthetic records", () => {
    expect(syntheticReceiptSchema.safeParse({ rawText: "short" }).success).toBe(false);
  });

  it("normalizes the reviewer currency", () => {
    const result = reviewReceiptSchema.parse({
      currency: "eur",
      purchasedAt: "2026-07-01",
      total: "12.50",
      vendor: "The Test Shop"
    });

    expect(result.currency).toBe("EUR");
    expect(result.total).toBe(12.5);
  });
});
