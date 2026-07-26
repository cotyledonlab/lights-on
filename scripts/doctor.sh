#!/usr/bin/env bash
set -euo pipefail

failed=0

check_command() {
  local command_name="$1"
  if command -v "${command_name}" >/dev/null 2>&1; then
    echo "ok command ${command_name}"
  else
    echo "missing command ${command_name}"
    failed=1
  fi
}

check_command git
check_command node
check_command pnpm
check_command docker
check_command openssl

node_major="$(node --version | tr -d 'v' | cut -d. -f1)"
if [[ "${node_major}" == "24" ]]; then
  echo "ok Node.js $(node --version)"
else
  echo "unexpected Node.js $(node --version); run mise install"
  failed=1
fi

if docker info >/dev/null 2>&1; then
  echo "ok Docker daemon"
else
  echo "unavailable Docker daemon"
  failed=1
fi

if [[ -f .env ]]; then
  mode="$(stat -f '%Lp' .env)"
  if [[ "${mode}" == "600" ]]; then
    echo "ok .env permissions 600"
  else
    echo "unsafe .env permissions ${mode}; expected 600"
    failed=1
  fi
else
  echo "missing .env; run make bootstrap"
  failed=1
fi

if git ls-files | grep -Eq '(^|/)\.env($|\.)'; then
  echo "unsafe tracked environment file"
  failed=1
else
  echo "ok no tracked environment files"
fi

exit "${failed}"

