import { DialogueGraph } from '@/lib/dialogue-graph'

export const marketGraph: DialogueGraph = {
    version: '1.0',
    metadata: {
        title: 'Sector 2: The Market',
        author: 'Archivist',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: 3,
        totalChoices: 0
    },
    startNodeId: 'sector_2_market',
    nodes: new Map([
        // ==========================================
        // SECTOR 2: THE MARKET (The Broker)
        // ==========================================
        ['sector_2_market', {
            nodeId: 'sector_2_market',
            speaker: 'The Broker',
            content: [{
                text: 'The Asset Exchange is open. We do not accept credits. We accept **Leverage**. What do you know?',
                emotion: 'neutral',
                interaction: 'typing',
                variation_id: 'market_intro'
            }],
            choices: [
                // TRADE 1: Samuel's Secret -> Sector 3 Key
                {
                    choiceId: 'trade_samuel_secret',
                    text: '[Trade "Samuel\'s Failure"] -> Buy "Sector 3 Key"',
                    nextNodeId: 'trade_success_samuel',
                    condition: {
                        hasKnowledgeFlags: ['knows_samuel_failed_mission'], // From finding log in Sector 0
                        lacksGlobalFlags: ['sold_samuel_secret']
                    },
                    consequence: {
                        addGlobalFlags: ['sold_samuel_secret', 'has_access_sector_3'],
                        characterId: 'samuel',
                        trustChange: -2 // The cost of betrayal
                    }
                },
                // TRADE 1 (SOLD OUT STATE)
                {
                    choiceId: 'trade_samuel_sold',
                    text: '[Sold] "Samuel\'s Failure"',
                    nextNodeId: 'sector_2_market',
                    condition: {
                        hasGlobalFlags: ['sold_samuel_secret']
                    },
                    enabled: false
                },

                // TRADE 2: Maya's Secret -> Battery Pack
                {
                    choiceId: 'trade_maya_secret',
                    text: '[Trade "Maya\'s Burnout"] -> Buy "High-Capacity Battery"',
                    nextNodeId: 'trade_success_maya',
                    condition: {
                        hasKnowledgeFlags: ['knows_maya_burnout'], // From Maya's initial arc
                        lacksGlobalFlags: ['sold_maya_secret']
                    },
                    consequence: {
                        addGlobalFlags: ['sold_maya_secret', 'item_battery_pack'],
                        characterId: 'maya',
                        trustChange: -2
                    }
                },

                // TRADE 2 (SOLD OUT STATE)
                {
                    choiceId: 'trade_maya_sold',
                    text: '[Sold] "Maya\'s Burnout"',
                    nextNodeId: 'sector_2_market',
                    condition: {
                        hasGlobalFlags: ['sold_maya_secret']
                    },
                    enabled: false
                },

                {
                    choiceId: 'leave_market',
                    text: 'Leave the exchange',
                    nextNodeId: 'sector_2_market_exit' // Placeholder, would link back to Hub/Map
                }
            ]
        }],

        // ==========================================
        // TRANSACTION OUTCOMES
        // ==========================================
        ['trade_success_samuel', {
            nodeId: 'trade_success_samuel',
            speaker: 'The Broker',
            content: [{
                text: 'Valuable data. The Technocrats will be interested to know their "Hero" is flawed. Here is the key code for the Hydroponics Bay.',
                richEffectContext: 'success'
            }],
            choices: [{ choiceId: 'market_continue', text: 'Anything else?', nextNodeId: 'sector_2_market' }]
        }],

        ['trade_success_maya', {
            nodeId: 'trade_success_maya',
            speaker: 'The Broker',
            content: [{
                text: 'Burnout rates in Robotics are trending up. This confirms the projection. Take the battery; you will need it in the dark zones.',
                richEffectContext: 'success'
            }],
            choices: [{ choiceId: 'market_continue', text: 'Anything else?', nextNodeId: 'sector_2_market' }]
        }],

        ['sector_2_market_exit', {
            nodeId: 'sector_2_market_exit',
            speaker: 'Narrator',
            content: [{
                text: 'You step away from the shadows, your pockets heavier, your conscience lighter.',
                emotion: 'atmospheric'
            }],
            choices: [
                // Loop back for demo purposes
                { choiceId: 'return_hub', text: 'Return to Grand Hall', nextNodeId: 'sector_1_hall' }
            ]
        }]
    ])
}
