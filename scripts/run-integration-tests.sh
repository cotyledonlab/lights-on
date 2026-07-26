#!/usr/bin/env bash
set -euo pipefail

test_database_url="${TEST_DATABASE_URL:-}"
if [[ -z "${test_database_url}" ]]; then
  echo "TEST_DATABASE_URL is required for integration tests." >&2
  exit 1
fi

test_schema="$(
  node -e '
    const url = new URL(process.argv[1]);
    process.stdout.write(url.searchParams.get("schema") ?? "");
  ' "${test_database_url}"
)"
if [[ ! "${test_schema}" =~ _test$ ]]; then
  echo "Refusing integration tests: TEST_DATABASE_URL must select a schema ending in _test." >&2
  exit 1
fi

export DATABASE_URL="${test_database_url}"
pnpm db:deploy
pnpm exec turbo run test:integration
