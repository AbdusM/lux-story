import { DialogueGraph } from '@/lib/dialogue-graph'

export const stationEntryGraph: DialogueGraph = {
    version: '2.0', // Updated for Overdensity Era
    metadata: {
        title: 'Sector 0: The Station Entry',
        author: 'Archivist',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: 5,
        totalChoices: 0
    },
    startNodeId: 'sector_0_entry',
    nodes: new Map([
        // ==========================================
        // SECTOR 0: THE CHRONO-SPATIAL THRESHOLD
        // ==========================================
        ['sector_0_entry', {
            nodeId: 'sector_0_entry',
            speaker: 'Narrator',
            content: [
                {
                    text: 'You stand at the threshold of Sector 0. The air tastes stale but electrified.',
                    variation_id: 'base_entry',
                    interaction: 'ripple'
                }
            ],
            choices: [], // Simulation handles interaction
            simulation: {
                type: 'visual_canvas',
                title: 'Sector 0: Augmented Reality Filter',
                taskDescription: 'The AR overlay is glitching. Something older is trying to push through.',
                initialContext: {
                    label: 'AR_LAYER_V3.0',
                    content: 'WELCOME GUEST 9940. THE STATION IS SAFE. THE STATION IS CLEAN.',
                    displayStyle: 'image_placeholder'
                },
                successFeedback: 'ERROR: AR LAYER DISSOLVED. ERA 2 MECHANICS EXPOSED.'
            },
            // Logic: If player solves the puzzle (Simulation returns success), 
            // the game should transition to the 'unlocked' state or next node.
            // Note: SimulationRenderer usually handles the 'exit' or 'complete' event 
            // by triggering a callback. We might need a 'next' node for the success state.
        }],

        // ==========================================
        // ERA 1: THE ROOT (Biological)
        // Occurs if player has high 'sensitivity' or specific flags
        // ==========================================
        ['sector_0_bio_reveal', {
            nodeId: 'sector_0_bio_reveal',
            speaker: 'Narrator',
            content: [{
                text: 'The smooth floor dissolves into calcified root-matter. You hear breathing beneath the tiles.',
                variation_id: 'bio_reveal',
                emotion: 'fear_awe'
            }],
            choices: [
                {
                    choiceId: 'touch_root',
                    text: 'Place your hand on the warm floor',
                    nextNodeId: 'sector_0_bio_connect',
                    skills: ['empathy']
                }
            ]
        }],

        ['sector_0_bio_connect', {
            nodeId: 'sector_0_bio_connect',
            speaker: 'Station',
            content: [{
                text: 'A pulse travels up your arm. Not electricity. Blood.',
                variation_id: 'bio_connect'
            }],
            choices: [
                {
                    choiceId: 'pull_back',
                    text: 'Pull back',
                    nextNodeId: 'sector_0_hub'
                }
            ]
        }],

        // ==========================================
        // ERA 2: THE SHELL (Industrial)
        // The "Truth" revealed by the AR puzzle
        // ==========================================
        ['sector_0_mech_reveal', {
            nodeId: 'sector_0_mech_reveal',
            speaker: 'Narrator',
            content: [{
                text: 'The hologram shatters. Behind it is a rusted iron wheel, heavy and cold. An industrial relic.',
                variation_id: 'mech_reveal'
            }],
            choices: [
                {
                    choiceId: 'turn_wheel',
                    text: 'Turn the iron wheel',
                    nextNodeId: 'sector_0_hub',
                    interaction: 'shake',
                    skills: ['hard_skills'] // Assuming physique/force
                }
            ]
        }],

        // ==========================================
        // THE HUB (After passing the threshold)
        // ==========================================
        ['sector_0_hub', {
            nodeId: 'sector_0_hub',
            speaker: 'Narrator',
            content: [{
                text: 'The heavy door groans open. You are in.',
                variation_id: 'hub_entry'
            }],
            choices: [
                // Links to other characters/locations would go here
                {
                    choiceId: 'enter_grand_hall',
                    text: 'Proceed to the Grand Hall',
                    nextNodeId: 'sector_1_hall' // Cross-graph link
                }
            ]
        }]
    ])
}
