-- CreateEnum
CREATE TYPE "SessionKind" AS ENUM ('PARTICIPANT', 'REVIEWER');
CREATE TYPE "SubmissionStatus" AS ENUM ('QUEUED', 'AWAITING_REVIEW', 'COMPLETED', 'FAILED');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'COMPLETED');
CREATE TYPE "QueueJobStatus" AS ENUM ('AVAILABLE', 'RUNNING', 'COMPLETED', 'FAILED');
CREATE TYPE "PaymentInterest" AS ENUM ('INTERESTED', 'UNSURE', 'NOT_INTERESTED');

-- CreateTable
CREATE TABLE "Participant" (
  "id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConsentRecord" (
  "id" UUID NOT NULL,
  "participantId" UUID NOT NULL,
  "version" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuthSession" (
  "id" UUID NOT NULL,
  "kind" "SessionKind" NOT NULL,
  "tokenDigest" TEXT NOT NULL,
  "participantId" UUID,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Submission" (
  "id" UUID NOT NULL,
  "participantId" UUID NOT NULL,
  "rawText" TEXT NOT NULL,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'QUEUED',
  "extractedVendor" TEXT,
  "extractedPurchasedAt" TIMESTAMP(3),
  "extractedTotalCents" INTEGER,
  "extractedCurrency" TEXT,
  "failureCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReviewJob" (
  "id" UUID NOT NULL,
  "submissionId" UUID NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "ReviewJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReceiptResult" (
  "id" UUID NOT NULL,
  "submissionId" UUID NOT NULL,
  "vendor" TEXT NOT NULL,
  "purchasedAt" TIMESTAMP(3) NOT NULL,
  "totalCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReceiptResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnalyticsEvent" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "participantId" UUID,
  "submissionId" UUID NOT NULL,
  "properties" JSONB,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentSignal" (
  "id" UUID NOT NULL,
  "participantId" UUID NOT NULL,
  "submissionId" UUID,
  "response" "PaymentInterest" NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentSignal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QueueJob" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "jobKey" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" "QueueJobStatus" NOT NULL DEFAULT 'AVAILABLE',
  "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedAt" TIMESTAMP(3),
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "maxAttempts" INTEGER NOT NULL DEFAULT 3,
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QueueJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");
CREATE UNIQUE INDEX "AuthSession_tokenDigest_key" ON "AuthSession"("tokenDigest");
CREATE INDEX "AuthSession_participantId_idx" ON "AuthSession"("participantId");
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");
CREATE INDEX "ConsentRecord_participantId_idx" ON "ConsentRecord"("participantId");
CREATE INDEX "Submission_participantId_createdAt_idx" ON "Submission"("participantId", "createdAt");
CREATE INDEX "Submission_status_idx" ON "Submission"("status");
CREATE UNIQUE INDEX "ReviewJob_submissionId_key" ON "ReviewJob"("submissionId");
CREATE INDEX "ReviewJob_status_createdAt_idx" ON "ReviewJob"("status", "createdAt");
CREATE UNIQUE INDEX "ReceiptResult_submissionId_key" ON "ReceiptResult"("submissionId");
CREATE INDEX "AnalyticsEvent_name_occurredAt_idx" ON "AnalyticsEvent"("name", "occurredAt");
CREATE INDEX "AnalyticsEvent_participantId_idx" ON "AnalyticsEvent"("participantId");
CREATE INDEX "AnalyticsEvent_submissionId_idx" ON "AnalyticsEvent"("submissionId");
CREATE INDEX "PaymentSignal_participantId_createdAt_idx" ON "PaymentSignal"("participantId", "createdAt");
CREATE UNIQUE INDEX "PaymentSignal_participantId_submissionId_key" ON "PaymentSignal"("participantId", "submissionId");
CREATE UNIQUE INDEX "QueueJob_jobKey_key" ON "QueueJob"("jobKey");
CREATE INDEX "QueueJob_status_runAt_createdAt_idx" ON "QueueJob"("status", "runAt", "createdAt");

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewJob" ADD CONSTRAINT "ReviewJob_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReceiptResult" ADD CONSTRAINT "ReceiptResult_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentSignal" ADD CONSTRAINT "PaymentSignal_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentSignal" ADD CONSTRAINT "PaymentSignal_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
