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

## Delivery conventions

- Use Conventional Commits.
- Keep development and production credentials and data separate.
- Production releases are always manual and use an already-tested immutable artifact.
- Do not add a network service or provider dependency without an interface, an ADR, and
  a measured need.
- Treat synthetic fixture data as the default for local and automated tests.
