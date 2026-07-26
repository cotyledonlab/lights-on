# Infrastructure instructions

These rules add to the repository-level `AGENTS.md` for everything below
`infra/`.

1. Treat all infrastructure changes as security-sensitive and cost-sensitive.
2. Never run `tofu apply`, a production Ansible playbook, a Dokploy
   installation, or a deployment without explicit human approval for that
   exact environment and plan.
3. Never hardcode credentials, domains, IP addresses, server types, regions,
   account identifiers, or SSH key material.
4. Keep development and production state, credentials, networks, databases,
   storage, and encryption keys isolated.
5. Pin providers, modules, roles, and collections. Commit dependency lock files.
6. Require an explicit typed confirmation before destructive operations.
7. Show the full plan, resource inventory, firewall rules, expected recurring
   cost, and recovery implications at the applicable human gate.
8. Prefer least privilege and deny-by-default network rules.
9. Do not weaken host or CI security checks to make a plan pass.
10. Update the relevant runbook for any operational behavior change.
11. Never place infrastructure state or secret-bearing variable files in Git.
12. Stop when observed state differs materially from the reviewed plan.

