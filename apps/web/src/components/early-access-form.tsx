"use client";

import { Field } from "@lights-on/ui";
import { useActionState } from "react";

import { joinEarlyAccessAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";

import { SubmitButton } from "./submit-button";

export function EarlyAccessForm() {
  const [state, action] = useActionState(joinEarlyAccessAction, initialActionState);

  return (
    <form action={action} className="form-stack">
      <Field
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
        id="email"
        label="Email address"
        name="email"
        placeholder="you@example.com"
        required
        type="email"
      />
      <label className="checkbox-row" htmlFor="consent">
        <input id="consent" name="consent" required type="checkbox" />
        <span>
          I consent to this local experiment storing my email, synthetic input, and
          product-usage events. I can delete them at any time.
        </span>
      </label>
      {state.fieldErrors?.consent?.[0] ? (
        <p className="field-error" role="alert">
          {state.fieldErrors.consent[0]}
        </p>
      ) : null}
      {state.message ? (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="form-actions">
        <SubmitButton pendingLabel="Joining…">Join and test the flow</SubmitButton>
        <span>No marketing provider. No real receipt required.</span>
      </div>
    </form>
  );
}
