import { getAuthProvider } from "@lights-on/auth";
import { cookies } from "next/headers";

import { participantCookieName, reviewerCookieName } from "./cookies";

export async function currentParticipantId(): Promise<string | null> {
  const cookieStore = await cookies();
  const identity = await getAuthProvider().resolveParticipantSession(
    cookieStore.get(participantCookieName)?.value
  );
  return identity?.participantId ?? null;
}

export async function reviewerIsAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return getAuthProvider().resolveReviewerSession(
    cookieStore.get(reviewerCookieName)?.value
  );
}
