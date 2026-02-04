/**
 * Simulation Completeness Validator
 *
 * P0 SHIPPING BLOCKER: Prevents partial simulation implementations from shipping undetected.
 *
 * This test documents the current state of 3-phase simulations:
 * - Characters with complete simulations (Phase 1, 2, 3)
 * - Characters with Phase 1 only (documented as incomplete)
 *
 * When a character's simulation is completed, move them from
 * PHASE_1_ONLY_CHARACTERS to COMPLETE_SIMULATION_CHARACTERS.
 * The test will fail if the lists don't match reality.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import type { DialogueGraph } from '@/lib/dialogue-graph'

// Characters with complete 3-phase simulations
const COMPLETE_SIMULATION_CHARACTERS = [
  'devon',
  'jordan',
  'dante',
  'nadia',
  'isaiah',
  'maya',
  'marcus',
  'kai',
  'rohan',
  'tess',
  'elena',
  'grace',
  'alex',
  'quinn',
  'yaquin',
  'silas',
  'asha',
  'lira',
  'zara'
] as const

// Characters with Phase 1 only (explicit incomplete status)
const PHASE_1_ONLY_CHARACTERS = [
  'samuel'
] as const

// Non-character graphs (locations) - excluded from simulation checks
const LOCATION_GRAPHS = [
  'station_entry',
  'grand_hall',
  'market',
  'deep_station'
] as const

// Revisit graphs - excluded from simulation checks
const REVISIT_GRAPHS = [
  'maya_revisit',
  'yaquin_revisit',
  'devon_revisit',
  'grace_revisit'
] as const

type CharacterWithSimulation = typeof COMPLETE_SIMULATION_CHARACTERS[number] | typeof PHASE_1_ONLY_CHARACTERS[number]

/**
 * Helper to get all nodes from a graph (handles Map structure)
 */
function getNodes(graph: DialogueGraph): import('@/lib/dialogue-graph').DialogueNode[] {
  // DialogueGraph.nodes is a Map<string, DialogueNode>
  return Array.from(graph.nodes.values())
}

/**
 * Helper to check if a graph has a simulation node for a specific phase
 */
function hasSimulationPhase(graph: DialogueGraph, phase: 1 | 2 | 3): boolean {
  const nodes = getNodes(graph)
  return nodes.some(node => {
    // Check explicit phase field
    if (node.simulation?.phase === phase) return true

    // Phase 1 nodes might not have explicit phase (backwards compat)
    if (phase === 1) {
      return node.simulation !== undefined && !node.simulation.phase
    }

    return false
  })
}

/**
 * Helper to get simulation node IDs for debugging
 */
function getSimulationNodeIds(graph: DialogueGraph): string[] {
  const nodes = getNodes(graph)
  return nodes
    .filter(node => node.simulation !== undefined)
    .map(node => `${node.nodeId} (phase: ${node.simulation?.phase ?? 1})`)
}

describe('Simulation Completeness Validator', () => {
  describe('Complete Simulation Characters', () => {
    for (const charId of COMPLETE_SIMULATION_CHARACTERS) {
      describe(charId, () => {
        const graph = DIALOGUE_GRAPHS[charId]

        it('has Phase 1 simulation', () => {
          const hasPhase1 = hasSimulationPhase(graph, 1)
          if (!hasPhase1) {
            const simNodes = getSimulationNodeIds(graph)
            console.log(`${charId} simulation nodes:`, simNodes)
          }
          expect(hasPhase1, `${charId} should have Phase 1 simulation`).toBe(true)
        })

        it('has Phase 2 simulation (trust 5+)', () => {
          const hasPhase2 = hasSimulationPhase(graph, 2)
          if (!hasPhase2) {
            const simNodes = getSimulationNodeIds(graph)
            console.log(`${charId} simulation nodes:`, simNodes)
          }
          expect(hasPhase2, `${charId} should have Phase 2 simulation`).toBe(true)
        })

        it('has Phase 3 simulation (trust 8+)', () => {
          const hasPhase3 = hasSimulationPhase(graph, 3)
          if (!hasPhase3) {
            const simNodes = getSimulationNodeIds(graph)
            console.log(`${charId} simulation nodes:`, simNodes)
          }
          expect(hasPhase3, `${charId} should have Phase 3 simulation`).toBe(true)
        })
      })
    }
  })

  describe('Phase 1 Only Characters (Documented Incomplete)', () => {
    for (const charId of PHASE_1_ONLY_CHARACTERS) {
      it(`${charId} is correctly documented as Phase 1 only`, () => {
        const graph = DIALOGUE_GRAPHS[charId]

        const hasPhase2 = hasSimulationPhase(graph, 2)
        const hasPhase3 = hasSimulationPhase(graph, 3)

        if (hasPhase2 || hasPhase3) {
          const simNodes = getSimulationNodeIds(graph)
          throw new Error(
            `${charId} has Phase 2/3 simulations but is listed in PHASE_1_ONLY_CHARACTERS. ` +
            `Move to COMPLETE_SIMULATION_CHARACTERS.\n` +
            `Simulation nodes found: ${simNodes.join(', ')}`
          )
        }

        // This documents the current state - character has Phase 1 only
        expect(hasPhase2).toBe(false)
        expect(hasPhase3).toBe(false)
      })
    }
  })

  describe('Character Accounting', () => {
    it('all playable characters are accounted for', () => {
      const allCharacters = [
        ...COMPLETE_SIMULATION_CHARACTERS,
        ...PHASE_1_ONLY_CHARACTERS
      ]

      // Should have exactly 20 playable characters
      expect(allCharacters.length).toBe(20)
    })

    it('no character appears in both lists', () => {
      const complete = new Set(COMPLETE_SIMULATION_CHARACTERS)
      const phase1Only = new Set(PHASE_1_ONLY_CHARACTERS)

      for (const char of COMPLETE_SIMULATION_CHARACTERS) {
        expect(phase1Only.has(char as never)).toBe(false)
      }

      for (const char of PHASE_1_ONLY_CHARACTERS) {
        expect(complete.has(char as never)).toBe(false)
      }
    })

    it('all registered character graphs are accounted for', () => {
      const allAccounted = new Set<string>([
        ...COMPLETE_SIMULATION_CHARACTERS,
        ...PHASE_1_ONLY_CHARACTERS,
        ...LOCATION_GRAPHS,
        ...REVISIT_GRAPHS
      ])

      const registeredGraphs = Object.keys(DIALOGUE_GRAPHS)

      for (const graphKey of registeredGraphs) {
        expect(
          allAccounted.has(graphKey),
          `Graph "${graphKey}" is not accounted for in any list`
        ).toBe(true)
      }
    })
  })

  describe('Simulation Coverage Summary', () => {
    it('reports current completion status', () => {
      const total = COMPLETE_SIMULATION_CHARACTERS.length + PHASE_1_ONLY_CHARACTERS.length
      const complete = COMPLETE_SIMULATION_CHARACTERS.length
      const incomplete = PHASE_1_ONLY_CHARACTERS.length
      const percentage = Math.round((complete / total) * 100)

      console.log('\n=== Simulation Completion Status ===')
      console.log(`Complete (3-phase): ${complete}/${total} (${percentage}%)`)
      console.log(`  - ${COMPLETE_SIMULATION_CHARACTERS.join(', ')}`)
      console.log(`Incomplete (Phase 1 only): ${incomplete}/${total}`)
      console.log(`  - ${PHASE_1_ONLY_CHARACTERS.join(', ')}`)
      console.log('=====================================\n')

      // This test always passes - it's just for reporting
      expect(true).toBe(true)
    })
  })
})
