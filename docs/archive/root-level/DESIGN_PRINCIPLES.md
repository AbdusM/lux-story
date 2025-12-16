# Grand Central Terminus - Design Principles

> "The right amount of complexity is the minimum needed for the current task."

This document captures the core design patterns, writing principles, and engagement systems that make the game feel alive.

---

## 1. The Station Breathes: Ambient Event Architecture

When the player pauses to think, life continues around them. This creates a living world without breaking the dialogue-driven nature.

### Event Structure

```typescript
interface AmbientEvent {
  id: string           // Unique identifier for deduplication
  type: AmbientEventType
  text: string         // The atmospheric text (1-2 sentences max)
  characterId?: string // Only show with specific character
  weight: number       // Higher = more likely (1-3 typical)
}
```

### Event Types (Layered Atmosphere)

| Type | Purpose | Examples |
|------|---------|----------|
| `station_atmosphere` | The physical world | Trains, announcements, echoes |
| `distant_life` | Other people | Travelers, workers, families |
| `character_idle` | Your companion | Fidgets, glances, micro-expressions |
| `environmental` | Sensory details | Light, sounds, smells, temperature |

### Timing Configuration

```typescript
FIRST_IDLE_MS: 12000     // 12 seconds before first event
SUBSEQUENT_IDLE_MS: 18000 // 18 seconds between events
MAX_IDLE_EVENTS: 3        // Then silence (don't overwhelm)
```

### Writing Rules for Ambient Events

1. **One sentence, one observation** - Never more than two sentences
2. **Show, don't tell** - "A woman rushes past" not "The station is busy"
3. **Specific details** - "leather bag, heels clicking" not "with luggage"
4. **No player action required** - Pure atmosphere, no choices
5. **Varied senses** - Mix visual, auditory, olfactory, tactile

### Character Idle Patterns

Each character has distinct idle behaviors that reveal personality:

| Character | Idle Style | Examples |
|-----------|------------|----------|
| Samuel | Contemplative, still | Watches trains, hums old songs, comfortable with silence |
| Maya | Restless, observant | Traces patterns, shifts weight, eyes elsewhere |
| Devon | Analytical, precise | Notes patterns, taps rhythms, checks time |
| Jordan | Curious, open | Studies arrivals, easy nods, leans toward sounds |
| Marcus | Grounded, practical | Examines hands, nods to workers, notices loose tiles |
| Kai | Present, listening | Catches conversations, kind eyes, slow breaths |
| Tess | Organized, helpful | Straightens bag, scans boards, instinct to assist |
| Yaquin | Dreamy, artistic | Soft gaze, air-sketching, smiles at nothing |

### Pattern-Aware Events

When player has strong pattern (≥3), 30% chance of pattern-specific observation:

```typescript
const PATTERN_OBSERVATIONS: Record<PatternType, AmbientEvent[]> = {
  exploring: [
    { text: "A corridor you hadn't noticed before catches your eye. Where does it lead?" },
    { text: "Each platform holds different stories. You wonder about the ones you haven't heard yet." }
  ],
  // ... etc
}
```

---

## 2. Joyce's Scrupulous Meanness: Writing Style

> "In writing, I treat them with the scrupulous meanness of a priest giving confession."
> — James Joyce on his characters

### The Principle

Every word must earn its place. Tight, spare, precise. The reader fills in what you don't say.

### Before/After Examples

| Before (48 words) | After (18 words) |
|-------------------|------------------|
| "Discover your interests, skills, and values through play." | "Play. Learn what moves you." |
| "Built on research. Designed by people who do this work." | "Research-backed. Practitioner-built." |
| "What you learn helps the next explorer, and the people working to create opportunity for them." | "What you find lights the way for others." |

### Writing Checklist

- [ ] Can any word be cut without losing meaning?
- [ ] Are there abstract nouns that could be concrete?
- [ ] Is there a simpler word?
- [ ] Does every adjective pull weight?
- [ ] Can the sentence be split for rhythm?

### Sentence Patterns That Work

1. **Short declarative**: "Play. Learn what moves you."
2. **Hyphenated compound**: "Research-backed. Practitioner-built."
3. **Active metaphor**: "What you find lights the way."
4. **Sensory fragment**: "Heels clicking a urgent rhythm."

### What to Cut

- "In order to" → "to"
- "The fact that" → (delete)
- "A lot of" → "many" or (specific number)
- "Very" → (delete or find stronger word)
- "That" → (delete when possible)
- "Just" → (delete)

---

## 3. Rotating Wisdom: Quote System

Inspirational quotes rotate on each page load, selected by theme relevance.

### Architecture

```typescript
const quotes = [
  { text: "Hide not your talents...", author: "Benjamin Franklin" },
  { text: "The only way to do great work...", author: "Steve Jobs" },
  // ...
]

// Random selection on mount (stable within session)
const quote = useMemo(() =>
  quotes[Math.floor(Math.random() * quotes.length)],
[])
```

### Quote Selection Criteria

1. **Theme-aligned**: Self-discovery, potential, authentic work
2. **Action-oriented**: Not passive wisdom, but calls to become
3. **Universal**: No jargon, accessible across cultures
4. **Concise**: Under 30 words
5. **Attributable**: Real source, not "ancient proverb"

### Curated Quote Bank (Self-Discovery Theme)

| Quote | Author | Theme |
|-------|--------|-------|
| "Hide not your talents, they for use were made. What's a sundial in the shade?" | Benjamin Franklin | Use your gifts |
| "The only way to do great work is to love what you do." | Steve Jobs | Passion |
| "Knowing yourself is the beginning of all wisdom." | Aristotle | Self-knowledge |
| "What lies behind us and what lies before us are tiny matters compared to what lies within us." | Ralph Waldo Emerson | Inner strength |
| "The privilege of a lifetime is to become who you truly are." | Carl Jung | Authenticity |
| "Your work is to discover your work and then with all your heart to give yourself to it." | Buddha | Purpose |

### Display Format

```jsx
<p className="text-sm italic text-slate-500">
  {quote.text}
  <span className="block mt-1 not-italic">— {quote.author}</span>
</p>
```

No quotation marks. Let the italic styling signal quotation. The em-dash (—) before author name.

---

## 4. The Reflection Loop: User Control & Pattern Awareness

The game observes the player, then reflects observations back at key moments. This creates a sense of being *seen* without being *judged*.

### Three-Layer Reflection System

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Silent Tracking                           │
│  - Every choice updates pattern counts              │
│  - No UI, no numbers shown                          │
│  - Player unaware of tracking                       │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│  Layer 2: Subtle Sensations (30% chance)            │
│  - Brief feedback after pattern choices             │
│  - Atmospheric, not informational                   │
│  - "Something in you reaches out" (helping)         │
│  - Fades after 3 seconds                            │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│  Layer 3: Character Observations                    │
│  - Samuel's "What do I see in you?" reflections     │
│  - Pattern-gated dialogue nodes                     │
│  - Requires trust ≥3 AND pattern ≥4                 │
│  - Full narrative reflection                        │
└─────────────────────────────────────────────────────┘
```

### Pattern Sensation Text (Layer 2)

Sensations are *felt*, not *told*. They're internal, bodily, intuitive.

```typescript
PATTERN_SENSATIONS: Record<PatternType, string[]> = {
  analytical: [
    "You pause to consider the angles.",
    "Something clicks into place.",
    "The pattern emerges.",
    "Your mind traces the connections.",
  ],
  patience: [
    "You let the moment breathe.",
    "There's no rush. You know that now.",
    "Silence has its own answers.",
    "You wait. The station waits with you.",
  ],
  exploring: [
    "Curiosity pulls at you.",
    "There's more here. You feel it.",
    "Questions beget questions.",
    "The unknown beckons.",
  ],
  helping: [
    "Something in you reaches out.",
    "Connection matters. You know this.",
    "Their story becomes part of yours.",
    "You lean in, listening.",
  ],
  building: [
    "Your hands itch to make it real.",
    "The shape of it forms in your mind.",
    "Creation stirs.",
    "You see what could be.",
  ],
}
```

### Character Observation Text (Layer 3)

Samuel's reflections are specific, evidence-based, and acknowledging:

```typescript
// Analytical pattern (≥4)
"What do I see in you? A mind that dissects problems the way surgeons
approach tissue - methodical, precise, seeking the underlying structure.

You asked Maya about her decision framework before her feelings.
You looked for patterns in her words. That's not cold - that's clarity.

People like you build systems that save lives. The trick is remembering
that the data represents real people."
```

### Key Principles

1. **Observation before judgment** - Describe behavior, then interpret
2. **Specific evidence** - Reference actual choices player made
3. **Both-sides framing** - Gift AND challenge ("empathy is both gift and burden")
4. **Future orientation** - "People like you become..." not "You are..."
5. **Respect autonomy** - "The trick is..." not "You should..."

---

## 5. Completion: The Station Knows You

Journey completion is a celebration, not just an end screen.

### Completion Criteria

```typescript
function isJourneyComplete(gameState): boolean {
  return (
    stats.arcsCompleted >= 2 ||    // Met 2+ characters deeply
    stats.totalChoices >= 20 ||    // Substantial exploration
    globalFlags.has('journey_complete')  // Explicit flag
  )
}
```

### Completion Screen Hierarchy

| State | Headline | Tone |
|-------|----------|------|
| Conversation ends (journey incomplete) | "Conversation Complete" | Neutral, functional |
| Journey truly complete | "The Station Knows You Now" | Celebratory, warm |

### Completion UI

```jsx
{isJourneyComplete(state.gameState) ? (
  <Card className="bg-gradient-to-b from-amber-50 to-white border-amber-200">
    <Compass className="w-10 h-10 mx-auto text-amber-600" />
    <h3>The Station Knows You Now</h3>
    <p className="italic">Your journey through Grand Central Terminus is complete.</p>
    <Button className="bg-amber-600">See Your Journey</Button>
    <Button variant="outline">Continue Exploring</Button>
  </Card>
) : (
  <Card>
    <h3>Conversation Complete</h3>
    <Button variant="outline">Return to Station</Button>
  </Card>
)}
```

---

## 6. Implementation Checklist

When adding new engagement features:

- [ ] Does it serve the contemplative nature? (Not gamification for its own sake)
- [ ] Is it observable, not intrusive? (Show, don't interrupt)
- [ ] Does it respect player agency? (Inform, don't judge)
- [ ] Can it be expressed in 1-2 sentences? (Joyce's meanness)
- [ ] Does it use specific, sensory language? (Concrete > abstract)
- [ ] Is it pattern-aware when appropriate? (Reflect the player back)
- [ ] Does it degrade gracefully? (Works if features fail)

---

## Version History

| Date | Changes |
|------|---------|
| 2025-12-07 | Initial documentation of ambient events, Joyce style, quote system, reflection loop |

---

*"The station is a mirror. It shows you what you're looking for."*
— Design Philosophy
