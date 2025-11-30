# Database Migration Verification Guide

**Grand Central Terminus - Birmingham Career Exploration**

## Overview

This guide helps verify that all database migrations have been applied to your production Supabase database.

## Migration Files

The following 12 migration files should be applied in order:

1. **001_initial_schema.sql** - Core tables (player_profiles, skill_demonstrations, career_explorations, relationship_progress, platform_states)
2. **002_normalized_core.sql** - Normalized schema improvements
3. **003_urgency_triage.sql** - Urgency triage system with materialized views
4. **004_fix_urgency_function.sql** - Bug fix for urgency calculation function
5. **005_career_analytics_table.sql** - Career analytics tracking table
6. **006_skill_summaries_table.sql** - Skill summaries aggregation table
7. **007_fix_skill_summaries_rls.sql** - RLS policy fixes for skill_summaries
8. **008_fix_rls_policies.sql** - Comprehensive RLS policy updates
9. **009_severity_calibrated_urgency_narratives.sql** - Urgency narrative system
10. **010_pattern_tracking.sql** - Pattern tracking infrastructure
11. **011_fix_player_profiles_rls.sql** - RLS fixes for player_profiles
12. **012_add_scene_descriptions.sql** - Scene descriptions for skill demonstrations

## Verification Steps

### Step 1: Check Core Tables Exist

Run this query in Supabase SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'player_profiles',
    'skill_demonstrations',
    'career_explorations',
    'relationship_progress',
    'platform_states',
    'skill_summaries',
    'career_analytics',
    'pattern_demonstrations'
  )
ORDER BY table_name;
```

**Expected Result:** All 8 tables should be listed.

### Step 2: Check Materialized Views

```sql
SELECT schemaname, matviewname
FROM pg_matviews
WHERE schemaname = 'public'
  AND matviewname LIKE '%urgency%';
```

**Expected Result:** Should show urgency-related materialized views.

### Step 3: Verify RLS Policies

```sql
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Result:** Should show RLS policies for all tables.

### Step 4: Check Functions

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%urgency%'
ORDER BY routine_name;
```

**Expected Result:** Should show urgency calculation functions.

### Step 5: Verify Column Structure

Check that key columns exist:

```sql
-- Check player_profiles structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'player_profiles'
ORDER BY ordinal_position;

-- Check skill_summaries structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'skill_summaries'
ORDER BY ordinal_position;
```

**Expected Result:** Should show all expected columns for each table.

## Quick Verification Script

Run this comprehensive check:

```sql
-- Comprehensive Migration Verification
DO $$
DECLARE
  table_count INTEGER;
  view_count INTEGER;
  policy_count INTEGER;
  function_count INTEGER;
BEGIN
  -- Count tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'player_profiles',
      'skill_demonstrations',
      'career_explorations',
      'relationship_progress',
      'platform_states',
      'skill_summaries',
      'career_analytics',
      'pattern_demonstrations'
    );

  -- Count materialized views
  SELECT COUNT(*) INTO view_count
  FROM pg_matviews
  WHERE schemaname = 'public'
    AND matviewname LIKE '%urgency%';

  -- Count RLS policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public';

  -- Count functions
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines
  WHERE routine_schema = 'public'
    AND routine_name LIKE '%urgency%';

  -- Report results
  RAISE NOTICE 'Migration Verification Results:';
  RAISE NOTICE '  Tables: % (expected: 8)', table_count;
  RAISE NOTICE '  Urgency Views: % (expected: 1+)', view_count;
  RAISE NOTICE '  RLS Policies: % (expected: 10+)', policy_count;
  RAISE NOTICE '  Functions: % (expected: 1+)', function_count;

  IF table_count >= 8 AND view_count >= 1 AND policy_count >= 10 THEN
    RAISE NOTICE '✅ All migrations appear to be applied!';
  ELSE
    RAISE WARNING '⚠️ Some migrations may be missing. Check individual results above.';
  END IF;
END $$;
```

## Applying Missing Migrations

If any migrations are missing:

1. **Option A: Apply via Supabase Dashboard**
   - Go to SQL Editor
   - Copy contents of missing migration file
   - Paste and run

2. **Option B: Use Combined Migration**
   - Use `supabase/combined-all-migrations.sql` if available
   - This contains all migrations in one file

3. **Option C: Apply Individually**
   - Apply missing migrations in order (001, 002, 003, etc.)
   - Verify after each migration

## Rollback Procedures

If you need to rollback a migration:

1. **Check Migration Dependencies**
   - Some migrations depend on previous ones
   - Review migration file comments for dependencies

2. **Backup First**
   ```sql
   -- Create backup of affected tables
   CREATE TABLE player_profiles_backup AS SELECT * FROM player_profiles;
   ```

3. **Rollback Steps**
   - Review migration file for DROP statements
   - Execute rollback in reverse order
   - Verify data integrity after rollback

## Production Checklist

Before deploying to production:

- [ ] All 12 migration files reviewed
- [ ] Core tables verified (8 tables exist)
- [ ] Materialized views created
- [ ] RLS policies active and tested
- [ ] Functions tested
- [ ] Sample data inserted and verified
- [ ] Admin dashboard can read data
- [ ] User API routes can write data
- [ ] Backup strategy in place

## Troubleshooting

### "Relation already exists" Error
- Migration already applied - safe to skip
- Or drop and recreate if needed

### "Permission denied" Error
- Check you're using service role key
- Verify RLS policies allow operation

### Missing Columns
- Apply the specific migration that adds the column
- Check migration order (later migrations may depend on earlier ones)

## Support

If migrations fail:
1. Check Supabase project status (not paused)
2. Verify environment variables are set
3. Review migration file for syntax errors
4. Check Supabase logs for detailed error messages

---

*Last Updated: November 29, 2025*

