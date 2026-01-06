/**
 * Pattern Unlock Choices
 *
 * Generates special choices for pattern-unlocked dialogue nodes.
 * When a player's pattern reaches a threshold, they gain access to
 * special dialogue branches with that character.
 */

import { getPatternUnlocks, CHARACTER_PATTERN_AFFINITIES } from './pattern-affinity'
import { PatternType } from './patterns'
import type { EvaluatedChoice, ConditionalChoice, DialogueGraph } from './dialogue-graph'

interface PatternUnlockChoice extends EvaluatedChoice {
  isPatternUnlock: true
  unlockDescription: string
}

/**
 * Get pattern-unlocked choices for a character based on player's pattern levels.
 * These represent special dialogue branches that unlock at pattern thresholds.
 *
 * @param characterId - The character to check unlocks for
 * @param patterns - Player's current pattern scores (0-100 scale for orb fill)
 * @param graph - The character's dialogue graph (to verify node exists)
 * @param visitedUnlocks - Set of already-visited unlock node IDs (to avoid re-showing)
 * @returns Array of evaluated choices for unlocked nodes
 */
export function getPatternUnlockChoices(
  characterId: string,
  patterns: Record<PatternType, number>,
  graph: DialogueGraph,
  visitedUnlocks?: Set<string>
): PatternUnlockChoice[] {
  // Convert pattern scores to orb fill percentages (0-100)
  // Pattern scores are typically 0-10, orb fill is 0-100
  const patternLevels: Record<PatternType, number> = {
    analytical: Math.min(100, patterns.analytical * 10),
    patience: Math.min(100, patterns.patience * 10),
    exploring: Math.min(100, patterns.exploring * 10),
    helping: Math.min(100, patterns.helping * 10),
    building: Math.min(100, patterns.building * 10)
  }

  // Get unlocked node IDs
  const unlockedNodeIds = getPatternUnlocks(characterId, patternLevels)
  if (unlockedNodeIds.length === 0) return []

  // Get affinity config for descriptions
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity?.patternUnlocks) return []

  const choices: PatternUnlockChoice[] = []

  for (const nodeId of unlockedNodeIds) {
    // Skip if already visited
    if (visitedUnlocks?.has(nodeId)) continue

    // Verify node exists in graph
    if (!graph.nodes.has(nodeId)) {
      console.warn(`[PatternUnlocks] Node "${nodeId}" not found in ${characterId} graph`)
      continue
    }

    // Find the unlock config for this node
    const unlockConfig = affinity.patternUnlocks.find(u => u.unlockedNodeId === nodeId)
    if (!unlockConfig) continue

    // Create a synthetic choice for this unlock
    const syntheticChoice: ConditionalChoice = {
      choiceId: `pattern_unlock_${nodeId}`,
      text: `✨ ${unlockConfig.description}`,
      nextNodeId: nodeId,
      pattern: unlockConfig.pattern,
      // No consequence - just navigation
    }

    choices.push({
      choice: syntheticChoice,
      visible: true,
      enabled: true,
      isPatternUnlock: true,
      unlockDescription: unlockConfig.description
    })
  }

  return choices
}

/**
 * Check if a player has any available pattern unlocks for a character.
 * Useful for showing indicators in the UI.
 */
export function hasAvailablePatternUnlocks(
  characterId: string,
  patterns: Record<PatternType, number>,
  visitedUnlocks?: Set<string>
): boolean {
  const patternLevels: Record<PatternType, number> = {
    analytical: Math.min(100, patterns.analytical * 10),
    patience: Math.min(100, patterns.patience * 10),
    exploring: Math.min(100, patterns.exploring * 10),
    helping: Math.min(100, patterns.helping * 10),
    building: Math.min(100, patterns.building * 10)
  }

  const unlockedNodeIds = getPatternUnlocks(characterId, patternLevels)

  if (visitedUnlocks) {
    return unlockedNodeIds.some(id => !visitedUnlocks.has(id))
  }

  return unlockedNodeIds.length > 0
}

/**
 * Get description of next unlock for a character (for progress indicators)
 */
export function getNextPatternUnlockProgress(
  characterId: string,
  patterns: Record<PatternType, number>
): { pattern: PatternType; current: number; threshold: number; description: string } | null {
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity?.patternUnlocks || affinity.patternUnlocks.length === 0) return null

  const patternLevels: Record<PatternType, number> = {
    analytical: Math.min(100, patterns.analytical * 10),
    patience: Math.min(100, patterns.patience * 10),
    exploring: Math.min(100, patterns.exploring * 10),
    helping: Math.min(100, patterns.helping * 10),
    building: Math.min(100, patterns.building * 10)
  }

  // Find the closest unlock that hasn't been reached yet
  const pendingUnlocks = affinity.patternUnlocks
    .filter(u => patternLevels[u.pattern] < u.threshold)
    .sort((a, b) => {
      // Sort by how close player is to threshold (closest first)
      const aProgress = patternLevels[a.pattern] / a.threshold
      const bProgress = patternLevels[b.pattern] / b.threshold
      return bProgress - aProgress
    })

  if (pendingUnlocks.length === 0) return null

  const next = pendingUnlocks[0]
  return {
    pattern: next.pattern,
    current: patternLevels[next.pattern],
    threshold: next.threshold,
    description: next.description
  }
}
