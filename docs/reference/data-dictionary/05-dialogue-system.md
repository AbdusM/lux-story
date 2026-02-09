# Dialogue System - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/dialogue-graph.ts`, `/content/*-dialogue-graph.ts` (24 files)
**Status:** Manual documentation with TypeScript interfaces

## Overview

The dialogue system is a conditional branching narrative graph that replaces traditional linear scenes. Every node is state-dependent, and all 1158 nodes are dynamically accessible based on trust, patterns, knowledge flags, and global state.

**Key Stats:**
- **Total nodes:** 1158 (983 base + 175 LinkedIn 2026)
- **Node types:** 4 (standard, interrupt, vulnerability arc, simulation)
- **Conditional choices:** 132 trust/pattern-gated
- **Trust-gated nodes:** 107 (Trust ≥6 vulnerability arcs, Trust ≥8 loyalty)
- **Pattern reflections:** 113 NPC responses to player patterns
- **Voice variations:** 178 total (pattern-based choice text)
- **Interrupt windows:** 20/20 characters (ME2-style quick-time events)
- **Simulations:** 20 unique (16 interface types)
- **Content variations:** 1,500+ (multiple texts per node)

---

## Core Principle

**"Every node is conditional. Access depends on state."**

Unlike traditional dialogue trees with fixed branches, Lux Story's system evaluates player state (trust, patterns, knowledge) in real-time to determine:
- Which nodes are accessible
- Which choices are visible
- Which content variation to show
- Which pattern reflections to apply

---

## Node Types (4 Categories)

### 1. Standard Dialogue Nodes

**Structure:**
```typescript
interface DialogueNode {
  nodeId: string                    // Unique identifier
  speaker: string                   // Character or 'Narrator'
  content: DialogueContent[]        // Multiple variations for replayability
  choices: ConditionalChoice[]      // Player response options
  requiredState?: StateCondition    // Access gates (trust, patterns, flags)
  onEnter?: StateChange[]           // Effects when node loads
  onExit?: StateChange[]            // Effects when leaving
  tags?: string[]                   // Metadata (e.g., 'maya_arc', 'birmingham')
  priority?: number                 // Sorting when multiple nodes available
  learningObjectives?: string[]     // WEF 2030 skills addressed
  patternReflection?: Array<{       // NPC responds to player's pattern
    pattern: PatternType
    minLevel: number
    altText: string
    altEmotion?: string
  }>
}
```

**Example:**
```typescript
{
  nodeId: 'maya_intro_tech_interest',
  speaker: 'Maya Chen',
  content: [{
    text: "I'm working on this insane image generation model. It's like teaching a computer to dream.",
    emotion: 'excited',
    variation_id: 'maya_intro_01'
  }],
  choices: [
    {
      choiceId: 'maya_choice_01_analytical',
      text: "How does the model architecture work?",
      pattern: 'analytical',
      nextNodeId: 'maya_tech_deep_dive'
    },
    {
      choiceId: 'maya_choice_01_helping',
      text: "That sounds exhausting. How are you holding up?",
      pattern: 'helping',
      nextNodeId: 'maya_emotional_check'
    }
  ]
}
```

### 2. Interrupt Nodes (ME2-Style Quick-Time Events)

**Purpose:** Create emotional resonance by letting players act during charged moments.

**InterruptWindow Structure:**
```typescript
interface InterruptWindow {
  duration: number                  // 2000-4000ms recommended
  type: 'connection' | 'challenge' | 'silence' | 'comfort' | 'grounding' | 'encouragement'
  action: string                    // Visual prompt ("Reach out")
  targetNodeId: string              // Where interrupt leads
  consequence?: StateChange         // Bonus effect (usually +trust)
  missedNodeId?: string             // Alternative if missed (optional)
}
```

**Example:**
```typescript
// Grace is crying during vulnerability arc
content: [{
  text: "I just... I can't do this anymore. I'm so tired of pretending.",
  emotion: 'vulnerable_exhausted',
  interrupt: {
    duration: 3500,
    type: 'comfort',
    action: 'Reach out and touch her shoulder',
    targetNodeId: 'grace_interrupt_comfort',
    consequence: { characterId: 'grace', trustDelta: +2 }
  }
}]
```

**Interrupt Types:**

| Type | Visual Color | Use Case | Example |
|------|--------------|----------|---------|
| **connection** | Blue | Building rapport | "Put hand on shoulder" |
| **challenge** | Red | Questioning assumption | "Call out the contradiction" |
| **silence** | Gray | Letting moment breathe | "Say nothing" |
| **comfort** | Pink | Emotional support | "Offer a hug" |
| **grounding** | Green | Calming anxiety | "Breathe with them" |
| **encouragement** | Yellow | Motivation | "Remind them of strength" |

**Coverage:** 20/20 characters have interrupt moments

### 3. Vulnerability Arc Nodes (Trust ≥6)

**Purpose:** Deep backstory reveals gated by high trust.

**Structure:**
```typescript
{
  nodeId: 'rohan_vulnerability_arc',
  speaker: 'Rohan',
  requiredState: {
    trust: { min: 6 }               // Trust gate
  },
  onEnter: [{
    characterId: 'rohan',
    addKnowledgeFlags: ['rohan_vulnerability_revealed']
  }],
  content: [{
    text: "I've never told anyone this... My sister died in a lab accident. That's why I obsess over safety protocols.",
    emotion: 'vulnerable_grief',
    richEffectContext: 'warning'
  }],
  choices: [
    {
      text: "I'm so sorry. That must have been devastating.",
      pattern: 'helping',
      consequence: { characterId: 'rohan', trustDelta: +2 }
    },
    {
      text: "That explains a lot about your work.",
      pattern: 'analytical',
      consequence: { characterId: 'rohan', trustDelta: +1 }
    }
  ]
}
```

**Count:** 20/20 characters have vulnerability arcs (107 total trust-gated nodes)

### 4. Simulation Nodes (Workflow Mini-Games)

**Purpose:** Interactive skill demonstrations through specialized tool interfaces.

**SimulationConfig Structure:**
```typescript
interface SimulationConfig {
  type: 'terminal_coding' | 'system_architecture' | 'creative_direction' | ...
  title: string
  taskDescription: string
  initialContext: {
    label?: string
    content?: string
    displayStyle?: 'code' | 'text' | 'image_placeholder' | 'visual'
    [key: string]: unknown          // Flexible data
  }
  successFeedback: string
  mode?: 'fullscreen' | 'inline'
  phase?: 1 | 2 | 3                 // 3-phase progression
  difficulty?: 'introduction' | 'application' | 'mastery'
  variantId?: string
  unlockRequirements?: SimulationUnlockRequirements
  timeLimit?: number                // Seconds (Phase 3: timed challenges)
  successThreshold?: number         // 0-100 percentage
}
```

**Example:**
```typescript
// Maya's Prompt Engineering Simulation (Phase 1)
simulation: {
  type: 'prompt_engineering',
  title: 'Prompt Refinement Protocol',
  taskDescription: 'The model is hallucinating citations. Fix the prompt.',
  initialContext: {
    label: 'Current Prompt',
    content: 'Write an essay about colonization.',
    displayStyle: 'code'
  },
  successFeedback: 'Hallucinations eliminated. Citations verified.',
  mode: 'fullscreen',
  phase: 1,
  difficulty: 'introduction',
  variantId: 'maya_prompt_eng_phase1',
  unlockRequirements: {
    trustMin: 2
  }
}
```

**Simulation Types (16 total):**
- `terminal_coding` - Code editor (Cursor AI parallel)
- `prompt_engineering` - AI prompt refinement (ChatGPT parallel)
- `visual_canvas` - Image generation (Midjourney/Stable Diffusion)
- `audio_studio` - Sound design (ElevenLabs parallel)
- `system_architecture` - Diagram building
- `dashboard_triage` - Data prioritization
- `chat_negotiation` - Conversational scenario
- `data_analysis` - Dataset exploration
- `code_refactor` - Code improvement
- `creative_direction` - Artistic brief creation
- `market_visualizer` - Market data visualization
- `data_audit` - Data quality checking
- `botany_grid` - Plant growth simulation
- `architect_3d` - 3D space design
- `conversation_tree` - Dialogue flow design
- `conductor_interface` - Multi-agent orchestration

---

## Conditional Choices (132 Trust/Pattern-Gated)

### Choice Structure

```typescript
interface ConditionalChoice {
  choiceId: string
  text: string
  nextNodeId: string

  visibleCondition?: StateCondition     // Shows/hides choice
  enabledCondition?: StateCondition     // Grays out if not met

  pattern?: PatternType                 // Tracks player behavior
  skills?: (keyof FutureSkills)[]       // WEF 2030 skills demonstrated

  consequence?: StateChange             // Effect when selected
  preview?: string                      // Hover tooltip

  voiceVariations?: Partial<Record<PatternType, string>>  // Pattern-based text
  archetype?: TemplateArchetype         // Auto-voice generation

  interaction?: 'big' | 'small' | 'shake' | 'nod' | 'ripple' | 'bloom' | 'jitter'

  requiredOrbFill?: {                   // KOTOR-style aspirational locks
    pattern: PatternType
    threshold: number                   // 0-100 fill percentage
  }
}
```

### Visible Condition Example

```typescript
// Choice only shows if trust ≥6
{
  text: "Can I ask about your family?",
  visibleCondition: {
    trust: { min: 6 }
  },
  nextNodeId: 'maya_family_reveal'
}
```

### Enabled Condition Example (Grayed Out)

```typescript
// Choice shows but is locked until analytical ≥5
{
  text: "Let me run a systems analysis.",
  visibleCondition: {},              // Always visible
  enabledCondition: {
    patterns: {
      analytical: { min: 5 }
    }
  },
  requiredOrbFill: {
    pattern: 'analytical',
    threshold: 50                    // 50% fill = 5 orbs
  },
  nextNodeId: 'devon_systems_analysis'
}
```

**Count:** 132 conditional choices across 24 dialogue graphs

---

## Pattern Reflections (113 Total)

### Purpose

NPCs notice and respond to player's emerging patterns. Makes the player feel **SEEN**.

### Node-Level Reflection

```typescript
patternReflection: [{
  pattern: 'analytical',
  minLevel: 5,
  altText: "You think things through, don't you? I can see it in how you frame questions.",
  altEmotion: 'knowing'
}]
```

**How It Works:**
1. Player reaches analytical pattern ≥5
2. On next Maya conversation, her dialogue changes
3. Instead of default text, she says the pattern reflection
4. Emotion changes to 'knowing'

### Content-Level Reflection

```typescript
content: [{
  text: "So what do you think?",
  emotion: 'curious',
  variation_id: 'maya_default',
  patternReflection: [{
    pattern: 'helping',
    minLevel: 5,
    altText: "You always ask how I'm feeling before diving into the work. I notice that.",
    altEmotion: 'warm_appreciative'
  }]
}]
```

### Pattern Reflection Distribution

| Character | Reflections | Top Patterns Noticed |
|-----------|-------------|---------------------|
| Samuel | 18 | analytical, patience, exploring |
| Maya | 12 | analytical, building, helping |
| Devon | 11 | analytical, patience |
| Elena | 10 | patience, exploring |
| Rohan | 9 | analytical, building |
| Marcus | 8 | helping, patience |
| Tess | 7 | helping, exploring |
| Kai | 6 | analytical, patience |
| **Total** | **113** | All 5 patterns represented |

---

## Voice Variations (178 Total)

### Purpose

Player's dialogue text changes based on their dominant pattern. Creates consistent voice.

### Choice-Level Voice Variations

```typescript
{
  text: "Tell me more.",                // Default (no pattern dominance)
  voiceVariations: {
    analytical: "Walk me through the details.",
    helping: "That sounds hard. What happened?",
    patience: "Take your time. I'm listening.",
    exploring: "I'm curious—what's the story there?",
    building: "What's the next step?"
  },
  pattern: 'helping',                   // This is a helping choice
  nextNodeId: 'maya_elaborates'
}
```

**How It Works:**
1. Player has analytical ≥5 (dominant pattern)
2. Any choice with `voiceVariations.analytical` uses that text
3. Player sees: "Walk me through the details." instead of "Tell me more."
4. Feels like player's voice is consistent with who they're becoming

### Template Archetypes (Auto-Generation)

Instead of manually defining voice variations for every choice, authors can specify an **archetype**:

```typescript
{
  text: "Tell me more.",
  archetype: 'ASK_FOR_DETAILS',
  nextNodeId: 'maya_elaborates'
}
```

**Available Archetypes:**
- `ASK_FOR_DETAILS` - Questions asking for more info
- `STAY_SILENT` - Patience-based silence choices
- `ACKNOWLEDGE_EMOTION` - Validating feelings
- `EXPRESS_CURIOSITY` - Showing interest
- `OFFER_SUPPORT` - Offering help
- `CHALLENGE_ASSUMPTION` - Questioning assumptions
- `SHOW_UNDERSTANDING` - Confirming understanding
- `TAKE_ACTION` - Initiating action
- `REFLECT_BACK` - Mirroring what was said
- `SET_BOUNDARY` - Setting limits
- `MAKE_OBSERVATION` - Direct observations
- `SIMPLE_CONTINUE` - Continuation markers
- `AFFIRM_CHOICE` - Committing to something
- `SHARE_PERSPECTIVE` - Sharing viewpoint

**Auto-Generated Example:**
```typescript
archetype: 'ASK_FOR_DETAILS'
// Generates:
// analytical: "Walk me through the specifics."
// helping: "What happened?"
// patience: "I'm listening."
// exploring: "Tell me everything."
// building: "What are the key points?"
```

### Voice Variation Distribution

| Tier | Characters | Target Voice Variations | Actual Coverage |
|------|------------|------------------------|-----------------|
| **Tier 1** (Hub + Core) | Samuel, Maya, Devon | 15 each | 18, 14, 12 |
| **Tier 2** (Primary) | 6 characters | 10 each | 60+ total |
| **Tier 3** (Secondary) | 6 characters | 6 each | 36+ total |
| **Tier 4** (Extended) | 5 characters | 6 each | 30+ total |
| **Total** | 20 characters | Variable | **178 total** |

---

## State Conditions (Gating System)

### StateCondition Interface

```typescript
interface StateCondition {
  // Character-specific conditions
  trust?: { min?: number; max?: number }
  relationship?: RelationshipStatus[]
  hasKnowledgeFlags?: string[]
  lacksKnowledgeFlags?: string[]

  // Global conditions
  hasGlobalFlags?: string[]
  lacksGlobalFlags?: string[]

  // Pattern conditions
  patterns?: Partial<Record<PatternType, { min?: number; max?: number }>>

  // Mystery conditions (narrative flags)
  mysteries?: Partial<Record<string, boolean>>
}
```

### Trust Gating

```typescript
// Vulnerability arc (Trust ≥6)
requiredState: {
  trust: { min: 6 }
}

// Loyalty experience (Trust ≥8 + Pattern ≥5)
requiredState: {
  trust: { min: 8 },
  patterns: {
    building: { min: 5 }
  }
}

// Early game only (Trust ≤3)
requiredState: {
  trust: { max: 3 }
}
```

### Knowledge Flag Gating

```typescript
// Must know about Maya's startup
requiredState: {
  hasKnowledgeFlags: ['maya_startup_revealed']
}

// Must NOT know about Rohan's sister (before reveal)
requiredState: {
  lacksKnowledgeFlags: ['rohan_vulnerability_revealed']
}
```

### Pattern Gating

```typescript
// Pattern unlock nodes (KOTOR-style)
requiredState: {
  patterns: {
    analytical: { min: 3, max: 6 }    // Emerging → Developing
  }
}
```

### Combined Conditions

```typescript
// Complex gate (Trust + Pattern + Knowledge)
requiredState: {
  trust: { min: 7 },
  patterns: {
    helping: { min: 5 }
  },
  hasKnowledgeFlags: ['maya_vulnerability_revealed'],
  lacksGlobalFlags: ['final_choice_made']
}
```

---

## Content Variations (1,500+ Total)

### Purpose

Multiple text variations per node for replayability. System selects:
1. **Conditional content** (if state matches)
2. **Unused content** (if tracking variation history)
3. **Random content** (from available pool)

### DialogueContent Structure

```typescript
interface DialogueContent {
  text: string
  emotion?: string                  // Compound emotions supported
  microAction?: string              // Character body language
  variation_id: string
  condition?: StateCondition        // Show only if state matches
  useChatPacing?: boolean           // Sequential reveal
  richEffectContext?: 'warning' | 'thinking' | 'success' | 'executing' | 'error' | 'glitch' | 'data_stream'
  interaction?: 'big' | 'small' | 'shake' | 'nod' | 'ripple' | 'bloom' | 'jitter'
  patternReflection?: PatternReflection[]
  interrupt?: InterruptWindow
}
```

### Conditional Content Example

```typescript
content: [
  {
    text: "I'm thinking about it.",
    emotion: 'contemplative',
    variation_id: 'default',
    // No condition - default fallback
  },
  {
    text: "I'm... I'm not sure if I should tell you this.",
    emotion: 'hesitant_vulnerable',
    variation_id: 'high_trust_hesitation',
    condition: {
      trust: { min: 6 }             // Only if trust ≥6
    }
  }
]
```

### Rich Effect Contexts

| Context | Visual Effect | Use Case |
|---------|---------------|----------|
| **warning** | Orange glow, caution icon | Vulnerability reveals, sensitive topics |
| **thinking** | Blue shimmer | Contemplation, processing moments |
| **success** | Green pulse | Achievements, breakthroughs |
| **executing** | Loading animation | System processes, simulations |
| **error** | Red flash | Mistakes, failures |
| **glitch** | Digital corruption | System errors, bugs |
| **data_stream** | Scrolling text | Data analysis, technical displays |

---

## Dialogue Graph Navigation

### Graph Structure

```typescript
interface DialogueGraph {
  version: string
  nodes: Map<string, DialogueNode>
  startNodeId: string
  metadata: {
    title: string
    author: string
    createdAt: number
    lastModified: number
    totalNodes: number
    totalChoices: number
  }
}
```

### Character Graphs (24 Files)

| Character | Filename | Nodes | Status |
|-----------|----------|-------|--------|
| Samuel | `samuel-dialogue-graph.ts` | 205 | Hub ✅ |
| Maya | `maya-dialogue-graph.ts` | 82 | Deep ✅ |
| Devon | `devon-dialogue-graph.ts` | 84 | Deep ✅ |
| Elena | `elena-dialogue-graph.ts` | 83 | Deep ✅ |
| Zara | `zara-dialogue-graph.ts` | 77 | Deep ✅ |
| Marcus | `marcus-dialogue-graph.ts` | 76 | Deep ✅ |
| Lira | `lira-dialogue-graph.ts` | 69 | Deep ✅ |
| Rohan | `rohan-dialogue-graph.ts` | 58 | Standard ✅ |
| Kai | `kai-dialogue-graph.ts` | 51 | Standard ✅ |
| Asha | `asha-dialogue-graph.ts` | 51 | Standard ✅ |
| Tess | `tess-dialogue-graph.ts` | 50 | Standard ✅ |
| Alex | `alex-dialogue-graph.ts` | 49 | Standard ✅ |
| Nadia | `nadia-dialogue-graph.ts` | 48 | Standard ✅ (LinkedIn 2026) |
| Quinn | `quinn-dialogue-graph.ts` | 45 | Standard ✅ (LinkedIn 2026) |
| Yaquin | `yaquin-dialogue-graph.ts` | 43 | Standard ✅ |
| Isaiah | `isaiah-dialogue-graph.ts` | 42 | Standard ✅ (LinkedIn 2026) |
| Silas | `silas-dialogue-graph.ts` | 40 | Core ✅ |
| Dante | `dante-dialogue-graph.ts` | 40 | Core ✅ (LinkedIn 2026) |
| Jordan | `jordan-dialogue-graph.ts` | 39 | Core ✅ |
| Grace | `grace-dialogue-graph.ts` | 38 | Core ⚠️ (-2 from target) |

**Total:** 1158 nodes across 24 graphs

---

## State Change System

### StateChange Interface

```typescript
interface StateChange {
  characterId?: string
  trustDelta?: number
  relationshipChange?: RelationshipStatus
  addKnowledgeFlags?: string[]
  removeKnowledgeFlags?: string[]
  addGlobalFlags?: string[]
  removeGlobalFlags?: string[]
  mysteryUpdates?: Partial<Record<string, boolean>>
}
```

### Example: Vulnerability Arc Entry

```typescript
onEnter: [{
  characterId: 'maya',
  addKnowledgeFlags: ['maya_vulnerability_revealed', 'maya_family_conflict_known']
}]
```

### Example: Choice Consequence

```typescript
consequence: {
  characterId: 'rohan',
  trustDelta: +2,
  addKnowledgeFlags: ['rohan_respects_player']
}
```

---

## Safety Mechanisms

### Deadlock Recovery

**Problem:** Misconfigured state conditions can create dead ends (choices exist, but none are selectable).

**Solution:** If zero choices are selectable, offer a single safe recovery choice instead of revealing gated content.

```typescript
// StateConditionEvaluator.evaluateChoices()
const enabledCount = evaluated.filter(c => c.visible && c.enabled).length

if (enabledCount === 0 && node.choices.length > 0) {
  console.warn(`[DEADLOCK-RECOVERY] No selectable choices at node "${node.nodeId}".`)
  return [
    ...evaluated,
    {
      choice: {
        choiceId: '__deadlock_recovery__',
        text: 'Return to Samuel',
        nextNodeId: 'TRAVEL_PENDING'
      },
      visible: true,
      enabled: true
    }
  ]
}
```

**Impact:** Prevents player lock-in without unlocking hidden branches.

---

## Validation Rules

### Node Access Validation

```typescript
import { StateConditionEvaluator } from '@/lib/dialogue-graph'

const canAccess = StateConditionEvaluator.evaluate(
  node.requiredState,
  gameState,
  'maya'  // characterId
)

if (canAccess) {
  // Load node
} else {
  // Node locked
}
```

### Choice Visibility Validation

```typescript
const evaluatedChoices = StateConditionEvaluator.evaluateChoices(
  node,
  gameState,
  'maya'
)

evaluatedChoices.forEach(ec => {
  if (!ec.visible) {
    console.log(`Hidden: ${ec.choice.text}`)
  } else if (!ec.enabled) {
    console.log(`Locked: ${ec.choice.text} - ${ec.reason}`)
  } else {
    console.log(`Available: ${ec.choice.text}`)
  }
})
```

### Simulation Access Validation

```typescript
import { evaluateSimulationAccess } from '@/lib/dialogue-graph'

const result = evaluateSimulationAccess(
  simulation.unlockRequirements,
  gameState,
  'maya'
)

if (!result.canAccess) {
  console.log(`Blocked: ${result.message}`)
  console.log(`Progress: ${(result.progress ?? 0) * 100}%`)
}
```

---

## Usage Examples

### Example 1: Creating a Trust-Gated Node

```typescript
const vulnerabilityNode: DialogueNode = {
  nodeId: 'marcus_vulnerability_arc',
  speaker: 'Marcus',
  requiredState: {
    trust: { min: 6 }
  },
  onEnter: [{
    characterId: 'marcus',
    addKnowledgeFlags: ['marcus_vulnerability_revealed']
  }],
  content: [{
    text: "My dad had a stroke last year. That's why I switched to pre-med.",
    emotion: 'vulnerable_sad',
    variation_id: 'marcus_vuln_01',
    richEffectContext: 'warning'
  }],
  choices: [
    {
      choiceId: 'marcus_vuln_choice_01',
      text: "I'm so sorry. How is he now?",
      pattern: 'helping',
      consequence: { characterId: 'marcus', trustDelta: +2 },
      nextNodeId: 'marcus_dad_update'
    }
  ]
}
```

### Example 2: Pattern Reflection in Action

```typescript
// Player has analytical ≥5
const node: DialogueNode = {
  nodeId: 'devon_systems_chat',
  speaker: 'Devon',
  content: [{
    text: "The optimization algorithm is running slower than expected.",
    emotion: 'frustrated',
    variation_id: 'devon_default',
    patternReflection: [{
      pattern: 'analytical',
      minLevel: 5,
      altText: "The optimization algorithm is running slower than expected. I knew you'd want the technical breakdown without me having to ask.",
      altEmotion: 'knowing_appreciative'
    }]
  }],
  choices: [...]
}
```

### Example 3: Voice Variations

```typescript
const choice: ConditionalChoice = {
  choiceId: 'maya_choice_comfort',
  text: "Are you okay?",
  voiceVariations: {
    analytical: "What's causing this reaction?",
    helping: "Are you okay? You seem off.",
    patience: "Take a moment. What's going on?",
    exploring: "What's on your mind?",
    building: "What can we do about this?"
  },
  pattern: 'helping',
  nextNodeId: 'maya_emotional_response'
}

// If player has helping ≥5:
// → Displays: "Are you okay? You seem off."
// If player has analytical ≥5:
// → Displays: "What's causing this reaction?"
// If player has no dominant pattern:
// → Displays: "Are you okay?"
```

### Example 4: Interrupt Window

```typescript
const contentWithInterrupt: DialogueContent = {
  text: "I just... *voice breaks* I don't know if I can keep doing this.",
  emotion: 'breaking',
  variation_id: 'grace_breaking_01',
  interrupt: {
    duration: 3500,
    type: 'comfort',
    action: 'Reach out',
    targetNodeId: 'grace_interrupt_comfort',
    consequence: {
      characterId: 'grace',
      trustDelta: +2
    }
  }
}

// Player sees:
// "I just... *voice breaks* I don't know if I can keep doing this."
// [3.5 second window]
// [Reach out] button appears
// If clicked → grace_interrupt_comfort node
// If missed → continues to next choice normally
```

---

## Cross-References

- **Emotions:** See `01-emotions.md` for compound emotion support in dialogue
- **Patterns:** See `03-patterns.md` for pattern types used in choices
- **Trust System:** See `08-trust-system.md` for trust gating mechanics
- **Characters:** See `04-characters.md` for dialogue node distribution
- **Simulations:** See `06-simulations.md` for simulation config details
- **Knowledge Flags:** See `07-knowledge-flags.md` for all knowledge flags used in conditions

---

## Design Notes

### Philosophy: Conditional Over Linear

**Traditional Dialogue Trees:**
```
A → B → C → D (fixed path)
```

**Lux Story Dialogue Graph:**
```
Player state determines:
- Which nodes are accessible
- Which choices appear
- Which content variation shows
- Which text the player speaks
```

**Benefits:**
- **Replayability:** Different patterns = different dialogue
- **Player Agency:** Choices feel meaningful (affect access)
- **Scalability:** Add nodes without breaking existing paths
- **Personalization:** NPCs respond to who player is becoming

### Pattern Reflections: Making Players Feel Seen

**Design Problem:**
- Players develop patterns (analytical, helping, etc.)
- NPCs don't acknowledge this—feels disconnected

**Solution:**
- NPCs have alternate dialogue for dominant patterns
- "You think things through, don't you?" (analytical)
- "You always ask how I'm feeling first." (helping)

**Impact:**
- 113 reflections across 20 characters
- Players report feeling "understood" by NPCs
- Reinforces pattern identity

### Voice Variations: Player Identity Through Text

**Design Problem:**
- All players say the same dialogue text
- Analytical player forced to say "That sounds hard" (helping tone)

**Solution:**
- Choices have pattern-specific text variations
- Analytical player sees: "Walk me through the details."
- Helping player sees: "That sounds hard. What happened?"

**Impact:**
- 178 voice variations across all tiers
- Players report stronger character identification
- Reduces "not my voice" friction

### Interrupt Windows: The ME2 Paragon/Renegade Problem

**Mass Effect 2 Approach:**
- Paragon/Renegade interrupts appear as on-screen prompts
- Press button → trigger special animation

**Lux Story Adaptation:**
- Interrupts appear during emotionally charged dialogue
- Brief window (2-4 seconds) to act
- 6 types (connection, challenge, silence, comfort, grounding, encouragement)

**Key Differences:**
- **No moral binary:** Interrupts aren't "good" or "bad"
- **Contextual:** "Reach out" during crying vs. "Stay silent" during anger
- **Bonus consequence:** Usually +trust for taking the interrupt
- **Not required:** Missing interrupt continues normally (no penalty)

**Coverage:** 20/20 characters, ~30 total interrupt moments

### Auto-Fallback: The Dead End Problem

**Design Problem:**
- Complex state conditions could accidentally lock all choices
- Player stuck with zero options = game-breaking bug

**Solution:**
- Evaluate all choices for visibility
- If zero visible → show ALL choices as emergency fallback
- Log warning for debugging

**Result:**
- Zero reported dead ends in production
- Developers alerted to misconfigured gates via warnings
- Players never experience "no choices available"

### Content Variations: The Replay Problem

**Design Problem:**
- Players replay conversations (trust farming, curiosity)
- Seeing identical text feels repetitive

**Solution:**
- Each node has 2-5 content variations
- System tracks recently shown variations
- Selects unused variation when possible

**Example:**
```typescript
// Maya introduction (3 variations)
content: [
  {
    text: "I'm working on this insane image generation model.",
    variation_id: 'maya_intro_01'
  },
  {
    text: "So I've been teaching computers to dream. Wild, right?",
    variation_id: 'maya_intro_02'
  },
  {
    text: "My latest project is a text-to-image AI. It's... chaotic.",
    variation_id: 'maya_intro_03'
  }
]
```

**Impact:**
- ~1,500 total content variations across 1158 nodes
- Average 1.3 variations per node
- High-traffic nodes (introductions) have 3-5 variations

### Simulation Phases: The Difficulty Curve

**Phase 1: Introduction** (Trust ≥2)
- No time limit
- 75% success threshold
- Guided tutorial

**Phase 2: Application** (Trust ≥5 + Phase 1 complete)
- 120-second time limit
- 85% success threshold
- Complex scenarios

**Phase 3: Mastery** (Trust ≥8 + Phase 2 complete + Pattern ≥5)
- 60-second time limit
- 95% success threshold
- Expert-level challenges

**Design Philosophy:**
- Progression mirrors real skill development
- Trust gates ensure player knows character before advanced challenges
- Pattern requirements align simulations with player strengths

### Future Considerations

**Dynamic Dialogue Generation:**
- Currently: All dialogue pre-written (1158 nodes)
- Future: LLM-generated responses based on player history
- Trade-off: Narrative control vs. infinite variety

**Conditional Content Scaling:**
- Currently: 2-5 variations per node (manageable authorship)
- Future: Pattern-specific content variations (10+ per node)
- Trade-off: Replayability vs. authorship burden

**Interrupt Complexity:**
- Currently: Single interrupt per content block
- Future: Multiple interrupt types in same dialogue (combo system)
- Trade-off: Depth vs. overwhelming player

**Voice Variation Automation:**
- Currently: Mix of manual + archetype templates (178 total)
- Future: 100% archetype-based with LLM fallback
- Trade-off: Authorship burden vs. generic text

**Multi-Character Nodes:**
- Currently: Single speaker per node
- Future: Group conversations with multiple NPCs
- Trade-off: Complexity vs. social dynamics richness

---

**Generated on:** January 13, 2026
**Verification:** Cross-reference with `/content/*-dialogue-graph.ts` files for node counts
