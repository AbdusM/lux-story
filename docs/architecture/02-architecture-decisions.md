# Architecture Decision Records

> Audited as of commit `33ef4c2` on 2026-01-27

## Changelog

| ADR | Date | Status | Title |
|-----|------|--------|-------|
| ADR-001 | 2024-10 | Active | Hybrid persistence (localStorage + Zustand + Supabase) |
| ADR-002 | 2024-10 | Active | Zustand over Redux |
| ADR-003 | 2024-11 | Active, hardening in progress | No immutability enforcement |
| ADR-004 | 2024-12 | Active | Offline-first sync queue |
| ADR-005 | 2025-01 | Active (tech debt) | Orbs outside GameState |
| ADR-006 | 2024-10 | Active | localStorage over IndexedDB |

---

## ADR-001: Hybrid Persistence

**Status:** Active
**Date:** 2024-10

### Context
The game targets Birmingham youth (14-24) on mobile devices with unreliable network connectivity. The game must feel responsive (<100ms for choice feedback) and survive network outages without data loss.

### Decision
Use a three-layer persistence model:
1. **localStorage** — immediate, synchronous persistence for game state
2. **Zustand** — in-memory reactive store with `persist` middleware writing to localStorage
3. **Supabase** — durable server-side storage, synced asynchronously via SyncQueue

### Consequences
- **Positive**: Game works offline. Choices feel instant. Server data is durable.
- **Negative**: Three layers to keep in sync. No single source of truth across all data. Conflict resolution is last-write-wins.
- **Trade-off**: Complexity of sync vs. responsiveness. Chose responsiveness.

### Future
Would reconsider if: building multi-device sync, adding collaborative features, or if localStorage quota becomes limiting (currently ~200-500KB, limit is 5-10MB).

---

## ADR-002: Zustand over Redux

**Status:** Active
**Date:** 2024-10

### Context
Needed a state management library for Next.js 15 with App Router. Requirements: TypeScript support, persist middleware, minimal boilerplate, SSR compatibility.

### Decision
Use Zustand with `devtools` + `persist` middleware. Single store (`useGameStore`) for core game state, separate store (`useStationStore`) for station visuals.

### Consequences
- **Positive**: Minimal boilerplate. Built-in persist middleware. Good TypeScript inference. No provider wrapper needed.
- **Negative**: No built-in action replay/time-travel (devtools partial). Less ecosystem tooling than Redux. Custom migration logic needed for persist versioning.
- **Trade-off**: Simplicity vs. ecosystem. Game state is relatively simple (no deeply nested normalized data), so Redux's strengths aren't needed.

### Future
Would reconsider if: state becomes deeply normalized, need action replay for debugging, or team grows and needs Redux's stricter patterns.

---

## ADR-003: No Immutability Enforcement

**Status:** Active, hardening in progress
**Date:** 2024-11

### Context
`GameStateUtils.applyStateChange()` returns a new object, but nothing prevents direct mutation of the state object. `Object.freeze` was considered but adds runtime cost. Immer was considered but adds bundle size.

### Decision
Enforce immutability by **convention and code review**, not by runtime enforcement. `applyStateChange` always returns a new object. Direct mutation is a code review violation.

### Consequences
- **Positive**: No runtime overhead. No additional dependencies. Simple mental model.
- **Negative**: Mutations can sneak in via careless code. No compile-time or runtime safety net. Bug surface for subtle state corruption.
- **Trade-off**: Performance and simplicity vs. safety. Acceptable for a small team with strong conventions.

### Supersedes
None.

### Future
Would add Immer or `Object.freeze` (dev-only) if: mutation bugs become frequent, team grows beyond 2-3 developers, or state complexity increases significantly.

---

## ADR-004: Offline-First Sync Queue

**Status:** Active
**Date:** 2024-12

### Context
Players may lose network mid-session. Game choices must persist locally and sync to Supabase when connectivity returns. Cannot block the game loop on network requests.

### Decision
Implement `SyncQueue` (`lib/sync-queue.ts`) that:
- Queues Supabase writes in memory
- Processes queue asynchronously after each choice
- Retries failed writes with 7-day TTL
- Drops items older than 7 days

### Consequences
- **Positive**: Game never blocks on network. Writes are durable locally even if server is down.
- **Negative**: 7-day window for data loss if device is wiped. No server-side conflict detection. Last-write-wins on concurrent sessions.
- **Trade-off**: Simplicity of queue vs. CRDT-based sync. Single-player game doesn't need CRDTs.

### Future
Would add CRDTs or server-side conflict resolution if: multi-device sync is required, or collaborative features are added.

---

## ADR-005: Orbs Inside GameState (TD-004)

**Status:** Resolved
**Date:** 2026-02

### Context
The orb economy (`useOrbs`) initially shipped as a standalone system with independent localStorage keys (`lux-orb-*`). This made it easy to iterate quickly, but it broke atomicity: save/load could restore game state without matching orb state.

### Decision
Move the orb economy into `coreGameState` (`coreGameState.orbs`) and persist it atomically alongside the rest of game state via the standard commit path. Provide a one-time migration that imports and then deletes legacy `lux-orb-*` keys (`lib/migrations/orb-migration.ts`).

### Consequences
- **Positive**: Orbs are now captured in atomic save/load and stay consistent across restores. Storage auditing is simpler.
- **Negative**: Orb state is coupled to GameState serialization format and slightly increases the size of the persisted core state.
- **Trade-off**: A small increase in coupling/size is worth consistency and operational simplicity.

### Supersedes
The previous decision to keep orbs separate (2025-01) is superseded by TD-004 completion.

---

## ADR-006: localStorage over IndexedDB

**Status:** Active
**Date:** 2024-10

### Context
Needed client-side persistence for game state. Options: localStorage, IndexedDB, OPFS.

### Decision
Use localStorage for all client-side persistence. Access via `SafeStorage` wrapper (`lib/persistence/storage-manager.ts`) for versioning and quota handling.

### Consequences
- **Positive**: Synchronous API (~1ms reads). Simple string key-value model. Universal browser support. No async complexity in state hydration.
- **Negative**: 5-10MB quota limit (browser-dependent). No structured queries. Blocks main thread on large writes (mitigated by small state size ~200-500KB). Corruption risk on quota exceeded.
- **Trade-off**: Simplicity and sync access vs. capacity and robustness. Game state is well within quota limits.

### Supersedes
None.

### Future
Would migrate to IndexedDB if: state exceeds 2MB, need binary blob storage (images/audio), or need structured queries for analytics. Would use `idb-keyval` wrapper to keep API simple.
