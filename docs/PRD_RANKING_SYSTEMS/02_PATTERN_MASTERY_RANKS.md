# Phase 2: Pattern Mastery Ranks

**PRD ID:** RANK-002
**Priority:** P1 (Core Feature)
**Commits:** 4-6
**Dependencies:** Phase 1 (Core Types)
**Inspired By:** Claymore (No. 1-47 warrior ranks)

---

## INTEGRATION NOTE

**This PRD adds a DISPLAY LAYER on top of existing orb system.**

**Existing systems to use (DO NOT REPLACE):**
- `lib/orbs.ts` - `OrbTier`: nascent, emerging, developing, flourishing, mastered
- `lib/orbs.ts` - `ORB_TIERS`: thresholds at 0, 10, 30, 60, 100
- `lib/patterns.ts` - `PATTERN_THRESHOLDS`: EMERGING=3, DEVELOPING=6, FLOURISHING=9
- `lib/pattern-unlocks.ts` - 15 unlocks at 10%, 50%, 85% fill

**⚠️ CRITICAL: Pattern Achievements ALREADY COMPLETE (lib/pattern-derivatives.ts)**
```typescript
// 14 achievements ALREADY IMPLEMENTED - DO NOT RECREATE
// Single Pattern Mastery (5): weaver_awakened, anchor_set, voyager_path, harmonic_resonance, architect_vision
// Diversity (4): balanced_approach, versatile_mind, renaissance_soul, transcendent_mind
// Contrast (3): analyst_and_helper, patient_explorer, thoughtful_maker
```

**This PRD adds (DISPLAY ONLY):**
- Station-themed display names mapped to existing tiers
- Samuel promotion dialogue triggered at existing thresholds
- Visual rank badges (using existing tier colors)

**This PRD does NOT add:**
- New achievement tracking (already exists)
- New pattern calculations (already exists)
- New tier thresholds (use existing orb tiers)

---

## Target Outcome

Add **narrative display names** to the existing orb tier system. Like Claymore's warriors knowing their number, players should know their "Station Rank" - but the underlying data comes from existing `OrbTier`.

**Success Criteria:**
- [ ] 5 distinct pattern mastery tiers with unique names
- [ ] Visual rank badge displays in Journal
- [ ] Samuel announces rank promotions
- [ ] Per-pattern rank tracking (not just aggregate)
- [ ] Rank displayed on pattern orbs

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Max tiers | 5 | Mirrors 5 patterns, easy mental model |
| Tier names | Station-themed | Fits Grand Central Terminus aesthetic |
| Advancement | Points-based, no decay | Claymore ranks are sticky within generation |
| Display | Subtle, not gamified | Career exploration, not RPG grinding |

---

## System Design

### 1. Pattern Mastery Display Names (Maps to Existing OrbTier)

```typescript
// lib/ranking/pattern-mastery-display.ts
// DISPLAY LAYER: Maps existing OrbTier to station-themed names

import { OrbTier, ORB_TIERS } from '@/lib/orbs'

/**
 * Display names for existing OrbTier values
 * DATA SOURCE: lib/orbs.ts - OrbTier enum and ORB_TIERS thresholds
 *
 * CRITICAL: This does NOT replace the orb system.
 * It provides narrative names for Samuel dialogue and UI display.
 */
export const PATTERN_MASTERY_DISPLAY: Record<OrbTier, {
  displayName: string
  description: string
  iconVariant: string
}> = {
  nascent: {
    displayName: 'Traveler',
    description: 'Just arrived at the station. Everything is new.',
    iconVariant: 'compass'
  },
  emerging: {
    displayName: 'Passenger',
    description: 'Beginning to find your way. Patterns emerging.',
    iconVariant: 'ticket'
  },
  developing: {
    displayName: 'Regular',
    description: 'The station knows you. You know yourself.',
    iconVariant: 'badge'
  },
  flourishing: {
    displayName: 'Conductor',
    description: 'You guide your own journey now.',
    iconVariant: 'hat'
  },
  mastered: {
    displayName: 'Station Master',
    description: 'The station is part of you. You are part of it.',
    iconVariant: 'key'
  }
}

/**
 * Get display name for current orb tier
 * Uses existing getOrbTier() from lib/orbs.ts
 */
export function getPatternMasteryDisplayName(orbTier: OrbTier): string {
  return PATTERN_MASTERY_DISPLAY[orbTier].displayName
}

// EXISTING THRESHOLDS (from lib/orbs.ts - DO NOT DUPLICATE):
// nascent: 0 orbs
// emerging: 10 orbs
// developing: 30 orbs
// flourishing: 60 orbs
// mastered: 100 orbs
```

### 2. Per-Pattern State (Uses Existing Pattern System)

```typescript
// lib/ranking/pattern-mastery-state.ts
// EXTENDS existing pattern/orb tracking with display layer

import { PatternType, PATTERN_THRESHOLDS } from '@/lib/patterns'
import { OrbBalance, getOrbTier, OrbTier } from '@/lib/orbs'
import { PATTERN_MASTERY_DISPLAY } from './pattern-mastery-display'

/**
 * Aggregated view of existing pattern + orb data
 * DATA SOURCES:
 * - lib/patterns.ts: PATTERN_THRESHOLDS (EMERGING=3, DEVELOPING=6, FLOURISHING=9)
 * - lib/orbs.ts: OrbBalance (per-pattern orb counts)
 * - lib/character-state.ts: PlayerPatterns (pattern point totals)
 */
export interface PatternMasteryState {
  // From existing OrbBalance.totalEarned
  overallOrbTier: OrbTier
  overallDisplayName: string

  // From existing PlayerPatterns
  perPattern: Record<PatternType, PatternProgressView>

  // From existing getDominantPattern()
  dominant: PatternType | null

  // Calculated: all patterns within 2 of each other
  balanced: boolean
}

export interface PatternProgressView {
  // Data from existing PlayerPatterns[pattern]
  points: number

  // Derived from PATTERN_THRESHOLDS
  thresholdLevel: 'nascent' | 'emerging' | 'developing' | 'flourishing'

  // Derived from pattern-unlocks.ts
  unlocksEarned: number // 0-3 (at 10%, 50%, 85%)
}

/**
 * Calculate pattern mastery ranks
 * Claymore-inspired: clear numeric position, but per-pattern granularity
 */
export function calculatePatternMastery(patterns: PlayerPatterns): PatternMasteryState {
  const totalPoints = Object.values(patterns).reduce((sum, v) => sum + v, 0)
  const overallTier = getTierForPoints('pattern_mastery', totalPoints)
  const progress = calculateProgress('pattern_mastery', totalPoints)

  const perPattern = {} as Record<PatternType, PatternRank>
  let maxPattern: PatternType | null = null
  let maxValue = 0

  for (const [pattern, value] of Object.entries(patterns) as [PatternType, number][]) {
    const tier = getTierForPoints('pattern_mastery', value * 5) // Scale individual to match overall
    perPattern[pattern] = {
      tierId: tier.id,
      tierName: tier.name,
      level: tier.level,
      points: value,
      percentToNext: calculateProgress('pattern_mastery', value * 5).percent
    }

    if (value > maxValue) {
      maxValue = value
      maxPattern = pattern
    }
  }

  // Check balance (Renaissance Soul achievement)
  const values = Object.values(patterns)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const balanced = (max - min) <= 2

  return {
    overall: {
      tierId: overallTier.id,
      tierName: overallTier.name,
      level: overallTier.level,
      points: totalPoints,
      percentToNext: progress.percent
    },
    perPattern,
    dominant: maxPattern,
    balanced
  }
}
```

### 3. Rank Promotion Logic

```typescript
// lib/ranking/pattern-promotions.ts

export interface RankPromotion {
  category: 'pattern_mastery'
  previousTier: string
  newTier: string
  pattern?: PatternType          // Which pattern triggered it (if per-pattern)
  message: string                // Samuel's announcement
  isOverall: boolean             // Overall rank vs per-pattern
}

/**
 * Check for rank promotions after state change
 * Returns promotions to announce (Samuel dialogue)
 */
export function checkPatternPromotions(
  previousState: PatternMasteryState,
  currentState: PatternMasteryState
): RankPromotion[] {
  const promotions: RankPromotion[] = []

  // Check overall rank
  if (currentState.overall.level > previousState.overall.level) {
    promotions.push({
      category: 'pattern_mastery',
      previousTier: previousState.overall.tierId,
      newTier: currentState.overall.tierId,
      message: SAMUEL_PROMOTION_MESSAGES[currentState.overall.tierId],
      isOverall: true
    })
  }

  // Check per-pattern ranks (secondary announcements)
  for (const pattern of PATTERN_TYPES) {
    const prev = previousState.perPattern[pattern]
    const curr = currentState.perPattern[pattern]
    if (curr.level > prev.level) {
      promotions.push({
        category: 'pattern_mastery',
        previousTier: prev.tierId,
        newTier: curr.tierId,
        pattern,
        message: SAMUEL_PATTERN_MESSAGES[pattern][curr.tierId],
        isOverall: false
      })
    }
  }

  return promotions
}

const SAMUEL_PROMOTION_MESSAGES: Record<string, string> = {
  pm_passenger: "You're finding your rhythm here. The station notices.",
  pm_regular: "I've seen a lot of travelers. You're becoming something more.",
  pm_conductor: "You're not just riding the trains anymore. You're choosing the tracks.",
  pm_stationmaster: "This place... it's yours now. As much as it's anyone's."
}

const SAMUEL_PATTERN_MESSAGES: Record<PatternType, Record<string, string>> = {
  analytical: {
    pm_passenger: "That thinking habit of yours. It's sharpening.",
    pm_regular: "You see the gears behind things. Not everyone does.",
    pm_conductor: "Analysis is your compass. Trust it.",
    pm_stationmaster: "The patterns aren't just visible to you—they speak."
  },
  // ... other patterns
}
```

---

## UI Components

### 4. Rank Badge Component

```typescript
// components/ranking/PatternRankBadge.tsx

interface PatternRankBadgeProps {
  tier: PatternRank
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  pattern?: PatternType   // Optional: for per-pattern badge
}

export function PatternRankBadge({
  tier,
  size = 'md',
  showProgress = false,
  pattern
}: PatternRankBadgeProps) {
  const tierData = PATTERN_MASTERY_TIERS.find(t => t.id === tier.tierId)

  return (
    <div className={cn(
      "flex items-center gap-2",
      size === 'sm' && "text-xs",
      size === 'md' && "text-sm",
      size === 'lg' && "text-base"
    )}>
      {/* Rank Icon */}
      <div className={cn(
        "rounded-full p-1",
        `bg-${tierData?.colorToken}/20`,
        `text-${tierData?.colorToken}`
      )}>
        <RankIcon variant={tierData?.iconVariant} />
      </div>

      {/* Rank Name */}
      <span className="font-medium">{tier.tierName}</span>

      {/* Optional Progress */}
      {showProgress && tier.percentToNext < 100 && (
        <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-${tierData?.colorToken}`}
            initial={{ width: 0 }}
            animate={{ width: `${tier.percentToNext}%` }}
          />
        </div>
      )}
    </div>
  )
}
```

### 5. Journal Integration

```typescript
// In components/Journal.tsx - add rank display

// After pattern orbs section
<div className="mt-4 border-t border-slate-700 pt-4">
  <h4 className="text-xs uppercase text-slate-400 mb-2">Station Rank</h4>
  <PatternRankBadge
    tier={patternMastery.overall}
    size="lg"
    showProgress={true}
  />

  {/* Per-pattern ranks (collapsed by default) */}
  <Collapsible className="mt-2">
    <CollapsibleTrigger className="text-xs text-slate-500">
      View pattern ranks
    </CollapsibleTrigger>
    <CollapsibleContent className="mt-2 space-y-1">
      {PATTERN_TYPES.map(pattern => (
        <div key={pattern} className="flex justify-between items-center">
          <span className="text-xs capitalize">{pattern}</span>
          <PatternRankBadge
            tier={patternMastery.perPattern[pattern]}
            size="sm"
            pattern={pattern}
          />
        </div>
      ))}
    </CollapsibleContent>
  </Collapsible>
</div>
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Pattern System | Read pattern values | Input |
| Samuel Dialogue | Promotion announcements | Output |
| Journal UI | Rank badge display | Output |
| Orb System | Rank visual on orbs | Output |
| Meta-Achievements | Rank-based triggers | Both |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 2.1 | Define tier constants | 5 tiers, station-themed names | `lib/ranking/registry.ts` |
| 2.2 | Implement mastery calculator | Per-pattern + overall | `lib/ranking/pattern-mastery.ts` |
| 2.3 | Add promotion detection | Detects level-ups | `lib/ranking/pattern-promotions.ts` |
| 2.4 | Create rank badge component | Displays tier visually | `components/ranking/PatternRankBadge.tsx` |
| 2.5 | Integrate with Journal | Badge shows in Journal | `components/Journal.tsx` |
| 2.6 | Add Samuel promotion dialogue | Samuel announces rank-ups | `content/samuel-dialogue-graph.ts` |

---

## Tests & Verification

```typescript
describe('Pattern Mastery Ranks', () => {
  it('calculates correct tier for point totals', () => {
    expect(calculatePatternMastery({ analytical: 1, patience: 1, exploring: 1, helping: 1, building: 1 }))
      .toMatchObject({ overall: { tierName: 'Passenger' } }) // 5 total
  })

  it('detects promotions correctly', () => {
    const prev = calculatePatternMastery({ analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 })
    const curr = calculatePatternMastery({ analytical: 2, patience: 1, exploring: 1, helping: 1, building: 0 })
    const promotions = checkPatternPromotions(prev, curr)
    expect(promotions).toHaveLength(1)
    expect(promotions[0].newTier).toBe('pm_passenger')
  })

  it('identifies dominant pattern', () => {
    const state = calculatePatternMastery({ analytical: 5, patience: 1, exploring: 1, helping: 1, building: 1 })
    expect(state.dominant).toBe('analytical')
  })

  it('detects balanced patterns', () => {
    const balanced = calculatePatternMastery({ analytical: 3, patience: 3, exploring: 4, helping: 3, building: 4 })
    expect(balanced.balanced).toBe(true)

    const unbalanced = calculatePatternMastery({ analytical: 10, patience: 1, exploring: 1, helping: 1, building: 1 })
    expect(unbalanced.balanced).toBe(false)
  })
})
```

---

## Rollout & Backout

**Rollout:**
1. Deploy calculator + constants (no UI change)
2. Add badge to Journal behind feature flag
3. Enable Samuel promotions
4. Remove flag after 1 week observation

**Backout:**
- Calculator: No impact (doesn't change game state)
- UI: Disable flag, badge disappears
- Samuel: Remove promotion nodes from graph

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `calculatePatternMastery()` | <2ms |
| `checkPatternPromotions()` | <1ms |
| Rank badge render | <8ms |
| Progress animation | <16ms/frame |

---

## Claymore Design Principles Applied

| Claymore Principle | Lux Story Application |
|--------------------|----------------------|
| Numeric clarity (No. 1-47) | Level 0-4 with clear names |
| Generational stability | Ranks don't decay, only accumulate |
| Rank as identity | "I'm a Conductor" becomes meaningful |
| Lower rank = underdog | Traveler starting point creates journey |
| Defeating higher rank = momentous | Reaching Station Master is achievement |
