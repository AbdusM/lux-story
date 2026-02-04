# Phase 7: Assessment Arc

**PRD ID:** RANK-007
**Priority:** P2 (Enhancement)
**Commits:** 6-8
**Dependencies:** Phase 1, Phase 2, Phase 3, Phase 4
**Inspired By:** Naruto (Chunin Exam multi-phase structure, surprise tests, teamwork evaluation)

---

## INTEGRATION NOTE

**This PRD EXTENDS the existing simulation system, not replaces it.**

**Existing simulation structure (5/20 characters complete):**
- Phase 1: Introduction (trust 0-2, no requirements)
- Phase 2: Application (trust 5+, complex scenarios)
- Phase 3: Mastery (trust 8+, expert challenges, 95% success)

**Characters with complete simulations:**
- Devon, Jordan, Dante, Nadia, Isaiah

**This PRD adds:**
- Cross-character "Assessment Arcs" that reference multiple simulations
- Formal recognition ceremony on completion
- Assessment questions that supplement existing dialogue

**Key files:**
- Content dialogue graphs (simulation nodes)
- `lib/dialogue-graph.ts` - `simulation` metadata field

---

## Target Outcome

Create **supplementary assessment content** that ties together existing simulations into formal evaluation moments. The assessment questions ADD to existing simulation phases.

**Success Criteria:**
- [ ] 3-phase assessment structure (Written → Practical → Finals)
- [ ] Assessment unlocks at specific progression milestones
- [ ] Each phase tests different capabilities
- [ ] Success/partial/failure outcomes with consequences
- [ ] Samuel as proctor with commentary

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Assessment phases | 3 | Chunin Exam's 3 phases, manageable scope |
| Trigger points | 3 | Unlock at key milestones (not time-based) |
| Failure mode | Non-blocking | Can retry, not gatekeeping |
| Duration | 5-10 minutes each phase | Respect player time |

---

## System Design

### 1. Assessment Structure

```typescript
// lib/ranking/assessment-arc.ts

/**
 * Assessment arc structure - Naruto Chunin Exam inspired
 * Multi-phase evaluation of player capabilities
 */
export type AssessmentPhase = 'written' | 'practical' | 'finals'

export interface AssessmentArc {
  id: string
  name: string
  description: string
  unlockCondition: AssessmentUnlockCondition
  phases: AssessmentPhaseConfig[]
  completionReward: AssessmentReward
}

export interface AssessmentPhaseConfig {
  phase: AssessmentPhase
  name: string
  description: string
  duration: number  // Expected minutes
  evaluationType: 'knowledge' | 'decision' | 'synthesis'
  questions: AssessmentQuestion[]
  passingScore: number
}

export interface AssessmentQuestion {
  id: string
  prompt: string
  type: 'choice' | 'scenario' | 'reflection'
  options?: AssessmentOption[]
  evaluationCriteria: string[]
  maxScore: number
}

export interface AssessmentOption {
  id: string
  text: string
  score: number
  feedback: string
  patterns?: PatternType[]  // Patterns this choice reflects
}

export interface AssessmentUnlockCondition {
  minPatternMasteryLevel?: number
  minCareerExpertiseLevel?: number
  requiredFlags?: string[]
  minCharactersMet?: number
}

export interface AssessmentReward {
  patternBonus: number
  expertiseBonus: number
  specialFlag: string
  samuelDialogue: string
}
```

### 2. Assessment Registry

```typescript
// lib/ranking/assessment-registry.ts

export const ASSESSMENT_ARCS: AssessmentArc[] = [
  {
    id: 'first_crossing',
    name: 'The First Crossing',
    description: 'Your first formal evaluation at the station',
    unlockCondition: {
      minPatternMasteryLevel: 1,  // Passenger rank
      minCharactersMet: 3
    },
    phases: [
      {
        phase: 'written',
        name: 'Station Orientation',
        description: 'Test your understanding of the station and its people',
        duration: 5,
        evaluationType: 'knowledge',
        questions: FIRST_CROSSING_WRITTEN,
        passingScore: 60
      },
      {
        phase: 'practical',
        name: 'The Conversation',
        description: 'Navigate a complex dialogue scenario',
        duration: 7,
        evaluationType: 'decision',
        questions: FIRST_CROSSING_PRACTICAL,
        passingScore: 50
      },
      {
        phase: 'finals',
        name: 'The Reflection',
        description: 'Demonstrate what you\'ve learned about yourself',
        duration: 5,
        evaluationType: 'synthesis',
        questions: FIRST_CROSSING_FINALS,
        passingScore: 40
      }
    ],
    completionReward: {
      patternBonus: 2,
      expertiseBonus: 5,
      specialFlag: 'first_crossing_complete',
      samuelDialogue: "You've crossed your first threshold. The station sees you differently now."
    }
  },
  {
    id: 'crossroads_trial',
    name: 'The Crossroads Trial',
    description: 'A deeper evaluation of your growing expertise',
    unlockCondition: {
      minPatternMasteryLevel: 2,  // Regular rank
      minCareerExpertiseLevel: 2,  // Apprentice in any domain
      requiredFlags: ['first_crossing_complete']
    },
    phases: [
      // ... similar structure
    ],
    completionReward: {
      patternBonus: 3,
      expertiseBonus: 10,
      specialFlag: 'crossroads_trial_complete',
      samuelDialogue: "At the crossroads, you chose. That's more than most ever do."
    }
  },
  {
    id: 'masters_challenge',
    name: 'The Master\'s Challenge',
    description: 'The final assessment before true recognition',
    unlockCondition: {
      minPatternMasteryLevel: 3,  // Conductor rank
      minCareerExpertiseLevel: 4,  // Specialist in any domain
      requiredFlags: ['crossroads_trial_complete'],
      minCharactersMet: 10
    },
    phases: [
      // ... similar structure
    ],
    completionReward: {
      patternBonus: 5,
      expertiseBonus: 15,
      specialFlag: 'masters_challenge_complete',
      samuelDialogue: "There's nothing more I can teach you. But the station... it still has secrets."
    }
  }
]
```

### 3. Assessment Questions (First Crossing Example)

```typescript
// lib/ranking/assessment-questions.ts

export const FIRST_CROSSING_WRITTEN: AssessmentQuestion[] = [
  {
    id: 'fc_w1',
    prompt: 'What matters most when building trust with someone?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'Agreeing with everything they say',
        score: 0,
        feedback: 'Agreement without authenticity feels hollow.',
        patterns: []
      },
      {
        id: 'b',
        text: 'Being consistently present and honest',
        score: 3,
        feedback: 'Trust grows from reliability and authenticity.',
        patterns: ['patience', 'helping']
      },
      {
        id: 'c',
        text: 'Impressing them with your knowledge',
        score: 1,
        feedback: 'Knowledge helps, but connection matters more.',
        patterns: ['analytical']
      },
      {
        id: 'd',
        text: 'Finding what you can offer them',
        score: 2,
        feedback: 'Value exchange matters, but relationships are deeper.',
        patterns: ['building']
      }
    ],
    evaluationCriteria: ['trust-building', 'relationship-awareness'],
    maxScore: 3
  },
  {
    id: 'fc_w2',
    prompt: 'A character shares something vulnerable. What should you do?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'Immediately offer advice to fix the problem',
        score: 1,
        feedback: 'Helpful intent, but sometimes listening is enough.',
        patterns: ['building', 'helping']
      },
      {
        id: 'b',
        text: 'Share a similar experience to show you understand',
        score: 2,
        feedback: 'Empathy through shared experience can connect.',
        patterns: ['helping']
      },
      {
        id: 'c',
        text: 'Acknowledge what they shared and give them space',
        score: 3,
        feedback: 'Honoring vulnerability without pressure shows maturity.',
        patterns: ['patience', 'helping']
      },
      {
        id: 'd',
        text: 'Change the subject to lighten the mood',
        score: 0,
        feedback: 'Avoiding discomfort dismisses their trust.',
        patterns: []
      }
    ],
    evaluationCriteria: ['empathy', 'emotional-intelligence'],
    maxScore: 3
  },
  // ... more questions
]

export const FIRST_CROSSING_PRACTICAL: AssessmentQuestion[] = [
  {
    id: 'fc_p1',
    prompt: 'You\'re having a conversation with Maya when Devon interrupts with urgent news. Maya looks disappointed. What do you do?',
    type: 'scenario',
    options: [
      {
        id: 'a',
        text: 'Immediately turn to Devon—urgent news is important',
        score: 1,
        feedback: 'Efficiency matters, but so do feelings.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'Tell Devon to wait—you were here first with Maya',
        score: 1,
        feedback: 'Loyalty to Maya, but dismissive of Devon.',
        patterns: ['patience']
      },
      {
        id: 'c',
        text: 'Acknowledge Maya\'s disappointment before addressing Devon',
        score: 3,
        feedback: 'Balancing both relationships shows emotional awareness.',
        patterns: ['helping', 'patience']
      },
      {
        id: 'd',
        text: 'Suggest all three of you discuss together',
        score: 2,
        feedback: 'Inclusive, though not always appropriate.',
        patterns: ['exploring', 'building']
      }
    ],
    evaluationCriteria: ['conflict-navigation', 'multi-relationship'],
    maxScore: 3
  },
  // ... more scenarios
]

export const FIRST_CROSSING_FINALS: AssessmentQuestion[] = [
  {
    id: 'fc_f1',
    prompt: 'Reflecting on your time at the station so far, what has surprised you most about yourself?',
    type: 'reflection',
    options: [
      {
        id: 'a',
        text: 'I\'m more curious than I realized',
        score: 2,
        feedback: 'Curiosity is the beginning of growth.',
        patterns: ['exploring']
      },
      {
        id: 'b',
        text: 'I care more about others than I thought',
        score: 2,
        feedback: 'Compassion often surprises us.',
        patterns: ['helping']
      },
      {
        id: 'c',
        text: 'I\'m better at seeing patterns than I knew',
        score: 2,
        feedback: 'Pattern recognition is a powerful skill.',
        patterns: ['analytical']
      },
      {
        id: 'd',
        text: 'I want to build things that matter',
        score: 2,
        feedback: 'The drive to create is transformative.',
        patterns: ['building']
      }
    ],
    evaluationCriteria: ['self-awareness', 'pattern-recognition'],
    maxScore: 2
  },
  // ... more reflections
]
```

### 4. Assessment State Manager

```typescript
// lib/ranking/assessment-state.ts

export interface AssessmentState {
  availableAssessments: string[]  // IDs of unlocked assessments
  completedAssessments: string[]  // IDs of completed assessments
  currentAssessment: CurrentAssessmentProgress | null
  assessmentHistory: AssessmentResult[]
}

export interface CurrentAssessmentProgress {
  assessmentId: string
  currentPhase: AssessmentPhase
  phaseResults: Record<AssessmentPhase, PhaseResult | null>
  startedAt: number
}

export interface PhaseResult {
  phase: AssessmentPhase
  score: number
  maxScore: number
  passed: boolean
  answers: Record<string, string>  // questionId → answerId
  completedAt: number
}

export interface AssessmentResult {
  assessmentId: string
  finalScore: number
  maxScore: number
  passed: boolean
  phasesCompleted: number
  completedAt: number
}

/**
 * Check which assessments are available
 */
export function getAvailableAssessments(
  gameState: GameState,
  patternMastery: PatternMasteryState,
  careerExpertise: CareerExpertiseState
): AssessmentArc[] {
  return ASSESSMENT_ARCS.filter(arc => {
    const condition = arc.unlockCondition

    // Check pattern mastery level
    if (condition.minPatternMasteryLevel !== undefined) {
      if (patternMastery.overall.level < condition.minPatternMasteryLevel) {
        return false
      }
    }

    // Check career expertise level
    if (condition.minCareerExpertiseLevel !== undefined) {
      const maxExpertise = Math.max(
        ...Object.values(careerExpertise.domains).map(d => d.level)
      )
      if (maxExpertise < condition.minCareerExpertiseLevel) {
        return false
      }
    }

    // Check required flags
    if (condition.requiredFlags) {
      for (const flag of condition.requiredFlags) {
        if (!gameState.globalFlags.has(flag)) {
          return false
        }
      }
    }

    // Check characters met
    if (condition.minCharactersMet !== undefined) {
      if (gameState.characters.size < condition.minCharactersMet) {
        return false
      }
    }

    return true
  })
}

/**
 * Calculate phase score
 *
 * @param phase - Assessment phase configuration
 * @param answers - Player answers keyed by question ID
 * @param now - Timestamp for completedAt (default: Date.now() for production)
 */
export function calculatePhaseScore(
  phase: AssessmentPhaseConfig,
  answers: Record<string, string>,
  now: number = Date.now()
): PhaseResult {
  let score = 0
  let maxScore = 0

  for (const question of phase.questions) {
    maxScore += question.maxScore
    const answer = answers[question.id]
    const option = question.options?.find(o => o.id === answer)
    if (option) {
      score += option.score
    }
  }

  const percentScore = (score / maxScore) * 100
  const passed = percentScore >= phase.passingScore

  return {
    phase: phase.phase,
    score,
    maxScore,
    passed,
    answers,
    completedAt: now  // Use passed timestamp for determinism
  }
}
```

---

## UI Components

### 5. Assessment Hub

```typescript
// components/ranking/AssessmentHub.tsx

interface AssessmentHubProps {
  assessmentState: AssessmentState
  onStartAssessment: (arcId: string) => void
  onContinueAssessment: () => void
}

export function AssessmentHub({
  assessmentState,
  onStartAssessment,
  onContinueAssessment
}: AssessmentHubProps) {
  const availableArcs = ASSESSMENT_ARCS.filter(
    arc => assessmentState.availableAssessments.includes(arc.id)
  )
  const completedArcs = ASSESSMENT_ARCS.filter(
    arc => assessmentState.completedAssessments.includes(arc.id)
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium text-white">Station Assessments</h2>
        <p className="text-sm text-slate-400 mt-1">
          Formal evaluations of your journey progress
        </p>
      </div>

      {/* Current assessment */}
      {assessmentState.currentAssessment && (
        <div className="p-4 bg-amber-900/20 border border-amber-900/30 rounded-lg">
          <h3 className="text-sm font-medium text-amber-400">Assessment in Progress</h3>
          <p className="text-sm text-slate-300 mt-1">
            {ASSESSMENT_ARCS.find(a => a.id === assessmentState.currentAssessment?.assessmentId)?.name}
          </p>
          <Button onClick={onContinueAssessment} className="mt-3">
            Continue Assessment
          </Button>
        </div>
      )}

      {/* Available assessments */}
      {availableArcs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Available</h3>
          {availableArcs.map(arc => (
            <AssessmentCard
              key={arc.id}
              arc={arc}
              status="available"
              onStart={() => onStartAssessment(arc.id)}
            />
          ))}
        </div>
      )}

      {/* Completed assessments */}
      {completedArcs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Completed</h3>
          {completedArcs.map(arc => {
            const result = assessmentState.assessmentHistory.find(
              r => r.assessmentId === arc.id
            )
            return (
              <AssessmentCard
                key={arc.id}
                arc={arc}
                status="completed"
                result={result}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
```

### 6. Phase Interface

```typescript
// components/ranking/AssessmentPhaseInterface.tsx

interface AssessmentPhaseInterfaceProps {
  arc: AssessmentArc
  phase: AssessmentPhaseConfig
  onAnswer: (questionId: string, answerId: string) => void
  onComplete: () => void
  answers: Record<string, string>
}

export function AssessmentPhaseInterface({
  arc,
  phase,
  onAnswer,
  onComplete,
  answers
}: AssessmentPhaseInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = phase.questions[currentQuestionIndex]
  const allAnswered = phase.questions.every(q => answers[q.id])

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-amber-400 uppercase tracking-wider">{arc.name}</p>
        <h2 className="text-lg font-medium text-white mt-1">{phase.name}</h2>
        <p className="text-sm text-slate-400">{phase.description}</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {phase.questions.map((q, i) => (
          <div
            key={q.id}
            className={cn(
              "flex-1 h-1 rounded-full",
              answers[q.id] ? "bg-amber-400" : "bg-slate-700",
              i === currentQuestionIndex && "ring-2 ring-amber-400/50"
            )}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <p className="text-white text-lg">{currentQuestion.prompt}</p>

          {currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => onAnswer(currentQuestion.id, option.id)}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border transition-colors",
                    answers[currentQuestion.id] === option.id
                      ? "bg-amber-900/30 border-amber-400/50 text-white"
                      : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500"
                  )}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="ghost"
          onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {currentQuestionIndex < phase.questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestionIndex(i => i + 1)}
            disabled={!answers[currentQuestion.id]}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            disabled={!allAnswered}
            className="bg-amber-600 hover:bg-amber-500"
          >
            Complete Phase
          </Button>
        )}
      </div>
    </div>
  )
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Pattern Mastery | Unlock condition | Input |
| Career Expertise | Unlock condition | Input |
| Game State | Required flags check | Input |
| Pattern System | Rewards | Output |
| Career Expertise | Rewards | Output |
| Samuel Dialogue | Completion dialogue | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 7.1 | Define assessment structure | Types + registry | `lib/ranking/assessment-arc.ts` |
| 7.2 | Create question bank | First Crossing questions | `lib/ranking/assessment-questions.ts` |
| 7.3 | Implement state manager | Unlock + progress tracking | `lib/ranking/assessment-state.ts` |
| 7.4 | Build assessment hub | Arc selection UI | `components/ranking/AssessmentHub.tsx` |
| 7.5 | Create phase interface | Question display + input | `components/ranking/AssessmentPhaseInterface.tsx` |
| 7.6 | Add results display | Score + feedback | `components/ranking/AssessmentResults.tsx` |
| 7.7 | Wire Samuel dialogue | Proctor commentary | `content/samuel-dialogue-graph.ts` |
| 7.8 | Add remaining arcs | Crossroads + Master's | `lib/ranking/assessment-registry.ts` |

---

## Tests & Verification

```typescript
describe('Assessment Arc System', () => {
  describe('Unlock Conditions', () => {
    it('unlocks First Crossing at Passenger rank', () => {
      const mastery = createMockPatternMastery({ level: 1 })
      const expertise = createMockExpertise()
      const state = createMockGameState({ charactersMet: 3 })

      const available = getAvailableAssessments(state, mastery, expertise)
      expect(available.map(a => a.id)).toContain('first_crossing')
    })

    it('requires previous assessment for later ones', () => {
      const mastery = createMockPatternMastery({ level: 2 })
      const expertise = createMockExpertise({ maxLevel: 2 })
      const state = createMockGameState({ flags: [] })

      const available = getAvailableAssessments(state, mastery, expertise)
      expect(available.map(a => a.id)).not.toContain('crossroads_trial')
    })
  })

  describe('Scoring', () => {
    it('calculates phase score correctly', () => {
      const phase = ASSESSMENT_ARCS[0].phases[0]
      const answers = { fc_w1: 'b', fc_w2: 'c' }  // Best answers

      const result = calculatePhaseScore(phase, answers)
      expect(result.score).toBe(6)
      expect(result.passed).toBe(true)
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `getAvailableAssessments()` | <3ms |
| `calculatePhaseScore()` | <1ms |
| Phase interface render | <16ms |
| Question transition | <300ms |

---

## Naruto Chunin Exam Principles Applied

| Chunin Exam Principle | Lux Story Application |
|----------------------|----------------------|
| Multi-phase structure | Written → Practical → Finals |
| Different competencies tested | Knowledge → Decision → Synthesis |
| Surprise elements | Scenario-based practical phase |
| Team/relationship awareness | Questions about handling multiple relationships |
| Proctor commentary | Samuel provides guidance and feedback |
| Passing isn't everything | Partial completion still rewards progress |
