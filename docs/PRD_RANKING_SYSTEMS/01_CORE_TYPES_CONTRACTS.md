# Phase 1: Core Types & Contracts

**PRD ID:** RANK-001
**Priority:** P0 (Foundation)
**Commits:** 3-5
**Dependencies:** None
**Inspired By:** All anime ranking systems (need unified type foundation)

---

## INTEGRATION NOTE

**This PRD defines WRAPPER TYPES that reference existing systems.**

**Existing types to import (DO NOT REDEFINE):**
- `lib/orbs.ts` - `OrbTier`: nascent | emerging | developing | flourishing | mastered
- `lib/orbs.ts` - `OrbBalance`: totalEarned, totalSpent, available
- `lib/patterns.ts` - `PatternType`: analytical | patience | exploring | helping | building
- `lib/patterns.ts` - `PATTERN_THRESHOLDS`: EMERGING=3, DEVELOPING=6, FLOURISHING=9
- `lib/constants.ts` - `TRUST_THRESHOLDS`: stranger(0)→bonded(10)
- `lib/schemas/player-data.ts` - `ReadinessLevel`: exploratory | emerging | near_ready | ready
- `lib/skill-combos.ts` - `SkillCombo`: 12 combos with tiers

**Integration Strategy:**
```typescript
// lib/ranking/types.ts
import { OrbTier } from '@/lib/orbs'
import { PatternType } from '@/lib/patterns'
import { ReadinessLevel } from '@/lib/schemas/player-data'

// Extend, don't replace
export type RankCategory = 'pattern_mastery' | 'career_expertise' | ...

// Map to existing for backward compatibility
export function orbTierToRankLevel(tier: OrbTier): number {
  const mapping: Record<OrbTier, number> = {
    nascent: 0, emerging: 1, developing: 2, flourishing: 3, mastered: 4
  }
  return mapping[tier]
}
```

---

## Target Outcome

Establish typed schemas, contracts, and foundational infrastructure for all ranking systems. This phase creates the "source of truth" that subsequent phases build upon.

**Success Criteria:**
- [ ] All rank types defined in `lib/ranking/types.ts`
- [ ] Contract tests validate schema invariants
- [ ] No runtime type errors in ranking calculations
- [ ] Performance: rank lookup <1ms

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Max rank categories | 8 | Cognitive load limit (7±2) |
| Max tiers per category | 10 | Claymore's 47 too granular for career context |
| Numeric precision | Integer | No floating point rank display |
| Storage format | JSON-serializable | localStorage compatibility |

---

## System Design

### 1. Core Rank Types

```typescript
// lib/ranking/types.ts

/**
 * Universal rank category enum
 * Maps to anime inspirations while serving career exploration
 */
export type RankCategory =
  | 'pattern_mastery'    // Claymore-inspired: visible pattern progression
  | 'career_expertise'   // Demon Slayer-inspired: skill mastery levels
  | 'challenge_rating'   // JJK-inspired: difficulty matching
  | 'station_standing'   // OPM-inspired: public recognition
  | 'skill_stars'        // HxH-inspired: contribution honors
  | 'elite_status'       // Bleach-inspired: special designations

/**
 * Generic rank tier structure
 * Reused across all rank categories
 */
export interface RankTier {
  id: string                    // Unique identifier (e.g., 'pattern_emerging')
  category: RankCategory
  level: number                 // 0-indexed within category
  name: string                  // Display name (e.g., "Emerging")
  threshold: number             // Points required to reach
  description: string           // Flavor text for UI
  iconVariant?: string          // Optional visual variant
  colorToken?: string           // Tailwind color class
}

/**
 * Player's rank state for a single category
 *
 * DESIGN PRINCIPLE: Computed view, not stored state.
 * - Points are computed from GameState (patterns, orbs, skills, trust)
 * - Do NOT persist points separately - they will drift from source of truth
 * - history is optional and only needed if rank history is a feature requirement
 */
export interface PlayerRank {
  category: RankCategory
  currentTierId: string         // Current tier ID
  currentLevel: number          // Current numeric level
  // NOTE: points removed - always compute from GameState source data
  pointsToNext: number          // Computed: points needed for next tier
  percentToNext: number         // Computed: 0-100 progress percentage
  // NOTE: lastUpdated removed - use gameState.lastUpdated instead
  history?: RankChangeEvent[]   // Optional: recent changes (max 10)
}

/**
 * Compute points for a rank category from GameState
 * Call this instead of reading stored points
 */
export function getRankPoints(gameState: GameState, category: RankCategory): number {
  switch (category) {
    case 'pattern_mastery':
      return Object.values(gameState.patterns).reduce((sum, val) => sum + val, 0)
    case 'career_expertise':
      // Computed from trust + skill combos (see Phase 3)
      return 0 // Placeholder
    // ... other categories compute from their respective sources
    default:
      return 0
  }
}

/**
 * Rank change event for history tracking
 */
export interface RankChangeEvent {
  timestamp: number
  previousTierId: string
  newTierId: string
  pointsDelta: number
  reason: string                // Human-readable cause
  sceneId?: string              // Optional scene context
}

/**
 * Full ranking state for a player
 */
export interface RankingState {
  version: string               // Schema version for migrations
  playerId: string
  ranks: Record<RankCategory, PlayerRank>
  achievements: string[]        // Unlocked rank-related achievements
  ceremonies: string[]          // Completed recognition ceremonies
  lastCalculated: number        // Cache invalidation timestamp
}
```

### 2. Rank Registry (Source of Truth)

```typescript
// lib/ranking/registry.ts

import type { RankTier, RankCategory } from './types'

/**
 * All rank tiers defined here.
 * No runtime definition allowed - this is the canonical source.
 */
/**
 * RANK_REGISTRY: Canonical tier definitions
 *
 * CRITICAL: pattern_mastery thresholds MUST match ORB_TIERS from lib/orbs.ts:
 *   nascent: 0, emerging: 10, developing: 30, flourishing: 60, mastered: 100
 *
 * Display names are station-themed per PRD 02 (Pattern Mastery Ranks).
 */
export const RANK_REGISTRY: Record<RankCategory, RankTier[]> = {
  pattern_mastery: [
    // Thresholds align with ORB_TIERS.*.minOrbs (lib/orbs.ts)
    { id: 'pm_traveler', category: 'pattern_mastery', level: 0, name: 'Traveler', threshold: 0, description: 'Just arrived at the station. Everything is new.', colorToken: 'slate' },
    { id: 'pm_passenger', category: 'pattern_mastery', level: 1, name: 'Passenger', threshold: 10, description: 'Beginning to find your way. Patterns emerging.', colorToken: 'blue' },
    { id: 'pm_regular', category: 'pattern_mastery', level: 2, name: 'Regular', threshold: 30, description: 'The station knows you. You know yourself.', colorToken: 'indigo' },
    { id: 'pm_conductor', category: 'pattern_mastery', level: 3, name: 'Conductor', threshold: 60, description: 'You guide your own journey now.', colorToken: 'purple' },
    { id: 'pm_stationmaster', category: 'pattern_mastery', level: 4, name: 'Station Master', threshold: 100, description: 'The station is part of you. You are part of it.', colorToken: 'amber' },
  ],
  career_expertise: [
    // Phase 3 defines these
  ],
  // ... other categories
}

/**
 * Get tier for a given category and point total
 */
export function getTierForPoints(category: RankCategory, points: number): RankTier {
  const tiers = RANK_REGISTRY[category]
  // Find highest tier where threshold <= points
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].threshold) {
      return tiers[i]
    }
  }
  return tiers[0] // Default to lowest
}

/**
 * Calculate progress to next tier
 */
export function calculateProgress(category: RankCategory, points: number): { toNext: number, percent: number } {
  const tiers = RANK_REGISTRY[category]
  const currentTier = getTierForPoints(category, points)
  const currentIndex = tiers.findIndex(t => t.id === currentTier.id)

  if (currentIndex >= tiers.length - 1) {
    return { toNext: 0, percent: 100 } // Max tier
  }

  const nextTier = tiers[currentIndex + 1]
  const pointsInTier = points - currentTier.threshold
  const tierRange = nextTier.threshold - currentTier.threshold

  return {
    toNext: nextTier.threshold - points,
    percent: Math.floor((pointsInTier / tierRange) * 100)
  }
}
```

### 3. Ranking Calculator (Deterministic)

```typescript
// lib/ranking/calculator.ts

import type { RankingState, RankCategory, PlayerRank, RankChangeEvent } from './types'
import { getTierForPoints, calculateProgress, RANK_REGISTRY } from './registry'
import type { GameState } from '@/lib/character-state'

/**
 * Calculate all ranks from game state
 *
 * DETERMINISTIC: Same input + same `now` always produces same output.
 * Pass `now` explicitly for testability. Production code uses default.
 *
 * @param gameState - Current game state (source of truth)
 * @param now - Timestamp for calculations (default: Date.now() for production)
 */
export function calculateRanks(
  gameState: GameState,
  now: number = Date.now()
): RankingState {
  return {
    version: '1.0.0',
    playerId: gameState.playerId || 'anonymous',
    ranks: {
      pattern_mastery: calculatePatternMasteryRank(gameState, now),
      career_expertise: calculateCareerExpertiseRank(gameState, now),
      challenge_rating: calculateChallengeRatingRank(gameState, now),
      station_standing: calculateStationStandingRank(gameState, now),
      skill_stars: calculateSkillStarsRank(gameState, now),
      elite_status: calculateEliteStatusRank(gameState, now),
    },
    achievements: [], // Populated by achievement system
    ceremonies: [], // Populated by ceremony system
    lastCalculated: now,
  }
}

/**
 * Pattern mastery: derived from pattern points
 *
 * Points are computed fresh each call - NOT stored in PlayerRank.
 * Use getRankPoints() if you need the raw point value.
 */
function calculatePatternMasteryRank(gameState: GameState, now: number): PlayerRank {
  // Sum all pattern points for overall mastery
  const totalPatternPoints = Object.values(gameState.patterns).reduce((sum, val) => sum + val, 0)
  const tier = getTierForPoints('pattern_mastery', totalPatternPoints)
  const progress = calculateProgress('pattern_mastery', totalPatternPoints)

  return {
    category: 'pattern_mastery',
    currentTierId: tier.id,
    currentLevel: tier.level,
    // NOTE: points NOT stored - use getRankPoints(gameState, 'pattern_mastery')
    pointsToNext: progress.toNext,
    percentToNext: progress.percent,
    // NOTE: history populated by rank change detection, not stored by default
  }
}

// Additional calculators defined in subsequent phases...
```

---

## Data Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GameState     │───▶│ calculateRanks() │───▶│  RankingState   │
│ (patterns,      │    │ (deterministic)  │    │ (all ranks)     │
│  skills, trust) │    └──────────────────┘    └─────────────────┘
└─────────────────┘                                     │
                                                        ▼
                                              ┌─────────────────┐
                                              │  UI Components  │
                                              │ (rank display)  │
                                              └─────────────────┘
```

---

## Contracts & Invariants

```typescript
// tests/lib/ranking-contracts.test.ts

describe('Ranking System Contracts', () => {
  describe('Tier Registry Invariants', () => {
    it('all categories have at least 2 tiers', () => {
      for (const [category, tiers] of Object.entries(RANK_REGISTRY)) {
        expect(tiers.length).toBeGreaterThanOrEqual(2)
      }
    })

    it('tier thresholds are strictly increasing', () => {
      for (const [category, tiers] of Object.entries(RANK_REGISTRY)) {
        for (let i = 1; i < tiers.length; i++) {
          expect(tiers[i].threshold).toBeGreaterThan(tiers[i-1].threshold)
        }
      }
    })

    it('tier levels are sequential starting at 0', () => {
      for (const [category, tiers] of Object.entries(RANK_REGISTRY)) {
        tiers.forEach((tier, i) => {
          expect(tier.level).toBe(i)
        })
      }
    })

    it('all tier IDs are unique', () => {
      const allIds = Object.values(RANK_REGISTRY).flat().map(t => t.id)
      expect(new Set(allIds).size).toBe(allIds.length)
    })
  })

  describe('Calculator Determinism', () => {
    it('same game state produces identical ranks', () => {
      const state = createMockGameState({ patterns: { analytical: 5 } })
      const result1 = calculateRanks(state)
      const result2 = calculateRanks(state)

      expect(result1.ranks).toEqual(result2.ranks)
    })

    it('calculation completes under 5ms', () => {
      const state = createMockGameState()
      const start = performance.now()
      calculateRanks(state)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(5)
    })
  })
})
```

---

## Plan of Attack

| Step | Task | Acceptance Criteria | Files |
|------|------|---------------------|-------|
| 1.1 | Create types file | All interfaces exported, no `any` | `lib/ranking/types.ts` |
| 1.2 | Create registry | All 6 categories defined (empty tiers OK for later phases) | `lib/ranking/registry.ts` |
| 1.3 | Create calculator stub | `calculateRanks()` returns valid shape | `lib/ranking/calculator.ts` |
| 1.4 | Add contract tests | All invariant tests pass | `tests/lib/ranking-contracts.test.ts` |
| 1.5 | Export from index | Clean module interface | `lib/ranking/index.ts` |

---

## Rollout & Backout

**Rollout:**
1. Merge types and registry (no behavior change)
2. Add calculator with feature flag `RANKING_V2`
3. Shadow-run: calculate ranks but don't display
4. Enable display after verification

**Backout:**
- Types-only: safe, no runtime impact
- Calculator: disable flag, fall back to existing pattern display
- Full rollback: revert commits, no data migration needed

---

## Open Questions

1. **Versioning strategy for RankingState?** → Recommend semver, migrate on load
2. **Persist rank history length?** → Start with 10, can increase later
3. **Real-time vs batch calculation?** → Real-time for now (<5ms is fast enough)

---

## Performance Budget

| Operation | Budget | Measurement |
|-----------|--------|-------------|
| `calculateRanks()` | <5ms | `console.time` in dev |
| Tier lookup | <1ms | Per-category |
| Progress calculation | <1ms | Per-category |
| Full state serialization | <10ms | JSON.stringify |
