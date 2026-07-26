import { describe, expect, it } from "vitest";

import { DeterministicFakeAiModelProvider } from "./index";

describe("deterministic fake extraction", () => {
  it("extracts a labelled synthetic record", async () => {
    const provider = new DeterministicFakeAiModelProvider();

    await expect(
      provider.extractReceipt(
        "Merchant: Harbour Books\nDate: 2026-07-05\nTotal: EUR 18.40"
      )
    ).resolves.toEqual({
      currency: "EUR",
      purchasedAt: "2026-07-05",
      totalCents: 1840,
      vendor: "Harbour Books"
    });
  });
});
