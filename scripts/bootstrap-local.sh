#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_file="${repo_root}/.env"

if [[ -f "${env_file}" ]]; then
  if ! grep -q '^TEST_DATABASE_URL=' "${env_file}"; then
    database_url="$(sed -n 's/^DATABASE_URL=//p' "${env_file}" | head -n 1)"
    if [[ -z "${database_url}" ]]; then
      echo "Existing .env has no DATABASE_URL; cannot derive TEST_DATABASE_URL." >&2
      exit 1
    fi
    test_database_url="$(
      node -e '
        const url = new URL(process.argv[1]);
        url.searchParams.set("schema", "lights_on_test");
        process.stdout.write(url.toString());
      ' "${database_url}"
    )"
    printf 'TEST_DATABASE_URL=%s\n' "${test_database_url}" >>"${env_file}"
    chmod 600 "${env_file}"
    echo "Added isolated TEST_DATABASE_URL to ${env_file}"
  fi
  echo "Local environment already exists: ${env_file}"
  exit 0
fi

participant_secret="$(openssl rand -hex 32)"
reviewer_code="$(openssl rand -hex 12)"
reviewer_secret="$(openssl rand -hex 32)"

umask 077
{
  echo "DATABASE_URL=postgresql://lights_on:lights_on_local@127.0.0.1:54329/lights_on?schema=public"
  echo "TEST_DATABASE_URL=postgresql://lights_on:lights_on_local@127.0.0.1:54329/lights_on?schema=lights_on_test"
  echo "POSTGRES_DB=lights_on"
  echo "POSTGRES_USER=lights_on"
  echo "POSTGRES_PASSWORD=lights_on_local"
  echo "PARTICIPANT_COOKIE_SECRET=${participant_secret}"
  echo "REVIEWER_ACCESS_CODE=${reviewer_code}"
  echo "REVIEWER_COOKIE_SECRET=${reviewer_secret}"
  echo "NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000"
  echo "LOG_LEVEL=info"
} >"${env_file}"

echo "Created local environment: ${env_file}"
echo "Reviewer access code is stored in .env and was not printed."
