# Launch Readiness Plan — Core Gameplay + Entry Flow

**Date:** 2026-02-01

## Goal
Players can begin playing immediately (guest or sign‑in), complete the core loop, and export their journey without admin dependencies or fragile setup.

**Success criteria**
- A new player can enter the game in under 60 seconds (guest or sign‑in).
- The core loop works end‑to‑end: record → extract → review → export.
- No admin surface is required for player gameplay.

## Current State (from repo)
- Main game loads at `/` via `StatefulGameInterface`. (`app/page.tsx`)
- Welcome/entry page exists at `/welcome` with Guest + Sign‑In CTAs. (`app/welcome/page.tsx`)
- Guest mode sets `lux_guest_mode` and routes to `/`. (`app/welcome/page.tsx`)
- Sign‑in CTA routes to `/admin/login`. (`app/welcome/page.tsx`)
- Export flow lives in `StrategyReport` and `EndingPanel`. (`components/career/StrategyReport.tsx`, `components/game/EndingPanel.tsx`)

---

## Phase A — Entry & First Play (must‑ship)

**Decision required**
- Choose the default entry path for new users:
  - **Option A (fastest):** Keep `/` as the default start (game loads immediately). Add a soft link to `/welcome` if you still want the cinematic entry.
  - **Option B (guided):** Make `/welcome` the default for first‑time users and route to `/` after “Begin Exploring.”

**Tasks**
1) Confirm entry path and update routing accordingly.
2) Make guest entry unmistakable (primary CTA = “Begin Exploring”).
3) Ensure sign‑in copy is “Save Progress” and does not block play.
4) Verify `lux_guest_mode` does not break gameplay if user never signs in.

**Acceptance checks**
- New visitor can start playing without creating an account.
- Returning authenticated user bypasses `/welcome` and lands in the game.

---

## Phase B — Core Gameplay Loop Stability (must‑ship)

**Loop definition**
Record → Extract → Review → Export

**Tasks**
1) Record: confirm choices update `GameState` and persist to localStorage. (`lib/game-state-manager.ts`, `lib/game-store.ts`, `hooks/game/useChoiceHandler.ts`)
2) Extract: confirm pattern/skill/relationship sync queues fire without throwing when Supabase is configured. (`lib/sync-queue.ts`, `hooks/game/useChoiceHandler.ts`)
3) Review: confirm Journal + Constellation + Journey Summary panels render with current state. (`components/StatefulGameInterface.tsx`, `components/Journal.tsx`)
4) Export: confirm StrategyReport renders and Export PDF works. (`components/career/StrategyReport.tsx`)

**Acceptance checks (manual)**
- Make 3–5 choices → Journal updates → Journey Summary appears at end → Export PDF triggers.

---

## Phase C — Data Sync & Persistence (must‑ship)

**Tasks**
1) Confirm Supabase schema is aligned with runtime sync payloads (already migrated).
2) Verify `platform_states` sync uses `platform_id = core` for aggregate state (no conflicts).
3) Verify `user_action_plans` upsert succeeds (no fallback).

**Acceptance checks**
- `/api/user/profile` creates player profile when needed.
- `/api/user/platform-state` writes without 409 conflicts (uses `platform_id = core`).
- `/api/user/action-plan` writes to `user_action_plans`.

---

## Phase D — Content Readiness (should‑ship)

**Tasks**
1) Ensure the dialogue graph and content routes load without runtime errors.
2) Confirm at least one full arc reaches an ending and export action.

**Acceptance checks**
- A full playthrough can reach the ending panel without broken nodes.

---

## Phase E — Minimal Ops & Monitoring (should‑ship)

**Tasks**
1) Confirm Supabase keys are present in the deployment env.
2) Confirm basic health endpoints respond. (`app/api/health/route.ts`, `app/api/health/db/route.ts`)
3) Ensure error boundary displays gracefully if the game crashes. (`components/GameErrorBoundary.tsx`)

---

## Suggested Order of Execution
1) Phase A (entry flow decision) — 1 day
2) Phase B (core loop) — 1–2 days
3) Phase C (sync) — 1 day
4) Phase D (content readiness) — 1 day
5) Phase E (ops) — 0.5 day

---

## Open Decisions
- **Default entry route**: `/` (instant play) vs `/welcome` (guided intro).
- **Sign‑in path**: keep `/admin/login` or introduce a player‑only login page.

---

## Done Criteria (Launch‑Ready)
- New user can begin playing without signing in.
- Signed‑in user can save progress and return.
- Core loop completes with Journal + Export.
- No admin pages required for gameplay.
