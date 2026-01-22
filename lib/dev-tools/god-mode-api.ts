/**
 * God Mode API
 * Global testing utilities for state manipulation and navigation
 *
 * Usage: window.godMode.setTrust('maya', 10)
 *
 * DEVELOPMENT ONLY - Exposed via window.godMode in dev mode
 */

import { useGameStore } from '@/lib/game-store'
import { CHARACTER_IDS, DIALOGUE_GRAPHS, findCharacterForNode, type CharacterId } from '@/lib/graph-registry'
import { type DialogueNode } from '@/lib/dialogue-graph'
import { PATTERN_TYPES, type PatternType } from '@/lib/patterns'
import { SIMULATION_REGISTRY } from '@/lib/simulation-registry'
// THOUGHT_REGISTRY reserved for future thought system integration
import '@/content/thoughts'
import type { SerializableGameState } from '@/lib/character-state'

// Extract character type from SerializableGameState
type SerializedCharacterState = SerializableGameState['characters'][number]
import {
  validateCharacterId,
  validatePattern,
  validateTrust,
  validatePatternLevel,
  validateNodeId,
  validateThoughtId,
  validateMystery,
  checkGameStateHydrated
} from './god-mode-validators'

/**
 * Node cache for performance (findCharacterForNode is expensive)
 */
const nodeCache = new Map<string, ReturnType<typeof findCharacterForNode>>()

function cachedFindNode(nodeId: string) {
  if (!nodeCache.has(nodeId)) {
    const result = validateNodeId(nodeId)
    nodeCache.set(nodeId, result)
  }
  return nodeCache.get(nodeId)
}

/**
 * God Mode API Interface
 */
export interface GodModeAPI {
  // Trust Management
  setTrust(characterId: string, value: number): boolean
  getTrust(characterId: string): number | null

  // Pattern Management
  setPattern(pattern: PatternType, level: number): boolean
  getPattern(pattern: PatternType): number | null
  setAllPatterns(level: number): void

  // Navigation
  jumpToNode(nodeId: string): boolean
  jumpToCharacter(characterId: string): boolean
  listNodes(characterId?: string): string[]
  listCharacters(): string[]

  // Simulation Management
  unlockAllSimulations(): void
  unlockSimulation(characterId: string): boolean
  forceGoldenPrompt(characterId: string): boolean

  // Knowledge Flags
  addKnowledgeFlag(characterId: string, flag: string): void
  addGlobalFlag(flag: string): void
  removeGlobalFlag(flag: string): void
  hasGlobalFlag(flag: string): boolean
  clearAllFlags(): void

  // Thought Cabinet
  addThought(thoughtId: string): void
  internalizeThought(thoughtId: string): void

  // Mystery Progression
  setMystery(mysterySetting: string, value: string): void

  // State Query
  getGameState(): SerializableGameState | null
  getCharacterState(characterId: string): SerializedCharacterState | null
  getCurrentNode(): DialogueNode | null

  // Debug Toggles
  showHiddenChoices(enabled: boolean): void
  skipAnimations(enabled: boolean): void

  // Utility
  exportState(): void
  resetAll(): void
}

/**
 * Create God Mode API instance
 */
export function createGodModeAPI(): GodModeAPI {
  return {
    // ═══════════════════════════════════════════════════════════════════════════
    // TRUST MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    setTrust(characterId: string, value: number): boolean {
      if (!checkGameStateHydrated()) return false
      if (!validateCharacterId(characterId)) {
        console.error(`[God Mode] Invalid character ID: '${characterId}'`)
        return false
      }

      const clampedValue = validateTrust(value)
      const store = useGameStore.getState()

      // Get current trust
      const currentChar = store.coreGameState?.characters.find(c => c.characterId === characterId)
      const currentTrust = currentChar?.trust ?? 0
      const trustChange = clampedValue - currentTrust

      store.applyCoreStateChange({
        characterId,
        trustChange
      })

      console.log(`[God Mode] Set ${characterId} trust: ${currentTrust} → ${clampedValue}`)
      return true
    },

    getTrust(characterId: string): number | null {
      const store = useGameStore.getState()
      if (!store.coreGameState) return null

      const char = store.coreGameState.characters.find(c => c.characterId === characterId)
      return char?.trust ?? null
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PATTERN MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    setPattern(pattern: PatternType, level: number): boolean {
      if (!checkGameStateHydrated()) return false
      if (!validatePattern(pattern)) {
        console.error(`[God Mode] Invalid pattern: '${pattern}'. Valid: ${PATTERN_TYPES.join(', ')}`)
        return false
      }

      const clampedLevel = validatePatternLevel(level)
      const store = useGameStore.getState()
      const currentLevel = store.coreGameState?.patterns[pattern] ?? 0

      store.applyCoreStateChange({
        patternChanges: { [pattern]: clampedLevel }
      })

      console.log(`[God Mode] Set ${pattern} pattern: ${currentLevel} → ${clampedLevel}`)
      return true
    },

    getPattern(pattern: PatternType): number | null {
      const store = useGameStore.getState()
      if (!store.coreGameState) return null

      return store.coreGameState.patterns[pattern] ?? null
    },

    setAllPatterns(level: number): void {
      if (!checkGameStateHydrated()) return

      const clampedLevel = validatePatternLevel(level)
      const changes: Record<PatternType, number> = {} as Record<PatternType, number>

      PATTERN_TYPES.forEach(pattern => {
        changes[pattern] = clampedLevel
      })

      useGameStore.getState().applyCoreStateChange({
        patternChanges: changes
      })

      console.log(`[God Mode] Set all patterns to level ${clampedLevel}`)
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════════

    jumpToNode(nodeId: string): boolean {
      if (!checkGameStateHydrated()) return false

      const result = cachedFindNode(nodeId)
      if (!result) {
        console.error(`[God Mode] Node '${nodeId}' not found`)
        return false
      }

      const store = useGameStore.getState()

      store.updateCoreGameState(state => ({
        ...state,
        currentCharacterId: result.characterId,
        currentNodeId: nodeId
      }))

      console.log(`[God Mode] Jumped to node: ${nodeId} (character: ${result.characterId})`)
      return true
    },

    jumpToCharacter(characterId: string): boolean {
      if (!checkGameStateHydrated()) return false
      if (!validateCharacterId(characterId)) {
        console.error(`[God Mode] Invalid character ID: '${characterId}'`)
        return false
      }

      // Find the character's introduction node
      const graph = DIALOGUE_GRAPHS[characterId as CharacterId]
      if (!graph || graph.nodes.size === 0) {
        console.error(`[God Mode] No dialogue graph found for character '${characterId}'`)
        return false
      }

      // Convert nodes Map to array and find introduction node
      const nodesArray = Array.from(graph.nodes.values())
      const introNode = nodesArray.find(n => n.nodeId.includes('introduction')) || nodesArray[0]

      const store = useGameStore.getState()
      store.updateCoreGameState(state => ({
        ...state,
        currentCharacterId: characterId as CharacterId,
        currentNodeId: introNode.nodeId
      }))

      console.log(`[God Mode] Jumped to character: ${characterId} (node: ${introNode.nodeId})`)
      return true
    },

    listNodes(characterId?: string): string[] {
      const chars = characterId ? [characterId as CharacterId] : (CHARACTER_IDS.filter(id => !id.includes('_')) as CharacterId[])

      const nodes: string[] = []
      chars.forEach(char => {
        const graph = DIALOGUE_GRAPHS[char]
        if (graph) {
          Array.from(graph.nodes.values()).forEach(node => {
            nodes.push(node.nodeId)
          })
        }
      })

      return nodes
    },

    listCharacters(): string[] {
      return [...CHARACTER_IDS]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SIMULATION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    unlockAllSimulations(): void {
      if (!checkGameStateHydrated()) return

      const flags: string[] = []
      SIMULATION_REGISTRY.forEach(sim => {
        if (sim.completionFlag.type === 'global') {
          flags.push(sim.completionFlag.flag)
        }
      })

      useGameStore.getState().applyCoreStateChange({
        addGlobalFlags: flags
      })

      console.log(`[God Mode] Unlocked ${flags.length} simulations`)
    },

    unlockSimulation(characterId: string): boolean {
      if (!checkGameStateHydrated()) return false
      if (!validateCharacterId(characterId)) {
        console.error(`[God Mode] Invalid character ID: '${characterId}'`)
        return false
      }

      const sim = SIMULATION_REGISTRY.find(s => s.characterId === characterId)
      if (!sim) {
        console.error(`[God Mode] No simulation found for character '${characterId}'`)
        return false
      }

      if (sim.completionFlag.type === 'global') {
        useGameStore.getState().applyCoreStateChange({
          addGlobalFlags: [sim.completionFlag.flag]
        })
        console.log(`[God Mode] Unlocked simulation: ${sim.id}`)
        return true
      }

      return false
    },

    forceGoldenPrompt(characterId: string): boolean {
      if (!checkGameStateHydrated()) return false
      if (!validateCharacterId(characterId)) {
        console.error(`[God Mode] Invalid character ID: '${characterId}'`)
        return false
      }

      const sim = SIMULATION_REGISTRY.find(s => s.characterId === characterId)
      if (!sim || !sim.aiTool) {
        console.error(`[God Mode] No AI tool simulation found for character '${characterId}'`)
        return false
      }

      // Add golden prompt flag
      const toolName = sim.aiTool.toLowerCase().replace(/\s+/g, '_')
      const goldenFlag = `golden_prompt_${toolName}`

      useGameStore.getState().applyCoreStateChange({
        addGlobalFlags: [goldenFlag]
      })

      console.log(`[God Mode] Added golden prompt flag: ${goldenFlag}`)
      return true
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // KNOWLEDGE FLAGS
    // ═══════════════════════════════════════════════════════════════════════════

    addKnowledgeFlag(characterId: string, flag: string): void {
      if (!checkGameStateHydrated()) return
      if (!validateCharacterId(characterId)) {
        console.error(`[God Mode] Invalid character ID: '${characterId}'`)
        return
      }

      useGameStore.getState().applyCoreStateChange({
        characterId,
        addKnowledgeFlags: [flag]
      })

      console.log(`[God Mode] Added knowledge flag to ${characterId}: ${flag}`)
    },

    addGlobalFlag(flag: string): void {
      if (!checkGameStateHydrated()) return

      useGameStore.getState().applyCoreStateChange({
        addGlobalFlags: [flag]
      })

      console.log(`[God Mode] Added global flag: ${flag}`)
    },

    removeGlobalFlag(flag: string): void {
      if (!checkGameStateHydrated()) return

      const store = useGameStore.getState()
      store.updateCoreGameState(state => ({
        ...state,
        globalFlags: state.globalFlags.filter(f => f !== flag)
      }))

      console.log(`[God Mode] Removed global flag: ${flag}`)
    },

    hasGlobalFlag(flag: string): boolean {
      const store = useGameStore.getState()
      if (!store.coreGameState) return false

      return store.coreGameState.globalFlags.includes(flag)
    },

    clearAllFlags(): void {
      if (!checkGameStateHydrated()) return

      const store = useGameStore.getState()
      store.updateCoreGameState(state => ({
        ...state,
        globalFlags: []
      }))

      console.log('[God Mode] Cleared all global flags')
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // THOUGHT CABINET
    // ═══════════════════════════════════════════════════════════════════════════

    addThought(thoughtId: string): void {
      if (!checkGameStateHydrated()) return
      if (!validateThoughtId(thoughtId)) return

      useGameStore.getState().applyCoreStateChange({
        thoughtId
      })

      console.log(`[God Mode] Added thought: ${thoughtId}`)
    },

    internalizeThought(thoughtId: string): void {
      if (!checkGameStateHydrated()) return
      if (!validateThoughtId(thoughtId)) return

      useGameStore.getState().applyCoreStateChange({
        thoughtId,
        internalizeThought: true
      })

      console.log(`[God Mode] Internalized thought: ${thoughtId}`)
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MYSTERY PROGRESSION
    // ═══════════════════════════════════════════════════════════════════════════

    setMystery(mysterySetting: string, value: string): void {
      if (!checkGameStateHydrated()) return
      if (!validateMystery(mysterySetting, value)) return

      useGameStore.getState().applyCoreStateChange({
        mysteryChanges: { [mysterySetting]: value }
      })

      console.log(`[God Mode] Set mystery ${mysterySetting} = ${value}`)
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // STATE QUERY
    // ═══════════════════════════════════════════════════════════════════════════

    getGameState(): SerializableGameState | null {
      return useGameStore.getState().coreGameState
    },

    getCharacterState(characterId: string): SerializedCharacterState | null {
      const store = useGameStore.getState()
      if (!store.coreGameState) return null

      const char = store.coreGameState.characters.find(c => c.characterId === characterId)
      return char || null
    },

    getCurrentNode(): DialogueNode | null {
      const store = useGameStore.getState()
      if (!store.coreGameState?.currentNodeId || !store.coreGameState?.currentCharacterId) return null

      const graph = DIALOGUE_GRAPHS[store.coreGameState.currentCharacterId]
      if (!graph) return null

      return graph.nodes.get(store.coreGameState.currentNodeId) || null
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DEBUG TOGGLES
    // ═══════════════════════════════════════════════════════════════════════════

    showHiddenChoices(enabled: boolean): void {
      // Store in localStorage for persistence
      if (enabled) {
        localStorage.setItem('godMode_showHiddenChoices', 'true')
        console.log('[God Mode] Hidden choices enabled (requires page refresh)')
      } else {
        localStorage.removeItem('godMode_showHiddenChoices')
        console.log('[God Mode] Hidden choices disabled (requires page refresh)')
      }
    },

    skipAnimations(enabled: boolean): void {
      if (enabled) {
        localStorage.setItem('godMode_skipAnimations', 'true')
        console.log('[God Mode] Animations disabled (requires page refresh)')
      } else {
        localStorage.removeItem('godMode_skipAnimations')
        console.log('[God Mode] Animations enabled (requires page refresh)')
      }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    exportState(): void {
      const state = useGameStore.getState().coreGameState
      if (!state) {
        console.error('[God Mode] No game state to export')
        return
      }

      const json = JSON.stringify(state, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lux-story-state-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)

      console.log('[God Mode] State exported to JSON file')
    },

    resetAll(): void {
      if (!confirm('[God Mode] Reset all game state? This cannot be undone.')) {
        return
      }

      const _store = useGameStore.getState()
      // Only clear game-related storage, not all localStorage
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('game-') || key.includes('godMode'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))

      nodeCache.clear()

      console.log('[God Mode] Game state cleared. Refresh page to start fresh.')
    }
  }
}
