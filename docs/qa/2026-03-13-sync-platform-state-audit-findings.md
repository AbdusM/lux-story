# 2026-03-13 Sync + Platform State Audit

Scope:
- In scope: `app/api/user/platform-state/route.ts`, `lib/sync-queue.ts`, `lib/api/user-session.ts`, `lib/admin-supabase-client.ts`, `tests/api/user-endpoints.test.ts`, `tests/sync-queue.test.ts`, `scripts/ci/release-smoke.mjs`, `package.json`, `supabase/migrations/001_initial_schema.sql`, `supabase/migrations/019_align_gameplay_contracts.sql`
- Out of scope: other `/api/user/*` sync routes, student/admin UI flows, non-sync Supabase access patterns, content audits
- Modes: `security + reliability + integrity + maintainability`
- Depth: `standard`
- Risk tolerance: `production`
- Changed since: `4a20bf3e6b6e613ef93f596bf020a55c7e4d7147~2`

## Baseline Snapshot

- Current hotfix head under review: `4a20bf3` (`Fix global platform state upsert`) following `b0645eb` (`Fix user sync profile bootstrap`).
- `platform_states` still uses a canonical `(user_id, platform_id)` uniqueness contract from `supabase/migrations/001_initial_schema.sql:104-121`.
- `supabase/migrations/019_align_gameplay_contracts.sql:10-16` extends `platform_states` with gameplay sync fields (`current_scene`, `global_flags`, `patterns`) but does not change the uniqueness contract.
- Focused tests passed: `npx vitest run tests/api/user-endpoints.test.ts tests/sync-queue.test.ts` -> `2` files, `63` tests passed.
- Production health is currently green:
  - `curl https://lux-story.vercel.app/api/health` -> `{"status":"healthy",...}`
  - `curl https://lux-story.vercel.app/api/health/db` -> `{"status":"healthy",...}`
- Release smoke script only checks `/`, health endpoints, unauthenticated `/api/user/session`, unauthenticated `/api/advisor-briefing`, and CSP.
- User-provided production console logs from `2026-03-13` showed repeated `POST /api/user/platform-state 500` responses and repeated sync retries.

## Findings

### Critical

- None in this pass.

### High

#### F-001 - `SyncQueue` does not persist incremented retry counts for transient failures
- Severity: `P1`
- Category: `reliability`
- Issue type: `code_defect`
- Certainty: `Observed`
- Evidence grade: `E0`
- Impact: transient `5xx` or `503` sync failures can stay effectively immortal in the queue, causing repeated network churn, repeated warning logs, and delayed recovery for users on degraded connections.
- Evidence:
  - `lib/sync-queue.ts:743-787` increments retries into `failedActions`, then persists `remainingQueue` instead of the incremented copies:
    - `failedActions.push({ ...action, retries: action.retries + 1 })`
    - `const remainingQueue = this.getQueue()`
    - `this.persistQueue(remainingQueue)`
  - `tests/sync-queue.test.ts:383-441` explicitly tolerates `retries >= 0` instead of asserting retry increments after failure.
  - Focused tests passed with this gap still present: `npx vitest run tests/api/user-endpoints.test.ts tests/sync-queue.test.ts` -> `63` tests passed.
- Root cause: retry semantics are split between in-memory bookkeeping and persisted queue state, but only the pre-existing queue snapshot is saved.
- Smallest safe fix: replace failed actions in persisted queue with incremented copies and add deterministic tests for `retry=1`, `retry=2`, and eviction at max retries.
- Verification:
  - Add unit test that a `500` response increments `retries` from `0` to `1` in stored queue state.
  - Add unit test that a transient failure is removed after the configured max retries.
  - Browser smoke with mocked transient failures should stop retrying after max retries.
- Prod verification:
  - Historical user console logs on `2026-03-13` showed repeated retry warnings for the same sync surface.
  - Current audit did not instrument retry counters in production storage directly.

### Medium

#### F-002 - `/api/user/platform-state` accepts raw unknown fields and turns malformed payloads into server errors
- Severity: `P2`
- Category: `reliability`
- Issue type: `code_defect`
- Certainty: `Observed`
- Evidence grade: `E1`
- Impact: malformed or off-version client payloads are treated as backend failures, which produces `500`s, triggers retry behavior, and obscures whether the bug is client-side or server-side.
- Evidence:
  - `app/api/user/platform-state/route.ts:40-69` casts the JSON body to `Record<string, unknown>` and forwards `current_scene`, `global_flags`, and `patterns` directly to Supabase with no boundary schema validation.
  - User-provided production logs from `2026-03-13` showed repeated `POST https://lux-story.vercel.app/api/user/platform-state 500 (Internal Server Error)` and `Sync action failed (will retry)` entries.
  - `tests/api/user-endpoints.test.ts:97-184` has no invalid-payload coverage for `global_flags`, `patterns`, or `current_scene`.
- Root cause: route contract enforcement is delegated to the database layer instead of being validated at the API boundary.
- Smallest safe fix: add a strict Zod schema for the request body and return `400` for invalid payloads before any profile ensure or database call.
- Verification:
  - Add route tests for invalid `global_flags`, invalid `patterns`, and overlong payloads returning `400`.
  - Manual smoke: invalid `platform-state` POST returns `400` with a clear validation error and does not enter retry flow.
- Prod verification:
  - Historical production console logs showed this route returning `500` before the hotfix.
  - Current audit only rechecked `/api/health` and `/api/health/db`, not the invalid-payload path on prod.

#### F-003 - Release verification omits the authenticated `platform-state` write path
- Severity: `P2`
- Category: `reliability`
- Issue type: `process_gap`
- Certainty: `Observed`
- Evidence grade: `E0`
- Impact: schema or route drift on authenticated user writes can pass `release:gate` and only fail after deployment in real user sessions.
- Evidence:
  - `package.json:48-52` wires deploy through `release:gate` only.
  - `package.json:105` defines `verify:release-smoke`, but it is not part of `release:gate` or `deploy`.
  - `scripts/ci/release-smoke.mjs:69-107` checks `/`, health endpoints, unauthenticated `/api/user/session`, and unauthenticated `/api/advisor-briefing`, but never exercises `/api/user/profile` or `/api/user/platform-state`.
- Root cause: deployment verification is health-oriented and unauthenticated, while the broken path was authenticated and stateful.
- Smallest safe fix: extend release smoke to run an authenticated `POST /api/user/profile` + `POST/GET /api/user/platform-state` sequence against a disposable test user.
- Verification:
  - Break the `platform-state` conflict target in a local branch and confirm release smoke fails.
  - CI/deploy logs should show authenticated write smoke as part of release verification.
- Prod verification:
  - Current production health checks pass, but they do not cover authenticated write paths.

#### F-004 - `platform-state` tests do not assert the live table contract or invalid-body behavior
- Severity: `P2`
- Category: `reliability`
- Issue type: `test_gap`
- Certainty: `Observed`
- Evidence grade: `E2`
- Impact: local tests can stay green while the route drifts away from the actual Supabase contract or returns the wrong class of error for malformed input.
- Evidence:
  - `tests/api/user-endpoints.test.ts:20-45` uses a generic mocked Supabase chain that does not inspect `upsert` payload shape or `onConflict` options.
  - `tests/api/user-endpoints.test.ts:110-137` only asserts `200` success and `ensurePlayerProfile` call, not `platform_id = 'global'` or `onConflict = 'user_id,platform_id'`.
  - `tests/api/user-endpoints.test.ts:152-166` treats `{}` as a valid minimal payload but there is no test for malformed gameplay fields returning `400`.
  - `npx vitest run tests/api/user-endpoints.test.ts tests/sync-queue.test.ts` passed `63/63`, confirming current coverage does not fail on these omissions.
- Root cause: route tests are focused on response status and auth gates, not the database contract and boundary behavior that actually failed in production.
- Smallest safe fix: capture `upsert` arguments in the mock and assert canonical `platform_id`, conflict target, and `400` behavior for malformed payloads.
- Verification:
  - New route tests fail against the pre-hotfix implementation and pass against the corrected route.
  - Contract tests assert `platform_id = 'global'`, `onConflict = 'user_id,platform_id'`, and invalid bodies return `400`.
- Prod verification:
  - Historical production incident escaped the current test suite before hotfix.

#### F-005 - Admin service-role helper is still not guarded as server-only
- Severity: `P2`
- Category: `maintainability`
- Issue type: `code_defect`
- Certainty: `Observed`
- Evidence grade: `E1`
- Impact: a future accidental client import can reintroduce browser warnings, dead code paths, or server-only assumptions into client bundles.
- Evidence:
  - `lib/admin-supabase-client.ts:1-23` has no `import 'server-only'` guard even though the file exposes service-role client creation.
  - `lib/admin-supabase-client.ts:207-219` logs missing `SUPABASE_SERVICE_ROLE_KEY` warnings when the helper is imported without server envs.
  - User-provided browser logs from `2026-03-13` showed `[AdminSupabase] Missing env vars: SUPABASE_SERVICE_ROLE_KEY. Database operations will be skipped.`
- Root cause: server-only capability is enforced by call discipline instead of module-level import boundaries.
- Smallest safe fix: add `import 'server-only'` and split any browser-safe utilities into a separate file.
- Verification:
  - Build or unit test should fail if a client-side module attempts to import `admin-supabase-client`.
  - Fresh browser session should no longer emit the admin env warning.
- Prod verification:
  - Historical browser warning was observed before the hotfix path correction.
  - Current audit did not reproduce the warning on the latest bundle.

### Low

- None in this pass.

## Root Cause Clusters

- `RC-001 - Boundary contract hardening gap`
  - Findings: `F-002`, `F-004`
  - Summary: `platform-state` is only loosely validated at the API boundary and only loosely asserted in tests, so malformed client payloads and schema drift surface as runtime incidents instead of deterministic failures.
  - Primary fix: add strict request validation plus contract-aware route tests.

- `RC-002 - Retry semantics gap`
  - Findings: `F-001`
  - Summary: transient-failure bookkeeping is not persisted back into queue state, so retry ceilings are not reliably enforced.
  - Primary fix: persist incremented failed actions and test retry exhaustion explicitly.

- `RC-003 - Release verification gap`
  - Findings: `F-003`
  - Summary: deploy verification checks liveness and unauthenticated paths, but not authenticated stateful writes.
  - Primary fix: add authenticated `platform-state` smoke coverage to release verification.

- `RC-004 - Server/client boundary discipline gap`
  - Findings: `F-005`
  - Summary: server-only capabilities are still partially protected by convention instead of import-level guards.
  - Primary fix: mark service-role helpers as server-only and keep browser-safe helpers separate.

## Fix Queue

### AQ-001
- Priority: `P1`
- Title: Fix persisted retry accounting in `SyncQueue`
- Category: `reliability`
- Issue type: `code_defect`
- Certainty: `Observed`
- Root cause: `RC-002`
- Proposed fix:
  1. Replace queued failed actions with incremented copies before persistence.
  2. Add tests for `retry=1` persistence and max-retry eviction.
  3. Verify browser retry churn stops after max retries for transient failures.
- Acceptance criteria:
  - A transient `500` increments stored retry count after the first failure.
  - A queued action is removed once max retries are reached.
  - Queue stats reflect real retry counts.
- Verification:
  - `npx vitest run tests/sync-queue.test.ts`
  - Manual browser smoke with forced transient failure
- Risk: `medium`
- Effort: `S`
- Owner: `eng`

### AQ-002
- Priority: `P1`
- Title: Add strict request validation to `/api/user/platform-state`
- Category: `reliability`
- Issue type: `code_defect`
- Certainty: `Observed`
- Root cause: `RC-001`
- Proposed fix:
  1. Add Zod validation for `user_id`, `current_scene`, `global_flags`, `patterns`, and payload size limits.
  2. Return `400` for invalid payloads before profile ensure or database writes.
  3. Ensure sync queue treats validation failures as permanent and drops them.
- Acceptance criteria:
  - Invalid payloads return `400` with a stable error shape.
  - Valid payloads still write canonical `platform_id = 'global'` rows.
  - Malformed actions are not endlessly retried.
- Verification:
  - `npx vitest run tests/api/user-endpoints.test.ts tests/sync-queue.test.ts`
  - Manual smoke for valid and invalid `platform-state` POST requests
- Risk: `medium`
- Effort: `M`
- Owner: `eng`

### AQ-003
- Priority: `P2`
- Title: Add contract-aware tests and authenticated release smoke for `platform-state`
- Category: `reliability`
- Issue type: `process_gap`
- Certainty: `Observed`
- Root cause: `RC-001`, `RC-003`
- Proposed fix:
  1. Capture `upsert` payload and `onConflict` arguments in route tests.
  2. Add assertions for `platform_id = 'global'`, `onConflict = 'user_id,platform_id'`, and invalid-body `400`s.
  3. Add authenticated release smoke for `POST /api/user/profile` and `POST/GET /api/user/platform-state`.
- Acceptance criteria:
  - Route tests fail if the canonical conflict target or platform ID changes unintentionally.
  - Release verification fails on authenticated route/schema drift.
  - Deploy logs show authenticated smoke coverage ran.
- Verification:
  - `npx vitest run tests/api/user-endpoints.test.ts`
  - `BASE_URL=<deploy-url> node scripts/ci/release-smoke.mjs` with authenticated smoke enabled
- Risk: `low`
- Effort: `M`
- Owner: `eng`

### AQ-004
- Priority: `P2`
- Title: Enforce server-only import boundaries for admin service-role helpers
- Category: `maintainability`
- Issue type: `code_defect`
- Certainty: `Observed`
- Root cause: `RC-004`
- Proposed fix:
  1. Add `import 'server-only'` to `lib/admin-supabase-client.ts`.
  2. Split any browser-safe logic into a separate module if needed.
  3. Add a build or unit check that client code cannot import the service-role helper.
- Acceptance criteria:
  - Client imports of `admin-supabase-client` fail deterministically.
  - Browser bundle no longer emits missing service-role env warnings.
- Verification:
  - `npm run build`
  - Fresh browser smoke on affected flows
- Risk: `low`
- Effort: `S`
- Owner: `eng`

## Blindspots And Optimization Opportunities

- Other `/api/user/*` sync routes were not audited here. Several appear to follow the same "raw body to Supabase" pattern and should be checked in the next monthly run.
- Release smoke remains health-oriented overall. The platform-state gap is the highest-priority addition, but the same issue may exist for other authenticated write paths.
- `scripts/validate_findings_evidence.mjs` is referenced by the audit skill but is not present in this repo, so evidence-format validation is currently manual.

## Plan Fidelity And Dropped Scope Checks

- The audit stayed diff-first and did not expand into a full repo sweep.
- The review remained within the incident surface that actually regressed: profile bootstrap, platform-state persistence, retry behavior, and release verification.
- No speculative product or UX findings were added because this run was explicitly `security + reliability + integrity + maintainability`.
- Full frontend/browser regression coverage was not performed; only focused tests and production health checks were re-run.

## Top 3 Impact Fixes

1. Fix persisted retry accounting in `SyncQueue`.
2. Add strict request validation to `/api/user/platform-state`.
3. Add authenticated release smoke and contract-aware tests for the `platform-state` write path.

## Summary

- Top 3 risks:
  - Retry ceilings are not reliably enforced for transient sync failures.
  - Malformed `platform-state` payloads still degrade into server errors instead of client errors.
  - Deploy verification can miss authenticated write-path regressions.
- Top 3 quick wins:
  - Persist incremented retry counts.
  - Add Zod validation to `platform-state`.
  - Add one authenticated release smoke sequence for profile bootstrap plus platform-state write/read.
- Human verification still needed:
  - Confirm malformed `platform-state` requests return `400` in deployed runtime after validation is added.
  - Confirm the browser no longer logs admin env warnings on fresh bundles after adding `server-only`.
  - Confirm real browser retries stop after the configured max retry count.
