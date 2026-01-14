# Session Boundaries System - Implementation Plan

**Date:** December 14, 2024
**Status:** READY TO IMPLEMENT
**Time Estimate:** 20 hours (2.5 days)
**Roadmap:** Month 1 Week 3

---

## Executive Summary

**Session Boundaries** create natural pause points in Lux Story every 8-12 nodes, optimized for mobile play sessions. When players reach a boundary, they see an atmospheric **platform announcement** (like a train station PA system), the game auto-saves, and they have a clear moment to pause or continue.

**Key Innovation:** Mobile-friendly sessions WITHOUT interrupting narrative flow. Platform announcements reinforce the train station atmosphere while providing functional session management.

---

## Problem Statement

**Current State:**
- Players can play indefinitely (no natural pause points)
- Mobile sessions often interrupted mid-conversation (feels jarring)
- No indication of "good stopping points"
- Auto-save only on manual exit

**Player Pain Points:**
- "I was in the middle of a conversation when I had to close the app"
- "I don't know how long this character arc is"
- "I lost progress because I closed the browser tab"

**Design Goal:**
Create 10-15 minute natural sessions that feel like story chapters, not arbitrary interruptions.

---

## What We're Building

### 1. Session Structure Module (`lib/session-structure.ts`) - NEW FILE

**Purpose:** Define where session boundaries occur and generate platform announcements

**Key Types:**
```typescript
export interface SessionBoundary {
  nodeId: string              // e.g., 'samuel_intro_10'
  sessionNumber: number       // 1, 2, 3, etc.
  characterId: string         // 'samuel', 'maya', etc.
  platformAnnouncement: string // "The 7:15 to Crossroads Station..."
  savePrompt: boolean         // Always true (auto-save on boundary)
  estimatedDuration: number   // Minutes since last boundary
}

export interface SessionMetrics {
  totalSessions: number
  avgSessionDuration: number  // minutes
  boundariesCrossed: number
  lastBoundaryNode: string
  sessionStartTime: number
}
```

**Key Functions:**
```typescript
// Identify all session boundaries for a character
export function getSessionBoundaries(characterId: string): SessionBoundary[]

// Get boundary for specific node (if it exists)
export function getBoundaryForNode(nodeId: string): SessionBoundary | null

// Generate platform announcement based on session number and character context
export function generatePlatformAnnouncement(
  sessionNumber: number,
  characterId: string,
  nodeContext?: string
): string

// Check if current node is a session boundary
export function isSessionBoundary(nodeId: string): boolean

// Calculate session metrics for analytics
export function calculateSessionMetrics(gameState: GameState): SessionMetrics
```

---

### 2. Platform Announcement Library (21 Announcements)

**Categories:**

**Time-Based (7 announcements):**
- "The 7:15 to Crossroads Station will depart shortly."
- "The 9:30 Express to Future Build Terminal is now boarding."
- "Final call for the 10:45 to Insight Avenue. All passengers, please board now."
- "The 2:20 Local to Reflection Platform departs in five minutes."
- "The 4:15 to Decision Point is arriving on Platform 2."
- "The 6:00 Northbound to Challenge Terminal is now boarding."
- "The 8:30 to Discovery Junction will depart from Platform 5."

**Weather/Atmospheric (7 announcements):**
- "Fog advisories in effect for Platform 3. Please watch your step."
- "Attention travelers: Light rain on the eastern platforms. Cover available under the archway."
- "Clear skies reported for all outbound routes this evening."
- "Storm warnings for the midnight express. Delays possible."
- "Frost on Platform 6. Use caution when boarding."
- "Unseasonably warm. All platform fans have been activated."
- "Mist clearing from the southern tracks. Visibility improving."

**Poetic/Philosophical (7 announcements):**
- "All paths lead somewhere. Not all somewheres lead home."
- "The train you missed might be the one you needed to catch."
- "Between departure and arrival lies the journey. Between who you were and who you'll be lies this moment."
- "Some passengers wait. Some wander. Some wonder. All are welcome."
- "The platform holds space for the uncertain. Take your time."
- "Every ending is a station. Every station is a beginning."
- "You cannot board the same train twice. The train changes. You change. The platform remains."

**Implementation:**
```typescript
// lib/platform-announcements.ts
export const platformAnnouncements = {
  timeBased: [
    "The 7:15 to Crossroads Station will depart shortly.",
    // ... 6 more
  ],
  atmospheric: [
    "Fog advisories in effect for Platform 3. Please watch your step.",
    // ... 6 more
  ],
  philosophical: [
    "All paths lead somewhere. Not all somewheres lead home.",
    // ... 6 more
  ]
}

export function selectAnnouncement(
  sessionNumber: number,
  characterContext?: string
): string {
  // Early sessions (1-2): Time-based (orienting, functional)
  if (sessionNumber <= 2) {
    return randomChoice(platformAnnouncements.timeBased)
  }

  // Mid sessions (3-4): Atmospheric (world-building)
  if (sessionNumber <= 4) {
    return randomChoice(platformAnnouncements.atmospheric)
  }

  // Later sessions (5+): Philosophical (reflective, thematic)
  return randomChoice(platformAnnouncements.philosophical)
}
```

---

### 3. Boundary Node Marking (All 11 Characters)

**Strategy:** Mark every 10th node as a session boundary

**Example: Samuel's Dialogue Graph**
```typescript
// samuel-dialogue-graph.ts

// Node 10: End of Introduction
{
  nodeId: 'samuel_intro_10',
  speaker: 'Samuel Washington',
  content: [{
    text: "Well. Seems like you're startin' to find your way around here.",
    emotion: 'warm'
  }],
  choices: [
    {
      text: '"Thank you for talking with me."',
      nextNodeId: 'samuel_intro_11',
      pattern: 'patience',
      trustChange: 1
    }
  ],
  metadata: {
    sessionBoundary: true,
    sessionNumber: 1,
    platformAnnouncement: "The 7:15 to Crossroads Station will depart shortly.",
    actEnd: 'introduction'
  }
},

// Node 20: End of Crossroads
{
  nodeId: 'samuel_crossroads_10',
  speaker: 'Samuel Washington',
  content: [{
    text: "Lot to think about, I know. That's alright. Station'll be here when you're ready.",
    emotion: 'patient'
  }],
  choices: [
    {
      text: '"I'll come back soon."',
      nextNodeId: 'samuel_crossroads_11',
      pattern: 'patience'
    }
  ],
  metadata: {
    sessionBoundary: true,
    sessionNumber: 2,
    platformAnnouncement: "The 9:30 Express to Future Build Terminal is now boarding.",
    actEnd: 'crossroads'
  }
},

// Node 30: End of Challenge
{
  nodeId: 'samuel_challenge_10',
  speaker: 'Samuel Washington',
  content: [{
    text: "You've been carryin' somethin' heavy. Maybe it's time to set it down for a bit.",
    emotion: 'gentle'
  }],
  choices: [
    {
      text: '"Maybe you\'re right."',
      nextNodeId: 'samuel_challenge_11',
      pattern: 'patience'
    }
  ],
  metadata: {
    sessionBoundary: true,
    sessionNumber: 3,
    platformAnnouncement: "Final call for the 10:45 to Insight Avenue. All passengers, please board now.",
    actEnd: 'challenge'
  }
}
```

**Characters to Mark:**
- Samuel: Nodes 10, 20, 30 (already has 270+ nodes, may have more boundaries)
- Maya: Nodes 10, 20, 30, 35 (4 boundaries)
- Devon: Nodes 10, 20, 30, 35 (4 boundaries)
- Marcus: Nodes 10, 20, 25 (3 boundaries - shorter arc currently)
- Rohan: Nodes 10, 20 (2 boundaries - shorter arc)
- Yaquin: Nodes 10, 20 (2 boundaries)
- Jordan: Nodes 10, 15 (2 boundaries)
- Kai: Nodes 10 (1 boundary - very short arc currently)
- Lira: Nodes 10 (1 boundary)
- Asha: Nodes 10 (1 boundary)
- Zara: Nodes 10 (1 boundary)

**Total Boundaries to Mark:** ~25-30 across all characters

---

### 4. UI Component: Platform Announcement Display

**Component:** `components/PlatformAnnouncement.tsx` - NEW FILE

**Design:**
```typescript
import { motion } from 'framer-motion'

interface PlatformAnnouncementProps {
  announcement: string
  sessionNumber: number
  onContinue: () => void
  onPause: () => void
}

export function PlatformAnnouncement({
  announcement,
  sessionNumber,
  onContinue,
  onPause
}: PlatformAnnouncementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="my-6 border-l-4 border-primary bg-muted/30 p-6 rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Session {sessionNumber} Complete
        </span>
      </div>

      {/* Platform Announcement */}
      <p className="text-sm italic text-foreground/80 mb-4 font-serif">
        {announcement}
      </p>

      {/* Metadata */}
      <div className="text-xs text-muted-foreground mb-4">
        Progress saved automatically
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onContinue}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Continue Journey
        </button>
        <button
          onClick={onPause}
          className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
        >
          Take a Break
        </button>
      </div>
    </motion.div>
  )
}
```

**Visual Design:**
- Subtle, not intrusive
- Train station aesthetic (border-left accent = platform edge)
- Pulsing indicator (train arriving)
- Font: Serif for announcement (official, vintage train schedule feel)
- Auto-save confirmation (reduces anxiety)

---

### 5. Auto-Save Integration

**Location:** `components/StatefulGameInterface.tsx`

**Current Save Logic:**
```typescript
// Saves on every choice currently
useEffect(() => {
  saveGameState(gameState)
}, [gameState])
```

**Enhanced Save Logic:**
```typescript
useEffect(() => {
  const currentNode = getCurrentNode()

  // Always save on session boundaries
  if (currentNode.metadata?.sessionBoundary) {
    saveGameState(gameState)

    // Track session boundary for analytics
    trackSessionBoundary({
      nodeId: currentNode.nodeId,
      characterId: gameState.currentCharacterId,
      sessionNumber: currentNode.metadata.sessionNumber,
      sessionDuration: Date.now() - gameState.sessionStartTime
    })

    // Show platform announcement UI
    setShowPlatformAnnouncement(true)
  }

  // Regular save (debounced to avoid performance issues)
  else {
    debouncedSave(gameState)
  }
}, [gameState.currentNodeId])
```

**Session Start Time Tracking:**
```typescript
// When player starts a new session (crosses boundary or starts game)
if (currentNode.metadata?.sessionBoundary || gameState.currentNodeId === 'game_start') {
  newGameState.sessionStartTime = Date.now()
}
```

---

### 6. Analytics Integration (PostHog)

**Track Session Boundaries:**
```typescript
// lib/analytics.ts

export function trackSessionBoundary(data: {
  nodeId: string
  characterId: string
  sessionNumber: number
  sessionDuration: number
}) {
  posthog.capture('session_boundary_reached', {
    node_id: data.nodeId,
    character_id: data.characterId,
    session_number: data.sessionNumber,
    session_duration_minutes: Math.round(data.sessionDuration / 60000),
    timestamp: Date.now()
  })
}

export function trackSessionAction(action: 'continue' | 'pause') {
  posthog.capture('session_boundary_action', {
    action,
    timestamp: Date.now()
  })
}
```

**Key Metrics to Track:**
- Avg session duration (target: 10-15 min)
- % of players who continue vs pause at boundaries
- Drop-off rate at each session number
- Which characters have highest session completion

---

## Implementation Checklist

### Phase 1: Core Infrastructure (6 hours)

**1. Create Session Structure Module** (2 hours)
- [ ] Create `lib/session-structure.ts`
- [ ] Define interfaces (SessionBoundary, SessionMetrics)
- [ ] Implement `getSessionBoundaries()`
- [ ] Implement `isSessionBoundary()`
- [ ] Implement `getBoundaryForNode()`
- [ ] Write unit tests

**2. Platform Announcements** (2 hours)
- [ ] Create `lib/platform-announcements.ts`
- [ ] Write 21 announcements (7 per category)
- [ ] Implement `selectAnnouncement()` with session-based logic
- [ ] Test announcement variety (ensure no repeats in same playthrough)

**3. Session Metrics** (2 hours)
- [ ] Implement `calculateSessionMetrics()`
- [ ] Add `sessionStartTime` to GameState type
- [ ] Add `sessionMetrics` to GameState type
- [ ] Update save/load to include session data

---

### Phase 2: Character Dialogue Marking (6 hours)

**Mark Boundary Nodes:**
- [ ] Samuel: Review existing 270 nodes, mark every 10th (27 boundaries?)
- [ ] Maya: Nodes 10, 20, 30, 35 (4 boundaries)
- [ ] Devon: Nodes 10, 20, 30, 35 (4 boundaries)
- [ ] Marcus: Nodes 10, 20, 25 (3 boundaries)
- [ ] Rohan: Nodes 10, 20 (2 boundaries)
- [ ] Yaquin: Nodes 10, 20 (2 boundaries)
- [ ] Jordan: Nodes 10, 15 (2 boundaries)
- [ ] Kai: Node 10 (1 boundary)
- [ ] Lira: Node 10 (1 boundary)
- [ ] Asha: Node 10 (1 boundary)
- [ ] Zara: Node 10 (1 boundary)

**For Each Boundary:**
```typescript
metadata: {
  sessionBoundary: true,
  sessionNumber: X,
  platformAnnouncement: selectAnnouncement(X),
  actEnd: 'introduction' | 'crossroads' | 'challenge' | 'insight'
}
```

---

### Phase 3: UI Components (4 hours)

**1. Platform Announcement Component** (2 hours)
- [ ] Create `components/PlatformAnnouncement.tsx`
- [ ] Design UI (border-left, pulsing indicator, serif font)
- [ ] Add Framer Motion animations (fade in/out)
- [ ] Implement Continue/Pause buttons
- [ ] Test responsive design (mobile + desktop)

**2. Integration into Game Interface** (2 hours)
- [ ] Add state: `showPlatformAnnouncement` to StatefulGameInterface
- [ ] Detect session boundary in useEffect
- [ ] Show PlatformAnnouncement when boundary reached
- [ ] Handle "Continue" → Hide announcement, proceed to next node
- [ ] Handle "Pause" → Save game, return to character select or main menu

---

### Phase 4: Auto-Save & Analytics (2 hours)

**1. Auto-Save Enhancement** (1 hour)
- [ ] Implement debounced save for non-boundary nodes
- [ ] Explicit save on session boundaries
- [ ] Update session start time on boundary cross
- [ ] Test save/load persistence

**2. Analytics Integration** (1 hour)
- [ ] Implement `trackSessionBoundary()`
- [ ] Implement `trackSessionAction()`
- [ ] Test PostHog events firing
- [ ] Verify data in PostHog dashboard

---

### Phase 5: Testing & Polish (2 hours)

**1. Manual Testing** (1 hour)
- [ ] Play through Maya arc, reach node 10 boundary
- [ ] Verify platform announcement appears
- [ ] Click "Continue" → Should proceed to node 11
- [ ] Restart, reach node 10 again, click "Pause" → Should save and exit
- [ ] Test on mobile (iPhone, Samsung)
- [ ] Verify auto-save works (close browser, reopen, should resume)

**2. Edge Cases** (30 min)
- [ ] What if player rapidly clicks through nodes? (Don't skip boundary)
- [ ] What if player closes app mid-announcement? (Should save before showing)
- [ ] What if localStorage is full? (Handle gracefully)

**3. Polish** (30 min)
- [ ] Announcement text variety (no repeats)
- [ ] Animation timing (not too slow, not too fast)
- [ ] Mobile touch targets (buttons ≥44px)
- [ ] Accessibility (keyboard navigation, screen reader)

---

## Technical Architecture

### Data Flow

```
Player reaches node 10 (boundary)
         ▼
StatefulGameInterface detects: currentNode.metadata?.sessionBoundary === true
         ▼
1. Auto-save game state
2. Track session boundary event (PostHog)
3. Calculate session duration
4. Update session metrics in GameState
5. Select platform announcement
         ▼
Show PlatformAnnouncement UI
         ▼
Player clicks "Continue"        OR        Player clicks "Pause"
         ▼                                        ▼
Hide announcement                         Save game
Proceed to next node                      Return to character select
Reset session start time                  Track "pause" event
```

---

### State Structure

**Enhanced GameState:**
```typescript
export interface GameState {
  // ... existing fields

  // NEW: Session tracking
  sessionStartTime: number        // Timestamp when current session started
  sessionMetrics: {
    totalSessions: number         // How many boundaries crossed
    avgSessionDuration: number    // Average minutes per session
    lastBoundaryNode: string      // Last boundary node ID
    boundariesCrossed: string[]   // Array of all boundary node IDs
  }
}
```

**Boundary Metadata:**
```typescript
export interface DialogueNodeMetadata {
  sessionBoundary?: boolean
  sessionNumber?: number
  platformAnnouncement?: string
  actEnd?: 'introduction' | 'crossroads' | 'challenge' | 'insight'

  // Existing fields
  requiresTrust?: number
  requiresPattern?: { pattern: PatternType; level: number }
}
```

---

## Design Philosophy

### Why Every 10 Nodes?

**Math:**
- Avg dialogue: 1-2 min per node (reading + choice)
- 10 nodes = 10-20 min (ideal mobile session)
- Aligns with act structure (Introduction = nodes 1-10, Crossroads = 11-20, etc.)

**Player Psychology:**
- Too frequent (every 5 nodes): Disruptive, feels nagging
- Too rare (every 20 nodes): Sessions too long for mobile, high drop-off risk
- 10 nodes: Just right (Goldilocks zone)

**Comparison to Other Games:**
- Disco Elysium: No explicit session boundaries (PC-first)
- Florence: ~5 min chapters (similar to our goal)
- 80 Days: Day-based structure (each day = natural session)

---

### Why Platform Announcements?

**Functional Benefits:**
- Clear signal: "This is a pause point"
- Reduces anxiety: "Progress saved"
- Orients player: "Session 2 complete"

**Narrative Benefits:**
- Reinforces train station atmosphere
- Worldbuilding without exposition
- Poetic/philosophical announcements deepen themes
- Creates memorable moments ("All paths lead somewhere...")

**Alternatives Considered:**
- ❌ "Chapter Complete" screen → Too game-y, breaks immersion
- ❌ Silent auto-save → Player doesn't know it's a pause point
- ✅ Platform announcements → Functional + atmospheric

---

### Mobile-First Considerations

**Touch Targets:**
- Buttons: Min 44px height (iOS guideline)
- Spacing: 8px between Continue/Pause buttons
- Thumb-reachable: Bottom of screen or centered

**Loading States:**
- Skeleton UI while announcement loads
- Optimistic UI: Assume save succeeds, show confirmation immediately

**Offline Support:**
- Platform announcements stored locally (no API call)
- Auto-save to localStorage (works offline)
- Sync to cloud when online (future: Supabase integration)

---

## Success Metrics

### Week 3 Goals

**Functional:**
- ✅ Session boundaries trigger at every 10th node
- ✅ Platform announcements display correctly
- ✅ Auto-save works on all boundaries
- ✅ No TypeScript errors
- ✅ Build successful
- ✅ Mobile-tested (iPhone, Samsung)

**Analytics Setup:**
- ✅ PostHog events firing for session boundaries
- ✅ Session duration tracked accurately
- ✅ Continue/Pause actions logged

---

### Future Validation (User Testing)

**After Urban Chamber Pilot:**
- Avg session duration: 10-15 min (target)
- % who pause at boundaries: 30-50% (healthy)
- % who continue at boundaries: 50-70% (engaged)
- Session completion rate: 80%+ (most players reach at least session 2)

**Red Flags:**
- Avg session <5 min → Boundaries too frequent OR content not engaging
- Avg session >25 min → Boundaries too rare OR players ignoring them
- <30% reach session 2 → Drop-off too high, need better onboarding

---

## Files to Create/Modify

### New Files (3)

1. **`lib/session-structure.ts`** (~150 lines)
   - Session boundary logic
   - Metrics calculation
   - Boundary detection utilities

2. **`lib/platform-announcements.ts`** (~80 lines)
   - 21 platform announcements
   - Selection algorithm
   - Randomization with no repeats

3. **`components/PlatformAnnouncement.tsx`** (~100 lines)
   - UI component
   - Framer Motion animations
   - Continue/Pause handlers

---

### Modified Files (12+)

4. **`content/samuel-dialogue-graph.ts`**
   - Mark ~27 boundary nodes with metadata
   - Add platform announcements

5. **`content/maya-dialogue-graph.ts`**
   - Mark 4 boundaries (nodes 10, 20, 30, 35)

6. **`content/devon-dialogue-graph.ts`**
   - Mark 4 boundaries

7. **`content/marcus-dialogue-graph.ts`**
   - Mark 3 boundaries (nodes 10, 20, 25)

8. **`content/rohan-dialogue-graph.ts`**
   - Mark 2 boundaries

9. **`content/yaquin-dialogue-graph.ts`**
   - Mark 2 boundaries

10. **`content/jordan-dialogue-graph.ts`**
    - Mark 2 boundaries

11. **`content/kai-dialogue-graph.ts`**
    - Mark 1 boundary

12. **`content/lira-dialogue-graph.ts`**
    - Mark 1 boundary

13. **`content/asha-dialogue-graph.ts`**
    - Mark 1 boundary

14. **`content/zara-dialogue-graph.ts`**
    - Mark 1 boundary

15. **`components/StatefulGameInterface.tsx`**
    - Import session utilities
    - Detect boundaries in useEffect
    - Show PlatformAnnouncement component
    - Handle Continue/Pause actions
    - Update session metrics

16. **`lib/character-state.ts`**
    - Add `sessionStartTime` to GameState
    - Add `sessionMetrics` to GameState

17. **`lib/analytics.ts`**
    - Add `trackSessionBoundary()`
    - Add `trackSessionAction()`

---

## Testing Checklist

### Unit Tests

```typescript
// lib/__tests__/session-structure.test.ts
describe('Session Structure', () => {
  it('identifies session boundaries correctly', () => {
    expect(isSessionBoundary('maya_intro_10')).toBe(true)
    expect(isSessionBoundary('maya_intro_5')).toBe(false)
  })

  it('returns correct boundary data', () => {
    const boundary = getBoundaryForNode('maya_intro_10')
    expect(boundary?.sessionNumber).toBe(1)
    expect(boundary?.platformAnnouncement).toBeTruthy()
  })

  it('calculates session metrics', () => {
    const gameState = createMockGameState({
      sessionMetrics: {
        boundariesCrossed: ['maya_intro_10', 'maya_crossroads_10']
      }
    })
    const metrics = calculateSessionMetrics(gameState)
    expect(metrics.totalSessions).toBe(2)
  })
})
```

---

### Integration Tests (Playwright)

```typescript
// tests/e2e/session-boundaries.spec.ts
import { test, expect } from '@playwright/test'

test('platform announcement appears at session boundary', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start Journey')

  // Make choices until reaching node 10
  for (let i = 0; i < 10; i++) {
    await page.click('[data-testid="dialogue-choice"]:first-child')
    await page.waitForTimeout(500)
  }

  // Verify platform announcement appears
  await expect(page.locator('text=/Session.*Complete/i')).toBeVisible()
  await expect(page.locator('text=/The.*to.*Station/i')).toBeVisible()
})

test('continue button proceeds to next node', async ({ page }) => {
  // ... reach boundary
  await page.click('text=Continue Journey')

  // Verify we're at node 11 (next node after boundary)
  await expect(page.locator('[data-node-id="maya_intro_11"]')).toBeVisible()
})

test('pause button saves and exits', async ({ page }) => {
  // ... reach boundary
  await page.click('text=Take a Break')

  // Verify we're back at character select
  await expect(page.locator('text=Choose a Character')).toBeVisible()

  // Verify progress saved (reload and check)
  await page.reload()
  const savedState = await page.evaluate(() => localStorage.getItem('lux-story-game-state'))
  expect(savedState).toBeTruthy()
})
```

---

### Manual Testing Flow

**Test Case 1: Happy Path (Continue)**
1. Start new game (clear localStorage)
2. Talk to Maya
3. Make 10 choices to reach node 10
4. Verify platform announcement appears
5. Click "Continue Journey"
6. Verify node 11 appears
7. Continue playing → reach node 20
8. Verify second announcement (different from first)

**Test Case 2: Pause Path**
1. Start new game
2. Reach node 10 boundary
3. Click "Take a Break"
4. Verify returned to character select
5. Select Maya again
6. Verify resume from node 11 (not node 1)

**Test Case 3: Mobile (iPhone)**
1. Open game on iPhone Safari
2. Play through to boundary
3. Verify announcement is readable (no text cutoff)
4. Verify buttons are tap-friendly (≥44px)
5. Close app mid-session
6. Reopen → verify resume from last node

---

## Edge Cases & Error Handling

### Edge Case 1: Rapid Click-Through

**Scenario:** Player clicks choices very fast, reaches boundary in <30 seconds

**Handling:**
- Still show announcement (don't skip)
- Session duration metric may be <1 min (that's okay, track it)
- Announce may feel disruptive if too fast → Test with users

### Edge Case 2: localStorage Full

**Scenario:** Browser storage quota exceeded

**Handling:**
```typescript
try {
  localStorage.setItem('lux-story-game-state', JSON.stringify(gameState))
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Fallback: Save to sessionStorage (lost on close, but better than nothing)
    sessionStorage.setItem('lux-story-game-state', JSON.stringify(gameState))

    // Warn user
    toast.error('Storage limit reached. Consider clearing old saves.')
  }
}
```

### Edge Case 3: Announcement Doesn't Load

**Scenario:** Platform announcement text is undefined/null

**Handling:**
```typescript
const announcement = currentNode.metadata?.platformAnnouncement
  || selectAnnouncement(sessionNumber)
  || "Please stand clear of the closing doors." // Fallback
```

---

## Future Enhancements (Not in Week 3 Scope)

### 1. Custom Pause Messages per Character

**Current:** Generic platform announcements

**Future:** Character-specific pause messages
- Samuel: "Station'll be here when you get back. Always is."
- Maya: "I'll be around if you want to talk more later."
- Devon: "Take your time. The robots can wait."

**Implementation:** Add `pauseMessage` field to character metadata

---

### 2. Session Streak Tracking

**Concept:** Track consecutive days player returns

**UI:** "7-day streak! You've visited the Terminus every day this week."

**Gamification:** Unlock special thoughts or dialogue for long streaks

---

### 3. Dynamic Session Length

**Current:** Fixed 10-node boundaries

**Future:** Adjust based on player behavior
- If player always pauses at boundaries → Keep them
- If player never pauses → Reduce boundary frequency
- If player quits mid-session often → Add more boundaries

**ML Model:** Train on session data to predict optimal boundary placement

---

## Week 3 Completion Criteria

**Code Complete:**
- [ ] All new files created (3 files)
- [ ] All character graphs marked (11 files)
- [ ] StatefulGameInterface updated
- [ ] Analytics integrated
- [ ] No TypeScript errors
- [ ] Build successful

**Testing Complete:**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing on desktop (Chrome, Firefox, Safari)
- [ ] Manual testing on mobile (iPhone, Samsung)
- [ ] Edge cases handled

**Documentation Complete:**
- [x] Implementation plan (this doc)
- [ ] Update CHANGELOG.md
- [ ] Update README.md (session boundaries feature)

**Ready for Deployment:**
- [ ] Vercel preview deploy
- [ ] Smoke test on production URL
- [ ] Merge to main
- [ ] Monitor PostHog for session boundary events

---

**Next:** Month 1 Week 4 - Failure Entertainment Paths (top 20 gated choices get alternatives)

---

*"Between departure and arrival lies the journey. Between who you were and who you'll be lies this moment."* — Platform Announcement, Grand Central Terminus
