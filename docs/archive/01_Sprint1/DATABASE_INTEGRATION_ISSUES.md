# Database Integration Issues - Admin Dashboard

## Status: ⚠️ Pre-Existing Issue (Not Related to Dialogue Refactor)

**Date Identified**: November 23, 2025
**Impact**: Admin dashboard data persistence
**Severity**: Medium (affects analytics, not core gameplay)

---

## Issue: Foreign Key Violations (Error 23503)

**Error Pattern**:
```
❌ [API:SkillSummaries] Supabase upsert error: {
  code: '23503',
  message: 'Unknown error',
  userId: 'player-1763923123120-5dhj8m6vb',
  skillName: 'criticalThinking'
}
```

**Root Cause**:
- `skill_summaries` table has foreign key: `user_id REFERENCES player_profiles(user_id)`
- When a new player starts the game, skill summaries are created BEFORE player profile
- This violates the foreign key constraint

**Migration**: `supabase/migrations/006_skill_summaries_table.sql:14`
```sql
CREATE TABLE IF NOT EXISTS skill_summaries (
  user_id TEXT NOT NULL REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  -- ^ This foreign key causes the error
  ...
);
```

---

## Impact Assessment

### ✅ What Still Works
- Core gameplay (dialogue navigation, choices, story progression)
- Frontend skill tracking (localStorage-based SkillTracker)
- Character arc progression
- All dialogue refactor features (chat pacing, emotions, animations)

### ❌ What's Broken
- Skill summaries persistence to Supabase
- Admin dashboard skill analytics (can't query missing data)
- Pattern demonstrations sync
- Career explorations tracking (likely same issue)

---

## Solution Options

### Option 1: Ensure Player Profile Created First (Recommended)
**Fix**: Modify game initialization to create player profile before any skill tracking

```typescript
// In app/page.tsx or StatefulGameInterface.tsx
async function initializePlayer(userId: string) {
  // 1. Create player profile FIRST
  await fetch('/api/user/profile', {
    method: 'POST',
    body: JSON.stringify({ userId })
  })

  // 2. Then initialize skill tracking
  // Skills can now reference valid player profile
}
```

**Pros**: Clean, proper data model
**Cons**: Requires refactoring game initialization

### Option 2: Make Foreign Key Optional
**Fix**: Remove `NOT NULL` constraint or make it deferrable

```sql
-- Migration 012: Fix skill summaries foreign key
ALTER TABLE skill_summaries
  ALTER COLUMN user_id DROP NOT NULL;

-- Or use ON CONFLICT to auto-create profile
CREATE OR REPLACE FUNCTION ensure_player_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO player_profiles (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Pros**: Quick fix, no code changes
**Cons**: Allows orphaned records, messy data model

### Option 3: Use UPSERT with Profile Creation
**Fix**: Modify API route to create profile if missing

```typescript
// In app/api/user/skill-summaries/route.ts
const { error } = await supabase
  .from('skill_summaries')
  .upsert({
    user_id: userId,
    skill_name: skillName,
    ...data
  })

if (error?.code === '23503') {
  // Foreign key violation - create profile and retry
  await supabase.from('player_profiles').insert({ user_id: userId })
  await supabase.from('skill_summaries').upsert({ user_id: userId, ...data })
}
```

**Pros**: Handles edge case gracefully
**Cons**: Reactive fix, adds latency

---

## Recommended Fix

**Implement Option 1 + Option 3 (Belt and Suspenders)**

1. **Primary Fix** (Option 1): Ensure player profile created at game start
2. **Fallback** (Option 3): API routes auto-create profile if missing

**Implementation**:

```typescript
// 1. In components/StatefulGameInterface.tsx
useEffect(() => {
  async function initializeGame() {
    // Create player profile FIRST
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUserId,
        created_at: new Date().toISOString()
      })
    })

    // Then load game state
    loadGameState()
  }

  initializeGame()
}, [currentUserId])

// 2. In app/api/user/skill-summaries/route.ts
async function ensurePlayerProfile(userId: string) {
  const { error } = await supabase
    .from('player_profiles')
    .upsert({ user_id: userId }, { onConflict: 'user_id' })

  if (error) console.error('Profile creation failed:', error)
}

export async function POST(request: Request) {
  const { userId, skillName, ...data } = await request.json()

  // Ensure profile exists
  await ensurePlayerProfile(userId)

  // Now safe to insert skill summary
  const { error } = await supabase
    .from('skill_summaries')
    .upsert({ user_id: userId, skill_name: skillName, ...data })

  // ... rest of route
}
```

---

## Testing After Fix

1. **Clear localStorage**: `localStorage.clear()` in browser console
2. **Start new game**: Should create player profile immediately
3. **Make first choice**: Should create skill summary without foreign key error
4. **Check admin dashboard**: Should show new player in analytics
5. **Verify data**: Query Supabase to confirm both tables have data

```sql
-- Check player profiles
SELECT * FROM player_profiles
WHERE user_id LIKE 'player-%'
ORDER BY created_at DESC
LIMIT 5;

-- Check skill summaries (should match profiles)
SELECT ss.user_id, ss.skill_name, pp.created_at
FROM skill_summaries ss
JOIN player_profiles pp ON ss.user_id = pp.user_id
ORDER BY ss.last_demonstrated DESC
LIMIT 10;
```

---

## Related Issues

**Same Pattern Likely Affects**:
- `pattern_demonstrations` table
- `career_explorations` table
- `skill_demonstrations` table (if it has FK to player_profiles)

**Check all tables with player profile foreign keys**:
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'player_profiles';
```

---

## Priority

**Not Blocking Dialogue Refactor PR** ✅
- This issue existed before the refactor
- Dialogue refactor doesn't touch database schema
- Admin dashboard impact is separate concern

**Recommended Timeline**:
1. **Now**: Document issue (✅ This file)
2. **Before merging dialogue refactor**: No action needed
3. **After merge**: Create separate PR for database fix
4. **Sprint priority**: Medium (affects analytics, not core gameplay)

---

## Verification

**The dialogue refactor does NOT cause or worsen this issue**:
- ✅ No dialogue graph changes touch Supabase
- ✅ No admin dashboard code modified in refactor
- ✅ Error existed before refactor branch created
- ✅ Error will exist after refactor merged

**This is a separate, pre-existing infrastructure issue.**

---

**Created**: November 23, 2025
**Status**: Documented, solution designed, awaiting implementation
**Blocks**: Admin dashboard analytics
**Does Not Block**: Dialogue refactor merge
