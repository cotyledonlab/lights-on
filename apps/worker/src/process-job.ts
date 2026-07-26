import { database } from "@lights-on/database";
import { DeterministicFakeAiModelProvider } from "@lights-on/extraction";
import { logger } from "@lights-on/observability";
import { jobQueue, type ClaimedJob, type JobQueue } from "@lights-on/queue";
import { z } from "zod";

const extractionPayloadSchema = z.object({
  submissionId: z.uuid()
});

const extractor = new DeterministicFakeAiModelProvider();

async function processExtraction(job: ClaimedJob): Promise<void> {
  const payload = extractionPayloadSchema.parse(job.payload);
  const submission = await database.submission.findUnique({
    where: { id: payload.submissionId }
  });

  if (!submission || submission.status !== "QUEUED") {
    return;
  }

  const extracted = await extractor.extractReceipt(submission.rawText);
  await database.$transaction([
    database.submission.update({
      data: {
        extractedCurrency: extracted.currency,
        extractedPurchasedAt: new Date(`${extracted.purchasedAt}T12:00:00.000Z`),
        extractedTotalCents: extracted.totalCents,
        extractedVendor: extracted.vendor,
        status: "AWAITING_REVIEW"
      },
      where: { id: submission.id }
    }),
    database.reviewJob.upsert({
      create: { submissionId: submission.id },
      update: {},
      where: { submissionId: submission.id }
    })
  ]);
}

export async function processNextJob(queue: JobQueue = jobQueue): Promise<boolean> {
  const job = await queue.claim();
  if (!job) {
    return false;
  }

  try {
    if (job.name !== "receipt.extract") {
      await queue.fail(job.id, job.attempts, false, "unsupported_job");
      return true;
    }

    await processExtraction(job);
    const completion = await queue.complete(job.id, job.attempts);
    if (completion === "stale_or_cancelled") {
      logger.info("Queue job no longer owns its lease", {
        attempt: job.attempts,
        jobId: job.id,
        jobName: job.name,
        status: "stale_or_cancelled"
      });
      return true;
    }
    logger.info("Queue job completed", {
      attempt: job.attempts,
      jobId: job.id,
      jobName: job.name,
      status: "completed"
    });
  } catch (error) {
    const retryable = !(error instanceof z.ZodError);
    const failure = await queue.fail(
      job.id,
      job.attempts,
      retryable,
      error instanceof z.ZodError ? "invalid_payload" : "processing_failed"
    );
    if (failure.outcome === "stale_or_cancelled") {
      logger.info("Queue job failure ignored after lease loss or cancellation", {
        attempt: job.attempts,
        jobId: job.id,
        jobName: job.name,
        status: failure.outcome
      });
      return true;
    }
    logger.error("Queue job failed", {
      attempt: job.attempts,
      errorCode: error instanceof z.ZodError ? "invalid_payload" : "processing_failed",
      jobId: job.id,
      jobName: job.name,
      status: failure.outcome
    });
  }

  return true;
}
