"use client";

import { useEffect, useRef } from "react";

type ClientEvent = "landing_page_view" | "result_viewed" | "submission_started";

export function EventBeacon({
  event,
  submissionId
}: {
  event: ClientEvent;
  submissionId?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) {
      return;
    }
    sent.current = true;

    void fetch("/api/events", {
      body: JSON.stringify({ event, submissionId }),
      headers: { "content-type": "application/json" },
      keepalive: true,
      method: "POST"
    });
  }, [event, submissionId]);

  return null;
}
