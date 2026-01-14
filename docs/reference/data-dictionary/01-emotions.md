# Emotions - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/emotions.ts`
**Status:** Auto-generated

## Overview

The emotion system provides a rich, nuanced vocabulary for character states and dialogue. It supports both primary emotions (single words) and compound emotions (underscore-joined combinations) for maximum expressiveness.

**Key Stats:**
- **Primary emotions:** 503 unique identifiers
- **Emotion categories:** 38 semantic groupings
- **Compound emotion support:** Unlimited combinations (validated dynamically)
- **UI metadata:** 50+ emotions with color/label mappings
- **Nervous system states:** 3 (Polyvagal theory integration)
- **Chemical reactions:** 5 emergent reaction types

---

## Primary Emotions (503 Total)

### Neutral/Base (1)
`neutral`

### Accepting Spectrum (7)
`accepting`, `content`, `satisfied`, `serene`, `peace`, `peaceful`

### Admiration Spectrum (8)
`admiring`, `appreciative`, `awed`, `awe`, `awestruck`, `impressed`, `respectful`, `reverent`

### Affirming Spectrum (4)
`affirming`, `approving`, `encouraging`, `supportive`

### Alert Spectrum (5)
`alert`, `alarmed`, `attentive`, `focused`, `observant`

### Amazed Spectrum (5)
`amazed`, `astonished`, `stunned`, `shocked`, `surprised`

### Analytical Spectrum (4)
`analytical`, `calculating`, `logical`, `strategic`

### Angry Spectrum (5)
`angry`, `annoyed`, `bitter`, `frustrated`, `impatient`

### Anxious Spectrum (7)
`anxious`, `anxiety`, `nervous`, `panicked`, `paranoid`, `tense`, `worried`

### Caring Spectrum (6)
`caring`, `compassionate`, `empathetic`, `gentle`, `tender`, `warm`

### Cautious Spectrum (6)
`cautioning`, `guarded`, `hesitant`, `skeptical`, `suspicious`, `uncertain`

### Challenging Spectrum (6)
`challenging`, `commanding`, `defiant`, `fierce`, `insistent`, `stern`

### Confident Spectrum (6)
`certain`, `confident`, `determined`, `empowered`, `resolute`, `resolved`

### Connected Spectrum (5)
`connected`, `connecting`, `engaged`, `integrated`, `understood`

### Contemplative Spectrum (5)
`contemplative`, `pensive`, `philosophical`, `reflective`, `thoughtful`

### Curious Spectrum (5)
`curious`, `eager`, `intrigued`, `interested`, `wondering`

### Defeated Spectrum (10)
`breaking`, `broken`, `defeated`, `deflated`, `devastated`, `exhausted`, `hollowed`, `hopeless`, `lost`, `shattered`

### Delighted Spectrum (8)
`amused`, `charming`, `delighted`, `excited`, `happy`, `playful`, `teasing`, `triumphant`

### Dismissive Spectrum (6)
`closed`, `cold`, `dismissive`, `distant`, `dry`, `off`

### Emotional Spectrum (4)
`emotional`, `moved`, `touched`, `tearful`

### Energized Spectrum (6)
`animated`, `eager`, `energized`, `ignited`, `passionate`, `zealous`

### Fear Spectrum (6)
`afraid`, `fearful`, `horrified`, `paralyzed`, `scared`, `terrified`

### Grateful Spectrum (4)
`grateful`, `humbled`, `relieved`, `thankful`

### Grief Spectrum (12)
`anguished`, `grief`, `grieving`, `haunted`, `melancholic`, `melancholy`, `mourning`, `nostalgic`, `pained`, `sad`, `wistful`, `wounded`

### Grounded Spectrum (7)
`calm`, `calmer`, `controlled`, `grounded`, `measured`, `patient`, `steady`

### Guilt Spectrum (7)
`ashamed`, `chastened`, `guilt`, `guilty`, `regret`, `regretful`, `shame`

### Honest Spectrum (7)
`confessional`, `earnest`, `frank`, `honest`, `raw`, `sincere`, `vulnerable`

### Hopeful Spectrum (3)
`hopeful`, `optimistic`, `visionary`

### Insight Spectrum (10)
`dawning`, `epiphany`, `illuminated`, `insightful`, `realization`, `realizing`, `recognized`, `recognizing`, `revelation`, `revelatory`

### Inspired Spectrum (5)
`inspired`, `liberated`, `transcendent`, `transformed`, `vindicated`

### Knowing Spectrum (6)
`knowing`, `mature`, `nuanced`, `sage`, `understanding`, `wise`

### Mysterious Spectrum (5)
`atmospheric`, `hypnotic`, `mysterious`, `mystical`, `mystified`

### Negative Spectrum (16)
`closed_off`, `conflicted`, `confused`, `desperate`, `disappointed`, `disillusioned`, `hurt`, `isolated`, `lonely`, `overwhelmed`, `resigned`, `stuck`, `struggling`, `tired`, `troubled`, `weary`

### Open Spectrum (5)
`inviting`, `open`, `receptive`, `trusting`, `welcoming`

### Practical Spectrum (6)
`direct`, `firm`, `matter_of_fact`, `practical`, `pragmatic`, `realistic`

### Pride Spectrum (2)
`proud`, `purposeful`

### Processing Spectrum (3)
`processing`, `searching`, `seeking`

### Ready Spectrum (2)
`prepared`, `ready`

### Serious Spectrum (6)
`grave`, `grim`, `serious`, `solemn`, `somber`, `urgent`

### Teaching Spectrum (5)
`guiding`, `instructive`, `mentoring`, `pedagogical`, `teaching`

### Testing Spectrum (2)
`probing`, `testing`

### Wry Spectrum (3)
`ironic`, `rueful`, `wry`

### Special/Narrative (368 additional)
Includes nuanced compound components and rare narrative emotions:

**Abstract Concepts:** `clarity`, `depth`, `fire`, `spirit`, `wisdom`, `truth`, `acceptance`, `connection`, `joy`, `relief`, `courage`, `honesty`, `pain`, `resolve`, `growth`, `wonder`, `hope`, `love`, `gratitude`, `determination`, `pride`, `fear`, `anger`, `doubt`, `panic`, `dread`

**Interpersonal:** `affection`, `amusement`, `admiration`, `patience`, `solidarity`, `kindred`, `community`, `engagement`, `disagreement`

**States:** `present`, `rooted`, `released`, `opening`, `recovering`, `revealing`, `offered`, `offering`, `scattered`, `distracted`, `shaken`, `enlightened`

**Qualities:** `noble`, `paternal`, `private`, `rare`, `fierce`, `competitive`, `earnest`, `generous`, `friendly`, `gently`, `constructive`, `comprehensive`, `informative`, `technical`, `creative`, `critical`, `self`, `aware`, `high`, `hard`, `deep`, `deeply`, `quiet`, `hollow`, `fragile`, `tender`, `humble`, `sobering`, `existential`

**Descriptions:** `mask`, `monk`, `dots`, `guide`, `space`, `origin`, `story`, `tears`, `stakes`, `intensity`, `nuance`, `excitement`, `insight`, `breakthrough`, `confession`, `awareness`, `recognition`, `wisdom`, `growth`

---

## Compound Emotions (Unlimited)

### How Compound Emotions Work

Compound emotions combine primary emotions with underscores to create nuanced states:

```typescript
// Examples of valid compound emotions:
'vulnerable_grateful'      // Grateful but feeling exposed
'anxious_deflecting'       // Nervous and avoiding the topic
'warm_determined'          // Caring but resolute
'contemplative_sad'        // Thoughtful tinged with sadness
'hopeful_uncertain'        // Optimistic but unsure
'fierce_protective'        // Intensely defensive
```

**Validation Rules:**
- Must contain underscore separator
- All components must be valid primary emotions
- No limit on number of components (e.g., `vulnerable_grateful_hopeful` is valid)
- Components are checked left-to-right

**Category Assignment:**
- Compound emotions inherit the category of the **first component**
- Example: `vulnerable_grateful` → category: `honest` (from `vulnerable`)

---

## Emotion Categories (38 Groups)

### Category Structure

| Category | Primary Emotions | Count |
|----------|------------------|-------|
| **accepting** | accepting, content, satisfied, serene, peaceful | 5 |
| **admiring** | admiring, appreciative, awed, awe, awestruck, impressed, respectful, reverent | 8 |
| **affirming** | affirming, approving, encouraging, supportive | 4 |
| **alert** | alert, alarmed, attentive, focused, observant | 5 |
| **amazed** | amazed, stunned, shocked, surprised | 4 |
| **analytical** | analytical, calculating, strategic | 3 |
| **angry** | angry, annoyed, bitter, frustrated, impatient | 5 |
| **anxious** | anxious, anxiety, nervous, panicked, paranoid, tense, worried | 7 |
| **caring** | caring, gentle, tender, warm | 4 |
| **cautious** | cautioning, guarded, hesitant, skeptical, suspicious, uncertain | 6 |
| **challenging** | challenging, commanding, defiant, fierce, insistent, stern | 6 |
| **confident** | certain, confident, determined, empowered, resolute, resolved | 6 |
| **connected** | connected, connecting, engaged, integrated, understood | 5 |
| **contemplative** | contemplative, pensive, philosophical, reflective, thoughtful | 5 |
| **curious** | curious, eager, intrigued, interested, wondering | 5 |
| **defeated** | broken, defeated, deflated, devastated, exhausted, hollowed, hopeless, shattered | 8 |
| **delighted** | amused, charming, delighted, excited, happy, playful, teasing, triumphant | 8 |
| **dismissive** | cold, dismissive, distant, dry | 4 |
| **emotional** | emotional, moved, touched | 3 |
| **energized** | animated, energized, ignited, passionate, zealous | 5 |
| **fearful** | fearful, horrified, paralyzed, scared, terrified | 5 |
| **grateful** | grateful, humbled, relieved | 3 |
| **grief** | anguished, grief, grieving, haunted, melancholic, melancholy, nostalgic, pained, sad, wistful, wounded | 11 |
| **grounded** | calm, calmer, controlled, grounded, measured, patient | 6 |
| **guilt** | chastened, guilt, guilty, regret, regretful, shame | 6 |
| **honest** | confessional, earnest, honest, raw, sincere, vulnerable | 6 |
| **hopeful** | hopeful, visionary | 2 |
| **insight** | dawning, epiphany, illuminated, insightful, realization, realizing, recognized, recognizing, revelation, revelatory | 10 |
| **inspired** | inspired, liberated, transcendent, transformed, vindicated | 5 |
| **knowing** | knowing, mature, nuanced, sage, understanding, wise | 6 |
| **mysterious** | atmospheric, hypnotic, mysterious, mystical, mystified | 5 |
| **negative** | conflicted, confused, desperate, disappointed, disillusioned, hurt, isolated, overwhelmed, resigned, stuck, struggling, tired, troubled | 13 |
| **open** | inviting, open, receptive, trusting, welcoming | 5 |
| **practical** | direct, firm, practical, pragmatic, realistic | 5 |
| **pride** | proud, purposeful | 2 |
| **serious** | grave, grim, serious, solemn, somber, urgent | 6 |
| **teaching** | guiding, mentoring, pedagogical, teaching | 4 |
| **wry** | rueful, wry | 2 |

---

## UI Metadata (50+ Emotions)

### Color-Coded Display

Emotions with predefined UI styling for visual consistency:

| Emotion | Label | Color Class | Visual Context |
|---------|-------|-------------|----------------|
| **anxious** | Anxious | text-amber-600 | Dark amber (high concern) |
| **worried** | Worried | text-amber-500 | Medium amber |
| **nervous** | Nervous | text-amber-400 | Light amber |
| **uncertain** | Uncertain | text-amber-500 | Medium amber |
| **vulnerable** | Vulnerable | text-pink-500 | Pink (openness) |
| **raw** | Raw | text-pink-600 | Dark pink (intensity) |
| **honest** | Honest | text-pink-400 | Light pink |
| **thoughtful** | Thoughtful | text-blue-500 | Blue (intellect) |
| **reflective** | Reflective | text-blue-400 | Light blue |
| **contemplative** | Contemplative | text-blue-600 | Dark blue |
| **philosophical** | Philosophical | text-indigo-500 | Indigo (depth) |
| **excited** | Excited | text-green-500 | Green (energy) |
| **hopeful** | Hopeful | text-emerald-500 | Emerald (optimism) |
| **grateful** | Grateful | text-emerald-400 | Light emerald |
| **happy** | Happy | text-green-400 | Light green |
| **proud** | Proud | text-emerald-600 | Dark emerald |
| **relieved** | Relieved | text-teal-500 | Teal (calm relief) |
| **curious** | Curious | text-purple-500 | Purple (exploration) |
| **intrigued** | Intrigued | text-purple-400 | Light purple |
| **wondering** | Wondering | text-purple-600 | Dark purple |
| **warm** | Warm | text-rose-400 | Rose (affection) |
| **caring** | Caring | text-rose-500 | Medium rose |
| **tender** | Tender | text-rose-300 | Light rose |
| **gentle** | Gentle | text-rose-400 | Rose |
| **frustrated** | Frustrated | text-red-500 | Red (agitation) |
| **angry** | Angry | text-red-600 | Dark red (intensity) |
| **annoyed** | Annoyed | text-red-400 | Light red |
| **confident** | Confident | text-blue-600 | Dark blue (certainty) |
| **determined** | Determined | text-blue-700 | Deep blue |
| **resolved** | Resolved | text-blue-500 | Blue |
| **defensive** | Defensive | text-orange-500 | Orange (guard) |
| **guarded** | Guarded | text-orange-400 | Light orange |
| **skeptical** | Skeptical | text-orange-600 | Dark orange |
| **serious** | Serious | text-slate-600 | Dark slate |
| **grave** | Grave | text-slate-700 | Deep slate |
| **solemn** | Solemn | text-slate-500 | Medium slate |
| **teaching** | Teaching | text-cyan-500 | Cyan (guidance) |
| **mentoring** | Mentoring | text-cyan-600 | Dark cyan |
| **wise** | Wise | text-cyan-400 | Light cyan |
| **knowing** | Knowing | text-cyan-500 | Cyan |
| **sad** | Sad | text-gray-500 | Gray (sorrow) |
| **haunted** | Haunted | text-gray-600 | Dark gray |
| **grief** | Grief | text-gray-700 | Deep gray |
| **melancholy** | Melancholy | text-gray-400 | Light gray |
| **mystical** | Mystical | text-violet-500 | Violet (otherworldly) |
| **mysterious** | Mysterious | text-violet-600 | Dark violet |
| **atmospheric** | Atmospheric | text-violet-400 | Light violet |
| **passionate** | Passionate | text-red-500 | Red (intensity) |
| **inspired** | Inspired | text-yellow-500 | Yellow (illumination) |
| **moved** | Moved | text-pink-400 | Pink (touched) |

---

## Polyvagal Nervous System States

### The 3 States (Biological Integration)

Based on **Polyvagal Theory** and the "ActualizeMe" Limbic Learning Framework:

| State | Emotion Range | Biological State | Behavior |
|-------|---------------|------------------|----------|
| **ventral_vagal** | Low anxiety, social connection | Parasympathetic: Safe & Social | Calm, engaged, open to learning |
| **sympathetic** | Mobilized, heightened arousal | Sympathetic: Fight/Flight | Alert, anxious, action-oriented |
| **dorsal_vagal** | Shutdown, numbness | Parasympathetic: Freeze/Faint | Overwhelmed, disconnected, hopeless |

### Nervous System Calculation

**Formula:**
```typescript
effectiveAnxiety = normalizedAnxiety - trustBuffer - skillBuffer - flagBuffer

if (effectiveAnxiety > 80) return 'dorsal_vagal'     // Total shutdown
if (effectiveAnxiety > 40) return 'sympathetic'      // Mobilized/Anxious
return 'ventral_vagal'                               // Safe/Social
```

**Buffers:**
- **Trust Buffer:** `trust × 2` (max 20 points at trust=10)
- **Skill Buffer:** Resilience (`×5`, max 50 points) + Analytical (`×2`, max 20 points)
- **Flag Buffer:** Golden Prompt success (`+30 points`)

**Example:**
```typescript
// High anxiety (70), moderate trust (6), moderate resilience (5)
normalizedAnxiety = 70
trustBuffer = 6 × 2 = 12
skillBuffer = 5 × 5 = 25
effectiveAnxiety = 70 - 12 - 25 = 33
// Result: ventral_vagal (Safe & Social)
```

### Neuro-Skill Mapping

**Skills as Emotional Armor:**

| Skill/Pattern | Target State | Power | Effect |
|---------------|--------------|-------|--------|
| **resilience** | ventral_vagal | 0.5 | Strong stabilizer (prevents anxiety escalation) |
| **helping** | ventral_vagal | 0.3 | Social connection stabilizer |
| **analytical** | sympathetic | 0.4 | Transforms anxiety into focus |
| **building** | sympathetic | 0.3 | Channels energy into action |
| **patience** | dorsal_vagal | 0.4 | Prevents overwhelm/shutdown |
| **exploring** | dorsal_vagal | 0.2 | Maintains curiosity against apathy |

**Design Philosophy:**
- Skills don't eliminate emotions—they regulate nervous system response
- High resilience = anxiety doesn't trigger shutdown
- Analytical thinking = anxiety becomes productive focus
- Patience = prevents overwhelm collapse

---

## Chemical Reactions (5 Emergent Types)

### ISP Phase 2: The Chemistry Engine

**"Emergent reactions when Biology meets Skill"**

| Reaction | Conditions | Visual | Description |
|----------|------------|--------|-------------|
| **resonance** | Sympathetic + Empathy | Steam | Vulnerable connection (anxious but trusting) |
| **cold_fusion** | Sympathetic + Analysis | Blue Flame | Hyper-focus (anxiety channeled into logic) |
| **volatility** | Sympathetic + Sympathetic Pattern | Sparks | Explosion (anxiety feeding on itself) |
| **deep_rooting** | Dorsal + Patience | Moss | Stabilized grounding (shutdown prevented) |
| **shutdown** | Dorsal + No Buffer | Grey Void | Complete disconnection (hopeless) |

**Reaction Structure:**
```typescript
interface ChemicalReaction {
  type: 'resonance' | 'cold_fusion' | 'volatility' | 'deep_rooting' | 'shutdown'
  intensity: number // 0-1.0
  description: string
}
```

**Example Reactions:**

**Resonance (Steam):**
- Player at `sympathetic` (anxious) but chooses empathetic response
- Trust increases despite anxiety
- Visualized as rising steam (tension sublimating into connection)

**Cold Fusion (Blue Flame):**
- Player at `sympathetic` (anxious) but chooses analytical approach
- Anxiety becomes productive focus (data analysis, problem-solving)
- Visualized as blue flame (controlled burn)

**Volatility (Sparks):**
- Player at `sympathetic` (anxious) and doubles down on sympathetic choices
- Anxiety escalates (anger, panic, fight response)
- Visualized as sparks (unstable energy)

**Deep Rooting (Moss):**
- Player at `dorsal_vagal` (shutdown) but chooses patient/grounded response
- Prevents complete collapse, begins recovery
- Visualized as moss (slow growth, stabilization)

**Shutdown (Grey Void):**
- Player at `dorsal_vagal` (shutdown) with no regulatory buffers
- Complete disconnection (hopeless, numb, isolated)
- Visualized as grey void (emptiness)

---

## Validation Rules

### TypeScript Validation

```typescript
import {
  isValidEmotion,
  isPrimaryEmotion,
  getValidEmotion,
  getEmotionCategory,
  type EmotionType,
  type PrimaryEmotionType
} from '@/lib/emotions'

// Validate primary emotion
isPrimaryEmotion('grateful')           // true
isPrimaryEmotion('vulnerable_grateful') // false (compound)

// Validate any emotion (primary or compound)
isValidEmotion('grateful')             // true
isValidEmotion('vulnerable_grateful')  // true (both parts valid)
isValidEmotion('invalid_emotion')      // false

// Get valid emotion with fallback
getValidEmotion('hopeful')             // 'hopeful'
getValidEmotion('invalid')             // 'neutral' (fallback)
getValidEmotion(undefined)             // 'neutral' (fallback)

// Get category
getEmotionCategory('vulnerable')       // 'honest'
getEmotionCategory('vulnerable_grateful') // 'honest' (first component)
getEmotionCategory('grateful')         // 'grateful'
```

### Usage in Dialogue

```typescript
import { type EmotionType } from '@/lib/emotions'

interface DialogueContent {
  text: string
  emotion: EmotionType
  richEffectContext?: 'warning' | 'info' | 'success'
}

// Valid emotion types
const content: DialogueContent = {
  text: "I'm so grateful you're here.",
  emotion: 'vulnerable_grateful'  // Compound emotion
}

// Category-based styling
const category = getEmotionCategory(content.emotion) // 'honest'
const colorClass = EMOTION_METADATA[category]?.color || 'text-slate-400'
```

---

## Usage Examples

### Displaying Emotion Tags

```typescript
import { getEmotionCategory, EMOTION_METADATA } from '@/lib/emotions'

function EmotionTag({ emotion }: { emotion: string }) {
  const category = getEmotionCategory(emotion)
  const metadata = EMOTION_METADATA[category]

  return (
    <span className={cn('text-xs font-medium', metadata?.color)}>
      [{emotion}]
    </span>
  )
}

// Usage
<EmotionTag emotion="vulnerable_grateful" />
// Renders: [vulnerable_grateful] in pink (honest category)
```

### Nervous System State Calculation

```typescript
import { determineNervousSystemState } from '@/lib/emotions'

const gameState = {
  anxiety: 65,
  trust: 7,
  skills: { resilience: 6, analytical: 4 },
  flags: new Set(['golden_prompt_voice'])
}

const state = determineNervousSystemState(
  gameState.anxiety,
  gameState.trust,
  gameState.skills,
  gameState.flags
)

// Result: 'ventral_vagal'
// Calculation:
// - normalizedAnxiety: 65
// - trustBuffer: 7 × 2 = 14
// - skillBuffer: (6 × 5) + (4 × 2) = 38
// - flagBuffer: 30
// - effectiveAnxiety: 65 - 14 - 38 - 30 = -17 (capped at 0)
// - State: ventral_vagal (Safe & Social)
```

### Emotion-Based Conditional Logic

```typescript
import { getEmotionCategory } from '@/lib/emotions'

function getDialogueStyle(emotion: string) {
  const category = getEmotionCategory(emotion)

  switch (category) {
    case 'anxious':
    case 'fearful':
      return { animation: 'trembling', speed: 'fast' }

    case 'honest':
    case 'vulnerable':
      return { animation: 'soft-glow', speed: 'slow' }

    case 'confident':
    case 'determined':
      return { animation: 'bold-pulse', speed: 'medium' }

    case 'grief':
    case 'defeated':
      return { animation: 'fade', speed: 'very-slow' }

    default:
      return { animation: 'none', speed: 'medium' }
  }
}
```

---

## Cross-References

- **Patterns:** See `03-patterns.md` for pattern-to-emotion mappings
- **Skills:** See `02-skills.md` for skill-to-emotion regulation (resilience, empathy)
- **UI Metadata:** See `10-ui-metadata.md` for emotion subtext hints (52 emotions)
- **Characters:** See `04-characters.md` for character-emotion associations
- **Dialogue System:** See `05-dialogue-system.md` for emotion usage in nodes

---

## Design Notes

### Philosophy: Compound Emotions as Emergent Complexity

**Why Not Pre-Define All Combinations?**

Traditional approach:
```typescript
// ❌ Brittle, limited, requires authorship for every combo
const EMOTIONS = [
  'vulnerable_grateful',
  'vulnerable_hopeful',
  'vulnerable_anxious',
  // ... 595² = 354,025 possible combinations!
]
```

Lux Story approach:
```typescript
// ✅ Dynamic, unlimited, validates components
isValidEmotion('vulnerable_grateful_hopeful_uncertain')
// → true (all 4 parts are valid primary emotions)
```

**Benefits:**
- **Unlimited expressiveness:** Writers can create any nuanced state
- **Zero maintenance:** New primary emotions automatically support compounds
- **Natural language:** Underscores read like "and" (`vulnerable_grateful` = "vulnerable AND grateful")
- **Sustainable:** 503 primary emotions support 126,000+ 2-part combos without explicit definitions

**Trade-off:**
- Validation is component-based (doesn't prevent nonsensical combos like `happy_devastated`)
- Trust content creators to use combinations meaningfully
- Category assignment favors first component (could miss nuance)

### Polyvagal Integration: Skills as Biological Regulators

**Traditional Games:**
```
High anxiety → Bad dialogue options → Lower trust
```

**Lux Story:**
```
High anxiety + High resilience → Nervous system regulated → Still anxious but functional
High anxiety + No skills → Sympathetic/Dorsal → Fight/flight or shutdown
```

**Why This Matters:**

1. **Authenticity:** Real stress doesn't disappear—it's managed
2. **Player Agency:** Skills have biological consequences, not just stat changes
3. **Replayability:** Different skill builds = different nervous system experiences
4. **Educational Value:** Players learn emotional regulation through gameplay

**The "Golden Prompt" Effect:**

Completing high-stakes simulations (e.g., perfect AI prompt) acts as a **permanent nervous system stabilizer** (+30 point buffer). This models real-world experience where mastery reduces anxiety.

### Chemical Reactions: Visual Emotional Feedback

**Design Goal:** Make invisible biology visible

**Reaction Triggers:**
- Real-time during dialogue
- Based on nervous system state + player choice
- Visualized with particle effects (steam, flames, sparks, moss, void)

**Example Scenario:**

```
Maya (NPC): "I'm scared I'm not good enough." [anxious]
Player at sympathetic state (65 anxiety, 6 trust)

Choice A: "Let's break down your fears logically." [analytical]
→ Triggers: cold_fusion (Blue Flame)
→ Effect: Anxiety channeled into problem-solving

Choice B: "I feel that way too sometimes." [empathetic]
→ Triggers: resonance (Steam)
→ Effect: Vulnerable connection, trust increases

Choice C: "You're overthinking this." [dismissive]
→ Triggers: volatility (Sparks)
→ Effect: Anxiety escalates, trust decreases
```

**Future Expansion:**
- Steam color varies by trust level (white → gold)
- Reaction intensity scales with skill levels
- Combo reactions (e.g., `resonance` → `deep_rooting` transition)

### Emotion Metadata: Balancing Breadth vs. UI Coverage

**Current State:**
- 503 primary emotions defined
- Only 50+ have UI metadata (colors, labels)
- Rest use category-based fallbacks

**Why Not 100% Coverage?**

1. **Rare emotions:** `monk`, `dots`, `origin` used <5 times total
2. **Abstract concepts:** `space`, `fire`, `clarity` don't need visual styling
3. **Maintenance burden:** Every new emotion requires UI decisions
4. **Fallback gracefully:** Category system provides reasonable defaults

**Coverage Prioritization:**
- High-frequency emotions (used 50+ times): Full metadata
- Medium-frequency (10-50 times): Category-based styling
- Low-frequency (<10 times): Neutral fallback

**Quality over Quantity:** 50 well-designed emotion colors > 500 arbitrary assignments

### Future Considerations

**Emotion Analytics:**
- Track which emotions appear most in player's story
- "Your journey was primarily: thoughtful, vulnerable, determined"
- Emotional arc visualization (anxiety over time)

**Dynamic Emotion Intensity:**
```typescript
type IntenseEmotion = `${EmotionType}_intense`
// Example: 'anxious_intense', 'hopeful_intense'
// Could modify UI (larger text, brighter colors)
```

**Emotion-to-Career Mapping:**
- Analytical emotions → Technology career affinity
- Caring emotions → Healthcare career affinity
- Pattern-based emotional profile informs career insights

**Accessibility:**
- Emotion icons in addition to colors (for colorblind players)
- Text-to-speech emphasis based on emotion intensity
- Simplified emotion mode (collapse to 10 core emotions)

**Localization:**
- Emotion labels translate, but IDs remain English
- Cultural emotion mapping (some cultures prioritize different emotional granularity)

---

## Statistics

### Emotion Distribution (Top 20 Most Common)

| Emotion | Occurrences | Category | Common In |
|---------|-------------|----------|-----------|
| hopeful | 150+ | hopeful | Maya, Jordan, Tess |
| anxious | 120+ | anxious | Marcus, Maya, Rohan |
| thoughtful | 110+ | contemplative | Devon, Elena, Samuel |
| warm | 95+ | caring | Grace, Tess, Samuel |
| vulnerable | 85+ | honest | All vulnerability arcs |
| determined | 80+ | confident | Kai, Nadia, Marcus |
| grateful | 75+ | grateful | Trust ≥6 nodes |
| curious | 70+ | curious | Yaquin, Lira, Zara |
| serious | 65+ | serious | Silas, Alex, Isaiah |
| conflicted | 60+ | negative | Choice consequences |
| excited | 55+ | delighted | Quinn, Dante, Yaquin |
| guarded | 50+ | cautious | Early trust nodes |
| reflective | 48+ | contemplative | Samuel, Devon, Rohan |
| proud | 45+ | pride | Post-simulation success |
| nervous | 42+ | anxious | Simulation introductions |
| mysterious | 40+ | mysterious | Samuel early nodes |
| inspired | 38+ | inspired | Pattern unlocks |
| wistful | 35+ | grief | Elena, Asha, Samuel |
| practical | 32+ | practical | Alex, Silas, Jordan |
| passionate | 30+ | energized | Dante, Lira, Zara |

### Compound Emotion Usage

| Compound Pattern | Occurrences | Typical Context |
|------------------|-------------|-----------------|
| vulnerable_grateful | 28 | Vulnerability arcs (Trust ≥6) |
| warm_determined | 22 | Supportive but firm guidance |
| anxious_deflecting | 18 | Defensive responses |
| contemplative_sad | 15 | Reflective grief moments |
| hopeful_uncertain | 14 | Optimistic but cautious |
| fierce_protective | 12 | Defending values/people |
| vulnerable_hopeful | 10 | Opening up with optimism |
| thoughtful_concerned | 9 | Mentorship warnings |
| curious_skeptical | 8 | Questioning assumptions |
| proud_humble | 7 | Acknowledging growth |

**Total Compound Emotions Used:** 180+ unique combinations

---

**Generated on:** January 13, 2026
**Verification:** Run `npm run verify-data-dict` to check for drift from source
