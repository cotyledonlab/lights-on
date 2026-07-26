"use server";

import { getAuthProvider } from "@lights-on/auth";
import { database } from "@lights-on/database";
import { emailProvider } from "@lights-on/email";
import { analytics, analyticsEvents } from "@lights-on/product-analytics";
import { jobQueue } from "@lights-on/queue";
import {
  earlyAccessSchema,
  paymentInterestSchema,
  reviewReceiptSchema,
  syntheticReceiptSchema
} from "@lights-on/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import {
  participantCookieName,
  participantCookieOptions,
  reviewerCookieName,
  reviewerCookieOptions
} from "@/lib/cookies";
import { publicMutationAllowed } from "@/lib/request";
import { currentParticipantId, reviewerIsAuthenticated } from "@/lib/session";

function fields(error: z.ZodError): ActionState["fieldErrors"] {
  return z.flattenError(error).fieldErrors;
}

function formString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function joinEarlyAccessAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await publicMutationAllowed("join"))) {
    return { message: "Too many attempts. Wait a minute and try again." };
  }

  const parsed = earlyAccessSchema.safeParse({
    consent: formData.get("consent"),
    email: formData.get("email")
  });
  if (!parsed.success) {
    return { fieldErrors: fields(parsed.error) };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const participant = await database.$transaction(async (transaction) => {
    const record = await transaction.participant.upsert({
      create: { email },
      update: {},
      where: { email }
    });
    await transaction.consentRecord.create({
      data: {
        participantId: record.id,
        purpose: "Early access and synthetic receipt experiment",
        version: "2026-07-26"
      }
    });
    return record;
  });

  const token = await getAuthProvider().createParticipantSession(participant.id);
  const cookieStore = await cookies();
  cookieStore.set(participantCookieName, token, participantCookieOptions());

  await Promise.all([
    analytics.capture({
      name: analyticsEvents.signup,
      participantId: participant.id
    }),
    emailProvider.send({
      purpose: "early-access-confirmation",
      recipient: email
    })
  ]);

  redirect("/submit");
}

export async function submitSyntheticReceiptAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const participantId = await currentParticipantId();
  if (!participantId) {
    redirect("/#early-access");
  }
  if (!(await publicMutationAllowed("submit"))) {
    return { message: "Too many attempts. Wait a minute and try again." };
  }

  const parsed = syntheticReceiptSchema.safeParse({
    rawText: formData.get("rawText")
  });
  if (!parsed.success) {
    return { fieldErrors: fields(parsed.error) };
  }

  const submission = await database.submission.create({
    data: {
      participantId,
      rawText: parsed.data.rawText
    }
  });

  await jobQueue.enqueue("receipt.extract", submission.id, {
    submissionId: submission.id
  });
  await analytics.capture({
    name: analyticsEvents.submissionCompleted,
    participantId,
    submissionId: submission.id
  });

  redirect("/result");
}

export async function reviewerSignInAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await publicMutationAllowed("reviewer-login"))) {
    return { message: "Too many attempts. Wait a minute and try again." };
  }

  const code = formString(formData, "code");
  const auth = getAuthProvider();
  if (!auth.verifyReviewerAccessCode(code)) {
    return { message: "That local reviewer code is not valid." };
  }

  const token = await auth.createReviewerSession();
  const cookieStore = await cookies();
  cookieStore.set(reviewerCookieName, token, reviewerCookieOptions());
  redirect("/review");
}

export async function reviewerSignOutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(reviewerCookieName)?.value;
  if (token) {
    await getAuthProvider().revokeSession(token);
  }
  cookieStore.delete(reviewerCookieName);
  redirect("/");
}

export async function completeReviewAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await reviewerIsAuthenticated())) {
    redirect("/review");
  }

  const jobId = formString(formData, "jobId");
  const parsed = reviewReceiptSchema.safeParse({
    currency: formData.get("currency"),
    notes: formData.get("notes"),
    purchasedAt: formData.get("purchasedAt"),
    total: formData.get("total"),
    vendor: formData.get("vendor")
  });
  if (!parsed.success) {
    return { fieldErrors: fields(parsed.error) };
  }

  const job = await database.reviewJob.findUnique({
    select: {
      submission: { select: { participantId: true } },
      submissionId: true
    },
    where: { id: jobId }
  });
  if (!job) {
    return { message: "This review job no longer exists." };
  }

  const totalCents = Math.round(parsed.data.total * 100);
  await database.$transaction([
    database.receiptResult.upsert({
      create: {
        currency: parsed.data.currency,
        notes: parsed.data.notes,
        purchasedAt: new Date(`${parsed.data.purchasedAt}T12:00:00.000Z`),
        submissionId: job.submissionId,
        totalCents,
        vendor: parsed.data.vendor
      },
      update: {
        currency: parsed.data.currency,
        notes: parsed.data.notes,
        purchasedAt: new Date(`${parsed.data.purchasedAt}T12:00:00.000Z`),
        totalCents,
        vendor: parsed.data.vendor
      },
      where: { submissionId: job.submissionId }
    }),
    database.reviewJob.update({
      data: { completedAt: new Date(), status: "COMPLETED" },
      where: { id: jobId }
    }),
    database.submission.update({
      data: { status: "COMPLETED" },
      where: { id: job.submissionId }
    })
  ]);
  await analytics.capture({
    name: analyticsEvents.humanReviewCompleted,
    participantId: job.submission.participantId,
    submissionId: job.submissionId
  });

  redirect("/review?completed=1");
}

export async function recordPaymentInterestAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const participantId = await currentParticipantId();
  if (!participantId) {
    redirect("/#early-access");
  }

  const parsed = paymentInterestSchema.safeParse({
    response: formData.get("response")
  });
  if (!parsed.success) {
    return { fieldErrors: fields(parsed.error) };
  }

  const submission = await database.submission.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true },
    where: { participantId, status: "COMPLETED" }
  });
  if (!submission) {
    return { message: "A completed result is required first." };
  }

  await database.paymentSignal.upsert({
    create: {
      currency: "EUR",
      participantId,
      priceCents: 500,
      response: parsed.data.response,
      submissionId: submission.id
    },
    update: { response: parsed.data.response },
    where: {
      participantId_submissionId: {
        participantId,
        submissionId: submission.id
      }
    }
  });
  await analytics.capture({
    name: analyticsEvents.paymentInterestResponse,
    participantId,
    properties: { response: parsed.data.response },
    submissionId: submission.id
  });

  return { message: "Thanks—your response is evidence, not a charge." };
}

export async function deleteParticipantDataAction(): Promise<void> {
  const participantId = await currentParticipantId();
  if (participantId) {
    await database.participant.deleteMany({ where: { id: participantId } });
  }
  const cookieStore = await cookies();
  cookieStore.delete(participantCookieName);
  redirect("/deleted");
}
