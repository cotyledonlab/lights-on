ALTER TABLE "QueueJob" ADD COLUMN "submissionId" UUID;

UPDATE "QueueJob" AS job
SET "submissionId" = submission."id"
FROM "Submission" AS submission
WHERE
  job."name" = 'receipt.extract'
  AND job."jobKey" = submission."id"::text;

DELETE FROM "QueueJob"
WHERE "name" = 'receipt.extract' AND "submissionId" IS NULL;

CREATE INDEX "QueueJob_submissionId_idx" ON "QueueJob"("submissionId");

ALTER TABLE "QueueJob"
ADD CONSTRAINT "QueueJob_submissionId_fkey"
FOREIGN KEY ("submissionId") REFERENCES "Submission"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
