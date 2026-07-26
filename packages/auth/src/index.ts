import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { getServerEnvironment } from "@lights-on/config";
import { database } from "@lights-on/database";

export interface ParticipantIdentity {
  participantId: string;
}

export interface AuthProvider {
  createParticipantSession(participantId: string): Promise<string>;
  createReviewerSession(): Promise<string>;
  resolveParticipantSession(
    token: string | undefined
  ): Promise<ParticipantIdentity | null>;
  resolveReviewerSession(token: string | undefined): Promise<boolean>;
  revokeSession(token: string): Promise<void>;
  verifyReviewerAccessCode(candidate: string): boolean;
}

interface LocalAuthOptions {
  participantSecret: string;
  reviewerAccessCode: string;
  reviewerSecret: string;
}

function digest(token: string, secret: string): string {
  return createHmac("sha256", secret).update(token).digest("hex");
}

function issueToken(prefix: "participant" | "reviewer"): string {
  return `${prefix}_${randomBytes(32).toString("base64url")}`;
}

function expiresInDays(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1_000);
}

export class LocalAuthProvider implements AuthProvider {
  constructor(private readonly options: LocalAuthOptions) {}

  async createParticipantSession(participantId: string): Promise<string> {
    const token = issueToken("participant");
    await database.authSession.create({
      data: {
        expiresAt: expiresInDays(30),
        kind: "PARTICIPANT",
        participantId,
        tokenDigest: digest(token, this.options.participantSecret)
      }
    });
    return token;
  }

  async createReviewerSession(): Promise<string> {
    const token = issueToken("reviewer");
    await database.authSession.create({
      data: {
        expiresAt: expiresInDays(1),
        kind: "REVIEWER",
        tokenDigest: digest(token, this.options.reviewerSecret)
      }
    });
    return token;
  }

  async resolveParticipantSession(
    token: string | undefined
  ): Promise<ParticipantIdentity | null> {
    if (!token?.startsWith("participant_")) {
      return null;
    }

    const session = await database.authSession.findFirst({
      where: {
        expiresAt: { gt: new Date() },
        kind: "PARTICIPANT",
        tokenDigest: digest(token, this.options.participantSecret)
      }
    });

    return session?.participantId ? { participantId: session.participantId } : null;
  }

  async resolveReviewerSession(token: string | undefined): Promise<boolean> {
    if (!token?.startsWith("reviewer_")) {
      return false;
    }

    const session = await database.authSession.findFirst({
      where: {
        expiresAt: { gt: new Date() },
        kind: "REVIEWER",
        tokenDigest: digest(token, this.options.reviewerSecret)
      }
    });

    return Boolean(session);
  }

  async revokeSession(token: string): Promise<void> {
    const secret = token.startsWith("reviewer_")
      ? this.options.reviewerSecret
      : this.options.participantSecret;
    await database.authSession.deleteMany({
      where: { tokenDigest: digest(token, secret) }
    });
  }

  verifyReviewerAccessCode(candidate: string): boolean {
    const candidateBuffer = Buffer.from(candidate);
    const expectedBuffer = Buffer.from(this.options.reviewerAccessCode);

    return (
      candidateBuffer.length === expectedBuffer.length &&
      timingSafeEqual(candidateBuffer, expectedBuffer)
    );
  }
}

let authProvider: AuthProvider | undefined;

export function getAuthProvider(): AuthProvider {
  if (!authProvider) {
    const environment = getServerEnvironment();
    authProvider = new LocalAuthProvider({
      participantSecret: environment.PARTICIPANT_COOKIE_SECRET,
      reviewerAccessCode: environment.REVIEWER_ACCESS_CODE,
      reviewerSecret: environment.REVIEWER_COOKIE_SECRET
    });
  }
  return authProvider;
}
