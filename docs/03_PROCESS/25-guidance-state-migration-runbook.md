# Guidance State Migration Runbook

Last updated: 2026-03-07

## Purpose

This runbook covers the adaptive-guidance storage migration from legacy action-plan JSON into the dedicated Supabase tables created by [023_guidance_state_tables.sql](../../supabase/migrations/023_guidance_state_tables.sql).

Use it for:

- checking whether the guidance tables are present in the linked Supabase project
- auditing whether legacy `adaptiveGuidance` envelopes still need backfill
- running the no-op-safe backfill command when valid legacy records exist

## Canonical Commands

```bash
npm run guidance:audit
npm run guidance:backfill
npm run guidance:validate:live
npm run guidance:report:live
npm run guidance:report:live:markdown
```

Operational Supabase checks:

```bash
supabase migration list
supabase db push --dry-run
supabase db push --yes
```

`supabase db push --yes` is the preferred non-interactive form for agent runs. Plain `supabase db push` can leave a waiting prompt behind in headless sessions.

## March 7, 2026 Live Status

Environment validated:

- linked project ref: `tavalvqcebosfxamuvlx`
- migration state before apply: `001` through `022` matched locally/remotely, `023` pending
- migration state after apply: `023_guidance_state_tables.sql` present in remote history

Validation outcome:

- `guidance_task_progress` exists and is readable
- `guidance_trajectory_snapshots` exists and is readable
- live REST probes against both tables returned `HTTP 200`

Backfill audit outcome on March 7, 2026:

- `user_action_plans` rows scanned: `0`
- valid `adaptiveGuidance` candidates found in `user_action_plans`: `0`
- `player_profiles.last_action_plan` is not present in the live schema and returns Postgres code `42703`
- `npm run guidance:backfill` completed as a no-op with `migratedCandidates = 0`

Interpretation:

- the dedicated guidance substrate is live
- there was no legacy guidance state to migrate in this environment at the time of the audit
- future backfill runs are still safe because the script skips the missing `player_profiles.last_action_plan` column and only persists candidates that contain both a valid `record` and `snapshot`

## Normal Procedure

1. Confirm the linked project is correct with `supabase migration list`.
2. Run `npm run guidance:audit`.
3. If the audit reports `candidates.valid > 0`, run `npm run guidance:backfill`.
4. Re-run `npm run guidance:audit` and confirm the target-table counts increased as expected.
5. Spot-check one migrated user through the admin guidance endpoints.

## Internal Live Validation User

Reusable validation user:

- user id: `guidance_validation_internal`
- session id: `guidance-validation-session-v1`

`npm run guidance:validate:live` does all of the following with service-role access:

- upserts the internal validation profile
- clears only that user’s old guidance + interaction-event rows
- writes a fresh adaptive guidance record and snapshot into the dedicated tables
- inserts guidance telemetry rows into `interaction_events`
- validates the same diagnostics and cohort-summary builders used by the admin routes

This is the preferred live-proof path when a real production admin session is unavailable.

Important:

- internal validation users are excluded from admin cohort summary by default
- `npm run guidance:validate:live` opts back in explicitly so the script can still verify cohort aggregation end to end

## 10% Rollout Prep

Recommended env values for the first real experiment slice:

```bash
NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE=experiment
NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_ROLLOUT=10
```

Emergency backout:

```bash
NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE=off
```

Do not widen beyond `10` until:

- the internal validation user remains readable through guidance diagnostics after deploy
- adaptive cohort counts appear in the admin summary
- dismiss rate and completion rate are stable enough to justify expansion

## Expected No-Op Cases

No backfill is required if either of these is true:

- `user_action_plans` has no rows with `adaptiveGuidance`
- the environment never carried the legacy `player_profiles.last_action_plan` column

That is the exact state observed on March 7, 2026.

## Backout / Safety Notes

- The application already falls back gracefully when dedicated tables are missing, but that condition should not exist after `023` is applied.
- Reverting the schema would require a new compensating migration; do not drop the guidance tables manually.
- The backfill script is append-safe for valid legacy envelopes because it reconstructs state and writes through the same `persistGuidanceStateForUser` path used by the product routes.

## Operator Reporting

Use the live report scripts when you want a point-in-time readout from the linked Supabase environment:

```bash
npm run guidance:report:live
npm run guidance:report:live:markdown
```

The JSON form is better for machine inspection. The markdown form is optimized for human review and GitHub job summaries.

Automated cadence is handled by [guidance-report.yml](../../.github/workflows/guidance-report.yml):

- daily run at `14:00 UTC`
- weekly run at `15:00 UTC` on Mondays
- manual `workflow_dispatch` support

Each workflow run writes:

- a markdown operator summary to the GitHub Actions job summary
- JSON and markdown artifacts retained for `30` days

Required repository secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
