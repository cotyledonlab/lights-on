# Phase 1 implementation plan

## Outcome

A new developer can clone the repository, start PostgreSQL, run the web and
worker processes, complete the synthetic receipt-review journey, and run the
same checks used by basic CI. GitHub roadmap automation is inspectable and
safe-by-default, but is not applied during Phase 1.

## Scope

1. Establish repository governance, ADRs, delivery documentation, and issue
   templates.
2. Create a pnpm/Turborepo TypeScript monorepo with strict type checking.
3. Add a Next.js App Router web app and a PostgreSQL-backed worker.
4. Define provider boundaries and local/fake implementations.
5. Add local PostgreSQL through Docker Compose.
6. Implement the landing, signup, submission, extraction, human review,
   result, analytics, payment-interest, health, and deletion paths.
7. Add unit, integration, browser, build, and container checks.
8. Add least-privilege basic CI.
9. Add dry-run-first GitHub roadmap automation and its manual project setup
   guide.
10. Capture Gate 1 evidence and stop.

## Out of scope

- Hetzner, DNS, Dokploy, object-storage, or other external provisioning.
- Preview, development, or production deployment.
- Real authentication, billing, email, analytics, object storage, or AI
  provider credentials.
- Arbitrary file upload or live receipt extraction.
- Stripe live or test mode.
- GitHub issue, label, milestone, or project mutation during Phase 1.

## Work sequence

1. Governance and documented decisions.
2. Toolchain and workspace scaffold.
3. Database schema and provider contracts.
4. Health endpoint and test.
5. Participant signup and consent.
6. Submission, queue, and deterministic extraction.
7. Local reviewer authentication and correction.
8. Result, analytics, payment signal, and deletion.
9. CI, roadmap automation, and end-to-end verification.
10. Gate 1 evidence report.

## Verification

```bash
make doctor
make format-check
make lint
make typecheck
make test
make test-e2e
make build
make docker-build
./scripts/bootstrap-github.sh --dry-run
git grep -nE '(BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|AKIA[0-9A-Z]{16})'
```

## Estimate

- Size: decomposed (the overall phase is XL)
- Focused engineering hours: 29–49
- Confidence: medium
- Key uncertainty: cross-package build and database-backed browser-test
  behavior on the local macOS/Docker toolchain

## Human stop gate

Gate 1 is a human decision. Passing local checks supplies evidence but does not
approve deployment, roadmap mutation, or Phase 2.

