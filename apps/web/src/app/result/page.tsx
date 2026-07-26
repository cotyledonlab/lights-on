import { database } from "@lights-on/database";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EventBeacon } from "@/components/event-beacon";
import { PaymentInterestForm } from "@/components/payment-interest-form";
import { currentParticipantId } from "@/lib/session";

export const metadata: Metadata = { title: "Your checked result" };

export const dynamic = "force-dynamic";

export default async function ResultPage() {
  const participantId = await currentParticipantId();
  if (!participantId) {
    redirect("/#early-access");
  }

  const submission = await database.submission.findFirst({
    include: { result: true },
    orderBy: { createdAt: "desc" },
    where: { participantId }
  });

  if (!submission) {
    redirect("/submit");
  }

  if (!submission.result) {
    return (
      <div className="content-shell">
        <section className="panel">
          <p className="eyebrow">Step 2 of 3</p>
          <h1>Your record is in the queue.</h1>
          <p className="panel-intro">
            Current status:{" "}
            <span className="status-chip">
              {submission.status.replaceAll("_", " ")}
            </span>
          </p>
          <p className="notice">
            Run the worker and complete the local reviewer step, then refresh this page.
          </p>
          <div className="inline-actions">
            <Link className="button button-primary" href="/result">
              Refresh result
            </Link>
            <Link className="button button-secondary" href="/review">
              Open reviewer queue
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const formattedTotal = new Intl.NumberFormat("en-IE", {
    currency: submission.result.currency,
    style: "currency"
  }).format(submission.result.totalCents / 100);

  return (
    <div className="content-shell">
      <EventBeacon event="result_viewed" submissionId={submission.id} />
      <section className="panel">
        <p className="eyebrow">Step 3 of 3 · Human checked</p>
        <h1>Your clean record.</h1>
        <dl className="record-grid">
          <div>
            <dt>Vendor</dt>
            <dd>{submission.result.vendor}</dd>
          </div>
          <div>
            <dt>Purchase date</dt>
            <dd>
              {submission.result.purchasedAt.toLocaleDateString("en-IE", {
                dateStyle: "medium",
                timeZone: "UTC"
              })}
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{formattedTotal}</dd>
          </div>
          <div>
            <dt>Currency</dt>
            <dd>{submission.result.currency}</dd>
          </div>
        </dl>
        {submission.result.notes ? (
          <p className="notice">
            <strong>Reviewer note:</strong> {submission.result.notes}
          </p>
        ) : null}
        <PaymentInterestForm />
      </section>
    </div>
  );
}
