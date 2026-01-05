import { StationAtmosphere, AmbientEvent } from '@/lib/station-state'
import { GameState } from '@/lib/character-state'

export const ATMOSPHERES: Record<StationAtmosphere, {
    id: StationAtmosphere
    description: string
    colorBase: string // CSS variable value or hex
    intensity: number // 0-1
}> = {
    dormant: {
        id: 'dormant',
        description: 'The station sleeps. Dust motes dance in stale air.',
        colorBase: '240 10% 20%', // slate-800 equivalent
        intensity: 0.2
    },
    awakening: {
        id: 'awakening',
        description: 'Systems flickered to life. A low hum vibrates through the floor.',
        colorBase: '200 40% 30%', // blue-muted
        intensity: 0.4
    },
    alive: {
        id: 'alive',
        description: 'The station breathes. Lights pulse with a steady rhythm.',
        colorBase: '150 50% 30%', // emerald-muted
        intensity: 0.7
    },
    tense: {
        id: 'tense',
        description: 'Thick tension hangs in the air. Shadows seem longer.',
        colorBase: '0 40% 30%', // red-muted
        intensity: 0.8
    },
    harmonious: {
        id: 'harmonious',
        description: 'A sense of unity. The machinery sings in chorus.',
        colorBase: '280 40% 30%', // purple-muted
        intensity: 1.0
    }
}

/**
 * Calculate the target atmosphere based on game state flags
 */
export function calculateAmbientContext(gameState: GameState): {
    atmosphere: StationAtmosphere
    activeEvents: AmbientEvent[]
} {
    let atmosphere: StationAtmosphere = 'dormant'
    const flags = gameState.globalFlags

    // Progression Logic
    if (flags.has('station_power_restored')) {
        atmosphere = 'awakening'
    }

    // Check for arc completions
    let completedArcs = 0
    // We can count flags like 'maya_arc_complete', 'devon_arc_complete' etc.
    gameState.globalFlags.forEach(flag => {
        if (flag.endsWith('_arc_complete')) completedArcs++
    })

    if (completedArcs >= 1) atmosphere = 'awakening'
    if (completedArcs >= 3) atmosphere = 'alive'
    if (completedArcs >= 5) atmosphere = 'harmonious'

    // Override: Crisis flags
    if (flags.has('station_crisis_active')) {
        atmosphere = 'tense'
    }

    // Ambient Events (Flavor text for the UI)
    const activeEvents: AmbientEvent[] = []

    if (flags.has('maya_arc_complete')) {
        activeEvents.push({
            id: 'maya_robot',
            text: 'A small drone hums past, carrying a spare part.',
            intensity: 'subtle'
        })
    }


    // AI Ambience (Future of Work)
    if (gameState.patterns.analytical > 6) {
        activeEvents.push({
            id: 'ai_display',
            text: 'Data streams on the walls seem to reorganize themselves before you can even articulate the query.',
            intensity: 'noticeable'
        })
    }
    if (gameState.patterns.building > 6) {
        activeEvents.push({
            id: 'ai_agent',
            text: 'A maintenance bot corrects a structural flaw without anyone issuing a command. Agentic workflow in action.',
            intensity: 'noticeable'
        })
    }
    return { atmosphere, activeEvents }
}
