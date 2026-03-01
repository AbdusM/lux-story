# Lux Story Development Checkpoint (Resume Snapshot)

Last updated: 2026-03-01
Scope: `lux-story` / `actualizeme` lane only

## Verdict / Status

- Status: `partially complete, blocked on operational config + data hygiene`.
- Core guardrail code and documentation pass are in place, but production-readiness is not complete until env/runtime and UUID cleanup gates pass.

## Decisions Made

- Keep `recipe-app` / `linkdap` out of this lane (handled separately).
- Keep focus on `lux-story` + `actualizeme` only.
- Adopt isolation strategy planning:
  - recommended path: move `five-tiers-connect` off `actualizeme` first, then keep `lux-story` as standalone on `actualizeme`.
  - plan doc: `docs/03_PROCESS/plans/2026-03-01-supabase-isolation-plan.md`.

## Perf Budget

- CI fixture ratchets for choice latency are wired:
  - dispatch: `npm run verify:choice-dispatch-latency`
  - processing: `npm run verify:choice-processing-latency`
- Interpretation lock:
  - these are regression proxies, not production telemetry distribution truth.

## Determinism Check

- Deterministic gates in workflow include:
  - release security minimum
  - analytics dictionary verification
  - emitter parity + narrative/content ratchets
- Branch protection on `main` was configured to require:
  - `Test Suite / Run Tests`
  - `Test Suite / Build Project`

## Risks (Top 3)

1. `actualizeme` shared tenancy risk:
   - both `lux-story` and `five-tiers-connect` point to `tavalvqcebosfxamuvlx`.
2. Production env runtime drift risk:
   - `vercel env run -e production` for `lux-story` currently shows zero-length secrets for some critical vars (`needs manual verification` in dashboard and redeploy path).
3. UUID integrity risk:
   - `player_profiles.user_id` in `actualizeme` includes non-UUID entries.

## Next 3 Commits

1. `fix(ops): normalize lux-story production env runtime values`
   - ensure non-empty Supabase keys + `USER_API_SESSION_SECRET`.
2. `fix(data): migrate non-uuid user ids and enforce uuid-only gate`
   - remediate `player_prefixed` + `other` IDs in `player_profiles`.
3. `chore(isolation): cut five-tiers-connect to dedicated supabase ref`
   - remove shared-tenant coupling with `actualizeme`.

## Acceptance Criteria

- `actualizeme` is `ACTIVE_HEALTHY`.
- `lux-story` production runtime resolves Supabase URL and has non-empty required secrets.
- UUID distribution gate passes (`player_prefixed=0`, `other=0`).
- Security gate passes (`npm run release:security:minimum`).
- Telemetry sink is writing expected rows for active gameplay sessions (`interaction_events` non-zero once enabled path is verified).

## Gate

- Hard gate set for release claim:
  - branch protection required checks enabled
  - security minimum test pass
  - UUID-only policy pass
  - env secret completeness verified in production

## Rollout / Backout

- Rollout order:
  1. env/runtime fix
  2. UUID migration + enforcement
  3. tenant split (`five-tiers-connect`)
- Backout:
  - env changes: revert Vercel vars to prior snapshot values.
  - UUID migration: use mapping table backup and reversible update script.
  - tenant split: revert `five-tiers-connect` env ref and redeploy previous build.

## Blocked / Flagged

- `lux-story` production env runtime values require explicit verification after env edits and deploy (`needs manual verification`).
- `interaction_events=0` in observed table snapshot; may indicate inactive emitter path, alternate sink, or workload gap (`needs verification`).
- UUID audit currently observed:
  - `total=1711`
  - `uuid=1636`
  - `player_prefixed=67`
  - `other=8`

## Resume Commands

- Supabase health:
  - `supabase projects list --output json`
- Lux-story production runtime env lengths:
  - `vercel --cwd /Users/abdusmuwwakkil/Development/30_lux-story env run -e production -- bash -lc 'echo NEXT_PUBLIC_SUPABASE_URL_len=${#NEXT_PUBLIC_SUPABASE_URL}; echo NEXT_PUBLIC_SUPABASE_ANON_KEY_len=${#NEXT_PUBLIC_SUPABASE_ANON_KEY}; echo SUPABASE_SERVICE_ROLE_KEY_len=${#SUPABASE_SERVICE_ROLE_KEY}; echo SUPABASE_URL_len=${#SUPABASE_URL}; echo USER_API_SESSION_SECRET_len=${#USER_API_SESSION_SECRET}'`
- Security gate:
  - `npm run release:security:minimum`
