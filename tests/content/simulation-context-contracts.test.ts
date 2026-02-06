/**
 * Simulation Context Contract Tests
 *
 * Focus: prevent "fake" UI data by ensuring required simulation context is authored in content.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'

describe('Simulation Context Contracts', () => {
  it('data_ticker simulations provide initialContext.items (no synthetic UI feed)', () => {
    const offenders: string[] = []

    for (const [graphName, graph] of Object.entries(DIALOGUE_GRAPHS)) {
      for (const [nodeId, node] of graph.nodes.entries()) {
        if (node.simulation?.type !== 'data_ticker') continue

        const items = (node.simulation.initialContext as unknown as { items?: unknown }).items
        if (!Array.isArray(items) || items.length < 3) {
          offenders.push(`${graphName}/${nodeId}`)
          continue
        }

        for (const raw of items) {
          if (!raw || typeof raw !== 'object') {
            offenders.push(`${graphName}/${nodeId}`)
            break
          }
          const it = raw as Record<string, unknown>
          if (
            typeof it.id !== 'string' ||
            typeof it.label !== 'string' ||
            typeof it.value !== 'number'
          ) {
            offenders.push(`${graphName}/${nodeId}`)
            break
          }
        }
      }
    }

    expect(offenders).toEqual([])
  })
})

