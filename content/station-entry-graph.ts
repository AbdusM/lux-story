import { DialogueGraph } from '@/lib/dialogue-graph'

export const stationEntryGraph: DialogueGraph = {
    version: '3.0',
    metadata: {
        title: 'Sector 0: The Station Entry',
        author: 'Loremaster',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: 10,
        totalChoices: 0
    },
    startNodeId: 'entry_arrival',
    nodes: new Map([
        // ==========================================
        // 1. ARRIVAL: SENSORY IMPACT
        // ==========================================
        ['entry_arrival', {
            nodeId: 'entry_arrival',
            speaker: 'Narrator',
            content: [
                {
                    text: "[A slow, deep cello note hums. The sound of distant trains that never arrive.",
                    variation_id: 'entry_arrival_v1',
                    interaction: 'ripple',
                    patternReflection: [
                        { pattern: 'analytical', minLevel: 3, altText: "[A slow, deep cello note.]\n\nStation Entry. Capacity: 10 Million. Current Occupancy: <100.\n\nThe architecture is Monumental Brutalism. Designed to make you feel small. It is working.", altEmotion: 'analytical' },
                        { pattern: 'helping', minLevel: 3, altText: "[A slow, deep cello note.]\n\nYou're here. The 'Grand Central of the Diaspora'.\n\nIt feels lonely. Like a house where everyone moved out but left the furniture.", altEmotion: 'melancholic' }
                    ]
                }
            ],
            choices: [
                {
                    choiceId: 'inspect_fog',
                    text: 'Look up at the archways disappearing into the fog',
                    nextNodeId: 'entry_look_up',
                    pattern: 'analytical'
                },
                {
                    choiceId: 'inspect_floor',
                    text: 'Look down at the worn marble floor',
                    nextNodeId: 'entry_look_down',
                    pattern: 'patience'
                },
                {
                    choiceId: 'approach_booth',
                    text: 'Approach the welded-shut Ticket Booths',
                    nextNodeId: 'entry_ticket_booth',
                    pattern: 'building'
                }
            ]
        }],

        // ==========================================
        // 2. OBSERVATION LAYERS (One Room, Infinite Depth)
        // ==========================================
        ['entry_look_up', {
            nodeId: 'entry_look_up',
            speaker: 'Narrator',
            content: [{
                text: "The arches soar upward, layer upon layer of concrete ribs.",
                variation_id: 'look_up_v1',
                emotion: 'mystical'
            }],
            choices: [
                {
                    choiceId: 'return_center',
                    text: 'Look back at the concourse',
                    nextNodeId: 'entry_arrival_return'
                }
            ]
        }],

        ['entry_look_down', {
            nodeId: 'entry_look_down',
            speaker: 'Narrator',
            content: [{
                text: "The marble is concave from millions of feet.",
                variation_id: 'look_down_v1',
                emotion: 'somber'
            }],
            choices: [
                {
                    choiceId: 'return_center',
                    text: 'Look back at the concourse',
                    nextNodeId: 'entry_arrival_return'
                }
            ]
        }],

        ['entry_ticket_booth', {
            nodeId: 'entry_ticket_booth',
            speaker: 'Narrator',
            content: [{
                text: "The brass grilles are dull.",
                variation_id: 'booth_v1',
                emotion: 'cold'
            }],
            choices: [
                {
                    choiceId: 'knock_booth',
                    text: 'Knock on the metal',
                    nextNodeId: 'entry_samuel_intro', // Leads to Samuel
                    interaction: 'shake'
                },
                {
                    choiceId: 'return_center',
                    text: 'Step away',
                    nextNodeId: 'entry_arrival_return'
                }
            ]
        }],

        // ==========================================
        // 3. THE HUB RETURN (With New Context)
        // ==========================================
        ['entry_arrival_return', {
            nodeId: 'entry_arrival_return',
            speaker: 'Narrator',
            content: [
                {
                    text: "You are back in the center of the hall. The dust motes dance. The cello plays on.",
                    variation_id: 'return_v1'
                }
            ],
            choices: [
                {
                    choiceId: 'approach_booth_retry',
                    text: 'Approach the Ticket Booths',
                    nextNodeId: 'entry_ticket_booth'
                },
                {
                    choiceId: 'call_out',
                    text: 'Call out: "Is anyone working?"',
                    nextNodeId: 'entry_samuel_intro'
                },
                {
                    choiceId: 'ng_plus_reentry',
                    text: '[NEW GAME+] Wake up at the beginning',
                    nextNodeId: 'sector_0_hub',
                    visibleCondition: { hasGlobalFlags: ['ng_plus_1'] }
                }
            ]
        }],

        // ==========================================
        // 4. THE ANCHOR (Samuel Encounter)
        // ==========================================
        ['entry_samuel_intro', {
            nodeId: 'entry_samuel_intro',
            speaker: 'Samuel',
            content: [{
                text: "[A janitor in a grey jumpsuit pushes a broom into view.",
                variation_id: 'samuel_meet_v1',
                emotion: 'warm'
            }],
            choices: [
                {
                    choiceId: 'ask_schedule',
                    text: "There's a 9:15?",
                    nextNodeId: 'samuel_schedule_joke',
                    pattern: 'analytical'
                },
                {
                    choiceId: 'state_business',
                    text: "I'm just looking around.",
                    nextNodeId: 'samuel_welcome',
                    pattern: 'helping'
                }
            ]
        }],

        ['samuel_schedule_joke', {
            nodeId: 'samuel_schedule_joke',
            speaker: 'Samuel',
            content: [{
                text: "[He chuckles.",
                variation_id: 'samuel_joke_v1',
                emotion: 'amused'
            }],
            choices: [
                {
                    choiceId: 'ask_who_are_you',
                    text: "Who are you?",
                    nextNodeId: 'samuel_welcome'
                }
            ]
        }],

        ['samuel_welcome', {
            nodeId: 'samuel_welcome',
            speaker: 'Samuel',
            content: [{
                text: "Name's Samuel.",
                variation_id: 'samuel_intro_complete',
                emotion: 'warm'
            }],
            choices: [
                // End of this vignette, transition to main game loop or map
                {
                    choiceId: 'ask_directions',
                    text: "Where do I go from here?",
                    nextNodeId: 'entry_hub_exit',
                    skills: ['emotionalIntelligence', 'communication']
                }
            ]
        }],

        ['entry_hub_exit', {
            nodeId: 'entry_hub_exit',
            speaker: 'Narrator',
            content: [{
                text: "Samuel points with his broom toward the massive archway leading deeper into.",
                variation_id: 'hub_exit_v1' // End of module
            }],
            choices: [
                {
                    choiceId: 'enter_sector_1',
                    text: "Enter the Grand Hall",
                    nextNodeId: 'sector_1_hall' // Cross-graph transition
                }
            ]
        }],

        // ==========================================
        // 5. RE-ENTRY (From Sector 1 Vent)
        // ==========================================
        ['sector_0_hub', {
            nodeId: 'sector_0_hub',
            speaker: 'Narrator',
            content: [
                {
                    text: "[NEW GAME+ DETECTED.",
                    variation_id: 'hub_ng_plus_entry',
                    visibleCondition: { hasGlobalFlags: ['ng_plus_1'] },
                    richEffectContext: 'glitch'
                },
                {
                    text: "[You push open the grate and tumble out onto the marble floor of the Entry Hall. The air is cooler here.]\n\nScale. Silence. The 'Eternal Twilight'. You are back at the beginning.",
                    variation_id: 'hub_reentry_v1',
                    visibleCondition: { lacksGlobalFlags: ['ng_plus_1'] }
                }
            ],
            choices: [
                {
                    choiceId: 'return_center_reentry',
                    text: 'Stand up',
                    nextNodeId: 'entry_arrival_return',
                    consequence: {
                        // This uses a special "reset" consequence handled by game-logic or we manually clear flags here if the engine supports it.
                        // For now, we simulate it by NOT removing the ng_plus_1 flag but implying the reset via narrative.
                        // Ideally: removeGlobalFlags: ['all_except_ng']
                        addGlobalFlags: ['ng_plus_1']
                    }
                }
            ]
        }]
    ])
}
