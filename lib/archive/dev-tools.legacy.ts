/* eslint-disable @typescript-eslint/no-explicit-any */
// Archived - imports updated for archive location
import { useGameStore } from '../game-store'
import { type PatternType } from '../patterns'

/**
 * God Mode API Interface
 * Exposed to window.godMode in development
 */
export interface GodModeAPI {
    // State manipulation
    setTrust: (characterId: string, value: number) => void
    setPattern: (pattern: PatternType, level: number) => void
    addKnowledgeFlag: (flag: string) => void
    setNervousSystem: (state: 'ventral' | 'sympathetic' | 'dorsal') => void

    // Scene navigation
    jumpToNode: (nodeId: string) => void
    jumpToCharacter: (characterId: string) => void
    replayScene: (sceneId: string) => void

    // Time manipulation
    skipThinkingDelay: () => void
    skipTypingAnimation: () => void

    // Simulation controls
    unlockAllSimulations: () => void
    resetSimulationProgress: (simId: string) => void
    forceGoldenPrompt: (simId: string) => void

    // System toggles
    showHiddenChoices: (show: boolean) => void
    showStateConditions: (show: boolean) => void
    showInterruptWindows: (show: boolean) => void

    // Reset
    resetAll: () => void
}

/**
 * Character ID to Hub Node ID mapping
 * Helper for jumpToCharacter
 */
const CHARACTER_START_NODES: Record<string, string> = {
    'samuel': 'samuel_hub_01',
    'maya': 'maya_intro_01',
    'devon': 'devon_intro_01',
    'tess': 'tess_intro_01',
    'marcus': 'marcus_intro_01',
    'rohan': 'rohan_intro_01',
    'yaquin': 'yaquin_intro_01',
    'jordan': 'jordan_intro_01',
    'kai': 'kai_intro_01',
    'silas': 'silas_intro_01',
    'alex': 'alex_intro_01',
    'grace': 'grace_intro_01'
}

/**
 * Create the God Mode API implementation
 * This connects the window object to the Zustand store
 */
export function createGodModeAPI(): GodModeAPI {
    // Get store reference
    const getStore = () => useGameStore.getState()

    return {
        // --- State Manipulation ---

        setTrust: (characterId: string, value: number) => {
            console.log(`[God Mode] Setting trust for ${characterId} to ${value}`)
            getStore().updateCharacterTrust(characterId, value)
        },

        setPattern: (pattern: PatternType, level: number) => {
            console.log(`[God Mode] Setting pattern ${pattern} to ${level}`)
            getStore().updatePatterns({ [pattern]: level })
        },

        addKnowledgeFlag: (flag: string) => {
            console.log(`[God Mode] Adding knowledge flag: ${flag}`)
            // Note: Flags are usually in coreGameState.flags or similar. 
            // We'll update the core state directly since there isn't a top-level action just for flags
            getStore().updateCoreGameState(state => ({
                ...state,
                flags: [...(state.flags || []), flag].filter((f, i, arr) => arr.indexOf(f) === i)
            }))
        },

        setNervousSystem: (state: 'ventral' | 'sympathetic' | 'dorsal') => {
            console.log(`[God Mode] Setting nervous system to ${state}`)
            // This is usually derived, but we can try to force the current character's state
            getStore().updateCoreGameState(core => {
                if (!core.currentCharacterId) return core
                return {
                    ...core,
                    characters: core.characters.map(c =>
                        c.characterId === core.currentCharacterId
                            ? { ...c, nervousSystemState: (`${state}_vagal` as any) } // Mapping to internal types
                            : c
                    )
                }
            })
        },

        // --- Scene Navigation ---

        jumpToNode: (nodeId: string) => {
            console.log(`[God Mode] Jumping to node: ${nodeId}`)
            getStore().setCurrentScene(nodeId)
        },

        jumpToCharacter: (characterId: string) => {
            const nodeId = CHARACTER_START_NODES[characterId]
            if (nodeId) {
                console.log(`[God Mode] Jumping to character ${characterId} (Node: ${nodeId})`)
                getStore().setCurrentScene(nodeId)
            } else {
                console.warn(`[God Mode] Unknown start node for character: ${characterId}`)
            }
        },

        replayScene: (sceneId: string) => {
            console.log(`[God Mode] Replaying scene: ${sceneId}`)
            getStore().setCurrentScene(sceneId)
        },

        // --- Time Manipulation ---

        skipThinkingDelay: () => {
            console.log('[God Mode] Skipping thinking delay')
                // This would require a store flag that the DialogueRenderer respects
                // Implementing as a console log for now, requires hook in renderer
                (window as any).__GOD_MODE_SKIP_THINKING = true
        },

        skipTypingAnimation: () => {
            console.log('[God Mode] Skipping typing animation')
                (window as any).__GOD_MODE_SKIP_TYPING = true
        },

        // --- Simulation Controls ---

        unlockAllSimulations: () => {
            console.log('[God Mode] Unlocking all simulations')
            // This would likely involve adding 'sim_unlocked' flags for all characters
            const simFlags = Object.keys(CHARACTER_START_NODES).map(id => `${id}_sim_unlocked`)
            getStore().updateCoreGameState(state => ({
                ...state,
                flags: [...(state.flags || []), ...simFlags].filter((f, i, arr) => arr.indexOf(f) === i)
            }))
        },

        resetSimulationProgress: (simId: string) => {
            console.log(`[God Mode] Resetting simulation: ${simId}`)
            // TBD: Depends on how simulation progress is stored
        },

        forceGoldenPrompt: (simId: string) => {
            console.log(`[God Mode] Forcing Golden Prompt for: ${simId}`)
            getStore().addThought('golden_prompt_generic')
            // Add specific flag
            getStore().updateCoreGameState(state => ({
                ...state,
                flags: [...(state.flags || []), `golden_prompt_${simId}`]
            }))
        },

        // --- System Toggles ---

        showHiddenChoices: (show: boolean) => {
            console.log(`[God Mode] Show hidden choices: ${show}`)
            useGameStore.setState({ debugSimulation: show ? { id: 'debug-choices' } as any : null })
        },

        showStateConditions: (show: boolean) => {
            console.log(`[God Mode] Show state conditions: ${show}`)
            // Hook into UI renderer
        },

        showInterruptWindows: (show: boolean) => {
            console.log(`[God Mode] Show interrupt windows: ${show}`)
            // Hook into InterruptSystem
        },

        // --- Reset ---

        resetAll: () => {
            console.log('[God Mode] Resetting all state')
            getStore().resetGame()
            localStorage.clear()
            window.location.reload()
        }
    }
}
