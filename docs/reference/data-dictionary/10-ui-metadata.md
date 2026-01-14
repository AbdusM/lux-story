# UI/UX Metadata - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/unlock-effects.ts`, `/lib/ui-constants.ts`
**Status:** Auto-generated

## Overview

This document catalogs all UI-specific metadata including Birmingham location context, emotion subtext mappings, unlock effects, and UI enhancement systems.

**Key Stats:**
- Birmingham locations: 15 unique
- Emotion subtext mappings: 52 emotions
- Pattern unlocks: 15 total (3 levels × 5 patterns)
- Content enhancement types: 6 categories

---

## Birmingham Location Context

### Location Metadata

Automatically surfaced when Exploring unlock is achieved. Provides real-world context for Birmingham references in dialogue.

| Location | Emoji | Context |
|----------|-------|---------|
| UAB | 🏛️ | University of Alabama at Birmingham - Major medical research hub, 23,000 students |
| University of Alabama at Birmingham | 🏛️ | UAB - Major medical research hub, 23,000 students |
| Innovation Depot | 💡 | Birmingham's tech incubator - 100+ startups, $100M+ capital raised |
| Children's of Alabama | 🏥 | Alabama's only children's hospital - 350+ pediatric specialists |
| Childrens Hospital | 🏥 | Children's of Alabama - 350+ pediatric specialists |
| Sloss Furnaces | 🏭 | Historic ironworks, symbol of Birmingham's industrial heritage |
| Railroad Park | 🌳 | 21-acre green space connecting downtown districts |
| Vulcan Park | ⚒️ | World's largest cast iron statue overlooking the city |
| Regions Field | ⚾ | Home of the Birmingham Barons, minor league baseball |
| Woodlawn | 🔨 | Emerging maker/arts district with community workshops |
| Covalence | 💻 | Birmingham coding bootcamp in Innovation Depot |
| Protective Life | 🏢 | Insurance company headquartered in downtown Birmingham |
| Nucor Steel | 🏭 | Steel manufacturer in Birmingham, employs 400+ locally |
| Lawson State | 🎓 | Lawson State Community College - vocational and technical training |
| Mercedes-Benz | 🚗 | Mercedes-Benz U.S. International plant in nearby Tuscaloosa |

### Usage

Locations are automatically detected in dialogue text and display as tooltips when the player has the **Exploring unlock (Level 1: 25%)**.

```typescript
import { extractBirminghamLocation } from '@/lib/unlock-effects'

const text = "I'm working at UAB Medical Center now"
const location = extractBirminghamLocation(text)
// Returns: { location: 'UAB', context: '🏛️ UAB - Major medical research hub...' }
```

---

## Emotion Subtext Mappings

### Observable Behavior Cues

Maps character emotions to visible behavioral hints. Shown when player has **Analytical unlock (Level 1: Read Between Lines)** or **Helping unlock (Level 1: Empathy Sense)**.

### Anxiety/Uncertainty Cluster

| Emotion | Subtext Hint |
|---------|--------------|
| anxious | [You notice their hands fidgeting] |
| nervous | [They shift their weight nervously] |
| uncertain | [Their voice wavers slightly] |
| conflicted | [They pause, seeming torn between thoughts] |

### Positive States Cluster

| Emotion | Subtext Hint |
|---------|--------------|
| hopeful | [There's a brightness in their eyes] |
| excited | [They lean forward as they speak] |
| determined | [Their jaw sets with resolve] |
| warm | [Their expression softens] |
| proud | [They stand a little taller] |

### Guarded/Defensive Cluster

| Emotion | Subtext Hint |
|---------|--------------|
| guarded | [They're choosing words carefully] |
| defensive | [Their arms cross slightly] |
| wary | [They maintain careful distance] |
| suspicious | [Their eyes narrow] |

### Vulnerable Cluster

| Emotion | Subtext Hint |
|---------|--------------|
| vulnerable | [Their voice drops to almost a whisper] |
| raw | [Emotion cracks through their usual composure] |
| honest | [They meet your eyes directly] |
| open | [Their shoulders relax] |

### Neutral/Thinking Cluster

| Emotion | Subtext Hint |
|---------|--------------|
| contemplative | [They pause to gather their thoughts] |
| thoughtful | [They consider before responding] |
| curious | [They tilt their head slightly] |
| focused | [Their attention sharpens] |

**Total Mapped:** 20 emotions with behavioral cues (additional 32 emotions have standard presentation)

---

## Pattern Unlock Effects

### Unlock Levels

Each pattern has 3 unlock levels that enhance existing content without requiring new authorship:

| Pattern | Level 1 (25%) | Level 2 (50%) | Level 3 (85%) |
|---------|---------------|---------------|---------------|
| **Analytical** | Read Between Lines | Pattern Recognition | Strategic Insight |
| **Patience** | Take Your Time | (unused) | Measured Response |
| **Exploring** | Curiosity Rewarded | (unused) | Seeker's Intuition |
| **Helping** | Empathy Sense | (unused) | Heart to Heart |
| **Building** | (unused) | (unused) | Architect's Vision |

### Effect Details

#### Analytical Unlocks

**Level 1: Read Between Lines (25%)**
- **Effect:** Show emotion tags and subtext hints
- **Enhancement:** `showEmotionTag = true`, `subtextHint` from emotion mapping
- **Example:** Dialogue shows "[anxious]" and "[You notice their hands fidgeting]"

**Level 2: Pattern Recognition (50%)**
- **Effect:** Show trust delta insights
- **Enhancement:** `journalInsight` with trust change analysis
- **Example:** "Maya has opened up significantly - your approach resonates with them"

**Level 3: Strategic Insight (85%)**
- **Effect:** Highlight analytical dialogue choices
- **Enhancement:** `highlightPatterns = ['analytical']`, ring-2 ring-indigo-400/30
- **Example:** Analytical choices have subtle blue glow

#### Patience Unlocks

**Level 3: Measured Response (85%)**
- **Effect:** Highlight patience dialogue choices
- **Enhancement:** `highlightPatterns = ['patience']`, ring-2 ring-sky-400/30
- **Example:** Patience choices have subtle sky-blue glow

#### Exploring Unlocks

**Level 1: Curiosity Rewarded (25%)**
- **Effect:** Show Birmingham location tooltips
- **Enhancement:** `birminghamTooltip` with location context
- **Example:** Hovering over "UAB" shows university details

**Level 3: Seeker's Intuition (85%)**
- **Effect:** Highlight exploring dialogue choices
- **Enhancement:** `highlightPatterns = ['exploring']`, ring-2 ring-purple-400/30
- **Example:** Exploring choices have subtle purple glow

#### Helping Unlocks

**Level 1: Empathy Sense (25%)**
- **Effect:** Show emotion tags and trust level
- **Enhancement:** `showEmotionTag = true`, `showTrustLevel = true`, `trustValue`
- **Example:** Dialogue header shows "[hopeful] Trust: 7/10"

**Level 3: Heart to Heart (85%)**
- **Effect:** Highlight helping dialogue choices
- **Enhancement:** `highlightPatterns = ['helping']`, ring-2 ring-emerald-400/30
- **Example:** Helping choices have subtle green glow

#### Building Unlocks

**Level 3: Architect's Vision (85%)**
- **Effect:** Highlight building dialogue choices
- **Enhancement:** `highlightPatterns = ['building']`, ring-2 ring-amber-400/30
- **Example:** Building choices have subtle amber glow

---

## Content Enhancement System

### Enhancement Types

| Enhancement | Purpose | Trigger |
|-------------|---------|---------|
| `showEmotionTag` | Display character's current emotion | Analytical L1, Helping L1 |
| `showTrustLevel` | Display trust value (0-10) | Helping L1 |
| `trustValue` | Numerical trust score | Helping L1 |
| `subtextHint` | Observable behavior cue | Analytical L1, Subtext Reader ability |
| `birminghamTooltip` | Location context | Exploring L1 |
| `highlightPatterns` | Pattern-matching choice emphasis | All patterns L3 (85%) |
| `choiceEmphasisClass` | CSS class for choice styling | All patterns L3 (85%) |
| `journalInsight` | Pattern insight for Journal | Analytical L2 |

### Trust Delta Insights

Generated when Analytical Level 2 unlocked. Based on trust change from initial meeting:

| Delta | Insight Template |
|-------|------------------|
| +3 or more | "{Character} has opened up significantly - your approach resonates with them" |
| +2 | "{Character} is warming to you - they trust you more than before" |
| -2 | "{Character} seems more guarded - they may be protecting something" |
| -3 or less | "{Character} has pulled back - something you said didn't land well" |

---

## Validation Rules

### Content Enhancement Context

```typescript
import { getContentEnhancements, type UnlockContext } from '@/lib/unlock-effects'

const context: UnlockContext = {
  gameState: currentGameState,
  currentCharacter: characterState,
  characterName: 'Maya',
  dialogueText: "I'm studying at UAB now",
  dialogueEmotion: 'hopeful',
  hasUnlock: (id) => gameState.achievements.includes(id),
  patternFills: {
    analytical: 0.75,
    patience: 0.5,
    exploring: 0.3,
    helping: 0.9,
    building: 0.4
  }
}

const enhancements = getContentEnhancements(context)
// Returns: {
//   showEmotionTag: true,
//   showTrustLevel: true,
//   trustValue: 7,
//   subtextHint: "[There's a brightness in their eyes]",
//   birminghamTooltip: { location: 'UAB', context: '...' },
//   highlightPatterns: ['analytical', 'helping'],
//   choiceEmphasisClass: 'ring-2 ring-indigo-400/30 bg-indigo-50/30'
// }
```

### Checking Active Enhancements

```typescript
import { hasActiveEnhancements } from '@/lib/unlock-effects'

const isEnhanced = hasActiveEnhancements(enhancements)
// Returns: true if any enhancement is active
```

---

## Usage Examples

### Displaying Emotion Subtext

```typescript
import { getEmotionSubtext } from '@/lib/unlock-effects'

const subtext = getEmotionSubtext('anxious')
// Returns: "[You notice their hands fidgeting]"

// In dialogue component
{enhancement.subtextHint && (
  <p className="text-xs text-slate-500 italic mt-1">
    {enhancement.subtextHint}
  </p>
)}
```

### Birmingham Location Tooltip

```typescript
import { extractBirminghamLocation } from '@/lib/unlock-effects'

const dialogueText = "I volunteer at Children's of Alabama on weekends"
const location = extractBirminghamLocation(dialogueText)

if (location && hasUnlock('exploring-1')) {
  return (
    <Tooltip>
      <TooltipTrigger>{location.location}</TooltipTrigger>
      <TooltipContent>{location.context}</TooltipContent>
    </Tooltip>
  )
}
```

### Pattern Choice Highlighting

```typescript
// In GameChoice component
const enhancements = getContentEnhancements(context)

return (
  <button
    className={cn(
      "base-choice-styles",
      enhancements.choiceEmphasisClass // Adds pattern glow if applicable
    )}
  >
    {choiceText}
  </button>
)
```

---

## Design Philosophy

### Layered Revelation

**Core Principle:** Unlocks reveal layers of content that's already there, rather than requiring new authorship.

**Implementation:**
- Emotions already tagged in dialogue → Analytical unlock makes them visible
- Birmingham locations already mentioned → Exploring unlock adds context
- Trust already tracked → Helping unlock surfaces the number
- Pattern alignment already calculated → Level 3 unlocks highlight matches

### Sustainable Content System

**Philosophy from unlock-effects.ts:**
```typescript
/**
 * Makes pattern unlocks functionally meaningful by enhancing the rendering
 * of EXISTING content rather than requiring new content authorship.
 *
 * PHILOSOPHY:
 * - Unlocks reveal layers of content that's already there
 * - No new dialogue writing required
 * - Uses existing emotion tags, trust levels, and Birmingham references
 * - Sustainable: New characters/content automatically benefit from unlocks
 */
```

**Benefits:**
- **Scalable:** New characters inherit all unlock effects automatically
- **Maintainable:** No pattern-specific dialogue branches to write
- **Discoverable:** Players experience progression without content gating
- **Replayable:** Different patterns reveal different layers

---

## Cross-References

- **Patterns:** See `03-patterns.md` for pattern thresholds and unlock triggers
- **Emotions:** See `01-emotions.md` for complete emotion catalog
- **Characters:** See `04-characters.md` for character trust mechanics
- **Careers:** See `11-careers.md` for Birmingham opportunity system

---

## Design Notes

### Why 3 Unlock Levels?

**25% / 50% / 85% Thresholds:**
- **25%:** Emerging pattern recognition (6-8 choices)
- **50%:** Developing pattern commitment (12-15 choices)
- **85%:** Flourishing pattern mastery (20+ choices)

**Not all patterns use all levels:**
- Building has only Level 3 (visual highlighting sufficient)
- Patience has only Level 3 (timing mechanics don't need layered unlocks)
- Analytical/Exploring/Helping use multiple levels (progressive revelation)

### Emotion Subtext Design

**Observable Behaviors:**
- Physical cues: "hands fidgeting", "arms cross", "shoulders relax"
- Facial expressions: "eyes narrow", "expression softens", "brightness in their eyes"
- Vocal patterns: "voice wavers", "drops to a whisper", "tone sharpens"

**Intentionally subtle:**
- Bracketed format signals non-diagetic observation
- Uses "you notice" framing (player as detective)
- Never heavy-handed or breaking immersion

### Birmingham Localization

**Current Implementation:**
- 15 Birmingham-specific locations
- Real organizations and landmarks
- Authentic emoji icons (🏛️ 🏥 💡 etc.)

**Future Expansion:**
- Could scale to other cities (Memphis, Atlanta, Nashville)
- Template structure allows easy localization
- Dynamic based on player ZIP code or IP geolocation

---

**Generated on:** January 13, 2026
**Verification:** Run `npm run verify-data-dict` to check for drift from source
