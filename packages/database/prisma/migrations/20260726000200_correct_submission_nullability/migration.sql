ALTER TABLE "AnalyticsEvent"
  ALTER COLUMN "submissionId" DROP NOT NULL;

ALTER TABLE "PaymentSignal"
  ALTER COLUMN "submissionId" SET NOT NULL;

