# Supabase Isolation Plan (Lux Story Priority)

Last updated: 2026-03-01

## Decision Summary

If the goal is to prioritize `lux-story` reliability with lowest migration risk, move `five-tiers-connect` off `actualizeme` first, then keep `lux-story` on `actualizeme` as the standalone tenant.

This is lower-risk than moving `lux-story` first because `lux-story` already has active gameplay/state tables and larger user-state volume.

## Current Observed State

- Supabase projects in org:
  - `mukunnuuulanqrbqqqgq` (`LinkDap`) - `ACTIVE_HEALTHY`
  - `tavalvqcebosfxamuvlx` (`actualizeme`) - `ACTIVE_HEALTHY`
- Production mappings:
  - `lux-story` -> `tavalvqcebosfxamuvlx`
  - `five-tiers-connect` -> `tavalvqcebosfxamuvlx`
  - `linkdap` -> `mukunnuuulanqrbqqqgq`
- `actualizeme` data snapshot (observed):
  - `player_profiles=1711`
  - `pattern_demonstrations=1635`
  - `skill_demonstrations=648`
  - `interaction_events=0`
  - `player_profiles.user_id` distribution: `uuid=1636`, `player_prefixed=67`, `other=8`

## Scope

- Isolate `lux-story` from `five-tiers-connect` at the Supabase project level.
- Preserve `lux-story` continuity and avoid high-risk gameplay data migration in this step.
- Define explicit verification gates and rollback path.

## Out of Scope

- `recipe-app` / `linkdap` remediation (handled separately).
- Full re-architecture of analytics/event model.
- Immediate migration of `lux-story` to a brand new Supabase project.

## Option Analysis

### Option A: Move `lux-story` to new project now

- Pros:
  - Maximum long-term isolation for core app.
- Cons:
  - Highest migration risk (stateful gameplay tables, user IDs, trust/progression continuity).
  - Requires stronger cutover orchestration and larger rollback surface.
- Risk: High

### Option B: Move `five-tiers-connect` to new project now (recommended)

- Pros:
  - Fastest path to make `lux-story` standalone on `actualizeme`.
  - Lower-risk migration target (smaller app surface, fewer required secrets currently).
  - No immediate `lux-story` data migration required.
- Cons:
  - Still leaves future decision open on whether `lux-story` should later move again.
- Risk: Low-to-medium

## Recommended Workflow

### Phase 0: Stabilize Lux Story Gates (same day)

1. Confirm `lux-story` production env variables are correctly set and non-empty in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `USER_API_SESSION_SECRET`
2. Run `lux-story` release verification gates:
   - `npm run release:security:minimum`
3. Record baseline checks:
   - UUID distribution (`player_profiles.user_id`)
   - key table counts (`player_profiles`, `interaction_events`, `pattern_demonstrations`)

### Phase 1: Carve Out Five Tiers (small migration)

1. Create dedicated Supabase project for `five-tiers-connect`.
2. Apply only `five-tiers-connect` schema/migrations needed for runtime.
3. Update only `five-tiers-connect` Vercel production env vars to the new ref/keys.
4. Deploy and smoke test `five-tiers-connect`.

### Phase 2: Verify Lux Story Isolation

1. Confirm `lux-story` still points to `actualizeme` and functions.
2. Confirm `five-tiers-connect` no longer references `actualizeme`.
3. Re-run `actualizeme` table and user-id audit to ensure expected post-split baseline.

## Commit/Change Sequence

### In `30_lux-story` repo

1. `docs`: add this isolation plan and release gates.
2. `ops`: (if needed) add deterministic audit script for:
   - Supabase ref check
   - UUID distribution
   - key table counts

### In `five-tiers-connect` repo

1. `infra`: add new Supabase project ref and keys to production env.
2. `db`: apply target schema/migrations for the new project.
3. `ops`: add one env/ref verification command in CI or release checklist.

## Acceptance Criteria

- `lux-story` production Supabase ref remains `tavalvqcebosfxamuvlx` and app is healthy.
- `five-tiers-connect` production Supabase ref is no longer `tavalvqcebosfxamuvlx`.
- `lux-story` release security gate passes.
- `actualizeme` UUID audit is measurable and tracked; legacy IDs are scheduled for migration.

## Rollout / Backout

### Rollout

1. Phase 0 (stabilize `lux-story`)
2. Phase 1 (`five-tiers-connect` cutover)
3. Phase 2 (post-cutover audits)

### Backout

- If `five-tiers-connect` cutover fails:
  - Revert `five-tiers-connect` env vars to prior Supabase ref.
  - Redeploy last known good build.
- No rollback required for `lux-story` data since this plan avoids moving `lux-story` DB in this iteration.

## Assumptions / Needs Verification

- `five-tiers-connect` schema/data migration size is small enough for same-day cutover (`needs verification`).
- `interaction_events=0` may indicate pipeline inactivity or different sink; validate expected telemetry path before using as SLO truth (`needs verification`).
- Production env value presence was confirmed at key-name level; secret value non-emptiness should be validated in hosting dashboard at time of release (`needs manual verification`).
