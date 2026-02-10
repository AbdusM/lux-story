import { describe, expect, it } from 'vitest'
import { StateConditionEvaluator, type DialogueNode } from '@/lib/dialogue-graph'
import { GameStateUtils } from '@/lib/character-state'

describe('Hub Return Injection', () => {
  it('injects a return choice for *_hub_return nodes with no choices', () => {
    const s = GameStateUtils.createNewGameState('t')
    const node: DialogueNode = {
      nodeId: 'maya_hub_return',
      speaker: 'Maya',
      content: [{ text: '...', variation_id: 'v1' }],
      choices: [],
    }

    const choices = StateConditionEvaluator.evaluateChoices(node, s, 'maya', s.skillLevels)
    expect(choices.length).toBe(1)
    expect(choices[0].choice.choiceId).toBe('return_to_samuel_hub')
    expect(choices[0].choice.nextNodeId).toBe('samuel_comprehensive_hub')
    expect(choices[0].enabled).toBe(true)
  })
})

