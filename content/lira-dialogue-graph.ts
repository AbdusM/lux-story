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
                variation_id: 'silence_v1',
                interrupt: {
                    duration: 3500,
                    type: 'comfort',
                    action: 'Let your silence say you understand',
                    targetNodeId: 'lira_interrupt_comfort',
                    consequence: {
                        characterId: 'lira',
                        trustChange: 2
                    }
                }
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
    },

    // ============= INTERRUPT TARGET NODES =============
    {
        nodeId: 'lira_interrupt_comfort',
        speaker: 'Lira Vance',
        content: [
            {
                text: `*The headphones slip off. She looks at you, surprised by the silence.*

*Long pause.*

You didn't say anything. Most people try to fill the quiet. Try to fix it with words.

*Small, grateful smile.*

That's what people don't understand about composing. It's not about adding sounds. It's about knowing when NOT to add them.

*Quieter.*

Thank you. For not filling the space.`,
                emotion: 'vulnerable_grateful',
                variation_id: 'interrupt_comfort_v1'
            }
        ],
        choices: [
            {
                choiceId: 'lira_from_interrupt',
                text: "Silence can be its own kind of music.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'interrupt_response']
    },

    // ============= VULNERABILITY ARC (Trust ≥ 6) =============
    // "The sound of forgetting" - why she understands loss so deeply
    {
        nodeId: 'lira_vulnerability_arc',
        speaker: 'Lira Vance',
        content: [
            {
                text: `*She removes her headphones completely. The studio falls silent.*

Can I tell you something? About why I chose this project?

*Pause.*

My grandmother was a pianist. Concert level. She could play Chopin from memory at seventy.

*Voice catches.*

Then she started forgetting. Not the music at first—just names, faces. But then... piece by piece...

*Touches the mixing board.*

The last time I visited, she sat at the piano. Her hands moved to a melody I'd never heard. She was trying to play something. Trying so hard. But the notes kept... scattering.

*Wipes her eyes.*

That's what forgetting sounds like. A song trying to remember itself.

That's what I'm trying to capture. Not sadness. Memory unraveling.`,
                emotion: 'grieving_vulnerable',
                variation_id: 'vulnerability_v1',
                richEffectContext: 'warning'
            }
        ],
        requiredState: {
            trust: { min: 6 }
        },
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['lira_vulnerability_revealed', 'knows_about_grandmother']
            }
        ],
        choices: [
            {
                choiceId: 'lira_vuln_honor_her',
                text: "You're not just scoring a film. You're preserving her.",
                nextNodeId: 'lira_vulnerability_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'lira_vuln_understand_now',
                text: "Now I understand why the generic 'sad music' feels wrong.",
                nextNodeId: 'lira_vulnerability_response',
                pattern: 'analytical',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'lira_vuln_silence',
                text: "[Let the memory breathe. She needs a witness, not words.]",
                nextNodeId: 'lira_vulnerability_response',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'vulnerability', 'emotional_core']
    },

    {
        nodeId: 'lira_vulnerability_response',
        speaker: 'Lira Vance',
        content: [
            {
                text: `*She takes a deep breath.*

She doesn't remember me now. Most days she doesn't remember she was a pianist.

*Small smile through tears.*

But sometimes... sometimes she hums. This broken little melody. And for a moment, I see her in there. Trying to find her way back.

*Touches the mixing board gently.*

So when I compose, I don't just use the AI to generate pretty sounds. I use it to find the fragments. The almost-melodies. The notes that want to connect but can't quite reach each other.

*Looks at you.*

That's what loss sounds like. Not silence. Not sadness. Just... pieces trying to become whole again.

*Quiet determination.*

This soundtrack will have her in it. Somewhere in the static, in the gaps between notes. She'll be there.`,
                emotion: 'resolved_tender',
                interaction: 'nod',
                variation_id: 'vulnerability_response_v1'
            }
        ],
        choices: [
            {
                choiceId: 'lira_vuln_to_sim',
                text: "Then let's make something she'd recognize.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['communication'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'vulnerability', 'resolution']
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
