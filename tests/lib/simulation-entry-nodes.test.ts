/**
 * Simulation Entry Node Validation (Real Graphs)
 * Ensures each simulation entryNodeId exists in its character's dialogue graph.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { validateEntryNodes } from '@/lib/validators/simulation-validators'
import { getCharactersWithSimulations } from '@/lib/simulation-id-map'
import { DialogueGraph } from '@/lib/dialogue-graph'

// Build a graph map using base character graphs (no revisit variants)
function buildGraphMap(): Map<string, DialogueGraph> {
  const graphs = new Map<string, DialogueGraph>()
  const characterIds = getCharactersWithSimulations()

  for (const characterId of characterIds) {
    const graph = DIALOGUE_GRAPHS[characterId as keyof typeof DIALOGUE_GRAPHS]
    if (graph) {
      graphs.set(characterId, graph)
    }
  }

  return graphs
}

describe('Simulation entry nodes exist in dialogue graphs', () => {
  it('validates entryNodeId for each simulation', () => {
    const graphs = buildGraphMap()
    const issues = validateEntryNodes(graphs)

    if (issues.length > 0) {
      const details = issues.map(issue => (
        `${issue.characterId}: missing ${issue.entryNodeId} (sim ${issue.simulationId})`
      )).join('\n')
      throw new Error(`Simulation entry node validation failed:\n${details}`)
    }

    expect(issues).toHaveLength(0)
  })
})
