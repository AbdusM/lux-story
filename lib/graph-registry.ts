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
import { devonDialogueGraph } from '@/content/devon-dialogue-graph'
import { jordanDialogueGraph } from '@/content/jordan-dialogue-graph'
import { marcusDialogueGraph } from '@/content/marcus-dialogue-graph'
import { tessDialogueGraph } from '@/content/tess-dialogue-graph'
import { yaquinDialogueGraph } from '@/content/yaquin-dialogue-graph'
import { yaquinRevisitGraph } from '@/content/yaquin-revisit-graph'
import { DialogueGraph } from './dialogue-graph'
import { GameState } from './character-state'

/**
 * All dialogue graphs in the system
 * Base graphs + revisit graphs + any special variants
 */
export const DIALOGUE_GRAPHS = {
  samuel: samuelDialogueGraph,
  maya: mayaDialogueGraph,
  maya_revisit: mayaRevisitGraph,
  devon: devonDialogueGraph,
  jordan: jordanDialogueGraph,
  marcus: marcusDialogueGraph,
  tess: tessDialogueGraph,
  yaquin: yaquinDialogueGraph,
  yaquin_revisit: yaquinRevisitGraph
  // Future expansion:
  // devon_revisit: devonRevisitGraph,
  // jordan_revisit: jordanRevisitGraph
} as const

/**
 * Character IDs that can be navigated to
 * Must match keys in GameState.characters Map
 */
export type CharacterId = 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin'

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

  // YAQUIN: Revisit logic (triggered by arc completion)
  if (characterId === 'yaquin' && gameState.globalFlags.has('yaquin_arc_complete')) {
    console.log('📖 Loading Yaquin revisit graph (arc completed)')
    return DIALOGUE_GRAPHS.yaquin_revisit
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
 * TRULY DYNAMIC: Automatically searches all characters by inspecting DIALOGUE_GRAPHS keys
 * When you add a new character graph, this function automatically includes it - ZERO code changes needed
 *
 * Searches both state-appropriate graphs (base or revisit) AND handles edge case where
 * revisit content links back to base nodes (e.g., "Remember when we first met?")
 *
 * @param nodeId - The dialogue node ID to search for
 * @param gameState - Current game state (determines which graphs to search)
 * @returns Character and graph containing the node, or null if not found
 */
export function findCharacterForNode(
  nodeId: string,
  gameState: GameState
): NodeSearchResult | null {
  // TRULY DYNAMIC: Derive character list from DIALOGUE_GRAPHS keys
  // Filter out revisit graphs (_revisit suffix) to get base character list
  const baseCharacterIds = Object.keys(DIALOGUE_GRAPHS).filter(
    key => !key.includes('_revisit')
  ) as CharacterId[]

  for (const charId of baseCharacterIds) {
    // Get the state-appropriate graph (base or revisit) for this character
    const graph = getGraphForCharacter(charId, gameState)

    // Defensive: Skip if graph is undefined
    if (!graph) continue

    // Check if node exists in state-appropriate graph
    if (graph.nodes.has(nodeId)) {
      return {
        characterId: charId,
        graph
      }
    }

    // EDGE CASE: If we're using a revisit graph, ALSO check base graph
    // Handles scenario where revisit content links back to base nodes
    // Example: Maya revisit says "Remember when we first talked about Pepper?"
    // That node might be in maya_dialogue_graph, not maya_revisit_graph
    const revisitGraphKey = `${charId}_revisit` as keyof typeof DIALOGUE_GRAPHS
    const revisitGraph = DIALOGUE_GRAPHS[revisitGraphKey]
    const baseGraph = DIALOGUE_GRAPHS[charId]

    // If current graph is the revisit variant, check if node exists in base
    if (graph === revisitGraph && baseGraph && baseGraph.nodes.has(nodeId)) {
      return {
        characterId: charId,
        graph: baseGraph
      }
    }

    // ADDITIONAL FIX: If we're looking for a revisit node but the current graph is base,
    // also check the revisit graph directly
    if (nodeId.includes('_revisit_') && revisitGraph && revisitGraph.nodes.has(nodeId)) {
      return {
        characterId: charId,
        graph: revisitGraph
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