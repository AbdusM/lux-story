# Security

> Audited as of commit `33ef4c2` on 2026-01-27

## Threat Model

### Data at Risk

| Category | Examples | Sensitivity |
|----------|----------|-------------|
| Behavioral patterns | analytical=0.7, helping=0.4 | Low — no PII, pseudonymous |
| Career interests | "healthcare", match_score=0.85 | Low — aggregated preferences |
| Skill assessments | 54 skills with demonstration counts | Low — educational context |
| Relationship progress | trust levels per character (0-10) | Low — game mechanics |
| Player UUID | `user_id` (pseudonymous) | Medium — linkable if auth enabled |
| Email | Only if Supabase auth used | High — PII |

### Attack Surfaces

| Surface | Vector | Likelihood | Impact |
|---------|--------|------------|--------|
| localStorage | XSS injection reads all game state | Medium | Low (no real PII) |
| API routes | Unauthorized access to `/api/user/*` | Low (RLS enforced) | Medium |
| Admin dashboard | Unauthorized access to `/api/admin/*` | Low (auth gated) | High (all student data) |
| Shared device | Next user reads localStorage | Medium | Low (pseudonymous) |
| Network | MITM on API calls | Low (HTTPS) | Low |

### Threat Actors

1. **Curious student** (low risk) — inspects localStorage via DevTools. Sees own game state. No escalation path to other users.
2. **Shared device** (medium risk) — school/library computer. Next user inherits localStorage. Game state is pseudonymous but behavioral data is present.
3. **XSS injection** (high risk) — if attacker injects script via dialogue content or URL params, all localStorage is readable. Mitigated by: Next.js automatic escaping, no `dangerouslySetInnerHTML` on user input, CSP headers.

## Auth Boundaries

### Anonymous Play (Default)
- Full game access, all dialogue, all characters
- State in localStorage only — no Supabase sync
- No `user_id` sent to server
- Admin dashboard inaccessible

### Authenticated Play
- Same game access + Supabase sync enabled
- `user_id` (UUID) sent with API calls
- SyncQueue pushes to `/api/user/*` routes
- RLS policies enforce `auth.uid()::text = user_id`

### Admin Access
- Requires `requireAdminAuth()` middleware (grep: `requireAdminAuth` in `app/api/admin/`)
- Can view all students via `urgent_students` materialized view
- Can run urgency calculations, export research data
- Protected by Supabase auth + role check

## localStorage Risks

### XSS Exposure
All localStorage keys are readable by any JavaScript on the same origin. If an attacker achieves XSS:
- **Readable**: game state, orb balance, settings, player UUID
- **Not stored**: passwords, tokens (Supabase auth uses httpOnly cookies)
- **Mitigation**: pseudonymous UUIDs, no real names/locations/ages stored

### Multi-Tab Race Conditions
- `StorageEvent` listener (`hooks/useMultiTabSync.ts`) rehydrates Zustand when another tab writes (TD-006)
- Two tabs writing `lux_story_v2_game_store` (`STORAGE_KEYS.GAME_STORE`) simultaneously: last write wins
- Acceptable risk for single-player game; would need fixing for PWA offline mode

### Device Theft / Shared Device
- Game state persists indefinitely in localStorage
- No session timeout, no auto-clear
- **Mitigation**: no real PII stored. Behavioral patterns are pseudonymous.
- **Future**: could add "Clear my data" button in profile settings

### Quota Exhaustion
- localStorage limit: 5-10MB (browser-dependent)
- Game state: ~200-500KB typical
- SafeStorage (`lib/persistence/storage-manager.ts`, grep: `CRITICAL_KEYS`) handles quota exceeded by clearing non-essential keys
- Attack vector: malicious script could fill localStorage to deny game saves. Low likelihood.

## RLS Policy Summary

All 16 Supabase tables have Row Level Security enabled (completed in migration `013_fix_security_issues.sql`).

**Standard pattern** (per-user isolation):
```sql
USING ((select auth.uid())::text = user_id)
```

**Optimization** (migration `014_optimize_rls_performance.sql`):
- Replaced `auth.uid()` with `(select auth.uid())` to prevent per-row re-evaluation
- Applied across all policies

**Service role bypass**:
```sql
TO service_role
```
Used by API routes (`createClient()` with service_role key) for admin operations.

**Security definer fixes** (migrations `015`-`018`):
- Views recreated with `security_invoker = true` instead of `security_definer`
- Functions given explicit `search_path` to prevent injection

Full schema details: [Data Model](03-data-model.md)

## Logging Posture

### What Is Logged
- Browser console: errors, warnings (development only)
- Supabase: API call metadata (timestamp, user_id, table)
- Vercel: HTTP access logs (standard)

### What Must Never Be Logged
- Auth tokens or session cookies in error messages
- Full game state dumps (too large, contains behavioral data)
- `user_id` in plaintext error messages shown to users
- Stack traces exposed to client

### Current Gaps
- No server-side application logging (beyond Vercel defaults)
- No structured error tracking (e.g., Sentry)
- Console errors in production build are not captured

## Incident Response Checklist

### Data Leak Suspected
1. Check Vercel access logs for unusual API patterns
2. Review Supabase audit log for bulk reads
3. Verify RLS policies haven't been altered: `rg "ALTER POLICY|DROP POLICY" supabase/migrations/`
4. Check if `service_role` key is exposed in client bundle: `rg "service_role" --type ts -l`

### XSS Reported
1. Identify injection point (URL param, dialogue content, user input)
2. Verify Next.js auto-escaping is intact — search for `dangerouslySetInnerHTML`
3. Check CSP headers in `next.config.js`
4. Review any `innerHTML` or `eval` usage: `rg "innerHTML|eval\(" --type ts`

### RLS Bypass Suspected
1. Run migration `013` assertions: all 16 tables should have RLS enabled
2. Check for `SECURITY DEFINER` in views: `rg "security_definer" supabase/migrations/`
3. Verify API routes use `createClient()` correctly (not exposing service_role to client)
4. Check Supabase dashboard → Authentication → Policies

### Sync Corruption
1. Compare localStorage state with Supabase: export via God Mode (`window.godMode.exportState()`)
2. Check SyncQueue for stuck items (7-day TTL)
3. Verify API route responses for error patterns
4. If needed, clear localStorage and re-seed from Supabase
