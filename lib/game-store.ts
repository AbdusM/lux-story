import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ActiveThought, THOUGHT_REGISTRY } from '@/content/thoughts'
import {
  GameState as CoreGameState,
  SerializableGameState,
  GameStateUtils,
  StateChange,
  CharacterState
} from './character-state'

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
}

// Game store actions
export interface GameActions {
  // Scene management
  setCurrentScene: (sceneId: string | null) => void
  startGame: () => void
  setProcessing: (processing: boolean) => void
  setChoiceStartTime: (time: number | null) => void
  
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
  updateCharacterTrust: (characterId: string, trust: number) => void
  setCharacterTrust: (trustRecord: Record<string, number>) => void
  updateCharacterHelped: (characterId: string, helped: number) => void
  
  // Pattern tracking
  updatePatterns: (patterns: Partial<PatternTracking>) => void
  
  // State updates
  updateEmotionalState: (state: Partial<EmotionalState>) => void
  updateCognitiveState: (state: Partial<CognitiveState>) => void
  updateIdentityState: (state: Partial<IdentityState>) => void
  updateNeuralState: (state: Partial<NeuralState>) => void
  updateSkills: (skills: Partial<FutureSkills>) => void

  // Thought Cabinet
  addThought: (thoughtId: string) => void
  updateThoughtProgress: (thoughtId: string, amount: number) => void
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
  syncDerivedState: () => void  // Sync characterTrust/patterns from coreGameState

  // Meta-Achievements
  unlockAchievements: (achievementIds: string[]) => void

  // Reset functions
  resetGame: () => void
  resetEmotionalState: () => void
  resetCognitiveState: () => void
  resetIdentityState: () => void
  resetNeuralState: () => void
  resetSkills: () => void
}

// Initial state
const initialState: GameState = {
  // Scene management
  currentSceneId: null,
  hasStarted: false,
  showIntro: true,
  isProcessing: false,
  choiceStartTime: null,
  
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
    problemSolving: 0
  },

  // Thought Cabinet
  thoughts: [],

  // Floating Modules (IDs of modules that have been shown)
  triggeredModules: [],

  // Meta-Achievements
  unlockedAchievements: [],

  // Core Game State (single source of truth)
  coreGameState: null
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
        updateCharacterTrust: (characterId, trust) => {
          set((state) => ({
            characterTrust: { ...state.characterTrust, [characterId]: trust }
          }))
        },

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
        updatePatterns: (patterns) => {
          set((state) => ({
            patterns: { ...state.patterns, ...patterns }
          }))
        },
        
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
        
        updateSkills: (skills) => {
          set((state) => ({
            skills: { ...state.skills, ...skills }
          }))
        },

        // Thought Cabinet Actions
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
            return { thoughts: [newThought, ...state.thoughts] }
          })
        },

        updateThoughtProgress: (thoughtId, amount) => {
          set((state) => ({
            thoughts: state.thoughts.map(t => {
              if (t.id !== thoughtId) return t
              const newProgress = Math.min(100, Math.max(0, t.progress + amount))
              return { 
                ...t, 
                progress: newProgress,
                lastUpdated: Date.now()
              }
            })
          }))
        },

        internalizeThought: (thoughtId) => {
          set((state) => ({
            thoughts: state.thoughts.map(t => {
              if (t.id !== thoughtId) return t
              return {
                ...t,
                status: 'internalized',
                progress: 100,
                lastUpdated: Date.now()
              }
            })
          }))
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
        setCoreGameState: (state: SerializableGameState) => {
          set({ coreGameState: state })
          // Automatically sync derived state
          get().syncDerivedState()
        },

        // Update core game state with a function (for complex updates)
        updateCoreGameState: (updater) => {
          const current = get().coreGameState
          if (!current) return
          const updated = updater(current)
          set({ coreGameState: updated })
          get().syncDerivedState()
        },

        // Apply a StateChange to the core game state
        applyCoreStateChange: (change: StateChange) => {
          const serialized = get().coreGameState
          if (!serialized) return

          // Convert to hydrated GameState, apply change, then serialize back
          const hydrated = GameStateUtils.deserialize(serialized)
          const updated = GameStateUtils.applyStateChange(hydrated, change)
          const newSerialized = GameStateUtils.serialize(updated)

          set({ coreGameState: newSerialized })
          get().syncDerivedState()
        },

        // Get hydrated GameState (with Map/Set) for dialogue system
        getCoreGameStateHydrated: () => {
          const serialized = get().coreGameState
          if (!serialized) return null
          return GameStateUtils.deserialize(serialized)
        },

        // Sync derived state (characterTrust, patterns, thoughts) from coreGameState
        syncDerivedState: () => {
          const core = get().coreGameState
          if (!core) return

          // Sync characterTrust: SerializableGameState.characters[] → Record<string, number>
          const trustRecord: Record<string, number> = {}
          for (const char of core.characters) {
            trustRecord[char.characterId] = char.trust
          }

          // Sync patterns (coreGameState uses same structure)
          const patternUpdate: Partial<PatternTracking> = {
            analytical: core.patterns.analytical || 0,
            helping: core.patterns.helping || 0,
            building: core.patterns.building || 0,
            patience: core.patterns.patience || 0,
            exploring: core.patterns.exploring || 0
          }

          // Sync thoughts
          const thoughts = core.thoughts || []

          // Sync visited scenes (derive from conversation history)
          const visitedScenes: string[] = []
          for (const char of core.characters) {
            for (const nodeId of char.conversationHistory) {
              if (!visitedScenes.includes(nodeId)) {
                visitedScenes.push(nodeId)
              }
            }
          }

          set((state) => ({
            characterTrust: { ...state.characterTrust, ...trustRecord },
            patterns: { ...state.patterns, ...patternUpdate },
            thoughts: thoughts,
            visitedScenes: visitedScenes
          }))
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

        // Reset actions
        resetGame: () => set(initialState),
        resetEmotionalState: () => set({ emotionalState: initialState.emotionalState }),
        resetCognitiveState: () => set({ cognitiveState: initialState.cognitiveState }),
        resetIdentityState: () => set({ identityState: initialState.identityState }),
        resetNeuralState: () => set({ neuralState: initialState.neuralState }),
        resetSkills: () => set({ skills: initialState.skills })
      }),
      {
        name: 'grand-central-game-store',
        version: 1, // Add version for migrations
        migrate: (persistedState: any, version: number) => {
          // Handle migration from corrupted Set data to Arrays
          if (version === 0 && persistedState) {
            try {
              // Fix visitedScenes if it's corrupted Set data
              if (persistedState.visitedScenes && typeof persistedState.visitedScenes === 'object') {
                // If it's not an array, try to convert or reset
                if (!Array.isArray(persistedState.visitedScenes)) {
                  console.warn('Migrating corrupted visitedScenes from Set to Array')
                  persistedState.visitedScenes = []
                }
              }

              // Ensure all required fields exist with proper types
              const migratedState = {
                ...initialState,
                ...persistedState,
                visitedScenes: Array.isArray(persistedState.visitedScenes) ? persistedState.visitedScenes : [],
                choiceHistory: Array.isArray(persistedState.choiceHistory) ? persistedState.choiceHistory : [],
                messages: [], // Don't persist messages
                thoughts: persistedState.thoughts || [] // Migrate thoughts
              }

              return migratedState
            } catch (error) {
              console.warn('State migration failed, using initial state:', error)
              return initialState
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
          characterTrust: state.characterTrust,
          characterHelped: state.characterHelped,
          patterns: state.patterns,
          emotionalState: state.emotionalState,
          cognitiveState: state.cognitiveState,
          identityState: state.identityState,
          neuralState: state.neuralState,
          skills: state.skills,
          thoughts: state.thoughts,
          // Core game state (single source of truth for dialogue system)
          coreGameState: state.coreGameState
        }),
        // Custom storage with validation (moved into persist options per Zustand best practices)
        storage: {
          getItem: (name: string) => {
            try {
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
              localStorage.removeItem(name)
              return null
            }
          },
          setItem: (name: string, value: unknown) => {
            try {
              // Validate serializability before storing
              const serialized = JSON.stringify(value)
              JSON.parse(serialized) // Will throw if not properly serializable
              localStorage.setItem(name, serialized)
            } catch (error) {
              console.error('Failed to store state, data not serializable:', error)
              // Don't throw, just log the error to prevent app crashes
            }
          },
          removeItem: (name: string) => {
            try {
              localStorage.removeItem(name)
            } catch (error) {
              console.warn('Failed to remove localStorage item:', error)
            }
          }
        }
      }
    ),
    { name: 'grand-central-game-store' } // devtools options - only needs name
  )
)

// Validation utilities for serialization
export function validateGameState(state: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    // Test JSON serialization
    const serialized = JSON.stringify(state)
    const deserialized = JSON.parse(serialized)

    // Check that visitedScenes is an array
    if (state.visitedScenes && !Array.isArray(state.visitedScenes)) {
      errors.push('visitedScenes must be an array')
    }

    // Check that choiceHistory is an array
    if (state.choiceHistory && !Array.isArray(state.choiceHistory)) {
      errors.push('choiceHistory must be an array')
    }

    // Check that messages is an array
    if (state.messages && !Array.isArray(state.messages)) {
      errors.push('messages must be an array')
    }

    // Validate that all numeric values are actually numbers
    if (typeof state.performanceLevel !== 'number') {
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
        localStorage.removeItem(storageKey)
        return true
      }
    }

    return false
  } catch (error) {
    console.warn('Error checking localStorage, clearing it:', error)
    localStorage.removeItem('grand-central-game-store')
    return true
  }
}

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
  
  // Character selectors
  useCharacterTrust: (characterId: string) => 
    useGameStore((state) => state.characterTrust[characterId] || 0),
  useCharacterHelped: (characterId: string) => 
    useGameStore((state) => state.characterHelped[characterId] || 0),
  
  // Pattern selectors
  usePatterns: () => useGameStore((state) => state.patterns),
  usePatternValue: (pattern: keyof PatternTracking) => 
    useGameStore((state) => state.patterns[pattern]),
  
  // State selectors
  useEmotionalState: () => useGameStore((state) => state.emotionalState),
  useCognitiveState: () => useGameStore((state) => state.cognitiveState),
  useIdentityState: () => useGameStore((state) => state.identityState),
  useNeuralState: () => useGameStore((state) => state.neuralState),
  useSkills: () => useGameStore((state) => state.skills),

  // Thought Cabinet selectors
  useThoughts: () => useGameStore((state) => state.thoughts),

  // Additional state selectors (for useGame hook optimization)
  useShowIntro: () => useGameStore((state) => state.showIntro),
  useChoiceStartTime: () => useGameStore((state) => state.choiceStartTime),
  useMessageId: () => useGameStore((state) => state.messageId),
  useVisitedScenes: () => useGameStore((state) => state.visitedScenes),
  useChoiceHistory: () => useGameStore((state) => state.choiceHistory),
  usePlatformWarmthAll: () => useGameStore((state) => state.platformWarmth),
  usePlatformAccessibleAll: () => useGameStore((state) => state.platformAccessible),
  useCharacterTrustAll: () => useGameStore((state) => state.characterTrust),
  useCharacterHelpedAll: () => useGameStore((state) => state.characterHelped),

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE GAME STATE SELECTORS: Single source of truth for dialogue system
  // ═══════════════════════════════════════════════════════════════════════════

  // Get serialized core game state (for persistence/sync)
  useCoreGameState: () => useGameStore((state) => state.coreGameState),

  // Get hydrated core game state (with Map/Set restored - for dialogue engine)
  useCoreGameStateHydrated: () => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return null
    return GameStateUtils.deserialize(serialized)
  },

  // Get specific character from core state
  useCoreCharacter: (characterId: string) => {
    const serialized = useGameStore((state) => state.coreGameState)
    if (!serialized) return null
    return serialized.characters.find(c => c.characterId === characterId) || null
  }
}
