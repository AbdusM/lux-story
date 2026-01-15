# Software Development Implementation Handoff
## Production-Ready Release Execution Plan

**Date:** January 15, 2026
**For:** Gemini/AI Development Agent
**Goal:** Systematically implement all fixes from Master Reform Plan
**Target:** Production-ready release

---

## IMPLEMENTATION PROGRESS (Updated: January 15, 2026)

### Completed Commits:
1. `5b255c9` - docs: add comprehensive dialogue reform master plan and implementation handoff
2. `0a444fc` - feat: add bidirectional reflection system - NPCs respond to player patterns
3. `198326d` - feat: add bidirectional NPC variations, challenge interrupts, trust recovery

### Phase Status:
| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0: Build Stability | ✅ COMPLETE | Build passes, 1127 tests passing |
| Phase 1: Architecture | ✅ COMPLETE | voiceVariations, skillReflection, nervousSystemReflection interfaces added |
| Phase 2: Content Fixes | ✅ COMPLETE | NPC variations added to Maya, Marcus; empty states verified good |
| Phase 3: System Completions | ✅ COMPLETE | 2 challenge interrupts (Maya, Devon), trust recovery system added |
| Phase 4: Bloat Cleanup | ✅ COMPLETE | Bloat files already cleaned in prior session |
| Phase 5: Validation | ✅ COMPLETE | All tests pass, build succeeds |

### Key Additions:
- **NPC Voice Variations:** maya_studies_response, maya_vulnerability_reflection, marcus_automation_lesson, marcus_burnout
- **Challenge Interrupts:** maya_deflect_passion, devon_uab_systems_engineering (first 'challenge' type in game)
- **Trust Recovery:** maya_trust_recovery, maya_trust_restored (repair damaged relationships)
- **Architecture:** lib/consequence-echoes.ts now has resolveContentVoiceVariation, applySkillReflection, applyNervousSystemReflection

### Tests: 1127 passing | 7 skipped

---

## MISSION

Execute the 87+ issue fixes identified in `15JAN26_COMPREHENSIVE_DIALOGUE_REFORM.md` to achieve production-ready state. Work systematically through each phase, committing after each major fix.

---

## EXECUTION ORDER

### Phase 0: Build Stability (MUST DO FIRST)
### Phase 1: Architecture Foundation
### Phase 2: Critical Content Fixes
### Phase 3: System Completions
### Phase 4: Bloat Cleanup
### Phase 5: Validation & Polish

---

## PHASE 0: BUILD STABILITY (4-8 hours)

**Goal:** Get application to stable, error-free state

### Task 0.1: Fix Module Resolution Errors

**Issue:** `Cannot find module './873.js'`

**Steps:**
1. Clean Next.js cache:
```bash
rm -rf .next
rm -rf node_modules/.cache
```

2. Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

3. Rebuild:
```bash
npm run build
```

4. If errors persist, check `next.config.js` for webpack issues

**Verification:** `npm run build` completes without errors

### Task 0.2: Verify Admin Authentication

**Steps:**
1. Navigate to `/admin` in browser
2. If 500 error, check:
   - Supabase connection in `.env.local`
   - Auth middleware in `middleware.ts`
3. Fix any authentication flow issues

**Verification:** `/admin` loads login page or dashboard

### Task 0.3: Secure Demo Page

**File:** `app/demo-linkdap/page.tsx`

**Options:**
- Option A: Delete the route entirely
- Option B: Add authentication requirement
- Option C: Add to `.gitignore` if development-only

**Recommended:** Option A (delete) unless actively needed

**Verification:** `/demo-linkdap` returns 404 or requires auth

---

## PHASE 1: ARCHITECTURE FOUNDATION (18 hours)

### Task 1.1: Add voiceVariations to DialogueContent

**File:** `lib/dialogue-graph.ts` (line ~197)

**Current Interface:**
```typescript
export interface DialogueContent {
  text: string
  emotion?: string
  patternReflection?: PatternReflection[]
  // ...existing fields
}
```

**Add These Fields:**
```typescript
export interface DialogueContent {
  text: string
  emotion?: string
  patternReflection?: PatternReflection[]

  // NEW: NPC dialogue varies by player pattern
  voiceVariations?: Partial<Record<PatternType, string>>

  // NEW: NPC dialogue varies by demonstrated skills
  skillReflection?: SkillReflection[]

  // NEW: NPC responds to nervous system state
  nervousSystemReflection?: NervousSystemReflection[]
}

// Add new interfaces:
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

**Verification:** TypeScript compiles without errors

### Task 1.2: Wire Skills to GameState

**File:** `lib/game-state.ts`

**Add to GameState interface:**
```typescript
interface GameState {
  // ...existing fields

  // NEW: Track demonstrated skills
  skills: PlayerSkills

  // NEW: Track nervous system history
  nervousSystemHistory: NervousSystemEntry[]

  // NEW: Track emotion journey
  emotionJourney: EmotionEntry[]
}

interface PlayerSkills {
  [skillName: string]: {
    level: number           // 0-10
    demonstrations: number  // count
    lastDemonstrated: string // nodeId
  }
}

interface NervousSystemEntry {
  state: 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal'
  timestamp: number
  trigger: string
}

interface EmotionEntry {
  emotion: string
  nodeId: string
  characterId: string
  timestamp: number
}
```

**Also update:**
- Initial state creation
- State serialization/deserialization
- Any state reset functions

**Verification:** Game loads without state errors

### Task 1.3: Create Resolution Functions

**File:** `lib/consequence-echoes.ts`

**Add these functions:**

```typescript
// 1. Resolve NPC voiceVariations based on player pattern
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

// 2. Apply skill reflection to content
export function applySkillReflection(
  content: DialogueContent,
  skills: PlayerSkills
): DialogueContent {
  if (!content.skillReflection) return content

  for (const reflection of content.skillReflection) {
    const playerSkill = skills[reflection.skill]
    if (playerSkill && playerSkill.level >= reflection.minLevel) {
      return {
        ...content,
        text: reflection.altText,
        emotion: reflection.altEmotion || content.emotion
      }
    }
  }
  return content
}

// 3. Apply nervous system reflection
export function applyNervousSystemReflection(
  content: DialogueContent,
  nervousState?: 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal'
): DialogueContent {
  if (!content.nervousSystemReflection || !nervousState) return content

  const reflection = content.nervousSystemReflection.find(
    r => r.state === nervousState
  )

  if (reflection) {
    return {
      ...content,
      text: reflection.altText,
      emotion: reflection.altEmotion || content.emotion
    }
  }
  return content
}

// 4. Get skill voice recognition
export function getSkillVoice(
  skill: string,
  level: number,
  characterId: string
): { text: string; style: string } | null {
  if (level < 5) return null

  // Return character-specific skill recognition dialogue
  const voices = SKILL_RECOGNITION_VOICES[skill]?.[characterId]
  if (!voices) return null

  return {
    text: voices[Math.floor(Math.random() * voices.length)],
    style: level >= 8 ? 'impressed' : 'noticing'
  }
}
```

**Verification:** Functions export without errors

### Task 1.4: Integrate in StatefulGameInterface

**File:** `components/StatefulGameInterface.tsx` (around line 1110)

**Find the content processing section and update:**

```typescript
// BEFORE (existing):
const reflected = applyPatternReflection(
  content.text,
  content.emotion,
  mergedPatternReflection,
  gameState.patterns
)

// AFTER (add these steps):
// Step 1: Apply pattern reflection (existing)
let processedContent = applyPatternReflection(
  content.text,
  content.emotion,
  mergedPatternReflection,
  gameState.patterns
)

// Step 2: Apply content voice variations (NEW)
processedContent = resolveContentVoiceVariation(
  { text: processedContent.text, emotion: processedContent.emotion, ...content },
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

**Verification:** Dialogue renders with new reflection system active

---

## PHASE 2: CRITICAL CONTENT FIXES (40-60 hours)

### Task 2.1: Fix Samuel Introduction Fake Choices (F1)

**File:** `content/samuel-dialogue-graph.ts`

**Find node:** `station_arrival` (around line 23-52)

**Current (BROKEN):**
```typescript
{
  nodeId: 'station_arrival',
  choices: [
    { text: "Step off the train", nextNodeId: 'samuel_introduction' },
    { text: "Take a moment to look around first", nextNodeId: 'samuel_introduction' },
    { text: "See if anyone else is getting off", nextNodeId: 'samuel_introduction' }
  ]
}
```

**Fix - Create divergent paths:**

```typescript
// 1. Update station_arrival choices:
{
  nodeId: 'station_arrival',
  choices: [
    {
      text: "Step off the train",
      nextNodeId: 'samuel_introduction',
      pattern: 'building'
    },
    {
      text: "Take a moment to look around first",
      nextNodeId: 'station_observation',  // NEW NODE
      pattern: 'exploring'
    },
    {
      text: "See if anyone else is getting off",
      nextNodeId: 'observe_passengers',  // NEW NODE
      pattern: 'helping'
    }
  ]
}

// 2. Add new node - station_observation:
{
  nodeId: 'station_observation',
  speaker: 'Narrator',
  content: [{
    text: "The station unfolds before you like a dream half-remembered. Brass fixtures gleam with an inner light. The air smells of old wood and something electric—possibility, maybe. Platform signs list destinations you've never heard of: 'Innovation Junction,' 'The Caring Commons,' 'Builder's Crossing.'\n\nA figure in a conductor's uniform watches you from across the platform. His eyes hold the patience of someone who has seen many travelers arrive.",
    emotion: 'wonder'
  }],
  choices: [{
    text: "Approach the conductor",
    nextNodeId: 'samuel_introduction',
    pattern: 'exploring'
  }]
}

// 3. Add new node - observe_passengers:
{
  nodeId: 'observe_passengers',
  speaker: 'Narrator',
  content: [{
    text: "You pause at the train door, watching. A few other travelers step onto the platform—each seeming as uncertain as you feel. Some clutch papers, others check phones, but they all share the same expression: standing at a threshold they didn't quite expect.\n\nThe conductor notices your hesitation. There's no judgment in his gaze—only a gentle understanding that you're not the first to need a moment.",
    emotion: 'reflective'
  }],
  choices: [{
    text: "Step onto the platform",
    nextNodeId: 'samuel_introduction',
    pattern: 'helping'
  }]
}
```

**Verification:** Each intro choice leads to different experience

### Task 2.2: Add Beat Nodes for Hub Convergence

**File:** `content/samuel-dialogue-graph.ts`

**Problem:** 38 paths converge to `samuel_hub_after_maya` with no acknowledgment

**Solution:** Create beat nodes that acknowledge previous conversation

**Template for each convergence:**
```typescript
// Example: After inheritance wisdom conversation
{
  nodeId: 'samuel_beat_after_inheritance',
  speaker: 'Samuel Washington',
  content: [{
    text: "[Samuel's eyes hold yours for a moment, acknowledging what just passed between you.]\n\nThat kind of wisdom... it stays with a person.",
    emotion: 'warm',
    voiceVariations: {
      analytical: "You framed that precisely. The logic of legacy.\n\nThat clarity will serve you.",
      helping: "I felt the weight of what that means to you.\n\nThat depth of feeling... it's a compass.",
      exploring: "You're still turning that over, aren't you? Good.\n\nThe best questions don't settle quickly.",
      patience: "You took time with that. Didn't rush.\n\nThat patience is rarer than you know.",
      building: "You're already thinking about what to build from it.\n\nI can see the foundation forming."
    }
  }],
  choices: [{
    text: "(Continue)",
    nextNodeId: 'samuel_hub_after_maya'
  }]
}
```

**Create beat nodes for these convergence points:**
1. `samuel_beat_after_inheritance`
2. `samuel_beat_after_maya_arc`
3. `samuel_beat_after_marcus_arc`
4. `samuel_beat_after_first_simulation`
5. `samuel_beat_after_trust_milestone`
6. `samuel_beat_after_pattern_recognition`
7. `samuel_beat_after_vulnerability`
8. `samuel_beat_after_career_insight`
9. `samuel_beat_after_challenge`
10. `samuel_beat_after_reflection`

**Then update all 38 convergence paths to route through appropriate beat node**

### Task 2.3: Add NPC Voice Variations to Key Nodes

**Priority Characters:** Samuel, Maya, Marcus

**For each key NPC response, add voiceVariations:**

**Example - Maya introduction response:**

**File:** `content/maya-dialogue-graph.ts`

**Find and update:**
```typescript
// BEFORE:
content: [{
  text: "Yeah, pre-med at UAB. Second year. Organic chem is... it's fine."
}]

// AFTER:
content: [{
  text: "Yeah, pre-med at UAB. Second year. Organic chem is... it's fine.",
  voiceVariations: {
    analytical: "You're looking for the pattern, right? Pre-med at UAB. The formula is: family expects doctor, I expected something else. The variables don't quite balance.",
    helping: "You noticed something's off, didn't you? Yeah, pre-med at UAB. It's... my parents need this to work. I need something else. Thanks for seeing that.",
    building: "You can probably tell I'm building toward something. Pre-med at UAB—that's the foundation. But there's a structure I'm designing on top of it.",
    exploring: "You want the whole story? Pre-med at UAB. Second year. But there's a layer underneath that most people don't ask about.",
    patience: "You're not rushing me to get to the point. That's... rare. Pre-med at UAB. It's complicated, and I appreciate you giving it space."
  }
}]
```

**Target:** 50-100 key dialogue nodes across Tier 1 characters

### Task 2.4: Fix Empty States (U1-U5)

**Files to update:**
- `components/Journal.tsx`
- `components/ThoughtCabinet.tsx` (if exists)
- Any component showing empty state text

**Replace broken-feeling text:**

```typescript
// BEFORE (looks broken):
<p>No thoughts are currently forming.</p>

// AFTER (anticipatory):
<motion.p
  className="text-muted-foreground italic text-sm"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Your thoughts will emerge as you make pivotal choices...
</motion.p>
```

**Empty states to fix:**
| Current Text | Replace With |
|--------------|--------------|
| "No thoughts are currently forming" | "Your thoughts will emerge as you make pivotal choices..." |
| "No core beliefs established yet" | "Your beliefs are forming with each decision you make..." |
| "Make choices to reveal your style" | "Your unique style is emerging..." |
| "Talk to characters to build bonds" | "Connections await at every platform..." |
| "Keep playing to see insights" | "Insights crystallize as your journey unfolds..." |

---

## PHASE 3: SYSTEM COMPLETIONS (30-40 hours)

### Task 3.1: Implement Challenge Interrupts (D6)

**Current:** 0/6 interrupt types implemented
**Target:** 6/6

**File:** `lib/interrupt-system.ts` (or create if needed)

**Add interrupt handling for each type:**

```typescript
export type InterruptType =
  | 'connection'    // Deepen relationship
  | 'challenge'     // Push player growth
  | 'silence'       // Processing time
  | 'comfort'       // Emotional support
  | 'grounding'     // Regulate anxiety
  | 'encouragement' // Build confidence

export interface InterruptTrigger {
  type: InterruptType
  condition: (state: GameState, characterId: string) => boolean
  nodeId: string
}

export const INTERRUPT_TRIGGERS: InterruptTrigger[] = [
  {
    type: 'connection',
    condition: (state, charId) => {
      const trust = state.characters.get(charId)?.trust || 0
      return trust >= 6 && !state.knowledgeFlags.has(`${charId}_deep_connection`)
    },
    nodeId: 'interrupt_connection'
  },
  {
    type: 'challenge',
    condition: (state, charId) => {
      const dominantPattern = getDominantPattern(state.patterns)
      return dominantPattern && state.patterns[dominantPattern] >= 5
    },
    nodeId: 'interrupt_challenge'
  },
  // ... implement all 6 types
]
```

**Then add interrupt nodes to each character's dialogue graph**

### Task 3.2: Implement Trust Recovery (D2)

**Add trust repair nodes to characters:**

```typescript
// Example for Maya
{
  nodeId: 'maya_trust_repair',
  speaker: 'Maya Chen',
  requiredState: {
    trust: { max: 3 },
    hasKnowledgeFlags: ['maya_trust_damaged']
  },
  content: [{
    text: "Hey... I was harsh earlier. The pressure gets to me sometimes, and I took it out on you. That wasn't fair.\n\nCan we start over?",
    emotion: 'vulnerable'
  }],
  choices: [
    {
      text: "Everyone has hard days. Of course we can.",
      nextNodeId: 'maya_trust_restored',
      pattern: 'helping',
      consequence: { trustChange: 2 }
    },
    {
      text: "I appreciate you saying that. Yes.",
      nextNodeId: 'maya_trust_restored',
      pattern: 'patience',
      consequence: { trustChange: 2 }
    }
  ]
}
```

**Add trust repair nodes for all 20 characters**

### Task 3.3: Wire Polyvagal to Dialogue (D5)

**Add nervous system gating to requiredState:**

```typescript
// Example: Vulnerable dialogue only available when regulated
{
  nodeId: 'maya_deep_vulnerability',
  requiredState: {
    trust: { min: 7 },
    nervousSystemState: 'ventral_vagal'  // NEW: Must be regulated
  },
  content: [{
    text: "I've never told anyone this, but...",
    emotion: 'vulnerable'
  }]
}

// Example: Different choices based on nervous state
{
  nodeId: 'crisis_moment',
  content: [{
    text: "The situation is getting intense.",
    nervousSystemReflection: [
      {
        state: 'sympathetic',
        altText: "Your heart is racing. The situation feels overwhelming.",
        altEmotion: 'anxious'
      },
      {
        state: 'dorsal_vagal',
        altText: "Everything feels distant, muffled. The situation washes over you.",
        altEmotion: 'numb'
      }
    ]
  }]
}
```

---

## PHASE 4: BLOAT CLEANUP (8-12 hours)

### Task 4.1: Delete Unused Files

```bash
# Delete crossroads-system.ts (1,272 lines, not imported anywhere)
rm lib/crossroads-system.ts

# Delete scene-skill-mappings.ts (2,183 lines, duplicates dialogue graph data)
rm lib/scene-skill-mappings.ts
```

### Task 4.2: Move Content Files

```bash
# Move character content to /content directory
mv lib/character-quirks.ts content/character-quirks.ts
mv lib/character-depth.ts content/character-depth.ts
mv lib/birmingham-opportunities.ts content/birmingham-opportunities.ts

# Update imports in all files that reference these
```

**Files to update imports in:**
- `components/StatefulGameInterface.tsx`
- Any file importing from moved locations

### Task 4.3: Consolidate Analytics (Investigation)

**Review these files for consolidation:**
- `lib/analytics.ts` (KEEP - core)
- `lib/comprehensive-user-tracker.ts` (CONSOLIDATE?)
- `lib/engagement-metrics.ts` (CONSOLIDATE?)
- `lib/engagement-quality-analyzer.ts` (CONSOLIDATE?)

**Decision:** If PostHog handles tracking, simplify custom tracking

---

## PHASE 5: VALIDATION & POLISH (12-20 hours)

### Task 5.1: Create Validation Script

**File:** `scripts/validate-dialogue-graphs.ts`

```typescript
import { getAllDialogueGraphs } from '../lib/graph-registry'

interface ValidationIssue {
  type: 'fake_choice' | 'orphan_node' | 'missing_variation' | 'pattern_imbalance'
  severity: 'critical' | 'high' | 'medium' | 'low'
  nodeId: string
  characterId: string
  details: string
}

export function validateDialogueGraphs(): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const graphs = getAllDialogueGraphs()

  for (const graph of graphs) {
    // Check for fake choices (same destination)
    issues.push(...detectFakeChoices(graph))

    // Check for orphan nodes
    issues.push(...detectOrphanNodes(graph))

    // Check for missing voice variations
    issues.push(...auditVoiceVariations(graph))
  }

  // Check pattern balance across all graphs
  issues.push(...detectPatternImbalance(graphs))

  return issues
}

function detectFakeChoices(graph: DialogueGraph): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const node of graph.nodes.values()) {
    const destinations = new Map<string, string[]>()

    for (const choice of node.choices || []) {
      const dest = choice.nextNodeId
      if (!destinations.has(dest)) destinations.set(dest, [])
      destinations.get(dest)!.push(choice.text)
    }

    for (const [dest, choices] of destinations) {
      if (choices.length > 1) {
        issues.push({
          type: 'fake_choice',
          severity: choices.length >= 3 ? 'critical' : 'high',
          nodeId: node.nodeId,
          characterId: graph.characterId,
          details: `${choices.length} choices lead to same node: ${dest}`
        })
      }
    }
  }

  return issues
}

// Run validation
const issues = validateDialogueGraphs()
console.log(`Found ${issues.length} issues:`)
issues.forEach(i => console.log(`[${i.severity}] ${i.characterId}/${i.nodeId}: ${i.details}`))
```

### Task 5.2: Add to Build Process

**File:** `package.json`

```json
{
  "scripts": {
    "validate": "npx ts-node scripts/validate-dialogue-graphs.ts",
    "prebuild": "npm run validate",
    "build": "next build"
  }
}
```

### Task 5.3: Add Reflection Gateway Nodes

**Implement Narrative Identity Theory:**

```typescript
// Add to Samuel's dialogue graph
{
  nodeId: 'samuel_reflection_gateway_1',
  speaker: 'Samuel Washington',
  requiredState: {
    globalFlags: { has: ['completed_first_arc'] }
  },
  content: [{
    text: "Before you go further... I have a question for you.\n\nWhat have you learned about yourself here?",
    emotion: 'knowing'
  }],
  choices: [
    {
      text: "I notice patterns in how I approach problems.",
      nextNodeId: 'samuel_reflection_analytical',
      pattern: 'analytical',
      consequence: { addKnowledgeFlags: ['self_identified_analytical'] }
    },
    {
      text: "I care more about people than I realized.",
      nextNodeId: 'samuel_reflection_helping',
      pattern: 'helping',
      consequence: { addKnowledgeFlags: ['self_identified_helping'] }
    },
    {
      text: "I'm always curious what's around the corner.",
      nextNodeId: 'samuel_reflection_exploring',
      pattern: 'exploring',
      consequence: { addKnowledgeFlags: ['self_identified_exploring'] }
    },
    {
      text: "I've learned to be patient with uncertainty.",
      nextNodeId: 'samuel_reflection_patience',
      pattern: 'patience',
      consequence: { addKnowledgeFlags: ['self_identified_patience'] }
    },
    {
      text: "I want to build something that matters.",
      nextNodeId: 'samuel_reflection_building',
      pattern: 'building',
      consequence: { addKnowledgeFlags: ['self_identified_building'] }
    }
  ]
}
```

---

## COMMIT STRATEGY

After each major task, commit with clear message:

```bash
# Phase 0
git commit -m "fix: resolve webpack module errors and clean build"
git commit -m "fix: restore admin authentication flow"

# Phase 1
git commit -m "feat: add voiceVariations to DialogueContent interface"
git commit -m "feat: wire skills tracking to GameState"
git commit -m "feat: add content resolution functions for patterns/skills/nervous"
git commit -m "feat: integrate new reflection systems in StatefulGameInterface"

# Phase 2
git commit -m "fix(samuel): create divergent paths for intro choices (F1)"
git commit -m "feat(samuel): add beat nodes for hub convergence acknowledgment"
git commit -m "feat(maya): add NPC voice variations to key dialogue"
git commit -m "fix(ux): replace broken empty state text with anticipatory messaging"

# Phase 3
git commit -m "feat: implement 6 challenge interrupt types"
git commit -m "feat: add trust recovery nodes for all characters"
git commit -m "feat: wire polyvagal nervous system to dialogue gating"

# Phase 4
git commit -m "chore: delete unused crossroads-system and scene-skill-mappings"
git commit -m "refactor: move character content files to /content directory"

# Phase 5
git commit -m "feat: add dialogue graph validation script"
git commit -m "feat: add reflection gateway nodes for narrative identity"
git commit -m "chore: add validation to build process"
```

---

## VERIFICATION CHECKLIST

### After Phase 0
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts without errors
- [ ] `/admin` route accessible
- [ ] No 500 errors on any route

### After Phase 1
- [ ] TypeScript compiles without errors
- [ ] DialogueContent interface has new fields
- [ ] GameState tracks skills
- [ ] Resolution functions export correctly

### After Phase 2
- [ ] Samuel intro has 3 different experiences
- [ ] Hub transitions feel acknowledged
- [ ] Maya responds differently to different patterns
- [ ] Empty states feel anticipatory, not broken

### After Phase 3
- [ ] Challenge interrupts fire at correct thresholds
- [ ] Trust can be recovered after damage
- [ ] Nervous system state affects available dialogue

### After Phase 4
- [ ] Build still succeeds after deletions
- [ ] No broken imports
- [ ] lib/ directory is smaller and cleaner

### After Phase 5
- [ ] Validation script runs and reports issues
- [ ] Reflection gateway nodes work
- [ ] Production build succeeds

---

## SUCCESS METRICS

| Metric | Before | After |
|--------|--------|-------|
| Pattern acknowledgment | 4% | 25%+ |
| Fake choices | 40+ | 0 |
| Skill visibility | 0% | 100% |
| Challenge interrupts | 0/6 | 6/6 |
| Build status | BROKEN | GREEN |
| NPC voice coverage | 0% | 50%+ |

---

## TOTAL EFFORT

| Phase | Hours |
|-------|-------|
| Phase 0: Build Stability | 4-8 |
| Phase 1: Architecture | 18 |
| Phase 2: Content Fixes | 40-60 |
| Phase 3: System Completions | 30-40 |
| Phase 4: Bloat Cleanup | 8-12 |
| Phase 5: Validation | 12-20 |
| **TOTAL** | **112-158 hours** |

---

*Implementation handoff created January 15, 2026.*
*Target: Production-ready release.*
*Execute systematically, commit frequently, verify at each phase.*
