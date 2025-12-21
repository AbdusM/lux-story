/**
 * ISP The Reactor Core
 * 
 * Logic for "Chemical Reactions" between Biological State and Player Skills.
 * Implements the "Systemic Gameplay" found in Zelda analysis.
 */

import { NervousSystemState, ChemicalReaction } from './emotions'

/**
 * Calculates if a systemic reaction occurs based on the mix of Biology (State) and Agency (Skills).
 */
export function calculateReaction(
    state: NervousSystemState,
    skills: Record<string, number>,
    trust: number
): ChemicalReaction | null {
    // 1. Extract Signal Strength
    // We only care about dominant skills (level > 3) to trigger reactions
    const empathy = skills.helping || 0
    const analysis = skills.analytical || 0
    const patience = skills.patience || 0
    const resilience = skills.resilience || 0

    // 2. The Reaction Matrix

    // --- SCENARIO A: HIGH ENERGY (Sympathetic) ---
    if (state === 'sympathetic') {
        // REACTION 1: COLD FUSION (Fire + Air)
        // High Anxiety channeled into Analytical thought provides "Hyper-Focus"
        if (analysis > 5) {
            return {
                type: 'cold_fusion',
                intensity: Math.min(1, analysis / 10),
                description: 'Anxiety transmuted into precision focus.'
            }
        }

        // REACTION 2: RESONANCE (Fire + Water)
        // High Anxiety met with Empathy creates "Vulnerable Connection"
        if (empathy > 5) {
            return {
                type: 'resonance',
                intensity: Math.min(1, empathy / 10),
                description: 'Shared vulnerability creates a safe harbor.'
            }
        }

        // REACTION 3: VOLATILITY (Fire + Fire)
        // High Anxiety met with Resistance (Low Patience, Low Trust) causes sparks
        if (patience < 3 && trust < 5) {
            return {
                type: 'volatility',
                intensity: 0.8,
                description: 'Unchecked anxiety creates friction.'
            }
        }
    }

    // --- SCENARIO B: LOW ENERGY (Dorsal) ---
    if (state === 'dorsal_vagal') {
        // REACTION 4: DEEP ROOTING (Void + Earth)
        // Shutdown met with Patience prevents total collapse
        if (patience > 5 || resilience > 5) {
            return {
                type: 'deep_rooting',
                intensity: Math.min(1, Math.max(patience, resilience) / 10),
                description: 'Stillness used to regain footing.'
            }
        }

        // REACTION 5: TOTAL SHUTDOWN
        // No skill buffer available
        return {
            type: 'shutdown',
            intensity: 1.0,
            description: 'System collapse. Disconnection.'
        }
    }

    // Ventral state is stable, usually no "Reaction" needed, just flow.
    return null
}
