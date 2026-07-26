"use client";

import { Button } from "@lights-on/ui";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void error.digest;
  }, [error]);

  return (
    <div className="content-shell">
      <section className="panel">
        <p className="eyebrow">Something stopped safely</p>
        <h1>That did not complete.</h1>
        <p className="panel-intro">
          No input details were logged. Check the local service status, then try the
          action again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </section>
    </div>
  );
}
