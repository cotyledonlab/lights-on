# Current human gates

| Gate | Status | Required evidence | Explicit stop |
| --- | --- | --- | --- |
| Gate 0 — Architecture approval | Not recorded | Architecture, cost, security, data flows, provider choices | No infrastructure provisioning |
| Gate 1 — Local scaffold approval | Awaiting Phase 1 evidence | Local setup, CI-equivalent checks, tests, usable docs, secret scan | No external deployment |
| Gate 2 — Development infrastructure approval | Not started | Full OpenTofu plan, resources, costs, firewall, recovery impact | No `tofu apply` |
| Gate 3 — Development release approval | Not started | Auth, consent, events, errors, deletion | No external users |
| Gate 4 — Product evidence review | Not started | External completion, effort, accuracy, language, payment intent | No workflow automation |
| Gate 5 — Production infrastructure approval | Not started | Restore, monitoring, rollback, security, ownership | No production apply |
| Gate 6 — Live monetisation approval | Not started | Pricing, legal/tax review, refunds, cancellation, support, buyer | No Stripe live mode |

Passing automated checks does not approve a gate. A human must record the
decision explicitly.

