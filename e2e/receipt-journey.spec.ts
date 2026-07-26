import { expect, test } from "@playwright/test";

import { database } from "../packages/database/src/index";

test.afterAll(async () => {
  await database.$disconnect();
});

test("participant receives a human-checked structured result", async ({ page }) => {
  const startedAt = new Date();
  const email = `phase1-${Date.now()}@example.test`;
  const reviewerCode = process.env.REVIEWER_ACCESS_CODE;
  if (!reviewerCode) {
    throw new Error("REVIEWER_ACCESS_CODE is required for the browser journey.");
  }

  const landingEvent = page.waitForResponse(
    (response) => response.url().endsWith("/api/events") && response.status() === 202
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your receipts");
  await landingEvent;

  await page.getByLabel("Email address").fill(email);
  await page.getByLabel(/I consent/).check();
  await page.getByRole("button", { name: "Join and test the flow" }).click();
  await expect(page).toHaveURL(/\/submit$/);

  await page
    .getByLabel("Synthetic purchase record")
    .fill(
      [
        "Merchant: Harbour Books",
        "Date: 2026-07-05",
        "Total: EUR 18.40",
        "Item: Field Notes"
      ].join("\n")
    );
  await page.getByRole("button", { name: "Submit for human review" }).click();
  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByText(/Current status:/)).toBeVisible();

  const participant = await database.participant.findUniqueOrThrow({
    where: { email }
  });
  const submission = await expect
    .poll(
      async () =>
        database.submission.findFirst({
          include: { reviewJob: true },
          orderBy: { createdAt: "desc" },
          where: { participantId: participant.id }
        }),
      { message: "worker should prepare a human review job", timeout: 15_000 }
    )
    .toMatchObject({
      extractedVendor: "Harbour Books",
      reviewJob: { status: "PENDING" },
      status: "AWAITING_REVIEW"
    })
    .then(async () =>
      database.submission.findFirstOrThrow({
        include: { reviewJob: true },
        orderBy: { createdAt: "desc" },
        where: { participantId: participant.id }
      })
    );

  const reviewer = await page.context().newPage();
  await reviewer.goto(`/review/${submission.reviewJob?.id ?? ""}`);
  await reviewer.getByLabel("Local reviewer access code").fill(reviewerCode);
  await reviewer.getByRole("button", { name: "Open review queue" }).click();
  await expect(reviewer.getByRole("heading", { level: 1 })).toHaveText(
    "Review the machine’s homework."
  );
  await expect
    .poll(async () => (await page.context().cookies()).map((cookie) => cookie.name))
    .toContain("lights_on_reviewer");
  await reviewer.goto(`/review/${submission.reviewJob?.id ?? ""}`);
  await expect(reviewer.getByRole("heading", { level: 1 })).toHaveText(
    "Check every field."
  );
  await reviewer.getByLabel("Vendor").fill("Harbour Books & Co.");
  await reviewer
    .getByLabel("Reviewer notes")
    .fill("Human confirmed the synthetic merchant name.");
  await reviewer.getByRole("button", { name: "Complete human review" }).click();
  await expect(reviewer.getByRole("status")).toContainText("Review completed");
  await reviewer.close();

  const resultEvent = page.waitForResponse(
    (response) => response.url().endsWith("/api/events") && response.status() === 202
  );
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your clean record."
  );
  await expect(page.getByText("Harbour Books & Co.")).toBeVisible();
  await expect(page.getByText("€18.40")).toBeVisible();
  await resultEvent;

  await page.getByLabel("Yes, I would seriously consider paying").check();
  await page.getByRole("button", { name: "Record my response" }).click();
  await expect(page.getByRole("status")).toContainText("your response is evidence");

  await expect
    .poll(async () => {
      const events = await database.analyticsEvent.findMany({
        orderBy: { occurredAt: "asc" },
        select: { name: true },
        where: { participantId: participant.id }
      });
      return events.map((event) => event.name);
    })
    .toEqual([
      "signup",
      "submission_started",
      "submission_completed",
      "human_review_completed",
      "result_viewed",
      "payment_interest_response"
    ]);

  await expect(
    database.analyticsEvent.count({
      where: {
        name: "landing_page_view",
        occurredAt: { gte: startedAt },
        participantId: null
      }
    })
  ).resolves.toBeGreaterThanOrEqual(1);

  await page.goto("/privacy");
  await page.getByRole("button", { name: "Delete my experiment data" }).click();
  await expect(page).toHaveURL(/\/deleted$/);
  await expect(
    database.participant.findUnique({ where: { id: participant.id } })
  ).resolves.toBeNull();
  await expect(
    database.queueJob.findUnique({ where: { jobKey: submission.id } })
  ).resolves.toBeNull();
});
