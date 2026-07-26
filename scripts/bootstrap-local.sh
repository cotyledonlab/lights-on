#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_file="${repo_root}/.env"

if [[ -f "${env_file}" ]]; then
  echo "Local environment already exists: ${env_file}"
  exit 0
fi

participant_secret="$(openssl rand -hex 32)"
reviewer_code="$(openssl rand -hex 12)"
reviewer_secret="$(openssl rand -hex 32)"

umask 077
{
  echo "DATABASE_URL=postgresql://lights_on:lights_on_local@127.0.0.1:54329/lights_on?schema=public"
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

