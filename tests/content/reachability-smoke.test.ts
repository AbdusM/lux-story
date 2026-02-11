import { describe, it, expect } from 'vitest'

import { GameStateUtils } from '@/lib/character-state'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { simulateReachability } from '@/lib/validators/reachability-sim'

function inboundCountsForGraph(graph: { nodes: Map<string, any> }): Map<string, number> {
  const inb = new Map<string, number>()
  for (const node of graph.nodes.values()) {
    for (const c of node.choices || []) {
      const next = c.nextNodeId
      if (typeof next === 'string') inb.set(next, (inb.get(next) ?? 0) + 1)
    }
    for (const content of node.content || []) {
      const next = content?.interrupt?.targetNodeId
      if (typeof next === 'string') inb.set(next, (inb.get(next) ?? 0) + 1)
    }
  }
  return inb
}

describe('Reachability smoke (AAA)', () => {
  it('prints behavioral reachability for top graphs (warn-only)', () => {
    const graphs = ['samuel', 'devon', 'maya'] as const
    const fixtures = ['baseline_early_game_v1', 'baseline_midgame_v1'] as const

    for (const graphKey of graphs) {
      const graph = DIALOGUE_GRAPHS[graphKey]
      const inbound = inboundCountsForGraph(graph)

      for (const fixture of fixtures) {
        const s = GameStateUtils.createNewGameState(fixture)
        const result = simulateReachability(s, {
          start_node_id: graph.startNodeId,
          max_steps: 30,
          max_states: 3000,
          max_unique_states_per_node: 25,
        })

        const reachable = new Set(result.visited_node_ids.filter((id) => graph.nodes.has(id)))
        const unreachableWithInbound = Array.from(graph.nodes.keys())
          .filter((id) => !reachable.has(id))
          .filter((id) => (inbound.get(id) ?? 0) > 0)
          .sort()

        // Warn-only: the output is used as a paydown scoreboard in PR review.
        // Assertions are minimal to avoid turning this into a flaky gate.
        // eslint-disable-next-line no-console
        console.warn(`[reachability-smoke] graph=${graphKey} fixture=${fixture} reachable=${reachable.size}/${graph.nodes.size} behavioral_unreachable_with_inbound=${unreachableWithInbound.length} expanded_states=${result.expanded_states}`)
        // eslint-disable-next-line no-console
        console.warn(`[reachability-smoke] graph=${graphKey} fixture=${fixture} sample=${unreachableWithInbound.slice(0, 12).join(',')}`)

        expect(reachable.size).toBeGreaterThan(0)
      }
    }
  })
})

