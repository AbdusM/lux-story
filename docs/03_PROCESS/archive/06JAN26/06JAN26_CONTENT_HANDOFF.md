# Content-Heavy & Admin Feature Handoff

**Date:** January 6, 2026
**From:** Claude Code Session
**To:** Content Development (Google/Gemini)
**Status:** Infrastructure Complete, Content & Admin Work Needed

---

## Executive Summary

All derivative system **infrastructure** is built and tested. This document covers:
1. **Content-Heavy Features** - Need authored content to function
2. **Admin Dashboard Features** - Assessment/analytics systems
3. **Complex Character Features** - Need scenario authoring

---

## PART A: CONTENT-HEAVY FEATURES

### 1. D-057: Trust as Currency (Information Trading)

**Location:** `lib/trust-derivatives.ts:431-513`

**What's Built:**
- `InfoTradeOffer` interface
- `canAffordInfoTrade()` function
- `calculateInfoTrustValue()` function
- Trust tier requirements (common→legendary)

**What's Needed:** Authored `InfoTradeOffer` entries for each character

**Interface:**
```typescript
interface InfoTradeOffer {
  id: string              // Unique identifier
  characterId: string     // Which character offers this
  infoId: string          // What information this unlocks
  tier: 'common' | 'uncommon' | 'rare' | 'secret' | 'legendary'
  trustRequired: number   // Min trust to see offer (0-10)
  trustCost: number       // Trust spent when accepting
  description: string     // What the trade is about
  preview: string         // Teaser shown before unlocking
  fullContent: string     // Full info revealed after trade
}
```

**Trust Requirements by Tier:**
| Tier | Trust Required |
|------|----------------|
| common | 0 |
| uncommon | 3 |
| rare | 5 |
| secret | 7 |
| legendary | 9 |

**Content Needed Per Character (16 total):**
- 1-2 common trades (accessible early)
- 1 uncommon trade
- 1 rare trade (mid-game)
- 1 secret trade (late-game, vulnerability-related)
- 1 legendary trade (optional, deepest lore)

**Example Entry:**
```typescript
const MAYA_INFO_TRADES: InfoTradeOffer[] = [
  {
    id: 'maya_family_pressure',
    characterId: 'maya',
    infoId: 'maya_why_station',
    tier: 'uncommon',
    trustRequired: 3,
    trustCost: 1,
    description: 'Why Maya really came to the station',
    preview: 'There\'s more to Maya\'s story than she lets on...',
    fullContent: 'Maya reveals that her family\'s expectations nearly crushed her. The station appeared the night she considered giving up on her own dreams entirely.'
  }
]
```

**Suggested File:** `content/info-trades.ts`

---

### 2. D-056: Information Trading System

**Location:** `lib/knowledge-derivatives.ts` (needs expansion)

**What's Built:** Basic interfaces

**What's Needed:**
- Knowledge items that can be traded between characters
- Trade chains (Character A's info unlocks option with Character B)
- Cross-character gossip content

**Content Pattern:**
```typescript
interface KnowledgeItem {
  id: string
  sourceCharacterId: string
  topic: string
  content: string
  relatedCharacters: string[]  // Who this info is about
  unlocksTradesWith: string[]  // Which characters care about this
}
```

---

### 3. D-061: Story Arcs (Multi-Session Narratives)

**Location:** Needs `lib/story-arcs.ts` and `content/story-arcs/`

**What's Needed:**
Story arcs are multi-session narrative threads that span multiple characters.

**Structure:**
```typescript
interface StoryArc {
  id: string
  title: string
  description: string
  chapters: StoryChapter[]
  requiredCharacters: string[]
  unlockCondition: {
    minTrust?: Record<string, number>
    requiredFlags?: string[]
    minPatterns?: Partial<PlayerPatterns>
  }
}

interface StoryChapter {
  id: string
  nodeIds: string[]           // Dialogue nodes for this chapter
  completionFlag: string      // Flag set when chapter completes
  nextChapterTrigger: string  // What unlocks next chapter
}
```

**Suggested Arcs:**
1. **The Letter Mystery** - Who sent the invitation? (Samuel + station lore)
2. **Platform Seven** - What's beyond the flickering platform? (Multiple characters)
3. **The Quiet Hour** - When time stops at midnight (Mystical characters)
4. **Career Crossroads** - Character-specific deep dives (Per-character arcs)

---

### 4. D-083: Synthesis Puzzles

**Location:** Needs `lib/synthesis-puzzles.ts`

**What's Needed:**
Puzzles where players combine knowledge from multiple characters to unlock insights.

**Structure:**
```typescript
interface SynthesisPuzzle {
  id: string
  title: string
  description: string
  requiredKnowledge: string[]  // Knowledge flags needed
  hint: string                 // Shown when 50%+ collected
  solution: string             // Full synthesis text
  reward: {
    patternBonus?: Partial<PlayerPatterns>
    unlockFlag?: string
    unlockNode?: string
  }
}
```

**Example:**
```typescript
{
  id: 'station_origin',
  title: 'The Station\'s True Purpose',
  description: 'Piece together what the station really is',
  requiredKnowledge: [
    'samuel_station_history',
    'elena_archive_records',
    'rohan_deep_station_theory'
  ],
  hint: 'Samuel knows the history, Elena has the records, and Rohan has a theory...',
  solution: 'The station isn\'t just a place - it\'s a manifestation of collective potential.',
  reward: {
    patternBonus: { exploring: 2 },
    unlockFlag: 'station_nature_understood'
  }
}
```

---

## PART B: ADMIN DASHBOARD FEATURES

These features power the admin/analytics dashboard, not the main game loop.

### 5. D-011: Dynamic Career Recommendations

**Location:** `lib/assessment-derivatives.ts`

**What's Built:**
- `Skill` interface with 50+ skills defined
- `CareerField` interface
- Skill categories (communication, technical, analytical, interpersonal, leadership, creative)

**What's Needed:**
- `CareerField` entries for Birmingham-specific careers
- Career-to-skill mappings
- Pattern-to-career alignments

**Structure:**
```typescript
interface CareerField {
  id: string
  name: string
  sector: string
  requiredSkills: { skillId: string; minLevel: number }[]
  preferredPatterns: PatternType[]
  characterExamples: CharacterId[]
  birminghamEmployers?: string[]  // Local employers
}
```

**Content Needed:**
- 20-30 career fields covering Birmingham's key sectors
- Healthcare, Tech, Manufacturing, Education, Creative, Finance
- Each with 3-5 required skills and pattern alignments

**Suggested File:** `content/career-fields.ts`

---

### 6. D-012: Skill Transfer Visualization

**Location:** `lib/assessment-derivatives.ts`

**What's Built:**
- Skill `transferDomains` property
- Cross-domain skill tracking

**What's Needed:**
- Transfer pathway descriptions between domains
- Visual connection data for skill graph

**Content Pattern:**
```typescript
interface SkillTransfer {
  fromDomain: string
  toDomain: string
  transferableSkills: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  description: string  // How skills transfer
}
```

---

### 7. D-014: Skill Gap Identification

**Location:** `lib/assessment-derivatives.ts`

**What's Built:** Basic skill tracking

**What's Needed:**
- Target career skill profiles
- Gap analysis recommendations
- Learning pathway suggestions

**Content Pattern:**
```typescript
interface SkillGap {
  skillId: string
  currentLevel: number
  targetLevel: number
  gapDescription: string
  developmentSuggestions: string[]
  relatedCharacters: CharacterId[]  // Who can help develop this
}
```

---

### 8. D-015: Pattern-Skill Correlation Analysis

**Location:** `lib/assessment-derivatives.ts`

**What's Built:** Pattern-to-skill alignments in `SKILLS` registry

**What's Needed:**
- Correlation strength data
- Explanation text for each correlation
- Dashboard visualization data

---

### 9. D-053: Skill Application Challenges

**Location:** `lib/assessment-derivatives.ts`

**What's Needed:**
Mini-challenges that test skill application.

**Structure:**
```typescript
interface SkillChallenge {
  id: string
  skillId: string
  characterId: CharacterId  // Who presents this
  scenario: string
  options: {
    text: string
    skillLevel: number  // Demonstrates this level
    feedback: string
  }[]
}
```

**Content Needed:** 2-3 challenges per skill category

---

### 10. D-094: Skill Decay Mechanics

**Location:** `lib/assessment-derivatives.ts`

**What's Built:** Decay calculation functions

**What's Needed:**
- Decay rate configurations per skill type
- Refresh activity definitions
- Dashboard decay warnings

---

## PART C: COMPLEX CHARACTER FEATURES

These need authored scenarios and relationship content.

### 11. D-018: Sector-Specific Character Appearances

**Location:** `lib/character-derivatives.ts:419-560`

**What's Built:**
- `CHARACTER_LOCATIONS` registry with all 16 characters
- Sector definitions (hub, market, deep_station, platforms, workshops, archives)
- Time-of-day and flag-based conditions

**What's Needed:**
- Sector-specific dialogue variations
- Location-based encounter descriptions
- Time-based dialogue changes

**Content Pattern:**
```typescript
interface SectorDialogue {
  characterId: string
  sector: SectorId
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  greetings: string[]
  ambientComments: string[]
}
```

---

### 12. D-063: Character Relationship Drama

**Location:** `lib/character-derivatives.ts` (needs expansion)

**What's Needed:**
Scenarios where character relationships create tension.

**Structure:**
```typescript
interface RelationshipDrama {
  id: string
  characters: [CharacterId, CharacterId]  // The two in conflict
  trigger: {
    minTrustWithBoth?: number
    requiredFlags?: string[]
  }
  scenario: string
  playerChoices: {
    text: string
    sidesWith: CharacterId | 'neither' | 'both'
    consequence: {
      trustChanges: Record<string, number>
      flagsSet: string[]
    }
  }[]
}
```

**Suggested Dramas:**
- Maya vs Devon: Innovation vs Stability
- Tess vs Alex: Education vs Efficiency
- Rohan vs Zara: Truth vs Ethics
- Asha vs Lira: Visual vs Audio expression

---

### 13. D-095: Multi-Character Simultaneous Interactions

**Location:** `lib/character-derivatives.ts` (needs creation)

**What's Needed:**
Scenes with 3+ characters interacting together.

**Structure:**
```typescript
interface MultiCharacterScene {
  id: string
  characters: CharacterId[]  // 3+ characters
  trigger: {
    location: SectorId
    minTrustSum: number  // Combined trust across characters
    requiredFlags?: string[]
  }
  dialogue: {
    speaker: CharacterId
    text: string
    emotion?: string
  }[]
  choices: DialogueChoice[]
}
```

**Suggested Scenes:**
- The Council (Samuel, Tess, Marcus, Rohan)
- The Collaboration (Maya, Devon, Yaquin)
- The Symphony (Lira, Asha, Elena)

---

## PART D: ALREADY COMPLETE (For Reference)

These features are **fully wired** and working:

| Feature | What It Does |
|---------|--------------|
| D-001 | Pattern-influenced trust decay |
| D-002 | Pattern-gated content unlocks |
| D-003 | Trust-based voice tone |
| D-004 | Cross-character recognition comments |
| D-005 | Trust asymmetry reactions |
| D-007 | Pattern choice previews |
| D-009 | Pattern-filtered interrupts |
| D-010 | Echo intensity based on trust |
| D-019 | Iceberg references (casual mentions → investigations) |
| D-020 | Magical realism manifestations |
| D-039 | Trust timeline tracking |
| D-040 | Pattern evolution heatmap |
| D-059 | Achievement system |
| D-082 | Trust momentum |
| D-084 | Interrupt combo chains |
| D-093 | Trust inheritance |
| D-096 | Voice conflicts |

**Being Wired by Claude (in parallel):**
| Feature | What It Does |
|---------|--------------|
| D-016 | Environmental changes from character trust |
| D-017 | Cross-character loyalty prerequisites |
| D-062 | Consequence cascade chains |
| D-064 | Narrative framing by dominant pattern |
| D-065 | Meta-narrative at pattern mastery |

---

## Content Guidelines

### Voice & Tone
- Characters have distinct personalities (see `lib/character-typing.ts`)
- Dialogue should feel natural, not expository
- Trust-gated content should feel earned, not arbitrary

### Character Reference

| Character | Role | Voice Style | Sector |
|-----------|------|-------------|--------|
| Samuel | Station Keeper | Wise, measured, mysterious | Hub |
| Maya | Tech Innovator | Passionate, conflicted | Platforms |
| Marcus | Medical Tech | Caring, practical | Deep Station |
| Devon | Systems Thinker | Analytical, process-oriented | Workshops |
| Tess | Education Founder | Warm, encouraging | Market |
| Yaquin | EdTech Creator | Creative, youthful | Platforms |
| Kai | Safety Specialist | Protective, detail-oriented | Hub |
| Alex | Supply Chain | Efficient, logistics-minded | Market |
| Rohan | Deep Tech | Introspective, philosophical | Deep Station |
| Jordan | Career Navigator | Supportive, options-focused | Hub |
| Silas | Manufacturing | Hands-on, builder mentality | Workshops |
| Elena | Archivist | Scholarly, pattern-seeking | Archives |
| Grace | Healthcare Ops | Compassionate, systemic | Deep Station |
| Asha | Mediator/Artist | Calm, visual expression | Wandering |
| Lira | Communications | Expressive, audio-oriented | Deep Station |
| Zara | Data Ethics | Thoughtful, values-driven | Archives |

### Pattern Integration
Content should naturally reinforce the 5 patterns:
- **Analytical** - Logic, data, systems thinking
- **Patience** - Long-term thinking, careful consideration
- **Exploring** - Curiosity, discovery, new perspectives
- **Helping** - Supporting others, empathy, service
- **Building** - Creating, constructing, hands-on work

---

## File Locations

| Content Type | Suggested Location |
|--------------|-------------------|
| Info Trades | `content/info-trades.ts` |
| Story Arcs | `content/story-arcs/` |
| Synthesis Puzzles | `content/synthesis-puzzles.ts` |
| Knowledge Items | `content/knowledge-items.ts` |
| Career Fields | `content/career-fields.ts` |
| Skill Challenges | `content/skill-challenges.ts` |
| Relationship Dramas | `content/relationship-dramas.ts` |
| Multi-Character Scenes | `content/multi-character-scenes.ts` |
| Sector Dialogues | `content/sector-dialogues.ts` |

---

## Testing After Content Added

```bash
# Verify types compile
npm run build

# Run all tests
npm test

# Count content entries
grep -c "id:" content/info-trades.ts
grep -c "id:" content/career-fields.ts
```

---

## Priority Order

### High Priority (Core Experience)
1. D-057 Info Trades (16 chars × 5 tiers)
2. D-083 Synthesis Puzzles (5-10 puzzles)
3. D-063 Relationship Dramas (4-6 scenarios)

### Medium Priority (Depth)
4. D-061 Story Arcs (3-4 arcs)
5. D-056 Knowledge Trading chains
6. D-095 Multi-Character Scenes (3-5 scenes)

### Lower Priority (Admin/Analytics)
7. D-011 Career Fields (20-30 entries)
8. D-053 Skill Challenges (15-20 challenges)
9. D-012, D-014, D-015 correlation data

---

## Current Codebase Stats

- **Dialogue Nodes:** 946
- **Tests:** 929 passing
- **Characters:** 16
- **Derivative Systems:** 22 total (17 wired, 5 in progress)
- **Skills Defined:** 50+

---

**Next Steps:**
1. Google/Gemini authors content using interfaces above
2. Claude wires D-016, D-017, D-062, D-064, D-065
3. Integration session to connect new content
