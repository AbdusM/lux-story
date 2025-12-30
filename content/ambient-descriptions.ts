import { StationAtmosphere, PlatformVisualState } from '@/lib/station-state'
import { GameState } from '@/lib/game-store'

// ============================================================================
// SYSTEM: AMBIENT DESCRIPTIONS
// Maps GameState (flags, trust) to World State (Atmosphere, Visuals)
// ============================================================================

interface AmbientContext {
    atmosphere: StationAtmosphere
    description: string
    platformVisuals: Record<string, PlatformVisualState[]>
}

export function calculateAmbientContext(gameState: GameState): AmbientContext {
    const flags = new Set(gameState.coreGameState?.globalFlags || [])
    const characterTrust = gameState.characterTrust || {}

    // 1. DETERMINE ATMOSPHERE
    // ------------------------------------------------------------------------
    let atmosphere: StationAtmosphere = 'dormant'

    // Count completed arcs (approximate via flags)
    const completedArcs = [
        flags.has('maya_arc_complete'),
        flags.has('devon_arc_complete'),
        flags.has('grace_arc_complete'),
        flags.has('elena_arc_complete')
    ].filter(Boolean).length

    if (completedArcs >= 3) atmosphere = 'harmonious'
    else if (completedArcs >= 1) atmosphere = 'alive'
    else if (completedArcs === 0 && gameState.visitedScenes.length > 5) atmosphere = 'awakening'

    // 2. GENERATE GLOBAL DESCRIPTION
    // ------------------------------------------------------------------------
    const ATMOSPHERE_DESCRIPTIONS: Record<StationAtmosphere, string> = {
        dormant: "The station hums with a low, lonely vibration. Dust motes dance in the empty atrium light.",
        awakening: "There's a new rhythm to the machinery today. The station feels like it's stretching its limbs.",
        alive: "The atrium is brighter now. Distant sounds of activity drift from the platforms.",
        tense: "A heavy static hangs in the air. The station lights flicker with uncertainty.",
        harmonious: "The station sings. Systems weave together in a complex, beautiful hum of activity."
    }

    // 3. GENERATE PLATFORM VISUALS
    // ------------------------------------------------------------------------
    const visuals: Record<string, PlatformVisualState[]> = {}

    // Helper to add visual
    const addVisual = (platformId: string, id: string, text: string) => {
        if (!visuals[platformId]) visuals[platformId] = []
        visuals[platformId].push({ id, description: text, isActive: true })
    }

    // --- MAYA (Engineered/Robotics) ---
    if (flags.has('maya_arc_complete')) {
        addVisual('engineering', 'maya-drones', "Small maintenance drones zip overhead, carrying parts with purpose.")
    } else if (flags.has('knows_maya')) {
        addVisual('engineering', 'maya-light', "A workshop light flickers late into the 'night'.")
    }

    // --- DEVON (Systems) ---
    if (flags.has('devon_arc_complete')) {
        addVisual('systems', 'devon-flow', "The data cables pulse with a steady, rhythmic blue light.")
    }

    // --- GRACE (Records/Memory) ---
    if (flags.has('grace_arc_complete')) {
        addVisual('archives', 'grace-music', "Faint, classical music drifts from the records room.")
    }

    return {
        atmosphere,
        description: ATMOSPHERE_DESCRIPTIONS[atmosphere],
        platformVisuals: visuals
    }
}
