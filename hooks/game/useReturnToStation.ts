'use client'

import { useCallback, type Dispatch, type SetStateAction } from 'react'
import type { GameInterfaceState } from '@/lib/game-interface-types'
import { CharacterState, GameStateUtils, type GameState } from '@/lib/character-state'
import {
  DialogueGraphNavigator,
  StateConditionEvaluator,
} from '@/lib/dialogue-graph'
import {
  getGraphForCharacter,
  findCharacterForNode,
  type CharacterId,
} from '@/lib/graph-registry'
import { samuelEntryPoints } from '@/content/samuel-dialogue-graph'
import { useGameStore, commitGameState } from '@/lib/game-store'
import { isSupabaseConfigured } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { applyPatternReflection } from '@/lib/consequence-echoes'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
import { queueRelationshipSync, queuePlatformStateSync } from '@/lib/sync-queue'

interface UseReturnToStationParams {
  setState: Dispatch<SetStateAction<GameInterfaceState>>
  // TD-001: gameState passed explicitly from Zustand (via useCoreGameStateHydrated)
  gameState: GameState | null
}

export function useReturnToStation({ setState, gameState }: UseReturnToStationParams) {
  // TD-001: gameState passed explicitly from Zustand
  const handleReturnToStation = useCallback(async () => {
    if (!gameState) return

    try {
      // Determine which Samuel entry point to use based on completed arcs
      let targetNodeId: string = samuelEntryPoints.INTRODUCTION

      // Check for character-specific reflection gateways
      const globalFlags = Array.from(gameState.globalFlags)
      if (globalFlags.includes('kai_arc_complete')) {
        targetNodeId = samuelEntryPoints.KAI_REFLECTION_GATEWAY
      } else if (globalFlags.includes('maya_arc_complete') && !globalFlags.includes('devon_arc_complete')) {
        targetNodeId = samuelEntryPoints.HUB_AFTER_MAYA
      } else if (globalFlags.includes('devon_arc_complete')) {
        targetNodeId = samuelEntryPoints.HUB_AFTER_DEVON
      } else if (globalFlags.includes('marcus_arc_complete')) {
        targetNodeId = samuelEntryPoints.MARCUS_REFLECTION_GATEWAY
      } else if (globalFlags.includes('jordan_arc_complete')) {
        targetNodeId = samuelEntryPoints.JORDAN_REFLECTION_GATEWAY
      } else if (globalFlags.includes('tess_arc_complete')) {
        targetNodeId = samuelEntryPoints.TESS_REFLECTION_GATEWAY
      } else if (globalFlags.includes('yaquin_arc_complete')) {
        targetNodeId = samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY
      } else if (globalFlags.includes('rohan_arc_complete')) {
        targetNodeId = samuelEntryPoints.ROHAN_REFLECTION_GATEWAY
      } else if (globalFlags.includes('silas_arc_complete')) {
        targetNodeId = samuelEntryPoints.SILAS_REFLECTION_GATEWAY
      } else if (globalFlags.includes('maya_arc_complete')) {
        targetNodeId = samuelEntryPoints.MAYA_REFLECTION_GATEWAY
      } else {
        // Default to initial hub or introduction
        targetNodeId = samuelEntryPoints.HUB_INITIAL || samuelEntryPoints.INTRODUCTION
      }

      // Find the character and graph for the target node
      const searchResult = findCharacterForNode(targetNodeId, gameState)
      if (!searchResult) {
        logger.error('Failed to find Samuel hub node:', { targetNodeId })
        // Fallback: reset to introduction
        const samuelGraph = getGraphForCharacter('samuel', gameState)
        const introNode = samuelGraph.nodes.get(samuelEntryPoints.INTRODUCTION)
        if (introNode) {
          // STATE FIX: Use full clone instead of shallow clone
          const newGameState = GameStateUtils.cloneGameState(gameState)
          newGameState.currentNodeId = introNode.nodeId
          newGameState.currentCharacterId = 'samuel'
          const samuelChar = newGameState.characters.get('samuel') || GameStateUtils.createCharacterState('samuel')
          newGameState.characters.set('samuel', samuelChar)
          const content = DialogueGraphNavigator.selectContent(introNode, samuelChar.conversationHistory, newGameState)
          const regularSamuelChoices = StateConditionEvaluator.evaluateChoices(introNode, newGameState, 'samuel', newGameState.skillLevels).filter(c => c.visible)

          // Add pattern-unlocked choices for Samuel
          const patternUnlockSamuelChoices = getPatternUnlockChoices(
            'samuel',
            newGameState.patterns,
            samuelGraph,
            samuelChar.visitedPatternUnlocks
          )
          const choices = [...regularSamuelChoices, ...patternUnlockSamuelChoices]

          // Apply pattern reflection
          const reflected = applyPatternReflection(
            content.text,
            content.emotion,
            content.patternReflection,
            newGameState.patterns
          )

          // TD-001: Atomic commit to both Zustand and localStorage
          commitGameState(newGameState, { reason: 'return-to-station-fallback' })

          setState(prev => ({
            ...prev,
            // TD-001: gameState removed - now in Zustand only
            currentNode: introNode,
            currentGraph: samuelGraph,
            currentCharacterId: 'samuel',
            availableChoices: choices,
            currentContent: reflected.text,
            currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
            useChatPacing: content.useChatPacing || false,
            isLoading: false,
            isProcessing: false
          }))
          return
        }
        // If fallback also fails, show error
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Could not find hub node "${targetNodeId}" or fallback introduction. Please refresh the page.`,
            severity: 'error' as const
          },
          isLoading: false,
          isProcessing: false
        }))
        return
      }

      const targetNode = searchResult.graph.nodes.get(targetNodeId)
      if (!targetNode) {
        logger.error('Target node not found:', { targetNodeId })
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Target node "${targetNodeId}" not found in graph. Please refresh the page.`,
            severity: 'error' as const
          },
          isLoading: false,
          isProcessing: false
        }))
        return
      }

      // Navigate to the target node (similar to handleChoice but without choice consequences)
      // STATE FIX: Start with full clone to avoid mutations
      let newGameState = GameStateUtils.cloneGameState(gameState)
      const targetCharacterId = searchResult.characterId
      const targetGraph = searchResult.graph

      // Apply onEnter effects if any
      if (targetNode.onEnter) {
        for (const change of targetNode.onEnter) {
          newGameState = GameStateUtils.applyStateChange(newGameState, change)
        }
      }

      // Ensure character exists
      if (!newGameState.characters.has(targetCharacterId)) {
        const newChar = GameStateUtils.createCharacterState(targetCharacterId)
        newGameState.characters.set(targetCharacterId, newChar)
      }

      // STATE FIX: Update conversation history immutably
      let targetCharacter = newGameState.characters.get(targetCharacterId)!
      if (!targetCharacter.conversationHistory.includes(targetNode.nodeId)) {
        const updatedCharacter: CharacterState = {
          ...targetCharacter,
          conversationHistory: [...targetCharacter.conversationHistory, targetNode.nodeId]
        }
        newGameState.characters.set(targetCharacterId, updatedCharacter)
        targetCharacter = updatedCharacter
      }
      newGameState.currentNodeId = targetNode.nodeId
      newGameState.currentCharacterId = targetCharacterId

      const content = DialogueGraphNavigator.selectContent(targetNode, targetCharacter.conversationHistory, newGameState)
      const regularNavChoices = StateConditionEvaluator.evaluateChoices(targetNode, newGameState, targetCharacterId, newGameState.skillLevels).filter(c => c.visible)

      // Add pattern-unlocked choices
      const patternUnlockNavChoices = getPatternUnlockChoices(
        targetCharacterId,
        newGameState.patterns,
        targetGraph,
        targetCharacter.visitedPatternUnlocks
      )
      const choices = [...regularNavChoices, ...patternUnlockNavChoices]

      // Apply pattern reflection
      const reflected = applyPatternReflection(
        content.text,
        content.emotion,
        content.patternReflection,
        newGameState.patterns
      )

      // P6: Check for Loyalty Experience Trigger
      if (targetNode.metadata?.experienceId) {
        import("@/lib/experience-engine").then(({ ExperienceEngine }) => {
          const expState = ExperienceEngine.startExperience(targetNode.metadata!.experienceId as any)
          if (expState) {
            setState(prev => ({
              ...prev,
              activeExperience: expState,
              // TD-001: gameState removed - now in Zustand only
              currentNode: targetNode, // Keep node for context/return
              isProcessing: false
            }))
            return
          }
        })
      }

      // TD-001: Atomic commit to both Zustand and localStorage
      commitGameState(newGameState, { reason: 'return-to-station' })
      useGameStore.getState().markSceneVisited(targetNode.nodeId)

      setState(prev => ({
        ...prev,
        // TD-001: gameState removed - now in Zustand only
        currentNode: targetNode,
        currentGraph: targetGraph,
        currentCharacterId: targetCharacterId,
        availableChoices: choices,
        currentContent: reflected.text,
        currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
        useChatPacing: content.useChatPacing || false,
        isLoading: false,
        isProcessing: false
      }))

      // Sync to Supabase
      if (isSupabaseConfigured()) {
        const character = newGameState.characters.get(targetCharacterId)
        if (character) {
          queueRelationshipSync({
            user_id: newGameState.playerId,
            character_name: targetCharacterId,
            trust_level: character.trust,
            relationship_status: character.relationshipStatus,
            interaction_count: character.conversationHistory.length
          })
        }
        queuePlatformStateSync({
          user_id: newGameState.playerId,
          current_scene: newGameState.currentNodeId,
          global_flags: Array.from(newGameState.globalFlags),
          patterns: newGameState.patterns
        })
      }
    } catch (error) {
      logger.error('[StatefulGameInterface] Error in handleReturnToStation:', { error })
      setState(prev => ({
        ...prev,
        error: {
          title: 'Navigation Error',
          message: error instanceof Error ? error.message : 'Failed to return to station. Please refresh the page.',
          severity: 'error' as const
        },
        isLoading: false
      }))
    }
  }, [gameState])

  return { handleReturnToStation }
}
