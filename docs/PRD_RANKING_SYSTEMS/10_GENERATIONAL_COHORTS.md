# Phase 10: Generational Cohorts

**PRD ID:** RANK-010
**Priority:** P3 (Enhancement)
**Commits:** 3-4
**Dependencies:** Phase 1, Phase 2, Phase 5
**Inspired By:** Claymore (Warrior generations, No. 1-47 within generation, Teresa's generation vs Clare's)

---

## INTEGRATION NOTE

**This PRD adds NEW functionality (cohorts) but reads from existing systems.**

**Existing data sources for percentile calculation:**
- `lib/orbs.ts` - `OrbBalance.totalEarned`: Pattern mastery proxy
- `lib/character-state.ts` - Career expertise aggregation
- `lib/character-state.ts` - `GameState.visitedScenes.size`: Engagement
- `lib/character-state.ts` - Character trust totals

**Privacy Considerations:**
- Cohort stats are **aggregated only** - no individual player data exposed
- Local-only mode uses simulated progression curves
- Percentiles show "Top X%" not exact rankings

**Existing Timestamp Source:**
```typescript
// Use existing GameState creation timestamp
// CRITICAL: createdAt MUST be set - fallback should never be used in production
const cohortId = getCohortId(gameState.createdAt)
```

**Schema Requirement:** `GameState.createdAt` must be non-null. The cohort system
depends on a known start time. Initialize `createdAt` when GameState is first created.

**No new schema fields required** - cohort ID is derived from existing timestamps.

---

## Target Outcome

Create a cohort system where players are grouped by when they started, enabling peer comparison and generational identity. Like Claymore's warrior generations, players can see how they compare to others who started at similar times.

**Success Criteria:**
- [ ] Automatic cohort assignment on first play
- [ ] Cohort-relative ranking display
- [ ] "Generation" identity label
- [ ] Anonymous peer comparison metrics
- [ ] Samuel references cohort standing

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Cohort duration | 1 month | Meaningful size, manageable comparison |
| Comparison data | Aggregated only | Privacy-preserving |
| Ranking within cohort | Percentile | No exact position (not competitive) |
| Display | Qualitative | "Top third" not "ranked #47" |

---

## System Design

### 1. Cohort Definition

```typescript
// lib/ranking/cohorts.ts

/**
 * Cohort system - Claymore generation inspired
 * Groups players by start period for peer comparison
 */
export interface Cohort {
  id: string              // e.g., "2026-01" for January 2026
  name: string            // e.g., "The January Travelers"
  startDate: number       // Timestamp
  endDate: number         // Timestamp
  thematicName?: string   // Optional special name for notable cohorts
}

export interface CohortMembership {
  cohortId: string
  joinedAt: number
  playerIdentifier: string  // Anonymous hash, not real ID
}

/**
 * Generate cohort ID from timestamp
 */
export function getCohortId(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Generate cohort name from ID
 */
export function getCohortName(cohortId: string): string {
  const [year, month] = cohortId.split('-')
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const monthName = monthNames[parseInt(month) - 1]
  return `The ${monthName} ${year} Travelers`
}

/**
 * Special cohort names for notable periods
 */
export const SPECIAL_COHORT_NAMES: Record<string, string> = {
  '2026-01': 'The Founders',      // Launch cohort
  '2026-02': 'The Pioneers',      // Early adopters
  // Add more as needed
}
```

### 2. Cohort Statistics

```typescript
// lib/ranking/cohort-stats.ts

/**
 * Aggregated cohort statistics (privacy-preserving)
 * No individual player data exposed
 */
export interface CohortStatistics {
  cohortId: string
  memberCount: number
  aggregates: CohortAggregates
  lastUpdated: number
}

export interface CohortAggregates {
  // Pattern mastery distribution
  patternMastery: {
    averageLevel: number
    levelDistribution: Record<number, number>  // level → percentage
    dominantPattern: PatternType | null
  }

  // Career expertise distribution
  careerExpertise: {
    averageMaxLevel: number
    popularDomains: CareerDomain[]
    championCount: number
  }

  // Station standing distribution
  stationStanding: {
    averageMeritPoints: number
    tierDistribution: Record<string, number>  // tier → percentage
  }

  // Engagement metrics
  engagement: {
    averageCharactersMet: number
    averageArcsCompleted: number
    averageSessionCount: number
  }
}

/**
 * Calculate player's percentile within cohort
 */
export function calculateCohortPercentile(
  playerValue: number,
  cohortDistribution: number[]
): number {
  const sorted = [...cohortDistribution].sort((a, b) => a - b)
  const position = sorted.findIndex(v => v >= playerValue)
  if (position === -1) return 100
  return Math.round((position / sorted.length) * 100)
}
```

### 3. Cohort Comparison

```typescript
// lib/ranking/cohort-comparison.ts

export interface CohortComparison {
  cohortId: string
  cohortName: string
  playerMetrics: PlayerCohortMetrics
  qualitativeStanding: QualitativeStanding
}

export interface PlayerCohortMetrics {
  patternMasteryPercentile: number
  careerExpertisePercentile: number
  stationStandingPercentile: number
  engagementPercentile: number
  overallPercentile: number
}

export type QualitativeStanding =
  | 'leading'      // Top 10%
  | 'ahead'        // Top 33%
  | 'with_peers'   // Middle 33%
  | 'developing'   // Bottom 33%
  | 'new'          // Insufficient data

/**
 * Get qualitative standing description
 */
export function getQualitativeDescription(standing: QualitativeStanding): string {
  const descriptions: Record<QualitativeStanding, string> = {
    leading: "Among the leaders of your generation",
    ahead: "Ahead of most in your cohort",
    with_peers: "Progressing with your peers",
    developing: "Finding your path at your own pace",
    new: "Just beginning your journey"
  }
  return descriptions[standing]
}

/**
 * Calculate overall cohort comparison
 */
export function calculateCohortComparison(
  playerState: GameState,
  patternMastery: PatternMasteryState,
  careerExpertise: CareerExpertiseState,
  cohortStats: CohortStatistics
): CohortComparison {
  // Calculate individual percentiles
  const patternMasteryPercentile = calculatePercentileFromDistribution(
    patternMastery.overall.level,
    cohortStats.aggregates.patternMastery.levelDistribution
  )

  const maxExpertise = Math.max(
    ...Object.values(careerExpertise.domains).map(d => d.level)
  )
  const careerExpertisePercentile = calculatePercentileFromDistribution(
    maxExpertise,
    cohortStats.aggregates.careerExpertise.levelDistribution ?? {}
  )

  const meritPoints = calculateMeritPoints(playerState).total
  const stationStandingPercentile = calculateMeritPercentile(
    meritPoints,
    cohortStats.aggregates.stationStanding
  )

  const engagementPercentile = calculateEngagementPercentile(
    playerState,
    cohortStats.aggregates.engagement
  )

  // Overall is weighted average
  const overallPercentile = Math.round(
    (patternMasteryPercentile * 0.25 +
     careerExpertisePercentile * 0.25 +
     stationStandingPercentile * 0.25 +
     engagementPercentile * 0.25)
  )

  // Determine qualitative standing
  let qualitativeStanding: QualitativeStanding
  if (cohortStats.memberCount < 10) {
    qualitativeStanding = 'new'
  } else if (overallPercentile >= 90) {
    qualitativeStanding = 'leading'
  } else if (overallPercentile >= 67) {
    qualitativeStanding = 'ahead'
  } else if (overallPercentile >= 33) {
    qualitativeStanding = 'with_peers'
  } else {
    qualitativeStanding = 'developing'
  }

  // CRITICAL: playerState.createdAt must be set - cohort system requires known start time
  if (!playerState.createdAt) {
    throw new Error('GameState.createdAt is required for cohort calculation')
  }

  return {
    cohortId: getCohortId(playerState.createdAt),
    cohortName: getCohortName(getCohortId(playerState.createdAt)),
    playerMetrics: {
      patternMasteryPercentile,
      careerExpertisePercentile,
      stationStandingPercentile,
      engagementPercentile,
      overallPercentile
    },
    qualitativeStanding
  }
}
```

### 4. Local-Only Implementation

```typescript
// lib/ranking/cohort-local.ts

/**
 * Local-only cohort simulation for offline/privacy mode
 * Uses simulated cohort data rather than real server data
 */

const SIMULATED_COHORT_PROGRESSION = {
  // Expected progression by weeks since start
  week1: { patternLevel: 0.5, expertiseLevel: 0.3, meritPoints: 15 },
  week2: { patternLevel: 1.0, expertiseLevel: 0.8, meritPoints: 40 },
  week4: { patternLevel: 1.5, expertiseLevel: 1.5, meritPoints: 75 },
  week8: { patternLevel: 2.5, expertiseLevel: 2.5, meritPoints: 120 },
  week12: { patternLevel: 3.0, expertiseLevel: 3.5, meritPoints: 180 }
}

/**
 * Generate simulated cohort comparison for offline mode
 *
 * @param playerState - Game state with required createdAt timestamp
 * @param patternMastery - Calculated pattern mastery state
 * @param careerExpertise - Calculated career expertise state
 * @param now - Current timestamp for calculating weeks elapsed (default: Date.now())
 */
export function getLocalCohortComparison(
  playerState: GameState,
  patternMastery: PatternMasteryState,
  careerExpertise: CareerExpertiseState,
  now: number = Date.now()
): CohortComparison {
  // CRITICAL: createdAt must be set for cohort calculation
  if (!playerState.createdAt) {
    throw new Error('GameState.createdAt is required for cohort calculation')
  }

  const startTime = playerState.createdAt
  const weeksElapsed = Math.floor((now - startTime) / (7 * 24 * 60 * 60 * 1000))

  // Get expected progression for this time
  const expected = getExpectedProgression(weeksElapsed)

  // Calculate percentiles based on comparison to expected
  const patternMasteryPercentile = compareToExpected(
    patternMastery.overall.level,
    expected.patternLevel
  )
  const maxExpertise = Math.max(
    ...Object.values(careerExpertise.domains).map(d => d.level)
  )
  const careerExpertisePercentile = compareToExpected(
    maxExpertise,
    expected.expertiseLevel
  )
  const meritPoints = calculateMeritPoints(playerState).total
  const stationStandingPercentile = compareToExpected(
    meritPoints,
    expected.meritPoints
  )

  // ... rest of calculation similar to server version
}
```

---

## UI Components

### 5. Cohort Standing Display

```typescript
// components/ranking/CohortStandingDisplay.tsx

interface CohortStandingDisplayProps {
  comparison: CohortComparison
}

export function CohortStandingDisplay({ comparison }: CohortStandingDisplayProps) {
  const standingColors: Record<QualitativeStanding, string> = {
    leading: 'text-amber-400',
    ahead: 'text-green-400',
    with_peers: 'text-blue-400',
    developing: 'text-slate-400',
    new: 'text-slate-500'
  }

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-300">Your Generation</h3>
          <p className="text-lg font-medium text-white">{comparison.cohortName}</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          "bg-slate-700/50",
          standingColors[comparison.qualitativeStanding]
        )}>
          {comparison.qualitativeStanding === 'leading' && '★ Leading'}
          {comparison.qualitativeStanding === 'ahead' && 'Ahead'}
          {comparison.qualitativeStanding === 'with_peers' && 'With Peers'}
          {comparison.qualitativeStanding === 'developing' && 'Developing'}
          {comparison.qualitativeStanding === 'new' && 'New'}
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        {getQualitativeDescription(comparison.qualitativeStanding)}
      </p>

      {/* Metric bars */}
      <div className="space-y-3">
        <MetricBar
          label="Pattern Mastery"
          percentile={comparison.playerMetrics.patternMasteryPercentile}
        />
        <MetricBar
          label="Career Expertise"
          percentile={comparison.playerMetrics.careerExpertisePercentile}
        />
        <MetricBar
          label="Station Standing"
          percentile={comparison.playerMetrics.stationStandingPercentile}
        />
      </div>
    </div>
  )
}

function MetricBar({ label, percentile }: { label: string; percentile: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300">Top {100 - percentile}%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentile}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Pattern Mastery | Percentile calculation | Input |
| Career Expertise | Percentile calculation | Input |
| Station Standing | Percentile calculation | Input |
| Game State | Cohort assignment | Input |
| Journal UI | Cohort display | Output |
| Samuel Dialogue | Cohort commentary | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 10.1 | Define cohort types | ID generation, naming | `lib/ranking/cohorts.ts` |
| 10.2 | Create stats types | Aggregates structure | `lib/ranking/cohort-stats.ts` |
| 10.3 | Implement comparison | Percentile calculation | `lib/ranking/cohort-comparison.ts` |
| 10.4 | Add local fallback | Offline simulation | `lib/ranking/cohort-local.ts` |
| 10.5 | Build display component | Standing visualization | `components/ranking/CohortStandingDisplay.tsx` |

---

## Tests & Verification

```typescript
describe('Generational Cohorts', () => {
  describe('Cohort ID Generation', () => {
    it('generates correct cohort ID', () => {
      const timestamp = new Date('2026-01-15').getTime()
      expect(getCohortId(timestamp)).toBe('2026-01')
    })

    it('generates correct cohort name', () => {
      expect(getCohortName('2026-01')).toBe('The January 2026 Travelers')
    })
  })

  describe('Qualitative Standing', () => {
    it('returns leading for top 10%', () => {
      const comparison = calculateCohortComparison(
        mockState,
        mockMastery,
        mockExpertise,
        { aggregates: { /* high values */ } }
      )
      expect(comparison.qualitativeStanding).toBe('leading')
    })

    it('returns new for small cohorts', () => {
      const comparison = calculateCohortComparison(
        mockState,
        mockMastery,
        mockExpertise,
        { memberCount: 5 }
      )
      expect(comparison.qualitativeStanding).toBe('new')
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `getCohortId()` | <1ms |
| `calculateCohortComparison()` | <5ms |
| Display render | <8ms |

---

## Privacy Considerations

1. **No Individual Data**: Only aggregated statistics shared
2. **Anonymous Identifiers**: Hash-based, not real user IDs
3. **Local Fallback**: Full functionality without server
4. **Percentile Only**: No exact rankings or positions
5. **Qualitative Display**: "Top third" not "ranked #47"

---

## Claymore Design Principles Applied

| Claymore Principle | Lux Story Application |
|-------------------|----------------------|
| Generational identity | Monthly cohorts with names |
| Within-generation ranking | Percentile standing |
| Teresa's generation vs Clare's | "The Founders" vs later cohorts |
| Numeric clarity (No. 1-47) | Percentile ranges (qualitative) |
| Generation-specific traits | Cohort aggregate characteristics |
