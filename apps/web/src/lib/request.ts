import { headers } from "next/headers";

import { checkRateLimit } from "./rate-limit";

export async function requestFingerprint(): Promise<string> {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "local"
  );
}

export async function publicMutationAllowed(scope: string): Promise<boolean> {
  const fingerprint = await requestFingerprint();
  return checkRateLimit(`${scope}:${fingerprint}`, 10, 60_000).allowed;
}
