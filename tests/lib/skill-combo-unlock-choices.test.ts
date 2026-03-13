import { describe, expect, it } from 'vitest'

import type { DialogueGraph, DialogueNode } from '@/lib/dialogue-graph'
import { getSkillComboUnlockChoices } from '@/lib/skill-combo-unlock-choices'

function makeGraphWithNode(nodeId: string): DialogueGraph {
  const node: DialogueNode = {
    nodeId,
    speaker: 'Devon',
    content: [{ text: 'x', emotion: 'neutral', variation_id: 'base' }],
    choices: [],
  }

  return {
    version: 'test',
    startNodeId: nodeId,
    nodes: new Map([[nodeId, node]]),
    metadata: {
      title: 'test',
      author: 'test',
      createdAt: 0,
      lastModified: 0,
      totalNodes: 1,
      totalChoices: 0,
    },
  }
}

describe('skill-combo-unlock-choices', () => {
  it('generates a synthetic choice for unlocked combo dialogue nodes that exist in the graph', () => {
    const graph = makeGraphWithNode('devon_deep_insight')
    const skillLevels = {
      systemsThinking: 0.5, // 5/10
      emotionalIntelligence: 0.5, // 5/10
    }

    const choices = getSkillComboUnlockChoices(skillLevels, graph, [])
    expect(choices.some((c) => c.choice.choiceId === 'skill_combo_unlock_devon_deep_insight')).toBe(true)
  })

  it('skips unlock nodes that were already visited (conversation history)', () => {
    const graph = makeGraphWithNode('devon_deep_insight')
    const skillLevels = {
      systemsThinking: 0.5,
      emotionalIntelligence: 0.5,
    }

    const choices = getSkillComboUnlockChoices(skillLevels, graph, ['devon_deep_insight'])
    expect(choices.length).toBe(0)
  })
})
