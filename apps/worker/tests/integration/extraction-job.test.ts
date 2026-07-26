import { database } from "@lights-on/database";
import { jobQueue, PostgresJobQueue } from "@lights-on/queue";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { processNextJob } from "../../src/process-job";

async function assertIsolatedTestSchema(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const configuredSchema = databaseUrl
    ? new URL(databaseUrl).searchParams.get("schema")
    : null;
  if (!configuredSchema?.endsWith("_test")) {
    throw new Error(
      "Refusing destructive fixtures: DATABASE_URL must select a schema ending in _test."
    );
  }

  const rows = await database.$queryRaw<Array<{ schema: string }>>`
    SELECT current_schema() AS schema
  `;
  if (rows[0]?.schema !== configuredSchema) {
    throw new Error(
      `Refusing destructive fixtures: connected schema ${rows[0]?.schema ?? "unknown"} does not match ${configuredSchema}.`
    );
  }
}

describe("receipt extraction job", () => {
  beforeAll(assertIsolatedTestSchema);

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

  it("reclaims a stale lock after a worker crash", async () => {
    const queue = new PostgresJobQueue(1_000);
    const jobId = await queue.enqueue("test.crash-recovery", "crash-recovery", {
      fixture: true
    });

    await expect(queue.claim()).resolves.toMatchObject({
      attempts: 1,
      id: jobId
    });
    await database.queueJob.update({
      data: { lockedAt: new Date(Date.now() - 2_000) },
      where: { id: jobId }
    });

    await expect(queue.claim()).resolves.toMatchObject({
      attempts: 2,
      id: jobId
    });
  });
});
