import { z } from "zod";

export const earlyAccessSchema = z.object({
  consent: z.literal("on", {
    error: "Consent is required to join this experiment."
  }),
  email: z.email("Enter a valid email address.").max(254)
});

export const syntheticReceiptSchema = z.object({
  rawText: z
    .string()
    .trim()
    .min(20, "Add at least 20 characters of synthetic purchase data.")
    .max(4_000, "Synthetic purchase data must be 4,000 characters or fewer.")
});

export const reviewReceiptSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(3, "Use a three-letter currency code.")
    .transform((value) => value.toUpperCase()),
  notes: z.string().trim().max(500).optional(),
  purchasedAt: z.iso.date(),
  total: z.coerce.number().positive("Total must be greater than zero.").max(1_000_000),
  vendor: z.string().trim().min(1).max(120)
});

export const paymentInterestSchema = z.object({
  response: z.enum(["INTERESTED", "UNSURE", "NOT_INTERESTED"])
});

export const extractedReceiptSchema = z.object({
  currency: z.string().length(3),
  purchasedAt: z.iso.date(),
  totalCents: z.number().int().nonnegative(),
  vendor: z.string().min(1)
});

export type ExtractedReceipt = z.infer<typeof extractedReceiptSchema>;
