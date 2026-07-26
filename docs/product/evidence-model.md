# Product evidence model

Software completion is not validation. Every experiment decision must cite
observed evidence.

## Terms

| Entity | Meaning |
| --- | --- |
| Product hypothesis | Falsifiable belief connecting a segment, pain, outcome, and behavior |
| Target segment | Narrow group expected to share the pain |
| Pain statement | Problem described in the participant's terms |
| Existing workaround | Current behavior, tool, or cost used to address the pain |
| Proposed outcome | Observable improvement offered by the experiment |
| Experiment | Time-bounded test with method, threshold, and stop condition |
| Acquisition channel | How a participant encountered the experiment |
| Participant | Person taking part, represented with minimal identifiers |
| Consent record | Versioned permission, purpose, and timestamp |
| Activation event | Observable behavior that indicates value was reached |
| Interview | Structured qualitative conversation and attributed notes |
| Evidence item | Observation with source, timestamp, strength, and limitations |
| Payment signal | Price shown and resulting commitment or refusal |
| Experiment decision | Continue, Iterate, Pause, Reject, or Scale |

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

## Decision rule

An experiment decision is one of `Continue`, `Iterate`, `Pause`, `Reject`, or
`Scale`. It records cited evidence items, counter-evidence, sample limitations,
manual fulfilment time, observed accuracy, payment signal, decision owner, and
decision date. A completed feature or passing test is delivery evidence only.

