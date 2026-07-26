# Phase 1 threat model

## System and trust boundaries

The browser talks to the Next.js web application. The web application and
worker talk to local PostgreSQL. Phase 1 has no outbound provider calls and no
public deployment. Participant and reviewer sessions cross the browser/server
trust boundary. Synthetic receipt text crosses an untrusted-input boundary.

## Protected assets

- Participant email and consent record
- Opaque session tokens
- Synthetic purchase data and corrected result
- Reviewer-only pending work
- Analytics and audit events
- Database credentials and reviewer access code

## Principal threats and controls

| Threat | Phase 1 control | Remaining limitation |
| --- | --- | --- |
| Credential disclosure | Secrets are environment-only, ignored by Git, and never logged | Local developer controls their machine |
| Session theft | Random opaque tokens, SHA-256 storage, HTTP-only SameSite cookies, Secure in production | No external identity assurance |
| Reviewer impersonation | Constant-time access-code comparison and separate reviewer session | Shared-code auth is local-only |
| CSRF | SameSite cookies and Next.js Server Action origin validation | Reassess when external auth is added |
| Public mutation abuse | Zod validation, body limits, and process-local rate limits | Multi-instance rate limiting is deferred |
| Injection | Prisma parameterization and escaped React output | Dependencies still require scanning |
| Sensitive logs | Structured logging allow-list; no raw input, email, or token logging | Operator discipline remains required |
| Privilege confusion | Participant-owned queries and reviewer-only mutations | Add role-based external auth before Gate 3 |
| Data retention | Participant deletion pathway and minimal fields | Retention scheduling is deferred |
| Supply-chain compromise | Frozen lockfile, dependency audit, Renovate, secret and container scans in CI | Scanner findings require human triage |
| Backup disclosure | No Phase 1 backups; future backups require encryption and isolated keys | Restore controls begin in Phase 2 |

## Privacy posture

Only synthetic records belong in Phase 1. Email is collected for early access,
consent is explicit, analytics use internal identifiers, and raw input is not
placed in log or analytics properties. Participant deletion removes related
sessions, submissions, jobs, results, consent, payment signals, and analytics
through database cascades or an explicit transaction.

## Security gates

- Gate 1: confirm no committed secrets and validate local controls.
- Gate 2: review infrastructure plan, firewall policy, costs, and destruction.
- Gate 3: replace or explicitly approve local reviewer auth, review consent and
  analytics, and test deletion before inviting external users.
- Gate 5: review restore, monitoring, rollback, and credential rotation before
  production infrastructure.

