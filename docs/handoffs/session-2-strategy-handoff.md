# Session 2 strategy handoff

**Prepared:** 2026-07-27

**Session boundary:** Evidence foundation and founder decision gate

**Status:** Current coherent unit complete and validated; awaiting founder approval

## Original objective

Reorient the post-Phase-1 strategy around evidence of customer pain, reachable demand,
delivered value, repeat behaviour, and payment before infrastructure expansion. Persist
context-safety governance, validate the audit, choose a narrow receipt-related segment,
design Distribution Experiment 001, define a durable evidence method, replace the
calendar/infrastructure sequence with evidence cycles, map infrastructure to evidence
triggers, draft five strategic ADRs, and recommend one bounded implementation PR.

No product implementation, infrastructure provisioning, deployment, production
credential work, GitHub issue mutation, or proposed implementation PR is authorized.

## Context-safety decision

The requested work did not fit one healthy context window with adequate scrutiny. It
required roughly 1,200 lines of repository source material, four independent strategy
systems, five ADRs, governance changes, and nine durable outputs.

The work was split at the founder decision gate:

- **This session:** governance, audit validation, segment assessment, Distribution
  Experiment 001, minimum evidence model, and the first-PR recommendation.
- **Fresh session after human approval:** evidence-cycle roadmap, infrastructure trigger
  map, five strategic ADRs, and final cross-document reconciliation.

The split was stated before edits. Broad exploration stopped after the first coherent
section.

## Completed work

1. Added the durable context-and-scope safety policy to the root `AGENTS.md`.
2. Read the audit, product evidence model, relevant delivery/gate/catalogue documents,
   threat model, and Phase 1 ADRs.
3. Checked the audit against the current gate state, catalogue records, relevant
   application/schema surface, and the audited implementation commit.
4. Found no material factual correction requiring an edit to the audit.
5. Researched five narrow segments against primary Irish sources.
6. Recommended Irish sole traders with recurring business purchases as primary.
7. Recommended self-managing Irish landlords with one or two properties as fallback,
   conditional on trusted access.
8. Designed an interview-only, permissioned, manual Distribution Experiment 001 with
   numeric success, failure, inconclusive, effort, and stop thresholds.
9. Expanded the evidence model with explicit evidence strength and a minimum file-based
   record.
10. Recommended a 4–6-hour documentation-only PR that creates the concrete EXP-001
    founder research kit without application or framework changes.

## Verified facts

- The implementation remains a local, synthetic receipt demonstration.
- Gate 1 remains awaiting explicit human approval; external deployment and external
  users remain prohibited.
- No application or infrastructure files changed between audited implementation commit
  `cb11aba01b641a79a1146036a7142620a29aeb5d` and the strategy baseline.
- The repository still has no external customer, acquisition, interview, repeat-use,
  referral, payment, or retention evidence.
- Current receipt fields and the web/worker/provider seams have not been validated
  against a customer outcome or a second product.
- Irish business record-keeping creates a real continuous job, but Revenue supplies a
  free Receipts Tracker. Workaround inadequacy and willingness to pay remain unknown.
- Irish rental-property expenses create a per-property record job, but the access,
  privacy, tax-complexity, and willingness-to-pay assumptions remain untested.
- Official proof-of-purchase and insurance guidance establishes consequences but not a
  frequent paid receipt-management problem.
- No candidate segment has actual willingness-to-pay evidence.

## Decisions made

These are recommendations awaiting human approval, not gate approvals:

- Primary segment: Republic-of-Ireland sole traders who personally handle at least five
  business purchase records per typical month and lack a satisfactory automated
  workflow.
- Fallback: self-managing Irish landlords with one or two properties, only with a
  trusted referral path.
- Primary channel: permissioned one-to-one founder or referrer-forwarded invitations.
- Cycle 1 format: ten qualified interviews; no landing-page traffic test, app
  deployment, real receipt intake, tax advice, fulfilment, or payment.
- Evidence method: experiment Markdown, de-identified YAML ledger, de-identified
  interview notes, and an evidence-cited decision record.
- Next PR: create the concrete EXP-001 founder research kit only.

## Files changed

- `AGENTS.md`
- `docs/product/evidence-model.md`
- `docs/strategy/distribution-experiment-001.md`
- `docs/strategy/market-segment-research.md`
- `docs/handoffs/session-2-strategy-handoff.md`

No application, database schema, test, deployment, infrastructure, runbook, GitHub
roadmap, or audit file was changed.

## Commands and tests run

Read-only discovery and validation performed during strategy work:

```text
pwd
rg --files -g 'AGENTS.md' -g 'docs/**' -g '!node_modules'
git status --short --branch
git log -5 --oneline --decorate
wc -l AGENTS.md docs/strategy/post-phase-1-audit.md docs/product/*.md \
  docs/delivery/*.md docs/decisions/*.md docs/architecture/*.md
git remote -v
rg -n "markdown|lint|docs|prettier|remark" package.json pnpm-workspace.yaml \
  Makefile .github
rg/sed reads of the audit, product, delivery, ADR, threat-model, and targeted app/schema files
jq selection of relevant experiment and evidence entries in scripts/github-roadmap.json
git diff --exit-code cb11aba01b641a79a1146036a7142620a29aeb5d -- \
  apps packages infra docker docker-compose.yml Makefile package.json pnpm-lock.yaml
```

Primary-source web research covered Revenue, RTB, CCPC, Central Bank of Ireland, Data
Protection Commission, Local Enterprise Offices, landlord associations, insurers, and
photography organisations. URLs and claim limits are in
`docs/strategy/market-segment-research.md`.

Final formatting, diff, and repository-state checks are recorded below after execution:

<!-- FINAL_VALIDATION -->

- `mise exec -- pnpm prettier --write <changed Markdown files>` — pass; files formatted.
- `make format-check` — pass; all repository-matched files use Prettier style.
- `git diff --cached --check` — pass after replacing Markdown hard-break whitespace
  found by the initial check.
- Local Markdown-target check across all five changed files — pass.
- Cached name/status and stat inspection — pass; exactly five intended governance and
  documentation files.
- Documentation-only path assertion — pass; no cached path exists outside `AGENTS.md`
  and `docs/`.
- Final staged diff and status inspection — pass; no product code, infrastructure,
  audit, credentials, or GitHub roadmap state changed.
- Next-PR boundary inspection — pass; one experiment directory, 4–6 focused hours, and
  deletion-only rollback.

## Current repository state

- Branch: `main`
- Remote: `origin` is `git@github.com:cotyledonlab/lights-on.git`
- Starting commit: `98f1112` (`docs(strategy): add post-phase-1 audit`)
- GitHub issues and roadmap state were not mutated.
- Final commit and push result are recorded in the session's final report.

## Remaining acceptance criteria

The next fresh strategy session must:

1. Write `docs/strategy/evidence-cycle-roadmap.md` with Cycles 1 through 5 and one
   decision outcome per cycle.
2. Write `docs/strategy/infrastructure-trigger-map.md` covering every capability named
   in the original request.
3. Draft five precise strategic ADRs:
   - evidence before infrastructure expansion;
   - distribution as a first-class product capability;
   - generalise only after repetition;
   - every experiment leaves reusable assets;
   - infrastructure requires an explicit evidence trigger.
4. Reconcile decision vocabulary, gates, capability triggers, and the long-term factory
   destination across the new documents.
5. Validate all strategy documentation and inspect the final diff.
6. Do not implement the recommended PR or alter GitHub issues.

## Unresolved risks

- The founder's actual warm/referrer access to 30 qualified sole traders is unknown.
- Electronic outreach must stay research-only and permissioned; promotional content can
  create direct-marketing obligations.
- A 30-day contact-code retention period and withdrawal operation require human/privacy
  review before launch.
- The official free Revenue Receipts Tracker may make the proposed outcome redundant.
- The customer's actual job may be tax classification or accountant collaboration,
  outside the existing receipt field set and beyond what the founder should advise on.
- Interview commitments may not convert into representative-data use, repeat use, or
  payment.
- Gate 1 is still awaiting a separate explicit human decision.
- Legacy catalogue decision language says `Reject`; the new evidence-cycle vocabulary
  uses `Kill`.

## Exact next action

The founder must approve or change:

1. the primary and fallback segments;
2. the permissioned founder/referrer-forwarded channel;
3. Distribution Experiment 001 thresholds;
4. consent, retention, withdrawal, and outreach-law ownership; and
5. the exact 4–6-hour EXP-001 research-kit PR.

After those decisions are explicit, start one fresh strategy session using the prompt
below. Do not begin participant outreach or the implementation PR merely because the
remaining strategy documents are drafted.

## Ready-to-paste continuation prompt

```text
# Session 2B — Evidence-Cycle Roadmap, Infrastructure Triggers, and Strategic ADRs

Continue Session 2 in a fresh Codex session.

I approve the recommended primary segment (Republic-of-Ireland sole traders matching
the profile), fallback segment (self-managing one-to-two-property Irish landlords),
permissioned founder/referrer-forwarded one-to-one channel, Distribution Experiment 001
thresholds, and the proposed 4–6-hour EXP-001 founder research-kit PR for planning
purposes only. Do not implement that PR or begin outreach in this session. If any of
those approvals are not intended, stop and ask me to state the changes before writing
strategy that depends on them.

This is a strategy, planning, and repository-governance session. Do not implement
product features, provision infrastructure, deploy services, mutate GitHub issues, run
the roadmap bootstrap with --apply, or begin the proposed implementation PR.

Read first:

1. AGENTS.md
2. docs/handoffs/session-2-strategy-handoff.md
3. docs/strategy/post-phase-1-audit.md
4. docs/strategy/market-segment-research.md
5. docs/strategy/distribution-experiment-001.md
6. docs/product/evidence-model.md
7. relevant docs under docs/delivery/
8. existing ADRs

Treat the audit and the handoff as the repository-fact baseline. Do not repeat the full
audit or segment research.

Complete only the deferred Session 2 strategy work:

1. Write docs/strategy/evidence-cycle-roadmap.md. Replace sequential infrastructure
   phases with Cycles 1–5. Every cycle must include product hypothesis, target segment,
   distribution hypothesis, smallest customer experience, manual/software-assisted
   fulfilment, evidence, payment/commitment test, decision threshold, required factory
   improvement, durable assets, and exactly one of Continue, Iterate, Pivot, Pause,
   Kill, or Scale.
2. Write docs/strategy/infrastructure-trigger-map.md. Preserve the long-term factory
   destination and cover every deferred capability named in the original Session 2
   request with enablement, reason to wait, explicit trigger, prior evidence,
   postponement consequence, and reuse class.
3. Draft five precise ADRs under docs/decisions/ covering:
   - evidence before infrastructure expansion;
   - distribution as a first-class product capability;
   - generalise only after repetition;
   - every experiment leaves reusable assets;
   - infrastructure requires an explicit evidence trigger.
   Each ADR needs context, decision, alternatives, positive/negative consequences,
   exceptions, and revisit signals.
4. Reconcile the roadmap, trigger map, ADRs, evidence-model vocabulary, human gates, and
   Distribution Experiment 001. Do not change application code or GitHub issues.
5. Run the repository documentation checks, inspect the diff for accidental code
   changes, confirm the recommended future PR is still bounded to 4–6 focused hours,
   commit the strategy artifacts with a Conventional Commit, and push the working
   state.

Reassess context after the roadmap and trigger map. If the ADRs cannot receive full
scrutiny before approximately 35% context usage, finish the current coherent section,
update docs/handoffs/session-2-strategy-handoff.md with verified progress and an exact
new continuation prompt, and stop rather than reducing quality.

End with the required Session 2 report and explicitly state that participant outreach
and implementation still require the human/privacy approvals recorded in the handoff.
```
