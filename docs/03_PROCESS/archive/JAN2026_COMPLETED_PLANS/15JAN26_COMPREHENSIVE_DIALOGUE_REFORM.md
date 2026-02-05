# MASTER REFORM PLAN: Comprehensive Dialogue & Systems Overhaul
## Final Sweep - All Audits Consolidated

**Date:** January 15, 2026
**Status:** COMPREHENSIVE AUDIT COMPLETE - Ready for Phased Implementation
**Scope:** Full architectural reform + all outstanding critique issues
**Reference:** Baldur's Gate 3 dialogue quality as target standard
**Total Issues Tracked:** 87+

---

## DOCUMENT STRUCTURE

| Part | Focus | Issues |
|------|-------|--------|
| **Part 1** | Architecture Reform | 6 |
| **Part 2** | Runtime Integration | 4 |
| **Part 3** | Content Authoring | 4 |
| **Part 4** | Validation Tooling | 4 |
| **Part 5** | Scientific Implementation | 3 |
| **Part 6** | Fake Choice Fixes | 40+ |
| **Part 7** | Bloat Cleanup | 10+ |
| **Part 8** | Data Dictionary Gaps | 10 |
| **Part 9** | Design Principle Violations | 19 |
| **Part 10** | Build/Deployment Blockers | 6 |
| **Part 11** | UX Critical Fixes | 8 |

---

## EXECUTIVE SUMMARY

### The Core Problem

The game **measures brilliantly but reflects poorly**. We have world-class tracking systems that players never see:

| System | Tracked | Visible to Player |
|--------|---------|-------------------|
| 1,142 pattern choices | ✅ | 4% acknowledged |
| 905 skill attributions | ✅ | 0% visible |
| 503 emotions | ✅ | Internal only |
| Nervous system states | ✅ | Never shown |
| 508 knowledge flags | ✅ | Working but invisible |
| 942 consequence echoes | ✅ | Subtle, not punchy |

### The Root Cause: Architectural Asymmetry

**Player choices have voice variations. NPC responses don't.**

```typescript
// Player choice - HAS voiceVariations
choice: {
  text: "Pre-med and robotics?",
  voiceVariations: {
    analytical: "Walk me through how those connect.",
    helping: "That's a lot to balance. How are you managing?"
  }
}

// NPC response - NO voiceVariations
content: [{
  text: "Yeah, pre-med at UAB. Second year..."
  // Same for ALL players regardless of pattern
}]
```

### The Solution: Bidirectional Reflection

Systems must flow **both directions**:
1. Systems observe and calculate player state ✅ (already works)
2. Systems reflect that state back to player ❌ (MISSING)

---

## PART 1: ARCHITECTURE REFORM

### 1.1 Add voiceVariations to DialogueContent

**File:** `lib/dialogue-graph.ts` (line 197)

**Current:**
```typescript
export interface DialogueContent {
  text: string
  emotion?: string
  patternReflection?: PatternReflection[]
  // ... other fields
}
```

**Reform:**
```typescript
export interface DialogueContent {
  text: string
  emotion?: string
  patternReflection?: PatternReflection[]

  // NEW: NPC dialogue varies by player pattern
  voiceVariations?: Partial<Record<PatternType, string>>

  // NEW: NPC dialogue varies by player skill level
  skillReflection?: SkillReflection[]

  // NEW: NPC dialogue varies by nervous system state
  nervousSystemReflection?: NervousSystemReflection[]
}

interface SkillReflection {
  skill: string
  minLevel: number
  altText: string
  altEmotion?: string
}

interface NervousSystemReflection {
  state: 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal'
  altText: string
  altEmotion?: string
}
```

**Effort:** 2 hours
**Impact:** Enables all NPC dialogue personalization

---

### 1.2 Wire Skills to GameState

**Current Problem:** Skills tracked in Supabase but NOT in GameState

**File:** `lib/game-state.ts`

**Current:**
```typescript
interface GameState {
  patterns: PlayerPatterns  // ✅ EXISTS
  // skills: ???            // ❌ MISSING
}
```

**Reform:**
```typescript
interface GameState {
  patterns: PlayerPatterns

  // NEW: Track demonstrated skills
  skills: PlayerSkills

  // NEW: Track nervous system history
  nervousSystemHistory: NervousSystemEntry[]

  // NEW: Track emotion journey
  emotionJourney: EmotionEntry[]
}

interface PlayerSkills {
  [skillName: string]: {
    level: number           // 0-10 like patterns
    demonstrations: number  // count
    lastDemonstrated: string // nodeId
  }
}

interface NervousSystemEntry {
  state: NervousSystemState
  timestamp: number
  trigger: string  // What caused the shift
}

interface EmotionEntry {
  emotion: string
  nodeId: string
  characterId: string
  timestamp: number
}
```

**Effort:** 4 hours
**Impact:** Skills become queryable in dialogue logic

---

### 1.3 Create Missing Resolution Functions

**File:** `lib/consequence-echoes.ts` (new functions)

```typescript
// 1. Resolve NPC voiceVariations (like player choices)
export function resolveContentVoiceVariation(
  content: DialogueContent,
  patterns: PlayerPatterns
): DialogueContent {
  if (!content.voiceVariations) return content

  const dominantPattern = getDominantPattern(patterns)
  if (dominantPattern && content.voiceVariations[dominantPattern]) {
    return {
      ...content,
      text: content.voiceVariations[dominantPattern]
    }
  }
  return content
}

// 2. Skill recognition voices (NEW)
export function getSkillVoice(
  skill: string,
  level: number,
  characterId: string
): PatternVoiceResult | null {
  if (level < 5) return null

  const voices = SKILL_VOICES[skill]?.[characterId] || SKILL_VOICES[skill]?.default
  if (!voices) return null

  return {
    pattern: null,
    skill,
    text: voices[Math.floor(Math.random() * voices.length)],
    style: level >= 8 ? 'command' : 'speak'
  }
}

// 3. Nervous system feedback (NEW)
export function getNervousSystemFeedback(
  previousState: NervousSystemState,
  currentState: NervousSystemState,
  characterId: string
): ConsequenceEcho | null {
  if (previousState === currentState) return null

  const transition = `${previousState}_to_${currentState}`
  const feedbacks = NERVOUS_SYSTEM_FEEDBACKS[transition]?.[characterId]

  if (!feedbacks) return null

  return {
    text: feedbacks[Math.floor(Math.random() * feedbacks.length)],
    emotion: currentState === 'ventral_vagal' ? 'warm' :
             currentState === 'sympathetic' ? 'alert' : 'gentle',
    timing: 'immediate'
  }
}

// 4. Emotion journey insight (NEW)
export function getEmotionJourneyInsight(
  emotionJourney: EmotionEntry[],
  sessionStart: number
): { trajectory: string; insight: string } | null {
  const sessionEmotions = emotionJourney.filter(e => e.timestamp >= sessionStart)
  if (sessionEmotions.length < 3) return null

  const startCategory = getEmotionCategory(sessionEmotions[0].emotion)
  const endCategory = getEmotionCategory(sessionEmotions[sessionEmotions.length - 1].emotion)

  if (startCategory === endCategory) return null

  return {
    trajectory: `${startCategory} → ${endCategory}`,
    insight: EMOTION_TRAJECTORY_INSIGHTS[`${startCategory}_${endCategory}`]
  }
}
```

**Effort:** 8 hours
**Impact:** Four new feedback systems enabled

---

## PART 2: RUNTIME INTEGRATION

### 2.1 Inject Content Voice Variations

**File:** `components/StatefulGameInterface.tsx` (line ~1110)

**Current:**
```typescript
const reflected = applyPatternReflection(
  content.text,
  content.emotion,
  mergedPatternReflection,
  gameState.patterns
)
```

**Reform:**
```typescript
// Step 1: Apply pattern reflection (existing)
let processedContent = applyPatternReflection(
  content.text,
  content.emotion,
  mergedPatternReflection,
  gameState.patterns
)

// Step 2: Apply content voice variations (NEW)
processedContent = resolveContentVoiceVariation(
  processedContent,
  gameState.patterns
)

// Step 3: Apply skill reflection (NEW)
processedContent = applySkillReflection(
  processedContent,
  gameState.skills
)

// Step 4: Apply nervous system reflection (NEW)
const charState = gameState.characters.get(currentCharacterId)
processedContent = applyNervousSystemReflection(
  processedContent,
  charState?.nervousSystemState
)
```

**Effort:** 4 hours
**Impact:** All four reflection types now fire

---

### 2.2 Surface Nervous System State to Player

**File:** `components/Journal.tsx` or new component

**Add Nervous System Display:**
```tsx
// In Journal or new "Insights" tab
<NervousSystemIndicator
  state={currentCharacterState.nervousSystemState}
  anxiety={currentCharacterState.anxiety}
  trust={currentCharacterState.trust}
/>

// Component shows:
// - Current state (ventral_vagal/sympathetic/dorsal_vagal)
// - What it means ("You're in a state of connection and safety")
// - What affected it ("High trust with Samuel + demonstrated resilience")
// - Trajectory ("Moving toward calm")
```

**Effort:** 6 hours
**Impact:** Player sees their biological state

---

### 2.3 Add Skill Progression Notifications

**File:** `components/StatefulGameInterface.tsx`

**After skill demonstration:**
```typescript
// When processing choice with skills
if (result.events.updateSkills) {
  for (const skill of result.events.updateSkills) {
    const oldLevel = previousSkills[skill]?.level || 0
    const newLevel = newGameState.skills[skill]?.level || 0

    // Threshold crossing notification
    if (oldLevel < 5 && newLevel >= 5) {
      setState(prev => ({
        ...prev,
        skillNotification: {
          skill,
          message: `${SKILL_SUPERPOWERS[skill]} emerging`,
          level: newLevel
        }
      }))
    }
  }
}
```

**Effort:** 4 hours
**Impact:** Player sees skill growth

---

### 2.4 Add Emotion Journey Tab

**File:** `components/Journal.tsx` (new tab)

```tsx
<TabsContent value="emotions">
  <EmotionJourney
    emotionHistory={gameState.emotionJourney}
    sessionStart={sessionStartTime}
  />
</TabsContent>

// EmotionJourney component shows:
// - Timeline visualization of emotional states
// - "Started: anxious_uncertain"
// - "Current: hopeful_determined"
// - Trajectory insight: "You're moving toward connection"
```

**Effort:** 8 hours
**Impact:** Player sees emotional progression

---

## PART 3: CONTENT AUTHORING

### 3.1 Add NPC Voice Variations to Key Nodes

**Priority Characters:** Samuel, Maya, Marcus (Tier 1)

**Example - Maya Introduction Response:**

**Current:**
```typescript
content: [{
  text: "Yeah, pre-med at UAB. Second year. Organic chem is... it's fine."
}]
```

**Reform:**
```typescript
content: [{
  text: "Yeah, pre-med at UAB. Second year. Organic chem is... it's fine.",
  voiceVariations: {
    analytical: "You're trying to find the logic in it, right? Yeah, pre-med at UAB. The pattern is: family expects doctor, I expected engineering.",
    helping: "You noticed the stress. Thank you. Yeah, pre-med at UAB. My parents need this to work. I need something else.",
    building: "You see the project, don't you? Pre-med is the foundation. But I'm building something on top of it.",
    exploring: "You want the whole story? Pre-med at UAB. But there's a hidden layer underneath.",
    patience: "You're not rushing me. That's rare. Pre-med at UAB. It's... complicated."
  }
}]
```

**Scope:** 50-100 key dialogue nodes across Tier 1 characters
**Effort:** 20-30 hours (content authoring)
**Impact:** NPCs respond to WHO player is becoming

---

### 3.2 Add Acknowledgment Beat Nodes

**For all 38 convergence paths to `samuel_hub_after_maya`:**

**Template:**
```typescript
{
  nodeId: 'samuel_beat_after_inheritance',
  speaker: 'Samuel Washington',
  content: [{
    text: "It is beautiful, isn't it? [Samuel pauses, letting the moment settle.]\n\nNow, there's someone else who might benefit from that perspective.",
    emotion: 'warm',
    voiceVariations: {
      analytical: "That's a precise way to see it. You frame things well.\n\nNow, there's someone who thinks in systems like you do.",
      helping: "I could feel how much that meant to you.\n\nSomeone else here needs that kind of presence.",
      patience: "You took time with that. That patience is rare.\n\nSomeone else here could use that steadiness."
    }
  }],
  choices: [{
    text: "(Continue)",
    nextNodeId: 'samuel_hub_after_maya'
  }]
}
```

**Scope:** 10-15 beat nodes
**Effort:** 8-12 hours
**Impact:** No more "DVD menu reset" feeling

---

### 3.3 Add Skill Recognition Dialogue

**New dialogue where NPCs recognize demonstrated skills:**

```typescript
// Samuel recognizes emotional intelligence
{
  nodeId: 'samuel_skill_recognition_ei',
  speaker: 'Samuel Washington',
  requiredState: {
    skills: { emotionalIntelligence: { min: 6 } }
  },
  content: [{
    text: "You've developed something real. The way you read people, the way you sense what's underneath the words. That's emotional intelligence. Can't be taught from a book.\n\nGrace mentioned you. Said you heard things she wasn't saying. That's a gift.",
    emotion: 'knowing'
  }],
  // Appears in Samuel hub when skill threshold reached
}

// Maya recognizes critical thinking
{
  nodeId: 'maya_skill_recognition_ct',
  speaker: 'Maya Chen',
  requiredState: {
    skills: { criticalThinking: { min: 6 } }
  },
  content: [{
    text: "You know what I noticed? You ask the right questions. Not the surface ones. You dig until the logic holds.\n\nThat's how I think too. Except I apply it to systems. You apply it to people.",
    emotion: 'impressed'
  }]
}
```

**Scope:** 54 skills × 2-3 recognition nodes each = 100-150 new nodes
**Effort:** 40-60 hours (can be phased)
**Impact:** Skills become VISIBLE and acknowledged

---

### 3.4 Add Nervous System Feedback Dialogue

**NPCs respond to player's biological state:**

```typescript
// Samuel notices player in sympathetic state
{
  nodeId: 'samuel_nervous_system_sympathetic',
  speaker: 'Samuel Washington',
  requiredState: {
    nervousSystemState: 'sympathetic'
  },
  content: [{
    text: "You're on alert right now. I can tell.\n\nThat's not wrong. Sometimes we need to be mobilized. But you can stay here a moment if you need to. The station doesn't rush anyone.",
    emotion: 'gentle'
  }]
}

// Grace notices player in ventral vagal
{
  nodeId: 'grace_nervous_system_ventral',
  speaker: 'Grace Thompson',
  requiredState: {
    nervousSystemState: 'ventral_vagal'
  },
  content: [{
    text: "You feel different than when we first met. More settled. More present.\n\nThat's not nothing. A lot of people I work with never get there. You did.",
    emotion: 'warm_proud'
  }]
}
```

**Scope:** 20 characters × 3 states × 1-2 nodes = 60-120 nodes
**Effort:** 30-40 hours
**Impact:** Polyvagal Theory becomes visible

---

## PART 4: VALIDATION TOOLING

### 4.1 Fake Choice Detection Script

**File:** `scripts/validate-dialogue-graphs.ts`

```typescript
// Detect same-destination clusters
function detectFakeChoices(graphs: DialogueGraph[]): FakeChoiceReport[] {
  const issues: FakeChoiceReport[] = []

  for (const graph of graphs) {
    for (const node of graph.nodes.values()) {
      const destinations = new Map<string, string[]>()

      for (const choice of node.choices) {
        const dest = choice.nextNodeId
        if (!destinations.has(dest)) destinations.set(dest, [])
        destinations.get(dest)!.push(choice.choiceId)
      }

      for (const [dest, choices] of destinations) {
        if (choices.length > 1) {
          issues.push({
            nodeId: node.nodeId,
            characterId: graph.characterId,
            destination: dest,
            choiceCount: choices.length,
            choices: choices,
            severity: choices.length >= 3 ? 'CRITICAL' : 'WARNING'
          })
        }
      }
    }
  }

  return issues
}
```

### 4.2 Orphan Node Detection

```typescript
// Detect nodes with no incoming paths
function detectOrphanNodes(graphs: DialogueGraph[]): OrphanReport[] {
  const allDestinations = new Set<string>()
  const allNodes = new Set<string>()

  for (const graph of graphs) {
    for (const node of graph.nodes.values()) {
      allNodes.add(node.nodeId)
      for (const choice of node.choices) {
        allDestinations.add(choice.nextNodeId)
      }
    }
  }

  const orphans = [...allNodes].filter(n =>
    !allDestinations.has(n) &&
    !n.includes('_introduction') &&  // Entry points OK
    !n.includes('_start')
  )

  return orphans.map(nodeId => ({ nodeId, severity: 'WARNING' }))
}
```

### 4.3 Pattern Imbalance Detection

```typescript
// Warn if pattern distribution is skewed
function detectPatternImbalance(graphs: DialogueGraph[]): ImbalanceReport {
  const patternCounts = { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 }
  let totalChoices = 0

  for (const graph of graphs) {
    for (const node of graph.nodes.values()) {
      for (const choice of node.choices) {
        if (choice.pattern) {
          patternCounts[choice.pattern]++
          totalChoices++
        }
      }
    }
  }

  const threshold = totalChoices * 0.15  // Each pattern should be 15%+
  const imbalanced = Object.entries(patternCounts)
    .filter(([_, count]) => count < threshold)
    .map(([pattern, count]) => ({
      pattern,
      count,
      percentage: (count / totalChoices * 100).toFixed(1),
      target: '15%+'
    }))

  return { imbalanced, totalChoices, patternCounts }
}
```

### 4.4 Voice Variation Coverage Report

```typescript
// Report which nodes lack voice variations
function auditVoiceVariationCoverage(graphs: DialogueGraph[]): CoverageReport {
  const report = {
    total: 0,
    withVoiceVariations: 0,
    withPatternReflection: 0,
    withNeither: 0,
    nodesMissingVariations: [] as string[]
  }

  for (const graph of graphs) {
    for (const node of graph.nodes.values()) {
      for (const content of node.content) {
        report.total++

        const hasVoice = !!content.voiceVariations
        const hasReflection = !!(content.patternReflection || node.patternReflection)

        if (hasVoice) report.withVoiceVariations++
        if (hasReflection) report.withPatternReflection++
        if (!hasVoice && !hasReflection) {
          report.withNeither++
          report.nodesMissingVariations.push(node.nodeId)
        }
      }
    }
  }

  return report
}
```

**Effort:** 8-12 hours
**Impact:** Prevents future regressions

---

## PART 5: SCIENTIFIC IMPLEMENTATION

### 5.1 Polyvagal Feedback Integration

**Make nervous system states visible and consequential:**

```typescript
// Add to StatefulGameInterface
const nervousSystemFeedback = useMemo(() => {
  const charState = gameState.characters.get(currentCharacterId)
  if (!charState) return null

  const previousState = nervousSystemHistory[nervousSystemHistory.length - 2]?.state
  const currentState = charState.nervousSystemState

  if (previousState !== currentState) {
    return getNervousSystemFeedback(previousState, currentState, currentCharacterId)
  }

  return null
}, [gameState, currentCharacterId])

// Display in UI
{nervousSystemFeedback && (
  <NervousSystemTransition
    from={previousState}
    to={currentState}
    feedback={nervousSystemFeedback}
  />
)}
```

### 5.2 Narrative Identity Reflection Gateways

**Add nodes where player articulates their own story:**

```typescript
{
  nodeId: 'samuel_reflection_gateway_1',
  speaker: 'Samuel Washington',
  requiredState: {
    globalFlags: { has: ['completed_first_arc'] }
  },
  content: [{
    text: "Before you go further, I have a question for you.\n\nWhat have you learned about yourself here?",
    emotion: 'knowing'
  }],
  choices: [
    {
      text: "I notice patterns in how I approach problems.",
      nextNodeId: 'samuel_reflection_analytical',
      pattern: 'analytical',
      consequence: {
        addKnowledgeFlags: ['self_identified_analytical']
      }
    },
    {
      text: "I care more about people than I realized.",
      nextNodeId: 'samuel_reflection_helping',
      pattern: 'helping',
      consequence: {
        addKnowledgeFlags: ['self_identified_helping']
      }
    },
    {
      text: "I'm always curious what's around the corner.",
      nextNodeId: 'samuel_reflection_exploring',
      pattern: 'exploring',
      consequence: {
        addKnowledgeFlags: ['self_identified_exploring']
      }
    },
    {
      text: "I've learned to be patient with uncertainty.",
      nextNodeId: 'samuel_reflection_patience',
      pattern: 'patience',
      consequence: {
        addKnowledgeFlags: ['self_identified_patience']
      }
    },
    {
      text: "I want to build something that matters.",
      nextNodeId: 'samuel_reflection_building',
      pattern: 'building',
      consequence: {
        addKnowledgeFlags: ['self_identified_building']
      }
    }
  ]
}
```

**Then Samuel responds to their self-identification:**

```typescript
{
  nodeId: 'samuel_reflection_analytical',
  speaker: 'Samuel Washington',
  content: [{
    text: "That's what I see in you too. The Weaver.\n\nYou see hidden threads where others see chaos. That gift will serve you in careers that need people who can hold complexity.\n\nThe question now is: what do you want to weave?",
    emotion: 'knowing_proud'
  }]
}
```

**Scope:** 5 reflection gateways × 5 responses each = 25 nodes
**Effort:** 10-15 hours
**Impact:** Implements Narrative Identity Theory

---

## IMPLEMENTATION TIMELINE

### Phase 1: Architecture (Week 1-2)
- [ ] Add voiceVariations to DialogueContent interface
- [ ] Wire skills to GameState
- [ ] Create resolution functions (4 new functions)
- [ ] Update StatefulGameInterface to call new functions

### Phase 2: Beat Nodes & Convergence Fixes (Week 2-3)
- [ ] Create 15 acknowledgment beat nodes
- [ ] Update 38 convergence paths to use beat nodes
- [ ] Test all Samuel hub transitions

### Phase 3: NPC Voice Variations - Tier 1 (Week 3-4)
- [ ] Add voice variations to Samuel (50 nodes)
- [ ] Add voice variations to Maya (40 nodes)
- [ ] Add voice variations to Marcus (40 nodes)

### Phase 4: Skill Recognition Dialogue (Week 4-6)
- [ ] Create skill recognition nodes for top 10 skills (30 nodes)
- [ ] Add skill queries to character dialogue logic
- [ ] Test skill threshold crossing notifications

### Phase 5: Nervous System Feedback (Week 6-7)
- [ ] Create nervous system feedback component
- [ ] Add nervous system reflection to key nodes (40 nodes)
- [ ] Test state transition feedback

### Phase 6: Emotion Journey & Scientific (Week 7-8)
- [ ] Create emotion journey tab in Journal
- [ ] Add reflection gateway nodes (25 nodes)
- [ ] Test full "feels seen" experience

### Phase 7: Validation Tooling (Week 8)
- [ ] Build fake choice detection script
- [ ] Build orphan node detection
- [ ] Build coverage reports
- [ ] Add to CI/build process

---

## SUCCESS METRICS

### Before Reform
| Metric | Current |
|--------|---------|
| Pattern acknowledgment | 4% |
| Skill visibility | 0% |
| Nervous system visibility | 0% |
| Fake choices | 40+ |
| NPC voice variation coverage | 0% |

### After Reform
| Metric | Target |
|--------|--------|
| Pattern acknowledgment | 25%+ |
| Skill visibility | 100% (via Journal) |
| Nervous system visibility | 100% (via indicator) |
| Fake choices | 0 |
| NPC voice variation coverage | 50%+ of key nodes |

### Qualitative Targets
- [ ] Player feels SEEN within first 3 choices
- [ ] Every choice → response flows logically
- [ ] No "DVD menu reset" at hub transitions
- [ ] Skills acknowledged when demonstrated
- [ ] Nervous system state reflected in dialogue
- [ ] Playtest comparison to BG3 shows improvement

---

## FILES TO MODIFY

### Architecture
1. `lib/dialogue-graph.ts` - Interface changes
2. `lib/game-state.ts` - Skills in GameState
3. `lib/consequence-echoes.ts` - New resolution functions
4. `components/StatefulGameInterface.tsx` - Runtime integration

### Content
5. `content/samuel-dialogue-graph.ts` - Beat nodes, voice variations
6. `content/maya-dialogue-graph.ts` - Voice variations
7. `content/marcus-dialogue-graph.ts` - Voice variations
8. 17 other character graphs - Voice variations (phased)

### UI
9. `components/Journal.tsx` - Emotion journey tab
10. `components/NervousSystemIndicator.tsx` - New component
11. `components/SkillNotification.tsx` - New component

### Validation
12. `scripts/validate-dialogue-graphs.ts` - All validation
13. `package.json` - Add to build process

---

## EFFORT SUMMARY

| Phase | Effort | Priority |
|-------|--------|----------|
| Architecture | 18 hours | CRITICAL |
| Beat Nodes | 12 hours | HIGH |
| Tier 1 Voice Variations | 30 hours | HIGH |
| Skill Recognition | 50 hours | MEDIUM |
| Nervous System | 40 hours | MEDIUM |
| Emotion Journey | 15 hours | MEDIUM |
| Validation Tools | 12 hours | HIGH |
| **TOTAL** | **~177 hours** | — |

**Timeline:** 8-10 weeks for comprehensive reform

---

## PART 6: FAKE CHOICE FIXES (40+ Issues)

**Source:** `docs/00_CORE/critique/09-fake-choice-audit.md`

### Critical Priority (Player-Facing)

| # | File | Node | Issue | Choices | Fix Required |
|---|------|------|-------|---------|--------------|
| F1 | `samuel-dialogue-graph.ts` | `station_arrival` | All 3 intro choices → same destination | 3 | Create `station_observation` and `observe_passengers` nodes |
| F2 | `yaquin-dialogue-graph.ts` | `yaquin_creator_path` | 3 different intentions → same node | 3 | Split into 3 intermediate response nodes |
| F3 | `alex-dialogue-graph.ts` | `alex_ai_hype_cycle` | 2 choices → `alex_learning_treadmill` | 2 | Distinguish exhaustion vs leverage paths |
| F4 | `tess-dialogue-graph.ts` | `tess_backstory` | 2 choices → `tess_the_numbers` | 2 | Different responses for courage vs reality |

### High Priority

| # | File | Node | Issue | Choices |
|---|------|------|-------|---------|
| F5 | `yaquin-dialogue-graph.ts` | `yaquin_credential_gap` | 3 choices → same node | 3 |
| F6 | `tess-dialogue-graph.ts` | `tess_the_offer` | 2 choices → same node | 2 |
| F7 | `tess-dialogue-graph.ts` | `tess_phoniness` | 2 choices → same node | 2 |
| F8 | `samuel-dialogue-graph.ts` | `samuel_explains_station` | 4 choices → `samuel_orb_introduction` | 4 |
| F9 | `samuel-dialogue-graph.ts` | `samuel_explains_platforms` | 4 choices → same destination | 4 |

### Medium Priority

| # | File | Node | Issue | Pattern |
|---|------|------|-------|---------|
| F10 | `devon-dialogue-graph.ts` | `devon_father_aerospace` | Self-loop: 2 choices loop back | Self-loop |
| F11 | `devon-dialogue-graph.ts` | `devon_debug_result_override` | Single choice implies exploration | False agency |
| F12 | `rohan-dialogue-graph.ts` | `rohan_erasure_reveal` | 3 philosophical stances → same simulation | Same-destination |
| F13 | `kai-dialogue-graph.ts` | `kai_intro_patience` | 3 tones → same frustration | Tone-blind |
| F14 | `silas-dialogue-graph.ts` | `silas_bankruptcy_reveal` | 2 approaches → same simulation start | Same-destination |
| F15 | `samuel-dialogue-graph.ts` | `samuel_ready_to_explore` | 3 choices → character selection | Same-destination |
| F16 | `alex-dialogue-graph.ts` | `alex_contradiction` | 3/5 choices funnel to same | Quick reconvergence |
| F17 | `yaquin-dialogue-graph.ts` | `yaquin_curriculum_dream` | 2 choices → same setup | Same-destination |

### Systemic Patterns to Fix

| Pattern | Description | Offenders | Fix Strategy |
|---------|-------------|-----------|--------------|
| **Narrative Funnel Abuse** | 3-4 choices → 1 setup node | Samuel (intro), Yaquin | Add beat nodes |
| **Tone-Blind Responses** | Emotional/analytical → same | Tess, Alex, Kai | Add voiceVariations |
| **False Exploration** | "Look around" → proceed anyway | Samuel, Devon | Create actual exploration nodes |
| **[Continue] Overuse** | Single choice for pacing | Many characters | Add reflection choices |

### Fix Design Principle

Every choice must satisfy at least ONE:
1. **Different destination** - Leads to unique node
2. **Different insight** - Same destination, different acknowledgment
3. **Delayed divergence** - Affects later outcomes via flags/patterns

**Total Fake Choices:** 40+
**Estimated Fix Effort:** 40-60 hours

---

## PART 7: BLOAT CLEANUP (6,726+ Lines)

**Source:** `docs/00_CORE/critique/08-bloat-audit.md`

### Phase 1: Immediate Deletions (Zero Risk)

| # | File | Lines | Issue | Action |
|---|------|-------|-------|--------|
| B1 | `lib/crossroads-system.ts` | 1,272 | UNUSED - Not imported anywhere | DELETE |
| B2 | `lib/scene-skill-mappings.ts` | 2,183 | DUPLICATE - Skills already in choices | DELETE |

### Phase 1: File Moves (Organizing)

| # | File | Lines | Issue | Action |
|---|------|-------|-------|--------|
| B3 | `lib/character-quirks.ts` | 1,394 | Content in /lib | MOVE to `/content/` |
| B4 | `lib/character-depth.ts` | 1,310 | Content in /lib | MOVE to `/content/` |
| B5 | `lib/birmingham-opportunities.ts` | 567 | Data in /lib | MOVE to `/content/` |

### Phase 2: Investigation Required

| # | File | Lines | Questions |
|---|------|-------|-----------|
| B6 | `lib/skill-tracker.ts` | 1,075 | Does it need 1,075 lines? |
| B7 | `lib/comprehensive-user-tracker.ts` | 739 | Duplicates PostHog? |
| B8 | `lib/engagement-quality-analyzer.ts` | 580 | Necessary? |

### Phase 2: Analytics Consolidation

| Current | Purpose | Recommendation |
|---------|---------|----------------|
| `lib/analytics.ts` | Core analytics | KEEP |
| `lib/comprehensive-user-tracker.ts` | Custom tracking | CONSOLIDATE with PostHog |
| `lib/engagement-metrics.ts` | Metrics | CONSOLIDATE |
| `lib/engagement-quality-analyzer.ts` | Analysis | CONSOLIDATE |
| PostHog SDK | External analytics | KEEP as primary |

**Recommendation:** 5 analytics systems → 2 (PostHog + `analytics.ts`)

### Cleanup Totals

| Phase | Action | Lines |
|-------|--------|-------|
| Phase 1 Deletions | DELETE | 3,455 |
| Phase 1 Moves | MOVE to /content | 3,271 |
| Phase 2 (potential) | SIMPLIFY | 2,000-3,000 |
| **Total Cleanup** | — | **6,726-9,726** |

**Estimated Effort:** 8-12 hours

---

## PART 8: DATA DICTIONARY GAPS (10 Critical)

**Source:** Deep audit of data dictionaries and scientific documentation

| # | Gap | Design Doc Says | Reality | Priority |
|---|-----|-----------------|---------|----------|
| D1 | **Pattern-Locked Difficulty** | Simulations vary by pattern level | All Phase 1 only | HIGH |
| D2 | **Trust Recovery** | Repair mechanics for mistakes | None implemented | HIGH |
| D3 | **Skill Combo Triggers** | 30+ combos unlock careers | No trigger conditions | MEDIUM |
| D4 | **Trust Momentum Abuse** | Safeguards against gaming | None documented | LOW |
| D5 | **Polyvagal → Dialogue** | Nervous state affects choices | Never gates dialogue | HIGH |
| D6 | **Challenge Interrupts** | 6 interrupt types designed | 0/6 implemented | HIGH |
| D7 | **Grace Character** | Tier 3 = 40 nodes minimum | 38 nodes (-2) | MEDIUM |
| D8 | **Synesthesia Engine** | UI spec for Lira/Nadia sims | No spec exists | LOW |
| D9 | **Knowledge Flag Debug** | 508 flags in system | No debug/visibility tools | MEDIUM |
| D10 | **Voice Variation Coverage** | All key nodes have variations | ~15% of nodes only | HIGH |

### D1: Pattern-Locked Difficulty Implementation

**Required Changes:**
```typescript
// In simulation nodes, add:
requiredState: {
  patterns: { analytical: { min: 4 } }  // Phase 2 difficulty
}

// Add Phase 2/3 variants for simulations:
// maya_simulation_phase2, maya_simulation_phase3
```

### D2: Trust Recovery Implementation

**Required for Challenge Interrupts:**
```typescript
{
  nodeId: 'maya_trust_repair',
  requiredState: { trust: { max: 3 }, hasKnowledgeFlags: ['maya_trust_damaged'] },
  content: [{ text: "I was harsh earlier. I'm sorry. Want to start over?" }],
  choices: [{ consequence: { trustChange: +2 }, pattern: 'helping' }]
}
```

### D5: Polyvagal → Dialogue Gating

**Required Changes:**
```typescript
// Add to requiredState:
requiredState: {
  nervousSystemState: 'ventral_vagal'  // Only available when regulated
}

// Or modify available choices based on nervous state
```

### D6: Challenge Interrupts (0/6 → 6/6)

| Interrupt Type | Purpose | Status |
|----------------|---------|--------|
| `connection` | Deepen relationship | NOT IMPLEMENTED |
| `challenge` | Push player growth | NOT IMPLEMENTED |
| `silence` | Processing time | NOT IMPLEMENTED |
| `comfort` | Emotional support | NOT IMPLEMENTED |
| `grounding` | Regulate anxiety | NOT IMPLEMENTED |
| `encouragement` | Build confidence | NOT IMPLEMENTED |

**Estimated Effort:** 30-40 hours

---

## PART 9: DESIGN PRINCIPLE VIOLATIONS (19 Issues)

**Source:** Deep audit of design docs vs implementation reality

### Tier 1: Narrative Game Design (CRITICAL)

| # | Violation | Evidence | Impact | Fix |
|---|-----------|----------|--------|-----|
| V1 | **40+ Fake Choices** | Same-destination clusters | Core betrayal | See Part 6 |
| V2 | **96% Silent Pattern Tracking** | 1,142 tracked, 4% acknowledged | Invisible growth | Increase to 20% |
| V3 | **Invisible Consequence Echoes** | 942 echoes, subtle delivery | No "juice" | Add visible feedback |
| V4 | **Career Value Hidden** | Requires arc completion | Core USP buried | Preview earlier |
| V5 | **Empty State Exposure** | "No thoughts forming" | Looks broken | Remove or tease |

### Tier 2: Feedback Systems (HIGH)

| # | Violation | Evidence | Impact | Fix |
|---|-----------|----------|--------|-----|
| V6 | **Skills = Dead Code** | 905 attributions, 0 impact | Feature waste | Wire up or remove |
| V7 | **Transform Flags Unused** | 14 flags set, never checked | Dead metadata | Wire up or remove |
| V8 | **Player Voice Not Differentiated** | Generic choice text | No personality | Add voiceVariations |
| V9 | **No Relationship Cascades** | Characters don't reference each other | Isolated arcs | Add cross-references |

### Tier 3: UX/Discovery (MEDIUM)

| # | Violation | Evidence | Impact | Fix |
|---|-----------|----------|--------|-----|
| V10 | **10-Second Cognitive Violation** | System unexplained | Confusion | Simplify onboarding |
| V11 | **No Player-Reflective NPC Responses** | NPCs don't see patterns | One-directional | Add voiceVariations to content |
| V12 | **Skill Demonstrations Silent** | No feedback for competence | Invisible progress | Add notifications |
| V13 | **Thought Cabinet 15% Discovery** | Feature never found | Buried value | Discovery prompts |

### Tier 4: Narrative Design (MEDIUM)

| # | Violation | Evidence | Impact | Fix |
|---|-----------|----------|--------|-----|
| V14 | **Narrative Funnel Abuse** | 3-4 choices → 1 node | False agency | Beat nodes |
| V15 | **False Exploration Promises** | "Look around" → railroad | Broken trust | Real exploration |
| V16 | **Tone-Blind Responses** | Emotional/analytical → same | Ignored intent | Voice variations |

### Tier 5: Scientific Foundation (HIGH)

| # | Violation | Evidence | Impact | Fix |
|---|-----------|----------|--------|-----|
| V17 | **Narrative Identity Unimplemented** | No self-articulation | No reflection | Reflection gateways |
| V18 | **Constructivist Learning Ignored** | Discovery not scaffolded | Passive experience | Active discovery |
| V19 | **No Pattern-Career Feedback** | Measurement without meaning | Invisible value | Surface connections |

**Total Violations:** 19
**Estimated Fix Effort:** 80-100 hours

---

## PART 10: BUILD/DEPLOYMENT BLOCKERS (6 Issues)

**Source:** `docs/00_CORE/critique/12-devil-advocate-audit.md`

### Critical Blockers

| # | Issue | Error | Impact | Fix |
|---|-------|-------|--------|-----|
| BL1 | **Module Resolution Errors** | `Cannot find module './873.js'` | Admin broken | Rebuild webpack |
| BL2 | **Webpack Chunk Corruption** | Missing module files | 500 errors | Clean rebuild |
| BL3 | **Authentication System Failure** | Admin login non-functional | No admin access | Restore auth |

### High Priority

| # | Issue | Error | Impact | Fix |
|---|-------|-------|--------|-----|
| BL4 | **Port Conflicts** | `EADDRINUSE: 3003` | Dev blocked | Process management |
| BL5 | **Prisma Instrumentation** | Critical dependency warnings | Build warnings | Dependency audit |
| BL6 | **Demo Page Security** | `/demo-linkdap` exposes data | Security risk | Remove or secure |

### Fix Priority Order

1. **BL1-BL3** must be fixed FIRST - application is broken
2. **BL4-BL6** fix during normal development

**Estimated Effort:** 4-8 hours (critical), 4-8 hours (high)

---

## PART 11: UX CRITICAL FIXES (8 Issues)

**Source:** `docs/00_CORE/critique/10-five-lenses-audit.md`

### Progressive Paralysis (CRITICAL)

| # | Issue | Empty State Text | Fix |
|---|-------|------------------|-----|
| U1 | Thought Cabinet empty | "No thoughts are currently forming" | Remove or add teaser |
| U2 | Thought Cabinet beliefs | "No core beliefs established yet" | Remove or add teaser |
| U3 | Journal patterns | "Make choices to reveal your style" | Show partial data |
| U4 | Journal bonds | "Talk to characters to build bonds" | Add engaging preview |
| U5 | Journal insights | "Keep playing to see insights" | Show trajectory |

### Iceberg Problem (HIGH)

| # | Issue | Value Hidden | Fix |
|---|-------|--------------|-----|
| U6 | Journal/Cabinet/Constellation | 60% never opened | Discovery prompts |
| U7 | Career matching | Requires arc completion | Preview at 5 choices |
| U8 | Pattern insight | After 5+ choices | Micro-insight at choice 2 |

### Recommended UX Changes

**Empty State Strategy:**
```tsx
// BEFORE (looks broken)
<p>No thoughts are currently forming.</p>

// AFTER (anticipatory)
<motion.p className="text-muted italic">
  Your thoughts will emerge as you make pivotal choices...
</motion.p>
```

**Discovery Prompts:**
- After 10 choices without panel open: subtle pulse on icons
- "See how you're doing" tooltip

**Career Preview:**
- After 5 choices: "Career themes you're exploring: [Healthcare, Technology]"

**Estimated Effort:** 8-12 hours

---

## CONSOLIDATED EFFORT SUMMARY

| Part | Focus | Issues | Effort |
|------|-------|--------|--------|
| Part 1-5 | Architecture/Content | 21 | 177 hours |
| Part 6 | Fake Choices | 40+ | 40-60 hours |
| Part 7 | Bloat Cleanup | 10+ | 8-12 hours |
| Part 8 | Data Dictionary | 10 | 30-40 hours |
| Part 9 | Design Violations | 19 | 80-100 hours |
| Part 10 | Build Blockers | 6 | 8-16 hours |
| Part 11 | UX Fixes | 8 | 8-12 hours |
| **TOTAL** | — | **87+** | **351-417 hours** |

---

## PHASED IMPLEMENTATION TIMELINE

### Phase 0: Build Blockers (Week 0)
**MUST FIX FIRST - Application Broken**
- [ ] BL1: Fix webpack module resolution
- [ ] BL2: Clean rebuild chunks
- [ ] BL3: Restore admin authentication
- [ ] BL6: Secure demo page

### Phase 1: Architecture Foundation (Weeks 1-2)
- [ ] Add voiceVariations to DialogueContent interface
- [ ] Wire skills to GameState
- [ ] Create 4 resolution functions
- [ ] Update StatefulGameInterface runtime

### Phase 2: Critical Content Fixes (Weeks 2-4)
- [ ] Fix F1-F4 (critical fake choices)
- [ ] Add 15 acknowledgment beat nodes
- [ ] Add NPC voice variations (Samuel, Maya, Marcus)
- [ ] Fix U1-U5 (empty states)

### Phase 3: System Completions (Weeks 4-6)
- [ ] D6: Implement 6 challenge interrupts
- [ ] D2: Add trust recovery nodes
- [ ] D5: Wire polyvagal to dialogue gating
- [ ] Part 9 violations (V1-V9)

### Phase 4: Bloat & Validation (Week 6-7)
- [ ] B1-B5: Delete/move bloat files
- [ ] Build validation tooling
- [ ] Add to CI process

### Phase 5: Scientific & Polish (Weeks 7-10)
- [ ] Narrative Identity reflection gateways
- [ ] Nervous system feedback
- [ ] Emotion journey tab
- [ ] Remaining fake choice fixes

---

## VERIFICATION CHECKLISTS

### Build Health ✅
- [ ] `npm run build` succeeds with no errors
- [ ] Admin login functional
- [ ] No 500 errors on any route
- [ ] No security warnings

### Dialogue Quality ✅
- [ ] Pattern acknowledgment ≥ 20%
- [ ] 0 fake choices in Tier 1 characters
- [ ] NPC voice variations on 50%+ key nodes
- [ ] All convergence points have beat nodes

### System Completeness ✅
- [ ] Skills visible in Journal (or removed)
- [ ] Nervous system indicator implemented
- [ ] Challenge interrupts 6/6
- [ ] Trust recovery exists

### UX Quality ✅
- [ ] No empty state "broken" feelings
- [ ] Career preview within 5 choices
- [ ] Panel discovery prompts active
- [ ] "Feels seen" within 3 choices

---

## ISSUE TRACKING STATUS

### Critical (Fix First)
- [ ] BL1: Module resolution errors
- [ ] BL2: Webpack chunk corruption
- [ ] BL3: Admin authentication
- [ ] F1: Samuel intro fake choices
- [ ] V2: 96% silent tracking
- [ ] D6: 0/6 challenge interrupts

### High Priority
- [ ] F2-F4: High-priority fake choices
- [ ] D1: Pattern-locked difficulty
- [ ] D2: Trust recovery
- [ ] D5: Polyvagal → dialogue
- [ ] V3: Invisible echoes
- [ ] V6: Skills dead code

### Medium Priority
- [ ] F5-F17: Remaining fake choices
- [ ] D3: Skill combo triggers
- [ ] D7: Grace -2 nodes
- [ ] D9: Knowledge flag debug
- [ ] V10-V16: UX/narrative violations
- [ ] B6-B8: Bloat investigation

### Low Priority
- [ ] D4: Trust momentum safeguards
- [ ] D8: Synesthesia Engine spec
- [ ] V17-V19: Scientific foundations

---

## DEPENDENCIES MAP

```
Phase 0: Build Blockers
    ↓
Phase 1: Architecture
    ├─→ Phase 2: Content (parallel after interface ready)
    └─→ Phase 4: Validation (parallel)
            ↓
Phase 3: System Completions (needs architecture)
            ↓
Phase 5: Scientific & Polish
```

**Critical Path:** Phase 0 → Phase 1 → Phase 3 → Phase 5
**Parallelizable:** Phase 2, Phase 4 (can run alongside Phase 3)

---

## SUCCESS METRICS

### Before Reform
| Metric | Current |
|--------|---------|
| Pattern acknowledgment | 4% |
| Skill visibility | 0% |
| Fake choices | 40+ |
| Challenge interrupts | 0/6 |
| Build health | BROKEN |
| Empty state exposure | HIGH |

### After Reform
| Metric | Target |
|--------|--------|
| Pattern acknowledgment | 25%+ |
| Skill visibility | 100% |
| Fake choices | 0 |
| Challenge interrupts | 6/6 |
| Build health | GREEN |
| Empty state exposure | ZERO |

---

*Master plan created January 15, 2026.*
*Total scope: 87+ issues, 351-417 hours, 10 weeks.*
*Ready for phased implementation.*
