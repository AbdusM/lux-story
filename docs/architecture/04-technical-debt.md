# Technical Debt Register

> Audited as of commit `33ef4c2` on 2026-01-27

## Summary

10 items tracked. 3 high risk, 4 medium, 3 low.

---

## High Risk

### TD-001: Dual Source of Truth (Zustand + React State)

**Impact:** During active session, both React `useState` in StatefulGameInterface and Zustand `coreGameState` hold game state. They can drift if a `setState` call fails or if Zustand persist lags.

**Evidence:** `components/StatefulGameInterface.tsx` (grep: `useState<GameState>`), `lib/game-store.ts` (grep: `setCoreGameState`)

**Mitigation:** Zustand is authoritative for persistence. React state is authoritative for render. Convention enforced via code review.

**Resolution path:** Eliminate React `useState` for game state; derive all UI from Zustand selectors. Requires SGI refactor.

**Owner:** Core team
**Trigger:** Before multi-device sync
**Risk:** High
**Estimate:** Large

---

### TD-002: No Immutability Enforcement

**Impact:** `GameStateUtils.applyStateChange()` returns a new object by convention, but nothing prevents direct mutation. Subtle bugs possible from accidental state mutation.

**Evidence:** `lib/character-state.ts` (grep: `applyStateChange`). No `Object.freeze` or Immer usage.

**Mitigation:** Code review convention. All state changes routed through `applyStateChange`.

**Resolution path:** Add Immer for production mutations, or `Object.freeze` in dev builds. See [ADR-003](02-architecture-decisions.md#adr-003).

**Owner:** Core team
**Trigger:** Before adding new state mutators
**Risk:** High
**Estimate:** Medium

---

### TD-003: Scoped eslint-disable in StatefulGameInterface

**Impact:** SGI has 4 file-level eslint-disable directives suppressing: unused-vars, no-explicit-any, exhaustive-deps, prefer-const. Masks real issues alongside intentional suppressions.

**Evidence:** `components/StatefulGameInterface.tsx` (grep: `eslint-disable`)

**Mitigation:** Each directive has a comment explaining rationale. Tracked for cleanup.

**Resolution path:** Extract logic from SGI into smaller modules. Re-enable lint rules per-file. Part of ongoing SGI refactor.

**Owner:** Core team
**Trigger:** Next SGI refactor phase
**Risk:** High
**Estimate:** Large

---

## Medium Risk

### TD-004: Orbs Outside GameState

**Impact:** Orb economy uses independent localStorage keys (`lux-orb-*`), not part of `coreGameState`. Save/load cannot capture orbs atomically with game state.

**Evidence:** `hooks/useOrbs.ts` (grep: `lux-orb-balance`)

**Mitigation:** Orbs are cosmetic/reward, not gameplay-critical. Loss is inconvenient, not game-breaking.

**Resolution path:** Merge orb state into `coreGameState`. Requires migration. See [ADR-005](02-architecture-decisions.md#adr-005).

**Owner:** Core team
**Trigger:** Before save/load slot feature
**Risk:** Medium
**Estimate:** Medium

---

### TD-005: Fragmented localStorage Namespace

**Impact:** 10+ key families across prefixes: `grand-central-*`, `lux-orb-*`, `lux_*`, `lux-*`, `lux_story_v1_*`. No unified namespace makes auditing and cleanup difficult.

**Evidence:** `rg "localStorage\.(setItem|getItem)" --no-filename | sort -u`

**Mitigation:** SafeStorage wrapper (`lib/persistence/storage-manager.ts`, grep: `lux_story_v1_`) handles versioning for its keys. Other keys are standalone.

**Resolution path:** Consolidate all keys under `lux_story_v2_*` prefix. Requires migration from all existing key names.

**Owner:** Core team
**Trigger:** Before namespace consolidation or save export feature
**Risk:** Medium
**Estimate:** Medium

---

### TD-006: Multi-Tab Corruption Risk

**Impact:** No coordination between browser tabs. Both tabs can write to `grand-central-game-store` simultaneously. Last write wins, potentially losing recent choices.

**Evidence:** No `BroadcastChannel`, `StorageEvent`, or mutex in `lib/game-store.ts`.

**Mitigation:** Single-player game, multi-tab is uncommon usage. Zustand persist is near-instant (~1ms).

**Resolution path:** Add `StorageEvent` listener to detect external writes, or `BroadcastChannel` for tab coordination.

**Owner:** Core team
**Trigger:** Before PWA/offline support
**Risk:** Medium
**Estimate:** Small

---

### TD-007: Non-Deterministic Randomness in Gameplay

**Impact:** Some gameplay elements use `Math.random()` without seeding. Makes deterministic replay and testing harder.

**Evidence:** Grep for `Math.random()` in `lib/` and `components/`.

**Mitigation:** Core choice logic is deterministic. Randomness is cosmetic (animations, ambient events).

**Resolution path:** Replace with seeded PRNG for gameplay-affecting randomness. Keep `Math.random()` for cosmetic.

**Owner:** Core team
**Trigger:** Before deterministic replay/testing feature
**Risk:** Medium
**Estimate:** Small

---

## Low Risk

### TD-008: Legacy Type Casts in Simulation Props

**Impact:** Simulation-related code uses `as unknown as Record<string, number>` for skills access. Type safety gap.

**Evidence:** `lib/skill-zustand-bridge.ts` (grep: `as unknown as Record`)

**Mitigation:** Isolated to one file. Runtime behavior is correct.

**Resolution path:** Type the skills interface properly in Zustand store. Requires FutureSkills type cleanup.

**Owner:** Core team
**Trigger:** Simulation type cleanup sprint
**Risk:** Low
**Estimate:** Small

---

### TD-009: initializeGame Empty Dependencies

**Impact:** `initializeGame` in SGI uses `useEffect` with complex dependency management. Some deps may be stale.

**Evidence:** `components/StatefulGameInterface.tsx` (grep: `initializeGame`)

**Mitigation:** Covered by `eslint-disable react-hooks/exhaustive-deps`. Initialization runs once on mount.

**Resolution path:** Extract initialization into a custom hook with explicit deps. Part of SGI refactor.

**Owner:** Core team
**Trigger:** Next hook audit
**Risk:** Low
**Estimate:** Small

---

### TD-010: God Mode Keys in Production Build

**Impact:** `window.godMode` is accessible in production builds. Allows trust manipulation, node jumping, state export.

**Evidence:** `lib/dev-tools/god-mode-api.ts` (grep: `window.godMode`)

**Mitigation:** God Mode only modifies local state. Cannot affect other users. No server-side bypass. Sets `window.__GOD_MODE_ACTIVE` flag that prevents SyncQueue writes.

**Resolution path:** Gate behind `process.env.NODE_ENV === 'development'` check, or remove from production bundle via tree-shaking.

**Owner:** Core team
**Trigger:** Before public release
**Risk:** Low
**Estimate:** Small
