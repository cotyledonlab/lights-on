import { database } from "@lights-on/database";
import { jobQueue } from "@lights-on/queue";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { processNextJob } from "../../src/process-job";

describe("receipt extraction job", () => {
  beforeEach(async () => {
    await database.queueJob.deleteMany();
    await database.participant.deleteMany();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it("creates a human review job with deterministic fields", async () => {
    const participant = await database.participant.create({
      data: { email: "worker-test@example.test" }
    });
    const submission = await database.submission.create({
      data: {
        participantId: participant.id,
        rawText: "Merchant: Harbour Books\nDate: 2026-07-05\nTotal: EUR 18.40"
      }
    });
    await jobQueue.enqueue("receipt.extract", submission.id, {
      submissionId: submission.id
    });

    await expect(processNextJob()).resolves.toBe(true);

    await expect(
      database.submission.findUnique({
        include: { reviewJob: true },
        where: { id: submission.id }
      })
    ).resolves.toMatchObject({
      extractedCurrency: "EUR",
      extractedTotalCents: 1840,
      extractedVendor: "Harbour Books",
      reviewJob: { status: "PENDING" },
      status: "AWAITING_REVIEW"
    });
  });
});
