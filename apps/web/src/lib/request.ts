import { getServerEnvironment } from "@lights-on/config";
import { headers } from "next/headers";

import { checkRateLimit } from "./rate-limit";

export function fingerprintFromHeaders(
  requestHeaders: Pick<Headers, "get">,
  trustProxyHeaders: boolean
): string {
  if (!trustProxyHeaders) {
    return "untrusted-direct";
  }

  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "trusted-proxy-unknown"
  );
}

export async function requestFingerprint(): Promise<string> {
  const requestHeaders = await headers();
  return fingerprintFromHeaders(
    requestHeaders,
    getServerEnvironment().TRUST_PROXY_HEADERS
  );
}

export async function publicMutationAllowed(scope: string): Promise<boolean> {
  const fingerprint = await requestFingerprint();
  return checkRateLimit(`${scope}:${fingerprint}`, 10, 60_000).allowed;
}
