import { describe, expect, it } from 'vitest'
import { GameStateUtils } from '@/lib/character-state'
import { StateConditionEvaluator } from '@/lib/dialogue-graph'
import type { DialogueNode } from '@/lib/dialogue-graph'

describe('Choice Reason Details Contract (AAA)', () => {
  it('provides structured why/how details for visible disabled choices', () => {
    const s = GameStateUtils.createNewGameState('t')
    const node: DialogueNode = {
      nodeId: 't_node',
      speaker: 'Samuel Washington',
      content: [{ text: 'Test', emotion: 'neutral', variation_id: 'v1' }],
      choices: [
        {
          choiceId: 't_choice',
          text: 'Ask for a favor.',
          nextNodeId: 't_next',
          enabledCondition: { trust: { min: 9 } },
        },
      ],
    }

    const evaluated = StateConditionEvaluator.evaluateChoices(node, s, 'samuel', s.skillLevels)
    expect(evaluated).toHaveLength(1)
    expect(evaluated[0]!.visible).toBe(true)
    expect(evaluated[0]!.enabled).toBe(false)
    expect(evaluated[0]!.reason_code).toBeTruthy()
    expect(evaluated[0]!.reason_details?.code).toBe(evaluated[0]!.reason_code)
    expect(evaluated[0]!.reason_details?.why).toBeTruthy()
    expect(evaluated[0]!.reason_details?.how).toMatch(/To unlock:/i)
  })
})
