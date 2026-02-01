# Core Gameplay Data Dictionary

**Purpose:** A short, actionable map of the data that drives the core game loop. Use this when you need to answer: "What is the game reading? What is it writing? Where does it live?"

**Scope:** Core runtime state + dialogue graph contract. This is a summary layer that points to the canonical sources.

---

## Canonical Sources (Start Here)

| Domain | Source of Truth | Why It Matters |
| --- | --- | --- |
| Runtime State | `lib/character-state.ts` | `GameState`, `CharacterState`, `StateCondition`, `StateChange` |
| Dialogue Graph | `lib/dialogue-graph.ts` | `DialogueNode`, `ConditionalChoice`, `SimulationConfig`, `InterruptWindow` |
| Graph Routing | `lib/graph-registry.ts` | `CharacterId`, `DIALOGUE_GRAPHS`, routing rules |
| Patterns | `lib/patterns.ts` | `PatternType`, thresholds, metadata |
| Skills | `lib/skill-definitions.ts`, `lib/2030-skills-system.ts` | Skill IDs + display metadata |
| Emotions | `lib/emotions.ts` | `EmotionType` + compound emotion rules |
| Content | `content/*-dialogue-graph.ts` | Actual nodes/choices per character |

---

## Core Runtime Objects

### 1) `GameState` (Master Save Object)
**Where:** `lib/character-state.ts`

Minimal fields that drive gameplay decisions:
- `currentNodeId`: the active node in the dialogue graph
- `currentCharacterId`: current speaker/scene (`CharacterId`)
- `characters`: `Map<string, CharacterState>` (per-character trust/knowledge)
- `patterns`: `PlayerPatterns` (5 pattern counters)
- `globalFlags`: `Set<string>` (world state)
- `skillLevels`, `skillUsage`: skill progression
- `lastSaved`, `sessionStartTime`, `episodeNumber`: session tracking

Notes:
- `GameState` is the single source of truth for all branching logic.
- Serialization uses `SerializableGameState` in the same file.

### 2) `CharacterState` (Per-NPC Relationship State)
**Where:** `lib/character-state.ts`

Key fields:
- `trust`: 0-10 scale
- `anxiety`: 0-100 scale
- `knowledgeFlags`: `Set<string>` (what this NPC knows)
- `relationshipStatus`: `stranger | acquaintance | confidant`
- `conversationHistory`: node IDs visited with this NPC
- `lastInteractionTimestamp`, `trustMomentum`, `trustTimeline`: optional time/derivative tracking

### 3) `PlayerPatterns` (Behavioral Tracking)
**Where:** `lib/character-state.ts`

Five numeric counters:
- `analytical`, `patience`, `exploring`, `helping`, `building`

Thresholds live in `lib/patterns.ts` (`EMERGING=3`, `DEVELOPING=6`, `FLOURISHING=9`).

---

## Dialogue Graph Contract

### 4) `DialogueNode`
**Where:** `lib/dialogue-graph.ts`

Required fields:
- `nodeId`: unique ID
- `speaker`: character ID or `Narrator`
- `content[]`: text + optional emotion
- `choices[]`: `ConditionalChoice`

Optional but core to branching:
- `requiredState`: `StateCondition`
- `onEnter`, `onExit`: `StateChange[]`
- `patternReflection`: NPC alt-text by dominant pattern
- `metadata`: session boundary markers
- `simulation`: mini-game config (`SimulationConfig`)

### 5) `ConditionalChoice`
**Where:** `lib/dialogue-graph.ts`

Key fields:
- `choiceId`, `text`, `nextNodeId`
- `visibleCondition`, `enabledCondition`
- `pattern`: pattern attribution (for tracking)
- `skills`: demonstrated skills
- `consequence`: `StateChange`

### 6) `StateCondition` + `StateChange`
**Where:** `lib/character-state.ts`

`StateCondition` controls visibility and access. Typical usage:
- trust thresholds
- knowledge/global flags
- pattern thresholds
- mystery/skill-combo gates

`StateChange` applies explicit mutations:
- trust changes
- knowledge/global flags
- pattern deltas
- mystery progression

---

## Simulation + Interrupt Systems

### 7) `SimulationConfig`
**Where:** `lib/dialogue-graph.ts`

Minimum contract:
- `type`, `title`, `taskDescription`
- `initialContext` (display state)
- `successFeedback`
- `mode`: `fullscreen | inline`
- `phase`: 1-3, `difficulty`: `introduction | application | mastery`

### 8) `InterruptWindow`
**Where:** `lib/dialogue-graph.ts`

Key fields:
- `duration` (ms)
- `type`: `connection | challenge | silence | comfort | grounding | encouragement`
- `action`: label
- `targetNodeId`

---

## Identity Sets / Enumerations

### 9) `CharacterId`
**Where:** `lib/graph-registry.ts`

All valid character/scene IDs. Must stay in sync with `currentCharacterId` and graph registry.

### 10) `PatternType`
**Where:** `lib/patterns.ts`

Five canonical patterns. All pattern usage should reference these IDs.

### 11) `EmotionType`
**Where:** `lib/emotions.ts`

Valid emotion tags. Supports compound emotions via underscores (e.g., `anxious_hopeful`).

### 12) `SkillDefinition`
**Where:** `lib/skill-definitions.ts`

Canonical skill IDs + display metadata used in UI and reporting.

---

## Core Gameplay Flow (State -> Content -> State)

1. **Router** selects the correct graph (`lib/graph-registry.ts`).
2. **Node** loads (`DialogueNode`) and filters by `requiredState`.
3. **Choices** render (filtered by `StateCondition`).
4. **Player chooses** -> apply `StateChange`.
5. **GameState** updates -> next node computed.

---

## Non-Negotiable Invariants

- `nodeId` is globally unique across all graphs.
- `currentCharacterId` must be a valid `CharacterId`.
- `trust` stays within `0..10`, `anxiety` stays within `0..100`.
- `knowledgeFlags` and `globalFlags` are treated as sets (no duplicates).
- All content IDs used in flags/skills/patterns must match canonical registries.

---

## If You Need More Detail

Jump to the full dictionaries:
- Patterns: `docs/reference/data-dictionary/03-patterns.md`
- Skills: `docs/reference/data-dictionary/02-skills.md`
- Emotions: `docs/reference/data-dictionary/01-emotions.md`
- Dialogue System: `docs/reference/data-dictionary/05-dialogue-system.md`
- Characters: `docs/reference/data-dictionary/04-characters.md`

