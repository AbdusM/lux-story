import { DialogueGraph, DialogueNode } from '@/lib/dialogue-graph'
import { buildDialogueNodesMap } from './drafts/draft-filter'

export const marketDialogueNodes: DialogueNode[] = [
    // ==========================================
    // SECTOR 2: THE MARKET (The Gold & Velvet)
    // ==========================================
    // ==========================================
    // SECTOR 2: THE MARKET (The Gold & Velvet)
    // ==========================================

    // LOGIC ROUTER: Checks for Overdensity
    {
        nodeId: 'market_entry_logic',
        speaker: 'Narrator',
        content: [{ text: "Step back for now.", variation_id: 'market_logic_dummy' }], // Invisible node
        choices: [
            {
                choiceId: 'route_to_crowd',
                text: 'Proceed.',
                nextNodeId: 'market_high_density_intro',
                visibleCondition: { hasGlobalFlags: ['high_density'] }
            },
            {
                choiceId: 'route_to_normal',
                text: 'Proceed.',
                nextNodeId: 'sector_2_market',
                visibleCondition: { lacksGlobalFlags: ['high_density'] }
            }
        ]
    },

    // LOGIC ROUTER: Transit Glitch (Crowd Surge -> Deep Station)
    {
        nodeId: 'market_transit_logic',
        speaker: 'Narrator',
        content: [{ text: "Step back for now.", variation_id: 'market_transit_dummy' }],
        choices: [
            {
                choiceId: 'transit_glitch',
                text: 'Proceed.',
                nextNodeId: 'deep_station_glitch_entry',
                visibleCondition: { hasGlobalFlags: ['high_density'] }
            },
            {
                choiceId: 'transit_normal',
                text: 'Proceed.',
                nextNodeId: 'samuel_comprehensive_hub',
                visibleCondition: { lacksGlobalFlags: ['high_density'] }
            }
        ]
    },

    // A. HIGH DENSITY INTRO (Crowded, Dangerous)
    {
        nodeId: 'market_high_density_intro',
        speaker: 'Narrator',
        content: [{
            text: "[CRITICAL ALERT: Population Density > 90%] The Market is a crushing sea of bodies.",
            variation_id: 'market_dense_v1',
            emotion: 'anxiety',
            interaction: 'shake',
            patternReflection: [
                { pattern: 'analytical', minLevel: 3, altText: "[Density Alert]\n\nToo many variables. Threat assessment: High. Pickpocket probability: 85%. Keep your credits encrypt-locked.", altEmotion: 'calculating' }
            ]
        }],
        choices: [
            {
                choiceId: 'market_push_through',
                text: 'Push back and check pockets.',
                nextNodeId: 'sector_2_market',
                consequence: {
                    // In a full system, this might lose an item if failed
                    trustChange: -1 // Annoyance
                }
            },
            {
                choiceId: 'market_retreat',
                text: 'Too crowded. Leave.',
                nextNodeId: 'sector_1_hall'
            }
        ]
    },

    // B. NORMAL INTRO
    {
        nodeId: 'sector_2_market',
        speaker: 'Narrator',
        content: [{
            text: "[The air smells of burning spice and old paper.",
            variation_id: 'market_intro_v3',
            emotion: 'mystical',
            patternReflection: [
                { pattern: 'analytical', minLevel: 3, altText: "[The sound of haggling.]\n\nInefficient exchange protocol. No fixed prices. Pure arbitrage based on information asymmetry.\n\nIt is wildly unregulated. It is perfect.", altEmotion: 'calculating' },
                { pattern: 'helping', minLevel: 3, altText: "[The sound of haggling.]\n\nPeople are desperate here. Selling their last batteries for a meal. You see a mother trading a memory chip for clean water.", altEmotion: 'empathetic' }
            ]
        }],
        choices: [
            {
                choiceId: 'approach_broker',
                text: 'Find "The Broker" (Information Exchange)',
                nextNodeId: 'broker_intro',
                pattern: 'analytical'
            },
            {
                choiceId: 'browse_stalls',
                text: 'Browse the stalls (Physical Goods)',
                nextNodeId: 'market_browse_stalls'
            },
            {
                choiceId: 'leave_market',
                text: 'Return to Grand Hall',
                nextNodeId: 'sector_1_hall'
            },
            {
                choiceId: 'take_transit',
                text: 'Take the Mag-Lev Train (Transit Hub)',
                nextNodeId: 'market_transit_logic'
            }
        ]
    },

    // ==========================================
    // THE BROKER (Trading Truth for Power)
    // ==========================================
    {
        nodeId: 'broker_intro',
        speaker: 'The Broker',
        content: [{
            text: "[A figure sits behind a curtain of heavy red velvet. You can't see their face, only their hands—pale, adorned with rings of gold and rusted iron.]\n\nWe do not accept credits here, Traveler. Credits are a lie the Technocrats tell themselves. \n\nWe trade in **Leverage**. What truths have you found?",
            variation_id: 'broker_intro_v3',
            patternReflection: [
                { pattern: 'analytical', minLevel: 4, altText: "We do not accept credits.\n\n[You notice a neural-link cable running from the Broker's wrist into the wall.]\n\nThey aren't just selling secrets. They are feeding a database directly.", altEmotion: 'suspicious' }
            ]
        }],
        choices: [
            // TRADE 1: SECRET PASSAGE (Found in Sector 1)
            {
                choiceId: 'trade_secret_passage',
                text: '[Sell] "I found a secret vent in the Grand Hall."',
                nextNodeId: 'trade_success_vent',
                visibleCondition: {
                    hasKnowledgeFlags: ['found_secret_passage'],
                    lacksGlobalFlags: ['sold_secret_passage']
                },
                consequence: {
                    addGlobalFlags: ['sold_secret_passage', 'credits_high'],
                    // Selling this secret might reduce trust with the "Underground" later
                    trustChange: 0
                },
                skills: ['financialLiteracy', 'strategicThinking']
            },
            // TRADE 1 (SOLD OUT)
            {
                choiceId: 'trade_secret_passage_sold',
                text: '[Sold] "Sector 1 Vent Location"',
                nextNodeId: 'broker_intro',
                visibleCondition: { hasGlobalFlags: ['sold_secret_passage'] },
                enabledCondition: { hasGlobalFlags: ['impossible_flag'] }
            },

            // TRADE 2: TECHNOCRAT BLUEPRINT (Found in Sector 1 Tech Wall)
            {
                choiceId: 'trade_technocrat_blueprint',
                text: '[Sell] "I have the architectural blueprints for Sector 1."',
                nextNodeId: 'trade_success_blueprint',
                visibleCondition: {
                    hasKnowledgeFlags: ['found_technocrat_blueprint'],
                    lacksGlobalFlags: ['sold_technocrat_blueprint']
                },
                consequence: {
                    addGlobalFlags: ['sold_technocrat_blueprint', 'item_black_market_access'],
                    characterId: 'kai',
                    trustChange: -2 // Mild betrayal of safety protocols
                },
                skills: ['financialLiteracy', 'strategicThinking'] // Valid 2030 skill
            },
            // TRADE 2 (SOLD OUT)
            {
                choiceId: 'trade_technocrat_blueprint_sold',
                text: '[Sold] "Sector 1 Schematics"',
                nextNodeId: 'broker_intro',
                visibleCondition: { hasGlobalFlags: ['sold_technocrat_blueprint'] },
                enabledCondition: { hasGlobalFlags: ['impossible_flag'] }
            },

            // TRADE 3: NATURALIST LOCATION (Found in Sector 1 Real Wall)
            {
                choiceId: 'trade_naturalist_location',
                text: '[Sell] "I know where the Naturalists are hiding a garden."',
                nextNodeId: 'trade_success_naturalist',
                visibleCondition: {
                    hasKnowledgeFlags: ['found_naturalist_location'],
                    lacksGlobalFlags: ['sold_naturalist_location']
                },
                consequence: {
                    addGlobalFlags: ['sold_naturalist_location', 'item_bounty_hunter_contact'],
                    characterId: 'yaquin',
                    trustChange: -2 // Major betrayal of nature
                },
                skills: ['financialLiteracy', 'culturalCompetence'] // Valid 2030 skill
            },
            // TRADE 3 (SOLD OUT)
            {
                choiceId: 'trade_naturalist_location_sold',
                text: '[Sold] "Hidden Garden Location"',
                nextNodeId: 'broker_intro',
                visibleCondition: { hasGlobalFlags: ['sold_naturalist_location'] },
                enabledCondition: { hasGlobalFlags: ['impossible_flag'] }
            },

            // TRADE 2: SAMUEL'S SECRET (Requires knowing backstory)
            {
                choiceId: 'trade_samuel_secret',
                text: '[Sell] "Samuel isn\'t just a janitor. He failed a mission."',
                nextNodeId: 'trade_success_samuel',
                visibleCondition: {
                    hasKnowledgeFlags: ['knows_samuel_failed_mission'],
                    lacksGlobalFlags: ['sold_samuel_secret']
                },
                consequence: {
                    addGlobalFlags: ['sold_samuel_secret', 'has_access_sector_3'],
                    characterId: 'samuel',
                    trustChange: -2 // Major Betrayal
                }
            },

            // TRADE 3: MAYA (Requires knowing backstory)
            {
                choiceId: 'trade_maya_secret',
                text: '[Sell] "Maya is on the verge of a breakdown."',
                nextNodeId: 'trade_success_maya',
                visibleCondition: {
                    hasKnowledgeFlags: ['knows_maya_burnout'],
                    lacksGlobalFlags: ['sold_maya_secret']
                },
                consequence: {
                    addGlobalFlags: ['sold_maya_secret', 'item_battery_pack'],
                    characterId: 'maya',
                    trustChange: -2
                }
            },

            {
                choiceId: 'leave_broker',
                text: 'I have nothing to sell.',
                nextNodeId: 'sector_2_market'
            }
        ]
    },

    // ==========================================
    // TRANSACTION RESULTS
    // ==========================================
    {
        nodeId: 'trade_success_vent',
        speaker: 'The Broker',
        content: [{
            text: "A physical vulnerability in the Atrium hull? Fascinating. The Scavengers will pay handsomely for a new route.\n\nHere is your payment: **300 Credits**. Spend them wisely.",
            variation_id: 'trade_vent_success',
            richEffectContext: 'success'
        }],
        choices: [{ choiceId: 'broker_continue', text: 'Anything else?', nextNodeId: 'broker_intro' }]
    },

    {
        nodeId: 'trade_success_samuel',
        speaker: 'The Broker',
        content: [{
            text: "Ah. The 'Hero' has a cracked shield. This information is worth more than gold. This changes the political landscape of Sector 0.\n\nTake this: **Access Code to Sector 3**. The Technocrats won't stop you now.",
            variation_id: 'trade_samuel_success',
            richEffectContext: 'success'
        }],
        choices: [{ choiceId: 'broker_continue', text: 'Anything else?', nextNodeId: 'broker_intro' }]
    },

    {
        nodeId: 'trade_success_maya',
        speaker: 'The Broker',
        content: [{
            text: "Predictable. Another engineer burning out. Still, the Guild calculates staffing risks carefully. We can short their stock.\n\nTake this: **High-Capacity Battery**. You'll need it.",
            variation_id: 'trade_maya_success',
            richEffectContext: 'success'
        }],
        choices: [{ choiceId: 'broker_continue', text: 'Anything else?', nextNodeId: 'broker_intro' }]
    },

    {
        nodeId: 'trade_success_blueprint',
        speaker: 'The Broker',
        content: [{
            text: "Schematics? Delicious. The Guild hides these flaws to maintain the illusion of control. We shall sell them to the highest bidder.\n\nTake this: **Black Market Access Key**. You can now trade for... rarer items.",
            variation_id: 'trade_blueprint_success',
            richEffectContext: 'success'
        }],
        choices: [{ choiceId: 'broker_continue', text: 'Anything else?', nextNodeId: 'broker_intro' }]
    },

    {
        nodeId: 'trade_success_naturalist',
        speaker: 'The Broker',
        content: [{
            text: "A garden? In the Dead Sector? How very resourceful of them. The Technocrat elimination squads will pay a premium for this coordinate.\n\nTake this: **Bounty Hunter Contact**. Use it if you need 'problems' removed.",
            variation_id: 'trade_naturalist_success',
            richEffectContext: 'success'
        }],
        choices: [{ choiceId: 'broker_continue', text: 'Anything else?', nextNodeId: 'broker_intro' }]
    },


    // ==========================================
    // FLAVOR NODES
    // ==========================================
    {
        nodeId: 'market_browse_stalls',
        speaker: 'Narrator',
        content: [{
            text: "You weave through the stalls.",
            variation_id: 'market_stalls_v1'
        }],
        choices: [
            { choiceId: 'back_market', text: 'Return to center', nextNodeId: 'sector_2_market' }
        ]
    }
]

export const marketGraph: DialogueGraph = {
    version: '3.0',
    metadata: {
        title: 'Sector 2: The Market',
        author: 'Loremaster',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: marketDialogueNodes.length,
        totalChoices: marketDialogueNodes.reduce((acc, n) => acc + n.choices.length, 0)
    },
    startNodeId: 'market_entry_logic',
    nodes: buildDialogueNodesMap('market', marketDialogueNodes)
}
