# Dialogue Topology Migration Protocol

Last updated: 2026-02-11
Status: `ACTIVE`

## Purpose

Protect save compatibility when dialogue graph topology changes (node split/merge/move/remove).

## Hard Rules

1. Never reuse a removed `nodeId` for new semantics.
2. For moved/renamed/removed nodes, add a redirect in `lib/dialogue-node-redirects.ts`.
3. Keep redirects for at least one release cycle after deployment.
4. Topology changes must not be combined with large text rewrites in the same PR.

## Redirect Contract

Each redirect entry must include:

- `toNodeId`
- `reason`
- `addedAt` (`YYYY-MM-DD`)
- optional `removeAfterVersion`

## Runtime Behavior

- Save load resolves `currentNodeId` through redirect map before graph validation.
- If redirected target belongs to another character graph, `currentCharacterId` is updated.
- If redirect mapping is invalid/cyclic, loader falls back to existing recovery path.

## Minimal Gate (Required)

Run:

- `npm run verify:dialogue-node-redirects`

Gate fails on:

- target node missing in `DIALOGUE_GRAPHS`
- self-redirects
- redirect cycles
- redirect chains exceeding max hops

Report output:

- `docs/qa/dialogue-node-redirects-report.json`

## Rollout Sequence for Topology Changes

1. Add new target nodes.
2. Add redirects for old nodes.
3. Ship with redirects active.
4. Validate no regressions in narrative sim and unreachable/unreferenced gates.
5. Remove stale redirects only after `removeAfterVersion` threshold.

## Required QA for Topology PRs

- `npm run verify:dialogue-node-redirects`
- `npm run verify:narrative-sim`
- `npm run verify:unreachable-dialogue-nodes`
- `npm run verify:unreferenced-dialogue-nodes`
- `npm run verify:required-state-guarding`

