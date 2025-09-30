/**
 * State-Aware Graph Registry
 * The single source of truth for all dialogue graph routing logic
 *
 * ARCHITECTURE PRINCIPLE:
 * The router shouldn't know the rules. The registry should know the rules.
 *
 * All special-case routing logic (revisit graphs, arc-specific content, etc.)
 * lives here, not scattered throughout component code.
 */

import { mayaDialogueGraph } from '@/content/maya-dialogue-graph'
import { mayaRevisitGraph } from '@/content/maya-revisit-graph'
import { samuelDialogueGraph } from '@/content/samuel-dialogue-graph'
import { DialogueGraph } from './dialogue-graph'
import { GameState } from './character-state'

/**
 * All dialogue graphs in the system
 * Base graphs + revisit graphs + any special variants
 */
export const DIALOGUE_GRAPHS = {
  samuel: samuelDialogueGraph,
  maya: mayaDialogueGraph,
  maya_revisit: mayaRevisitGraph
  // Future expansion:
  // devon: devonDialogueGraph,
  // devon_revisit: devonRevisitGraph,
  // jordan: jordanDialogueGraph,
  // jordan_revisit: jordanRevisitGraph
} as const

/**
 * Character IDs that can be navigated to
 * Must match keys in GameState.characters Map
 */
export type CharacterId = 'samuel' | 'maya' | 'devon' | 'jordan'

/**
 * Get the correct dialogue graph for a character based on current game state
 *
 * CRITICAL: This is the ONLY place where routing rules should be defined
 * When you add a new character or revisit arc, add the logic here, not in components
 *
 * @param characterId - The character to get a graph for
 * @param gameState - Current game state (used to determine which variant to load)
 * @returns The appropriate DialogueGraph for this character in this state
 */
export function getGraphForCharacter(
  characterId: CharacterId,
  gameState: GameState
): DialogueGraph {
  // MAYA: Use revisit graph if arc is complete
  if (characterId === 'maya' && gameState.globalFlags.has('maya_arc_complete')) {
    console.log('📖 Loading Maya revisit graph (arc completed)')
    return DIALOGUE_GRAPHS.maya_revisit
  }

  // DEVON: Future revisit logic
  // if (characterId === 'devon' && gameState.globalFlags.has('devon_arc_complete')) {
  //   console.log('📖 Loading Devon revisit graph (arc completed)')
  //   return DIALOGUE_GRAPHS.devon_revisit
  // }

  // JORDAN: Future revisit logic
  // if (characterId === 'jordan' && gameState.globalFlags.has('jordan_arc_complete')) {
  //   console.log('📖 Loading Jordan revisit graph (arc completed)')
  //   return DIALOGUE_GRAPHS.jordan_revisit
  // }

  // DEFAULT: Use base graph for this character
  return DIALOGUE_GRAPHS[characterId]
}

/**
 * Search Result from findCharacterForNode
 */
export interface NodeSearchResult {
  characterId: CharacterId
  graph: DialogueGraph
}

/**
 * Find which character owns a given node ID
 *
 * Searches all graphs (base + revisit variants) based on current game state
 * This enables type-safe cross-graph navigation without hardcoding search logic
 *
 * @param nodeId - The dialogue node ID to search for
 * @param gameState - Current game state (determines which graphs to search)
 * @returns Character and graph containing the node, or null if not found
 */
export function findCharacterForNode(
  nodeId: string,
  gameState: GameState
): NodeSearchResult | null {
  // Search all character IDs
  const allCharacterIds: CharacterId[] = ['samuel', 'maya', 'devon', 'jordan']

  for (const charId of allCharacterIds) {
    // Get the state-appropriate graph for this character
    const graph = getGraphForCharacter(charId, gameState)

    // Check if this graph contains the node
    if (graph.nodes.has(nodeId)) {
      return {
        characterId: charId,
        graph
      }
    }
  }

  // Node not found in any graph
  return null
}

/**
 * Get a safe fallback starting point if navigation fails
 * Always returns Samuel's introduction (the station entrance)
 *
 * @returns Safe starting character ID and graph
 */
export function getSafeStart(): NodeSearchResult {
  return {
    characterId: 'samuel',
    graph: samuelDialogueGraph
  }
}