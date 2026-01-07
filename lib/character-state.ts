import { findCharacterForNode, isValidCharacterId } from './graph-registry'
import { ActiveThought, THOUGHT_REGISTRY } from '@/content/thoughts'
import { calculateResonantTrustChange } from './pattern-affinity'
import { PatternType, isValidPattern } from './patterns'
import { INITIAL_TRUST, TRUST_THRESHOLDS, NARRATIVE_CONSTANTS as GLOBAL_NARRATIVE_CONSTANTS } from './constants'
import { NervousSystemState, determineNervousSystemState, ChemicalReaction } from './emotions'
import { calculateReaction } from './chemistry'
import { ArchivistState } from './lore-system'
import { type TrustMomentum, createTrustMomentum, updateTrustMomentum, applyMomentumToTrustChange } from './trust-derivatives'
import { type IcebergState, createIcebergState } from './knowledge-derivatives'

/**
 * Core character relationship state
 * Tracks everything we know about a character's relationship with the player
 */
export interface CharacterState {
  characterId: string
  trust: number // 0-10 scale, affects available dialogue options
  anxiety: number // 0-100 scale. 0=Calm, 100=Panic.
  nervousSystemState: NervousSystemState // Derived biological state
  lastReaction: ChemicalReaction | null // ISP: The Chemistry Engine result (Visual feedback)
  knowledgeFlags: Set<string> // What this character knows about the player
  relationshipStatus: 'stranger' | 'acquaintance' | 'confidant'
  conversationHistory: string[] // Node IDs visited with this character
  visitedPatternUnlocks?: Set<string> // Pattern-unlocked nodes already visited
  /** D-001: Timestamp of last interaction for pattern-influenced trust decay */
  lastInteractionTimestamp?: number
  /** D-082: Trust momentum - accelerates/decelerates trust changes based on history */
  trustMomentum?: TrustMomentum
}

/**
 * Platform state - tracking the status of different platforms
 */
export interface PlatformState {
  id: string
  warmth: number        // -5 to 5, affects visual and accessibility
  accessible: boolean   // Can player access this platform
  discovered: boolean   // Has player found this platform
  resonance: number    // 0-10, how aligned with player patterns
}

/**
 * Career values - deeper motivational tracking
 */
export interface CareerValues {
  directImpact: number     // Helping people directly, immediate service
  systemsThinking: number  // Optimizing how things work, process improvement
  dataInsights: number     // Finding patterns, security, research
  futureBuilding: number   // Emerging fields, growth sectors, innovation
  independence: number     // Creating new approaches, hybrid careers
}

/**
 * Mystery states - tracking narrative investigations
 */
export interface MysteryState {
  letterSender: 'unknown' | 'investigating' | 'trusted' | 'rejected' | 'samuel_knows' | 'self_revealed'
  platformSeven: 'stable' | 'flickering' | 'error' | 'denied' | 'revealed'
  samuelsPast: 'hidden' | 'hinted' | 'revealed'
  stationNature: 'unknown' | 'sensing' | 'understanding' | 'mastered'
}

/**
 * Time state - tracking temporal flow
 */
export interface TimeState {
  currentDisplay: string     // Current time display string
  minutesRemaining: number     // Minutes until midnight
  flowRate: number       // Time flow rate (1.0 normal, <1 slower, 0 stopped)
  isStopped: boolean    // Quiet Hour active
}

/**
 * Quiet Hour state - special temporal events
 */
export interface QuietHourState {
  potential: boolean  // Can trigger
  experienced: string[]  // Which quiet hours seen
  triggeredBy?: string  // What caused current quiet hour
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
  currentCharacterId: 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'alex' | 'rohan' | 'silas' | 'elena' | 'grace' | 'asha' | 'lira' | 'zara' | 'station_entry' | 'grand_hall' | 'market' | 'deep_station'
  thoughts: ActiveThought[]
  episodeNumber: number  // Track which episode the player is on
  sessionStartTime: number  // When current session started (for episode timer)
  sessionBoundariesCrossed: number  // Simple counter for session boundaries (used for announcement variety)

  // Grand Central Migration Fields
  platforms: Record<string, PlatformState>
  careerValues: CareerValues
  mysteries: MysteryState
  time: TimeState
  quietHour: QuietHourState
  overdensity: number // 0.0 - 1.0 (Market Crowd Simulation)
  items: {
    letter: 'kept' | 'torn' | 'shown' | 'burned'
    safeSpot?: string
    discoveredPaths: string[]
  }

  // Character Check-In System (P1)
  pendingCheckIns: PendingCheckIn[]

  // Orb Capabilities (P0)
  unlockedAbilities: string[] // Array of AbilityId

  // Phase 1 Foundation: The Loremaster's Index
  archivistState: ArchivistState

  // D-019: Iceberg References - casual mentions become investigable topics
  icebergState?: IcebergState
}

/**
 * Check-In State
 * Tracks characters waiting to revisit the player after an arc
 */
export interface PendingCheckIn {
  characterId: string
  sessionsRemaining: number // 0 = Ready to talk
  dialogueNodeId: string    // Where the conversation starts
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
  internalizeThought?: boolean // If true and thoughtId is set, internalize the thought (identity system)

  // Mystery progression
  mysteryChanges?: Partial<MysteryState>
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
    anxiety: number
    nervousSystemState: NervousSystemState
    lastReaction: ChemicalReaction | null
    knowledgeFlags: string[]
    relationshipStatus: 'stranger' | 'acquaintance' | 'confidant'
    conversationHistory: string[]
  }>
  globalFlags: string[]
  patterns: PlayerPatterns
  lastSaved: number
  currentNodeId: string
  currentCharacterId: 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'alex' | 'rohan' | 'silas' | 'elena' | 'grace' | 'asha' | 'lira' | 'zara' | 'station_entry' | 'grand_hall' | 'market' | 'deep_station'
  thoughts: ActiveThought[]
  episodeNumber: number
  sessionStartTime: number
  sessionBoundariesCrossed: number
  platforms: Record<string, PlatformState>
  careerValues: CareerValues
  mysteries: MysteryState
  time: TimeState
  quietHour: QuietHourState
  overdensity: number
  items: {
    letter: 'kept' | 'torn' | 'shown' | 'burned'
    safeSpot?: string
    discoveredPaths: string[]
  }
  pendingCheckIns: PendingCheckIn[]
  unlockedAbilities: string[]
  archivistState: {
    collectedRecords: string[]
    verifiedLore: string[]
    sensoryCalibration: Record<string, number>
  }
  // D-019: Serializable iceberg state
  icebergState?: {
    references: Array<{
      id: string
      topic: string
      description: string
      mentionThreshold: number
      investigationNodeId: string
      mentions: Array<{
        characterId: string
        nodeId: string
        mentionText: string
        timestamp: number
      }>
    }>
    investigatedTopics: string[]
  }
}



/**
 * Constants for the narrative system
 * Uses centralized values from lib/constants.ts
 */
export const NARRATIVE_CONSTANTS = {
  ...GLOBAL_NARRATIVE_CONSTANTS,
  DEFAULT_TRUST: INITIAL_TRUST,
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
    // Validate character ID if provided
    if (change.characterId && !isValidCharacterId(change.characterId)) {
      console.error(`[Validation] Invalid characterId: ${change.characterId}`)
      return gameState // Return unchanged
    }

    // Validate pattern changes
    if (change.patternChanges) {
      for (const pattern of Object.keys(change.patternChanges)) {
        if (!isValidPattern(pattern)) {
          console.warn(`[Validation] Invalid pattern "${pattern}" in patternChanges, skipping`)
          delete change.patternChanges[pattern as keyof typeof change.patternChanges]
        }
      }
    }

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
      const existingThoughtIndex = newState.thoughts.findIndex(t => t.id === change.thoughtId)

      if (change.internalizeThought) {
        // Identity internalization - mark as internalized immediately
        if (existingThoughtIndex >= 0) {
          // Update existing thought to internalized
          newState.thoughts[existingThoughtIndex] = {
            ...newState.thoughts[existingThoughtIndex],
            status: 'internalized',
            progress: 100,
            lastUpdated: Date.now()
          }
        } else if (registry) {
          // Add as already internalized
          newState.thoughts.push({
            ...registry,
            status: 'internalized',
            progress: 100,
            addedAt: Date.now(),
            lastUpdated: Date.now()
          })
        }
      } else {
        // Normal thought trigger - add as developing
        if (registry && existingThoughtIndex < 0) {
          newState.thoughts.push({
            ...registry,
            status: 'developing',
            progress: 0,
            addedAt: Date.now(),
            lastUpdated: Date.now()
          })
        }
      }
    }

    // Apply character-specific changes
    if (change.characterId) {
      const charState = newState.characters.get(change.characterId)
      if (!charState) {
        console.error(`Character ${change.characterId} not found in state`)
        return newState
      }

      // Trust changes with pattern-character resonance
      if (change.trustChange !== undefined) {
        const _oldTrust = charState.trust

        // Calculate resonant trust change based on player's pattern affinity
        // This makes certain characters connect better with certain play styles
        const { modifiedTrust, resonanceTriggered: _resonanceTriggered, resonanceDescription: _resonanceDescription } =
          calculateResonantTrustChange(
            change.trustChange,
            change.characterId,
            newState.patterns as Record<PatternType, number>,
            change.patternChanges
              ? (Object.keys(change.patternChanges)[0] as PatternType)
              : undefined
          )

        // D-082: Apply trust momentum (accelerates/decelerates changes based on history)
        // Initialize momentum if not present
        if (!charState.trustMomentum) {
          charState.trustMomentum = createTrustMomentum(change.characterId)
        }
        const momentumAdjustedTrust = applyMomentumToTrustChange(modifiedTrust, charState.trustMomentum)
        charState.trustMomentum = updateTrustMomentum(charState.trustMomentum, modifiedTrust)

        charState.trust = Math.max(
          NARRATIVE_CONSTANTS.MIN_TRUST,
          Math.min(NARRATIVE_CONSTANTS.MAX_TRUST, charState.trust + momentumAdjustedTrust)
        )

        // Limbic System Update: Recalculate biological state
        // Higher trust buffers anxiety. For now, anxiety inversely mirrors trust unless explicitly set.
        // ISP UPDATE: Added skill context (patterns) to the calculation "Neuro-Link"
        charState.anxiety = (10 - charState.trust) * 10

        charState.nervousSystemState = determineNervousSystemState(
          charState.anxiety,
          charState.trust,
          newState.patterns as unknown as Record<string, number>, // The "Neuro-Link": Patterns -> Skills -> Biology
          newState.globalFlags // The "Simulation Effect": Golden Prompts -> Biology
        )

        // ISP UPDATE: The Chemistry Engine
        // Calculate dynamic reaction based on new state + skills
        charState.lastReaction = calculateReaction(
          charState.nervousSystemState,
          newState.patterns as unknown as Record<string, number>,
          charState.trust
        )

        // ISP UPDATE: Telemetry Feed (CEO Dashboard)
        // Emit the bio-state change immediately
        if (typeof window !== 'undefined') {
          import('@/lib/telemetry/dashboard-feed').then(({ dashboard }) => {
            dashboard.emit('BIO_STATE_CHANGE', {
              characterId: change.characterId,
              state: charState.nervousSystemState,
              reaction: charState.lastReaction, // Telemetry now sees the "Chemical Reaction"
              trust: charState.trust,
              anxiety: charState.anxiety
            }, newState)
          })
        }

        // Log resonance for debugging (can be used for consequence echoes later)
        // if (resonanceTriggered && resonanceDescription) {
        //   console.log(`[Resonance] ${change.characterId}: ${resonanceDescription}`)
        // }

        // Auto-update relationship status based on trust level
        // Only if not explicitly set in this change
        if (!change.setRelationshipStatus) {
          const newTrust = charState.trust
          if (newTrust >= TRUST_THRESHOLDS.close) {
            charState.relationshipStatus = 'confidant'
          } else if (newTrust >= TRUST_THRESHOLDS.friendly) {
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

    // Apply mystery state changes
    if (change.mysteryChanges) {
      newState.mysteries = {
        ...newState.mysteries,
        ...change.mysteryChanges
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
            anxiety: char.anxiety,
            nervousSystemState: char.nervousSystemState,
            lastReaction: char.lastReaction,
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
      thoughts: [...state.thoughts],
      episodeNumber: state.episodeNumber,
      sessionStartTime: state.sessionStartTime,
      sessionBoundariesCrossed: state.sessionBoundariesCrossed,
      platforms: { ...state.platforms },
      careerValues: { ...state.careerValues },
      mysteries: { ...state.mysteries },
      time: { ...state.time },
      quietHour: { ...state.quietHour },
      overdensity: state.overdensity,
      items: { ...state.items },
      pendingCheckIns: [...state.pendingCheckIns],
      unlockedAbilities: [...state.unlockedAbilities],
      archivistState: {
        collectedRecords: new Set(state.archivistState.collectedRecords),
        verifiedLore: new Set(state.archivistState.verifiedLore),
        sensoryCalibration: { ...state.archivistState.sensoryCalibration }
      },
      // D-019: Clone iceberg state if present
      icebergState: state.icebergState ? {
        references: new Map(
          Array.from(state.icebergState.references.entries()).map(([id, ref]) => [
            id,
            { ...ref, mentions: [...ref.mentions] }
          ])
        ),
        investigatedTopics: new Set(state.icebergState.investigatedTopics)
      } : undefined
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
        ['alex', this.createCharacterState('alex')],
        ['rohan', this.createCharacterState('rohan')],
        ['silas', this.createCharacterState('silas')],
        ['elena', this.createCharacterState('elena')],
        ['grace', this.createCharacterState('grace')],
        ['asha', this.createCharacterState('asha')],
        ['lira', this.createCharacterState('lira')],
        ['zara', this.createCharacterState('zara')],
        ['station_entry', this.createCharacterState('station_entry')],
        ['grand_hall', this.createCharacterState('grand_hall')],
        ['market', this.createCharacterState('market')],
        ['deep_station', this.createCharacterState('deep_station')]
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
      thoughts: [],
      episodeNumber: 1,  // Start at episode 1
      sessionStartTime: Date.now(),  // Track when session started
      sessionBoundariesCrossed: 0,  // Start with no boundaries crossed

      // Initial Grand Central State
      platforms: {
        p1: { id: 'p1', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p3: { id: 'p3', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p7: { id: 'p7', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p9: { id: 'p9', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        forgotten: { id: 'forgotten', warmth: 0, accessible: false, discovered: false, resonance: 0 }
      },
      careerValues: {
        directImpact: 0,
        systemsThinking: 0,
        dataInsights: 0,
        futureBuilding: 0,
        independence: 0
      },
      mysteries: {
        letterSender: 'unknown',
        platformSeven: 'flickering',
        samuelsPast: 'hidden',
        stationNature: 'unknown'
      },
      time: {
        currentDisplay: "11:47 PM",
        minutesRemaining: 13,
        flowRate: 1.0,
        isStopped: false
      },
      quietHour: {
        potential: false,
        experienced: []
      },
      overdensity: 0.3,
      items: {
        letter: 'kept',
        discoveredPaths: []
      },
      pendingCheckIns: [],
      unlockedAbilities: [],
      archivistState: {
        collectedRecords: new Set(),
        verifiedLore: new Set(),
        sensoryCalibration: {
          engineers: 0,
          syn_bio: 0,
          data_flow: 0,
          station_core: 0
        }
      },
      // D-019: Initialize iceberg reference tracking
      icebergState: createIcebergState()
    }
  }

  /**
   * Create initial character state
   */
  static createCharacterState(characterId: string): CharacterState {
    return {
      characterId,
      trust: NARRATIVE_CONSTANTS.DEFAULT_TRUST,
      anxiety: (10 - NARRATIVE_CONSTANTS.DEFAULT_TRUST) * 10,
      nervousSystemState: determineNervousSystemState(
        (10 - NARRATIVE_CONSTANTS.DEFAULT_TRUST) * 10,
        NARRATIVE_CONSTANTS.DEFAULT_TRUST,
        {} // No patterns for initial state
      ),
      lastReaction: null,
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
        anxiety: char.anxiety,
        nervousSystemState: char.nervousSystemState,
        lastReaction: char.lastReaction,
        knowledgeFlags: Array.from(char.knowledgeFlags),
        relationshipStatus: char.relationshipStatus,
        conversationHistory: char.conversationHistory
      })),
      globalFlags: Array.from(state.globalFlags),
      patterns: state.patterns,
      lastSaved: state.lastSaved,
      currentNodeId: state.currentNodeId,
      currentCharacterId: state.currentCharacterId,
      thoughts: state.thoughts,
      episodeNumber: state.episodeNumber,
      sessionStartTime: state.sessionStartTime,
      sessionBoundariesCrossed: state.sessionBoundariesCrossed,
      platforms: state.platforms,
      careerValues: state.careerValues,
      mysteries: state.mysteries,
      time: state.time,
      quietHour: state.quietHour,
      overdensity: state.overdensity,
      items: state.items,
      pendingCheckIns: state.pendingCheckIns,
      unlockedAbilities: state.unlockedAbilities,
      archivistState: {
        collectedRecords: Array.from(state.archivistState.collectedRecords),
        verifiedLore: Array.from(state.archivistState.verifiedLore),
        sensoryCalibration: state.archivistState.sensoryCalibration
      },
      // D-019: Serialize iceberg state if present
      icebergState: state.icebergState ? {
        references: Array.from(state.icebergState.references.values()),
        investigatedTopics: Array.from(state.icebergState.investigatedTopics)
      } : undefined
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
            anxiety: char.anxiety ?? (10 - char.trust) * 10,
            // ISP UPDATE: Added empty pattern object fallback; deserialization occurs before pattern load usually, 
            // but for safety we default to empty. Realtime updates will correct this.
            nervousSystemState: char.nervousSystemState ?? determineNervousSystemState(
              (10 - char.trust) * 10,
              char.trust,
              serialized.patterns as unknown as Record<string, number>,
              new Set(serialized.globalFlags) // Re-apply simulation effects on load
            ),
            lastReaction: char.lastReaction || null,
            knowledgeFlags: new Set(char.knowledgeFlags)
          }
        ])
      ),
      globalFlags: new Set(serialized.globalFlags),
      patterns: serialized.patterns,
      lastSaved: serialized.lastSaved,
      currentNodeId: serialized.currentNodeId,
      currentCharacterId: serialized.currentCharacterId,
      thoughts: serialized.thoughts || [],
      episodeNumber: serialized.episodeNumber || 1,  // Default to episode 1 for old saves
      sessionStartTime: serialized.sessionStartTime || Date.now(),  // Default to now for old saves
      sessionBoundariesCrossed: serialized.sessionBoundariesCrossed || 0,  // Default to 0 for old saves

      // Defaults for migration
      platforms: serialized.platforms || {
        p1: { id: 'p1', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p3: { id: 'p3', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p7: { id: 'p7', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p9: { id: 'p9', warmth: 0, accessible: true, discovered: false, resonance: 0 },
        forgotten: { id: 'forgotten', warmth: 0, accessible: false, discovered: false, resonance: 0 }
      },
      careerValues: serialized.careerValues || {
        directImpact: 0,
        systemsThinking: 0,
        dataInsights: 0,
        futureBuilding: 0,
        independence: 0
      },
      mysteries: serialized.mysteries || {
        letterSender: 'unknown',
        platformSeven: 'flickering',
        samuelsPast: 'hidden',
        stationNature: 'unknown'
      },
      time: serialized.time || {
        currentDisplay: "11:47 PM",
        minutesRemaining: 13,
        flowRate: 1.0,
        isStopped: false
      },
      quietHour: serialized.quietHour || {
        potential: false,
        experienced: []
      },
      overdensity: serialized.overdensity ?? 0.3,
      items: serialized.items || {
        letter: 'kept',
        discoveredPaths: []
      },
      pendingCheckIns: serialized.pendingCheckIns || [],
      unlockedAbilities: serialized.unlockedAbilities || [],
      archivistState: {
        collectedRecords: new Set(serialized.archivistState?.collectedRecords || []),
        verifiedLore: new Set(serialized.archivistState?.verifiedLore || []),
        sensoryCalibration: serialized.archivistState?.sensoryCalibration || {
          engineers: 0,
          syn_bio: 0,
          data_flow: 0,
          station_core: 0
        }
      },
      // D-019: Deserialize iceberg state if present, otherwise initialize fresh
      icebergState: serialized.icebergState ? {
        references: new Map(
          serialized.icebergState.references.map(ref => [ref.id, ref])
        ),
        investigatedTopics: new Set(serialized.icebergState.investigatedTopics)
      } : createIcebergState()
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
      thoughts: [],
      episodeNumber: 1,
      sessionStartTime: Date.now(),
      sessionBoundariesCrossed: 0,
      platforms: {},
      careerValues: {
        directImpact: 0,
        systemsThinking: 0,
        dataInsights: 0,
        futureBuilding: 0,
        independence: 0
      },
      mysteries: {
        letterSender: 'unknown',
        platformSeven: 'flickering',
        samuelsPast: 'hidden',
        stationNature: 'unknown'
      },
      time: {
        currentDisplay: "12:00 PM",
        minutesRemaining: 10,
        flowRate: 1,
        isStopped: false
      },
      quietHour: { potential: false, experienced: [] },
      overdensity: 0.3,
      items: { letter: 'kept', discoveredPaths: [] },

      pendingCheckIns: [],
      unlockedAbilities: [],
      archivistState: {
        collectedRecords: new Set(),
        verifiedLore: new Set(),
        sensoryCalibration: {
          engineers: 0,
          syn_bio: 0,
          data_flow: 0,
          station_core: 0
        }
      }
    } as GameState
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