import { database } from "@lights-on/database";
import { logger } from "@lights-on/observability";

import { processNextJob } from "./process-job";

let running = true;

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    running = false;
  });
}

async function main(): Promise<void> {
  logger.info("Worker started", { event: "worker_started" });

  while (running) {
    const processed = await processNextJob();
    if (!processed) {
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
  }

  await database.$disconnect();
  logger.info("Worker stopped", { event: "worker_stopped" });
}

main().catch((error: unknown) => {
  logger.error("Worker stopped unexpectedly", {
    errorCode: error instanceof Error ? "worker_failure" : "unknown_failure"
  });
  process.exitCode = 1;
});
