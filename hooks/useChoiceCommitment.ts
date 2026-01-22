'use client'

import { useState, useCallback, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { signatureChoice, haptics } from '@/lib/animations'

/**
 * useChoiceCommitment - Manages the signature choice animation sequence
 *
 * The ONE interaction we make PERFECT (Directive B: 30% Budget)
 *
 * Usage:
 * ```tsx
 * const { commitChoice, animationState, selectedChoiceId, isCommitting } = useChoiceCommitment()
 *
 * const handleChoice = async (choice) => {
 *   await commitChoice(choice.id, () => {
 *     // Called after animation completes
 *     onChoiceSelected(choice)
 *   })
 * }
 * ```
 */

export type ChoiceAnimationState =
  | 'idle'           // No animation
  | 'tapped'         // Initial tap feedback
  | 'fading-others'  // Other choices fading out
  | 'anticipation'   // Pause before commitment
  | 'committed'      // Heavy haptic, choice committed
  | 'flying-up'      // Choice animating to transcript
  | 'complete'       // Animation finished

export interface UseChoiceCommitmentReturn {
  /** Current animation state */
  animationState: ChoiceAnimationState
  /** ID of the selected choice (null if none) */
  selectedChoiceId: string | null
  /** Whether animation is in progress */
  isCommitting: boolean
  /** Start the commitment animation sequence */
  commitChoice: (choiceId: string, onComplete: () => void) => Promise<void>
  /** Reset animation state (for cleanup) */
  reset: () => void
  /** Whether screen should be dimmed */
  shouldDimScreen: boolean
}

export function useChoiceCommitment(): UseChoiceCommitmentReturn {
  const prefersReducedMotion = useReducedMotion()
  const [animationState, setAnimationState] = useState<ChoiceAnimationState>('idle')
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setAnimationState('idle')
    setSelectedChoiceId(null)
  }, [])

  const commitChoice = useCallback(async (choiceId: string, onComplete: () => void) => {
    // If reduced motion, skip animation and call immediately
    if (prefersReducedMotion) {
      haptics.lightTap()
      onComplete()
      return
    }

    const { timing } = signatureChoice

    // Step 1: Tapped - scale down + light haptic
    setSelectedChoiceId(choiceId)
    setAnimationState('tapped')
    haptics.lightTap()

    // Step 2: Fade out other choices
    await sleep(100)
    setAnimationState('fading-others')

    // Step 3: Anticipation pause
    await sleep(timing.fadeOutDuration * 1000)
    setAnimationState('anticipation')

    // Step 4: Heavy haptic + committed
    await sleep(timing.anticipationPause * 1000)
    haptics.heavyThud()
    setAnimationState('committed')

    // Step 5: Fly up to transcript
    await sleep(200)
    setAnimationState('flying-up')

    // Step 6: Complete - call the callback
    await sleep(timing.flyUpDuration * 1000)
    setAnimationState('complete')

    // Step 7: Silence before NPC response
    await sleep(timing.silenceBeats * 1000)

    // Trigger the actual choice handler
    onComplete()

    // Reset after a brief moment
    await sleep(100)
    reset()
  }, [prefersReducedMotion, reset])

  const isCommitting = animationState !== 'idle' && animationState !== 'complete'
  const shouldDimScreen = ['fading-others', 'anticipation', 'committed', 'flying-up'].includes(animationState)

  return {
    animationState,
    selectedChoiceId,
    isCommitting,
    commitChoice,
    reset,
    shouldDimScreen,
  }
}

/**
 * Helper function for async sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Get animation variants for a choice button based on current state
 */
export function getChoiceAnimationProps(
  choiceId: string,
  selectedId: string | null,
  animationState: ChoiceAnimationState
): {
  animate: string
  style?: React.CSSProperties
} {
  if (!selectedId) {
    return { animate: 'visible' }
  }

  const isSelected = choiceId === selectedId

  if (isSelected) {
    switch (animationState) {
      case 'tapped':
        return { animate: 'tapped' }
      case 'fading-others':
      case 'anticipation':
        return { animate: 'tapped' }
      case 'committed':
        return { animate: 'committed' }
      case 'flying-up':
        return { animate: 'flyUp' }
      default:
        return { animate: 'visible' }
    }
  } else {
    // Non-selected choices
    switch (animationState) {
      case 'fading-others':
      case 'anticipation':
      case 'committed':
      case 'flying-up':
        return { animate: 'fadeOut' }
      default:
        return { animate: 'visible' }
    }
  }
}
