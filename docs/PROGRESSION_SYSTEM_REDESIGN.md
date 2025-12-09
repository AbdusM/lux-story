# Progression System Redesign: Filling Orbs Model

## Core Concept: 5 Orbs That Fill Up

**Not collecting orbs. FILLING them.**

Each of the 5 patterns IS an orb that fills with experience:

```
       ◐              ◔              ●              ◑              ◔
   ANALYTICAL     PATIENCE      EXPLORING       HELPING       BUILDING
     45/100        23/100        100/100         67/100         12/100
    Emerging       Nascent       Mastered      Developing       Nascent
```

### Visual Language
- ○ Empty (0%)
- ◔ Quarter (1-25%)
- ◑ Half (26-50%)
- ◐ Three-quarters (51-75%)
- ● Full (76-100%)

### How It Works
1. **Make a choice** → That pattern's orb fills slightly (+1-3%)
2. **Hit thresholds** → Unlock abilities within that orb
3. **Fill completely** → Master that pattern, unlock final ability

This matches:
- **Genshin constellations** (fill nodes)
- **Persona social stats** (Knowledge, Charm fill up)
- **Diablo paragon** (fill bars per category)

---

## Current System vs Best-in-Class

### What We Have Now

| Aspect | Current State | Problem |
|--------|--------------|---------|
| **Mental model** | "Collect orbs" | Wrong metaphor - should be "grow skills" |
| **Visualization** | Numbers go up | No visual orb filling |
| **Rewards** | Samuel dialogue | Nothing concrete unlocks |
| **Progression feel** | Silent accumulation | No horizon mechanic |

### Critical Gap: Orbs Don't Unlock Anything

In every compelling progression system:
- **Diablo**: Fill renown bars → unlock skill points
- **Disco Elysium**: Internalize thoughts → unlock dialogue
- **Persona**: Fill confidant hearts → unlock abilities
- **Genshin**: Fill constellation → unlock power

**Our orbs**: Just numbers. No filling visualization. Nothing unlocks.

---

## Proposed Redesign: The Insight System

### Core Philosophy
Orbs represent **self-knowledge earned through choices**. This knowledge should unlock:
1. **Deeper dialogue options** (like Disco Elysium thoughts)
2. **Enhanced character interactions** (like Persona confidants)
3. **Visual unlocks** (like Hades keepsakes display)

### 1. Pattern Unlocks (Concrete Rewards)

Each pattern type, when reaching thresholds, unlocks specific capabilities:

```
ANALYTICAL (5 orbs) → Unlock "Read Between Lines"
  - See subtext hints in character dialogue
  - Example: "Devon seems to be avoiding something..."

PATIENCE (5 orbs) → Unlock "Take Your Time"
  - Access to "Wait and observe" choices that reveal hidden info

EXPLORING (5 orbs) → Unlock "Curiosity Rewarded"
  - Discover optional lore and worldbuilding details

HELPING (5 orbs) → Unlock "Empathy Sense"
  - See emotional state indicators on characters

BUILDING (5 orbs) → Unlock "See the Structure"
  - Access to choices that reference earlier decisions
```

**Higher tiers unlock more:**
```
10 orbs → Tier 2 ability
20 orbs → Tier 3 ability
35 orbs → Tier 4 ability
50 orbs → Mastery ability (unique per pattern)
```

### 2. Cross-Pattern Unlocks

When you have orbs in MULTIPLE patterns:

```
Any 3 patterns at 5+ → "Versatile"
  - Unlock hybrid dialogue options

Any 2 patterns at 15+ → "Focused Duality"
  - Deeper exploration of your two strongest approaches

All 5 at 10+ → "Well-Rounded"
  - Access to special Samuel conversations
```

### 3. Relationship-Gated Unlocks (like Persona)

Trust milestones with characters unlock:

```
Trust 3+ with any character → Character backstory unlocks
Trust 5+ → Special dialogue branch
Trust 8+ → Character's "key scene"
Trust 10 (max) → Ending variant with that character
```

### 4. Visualization Redesign

**Current Journal is passive. New Journal should feel like a collection.**

```
JOURNAL TABS:
├── Insights (current - patterns/stats)
├── Abilities (NEW - unlocked pattern abilities)
├── Codex (NEW - unlocked lore entries)
└── Bonds (current - but with unlock progress)
```

**Abilities Tab:**
```
┌─────────────────────────────────────────┐
│ ANALYTICAL                         5/50 │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                         │
│ ✓ Read Between Lines (5)               │
│ ○ Pattern Recognition (10)     LOCKED   │
│ ○ Deep Analysis (20)          LOCKED    │
│ ○ Strategic Insight (35)      LOCKED    │
│ ○ Analytical Mastery (50)     LOCKED    │
└─────────────────────────────────────────┘
```

This creates:
- **Clear goals** (like Diablo renown tiers)
- **Visible progress** (like Hades mirror)
- **Horizon mechanic** ("just 5 more to unlock X")

### 5. UI/UX Implications

**During Gameplay (unchanged - keep silent):**
- Orbs still earned silently
- No toasts or interruptions
- FoxTheatreGlow still indicates new content

**In Journal (enhanced):**
- Show unlock progress for each pattern
- Display locked abilities with requirements
- "Just X more" indicators

**In Dialogue (new):**
- Unlocked abilities appear as new choice options
- Marked subtly (e.g., small icon indicating source)
- Example: [ANALYTICAL] "I notice you're holding back..."

### 6. Implementation Priority

**Phase 1: Foundation**
- Add `PatternUnlocks` type to lib/orbs.ts
- Create unlock checking logic
- Add Abilities tab to Journal

**Phase 2: Dialogue Integration**
- Tag certain dialogue choices with unlock requirements
- Add unlock-gated choices to YAML content
- Create visual indicators for unlocked options

**Phase 3: Polish**
- Progress bars and animations
- Unlock celebration moments (subtle)
- Samuel acknowledges new abilities

---

## Why This Works (Applying Best Practices)

| Principle | Our Implementation |
|-----------|-------------------|
| **Multiple progressions** | 5 pattern tracks + cross-pattern + relationships |
| **Concrete rewards** | Dialogue options unlock (not just acknowledgment) |
| **Clear visualization** | Ability unlock screen with progress bars |
| **Horizon mechanic** | "5 more analytical orbs to unlock X" |
| **Front-loaded value** | First unlock at just 5 orbs |
| **Narrative-mechanical fusion** | Unlocks ARE dialogue options |
| **Failure resilient** | Can't lose orbs, always progressing |

---

## Comparison: Before vs After

**Before:**
> Player makes choice → earns orb silently → opens Journal → sees number went up → Samuel says something nice → ???

**After:**
> Player makes choice → earns orb silently → opens Journal → sees "2 more analytical to unlock Read Between Lines" → makes more analytical choices → unlocks ability → next conversation has new [ANALYTICAL] dialogue option → player feels their choices matter mechanically

The key shift: **Orbs become a currency that buys narrative access**, not just a score.

---

---

## UI/UX Design Patterns from Best-in-Class Games

### Hades - Mirror of Night UI
**Source:** [TheGamer](https://www.thegamer.com/hades-mirror-of-night-roguelite-progression/), [Hades Wiki](https://hades.fandom.com/wiki/Mirror_of_Night)

| Pattern | Implementation |
|---------|----------------|
| **Color coding** | Red = standard upgrades, Green = alternative versions |
| **Linear layout** | Sequential list, not overwhelming tree |
| **Locked states** | Keys required to unlock later abilities |
| **Dual options** | Each upgrade has two mutually exclusive variants |
| **Low-cost respec** | Encourages experimentation |

**Key insight:** Linear progression prevents early decision paralysis. Players go down the list, buying what they can afford.

### Disco Elysium - Thought Cabinet UI
**Source:** [Disco Elysium Wiki](https://discoelysium.fandom.com/wiki/Thought_Cabinet), [80.lv](https://80.lv/articles/disco-elysium-working-on-ui-design)

| Pattern | Implementation |
|---------|----------------|
| **Physical metaphor** | Literal "cabinet" with slots |
| **Research phase** | Thoughts shown face-down during cooking |
| **Slot limitations** | 3 slots initially, skill points to unlock more |
| **Art integration** | Each thought has unique illustrated icon |
| **Information reveal** | Progressive disclosure as thoughts internalize |

**Key insight:** The cabinet metaphor makes abstract progression feel tangible. Slots = scarcity = meaningful choices.

### Persona 5 - Confidant UI
**Source:** [Jiaxin Wen](https://jiaxinwen.wordpress.com/2017/04/27/the-ui-design-of-persona-5/)

| Pattern | Implementation |
|---------|----------------|
| **Color theme** | High contrast black + red primary, secondary colors for differentiation |
| **Card metaphor** | Each confidant = tarot card visual |
| **10-level progress** | Clear numbered ranks with point thresholds |
| **Story summaries** | Brief recap of each character's arc |
| **Ability unlocks** | Each rank shows what ability unlocked |

**Key insight:** Menus are narrative-integrated, not separate. The aesthetic reinforces the game's themes.

### Genshin Impact - Constellation UI
**Source:** [Game UI Database](https://www.gameuidatabase.com/gameData.php?id=470), [Genshin Wiki](https://genshin-impact.fandom.com/wiki/Constellation)

| Pattern | Implementation |
|---------|----------------|
| **Circular layout** | 6 constellation nodes in a circle |
| **Star visualization** | Unlocked = lit star, locked = dim |
| **Single-screen overview** | All 6 levels visible at once |
| **Lock indicator** | Shows material needed to unlock |
| **Mobile-first** | Touch-friendly, tap to select |

**Key insight:** Circular layouts feel complete even when partially filled. Shows the whole journey at a glance.

---

## Our UI Design Principles (Derived)

### 1. **Single Main Color + Pattern Colors**
- Main UI: Amber/gold (warmth, insight)
- Each pattern has its own accent color (already established)
- Locked states: Desaturated/grayed versions

### 2. **Linear List, Not Tree**
Like Hades, avoid overwhelming skill trees. Simple vertical list:
```
Pattern Name           Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYTICAL             ████░░░░ 5/20
  ✓ Read Between Lines
  ○ Pattern Recognition (10)
  ○ Deep Analysis (20)
```

### 3. **Physical Metaphor: The Insight Journal**
Like Disco Elysium's cabinet, our Journal IS the collection space.
- Tabs = different "sections" of self-knowledge
- Each unlock = a "page" added to the journal

### 4. **Progressive Disclosure**
- Don't show all 25 possible unlocks immediately
- Show current tier + next tier only
- Locked content shows name but not description

### 5. **Mobile-First Layout**
- Touch targets: 44px minimum (Apple HIG)
- Single-column scrolling
- No hover states required
- Swipe gestures for navigation

### 6. **Icon States**
```
✓ Unlocked  = Full color, checkmark
○ Locked    = Outline only, grayed
● Current   = Pulsing/glowing indicator
```

---

## Revised Journal UI Mockup: Orb-Filling Model

### Overview Screen (5 Orbs at a Glance)
```
┌─────────────────────────────────────────────────┐
│  YOUR PATTERN ORBS                      [X]     │
├─────────────────────────────────────────────────┤
│                                                 │
│        ◐              ◔              ●          │
│    ANALYTICAL     PATIENCE      EXPLORING       │
│      45%           23%           100%           │
│    Emerging       Nascent       Mastered        │
│                                                 │
│        ◑              ◔                         │
│     HELPING       BUILDING                      │
│       67%           12%                         │
│    Developing      Nascent                      │
│                                                 │
│     Tap an orb to see unlocked abilities        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Detail View (Single Orb Expanded)
```
┌─────────────────────────────────────────────────┐
│  ← Back                                         │
├─────────────────────────────────────────────────┤
│                                                 │
│                     ◐                           │
│                ANALYTICAL                       │
│                  45/100                         │
│                                                 │
│   ████████████████████░░░░░░░░░░░░░░░░░░░░░░   │
│                                                 │
│   "You notice what others miss."                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   ✓ Read Between Lines              (25)       │
│     See subtext hints in dialogue               │
│                                                 │
│   ○ Pattern Recognition             (50)       │
│     ▓▓▓▓▓▓▓▓▓░░░░░░░  5 more                   │
│                                                 │
│   ○ Strategic Insight               (85)       │
│     ░░░░░░░░░░░░░░░░░  locked                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Key Visual Elements:

1. **Orb symbols** (○◔◑◐●) show fill state at a glance
2. **5-orb overview** - see all patterns without scrolling
3. **Tap to expand** - detail view shows abilities
4. **Progress to next** - "5 more" creates horizon
5. **Tier labels** - Nascent/Emerging/Developing/Flourishing/Mastered
6. **Pattern tagline** - flavor text for each orb

---

## Questions to Resolve

1. **How many abilities per pattern?** (Suggested: 5 tiers at 5/10/20/35/50)
2. **Should unlocks be permanent or per-playthrough?** (Suggested: permanent)
3. **How visually prominent should unlock indicators be in dialogue?** (Suggested: small icon badge)
4. **Do we want "equipment" mechanics (choose which ability is active)?** (Suggested: no, keep simple)
5. **Collapse patterns by default on mobile?** (Suggested: yes, show only progress bars)

---

## Sources

- [Hades Mirror of Night - TheGamer](https://www.thegamer.com/hades-mirror-of-night-roguelite-progression/)
- [Hades Wiki - Mirror of Night](https://hades.fandom.com/wiki/Mirror_of_Night)
- [Disco Elysium Thought Cabinet](https://discoelysium.fandom.com/wiki/Thought_Cabinet)
- [Persona 5 UI Design - Jiaxin Wen](https://jiaxinwen.wordpress.com/2017/04/27/the-ui-design-of-persona-5/)
- [Game UI Database](https://www.gameuidatabase.com/)
- [GDKeys - Meaningful Skill Trees](https://gdkeys.com/keys-to-meaningful-skill-trees/)
