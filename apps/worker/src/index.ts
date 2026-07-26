import { createServer } from "node:http";

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
  const healthServer = createServer((request, response) => {
    void (async () => {
      if (request.url !== "/health") {
        response.writeHead(404).end();
        return;
      }

      try {
        await database.$queryRaw`SELECT 1`;
        response
          .writeHead(200, { "content-type": "application/json" })
          .end('{"service":"worker","status":"ok"}');
      } catch {
        response
          .writeHead(503, { "content-type": "application/json" })
          .end('{"service":"worker","status":"unavailable"}');
      }
    })();
  });
  const healthPort = Number(process.env.WORKER_HEALTH_PORT ?? "3001");
  await new Promise<void>((resolve) => {
    healthServer.listen(healthPort, "127.0.0.1", resolve);
  });
  logger.info("Worker started", { event: "worker_started" });

  while (running) {
    const processed = await processNextJob();
    if (!processed) {
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
  }

  await new Promise<void>((resolve, reject) => {
    healthServer.close((error) => (error ? reject(error) : resolve()));
  });
  await database.$disconnect();
  logger.info("Worker stopped", { event: "worker_stopped" });
}

main().catch((error: unknown) => {
  logger.error("Worker stopped unexpectedly", {
    errorCode: error instanceof Error ? "worker_failure" : "unknown_failure"
  });
  process.exitCode = 1;
});
