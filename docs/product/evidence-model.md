# Product evidence model

Software completion is not validation. Every experiment decision must cite observed
evidence.

## Terms

| Entity              | Meaning                                                              |
| ------------------- | -------------------------------------------------------------------- |
| Product hypothesis  | Falsifiable belief connecting a segment, pain, outcome, and behavior |
| Target segment      | Narrow group expected to share the pain                              |
| Pain statement      | Problem described in the participant's terms                         |
| Existing workaround | Current behavior, tool, or cost used to address the pain             |
| Proposed outcome    | Observable improvement offered by the experiment                     |
| Experiment          | Time-bounded test with method, threshold, and stop condition         |
| Acquisition channel | How a participant encountered the experiment                         |
| Participant         | Person taking part, represented with minimal identifiers             |
| Consent record      | Versioned permission, purpose, and timestamp                         |
| Activation event    | Observable behavior that indicates value was reached                 |
| Interview           | Structured qualitative conversation and attributed notes             |
| Evidence item       | Observation with source, timestamp, strength, and limitations        |
| Payment signal      | Price and unit requested, objection, and resulting outcome           |
| Experiment decision | Continue, Iterate, Pivot, Pause, Kill, or Scale                      |

## Evidence strength

Record the strongest action actually observed. Do not promote a weaker signal because
the participant sounded enthusiastic.

| Class                | Meaning                                                                | Examples                                                                                             |
| -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Opinion              | A belief or preference with no claim of future action                  | “Receipt admin is annoying”; a feature preference                                                    |
| Stated intent        | A claim about a future action without a present cost                   | “I would try that”; “I would probably pay”                                                           |
| Observed behaviour   | Past or present action, directly described or witnessed                | A recent workaround, a redacted artefact, use of a delivered result                                  |
| Commitment           | An action that costs time, access, reputation, or another scarce asset | Books a follow-up, supplies representative data, repeats the workflow, or makes a qualified referral |
| Financial commitment | An accepted obligation involving money under explicit terms            | Pays, places a deposit, pre-orders, or signs an enforceable paid commitment                          |

An actual settled payment is stronger than a promise, deposit, or signed commitment.
Interview participation is a commitment of time, not product usage. A payment request
followed by a refusal is useful observed behaviour, not a financial commitment.

## Required hypothesis fields

- Identifier and owner
- Target segment
- Pain statement
- Existing workaround
- Proposed outcome
- Riskiest assumption
- Acquisition channel
- Activation definition
- Evidence threshold
- Payment test
- Start and review dates

## Minimum durable record

Until repeated experiments demonstrate a need for software, keep each experiment under
`docs/experiments/<experiment-id>/` using:

1. `experiment.md` for the versioned hypothesis, segment, method, thresholds, owner,
   consent approach, start date, stop condition, and planned decision date;
2. `ledger.yaml` for de-identified acquisition, outreach, screening, behaviour,
   fulfilment, payment, referral, and decision events;
3. `interviews/<participant-code>.md` for consented, de-identified notes and verbatim
   language; and
4. `decision.md` for the evidence-cited outcome, counter-evidence, limitations, owner,
   date, and exact next action.

Personal identifiers, contact details, recordings, real receipts, and private financial
data do not belong in Git. Use stable participant codes in repository records. Keep any
necessary code-to-contact mapping in the founder-controlled communication tool for the
approved retention period.

Every `ledger.yaml` entry has:

- a unique event identifier and event type;
- UTC date and time;
- participant code when applicable;
- acquisition source and outreach-message version when applicable;
- evidence class;
- a concise observation;
- a source reference that permits verification without copying private data;
- known limitations or counter-evidence.

Use the following event-specific fields:

| Event type            | Additional fields                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Acquisition source    | Channel, audience location, access owner, and any direct cost                                   |
| Outreach attempt      | Eligibility basis, attempt number, reply outcome, and founder minutes                           |
| Participant screening | Answers, eligible result, exclusion reason, and consent status                                  |
| Interview             | Guide version, duration, frequency, severity, workaround, verbatim language, and trust concerns |
| Fulfilment session    | Data class, promised outcome, active minutes, elapsed time, errors, corrections, and result use |
| Activation            | Predefined value event, whether observed, time, and source                                      |
| Repeat usage          | Prior activation reference, repeated action, interval, and whether prompted                     |
| Payment request       | Price, currency, unit, terms, request time, response, objection, and outcome                    |
| Referral              | Qualification requested, referral action, and whether the referred person completed screening   |
| Experiment decision   | Threshold results, supporting evidence, counter-evidence, limitations, outcome, owner, and date |

Trust concerns can be recorded on interviews, fulfilment sessions, or payment requests.
Record a separate trust event when a concern changes participation or causes the
experiment to pause.

## Decision rule

An experiment decision is one of `Continue`, `Iterate`, `Pivot`, `Pause`, `Kill`, or
`Scale`. Older Phase 1 catalogue language uses `Reject`; treat it as `Kill` when
creating a new evidence-cycle decision.

It records cited evidence items, counter-evidence, sample limitations, manual fulfilment
time, observed accuracy, payment signal, decision owner, and decision date. A completed
feature or passing test is delivery evidence only.
