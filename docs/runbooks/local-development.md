# Local development runbook

## Start

```bash
make bootstrap
make local-up
make dev
```

## Check

```bash
make doctor
curl --fail http://localhost:3000/api/health
```

## Stop

Stop the foreground development command, then run:

```bash
make local-down
```

This keeps the PostgreSQL volume. Removing local data is intentionally not part of the
routine stop command.

## Troubleshooting

- If port 54329 is busy, stop the conflicting local service; do not point the
  application at an unreviewed database.
- If generated Prisma types are missing, run `pnpm db:generate`.
- If migrations fail, inspect `docker compose logs postgres` before changing schema or
  data.
