import { database } from "@lights-on/database";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ReviewForm } from "@/components/review-form";
import { reviewerIsAuthenticated } from "@/lib/session";

export const metadata: Metadata = { title: "Check extracted receipt" };

export default async function ReviewPage({
  params
}: {
  params: Promise<{ jobId: string }>;
}) {
  if (!(await reviewerIsAuthenticated())) {
    redirect("/review");
  }

  const { jobId } = await params;
  const job = await database.reviewJob.findUnique({
    include: { submission: true },
    where: { id: jobId }
  });
  if (!job) {
    notFound();
  }
  if (
    !job.submission.extractedVendor ||
    !job.submission.extractedPurchasedAt ||
    job.submission.extractedTotalCents === null ||
    !job.submission.extractedCurrency
  ) {
    throw new Error("Review job is missing extracted fields.");
  }

  return (
    <div className="content-shell">
      <section className="panel">
        <p className="eyebrow">Step 2 of 3</p>
        <h1>Check every field.</h1>
        <p className="panel-intro">
          The source below is synthetic. Correct the extracted values before releasing
          the result.
        </p>
        <pre className="code-sample">{job.submission.rawText}</pre>
        <ReviewForm
          currency={job.submission.extractedCurrency}
          jobId={job.id}
          purchasedAt={job.submission.extractedPurchasedAt.toISOString().slice(0, 10)}
          total={(job.submission.extractedTotalCents / 100).toFixed(2)}
          vendor={job.submission.extractedVendor}
        />
      </section>
    </div>
  );
}
