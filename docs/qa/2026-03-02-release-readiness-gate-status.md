# 2026-03-02 Release Readiness Gate Status

This is the latest operational snapshot for merge/release decisions.

## Gate Status (Observed)

| Gate | Status | Evidence | Action |
|---|---|---|---|
| CI checks green on release PR (#11) | ✅ Pass | `gh pr checks 11 -R AbdusM/lux-story` shows all checks passing (latest runs `22598111853` + `22598111843`) | None |
| Branch protection requires CI checks | ✅ Pass | `gh api repos/AbdusM/lux-story/branches/main/protection` shows required checks: `Test Suite / Run Tests`, `Test Suite / Build Project` | None |
| Release tag published | ✅ Pass | `gh release view v2.3.1 -R AbdusM/lux-story` reports `publishedAt=2026-03-02T22:22:06Z` and tag URL `https://github.com/AbdusM/lux-story/releases/tag/v2.3.1` | None |
| Production deploy alias updated | ✅ Pass | `npm run deploy:vercel -- --yes` created deployment `https://lux-story-38dns1ymb-link-dap.vercel.app` and aliased `https://lux-story.vercel.app` | None |
| Production health endpoints | ✅ Pass | `curl https://lux-story.vercel.app/api/health` and `curl https://lux-story.vercel.app/api/health/db` both report healthy checks | None |
| Production `user_id` UUID-only | ✅ Pass | `npm run verify:user-id-uuid-readiness` reports `player_profiles non_uuid_rows=0 (status=pass)` | None |
| Production secrets/env completeness | ✅ Pass | `vercel env run -e production` now reports non-zero lengths for required vars (`NEXT_PUBLIC_SUPABASE_ANON_KEY=208`, `SUPABASE_ANON_KEY=208`, `SUPABASE_SERVICE_ROLE_KEY=219`, `ADMIN_API_TOKEN=43`, `USER_API_SESSION_SECRET=64`) | None |
| Local contract + UX gates (2026-03-02) | ✅ Pass | `npm run release:security:minimum`, `npm run test:run -- tests/components/ui-layout-stability-contract.test.ts tests/components/stateful-menu-preservation-contract.test.ts tests/components/game-choices-sheet-mode.test.tsx`, `npm run type-check`, and `npx playwright test tests/e2e/mobile/choice-bottom-sheet.spec.ts --project=mobile-iphone-14` all pass | None |
| CI latency budget proxies | ✅ Pass | `npm run verify:choice-dispatch-latency` => `p95=252ms <= 260ms`; `npm run verify:choice-processing-latency` => `p95=338ms <= 400ms` | None |
| Production bottom-sheet UX smoke (live) | ✅ Pass | `SMOKE_BASE_URL=https://lux-story.vercel.app npx playwright test tests/e2e/mobile/choice-bottom-sheet.spec.ts --project=mobile-iphone-14 --config playwright.prod-smoke.config.ts` => `1 passed` | None |
| Broader production smoke suite (live) | ⚠️ Partial (expected) | `SMOKE_BASE_URL=https://lux-story.vercel.app npx playwright test --project=smoke --config playwright.prod-smoke.config.ts` => `4 passed, 1 failed`; failure is `tests/e2e/simulations/simulation-smoke.spec.ts` waiting for hidden God Mode tab | Keep this suite dev-only or split into production-safe smoke + dev-only God Mode smoke |
| Unauthenticated user APIs fail-closed (live) | ✅ Pass | `POST /api/user/profile` and `POST /api/user/interaction-events` with empty body both return `401 Unauthorized` | None |
| Production God Mode URL param inert (live) | ✅ Pass | Browser smoke against `/?godmode=true`: `window.godMode` absent and no visible God Mode tab | None |
| `/api/log-error` behavior (live) | ⚠️ Needs confirmation | `POST /api/log-error` currently returns `404` with `{\"success\":false}` | Confirm this endpoint is intentionally disabled in production and align docs/tests accordingly |

## Exact Next Steps (User)

1. Keep branch protection checks required on `main`:
   - `https://github.com/AbdusM/lux-story/settings/branches`
2. Store rotated production secrets in your password manager/team vault.
3. Split smoke suites: production-safe smoke should exclude dev-only God Mode simulation checks.
4. Confirm intended production behavior for `/api/log-error` and align test expectations/docs.
5. Optional recheck command:
   - `vercel --cwd /Users/abdusmuwwakkil/Development/30_lux-story env run -e production -- bash -lc 'echo NEXT_PUBLIC_SUPABASE_URL_len=${#NEXT_PUBLIC_SUPABASE_URL}; echo NEXT_PUBLIC_SUPABASE_ANON_KEY_len=${#NEXT_PUBLIC_SUPABASE_ANON_KEY}; echo SUPABASE_URL_len=${#SUPABASE_URL}; echo SUPABASE_ANON_KEY_len=${#SUPABASE_ANON_KEY}; echo SUPABASE_SERVICE_ROLE_KEY_len=${#SUPABASE_SERVICE_ROLE_KEY}; echo ADMIN_API_TOKEN_len=${#ADMIN_API_TOKEN}; echo USER_API_SESSION_SECRET_len=${#USER_API_SESSION_SECRET}'`
6. Optional redeploy URL from this run:
   - `https://lux-story.vercel.app`

## Release Decision

Current state is **production-ready on documented gates** (CI required checks, release tag, deploy health, UUID readiness, production env completeness, security minimum contracts, and live mobile bottom-sheet UX gate are green). One smoke test remains intentionally non-production-compatible until God Mode-dependent coverage is split.
