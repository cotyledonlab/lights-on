import { database } from "@lights-on/database";
import type { Metadata } from "next";
import Link from "next/link";

import { reviewerSignOutAction } from "@/app/actions";
import { ReviewerLoginForm } from "@/components/reviewer-login-form";
import { SubmitButton } from "@/components/submit-button";
import { reviewerIsAuthenticated } from "@/lib/session";

export const metadata: Metadata = { title: "Review queue" };

export default async function ReviewQueuePage({
  searchParams
}: {
  searchParams: Promise<{ completed?: string }>;
}) {
  if (!(await reviewerIsAuthenticated())) {
    return (
      <div className="content-shell">
        <section className="panel">
          <p className="eyebrow">Authorized humans only</p>
          <h1>Reviewer sign in.</h1>
          <p className="panel-intro">
            This Phase 1 control uses the generated local code in your ignored
            <code> .env</code> file. It is not production authentication.
          </p>
          <ReviewerLoginForm />
        </section>
      </div>
    );
  }

  const jobs = await database.reviewJob.findMany({
    include: { submission: { select: { createdAt: true } } },
    orderBy: { createdAt: "asc" },
    where: { status: "PENDING" }
  });
  const { completed } = await searchParams;

  return (
    <div className="content-shell">
      <section className="panel">
        <p className="eyebrow">Human fulfilment queue</p>
        <h1>Review the machine’s homework.</h1>
        {completed ? (
          <p className="success-note" role="status">
            Review completed. The participant can now view the result.
          </p>
        ) : null}
        {jobs.length ? (
          <ul className="job-list">
            {jobs.map((job, index) => (
              <li key={job.id}>
                <Link href={`/review/${job.id}`}>
                  <span>
                    <strong>Review {index + 1}</strong>
                    <br />
                    <small>{job.submission.createdAt.toLocaleString()}</small>
                  </span>
                  <span aria-hidden="true">Open →</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="notice">No pending review jobs.</p>
        )}
        <form action={reviewerSignOutAction}>
          <SubmitButton intent="secondary">Sign out reviewer</SubmitButton>
        </form>
      </section>
    </div>
  );
}
