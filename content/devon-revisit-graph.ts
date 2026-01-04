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
            }
        ]
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
