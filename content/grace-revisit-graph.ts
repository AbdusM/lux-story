/**
 * Grace's Revisit Dialogue Graph
 * Post-arc interactions - Grace reflects on silence and dignity
 *
 * CRITICAL: Loaded only when grace_arc_complete is set
 */

import {
    DialogueNode,
    DialogueGraph
} from '@/lib/dialogue-graph'
import { buildDialogueNodesMap } from './drafts/draft-filter'

/**
 * Samuel Entry Point Constant
 * Used to link back to Samuel without circular imports
 */
// Route back to Samuel's hub router. This avoids broken cross-graph references
// and keeps return behavior phase-aware (router selects the right hub variant).
const SAMUEL_HUB_AFTER_GRACE = 'samuel_hub_router'

export const graceRevisitNodes: DialogueNode[] = [
    // ============= WELCOME BACK (Entry Point) =============
    {
        nodeId: 'grace_revisit_welcome',
        speaker: 'Grace',
        content: [
            {
                text: `*Grace sits with a sketchbook in her hands.*

You came back, and I've been thinking about how we met and how {{player_sat_quietly:you stayed in the silence when most people rush past it.|}}{{player_asked_questions:you asked the questions I was avoiding.|}} It still matters to me.`,
                emotion: 'warm',
                variation_id: 'grace_revisit_welcome_v1'
            }
        ],
        requiredState: {
            hasGlobalFlags: ['grace_arc_complete']
        },
        choices: [
            {
                choiceId: 'grace_revisit_ask_sketchbook',
                text: "What are you working on?",
                nextNodeId: 'grace_revisit_update',
                pattern: 'exploring',
                skills: ['curiosity']
            },
            {
                choiceId: 'grace_revisit_ask_state',
                text: "You look... lighter.",
                nextNodeId: 'grace_revisit_list',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            }
        ]
    },

    // ============= CHECK-IN LIST (Small hub) =============
    {
        nodeId: 'grace_revisit_list',
        speaker: 'Grace',
        content: [
            {
                text: `*She exhales.*

Some days still feel heavy, but lately it feels like weather instead of a sentence.

*She taps the sketchbook* and asks what you want to know.`,
                emotion: 'reflective',
                variation_id: 'grace_revisit_list_v1'
            }
        ],
        requiredState: {
            hasGlobalFlags: ['grace_arc_complete']
        },
        choices: [
            {
                choiceId: 'grace_revisit_list_sketchbook',
                taxonomyClass: 'accept',
                text: "Show me what you're writing.",
                nextNodeId: 'grace_revisit_update',
                pattern: 'building',
                skills: ['curiosity']
            },
            {
                choiceId: 'grace_revisit_list_presence',
                taxonomyClass: 'reject',
                text: "I keep thinking about that silence we shared.",
                nextNodeId: 'grace_revisit_closing',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'grace_revisit_list_witness',
                taxonomyClass: 'deflect',
                text: "I'm glad you're still here.",
                nextNodeId: 'grace_revisit_closing',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'grace',
                    trustChange: 1
                }
            }
        ]
    },

    // ============= UPDATE =============
    {
        nodeId: 'grace_revisit_update',
        speaker: 'Grace',
        content: [
            {
                text: `*She taps the sketchbook cover.*

Miss Williams passed last week, and {{handled_moment_well:I stayed with her the way we talked about.|}} before the end she told me stories I never want to lose.

I'm not just caregiving now; I'm witnessing and writing it down.`,
                emotion: 'reflective',
                variation_id: 'grace_revisit_update_v1'
            }
        ],
        choices: [
            {
                choiceId: 'grace_revisit_witness',
                text: "Witness.",
                nextNodeId: 'grace_revisit_closing',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'grace',
                    trustChange: 1
                }
            },
            {
                choiceId: 'grace_revisit_archive',
                text: "You're building an archive of lives.",
                nextNodeId: 'grace_revisit_closing',
                pattern: 'building',
                skills: ['systemsThinking']
            }
        ]
    },

    // ============= CLOSING =============
    {
        nodeId: 'grace_revisit_closing',
        speaker: 'Grace',
        content: [
            {
                text: `*She settles the book in her lap.* Thank you for seeing me then; it helped me see myself clearly.

Samuel's by the boards if you need him, but you can sit quietly with me anytime.`,
                emotion: 'grateful',
                variation_id: 'grace_revisit_closing_v1'
            }
        ],
        choices: [
            {
                choiceId: 'return_to_samuel_after_grace',
                text: "Return to Samuel.",
                nextNodeId: SAMUEL_HUB_AFTER_GRACE,
                pattern: 'exploring'
            },
            // Loyalty Experience trigger - only visible at high trust + helping pattern
            {
                choiceId: 'offer_vigil_help',
                text: "[Helper's Presence] Is there someone you're worried about? Someone who needs witnessing?",
                nextNodeId: 'grace_loyalty_trigger',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'empathy'],
                visibleCondition: {
                    trust: { min: 8 },
                    patterns: { helping: { min: 50 } }
                }
            }
        ]
    },

    // ============= LOYALTY EXPERIENCE TRIGGER =============
    {
        nodeId: 'grace_loyalty_trigger',
        speaker: 'Grace',
        content: [
            {
                text: `A patient may have hours left, and he's more afraid of being alone than dying.

I'm exhausted and still on shift, so I need help holding the room.

Will you sit with us?`,
                emotion: 'vulnerable_determined',
                variation_id: 'loyalty_trigger_v1',
                richEffectContext: 'warning'
            }
        ],
        requiredState: {
            trust: { min: 8 },
            patterns: { helping: { min: 5 } }
        },
        metadata: {
            experienceId: 'the_vigil'  // Triggers loyalty experience engine
        },
        choices: [
            {
                choiceId: 'accept_vigil_challenge',
                text: "I'll sit with you. No one should face that alone.",
                nextNodeId: 'grace_loyalty_start',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'empathy'],
                consequence: {
                    characterId: 'grace',
                    trustChange: 1
                }
            },
            {
                choiceId: 'acknowledge_but_decline',
                text: "Grace, you've already given so much. Trust your instincts.",
                nextNodeId: 'grace_loyalty_declined',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            }
        ],
        onEnter: [
            {
                characterId: 'grace',
                addKnowledgeFlags: ['loyalty_offered']
            }
        ],
        tags: ['loyalty_experience', 'grace_loyalty', 'high_trust']
    },

    {
        nodeId: 'grace_loyalty_declined',
        speaker: 'Grace',
        content: [
            {
                text: `You're right, I've done this a long time and I know how to hold space.

I second-guess myself sometimes, but I can do this.

Thank you for believing in me.`,
                emotion: 'resolved',
                variation_id: 'loyalty_declined_v1'
            }
        ],
        choices: [
            {
                choiceId: 'loyalty_declined_farewell',
                text: "You'll be exactly what he needs. Trust that.",
                nextNodeId: SAMUEL_HUB_AFTER_GRACE,
                pattern: 'patience'
            }
        ],
        onEnter: [
            {
                characterId: 'grace',
                addKnowledgeFlags: ['loyalty_declined_gracefully']
            }
        ]
    },

    {
        nodeId: 'grace_loyalty_start',
        speaker: 'Grace',
        content: [
            {
                text: `Thank you, truly.

Room 412; the night shift starts in an hour and I'll meet you there.

This matters more than you know.`,
                emotion: 'grateful_hopeful',
                variation_id: 'loyalty_start_v1'
            }
        ],
        metadata: {
            experienceId: 'the_vigil'  // Experience engine takes over
        },
        choices: []  // Experience engine handles next steps
    }
]

// ============= PUBLIC API =============

export const graceRevisitEntryPoints = {
    WELCOME: 'grace_revisit_welcome'
} as const

export const graceRevisitGraph: DialogueGraph = {
    version: '1.0.0',
    nodes: buildDialogueNodesMap('grace_revisit', graceRevisitNodes),
    startNodeId: graceRevisitEntryPoints.WELCOME,
    metadata: {
        title: "Grace's Revisit Content",
        author: 'Guided Generation',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: graceRevisitNodes.length,
        totalChoices: graceRevisitNodes.reduce((sum, n) => sum + n.choices.length, 0)
    }
}
