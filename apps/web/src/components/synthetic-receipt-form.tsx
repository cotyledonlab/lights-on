"use client";

import { useActionState } from "react";

import { submitSyntheticReceiptAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";

import { SubmitButton } from "./submit-button";

const example =
  "Merchant: Harbour Books\nDate: 2026-07-05\nTotal: EUR 18.40\nItem: Field Notes";

export function SyntheticReceiptForm() {
  const [state, action] = useActionState(
    submitSyntheticReceiptAction,
    initialActionState
  );

  return (
    <form action={action} className="form-stack">
      <label className="field" htmlFor="rawText">
        <span className="field-label">Synthetic purchase record</span>
        <span className="field-description" id="rawText-description">
          Use labelled text only. Do not paste a real receipt, card number, address, or
          other personal data.
        </span>
        <textarea
          aria-describedby="rawText-description rawText-error"
          aria-invalid={Boolean(state.fieldErrors?.rawText)}
          className="textarea"
          defaultValue={example}
          id="rawText"
          maxLength={4_000}
          name="rawText"
          required
        />
        {state.fieldErrors?.rawText?.[0] ? (
          <span className="field-error" id="rawText-error" role="alert">
            {state.fieldErrors.rawText[0]}
          </span>
        ) : null}
      </label>
      {state.message ? (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <SubmitButton pendingLabel="Creating review…">
        Submit for human review
      </SubmitButton>
    </form>
  );
}
