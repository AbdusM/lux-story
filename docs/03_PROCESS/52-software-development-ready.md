# Software Development Ready - January 6, 2026

## Executive Summary

This document consolidates all planning and design work into actionable development tasks. All features below follow the **Invisible Depth Principle**: backend can be infinitely sophisticated while frontend stays pure dialogue.

## Core Principle

```
UNSAFE: New System → New UI → Player Learns → Cognitive Load
SAFE:   Backend Tracks → Dialogue Changes → Player Experiences Naturally
```

---

## Phase 1: Immediate Implementation (This Sprint)

### 1.1 Silent Pattern Combos
**Location:** `lib/pattern-combos.ts` (new file)

```typescript
interface PatternCombo {
  id: string;
  requirements: Partial<Record<PatternType, number>>;
  careerHint: string;
  characterId: CharacterId;
  triggerNodeId: string;
}
```

**Tasks:**
- [ ] Create `lib/pattern-combos.ts` with combo definitions
- [ ] Add `pendingCareerMentions` to GameState
- [ ] Update dialogue nodes with visibility conditions
- [ ] Add career mention nodes to Maya, Marcus dialogue graphs

**Test:** Player with analytical:5, building:4 → Maya mentions "systems architects"

---

### 1.2 Samuel Context Choices
**Location:** `content/samuel-dialogue-graph.ts`

```typescript
// Topics as dialogue choices with visibility conditions
choices: [
  {
    choiceId: 'ask_about_patterns',
    text: "These patterns I'm developing...",
    visibleCondition: { patterns: { analytical: { min: 3 } } }
  }
]
```

**Tasks:**
- [ ] Add `samuel_return_greeting` node with contextual topics
- [ ] Add visibility conditions to pattern/career topic choices
- [ ] Create deep-dive response nodes for each topic
- [ ] Test unlocking sequence

**Test:** Player with pattern at 3+ → "These patterns I'm developing..." option appears

---

### 1.3 Samuel Greeting Variations
**Location:** `content/samuel-dialogue-graph.ts`

**Tasks:**
- [ ] Add `samuel_greeting_router` with dynamic next logic
- [ ] Create `samuel_greeting_noticing` (pattern 3+)
- [ ] Create `samuel_greeting_recognition` (pattern 5+)
- [ ] Create `samuel_greeting_mastery` (pattern 6+)
- [ ] Wire router into Samuel entry flow

**Test:** Return with analytical:5 → "The Weaver takes note of you now..."

---

### 1.4 Character States (Dialogue Manifestation)
**Location:** `lib/character-states.ts` (new file)

```typescript
type CharacterState = 'guarded' | 'warming' | 'open' | 'vulnerable';

const STATE_MODIFIERS: Record<CharacterState, StateDialogueModifiers> = {
  guarded: { greetingPrefix: "Maya eyes you warily. " },
  warming: { greetingPrefix: "Maya nods in recognition. " },
  open: { greetingPrefix: "Maya's face lights up. " },
  vulnerable: { greetingPrefix: "Maya takes a breath, as if deciding something. " }
};
```

**Tasks:**
- [ ] Create `lib/character-states.ts` with state definitions
- [ ] Add `getCharacterState(trust)` helper function
- [ ] Update character greeting nodes to use state prefixes
- [ ] Apply to Maya, Devon, Marcus first (Tier 1/2)

**Test:** Maya at trust:4 → "Maya nods in recognition" prefix

---

## Phase 2: Next Sprint

### 2.1 Narrative Tiers Implementation
**Location:** `lib/character-tiers.ts` (new file)

| Tier | Characters | Dialogue Target | Voice Variations |
|------|------------|-----------------|------------------|
| 1 | samuel, maya, devon | 80 | 15 |
| 2 | marcus, tess, rohan, kai | 50 | 10 |
| 3 | grace, elena, alex, yaquin | 35 | 6 |
| 4 | silas, asha, lira, zara, jordan | 25 | 6 |

**Tasks:**
- [ ] Create tier configuration file
- [ ] Create tier progress tracking dashboard (admin only)
- [ ] Prioritize content development by tier

---

### 2.2 Dialogue Graph Validation Pipeline
**Location:** `scripts/validate-dialogue-graphs.ts` (new file)

```typescript
interface ValidationRules {
  noOrphanedNodes: boolean;
  noDeadEnds: boolean;
  patternBalanceMin: number;
  trustGateReachability: boolean;
  voiceVariationsComplete: boolean;
}
```

**Tasks:**
- [ ] Create validation script
- [ ] Add to CI pipeline
- [ ] Generate validation report

---

## Phase 3: Future Sprint

### 3.1 Orb Unlock Through Dialogue
**Current Gap:** Orbs don't unlock anything visible (from gap analysis)

**Safe Implementation:**
- Orb accumulation triggers Samuel dialogue about "resonance"
- Specific orb levels unlock new Samuel topics (via visibility conditions)
- No new UI—just new dialogue options

---

## Files to Create

| File | Purpose |
|------|---------|
| `lib/pattern-combos.ts` | Silent combo detection |
| `lib/character-states.ts` | Trust-based character demeanor |
| `lib/character-tiers.ts` | Resource allocation strategy |
| `scripts/validate-dialogue-graphs.ts` | Build-time validation |

---

## Files to Modify

| File | Changes |
|------|---------|
| `content/samuel-dialogue-graph.ts` | Context choices, greeting variations |
| `content/maya-dialogue-graph.ts` | Career mention nodes, state prefixes |
| `content/marcus-dialogue-graph.ts` | Career mention nodes, state prefixes |
| `lib/character-state.ts` | Add pendingCareerMentions to GameState |

---

## Testing Strategy

### Unit Tests
- Pattern combo matching logic
- Character state derivation
- Visibility condition evaluation

### Integration Tests
- Combo achievement → dialogue flag propagation
- Trust level → greeting prefix selection
- Pattern milestone → Samuel greeting routing

### Smoke Tests
- Full playthrough with pattern focus
- Verify career mentions appear naturally

---

## Success Criteria

| Metric | Before | After |
|--------|--------|-------|
| Pattern acknowledgment rate | 4% | 20%+ |
| Career mentions per session | 0 | 2-3 |
| Samuel dialogue variations | 1 | 5+ |
| Character greeting variations | 0 | 4 per character |

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `ISP_COMPREHENSIVE_PRD.md` | Full product vision with Invisible Depth principle |
| `ISP_FEATURE_SYNTHESIS.md` | Feature designs with safe implementations |
| `SYSTEM_COVERAGE_JAN2026.md` | Current system coverage audit |
| `FEATURE_PROGRESS_TRACKER_JAN2026.md` | 572-feature tracking |

---

## Development Order

1. **Silent Pattern Combos** - Foundation for career connections
2. **Samuel Greeting Variations** - Immediate pattern feedback
3. **Samuel Context Choices** - Player-driven discovery
4. **Character States** - Trust manifestation

Each feature builds on existing dialogue infrastructure. No new UI components. No new visual effects. Pure dialogue enhancement.

---

*"The most ambitious feature is the one the player never knows exists—they just feel its effects."*

— Invisible Depth Principle
