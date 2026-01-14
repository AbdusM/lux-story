# Phase 2: State Architecture Fix
## Eliminating the Dual Source of Truth

**Date:** December 25, 2025
**Status:** Planning

---

## Problem Statement

The game store has a **dual source of truth** that causes state desync:

### Current Architecture (Broken)

```
┌─────────────────────────────────────────────────────────────────┐
│  Zustand Game Store                                             │
├─────────────────────────────────────────────────────────────────┤
│  Top-Level Fields (PERSISTED):                                  │
│  ├── characterTrust: Record<string, number>  ← CAN DESYNC       │
│  ├── patterns: PatternTracking              ← CAN DESYNC       │
│  └── thoughts: ActiveThought[]              ← CAN DESYNC       │
│                                                                 │
│  coreGameState: SerializableGameState (PERSISTED):             │
│  ├── characters[].trust  ← Source of truth                     │
│  ├── patterns            ← Source of truth                     │
│  └── thoughts            ← Source of truth                     │
│                                                                 │
│  syncDerivedState():                                           │
│  ├── Reads from coreGameState                                  │
│  ├── MERGES to top-level fields (doesn't replace!)             │
│  └── Called inconsistently                                     │
└─────────────────────────────────────────────────────────────────┘
```

### How Desync Happens

1. Component calls `updateCharacterTrust('maya', 7)`
2. This updates BOTH top-level `characterTrust` AND `coreGameState.characters`
3. Later, `setCoreGameState()` is called with different data
4. `syncDerivedState()` MERGES old top-level values with new values
5. Result: Stale data persists

### Evidence from Recent Commits

- `d55bc01`: "force Zustand sync in handleChoice to repair side-menu data streams"
- `b3fb451`: "disable chat pacing to prevent blank screens, ensure side menu data sync"

These are **symptoms**, not fixes. They add more sync calls instead of eliminating the root cause.

---

## Solution: Single Source of Truth

### Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Zustand Game Store                                             │
├─────────────────────────────────────────────────────────────────┤
│  coreGameState: SerializableGameState (ONLY SOURCE):           │
│  ├── characters[].trust                                         │
│  ├── patterns                                                   │
│  └── thoughts                                                   │
│                                                                 │
│  COMPUTED SELECTORS (not stored):                              │
│  ├── getCharacterTrust(id) → reads from coreGameState          │
│  ├── getPatterns() → reads from coreGameState                  │
│  └── getThoughts() → reads from coreGameState                  │
│                                                                 │
│  No syncDerivedState() needed!                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Step 1: Remove Derived Fields from Persistence (Low Risk)

**File:** `lib/game-store.ts`

Modify `partialize` to stop persisting derived fields:

```typescript
partialize: (state) => ({
  // ... other fields ...
  // REMOVE THESE:
  // characterTrust: state.characterTrust,
  // patterns: state.patterns,
  // thoughts: state.thoughts,

  // KEEP ONLY:
  coreGameState: state.coreGameState
})
```

### Step 2: Create Pure Derived Selectors

Replace merge-based sync with pure computed selectors:

```typescript
// NEW: Pure selectors that derive from coreGameState
export const useGameSelectors = {
  // Character trust - derived from coreGameState
  useCharacterTrust: (characterId: string) =>
    useGameStore((state) => {
      if (!state.coreGameState) return 0
      const char = state.coreGameState.characters.find(c => c.characterId === characterId)
      return char?.trust ?? 0
    }),

  // All character trust - derived from coreGameState
  useCharacterTrustAll: () =>
    useGameStore((state) => {
      if (!state.coreGameState) return {}
      const trustRecord: Record<string, number> = {}
      for (const char of state.coreGameState.characters) {
        trustRecord[char.characterId] = char.trust
      }
      return trustRecord
    }),

  // Patterns - derived from coreGameState
  usePatterns: () =>
    useGameStore((state) => state.coreGameState?.patterns ?? initialState.patterns),

  // Thoughts - derived from coreGameState
  useThoughts: () =>
    useGameStore((state) => state.coreGameState?.thoughts ?? [])
}
```

### Step 3: Route All Updates Through coreGameState

Modify action functions to ONLY update `coreGameState`:

```typescript
// BEFORE (broken - dual update)
updateCharacterTrust: (characterId, trust) => {
  set((state) => ({
    characterTrust: { ...state.characterTrust, [characterId]: trust }
  }))
  // Also sync to coreGameState...
}

// AFTER (correct - single source)
updateCharacterTrust: (characterId, trust) => {
  set((state) => {
    if (!state.coreGameState) return state
    return {
      coreGameState: {
        ...state.coreGameState,
        characters: state.coreGameState.characters.map(char =>
          char.characterId === characterId
            ? { ...char, trust }
            : char
        )
      }
    }
  })
}
```

### Step 4: Remove syncDerivedState()

Once all updates go through `coreGameState` and all reads use derived selectors:

1. Delete `syncDerivedState()` function
2. Remove calls to `syncDerivedState()` from `setCoreGameState`, `updateCoreGameState`, etc.
3. Keep top-level fields for migration compatibility but mark as deprecated

### Step 5: Add Migration for Existing Users

```typescript
migrate: (persistedState, version) => {
  if (version < 2 && persistedState) {
    // Users with old data: top-level fields take precedence
    // Merge into coreGameState and drop top-level
    const old = persistedState as OldGameState
    if (old.coreGameState && old.characterTrust) {
      // Sync top-level trust into coreGameState
      old.coreGameState.characters = old.coreGameState.characters.map(char => ({
        ...char,
        trust: old.characterTrust[char.characterId] ?? char.trust
      }))
    }
    // Drop the deprecated fields
    delete old.characterTrust
    delete old.patterns
    delete old.thoughts
  }
  return persistedState
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `lib/game-store.ts` | Remove derived fields from persistence, update selectors, route updates through coreGameState |
| `components/StatefulGameInterface.tsx` | Update to use new selectors |
| `components/Journal.tsx` | Update to use new selectors |
| `hooks/useGame.ts` | Update to use new selectors |

---

## Risks and Mitigations

### Risk 1: Breaking Existing User State
**Mitigation:** Migration code handles old format → new format

### Risk 2: Component Re-renders
**Mitigation:** Use shallow comparison in selectors, memoize where needed

### Risk 3: Third-party Code Using Old Fields
**Mitigation:** Keep fields as deprecated aliases initially, log warnings

---

## Testing Strategy

1. **Unit Test:** Verify selectors return correct data from coreGameState
2. **Integration Test:** Verify trust changes reflect in UI immediately
3. **E2E Test:** Play through game, verify no desync
4. **Migration Test:** Load old localStorage data, verify migration works

---

## Rollback Plan

If issues arise:
1. Revert to `pre-25dec-sprint` tag
2. Old persistence format is still compatible
3. `syncDerivedState()` will repopulate top-level fields

---

## Success Criteria

- [ ] No `syncDerivedState()` calls in codebase
- [ ] Only `coreGameState` in `partialize`
- [ ] All selectors derive from `coreGameState`
- [ ] All updates route through `coreGameState`
- [ ] Side menu shows correct data immediately after choices
- [ ] No "force sync" workarounds needed
