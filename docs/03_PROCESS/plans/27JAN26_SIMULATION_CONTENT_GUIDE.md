# Simulation Content Creation Guide

**Date:** January 27, 2026
**Purpose:** Enable an engineer to create 3-phase simulations for 15 characters
**Status:** 5/20 complete (Devon, Jordan, Dante, Nadia, Isaiah)

---

## Quick Start

Each character needs **12 dialogue nodes** (4 per phase):

```
Phase 1 (Trust >= 2): setup → simulation → success → fail
Phase 2 (Trust >= 5): setup → simulation → success → fail
Phase 3 (Trust >= 8): setup → simulation → success → fail
```

**Reference implementations:**
- `content/devon-dialogue-graph.ts` — Engineering simulations
- `content/jordan-dialogue-graph.ts` — Career navigation simulations

---

## Priority Order

### Tier 1 — Core Characters (do first)
| Character | Career | Simulation Theme | Notes |
|-----------|--------|-----------------|-------|
| Maya | Tech Innovator | Code/product challenges | Has stub — needs rewrite to 3-phase |
| Marcus | Medical Tech | Healthcare scenarios | Has stub |
| Kai | Safety Specialist | Risk assessment | Has Phase 1 & 3 but **no Phase 2** — fix gap |
| Rohan | Deep Tech | Technical puzzles | Has stub |

### Tier 2 — Secondary Characters
| Character | Career | Simulation Theme |
|-----------|--------|-----------------|
| Tess | Education Founder | Teaching/program design |
| Yaquin | EdTech Creator | Learning platform scenarios |
| Grace | Healthcare Ops | Operations management |
| Elena | Information Science | Research/archive challenges |
| Alex | Supply Chain | Logistics optimization |

### Tier 3 — Extended Characters
| Character | Career | Simulation Theme |
|-----------|--------|-----------------|
| Silas | Manufacturing | Production line challenges |
| Asha | Conflict Resolution | Mediation scenarios |
| Lira | Communications | Sound/media design |
| Zara | Data Ethics | Ethics dilemmas |
| Quinn | Finance | Financial analysis |

**Samuel** does NOT get simulations — he's the hub/conductor.

---

## Node Templates

### Template 1: Setup Node

```typescript
{
  nodeId: '{char}_simulation_phase{N}_setup',
  speaker: '{Character Full Name}',
  content: [{
    text: "{Character invites player to try a challenge related to their field}",
    emotion: '{appropriate_emotion}',
    variation_id: 'simulation_phase{N}_intro_v1'
  }],
  requiredState: {
    trust: { min: {2|5|8} },
    // Phase 2+: requires previous phase completion
    // hasKnowledgeFlags: ['{char}_simulation_phase{N-1}_complete'],
    // Phase 3: also requires vulnerability
    // hasGlobalFlags: ['{char}_vulnerability_revealed']
  },
  choices: [
    {
      choiceId: 'phase{N}_accept',
      text: "{Player accepts — action-oriented phrasing}",
      nextNodeId: '{char}_simulation_phase{N}',
      pattern: '{primary_pattern}',
      skills: ['{relevant_skill}']
    },
    {
      choiceId: 'phase{N}_decline',
      text: "{Player declines — gentle, not dismissive}",
      nextNodeId: '{char}_crossroads',
      pattern: 'patience',
      consequence: {
        characterId: '{char}',
        trustChange: 1
      }
    }
  ],
  tags: ['simulation', '{char}_arc', 'phase{N}']
}
```

### Template 2: Simulation Node

```typescript
{
  nodeId: '{char}_simulation_phase{N}',
  speaker: '{Character Full Name}',
  content: [{
    text: "{Brief setup for the task}",
    emotion: 'focused',
    variation_id: 'simulation_phase{N}_v1'
  }],
  simulation: {
    type: '{simulation_type}',  // see types below
    title: '{User-Facing Title}',
    taskDescription: '{Clear description of what player must do}',
    phase: {1|2|3},
    difficulty: '{introduction|application|mastery}',
    variantId: '{char}_{task_slug}_phase{N}',
    timeLimit: {90|120},  // seconds, optional
    initialContext: {
      label: '{CONTEXT_LABEL}',
      content: `{Multi-line context with background, constraints, options}`,
      displayStyle: '{code|text}'
    },
    successFeedback: '{checkmark} {Brief success message}',
    successThreshold: {75|85|95},  // Phase 1: 75, Phase 2: 85, Phase 3: 95
    unlockRequirements: {
      trustMin: {2|5|8},
      // Phase 2+:
      // previousPhaseCompleted: '{char}_{prev_slug}_phase{N-1}',
      // Phase 3:
      // requiredFlags: ['{char}_vulnerability_revealed']
    }
  },
  choices: [
    {
      choiceId: 'phase{N}_success',
      text: "{Player's insight/action that demonstrates mastery}",
      nextNodeId: '{char}_simulation_phase{N}_success',
      pattern: '{primary_pattern}',
      skills: ['{skill1}', '{skill2}']
    }
  ],
  onEnter: [{
    characterId: '{char}',
    addKnowledgeFlags: ['{char}_simulation_phase{N}_complete']
  }],
  tags: ['simulation', 'phase{N}', '{char}_sim']
}
```

### Template 3: Success Node

```typescript
{
  nodeId: '{char}_simulation_phase{N}_success',
  speaker: '{Character Full Name}',
  content: [{
    text: "{Character reflects on what player demonstrated — personal, not generic}",
    emotion: '{warm|impressed|grateful_transformed}',
    variation_id: 'phase{N}_success_v1',
    richEffectContext: 'success',
    // PHASE 3 ONLY — add patternReflection (see below)
  }],
  choices: [{
    choiceId: 'phase{N}_success_continue',
    text: "{Player affirms the lesson learned}",
    nextNodeId: '{char}_crossroads',
    pattern: '{primary_pattern}',
    skills: ['{relevant_skill}'],
    consequence: {
      characterId: '{char}',
      trustChange: {2|3},  // Phase 1-2: 2, Phase 3: 3
      // Phase 3: addGlobalFlags: ['{char}_{theme}_mastery']
    }
  }],
  tags: ['simulation', 'success', 'phase{N}']
}
```

### Template 4: Failure Node

```typescript
{
  nodeId: '{char}_simulation_phase{N}_fail',
  speaker: '{Character Full Name}',
  content: [{
    text: "{Gentle acknowledgment — NOT punishing. Character shows understanding.}",
    emotion: 'patient_disappointed',
    variation_id: 'phase{N}_fail_v1'
  }],
  choices: [{
    choiceId: 'phase{N}_fail_continue',
    text: "{Player reflects — shows growth mindset}",
    nextNodeId: '{char}_crossroads',
    pattern: 'patience',
    consequence: {
      characterId: '{char}',
      trustChange: 1
    }
  }],
  tags: ['simulation', 'fail', 'phase{N}']
}
```

---

## Simulation Types

| Type | Use For | Display |
|------|---------|---------|
| `terminal_coding` | Technical/debugging tasks | Code editor style |
| `system_architecture` | Design/constraint problems | Diagram/options layout |
| `visual_canvas` | Creative/design tasks | Canvas/visual workspace |
| `chat_negotiation` | People/communication tasks | Chat-style dialogue |

Choose the type that best matches the character's career field.

---

## Phase 3 Pattern Reflections

Phase 3 success nodes MUST include all 5 pattern reflections. Write text in the character's voice acknowledging each pattern:

```typescript
patternReflection: [
  {
    pattern: 'analytical',
    minLevel: 5,
    altText: "{Character acknowledges player's analytical approach — specific to THIS challenge}",
    altEmotion: 'analytical_gratitude'
  },
  {
    pattern: 'patience',
    minLevel: 5,
    altText: "{Character acknowledges player's patience — specific to THIS challenge}",
    altEmotion: 'patient_gratitude'
  },
  {
    pattern: 'exploring',
    minLevel: 5,
    altText: "{Character acknowledges player's curiosity — specific to THIS challenge}",
    altEmotion: 'explorer_gratitude'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    altText: "{Character acknowledges player's supportiveness — specific to THIS challenge}",
    altEmotion: 'helping_gratitude'
  },
  {
    pattern: 'building',
    minLevel: 5,
    altText: "{Character acknowledges player's constructive approach — specific to THIS challenge}",
    altEmotion: 'builder_gratitude'
  }
]
```

---

## Phase Progression Rules

```
Phase 1: Trust >= 2, no prerequisites
Phase 2: Trust >= 5, requires '{char}_simulation_phase1_complete' knowledge flag
Phase 3: Trust >= 8, requires '{char}_simulation_phase2_complete' AND '{char}_vulnerability_revealed'
```

Phase 3 is ALWAYS gated behind vulnerability revelation. This ensures emotional depth.

---

## Difficulty Scaling

| Phase | Difficulty | Success Threshold | Challenge Type |
|-------|-----------|-------------------|---------------|
| 1 | `introduction` | 75 | Surface-level technical/practical |
| 2 | `application` | 85 | Strategic thinking under constraints |
| 3 | `mastery` | 95 | Human/emotional complexity |

Phase 3 should ALWAYS involve a personal/emotional dimension — not just harder technical problems. The character reveals something vulnerable, and the player must navigate that with empathy.

---

## Content Guidelines

### Voice
- Each character has a distinct voice (see `lib/voice-utils.ts` and `content/pattern-voice-library.ts`)
- Simulations should feel like natural extensions of the character's dialogue style
- Phase 3 should feel like a turning point in the relationship

### Length
- Setup node text: 2-4 sentences
- Simulation context: 10-20 lines
- Success reflection: 2-5 sentences (more emotional in Phase 3)
- Failure reflection: 1-3 sentences (gentle, not punishing)

### Skills
- Reference skills from `lib/skill-tracker.ts` — use existing skill names
- Common skills per career type:
  - Tech: `problemSolving`, `systemsThinking`, `criticalAnalysis`
  - Healthcare: `empathy`, `clinicalReasoning`, `communication`
  - Education: `leadership`, `mentoring`, `adaptability`
  - Business: `strategicThinking`, `negotiation`, `dataAnalysis`

---

## Where to Add Nodes

Each character's dialogue graph is in `content/{char}-dialogue-graph.ts`. Add simulation nodes at the end of the file, before the closing export. Follow the pattern established in the existing nodes.

Example file structure:
```typescript
// ... existing nodes ...

// ═══════════════════════════════════════════════════════════════
// 3-PHASE SIMULATION NODES
// ═══════════════════════════════════════════════════════════════

// Phase 1: {description}
{ nodeId: '{char}_simulation_phase1_setup', ... },
{ nodeId: '{char}_simulation_phase1', ... },
{ nodeId: '{char}_simulation_phase1_success', ... },
{ nodeId: '{char}_simulation_phase1_fail', ... },

// Phase 2: {description}
// ...

// Phase 3: {description}
// ...
```

---

## Validation

After adding simulations for a character, run:

```bash
npx tsc --noEmit --pretty          # Type check
npm test                             # Unit tests
npm test tests/lib/simulation-validators.test.ts  # Simulation-specific tests
npm test tests/lib/simulation-id-drift.test.ts    # ID consistency
```

---

## Special Cases

### Kai — Fix Phase 2 Gap
Kai has Phase 1 and Phase 3 but **no Phase 2**. This breaks the progression chain. Priority: add Phase 2 that bridges the gap.

### Maya — Full Rewrite
Maya has a 2-phase stub with inconsistent naming (`maya_simulation_phase_1` vs standard `maya_simulation_phase1`). Rewrite all 3 phases from scratch using the standard format.

### Quinn — Missing Simulation
Quinn (Finance, Hedgehog) has no simulation nodes at all. Create all 3 phases from scratch.
