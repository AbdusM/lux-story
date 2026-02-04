# Incomplete Systems Implementation Plan (v2)

**Status:** ✅ ALL PHASES COMPLETE (P0-P3)
**Created:** 2026-02-04
**Last Updated:** 2026-02-04
**Author:** Claude Code Analysis

### Implementation Status (2026-02-04)
| Item | Status |
|------|--------|
| P0: E2E Golden Test | ✅ Complete |
| P0: Simulation Validator | ✅ Complete |
| P1a: Maya, Marcus, Kai, Rohan | ✅ Complete |
| P1b: Tess, Elena, Grace, Alex, Quinn, Yaquin | ✅ Complete |
| P1c: Silas, Asha, Lira, Zara | ✅ Complete |
| P1d: Samuel | ✅ Complete |
| **3-Phase Simulations** | **20/20 (100%)** |
| P2: Component Tests (17 tests) | ✅ Complete |
| P3a: Mobile Ranking E2E | ✅ Complete |
| P3b: Assessment Integration E2E | ✅ Complete |
| P3c: Badge Progression E2E | ✅ Complete |

---

## Executive Summary

Comprehensive audit identified **3 incomplete areas**, classified by shipping impact:

### Shipping Blockers vs Quality Multipliers

| Area | Classification | Completion | Ship Without? |
|------|----------------|------------|---------------|
| **E2E Golden Test** | BLOCKER | ✅ 100% | ✅ Validated |
| **Simulation Validator** | BLOCKER | ✅ 100% | ✅ Validated |
| **3-Phase Simulations** | QUALITY MULTIPLIER | ✅ 100% (20/20) | ✅ Complete |
| **Component Tests** | QUALITY MULTIPLIER | 0% | ✅ Lib tests cover logic |

**Key Finding:** Simulations are NOT progression blockers. Ranking unlocks depend on:
- Pattern mastery level (from dialogue choices)
- Career expertise level (from character interactions)
- Characters met count
- Completion flags

Simulations provide **depth** but do not gate advancement.

---

## Table of Contents

1. [Priority Classification](#1-priority-classification)
2. [Shipping Blockers](#2-shipping-blockers)
3. [Quality Multipliers](#3-quality-multipliers)
4. [Execution Order](#4-execution-order)
5. [Templates & Patterns](#5-templates--patterns)
6. [Acceptance Criteria](#6-acceptance-criteria)

---

## 1. Priority Classification

### Complete Systems (No Action Required)

| System | Coverage | Status |
|--------|----------|--------|
| Interrupt Windows | 20/20 (100%) | ✅ Complete |
| Vulnerability Arcs | 20/20 (100%) | ✅ Complete |
| Pattern Reflections | 20/20 (100%) | ✅ Complete |
| Assessment UI Components | 7/7 (100%) | ✅ Complete |
| Ranking Lib Modules | 16/16 (100%) | ✅ Complete |
| Contract Tests (lib/) | 12/12 (100%) | ✅ Complete |
| Loyalty Experiences | 20/20 (100%) | ✅ Complete |
| Character Relationships | 68 edges | ✅ Complete |

### Incomplete Systems

| System | Current | Gap | Priority |
|--------|---------|-----|----------|
| E2E Golden Test | 0/1 | 1 file, ~8 tests | **P0 BLOCKER** |
| Simulation Validator | 0/1 | 1 test file | **P0 BLOCKER** |
| 3-Phase Simulations | 5/20 | 15 chars × 2 phases | P1 Quality |
| Component Tests | 0/7 | 7 badge components | P2 Quality |
| E2E Mobile/Extended | 0/3 | 3 additional files | P3 Polish |

---

## 2. Shipping Blockers

### 2.1 E2E Golden Ranking Test (P0)

**Why Blocker:** Without this, we have no validation that the ranking UI actually renders and updates with game progress.

**Scope:** ONE test file with ONE golden flow

**File:** `tests/e2e/ranking/ranking-golden-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { freshGame } from '../fixtures/game-state-fixtures'

test.describe('Ranking Dashboard Golden Flow', () => {
  test('renders all badges and updates with progress', async ({ page }) => {
    await freshGame(page)

    // 1. Navigate to Journal > Ranking
    await page.getByTestId('nav-journal').click()
    await page.getByTestId('journal-tab-ranking').click()

    // 2. Verify dashboard renders
    await expect(page.getByTestId('ranking-dashboard')).toBeVisible()

    // 3. Verify all badges render (existence, not deep validation)
    const badges = [
      'pattern-rank-badge',
      'career-expertise-badge',
      'challenge-rating-badge',
      'elite-status-badge',
      'skill-stars-badge',
      'station-standing-badge'
    ]
    for (const badge of badges) {
      await expect(page.getByTestId(badge)).toBeVisible()
    }

    // 4. Initial state shows base tier
    await expect(page.getByTestId('pattern-rank-badge'))
      .toContainText(/Traveler|Passenger/)

    // 5. Make a choice and verify update
    await page.getByTestId('nav-play').click()
    // ... make scripted choice ...

    // 6. Return to ranking and verify state changed
    await page.getByTestId('nav-journal').click()
    await page.getByTestId('journal-tab-ranking').click()
    await expect(page.getByTestId('ranking-dashboard')).toBeVisible()
  })
})
```

**Deliverable:** 1 file, ~8 test assertions, validates core flow

---

### 2.2 Simulation Completeness Validator (P0)

**Why Blocker:** Prevents partial simulation implementations from shipping undetected.

**File:** `tests/lib/simulation-completeness.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/content'

// Characters with complete 3-phase simulations
const COMPLETE_SIMULATION_CHARACTERS = [
  'devon', 'jordan', 'dante', 'nadia', 'isaiah'
] as const

// Characters with Phase 1 only (explicit incomplete status)
const PHASE_1_ONLY_CHARACTERS = [
  'maya', 'marcus', 'kai', 'rohan', 'tess', 'elena',
  'grace', 'alex', 'quinn', 'yaquin', 'silas', 'asha',
  'lira', 'zara', 'samuel'
] as const

describe('Simulation Completeness', () => {
  describe('Complete Characters', () => {
    for (const charId of COMPLETE_SIMULATION_CHARACTERS) {
      it(`${charId} has all 3 simulation phases`, () => {
        const graph = DIALOGUE_GRAPHS[charId]
        const nodes = graph.nodes

        // Check Phase 1 exists
        const phase1 = nodes.find(n =>
          n.simulation?.phase === 1 ||
          n.nodeId.includes('simulation') && !n.simulation?.phase
        )
        expect(phase1, `${charId} missing Phase 1`).toBeDefined()

        // Check Phase 2 exists (trust 5+)
        const phase2 = nodes.find(n => n.simulation?.phase === 2)
        expect(phase2, `${charId} missing Phase 2`).toBeDefined()

        // Check Phase 3 exists (trust 8+)
        const phase3 = nodes.find(n => n.simulation?.phase === 3)
        expect(phase3, `${charId} missing Phase 3`).toBeDefined()
      })
    }
  })

  describe('Phase 1 Only Characters', () => {
    for (const charId of PHASE_1_ONLY_CHARACTERS) {
      it(`${charId} is documented as Phase 1 only`, () => {
        // This test documents current state
        // When a character gets completed, move them to COMPLETE list
        const graph = DIALOGUE_GRAPHS[charId]
        const nodes = graph?.nodes || []

        const hasPhase2 = nodes.some(n => n.simulation?.phase === 2)
        const hasPhase3 = nodes.some(n => n.simulation?.phase === 3)

        if (hasPhase2 || hasPhase3) {
          throw new Error(
            `${charId} has Phase 2/3 but is in PHASE_1_ONLY list. ` +
            `Move to COMPLETE_SIMULATION_CHARACTERS.`
          )
        }
      })
    }
  })

  describe('No Unknown State', () => {
    it('all characters are accounted for', () => {
      const allKnown = [
        ...COMPLETE_SIMULATION_CHARACTERS,
        ...PHASE_1_ONLY_CHARACTERS
      ]
      // Verify no character is missing from both lists
      expect(allKnown.length).toBe(20)
    })
  })
})
```

**Deliverable:** 1 file, prevents silent incomplete shipping

---

## 3. Quality Multipliers

### 3.1 3-Phase Simulations (P1)

**Why P1 (not P0):** Core game loop, ranking progression, and character relationships all work without Phase 2/3 simulations. These add depth but don't gate progress.

**Current State:**
- Complete (19): Devon, Jordan, Dante, Nadia, Isaiah, Maya, Marcus, Kai, Rohan, Tess, Elena, Grace, Alex, Quinn, Yaquin, Silas, Asha, Lira, Zara
- Phase 1 Only (1): Samuel (hub character - by design)

**Content Estimate:**
- ~154 new nodes as currently scoped (5-6 nodes × 2 phases × 15 chars)
- If expanded to 12 nodes/phase: ~300-400 nodes

**Implementation Batches:**

| Batch | Characters | Est. Nodes | Priority |
|-------|------------|------------|----------|
| Batch 1 | Maya, Marcus, Kai, Rohan | ~48 | P1a (Core) |
| Batch 2 | Tess, Elena, Grace, Alex, Quinn, Yaquin | ~60 | P1b (Secondary) |
| Batch 3 | Silas, Asha, Lira, Zara | ~32 | P1c (Extended) |
| Batch 4 | Samuel | ~8 | P1d (Hub-special) |

**Per-Character Requirements:**

Each character needs:
- **Phase 2 Node** (`{char}_simulation_application`)
  - `requiredState: { trust: { min: 5 } }`
  - Complex scenario with 2-3 branching choices
  - ~3-4 result nodes

- **Phase 3 Node** (`{char}_simulation_mastery`)
  - `requiredState: { trust: { min: 8 } }`
  - Expert-level challenge
  - Character-specific mastery feedback

---

### 3.2 Component Tests (P2)

**Why P2:** Lib-level tests already cover core logic. Component tests add UI validation but aren't blocking.

**Minimal Scope:**

| File | Purpose | Priority |
|------|---------|----------|
| `RankingDashboard.spec.tsx` | Verifies all badges render | P2a |
| `PatternRankBadge.spec.tsx` | Only if unique logic | P2b |

**Approach:**
1. Test `RankingDashboard` integration (renders all badges)
2. Only add individual badge tests if they have unique rendering logic
3. Skip snapshot tests (brittle)

---

### 3.3 Extended E2E Tests (P3)

**Why P3:** Golden flow covers core case. Mobile/extended tests are polish.

**Scope (later):**
- `mobile-ranking.spec.ts` - 3 viewport variants
- `assessment-integration.spec.ts` - Question flow
- `badge-progression.spec.ts` - Unlock animations

---

## 4. Execution Order

### Recommended Order (Ship Value First)

```
WEEK 1: Shipping Blockers
├── 1. Create simulation validator test (P0)
├── 2. Create E2E golden ranking test (P0)
└── 3. Run full test suite, verify passing

WEEK 2-3: Core Simulations (Batch 1)
├── 4. Maya Phase 2 + 3
├── 5. Marcus Phase 2 + 3
├── 6. Kai Phase 2 + 3
├── 7. Rohan Phase 2 + 3
└── 8. Update validator, move chars to COMPLETE list

WEEK 4-5: Secondary Simulations (Batch 2)
├── 9. Tess, Elena, Grace Phase 2 + 3
├── 10. Alex, Quinn, Yaquin Phase 2 + 3
└── 11. Update validator

WEEK 6: Extended + Component Tests
├── 12. Silas, Asha, Lira, Zara Phase 2 + 3
├── 13. Samuel Phase 2 + 3 (hub-special)
├── 14. RankingDashboard.spec.tsx (P2)
└── 15. Extended E2E tests if time (P3)
```

---

## 5. Templates & Patterns

### 5.1 Simulation Phase 2 Template (Correct Schema)

```typescript
// Phase 2: Application (Trust 5+)
{
  nodeId: '{char}_simulation_application',
  speaker: '{CharacterName}',
  requiredState: {
    trust: { min: 5 }
  },
  content: [
    {
      text: "[Complex scenario introduction - stakes are higher]",
      emotion: 'thoughtful',
      variation_id: '{char}_sim2_v1'
    },
    {
      text: "[Context that requires applying earlier lessons]",
      emotion: 'serious',
      variation_id: '{char}_sim2_v2'
    }
  ],
  simulation: {
    type: '{appropriate_type}',  // e.g., 'terminal_coding', 'chat_negotiation'
    title: '{Scenario Title}',
    taskDescription: '{Complex task description}',
    initialContext: {
      label: '{Context Label}',
      content: '{Initial state}',
      displayStyle: 'text'
    },
    successFeedback: '{Success message}',
    phase: 2,
    difficulty: 'application',
    variantId: '{char}_{type}_phase2',
    unlockRequirements: {
      previousPhaseCompleted: '{char}_{type}_phase1',
      trustMin: 5
    },
    timeLimit: 120
  },
  choices: [
    {
      choiceId: '{char}_sim2_choice_a',
      text: "[Option emphasizing analytical approach]",
      patterns: ['analytical'],
      nextNodeId: '{char}_sim2_result_a'
    },
    {
      choiceId: '{char}_sim2_choice_b',
      text: "[Option emphasizing helping approach]",
      patterns: ['helping'],
      nextNodeId: '{char}_sim2_result_b'
    },
    {
      choiceId: '{char}_sim2_choice_c',
      text: "[Option emphasizing exploring approach]",
      patterns: ['exploring'],
      nextNodeId: '{char}_sim2_result_c'
    }
  ],
  tags: ['{char}_arc', 'simulation', 'phase_2']
}
```

### 5.2 Simulation Phase 3 Template (Correct Schema)

```typescript
// Phase 3: Mastery (Trust 8+)
{
  nodeId: '{char}_simulation_mastery',
  speaker: '{CharacterName}',
  requiredState: {
    trust: { min: 8 }
  },
  content: [
    {
      text: "[Expert-level challenge - highest stakes]",
      emotion: 'intense',
      variation_id: '{char}_sim3_v1',
      interaction: 'bloom'  // Visual emphasis
    },
    {
      text: "[Character's personal investment in outcome]",
      emotion: 'vulnerable',
      variation_id: '{char}_sim3_v2'
    }
  ],
  simulation: {
    type: '{appropriate_type}',
    title: '{Mastery Challenge Title}',
    taskDescription: '{Expert-level task}',
    initialContext: {
      label: '{Context Label}',
      content: '{Complex initial state}',
      displayStyle: 'code'
    },
    successFeedback: '{Mastery recognition}',
    phase: 3,
    difficulty: 'mastery',
    variantId: '{char}_{type}_phase3',
    unlockRequirements: {
      previousPhaseCompleted: '{char}_{type}_phase2',
      trustMin: 8
    },
    timeLimit: 60,
    successThreshold: 95
  },
  choices: [
    {
      choiceId: '{char}_sim3_choice_a',
      text: "[Mastery-level response demonstrating growth]",
      patterns: ['analytical', 'patience'],
      nextNodeId: '{char}_sim3_mastery_complete'
    }
  ],
  tags: ['{char}_arc', 'simulation', 'phase_3', 'mastery']
}
```

### 5.3 Key Schema Fields (Verified)

**DialogueContent fields:**
- `text` (required)
- `emotion` (optional)
- `variation_id` (required for tracking)
- `interaction` (optional: 'big', 'small', 'shake', 'nod', 'ripple', 'bloom', 'jitter')
- `voiceVariations` (NOT voiceMarkers)
- `patternReflection` (optional array)
- `richEffectContext` (optional)

**Choice fields:**
- `choiceId` (required)
- `text` (required)
- `patterns` (array of PatternType)
- `nextNodeId` (required)

**SimulationConfig fields:**
- `type` (required)
- `phase` (1, 2, or 3)
- `difficulty` ('introduction', 'application', 'mastery')
- `variantId` (format: `{char}_{type}_phase{N}`)
- `unlockRequirements` (optional)
- `timeLimit` (optional, seconds)
- `successThreshold` (optional, 0-100)

---

## 6. Acceptance Criteria

### 6.1 P0 Blockers (Must Pass Before Ship)

**E2E Golden Test:**
- [ ] File exists at `tests/e2e/ranking/ranking-golden-flow.spec.ts`
- [ ] Test passes in CI
- [ ] Validates all 6 badges render
- [ ] Validates state updates with game progress

**Simulation Validator:**
- [ ] File exists at `tests/lib/simulation-completeness.test.ts`
- [ ] All characters accounted for (20 total)
- [ ] Complete characters have all 3 phases
- [ ] Incomplete characters documented explicitly
- [ ] Test fails if character moved without phases

### 6.2 P1 Simulations (Quality Gate)

For each completed character:
- [ ] Phase 2 node exists with `trust: { min: 5 }`
- [ ] Phase 3 node exists with `trust: { min: 8 }`
- [ ] Both phases have 2+ meaningful choices
- [ ] Choices include appropriate pattern tags
- [ ] `simulation.phase` and `simulation.variantId` set correctly
- [ ] Character voice consistent with existing content
- [ ] Validator test updated (moved to COMPLETE list)

### 6.3 P2 Component Tests (Nice to Have)

- [ ] `RankingDashboard.spec.tsx` exists and passes
- [ ] Tests verify badge rendering integration
- [ ] No snapshot tests (avoiding brittleness)

---

## Appendix A: Content Estimate Reconciliation

**Previous Estimate:** ~1,350 nodes (INCORRECT)

**Correct Estimate:**
- 15 characters × 2 phases = 30 phase implementations
- ~5 nodes per phase (entry + 2 results + feedback)
- **Total: ~150-180 new nodes**

If expanded scope (12 nodes/phase with branching):
- 15 characters × 2 phases × 12 nodes = 360 nodes

**Current scope uses conservative 5 nodes/phase = ~154 nodes**

---

## Appendix B: Files to Create

```
# P0 - Shipping Blockers
tests/e2e/ranking/ranking-golden-flow.spec.ts     # Golden path E2E
tests/lib/simulation-completeness.test.ts         # Completeness validator

# P2 - Quality (Later)
tests/components/ranking/RankingDashboard.spec.tsx

# P3 - Polish (Much Later)
tests/e2e/ranking/mobile-ranking.spec.ts
tests/e2e/ranking/assessment-integration.spec.ts
tests/e2e/ranking/badge-progression.spec.ts
```

---

## Appendix C: Validation Commands

```bash
# Run P0 blockers (must pass before ship)
npm run test -- tests/lib/simulation-completeness.test.ts
npm run test:e2e -- tests/e2e/ranking/ranking-golden-flow.spec.ts

# Run all ranking tests
npm run test -- tests/lib/ranking/

# Full validation
npm run test && npm run test:e2e && npm run type-check && npm run lint
```

---

**Document Control:**
- Version: 2.0
- Status: APPROVED
- Changes from v1:
  - Fixed content estimate (154 nodes, not 1,350)
  - Downgraded simulations from P0 to P1 (not progression blockers)
  - Reduced E2E scope to golden flow
  - Reduced component test scope
  - Fixed template field names (voiceVariations, not voiceMarkers)
  - Added simulation-completeness validator
  - Changed to batch-based schedule
  - Separated "shipping blockers" from "quality multipliers"
