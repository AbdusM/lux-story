# Phase 12: Cross-System Resonance

**PRD ID:** RANK-012
**Priority:** P2 (Integration)
**Commits:** 4-6
**Dependencies:** All previous phases
**Inspired By:** All anime systems (integration layer that creates emergent behavior)

---

## INTEGRATION NOTE

**This PRD is the FINAL integration layer - it reads from all other systems.**

**Existing systems aggregated:**
- Phase 2: Pattern Mastery (uses `OrbTier` from `lib/orbs.ts`)
- Phase 3: Career Expertise (uses trust from `lib/constants.ts`)
- Phase 4: Challenge Rating (uses `ReadinessLevel` from `lib/schemas/player-data.ts`)
- Phase 5: Station Billboard (aggregates existing metrics)
- Phase 6: Skill Stars (uses `SkillCombo` from `lib/skill-combos.ts`)
- Phase 7: Assessment Arc (extends existing simulations)
- Phase 8: Elite Status (uses loyalty experiences)

**Resonance Conditions Check Existing State:**
```typescript
// All resonance checks read from existing GameState
condition: {
  check: (state: GameState, rankings: RankingState) => {
    // Use existing trust values
    const maya = state.characters.get('maya')
    return (maya?.trust ?? 0) >= 7
  }
}
```

**No New Tracking:** Resonance is calculated on-demand from existing state.

**Performance Constraint:**
`calculateUnifiedDashboard()` must complete in <50ms since it aggregates all systems.

---

## Target Outcome

Create an integration layer that enables ranking systems to influence each other, creating emergent gameplay moments. Like how anime power systems interact (Nen categories in HxH, Breathing + Demon Slayer Mark), our systems should create unexpected synergies.

**Success Criteria:**
- [ ] Resonance bonuses when systems align
- [ ] Cross-system achievement triggers
- [ ] Unified progression dashboard
- [ ] "Resonance Events" for system interactions
- [ ] Performance remains under budget

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Resonance types | 8 | Major system interactions |
| Bonus magnitude | 10-25% | Noticeable but not dominant |
| Calculation frequency | On state change | Not real-time |
| Dashboard load | <100ms | Aggregate view performance |

---

## System Design

### 1. Resonance Definitions

```typescript
// lib/ranking/resonance.ts

/**
 * Cross-system resonance - how ranking systems amplify each other
 * Creates emergent gameplay through system interactions
 */
export type ResonanceType =
  | 'pattern_expertise'     // Pattern mastery → Career expertise boost
  | 'expertise_standing'    // Career expertise → Station standing boost
  | 'standing_challenge'    // Station standing → Challenge rating adjustment
  | 'challenge_stars'       // Challenge success → Skill stars contribution
  | 'stars_elite'           // Skill stars → Elite status acceleration
  | 'elite_mastery'         // Elite status → Pattern mastery depth
  | 'assessment_expertise'  // Assessment success → Expertise validation
  | 'cohort_standing'       // Cohort position → Standing visibility

export interface ResonanceBonus {
  type: ResonanceType
  sourceSystem: RankCategory
  targetSystem: RankCategory
  multiplier: number        // 1.0 = no bonus, 1.25 = 25% bonus
  condition: ResonanceCondition
  description: string
}

export interface ResonanceCondition {
  sourceMinLevel: number
  additionalFlags?: string[]
  check: (state: GameState, rankings: RankingState) => boolean
}
```

### 2. Resonance Registry

```typescript
// lib/ranking/resonance-registry.ts

export const RESONANCE_BONUSES: ResonanceBonus[] = [
  {
    type: 'pattern_expertise',
    sourceSystem: 'pattern_mastery',
    targetSystem: 'career_expertise',
    multiplier: 1.15,
    condition: {
      sourceMinLevel: 2,  // Regular rank
      check: (state, rankings) =>
        rankings.ranks.pattern_mastery.currentLevel >= 2
    },
    description: "Your pattern awareness accelerates career learning"
  },

  {
    type: 'expertise_standing',
    sourceSystem: 'career_expertise',
    targetSystem: 'station_standing',
    multiplier: 1.20,
    condition: {
      sourceMinLevel: 3,  // Practitioner level
      check: (state, rankings) => {
        // Check if any domain is at Practitioner+
        const careerExpertise = calculateCareerExpertise(state)
        return Object.values(careerExpertise.domains).some(d => d.level >= 3)
      }
    },
    description: "Your expertise earns recognition at the station"
  },

  {
    type: 'standing_challenge',
    sourceSystem: 'station_standing',
    targetSystem: 'challenge_rating',
    multiplier: 1.10,
    condition: {
      sourceMinLevel: 2,  // Established standing
      check: (state, rankings) =>
        rankings.ranks.station_standing.currentLevel >= 2
    },
    description: "Your reputation opens doors to greater challenges"
  },

  {
    type: 'challenge_stars',
    sourceSystem: 'challenge_rating',
    targetSystem: 'skill_stars',
    multiplier: 1.15,
    condition: {
      sourceMinLevel: 3,  // Grade 3+
      additionalFlags: ['challenge_overcome'],
      check: (state, rankings) =>
        state.globalFlags.has('challenge_overcome') &&
        rankings.ranks.challenge_rating.currentLevel >= 3
    },
    description: "Overcoming challenges reveals your true contributions"
  },

  {
    type: 'stars_elite',
    sourceSystem: 'skill_stars',
    targetSystem: 'elite_status',
    multiplier: 1.25,
    condition: {
      sourceMinLevel: 6,  // 6+ total stars
      check: (state, rankings) => {
        const stars = calculateSkillStars(state, calculateCareerExpertise(state))
        return stars.totalStars >= 6
      }
    },
    description: "Your contributions mark you for elite recognition"
  },

  {
    type: 'elite_mastery',
    sourceSystem: 'elite_status',
    targetSystem: 'pattern_mastery',
    multiplier: 1.20,
    condition: {
      sourceMinLevel: 1,  // Any elite status
      check: (state) => {
        const eliteStatus = calculateEliteStatus(state, calculateCareerExpertise(state))
        return eliteStatus.unlockedDesignations.length > 0
      }
    },
    description: "Elite experience deepens your pattern understanding"
  },

  {
    type: 'assessment_expertise',
    sourceSystem: 'pattern_mastery',  // Assessment success
    targetSystem: 'career_expertise',
    multiplier: 1.15,
    condition: {
      additionalFlags: ['assessment_complete'],
      check: (state) => state.globalFlags.has('first_crossing_complete')
    },
    description: "Assessment success validates your career growth"
  },

  {
    type: 'cohort_standing',
    sourceSystem: 'pattern_mastery',  // Cohort position
    targetSystem: 'station_standing',
    multiplier: 1.10,
    condition: {
      check: (state) => {
        // Bonus for leading cohort
        const cohortComparison = getLocalCohortComparison(
          state,
          calculatePatternMastery(state.patterns),
          calculateCareerExpertise(state)
        )
        return cohortComparison.qualitativeStanding === 'leading'
      }
    },
    description: "Leading your generation amplifies your station presence"
  }
]

/**
 * Calculate all active resonance bonuses
 */
export function getActiveResonances(
  gameState: GameState,
  rankings: RankingState
): ResonanceBonus[] {
  return RESONANCE_BONUSES.filter(bonus =>
    bonus.condition.check(gameState, rankings)
  )
}

/**
 * Get total multiplier for a target system
 */
export function getResonanceMultiplier(
  targetSystem: RankCategory,
  gameState: GameState,
  rankings: RankingState
): number {
  const activeResonances = getActiveResonances(gameState, rankings)
  const relevantBonuses = activeResonances.filter(
    bonus => bonus.targetSystem === targetSystem
  )

  if (relevantBonuses.length === 0) return 1.0

  // Multiplicative stacking (diminishing returns)
  return relevantBonuses.reduce(
    (total, bonus) => total * bonus.multiplier,
    1.0
  )
}
```

### 3. Resonance Events

```typescript
// lib/ranking/resonance-events.ts

/**
 * Special events triggered by cross-system interactions
 */
export interface ResonanceEvent {
  id: string
  name: string
  description: string
  trigger: ResonanceEventTrigger
  reward: ResonanceEventReward
  samuelCommentary: string
}

export interface ResonanceEventTrigger {
  requiredResonances: ResonanceType[]  // Multiple resonances active
  additionalCondition?: (state: GameState, rankings: RankingState) => boolean
}

export interface ResonanceEventReward {
  type: 'pattern_bonus' | 'expertise_bonus' | 'merit_bonus' | 'flag'
  value: number | string
}

export const RESONANCE_EVENTS: ResonanceEvent[] = [
  {
    id: 'harmonic_convergence',
    name: 'Harmonic Convergence',
    description: 'Three or more systems resonate simultaneously',
    trigger: {
      requiredResonances: ['pattern_expertise', 'expertise_standing', 'standing_challenge']
    },
    reward: {
      type: 'pattern_bonus',
      value: 2
    },
    samuelCommentary: "The systems are singing together now. That doesn't happen often."
  },

  {
    id: 'elite_resonance',
    name: 'Elite Resonance',
    description: 'Elite status creates ripples across all systems',
    trigger: {
      requiredResonances: ['elite_mastery', 'stars_elite'],
      additionalCondition: (state) => {
        const eliteStatus = calculateEliteStatus(state, calculateCareerExpertise(state))
        return eliteStatus.unlockedDesignations.length >= 2
      }
    },
    reward: {
      type: 'merit_bonus',
      value: 25
    },
    samuelCommentary: "When you master multiple domains at the elite level... the station itself responds."
  },

  {
    id: 'assessment_amplification',
    name: 'Assessment Amplification',
    description: 'Assessment success amplifies career growth',
    trigger: {
      requiredResonances: ['assessment_expertise'],
      additionalCondition: (state) =>
        state.globalFlags.has('crossroads_trial_complete')
    },
    reward: {
      type: 'expertise_bonus',
      value: 5
    },
    samuelCommentary: "The trials weren't just tests. They were catalysts."
  },

  {
    id: 'generational_echo',
    name: 'Generational Echo',
    description: 'Leading your cohort creates lasting impact',
    trigger: {
      requiredResonances: ['cohort_standing', 'pattern_expertise'],
      additionalCondition: (state, rankings) =>
        rankings.ranks.pattern_mastery.currentLevel >= 3
    },
    reward: {
      type: 'flag',
      value: 'generational_leader'
    },
    samuelCommentary: "Your generation will remember you. That's not something I say lightly."
  }
]

/**
 * Check for triggered resonance events
 */
export function checkResonanceEvents(
  gameState: GameState,
  rankings: RankingState,
  completedEvents: string[]
): ResonanceEvent[] {
  const activeResonances = getActiveResonances(gameState, rankings)
  const activeTypes = new Set(activeResonances.map(r => r.type))

  return RESONANCE_EVENTS.filter(event => {
    // Skip completed events
    if (completedEvents.includes(event.id)) return false

    // Check all required resonances are active
    const hasAllResonances = event.trigger.requiredResonances.every(
      type => activeTypes.has(type)
    )
    if (!hasAllResonances) return false

    // Check additional condition if present
    if (event.trigger.additionalCondition) {
      return event.trigger.additionalCondition(gameState, rankings)
    }

    return true
  })
}
```

### 4. Unified Dashboard State

```typescript
// lib/ranking/unified-dashboard.ts

/**
 * Aggregate view of all ranking systems
 */
export interface UnifiedDashboardState {
  // Individual system states
  patternMastery: PatternMasteryState
  careerExpertise: CareerExpertiseState
  challengeRating: PlayerReadiness
  stationStanding: BillboardState
  skillStars: SkillStarsState
  eliteStatus: EliteStatusState
  assessments: AssessmentState
  cohort: CohortComparison

  // Resonance state
  activeResonances: ResonanceBonus[]
  pendingEvents: ResonanceEvent[]
  completedEvents: string[]

  // Ceremonies
  pendingCeremony: Ceremony | null
  ceremonyHistory: CeremonyRecord[]

  // Meta
  lastUpdated: number
  overallProgression: number  // 0-100 aggregate
}

/**
 * Calculate unified dashboard state
 *
 * @param gameState - Current game state (source of truth)
 * @param now - Timestamp for lastUpdated fields (default: Date.now())
 */
export function calculateUnifiedDashboard(
  gameState: GameState,
  now: number = Date.now()
): UnifiedDashboardState {
  // Calculate individual systems - pass now for determinism
  const patternMastery = calculatePatternMastery(gameState.patterns)
  const careerExpertise = calculateCareerExpertise(gameState, now)
  const challengeRating = calculatePlayerReadiness(patternMastery, careerExpertise, gameState)
  const stationStanding = generateBillboardState(gameState, now)
  const skillStars = calculateSkillStars(gameState, careerExpertise)
  const eliteStatus = calculateEliteStatus(gameState, careerExpertise)
  const assessments = getAssessmentState(gameState)
  const cohort = getLocalCohortComparison(gameState, patternMastery, careerExpertise, now)

  // Create rankings snapshot for resonance calculation
  // NOTE: points removed per Phase 2 - use getRankPoints() if needed
  const rankings: RankingState = {
    version: '1.0.0',
    playerId: gameState.playerId ?? 'anonymous',
    ranks: {
      pattern_mastery: {
        category: 'pattern_mastery',
        currentTierId: patternMastery.overall.tierId,
        currentLevel: patternMastery.overall.level,
        // points removed - computed view principle
        pointsToNext: 0,
        percentToNext: patternMastery.overall.percentToNext,
        // lastUpdated removed - use gameState.lastUpdated
      },
      // ... other categories
    },
    achievements: [],
    ceremonies: [],
    lastCalculated: now  // Use passed timestamp for determinism
  }

  // Calculate resonances
  const activeResonances = getActiveResonances(gameState, rankings)
  const completedEvents = Array.from(gameState.globalFlags)
    .filter(f => f.startsWith('resonance_event_'))
    .map(f => f.replace('resonance_event_', ''))
  const pendingEvents = checkResonanceEvents(gameState, rankings, completedEvents)

  // Check ceremonies
  const pendingCeremony = checkPendingCeremonies(
    gameState,
    rankings,
    {
      completedCeremonies: Array.from(gameState.globalFlags)
        .filter(f => f.startsWith('ceremony_'))
        .map(f => f.replace('_complete', '')),
      pendingCeremony: null,
      ceremonyHistory: [],
      lastCeremonyAt: null
    }
  )

  // Calculate overall progression (weighted average)
  const overallProgression = Math.round(
    (patternMastery.overall.level / 4) * 20 +
    (Math.max(...Object.values(careerExpertise.domains).map(d => d.level)) / 5) * 20 +
    (stationStanding.meritPoints / 150) * 20 +
    (skillStars.totalStars / 18) * 20 +
    (eliteStatus.unlockedDesignations.length / 5) * 20
  )

  return {
    patternMastery,
    careerExpertise,
    challengeRating,
    stationStanding,
    skillStars,
    eliteStatus,
    assessments,
    cohort,
    activeResonances,
    pendingEvents,
    completedEvents,
    pendingCeremony,
    ceremonyHistory: [],
    lastUpdated: now,  // Use passed timestamp for determinism
    overallProgression: Math.min(100, overallProgression)
  }
}
```

---

## UI Components

### 5. Resonance Indicator

```typescript
// components/ranking/ResonanceIndicator.tsx

interface ResonanceIndicatorProps {
  activeResonances: ResonanceBonus[]
}

export function ResonanceIndicator({ activeResonances }: ResonanceIndicatorProps) {
  if (activeResonances.length === 0) return null

  return (
    <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 bg-indigo-400 rounded-full"
        />
        <span className="text-sm font-medium text-indigo-300">
          {activeResonances.length} Resonance{activeResonances.length > 1 ? 's' : ''} Active
        </span>
      </div>

      <div className="space-y-1">
        {activeResonances.map(resonance => (
          <div key={resonance.type} className="flex items-center gap-2 text-xs">
            <span className="text-indigo-400">→</span>
            <span className="text-slate-300">{resonance.description}</span>
            <span className="text-indigo-300">
              +{Math.round((resonance.multiplier - 1) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 6. Unified Progress Dashboard

```typescript
// components/ranking/UnifiedProgressDashboard.tsx

interface UnifiedProgressDashboardProps {
  dashboard: UnifiedDashboardState
}

export function UnifiedProgressDashboard({ dashboard }: UnifiedProgressDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-white">Your Journey</h2>
          <span className="text-2xl font-bold text-amber-400">
            {dashboard.overallProgression}%
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${dashboard.overallProgression}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Active Resonances */}
      {dashboard.activeResonances.length > 0 && (
        <ResonanceIndicator activeResonances={dashboard.activeResonances} />
      )}

      {/* System Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <SystemCard
          title="Pattern Mastery"
          level={dashboard.patternMastery.overall.level}
          maxLevel={4}
          tierName={dashboard.patternMastery.overall.tierName}
          color="purple"
        />
        <SystemCard
          title="Career Expertise"
          level={Math.max(...Object.values(dashboard.careerExpertise.domains).map(d => d.level))}
          maxLevel={5}
          tierName={dashboard.careerExpertise.primaryDomain ?? 'Exploring'}
          color="green"
        />
        <SystemCard
          title="Station Standing"
          level={getStandingLevel(dashboard.stationStanding.standing)}
          maxLevel={3}
          tierName={dashboard.stationStanding.standingName}
          color="amber"
        />
        <SystemCard
          title="Skill Stars"
          level={dashboard.skillStars.totalStars}
          maxLevel={18}
          tierName={`${dashboard.skillStars.totalStars} Stars`}
          color="blue"
        />
      </div>

      {/* Pending Events */}
      {dashboard.pendingEvents.length > 0 && (
        <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
          <h3 className="text-sm font-medium text-amber-400 mb-2">
            Resonance Event Available
          </h3>
          <p className="text-sm text-slate-300">
            {dashboard.pendingEvents[0].name}: {dashboard.pendingEvents[0].description}
          </p>
        </div>
      )}

      {/* Cohort Standing */}
      <CohortStandingDisplay comparison={dashboard.cohort} />
    </div>
  )
}

function SystemCard({
  title,
  level,
  maxLevel,
  tierName,
  color
}: {
  title: string
  level: number
  maxLevel: number
  tierName: string
  color: string
}) {
  return (
    <div className={cn(
      "p-3 rounded-lg border",
      `bg-${color}-900/10 border-${color}-500/20`
    )}>
      <p className="text-xs text-slate-400 mb-1">{title}</p>
      <p className={cn("text-sm font-medium", `text-${color}-300`)}>
        {tierName}
      </p>
      <div className="mt-2 flex gap-0.5">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1 rounded-full",
              i < level ? `bg-${color}-400` : "bg-slate-700"
            )}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| All Ranking Systems | State aggregation | Input |
| Game State | Resonance flags | Both |
| Samuel Dialogue | Event commentary | Output |
| Journal UI | Dashboard display | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 12.1 | Define resonance types | 8 cross-system interactions | `lib/ranking/resonance.ts` |
| 12.2 | Create resonance registry | All bonuses with conditions | `lib/ranking/resonance-registry.ts` |
| 12.3 | Implement resonance events | 4 special events | `lib/ranking/resonance-events.ts` |
| 12.4 | Build unified dashboard | Aggregate state calculator | `lib/ranking/unified-dashboard.ts` |
| 12.5 | Create resonance indicator | Visual feedback | `components/ranking/ResonanceIndicator.tsx` |
| 12.6 | Add progress dashboard | Unified view | `components/ranking/UnifiedProgressDashboard.tsx` |

---

## Tests & Verification

```typescript
describe('Cross-System Resonance', () => {
  describe('Resonance Detection', () => {
    it('detects pattern-expertise resonance', () => {
      const rankings = createMockRankings({
        pattern_mastery: { currentLevel: 2 }
      })
      const resonances = getActiveResonances(createMockGameState(), rankings)
      expect(resonances.map(r => r.type)).toContain('pattern_expertise')
    })
  })

  describe('Multiplier Calculation', () => {
    it('stacks multiple bonuses multiplicatively', () => {
      const state = createMockGameState({ flags: ['challenge_overcome'] })
      const rankings = createMockRankings({
        pattern_mastery: { currentLevel: 2 },
        station_standing: { currentLevel: 2 }
      })
      const multiplier = getResonanceMultiplier('career_expertise', state, rankings)
      expect(multiplier).toBeGreaterThan(1.0)
    })
  })

  describe('Resonance Events', () => {
    it('triggers harmonic convergence', () => {
      const state = createMockGameState()
      const rankings = createMockRankings({
        pattern_mastery: { currentLevel: 3 },
        station_standing: { currentLevel: 3 }
      })
      const events = checkResonanceEvents(state, rankings, [])
      expect(events.map(e => e.id)).toContain('harmonic_convergence')
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `getActiveResonances()` | <3ms |
| `calculateUnifiedDashboard()` | <50ms |
| Dashboard render | <100ms |
| Resonance indicator | <5ms |

---

## Emergent Gameplay Examples

| Scenario | Resonances Active | Outcome |
|----------|-------------------|---------|
| Conductor + Practitioner + Established | pattern_expertise, expertise_standing, standing_challenge | "Harmonic Convergence" event, 2 bonus pattern points |
| 6+ stars + any Elite | stars_elite, elite_mastery | Accelerated path to second elite |
| Crossroads complete + Specialist | assessment_expertise | 15% faster expertise gain |
| Cohort leader + Regular | cohort_standing, pattern_expertise | "Generational Echo" flag |

---

## Design Philosophy

The resonance system creates **emergent gameplay** where:
1. Players discover unexpected synergies
2. Multiple paths lead to powerful combinations
3. No single "optimal" strategy dominates
4. Late-game play remains engaging through new interactions
5. Samuel's commentary contextualizes the magic
