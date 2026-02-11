/**
 * Skill Combo Unlock Choices
 *
 * Generates synthetic choices for skill-combo dialogue unlock nodes.
 * This is the skill-combo parallel of `lib/pattern-unlock-choices.ts`.
 */

import type { ConditionalChoice, DialogueGraph, EvaluatedChoice } from '@/lib/dialogue-graph'
import { detectUnlockedCombos } from '@/lib/skill-combo-detector'

interface SkillComboUnlockChoice extends EvaluatedChoice {
  isSkillComboUnlock: true
  unlockDescription: string
  comboId: string
}

/**
 * Contract:
 * - Only returns dialogue unlocks whose nodeId exists in the provided `graph`.
 * - Skips unlocks that have already been visited (via conversation history).
 */
export function getSkillComboUnlockChoices(
  skillLevels: Record<string, number>,
  graph: DialogueGraph,
  visitedNodeIds?: string[]
): SkillComboUnlockChoice[] {
  const unlockedCombos = detectUnlockedCombos(skillLevels)
  if (unlockedCombos.length === 0) return []

  const visited = new Set(visitedNodeIds || [])
  const out: SkillComboUnlockChoice[] = []

  for (const combo of unlockedCombos) {
    for (const unlock of combo.unlocks) {
      if (unlock.type !== 'dialogue') continue

      const nodeId = unlock.id
      if (!graph.nodes.has(nodeId)) continue
      if (visited.has(nodeId)) continue

      const syntheticChoice: ConditionalChoice = {
        choiceId: `skill_combo_unlock_${nodeId}`,
        text: `✨ ${unlock.description}`,
        nextNodeId: nodeId,
      }

      out.push({
        choice: syntheticChoice,
        visible: true,
        enabled: true,
        isSkillComboUnlock: true,
        unlockDescription: unlock.description,
        comboId: combo.id,
      })
    }
  }

  return out
}

