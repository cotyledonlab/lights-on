"use client";

import { useEffect } from "react";

type ClientEvent = "landing_page_view" | "result_viewed" | "submission_started";

export function EventBeacon({
  event,
  submissionId
}: {
  event: ClientEvent;
  submissionId?: string;
}) {
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/events", {
      body: JSON.stringify({ event, submissionId }),
      headers: { "content-type": "application/json" },
      keepalive: true,
      method: "POST",
      signal: controller.signal
    });
    return () => controller.abort();
  }, [event, submissionId]);

  return null;
}
