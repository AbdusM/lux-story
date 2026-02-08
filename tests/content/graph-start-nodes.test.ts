/**
 * Graph Start Node Smoke Tests
 *
 * Goal: catch "menus work / content works" regressions without Playwright by ensuring
 * every graph's declared start node exists and can present at least one choice under
 * a minimal plausible game state.
 *
 * We intentionally keep this lightweight and deterministic.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { GameStateUtils } from '@/lib/character-state'
import { StateConditionEvaluator } from '@/lib/dialogue-graph'

function baseCharacterIdForGraphKey(graphKey: string): string {
  return graphKey.replace(/_revisit$/, '')
}

describe('Graph Start Nodes', () => {
  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    it(`${graphKey}: startNodeId exists`, () => {
      const startNode = graph.nodes.get(graph.startNodeId)
      expect(startNode, `Missing start node "${graph.startNodeId}" in graph "${graphKey}"`).toBeDefined()
      expect(startNode?.content?.length).toBeGreaterThan(0)
    })

    it(`${graphKey}: start node has a visible choice (or is an allowed boundary)`, () => {
      const startNode = graph.nodes.get(graph.startNodeId)!

      const baseCharId = baseCharacterIdForGraphKey(graphKey)

      // Revisit graphs are only routed after arc completion and often depend on
      // knowledge flags from the first arc, so we don't enforce choice visibility
      // under a minimal state. Instead, enforce the explicit arc-complete gate.
      if (graphKey.endsWith('_revisit')) {
        const flags = startNode.requiredState?.hasGlobalFlags ?? []
        expect(
          flags,
          `Revisit start node "${graph.startNodeId}" for "${graphKey}" should be gated by "${baseCharId}_arc_complete".`
        ).toContain(`${baseCharId}_arc_complete`)
        expect(startNode.choices.length).toBeGreaterThan(0)
        return
      }

      const allowNoChoices = Boolean(
        startNode.simulation ||
        startNode.metadata?.sessionBoundary ||
        startNode.metadata?.experienceId ||
        startNode.tags?.includes('terminal') ||
        startNode.tags?.includes('ending') ||
        startNode.tags?.includes('arc_complete')
      )

      if (allowNoChoices) {
        // Still require that the node is well-formed (content is checked above).
        expect(true).toBe(true)
        return
      }

      const state = GameStateUtils.createNewGameState('graph-start-smoke')

      // Ensure the character exists in the Map for condition evaluation where needed.
      try {
        if (!state.characters.get(baseCharId)) {
          state.characters.set(baseCharId, GameStateUtils.createCharacterState(baseCharId))
        }
      } catch {
        // Some graphs (e.g., location graphs) may not correspond to a CharacterState factory id.
      }

      // IMPORTANT: avoid auto-fallback in evaluateChoices; we want to know if the node is
      // actually presenting at least one choice under the minimal state.
      const visibleCount = startNode.choices.filter(choice =>
        StateConditionEvaluator.evaluate(choice.visibleCondition, state, baseCharId)
      ).length

      expect(
        visibleCount,
        `All start-node choices are gated for "${graphKey}" (${graph.startNodeId}). If this is intentional, add an always-visible choice or tag the node as a boundary.`
      ).toBeGreaterThan(0)
    })
  }
})
