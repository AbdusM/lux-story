import { describe, it, expect } from 'vitest'

import { GameStateUtils } from '@/lib/character-state'
import { getSkillComboUnlockChoices } from '@/lib/skill-combo-unlock-choices'
import { devonDialogueGraph } from '@/content/devon-dialogue-graph'

describe('getSkillComboUnlockChoices', () => {
  it('returns combo unlock choices when the combo is unlocked and the node exists', () => {
    const state = GameStateUtils.createNewGameState('player123')
    state.skillLevels.systemsThinking = 0.6
    state.skillLevels.emotionalIntelligence = 0.6

    const dev = GameStateUtils.createCharacterState('devon')
    state.characters.set('devon', dev)

    const choices = getSkillComboUnlockChoices(state.skillLevels, devonDialogueGraph, dev.knowledgeFlags)
    const ids = choices.map(c => c.choice.nextNodeId)

    expect(ids).toContain('devon_deep_insight')
  })

  it('skips unlocks that have already been marked as seen', () => {
    const state = GameStateUtils.createNewGameState('player123')
    state.skillLevels.systemsThinking = 0.6
    state.skillLevels.emotionalIntelligence = 0.6

    const dev = GameStateUtils.createCharacterState('devon')
    state.characters.set('devon', dev)
    dev.knowledgeFlags.add('skill_combo_unlock_seen_devon_deep_insight')

    const choices = getSkillComboUnlockChoices(state.skillLevels, devonDialogueGraph, dev.knowledgeFlags)
    const ids = choices.map(c => c.choice.nextNodeId)
    expect(ids).not.toContain('devon_deep_insight')
  })
})
