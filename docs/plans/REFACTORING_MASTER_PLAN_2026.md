# Refactoring Master Plan 2026

**Version:** 1.1.0
**Date:** January 27, 2026
**Context:** Result of [Repository Code Review](../audit/REPOSITORY_REVIEW_2026.md).
**Objective:** Deconstruct the "God Component" (`StatefulGameInterface`), harden state synchronization, and ensure content type safety.

---

## Cross-Cutting Principles

### Single Source of Truth Policy
- **Core state** (`coreGameState`) is authoritative for all gameplay data.
- **Derived state** is a read-only projection — never mutated directly.
- **UI state** (scroll position, animation phase, expanded/collapsed) is ephemeral and must not shadow gameplay state.

### Hook Discipline Rules
Every extracted hook must define a **side-effects contract**:

| Question | Must be answered |
|----------|-----------------|
| What inputs trigger effects? | Explicit dependency list |
| What state does it mutate? | None (returns patches) or single controlled setter |
| Is it allowed to call store setters? | Only the orchestrator hook may mutate |

**Stable identity requirements:**
- `useMemo` for returned `actions` objects
- `useCallback` for handlers passed to children
- No inline object construction in return values
- No hook may exceed 200 lines
- No hook may import UI components (keeps layers clean)

### Subhook Patch Pattern
Subhooks (1.2b, 1.2c) return **patches/events**, not call setters:
```typescript
// ✅ Subhook returns a patch
const { trustDelta } = useTrustCalculation(choice, gameState)

// ✅ Orchestrator applies all patches in one transaction
useChoiceHandler applies: { trustDelta, patternPatches, echoes, telemetryEvents }

// ❌ Subhook calls store setter directly
useTrustCalculation internally calls updateCharacterTrust() // FORBIDDEN
```

This gives idempotence (same input → same patch), simpler tests, and no rerender loops.

---

## 🏗 Phase 1: Deconstruct `StatefulGameInterface` (The Monolith)

**Goal:** Reduce `StatefulGameInterface.tsx` from ~4,200 lines to <1,500 lines by extracting distinct logical domains into custom hooks.

### 1.1 Extract `useAudioDirector`
**Context:** ~400 lines of audio logic (synth engine triggering, ambient mixing, pattern sounds) are mixed with UI code.
**Changes:**
- Create `hooks/game/useAudioDirector.ts`.
- Move `play*` functions, `synthEngine` initialization, and `LivingAtmosphere` audio triggers.
- **Input:** `GameState` (specifically `nervousSystemState` and `patterns`).
- **Output:** `actions` object (`playPatternSound`, `updateAmbience`, etc.) — wrapped in `useMemo`.

**⚠️ Audio-Specific Risks:**
- **Effect over-firing:** Ambient updates must be edge-triggered (threshold crossings or delta > X%), not on every render.
- **Race conditions:** Rapid anxiety spikes can queue conflicting audio. Debounce or use latest-wins pattern.
- **Cleanup leaks:** Hook cleanup must `stopAll`, close `AudioContext`, detach listeners. No hanging oscillators on unmount.
- **Test fragility:** Mocked synth ≠ real scheduling. Use an `AUDIO_EVENT` telemetry emitter in dev/test for deterministic assertions without real sound.

**✅ Validation & Verification:**
- [ ] **Unit Test:** Mock `synthEngine` and verify `useAudioDirector` triggers correct sounds on state changes.
- [ ] **Unit Test:** Verify cleanup function stops all audio and closes context.
- [ ] **Unit Test:** Verify ambient update only fires on threshold crossing, not every render.
- [ ] **Manual Verify:** Play the game. Ensure "Ambient Hum" changes when anxiety spikes. Ensure Pattern Orbs make sound when clicked.

### 1.2 Extract Choice Logic (Split Extraction)
**Context:** ~1,400 lines handling `handleChoice`. Too large for a single hook — split into focused units to avoid creating a second monolith.

#### 1.2a `useChoiceHandler` (Orchestrator — sole mutator)
- Create `hooks/game/useChoiceHandler.ts`.
- **Only hook allowed to call store setters.** Collects patches from subhooks and applies them in one deterministic transaction:
  1. Collect `trustDelta` from `useTrustCalculation`
  2. Collect `patternPatches`, `echoes` from `useConsequenceEchoes`
  3. Apply all patches in a single `setCoreGameState` call
  4. Emit telemetry events
- **Input:** `DialogueNode`, `GameState`.
- **Output:** `onChoice` callback (wrapped in `useCallback`).

#### 1.2b `useTrustCalculation` (Pure — returns patches only)
- Create `hooks/game/useTrustCalculation.ts`.
- Pure logic: trust delta from choice metadata, bounds checking.
- **Returns:** `{ trustDelta: number }` — never calls setters.

#### 1.2c `useConsequenceEchoes` (Pure — returns patches only)
- Create `hooks/game/useConsequenceEchoes.ts`.
- Consequence echo resolution and pattern patch computation.
- **Returns:** `{ patternPatches: PatternPatch[], echoes: ConsequenceEcho[], telemetryEvents: TelemetryEvent[] }` — never calls setters.

**✅ Validation & Verification:**
- [ ] **Unit Test (`useTrustCalculation`):** Assert trust +1 from a "Helping" choice, clamped to `MAX_TRUST`.
- [ ] **Unit Test (`useConsequenceEchoes`):** Assert echo is produced for a choice with consequence metadata.
- [ ] **Integration Test (`useChoiceHandler`):** Make a choice. Assert:
    - `coreGameState` updates correctly (Trust +1).
    - `visitedScenes` includes the new node.
    - `consequenceEcho` is returned.
- [ ] **Manual Verify:** Click a "Helping" choice. Verify the "Helping" orb glows and trust meter increases.

### 1.3 Extract `useNarrativeNavigator`
**Context:** Logic for `StateConditionEvaluator` and graph traversal is scattered (~300-500 lines estimated — audit before starting).
**Changes:**
- Create `hooks/game/useNarrativeNavigator.ts`.
- Encapsulate `getAvailableNodes`, `evaluateChoices`, and fallback logic.
- **Input:** `DialogueGraph`, `GameState`.
- **Output:** `{ currentNode, availableChoices, navigateTo }`.

**⚠️ Navigator-Specific Risks:**
- **Recomputation cost:** Memoize available nodes — don't recompute on every keystroke/tick. Only recompute when `GameState` or `currentNodeId` changes.
- **Divergence risk:** `currentNode` in this hook must always derive from core state's location, never maintain a shadow copy.
- **Fallback strictness:** Fallback logic should fail loud in CI/production (throw with node context), not silently recover. Silent recovery masks content errors that Phase 3 should catch.

**✅ Validation & Verification:**
- [ ] **Unit Test:** Feed a mock graph with a conditional node. Verify it returns `null` or `hidden` based on mock `GameState`.
- [ ] **Unit Test:** Verify missing node throws with clear error identifying the referencing node.
- [ ] **Unit Test:** Verify memoization — same `GameState` + `nodeId` returns same reference (no unnecessary recomputation).
- [ ] **Manual Verify:** Navigate a branching conversation. Confirm choices appear/hide based on trust and pattern state.

### 1.4 Orchestration Integration Test
**Context:** After all Phase 1 extractions, `StatefulGameInterface` becomes a thin shell composing the extracted hooks. This composition must be tested.
**Changes:**
- Create `tests/browser-runtime/stateful-game-orchestration.spec.ts`.
- Test the full render → choice → state update → next node cycle using the refactored component.

**Observable signals for audio assertions:**
- Mock the audio interface OR assert via `AUDIO_EVENT` telemetry emitter (see 1.1).
- If any timeouts/intervals exist in the flow, use deterministic tick control (`vi.useFakeTimers` or equivalent).

**✅ Validation & Verification:**
- [ ] **Integration Test:** Render `StatefulGameInterface`, make a choice, assert audio event emitted, trust updates, and next node renders.
- [ ] **Line Count Gate:** `StatefulGameInterface.tsx` is under 1,500 lines after all extractions.
- [ ] **Complexity Gate:** No extracted hook exceeds 200 lines. No function exceeds ~50 lines.

---

## 🛡 Phase 2: Harden State Management

**Goal:** Eliminate the risk of UI/Logic desynchronization in the Hybrid (Zustand + CoreState) model.

### 2.0 Call-Site Audit (Pre-requisite)
**Context:** Before deprecating direct setters, we need to know the blast radius.
**Changes:**
- Grep for all call sites of `updateCharacterTrust`, `updatePatterns`, and any other direct derived-state setters.
- **Deliverable:** `docs/audit/AUDIT_DERIVED_SETTERS.md` with table:

| Setter | Caller (file:line) | Reason for direct call | Migration target | Risk | Test coverage |
|--------|---------------------|------------------------|------------------|------|---------------|

- **Gate:** Do not proceed to 2.1 until audit is complete and migration paths are confirmed.

### 2.1 Automate Derived State Sync
**Context:** Currently, `syncDerivedState()` must be called manually after `setCoreGameState`.

**Design Requirement: Atomic Transaction**
- `syncDerivedState(coreState)` must be a **pure function** returning derived slices.
- `setCoreGameState` must update `{ core, ...derived }` in a **single Zustand `set()` call** — not "set core, then set derived" (two renders, potential stale read).
- Add a **reentrancy guard** or, preferably, design so sync cannot trigger further state updates.
- Add perf measurement: sync runs ≤ 1 time per `setCoreGameState` call.

**Changes:**
- Modify `lib/game-store.ts`.
- Make `syncDerivedState` private.
- Wrap `setCoreGameState` and `updateCoreGameState` to *always* call `syncDerivedState` internally within one `set()`.
- Migrate all call sites identified in 2.0 to use Core State setters.
- Remove deprecated direct setters only after all callers are migrated.

**⚠️ Rollback Gate:**
- All existing tests (1,120+) must pass before merging Phase 2.
- If any save-file migration or derived-state test fails, revert and reassess.
- Keep deprecated setters as thin wrappers (logging warnings) for one release cycle if migration is incomplete.

**🔍 Runtime Invariant (dev only):**
- After any core update, assert derived state matches `syncDerivedState(coreState)` output. Cheap structural equality check. Log warning on mismatch.

**✅ Validation & Verification:**
- [ ] **Unit Test:** Update `coreGameState.patterns.analytical`. Assert `useGameStore.getState().patterns.analytical` updates automatically without explicit sync call.
- [ ] **Unit Test:** Verify only one `set()` call occurs per `setCoreGameState` invocation (no double-render).
- [ ] **Regression Test:** Load an old save file (v1). Ensure migration logic still correctly populates derived state.
- [ ] **Smoke Test:** Full playthrough of Samuel intro → first character conversation. No console errors.

---

## 🔒 Phase 3: Content Safety & Tooling

**Goal:** Prevent runtime crashes due to typos in `nextNodeId`.

### 3.1 Content Validation Script
**Context:** `content/*.ts` files rely on string literals for IDs. A typo (`nextNodeId: "maya_intro"`) instead of (`"maya_introduction"`) causes a "Missing Node" crash.
**Changes:**
- Create `scripts/validate-content-integrity.ts`.
- Logic:
    1. Scan all `DialogueGraph` objects in `content/`.
    2. Build a `Set` of all valid `nodeId`s.
    3. Iterate all `choices`, `interrupts`, `interruptTargetNodeId` references, and `onEnter` node references.
    4. Error if any referenced `nodeId` is not in the Set.

**✅ Validation & Verification:**
- [ ] **CI Integration:** Add `npm run validate-content` to `package.json` `prebuild` script.
- [ ] **Test:** Intentionally introduce a typo in `maya-dialogue-graph.ts`. Run script. Assert it fails with a clear error message: "Node 'maya_typo' not found (referenced in 'maya_start')".

### 3.2 Type-Level Node Safety (Optional Enhancement)
**Context:** The validation script catches errors in CI. Type-level safety catches them at author time in the editor.
**Changes:**
- In each dialogue graph file, export node IDs as `as const`:
  ```typescript
  export const mayaNodeIds = ['maya_introduction', 'maya_trust_3', ...] as const
  export type MayaNodeId = typeof mayaNodeIds[number]
  ```
- Type `nextNodeId` fields as the union of valid IDs for that graph (or a broader `AllNodeIds` union for cross-graph references).
- Keep the runtime script (3.1) as the final gate — types reduce error rate upstream, script is the safety net.

**✅ Validation & Verification:**
- [ ] **Compile-time check:** Introduce a typo in `nextNodeId`. TypeScript reports error before build.

---

## 📅 Execution Strategy

**Reordered for maximum de-risking** — content validation moves early so refactored navigation code has CI guardrails from the start.

| Step | Phase | Risk | Parallelizable with |
|------|-------|------|---------------------|
| 1 | 1.1 Audio extraction | Low | 2.0, 3.1 |
| 2 | 2.0 Call-site audit | Zero (read-only) | 1.1, 3.1 |
| 3 | 3.1 Content validation script | Low | 1.1, 2.0 |
| 4 | 2.1 Atomic state sync | **High** | — (blocks on 2.0) |
| 5 | 1.2a-c Choice split | High effort | 3.2 (optional) |
| 6 | 1.3 Narrative navigator | Medium | — |
| 7 | 1.4 Orchestration test | Low | — (blocks on 1.1-1.3) |
| 8 | 3.2 Type-level safety (optional) | Low | 1.2, 1.3 |

### Rollback Policy
- Each phase merges as a separate PR.
- Phase 2 requires all 1,120+ existing tests green before merge.
- If a phase breaks gameplay, revert the PR rather than hotfix forward.

### Quality Gates (All Phases)
- **Line count:** `StatefulGameInterface.tsx` < 1,500 lines after Phase 1 complete.
- **Hook size:** No extracted hook exceeds 200 lines.
- **Layer separation:** No hook may import UI components (`components/*`).
- **Cyclomatic complexity:** No function exceeds complexity threshold (enforce via ESLint `complexity` rule).
- **Test coverage:** Each extracted hook has unit tests before merging. No phase merges with coverage regression.

---

## 🔗 Related Documents
- [Repository Audit](../audit/REPOSITORY_REVIEW_2026.md) - The analysis driving this plan.
- [Supabase Auth Plan](../../SUPABASE_AUTH_IMPLEMENTATION_PLAN.md) - Parallel security track.
