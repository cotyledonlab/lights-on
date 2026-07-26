import { database, Prisma, type QueueJob } from "@lights-on/database";

export interface ClaimedJob {
  attempts: number;
  id: string;
  name: string;
  payload: unknown;
  submissionId: string | null;
}

export interface EnqueueOptions {
  submissionId?: string;
  transaction?: Prisma.TransactionClient;
}

export type LeaseMutationResult = "applied" | "stale_or_cancelled";

export type FailureResult =
  { outcome: "failed" | "retrying" } | { outcome: "stale_or_cancelled" };

interface FailedQueueJob {
  status: "AVAILABLE" | "FAILED";
  submissionId: string | null;
}

export interface JobQueue {
  claim(): Promise<ClaimedJob | null>;
  complete(jobId: string, expectedAttempt: number): Promise<LeaseMutationResult>;
  enqueue(
    name: string,
    jobKey: string,
    payload: Prisma.InputJsonValue,
    options?: EnqueueOptions
  ): Promise<string>;
  fail(
    jobId: string,
    expectedAttempt: number,
    retryable: boolean,
    errorCode: string
  ): Promise<FailureResult>;
}

export class PostgresJobQueue implements JobQueue {
  constructor(private readonly lockTimeoutMs = 5 * 60_000) {}

  async enqueue(
    name: string,
    jobKey: string,
    payload: Prisma.InputJsonValue,
    options: EnqueueOptions = {}
  ): Promise<string> {
    const client = options.transaction ?? database;
    const job = await client.queueJob.upsert({
      create: { jobKey, name, payload, submissionId: options.submissionId },
      update: {},
      where: { jobKey }
    });
    return job.id;
  }

  async claim(): Promise<ClaimedJob | null> {
    const staleBefore = new Date(Date.now() - this.lockTimeoutMs);
    const claimed = await database.$transaction(async (transaction) => {
      const expired = await transaction.$queryRaw<
        Array<{ submissionId: string | null }>
      >(Prisma.sql`
        UPDATE "QueueJob"
        SET
          "status" = 'FAILED',
          "lockedAt" = NULL,
          "lastError" = 'stale_lock_max_attempts',
          "updatedAt" = NOW()
        WHERE
          "status" = 'RUNNING'
          AND "lockedAt" <= ${staleBefore}
          AND "attempts" >= "maxAttempts"
        RETURNING "submissionId"
      `);
      const failedSubmissionIds = expired.flatMap(({ submissionId }) =>
        submissionId ? [submissionId] : []
      );
      if (failedSubmissionIds.length > 0) {
        await transaction.submission.updateMany({
          data: {
            failureCode: "stale_lock_max_attempts",
            status: "FAILED"
          },
          where: {
            id: { in: failedSubmissionIds },
            status: "QUEUED"
          }
        });
      }

      return transaction.$queryRaw<QueueJob[]>(Prisma.sql`
        UPDATE "QueueJob"
        SET
          "status" = 'RUNNING',
          "lockedAt" = NOW(),
          "attempts" = "attempts" + 1,
          "lastError" = CASE
            WHEN "status" = 'RUNNING' THEN 'stale_lock_reclaimed'
            ELSE "lastError"
          END,
          "updatedAt" = NOW()
        WHERE "id" = (
          SELECT "id"
          FROM "QueueJob"
          WHERE
            (
              "status" = 'AVAILABLE'
              AND "runAt" <= NOW()
            )
            OR (
              "status" = 'RUNNING'
              AND "lockedAt" <= ${staleBefore}
              AND "attempts" < "maxAttempts"
            )
          ORDER BY "runAt" ASC, "createdAt" ASC
          FOR UPDATE SKIP LOCKED
          LIMIT 1
        )
        RETURNING *
      `);
    });

    const job = claimed[0];
    return job
      ? {
          attempts: job.attempts,
          id: job.id,
          name: job.name,
          payload: job.payload,
          submissionId: job.submissionId
        }
      : null;
  }

  async complete(jobId: string, expectedAttempt: number): Promise<LeaseMutationResult> {
    const result = await database.queueJob.updateMany({
      data: {
        lastError: null,
        lockedAt: null,
        status: "COMPLETED"
      },
      where: {
        attempts: expectedAttempt,
        id: jobId,
        status: "RUNNING"
      }
    });
    return result.count === 1 ? "applied" : "stale_or_cancelled";
  }

  async fail(
    jobId: string,
    expectedAttempt: number,
    retryable: boolean,
    errorCode: string
  ): Promise<FailureResult> {
    return database.$transaction(async (transaction) => {
      const failed = await transaction.$queryRaw<FailedQueueJob[]>(Prisma.sql`
        UPDATE "QueueJob"
        SET
          "lastError" = ${errorCode.slice(0, 80)},
          "lockedAt" = NULL,
          "runAt" = CASE
            WHEN ${retryable} AND "attempts" < "maxAttempts"
              THEN NOW() + (INTERVAL '5 seconds' * "attempts")
            ELSE "runAt"
          END,
          "status" = CASE
            WHEN ${retryable} AND "attempts" < "maxAttempts"
              THEN 'AVAILABLE'::"QueueJobStatus"
            ELSE 'FAILED'::"QueueJobStatus"
          END,
          "updatedAt" = NOW()
        WHERE
          "id" = ${jobId}::uuid
          AND "status" = 'RUNNING'
          AND "attempts" = ${expectedAttempt}
        RETURNING "status"::text AS "status", "submissionId"
      `);
      const job = failed[0];
      if (!job) {
        return { outcome: "stale_or_cancelled" };
      }

      if (job.status === "FAILED" && job.submissionId) {
        await transaction.submission.updateMany({
          data: {
            failureCode: errorCode.slice(0, 80),
            status: "FAILED"
          },
          where: {
            id: job.submissionId,
            status: "QUEUED"
          }
        });
      }

      return { outcome: job.status === "FAILED" ? "failed" : "retrying" };
    });
  }
}

export const jobQueue: JobQueue = new PostgresJobQueue();
