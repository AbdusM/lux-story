/**
 * Tests for Knowledge System Derivatives
 * Feature IDs: D-006, D-019, D-056, D-083
 */

import { describe, it, expect } from 'vitest'
import {
  // D-006: Knowledge Combinations
  checkKnowledgeCombinations,
  getNewlyAvailableCombinations,
  KNOWLEDGE_COMBINATIONS,

  // D-019: Iceberg References
  createIcebergState,
  recordIcebergMention,
  isTopicInvestigable,
  getInvestigableTopics,
  markTopicInvestigated,
  ICEBERG_TOPICS,

  // D-056: Information Trading
  createMarketplaceState,
  canAcceptTrade,
  executeTrade,
  TradeOffer,
  InfoItem,

  // D-083: Synthesis Puzzles
  attemptSynthesis,
  getAvailableSynthesisPuzzles,
  SYNTHESIS_PUZZLES
} from '@/lib/knowledge-derivatives'

import { PlayerPatterns } from '@/lib/character-state'

// ═══════════════════════════════════════════════════════════════════════════
// D-006: KNOWLEDGE-INFLUENCED DIALOGUE BRANCHING
// ═══════════════════════════════════════════════════════════════════════════

describe('D-006: Knowledge-Influenced Dialogue Branching', () => {
  it('all combinations have valid structure', () => {
    KNOWLEDGE_COMBINATIONS.forEach(combo => {
      expect(combo.id).toBeDefined()
      expect(combo.name).toBeDefined()
      expect(combo.requiredFlags.length).toBeGreaterThan(0)
      expect(combo.unlocksNodeId).toBeDefined()
      expect(combo.unlocksFlag).toBeDefined()
      expect(combo.discoveryText).toBeDefined()
    })
  })

  it('returns empty when no flags present', () => {
    const globalFlags = new Set<string>()
    const charKnowledge = new Map<string, Set<string>>()

    const combos = checkKnowledgeCombinations(globalFlags, charKnowledge)
    expect(combos).toHaveLength(0)
  })

  it('unlocks combination when all required flags present', () => {
    const globalFlags = new Set(['maya_past_failure', 'devon_past_failure'])
    const charKnowledge = new Map<string, Set<string>>()

    const combos = checkKnowledgeCombinations(globalFlags, charKnowledge)
    expect(combos.some(c => c.id === 'maya_devon_project')).toBe(true)
  })

  it('excludes already discovered combinations', () => {
    const globalFlags = new Set([
      'maya_past_failure',
      'devon_past_failure',
      'discovered_maya_devon_project' // Already discovered
    ])
    const charKnowledge = new Map<string, Set<string>>()

    const combos = checkKnowledgeCombinations(globalFlags, charKnowledge)
    expect(combos.some(c => c.id === 'maya_devon_project')).toBe(false)
  })

  it('respects excluded flags', () => {
    const globalFlags = new Set([
      'marcus_difficult_case',
      'grace_young_patient',
      'patient_connection_revealed' // Excluded flag
    ])
    const charKnowledge = new Map<string, Set<string>>()

    const combos = checkKnowledgeCombinations(globalFlags, charKnowledge)
    expect(combos.some(c => c.id === 'marcus_grace_patient')).toBe(false)
  })

  it('detects newly available combinations', () => {
    const oldFlags = new Set(['maya_past_failure'])
    const newFlags = new Set(['maya_past_failure', 'devon_past_failure'])
    const charKnowledge = new Map<string, Set<string>>()

    const newCombos = getNewlyAvailableCombinations(oldFlags, newFlags, charKnowledge)
    expect(newCombos.some(c => c.id === 'maya_devon_project')).toBe(true)
  })

  it('combines global and character knowledge', () => {
    const globalFlags = new Set(['maya_past_failure'])
    const charKnowledge = new Map<string, Set<string>>([
      ['devon', new Set(['devon_past_failure'])]
    ])

    const combos = checkKnowledgeCombinations(globalFlags, charKnowledge)
    expect(combos.some(c => c.id === 'maya_devon_project')).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-019: ICEBERG REFERENCES BECOMING DISCOVERABLE
// ═══════════════════════════════════════════════════════════════════════════

describe('D-019: Iceberg References', () => {
  it('all topics have valid structure', () => {
    ICEBERG_TOPICS.forEach(topic => {
      expect(topic.id).toBeDefined()
      expect(topic.topic).toBeDefined()
      expect(topic.mentionThreshold).toBeGreaterThan(0)
      expect(topic.investigationNodeId).toBeDefined()
    })
  })

  it('creates initial state correctly', () => {
    const state = createIcebergState()
    expect(state.references.size).toBe(ICEBERG_TOPICS.length)
    expect(state.investigatedTopics.size).toBe(0)

    // Each topic should have empty mentions
    state.references.forEach(ref => {
      expect(ref.mentions).toHaveLength(0)
    })
  })

  it('records mentions correctly', () => {
    let state = createIcebergState()
    state = recordIcebergMention(
      state,
      'platform_seven',
      'samuel',
      'node1',
      'Platform Seven... we don\'t talk about it.'
    )

    const ref = state.references.get('platform_seven')!
    expect(ref.mentions).toHaveLength(1)
    expect(ref.mentions[0].characterId).toBe('samuel')
  })

  it('topic not investigable below threshold', () => {
    let state = createIcebergState()
    state = recordIcebergMention(state, 'platform_seven', 'samuel', 'n1', 'mention 1')
    state = recordIcebergMention(state, 'platform_seven', 'maya', 'n2', 'mention 2')

    expect(isTopicInvestigable(state, 'platform_seven')).toBe(false)
  })

  it('topic becomes investigable at threshold', () => {
    let state = createIcebergState()
    state = recordIcebergMention(state, 'platform_seven', 'samuel', 'n1', 'mention 1')
    state = recordIcebergMention(state, 'platform_seven', 'maya', 'n2', 'mention 2')
    state = recordIcebergMention(state, 'platform_seven', 'devon', 'n3', 'mention 3')

    expect(isTopicInvestigable(state, 'platform_seven')).toBe(true)
  })

  it('gets all investigable topics', () => {
    let state = createIcebergState()

    // Add enough mentions for platform_seven (threshold 3)
    state = recordIcebergMention(state, 'platform_seven', 'samuel', 'n1', 'm1')
    state = recordIcebergMention(state, 'platform_seven', 'maya', 'n2', 'm2')
    state = recordIcebergMention(state, 'platform_seven', 'devon', 'n3', 'm3')

    // Add enough mentions for the_letter (threshold 3)
    state = recordIcebergMention(state, 'the_letter', 'samuel', 'n4', 'm4')
    state = recordIcebergMention(state, 'the_letter', 'rohan', 'n5', 'm5')
    state = recordIcebergMention(state, 'the_letter', 'tess', 'n6', 'm6')

    const investigable = getInvestigableTopics(state)
    expect(investigable).toHaveLength(2)
  })

  it('marking investigated removes from investigable', () => {
    let state = createIcebergState()
    state = recordIcebergMention(state, 'platform_seven', 'samuel', 'n1', 'm1')
    state = recordIcebergMention(state, 'platform_seven', 'maya', 'n2', 'm2')
    state = recordIcebergMention(state, 'platform_seven', 'devon', 'n3', 'm3')

    expect(isTopicInvestigable(state, 'platform_seven')).toBe(true)

    state = markTopicInvestigated(state, 'platform_seven')

    expect(isTopicInvestigable(state, 'platform_seven')).toBe(false)
    expect(state.investigatedTopics.has('platform_seven')).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-056: INFORMATION TRADING MARKETPLACE
// ═══════════════════════════════════════════════════════════════════════════

describe('D-056: Information Trading Marketplace', () => {
  const testItem: InfoItem = {
    id: 'secret_1',
    name: 'Maya\'s Secret Project',
    description: 'Information about Maya\'s hidden work',
    preview: 'Something Maya doesn\'t talk about...',
    fullContent: 'Maya is building an AI that...',
    sourceCharacterId: 'devon',
    rarity: 'rare',
    tradeable: true,
    tradeValue: 5
  }

  const testOffer: TradeOffer = {
    id: 'offer_1',
    sellerId: 'devon',
    itemOffered: testItem,
    priceInItems: ['info_a', 'info_b'],
    oneTimeOnly: true
  }

  const trustOffer: TradeOffer = {
    id: 'offer_2',
    sellerId: 'maya',
    itemOffered: testItem,
    priceInItems: [],
    priceInTrust: 5,
    oneTimeOnly: false
  }

  it('creates empty marketplace state', () => {
    const state = createMarketplaceState()
    expect(state.availableOffers).toHaveLength(0)
    expect(state.playerInventory.size).toBe(0)
    expect(state.completedTrades).toHaveLength(0)
  })

  it('cannot accept trade without required items', () => {
    const state = createMarketplaceState()
    const result = canAcceptTrade(state, testOffer, 10)

    expect(result.canAccept).toBe(false)
    expect(result.reason).toContain('Missing required information')
  })

  it('can accept trade with required items', () => {
    const state: ReturnType<typeof createMarketplaceState> = {
      ...createMarketplaceState(),
      playerInventory: new Set(['info_a', 'info_b'])
    }
    const result = canAcceptTrade(state, testOffer, 10)

    expect(result.canAccept).toBe(true)
  })

  it('cannot accept trade with insufficient trust', () => {
    const state = createMarketplaceState()
    const result = canAcceptTrade(state, trustOffer, 3)

    expect(result.canAccept).toBe(false)
    expect(result.reason).toContain('Requires trust level 5')
  })

  it('can accept trust-based trade with sufficient trust', () => {
    const state = createMarketplaceState()
    const result = canAcceptTrade(state, trustOffer, 7)

    expect(result.canAccept).toBe(true)
  })

  it('cannot repeat one-time trade', () => {
    const state: ReturnType<typeof createMarketplaceState> = {
      ...createMarketplaceState(),
      playerInventory: new Set(['info_a', 'info_b']),
      completedTrades: ['offer_1']
    }
    const result = canAcceptTrade(state, testOffer, 10)

    expect(result.canAccept).toBe(false)
    expect(result.reason).toContain('no longer available')
  })

  it('executes trade correctly', () => {
    const state: ReturnType<typeof createMarketplaceState> = {
      ...createMarketplaceState(),
      playerInventory: new Set(['info_a', 'info_b', 'info_c'])
    }

    const newState = executeTrade(state, testOffer)

    // Item received
    expect(newState.playerInventory.has('secret_1')).toBe(true)
    // Items traded away
    expect(newState.playerInventory.has('info_a')).toBe(false)
    expect(newState.playerInventory.has('info_b')).toBe(false)
    // Unrelated item kept
    expect(newState.playerInventory.has('info_c')).toBe(true)
    // Trade recorded
    expect(newState.completedTrades).toContain('offer_1')
  })

  it('checks expiration correctly', () => {
    const expiredOffer: TradeOffer = {
      ...trustOffer,
      expiresAt: Date.now() - 1000 // Expired 1 second ago
    }
    const state = createMarketplaceState()
    const result = canAcceptTrade(state, expiredOffer, 10)

    expect(result.canAccept).toBe(false)
    expect(result.reason).toContain('expired')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-083: KNOWLEDGE FLAG SYNTHESIS PUZZLES
// ═══════════════════════════════════════════════════════════════════════════

describe('D-083: Knowledge Flag Synthesis Puzzles', () => {
  const developedPatterns: PlayerPatterns = {
    analytical: 7,
    patience: 7,
    exploring: 7,
    helping: 7,
    building: 7
  }

  const lowPatterns: PlayerPatterns = {
    analytical: 2,
    patience: 2,
    exploring: 2,
    helping: 2,
    building: 2
  }

  it('all puzzles have valid structure', () => {
    SYNTHESIS_PUZZLES.forEach(puzzle => {
      expect(puzzle.id).toBeDefined()
      expect(puzzle.name).toBeDefined()
      expect(puzzle.inputFlags.length).toBeGreaterThan(0)
      expect(puzzle.correctCombination.length).toBeGreaterThan(0)
      expect(puzzle.hints.length).toBeGreaterThan(0)
      expect(puzzle.outputFlag).toBeDefined()
      expect(puzzle.outputInsight).toBeDefined()

      // Combination indices should be valid
      puzzle.correctCombination.forEach(index => {
        expect(index).toBeGreaterThanOrEqual(0)
        expect(index).toBeLessThan(puzzle.inputFlags.length)
      })
    })
  })

  it('fails synthesis with wrong pattern level', () => {
    const puzzle = SYNTHESIS_PUZZLES.find(p => p.patternRequired)!
    const result = attemptSynthesis(puzzle, puzzle.correctCombination, lowPatterns)

    expect(result.success).toBe(false)
    expect(result.hint).toContain('development')
  })

  it('succeeds with correct combination and patterns', () => {
    const puzzle = SYNTHESIS_PUZZLES[0] // station_purpose
    const result = attemptSynthesis(puzzle, puzzle.correctCombination, developedPatterns)

    expect(result.success).toBe(true)
    expect(result.partialMatch).toBe(1.0)
    expect(result.insight).toBe(puzzle.outputInsight)
  })

  it('fails with wrong combination', () => {
    const puzzle = SYNTHESIS_PUZZLES[0]
    const wrongCombination = [3, 2, 1, 0] // Reversed

    const result = attemptSynthesis(puzzle, wrongCombination, developedPatterns)

    expect(result.success).toBe(false)
    expect(result.partialMatch).toBeLessThan(1.0)
  })

  it('provides progressive hints', () => {
    const puzzle = SYNTHESIS_PUZZLES[0]
    const wrongCombination = [3, 2, 1, 0]

    const attempt1 = attemptSynthesis(puzzle, wrongCombination, developedPatterns, 1)
    const attempt2 = attemptSynthesis(puzzle, wrongCombination, developedPatterns, 2)

    expect(attempt1.hint).toBe(puzzle.hints[0])
    expect(attempt2.hint).toBe(puzzle.hints[1])
  })

  it('calculates partial match correctly', () => {
    const puzzle = SYNTHESIS_PUZZLES[0]
    // Get first two right
    const partialCorrect = [puzzle.correctCombination[0], puzzle.correctCombination[1], 99, 99]

    const result = attemptSynthesis(puzzle, partialCorrect, developedPatterns)

    expect(result.success).toBe(false)
    expect(result.partialMatch).toBe(0.5) // 2/4 correct
  })

  it('gets available puzzles correctly', () => {
    // All input flags for first puzzle
    const globalFlags = new Set(SYNTHESIS_PUZZLES[0].inputFlags)
    const charKnowledge = new Map<string, Set<string>>()
    const completedPuzzles = new Set<string>()

    const available = getAvailableSynthesisPuzzles(globalFlags, charKnowledge, completedPuzzles)

    expect(available.some(p => p.id === SYNTHESIS_PUZZLES[0].id)).toBe(true)
  })

  it('excludes completed puzzles', () => {
    const globalFlags = new Set(SYNTHESIS_PUZZLES[0].inputFlags)
    const charKnowledge = new Map<string, Set<string>>()
    const completedPuzzles = new Set([SYNTHESIS_PUZZLES[0].id])

    const available = getAvailableSynthesisPuzzles(globalFlags, charKnowledge, completedPuzzles)

    expect(available.some(p => p.id === SYNTHESIS_PUZZLES[0].id)).toBe(false)
  })

  it('excludes puzzles with output flag already present', () => {
    const globalFlags = new Set([
      ...SYNTHESIS_PUZZLES[0].inputFlags,
      SYNTHESIS_PUZZLES[0].outputFlag // Already have the output
    ])
    const charKnowledge = new Map<string, Set<string>>()
    const completedPuzzles = new Set<string>()

    const available = getAvailableSynthesisPuzzles(globalFlags, charKnowledge, completedPuzzles)

    expect(available.some(p => p.id === SYNTHESIS_PUZZLES[0].id)).toBe(false)
  })
})
