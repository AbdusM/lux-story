/**
 * useConstellationNavigation - Constellation Panel Navigation Bridge
 *
 * Extracted from StatefulGameInterface.tsx (Phase 4A)
 *
 * Connects the Constellation Panel to the Game Interface by listening
 * for navigation requests from the Zustand store and handling:
 * 1. Conductor Mode - Routes travel through Samuel (D-102)
 * 2. God Mode Conductor - Routes simulations through Samuel
 * 3. Direct Navigation - Standard character/node jumps
 */

import { useEffect } from 'react'
import type { GameState } from '@/lib/character-state'
import type { DialogueGraph, DialogueNode, DialogueContent, EvaluatedChoice } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import { useGameStore, commitGameState } from '@/lib/game-store'
import { getGraphForCharacter } from '@/lib/graph-registry'
import { characterNames } from '@/lib/game-interface-types'
import { TextProcessor } from '@/lib/text-processor'
import {
  applyPatternReflection,
  resolveContentVoiceVariation,
  applySkillReflection,
  applyNervousSystemReflection
} from '@/lib/consequence-echoes'
import { StateConditionEvaluator } from '@/lib/dialogue-graph'
import { logger } from '@/lib/logger'

interface NavigationUpdate {
  currentNode: DialogueNode
  currentGraph: DialogueGraph
  currentCharacterId: CharacterId
  currentContent: string
  currentDialogueContent: DialogueContent
  availableChoices: EvaluatedChoice[]
  previousSpeaker: null
  consequenceEcho?: null
}

interface UseConstellationNavigationParams {
  gameState: GameState | null
  currentCharacterId: CharacterId | null
  onNavigate: (update: NavigationUpdate) => void
}

/**
 * Handles navigation requests from the Constellation Panel.
 *
 * Implements D-102 (Conductor Mode) where all travel is routed through
 * Samuel unless we're already talking to him or targeting him directly.
 */
export function useConstellationNavigation({
  gameState,
  currentCharacterId,
  onNavigate,
}: UseConstellationNavigationParams): void {
  const requestedSceneId = useGameStore(s => s.currentSceneId)

  useEffect(() => {
    if (!requestedSceneId || !gameState) return

    const targetCharId = requestedSceneId as CharacterId

    // ============= CONDUCTOR MODE LOGIC =============
    // D-102: Route all travel through Samuel (The Conductor) unless:
    // 1. We are already talking to Samuel (avoid loops)
    // 2. The target IS Samuel (direct travel permitted)
    // 3. It's a specific internal node jump (contains underscores not ending in 'introduction')

    const isCharacterJump = !requestedSceneId.includes('_') || requestedSceneId.endsWith('_introduction')
    const isTargetSamuel = targetCharId === 'samuel' || requestedSceneId.startsWith('samuel_')
    const currentIsSamuel = currentCharacterId === 'samuel'

    if (isCharacterJump && !isTargetSamuel && !currentIsSamuel) {
      logger.info('[Conductor Mode] Intercepting travel request', { target: targetCharId })

      // Store the destination
      useGameStore.getState().setPendingTravelTarget(targetCharId)
      // Clear the request to stop this hook re-firing immediately
      useGameStore.getState().setCurrentScene(null)

      // Navigate to Samuel's Conductor Node
      const conductorNodeId = 'samuel_conductor'
      const samuelGraph = getGraphForCharacter('samuel', gameState)
      const conductorNode = samuelGraph.nodes.get(conductorNodeId)

      if (conductorNode) {
        // Dynamic Variable Injection for Conductor Mode
        const targetCharacter = gameState?.characters.get(targetCharId)
        const hasMet = (targetCharacter?.conversationHistory?.length || 0) > 0
        const targetName = characterNames[targetCharId] || 'someone'
        const conductorAction = hasMet ? 'Heading back to' : 'Off to see'

        const processedText = TextProcessor.process(
          conductorNode.content[0].text,
          gameState!,
          { targetName, conductorAction }
        )

        onNavigate({
          currentNode: conductorNode,
          currentGraph: samuelGraph,
          currentCharacterId: 'samuel',
          currentContent: processedText,
          currentDialogueContent: conductorNode.content[0],
          availableChoices: StateConditionEvaluator.evaluateChoices(conductorNode, gameState!, 'samuel', gameState!.skillLevels),
          previousSpeaker: null
        })
        return
      }
    }

    // ============= GOD MODE CONDUCTOR =============
    // Handle God Mode simulation requests that go through Samuel
    if (requestedSceneId === 'samuel_conductor_god_mode') {
      logger.info('[God Mode Conductor] Routing simulation through Samuel')

      useGameStore.getState().setCurrentScene(null)

      const conductorNodeId = 'samuel_conductor_god_mode'
      const samuelGraph = getGraphForCharacter('samuel', gameState)
      const conductorNode = samuelGraph.nodes.get(conductorNodeId)

      if (conductorNode) {
        const pendingSim = useGameStore.getState().pendingGodModeSimulation
        const simTitle = pendingSim?.title?.replace('[DEBUG] ', '') || 'a simulation'

        const processedText = TextProcessor.process(
          conductorNode.content[0].text,
          gameState!,
          { simulationTitle: simTitle }
        )

        onNavigate({
          currentNode: conductorNode,
          currentGraph: samuelGraph,
          currentCharacterId: 'samuel',
          currentContent: processedText,
          currentDialogueContent: conductorNode.content[0],
          availableChoices: StateConditionEvaluator.evaluateChoices(conductorNode, gameState!, 'samuel', gameState!.skillLevels),
          previousSpeaker: null
        })
        return
      }
    }
    // ===============================================

    // Default to [char]_introduction convention
    const targetNodeId = `${requestedSceneId}_introduction`
    const graph = getGraphForCharacter(targetCharId, gameState)

    let targetNode = graph.nodes.get(targetNodeId)
    if (!targetNode && graph.nodes.size > 0) {
      targetNode = graph.nodes.values().next().value
    }

    if (targetNode) {
      logger.info('Navigating via Constellation', { target: requestedSceneId, resolvedNode: targetNode.nodeId })

      // Apply voice variation pipeline for consistency
      const content = targetNode.content[0]
      const gamePatterns = gameState!.patterns
      const skillLevels = gameState!.skillLevels
      const charState = gameState!.characters.get(targetCharId)

      // Apply pattern reflection first
      const mergedPatternReflection = targetNode.patternReflection || content.patternReflection
      let reflected = applyPatternReflection(content.text, content.emotion, mergedPatternReflection, gamePatterns)

      // Apply voice variations (NPC responds to player's dominant pattern)
      const contentWithReflection = { ...content, text: reflected.text, emotion: reflected.emotion }
      const voiceVaried = resolveContentVoiceVariation(contentWithReflection, gamePatterns)
      const skillReflected = applySkillReflection(voiceVaried, skillLevels)
      const fullyReflected = applyNervousSystemReflection(skillReflected, charState?.nervousSystemState)

      // Update reflected with all bidirectional reflections
      reflected = { text: fullyReflected.text, emotion: fullyReflected.emotion || reflected.emotion }

      onNavigate({
        currentNode: targetNode!,
        currentGraph: graph,
        currentCharacterId: targetCharId,
        currentContent: reflected.text,
        currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
        availableChoices: StateConditionEvaluator.evaluateChoices(targetNode!, gameState!, targetCharId, gameState!.skillLevels),
        previousSpeaker: null,
        consequenceEcho: null
      })

      // TD-001: Atomic commit to both Zustand and localStorage
      const newState = {
        ...gameState,
        currentNodeId: targetNode.nodeId,
        currentCharacterId: targetCharId
      }
      commitGameState(newState, { reason: 'constellation-navigation' })
    }

    // Reset the request so we don't loop
    useGameStore.getState().setCurrentScene(null)

  }, [requestedSceneId, gameState, currentCharacterId, onNavigate])
}
