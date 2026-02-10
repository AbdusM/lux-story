/**
 * useNarrativeNavigator - Extracted from StatefulGameInterface (Phase 1.3)
 *
 * Encapsulates the repeating pattern of:
 * 1. Finding a node in a character graph
 * 2. Selecting dialogue content for it
 * 3. Evaluating available choices
 * 4. Adding pattern unlock choices
 *
 * Side-effects contract:
 * - Inputs: graph registry, game state
 * - State it mutates: NONE — returns computed results
 * - Store setters: NONE — caller applies results
 */

import { useCallback } from 'react'
import {
  DialogueGraph,
  DialogueNode,
  DialogueContent,
  StateConditionEvaluator,
  DialogueGraphNavigator,
  EvaluatedChoice,
} from '@/lib/dialogue-graph'
import {
  CharacterId,
  findCharacterForNode,
} from '@/lib/graph-registry'
import { GameState } from '@/lib/character-state'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
import { applyPatternReflection, applySkillReflection, applyNervousSystemReflection } from '@/lib/consequence-echoes'
import { logger } from '@/lib/logger'

export interface NavigationResult {
  success: true
  nextNode: DialogueNode
  targetGraph: DialogueGraph
  targetCharacterId: CharacterId
  content: DialogueContent
  reflectedText: string
  reflectedEmotion: string | undefined
  availableChoices: EvaluatedChoice[]
}

export type NavigationErrorCode = 'MISSING_GRAPH' | 'MISSING_NODE' | 'MISSING_CHARACTER' | 'REQUIRED_STATE'

export interface NavigationError {
  success: false
  errorCode: NavigationErrorCode
  error: {
    title: string
    message: string
    severity: 'error' | 'warning' | 'info'
  }
}

export type NavigateResult = NavigationResult | NavigationError

export type ResolveNodeOptions = {
  /**
   * Strict-mode contract check: if true, `requiredState` is enforced and navigation fails
   * when the node's requiredState is not satisfied. Default false to preserve runtime behavior.
   */
  enforceRequiredState?: boolean
}

/**
 * Resolve a node ID to its full navigation result:
 * graph, node, content, choices.
 *
 * Pure computation — no side effects.
 */
export function resolveNode(
  nodeId: string,
  gameState: GameState,
  conversationHistory: string[],
  options?: ResolveNodeOptions,
): NavigateResult {
  const searchResult = findCharacterForNode(nodeId, gameState)
  if (!searchResult) {
    return {
      success: false,
      errorCode: 'MISSING_GRAPH',
      error: {
        title: 'Navigation Error',
        message: `Could not find node "${nodeId}". Please refresh the page to restart.`,
        severity: 'error',
      },
    }
  }

  const nextNode = searchResult.graph.nodes.get(nodeId)
  if (!nextNode) {
    return {
      success: false,
      errorCode: 'MISSING_NODE',
      error: {
        title: 'Navigation Error',
        message: `Node "${nodeId}" not found in ${searchResult.graph.metadata?.title || 'graph'}. Please refresh.`,
        severity: 'error',
      },
    }
  }

  const targetGraph = searchResult.graph
  const targetCharacterId = searchResult.characterId as CharacterId

  if (options?.enforceRequiredState && nextNode.requiredState) {
    const ok = StateConditionEvaluator.evaluate(
      nextNode.requiredState,
      gameState,
      targetCharacterId,
      gameState.skillLevels,
    )
    if (!ok) {
      return {
        success: false,
        errorCode: 'REQUIRED_STATE',
        error: {
          title: 'Navigation Error',
          message: `Node "${nodeId}" requiredState is not satisfied for ${targetCharacterId}.`,
          severity: 'warning',
        },
      }
    }
  }

  // Select content variation
  const content = DialogueGraphNavigator.selectContent(nextNode, conversationHistory, gameState)

  // Evaluate choices
  const regularChoices = StateConditionEvaluator.evaluateChoices(
    nextNode,
    gameState,
    targetCharacterId,
    gameState.skillLevels,
  ).filter(c => c.visible)

  // Get target character state for pattern unlocks
  const targetCharacter = gameState.characters.get(targetCharacterId)

  // Add pattern-unlocked choices
  const patternUnlockChoices = getPatternUnlockChoices(
    targetCharacterId,
    gameState.patterns,
    targetGraph,
    targetCharacter?.visitedPatternUnlocks,
  )

  const availableChoices = [...regularChoices, ...patternUnlockChoices]

  // Apply pattern reflection to content
  const mergedPatternReflection = nextNode.patternReflection || content.patternReflection
  const reflected = applyPatternReflection(
    content.text,
    content.emotion,
    mergedPatternReflection,
    gameState.patterns,
  )

  return {
    success: true,
    nextNode,
    targetGraph,
    targetCharacterId,
    content,
    reflectedText: reflected.text,
    reflectedEmotion: reflected.emotion,
    availableChoices,
  }
}

export interface UseNarrativeNavigatorReturn {
  /**
   * Resolve a node ID to its full navigation result.
   * Returns success/error discriminated union.
   */
  resolveNode: (
    nodeId: string,
    gameState: GameState,
    conversationHistory: string[],
  ) => NavigateResult
}

/**
 * Hook providing navigation utilities for the dialogue system.
 * Stateless — all state management is handled by the caller.
 */
export function useNarrativeNavigator(): UseNarrativeNavigatorReturn {
  const resolve = useCallback(
    (nodeId: string, gameState: GameState, conversationHistory: string[]) => {
      return resolveNode(nodeId, gameState, conversationHistory)
    },
    [],
  )

  return { resolveNode: resolve }
}
