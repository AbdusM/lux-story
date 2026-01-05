# Dialogue & Character Development Best Practices for LUX-STORY

## Compiled from 20_LUX-STORIES Research + BG3 Analysis

This document synthesizes insights from the LUX Chronicles research materials and integrates them with the IMMERSION_ENHANCEMENT_PLAN.md to create actionable guidelines for Grand Central Terminus dialogue and character development.

---

## 1. SHOW-DON'T-TELL FOR INTERACTIVE FICTION

### Core Principle
Instead of TELLING the player about emotions or character traits, SHOW them through:
- Character micro-actions and reactions
- Sensory details in narrative text
- Dialogue that reveals rather than explains
- Environmental interactions
- Internal physical sensations

### Application to lux-story

**Current Pattern (Telling):**
```
"Maya seems nervous about sharing this."
```

**Enhanced Pattern (Showing):**
```
Maya's fingers trace the edge of the counter, back and forth.
"It's just... there's this thing I haven't told anyone."
*Her eyes flick to the door, then back to you.*
```

### Implementation Guidelines

1. **Emotion Through Body Language**: Every significant emotional beat should include a physical tell
   - Trust up: "Something in Maya's posture relaxes."
   - Trust down: "Devon's eyes flicker away for a moment."
   - Curiosity: "Kai tilts their head, studying you with new interest."

2. **The Five Senses Rule**: Every emotional state should engage at least two senses
   - Visual + Auditory: "The station hums differently here. Warmer."
   - Tactile + Visual: "Cold metal bench. She's been sitting here a while."

3. **Environment as Mirror**: Let the setting reflect character states
   - Character anxious? "The fluorescent light above flickers, just slightly."
   - Character opening up? "Afternoon light spills through the window, catching dust motes."

---

## 2. DISTINCTIVE CHARACTER VOICES

### Speech Pattern Framework

Each character should have:
1. **Signature Pacing** - How fast/slow they speak
2. **Vocabulary Domain** - What words they default to
3. **Sentence Structure** - Long/short, questions/statements
4. **Verbal Tics** - Repeated phrases (1-2 max)
5. **Cultural References** - What they relate things to

### lux-story Character Voice Guide

**Samuel (Mentor)**
- Pacing: Measured, with thoughtful pauses
- Vocabulary: Observational, nature metaphors, station history
- Structure: Often begins with observations before conclusions
- Tic: "The station remembers..."
- Sample: "The thing about waiting... it teaches you what matters. Watch people long enough, you see their whole story in how they walk."

**Maya (Artist/Seeker)**
- Pacing: Variable - fast when excited, slow when uncertain
- Vocabulary: Creative, visual metaphors, emotional language
- Structure: Often trails off, restarts
- Tic: "It's like..." (searching for metaphor)
- Sample: "It's like... you know when you're painting and suddenly it's not what you planned but it's *right*? That. But with my whole life."

**Devon (Analyst)**
- Pacing: Rapid when explaining, abrupt pauses to think
- Vocabulary: Technical, systematic, efficiency-focused
- Structure: Declarative statements, precise qualifiers
- Tic: "Technically speaking..."
- Sample: "Technically speaking, the probability of running into you here was negligible. Which makes this either statistically fascinating or—" *pause* "—meaningful."

**Jordan (Guide)**
- Pacing: Relaxed, unhurried
- Vocabulary: Philosophical, direction/journey metaphors
- Structure: Questions more than statements
- Tic: "What if..."
- Sample: "What if getting lost is the only way to find where you actually need to be? I know that sounds like fortune cookie wisdom, but—stay here long enough, you'll see what I mean."

**Marcus (Builder)**
- Pacing: Steady, workman-like
- Vocabulary: Concrete, physical, practical
- Structure: Short, direct sentences
- Tic: "The thing is..."
- Sample: "The thing is, you can plan all you want. But sometimes you just have to start building and trust the structure will hold."

**Kai (Connector)**
- Pacing: Warm, inclusive rhythms
- Vocabulary: Relationship-focused, community terms
- Structure: Often references others, brings people in
- Tic: "Between us..."
- Sample: "Between us, I think everyone here is looking for the same thing. Connection. They just have different words for it."

**Tess (Strategist)**
- Pacing: Crisp, no wasted words
- Vocabulary: Strategic, game/competition terms
- Structure: Cause-and-effect, if-then
- Tic: "Here's the play..."
- Sample: "Here's the play: you've got maybe two options that matter. Everything else is noise. Which risk are you willing to take?"

**Yaquin (Dreamer)**
- Pacing: Flowing, almost musical
- Vocabulary: Abstract, possibility-focused, imaginative
- Structure: Long, winding sentences that circle back
- Tic: "Imagine..."
- Sample: "Imagine if every station was a story, and every traveler was a character in everyone else's narrative without knowing it—that's what I think about, waiting for trains."

---

## 3. DIALOGUE MECHANICS FOR IMMERSION

### Strip Extras First

From DIALOGUE_WRITING_GUIDE_MG:
> "When revising dialogue, strip back everything. Remove tags, adverbs, action beats. Let the dialogue stand alone. If it doesn't convey character and emotion unaided, strengthen the words themselves before adding anything back."

**Current Pattern:**
```
"I understand," Maya said sympathetically, nodding her head slowly. "That must be really hard for you."
```

**Enhanced Pattern:**
```
"That must be heavy to carry."
*Maya's hand moves toward yours, stops halfway.*
```

### Subtext System Integration

From BG3 research: "Characters often say one thing while meaning another."

**Implementation:**
```typescript
interface SubtextChoice {
  surfaceText: string      // What appears on button
  subtextReveal: string    // What shows after selection (italic, softer)
  alignment: 'authentic' | 'protective' | 'deflecting' | 'discovering'
}
```

**Example:**
```
// Surface choice
"That's a nice story."

// After selection, reveal subtext
"That's a nice story."
*You know it's not the whole truth. But you let it stand.*
```

### Action Beats to Replace Tags

Instead of dialogue tags (he said, she replied), use action beats that reveal character:

**Before:**
```
"I don't know," she said uncertainly.
```

**After:**
```
"I don't know." Her coffee had gone cold twenty minutes ago. She was still holding it.
```

---

## 4. PLAYER-CENTRIC DIALOGUE (FROM IMMERSION_ENHANCEMENT_PLAN)

### Voice Variations Based on Player Pattern

The player's dominant pattern should subtly shift their dialogue options:

**Base Choice:** "Tell me more about that."

**Pattern Variations:**
- analytical: "Walk me through the details."
- patience: "Take your time. I'm listening."
- exploring: "I've never heard about this. What's the story?"
- helping: "That sounds hard. What happened?"
- building: "How did you make that work?"

### Pattern-Reflective NPC Responses

NPCs should acknowledge the player's emerging patterns:

**Base Samuel Response:**
"That's an interesting perspective."

**If player.patterns.analytical >= 5:**
"You think things through, don't you? I can see it in how you frame questions."

**If player.patterns.helping >= 5:**
"You lead with care. That's not something you can fake."

### Skill-Enhanced Choices (Non-Gating)

From IMMERSION_ENHANCEMENT_PLAN: Demonstrated skills unlock ADDITIONAL choices without removing base options.

**Base choices:**
1. "That sounds complicated."
2. "What happened next?"

**Enhanced choice (requires 'emotionalIntelligence' 4+ demonstrations):**
3. "There's something you're not saying. And that's okay."
   → Opens deeper dialogue branch, +1 bonus trust

---

## 5. CONSEQUENCE ECHOES (NARRATIVE FEEDBACK)

### Replace Silent State Changes with Micro-Reactions

**Current (Silent):**
```
// Trust increases by 1
// No visible feedback
```

**Enhanced (Echo):**
```
// Trust increases by 1
// Narrative feedback appears:
Samuel's expression softens almost imperceptibly.
```

### Echo Templates by Type

**Trust Up (Subtle):**
- "[Character] nods slowly."
- "Something shifts in their posture."
- "The corner of their mouth twitches—almost a smile."

**Trust Up (Noticeable):**
- "Something in [Character]'s posture relaxes."
- "[Character] looks at you differently now. More open."
- "For a moment, [Character]'s guard drops completely."

**Trust Down (Subtle):**
- "[Character]'s eyes flicker away for a moment."
- "A pause. Just slightly too long."
- "[Character] shifts their weight back."

**Pattern Recognition (by NPC):**
- "Kai tilts their head, studying you with new interest."
- "'You notice things,' Maya says. 'That's rare.'"
- "Samuel watches you. 'You've done this before, haven't you?'"

---

## 6. PIXAR STORYTELLING INTEGRATION

### Want vs. Need for NPCs AND Player

From PIXAR_INSIGHTS_FOR_LUX: "Clarify superficial desires (Want) vs deeper emotional needs (Need)."

**Applied to Player Choices:**

| Surface (Want) | Deeper (Need) |
|---------------|---------------|
| "I want to help Devon" | Need to feel useful/valued |
| "I want to understand Samuel's past" | Need for mentorship/guidance |
| "I want Maya to trust me" | Need for authentic connection |

**Implemented as Layered Choices:**
```
// Choice shown
"I left because the job was fine. Just... fine."

// After selection, player's inner thought appears
*You don't mention the part where "fine" started to feel like a kind of dying.*
```

### Emotional Engineering Beats

1. **Breathing Moments**: Include quiet reflection between action
   - Post-conversation pauses
   - Station atmosphere descriptions
   - Player internal thoughts

2. **Tears Moments**: Identify where genuine emotion can surface
   - Character vulnerability reveals
   - Player self-recognition moments
   - Relationship milestone beats

3. **Gaps for Players**: Don't over-explain
   - Let implications land
   - Trust player to understand subtext
   - Leave room for interpretation

---

## 7. CHARACTER ARC TEMPLATES

### The Aliens Marine Squad Approach

From YOUTH_BRIGADE_CHARACTER_DEVELOPMENT_SHEETS:
> "Ensemble character development using the Aliens (1986) Marine squad approach: each member gets 1-2 iconic moments and distinct visual/verbal signatures."

**Applied to lux-story:**

| Character | Visual Signature | Verbal Signature | Hero Moment |
|-----------|-----------------|------------------|-------------|
| Samuel | Worn bench, specific seat | "The station remembers..." | Sharing his own transition story |
| Maya | Sketchbook, coffee stains | "It's like..." | Creating art that captures the player |
| Devon | Data sheets, precise movements | "Technically speaking..." | Admitting emotions beyond analysis |
| Jordan | Map collection, open posture | "What if..." | Guiding through a crucial choice |
| Marcus | Tool in pocket, steady hands | "The thing is..." | Building something for the player |
| Kai | Connecting gestures | "Between us..." | Introducing player to community |
| Tess | Strategic positioning | "Here's the play..." | Revealing vulnerability behind strategy |
| Yaquin | Dreamy gaze, window seats | "Imagine..." | Sharing a vision that includes player |

---

## 8. IMPLEMENTATION PRIORITIES

### Phase 1: Quick Wins (Integrate with existing content)
1. Add consequence echoes to all trust changes
2. Create character reaction library (10-15 per character)
3. Implement voice variation for top 3 patterns

### Phase 2: Depth Enhancement
4. Add skill-enhanced choice branches (2-3 per character)
5. Implement subtext reveals for key choices
6. Create reflection gateways at arc transitions

### Phase 3: Full Integration
7. Pattern-reflective NPC responses throughout
8. Layered choices (want vs need) for major decisions
9. Complete character voice differentiation pass

---

## 9. QUALITY CHECKLIST

Before any dialogue is complete, verify:

- [ ] **Distinctive Voice**: Could you identify the speaker without a name tag?
- [ ] **Show Don't Tell**: Are emotions conveyed through action, not narration?
- [ ] **Subtext Present**: Is there meaning beyond the surface words?
- [ ] **Physical Anchoring**: Does dialogue connect to physical reality?
- [ ] **Pattern Opportunity**: Does this choice reveal something about the player?
- [ ] **Consequence Echo**: Is there narrative feedback for state changes?
- [ ] **Player Agency**: Is the player the subject, not just observer?

---

## 10. KEY PRINCIPLES SUMMARY

1. **Let dialogue do the work** - Strip extras, trust the words
2. **Each character = distinct voice** - Pacing, vocabulary, structure
3. **Player becomes subject** - NPCs reflect who player IS
4. **Show, never tell** - Emotions live in body, not narrator
5. **Subtext creates intimacy** - Surface + depth = connection
6. **Echoes over notifications** - Narrative feedback, not stats
7. **Non-gating enhancement** - Reward skill without punishment
8. **Breathing room** - Quiet moments between action
9. **Trust the reader** - Leave gaps for interpretation
10. **Voice evolution** - Characters (and player) grow through dialogue

---

## Sources

- `20_LUX-STORIES/Show_Dont_Tell_Sensory_Guides/DIALOGUE_WRITING_GUIDE_MG.md`
- `20_LUX-STORIES/Show_Dont_Tell_Sensory_Guides/SHOW_DONT_TELL_CONVERSION_GUIDE.md`
- `20_LUX-STORIES/Show_Dont_Tell_Sensory_Guides/YOUTH_BRIGADE_CHARACTER_DEVELOPMENT_SHEETS.md`
- `20_LUX-STORIES/Pixar_Analysis_Complete/PIXAR_STORYTELLING_PATTERNS_SUMMARY.md`
- `20_LUX-STORIES/Pixar_Analysis_Complete/PIXAR_INSIGHTS_FOR_LUX.md`
- `20_LUX-STORIES/ANALYSIS_DOCS/Character Voice Guide_ Distinctive Speech Patterns.md`
- `20_LUX-STORIES/ANALYSIS_DOCS/luxyz_core narrative elements.md`
- `Development/baldur gate.md` (BG3 emotional storytelling analysis)
- `docs/IMMERSION_ENHANCEMENT_PLAN.md` (player-centric design)
