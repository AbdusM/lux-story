import { DialogueGraph, DialogueNode } from '@/lib/dialogue-graph'

export const deepStationDialogueNodes: DialogueNode[] = [
    // ==========================================
    // SECTOR 3: THE DEEP STATION (The Core)
    // ==========================================

    // GLITCH ENTRY (From Market Surge)
    {
        nodeId: 'deep_station_glitch_entry',
        speaker: 'Narrator',
        content: [{
            text: "[TRANSIT ERROR. STOP OVERSHOT.]\n\nThe Mag-Lev screams as it bypasses the Residential Sector. The lights die. When the doors hiss open, there is no station platform.\n\nOnly a service catwalk suspended over an infinite black shaft. You are somewhere you shouldn't be.",
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
            text: "[The elevator doors open onto a glass walkway suspended over an infinite drop. The air is sterile, freezing.]\n\nWelcome to Sector 3. The noise of the station—the markets, the ads, the crowds—is gone. Here, there is only the hum of the servers and a rising Shepard Tone that never resolves.",
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
            text: "[ACCESS GRANTED]\n\nLOG 99402: Cycle #482 unstable. Memory leaks in Sector 2 (The Market) causing phantom geometry.\nLOG 99403: User 'Samuel' attempted unauthorized garbage collection. Denied.\n\nThe entire station isn't just old. It's senile.",
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
            text: "[NG+] The elevator doors open. The cold hits you like a memory. You have stood on this walkway before. You have fallen from it before.\n\nThe Shepard Tone isn't rising this time. It's screaming.",
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
            text: "You look down. You see... yourself. Looking up at yourself. An infinite chain of yous, falling into the dark.\n\nRecursion Error. The loop is visible here.",
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
            text: "[A figure stands at the terminal. It's Samuel. He isn't wearing his janitor jumpsuit. He wears a white coat that is perfectly clean.]\n\nYou made it. Most people stop at the Market. They get comfortable trading secrets.",
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
                text: "Samuel waits. The hum of the station fills the silence. He doesn't press you, but his eyes drift to the cursor—hesitant, hovering.\n\n\"It's heavy, isn't it?\" he asks softly.",
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
            text: "They left a long time ago. Or maybe they're still watching. I just know they stopped sending updates. We are abandonware, kid.",
            variation_id: 'samuel_architects_v1'
        }],
        choices: [{ choiceId: 'back_truth', text: '...', nextNodeId: 'samuel_truth' }]
    },

    {
        nodeId: 'samuel_glitch_reason',
        speaker: 'Samuel',
        content: [{
            text: "Entropy. You can't run a simulation forever without errors piling up. That 'Crowd Surge' you saw? That was just a buffer overflow.",
            variation_id: 'samuel_glitch_v1'
        }],
        choices: [{ choiceId: 'back_truth', text: '...', nextNodeId: 'samuel_truth' }]
    },

    {
        nodeId: 'samuel_loop_confirm',
        speaker: 'Samuel',
        content: [{
            text: "The Recursion. Yes. We call it the 'Logic Cascade'. The station builds on top of itself until it collapses.\n\nUnless we reset it.",
            variation_id: 'samuel_loop_v3'
        }],
        choices: [
            { choiceId: 'continue_endgame', text: 'Reset it?', nextNodeId: 'endgame_choice' },
            {
                choiceId: 'argue_logic',
                text: '[Argue] "If you reset, you kill everyone. I won\'t let you."',
                nextNodeId: 'logic_cascade_failure',
                skills: ['courage'],
                consequence: { characterId: 'samuel', trustChange: -50 } // Instant Enemy
            }
        ]
    },

    {
        nodeId: 'logic_cascade_failure',
        speaker: 'Samuel',
        content: [{
            text: "[Samuel's face hardens. The screen behind him turns red.]\n\nThen you leave me no choice. I cannot let the error propagate.\n\nFORCED SHUTDOWN INITIATED.",
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
            text: "CRITICAL ALERT: MEMORY BUFFER FULL.\n\nINITIATING PURGE PROTOCOL.\n\n[Samuel holds out a hand.]\n\n'Go back to the start. Try again. Maybe next time, you'll save everyone.'",
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
            text: "[You refuse. You step past Samuel and smash the terminal.]\n\nThe white light fracture. The Shepard Tone stops.\n\nSilence.\n\nTrue Silence.\n\n[TO BE CONTINUED IN ACT 2]",
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
    startNodeId: 'sector_3_office',
    nodes: new Map(deepStationDialogueNodes.map(n => [n.nodeId, n]))
}
