# GitHub issue catalogue

The canonical machine-readable catalogue is `scripts/github-roadmap.json`. It contains 7
initiatives, 57 epics, 3 initial stories, 1 initial task, and 7 human-gate issues. The
bootstrap script generates the full issue-specification body for every item and avoids
duplicate exact titles.

## Initiative 1 — Repository and developer experience

- Monorepo scaffold
- Local development environment
- Testing foundation
- Documentation and ADR structure
- Codex operating instructions
- Repository governance
- Initial story: clone-to-build workspace bootstrap
- Initial story: verify the synthetic receipt journey in Chromium
- Gate 1: local scaffold approval

## Initiative 2 — Delivery platform

- Docker build strategy
- GitHub Actions CI
- Container registry publication
- Development deployment workflow
- Production release workflow
- Rollback and migration safety
- Preview-deployment spike
- Initial task: establish least-privilege CI baseline

## Initiative 3 — Hetzner infrastructure

- OpenTofu Hetzner modules
- Development environment
- Production environment
- Firewall policy
- Ansible host configuration
- Dokploy installation
- Backup and restore automation
- Infrastructure runbooks
- Gate 0: architecture approval
- Gate 2: development-infrastructure approval
- Gate 5: production-infrastructure approval

## Initiative 4 — SaaS foundation

- Authentication
- User and organization data model
- Transactional email
- Product analytics
- Error monitoring
- Background jobs
- Feature flags
- Administrative operations
- Data export and deletion
- Gate 3: development-release approval

## Initiative 5 — Product experiment framework

- Product hypothesis schema
- Landing-page template
- Waitlist and interview recruitment
- Experiment event taxonomy
- Human-assisted fulfilment queue
- Evidence dashboard
- Experiment decision record
- Kill, iterate, or scale workflow
- Gate 4: product evidence review

## Initiative 6 — First vertical slice

- Experiment definition
- Consent and privacy copy
- Receipt intake
- Structured extraction
- Human verification
- User result
- Activation measurement
- Interview and feedback loop
- Pricing test
- Initial story: define receipt-experiment thresholds

## Initiative 7 — Monetisation

- Pricing hypothesis
- Stripe test-mode integration
- Checkout
- Webhook processing
- Entitlements
- Billing portal
- Failed-payment handling
- Refund and cancellation process
- Revenue analytics
- Live-payment readiness review
- Gate 6: live-monetisation approval

## Generated issue standard

Every generated issue contains:

1. Outcome
2. Context
3. Scope
4. Out of scope
5. Observable acceptance criteria
6. Exact verification evidence expectation
7. Security, privacy, delivery, cost, and operational risks
8. Parent or prerequisite dependencies
9. Applicable human stop gate
10. Size, focused-hours range, confidence, and key uncertainty

Initiatives are allowed to remain XL because they are planning containers. No generated
epic, story, task, or gate is XL.

## Safe execution

Preview all actions:

```bash
./scripts/bootstrap-github.sh --dry-run
```

Applying the catalogue requires explicit human approval:

```bash
PROJECT_OWNER=cotyledonlab \
PROJECT_NUMBER=<number> \
./scripts/bootstrap-github.sh --apply
```

If project variables are omitted, an approved apply can still create repository labels,
milestones, issues, and relationships. Project field and view setup is documented in
`github-project-setup.md`.
