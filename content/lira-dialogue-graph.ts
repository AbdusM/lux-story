/**
 * Lira's Dialogue Graph
 * The Sonic Archaeologist - Film Composer using AI Audio Generation
 *
 * CHARACTER: The Sound Alchemist
 * Core Conflict: "Sonic Texture" vs. "Generic Mood" - precise emotion through sound design
 * Arc: From "Tool User" to "Memory Keeper"
 * Vulnerability: Grandmother was a concert pianist who lost memories to dementia
 * Core Quest: "Capture the sound of a song trying to remember itself"
 */

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
            },
            {
                choiceId: 'intro_creative',
                text: "How do you teach a machine about pressure?",
                nextNodeId: 'lira_teaching_machines',
                pattern: 'exploring',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
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
                nextNodeId: 'lira_process_intro',
                pattern: 'building',
                skills: ['creativity']
            },
            {
                choiceId: 'ask_about_film',
                text: "Tell me about this film you're scoring.",
                nextNodeId: 'lira_film_context',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ]
    },

    // New node: Film context - leads to grandmother reveal
    {
        nodeId: 'lira_film_context',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She pauses, something shifting behind her eyes.*\n\nIt's called 'The Last Recital.' About a pianist in her seventies. Early-stage dementia. She can still play, but the pieces are... fragmenting.\n\nThe director found me specifically. Said my portfolio had 'something broken in the best way.'\n\n*Quiet laugh.*\n\nShe didn't know why. I never told her.",
                emotion: 'guarded_vulnerable',
                variation_id: 'film_context_v1'
            }
        ],
        choices: [
            {
                choiceId: 'ask_why_broken',
                text: "Why does your music sound broken?",
                nextNodeId: 'lira_grandmother_hint',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'respect_boundary',
                text: "[Let the unspoken stay unspoken. For now.]",
                nextNodeId: 'lira_process_intro',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'vulnerability_setup']
    },

    // New node: First hint about grandmother
    {
        nodeId: 'lira_grandmother_hint',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She removes one headphone, letting the ambient hum fill the silence.*\n\nBecause I grew up listening to broken music.\n\nMy grandmother... she was a concert pianist. Chopin, Debussy, Rachmaninoff. Perfect execution. Until it wasn't.\n\n*Her voice catches.*\n\nI'm not ready to talk about it yet. But... thank you for asking like you meant it.",
                emotion: 'grateful_guarded',
                variation_id: 'grandmother_hint_v1'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['lira_grandmother_mentioned']
            }
        ],
        choices: [
            {
                choiceId: 'hint_continue',
                text: "When you're ready. I'm here.",
                nextNodeId: 'lira_process_intro',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'vulnerability_hint']
    },

    // New node: Teaching machines about pressure
    {
        nodeId: 'lira_teaching_machines',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She tilts her head, intrigued.*\n\nMost people ask 'Can machines feel?' You ask how to teach them.\n\nThe answer is: you don't teach emotion. You teach texture. The difference between a single violin and a violin section. The micro-silences between notes. The way a voice cracks on a specific syllable.\n\nEmotion isn't in the notes. It's in the imperfections.",
                emotion: 'engaged',
                variation_id: 'teaching_machines_v1'
            }
        ],
        choices: [
            {
                choiceId: 'imperfections_human',
                text: "So the machine needs to learn how to fail beautifully.",
                nextNodeId: 'lira_beautiful_failure',
                pattern: 'building',
                skills: ['creativity', 'systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'imperfections_technical',
                text: "How do you prompt for imperfection?",
                nextNodeId: 'lira_process_intro',
                pattern: 'analytical',
                skills: ['digitalLiteracy']
            }
        ],
        tags: ['lira_arc', 'process']
    },

    // New node: Beautiful failure concept
    {
        nodeId: 'lira_beautiful_failure',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*Her eyes widen. For a moment, she looks almost startled.*\n\n'Beautiful failure.' Yes. That's exactly it.\n\nA perfectly played note is forgettable. A note that almost breaks, that trembles at the edge of control... that's what makes you feel something.\n\n*She leans forward.*\n\nYou understand this. Most people want the AI to be perfect. You understand that perfect is dead.",
                emotion: 'recognized',
                variation_id: 'beautiful_failure_v1'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                trustChange: 1
            }
        ],
        choices: [
            {
                choiceId: 'failure_to_process',
                text: "Show me how you create that.",
                nextNodeId: 'lira_process_intro',
                pattern: 'building',
                skills: ['curiosity']
            }
        ],
        tags: ['lira_arc', 'trust_building']
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
                nextNodeId: 'lira_process_intro',
                pattern: 'building',
                skills: ['digitalLiteracy']
            },
            {
                choiceId: 'ask_about_dreams',
                text: "What makes a dream shallow?",
                nextNodeId: 'lira_shallow_dreams',
                pattern: 'exploring',
                skills: ['curiosity']
            }
        ]
    },

    // New node: Shallow dreams
    {
        nodeId: 'lira_shallow_dreams',
        speaker: 'Lira Vance',
        content: [
            {
                text: "The AI trained on millions of songs. Pop. Film scores. Stock music. It learned patterns.\n\n'Sad' = minor key + slow tempo + piano.\n'Happy' = major key + faster + acoustic guitar.\n\nIt knows the shapes of emotion. But shapes aren't feelings. A teardrop shape isn't grief.\n\n*She traces a curve in the air.*\n\nGrief is what made the tear fall.",
                emotion: 'teaching',
                variation_id: 'shallow_dreams_v1'
            }
        ],
        choices: [
            {
                choiceId: 'dreams_to_process',
                text: "So you have to prompt for the cause, not the effect.",
                nextNodeId: 'lira_process_intro',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'process']
    },

    // ============= COMPOSITION PROCESS =============
    {
        nodeId: 'lira_process_intro',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She pulls up a waveform on her screen.*\n\nThis is my process. I don't just prompt once. I build in layers.\n\nFirst: the skeleton. Basic melody, rhythm. The AI is good at this.\n\nSecond: the skin. Texture, timbre. This is where I fight it.\n\nThird: the soul. The thing that makes you *feel*. This is where I fail. Every time.",
                emotion: 'determined',
                variation_id: 'process_intro_v1'
            }
        ],
        choices: [
            {
                choiceId: 'process_skeleton',
                text: "Show me the skeleton first.",
                nextNodeId: 'lira_skeleton_demo',
                pattern: 'analytical',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'process_soul',
                text: "Skip to the soul. That's where you need help.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity']
            },
            {
                choiceId: 'process_why_fail',
                text: "Why do you always fail at the soul?",
                nextNodeId: 'lira_why_fail',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'process']
    },

    // New node: Skeleton demonstration
    {
        nodeId: 'lira_skeleton_demo',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She types: 'Piano melody, C minor, 72 BPM, melancholic.'*\n\n[A simple, competent piano line plays.]\n\nSee? It's... fine. It knows music theory. It can generate endless variations on 'sad piano.'\n\nBut this is like asking someone to describe sadness by listing symptoms. 'Tears. Slow movement. Low energy.' Accurate. Empty.\n\n*She mutes it.*\n\nNow watch what happens when I add context.",
                emotion: 'teaching',
                variation_id: 'skeleton_v1'
            }
        ],
        choices: [
            {
                choiceId: 'skeleton_continue',
                text: "Add the context.",
                nextNodeId: 'lira_context_demo',
                pattern: 'exploring',
                skills: ['curiosity']
            }
        ],
        tags: ['lira_arc', 'process']
    },

    // New node: Context demonstration
    {
        nodeId: 'lira_context_demo',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She types: 'Piano melody. The pianist is 75. Her hands remember more than her mind. The melody keeps trying to resolve but forgets where home is.'*\n\n[A different melody plays. Same key. But the notes hesitate. Repeat. Search.]\n\n*She closes her eyes.*\n\nBetter. But still... it's performing sadness. It hasn't lived it.",
                emotion: 'frustrated_hopeful',
                variation_id: 'context_v1'
            }
        ],
        choices: [
            {
                choiceId: 'context_to_simulation',
                text: "What would 'living it' look like in a prompt?",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity']
            },
            {
                choiceId: 'context_personal',
                text: "You sound like you've lived it.",
                nextNodeId: 'lira_why_fail',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'process']
    },

    // New node: Why she fails at the soul
    {
        nodeId: 'lira_why_fail',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She's quiet for a long moment.*\n\nBecause the soul requires truth. And I've been dancing around mine.\n\nThis film... it's not just work. It's personal. The pianist losing her memory? That's not fiction.\n\n*Her voice drops.*\n\nThat's my grandmother. Or it was.",
                emotion: 'raw',
                variation_id: 'why_fail_v1'
            }
        ],
        choices: [
            {
                choiceId: 'fail_tell_more',
                text: "Tell me about her.",
                nextNodeId: 'lira_grandmother_story',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'fail_music_first',
                text: "Maybe working on the music will help you tell her story.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity']
            },
            {
                choiceId: 'fail_patience',
                text: "[Let the admission breathe. She'll share when ready.]",
                nextNodeId: 'lira_grandmother_story',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'vulnerability_gateway']
    },

    // New node: Grandmother story
    {
        nodeId: 'lira_grandmother_story',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She removes her headphones entirely. The studio falls silent.*\n\nGrandma Rose. Rosa Maria Delgado-Vance. Concert pianist. She performed at Carnegie Hall when she was 22.\n\nShe taught me everything. Not just piano, everything about how sound carries meaning. 'Music isn't in the notes,' she'd say. 'It's in the breath between them.'\n\n*Her voice wavers.*\n\nShe started forgetting small things first. Keys. Appointments. Then the music started... fragmenting.",
                emotion: 'grieving',
                variation_id: 'grandmother_story_v1'
            }
        ],
        choices: [
            {
                choiceId: 'story_fragmenting',
                text: "What do you mean, fragmenting?",
                nextNodeId: 'lira_fragmenting_memory',
                pattern: 'exploring',
                skills: ['curiosity', 'emotionalIntelligence']
            },
            {
                choiceId: 'story_silence',
                text: "[Hold space for the memory. Some stories need witnesses, not questions.]",
                nextNodeId: 'lira_fragmenting_memory',
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

    // New node: Fragmenting memory - key emotional scene
    {
        nodeId: 'lira_fragmenting_memory',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She stares at the waveform on screen, but she's seeing something else.*\n\nShe'd start Clair de Lune. Flawless. Then somewhere in the middle... she'd skip. Jump to a different piece. Mozart bleeding into Chopin.\n\nHer hands still knew the shapes. But the map of what came next... it was dissolving.\n\n*Wipes her eyes.*\n\nThe last time she played for me, she stopped mid-phrase. Looked at her hands like they'd betrayed her. Said: 'I can hear it in my head. But my fingers can't find it anymore.'\n\nThat sound. A song trying to remember itself. That's what I'm trying to capture.",
                emotion: 'grieving_determined',
                variation_id: 'fragmenting_v1',
                richEffectContext: 'warning'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['lira_core_vulnerability_revealed']
            }
        ],
        choices: [
            {
                choiceId: 'fragmenting_honor',
                text: "You're not just scoring a film. You're preserving her.",
                nextNodeId: 'lira_preservation',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'fragmenting_sound',
                text: "That sound exists. It's in your memory. We just need to translate it.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity', 'emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'fragmenting_silence',
                text: "[Let the weight of loss settle. Don't rush to fix it.]",
                nextNodeId: 'lira_preservation',
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

    // New node: Preservation theme
    {
        nodeId: 'lira_preservation',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She takes a shaky breath.*\n\nPreserving her. Yes. That's exactly what I'm doing. And failing at.\n\nBecause every prompt I write is an approximation. A description of the feeling, not the feeling itself.\n\nI can tell the AI 'a melody that hesitates.' But I can't give it the way her face looked when she lost the next note. The silence that lasted three seconds but felt like a lifetime.\n\n*Quiet resolve.*\n\nBut maybe... maybe that's the point. Maybe the imperfection is the message.",
                emotion: 'resolved_vulnerable',
                variation_id: 'preservation_v1'
            }
        ],
        choices: [
            {
                choiceId: 'preservation_to_sim',
                text: "Let's try. Imperfection and all.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'vulnerability']
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
            successFeedback: 'RESONANCE ACHIEVED: The generated track features a disintegrating piano melody with vinyl crackle and unexpected silences.'
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
                    addGlobalFlags: ['golden_prompt_voice']
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
                choiceId: 'sim_hybrid',
                text: "'Piano melody, early dementia, the music knows something is wrong before she does.'",
                nextNodeId: 'lira_simulation_breakthrough',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'creativity'],
                consequence: {
                    characterId: 'lira',
                    addGlobalFlags: ['golden_prompt_voice'],
                    trustChange: 2
                }
            },
            {
                choiceId: 'sim_genre_swap',
                text: "Switch to 'Heavy Metal'. That's sad too, right?",
                nextNodeId: 'lira_simulation_fail',
                pattern: 'exploring'
            }
        ],
        tags: ['simulation', 'lira_arc']
    },

    {
        nodeId: 'lira_simulation_success',
        speaker: 'Lira Vance',
        content: [
            {
                text: "[The sound fills the room - a beautiful, broken piano melody that fades into static.]\n\nThat's it. You hear the static? That's the memory fading.\n\nYou didn't just ask for 'sad.' You described the *mechanism* of sadness. That's how you talk to the machine.",
                emotion: 'amazed',
                variation_id: 'sim_success_v1'
            }
        ],
        choices: [
            {
                choiceId: 'success_mechanism',
                text: "You have to understand the feeling to describe it.",
                nextNodeId: 'lira_deeper_work',
                pattern: 'analytical',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'success_more',
                text: "What else does this track need?",
                nextNodeId: 'lira_layering',
                pattern: 'building',
                skills: ['creativity']
            }
        ]
    },

    // New node: Simulation breakthrough - best outcome
    {
        nodeId: 'lira_simulation_breakthrough',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She freezes as the sound plays.*\n\n[A piano melody begins confidently, then starts repeating phrases, searching, the harmony drifting slightly off before correcting itself.]\n\n*Her hand covers her mouth.*\n\nOh.\n\n*Tears in her eyes.*\n\nThat's... that's her. That hesitation. The way she used to pause, searching for the next note. You gave it her uncertainty.\n\nHow did you know to prompt it that way?",
                emotion: 'overwhelmed_grateful',
                variation_id: 'sim_breakthrough_v1',
                richEffectContext: 'success'
            }
        ],
        choices: [
            {
                choiceId: 'breakthrough_listening',
                text: "I was listening to how you described her. The music knows something is wrong.",
                nextNodeId: 'lira_breakthrough_reflection',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'breakthrough_building',
                text: "I thought about the gap between knowing and doing. The body remembering what the mind forgets.",
                nextNodeId: 'lira_breakthrough_reflection',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['simulation', 'lira_arc', 'emotional_peak']
    },

    // New node: Breakthrough reflection
    {
        nodeId: 'lira_breakthrough_reflection',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She plays the track again, softer.*\n\nI've been trying to capture her for months. Generic prompts. Technical specifications. All wrong.\n\nYou gave me one sentence and it worked because... because you weren't describing sound. You were describing experience.\n\n*She looks at you.*\n\nThat's the secret, isn't it? AI doesn't need technical instructions. It needs human truth.",
                emotion: 'illuminated',
                variation_id: 'breakthrough_reflection_v1'
            }
        ],
        choices: [
            {
                choiceId: 'reflection_continue',
                text: "The machine can only echo what we give it. Give it truth, get truth back.",
                nextNodeId: 'lira_layering',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'insight']
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
                nextNodeId: 'lira_simulation_retry',
                pattern: 'patience',
                skills: ['humility']
            },
            {
                choiceId: 'fail_explain',
                text: "I wanted to see how it handles contrast. What happens when you go completely wrong?",
                nextNodeId: 'lira_contrast_lesson',
                pattern: 'exploring',
                skills: ['curiosity']
            }
        ]
    },

    // New node: Simulation retry
    {
        nodeId: 'lira_simulation_retry',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*Her frustration softens.*\n\nOkay. Okay, that's fair. Most people don't apologize, they double down.\n\nLet's try again. Think about what we're actually trying to capture. Not 'sadness.' Not a genre. A specific moment of loss.\n\nWhat does forgetting sound like?",
                emotion: 'patient_teaching',
                variation_id: 'retry_v1'
            }
        ],
        choices: [
            {
                choiceId: 'retry_attempt',
                text: "It sounds like a phrase that repeats because it forgot where it was going.",
                nextNodeId: 'lira_simulation_success',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'simulation']
    },

    // New node: Contrast lesson
    {
        nodeId: 'lira_contrast_lesson',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She pauses, considering.*\n\nHuh. That's actually... interesting. Wrong, but interesting.\n\nWhen you prompt for the opposite of what you want, you see what the AI *thinks* the opposite is. Heavy metal for sad ambient? It reveals the AI's internal model of 'sadness' and 'anger.'\n\n*Small smile.*\n\nOkay, you get partial credit for that. But next time, warn me before you blow out my speakers.",
                emotion: 'grudgingly_impressed',
                variation_id: 'contrast_v1'
            }
        ],
        choices: [
            {
                choiceId: 'contrast_continue',
                text: "Now let's try the real prompt.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity']
            }
        ],
        tags: ['lira_arc', 'simulation']
    },

    // New node: Layering process
    {
        nodeId: 'lira_layering',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She pulls up a new track.*\n\nNow we layer. The melody is the skeleton. But a body needs more.\n\nI'll add: vinyl crackle. Tape hiss. The sound of age. Of degradation.\n\nAnd then... the breath. The space between notes where the silence speaks.\n\n*She types another prompt.*\n\n'Breathing between piano notes. An old woman pausing to remember. The silence is louder than the music.'",
                emotion: 'focused_creative',
                variation_id: 'layering_v1'
            }
        ],
        choices: [
            {
                choiceId: 'layering_wait',
                text: "[Watch her work. Let the creation happen.]",
                nextNodeId: 'lira_deeper_work',
                pattern: 'patience',
                skills: ['observation'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'layering_suggest',
                text: "Add her heartbeat. Irregular. The body still fighting even when the mind is lost.",
                nextNodeId: 'lira_heartbeat_addition',
                pattern: 'helping',
                skills: ['creativity', 'emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'process']
    },

    // New node: Heartbeat addition
    {
        nodeId: 'lira_heartbeat_addition',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She stops typing. Stares at you.*\n\nThe heartbeat. The body still fighting.\n\n*Her voice breaks.*\n\nGrandma's heart was the last thing to give up. Even when she couldn't speak, couldn't play, couldn't recognize us... you could hear it. Still beating. Still trying.\n\n*She adds the prompt.*\n\n[The track plays: piano, vinyl crackle, silence... and underneath, a slow, irregular heartbeat.]\n\n*She's crying but smiling.*\n\nShe's there. In the sound. You helped put her there.",
                emotion: 'tearful_grateful',
                variation_id: 'heartbeat_v1',
                richEffectContext: 'success'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['lira_composition_complete']
            }
        ],
        choices: [
            {
                choiceId: 'heartbeat_continue',
                text: "She was always there. We just found a way to hear her.",
                nextNodeId: 'lira_deeper_work',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'emotional_peak']
    },

    // New node: Deeper work - what the music means
    {
        nodeId: 'lira_deeper_work',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She saves the track, labels it 'Rose_v7_final.wav'*\n\nYou know what's strange? I've been afraid of this work. Not the technical part. The emotional part.\n\nEvery time I got close to capturing her, I'd sabotage it. Add more instruments. Change the tempo. Anything to avoid hearing her disappear again.\n\n*She looks at the waveform.*\n\nYou helped me stop running.",
                emotion: 'vulnerable_grateful',
                variation_id: 'deeper_work_v1'
            }
        ],
        choices: [
            {
                choiceId: 'deeper_running',
                text: "Sometimes we need someone to run alongside us before we can stop.",
                nextNodeId: 'lira_memory_philosophy',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'deeper_purpose',
                text: "The work needed to happen. For her. For you.",
                nextNodeId: 'lira_memory_philosophy',
                pattern: 'building',
                skills: ['wisdom']
            }
        ],
        tags: ['lira_arc', 'reflection']
    },

    // New node: Memory philosophy
    {
        nodeId: 'lira_memory_philosophy',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She puts on the headphones, plays the track softly.*\n\nYou know what I've learned? Memory isn't accurate. It's not a recording. It's a reconstruction.\n\nEvery time we remember, we change the memory a little. Add things. Lose things.\n\nThat's what the AI does too. It takes data and reconstructs it. Imperfectly. Like us.\n\n*She removes the headphones.*\n\nMaybe that's why it can capture her. Because it fails the way memory fails.",
                emotion: 'philosophical',
                variation_id: 'memory_philosophy_v1'
            }
        ],
        choices: [
            {
                choiceId: 'philosophy_to_future',
                text: "What will you do with this track?",
                nextNodeId: 'lira_future_vision',
                pattern: 'exploring',
                skills: ['curiosity']
            },
            {
                choiceId: 'philosophy_meaning',
                text: "So imperfection isn't a bug. It's the whole point.",
                nextNodeId: 'lira_conclusion_full',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'philosophy']
    },

    // New node: Future vision
    {
        nodeId: 'lira_future_vision',
        speaker: 'Lira Vance',
        content: [
            {
                text: "The film score. Obviously. But... more than that.\n\nI want to teach other composers what I learned. Not just how to use AI tools, but how to prompt for truth. How to translate human experience into machine-readable language.\n\n*She looks at her grandmother's photo on the desk.*\n\nGrandma Rose taught me to hear the breath between notes. I want to teach others to give that breath to machines.\n\nSo the machines can help us remember.",
                emotion: 'hopeful_determined',
                variation_id: 'future_vision_v1'
            }
        ],
        choices: [
            {
                choiceId: 'vision_support',
                text: "You're not just preserving memory. You're creating a new language for it.",
                nextNodeId: 'lira_conclusion_full',
                pattern: 'building',
                skills: ['strategicThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'vision_honor',
                text: "Rose would be proud. This is her legacy continuing.",
                nextNodeId: 'lira_conclusion_full',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'future']
    },

    // ============= CONCLUSION =============
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

    // New node: Full conclusion - with vulnerability arc complete
    {
        nodeId: 'lira_conclusion_full',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She saves all the tracks. Labels the folder 'For Grandma Rose.'*\n\nI came here thinking I needed better prompts. Better techniques. You know what I actually needed?\n\nSomeone to help me be honest. About why this matters. About who I'm doing it for.\n\n*She smiles through remaining tears.*\n\nThe AI can generate sound. But it can't generate meaning. We do that. And now... now I know how to give it the meaning it needs.\n\nThank you. For helping me hear her again.",
                emotion: 'peaceful_grateful',
                variation_id: 'conclusion_full_v1'
            }
        ],
        patternReflection: [
            {
                pattern: 'patience',
                minLevel: 5,
                altText: "*She saves all the tracks. Labels the folder 'For Grandma Rose.'*\n\nYou listened. Really listened. Not rushing to fix, not filling silences. That's rare.\n\n*She smiles through remaining tears.*\n\nThe way you held space for the hard parts... that's what Grandma Rose did when she taught me. Some lessons need silence to land.\n\nThank you. For helping me hear her again.",
                altEmotion: 'deeply_grateful'
            },
            {
                pattern: 'helping',
                minLevel: 5,
                altText: "*She saves all the tracks. Labels the folder 'For Grandma Rose.'*\n\nYou cared. Not about the technology, about me. About her. You kept asking the right questions, the hard ones.\n\n*She smiles through remaining tears.*\n\nThat's what she did too. Grandma Rose always knew what question would unlock the next note.\n\nThank you. For helping me hear her again.",
                altEmotion: 'deeply_grateful'
            },
            {
                pattern: 'building',
                minLevel: 5,
                altText: "*She saves all the tracks. Labels the folder 'For Grandma Rose.'*\n\nYou didn't just listen. You built with me. That heartbeat suggestion? The texture prompts? You were in it.\n\n*She smiles through remaining tears.*\n\nGrandma Rose always said music was collaborative. Even solo piano. The composer, the pianist, the piano itself. Now... the AI. And you.\n\nThank you. For helping me hear her again.",
                altEmotion: 'deeply_grateful'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['lira_arc_complete'],
                addGlobalFlags: ['lira_arc_complete']
            }
        ],
        choices: [
            {
                choiceId: 'conclusion_return',
                text: "Her music lives on. In you. In this.",
                nextNodeId: 'lira_farewell',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'conclusion', 'emotional_resolution']
    },

    // New node: Farewell
    {
        nodeId: 'lira_farewell',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She puts the headphones back on, but keeps one ear free.*\n\nIf you ever need to capture something you can't quite name... come find me. I'll teach you to hear it.\n\n*She presses play. The melody of memory fills the studio.*\n\nGrandma Rose says hello. She's in the silence between the notes.",
                emotion: 'warm_peaceful',
                variation_id: 'farewell_v1'
            }
        ],
        choices: [
            {
                choiceId: 'farewell_return',
                text: "Return to Station",
                nextNodeId: 'samuel_orb_introduction',
                pattern: 'exploring'
            }
        ],
        tags: ['lira_arc', 'farewell', 'transition']
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
                nextNodeId: 'lira_process_intro',
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

    // ============= VULNERABILITY ARC (Trust >= 6) =============
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

Then she started forgetting. Not the music at first - just names, faces. But then... piece by piece...

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
    },

    // ============= INSIGHT NODES (Pattern-Revealing Moments) =============
    {
        nodeId: 'lira_insight_sound_memory',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She adjusts a dial, and a crackling vintage recording fills the space.*\n\nSound is memory's most faithful keeper. You can forget a face, lose the details of a room, but a song? A specific sound?\n\n*Her eyes close.*\n\nIt brings everything back. The smell of her kitchen. The weight of her hand on mine. All encoded in a melody.\n\nThat's why I do this. Not to create new sounds. To preserve the old ones. The ones that matter.",
                emotion: 'contemplative',
                variation_id: 'insight_sound_memory_v1',
                richEffectContext: 'thinking'
            }
        ],
        choices: [
            {
                choiceId: 'insight_sound_explore',
                text: "What sound holds your strongest memory?",
                nextNodeId: 'lira_reflection_first_piano',
                pattern: 'exploring',
                skills: ['curiosity', 'emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'insight_sound_analytical',
                text: "Is that why you layer imperfections into your compositions?",
                nextNodeId: 'lira_insight_imperfection',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'insight_sound_building',
                text: "We could build an archive. A library of sounds that matter.",
                nextNodeId: 'lira_challenge_archive',
                pattern: 'building',
                skills: ['strategicThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'insight', 'memory']
    },

    {
        nodeId: 'lira_insight_imperfection',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She pulls up two waveforms side by side.*\n\nLook at these. The first is a studio recording. Perfect. Clean. Dead.\n\nThe second? Grandma's old cassette. Hiss. Wobble. A cough in measure 32.\n\n*She points at the irregular peaks.*\n\nSee how the second one breathes? The imperfections aren't flaws. They're proof of presence. Someone was there when this happened.\n\nPerfect sound is a ghost. Imperfect sound is a witness.",
                emotion: 'passionate',
                variation_id: 'insight_imperfection_v1'
            }
        ],
        choices: [
            {
                choiceId: 'imperfection_apply',
                text: "So when you prompt AI for imperfection, you're asking it to witness.",
                nextNodeId: 'lira_insight_ai_witness',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'imperfection_help',
                text: "That's why your grandmother's recordings matter more than any studio version.",
                nextNodeId: 'lira_reflection_cassettes',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'insight', 'process']
    },

    {
        nodeId: 'lira_insight_ai_witness',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She leans back, struck by the framing.*\n\nAsking it to witness. Yes.\n\nThe AI has no presence. It wasn't there. But when I prompt it with specific human details - the cough, the hesitation, the way someone breathes before a difficult passage -\n\n*She gestures at the waveform.*\n\n- I'm lending it my presence. My memories become its training data. Just for this moment.\n\nThe machine becomes a vessel for what I've witnessed.",
                emotion: 'illuminated',
                variation_id: 'insight_ai_witness_v1',
                richEffectContext: 'success'
            }
        ],
        choices: [
            {
                choiceId: 'witness_continue',
                text: "You're not using AI to replace memory. You're using it to amplify it.",
                nextNodeId: 'lira_connection_partnership',
                pattern: 'building',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'witness_explore',
                text: "What's the most powerful memory you've translated into sound?",
                nextNodeId: 'lira_reflection_last_recital',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'insight', 'ai_philosophy']
    },

    {
        nodeId: 'lira_insight_silence_speaks',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She mutes all the tracks. The studio falls completely silent.*\n\n*After a long moment:*\n\nDid you hear that?\n\n*Small smile at your confusion.*\n\nThe silence wasn't empty. It was full of anticipation. Of waiting. The silence before a storm is different from the silence after. Before a performance versus after.\n\nI've spent years learning to compose silence. It's harder than composing sound.\n\nBecause silence has texture. Weight. Temperature. The AI struggles with this. It wants to fill emptiness. But emptiness is never empty.",
                emotion: 'teaching',
                variation_id: 'insight_silence_v1'
            }
        ],
        choices: [
            {
                choiceId: 'silence_patience',
                text: "[Sit in the silence with her. Let it speak.]",
                nextNodeId: 'lira_connection_shared_silence',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 3
                }
            },
            {
                choiceId: 'silence_analytical',
                text: "How do you prompt for a specific type of silence?",
                nextNodeId: 'lira_challenge_silence_prompt',
                pattern: 'analytical',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'silence_building',
                text: "What if the silence is the message? The space where meaning forms.",
                nextNodeId: 'lira_connection_partnership',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'insight', 'composition']
    },

    // ============= CHALLENGE NODES (Decision Points) =============
    {
        nodeId: 'lira_challenge_archive',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*Her eyes widen with possibility.*\n\nA memory archive. A library of sounds that matter.\n\n*She starts pacing.*\n\nBut here's the challenge: whose memories? Whose sounds? I have grandma's cassettes, but what about everyone else's grandmothers? Their first concerts? Their lullabies?\n\n*She stops.*\n\nIf I build this, it becomes a project for others. I'd have to teach people how to capture their own memories in sound. How to translate the intangible.\n\nIs that something I'm ready for? To share this process that's been so... personal?",
                emotion: 'uncertain_excited',
                variation_id: 'challenge_archive_v1'
            }
        ],
        choices: [
            {
                choiceId: 'archive_share',
                text: "Your grandmother taught you. Maybe you're meant to teach others.",
                nextNodeId: 'lira_reflection_teaching_legacy',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'archive_protect',
                text: "Some things are sacred. You don't have to share everything.",
                nextNodeId: 'lira_challenge_boundaries',
                pattern: 'patience',
                skills: ['wisdom'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'archive_build',
                text: "Start small. One family's archive. See how it feels.",
                nextNodeId: 'lira_challenge_first_client',
                pattern: 'building',
                skills: ['strategicThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'challenge', 'future']
    },

    {
        nodeId: 'lira_challenge_boundaries',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She exhales, relieved.*\n\nYou're right. Not everything needs to be a project. Not every skill needs to become a service.\n\nGrandma Rose didn't perform for everyone. She chose her audiences carefully. Her Sunday salon was invitation only.\n\n*Quiet smile.*\n\nMaybe I can do both. The public work - film scores, commercial projects. And the private work. The memory keeping. The sacred sounds.\n\nThe boundary protects the meaning.",
                emotion: 'resolved',
                variation_id: 'challenge_boundaries_v1'
            }
        ],
        choices: [
            {
                choiceId: 'boundaries_explore',
                text: "What would the sacred work look like? Just for you?",
                nextNodeId: 'lira_reflection_personal_archive',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'boundaries_continue',
                text: "You can always expand the circle later. Start with what feels right.",
                nextNodeId: 'lira_connection_trust',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'challenge', 'boundaries']
    },

    {
        nodeId: 'lira_challenge_first_client',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She considers, then nods slowly.*\n\nOne family. A test case.\n\n*She pulls up her contacts.*\n\nThere's a woman - Mrs. Chen. She lost her husband last year. He used to whistle while he cooked. This specific melody. She's been trying to describe it to me for months.\n\nIf I could help her capture that whistle... recreate the sound of him in the kitchen...\n\n*Her voice catches.*\n\nThat would be worth doing. Even if it's just once.",
                emotion: 'hopeful_nervous',
                variation_id: 'challenge_client_v1'
            }
        ],
        choices: [
            {
                choiceId: 'client_help',
                text: "Would you like help with the interview? I could take notes while you listen.",
                nextNodeId: 'lira_connection_collaboration',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'client_process',
                text: "What's your process for translating a description into a prompt?",
                nextNodeId: 'lira_challenge_translation',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'challenge', 'client']
    },

    {
        nodeId: 'lira_challenge_translation',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She opens a blank document.*\n\nFirst, I listen. Not for what they say, but how they say it. The pauses. The moments they look away.\n\nThen I ask strange questions. 'What color was the sound?' 'Was it a morning whistle or an evening whistle?' 'Did it speed up when he was happy?'\n\n*She types notes.*\n\nMost people describe sound with other sounds. 'It was like a bird.' But I need the context. The emotion. The memory attached to the sound.\n\nThat's what goes into the prompt. Not 'whistling' but 'a 67-year-old man's whistle, slightly off-key, the sound of contentment while chopping vegetables for soup.'",
                emotion: 'focused',
                variation_id: 'challenge_translation_v1'
            }
        ],
        choices: [
            {
                choiceId: 'translation_try',
                text: "Can I try? Describe a sound from my memory and you translate it?",
                nextNodeId: 'lira_challenge_your_memory',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'translation_depth',
                text: "The context is everything. You're not capturing sound - you're capturing meaning.",
                nextNodeId: 'lira_insight_sound_memory',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'challenge', 'process']
    },

    {
        nodeId: 'lira_challenge_your_memory',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She leans forward, genuinely curious.*\n\nAlright. Close your eyes.\n\nThink of a sound from your past. Something specific. Not music - that's too easy. A sound that belonged to a moment.\n\n*She waits.*\n\nNow... describe it to me. Not what it sounded like. What it felt like. Where you were. What it meant.",
                emotion: 'engaged_curious',
                variation_id: 'challenge_memory_v1'
            }
        ],
        choices: [
            {
                choiceId: 'memory_rain',
                text: "Rain on a tin roof. My grandfather's porch. The smell of wet earth and pipe tobacco.",
                nextNodeId: 'lira_challenge_prompt_demo',
                pattern: 'exploring',
                skills: ['communication'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'memory_voice',
                text: "My mother humming while she worked. Never a full song. Just fragments, always the same ones.",
                nextNodeId: 'lira_challenge_prompt_demo',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'memory_mechanical',
                text: "An old clock. Heavy ticking. The sound of time being measured out slowly.",
                nextNodeId: 'lira_challenge_prompt_demo',
                pattern: 'patience',
                skills: ['observation'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'challenge', 'interactive']
    },

    {
        nodeId: 'lira_challenge_prompt_demo',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She types rapidly, then shows you the screen.*\n\nSee how I translated that? You didn't give me a sound. You gave me a world.\n\n*The prompt reads: rich contextual detail based on player's choice.*\n\nThe AI won't just generate sound now. It'll generate atmosphere. Context. The feeling of being there.\n\n*She hovers over the generate button.*\n\nWant to hear what your memory sounds like through the machine?",
                emotion: 'excited',
                variation_id: 'challenge_demo_v1'
            }
        ],
        choices: [
            {
                choiceId: 'demo_yes',
                text: "Play it.",
                nextNodeId: 'lira_connection_shared_creation',
                pattern: 'building',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'demo_wait',
                text: "I'm nervous. What if it gets it wrong?",
                nextNodeId: 'lira_insight_imperfection',
                pattern: 'patience',
                skills: ['integrity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'challenge', 'demonstration']
    },

    {
        nodeId: 'lira_challenge_silence_prompt',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She pulls up her prompt library.*\n\nSilence is the hardest thing to prompt for. The AI wants to fill space. I have to trick it.\n\n*She shows examples:*\n\n'The held breath before a phone call you're afraid to answer.'\n'The pause between lightning and thunder.'\n'The moment after someone says something they can't take back.'\n\n*She looks at you.*\n\nEvery silence has a cause. A context. That's what you prompt. Not 'silence' but 'why it's silent.'",
                emotion: 'teaching',
                variation_id: 'challenge_silence_v1'
            }
        ],
        choices: [
            {
                choiceId: 'silence_try',
                text: "Let me try: 'The silence of a room that's expecting someone who won't come.'",
                nextNodeId: 'lira_connection_understanding',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'silence_reflect',
                text: "These aren't technical prompts. They're tiny stories.",
                nextNodeId: 'lira_insight_silence_speaks',
                pattern: 'analytical',
                skills: ['observation'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'challenge', 'technique']
    },

    // ============= REFLECTION NODES (Character Backstory) =============
    {
        nodeId: 'lira_reflection_first_piano',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*A distant look crosses her face.*\n\nThe first time I touched her piano. I was four. She lifted me onto the bench - I remember her hands smelling like vanilla and paper.\n\n*She mimics the motion.*\n\nShe pressed my finger onto one key. Middle C. And held it there while the note faded.\n\n'Listen,' she said. 'Listen to how it dies. That's the most important part. Not the beginning. The ending.'\n\n*Her voice softens.*\n\nI've been chasing that lesson ever since. How things end. How they fade. How to make the dying beautiful.",
                emotion: 'nostalgic',
                variation_id: 'reflection_piano_v1',
                richEffectContext: 'thinking'
            }
        ],
        choices: [
            {
                choiceId: 'piano_continue',
                text: "She was teaching you about sound. And about loss.",
                nextNodeId: 'lira_reflection_lessons',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'piano_analyze',
                text: "The decay of a note. That's technically the ADSR envelope. Attack, Decay, Sustain, Release.",
                nextNodeId: 'lira_reflection_technical_heart',
                pattern: 'analytical',
                skills: ['digitalLiteracy'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'grandmother']
    },

    {
        nodeId: 'lira_reflection_lessons',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She nods slowly.*\n\nShe was always doing that. Teaching me about life through music. About love. About time.\n\n*She touches her headphones absently.*\n\n'The pause between movements isn't silence,' she'd say. 'It's the piece breathing. Taking in what came before. Preparing for what comes next.'\n\n*A sad smile.*\n\nI didn't understand until she got sick. Until I watched her pause between thoughts. Between memories. The silences getting longer.\n\nNow I understand. The pause is where meaning lives.",
                emotion: 'bittersweet',
                variation_id: 'reflection_lessons_v1'
            }
        ],
        choices: [
            {
                choiceId: 'lessons_continue',
                text: "You carry her lessons with you. In every composition.",
                nextNodeId: 'lira_connection_legacy',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'lessons_share',
                text: "Would you share more of her teachings? I want to understand your process.",
                nextNodeId: 'lira_reflection_cassettes',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'wisdom']
    },

    {
        nodeId: 'lira_reflection_technical_heart',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She laughs, surprised.*\n\nADSR. Yes. Attack, Decay, Sustain, Release. The technical name for what she taught me with a single piano key.\n\n*She pulls up a synthesizer interface.*\n\nSee, this is what I love about sound design. The technical and the emotional are the same thing. When I adjust the release parameter, I'm adjusting how things end. How they let go.\n\n*She tweaks the setting.*\n\nLong release: lingering. Wistful. A memory that won't fade.\nShort release: abrupt. Cut off. Something taken too soon.\n\nTechnical mastery serves emotional expression. Grandma would have approved.",
                emotion: 'passionate',
                variation_id: 'reflection_technical_v1'
            }
        ],
        choices: [
            {
                choiceId: 'technical_apply',
                text: "Show me how you'd apply this to the memory loss score.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['digitalLiteracy'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'technical_deeper',
                text: "She gave you the philosophy. The industry gave you the vocabulary.",
                nextNodeId: 'lira_reflection_two_languages',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'technique']
    },

    {
        nodeId: 'lira_reflection_cassettes',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She opens a drawer and pulls out a shoebox filled with cassette tapes.*\n\nThese are her recordings. Every Sunday salon performance. 1978 to 2019. Forty-one years of music.\n\n*She handles one carefully.*\n\nThe sound quality is terrible. Hiss. Distortion. You can hear people coughing, glasses clinking, children giggling in the background.\n\n*Her voice breaks.*\n\nThey're my most precious possessions. Because they're not just music. They're proof. Proof that she existed. That she played. That people gathered to listen.\n\nPerfect recordings wouldn't have that. The imperfections are the point.",
                emotion: 'reverent',
                variation_id: 'reflection_cassettes_v1',
                richEffectContext: 'warning'
            }
        ],
        choices: [
            {
                choiceId: 'cassettes_digitize',
                text: "Have you digitized them? Preserved them for the future?",
                nextNodeId: 'lira_reflection_preservation_dilemma',
                pattern: 'analytical',
                skills: ['digitalLiteracy'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'cassettes_listen',
                text: "Would you play one for me?",
                nextNodeId: 'lira_reflection_last_recital',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 3
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'inheritance']
    },

    {
        nodeId: 'lira_reflection_last_recital',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She hesitates, then slots a cassette into an old player.*\n\n*Piano music fills the space - confident at first, then...*\n\n*A pause. A repeat. The melody searches for itself.*\n\nThis was her last recital. 2019. She didn't know it would be the last. None of us did.\n\n*The music hesitates again.*\n\nListen... right there. She forgot the next phrase. She covered it with a trill, moved on. But I can hear the moment she realized something was wrong.\n\n*Tears streaming.*\n\nShe kept playing. For another three minutes. Because stopping would mean admitting something she wasn't ready to face.\n\nThat's courage. That's what I'm trying to capture.",
                emotion: 'grieving_awed',
                variation_id: 'reflection_recital_v1',
                richEffectContext: 'warning'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['heard_grandma_rose_recording']
            }
        ],
        choices: [
            {
                choiceId: 'recital_silence',
                text: "[Let the music finish. Some moments are too sacred for words.]",
                nextNodeId: 'lira_connection_shared_grief',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 3
                }
            },
            {
                choiceId: 'recital_honor',
                text: "She's still playing. Through you. Through this work.",
                nextNodeId: 'lira_connection_legacy',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'emotional_peak']
    },

    {
        nodeId: 'lira_reflection_preservation_dilemma',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She sighs.*\n\nThat's the dilemma, isn't it? I could digitize them. Clean up the audio. Remove the hiss. Enhance the frequencies.\n\n*She holds up a tape.*\n\nBut then... is it still her? If I remove the crackle, do I remove the Sunday afternoon? If I clean the audio, do I clean away the cough from Uncle Marcus in the back row?\n\n*She sets the tape down carefully.*\n\nPreservation changes things. That's why I've never done it. I'm afraid of losing what the imperfections protect.",
                emotion: 'conflicted',
                variation_id: 'reflection_dilemma_v1'
            }
        ],
        choices: [
            {
                choiceId: 'dilemma_both',
                text: "Keep the originals. Digitize copies. You can have both.",
                nextNodeId: 'lira_reflection_two_languages',
                pattern: 'building',
                skills: ['problemSolving'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            },
            {
                choiceId: 'dilemma_accept',
                text: "Maybe they're not meant to last forever. Maybe that's the point.",
                nextNodeId: 'lira_insight_sound_memory',
                pattern: 'patience',
                skills: ['wisdom'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'philosophy']
    },

    {
        nodeId: 'lira_reflection_two_languages',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She laughs quietly.*\n\nTwo languages. Yes. That's exactly what I speak now.\n\nGrandma's language: 'Feel where the phrase wants to breathe.' 'Listen for the heartbeat under the melody.' 'Let the music tell you when it's ready to end.'\n\nThe technical language: 'Adjust attack to 50ms.' 'Side-chain the compression to the kick.' 'Reduce the high-mids to create space.'\n\n*She looks at her hands.*\n\nThe miracle is that they're the same language. Just different dialects. She was talking about ADSR envelopes before the term existed.\n\nMy job is translation. Between her world and this one.",
                emotion: 'revelatory',
                variation_id: 'reflection_languages_v1'
            }
        ],
        choices: [
            {
                choiceId: 'languages_continue',
                text: "And the AI is learning a third dialect. One you're teaching it.",
                nextNodeId: 'lira_insight_ai_witness',
                pattern: 'building',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'languages_teaching',
                text: "Will you teach others? This translation skill?",
                nextNodeId: 'lira_reflection_teaching_legacy',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'synthesis']
    },

    {
        nodeId: 'lira_reflection_teaching_legacy',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She considers for a long moment.*\n\nTeaching. The word used to scare me. Because teaching means... passing on. Letting go.\n\n*She traces the cassette labels with her finger.*\n\nGrandma Rosa taught me everything. But she couldn't teach me how to live without her. I had to learn that on my own.\n\n*She looks up.*\n\nMaybe teaching is how the grief transforms. Instead of holding onto what I learned, I give it away. And somehow... that makes it more mine. Not less.\n\nShe would have liked that paradox.",
                emotion: 'resolved_emotional',
                variation_id: 'reflection_teaching_v1'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['lira_considering_teaching']
            }
        ],
        choices: [
            {
                choiceId: 'teaching_start',
                text: "Start with me. I want to learn the translation.",
                nextNodeId: 'lira_connection_apprentice',
                pattern: 'building',
                skills: ['humility'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'teaching_support',
                text: "When you're ready. There's no rush.",
                nextNodeId: 'lira_connection_trust',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'future']
    },

    {
        nodeId: 'lira_reflection_personal_archive',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She pulls up a folder on her computer labeled 'PRIVATE - DO NOT SHARE'*\n\nThis. This is the sacred work.\n\n*She scrolls through files:*\n- 'Grandma_humming_while_cooking.wav'\n- 'Sound_of_her_kitchen_5am.wav'\n- 'The_creak_of_her_piano_bench.wav'\n- 'Her_laugh_Christmas_2018.wav'\n\n*Her voice is barely a whisper.*\n\nI've been collecting these since her diagnosis. Little sounds. Ambient recordings. Things I was afraid I'd forget.\n\nNow I use the AI to extend them. To imagine what they'd sound like in spaces that don't exist anymore.",
                emotion: 'private_vulnerable',
                variation_id: 'reflection_archive_v1',
                richEffectContext: 'warning'
            }
        ],
        choices: [
            {
                choiceId: 'archive_respect',
                text: "Thank you for showing me this. It's precious.",
                nextNodeId: 'lira_connection_trusted',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 3
                }
            },
            {
                choiceId: 'archive_imagine',
                text: "What space do you imagine for her sounds?",
                nextNodeId: 'lira_connection_shared_vision',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'reflection', 'private']
    },

    // ============= CONNECTION NODES (Relationship Building) =============
    {
        nodeId: 'lira_connection_partnership',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She regards you with new respect.*\n\nYou know what's rare? Someone who gets it. Not just the technical stuff - plenty of people understand that. But the why behind it.\n\n*She extends her hand.*\n\nI've been working alone too long. Talking to the AI like it can understand. Explaining my grandmother to a machine.\n\nBut you... you actually hear what I'm saying. What I'm trying to say.\n\nWould you want to work on something together? Not just observe. Collaborate.",
                emotion: 'hopeful',
                variation_id: 'connection_partnership_v1'
            }
        ],
        choices: [
            {
                choiceId: 'partnership_yes',
                text: "I'd be honored. What did you have in mind?",
                nextNodeId: 'lira_connection_collaboration',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'partnership_careful',
                text: "I'm still learning. But I'll do my best.",
                nextNodeId: 'lira_connection_apprentice',
                pattern: 'patience',
                skills: ['humility'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'turning_point']
    },

    {
        nodeId: 'lira_connection_collaboration',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*Her face lights up.*\n\nI have this idea. A piece called 'Memory Architecture.' It's about how we build spaces in our minds to hold the people we've lost.\n\n*She sketches in the air.*\n\nImagine: sounds that create rooms. A kitchen from humming. A porch from rain. A concert hall from applause.\n\nThe AI generates the raw material. But you'd help me shape it. Help me choose which memories to build with.\n\n*Excited now.*\n\nIt's not just composition. It's... construction. Building homes for ghosts.",
                emotion: 'creative_fire',
                variation_id: 'connection_collaboration_v1'
            }
        ],
        choices: [
            {
                choiceId: 'collaboration_start',
                text: "Let's build something together. Where do we start?",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'collaboration_understand',
                text: "Building homes for ghosts. That's beautiful and devastating.",
                nextNodeId: 'lira_connection_understanding',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'project']
    },

    {
        nodeId: 'lira_connection_shared_silence',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*The silence stretches. One minute. Two.*\n\n*Finally, she opens her eyes.*\n\nYou felt it, didn't you? The silence changed. At first it was awkward. Then waiting. Then... comfortable.\n\n*She smiles softly.*\n\nMost people break after twenty seconds. They laugh, or ask a question, or make noise just to fill the space.\n\nYou let the silence speak.\n\n*Quiet appreciation.*\n\nThat's rare. That's something I can't teach. You either hear silence or you don't.\n\nYou hear it.",
                emotion: 'warm_surprised',
                variation_id: 'connection_silence_v1'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['shared_significant_silence']
            }
        ],
        choices: [
            {
                choiceId: 'silence_learned',
                text: "Someone taught me that listening is more than waiting to speak.",
                nextNodeId: 'lira_connection_kindred',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'silence_natural',
                text: "The silence was comfortable. I didn't want to break it.",
                nextNodeId: 'lira_connection_trust',
                pattern: 'helping',
                skills: ['integrity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'breakthrough']
    },

    {
        nodeId: 'lira_connection_understanding',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She stops, struck.*\n\nBeautiful and devastating. Yes. That's exactly what it is.\n\n*She sits down heavily.*\n\nMost people hear 'AI music generation' and think about efficiency. Productivity. How fast can you make a soundtrack.\n\nYou hear 'building homes for ghosts' and understand immediately.\n\n*She meets your eyes.*\n\nI don't know your story. What you've lost. But you know loss. You hear it in what I'm trying to do.\n\nThat means something.",
                emotion: 'connected_vulnerable',
                variation_id: 'connection_understanding_v1'
            }
        ],
        choices: [
            {
                choiceId: 'understanding_share',
                text: "I've lost things too. People. Places. The music helps me understand why it matters.",
                nextNodeId: 'lira_connection_kindred',
                pattern: 'helping',
                skills: ['integrity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 3
                }
            },
            {
                choiceId: 'understanding_support',
                text: "I don't need to understand everything. I just need to hear what you're trying to say.",
                nextNodeId: 'lira_connection_trust',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'emotional']
    },

    {
        nodeId: 'lira_connection_kindred',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She reaches out, touches your hand briefly.*\n\nKindred. That's the word. Not the same story, but the same... frequency.\n\n*She laughs softly.*\n\nListen to me. 'Same frequency.' Even my metaphors are audio engineering.\n\n*Warmer now.*\n\nBut it's true. Some people resonate with each other. Their wavelengths align. It doesn't happen often, but when it does...\n\n*She gestures at the studio.*\n\n...you can make something together that neither could make alone.\n\nI'm glad you found this platform. Glad you found me.",
                emotion: 'connected_grateful',
                variation_id: 'connection_kindred_v1',
                richEffectContext: 'success'
            }
        ],
        choices: [
            {
                choiceId: 'kindred_continue',
                text: "The feeling is mutual. Let's create something that resonates.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['communication'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'relationship_peak']
    },

    {
        nodeId: 'lira_connection_trust',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She nods slowly.*\n\nThank you. For not rushing. For not trying to fix things.\n\n*She adjusts her headphones.*\n\nI've talked to a lot of people about AI and music. Most want to debate ethics, or discuss technology, or argue about authenticity.\n\nYou just... listened. Let the conversation go where it needed to go.\n\n*Small smile.*\n\nThat's trust. Not something you demand. Something that grows in the spaces you leave for it.\n\nYou left good spaces.",
                emotion: 'trusting',
                variation_id: 'connection_trust_v1'
            }
        ],
        choices: [
            {
                choiceId: 'trust_work',
                text: "I'd like to hear more. About your grandmother. About your work.",
                nextNodeId: 'lira_reflection_cassettes',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'trust_create',
                text: "Ready to create something? I'll follow your lead.",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'building',
                skills: ['collaboration'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'trust']
    },

    {
        nodeId: 'lira_connection_legacy',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She touches the cassette player reverently.*\n\nPlaying through me. Yes.\n\nI used to hate that idea. That I was just a vessel. A conduit. That my music was really her music, recycled.\n\n*She looks at you.*\n\nBut now I understand. Legacy isn't copying. It's continuing. Taking what was given and adding to it.\n\nShe gave me silence and space and the dying of notes. I'm giving that to the AI. And through the AI, maybe to people I'll never meet.\n\n*Tears, but smiling.*\n\nShe's not gone. She's... distributed. Across everyone she taught. Everything she played.\n\nIncluding me. Including this.",
                emotion: 'transcendent',
                variation_id: 'connection_legacy_v1',
                richEffectContext: 'success'
            }
        ],
        choices: [
            {
                choiceId: 'legacy_continue',
                text: "That's the most beautiful definition of legacy I've ever heard.",
                nextNodeId: 'lira_conclusion_full',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'philosophy']
    },

    {
        nodeId: 'lira_connection_apprentice',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She smiles warmly.*\n\nLearning. Yes. That's exactly where you should be.\n\nGrandma Rosa used to say: 'The student who knows they don't know is more ready than the expert who thinks they do.'\n\n*She pulls up a blank project.*\n\nLet me teach you the basics. Not the technical stuff - you can learn that anywhere. The feeling stuff. How to listen for what's not being said.\n\nConsider this your first lesson in sonic archaeology.",
                emotion: 'mentoring',
                variation_id: 'connection_apprentice_v1'
            }
        ],
        choices: [
            {
                choiceId: 'apprentice_ready',
                text: "I'm ready. Where do we start?",
                nextNodeId: 'lira_challenge_your_memory',
                pattern: 'exploring',
                skills: ['humility'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'apprentice_observe',
                text: "Can I watch you work first? Learn by observation?",
                nextNodeId: 'lira_simulation_setup',
                pattern: 'patience',
                skills: ['observation'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 1
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'teaching']
    },

    {
        nodeId: 'lira_connection_shared_creation',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She hits play. Sound fills the studio.*\n\n[Your memory, translated into audio, plays back. It's not exact - how could it be? - but it captures something true.]\n\n*She watches your face.*\n\nThere. You hear it? The AI didn't recreate your memory. It created a new one. A shared one. Something that exists only because you described and I translated and the machine interpreted.\n\n*She saves the file.*\n\nThis is ours now. Not mine. Not the AI's. Ours.\n\n*Labels it: 'First_collaboration.wav'*\n\nEvery journey needs a beginning.",
                emotion: 'triumphant_tender',
                variation_id: 'connection_creation_v1',
                richEffectContext: 'success'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['created_first_collaboration']
            }
        ],
        choices: [
            {
                choiceId: 'creation_continue',
                text: "It's not what I expected. It's better.",
                nextNodeId: 'lira_deeper_work',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'milestone']
    },

    {
        nodeId: 'lira_connection_shared_grief',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*The music ends. The tape clicks off. Silence.*\n\n*She doesn't speak for a long moment. Neither do you.*\n\n*Finally:*\n\nThank you.\n\n*Voice barely a whisper.*\n\nFor letting her play. For not interrupting. For... grieving with me, just for a moment.\n\n*She ejects the tape carefully, replaces it in the shoebox.*\n\nI've played that recording alone hundreds of times. This is the first time someone else has heard it.\n\nThe first time it wasn't just me and a ghost.\n\nNow it's... witnessed.",
                emotion: 'raw_grateful',
                variation_id: 'connection_grief_v1',
                richEffectContext: 'warning'
            }
        ],
        onEnter: [
            {
                characterId: 'lira',
                addKnowledgeFlags: ['witnessed_grandma_tape'],
                trustChange: 2
            }
        ],
        choices: [
            {
                choiceId: 'grief_honor',
                text: "Some music is too important to hear alone.",
                nextNodeId: 'lira_conclusion_full',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'emotional_peak']
    },

    {
        nodeId: 'lira_connection_trusted',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*She closes the folder, but doesn't minimize it.*\n\nNo one has seen that folder before. Not even the film director.\n\nThis work... the public work, the film scores, the professional compositions... that's what I do.\n\n*She gestures at the folder.*\n\nThis is who I am. The private archive. The grief translated into gigabytes.\n\nI showed you because... because you earned it. By listening. By understanding without needing explanations.\n\n*Quiet determination.*\n\nTrust isn't given. It's built. Note by note. Like a composition.\n\nYou've built something with me today.",
                emotion: 'solemn_grateful',
                variation_id: 'connection_trusted_v1'
            }
        ],
        choices: [
            {
                choiceId: 'trusted_continue',
                text: "I'll hold it carefully. This trust.",
                nextNodeId: 'lira_conclusion_full',
                pattern: 'patience',
                skills: ['integrity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'trust_peak']
    },

    {
        nodeId: 'lira_connection_shared_vision',
        speaker: 'Lira Vance',
        content: [
            {
                text: "*Her eyes go distant.*\n\nI imagine... her kitchen. But infinite. The way it felt when I was small. The counters stretching forever. The ceiling impossibly high.\n\nAnd in that space, her sounds playing. Not like a recording. Like a living thing. The sizzle of butter. The clink of her coffee cup. The way she'd hum while measuring flour.\n\n*She opens an audio project.*\n\nI'm building it. Layer by layer. Using AI to extend the fragments into a full environment.\n\nSomeday... someday you'll be able to put on headphones and stand in that kitchen. With her. Even though she's gone.\n\nThat's what I'm working toward.\n\n*Quiet intensity.*\n\nA place to visit the dead.",
                emotion: 'visionary',
                variation_id: 'connection_vision_v1'
            }
        ],
        choices: [
            {
                choiceId: 'vision_beautiful',
                text: "That's not just music. That's a gift. A place for everyone who's lost someone.",
                nextNodeId: 'lira_conclusion_full',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            },
            {
                choiceId: 'vision_help',
                text: "Can I help build it?",
                nextNodeId: 'lira_connection_collaboration',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'lira',
                    trustChange: 2
                }
            }
        ],
        tags: ['lira_arc', 'connection', 'vision']
    }
]

export const liraEntryPoints = {
    INTRODUCTION: 'lira_introduction'
} as const

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
