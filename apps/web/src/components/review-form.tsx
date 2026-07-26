"use client";

import { Field } from "@lights-on/ui";
import { useActionState } from "react";

import { completeReviewAction } from "@/app/actions";
import { initialActionState } from "@/lib/action-state";

import { SubmitButton } from "./submit-button";

interface ReviewFormProps {
  currency: string;
  jobId: string;
  purchasedAt: string;
  total: string;
  vendor: string;
}

export function ReviewForm(props: ReviewFormProps) {
  const [state, action] = useActionState(completeReviewAction, initialActionState);

  return (
    <form action={action} className="form-stack">
      <input name="jobId" type="hidden" value={props.jobId} />
      <Field
        defaultValue={props.vendor}
        error={state.fieldErrors?.vendor?.[0]}
        id="vendor"
        label="Vendor"
        name="vendor"
        required
      />
      <Field
        defaultValue={props.purchasedAt}
        error={state.fieldErrors?.purchasedAt?.[0]}
        id="purchasedAt"
        label="Purchase date"
        name="purchasedAt"
        required
        type="date"
      />
      <Field
        defaultValue={props.total}
        error={state.fieldErrors?.total?.[0]}
        id="total"
        inputMode="decimal"
        label="Total"
        min="0.01"
        name="total"
        required
        step="0.01"
        type="number"
      />
      <Field
        defaultValue={props.currency}
        error={state.fieldErrors?.currency?.[0]}
        id="currency"
        label="Currency"
        maxLength={3}
        minLength={3}
        name="currency"
        required
      />
      <label className="field" htmlFor="notes">
        <span className="field-label">Reviewer notes</span>
        <textarea
          className="textarea"
          id="notes"
          maxLength={500}
          name="notes"
          placeholder="What did the human change, if anything?"
        />
      </label>
      {state.message ? (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <SubmitButton pendingLabel="Saving checked result…">
        Complete human review
      </SubmitButton>
    </form>
  );
}
