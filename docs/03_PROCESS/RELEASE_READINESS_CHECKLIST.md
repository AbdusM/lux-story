---
title: Release Readiness Checklist (Guardrail-Complete)
last_updated: 2026-03-02
scope: operational-verifications
---

# Release Readiness Checklist (Guardrail-Complete)

This project’s promise is **“ship without manual playthroughs”**. Code + CI now enforce most guardrails, but *three* release-class properties are **operational configuration truths** and must be verified manually before shipping.

This checklist defines what “verified” means (evidence + acceptance).

## 0) Production env is complete (P0)

**Why:** missing/weak production env values can make the app look “up” while silently disabling persistence/telemetry or weakening admin protection.

**Where (UI):** `https://vercel.com/link-dap/lux-story/settings/environment-variables`

**Acceptance**
- ✅ Supabase client env vars are non-empty:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- ✅ `ADMIN_API_TOKEN` is non-empty and long/unguessable (do not use placeholders).
- ✅ `USER_API_SESSION_SECRET` is non-empty in production.
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` is optional unless you use privileged server-side admin/diagnostic paths.

**Evidence (E1, CLI alternative — lengths only)**
- `vercel --cwd /Users/abdusmuwwakkil/Development/30_lux-story env run -e production -- bash -lc 'echo NEXT_PUBLIC_SUPABASE_URL_len=${#NEXT_PUBLIC_SUPABASE_URL}; echo NEXT_PUBLIC_SUPABASE_ANON_KEY_len=${#NEXT_PUBLIC_SUPABASE_ANON_KEY}; echo SUPABASE_URL_len=${#SUPABASE_URL}; echo SUPABASE_ANON_KEY_len=${#SUPABASE_ANON_KEY}; echo SUPABASE_SERVICE_ROLE_KEY_len=${#SUPABASE_SERVICE_ROLE_KEY}; echo ADMIN_API_TOKEN_len=${#ADMIN_API_TOKEN}; echo USER_API_SESSION_SECRET_len=${#USER_API_SESSION_SECRET}'`

**Note:** changing `NEXT_PUBLIC_*` values requires a redeploy to affect client bundles.

## 1) Branch Protection: CI is required (P0)

**Why:** if CI checks aren’t required, a green pipeline is optional and guardrails don’t gate merges.

**Where (UI):** `https://github.com/AbdusM/lux-story/settings/branches` → Branch protection rules → `main`

**Acceptance**
- ✅ “Require a pull request before merging” enabled (optional but recommended)
- ✅ “Require status checks to pass before merging” enabled (**required**)
- ✅ Required checks include the workflow jobs from `.github/workflows/test.yml`:
  - “Test Suite / Run Tests” (`.github/workflows/test.yml:15`)
  - “Test Suite / Build Project” (`.github/workflows/test.yml:114`)

**Evidence (E1)**
- Screenshot of the branch protection rule showing required status checks (names visible).

**Evidence (E1, CLI alternative)**
- Output of:
  - `gh api repos/AbdusM/lux-story/branches/main/protection`

## 2) Production `user_id` is UUID-only (unguessable) (P0)

**Why:** the anonymous session cookie is minted server-side by `/api/user/session`. If production contains legacy/guessable IDs (example: `player_123`), an attacker can attempt session minting for another player’s ID.

**Code enforcement**
- `/api/user/session` rejects non-UUID `user_id` when `NODE_ENV=production` (`app/api/user/session/route.ts`).
- Session cookies reject non-UUID IDs when `NODE_ENV=production` (`lib/api/user-session.ts`).

**Acceptance**
- ✅ All rows in `player_profiles.user_id` are UUIDs.
- ✅ `player_*` / `player-*` / any other formats count is `0`.

**Evidence (E1)**
- Screenshot of query results (counts only; do not share raw user IDs).

**Where (UI):** `https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx` → SQL Editor (project: `actualizeme`)

**SQL (run in Supabase SQL editor or `psql`)**
```sql
select
  case
    when user_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then 'uuid'
    when user_id ~* '^player[_-]' then 'player_prefixed'
    else 'other'
  end as kind,
  count(*) as count
from player_profiles
group by kind
order by count desc;
```

## 3) `USER_API_SESSION_SECRET` exists in production (P0)

**Why:** session signing must be stable and **must not** be coupled to `SUPABASE_SERVICE_ROLE_KEY` rotation.

**Code enforcement**
- Production session signing requires `USER_API_SESSION_SECRET` (`lib/api/user-session.ts`).
- `validate-env` requires it when `NODE_ENV=production` (`lib/env-validation.ts`).

**Acceptance**
- ✅ `USER_API_SESSION_SECRET` is set in the production secrets store (Vercel/hosting).
- ✅ Value is non-empty and treated as a long-lived signing secret (rotate intentionally with a session invalidation plan).

**Evidence (E1)**
- Screenshot of the production environment variables list showing the key name `USER_API_SESSION_SECRET` exists (do not reveal value).

**Where (UI):** `https://vercel.com/link-dap/lux-story/settings/environment-variables`

**Evidence (E1, CLI alternative — lengths only, safe to paste into issues)**
- `vercel --cwd /Users/abdusmuwwakkil/Development/30_lux-story env run -e production -- bash -lc 'echo NEXT_PUBLIC_SUPABASE_URL_len=${#NEXT_PUBLIC_SUPABASE_URL}; echo NEXT_PUBLIC_SUPABASE_ANON_KEY_len=${#NEXT_PUBLIC_SUPABASE_ANON_KEY}; echo SUPABASE_SERVICE_ROLE_KEY_len=${#SUPABASE_SERVICE_ROLE_KEY}; echo SUPABASE_URL_len=${#SUPABASE_URL}; echo USER_API_SESSION_SECRET_len=${#USER_API_SESSION_SECRET}'`

## Optional: local “gate run” proof (E2)

These prove code-level guardrails locally (not production config):
- `npm run type-check`
- `npm run lint`
- `npm run test:run`
- `npm run release:security:minimum`
