# Data Model

> Audited as of commit `33ef4c2` on 2026-01-27

## Table Inventory

18 migration files in `supabase/migrations/`. 16 tables, 3 views, 1 materialized view.

---

### player_profiles

**Purpose:** Core player record — identity, progress, metadata.
**Migration:** `001_initial_schema.sql`, `002_normalized_core.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | PK, auto-generated |
| user_id | TEXT | No | Unique, pseudonymous UUID |
| created_at | TIMESTAMPTZ | No | Default NOW() |
| updated_at | TIMESTAMPTZ | No | Auto-updated via trigger |
| current_scene | TEXT | Yes | Legacy |
| total_demonstrations | INTEGER | No | Default 0 |
| last_activity | TIMESTAMPTZ | No | Default NOW() |
| game_version | TEXT | No | Default '2.0' |
| platform | TEXT | No | Default 'web' |
| current_scene_id | TEXT | Yes | Added in 002 |
| current_character_id | TEXT | Yes | Added in 002 |
| has_started | BOOLEAN | No | Default FALSE |
| journey_started_at | TIMESTAMPTZ | Yes | |
| completion_percentage | INTEGER | No | Default 0, CHECK 0-100 |

**FK:** None (root table).
**RLS:** Users access own record (`auth.uid()::text = user_id`). Service role: all.
**PII:** `user_id` (pseudonymous UUID). No real names, emails, or demographics.

---

### skill_demonstrations

**Purpose:** Individual skill demonstration events.
**Migration:** `001_initial_schema.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | PK |
| user_id | TEXT | No | FK → player_profiles(user_id) CASCADE |
| skill_name | TEXT | No | |
| scene_id | TEXT | No | |
| choice_text | TEXT | Yes | |
| context | TEXT | Yes | |
| demonstrated_at | TIMESTAMPTZ | No | Default NOW() |

**RLS:** User-scoped + service role.
**PII:** None.

---

### career_explorations

**Purpose:** Career paths explored with match scores.
**Migration:** `001_initial_schema.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | PK |
| user_id | TEXT | No | FK → player_profiles(user_id) CASCADE |
| career_name | TEXT | No | |
| match_score | DECIMAL(3,2) | Yes | CHECK 0-1 |
| explored_at | TIMESTAMPTZ | No | Default NOW() |
| readiness_level | TEXT | Yes | CHECK: exploratory, emerging, near_ready, ready |
| local_opportunities | JSONB | No | Default '[]' |
| education_paths | JSONB | No | Default '[]' |

**Unique:** (user_id, career_name).
**RLS:** User-scoped + service role.
**PII:** None (career interests are behavioral, not identifying).

---

### relationship_progress

**Purpose:** Trust level per character.
**Migration:** `001_initial_schema.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | PK |
| user_id | TEXT | No | FK → player_profiles(user_id) CASCADE |
| character_name | TEXT | No | |
| trust_level | INTEGER | No | Default 0, CHECK 0-10 |
| last_interaction | TIMESTAMPTZ | No | Default NOW() |
| key_moments | JSONB | No | Default '[]' |

**Unique:** (user_id, character_name).
**RLS:** User-scoped + service role.
**PII:** None.

---

### platform_states

**Purpose:** Platform discovery and warmth state.
**Migration:** `001_initial_schema.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | PK |
| user_id | TEXT | No | FK → player_profiles(user_id) CASCADE |
| platform_id | TEXT | No | |
| warmth | INTEGER | No | Default 0, CHECK 0-100 |
| accessible | BOOLEAN | No | Default TRUE |
| discovered | BOOLEAN | No | Default FALSE |
| updated_at | TIMESTAMPTZ | No | Auto-updated |

**Unique:** (user_id, platform_id).
**RLS:** User-scoped + service role.

---

### career_analytics

**Purpose:** Aggregated career exploration data.
**Migration:** `005_career_analytics_table.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| user_id | TEXT | No | PK, FK → player_profiles(user_id) CASCADE |
| platforms_explored | TEXT[] | No | Default '{}' |
| time_spent_per_platform | JSONB | No | Default '{}' |
| career_interests | JSONB | No | Default '[]' |
| last_updated | TIMESTAMPTZ | No | Default NOW() |
| created_at | TIMESTAMPTZ | No | Default NOW() |

**RLS:** User-scoped + service role.

---

### skill_summaries

**Purpose:** Aggregated skill demonstration counts.
**Migration:** `006_skill_summaries_table.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| user_id | TEXT | No | FK → player_profiles(user_id) CASCADE |
| skill_name | TEXT | No | |
| demonstration_count | INTEGER | No | Default 0 |
| latest_context | TEXT | Yes | |
| scenes_involved | TEXT[] | No | Default '{}' |
| last_demonstrated | TIMESTAMPTZ | No | |
| created_at | TIMESTAMPTZ | No | |
| updated_at | TIMESTAMPTZ | No | Auto-updated |

**PK:** (user_id, skill_name) composite.
**RLS:** User-scoped + service role.

---

### pattern_demonstrations

**Purpose:** Individual pattern demonstration events.
**Migration:** `010_pattern_tracking.sql`

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID | No | PK, auto-generated |
| user_id | TEXT | No | |
| pattern_name | TEXT | No | CHECK: analytical, patience, exploring, helping, building |
| choice_id | TEXT | No | |
| choice_text | TEXT | Yes | |
| scene_id | TEXT | Yes | |
| character_id | TEXT | Yes | |
| context | TEXT | Yes | |
| demonstrated_at | TIMESTAMPTZ | No | Default NOW() |

**Note:** FK constraint intentionally removed to avoid dependency issues.
**RLS:** User-scoped + service role.

---

### visited_scenes, choice_history, player_patterns, player_behavioral_profiles, skill_milestones, relationship_key_moments, career_local_opportunities, player_urgency_scores

**Migration:** `002_normalized_core.sql`, `003_urgency_triage.sql`
**RLS:** All enabled in `013_fix_security_issues.sql`. User-scoped + service role.

See migration files for full column definitions. All use `CASCADE` delete from `player_profiles`.

---

## Materialized View: urgent_students

**Migration:** `003_urgency_triage.sql`

Pre-computed dashboard joining player_profiles + urgency scores + activity summaries.
**Filtered by:** urgency_level IN ('high', 'critical') OR inactive >7 days.
**Refreshed by:** `refresh_urgent_students_view()` function.
**Used by:** Admin dashboard (`/api/admin/urgency`).

## Views (Non-Materialized)

| View | Migration | Purpose |
|------|-----------|---------|
| pattern_summaries | 010 | Aggregated pattern counts per user |
| pattern_evolution | 010 | Weekly pattern usage time series |
| user_decision_styles | 010 | Dominant/secondary pattern classification |

All views use `security_invoker = true` (fixed in migrations `013`, `015`).

---

## PII Classification

| Classification | Tables | What's Stored |
|---------------|--------|---------------|
| **PII** | player_profiles | `user_id` (pseudonymous UUID), `email` (only if Supabase auth) |
| **Behavioral** | skill_demonstrations, career_explorations, relationship_progress, pattern_demonstrations, player_patterns, player_behavioral_profiles, choice_history | Patterns, skills, trust, career interests |
| **Aggregate** | career_analytics, skill_summaries, player_urgency_scores | Computed summaries |
| **Structural** | platform_states, visited_scenes, skill_milestones, career_local_opportunities | Game progress |

**What we do NOT store:** Real names, physical addresses, school names, age, gender, ethnicity, phone numbers, social media handles.

---

## Sync Strategy

**Write path:** Client → SyncQueue (in-memory) → `POST /api/user/*` → Supabase (service_role)
**Read path:** Supabase → API routes → Client (cached in localStorage, 24h TTL)
**Conflict resolution:** Last-write-wins. No CRDTs, no vector clocks.
**Known risk:** Concurrent writes from multiple devices overwrite each other silently.

## Data Retention

- **No automatic deletion** — data persists until profile is deleted
- **CASCADE** — deleting `player_profiles` cascades to all dependent tables
- **SyncQueue** — 7-day retry window, items dropped after TTL
- **No GDPR-specific tooling** — would need manual Supabase deletion if requested
