# State Architecture

## Overview

Grand Central Terminus uses a **hybrid persistence model**: localStorage for immediate responsiveness, Zustand for reactive in-memory state, and Supabase for durable server-side storage. This is not a single-source-of-truth architecture — it is a pragmatic multi-layer system coordinated by convention.

For full details, see:
- [Persistence Model](../architecture/01-persistence-model.md) — All storage layers, keys, audit commands, end-to-end walkthrough
- [Architecture Decisions](../architecture/02-architecture-decisions.md) — 6 ADRs with rationale
- [Data Model](../architecture/03-data-model.md) — Supabase schema, RLS, PII classification
- [Technical Debt](../architecture/04-technical-debt.md) — 10 items with owners and triggers
- [Security](../architecture/05-security.md) — Threat model, auth boundaries, localStorage risks

## Sources of Truth

| Data | Owner | File | Consumers |
|------|-------|------|-----------|
| Player patterns | `coreGameState` | `lib/character-state.ts` (grep: `GameState`) | Journal, Pattern Unlocks |
| Character trust | `coreGameState` | `lib/character-state.ts` (grep: `characters`) | Constellation, Echoes |
| Orb balance | `useOrbs` hook | `hooks/useOrbs.ts` (grep: `lux-orb-balance`) | Journal |
| Skills earned | `coreGameState` | `lib/game-store.ts` (grep: `setCoreGameState`) | Journey Summary |
| Scene history | `coreGameState` | `lib/game-store.ts` | Navigation |
| Current dialogue node | React state | `components/StatefulGameInterface.tsx` (grep: `currentNodeId`) | SGI |
| Active thoughts | `coreGameState` | `lib/character-state.ts` (grep: `thoughts`) | Thought Cabinet |
| Global flags | `coreGameState` | `lib/character-state.ts` (grep: `globalFlags`) | Conditional content |

## Key Files

### Core State (`lib/character-state.ts`)
- `GameState` interface — Hydrated state with Map/Set for dialogue engine
- `SerializableGameState` — Array-based format for JSON persistence
- `GameStateUtils` class — State transformations (returns new objects by convention, not enforced by freeze)

### Validation (`lib/graph-registry.ts`, `lib/patterns.ts`, `lib/emotions.ts`)
- `isValidCharacterId()` — Character ID validation
- `isValidPattern()` — Pattern type validation
- `isValidEmotion()` — Emotion type validation

### Constants (`lib/constants.ts`)
- Trust bounds, pattern thresholds, animation timings

### Persistence (`lib/game-store.ts`)
- Zustand store with `persist` middleware → `localStorage['grand-central-game-store']`
- Version 2 with migration from v0→v1→v2

### Hooks
- `useOrbs` — Orb balance (independent localStorage keys, not part of coreGameState)
- `useGameState` — Core state hook
- `useConstellationData` — Character relationship data

## State Ownership Rules

1. **Prefer immutable updates** — `GameStateUtils.applyStateChange()` returns a new object. This is enforced by convention and code review, not by `Object.freeze` or Immer. Direct mutation is a code review violation but not a runtime error.
2. **Trust is bounded** — Always 0-10, enforced by `NARRATIVE_CONSTANTS`
3. **Patterns are validated** — Only 5 valid patterns: analytical, patience, exploring, helping, building
4. **Character IDs are validated** — Only registered characters allowed via `isValidCharacterId()`

## Migration & Known Deviations

- **Zustand persist v2**: Migrated from flat fields to consolidated `coreGameState`. Legacy fields (top-level trust, patterns) are now derived from `coreGameState` via selectors.
- **Dual state during session**: React `useState` and Zustand `coreGameState` both hold game state during active play. They should stay in sync but can drift if setState fails.
- **Orbs outside GameState**: The orb economy (`lux-orb-*` keys) is not part of `coreGameState`. Save/load cannot capture orbs atomically.
- **No multi-tab coordination**: Last-write-wins on localStorage. Acceptable for single-player.
- **Archived code**: `lib/archive/game-state.legacy.ts` (Sprint 1), `lib/archive/orb-allocation-design.ts` (unused allocation).
- **Deprecated fields**: `OrbBalance.totalAllocated` and `OrbBalance.availableToAllocate` are always 0.

## Adding New State

1. Add field to `GameState` interface in `character-state.ts`
2. Add to `createNewGameState()` initialization
3. Add to `cloneGameState()` if complex type
4. Add handling in `applyStateChange()` if mutable
5. Create validation function if needed
6. Update Zustand persist version and migration if the field must survive reload
7. Document in [Persistence Model](../architecture/01-persistence-model.md) layer table
