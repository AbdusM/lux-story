# Discovery-Based Character Routing System

## Philosophy

**The user is at the center of control without knowing it.**

Instead of presenting a menu ("Choose Character A, B, or C"), Samuel asks conversational questions that reveal what the player cares about. The system then naturally introduces the character whose story aligns with those values.

This creates:
- **Implicit agency** - Players make meaningful choices without feeling "gameified"
- **Natural discovery** - Characters emerge organically from conversation
- **Personalized experience** - Each playthrough feels tailored to the player
- **Reduced decision paralysis** - No overwhelming menus, just dialogue

## How It Works

### Step 1: Samuel's Opening Question
```
"When you think about the decision in front of you - 
whatever brought you to this station - what pulls at you most?"
```

Four response options, each revealing a different value:
- **"Wanting to help people..."** → `helping` pattern → Routes to Maya
- **"I like solving problems logically..."** → `building` pattern → Routes to Devon  
- **"I've tried different things..."** → `exploring` pattern → Routes to Jordan
- **"I'm not sure yet..."** → `patience` pattern → Fallback with all options

### Step 2: Natural Introduction

Samuel doesn't say "You chose helping, so here's Character A." Instead:

> "That's a particular kind of struggle. When your heart knows what it wants but the path there feels... complicated.
> 
> There's someone on Platform 1 tonight who understands that tension. Maya Chen..."

The character introduction feels like Samuel **reading the player** and making a thoughtful recommendation.

### Step 3: Maintained Agency

Every routing path includes:
```
"Who else is here tonight?" → samuel_other_travelers
```

Players who want to explore other characters can always redirect. They never feel locked in.

## Character Routing Map

```
samuel_hub_initial
├── "Wanting to help..." → samuel_discovers_helping → Maya Chen
├── "Solving problems logically..." → samuel_discovers_building → Devon Kumar
├── "Tried different things..." → samuel_discovers_exploring → Jordan Packard
└── "Not sure yet..." → samuel_hub_fallback → [Maya / Devon / Jordan choice]
```

### Escape Hatch: `samuel_other_travelers`

Any discovery path can redirect to this node, which provides a full overview:

> "Let me paint the full picture:
> - Maya Chen - Platform 1 - [one-line summary]
> - Devon Kumar - Platform 3 - [one-line summary]
> - Jordan Packard - Conference Room B - [one-line summary]
> 
> Who do you want to meet first?"

## Character Alignments

### Maya Chen → `helping` pattern
- **Conflict**: Parents' medical dreams vs. robotics passion
- **Crossroads**: What "helping people" actually means to her
- **Platform**: 1 (The Care Line)
- **Player resonance**: Career expectations, family pressure, purpose

### Devon Kumar → `building` pattern
- **Conflict**: Built a decision tree to help grieving father, failed catastrophically
- **Crossroads**: Can empathy be systematized, or is logic not enough?
- **Platform**: 3 (The Builder's Track)
- **Player resonance**: Logic-first thinking, systems approaching emotional problems

### Jordan Packard → `exploring` pattern
- **Conflict**: Seven jobs, impostor syndrome while mentoring bootcamp students
- **Crossroads**: Is my non-linear path chaos or adaptability?
- **Location**: Conference Room B (Innovation Depot)
- **Player resonance**: Multiple careers, uncertainty about direction, self-doubt

## Technical Implementation

### Pattern Tracking Integration
The system leverages existing pattern tracking:
- Each choice tags a pattern (`helping`, `building`, `exploring`, `patience`)
- Patterns accumulate and influence future dialogue visibility
- No additional tracking needed - uses existing infrastructure

### Knowledge Flags
Samuel gains knowledge about player values:
```typescript
consequence: {
  characterId: 'samuel',
  addKnowledgeFlags: ['player_values_helping']
}
```

Future conversations can reference this:
```typescript
requiredState: {
  hasKnowledgeFlags: ['player_values_helping']
}
```

### Global Flags for Character Meetings
```typescript
addGlobalFlags: ['met_maya', 'met_devon', 'met_jordan']
```

Used to:
- Track which characters have been encountered
- Prevent re-introductions
- Enable reflection dialogues after character arcs

## Why This Works Better

### Old System: Direct Menu
```
Samuel: "Three travelers are here. Who do you want to meet?"
[A] Maya Chen - Pre-med student
[B] Devon Kumar - Engineer
[C] Jordan Packard - Multi-career professional
```

**Problems:**
- Feels like a game menu, breaks immersion
- No context for decision
- Player has no idea who resonates
- Decision paralysis (all options equal)

### New System: Discovery-Based
```
Samuel: "What pulls at you most about your crossroads?"
Player: [Reveals their values through choice]
Samuel: "Ah. There's someone who understands that..." [Introduces aligned character]
```

**Benefits:**
- Conversational, maintains narrative flow
- Player reveals themselves naturally
- Samuel feels perceptive and wise
- Character introduction is personalized
- Still maintains full agency via "ask about others"

## User Testing Insights

### Expected Player Behaviors

1. **Direct route** (~60% estimated)
   - Answer honestly → Meet suggested character → Engage with arc

2. **Curious explorer** (~30% estimated)
   - Answer question → "Who else is here?" → Review all → Choose

3. **Uncertain player** (~10% estimated)
   - "I'm not sure" → Fallback with full context → Choose

All three paths feel natural and unforced.

### Replayability

Different opening answers lead to different first characters:
- First playthrough: Help-focused → Meets Maya
- Second playthrough: Logic-focused → Meets Devon
- Third playthrough: Exploration-focused → Meets Jordan

Each playthrough starts with a different narrative tone and career domain.

## Future Enhancements

### Dynamic Descriptions (Phase 2)
Samuel's character descriptions could vary based on player's tracked patterns:

```typescript
// If player has high analytical pattern:
"Maya Chen - brilliant pre-med student with a 3.9 GPA who's optimizing 
for the wrong variable"

// If player has high helping pattern:
"Maya Chen - someone who genuinely wants to help people but isn't sure 
the path she's on actually will"
```

### Emotional State Integration (Phase 3)
Use `emotionalState` tracking to adjust Samuel's tone:

```typescript
// If player.stressLevel === 'high':
Samuel: "Take a breath. This decision doesn't have to be made right now."

// If player.flowState === 'flow':
Samuel: "You seem ready. Let me tell you about..."
```

### Multi-Visit Memory (Phase 4)
After meeting one character, Samuel remembers:

```typescript
Samuel: "You spent time with Maya. Her story about family expectations - 
did that resonate? Want to meet someone facing a different kind of crossroads?"
```

## Code Locations

- **Implementation**: `/content/samuel-dialogue-graph.ts` lines 246-476
- **Node IDs**:
  - `samuel_hub_initial` - Opening question
  - `samuel_discovers_helping` - Routes to Maya
  - `samuel_discovers_building` - Routes to Devon
  - `samuel_discovers_exploring` - Routes to Jordan
  - `samuel_hub_fallback` - Unsure path
  - `samuel_other_travelers` - Full overview

## Design Principles Demonstrated

1. **Respect player intelligence** - Don't explain the system, just make it feel right
2. **Implicit > Explicit** - Choices reveal values rather than declaring them
3. **Always maintain agency** - "Who else is here?" is always available
4. **Characters emerge from context** - Never introduced cold
5. **Samuel as guide, not gatekeeper** - He facilitates discovery, doesn't block access

---

**Result**: Players feel like Samuel "gets them" and introduced the perfect person to talk to - when in reality, they revealed who they needed to meet through their own choices.

That's putting the user at the center of control without them knowing it.

