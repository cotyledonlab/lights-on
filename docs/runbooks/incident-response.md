# Incident response runbook

Phase 1 is local-only. If sensitive or non-synthetic data is entered:

1. Stop the web and worker processes.
2. Preserve only the minimum logs needed for diagnosis; do not copy raw input.
3. Revoke relevant local sessions and rotate any exposed local credentials.
4. Delete affected participant data through the product deletion path or an
   audited database transaction.
5. Record what happened, affected data, containment, and prevention work.
6. Require human review before restarting or broadening access.

