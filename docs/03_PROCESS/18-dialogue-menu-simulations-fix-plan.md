# Implementation Plan (No Code Yet)

This plan describes targeted changes to close the gaps identified in the audit.

## 1) Simulation Registry Alignment
- Add a `simulation-id-map` (characterId → { contentId, libId }) to remove implicit coupling.
- Add a validator that asserts:
  - every `characterId` exists in both registries,
  - every `entryNodeId` resolves to an existing node in the dialogue graph,
  - mapping table stays current.

Suggested files:
- `lib/simulation-registry.ts` (export mapping)
- `content/simulation-registry.ts` (consume mapping for God Mode)
- `lib/graph-registry.ts` (character graph references)
- `tests/unit/simulation-registry.spec.ts` (new unit test)

## 2) Dialogue Gating Validation
- Build a lightweight validator that runs each graph’s nodes with a default baseline `GameState` and records any node where all choices are invisible.
- Add a small allowlist of nodes that intentionally start hidden.

Suggested files:
- `lib/dialogue-graph.ts` (validator helper)
- `tests/unit/dialogue-gating.spec.ts` (new unit test)

## 3) Dynamic Choice Safety
- Enforce minimum choice count after semantic filtering (e.g., never below 2 when there were 3+).
- Log a structured warning when dynamic choices replace static ones, including original/filtered counts.
- Replace hardcoded `playerId: 'player-main'` with a passed‑in context value.

Suggested files:
- `lib/story-engine.ts`
- `lib/choice-generator.ts`

## 4) In‑Game Menu Empty State / Guardrails
- Provide explicit empty states for Profile section when `onShowReport` is not provided and `playerId` is undefined.
- Add tests to verify menu items don’t collapse into sparse sections.

Suggested files:
- `components/UnifiedMenu.tsx`
- `tests/e2e/menu/unified-menu.spec.ts` (new)

## 5) Journal Tab Empty States
- Add “no data yet” fallback for tabs that depend on game state (`simulations`, `mind`, `analysis`, `opportunities`).
- Ensure badge logic doesn’t show “new” when content is empty.

Suggested files:
- `components/Journal.tsx`
- `components/SimulationsArchive.tsx`, `components/ThoughtCabinet.tsx`, `components/NarrativeAnalysisDisplay.tsx`
- `tests/e2e/journal/prism-tabs.spec.ts` (new)

