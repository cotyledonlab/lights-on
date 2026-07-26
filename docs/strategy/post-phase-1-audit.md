# Post-Phase-1 repository audit

**Prepared:** 2026-07-27

**Repository state audited:** `main` at `cb11aba01b641a79a1146036a7142620a29aeb5d`
(`feat(delivery): complete Phase 1 scaffold (#1)`)

**Scope:** Research and sequencing audit only

This report does not approve a human gate, select a market, redesign the roadmap,
authorize infrastructure, or treat software completion as customer evidence. “Complete”
below means complete for the bounded Phase 1/local acceptance criteria, not ready for
external users or production.

## 1. Verified repository facts

### 1.1 Source and gate state

- The tracked checkout was clean, on `main`, and matched `origin/main` at the commit
  above before the audit. It remained clean after validation and before this report was
  added.
- Phase 1 deliberately implements one local-only, synthetic ingest → process → human
  review → result demonstration (`README.md:1-18`;
  `docs/delivery/implementation-plan.md:5-32`).
- Gate 1 evidence says the Phase 1 technical criteria passed, but the repository still
  records Gate 1 as awaiting explicit human approval
  (`docs/delivery/gate-1-evidence.md:5-14`; `docs/delivery/current-gates.md:3-14`).
  Merging PR #1 did not update that recorded human-gate state.
- Gate 0 is not recorded. Gates 2 through 6 are not started
  (`docs/delivery/current-gates.md:3-14`). The repository therefore does not authorize
  infrastructure provisioning, an external-user release, production provisioning,
  workflow automation, or live monetisation.
- The four ADRs are all “Accepted for Phase 1.” They choose a TypeScript monorepo,
  provider boundaries with local fakes, PostgreSQL-backed jobs, and local opaque-session
  authentication with synthetic input (`docs/decisions/0001-typescript-monorepo.md`;
  `docs/decisions/0002-provider-boundaries.md`;
  `docs/decisions/0003-postgresql-backed-jobs.md`;
  `docs/decisions/0004-local-auth-and-synthetic-input.md`).
- `docs/product/` contains one evidence-model document. It defines the vocabulary and
  required fields for experiments, but the repository has no instantiated product
  hypothesis, target segment, pain statement, acquisition channel, evidence threshold,
  interview, evidence item, experiment decision, or decision owner/date
  (`docs/product/evidence-model.md:1-44`;
  `packages/database/prisma/schema.prisma:40-170`).

### 1.2 Baseline validation

The validation sequence documented in `docs/delivery/implementation-plan.md:46-57` was
run against the clean tracked checkout. The current results agree with the prior Gate 1
report.

| Exact command                                                                                                                                                            | Result                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `make doctor`                                                                                                                                                            | Pass. Git, Node, pnpm, Docker, and OpenSSL were available inside the `mise` environment; Node was `v24.18.0`; Docker was healthy; `.env` mode was `600`; no environment file was tracked.                                                                                                                                                |
| `make format-check`                                                                                                                                                      | Pass. Prettier reported that all matched files use the configured style.                                                                                                                                                                                                                                                                 |
| `make lint`                                                                                                                                                              | Pass. 14 of 14 workspace lint tasks succeeded, all from the local Turbo cache.                                                                                                                                                                                                                                                           |
| `make typecheck`                                                                                                                                                         | Pass. Root TypeScript and 14 of 14 workspace type-check tasks succeeded, all workspace tasks from cache; Prisma Client generation succeeded.                                                                                                                                                                                             |
| `make test`                                                                                                                                                              | Pass. 11 unit tests passed (3 validation, 1 extraction, 7 web) and 6 PostgreSQL integration tests passed (1 web health, 5 worker/queue). The worker unit command found no non-integration test files and intentionally exited successfully via `--passWithNoTests`.                                                                      |
| `make test-e2e`                                                                                                                                                          | The first parallel audit attempt failed because port 3000 was already occupied by another validation process, not because a journey assertion failed. After the port was free, reruns passed. This audit's rerun completed one Chromium signup-to-deletion journey in 11.9 seconds.                                                      |
| `make build`                                                                                                                                                             | Pass. 14 of 14 workspace build tasks succeeded from cache. Next.js produced the documented app routes and the worker bundle was produced.                                                                                                                                                                                                |
| `make docker-build`                                                                                                                                                      | Pass. Both `lights-on-web:local` and `lights-on-worker:local` images built successfully. The worker Prisma client was generated in the image.                                                                                                                                                                                            |
| `docker run --rm lights-on-worker:local node -e "import('@prisma/client').then(() => process.stdout.write('prisma-client-ok\n'))"`                                       | Pass, exit 0: `prisma-client-ok`. This verifies the packaged worker image can import its generated Prisma client.                                                                                                                                                                                                                        |
| `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:0.72.0 image --exit-code 1 --ignore-unfixed --severity CRITICAL,HIGH lights-on-web:local`    | Pass, exit 0: 0 HIGH/CRITICAL findings under the command's `--ignore-unfixed` policy.                                                                                                                                                                                                                                                    |
| `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:0.72.0 image --exit-code 1 --ignore-unfixed --severity CRITICAL,HIGH lights-on-worker:local` | Pass, exit 0: 0 HIGH/CRITICAL findings under the command's `--ignore-unfixed` policy.                                                                                                                                                                                                                                                    |
| `docker run --rm -v "$PWD:/repo" ghcr.io/gitleaks/gitleaks:v8.30.1 detect --source=/repo --no-banner --redact`                                                           | Pass: no leak found in the tracked repository/history scan.                                                                                                                                                                                                                                                                              |
| `./scripts/bootstrap-github.sh --dry-run`                                                                                                                                | Pass. Authentication and catalogue validation succeeded; 177 actions were planned, 0 skipped, and `mutationPerformed` was `false`. The script reported that no GitHub labels, milestones, issues, relationships, or project items changed. The ignored machine report was restored to its pre-audit contents after recording the result. |
| Tracked secret-pattern check (exact command below)                                                                                                                       | Expected no-match result: no output and exit status 1. This is a narrow tracked-source pattern check, not a substitute for the CI Gitleaks scan.                                                                                                                                                                                         |
| `pnpm audit --audit-level high`                                                                                                                                          | Did not run in the unactivated shell: `pnpm` was not on `PATH` (exit 127).                                                                                                                                                                                                                                                               |
| `mise exec -- pnpm audit --audit-level high`                                                                                                                             | Pass at the requested high-severity threshold; 0 high/critical and one low-severity vulnerability.                                                                                                                                                                                                                                       |
| `mise exec -- pnpm audit --json`                                                                                                                                         | Expected exit 1 because an advisory exists. It identified one dev-only `esbuild` 0.27.7 advisory (`GHSA-g7r4-m6w7-qqqr`, arbitrary file read from the Windows development server), via worker `tsup`/`vitest` paths; patched in 0.28.1. Metadata: 1 low, 0 moderate/high/critical.                                                       |
| `git status --short --branch`                                                                                                                                            | Before the report: `## main...origin/main` with no tracked changes.                                                                                                                                                                                                                                                                      |

The exact tracked-source pattern command was:

```bash
git grep -nE '(BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|AKIA[0-9A-Z]{16})'
```

The following read-only inspection commands were also run. Their concise result was the
source inventory and evidence used in this report.

```bash
pwd
git status --short --branch
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline --decorate
rg --files -g 'AGENTS.md' -g '!node_modules' -g '!vendor' | sort
rg --files | sort
git ls-files | sort
find . -maxdepth 4 -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './.turbo/*' | sort
```

Result: the repository root was `/Users/johnmaher/code/lights-on`; only the root
`AGENTS.md` applies to this report; `infra/AGENTS.md` adds stricter rules below
`infra/`; all requested documents and the app/package/infra trees were present. The
`find` result also showed ignored local `.env`, build, test, and roadmap-report
artifacts; it did not show a pristine newly cloned directory. “Clean checkout” here
therefore means a clean tracked Git checkout, not an empty clone with no ignored local
state.

```bash
sed -n '1,260p' AGENTS.md
sed -n '1,320p' BOOTSTRAP_PROMPT.md
sed -n '261,620p' BOOTSTRAP_PROMPT.md
sed -n '621,980p' BOOTSTRAP_PROMPT.md
sed -n '981,1200p' BOOTSTRAP_PROMPT.md
for f in README.md docs/architecture/*.md docs/decisions/*.md docs/product/* \
  docs/delivery/* docs/operations/* docs/runbooks/*; do
  echo "===== $f ====="
  sed -n '1,260p' "$f"
done
```

Result: `AGENTS.md`, all 1,115 lines of `BOOTSTRAP_PROMPT.md`, Gate 1 evidence, all four
ADRs, all files under `docs/product/` and `docs/delivery/`, and the related repository
architecture, operations, and runbook documents were read.

```bash
sed -n '1,520p' scripts/bootstrap-github.sh
jq -r '.issues[] | [.key,.kind,.title,.parent,.outcome,.gate,.size,.hours] | @tsv' \
  scripts/github-roadmap.json
rg -n "AuthProvider|BillingProvider|EmailProvider|AnalyticsProvider|ObjectStorageProvider|JobQueue|AiModelProvider|billingProvider|emailProvider|objectStorageProvider|NEXT_PUBLIC_APP_URL|LOG_LEVEL|WORKER_HEALTH_PORT|analyticsEvents" \
  --glob '!pnpm-lock.yaml' --glob '!scripts/github-roadmap.json'
```

Result: the roadmap source contains 75 items: 7 initiatives, 57 epics, 3 stories, 1
task, and 7 gates (`docs/delivery/issue-catalogue.md:1-6`). The script defaults to
dry-run, validates catalogue evidence fields, reads current GitHub state, avoids exact
title duplication, attempts native sub-issues with a task-list fallback, and writes a
local machine report (`scripts/bootstrap-github.sh:1-93,169-215,324-435`). It does not
create or configure a GitHub Project; that remains a manual process
(`docs/delivery/github-project-setup.md:1-45`). The catalogue records hierarchy parents
but no cross-capability dependency field; generated bodies tell maintainers to link
concrete prerequisites later (`scripts/bootstrap-github.sh:258-270`).

Line-numbered inspection (`nl -ba`) was run over:

- every source file in `apps/web/src`, `apps/worker/src`, and their tests;
- every `packages/*/src` implementation and test;
- the Prisma schema and migrations;
- the Playwright journey and configuration;
- the Makefile, local scripts, CI workflow, Dockerfiles, Compose file, environment
  template, package manifests, Renovate configuration, and infrastructure placeholders.

### 1.3 Implementation inventory

Status terms in this table are repository observations, not roadmap changes:

- **Complete (Phase 1):** satisfies the bounded local Phase 1 outcome.
- **Partial:** working code exists, but the corresponding roadmap outcome or external
  safety requirement is not met.
- **Unused:** a contract/implementation exists but no production-source caller uses it.
- **Planned only:** documentation, issue catalogue, or placeholder directories exist,
  without an implementation.

| Area                                     | Status                                               | Verified current state                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository governance and documentation  | Complete (Phase 1), with unapplied roadmap state     | Root and infra instructions, issue templates, CODEOWNERS, PR template, four ADRs, threat model, delivery/product/operations docs, runbooks, Renovate config, and safe-by-default roadmap automation exist. Planned labels, milestones, issues, relationships, Project fields, and views have not been applied.                                                                                                                                                   |
| TypeScript workspace and local toolchain | Complete (Phase 1)                                   | pnpm workspaces, Turborepo, strict TypeScript, pinned Node/pnpm, `mise`, Make targets, bootstrap/doctor scripts, and a single lockfile validate successfully (`package.json`; `turbo.json`; `Makefile`; `scripts/bootstrap-local.sh`; `scripts/doctor.sh`).                                                                                                                                                                                                      |
| Local database                           | Complete (Phase 1)                                   | PostgreSQL 17 runs on loopback through Compose; Prisma has three migrations and models the receipt experiment, sessions, queue, analytics, consent, results, and payment-interest records (`docker-compose.yml`; `packages/database/prisma/schema.prisma`).                                                                                                                                                                                                      |
| Synthetic receipt journey                | Complete (Phase 1)                                   | Landing, consent/signup, synthetic text intake, queueing, deterministic extraction, reviewer correction, participant-owned result, payment-interest response, health, event capture, and participant deletion all execute locally and are covered by one browser journey (`apps/web/src/app`; `apps/worker/src`; `e2e/receipt-journey.spec.ts`).                                                                                                                 |
| PostgreSQL queue                         | Partial toward the roadmap epic; strong Phase 1 core | Enqueue is idempotent by `jobKey`; claims use `FOR UPDATE SKIP LOCKED`; stale leases, retry attempts, terminal failures, participant-deletion cascades, and stale completion/failure fencing are implemented and integration-tested (`packages/queue/src/index.ts:26-207`; `apps/worker/tests/integration/extraction-job.test.ts:33-236`). It has no operator UI, metrics, alerting, manual retry/dead-letter operation, or generalized job-handler registry.    |
| Authentication                           | Partial/local                                        | Opaque participant and reviewer tokens are HMAC-digested in PostgreSQL; cookies are HTTP-only, SameSite strict, and Secure in production. Participants receive a session at signup; there is no registration/sign-in/recovery identity flow. Reviewer access is one environment code and one undifferentiated reviewer role (`packages/auth/src/index.ts`; `apps/web/src/lib/cookies.ts`). ADR 0004 explicitly says this must be replaced before external users. |
| Consent and deletion                     | Partial                                              | Signup writes a version and purpose; copy warns that only synthetic data is allowed; participant deletion cascades through related local records and is browser-tested (`apps/web/src/app/actions.ts:40-89,273-280`; `apps/web/src/app/privacy/page.tsx`; Prisma relations). There is no retention schedule, export path, lost-session deletion/recovery path, provider deletion, or backup deletion behavior.                                                   |
| Transactional email                      | Partial/fake                                         | `EmailProvider` and a no-delivery fake exist. Signup calls the fake and ignores the returned delivery ID. The declared `result-ready` purpose has no caller, so the asynchronous result is not announced to a participant (`packages/email/src/index.ts`; `apps/web/src/app/actions.ts:77-86`).                                                                                                                                                                  |
| Product analytics                        | Partial/local                                        | Seven receipt-funnel event names are stored in PostgreSQL. The event endpoint bounds body size, validates event names, rate-limits, and checks submission ownership (`packages/product-analytics/src/index.ts`; `apps/web/src/app/api/events/route.ts`). There is no acquisition-channel model, stable cross-experiment taxonomy, query/report surface, unique-visitor identity, retention measurement, or external analytics provider.                          |
| Logging and error monitoring             | Partial                                              | A structured logger allow-lists context keys and the worker logs lifecycle/job outcomes (`packages/observability/src/index.ts`; `apps/worker/src`). There is no error-monitoring provider, alerting, trace/metric capture, review of server-rendering errors, or operator notification.                                                                                                                                                                          |
| Deterministic extraction                 | Partial/experiment-specific                          | An `AiModelProvider`-named interface exposes only `extractReceipt`; the worker directly constructs its deterministic receipt implementation. One happy-path unit test exists. No live provider, evaluation set, accuracy calculation, confidence, field provenance, or model/human comparison record exists (`packages/extraction/src/index.ts`; `apps/worker/src/process-job.ts:7-40`).                                                                         |
| Billing                                  | Unused placeholder plus a separate local signal      | `BillingProvider` only answers `canCharge()` and the disabled instance has no caller (`packages/payments/src/index.ts`). Separately, the result page hard-codes a €5/month interest question and stores one current response plus analytics events; it never charges (`apps/web/src/components/payment-interest-form.tsx`; `apps/web/src/app/actions.ts:222-270`).                                                                                               |
| Object storage                           | Unused placeholder                                   | The generic-looking contract and disabled implementation exist, but no production source imports them. Calls would reject (`packages/storage/src/index.ts`).                                                                                                                                                                                                                                                                                                     |
| Shared UI                                | Complete for its small scope                         | `Button` and `Field` are source-first shared primitives; the web app also has a reusable submit button. Most layout and visual rules remain app-level (`packages/ui/src`; `apps/web/src/components/submit-button.tsx`; `apps/web/src/app/styles.css`).                                                                                                                                                                                                           |
| CI                                       | Complete (Phase 1)                                   | One least-privilege workflow on PRs and pushes to `main` performs frozen install, migration, formatting, lint, types, unit/integration/browser tests, build, high-threshold dependency audit, Gitleaks, image builds, and Trivy scans. Actions and base images are digest-pinned (`.github/workflows/ci.yml`; Dockerfiles).                                                                                                                                      |
| Container delivery                       | Partial                                              | Local non-root web and worker images build from a pinned base and exclude local secrets. There is no registry publication, immutable release metadata, development deployment, production release, or preview workflow (`docker/*.Dockerfile`; `.github/workflows/ci.yml`; `docs/delivery/issue-catalogue.md:20-29`).                                                                                                                                            |
| Infrastructure and operations            | Planned only beyond local                            | `infra/` contains Phase 2 README placeholders only. OpenTofu, Ansible, Hetzner, Dokploy, firewall, backup/restore, deployment, rollback, monitoring, and environment-specific provider-rotation implementations do not exist (`infra/README.md`; `infra/**/README.md`; `docs/operations/README.md`).                                                                                                                                                             |
| Product evidence system                  | Documentation only                                   | The evidence vocabulary is documented, but the Prisma schema and app do not persist hypotheses, experiments, acquisition channels, interviews, evidence items, thresholds, or decisions. No evidence dashboard or decision record exists (`docs/product/evidence-model.md`; `packages/database/prisma/schema.prisma`).                                                                                                                                           |

### 1.4 Documented remaining limitations and risks

These are explicit repository statements rather than new conclusions:

- No external deployment, user access, paid resource, production backup, restore
  evidence, or monitoring exists (`docs/delivery/gate-1-evidence.md:57-68`).
- Local reviewer authentication must be replaced before Gate 3/external users
  (`docs/decisions/0004-local-auth-and-synthetic-input.md:17-22`;
  `docs/architecture/threat-model.md:35-48`).
- The rate limiter is process-local and not a distributed production control
  (`docs/delivery/gate-1-evidence.md:57-63`).
- Retention scheduling is deferred; Phase 1 backups do not exist; future backups require
  encryption, isolated keys, and restore controls
  (`docs/architecture/threat-model.md:24-33`).
- PostgreSQL polling is intended for experiment volume, not high-throughput scheduling;
  Redis is deferred until latency or contention is measured
  (`docs/decisions/0003-postgresql-backed-jobs.md:20-28`).
- Fake-provider behavior is not production security or delivery behavior
  (`docs/decisions/0002-provider-boundaries.md:19-24`).
- Provider-specific rotation procedures have not been added
  (`docs/runbooks/credential-rotation.md:1-13`).
- The current audit still reports one low-severity dependency vulnerability.

## 2. Reasonable inferences

This section interprets the verified code and documentation. These statements have not
been demonstrated by customer evidence and are not gate approvals.

### 2.1 Correctness, privacy, security, and operational risk

| Area                                      | Inference                                                                                                                                                                                                                                                                                                                                                                                                                                             | Repository basis                                                                                                                                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correctness: review replay and races      | Any authenticated reviewer who retains a completed job URL can submit another correction. The detail page does not reject completed jobs, and `completeReviewAction` unconditionally upserts the result and updates the job. Concurrent or replayed reviews can therefore overwrite the participant-visible “human checked” result without an immutable correction history.                                                                           | `apps/web/src/app/review/[jobId]/page.tsx:19-52`; `apps/web/src/app/actions.ts:153-219`                                                                                                                     |
| Correctness: queue lease fencing          | Queue completion/failure is fenced by attempt, but receipt business writes occur before `queue.complete`. A slow stale worker can update extracted fields/create a review job after its lease was reclaimed; the eventual completion is rejected, but the business write is not. The deterministic fake makes conflicting output unlikely today, while a live/non-deterministic processor would make this material.                                   | `apps/worker/src/process-job.ts:13-40,43-71`; `packages/queue/src/index.ts:139-203`                                                                                                                         |
| Correctness: participant result selection | The result page shows only the newest submission. If a participant submits again, a newer queued or failed record hides an older completed result. The payment action independently selects the latest completed result, so the page and recorded signal can refer to different submissions.                                                                                                                                                          | `apps/web/src/app/result/page.tsx:20-55`; `apps/web/src/app/actions.ts:238-268`                                                                                                                             |
| Correctness: failure recovery             | A failed submission is displayed using the same “in the queue” page, with no retry, support, or operator recovery path. Queue failures can become terminal but are only visible in local logs/database state.                                                                                                                                                                                                                                         | `apps/web/src/app/result/page.tsx:30-55`; `packages/queue/src/index.ts:155-203`                                                                                                                             |
| Evidence integrity                        | Client beacons can be blocked, are not idempotent, and are emitted again on reload. Anonymous landing events have no acquisition/session/visitor key. Payment-interest analytics append an event on every response change while the payment-signal row stores only the latest response. The database therefore cannot yet produce a trustworthy unique-visitor conversion funnel or an unambiguous history of payment intent.                         | `apps/web/src/components/event-beacon.tsx`; `apps/web/src/app/api/events/route.ts`; `apps/web/src/app/actions.ts:247-268`; `packages/database/prisma/schema.prisma:123-150`                                 |
| Evidence integrity                        | The schema stores extracted and corrected values separately, but it does not record field-level corrections, extraction confidence, reviewer identity, active fulfilment time, or accuracy evaluation. `ReviewJob.createdAt` to `completedAt` measures elapsed queue time, not manual effort. Gate 4 evidence cannot be derived as specified.                                                                                                         | `packages/database/prisma/schema.prisma:76-121`; `apps/web/src/app/actions.ts:184-217`; `docs/delivery/current-gates.md:8`                                                                                  |
| Privacy: accidental real data             | Warnings do not technically prevent a user from pasting a real receipt or other personal data. Raw text is then stored in plaintext in PostgreSQL and shown to anyone holding the shared reviewer credential. External use would turn a synthetic-only operational assumption into a data-handling risk.                                                                                                                                              | `apps/web/src/components/synthetic-receipt-form.tsx:20-50`; `packages/database/prisma/schema.prisma:76-97`; `apps/web/src/app/review/[jobId]/page.tsx:19-52`                                                |
| Privacy: deletion reachability            | “Delete at any time” depends on retaining the opaque participant cookie. There is no sign-in/recovery flow, authenticated support operation, or deletion request path after cookie expiry/loss. When real email/analytics/storage/backup providers are added, the current database cascade will not prove end-to-end deletion.                                                                                                                        | `apps/web/src/app/privacy/page.tsx:24-34`; `apps/web/src/lib/session.ts`; `packages/auth/src/index.ts:42-83`; `apps/web/src/lib/submissions.ts:22-24`                                                       |
| Privacy: consent and retention            | Consent has a hard-coded version and purpose but no copy snapshot/hash, retention duration, withdrawal state, human-access acknowledgement record, or acquisition context. There is no scheduled deletion. This is insufficient evidence for a real-data experiment until a human reviews the precise purpose and jurisdiction.                                                                                                                       | `apps/web/src/app/actions.ts:56-71`; `packages/database/prisma/schema.prisma:52-61`; `docs/architecture/threat-model.md:27-33`                                                                              |
| Security: participant impersonation       | Signup treats possession of an email address as identity proof. Entering an existing participant's email causes an upsert to return that participant and immediately issues a new session for the same record, without an email challenge. If externally reachable, this would allow account takeover, result access, payment-signal changes, and participant-data deletion by anyone who knows the email address.                                    | `apps/web/src/app/actions.ts:40-88`; `packages/auth/src/index.ts:42-52`; `apps/web/src/app/result/page.tsx:15-28`; `apps/web/src/app/actions.ts:222-280`                                                    |
| Security: reviewer privilege              | One shared code grants access to every pending raw submission. There is no reviewer identity, role, assignment, per-job claim, privileged-operation audit record, or brute-force control beyond a per-process rate bucket. This cannot establish who saw or changed a record.                                                                                                                                                                         | `packages/auth/src/index.ts:55-99,110-118`; `apps/web/src/app/review/page.tsx`; `apps/web/src/app/actions.ts:123-219`                                                                                       |
| Security/availability: rate limiting      | With the documented default `TRUST_PROXY_HEADERS=false`, all direct callers share one bucket per operation, so ten attempts in a minute can throttle all experiment participants for that process. With it set to true, safety depends on a reviewed proxy overwriting inbound forwarding headers. Buckets are per-process, reset on restart, and are never globally evicted, so they are neither a distributed control nor a bounded-memory control. | `apps/web/src/lib/request.ts`; `apps/web/src/lib/rate-limit.ts`; `docs/runbooks/local-development.md:16-22`                                                                                                 |
| Security baseline for external access     | Secure cookies switch on in production, but no HTTPS termination, firewall, host hardening, external identity, CSP/HSTS policy, secret delivery, or deployed rate-limit boundary exists. The current app is safe only inside its documented local trust boundary.                                                                                                                                                                                     | `apps/web/src/lib/cookies.ts`; `infra/README.md`; `docs/architecture/threat-model.md`                                                                                                                       |
| Operational: asynchronous result delivery | The workflow is asynchronous but no result-ready message is sent. External participants would have to poll or be contacted manually outside the system. The fake email call at signup cannot prove delivery, bounce handling, or privacy-safe failure behavior.                                                                                                                                                                                       | `packages/email/src/index.ts`; `apps/web/src/app/actions.ts:77-86`; `apps/web/src/app/result/page.tsx:30-55`                                                                                                |
| Operational: health and liveness          | Web and worker health endpoints prove database connectivity, not that queue age, job success, email delivery, or reviewer capacity is healthy. The worker health server binds to `127.0.0.1` inside the process/container and the worker Dockerfile declares no health check, so a future orchestrator check needs deliberate wiring.                                                                                                                 | `apps/web/src/app/api/health/route.ts`; `apps/worker/src/index.ts:16-40`; `docker/worker.Dockerfile`                                                                                                        |
| Operational: release safety               | Local and CI migrations run automatically, while deployment migration ordering, backward compatibility, rollback, backup, restore, and immutable artifact promotion are unimplemented. A green local container build is not release evidence.                                                                                                                                                                                                         | `Makefile`; `.github/workflows/ci.yml`; `docs/delivery/issue-catalogue.md:20-48`                                                                                                                            |
| Coupling risk                             | Several nominal provider seams encode the receipt experiment: `ParticipantIdentity`, receipt-only AI extraction, `submissionId` in queue/analytics contracts, email-purpose literals, and a billing contract too small to express billing. They demonstrate dependency direction but are not proven reusable abstractions.                                                                                                                            | `packages/auth/src/index.ts`; `packages/extraction/src/index.ts`; `packages/queue/src/index.ts`; `packages/product-analytics/src/index.ts`; `packages/email/src/index.ts`; `packages/payments/src/index.ts` |

### 2.2 Workflow-specific versus genuinely reusable work

#### Specific to ingest → process → human review → result

- The Prisma `Submission`, `ReviewJob`, `ReceiptResult`, `PaymentSignal`, extracted
  receipt columns, and optional queue `submissionId` relationship.
- Receipt landing copy, synthetic intake, deterministic parser, `receipt.extract`
  handler, review queue/detail/form, participant result page, and €5/month
  payment-interest form.
- The state machine `QUEUED → AWAITING_REVIEW → COMPLETED/FAILED`.
- The receipt funnel event names and the participant/submission-oriented analytics
  shape.
- Reviewer shared-code authentication and the “all pending jobs” queue.
- The full Playwright journey and extraction/queue integration fixtures.
- Consent/purpose/privacy copy that promises synthetic receipt processing.

These components may be adaptable to another document-processing product, but the
repository does not show reuse across a product without ingestion, background
processing, human fulfilment, or a delayed result.

#### Genuinely reusable across unrelated product shapes

- Repository instructions, issue/PR templates, ADR/document directories, Conventional
  Commit conventions, safe dry-run roadmap mechanics, Renovate policy, and CI security
  posture.
- The pinned pnpm/Turborepo/TypeScript/ESLint/Prettier/Vitest/Playwright toolchain and
  source-first workspace structure.
- Typed environment parsing, local bootstrap/doctor checks, isolated `_test` database
  guard, Prisma client wiring, and migration convention.
- Shared `Button`, `Field`, and form-submit primitives.
- The structured log sanitizer pattern, although the current allow-list needs extension
  for another domain.
- The generic part of PostgreSQL claim/retry/lease mechanics and its concurrency tests,
  after separating the receipt-specific `submissionId` and business-write fencing.
- Non-root multi-stage container patterns and the basic database health-check pattern.

#### Promising seams, but not yet proven reusable

- Auth, email, analytics, storage, billing, and AI “provider” interfaces.
- The database analytics implementation and event beacon.
- The web/worker two-process deployment shape.
- The landing page, waitlist, review queue, evidence model, and experiment roadmap.

The distinction matters: interface existence is delivery evidence, not evidence that the
interface is deep enough or shaped correctly for a second unrelated product.

### 2.3 Evidence-gated timing classification of all roadmap capabilities

This table covers all 57 roadmap epics exactly once. Initiatives are planning
containers, and gates are approval points rather than capabilities. “Timing” means the
earliest evidence stage at which the capability should be complete under the current
roadmap and architecture; it is not approval to start it. For bundled epics, the
external-user-blocking half controls the classification (for example, deletion controls
“Data export and deletion”). Already-complete Phase 1 work remains a prerequisite rather
than new scope.

Timing values are the six requested buckets, shortened in the table as follows:

- **Next experiment:** required for the next external-user experiment.
- **After first users:** required after first external users.
- **After payment:** required after payment evidence.
- **After second experiment:** required after a second experiment.
- **Before scale:** required before production scale.
- **After PMF:** required after product-market fit.

|   # | Initiative / epic                       | Current repository status                                                   | Timing                  |
| --: | --------------------------------------- | --------------------------------------------------------------------------- | ----------------------- |
|   1 | I1 — Monorepo scaffold                  | Complete for Phase 1                                                        | Next experiment         |
|   2 | I1 — Local development environment      | Complete for Phase 1                                                        | Next experiment         |
|   3 | I1 — Testing foundation                 | Complete for the current journey; no broad provider/operations coverage     | Next experiment         |
|   4 | I1 — Documentation and ADR structure    | Complete for Phase 1                                                        | Next experiment         |
|   5 | I1 — Codex operating instructions       | Complete                                                                    | Next experiment         |
|   6 | I1 — Repository governance              | Partial: files/config exist; roadmap labels/issues/Project were not applied | Next experiment         |
|   7 | I2 — Docker build strategy              | Partial: both local images build; no immutable publication metadata         | Next experiment         |
|   8 | I2 — GitHub Actions CI                  | Complete for Phase 1 validation/scanning                                    | Next experiment         |
|   9 | I2 — Container registry publication     | Planned only                                                                | Next experiment         |
|  10 | I2 — Development deployment workflow    | Planned only                                                                | Next experiment         |
|  11 | I2 — Production release workflow        | Planned only                                                                | Before scale            |
|  12 | I2 — Rollback and migration safety      | Planned only                                                                | Before scale            |
|  13 | I2 — Preview deployment spike           | Planned only                                                                | After PMF               |
|  14 | I3 — OpenTofu Hetzner modules           | Planned placeholder only                                                    | Next experiment         |
|  15 | I3 — Development environment            | Planned placeholder only                                                    | Next experiment         |
|  16 | I3 — Production environment             | Planned placeholder only                                                    | Before scale            |
|  17 | I3 — Firewall policy                    | Planned only                                                                | Next experiment         |
|  18 | I3 — Ansible host configuration         | Planned placeholder only                                                    | Next experiment         |
|  19 | I3 — Dokploy installation               | Planned only                                                                | Next experiment         |
|  20 | I3 — Backup and restore automation      | Planned only                                                                | Before scale            |
|  21 | I3 — Infrastructure runbooks            | Planned placeholders; only generic Phase 1 incident/rotation notes exist    | Next experiment         |
|  22 | I4 — Authentication                     | Partial/local opaque sessions and shared reviewer code                      | Next experiment         |
|  23 | I4 — User and organization data model   | Partial participant model; no user, organization, membership, or roles      | After second experiment |
|  24 | I4 — Transactional email                | Partial fake; signup call has no delivery and result-ready is unused        | Next experiment         |
|  25 | I4 — Product analytics                  | Partial local event storage; no trustworthy funnel/query surface            | Next experiment         |
|  26 | I4 — Error monitoring                   | Partial structured logging only; monitoring/alerting planned                | Next experiment         |
|  27 | I4 — Background jobs                    | Partial roadmap outcome; strong receipt queue core, little operability      | Next experiment         |
|  28 | I4 — Feature flags                      | Planned only                                                                | After second experiment |
|  29 | I4 — Administrative operations          | Partial receipt review operation; shared auth and no audit identity         | Next experiment         |
|  30 | I4 — Data export and deletion           | Partial: local deletion works; export/provider/backup deletion absent       | Next experiment         |
|  31 | I5 — Product hypothesis schema          | Documentation vocabulary only; no instantiated/persisted schema             | After second experiment |
|  32 | I5 — Landing-page template              | Partial receipt-specific page, not a reusable hypothesis template           | After second experiment |
|  33 | I5 — Waitlist and interview recruitment | Partial signup/consent; no interview opt-in or recruitment workflow         | Next experiment         |
|  34 | I5 — Experiment event taxonomy          | Partial receipt event constants; acquisition/retention semantics absent     | Next experiment         |
|  35 | I5 — Human-assisted fulfilment queue    | Partial receipt-specific queue; no effort/correction/audit record           | After second experiment |
|  36 | I5 — Evidence dashboard                 | Planned only                                                                | After PMF               |
|  37 | I5 — Experiment decision record         | Decision vocabulary documented; no actual record or cited evidence          | After first users       |
|  38 | I5 — Kill, iterate, or scale workflow   | Planned only                                                                | After first users       |
|  39 | I6 — Experiment definition              | Planned: no segment, threshold, method, stop condition, owner, or date      | Next experiment         |
|  40 | I6 — Consent and privacy copy           | Partial synthetic/local copy; no external-use/retention review              | Next experiment         |
|  41 | I6 — Receipt intake                     | Partial validated synthetic text only                                       | Next experiment         |
|  42 | I6 — Structured extraction              | Partial deterministic fake and one happy-path test; no evaluation           | Next experiment         |
|  43 | I6 — Human verification                 | Partial working correction flow; no identity, time, or change capture       | Next experiment         |
|  44 | I6 — User result                        | Complete locally; external delivery/failure recovery absent                 | Next experiment         |
|  45 | I6 — Activation measurement             | Partial events; no unique funnel or evidence report                         | Next experiment         |
|  46 | I6 — Interview and feedback loop        | Planned only                                                                | Next experiment         |
|  47 | I6 — Pricing test                       | Partial hard-coded stated-interest question; no threshold/commitment        | Next experiment         |
|  48 | I7 — Pricing hypothesis                 | Planned; €5 copy is not a documented evidence-backed hypothesis             | Next experiment         |
|  49 | I7 — Stripe test-mode integration       | Planned; billing provider is unused/disabled                                | After payment           |
|  50 | I7 — Checkout                           | Planned only                                                                | After payment           |
|  51 | I7 — Webhook processing                 | Planned only                                                                | After payment           |
|  52 | I7 — Entitlements                       | Planned only                                                                | After payment           |
|  53 | I7 — Billing portal                     | Planned only                                                                | Before scale            |
|  54 | I7 — Failed-payment handling            | Planned only                                                                | Before scale            |
|  55 | I7 — Refund and cancellation process    | Planned only                                                                | Before scale            |
|  56 | I7 — Revenue analytics                  | Planned only                                                                | Before scale            |
|  57 | I7 — Live-payment readiness review      | Planned only                                                                | Before scale            |

The first external experiment requires a specific hypothesis record and receipt landing/
fulfilment flow, not a generalized product-hypothesis schema, landing template, or
queue. A second distinct experiment is the first opportunity to observe their genuinely
common shape. Likewise, a stated-interest survey is not enough evidence to incur Stripe
work; a concrete paid commitment or equivalently strong signal should exist first.
Temporary preview infrastructure and a bespoke evidence dashboard are leverage
investments for repeated delivery/evidence volume, not prerequisites for five gated
participants.

The four generated non-epic implementation items fit the same sequence:

- `Story — Clone-to-build workspace bootstrap`,
  `Story — Verify the synthetic receipt journey in Chromium`, and
  `Task — Establish least-privilege CI baseline` are completed prerequisites for the
  next external experiment.
- `Story — Define receipt experiment thresholds` is planned and required before
  recruiting the next external participant.

Human gates retain their documented order:

| Gate   | Timing implication                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------- |
| Gate 0 | Must be explicitly recorded before any infrastructure provisioning.                                            |
| Gate 1 | Must be explicitly decided before moving beyond the local scaffold/external-deployment stop.                   |
| Gate 2 | Must approve the full development infrastructure plan before apply.                                            |
| Gate 3 | Must approve auth, consent, analytics, error handling, and deletion before external users.                     |
| Gate 4 | Follows external completion/effort/accuracy/language/payment evidence and precedes workflow automation.        |
| Gate 5 | Precedes production provisioning and requires restore, monitoring, rollback, security, and ownership evidence. |
| Gate 6 | Precedes Stripe live mode and requires pricing, legal/tax, refund/cancellation, support, and a ready buyer.    |

### 2.4 Why the timing differs from the calendar roadmap

The existing “Week 1” through “Weeks 6–8” labels are planning targets, not customer
evidence dependencies (`docs/delivery/roadmap.md`). The repository’s own evidence model
says software completion is not validation, and Gate 4 blocks automation until external
evidence exists. It is therefore reasonable to delay generalized templates, organization
models, feature flags, preview infrastructure, and dashboards until more than one
product shape or meaningful evidence volume exists. This is sequencing within the
existing capabilities, not a redesigned roadmap.

## 3. Strategic assumptions not supported by customer evidence

The repository currently contains delivery evidence only. No external completion,
interview, observed workaround, acquisition result, willingness-to-pay behavior, or
retention evidence is recorded. The following remain assumptions:

1. A reachable segment has a recurring receipt/purchase-record problem.
2. The segment’s existing workaround is sufficiently slow, inaccurate, risky, or costly
   to motivate behavior change.
3. Vendor, purchase date, total, and currency are the fields needed for a valuable
   outcome.
4. A clean structured record leads to a meaningful downstream action; “result viewed” is
   an adequate activation proxy.
5. People will trust this operator with real purchase data and accept human access to
   source material.
6. Human verification improves the outcome enough to justify its latency and cost.
7. The operator can recruit and fulfil at least five users with acceptable turnaround.
8. Five external completions are enough to support a Continue/Iterate/Pause/Reject/Scale
   decision for the riskiest assumption.
9. Labelled synthetic text and a deterministic fake say anything useful about extraction
   accuracy on real receipts, scans, forwarded email, or model output.
10. €5 per month is a relevant price and billing unit for an unidentified segment and
    buyer.
11. “Would seriously consider paying” predicts payment or a paid commitment.
12. A viable acquisition channel exists at an acceptable cost.
13. The participant, economic buyer, and human reviewer are the roles the eventual
    product needs.
14. An asynchronous ingest/worker/reviewer/result architecture matches the next useful
    product rather than only the scaffold example.
15. Hetzner plus Dokploy, separate development/production servers, Postgres, and a
    web/worker topology are the right cost/operations trade-off at the current evidence
    level. These are specified architecture choices, but Gate 0 approval and measured
    need are not recorded.
16. The provider interfaces are reusable across unrelated product shapes.
17. A user/organization model, feature flags, preview deployments, an evidence
    dashboard, Stripe, and generalized experiment automation will be needed before
    customer evidence shows their shape or urgency.
18. A reusable software factory will materially reduce time from hypothesis to first
    payment; only one scaffold implementation exists, so no before/after cycle-time
    evidence is available.

## 4. Unresolved questions for human review

### Product

- What user job or decision should the structured purchase record enable?
- Which outcome is valuable enough that a user changes behavior rather than merely views
  a result?
- Which source formats are in scope for the first external test: pasted text, image/PDF,
  forwarded email, or something else?
- Which fields are necessary, and what accuracy/latency threshold makes the result
  useful?
- Is human verification part of the value proposition, a temporary fulfilment method, or
  only an evaluation aid?
- What is the promised turnaround time, and what happens when extraction or review
  fails?
- What data is retained, for how long, and what must be deleted from providers/backups?
- What does “activation” mean beyond a page view?
- What observable repeat/retention behavior would indicate enduring value?
- What exact payment behavior counts as evidence: deposit, pre-order, signed commitment,
  test checkout, or live charge?
- What falsification threshold and stop condition apply before recruitment starts?

### Audience

- Who is the first target segment? No segment should be inferred from the receipt demo.
- Who experiences the pain, who submits data, who receives the result, and who pays?
- Is the use case individual, household, sole-trader, accountant, finance-team, or
  another audience?
- What current workaround does that audience use, how often, and at what cost?
- What jurisdictions, ages, accessibility needs, and data-sensitivity constraints apply?
- Will participants accept a human reviewer, and what reviewer identity/assurance do
  they expect?
- Are organizations, roles, shared records, or administrator operations actually needed?
- How will the first five participants be selected, and what selection bias will that
  introduce?

### Distribution

- Which acquisition channel will be tested first, and why should the target audience be
  reachable there?
- What message and primary action will the landing experiment test?
- How will source/channel and a unique conversion denominator be captured without
  unnecessary tracking?
- Who owns recruitment, follow-up, result notification, interview scheduling, and
  support?
- What response/conversion rate would justify continuing the channel?
- What is the acceptable participant acquisition cost before revenue evidence?
- Is the waitlist the acquisition mechanism, an interview-recruitment tool, or both?
- How will participants return for an asynchronous result without a proven email path?
- What second experiment will test whether the supposed factory components work across
  an unrelated product shape?

### Evidence and decision ownership

- Where will the instantiated hypothesis, thresholds, counter-evidence, interviews,
  manual effort, raw accuracy, corrected accuracy, and payment signals be recorded?
- Who owns the experiment and the final decision, and on what review date?
- How will active human effort be measured separately from queue wait time?
- How will field-level machine output be compared with human-corrected truth?
- Which evidence permits Continue, Iterate, Pause, Reject, or Scale?
- What evidence, if any, would justify live AI, workflow automation, organizations,
  Stripe, preview deployments, or a dashboard?

## Human-review summary

Phase 1 is a credible, green local engineering demonstration with unusually careful
queue concurrency, deletion cascades, validation, CI, and safe GitHub bootstrap
behavior. It is not an external-user product or a validated reusable factory. The next
human decision is not a market choice in this report; it is whether Gate 1 evidence is
accepted and, separately, what evidence-backed experiment definition will be reviewed
before any Gate 2/3 work. The highest-priority review topics are external
authentication/reviewer accountability, consent/retention/deletion reachability,
trustworthy experiment metrics, result notification and failure recovery, and explicit
participant, accuracy, effort, and payment thresholds.
