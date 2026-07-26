import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const participantCookieName = "lights_on_participant";
export const reviewerCookieName = "lights_on_reviewer";

export function participantCookieOptions(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  };
}

export function reviewerCookieOptions(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  };
}
