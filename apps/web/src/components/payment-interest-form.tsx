"use client";

import { useActionState } from "react";

import { recordPaymentInterestAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";

import { SubmitButton } from "./submit-button";

export function PaymentInterestForm() {
  const [state, action] = useActionState(
    recordPaymentInterestAction,
    initialActionState
  );
  return (
    <form action={action} className="form-stack">
      <fieldset className="form-stack">
        <legend>
          Would this be worth €5 per month if it handled your real records?
        </legend>
        {[
          ["INTERESTED", "Yes, I would seriously consider paying"],
          ["UNSURE", "Maybe, but I need more proof"],
          ["NOT_INTERESTED", "No, not for this outcome"]
        ].map(([value, label]) => (
          <label className="checkbox-row" key={value}>
            <input name="response" required type="radio" value={value} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      {state.fieldErrors?.response?.[0] ? (
        <p className="field-error" role="alert">
          {state.fieldErrors.response[0]}
        </p>
      ) : null}
      {state.message ? (
        <p className="success-note" role="status">
          {state.message}
        </p>
      ) : null}
      <SubmitButton intent="secondary" pendingLabel="Recording…">
        Record my response
      </SubmitButton>
    </form>
  );
}
