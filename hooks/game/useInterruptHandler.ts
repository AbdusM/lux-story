/**
 * useInterruptHandler - Interrupt System Handler
 *
 * Extracted from StatefulGameInterface.tsx (Phase 4B)
 *
 * Handles interrupt interactions during dialogue:
 * 1. Interrupt Trigger - Player acts during NPC speech
 * 2. Interrupt Timeout - Player didn't act in time
 * 3. D-084: Interrupt combo chains tracking
 */

import { useCallback } from 'react'
import type { GameState } from '@/lib/character-state'
import { GameStateUtils } from '@/lib/character-state'
import type { DialogueNode, DialogueGraph, DialogueContent, EvaluatedChoice } from '@/lib/dialogue-graph'
import type { InterruptWindow } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import type { ActiveComboState } from '@/lib/interrupt-derivatives'
import { shouldShowInterrupt } from '@/lib/interrupt-visibility'
import { resolveNode } from '@/hooks/game/useNarrativeNavigator'
import {
  INTERRUPT_COMBO_CHAINS,
  isComboChainExpired,
  advanceComboChain,
  isComboChainComplete,
  getComboChainReward,
  getAvailableComboChains,
  startComboChain,
} from '@/lib/interrupt-derivatives'
import { commitGameState } from '@/lib/game-store'
import { logger } from '@/lib/logger'

interface InterruptUpdate {
  currentNode: DialogueNode
  currentGraph: DialogueGraph
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: string
  currentDialogueContent: DialogueContent
  activeInterrupt: InterruptWindow | null
  activeComboChain: ActiveComboState | null
}

interface UseInterruptHandlerParams {
  gameState: GameState | null
  activeInterrupt: InterruptWindow | null
  activeComboChain: ActiveComboState | null
  onUpdate: (update: Partial<InterruptUpdate>) => void
}

interface UseInterruptHandlerResult {
  handleInterruptTrigger: () => void
  handleInterruptTimeout: () => void
}

/**
 * Provides handlers for interrupt trigger and timeout events.
 *
 * Implements D-084 (Interrupt Combo Chains) for tracking multi-step
 * interrupt sequences that grant bonus rewards.
 */
export function useInterruptHandler({
  gameState,
  activeInterrupt,
  activeComboChain,
  onUpdate,
}: UseInterruptHandlerParams): UseInterruptHandlerResult {

  /**
   * Handle interrupt trigger - player acted during NPC speech
   */
  const handleInterruptTrigger = useCallback(() => {
    if (!activeInterrupt || !gameState) return

    logger.info('[useInterruptHandler] Interrupt triggered:', {
      action: activeInterrupt.action,
      targetNodeId: activeInterrupt.targetNodeId
    })

    // Apply interrupt consequence if present
    let newGameState = gameState
    if (activeInterrupt.consequence) {
      newGameState = GameStateUtils.applyStateChange(newGameState, activeInterrupt.consequence)
    }

    // D-084: Track interrupt combo chains
    let newComboChain: ActiveComboState | null = activeComboChain

    // Check if current combo is expired
    if (newComboChain && isComboChainExpired(newComboChain)) {
      logger.info('[useInterruptHandler] D-084: Combo chain expired', { chainId: newComboChain.chainId })
      newComboChain = null
    }

    // Check if this interrupt advances or starts a combo
    if (newComboChain) {
      // Check if interrupt type matches current step
      const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === newComboChain!.chainId)
      if (chain) {
        const currentStepIndex = newComboChain.currentStep - 1
        if (currentStepIndex < chain.steps.length) {
          const expectedStep = chain.steps[currentStepIndex]
          if (activeInterrupt.type === expectedStep.interruptType) {
            // Advance the combo!
            newComboChain = advanceComboChain(newComboChain, expectedStep)
            logger.info('[useInterruptHandler] D-084: Combo chain advanced!', {
              chainId: newComboChain.chainId,
              step: newComboChain.currentStep,
              successText: expectedStep.successText
            })

            // Check if combo is complete
            if (isComboChainComplete(newComboChain)) {
              const reward = getComboChainReward(newComboChain)
              if (reward) {
                logger.info('[useInterruptHandler] D-084: Combo chain COMPLETE!', {
                  chainId: newComboChain.chainId,
                  reward
                })
                // Apply combo rewards
                newGameState = GameStateUtils.applyStateChange(newGameState, {
                  trustChange: reward.trustBonus,
                  patternChanges: { [reward.patternBonus.pattern]: reward.patternBonus.amount }
                })
                if (reward.specialFlag) {
                  newGameState = GameStateUtils.applyStateChange(newGameState, {
                    addGlobalFlags: [reward.specialFlag]
                  })
                }
              }
              newComboChain = null // Reset after completion
            }
          } else {
            // Wrong interrupt type - chain broken
            logger.info('[useInterruptHandler] D-084: Combo chain broken - wrong type', {
              expected: expectedStep.interruptType,
              got: activeInterrupt.type
            })
            newComboChain = null
          }
        }
      }
    } else {
      // No active combo - check if this interrupt starts one
      const availableChains = getAvailableComboChains(newGameState.patterns)
      const matchingChain = availableChains.find(chain =>
        chain.steps[0].interruptType === activeInterrupt.type
      )
      if (matchingChain) {
        newComboChain = startComboChain(matchingChain.id)
        if (newComboChain) {
          // Advance past first step since we just completed it
          newComboChain = advanceComboChain(newComboChain, matchingChain.steps[0])
          logger.info('[useInterruptHandler] D-084: Combo chain started!', {
            chainId: matchingChain.id,
            chainName: matchingChain.name
          })
        }
      }
    }

    // Navigate to the interrupt target node via centralized resolver
    const navResult = resolveNode(activeInterrupt.targetNodeId, newGameState, [])
    if (!navResult.success) {
      logger.error('[useInterruptHandler] Interrupt navigation failed:', {
        nodeId: activeInterrupt.targetNodeId,
        errorCode: navResult.errorCode,
      })
      onUpdate({ activeInterrupt: null })
      return
    }

    // TD-001: Atomic commit to both Zustand and localStorage
    commitGameState(newGameState, { reason: 'interrupt-choice' })

    // Update UI-ephemeral state
    onUpdate({
      currentNode: navResult.nextNode,
      currentGraph: navResult.targetGraph,
      currentCharacterId: navResult.targetCharacterId,
      availableChoices: navResult.availableChoices,
      currentContent: navResult.reflectedText,
      currentDialogueContent: { ...navResult.content, text: navResult.reflectedText, emotion: navResult.reflectedEmotion },
      activeInterrupt: shouldShowInterrupt(navResult.content.interrupt, newGameState.patterns),
      activeComboChain: newComboChain
    })
  }, [activeInterrupt, gameState, activeComboChain, onUpdate])

  /**
   * Handle interrupt timeout - player didn't act
   */
  const handleInterruptTimeout = useCallback(() => {
    if (!activeInterrupt || !gameState) return

    logger.info('[useInterruptHandler] Interrupt timed out:', { action: activeInterrupt.action })

    // Clear the interrupt - if there's a missedNodeId, navigate there
    if (activeInterrupt.missedNodeId) {
      const missedNav = resolveNode(activeInterrupt.missedNodeId, gameState, [])
      if (missedNav.success) {
        // D-084: Reset combo chain when interrupt is missed
        onUpdate({
          currentNode: missedNav.nextNode,
          currentGraph: missedNav.targetGraph,
          currentCharacterId: missedNav.targetCharacterId,
          availableChoices: missedNav.availableChoices,
          currentContent: missedNav.reflectedText,
          currentDialogueContent: { ...missedNav.content, text: missedNav.reflectedText, emotion: missedNav.reflectedEmotion },
          activeInterrupt: shouldShowInterrupt(missedNav.content.interrupt, gameState.patterns),
          activeComboChain: null
        })
        return
      }
    }

    // No missedNodeId or it wasn't found - just clear the interrupt
    // D-084: Also reset combo chain
    onUpdate({ activeInterrupt: null, activeComboChain: null })
  }, [activeInterrupt, gameState, onUpdate])

  return {
    handleInterruptTrigger,
    handleInterruptTimeout,
  }
}
