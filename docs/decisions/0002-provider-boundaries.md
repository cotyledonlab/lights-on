# ADR 0002: Provider boundaries and local fakes

- Status: Accepted for Phase 1
- Date: 2026-07-26

## Context

Authentication, billing, email, analytics, storage, jobs, and AI capabilities will
eventually use external services. Coupling product behavior directly to those services
would make experiments expensive and tests fragile.

## Decision

Define narrow interfaces for `AuthProvider`, `BillingProvider`, `EmailProvider`,
`AnalyticsProvider`, `ObjectStorageProvider`, `JobQueue`, and `AiModelProvider`. Phase 1
uses local or deterministic implementations. Receipt extraction is deterministic and
never calls a live model.

## Consequences

- Product behavior is testable without credentials or network access.
- Provider selection remains reversible.
- Fake behavior must be intentionally limited so it is not mistaken for production
  security or delivery behavior.
- Provider-specific features enter the domain only through a reviewed interface change.
