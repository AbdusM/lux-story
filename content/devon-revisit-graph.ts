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
import { buildDialogueNodesMap } from './drafts/draft-filter'

const SAMUEL_HUB_AFTER_DEVON = 'samuel_hub_after_devon'

export const devonRevisitNodes: DialogueNode[] = [
    // ============= WELCOME BACK (Entry Point) =============
    {
        nodeId: 'devon_revisit_welcome',
        speaker: 'Devon Kumar',
        content: [
            {
                text: `*Devon types rapidly, then looks up, calmer than before.*

Hey. I was running diagnostics and, somehow, you showed up in the logs.

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
                taxonomyClass: 'accept',
                text: "How did the call go?",
                nextNodeId: 'devon_revisit_update',
                skills: ['emotionalIntelligence'],
                visibleCondition: {
                    lacksGlobalFlags: ['devon_chose_logic']
                }
            },
            {
                choiceId: 'devon_revisit_ask_system',
                taxonomyClass: 'reject',
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
                taxonomyClass: 'deflect',
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

I skipped the script and said, "Dad, we're dropping frames"; he laughed, called it low bandwidth since Mom died, and we finally talked.

Not a feelings speech, but a real connection.`,
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
                text: `Efficiency is up 40%; I removed the emotional subroutines.

If he says "I'm fine," I accept the packet instead of probing for hidden data, and *he avoids your eyes* while asking, "Quieter is good, right?"`,
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
                text: `I should get back to it.

Thanks for the code review; sometimes you need a second pair of eyes to spot the bug.`,
                emotion: 'grateful',
                variation_id: 'devon_revisit_closing_v1'
            }
        ],
        choices: [
            {
                choiceId: 'return_to_samuel_after_devon',
                text: "Return to Samuel.",
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
                text: `You caught it: the monitoring cluster is unstable and database calls are timing out.

I've patched symptoms, but I need another systems mind before this becomes an outage.

Will you help me triage now?`,
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
                text: `You're right, I've been second-guessing because I'm scared of making it worse.

But I built these systems, and I can trust diagnostics instead of panic.

Back to first principles; thanks for the reset.`,
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
                text: `Thank you. Let me pull up the full stack trace.

Two heads, one system; let's find this bug before it finds us.`,
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
    nodes: buildDialogueNodesMap('devon_revisit', devonRevisitNodes),
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
