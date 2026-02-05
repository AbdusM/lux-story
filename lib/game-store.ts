import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { devtools, persist } from 'zustand/middleware'
import { ActiveThought, ThoughtStatus, THOUGHT_REGISTRY } from '@/content/thoughts'
import {
  GameState as CoreGameState,
  SerializableGameState,
  GameStateUtils,
  StateChange,
  OrbState,
  INITIAL_ORB_STATE
} from './character-state'
import { STORAGE_KEYS } from './persistence/storage-keys'
import { getPatternValue } from './patterns'
import { SimulationConfig } from '@/components/game/simulations/types'
import { updateAmbientMusic } from './audio-feedback'
import { GameStateManager } from './game-state-manager'
import { logger } from './logger'

// Core game state interfaces
export interface GameState {
  // Scene management
  currentSceneId: string | null
  hasStarted: boolean
  showIntro: boolean
  isProcessing: boolean
  choiceStartTime: number | null

  // Message management
  messages: GameMessage[]
  messageId: number

  // Navigation state
  pendingTravelTarget: string | null
  debugSimulation: SimulationConfig | null // GOD MODE: Force-load a simulation context
  pendingGodModeSimulation: SimulationConfig | null // GOD MODE: Pending simulation (awaiting Samuel transition)

  // Game progress
  visitedScenes: string[]
  choiceHistory: ChoiceRecord[]

  // Performance tracking
  performanceLevel: number
  performanceMetrics: PerformanceMetrics

  // Platform relationships
  platformWarmth: Record<string, number>
  platformAccessible: Record<string, boolean>

  // Character relationships
  characterTrust: Record<string, number>
  characterHelped: Record<string, number>

  // Pattern tracking
  patterns: PatternTracking

  // Emotional state
  emotionalState: EmotionalState

  // Cognitive state
  cognitiveState: CognitiveState

  // Developmental state
  identityState: IdentityState

  // Neural state
  neuralState: NeuralState

  // Skills tracking
  skills: FutureSkills

  // Thought Cabinet
  thoughts: ActiveThought[]

  // Floating Modules (tracked for oneShot behavior)
  triggeredModules: string[]

  // Meta-Achievements (hidden recognitions for consistent play patterns)
  unlockedAchievements: string[]

  // Character Transformations (witnessed transformation moments)
  witnessedTransformations: string[]

  // God Mode refresh trigger
  refreshCounter: number

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE GAME STATE: Single source of truth for dialogue/narrative system
  // This is the SerializableGameState from character-state.ts
  // All other fields (characterTrust, patterns) should be derived from this
  // ═══════════════════════════════════════════════════════════════════════════
  coreGameState: SerializableGameState | null
}

export interface GameMessage {
  id: string
  speaker: string
  text: string
  type: 'narration' | 'dialogue' | 'whisper' | 'sensation'
  messageWeight: 'primary' | 'secondary' | 'tertiary' | 'critical'
  timestamp: number
  className?: string
}

export interface ChoiceRecord {
  sceneId: string
  choice: string
  timestamp: number
  consequences?: string[]
}

export interface PerformanceMetrics {
  alignment: number
  consistency: number
  learning: number
  patience: number
  anxiety: number
  rushing: number
}

export interface PatternTracking {
  exploring: number
  helping: number
  building: number
  analytical: number  // Aligned with character-state.ts PlayerPatterns
  patience: number
  rushing: number
  independence: number
}

export interface EmotionalState {
  stressLevel: 'calm' | 'alert' | 'anxious' | 'overwhelmed'
  hrv: number
  vagalTone: number
  breathingRhythm: 'natural' | 'guided' | 'urgent'
  rapidClicks: number
  hesitationCount: number
  themeJumping: boolean
  emotionalIntensity: number
}

export interface CognitiveState {
  flowState: 'struggle' | 'flow' | 'boredom' | 'anxiety'
  challengeLevel: number
  skillLevel: number
  metacognitiveAwareness: number
  executiveFunction: number
  workingMemory: number
  attentionSpan: number
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
}

export interface IdentityState {
  identityExploration: 'early' | 'active' | 'crystallizing' | 'committed'
  selfConcept: 'fragmented' | 'developing' | 'coherent' | 'integrated'
  culturalValues: string[]
  languageAdaptation: number
}

export interface NeuralState {
  attentionNetwork: 'alerting' | 'orienting' | 'executive' | 'integrated'
  memoryConsolidation: 'encoding' | 'consolidating' | 'retrieving' | 'integrated'
  neuroplasticity: number
  dopamineLevels: number
  stressResponse: number
  cognitiveLoad: number
  neuralEfficiency: number
}

export interface FutureSkills {
  criticalThinking: number
  communication: number
  collaboration: number
  creativity: number
  adaptability: number
  leadership: number
  digitalLiteracy: number
  emotionalIntelligence: number
  culturalCompetence: number
  financialLiteracy: number
  timeManagement: number
  problemSolving: number

  // Content-Referenced Skills (Jan 13, 2026 - sync with 2030-skills-system.ts)
  activeListening: number
  attentionToDetail: number
  contentCreation: number
  cybersecurity: number
  dataAnalysis: number
  dataLiteracy: number
  ethicalReasoning: number
  selfMarketing: number
}

// Type for dynamic skill access (TD-008: cleaner than `as unknown as`)
export type SkillRecord = Record<string, number>

// Game store actions
export interface GameActions {
  // Scene management
  setCurrentScene: (sceneId: string | null) => void
  startGame: () => void
  setProcessing: (processing: boolean) => void
  setChoiceStartTime: (time: number | null) => void
  setPendingTravelTarget: (target: string | null) => void
  setDebugSimulation: (simulation: SimulationConfig | null) => void
  setPendingGodModeSimulation: (simulation: SimulationConfig | null) => void

  // Message management
  addMessage: (message: Omit<GameMessage, 'id' | 'timestamp'>) => void
  addStreamingMessage: (message: Omit<GameMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void

  // Game progress
  markSceneVisited: (sceneId: string) => void
  addChoiceRecord: (record: ChoiceRecord) => void

  // Performance tracking
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void
  calculatePerformanceLevel: () => void

  // Platform relationships
  updatePlatformWarmth: (platformId: string, warmth: number) => void
  setPlatformAccessible: (platformId: string, accessible: boolean) => void

  // Character relationships
  // TD-001: updateCharacterTrust() removed - use setCoreGameState() or applyCoreStateChange()
  setCharacterTrust: (trustRecord: Record<string, number>) => void
  updateCharacterHelped: (characterId: string, helped: number) => void

  // Pattern tracking
  // TD-001: updatePatterns() removed - use setCoreGameState() or applyCoreStateChange()

  // State updates
  updateEmotionalState: (state: Partial<EmotionalState>) => void
  updateCognitiveState: (state: Partial<CognitiveState>) => void
  updateIdentityState: (state: Partial<IdentityState>) => void
  updateNeuralState: (state: Partial<NeuralState>) => void
  updateSkills: (skills: Partial<FutureSkills>) => void

  // Thought Cabinet
  addThought: (thoughtId: string) => void
  updateThoughtProgress: (thoughtId: string, amount: number) => void
  updateThought: (thoughtId: string, updates: Partial<ActiveThought>) => void
  removeThought: (thoughtId: string) => void
  internalizeThought: (thoughtId: string) => void

  // Floating Modules
  markModuleTriggered: (moduleId: string) => void
  getTriggeredModulesSet: () => Set<string>

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE GAME STATE ACTIONS: Single source of truth operations
  // ═══════════════════════════════════════════════════════════════════════════
  setCoreGameState: (state: SerializableGameState) => void
  updateCoreGameState: (updater: (state: SerializableGameState) => SerializableGameState) => void
  applyCoreStateChange: (change: StateChange) => void
  getCoreGameStateHydrated: () => CoreGameState | null
  syncVisitedScenes: () => void  // TD-001: Renamed from syncDerivedState - only syncs visitedScenes
  forceRefresh: () => void  // Force UI re-render (God Mode)

  // Meta-Achievements
  unlockAchievements: (achievementIds: string[]) => void

  // Character Transformations
  markTransformationWitnessed: (transformationId: string) => void
  getWitnessedTransformations: () => string[]

  // Reset functions
  resetGame: () => void
  resetEmotionalState: () => void
  resetCognitiveState: () => void
  resetIdentityState: () => void
  resetNeuralState: () => void
  resetSkills: () => void

  // TD-004: Orb economy actions
  updateOrbs: (updater: (orbs: OrbState) => OrbState) => void
}

// Initial state
const initialState: GameState = {
  // Scene management
  currentSceneId: null,
  hasStarted: false,
  showIntro: true,
  isProcessing: false,
  choiceStartTime: null,
  pendingTravelTarget: null,
  debugSimulation: null,
  pendingGodModeSimulation: null,

  // Message management
  messages: [],
  messageId: 0,

  // Game progress
  visitedScenes: [],
  choiceHistory: [],

  // Performance tracking
  performanceLevel: 0,
  performanceMetrics: {
    alignment: 0,
    consistency: 0,
    learning: 0,
    patience: 0,
    anxiety: 0,
    rushing: 0
  },

  // Platform relationships
  platformWarmth: {},
  platformAccessible: {},

  // Character relationships
  characterTrust: {},
  characterHelped: {},

  // Pattern tracking
  patterns: {
    exploring: 0,
    helping: 0,
    building: 0,
    analytical: 0,  // Aligned with character-state.ts PlayerPatterns
    patience: 0,
    rushing: 0,
    independence: 0
  },

  // Emotional state
  emotionalState: {
    stressLevel: 'calm',
    hrv: 0.5,
    vagalTone: 0.5,
    breathingRhythm: 'natural',
    rapidClicks: 0,
    hesitationCount: 0,
    themeJumping: false,
    emotionalIntensity: 0.5
  },

  // Cognitive state
  cognitiveState: {
    flowState: 'struggle',
    challengeLevel: 0.5,
    skillLevel: 0.5,
    metacognitiveAwareness: 0.5,
    executiveFunction: 0.5,
    workingMemory: 0.5,
    attentionSpan: 0.5,
    learningStyle: 'mixed'
  },

  // Identity state
  identityState: {
    identityExploration: 'early',
    selfConcept: 'fragmented',
    culturalValues: [],
    languageAdaptation: 0.5
  },

  // Neural state
  neuralState: {
    attentionNetwork: 'alerting',
    memoryConsolidation: 'encoding',
    neuroplasticity: 0.5,
    dopamineLevels: 0.5,
    stressResponse: 0.5,
    cognitiveLoad: 0.5,
    neuralEfficiency: 0.5
  },

  // Skills tracking
  skills: {
    criticalThinking: 0,
    communication: 0,
    collaboration: 0,
    creativity: 0,
    adaptability: 0,
    leadership: 0,
    digitalLiteracy: 0,
    emotionalIntelligence: 0,
    culturalCompetence: 0,
    financialLiteracy: 0,
    timeManagement: 0,
    problemSolving: 0,

    // Content-Referenced Skills
    activeListening: 0,
    attentionToDetail: 0,
    contentCreation: 0,
    cybersecurity: 0,
    dataAnalysis: 0,
    dataLiteracy: 0,
    ethicalReasoning: 0,
    selfMarketing: 0
  },

  // Thought Cabinet
  thoughts: [],

  // Floating Modules (IDs of modules that have been shown)
  triggeredModules: [],

  // Meta-Achievements
  unlockedAchievements: [],

  // Character Transformations
  witnessedTransformations: [],

  // God Mode refresh trigger
  refreshCounter: 0,

  // Core Game State (single source of truth)
  coreGameState: null
}


// ═══════════════════════════════════════════════════════════════════════════
// PURE DERIVED STATE FUNCTIONS (Phase 2.1)
// These are used by setCoreGameState/updateCoreGameState/applyCoreStateChange
// to atomically compute derived slices in a single set() call.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pure function: compute derived state slices from core game state.
 * Returns only Zustand-storable slices (no side-effects).
 *
 * @param core - Must be a SerializableGameState (array-based characters[]),
 *               NOT a hydrated GameState (Map-based). Passing a Map-based
 *               state will produce empty results without error.
 */
// TD-001: Renamed from deriveVisitedScenes - only derives visitedScenes, not all derived state
export function deriveVisitedScenes(core: SerializableGameState): { visitedScenes: string[] } {
  const visitedScenes: string[] = []
  for (const char of core.characters) {
    for (const nodeId of char.conversationHistory) {
      if (!visitedScenes.includes(nodeId)) {
        visitedScenes.push(nodeId)
      }
    }
  }
  return { visitedScenes }
}

/**
 * Side-effect: update ambient music based on current character's nervous system state.
 * Separated from deriveVisitedScenes because it's not Zustand state.
 */
function updateAmbientMusicFromCore(core: SerializableGameState): void {
  const currentCharacter = core.characters.find(c => c.characterId === core.currentCharacterId)
  if (currentCharacter) {
    const nsState = currentCharacter.nervousSystemState || 'ventral_vagal'
    try {
      updateAmbientMusic(nsState)
    } catch (e) {
      console.warn('[Limbic Audio] Failed to update ambient music', e)
    }
  }
}

// Create the game store
export const useGameStore = create<GameState & GameActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Scene management actions
        setCurrentScene: (sceneId) => set({ currentSceneId: sceneId }),
        startGame: () => set({ hasStarted: true, showIntro: false }),
        setProcessing: (processing) => set({ isProcessing: processing }),
        setChoiceStartTime: (time) => set({ choiceStartTime: time }),
        setPendingTravelTarget: (target) => set({ pendingTravelTarget: target }),
        setDebugSimulation: (sim) => set({ debugSimulation: sim }),
        setPendingGodModeSimulation: (sim) => set({ pendingGodModeSimulation: sim }),

        // Message management actions
        addMessage: (message) => {
          const id = `msg-${get().messageId}`
          const timestamp = Date.now()
          set((state) => ({
            messages: [...(state.messages || []), { ...message, id, timestamp }],
            messageId: state.messageId + 1
          }))
        },

        addStreamingMessage: (message) => {
          const id = `stream-${get().messageId}`
          const timestamp = Date.now()
          set((state) => ({
            messages: [...(state.messages || []), { ...message, id, timestamp }],
            messageId: state.messageId + 1
          }))
        },

        clearMessages: () => set({ messages: [], messageId: 0 }),

        // Game progress actions
        markSceneVisited: (sceneId) => {
          set((state) => ({
            visitedScenes: [...(state.visitedScenes || []), sceneId].filter((id, index, arr) => arr.indexOf(id) === index)
          }))
        },

        addChoiceRecord: (record) => {
          set((state) => ({
            choiceHistory: [...(state.choiceHistory || []), record]
          }))
        },

        // Performance tracking actions
        updatePerformance: (metrics) => {
          set((state) => ({
            performanceMetrics: { ...state.performanceMetrics, ...metrics }
          }))
          get().calculatePerformanceLevel()
        },

        calculatePerformanceLevel: () => {
          const { performanceMetrics } = get()
          const { alignment, consistency, learning, patience, anxiety, rushing } = performanceMetrics

          // Performance equation: (Alignment × Consistency) + (Learning × Patience) - (Anxiety × Rushing)
          const performance = (alignment * consistency) + (learning * patience) - (anxiety * rushing)
          const normalizedPerformance = Math.max(0, Math.min(1, (performance + 1) / 2))

          set({ performanceLevel: normalizedPerformance })
        },

        // Platform relationship actions
        updatePlatformWarmth: (platformId, warmth) => {
          set((state) => ({
            platformWarmth: { ...state.platformWarmth, [platformId]: warmth }
          }))
        },

        setPlatformAccessible: (platformId, accessible) => {
          set((state) => ({
            platformAccessible: { ...state.platformAccessible, [platformId]: accessible }
          }))
        },

        // Character relationship actions
        // TD-001: updateCharacterTrust() removed - use setCoreGameState() or applyCoreStateChange()

        // Batch update character trust (for syncing from GameState)
        setCharacterTrust: (trustRecord: Record<string, number>) => {
          set((state) => ({
            characterTrust: { ...state.characterTrust, ...trustRecord }
          }))
        },

        updateCharacterHelped: (characterId, helped) => {
          set((state) => ({
            characterHelped: { ...state.characterHelped, [characterId]: helped }
          }))
        },

        // Pattern tracking actions
        // TD-001: updatePatterns() removed - use setCoreGameState() or applyCoreStateChange()

        // State update actions
        updateEmotionalState: (state) => {
          set((currentState) => ({
            emotionalState: { ...currentState.emotionalState, ...state }
          }))
        },

        updateCognitiveState: (state) => {
          set((currentState) => ({
            cognitiveState: { ...currentState.cognitiveState, ...state }
          }))
        },

        updateIdentityState: (state) => {
          set((currentState) => ({
            identityState: { ...currentState.identityState, ...state }
          }))
        },

        updateNeuralState: (state) => {
          set((currentState) => ({
            neuralState: { ...currentState.neuralState, ...state }
          }))
        },

        // Skills tracking actions
        // NOTE: Skills are not part of coreGameState (they're tracked separately)
        // This is OK to update directly as skills are not synced from coreGameState
        updateSkills: (skills) => {
          set((state) => ({
            skills: { ...state.skills, ...skills }
          }))
        },

        // Thought Cabinet Actions
        // NOTE: Thoughts are synced from coreGameState via syncDerivedState()
        // These functions should also update coreGameState to maintain consistency
        addThought: (thoughtId) => {
          const registry = THOUGHT_REGISTRY[thoughtId]
          if (!registry) return

          set((state) => {
            if (state.thoughts.some(t => t.id === thoughtId)) return state // Already exists

            const newThought: ActiveThought = {
              ...registry,
              status: 'developing',
              progress: 0,
              addedAt: Date.now(),
              lastUpdated: Date.now()
            }
            const updatedThoughts = [newThought, ...state.thoughts]

            // Also sync to coreGameState if it exists
            const core = get().coreGameState
            if (core) {
              set({
                coreGameState: {
                  ...core,
                  thoughts: updatedThoughts
                }
              })
            }

            return { thoughts: updatedThoughts }
          })
        },

        updateThoughtProgress: (thoughtId, amount) => {
          set((state) => {
            const updatedThoughts = state.thoughts.map(t => {
              if (t.id !== thoughtId) return t
              const newProgress = Math.min(100, Math.max(0, t.progress + amount))
              return {
                ...t,
                progress: newProgress,
                lastUpdated: Date.now()
              }
            })

            // Also sync to coreGameState if it exists
            const core = get().coreGameState
            if (core) {
              set({
                coreGameState: {
                  ...core,
                  thoughts: updatedThoughts
                }
              })
            }

            return { thoughts: updatedThoughts }
          })
        },

        updateThought: (thoughtId, updates) => {
          set((state) => {
            const updatedThoughts = state.thoughts.map(t => {
              if (t.id !== thoughtId) return t
              return {
                ...t,
                ...updates,
                lastUpdated: Date.now()
              }
            })

            // Also sync to coreGameState if it exists
            const core = get().coreGameState
            if (core) {
              set({
                coreGameState: {
                  ...core,
                  thoughts: updatedThoughts
                }
              })
            }

            return { thoughts: updatedThoughts }
          })
        },

        removeThought: (thoughtId) => {
          set((state) => {
            const updatedThoughts = state.thoughts.filter(t => t.id !== thoughtId)

            // Also sync to coreGameState if it exists
            const core = get().coreGameState
            if (core) {
              set({
                coreGameState: {
                  ...core,
                  thoughts: updatedThoughts
                }
              })
            }

            return { thoughts: updatedThoughts }
          })
        },

        internalizeThought: (thoughtId) => {
          set((state) => {
            const updatedThoughts: ActiveThought[] = state.thoughts.map(t => {
              if (t.id !== thoughtId) return t
              return {
                ...t,
                status: 'internalized' as ThoughtStatus,
                progress: 100,
                lastUpdated: Date.now()
              }
            })

            // Also sync to coreGameState if it exists
            const core = get().coreGameState
            if (core) {
              set({
                coreGameState: {
                  ...core,
                  thoughts: updatedThoughts
                }
              })
            }

            return { thoughts: updatedThoughts }
          })
        },

        // Floating Module Actions
        markModuleTriggered: (moduleId) => {
          set((state) => {
            if (state.triggeredModules.includes(moduleId)) return state
            return { triggeredModules: [...state.triggeredModules, moduleId] }
          })
        },

        getTriggeredModulesSet: () => {
          return new Set(get().triggeredModules)
        },

        // ═══════════════════════════════════════════════════════════════════════════
        // CORE GAME STATE ACTIONS: Single source of truth operations
        // ═══════════════════════════════════════════════════════════════════════════

        // Set the entire core game state (used on load/init)
        // Phase 2.1: Atomic single set() — core + derived in one call
        setCoreGameState: (state: SerializableGameState) => {
          const derived = deriveVisitedScenes(state)
          set({ coreGameState: state, ...derived })
          // Side-effect: ambient music (not Zustand state)
          updateAmbientMusicFromCore(state)
        },

        // Update core game state with a function (for complex updates)
        updateCoreGameState: (updater) => {
          const current = get().coreGameState
          if (!current) return
          const updated = updater(current)
          const derived = deriveVisitedScenes(updated)
          set({ coreGameState: updated, ...derived })
          updateAmbientMusicFromCore(updated)
        },

        // Apply a StateChange to the core game state
        applyCoreStateChange: (change: StateChange) => {
          const serialized = get().coreGameState
          if (!serialized) return

          // Convert to hydrated GameState, apply change, then serialize back
          const hydrated = GameStateUtils.deserialize(serialized)
          const updated = GameStateUtils.applyStateChange(hydrated, change)
          const newSerialized = GameStateUtils.serialize(updated)

          const derived = deriveVisitedScenes(newSerialized)
          set({ coreGameState: newSerialized, ...derived })
          updateAmbientMusicFromCore(newSerialized)
        },

        // Get hydrated GameState (with Map/Set) for dialogue system
        getCoreGameStateHydrated: () => {
          const serialized = get().coreGameState
          if (!serialized) return null
          return GameStateUtils.deserialize(serialized)
        },

        // Sync derived state from coreGameState
        // NOTE: Prefer using setCoreGameState/updateCoreGameState/applyCoreStateChange
        // which atomically sync derived state in a single set() call.
        // This method is kept for backward compatibility only.
        // TD-001: Renamed from syncDerivedState - only syncs visitedScenes, not all derived state
        syncVisitedScenes: () => {
          const core = get().coreGameState
          if (!core) return
          const derived = deriveVisitedScenes(core)
          set(derived)
          updateAmbientMusicFromCore(core)
        },

        // Force UI refresh (for God Mode navigation)
        forceRefresh: () => {
          set(state => ({ ...state, refreshCounter: state.refreshCounter + 1 }))
          console.log('[God Mode] UI refresh triggered')
        },

        // Meta-Achievements - unlock new achievements (dedupes automatically)
        unlockAchievements: (achievementIds: string[]) => {
          set((state) => {
            const newUnlocks = achievementIds.filter(id => !state.unlockedAchievements.includes(id))
            if (newUnlocks.length === 0) return state
            return {
              unlockedAchievements: [...state.unlockedAchievements, ...newUnlocks]
            }
          })
        },

        // Character Transformations - mark a transformation as witnessed
        markTransformationWitnessed: (transformationId: string) => {
          set((state) => {
            if (state.witnessedTransformations.includes(transformationId)) return state
            return {
              witnessedTransformations: [...state.witnessedTransformations, transformationId]
            }
          })
        },

        getWitnessedTransformations: () => {
          return get().witnessedTransformations
        },

        // Reset actions
        resetGame: () => set(initialState),
        resetEmotionalState: () => set({ emotionalState: initialState.emotionalState }),
        resetCognitiveState: () => set({ cognitiveState: initialState.cognitiveState }),
        resetIdentityState: () => set({ identityState: initialState.identityState }),
        resetNeuralState: () => set({ neuralState: initialState.neuralState }),
        resetSkills: () => set({ skills: initialState.skills }),

        // TD-004: Orb economy - update orbs within coreGameState
        updateOrbs: (updater) => {
          const current = get().coreGameState
          if (!current) return

          const updatedOrbs = updater(current.orbs || INITIAL_ORB_STATE)
          const updated = { ...current, orbs: updatedOrbs }

          const derived = deriveVisitedScenes(updated)
          set({ coreGameState: updated, ...derived })
        }
      }),
      {
        name: STORAGE_KEYS.GAME_STORE, // TD-005: Unified storage key
        version: 2, // Version 2: Single source of truth (characterTrust, patterns, thoughts in coreGameState only)
        migrate: (persistedState: unknown, version: number) => {
          // Handle migration from corrupted Set data to Arrays (version 0 → 1)
          if (version === 0 && persistedState) {
            try {
              const persistedObj = typeof persistedState === 'object' && persistedState !== null ? persistedState as Record<string, unknown> : {}
              // Fix visitedScenes if it's corrupted Set data
              if (persistedObj.visitedScenes && typeof persistedObj.visitedScenes === 'object') {
                // If it's not an array, try to convert or reset
                if (!Array.isArray(persistedObj.visitedScenes)) {
                  console.warn('Migrating corrupted visitedScenes from Set to Array')
                  persistedObj.visitedScenes = []
                }
              }

              // Ensure all required fields exist with proper types
              const migratedState = {
                ...initialState,
                ...persistedObj,
                visitedScenes: Array.isArray(persistedObj.visitedScenes) ? persistedObj.visitedScenes : [],
                choiceHistory: Array.isArray(persistedObj.choiceHistory) ? persistedObj.choiceHistory : [],
                messages: [], // Don't persist messages
                thoughts: Array.isArray(persistedObj.thoughts) ? persistedObj.thoughts : [] // Migrate thoughts
              }

              return migratedState
            } catch (error) {
              console.warn('State migration failed, using initial state:', error)
              return initialState
            }
          }

          // Version 1 → 2: Migrate to single source of truth
          // Old state had characterTrust, patterns, thoughts as separate fields
          // New state derives them from coreGameState
          if (version === 1 && persistedState) {
            try {
              const old = persistedState as Record<string, unknown>
              const coreGameState = old.coreGameState as SerializableGameState | null

              if (coreGameState) {
                // Merge old top-level characterTrust into coreGameState.characters
                const oldTrust = old.characterTrust as Record<string, number> | undefined
                if (oldTrust) {
                  coreGameState.characters = coreGameState.characters.map(char => ({
                    ...char,
                    trust: oldTrust[char.characterId] ?? char.trust
                  }))
                }

                // Merge old patterns into coreGameState.patterns
                const oldPatterns = old.patterns as Record<string, number> | undefined
                if (oldPatterns) {
                  coreGameState.patterns = {
                    ...coreGameState.patterns,
                    analytical: oldPatterns.analytical ?? coreGameState.patterns.analytical,
                    helping: oldPatterns.helping ?? coreGameState.patterns.helping,
                    building: oldPatterns.building ?? coreGameState.patterns.building,
                    patience: oldPatterns.patience ?? coreGameState.patterns.patience,
                    exploring: oldPatterns.exploring ?? coreGameState.patterns.exploring
                  }
                }

                // Merge old thoughts into coreGameState.thoughts
                const oldThoughts = old.thoughts as ActiveThought[] | undefined
                if (oldThoughts && oldThoughts.length > 0) {
                  // Use old thoughts if coreGameState has none, otherwise prefer coreGameState
                  if (!coreGameState.thoughts || coreGameState.thoughts.length === 0) {
                    coreGameState.thoughts = oldThoughts
                  }
                }
              }

              console.log('[Migration v1→v2] Migrated to single source of truth')
              return {
                ...old,
                coreGameState,
                // Keep empty/default values for legacy fields (they're derived now)
                characterTrust: {},
                patterns: initialState.patterns,
                thoughts: []
              }
            } catch (error) {
              console.warn('State migration v1→v2 failed:', error)
              return persistedState
            }
          }

          return persistedState
        },
        partialize: (state) => ({
          currentSceneId: state.currentSceneId,
          hasStarted: state.hasStarted,
          visitedScenes: state.visitedScenes,
          choiceHistory: state.choiceHistory,
          performanceLevel: state.performanceLevel,
          performanceMetrics: state.performanceMetrics,
          platformWarmth: state.platformWarmth,
          platformAccessible: state.platformAccessible,
          // REMOVED: characterTrust - now derived from coreGameState.characters
          characterHelped: state.characterHelped,
          // REMOVED: patterns - now derived from coreGameState.patterns
          emotionalState: state.emotionalState,
          cognitiveState: state.cognitiveState,
          identityState: state.identityState,
          neuralState: state.neuralState,
          skills: state.skills,
          // REMOVED: thoughts - now derived from coreGameState.thoughts
          // Character transformations
          witnessedTransformations: state.witnessedTransformations,
          // Core game state (SINGLE SOURCE OF TRUTH)
          // characterTrust, patterns, thoughts are all stored here
          coreGameState: state.coreGameState
        }),
        // Custom storage with validation (moved into persist options per Zustand best practices)
        storage: {
          getItem: (name: string) => {
            try {
              if (typeof window === 'undefined') return null
              const str = localStorage.getItem(name)
              if (!str) return null

              const parsed = JSON.parse(str)

              // Validate that the parsed data is serializable
              if (parsed && typeof parsed === 'object') {
                // Quick check for Set objects or other non-serializable data
                const testSerialization = JSON.stringify(parsed)
                JSON.parse(testSerialization) // Will throw if not properly serializable
              }

              return parsed
            } catch (error) {
              console.warn('Failed to parse localStorage data, clearing corrupted state:', error)
              if (typeof window !== 'undefined') {
                localStorage.removeItem(name)
              }
              return null
            }
          },
          setItem: (name: string, value: unknown) => {
            try {
              // Validate serializability before storing
              const serialized = JSON.stringify(value)
              JSON.parse(serialized) // Will throw if not properly serializable
              if (typeof window !== 'undefined') {
                localStorage.setItem(name, serialized)
              }
            } catch (error) {
              if (typeof window !== 'undefined') {
                console.error('Failed to store state, data not serializable:', error)
              }
              // Don't throw, just log the error to prevent app crashes
            }
          },
          removeItem: (name: string) => {
            try {
              if (typeof window !== 'undefined') {
                localStorage.removeItem(name)
              }
            } catch (error) {
              if (typeof window !== 'undefined') {
                console.warn('Failed to remove localStorage item:', error)
              }
            }
          }
        }
      }
    ),
    { name: 'lux-story-game-store' } // devtools options - only needs name
  )
)

// ═══════════════════════════════════════════════════════════════════════════
// COMMIT GAME STATE: Single source of truth write operation
// TD-001: Atomic commit to both Zustand and localStorage
// ═══════════════════════════════════════════════════════════════════════════

/**
 * commitGameState - Atomic write to both Zustand and localStorage
 *
 * This is the ONLY function that should be used to persist game state changes.
 * It ensures both stores are always in sync, preventing data loss on early-exit paths.
 *
 * @param gameState - The hydrated GameState to persist
 * @param opts.reason - Debug label for logging (e.g., 'choice-complete', 'navigation')
 *
 * Usage:
 *   commitGameState(newGameState, { reason: 'choice-complete' })
 *
 * Replaces:
 *   - useGameStore.getState().setCoreGameState(...)
 *   - GameStateManager.saveGameState(...)
 *   - (when used together for persistence)
 */
export function commitGameState(
  gameState: CoreGameState,
  opts?: { reason?: string }
): void {
  const serialized = GameStateUtils.serialize(gameState)

  // 1. Update Zustand (UI reactivity)
  useGameStore.getState().setCoreGameState(serialized)

  // 2. Persist to localStorage
  GameStateManager.saveGameState(gameState)

  logger.debug('[commitGameState] Committed', {
    reason: opts?.reason,
    nodeId: gameState.currentNodeId,
    characterId: gameState.currentCharacterId
  })
}

// Validation utilities for serialization
export function validateGameState(state: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (typeof state !== 'object' || state === null) {
    errors.push('State must be an object')
    return { isValid: false, errors }
  }

  const stateObj = state as Record<string, unknown>

  try {
    // Test JSON serialization
    const serialized = JSON.stringify(state)
    const deserialized = JSON.parse(serialized)

    // Check that visitedScenes is an array
    if (stateObj.visitedScenes && !Array.isArray(stateObj.visitedScenes)) {
      errors.push('visitedScenes must be an array')
    }

    // Check that choiceHistory is an array
    if (stateObj.choiceHistory && !Array.isArray(stateObj.choiceHistory)) {
      errors.push('choiceHistory must be an array')
    }

    // Check that messages is an array
    if (stateObj.messages && !Array.isArray(stateObj.messages)) {
      errors.push('messages must be an array')
    }

    // Validate that all numeric values are actually numbers
    if (typeof stateObj.performanceLevel !== 'number') {
      errors.push('performanceLevel must be a number')
    }

    // Check that serialization is reversible
    if (JSON.stringify(deserialized) !== serialized) {
      errors.push('State serialization is not reversible')
    }

  } catch (error) {
    errors.push(`Serialization failed: ${error}`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Clear any corrupted localStorage during development
export function clearCorruptedStorage() {
  try {
    const storageKey = 'grand-central-game-store'
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      const parsed = JSON.parse(stored)
      const validation = validateGameState(parsed.state)

      if (!validation.isValid) {
        console.warn('Clearing corrupted localStorage:', validation.errors)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(storageKey)
        }
        return true
      }
    }

    return false
  } catch (error) {
    console.warn('Error checking localStorage, clearing it:', error)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.GAME_STORE)
    }
    return true
  }
}

// Memoization cache for hydrated state (prevents deserializing on every render)
let cachedSerializedState: SerializableGameState | null = null
let cachedHydratedState: CoreGameState | null = null

// Selectors for optimized re-renders
export const useGameSelectors = {
  // Scene selectors
  useCurrentScene: () => useGameStore((state) => state.currentSceneId),
  useGameStarted: () => useGameStore((state) => state.hasStarted),
  useIsProcessing: () => useGameStore((state) => state.isProcessing),

  // Message selectors
  useMessages: () => useGameStore((state) => state.messages),
  useMessageCount: () => useGameStore((state) => state.messages.length),

  // Performance selectors
  usePerformanceLevel: () => useGameStore((state) => state.performanceLevel),
  usePerformanceMetrics: () => useGameStore((state) => state.performanceMetrics),

  // Platform selectors
  usePlatformWarmth: (platformId: string) =>
    useGameStore((state) => state.platformWarmth[platformId] || 0),
  usePlatformAccessible: (platformId: string) =>
    useGameStore((state) => state.platformAccessible[platformId] || false),

  // Character selectors - DERIVED FROM coreGameState (single source of truth)
  useCharacterTrust: (characterId: string) =>
    useGameStore((state) => {
      // Derive from coreGameState (single source of truth)
      if (state.coreGameState) {
        const char = state.coreGameState.characters.find(c => c.characterId === characterId)
        if (char) return char.trust
      }
      // Fallback to legacy field during migration
      return state.characterTrust[characterId] || 0
    }),
  useCharacterHelped: (characterId: string) =>
    useGameStore((state) => state.characterHelped[characterId] || 0),

  // Pattern selectors - DERIVED FROM coreGameState (single source of truth)
  usePatterns: () => useGameStore(useShallow((state) => {
    // Derive from coreGameState (single source of truth)
    if (state.coreGameState?.patterns) {
      return {
        ...state.patterns, // Keep legacy fields like rushing, independence
        analytical: state.coreGameState.patterns.analytical || 0,
        helping: state.coreGameState.patterns.helping || 0,
        building: state.coreGameState.patterns.building || 0,
        patience: state.coreGameState.patterns.patience || 0,
        exploring: state.coreGameState.patterns.exploring || 0
      }
    }
    return state.patterns
  })),
  usePatternValue: (pattern: keyof PatternTracking) =>
    useGameStore((state) => {
      // Derive from coreGameState for core patterns
      if (state.coreGameState?.patterns) {
        return getPatternValue(state.coreGameState.patterns, pattern)
      }
      return state.patterns[pattern]
    }),

  // State selectors
  useEmotionalState: () => useGameStore((state) => state.emotionalState),
  useCognitiveState: () => useGameStore((state) => state.cognitiveState),
  useIdentityState: () => useGameStore((state) => state.identityState),
  useNeuralState: () => useGameStore((state) => state.neuralState),
  useSkills: () => useGameStore((state) => state.skills),

  // Thought Cabinet selectors - DERIVED FROM coreGameState (single source of truth)
  useThoughts: () => useGameStore((state) => {
    // Derive from coreGameState (single source of truth)
    if (state.coreGameState?.thoughts) {
      return state.coreGameState.thoughts
    }
    return state.thoughts
  }),

  // Additional state selectors (for useGame hook optimization)
  useShowIntro: () => useGameStore((state) => state.showIntro),
  useChoiceStartTime: () => useGameStore((state) => state.choiceStartTime),
  useMessageId: () => useGameStore((state) => state.messageId),
  useVisitedScenes: () => useGameStore((state) => state.visitedScenes),
  useChoiceHistory: () => useGameStore((state) => state.choiceHistory),
  usePlatformWarmthAll: () => useGameStore((state) => state.platformWarmth),
  usePlatformAccessibleAll: () => useGameStore((state) => state.platformAccessible),
  // DERIVED FROM coreGameState (single source of truth)
  useCharacterTrustAll: () => useGameStore(useShallow((state) => {
    if (state.coreGameState) {
      const trustRecord: Record<string, number> = {}
      for (const char of state.coreGameState.characters) {
        trustRecord[char.characterId] = char.trust
      }
      return trustRecord
    }
    return state.characterTrust
  })),
  useCharacterHelpedAll: () => useGameStore((state) => state.characterHelped),

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE GAME STATE SELECTORS: Single source of truth for dialogue system
  // ═══════════════════════════════════════════════════════════════════════════

  // Get serialized core game state (for persistence/sync)
  useCoreGameState: () => useGameStore((state) => state.coreGameState),

  // Get hydrated core game state (with Map/Set restored - for dialogue engine)
  // OPTIMIZED: Only deserializes when serialized state actually changes
  useCoreGameStateHydrated: () => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) {
      cachedSerializedState = null
      cachedHydratedState = null
      return null
    }

    // Only deserialize if state changed (prevents 1000+ Map/Set ops per render)
    if (serialized !== cachedSerializedState) {
      cachedSerializedState = serialized
      cachedHydratedState = GameStateUtils.deserialize(serialized)
    }

    return cachedHydratedState
  },

  // Get specific character from core state
  useCoreCharacter: (characterId: string) => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return null
    return serialized.characters.find(c => c.characterId === characterId) || null
  },

  // Check if a global flag is set
  useHasGlobalFlag: (flag: string) => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return false
    return serialized.globalFlags.includes(flag)
  },

  // Get all global flags
  useGlobalFlags: () => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return []
    return serialized.globalFlags
  },

  // Get mysteries state
  useMysteries: () => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return null
    return serialized.mysteries
  },

  // Get career values (for Analysis tab radar chart)
  useCareerValues: () => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return null
    return serialized.careerValues
  },

  // Get pattern evolution history (for pattern moment capture visualization)
  usePatternEvolutionHistory: () => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return null
    return serialized.patternEvolutionHistory || null
  },

  // Character Transformations
  useWitnessedTransformations: () => useGameStore((state) => state.witnessedTransformations),
  useHasWitnessedTransformation: (transformationId: string) =>
    useGameStore((state) => state.witnessedTransformations.includes(transformationId)),

  // ═══════════════════════════════════════════════════════════════════════════
  // TD-001 STEP 1: DIALOGUE NAVIGATION SELECTORS
  // These selectors enable side menus to read directly from Zustand,
  // preparing for removal of the early sync hack in useChoiceHandler.
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get the current character ID from core game state.
   * Used by: Journal, Constellation, side menus
   */
  useCurrentCharacterId: () =>
    useGameStore((state) => state.coreGameState?.currentCharacterId ?? 'samuel'),

  /**
   * Get the current dialogue node ID.
   * Used by: Dialogue display, navigation logic
   */
  useCurrentNodeId: () =>
    useGameStore((state) => state.coreGameState?.currentNodeId ?? null),

  /**
   * Get the current character's full state (trust, flags, history).
   * Returns null if no game state or character not found.
   */
  useCurrentCharacterState: () =>
    useGameStore((state) => {
      if (!state.coreGameState) return null
      const charId = state.coreGameState.currentCharacterId
      return state.coreGameState.characters.find(c => c.characterId === charId) ?? null
    }),

  /**
   * Get all character trust levels as a stable record.
   * Optimized: Only updates when trust values actually change.
   */
  useAllCharacterTrust: () =>
    useGameStore(
      useShallow((state) => {
        if (!state.coreGameState) return {}
        const result: Record<string, number> = {}
        for (const char of state.coreGameState.characters) {
          result[char.characterId] = char.trust
        }
        return result
      })
    ),

  /**
   * Get all character knowledge flags as a combined set.
   * Used by: Choice visibility evaluation, pattern reflections
   */
  useAllKnowledgeFlags: () =>
    useGameStore((state) => {
      if (!state.coreGameState) return new Set<string>()
      const flags = new Set<string>()
      for (const char of state.coreGameState.characters) {
        for (const flag of char.knowledgeFlags) {
          flags.add(flag)
        }
      }
      return flags
    }),

  /**
   * Check if a specific knowledge flag exists (any character).
   */
  useHasKnowledgeFlag: (flag: string) =>
    useGameStore((state) => {
      if (!state.coreGameState) return false
      return state.coreGameState.characters.some(c => c.knowledgeFlags.includes(flag))
    }),

  /**
   * Get patterns directly from coreGameState (not the legacy patterns field).
   * This is the canonical source of truth for pattern values.
   */
  useCorePatterns: () =>
    useGameStore(
      useShallow((state) => state.coreGameState?.patterns ?? {
        analytical: 0,
        patience: 0,
        exploring: 0,
        helping: 0,
        building: 0
      })
    ),

  /**
   * Get episode number for progression tracking.
   */
  useEpisodeNumber: () =>
    useGameStore((state) => state.coreGameState?.episodeNumber ?? 1),

  /**
   * Get pending travel target for conductor mode.
   */
  usePendingTravelTarget: () =>
    useGameStore((state) => state.pendingTravelTarget),

  // ═══════════════════════════════════════════════════════════════════════════
  // TD-004: ORB ECONOMY SELECTORS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get orb state from core game state.
   * Returns null if no game state, INITIAL_ORB_STATE fallback for old saves.
   */
  useOrbs: () =>
    useGameStore((state) => state.coreGameState?.orbs ?? INITIAL_ORB_STATE),

  /**
   * Get orb balance only (for Journal display).
   */
  useOrbBalance: () =>
    useGameStore((state) => state.coreGameState?.orbs?.balance ?? INITIAL_ORB_STATE.balance),

  /**
   * Get orb milestones (for dialogue system triggers).
   */
  useOrbMilestones: () =>
    useGameStore((state) => state.coreGameState?.orbs?.milestones ?? INITIAL_ORB_STATE.milestones)
}
