import { database, Prisma, type QueueJob } from "@lights-on/database";

export interface ClaimedJob {
  attempts: number;
  id: string;
  name: string;
  payload: unknown;
}

export interface JobQueue {
  claim(): Promise<ClaimedJob | null>;
  complete(jobId: string): Promise<void>;
  enqueue(
    name: string,
    jobKey: string,
    payload: Prisma.InputJsonValue
  ): Promise<string>;
  fail(jobId: string, retryable: boolean, errorCode: string): Promise<void>;
}

export class PostgresJobQueue implements JobQueue {
  async enqueue(
    name: string,
    jobKey: string,
    payload: Prisma.InputJsonValue
  ): Promise<string> {
    const job = await database.queueJob.upsert({
      create: { jobKey, name, payload },
      update: {},
      where: { jobKey }
    });
    return job.id;
  }

  async claim(): Promise<ClaimedJob | null> {
    const claimed = await database.$queryRaw<QueueJob[]>(Prisma.sql`
      UPDATE "QueueJob"
      SET
        "status" = 'RUNNING',
        "lockedAt" = NOW(),
        "attempts" = "attempts" + 1,
        "updatedAt" = NOW()
      WHERE "id" = (
        SELECT "id"
        FROM "QueueJob"
        WHERE "status" = 'AVAILABLE' AND "runAt" <= NOW()
        ORDER BY "runAt" ASC, "createdAt" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      RETURNING *
    `);

    const job = claimed[0];
    return job
      ? {
          attempts: job.attempts,
          id: job.id,
          name: job.name,
          payload: job.payload
        }
      : null;
  }

  async complete(jobId: string): Promise<void> {
    await database.queueJob.update({
      data: {
        lastError: null,
        lockedAt: null,
        status: "COMPLETED"
      },
      where: { id: jobId }
    });
  }

  async fail(jobId: string, retryable: boolean, errorCode: string): Promise<void> {
    const job = await database.queueJob.findUniqueOrThrow({
      select: { attempts: true, maxAttempts: true },
      where: { id: jobId }
    });
    const shouldRetry = retryable && job.attempts < job.maxAttempts;

    await database.queueJob.update({
      data: {
        lastError: errorCode.slice(0, 80),
        lockedAt: null,
        runAt: shouldRetry ? new Date(Date.now() + 5_000 * job.attempts) : undefined,
        status: shouldRetry ? "AVAILABLE" : "FAILED"
      },
      where: { id: jobId }
    });
  }
}

export const jobQueue: JobQueue = new PostgresJobQueue();
