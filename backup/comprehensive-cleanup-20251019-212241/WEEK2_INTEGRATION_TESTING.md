# Week 2 Integration Testing Documentation

**Strategic Activation Plan - Week 2 Day 4**

**Purpose**: Comprehensive integration testing for WEF 2030 Skills Framework implementation across the entire data flow: choice tagging → PlayerPersona tracking → Supabase sync → admin dashboard → Samuel dialogue → AI briefings.

---

## Test Environment Setup

### Prerequisites

1. **Development Environment**:
   ```bash
   npm run dev
   ```

2. **Supabase Connection**:
   - Verify `.env.local` contains:
     ```bash
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     GEMINI_API_KEY=your-gemini-api-key
     ```

3. **Database Migrations Applied**:
   ```bash
   # Verify skill_summaries table exists
   supabase db reset --local  # if testing locally
   ```

4. **Test User ID**:
   - Use consistent test user ID across all tests: `test-user-week2`

---

## Integration Test Suite

### Test 1: Skills Tagging Flow

**Objective**: Verify that choices tagged with skills update PlayerPersona correctly and persist to localStorage.

#### Test Steps

1. **Start Fresh Journey**:
   ```bash
   # Clear browser localStorage
   localStorage.clear()

   # Navigate to http://localhost:3000
   # Click "Begin New Journey"
   ```

2. **Make Skill-Tagged Choice**:
   - Progress to Maya family pressure scene
   - Select choice: "Parents' dreams aren't your obligations"
   - **Expected Skills**: `emotionalIntelligence`, `culturalCompetence`, `communication`, `criticalThinking`

3. **Verify PlayerPersona Update**:
   ```javascript
   // Open browser console
   const personas = JSON.parse(localStorage.getItem('lux-story-player-personas'))
   console.log(personas['test-user-week2'])

   // Expected output:
   {
     skillDemonstrations: {
       emotionalIntelligence: {
         count: 1,
         latestContext: "Reframed parental sacrifice from...",
         latestScene: "maya_family_pressure",
         timestamp: [current timestamp]
       },
       // ... other skills
     },
     recentSkills: ["emotionalIntelligence", "culturalCompetence", ...],
     topSkills: [
       { skill: "emotionalIntelligence", count: 1, percentage: 25 }
     ]
   }
   ```

4. **Verify localStorage Persistence**:
   ```javascript
   // Refresh page
   location.reload()

   // Verify data persists
   const personas = JSON.parse(localStorage.getItem('lux-story-player-personas'))
   console.log(personas['test-user-week2'].topSkills)
   ```

**Success Criteria**:
- ✅ Skills tracked in PlayerPersona.skillDemonstrations
- ✅ recentSkills array updated (last 5 unique)
- ✅ topSkills array calculated correctly
- ✅ Data persists across page refresh

**Expected Duration**: 2-3 minutes

---

### Test 2: Skill Summary Sync to Supabase

**Objective**: Verify that 3rd demonstration of a skill triggers Supabase sync via SyncQueue.

#### Test Steps

1. **Make 3 Demonstrations of Same Skill**:
   - Choice 1: Maya family pressure → "Parents' dreams..." (emotionalIntelligence)
   - Choice 2: Devon father reveal → "I'm sorry about your mom" (emotionalIntelligence)
   - Choice 3: Jordan impostor reveal → Ask diagnostic question (emotionalIntelligence)

2. **Verify SyncQueue Population**:
   ```javascript
   // Check sync queue in localStorage
   const queue = JSON.parse(localStorage.getItem('lux-sync-queue'))
   console.log(queue)

   // Expected: Array with skill_summary action
   [
     {
       id: "uuid-here",
       type: "skill_summary",
       data: {
         user_id: "test-user-week2",
         skill_name: "emotionalIntelligence",
         demonstration_count: 3,
         latest_context: "Rich 100-150 word context...",
         scenes_involved: ["maya_family_pressure", "devon_father_reveal", "jordan_impostor_reveal"]
       },
       timestamp: [timestamp],
       retries: 0
     }
   ]
   ```

3. **Manually Process Queue**:
   ```javascript
   // Open browser console
   import { SyncQueue } from './lib/sync-queue'

   const result = await SyncQueue.processQueue()
   console.log(result)
   // Expected: { success: true, processed: 1, failed: 0 }
   ```

4. **Verify Supabase Data**:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT * FROM skill_summaries
   WHERE user_id = 'test-user-week2'
   AND skill_name = 'emotionalIntelligence';

   -- Expected result:
   user_id              | skill_name             | demonstration_count | latest_context              | scenes_involved
   ---------------------|------------------------|---------------------|-----------------------------|-----------------
   test-user-week2      | emotionalIntelligence  | 3                   | Offered direct emotional... | {maya_family_pressure, devon_father_reveal, jordan_impostor_reveal}
   ```

**Success Criteria**:
- ✅ SyncQueue action created on 3rd demonstration
- ✅ Queue processes successfully
- ✅ Data appears in Supabase skill_summaries table
- ✅ Rich context (100-150 words) preserved
- ✅ scenes_involved array populated correctly

**Expected Duration**: 5-7 minutes

---

### Test 3: Samuel Skill-Aware Dialogue

**Objective**: Verify Samuel dialogue generation reflects player's demonstrated skills without explicit naming.

#### Test Steps

1. **Build Skill Profile**:
   - Make 5+ choices demonstrating varied skills
   - Ensure at least 2 skills have 3+ demonstrations
   - Example profile:
     - `emotionalIntelligence`: 5 demonstrations
     - `criticalThinking`: 4 demonstrations
     - `communication`: 3 demonstrations

2. **Reach Samuel Node**:
   - Navigate to a Samuel wisdom node (e.g., `samuel_pattern_observation`)
   - **Note**: Samuel dialogue should generate via `/api/samuel-dialogue`

3. **Verify API Call**:
   ```javascript
   // Check Network tab in DevTools
   // POST to /api/samuel-dialogue
   // Request body should include:
   {
     nodeId: "samuel_pattern_observation",
     playerPersona: {
       topSkills: [
         { skill: "emotionalIntelligence", count: 5, percentage: 33.3 },
         { skill: "criticalThinking", count: 4, percentage: 26.7 }
       ],
       skillDemonstrations: { /* rich context */ }
     },
     gameContext: {
       platformsVisited: ["platform_1", "platform_3"],
       samuelTrust: 6,
       currentLocation: "samuel_hub"
     }
   }
   ```

4. **Verify Response Quality**:
   ```javascript
   // Response should contain:
   {
     dialogue: "I've watched how you help people see bridges where they only saw walls. Maya needed permission to honor both parents and herself. Devon needed to know that feeling deeply doesn't make his systems thinking less valid. That kind of thinking—finding integration instead of either/or—it's rare.",
     emotion: "knowing",
     confidence: 0.95,
     generatedAt: [timestamp]
   }
   ```

5. **Quality Checks**:
   - ❌ NO explicit skill naming ("your emotional intelligence")
   - ❌ NO gamification language ("you scored", "level up")
   - ✅ References SPECIFIC choice contexts from player's journey
   - ✅ Connects observations to career paths naturally
   - ✅ Maintains Samuel's warm, observant character voice
   - ✅ 2-4 sentences, concise wisdom

**Success Criteria**:
- ✅ API receives PlayerPersona with topSkills
- ✅ Dialogue reflects demonstrated skills implicitly
- ✅ No forbidden patterns (explicit skill names, gamification)
- ✅ Samuel's character voice preserved
- ✅ Contextually relevant to player's specific journey

**Expected Duration**: 8-10 minutes

---

### Test 4: Admin Dashboard Skills Tab

**Objective**: Verify counselor-facing Skills tab displays WEF 2030 framework with full visualization.

#### Test Steps

1. **Navigate to Admin Dashboard**:
   ```
   http://localhost:3000/admin
   ```

2. **Select Test User**:
   - User selector dropdown → "test-user-week2"
   - Click "2030 Skills" tab

3. **Verify Skills Visualization**:
   - **Top Skills Section**:
     - Displays top 5 skills with demonstration counts
     - Bar chart visualization (relative percentages)
     - Skills sorted by count (descending)

   - **Demonstration Contexts**:
     - Each skill has expandable context row
     - Shows rich 100-150 word context
     - Displays scenes involved as tags

4. **Verify Data Fetching**:
   ```javascript
   // Check Network tab
   // GET /api/user/skill-summaries?userId=test-user-week2

   // Response should be:
   {
     success: true,
     summaries: [
       {
         skillName: "emotionalIntelligence",
         demonstrationCount: 5,
         latestContext: "Offered direct emotional acknowledgment...",
         scenesInvolved: ["maya_family_pressure", "devon_father_reveal", ...],
         lastDemonstrated: "2025-01-15T10:30:00.000Z"
       },
       // ... other skills
     ]
   }
   ```

5. **Verify Birmingham Career Connections**:
   - Each skill shows "Birmingham Connections" section
   - Example for `emotionalIntelligence`:
     - Healthcare: UAB Medical Center
     - Education: Birmingham City Schools
     - Social Work: YMCA Birmingham

**Success Criteria**:
- ✅ Skills tab renders without errors
- ✅ Top 5 skills displayed with accurate counts
- ✅ Bar chart visualization shows relative proportions
- ✅ Context rows expand/collapse correctly
- ✅ Birmingham career connections shown for each skill
- ✅ Data fetched from Supabase via API route

**Expected Duration**: 5-7 minutes

---

### Test 5: AI Briefing Skills Integration

**Objective**: Verify AI Briefing includes WEF 2030 Skills section with evidence-based insights.

#### Test Steps

1. **Generate Briefing**:
   - Admin dashboard → Select "test-user-week2"
   - Click "Generate Advisor Briefing" button
   - Wait for generation (5-10 seconds)

2. **Verify Skills Section Present**:
   ```markdown
   ## WEF 2030 Skills Framework

   Based on Grand Central Terminus interactions, this student has demonstrated:

   ### Top Skills Demonstrated

   1. **Emotional Intelligence** (5 demonstrations)
      - Maya family pressure: Reframed parental sacrifice from "obligation to fulfill their vision"...
      - Devon father reveal: Offered direct emotional acknowledgment without problem-solving...
      - Context: Shows consistent pattern of recognizing emotional complexity and responding with empathy

   2. **Critical Thinking** (4 demonstrations)
      - Jordan impostor reveal: Asked diagnostic question that surfaces underlying belief system...
      - Samuel reflects on Maya: Learned reframing technique separating means from ends...

   3. **Communication** (3 demonstrations)
      - Maya UAB revelation: Provided concrete institutional pathway research...
   ```

3. **Verify Birmingham Connections**:
   ```markdown
   ### Birmingham Career Connections

   Based on demonstrated skills profile:
   - **Healthcare**: Strong emotional intelligence + communication suggests UAB Medical Center, Children's of Alabama
   - **Education**: Pattern recognition + empathy aligns with Birmingham City Schools, Teach for America Birmingham
   - **Technology**: Critical thinking + problem-solving fits Innovation Depot startups, Shipt/Daxko
   ```

4. **Verify Evidence-Based Language**:
   - Uses specific choice contexts as evidence
   - NO numerical scores ("8/10 emotional intelligence")
   - YES qualitative patterns ("consistent pattern of...")
   - References actual scenes from player journey

**Success Criteria**:
- ✅ Briefing includes "WEF 2030 Skills Framework" section
- ✅ Top 3 skills listed with demonstration counts
- ✅ Contexts from skill_summaries table referenced
- ✅ Birmingham career connections included
- ✅ Evidence-based language (no scores)
- ✅ Briefing narrative flows naturally (skills integrated, not appended)

**Expected Duration**: 7-10 minutes

---

### Test 6: End-to-End Flow

**Objective**: Verify complete data flow from choice → dashboard → briefing → Samuel dialogue.

#### Complete User Journey

1. **Choice Made** (User Action)
   ```
   User selects: "Parents' dreams aren't your obligations"
   ```

2. **Skills Tagged** (useSimpleGame.ts)
   ```javascript
   // Scene mapping detects:
   skills: ["emotionalIntelligence", "culturalCompetence", "communication", "criticalThinking"]
   ```

3. **PlayerPersona Updated** (player-persona.ts)
   ```javascript
   PlayerPersonaTracker.addSkillDemonstration(
     playerId,
     skills,
     context,  // Rich 100-150 word context
     sceneId
   )
   // Updates: skillDemonstrations, recentSkills, topSkills
   ```

4. **localStorage Saved** (Immediate)
   ```javascript
   // Key: lux-story-player-personas
   // Synchronous write, zero data loss risk
   ```

5. **Supabase Sync Queued** (3rd demonstration)
   ```javascript
   // If emotionalIntelligence count % 3 === 0:
   queueSkillSummarySync({
     user_id,
     skill_name: "emotionalIntelligence",
     demonstration_count: 3,
     latest_context,  // Full rich context
     scenes_involved: ["maya_family_pressure", "devon_father_reveal", "jordan_impostor_reveal"]
   })
   ```

6. **SyncQueue Processes** (Background or manual)
   ```javascript
   SyncQueue.processQueue()
   // POSTs to /api/user/skill-summaries
   // Upserts to Supabase skill_summaries table
   ```

7. **Admin Views Dashboard** (Counselor)
   ```
   - Selects student
   - Clicks "2030 Skills" tab
   - GETs /api/user/skill-summaries?userId=X
   - Sees top 5 skills with contexts
   ```

8. **Counselor Generates Briefing**
   ```
   - Clicks "Generate Advisor Briefing"
   - Briefing includes WEF 2030 Skills section
   - References specific demonstration contexts
   - Shows Birmingham career connections
   ```

9. **Samuel Reflects Player's Growth** (Next session)
   ```
   - Player reaches Samuel node
   - POSTs to /api/samuel-dialogue with PlayerPersona
   - Samuel: "I've watched how you help people see bridges..."
   - Implicitly reflects demonstrated skills
   ```

**Full Flow Verification Steps**:

1. Start fresh (clear localStorage)
2. Make 5 choices across Maya/Devon/Jordan arcs
3. Verify localStorage updates after each choice
4. On 3rd demonstration of a skill, verify SyncQueue action created
5. Manually process queue: `SyncQueue.processQueue()`
6. Verify Supabase data appears
7. Open admin dashboard, view skills tab
8. Generate briefing, verify skills section
9. Continue journey to Samuel node
10. Verify Samuel dialogue reflects patterns

**Success Criteria**:
- ✅ Every step completes without errors
- ✅ Data flows through entire pipeline
- ✅ localStorage → Supabase sync works
- ✅ Admin dashboard reflects accurate data
- ✅ AI briefing integrates skills evidence
- ✅ Samuel dialogue is skill-aware
- ✅ No data loss at any stage

**Expected Duration**: 20-30 minutes

---

## Edge Case Testing

### Edge Case 1: No Skills Data

**Scenario**: New user with zero choices made.

#### Test Steps

1. Clear all data: `localStorage.clear()`
2. Start journey but don't make any choices
3. Navigate to admin dashboard → Select new user
4. Click "2030 Skills" tab

**Expected Behavior**:
- Empty state message: "No skill demonstrations yet"
- NO errors or crashes
- Dashboard remains functional

5. Generate AI Briefing

**Expected Behavior**:
- Briefing generates successfully
- NO "WEF 2030 Skills Framework" section (or shows "Not enough data")
- Briefing focuses on behavioral patterns instead
- NO errors or crashes

6. Reach Samuel node

**Expected Behavior**:
- Samuel uses fallback dialogue:
  ```
  "Every traveler starts somewhere. Take your time exploring the platforms.
   The right path reveals itself through experience, not overthinking."
  ```
- API returns note: `"Generic dialogue - no skill demonstrations yet"`

**Success Criteria**:
- ✅ All systems handle empty state gracefully
- ✅ No errors or infinite loading states
- ✅ Fallback content provides value
- ✅ User experience remains smooth

---

### Edge Case 2: Offline Sync

**Scenario**: User makes choices while offline, then comes back online.

#### Test Steps

1. **Go Offline**:
   ```javascript
   // Chrome DevTools → Network → Offline
   ```

2. **Make Choices Offline**:
   - Make 5-7 choices across different scenes
   - Verify choices are recorded in localStorage

3. **Verify SyncQueue Accumulation**:
   ```javascript
   const queue = JSON.parse(localStorage.getItem('lux-sync-queue'))
   console.log(queue.length)  // Should have multiple actions
   ```

4. **Go Online**:
   ```javascript
   // Chrome DevTools → Network → Online
   ```

5. **Process Queue**:
   ```javascript
   const result = await SyncQueue.processQueue()
   console.log(result)
   // Expected: { success: true, processed: N, failed: 0 }
   ```

6. **Verify Supabase Consistency**:
   ```sql
   SELECT * FROM skill_summaries WHERE user_id = 'test-user-week2';
   -- Should show all skills from offline session
   ```

**Success Criteria**:
- ✅ Choices cached in localStorage while offline
- ✅ SyncQueue accumulates pending actions
- ✅ Queue processes successfully when online
- ✅ Supabase eventually consistent
- ✅ NO data loss

---

### Edge Case 3: Skills API Failure

**Scenario**: Supabase temporarily unavailable or API returns error.

#### Test Steps

1. **Simulate API Failure**:
   ```javascript
   // Temporarily rename SUPABASE_SERVICE_ROLE_KEY in .env.local
   // Or block requests to *.supabase.co in DevTools
   ```

2. **Make Choices**:
   - Skills still tracked in localStorage
   - SyncQueue accumulates actions

3. **View Admin Dashboard**:
   - Navigate to Skills tab
   - API call fails (Network error)

**Expected Behavior**:
- Error message: "Failed to load skill summaries. Please try again."
- NO crash or infinite loading
- Other dashboard tabs remain functional

4. **Generate AI Briefing**:

**Expected Behavior**:
- Briefing generates
- Falls back to localStorage data
- Skills section may be minimal or absent
- Briefing still provides value through behavioral patterns

5. **Restore API Access**:
   ```javascript
   // Restore SUPABASE_SERVICE_ROLE_KEY
   // Or unblock requests
   ```

6. **Process Queue**:
   ```javascript
   await SyncQueue.processQueue()
   // Queue processes, Supabase syncs
   ```

**Success Criteria**:
- ✅ Admin dashboard handles errors gracefully
- ✅ Error messages are clear and actionable
- ✅ NO crashes or blank screens
- ✅ Briefing falls back to alternative data sources
- ✅ System recovers when API restored

---

## Test Data Setup

### Sample Test User Profiles

```javascript
const testProfiles = [
  {
    userId: 'test-helper',
    description: 'Helper archetype - high empathy, communication, cultural competence',
    skills: ['emotionalIntelligence', 'communication', 'culturalCompetence', 'collaboration'],
    demonstrationCounts: [7, 6, 4, 3],
    expectedCareerPaths: ['Healthcare', 'Education', 'Social Work'],
    testChoices: [
      { scene: 'maya_family_pressure', choice: 'family_understanding' },
      { scene: 'devon_father_reveal', choice: 'express_sympathy' },
      { scene: 'jordan_impostor_reveal', choice: 'jordan_impostor_affirm' },
      { scene: 'maya_robotics_passion', choice: 'robotics_encourage' },
      { scene: 'devon_system_failure', choice: 'validate_pain' },
      { scene: 'samuel_teaching_witnessing', choice: 'understand_witnessing' },
      { scene: 'jordan_mentor_context', choice: 'jordan_mentor_ask_fear' }
    ]
  },

  {
    userId: 'test-analyzer',
    description: 'Analyzer archetype - high critical thinking, problem-solving, systems thinking',
    skills: ['criticalThinking', 'problemSolving', 'digitalLiteracy', 'communication'],
    demonstrationCounts: [8, 5, 4, 3],
    expectedCareerPaths: ['Technology', 'Engineering', 'Data Analytics'],
    testChoices: [
      { scene: 'devon_uab_systems_engineering', choice: 'connect_to_dad' },
      { scene: 'jordan_mentor_context', choice: 'jordan_mentor_challenge_frame' },
      { scene: 'maya_uab_revelation', choice: 'uab_encourage_research' },
      { scene: 'devon_system_failure', choice: 'analyze_failure' },
      { scene: 'jordan_impostor_reveal', choice: 'jordan_impostor_reframe' },
      { scene: 'samuel_reflects_devon', choice: 'systems_insight' },
      { scene: 'devon_father_aerospace', choice: 'comment_on_similarity' },
      { scene: 'jordan_job_reveal_2', choice: 'jordan_job2_connect_ux' }
    ]
  },

  {
    userId: 'test-explorer',
    description: 'Explorer archetype - high creativity, adaptability, continuous learning',
    skills: ['creativity', 'adaptability', 'problemSolving', 'leadership'],
    demonstrationCounts: [6, 5, 4, 3],
    expectedCareerPaths: ['Creative Industries', 'Entrepreneurship', 'UX Design'],
    testChoices: [
      { scene: 'maya_robotics_passion', choice: 'robotics_birmingham' },
      { scene: 'jordan_crossroads', choice: 'jordan_crossroads_birmingham' },
      { scene: 'devon_crossroads', choice: 'crossroads_integrated' },
      { scene: 'jordan_job_reveal_5', choice: 'jordan_job5_pattern_thread' },
      { scene: 'maya_crossroads', choice: 'crossroads_hybrid' },
      { scene: 'jordan_job_reveal_6', choice: 'jordan_job6_pattern_systems' }
    ]
  }
]
```

### Profile Generation Script

```javascript
// scripts/generate-test-profiles.js
async function generateTestProfile(profile) {
  console.log(`Generating profile: ${profile.userId}`)

  // 1. Clear existing data
  localStorage.removeItem(`skill_tracker_${profile.userId}`)
  localStorage.removeItem('lux-story-player-personas')

  // 2. Make choices in order
  for (const choice of profile.testChoices) {
    // Simulate choice selection
    await makeChoice(choice.scene, choice.choice)
    console.log(`  ✓ ${choice.scene} → ${choice.choice}`)
  }

  // 3. Process sync queue
  const result = await SyncQueue.processQueue()
  console.log(`  ✓ Synced ${result.processed} actions to Supabase`)

  // 4. Verify profile
  const persona = PlayerPersonaTracker.getPersona(profile.userId)
  console.log(`  ✓ Top skills: ${persona.topSkills.map(s => s.skill).join(', ')}`)

  console.log(`✅ Profile ${profile.userId} ready for testing`)
}
```

---

## Manual Testing Checklist

### Week 2 Complete Integration Test

- [ ] **Test 1**: Skills tagging flow (localStorage update)
- [ ] **Test 2**: Skill summary sync (Supabase)
- [ ] **Test 3**: Samuel dialogue generation (API)
- [ ] **Test 4**: Admin dashboard Skills tab (UI)
- [ ] **Test 5**: AI Briefing enhancement (Generation)
- [ ] **Test 6**: End-to-end flow (Complete pipeline)

### Edge Cases

- [ ] **Edge Case 1**: No skills data (empty state)
- [ ] **Edge Case 2**: Offline sync (queue processing)
- [ ] **Edge Case 3**: API failure (error handling)

### Additional Verification

- [ ] All API routes respond within 2 seconds
- [ ] No console errors in any test scenario
- [ ] Mobile responsive testing (admin dashboard)
- [ ] Browser compatibility (Chrome, Firefox, Safari)

---

## Performance Benchmarks

| Operation | Expected Time | Actual Time | Status |
|-----------|---------------|-------------|--------|
| Choice skill tagging | < 50ms | | |
| PlayerPersona update | < 100ms | | |
| localStorage save | < 50ms | | |
| SyncQueue processing (1 action) | < 500ms | | |
| Samuel dialogue API | 1000-1400ms | | |
| Admin dashboard load | < 2s | | |
| AI Briefing generation | 5-10s | | |

---

## Known Limitations

1. **Samuel Dialogue Generation**:
   - Requires GEMINI_API_KEY
   - Rate limited (15 req/min free tier)
   - Fallback dialogue if generation fails

2. **Skills Tab Visualization**:
   - Requires data in skill_summaries table
   - Shows only top 5 skills (design constraint)

3. **Offline Sync**:
   - Requires manual queue processing or background job
   - Max 500 actions in queue before dropping oldest

4. **Context Length**:
   - Rich contexts are 100-150 words
   - May truncate if localStorage near quota

---

## Troubleshooting Guide

### Issue: Skills not appearing in dashboard

**Diagnosis**:
```javascript
// 1. Check localStorage
const personas = JSON.parse(localStorage.getItem('lux-story-player-personas'))
console.log(personas)  // Should show skills

// 2. Check sync queue
const queue = JSON.parse(localStorage.getItem('lux-sync-queue'))
console.log(queue.length)  // Should have actions

// 3. Check Supabase
// Run SQL: SELECT * FROM skill_summaries WHERE user_id = 'test-user';
```

**Solution**:
- If localStorage empty: Choice tagging failed (check scene-skill-mappings.ts)
- If queue has actions: Run `SyncQueue.processQueue()`
- If Supabase empty: Check API route and environment variables

### Issue: Samuel dialogue is generic

**Diagnosis**:
```javascript
// Check if PlayerPersona has skill data
const persona = PlayerPersonaTracker.getPersona(userId)
console.log(persona.topSkills)
```

**Solution**:
- If topSkills empty: Make more choices with skill tags
- If API call fails: Check GEMINI_API_KEY in .env.local
- If response is generic: Check API response includes note field

### Issue: Briefing missing skills section

**Diagnosis**:
- Check if user has 3+ skill demonstrations
- Check if Supabase has data for user

**Solution**:
- Make more choices (need minimum 3 demonstrations)
- Verify SyncQueue processed successfully

---

## Regression Testing

After any code changes to Week 2 systems, re-run:

1. Test 1 (Skills tagging)
2. Test 2 (Supabase sync)
3. Test 6 (End-to-end flow)

**Regression test duration**: 10-15 minutes

---

## Success Metrics

Week 2 implementation is production-ready when:

- ✅ All 6 integration tests pass
- ✅ All 3 edge cases handled gracefully
- ✅ Performance benchmarks met
- ✅ Zero console errors during testing
- ✅ Complete end-to-end data flow verified
- ✅ Documentation complete and accurate

---

**Last Updated**: January 2025
**Test Environment**: Next.js 15, Supabase, Gemini 1.5 Flash
**Estimated Total Testing Time**: 60-90 minutes
