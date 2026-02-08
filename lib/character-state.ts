import { findCharacterForNode, isValidCharacterId, CHARACTER_IDS } from './graph-registry'
import { SerializedGameStateSchema, safeParseGameState } from './schemas/game-state-schema'
import { ActiveThought, THOUGHT_REGISTRY } from '@/content/thoughts'
import { calculateTrustChange } from './trust/trust-calculator'
import { PatternType, isValidPattern, asPatternRecord } from './patterns'
import { INITIAL_TRUST, TRUST_THRESHOLDS, NARRATIVE_CONSTANTS as GLOBAL_NARRATIVE_CONSTANTS, NEUTRAL_ANXIETY } from './constants'
import { NervousSystemState, determineNervousSystemState, ChemicalReaction } from './emotions'
import { calculateReaction } from './chemistry'
import { ArchivistState } from './lore-system'
import { type TrustMomentum, type TrustTimeline, createTrustTimeline } from './trust-derivatives'
import { type IcebergState, createIcebergState } from './knowledge-derivatives'
import { type PatternEvolutionHistory, createPatternEvolutionHistory } from './pattern-derivatives'
import { type StoryArcState, createStoryArcState } from './story-arcs'
import { SkillUsageRecord } from './assessment-derivatives'
import { type OrbBalance, type OrbType, INITIAL_ORB_BALANCE } from './orbs'

/**
 * TD-004: Orb state - integrated into GameState for atomic save/load
 */
export interface OrbState {
  balance: OrbBalance
  milestones: {
    firstOrb: boolean
    tierEmerging: boolean
    tierDeveloping: boolean
    tierFlourishing: boolean
    tierMastered: boolean
    streak3: boolean
    streak5: boolean
    streak10: boolean
  }
  lastViewed: number
  lastViewedBalance: Partial<Record<OrbType, number>>
  acknowledged: Partial<Record<string, boolean>>
}

export const INITIAL_ORB_STATE: OrbState = {
  balance: INITIAL_ORB_BALANCE,
  milestones: {
    firstOrb: false,
    tierEmerging: false,
    tierDeveloping: false,
    tierFlourishing: false,
    tierMastered: false,
    streak3: false,
    streak5: false,
    streak10: false
  },
  lastViewed: 0,
  lastViewedBalance: {},
  acknowledged: {}
}

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
  /** D-039: Trust timeline - history of trust changes for visualization */
  trustTimeline?: TrustTimeline
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
  currentCharacterId: 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'alex' | 'rohan' | 'silas' | 'elena' | 'grace' | 'asha' | 'lira' | 'zara' | 'quinn' | 'dante' | 'nadia' | 'isaiah' | 'station_entry' | 'grand_hall' | 'market' | 'deep_station'
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

  // D-040: Pattern Evolution Heatmap - tracks when/where patterns grew
  patternEvolutionHistory?: PatternEvolutionHistory

  // D-061: Story Arcs - multi-session narrative threads
  storyArcState?: StoryArcState

  // D-014: Skill Tracking (Claim 14)
  skillLevels: Record<string, number>
  skillUsage: Map<string, SkillUsageRecord>

  // TD-004: Orb economy (moved from standalone localStorage)
  orbs: OrbState
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

  // Mystery conditions (for mystery-gated content)
  mysteries?: Partial<MysteryState>

  // Skill Combo conditions (for combo-gated content)
  // Requires specific skill combos to be unlocked (see lib/skill-combos.ts)
  requiredCombos?: string[]
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

  // Platform resonance (TD-005: Career platform warmth/resonance)
  platformChanges?: {
    platformId: string
    warmthDelta?: number
    resonanceDelta?: number
    setAccessible?: boolean
  }[]
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
    // D-039: Trust timeline for visualization
    trustTimeline?: TrustTimeline
  }>
  globalFlags: string[]
  patterns: PlayerPatterns
  lastSaved: number
  currentNodeId: string
  currentCharacterId: 'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'alex' | 'rohan' | 'silas' | 'elena' | 'grace' | 'asha' | 'lira' | 'zara' | 'quinn' | 'dante' | 'nadia' | 'isaiah' | 'station_entry' | 'grand_hall' | 'market' | 'deep_station'
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
  // D-040: Serializable pattern evolution history
  patternEvolutionHistory?: PatternEvolutionHistory
  // D-061: Serializable story arc state
  storyArcState?: {
    activeArcs: string[]
    completedArcs: string[]
    chapterProgress: Array<[string, number]>
    completedChapters: string[]
  }
  // D-014: Serializable skills
  skillLevels: Record<string, number>
  skillUsage: Array<{ key: string, value: SkillUsageRecord }>

  // TD-004: Orb economy (moved from standalone localStorage)
  orbs: OrbState
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
      const oldCharState = newState.characters.get(change.characterId)
      if (!oldCharState) {
        console.error(`Character ${change.characterId} not found in state`)
        return newState
      }

      // PHASE 1: CALCULATE all new values (no mutations)
      let updatedTrust = oldCharState.trust
      let updatedAnxiety = oldCharState.anxiety
      let updatedNervousSystemState = oldCharState.nervousSystemState
      let updatedLastReaction = oldCharState.lastReaction
      let updatedRelationshipStatus = oldCharState.relationshipStatus
      let updatedTrustMomentum = oldCharState.trustMomentum
      let updatedKnowledgeFlags = oldCharState.knowledgeFlags

      // Trust changes with pattern-character resonance
      // Phase 3D: Uses consolidated trust calculator for all trust modifications
      if (change.trustChange !== undefined) {
        const trustResult = calculateTrustChange(
          oldCharState.trust,
          change.trustChange,
          {
            characterId: change.characterId,
            patterns: newState.patterns,
            choicePattern: change.patternChanges
              ? (Object.keys(change.patternChanges)[0] as PatternType)
              : undefined,
            momentum: oldCharState.trustMomentum
          }
        )

        updatedTrust = trustResult.newTrust
        updatedTrustMomentum = trustResult.updatedMomentum

        // Limbic System Update: Recalculate biological state
        updatedAnxiety = (10 - updatedTrust) * 10

        updatedNervousSystemState = determineNervousSystemState(
          updatedAnxiety,
          updatedTrust,
          asPatternRecord(newState.patterns),
          newState.globalFlags
        )

        // ISP UPDATE: The Chemistry Engine
        updatedLastReaction = calculateReaction(
          updatedNervousSystemState,
          asPatternRecord(newState.patterns),
          updatedTrust
        )

        // Auto-update relationship status based on trust level
        if (!change.setRelationshipStatus) {
          if (updatedTrust >= TRUST_THRESHOLDS.close) {
            updatedRelationshipStatus = 'confidant'
          } else if (updatedTrust >= TRUST_THRESHOLDS.friendly) {
            updatedRelationshipStatus = 'acquaintance'
          } else {
            updatedRelationshipStatus = 'stranger'
          }
        }
      }

      // EXPLICIT relationship status change (overrides auto-update)
      if (change.setRelationshipStatus) {
        updatedRelationshipStatus = change.setRelationshipStatus
      }

      // Knowledge flag changes - create new Set if needed
      if (change.addKnowledgeFlags || change.removeKnowledgeFlags) {
        updatedKnowledgeFlags = new Set(oldCharState.knowledgeFlags)
        if (change.addKnowledgeFlags) {
          change.addKnowledgeFlags.forEach(flag => updatedKnowledgeFlags.add(flag))
        }
        if (change.removeKnowledgeFlags) {
          change.removeKnowledgeFlags.forEach(flag => updatedKnowledgeFlags.delete(flag))
        }
      }

      // PHASE 2: CREATE new immutable CharacterState with all updates
      const updatedCharState: CharacterState = {
        ...oldCharState,
        trust: updatedTrust,
        anxiety: updatedAnxiety,
        nervousSystemState: updatedNervousSystemState,
        lastReaction: updatedLastReaction,
        relationshipStatus: updatedRelationshipStatus,
        trustMomentum: updatedTrustMomentum,
        knowledgeFlags: updatedKnowledgeFlags
      }

      // PHASE 3: REPLACE in Map
      newState.characters.set(change.characterId, updatedCharState)

      // Note: We intentionally do not emit any client-side "dashboard feed" telemetry here.
      // Interaction telemetry is handled via `interaction_events` (see `components/GameChoices.tsx` and
      // `app/api/user/interaction-events/route.ts`). Keeping this runtime path free of mock feeds
      // prevents accidental "fake telemetry" dependencies in production UX.
    }

    // Apply mystery state changes
    if (change.mysteryChanges) {
      newState.mysteries = {
        ...newState.mysteries,
        ...change.mysteryChanges
      }
    }

    // TD-002 NOTE:
    // We intentionally do not freeze GameState here. Many call sites treat the returned
    // state as a working copy and continue applying changes (especially in choice flow).
    // Immutability is enforced by convention + review, not runtime Object.freeze.
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
            conversationHistory: [...char.conversationHistory],
            // FIX: Clone optional properties that were missing
            visitedPatternUnlocks: char.visitedPatternUnlocks ? new Set(char.visitedPatternUnlocks) : undefined,
            lastInteractionTimestamp: char.lastInteractionTimestamp,
            trustMomentum: char.trustMomentum ? { ...char.trustMomentum } : undefined,
            // D-039: Clone trust timeline
            trustTimeline: char.trustTimeline ? {
              ...char.trustTimeline,
              points: [...char.trustTimeline.points]
            } : undefined
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
      } : undefined,
      // D-040: Clone pattern evolution history
      patternEvolutionHistory: state.patternEvolutionHistory ? {
        points: [...state.patternEvolutionHistory.points],
        patternTotals: { ...state.patternEvolutionHistory.patternTotals },
        milestones: [...state.patternEvolutionHistory.milestones]
      } : undefined,
      // D-014: Clone skills
      skillLevels: { ...state.skillLevels },
      skillUsage: new Map(state.skillUsage),
      // TD-004: Clone orbs
      orbs: {
        balance: { ...state.orbs.balance },
        milestones: { ...state.orbs.milestones },
        lastViewed: state.orbs.lastViewed,
        lastViewedBalance: { ...state.orbs.lastViewedBalance },
        acknowledged: { ...state.orbs.acknowledged }
      }
    }
  }


  /**
   * Create a fresh game state for new game
   */
  static createNewGameState(playerId: string): GameState {
    return {
      saveVersion: NARRATIVE_CONSTANTS.SAVE_VERSION,
      playerId,
      characters: new Map(
        CHARACTER_IDS.map(charId => [
          charId,
          this.createCharacterState(charId)
        ])
      ),
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
      // D-019: Initialize iceberg reference tracking
      icebergState: createIcebergState(),
      // D-040: Initialize pattern evolution history
      patternEvolutionHistory: createPatternEvolutionHistory(),
      // D-014: Skills
      skillLevels: {},
      skillUsage: new Map(),
      // TD-004: Orb economy
      orbs: INITIAL_ORB_STATE
    }
  }

  /**
   * Create initial character state
   * For unmet characters, use neutral anxiety (50) instead of panic (100)
   */
  static createCharacterState(characterId: string): CharacterState {
    return {
      characterId,
      trust: NARRATIVE_CONSTANTS.DEFAULT_TRUST,
      anxiety: NEUTRAL_ANXIETY, // Neutral state until player meets character
      nervousSystemState: 'ventral_vagal', // Calm/neutral for unmet characters
      lastReaction: null,
      knowledgeFlags: new Set(),
      relationshipStatus: NARRATIVE_CONSTANTS.DEFAULT_RELATIONSHIP,
      conversationHistory: [],
      // D-039: Trust timeline for visualization
      trustTimeline: createTrustTimeline(characterId)
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
        conversationHistory: char.conversationHistory,
        // D-039: Serialize trust timeline
        trustTimeline: char.trustTimeline
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
      } : undefined,
      // D-040: Serialize pattern evolution history
      patternEvolutionHistory: state.patternEvolutionHistory,
      // D-061: Serialize story arc state
      storyArcState: state.storyArcState ? {
        activeArcs: Array.from(state.storyArcState.activeArcs),
        completedArcs: Array.from(state.storyArcState.completedArcs),
        chapterProgress: Array.from(state.storyArcState.chapterProgress.entries()),
        completedChapters: Array.from(state.storyArcState.completedChapters)
      } : undefined,
      skillLevels: state.skillLevels,
      skillUsage: Array.from(state.skillUsage.entries()).map(([key, value]) => ({ key, value })),
      // TD-004: Orb economy
      orbs: state.orbs
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
              asPatternRecord(serialized.patterns),
              new Set(serialized.globalFlags) // Re-apply simulation effects on load
            ),
            lastReaction: char.lastReaction || null,
            knowledgeFlags: new Set(char.knowledgeFlags),
            // D-039: Deserialize trust timeline or create fresh
            trustTimeline: char.trustTimeline || createTrustTimeline(char.characterId)
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
      } : createIcebergState(),
      // D-040: Deserialize pattern evolution history or create fresh
      patternEvolutionHistory: serialized.patternEvolutionHistory || createPatternEvolutionHistory(),
      // D-061: Deserialize story arc state or create fresh
      storyArcState: serialized.storyArcState ? {
        activeArcs: new Set(serialized.storyArcState.activeArcs),
        completedArcs: new Set(serialized.storyArcState.completedArcs),
        chapterProgress: new Map(serialized.storyArcState.chapterProgress),
        completedChapters: new Set(serialized.storyArcState.completedChapters)
      } : createStoryArcState(),
      skillLevels: serialized.skillLevels || {},
      skillUsage: new Map((serialized.skillUsage || []).map(item => [item.key, item.value])),
      // TD-004: Orb economy (fallback to initial state for old saves)
      orbs: serialized.orbs || INITIAL_ORB_STATE
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
      },
      // D-014: Skills (Minimal)
      skillLevels: {},
      skillUsage: new Map(),
      // TD-004: Orbs (Minimal)
      orbs: INITIAL_ORB_STATE
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

  /**
   * Validate serializable game state using Zod schema
   * Phase 3C: Enhanced validation with detailed error reporting
   *
   * The Zod schema provides:
   * - Type-safe validation
   * - Default values for missing fields
   * - Detailed error messages
   */
  static isValidSerializableGameState(obj: unknown): obj is SerializableGameState {
    // Fast path: basic structure check
    if (typeof obj !== 'object' || obj === null) return false
    const objRecord = obj as Record<string, unknown>

    // Required fields must exist (Zod will fill defaults for optional)
    if (typeof objRecord.playerId !== 'string') return false

    // Use Zod for detailed validation
    const result = SerializedGameStateSchema.safeParse(obj)

    if (!result.success) {
      // Log first 3 errors for debugging
      // Zod v4 uses 'issues' not 'errors'
      const issues = result.error.issues.slice(0, 3)
      console.warn('[StateValidation] Save validation failed:', issues.map(e => ({
        path: e.path?.map(String).join('.') ?? 'unknown',
        message: e.message
      })))
      return false
    }

    // Additional semantic validation (node must exist)
    if (!StateValidation.isValidNodeId(result.data.currentNodeId)) {
      console.warn('[StateValidation] Invalid node ID:', result.data.currentNodeId)
      // Don't fail - game-state-manager has recovery logic for missing nodes
    }

    return true
  }

  /**
   * Parse and validate serializable game state, returning validated data with defaults
   * Use this when you need the parsed data with defaults filled in
   */
  static parseSerializableGameState(obj: unknown): SerializableGameState | null {
    const result = safeParseGameState(obj)
    return result as SerializableGameState | null
  }
}
