/**
 * Skill Combo Unlock Choices
 *
 * Generates special synthetic choices for skill-combo-unlocked dialogue nodes.
 * This is the skill-combo parallel of `lib/pattern-unlock-choices.ts`.
 */

import type { ConditionalChoice, DialogueGraph, EvaluatedChoice } from '@/lib/dialogue-graph'
import { detectUnlockedCombos } from '@/lib/skill-combo-detector'

interface SkillComboUnlockChoice extends EvaluatedChoice {
  isSkillComboUnlock: true
  unlockDescription: string
  comboId: string
}

function seenFlagFor(nodeId: string): string {
  return `skill_combo_unlock_seen_${nodeId}`
}

/**
 * Get skill-combo-unlocked choices for the current character.
 *
 * Contract:
 * - Only returns dialogue unlocks whose nodeId exists in the provided `graph`.
 * - Uses `knowledgeFlags` to avoid re-showing unlocks that the player has already visited.
 */
export function getSkillComboUnlockChoices(
  skillLevels: Record<string, number>,
  graph: DialogueGraph,
  knowledgeFlags?: Set<string>
): SkillComboUnlockChoice[] {
  const unlockedCombos = detectUnlockedCombos(skillLevels)
  if (unlockedCombos.length === 0) return []

  const out: SkillComboUnlockChoice[] = []

  for (const combo of unlockedCombos) {
    for (const unlock of combo.unlocks) {
      if (unlock.type !== 'dialogue') continue

      const nodeId = unlock.id
      if (!graph.nodes.has(nodeId)) continue

      if (knowledgeFlags?.has(seenFlagFor(nodeId))) continue

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

