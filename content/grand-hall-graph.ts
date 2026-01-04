import { DialogueGraph } from '@/lib/dialogue-graph'

export const grandHallGraph: DialogueGraph = {
    version: '2.0',
    metadata: {
        title: 'Sector 1: The Grand Hall',
        author: 'Archivist',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: 3,
        totalChoices: 0
    },
    startNodeId: 'sector_1_hall',
    nodes: new Map([
        // ==========================================
        // SECTOR 1: THE GRAND HALL (Technocrat View / Default)
        // ==========================================
        ['sector_1_hall', {
            nodeId: 'sector_1_hall',
            speaker: 'Narrator',
            content: [{
                text: 'The Grand Atrium gleams under soft, filtered sunlight. The marble floor is spotless, reflecting the holographic "Founders Wall" that celebrates our ascent.',
                variation_id: 'hall_tech',
                interaction: 'bloom',
                richEffectContext: 'success'
            }],
            choices: [
                {
                    choiceId: 'inspect_wall_tech',
                    text: 'Admire the Founders Wall',
                    nextNodeId: 'wall_tech'
                },
                {
                    choiceId: 'switch_to_real',
                    text: '[DEBUG] Toggle Reality',
                    nextNodeId: 'sector_1_hall_real',
                    consequence: { addGlobalFlags: ['view_mode_reality'] }
                },
                {
                    choiceId: 'enter_market',
                    text: 'Visit the "Asset Exchange"',
                    nextNodeId: 'sector_2_market'
                },
                {
                    choiceId: 'enter_core',
                    text: 'Take the Service Elevator (Sector 3)',
                    nextNodeId: 'sector_3_office',
                    visibleCondition: { hasGlobalFlags: ['has_access_sector_3'] } // Gated by Market Purchase
                }
            ],
            simulation: {
                type: 'visual_canvas',
                title: 'Reality Lens: Technocrat View',
                taskDescription: 'Current View: ERA 3 (AUGMENTED). Slide to reveal underlying structure.',
                initialContext: {
                    label: 'LENS_STATUS',
                    content: 'MODE: AUGMENTED (STABLE)',
                    displayStyle: 'text'
                },
                successFeedback: 'LENS ADJUSTED.'
            }
        }],

        // ==========================================
        // SECTOR 1: THE GRAND HALL (Realist View)
        // ==========================================
        ['sector_1_hall_real', {
            nodeId: 'sector_1_hall_real',
            speaker: 'Narrator',
            content: [{
                text: 'The "sunlight" is a halogen strip buzzing at 60Hz. The concrete floor is cracked. The "Founders Wall" is a peeling poster covering a hole in the hull.',
                variation_id: 'hall_real',
                interaction: 'shake',
                richEffectContext: 'warning'
            }],
            choices: [
                {
                    choiceId: 'inspect_wall_real',
                    text: 'Investigate the peeling poster',
                    nextNodeId: 'wall_real'
                },
                {
                    choiceId: 'switch_to_tech',
                    text: '[DEBUG] Toggle Reality',
                    nextNodeId: 'sector_1_hall',
                    consequence: { removeGlobalFlags: ['view_mode_reality'] }
                }
            ],
            simulation: {
                type: 'visual_canvas',
                title: 'Reality Lens: Realist View',
                taskDescription: 'Current View: ERA 2 (ABSOLUTE). Slide to restore augmentation.',
                initialContext: {
                    label: 'LENS_STATUS',
                    content: 'MODE: ABSOLUTE (DECAYED)',
                    displayStyle: 'text'
                },
                successFeedback: 'LENS ADJUSTED.'
            }
        }],

        // ==========================================
        // INTERACTABLES
        // ==========================================
        ['wall_tech', {
            nodeId: 'wall_tech',
            speaker: 'Narrator',
            content: [{
                text: 'The holographic faces of the Council smile down. "Unity through Purpose," the caption reads.',
                variation_id: 'wall_tech_desc'
            }],
            choices: [{ choiceId: 'back_tech', text: 'Step back', nextNodeId: 'sector_1_hall' }]
        }],

        ['wall_real', {
            nodeId: 'wall_real',
            speaker: 'Narrator',
            content: [{
                text: 'You peel back the edge of the poster. Behind it is a manual airlock handle modeled in heavy iron. It is labeled "EMERGENCY VENT - SECTOR 0".',
                variation_id: 'wall_real_desc'
            }],
            choices: [
                {
                    choiceId: 'use_handle',
                    text: 'Turn the handle',
                    nextNodeId: 'found_secret_passage',
                    skills: ['curiosity', 'criticalThinking']
                },
                { choiceId: 'back_real', text: 'Step back', nextNodeId: 'sector_1_hall_real' }
            ]
        }],

        ['found_secret_passage', {
            nodeId: 'found_secret_passage',
            speaker: 'Narrator',
            content: [{
                text: 'The wall groans. Not a door, but a panel in the hull itself slides back. A dark crawling space leads... Up? Or deeper?',
                variation_id: 'secret_reveal'
            }],
            choices: [
                { choiceId: 'enter_crawlspace', text: 'Enter the crawlspace', nextNodeId: 'sector_0_hub' }, // Link to Station Entry (Sector 0)
                { choiceId: 'stay_hall', text: 'Stay in the Hall', nextNodeId: 'sector_1_hall_real' }
            ]
        }]
    ])
}
