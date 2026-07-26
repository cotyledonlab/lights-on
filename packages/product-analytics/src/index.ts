import { database, type Prisma } from "@lights-on/database";

export const analyticsEvents = {
  humanReviewCompleted: "human_review_completed",
  landingPageView: "landing_page_view",
  paymentInterestResponse: "payment_interest_response",
  resultViewed: "result_viewed",
  signup: "signup",
  submissionCompleted: "submission_completed",
  submissionStarted: "submission_started"
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export interface AnalyticsEventInput {
  name: AnalyticsEventName;
  participantId?: string;
  properties?: Prisma.InputJsonValue;
  submissionId?: string;
}

export interface AnalyticsProvider {
  capture(event: AnalyticsEventInput): Promise<void>;
}

export class DatabaseAnalyticsProvider implements AnalyticsProvider {
  async capture(event: AnalyticsEventInput): Promise<void> {
    await database.analyticsEvent.create({
      data: {
        name: event.name,
        participantId: event.participantId,
        properties: event.properties,
        submissionId: event.submissionId
      }
    });
  }
}

export const analytics: AnalyticsProvider = new DatabaseAnalyticsProvider();
