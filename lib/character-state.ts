import { findCharacterForNode } from './graph-registry'
import { ActiveThought, THOUGHT_REGISTRY } from '@/content/thoughts'

/**
 * Core character relationship state
 * Tracks everything we know about a character's relationship with the player
 */
export interface CharacterState {
  characterId: string
  trust: number // 0-10 scale, affects available dialogue options
  knowledgeFlags: Set<string> // What this character knows about the player
  relationshipStatus: 'stranger' | 'acquaintance' | 'confidant'
  conversationHistory: string[] // Node IDs visited with this character
}

/**
 * Master game state - the source of truth for everything
 * This is what we save, load, and query for all narrative decisions
 */
export interface GameState {
  saveVersion: string // For future migration compatibility
  playerId: string
  characters: Map<string, CharacterState>
  globalFlags: Set<string> // World state flags
  patterns: PlayerPatterns // Pattern tracking for final revelation
  lastSaved: number
  currentNodeId: string // Current position in dialogue graph
  currentCharacterId: 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'rohan' | 'silas' // Current character being talked to
  thoughts: ActiveThought[]
}

/**
 * Player behavior patterns - tracked silently for end revelation
 * NOT used for NPC responses (that's what CharacterState is for)
 */
export interface PlayerPatterns {
  analytical: number    // Logic-based, data-driven choices
  helping: number      // People-focused, supportive choices
  building: number     // Creative, hands-on choices
  patience: number     // Thoughtful, long-term choices
  exploring: number    // Curious, discovery-oriented choices
}

/**
 * Conditions that must be met to show content or choices
 * The heart of our conditional narrative system
 */
export interface StateCondition {
  // Character-specific conditions
  trust?: {
    min?: number
    max?: number
  }
  relationship?: ('stranger' | 'acquaintance' | 'confidant')[]
  hasKnowledgeFlags?: string[] // Character must know these things
  lacksKnowledgeFlags?: string[] // Character must NOT know these things

  // Global conditions
  hasGlobalFlags?: string[]
  lacksGlobalFlags?: string[]

  // Pattern conditions (for special branches)
  patterns?: {
    [K in keyof PlayerPatterns]?: {
      min?: number
      max?: number
    }
  }
}

/**
 * Changes to apply when player makes a choice or enters a node
 * EXPLICIT SYSTEM: All changes must be deliberately declared
 */
export interface StateChange {
  // Character-specific changes (requires characterId)
  characterId?: string
  trustChange?: number
  setRelationshipStatus?: 'stranger' | 'acquaintance' | 'confidant' // EXPLICIT, not automatic
  addKnowledgeFlags?: string[]
  removeKnowledgeFlags?: string[]

  // Global changes
  addGlobalFlags?: string[]
  removeGlobalFlags?: string[]

  // Pattern changes
  patternChanges?: Partial<PlayerPatterns>

  // Thought Cabinet
  thoughtId?: string
}

/**
 * Serializable version of GameState for localStorage
 * Converts Sets and Maps to arrays for JSON compatibility
 */
export interface SerializableGameState {
  saveVersion: string
  playerId: string
  characters: Array<{
    characterId: string
    trust: number
    knowledgeFlags: string[]
    relationshipStatus: 'stranger' | 'acquaintance' | 'confidant'
    conversationHistory: string[]
  }>
  globalFlags: string[]
  patterns: PlayerPatterns
  lastSaved: number
  currentNodeId: string
  currentCharacterId: 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'rohan' | 'silas'
  thoughts: ActiveThought[]
}

/**
 * Constants for the narrative system
 */
export const NARRATIVE_CONSTANTS = {
  MAX_TRUST: 10,
  MIN_TRUST: 0,
  DEFAULT_TRUST: 0,
  DEFAULT_RELATIONSHIP: 'stranger' as const,
  SAVE_VERSION: '1.0.0'
} as const

/**
 * Game state utility functions
 * All state modifications go through here for consistency
 */
export class GameStateUtils {
  /**
   * Apply a state change to the entire game state
   * Returns a new GameState object (immutable pattern)
   */
  static applyStateChange(gameState: GameState, change: StateChange): GameState {
    // Deep clone the game state
    const newState = this.cloneGameState(gameState)

    // Apply global flag changes
    if (change.addGlobalFlags) {
      change.addGlobalFlags.forEach(flag => newState.globalFlags.add(flag))
    }
    if (change.removeGlobalFlags) {
      change.removeGlobalFlags.forEach(flag => newState.globalFlags.delete(flag))
    }

    // Apply pattern changes
    if (change.patternChanges) {
      Object.entries(change.patternChanges).forEach(([pattern, value]) => {
        if (value !== undefined) {
          newState.patterns[pattern as keyof PlayerPatterns] += value
        }
      })
    }

    // Handle Thought Triggers (Direct State Mutation)
    if (change.thoughtId) {
      const registry = THOUGHT_REGISTRY[change.thoughtId]
      // Only add if it doesn't exist
      if (registry && !newState.thoughts.some(t => t.id === change.thoughtId)) {
        newState.thoughts.push({
          ...registry,
          status: 'developing',
          progress: 0,
          addedAt: Date.now(),
          lastUpdated: Date.now()
        })
      }
    }

    // Apply character-specific changes
    if (change.characterId) {
      const charState = newState.characters.get(change.characterId)
      if (!charState) {
        console.error(`Character ${change.characterId} not found in state`)
        return newState
      }

      // Trust changes
      if (change.trustChange !== undefined) {
        const _oldTrust = charState.trust
        charState.trust = Math.max(
          NARRATIVE_CONSTANTS.MIN_TRUST,
          Math.min(NARRATIVE_CONSTANTS.MAX_TRUST, charState.trust + change.trustChange)
        )
        
        // Auto-update relationship status based on trust level
        // Only if not explicitly set in this change
        if (!change.setRelationshipStatus) {
          const newTrust = charState.trust
          if (newTrust >= 8) {
            charState.relationshipStatus = 'confidant'
          } else if (newTrust >= 4) {
            charState.relationshipStatus = 'acquaintance'
          } else {
            charState.relationshipStatus = 'stranger'
          }
        }
      }

      // EXPLICIT relationship status change (overrides auto-update)
      if (change.setRelationshipStatus) {
        charState.relationshipStatus = change.setRelationshipStatus
      }

      // Knowledge flag changes
      if (change.addKnowledgeFlags) {
        change.addKnowledgeFlags.forEach(flag => charState.knowledgeFlags.add(flag))
      }
      if (change.removeKnowledgeFlags) {
        change.removeKnowledgeFlags.forEach(flag => charState.knowledgeFlags.delete(flag))
      }
    }

    return newState
  }

  /**
   * Deep clone a game state object
   * Necessary because of nested Maps and Sets
   */
  static cloneGameState(state: GameState): GameState {
    return {
      saveVersion: state.saveVersion,
      playerId: state.playerId,
      characters: new Map(
        Array.from(state.characters.entries()).map(([id, char]) => [
          id,
          {
            characterId: char.characterId,
            trust: char.trust,
            knowledgeFlags: new Set(char.knowledgeFlags),
            relationshipStatus: char.relationshipStatus,
            conversationHistory: [...char.conversationHistory]
          }
        ])
      ),
      globalFlags: new Set(state.globalFlags),
      patterns: { ...state.patterns },
      lastSaved: state.lastSaved,
      currentNodeId: state.currentNodeId,
      currentCharacterId: state.currentCharacterId,
      thoughts: [...state.thoughts]
    }
  }

  /**
   * Create a fresh game state for new game
   */
  static createNewGameState(playerId: string): GameState {
    return {
      saveVersion: NARRATIVE_CONSTANTS.SAVE_VERSION,
      playerId,
      characters: new Map([
        ['samuel', this.createCharacterState('samuel')],
        ['maya', this.createCharacterState('maya')],
        ['devon', this.createCharacterState('devon')],
        ['jordan', this.createCharacterState('jordan')],
        ['marcus', this.createCharacterState('marcus')],
        ['tess', this.createCharacterState('tess')],
        ['yaquin', this.createCharacterState('yaquin')],
        ['kai', this.createCharacterState('kai')],
        ['rohan', this.createCharacterState('rohan')],
        ['silas', this.createCharacterState('silas')]
      ]),
      globalFlags: new Set(),
      patterns: {
        analytical: 0,
        helping: 0,
        building: 0,
        patience: 0,
        exploring: 0
      },
      lastSaved: Date.now(),
      currentNodeId: 'station_arrival', // Start with atmospheric intro before Samuel
      currentCharacterId: 'samuel', // Game begins with the Station Keeper
      thoughts: []
    }
  }

  /**
   * Create initial character state
   */
  static createCharacterState(characterId: string): CharacterState {
    return {
      characterId,
      trust: NARRATIVE_CONSTANTS.DEFAULT_TRUST,
      knowledgeFlags: new Set(),
      relationshipStatus: NARRATIVE_CONSTANTS.DEFAULT_RELATIONSHIP,
      conversationHistory: []
    }
  }

  /**
   * Convert GameState to serializable format
   */
  static serialize(state: GameState): SerializableGameState {
    return {
      saveVersion: state.saveVersion,
      playerId: state.playerId,
      characters: Array.from(state.characters.values()).map(char => ({
        characterId: char.characterId,
        trust: char.trust,
        knowledgeFlags: Array.from(char.knowledgeFlags),
        relationshipStatus: char.relationshipStatus,
        conversationHistory: char.conversationHistory
      })),
      globalFlags: Array.from(state.globalFlags),
      patterns: state.patterns,
      lastSaved: state.lastSaved,
      currentNodeId: state.currentNodeId,
      currentCharacterId: state.currentCharacterId,
      thoughts: state.thoughts
    }
  }

  /**
   * Convert SerializableGameState back to GameState
   */
  static deserialize(serialized: SerializableGameState): GameState {
    return {
      saveVersion: serialized.saveVersion,
      playerId: serialized.playerId,
      characters: new Map(
        serialized.characters.map(char => [
          char.characterId,
          {
            ...char,
            knowledgeFlags: new Set(char.knowledgeFlags)
          }
        ])
      ),
      globalFlags: new Set(serialized.globalFlags),
      patterns: serialized.patterns,
      lastSaved: serialized.lastSaved,
      currentNodeId: serialized.currentNodeId,
      currentCharacterId: serialized.currentCharacterId,
      thoughts: serialized.thoughts || []
    }
  }
}

/**
 * Type guards for runtime validation
 */
export class StateValidation {
  // Helper: Validate number is finite and not NaN
  static isValidNumber(value: unknown): boolean {
    return typeof value === 'number' && isFinite(value) && !isNaN(value)
  }

  // Helper: Validate all pattern scores
  static hasValidPatterns(patterns: unknown): boolean {
    if (typeof patterns !== 'object' || patterns === null) return false
    const patternsObj = patterns as Record<string, unknown>
    return (
      StateValidation.isValidNumber(patternsObj.analytical) &&
      StateValidation.isValidNumber(patternsObj.helping) &&
      StateValidation.isValidNumber(patternsObj.building) &&
      StateValidation.isValidNumber(patternsObj.patience) &&
      StateValidation.isValidNumber(patternsObj.exploring)
    )
  }

  // Helper: Validate node ID existence
  static isValidNodeId(nodeId: unknown): boolean {
    if (typeof nodeId !== 'string') return false
    // Check if node exists in registry
    // We pass a minimal state because basic existence check doesn't need full state
    const minimalState: GameState = {
      saveVersion: '1.0.0',
      playerId: 'validation',
      characters: new Map(),
      globalFlags: new Set(),
      patterns: {
        analytical: 0,
        helping: 0,
        building: 0,
        patience: 0,
        exploring: 0
      },
      lastSaved: Date.now(),
      currentNodeId: '',
      currentCharacterId: 'samuel',
      thoughts: []
    }
    return !!findCharacterForNode(nodeId, minimalState)
  }

  static isValidGameState(obj: unknown): obj is GameState {
    if (typeof obj !== 'object' || obj === null) return false
    const objRecord = obj as Record<string, unknown>
    return (
      typeof objRecord.saveVersion === 'string' &&
      typeof objRecord.playerId === 'string' &&
      objRecord.characters instanceof Map &&
      objRecord.globalFlags instanceof Set &&
      StateValidation.hasValidPatterns(objRecord.patterns) &&
      StateValidation.isValidNumber(objRecord.lastSaved) &&
      StateValidation.isValidNodeId(objRecord.currentNodeId) &&
      typeof objRecord.currentCharacterId === 'string'
    )
  }

  static isValidSerializableGameState(obj: unknown): obj is SerializableGameState {
    if (typeof obj !== 'object' || obj === null) return false
    const objRecord = obj as Record<string, unknown>
    return (
      typeof objRecord.saveVersion === 'string' &&
      typeof objRecord.playerId === 'string' &&
      Array.isArray(objRecord.characters) &&
      Array.isArray(objRecord.globalFlags) &&
      StateValidation.hasValidPatterns(objRecord.patterns) &&
      StateValidation.isValidNumber(objRecord.lastSaved) &&
      StateValidation.isValidNodeId(objRecord.currentNodeId) &&
      typeof objRecord.currentCharacterId === 'string'
    )
  }
}