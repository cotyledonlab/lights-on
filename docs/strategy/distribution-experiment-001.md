# Distribution Experiment 001 — Irish sole-trader expense records

**Status:** Proposed; do not recruit until the human approvals at the end are recorded

**Mode:** Problem and audience research

**Jurisdiction:** Republic of Ireland

**Owner:** To be named by the founder

**Start date:** To be set after approval

**Duration:** 14 calendar days, with an earlier evidence stop

**Decision due:** Two business days after the stop condition

## Purpose and boundary

Test whether a reachable, narrow audience experiences a frequent and consequential
purchase-record problem before expanding the local software scaffold or any
infrastructure.

This experiment conducts screening and interviews only. It does not deploy the
application, accept real receipts, provide tax advice, process payments, or treat an
interview or positive comment as product usage. A separate approval is required before
representative-data fulfilment.

## Audit input validation

### Verified repository facts accepted

The following findings from [`post-phase-1-audit.md`](./post-phase-1-audit.md) remain
supported:

- Phase 1 is a local-only synthetic ingest, deterministic extraction, human review, and
  result demonstration.
- Gate 1 remains awaiting explicit human approval. Gates 0 and 2 through 6 do not
  authorize infrastructure, external users, production, automation, or live billing.
- External auth, real email delivery, external analytics, real-data consent and
  retention, result notification, recovery, and reviewer accountability are absent.
- The repository contains delivery evidence but no external interview, acquisition,
  observed-workaround, repeat-use, referral, payment, or retention evidence.
- The current receipt fields and human-review workflow are not proven to deliver a
  valuable downstream customer outcome.
- The existing evidence vocabulary is documentation, not an instantiated experiment or
  reliable acquisition funnel.

Targeted inspection found no application or infrastructure change between the
implementation commit audited in that report and the current strategy baseline. No
factual correction to the audit is required.

### Claims that remain assumptions

- A specific reachable audience experiences a recurring receipt problem.
- The problem is receipt capture or structuring rather than tax classification,
  bookkeeping, accountant communication, or another downstream job.
- The problem is severe enough to change behaviour.
- Vendor, purchase date, total, and currency are sufficient fields.
- Human verification creates enough trust or accuracy to justify its latency.
- A participant will share representative purchase information with a founder-led
  service.
- A trusted acquisition channel can produce qualified participants at acceptable founder
  effort.
- A customer will pay, what they will pay for, and whether the payer is the user.
- Any current provider seam or web/worker architecture will repeat in another product.

### Material strategic gaps

Repository inspection cannot supply:

- observed frequency, severity, current workarounds, or customer language;
- a founder access map for ten qualified people;
- a tested attention message and acquisition denominator;
- the downstream action that makes a structured record useful;
- real-data trust, consent, retention, and deletion expectations;
- activation, repeat-use, referral, or payment behaviour;
- a price, billing unit, or acceptable founder acquisition/fulfilment cost.

These gaps block product and infrastructure prioritisation but do not block the
interview-only experiment below.

### Questions requiring founder judgment

- Whether Gate 1 is approved is a separate human decision.
- Whether the primary segment, primary channel, and numeric thresholds below are
  acceptable.
- Whether the founder can name enough trusted access paths before launch.
- Who owns outreach, privacy responses, the experiment decision, and the time budget.
- Whether the proposed data-minimisation and retention approach is acceptable; legal
  advice may still be required.
- Whether the recommended implementation PR should proceed.

## External evidence and its limit

Primary-source research is recorded in
[`market-segment-research.md`](./market-segment-research.md). It supports the existence
of record-keeping and proof-of-purchase jobs, and it identifies audience access points.
It does not prove pain, workaround inadequacy, trust, demand, or willingness to pay.

In particular:

- Irish Revenue says business operators must continuously keep records used to calculate
  tax, including purchase and expense receipts, and retain original records for six
  years. Revenue also supplies a free Receipts Tracker with a `Trade` category.
- Revenue requires full and accurate expense records for each rental property and lists
  maintenance, repairs, goods, fees, and capital allowances as relevant expenses. Its
  free tracker also has a `Rental` category.
- The CCPC says a receipt is the easiest proof of purchase for faulty goods but not the
  only proof, making bank statements and delivery records material substitutes.
- The Central Bank of Ireland identifies household contents underinsurance as a real
  consequence, but that does not establish a frequent receipt-management job.
- Official small-business, landlord, and photography organisations expose potential
  access routes, but permission and founder access remain untested.

## Candidate segment assessment

Frequency, pain, accessibility, and willingness-to-pay statements below are hypotheses
unless the source note marks them as verified.

### A. Irish sole traders with recurring business purchases

**Profile.** Republic-of-Ireland sole traders who personally manage at least five
business purchase records in a typical month, have no dedicated finance employee, and
are not satisfied with automated receipt capture.

- **Trigger, problem, frequency, consequence:** Purchases create a continuous
  record-keeping job; an accountant request, annual return, or Revenue query makes the
  backlog salient. The hypothesised problem is reconstructing and explaining expenses
  across paper, email, and bank records. The expected consequences are founder time,
  unclaimed or uncertain expenses, rework, and compliance anxiety. Their incidence and
  size are unknown.
- **Workaround and inadequacy:** Envelopes, phone photos, inbox search, spreadsheets, an
  accountant, Revenue's free Receipts Tracker, and commercial bookkeeping tools are
  substitutes. The free official tracker is a strong counter-signal. The opportunity
  exists only if the current workflow still fails at timely capture, business-purpose
  context, categorisation, or accountant-ready handoff.
- **Trust, payer, willingness to pay:** Purchase records can reveal vendors, clients,
  travel, and financial patterns. The sole trader is the likely user and payer, but
  willingness to pay is wholly unverified and constrained by free and bundled
  alternatives.
- **Reach and acquisition:** Warm founder introductions, referrer-forwarded invitations,
  bookkeepers, accountants, and Local Enterprise Office networks are plausible. A solo
  founder can run manual interviews, but accessibility is only medium until a 30-contact
  access list exists. Interviews should be moderately easy without requesting documents;
  acquisition becomes harder when real data or payment is requested.
- **Fast rejection evidence:** Reject or reshape the segment if fewer than four of eight
  qualified interviewees can describe a recent consequential episode, if the official
  tracker/accountant workflow is adequate, or if the real job is tax advice rather than
  record handling.

**Recommendation:** Primary.

### B. Self-managing Irish landlords with one or two rental properties

**Profile.** Individuals with one or two Irish rental properties who personally
coordinate maintenance and prepare property expenses without a property manager.

- **Trigger, problem, frequency, consequence:** A repair, appliance replacement, tenancy
  change, or annual return creates records that must be attributed to a property and
  treated correctly. Maintenance provides repetition, while tax treatment makes missing
  context consequential. Purchase frequency is irregular and must be screened.
- **Workaround and inadequacy:** Paper/email folders, a per-property spreadsheet,
  Revenue's free Receipts Tracker, a letting agent, or an accountant. The receipt may be
  less difficult than deciding whether work is a repair, improvement, or capital item.
- **Trust, payer, willingness to pay:** Property addresses, tenant context, access
  arrangements, and financial data create a high trust barrier. The landlord is the
  likely payer. Ability and willingness to pay are unverified.
- **Reach and acquisition:** Trusted landlord accountants, referrers, and the Irish
  Property Owners' Association are identifiable but gatekept. Interviews are feasible;
  cold acquisition by an unknown founder is expected to be difficult.
- **Fast rejection evidence:** Reject if fewer than four of eight describe repeated
  record failures, if tax classification dominates capture, or if a trusted association
  or referrer will not permit access.

**Recommendation:** Fallback, provided a trusted access path is confirmed.

### C. Frequent buyers managing warranties and returns for high-value goods

**Profile.** Irish adults who bought at least four goods costing €250 or more in the
past 24 months and do not already keep proof of purchase in a retailer account.

- **Trigger, problem, frequency, consequence:** A fault, unwanted online purchase, or
  warranty claim makes proof salient. Consequences can include a delayed or lost remedy,
  but the event is intermittent rather than a regular workflow.
- **Workaround and inadequacy:** Email search, card statements, delivery dockets,
  retailer accounts, and paper receipts. Official guidance confirms these can substitute
  for a receipt, weakening a receipt-specific product.
- **Trust, payer, willingness to pay:** Purchase history is personal, and proactive
  storage must earn trust before an unpredictable failure. The consumer would pay unless
  a retailer or insurer sponsored the service. Standalone willingness to pay is expected
  to be low and is unverified.
- **Reach and acquisition:** The most salient moment is at purchase or failure, where
  retailers control access. Broad consumer outreach would be expensive and poorly timed.
  Interviews are easy; qualified acquisition at the right moment is hard.
- **Fast rejection evidence:** Reject if fewer than three of eight experienced a proof
  failure in two years or if substitutes resolved every incident without meaningful
  loss.

**Recommendation:** Reject as the first segment.

### D. Homeowners preparing or refreshing an insurance contents inventory

**Profile.** Irish owner-occupiers at home-insurance purchase or renewal who lack a
current household contents inventory.

- **Trigger, problem, frequency, consequence:** Renewal, moving home, a major purchase,
  or a claim makes contents value salient. Underinsurance can have a large financial
  consequence, but inventory creation is likely annual or one-off.
- **Workaround and inadequacy:** Room-by-room photos, spreadsheets, insurer guidance,
  estimates, and post-incident reconstruction. The missing job may be valuation and
  coverage selection rather than receipt extraction.
- **Trust, payer, willingness to pay:** A home inventory reveals address-linked valuable
  assets and security-sensitive information. The homeowner could pay, but the more
  credible payer may be an insurer or broker, creating a different sales cycle.
- **Reach and acquisition:** Brokers, insurers, mortgage channels, and mover networks
  control the salient moments. Interviews are possible, while repeatable solo-founder
  acquisition is expected to be hard.
- **Fast rejection evidence:** Reject if fewer than three of eight have refreshed an
  inventory or coverage estimate in two years, or if they expect the insurer to provide
  the service at no extra cost.

**Recommendation:** Defer; reject a direct-to-consumer first test.

### E. Enthusiast photographers managing valuable equipment

**Profile.** Irish amateur or part-time photographers with at least €3,000 replacement
value across five or more separately purchased bodies, lenses, lighting, or accessories.

- **Trigger, problem, frequency, consequence:** Purchase, resale, repair, travel,
  insurance renewal, or theft can require proof, serial numbers, value, and warranty
  dates. Consequences may be material and emotional, but purchase and claim frequency is
  unknown.
- **Workaround and inadequacy:** Email and paper receipts, manufacturer registrations,
  insurer schedules, photographs, and spreadsheets. The useful record likely needs
  serials, images, condition, and valuation, so the existing receipt fields are
  insufficient.
- **Trust, payer, willingness to pay:** A detailed asset list is security-sensitive. The
  photographer is the likely payer, perhaps for a one-time inventory or annual check;
  willingness to pay and repeat demand are unverified.
- **Reach and acquisition:** Irish Photographic Federation clubs and local camera clubs
  form visible communities. Access still requires organiser permission. Interviews are
  moderately easy; acquisition could be easier than consumer segments if a club
  cooperates.
- **Fast rejection evidence:** Reject if receipts are not central to insurance, resale,
  or warranty tasks; if fewer than four of eight have updated any gear record in the
  past year; or if nobody commits to a representative-data session.

**Recommendation:** Defer as a distinct asset-record hypothesis, not a receipt-product
extension.

## Segment recommendation

### Primary

Test Irish sole traders first because the record-keeping job is continuous, the
participant and payer can be the same person, direct founder-led research is possible,
and the segment can be screened without handling real records.

The recommendation is invalid if:

- the founder cannot identify 30 permissioned warm or referrer-forwarded access paths;
- fewer than half of qualified participants report a recent material consequence;
- Revenue's free tracker, an accountant, or existing software is already adequate;
- the desired outcome requires tax judgment rather than record handling;
- people will not share even representative, redacted data in a later session; or
- no one makes a time/data/referral commitment after a useful conversation.

### Fallback

Use self-managing one-to-two-property Irish landlords only if a trusted landlord or
accountant referrer can provide permissioned access. This segment has a concrete
per-property expense job and potentially larger monetary consequences, but higher
privacy, tax-complexity, and acquisition risk.

The recommendation is invalid if:

- trusted access cannot be secured;
- maintenance records are too infrequent for a repeat workflow;
- property-accounting classification is the dominant unmet need;
- existing accountant/Revenue workflows are adequate; or
- participants reject human access to representative property records.

### Rejected or deferred

- Reject general warranty/return buyers as the first segment because the trigger is
  intermittent, proof has substitutes, and point-of-purchase distribution is gatekept.
- Defer insurance inventories because the consequence is real but the job is infrequent,
  security-sensitive, and likely better distributed through insurers or brokers.
- Defer photographers until a distinct equipment-record hypothesis is warranted; do not
  assume receipt extraction covers serial, valuation, condition, and insurance jobs.

## Experiment hypotheses

### Audience and problem

At least seven of ten qualified Irish sole traders will describe a specific
purchase-record episode in the prior 12 months, and at least six will report a material
consequence: 60 or more active minutes of rework, an unclaimed or uncertain expense, a
delayed accountant/tax task, or comparable documented anxiety tied to a real deadline.

### Value proposition

“Send purchase proof as it arrives; receive a human-checked expense record with the
context needed for your own books or accountant.”

At least four of ten qualified participants will commit time and representative,
redacted data to a scheduled Cycle 2 fulfilment session after hearing this outcome. This
is a commitment signal, not activation or payment.

### Channel

Trusted, one-to-one founder and referrer-forwarded invitations can produce ten completed
qualified interviews from no more than 40 eligible outreach attempts and eight active
founder hours spent on list building, messaging, screening, and scheduling.

Referrers forward the invitation themselves. They do not disclose another person's
contact details to the founder.

### Message

An invitation anchored to the moment “when your accountant or tax return needs the
receipts” will earn more qualified replies than generic “receipt organisation” or
technology-led language.

### Acquisition, value, and payment path

- **Acquisition event for this experiment:** a screened, qualified interview is booked.
- **Research completion event:** the qualified interview is completed with consent and a
  specific recent episode.
- **Future value event:** the participant uses a delivered expense record in their
  bookkeeping or accountant handoff without founder prompting or material rework.
- **Payment path:** Cycle 2 delivers that outcome; Cycle 3 requests an actual payment,
  deposit, pre-order, or explicit paid commitment under stated terms. A pricing opinion
  is not payment evidence.

## Participant profile

A qualified participant:

- is at least 18 and based in the Republic of Ireland;
- operates as a sole trader;
- personally manages or hands off business expense records;
- handles at least five business purchase records in a typical month;
- has used their current record workflow within the past 12 months; and
- consents to de-identified written notes for this experiment.

### Exclusions

- Company finance employees, bookkeepers, accountants, or tax advisers speaking only
  about clients;
- people whose purchase records are fully captured and reconciled without manual
  intervention and who report no unresolved problem;
- people with fewer than five business purchase records per typical month;
- participants outside the Republic of Ireland or under 18;
- anyone asked to disclose real receipts, tax identifiers, bank/card details, client
  information, health information, or other sensitive data;
- a founder friend or colleague who is not independently qualified.

## Channel and outreach operation

### Preflight

Before launch, the founder must be able to list 30 eligible access paths composed of:

- direct contacts who can be approached for research;
- people who explicitly agree to forward the invitation to a qualified sole trader; or
- a trusted small-business/bookkeeping community that grants permission for the research
  invitation.

If 30 permissioned paths cannot be listed, do not broaden into scraped or unsolicited
bulk outreach. Record a channel failure and decide whether to test the fallback segment.

### Outreach approach

1. Assign every access path a de-identified outreach identifier and acquisition source.
2. Send up to 30 individual messages over five business days.
3. Send one short follow-up after four business days only where the contact context
   permits it.
4. If six to nine qualified interviews are completed or scheduled, add at most ten new
   eligible access paths.
5. Do not automate messages, scrape contact details, buy a list, or add recipients to a
   marketing database.
6. Ask participants to forward the invitation rather than disclose another person's
   details.

### Outreach-message hypothesis

> I’m researching how Irish sole traders handle purchase records when an accountant or
> tax return needs them. I’m looking for people who personally manage at least five
> business receipts a month for a 25-minute research conversation. It is not a sales
> call, and I will not ask for receipts, financial details, or tax information. I’ll
> keep only de-identified notes, and you can stop or withdraw them. Would you be open to
> a short screening check?

The message identifies the founder and supplies a direct reply path. It contains no
product link or promotional claim.

### Interview invitation

> Thanks — you appear to match the research group. The conversation takes 25 minutes.
> I’ll ask about the last time you gathered business purchase records, what you actually
> did, where it broke down, and what happened next. I will take de-identified written
> notes and quote your words without your name. I will not record the call or ask you to
> show a real document. Participation is voluntary; you can skip a question or ask me to
> delete your notes. If that works for you, here are the available times.

### Landing-page role

No landing page is an acquisition channel for Experiment 001. Direct invitation and a
plain participant-information note are sufficient.

The existing application must not be deployed for this experiment: it is local,
synthetic-only, and behind unapproved Gate 1/3 controls. A later landing page may serve
as a trust and scheduling aid after direct outreach has produced evidence, but traffic
or waitlist count alone will not validate demand.

## Screening questions

Ask these before scheduling:

1. Are you at least 18, based in the Republic of Ireland, and currently operating as a
   sole trader?
2. In a typical month, how many business purchase records do you handle: `0–4`, `5–9`,
   `10–24`, or `25+`?
3. Who is responsible for collecting and preparing those records?
4. What system do you currently use?
5. Have you used that system for an accountant handoff, tax return, or your own books in
   the past 12 months?
6. Do you agree not to send or show real receipts or private financial/tax information?
7. Do you consent to de-identified written research notes under the supplied participant
   information?

Record answers by participant code. Do not retain responses from excluded people beyond
the aggregate exclusion reason.

## Interview guide

Avoid solution pitching until the behaviour questions are complete.

1. “Tell me about the last time you had to gather business purchase records.”
2. “What triggered it, and what did you do from start to finish?”
3. “Where did each record live before you gathered it?”
4. “What went missing, required explanation, or took longer than expected?”
5. “What happened because of that? How much active time did it take?”
6. “How often does that situation occur?”
7. “What have you tried to improve it? What did you keep or abandon?”
8. “What does your accountant, tax return, or own bookkeeping actually need?”
9. “Which purchase information would you refuse to share with a human-assisted service,
   and what assurance would change that?”
10. After the behaviour interview, present the value proposition once and offer a
    specific Cycle 2 appointment using representative/redacted data.
11. Ask whether they will forward the same neutral research invitation to one qualified
    sole trader. Do not ask for the person's details.

## Founder-led manual steps and effort

| Activity                                     | Expected active effort |
| -------------------------------------------- | ---------------------- |
| Access-map and eligibility review            | 2–3 hours              |
| Personalised outreach, follow-up, scheduling | 3–4 hours              |
| Ten 25-minute interviews                     | 4–5 hours              |
| De-identification and notes within 24 hours  | 3–4 hours              |
| Threshold review and decision record         | 2 hours                |
| **Total**                                    | **14–18 hours**        |

There is no cash acquisition budget and no interview incentive in the base experiment.
Adding either requires founder approval and a versioned amendment before use.

## Evidence to capture

Use the minimum file-based model in
[`docs/product/evidence-model.md`](../product/evidence-model.md):

- acquisition source, message version, outreach attempt, response, and founder minutes;
- screen answers, eligibility, exclusion reason, and consent version;
- a specific recent episode and its trigger;
- purchase-record frequency band and active effort;
- monetary, deadline, or emotional consequence;
- actual workaround, tools, and whether a redacted artefact was described;
- what failed and what remains adequate;
- verbatim customer language and counter-evidence;
- required downstream outcome and fields;
- trust concern and required assurance;
- Cycle 2 appointment/data commitment;
- qualified referral action;
- limitations and selection bias;
- threshold result and experiment decision.

Record opinion, stated intent, observed behaviour, commitment, and financial commitment
separately. Do not count “I would use/pay” as product use or payment.

## Privacy, consent, and trust constraints

- Use a short versioned participant-information and consent script before interview
  notes begin.
- Take written notes only; do not record audio or video.
- Do not request, receive, copy, or retain real or redacted receipts in this cycle.
- Store no names, contact details, email addresses, tax identifiers, addresses, client
  information, or private financial data in Git.
- Use participant codes in the repository. Keep contact details only in the
  founder-controlled communication tool and delete the mapping 30 days after the
  experiment decision unless a separately consented follow-up is active.
- Delete repository notes for a participant who withdraws; retain only a count of the
  withdrawal if lawful and necessary.
- State the founder's identity, research purpose, note use, retention period, withdrawal
  route, absence of recording, and absence of a sales ask.
- Pause immediately on a privacy complaint, accidental sensitive-data receipt, uncertain
  outreach legality, or inability to honour withdrawal.

The Irish Data Protection Commission says data must be purpose-limited, minimised, and
retained no longer than necessary. Research-only outreach must remain non-promotional;
if a message promotes a future product or requests product enquiries, electronic direct
marketing rules may apply. Human review of the final copy and lawful outreach basis is
required before launch.

Trust is part of the experiment. The founder must not claim tax expertise, automation,
security controls, or a deployed service that does not exist.

## Sample and thresholds

### Target and volume

- Target: 10 completed, qualified interviews from distinct sole traders.
- Schedule up to 12 to allow ordinary no-shows; stop analysis at the first 10 completed
  unless a pre-recorded sampling rule says otherwise.
- Initial outreach: 30 eligible, permissioned one-to-one access paths.
- Bounded extension: 10 additional eligible paths.
- Maximum: 40 people, one permitted follow-up each, 18 active founder hours, or 14
  calendar days.

### Success

Continue to a separately approved Cycle 2 only if all are true:

1. **Reach:** ten qualified interviews complete within the experiment maximum and no
   more than eight founder hours are spent on access, outreach, screening, and
   scheduling.
2. **Observed problem:** at least seven of ten describe a specific episode in the prior
   12 months, and at least six report a material time, money, deadline, or anxiety
   consequence.
3. **Workaround inadequacy:** at least six use the workaround monthly or more often, and
   at least five identify a concrete failure rather than a general dislike.
4. **Commitment:** at least four book a dated Cycle 2 session and agree to bring
   representative/redacted data under a future approved consent process.

Qualified referrals are recorded as stronger distribution evidence but are not required
to pass this first small sample. No success threshold here is payment evidence.

### Failure

The tested segment/value proposition fails if, after at least eight qualified
interviews:

- fewer than four describe a specific recent episode;
- fewer than three report a material consequence;
- fewer than three identify a concrete workaround failure; or
- fewer than three make the Cycle 2 time/data commitment.

The channel fails if fewer than six qualified interviews complete after 40 eligible
access paths and the permitted follow-up window. A channel failure does not by itself
disprove pain among completed participants.

### Inconclusive

The result is inconclusive when:

- six to nine qualified interviews complete and none of the segment failure thresholds
  is crossed;
- thresholds split between adjacent participant subgroups; or
- pain passes but commitment fails for several different, unresolved reasons.

Do not continue collecting indefinitely. Decide `Iterate`, `Pivot`, or `Pause`, name the
single uncertainty, and design a bounded follow-up.

### Stop condition

Stop at the earliest of:

- ten completed qualified interviews;
- 40 eligible access paths plus the final four-business-day response window;
- 18 active founder hours;
- 14 calendar days;
- a privacy, consent, outreach-legality, or participant-safety issue; or
- evidence that the invitation is reaching a materially different segment.

### Decision point

Within two business days, cite ledger and interview evidence and choose exactly one:

- `Continue` — run the approved representative-data fulfilment cycle;
- `Iterate` — change one problem, outcome, message, or screening assumption;
- `Pivot` — change channel or move to the approved fallback segment;
- `Pause` — wait for access, privacy, or founder-capacity conditions;
- `Kill` — stop this segment/problem hypothesis; or
- `Scale` — unavailable from Cycle 1 evidence.

## Recommended next implementation PR

### Title

`docs(experiment): add EXP-001 founder research kit`

### Exact scope

Create only `docs/experiments/EXP-001/` containing:

- `experiment.md` with the approved, dated hypotheses, segment, message, thresholds,
  consent approach, owner, and stop condition;
- `ledger.yaml` with empty de-identified acquisition, outreach, screening, commitment,
  referral, and decision records plus one synthetic example;
- `interviews/template.md` with the screening, consent confirmation, behaviour-first
  guide, evidence classification, counter-evidence, and withdrawal marker;
- `participant-information.md` with the human-approved invitation, data use, retention,
  and withdrawal copy; and
- `decision.md` with the threshold matrix and evidence-citation slots.

Do not change the application, Prisma schema, providers, analytics, infrastructure,
deployment, or GitHub roadmap. Do not create a general experiment framework.

### Evidence enabled

The PR makes the outreach denominator, source, qualified-booking rate, interview
completion, founder time, observed pain, exact language, trust objections, Cycle 2
commitments, referrals, counter-evidence, and final decision auditable before the first
message is sent.

### Estimate and rollback

- Focused engineering time: 4–6 hours.
- Validation: repository formatting/Markdown checks and a synthetic record walkthrough.
- Rollback: delete the single experiment directory; there is no runtime, data migration,
  provider, or external-state change.

This is preferred over a landing-page PR because Cycle 1 needs ten trusted
conversations, not anonymous traffic, and the current application cannot safely serve
external users.

## Required human approvals

Stop here until the founder explicitly approves or changes:

1. primary segment: Irish sole traders matching the participant profile;
2. fallback segment: self-managing Irish landlords with one or two properties;
3. channel: permissioned founder/referrer-forwarded one-to-one invitations;
4. success, failure, inconclusive, effort, and stop thresholds;
5. participant-information, consent, retention, and outreach-law review owner;
6. experiment owner and dates; and
7. the exact 4–6-hour implementation PR above.

Approval of this document does not approve Gate 1, Gate 3, external deployment,
representative-data fulfilment, payment collection, or infrastructure.
