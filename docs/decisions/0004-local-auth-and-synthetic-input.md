# ADR 0004: Local auth and synthetic input

- Status: Accepted for Phase 1
- Date: 2026-07-26

## Context

The workflow needs participant continuity and an authorized reviewer without introducing
a live identity provider or processing real purchase documents.

## Decision

Use random opaque participant sessions stored as SHA-256 hashes and secure, HTTP-only
cookies. Protect the local reviewer interface with an environment-supplied access code
and a separate opaque session. Accept synthetic text purchase records only.

## Consequences

- Browser tests can exercise real authorization boundaries without external accounts.
- The reviewer mechanism is development-only and must be replaced before external users
  are invited.
- No arbitrary files or real receipts should enter Phase 1.
- Session revocation and participant deletion can be implemented in the local database.
