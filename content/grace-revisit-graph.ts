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

/**
 * Samuel Entry Point Constant
 * Used to link back to Samuel without circular imports
 */
const SAMUEL_HUB_AFTER_GRACE = 'samuel_hub_after_grace'

export const graceRevisitNodes: DialogueNode[] = [
    // ============= WELCOME BACK (Entry Point) =============
    {
        nodeId: 'grace_revisit_welcome',
        speaker: 'Grace',
        content: [
            {
                text: `*Grace is sitting on the same bench. But the worn tote bag is gone, replaced by a small sketchbook.*
        
*She looks up as you approach. The tired lines around her eyes seem softer today.*

You came back.

*She closes the book.*

I was just thinking about you. About... how we met.{{player_sat_quietly: Most people rush to fill the silence. You sat with me. That meant a lot.|}}{{player_asked_questions: You asked the hard questions. Made me say out loud things I'd been keeping quiet.|}}`,
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
                // pattern: 'observing', // Invalid pattern
                skills: ['emotionalIntelligence']
            }
        ]
    },

    // ============= UPDATE =============
    {
        nodeId: 'grace_revisit_update',
        speaker: 'Grace',
        content: [
            {
                text: `*She touches the cover of the book.*

Writing things down. Stories.

Mrs. Willams passed last week.{{handled_moment_well: I stayed with her, just like we talked about. It was peaceful.|}} But before the end, she told me about her life. About dancing in the jazz clubs on 52nd Street.

*She looks at you.*

I realized... if I don't write it down, who remembers? I'm not just a caregiver anymore. I'm a witness.

{{knows_invisible_skill: You said presence was a skill. I'm starting to believe you.|}}`,
                emotion: 'reflective',
                variation_id: 'grace_revisit_update_v1'
            }
        ],
        choices: [
            {
                choiceId: 'grace_revisit_witness',
                text: "Witness. That's a powerful role.",
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
                text: `Exactly.

*She puts the book in her lap.*

Thank you. For seeing me back then. It helped me see myself a little clearer.

Samuel's over by the boards if you need him. But... feel free to come sit quietly anytime. I won't mind.`,
                emotion: 'grateful',
                variation_id: 'grace_revisit_closing_v1'
            }
        ],
        choices: [
            {
                choiceId: 'return_to_samuel_after_grace',
                text: "Return to Samuel",
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
                text: `How did you—

Mr. Davis. End-stage. His daughter's flying in from Seattle, but the doctors say... maybe 48 hours. Maybe less.

He's scared. Not of dying—he's made peace with that. But of being alone when it happens. Of the silence.

I'm on shift tonight. Third night in a row. I'm exhausted, but I can't leave him. Not like this.

You understand presence. Would you... sit with us? Just for a few hours. Help me hold space for him?`,
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
                text: `You're right. I've been doing this a long time. I know how to hold space.

Sometimes I second-guess myself. But I know what presence looks like. I can do this.

Thank you for believing in me. That's its own kind of witnessing.`,
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
                text: `Thank you. I— thank you.

Room 412. The night shift starts in an hour. I'll meet you there.

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
    nodes: new Map(graceRevisitNodes.map(node => [node.nodeId, node])),
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
