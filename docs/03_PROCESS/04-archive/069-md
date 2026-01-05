# Real-Time User Activity Monitoring

## Overview

The real-time monitor tracks all user interactions during demos/testing, providing instant visibility into:
- Choices made and skills demonstrated
- Scene transitions
- Supabase sync operations
- Errors affecting users

## Console Commands

Open browser console and use these commands:

### View Live Dashboard
```javascript
userMonitor.dashboard()
```
Shows all active users with their activity counts.

### Get User Summary
```javascript
userMonitor.summary('user_abc123')
```
Returns detailed stats for specific user.

### View Recent Activities
```javascript
userMonitor.recent(50)  // Last 50 activities
```

### Clear Activity Log
```javascript
userMonitor.clear()
```

## Console Log Format

### User Choice
```
👤 [USER ACTIVITY] Choice made: {
  userId: "...abc123",
  choiceId: "family_understanding",
  skills: "emotional_intelligence, cultural_competence",
  sceneId: "maya_family_love",
  timestamp: "2:34:56 PM"
}
```

### Skill Demonstration
```
⭐ [USER ACTIVITY] Skill demonstrated: {
  userId: "...abc123",
  skill: "emotional_intelligence",
  count: 3,
  willSync: "🔄 SYNCING TO SUPABASE",
  timestamp: "2:34:56 PM"
}
```

### Supabase Sync
```
✅ [USER ACTIVITY] Supabase sync: {
  userId: "...abc123",
  syncType: "skill_summary",
  success: true,
  timestamp: "2:34:57 PM"
}
```

### Error
```
🚨 [USER ACTIVITY] Error: {
  userId: "...abc123",
  errorType: "API_FAILURE",
  message: "Failed to fetch skill summaries",
  context: {...},
  timestamp: "2:35:01 PM"
}
```

## Demo Testing Workflow

### 1. Start Testing Session
1. Open app: http://localhost:3003
2. Open DevTools Console (F12)
3. Clear console: Cmd+K (Mac) or Ctrl+L (Windows)
4. Start playing through story

### 2. Monitor User Activity
Watch console for:
- 👤 Choices (every decision)
- ⭐ Skills (every demonstration)
- 🔄 Syncs (every 3rd demonstration)
- ✅/❌ Sync results

### 3. Check Dashboard
Type in console:
```javascript
userMonitor.dashboard()
```

See all active users and their stats.

### 4. Debug Specific User
```javascript
userMonitor.summary('user_abc123')
```

Get detailed activity breakdown.

### 5. Replay Recent Activities
```javascript
userMonitor.recent(20)
```

See last 20 activities across all users.

## Filtering Console Logs

Use DevTools filter to focus:
- `[USER ACTIVITY]` - All user interactions
- `👤` - Choices only
- `⭐` - Skills only
- `🔄` or `✅` or `❌` - Syncs only
- `🚨` - Errors only

## Testing Checklist

During demo testing, verify you see:
- [ ] 👤 Choice logs when user makes decisions
- [ ] ⭐ Skill demonstration logs with counts
- [ ] 🔄 "SYNCING TO SUPABASE" every 3rd demonstration
- [ ] ✅ Successful sync confirmations
- [ ] Dashboard shows correct user count
- [ ] User summary shows accurate stats
- [ ] No 🚨 error logs (unless testing error handling)

## Production Considerations

**Development Mode** (current):
- All logs visible in console
- `userMonitor` globally available
- Maximum 100 activities tracked

**Production Mode** (future):
- Disable console logs: Add `NODE_ENV` check
- Send to analytics: Hook into PostHog/Mixpanel
- Real-time dashboard: Admin-only API endpoint

## Tips

1. **Clear Console Frequently**: Cmd+K keeps logs manageable
2. **Use Filters**: Focus on specific emoji or component
3. **Check Dashboard**: Every 5-10 minutes during testing
4. **Save Logs**: Right-click console → "Save as..." for bug reports
5. **Multiple Users**: Open incognito windows to simulate multiple testers

## Example Demo Session

```
[2:30 PM] User starts playing
👤 Choice: tutorial_begin
⭐ Skill: critical_thinking (1)
👤 Choice: maya_help
⭐ Skill: emotional_intelligence (1)
👤 Choice: family_understanding
⭐ Skill: emotional_intelligence (2)
⭐ Skill: cultural_competence (1)
👤 Choice: hint_bridge
⭐ Skill: emotional_intelligence (3) 🔄 SYNCING
✅ Sync: skill_summary successful

[Dashboard shows:]
User ...abc123: 4 choices, 5 skills, 1 sync, 0 errors
```

## Troubleshooting

**Not seeing logs?**
- Check console isn't filtered
- Verify `userMonitor` is available: type `userMonitor` and press Enter
- Refresh page to reinitialize monitor

**Dashboard not working?**
- Type: `userMonitor.dashboard()`
- Check for JavaScript errors in console

**Logs overwhelming?**
- Use filters (emoji or `[USER ACTIVITY]`)
- Clear console: Cmd+K
- Reduce activity: focus on specific user flows

## Integration Points

The monitoring system is integrated at these key points:

### `/lib/skill-tracker.ts`
- Logs skill demonstrations with counts
- Shows when sync will trigger (every 3rd demo)

### `/lib/player-persona.ts`
- Logs choice made with skills demonstrated
- Captures scene context

### `/lib/sync-queue.ts`
- Logs successful Supabase syncs
- Logs sync failures with error messages

## Architecture

```
User Action
    ↓
SkillTracker.recordSkillDemonstration()
    ↓
logSkillDemo() → Console + Activity Log
    ↓
PlayerPersona.addSkillDemonstration()
    ↓
logChoice() → Console + Activity Log
    ↓
queueSkillSummarySync() [every 3rd demo]
    ↓
SyncQueue.processQueue()
    ↓
logSync() → Console + Activity Log
```

## API Reference

### Monitor Functions

```typescript
// Log a user choice
logChoice(userId: string, choiceId: string, skills: string[], sceneId: string)

// Log skill demonstration
logSkillDemo(userId: string, skill: string, count: number, willSync: boolean)

// Log Supabase sync
logSync(userId: string, syncType: 'career_analytics' | 'skill_summary', success: boolean, error?: string)

// Log scene transition (not yet integrated)
logSceneEnter(userId: string, sceneId: string, context?: string)

// Log errors
logError(userId: string, errorType: string, message: string, context?: any)

// Log page loads (not yet integrated)
logPageLoad(userId: string, page: string, loadTime?: number)
```

### Console API

```typescript
// Available globally via window.userMonitor
userMonitor.dashboard()              // Print full dashboard
userMonitor.summary(userId: string)  // Get user summary
userMonitor.recent(limit?: number)   // Get recent activities
userMonitor.clear()                  // Clear activity log
```

## Future Enhancements

1. **Scene Transitions**: Log when users enter new scenes
2. **Page Performance**: Track page load times
3. **User Engagement**: Track time spent per scene
4. **Error Analytics**: Aggregate common error patterns
5. **Admin Dashboard**: Web UI showing all user activities
6. **Real-time Sync**: WebSocket updates for multi-user monitoring
7. **Export Logs**: Download activity logs as CSV/JSON
8. **Filters**: Filter dashboard by user, time range, activity type

---

This monitoring system gives you complete visibility into user behavior during testing, making iteration cycles instant instead of having to check databases or ask users what happened.
