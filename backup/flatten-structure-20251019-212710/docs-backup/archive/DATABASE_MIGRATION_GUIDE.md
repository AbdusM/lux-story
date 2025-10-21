# Database Migration Guide - User Profile Consolidation

## Overview

**Date:** October 2025
**Migration:** Consolidated user profile creation into single reliable system
**Problem Solved:** Foreign key constraint errors due to missing `player_profiles` records

## Problem Statement

Prior to this migration, user profiles were not being automatically created when a user first interacted with the system. This caused cascading foreign key constraint errors when trying to insert records into child tables like:

- `skill_demonstrations`
- `career_explorations`
- `choice_history`
- `player_patterns`
- `skill_milestones`

## Solution Architecture

### 1. Consolidated User Profile Utility (`lib/ensure-user-profile.ts`)

**Single source of truth** for user profile creation:

```typescript
// Ensure a profile exists (idempotent, safe to call multiple times)
await ensureUserProfile(userId)

// Batch ensure multiple profiles
await ensureUserProfilesBatch([userId1, userId2, userId3])

// Check if profile exists without creating
const exists = await userProfileExists(userId)
```

**Key Features:**
- **Idempotent:** Safe to call multiple times for same user
- **Uses upsert:** Only inserts if record doesn't exist
- **Comprehensive logging:** All operations logged for debugging
- **Error handling:** Returns boolean success/failure, never throws

### 2. Automatic Profile Creation in Sync Queue (`lib/sync-queue.ts`)

The sync queue now **automatically ensures profiles exist** before processing any database actions:

```typescript
// Extract user_id from queued action
let userId = extractUserIdFromAction(action)

// Ensure profile exists before foreign key insertion
if (userId && !ensuredUserIds.has(userId)) {
  await ensureUserProfile(userId)
  ensuredUserIds.add(userId) // Cache to avoid duplicate checks
}

// Now safe to process action (foreign keys will succeed)
await processAction(action)
```

**Benefits:**
- **Zero manual intervention:** Profiles created automatically
- **Prevents FK errors:** All child records guaranteed to have parent
- **Performance optimized:** Caches ensured user IDs per batch
- **Backwards compatible:** Works with existing dual-write system

### 3. Comprehensive Tracker Integration (`lib/comprehensive-user-tracker.ts`)

User tracker now ensures profile on initialization:

```typescript
constructor(userId: string) {
  this.userId = userId
  // ... other initialization

  // Ensure profile exists (async, non-blocking)
  this.ensureProfile()
}
```

### 4. Migration Script (`scripts/migrate-ensure-all-profiles.ts`)

**One-time backfill** for existing users missing profiles:

```bash
npx tsx scripts/migrate-ensure-all-profiles.ts
```

**What it does:**
1. Scans all child tables for unique `user_id` / `player_id` values
2. Checks which ones don't have profiles in `player_profiles`
3. Creates missing profiles with default values
4. Verifies database integrity

## Running the Migration

### Prerequisites

```bash
# Ensure environment variables are set
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Execution Steps

1. **Backup Database (CRITICAL)**
   ```bash
   # Take Supabase backup via dashboard or CLI
   ```

2. **Run Migration Script**
   ```bash
   npx tsx scripts/migrate-ensure-all-profiles.ts
   ```

3. **Review Output**
   ```
   📊 Scanning all tables for user_ids...
      Scanning skill_demonstrations...
      ✅ Found 127 records

   🔍 Checking which users are missing profiles...
      ❌ Missing profile: user_12345
      ❌ Missing profile: user_67890

   🔧 Backfilling 2 missing profiles...
      ✅ Profile ensured for user_12345
      ✅ Profile ensured for user_67890

   📊 Migration Results:
      Total processed: 2
      ✅ Successfully created: 2
      ❌ Failed: 0

   🔍 Verifying database integrity...
      ✅ skill_demonstrations: 127 records
      ✅ career_explorations: 45 records
      ✅ choice_history: 892 records

   ✅ MIGRATION COMPLETE
   ```

4. **Deploy Updated Code**
   ```bash
   git add lib/ensure-user-profile.ts lib/sync-queue.ts lib/comprehensive-user-tracker.ts
   git commit -m "feat: consolidate user profile creation with automatic FK handling"
   git push
   ```

## Testing

### Manual Test

```typescript
import { ensureUserProfile } from '@/lib/ensure-user-profile'

// Test 1: Create new profile
const success = await ensureUserProfile('test-user-123')
console.log('Created:', success) // true

// Test 2: Idempotency (calling again shouldn't error)
const success2 = await ensureUserProfile('test-user-123')
console.log('Idempotent:', success2) // true

// Test 3: Batch creation
const results = await ensureUserProfilesBatch([
  'user-1',
  'user-2',
  'user-3'
])
console.log('Batch results:', results)
// { success: 3, failed: 0, failedUserIds: [] }
```

### Integration Test

```typescript
import { SyncQueue } from '@/lib/sync-queue'
import { DatabaseService } from '@/lib/database-service'

// Queue action for new user (profile doesn't exist yet)
SyncQueue.addToQueue({
  id: 'test-action-1',
  type: 'career_analytics',
  data: {
    user_id: 'brand-new-user-456',
    career_name: 'Software Developer',
    match_score: 0.85
  },
  timestamp: Date.now()
})

// Process queue - should auto-create profile then insert data
const db = new DatabaseService('dual-write')
const result = await SyncQueue.processQueue(db)

console.log('Queue result:', result)
// { success: true, processed: 1, failed: 0 }

// Verify profile was created
const exists = await userProfileExists('brand-new-user-456')
console.log('Profile exists:', exists) // true
```

## Rollback Plan

If issues arise:

1. **Restore Database Backup**
   ```bash
   # Use Supabase dashboard to restore to pre-migration state
   ```

2. **Revert Code Changes**
   ```bash
   git revert <migration-commit-hash>
   git push
   ```

3. **Manual Profile Creation** (temporary fix)
   ```sql
   INSERT INTO player_profiles (user_id, current_scene, total_demonstrations, last_activity)
   VALUES ('user-id', 'intro', 0, NOW())
   ON CONFLICT (user_id) DO NOTHING;
   ```

## Files Changed

### New Files
- `lib/ensure-user-profile.ts` - Consolidated profile creation utility
- `scripts/migrate-ensure-all-profiles.ts` - One-time migration script
- `docs/DATABASE_MIGRATION_GUIDE.md` - This document

### Modified Files
- `lib/sync-queue.ts` - Automatic profile ensuring before FK insertions
- `lib/comprehensive-user-tracker.ts` - Profile ensuring on tracker init

### Removed Files
- `fix-missing-users.js` - Replaced by migration script
- `fix-all-missing-users.js` - Replaced by migration script
- `fix-remaining-user.js` - Replaced by migration script
- `fix-remaining-fk-errors.js` - No longer needed (FK errors prevented)

## Success Criteria

✅ **Zero foreign key constraint errors** in production logs
✅ **Automatic profile creation** for all new users
✅ **All existing users have profiles** (verified by migration script)
✅ **Sync queue processing 100% success rate** (no FK failures)
✅ **Admin dashboard shows all user data** (no missing profiles)

## Monitoring

### Key Metrics to Watch

```sql
-- Count profiles vs child records (should match)
SELECT
  (SELECT COUNT(*) FROM player_profiles) as profiles,
  (SELECT COUNT(DISTINCT user_id) FROM skill_demonstrations) as skill_users,
  (SELECT COUNT(DISTINCT user_id) FROM career_explorations) as career_users;
```

### Error Logs to Monitor

```
# Search for FK errors (should be zero after migration)
grep "foreign key constraint" /var/log/app.log

# Search for profile creation logs
grep "EnsureUserProfile" /var/log/app.log
```

## Future Improvements

1. **Database Trigger:** Add Postgres trigger to auto-create profiles
   ```sql
   CREATE OR REPLACE FUNCTION ensure_player_profile()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO player_profiles (user_id, current_scene, total_demonstrations)
     VALUES (NEW.user_id, 'intro', 0)
     ON CONFLICT (user_id) DO NOTHING;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **Migration Test Suite:** Automated tests for migration script
3. **Monitoring Dashboard:** Real-time FK error tracking
4. **Profile Validation:** Periodic job to verify all users have profiles

## Questions & Support

**Issue:** "Migration script failed for user X"
- Check if user_id format is valid
- Verify Supabase service role key has correct permissions
- Review error logs for specific constraint violations

**Issue:** "Still seeing FK errors after migration"
- Run migration script again (it's idempotent)
- Check for race conditions in sync queue processing
- Verify all code is deployed (sync-queue updates)

**Contact:** Check git blame for this file or migration script
