# Personal Software Factory — Bootstrap Specification

## Role

Act as the principal engineer and delivery lead for this repository.

Your task is to scaffold a secure, inexpensive, repeatable software factory for testing and launching small SaaS products.

Work incrementally. Do not provision paid infrastructure, change DNS, create external resources, expose secrets, or deploy to production without an explicit human approval gate.

Prefer simple, boring, reversible technology.

---

# 1. Product-factory objective

Create a reusable platform that reduces the time from:

> Product hypothesis → landing page → real user → measured activation → first payment

The system must support:

1. Rapid landing-page experiments.
2. Product-specific applications.
3. Development, preview and production environments.
4. Human-assisted workflows before automation.
5. Authentication, billing, email and analytics.
6. Experiment tracking and product-market-fit evidence.
7. Infrastructure reproducibility.
8. Safe AI-assisted development through Codex.
9. GitHub-native issue planning and delivery.
10. Low fixed operating costs before revenue.

Do not build the full product vision yet.

Build only the reusable foundation and one deliberately thin vertical slice.

---

# 2. Constraints

## Developer environment

Primary development machine:

* Apple Silicon MacBook Air
* macOS
* Homebrew
* Docker Desktop or OrbStack
* Git
* GitHub CLI
* Codex CLI or Codex desktop app
* Node.js managed through `mise`
* `pnpm`

All routine development commands must work from macOS.

## Hosting

Use:

* Hetzner Cloud
* One isolated development server
* One isolated production server
* Dokploy on each server
* Docker-based workloads
* Hetzner Cloud Firewalls
* Hetzner backups or snapshots
* Hetzner S3-compatible Object Storage for encrypted application and database backups

Infrastructure must be parameterized. Do not hardcode server models, IP addresses, domains, regions or credentials.

## Source control and planning

Use:

* One private GitHub repository
* GitHub Issues
* GitHub Projects
* GitHub Actions
* Conventional Commits
* Pull requests for all non-trivial changes

Do not introduce Jira, Linear, Trello or another issue tracker.

## Initial operating-cost principle

Optimize for low idle cost, not theoretical hyperscale.

Do not introduce Kubernetes, Kafka, Elasticsearch, a standalone vector database, a service mesh or multi-region infrastructure.

---

# 3. Proposed architecture

Use a TypeScript monorepo.

```text
.
├── apps/
│   ├── web/                    # Next.js customer-facing application
│   └── worker/                 # Background-job worker
├── packages/
│   ├── auth/                   # Authentication integration
│   ├── config/                 # Typed environment configuration
│   ├── database/               # Prisma schema, migrations and client
│   ├── email/                  # Transactional email adapter
│   ├── observability/          # Logging, tracing and error reporting
│   ├── payments/               # Stripe integration
│   ├── product-analytics/      # PostHog integration
│   ├── queue/                  # Background-job abstraction
│   ├── ui/                     # Shared UI components
│   └── validation/             # Shared schemas
├── infra/
│   ├── tofu/
│   │   ├── modules/
│   │   └── environments/
│   │       ├── development/
│   │       └── production/
│   ├── ansible/
│   │   ├── roles/
│   │   └── playbooks/
│   └── scripts/
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── delivery/
│   ├── operations/
│   ├── product/
│   └── runbooks/
├── scripts/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── pull_request_template.md
├── AGENTS.md
├── README.md
└── Makefile
```

Use:

* Next.js with App Router
* React
* TypeScript in strict mode
* Tailwind CSS
* shadcn/ui-compatible component structure
* pnpm workspaces
* Turborepo
* PostgreSQL
* Prisma
* Zod
* Vitest
* Playwright
* ESLint
* Prettier
* Renovate
* Docker
* Docker Compose for local development

For external capabilities, create interfaces before provider-specific implementations:

* `AuthProvider`
* `BillingProvider`
* `EmailProvider`
* `AnalyticsProvider`
* `ObjectStorageProvider`
* `JobQueue`
* `AiModelProvider`

Preferred first implementations:

* Authentication: Better Auth
* Billing: Stripe
* Transactional email: Resend
* Analytics and feature flags: PostHog
* Error tracking: Sentry
* Background work: PostgreSQL-backed queue initially
* AI: Vercel AI SDK or a similarly lightweight provider abstraction

Do not add Redis until a measured requirement justifies it.

---

# 4. Environment model

Support four execution contexts.

## Local

Runs entirely on the MacBook.

Use Docker Compose for PostgreSQL and any other required local services.

The web and worker processes should run directly through `pnpm` for rapid iteration.

## Pull-request preview

Each pull request must:

1. Run validation and tests.
2. Build deployable Docker images.
3. Optionally create a Dokploy preview deployment when credentials are configured.
4. Avoid creating permanent infrastructure.
5. Use synthetic or isolated test data.
6. never use production secrets.

Preview deployment support may initially be documented but disabled.

## Development

Development deployment is allowed to occur automatically after successful merge to `main`.

Development must use:

* A separate Hetzner server
* A separate database
* Separate credentials
* Development-only third-party API keys
* Non-production email behavior
* Synthetic or manually entered test data

## Production

Production must use:

* A separate Hetzner server
* A separate database
* Separate storage and credentials
* Explicit backup jobs
* Restricted network access
* A manual release action
* A required smoke-test result
* A documented rollback procedure

A merge to `main` must never deploy directly to production.

Production deployment should require:

1. A version tag or manually dispatched workflow.
2. A typed confirmation input such as `DEPLOY`.
3. A successful CI run for the exact commit.
4. A successful development deployment.
5. A human review of the generated release notes.
6. A post-deployment smoke test.

---

# 5. Infrastructure-as-code requirements

Use OpenTofu for Hetzner resource provisioning.

Provision definitions for:

* Development server
* Production server
* SSH keys
* Cloud Firewalls
* Private networks where useful
* Server labels
* Backup configuration
* Optional object-storage configuration where provider support is adequate

Use Ansible for server configuration:

* Create a non-root deployment user
* Disable password-based SSH
* Disable direct root SSH after validation
* Configure automatic security updates
* Install Docker
* Install and configure Dokploy
* Configure host firewall where appropriate
* Configure fail2ban only if justified
* Configure timezone and NTP
* Configure log rotation
* Configure backup scripts
* Configure basic host-health checks

Do not run `tofu apply` or an Ansible production playbook automatically.

Provide these commands:

```bash
make bootstrap
make doctor
make local-up
make local-down
make lint
make typecheck
make test
make test-e2e
make build
make infra-plan ENV=development
make infra-apply ENV=development
make infra-plan ENV=production
make infra-apply ENV=production
make deploy-development
make deploy-production
make backup-check ENV=development
make backup-check ENV=production
```

Any destructive command must require an explicit confirmation.

---

# 6. Security baseline

Implement and document:

* No secrets committed to Git
* `.env.example` containing names but no secret values
* Secret scanning in CI
* Dependency vulnerability scanning
* Container image scanning
* Least-privilege GitHub Actions permissions
* Pinned GitHub Action versions
* Protected default branch where repository permissions allow
* HTTPS-only public endpoints
* Secure and HTTP-only authentication cookies
* CSRF protection
* Rate limits for public mutation endpoints
* Structured audit events for privileged operations
* Database migrations performed as a controlled release step
* Personally identifiable information minimization
* Data deletion pathway
* Separate encryption keys and credentials by environment
* Backup encryption
* Restore testing
* Documented incident and credential-rotation runbooks

Never print credentials in logs or workflow output.

Create a lightweight threat model in:

```text
docs/architecture/threat-model.md
```

---

# 7. CI/CD workflows

Create the following GitHub Actions workflows.

## `ci.yml`

Trigger on pull requests and pushes to `main`.

Run:

1. Install with a frozen lockfile.
2. Formatting check.
3. Lint.
4. Type checking.
5. Unit tests.
6. Integration tests.
7. Production build.
8. Docker build.
9. Dependency audit.
10. Secret scan.
11. Container scan.

Use caching where safe.

## `deploy-development.yml`

Trigger after CI succeeds on `main`.

Responsibilities:

1. Build an immutable image tagged with commit SHA.
2. Publish it to GitHub Container Registry.
3. Trigger the Dokploy development deployment.
4. Run development smoke tests.
5. Record deployment metadata.
6. Fail visibly if health checks do not pass.

## `deploy-production.yml`

Trigger only through:

* A version tag; or
* `workflow_dispatch`

Require a typed confirmation for manual execution.

Responsibilities:

1. Verify that the selected commit passed CI.
2. Verify that the same image digest was deployed successfully to development.
3. Generate release notes.
4. Deploy the immutable image to production.
5. Run database migrations safely.
6. Run production smoke tests.
7. Roll back or provide exact rollback instructions on failure.
8. Record deployment metadata.

## `backup-verification.yml`

Run on a schedule.

Responsibilities:

1. Confirm recent backups exist.
2. Verify backup metadata.
3. Periodically perform a restore into an isolated temporary database.
4. Report failures through GitHub Issues or configured alerts.

Do not assume that creating a backup proves it is restorable.

## `dependency-maintenance.yml`

Configure Renovate rather than writing bespoke dependency-update logic.

Group low-risk updates and require CI before merge.

---

# 8. GitHub issue hierarchy

Use this hierarchy:

```text
Initiative
└── Epic
    └── Story or Task
        └── Optional implementation sub-task
```

Represent initiatives and epics as parent issues.

Use GitHub sub-issues when supported. If API or authentication limitations prevent automated parent-child relationships:

1. Still create all issues.
2. Link children from the parent using task lists.
3. Generate a script or documented command to establish native sub-issue relationships later.
4. Do not silently omit relationships.

Create these labels:

```text
type:initiative
type:epic
type:story
type:task
type:bug
type:spike
area:product
area:frontend
area:backend
area:data
area:platform
area:security
area:observability
area:delivery
area:research
gate:human-review
status:blocked
status:needs-evidence
priority:p0
priority:p1
priority:p2
priority:p3
size:xs
size:s
size:m
size:l
size:xl
```

Create these project fields where possible:

* Status
* Priority
* Size
* Area
* Target start
* Target date
* Product hypothesis
* Evidence required
* Human gate
* Environment
* Release

Suggested statuses:

```text
Inbox
Discovery
Ready
In progress
Human review
Blocked
Validation
Done
Rejected
```

Create project views:

1. Inbox
2. Delivery board
3. Roadmap
4. Human gates
5. Product experiments
6. Bugs and operational risks
7. Current milestone

---

# 9. Initial initiatives and epics

Create the following roadmap.

## Initiative 1 — Repository and developer experience

Target: Week 1

Epics:

1. Monorepo scaffold
2. Local development environment
3. Testing foundation
4. Documentation and ADR structure
5. Codex operating instructions
6. Repository governance

Expected effort:

* 12–20 focused engineering hours

Exit evidence:

* A new developer can clone the repository and run the system using documented commands.
* CI passes.
* The web app, worker and PostgreSQL run locally.
* One Playwright journey passes.

---

## Initiative 2 — Delivery platform

Target: Weeks 1–2

Epics:

1. Docker build strategy
2. GitHub Actions CI
3. Container registry publication
4. Development deployment workflow
5. Production release workflow
6. Rollback and migration safety
7. Preview-deployment spike

Expected effort:

* 16–28 focused engineering hours

Exit evidence:

* One immutable image moves from CI to development.
* Production deployment remains manual.
* A failed smoke test is visible and actionable.
* Rollback steps have been rehearsed in development.

---

## Initiative 3 — Hetzner infrastructure

Target: Weeks 2–3

Epics:

1. OpenTofu Hetzner modules
2. Development environment
3. Production environment
4. Firewall policy
5. Ansible host configuration
6. Dokploy installation
7. Backup and restore automation
8. Infrastructure runbooks

Expected effort:

* 18–30 focused engineering hours

Exit evidence:

* Both environments can be recreated from documented configuration.
* Secrets are supplied outside source control.
* Production is isolated from development.
* A development backup has been restored successfully.

---

## Initiative 4 — SaaS foundation

Target: Weeks 3–4

Epics:

1. Authentication
2. User and organization data model
3. Transactional email
4. Product analytics
5. Error monitoring
6. Background jobs
7. Feature flags
8. Administrative operations
9. Data export and deletion

Expected effort:

* 24–40 focused engineering hours

Exit evidence:

* A user can register, sign in and sign out.
* Activation events are measured.
* A background job can be created and observed.
* Errors are captured without exposing sensitive data.

---

## Initiative 5 — Product experiment framework

Target: Weeks 4–5

Epics:

1. Product hypothesis schema
2. Landing-page template
3. Waitlist and interview recruitment
4. Experiment event taxonomy
5. Human-assisted fulfilment queue
6. Evidence dashboard
7. Experiment decision record
8. Kill, iterate or scale workflow

Expected effort:

* 18–30 focused engineering hours

Exit evidence:

* A hypothesis can be launched as a landing page.
* Visitor-to-sign-up conversion is measurable.
* A human can manually fulfil the proposed value.
* Evidence is captured before implementation is expanded.

---

## Initiative 6 — First vertical slice

Target: Weeks 5–6

Build one narrow product journey only.

Default candidate:

> Connect or forward a purchase receipt, extract the purchase details, have a human verify them, and return a useful structured record to the user.

This is an experiment, not a commitment to the broader product.

Epics:

1. Experiment definition
2. Consent and privacy copy
3. Receipt intake
4. Structured extraction
5. Human verification
6. User result
7. Activation measurement
8. Interview and feedback loop
9. Pricing test

Expected effort:

* 24–40 focused engineering hours

Exit evidence:

* At least five external users complete the journey.
* Manual fulfilment time is measured.
* Extraction accuracy is measured separately from human-corrected accuracy.
* Users are asked for payment or a paid commitment.
* A documented decision is made: stop, iterate or scale.

---

## Initiative 7 — Monetisation

Target: Weeks 6–8, only after evidence exists

Epics:

1. Pricing hypothesis
2. Stripe test-mode integration
3. Checkout
4. Webhook processing
5. Entitlements
6. Billing portal
7. Failed-payment handling
8. Refund and cancellation process
9. Revenue analytics
10. Live-payment readiness review

Expected effort:

* 20–32 focused engineering hours

Exit evidence:

* A test customer can complete checkout.
* Webhooks are idempotent.
* Entitlements are derived from server-side billing state.
* Cancellation and refund paths are documented.
* At least one real user is explicitly invited to pay.
* Live mode is not enabled until a human approves the readiness checklist.

---

# 10. Issue specification standard

Every generated epic, story and task must contain:

```markdown
## Outcome

What user, business or operational result should exist when this closes?

## Context

Why is this work needed now?

## Scope

What is included?

## Out of scope

What must not be added opportunistically?

## Acceptance criteria

- [ ] Observable criterion
- [ ] Observable criterion

## Verification

Exact commands, test cases, screenshots or evidence required.

## Risks

Security, privacy, delivery, cost and operational risks.

## Dependencies

Linked issues or external prerequisites.

## Human stop gate

State whether explicit human approval is required before starting or completing the work.

## Estimate

Provide:

- Size: XS, S, M, L or XL
- Focused engineering hours as a range
- Confidence: low, medium or high
- Key uncertainty

These estimates are planning ranges, not deadlines.
```

Issue sizing:

```text
XS: 1–2 hours
S: 2–4 hours
M: 4–8 hours
L: 1–2 focused days
XL: Must be decomposed before implementation
```

No implementation issue should remain XL.

---

# 11. Human-in-the-loop stop gates

Create explicit gate issues.

## Gate 0 — Architecture approval

Before provisioning infrastructure:

* Review architecture
* Review recurring costs
* Review security model
* Review data flows
* Approve the initial provider choices

## Gate 1 — Local scaffold approval

Before external deployment:

* Local setup works
* CI works
* Tests work
* Documentation is usable
* No secrets are committed

## Gate 2 — Development-infrastructure approval

Before `tofu apply`:

* Show the full OpenTofu plan
* Show expected resources
* Show estimated recurring costs
* Show firewall rules
* Show destruction and recovery implications

## Gate 3 — Development release approval

Before inviting external users:

* Authentication works
* Consent copy exists
* Analytics events are reviewed
* Error handling is acceptable
* Data deletion works

## Gate 4 — Product evidence review

Before automating the human workflow:

* External users have completed it
* Manual effort is measured
* Accuracy is measured
* User language is captured
* Payment intent has been tested

## Gate 5 — Production-infrastructure approval

Before production provisioning:

* Restore test passes
* Monitoring exists
* Rollback is rehearsed
* Security checklist passes
* Operational ownership is clear

## Gate 6 — Live monetisation approval

Before enabling Stripe live mode:

* Pricing hypothesis is documented
* Tax and legal requirements are identified for human review
* Refund path is tested
* Cancellation path is tested
* Billing support process exists
* A real customer is ready to pay

Codex must stop at each gate and produce a concise evidence report.

Passing tests is necessary but does not automatically approve a human gate.

---

# 12. Codex repository instructions

Create `AGENTS.md` with these durable rules:

1. Read the nearest applicable `AGENTS.md` before editing.
2. Read relevant ADRs and product documentation before implementation.
3. Work from a GitHub issue.
4. Restate acceptance criteria before making changes.
5. Prefer the smallest change satisfying the issue.
6. Do not combine unrelated refactors with feature work.
7. Add or update tests for behavioral changes.
8. Run the narrowest relevant tests during iteration.
9. Run the complete required validation before marking work complete.
10. Never expose or fabricate credentials.
11. Never provision infrastructure or deploy production without explicit human approval.
12. Never bypass a failing test or security control merely to make CI green.
13. Record meaningful architectural decisions as ADRs.
14. Update runbooks when operational behavior changes.
15. Link every pull request to its issue.
16. Include deployment and rollback notes where applicable.
17. Keep generated code understandable to a human maintainer.
18. Ask for human judgment when requirements involve product, privacy, security, money or irreversible operations.

Create a scoped `AGENTS.md` inside `infra/` with stricter infrastructure rules.

---

# 13. Automation scripts

Create a script such as:

```text
scripts/bootstrap-github.sh
```

It should be idempotent where practical and use the authenticated GitHub CLI.

It should:

1. Verify `gh auth status`.
2. Detect repository owner and name.
3. Create missing labels.
4. Create milestones.
5. Create initiative issues.
6. Create epic issues.
7. Create initial implementation stories.
8. Establish parent/sub-issue relationships where supported.
9. Add issues to a GitHub Project when `PROJECT_OWNER` and `PROJECT_NUMBER` are supplied.
10. Avoid duplicating existing issues.
11. Print actions before performing them.
12. Support `--dry-run`.
13. Stop before mutations unless `--apply` is passed.
14. Write a machine-readable creation report.

Do not assume organization-level permissions.

If project creation cannot be reliably automated using the user's current authentication, generate:

```text
docs/delivery/github-project-setup.md
```

with exact manual steps and continue creating repository issues.

Also generate:

```text
docs/delivery/roadmap.md
docs/delivery/issue-catalogue.md
docs/delivery/current-gates.md
```

---

# 14. Product evidence model

Create an initial data model or documentation model for:

* Product hypothesis
* Target segment
* Pain statement
* Existing workaround
* Proposed outcome
* Experiment
* Acquisition channel
* Participant
* Consent record
* Activation event
* Interview
* Evidence item
* Payment signal
* Experiment decision

Every experiment decision must be one of:

```text
Continue
Iterate
Pause
Reject
Scale
```

Every decision must cite observed evidence.

Do not allow an experiment to be marked validated solely because the software was completed.

---

# 15. First thin vertical slice

The scaffold must include one end-to-end demonstration:

1. User opens a landing page.
2. User signs up for early access.
3. User submits a synthetic receipt or purchase record.
4. The submission creates a review job.
5. An authorized human reviews and corrects extracted fields.
6. The user sees a structured result.
7. Analytics record:

   * Landing-page view
   * Sign-up
   * Submission started
   * Submission completed
   * Human review completed
   * Result viewed
   * Payment-interest response
8. The application exposes a health endpoint.
9. CI tests the primary journey.
10. Development deployment supports the journey.

Initially use a deterministic fake extractor behind the extraction interface.

Do not introduce a live AI provider until the workflow, schema and evaluation method exist.

---

# 16. Definition of done

The infrastructure scaffold is complete only when:

* [ ] Repository structure exists.
* [ ] `AGENTS.md` exists.
* [ ] Local setup is documented and tested.
* [ ] CI is green.
* [ ] Docker images build reproducibly.
* [ ] OpenTofu validates.
* [ ] Ansible linting passes.
* [ ] Development and production are represented separately.
* [ ] Production deployment is manual.
* [ ] GitHub issue templates exist.
* [ ] Roadmap issues can be generated safely.
* [ ] Security and privacy baselines are documented.
* [ ] Backup and restore procedures exist.
* [ ] One thin vertical slice works locally.
* [ ] Human gates are visible in the roadmap.
* [ ] No external paid resource has been created without approval.

---

# 17. Required execution order

Do not attempt everything at once.

## Phase 1 — Plan and repository scaffold

Perform now:

1. Inspect the existing repository.
2. Write an implementation plan.
3. Create the directory structure.
4. Create `AGENTS.md`.
5. Create ADRs for major technology choices.
6. Create issue templates.
7. Create the GitHub-roadmap bootstrap script.
8. Scaffold the monorepo.
9. Add local PostgreSQL.
10. Add the basic CI workflow.
11. Add the thin vertical slice using fake providers.
12. Run local validation.
13. Produce a Gate 1 evidence report.

Stop after Phase 1.

Do not provision Hetzner resources.

## Phase 2 — Development infrastructure

Only after explicit approval:

1. Implement OpenTofu modules.
2. Implement Ansible roles.
3. Produce a development infrastructure plan.
4. Show resources, security rules and expected monthly cost.
5. Stop at Gate 2 before applying.

## Phase 3 — Development deployment

Only after explicit approval:

1. Apply development infrastructure.
2. Install Dokploy.
3. Configure deployment.
4. Deploy development.
5. Run smoke tests.
6. Produce a Gate 3 evidence report.

## Phase 4 — Production preparation

Only after product evidence and explicit approval:

1. Prepare production infrastructure.
2. Test restoration.
3. Rehearse rollback.
4. Produce a Gate 5 evidence report.
5. Stop before production apply.

## Phase 5 — Monetisation

Only after Gate 4:

1. Implement Stripe in test mode.
2. Test checkout and entitlements.
3. Produce a live-payment readiness report.
4. Stop at Gate 6.

---

# 18. Initial response expected from Codex

Before changing files, respond with:

1. Repository-state summary.
2. Proposed file changes.
3. Assumptions.
4. Risks.
5. Phase 1 issue breakdown.
6. Estimated focused engineering hours.
7. Any operations requiring human approval.
8. The first smallest implementation slice.

Then begin Phase 1 unless a critical ambiguity would make the work unsafe or destructive.
