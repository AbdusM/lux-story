# LUX STORY - CRITICAL INTERFACES
## Phase 0.2 Deliverable - Interface Contracts

**Created:** December 25, 2025
**Purpose:** Document the core interfaces that define system boundaries

---

## 1. GAME STATE INTERFACES

### 1.1 GameState (Runtime - Uses Map/Set)

**Location:** `lib/character-state.ts:79-104`

```typescript
interface GameState {
  // Identity
  saveVersion: string        // "1.0.0" - for migration compatibility
  playerId: string           // Unique player identifier

  // Character Relationships (Map for O(1) lookup)
  characters: Map<string, CharacterState>  // 11 characters

  // World State (Set for O(1) membership check)
  globalFlags: Set<string>   // e.g., "maya_arc_complete", "visited_p7"

  // Player Patterns (tracked silently)
  patterns: PlayerPatterns   // 5 patterns: analytical, patience, exploring, helping, building

  // Current Position
  currentNodeId: string      // e.g., "samuel_intro_1"
  currentCharacterId: CharacterId  // Who player is talking to

  // Thought Cabinet
  thoughts: ActiveThought[]  // Player's developing thoughts

  // Session Tracking
  lastSaved: number          // Timestamp
  episodeNumber: number      // Which episode (1-based)
  sessionStartTime: number   // When session started
  sessionBoundariesCrossed: number  // For variety in announcements

  // Grand Central State
  platforms: Record<string, PlatformState>  // p1, p3, p7, p9, forgotten
  careerValues: CareerValues     // 5 career value dimensions
  mysteries: MysteryState        // Narrative mystery tracking
  time: TimeState                // Station time mechanics
  quietHour: QuietHourState      // Special temporal events
  items: {
    letter: 'kept' | 'torn' | 'shown' | 'burned'
    safeSpot?: string
    discoveredPaths: string[]
  }
}
```

### 1.2 SerializableGameState (Storage - Uses Arrays)

**Location:** `lib/character-state.ts:173-205`

**Key Difference:** Converts Map/Set to arrays for JSON compatibility

```typescript
interface SerializableGameState {
  // Same fields as GameState EXCEPT:
  characters: Array<{...}>  // Array instead of Map
  globalFlags: string[]     // Array instead of Set
  // knowledgeFlags inside character: string[] instead of Set
}
```

**Conversion Functions:**
- `GameStateUtils.serialize(state: GameState): SerializableGameState`
- `GameStateUtils.deserialize(serialized: SerializableGameState): GameState`

### 1.3 CharacterState

**Location:** `lib/character-state.ts:13-22`

```typescript
interface CharacterState {
  characterId: string                          // "maya", "samuel", etc.
  trust: number                                // 0-10 scale
  anxiety: number                              // 0-100 scale (derived from trust)
  nervousSystemState: NervousSystemState       // 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal'
  lastReaction: ChemicalReaction | null        // Visual feedback data
  knowledgeFlags: Set<string>                  // What character knows about player
  relationshipStatus: 'stranger' | 'acquaintance' | 'confidant'
  conversationHistory: string[]                // Node IDs visited
}
```

### 1.4 PlayerPatterns

**Location:** `lib/character-state.ts:110-116`

```typescript
interface PlayerPatterns {
  analytical: number    // Logic, data-driven (The Weaver)
  helping: number       // People-focused, supportive (The Harmonic)
  building: number      // Creative, hands-on (The Architect)
  patience: number      // Thoughtful, long-term (The Anchor)
  exploring: number     // Curious, discovery (The Voyager)
}
```

---

## 2. DIALOGUE INTERFACES

### 2.1 DialogueNode

**Location:** `lib/dialogue-graph.ts:24-72`

```typescript
interface DialogueNode {
  nodeId: string                          // Unique ID (e.g., "maya_intro_1")
  speaker: string                         // Character or 'Narrator'

  content: DialogueContent[]              // Multiple variations for replayability

  requiredState?: StateCondition          // Access conditions
  choices: ConditionalChoice[]            // Available choices

  onEnter?: StateChange[]                 // State mutations on entry
  onExit?: StateChange[]                  // State mutations on exit

  tags?: string[]                         // Content metadata
  priority?: number                       // For sorting
  learningObjectives?: string[]           // Educational tracking

  patternReflection?: Array<{             // NPC acknowledges player patterns
    pattern: PatternType
    minLevel: number
    altText: string
    altEmotion?: string
  }>

  metadata?: {
    sessionBoundary?: boolean             // Natural pause point
  }
}
```

### 2.2 DialogueContent

**Location:** `lib/dialogue-graph.ts:78-119`

```typescript
interface DialogueContent {
  text: string                            // The dialogue text
  emotion?: string                        // e.g., "anxious", "anxious_hopeful"
  variation_id: string                    // For tracking which shown
  useChatPacing?: boolean                 // Sequential reveal mode
  richEffectContext?: 'thinking' | 'warning' | 'success' | 'executing' | 'error'
  interaction?: 'big' | 'small' | 'shake' | 'nod' | 'ripple' | 'bloom' | 'jitter'
  patternReflection?: Array<{...}>        // Same as DialogueNode
}
```

### 2.3 ConditionalChoice

**Location:** `lib/dialogue-graph.ts:125-193`

```typescript
interface ConditionalChoice {
  choiceId: string                        // Unique ID
  text: string                            // Display text
  nextNodeId: string                      // Where this leads

  visibleCondition?: StateCondition       // Show/hide condition
  enabledCondition?: StateCondition       // Enable/disable condition

  pattern?: PatternType                   // Which pattern this represents
  skills?: (keyof FutureSkills)[]         // WEF 2030 skills demonstrated
  consequence?: StateChange               // State changes on selection

  preview?: string                        // Hover text
  voiceVariations?: Partial<Record<PatternType, string>>  // Alt text per pattern
  interaction?: InteractionType           // Animation

  requiredOrbFill?: {                     // KOTOR-style unlock
    pattern: PatternType
    threshold: number                     // 0-100 fill percentage
  }
}
```

---

## 3. STATE MUTATION INTERFACES

### 3.1 StateCondition (For Gating)

**Location:** `lib/character-state.ts:122-143`

```typescript
interface StateCondition {
  // Character-specific
  trust?: { min?: number; max?: number }
  relationship?: ('stranger' | 'acquaintance' | 'confidant')[]
  hasKnowledgeFlags?: string[]
  lacksKnowledgeFlags?: string[]

  // Global
  hasGlobalFlags?: string[]
  lacksGlobalFlags?: string[]

  // Pattern-based
  patterns?: {
    [K in keyof PlayerPatterns]?: { min?: number; max?: number }
  }
}
```

### 3.2 StateChange (For Mutations)

**Location:** `lib/character-state.ts:149-167`

```typescript
interface StateChange {
  // Character-specific (requires characterId)
  characterId?: string
  trustChange?: number                    // Delta, not absolute
  setRelationshipStatus?: 'stranger' | 'acquaintance' | 'confidant'
  addKnowledgeFlags?: string[]
  removeKnowledgeFlags?: string[]

  // Global
  addGlobalFlags?: string[]
  removeGlobalFlags?: string[]

  // Patterns
  patternChanges?: Partial<PlayerPatterns>

  // Thought Cabinet
  thoughtId?: string
  internalizeThought?: boolean
}
```

---

## 4. CORE FLOW CONTRACTS

### 4.1 State Mutation Flow

```typescript
// IMMUTABLE: Returns new state, does not mutate input
GameStateUtils.applyStateChange(gameState: GameState, change: StateChange): GameState

// WHAT IT DOES:
// 1. Validates characterId if provided
// 2. Validates patternChanges (skips invalid patterns)
// 3. Deep clones the state
// 4. Applies global flag changes
// 5. Applies pattern changes
// 6. Handles thought triggers
// 7. Applies character-specific changes:
//    - Trust (with resonance calculation)
//    - Anxiety (derived from trust)
//    - NervousSystemState (biological state)
//    - ChemicalReaction (visual feedback)
//    - RelationshipStatus (auto-updated unless explicit)
//    - KnowledgeFlags
```

### 4.2 Serialization Flow

```typescript
// Runtime → Storage
GameStateUtils.serialize(state: GameState): SerializableGameState
// - Converts Map to Array
// - Converts Set to Array

// Storage → Runtime
GameStateUtils.deserialize(serialized: SerializableGameState): GameState
// - Converts Array back to Map
// - Converts Array back to Set
// - Provides defaults for missing fields (migration support)
```

### 4.3 Dialogue Evaluation Flow

```typescript
// Evaluate conditions for content access
StateConditionEvaluator.evaluate(
  condition: StateCondition | undefined,
  gameState: GameState,
  characterId?: string
): boolean

// Evaluate all choices with visibility/enabled state
StateConditionEvaluator.evaluateChoices(
  node: DialogueNode,
  gameState: GameState,
  characterId?: string
): EvaluatedChoice[]

// IMPORTANT: Auto-fallback safety
// If NO choices visible, ALL choices shown to prevent deadlock
```

---

## 5. TYPE VALIDATION CONTRACTS

### 5.1 Pattern Validation

**Location:** `lib/patterns.ts:189-191`

```typescript
const PATTERN_TYPES = ['analytical', 'patience', 'exploring', 'helping', 'building'] as const
type PatternType = typeof PATTERN_TYPES[number]

function isValidPattern(pattern: string): pattern is PatternType
```

### 5.2 Character Validation

**Location:** `lib/graph-registry.ts`

```typescript
const CHARACTER_IDS = ['samuel', 'maya', 'devon', 'jordan', 'marcus',
                       'tess', 'yaquin', 'kai', 'alex', 'rohan', 'silas'] as const
type CharacterId = typeof CHARACTER_IDS[number]

function isValidCharacterId(id: string): id is CharacterId
```

### 5.3 State Validation

**Location:** `lib/character-state.ts:650-753`

```typescript
class StateValidation {
  static isValidNumber(value: unknown): boolean
  static hasValidPatterns(patterns: unknown): boolean
  static isValidNodeId(nodeId: unknown): boolean
  static isValidGameState(obj: unknown): obj is GameState
  static isValidSerializableGameState(obj: unknown): obj is SerializableGameState
}
```

---

## 6. CONSTANTS CONTRACT

**Location:** `lib/constants.ts`

| Constant | Value | Usage |
|----------|-------|-------|
| `INITIAL_TRUST` | 5 | Starting trust for new characters |
| `MIN_TRUST` | 0 | Minimum trust value |
| `MAX_TRUST` | 10 | Maximum trust value |
| `IDENTITY_THRESHOLD` | 5 | Pattern level for identity recognition |
| `INTERNALIZE_BONUS` | 0.20 | Thought internalization pattern boost |
| `TRUST_THRESHOLDS.friendly` | 5 | → acquaintance status |
| `TRUST_THRESHOLDS.close` | 8 | → confidant status |

---

## 7. ZUSTAND STORE CONTRACT

**Location:** `lib/game-store.ts`

### Key Actions

```typescript
interface GameActions {
  // Core state
  setCoreGameState: (state: SerializableGameState) => void
  applyCoreStateChange: (change: StateChange) => void
  getCoreGameStateHydrated: () => GameState | null  // Deserializes

  // Sync bridge (PROBLEMATIC - see notes)
  syncDerivedState: () => void  // Syncs coreGameState → derived fields

  // Scene management
  setCurrentScene: (sceneId: string) => void
  startGame: () => void

  // Message handling
  addMessage: (message: Message) => void
  clearMessages: () => void
}
```

### Persistence Key

```typescript
persist(
  // ... store definition
  {
    name: 'grand-central-game-store',  // localStorage key
    // ... partialize config
  }
)
```

---

## 8. CRITICAL INVARIANTS

### Trust Bounds
```typescript
// Trust must ALWAYS be between 0 and 10
trust = Math.max(MIN_TRUST, Math.min(MAX_TRUST, trust + delta))
```

### Anxiety Derivation
```typescript
// Anxiety is derived from trust, not stored independently
anxiety = (10 - trust) * 10  // 0 trust = 100 anxiety, 10 trust = 0 anxiety
```

### Node Existence
```typescript
// Every nextNodeId in a choice MUST exist in the graph
// Validated at runtime, logged if missing
```

### Serialization Round-Trip
```typescript
// serialize → deserialize MUST produce equivalent state
// Map/Set conversion must be lossless
```

---

## 9. INTERFACE BOUNDARIES

```
┌─────────────────────────────────────────────────────────────────────┐
│                          COMPONENTS                                  │
│                                                                     │
│  StatefulGameInterface ◄─── uses selectors ─── useGameStore        │
│           │                                                         │
│           ▼                                                         │
│  handleChoice(choice) ─────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          GAME LOGIC                                  │
│                                                                     │
│  GameLogic.processChoice(choice, state)                             │
│           │                                                         │
│           ▼                                                         │
│  GameStateUtils.applyStateChange(state, change)                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          STATE STORE                                 │
│                                                                     │
│  useGameStore.applyCoreStateChange(change)                          │
│           │                                                         │
│           ├── Update coreGameState (SerializableGameState)          │
│           ├── syncDerivedState() [PROBLEMATIC]                      │
│           └── Persist middleware → localStorage                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          SYNC LAYER                                  │
│                                                                     │
│  SyncQueue.queueChoiceSync(...)                                     │
│           │                                                         │
│           └── Async push to Supabase (offline-first)                │
└─────────────────────────────────────────────────────────────────────┘
```

---

*This document defines the critical interface contracts. Changes to these interfaces require careful consideration of all dependent systems.*
