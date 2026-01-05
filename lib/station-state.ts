import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// ============================================================================
// STATION STATE SCHEMA
// ============================================================================

export type StationAtmosphere = 'dormant' | 'awakening' | 'alive' | 'tense' | 'harmonious'

export interface PlatformVisualState {
    id: string
    description: string
    isActive: boolean
    sourceFlag?: string // The global flag that triggered this
}

export interface AmbientEvent {
    id: string
    text: string
    duration?: number
    intensity: 'subtle' | 'noticeable' | 'urgent'
}

export interface StationState {
    // General vibe of the station
    atmosphere: StationAtmosphere

    // Specific visual changes per platform (e.g., 'platform_1': [VisualState])
    platformVisuals: Record<string, PlatformVisualState[]>

    // Active ambient events currently in the queue
    activeAmbientEvents: AmbientEvent[]

    // Tracked metrics for the station's health
    stationIntegrity: number // 0-1
    energyLevel: number // 0-1
}

// ============================================================================
// ACTIONS
// ============================================================================

export interface StationActions {
    setAtmosphere: (atmosphere: StationAtmosphere) => void
    addPlatformVisual: (platformId: string, visual: PlatformVisualState) => void
    removePlatformVisual: (platformId: string, visualId: string) => void
    triggerAmbientEvent: (event: AmbientEvent) => void
    clearExpiredEvents: () => void
    updateIntegrity: (delta: number) => void
    resetStation: () => void
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

const initialState: StationState = {
    atmosphere: 'dormant',
    platformVisuals: {},
    activeAmbientEvents: [],
    stationIntegrity: 0.5,
    energyLevel: 0.2
}

export const useStationStore = create<StationState & StationActions>()(
    devtools(
        persist(
            (set, _get) => ({
                ...initialState,

                setAtmosphere: (atmosphere) => set({ atmosphere }),

                addPlatformVisual: (platformId, visual) => set((state) => {
                    const current = state.platformVisuals[platformId] || []
                    // Avoid duplicates
                    if (current.some(v => v.id === visual.id)) return state

                    return {
                        platformVisuals: {
                            ...state.platformVisuals,
                            [platformId]: [...current, visual]
                        }
                    }
                }),

                removePlatformVisual: (platformId, visualId) => set((state) => {
                    const current = state.platformVisuals[platformId] || []
                    return {
                        platformVisuals: {
                            ...state.platformVisuals,
                            [platformId]: current.filter(v => v.id !== visualId)
                        }
                    }
                }),

                triggerAmbientEvent: (event) => set((state) => ({
                    activeAmbientEvents: [...state.activeAmbientEvents, event]
                })),

                clearExpiredEvents: () => set({ activeAmbientEvents: [] }),

                updateIntegrity: (delta) => set((state) => ({
                    stationIntegrity: Math.max(0, Math.min(1, state.stationIntegrity + delta))
                })),

                resetStation: () => set(initialState)
            }),
            {
                name: 'station-evolution-store'
            }
        )
    )
)
