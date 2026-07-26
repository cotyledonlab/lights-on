# Lights On

Lights On is a reusable, low-cost TypeScript software-factory scaffold. Phase 1 contains
a deliberately thin receipt-review experiment that runs locally with fake providers and
PostgreSQL.

The local journey is:

1. Join early access.
2. Submit a synthetic purchase record.
3. Let the worker extract deterministic fields.
4. Review and correct the record through the local reviewer interface.
5. View the structured result and record a payment-interest signal.

No cloud infrastructure is provisioned by this repository's default commands.

## Prerequisites

- macOS on Apple Silicon
- `mise`
- Docker Desktop or OrbStack
- Git
- GitHub CLI (only needed for roadmap automation)

## Quick start

```bash
make bootstrap
make local-up
make dev
```

Open <http://localhost:3000>. The local reviewer access code comes from `.env`;
`make bootstrap` creates that file from `.env.example` when it is missing.

Run validation with:

```bash
make lint
make typecheck
make test
make test-e2e
make build
```

See `docs/delivery/implementation-plan.md` for scope and
`docs/architecture/threat-model.md` for the Phase 1 security posture.

## Human gates

Infrastructure provisioning, external deployment, live provider credentials, and GitHub
roadmap mutation require explicit approval. The roadmap script is safe by default:

```bash
./scripts/bootstrap-github.sh --dry-run
```

Only a human-approved invocation with `--apply` may mutate GitHub.
