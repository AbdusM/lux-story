# Dual State Consolidation Plan

**Date:** January 27, 2026
**Risk Level:** HIGH — touches core game loop
**Estimated Scope:** 8 files, ~200 lines changed
**Requires:** Full test pass at every step. No big-bang rewrites.

---

## Problem Statement

Three competing sources of truth for game state:

| Source | What It Holds | Who Reads It |
|--------|--------------|--------------|
| React `useState` (SGI) | `state.gameState` — hydrated GameState with Map/Set | SGI render, choice handler |
| Zustand `game-store.ts` | `coreGameState` — serialized copy (arrays) | Journal, Constellation, God Mode |
| localStorage | `grand-central-terminus-save` | Only at initialization |

**Every choice triggers a triple write** (React setState → localStorage save → Zustand setCoreGameState), plus an "early sync hack" in `useChoiceHandler.ts:452` that writes to Zustand _before_ setState to keep side menus fresh. This means Zustand updates **twice per choice**.

### Where Drift Occurs

| Scenario | React | Zustand | localStorage |
|----------|-------|---------|-------------|
| Normal choice | Updated | Updated (2x) | Saved |
| God Mode nav | Updated | Partial | **Not saved** |
| Constellation nav | Updated | Partial | Saved |
| Thought updates | **Stale** | Updated | **Not saved** |

---

## Target Architecture

**Zustand becomes the single source of truth.** React state holds only UI-ephemeral data (modals, loading, selected choice, etc).

```
BEFORE:                          AFTER:

React useState                   Zustand (source of truth)
  └─ gameState (hydrated)          └─ coreGameState (serialized)
  └─ currentNode                   └─ derived selectors
  └─ availableChoices
  └─ showJournal (UI)            React useState (UI only)
  └─ isProcessing (UI)             └─ showJournal
                                    └─ isProcessing
Zustand                             └─ selectedChoice
  └─ coreGameState (copy)          └─ error
  └─ derived fields
                                 localStorage (persistence)
localStorage                      └─ auto-synced from Zustand
  └─ manual saves
```

---

## Migration Steps (INCREMENTAL — one PR per step)

### Step 1: Add Zustand Selectors for Game Data

**Files:** `lib/game-store.ts`
**Risk:** LOW — additive only

Add hydrated selectors that return the same types SGI currently uses:

```typescript
// New selectors in game-store.ts
useCurrentNode: () => {
  const core = useGameStore(s => s.coreGameState)
  if (!core) return null
  const graph = getGraphForCharacter(core.currentCharacterId, hydrate(core))
  return graph.nodes.get(core.currentNodeId) || null
}

useCurrentCharacterId: () => useGameStore(s => s.coreGameState?.currentCharacterId || 'samuel')

useAvailableChoices: () => {
  // Evaluate choices from current node + game state
}

useHydratedGameState: () => {
  // Return full hydrated GameState (Map/Set) from coreGameState
  // Memoized to avoid unnecessary re-hydration
}
```

**Verify:** `npx tsc --noEmit && npm test`

### Step 2: Move Game State Writes to Zustand First

**Files:** `hooks/game/useChoiceHandler.ts`, `hooks/game/useReturnToStation.ts`, `hooks/game/useGameInitializer.ts`
**Risk:** MEDIUM — changes write order

Currently: `setState(React) → saveGameState(localStorage) → setCoreGameState(Zustand)`
Target: `setCoreGameState(Zustand) → auto-persist(localStorage) → derive for React`

Add auto-persist middleware to Zustand:

```typescript
// In game-store.ts, add persist middleware
const persistGameState = (state: SerializableGameState) => {
  // Debounced save to localStorage
  GameStateManager.saveGameState(GameStateUtils.hydrate(state))
}
```

Update choice handler to write Zustand first, then derive React state from it:

```typescript
// BEFORE (useChoiceHandler.ts:1489-1539)
setState({ gameState: newGameState, ... })           // React
GameStateManager.saveGameState(newGameState)          // localStorage
zustandStore.setCoreGameState(serialize(newGameState)) // Zustand

// AFTER
zustandStore.setCoreGameState(serialize(newGameState)) // Zustand (auto-persists)
setState({ /* UI-only fields */ })                     // React (no gameState)
```

**Verify:** `npx tsc --noEmit && npm test && npm run build`

### Step 3: Remove `state.gameState` from React

**Files:** `components/StatefulGameInterface.tsx`
**Risk:** HIGH — largest change

Replace all `state.gameState` reads with Zustand selectors:

```typescript
// BEFORE
const currentCharacter = state.gameState?.characters.get(state.currentCharacterId)

// AFTER
const gameState = useGameSelectors.useHydratedGameState()
const currentCharacter = gameState?.characters.get(currentCharacterId)
```

Remove `gameState` from `GameInterfaceState` interface. Keep only:
- `currentNode`, `currentGraph`, `currentCharacterId` — dialogue navigation
- `availableChoices`, `currentContent`, `currentDialogueContent` — display
- All UI flags (`showJournal`, `isProcessing`, `selectedChoice`, etc.)

**Verify:** `npx tsc --noEmit && npm test && npm run build && npm run test:e2e -- --project=core-game`

### Step 4: Remove Early Sync Hack

**Files:** `hooks/game/useChoiceHandler.ts`
**Risk:** LOW (after Step 3)

Delete the early sync at line 452:
```typescript
// DELETE THIS (line 452):
useGameStore.getState().setCoreGameState(GameStateUtils.serialize(newGameState))
```

Since side menus now read from Zustand (which is updated first in Step 2), the early sync is unnecessary.

**Verify:** `npx tsc --noEmit && npm test`

### Step 5: Fix God Mode and Constellation Navigation

**Files:** `components/StatefulGameInterface.tsx` (navigation effects)
**Risk:** MEDIUM

Ensure all navigation paths write to Zustand:
- God Mode refresh effect (~line 497): Add `zustandStore.setCoreGameState()` call
- Constellation navigation (~line 546): Add `zustandStore.setCoreGameState()` call

**Verify:** Manual test — God Mode navigation, Constellation navigation

### Step 6: Remove Deprecated Setters

**Files:** `lib/game-store.ts`
**Risk:** LOW

Remove:
- `updateCharacterTrust()` (line 536)
- `updatePatterns()` (line 576)

All callers should use `setCoreGameState()` or `applyCoreStateChange()`.

**Verify:** `npx tsc --noEmit && npm test`

### Step 7: Rename `syncDerivedState`

**Files:** `lib/game-store.ts`
**Risk:** LOW

Current `syncDerivedState()` only derives `visitedScenes`. Rename to `syncVisitedScenes()` or expand to actually derive all fields.

---

## Verification at Each Step

```bash
npx tsc --noEmit --pretty   # Type safety
npm test                      # 1,232 unit tests
npm run build                 # Production build
# After Step 3:
npm run test:e2e -- --project=core-game  # Game loop E2E
```

## Rollback Plan

Each step is a separate commit. If any step breaks E2E tests:
1. `git revert HEAD`
2. Run full test suite to confirm revert
3. Investigate before re-attempting

## Files Changed Per Step

| Step | Files | Lines Changed (est.) |
|------|-------|---------------------|
| 1 | `game-store.ts` | +60 |
| 2 | `useChoiceHandler.ts`, `useReturnToStation.ts`, `useGameInitializer.ts`, `game-store.ts` | ~80 |
| 3 | `StatefulGameInterface.tsx`, `game-interface-types.ts` | ~120 (largest) |
| 4 | `useChoiceHandler.ts` | -5 |
| 5 | `StatefulGameInterface.tsx` | ~20 |
| 6 | `game-store.ts` | -60 |
| 7 | `game-store.ts` | ~5 |

## Key Risks

1. **Step 3 is the critical path.** Everything else is low-medium risk. If Step 3 breaks E2E, stop and reassess.
2. **Hydration performance.** Zustand stores serialized state (arrays). Hydrating to Map/Set on every render could be expensive. Use `useMemo` with shallow comparison.
3. **Concurrent React updates.** Moving from `setState` to Zustand means React re-renders are triggered by store subscriptions, not direct state updates. Verify no tearing.
