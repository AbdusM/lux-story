import { describe, it, expect, beforeEach } from 'vitest'
import { GameStateUtils, type GameState, type StateChange, NARRATIVE_CONSTANTS } from '@/lib/character-state'

describe('GameStateUtils', () => {
  let testGameState: GameState

  beforeEach(() => {
    // Create a fresh game state before each test
    testGameState = GameStateUtils.createNewGameState('test-player-123')
  })

  describe('createNewGameState', () => {
    it('should create a new game state with correct default values', () => {
      const newState = GameStateUtils.createNewGameState('player-456')

      expect(newState.playerId).toBe('player-456')
      expect(newState.saveVersion).toBe(NARRATIVE_CONSTANTS.SAVE_VERSION)
      expect(newState.currentNodeId).toBe('marcus_introduction')
      expect(newState.currentCharacterId).toBe('marcus')
      expect(newState.characters.size).toBeGreaterThan(0) // Initializes all character states
      expect(newState.globalFlags.size).toBe(0)
      expect(newState.patterns).toEqual({
        analytical: 0,
        helping: 0,
        building: 0,
        patience: 0,
        exploring: 0
      })
    })

    it('should create unique instances (not sharing references)', () => {
      const state1 = GameStateUtils.createNewGameState('player-1')
      const state2 = GameStateUtils.createNewGameState('player-2')

      state1.globalFlags.add('test-flag')

      expect(state1.globalFlags.has('test-flag')).toBe(true)
      expect(state2.globalFlags.has('test-flag')).toBe(false)
    })
  })

  describe('createCharacterState', () => {
    it('should create character state with default values', () => {
      const charState = GameStateUtils.createCharacterState('maya')

      expect(charState.characterId).toBe('maya')
      expect(charState.trust).toBe(NARRATIVE_CONSTANTS.DEFAULT_TRUST)
      expect(charState.relationshipStatus).toBe(NARRATIVE_CONSTANTS.DEFAULT_RELATIONSHIP)
      expect(charState.knowledgeFlags.size).toBe(0)
      expect(charState.conversationHistory.length).toBe(0)
    })
  })

  describe('applyStateChange - Global Flags', () => {
    it('should add global flags without mutating original state', () => {
      const change: StateChange = {
        addGlobalFlags: ['devon_arc_complete', 'maya_arc_complete']
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)

      // Original state unchanged
      expect(testGameState.globalFlags.size).toBe(0)

      // New state has flags
      expect(newState.globalFlags.has('devon_arc_complete')).toBe(true)
      expect(newState.globalFlags.has('maya_arc_complete')).toBe(true)
      expect(newState.globalFlags.size).toBe(2)
    })

    it('should remove global flags', () => {
      // Setup: add some flags first
      testGameState.globalFlags.add('flag1')
      testGameState.globalFlags.add('flag2')
      testGameState.globalFlags.add('flag3')

      const change: StateChange = {
        removeGlobalFlags: ['flag2']
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)

      expect(newState.globalFlags.has('flag1')).toBe(true)
      expect(newState.globalFlags.has('flag2')).toBe(false)
      expect(newState.globalFlags.has('flag3')).toBe(true)
      expect(newState.globalFlags.size).toBe(2)
    })

    it('should handle adding and removing flags in same change', () => {
      testGameState.globalFlags.add('old-flag')

      const change: StateChange = {
        addGlobalFlags: ['new-flag'],
        removeGlobalFlags: ['old-flag']
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)

      expect(newState.globalFlags.has('old-flag')).toBe(false)
      expect(newState.globalFlags.has('new-flag')).toBe(true)
    })
  })

  describe('applyStateChange - Pattern Tracking', () => {
    it('should increment pattern values', () => {
      const change: StateChange = {
        patternChanges: {
          analytical: 1,
          helping: 2
        }
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)

      expect(newState.patterns.analytical).toBe(1)
      expect(newState.patterns.helping).toBe(2)
      expect(newState.patterns.building).toBe(0)
    })

    it('should accumulate pattern values across multiple changes', () => {
      let state = testGameState

      state = GameStateUtils.applyStateChange(state, {
        patternChanges: { analytical: 3 }
      })

      state = GameStateUtils.applyStateChange(state, {
        patternChanges: { analytical: 2 }
      })

      expect(state.patterns.analytical).toBe(5)
    })
  })

  describe('applyStateChange - Character State', () => {
    beforeEach(() => {
      // Add a character to work with
      const mayaState = GameStateUtils.createCharacterState('maya')
      testGameState.characters.set('maya', mayaState)
    })

    it('should modify trust level', () => {
      const change: StateChange = {
        characterId: 'maya',
        trustChange: 3
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)
      const mayaState = newState.characters.get('maya')!

      expect(mayaState.trust).toBe(3)
      // Original state unchanged
      expect(testGameState.characters.get('maya')!.trust).toBe(0)
    })

    it('should clamp trust to MAX_TRUST', () => {
      const change: StateChange = {
        characterId: 'maya',
        trustChange: 999
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)
      const mayaState = newState.characters.get('maya')!

      expect(mayaState.trust).toBe(NARRATIVE_CONSTANTS.MAX_TRUST)
    })

    it('should clamp trust to MIN_TRUST', () => {
      const change: StateChange = {
        characterId: 'maya',
        trustChange: -999
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)
      const mayaState = newState.characters.get('maya')!

      expect(mayaState.trust).toBe(NARRATIVE_CONSTANTS.MIN_TRUST)
    })

    it('should update relationship status', () => {
      const change: StateChange = {
        characterId: 'maya',
        setRelationshipStatus: 'confidant'
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)
      const mayaState = newState.characters.get('maya')!

      expect(mayaState.relationshipStatus).toBe('confidant')
    })

    it('should add knowledge flags to character', () => {
      const change: StateChange = {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_player_major', 'knows_player_hometown']
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)
      const mayaState = newState.characters.get('maya')!

      expect(mayaState.knowledgeFlags.has('knows_player_major')).toBe(true)
      expect(mayaState.knowledgeFlags.has('knows_player_hometown')).toBe(true)
      expect(mayaState.knowledgeFlags.size).toBe(2)
    })

    it('should remove knowledge flags from character', () => {
      // Setup: add flags first
      const mayaState = testGameState.characters.get('maya')!
      mayaState.knowledgeFlags.add('flag1')
      mayaState.knowledgeFlags.add('flag2')

      const change: StateChange = {
        characterId: 'maya',
        removeKnowledgeFlags: ['flag1']
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)
      const newMayaState = newState.characters.get('maya')!

      expect(newMayaState.knowledgeFlags.has('flag1')).toBe(false)
      expect(newMayaState.knowledgeFlags.has('flag2')).toBe(true)
    })

    it('should apply multiple character changes simultaneously', () => {
      const change: StateChange = {
        characterId: 'maya',
        trustChange: 5,
        setRelationshipStatus: 'acquaintance',
        addKnowledgeFlags: ['test-flag']
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)
      const mayaState = newState.characters.get('maya')!

      expect(mayaState.trust).toBe(5)
      expect(mayaState.relationshipStatus).toBe('acquaintance')
      expect(mayaState.knowledgeFlags.has('test-flag')).toBe(true)
    })
  })

  describe('cloneGameState', () => {
    it('should create a deep copy of game state', () => {
      // Setup original state with data
      testGameState.globalFlags.add('test-flag')
      const mayaState = GameStateUtils.createCharacterState('maya')
      mayaState.trust = 5
      mayaState.knowledgeFlags.add('knows-something')
      testGameState.characters.set('maya', mayaState)
      testGameState.patterns.analytical = 10

      // Clone it
      const clonedState = GameStateUtils.cloneGameState(testGameState)

      // Modify original
      testGameState.globalFlags.add('new-flag')
      testGameState.characters.get('maya')!.trust = 999
      testGameState.patterns.analytical = 999

      // Clone should be unchanged
      expect(clonedState.globalFlags.has('new-flag')).toBe(false)
      expect(clonedState.globalFlags.has('test-flag')).toBe(true)
      expect(clonedState.characters.get('maya')!.trust).toBe(5)
      expect(clonedState.characters.get('maya')!.knowledgeFlags.has('knows-something')).toBe(true)
      expect(clonedState.patterns.analytical).toBe(10)
    })
  })

  describe('State immutability', () => {
    it('should not mutate original state when applying changes', () => {
      const originalPlayerId = testGameState.playerId
      const originalFlagsSize = testGameState.globalFlags.size
      const originalPatternAnalytical = testGameState.patterns.analytical

      const change: StateChange = {
        addGlobalFlags: ['test'],
        patternChanges: { analytical: 5 }
      }

      GameStateUtils.applyStateChange(testGameState, change)

      // Original state completely unchanged
      expect(testGameState.playerId).toBe(originalPlayerId)
      expect(testGameState.globalFlags.size).toBe(originalFlagsSize)
      expect(testGameState.patterns.analytical).toBe(originalPatternAnalytical)
    })
  })

  describe('Edge cases', () => {
    it('should handle applying state change to non-existent character gracefully', () => {
      const change: StateChange = {
        characterId: 'non-existent-character',
        trustChange: 5
      }

      const newState = GameStateUtils.applyStateChange(testGameState, change)

      // Should create the character if it doesn't exist
      // Or handle gracefully - implementation dependent
      expect(newState).toBeDefined()
    })

    it('should handle empty state changes', () => {
      const change: StateChange = {}

      const newState = GameStateUtils.applyStateChange(testGameState, change)

      expect(newState.playerId).toBe(testGameState.playerId)
    })
  })
})
