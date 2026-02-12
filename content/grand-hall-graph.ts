import { DialogueGraph, DialogueNode } from '@/lib/dialogue-graph'
import { buildDialogueNodesMap } from './drafts/draft-filter'

export const grandHallDialogueNodes: DialogueNode[] = [
    // ==========================================
    // SECTOR 1: THE GRAND HALL (Technocrat View / Augmented / Default)
    // ==========================================
    {
        nodeId: 'sector_1_hall',
        speaker: 'Narrator',
        content: [{
            text: "[The air hums with static.",
            variation_id: 'hall_tech_v2',
            interaction: 'bloom',
            richEffectContext: 'success',
            patternReflection: [
                { pattern: 'analytical', minLevel: 3, altText: "[The static hums.]\n\nGrand Atrium. Network Load: 86%. Packet Loss: High.\n\nThe holograms are optimizing bandwidth, hiding the structural degradation behind them. It's a load-bearing illusion.", altEmotion: 'analytical' },
                { pattern: 'building', minLevel: 3, altText: "[The static hums.]\n\nIt's beautiful, in a desperate way. Someone coded these 'Ghost Ads' to loop forever. A monument to a commerce that died.", altEmotion: 'awe' }
            ]
        }],
        choices: [
            {
                choiceId: 'inspect_wall_tech',
                text: 'Admire the Founders Wall',
                nextNodeId: 'wall_tech'
            },
            {
                choiceId: 'switch_to_real',
                text: '[Lens] Disable AR Layer',
                nextNodeId: 'sector_1_hall_real',
                consequence: { addGlobalFlags: ['view_mode_reality'] }
            },
            {
                choiceId: 'enter_market',
                text: 'Visit the "Asset Exchange" (Sector 2)',
                nextNodeId: 'sector_2_market'
            },
            {
                choiceId: 'enter_core',
                text: 'Take the Service Elevator (Sector 3)',
                nextNodeId: 'sector_3_office',
                visibleCondition: {
                    hasGlobalFlags: ['has_access_sector_3'],
                    lacksGlobalFlags: ['ng_plus_1']
                }
            },
            {
                choiceId: 'enter_core_ng',
                text: 'Take the Elevator (Sector 3 - Loop)',
                nextNodeId: 'sector_3_office_ng',
                visibleCondition: {
                    hasGlobalFlags: ['has_access_sector_3', 'ng_plus_1']
                },
                preview: 'Warning: Reality variance detected.'
            },
            {
                choiceId: 'enter_core_locked',
                text: '[LOCKED] Service Elevator (Requires Key)',
                nextNodeId: 'sector_1_hall', // Stay here
                visibleCondition: { lacksGlobalFlags: ['has_access_sector_3'] },
                enabledCondition: { hasGlobalFlags: ['impossible_flag'] }, // Always disabled (grayed out)
                preview: 'Security Protocol: LEVEL 5 CLEARANCE REQUIRED. (Visit Sector 2 Market)'
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
            successFeedback: 'LENS ADJUSTED. AUGMENTATION OFFLINE.'
        }
    },

    // ==========================================
    // SECTOR 1: THE GRAND HALL (Realist View / Decayed)
    // ==========================================
    {
        nodeId: 'sector_1_hall_real',
        speaker: 'Narrator',
        content: [{
            text: "[The holograms flicker and die.",
            variation_id: 'hall_real_v2',
            interaction: 'shake',
            richEffectContext: 'warning',
            patternReflection: [
                { pattern: 'patience', minLevel: 3, altText: "[Shadows lengthen.]\n\nSilence. Real silence.\n\nWithout the noise of the ads, you can hear the station groaning. It's tired. It needs rest, not paint.", altEmotion: 'somber' },
                { pattern: 'helping', minLevel: 3, altText: "[Shadows lengthen.]\n\nThis is where people actually live. In the cracks. You see a sleeping bag tucked behind a column. A real human trace.", altEmotion: 'empathetic' }
            ]
        }],
        choices: [
            {
                choiceId: 'inspect_wall_real',
                text: 'Investigate the peeling poster',
                nextNodeId: 'wall_real',
                skills: ['curiosity']
            },
            {
                choiceId: 'switch_to_tech',
                text: '[Lens] Enable AR Layer',
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
            successFeedback: 'LENS ADJUSTED. AUGMENTATION RESTORED.'
        }
    },

    // ==========================================
    // INTERACTABLES (The Secrets)
    // ==========================================
    {
        nodeId: 'wall_tech',
        speaker: 'Narrator',
        content: [{
            text: 'The holographic faces of the Founders smile down. They look perfect. Too perfect. Their eyes follow you with a pre-programmed warmth.',
            variation_id: 'wall_tech_desc_v2'
        }],
        choices: [
            {
                choiceId: 'download_blueprint',
                text: '[Hack] Download Architectural Schematics',
                nextNodeId: 'found_blueprint',
                pattern: 'analytical',
                skills: ['systemsThinking', 'digitalLiteracy'],
                visibleCondition: { lacksKnowledgeFlags: ['found_technocrat_blueprint'] },
                consequence: {
                    addKnowledgeFlags: ['found_technocrat_blueprint']
                }
            },
            { choiceId: 'back_tech', text: 'Step back', nextNodeId: 'sector_1_hall' }
        ]
    },

    {
        nodeId: 'found_blueprint',
        speaker: 'System',
        content: [{
            text: 'Download Complete. You pulled the raw schematics for Sector 1. It shows hidden structural weaknesses the holograms are masking.\n\nTechnocrat Item Obtained: [Sector 1 Blueprints]',
            variation_id: 'blueprint_found_v1',
            richEffectContext: 'success'
        }],
        choices: [{ choiceId: 'back_tech_found', text: 'Step back', nextNodeId: 'sector_1_hall' }]
    },

    {
        nodeId: 'wall_real',
        speaker: 'Narrator',
        content: [{
            text: 'You peel back the edge of the poster. Behind it is a manual airlock handle modeled in heavy iron. It is labeled "EMERGENCY VENT - SECTOR 0.".\n\nSomeone tried to scratch a message here: "THEY LEFT US."',
            variation_id: 'wall_real_desc_v2'
        }],
        choices: [
            {
                choiceId: 'use_handle',
                text: 'Turn the handle',
                nextNodeId: 'found_secret_passage',
                skills: ['systemsThinking', 'curiosity'],
                visibleCondition: { lacksKnowledgeFlags: ['found_secret_passage'] },
                consequence: {
                    addKnowledgeFlags: ['found_secret_passage']
                }
            },
            {
                choiceId: 'inspect_scratches',
                text: 'Analyze the graffiti map',
                nextNodeId: 'found_naturalist_clue',
                skills: ['observation', 'curiosity'],
                visibleCondition: { lacksKnowledgeFlags: ['found_naturalist_location'] },
                consequence: {
                    addKnowledgeFlags: ['found_naturalist_location']
                }
            },
            { choiceId: 'back_real', text: 'Step back', nextNodeId: 'sector_1_hall_real' }
        ]
    },

    {
        nodeId: 'found_naturalist_clue',
        speaker: 'Narrator',
        content: [{
            text: 'You trace the scratches. It\'s not just words—it\'s a map of the hydroponic supply lines. It points to a "Hidden Garden." in Sector 4.\n\nNaturalist Secret Obtained: [Garden Location]',
            variation_id: 'naturalist_clue_v1',
            richEffectContext: 'success'
        }],
        choices: [{ choiceId: 'back_real_found', text: 'Step back', nextNodeId: 'sector_1_hall_real' }]
    },

    {
        nodeId: 'found_secret_passage',
        speaker: 'Narrator',
        content: [{
            text: 'The wall groans. Not a door, but a panel in the hull itself slides back. A dark ventilation shaft leads back to the Station Entry.\n\nIt works both ways. The "Rat." (Alex) probably uses this.',
            variation_id: 'secret_reveal_v2'
        }],
        choices: [
            { choiceId: 'enter_crawlspace', text: 'Crawl to Station Entry (Sector 0)', nextNodeId: 'samuel_comprehensive_hub' },
            { choiceId: 'stay_hall', text: 'Stay in the Hall', nextNodeId: 'sector_1_hall_real' }
        ]
    }
]

export const grandHallGraph: DialogueGraph = {
    version: '3.0',
    metadata: {
        title: 'Sector 1: The Grand Hall',
        author: 'Loremaster',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: grandHallDialogueNodes.length,
        totalChoices: grandHallDialogueNodes.reduce((acc, n) => acc + n.choices.length, 0)
    },
    startNodeId: 'sector_1_hall',
    nodes: buildDialogueNodesMap('grand_hall', grandHallDialogueNodes)
}
