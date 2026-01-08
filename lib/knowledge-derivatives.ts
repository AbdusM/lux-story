/**
 * Knowledge System Derivatives
 * Feature IDs: D-006, D-019, D-056, D-083
 *
 * This module extends the core knowledge flag system with advanced mechanics:
 * - Knowledge-influenced dialogue branching (combine pieces to unlock new paths)
 * - Iceberg references becoming discoverable (hear mentions 3x → unlock investigation)
 * - Information trading marketplace
 * - Knowledge flag synthesis puzzles
 */

import { GameState as _GameState, PlayerPatterns } from './character-state'
import { PatternType } from './patterns'

// ═══════════════════════════════════════════════════════════════════════════
// D-006: KNOWLEDGE-INFLUENCED DIALOGUE BRANCHING
// Combine multiple knowledge pieces to unlock new branches
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knowledge combination that unlocks special content
 */
export interface KnowledgeCombination {
  id: string
  name: string
  description: string
  requiredFlags: string[]           // All must be present
  excludedFlags?: string[]          // Must NOT be present
  unlocksNodeId: string             // Dialogue node that becomes available
  unlocksFlag: string               // Flag added when player uses this combination
  discoveryText: string             // Shown when player makes the connection
}

/**
 * Predefined knowledge combinations
 */
export const KNOWLEDGE_COMBINATIONS: KnowledgeCombination[] = [
  // Maya + Devon connection
  {
    id: 'maya_devon_project',
    name: 'The Joint Project',
    description: 'Maya and Devon once worked together on something that failed',
    requiredFlags: ['maya_past_failure', 'devon_past_failure'],
    unlocksNodeId: 'maya_devon_shared_secret',
    unlocksFlag: 'discovered_maya_devon_project',
    discoveryText: 'Wait... their failures happened at the same time. Were they working together?'
  },

  // Samuel's true history
  {
    id: 'samuel_before_station',
    name: 'Before the Station',
    description: 'Piecing together who Samuel was before becoming the Conductor',
    requiredFlags: ['samuel_old_life_hint', 'samuel_regret_mentioned', 'samuel_letter_reference'],
    unlocksNodeId: 'samuel_true_past',
    unlocksFlag: 'knows_samuel_origin',
    discoveryText: 'The hints align. Samuel wasn\'t always the Conductor. He chose this.'
  },

  // Rohan + Elena data connection
  {
    id: 'rohan_elena_conspiracy',
    name: 'The Hidden Data',
    description: 'Rohan and Elena found the same pattern in different datasets',
    requiredFlags: ['rohan_data_anomaly', 'elena_archive_discovery'],
    unlocksNodeId: 'joint_investigation',
    unlocksFlag: 'discovered_data_conspiracy',
    discoveryText: 'They\'re seeing the same thing from different angles. This is bigger than either knew.'
  },

  // Marcus + Grace medical connection
  {
    id: 'marcus_grace_patient',
    name: 'The Shared Patient',
    description: 'Marcus and Grace treated the same patient at different stages',
    requiredFlags: ['marcus_difficult_case', 'grace_young_patient'],
    excludedFlags: ['patient_connection_revealed'],
    unlocksNodeId: 'shared_patient_revelation',
    unlocksFlag: 'discovered_shared_patient',
    discoveryText: 'The details match. They both treated the same person without knowing.'
  },

  // Station nature revelation
  {
    id: 'station_true_nature',
    name: 'What the Station Really Is',
    description: 'Multiple hints combine to reveal the station\'s true purpose',
    requiredFlags: [
      'station_responds_to_choices',
      'time_works_differently',
      'characters_seem_aware',
      'letter_origin_hinted'
    ],
    unlocksNodeId: 'station_revelation',
    unlocksFlag: 'knows_station_truth',
    discoveryText: 'It all makes sense now. The station isn\'t a place. It\'s a...'
  },

  // Tess + Lira music connection
  {
    id: 'tess_lira_collaboration',
    name: 'The Lost Recording',
    description: 'Tess and Lira once made music together',
    requiredFlags: ['tess_old_collaborator', 'lira_silent_partner'],
    unlocksNodeId: 'lost_recording',
    unlocksFlag: 'discovered_tess_lira_past',
    discoveryText: 'Lira was the voice Tess was looking for. All this time.'
  }
]

/**
 * Check which knowledge combinations are unlocked
 */
export function checkKnowledgeCombinations(
  globalFlags: Set<string>,
  characterKnowledge: Map<string, Set<string>>
): KnowledgeCombination[] {
  // Gather all known flags (global + all character knowledge)
  const allKnown = new Set(globalFlags)
  characterKnowledge.forEach(flags => {
    flags.forEach(flag => allKnown.add(flag))
  })

  return KNOWLEDGE_COMBINATIONS.filter(combo => {
    // Check all required flags present
    const hasRequired = combo.requiredFlags.every(flag => allKnown.has(flag))
    if (!hasRequired) return false

    // Check no excluded flags present
    if (combo.excludedFlags) {
      const hasExcluded = combo.excludedFlags.some(flag => allKnown.has(flag))
      if (hasExcluded) return false
    }

    // Check not already discovered
    if (allKnown.has(combo.unlocksFlag)) return false

    return true
  })
}

/**
 * Get newly available combinations (for notification)
 */
export function getNewlyAvailableCombinations(
  oldFlags: Set<string>,
  newFlags: Set<string>,
  characterKnowledge: Map<string, Set<string>>
): KnowledgeCombination[] {
  const wasAvailable = checkKnowledgeCombinations(oldFlags, characterKnowledge)
  const nowAvailable = checkKnowledgeCombinations(newFlags, characterKnowledge)

  const wasAvailableIds = new Set(wasAvailable.map(c => c.id))
  return nowAvailable.filter(c => !wasAvailableIds.has(c.id))
}

// ═══════════════════════════════════════════════════════════════════════════
// D-019: ICEBERG REFERENCES BECOMING DISCOVERABLE
// Hear casual mentions 3x → unlock investigation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Iceberg reference tracking
 */
export interface IcebergReference {
  id: string
  topic: string
  description: string
  mentionThreshold: number       // How many times before it becomes investigable
  investigationNodeId: string    // Node that unlocks for investigation
  mentions: IcebergMention[]     // Tracked mentions
}

/**
 * Single mention of an iceberg topic
 */
export interface IcebergMention {
  characterId: string
  nodeId: string
  mentionText: string
  timestamp: number
}

/**
 * Iceberg tracking state
 */
export interface IcebergState {
  references: Map<string, IcebergReference>
  investigatedTopics: Set<string>
}

/**
 * Predefined iceberg topics
 */
export const ICEBERG_TOPICS: Omit<IcebergReference, 'mentions'>[] = [
  {
    id: 'platform_seven',
    topic: 'Platform Seven',
    description: 'A platform that nobody talks about directly',
    mentionThreshold: 3,
    investigationNodeId: 'investigate_platform_seven'
  },
  {
    id: 'the_letter',
    topic: 'The Letter',
    description: 'A letter that summoned the player here',
    mentionThreshold: 3,
    investigationNodeId: 'investigate_letter_origin'
  },
  {
    id: 'before_the_station',
    topic: 'Before the Station',
    description: 'What existed before the station appeared',
    mentionThreshold: 4,
    investigationNodeId: 'investigate_station_origin'
  },
  {
    id: 'the_previous_visitor',
    topic: 'The Previous Visitor',
    description: 'Someone who came through before you',
    mentionThreshold: 3,
    investigationNodeId: 'investigate_previous_visitor'
  },
  {
    id: 'midnight_rule',
    topic: 'The Midnight Rule',
    description: 'Something about what happens at midnight',
    mentionThreshold: 3,
    investigationNodeId: 'investigate_midnight'
  },
  {
    id: 'the_builders',
    topic: 'The Original Builders',
    description: 'Who constructed the station',
    mentionThreshold: 4,
    investigationNodeId: 'investigate_builders'
  }
]

/**
 * Create initial iceberg state
 */
export function createIcebergState(): IcebergState {
  const references = new Map<string, IcebergReference>()

  ICEBERG_TOPICS.forEach(topic => {
    references.set(topic.id, {
      ...topic,
      mentions: []
    })
  })

  return {
    references,
    investigatedTopics: new Set()
  }
}

/**
 * Record an iceberg mention
 */
export function recordIcebergMention(
  state: IcebergState,
  topicId: string,
  characterId: string,
  nodeId: string,
  mentionText: string
): IcebergState {
  const reference = state.references.get(topicId)
  if (!reference) return state

  const mention: IcebergMention = {
    characterId,
    nodeId,
    mentionText,
    timestamp: Date.now()
  }

  const newReferences = new Map(state.references)
  newReferences.set(topicId, {
    ...reference,
    mentions: [...reference.mentions, mention]
  })

  return {
    ...state,
    references: newReferences
  }
}

/**
 * Check if a topic is now investigable
 */
export function isTopicInvestigable(
  state: IcebergState,
  topicId: string
): boolean {
  const reference = state.references.get(topicId)
  if (!reference) return false
  if (state.investigatedTopics.has(topicId)) return false

  return reference.mentions.length >= reference.mentionThreshold
}

/**
 * Get all currently investigable topics
 */
export function getInvestigableTopics(state: IcebergState): IcebergReference[] {
  const investigable: IcebergReference[] = []

  state.references.forEach((ref, id) => {
    if (isTopicInvestigable(state, id)) {
      investigable.push(ref)
    }
  })

  return investigable
}

/**
 * Mark a topic as investigated
 */
export function markTopicInvestigated(
  state: IcebergState,
  topicId: string
): IcebergState {
  return {
    ...state,
    investigatedTopics: new Set([...state.investigatedTopics, topicId])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-056: INFORMATION TRADING MARKETPLACE
// Actual trading mechanics for knowledge
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Information item for trading
 */
export interface InfoItem {
  id: string
  name: string
  description: string
  preview: string           // What you see before acquiring
  fullContent: string       // What you get after acquiring
  sourceCharacterId: string
  rarity: 'common' | 'uncommon' | 'rare' | 'secret' | 'legendary'
  tradeable: boolean
  tradeValue: number        // Base value in trade units
  requiredPatterns?: { pattern: PatternType; min: number }[]
}

/**
 * Trade offer in marketplace
 */
export interface TradeOffer {
  id: string
  sellerId: string          // Character offering
  itemOffered: InfoItem
  priceInItems: string[]    // Info IDs wanted in exchange
  priceInTrust?: number     // Or trust cost
  expiresAt?: number        // Optional expiration
  oneTimeOnly: boolean
}

/**
 * Marketplace state
 */
export interface MarketplaceState {
  availableOffers: TradeOffer[]
  playerInventory: Set<string>  // Info IDs the player has
  completedTrades: string[]     // Trade IDs completed
}

/**
 * Create initial marketplace state
 */
export function createMarketplaceState(): MarketplaceState {
  return {
    availableOffers: [],
    playerInventory: new Set(),
    completedTrades: []
  }
}

/**
 * Check if player can accept a trade offer
 */
export function canAcceptTrade(
  state: MarketplaceState,
  offer: TradeOffer,
  playerTrust: number
): { canAccept: boolean; reason?: string } {
  // Check if already completed (one-time offers)
  if (offer.oneTimeOnly && state.completedTrades.includes(offer.id)) {
    return { canAccept: false, reason: 'This trade is no longer available.' }
  }

  // Check expiration
  if (offer.expiresAt && Date.now() > offer.expiresAt) {
    return { canAccept: false, reason: 'This offer has expired.' }
  }

  // Check trust price
  if (offer.priceInTrust && playerTrust < offer.priceInTrust) {
    return {
      canAccept: false,
      reason: `Requires trust level ${offer.priceInTrust}. Current: ${playerTrust}.`
    }
  }

  // Check item price
  if (offer.priceInItems.length > 0) {
    const missingItems = offer.priceInItems.filter(
      itemId => !state.playerInventory.has(itemId)
    )
    if (missingItems.length > 0) {
      return {
        canAccept: false,
        reason: `Missing required information: ${missingItems.length} item(s).`
      }
    }
  }

  return { canAccept: true }
}

/**
 * Execute a trade
 */
export function executeTrade(
  state: MarketplaceState,
  offer: TradeOffer
): MarketplaceState {
  // Add received item to inventory
  const newInventory = new Set(state.playerInventory)
  newInventory.add(offer.itemOffered.id)

  // Remove traded items
  offer.priceInItems.forEach(itemId => {
    newInventory.delete(itemId)
  })

  return {
    ...state,
    playerInventory: newInventory,
    completedTrades: [...state.completedTrades, offer.id]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-083: KNOWLEDGE FLAG SYNTHESIS PUZZLES
// Combining knowledge pieces creates insights
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Synthesis puzzle definition
 */
export interface SynthesisPuzzle {
  id: string
  name: string
  description: string
  inputFlags: string[]          // Flags needed to attempt synthesis
  correctCombination: number[]  // Indices of inputs in correct order
  hints: string[]               // Progressive hints
  outputFlag: string            // Flag granted on success
  outputInsight: string         // The insight text
  patternRequired?: PatternType
  patternThreshold?: number
}

/**
 * Synthesis attempt result
 */
export interface SynthesisAttemptResult {
  success: boolean
  partialMatch: number        // 0-1 how close they were
  hint?: string               // Hint for next attempt
  insight?: string            // Full insight if successful
}

/**
 * Predefined synthesis puzzles
 */
export const SYNTHESIS_PUZZLES: SynthesisPuzzle[] = [
  {
    id: 'station_purpose',
    name: 'The Station\'s Purpose',
    description: 'What is the station really for?',
    inputFlags: [
      'letter_summons_you',      // 0
      'station_reads_choices',   // 1
      'characters_guide_not_judge', // 2
      'time_is_a_resource'       // 3
    ],
    correctCombination: [0, 1, 2, 3], // In order
    hints: [
      'It starts with how you arrived...',
      'What does the station do with your choices?',
      'Why do the characters feel so... understanding?',
      'Time here isn\'t like time outside.'
    ],
    outputFlag: 'understood_station_purpose',
    outputInsight: 'The station is a crucible. It draws people at crossroads, gives them time to discover who they are through their choices, guided by those who came before.',
    patternRequired: 'analytical',
    patternThreshold: 6
  },
  {
    id: 'maya_choice',
    name: 'Maya\'s True Choice',
    description: 'What is Maya really deciding between?',
    inputFlags: [
      'maya_family_pressure',    // 0
      'maya_robot_passion',      // 1
      'maya_fear_of_failure',    // 2
      'maya_identity_hidden'     // 3
    ],
    correctCombination: [0, 3, 1], // Family, Identity, Passion
    hints: [
      'Start with what others want from her...',
      'What is she hiding even from herself?',
      'What does she really love?'
    ],
    outputFlag: 'understood_maya_dilemma',
    outputInsight: 'Maya isn\'t choosing between careers. She\'s choosing between being who her family expects and being who she secretly knows she is.',
    patternRequired: 'helping',
    patternThreshold: 5
  },
  {
    id: 'samuel_sacrifice',
    name: 'Samuel\'s Sacrifice',
    description: 'What did Samuel give up to become the Conductor?',
    inputFlags: [
      'samuel_had_family',       // 0
      'samuel_linear_time',      // 1
      'samuel_chose_to_stay',    // 2
      'samuel_remembers_all'     // 3
    ],
    correctCombination: [0, 1, 2],
    hints: [
      'He had a life before...',
      'Time works differently for him now...',
      'It was his choice.'
    ],
    outputFlag: 'understood_samuel_sacrifice',
    outputInsight: 'Samuel chose to leave linear time—and everyone he knew in it—to guide others through the station. He remembers every person he\'s helped. And every person he couldn\'t.',
    patternRequired: 'patience',
    patternThreshold: 6
  }
]

/**
 * Attempt a synthesis puzzle
 */
export function attemptSynthesis(
  puzzle: SynthesisPuzzle,
  playerCombination: number[],
  patterns: PlayerPatterns,
  attemptNumber: number = 1
): SynthesisAttemptResult {
  // Check pattern requirements
  if (puzzle.patternRequired && puzzle.patternThreshold) {
    if (patterns[puzzle.patternRequired] < puzzle.patternThreshold) {
      return {
        success: false,
        partialMatch: 0,
        hint: `This insight requires deeper ${puzzle.patternRequired} development.`
      }
    }
  }

  // Check if combination matches
  const isCorrect =
    playerCombination.length === puzzle.correctCombination.length &&
    playerCombination.every((v, i) => v === puzzle.correctCombination[i])

  if (isCorrect) {
    return {
      success: true,
      partialMatch: 1.0,
      insight: puzzle.outputInsight
    }
  }

  // Calculate partial match
  let matches = 0
  const minLength = Math.min(playerCombination.length, puzzle.correctCombination.length)
  for (let i = 0; i < minLength; i++) {
    if (playerCombination[i] === puzzle.correctCombination[i]) {
      matches++
    }
  }
  const partialMatch = matches / puzzle.correctCombination.length

  // Get appropriate hint
  const hintIndex = Math.min(attemptNumber - 1, puzzle.hints.length - 1)
  const hint = puzzle.hints[hintIndex]

  return {
    success: false,
    partialMatch,
    hint
  }
}

/**
 * Get available synthesis puzzles for player
 */
export function getAvailableSynthesisPuzzles(
  globalFlags: Set<string>,
  characterKnowledge: Map<string, Set<string>>,
  completedPuzzles: Set<string>
): SynthesisPuzzle[] {
  // Gather all known flags
  const allKnown = new Set(globalFlags)
  characterKnowledge.forEach(flags => {
    flags.forEach(flag => allKnown.add(flag))
  })

  return SYNTHESIS_PUZZLES.filter(puzzle => {
    // Not already completed
    if (completedPuzzles.has(puzzle.id)) return false
    if (allKnown.has(puzzle.outputFlag)) return false

    // Has all input flags
    return puzzle.inputFlags.every(flag => allKnown.has(flag))
  })
}
