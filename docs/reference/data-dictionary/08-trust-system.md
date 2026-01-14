# Trust System - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/constants.ts`, `/lib/trust-derivatives.ts`
**Status:** Manual documentation with code examples

## Overview

The trust system is a sophisticated relationship mechanic that goes far beyond a simple 0-10 scale. Trust influences dialogue access, memory vividness, voice intensity, and even propagates through social networks. The system includes 7 derivative mechanics that create emergent gameplay depth.

**Key Stats:**
- **Trust range:** 0-10 (11 discrete levels)
- **Trust labels:** 6 relationship tiers (Stranger → Bonded)
- **Voice tones:** 4 intensity levels (Whisper → Command)
- **Echo intensities:** 5 memory vividness levels
- **Info tiers:** 5 information value categories
- **Derivative systems:** 7 advanced mechanics
- **Character relationships:** 16 defined connections for trust inheritance

---

## Core Trust System

### Trust Scale (0-10)

| Trust Level | Label | Description | Access Unlocked |
|-------------|-------|-------------|-----------------|
| **0-1** | Stranger | Just met, no connection | Introduction nodes only |
| **2-3** | Acquaintance | Basic familiarity | Standard dialogue |
| **4-5** | Friendly | Building rapport | Pattern reflections |
| **6-7** | Trusted | Deep connection | **Vulnerability arcs** (Trust ≥6) |
| **8-9** | Close | Strong bond | **Loyalty experiences** (Trust ≥8) |
| **10** | Bonded | Intimate connection | Maximum voice intensity |

### Trust Constants

```typescript
// Trust bounds
MAX_TRUST = 10        // Cannot exceed
MIN_TRUST = 0         // Cannot go negative
INITIAL_TRUST = 0     // All characters start as strangers

// Thresholds
TRUST_THRESHOLDS = {
  stranger: 0,
  acquaintance: 2,
  friendly: 4,
  trusted: 6,
  close: 8,
  bonded: 10
}

// Unlock gates
VULNERABILITY_TRUST_THRESHOLD = 6  // Backstory reveals
LOYALTY_TRUST_THRESHOLD = 8        // Culminating mini-games
```

### Trust Change Mechanics

**How Trust Changes:**
- Dialogue choices have trust deltas (+1, -1, rarely +2/-2)
- Trust changes are **immediate and visible** (no hidden calculations)
- Trust is **bounded** (cannot exceed 10 or drop below 0)
- Trust is **per-character** (independent relationships)

**Example:**
```typescript
// Player chooses vulnerable response to Maya
currentTrust = 5
choiceTrustDelta = +1
newTrust = Math.min(MAX_TRUST, currentTrust + choiceTrustDelta)  // = 6
// Maya's vulnerability arc unlocks!
```

---

## Derivative System 1: Trust-Based Pattern Voice Tone (D-003)

### Voice Tone Progression

Pattern voices (internal dialogue) change intensity based on character trust.

| Voice Tone | Trust Required | Prefix | Suffix | Intensity |
|------------|----------------|--------|--------|-----------|
| **whisper** | 0-3 (Stranger) | `*barely audible*` | — | 0.3 |
| **speak** | 4-5 (Friendly) | — | — | 0.6 |
| **urge** | 6-9 (Trusted) | — | `—listen.` | 0.85 |
| **command** | 10 (Bonded) | `*with certainty*` | — | 1.0 |

### Voice Tone Logic

```typescript
function getVoiceToneForTrust(trust: number): VoiceTone {
  if (trust >= 10) return 'command'  // Bonded
  if (trust >= 6) return 'urge'       // Trusted
  if (trust >= 4) return 'speak'      // Friendly
  return 'whisper'                     // Stranger
}
```

### Formatted Voice Examples

**Trust 2 (Stranger) - Whisper:**
```
*barely audible* [The Weaver] Something doesn't add up here.
```

**Trust 5 (Friendly) - Speak:**
```
[The Weaver] Something doesn't add up here.
```

**Trust 7 (Trusted) - Urge:**
```
[The Weaver] Something doesn't add up here.—listen.
```

**Trust 10 (Bonded) - Command:**
```
*with certainty* [The Weaver] Something doesn't add up here.
```

**Design Philosophy:**
- Low trust = patterns are uncertain suggestions
- High trust = patterns are confident directives
- Mirrors how we trust our own instincts more in safe relationships

---

## Derivative System 2: Trust Asymmetry Gameplay (D-005)

### Asymmetry Detection

Characters notice when player favors certain relationships over others.

| Asymmetry Level | Trust Delta | Effect |
|-----------------|-------------|--------|
| **None** | 0-1 | No reaction |
| **Minor** | 2-3 | Noticed, no comment |
| **Notable** | 4-5 | Character comments on it |
| **Major** | 6+ | Affects character behavior |

### Asymmetry Reactions

| Reaction | Trigger | Example (Maya) |
|----------|---------|----------------|
| **jealousy** | Player has higher trust with rival/friend | "I see you've been spending more time with others..." |
| **curiosity** | Player has higher trust with this character | "Why do you keep coming back to me?" |
| **concern** | Player has much lower trust with others | "Are things okay with the others? You seem... distant from them." |
| **competition** | Player has high trust with multiple characters | Character tries to stand out |
| **withdrawal** | Player neglects this character | Character becomes more guarded |

### Asymmetry Calculation

```typescript
// Example: Player has Trust 8 with Maya, Trust 2 with Marcus
mayaTrust = 8
marcusTrust = 2
delta = Math.abs(mayaTrust - marcusTrust)  // = 6

if (delta >= 6) return { level: 'major' }      // ✓ Major asymmetry
if (delta >= 4) return { level: 'notable' }
if (delta >= 2) return { level: 'minor' }
return { level: 'none' }
```

### Character-Specific Comments

**Maya (Jealousy):**
- "I see you've been spending more time with others..."
- "Guess I'm not the only maker you've found."

**Samuel (Curiosity):**
- "You trust me with much. I wonder why."
- "What is it you see in an old station keeper?"

**Devon (Concern):**
- "Your relationship metrics seem skewed."
- "Optimization requires balance across all nodes."

---

## Derivative System 3: Consequence Echo Intensity (D-010)

### Echo Intensity Levels

Trust at the time of an event determines how vividly you remember it.

| Intensity | Trust at Event | Prefix | Detail Level | Fade Delay |
|-----------|----------------|--------|--------------|------------|
| **faded** | 0-2 | "A distant memory stirs..." | 20% | 2 sessions |
| **hazy** | 3-4 | "You recall something..." | 40% | 4 sessions |
| **clear** | 5-6 | "You remember clearly..." | 70% | 6 sessions |
| **vivid** | 7-8 | "The memory surfaces, sharp and bright..." | 90% | 10 sessions |
| **indelible** | 9-10 | "This moment is etched into you forever..." | 100% | Never fades |

### Echo Memory Structure

```typescript
interface StoredEcho {
  id: string
  characterId: string
  nodeId: string
  choiceId: string
  trustAtEvent: number          // Trust when echo was created
  intensity: EchoIntensity      // Calculated from trustAtEvent
  createdAt: number
  lastTriggered: number
  triggerCount: number
  echoText: string              // Brief version
  detailedText: string          // Full version (only shown if high detail level)
}
```

### Echo Formatting Example

**High Trust Echo (Trust 9 - Indelible):**
```
This moment is etched into you forever... Maya looked at you with tears in
her eyes and said, "You're the first person who's ever understood what I'm
trying to build. Not just the code—the why."
```

**Low Trust Echo (Trust 2 - Faded):**
```
A distant memory stirs...
```

**Design Philosophy:**
- High-trust moments are emotionally significant → vivid memories
- Low-trust moments are forgettable → vague impressions
- Mirrors real memory: we remember emotionally meaningful moments

---

## Derivative System 4: Trust Relationship Timeline (D-039)

### Timeline Data Structure

```typescript
interface TrustTimeline {
  characterId: string
  points: TrustTimelinePoint[]
  peakTrust: number              // Highest trust ever reached
  peakTimestamp: number
  lowestTrust: number            // Lowest trust ever reached
  lowestTimestamp: number
  currentStreak: number          // Consecutive sessions of positive growth
}

interface TrustTimelinePoint {
  timestamp: number
  trust: number
  event: string                  // What caused the change
  nodeId: string
  delta: number                  // +1, -1, etc.
}
```

### Trust Trends

```typescript
function getTrustTrend(timeline: TrustTimeline): 'improving' | 'stable' | 'declining' {
  const recentPoints = timeline.points.slice(-5)  // Last 5 interactions
  const totalDelta = recentPoints.reduce((sum, p) => sum + p.delta, 0)

  if (totalDelta > 1) return 'improving'
  if (totalDelta < -1) return 'declining'
  return 'stable'
}
```

### Example Timeline

```
Maya's Trust Timeline:
┌─────────────────────────────────────────┐
│ 10 │                              ▲    │ Peak: 9 (Session 18)
│  9 │                         ▲    │▲   │ Current: 8
│  8 │                    ▲    │    ││   │ Lowest: 1 (Session 3)
│  7 │               ▲    │    │    ││   │ Streak: 3 positive
│  6 │          ▲    │    │    │    ││   │ Trend: Improving
│  5 │     ▲    │    │    │    │    ││   │
│  4 │     │    │    │▼   │    │    ││   │
│  3 │     │    │    │    │    │    ││   │
│  2 │  ▲  │    │    │    │    │    ││   │
│  1 │  │  │    │    │    │    │    ││   │
│  0 │▲ │  │    │    │    │    │    ││   │
└─────────────────────────────────────────┘
    S1 S3 S5   S8   S11  S14  S16   S18
```

---

## Derivative System 5: Trust as Social Currency (D-057)

### Information Value Tiers

Trust unlocks progressively valuable information trades.

| Info Tier | Trust Required | Trust Cost | Example Information |
|-----------|----------------|------------|---------------------|
| **common** | 0 | 0 | Public knowledge, gossip |
| **uncommon** | 3 | 1 | Personal opinions, preferences |
| **rare** | 5 | 2 | Private struggles, fears |
| **secret** | 7 | 3 | Backstory reveals, vulnerabilities |
| **legendary** | 9 | 5 | Life-changing insights, hidden connections |

### Information Trade Structure

```typescript
interface InfoTradeOffer {
  id: string
  characterId: string
  infoId: string
  tier: InfoValueTier
  trustRequired: number          // Minimum trust to see offer
  trustCost: number             // Trust spent when accepting
  description: string           // What you're trading for
  preview: string               // What you see before unlocking
  fullContent: string           // What you get after unlocking
}
```

### Trade Example

**Secret Tier Trade (Maya):**
```typescript
{
  id: 'maya_secret_family_pressure',
  characterId: 'maya',
  infoId: 'family_expectations',
  tier: 'secret',
  trustRequired: 7,
  trustCost: 3,
  description: 'Maya offers to tell you about her family',
  preview: 'I haven\'t told anyone this, but... my family has no idea what I actually do.',
  fullContent: 'Maya reveals her family expects her to take over the family business,
                but she\'s been secretly building her startup. The pressure is crushing.'
}
```

**Trade Mechanics:**
```typescript
// Can player afford this trade?
currentTrust = 8
trade.trustRequired = 7   // ✓ Meets requirement
trade.trustCost = 3        // ✓ 8 - 3 = 5 (still positive)

// Execute trade
newTrust = currentTrust - trade.trustCost  // = 5
// Player receives: trade.fullContent
// Maya's trust drops to 5 (vulnerability creates distance temporarily)
```

**Design Philosophy:**
- Trust is a **spendable resource**, not just a score
- Asking for vulnerability **costs** trust (risk/reward)
- High-value information requires high-trust foundation

---

## Derivative System 6: Trust Momentum System (D-082)

### Momentum Mechanics

Trust changes faster/slower based on recent interaction history.

**Momentum Config:**
```typescript
MOMENTUM_CONFIG = {
  MAX_MULTIPLIER: 1.5,         // +50% trust change at max momentum
  MIN_MULTIPLIER: 0.5,         // -50% trust change at min momentum
  DECAY_PER_SESSION: 0.1,      // Momentum decays 10% per session
  POSITIVE_BOOST: 0.15,        // Each positive change boosts momentum
  NEGATIVE_BOOST: -0.2,        // Each negative change reduces momentum (faster!)
  STREAK_THRESHOLD: 3          // 3+ consecutive = bonus kicks in
}
```

### Momentum State

```typescript
interface TrustMomentum {
  characterId: string
  momentum: number              // -1.0 to 1.0
  consecutivePositive: number   // Positive streak length
  consecutiveNegative: number   // Negative streak length
  lastChangeAt: number
}
```

### Momentum Examples

**Positive Momentum (3+ consecutive positive):**
```
Turn 1: Trust +1, momentum = 0.15
Turn 2: Trust +1, momentum = 0.30
Turn 3: Trust +1, momentum = 0.525 (streak bonus!)
Turn 4: Trust +1 × 1.26 multiplier = +1.26 (rounded to +1, but faster progression felt)
```

**Negative Spiral (3+ consecutive negative):**
```
Turn 1: Trust -1, momentum = -0.2
Turn 2: Trust -1, momentum = -0.4
Turn 3: Trust -1, momentum = -0.7 (streak penalty!)
Turn 4: Trust -1 × 0.65 multiplier = -0.65 (damage reduction - harder to tank)
```

**Design Philosophy:**
- **Positive spirals:** Consistent positive choices → accelerated trust growth
- **Negative spirals:** Consistent negative choices → slowed trust loss (safety net)
- **Momentum decay:** Long gaps between interactions reset momentum
- **Asymmetric rates:** Easier to build momentum than destroy it

---

## Derivative System 7: Trust Relationship Inheritance (D-093)

### Trust Transfer Network

Friends of trusted characters trust you faster.

**Transfer Rates:**

| Relationship Type | Transfer Rate | Example |
|-------------------|---------------|---------|
| **close_friend** | 50% | Trust 10 with Samuel → Trust 5 bonus with Maya |
| **friend** | 25% | Trust 8 with Marcus → Trust 2 bonus with Grace |
| **colleague** | 10% | Trust 6 with Devon → Trust 0.6 bonus with Kai |
| **rival** | -25% | Trust 10 with Maya → Trust -2.5 penalty with Rohan |
| **stranger** | 0% | No transfer |

### Character Relationship Network

**Key Relationships:**

**Samuel's Network (Hub Character):**
- **Close friend:** Maya (50% transfer)
- **Friend:** Marcus, Rohan (25% transfer each)
- **Colleague:** Devon (10% transfer)

**Maya's Network:**
- **Close friend:** Samuel (50% transfer)
- **Friend:** Asha (25% transfer)
- **Colleague:** Devon (10% transfer)
- **Rival:** Rohan (-25% transfer) ⚠️

**Devon's Network:**
- **Close friend:** Kai (50% transfer)
- **Friend:** Silas (25% transfer)
- **Colleague:** Samuel, Maya (10% transfer each)

**Marcus's Network:**
- **Close friend:** Grace (50% transfer)
- **Friend:** Jordan, Samuel (25% transfer each)

**Rivalries:**
- **Maya ↔ Rohan** (Tech innovation vs. Deep tech)
- **Kai ↔ Alex** (Safety first vs. Efficiency first)

### Inheritance Calculation

```typescript
// Example: Player has Trust 8 with Samuel, meeting Maya for first time

samuelTrust = 8
samuelMayaRelationship = 'close_friend'
transferRate = 0.5  // 50%

mayaInheritedTrust = Math.floor(samuelTrust × transferRate)  // = 4
mayaStartingTrust = 0 + mayaInheritedTrust  // = 4 (starts at "Friendly")

// Dialogue reflects this:
// Maya: "Samuel spoke highly of you. I don't usually trust new people this fast."
```

### Rival Penalty Example

```typescript
// Player has Trust 10 with Maya, meets Rohan for first time

mayaTrust = 10
mayaRohanRelationship = 'rival'
transferRate = -0.25  // -25% (negative!)

rohanInheritedPenalty = Math.floor(mayaTrust × transferRate)  // = -2
rohanStartingTrust = 0 + rohanInheritedPenalty  // = 0 (clamped to MIN_TRUST)

// Dialogue reflects this:
// Rohan: "So you're the one Maya's been raving about. Let's see if you're as impressive as she claims."
```

### Trust Ripple Effects

When trust changes with one character, **ripples** propagate to connected characters.

```typescript
// Player +2 trust with Maya
mayaTrustDelta = +2

// Ripples to connected characters (at 50% strength):
samuelRipple = +2 × 0.5 (close_friend) × 0.5 (ripple) = +0.5 (rounds to +1)
ashaRipple = +2 × 0.25 (friend) × 0.5 = +0.25 (rounds to 0)
rohanRipple = +2 × -0.25 (rival) × 0.5 = -0.25 (rounds to 0)

// Result: Samuel gets +1 trust bonus when Maya trusts player more
```

**Design Philosophy:**
- **Social proof:** Trust is earned through reputation
- **Network effects:** Relationships are interconnected
- **Strategic choices:** Befriending rivals has trade-offs

---

## Trust Unlock Gates

### Major Content Unlocks

| Trust Level | Unlock | Characters Affected | Description |
|-------------|--------|---------------------|-------------|
| **Trust ≥2** | Standard dialogue | All 20 characters | Move beyond introduction |
| **Trust ≥4** | Pattern reflections | 17/20 characters | NPC comments on player's patterns |
| **Trust ≥6** | **Vulnerability arcs** | All 20 characters | Backstory reveals, emotional depth |
| **Trust ≥8** | **Loyalty experiences** | All 20 characters | Culminating mini-games, relationship climax |
| **Trust ≥10** | Maximum intimacy | All 20 characters | Command-level pattern voices |

### Vulnerability Arc Example (Trust ≥6)

```typescript
{
  nodeId: 'maya_vulnerability_arc',
  requiredState: { trust: { min: 6 } },  // Trust gate
  onEnter: [{
    characterId: 'maya',
    addKnowledgeFlags: ['maya_vulnerability_revealed']
  }],
  content: [{
    text: "I haven't told anyone this... but I'm terrified I'm building the wrong thing.",
    emotion: 'vulnerable_anxious',
    richEffectContext: 'warning'
  }],
  choices: [
    { text: "What makes you think that?", pattern: 'analytical', trustDelta: +1 },
    { text: "You're not alone in that fear.", pattern: 'helping', trustDelta: +2 },
    { text: "Then why keep building?", pattern: 'challenging', trustDelta: -1 }
  ]
}
```

### Loyalty Experience Example (Trust ≥8)

```typescript
{
  nodeId: 'maya_loyalty_simulation',
  requiredState: {
    trust: { min: 8 },                    // Trust gate
    patterns: { building: { min: 5 } }    // Pattern gate
  },
  simulation: {
    type: 'creative_direction',
    phases: 3,
    difficulty: 'medium',
    onSuccess: [{
      characterId: 'maya',
      trustDelta: +1,  // Can exceed 10 with loyalty success
      addKnowledgeFlags: ['maya_loyalty_complete']
    }]
  }
}
```

---

## Trust Display & UI

### Trust Badges

**Visual representation:**

| Trust Level | Badge | Color | Icon |
|-------------|-------|-------|------|
| 0-1 | Stranger | Gray | 🌫️ |
| 2-3 | Acquaintance | Blue | 👋 |
| 4-5 | Friendly | Green | 🤝 |
| 6-7 | Trusted | Teal | 💚 |
| 8-9 | Close | Purple | 💜 |
| 10 | Bonded | Gold | ✨ |

### Trust Change Notifications

**Example notifications:**

```
✓ Maya's trust increased to 6 (Trusted)
  → Vulnerability arc unlocked

✓ Marcus's trust increased to 8 (Close)
  → Loyalty experience unlocked

✗ Rohan's trust decreased to 3 (Acquaintance)
  → Pattern voices quieter with Rohan
```

### Journal Display

**Trust section in character profile:**

```
┌──────────────────────────────────┐
│ MAYA                             │
│ Trust: ████████░░ 8/10 (Close)   │
│                                  │
│ Timeline: ↗ Improving            │
│ Streak: 4 consecutive positive   │
│ Momentum: High (+0.7)            │
│                                  │
│ Unlocked:                        │
│ ✓ Pattern reflections            │
│ ✓ Vulnerability arc              │
│ ✓ Loyalty experience             │
│                                  │
│ Social Network:                  │
│ • Samuel: Close friend           │
│ • Asha: Friend                   │
│ • Rohan: Rival                   │
└──────────────────────────────────┘
```

---

## Validation Rules

### Trust Bounds

```typescript
import { MAX_TRUST, MIN_TRUST, INITIAL_TRUST } from '@/lib/constants'

// Apply trust change with bounds checking
function applyTrustChange(currentTrust: number, delta: number): number {
  const newTrust = currentTrust + delta
  return Math.max(MIN_TRUST, Math.min(MAX_TRUST, newTrust))
}

// Example
applyTrustChange(9, +2)   // = 10 (clamped at MAX_TRUST)
applyTrustChange(1, -3)   // = 0 (clamped at MIN_TRUST)
```

### Trust Label Lookup

```typescript
import { TRUST_THRESHOLDS } from '@/lib/constants'

function getTrustLabel(trust: number): string {
  if (trust >= TRUST_THRESHOLDS.bonded) return 'Bonded'
  if (trust >= TRUST_THRESHOLDS.close) return 'Close'
  if (trust >= TRUST_THRESHOLDS.trusted) return 'Trusted'
  if (trust >= TRUST_THRESHOLDS.friendly) return 'Friendly'
  if (trust >= TRUST_THRESHOLDS.acquaintance) return 'Acquaintance'
  return 'Stranger'
}
```

### Content Gate Validation

```typescript
import {
  VULNERABILITY_TRUST_THRESHOLD,
  LOYALTY_TRUST_THRESHOLD
} from '@/lib/constants'

function canAccessVulnerabilityArc(trust: number): boolean {
  return trust >= VULNERABILITY_TRUST_THRESHOLD  // Trust ≥6
}

function canAccessLoyaltyExperience(trust: number, patternLevel: number): boolean {
  return trust >= LOYALTY_TRUST_THRESHOLD &&     // Trust ≥8
         patternLevel >= 5                        // Pattern level ≥5
}
```

---

## Usage Examples

### Example 1: Trust Change with Momentum

```typescript
import { updateTrustMomentum, applyMomentumToTrustChange } from '@/lib/trust-derivatives'

// Player has been consistently positive with Maya
let momentum = {
  characterId: 'maya',
  momentum: 0.7,
  consecutivePositive: 4,
  consecutiveNegative: 0,
  lastChangeAt: Date.now()
}

// Player makes another positive choice
const baseTrustDelta = +1
const adjustedDelta = applyMomentumToTrustChange(baseTrustDelta, momentum)
// = +1 × 1.35 multiplier = +1.35 (rounds to +1, but feels faster)

// Update momentum
momentum = updateTrustMomentum(momentum, baseTrustDelta)
// momentum.momentum = 0.85 (approaching max)
// momentum.consecutivePositive = 5
```

### Example 2: Asymmetry Detection

```typescript
import { analyzeTrustAsymmetry, getAsymmetryComment } from '@/lib/trust-derivatives'

const characters = new Map([
  ['maya', { trust: 9, ... }],
  ['marcus', { trust: 3, ... }],
  ['samuel', { trust: 7, ... }]
])

const asymmetries = analyzeTrustAsymmetry(characters, 'maya')
// Returns: [
//   {
//     characterId: 'marcus',
//     asymmetry: { delta: 6, level: 'major' },
//     direction: 'lower'
//   }
// ]

// Maya might comment on this
const comment = getAsymmetryComment('maya', 'concern', gameState)
// "Are things okay with the others? You seem... distant from them."
```

### Example 3: Trust Inheritance

```typescript
import { calculateInheritedTrust } from '@/lib/trust-derivatives'

const characters = new Map([
  ['samuel', { trust: 10, ... }],  // Close friend with Maya
  ['marcus', { trust: 6, ... }],   // Friend with Grace
])

// Player meets Maya for the first time
const mayaInheritedTrust = calculateInheritedTrust('maya', characters)
// = 10 × 0.5 (close_friend with Samuel) = 5
// Maya starts at Trust 5 instead of 0!

// Player meets Grace for the first time
const graceInheritedTrust = calculateInheritedTrust('grace', characters)
// = 6 × 0.5 (close_friend with Marcus) = 3
// Grace starts at Trust 3
```

### Example 4: Information Trade

```typescript
import { canAffordInfoTrade, executeInfoTrade } from '@/lib/trust-derivatives'

const trade = {
  id: 'maya_secret_001',
  characterId: 'maya',
  tier: 'secret',
  trustRequired: 7,
  trustCost: 3,
  description: 'Family pressure reveal',
  preview: 'I haven\'t told anyone this...',
  fullContent: 'Maya reveals family business conflict'
}

const currentTrust = 8

// Check if affordable
const check = canAffordInfoTrade(currentTrust, trade)
// { canAfford: true }

// Execute trade
const result = executeInfoTrade(currentTrust, trade)
// {
//   success: true,
//   newTrust: 5,  // 8 - 3
//   infoId: 'maya_secret_001',
//   fullContent: 'Maya reveals family business conflict'
// }
```

---

## Cross-References

- **Emotions:** See `01-emotions.md` for nervous system states affected by trust
- **Patterns:** See `03-patterns.md` for pattern voice mechanics
- **Characters:** See `04-characters.md` for character relationship network
- **Dialogue System:** See `05-dialogue-system.md` for trust-gated nodes
- **UI Metadata:** See `10-ui-metadata.md` for trust delta insights display

---

## Design Notes

### Philosophy: Trust as Multidimensional Resource

**Traditional Games:**
```
High trust = Good ending
Low trust = Bad ending
```

**Lux Story:**
```
High trust = Deep access, but vulnerability costs trust
Low trust = Safety, but limited depth
Trust asymmetry = Social dynamics emerge
Trust inheritance = Reputation matters
Trust momentum = Consistency rewarded
```

**Core Principles:**

1. **Trust is spendable:** Not just a score to maximize—a currency to spend on intimacy
2. **Trust is social:** Relationships interconnect (inheritance, asymmetry, ripples)
3. **Trust has memory:** History matters (momentum, timeline, echo intensity)
4. **Trust has texture:** Not linear (voice tones, echo vividness, momentum)

### The Vulnerability Trade-Off

**Design Problem:**
- Players want to unlock content (vulnerability arcs)
- Players want to maximize trust scores
- Vulnerability should feel **risky**, not rewarded

**Solution:**
- Vulnerability arcs **unlock** at Trust ≥6 (gate)
- **Asking** for vulnerability **costs** trust (information trades)
- Creates tension: "Do I want to know this badly enough to risk the relationship?"

**Example:**
```
Player at Trust 7 with Maya
→ Vulnerability arc available
→ Maya offers: "I can tell you why I really left my last job... but it's heavy."

Choice 1: "I want to know."
  → Triggers info trade (cost: -2 trust)
  → Trust drops to 5 (still in vulnerability range, but closer to edge)
  → Player gets: Full backstory

Choice 2: "Only if you're ready."
  → No trade
  → Trust unchanged
  → Maya appreciates boundary (+1 trust next interaction)
```

### Momentum Design: Positive Spirals vs. Negative Spirals

**Asymmetric Design:**
- **Positive momentum** easier to build (+0.15 per positive choice)
- **Negative momentum** harder to accumulate (-0.2 per negative choice, but slower damage)
- **Rationale:** Relationships are sticky—easier to build than destroy

**Streak Bonuses:**
- 3+ consecutive positive → +0.075 bonus momentum
- 3+ consecutive negative → +0.1 bonus momentum (negative becomes even more negative)

**Decay:**
- 10% decay per session without interaction
- Prevents "set and forget" momentum
- Encourages consistent engagement

### Trust Inheritance: The Samuel Effect

**Design Problem:**
- New players meet 20 characters—overwhelming
- Players might skip characters thinking they'll start from zero
- Want to reward building trust with hub characters

**Solution:**
- **Samuel (Hub Character)** has close_friend relationships with Maya, Marcus, Rohan
- High trust with Samuel → inherit 50% trust with his friends
- Creates **strategic choice**: "Invest in Samuel → unlock his network faster"

**The Rival Twist:**
- Maya ↔ Rohan rivalry creates **tension**
- High trust with Maya → Rohan starts **skeptical** (-25% penalty)
- Players can't easily befriend everyone—must navigate social dynamics

### Voice Tone Progression: The ME2 Paragon/Renegade Problem

**Mass Effect 2 Problem:**
- Paragon/Renegade voices *interrupt* dialogue with glowing prompts
- Feels gamified, breaks immersion

**Lux Story Solution:**
- Pattern voices **scale intensity** with trust, not interruptions
- Low trust = whisper (easily ignored)
- High trust = command (confident directive)
- Mirrors **real internal dialogue**: we trust our instincts more in safe relationships

**Example:**
```
Trust 2 (Stranger):
*barely audible* [The Weaver] This doesn't add up...
→ Player might not even notice this voice

Trust 10 (Bonded):
*with certainty* [The Weaver] This doesn't add up.
→ Player feels confident in analytical approach
```

### Echo Intensity: Trust as Memory Vividness

**Design Philosophy:**
- **High-trust moments** are emotionally significant → vivid, detailed memories
- **Low-trust moments** are transactional → vague impressions that fade

**Mechanic:**
- Trust ≥9 at time of event → **Indelible** (never fades, full detail)
- Trust 0-2 at time of event → **Faded** (disappears after 2 sessions, minimal detail)

**Example:**
```
Event: Maya reveals family conflict

Scenario A (Trust 9):
→ Echo intensity: Indelible
→ Echo text (always shown with full detail):
   "This moment is etched into you forever... Maya looked at you with tears
    in her eyes and said, 'You're the first person who's ever understood what
    I'm trying to build. Not just the code—the why.'"

Scenario B (Trust 2):
→ Echo intensity: Faded
→ Echo text (minimal detail, fades after 2 sessions):
   "A distant memory stirs..."
```

**Why This Matters:**
- Encourages building trust **before** major story moments
- Replayability: Different trust levels = different memory experiences
- Authenticity: Mirrors how we actually remember relationships

### Future Considerations

**Trust Recovery Mechanics:**
- Currently: Trust can drop but no explicit "repair" system
- Future: Trust repair quests (e.g., "make amends with Maya")
- Trade-off: Should broken trust be recoverable? Or are some choices permanent?

**Trust Decay Over Time:**
- Currently: No passive trust decay
- Future: Trust slowly decays if character not visited for X sessions
- Rationale: Relationships require maintenance
- Trade-off: Could punish players who want to explore all characters

**Trust Caps Per Character:**
- Currently: All characters can reach Trust 10
- Future: Some characters have max trust caps (e.g., Samuel caps at 8 as mentor, not peer)
- Rationale: Not all relationships are equally intimate
- Trade-off: Could feel arbitrary

**Trust-Based Endings:**
- Currently: No explicit ending tied to trust totals
- Future: Total trust across all characters unlocks ending variants
- Example: High total trust → "Community" ending, Low → "Solitary" ending

**Trust Visualization:**
- Currently: Numerical display + label
- Future: Timeline graph, relationship web visualization
- Opportunity: Make social network visible and interactive

---

**Generated on:** January 13, 2026
**Verification:** Run `npm run verify-data-dict` to check for drift from source
