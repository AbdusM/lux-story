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
                variation_id: 'sim_setup_v1'
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
