# Phase 6: Skill Star Recognition

**PRD ID:** RANK-006
**Priority:** P2 (Enhancement)
**Commits:** 4-5
**Dependencies:** Phase 1, Phase 3
**Inspired By:** Hunter x Hunter (Hunter Stars for contributions, mentorship recognition)

---

## INTEGRATION NOTE

**This PRD uses existing skill combo and info tier systems as data sources.**

**Existing systems to reference (DO NOT REPLACE):**
- `lib/skill-combos.ts` - 12 combos (Tier 1: 2-skill, Tier 2: 3-skill)
- `lib/skill-combo-detector.ts` - `detectUnlockedCombos()`, `getComboProgress()`
- `lib/trust-derivatives.ts` - `InfoValueTier`: common→legendary with trust requirements
- `lib/pattern-unlocks.ts` - 15 pattern unlocks at 10%/50%/85%

**⚠️ CRITICAL: Skill Combos FULLY IMPLEMENTED (lib/skill-combos.ts)**
```typescript
// 12 combos ALREADY TRACKED - DO NOT RECREATE TRACKING
// Tier 1 (2-skill): strategic_empathy, technical_storyteller, ethical_analyst, resilient_leader, community_architect
// Tier 2 (3-skill): innovation_catalyst, data_storyteller, cultural_bridge, financial_mentor, adaptive_creator
// Tier 3 (4+ skill): holistic_systems_thinker, birmingham_champion

// EXISTING FUNCTIONS:
// detectUnlockedCombos(skills) - Returns unlocked combos
// getComboProgress(skills, comboId) - Progress toward specific combo
```

**⚠️ Synthesis Star = DISPLAY LAYER over existing combos**
The "Synthesis" contribution type tracks the EXACT SAME DATA as skill combos.
Implementation should call `detectUnlockedCombos()` and map count to star level.
NO NEW TRACKING LOGIC REQUIRED.

**Star Mapping (DISPLAY ONLY - uses existing data):**
| Star Type | Data Source | Bronze | Silver | Gold |
|-----------|-------------|--------|--------|------|
| Synthesis | `detectUnlockedCombos().length` | 1 combo | 4 combos | 12 combos |
| Discovery | InfoValueTier discoveries | 5 uncommon | 3 rare | 1 legendary |
| Depth | pattern-unlocks | 1 pattern 50% | 1 pattern 85% | All 5 at 50% |

---

## Target Outcome

Create a contribution-based honor system where stars represent **existing combo/unlock achievements**. Stars are a display layer over existing tracking.

**Success Criteria:**
- [ ] 3 star levels (Bronze → Silver → Gold)
- [ ] Stars awarded for specific contribution types
- [ ] Visible star display on player profile
- [ ] NPCs reference star status
- [ ] Rare "Triple Star" achievement for exceptional play

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Star levels | 3 | HxH's single/double/triple simplified |
| Contribution types | 6 | Mentorship, Discovery, Depth, Breadth, Resilience, Synthesis |
| Max stars | 18 (3 per type × 6 types) | Ceiling creates aspirational goal |
| Display | Subtle constellation | Stars form a pattern, not a number |

---

## System Design

### 1. Contribution Types

```typescript
// lib/ranking/skill-stars.ts

/**
 * Contribution categories - HxH-inspired
 * Stars earned through quality, not grinding
 */
export type ContributionType =
  | 'mentorship'    // Deep relationships with characters
  | 'discovery'     // Uncovering hidden content
  | 'depth'         // Mastering a single domain
  | 'breadth'       // Exploring multiple domains
  | 'resilience'    // Persevering through challenges
  | 'synthesis'     // Combining knowledge across areas

export type StarLevel = 0 | 1 | 2 | 3  // None, Bronze, Silver, Gold

export const CONTRIBUTION_METADATA: Record<ContributionType, {
  name: string
  description: string
  icon: string
  criteria: {
    bronze: string
    silver: string
    gold: string
  }
}> = {
  mentorship: {
    name: 'Mentorship Star',
    description: 'For building deep, meaningful relationships',
    icon: '🤝',
    criteria: {
      bronze: 'Reach Trust 7 with one character',
      silver: 'Reach Trust 8 with three characters',
      gold: 'Complete vulnerability arc with five characters'
    }
  },
  discovery: {
    name: 'Discovery Star',
    description: 'For uncovering the station\'s secrets',
    icon: '🔍',
    criteria: {
      bronze: 'Discover 10 hidden knowledge flags',
      silver: 'Unlock 5 secret dialogue paths',
      gold: 'Find all iceberg-level content'
    }
  },
  depth: {
    name: 'Depth Star',
    description: 'For mastering a single career domain',
    icon: '🎯',
    criteria: {
      bronze: 'Reach Practitioner in one domain',
      silver: 'Reach Specialist in one domain',
      gold: 'Achieve Champion status in one domain'
    }
  },
  breadth: {
    name: 'Breadth Star',
    description: 'For exploring widely across career paths',
    icon: '🌐',
    criteria: {
      bronze: 'Explore all 5 career domains',
      silver: 'Reach Apprentice in 4 domains',
      gold: 'Reach Practitioner in all 5 domains'
    }
  },
  resilience: {
    name: 'Resilience Star',
    description: 'For persevering through difficult moments',
    icon: '💪',
    criteria: {
      bronze: 'Complete a simulation with imperfect choices',
      silver: 'Recover trust after a setback',
      gold: 'Navigate three character crisis moments'
    }
  },
  synthesis: {
    name: 'Synthesis Star',
    description: 'For connecting knowledge across domains',
    icon: '✨',
    criteria: {
      bronze: 'Trigger one cross-character insight',
      silver: 'Complete a skill combo',
      gold: 'Unlock all 12 skill combos'
    }
  }
}
```

### 2. Star Calculator

```typescript
// lib/ranking/star-calculator.ts

export interface SkillStarsState {
  stars: Record<ContributionType, StarLevel>
  totalStars: number
  highestCategory: ContributionType | null
  isTripleStar: boolean  // All categories at gold
  recentAward?: {
    type: ContributionType
    level: StarLevel
    timestamp: number
  }
}

/**
 * Calculate stars from game state
 * HxH principle: Quality over quantity
 */
export function calculateSkillStars(
  gameState: GameState,
  careerExpertise: CareerExpertiseState
): SkillStarsState {
  const stars: Record<ContributionType, StarLevel> = {
    mentorship: calculateMentorshipStar(gameState),
    discovery: calculateDiscoveryStar(gameState),
    depth: calculateDepthStar(careerExpertise),
    breadth: calculateBreadthStar(careerExpertise),
    resilience: calculateResilienceStar(gameState),
    synthesis: calculateSynthesisStar(gameState)
  }

  const totalStars = Object.values(stars).reduce((sum, level) => sum + level, 0)

  // Find highest category
  let highestCategory: ContributionType | null = null
  let highestLevel = 0
  for (const [type, level] of Object.entries(stars)) {
    if (level > highestLevel) {
      highestLevel = level
      highestCategory = type as ContributionType
    }
  }

  // Triple star: all categories at gold
  const isTripleStar = Object.values(stars).every(level => level === 3)

  return {
    stars,
    totalStars,
    highestCategory,
    isTripleStar
  }
}

function calculateMentorshipStar(gameState: GameState): StarLevel {
  const characters = Array.from(gameState.characters.values())
  const highTrust = characters.filter(c => c.trust >= 7).length
  const veryHighTrust = characters.filter(c => c.trust >= 8).length
  const arcsComplete = Array.from(gameState.globalFlags)
    .filter(f => f.endsWith('_vulnerability_revealed')).length

  if (arcsComplete >= 5) return 3
  if (veryHighTrust >= 3) return 2
  if (highTrust >= 1) return 1
  return 0
}

function calculateDiscoveryStar(gameState: GameState): StarLevel {
  const discoveries = gameState.globalFlags.size
  const secretPaths = Array.from(gameState.globalFlags)
    .filter(f => f.includes('secret_') || f.includes('hidden_')).length
  const icebergContent = Array.from(gameState.globalFlags)
    .filter(f => f.includes('iceberg_')).length

  if (icebergContent >= 10) return 3  // All iceberg content
  if (secretPaths >= 5) return 2
  if (discoveries >= 10) return 1
  return 0
}

function calculateDepthStar(expertise: CareerExpertiseState): StarLevel {
  const domains = Object.values(expertise.domains)
  const hasChampion = domains.some(d => d.isChampion)
  const hasSpecialist = domains.some(d => d.level >= 4)
  const hasPractitioner = domains.some(d => d.level >= 3)

  if (hasChampion) return 3
  if (hasSpecialist) return 2
  if (hasPractitioner) return 1
  return 0
}

function calculateBreadthStar(expertise: CareerExpertiseState): StarLevel {
  const domains = Object.values(expertise.domains)
  const explored = domains.filter(d => d.level >= 1).length
  const apprentice = domains.filter(d => d.level >= 2).length
  const practitioner = domains.filter(d => d.level >= 3).length

  if (practitioner === 5) return 3
  if (apprentice >= 4) return 2
  if (explored === 5) return 1
  return 0
}

function calculateResilienceStar(gameState: GameState): StarLevel {
  const flags = gameState.globalFlags
  const imperfectSim = flags.has('simulation_imperfect_completion')
  const trustRecovery = flags.has('trust_recovery_achieved')
  const crisisNav = Array.from(flags)
    .filter(f => f.includes('crisis_navigated')).length

  if (crisisNav >= 3) return 3
  if (trustRecovery) return 2
  if (imperfectSim) return 1
  return 0
}

function calculateSynthesisStar(gameState: GameState): StarLevel {
  const flags = gameState.globalFlags
  const crossInsights = Array.from(flags)
    .filter(f => f.includes('cross_character_insight')).length
  const skillCombos = Array.from(flags)
    .filter(f => f.includes('skill_combo_unlocked')).length

  if (skillCombos >= 12) return 3  // All combos
  if (skillCombos >= 1) return 2
  if (crossInsights >= 1) return 1
  return 0
}
```

### 3. Star Award Detection

```typescript
// lib/ranking/star-awards.ts

export interface StarAward {
  contributionType: ContributionType
  newLevel: StarLevel
  previousLevel: StarLevel
  message: string
}

/**
 * Detect star level changes between states
 */
export function detectStarAwards(
  previousStars: SkillStarsState,
  currentStars: SkillStarsState
): StarAward[] {
  const awards: StarAward[] = []

  for (const type of Object.keys(previousStars.stars) as ContributionType[]) {
    const prev = previousStars.stars[type]
    const curr = currentStars.stars[type]

    if (curr > prev) {
      awards.push({
        contributionType: type,
        newLevel: curr,
        previousLevel: prev,
        message: getStarAwardMessage(type, curr)
      })
    }
  }

  return awards
}

function getStarAwardMessage(type: ContributionType, level: StarLevel): string {
  const levelNames = ['', 'Bronze', 'Silver', 'Gold']
  const metadata = CONTRIBUTION_METADATA[type]
  return `You've earned the ${levelNames[level]} ${metadata.name}!`
}
```

---

## UI Components

### 4. Star Constellation Display

```typescript
// components/ranking/SkillStarConstellation.tsx

interface SkillStarConstellationProps {
  stars: SkillStarsState
  size?: 'sm' | 'md' | 'lg'
}

export function SkillStarConstellation({ stars, size = 'md' }: SkillStarConstellationProps) {
  const starColors = {
    0: 'text-slate-700',
    1: 'text-amber-700',   // Bronze
    2: 'text-slate-300',   // Silver
    3: 'text-amber-400'    // Gold
  }

  // Arrange stars in constellation pattern
  const positions = [
    { type: 'mentorship', x: 50, y: 15 },
    { type: 'discovery', x: 85, y: 35 },
    { type: 'depth', x: 75, y: 75 },
    { type: 'breadth', x: 25, y: 75 },
    { type: 'resilience', x: 15, y: 35 },
    { type: 'synthesis', x: 50, y: 50 }  // Center
  ]

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Connection lines */}
        <g stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.5">
          <line x1="50" y1="15" x2="85" y2="35" />
          <line x1="85" y1="35" x2="75" y2="75" />
          <line x1="75" y1="75" x2="25" y2="75" />
          <line x1="25" y1="75" x2="15" y2="35" />
          <line x1="15" y1="35" x2="50" y2="15" />
          <line x1="50" y1="50" x2="50" y2="15" />
          <line x1="50" y1="50" x2="85" y2="35" />
          <line x1="50" y1="50" x2="75" y2="75" />
          <line x1="50" y1="50" x2="25" y2="75" />
          <line x1="50" y1="50" x2="15" y2="35" />
        </g>

        {/* Stars */}
        {positions.map(({ type, x, y }) => {
          const level = stars.stars[type as ContributionType]
          return (
            <g key={type} transform={`translate(${x}, ${y})`}>
              <Star
                className={cn(
                  "w-4 h-4 -translate-x-2 -translate-y-2",
                  starColors[level],
                  level > 0 && "drop-shadow-[0_0_4px_currentColor]"
                )}
                fill={level > 0 ? "currentColor" : "none"}
              />
            </g>
          )
        })}
      </svg>

      {/* Triple star indicator */}
      {stars.isTripleStar && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-amber-400 animate-pulse">★★★</span>
        </div>
      )}
    </div>
  )
}
```

### 5. Star Details Panel

```typescript
// components/ranking/StarDetailsPanel.tsx

interface StarDetailsPanelProps {
  stars: SkillStarsState
}

export function StarDetailsPanel({ stars }: StarDetailsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Contribution Stars</h3>
        <span className="text-amber-400 font-bold">{stars.totalStars}/18</span>
      </div>

      <div className="space-y-3">
        {(Object.keys(CONTRIBUTION_METADATA) as ContributionType[]).map(type => {
          const metadata = CONTRIBUTION_METADATA[type]
          const level = stars.stars[type]

          return (
            <div key={type} className="flex items-start gap-3">
              <span className="text-lg">{metadata.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{metadata.name}</span>
                  <StarLevelIndicator level={level} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {level < 3 ? metadata.criteria[['bronze', 'silver', 'gold'][level] as keyof typeof metadata.criteria] : 'Mastered'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StarLevelIndicator({ level }: { level: StarLevel }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star
          key={i}
          className={cn(
            "w-3 h-3",
            i <= level
              ? i === 3 ? "text-amber-400" : i === 2 ? "text-slate-300" : "text-amber-700"
              : "text-slate-700"
          )}
          fill={i <= level ? "currentColor" : "none"}
        />
      ))}
    </div>
  )
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Career Expertise | Depth/Breadth stars | Input |
| Trust System | Mentorship star | Input |
| Knowledge System | Discovery star | Input |
| Skill Combos | Synthesis star | Input |
| Samuel Dialogue | Star award announcements | Output |
| Journal UI | Constellation display | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 6.1 | Define contribution types | 6 types with criteria | `lib/ranking/skill-stars.ts` |
| 6.2 | Implement star calculator | Per-type calculation | `lib/ranking/star-calculator.ts` |
| 6.3 | Add award detection | Tracks level changes | `lib/ranking/star-awards.ts` |
| 6.4 | Create constellation component | Visual star display | `components/ranking/SkillStarConstellation.tsx` |
| 6.5 | Add details panel | Criteria + progress | `components/ranking/StarDetailsPanel.tsx` |

---

## Tests & Verification

```typescript
describe('Skill Star System', () => {
  describe('Mentorship Star', () => {
    it('awards bronze at trust 7', () => {
      const state = createMockGameState({
        characters: new Map([['maya', { trust: 7 }]])
      })
      const stars = calculateSkillStars(state, mockExpertise)
      expect(stars.stars.mentorship).toBe(1)
    })
  })

  describe('Triple Star', () => {
    it('detects when all categories are gold', () => {
      const stars = createMockStarsState({ allGold: true })
      expect(stars.isTripleStar).toBe(true)
    })
  })

  describe('Award Detection', () => {
    it('detects star level increase', () => {
      const prev = createMockStarsState({ mentorship: 1 })
      const curr = createMockStarsState({ mentorship: 2 })
      const awards = detectStarAwards(prev, curr)
      expect(awards).toHaveLength(1)
      expect(awards[0].newLevel).toBe(2)
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `calculateSkillStars()` | <5ms |
| `detectStarAwards()` | <1ms |
| Constellation render | <8ms |
| Details panel render | <10ms |

---

## HxH Design Principles Applied

| HxH Principle | Lux Story Application |
|---------------|----------------------|
| Single/Double/Triple stars | Bronze/Silver/Gold levels |
| Contribution-based, not exam-based | Quality actions trigger stars |
| Stars represent specialization | 6 contribution categories |
| Rare triple-star status | All gold = exceptional achievement |
| Mentorship important | Mentorship is a star category |
