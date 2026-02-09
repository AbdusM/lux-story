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
const SAMUEL_HUB_AFTER_GRACE = 'TRAVEL_PENDING'

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
                nextNodeId: 'grace_revisit_update',
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
