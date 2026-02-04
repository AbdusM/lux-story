/**
 * Assessment Arc Tests
 *
 * Tests for the Chunin Exam-inspired assessment system.
 */

import { describe, it, expect } from 'vitest'
import {
  ASSESSMENT_ARCS,
  getAssessmentById,
  getPhaseConfig,
  getNextPhase,
  isAssessmentUnlocked,
  getAvailableAssessments,
  calculatePhaseScore,
  calculateAssessmentScore,
  startAssessment,
  completePhase,
  abandonAssessment,
  updateAvailableAssessments,
  hasCompletedAssessment,
  getLatestAssessmentResult,
  isAssessmentCompleted,
  getAssessmentProgress,
  createDefaultAssessmentState,
  type UnlockCheckInput
} from '@/lib/ranking/assessment-registry'
import {
  ASSESSMENT_PHASES,
  PHASE_DISPLAY,
  getSamuelAssessmentStartMessage,
  getSamuelPhaseCompleteMessage,
  getSamuelAssessmentResultMessage
} from '@/lib/ranking/assessment-arc'
import {
  FIRST_CROSSING_WRITTEN,
  FIRST_CROSSING_PRACTICAL,
  FIRST_CROSSING_FINALS
} from '@/lib/ranking/assessment-questions'

describe('Assessment Arc System', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRY
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Assessment Registry', () => {
    it('has 3 assessment arcs', () => {
      expect(ASSESSMENT_ARCS).toHaveLength(3)
    })

    it('all arcs have required fields', () => {
      for (const arc of ASSESSMENT_ARCS) {
        expect(arc.id).toBeDefined()
        expect(arc.name).toBeDefined()
        expect(arc.description).toBeDefined()
        expect(arc.unlockCondition).toBeDefined()
        expect(arc.phases).toHaveLength(3)
        expect(arc.completionReward).toBeDefined()
      }
    })

    it('arc IDs are unique', () => {
      const ids = ASSESSMENT_ARCS.map(a => a.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('each arc has all 3 phases', () => {
      for (const arc of ASSESSMENT_ARCS) {
        const phases = arc.phases.map(p => p.phase)
        expect(phases).toContain('written')
        expect(phases).toContain('practical')
        expect(phases).toContain('finals')
      }
    })
  })

  describe('getAssessmentById', () => {
    it('finds existing assessment', () => {
      const arc = getAssessmentById('first_crossing')
      expect(arc).toBeDefined()
      expect(arc?.name).toBe('The First Crossing')
    })

    it('returns undefined for invalid ID', () => {
      expect(getAssessmentById('invalid')).toBeUndefined()
    })
  })

  describe('getPhaseConfig', () => {
    it('finds phase config', () => {
      const arc = getAssessmentById('first_crossing')!
      const phase = getPhaseConfig(arc, 'written')
      expect(phase).toBeDefined()
      expect(phase?.name).toBe('Station Orientation')
    })

    it('returns undefined for invalid phase', () => {
      const arc = getAssessmentById('first_crossing')!
      expect(getPhaseConfig(arc, 'invalid' as any)).toBeUndefined()
    })
  })

  describe('getNextPhase', () => {
    it('returns practical after written', () => {
      expect(getNextPhase('written')).toBe('practical')
    })

    it('returns finals after practical', () => {
      expect(getNextPhase('practical')).toBe('finals')
    })

    it('returns null after finals', () => {
      expect(getNextPhase('finals')).toBeNull()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // UNLOCK CONDITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Unlock Conditions', () => {
    const defaultInput: UnlockCheckInput = {
      patternMasteryLevel: 0,
      maxExpertiseLevel: 0,
      charactersMet: 0,
      globalFlags: new Set()
    }

    describe('isAssessmentUnlocked', () => {
      it('First Crossing unlocks at Passenger rank with 3 characters', () => {
        const arc = getAssessmentById('first_crossing')!

        expect(isAssessmentUnlocked(arc, defaultInput)).toBe(false)
        expect(isAssessmentUnlocked(arc, { ...defaultInput, patternMasteryLevel: 1, charactersMet: 2 })).toBe(false)
        expect(isAssessmentUnlocked(arc, { ...defaultInput, patternMasteryLevel: 1, charactersMet: 3 })).toBe(true)
      })

      it('Crossroads Trial requires first_crossing_complete flag', () => {
        const arc = getAssessmentById('crossroads_trial')!

        const almostReady = {
          ...defaultInput,
          patternMasteryLevel: 2,
          maxExpertiseLevel: 2,
          charactersMet: 10
        }

        expect(isAssessmentUnlocked(arc, almostReady)).toBe(false)
        expect(isAssessmentUnlocked(arc, { ...almostReady, globalFlags: new Set(['first_crossing_complete']) })).toBe(true)
      })

      it("Master's Challenge has strictest requirements", () => {
        const arc = getAssessmentById('masters_challenge')!

        const ready = {
          patternMasteryLevel: 3,
          maxExpertiseLevel: 4,
          charactersMet: 10,
          globalFlags: new Set(['crossroads_trial_complete'])
        }

        expect(isAssessmentUnlocked(arc, ready)).toBe(true)
        expect(isAssessmentUnlocked(arc, { ...ready, charactersMet: 9 })).toBe(false)
        expect(isAssessmentUnlocked(arc, { ...ready, patternMasteryLevel: 2 })).toBe(false)
      })

      it('accepts flags as array', () => {
        const arc = getAssessmentById('crossroads_trial')!
        const input = {
          ...defaultInput,
          patternMasteryLevel: 2,
          maxExpertiseLevel: 2,
          globalFlags: ['first_crossing_complete']
        }
        expect(isAssessmentUnlocked(arc, input)).toBe(true)
      })
    })

    describe('getAvailableAssessments', () => {
      it('returns empty for new player', () => {
        const available = getAvailableAssessments(defaultInput)
        expect(available).toHaveLength(0)
      })

      it('returns First Crossing when ready', () => {
        const input = { ...defaultInput, patternMasteryLevel: 1, charactersMet: 3 }
        const available = getAvailableAssessments(input)
        expect(available.map(a => a.id)).toContain('first_crossing')
      })

      it('excludes completed assessments', () => {
        const input = { ...defaultInput, patternMasteryLevel: 1, charactersMet: 3 }
        const available = getAvailableAssessments(input, ['first_crossing'])
        expect(available.map(a => a.id)).not.toContain('first_crossing')
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // SCORING
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Scoring', () => {
    describe('calculatePhaseScore', () => {
      it('calculates perfect score correctly', () => {
        const arc = getAssessmentById('first_crossing')!
        const phase = getPhaseConfig(arc, 'written')!

        // Best answers for first 4 questions
        const answers = {
          fc_w1: 'b',  // 3 points
          fc_w2: 'c',  // 3 points
          fc_w3: 'b',  // 3 points
          fc_w4: 'c'   // 3 points
        }

        const result = calculatePhaseScore(phase, answers, 1000)
        expect(result.score).toBe(12)
        expect(result.maxScore).toBe(12)
        expect(result.passed).toBe(true)
        expect(result.completedAt).toBe(1000)
      })

      it('calculates partial score correctly', () => {
        const arc = getAssessmentById('first_crossing')!
        const phase = getPhaseConfig(arc, 'written')!

        // Mixed answers
        const answers = {
          fc_w1: 'a',  // 0 points
          fc_w2: 'b',  // 2 points
          fc_w3: 'c',  // 0 points
          fc_w4: 'a'   // 1 point
        }

        const result = calculatePhaseScore(phase, answers, 1000)
        expect(result.score).toBe(3)
        expect(result.maxScore).toBe(12)
        expect(result.passed).toBe(false) // 25% < 60% threshold
      })

      it('handles missing answers', () => {
        const arc = getAssessmentById('first_crossing')!
        const phase = getPhaseConfig(arc, 'written')!

        const answers = { fc_w1: 'b' }  // Only one answer
        const result = calculatePhaseScore(phase, answers, 1000)
        expect(result.score).toBe(3)
        expect(result.maxScore).toBe(12)
      })
    })

    describe('calculateAssessmentScore', () => {
      it('sums phase scores', () => {
        const phaseResults = {
          written: { phase: 'written' as const, score: 10, maxScore: 12, passed: true, answers: {}, completedAt: 1000 },
          practical: { phase: 'practical' as const, score: 7, maxScore: 9, passed: true, answers: {}, completedAt: 2000 }
        }

        const result = calculateAssessmentScore(phaseResults)
        expect(result.totalScore).toBe(17)
        expect(result.maxScore).toBe(21)
        expect(result.phasesPassed).toBe(2)
      })

      it('handles empty results', () => {
        const result = calculateAssessmentScore({})
        expect(result.totalScore).toBe(0)
        expect(result.maxScore).toBe(0)
        expect(result.phasesPassed).toBe(0)
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  describe('State Management', () => {
    describe('createDefaultAssessmentState', () => {
      it('creates empty state', () => {
        const state = createDefaultAssessmentState()
        expect(state.availableAssessments).toHaveLength(0)
        expect(state.completedAssessments).toHaveLength(0)
        expect(state.currentAssessment).toBeNull()
        expect(state.assessmentHistory).toHaveLength(0)
      })
    })

    describe('startAssessment', () => {
      it('starts a new assessment', () => {
        const state = createDefaultAssessmentState()
        const newState = startAssessment(state, 'first_crossing', 1000)

        expect(newState.currentAssessment).not.toBeNull()
        expect(newState.currentAssessment?.assessmentId).toBe('first_crossing')
        expect(newState.currentAssessment?.currentPhase).toBe('written')
        expect(newState.currentAssessment?.startedAt).toBe(1000)
      })

      it('does nothing if assessment already in progress', () => {
        const state = createDefaultAssessmentState()
        const withAssessment = startAssessment(state, 'first_crossing', 1000)
        const tryAgain = startAssessment(withAssessment, 'crossroads_trial', 2000)

        expect(tryAgain.currentAssessment?.assessmentId).toBe('first_crossing')
      })

      it('does nothing for invalid assessment ID', () => {
        const state = createDefaultAssessmentState()
        const newState = startAssessment(state, 'invalid', 1000)
        expect(newState.currentAssessment).toBeNull()
      })
    })

    describe('completePhase', () => {
      it('advances to next phase', () => {
        let state = createDefaultAssessmentState()
        state = startAssessment(state, 'first_crossing', 1000)

        const writtenResult = {
          phase: 'written' as const,
          score: 10,
          maxScore: 12,
          passed: true,
          answers: {},
          completedAt: 2000
        }

        state = completePhase(state, writtenResult, 2000)
        expect(state.currentAssessment?.currentPhase).toBe('practical')
        expect(state.currentAssessment?.phaseResults.written).toEqual(writtenResult)
      })

      it('completes assessment after finals', () => {
        let state = createDefaultAssessmentState()
        state = startAssessment(state, 'first_crossing', 1000)

        // Complete all phases
        state = completePhase(state, { phase: 'written', score: 10, maxScore: 12, passed: true, answers: {}, completedAt: 2000 }, 2000)
        state = completePhase(state, { phase: 'practical', score: 7, maxScore: 9, passed: true, answers: {}, completedAt: 3000 }, 3000)
        state = completePhase(state, { phase: 'finals', score: 5, maxScore: 6, passed: true, answers: {}, completedAt: 4000 }, 4000)

        expect(state.currentAssessment).toBeNull()
        expect(state.completedAssessments).toContain('first_crossing')
        expect(state.assessmentHistory).toHaveLength(1)
        expect(state.assessmentHistory[0].passed).toBe(true)
      })

      it('does not mark as completed if failed too many phases', () => {
        let state = createDefaultAssessmentState()
        state = startAssessment(state, 'first_crossing', 1000)

        // Fail 2 of 3 phases
        state = completePhase(state, { phase: 'written', score: 2, maxScore: 12, passed: false, answers: {}, completedAt: 2000 }, 2000)
        state = completePhase(state, { phase: 'practical', score: 2, maxScore: 9, passed: false, answers: {}, completedAt: 3000 }, 3000)
        state = completePhase(state, { phase: 'finals', score: 5, maxScore: 6, passed: true, answers: {}, completedAt: 4000 }, 4000)

        expect(state.currentAssessment).toBeNull()
        expect(state.completedAssessments).not.toContain('first_crossing')
        expect(state.assessmentHistory[0].passed).toBe(false)
      })
    })

    describe('abandonAssessment', () => {
      it('clears current assessment', () => {
        let state = createDefaultAssessmentState()
        state = startAssessment(state, 'first_crossing', 1000)
        state = abandonAssessment(state)

        expect(state.currentAssessment).toBeNull()
        expect(state.completedAssessments).toHaveLength(0)
      })
    })

    describe('updateAvailableAssessments', () => {
      it('updates available list based on input', () => {
        const state = createDefaultAssessmentState()
        const input: UnlockCheckInput = {
          patternMasteryLevel: 1,
          maxExpertiseLevel: 0,
          charactersMet: 3,
          globalFlags: new Set()
        }

        const newState = updateAvailableAssessments(state, input)
        expect(newState.availableAssessments).toContain('first_crossing')
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Utility Functions', () => {
    it('hasCompletedAssessment returns correct value', () => {
      let state = createDefaultAssessmentState()
      expect(hasCompletedAssessment(state)).toBe(false)

      state = { ...state, completedAssessments: ['first_crossing'] }
      expect(hasCompletedAssessment(state)).toBe(true)
    })

    it('getLatestAssessmentResult returns last result', () => {
      const state = createDefaultAssessmentState()
      expect(getLatestAssessmentResult(state)).toBeNull()

      const withHistory = {
        ...state,
        assessmentHistory: [
          { assessmentId: 'first_crossing', finalScore: 20, maxScore: 27, passed: true, phasesCompleted: 3, completedAt: 1000 },
          { assessmentId: 'crossroads_trial', finalScore: 18, maxScore: 27, passed: true, phasesCompleted: 3, completedAt: 2000 }
        ]
      }
      expect(getLatestAssessmentResult(withHistory)?.assessmentId).toBe('crossroads_trial')
    })

    it('isAssessmentCompleted checks completion', () => {
      const state = {
        ...createDefaultAssessmentState(),
        completedAssessments: ['first_crossing']
      }
      expect(isAssessmentCompleted(state, 'first_crossing')).toBe(true)
      expect(isAssessmentCompleted(state, 'crossroads_trial')).toBe(false)
    })

    it('getAssessmentProgress calculates percentage', () => {
      expect(getAssessmentProgress(createDefaultAssessmentState())).toBe(0)
      expect(getAssessmentProgress({ ...createDefaultAssessmentState(), completedAssessments: ['first_crossing'] })).toBe(33)
      expect(getAssessmentProgress({ ...createDefaultAssessmentState(), completedAssessments: ['first_crossing', 'crossroads_trial', 'masters_challenge'] })).toBe(100)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION BANK
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Question Bank', () => {
    it('First Crossing has questions for all phases', () => {
      expect(FIRST_CROSSING_WRITTEN.length).toBeGreaterThan(0)
      expect(FIRST_CROSSING_PRACTICAL.length).toBeGreaterThan(0)
      expect(FIRST_CROSSING_FINALS.length).toBeGreaterThan(0)
    })

    it('all questions have required fields', () => {
      const allQuestions = [
        ...FIRST_CROSSING_WRITTEN,
        ...FIRST_CROSSING_PRACTICAL,
        ...FIRST_CROSSING_FINALS
      ]

      for (const question of allQuestions) {
        expect(question.id).toBeDefined()
        expect(question.prompt).toBeDefined()
        expect(question.type).toBeDefined()
        expect(question.options.length).toBeGreaterThan(0)
        expect(question.maxScore).toBeGreaterThan(0)
      }
    })

    it('all options have required fields', () => {
      const allQuestions = [
        ...FIRST_CROSSING_WRITTEN,
        ...FIRST_CROSSING_PRACTICAL,
        ...FIRST_CROSSING_FINALS
      ]

      for (const question of allQuestions) {
        for (const option of question.options) {
          expect(option.id).toBeDefined()
          expect(option.text).toBeDefined()
          expect(typeof option.score).toBe('number')
          expect(option.feedback).toBeDefined()
        }
      }
    })

    it('question IDs are unique', () => {
      const allQuestions = [
        ...FIRST_CROSSING_WRITTEN,
        ...FIRST_CROSSING_PRACTICAL,
        ...FIRST_CROSSING_FINALS
      ]
      const ids = allQuestions.map(q => q.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // DISPLAY & MESSAGES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Display & Messages', () => {
    it('PHASE_DISPLAY has all phases', () => {
      for (const phase of ASSESSMENT_PHASES) {
        expect(PHASE_DISPLAY[phase]).toBeDefined()
        expect(PHASE_DISPLAY[phase].name).toBeDefined()
        expect(PHASE_DISPLAY[phase].icon).toBeDefined()
      }
    })

    it('getSamuelAssessmentStartMessage returns strings', () => {
      expect(typeof getSamuelAssessmentStartMessage('first_crossing')).toBe('string')
      expect(typeof getSamuelAssessmentStartMessage('crossroads_trial')).toBe('string')
      expect(typeof getSamuelAssessmentStartMessage('masters_challenge')).toBe('string')
      expect(typeof getSamuelAssessmentStartMessage('unknown')).toBe('string')
    })

    it('getSamuelPhaseCompleteMessage returns strings for all phases', () => {
      for (const phase of ASSESSMENT_PHASES) {
        expect(typeof getSamuelPhaseCompleteMessage(phase)).toBe('string')
      }
    })

    it('getSamuelAssessmentResultMessage returns strings for all outcomes', () => {
      expect(typeof getSamuelAssessmentResultMessage(true, false)).toBe('string')
      expect(typeof getSamuelAssessmentResultMessage(false, true)).toBe('string')
      expect(typeof getSamuelAssessmentResultMessage(false, false)).toBe('string')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Performance', () => {
    it('calculatePhaseScore completes in <1ms', () => {
      const arc = getAssessmentById('first_crossing')!
      const phase = getPhaseConfig(arc, 'written')!
      const answers = { fc_w1: 'b', fc_w2: 'c', fc_w3: 'b', fc_w4: 'c' }

      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        calculatePhaseScore(phase, answers)
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100) // 1000 calls in <100ms
    })

    it('getAvailableAssessments completes in <3ms', () => {
      const input: UnlockCheckInput = {
        patternMasteryLevel: 3,
        maxExpertiseLevel: 4,
        charactersMet: 10,
        globalFlags: new Set(['first_crossing_complete', 'crossroads_trial_complete'])
      }

      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        getAvailableAssessments(input)
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100) // 1000 calls in <100ms
    })
  })
})
