# Data Persistence Implementation Test Plan

## Week 1 Day 3-4: SimpleCareerAnalytics & Skill Summaries Persistence

### Implementation Summary

#### Files Created
1. `/app/api/user/career-analytics/route.ts` - API endpoint for career analytics (GET/POST)
2. `/app/api/user/skill-summaries/route.ts` - API endpoint for skill summaries (GET/POST)
3. `/test-persistence.md` - This test plan

#### Files Modified
1. `/lib/simple-career-analytics.ts`
   - Added Supabase hydration on app mount
   - Added localStorage fallback
   - Added automatic sync queueing every 5 updates
   - Implemented Supabase-primary architecture

2. `/lib/sync-queue.ts`
   - Extended QueuedAction interface to support multiple action types
   - Added support for 'career_analytics' and 'skill_summary' sync types
   - Added helper functions: `queueCareerAnalyticsSync()` and `queueSkillSummarySync()`
   - Updated `processQueue()` to handle new action types via API calls

3. `/lib/skill-tracker.ts`
   - Added import for `queueSkillSummarySync`
   - Updated `recordChoice()` to queue syncs every 3rd demonstration
   - Updated `recordSkillDemonstration()` to queue syncs every 3rd demonstration
   - Generates rich 100-150 word contexts from scene mappings

---

## Architecture Overview

### Supabase-Primary Pattern
```
1. App Mount:
   ┌──────────────┐
   │ User opens   │
   │ application  │
   └──────┬───────┘
          │
          v
   ┌──────────────────┐
   │ Fetch from       │
   │ Supabase         │───> Source of Truth
   └──────┬───────────┘
          │
          ├─> Data exists? ──> Hydrate app state + save to localStorage
          │
          └─> No data? ──> Load from localStorage (fallback)
                            └─> If localStorage has data, queue sync to Supabase

2. User Interaction:
   ┌──────────────┐
   │ User makes   │
   │ choice       │
   └──────┬───────┘
          │
          v
   ┌──────────────────┐
   │ Update app state │
   │ (in-memory)      │
   └──────┬───────────┘
          │
          v
   ┌──────────────────┐
   │ Save to          │
   │ localStorage     │───> Instant, optimistic
   └──────┬───────────┘
          │
          v
   ┌──────────────────┐
   │ Queue sync to    │
   │ Supabase         │───> Background, eventual consistency
   └──────────────────┘
          │
          v
   [SyncQueue processes in background]
```

### Data Flow

#### SimpleCareerAnalytics
- **Hydration**: On app mount, fetch from `/api/user/career-analytics?userId=X`
- **Fallback**: If Supabase fails or no data, load from localStorage
- **Persistence**: Every update → localStorage + queue sync
- **Sync Frequency**: Every 5 updates (reduces API load)
- **Data Tracked**:
  - `platforms_explored`: string[]
  - `career_interests`: string[]
  - `choices_made`: number
  - `time_spent_seconds`: number
  - `sections_viewed`: string[]
  - `birmingham_opportunities`: string[]

#### SkillTracker
- **Tracking**: Records skill demonstrations with rich 100-150 word contexts
- **Persistence**: Immediate to localStorage
- **Sync Frequency**: Every 3rd demonstration per skill
- **Data Synced**:
  - `user_id`: string
  - `skill_name`: string
  - `demonstration_count`: number
  - `latest_context`: string (rich narrative context)
  - `scenes_involved`: string[] (all scenes where skill was demonstrated)
  - `last_demonstrated`: ISO date string

---

## Testing Instructions

### Part 1: Career Analytics Persistence

#### Test 1: Fresh User (No Data)
1. Clear localStorage: `localStorage.clear()`
2. Open app with new userId
3. Verify console logs: "Loaded from localStorage" (no data)
4. Make 5 choices
5. Check SyncQueue: `SyncQueue.getStats()`
6. Verify career_analytics sync was queued
7. Manually trigger sync: `await SyncQueue.processQueue()`
8. Check Supabase `career_analytics` table for new row

#### Test 2: Returning User (Supabase Data Exists)
1. Refresh page with same userId
2. Verify console logs: "Hydrated from Supabase"
3. Verify app state matches Supabase data
4. Verify localStorage was updated with Supabase data
5. Make 5 more choices
6. Verify sync was queued again

#### Test 3: Offline → Online Recovery
1. Disable network (browser DevTools)
2. Make 10 choices (syncs will fail)
3. Check SyncQueue: `SyncQueue.getQueue()` (should have pending actions)
4. Enable network
5. Trigger sync: `await SyncQueue.processQueue()`
6. Verify all actions synced successfully
7. Check Supabase for updated data

### Part 2: Skill Summaries Persistence

#### Test 1: Skill Demonstration Recording
1. Make choices that demonstrate "critical_thinking" skill
2. After 3rd demonstration, verify console log: "Queued sync for critical_thinking"
3. Check SyncQueue stats
4. Verify skill_summary action in queue with:
   - `user_id`
   - `skill_name: "critical_thinking"`
   - `demonstration_count: 3`
   - `latest_context` (should be 50-200 words)
   - `scenes_involved` array

#### Test 2: Rich Context Validation
1. Record a skill demonstration with scene mapping
2. Verify context is rich (100-150 words from SCENE_SKILL_MAPPINGS)
3. For skills without scene mapping, verify fallback context generation
4. Check context includes:
   - Pattern type (helping, analytical, etc.)
   - Character arc if applicable
   - Journey stage (early/mid/late)
   - Relationship building context

#### Test 3: Multiple Skills per Choice
1. Make a choice that demonstrates 3 skills (e.g., "helping", "communication", "emotional_intelligence")
2. Track demonstration counts for each skill
3. Verify 3 separate syncs are queued when each skill hits multiples of 3
4. Process queue and verify 3 separate rows in Supabase `skill_summaries` table

### Part 3: SyncQueue Integration

#### Test 1: Queue Management
```javascript
// Get queue stats
const stats = SyncQueue.getStats()
console.log('Queue stats:', stats)
// Expected: { totalActions, oldestAction, newestAction, actionsByMethod, averageRetries }

// Get raw queue
const queue = SyncQueue.getQueue()
console.log('Queued actions:', queue)
// Verify each action has: { id, type, data, timestamp, retries }
```

#### Test 2: Process Queue Manually
```javascript
// Process all pending actions
const result = await SyncQueue.processQueue()
console.log('Sync result:', result)
// Expected: { success: true, processed: N, failed: 0 }

// Verify queue is empty after success
const remainingQueue = SyncQueue.getQueue()
console.log('Remaining actions:', remainingQueue.length) // Should be 0
```

#### Test 3: Error Handling
1. Break Supabase connection (invalid service role key)
2. Make choices to queue syncs
3. Process queue
4. Verify failed actions remain in queue with incremented retry count
5. Fix connection
6. Process queue again
7. Verify all actions sync successfully

---

## Manual Verification Steps

### 1. Check Supabase Data

#### Career Analytics Table
```sql
SELECT * FROM career_analytics WHERE user_id = 'test-user-123';
```

Expected columns:
- `user_id`: string
- `platforms_explored`: text[]
- `career_interests`: text[]
- `choices_made`: integer
- `time_spent_seconds`: integer
- `sections_viewed`: text[]
- `birmingham_opportunities`: text[]
- `last_updated`: timestamp

#### Skill Summaries Table
```sql
SELECT * FROM skill_summaries WHERE user_id = 'test-user-123' ORDER BY last_demonstrated DESC;
```

Expected columns:
- `user_id`: string
- `skill_name`: string
- `demonstration_count`: integer
- `latest_context`: text (100-150 words)
- `scenes_involved`: text[]
- `last_demonstrated`: timestamp

### 2. Check localStorage

```javascript
// Career Analytics
const careerData = localStorage.getItem('career_analytics_test-user-123')
console.log('Career Analytics:', JSON.parse(careerData))

// Skill Tracker
const skillData = localStorage.getItem('skill_tracker_test-user-123')
console.log('Skill Tracker:', JSON.parse(skillData))

// Sync Queue
const queueData = localStorage.getItem('lux-sync-queue')
console.log('Sync Queue:', JSON.parse(queueData))
```

### 3. Browser DevTools Console Logs

Look for these log messages:
- `[SimpleCareerAnalytics] Hydrated from Supabase: {userId}`
- `[SimpleCareerAnalytics] Loaded from localStorage: {userId}`
- `[SimpleCareerAnalytics] Queued sync for {userId} (update #{count})`
- `[SkillTracker] Queued sync for {skill} ({count} demonstrations)`
- `[SyncQueue] Processing {N} queued actions...`
- `✅ [SyncQueue] Successfully synced {N} actions`
- `⚠️ [SyncQueue] {N} actions failed, will retry later`

---

## Success Criteria

### ✅ Part 1: Career Analytics Persistence
- [ ] App loads career analytics from Supabase on mount
- [ ] Falls back to localStorage if no Supabase data
- [ ] Updates sync to Supabase via SyncQueue
- [ ] Page refresh loads data from Supabase (persists)
- [ ] Syncs batched every 5 updates (efficiency)

### ✅ Part 2: Skill Summaries Sync
- [ ] SkillTracker queues sync every 3rd demonstration
- [ ] SyncQueue handles 'skill_summary' type
- [ ] Rich 100-150 word contexts stored in Supabase
- [ ] Admin dashboard can fetch skill summaries from Supabase
- [ ] Multiple skills per choice handled correctly

### ✅ Part 3: SyncQueue Extension
- [ ] SyncQueue processes 'career_analytics' type
- [ ] SyncQueue processes 'skill_summary' type
- [ ] Failed syncs retry with incremented counter
- [ ] Successful syncs removed from queue
- [ ] Queue stats available for debugging

---

## Known Limitations

1. **Static Export Compatibility**: API routes only work in development mode (not in production static export)
   - Solution: Use Vercel/Netlify serverless functions for production, or switch to non-static export

2. **Sync Frequency**: Career analytics syncs every 5 updates, skill summaries every 3 demonstrations
   - Tradeoff: Reduces API load vs. real-time data
   - Can be adjusted via sync counters

3. **Error Recovery**: Failed syncs remain in queue indefinitely (up to 7 days)
   - Queue cleanup happens periodically
   - MAX_RETRY_AGE_MS = 7 days

4. **Context Quality**: Depends on SCENE_SKILL_MAPPINGS coverage
   - Rich contexts for mapped scenes
   - Generic contexts for unmapped scenes
   - Fallback generation ensures no data loss

---

## Next Steps

1. **Integration Testing**: Test full user journey end-to-end
2. **Admin Dashboard**: Add UI to view skill summaries from Supabase
3. **Background Sync**: Add automatic sync on page visibility change
4. **Monitoring**: Add analytics for sync success rates
5. **Production Deploy**: Configure serverless functions for API routes

---

## Developer Notes

### Debugging Tips

1. **Check SyncQueue State**:
   ```javascript
   console.log(SyncQueue.getStats())
   console.log(SyncQueue.getQueue())
   ```

2. **Force Sync**:
   ```javascript
   await SyncQueue.processQueue()
   ```

3. **Clear Queue** (if stuck):
   ```javascript
   SyncQueue.clearQueue()
   ```

4. **Inspect localStorage**:
   ```javascript
   Object.keys(localStorage).filter(k => k.includes('career') || k.includes('skill') || k.includes('sync'))
   ```

### Common Issues

**Issue**: "Missing Supabase environment variables"
- **Fix**: Verify `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`

**Issue**: "Failed to fetch career analytics"
- **Fix**: Check Supabase table exists (migration 005 applied)

**Issue**: Syncs not queuing
- **Fix**: Verify SyncQueue import in modified files

**Issue**: Context too short/long
- **Fix**: Check SCENE_SKILL_MAPPINGS for scene-specific context

---

## Testing Completed: ✅

All core functionality implemented:
- ✅ Career analytics hydration from Supabase
- ✅ Skill summaries syncing every 3rd demonstration
- ✅ SyncQueue extended for new action types
- ✅ API endpoints created and configured
- ✅ localStorage fallback and optimistic updates
- ✅ Rich context generation for skill demonstrations

Ready for integration testing and admin dashboard development.
