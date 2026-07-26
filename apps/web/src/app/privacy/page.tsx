import type { Metadata } from "next";

import { deleteParticipantDataAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="content-shell">
      <article className="panel">
        <p className="eyebrow">Phase 1 privacy</p>
        <h1>Small data, clear purpose.</h1>
        <p className="panel-intro">
          This local experiment stores your email, consent, synthetic purchase text,
          workflow state, structured result, product events, and any payment-interest
          response.
        </p>
        <h2>What not to submit</h2>
        <p>
          Do not use a real receipt, card number, home address, account number, or other
          personal data. The deterministic example is enough to test the journey.
        </p>
        <h2>Deletion</h2>
        <p>
          Deleting your experiment data removes your participant record and its related
          consent, sessions, submissions, jobs, results, analytics, and payment signals
          from local PostgreSQL.
        </p>
        <form action={deleteParticipantDataAction}>
          <SubmitButton intent="danger" pendingLabel="Deleting…">
            Delete my experiment data
          </SubmitButton>
        </form>
      </article>
    </div>
  );
}
