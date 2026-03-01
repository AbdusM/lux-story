---
title: Release Readiness Checklist (Guardrail-Complete)
last_updated: 2026-03-01
scope: operational-verifications
---

# Release Readiness Checklist (Guardrail-Complete)

This project’s promise is **“ship without manual playthroughs”**. Code + CI now enforce most guardrails, but *three* release-class properties are **operational configuration truths** and must be verified manually before shipping.

This checklist defines what “verified” means (evidence + acceptance).

## 1) Branch Protection: CI is required (P0)

**Why:** if CI checks aren’t required, a green pipeline is optional and guardrails don’t gate merges.

**Where:** GitHub → Repo → Settings → Branches → Branch protection rules → `main`

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
  - `gh api repos/OWNER/REPO/branches/main/protection`

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

## Optional: local “gate run” proof (E2)

These prove code-level guardrails locally (not production config):
- `npm run type-check`
- `npm run lint`
- `npm run test:run`
- `npm run release:security:minimum`

