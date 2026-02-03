# Grand Central Terminus - Complete Game Architecture

**Version:** 2.2.0
**Last Updated:** February 2026
**Total Codebase:** ~50,000 lines across 200+ files

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Data Flow & State Management](#3-data-flow--state-management)
4. [Dialogue & Narrative System](#4-dialogue--narrative-system)
5. [Character System](#5-character-system)
6. [Pattern & Data Dictionary Systems](#6-pattern--data-dictionary-systems)
7. [Skills & Emotions](#7-skills--emotions)
8. [UI Components & Rendering](#8-ui-components--rendering)
9. [Animation System](#9-animation-system)
10. [Hooks Architecture](#10-hooks-architecture)
11. [Persistence & Sync](#11-persistence--sync)
12. [Audio & Haptics](#12-audio--haptics)
13. [Accessibility](#13-accessibility)
14. [Testing & Validation](#14-testing--validation)
15. [File Reference Index](#15-file-reference-index)

---

## 1. Executive Summary

Grand Central Terminus is a **dialogue-driven career exploration game** targeting Birmingham youth (ages 14-24). Built with Next.js 15, TypeScript, and Framer Motion, it uses a sophisticated branching narrative system with 20 characters and 1,877 dialogue nodes.

### Core Philosophy
- **Feel Comes First** - Game must feel good within 30 seconds
- **Dialogue-Driven** - Pokemon/Disco Elysium style, no stat screens
- **Silent Pattern Tracking** - Player identity revealed through choices, not numbers
- **Consequence Echoes** - Choices ripple through character relationships

### Key Metrics

| Metric | Count |
|--------|-------|
| Characters | 20 |
| Dialogue Nodes | 1,877 |
| Dialogue Choices | 2,694+ |
| Skills Tracked | 54 |
| Patterns | 5 |
| Emotions | 392 primary |
| Simulations | 71 |
| Relationship Edges | 68 |
| React Hooks | 36+ |
| Utility Modules | 120+ |

---

## 2. System Architecture Overview

### Technology Stack

```
Frontend:        Next.js 15.5.9 + React 19
Language:        TypeScript (strict mode)
State:           Zustand + localStorage
Animations:      Framer Motion
Styling:         Tailwind CSS
Database:        Supabase (optional, offline-first)
Deployment:      Vercel
```

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION                            │
│  StatefulGameInterface.tsx (3,363 lines - "God Component")      │
│  ├─ GameMessage, GameChoice, RichTextRenderer                   │
│  ├─ Journal, Constellation, Patterns panels                     │
│  └─ InterruptButton, CharacterAvatar                            │
├─────────────────────────────────────────────────────────────────┤
│                         GAME LOGIC                              │
│  useChoiceHandler.ts (1,606 lines - 23 consequence evaluators)  │
│  ├─ GameLogic.processChoice() - Pure function                   │
│  ├─ StateConditionEvaluator - Branching logic                   │
│  └─ DialogueGraphNavigator - Content selection                  │
├─────────────────────────────────────────────────────────────────┤
│                         STATE LAYER                             │
│  GameState (Zustand) ←→ localStorage ←→ SyncQueue → Supabase   │
│  ├─ 20 CharacterState entries                                   │
│  ├─ PlayerPatterns, SkillLevels                                 │
│  └─ GlobalFlags, KnowledgeFlags                                 │
├─────────────────────────────────────────────────────────────────┤
│                         CONTENT LAYER                           │
│  content/*-dialogue-graph.ts (28 graphs)                        │
│  ├─ DialogueNode, ConditionalChoice                             │
│  ├─ SimulationConfig, InterruptWindow                           │
│  └─ PatternVoiceLibrary, ConsequenceEchoes                      │
└─────────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Lines | Purpose |
|------|-------|---------|
| `components/StatefulGameInterface.tsx` | 3,363 | Main game orchestrator |
| `hooks/useChoiceHandler.ts` | 1,606 | Choice processing pipeline |
| `lib/dialogue-graph.ts` | 1,015 | Core type definitions |
| `lib/character-state.ts` | 800+ | State types & transformations |
| `lib/emotions.ts` | 804 | Emotion validation system |
| `content/samuel-dialogue-graph.ts` | 289 nodes | Hub character graph |

---

## 3. Data Flow & State Management

### Three-Level State Hierarchy

```
Level 1: GameState (Source of Truth)
├─ characters: Map<CharacterId, CharacterState>
├─ patterns: PlayerPatterns
├─ globalFlags: Set<string>
├─ currentNodeId, currentCharacterId
├─ skillLevels: Record<SkillId, number>
├─ mysteries, time, careerValues
└─ 20+ additional fields

Level 2: Zustand Store (React Integration)
├─ coreGameState: SerializableGameState
├─ messages: GameMessage[]
├─ visitedScenes, choiceHistory
└─ UI state flags

Level 3: Component State (Local)
├─ currentNode, evaluatedChoices
├─ isProcessing, emotionalState
└─ UI interaction states
```

### Choice → Impact Flow

```
1. Player clicks choice
        ↓
2. useChoiceHandler.handleChoice()
        ↓
3. GameLogic.processChoice() (pure function)
   ├─ Trust change + resonance + momentum
   ├─ Pattern accumulation
   ├─ Knowledge flags
   ├─ Consequence echoes (cross-character)
   ├─ Skill demonstrations
   └─ 18 more evaluators...
        ↓
4. GameStateUtils.applyStateChange() (immutable)
        ↓
5. Persist: localStorage + SyncQueue
        ↓
6. Audio/Haptic feedback
        ↓
7. Navigate to next node
```

### Serialization

```typescript
// GameState → localStorage
GameState {
  characters: Map → Array
  globalFlags: Set → Array
  knowledgeFlags: Set → Array (per character)
}
        ↓
JSON.stringify() → localStorage[STORAGE_KEY]
        ↓
JSON.parse() → GameStateUtils.deserialize()
```

---

## 4. Dialogue & Narrative System

### Core Types

```typescript
// lib/dialogue-graph.ts

interface DialogueNode {
  nodeId: string                    // Unique identifier
  speaker: string                   // Character name or "Narrator"
  content: DialogueContent[]        // Multiple variations
  choices: ConditionalChoice[]      // Branching options
  requiredState?: StateCondition    // Access gate
  onEnter?: StateChange[]           // Auto-apply on arrival
  onExit?: StateChange[]            // Auto-apply on leave
  simulation?: SimulationConfig     // Mini-game config
  metadata?: NodeMetadata           // sessionBoundary, experienceId
}

interface DialogueContent {
  text: string
  emotion?: string                  // Compound: 'anxious_hopeful'
  voiceVariations?: Record<PatternType, string>
  patternReflection?: PatternReflection[]
  skillReflection?: SkillReflection[]
  nervousSystemReflection?: NervousSystemReflection[]
  interaction?: InteractionType     // shake, nod, bloom, etc.
  interrupt?: InterruptWindow       // ME2-style QTE
  richEffectContext?: RichEffect    // warning, thinking, glitch
}

interface ConditionalChoice {
  choiceId: string
  text: string
  nextNodeId: string
  pattern?: PatternType             // Track player pattern
  skills?: string[]                 // WEF 2030 skills
  consequence?: StateChange         // Applied on selection
  visibleCondition?: StateCondition // Show/hide
  enabledCondition?: StateCondition // Enable/disable
  voiceVariations?: Record<PatternType, string>
}
```

### Graph Registry

**File:** `lib/graph-registry.ts`

```typescript
// 28 total graphs
const DIALOGUE_GRAPHS = {
  // 20 character base graphs
  samuel: samuelDialogueGraph,
  maya: mayaDialogueGraph,
  // ...

  // 4 revisit graphs (post-arc)
  'maya-revisit': mayaRevisitGraph,

  // 4 location graphs
  station_entry: stationEntryGraph,
  market: marketGraph,
}

// Dynamic node lookup
findCharacterForNode(nodeId: string): CharacterId | null
// Scans ALL graphs, zero maintenance for new characters

// Graph routing with revisit support
getGraphForCharacter(characterId, gameState): DialogueGraph
// Checks maya_arc_complete flag → returns maya-revisit
```

### Content Statistics

| Graph Type | Count | Nodes |
|------------|-------|-------|
| Character (base) | 20 | 1,798 |
| Revisit | 4 | 38 |
| Location | 4 | 41 |
| **Total** | **28** | **1,877** |

### Evaluation Pipeline

```
1. Node Access
   StateConditionEvaluator.evaluate(requiredState, gameState)
   ├─ Trust ranges (min/max)
   ├─ Knowledge flags (has/lacks)
   ├─ Pattern thresholds
   └─ Global flags

2. Content Selection
   DialogueGraphNavigator.selectContent(node, gameState)
   ├─ Check conditional content first
   ├─ Random from non-conditional
   └─ Apply voice variations for dominant pattern

3. Choice Evaluation
   StateConditionEvaluator.evaluateChoices(choices, gameState)
   ├─ visibleCondition → show/hide
   ├─ enabledCondition → enable/disable
   ├─ Voice variations applied
   └─ SAFETY: If ALL gated, show all (prevent deadlock)
```

---

## 5. Character System

### 20 Characters Across 4 Tiers

| Tier | Characters | Node Range |
|------|------------|------------|
| **Hub** | Samuel (owl) | 289 |
| **Core** | Maya (cat), Marcus (bear), Devon (deer), Rohan (raven), Kai | 65-112 |
| **Secondary** | Tess (fox), Yaquin (rabbit), Grace, Elena, Alex (rat), Jordan, Quinn (hedgehog), Nadia (barnowl) | 45-105 |
| **Extended** | Silas, Asha, Lira, Zara, Dante (peacock), Isaiah (elephant) | 51-89 |

### Character State

```typescript
// lib/character-state.ts

interface CharacterState {
  characterId: string
  trust: number                     // 0-10
  anxiety: number                   // 0-100
  nervousSystemState: NervousSystemState
  knowledgeFlags: Set<string>       // What character knows
  relationshipStatus: RelationshipStatus
  conversationHistory: string[]     // Nodes visited
  trustMomentum: TrustMomentum      // Accelerates/decelerates
  trustTimeline: TrustTimeline      // History for viz
  lastReaction: ChemicalReaction    // Visual feedback
}

type NervousSystemState =
  | 'ventral_vagal'   // Calm, social (low anxiety)
  | 'sympathetic'     // Fight/flight (high anxiety)
  | 'dorsal_vagal'    // Shutdown (overwhelmed)

type RelationshipStatus =
  | 'stranger'        // Trust 0-2
  | 'acquaintance'    // Trust 3-5
  | 'confidant'       // Trust 6+
```

### Trust Mechanics

```
1. Base trust change from choice.consequence
2. + Resonant Trust (pattern affinity bonus)
3. + Trust Momentum (history-based acceleration)
4. = Final trust change (clamped 0-10)
5. → Auto-update relationshipStatus
6. → Recalculate nervousSystemState
7. → Generate ChemicalReaction (visual)
```

### Relationship Web

**File:** `lib/character-relationships.ts`

- **68 edges** connecting 20 characters
- Asymmetric (A→B ≠ B→A)
- Types: ally, rival, mentor, protege, parallel, complicated
- Dynamic updates based on player actions
- Opinions vary by trust level

---

## 6. Pattern & Data Dictionary Systems

### 5 Behavioral Patterns

**File:** `lib/patterns.ts`

| Pattern | Label | Color | Skills |
|---------|-------|-------|--------|
| **analytical** | The Weaver | Blue #3B82F6 | Critical thinking, problem-solving |
| **patience** | The Anchor | Green #10B981 | Time management, adaptability |
| **exploring** | The Voyager | Purple #8B5CF6 | Curiosity, creativity |
| **helping** | The Harmonic | Pink #EC4899 | Emotional intelligence, collaboration |
| **building** | The Architect | Amber #F59E0B | Creativity, leadership |

### Pattern Tracking

```typescript
interface PlayerPatterns {
  analytical: number  // 0-100 accumulated
  patience: number
  exploring: number
  helping: number
  building: number
}

// Thresholds
EMERGING = 3
DEVELOPING = 6
FLOURISHING = 9
DOMINANT_THRESHOLD = 5  // For identity
```

### Pattern Features

1. **Silent Accumulation** - Choices add to patterns invisibly
2. **Dominant Pattern** - Highest pattern ≥5, revealed at journey end
3. **Voice Variations** - NPC text adapts to dominant pattern
4. **Pattern Reflections** - NPC acknowledges player's patterns
5. **Pattern Unlocks** - Nodes gated by pattern thresholds
6. **Orb Visualization** - Gooey orbs fill as patterns develop

### Pattern Voice System (Disco Elysium Style)

**File:** `lib/pattern-voices.ts`

```typescript
// Internal monologue triggered by patterns
interface PatternVoiceEntry {
  pattern: PatternType
  trigger: 'node_enter' | 'before_choices' | 'npc_emotion'
  minLevel: number
  style: 'whisper' | 'speak' | 'urge' | 'command'
  text: string
  condition?: { emotion?, characterId?, nodeTag? }
}

// Example: Analytical pattern commenting on a choice
{
  pattern: 'analytical',
  trigger: 'before_choices',
  minLevel: 5,
  style: 'whisper',
  text: "Notice how she avoids the direct question..."
}
```

---

## 7. Skills & Emotions

### 54 Skills (WEF 2030 Aligned)

**File:** `lib/skill-definitions.ts`

| Skill | Superpower | Description |
|-------|-----------|-------------|
| criticalThinking | Piercing Insight | Deconstruct reality into truths |
| emotionalIntelligence | Human Resonance | Read hidden emotional spectrum |
| systemsThinking | Pattern Recognition | See invisible threads |
| collaboration | Harmonic Unity | Work toward shared vision |
| creativity | Reality Sculpture | Shape ideas into forms |
| leadership | Sovereign Presence | Guide others forward |
| adaptability | Fluid Mastery | Transform with change |
| ... | ... | (47 more) |

### Skill Tracking

```typescript
// In GameState
skillLevels: Record<SkillId, number>
skillUsage: Map<SkillId, SkillUsageRecord>

// Choices mark skills demonstrated
choice.skills = ['criticalThinking', 'emotionalIntelligence']

// NPC acknowledgment via skillReflection
content.skillReflection = [{
  skill: 'emotionalIntelligence',
  minLevel: 3,
  altText: "I can tell you really understand people..."
}]
```

### 12 Skill Combos

**File:** `lib/skill-combos.ts`

```typescript
// Example: "The Leader"
{
  id: 'the_leader',
  skills: ['emotionalIntelligence', 'leadership'],
  title: 'The Leader',
  description: 'Guide with empathy'
}
```

### 392 Emotions

**File:** `lib/emotions.ts`

```typescript
// Primary emotions (single word)
const PRIMARY_EMOTIONS = [
  'neutral', 'accepting', 'admiring', 'angry', 'anxious',
  'brave', 'caring', 'curious', 'delighted', 'desperate',
  // ... 382 more
]

// Compound emotions (underscore-joined)
'anxious_hopeful'  // Both components must be valid
'vulnerable_grateful'

// Validation
isValidEmotion(emotion: string): boolean
// Checks primary OR validates both compound parts
```

### Nervous System States (Polyvagal Theory)

```typescript
// Maps anxiety + trust + skills → state
determineNervousSystemState(character, skills): NervousSystemState

// States affect:
// - NPC dialogue tone
// - Animation mood
// - Available choices
// - Ambient audio
```

---

## 8. UI Components & Rendering

### Component Hierarchy

```
StatefulGameInterface (3,363 lines)
├─ GameHeader
│  ├─ CharacterAvatar
│  └─ Navigation controls
│
├─ Dialogue Area
│  ├─ GameMessage
│  │  └─ RichTextRenderer
│  │     └─ KineticText (wave, shadow, weight)
│  │
│  ├─ InterruptButton (ME2 QTE)
│  │
│  └─ GameChoiceGroup
│     └─ GameChoice × N
│
├─ Side Panels
│  ├─ Journal (skills, careers, combos)
│  ├─ Constellation (relationships)
│  └─ Patterns (orb visualization)
│
└─ Overlays
   ├─ SessionBoundary
   ├─ UnifiedMenu
   └─ JourneySummary
```

### Key Components

**GameMessage** (`components/game/game-message.tsx`)
- Props: speaker, text, type, messageWeight
- 20+ character color themes
- Pokemon-style 3D shadow
- Avatar with gradient backgrounds

**GameChoice** (`components/game/game-choice.tsx`)
- Glass morphism styling
- Pattern-aligned glow on hover
- Staggered fade-in animation
- 44px touch targets (Apple HIG)

**RichTextRenderer** (`components/RichTextRenderer.tsx`)
- "Kill the Typewriter" - paragraph-based reveal
- Inline tags: `<shake>`, `<bloom>`, `<glitch>`, etc.
- Markdown: **bold**, *italic*
- Click-to-skip

**CharacterAvatar** (`components/CharacterAvatar.tsx`)
- 20 character→animal mappings
- SVG pixel sprites (32×32)
- Size variants: sm/md/lg/xl
- Emotion-based styling

**InterruptButton** (`components/InterruptButton.tsx`)
- 6 interrupt types with icons
- Countdown progress bar
- Keyboard support (Space/Enter)
- Haptic feedback

### Inline Interaction Tags

| Tag | Effect | Duration |
|-----|--------|----------|
| `<shake>` | Horizontal oscillation | 500ms |
| `<jitter>` | Subtle tremor | 300ms |
| `<nod>` | Vertical bob | 600ms |
| `<bloom>` | Scale pulse | 500ms |
| `<ripple>` | Repeating scale wave | 800ms |
| `<big>` | Enlarge | 400ms |
| `<small>` | Shrink | 400ms |
| `<glitch>` | Chaotic distortion | infinite |
| `<wave>` | Letter bounce | per-letter |
| `<shadow>` | Glow pulse | 2000ms |

---

## 9. Animation System

### Spring Configurations

**File:** `lib/animations.ts`

```typescript
springs = {
  snappy: { stiffness: 400, damping: 25 },  // ~150ms - buttons
  smooth: { stiffness: 300, damping: 30 },  // ~300ms - panels
  gentle: { stiffness: 200, damping: 25 },  // ~250ms - fades
  quick:  { stiffness: 500, damping: 30 },  // ~100ms - icons
}

stagger = {
  fast: 0.05,    // 50ms between items
  normal: 0.08,  // 80ms - default
  slow: 0.12,    // 120ms
}
```

### Reusable Variants

```typescript
fadeInUp: { opacity: 0→1, y: 12→0 }
fadeInLeft: { opacity: 0→1, x: -12→0 }
scaleFade: { opacity: 0→1, scale: 0.95→1 }
panelFromRight: { x: '100%'→0 }
panelFromBottom: { y: '100%'→0 }
progressBar: { width: 0→${progress}% }  // Not scaleX!
```

### Signature Choice Animation (30% Animation Budget)

```
1. Tap → scale 0.95 + light haptic (10ms)
2. Other choices fade out (150ms)
3. Screen dims 5% (150ms)
4. Anticipation pause (300ms)
5. Heavy haptic [0, 50, 100]ms
6. Choice flies up (spring s=200, d=20)
7. Silence (600ms)
8. Typing indicator
9. NPC response
```

### Animation Moods

**File:** `lib/state-animations.ts`

| Mood | Spring | Use Case |
|------|--------|----------|
| neutral | s:300, d:30 | Default |
| tense | s:500, d:25 | Confrontation |
| warm | s:200, d:35 | High trust |
| cautious | s:250, d:40 | Low trust |
| reflective | s:150, d:30 | Pattern moments |
| triumphant | s:400, d:20 | Achievements |
| vulnerable | s:180, d:35 | Intimacy |

---

## 10. Hooks Architecture

### Core Game Hooks

| Hook | Lines | Purpose |
|------|-------|---------|
| `useChoiceHandler` | 1,606 | Choice processing, 23 evaluators |
| `useGameInitializer` | 400+ | Bootstrap, skill decay, returning player |
| `useAudioDirector` | 200+ | Audio state & triggers |
| `useReturnToStation` | 150+ | Navigation reset |

### State Hooks

| Hook | Purpose |
|------|---------|
| `useInsights` | Pattern/relationship analysis |
| `useConstellationData` | Character & skill aggregation |
| `useOrbs` | Pattern orb tracking & milestones |
| `usePatternUnlocks` | Orb fill & ability unlocks |
| `useUnlockEffects` | Content enhancement from unlocks |

### Input Hooks

| Hook | Purpose |
|------|---------|
| `usePullToDismiss` | Swipe gestures for modals |
| `useDeviceOrientation` | Gyroscope parallax |
| `useKeyboardShortcuts` | Keyboard navigation |

### Accessibility Hooks

| Hook | Purpose |
|------|---------|
| `useAccessibilityProfile` | 7 accessibility profiles |
| `useReaderMode` | Mono ↔ sans font toggle |
| `useColorBlindMode` | 5 color blindness filters |
| `useLargeTextMode` | 4 text size levels |
| `useCognitiveLoad` | Reduce visual complexity |

### Persistence Hooks

| Hook | Purpose |
|------|---------|
| `useLocalStorage` | Type-safe localStorage |
| `useBackgroundSync` | Offline-first Supabase sync |
| `useSettingsSync` | Cloud settings sync |

### Feature Hooks

| Hook | Purpose |
|------|---------|
| `useWaitingRoom` | Patience mechanic (30/60/120s reveals) |
| `useCopyToClipboard` | Neural deck copy with haptics |
| `useEvidence` | B2B value capture for reports |

---

## 11. Persistence & Sync

### Storage Architecture

```
┌─────────────────────────────────────────────┐
│              User Action                     │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│     GameStateUtils.applyStateChange()       │
│     (Immutable transformation)               │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│          commitGameState()                   │
│     ├─ Zustand setState()                    │
│     └─ localStorage.setItem()                │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│            SyncQueue                         │
│     (Batched, offline-first)                 │
│     ├─ Max 500 items                         │
│     ├─ 7 day retention                       │
│     └─ 2s debounce                           │
└─────────────────┬───────────────────────────┘
                  ↓ (when online)
┌─────────────────────────────────────────────┐
│            Supabase                          │
│     (Optional cloud persistence)             │
└─────────────────────────────────────────────┘
```

### SafeStorage

**File:** `lib/persistence/storage-manager.ts`

```typescript
SafeStorage.get<T>(key, initialValue)
SafeStorage.set<T>(key, value)
SafeStorage.remove(key)

// Features:
// - Version validation
// - QuotaExceededError handling
// - Non-essential key cleanup
// - Critical key preservation
```

### SyncQueue

**File:** `lib/sync-queue.ts`

```typescript
interface QueuedAction {
  id: string           // UUID for idempotency
  type: 'db_method' | 'career_analytics' | 'skill_summary'
  method?: string
  args?: unknown[]
  data?: unknown
  timestamp: number
  retries: number
}

// Sync triggers:
// - Interval (30s)
// - Window focus
// - Network online
// - Manual
```

---

## 12. Audio & Haptics

### Synthesized Audio

**File:** `lib/audio-feedback.ts`

No audio files - all Web Audio API synthesized:

| Sound | Frequency | Waveform |
|-------|-----------|----------|
| pattern-analytical | 440Hz | sine |
| pattern-patience | 330Hz | sine |
| pattern-exploring | 523Hz | triangle |
| pattern-helping | 392Hz | sine |
| pattern-building | 349Hz | square |
| trust | 523Hz | sine |
| identity | 262Hz | sine |
| milestone | 659Hz | sine |

### ADSR Envelope

```typescript
interface EnvelopeConfig {
  attack: number   // 0.01
  decay: number    // 0.1
  sustain: number  // 0.3
  release: number  // 0.3
}
```

### Haptic Patterns

**File:** `lib/haptic-feedback.ts`

```typescript
hapticFeedback.light()     // 10ms
hapticFeedback.medium()    // 20ms
hapticFeedback.heavy()     // [50, 10, 50]
hapticFeedback.success()   // [20, 10, 20, 10, 20]
hapticFeedback.error()     // [100, 50, 100]
hapticFeedback.choice()    // 15ms
```

---

## 13. Accessibility

### 7 Accessibility Profiles

**File:** `hooks/useAccessibilityProfile.ts`

1. **default** - Standard settings
2. **dyslexia** - OpenDyslexic font, increased spacing
3. **low_vision** - Larger text, high contrast
4. **high_contrast** - Maximum contrast ratios
5. **reduced_motion** - Disable animations
6. **focus_mode** - Reduced cognitive load
7. **custom** - User-defined

### Touch Targets

```typescript
// lib/ui-constants.ts
BUTTON_HEIGHT = {
  sm: 'min-h-[36px]',
  md: 'min-h-[44px]',  // Apple minimum
  lg: 'min-h-[52px]',
}
```

### Safe Areas

```css
padding-bottom: max(16px, env(safe-area-inset-bottom));
padding-top: env(safe-area-inset-top);
```

### Reduced Motion

All animations check `useReducedMotion()`:

```typescript
const prefersReducedMotion = useReducedMotion()

<motion.div
  initial={!prefersReducedMotion ? { opacity: 0 } : false}
  animate={{ opacity: 1 }}
/>
```

---

## 14. Testing & Validation

### Test Structure

```
tests/
├─ lib/                    # Unit tests (Vitest)
│  ├─ game-loop-logic.test.ts
│  ├─ dialogue-validators.test.ts
│  └─ emotion-validation.test.ts
│
├─ e2e/                    # E2E tests (Playwright)
│  ├─ core-game-loop.spec.ts
│  ├─ mobile/
│  └─ admin/
│
├─ content/                # Content validation
│  ├─ emotion-validation.test.ts
│  ├─ vulnerability-arcs.test.ts
│  └─ golden-paths.test.ts
│
└─ types/                  # Type sentinels
   └─ admin-route-props.ts
```

### Validation Scripts

```bash
npm run validate-graphs      # Dialogue graph integrity
npm run validate-content     # Content system
npm run validate-skills      # Skills system
npm run validate-env         # Environment variables
npm run verify               # Full verification gate
```

### Content Validation

- **Emotion validation**: 1,612 references across 20 graphs (100% pass)
- **Vulnerability arcs**: Trust ≥6 gating validation
- **Golden paths**: Critical flow validation
- **Entry nodes**: Simulation entry verification

---

## 15. File Reference Index

### Core System Files

```
lib/
├─ dialogue-graph.ts         # Core types (1,015 lines)
├─ character-state.ts        # State management (800+ lines)
├─ graph-registry.ts         # Graph routing
├─ patterns.ts               # Pattern definitions
├─ emotions.ts               # Emotion validation (804 lines)
├─ skill-definitions.ts      # 54 skills
├─ constants.ts              # Magic numbers
├─ animations.ts             # Framer Motion config
├─ audio-feedback.ts         # Web Audio synthesis
├─ haptic-feedback.ts        # Vibration patterns
├─ sync-queue.ts             # Offline-first sync
├─ game-logic.ts             # Pure choice processing
├─ game-store.ts             # Zustand store
└─ game-state-manager.ts     # Persistence
```

### Content Files

```
content/
├─ samuel-dialogue-graph.ts  # Hub character (289 nodes)
├─ maya-dialogue-graph.ts    # Core character (100 nodes)
├─ devon-dialogue-graph.ts   # Core character (112 nodes)
├─ ... (17 more character graphs)
├─ maya-revisit-graph.ts     # Post-arc content
├─ station-entry-graph.ts    # Location graph
├─ pattern-voice-library.ts  # Inner monologue
└─ simulation-registry.ts    # 71 simulations
```

### Component Files

```
components/
├─ StatefulGameInterface.tsx # Main orchestrator (3,363 lines)
├─ game/
│  ├─ game-message.tsx       # Dialogue display
│  ├─ game-choice.tsx        # Choice buttons
│  └─ game-choice-group.tsx  # Choice container
├─ RichTextRenderer.tsx      # Text rendering
├─ KineticText.tsx           # Typography effects
├─ CharacterAvatar.tsx       # Pixel avatars
├─ InterruptButton.tsx       # ME2 QTE
├─ Journal.tsx               # Side panel
└─ constellation/            # Relationship viz
```

### Hook Files

```
hooks/
├─ useChoiceHandler.ts       # Choice logic (1,606 lines)
├─ useGameInitializer.ts     # Bootstrap
├─ useAudioDirector.ts       # Audio state
├─ useInsights.ts            # Pattern analysis
├─ useConstellationData.ts   # Character data
├─ useOrbs.ts                # Orb tracking
├─ usePatternUnlocks.ts      # Ability unlocks
├─ useWaitingRoom.ts         # Patience mechanic
├─ usePullToDismiss.ts       # Gestures
├─ useDeviceOrientation.ts   # Gyroscope
├─ useAccessibilityProfile.ts# A11y profiles
└─ useLocalStorage.ts        # Persistence
```

### Test Files

```
tests/
├─ lib/
│  ├─ game-loop-logic.test.ts
│  ├─ dialogue-validators.test.ts
│  └─ choice-generator.test.ts
├─ content/
│  ├─ emotion-validation.test.ts
│  └─ vulnerability-arcs.test.ts
├─ e2e/
│  ├─ core-game-loop.spec.ts
│  └─ mobile/
└─ types/
   └─ admin-route-props.ts   # Type sentinel
```

---

## Appendix: Quick Reference

### Pattern Colors (Tailwind)

```typescript
analytical: 'text-blue-400'    // #60A5FA
patience: 'text-emerald-400'   // #34D399
exploring: 'text-purple-400'   // #A78BFA
helping: 'text-pink-400'       // #F472B6
building: 'text-amber-400'     // #FBBF24
```

### Trust Thresholds

```typescript
STRANGER: 0-2
ACQUAINTANCE: 3-5
CONFIDANT: 6-10
LOYALTY_UNLOCK: 8+
```

### Key Constants

```typescript
MAX_TRUST = 10
MIN_TRUST = 0
DOMINANT_THRESHOLD = 5
IDENTITY_THRESHOLD = 5
INTERNALIZE_BONUS = 0.20
```

### NPM Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run test:run     # Unit tests
npm run test:e2e     # E2E tests
npm run verify       # Full verification gate
npm run qa:quick     # Fast feedback (type-check + tests)
```

---

*This document auto-generated from codebase analysis. For updates, see individual source files.*
