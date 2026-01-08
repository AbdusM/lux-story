# Content Completion Handoff - Phase 2

**Date:** January 6, 2026
**From:** Claude Code Session
**To:** Google/Gemini Content Team
**Status:** Infrastructure Complete, Content Authoring Needed

---

## Executive Summary

Phase 1 delivered excellent **infrastructure** for admin analytics (100% complete) and complex character systems (infrastructure ready). However, **content-heavy features** need significant authoring work:

| Feature | Current | Target | Gap |
|---------|---------|--------|-----|
| D-057 Info Trades | 4 trades | 80 trades | 76 needed |
| D-061 Story Arcs | 1 arc | 4 arcs | 3 needed |
| D-083 Synthesis Puzzles | 0 | 5-10 | All needed |
| D-056 Knowledge Trading | 0 | System + items | All needed |

---

## PART A: INFO TRADES (D-057) - HIGH PRIORITY

### Current State
**File:** `content/info-trades.ts`
**Existing:** 4 trades (Maya: 2, Samuel: 2)
**Target:** ~80 trades (16 characters × 5 tiers)

### TypeScript Interface
```typescript
import { InfoTradeOffer } from '../lib/trust-derivatives'

interface InfoTradeOffer {
  id: string              // Unique identifier (e.g., 'maya_family_pressure')
  characterId: string     // Which character offers this
  infoId: string          // Knowledge flag unlocked
  tier: 'common' | 'uncommon' | 'rare' | 'secret' | 'legendary'
  trustRequired: number   // Min trust to see offer (0-10)
  trustCost: number       // Trust spent when accepting
  description: string     // What the trade is about
  preview: string         // Teaser shown before unlocking
  fullContent: string     // Full reveal after trade
}
```

### Tier Requirements
| Tier | Trust Required | Trust Cost | Content Depth |
|------|----------------|------------|---------------|
| common | 0 | 0 | Surface info, easily shared |
| uncommon | 3 | 1 | Personal details |
| rare | 5 | 2 | Significant vulnerabilities |
| secret | 7 | 3 | Deep secrets, painful truths |
| legendary | 9 | 4 | World-changing revelations |

### Characters Needing Trades (14 remaining)

**Tier 1 - Core Characters (5-6 trades each):**

#### DEVON (Systems Thinker)
```typescript
export const DEVON_INFO_TRADES: InfoTradeOffer[] = [
  {
    id: 'devon_process_obsession',
    characterId: 'devon',
    infoId: 'devon_why_systems',
    tier: 'common',
    trustRequired: 0,
    trustCost: 0,
    description: 'Why Devon obsesses over processes',
    preview: 'Devon seems to find comfort in systems...',
    fullContent: '"Chaos terrifies me," Devon admits. "When my parents divorced, nothing made sense. Systems gave me control when everything else was falling apart."'
  },
  // Add: uncommon, rare, secret, legendary trades
]
```

#### MARCUS (Medical Tech)
- common: Why he chose medicine
- uncommon: The patient he couldn't save
- rare: His fear of emotional attachment
- secret: The mistake that haunts him
- legendary: What he would change about healthcare

#### TESS (Education Founder)
- common: Her teaching philosophy
- uncommon: The student who changed her
- rare: Why she left traditional education
- secret: Her own learning struggles
- legendary: The system she wishes existed

#### KAI (Safety Specialist)
- common: Why safety matters to him
- uncommon: The accident he witnessed
- rare: His fear of being responsible
- secret: Someone he couldn't protect
- legendary: What true safety means

#### ROHAN (Deep Tech)
- common: His fascination with depth
- uncommon: Why he avoids surface conversations
- rare: The loneliness of understanding
- secret: What he discovered about the station
- legendary: The truth about Platform Seven

**Tier 2 - Secondary Characters (4-5 trades each):**

#### YAQUIN (EdTech Creator)
- Focus: Creative expression, youth perspective, accessibility

#### JORDAN (Career Navigator)
- Focus: Helping others find paths, their own uncertainty

#### ALEX (Supply Chain)
- Focus: Efficiency vs humanity, what gets lost in optimization

#### SILAS (Manufacturing)
- Focus: Hands-on wisdom, what machines can't replace

**Tier 3 - Extended Characters (3-4 trades each):**

#### ELENA (Archivist)
- Focus: What the records reveal, patterns in history

#### GRACE (Healthcare Ops)
- Focus: Systemic compassion, burnout, resilience

#### ASHA (Mediator/Artist)
- Focus: Visual expression, conflict as art

#### LIRA (Communications)
- Focus: Sound and meaning, what words can't capture

#### ZARA (Data Ethics)
- Focus: Moral dilemmas, the cost of knowledge

### File Structure
```typescript
// content/info-trades.ts

// Existing (keep as-is)
export const MAYA_INFO_TRADES: InfoTradeOffer[] = [...]
export const SAMUEL_INFO_TRADES: InfoTradeOffer[] = [...]

// Add these sections
export const DEVON_INFO_TRADES: InfoTradeOffer[] = [...]
export const MARCUS_INFO_TRADES: InfoTradeOffer[] = [...]
export const TESS_INFO_TRADES: InfoTradeOffer[] = [...]
// ... etc for all 14 remaining characters

// Update registry
export const ALL_INFO_TRADES: InfoTradeOffer[] = [
  ...MAYA_INFO_TRADES,
  ...SAMUEL_INFO_TRADES,
  ...DEVON_INFO_TRADES,
  ...MARCUS_INFO_TRADES,
  // ... all characters
]
```

---

## PART B: STORY ARCS (D-061) - HIGH PRIORITY

### Current State
**File:** `content/story-arcs/index.ts`
**Existing:** 1 arc ("The Letter Mystery" - 2 chapters)
**Target:** 4 arcs with 3-5 chapters each

### TypeScript Interface
```typescript
import { StoryArc, StoryChapter } from '../../lib/story-arcs'

interface StoryArc {
  id: string
  title: string
  description: string
  chapters: StoryChapter[]
  requiredCharacters: string[]
  unlockCondition?: {
    minTrust?: Record<string, number>
    requiredFlags?: string[]
    minPatterns?: Partial<PlayerPatterns>
  }
}

interface StoryChapter {
  id: string
  title: string
  description: string
  nodeIds: string[]           // References to dialogue nodes
  completionFlag: string      // Flag set when complete
  nextChapterTrigger?: string // What unlocks next chapter
}
```

### Required Arcs (3 more needed)

#### ARC 2: PLATFORM SEVEN
```typescript
const PLATFORM_SEVEN: StoryArc = {
  id: 'platform_seven',
  title: 'Platform Seven',
  description: 'What lies beyond the flickering platform that nobody visits?',
  requiredCharacters: ['rohan', 'samuel', 'elena'],
  chapters: [
    {
      id: 'p7_ch1_rumors',
      title: 'Whispered Warnings',
      description: 'Rohan mentions Platform Seven. Samuel changes the subject.',
      nodeIds: ['rohan_platform_mention', 'samuel_platform_deflect'],
      completionFlag: 'platform_seven_discovered'
    },
    {
      id: 'p7_ch2_archives',
      title: 'The Missing Records',
      description: 'Elena\'s archives have a gap. Something was erased.',
      nodeIds: ['elena_missing_pages', 'elena_discovered_gap'],
      completionFlag: 'platform_records_found',
      nextChapterTrigger: 'elena_trust_7'
    },
    {
      id: 'p7_ch3_journey',
      title: 'The Descent',
      description: 'With enough trust, someone will take you there.',
      nodeIds: ['rohan_platform_journey', 'platform_seven_arrival'],
      completionFlag: 'platform_seven_visited'
    },
    {
      id: 'p7_ch4_truth',
      title: 'What Was Lost',
      description: 'Platform Seven holds the station\'s greatest secret.',
      nodeIds: ['platform_revelation', 'samuel_final_truth'],
      completionFlag: 'platform_mystery_solved'
    }
  ],
  unlockCondition: {
    minTrust: { rohan: 3 },
    minPatterns: { exploring: 3 }
  }
}
```

#### ARC 3: THE QUIET HOUR
```typescript
const THE_QUIET_HOUR: StoryArc = {
  id: 'quiet_hour',
  title: 'The Quiet Hour',
  description: 'At midnight, time stops. Only some can move.',
  requiredCharacters: ['samuel', 'lira', 'asha'],
  chapters: [
    // 4-5 chapters exploring the mystical time-stop phenomenon
    // Involves characters with patience/exploring patterns
  ],
  unlockCondition: {
    minPatterns: { patience: 5 }
  }
}
```

#### ARC 4: CAREER CROSSROADS
```typescript
const CAREER_CROSSROADS: StoryArc = {
  id: 'career_crossroads',
  title: 'Career Crossroads',
  description: 'A series of character-specific deep dives into life decisions.',
  requiredCharacters: ['jordan', 'maya', 'devon'],
  chapters: [
    // Multiple character perspectives on career choices
    // Ties into Birmingham career exploration theme
  ],
  unlockCondition: {
    requiredFlags: ['completed_three_character_arcs']
  }
}
```

### Integration Note
Story arc node IDs (e.g., `rohan_platform_mention`) should reference existing dialogue nodes or new nodes that need to be created in the character dialogue graphs.

---

## PART C: SYNTHESIS PUZZLES (D-083) - HIGH PRIORITY

### Current State
**File:** `content/synthesis-puzzles.ts` (DOES NOT EXIST - create new)
**Target:** 5-10 puzzles

### TypeScript Interface
```typescript
// content/synthesis-puzzles.ts

import { PatternType } from '../lib/patterns'

export interface SynthesisPuzzle {
  id: string
  title: string
  description: string
  requiredKnowledge: string[]  // Knowledge flags player must have
  hint: string                 // Shown when 50%+ knowledge collected
  solution: string             // Full synthesis text when complete
  reward: {
    patternBonus?: Partial<Record<PatternType, number>>
    unlockFlag?: string
    unlockNodeId?: string
  }
}
```

### Required Puzzles (5-10)

#### PUZZLE 1: THE STATION'S TRUE PURPOSE
```typescript
{
  id: 'station_origin',
  title: 'The Station\'s True Purpose',
  description: 'Piece together what the station really is',
  requiredKnowledge: [
    'samuel_station_history',     // From Samuel
    'elena_archive_records',       // From Elena
    'rohan_deep_station_theory'    // From Rohan
  ],
  hint: 'Samuel knows the history, Elena has the records, and Rohan has a theory...',
  solution: 'The station isn\'t just a place - it\'s a manifestation of collective potential. It appears to those at crossroads, offering paths they couldn\'t see alone.',
  reward: {
    patternBonus: { exploring: 2 },
    unlockFlag: 'station_nature_understood'
  }
}
```

#### PUZZLE 2: THE LETTER SENDER
```typescript
{
  id: 'letter_sender_identity',
  title: 'Who Sent the Invitation?',
  description: 'Discover who truly summoned you to the station',
  requiredKnowledge: [
    'letter_handwriting_match',    // From Elena archive search
    'samuel_pocket_watch_secret',  // From Samuel high-trust trade
    'time_fold_understanding'      // From Quiet Hour arc
  ],
  hint: 'The handwriting is familiar. Time works differently here...',
  solution: 'You sent the letter yourself. From a future self who found their path, reaching back to the moment of greatest uncertainty.',
  reward: {
    patternBonus: { patience: 3 },
    unlockFlag: 'self_invitation_revealed',
    unlockNodeId: 'samuel_time_loop_dialogue'
  }
}
```

#### PUZZLE 3-10 SUGGESTIONS
- **The Birmingham Connection** - Why the station appears in Birmingham specifically
- **The Repeating Patterns** - Why certain visitors appear multiple times
- **The Missing Platform** - What happened to Platform Seven
- **The Conductor's Burden** - Why Samuel stays
- **The Archives Secret** - What Elena is really protecting
- **The Signal in the Noise** - What Lira hears in the station sounds
- **The Maker's Dilemma** - Maya's true purpose for her inventions

---

## PART D: KNOWLEDGE TRADING (D-056) - MEDIUM PRIORITY

### Current State
**File:** `content/knowledge-items.ts` (DOES NOT EXIST - create new)
**Target:** Knowledge items + trade chains

### TypeScript Interface
```typescript
// content/knowledge-items.ts

export interface KnowledgeItem {
  id: string
  sourceCharacterId: string
  topic: string
  content: string
  relatedCharacters: string[]   // Who this info is about
  unlocksTradesWith: string[]   // Which characters care about this
  tier: 'rumor' | 'insight' | 'secret' | 'truth'
}

export interface KnowledgeTradeChain {
  id: string
  description: string
  steps: {
    characterId: string
    requiresKnowledge: string[]
    grantsKnowledge: string
    trustChange: number
  }[]
}
```

### Example Knowledge Items
```typescript
export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'maya_workshop_location',
    sourceCharacterId: 'maya',
    topic: 'The Hidden Workshop',
    content: 'Maya\'s workshop is beyond Platform 3, through the maintenance door.',
    relatedCharacters: ['maya', 'devon'],
    unlocksTradesWith: ['devon', 'silas'],
    tier: 'insight'
  },
  {
    id: 'samuel_age_secret',
    sourceCharacterId: 'elena',
    topic: 'The Conductor\'s Age',
    content: 'Elena found records suggesting Samuel has been here... impossibly long.',
    relatedCharacters: ['samuel', 'elena'],
    unlocksTradesWith: ['rohan', 'samuel'],
    tier: 'secret'
  }
]
```

### Example Trade Chain
```typescript
export const TRADE_CHAINS: KnowledgeTradeChain[] = [
  {
    id: 'workshop_discovery_chain',
    description: 'Learn about the hidden workshops through character connections',
    steps: [
      {
        characterId: 'maya',
        requiresKnowledge: [],
        grantsKnowledge: 'maya_workshop_location',
        trustChange: 0
      },
      {
        characterId: 'devon',
        requiresKnowledge: ['maya_workshop_location'],
        grantsKnowledge: 'devon_systems_room',
        trustChange: 1
      },
      {
        characterId: 'silas',
        requiresKnowledge: ['devon_systems_room'],
        grantsKnowledge: 'manufacturing_basement',
        trustChange: 1
      }
    ]
  }
]
```

---

## PART E: COMPLEX CHARACTER SCENARIOS

### Current State
**File:** `lib/character-complex.ts`
**Status:** Infrastructure complete, needs authored scenarios

### D-018: Memetic Infection Scenarios
Create 3-5 "idea viruses" that spread between characters:

```typescript
// Add to lib/character-complex.ts or separate content file

export const STATION_MEMES: Meme[] = [
  {
    id: 'station_alive_theory',
    name: 'The Station is Alive',
    originCharacterId: 'rohan',
    potency: 0.3,
    infectedCharacters: new Set(['rohan']),
    mutatedVariants: ['station_dreams', 'station_chooses']
  },
  {
    id: 'time_is_circular',
    name: 'Time is a Loop',
    originCharacterId: 'samuel',
    potency: 0.2,
    infectedCharacters: new Set(['samuel', 'elena']),
    mutatedVariants: ['past_is_future', 'we_return']
  },
  // 3-5 more memes
]
```

### D-063: Archetype Evolution Stages
Define evolution paths for each character:

```typescript
export const CHARACTER_ARCHETYPE_PATHS: Record<string, ArchetypeEvolution> = {
  maya: {
    characterId: 'maya',
    currentArchetype: 'catalyst',
    evolutionProgress: 0,
    potentialNextStage: 'mentor' // Can evolve to mentor through building pattern
  },
  samuel: {
    characterId: 'samuel',
    currentArchetype: 'mentor',
    evolutionProgress: 0,
    potentialNextStage: 'shadow' // Dark mentor path if player challenges him
  },
  // ... all 16 characters
}
```

### D-095: Secret Loyalty Factions
Define hidden allegiances:

```typescript
export const CHARACTER_LOYALTIES: Record<string, SecretLoyalty> = {
  samuel: {
    characterId: 'samuel',
    trueAllegiance: 'preservation',
    publicAllegiance: 'preservation', // No mask
    suspicionLevel: 0
  },
  rohan: {
    characterId: 'rohan',
    trueAllegiance: 'entropy',        // Secret!
    publicAllegiance: 'preservation',
    suspicionLevel: 0
  },
  elena: {
    characterId: 'elena',
    trueAllegiance: 'acceleration',   // Secret!
    publicAllegiance: 'preservation',
    suspicionLevel: 0
  },
  // ... characters with hidden agendas
}
```

---

## Content Guidelines

### Voice Consistency
Each character has a distinct voice (see `lib/character-typing.ts`):
- **Samuel**: Wise, measured, speaks in metaphors
- **Maya**: Passionate, conflicted, technical but emotional
- **Devon**: Analytical, process-oriented, structured
- **Rohan**: Introspective, philosophical, questions everything

### Pattern Integration
Content should reinforce the 5 patterns:
- **Analytical** - Logic, data, systems thinking
- **Patience** - Long-term thinking, careful consideration
- **Exploring** - Curiosity, discovery, new perspectives
- **Helping** - Supporting others, empathy, service
- **Building** - Creating, constructing, hands-on work

### Birmingham Context
Where appropriate, tie content to Birmingham:
- Local employers and industries
- Regional career paths
- Community connections

---

## Validation Checklist

### After Adding Content
```bash
# Verify types compile
npm run build

# Run all tests
npm test

# Count content entries
echo "=== Info Trades ==="
grep -c "id:" content/info-trades.ts

echo "=== Story Arcs ==="
grep -c "id:" content/story-arcs/index.ts

echo "=== Synthesis Puzzles ==="
grep -c "id:" content/synthesis-puzzles.ts

echo "=== Knowledge Items ==="
grep -c "id:" content/knowledge-items.ts
```

### Target Counts
- Info Trades: 80+ entries
- Story Arcs: 4 arcs, 15+ chapters total
- Synthesis Puzzles: 5-10 entries
- Knowledge Items: 20-30 entries
- Trade Chains: 5-10 chains

---

## Priority Order

### Phase 1 (Highest Impact)
1. **D-057 Info Trades** - Core character depth
2. **D-061 Story Arcs** - Multi-session engagement

### Phase 2 (Medium Impact)
3. **D-083 Synthesis Puzzles** - Knowledge reward loop
4. **D-056 Knowledge Trading** - Cross-character connections

### Phase 3 (Polish)
5. **D-018 Memetic Scenarios** - Depth layer
6. **D-063 Archetype Stages** - Character evolution
7. **D-095 Loyalty Factions** - Mystery layer

---

## Already Complete (For Reference)

These features are **100% functional** from Phase 1:

| Feature | Description | Status |
|---------|-------------|--------|
| D-011 | Real-time Flow Tracking | ✅ Complete |
| D-012 | Drop-off Heatmap | ✅ Complete |
| D-014 | A/B Testing Framework | ✅ Complete |
| D-015 | Cohort Analysis | ✅ Complete |
| D-053 | Admin Urgency System | ✅ Complete |
| D-094 | Admin Simulation | ✅ Complete |

---

**Next Steps:**
1. Author content using templates above
2. Run validation checklist after each batch
3. Integration session to wire new content into game loop
