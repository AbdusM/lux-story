/**
 * Interrupt System Derivatives
 * Feature IDs: D-009, D-084
 *
 * This module extends the core interrupt system with advanced mechanics:
 * - Pattern-filtered interrupts (only see interrupts aligned with developed patterns)
 * - Interrupt combo chains (successful interrupt creates follow-up opportunity)
 */

import { PatternType, PATTERN_THRESHOLDS } from './patterns'
import { PlayerPatterns } from './character-state'

// ═══════════════════════════════════════════════════════════════════════════
// D-009: PATTERN-FILTERED INTERRUPTS
// Only see interrupts aligned with your developed patterns
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interrupt opportunity with pattern requirements
 */
export interface PatternFilteredInterrupt {
  id: string
  nodeId: string
  type: 'connection' | 'challenge' | 'silence' | 'comfort' | 'grounding' | 'encouragement'
  requiredPattern?: PatternType  // Pattern needed to see this interrupt
  requiredThreshold?: number     // Minimum pattern level
  action: string                 // What the interrupt does
  windowMs: number               // How long the window is open
}

/**
 * Pattern alignment for interrupt types
 */
export const INTERRUPT_PATTERN_ALIGNMENT: Record<
  PatternFilteredInterrupt['type'],
  PatternType[]
> = {
  connection: ['helping', 'patience'],      // Connecting requires empathy
  challenge: ['analytical', 'building'],    // Challenging requires confidence
  silence: ['patience'],                    // Silence requires patience
  comfort: ['helping'],                     // Comfort requires helping instinct
  grounding: ['patience', 'analytical'],    // Grounding requires stability
  encouragement: ['helping', 'building']    // Encouragement requires support/action
}

/**
 * Check if an interrupt should be visible based on player's patterns
 */
export function isInterruptVisible(
  interrupt: PatternFilteredInterrupt,
  patterns: PlayerPatterns,
  filterEnabled: boolean = true
): boolean {
  // If filtering disabled, always visible
  if (!filterEnabled) return true

  // If no specific pattern required, check type alignment
  if (!interrupt.requiredPattern) {
    const alignedPatterns = INTERRUPT_PATTERN_ALIGNMENT[interrupt.type]
    // At least one aligned pattern must be at EMERGING threshold
    return alignedPatterns.some(p => patterns[p] >= PATTERN_THRESHOLDS.EMERGING)
  }

  // Specific pattern required
  const threshold = interrupt.requiredThreshold ?? PATTERN_THRESHOLDS.EMERGING
  return patterns[interrupt.requiredPattern] >= threshold
}

/**
 * Filter a list of interrupts based on player's patterns
 */
export function filterInterruptsByPattern(
  interrupts: PatternFilteredInterrupt[],
  patterns: PlayerPatterns,
  filterEnabled: boolean = true
): PatternFilteredInterrupt[] {
  return interrupts.filter(i => isInterruptVisible(i, patterns, filterEnabled))
}

/**
 * Get the primary pattern aligned with an interrupt type
 */
export function getPrimaryInterruptPattern(
  type: PatternFilteredInterrupt['type']
): PatternType {
  return INTERRUPT_PATTERN_ALIGNMENT[type][0]
}

// ═══════════════════════════════════════════════════════════════════════════
// D-084: INTERRUPT COMBO CHAINS
// Successful interrupt creates follow-up interrupt opportunity
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Combo chain definition
 */
export interface InterruptComboChain {
  id: string
  name: string
  description: string
  steps: InterruptComboStep[]
  reward: {
    trustBonus: number
    patternBonus: { pattern: PatternType; amount: number }
    specialFlag?: string
  }
}

/**
 * Single step in a combo chain
 */
export interface InterruptComboStep {
  stepNumber: number
  interruptType: PatternFilteredInterrupt['type']
  nodeIdPattern?: string  // Regex pattern for valid nodes
  windowMultiplier: number // 1.0 = normal, <1 = shorter window
  successText: string
  failText: string
}

/**
 * Active combo state
 */
export interface ActiveComboState {
  chainId: string
  currentStep: number
  stepsCompleted: InterruptComboStep[]
  startedAt: number
  lastSuccessAt: number
}

/**
 * Predefined interrupt combo chains
 */
export const INTERRUPT_COMBO_CHAINS: InterruptComboChain[] = [
  {
    id: 'empathic_cascade',
    name: 'Empathic Cascade',
    description: 'A chain of emotional support moments that builds deep connection',
    steps: [
      {
        stepNumber: 1,
        interruptType: 'comfort',
        windowMultiplier: 1.0,
        successText: 'You reached out. They felt seen.',
        failText: 'The moment passed unnoticed.'
      },
      {
        stepNumber: 2,
        interruptType: 'grounding',
        windowMultiplier: 0.8, // Slightly shorter window
        successText: 'You helped them find footing.',
        failText: 'They steadied themselves alone.'
      },
      {
        stepNumber: 3,
        interruptType: 'connection',
        windowMultiplier: 0.6, // Shortest window - hardest to hit
        successText: 'Something clicked between you. A bond formed.',
        failText: 'The connection slipped away.'
      }
    ],
    reward: {
      trustBonus: 3,
      patternBonus: { pattern: 'helping', amount: 2 },
      specialFlag: 'empathic_cascade_complete'
    }
  },
  {
    id: 'truth_seeker',
    name: 'Truth Seeker',
    description: 'A chain of probing moments that uncovers hidden truth',
    steps: [
      {
        stepNumber: 1,
        interruptType: 'challenge',
        windowMultiplier: 1.0,
        successText: 'You questioned the surface story.',
        failText: 'You accepted the easy answer.'
      },
      {
        stepNumber: 2,
        interruptType: 'silence',
        windowMultiplier: 0.9,
        successText: 'Your silence spoke volumes. They filled it.',
        failText: 'Words rushed in to fill the gap.'
      },
      {
        stepNumber: 3,
        interruptType: 'challenge',
        windowMultiplier: 0.7,
        successText: 'The truth emerged. They couldn\'t hide it anymore.',
        failText: 'The walls stayed up.'
      }
    ],
    reward: {
      trustBonus: 2, // Lower trust but more insight
      patternBonus: { pattern: 'analytical', amount: 2 },
      specialFlag: 'truth_seeker_complete'
    }
  },
  {
    id: 'steady_anchor',
    name: 'Steady Anchor',
    description: 'A chain of patience that helps someone through a crisis',
    steps: [
      {
        stepNumber: 1,
        interruptType: 'grounding',
        windowMultiplier: 1.0,
        successText: 'You offered stability in the storm.',
        failText: 'The chaos continued.'
      },
      {
        stepNumber: 2,
        interruptType: 'silence',
        windowMultiplier: 1.2, // Longer window - patience rewards patience
        successText: 'You waited. Time stretched.',
        failText: 'You spoke too soon.'
      },
      {
        stepNumber: 3,
        interruptType: 'encouragement',
        windowMultiplier: 1.0,
        successText: 'They found their footing. You helped them stand.',
        failText: 'They got up alone.'
      }
    ],
    reward: {
      trustBonus: 3,
      patternBonus: { pattern: 'patience', amount: 3 },
      specialFlag: 'steady_anchor_complete'
    }
  },
  {
    id: 'builders_bridge',
    name: 'Builder\'s Bridge',
    description: 'A chain of constructive action that creates something together',
    steps: [
      {
        stepNumber: 1,
        interruptType: 'encouragement',
        windowMultiplier: 1.0,
        successText: 'You saw what they could become.',
        failText: 'Their potential went unnoticed.'
      },
      {
        stepNumber: 2,
        interruptType: 'challenge',
        windowMultiplier: 0.8,
        successText: 'You pushed them to do more.',
        failText: 'They stayed comfortable.'
      },
      {
        stepNumber: 3,
        interruptType: 'connection',
        windowMultiplier: 0.7,
        successText: 'Together, you built something real.',
        failText: 'The collaboration didn\'t happen.'
      }
    ],
    reward: {
      trustBonus: 2,
      patternBonus: { pattern: 'building', amount: 3 },
      specialFlag: 'builders_bridge_complete'
    }
  }
]

/**
 * Check if a combo chain can be started based on patterns
 */
export function canStartComboChain(
  chainId: string,
  patterns: PlayerPatterns
): boolean {
  const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === chainId)
  if (!chain) return false

  // First step's interrupt type must be visible
  const firstStepType = chain.steps[0].interruptType
  const alignedPatterns = INTERRUPT_PATTERN_ALIGNMENT[firstStepType]

  return alignedPatterns.some(p => patterns[p] >= PATTERN_THRESHOLDS.DEVELOPING)
}

/**
 * Start a new combo chain
 */
export function startComboChain(chainId: string): ActiveComboState | null {
  const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === chainId)
  if (!chain) return null

  return {
    chainId,
    currentStep: 1,
    stepsCompleted: [],
    startedAt: Date.now(),
    lastSuccessAt: Date.now()
  }
}

/**
 * Advance to next step in combo chain
 */
export function advanceComboChain(
  state: ActiveComboState,
  completedStep: InterruptComboStep
): ActiveComboState {
  return {
    ...state,
    currentStep: state.currentStep + 1,
    stepsCompleted: [...state.stepsCompleted, completedStep],
    lastSuccessAt: Date.now()
  }
}

/**
 * Check if combo chain is complete
 */
export function isComboChainComplete(state: ActiveComboState): boolean {
  const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === state.chainId)
  if (!chain) return false

  return state.stepsCompleted.length >= chain.steps.length
}

/**
 * Get combo chain reward if complete
 */
export function getComboChainReward(state: ActiveComboState): InterruptComboChain['reward'] | null {
  if (!isComboChainComplete(state)) return null

  const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === state.chainId)
  return chain?.reward ?? null
}

/**
 * Calculate combo window duration for current step
 */
export function getComboStepWindow(
  state: ActiveComboState,
  baseWindowMs: number
): number {
  const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === state.chainId)
  if (!chain) return baseWindowMs

  const currentStepIndex = state.currentStep - 1
  if (currentStepIndex >= chain.steps.length) return baseWindowMs

  const step = chain.steps[currentStepIndex]
  return Math.floor(baseWindowMs * step.windowMultiplier)
}

/**
 * Check if combo chain has timed out (too long between steps)
 */
export function isComboChainExpired(
  state: ActiveComboState,
  maxDelayBetweenStepsMs: number = 60000 // 1 minute default
): boolean {
  const timeSinceLastSuccess = Date.now() - state.lastSuccessAt
  return timeSinceLastSuccess > maxDelayBetweenStepsMs
}

/**
 * Get available combo chains for player's pattern state
 */
export function getAvailableComboChains(
  patterns: PlayerPatterns
): InterruptComboChain[] {
  return INTERRUPT_COMBO_CHAINS.filter(chain =>
    canStartComboChain(chain.id, patterns)
  )
}
