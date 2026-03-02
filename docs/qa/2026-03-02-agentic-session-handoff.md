# 2026-03-02 Agentic Session Handoff (Lux Story)

Purpose: prevent context drift in future agent sessions and keep release/readiness claims reproducible.

## Scope Guardrail (Read First)

- **In scope for this repo/session:** Lux Story (`30_lux-story`) and Supabase project `actualizeme` (`tavalvqcebosfxamuvlx`).
- **Out of scope for this repo/session:** RecipeApp/LinkDap/Five-Tiers migration work. Handle those in their own repos/chats.
- If a task mentions another product, stop and confirm before changing Lux Story docs/code.

## Current Verified State

- Feature PR: `https://github.com/AbdusM/lux-story/pull/7`
- Latest merged docs PR: `https://github.com/AbdusM/lux-story/pull/9`
- Latest merged test-fix PR: `https://github.com/AbdusM/lux-story/pull/10`
- Latest merged release PR: `https://github.com/AbdusM/lux-story/pull/11`
- Branch: `main` (post-merge)
- Latest required checks green:
  - Test Suite run: `22598111853`
  - E2E matrix run: `22598111843`
- Latest release tag: `v2.3.1` (`https://github.com/AbdusM/lux-story/releases/tag/v2.3.1`)
- Production deploy live: `https://lux-story.vercel.app`
- Latest production deployment URL: `https://lux-story-38dns1ymb-link-dap.vercel.app`

## Release Gate Truth (as of 2026-03-02)

- CI required checks on `main`: **pass**
- UUID readiness (`player_profiles.user_id`): **pass**
- Production env completeness (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_API_TOKEN`, `USER_API_SESSION_SECRET`): **pass**
- Production health endpoints (`/api/health`, `/api/health/db`): **pass**
- Production bottom-sheet smoke (`mobile-iphone-14`): **pass**
- Broader smoke suite against production URL: **partial by design** (`simulation-smoke` expects God Mode UI, which is hidden in production)

Canonical status file:
- `docs/qa/2026-03-02-release-readiness-gate-status.md`

## Standard Re-Validation Commands (Agent Quickstart)

UI/design system reference:
- `docs/03_PROCESS/onboarding/03-design-systems-engineer-prompt.md`

1. CI status
   - `gh pr checks 11 -R AbdusM/lux-story`
2. Branch protection
   - `gh api repos/AbdusM/lux-story/branches/main/protection --jq '{required_status_checks: .required_status_checks.contexts}'`
3. Release metadata
   - `gh release view v2.3.1 -R AbdusM/lux-story --json tagName,publishedAt,url,targetCommitish`
4. Health endpoints (live)
   - `curl -fsS https://lux-story.vercel.app/api/health`
   - `curl -fsS https://lux-story.vercel.app/api/health/db`
5. UUID readiness
   - `npm run verify:user-id-uuid-readiness`
6. Latency budget proxy checks
   - `npm run verify:choice-dispatch-latency`
   - `npm run verify:choice-processing-latency`
7. Security minimum + UI contracts
   - `npm run release:security:minimum`
   - `npm run test:run -- tests/components/ui-layout-stability-contract.test.ts tests/components/stateful-menu-preservation-contract.test.ts tests/components/game-choices-sheet-mode.test.tsx`
   - `npm run type-check`
8. Production env lengths (safe: lengths only)
   - `vercel --cwd /Users/abdusmuwwakkil/Development/30_lux-story env run -e production -- bash -lc 'echo NEXT_PUBLIC_SUPABASE_URL_len=${#NEXT_PUBLIC_SUPABASE_URL}; echo NEXT_PUBLIC_SUPABASE_ANON_KEY_len=${#NEXT_PUBLIC_SUPABASE_ANON_KEY}; echo SUPABASE_URL_len=${#SUPABASE_URL}; echo SUPABASE_ANON_KEY_len=${#SUPABASE_ANON_KEY}; echo SUPABASE_SERVICE_ROLE_KEY_len=${#SUPABASE_SERVICE_ROLE_KEY}; echo ADMIN_API_TOKEN_len=${#ADMIN_API_TOKEN}; echo USER_API_SESSION_SECRET_len=${#USER_API_SESSION_SECRET}'`
9. Production UX smoke (live URL)
   - `SMOKE_BASE_URL=https://lux-story.vercel.app npx playwright test tests/e2e/mobile/choice-bottom-sheet.spec.ts --project=mobile-iphone-14 --config playwright.prod-smoke.config.ts`
10. Broader production smoke (expected partial until split)
   - `SMOKE_BASE_URL=https://lux-story.vercel.app npx playwright test --project=smoke --config playwright.prod-smoke.config.ts`

## Terminology Control (Do Not Drift)

- Say **“CI latency budget proxy”** for fixture ratchets.
- Do **not** say **“production p95 proven”** unless runtime distribution telemetry is attached.
- For production smoke reporting, label God Mode simulation tests as **dev-only** until split from the production-safe smoke suite.

## Secrets Handling Rule

- Never print secret values in chat, logs, or docs.
- Only record presence/non-empty evidence (length checks or UI confirmation).
- If secrets are rotated, update `docs/qa/2026-03-02-release-readiness-gate-status.md` with new observed evidence and run IDs.
