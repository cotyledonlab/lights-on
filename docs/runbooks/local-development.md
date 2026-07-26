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
make test
curl --fail http://localhost:3000/api/health
```

`make test` runs destructive integration fixtures only in the PostgreSQL schema named by
`TEST_DATABASE_URL`. The command refuses to start unless that schema ends in `_test`; it
never cleans the normal development schema.

Forwarding headers do not affect the local process rate-limit identity. Leave
`TRUST_PROXY_HEADERS=false` unless the application is deployed behind a reviewed proxy
that overwrites inbound `X-Forwarded-For` and `X-Real-IP` values. Without that trusted
boundary, all direct requests deliberately share one conservative rate-limit bucket.

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
