# Applicable RPG Patterns for Lux Story
## UI/UX-Preserving Enhancements from AAA RPGs

**Source:** Technical Systems Behind RPG Excellence.md (610 lines)
**Philosophy:** Extract backend depth without disrupting our clean, elegant UI/UX

---

## ✅ RECOMMENDED: Backend Enhancements (UI-Neutral)

### 1. Witcher 3's "10 Quest Design Lessons" (Lines 193-209)

**Directly Applicable - No UI Changes Required:**

#### Lesson #1: Master the Plot
> "Facilitate player desire for next story piece through deliberate information absence"

**Application:**
- ✅ Our current design already does this (Samuel's "What brings you here?" mystery)
- Enhancement: End each character arc with **unanswered question** that makes player seek next character

**Example:**
```typescript
// End of Kai arc
"I built the safety simulation. But who builds the simulation for career counselors?
Who trains the trainers?"
// → Plants desire to meet other characters
```

#### Lesson #3: Don't Rush Key Moments
> "Give screen time for emotional beats"

**Application:**
- ✅ Our `useChatPacing: true` already implements this
- Enhancement: Add **pause nodes** (no choices, player must click "Continue") for critical revelations

**Example:**
```typescript
{
  nodeId: 'maya_burnout_reveal',
  speaker: 'Maya',
  content: `*Maya stares at the ceiling for a long time.*`,
  choices: [{
    text: '...', // Silent continuation
    nextNodeId: 'maya_burnout_continues'
  }],
  // NO other choices - forces pause
}
```

#### Lesson #4: Be Succinct
> "Remove repeated information and busywork"

**CRITICAL FOR US:**
- ❌ Never repeat what player already knows
- ❌ Never make player click through obvious transitions
- ✅ Skip to emotional core immediately

**Audit Task:** Search all dialogue for repeated information (e.g., mentioning same backstory twice)

#### Lesson #5: Signal vs Noise
> "Deliver important info in focused moments; casual info during movement"

**Application:**
- Important: Character vulnerabilities, failure states, career decisions
- Casual: Worldbuilding details (Birmingham Station layout, coffee preferences)
- **Our implementation:** Put worldbuilding in cross-references, not primary arcs

#### Lesson #7: Anticipate Player Inclination
> "Provide choices players naturally want to make"

**Application:**
- ✅ Our pattern system (analytical/helping/building) does this
- Enhancement: If 90%+ of players choose Option A, that's not a choice—it's forced content
- **Analytics Task:** Track choice distributions, remove choices with <5% selection rate

---

### 2. Mass Effect's Dialogue Wheel Positioning Consistency (Lines 216-230)

**The Core Innovation:**
> "By assigning specific control inputs to specific classes of response, always using the same slot for the same type of response, a player can learn to instinctively respond."

**Our Current UI:** Vertical list (not radial wheel)

**Applicable Concept - Consistent Positioning:**
```typescript
// ALWAYS present choices in same order:
// 1. Analytical pattern (top)
// 2. Helping pattern (middle)
// 3. Building pattern (bottom)
// 4. Exploring/Patience patterns (after primary 3)

// Current implementation mixes order randomly
// Enhancement: Sort by pattern type for muscle memory
```

**Code Enhancement:**
```typescript
// components/GameChoices.tsx
const PATTERN_ORDER = ['analytical', 'helping', 'building', 'exploring', 'patience']

function sortChoicesByPattern(choices: Choice[]): Choice[] {
  return choices.sort((a, b) => {
    const indexA = PATTERN_ORDER.indexOf(a.pattern)
    const indexB = PATTERN_ORDER.indexOf(b.pattern)
    return indexA - indexB
  })
}
```

**UI Impact:** ZERO (still vertical list, just consistent order)
**UX Impact:** Players learn muscle memory (top = logic, middle = empathy, bottom = action)

---

### 3. Fallout: New Vegas Deterministic Skill Checks (Lines 341-348)

**The Innovation:**
> "Fallout 3 used probability-based (RNG) checks. New Vegas uses score-based deterministic checks—meet threshold or don't."

**Our Current System:** No skill checks in choices (all narrative-only)

**Applicable Enhancement:**
```typescript
// Show skill-gated choices ONLY if player demonstrated skill

{
  choiceId: 'marcus_technical_insight',
  text: '[Critical Thinking] The ECMO failure was a feedback loop, not component failure',
  nextNodeId: 'marcus_impressed',
  pattern: 'analytical',
  visibleCondition: {
    // Only show if player demonstrated critical thinking in 2+ prior scenes
    minSkillLevel: {
      skillId: 'criticalThinking',
      demonstrations: 2
    }
  }
}
```

**UI Impact:** Some players see 2 choices, others see 3 (like Disco Elysium's stat checks)
**Benefit:** Choices feel earned, not arbitrary
**Implementation:** Phase 3, Sprint 3.1 (skill-gated choice visibility)

---

### 4. Disco Elysium's "Thought Cabinet" Time-Gating (Lines 99-105)

**The System:**
> "Two-phase: Research (temporary modifiers, often negative) and Completion (permanent effects after in-game hours elapse)"

**Our Context:** No in-game time system

**Applicable Concept - Delayed Processing:**
```typescript
// Player makes a heavy choice in Devon arc
onEnter: [{
  addGlobalFlags: ['devon_grief_confrontation_processing']
}]

// Later, in Samuel reflection:
{
  nodeId: 'samuel_devon_reflection',
  speaker: 'Samuel',
  content: `*Samuel notices you staring at the wall*

  "Still thinking about Devon?"

  // This only appears if player gave themselves "processing time"
  visibleCondition: {
    hasGlobalFlags: ['devon_grief_confrontation_processing'],
    // AND player has completed at least one other arc (time passed)
    minCompletedArcs: 1
  }
}
```

**UI Impact:** ZERO
**UX Impact:** Heavy emotional moments "digest" before resolution (feels more authentic)

---

### 5. Witcher 3's Facts Database Documentation Strategy (Lines 149-151)

**The Problem:**
> "We do not possess any miraculous system solution to the problem of designers getting lost in that 'web'—we maintain control by using good pipelines, organizing our work properly, and keeping our documentation up-to-date."

**Our Implementation:**
```markdown
# docs/FLAG_REGISTRY.md (NEW FILE)

## Global Flags Master List

### Character Arc Completion Flags
- `marcus_arc_complete` - Set when: Marcus ECMO simulation finished
- `kai_arc_complete` - Set when: Kai safety simulation resolved (good or bad)
- `devon_arc_complete` - Set when: Devon emotional logic synthesis reached

### Failure State Flags (Gate Optimal Endings)
- `kai_chose_safety` - Set when: Player chose compliance over courage in sim
  - **Blocks:** `kai_studio_launch` (optimal ending)
  - **Enables:** `kai_corporate_safety_consultant` (suboptimal ending)

### Cross-Reference Flags (Enable Callbacks)
- `marcus_kai_coffee_argument` - Set when: Marcus mentions Kai in cross-reference
  - **Enables:** Kai's reciprocal mention of Marcus
  - **Worldbuilding:** They argued about ECMO training module design
```

**UI Impact:** ZERO (documentation only)
**Benefit:** Prevents flag naming conflicts, enables systematic testing

---

## ❌ NOT RECOMMENDED: UI-Invasive Patterns

### 1. Mass Effect's Paraphrase System (Lines 226-227)
**Pattern:** Show short paraphrase ("Don't study me") → Shepard speaks full line

**Why Skip:**
- ✅ Our current UI shows **full choice text** (player knows exactly what they're saying)
- ❌ Paraphrasing creates "Shepard says what?" moments (player disconnect)
- **Decision:** Keep current system (full text transparency)

### 2. Disco Elysium's 24 Skill Voices (Lines 69-77)
**Pattern:** Skills interject as "characters" with personality

**Why Skip:**
- ✅ Our current design: **Single narrator voice** (clean, focused)
- ❌ Multiple voices would clutter our elegant text-only UI
- ❌ Requires voice/personality for 12 WEF skills (massive scope)
- **Decision:** Keep current single-voice narration

### 3. BG3's Initiative/Turn-Based Systems (Lines 27-28)
**Pattern:** Side initiative, combat mechanics

**Why Skip:**
- ✅ Our game is **pure narrative** (no combat)
- ❌ Turn-based would slow conversational flow
- **Decision:** Stay narrative-focused

---

## 📋 Implementation Priority

### Phase 2 (Weeks 3-4) - Narrative Depth
- [x] Witcher 3 Delayed Consequences (already in plan)
- [x] Disco Elysium Micro-reactivity (already in plan)
- [ ] **NEW:** Mass Effect Consistent Choice Positioning (sortChoicesByPattern)
- [ ] **NEW:** Fallout NV Skill-Gated Choices (visible only if skill demonstrated)
- [ ] **NEW:** Witcher 3 Quest Lessons #4 (audit for repeated information)

### Phase 3 (Weeks 5-6) - Technical Polish
- [ ] **NEW:** Thought Cabinet Delayed Processing (heavy moments digest over time)
- [ ] **NEW:** Witcher 3 Pause Nodes (force reflection on critical moments)
- [ ] **NEW:** Mass Effect Choice Analytics (track selection rates, remove <5% choices)

### Documentation (Ongoing)
- [ ] **NEW:** FLAG_REGISTRY.md (Witcher 3 documentation strategy)
- [ ] **NEW:** CHOICE_ANALYTICS.md (track player choice distributions)

---

## 🎯 Strategic Summary

**Patterns We're Adopting:**
1. ✅ Delayed consequences (Witcher 3) - Already in plan
2. ✅ Micro-reactivity tagging (Disco Elysium) - Already in plan
3. ✅ Consistent choice positioning (Mass Effect) - **NEW**
4. ✅ Skill-gated choice visibility (Fallout NV) - **NEW**
5. ✅ Pause nodes for emotional beats (Witcher 3) - **NEW**
6. ✅ Documentation-heavy flag management (Witcher 3) - **NEW**

**Patterns We're Skipping (UI Preservation):**
1. ❌ Paraphrased choices (Mass Effect) - We prefer full transparency
2. ❌ Multi-voice skill system (Disco Elysium) - We prefer single narrator
3. ❌ Combat/turn-based mechanics (BG3) - Pure narrative focus
4. ❌ Radial wheel UI (Mass Effect) - Our vertical list is cleaner

**Philosophy:**
> **Steal backend depth without disrupting frontend elegance.**

Our clean, fade-only UI with stable containers is a **strength**. We enhance depth through:
- Smarter flag systems (backend)
- Skill-gated visibility (backend logic)
- Consistent positioning (reordering, not redesigning)
- Better documentation (developer-facing)

**Zero visual redesigns required.** All enhancements work within current UI framework.

---

**Generated:** November 22, 2025
**Source:** Technical Systems Behind RPG Excellence.md
**Philosophy:** Backend sophistication, frontend elegance
