# ADR 0001: TypeScript monorepo

- Status: Accepted for Phase 1
- Date: 2026-07-26

## Context

The factory needs a web application, worker, shared provider contracts, and a
single validation workflow that remains easy for one maintainer to understand.

## Decision

Use pnpm workspaces and Turborepo. Build the web app with Next.js App Router,
React, strict TypeScript, and Tailwind CSS. Keep shared packages source-first
and explicit.

## Consequences

- One lockfile and one toolchain reduce setup drift.
- Workspace boundaries make provider seams visible.
- Turborepo adds a small amount of configuration and cache behavior that must
  remain documented.
- A monorepo-wide change can affect multiple deployables, so CI validates the
  complete dependency graph.

