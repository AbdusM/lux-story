# LUX STORY - ARCHITECTURE DIAGRAM
## Phase 0.1 Deliverable - Context Compression

**Created:** December 25, 2025
**Purpose:** Reduce 5M+ token codebase to essential architecture understanding

---

## SYSTEM ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           LUX STORY - GRAND CENTRAL TERMINUS                     │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                            FRONTEND (Next.js 15)                            │ │
│  │                                                                             │ │
│  │  ┌─────────────────────┐  ┌───────────────────┐  ┌────────────────────────┐ │ │
│  │  │ StatefulGame        │  │ Constellation     │  │ Admin Dashboard        │ │ │
│  │  │ Interface           │  │ Panel             │  │                        │ │ │
│  │  │ (1775 LOC)          │  │                   │  │ /admin/[userId]/*      │ │ │
│  │  │                     │  │ - PeopleView      │  │ - PatternSection       │ │ │
│  │  │ - GameHeader        │  │ - SkillsView      │  │ - SkillsSection        │ │ │
│  │  │ - GameMessages      │  │ - DetailModal     │  │ - CareersSection       │ │ │
│  │  │ - GameChoices       │  │                   │  │ - EvidenceSection      │ │ │
│  │  │ - Journal           │  │                   │  │ - UrgencySection       │ │ │
│  │  └─────────┬───────────┘  └─────────┬─────────┘  └────────────┬───────────┘ │ │
│  │            │                        │                         │             │ │
│  └────────────┼────────────────────────┼─────────────────────────┼─────────────┘ │
│               │                        │                         │               │
│               ▼                        ▼                         ▼               │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                          STATE LAYER (Zustand)                              │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐│ │
│  │  │                    game-store.ts (1104 LOC)                             ││ │
│  │  │                                                                         ││ │
│  │  │  ┌─────────────────────────┐    ┌─────────────────────────────────────┐ ││ │
│  │  │  │ coreGameState          │◄───│ SINGLE SOURCE OF TRUTH             │ ││ │
│  │  │  │ (SerializableGameState)│    │                                     │ ││ │
│  │  │  │                        │    │ All other fields are DERIVED:       │ ││ │
│  │  │  │ - characters (Map)     │    │ - characterTrust (sync issue)       │ ││ │
│  │  │  │ - patterns             │    │ - patterns (sync issue)             │ ││ │
│  │  │  │ - globalFlags (Set)    │    │ - thoughts (sync issue)             │ ││ │
│  │  │  │ - currentNodeId        │    │                                     │ ││ │
│  │  │  │ - thoughts             │    │ [CRITICAL: Dual source of truth]    │ ││ │
│  │  │  └─────────────────────────┘    └─────────────────────────────────────┘ ││ │
│  │  └─────────────────────────────────────────────────────────────────────────┘│ │
│  │                                     │                                       │ │
│  │                                     ▼                                       │ │
│  │  ┌─────────────────────────┐  ┌─────────────────────────┐                   │ │
│  │  │ character-state.ts     │  │ localStorage (persist)  │                   │ │
│  │  │                        │  │                         │                   │ │
│  │  │ - GameStateUtils       │  │ Key: grand-central-     │                   │ │
│  │  │ - applyStateChange()   │  │      game-store         │                   │ │
│  │  │ - serialize/deserialize│  │                         │                   │ │
│  │  └────────────────────────┘  └──────────┬──────────────┘                   │ │
│  │                                         │                                   │ │
│  └─────────────────────────────────────────┼───────────────────────────────────┘ │
│                                            │                                     │
│                                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           SYNC LAYER (Offline-First)                        │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────┐         ┌─────────────────────────┐            │ │
│  │  │ sync-queue.ts          │────────► │ API Routes              │            │ │
│  │  │                        │         │ /api/user/*             │            │ │
│  │  │ - QueuedAction[]       │         │ /api/admin/*            │            │ │
│  │  │ - Retry logic          │         │ /api/samuel-dialogue    │            │ │
│  │  │ - Offline detection    │         │                         │            │ │
│  │  └────────────────────────┘         └────────────┬────────────┘            │ │
│  │                                                  │                          │ │
│  └──────────────────────────────────────────────────┼──────────────────────────┘ │
│                                                     │                            │
└─────────────────────────────────────────────────────┼────────────────────────────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                      │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │ SUPABASE            │  │ GOOGLE GEMINI       │  │ VERCEL                  │  │
│  │                     │  │                     │  │                         │  │
│  │ Tables:             │  │ - Samuel dialogue   │  │ - Auto-deploy           │  │
│  │ - player_profiles   │  │   generation        │  │ - Env vars              │  │
│  │ - skill_demos       │  │ - Advisor briefing  │  │ - Edge functions        │  │
│  │ - career_explorations│ │                     │  │                         │  │
│  │ - character_rels    │  │ Model: Gemini 1.5   │  │ URL: lux-story.         │  │
│  │ - patterns          │  │        Flash        │  │      vercel.app         │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## GAME LOGIC SYSTEMS

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              GAME LOGIC LAYER                                    │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        DIALOGUE SYSTEM                                      │ │
│  │                                                                            │ │
│  │  content/                           lib/                                   │ │
│  │  ├── samuel-dialogue-graph.ts ──►  dialogue-graph.ts                      │ │
│  │  ├── maya-dialogue-graph.ts        │                                       │ │
│  │  ├── devon-dialogue-graph.ts       │  DialogueNode                         │ │
│  │  ├── jordan-dialogue-graph.ts      │  ├── nodeId                           │ │
│  │  ├── marcus-dialogue-graph.ts      │  ├── speaker                          │ │
│  │  ├── tess-dialogue-graph.ts        │  ├── content[]                        │ │
│  │  ├── yaquin-dialogue-graph.ts      │  ├── choices[]                        │ │
│  │  ├── kai-dialogue-graph.ts         │  ├── requiredState                    │ │
│  │  ├── rohan-dialogue-graph.ts       │  └── onEnter/onExit                   │ │
│  │  ├── alex-dialogue-graph.ts        │                                       │ │
│  │  └── silas-dialogue-graph.ts       └── graph-registry.ts                   │ │
│  │                                        └── getGraphForCharacter()          │ │
│  │  11 Characters × ~50KB each = ~500KB content                               │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        PATTERN SYSTEM                                       │ │
│  │                                                                            │ │
│  │  lib/patterns.ts                    lib/game-logic.ts                      │ │
│  │  ├── PATTERN_TYPES                  ├── processChoice()    [0 TESTS]       │ │
│  │  │   ├── analytical (Weaver)        ├── calculatePlatformResonance()       │ │
│  │  │   ├── patience (Anchor)          ├── calculateEndingPath()              │ │
│  │  │   ├── exploring (Voyager)        └── [CRITICAL: UNTESTED]               │ │
│  │  │   ├── helping (Harmonic)                                                │ │
│  │  │   └── building (Architect)       lib/pattern-affinity.ts                │ │
│  │  │                                  └── [90% INCOMPLETE - only Maya]       │ │
│  │  └── PATTERN_SKILL_MAP                                                     │ │
│  │      (5 patterns × 3 skills = 15)   lib/consequence-echoes.ts              │ │
│  │      [GAP: 25 skills unmapped]      └── [MISSING: alex, silas]             │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        SKILL SYSTEM                                         │ │
│  │                                                                            │ │
│  │  lib/2030-skills-system.ts          lib/skill-tracker.ts                   │ │
│  │  ├── FutureSkills interface         ├── SkillDemonstration                 │ │
│  │  │   (57 skills defined)            │   (evidence-based, not scored)       │ │
│  │  │                                  │                                       │ │
│  │  └── [GAP: 57 vs 40 visualized]     └── SkillProfile                       │ │
│  │                                         ├── skillDemonstrations            │ │
│  │  lib/constellation/skill-positions.ts   ├── milestones                     │ │
│  │  └── (40 skills positioned)             └── careerMatches                  │ │
│  │                                                                            │ │
│  │  [CRITICAL: 17 orphaned skills never displayed]                            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## DATA FLOW: PLAYER CHOICE

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      CHOICE → CONSEQUENCE FLOW                                   │
│                                                                                  │
│  1. PLAYER CLICK                                                                 │
│     └── GameChoices.tsx                                                          │
│         └── handleChoice(choice)                                                 │
│                                                                                  │
│  2. STATE UPDATE                                                                 │
│     └── StatefulGameInterface.tsx:564-583                                        │
│         ├── [RACE CONDITION: safety timeout can reset lock]                     │
│         └── GameLogic.processChoice()                                            │
│             ├── Calculate trust delta                                            │
│             ├── Calculate pattern sensation (30% chance)                         │
│             └── Apply onExit → onEnter state changes                             │
│                                                                                  │
│  3. STATE MUTATION                                                               │
│     └── GameStateUtils.applyStateChange()                                        │
│         ├── [MUTATES: charState.trust directly]                                 │
│         │   lib/character-state.ts:329-332                                      │
│         └── Returns new state (partially immutable)                              │
│                                                                                  │
│  4. ZUSTAND UPDATE                                                               │
│     └── useGameStore.applyCoreStateChange()                                      │
│         ├── Update coreGameState                                                 │
│         ├── syncDerivedState() [BIDIRECTIONAL SYNC TRAP]                        │
│         │   lib/game-store.ts:729-779                                           │
│         └── Trigger persist middleware                                           │
│                                                                                  │
│  5. PERSISTENCE                                                                  │
│     ├── localStorage (immediate)                                                 │
│     │   └── Key: grand-central-game-store                                       │
│     │                                                                            │
│     └── SyncQueue (deferred)                                                     │
│         ├── Queue action for Supabase                                            │
│         └── Retry with exponential backoff                                       │
│                                                                                  │
│  6. UI UPDATE                                                                    │
│     ├── Show consequence echo                                                    │
│     ├── Update constellation                                                     │
│     └── Advance dialogue                                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## KEY FILE LOCATIONS

| System | Primary File | Lines | Purpose |
|--------|--------------|-------|---------|
| **State Store** | `lib/game-store.ts` | 1104 | Zustand store, persistence, selectors |
| **State Types** | `lib/character-state.ts` | ~500 | GameState, CharacterState, serialization |
| **Dialogue Engine** | `lib/dialogue-graph.ts` | ~400 | DialogueNode, DialogueGraph, conditions |
| **Graph Registry** | `lib/graph-registry.ts` | ~200 | Character → Graph routing |
| **Game Logic** | `lib/game-logic.ts` | ~300 | Choice processing, calculations |
| **Patterns** | `lib/patterns.ts` | 237 | Pattern metadata, PATTERN_TYPES |
| **Consequences** | `lib/consequence-echoes.ts` | ~600 | Feedback text per character |
| **Sync Queue** | `lib/sync-queue.ts` | ~400 | Offline-first persistence |
| **Main UI** | `components/StatefulGameInterface.tsx` | 1775 | Game container |

---

## KNOWN ARCHITECTURE ISSUES

### 1. Dual Source of Truth
```
coreGameState (SerializableGameState)  ←──── SHOULD BE ONLY SOURCE
        ↓
syncDerivedState()  ←──── CREATES BIDIRECTIONAL SYNC TRAP
        ↓
characterTrust, patterns, thoughts  ←──── THESE SHOULD NOT EXIST
```

### 2. Missing Set/Map Hydration
```
localStorage → JSON.parse() → { characters: {...} }
                                     ↓
                            Should be Map, is Object
                                     ↓
                            .get() fails silently
```

### 3. Incomplete Game Content
```
Consequence Echoes:    9/11 characters (missing alex, silas)
Pattern Affinities:    1/11 characters (only maya)
Resonance Echoes:      3/11 characters (maya, devon, samuel)
```

---

## EXTERNAL INTEGRATIONS

| Service | Purpose | Config Key |
|---------|---------|------------|
| Supabase | Database, Auth | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Google Gemini | AI Dialogue | `GEMINI_API_KEY` |
| Anthropic | Future AI | `ANTHROPIC_API_KEY` |
| Vercel | Hosting | Auto-configured |
| Sentry | Error Tracking | `@sentry/nextjs` |

---

## COMPONENT HIERARCHY

```
app/page.tsx
└── StatefulGameInterface
    ├── GameHeader
    │   ├── CharacterAvatar (32×32 pixel)
    │   └── TrustDisplay
    ├── GameMessages
    │   ├── DialogueDisplay
    │   │   ├── ChatPacedDialogue
    │   │   └── RichTextRenderer
    │   └── StreamingMessage (AI responses)
    ├── GameChoices
    │   └── GameChoice[] (with conditions)
    ├── Journal (side panel)
    │   ├── ConstellationPanel
    │   │   ├── PeopleView
    │   │   └── SkillsView
    │   └── PatternDisplay
    └── GameMenu
```

---

*This document compresses the 5M+ token codebase into essential architecture understanding. Use it as a reference before modifying any system.*
