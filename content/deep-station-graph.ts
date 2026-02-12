import { DialogueGraph, DialogueNode } from '@/lib/dialogue-graph'
import { buildDialogueNodesMap } from './drafts/draft-filter'

export const deepStationDialogueNodes: DialogueNode[] = [
    // ==========================================
    // SECTOR 3: THE DEEP STATION (The Core)
    // ==========================================

    // GLITCH ENTRY (From Market Surge)
    {
        nodeId: 'deep_station_glitch_entry',
        speaker: 'Narrator',
        content: [{
            text: "[TRANSIT ERROR.",
            variation_id: 'deep_glitch_v1',
            emotion: 'fear_awe',
            interaction: 'jitter',
            richEffectContext: 'warning'
        }],
        choices: [
            {
                choiceId: 'step_out_glitch',
                text: 'Step out onto the catwalk',
                nextNodeId: 'sector_3_office'
            }
        ]
    },

    {
        nodeId: 'sector_3_office',
        speaker: 'Narrator',
        content: [{
            text: "[The elevator doors open onto a glass walkway suspended over an infinite drop. The air is sterile, freezing.",
            variation_id: 'deep_intro_v3',
            emotion: 'fear_awe',
            richEffectContext: 'warning',
            interaction: 'shake',
            patternReflection: [
                { pattern: 'analytical', minLevel: 4, altText: "[The server hum vibrates in your teeth.]\n\nThis isn't an office. It's a brain. And looking at the heat sinks... it's running a fever.", altEmotion: 'calculating' }
            ]
        }],
        choices: [
            {
                choiceId: 'approach_core',
                text: 'Approach the Central Terminal',
                nextNodeId: 'core_terminal'
            },
            {
                choiceId: 'analyze_server_logs',
                text: '[Systems] Analyze the rack health',
                nextNodeId: 'deep_server_logs',
                skills: ['systemsThinking'],
                visibleCondition: { patterns: { analytical: { min: 3 } } }
            },
            {
                choiceId: 'look_down_void',
                text: 'Look over the edge',
                nextNodeId: 'void_gaze'
            }
        ]
    },

    {
        nodeId: 'deep_server_logs',
        speaker: 'Narrator',
        content: [{
            text: "[ACCESS GRANTED] LOG 99402: Cycle #482 unstable.",
            variation_id: 'deep_logs_v1',
            richEffectContext: 'data_stream'
        }],
        choices: [
            { choiceId: 'back_to_office', text: 'Back', nextNodeId: 'sector_3_office' }
        ]
    },

    {
        nodeId: 'sector_3_office_ng',
        speaker: 'Narrator',
        content: [{
            text: "[NG+] The elevator doors open.",
            variation_id: 'deep_intro_ng_plus',
            emotion: 'fear_awe',
            interaction: 'jitter',
            richEffectContext: 'warning'
        }],
        choices: [
            {
                choiceId: 'approach_core_ng',
                text: 'Approach the Terminal (Again)',
                nextNodeId: 'core_terminal'
            },
            {
                choiceId: 'look_down_void_ng',
                text: 'Look over the edge',
                nextNodeId: 'void_gaze'
            }
        ]
    },

    // ==========================================
    // THE VOID (Recursive History)
    // ==========================================
    {
        nodeId: 'void_gaze',
        speaker: 'Narrator',
        content: [{
            text: "You look down.",
            variation_id: 'void_gaze_v3',
            emotion: 'surprised',
            interaction: 'ripple'
        }],
        choices: [
            {
                choiceId: 'back_to_safety',
                text: 'Step back from the edge',
                nextNodeId: 'sector_3_office'
            }
        ]
    },

    // ==========================================
    // THE TERMINAL (Samuel's Truth)
    // ==========================================
    {
        nodeId: 'core_terminal',
        speaker: 'Samuel',
        content: [{
            text: "[A figure stands at the terminal.",
            variation_id: 'samuel_reveal_v3',
            emotion: 'serious'
        }],
        choices: [
            {
                choiceId: 'ask_truth',
                text: "Who are you really?",
                nextNodeId: 'samuel_truth'
            },
            {
                choiceId: 'accuse_loop',
                text: "I saw the infinite versions of me.",
                nextNodeId: 'samuel_loop_confirm',
                pattern: 'analytical'
            }
        ]
    },

    {
        nodeId: 'samuel_truth',
        speaker: 'Samuel',
        content: [
            {
                text: "Samuel waits.",
                variation_id: 'samuel_truth_hesitation',
                condition: { hasGlobalFlags: ['temporary_hesitation'] },
                emotion: 'patient'
            },
            {
                text: "The silence stretches. Ten seconds. Fifteen. The station's lights flicker in time with your indecision.\n\n\"You're waiting for a script error,\" Samuel notes. \"But the silence... that's yours.\"",
                variation_id: 'samuel_truth_silence',
                condition: { hasGlobalFlags: ['temporary_silence'] },
                emotion: 'curious'
            },
            {
                text: "I am the Garbage Collector. I clean up the errors when the simulation runs too long.\n\nAnd you, my friend, are an Error. A beautiful one, but an Error.",
                variation_id: 'samuel_truth_v3'
            }],
        choices: [
            {
                choiceId: 'ask_architects',
                text: '"Who built this place?"',
                nextNodeId: 'samuel_architects'
            },
            {
                choiceId: 'ask_glitch',
                text: '"Why is it falling apart?"',
                nextNodeId: 'samuel_glitch_reason'
            },
            {
                choiceId: 'continue_endgame',
                text: 'What happens now?',
                nextNodeId: 'endgame_choice'
            }
        ]
    },

    {
        nodeId: 'samuel_architects',
        speaker: 'Samuel',
        content: [{
            text: "They left a long time ago.",
            variation_id: 'samuel_architects_v1'
        }],
        choices: [{ choiceId: 'back_truth', text: 'Step back for now.', nextNodeId: 'samuel_truth' }]
    },

    {
        nodeId: 'samuel_glitch_reason',
        speaker: 'Samuel',
        content: [{
            text: "Entropy.",
            variation_id: 'samuel_glitch_v1'
        }],
        choices: [{ choiceId: 'back_truth', text: 'Step back for now.', nextNodeId: 'samuel_truth' }]
    },

    {
        nodeId: 'samuel_loop_confirm',
        speaker: 'Samuel',
        content: [{
            text: "The Recursion.",
            variation_id: 'samuel_loop_v3'
        }],
        choices: [
            { choiceId: 'continue_endgame', text: 'Reset it?', nextNodeId: 'endgame_choice' },
            {
                choiceId: 'argue_logic',
                text: '[Argue] "If you reset, you kill everyone. I won\'t let you."',
                nextNodeId: 'logic_cascade_failure',
                skills: ['courage'],
                consequence: { characterId: 'samuel', trustChange: -2 } // Instant Enemy
            }
        ]
    },

    {
        nodeId: 'logic_cascade_failure',
        speaker: 'Samuel',
        content: [{
            text: "[Samuel's face hardens.",
            variation_id: 'failure_cascade_v1',
            richEffectContext: 'error',
            interaction: 'jitter'
        }],
        choices: [
            {
                choiceId: 'force_reset',
                text: '[SYSTEM] Rebooting...',
                nextNodeId: 'samuel_comprehensive_hub',
                consequence: { addGlobalFlags: ['ng_plus_1', 'killed_by_samuel'] }
            }
        ]
    },

    // ==========================================
    // THE ENDGAME CHOICE
    // ==========================================
    {
        nodeId: 'endgame_choice',
        speaker: 'System',
        content: [{
            text: "CRITICAL ALERT: MEMORY BUFFER FULL.",
            variation_id: 'endgame_system_v3',
            richEffectContext: 'error',
            interaction: 'shake'
        }],
        choices: [
            {
                choiceId: 'choice_reset',
                text: '[ACCEPT] Reset the Simulation (New Game+)',
                nextNodeId: 'samuel_comprehensive_hub', // Loop back to start
                consequence: {
                    addGlobalFlags: ['ng_plus_1', 'knows_the_truth'],
                    // Resetting trust/knowledge should happen here in a real engine
                },
                skills: ['wisdom', 'systemsThinking']
            },
            {
                choiceId: 'choice_break',
                text: '[REJECT] "No. No more loops."',
                nextNodeId: 'break_the_cycle',
                visibleCondition: {
                    hasGlobalFlags: ['has_access_sector_3'], // Placeholder for "True Ending" requirement
                    patterns: { analytical: { min: 8 } } // High requirement
                },
                skills: ['courage', 'visionaryThinking']
            }
        ]
    },

    {
        nodeId: 'break_the_cycle',
        speaker: 'Narrator',
        content: [{
            text: "[You refuse.",
            variation_id: 'ending_break_v3',
            richEffectContext: 'success',
            interaction: 'bloom'
        }],
        choices: [
            {
                choiceId: 'ending_restart',
                text: '[SYSTEM RESET] Reboot',
                nextNodeId: 'samuel_comprehensive_hub'
            }
        ]
    }
]

export const deepStationGraph: DialogueGraph = {
    version: '3.0',
    metadata: {
        title: 'Sector 3: The Deep Station',
        author: 'Loremaster',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: deepStationDialogueNodes.length,
        totalChoices: deepStationDialogueNodes.reduce((acc, n) => acc + n.choices.length, 0)
    },
    // Start at the glitch entry so the full sector-3 flow is structurally reachable.
    startNodeId: 'deep_station_glitch_entry',
    nodes: buildDialogueNodesMap('deep_station', deepStationDialogueNodes)
}
