import { extractedReceiptSchema, type ExtractedReceipt } from "@lights-on/validation";

export interface AiModelProvider {
  extractReceipt(input: string): Promise<ExtractedReceipt>;
}

function capture(input: string, label: string): string | undefined {
  const expression = new RegExp(`^${label}\\s*:\\s*(.+)$`, "im");
  return expression.exec(input)?.[1]?.trim();
}

export class DeterministicFakeAiModelProvider implements AiModelProvider {
  extractReceipt(input: string): Promise<ExtractedReceipt> {
    const vendor = capture(input, "(?:vendor|merchant)") ?? "Unknown vendor";
    const purchasedAt = capture(input, "(?:date|purchased at)") ?? "2026-01-01";
    const totalLine = capture(input, "total") ?? "EUR 0.00";
    const totalMatch = /(?<currency>[A-Za-z]{3})\s*(?<amount>\d+(?:[.,]\d{1,2})?)/.exec(
      totalLine
    );
    const amount = Number((totalMatch?.groups?.amount ?? "0").replace(",", "."));

    return Promise.resolve(
      extractedReceiptSchema.parse({
        currency: (totalMatch?.groups?.currency ?? "EUR").toUpperCase(),
        purchasedAt,
        totalCents: Math.round(amount * 100),
        vendor
      })
    );
  }
}
