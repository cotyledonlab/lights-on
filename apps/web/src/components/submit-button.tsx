"use client";

import { Button } from "@lights-on/ui";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  intent = "primary",
  pendingLabel = "Working…"
}: {
  children: React.ReactNode;
  intent?: "primary" | "secondary" | "danger";
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} intent={intent} type="submit">
      {pending ? pendingLabel : children}
    </Button>
  );
}
