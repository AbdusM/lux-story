# Phase 4: Challenge Rating System

**PRD ID:** RANK-004
**Priority:** P2 (Enhancement)
**Commits:** 4-6
**Dependencies:** Phase 1, Phase 2
**Inspired By:** Jujutsu Kaisen (Grades 4→1→Special, parallel hero/threat ratings)

---

## INTEGRATION NOTE

**This PRD maps to existing readiness and state condition systems.**

**Existing systems to reference (DO NOT REPLACE):**
- `lib/schemas/player-data.ts` - `ReadinessLevel`: exploratory | emerging | near_ready | ready
- `lib/character-state.ts` - `StateCondition` interface (trust, patterns, flags)
- `lib/dialogue-graph.ts` - `requiredState`, `visibleCondition` on choices
- `lib/choice-adapter.ts` - `OrbFillRequirement` for KOTOR-style locked choices

**Grade Mapping to Existing ReadinessLevel:**
| PRD Grade | ReadinessLevel | Description |
|-----------|----------------|-------------|
| 1 (Foundational) | exploratory | Entry-level |
| 2 (Developing) | emerging | Building skills |
| 3 (Established) | near_ready | Real challenges |
| 4-5 (Advanced+) | ready | Expert level |

---

## Target Outcome

Create a dual rating system that matches player readiness to career challenges. Uses **existing `ReadinessLevel`** as data source, adding JJK-style qualitative labels.

**Success Criteria:**
- [ ] 5 challenge grades (Foundational → Advanced → Expert → Specialist → Transformational)
- [ ] Player readiness rating (same 5 grades)
- [ ] Match logic: recommend challenges at or below player grade
- [ ] Warning UI when player considers above-grade challenge
- [ ] Samuel commentary on challenge/readiness mismatch

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Grade levels | 5 | Simpler than JJK's 4+Special; clearer for careers |
| Match tolerance | ±1 grade | Allow stretch opportunities |
| Display | Qualitative, not numeric | "You're ready for this" not "Grade 3" |
| No blocking | Warn, don't prevent | Player agency over gatekeeping |

---

## System Design

### 1. Challenge Grade Definitions

```typescript
// lib/ranking/challenge-grades.ts

/**
 * Challenge grades - JJK-inspired difficulty classification
 * Applied to careers, conversations, and opportunities
 */
export type ChallengeGrade = 1 | 2 | 3 | 4 | 5

export const CHALLENGE_GRADE_METADATA: Record<ChallengeGrade, {
  name: string
  description: string
  playerDescriptor: string  // How to describe player at this level
  exampleChallenges: string[]
}> = {
  1: {
    name: 'Foundational',
    description: 'Entry-level exploration, low stakes',
    playerDescriptor: 'Just getting started',
    exampleChallenges: ['First conversation with a character', 'Learning basic concepts']
  },
  2: {
    name: 'Developing',
    description: 'Building skills, moderate complexity',
    playerDescriptor: 'Building your foundation',
    exampleChallenges: ['Understanding career tradeoffs', 'Practicing skills in context']
  },
  3: {
    name: 'Established',
    description: 'Meaningful challenges, real consequences',
    playerDescriptor: 'Ready for real challenges',
    exampleChallenges: ['Complex ethical dilemmas', 'Career pivots', 'Leadership scenarios']
  },
  4: {
    name: 'Advanced',
    description: 'Expert-level scenarios, high complexity',
    playerDescriptor: 'Operating at a high level',
    exampleChallenges: ['Crisis management', 'Strategic decisions', 'Mentoring others']
  },
  5: {
    name: 'Transformational',
    description: 'Career-defining moments, mastery required',
    playerDescriptor: 'Ready for anything',
    exampleChallenges: ['Industry disruption', 'Creating new paths', 'Systemic change']
  }
}
```

### 2. Player Readiness Calculator

```typescript
// lib/ranking/player-readiness.ts

export interface PlayerReadiness {
  overallGrade: ChallengeGrade
  domainGrades: Record<CareerDomain, ChallengeGrade>
  confidence: 'low' | 'medium' | 'high'  // How certain we are of the rating
  evidence: ReadinessEvidence[]
}

export interface ReadinessEvidence {
  factor: string
  contribution: number  // Points toward grade
  description: string
}

/**
 * Calculate player's readiness grade
 * Aggregates from pattern mastery, career expertise, trust depth
 */
export function calculatePlayerReadiness(
  patternMastery: PatternMasteryState,
  careerExpertise: CareerExpertiseState,
  gameState: GameState
): PlayerReadiness {
  const evidence: ReadinessEvidence[] = []
  let totalScore = 0

  // Factor 1: Pattern mastery level (max 20 points)
  const patternScore = patternMastery.overall.level * 5
  evidence.push({
    factor: 'Pattern Development',
    contribution: patternScore,
    description: `${patternMastery.overall.tierName} level patterns`
  })
  totalScore += patternScore

  // Factor 2: Career expertise breadth (max 15 points)
  const domainsExplored = Object.values(careerExpertise.domains)
    .filter(d => d.level >= 1).length
  const breadthScore = domainsExplored * 3
  evidence.push({
    factor: 'Career Breadth',
    contribution: breadthScore,
    description: `${domainsExplored} career domains explored`
  })
  totalScore += breadthScore

  // Factor 3: Deep relationships (max 15 points)
  const deepRelationships = Array.from(gameState.characters.values())
    .filter(c => c.trust >= 7).length
  const relationshipScore = deepRelationships * 3
  evidence.push({
    factor: 'Deep Relationships',
    contribution: relationshipScore,
    description: `${deepRelationships} trusted mentors`
  })
  totalScore += Math.min(relationshipScore, 15)

  // Factor 4: Completed arcs (max 20 points)
  const arcsComplete = Array.from(gameState.globalFlags)
    .filter(f => f.endsWith('_arc_complete')).length
  const arcScore = arcsComplete * 4
  evidence.push({
    factor: 'Completed Journeys',
    contribution: arcScore,
    description: `${arcsComplete} character arcs completed`
  })
  totalScore += Math.min(arcScore, 20)

  // Convert total score to grade (max ~70 points possible)
  const overallGrade = scoreToGrade(totalScore)

  // Calculate per-domain grades
  const domainGrades = {} as Record<CareerDomain, ChallengeGrade>
  for (const [domain, expertise] of Object.entries(careerExpertise.domains)) {
    domainGrades[domain as CareerDomain] = expertiseLevelToGrade(expertise.level)
  }

  // Confidence based on evidence quantity
  const confidence = evidence.length >= 4 && totalScore >= 20 ? 'high' :
                     evidence.length >= 2 ? 'medium' : 'low'

  return {
    overallGrade,
    domainGrades,
    confidence,
    evidence
  }
}

function scoreToGrade(score: number): ChallengeGrade {
  if (score >= 50) return 5
  if (score >= 35) return 4
  if (score >= 20) return 3
  if (score >= 10) return 2
  return 1
}

function expertiseLevelToGrade(level: number): ChallengeGrade {
  // Expertise levels 0-5 map to grades 1-5
  return Math.min(5, Math.max(1, level + 1)) as ChallengeGrade
}
```

### 3. Challenge-Readiness Matching

```typescript
// lib/ranking/challenge-matching.ts

export interface ChallengeMatch {
  challengeGrade: ChallengeGrade
  playerGrade: ChallengeGrade
  matchType: 'perfect' | 'stretch' | 'comfortable' | 'overreach' | 'underreach'
  recommendation: string
  shouldWarn: boolean
}

/**
 * Match player readiness to a challenge grade
 * JJK principle: Grade N sorcerer should face Grade N or lower curses
 */
export function matchChallengeToPlayer(
  challengeGrade: ChallengeGrade,
  playerReadiness: PlayerReadiness,
  domain?: CareerDomain
): ChallengeMatch {
  const playerGrade = domain
    ? playerReadiness.domainGrades[domain]
    : playerReadiness.overallGrade

  const difference = challengeGrade - playerGrade

  if (difference === 0) {
    return {
      challengeGrade,
      playerGrade,
      matchType: 'perfect',
      recommendation: "This challenge matches your current level perfectly.",
      shouldWarn: false
    }
  }

  if (difference === 1) {
    return {
      challengeGrade,
      playerGrade,
      matchType: 'stretch',
      recommendation: "This is a stretch opportunity. You'll grow, but it won't be easy.",
      shouldWarn: false
    }
  }

  if (difference === -1) {
    return {
      challengeGrade,
      playerGrade,
      matchType: 'comfortable',
      recommendation: "You're well-prepared for this. Consider if you want more challenge.",
      shouldWarn: false
    }
  }

  if (difference >= 2) {
    return {
      challengeGrade,
      playerGrade,
      matchType: 'overreach',
      recommendation: "This challenge may be beyond your current readiness. More preparation could help.",
      shouldWarn: true
    }
  }

  // difference <= -2
  return {
    challengeGrade,
    playerGrade,
    matchType: 'underreach',
    recommendation: "You've outgrown this level. Seek greater challenges.",
    shouldWarn: false
  }
}
```

### 4. Graded Content Tagging

```typescript
// lib/ranking/content-grading.ts

/**
 * Tag dialogue nodes, choices, and careers with challenge grades
 * Content authors assign grades; system enforces matching
 */
export interface GradedContent {
  contentId: string
  contentType: 'dialogue' | 'choice' | 'career' | 'simulation'
  challengeGrade: ChallengeGrade
  domain?: CareerDomain
  gradeReason: string  // Why this grade was assigned
}

// Example: Grade conversation nodes
export const GRADED_CONVERSATIONS: GradedContent[] = [
  {
    contentId: 'maya_introduction',
    contentType: 'dialogue',
    challengeGrade: 1,
    domain: 'technology',
    gradeReason: 'Initial meeting, no prerequisites'
  },
  {
    contentId: 'maya_simulation_crisis',
    contentType: 'simulation',
    challengeGrade: 4,
    domain: 'technology',
    gradeReason: 'Complex technical crisis requiring quick decisions'
  },
  {
    contentId: 'marcus_impossible_choice',
    contentType: 'dialogue',
    challengeGrade: 5,
    domain: 'healthcare',
    gradeReason: 'Life-or-death ethical dilemma'
  }
]
```

---

## UI Components

### 5. Challenge Grade Indicator

```typescript
// components/ranking/ChallengeGradeIndicator.tsx

interface ChallengeGradeIndicatorProps {
  challengeGrade: ChallengeGrade
  playerGrade: ChallengeGrade
  showMatch?: boolean
  size?: 'sm' | 'md'
}

export function ChallengeGradeIndicator({
  challengeGrade,
  playerGrade,
  showMatch = true,
  size = 'md'
}: ChallengeGradeIndicatorProps) {
  const match = matchChallengeToPlayer(challengeGrade, { overallGrade: playerGrade } as PlayerReadiness)
  const gradeData = CHALLENGE_GRADE_METADATA[challengeGrade]

  const matchColors = {
    perfect: 'text-green-400',
    stretch: 'text-amber-400',
    comfortable: 'text-blue-400',
    overreach: 'text-red-400',
    underreach: 'text-slate-400'
  }

  return (
    <div className={cn("flex items-center gap-2", size === 'sm' ? 'text-xs' : 'text-sm')}>
      {/* Grade pip visualization */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(g => (
          <div
            key={g}
            className={cn(
              "w-2 h-2 rounded-full",
              g <= challengeGrade ? 'bg-indigo-400' : 'bg-slate-700'
            )}
          />
        ))}
      </div>

      <span className="text-slate-300">{gradeData.name}</span>

      {showMatch && (
        <span className={matchColors[match.matchType]}>
          {match.matchType === 'perfect' && '✓ Perfect match'}
          {match.matchType === 'stretch' && '↑ Stretch'}
          {match.matchType === 'comfortable' && '↓ Comfortable'}
          {match.matchType === 'overreach' && '⚠ Challenging'}
          {match.matchType === 'underreach' && '○ Below level'}
        </span>
      )}
    </div>
  )
}
```

### 6. Mismatch Warning Dialog

```typescript
// components/ranking/ChallengeMismatchWarning.tsx

interface ChallengeMismatchWarningProps {
  match: ChallengeMatch
  onProceed: () => void
  onPrepare: () => void  // Navigate to preparation content
}

export function ChallengeMismatchWarning({
  match,
  onProceed,
  onPrepare
}: ChallengeMismatchWarningProps) {
  if (!match.shouldWarn) return null

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>This might be challenging</DialogTitle>
        </DialogHeader>

        <p className="text-slate-300">{match.recommendation}</p>

        <p className="text-sm text-slate-400 mt-2">
          Your current readiness: {CHALLENGE_GRADE_METADATA[match.playerGrade].playerDescriptor}
        </p>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onPrepare}>
            Prepare first
          </Button>
          <Button onClick={onProceed}>
            Proceed anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Pattern Mastery | Factor in readiness | Input |
| Career Expertise | Domain-specific grades | Input |
| Dialogue Graph | Grade tags on nodes | Input |
| Career Recommendations | Match filtering | Output |
| Samuel Dialogue | Mismatch commentary | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 4.1 | Define challenge grades | 5 grades with metadata | `lib/ranking/challenge-grades.ts` |
| 4.2 | Implement readiness calculator | Aggregates from existing systems | `lib/ranking/player-readiness.ts` |
| 4.3 | Create matching logic | Match types and recommendations | `lib/ranking/challenge-matching.ts` |
| 4.4 | Tag sample content | Grade 20+ existing nodes | `lib/ranking/content-grading.ts` |
| 4.5 | Create grade indicator | Visual component | `components/ranking/ChallengeGradeIndicator.tsx` |
| 4.6 | Add mismatch warning | Dialog for overreach | `components/ranking/ChallengeMismatchWarning.tsx` |

---

## Tests & Verification

```typescript
describe('Challenge Rating System', () => {
  describe('Player Readiness', () => {
    it('calculates grade from combined factors', () => {
      const readiness = calculatePlayerReadiness(
        { overall: { level: 2 } } as PatternMasteryState,
        { domains: { technology: { level: 2 } } } as CareerExpertiseState,
        createMockGameState({ arcsComplete: 3 })
      )
      expect(readiness.overallGrade).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Challenge Matching', () => {
    it('returns perfect match for equal grades', () => {
      const match = matchChallengeToPlayer(3, { overallGrade: 3 } as PlayerReadiness)
      expect(match.matchType).toBe('perfect')
      expect(match.shouldWarn).toBe(false)
    })

    it('warns on overreach (2+ levels above)', () => {
      const match = matchChallengeToPlayer(5, { overallGrade: 2 } as PlayerReadiness)
      expect(match.matchType).toBe('overreach')
      expect(match.shouldWarn).toBe(true)
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `calculatePlayerReadiness()` | <3ms |
| `matchChallengeToPlayer()` | <1ms |
| Grade indicator render | <5ms |

---

## JJK Design Principles Applied

| JJK Principle | Lux Story Application |
|---------------|----------------------|
| Parallel sorcerer/curse grades | Player readiness matches challenge grades |
| Grade N handles Grade N threats | Recommend at-level or below challenges |
| Higher grades require recommendations | Champion status gates highest challenges |
| Semi-grades for edge cases | Match types (stretch, comfortable) handle gradations |
| Mismatch = danger | Warning dialog for overreach |
