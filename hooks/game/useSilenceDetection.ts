/**
 * useSilenceDetection - Active Silence Detection Hook
 *
 * Extracted from StatefulGameInterface.tsx (Phase 4A)
 *
 * Monitors player silence and triggers dynamic NPC reactions when:
 * 1. Player hasn't made a choice for 15 seconds
 * 2. Current node has a content variation gated by 'temporary_silence'
 *
 * This creates "the silence speaks" moments where NPCs react to hesitation.
 */

import { useEffect } from 'react'
import type { GameState } from '@/lib/character-state'
import type { DialogueNode, DialogueContent } from '@/lib/dialogue-graph'
import { DialogueGraphNavigator } from '@/lib/dialogue-graph'
import { applyPatternReflection } from '@/lib/consequence-echoes'
import { logger } from '@/lib/logger'

const SILENCE_THRESHOLD_MS = 15000 // 15 seconds

interface UseSilenceDetectionParams {
  gameState: GameState | null
  currentNode: DialogueNode | null
  currentDialogueContent: DialogueContent | null
  isProcessing: boolean
  activeInterrupt: unknown | null
  onSilenceTriggered: (update: {
    currentContent: string
    currentDialogueContent: DialogueContent
    patternSensation: string
  }) => void
}

/**
 * Detects player silence and triggers NPC reactions.
 *
 * When a player remains silent for 15 seconds on a node that has
 * a 'temporary_silence' content variation, this hook will:
 * 1. Add the temporary_silence flag to gameState
 * 2. Re-select content with the new flag
 * 3. Call onSilenceTriggered with the new content
 */
export function useSilenceDetection({
  gameState,
  currentNode,
  currentDialogueContent,
  isProcessing,
  activeInterrupt,
  onSilenceTriggered,
}: UseSilenceDetectionParams): void {
  useEffect(() => {
    // Only run if we are in a dialogue state and not processing
    if (!gameState || !currentNode || isProcessing || activeInterrupt) return

    const silenceTimer = setTimeout(() => {
      // Check if current node has a silence variation
      const silenceVariation = currentNode.content.find(c =>
        c.condition &&
        c.condition.hasGlobalFlags &&
        c.condition.hasGlobalFlags.includes('temporary_silence')
      )

      if (silenceVariation) {
        logger.info('[useSilenceDetection] Silence detected. Triggering dynamic reaction.', {
          nodeId: currentNode.nodeId
        })

        // Create temporary state with silence flag
        const activeSilenceState: GameState = {
          ...gameState,
          saveVersion: gameState.saveVersion || '1.0',
          globalFlags: new Set([...gameState.globalFlags, 'temporary_silence'])
        }

        // Select the new content with silence flag active
        const newContent = DialogueGraphNavigator.selectContent(
          currentNode,
          [],
          activeSilenceState
        )

        // Only update if content actually changed
        if (newContent.variation_id !== currentDialogueContent?.variation_id) {
          // Apply pattern reflection to the new content
          const reflected = applyPatternReflection(
            newContent.text,
            newContent.emotion,
            newContent.patternReflection,
            activeSilenceState.patterns
          )

          onSilenceTriggered({
            currentContent: reflected.text,
            currentDialogueContent: {
              ...newContent,
              text: reflected.text,
              emotion: reflected.emotion
            },
            patternSensation: "The silence speaks..."
          })
        }
      }
    }, SILENCE_THRESHOLD_MS)

    return () => clearTimeout(silenceTimer)
  }, [
    currentNode,
    currentDialogueContent?.variation_id,
    isProcessing,
    activeInterrupt,
    gameState,
    onSilenceTriggered
  ])
}
