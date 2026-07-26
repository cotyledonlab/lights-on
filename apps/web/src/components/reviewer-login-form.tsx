"use client";

import { Field } from "@lights-on/ui";
import { useActionState } from "react";

import { reviewerSignInAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";

import { SubmitButton } from "./submit-button";

export function ReviewerLoginForm() {
  const [state, action] = useActionState(reviewerSignInAction, initialActionState);
  return (
    <form action={action} className="form-stack">
      <Field
        autoComplete="current-password"
        id="code"
        label="Local reviewer access code"
        name="code"
        required
        type="password"
      />
      {state.message ? (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <SubmitButton pendingLabel="Checking…">Open review queue</SubmitButton>
    </form>
  );
}
