/**
 * useUnlockEffects Hook
 *
 * Provides unlock-based content enhancements to components
 * Integrates with existing pattern tracking and game state
 */

'use client'

import { useMemo } from 'react'
import { usePatternUnlocks } from './usePatternUnlocks'
import { getContentEnhancements } from '@/lib/unlock-effects'
import type { ContentEnhancement } from '@/lib/unlock-effects'
import type { PatternType } from '@/lib/patterns'
import type { GameState } from '@/lib/character-state'

/**
 * Hook to get content enhancements based on player's unlocks
 *
 * @param dialogueText - The dialogue text being rendered
 * @param dialogueEmotion - Emotion tag from DialogueContent
 * @param characterId - ID of the character being displayed
 * @param characterName - Display name of the character
 * @param gameState - Current game state (passed from parent component)
 * @returns Content enhancements to apply
 */
export function useUnlockEffects(
  dialogueText: string = '',
  dialogueEmotion?: string,
  characterId?: string,
  characterName?: string,
  gameState?: GameState
): ContentEnhancement {
  const { hasUnlock, orbs } = usePatternUnlocks()

  // Get pattern fill percentages
  const patternFills = useMemo((): Record<PatternType, number> => {
    const fills: Record<PatternType, number> = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }

    orbs.forEach(orb => {
      fills[orb.pattern] = orb.fillPercent
    })

    return fills
  }, [orbs])

  // Get current character state
  const currentCharacter = useMemo(() => {
    if (!characterId || !gameState) return undefined
    return gameState.characters.get(characterId)
  }, [characterId, gameState])

  // Get content enhancements
  const enhancements = useMemo(() => {
    if (!gameState || (!dialogueText && !dialogueEmotion)) {
      // No game state or no content to enhance
      return {
        showEmotionTag: false,
        showTrustLevel: false,
        highlightPatterns: []
      }
    }

    return getContentEnhancements({
      gameState,
      currentCharacter,
      characterName,
      dialogueText,
      dialogueEmotion,
      hasUnlock,
      patternFills
    })
  }, [dialogueText, dialogueEmotion, characterName, currentCharacter, gameState, hasUnlock, patternFills])

  return enhancements
}
