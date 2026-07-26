import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EventBeacon } from "@/components/event-beacon";
import { SyntheticReceiptForm } from "@/components/synthetic-receipt-form";
import { currentParticipantId } from "@/lib/session";

export const metadata: Metadata = { title: "Submit a synthetic receipt" };

export default async function SubmitPage() {
  if (!(await currentParticipantId())) {
    redirect("/#early-access");
  }

  return (
    <div className="content-shell">
      <EventBeacon event="submission_started" />
      <section className="panel">
        <p className="eyebrow">Step 1 of 3</p>
        <h1>Give us a tidy fake mess.</h1>
        <p className="panel-intro">
          The worker will make a deterministic first pass, then place the result in the
          reviewer queue. Nothing leaves your local machine.
        </p>
        <div className="notice">
          <strong>Synthetic data only.</strong> This phase is designed to test the
          workflow, not real document handling.
        </div>
        <SyntheticReceiptForm />
      </section>
    </div>
  );
}
