# TD-001 Step 3: Remove `state.gameState` from SGI React State

**Date:** January 29, 2026
**Risk Level:** HIGH — largest change in the consolidation
**Estimated Scope:** 1 file heavily modified, ~50-100 lines changed
**Prerequisite:** Steps 1-2 complete (✅)

---

## Goal

Remove `gameState: GameState | null` from `StatefulGameInterface`'s React `useState`, making Zustand the single source of truth for game state. React state will only hold UI-ephemeral data.

---

## Current State (Before)

```typescript
// StatefulGameInterface.tsx - current GameInterfaceState
interface GameInterfaceState {
  gameState: GameState | null          // ← REMOVE THIS
  currentNode: DialogueNode | null
  currentGraph: DialogueGraph | null
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: DialogueContent | null
  currentDialogueContent: DialogueContent | null
  // ... UI flags (showJournal, isProcessing, etc.)
}
```

**Problem:** `state.gameState` duplicates what's in Zustand's `coreGameState`. Every choice triggers:
1. React `setState({ gameState: newGameState, ... })`
2. localStorage `saveGameState(newGameState)`
3. Zustand `setCoreGameState(serialize(newGameState))`

Plus an "early sync hack" that writes to Zustand BEFORE setState (line 453).

---

## Target State (After)

```typescript
// StatefulGameInterface.tsx - target GameInterfaceState
interface GameInterfaceState {
  // REMOVED: gameState — now read from Zustand via useGameSelectors.useCoreGameStateHydrated()
  currentNode: DialogueNode | null
  currentGraph: DialogueGraph | null
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: DialogueContent | null
  currentDialogueContent: DialogueContent | null
  // ... UI flags unchanged
}
```

**New pattern:** Components that need `GameState` read it from Zustand:
```typescript
const gameState = useGameSelectors.useCoreGameStateHydrated()
```

---

## Files Changed

| File | Changes | Risk |
|------|---------|------|
| `components/StatefulGameInterface.tsx` | Remove `gameState` from state, use Zustand selector | HIGH |
| `lib/game-interface-types.ts` | Update `GameInterfaceState` interface | LOW |
| `hooks/game/useChoiceHandler.ts` | Update write path (Zustand first) | MEDIUM |

---

## Migration Steps

### Step 3a: Add `gameState` reader at top of SGI

**Before any removals**, add a Zustand read so we can verify behavior:

```typescript
// At top of StatefulGameInterface component
const zustandGameState = useGameSelectors.useCoreGameStateHydrated()

// Temporarily use both, prefer Zustand
const effectiveGameState = zustandGameState ?? state.gameState
```

**Verify:** App works identically. Run E2E tests.

---

### Step 3b: Update all `state.gameState` reads to use `effectiveGameState`

Find all occurrences of `state.gameState` in SGI and replace with `effectiveGameState`:

```typescript
// BEFORE
if (state.gameState?.currentNodeId) { ... }
<GameHeader gameState={state.gameState} ... />

// AFTER
if (effectiveGameState?.currentNodeId) { ... }
<GameHeader gameState={effectiveGameState} ... />
```

**Actual occurrences:** 66 (verified via `rg "state\.gameState" -c`)

**Verify:** App works identically. Run E2E tests.

---

### Step 3c: Update `setState` calls to stop writing `gameState`

In `useChoiceHandler.ts`, change the final setState to not include gameState:

```typescript
// BEFORE (line ~1536)
setState({
  gameState: newGameState,
  currentNode: nextNode,
  currentCharacterId: nextCharacterId,
  ...
})

// AFTER
setState({
  // REMOVED: gameState — now in Zustand only
  currentNode: nextNode,
  currentCharacterId: nextCharacterId,
  ...
})
```

**Critical:** The Zustand write at line 1539 becomes the ONLY place game state is stored:
```typescript
zustandStore.setCoreGameState(GameStateUtils.serialize(newGameState))
```

**Verify:** App works. Choices update correctly. Journal/Constellation see changes.

---

### Step 3d: Remove `gameState` from interface and initial state

```typescript
// lib/game-interface-types.ts
interface GameInterfaceState {
  // REMOVED: gameState: GameState | null
  ...
}

// StatefulGameInterface.tsx - initial state
const [state, setState] = useState<GameInterfaceState>({
  // REMOVED: gameState: null
  currentNode: null,
  ...
})
```

---

### Step 3e: Remove `effectiveGameState` shim

Once verified working, simplify:

```typescript
// BEFORE (shim)
const zustandGameState = useGameSelectors.useCoreGameStateHydrated()
const effectiveGameState = zustandGameState ?? state.gameState

// AFTER (clean)
const gameState = useGameSelectors.useCoreGameStateHydrated()
```

---

## Verification Checklist

After each sub-step, verify:

- [ ] `npx tsc --noEmit` — No type errors
- [ ] `npm test` — All 1,232 tests pass
- [ ] `npm run build` — Production build succeeds
- [ ] Manual test: Start new game, make 3 choices
- [ ] Manual test: Refresh page, state persists
- [ ] Manual test: Open Journal, patterns/trust display correctly
- [ ] Manual test: Open Constellation, characters show correct trust

After Step 3c specifically:
- [ ] `npm run test:e2e -- --project=core-game` — Game loop E2E passes

---

## Rollback Plan

Each sub-step is a separate commit. If any step breaks:

```bash
git revert HEAD
npm test  # Verify revert worked
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stale data in child components | Medium | High | Zustand selector triggers re-render |
| Race condition on rapid choices | Low | Medium | Zustand updates are synchronous |
| localStorage not updated | Low | High | `setCoreGameState` auto-persists via middleware |
| Side menus show wrong data | Medium | Medium | Already migrated to read from Zustand |

**Biggest risk:** Components that still receive `gameState` as prop (like StationStatusBadge) will get stale data until they're migrated. Mitigation: Keep passing `effectiveGameState` to them.

---

## What This Enables

Once Step 3 is complete:
- **Step 4** (remove early sync hack) becomes safe — Zustand is the only write target
- **Step 5** (God Mode/Constellation nav) becomes simpler — single source of truth
- Future: Multi-device sync only needs to sync Zustand, not React state

---

## Estimated Time

| Sub-step | Time |
|----------|------|
| 3a: Add reader | 10 min |
| 3b: Update reads (66 occurrences) | 45-60 min |
| 3c: Update writes | 30 min |
| 3d: Remove from interface | 10 min |
| 3e: Clean up shim | 5 min |
| Testing between steps | 45 min |
| **Total** | ~2.5-3 hours |

---

## Decision Point

**Should we proceed?**

- ✅ Pros: Eliminates dual-state drift, simplifies mental model, enables future sync
- ⚠️ Cons: Large change, risk of subtle bugs, requires careful testing

**Alternative:** Stop at Step 2, document remaining tech debt, defer to later sprint.
