# Patterns - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/patterns.ts`
**Status:** Auto-generated

## Overview

The pattern system tracks 5 behavioral decision-making approaches discovered through player choices. Patterns are not selected by players; they emerge naturally through gameplay and reveal how players approach problems and relationships.

**Key Stats:**
- Total patterns: 5
- Validation: `isValidPattern()`
- Thresholds: EMERGING (3), DEVELOPING (6), FLOURISHING (9)
- Color blind modes: 5 (default + 4 accessibility variants)
- Atmospheric feedback: 4 sensation texts per pattern

## Complete Reference

### Pattern Metadata

| Pattern | Full Label | Short Label | Color | Tailwind BG | Skills Mapped |
|---------|-----------|-------------|-------|-------------|---------------|
| analytical | The Weaver | Weaver | #3B82F6 | bg-blue-500 | 4 |
| patience | The Anchor | Anchor | #10B981 | bg-green-500 | 4 |
| exploring | The Voyager | Voyager | #8B5CF6 | bg-purple-500 | 4 |
| helping | The Harmonic | Harmonic | #EC4899 | bg-pink-500 | 4 |
| building | The Architect | Architect | #F59E0B | bg-amber-500 | 5 |

### Pattern Descriptions

#### Analytical (The Weaver)
**Description:** You see the hidden threads where others see only chaos. Logic is not a tool for you; it is the air you breathe. You dismantle complexity with the precision of a watchmaker, and in doing so, reveal the truth beneath.

**Context:** Traced the hidden connections to find a logical path forward

**Skills:** criticalThinking, problemSolving, digitalLiteracy, dataDemocratization

---

#### Patience (The Anchor)
**Description:** Time moves differently for you. Where others rush, you wait. Not because you are slow, but because you understand that haste is the enemy of mastery. You do not react. You respond, when the moment is right.

**Context:** Took the time to breathe, consider, and respond with care

**Skills:** timeManagement, adaptability, emotionalIntelligence, groundedResearch

---

#### Exploring (The Voyager)
**Description:** Curiosity is your compass. You are allergic to the status quo, drawn to the uncharted territory where others fear to tread. The unknown does not intimidate you—it beckons.

**Context:** Leaned into curiosity and followed the thread of exploration

**Skills:** adaptability, creativity, criticalThinking, multimodalCreation

---

#### Helping (The Harmonic)
**Description:** You are tuned to a frequency others cannot hear. When someone stumbles, you feel the tremor. Connection is not optional for you—it is instinctual. You do not help because you should. You help because you cannot do otherwise.

**Context:** Chose to reach out, connect, and make space for someone else

**Skills:** emotionalIntelligence, collaboration, communication, aiLiteracy

---

#### Building (The Architect)
**Description:** Destruction is easy. Creation is immortal. You are driven by the need to leave the world better than you found it. Ideas are nice; implementation is everything. You do not just dream—you build.

**Context:** Took concrete action to create, construct, or solve in the real world

**Skills:** creativity, problemSolving, leadership, agenticCoding, workflowOrchestration

---

### Pattern-to-Skill Mapping

| Pattern | Skills |
|---------|--------|
| analytical | criticalThinking, problemSolving, digitalLiteracy, dataDemocratization |
| patience | timeManagement, adaptability, emotionalIntelligence, groundedResearch |
| exploring | adaptability, creativity, criticalThinking, multimodalCreation |
| helping | emotionalIntelligence, collaboration, communication, aiLiteracy |
| building | creativity, problemSolving, leadership, agenticCoding, workflowOrchestration |

---

## Pattern Thresholds

| Threshold | Value | Meaning |
|-----------|-------|---------|
| EMERGING | 3 | Pattern begins to show in player choices |
| DEVELOPING | 6 | Pattern is clearly established |
| FLOURISHING | 9 | Pattern is dominant in player behavior |

---

## Accessibility: Color Blind Palettes

### Default

| Pattern | Hex Color |
|---------|-----------|
| analytical | #3B82F6 |
| patience | #10B981 |
| exploring | #8B5CF6 |
| helping | #EC4899 |
| building | #F59E0B |

### Protanopia (Red-blind)

| Pattern | Hex Color |
|---------|-----------|
| analytical | #0077BB |
| patience | #33BBEE |
| exploring | #EE7733 |
| helping | #CC3311 |
| building | #EE3377 |

### Deuteranopia (Green-blind)

| Pattern | Hex Color |
|---------|-----------|
| analytical | #0077BB |
| patience | #009988 |
| exploring | #EE7733 |
| helping | #CC3311 |
| building | #EE3377 |

### Tritanopia (Blue-blind)

| Pattern | Hex Color |
|---------|-----------|
| analytical | #0088CC |
| patience | #44AA99 |
| exploring | #DD5511 |
| helping | #CC6677 |
| building | #DDCC77 |

### High Contrast

| Pattern | Hex Color |
|---------|-----------|
| analytical | #0000FF |
| patience | #00FF00 |
| exploring | #8800FF |
| helping | #FF0088 |
| building | #FFAA00 |

**Mode Labels:**
- `default`: Standard color palette
- `protanopia`: Optimized for red-green color blindness (red-blind type)
- `deuteranopia`: Optimized for red-green color blindness (green-blind type)
- `tritanopia`: Optimized for blue-yellow color blindness
- `highContrast`: Maximum contrast for low vision accessibility

---

## Pattern Sensations

Subtle atmospheric feedback when player leans into a pattern. These are non-informational and create a sense that "the station notices you."

### Analytical
- "You pause to consider the angles."
- "Something clicks into place."
- "The pattern emerges."
- "Your mind traces the connections."

### Patience
- "You let the moment breathe."
- "There's no rush. You know that now."
- "Silence has its own answers."
- "You wait. The station waits with you."

### Exploring
- "Curiosity pulls at you."
- "There's more here. You feel it."
- "Questions beget questions."
- "The unknown beckons."

### Helping
- "Something in you reaches out."
- "Connection matters. You know this."
- "Their story becomes part of yours."
- "You lean in, listening."

### Building
- "Your hands itch to make it real."
- "The shape of it forms in your mind."
- "Creation stirs."
- "You see what could be."

---

## Validation Rules

### Type Checking

```typescript
import { isValidPattern, PatternType } from '@/lib/patterns'

// Valid patterns
isValidPattern('analytical')  // true
isValidPattern('patience')    // true
isValidPattern('building')    // true

// Invalid patterns
isValidPattern('invalid')     // false
isValidPattern('creative')    // false (not a pattern type)
```

### Pattern Skills

```typescript
import { getPatternSkills } from '@/lib/patterns'

const skills = getPatternSkills('analytical')
// Returns: ['criticalThinking', 'problemSolving', 'digitalLiteracy', 'dataDemocratization']
```

### Color Blind Support

```typescript
import { getPatternColor, getPatternColorPalette } from '@/lib/patterns'

// Get single pattern color for specific mode
const color = getPatternColor('analytical', 'protanopia')
// Returns: '#0077BB'

// Get full palette for a mode
const palette = getPatternColorPalette('deuteranopia')
// Returns: Record<PatternType, string> with all 5 pattern colors
```

### Random Sensation

```typescript
import { getPatternSensation } from '@/lib/patterns'

const sensation = getPatternSensation('patience')
// Returns: One of 4 atmospheric texts randomly (e.g., "You let the moment breathe.")
```

---

## Usage Examples

### Displaying Pattern in UI

```typescript
import { PATTERN_METADATA } from '@/lib/patterns'

function PatternBadge({ pattern }: { pattern: PatternType }) {
  const { label, color, tailwindBg } = PATTERN_METADATA[pattern]

  return (
    <div className={`${tailwindBg} px-3 py-1 rounded-full`}>
      <span className="text-white font-medium">{label}</span>
    </div>
  )
}
```

### Tracking Pattern Progress

```typescript
import { PATTERN_THRESHOLDS } from '@/lib/patterns'

function getPatternStatus(count: number) {
  if (count >= PATTERN_THRESHOLDS.FLOURISHING) return 'Flourishing'
  if (count >= PATTERN_THRESHOLDS.DEVELOPING) return 'Developing'
  if (count >= PATTERN_THRESHOLDS.EMERGING) return 'Emerging'
  return 'Dormant'
}

const status = getPatternStatus(7)  // Returns: 'Developing'
```

### Color Blind Mode Selector

```typescript
import { COLOR_BLIND_MODE_LABELS, COLOR_BLIND_MODE_DESCRIPTIONS } from '@/lib/patterns'

function AccessibilitySettings() {
  return (
    <select>
      {Object.entries(COLOR_BLIND_MODE_LABELS).map(([mode, label]) => (
        <option key={mode} value={mode} title={COLOR_BLIND_MODE_DESCRIPTIONS[mode]}>
          {label}
        </option>
      ))}
    </select>
  )
}
```

---

## Cross-References

- **Skills:** See `02-skills.md` for detailed skill definitions mapped to patterns
- **UI Effects:** See `10-ui-metadata.md` for pattern visualization components
- **Dialogue System:** See `05-dialogue-system.md` for pattern-gated dialogue nodes

---

## Design Notes

### Philosophy

**Discovered, Not Selected:**
- Players never choose patterns directly
- Patterns emerge organically through dialogue choices
- No "right" pattern—all are equally valid approaches to life

**No Hierarchy:**
- Patterns are descriptive, not prescriptive
- All patterns unlock unique content and relationships
- Players naturally gravitate toward 1-2 dominant patterns

### Accessibility First

**Color Blind Support:**
- All 5 color blind modes scientifically optimized
- Never rely solely on color for pattern identification
- Labels and icons always accompany color coding

**Pattern Sensations:**
- Atmospheric feedback respects `prefers-reduced-motion`
- Text-based, not reliant on visual effects
- Subtle reinforcement, not intrusive notifications

### Balance Considerations

**Skill Distribution:**
- analytical: 4 skills (logic-focused)
- patience: 4 skills (time-focused)
- exploring: 4 skills (curiosity-focused)
- helping: 4 skills (empathy-focused)
- building: 5 skills (action-focused, slightly broader)

**Why building has 5 skills:** Reflects the breadth of creation—requires both vision (creativity, leadership) and execution (problemSolving, agenticCoding, workflowOrchestration).

### Future Considerations

**Pattern Unlocks:**
- Currently 17/20 characters have pattern-gated content
- Pattern reflections: 113 total variations in NPC dialogue
- Potential for pattern-specific endings or achievements

**Threshold Tuning:**
- Current thresholds (3/6/9) designed for 30-60 minute sessions
- May need adjustment based on player completion data
- FLOURISHING (9) represents strong pattern identity

---

**Generated on:** January 13, 2026
**Verification:** Run `npm run verify-data-dict` to check for drift from source
