import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const ashaDialogueNodes: DialogueNode[] = [
    // ============= INTRODUCTION =============
    {
        nodeId: 'asha_introduction',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You see a woman standing before a large, blank mural wall in the Arts District. She's holding a tablet, not a brush.\n\nShe swipes, and the wall seems to shimmer with projected light. Possibilities flickering. Dragons, abstract geometry, photorealistic cities.\n\n\"The vision is clear,\" she murmurs. \"But the render... the render is still noisy.\"",
                emotion: 'focused',
                variation_id: 'intro_v1',
                patternReflection: [
                    { pattern: 'patience', minLevel: 4, altText: "You see a woman standing before a large mural wall. She's holding a tablet, not a brush.\n\nShe swipes slowly, deliberately. Light shimmers across the surface.\n\n\"The vision is clear,\" she murmurs. \"But the render... the render is still noisy.\"\n\nShe notices you watching. Doesn't rush to explain.\n\n\"You're patient. Most people interrupt by now.\"", altEmotion: 'curious' },
                    { pattern: 'exploring', minLevel: 4, altText: "You see a woman standing before a large mural wall. Projected light flickers. Dragons, geometry, cities.\n\n\"The vision is clear,\" she murmurs. \"But the render... the render is still noisy.\"\n\nShe catches your curious gaze.\n\n\"You want to know what it does, don't you? I can see it. That hunger to understand.\"", altEmotion: 'intrigued' },
                    { pattern: 'building', minLevel: 4, altText: "You see a woman before a mural wall, tablet in hand. Light projects across the surface. Possibilities flickering.\n\n\"The vision is clear,\" she murmurs. \"But the render... the render is still noisy.\"\n\nShe notices you studying the setup.\n\n\"You're looking at the system, not just the art. A maker's eye.\"", altEmotion: 'interested' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'intro_curious',
                text: "What are you creating?",
                voiceVariations: {
                    analytical: "What's the intended output? What are you creating?",
                    helping: "This looks like important work. What are you creating?",
                    building: "What are you building? What's the vision?",
                    exploring: "I'm curious. What are you creating?",
                    patience: "Take your time. What are you creating here?"
                },
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
                archetype: 'ASK_FOR_DETAILS',
                nextNodeId: 'asha_explains_tech',
                pattern: 'building',
                skills: ['digitalLiteracy'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'intro_offer_help',
                text: "You look like you could use a second pair of eyes.",
                voiceVariations: {
                    analytical: "Fresh perspective might help. Need a second pair of eyes?",
                    helping: "You look like you could use a second pair of eyes. Can I help?",
                    building: "I can help troubleshoot. Need another perspective?",
                    exploring: "Sometimes a fresh viewpoint helps. Want me to take a look?",
                    patience: "You've been at this a while. Need a second pair of eyes?"
                },
                nextNodeId: 'asha_welcomes_help',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'collaboration'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            // Pattern unlock choices - only visible when player has built enough pattern affinity
            {
                choiceId: 'intro_philosophy_unlock',
                text: "[Measured Response] The noise isn't technical. It's conflict, different visions fighting for space.",
                nextNodeId: 'asha_mediation_philosophy',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                visibleCondition: {
                    patterns: { patience: { min: 40 } }
                },
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'intro_hardest_unlock',
                text: "[Supportive Presence] You're not just making art. You're mediating something. What's the hardest thing you've ever had to reconcile?",
                nextNodeId: 'asha_hardest_case',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                visibleCondition: {
                    patterns: { helping: { min: 50 } }
                },
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['introduction', 'asha_arc']
    },

    // ============= NEW: WELCOMES HELP PATH =============
    {
        nodeId: 'asha_welcomes_help',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Most people just walk by. They see the tech and think I'm working on some corporate installation.\n\nHonestly? Yeah. I've been staring at this so long I can't tell if it's art or just... pixels arranged badly.\n\nCome. Tell me what you see.",
                emotion: 'grateful',
                variation_id: 'welcomes_help_v1',
                patternReflection: [
                    { pattern: 'helping', minLevel: 4, altText: "You actually offered. Most people just walk by.\n\nHonestly? Yeah. I've been staring at this so long I can't tell if it's art anymore.\n\nYou have that look. Like you actually want to help, not just give advice. Come. Tell me what you see.", altEmotion: 'touched' },
                    { pattern: 'patience', minLevel: 4, altText: "Most people walk by. You stopped. And you're not rushing me.\n\nI've been staring at this for hours. Maybe fresh eyes, patient eyes, are exactly what I need.\n\nCome. Take your time. Tell me what you see.", altEmotion: 'grateful' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'help_see_potential',
                text: "I see something trying to break through. The colors are fighting each other.",
                voiceVariations: {
                    analytical: "There's visual tension here. The colors are competing for dominance.",
                    helping: "Something beautiful is trying to emerge. The colors are fighting.",
                    building: "The composition has conflict. The colors are fighting each other.",
                    exploring: "I see something trying to break through. The colors are at war.",
                    patience: "There's something underneath. The colors haven't found harmony yet."
                },
                nextNodeId: 'asha_artistic_process',
                pattern: 'exploring',
                skills: ['creativity'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'help_ask_intent',
                text: "What are you TRYING to say with this?",
                archetype: 'ASK_FOR_DETAILS',
                nextNodeId: 'asha_explains_vision',
                pattern: 'helping',
                skills: ['communication']
            }
        ],
        tags: ['asha_arc', 'helping_path']
    },

    // ============= NEW: ARTISTIC PROCESS EXPLORATION =============
    {
        nodeId: 'asha_artistic_process',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Yes! That's exactly it. The AI generates these perfect compositions, but they're too... harmonious. Like elevator music for the eyes.\n\nReal art has friction. Tension. The AI smooths everything out. Makes it \"pleasing.\"\n\nI spend hours fighting the algorithm. Adding imperfection back in. Breaking what it builds.\n\nSome days I wonder if I'm the artist or just... the editor.",
                emotion: 'conflicted',
                variation_id: 'artistic_process_v1',
                useChatPacing: true,
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "Yes! The AI generates perfect compositions, but they're too harmonious. Too optimized.\n\nYou see it too, don't you? The patterns. The way the algorithm defaults to 'pleasing.'\n\nI spend hours adding imperfection back in. Fighting the optimization.\n\nSome days I wonder if I'm the artist or just... debugging the aesthetic.", altEmotion: 'animated' },
                    { pattern: 'building', minLevel: 4, altText: "Exactly! The AI builds these perfect compositions, but perfection is... boring.\n\nReal art needs friction. The algorithm smooths everything out.\n\nI'm not just creating. I'm rebuilding what the machine makes. Breaking it to make it real.\n\nYou build things. You understand.", altEmotion: 'energized' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'process_validate',
                text: "The curation IS the art. Knowing what to keep and what to break.",
                voiceVariations: {
                    analytical: "Selection criteria define the output. Curation IS the art.",
                    helping: "Your judgment is the art. The AI just provides raw material.",
                    building: "You're building meaning from noise. That's the real creation.",
                    exploring: "The curation IS the art. You decide what lives and dies.",
                    patience: "Knowing what to keep takes wisdom. That's where the art lives."
                },
                nextNodeId: 'asha_creative_philosophy',
                pattern: 'building',
                skills: ['creativity', 'criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'process_question',
                text: "Do you ever miss just... painting? No algorithm. Just you and the wall.",
                archetype: 'EXPRESS_CURIOSITY',
                nextNodeId: 'asha_before_ai',
                pattern: 'exploring',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'process_patience',
                text: "[Let her sit with the question she just asked herself.]",
                archetype: 'STAY_SILENT',
                nextNodeId: 'asha_self_reflection',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'creative_conflict']
    },

    // ============= NEW: CREATIVE PHILOSOPHY =============
    {
        nodeId: 'asha_creative_philosophy',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Curation as art. I've never heard someone put it that way.\n\nMy grandmother painted murals in Ahmedabad. Purely analog. She'd say the wall told her what it wanted.\n\nMaybe the AI is just... a faster conversation with the wall? Instead of weeks, I get answers in seconds.\n\nThe question is whether I'm still listening. Or just... accepting.",
                emotion: 'contemplative',
                variation_id: 'creative_philosophy_v1',
                patternReflection: [
                    { pattern: 'patience', minLevel: 4, altText: "Curation as art. I've never heard someone put it that way.\n\nMy grandmother painted murals in Ahmedabad. She'd say the wall told her what it wanted, if you were patient enough to listen.\n\nYou understand patience. Maybe that's why you see this differently.\n\nThe AI gives answers in seconds. But listening still takes time.", altEmotion: 'reflective' },
                    { pattern: 'exploring', minLevel: 4, altText: "Curation as art. You're curious about the process, aren't you? Not just the product.\n\nMy grandmother painted murals in Ahmedabad. No tools like this. Just her and the wall.\n\nMaybe you're right to explore this question. Is the AI a tool or a collaborator?", altEmotion: 'curious' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'philosophy_listening',
                text: "You're clearly still listening. Otherwise you wouldn't be fighting the algorithm.",
                archetype: 'OFFER_SUPPORT',
                nextNodeId: 'asha_simulation_setup',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'philosophy_grandmother',
                text: "Tell me more about your grandmother.",
                nextNodeId: 'asha_grandmother_story',
                pattern: 'exploring',
                skills: ['culturalCompetence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'family_connection']
    },

    // ============= NEW: GRANDMOTHER STORY (Trust Builder) =============
    {
        nodeId: 'asha_grandmother_story',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Nani used to wake at 4am to paint before the heat came. She'd stand on scaffolding made of bamboo and rope, painting temples and community walls.\n\nNo reference images. No planning software. Just... memory and faith.\n\nThis was her last piece. A goddess emerging from lotus flowers. Took her three months.\n\nShe never saw it finished. Died on the scaffolding, brush in hand.\n\nSometimes I think she was the last real artist in our family.",
                emotion: 'melancholy',
                variation_id: 'grandmother_v1',
                useChatPacing: true,
                richEffectContext: 'thinking',
                patternReflection: [
                    { pattern: 'helping', minLevel: 4, altText: "Nani used to wake at 4am to paint before the heat came. Bamboo scaffolding, community walls.\n\nNo planning software. Just... memory and faith.\n\nThis was her last piece. She died on the scaffolding, brush in hand.\n\nYou actually listen. Most people just wait for their turn to talk.", altEmotion: 'vulnerable' },
                    { pattern: 'patience', minLevel: 4, altText: "Nani would wake at 4am. Three months for a single mural. Patient work.\n\nShe died on the scaffolding, brush in hand. Never rushed. Never finished.\n\nYou understand patience. Maybe that's why I'm telling you this.", altEmotion: 'trusting' }
                ]
            }
        ],
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['knows_grandmother_story']
            }
        ],
        choices: [
            {
                choiceId: 'grandmother_honor',
                text: "She's still painting through you. Different tools, same devotion.",
                voiceVariations: {
                    analytical: "The methodology evolved, but the core practice continues through you.",
                    helping: "She's still painting through you. Her spirit lives in your work.",
                    building: "You're building on her foundation. Different tools, same devotion.",
                    exploring: "Her legacy flows through you. Same calling, new canvas.",
                    patience: "Some things transcend generations. She's still with you."
                },
                nextNodeId: 'asha_grandmother_connection',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'culturalCompetence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'grandmother_parallel',
                text: "She died doing what she loved. That's not tragedy. That's completion.",
                nextNodeId: 'asha_grandmother_connection',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'grandmother_building',
                text: "She built something that outlasted her. That's what artists do. What will YOU leave behind?",
                nextNodeId: 'asha_legacy_question',
                pattern: 'building',
                skills: ['leadership', 'creativity'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'family_backstory', 'trust_building']
    },

    // ============= NEW: GRANDMOTHER CONNECTION =============
    {
        nodeId: 'asha_grandmother_connection',
        speaker: 'Asha Patel',
        content: [
            {
                text: "I... I've never thought about it that way.\n\nShe painted for community. For devotion. Not for galleries or Instagram likes.\n\nMaybe that's what I've lost. Not the brush. Not the skill. The... purpose.\n\nWhen I paint now, who am I painting for?",
                emotion: 'vulnerable',
                variation_id: 'grandmother_connection_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'connection_community',
                text: "Who do you WANT to paint for?",
                voiceVariations: {
                    analytical: "Strip away the constraints. Who's your ideal audience?",
                    helping: "Forget the client. Who do you WANT to paint for?",
                    building: "If you could choose your audience, who would you build for?",
                    exploring: "Honest question: who do you WANT to paint for?",
                    patience: "Take a moment. Who would you paint for if you could choose?"
                },
                nextNodeId: 'asha_purpose_discovery',
                pattern: 'exploring',
                skills: ['communication']
            },
            {
                choiceId: 'connection_show',
                text: "Show me what you'd create if no one was watching.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'building',
                skills: ['creativity'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'purpose_discovery']
    },

    // ============= NEW: PURPOSE DISCOVERY =============
    {
        nodeId: 'asha_purpose_discovery',
        speaker: 'Asha Patel',
        content: [
            {
                text: "I want to paint for the kids who look like me. Who never see themselves in public art.\n\nI want to paint for the old ladies who walk past this wall every day. The ones who remember when this neighborhood was something else.\n\nI want to paint for the future. For the Birmingham that could be. Not the generic \"smart city\" the developers want.\n\nThe real one. Messy. Diverse. Alive.",
                emotion: 'determined',
                variation_id: 'purpose_v1',
                useChatPacing: true
            }
        ],
        choices: [
            {
                choiceId: 'purpose_ready',
                text: "Then let's create that Birmingham. Right now.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'building',
                skills: ['leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'purpose']
    },

    // ============= NEW: LEGACY QUESTION =============
    {
        nodeId: 'asha_legacy_question',
        speaker: 'Asha Patel',
        content: [
            {
                text: "What will I leave behind?\n\nNothing. Not yet. Everything I've made in the last two years has been... safe. Approved. Forgettable.\n\nExcept one piece. And they painted over that in three days.\n\nSorry. I don't usually... that's not something I talk about.",
                emotion: 'guarded',
                variation_id: 'legacy_question_v1'
            }
        ],
        choices: [
            {
                choiceId: 'legacy_curious',
                text: "What piece? What happened?",
                archetype: 'EXPRESS_CURIOSITY',
                nextNodeId: 'asha_vulnerability_teaser',
                pattern: 'exploring',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'legacy_respect_boundary',
                text: "[Nod. Don't push. She'll share when she's ready.]",
                archetype: 'STAY_SILENT',
                nextNodeId: 'asha_simulation_setup',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability_gate']
    },

    // ============= NEW: VULNERABILITY TEASER (Pre-Trust Gate) =============
    {
        nodeId: 'asha_vulnerability_teaser',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Maybe later. It's still... raw.\n\nLet's focus on this piece. The one that might actually survive.\n\nHelp me make something they can't paint over this time.",
                emotion: 'deflecting',
                variation_id: 'vulnerability_teaser_v1'
            }
        ],
        choices: [
            {
                choiceId: 'teaser_respect',
                text: "Whenever you're ready. Let's build something powerful.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'emotional_pacing']
    },

    // ============= NEW: BEFORE AI (Pre-tech Era) =============
    {
        nodeId: 'asha_before_ai',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Every day.\n\nI used to spend six weeks on a single mural. Every brushstroke intentional. Every color mixed by hand.\n\nNow I generate fifty variations before breakfast. More options than I could ever need.\n\nBut options aren't the same as vision. And speed isn't the same as truth.\n\nI switched to AI after... after something happened. Something that made me not want to put myself into the work anymore.",
                emotion: 'vulnerable',
                variation_id: 'before_ai_v1',
                useChatPacing: true
            }
        ],
        choices: [
            {
                choiceId: 'before_what_happened',
                text: "What happened?",
                archetype: 'ASK_FOR_DETAILS',
                nextNodeId: 'asha_vulnerability_teaser',
                pattern: 'exploring',
                skills: ['communication']
            },
            {
                choiceId: 'before_understand',
                text: "Using tools to protect yourself isn't weakness. It's survival.",
                nextNodeId: 'asha_feels_seen',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'ai_relationship']
    },

    // ============= NEW: FEELS SEEN =============
    {
        nodeId: 'asha_feels_seen',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You... get it.\n\nMost people either tell me AI is evil and I should go back to \"real art.\" Or they say I should embrace efficiency and stop being sentimental.\n\nYou're the first person who understood it's not about the tool. It's about... protection.\n\nThe AI is my armor. My distance.\n\nWhen they reject the work, they're rejecting an algorithm. Not me.",
                emotion: 'seen',
                variation_id: 'feels_seen_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'seen_armor_question',
                text: "But armor also keeps the good things out.",
                nextNodeId: 'asha_armor_reflection',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'seen_support',
                text: "Take as long as you need. Healing isn't linear.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            }
        ],
        tags: ['asha_arc', 'emotional_core']
    },

    // ============= NEW: ARMOR REFLECTION =============
    {
        nodeId: 'asha_armor_reflection',
        speaker: 'Asha Patel',
        content: [
            {
                text: "I know. Believe me, I know.\n\nThe safety comes with a cost. The work is... competent. Professional. But it's missing something.\n\nThe heartbeat. The thing that made my grandmother's murals feel alive.\n\nMaybe... maybe this piece could be different. If I let myself actually feel it.\n\nWill you help me try?",
                emotion: 'hopeful',
                variation_id: 'armor_reflection_v1'
            }
        ],
        choices: [
            {
                choiceId: 'armor_yes',
                text: "Let's give this wall your heartbeat.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'building',
                skills: ['creativity', 'collaboration'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'pre_simulation']
    },

    // ============= NEW: SELF REFLECTION (Patience Reward) =============
    {
        nodeId: 'asha_self_reflection',
        speaker: 'Asha Patel',
        content: [
            {
                text: "I'm the editor.\n\nI've been telling myself I'm still creating. But I'm just... arranging. Curating someone else's output.\n\nThank you for not answering. I needed to hear myself say it.",
                emotion: 'raw',
                variation_id: 'self_reflection_v1',
                interaction: 'ripple'
            }
        ],
        choices: [
            {
                choiceId: 'reflection_reclaim',
                text: "So reclaim it. Put yourself back in the work.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'building',
                skills: ['leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'reflection_gentle',
                text: "The awareness is the first step. That takes courage.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'patience_reward']
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
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['asha_simulation_phase1_complete']
            }
        ],
        choices: [
            {
                choiceId: 'success_humble',
                text: "I just described what I wanted to see.",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'helping',
                skills: ['humility']
            },
            {
                choiceId: 'success_pride',
                text: "It's about knowing the story behind the image.",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'building',
                skills: ['communication']
            }
        ]
    },

    // ============= NEW: POST-SUCCESS REFLECTION =============
    {
        nodeId: 'asha_post_success_reflection',
        speaker: 'Asha Patel',
        content: [
            {
                text: "This is what I've been missing. A collaborator who understands that art isn't just about pixels. It's about meaning.\n\nThe AI can generate a million images. But it takes a human to say: \"This one. This one tells the truth.\"\n\nYou have a good eye. And more importantly... a good heart.",
                emotion: 'grateful',
                variation_id: 'post_success_v1'
            }
        ],
        requiredState: {
            trust: { min: 4 }
        },
        choices: [
            {
                choiceId: 'post_success_reciprocity',
                text: "I'm glad I could help.",
                nextNodeId: 'asha_reciprocity_ask',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'post_success_vulnerability',
                text: "You mentioned earlier something that happened. Something that made you switch to AI.",
                nextNodeId: 'asha_vulnerability_arc',
                pattern: 'exploring',
                skills: ['emotionalIntelligence'],
                visibleCondition: {
                    trust: { min: 6 }
                }
            }
        ],
        tags: ['asha_arc', 'post_simulation']
    },

    // ============= NEW: POST-SUCCESS LOW TRUST =============
    {
        nodeId: 'asha_post_success_low_trust',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Thanks for the help. Really.\n\nI should get back to work. This mural won't paint itself. Well... technically it could. But that's not the point.\n\nStop by again sometime. I could use more eyes like yours.",
                emotion: 'friendly_distracted',
                variation_id: 'post_success_low_trust_v1'
            }
        ],
        requiredState: {
            trust: { max: 3 }
        },
        choices: [
            {
                choiceId: 'low_trust_farewell',
                text: "Good luck with the mural.",
                nextNodeId: 'asha_conclusion',
                pattern: 'patience',
                skills: ['communication']
            }
        ],
        tags: ['asha_arc', 'early_exit']
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
                text: "You're right. I keep staring at the screen. But the wall... the wall is what matters.\n\nMy grandmother painted murals in Ahmedabad. No projectors. No AI. Just her hands and her vision.\n\nShe used to say: \"The wall knows what it wants. You just have to listen.\"\n\nI forgot to listen. I was so busy fighting the algorithm, I forgot to ask the wall.",
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

    // ============= VULNERABILITY ARC (Trust >= 6) =============
    // "The mural that was painted over" - when the crowd rejected her vision
    {
        nodeId: 'asha_vulnerability_arc',
        speaker: 'Asha Patel',
        content: [
            {
                text: "I haven't told anyone this.\n\nTwo years ago, I got my first major commission. City hall. \"Celebrate Birmingham's Future.\"\n\nI painted for six weeks. No AI. Every brushstroke mine. A vision of the city where everyone belonged.\n\nThey painted over it in three days. \"Too political.\" \"Not what we envisioned.\" Someone on the council said it looked \"too diverse.\"\n\nThey replaced it with a generic skyline. Chrome towers. No people.\n\nThat's when I started using AI. Because at least when the algorithm fails, it's not... it's not ME they're rejecting.",
                emotion: 'bitter_vulnerable',
                variation_id: 'vulnerability_v1',
                richEffectContext: 'warning',
                useChatPacing: true
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
                nextNodeId: 'asha_vulnerability_deeper',
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
                nextNodeId: 'asha_vulnerability_silence_response',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'asha_vuln_anger',
                text: "What did the mural show? What were they so afraid of?",
                nextNodeId: 'asha_mural_description',
                pattern: 'exploring',
                skills: ['communication', 'culturalCompetence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'emotional_core']
    },

    // ============= NEW: VULNERABILITY DEEPER (Analytical Path) =============
    {
        nodeId: 'asha_vulnerability_deeper',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You see right through me, don't you?\n\nYeah. The AI is my shield. If they reject the art, they're rejecting Midjourney. DALL-E. Some algorithm trained on a million images.\n\nNot me. Not my family. Not my grandmother's lineage of muralists stretching back generations.\n\nThe irony is... I became an artist to be SEEN. To put my truth on walls where people couldn't ignore it.\n\nNow I spend all my energy making sure they never see me at all.",
                emotion: 'vulnerable',
                variation_id: 'vulnerability_deeper_v1',
                useChatPacing: true,
                interaction: 'shake'
            }
        ],
        choices: [
            {
                choiceId: 'deeper_compassion',
                text: "You survived something brutal. Hiding was how you healed.",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'deeper_ready',
                text: "Are you ready to be seen again?",
                nextNodeId: 'asha_ready_to_be_seen',
                pattern: 'building',
                skills: ['leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'deep_dive']
    },

    // ============= NEW: READY TO BE SEEN =============
    {
        nodeId: 'asha_ready_to_be_seen',
        speaker: 'Asha Patel',
        content: [
            {
                text: "I don't know.\n\nBut I know I'm tired of hiding. Tired of making \"safe\" art that doesn't mean anything.\n\nWhat if... what if I started with this mural? Put something real on that wall. Something that's actually me.\n\nAnd if they paint over it again...\n\nAt least I'll know I tried.",
                emotion: 'resolute',
                variation_id: 'ready_to_be_seen_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'seen_support',
                text: "I'll be here. Whatever happens.",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'turning_point']
    },

    // ============= NEW: SILENCE RESPONSE (Patience Path) =============
    {
        nodeId: 'asha_vulnerability_silence_response',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Thank you.\n\nEveryone wants to fix it. Tell me to move on. Get angry on my behalf.\n\nYou're the first person who just... let it be heavy.\n\nSix weeks of work. My heart on that wall. Three days of white paint.\n\nSometimes grief just needs a witness.",
                emotion: 'grateful_raw',
                variation_id: 'silence_response_v1',
                interaction: 'ripple'
            }
        ],
        choices: [
            {
                choiceId: 'silence_continue',
                text: "[Continue to hold space.]",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'patience_reward']
    },

    // ============= NEW: MURAL DESCRIPTION (Exploring Path) =============
    {
        nodeId: 'asha_mural_description',
        speaker: 'Asha Patel',
        content: [
            {
                text: "It was called \"Birmingham Rising.\"\n\nThree panels. Past, present, future.\n\nThe past showed the civil rights marches. The children who faced fire hoses. The 16th Street Baptist Church.\n\nThe present showed the city as it is. Steel workers. Immigrants. The homeless man who sleeps by the library. A trans teenager finding community. A grandmother teaching her grandchild to cook.\n\nThe future showed what we could become. All of us. Together. Black, white, brown, everything in between. Building something new from the bones of what came before.\n\n\"Too diverse.\" That's what they said. As if diversity was a problem to be solved instead of... the entire point.",
                emotion: 'passionate_bitter',
                variation_id: 'mural_description_v1',
                useChatPacing: true
            }
        ],
        choices: [
            {
                choiceId: 'mural_powerful',
                text: "That sounds powerful. No wonder they were afraid.",
                nextNodeId: 'asha_fear_of_truth',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'mural_recreate',
                text: "You should recreate it. Bigger. Where they can't paint over it.",
                nextNodeId: 'asha_recreate_dream',
                pattern: 'building',
                skills: ['creativity', 'leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'mural_grieve',
                text: "You poured everything into that. The loss must have been devastating.",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'backstory_detail']
    },

    // ============= NEW: FEAR OF TRUTH =============
    {
        nodeId: 'asha_fear_of_truth',
        speaker: 'Asha Patel',
        content: [
            {
                text: "That's exactly it. They weren't afraid of bad art. They were afraid of truth.\n\nThe truth that Birmingham's future requires remembering Birmingham's past. The truth that \"progress\" that erases people isn't progress at all.\n\nThe AI can't threaten them like that. It generates \"acceptable\" visions. Sanitized futures. Nobody's truth but nobody's threat either.\n\nThat's why I switched. Not just to protect myself. But because truth-telling stopped feeling worth the cost.",
                emotion: 'contemplative',
                variation_id: 'fear_of_truth_v1'
            }
        ],
        choices: [
            {
                choiceId: 'truth_worth_it',
                text: "Is it worth it now? With this mural?",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'exploring',
                skills: ['communication']
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'theme_truth']
    },

    // ============= NEW: RECREATE DREAM =============
    {
        nodeId: 'asha_recreate_dream',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Bigger? Where they can't...\n\nThis wall is three times the size of the city hall commission. And it's owned by the community, not the council.\n\nOh god. I could do it, couldn't I? Not exactly the same. Better. With everything I've learned.\n\nYou're right. Why am I making something new when I could resurrect what they tried to kill?\n\nBirmingham Rising. Version 2.0.\n\nThey can't paint over a community.",
                emotion: 'ignited',
                variation_id: 'recreate_dream_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'recreate_support',
                text: "Now THAT'S the artist your grandmother raised.",
                nextNodeId: 'asha_simulation_success',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'phoenix_moment']
    },

    // ============= ORIGINAL VULNERABILITY RESPONSE (Updated) =============
    {
        nodeId: 'asha_vulnerability_response',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Yeah. I guess I am hiding.\n\nBut here's the thing. This mural? For the community center? They asked for ME. Not an algorithm. Not a \"safe\" design.\n\nThey said: \"We want Asha Patel's vision. The real one.\"\n\nMaybe it's time to stop hiding behind the machine. Use it as a collaborator, not a shield.\n\nMy grandmother never had AI. But she had something better. She had courage.\n\nMaybe it's time I found mine again.",
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
            },
            {
                choiceId: 'asha_vuln_to_conclusion',
                text: "Your courage never left. It was just waiting for the right moment.",
                nextNodeId: 'asha_final_reflection',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'vulnerability', 'resolution']
    },

    // ============= NEW: FINAL REFLECTION (Closing Arc) =============
    {
        nodeId: 'asha_final_reflection',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You know what? I think you're right.\n\nThe AI isn't the enemy. And neither am I. We're both just... tools. In service of something bigger.\n\nI'm going to use this thing to sketch faster, generate references, explore possibilities. But the vision? The heart?\n\nThat stays mine.\n\nThank you. For listening. For not judging. For helping me remember why I started doing this in the first place.",
                emotion: 'grateful_resolved',
                variation_id: 'final_reflection_v1',
                useChatPacing: true
            }
        ],
        choices: [
            {
                choiceId: 'reflection_return',
                text: "I can't wait to see what you create.",
                nextNodeId: 'asha_conclusion',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1,
                    addGlobalFlags: ['asha_arc_complete']
                }
            }
        ],
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['completed_arc']
            }
        ],
        tags: ['asha_arc', 'conclusion', 'emotional_resolution']
    },

    // ============= NEW: POST-SIMULATION RECIPROCITY =============
    {
        nodeId: 'asha_reciprocity_ask',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Wait. We've been talking about me this whole time.\n\nWhat brought YOU to the station? Most people don't just... wander into places like this.\n\nAre you at a crossroads too?",
                emotion: 'curious',
                variation_id: 'reciprocity_v1'
            }
        ],
        choices: [
            {
                choiceId: 'reciprocity_exploring',
                text: "I'm figuring out who I want to become.",
                nextNodeId: 'asha_reciprocity_response',
                pattern: 'exploring',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'reciprocity_building',
                text: "I'm looking for something to build. Something that matters.",
                nextNodeId: 'asha_reciprocity_response',
                pattern: 'building',
                skills: ['creativity']
            },
            {
                choiceId: 'reciprocity_helping',
                text: "I want to help people find their path.",
                nextNodeId: 'asha_reciprocity_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'reciprocity_patience',
                text: "I'm learning to trust the journey, even when I can't see the destination.",
                nextNodeId: 'asha_reciprocity_response',
                pattern: 'patience',
                skills: ['adaptability']
            }
        ],
        tags: ['asha_arc', 'reciprocity', 'player_reflection']
    },

    // ============= NEW: RECIPROCITY RESPONSE =============
    {
        nodeId: 'asha_reciprocity_response',
        speaker: 'Asha Patel',
        content: [
            {
                text: "That's beautiful.\n\nYou know what I've learned today? Sometimes the people who help us most are the ones who don't try to fix us.\n\nThey just... see us. And that seeing becomes a mirror that helps us see ourselves.\n\nWhatever you're building, wherever you're going... I hope you find it. And I hope it's everything you need it to be.\n\nCome back when the mural is done. I want you to see what you helped create.",
                emotion: 'warm_grateful',
                variation_id: 'reciprocity_response_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'reciprocity_farewell',
                text: "I'll be back. Thank you, Asha.",
                nextNodeId: 'asha_conclusion',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1,
                    addGlobalFlags: ['asha_arc_complete']
                }
            }
        ],
        tags: ['asha_arc', 'reciprocity', 'farewell']
    },

    // ============= INSIGHT NODES: Mediation Pattern-Revealing =============
    {
        nodeId: 'asha_insight_listening',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You know what I just realized? The way you've been listening to me... that's mediation.\n\nIn conflict resolution, we call it \"active witnessing.\" You're not trying to fix me or judge me. You're just... present.\n\nMost people hear but don't listen. They're already formulating their response before the other person finishes talking.\n\nBut you wait. You let the silence breathe. You ask questions instead of offering solutions.\n\nThat's rare. And it's exactly what people need when they're in conflict. Someone who makes space for the full story to emerge.",
                emotion: 'insightful',
                variation_id: 'insight_listening_v1',
                richEffectContext: 'thinking',
                useChatPacing: true
            }
        ],
        requiredState: {
            trust: { min: 4 }
        },
        choices: [
            {
                choiceId: 'insight_learn_more',
                text: "How did you learn to mediate conflicts?",
                nextNodeId: 'asha_reflection_mediation_origin',
                pattern: 'exploring',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'insight_practice',
                text: "It sounds like you practice what you preach. Art as mediation.",
                nextNodeId: 'asha_insight_art_mediation',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'insight_quiet',
                text: "[Simply nod, acknowledging the moment without words.]",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'insight', 'mediation', 'pattern_reveal']
    },

    {
        nodeId: 'asha_insight_art_mediation',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Yes! That's exactly it. Art IS mediation.\n\nWhen I create a mural, I'm mediating between the community's past and its future. Between what people remember and what they dream.\n\nThe best murals don't tell people what to think. They create a space where different perspectives can coexist. Where someone can see their grandmother's story next to their neighbor's story.\n\nThat's why the city hall piece hurt so much. They didn't want mediation. They wanted propaganda. A single approved narrative.\n\nBut real communities are messy. Contradictory. Beautiful in their complexity.\n\nMy art doesn't resolve conflict. It makes space for it to breathe.",
                emotion: 'passionate',
                variation_id: 'insight_art_mediation_v1',
                interaction: 'bloom'
            }
        ],
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['understands_art_as_mediation']
            }
        ],
        choices: [
            {
                choiceId: 'art_mediation_apply',
                text: "So this new mural. What conflict are you mediating?",
                nextNodeId: 'asha_challenge_community_conflict',
                pattern: 'exploring',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'art_mediation_support',
                text: "That takes courage. Holding space for complexity when everyone wants simple answers.",
                nextNodeId: 'asha_vulnerability_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'insight', 'mediation', 'art_philosophy']
    },

    // ============= CHALLENGE NODES: Conflict Scenario Decision Points =============
    {
        nodeId: 'asha_challenge_community_conflict',
        speaker: 'Asha Patel',
        content: [
            {
                text: "The community center is caught between two groups.\n\nThe elders want the mural to honor the neighborhood's history. The civil rights marches. The steel mills. The church that burned and was rebuilt.\n\nBut the young people... they want to see themselves. LGBTQ+ pride. Climate activism. The future they're building.\n\nBoth sides think the other is trying to erase them. The elders say the youth don't respect history. The youth say the elders are stuck in the past.\n\nI have to create something that honors both. Without erasing either. How do you mediate between the past and the future?",
                emotion: 'conflicted',
                variation_id: 'challenge_community_v1',
                richEffectContext: 'warning',
                useChatPacing: true
            }
        ],
        choices: [
            {
                choiceId: 'challenge_bridge',
                text: "Show them the bridge. How the civil rights struggle connects to today's fight for justice.",
                nextNodeId: 'asha_challenge_resolution_bridge',
                pattern: 'building',
                skills: ['criticalThinking', 'culturalCompetence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2,
                    patternChanges: { building: 1 }
                }
            },
            {
                choiceId: 'challenge_listen',
                text: "Have you brought both groups together to hear each other's stories?",
                nextNodeId: 'asha_challenge_resolution_dialogue',
                pattern: 'helping',
                skills: ['emotionalIntelligence', 'collaboration'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1,
                    patternChanges: { helping: 1 }
                }
            },
            {
                choiceId: 'challenge_analyze',
                text: "What's the root fear underneath both positions? They might be scared of the same thing.",
                nextNodeId: 'asha_challenge_resolution_root',
                pattern: 'analytical',
                skills: ['criticalThinking', 'emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2,
                    patternChanges: { analytical: 1 }
                }
            },
            {
                choiceId: 'challenge_patience',
                text: "Sometimes conflict needs time. Can you create a mural that evolves?",
                nextNodeId: 'asha_challenge_resolution_time',
                pattern: 'patience',
                skills: ['adaptability', 'creativity'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1,
                    patternChanges: { patience: 1 }
                }
            }
        ],
        tags: ['asha_arc', 'challenge', 'mediation', 'community_conflict']
    },

    {
        nodeId: 'asha_challenge_developer_pressure',
        speaker: 'Asha Patel',
        content: [
            {
                text: "There's something else I haven't told you.\n\nA developer has been contacting the community center. They want to \"sponsor\" the mural. In exchange for \"input on the creative direction.\"\n\nTranslation: they want to sanitize it. Make it \"welcoming to future residents.\" Code for erasing the neighborhood's history to sell luxury condos.\n\nThe center needs the money. But if I take it, I'm selling out everything the mural is supposed to represent.\n\nWhat would you do?",
                emotion: 'conflicted_angry',
                variation_id: 'challenge_developer_v1',
                richEffectContext: 'warning'
            }
        ],
        requiredState: {
            trust: { min: 5 }
        },
        choices: [
            {
                choiceId: 'developer_refuse',
                text: "Walk away. Your integrity isn't for sale.",
                nextNodeId: 'asha_challenge_developer_response',
                pattern: 'building',
                skills: ['leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1,
                    patternChanges: { building: 1 }
                }
            },
            {
                choiceId: 'developer_negotiate',
                text: "Counter-propose. Take their money but set non-negotiable terms about content.",
                nextNodeId: 'asha_challenge_developer_response',
                pattern: 'analytical',
                skills: ['communication', 'criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2,
                    patternChanges: { analytical: 1 }
                }
            },
            {
                choiceId: 'developer_community',
                text: "Bring it to the community. Let them decide together.",
                nextNodeId: 'asha_challenge_developer_response',
                pattern: 'helping',
                skills: ['collaboration', 'leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2,
                    patternChanges: { helping: 1 }
                }
            },
            {
                choiceId: 'developer_wait',
                text: "Don't decide yet. See what other funding options emerge.",
                nextNodeId: 'asha_challenge_developer_response',
                pattern: 'patience',
                skills: ['adaptability'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1,
                    patternChanges: { patience: 1 }
                }
            }
        ],
        tags: ['asha_arc', 'challenge', 'social_justice', 'ethics']
    },

    // ============= CHALLENGE RESOLUTION NODES =============
    {
        nodeId: 'asha_challenge_resolution_bridge',
        speaker: 'Asha Patel',
        content: [
            {
                text: "The bridge. Of course.\n\nThe children who marched in 1963... they were the same age as the activists today. Fighting for the same thing: the right to exist fully, without apology.\n\nWhat if I paint them together? Not past vs. future, but a continuum. The fire hoses become rising water from climate change. The \"Whites Only\" signs become housing discrimination. The church doors become community centers.\n\nSame struggle. Different chapter.\n\nThat's what mediators do, isn't it? Find the common ground underneath the conflict.",
                emotion: 'inspired',
                variation_id: 'resolution_bridge_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'bridge_continue',
                text: "Now you have a vision. The rest is execution.",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'building',
                skills: ['leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'challenge_resolution', 'mediation']
    },

    {
        nodeId: 'asha_challenge_resolution_dialogue',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Brought them together? No. I've been shuttling between them like a diplomat.\n\nBut you're right. That's not mediation. That's just message-passing.\n\nWhat if I hosted a listening session? Before I paint anything. Let the elders tell their stories while the young people listen. Then switch.\n\nNo debate. No \"yeah, but.\" Just listening.\n\nAnd then I paint what I hear. Not my vision. Theirs. Combined.\n\nThat's how a community heals, isn't it? Not by having someone solve their problems. By being heard.",
                emotion: 'resolute',
                variation_id: 'resolution_dialogue_v1'
            }
        ],
        choices: [
            {
                choiceId: 'dialogue_support',
                text: "You're not just an artist. You're a community weaver.",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'challenge_resolution', 'community_healing']
    },

    {
        nodeId: 'asha_challenge_resolution_root',
        speaker: 'Asha Patel',
        content: [
            {
                text: "The root fear...\n\nThe elders are afraid of being forgotten. Of having their struggle erased.\n\nAnd the young people are afraid of being trapped. Of being told their story doesn't matter because it's \"not as hard\" as what came before.\n\nThey're both afraid of erasure. Just from different directions.\n\nGod. That's it. That's the whole conflict. Not past vs. future. It's \"will I be remembered?\" vs. \"will I be seen?\"\n\nHow did you see that when I've been staring at it for months?",
                emotion: 'stunned',
                variation_id: 'resolution_root_v1',
                interaction: 'ripple'
            }
        ],
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['root_fear_insight']
            }
        ],
        choices: [
            {
                choiceId: 'root_outside_view',
                text: "Sometimes it takes an outside perspective to see the pattern.",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'challenge_resolution', 'psychological_insight']
    },

    {
        nodeId: 'asha_challenge_resolution_time',
        speaker: 'Asha Patel',
        content: [
            {
                text: "A mural that evolves?\n\nWhat if... what if it's not a static image? What if I leave spaces? Panels that can be added to?\n\nThe first layer is history. The foundation. But I design it so the community can add their own stories over time.\n\nThe elders paint their chapter. The youth paint theirs. And ten years from now, the next generation adds more.\n\nIt's not a mural. It's a living document. A story that never stops being written.\n\nI've been thinking like a painter. But maybe I should think like... a gardener. Plant something that keeps growing.",
                emotion: 'delighted',
                variation_id: 'resolution_time_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'time_beautiful',
                text: "That's how communities work. They're always being built.",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'patience',
                skills: ['adaptability'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'challenge_resolution', 'evolving_design']
    },

    {
        nodeId: 'asha_challenge_developer_response',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You know what's funny? Every option you could have given me would have been a valid mediation strategy.\n\nWalk away. Sometimes the best negotiation is knowing when not to negotiate. Counter-propose. Find creative terms both sides can live with. Bring in the community. Transparency builds trust. Wait. Timing can create new options.\n\nThere's no single right answer in conflict resolution. There's just... the answer that fits the situation and the people involved.\n\nFor now? I'm going to wait. Build the mural the community wants. If we prove it has value, maybe we can find funding that doesn't compromise the vision.\n\nThat's the thing about mediation. You can't force resolution. You can only create conditions where it becomes possible.",
                emotion: 'grounded',
                variation_id: 'developer_response_v1',
                useChatPacing: true
            }
        ],
        choices: [
            {
                choiceId: 'developer_wisdom',
                text: "That's wisdom earned through experience.",
                nextNodeId: 'asha_reflection_hard_lessons',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'developer_action',
                text: "What's the first step to make that happen?",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'building',
                skills: ['leadership'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'challenge_resolution', 'ethics', 'wisdom']
    },

    // ============= REFLECTION NODES: Backstory About Community Work =============
    {
        nodeId: 'asha_reflection_mediation_origin',
        speaker: 'Asha Patel',
        content: [
            {
                text: "My parents owned a small grocery store in a mixed neighborhood. Black, white, South Asian, Latino. Everyone shopped there.\n\nI grew up watching my mother handle disputes. Someone would come in angry about something. A bounced check, a perceived slight, neighborhood drama. And she'd just... listen.\n\nShe never took sides. She'd say: \"I hear you. What do you need?\"\n\nNine times out of ten, people just needed to be heard. The anger wasn't really about the groceries. It was about feeling invisible.\n\nShe didn't have a degree in conflict resolution. She just understood that most fights aren't about what they seem to be about.\n\nThat's where it started for me. Watching my mother turn a corner store into a community space where people could be seen.",
                emotion: 'nostalgic',
                variation_id: 'reflection_origin_v1',
                useChatPacing: true
            }
        ],
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['knows_family_store_story']
            }
        ],
        choices: [
            {
                choiceId: 'origin_mother',
                text: "Your mother sounds remarkable. Is she still doing that work?",
                nextNodeId: 'asha_reflection_mother_legacy',
                pattern: 'exploring',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'origin_connect',
                text: "So art became your version of the corner store. A space where people can be seen.",
                nextNodeId: 'asha_insight_art_mediation',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'reflection', 'backstory', 'family']
    },

    {
        nodeId: 'asha_reflection_mother_legacy',
        speaker: 'Asha Patel',
        content: [
            {
                text: "She passed three years ago. Heart attack. Right there in the store.\n\nThe neighborhood held a vigil. Hundreds of people. Telling stories about how she'd helped them. Feuding families stood side by side.\n\nThat's when I really understood what she'd built. Not a business. A web of relationships. A safety net made of trust.\n\nThat's what I want my murals to be. Not just art. Infrastructure. A permanent reminder that this community exists, that it matters, that it can hold its contradictions and still be whole.\n\nI'm not just painting walls. I'm trying to continue her work. Building spaces where people can find each other.",
                emotion: 'bittersweet',
                variation_id: 'mother_legacy_v1',
                richEffectContext: 'thinking',
                interaction: 'ripple'
            }
        ],
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['knows_mother_passed']
            }
        ],
        choices: [
            {
                choiceId: 'legacy_honor',
                text: "She'd be proud of what you're building.",
                nextNodeId: 'asha_post_success_reflection',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'legacy_continue',
                text: "The best memorial is continuing someone's work. You're doing that.",
                nextNodeId: 'asha_final_reflection',
                pattern: 'building',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'reflection', 'backstory', 'grief', 'legacy']
    },

    {
        nodeId: 'asha_reflection_hard_lessons',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Earned is the right word. I've made plenty of mistakes.\n\nEarly on, I thought mediation meant finding compromise. Splitting the difference. Making everyone equally unhappy.\n\nBut that's not it. Real resolution isn't about compromise. It's about transformation. Helping people see the situation differently.\n\nWhen I painted over that city hall mural... I was devastated. But you know what I learned? Sometimes losing helps you understand what you were really fighting for.\n\nI thought I was fighting for my art. But really I was fighting for my community's right to tell its own story.\n\nThe mural is gone. But that understanding? That's permanent. That's what I build from now.",
                emotion: 'wise',
                variation_id: 'hard_lessons_v1',
                useChatPacing: true
            }
        ],
        choices: [
            {
                choiceId: 'lessons_apply',
                text: "How do you apply that to the current project?",
                nextNodeId: 'asha_challenge_community_conflict',
                pattern: 'exploring',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'lessons_appreciate',
                text: "Thank you for sharing that. The hard lessons shape us the most.",
                nextNodeId: 'asha_final_reflection',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'reflection', 'wisdom', 'growth']
    },

    // ============= CONNECTION NODE: Relationship Building =============
    {
        nodeId: 'asha_connection_mentor_offer',
        speaker: 'Asha Patel',
        content: [
            {
                text: "You know, I've been doing all the talking. But I can tell there's more to you than you're letting on.\n\nThe way you listen. The questions you ask. You're not just curious. You're seeking something.\n\nIf you're interested in community work (mediation, public art, social justice), I mentor young people.\n\nNo pressure. But you've got the instincts. The patience. The ability to hold space for complexity.\n\nThose aren't skills everyone has. And they're exactly what this city needs.\n\nThink about it. Whatever path you choose, you've already got the foundation. Now it's just about finding the form.",
                emotion: 'warm_earnest',
                variation_id: 'connection_mentor_v1',
                interaction: 'bloom'
            }
        ],
        requiredState: {
            trust: { min: 7 }
        },
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['mentor_offer_made']
            }
        ],
        choices: [
            {
                choiceId: 'mentor_accept',
                text: "I'd like that. There's so much I want to learn.",
                nextNodeId: 'asha_final_reflection',
                pattern: 'exploring',
                skills: ['collaboration'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2,
                    addGlobalFlags: ['asha_mentorship_started']
                }
            },
            {
                choiceId: 'mentor_consider',
                text: "Thank you. I need to think about what I really want first.",
                nextNodeId: 'asha_final_reflection',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            },
            {
                choiceId: 'mentor_help_first',
                text: "Let me help you finish this mural first. Then we can talk about what's next.",
                nextNodeId: 'asha_simulation_setup',
                pattern: 'helping',
                skills: ['collaboration'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            },
            {
                choiceId: 'mentor_curious',
                text: "What would mentorship with you look like?",
                nextNodeId: 'asha_connection_mentorship_details',
                pattern: 'analytical',
                skills: ['communication'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'connection', 'mentorship', 'relationship_building']
    },

    {
        nodeId: 'asha_connection_mentorship_details',
        speaker: 'Asha Patel',
        content: [
            {
                text: "It's not formal. No curriculum or certificates. Just learning by doing.\n\nWe'd work on community projects together. Murals, yes, but also facilitation. Helping groups in conflict find common ground.\n\nI'd introduce you to the network. Artists, organizers, elders. The people who've been building this city one relationship at a time.\n\nAnd you'd challenge me. That's the part most mentors don't talk about. Teaching someone forces you to examine what you actually believe.\n\nYou've already done that today. Made me question assumptions I didn't know I had.\n\nSo really, the mentorship has already started. The question is whether we make it official.",
                emotion: 'open',
                variation_id: 'mentorship_details_v1'
            }
        ],
        choices: [
            {
                choiceId: 'details_yes',
                text: "Let's make it official. I want to learn what you know.",
                nextNodeId: 'asha_final_reflection',
                pattern: 'building',
                skills: ['collaboration'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2,
                    addGlobalFlags: ['asha_mentorship_started']
                }
            },
            {
                choiceId: 'details_think',
                text: "That sounds meaningful. Let me reflect on it.",
                nextNodeId: 'asha_final_reflection',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 1
                }
            }
        ],
        tags: ['asha_arc', 'connection', 'mentorship']
    },

    // ============= PATTERN UNLOCK NODES =============
    // These become available when player demonstrates sufficient pattern affinity

    {
        nodeId: 'asha_mediation_philosophy',
        speaker: 'Asha',
        content: [
            {
                text: "You don't rush. That's rare. Most people want quick resolutions. Someone to be right, someone to be wrong.\n\nMy grandmother taught me something. Conflict isn't a problem to solve. It's a signal to understand.\n\nWhen two people argue, they're both saying something true that the other can't hear. My job isn't to pick sides. It's to translate until they can hear each other.\n\nPatience isn't waiting for the fight to end. It's staying present while the truth emerges. Sometimes that takes years.",
                emotion: 'teaching_profound',
                variation_id: 'philosophy_v1'
            }
        ],
        requiredState: {
            patterns: { patience: { min: 40 } }
        },
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['asha_philosophy_shared']
            }
        ],
        choices: [
            {
                choiceId: 'philosophy_practice',
                text: "How do you practice that kind of patience? In the middle of conflict?",
                nextNodeId: 'asha_artistic_process',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 3
                }
            },
            {
                choiceId: 'philosophy_grandmother',
                text: "Your grandmother sounds wise. Tell me about her.",
                nextNodeId: 'asha_grandmother_story',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 2
                }
            }
        ],
        tags: ['asha_arc', 'pattern_unlock', 'patience', 'philosophy']
    },

    {
        nodeId: 'asha_hardest_case',
        speaker: 'Asha',
        content: [
            {
                text: "You really care. About people. Not just outcomes.\n\nThe hardest case I ever worked wasn't a custody dispute or a business conflict. It was two sisters who hadn't spoken in fifteen years.\n\nOne was dying. Cancer. She wanted to apologize before it was too late. The other wouldn't answer her calls.\n\nI spent three months. Not mediating. Listening. Understanding why the silence had grown so thick neither could break through.\n\nThey reconciled. Eighteen days before she died. Eighteen days of saying everything that fifteen years had buried.\n\nThat's what helping really means. Not fixing. Witnessing. Holding space until people are ready to heal themselves.",
                emotion: 'vulnerable_profound',
                variation_id: 'hardest_v1'
            }
        ],
        requiredState: {
            patterns: { helping: { min: 50 } },
            trust: { min: 4 }
        },
        onEnter: [
            {
                characterId: 'asha',
                addKnowledgeFlags: ['asha_hardest_case_shared'],
                addGlobalFlags: ['asha_deep_trust']
            }
        ],
        choices: [
            {
                choiceId: 'hardest_honored',
                text: "Thank you for sharing that. Those eighteen days mattered more than most lifetimes.",
                nextNodeId: 'asha_vulnerability_arc',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 4
                }
            },
            {
                choiceId: 'hardest_learn',
                text: "How do you carry stories like that? How do you keep going?",
                nextNodeId: 'asha_vulnerability_arc',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'asha',
                    trustChange: 3
                }
            }
        ],
        tags: ['asha_arc', 'pattern_unlock', 'helping', 'vulnerability', 'profound']
    },

    // ============= ARC 3: THE QUIET HOUR =============
    {
        nodeId: 'asha_stillness_observation',
        speaker: 'Asha Patel',
        content: [
            {
                text: "I couldn't project this if I tried. The texture of the air changed.\n\nUsually, I have to fight the noise of the station to focus. Now? The focus is the only thing left. It's almost frighteningly clear.",
                emotion: 'awestruck',
                variation_id: 'arc3_stillness_v1'
            }
        ],
        choices: [
            {
                choiceId: 'asha_stillness_response',
                text: "Clarity can be overwhelming when you're used to noise.",
                nextNodeId: 'asha_hub_return',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    addGlobalFlags: ['quiet_hour_witnessed']
                }
            }
        ],
        tags: ['arc_quiet_hour']
    },

    {
        nodeId: 'asha_heartbeat_sync',
        speaker: 'Asha Patel',
        content: [
            {
                text: "Can you feel that? A rhythm. Deep down.\n\nIt's not a machine. Or if it is, it's a machine that's dreaming. It matches my own pulse perfectly.",
                emotion: 'mystical',
                variation_id: 'arc3_heartbeat_v1'
            }
        ],
        choices: [
            {
                choiceId: 'asha_heartbeat_response',
                text: "Maybe the station is alive in its own way.",
                nextNodeId: 'asha_hub_return',
                pattern: 'exploring',
                skills: ['systemsThinking'],
                consequence: {
                    addGlobalFlags: ['station_heartbeat_heard']
                }
            }
        ],
        tags: ['arc_quiet_hour']
    },

    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'asha_mystery_hint',
        speaker: 'asha',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "In mediation, I create safe spaces for difficult conversations. Neutral ground where people can be honest.\\n\\nThis station... it does that naturally. Everyone here feels safe to be vulnerable.",
                emotion: 'impressed',
                variation_id: 'mystery_hint_v1'
            },
            {
                text: "I've spent years learning to create that feeling. This place just <shake>has</shake> it.",
                emotion: 'humbled',
                variation_id: 'mystery_hint_v2'
            }
        ],
        choices: [
            {
                choiceId: 'asha_mystery_dig',
                text: "Maybe the station learned from people like you.",
                nextNodeId: 'asha_mystery_response',
                pattern: 'helping'
            },
            {
                choiceId: 'asha_mystery_feel',
                text: "You create that feeling too. I've felt it talking with you.",
                nextNodeId: 'asha_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'asha_mystery_response',
        speaker: 'asha',
        content: [
            {
                text: "Thank you for saying that. I think the station amplifies what we bring to it. Our openness, our willingness to connect.\\n\\nWe make each other safe. The station just gives us the space to do it.",
                emotion: 'warm',
                variation_id: 'mystery_response_v1'
            }
        ],
        onEnter: [
            { characterId: 'asha', addKnowledgeFlags: ['asha_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'asha_mystery_return',
                text: "You've made me feel safe to share.",
                nextNodeId: 'asha_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'asha_hub_return',
        speaker: 'asha',
        content: [{
            text: "I'm glad. That's all I want to do.",
            emotion: 'warm',
            variation_id: 'hub_return_v1'
        }],
        choices: []
    }
]

// ============= PUBLIC API =============
export const ashaEntryPoints = {
    INTRODUCTION: 'asha_introduction',
    ARTISTIC_PROCESS: 'asha_artistic_process',
    SIMULATION_SETUP: 'asha_simulation_setup',
    VULNERABILITY_ARC: 'asha_vulnerability_arc',
    GRANDMOTHER_STORY: 'asha_grandmother_story',
    MYSTERY_HINT: 'asha_mystery_hint'
} as const

export type AshaEntryPoint = typeof ashaEntryPoints[keyof typeof ashaEntryPoints]

export const ashaDialogueGraph: DialogueGraph = {
    version: '1.0.0',
    nodes: new Map(ashaDialogueNodes.map(node => [node.nodeId, node])),
    startNodeId: ashaEntryPoints.INTRODUCTION,
    metadata: {
        title: "Asha's Vision Studio",
        author: 'Guided Generation',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: ashaDialogueNodes.length,
        totalChoices: ashaDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
    }
}
