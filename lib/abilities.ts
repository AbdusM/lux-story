import { OrbTier } from './orbs'
import { PatternType } from './patterns'

export type AbilityId =
    // Analytical
    | 'analytical_1' | 'analytical_2' | 'analytical_3'
    // Patience
    | 'patience_1' | 'patience_2' | 'patience_3'
    // Exploring
    | 'exploring_1' | 'exploring_2' | 'exploring_3'
    // Helping
    | 'helping_1' | 'helping_2' | 'helping_3'
    // Building
    | 'building_1' | 'building_2' | 'building_3'

    // Legacy (Keep for compatibility if needed, or map them)
    | 'subtext_reader' | 'pattern_preview' | 'deep_intuition'

export interface Ability {
    id: AbilityId
    name: string
    description: string
    tier: OrbTier
    effectType: 'ui_enhancement' | 'narrative_unlock'
    pattern?: PatternType // P4: Pattern specific unlock
}

export const ABILITIES: Record<AbilityId, Ability> = {
    // ============= LEGACY (Mapped to new ones conceptually) =============
    subtext_reader: {
        id: 'subtext_reader',
        name: 'Emotional Resonance',
        description: 'Perceive the unspoken emotions beneath character dialogue.',
        tier: 'emerging',
        effectType: 'ui_enhancement',
        pattern: 'helping'
    },
    pattern_preview: {
        id: 'pattern_preview',
        name: 'Pattern Recognition',
        description: 'Anticipate how your choices will shape your identity.',
        tier: 'developing',
        effectType: 'ui_enhancement',
        pattern: 'analytical'
    },
    deep_intuition: {
        id: 'deep_intuition',
        name: 'Deep Intuition',
        description: 'Sense when a pivotal moment is approaching.',
        tier: 'flourishing',
        effectType: 'narrative_unlock',
        pattern: 'patience'
    },

    // ============= ANALYTICAL =============
    analytical_1: {
        id: 'analytical_1',
        name: 'Pattern Recognition',
        description: 'See which pattern a choice will reinforce before you make it.',
        tier: 'emerging', // 10 Orbs
        effectType: 'ui_enhancement',
        pattern: 'analytical'
    },
    analytical_2: {
        id: 'analytical_2',
        name: 'Logic Mapping',
        description: 'Visualize the logical flow of arguments in dialogue.',
        tier: 'developing', // 30 Orbs
        effectType: 'ui_enhancement',
        pattern: 'analytical'
    },
    analytical_3: {
        id: 'analytical_3',
        name: 'System Sight',
        description: 'Deconstruct complex station systems to reveal hidden options.',
        tier: 'flourishing', // 60 Orbs
        effectType: 'narrative_unlock',
        pattern: 'analytical'
    },

    // ============= PATIENCE =============
    patience_1: {
        id: 'patience_1',
        name: 'Deep Listening',
        description: 'Hear what isn\'t being said. Reveal hidden emotional subtext.',
        tier: 'emerging',
        effectType: 'ui_enhancement',
        pattern: 'patience'
    },
    patience_2: {
        id: 'patience_2',
        name: 'Strategic Delay',
        description: 'Unlock the ability to "Wait" in moments of high tension.',
        tier: 'developing',
        effectType: 'narrative_unlock',
        pattern: 'patience'
    },
    patience_3: {
        id: 'patience_3',
        name: 'Time Dilation',
        description: 'Slow down critical decision moments to think clearly.',
        tier: 'flourishing',
        effectType: 'ui_enhancement',
        pattern: 'patience'
    },

    // ============= EXPLORING =============
    exploring_1: {
        id: 'exploring_1',
        name: 'Pathfinder',
        description: 'Highlight choices that lead to new locations or secrets.',
        tier: 'emerging',
        effectType: 'ui_enhancement',
        pattern: 'exploring'
    },
    exploring_2: {
        id: 'exploring_2',
        name: 'Secret Seeker',
        description: 'Sense when an area holds hidden lore or items.',
        tier: 'developing',
        effectType: 'ui_enhancement',
        pattern: 'exploring'
    },
    exploring_3: {
        id: 'exploring_3',
        name: 'Horizon Gaze',
        description: 'Unlock "Wander" options that reveal map secrets.',
        tier: 'flourishing',
        effectType: 'narrative_unlock',
        pattern: 'exploring'
    },

    // ============= HELPING =============
    helping_1: {
        id: 'helping_1',
        name: 'Empathy Link',
        description: 'See how your words will impact trust before speaking.',
        tier: 'emerging',
        effectType: 'ui_enhancement',
        pattern: 'helping'
    },
    helping_2: {
        id: 'helping_2',
        name: 'Mediator',
        description: 'Unlock options to de-escalate conflicts between characters.',
        tier: 'developing',
        effectType: 'narrative_unlock',
        pattern: 'helping'
    },
    helping_3: {
        id: 'helping_3',
        name: 'Recall Bond',
        description: 'Reference shared memories to deepen connections instantly.',
        tier: 'flourishing',
        effectType: 'narrative_unlock',
        pattern: 'helping'
    },

    // ============= BUILDING =============
    building_1: {
        id: 'building_1',
        name: 'Blueprint Vision',
        description: 'Understand the technical requirements of station repairs.',
        tier: 'emerging',
        effectType: 'ui_enhancement',
        pattern: 'building'
    },
    building_2: {
        id: 'building_2',
        name: 'Constructive Eye',
        description: 'Identify opportunities to fix or improve station systems.',
        tier: 'developing',
        effectType: 'ui_enhancement',
        pattern: 'building'
    },
    building_3: {
        id: 'building_3',
        name: 'Master Builder',
        description: 'Unlock "Rebuild" options that permanently alter the station.',
        tier: 'flourishing',
        effectType: 'narrative_unlock',
        pattern: 'building'
    }
}

export function getAbility(id: AbilityId): Ability {
    return ABILITIES[id]
}

export function getAbilitiesForTier(tier: OrbTier): Ability[] {
    return Object.values(ABILITIES).filter(a => a.tier === tier)
}
