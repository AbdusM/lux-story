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
import { kaiDialogueGraph } from '@/content/kai-dialogue-graph'
import { alexDialogueGraph } from '@/content/alex-dialogue-graph'
import { rohanDialogueGraph } from '@/content/rohan-dialogue-graph'
import { silasDialogueGraph } from '@/content/silas-dialogue-graph'
import { elenaDialogueGraph } from '@/content/elena-dialogue-graph'
import { graceDialogueGraph } from '@/content/grace-dialogue-graph'
import { devonRevisitGraph } from '@/content/devon-revisit-graph'
import { graceRevisitGraph } from '@/content/grace-revisit-graph'
import { ashaDialogueGraph } from '@/content/asha-dialogue-graph'
import { liraDialogueGraph } from '@/content/lira-dialogue-graph'
import { zaraDialogueGraph } from '@/content/zara-dialogue-graph'
import { quinnDialogueGraph } from '@/content/quinn-dialogue-graph'
import { danteDialogueGraph } from '@/content/dante-dialogue-graph'
import { nadiaDialogueGraph } from '@/content/nadia-dialogue-graph'
import { isaiahDialogueGraph } from '@/content/isaiah-dialogue-graph'
import { stationEntryGraph } from '@/content/station-entry-graph'
import { grandHallGraph } from '@/content/grand-hall-graph'
import { marketGraph } from '@/content/market-graph'
import { deepStationGraph } from '@/content/deep-station-graph'
import { alexJordanIntersectionGraph } from '@/content/intersection-alex-jordan'
import { mayaDevonIntersectionGraph } from '@/content/intersection-maya-devon'
import { tessRohanIntersectionGraph } from '@/content/intersection-tess-rohan'
import { DialogueGraph } from './dialogue-graph'
import { GameState } from './character-state'
import { logger } from './logger'

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
  yaquin_revisit: yaquinRevisitGraph,
  kai: kaiDialogueGraph,
  alex: alexDialogueGraph,
  rohan: rohanDialogueGraph,
  silas: silasDialogueGraph,
  elena: elenaDialogueGraph,
  grace: graceDialogueGraph,
  devon_revisit: devonRevisitGraph,
  grace_revisit: graceRevisitGraph,
  asha: ashaDialogueGraph,
  lira: liraDialogueGraph,
  zara: zaraDialogueGraph,
  quinn: quinnDialogueGraph,
  dante: danteDialogueGraph,
  nadia: nadiaDialogueGraph,
  isaiah: isaiahDialogueGraph,
  station_entry: stationEntryGraph,
  grand_hall: grandHallGraph,
  market: marketGraph,
  deep_station: deepStationGraph,
} as const

// Non-character graphs that still need routing (intersections, one-off scenes, etc.).
// These are indexed for `findCharacterForNode` but are not selectable "characters".
const SPECIAL_GRAPHS: Array<{ graph: DialogueGraph; characterId: CharacterId }> = [
  { graph: alexJordanIntersectionGraph, characterId: 'grand_hall' },
  { graph: mayaDevonIntersectionGraph, characterId: 'grand_hall' },
  { graph: tessRohanIntersectionGraph, characterId: 'grand_hall' },
]

/**
 * Character IDs that can be navigated to
 */
export type CharacterId = 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'alex' | 'rohan' | 'silas' | 'elena' | 'grace' | 'asha' | 'lira' | 'zara' | 'quinn' | 'dante' | 'nadia' | 'isaiah' | 'station_entry' | 'grand_hall' | 'market' | 'deep_station'

export const CHARACTER_IDS: CharacterId[] = ['samuel', 'maya', 'devon', 'jordan', 'marcus', 'tess', 'yaquin', 'kai', 'alex', 'rohan', 'silas', 'elena', 'grace', 'asha', 'lira', 'zara', 'quinn', 'dante', 'nadia', 'isaiah', 'station_entry', 'grand_hall', 'market', 'deep_station']

export function isValidCharacterId(id: string): id is CharacterId {
  return CHARACTER_IDS.includes(id as CharacterId)
}

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
    logger.debug('Loading Maya revisit graph (arc completed)', { operation: 'graph-registry.maya-revisit' })
    return DIALOGUE_GRAPHS.maya_revisit
  }

  // YAQUIN: Revisit logic (triggered by arc completion)
  if (characterId === 'yaquin' && gameState.globalFlags.has('yaquin_arc_complete')) {
    logger.debug('Loading Yaquin revisit graph (arc completed)', { operation: 'graph-registry.yaquin-revisit' })
    return DIALOGUE_GRAPHS.yaquin_revisit
  }

  // DEVON: Revisit logic
  if (characterId === 'devon' && gameState.globalFlags.has('devon_arc_complete')) {
    logger.debug('Loading Devon revisit graph (arc completed)', { operation: 'graph-registry.devon-revisit' })
    return DIALOGUE_GRAPHS.devon_revisit
  }

  // GRACE: Revisit logic
  if (characterId === 'grace' && gameState.globalFlags.has('grace_arc_complete')) {
    logger.debug('Loading Grace revisit graph (arc completed)', { operation: 'graph-registry.grace-revisit' })
    return DIALOGUE_GRAPHS.grace_revisit
  }

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
 * Lazy-initialized index: nodeId → characterId
 * Built once on first lookup, then O(1) for all subsequent lookups
 * Reduces findCharacterForNode from O(n*m) to O(1) where n=graphs, m=nodes
 */
let nodeToCharacterIndex: Map<string, CharacterId> | null = null

function getNodeIndex(): Map<string, CharacterId> {
  if (nodeToCharacterIndex) return nodeToCharacterIndex

  nodeToCharacterIndex = new Map()
  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    // Get base character ID (strip _revisit suffix)
    const baseCharId = graphKey.replace('_revisit', '') as CharacterId
    if (!isValidCharacterId(baseCharId)) continue

    for (const nodeId of graph.nodes.keys()) {
      // First graph to claim a node wins (base before revisit due to object order)
      if (!nodeToCharacterIndex.has(nodeId)) {
        nodeToCharacterIndex.set(nodeId, baseCharId)
      }
    }
  }

  for (const { graph, characterId } of SPECIAL_GRAPHS) {
    for (const nodeId of graph.nodes.keys()) {
      if (!nodeToCharacterIndex.has(nodeId)) {
        nodeToCharacterIndex.set(nodeId, characterId)
      }
    }
  }
  return nodeToCharacterIndex
}

/**
 * Find which character owns a given node ID
 *
 * OPTIMIZED: Uses lazy-initialized index for O(1) lookups instead of scanning all graphs
 * Still handles revisit graph edge cases for cross-graph node references
 *
 * @param nodeId - The dialogue node ID to search for
 * @param gameState - Current game state (determines which graph variant to return)
 * @returns Character and graph containing the node, or null if not found
 */
export function findCharacterForNode(
  nodeId: string,
  gameState: GameState
): NodeSearchResult | null {
  // O(1) lookup via index
  const index = getNodeIndex()
  const charId = index.get(nodeId)

  if (!charId) return null

  // Get state-appropriate graph (may be base or revisit variant)
  const graph = getGraphForCharacter(charId, gameState)

  // Fast path: node exists in state-appropriate graph
  if (graph.nodes.has(nodeId)) {
    return { characterId: charId, graph }
  }

  // Edge case: node in base graph but state returned revisit graph
  const baseGraph = DIALOGUE_GRAPHS[charId]
  if (baseGraph && baseGraph.nodes.has(nodeId)) {
    return { characterId: charId, graph: baseGraph }
  }

  // Edge case: node in revisit graph
  const revisitKey = `${charId}_revisit` as keyof typeof DIALOGUE_GRAPHS
  const revisitGraph = DIALOGUE_GRAPHS[revisitKey]
  if (revisitGraph && revisitGraph.nodes.has(nodeId)) {
    return { characterId: charId, graph: revisitGraph }
  }

  // Special-case graphs (intersections, etc.) that are not part of the base character map.
  for (const { graph, characterId } of SPECIAL_GRAPHS) {
    if (graph.nodes.has(nodeId)) {
      return { characterId, graph }
    }
  }

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
    characterId: 'station_entry',
    graph: stationEntryGraph
  }
}
