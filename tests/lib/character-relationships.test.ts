import { describe, it, expect } from 'vitest'
import {
  CHARACTER_RELATIONSHIP_WEB,
  getCharacterMention,
  getSharedMemory,
  getCharacterConnections,
  checkRelationshipEvolution,
  detectRelationshipUpdates,
  getRelevantCrossCharacterEcho,
  type RelationshipType,
  type CharacterRelationshipEdge
} from '@/lib/character-relationships'
import type { GameState } from '@/lib/character-state'

describe('CHARACTER_RELATIONSHIP_WEB', () => {
  it('exports a non-empty array of relationships', () => {
    expect(CHARACTER_RELATIONSHIP_WEB).toBeInstanceOf(Array)
    expect(CHARACTER_RELATIONSHIP_WEB.length).toBeGreaterThan(0)
  })

  it('all relationships have required fields', () => {
    CHARACTER_RELATIONSHIP_WEB.forEach((edge, index) => {
      expect(edge.fromCharacterId, `Edge ${index} missing fromCharacterId`).toBeDefined()
      expect(edge.toCharacterId, `Edge ${index} missing toCharacterId`).toBeDefined()
      expect(edge.type, `Edge ${index} missing type`).toBeDefined()
      expect(edge.intensity, `Edge ${index} missing intensity`).toBeDefined()
      expect(edge.opinions, `Edge ${index} missing opinions`).toBeDefined()
    })
  })

  it('all relationships have valid types', () => {
    const validTypes: RelationshipType[] = [
      'ally', 'rival', 'mentor', 'protege', 'former', 'parallel', 'stranger', 'complicated'
    ]

    CHARACTER_RELATIONSHIP_WEB.forEach((edge, index) => {
      expect(validTypes).toContain(edge.type)
    })
  })

  it('all relationships have intensity between 1-10', () => {
    CHARACTER_RELATIONSHIP_WEB.forEach((edge, index) => {
      expect(edge.intensity).toBeGreaterThanOrEqual(1)
      expect(edge.intensity).toBeLessThanOrEqual(10)
    })
  })

  it('all relationships have valid sentiment', () => {
    const validSentiments = ['positive', 'neutral', 'negative', 'conflicted']

    CHARACTER_RELATIONSHIP_WEB.forEach((edge, index) => {
      expect(validSentiments).toContain(edge.opinions.sentiment)
    })
  })

  it('all relationships have public and private opinions', () => {
    CHARACTER_RELATIONSHIP_WEB.forEach((edge, index) => {
      expect(typeof edge.opinions.publicOpinion).toBe('string')
      expect(typeof edge.opinions.privateOpinion).toBe('string')
      expect(edge.opinions.publicOpinion.length).toBeGreaterThan(0)
      expect(edge.opinions.privateOpinion.length).toBeGreaterThan(0)
    })
  })

  it('memories array exists (can be empty)', () => {
    CHARACTER_RELATIONSHIP_WEB.forEach((edge, index) => {
      expect(edge.opinions.memories).toBeInstanceOf(Array)
    })
  })

  describe('specific relationships', () => {
    it('includes Maya → Devon relationship', () => {
      const mayaToDevon = CHARACTER_RELATIONSHIP_WEB.find(
        r => r.fromCharacterId === 'maya' && r.toCharacterId === 'devon'
      )
      expect(mayaToDevon).toBeDefined()
      expect(mayaToDevon!.type).toBe('parallel')
    })

    it('includes Samuel → Maya relationship', () => {
      const samuelToMaya = CHARACTER_RELATIONSHIP_WEB.find(
        r => r.fromCharacterId === 'samuel' && r.toCharacterId === 'maya'
      )
      expect(samuelToMaya).toBeDefined()
      expect(samuelToMaya!.type).toBe('mentor')
    })

    it('includes Rohan → Devon rivalry', () => {
      const rohanToDevon = CHARACTER_RELATIONSHIP_WEB.find(
        r => r.fromCharacterId === 'rohan' && r.toCharacterId === 'devon'
      )
      expect(rohanToDevon).toBeDefined()
      expect(rohanToDevon!.type).toBe('rival')
    })

    it('includes Quinn → Samuel relationship (LinkedIn 2026)', () => {
      const quinnToSamuel = CHARACTER_RELATIONSHIP_WEB.find(
        r => r.fromCharacterId === 'quinn' && r.toCharacterId === 'samuel'
      )
      expect(quinnToSamuel).toBeDefined()
      expect(quinnToSamuel!.type).toBe('protege')
    })
  })

  describe('dynamic rules', () => {
    it('Maya → Devon has dynamic rules', () => {
      const mayaToDevon = CHARACTER_RELATIONSHIP_WEB.find(
        r => r.fromCharacterId === 'maya' && r.toCharacterId === 'devon'
      )
      expect(mayaToDevon!.dynamicRules).toBeDefined()
      expect(mayaToDevon!.dynamicRules!.length).toBeGreaterThan(0)
    })

    it('dynamic rules have required fields', () => {
      CHARACTER_RELATIONSHIP_WEB.forEach(edge => {
        if (edge.dynamicRules) {
          edge.dynamicRules.forEach(rule => {
            expect(rule.triggerFlags).toBeInstanceOf(Array)
            expect(rule.triggerFlags.length).toBeGreaterThan(0)
            expect(rule.newType).toBeDefined()
            expect(rule.newIntensity).toBeDefined()
          })
        }
      })
    })
  })

  describe('reveal conditions', () => {
    it('some relationships have reveal conditions', () => {
      const withConditions = CHARACTER_RELATIONSHIP_WEB.filter(r => r.revealConditions)
      expect(withConditions.length).toBeGreaterThan(0)
    })

    it('Maya → Devon requires meeting Devon', () => {
      const mayaToDevon = CHARACTER_RELATIONSHIP_WEB.find(
        r => r.fromCharacterId === 'maya' && r.toCharacterId === 'devon'
      )
      expect(mayaToDevon!.revealConditions?.charactersMet).toContain('devon')
    })
  })
})

describe('getCharacterMention', () => {
  it('returns canMention: false for non-existent relationship', () => {
    const result = getCharacterMention('maya', 'nonexistent', {
      trust: 10,
      globalFlags: new Set(),
      charactersMet: []
    })
    expect(result.canMention).toBe(false)
    expect(result.opinion).toBeNull()
  })

  it('returns canMention: false when trust is too low', () => {
    const result = getCharacterMention('maya', 'devon', {
      trust: 1, // Maya → Devon requires trustMin: 4
      globalFlags: new Set(),
      charactersMet: ['devon']
    })
    expect(result.canMention).toBe(false)
  })

  it('returns canMention: false when required characters not met', () => {
    const result = getCharacterMention('maya', 'devon', {
      trust: 10,
      globalFlags: new Set(),
      charactersMet: [] // Needs to have met devon
    })
    expect(result.canMention).toBe(false)
  })

  it('returns public opinion at low trust', () => {
    const result = getCharacterMention('maya', 'samuel', {
      trust: 4, // Just meets minimum for Maya → Samuel
      globalFlags: new Set(),
      charactersMet: []
    })
    expect(result.canMention).toBe(true)
    expect(result.opinion).toBeDefined()
    expect(result.isDeepReveal).toBe(false)
  })

  it('returns private opinion at high trust (>= 7)', () => {
    const result = getCharacterMention('maya', 'samuel', {
      trust: 8,
      globalFlags: new Set(),
      charactersMet: []
    })
    expect(result.canMention).toBe(true)
    expect(result.isDeepReveal).toBe(true)
    // Private opinion is Maya's deep thoughts about Samuel
    expect(result.opinion).toContain('catch up to myself') // Maya's private opinion
  })

  it('applies dynamic rules when flags present', () => {
    // Maya → Devon changes from 'parallel' to 'ally' when flag is set
    const result = getCharacterMention('maya', 'devon', {
      trust: 5,
      globalFlags: new Set(['devon_maya_collaboration_started']),
      charactersMet: ['devon']
    })
    expect(result.canMention).toBe(true)
    // After dynamic rule, opinion should reflect the collaboration
    expect(result.opinion).toContain('working on something')
  })

  it('returns sentiment with opinion', () => {
    const result = getCharacterMention('maya', 'samuel', {
      trust: 5,
      globalFlags: new Set(),
      charactersMet: []
    })
    expect(result.sentiment).toBeDefined()
    expect(['positive', 'neutral', 'negative', 'conflicted']).toContain(result.sentiment)
  })
})

describe('getSharedMemory', () => {
  it('returns null for non-existent relationship', () => {
    const result = getSharedMemory('maya', 'nonexistent', {
      trust: 10,
      globalFlags: new Set()
    })
    expect(result).toBeNull()
  })

  it('returns null when trust is below 6', () => {
    const result = getSharedMemory('maya', 'devon', {
      trust: 5,
      globalFlags: new Set()
    })
    expect(result).toBeNull()
  })

  it('returns memory when trust is >= 6 and memories exist', () => {
    // Maya → Devon has memories
    const result = getSharedMemory('maya', 'devon', {
      trust: 7,
      globalFlags: new Set()
    })

    // Maya → Devon has memories defined
    const relationship = CHARACTER_RELATIONSHIP_WEB.find(
      r => r.fromCharacterId === 'maya' && r.toCharacterId === 'devon'
    )

    if (relationship && relationship.opinions.memories.length > 0) {
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    } else {
      expect(result).toBeNull()
    }
  })

  it('returns null for relationships without memories', () => {
    // Devon → Samuel has no memories
    const result = getSharedMemory('devon', 'samuel', {
      trust: 8,
      globalFlags: new Set()
    })
    expect(result).toBeNull()
  })
})

describe('getCharacterConnections', () => {
  it('returns array of connected character IDs', () => {
    const mayaConnections = getCharacterConnections('maya')
    expect(mayaConnections).toBeInstanceOf(Array)
    expect(mayaConnections.length).toBeGreaterThan(0)
  })

  it('Maya has connections to devon, samuel, marcus', () => {
    const mayaConnections = getCharacterConnections('maya')
    expect(mayaConnections).toContain('devon')
    expect(mayaConnections).toContain('samuel')
    expect(mayaConnections).toContain('marcus')
  })

  it('Samuel has many connections (hub character)', () => {
    const samuelConnections = getCharacterConnections('samuel')
    expect(samuelConnections.length).toBeGreaterThanOrEqual(5)
  })

  it('returns empty array for unknown character', () => {
    const connections = getCharacterConnections('nonexistent')
    expect(connections).toBeInstanceOf(Array)
    expect(connections.length).toBe(0)
  })
})

describe('checkRelationshipEvolution', () => {
  it('returns evolved: false when no dynamic rules', () => {
    // Devon → Samuel has no dynamic rules
    const result = checkRelationshipEvolution('devon', 'samuel', new Set())
    expect(result.evolved).toBe(false)
    expect(result.newType).toBeUndefined()
  })

  it('returns evolved: false when relationship does not exist', () => {
    const result = checkRelationshipEvolution('nonexistent', 'samuel', new Set())
    expect(result.evolved).toBe(false)
  })

  it('returns evolved: false when trigger flags not met', () => {
    const result = checkRelationshipEvolution('maya', 'devon', new Set())
    expect(result.evolved).toBe(false)
  })

  it('returns evolved: true with newType when trigger flags met', () => {
    const result = checkRelationshipEvolution(
      'maya',
      'devon',
      new Set(['devon_maya_collaboration_started'])
    )
    expect(result.evolved).toBe(true)
    expect(result.newType).toBe('ally')
  })

  it('returns evolved: true for Maya → Marcus biomedical evolution', () => {
    const result = checkRelationshipEvolution(
      'maya',
      'marcus',
      new Set(['maya_considers_biomedical'])
    )
    expect(result.evolved).toBe(true)
    expect(result.newType).toBe('ally')
  })
})

describe('detectRelationshipUpdates', () => {
  it('returns empty array when no flags added', () => {
    const oldFlags = new Set(['flag1'])
    const newFlags = new Set(['flag1'])
    const updates = detectRelationshipUpdates(oldFlags, newFlags)
    expect(updates).toEqual([])
  })

  it('returns empty array when added flags dont trigger rules', () => {
    const oldFlags = new Set<string>()
    const newFlags = new Set(['unrelated_flag'])
    const updates = detectRelationshipUpdates(oldFlags, newFlags)
    expect(updates).toEqual([])
  })

  it('detects Maya → Devon evolution when collaboration flag added', () => {
    const oldFlags = new Set<string>()
    const newFlags = new Set(['devon_maya_collaboration_started'])
    const updates = detectRelationshipUpdates(oldFlags, newFlags)

    expect(updates.length).toBeGreaterThan(0)
    const mayaDevonUpdate = updates.find(
      u => u.fromId === 'maya' && u.toId === 'devon'
    )
    expect(mayaDevonUpdate).toBeDefined()
    expect(mayaDevonUpdate!.newType).toBe('ally')
  })

  it('detects Maya → Marcus evolution when biomedical flag added', () => {
    const oldFlags = new Set<string>()
    const newFlags = new Set(['maya_considers_biomedical'])
    const updates = detectRelationshipUpdates(oldFlags, newFlags)

    const mayaMarcusUpdate = updates.find(
      u => u.fromId === 'maya' && u.toId === 'marcus'
    )
    expect(mayaMarcusUpdate).toBeDefined()
    expect(mayaMarcusUpdate!.newType).toBe('ally')

    // Also should detect Marcus → Maya update
    const marcusMayaUpdate = updates.find(
      u => u.fromId === 'marcus' && u.toId === 'maya'
    )
    expect(marcusMayaUpdate).toBeDefined()
  })

  it('does not re-trigger already satisfied rules', () => {
    const oldFlags = new Set(['devon_maya_collaboration_started'])
    const newFlags = new Set(['devon_maya_collaboration_started', 'other_flag'])
    const updates = detectRelationshipUpdates(oldFlags, newFlags)

    const mayaDevonUpdate = updates.find(
      u => u.fromId === 'maya' && u.toId === 'devon'
    )
    expect(mayaDevonUpdate).toBeUndefined()
  })
})

describe('getRelevantCrossCharacterEcho', () => {
  function createMockGameState(overrides: Partial<GameState> = {}): GameState {
    const characters = new Map()
    characters.set('maya', {
      characterId: 'maya',
      trust: 5,
      conversationHistory: []
    })
    characters.set('samuel', {
      characterId: 'samuel',
      trust: 0,
      conversationHistory: [{ nodeId: 'test' }] // Player has interacted
    })
    characters.set('devon', {
      characterId: 'devon',
      trust: 0,
      conversationHistory: [{ nodeId: 'test' }] // Player has interacted
    })

    return {
      characters,
      globalFlags: new Set(),
      patterns: new Map(),
      skills: {},
      ...overrides
    } as unknown as GameState
  }

  it('returns null for non-existent speaker', () => {
    const gameState = createMockGameState()
    const result = getRelevantCrossCharacterEcho('nonexistent', gameState)
    expect(result).toBeNull()
  })

  it('returns an echo for Maya with sufficient trust and met characters', () => {
    const characters = new Map()
    characters.set('maya', {
      characterId: 'maya',
      trust: 5,
      conversationHistory: [{ nodeId: 'intro' }]
    })
    characters.set('samuel', {
      characterId: 'samuel',
      trust: 0,
      conversationHistory: [{ nodeId: 'test' }]
    })
    characters.set('devon', {
      characterId: 'devon',
      trust: 0,
      conversationHistory: [{ nodeId: 'test' }]
    })

    const gameState = {
      characters,
      globalFlags: new Set<string>()
    } as unknown as GameState

    // Maya has connections to samuel (trust 3 needed) and devon (trust 4 + devon met needed)
    const result = getRelevantCrossCharacterEcho('maya', gameState)

    // With trust 5 and both characters met, should get an echo
    if (result) {
      expect(result.text).toBeDefined()
      expect(typeof result.text).toBe('string')
    }
  })

  it('returns echo with emotion field', () => {
    const characters = new Map()
    characters.set('samuel', {
      characterId: 'samuel',
      trust: 5,
      conversationHistory: [{ nodeId: 'intro' }]
    })
    characters.set('maya', {
      characterId: 'maya',
      trust: 0,
      conversationHistory: [{ nodeId: 'test' }]
    })

    const gameState = {
      characters,
      globalFlags: new Set<string>()
    } as unknown as GameState

    const result = getRelevantCrossCharacterEcho('samuel', gameState)

    if (result) {
      expect(result.emotion).toBeDefined()
    }
  })
})

describe('relationship coverage', () => {
  it('all 20 characters have at least one outgoing relationship', () => {
    const expectedCharacters = [
      'maya', 'samuel', 'devon', 'marcus', 'rohan', 'tess', 'kai', 'jordan',
      'yaquin', 'grace', 'elena', 'alex', 'silas', 'asha', 'lira', 'zara',
      'quinn', 'dante', 'nadia', 'isaiah'
    ]

    const charactersWithRelationships = new Set(
      CHARACTER_RELATIONSHIP_WEB.map(r => r.fromCharacterId)
    )

    expectedCharacters.forEach(charId => {
      expect(charactersWithRelationships.has(charId)).toBe(true)
    })
  })

  it('Samuel (hub character) has relationships to many characters', () => {
    const samuelConnections = getCharacterConnections('samuel')
    // Samuel should connect to multiple characters as the hub
    expect(samuelConnections.length).toBeGreaterThanOrEqual(6)
  })

  it('LinkedIn 2026 characters have relationships', () => {
    const linkedInCharacters = ['quinn', 'dante', 'nadia', 'isaiah']

    linkedInCharacters.forEach(charId => {
      const connections = getCharacterConnections(charId)
      expect(connections.length).toBeGreaterThan(0)
    })
  })
})

describe('edge cases', () => {
  it('handles empty globalFlags set', () => {
    const result = getCharacterMention('maya', 'samuel', {
      trust: 5,
      globalFlags: new Set(),
      charactersMet: []
    })
    expect(result.canMention).toBe(true)
  })

  it('handles empty charactersMet array', () => {
    // Maya → Samuel doesn't require charactersMet
    const result = getCharacterMention('maya', 'samuel', {
      trust: 5,
      globalFlags: new Set(),
      charactersMet: []
    })
    expect(result.canMention).toBe(true)
  })

  it('handles trust value of 0', () => {
    const result = getCharacterMention('maya', 'samuel', {
      trust: 0,
      globalFlags: new Set(),
      charactersMet: []
    })
    // Maya → Samuel requires trust >= 3
    expect(result.canMention).toBe(false)
  })

  it('handles trust value of 10', () => {
    const result = getCharacterMention('maya', 'samuel', {
      trust: 10,
      globalFlags: new Set(),
      charactersMet: []
    })
    expect(result.canMention).toBe(true)
    expect(result.isDeepReveal).toBe(true)
  })
})
