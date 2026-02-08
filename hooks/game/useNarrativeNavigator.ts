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
import { applyPatternReflection } from '@/lib/consequence-echoes'
import { isComboUnlocked as isPatternComboUnlocked } from '@/lib/pattern-combos'

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

export type NavigationErrorCode =
  | 'MISSING_GRAPH'
  | 'MISSING_NODE'
  | 'MISSING_CHARACTER'
  | 'REQUIRED_STATE_VIOLATION'

export type RequiredStateViolationDiagnostic = {
  nodeId: string
  targetCharacterId: CharacterId
  requiredState: unknown
  missing: Record<string, unknown>
}

export interface NavigationError {
  success: false
  errorCode: NavigationErrorCode
  error: {
    title: string
    message: string
    severity: 'error' | 'warning' | 'info'
  }
  diagnostic?: RequiredStateViolationDiagnostic
}

export type NavigateResult = NavigationResult | NavigationError

export type ResolveNodeOptions = {
  /**
   * Strict-mode contract check: if enabled, navigating to a node whose
   * `requiredState` is not satisfied becomes a hard error.
   *
   * Production behavior default remains unchanged (false).
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
  opts?: ResolveNodeOptions,
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

  if (
    opts?.enforceRequiredState &&
    !StateConditionEvaluator.evaluate(nextNode.requiredState, gameState, targetCharacterId, gameState.skillLevels)
  ) {
    const missing = describeMissingRequiredState(nextNode.requiredState, gameState, targetCharacterId)
    return {
      success: false,
      errorCode: 'REQUIRED_STATE_VIOLATION',
      error: {
        title: 'Navigation Error',
        message: `Strict navigation blocked at "${nodeId}": requiredState not satisfied.`,
        severity: 'error',
      },
      diagnostic: {
        nodeId,
        targetCharacterId,
        requiredState: nextNode.requiredState ?? {},
        missing,
      },
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

function describeMissingRequiredState(
  requiredState: DialogueNode['requiredState'] | undefined,
  gameState: GameState,
  characterId: CharacterId,
): Record<string, unknown> {
  const required = requiredState ?? {}
  const charState = gameState.characters.get(characterId)

  const missing: Record<string, unknown> = {}

  if (required.trust) {
    const currentTrust = charState?.trust ?? 0
    const min = required.trust.min
    const max = required.trust.max
    if ((min !== undefined && currentTrust < min) || (max !== undefined && currentTrust > max)) {
      missing.trust = { current: currentTrust, required: required.trust }
    }
  }

  if (required.hasGlobalFlags?.length) {
    const absent = required.hasGlobalFlags.filter(f => !gameState.globalFlags.has(f))
    if (absent.length) missing.hasGlobalFlags = absent
  }
  if (required.lacksGlobalFlags?.length) {
    const present = required.lacksGlobalFlags.filter(f => gameState.globalFlags.has(f))
    if (present.length) missing.lacksGlobalFlags = present
  }

  if (required.hasKnowledgeFlags?.length) {
    const absent = required.hasKnowledgeFlags.filter(f => !charState?.knowledgeFlags?.has(f))
    if (absent.length) missing.hasKnowledgeFlags = absent
  }
  if (required.lacksKnowledgeFlags?.length) {
    const present = required.lacksKnowledgeFlags.filter(f => charState?.knowledgeFlags?.has(f))
    if (present.length) missing.lacksKnowledgeFlags = present
  }

  if (required.patterns) {
    const unmet: Record<string, unknown> = {}
    for (const [pattern, range] of Object.entries(required.patterns)) {
      const current = gameState.patterns[pattern as keyof typeof gameState.patterns]
      if (!range) continue
      if (range.min !== undefined && current < range.min) {
        unmet[pattern] = { current, required: range }
      } else if (range.max !== undefined && current > range.max) {
        unmet[pattern] = { current, required: range }
      }
    }
    if (Object.keys(unmet).length) missing.patterns = unmet
  }

  if (required.mysteries) {
    const unmet: Record<string, unknown> = {}
    for (const [key, requiredValue] of Object.entries(required.mysteries)) {
      const current = gameState.mysteries[key as keyof typeof gameState.mysteries]
      if (current !== requiredValue) {
        unmet[key] = { current, required: requiredValue }
      }
    }
    if (Object.keys(unmet).length) missing.mysteries = unmet
  }

  if (required.requiredCombos?.length) {
    // requiredCombos in StateCondition refers to pattern-combos (not skills).
    // Keep the missing list actionable for content authors.
    const absent = required.requiredCombos.filter(comboId => !isPatternComboUnlocked(comboId, gameState.patterns))
    if (absent.length) missing.requiredCombos = absent
  }

  return missing
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
