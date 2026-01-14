# Database Migration Rollback Guide
Grand Central Terminus - Birmingham Career Exploration

## Migration: Ensure All User Profiles Exist

### Rollback Procedure

If the migration `migrate-ensure-all-profiles.ts` causes issues, follow these steps:

#### 1. Identify Affected Records
```sql
-- Find all profiles created by the migration
SELECT user_id, created_at
FROM player_profiles
WHERE created_at >= '[MIGRATION_START_TIME]'
ORDER BY created_at DESC;
```

#### 2. Verify No User Activity on New Profiles
```sql
-- Check if any new profiles have been used
SELECT pp.user_id,
       COUNT(DISTINCT sd.id) as skill_demos,
       COUNT(DISTINCT ce.id) as career_explorations
FROM player_profiles pp
LEFT JOIN skill_demonstrations sd ON pp.user_id = sd.user_id
LEFT JOIN career_explorations ce ON pp.user_id = ce.user_id
WHERE pp.created_at >= '[MIGRATION_START_TIME]'
GROUP BY pp.user_id;
```

#### 3. Restore from Backup (Recommended)

**Option A: Full Database Restore**
1. Go to Supabase Dashboard → Database → Backups
2. Select the backup taken before migration
3. Click "Restore" and confirm
4. Wait for restoration to complete (5-15 minutes)

**Option B: Selective Rollback (Advanced)**
```sql
-- Only if you cannot restore from backup
-- Delete profiles created by migration that have no associated data

BEGIN;

-- Get user_ids to delete (created by migration with no activity)
WITH migration_profiles AS (
  SELECT user_id
  FROM player_profiles
  WHERE created_at >= '[MIGRATION_START_TIME]'
),
profiles_with_activity AS (
  SELECT DISTINCT user_id FROM skill_demonstrations
  UNION
  SELECT DISTINCT user_id FROM career_explorations
  UNION
  SELECT DISTINCT player_id as user_id FROM choice_history
)
DELETE FROM player_profiles
WHERE user_id IN (
  SELECT mp.user_id
  FROM migration_profiles mp
  LEFT JOIN profiles_with_activity pwa ON mp.user_id = pwa.user_id
  WHERE pwa.user_id IS NULL
);

COMMIT;
```

#### 4. Verify Rollback Success
```sql
-- Check database integrity
SELECT
  (SELECT COUNT(*) FROM player_profiles) as total_profiles,
  (SELECT COUNT(DISTINCT user_id) FROM skill_demonstrations) as users_with_demos,
  (SELECT COUNT(DISTINCT user_id) FROM career_explorations) as users_with_careers;
```

### Prevention for Future Migrations

1. **Always run dry-run first:**
   ```bash
   npx tsx scripts/migrate-ensure-all-profiles.ts --dry-run
   ```

2. **Always create backup before migration:**
   - Supabase Dashboard → Database → Backups → Create Backup

3. **Test on staging database first** (if available)

4. **Document migration start time:**
   ```bash
   echo "Migration started: $(date -u +"%Y-%m-%d %H:%M:%S")" >> migration-log.txt
   ```

### Emergency Contacts

- **Database Admin:** [Your team contact]
- **Supabase Support:** support@supabase.com
- **On-call Engineer:** [Your team contact]

### Post-Rollback Actions

1. [ ] Verify application is functioning normally
2. [ ] Check error logs for any lingering issues
3. [ ] Document what went wrong in incident report
4. [ ] Plan corrective actions before re-attempting migration
5. [ ] Update migration script with lessons learned
