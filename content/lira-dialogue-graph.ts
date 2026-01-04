import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const liraDialogueNodes: DialogueNode[] = [
    // ============= INTRODUCTION =============
    {
        nodeId: 'lira_introduction',
        speaker: 'Lira Vance',
        content: [
            {
                text: "It's quiet here. Too quiet.\n\n[She adjusts a bulky headset, her eyes closed, fingers tracing the air as if conducting an invisible orchestra.]\n\n\"The prompt was 'Silence before the storm,'\" she whispers. \"But the AI keeps adding rain. It doesn't understand the *pressure* of silence.\"",
                emotion: 'pensive',
                variation_id: 'intro_v1'
            }
        ],
        choices: [
            {
                choiceId: 'intro_listening',
                text: "What are you listening for?",
                nextNodeId: 'lira_explains_silence',
                pattern: 'patience',
                skills: ['observation'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'intro_technical',
                text: "Are you adjusting the noise gate?",
                nextNodeId: 'lira_explains_tech',
                pattern: 'analytical',
                skills: ['digitalLiteracy']
            }
        ],
        tags: ['introduction', 'lira_arc']
    },

    {
        nodeId: 'lira_explains_silence',
        speaker: 'Lira Vance',
        content: [
            {
                text: "The space between notes. That's where the emotion lives.\n\nI'm scoring a film about memory loss. The director wants 'Sadness.' The AI generates minor keys and slow tempos. Cliche.\n\nTrue sadness isn't slow music. It's a melody that tries to be happy but... forgets how.",
                emotion: 'melancholic',
                variation_id: 'silence_v1'
            }
        ],
        choices: [
            {
                choiceId: 'offer_audio_help',
                text: "Let's try to model that.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity']
            }
        ]
    },

    {
        nodeId: 'lira_explains_tech',
        speaker: 'Lira Vance',
        content: [
            {
                text: "Noise gate, compressor, reverb... all tools to shape the wave.\n\nBut the AI generates the wave from scratch. It's not recording; it's dreaming sound. And sometimes its dreams are... shallow.\n\nI need depth. Help me find it.",
                emotion: 'focused',
                variation_id: 'tech_v1'
            }
        ],
        choices: [
            {
                choiceId: 'ready_to_mix',
                text: "Open the synthesizer.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['digitalLiteracy']
            }
        ]
    },

    // ============= SIMULATION: AUDIO STUDIO (Suno/Udio) =============
    {
        nodeId: 'lira_simulation_setup',
        speaker: 'Lira Vance',
        content: [
            {
                text: "Goal: 'The sound of forgetting.'\n\nCurrent Output: Generic ambient drone. Boring.\n\nWe need to prompt for the *texture* of the sound, not just the genre.",
                emotion: 'challenging',
                variation_id: 'sim_setup_v1'
            }
        ],
        simulation: {
            type: 'audio_studio',
            title: 'Soundtrack Generation: "Memory Loss"',
            taskDescription: 'The AI is generating generic "sad ambient" music. Refine the prompt to create a complex, haunting melody that represents "forgetting".',
            initialContext: {
                label: 'Track: fading_echoes_v1.mp3',
                content: '[Prompt: "Sad ambient music, slow, piano"] -> Result: Generic spa music.',
                displayStyle: 'text'
            },
            successFeedback: '✓ RESONANCE ACHIEVED: The generated track features a disintegrating piano melody with vinyl crackle and unexpected silences.'
        },
        choices: [
            {
                choiceId: 'sim_refine_texture',
                text: "Prompt for 'Disintegrating tape loop, nostalgic piano, vinyl crackle, abruptly cutting out'.",
                nextNodeId: 'lira_simulation_success',
                pattern: 'building',
                skills: ['creativity', 'systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    addGlobalFlags: ['golden_prompt_voice'] // Reusing voice/audio flag
                }
            },
            {
                choiceId: 'sim_refine_emotion',
                text: "Focus on emotion: 'A song that is trying to remember itself'.",
                nextNodeId: 'lira_simulation_success',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'communication'],
                consequence: {
                    characterId: 'lira',
                    addGlobalFlags: ['golden_prompt_voice']
                }
            },
            {
                choiceId: 'sim_genre_swap',
                text: "Switch to 'Heavy Metal'. That's sad too, right?",
                nextNodeId: 'lira_simulation_fail',
                pattern: 'exploring' // "impulsive" not valid
            }
        ],
        tags: ['simulation', 'lira_arc']
    },

    {
        nodeId: 'lira_simulation_success',
        speaker: 'Lira Vance',
        content: [
            {
                text: "[The sound fills the room—a beautiful, broken piano melody that fades into static.]\n\nThat's it. You hear the static? That's the memory fading.\n\nYou didn't just ask for 'sad.' You described the *mechanism* of sadness. That's how you talk to the machine.",
                emotion: 'amazed',
                variation_id: 'sim_success_v1'
            }
        ],
        choices: [
            {
                choiceId: 'success_mechanism',
                text: "You have to understand the feeling to describe it.",
                nextNodeId: 'lira_conclusion',
                pattern: 'analytical',
                skills: ['emotionalIntelligence']
            }
        ]
    },

    {
        nodeId: 'lira_simulation_fail',
        speaker: 'Lira Vance',
        content: [
            {
                text: "[Aggressive guitar riffs blast through the headphones, shattering the mood.]\n\nNo! That's anger, not loss. You're just throwing random inputs to see what sticks.\n\nSilence isn't random. It's deliberate.",
                emotion: 'frustrated',
                variation_id: 'sim_fail_v1'
            }
        ],
        choices: [
            {
                choiceId: 'fail_apology',
                text: "My mistake. I'll listen closer next time.",
                nextNodeId: 'lira_conclusion',
                pattern: 'patience',
                skills: ['humility']
            }
        ]
    },

    {
        nodeId: 'lira_conclusion',
        speaker: 'Lira Vance',
        content: [
            {
                text: "I need to mix this down. But... thank you. For listening.",
                emotion: 'warm',
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

export const liraDialogueGraph: DialogueGraph = {
    version: '1.0.0',
    nodes: new Map(liraDialogueNodes.map(node => [node.nodeId, node])),
    startNodeId: 'lira_introduction',
    metadata: {
        title: "Lira's Silent Studio",
        author: 'Guided Generation',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: liraDialogueNodes.length,
        totalChoices: liraDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
    }
}
