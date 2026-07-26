# ADR 0003: PostgreSQL-backed jobs

- Status: Accepted for Phase 1
- Date: 2026-07-26

## Context

The thin slice needs asynchronous extraction, but low idle cost is more important than
extreme queue throughput.

## Decision

Store queue jobs in PostgreSQL. A separate worker claims available rows using
transactions, records attempts, and uses idempotent job identifiers. Receipt jobs carry
an optional foreign key to their submission so participant deletion cascades through
active work. Claim attempts fence completion and failure mutations; a stale worker
cannot overwrite a reclaimed lease. Terminal receipt-job failures update the linked
submission in the same transaction.

## Consequences

- Local development needs only PostgreSQL.
- Business data and queue operations share backup and operational tooling.
- Polling is sufficient for experiment volume but is not intended for high-throughput
  scheduling.
- Queue ownership and receipt failure state remain consistent under concurrent deletion,
  worker crashes, and stale-lease recovery.
- Redis will be considered only after a measured latency or contention problem.
