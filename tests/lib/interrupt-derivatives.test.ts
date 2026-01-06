/**
 * Tests for Interrupt System Derivatives
 * Feature IDs: D-009, D-084
 */

import { describe, it, expect } from 'vitest'
import {
  // D-009: Pattern-Filtered Interrupts
  isInterruptVisible,
  filterInterruptsByPattern,
  getPrimaryInterruptPattern,
  INTERRUPT_PATTERN_ALIGNMENT,
  PatternFilteredInterrupt,

  // D-084: Interrupt Combo Chains
  canStartComboChain,
  startComboChain,
  advanceComboChain,
  isComboChainComplete,
  getComboChainReward,
  getComboStepWindow,
  isComboChainExpired,
  getAvailableComboChains,
  INTERRUPT_COMBO_CHAINS
} from '@/lib/interrupt-derivatives'

import { PlayerPatterns } from '@/lib/character-state'
import { PATTERN_THRESHOLDS } from '@/lib/patterns'

// ═══════════════════════════════════════════════════════════════════════════
// D-009: PATTERN-FILTERED INTERRUPTS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-009: Pattern-Filtered Interrupts', () => {
  const testInterrupt: PatternFilteredInterrupt = {
    id: 'test1',
    nodeId: 'node1',
    type: 'comfort',
    action: 'Offer comfort',
    windowMs: 3000
  }

  const specificInterrupt: PatternFilteredInterrupt = {
    id: 'test2',
    nodeId: 'node2',
    type: 'challenge',
    requiredPattern: 'analytical',
    requiredThreshold: 5,
    action: 'Challenge assumption',
    windowMs: 3000
  }

  const zeroPatterns: PlayerPatterns = {
    analytical: 0,
    patience: 0,
    exploring: 0,
    helping: 0,
    building: 0
  }

  it('all interrupt types have pattern alignments', () => {
    const types: PatternFilteredInterrupt['type'][] = [
      'connection', 'challenge', 'silence', 'comfort', 'grounding', 'encouragement'
    ]

    types.forEach(type => {
      expect(INTERRUPT_PATTERN_ALIGNMENT[type]).toBeDefined()
      expect(INTERRUPT_PATTERN_ALIGNMENT[type].length).toBeGreaterThan(0)
    })
  })

  it('invisible when no aligned patterns developed', () => {
    expect(isInterruptVisible(testInterrupt, zeroPatterns, true)).toBe(false)
  })

  it('visible when aligned pattern at threshold', () => {
    const patterns: PlayerPatterns = {
      ...zeroPatterns,
      helping: PATTERN_THRESHOLDS.EMERGING // Comfort aligns with helping
    }
    expect(isInterruptVisible(testInterrupt, patterns, true)).toBe(true)
  })

  it('respects specific pattern requirements', () => {
    const lowAnalytical: PlayerPatterns = {
      ...zeroPatterns,
      analytical: 3
    }
    const highAnalytical: PlayerPatterns = {
      ...zeroPatterns,
      analytical: 6
    }

    expect(isInterruptVisible(specificInterrupt, lowAnalytical, true)).toBe(false)
    expect(isInterruptVisible(specificInterrupt, highAnalytical, true)).toBe(true)
  })

  it('always visible when filtering disabled', () => {
    expect(isInterruptVisible(testInterrupt, zeroPatterns, false)).toBe(true)
    expect(isInterruptVisible(specificInterrupt, zeroPatterns, false)).toBe(true)
  })

  it('filters list of interrupts correctly', () => {
    const interrupts = [testInterrupt, specificInterrupt]
    const patterns: PlayerPatterns = {
      ...zeroPatterns,
      helping: PATTERN_THRESHOLDS.EMERGING
    }

    const filtered = filterInterruptsByPattern(interrupts, patterns, true)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('test1')
  })

  it('returns primary pattern for interrupt type', () => {
    expect(getPrimaryInterruptPattern('comfort')).toBe('helping')
    expect(getPrimaryInterruptPattern('silence')).toBe('patience')
    expect(getPrimaryInterruptPattern('challenge')).toBe('analytical')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-084: INTERRUPT COMBO CHAINS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-084: Interrupt Combo Chains', () => {
  const developedPatterns: PlayerPatterns = {
    analytical: PATTERN_THRESHOLDS.DEVELOPING,
    patience: PATTERN_THRESHOLDS.DEVELOPING,
    exploring: PATTERN_THRESHOLDS.DEVELOPING,
    helping: PATTERN_THRESHOLDS.DEVELOPING,
    building: PATTERN_THRESHOLDS.DEVELOPING
  }

  const lowPatterns: PlayerPatterns = {
    analytical: 2,
    patience: 2,
    exploring: 2,
    helping: 2,
    building: 2
  }

  it('all combo chains have valid structure', () => {
    INTERRUPT_COMBO_CHAINS.forEach(chain => {
      expect(chain.id).toBeDefined()
      expect(chain.name).toBeDefined()
      expect(chain.steps.length).toBeGreaterThanOrEqual(2)
      expect(chain.reward).toBeDefined()
      expect(chain.reward.trustBonus).toBeGreaterThan(0)

      // Each step should have matching fields
      chain.steps.forEach((step, i) => {
        expect(step.stepNumber).toBe(i + 1)
        expect(step.interruptType).toBeDefined()
        expect(step.windowMultiplier).toBeGreaterThan(0)
        expect(step.successText).toBeDefined()
        expect(step.failText).toBeDefined()
      })
    })
  })

  it('cannot start combo with undeveloped patterns', () => {
    expect(canStartComboChain('empathic_cascade', lowPatterns)).toBe(false)
  })

  it('can start combo with developed patterns', () => {
    expect(canStartComboChain('empathic_cascade', developedPatterns)).toBe(true)
  })

  it('starts combo chain correctly', () => {
    const state = startComboChain('empathic_cascade')
    expect(state).not.toBeNull()
    expect(state?.chainId).toBe('empathic_cascade')
    expect(state?.currentStep).toBe(1)
    expect(state?.stepsCompleted).toHaveLength(0)
  })

  it('returns null for invalid chain id', () => {
    const state = startComboChain('nonexistent_chain')
    expect(state).toBeNull()
  })

  it('advances combo chain correctly', () => {
    const initial = startComboChain('empathic_cascade')!
    const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === 'empathic_cascade')!

    const advanced = advanceComboChain(initial, chain.steps[0])

    expect(advanced.currentStep).toBe(2)
    expect(advanced.stepsCompleted).toHaveLength(1)
    expect(advanced.lastSuccessAt).toBeGreaterThanOrEqual(initial.startedAt)
  })

  it('detects combo chain completion', () => {
    let state = startComboChain('empathic_cascade')!
    const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === 'empathic_cascade')!

    // Not complete initially
    expect(isComboChainComplete(state)).toBe(false)

    // Complete all steps
    chain.steps.forEach(step => {
      state = advanceComboChain(state, step)
    })

    expect(isComboChainComplete(state)).toBe(true)
  })

  it('returns reward when complete', () => {
    let state = startComboChain('empathic_cascade')!
    const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === 'empathic_cascade')!

    // No reward until complete
    expect(getComboChainReward(state)).toBeNull()

    // Complete all steps
    chain.steps.forEach(step => {
      state = advanceComboChain(state, step)
    })

    const reward = getComboChainReward(state)
    expect(reward).not.toBeNull()
    expect(reward?.trustBonus).toBe(3)
    expect(reward?.patternBonus.pattern).toBe('helping')
  })

  it('calculates step window correctly', () => {
    const state = startComboChain('empathic_cascade')!
    const baseWindow = 3000

    // First step has multiplier 1.0
    expect(getComboStepWindow(state, baseWindow)).toBe(3000)
  })

  it('detects expired combo chains', () => {
    const state = startComboChain('empathic_cascade')!

    // Not expired immediately
    expect(isComboChainExpired(state, 60000)).toBe(false)

    // Create expired state
    const expiredState = {
      ...state,
      lastSuccessAt: Date.now() - 120000 // 2 minutes ago
    }

    expect(isComboChainExpired(expiredState, 60000)).toBe(true)
  })

  it('gets available combo chains for patterns', () => {
    const available = getAvailableComboChains(developedPatterns)
    expect(available.length).toBeGreaterThan(0)

    const unavailable = getAvailableComboChains(lowPatterns)
    expect(unavailable.length).toBe(0)
  })
})
