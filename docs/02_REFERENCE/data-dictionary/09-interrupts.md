# Interrupts - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/dialogue-graph.ts`, `/content/*-dialogue-graph.ts` (24 files)
**Status:** Manual documentation

## Overview

The interrupt system creates ME2-style quick-time events during NPC dialogue, letting players choose to act in emotionally charged moments. Interrupts create **agency through timing** rather than just choice selection.

**Key Stats:**
- **Interrupt types:** 6 (connection, challenge, silence, comfort, grounding, encouragement)
- **Total interrupts:** 23 across all dialogue graphs
- **Character coverage:** 20/20 characters have interrupt moments
- **Window duration:** 2000-4000ms (2-4 seconds)
- **Bonus consequences:** Usually +1 to +2 trust for taking interrupt
- **Miss penalty:** None (continues normally if missed)

---

## Core Concept

**Traditional Dialogue:**
```
NPC: "I don't know if I can do this."
→ Wait for NPC to finish
→ See choices
→ Select choice
```

**With Interrupts:**
```
NPC: "I don't know if I can do this." *voice breaks*
→ [2.5 second window]
→ [Reach out] button appears
→ Click = interrupt node (+2 trust bonus)
→ Miss = continue normally (no penalty)
```

**Design Philosophy:**
- **Timing matters:** Quick reactions show instinct, not calculation
- **No wrong answer:** Missing interrupt isn't punished
- **Emotional resonance:** Interrupts happen during vulnerable moments
- **Visual clarity:** Color-coded by interrupt type

---

## Interrupt Types (6 Total)

### 1. Connection (6 interrupts)

**Purpose:** Build rapport through physical/emotional touch.

**Visual:** Blue highlight

**Example Actions:**
- "Put hand on shoulder"
- "Reach out"
- "Make eye contact"
- "Lean in closer"

**Context:** Used when NPC is opening up emotionally but uncertain.

**Example:**
```typescript
interrupt: {
  duration: 3000,
  type: 'connection',
  action: 'Reach out and touch their shoulder',
  targetNodeId: 'maya_interrupt_connection',
  consequence: {
    characterId: 'maya',
    trustDelta: +2
  }
}
```

**Characters with connection interrupts:**
- Maya (startup pressure moment)
- Marcus (father's stroke reveal)
- Rohan (sister's death mention)
- Elena (mentor loss)
- Grace (patient death)
- Jordan (career doubt)

### 2. Challenge (0 interrupts)

**Purpose:** Question assumptions or call out contradictions.

**Visual:** Red highlight

**Example Actions:**
- "Call out the contradiction"
- "Push back"
- "Question the assumption"

**Context:** Used when NPC says something questionable that needs challenging.

**Status:** Defined in system but not yet implemented in dialogue graphs.

**Design Note:** Challenge interrupts are high-risk (could reduce trust) and require careful balancing. Reserved for future implementation when trust recovery mechanics are solidified.

### 3. Silence (7 interrupts)

**Purpose:** Let moment breathe, show patience through non-action.

**Visual:** Gray highlight

**Example Actions:**
- "Say nothing"
- "Wait"
- "Let silence settle"
- "Give space"

**Context:** Used when NPC needs time to process, or when silence is more powerful than words.

**Example:**
```typescript
interrupt: {
  duration: 4000,              // Longer window (silence takes confidence)
  type: 'silence',
  action: 'Say nothing',
  targetNodeId: 'rohan_silence_aftermath',
  consequence: {
    characterId: 'rohan',
    trustDelta: +1
  }
}
```

**Characters with silence interrupts:**
- Rohan (processing grief)
- Devon (overwhelm moment)
- Elena (contemplative pause)
- Asha (mediation tension)
- Zara (ethical dilemma)
- Silas (factory closure memory)
- Kai (trauma flashback)

**Design Philosophy:** Silence is the **hardest interrupt** to take (counterintuitive to "do something"). High trust reward for respecting the moment.

### 4. Comfort (3 interrupts)

**Purpose:** Provide emotional support during distress.

**Visual:** Pink highlight

**Example Actions:**
- "Offer a hug"
- "Hold their hand"
- "Wipe their tears"

**Context:** Used when NPC is crying, breaking down, or visibly distressed.

**Example:**
```typescript
interrupt: {
  duration: 3500,
  type: 'comfort',
  action: 'Wipe their tears',
  targetNodeId: 'grace_comfort_accepted',
  consequence: {
    characterId: 'grace',
    trustDelta: +2
  }
}
```

**Characters with comfort interrupts:**
- Grace (patient death breakdown)
- Marcus (father's condition worsening)
- Maya (family pressure tears)

### 5. Grounding (2 interrupts)

**Purpose:** Calm anxiety or panic through presence.

**Visual:** Green highlight

**Example Actions:**
- "Breathe with them"
- "Anchor them to the present"
- "Ground their panic"

**Context:** Used when NPC is having anxiety attack, panic, or dissociation.

**Example:**
```typescript
interrupt: {
  duration: 2500,
  type: 'grounding',
  action: 'Breathe with them',
  targetNodeId: 'kai_grounding_success',
  consequence: {
    characterId: 'kai',
    trustDelta: +2
  }
}
```

**Characters with grounding interrupts:**
- Kai (PTSD flashback)
- Nadia (whistleblower anxiety)

### 6. Encouragement (5 interrupts)

**Purpose:** Motivate and remind of strength.

**Visual:** Yellow highlight

**Example Actions:**
- "Remind them of their strength"
- "Affirm their capability"
- "Boost their confidence"

**Context:** Used when NPC doubts themselves but needs a push.

**Example:**
```typescript
interrupt: {
  duration: 3000,
  type: 'encouragement',
  action: 'Remind them what they\'ve already overcome',
  targetNodeId: 'dante_encouraged',
  consequence: {
    characterId: 'dante',
    trustDelta: +1
  }
}
```

**Characters with encouragement interrupts:**
- Dante (sales doubt)
- Tess (imposter syndrome)
- Yaquin (launch fears)
- Quinn (ethics compromise)
- Isaiah (nonprofit crisis)

---

## Interrupt Coverage Matrix

### By Character (20/20 Coverage)

| Character | Total Interrupts | Types | Key Moments |
|-----------|-----------------|-------|-------------|
| **Maya** | 2 | connection, comfort | Startup pressure, family tears |
| **Samuel** | 1 | silence | Station keeper's pause |
| **Devon** | 1 | silence | Overwhelm moment |
| **Marcus** | 2 | connection, comfort | Father's stroke, condition update |
| **Rohan** | 2 | connection, silence | Sister's death, grief processing |
| **Tess** | 1 | encouragement | Imposter syndrome |
| **Kai** | 2 | silence, grounding | Trauma flashback, PTSD |
| **Elena** | 2 | connection, silence | Mentor loss, contemplation |
| **Alex** | 1 | connection | Supply chain failure guilt |
| **Grace** | 2 | connection, comfort | Patient death breakdown |
| **Jordan** | 1 | connection | Career doubt |
| **Silas** | 1 | silence | Factory closure memory |
| **Asha** | 1 | silence | Mediation tension |
| **Lira** | 1 | connection | Sound as escape |
| **Zara** | 1 | silence | Ethical dilemma |
| **Yaquin** | 1 | encouragement | Launch fears |
| **Quinn** | 1 | encouragement | Ethics compromise |
| **Dante** | 1 | encouragement | Sales doubt |
| **Nadia** | 1 | grounding | Whistleblower anxiety |
| **Isaiah** | 1 | encouragement | Nonprofit crisis |

### By Interrupt Type

| Type | Count | % of Total | Characters |
|------|-------|------------|------------|
| **silence** | 7 | 30.4% | Rohan, Devon, Elena, Asha, Zara, Silas, Kai |
| **connection** | 6 | 26.1% | Maya, Marcus, Rohan, Elena, Grace, Jordan, Alex, Lira |
| **encouragement** | 5 | 21.7% | Dante, Tess, Yaquin, Quinn, Isaiah |
| **comfort** | 3 | 13.0% | Grace, Marcus, Maya |
| **grounding** | 2 | 8.7% | Kai, Nadia |
| **challenge** | 0 | 0% | (Not yet implemented) |

---

## Interrupt Window Mechanics

### InterruptWindow Structure

```typescript
interface InterruptWindow {
  duration: number                  // Milliseconds (2000-4000)
  type: 'connection' | 'challenge' | 'silence' | 'comfort' | 'grounding' | 'encouragement'
  action: string                    // Button label
  targetNodeId: string              // Where interrupt leads
  consequence?: StateChange         // Bonus (usually +1 or +2 trust)
  missedNodeId?: string             // Alternative if missed (optional)
}
```

### Duration Guidelines

| Window Duration | Use Case | Player Experience |
|----------------|----------|-------------------|
| **2000ms** | Quick reactions | "Act fast!" |
| **2500ms** | Standard window | "Comfortable timing" |
| **3000-3500ms** | Emotional weight | "Take a breath, then act" |
| **4000ms** | Silence interrupts | "This takes confidence" |

**Design Principle:** Longer windows for **harder** interrupts (silence > grounding > connection).

### Consequence Patterns

**Trust Bonuses:**
- **+1 trust:** Encouragement, silence (standard difficulty)
- **+2 trust:** Connection, comfort, grounding (high emotional value)

**Additional Consequences:**
```typescript
consequence: {
  characterId: 'maya',
  trustDelta: +2,
  addKnowledgeFlags: ['maya_felt_supported']  // Optional memory
}
```

### Missed Interrupt Behavior

**Default:** If interrupt missed, dialogue continues to next node normally.

**Optional Alternative:**
```typescript
missedNodeId: 'grace_hurt_by_inaction'  // Different branch if missed
```

**Design Philosophy:** Missed interrupts are **not punished**—they're simply missed opportunities. No trust penalty, just a different path.

---

## UI Visual Design

### Color Coding

| Type | Color | Hex | Tailwind Class | Emotion |
|------|-------|-----|----------------|---------|
| **connection** | Blue | #3B82F6 | `bg-blue-500` | Empathy, rapport |
| **challenge** | Red | #EF4444 | `bg-red-500` | Assertiveness, truth |
| **silence** | Gray | #6B7280 | `bg-gray-500` | Patience, space |
| **comfort** | Pink | #EC4899 | `bg-pink-500` | Care, tenderness |
| **grounding** | Green | #10B981 | `bg-green-500` | Calm, stability |
| **encouragement** | Yellow | #F59E0B | `bg-yellow-500` | Motivation, strength |

### Button Animation

```typescript
// Fade in with pulse
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
whileHover={{ scale: 1.05 }}
transition={{ duration: 0.3, ...springs.snappy }}
```

**Visual Cues:**
- Button appears mid-dialogue (not at end)
- Countdown indicator (subtle progress bar)
- Color matches interrupt type
- Icon optional (❤️ for comfort, 🤐 for silence, etc.)

### Positioning

**Desktop:** Bottom-right of dialogue card (doesn't obscure text)

**Mobile:** Bottom of screen (thumb-accessible zone)

---

## Validation Rules

### Interrupt Window Validation

```typescript
import { type InterruptWindow } from '@/lib/dialogue-graph'

function isValidInterruptWindow(interrupt: InterruptWindow): boolean {
  // Duration within bounds
  if (interrupt.duration < 1000 || interrupt.duration > 5000) {
    console.warn('Interrupt duration should be 1000-5000ms')
    return false
  }

  // Type is valid
  const validTypes = ['connection', 'challenge', 'silence', 'comfort', 'grounding', 'encouragement']
  if (!validTypes.includes(interrupt.type)) {
    console.error(`Invalid interrupt type: ${interrupt.type}`)
    return false
  }

  // Action is descriptive
  if (!interrupt.action || interrupt.action.length < 3) {
    console.warn('Interrupt action should be descriptive')
    return false
  }

  // Target node exists (requires graph context)
  // ... node existence check ...

  return true
}
```

---

## Usage Examples

### Example 1: Connection Interrupt

```typescript
content: [{
  text: "I don't know if I can keep doing this. Everyone's counting on me and I'm... I'm terrified I'll let them down.",
  emotion: 'vulnerable_anxious',
  variation_id: 'maya_breakdown_01',
  interrupt: {
    duration: 3000,
    type: 'connection',
    action: 'Put hand on her shoulder',
    targetNodeId: 'maya_interrupt_connection',
    consequence: {
      characterId: 'maya',
      trustDelta: +2,
      addKnowledgeFlags: ['maya_felt_supported']
    }
  }
}]
```

**Player Experience:**
1. Maya's dialogue appears: "I don't know if I can keep doing this..."
2. 3-second window opens
3. Blue button appears: [Put hand on her shoulder]
4. If clicked → maya_interrupt_connection node (+2 trust)
5. If missed → continues to choices normally

### Example 2: Silence Interrupt

```typescript
content: [{
  text: "*long pause* My sister... she died in a lab accident. That's why I'm so obsessed with safety protocols.",
  emotion: 'grief_raw',
  variation_id: 'rohan_vulnerability_01',
  interrupt: {
    duration: 4000,              // Longer window for silence
    type: 'silence',
    action: 'Say nothing',
    targetNodeId: 'rohan_silence_honored',
    consequence: {
      characterId: 'rohan',
      trustDelta: +2              // High reward for respecting silence
    }
  }
}]
```

**Player Experience:**
1. Rohan reveals sister's death
2. 4-second window opens
3. Gray button appears: [Say nothing]
4. If clicked → rohan_silence_honored (+2 trust, respects the moment)
5. If missed → continues with standard comfort/analytical choices

### Example 3: Grounding Interrupt

```typescript
content: [{
  text: "*breathing rapidly* I can't— the machines— *gasping* it's happening again—",
  emotion: 'panicked',
  variation_id: 'kai_flashback_01',
  interrupt: {
    duration: 2500,
    type: 'grounding',
    action: 'Breathe with him',
    targetNodeId: 'kai_grounding_success',
    consequence: {
      characterId: 'kai',
      trustDelta: +2,
      addKnowledgeFlags: ['kai_grounded_by_player']
    }
  }
}]
```

**Player Experience:**
1. Kai has PTSD flashback mid-conversation
2. 2.5-second window opens
3. Green button appears: [Breathe with him]
4. If clicked → kai_grounding_success (breathing exercise, calm down)
5. If missed → Kai recovers alone (no penalty, but less intimacy)

---

## Cross-References

- **Dialogue System:** See `05-dialogue-system.md` for DialogueContent structure
- **Trust System:** See `08-trust-system.md` for trust bonuses from interrupts
- **Emotions:** See `01-emotions.md` for interrupt-triggering emotions (vulnerable, panicked, etc.)
- **Characters:** See `04-characters.md` for interrupt coverage per character

---

## Design Notes

### Philosophy: Agency Through Timing

**Design Problem:**
- Traditional dialogue = "What do I say?"
- Real relationships = "When do I act?"

**Solution:**
- Interrupts shift focus from **choice** to **timing**
- "Do I reach out NOW or wait?"
- Creates tension: "If I don't act fast, the moment passes"

**Inspiration:** Mass Effect 2 Paragon/Renegade interrupts

**Key Difference from ME2:**
- **No moral binary:** Interrupts aren't "good" or "bad"
- **Contextual meaning:** "Silence" can be respect OR avoidance depending on moment
- **No penalty:** Missing interrupt doesn't reduce trust (just different path)

### Silence as the Hardest Interrupt

**Counter-Intuitive Design:**
- Most interrupts = "Do something" (reach out, comfort, ground)
- Silence = "Do nothing"

**Why It's Hard:**
- Players instinct: "I should help!" → want to click something
- Silence = resist urge to fill space
- Requires confidence: "My presence is enough"

**High Reward:**
- Silence interrupts give +2 trust (same as connection/comfort)
- Rationale: Respecting silence is **harder** than acting

**Real-World Parallel:**
- Grief counseling: "Just sit with them"
- Therapy: "Comfortable with uncomfortable silence"
- Eastern philosophy: "Wu wei" (non-action)

### Interrupt Duration as Difficulty Tuning

**Short Window (2000-2500ms):**
- **Easy:** Player sees it, clicks quickly
- **Use case:** Connection, encouragement (intuitive responses)

**Long Window (3500-4000ms):**
- **Hard:** Player has time to second-guess
- **Use case:** Silence (fighting urge to act)

**Design Insight:** Duration shapes **player psychology**, not just reaction time.

### No Challenge Interrupts Yet (Intentional)

**Why Challenge is missing:**
- **High risk:** Could reduce trust if used wrongly
- **Context-dependent:** "Calling out" can be supportive OR aggressive
- **Trust recovery:** Need mechanics for repairing damaged trust first

**Future Implementation:**
```typescript
// Example challenge interrupt (not yet in game)
interrupt: {
  type: 'challenge',
  action: 'Call out the contradiction',
  consequence: {
    trustDelta: -1,  // Risk!
    addKnowledgeFlags: ['maya_challenged_assumption']
  }
}
```

**When to Add:**
- After trust recovery mechanics (Phase 2)
- With careful trust modeling (prevent death spirals)
- Possibly as "analytical pattern unlock" (high analytical = can challenge safely)

### Missed Interrupt: No Penalty Design

**Alternative Design:**
```typescript
// ❌ Could penalize missing interrupt
missedNodeId: 'grace_feels_ignored'
consequence: { trustDelta: -1 }  // Penalty for inaction
```

**Why We Don't:**
- **Feels punishing:** "I didn't click fast enough and now Grace hates me"
- **Accessibility:** Penalizes players with slower reactions
- **Anxiety-inducing:** Creates FOMO ("What if I miss it?!")

**Current Design:**
- **Opportunity cost:** Different branch, but not worse
- **Replay value:** "What happens if I take it vs. miss it?"
- **Low-stress:** Missed interrupt = normal dialogue flow

### Interrupt Placement Strategy

**Where Interrupts Appear:**
1. **Vulnerability arcs** (Trust ≥6) - 40% of interrupts
2. **Emotional breakdowns** - 30% of interrupts
3. **Contemplative pauses** - 20% of interrupts
4. **Decision points** - 10% of interrupts

**Where Interrupts Don't Appear:**
- Introduction nodes (too early in relationship)
- Simulation nodes (focus on task, not emotion)
- Narrative exposition (would disrupt information flow)

**Design Principle:** Interrupts are **emotional punctuation**, not constant prompts.

### Future Considerations

**Multi-Choice Interrupts:**
- Currently: Single interrupt per content block
- Future: Multiple interrupt options ("Reach out" vs. "Step back")
- Trade-off: Depth vs. overwhelming player

**Interrupt Chains:**
- Currently: Single interrupt → single consequence
- Future: Interrupt triggers second interrupt (escalation)
- Example: Comfort → Hug → "Hold them while they cry"

**Pattern-Locked Interrupts:**
- Currently: All interrupts available to all players
- Future: "Challenge" interrupts only if analytical ≥5
- Trade-off: Personalization vs. content gating

**Timed Dialogue Continuation:**
- Currently: Interrupt appears, dialogue pauses
- Future: Dialogue continues during interrupt window (rushing player)
- Trade-off: Urgency vs. readability

**Interrupt Combos:**
- Currently: Single interrupt = single trust bonus
- Future: Taking multiple interrupts in one conversation = combo bonus
- Example: 3 interrupts in vulnerability arc = +5 trust instead of +6

---

**Generated on:** January 13, 2026
**Verification:** Run `grep -r "interrupt:" content/` to audit interrupt placements
