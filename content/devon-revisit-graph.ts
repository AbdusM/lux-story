/**
 * Devon's Revisit Dialogue Graph
 * Post-arc interactions - Devon updates on his father and the system
 *
 * CRITICAL: Loaded only when devon_arc_complete is set
 */

import {
    DialogueNode,
    DialogueGraph
} from '@/lib/dialogue-graph'

const SAMUEL_HUB_AFTER_DEVON = 'samuel_hub_after_devon'

export const devonRevisitNodes: DialogueNode[] = [
    // ============= WELCOME BACK (Entry Point) =============
    {
        nodeId: 'devon_revisit_welcome',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `*Devon is typing rapidly, but he looks up when he sees you. He doesn't look as frantic as before.*

Hey. I was running a diagnostic and... well, you showed up in the logs. Metaphorically.

{{devon_chose_logic: I've been optimizing the decision tree. It's much cleaner now.|}}{{!devon_chose_logic: I called him. My dad.|}}`,
                emotion: 'focused_warm',
                variation_id: 'devon_revisit_welcome_v1'
            }
        ],
        requiredState: {
            hasGlobalFlags: ['devon_arc_complete']
        },
        choices: [
            {
                choiceId: 'devon_revisit_ask_dad',
                text: "How did the call go?",
                nextNodeId: 'devon_revisit_update',
                skills: ['emotionalIntelligence'],
                visibleCondition: {
                    lacksGlobalFlags: ['devon_chose_logic']
                }
            },
            {
                choiceId: 'devon_revisit_ask_system',
                text: "How is the system performing?",
                nextNodeId: 'devon_revisit_update_logic',
                pattern: 'building',
                skills: ['systemsThinking'],
                visibleCondition: {
                    hasGlobalFlags: ['devon_chose_logic']
                }
            },
            {
                choiceId: 'devon_revisit_general',
                text: "Good to see you're still debugging.",
                nextNodeId: 'devon_revisit_closing',
                pattern: 'exploring'
            }
        ]
    },

    // ============= UPDATE: EMPATHY PATH =============
    {
        nodeId: 'devon_revisit_update',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `*He leans back.*

Weirdest thing. I didn't use the script. I just... told him about the packet loss.

I said, "Dad, I feel like we're dropping frames." And he laughed. Actually laughed.

"Low bandwidth," he said. "Since your mom isn't here to boost the signal."

*Devon smiles, a real one.*

We talked about satellites for an hour. It wasn't about feelings, but... it was feeling.`,
                emotion: 'relieved',
                variation_id: 'devon_revisit_update_v1'
            }
        ],
        choices: [
            {
                choiceId: 'devon_revisit_protocol',
                text: "Sounds like you found a new protocol.",
                nextNodeId: 'devon_revisit_closing',
                pattern: 'building',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'devon_revisit_connection',
                text: "That's connection. No debugging required.",
                nextNodeId: 'devon_revisit_closing',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            }
        ]
    },

    // ============= UPDATE: LOGIC PATH (Sad) =============
    {
        nodeId: 'devon_revisit_update_logic',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `Efficiency is up 40%. I removed the emotional subroutines.

If he says "I'm fine," I just accept the packet. No need to query for hidden data. It's much... quieter this way.

*He looks at his screen, not at you.*

Quieter is good, right?`,
                emotion: 'resigned',
                variation_id: 'devon_revisit_logic_v1'
            }
        ],
        choices: [
            {
                choiceId: 'devon_revisit_quiet_good',
                text: "Maybe another time.",
                nextNodeId: 'devon_father_hint', // Loop back
                // pattern: 'neutral' // Invalid pattern
            }
        ]
    },

    // ============= CLOSING =============
    {
        nodeId: 'devon_revisit_closing',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `Anyway. I should get back to it.

But hey. Thanks for the code review. Sometimes you need a second pair of eyes to see the bugs.`,
                emotion: 'grateful',
                variation_id: 'devon_revisit_closing_v1'
            }
        ],
        choices: [
            {
                choiceId: 'return_to_samuel_after_devon',
                text: "Return to Samuel",
                nextNodeId: SAMUEL_HUB_AFTER_DEVON,
                pattern: 'exploring'
            },
            // Loyalty Experience trigger - only visible at high trust + analytical pattern
            {
                choiceId: 'offer_outage_help',
                text: "[System Analyst] Your monitoring dashboards look stressed. What's the real situation?",
                nextNodeId: 'devon_loyalty_trigger',
                pattern: 'analytical',
                skills: ['systemsThinking', 'problemSolving'],
                visibleCondition: {
                    trust: { min: 8 },
                    patterns: { analytical: { min: 50 } }
                }
            }
        ]
    },

    // ============= LOYALTY EXPERIENCE TRIGGER =============
    {
        nodeId: 'devon_loyalty_trigger',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `How did you— okay, yeah. The monitoring cluster. It's been throwing warnings all week but I've been... optimizing around them.

The main database is failing. Cascading timeouts. If this goes down during peak hours, we lose everything. User data. Transaction history. The whole system.

I've been running patches but I can't isolate the root cause alone. It's like trying to debug a race condition while the race is happening.

You understand systems. Would you... help me triage this before it becomes an outage?`,
                emotion: 'anxious_determined',
                variation_id: 'loyalty_trigger_v1',
                richEffectContext: 'warning'
            }
        ],
        requiredState: {
            trust: { min: 8 },
            patterns: { analytical: { min: 5 } }
        },
        metadata: {
            experienceId: 'the_outage'  // Triggers loyalty experience engine
        },
        choices: [
            {
                choiceId: 'accept_outage_challenge',
                text: "Show me the logs. We'll isolate this together.",
                nextNodeId: 'devon_loyalty_start',
                pattern: 'analytical',
                skills: ['systemsThinking', 'problemSolving'],
                consequence: {
                    characterId: 'devon',
                    trustChange: 1
                }
            },
            {
                choiceId: 'encourage_but_decline',
                text: "You've got the skills for this, Devon. Trust your diagnostics.",
                nextNodeId: 'devon_loyalty_declined',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            }
        ],
        onEnter: [
            {
                characterId: 'devon',
                addKnowledgeFlags: ['loyalty_offered']
            }
        ],
        tags: ['loyalty_experience', 'devon_loyalty', 'high_trust']
    },

    {
        nodeId: 'devon_loyalty_declined',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `You're right. I've been second-guessing every decision because I'm scared of making it worse.

But I know these systems. I built half of them. Maybe it's time to trust the diagnostic process instead of panicking.

Okay. Back to first principles. Thanks for the confidence boost.`,
                emotion: 'resolved',
                variation_id: 'loyalty_declined_v1'
            }
        ],
        choices: [
            {
                choiceId: 'loyalty_declined_farewell',
                text: "You've got this. The system is in good hands.",
                nextNodeId: SAMUEL_HUB_AFTER_DEVON,
                pattern: 'patience'
            }
        ],
        onEnter: [
            {
                characterId: 'devon',
                addKnowledgeFlags: ['loyalty_declined_gracefully']
            }
        ]
    },

    {
        nodeId: 'devon_loyalty_start',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `Thank you. Okay. Let me pull up the full stack trace.

Two heads. One system. Let's find this bug before it finds us.`,
                emotion: 'focused_grateful',
                variation_id: 'loyalty_start_v1'
            }
        ],
        metadata: {
            experienceId: 'the_outage'  // Experience engine takes over
        },
        choices: []  // Experience engine handles next steps
    }
]

export const devonRevisitEntryPoints = {
    WELCOME: 'devon_revisit_welcome'
} as const

export const devonRevisitGraph: DialogueGraph = {
    version: '1.0.0',
    nodes: new Map(devonRevisitNodes.map(node => [node.nodeId, node])),
    startNodeId: devonRevisitEntryPoints.WELCOME,
    metadata: {
        title: "Devon's Revisit Content",
        author: 'Guided Generation',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: devonRevisitNodes.length,
        totalChoices: devonRevisitNodes.reduce((sum, n) => sum + n.choices.length, 0)
    }
}
