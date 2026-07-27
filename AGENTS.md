# Repository instructions

These rules apply throughout the repository unless a more specific `AGENTS.md` adds
stricter requirements.

1. Read the nearest applicable `AGENTS.md` before editing.
2. Read relevant ADRs and product documentation before implementation.
3. Work from a GitHub issue. During the initial bootstrap, use the matching entry in
   `docs/delivery/issue-catalogue.md` until roadmap creation is explicitly approved.
4. Restate acceptance criteria before making changes.
5. Prefer the smallest change satisfying the issue.
6. Do not combine unrelated refactors with feature work.
7. Add or update tests for behavioral changes.
8. Run the narrowest relevant tests during iteration.
9. Run the complete required validation before marking work complete.
10. Never expose, log, commit, or fabricate credentials.
11. Never provision infrastructure or deploy to production without explicit human
    approval.
12. Never bypass a failing test or security control merely to make CI green.
13. Record meaningful architectural decisions as ADRs.
14. Update runbooks when operational behavior changes.
15. Link every pull request to its issue.
16. Include deployment and rollback notes where applicable.
17. Keep generated code understandable to a human maintainer.
18. Ask for human judgment when requirements involve product, privacy, security, money,
    or irreversible operations.

## Context and scope safety

- Prefer one coherent mode of work per session: research, planning, implementation,
  review, or remediation.
- Before substantive work, assess whether the request fits carefully within one healthy
  context window. Aim to finish before approximately 35% context usage.
- At approximately 40% context usage, stop broad exploration and preserve verified
  findings in repository artifacts. Compaction is not permission to sustain indefinitely
  expanding work.
- Do not combine broad strategic discovery with substantial implementation.
- Reassess scope after each major phase and after unexpected architectural, security,
  privacy, persistence, or operational discoveries.
- If the request is oversized, push back before execution with an exact decomposition:
  what the current session will complete, what it will defer, which durable artifacts
  carry the work forward, and the exact prompt for the next fresh session.
- Complete the smallest coherent unit first. When stopping early, add a durable handoff
  under `docs/handoffs/` with the original objective, completed work, verified facts,
  decisions made, files changed, commands and tests run, current repository state,
  remaining acceptance criteria, unresolved risks, exact next action, and a
  ready-to-paste continuation prompt.
- Stop rather than silently degrade reasoning, testing, review, or documentation
  quality.

Exceptions are allowed only for tightly bounded mechanical work, when stopping would
leave the repository unsafe or inconsistent, for urgent remediation that must be
completed atomically, or when a human approves broader scope after reviewing the
decomposition. State the reason for the exception and continue only to the smallest safe
completion boundary.

## Delivery conventions

- Use Conventional Commits.
- Keep development and production credentials and data separate.
- Production releases are always manual and use an already-tested immutable artifact.
- Do not add a network service or provider dependency without an interface, an ADR, and
  a measured need.
- Treat synthetic fixture data as the default for local and automated tests.
