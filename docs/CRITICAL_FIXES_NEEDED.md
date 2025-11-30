# Critical Fixes Needed - State Sync Issues

**Priority:** HIGH  
**Impact:** Pattern tracking and state consistency

---

## 🚨 CRITICAL: Pattern Updates Lost

### Issue
`hooks/useGame.ts` calls `updatePatterns()` which updates Zustand directly but **does NOT** update `coreGameState`. When `syncDerivedState()` runs (after `setCoreGameState()`), it overwrites Zustand patterns with `coreGameState` patterns, **losing the updates**.

### Location
- `hooks/useGame.ts` - Line 306: `updatePatterns(patternUpdates)`

### Impact
- Pattern tracking from choice text analysis doesn't persist
- Patterns shown in UI may be stale or incorrect
- State inconsistency between game engine and UI

### Fix Options

**Option 1: Update through coreGameState (Recommended)**
```typescript
// In useGame.ts, replace:
updatePatterns(patternUpdates)

// With:
const zustandStore = useGameStore.getState()
const coreState = zustandStore.coreGameState
if (coreState) {
  const updated = {
    ...coreState,
    patterns: {
      ...coreState.patterns,
      ...patternUpdates
    }
  }
  zustandStore.setCoreGameState(updated)
  // syncDerivedState is called automatically
}
```

**Option 2: Make updatePatterns() sync with coreGameState**
```typescript
// In lib/game-store.ts, update updatePatterns():
updatePatterns: (patterns) => {
  set((state) => ({
    patterns: { ...state.patterns, ...patterns }
  }))
  // Also update coreGameState
  const core = get().coreGameState
  if (core) {
    const updated = {
      ...core,
      patterns: { ...core.patterns, ...patterns }
    }
    set({ coreGameState: updated })
    get().syncDerivedState() // Re-sync to ensure consistency
  }
}
```

---

## ⚠️ Verify: Skills Updates

**Check:** Does `updateSkills()` have the same issue?
- Location: `lib/game-store.ts` - Line 486
- If skills are updated directly (bypassing `coreGameState`), same fix needed

---

## 📝 Testing After Fix

1. Make choices that should update patterns (e.g., "explore", "help", "build")
2. Check Journal - verify patterns are updated
3. Reload page - verify patterns persist
4. Check ProgressIndicator - verify pattern count is accurate
