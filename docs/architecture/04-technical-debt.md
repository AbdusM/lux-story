# Technical Debt Register

> Audited as of commit `33ef4c2` on 2026-01-27
> Updated: 2026-02-04 (All 10 items resolved)

## Summary

10 items tracked. 0 high risk, 0 medium, 0 low.
**All 10 items resolved.** Technical debt backlog is clear.

---

## High Risk

### TD-001: Dual Source of Truth (Zustand + React State) ✅ RESOLVED

**Impact:** During active session, both React `useState` in StatefulGameInterface and Zustand `coreGameState` hold game state. They can drift if a `setState` call fails or if Zustand persist lags.

**Evidence:** `components/StatefulGameInterface.tsx` (grep: `useState<GameState>`), `lib/game-store.ts` (grep: `setCoreGameState`)

**Resolution:** Refactored SGI to read game state exclusively from Zustand:
1. `GameInterfaceState` now holds only UI fields (modals, loading, transient feedback)
2. Game data read via `useGameSelectors.useCoreGameStateHydrated()` (line 334)
3. All mutations go through `applyCoreStateChange` and `commitGameState`
4. Comment at line 331-333 documents the architecture

**Resolved:** 2026-02-04 (discovered already complete during audit)

---

### TD-002: No Immutability Enforcement ✅ RESOLVED

**Impact:** `GameStateUtils.applyStateChange()` returns a new object by convention, but nothing prevents direct mutation. Subtle bugs possible from accidental state mutation.

**Evidence:** `lib/character-state.ts` (grep: `applyStateChange`). No `Object.freeze` or Immer usage.

**Resolution:** Added `devFreeze()` wrapper that applies `Object.freeze` in development mode. All state returned from `applyStateChange()` is now frozen in dev, catching accidental mutations immediately.

**Resolved:** 2026-02-04

---

### TD-003: Scoped eslint-disable in StatefulGameInterface ✅ RESOLVED

**Impact:** SGI has 4 file-level eslint-disable directives suppressing: unused-vars, no-explicit-any, exhaustive-deps, prefer-const. Masks real issues alongside intentional suppressions.

**Evidence:** `components/StatefulGameInterface.tsx` (grep: `eslint-disable`)

**Resolution:** Removed all 4 file-level suppressions. Fixed underlying issues:
- Removed ~45 unused imports
- Fixed SimulationType mismatches in simulation types
- Added targeted `eslint-disable-line` for intentional exhaustive-deps omissions
- Documented dormant feature imports with block-level disable

**Resolved:** 2026-02-04

---

## Medium Risk

### TD-004: Orbs Outside GameState ✅ RESOLVED

**Impact:** Orb economy uses independent localStorage keys (`lux-orb-*`), not part of `coreGameState`. Save/load cannot capture orbs atomically with game state.

**Evidence:** `hooks/useOrbs.ts` (grep: `lux-orb-balance`)

**Resolution:**
1. Added `OrbState` interface and `INITIAL_ORB_STATE` to `lib/character-state.ts`
2. Extended `SerializableGameState` and `GameState` with `orbs` field
3. Rewrote `useOrbs` hook to read/write through Zustand (preserves public API)
4. Created migration helper (`lib/migrations/orb-migration.ts`)
5. Legacy keys migrated and removed on game init

**Resolved:** 2026-02-04

---

### TD-005: Fragmented localStorage Namespace ✅ RESOLVED

**Impact:** 10+ key families across prefixes: `grand-central-*`, `lux-orb-*`, `lux_*`, `lux-*`, `lux_story_v1_*`. No unified namespace makes auditing and cleanup difficult.

**Evidence:** `rg "localStorage\.(setItem|getItem)" --no-filename | sort -u`

**Resolution:**
1. Created unified storage key registry (`lib/persistence/storage-keys.ts`)
2. All keys now use `lux_story_v2_*` prefix
3. Created migration helper (`lib/persistence/storage-migration.ts`)
4. Updated all direct localStorage access across components/hooks
5. Legacy keys migrated automatically on first load

**Resolved:** 2026-02-04

---

### TD-006: Multi-Tab Corruption Risk ✅ RESOLVED

**Impact:** No coordination between browser tabs. Both tabs can write to `grand-central-game-store` simultaneously. Last write wins, potentially losing recent choices.

**Evidence:** No `BroadcastChannel`, `StorageEvent`, or mutex in `lib/game-store.ts`.

**Resolution:** Added `useMultiTabSync` hook (`hooks/useMultiTabSync.ts`) that:
- Listens for `storage` events from other tabs
- Debounces and rate-limits rehydration (max once/second)
- Rehydrates Zustand store when external changes detected
- Used in StatefulGameInterface

**Resolved:** 2026-02-04

---

### TD-007: Non-Deterministic Randomness in Gameplay ✅ RESOLVED

**Impact:** Some gameplay elements use `Math.random()` without seeding. Makes deterministic replay and testing harder.

**Evidence:** Grep for `Math.random()` in `lib/` and `components/`.

**Resolution:**
1. Updated gameplay-affecting calls to use `SeededRandom` from `lib/seeded-random.ts`:
   - `game-logic.ts` - Pattern sensation (30% chance)
   - `choice-generator.ts` - Augmentation and pattern selection
   - `tier2-evaluators.ts` - Probability checks (15%/20%)
   - `overdensity-system.ts` - Crowd and density calculations
   - `pattern-voices.ts` - Voice selection and conflict checks
   - `ambient-events.ts` - Event selection
2. Added 11 determinism tests (`tests/lib/seeded-determinism.test.ts`)
3. Cosmetic randomness (animations, IDs) remains with `Math.random()`

**Resolved:** 2026-02-04

---

## Low Risk

### TD-008: Legacy Type Casts in Simulation Props ✅ RESOLVED

**Impact:** Simulation-related code uses `as unknown as Record<string, number>` for skills access. Type safety gap.

**Evidence:** `lib/skill-zustand-bridge.ts` (grep: `as unknown as Record`)

**Resolution:** Created `SkillRecord` type alias and `toSkillRecord()` helper function in `lib/game-store.ts`. Encapsulates the type assertion in one place with clear documentation. Updated `skill-zustand-bridge.ts` to use the helper.

**Resolved:** 2026-02-04

---

### TD-009: initializeGame Empty Dependencies ✅ RESOLVED

**Impact:** `initializeGame` in SGI uses `useEffect` with complex dependency management. Some deps may be stale.

**Evidence:** `components/StatefulGameInterface.tsx` (grep: `initializeGame`)

**Resolution:** Extracted to `useGameInitializer` hook (`hooks/game/useGameInitializer.ts`):
1. Hook has file-level eslint-disable with clear explanation of intentional empty deps
2. `initializeGame` reads state imperatively from stores/managers (not through closures)
3. Function is intentionally stable - created once, reads current state when called
4. This is the correct pattern for initialization logic that shouldn't re-create

**Resolved:** 2026-02-04

---

### TD-010: God Mode Keys in Production Build ✅ RESOLVED

**Impact:** `window.godMode` is accessible in production builds. Allows trust manipulation, node jumping, state export.

**Evidence:** `lib/dev-tools/god-mode-api.ts` (grep: `window.godMode`)

**Resolution:** Implemented multi-layer protection:
1. `GodModeBootstrap.tsx` gates loading behind `NODE_ENV === 'development' || isEducator` check
2. `useUserRole` hook validates educator role via Supabase auth + profiles table (RLS protected)
3. `createGodModeAPI()` returns no-op proxy if `__GOD_MODE_AUTHORIZED` flag not set
4. Dynamic import code-splits God Mode into separate chunk, only loaded for educators
5. `__GOD_MODE_ACTIVE` flag prevents SyncQueue writes during state manipulation

**Security model:** Regular production users never trigger the import. Only server-validated educators can access. Even manual bypass only affects local state (no server-side impact).

**Resolved:** 2026-02-04
