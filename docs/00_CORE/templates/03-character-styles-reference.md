# Character Styles Reference

## Complete Character Roster (20 Characters)

### Core Characters

| Character | Animal | Role | Typing Style | Personality |
|-----------|--------|------|--------------|-------------|
| **Samuel** | Owl | Station Keeper / Wise Mentor | Deliberate (1000ms) | Comfortable with silence, takes time |
| **Maya** | Cat | Tech Innovator | Restless (500ms) | Quick, sharp, impatient energy |
| **Marcus** | Bear | Medical Tech / Healthcare | Measured (900ms) | Practical, steady, careful |
| **Kai** | — | Safety Specialist | Thoughtful (850ms) | Present, contemplative pauses |
| **Rohan** | Raven | Deep Tech / Introspective | Direct (600ms) | Confident, minimal hesitation |

### Secondary Characters

| Character | Animal | Role | Typing Style | Personality |
|-----------|--------|------|--------------|-------------|
| **Devon** | Deer | Systems Thinker / Engineering | Precise (700ms) | Analytical, consistent rhythm |
| **Tess** | Fox | Education Founder | Efficient (550ms) | Organized, crisp, no wasted time |
| **Yaquin** | Rabbit | EdTech Creator | Dreamy (800ms) | Artistic, variable, unpredictable |
| **Grace** | — | Healthcare Operations | Gentle (900ms) | Patient, unhurried caregiver |
| **Elena** | — | Information Science / Archivist | Practical (650ms) | No-nonsense but warm |
| **Alex** | Rat | Supply Chain & Logistics | Practical (550ms) | Quick, efficient energy |
| **Jordan** | — | Career Navigator | Casual (600ms) | Friendly, easy flowing |
| **Quinn** | Hedgehog | Finance Specialist | Measured (750ms) | Intentional, deliberate |
| **Nadia** | Barn Owl | AI Strategist | Clear (600ms) | Precise, thoughtful |

### Extended Characters

| Character | Animal | Role | Typing Style | Personality |
|-----------|--------|------|--------------|-------------|
| **Silas** | — | Advanced Manufacturing | Weighted (950ms) | Mysterious, intentional |
| **Asha** | — | Conflict Resolution / Mediator | Calm (850ms) | Measured, thoughtful |
| **Lira** | — | Communications / Sound Design | Musical (700ms) | Flowing, rhythmic |
| **Zara** | — | Data Ethics / Artist | Artistic (750ms) | Deliberate but creative |
| **Dante** | Peacock | Sales Strategist | Energetic (450ms) | Charming, controlled energy |
| **Isaiah** | Elephant | Nonprofit Leader | Storyteller (850ms) | Slow, story-paced |

---

## Dialogue Depth by Character

| Character | Dialogue Nodes | Tier | Coverage Level |
|-----------|----------------|------|----------------|
| Samuel | 217 | Hub | Deep (Hub character) |
| Maya | 87 | Core | Deep |
| Elena | 87 | Secondary | Deep |
| Devon | 87 | Secondary | Deep |
| Zara | 83 | Extended | Deep |
| Quinn | 82 | Secondary | Deep |
| Marcus | 82 | Core | Deep |
| Lira | 75 | Extended | Deep |
| Rohan | 62 | Core | Standard |
| Nadia | 62 | Secondary | Standard |
| Isaiah | 61 | Extended | Standard |
| Kai | 56 | Core | Standard |
| Asha | 54 | Extended | Standard |
| Tess | 53 | Secondary | Standard |
| Alex | 52 | Secondary | Standard |
| Dante | 50 | Extended | Standard |
| Yaquin | 46 | Secondary | Core |
| Silas | 46 | Extended | Core |
| Jordan | 45 | Secondary | Core |
| Grace | 44 | Secondary | Core |

**Total: 1,431 dialogue nodes across 20 characters**

---

## Typing Configuration Details

Each character has distinct timing parameters that create their unique "voice":

```
┌─────────────┬──────────────┬─────────────┬──────────────┐
│ Parameter   │ Fast (Maya)  │ Medium      │ Slow (Samuel)│
├─────────────┼──────────────┼─────────────┼──────────────┤
│ typingDur   │ 500ms        │ 700ms       │ 1000ms       │
│ minChunk    │ 200ms        │ 300ms       │ 400ms        │
│ msPerChar   │ 4ms          │ 5ms         │ 8ms          │
│ maxChunk    │ 1000ms       │ 1200ms      │ 2000ms       │
└─────────────┴──────────────┴─────────────┴──────────────┘
```

### Speed Categories

**Fast Characters** (energetic, restless):
- Maya, Tess, Alex, Dante

**Medium Characters** (balanced, precise):
- Devon, Jordan, Rohan, Elena, Lira, Nadia

**Slow Characters** (deliberate, thoughtful):
- Samuel, Marcus, Kai, Silas, Grace, Asha, Yaquin, Quinn, Isaiah

---

## Voice Variation System

Each character has 5 voice variations matching the player's dominant pattern:

| Pattern | Description | Example Voice Shift |
|---------|-------------|---------------------|
| **Analytical** | Logic-driven | "The data suggests..." |
| **Patience** | Careful consideration | "Take your time to consider..." |
| **Exploring** | Curiosity-oriented | "I wonder what would happen if..." |
| **Helping** | Empathy-focused | "How does that make you feel?" |
| **Building** | Creation-focused | "We could build something that..." |

**Total voice variations: 178 across all characters**

---

## Character Relationships Web

Characters reference each other creating an interconnected world:

```
         Samuel (Hub)
            │
    ┌───────┼───────┐
    │       │       │
   Maya ── Marcus ── Devon
    │       │       │
   Kai ─── Rohan ── Tess
    │               │
  Quinn ────────── Nadia
    │
  Dante ── Isaiah ── Asha
```

**Key relationship dynamics:**
- Samuel → All (mentor figure, hub connector)
- Maya ↔ Marcus (tech vs healthcare tension)
- Quinn ↔ Nadia (finance meets AI ethics)
- Dante ↔ Isaiah (sales vs mission-driven)

---

## Animal Symbolism

| Animal | Character | Symbolism |
|--------|-----------|-----------|
| Owl | Samuel | Wisdom, seeing in darkness |
| Cat | Maya | Independence, curiosity |
| Bear | Marcus | Strength, protection |
| Raven | Rohan | Intelligence, mystery |
| Deer | Devon | Gentleness, awareness |
| Fox | Tess | Cleverness, adaptability |
| Rabbit | Yaquin | Creativity, quick thinking |
| Rat | Alex | Resourcefulness, survival |
| Hedgehog | Quinn | Protection, careful approach |
| Peacock | Dante | Confidence, display |
| Barn Owl | Nadia | Silent wisdom, ethics |
| Elephant | Isaiah | Memory, community, legacy |

---

*Last updated: January 2026*
