# Content-Heavy Feature Handoff

**Date:** January 6, 2026
**From:** Claude Code Session
**To:** Content Development (Google/Gemini)
**Status:** Infrastructure Complete, Content Needed

---

## Executive Summary

All derivative system **infrastructure** is built and tested. The following features need **content authoring** to become functional. The code exists - it just needs data.

---

## Features Requiring Content

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

**Location:** `lib/knowledge-derivatives.ts` (needs creation)

**What's Built:** Nothing yet - this is the exchange mechanic for D-057

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
Story arcs are multi-session narrative threads that span multiple characters and track progress over time.

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
  solution: 'The station isn\'t just a place - it\'s a manifestation of collective potential. It appears to those at crossroads, built from the echoes of every choice ever made here.',
  reward: {
    patternBonus: { exploring: 2 },
    unlockFlag: 'station_nature_understood'
  }
}
```

---

## Already Complete (For Reference)

These features are **fully wired** and working:

| Feature | What It Does |
|---------|--------------|
| D-002 | Pattern-gated content unlocks |
| D-003 | Trust-based voice tone |
| D-004 | Cross-character recognition comments |
| D-005 | Trust asymmetry reactions |
| D-007 | Pattern choice previews |
| D-009 | Pattern-filtered interrupts |
| D-019 | Iceberg references (casual mentions → investigations) |
| D-020 | Magical realism manifestations |
| D-039 | Trust timeline tracking |
| D-040 | Pattern evolution heatmap |
| D-059 | Achievement system |
| D-082 | Trust momentum |
| D-084 | Interrupt combo chains |
| D-093 | Trust inheritance |
| D-096 | Voice conflicts |

---

## Content Guidelines

### Voice & Tone
- Characters have distinct personalities (see `lib/character-typing.ts`)
- Dialogue should feel natural, not expository
- Trust-gated content should feel earned, not arbitrary

### Character Reference

| Character | Role | Voice Style |
|-----------|------|-------------|
| Samuel | Station Keeper | Wise, measured, slightly mysterious |
| Maya | Tech Innovator | Passionate, conflicted about family |
| Marcus | Medical Tech | Caring, practical, health-focused |
| Devon | Systems Thinker | Analytical, process-oriented |
| Tess | Education Founder | Warm, encouraging, mission-driven |
| Yaquin | EdTech Creator | Creative, youthful energy |
| Kai | Safety Specialist | Protective, detail-oriented |
| Alex | Supply Chain | Efficient, logistics-minded |
| Rohan | Deep Tech | Introspective, philosophical |
| Jordan | Career Navigator | Supportive, options-focused |
| Silas | Manufacturing | Hands-on, builder mentality |
| Elena | Archivist | Scholarly, pattern-seeking |
| Grace | Healthcare Ops | Compassionate, systemic thinker |
| Asha | Mediator | Calm, conflict-resolution focused |
| Lira | Communications | Expressive, audio/visual oriented |
| Zara | Data Ethics | Thoughtful, values-driven |

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

---

## Testing After Content Added

```bash
# Verify types compile
npm run build

# Run all tests
npm test

# Count content entries
grep -c "id:" content/info-trades.ts
```

---

## Questions for Content Author

1. Should info trades be character-specific files or one unified file?
2. How many story arcs should exist at launch?
3. Should synthesis puzzles require specific character combinations or any 3+ sources?
4. What's the desired ratio of common:rare:legendary info trades?

---

## Current Codebase Stats

- **Dialogue Nodes:** 946
- **Tests:** 929 passing
- **Characters:** 16
- **Derivative Systems:** 16 wired

---

**Next Session:** Wire content into game loop once authored
