#!/usr/bin/env bash
set -euo pipefail

for attempt in {1..30}; do
  if docker compose exec -T postgres pg_isready \
    -U "${POSTGRES_USER:-lights_on}" \
    -d "${POSTGRES_DB:-lights_on}" >/dev/null 2>&1; then
    echo "PostgreSQL is ready."
    exit 0
  fi
  sleep 1
done

echo "PostgreSQL did not become ready within 30 seconds." >&2
exit 1

