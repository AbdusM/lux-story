# Real-Time Monitoring: Example Console Output

## Full User Journey Example

This shows what you'll see in the browser console during a typical user session:

```javascript
// Page loads
💡 Tip: Type userMonitor.dashboard() in console for real-time activity dashboard

// User makes first choice
👤 [USER ACTIVITY] Choice made: {
  userId: "...f3a2c1",
  choiceId: "maya_family_love",
  skills: "emotional_intelligence, cultural_competence",
  sceneId: "maya_family_love",
  timestamp: "2:30:15 PM"
}

⭐ [USER ACTIVITY] Skill demonstrated: {
  userId: "...f3a2c1",
  skill: "emotional_intelligence",
  count: 1,
  willSync: "💾 Local only",
  timestamp: "2:30:15 PM"
}

⭐ [USER ACTIVITY] Skill demonstrated: {
  userId: "...f3a2c1",
  skill: "cultural_competence",
  count: 1,
  willSync: "💾 Local only",
  timestamp: "2:30:15 PM"
}

// User continues making choices
👤 [USER ACTIVITY] Choice made: {
  userId: "...f3a2c1",
  choiceId: "maya_help_choice",
  skills: "emotional_intelligence, communication",
  sceneId: "maya_crisis_moment",
  timestamp: "2:31:42 PM"
}

⭐ [USER ACTIVITY] Skill demonstrated: {
  userId: "...f3a2c1",
  skill: "emotional_intelligence",
  count: 2,
  willSync: "💾 Local only",
  timestamp: "2:31:42 PM"
}

⭐ [USER ACTIVITY] Skill demonstrated: {
  userId: "...f3a2c1",
  skill: "communication",
  count: 1,
  willSync: "💾 Local only",
  timestamp: "2:31:42 PM"
}

// Third demonstration triggers sync
👤 [USER ACTIVITY] Choice made: {
  userId: "...f3a2c1",
  choiceId: "family_understanding",
  skills: "emotional_intelligence",
  sceneId: "maya_parents_discussion",
  timestamp: "2:33:08 PM"
}

⭐ [USER ACTIVITY] Skill demonstrated: {
  userId: "...f3a2c1",
  skill: "emotional_intelligence",
  count: 3,
  willSync: "🔄 SYNCING TO SUPABASE",
  timestamp: "2:33:08 PM"
}

// Sync processes
🚀 [SyncQueue] Processing queue: {
  totalActions: 1,
  actionTypes: { skill_summary: 1 },
  oldestAction: "2025-10-01T14:33:08.234Z"
}

⏳ [SyncQueue] Processing action: {
  type: "skill_summary",
  id: "a3f2b1c4",
  retries: 0,
  ageSeconds: 0
}

✅ [SyncQueue] Action successful: {
  type: "skill_summary",
  skill: "emotional_intelligence",
  count: 3
}

✅ [USER ACTIVITY] Supabase sync: {
  userId: "...f3a2c1",
  syncType: "skill_summary",
  success: true,
  timestamp: "2:33:09 PM"
}

🎉 [SyncQueue] Successfully synced 1 actions
🎉 [SyncQueue] Queue processing complete: {
  success: true,
  processed: 1,
  failed: 0
}

// Check dashboard
> userMonitor.dashboard()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 REAL-TIME USER ACTIVITY DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active users: 1
Total activities: 8

👤 User: ...f3a2c1
   Choices: 3 | Skills: 5 | Syncs: 1 | Errors: 0
   Last activity: 2:33:09 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Get specific user summary
> userMonitor.summary('user_f3a2c1')

{
  totalActivities: 8,
  choicesMade: 3,
  skillsDemonstrated: 5,
  syncOperations: 1,
  errors: 0,
  lastActivity: Date("2025-10-01T14:33:09.567Z")
}

// View recent activities
> userMonitor.recent(5)

[
  {
    timestamp: 1696172009567,
    userId: "user_f3a2c1",
    activityType: "sync",
    data: { syncType: "skill_summary", success: true }
  },
  {
    timestamp: 1696172008234,
    userId: "user_f3a2c1",
    activityType: "skill_demo",
    data: { skill: "emotional_intelligence", count: 3, willSync: true }
  },
  {
    timestamp: 1696172008210,
    userId: "user_f3a2c1",
    activityType: "choice",
    data: {
      choiceId: "family_understanding",
      skills: ["emotional_intelligence"],
      sceneId: "maya_parents_discussion",
      skillCount: 1
    }
  },
  // ... more activities
]
```

## Error Handling Example

When sync fails (e.g., network error or Supabase down):

```javascript
// Sync attempt fails
⏳ [SyncQueue] Processing action: {
  type: "skill_summary",
  id: "b7d3e2f1",
  retries: 0,
  ageSeconds: 5
}

❌ [SyncQueue] Action failed: {
  type: "skill_summary",
  id: "b7d3e2f1",
  error: "Failed to fetch",
  retries: 0,
  willRetry: true
}

❌ [USER ACTIVITY] Supabase sync: {
  userId: "...f3a2c1",
  syncType: "skill_summary",
  success: false,
  error: "Failed to fetch",
  timestamp: "2:35:23 PM"
}

⚠️ [SyncQueue] 1 actions failed, will retry later

🎉 [SyncQueue] Queue processing complete: {
  success: false,
  processed: 0,
  failed: 1
}

// Dashboard shows the error
> userMonitor.dashboard()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 REAL-TIME USER ACTIVITY DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active users: 1
Total activities: 12

👤 User: ...f3a2c1
   Choices: 5 | Skills: 8 | Syncs: 2 | Errors: 1  ⚠️
   Last activity: 2:35:23 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Multiple Users Example

When testing with multiple users (incognito windows):

```javascript
> userMonitor.dashboard()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 REAL-TIME USER ACTIVITY DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active users: 3
Total activities: 47

👤 User: ...f3a2c1
   Choices: 8 | Skills: 15 | Syncs: 5 | Errors: 0
   Last activity: 2:40:15 PM

👤 User: ...b8d4e2
   Choices: 5 | Skills: 9 | Syncs: 3 | Errors: 0
   Last activity: 2:39:47 PM

👤 User: ...c2a7f9
   Choices: 12 | Skills: 23 | Syncs: 7 | Errors: 1  ⚠️
   Last activity: 2:40:31 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Filtering Console Logs

### Show only skill demonstrations
In DevTools Console filter: `⭐`

```javascript
⭐ [USER ACTIVITY] Skill demonstrated: { ... }
⭐ [USER ACTIVITY] Skill demonstrated: { ... }
⭐ [USER ACTIVITY] Skill demonstrated: { ... }
```

### Show only sync operations
In DevTools Console filter: `ACTIVITY] Supabase`

```javascript
✅ [USER ACTIVITY] Supabase sync: { syncType: "skill_summary", success: true }
✅ [USER ACTIVITY] Supabase sync: { syncType: "career_analytics", success: true }
❌ [USER ACTIVITY] Supabase sync: { syncType: "skill_summary", success: false }
```

### Show only errors
In DevTools Console filter: `❌` or `🚨`

```javascript
❌ [SyncQueue] Action failed: { ... }
❌ [USER ACTIVITY] Supabase sync: { success: false, error: "..." }
🚨 [USER ACTIVITY] Error: { errorType: "API_FAILURE", ... }
```

### Show all user activities
In DevTools Console filter: `[USER ACTIVITY]`

```javascript
👤 [USER ACTIVITY] Choice made: { ... }
⭐ [USER ACTIVITY] Skill demonstrated: { ... }
✅ [USER ACTIVITY] Supabase sync: { ... }
```

## Performance Testing Example

Track sync timing and success rates:

```javascript
// User makes many choices rapidly
👤 [USER ACTIVITY] Choice made: ...  // 2:45:01 PM
⭐ [USER ACTIVITY] Skill demonstrated: count: 3, willSync: "🔄 SYNCING"
✅ [USER ACTIVITY] Supabase sync: success: true  // 2:45:02 PM  (1s)

👤 [USER ACTIVITY] Choice made: ...  // 2:45:05 PM
⭐ [USER ACTIVITY] Skill demonstrated: count: 6, willSync: "🔄 SYNCING"
✅ [USER ACTIVITY] Supabase sync: success: true  // 2:45:06 PM  (1s)

👤 [USER ACTIVITY] Choice made: ...  // 2:45:08 PM
⭐ [USER ACTIVITY] Skill demonstrated: count: 9, willSync: "🔄 SYNCING"
✅ [USER ACTIVITY] Supabase sync: success: true  // 2:45:09 PM  (1s)

// Analysis: All syncs completing in ~1 second (healthy)
```

## Integration Testing Example

Verify entire flow from choice to database:

```javascript
// 1. User makes choice
👤 [USER ACTIVITY] Choice made: {
  choiceId: "devon_breakthrough",
  skills: "creativity, problem_solving",
  sceneId: "devon_confidence"
}

// 2. Skills recorded
⭐ [USER ACTIVITY] Skill demonstrated: {
  skill: "creativity",
  count: 9,
  willSync: "🔄 SYNCING TO SUPABASE"
}

// 3. Sync queued
📊 [SkillTracker] Queued Supabase sync: {
  skill: "creativity",
  demonstrationCount: 9,
  scenesInvolved: 3,
  contextLength: 142
}

// 4. Sync processed
🚀 [SyncQueue] Processing queue: {
  totalActions: 1,
  actionTypes: { skill_summary: 1 }
}

// 5. API call succeeds
✅ [SyncQueue] Action successful: {
  type: "skill_summary",
  skill: "creativity",
  count: 9
}

// 6. Monitoring confirms
✅ [USER ACTIVITY] Supabase sync: {
  syncType: "skill_summary",
  success: true
}

// ✅ COMPLETE: Choice → Skill → Queue → Sync → Database
```

## Tips for Demo Sessions

### Before Demo
```javascript
// Clear previous session data
> userMonitor.clear()
🧹 [MONITOR] Activity log cleared

// Clear console
Cmd+K (Mac) or Ctrl+L (Windows)
```

### During Demo
```javascript
// Show stakeholders the dashboard every few minutes
> userMonitor.dashboard()

// Point out key metrics:
// - Choices made (engagement)
// - Skills demonstrated (learning)
// - Successful syncs (data integrity)
// - Zero errors (reliability)
```

### After Demo
```javascript
// Save logs for analysis
// Right-click console → "Save as..." → demo-session-2025-10-01.log

// Export activity data
> JSON.stringify(userMonitor.recent(100), null, 2)
// Copy output and save as demo-activities.json
```

## Troubleshooting Scenarios

### Scenario: "Skills aren't syncing"

Look for pattern:
```javascript
⭐ Skill demonstrated: count: 1  // Should increment
⭐ Skill demonstrated: count: 2  // Should increment
⭐ Skill demonstrated: count: 3, willSync: "🔄 SYNCING"  // Should trigger
✅ Supabase sync: success: true  // Should succeed
```

If missing any step, that's where the bug is.

### Scenario: "User data seems lost"

Check sync history:
```javascript
> userMonitor.summary('user_abc123')
{
  syncOperations: 0,  // ⚠️ No syncs = data only in localStorage
  errors: 0           // No errors = queue never processed
}

// Solution: Check if SyncQueue.processQueue() is being called
```

### Scenario: "Demo feels slow"

Check sync timing:
```javascript
// Look for gaps between willSync and success
⭐ Skill demonstrated: willSync: "🔄 SYNCING"  // 2:50:00 PM
✅ Supabase sync: success: true               // 2:50:08 PM

// 8 second sync = network issue or API bottleneck
```

## Summary

The real-time monitoring system gives you:

1. **Instant Visibility**: See every user action as it happens
2. **Integration Verification**: Track data flow from UI to database
3. **Error Detection**: Catch issues immediately during testing
4. **Performance Insights**: Identify slow operations
5. **Demo Confidence**: Show stakeholders live system health

**Key Command**: Type `userMonitor.dashboard()` in console anytime for instant overview.
