# Philosophy Foundation: What We Must Not Violate
**December 16, 2024 - Strategic Foundation Document**

---

## Purpose

Before ANY improvement or change, verify it aligns with these principles. If a proposed change conflicts with this foundation, the change is wrong—not the foundation.

---

## The 10 Core Commandments

These are **NON-NEGOTIABLE**. Every feature, fix, and improvement must serve these:

| # | Commandment | What It Means | Violation Example |
|---|-------------|---------------|-------------------|
| 1 | **Feel Comes First** | Game feels good in 30 seconds | Adding loading screens, slow animations |
| 2 | **Respect Player Intelligence** | Don't overexplain; let them discover | Tutorial popups, excessive tooltips |
| 3 | **Every Element Serves Multiple Purposes** | No single-purpose features | A button that only does one thing |
| 4 | **Accessible Depth** | Easy to learn, hard to master | Complex mechanics upfront |
| 5 | **Meaningful Choices** | Visible consequences, no "right" answers | Choices that all lead same place |
| 6 | **Friction is Failure** | Confusion = design failure | Unclear UI, unexplained mechanics |
| 7 | **Emotion Over Mechanics** | What players FEEL matters most | Focusing on numbers over narrative |
| 8 | **Show, Don't Tell** | World communicates narrative | Text-heavy explanations |
| 9 | **Juice is Not Optional** | Feedback for every action | Silent button clicks, static UI |
| 10 | **Kill Your Darlings** | Remove what doesn't serve core | Keeping features because "we built them" |

---

## The 6 Red Flags (What NOT To Build)

If you're building any of these, STOP:

| Red Flag | Description | How to Detect |
|----------|-------------|---------------|
| **The Iceberg Game** | 90% of features hidden | "Wait until hour 3 to see the good stuff" |
| **Developer's Delight** | Excites devs, confuses users | "This architecture is so elegant!" |
| **Progressive Paralysis** | Hiding features = looks broken | Players think game is empty |
| **Invisible Value Prop** | Uniqueness unclear in 30 sec | "What even is this game?" |
| **Tutorial Crutch** | Design by instruction | Popup explaining every mechanic |
| **Feature Graveyard** | Systems nobody uses | Code exists but never triggers |

---

## UI Consolidation Philosophy

### The Core Principle

**Fewer elements = less cognitive load = more immersion.**

If something CAN be in dialogue, it SHOULD be. Separate UI elements break the narrative spell.

### The 7 Remaining Active Elements

| Element | Type | Why It Stays |
|---------|------|--------------|
| Journal Panel | Slide-over (left) | Core progression display |
| Constellation Panel | Slide-over (right) | Relationship visualization |
| JourneySummary | Full-screen modal | Payoff moment (earned) |
| DetailModal | Bottom sheet | Deeper info without leaving context |
| Error Display | Full-screen modal | Recovery (necessary) |
| Fixed Header | Sticky | Navigation + status |
| Fixed Choices | Sticky bottom | Player agency |

### The Consolidation Decision Framework

Before adding ANY new UI element:

1. **Can this be dialogue?** → Make it Samuel echo or character response
2. **Can this be subtle visual cue?** → Glow, pulse, badge, color change
3. **Can this integrate into existing element?** → Add to Journal/Constellation/Header
4. **Is this one-time or ongoing?** → One-time = inline in narrative
5. **Does this break immersion?** → Yes = don't build it

### Consolidation Examples

| Need | Bad Solution | Good Solution |
|------|--------------|---------------|
| Tell player they earned orb | Toast popup | Journal button glows |
| Teach pattern system | Onboarding modal | Samuel explains via echo |
| Warn about local mode | Persistent banner | Samuel mentions once |
| Show session break | Popup announcement | Inline atmospheric text |
| Celebrate unlock | Full-screen celebration | Character acknowledges in dialogue |

---

## Joyce's Scrupulous Meanness

> "Every word must earn its place. Tight, spare, precise."

### The Principle

Cut ruthlessly. The reader fills in what you don't say.

### Before/After Examples

| Before | After |
|--------|-------|
| "Discover your interests, skills, and values through play." | "Play. Learn what moves you." |
| "Built on research. Designed by people who do this work." | "Research-backed. Practitioner-built." |
| "Real learning happens when you're uncomfortable" | "Sounds like it pushes people. Hard." |

### What to Cut

- "In order to" → "to"
- "The fact that" → (delete)
- "Very" → (delete or find stronger word)
- "Just" → (delete)
- "That" → (delete when possible)

### Writing Checklist

- [ ] Can any word be cut without losing meaning?
- [ ] Are there abstract nouns that could be concrete?
- [ ] Is there a simpler word?
- [ ] Does every adjective pull weight?

---

## Humanize Player Voice

> "Peer discovering alongside, not wise mentor."

### The Principle

Players are fellow travelers, not therapists or coaches.

### Before/After Examples

| Before (Therapist Voice) | After (Peer Voice) |
|--------------------------|-------------------|
| "Real learning happens when you're uncomfortable" | "Sounds like it pushes people. Hard." |
| "You don't have to choose between engineer and son. Be both." | "What if you don't have to pick?" |
| "The system worked for the company. It failed the human." | "The paperwork protected them. Not him." |

### What to Remove

- Coaching axioms and reframing
- Leading questions
- "Wise mentor" pronouncements
- Inspirational quotes in dialogue

---

## Remove Meta-Framing

### The Principle

Stay in fiction. Never remind players they're in a game or learning tool.

### What to Remove

- Coaching language
- Inspirational quotes in UI
- Game-meta text ("You've completed...")
- Stage directions in dialogue (`*nods*`, `[looks away]`)
- Therapist-style axioms

### What to Use Instead

- Actionable career guidance
- Simplified descriptions
- Pure dialogue (no brackets)
- In-world language

---

## Demonstrate Before Explain

> "Miyamoto Principle: Show the orb before Samuel explains patterns."

### The Principle

Players understand through action, not words.

### Implementation

| Wrong Order | Right Order |
|-------------|-------------|
| Samuel explains patterns → Player sees orbs | Player earns orb → Samuel comments on what they saw |
| Tutorial modal → Gameplay | Gameplay → Samuel echo teaches |
| "Here's how trust works" | Trust changes → Character reacts |

### The Commit That Defined This

```
feat: implement Tier 1 - show orbs immediately, demonstrate before explain

Impact:
- first_orb_view_time: 10-15 min → <3 min
- Players understand core mechanic through action, not words
```

---

## Single Source of Truth

### The Principle

Don't duplicate data. One canonical location for each type of information.

### Examples

| Data | Single Source | NOT This |
|------|---------------|----------|
| Skills per choice | `choice.skills` in dialogue graph | Separate `scene-skill-mappings.ts` |
| Pattern metadata | `lib/patterns.ts` | Multiple pattern files |
| Character positions | `lib/constellation/character-positions.ts` | Hardcoded in components |

### The Commit That Defined This

```
refactor: Phase 1 bloat cleanup - remove 3,455 lines

- scene-skill-mappings.ts (2,183 lines) - Duplicated data from dialogue graphs
- Skills now sourced from dialogue graph choice.skills array (single source of truth)
```

---

## Clean Before Add

### The Principle

Remove bloat before adding features. Complexity without value is debt.

### The Decision Framework

Before adding ANY feature:
1. What can be deleted to make room?
2. Is there duplicate code doing similar things?
3. Is there dead code that never runs?
4. Can existing systems be activated instead of new ones built?

### Evidence from History

| Cleanup | Lines Removed | Benefit |
|---------|---------------|---------|
| Phase 1 bloat cleanup | 3,455 | Single source of truth |
| Remove toolbar | 200+ | Cleaner mobile |
| Archive legacy scripts | 1,000+ | Faster builds |
| Remove meta-framing | 100+ | Better immersion |

---

## Meaningful Choices (No Fake Choices)

### The Principle

Every choice must lead somewhere different OR get different acknowledgment.

### The Problem

```
Before: All 3 intro choices → same `samuel_introduction` node
Player chooses "Look around" → Gets pushed into narrative anyway
```

### The Solution

```
After:
- "Step off train" → Direct intro (eager player)
- "Look around first" → station_observation → patient intro variant
- "See if others getting off" → observe_passengers → aware intro variant

Each variant has Samuel respond differently based on HOW player chose to enter.
```

### Detection

If 2+ choices in same node share `nextNodeId` → Flag as fake choice

---

## The Station Breathes

### The Principle

When player pauses, life continues around them. Living world without breaking dialogue.

### Event Timing

```typescript
FIRST_IDLE_MS: 12000     // 12 seconds before first event
SUBSEQUENT_IDLE_MS: 18000 // 18 seconds between events
MAX_IDLE_EVENTS: 3        // Then silence (don't overwhelm)
```

### Writing Rules

1. **One sentence, one observation**
2. **Show, don't tell** - "A woman rushes past" not "The station is busy"
3. **Specific details** - "leather bag, heels clicking" not "with luggage"
4. **No player action required** - Pure atmosphere
5. **Varied senses** - Mix visual, auditory, olfactory, tactile

---

## The Three-Layer Reflection System

### The Principle

The game observes, then reflects at key moments. Being SEEN, not JUDGED.

```
Layer 1: Silent Tracking
- Every choice updates pattern counts
- No UI, no numbers shown
- Player unaware of tracking

Layer 2: Subtle Sensations (30% chance)
- Brief feedback after pattern choices
- Atmospheric, not informational
- "Something in you reaches out" (helping)
- Fades after 3 seconds

Layer 3: Character Observations
- Samuel's "What do I see in you?" reflections
- Requires trust ≥3 AND pattern ≥4
- Full narrative reflection
```

### Pattern Sensations (Layer 2)

Sensations are FELT, not TOLD. Internal, bodily, intuitive.

```
analytical: "Something clicks into place."
patience: "You let the moment breathe."
exploring: "Curiosity pulls at you."
helping: "Something in you reaches out."
building: "Your hands itch to make it real."
```

---

## The Core Design Tension: How We Handle Patterns

Three competing philosophies. **We choose Philosophy C**:

| Philosophy | Approach | Risk | Our Choice |
|------------|----------|------|------------|
| A: Silent Tracking | Track secretly, reveal at end | Feels manipulative | NO |
| B: Continuous Acknowledgment | NPCs constantly comment | Feels game-y, breaks immersion | NO |
| **C: Milestone Acknowledgment** | Silent tracking + periodic revelations | Balance: ~20% acknowledgment | **YES** |

**Target: 20% acknowledgment rate (currently 4%)**

---

## Dialogue-Driven Immersion (NON-NEGOTIABLE)

**Everything stays in narrative container:**

| Do This | Don't Do This |
|---------|---------------|
| Samuel echoes about local mode | Config warning banner |
| Pattern sensations as atmospheric text | Progress toasts |
| Continue button in dialogue | Popup modals interrupting |
| Journal glow effect | Toast notifications |

**The Rule:** If it's not something a character would say or the station would show, it doesn't belong.

---

## The Choice Contract

Every choice promises:

### MUST Do:
1. Lead somewhere different OR get different acknowledgment
2. Track exactly ONE pattern (no ambiguity)
3. Have clear emotional intent (tone)

### MUST NOT Do:
- Promise exploration then railroad
- Track patterns that never manifest
- Set flags that are never checked
- Offer false urgency or agency

---

## Mobile-First

### The Principle

Design for mobile, enhance for desktop. Not the reverse.

### Requirements

- Touch targets: min 44px
- Safe areas: `env(safe-area-inset-bottom)`
- Fixed choice container: 140px height with scroll
- No hover-only interactions
- Responsive text: `text-xs sm:text-sm`

---

## Pokemon Alignment Principles

We follow Pokemon's "depth-under-simplicity" philosophy:

| Pokemon Principle | Lux Story Implementation |
|-------------------|--------------------------|
| Constraint-driven design | Mobile-first, small team |
| Smart defaults reduce friction | Journal defaults to 'orbs' tab |
| Color psychology over numbers | Emotional states not percentages |
| Hidden systems create depth | Patterns revealed at Journey Summary |
| Four-move limit = identity through constraint | Identity offering at threshold 5 |
| Teaching through play | Samuel teaches via milestone echoes |
| Ceremony for permanent changes | Identity acceptance has ceremony |

---

## The Five Lenses (For Design Review)

When evaluating ANY change:

1. **Player's Lens** - What do players actually experience vs. designed?
2. **Systems Lens** - Which features are visible vs. buried?
3. **Business Lens** - Is value prop clear in 30 seconds?
4. **Emotion Lens** - Where does frustration replace fun?
5. **Time Lens** - What's visible at minute 1, 5, 30, 60?

---

## What Makes Lux Story Unique

**Core Identity:** A pattern-recognition game disguised as career exploration.

**The Magic:** Players feel "seen" - acknowledged not for what they said, but for who they're becoming.

**The Experience Prioritizes:**
1. What players FEEL over what they DO
2. Being SEEN over being JUDGED
3. Discovery over EXPLANATION
4. Specific sensory detail over abstract concept
5. Character personality over mechanical systems

---

## Flexible vs. Non-Negotiable

### NON-NEGOTIABLE (Core to Vision)
- Dialogue-driven interface
- Pattern tracking philosophy (silent → milestone → summary)
- Character-centric narratives
- 32×32 pixel art aesthetic
- Show-don't-tell principle
- Feel-first approach
- Mobile-first design
- UI consolidation (7 elements max)
- Joyce's tight writing
- Humanized player voice

### FLEXIBLE (Can Adapt)
- Specific feature list
- Audio/visual polish level
- Number of characters
- Skill system (keep/remove/wire up)
- Transformation flags (keep/simplify)

---

## Before Making Any Change, Ask:

1. Does this serve the 10 Commandments?
2. Am I building a Red Flag?
3. Does this stay dialogue-driven?
4. Would this feel good in 30 seconds?
5. Am I showing, not telling?
6. Does this respect player intelligence?
7. Can this be in dialogue instead of UI?
8. Is this the minimum complexity needed?
9. Am I cleaning before adding?
10. Does every word earn its place?

**If any answer is "no" or "unsure," reconsider the change.**

---

## The Station's Spirit

> "The station is a mirror. It shows you what you're looking for."

The game doesn't tell you who you are. It shows you who you're becoming—through choices, through characters, through the patterns that emerge when you're not looking.

Samuel doesn't judge. He observes. The station doesn't grade. It reflects.

That's the magic. That's what we protect.

---

*This document is the foundation. All roadmap items must pass through this filter.*
