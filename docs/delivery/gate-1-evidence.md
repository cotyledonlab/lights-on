# Gate 1 evidence — local scaffold approval

**Prepared:** 2026-07-26  
**Decision status:** Awaiting explicit human approval  
**Scope:** Phase 1 only

## Outcome

The Phase 1 repository scaffold, local PostgreSQL workflow, fake-provider vertical
slice, tests, documentation, and CI workflow are complete. Automated evidence satisfies
the technical exit criteria for Gate 1, but automated checks do not approve the gate.

No external application or infrastructure was deployed. No OpenTofu or Ansible apply
command was run.

## Evidence

| Gate 1 criterion        | Result | Evidence                                                                                                                                                                                                                                                                               |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local setup works       | Pass   | `make bootstrap` completed; `make doctor` confirmed Node.js 24.18.0, pnpm, Git, Docker, OpenSSL, a healthy Docker daemon, mode `600` for `.env`, and no tracked environment files.                                                                                                     |
| CI works                | Pass   | GitHub Actions run [30208853098](https://github.com/cotyledonlab/lights-on/actions/runs/30208853098) passed on implementation commit `3b976f3207b33226d7885acaac2ae458aedb9559`. Draft PR: [#1](https://github.com/cotyledonlab/lights-on/pull/1).                                     |
| Tests work              | Pass   | Five unit tests, two PostgreSQL-backed integration tests, and one Playwright browser journey passed. The browser journey covers consent, submission, queued extraction, separate reviewer authentication, human correction, result viewing, payment interest, analytics, and deletion. |
| Documentation is usable | Pass   | Implementation plan, ADRs, architecture overview, threat model, roadmap, issue catalogue, local-development guide, operations notes, incident response, credential rotation, gate register, and evidence model are present under `docs/`.                                              |
| No committed secrets    | Pass   | Gitleaks scanned the implementation history and found no leaks. CI repeated the secret scan successfully. `.env` is ignored, mode `600`, and rejected by `make doctor` if tracked.                                                                                                     |

## Validation record

| Check                                    | Result                                              |
| ---------------------------------------- | --------------------------------------------------- |
| `pnpm format:check`                      | Pass                                                |
| `make lint`                              | Pass across all workspaces and browser tests        |
| `make typecheck`                         | Pass across the root and all workspaces             |
| `make test`                              | Pass: 5 unit and 2 integration tests                |
| `make test-e2e`                          | Pass: 1 full Chromium journey                       |
| `make build`                             | Pass: web production build and bundled worker       |
| Web and worker Docker builds             | Pass                                                |
| Worker packaged Prisma client smoke test | Pass: `prisma-client-ok`                            |
| Trivy web image scan                     | Pass: 0 HIGH or CRITICAL findings                   |
| Trivy worker image scan                  | Pass: 0 HIGH or CRITICAL findings                   |
| `pnpm audit --audit-level high`          | Pass: no high-severity finding; one low remains     |
| GitHub Actions `Validate and scan` job   | Pass, including browser, container, and scan stages |

## GitHub roadmap dry-run evidence

`./scripts/bootstrap-github.sh --dry-run` was the only roadmap bootstrap mode run. The
machine-readable report recorded:

- repository: `cotyledonlab/lights-on`
- mode: `dry-run`
- planned actions: 177
- `mutationPerformed`: `false`

Read-only verification after the run found zero issues and zero milestones. The nine
existing repository labels are GitHub defaults; no planned roadmap labels,
relationships, or project items were created.

## Limitations and deferred work

- Authentication, storage, email, extraction, analytics, and payment integrations are
  local or fake provider implementations.
- Receipt input is synthetic; the slice does not accept real participant documents.
- The local rate limiter is process-local and is not a distributed production control.
- There is no external deployment, external user access, paid resource, production
  backup, or restore evidence.
- Gate 0 architecture approval has not been recorded, so infrastructure provisioning
  remains prohibited.
- Later-phase OpenTofu, Ansible, deployment, monitoring, and live-provider work has not
  started.

## Human decision required

An authorized human must explicitly record one of:

- **Approve Gate 1** — permit planning for the next phase while retaining Gate 0 and
  Gate 2 infrastructure stops.
- **Reject Gate 1** — identify missing or unacceptable evidence.
- **Request changes** — list the additional evidence or remediation required.

Until that decision is recorded, Gate 1 remains **Awaiting explicit human approval** and
external deployment remains prohibited.
