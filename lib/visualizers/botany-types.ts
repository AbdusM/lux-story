/**
 * Botany Simulation Types
 * 
 * Defines the configuration for the Hydroponic Grid simulation.
 */

export interface BotanyState {
    nitrogen: number
    phosphorus: number
    potassium: number
}

export interface BotanyTarget {
    targetState: BotanyState
    tolerance: number // Allowable deviation (+/-) per nutrient
    plantName: string // e.g., "Moonlight Orchid"
    hint: string // e.g., "Elevated nitrogen required..."
}

export interface BotanyResult {
    health: number
    nutrients: BotanyState
    isOptimal: boolean
}
