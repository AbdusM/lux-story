# 2026-03-02 Agentic Session Handoff (Lux Story)

Purpose: prevent context drift in future agent sessions and keep release/readiness claims reproducible.

## Scope Guardrail (Read First)

- **In scope for this repo/session:** Lux Story (`30_lux-story`) and Supabase project `actualizeme` (`tavalvqcebosfxamuvlx`).
- **Out of scope for this repo/session:** RecipeApp/LinkDap/Five-Tiers migration work. Handle those in their own repos/chats.
- If a task mentions another product, stop and confirm before changing Lux Story docs/code.

## Current Verified State

- Feature PR: `https://github.com/AbdusM/lux-story/pull/7`
- Latest merged docs PR: `https://github.com/AbdusM/lux-story/pull/8`
- Branch: `main` (post-merge)
- Latest required checks green:
  - Test Suite run: `22596652714`
  - E2E matrix run: `22596650716`
- Production deploy live: `https://lux-story.vercel.app`

## Release Gate Truth (as of 2026-03-02)

- CI required checks on `main`: **pass**
- UUID readiness (`player_profiles.user_id`): **pass**
- Production env completeness (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_API_TOKEN`, `USER_API_SESSION_SECRET`): **pass**

Canonical status file:
- `docs/qa/2026-03-02-release-readiness-gate-status.md`

## Standard Re-Validation Commands (Agent Quickstart)

UI/design system reference:
- `docs/03_PROCESS/onboarding/03-design-systems-engineer-prompt.md`

1. CI status
   - `gh pr checks 8 -R AbdusM/lux-story`
2. Branch protection
   - `gh api repos/AbdusM/lux-story/branches/main/protection --jq '{required_status_checks: .required_status_checks.contexts}'`
3. UUID readiness
   - `npm run verify:user-id-uuid-readiness`
4. Latency budget proxy checks
   - `npm run verify:choice-dispatch-latency`
   - `npm run verify:choice-processing-latency`
5. Security minimum + UI contracts
   - `npm run release:security:minimum`
   - `npm run test:run -- tests/components/ui-layout-stability-contract.test.ts tests/components/stateful-menu-preservation-contract.test.ts tests/components/game-choices-sheet-mode.test.tsx`
   - `npm run type-check`
6. Mobile bottom-sheet UX gate
   - `npx playwright test tests/e2e/mobile/choice-bottom-sheet.spec.ts --project=mobile-iphone-14`
7. Production env lengths (safe: lengths only)
   - `vercel --cwd /Users/abdusmuwwakkil/Development/30_lux-story env run -e production -- bash -lc 'echo NEXT_PUBLIC_SUPABASE_URL_len=${#NEXT_PUBLIC_SUPABASE_URL}; echo NEXT_PUBLIC_SUPABASE_ANON_KEY_len=${#NEXT_PUBLIC_SUPABASE_ANON_KEY}; echo SUPABASE_URL_len=${#SUPABASE_URL}; echo SUPABASE_ANON_KEY_len=${#SUPABASE_ANON_KEY}; echo SUPABASE_SERVICE_ROLE_KEY_len=${#SUPABASE_SERVICE_ROLE_KEY}; echo ADMIN_API_TOKEN_len=${#ADMIN_API_TOKEN}; echo USER_API_SESSION_SECRET_len=${#USER_API_SESSION_SECRET}'`

## Terminology Control (Do Not Drift)

- Say **“CI latency budget proxy”** for fixture ratchets.
- Do **not** say **“production p95 proven”** unless runtime distribution telemetry is attached.

## Secrets Handling Rule

- Never print secret values in chat, logs, or docs.
- Only record presence/non-empty evidence (length checks or UI confirmation).
- If secrets are rotated, update `docs/qa/2026-03-02-release-readiness-gate-status.md` with new observed evidence and run IDs.
