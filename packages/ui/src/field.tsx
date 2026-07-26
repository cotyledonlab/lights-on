import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  description?: string;
  error?: string;
  label: ReactNode;
}

export function Field({ description, error, id, label, ...props }: FieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      {description ? (
        <span className="field-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      <input
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
        className="input"
        id={id}
        {...props}
      />
      {error ? (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
