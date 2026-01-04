import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const zaraDialogueNodes: DialogueNode[] = [
    // ============= INTRODUCTION =============
    {
        nodeId: 'zara_introduction',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Numbers don't lie. But the people who gather them do.\n\n[She scrolls through a waterfall of spreadsheet rows on a vertical monitor.]\n\n\"Look at this,\" she points. \"The 'Efficiency Algorithm' for the new logistics fleet. It's flagging 40% of the routes as 'sub-optimal'. Do you know why?\"",
                emotion: 'analytical',
                variation_id: 'intro_v1'
            }
        ],
        choices: [
            {
                choiceId: 'intro_ask_why',
                text: "Why is it flagging them?",
                nextNodeId: 'zara_explains_bias',
                pattern: 'analytical',
                skills: ['dataLiteracy'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'intro_efficiency',
                text: "Maybe they ARE sub-optimal. Efficiency is key.",
                nextNodeId: 'zara_challenge_efficiency',
                pattern: 'building',
                skills: ['systemsThinking']
            }
        ],
        tags: ['introduction', 'zara_arc']
    },

    {
        nodeId: 'zara_explains_bias',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't eat. Drones don't rest. Applying drone metrics to human drivers isn't just 'optimizing', it's breaking them.\n\nI need to clean this dataset before the rollout. Want to help?",
                emotion: 'determined',
                variation_id: 'bias_v1'
            }
        ],
        choices: [
            {
                choiceId: 'offer_data_help',
                text: "Show me the raw data.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'helping',
                skills: ['dataLiteracy']
            }
        ]
    },

    {
        nodeId: 'zara_challenge_efficiency',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Efficiency at what cost? Burnout? Turnover?\n\nIf you optimize for speed alone, you lose resilience. A system that can't pause is a system that snaps.\n\nTake a look at the data. Tell me if you still think it's 'efficient'.",
                emotion: 'challenging',
                variation_id: 'efficiency_v1'
            }
        ],
        choices: [
            {
                choiceId: 'ready_to_audit',
                text: "Let's audit the dataset.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'analytical',
                skills: ['criticalThinking']
            }
        ]
    },

    // ============= SIMULATION: DATA ANALYSIS (Excel/Cleaning) =============
    {
        nodeId: 'zara_simulation_setup',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "We have the pilot program data. Column F is 'Idle Time'. The algorithm penalizes anything above 15 minutes.\n\nBut look at Column G: 'Context'.\n\nFind the pattern the algorithm missed.",
                emotion: 'focused',
                variation_id: 'sim_setup_v1'
            }
        ],
        simulation: {
            type: 'data_analysis',
            title: 'Dataset Audit: Logistics Beta',
            taskDescription: 'The "Efficiency AI" is unfairly penalizing drivers. Identify the hidden variable in the dataset designed to filter "slackers".',
            initialContext: {
                label: 'logistics_beta_v4.csv',
                content: `ID | ROUTE_TIME | IDLE_TIME | SCORE | CONTEXT
101 | 4.5h       | 20m       | FAIL  | Mandatory Break
102 | 3.2h       | 5m        | PASS  | Non-Stop
103 | 5.0h       | 30m       | FAIL  | School Zone Traffic
104 | 4.1h       | 18m       | FAIL  | Safety Check`,
                displayStyle: 'code'
            },
            successFeedback: '✓ BIAS IDENTIFIED: The algorithm treats "Safety Checks" and "Traffic" as "Slacking Off". It optimizes for speed over safety.'
        },
        choices: [
            {
                choiceId: 'sim_filter_context',
                text: "Filter by 'Safety Check'. The algorithm counts safety protocols as 'Idle Time'.",
                nextNodeId: 'zara_simulation_success',
                pattern: 'analytical',
                skills: ['dataLiteracy', 'systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    addGlobalFlags: ['golden_prompt_workflow'] // Reusing workflow/data flag
                }
            },
            {
                choiceId: 'sim_human_factor',
                text: "It's penalizing 'Mandatory Breaks'. It violates labor laws.",
                nextNodeId: 'zara_simulation_success',
                pattern: 'helping',
                skills: ['ethics', 'informationLiteracy'],
                consequence: {
                    characterId: 'zara',
                    addGlobalFlags: ['golden_prompt_workflow']
                }
            },
            {
                choiceId: 'sim_delete_outliers',
                text: "Just delete the failing rows. Make the numbers look good.",
                nextNodeId: 'zara_simulation_fail',
                pattern: 'building' // "shortcuts" not valid
            }
        ],
        tags: ['simulation', 'zara_arc']
    },

    {
        nodeId: 'zara_simulation_success',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Exactly. It's punishing safety. If we deployed this, drivers would speed through school zones just to valid their 'Efficiency Score'.\n\nData isn't neutral. It's just frozen human judgment.\n\nGood catch. I'll flag this for the Ethics Committee.",
                emotion: 'approving',
                variation_id: 'sim_success_v1'
            }
        ],
        choices: [
            {
                choiceId: 'success_ethics',
                text: "We have to look beyond the spreadsheet.",
                nextNodeId: 'zara_conclusion',
                pattern: 'helping',
                skills: ['ethics']
            }
        ]
    },

    {
        nodeId: 'zara_simulation_fail',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "And hide the truth? That's not cleaning data, that's cooking the books.\n\nIf we ignore the outliers, we ignore reality. And reality has a nasty way of crashing into perfectly modeled systems.",
                emotion: 'disappointed',
                variation_id: 'sim_fail_v1'
            }
        ],
        choices: [
            {
                choiceId: 'fail_reconsider',
                text: "You're right. I was focused on the score, not the cause.",
                nextNodeId: 'zara_conclusion',
                pattern: 'analytical',
                skills: ['humility']
            }
        ]
    },

    {
        nodeId: 'zara_conclusion',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I've got a long night of re-labeling ahead. But at least we aren't automating an accident.\n\nSee you around, detective.",
                emotion: 'tired',
                variation_id: 'conclusion_v1'
            }
        ],
        choices: [
            {
                choiceId: 'return_hub',
                text: "Return to Station",
                nextNodeId: 'samuel_orb_introduction',
                pattern: 'exploring'
            }
        ]
    }
]

export const zaraDialogueGraph: DialogueGraph = {
    version: '1.0.0',
    nodes: new Map(zaraDialogueNodes.map(node => [node.nodeId, node])),
    startNodeId: 'zara_introduction',
    metadata: {
        title: "Zara's Data Audit",
        author: 'Guided Generation',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: zaraDialogueNodes.length,
        totalChoices: zaraDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
    }
}
