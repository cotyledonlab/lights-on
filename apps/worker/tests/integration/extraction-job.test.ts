import { database } from "@lights-on/database";
import {
  jobQueue,
  PostgresJobQueue,
  type ClaimedJob,
  type JobQueue
} from "@lights-on/queue";
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
    await jobQueue.enqueue(
      "receipt.extract",
      submission.id,
      {
        submissionId: submission.id
      },
      {
        submissionId: submission.id
      }
    );

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

    const firstClaim = await queue.claim();
    expect(firstClaim).toMatchObject({
      attempts: 1,
      id: jobId
    });
    await database.queueJob.update({
      data: { lockedAt: new Date(Date.now() - 2_000) },
      where: { id: jobId }
    });

    const secondClaim = await queue.claim();
    expect(secondClaim).toMatchObject({
      attempts: 2,
      id: jobId
    });

    await expect(
      queue.complete(jobId, (firstClaim as ClaimedJob).attempts)
    ).resolves.toBe("stale_or_cancelled");
    await expect(
      queue.fail(jobId, (firstClaim as ClaimedJob).attempts, false, "stale_worker")
    ).resolves.toEqual({ outcome: "stale_or_cancelled" });
    await expect(
      database.queueJob.findUnique({ where: { id: jobId } })
    ).resolves.toMatchObject({
      attempts: 2,
      status: "RUNNING"
    });
    await expect(
      queue.complete(jobId, (secondClaim as ClaimedJob).attempts)
    ).resolves.toBe("applied");
  });

  it("cascades a linked queue job created concurrently with participant deletion", async () => {
    const participant = await database.participant.create({
      data: { email: "concurrent-delete@example.test" }
    });
    let signalSubmissionCreated = () => {};
    const submissionCreated = new Promise<void>((resolve) => {
      signalSubmissionCreated = resolve;
    });
    let releaseSubmission = () => {};
    const mayFinishSubmission = new Promise<void>((resolve) => {
      releaseSubmission = resolve;
    });

    const createSubmission = database.$transaction(async (transaction) => {
      const submission = await transaction.submission.create({
        data: {
          participantId: participant.id,
          rawText: "Merchant: Concurrent Shop\nDate: 2026-07-05\nTotal: EUR 4.20"
        }
      });
      signalSubmissionCreated();
      await mayFinishSubmission;
      await jobQueue.enqueue(
        "receipt.extract",
        submission.id,
        { submissionId: submission.id },
        { submissionId: submission.id, transaction }
      );
      return submission;
    });

    await submissionCreated;
    const deleteParticipant = Promise.resolve(
      database.participant.deleteMany({ where: { id: participant.id } })
    );
    await new Promise<void>((resolve) => setImmediate(resolve));
    releaseSubmission();
    const [submission] = await Promise.all([createSubmission, deleteParticipant]);

    await expect(
      database.participant.count({ where: { id: participant.id } })
    ).resolves.toBe(0);
    await expect(
      database.submission.count({ where: { id: submission.id } })
    ).resolves.toBe(0);
    await expect(
      database.queueJob.count({ where: { submissionId: submission.id } })
    ).resolves.toBe(0);
  });

  it("treats deletion during processing as cancellation without throwing", async () => {
    const participant = await database.participant.create({
      data: { email: "in-flight-delete@example.test" }
    });
    const submission = await database.submission.create({
      data: {
        participantId: participant.id,
        rawText: "Merchant: Vanishing Shop\nDate: 2026-07-05\nTotal: EUR 7.20"
      }
    });
    await jobQueue.enqueue(
      "receipt.extract",
      submission.id,
      { submissionId: submission.id },
      { submissionId: submission.id }
    );
    const deletingQueue: JobQueue = {
      claim: () => jobQueue.claim(),
      complete: async (jobId, expectedAttempt) => {
        await database.participant.deleteMany({ where: { id: participant.id } });
        return jobQueue.complete(jobId, expectedAttempt);
      },
      enqueue: (name, jobKey, payload, options) =>
        jobQueue.enqueue(name, jobKey, payload, options),
      fail: (jobId, expectedAttempt, retryable, errorCode) =>
        jobQueue.fail(jobId, expectedAttempt, retryable, errorCode)
    };

    await expect(processNextJob(deletingQueue)).resolves.toBe(true);
    await expect(
      database.queueJob.count({ where: { submissionId: submission.id } })
    ).resolves.toBe(0);
  });

  it("marks the submission failed when a job reaches a terminal failure", async () => {
    const participant = await database.participant.create({
      data: { email: "terminal-failure@example.test" }
    });
    const submission = await database.submission.create({
      data: {
        participantId: participant.id,
        rawText: "Merchant: Invalid Payload Shop"
      }
    });
    await jobQueue.enqueue(
      "receipt.extract",
      submission.id,
      { invalid: true },
      { submissionId: submission.id }
    );

    await expect(processNextJob()).resolves.toBe(true);

    await expect(
      database.submission.findUnique({ where: { id: submission.id } })
    ).resolves.toMatchObject({
      failureCode: "invalid_payload",
      status: "FAILED"
    });
    await expect(
      database.queueJob.findFirst({ where: { submissionId: submission.id } })
    ).resolves.toMatchObject({
      lastError: "invalid_payload",
      status: "FAILED"
    });
  });
});
