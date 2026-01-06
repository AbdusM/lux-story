import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const ashaDialogueNodes: DialogueNode[] = [
    // ============= INTRODUCTION =============
    {
        nodeId: 'asha_introduction',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You see a woman standing before a large, blank mural wall in the Arts District. She's holding a tablet, not a brush.\n\nShe swipes, and the wall seems to shimmer with projected light. Possibilities flickering—dragons, abstract geometry, photorealistic cities.\n\n\"The vision is clear,\" she murmurs. \"But the render... the render is still noisy.\"",
                emotion: 'focused',
                variation_id: 'intro_v1'
            }
        ],
        choices: [
            {
                choiceId: 'intro_curious',
                text: "What are you creating?",
                nextNodeId: 'asha_explains_vision',
                pattern: 'exploring',
                skills: ['creativity', 'communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'intro_technical',
                text: "Is that a projection mapping setup or AR?",
                nextNodeId: 'asha_explains_tech',
                pattern: 'building',
                skills: ['digitalLiteracy'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['introduction', 'asha_arc']
    },

    {
        nodeId: 'asha_explains_vision',
        speaker: 'Asha Patel',
        content: [
            {
                text: "It's a mural for the community center. Or... it will be.\n\nI used to spend weeks painting one concept. Now? I can generate a hundred concepts in an hour. But picking the *right* one? That's harder than ever.\n\nMy client wants 'Future City.' The AI gives me 'Chrome Utopia.' It's not the same thing.",
                emotion: 'pensive',
                variation_id: 'vision_v1'
            }
        ],
        choices: [
            {
                choiceId: 'offer_help_prompt',
                text: "Maybe I can help you refine the prompt?",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'helping',
                skills: ['promptEngineering', 'creativity']
            },
            {
                choiceId: 'analyze_gap',
                text: "What's missing from the generated images?",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'analytical',
                skills: ['criticalThinking']
            }
        ]
    },

    {
        nodeId: 'asha_explains_tech',
        speaker: 'Asha Patel',
        content: [
            {
                text: "It's both. The tablet drives the projection. The AI drives the tablet.\n\nWe're drowning in tools, you know? Everyone can make images now. But valid artistic direction? That's still scarce.\n\nTake a look. Tell me what you see.",
                emotion: 'welcoming',
                variation_id: 'tech_v1'
            }
        ],
        choices: [
            {
                choiceId: 'ready_to_look',
                text: "Let me see.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'exploring',
                skills: ['observation']
            }
        ]
    },

    // ============= SIMULATION: VISUAL CANVAS (Stable Diffusion) =============
    {
        nodeId: 'asha_simulation_setup',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Here's the prompt: 'Future Birmingham, sustainable, diverse, hopeful.'\n\nAnd here's what the model gave me. Cold. Sterile. Too much glass, not enough people.\n\nI need you to fix the *soul* of the image, not just the pixels.",
                emotion: 'challenging',
                variation_id: 'sim_setup_v1',
                interrupt: {
                    duration: 3500,
                    type: 'encouragement',
                    action: 'Point to the blank wall behind the projection',
                    targetNodeId: 'asha_interrupt_encouragement',
                    consequence: {
                        characterId: 'asha',
                        trustChange: 2
                    }
                }
            }
        ],
        simulation: {
            type: 'visual_canvas',
            title: 'Mural Concept Generation',
            taskDescription: 'The AI generated a generic "Sci-Fi City". Refine the creative direction to reflect the real "Soul of Birmingham" (History + Nature + Future).',
            initialContext: {
                label: 'Canvas: Draft_004 [v6.0]',
                content: '[IMAGE PLACEHOLDER: A generic futuristic city with flying cars and chrome towers. No greenery, no people.]',
                displayStyle: 'image_placeholder'
            },
            successFeedback: '✓ VISION ALIGNED: The new render shows Vulcan overlooking a green, vibrant city with diverse crowds and solar-glass architecture.'
        },
        choices: [
            {
                choiceId: 'sim_refine_nature',
                text: "Inject 'Biophilic Design'. Add 'Overgrown Iron City' aesthetic. Use warm sunlight.",
                nextNodeId: 'asha_simulation_success',
                pattern: 'building',
                skills: ['creativity', 'sustainability'],
                consequence: {
                    characterId: 'asha',
                    addGlobalFlags: ['golden_prompt_midjourney']
                }
            },
            {
                choiceId: 'sim_refine_history',
                text: "Ground it in history. 'Civil Rights District merged with Solarpunk'.",
                nextNodeId: 'asha_simulation_success',
                pattern: 'analytical',
                skills: ['culturalCompetence', 'creativity'],
                consequence: {
                    characterId: 'asha',
                    addGlobalFlags: ['golden_prompt_midjourney']
                }
            },
            {
                choiceId: 'sim_randomize',
                text: "Just hit 'Re-roll'. Hopefully it gets better.",
                nextNodeId: 'asha_simulation_fail',
                pattern: 'exploring'
            }
        ],
        tags: ['simulation', 'asha_arc']
    },

    {
        nodeId: 'asha_simulation_success',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Yes! That's it. See the difference?\n\nThe first one was 'content.' This... this is *art*.\n\nYou understood that the future needs roots. The AI didn't know that until you told it.\n\nThat's the job now. We aren't just drawing lines anymore. We're guiding dreams.",
                emotion: 'inspired',
                variation_id: 'sim_success_v1'
            }
        ],
        choices: [
            {
                choiceId: 'success_humble',
                text: "I just described what I wanted to see.",
                nextNodeId: 'asha_conclusion',
                pattern: 'helping',
                skills: ['humility']
            },
            {
                choiceId: 'success_pride',
                text: "It's about knowing the story behind the image.",
                nextNodeId: 'asha_conclusion',
                pattern: 'building',
                skills: ['communication']
            }
        ]
    },

    {
        nodeId: 'asha_simulation_fail',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Same chrome towers. Different angle.\n\nRandomness isn't creativity. You have to *direct* it. You have to tell the machine what matters.\n\nTry again later. The vision isn't there yet.",
                emotion: 'disappointed',
                variation_id: 'sim_fail_v1'
            }
        ],
        choices: [
            {
                choiceId: 'fail_leave',
                text: "I'll try to think more clearly next time.",
                nextNodeId: 'asha_conclusion',
                pattern: 'patience',
                skills: ['resilience']
            }
        ]
    },

    {
        nodeId: 'asha_conclusion',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Thanks for stopping by. Check back when the mural is finished. I think it's going to be something special.",
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
        nodeId: 'asha_interrupt_encouragement',
        speaker: 'Asha Patel',
        content: [
            {
                text: `*She follows your gesture to the blank wall. Something shifts in her expression.*

*Quiet laugh.*

You're right. I keep staring at the screen. But the wall... the wall is what matters.

*Touches the concrete.*

My grandmother painted murals in Ahmedabad. No projectors. No AI. Just her hands and her vision.

She used to say: "The wall knows what it wants. You just have to listen."

*Looks at you.*

I forgot to listen. I was so busy fighting the algorithm, I forgot to ask the wall.`,
                emotion: 'grateful_grounded',
                variation_id: 'interrupt_encouragement_v1'
            }
        ],
        choices: [
            {
                choiceId: 'asha_from_interrupt',
                text: "The AI is a tool. The vision is yours.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'interrupt_response']
    },

    // ============= VULNERABILITY ARC (Trust ≥ 6) =============
    // "The mural that was painted over" - when the crowd rejected her vision
    {
        nodeId: 'asha_vulnerability_arc',
        speaker: 'Asha Patel',
        content: [
            {
                text: `*She stops projecting. The wall goes dark.*

I haven't told anyone this.

*Pause.*

Two years ago, I got my first major commission. City hall. "Celebrate Birmingham's Future."

I painted for six weeks. No AI. Every brushstroke mine. A vision of the city where everyone belonged.

*Voice drops.*

They painted over it in three days. "Too political." "Not what we envisioned." Someone on the council said it looked "too diverse."

*Bitter laugh.*

They replaced it with a generic skyline. Chrome towers. No people.

That's when I started using AI. Because at least when the algorithm fails, it's not... it's not ME they're rejecting.`,
                emotion: 'bitter_vulnerable',
                variation_id: 'vulnerability_v1',
                richEffectContext: 'warning'
            }
        ],
        requiredState: {
            trust: { min: 6 }
        },
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['asha_vulnerability_revealed', 'knows_about_painted_over']
            }
        ],
        choices: [
            {
                choiceId: 'asha_vuln_they_were_wrong',
                text: "They were wrong. Not you. Your vision was right.",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'asha_vuln_hiding',
                text: "You're using the AI to hide. So they can't hurt you again.",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'analytical',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'asha_vuln_silence',
                text: "[Let the grief breathe. Three days to erase six weeks.]",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'emotional_core']
    },

    {
        nodeId: 'asha_vulnerability_response',
        speaker: 'Asha Patel',
        content: [
            {
                text: `*She wipes her eyes.*

Yeah. I guess I am hiding.

*Looks at the blank wall.*

But here's the thing. This mural? For the community center? They asked for ME. Not an algorithm. Not a "safe" design.

They said: "We want Asha Patel's vision. The real one."

*Small smile.*

Maybe it's time to stop hiding behind the machine. Use it as a collaborator, not a shield.

*Touches the tablet, then sets it down.*

My grandmother never had AI. But she had something better. She had courage.

Maybe it's time I found mine again.`,
                emotion: 'resolved_hopeful',
                interaction: 'bloom',
                variation_id: 'vulnerability_response_v1'
            }
        ],
        choices: [
            {
                choiceId: 'asha_vuln_to_sim',
                text: "Then let's make something they can't paint over.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'building',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'resolution']
    }
]

export const ashaDialogueGraph: DialogueGraph = {
    version: '1.0.0',
    nodes: new Map(ashaDialogueNodes.map(node => [node.nodeId, node])),
    startNodeId: 'asha_introduction',
    metadata: {
        title: "Asha's Vision Studio",
        author: 'Guided Generation',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: ashaDialogueNodes.length,
        totalChoices: ashaDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
    }
}
