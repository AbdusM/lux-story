/**
 * THE CALIBRATION
 * A Systemic Vertical Slice
 * 
 * This scene forces the player to engage with the Narrative Gravity engine.
 * Samuel detects the player's bio-state and initiates a "calibrating" conversation.
 * 
 * DESIGN GOALS:
 * 1. Gravity Well: High Anxiety makes "Calm" choices physically hard to reach (sorted to bottom).
 * 2. Chemical Lock: The "True" path requires a specific internal state (Ventral/Resilience).
 * 3. Sonic Peak: The Generative Score should be active and responsive here.
 */

import { DialogueNode } from '@/lib/dialogue-graph'

export const systemicCalibrationNodes: DialogueNode[] = [
    {
        nodeId: 'systemic_calibration_start',
        speaker: 'Samuel Washington',
        content: [
            {
                text: "Hold up a second. <shake>You're vibratin' like a tuning fork.</shake>\n\nI can hear it from here. The static. You carryin' a lot of noise with you, traveler.",
                emotion: 'concerned',
                variation_id: 'calibration_v1'
            }
        ],
        choices: [
            {
                choiceId: 'calib_defensive',
                text: "I'm fine. Just let me through.",
                nextNodeId: 'systemic_calibration_friction',
                pattern: 'analytical', // SYMPATHETIC ATTRACTOR (If Anxious, this floats to top)
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'samuel',
                    trustChange: -1 // Friction
                }
            },
            {
                choiceId: 'calib_masking',
                text: "It's just been a long trip.",
                nextNodeId: 'systemic_calibration_friction',
                pattern: 'building', // SYMPATHETIC NEUTRAL/REPULSION
                skills: ['adaptability']
            },
            {
                choiceId: 'calib_vulnerable',
                text: "It is... loud. In my head.",
                nextNodeId: 'systemic_calibration_acceptance',
                pattern: 'patience', // SYMPATHETIC REPULSOR (If Anxious, this sinks to bottom & dims)
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'samuel',
                    trustChange: 1
                }
            }
        ],
        tags: ['systemic_event', 'calibration']
    },

    {
        nodeId: 'systemic_calibration_friction',
        speaker: 'Samuel Washington',
        content: [
            {
                text: "See? That's the static talking. Tight. Fast. <bloom>Reactive.</bloom>\n\nYou can't find your platform looking like that. The Station won't let you. It responds to what you bring it.",
                emotion: 'stern',
                variation_id: 'friction_v1'
            }
        ],
        choices: [
            {
                choiceId: 'calib_force',
                text: "I act on what I see.",
                nextNodeId: 'systemic_calibration_fail',
                pattern: 'analytical',
                skills: ['criticalThinking']
            },
            {
                choiceId: 'calib_breath',
                text: "[Take a deep breath] You're right. I'm rushing.",
                nextNodeId: 'systemic_calibration_test',
                pattern: 'patience', // The "Correct" path, physically hard to click if Anxious
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'samuel',
                    trustChange: 1,
                    patternChanges: { patience: 2 } // Boost resilience
                }
            }
        ]
    },

    {
        nodeId: 'systemic_calibration_acceptance',
        speaker: 'Samuel Washington',
        content: [
            {
                text: "Yeah.",
                emotion: 'warm',
                variation_id: 'acceptance_v1'
            }
        ],
        choices: [
            {
                choiceId: 'calib_continue_acceptance',
                text: "[Exhale]",
                nextNodeId: 'systemic_calibration_test',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            }
        ]
    },

    {
        nodeId: 'systemic_calibration_test',
        speaker: 'Samuel Washington',
        content: [
            {
                text: "Let's calibrate. Just for a second.",
                emotion: 'hypnotic',
                variation_id: 'test_v1'
            }
        ],
        choices: [
            {
                choiceId: 'calib_fear_failure',
                text: "The fear that I'm wasting time.",
                nextNodeId: 'samuel_explains_station', // Loop back to main flow
                pattern: 'analytical', // Sympathetic Attract
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'samuel',
                    trustChange: 1,
                    thoughtId: 'fear-of-failure' // Internalizes thought
                }
            },
            {
                choiceId: 'calib_fear_disconnection',
                text: "The feeling that I'm invisible.",
                nextNodeId: 'samuel_explains_station',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'samuel',
                    trustChange: 1,
                    thoughtId: 'fear-of-isolation'
                }
            },
            {
                choiceId: 'calib_fear_stagnation',
                text: "The weight of everything I haven't built yet.",
                nextNodeId: 'samuel_explains_station',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'samuel',
                    trustChange: 1,
                    thoughtId: 'creative-block'
                }
            }
        ],
        onEnter: [
            {
                characterId: 'samuel',
                // This is a "Resonance Check" point - audio should dip here
            }
        ]
    },

    {
        nodeId: 'systemic_calibration_fail',
        speaker: 'Samuel Washington',
        content: [
            {
                text: "The Station is a mirror, kid.",
                emotion: 'dismissive',
                variation_id: 'fail_v1'
            }
        ],
        choices: [
            {
                choiceId: 'calib_fail_exit',
                text: "Fine.",
                nextNodeId: 'samuel_explains_station',
                pattern: 'analytical',
                consequence: {
                    characterId: 'samuel',
                    trustChange: -1
                }
            }
        ]
    }
]
