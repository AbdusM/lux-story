# Week 2 Console Logging - Expected Output Examples

## Overview

All Week 2 systems now have comprehensive console logging for instant debugging. Every operation logs its inputs, outputs, timing, and errors with clear emoji indicators.

## Emoji Legend

- 🔵 API request received
- 📥 Request body parsed
- 📤 Response sent
- 🔍 Data fetch initiated
- ✅ Success
- ❌ Error
- ⚠️ Warning
- 🎯 Skill demonstration recorded
- 📝 Tracking event
- 🔄 Sync queued
- 🚀 Queue processing started
- 🎉 Queue processing complete
- 💬 Dialogue generation
- ⚡ Cache hit
- 🌐 API call (external)
- 🤖 AI generation
- 📊 Data summary
- 💾 Cache write

---

## Example 1: Player Makes a Choice with Skill Demonstration

### Console Output:
```
📝 [SkillTracker] Recording skill demonstration: {
  userId: "user_12345",
  sceneId: "maya_family_love",
  skills: ["emotionalIntelligence", "criticalThinking"],
  contextLength: 142,
  totalDemonstrations: 5
}

📊 [SkillTracker] Skill demonstration count: {
  skill: "emotionalIntelligence",
  count: 3,
  willSync: true
}

🔄 [SkillTracker] Queued Supabase sync: {
  skill: "emotionalIntelligence",
  demonstrationCount: 3,
  scenesInvolved: 2,
  contextLength: 142
}

🎯 [PlayerPersona] Adding skill demonstration: {
  playerId: "user_12345",
  skills: ["emotionalIntelligence", "criticalThinking"],
  sceneId: "maya_family_love",
  contextLength: 142
}

✅ [PlayerPersona] Updated persona: {
  recentSkills: ["emotionalIntelligence", "criticalThinking", "communication"],
  topSkills: ["emotionalIntelligence:3", "criticalThinking:2", "communication:1"],
  totalDemonstrations: 3
}
```

**What This Shows:**
- Skill demonstration recorded locally
- Every 3rd demonstration triggers Supabase sync queue
- PlayerPersona updated with skill counts
- All data structures visible for debugging

---

## Example 2: Sync Queue Processing

### Console Output:
```
🚀 [SyncQueue] Processing queue: {
  totalActions: 2,
  actionTypes: { skill_summary: 2 },
  oldestAction: "2025-10-01T10:23:45.123Z"
}

⏳ [SyncQueue] Processing action: {
  type: "skill_summary",
  id: "a1b2c3d4",
  retries: 0,
  ageSeconds: 45
}

🔵 [API:SkillSummaries] POST request: {
  userId: "user_12345",
  skillName: "emotionalIntelligence",
  demonstrationCount: 3,
  contextLength: 142,
  scenesCount: 2
}

✅ [API:SkillSummaries] Upsert successful: {
  userId: "user_12345",
  skillName: "emotionalIntelligence",
  demonstrationCount: 3
}

✅ [SyncQueue] Action successful: {
  type: "skill_summary",
  skill: "emotionalIntelligence",
  count: 3
}

🎉 [SyncQueue] Queue processing complete: {
  success: true,
  processed: 2,
  failed: 0
}
```

**What This Shows:**
- Queue contains 2 pending skill summaries
- Each action processed sequentially with age tracking
- API route receives and validates data
- Successful Supabase upsert
- Queue cleared after success

---

## Example 3: Samuel Dialogue Generation with Skills

### Console Output:
```
💬 [SamuelDialogue] Generating dialogue: {
  nodeId: "samuel_pattern_observation",
  cacheKey: "samuel_pattern_observation__emotionalIntellig...",
  topSkills: ["emotionalIntelligence", "criticalThinking", "communication"],
  cached: false
}

🌐 [SamuelDialogue] Fetching from API: {
  nodeId: "samuel_pattern_observation",
  cacheKey: "samuel_pattern_observation__em"
}

🔵 [API:SamuelDialogue] Request received: {
  timestamp: "2025-10-01T10:25:30.456Z"
}

📥 [API:SamuelDialogue] Request body: {
  nodeId: "samuel_pattern_observation",
  hasPersona: true,
  topSkills: ["emotionalIntelligence:3", "criticalThinking:2", "communication:1"],
  samuelTrust: 5,
  platformsVisited: 2
}

🤖 [API:SamuelDialogue] Calling Gemini: {
  model: "gemini-1.5-flash",
  promptLength: 2847,
  temperature: 0.8
}

✅ [API:SamuelDialogue] Gemini response: {
  dialogueLength: 198,
  generationTimeMs: 1243,
  preview: "I've noticed how you sit with people's pain befo..."
}

📤 [API:SamuelDialogue] Sending response: {
  success: true,
  emotion: "knowing",
  confidence: 0.95,
  generationTimeMs: 1243,
  hasForbiddenPatterns: false
}

✅ [SamuelDialogue] Dialogue generated: {
  nodeId: "samuel_pattern_observation",
  dialogueLength: 198,
  emotion: "knowing",
  confidence: 0.95,
  generationTimeMs: 1250,
  preview: "I've noticed how you sit with people's pain befo..."
}

💾 [SamuelDialogue] Response cached: {
  nodeId: "samuel_pattern_observation",
  confidence: 0.95
}
```

**What This Shows:**
- Full pipeline from client request to API to Gemini to cache
- Timing metrics (1243ms generation)
- Skill context passed through (top 3 skills)
- Validation (no forbidden gamification patterns)
- Response cached for future use

---

## Example 4: Cache Hit for Samuel Dialogue

### Console Output:
```
💬 [SamuelDialogue] Generating dialogue: {
  nodeId: "samuel_pattern_observation",
  cacheKey: "samuel_pattern_observation__emotionalIntellig...",
  topSkills: ["emotionalIntelligence", "criticalThinking", "communication"],
  cached: true
}

⚡ [SamuelDialogue] Cache HIT: {
  nodeId: "samuel_pattern_observation",
  ageSeconds: 120
}
```

**What This Shows:**
- Same request returns instantly from cache
- Cache age tracked (2 minutes old)
- No API call needed

---

## Example 5: Admin Dashboard Fetching Skills

### Console Output:
```
🔍 [AdvisorBriefing] Fetching skills: {
  userId: "user_12345"
}

🔵 [API:SkillSummaries] GET request: {
  userId: "user_12345"
}

✅ [API:SkillSummaries] Retrieved summaries: {
  userId: "user_12345",
  count: 3,
  skills: ["emotionalIntelligence:3", "criticalThinking:2", "communication:1", "adaptability:1", "problemSolving:1"]
}

✅ [AdvisorBriefing] Skills loaded: {
  userId: "user_12345",
  skillCount: 3,
  topSkills: ["emotionalIntelligence", "criticalThinking", "communication"]
}

📝 [AdvisorBriefing] Generating briefing: {
  userId: "user_12345",
  totalDemonstrations: 7
}

✅ [AdvisorBriefing] Briefing generated: {
  userId: "user_12345",
  briefingLength: 2456,
  tokensUsed: 487,
  generationTimeMs: 3421
}
```

**What This Shows:**
- Admin dashboard fetches skills from Supabase
- Skills API returns top 5 demonstrated skills
- Briefing generation uses skill data
- Full timing metrics (3.4 seconds total)

---

## Example 6: Error Handling - Sync Failure

### Console Output:
```
🚀 [SyncQueue] Processing queue: {
  totalActions: 1,
  actionTypes: { skill_summary: 1 },
  oldestAction: "2025-10-01T10:20:15.789Z"
}

⏳ [SyncQueue] Processing action: {
  type: "skill_summary",
  id: "x7y8z9w0",
  retries: 0,
  ageSeconds: 315
}

🔵 [API:SkillSummaries] POST request: {
  userId: "user_12345",
  skillName: "problemSolving",
  demonstrationCount: 2,
  contextLength: 128,
  scenesCount: 2
}

❌ [API:SkillSummaries] Supabase upsert error: {
  code: "23503",
  message: "Foreign key violation",
  userId: "user_12345",
  skillName: "problemSolving"
}

❌ [SyncQueue] Action failed: {
  type: "skill_summary",
  id: "x7y8z9w0",
  error: "Skill summary sync failed: 500",
  retries: 0,
  willRetry: true
}

⚠️ [SyncQueue] 1 actions failed, will retry later

🎉 [SyncQueue] Queue processing complete: {
  success: false,
  processed: 0,
  failed: 1
}
```

**What This Shows:**
- Sync failure logged with full context
- Supabase error details visible
- Action marked for retry (retries: 0 → 1)
- Queue preserved for next processing attempt

---

## Example 7: PlayerPersona AI Summary

### Console Output:
```
📊 [PlayerPersona] AI Summary generated: {
  playerId: "user_12345",
  summaryLength: 487,
  topSkills: ["emotionalIntelligence", "criticalThinking", "communication"],
  preview: "Recent skills: Emotional Intelligence (3x), Critical Thinking (2x), Communication (1x). Emot..."
}
```

**What This Shows:**
- AI-ready summary generated for Samuel dialogue
- Top 3 skills with counts
- Rich context included (100-150 words per skill)

---

## Debugging Workflow

1. **Open DevTools Console** (F12 → Console tab)
2. **Filter by component** (type `[SkillTracker]` in filter box)
3. **Watch skill demonstrations accumulate** (every choice logs)
4. **Check sync triggers** (every 3rd demonstration for each skill)
5. **Monitor API calls** (request → response → cache)
6. **Verify error handling** (retries, fallbacks, context)

---

## Performance Metrics Visible

- **SkillTracker**: Demonstration count, sync frequency
- **SyncQueue**: Queue size, action age, retry counts
- **Samuel Dialogue**: Generation time (1000-1400ms), cache hits
- **API Routes**: Request time, Supabase query time
- **Admin Dashboard**: Fetch time, briefing generation time

---

## Common Issues & What to Look For

### Issue: Skills not syncing to Supabase
**Look for:**
```
🔄 [SkillTracker] Queued Supabase sync: {...}
⚠️ [SyncQueue] 1 actions failed, will retry later
```

### Issue: Samuel dialogue not personalized
**Look for:**
```
ℹ️ [API:SamuelDialogue] No skill demonstrations yet, using generic dialogue
```

### Issue: Admin dashboard shows no skills
**Look for:**
```
ℹ️ [API:SkillSummaries] No data found for user: user_12345
```

### Issue: Slow AI generation
**Look for:**
```
✅ [API:SamuelDialogue] Gemini response: {
  generationTimeMs: 5432  // Over 5 seconds = potential issue
}
```

---

## Testing Commands

### View all Week 2 logs:
```javascript
// In browser console:
console.log('Testing Week 2 logging...')
```

### Trigger sync manually:
```javascript
import { SyncQueue } from './lib/sync-queue'
await SyncQueue.processQueue()
```

### Clear cache:
```javascript
import { getSamuelDialogueEngine } from './lib/samuel-dialogue-engine'
getSamuelDialogueEngine().clearCache()
```

---

## Files Modified

1. `/lib/player-persona.ts` - Persona tracking and AI summaries
2. `/lib/skill-tracker.ts` - Skill demonstration recording
3. `/lib/sync-queue.ts` - Offline-first sync queue
4. `/lib/samuel-dialogue-engine.ts` - Dialogue generation client
5. `/app/api/samuel-dialogue/route.ts` - Dialogue API route
6. `/app/api/user/skill-summaries/route.ts` - Skills Supabase API
7. `/app/api/user/career-analytics/route.ts` - Career analytics API
8. `/components/admin/AdvisorBriefingButton.tsx` - Admin dashboard component

---

## Next Steps

1. Open DevTools Console
2. Play through story (make 3-5 choices)
3. Watch console output appear in real-time
4. Visit admin dashboard → Skills tab
5. Generate advisor briefing
6. Review console logs for full pipeline

**Result:** Complete visibility into Week 2 systems with zero configuration.
