#!/usr/bin/env bash
set -euo pipefail

operation="${1:-unknown}"
environment="${2:-unspecified}"

case "${environment}" in
  development | production) ;;
  *)
    echo "ENV must be development or production." >&2
    exit 2
    ;;
esac

echo "${operation} for ${environment} belongs to a later approved phase." >&2
echo "No infrastructure or deployment action was performed." >&2
exit 3

