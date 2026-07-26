type LogLevel = "debug" | "info" | "warn" | "error";
type SafeLogValue = boolean | number | string | null | undefined;
type SafeLogContext = Record<string, SafeLogValue>;

const allowedKeys = new Set([
  "attempt",
  "durationMs",
  "errorCode",
  "event",
  "jobId",
  "jobName",
  "status",
  "submissionId"
]);

export interface Logger {
  debug(message: string, context?: SafeLogContext): void;
  error(message: string, context?: SafeLogContext): void;
  info(message: string, context?: SafeLogContext): void;
  warn(message: string, context?: SafeLogContext): void;
}

function sanitize(context: SafeLogContext = {}): SafeLogContext {
  return Object.fromEntries(
    Object.entries(context).filter(([key]) => allowedKeys.has(key))
  );
}

function write(level: LogLevel, message: string, context?: SafeLogContext): void {
  const record = JSON.stringify({
    level,
    message,
    ...sanitize(context),
    timestamp: new Date().toISOString()
  });

  if (level === "error") {
    process.stderr.write(`${record}\n`);
  } else {
    process.stdout.write(`${record}\n`);
  }
}

export const logger: Logger = {
  debug: (message, context) => write("debug", message, context),
  error: (message, context) => write("error", message, context),
  info: (message, context) => write("info", message, context),
  warn: (message, context) => write("warn", message, context)
};
