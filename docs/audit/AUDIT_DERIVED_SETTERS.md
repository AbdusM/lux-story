# Derived State Setter Audit

**Date:** January 27, 2026
**Purpose:** Phase 2.0 pre-requisite — map all direct derived-state setter call sites before deprecation.

## Summary

- **Active legacy setter calls:** 1 (useWaitingRoom.ts)
- **Archived legacy calls:** 6 (dev-tools.legacy.ts — already deprecated)
- **Correct-path calls (setCoreGameState):** 8 (StatefulGameInterface.tsx)
- **Correct-path calls (updateCoreGameState):** 6 (god-mode-api.ts, SimulationsArchive.tsx)
- **Correct-path calls (applyCoreStateChange):** 11 (god-mode-api.ts)
- **syncDerivedState:** Called internally by all 3 core setters — no external calls

## Legacy Setters (To Deprecate)

### `updateCharacterTrust(characterId, trust)` — game-store.ts:495-514
Bridge setter. Updates Zustand `characterTrust` directly, then attempts reverse-sync to `coreGameState`. Comment at line 492: "should ideally update through coreGameState."

| Caller | File:Line | Reason | Migration Target | Risk | Test Coverage |
|--------|-----------|--------|------------------|------|---------------|
| God Mode setTrust() | `lib/archive/dev-tools.legacy.ts:72` | Legacy API | Already superseded by `god-mode-api.ts:145` (`applyCoreStateChange`) | None (archived) | None needed |

### `updatePatterns(patterns)` — game-store.ts:532-550
Bridge setter. Updates Zustand `patterns` directly, then attempts reverse-sync to `coreGameState`. Comment at line 530: "should ideally update through coreGameState."

| Caller | File:Line | Reason | Migration Target | Risk | Test Coverage |
|--------|-----------|--------|------------------|------|---------------|
| God Mode setPattern() | `lib/archive/dev-tools.legacy.ts:77` | Legacy API | Already superseded by `god-mode-api.ts:178` (`applyCoreStateChange`) | None (archived) | None needed |
| WaitingRoom reveal | `hooks/useWaitingRoom.ts:108` | Pattern reward on timer reveal | `applyCoreStateChange({ patternChanges })` | **Medium** — active feature, must verify reward still applies | Add unit test |

### `setCharacterTrust(trustRecord)` — game-store.ts:517-521
Batch setter for syncing from GameState. No reverse-sync logic.

| Caller | File:Line | Reason | Migration Target | Risk | Test Coverage |
|--------|-----------|--------|------------------|------|---------------|
| (Internal sync only) | — | Used by syncDerivedState path | Remove when sync is atomic | Low | Covered by sync tests |

## Correct Path: Core State Setters

### `setCoreGameState(state)` — game-store.ts:736-740
Sets entire serialized state. Calls `syncDerivedState()` automatically.

| Caller | File:Line | Context |
|--------|-----------|---------|
| Atomic state wrapper | `StatefulGameInterface.tsx:1007` | Serializes gameState during sync |
| Skill decay | `StatefulGameInterface.tsx:1097` | Applies decay and resyncs |
| Load/init | `StatefulGameInterface.tsx:1360` | Full CoreGameState load |
| Post-choice consequence | `StatefulGameInterface.tsx:1787` | Journal/Constellation sync |
| Dialogue after choice | `StatefulGameInterface.tsx:2943` | Post-dialogue update |
| Interrupt completion | `StatefulGameInterface.tsx:3182` | After interrupt handling |
| Simulation fallback | `StatefulGameInterface.tsx:3323` | Error recovery |
| Node navigation | `StatefulGameInterface.tsx:3443` | After visiting node |

### `updateCoreGameState(updater)` — game-store.ts:743-749
Functional updater. Calls `syncDerivedState()` automatically.

| Caller | File:Line | Context |
|--------|-----------|---------|
| Simulation replay | `SimulationsArchive.tsx:41` | Updates currentSceneId |
| setPlatform() | `god-mode-api.ts:238` | Merges platform state |
| jumpToNode() | `god-mode-api.ts:276` | Navigation |
| jumpToCharacter() | `god-mode-api.ts:308` | Finds intro node |
| removeGlobalFlag() | `god-mode-api.ts:446` | Flag removal |
| clearAllFlags() | `god-mode-api.ts:465` | Bulk flag clear |

### `applyCoreStateChange(change)` — game-store.ts:752-763
Highest-level setter. Hydrates → applies StateChange → serializes. Calls `syncDerivedState()` automatically.

Used exclusively by `god-mode-api.ts` (11 call sites: setTrust, setPattern, setAllPatterns, unlockAllSimulations, unlockSimulation, forceGoldenPrompt, addKnowledgeFlag, addGlobalFlag, addThought, internalizeThought, setMystery).

## `syncDerivedState()` — game-store.ts:775-803

**Current behavior:**
1. Derives `visitedScenes` from conversation history
2. Updates ambient music based on current character's nervous system state

**Not externally callable.** Only triggered internally by `setCoreGameState`, `updateCoreGameState`, and `applyCoreStateChange`.

**Note:** Lines 773-774 comment that `characterTrust`, `patterns`, `thoughts` are "now derived via selectors." This means the bridge setters (`updateCharacterTrust`, `updatePatterns`) bypass the selector derivation — confirming they should be removed.

## Phase 2.1 Migration Actions

### Priority 1: Migrate useWaitingRoom.ts
```typescript
// BEFORE (hooks/useWaitingRoom.ts:108)
updatePatterns({
  [reveal.patternReward.pattern]: reveal.patternReward.amount,
} as Partial<Record<PatternType, number>>)

// AFTER
useGameStore.getState().applyCoreStateChange({
  patternChanges: { [reveal.patternReward.pattern]: reveal.patternReward.amount }
})
```

### Priority 2: Remove bridge setters
After migration, remove:
- `updateCharacterTrust` (lines 495-514)
- `updatePatterns` (lines 532-550)
- `setCharacterTrust` (lines 517-521)

Keep as thin wrappers with `console.warn('DEPRECATED')` for one release if needed.

### Priority 3: Make syncDerivedState atomic
Current: `set({ coreGameState })` then `get().syncDerivedState()` (two renders)
Target: Single `set({ coreGameState, ...derivedSlices })` call.

## Gate
- [ ] useWaitingRoom.ts migrated
- [ ] Bridge setters removed or wrapped with deprecation warnings
- [ ] All 1,120+ tests pass
- [ ] Manual smoke test: Samuel intro → first conversation → waiting room reveal
