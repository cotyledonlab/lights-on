# ADR 0003: PostgreSQL-backed jobs

- Status: Accepted for Phase 1
- Date: 2026-07-26

## Context

The thin slice needs asynchronous extraction, but low idle cost is more important than
extreme queue throughput.

## Decision

Store queue jobs in PostgreSQL. A separate worker claims available rows using
transactions, records attempts, and uses idempotent job identifiers.

## Consequences

- Local development needs only PostgreSQL.
- Business data and queue operations share backup and operational tooling.
- Polling is sufficient for experiment volume but is not intended for high-throughput
  scheduling.
- Redis will be considered only after a measured latency or contention problem.
