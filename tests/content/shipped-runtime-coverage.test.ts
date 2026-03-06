import { describe, expect, it } from 'vitest'
import { QUARANTINED_NODE_IDS_BY_GRAPH } from '@/content/drafts/quarantined-node-ids'
import { VULNERABILITY_TRUST_THRESHOLD } from '@/lib/constants'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { getRuntimeRoutedSimulationSetupNodeIds } from '@/lib/simulation-runtime-routes'

describe('Shipped Runtime Coverage', () => {
  it('excludes all quarantined draft nodes from shipped graphs', () => {
    const leakedNodes: string[] = []

    for (const [graphKey, nodeIds] of Object.entries(QUARANTINED_NODE_IDS_BY_GRAPH)) {
      if (!(graphKey in DIALOGUE_GRAPHS)) continue

      const graph = DIALOGUE_GRAPHS[graphKey as keyof typeof DIALOGUE_GRAPHS]
      for (const nodeId of nodeIds) {
        if (graph.nodes.has(nodeId)) {
          leakedNodes.push(`${graphKey}/${nodeId}`)
        }
      }
    }

    expect(leakedNodes).toEqual([])
  })

  it('keeps runtime-routed simulation setup nodes in shipped graphs', () => {
    const missingRuntimeNodes = [...getRuntimeRoutedSimulationSetupNodeIds()].filter((entry) => {
      const [graphKey, nodeId] = entry.split('/')
      return !DIALOGUE_GRAPHS[graphKey as keyof typeof DIALOGUE_GRAPHS].nodes.has(nodeId)
    })

    expect(missingRuntimeNodes).toEqual([])
  })

  it('retains late-game trust gates on key shipped character graphs', () => {
    const keyCharacters = [
      'samuel',
      'marcus',
      'kai',
      'rohan',
      'maya',
      'devon',
      'jordan',
      'tess',
      'grace',
      'alex',
    ] as const

    for (const characterId of keyCharacters) {
      const shippedNodes = [...DIALOGUE_GRAPHS[characterId].nodes.values()]
      expect(
        shippedNodes.some((node) => (node.requiredState?.trust?.min ?? 0) >= VULNERABILITY_TRUST_THRESHOLD)
      ).toBe(true)
    }
  })
})
