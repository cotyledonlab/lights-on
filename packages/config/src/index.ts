import { z } from "zod";

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  PARTICIPANT_COOKIE_SECRET: z.string().min(32),
  REVIEWER_ACCESS_CODE: z.string().min(12),
  REVIEWER_COOKIE_SECRET: z.string().min(32)
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnvironment(
  source: NodeJS.ProcessEnv = process.env
): ServerEnvironment {
  if (source === process.env && cachedEnvironment) {
    return cachedEnvironment;
  }

  const parsed = serverEnvironmentSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${z.prettifyError(parsed.error)}`);
  }

  if (source === process.env) {
    cachedEnvironment = parsed.data;
  }

  return parsed.data;
}
