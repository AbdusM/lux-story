# Persistence Model

> Audited as of commit `8d02824` on 2026-02-05

## Overview

Grand Central Terminus uses a **hybrid persistence model**: offline-first localStorage for immediate responsiveness, Zustand for in-memory reactive state, and Supabase for durable server-side storage. This design prioritizes mobile performance for the target audience (Birmingham youth, ages 14-24) where network connectivity is unreliable.

The system is **not** a clean single-source-of-truth architecture. It is a pragmatic hybrid where multiple layers own different slices of state, coordinated by convention rather than a transaction manager.

## Layer Table

| # | Layer | File | Key(s) | Owns | Write Freq | Authority |
|---|-------|------|--------|------|------------|-----------|
| 1 | **React state** | `components/StatefulGameInterface.tsx` | `useState` hooks | Current dialogue, UI state | Every choice | Authoritative for active session |
| 2 | **Zustand game store** | `lib/game-store.ts` (grep: `STORAGE_KEYS.GAME_STORE`) | `lux_story_v2_game_store` (`STORAGE_KEYS.GAME_STORE`, legacy `grand-central-game-store` migrated) | Core game state (trust, patterns, thoughts, skills, scenes) | Every choice | Authoritative (since v2 migration) |
| 3 | **Zustand station store** | `lib/station-state.ts` (grep: `station-evolution-store`) | `station-evolution-store` | Station atmosphere, platform visuals, ambient events | On scene change | Authoritative for station state |
| 4 | **Orb system (TD-004 migrated)** | `hooks/useOrbs.ts`, `lib/migrations/orb-migration.ts` | `lux_story_v2_game_store` (field: `orbs`), legacy `lux-orb-*` (migrated once) | Orb economy (balance, milestones) | On orb earn/spend | Authoritative (part of `coreGameState`) |
| 5 | **Reader mode** | `hooks/useReaderMode.ts` (grep: `lux-reader-mode`) | `lux-reader-mode` | Font preference | On toggle | Authoritative |
| 6 | **Audio settings** | `app/profile/page.tsx` (grep: `STORAGE_KEYS.AUDIO_`) | `lux_story_v2_audio_muted`, `lux_story_v2_audio_volume` (legacy `lux_audio_*` migrated) | Audio preferences | On change | Authoritative |
| 7 | **Guest mode** | `app/welcome/page.tsx` (grep: `STORAGE_KEYS.GUEST_MODE`) | `lux_story_v2_guest_mode` (legacy `lux_guest_mode` migrated) | Guest mode flag | Once | Authoritative |
| 8 | **SafeStorage wrapper** | `lib/persistence/storage-manager.ts` (grep: `lux_story_v1_`) | `lux_story_v1_*` (prefixed) | Versioned storage abstraction | Proxied | Derived (wraps localStorage) |
| 9 | **SyncQueue** | `lib/sync-queue.ts` (grep: `SyncQueue`) | In-memory queue | Deferred Supabase writes | On choice, batched | Buffered |
| 10 | **Supabase** | `app/api/user/*/route.ts` | Server-side tables | Durable player data | Async after choice | Authoritative for cross-device |
| 11 | **God Mode** | `lib/dev-tools/god-mode-api.ts` (grep: `window.godMode`) | `window.godMode`, `window.__GOD_MODE_ACTIVE` | Dev overrides | Dev only | Ephemeral |

## Authoritative vs Derived

**Authoritative layers** — own their data, other layers read from them:
- **Zustand game store** (`coreGameState`): trust, patterns, thoughts, skills, scene history. Since v2 migration, all legacy top-level fields consolidated here.
- **Orb economy** (`coreGameState.orbs`): updated via `useOrbs`, persisted atomically with the rest of game state (TD-004).
- **Settings hooks**: audio, reader mode, guest mode. Simple key-value, no cross-dependencies.

**Derived layers** — compute or cache from authoritative sources:
- Zustand selectors (`useGameSelectors`): 50+ memoized selectors that derive trust-per-character, active patterns, etc. from `coreGameState`.
- SafeStorage: wraps raw localStorage with versioning and quota management. Not a separate authority.

**Buffered layers** — collect writes, flush in batches:
- SyncQueue: accumulates Supabase writes per choice, flushes via `processQueue()`. 7-day retry TTL.
- Echo cascade: 23 evaluators run per choice, results collected then flushed once.

**Ephemeral layers** — dev/test only:
- God Mode: sets `window.__GOD_MODE_ACTIVE` flag, mutates Zustand directly. Not persisted independently.
- Profile cache: 24h TTL in localStorage for Supabase profile data.

## Choice-to-Save Pipeline

When a player clicks a dialogue choice, 5 stages execute:

```
Stage 1: COMPUTE
  StatefulGameInterface.handleChoice()
  → Deep clone current GameState
  → Run echo cascade (23 evaluators)
  → Calculate trust changes with pattern affinity
  → Build StateChange object

Stage 2: COMMIT
  → GameStateUtils.applyStateChange(state, change) → new GameState
  → React setState(uiPatch) (transient UI fields)
  → commitGameState(newGameState) → Zustand + localStorage (atomic)
  → Zustand persist middleware auto-writes to localStorage

Stage 3: BUFFER
  → Orb updates applied (`coreGameState.orbs`, via useOrbs)
  → Station state updates (useStationStore)
  → Consequence echoes collected
  → All flushed in single tick

Stage 4: SYNC
  → SyncQueue.addToQueue(payload)
  → Deferred processQueue() → POST /api/user/* routes
  → Supabase upserts via service_role

Stage 5: RENDER
  → React re-render from setState
  → Zustand selectors recompute
  → UI updates (dialogue, journal, constellation)
```

### Failure Points per Stage

| Stage | Failure | Impact | Recovery |
|-------|---------|--------|----------|
| COMPUTE | Clone corruption | Wrong state applied | None (silent) |
| COMMIT | localStorage quota exceeded | Zustand persist fails | SafeStorage clears non-essential keys, retries |
| COMMIT | Partial write (crash mid-commit) | React state ≠ localStorage | Backup key in GameStateManager |
| SYNC | Network failure | Supabase out of date | SyncQueue retries for 7 days |
| SYNC | API route error | Data lost after 7-day TTL | Manual re-sync required |
| RENDER | Stale selector cache | UI shows old data | forceRefresh() counter |

## Atomic Commit Boundaries

**Committed together** (in `handleChoice` flow):
- React `setState` (UI) + `commitGameState` (Zustand + localStorage) → single synchronous flow

**Committed separately** (own lifecycle):
- Station state (`useStationStore`) — own Zustand store
- SyncQueue — deferred, async
- Settings (audio, reader mode) — on user toggle

**Not coordinated:**
- Multi-tab writes: `useMultiTabSync` rehydrates on other-tab changes, but concurrent edits are still last-write-wins (no mutex/BroadcastChannel)
- Zustand persist + SafeStorage: both write to localStorage independently

## Failure Modes

1. **Quota exceeded** — SafeStorage (`lib/persistence/storage-manager.ts`, grep: `CRITICAL_KEYS`) distinguishes critical vs non-essential keys. On quota error, non-essential keys (`shownMagical`, `analytics_snapshots`, `session_metrics`, etc.) are cleared first, then retry.

2. **Partial write / crash** — GameStateManager maintains a backup key. On next load, if primary is corrupt, backup is used. No journaling or write-ahead log.

3. **Stale session** — SyncQueue items have timestamps. Items older than 7 days are dropped. No server-side conflict detection.

4. **Multi-tab corruption** — No coordination between tabs. Both tabs write `lux_story_v2_game_store` (`STORAGE_KEYS.GAME_STORE`) to localStorage. Last write wins. Known risk, accepted for single-player game.

5. **Corrupt JSON** — Zustand persist has custom storage with JSON validation (grep: `game-store.ts` lines 991-1042). Invalid JSON falls back to default state.

6. **Version mismatch** — Zustand persist version field (currently `2`) triggers migration logic. Versions 0→1→2 have migration functions. Unknown versions reset to defaults.

## Known Deviations from Ideal

- **UI state vs game state**: React `useState` in SGI holds only transient UI fields; persisted game data lives in Zustand (`coreGameState`) (TD-001).
- **Immutability is by convention**: `applyStateChange` returns a new object, but we do not `Object.freeze` game state at runtime. Dev-only freezing was tried and reverted because it broke choice-flow composition in development/E2E (TD-002).
- **10+ key families**: localStorage namespace is fragmented across multiple prefixes. Legacy `lux-orb-*` keys may still exist on old installs, but are migrated and removed on init (TD-004).

## Audit Commands

Verify each layer from terminal:

```bash
# All localStorage keys used in code
rg "localStorage\.(setItem|getItem|removeItem)" --no-filename | sort -u

# Zustand persist keys
rg "name:\s*['\"]" lib/game-store.ts lib/station-state.ts

# Orb migration keys (legacy)
rg "lux-orb-" lib/migrations/orb-migration.ts

# SafeStorage critical vs non-essential
rg "CRITICAL_KEYS|NON_ESSENTIAL" lib/persistence/storage-manager.ts

# SyncQueue usage
rg "SyncQueue|addToQueue|processQueue" -l

# Supabase write paths
rg "supabase.*from|\.insert|\.upsert|\.update" app/api/ -l

# God Mode API surface
rg "godMode\." lib/dev-tools/god-mode-api.ts | head -20

# Zustand v2 migration
rg "version.*2|migrate" lib/game-store.ts
```

## End-to-End Walkthrough

**Trace: Player clicks "I want to help Maya" choice**

1. **Click handler** — `StatefulGameInterface.tsx` (grep: `handleChoice`) receives the `DialogueChoice` object containing `stateChanges`, `patterns`, and `nextNodeId`.

2. **State computation** — `GameStateUtils.applyStateChange()` in `lib/character-state.ts` (grep: `applyStateChange`) deep-clones current state, applies trust delta to Maya's character entry, increments `helping` pattern, adds knowledge flags.

3. **Echo cascade** — `lib/consequence-echoes.ts` (grep: `evaluateEchoes`) runs 23 evaluators checking if this choice triggers any echoes (e.g., "Maya noticed your empathy").

4. **React UI commit** — `setState(uiPatch)` triggers re-render. New dialogue node loads.

5. **Zustand commit** — `commitGameState(newGameState)` persists to Zustand and localStorage atomically (TD-001). Zustand persist middleware also updates `localStorage['lux_story_v2_game_store']`.

6. **Orb update** — `useOrbs` (grep: `earnOrb`) updates `coreGameState.orbs` via `updateOrbs` (persisted under `lux_story_v2_game_store`).

7. **Station update** — `useStationStore` may update platform warmth if this is a platform-specific interaction.

8. **Sync queue** — `SyncQueue.addToQueue()` enqueues: `POST /api/user/relationship-progress` (trust update), `POST /api/user/skill-demonstrations` (if skill demonstrated), `POST /api/user/pattern-demonstrations` (helping pattern).

9. **Deferred sync** — `processQueue()` fires after render. Each API route uses `createClient()` with service_role to upsert into Supabase tables (`relationship_progress`, `skill_demonstrations`, `pattern_demonstrations`).

10. **Supabase write** — RLS policies enforce `auth.uid()::text = user_id`. Data is now durable server-side.

11. **Next session** — On reload, Zustand `persist` middleware hydrates from `localStorage['lux_story_v2_game_store']`. If localStorage is empty/corrupt, backup key is tried. If authenticated, Supabase data can re-seed.
