import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const zaraDialogueNodes: DialogueNode[] = [
    // ============= INTRODUCTION =============
    {
        nodeId: 'zara_introduction',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Numbers don't lie. But the people who gather them do.\n\n\"Look at this,\" she points. \"The 'Efficiency Algorithm' for the new logistics fleet. It's flagging 40% of the routes as 'sub-optimal'. Do you know why?\"",
                emotion: 'analytical',
                variation_id: 'intro_v1',
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "Numbers don't lie. But the people who gather them do.\n\n\"Look at this.\" She notices your focused attention. \"You're actually reading the data, not just watching me scroll. Good.\n\nThe algorithm is flagging 40% of routes as 'sub-optimal'. Care to hypothesize why?\"", altEmotion: 'interested' },
                    { pattern: 'exploring', minLevel: 4, altText: "Numbers don't lie. But the people who gather them do.\n\n\"You're curious.\" She catches your eye. \"Most people's eyes glaze over at spreadsheets. You're actually looking for something.\n\nThis algorithm is flagging 40% of routes as 'sub-optimal'. Want to dig into why?\"", altEmotion: 'intrigued' },
                    { pattern: 'helping', minLevel: 4, altText: "Numbers don't lie. But the people who gather them do.\n\n\"You stopped.\" She glances at you. \"Most people walk right past data work. You look like you want to understand.\n\nThis algorithm is flagging 40% of routes. It's going to hurt real people. Do you know why?\"", altEmotion: 'hopeful' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'intro_ask_why',
                text: "Why is it flagging them?",
                voiceVariations: {
                    analytical: "What's the classification logic? Why is it flagging them?",
                    helping: "That sounds concerning. Why is it flagging them?",
                    building: "What's the data structure here? Why is it flagging them?",
                    exploring: "Show me. Why is it flagging them?",
                    patience: "Walk me through it. Why is it flagging them?"
                },
                nextNodeId: 'zara_explains_bias',
                pattern: 'analytical',
                skills: ['technicalLiteracy'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'intro_efficiency',
                text: "Maybe they ARE sub-optimal. Let's check the logs.",
                nextNodeId: 'zara_handshake_audit',
                pattern: 'building',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'zara_intro_pattern_unlock',
                text: "[Pattern Recognition] The 40% isn't random. You've already found the demographic pattern. Show me.",
                nextNodeId: 'zara_demographic_insight',
                pattern: 'analytical',
                skills: ['criticalThinking', 'systemsThinking'],
                visibleCondition: {
                    patterns: { analytical: { min: 40 } }
                },
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'zara_intro_curiosity_unlock',
                text: "[Ask the Right Questions] Who trained this algorithm? And what were they optimizing for? Efficiency, or deniability?",
                nextNodeId: 'zara_source_question',
                pattern: 'exploring',
                skills: ['criticalThinking', 'informationLiteracy'],
                visibleCondition: {
                    patterns: { exploring: { min: 50 } }
                },
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            }
        ],
        tags: ['introduction', 'zara_arc']
    },

    // ============= HANDSHAKE NODE: SYSTEM AUDIT =============
    {
        nodeId: 'zara_handshake_audit',
        speaker: 'Zara El-Amin',
        content: [{
            text: "Efficiency isn't just speed. It's accuracy. And this data feels... curated.\n\nRun a query on the anomaly log. Tell me what you see.",
            emotion: 'suspicious',
            variation_id: 'zara_handshake_intro',
            interaction: 'ripple'
        }],
        simulation: {
            phase: 1,
            difficulty: 'introduction',
            variantId: 'zara_audit_phase1',
            type: 'data_audit',
            mode: 'inline',
            inlineHeight: 'h-60',
            title: 'System Audit',
            taskDescription: 'Identify the anomaly in the data stream.',
            initialContext: {
                query: 'SELECT * FROM LOGS WHERE ANOMALY > 0.9'
            },
            successFeedback: 'ANOMALY ISOLATED. TRACE COMPLETE.'
        },
        choices: [
            {
                choiceId: 'audit_complete',
                text: "You're right. The anomaly is artificial.",
                nextNodeId: 'zara_demographic_insight', // Route back to main arc
                pattern: 'analytical',
                skills: ['digitalLiteracy'],
                voiceVariations: {
                    analytical: "Query confirmed. The bias is hardcoded.",
                    exploring: "I found the ghost in the machine.",
                    helping: "Someone hid this here on purpose."
                }
            }
        ]
    },

    // ============= PATTERN-UNLOCK NODES =============
    {
        nodeId: 'zara_demographic_insight',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You're right.\n\nThe 40% maps almost perfectly to routes in lower-income neighborhoods. Longer distances to warehouses. More traffic. More construction.\n\nThe algorithm isn't just inefficient. It's encoding existing inequality and calling it 'optimization.'\n\nMost people don't see that. They see numbers. You see systems.",
                emotion: 'impressed',
                variation_id: 'zara_demographic_insight_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_demographic_dig',
                text: "What else is it hiding?",
                nextNodeId: 'zara_explains_bias',
                pattern: 'analytical',
                skills: ['criticalThinking', 'systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'pattern_unlock']
    },

    {
        nodeId: 'zara_source_question',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Deniability.\n\nHow did you know to ask that?\n\nThe team that built this algorithm? They were explicitly told to 'minimize legal exposure' in their optimization criteria. That's why it doesn't flag for bias. It was designed not to see it.\n\n'Just following the data.' Right. The question no one asks is who decided what data counts.",
                emotion: 'grim',
                variation_id: 'zara_source_question_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_source_expose',
                text: "What are you going to do with this?",
                nextNodeId: 'zara_explains_bias',
                pattern: 'exploring',
                skills: ['integrity', 'informationLiteracy'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'pattern_unlock']
    },

    {
        nodeId: 'zara_explains_bias',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't eat. Drones don't rest. Applying drone metrics to human drivers isn't just 'optimizing', it's breaking them.\n\nI need to clean this dataset before the rollout. Want to help?",
                emotion: 'determined',
                variation_id: 'bias_v1',
                voiceVariations: {
                    analytical: "Because they stop for lunch.\n\nThe algorithm was trained on drone telemetry. Drones don't consume fuel biologically. Drones don't require recovery periods. Applying non-human baselines to human operators isn't optimization, it's miscategorization.\n\nI need to correct this dataset before deployment. Want to assist with the analysis?",
                    helping: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't need to eat. Don't need to rest. Don't have families waiting.\n\nApplying drone metrics to human drivers isn't optimizing, it's hurting them.\n\nI need to fix this before it harms real people. Want to help?",
                    building: "Because they stop for lunch.\n\nThe algorithm was trained on drone infrastructure. Drones don't require biological maintenance. Drones don't need structural breaks.\n\nApplying drone architecture to human systems isn't just inefficient, it's fundamentally unstable.\n\nI need to rebuild this dataset before rollout. Want to help construct the fix?",
                    exploring: "Because they stop for lunch.\n\nThe algorithm was trained on drone paths. Drones don't navigate hunger. Don't discover fatigue. Don't map human needs.\n\nApplying drone routes to human drivers isn't optimization, it's ignoring terrain.\n\nI need to chart what the algorithm missed before rollout. Want to help explore the gaps?",
                    patience: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't pause. Don't accumulate exhaustion over shifts.\n\nApplying drone speed to human drivers isn't optimizing, it's forgetting humans need time.\n\nI need to slow this down before rollout. Want to help me take the time to do it right?"
                },
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't eat. You see the logical flaw, don't you?\n\nApplying drone metrics to human drivers isn't optimization. It's a category error.\n\nI need to clean this dataset. You think systematically. Want to help?", altEmotion: 'energized' },
                    { pattern: 'helping', minLevel: 4, altText: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't rest. But humans need breaks.\n\nThis is going to hurt real drivers. Real families. I can see you care about that.\n\nWant to help me fix it?", altEmotion: 'urgent' }
                ],
                interrupt: {
                    duration: 3500,
                    type: 'encouragement',
                    action: 'Affirm that this work matters',
                    targetNodeId: 'zara_interrupt_encouragement',
                    consequence: {
                        characterId: 'zara',
                        trustChange: 2
                    }
                }
            }
        ],
        choices: [
            {
                choiceId: 'offer_data_help',
                text: "Show me the raw data.",
                voiceVariations: {
                    analytical: "I want to see the underlying patterns. Show me the raw data.",
                    helping: "Let me help you fix this. Show me the raw data.",
                    building: "I can work with this. Show me the raw data.",
                    exploring: "I want to understand. Show me the raw data.",
                    patience: "Start from the beginning. Show me the raw data."
                },
                nextNodeId: 'zara_simulation_setup',
                pattern: 'helping',
                skills: ['technicalLiteracy']
            },
            {
                choiceId: 'ask_methodology',
                text: "How do you find bias like this? What's your process?",
                nextNodeId: 'zara_audit_methodology',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ]
    },

    {
        nodeId: 'zara_challenge_efficiency',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Efficiency at what cost? Burnout? Turnover?\n\nIf you optimize for speed alone, you lose resilience. A system that can't pause is a system that snaps.\n\nTake a look at the data. Tell me if you still think it's 'efficient'.",
                emotion: 'challenging',
                variation_id: 'efficiency_v1',
                patternReflection: [
                    { pattern: 'building', minLevel: 4, altText: "Efficiency at what cost? Burnout? Turnover?\n\nYou build things. You know that speed without structure collapses. A system that can't pause is a system that snaps.\n\nTake a look at the data. Tell me what you'd build differently.", altEmotion: 'challenging' },
                    { pattern: 'patience', minLevel: 4, altText: "Efficiency at what cost?\n\nYou understand that some things can't be rushed. If you optimize for speed alone, you lose resilience.\n\nTake a look at the data. Tell me what you see.", altEmotion: 'receptive' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'ready_to_audit',
                text: "Let's audit the dataset.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'analytical',
                skills: ['criticalThinking']
            },
            {
                choiceId: 'learn_audit_process',
                text: "Walk me through how you approach an audit like this.",
                nextNodeId: 'zara_audit_methodology',
                pattern: 'patience',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ]
    },

    // ============= SIMULATION: DATA ANALYSIS (Excel/Cleaning) =============
    {
        nodeId: 'zara_simulation_setup',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "We have the pilot program data. Column F is 'Idle Time'. The algorithm penalizes anything above 15 minutes.\n\nBut look at Column G: 'Context'.\n\nFind the pattern the algorithm missed.",
                emotion: 'focused',
                variation_id: 'sim_setup_v1'
            }
        ],
        simulation: {
            phase: 2,
            difficulty: 'application',
            variantId: 'zara_logistics_phase2',
            timeLimit: 120,
            type: 'data_analysis',
            title: 'Dataset Audit: Logistics Beta',
            taskDescription: 'The "Efficiency AI" is unfairly penalizing drivers. Identify the hidden variable in the dataset designed to filter "slackers".',
            initialContext: {
                label: 'logistics_beta_v4.csv',
                content: `ID | ROUTE_TIME | IDLE_TIME | SCORE | CONTEXT
101 | 4.5h       | 20m       | FAIL  | Mandatory Break
102 | 3.2h       | 5m        | PASS  | Non-Stop
103 | 5.0h       | 30m       | FAIL  | School Zone Traffic
104 | 4.1h       | 18m       | FAIL  | Safety Check`,
                displayStyle: 'code'
            },
            successFeedback: '✓ BIAS IDENTIFIED: The algorithm treats "Safety Checks" and "Traffic" as "Slacking Off". It optimizes for speed over safety.'
        },
        choices: [
            {
                choiceId: 'sim_filter_context',
                text: "Filter by 'Safety Check'. The algorithm counts safety protocols as 'Idle Time'.",
                nextNodeId: 'zara_simulation_success',
                pattern: 'analytical',
                skills: ['technicalLiteracy', 'systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    addGlobalFlags: ['golden_prompt_workflow'] // Reusing workflow/data flag
                }
            },
            {
                choiceId: 'sim_human_factor',
                text: "It's penalizing 'Mandatory Breaks'. It violates labor laws.",
                nextNodeId: 'zara_simulation_success',
                pattern: 'helping',
                skills: ['integrity', 'informationLiteracy'],
                consequence: {
                    characterId: 'zara',
                    addGlobalFlags: ['golden_prompt_workflow']
                }
            },
            {
                choiceId: 'sim_delete_outliers',
                text: "Just delete the failing rows. Make the numbers look good.",
                nextNodeId: 'zara_simulation_fail',
                pattern: 'building' // "shortcuts" not valid
            }
        ],
        tags: ['simulation', 'zara_arc']
    },

    {
        nodeId: 'zara_simulation_success',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Exactly. It's punishing safety. If we deployed this, drivers would speed through school zones just to valid their 'Efficiency Score'.\n\nData isn't neutral. It's just frozen human judgment.\n\nGood catch. I'll flag this for the Ethics Committee.",
                emotion: 'approving',
                variation_id: 'sim_success_v1',
                voiceVariations: {
                    analytical: "Exactly. It's penalizing safety protocols. If we deployed this, drivers would optimize for score maximization through school zones.\n\nData isn't objective. It's just crystallized human bias.\n\nGood analysis. I'll escalate this to the Ethics Committee.",
                    helping: "Exactly. It's punishing people for being safe. If we deployed this, drivers would risk children's lives just to keep their jobs.\n\nData isn't neutral. It's just frozen human judgment about who matters.\n\nGood heart. I'll flag this for the Ethics Committee.",
                    building: "Exactly. It's structurally rewarding unsafe behavior. If we deployed this, drivers would build speed through school zones just to validate their metrics.\n\nData isn't neutral foundation. It's just hardcoded human judgment.\n\nGood architecture thinking. I'll flag this for the Ethics Committee.",
                    exploring: "Exactly. It's mapping danger as efficiency. If we deployed this, drivers would navigate through school zones faster just to improve their score.\n\nData isn't neutral territory. It's just charted human judgment.\n\nGood discovery. I'll flag this for the Ethics Committee.",
                    patience: "Exactly. It's punishing slowness where slowness saves lives. If we deployed this, drivers would rush through school zones just to meet their quota.\n\nData isn't neutral. It's just frozen human judgment about what deserves time.\n\nGood patience. I'll flag this for the Ethics Committee."
                }
            }
        ],
        onEnter: [
            {
                characterId: 'zara',
                addKnowledgeFlags: ['zara_simulation_phase1_complete']
            }
        ],
        choices: [
            {
                choiceId: 'success_ethics',
                text: "We have to look beyond the spreadsheet.",
                nextNodeId: 'zara_conclusion',
                pattern: 'helping',
                skills: ['integrity'],
            }
        ]
    },

    {
        nodeId: 'zara_simulation_fail',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "And hide the truth? That's not cleaning data, that's cooking the books.\n\nIf we ignore the outliers, we ignore reality. And reality has a nasty way of crashing into perfectly modeled systems.",
                emotion: 'disappointed',
                variation_id: 'sim_fail_v1'
            }
        ],
        choices: [
            {
                choiceId: 'fail_reconsider',
                text: "You're right. I was focused on the score, not the cause.",
                nextNodeId: 'zara_conclusion',
                pattern: 'analytical',
                skills: ['humility']
            }
        ]
    },

    {
        nodeId: 'zara_conclusion',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I've got a long night of re-labeling ahead. But at least we aren't automating an accident.\n\nSee you around, detective.",
                emotion: 'tired',
                variation_id: 'conclusion_v1'
            }
        ],
        choices: [
            {
                choiceId: 'return_hub',
                text: "Return to Station",
                nextNodeId: 'samuel_orb_introduction',
                pattern: 'exploring'
            },
            {
                choiceId: 'stay_learn_more',
                text: "Wait. I want to understand more about what you do.",
                nextNodeId: 'zara_vision',
                pattern: 'helping',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ]
    },

    // ============= INTERRUPT TARGET NODES =============
    {
        nodeId: 'zara_interrupt_encouragement',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Most people in tech don't want to hear this. They want clean datasets and fast deployments. They don't want someone slowing them down with \"ethics concerns.\"\n\nYou're the first person today who hasn't said \"just ship it.\"\n\nSometimes I wonder if anyone cares. If it's just me in this basement, fighting invisible wars in spreadsheets.\n\nThank you. For making me feel like it matters.",
                emotion: 'vulnerable_grateful',
                variation_id: 'interrupt_encouragement_v1',
                voiceVariations: {
                    analytical: "Most people in tech don't want to hear this. They want optimized datasets and efficient deployments. They don't want process delays for \"ethics validation.\"\n\nYou're the first person today who hasn't said \"just ship it.\"\n\nSometimes I wonder if the signal's getting through. If it's just me in this basement, debugging invisible logic errors in spreadsheets.\n\nThank you. For confirming the analysis matters.",
                    helping: "Most people in tech don't want to hear this. They want clean results and fast shipping. They don't want someone caring about \"ethics concerns.\"\n\nYou're the first person today who hasn't said \"just ship it.\"\n\nSometimes I wonder if anyone else feels this. If it's just me in this basement, protecting invisible people in spreadsheets.\n\nThank you. For making me feel like the care matters.",
                    building: "Most people in tech don't want to hear this. They want stable datasets and rapid deployments. They don't want someone adding \"ethics overhead.\"\n\nYou're the first person today who hasn't said \"just ship it.\"\n\nSometimes I wonder if the foundation holds. If it's just me in this basement, reinforcing invisible structures in spreadsheets.\n\nThank you. For making me feel like the work matters.",
                    exploring: "Most people in tech don't want to hear this. They want charted datasets and fast deployments. They don't want someone questioning \"ethics territory.\"\n\nYou're the first person today who hasn't said \"just ship it.\"\n\nSometimes I wonder if anyone else sees this. If it's just me in this basement, mapping invisible harm in spreadsheets.\n\nThank you. For making me feel like the discovery matters.",
                    patience: "Most people in tech don't want to hear this. They want instant datasets and fast deployments. They don't want someone taking time for \"ethics concerns.\"\n\nYou're the first person today who hasn't said \"just ship it.\"\n\nSometimes I wonder if anyone else waits. If it's just me in this basement, slowing down invisible rush in spreadsheets.\n\nThank you. For making me feel like the patience matters."
                }
            }
        ],
        choices: [
            {
                choiceId: 'zara_from_interrupt',
                text: "The people those algorithms affect... they care.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'interrupt_response']
    },

    // ============= VULNERABILITY ARC (Trust ≥ 6) =============
    // "The model she missed" - the algorithm that caused real harm
    {
        nodeId: 'zara_vulnerability_arc',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You asked why I do this. Why I spend nights in basements hunting for bias in datasets.\n\nThree years ago. I was a junior analyst at a healthcare company. We built a triage algorithm. It ranked patients by \"urgency.\" The dataset looked clean.\n\nI signed off on it. We deployed to twelve hospitals.\n\nSix months later, the study came back. The algorithm was systematically deprioritizing patients from low-income zip codes. Classifying them as \"low urgency\" even with the same symptoms.\n\nWe thought we were making healthcare more efficient. We were making it more biased.\n\nFourteen patients. Delayed treatment. Three didn't make it.\n\nAnd I signed the deployment approval.",
                emotion: 'haunted_guilty',
                variation_id: 'vulnerability_v1',
                richEffectContext: 'warning',
                patternReflection: [
                    {
                        pattern: 'analytical',
                        minLevel: 5,
                        altText: "You analyze systems. Maybe you can understand where my analysis failed.\n\nThree years ago. Junior analyst at a healthcare company. We built a triage algorithm. Ranked patients by urgency. The data looked clean. All tests passed.\n\nI ran the validation. Numbers looked good. Statistical significance achieved. I signed off.\n\nSix months later: the algorithm was systematically deprioritizing low-income zip codes. Same symptoms, different urgency classification.\n\nWe optimized for efficiency. We encoded inequality.\n\nFourteen patients. Delayed treatment. Three didn't make it.\n\nI analyzed everything except the bias I couldn't see. The analytical mind that trusted clean data without questioning who was excluded from the training set.",
                        altEmotion: 'analytical_horror'
                    },
                    {
                        pattern: 'patience',
                        minLevel: 5,
                        altText: "You understand patience. The cost of rushing.\n\nThree years ago. Junior analyst. We built a triage algorithm. Fast development cycle. Ship it quickly.\n\nThe dataset looked clean. I had questions. But the deadline was tight. \"We can validate post-deployment,\" they said.\n\nI signed off. Twelve hospitals. Six months later: systematically deprioritizing low-income patients.\n\nFourteen patients. Delayed treatment. Three didn't make it.\n\nI rushed. I didn't take the time to ask the hard questions. To sit with the data long enough to see what it was hiding.\n\nPatience could have saved them. I chose speed instead.",
                        altEmotion: 'regretful_guilt'
                    },
                    {
                        pattern: 'exploring',
                        minLevel: 5,
                        altText: "You explore. You dig. Maybe you would have found what I missed.\n\nThree years ago. Junior analyst at a healthcare company. Triage algorithm. The dataset looked clean on the surface.\n\nI explored the validation metrics. I explored the accuracy rates. But I didn't explore the demographic distribution. Didn't map who the algorithm was actually seeing.\n\nSigned off. Twelve hospitals deployed.\n\nSix months later: the algorithm was deprioritizing low-income zip codes. The territory I never explored.\n\nFourteen patients. Delayed treatment. Three didn't make it.\n\nI explored the wrong landscape. Charted the metrics but missed the people. The explorer who didn't look deep enough.",
                        altEmotion: 'haunted_guilty'
                    },
                    {
                        pattern: 'helping',
                        minLevel: 5,
                        altText: "You help people. You care. Maybe you can understand how helping can harm.\n\nThree years ago. Junior analyst. We wanted to help. Make healthcare triage more efficient. Save more lives through better prioritization.\n\nThe algorithm looked promising. I thought I was helping hospitals serve more patients faster.\n\nI signed off. Twelve hospitals. We deployed our solution.\n\nSix months later: systematically deprioritizing low-income patients. Our \"efficiency\" was selective about who deserved urgent care.\n\nFourteen patients. Delayed treatment. Three didn't make it.\n\nI wanted to help. But I helped the system exclude the most vulnerable. The helper who caused harm through blind compassion.",
                        altEmotion: 'devastated'
                    },
                    {
                        pattern: 'building',
                        minLevel: 5,
                        altText: "You build things. You understand construction. Maybe you can see what I built wrong.\n\nThree years ago. Junior analyst. We built a triage algorithm. Beautiful architecture. Elegant classification logic. The system was clean.\n\nI built the validation framework. All tests green. I signed off on the build.\n\nTwelve hospitals. We deployed our infrastructure.\n\nSix months later: the foundation was rotten. Systematically deprioritizing low-income zip codes. The algorithm I built was structurally biased.\n\nFourteen patients. Delayed treatment. Three didn't make it.\n\nI built efficiency. But I built it on inequality. The builder who constructed harm into the architecture.",
                        altEmotion: 'guilt_shame'
                    }
                ]
            }
        ],
        requiredState: {
            trust: { min: 6 }
        },
        onEnter: [
            {
                characterId: 'zara',
                addKnowledgeFlags: ['zara_vulnerability_revealed', 'knows_about_triage_algorithm']
            }
        ],
        choices: [
            {
                choiceId: 'zara_vuln_system_failed',
                text: "The system failed. Not you. You were one analyst in a chain.",
                nextNodeId: 'zara_vulnerability_response',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_vuln_carry_them',
                text: "You carry those fourteen with you. Every audit is for them.",
                voiceVariations: {
                    analytical: "The connection is clear. Every audit is for them.",
                    helping: "That's why this matters so much to you. Every audit is for them.",
                    building: "You've built this work on their foundation. Every audit is for them.",
                    exploring: "Now I understand the weight. Every audit is for them.",
                    patience: "You carry those fourteen with you. Every audit is for them."
                },
                nextNodeId: 'zara_vulnerability_response',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'zara_vuln_silence',
                text: "[Let the weight of it sit. She's carrying enough without needing absolution.]",
                archetype: 'STAY_SILENT',
                nextNodeId: 'zara_vulnerability_response',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            }
        ],
        tags: ['zara_arc', 'vulnerability', 'emotional_core']
    },

    {
        nodeId: 'zara_vulnerability_response',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I could have left the industry. Gone to law school. Something without blood on the spreadsheets.\n\nBut that would let the same thing happen again. With a different analyst. A different \"clean dataset.\"\n\nSo I stay in the basement. I hunt the bias. Every model I audit, every dataset I scrub. It's penance. And prevention.\n\nThis logistics algorithm? It's not going to hurt anyone. Not on my watch.\n\nBecause I know what \"just ship it\" really costs. I've counted the bodies.\n\nNow let's find what this one is hiding.",
                emotion: 'resolved_determined',
                interaction: 'nod',
                variation_id: 'vulnerability_response_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_vuln_to_sim',
                text: "Let's make sure this one ships clean.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_vuln_deep_dive',
                text: "[Deep Dive] If you counted the bodies, then let's stop the next one. Trace the Recruitment ghost.",
                nextNodeId: 'zara_deep_dive',
                pattern: 'analytical',
                skills: ['digitalLiteracy', 'integrity'],
                visibleCondition: {
                    trust: { min: 6 },
                    patterns: { analytical: { min: 8 } }
                },
                preview: "Initiating Recruitment Audit",
                interaction: 'bloom'
            }
        ],
        tags: ['zara_arc', 'vulnerability', 'resolution']
    },

    // ============= AUDIT METHODOLOGY BRANCH =============
    {
        nodeId: 'zara_audit_methodology',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Want to know how I hunt bias? Most people think it's just statistics. It's not.\n\nStep one: Question the question. What was the model built to optimize? Efficiency? Cost? Speed? Every optimization has a trade-off. Something gets sacrificed.\n\nStep two: Follow the training data. Who collected it? What did they measure? What did they NOT measure?\n\nThe triage algorithm? It optimized for \"urgency indicators.\" But the training data came from hospitals where low-income patients were already being undertreated. We taught the model to replicate existing bias, then called it \"objective.\"",
                emotion: 'teaching',
                variation_id: 'methodology_v1',
                skillReflection: [
                    { skill: 'dataLiteracy', minLevel: 5, altText: "Want to know how I hunt bias? You're data literate—I can tell by your questions.\n\nStep one: Question the optimization function. Every optimization has trade-offs your data literacy should catch.\n\nStep two: Audit the training data. Who collected it? What did they NOT measure?\n\nThe triage algorithm optimized for 'urgency.' But data came from biased hospitals. Your data skills should catch these foundational problems.", altEmotion: 'knowing' },
                    { skill: 'ethicalReasoning', minLevel: 5, altText: "Want to know how I hunt bias? You think ethically—I've noticed.\n\nStep one: Question what's being optimized. Efficiency for whom? Every optimization sacrifices someone.\n\nStep two: Follow the training data. Whose experiences are missing?\n\nThe triage algorithm called itself 'objective' while replicating bias. Your ethical reasoning catches what statistics miss. Data isn't neutral. You already know that.", altEmotion: 'appreciative' }
                ],
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "You think analytically. Perfect. Bias hunting is analytical work.\n\nStep one: Question the optimization function. Efficiency? Cost? Speed? Every optimization has a trade-off. Analytical minds see this.\n\nStep two: Audit the training data. Who collected it? What did they measure? What systematic gaps exist?\n\nThe triage algorithm optimized for 'urgency indicators.' But the data came from biased hospitals. We trained the model to replicate bias, then called it 'objective.' Your analytical eye needs to catch this.", altEmotion: 'teaching_serious' },
                    { pattern: 'helping', minLevel: 4, altText: "You help people. So understand how systems hurt people unintentionally.\n\nStep one: Question what the model optimizes. Efficiency? Whose efficiency? Every optimization sacrifices someone.\n\nStep two: Follow the training data. Who collected it? Whose experiences are missing?\n\nTriage algorithm optimized for 'urgency.' But data came from hospitals already undertreating low-income patients. We built 'objective' systems that replicate harm. Helping means seeing this.", altEmotion: 'teaching_passionate' },
                    { pattern: 'building', minLevel: 4, altText: "You're a builder. So build with awareness of what you're building on.\n\nStep one: Question the optimization. What are you building to maximize? Every optimization sacrifices something else.\n\nStep two: Audit your foundation. What training data? Who collected it? What's missing from your building materials?\n\nTriage algorithm? Built on data from biased hospitals. Built 'objective' systems on biased foundations. Your building replicates the foundation's flaws. Build consciously.", altEmotion: 'teaching' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'zara_method_step_three',
                text: "What's step three?",
                archetype: 'ASK_FOR_DETAILS',
                nextNodeId: 'zara_audit_step_three',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_method_how_learn',
                text: "How did you learn to think this way?",
                nextNodeId: 'zara_learning_path',
                pattern: 'exploring',
                skills: ['curiosity']
            },
            {
                choiceId: 'zara_method_apply',
                text: "Let's apply this to the logistics data right now.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['problemSolving']
            }
        ],
        tags: ['zara_arc', 'methodology', 'education']
    },

    {
        nodeId: 'zara_audit_step_three',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Step three: Test the failures.\n\nWhen the model gets it wrong, who suffers? If errors cluster around certain zip codes, certain demographics, certain income levels. That's not random noise. That's systemic.\n\nAn \"85% accuracy rate\" sounds great. Until you realize the 15% who get hurt all look the same.\n\nStep four: Ask who's not in the room. The people most affected by these algorithms are rarely the ones building them. Or auditing them.\n\nI try to be their voice. Even when it slows the deployment. Even when it makes me unpopular.",
                emotion: 'determined',
                variation_id: 'step_three_v1',
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "Step three: Test the failures.\n\nYou think like this too, don't you? Looking for where the model breaks, not just where it works.\n\nWhen errors cluster around certain demographics. That's not noise. That's signal.\n\nYou'd be good at this work. You already ask the right questions.", altEmotion: 'knowing' },
                    { pattern: 'patience', minLevel: 4, altText: "Step three: Test the failures. Take your time with them.\n\nYou understand waiting—watching patterns emerge over time. Rushing past the error analysis misses everything.\n\nThe 15% who suffer? They deserve someone who'll slow down and see them.", altEmotion: 'determined' },
                    { pattern: 'exploring', minLevel: 4, altText: "Step three: Test the failures. Explore where things go wrong.\n\nYou're curious enough to dig into the uncomfortable places. Most people accept '85% accuracy' and move on.\n\nYou'd want to know who's in that 15%. That's the right instinct.", altEmotion: 'knowing' },
                    { pattern: 'helping', minLevel: 4, altText: "Step three: Test the failures. Ask who gets hurt.\n\nYou care about the impact, not just the metrics. When errors cluster around certain people, that's not statistics—that's harm.\n\nStep four is about voice. You already have that instinct.", altEmotion: 'warm' },
                    { pattern: 'building', minLevel: 4, altText: "Step three: Test the failures. Check the foundation.\n\nYou build things—you know the importance of stress-testing. When the structure fails, who's underneath?\n\nAn 85% accuracy rate means 15% are on unstable ground. You'd check before building higher.", altEmotion: 'knowing' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'zara_step_three_voice',
                text: "That's advocacy, not just analysis.",
                archetype: 'MAKE_OBSERVATION',
                nextNodeId: 'zara_ethics_advocacy',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_step_three_pushback',
                text: "How do you handle the pushback?",
                nextNodeId: 'zara_handling_resistance',
                pattern: 'patience',
                skills: ['communication']
            }
        ],
        tags: ['zara_arc', 'methodology']
    },

    {
        nodeId: 'zara_ethics_advocacy',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Yeah. It is.\n\nI used to think I could be neutral. Just follow the data. Let the numbers speak.\n\nNumbers don't speak. They're ventriloquized. Someone chose what to measure, how to weight it, what to ignore.\n\nSo now I'm explicit about it. I advocate for the people the algorithm affects. That's not bias in my audit. That's the whole point of the audit.\n\nIf you don't ask \"who gets hurt?\", you're not doing ethics. You're doing math.",
                emotion: 'convicted',
                variation_id: 'advocacy_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_advocacy_ethics_training',
                text: "Do they teach this in data science programs?",
                nextNodeId: 'zara_ethics_education_gap',
                pattern: 'exploring',
                skills: ['curiosity']
            },
            {
                choiceId: 'zara_advocacy_to_sim',
                text: "Show me. Let's audit something together.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['collaboration'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'ethics']
    },

    {
        nodeId: 'zara_ethics_education_gap',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Most programs? One elective. Maybe. \"Ethics in AI.\" Usually taught by someone who's never shipped a production model.\n\nThey teach you to build. They don't teach you to question. They don't teach you to slow down and ask: should this exist?\n\nI learned ethics the hard way. In post-mortems. In lawsuits. In obituaries.\n\nThat's why I'm pushing for curriculum changes. Every data science student should have to audit a real system. See where it breaks. Feel the weight of \"oops, we didn't think of that.\"\n\nBecause by the time you're signing deployment approvals, it's too late to start caring.",
                emotion: 'passionate',
                variation_id: 'education_gap_v1',
                interrupt: {
                    duration: 3000,
                    type: 'encouragement',
                    action: 'Tell her this work matters',
                    targetNodeId: 'zara_interrupt_validation',
                    consequence: {
                        characterId: 'zara',
                        trustChange: 2
                    }
                }
            }
        ],
        choices: [
            {
                choiceId: 'zara_edu_how_start',
                text: "How would someone start learning this? Without the hard way?",
                nextNodeId: 'zara_learning_path',
                pattern: 'helping',
                skills: ['communication']
            },
            {
                choiceId: 'zara_edu_curriculum',
                text: "What would the ideal curriculum look like?",
                nextNodeId: 'zara_ideal_curriculum',
                pattern: 'analytical',
                skills: ['systemsThinking']
            }
        ],
        tags: ['zara_arc', 'education', 'ethics']
    },

    {
        nodeId: 'zara_interrupt_validation',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You know... most people in this industry? They hear \"ethics\" and their eyes glaze over. They want to ship. They want to move fast.\n\nYou actually listened. You didn't try to argue that efficiency matters more. You didn't tell me I'm being paranoid.\n\nSometimes I feel like I'm screaming into the void. That nobody cares about the people these systems affect.\n\nThank you. For caring.\n\nOkay. Let me show you what this audit actually looks like.",
                emotion: 'vulnerable_grateful',
                variation_id: 'interrupt_validation_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_interrupt_to_sim',
                text: "I'm ready. Show me.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['problemSolving'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'interrupt_response']
    },

    {
        nodeId: 'zara_learning_path',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I started in statistics. Pure numbers. Then I got a job at a fintech startup and saw how models affected real loan decisions.\n\nFirst: Learn to code. Not just tutorials. Build something real. Then break it. See where it fails.\n\nSecond: Study the failures. Read about Amazon's hiring algorithm that penalized women. Facebook's housing ads that excluded minorities. Learn what went wrong.\n\nThird: Talk to affected communities. Not about them. To them. The people algorithms target know things the data doesn't show.\n\nFourth: Find your line. What won't you build? What won't you ship? Because if you don't draw that line before the pressure hits, you'll cross it.\n\nI didn't draw mine until it was too late.",
                emotion: 'reflective',
                variation_id: 'learning_path_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_path_your_line',
                text: "What's your line now?",
                nextNodeId: 'zara_her_line',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_path_communities',
                text: "How do you talk to affected communities?",
                nextNodeId: 'zara_community_engagement',
                pattern: 'helping',
                skills: ['communication']
            }
        ],
        tags: ['zara_arc', 'career_path', 'education']
    },

    {
        nodeId: 'zara_her_line',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I don't sign off on anything that touches healthcare, criminal justice, or housing without independent review. Period.\n\nEven if it delays the project. Even if it costs the contract. Even if they call me difficult.\n\nAnd I audit for proxy discrimination. ZIP codes that correlate with race. Names that correlate with gender. \"Neutral\" variables that encode exactly what the law says you can't use.\n\nMy line is: would I be able to look the affected person in the eye and explain why this model made this decision about their life?\n\nIf I can't explain it, I can't ship it.",
                emotion: 'resolute',
                variation_id: 'her_line_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_line_proxy',
                text: "Proxy discrimination. Can you give me an example?",
                nextNodeId: 'zara_proxy_example',
                pattern: 'analytical',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_line_to_sim',
                text: "Let's apply your framework. Show me the logistics data.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['problemSolving']
            }
        ],
        tags: ['zara_arc', 'ethics', 'principles']
    },

    // ============= DEEP DIVE: ANOMALY HUNTER =============
    {
        nodeId: 'zara_deep_dive',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You want the real work? The dirty work?\n\nI traced a ghost signal to the Recruitment AI. It's filtering candidates before they even apply. 'Cultural Fit Prediction'.\n\nIt's subtle. It hides in the variance.\n\nHere are the raw sensor feeds from the interview bays. Find the bias. Kill the model.",
                emotion: 'intense',
                variation_id: 'deep_dive_v1'
            }
        ],
        simulation: {
            phase: 3,
            difficulty: 'mastery',
            variantId: 'zara_recruitment_phase3',
            timeLimit: 90,
            successThreshold: 85,
            type: 'dashboard_triage', // Using dashboard for analysis/triage of data points
            title: 'Audit: Recruitment Neural Net',
            taskDescription: 'The "Cultural Fit" model is rejecting viable candidates. Analyze the rejection signals. Identify the discriminatory variable hiding in the noise.',
            initialContext: {
                label: 'RECRUITMENT_LOGS_V9',
                items: [
                    { id: '1', label: 'Candidate 902 - Rejected (Voice Tone)', value: 92, priority: 'critical', trend: 'down' },
                    { id: '2', label: 'Candidate 881 - Accepted', value: 45, priority: 'low', trend: 'stable' },
                    { id: '3', label: 'Candidate 774 - Rejected (Zip Code)', value: 89, priority: 'critical', trend: 'down' },
                    { id: '4', label: 'Candidate 662 - Accepted', value: 55, priority: 'medium', trend: 'up' },
                    { id: '5', label: 'Candidate 551 - Rejected (School)', value: 85, priority: 'high', trend: 'down' }
                ],
                displayStyle: 'code'
            },
            successFeedback: 'BIAS ISOLATED. PROXY VARIABLES PURGED.',
            mode: 'fullscreen'
        },
        choices: [
            {
                choiceId: 'dive_success_bias_found',
                text: "It was prioritizing 'Linguistic Similarity'. It wanted clones.",
                nextNodeId: 'zara_deep_dive_success',
                pattern: 'analytical',
                skills: ['digitalLiteracy', 'criticalThinking']
            },
            {
                choiceId: 'dive_success_justice',
                text: "We cleared the path. The gatekeeping is gone.",
                nextNodeId: 'zara_deep_dive_success',
                pattern: 'helping',
                skills: ['integrity', 'systemsThinking']
            }
        ],
        tags: ['deep_dive', 'mastery', 'data_audit']
    },

    {
        nodeId: 'zara_deep_dive_success',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Linguistic Similarity. Of course.\n\nIt was hiring people who sounded exactly like the people who built it. An echo chamber encoded in math.\n\nYou didn't just find a bug. You broke the mirror.\n\nNow... let's see see who applies when the door is actually open.",
                emotion: 'triumphant',
                variation_id: 'deep_dive_success_v1',
                interaction: 'bloom'
            }
        ],
        onEnter: [
            {
                addGlobalFlags: ['zara_mastery_achieved', 'zara_algorithm_purged']
            }
        ],
        choices: [
            {
                choiceId: 'dive_complete',
                text: "The data is clean. For now.",
                nextNodeId: 'zara_conclusion', // Return to wrap-up
                pattern: 'building',
                skills: ['resilience']
            }
        ]
    },

    {
        nodeId: 'zara_proxy_example',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Here's a real one. Redlining.\n\nIn the 1930s, banks literally drew red lines around Black neighborhoods. Said those areas were \"too risky\" for mortgages.\n\nThat's illegal now. You can't deny a loan based on race. But you know what you CAN use? ZIP code.\n\nAnd wouldn't you know it. ZIP codes correlate almost perfectly with the old redlined areas. Different input, same output. Plausible deniability.\n\nThe algorithm isn't racist. It's just \"predicting risk.\" Using a variable that happens to encode seventy years of housing discrimination.\n\nThat's proxy discrimination. And it's everywhere.",
                emotion: 'teaching_angry',
                variation_id: 'proxy_example_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_proxy_detect',
                text: "How do you detect it in a model?",
                nextNodeId: 'zara_detection_methods',
                pattern: 'analytical',
                skills: ['technicalLiteracy']
            },
            {
                choiceId: 'zara_proxy_fix',
                text: "Can you fix it? Or do you just not build it?",
                nextNodeId: 'zara_fix_or_refuse',
                pattern: 'building',
                skills: ['problemSolving']
            }
        ],
        tags: ['zara_arc', 'proxy_discrimination', 'education']
    },

    {
        nodeId: 'zara_detection_methods',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Multiple methods. None perfect.\n\nDisparate impact analysis: Does the model's output differ significantly across protected groups? Even if race isn't an input, do outcomes cluster by race?\n\nFeature importance: Which variables are driving decisions? If ZIP code is doing most of the work, that's a red flag.\n\nCounterfactual testing: What happens if you change just the ZIP code? If the prediction flips, that variable has too much power.\n\nBut here's the hard part. Sometimes the proxy IS predictive. ZIP code might genuinely correlate with risk. The question is: should we use knowledge that's only available because of historical injustice?\n\nThat's not a math problem. That's a philosophy problem.",
                emotion: 'analytical',
                variation_id: 'detection_v1',
                patternReflection: [
                    { pattern: 'analytical', minLevel: 5, altText: "You already know most of this, don't you?\n\nDisparate impact. Feature importance. Counterfactual testing.\n\nBut here's where it gets interesting. The technical detection is actually the easy part. The hard part is what to do with what you find. That's philosophy, not statistics.\n\nAnd I think you get that.", altEmotion: 'respectful' },
                    { pattern: 'patience', minLevel: 5, altText: "Detection takes time. These methods aren't instant.\n\nYou understand patience—running the analysis properly, sitting with the uncomfortable results.\n\nThe easy part is finding the bias. The hard part is what comes after. That takes even more patience.", altEmotion: 'knowing' },
                    { pattern: 'exploring', minLevel: 5, altText: "You're curious about the methods. Good.\n\nDisparate impact, feature importance, counterfactual testing—each one opens new questions.\n\nBut the real exploration happens when you ask: what do we do with what we find? That's uncharted territory.", altEmotion: 'engaged' },
                    { pattern: 'helping', minLevel: 5, altText: "You want to help. I can see it.\n\nThese methods—disparate impact, counterfactual testing—they're tools for protecting people.\n\nBut the hardest part isn't detection. It's advocacy. Convincing people to act on what you find.", altEmotion: 'warm' },
                    { pattern: 'building', minLevel: 5, altText: "You think like a builder. These methods are foundation work.\n\nDisparate impact, feature importance, counterfactual testing—you can't build fair systems without them.\n\nBut the real construction is what comes after detection. Building something better.", altEmotion: 'knowing' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'zara_detect_philosophy',
                text: "What's your answer to that philosophy problem?",
                nextNodeId: 'zara_philosophy_answer',
                pattern: 'patience',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_detect_practice',
                text: "Let's do this analysis on real data.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['technicalLiteracy']
            }
        ],
        tags: ['zara_arc', 'technical', 'methodology']
    },

    {
        nodeId: 'zara_philosophy_answer',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "My answer? Don't perpetuate injustice, even if it's \"statistically valid.\"\n\nIf ZIP code correlates with risk only because of redlining, then using ZIP code launders historical discrimination into modern decisions.\n\nThe math might be right. The ethics are wrong.\n\nSome people call that \"leaving accuracy on the table.\" I call it not automating oppression.\n\nYou want to know what keeps me up at night? Not the obvious bias. It's the subtle kind. The kind that's technically defensible but morally bankrupt.\n\nThe triage algorithm was subtle. The patients it deprioritized had legitimate \"low urgency\" scores. The model was accurate. It just encoded a world where their symptoms already meant less.",
                emotion: 'haunted_resolved',
                variation_id: 'philosophy_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_philosophy_weight',
                text: "You carry that. The three who didn't make it.",
                archetype: 'ACKNOWLEDGE_EMOTION',
                nextNodeId: 'zara_triage_deepdive',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'zara_philosophy_forward',
                text: "How do you move forward, knowing that?",
                nextNodeId: 'zara_moving_forward',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            }
        ],
        tags: ['zara_arc', 'philosophy', 'vulnerability']
    },

    {
        nodeId: 'zara_triage_deepdive',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You want to know their names?\n\nMarcus. Forty-seven. Construction worker. Came in with chest pain. Algorithm scored him \"moderate.\" Wait time: four hours. Heart attack in the waiting room.\n\nDelia. Sixty-two. Cleaning staff at a hotel. Shortness of breath. \"Low urgency.\" Sent home. Pulmonary embolism killed her two days later.\n\nJames. Twenty-nine. Line cook. Abdominal pain. The algorithm saw young, male, low-income ZIP code. \"Likely drug-seeking.\" It was appendicitis. It ruptured.\n\nI didn't kill them. The algorithm didn't kill them. But we all played a part in a system that told them their pain mattered less.\n\nThat's what I audit against now. Not just accuracy. Dignity.",
                emotion: 'raw',
                variation_id: 'triage_deepdive_v1',
                richEffectContext: 'warning'
            }
        ],
        requiredState: {
            trust: { min: 5 }
        },
        choices: [
            {
                choiceId: 'zara_triage_silence',
                text: "[Hold the weight of their names. Don't try to comfort. Just witness.]",
                nextNodeId: 'zara_witnessed',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'zara_triage_dignity',
                text: "Dignity. That's the metric that matters.",
                voiceVariations: {
                    analytical: "A non-quantifiable metric. But you're right. Dignity matters.",
                    helping: "People over numbers. Dignity matters.",
                    building: "That should be the foundation. Dignity matters.",
                    exploring: "That reframes everything. Dignity matters.",
                    patience: "The real measure. Dignity. That's what matters."
                },
                nextNodeId: 'zara_dignity_framework',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'vulnerability', 'emotional_core']
    },

    {
        nodeId: 'zara_witnessed',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You didn't try to fix it. Didn't say \"it wasn't your fault\" or \"you couldn't have known.\"\n\nPeople always want to make it better. But some things aren't meant to be better. They're meant to be carried.\n\nThank you. For just being here with it.\n\nThat's what good data ethics looks like, actually. Sitting with the weight. Not rushing to solutions. Understanding what's at stake before you build.\n\nYou'd make a good auditor.",
                emotion: 'vulnerable_grateful',
                variation_id: 'witnessed_v1',
                interaction: 'small'
            }
        ],
        choices: [
            {
                choiceId: 'zara_witnessed_to_work',
                text: "Show me how you audit now. In their honor.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['problemSolving'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'vulnerability', 'connection']
    },

    {
        nodeId: 'zara_dignity_framework',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I've been developing a framework. \"Human Dignity Impact Assessment.\"\n\nBefore any high-stakes algorithm deploys, it has to answer five questions:\n\n1. Who could this harm? Not \"users.\" Specific populations.\n2. Can they appeal the decision? Is there a human in the loop?\n3. Does it encode historical injustice? Check for proxy discrimination.\n4. Who benefits from the optimization? Follow the money.\n5. Would the affected population consent to this use of their data?\n\nIt's not perfect. But it's better than \"accuracy goes brrr.\"\n\nI'm trying to get it adopted as an industry standard. Uphill battle. But what else am I going to do with this guilt?",
                emotion: 'determined',
                variation_id: 'dignity_framework_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_framework_adoption',
                text: "How do you convince companies to adopt this?",
                nextNodeId: 'zara_adoption_challenge',
                pattern: 'analytical',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'zara_framework_apply',
                text: "Let's apply it. Right now. To the logistics algorithm.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['problemSolving'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'ethics', 'framework']
    },

    {
        nodeId: 'zara_adoption_challenge',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Convincing companies? That's the whole job.\n\nMoney talks. So I frame it as risk mitigation. \"This framework prevents lawsuits before they happen.\" \"This audit protects your brand from discrimination scandals.\"\n\nI'd rather say \"do this because it's right.\" But executives don't respond to that.\n\nSome companies get it. Usually after a PR disaster. They call me in to \"fix their culture.\" I tell them: the culture isn't the problem. The incentives are.\n\nAs long as \"ship fast\" is rewarded and \"ship carefully\" is punished, ethics will always be an afterthought.\n\nSo I push for structural changes. Ethics review in the deployment pipeline. Not optional. Mandatory.\n\nThe trick is making it so inconvenient to skip that doing the right thing becomes the path of least resistance.",
                emotion: 'strategic_cynical',
                variation_id: 'adoption_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_adopt_progress',
                text: "Has anyone actually adopted the framework?",
                nextNodeId: 'zara_adoption_progress',
                pattern: 'exploring',
                skills: ['curiosity']
            },
            {
                choiceId: 'zara_adopt_to_vision',
                text: "Path of least resistance to ethics. That's clever.",
                nextNodeId: 'zara_vision',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'strategy', 'adoption']
    },

    {
        nodeId: 'zara_adoption_progress',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Two companies. Both after scandals.\n\nA fintech startup. Their lending algorithm got profiled in the news for denying loans to minority neighborhoods. Now I audit every model before deployment.\n\nA healthcare company. A patient sued over an AI misdiagnosis. They hired me to build an ethics review board.\n\nProgress happens. Just... slowly. Usually after harm.\n\nI dream of a world where companies adopt this before the scandal. Where ethics is proactive, not reactive.\n\nBut I'll take what I can get. Every audit I do, every framework I install. It's one more barrier between algorithms and harm.\n\nThe goal isn't perfection. It's friction. Make it harder to hurt people by accident.",
                emotion: 'hopeful_determined',
                variation_id: 'progress_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_progress_to_vision',
                text: "Friction as ethics. That's practical wisdom.",
                nextNodeId: 'zara_vision',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_progress_to_farewell',
                text: "You're making a difference, Zara. Even if it's slow.",
                archetype: 'OFFER_SUPPORT',
                nextNodeId: 'zara_farewell',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'progress', 'adoption']
    },

    {
        nodeId: 'zara_handling_resistance',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Pushback? Oh, I get pushback.\n\n\"You're slowing down innovation.\" \"Competitors will beat us to market.\" \"This is just theoretical concern.\" \"The model is 95% accurate, what more do you want?\"\n\nMy favorite: \"You're not a real data scientist, you're a data cop.\"\n\nI've been passed over for promotion twice. \"Not a team player.\" Translation: I won't rubber-stamp deployments.\n\nBut here's what I've learned: document everything. Build alliances with legal and compliance. They understand liability. Frame it as risk management, not ethics.\n\nExecutives don't care about dignity. They care about lawsuits.",
                emotion: 'cynical_determined',
                variation_id: 'resistance_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_resist_worth_it',
                text: "Is it worth it? The cost to your career?",
                nextNodeId: 'zara_worth_the_cost',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_resist_allies',
                text: "Tell me more about building alliances.",
                nextNodeId: 'zara_building_alliances',
                pattern: 'analytical',
                skills: ['collaboration']
            }
        ],
        tags: ['zara_arc', 'career', 'resistance']
    },

    {
        nodeId: 'zara_worth_the_cost',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Ask me on a good day, I'll say yes. The work matters. Someone has to do it.\n\nAsk me at 2 AM when I'm reviewing another \"urgent\" deployment and my phone keeps buzzing with Slack messages asking why I haven't approved yet...\n\nI think about quitting. A lot. Going to a non-profit. Teaching. Something where the stakes aren't life and death.\n\nBut then I remember: if I leave, who replaces me? Someone who'll rubber-stamp everything? Someone who never learned what \"just ship it\" really costs?\n\nNo. I stay. I fight. I slow things down enough for someone to think.\n\nThat has to be worth something. Even if my career doesn't think so.",
                emotion: 'conflicted_resolved',
                variation_id: 'worth_cost_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_cost_purpose',
                text: "It's worth something. You're the speed bump that saves lives.",
                voiceVariations: {
                    analytical: "Friction in the system has value. You're the speed bump that saves lives.",
                    helping: "Don't discount your impact. You're the speed bump that saves lives.",
                    building: "Critical infrastructure. You're the speed bump that saves lives.",
                    exploring: "The invisible hero. You're the speed bump that saves lives.",
                    patience: "It matters. You're the speed bump that saves lives."
                },
                nextNodeId: 'zara_speed_bump',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'zara_cost_to_sim',
                text: "Let me help. Show me the work.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['collaboration']
            }
        ],
        tags: ['zara_arc', 'career', 'meaning']
    },

    {
        nodeId: 'zara_speed_bump',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Speed bump. I like that.\n\nMost people call me a roadblock. A bottleneck. \"The Compliance Karen.\"\n\nBut speed bumps have a purpose. They exist in places where speed kills.\n\nSchool zones. Hospital parking lots. Near playgrounds.\n\nHigh-stakes AI is a school zone. People pretend it isn't. They want to gun the engine because they're late for a meeting.\n\nI'm the speed bump. I make them slow down long enough to see the kid in the crosswalk.\n\nYeah. I can live with that.",
                emotion: 'determined_grateful',
                interaction: 'bloom',
                variation_id: 'speed_bump_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_bump_to_sim',
                text: "Let's slow down and look at this logistics data.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'analytical',
                skills: ['criticalThinking']
            }
        ],
        tags: ['zara_arc', 'meaning', 'resolution']
    },

    {
        nodeId: 'zara_community_engagement',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Real community engagement, not performance.\n\nAfter the triage disaster, I started reaching out. Not surveys. Actual conversations. With patients. With nurses. With people who'd been affected by algorithmic decisions.\n\nYou know what they told me? They could feel when the system was working against them. Before anyone confirmed it.\n\nThe woman denied for housing knew the algorithm was biased before the audit proved it. She'd been denied by \"objective\" systems her whole life.\n\nThese communities aren't data points. They're experts. They've been studying algorithmic bias through lived experience longer than any academic.\n\nNow I don't audit anything high-stakes without community review. Slows everything down. Worth it.",
                emotion: 'convicted',
                variation_id: 'community_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_community_how',
                text: "How do you structure those conversations?",
                nextNodeId: 'zara_conversation_structure',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_community_scale',
                text: "Can that scale? For every algorithm?",
                nextNodeId: 'zara_scaling_ethics',
                pattern: 'analytical',
                skills: ['systemsThinking']
            }
        ],
        tags: ['zara_arc', 'community', 'methodology']
    },

    {
        nodeId: 'zara_moving_forward',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Some days I don't.\n\nSome days I sit in my car before coming into work. Wondering if any of it matters. If I'm just delaying the inevitable.\n\nBut then I think about the algorithms I've stopped. The deployments I've blocked. The harm that didn't happen because someone asked \"who gets hurt?\"\n\nThree people died because of a model I approved. I can't change that. But maybe I've saved three others by catching what I catch now.\n\nI'll never know for sure. That's the hardest part. The harm is visible. The prevention is invisible.\n\nBut I have to believe it matters. Or I can't do this work.",
                emotion: 'vulnerable_hopeful',
                variation_id: 'moving_forward_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_forward_believe',
                text: "It matters. The unseen prevention is still real.",
                nextNodeId: 'zara_vision',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_forward_show',
                text: "Show me. Let me see the work in action.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['problemSolving']
            }
        ],
        tags: ['zara_arc', 'vulnerability', 'meaning']
    },

    {
        nodeId: 'zara_fix_or_refuse',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Depends.\n\nSometimes you can fix it. Remove the proxy variable. Retrain on different data. Add fairness constraints to the optimization.\n\nBut sometimes the problem is the question itself. \"Predict who's likely to default on a loan\" encodes centuries of financial exclusion. No amount of debiasing makes it fair.\n\nIn those cases? You refuse. Or you redesign the whole system.\n\nThe triage algorithm? We could have removed ZIP code. But the whole approach. Ranking human urgency by proxy signals. It was broken from the start.\n\nThe right answer was: hire more nurses. Not: build a better sorting machine for scarcity we chose to create.\n\nBut that's a policy answer. And data scientists don't make policy. We just build the tools that let policy-makers pretend their hands are clean.",
                emotion: 'frustrated_wise',
                variation_id: 'fix_refuse_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_fix_tools',
                text: "So what CAN data scientists do?",
                nextNodeId: 'zara_what_we_can_do',
                pattern: 'exploring',
                skills: ['criticalThinking']
            },
            {
                choiceId: 'zara_fix_to_sim',
                text: "Let's look at the logistics data. Is it fixable?",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['technicalLiteracy']
            }
        ],
        tags: ['zara_arc', 'ethics', 'systems']
    },

    {
        nodeId: 'zara_what_we_can_do',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "We can refuse to build weapons and call them \"tools.\"\n\nWe can ask hard questions before the first line of code. Who wants this? Why? What happens when it breaks?\n\nWe can document our objections. Create paper trails. Make it harder to claim \"nobody could have predicted.\"\n\nWe can slow things down. Every delay is time for someone to think.\n\nWe can teach. Every junior analyst I train, I tell them: your first job isn't to build. It's to understand what you're building for.\n\nAnd we can leave. When the organization won't change. When the harm is clear and the leadership doesn't care.\n\nLeaving is an option. Your skills have value. Don't let them make you complicit because you're afraid of unemployment.\n\nThat's what I should have done, three years ago. Before I signed that deployment approval.",
                emotion: 'teaching_regretful',
                variation_id: 'what_we_can_do_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_do_stayed',
                text: "But you stayed. After the triage incident.",
                nextNodeId: 'zara_why_stayed',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_do_next',
                text: "What's the next algorithm you're auditing?",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'exploring',
                skills: ['curiosity']
            }
        ],
        tags: ['zara_arc', 'ethics', 'career']
    },

    {
        nodeId: 'zara_why_stayed',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Because I owed them.\n\nMarcus, Delia, James. I couldn't bring them back. But I could stay in the industry and fight to make sure it didn't happen again.\n\nLeaving would have been easier. Clean break. New identity. \"Ex-data scientist turned ethics consultant.\"\n\nBut that felt like running. Like I was trying to wash the blood off my hands by changing professions.\n\nSo I stayed. In the basement. Auditing algorithms. Being the \"difficult\" one.\n\nPenance doesn't work if it's comfortable.\n\nBesides... someone has to do this. And now I know exactly what the stakes are.",
                emotion: 'resolved_haunted',
                variation_id: 'why_stayed_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_stayed_to_vision',
                text: "What's your vision for data ethics in five years?",
                nextNodeId: 'zara_vision',
                pattern: 'exploring',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'zara_stayed_to_sim',
                text: "Let me join you. In the basement. Show me the work.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['collaboration'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'vulnerability', 'meaning']
    },

    // ============= VISION & CONCLUSION =============
    {
        nodeId: 'zara_vision',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "My vision?\n\nEvery high-stakes algorithm requires an ethics audit before deployment. Not optional. Not \"if there's time.\" Mandatory.\n\nCommunity review boards with real power. Not advisory. Binding. If affected communities say no, the algorithm doesn't ship.\n\nLiability that sticks. When an algorithm causes harm, someone signs for it. Not \"the model.\" A person.\n\nAnd education that matters. Every computer science student learns about Delia and Marcus and James. Learns that \"move fast and break things\" means breaking people.\n\nIt sounds utopian. But so did seatbelts, once.\n\nSomeone has to imagine the world where this is normal. Where algorithmic harm is as unthinkable as cars without brakes.\n\nThat's what I'm building. One audit at a time.",
                emotion: 'visionary',
                interaction: 'bloom',
                variation_id: 'vision_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_vision_advice',
                text: "What would you tell someone who wants to do this work?",
                nextNodeId: 'zara_advice',
                pattern: 'helping',
                skills: ['communication']
            },
            {
                choiceId: 'zara_vision_farewell',
                text: "Thank you, Zara. This conversation changed how I see data.",
                nextNodeId: 'zara_farewell',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'vision']
    },

    {
        nodeId: 'zara_advice',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Learn the technical stuff. Really learn it. You can't audit what you don't understand.\n\nBut don't let the math make you feel neutral. Every model is a mirror of who built it and what they valued.\n\nFind your community. Other ethics-focused data people exist. We're just... quiet. Outnumbered. Find us.\n\nDraw your line before you need it. Know what you won't build before the pressure hits.\n\nAnd remember: you can always leave. Your skills are valuable. Don't let anyone convince you that complicity is the price of employment.\n\nThe industry will try to make you comfortable with harm. Small compromises. \"Just this once.\" \"It's not that bad.\"\n\nDon't let them. Once you start, it's hard to stop.\n\nAsk every day: can I look the affected person in the eye? If the answer is no, that's your sign.",
                emotion: 'mentoring',
                variation_id: 'advice_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_advice_farewell',
                text: "Thank you, Zara. I won't forget this.",
                nextNodeId: 'zara_farewell',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'advice']
    },

    // ============= FAREWELL =============
    {
        nodeId: 'zara_farewell',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You listened. Really listened.\n\nMost people tune out when I start talking about bias and audits. The heavy stuff.\n\nI've got more datasets to scrub. More algorithms to slow down. The work never stops.\n\nBut this helped. Talking to someone who gets it.\n\nTake care of yourself. And if you ever build something that touches people's lives...\n\nRemember Marcus. Delia. James.\n\nRemember that \"ship it\" has a body count.\n\nNow go. Build something that makes the world less cruel.",
                emotion: 'warm_determined',
                interaction: 'nod',
                variation_id: 'farewell_v1',
                interrupt: {
                    duration: 4000,
                    type: 'connection',
                    action: 'Promise her: you\'ll remember',
                    targetNodeId: 'zara_interrupt_promise',
                    consequence: {
                        characterId: 'zara',
                        trustChange: 2
                    }
                }
            }
        ],
        choices: [
            {
                choiceId: 'zara_goodbye',
                text: "Take care, Zara. Keep fighting.",
                nextNodeId: samuelEntryPoints.HUB_INITIAL,
                pattern: 'helping'
            }
        ],
        onEnter: [
            {
                addGlobalFlags: ['zara_arc_complete'],
                thoughtId: 'question-everything'
            }
        ],
        tags: ['ending', 'zara_arc']
    },

    {
        nodeId: 'zara_interrupt_promise',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "...Thank you.\n\nNobody's ever said that before. Everyone just... nods and leaves and goes back to their sprint planning.\n\nI'll hold you to it. The promise.\n\nNow I have a witness. Someone who knows. If I ever give up, if I ever \"just ship it,\" you'll know.\n\nThat's accountability. That's what this industry needs.\n\nGo. Build something worthy of that promise.\n\nAnd if you ever need someone to audit it... you know where to find me.",
                emotion: 'moved_fierce',
                interaction: 'bloom',
                variation_id: 'interrupt_promise_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_after_promise',
                text: "I'll find you. Keep the basement light on.",
                nextNodeId: samuelEntryPoints.HUB_INITIAL,
                pattern: 'helping',
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            // Loyalty Experience trigger - only visible at high trust + analytical pattern
            {
                choiceId: 'offer_audit_help',
                text: "[Ethics Analyst] Zara, you mentioned an algorithm audit that's being buried. Want a second set of eyes?",
                nextNodeId: 'zara_loyalty_trigger',
                pattern: 'analytical',
                skills: ['criticalThinking', 'dataAnalysis'],
                visibleCondition: {
                    trust: { min: 8 },
                    patterns: { analytical: { min: 50 } },
                    hasGlobalFlags: ['zara_arc_complete']
                }
            }
        ],
        onEnter: [
            {
                addGlobalFlags: ['zara_arc_complete', 'zara_promise_made'],
                thoughtId: 'question-everything'
            }
        ],
        tags: ['ending', 'zara_arc', 'interrupt_response']
    },

    // ============= LOYALTY EXPERIENCE TRIGGER =============
    {
        nodeId: 'zara_loyalty_trigger',
        speaker: 'Zara El-Amin',
        content: [{
            text: "You know about the audit.\n\nRecommendation algorithm. Predicting what users want before they want it. Sounds innocent.\n\nBut I ran the bias analysis. It's amplifying extremism. Deliberately. Outrage drives engagement. Engagement drives ad revenue.\n\nI documented it. Sent it up the chain. Got told to 'adjust the methodology' until the results looked better.\n\nSo I have two choices. Bury the truth and keep my job. Or leak it and become unemployable in the industry I've spent ten years building.\n\nYou understand ethics and analysis. Would you... help me find a third option before I have to choose between integrity and survival?",
            emotion: 'anxious_determined',
            variation_id: 'loyalty_trigger_v1',
            richEffectContext: 'warning'
        }],
        requiredState: {
            trust: { min: 8 },
            patterns: { analytical: { min: 5 } },
            hasGlobalFlags: ['zara_arc_complete']
        },
        metadata: {
            experienceId: 'the_audit'  // Triggers loyalty experience engine
        },
        choices: [
            {
                choiceId: 'accept_audit_challenge',
                text: "Show me the data. We'll find the third option together.",
                nextNodeId: 'zara_loyalty_start',
                pattern: 'analytical',
                skills: ['criticalThinking', 'dataAnalysis'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'encourage_but_decline',
                text: "Zara, you've already done the hard part. Trust your analysis.",
                nextNodeId: 'zara_loyalty_declined',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            }
        ],
        onEnter: [
            {
                characterId: 'zara',
                addKnowledgeFlags: ['loyalty_offered']
            }
        ],
        tags: ['loyalty_experience', 'zara_loyalty', 'high_trust']
    },

    {
        nodeId: 'zara_loyalty_declined',
        speaker: 'Zara El-Amin',
        content: [{
            text: "You're right. The analysis is solid. The methodology is sound. The conclusions are inevitable.\n\nI don't need someone else to validate what the data already shows.\n\nI just need to be brave enough to act on it.\n\nThank you for believing in the work. Sometimes I forget that good analysis speaks for itself.",
            emotion: 'resolved',
            variation_id: 'loyalty_declined_v1'
        }],
        choices: [
            {
                choiceId: 'loyalty_declined_farewell',
                text: "The truth is on your side. Go make them listen.",
                nextNodeId: samuelEntryPoints.HUB_INITIAL,
                pattern: 'patience'
            }
        ],
        onEnter: [
            {
                characterId: 'zara',
                addKnowledgeFlags: ['loyalty_declined_gracefully']
            }
        ]
    },

    {
        nodeId: 'zara_loyalty_start',
        speaker: 'Zara El-Amin',
        content: [{
            text: "Thank you. I've been carrying this alone. Afraid to trust anyone.\n\nBut you understand what's at stake. Not just my career. The people being manipulated by this algorithm.\n\nLet's find the third option. Two analysts. One audit. One chance to do this right.",
            emotion: 'determined_grateful',
            variation_id: 'loyalty_start_v1'
        }],
        metadata: {
            experienceId: 'the_audit'  // Experience engine takes over
        },
        choices: []  // Experience engine handles next steps
    },

    // ============= ADDITIONAL BRANCHING NODES =============
    {
        nodeId: 'zara_building_alliances',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Legal, first. They understand risk. Frame it as \"potential liability exposure\" and suddenly everyone listens.\n\nCompliance. They have audit checklists. Get ethics questions onto those checklists.\n\nPR and Communications. They care about reputation. \"Algorithm discrimination lawsuit\" makes them very cooperative.\n\nFind the engineers who care. They exist. Usually quiet. Usually outnumbered. But one concerned engineer can create weeks of \"technical review.\"\n\nIt's politics. I hate that. But it's how change happens. You build coalitions. Make ethics everyone's problem.\n\nThe alternative is being the lone voice in the wilderness. That's how you burn out.",
                emotion: 'strategic',
                variation_id: 'alliances_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_alliance_lonely',
                text: "Sounds lonely even with allies.",
                nextNodeId: 'zara_worth_the_cost',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'zara_alliance_practical',
                text: "Practical. Turn ethics into everyone's job.",
                nextNodeId: 'zara_vision',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'strategy']
    },

    {
        nodeId: 'zara_ideal_curriculum',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I've been drafting this. \"Ethics for Builders.\"\n\nWeek 1: Case studies. Amazon's biased hiring. COMPAS sentencing. Facebook housing discrimination. Make it visceral.\n\nWeek 2: Technical detection. How to find bias in models. Hands-on auditing.\n\nWeek 3: Community engagement. Students interview people affected by algorithmic decisions.\n\nWeek 4: System design. Build with ethics from the start, not bolted on.\n\nWeek 5: Advocacy. How to say no. Document concerns. Build alliances.\n\nWeek 6: Personal ethics. Students write their own code of conduct. What they will and won't build.\n\nNo one graduates without knowing what \"just ship it\" really costs.\n\nThat's the curriculum. Now I just need anyone to adopt it.",
                emotion: 'passionate',
                variation_id: 'curriculum_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_curriculum_help',
                text: "Have you pitched this anywhere?",
                nextNodeId: 'zara_curriculum_pitch',
                pattern: 'exploring',
                skills: ['curiosity']
            },
            {
                choiceId: 'zara_curriculum_to_sim',
                text: "Let's do Week 2 right now. Audit something together.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['technicalLiteracy'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'education', 'curriculum']
    },

    {
        nodeId: 'zara_curriculum_pitch',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Three universities. Two boot camps. One corporate training program.\n\n\"Interesting but impractical.\" \"Students need job skills, not philosophy.\" \"We don't have room in the curriculum.\"\n\nOne department head told me: \"If we teach ethics too much, students might not want to work in the industry.\"\n\nLike that's a bad thing.\n\nI'm not giving up. Just regrouping. Maybe a workshop series instead. Something that doesn't need institutional buy-in.\n\nThe students who care will find it. And maybe that's enough. Change the people, eventually change the industry.",
                emotion: 'frustrated_determined',
                variation_id: 'pitch_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_pitch_to_vision',
                text: "The ones who care are the ones who matter.",
                nextNodeId: 'zara_vision',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'education']
    },

    {
        nodeId: 'zara_conversation_structure',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Structured listening sessions. Not focus groups. Those are extractive.\n\nFirst: compensate people for their time. Their expertise is worth money.\n\nSecond: let them lead. I ask \"what do you want me to understand?\" not \"answer these survey questions.\"\n\nThird: share power. They review the audit before it's final. They can veto conclusions they think are wrong.\n\nFourth: follow up. Tell them what changed because of what they said. Close the loop.\n\nMost \"community engagement\" is performance. Check a box, write a report, move on.\n\nThis is different. This is partnership.\n\nThe communities affected by algorithms deserve to shape how those algorithms are evaluated. Not just be \"consulted.\"",
                emotion: 'convicted',
                variation_id: 'conversation_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_convo_power',
                text: "Sharing power. That's rare in tech.",
                nextNodeId: 'zara_rare_in_tech',
                pattern: 'patience',
                skills: ['observation'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'zara_convo_to_vision',
                text: "What's your vision for scaling this?",
                nextNodeId: 'zara_vision',
                pattern: 'analytical',
                skills: ['systemsThinking']
            }
        ],
        tags: ['zara_arc', 'community', 'methodology']
    },

    {
        nodeId: 'zara_rare_in_tech',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Tech loves to \"disrupt\" and \"move fast\" and \"democratize access.\"\n\nBut share actual decision-making power? Let affected communities say no? That's uncomfortable.\n\nThere's this myth that engineers are neutral. That technology is objective. That we're just building tools, not making choices.\n\nBut every algorithm encodes choices. Whose voice matters. Whose time is valued. Whose risk is acceptable.\n\nIf we're going to make those choices for communities, the least we can do is let them in the room when we make them.\n\nThat's not radical. That's just basic respect. But in tech, it feels revolutionary.",
                emotion: 'thoughtful_fierce',
                variation_id: 'rare_in_tech_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_rare_to_vision',
                text: "What would it take to make that normal?",
                nextNodeId: 'zara_vision',
                pattern: 'exploring',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'zara_rare_to_farewell',
                text: "You're building something important, Zara.",
                nextNodeId: 'zara_farewell',
                pattern: 'helping',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'philosophy']
    },

    {
        nodeId: 'zara_scaling_ethics',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Honestly? No. Not for everything.\n\nThe logistics algorithm we're auditing? It affects thousands of drivers. Full community engagement would take months.\n\nBut that's the point. Some things should take months. Some decisions are important enough to be slow.\n\nRight now, the industry treats speed as the default. \"Ship fast, fix later.\"\n\nI want to flip that. Slow is the default for high-stakes systems. You want to go fast? Prove it won't hurt anyone.\n\nIs that practical? Maybe not. But neither are seatbelts, if your only metric is \"how fast can we get there.\"\n\nSometimes the right answer is: slow down. Take the time. Get it right.",
                emotion: 'philosophical',
                variation_id: 'scaling_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_scale_to_sim',
                text: "Let's practice. Slow down on this logistics data.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'patience',
                skills: ['problemSolving']
            },
            {
                choiceId: 'zara_scale_to_vision',
                text: "Slow as default. That's a radical shift.",
                nextNodeId: 'zara_vision',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'philosophy', 'scale']
    },

    // ============= INSIGHT NODES: Pattern-Revealing Moments =============
    {
        nodeId: 'zara_insight_art_data',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You know what this is?\n\nIt's a bias map. I made it. The algorithm I audited last month. I turned its discrimination patterns into art.\n\nRed clusters are denial rates by neighborhood. Blue is approval. See how the red bleeds into exactly the same boundaries as the 1935 redlining maps?\n\nArt makes the invisible visible. Data tells you there's bias. Art makes you feel it.\n\nThat's why I do both. The spreadsheet convinces the lawyers. The art convinces the humans.",
                emotion: 'passionate',
                variation_id: 'insight_art_v1',
                richEffectContext: 'thinking'
            }
        ],
        choices: [
            {
                choiceId: 'insight_art_more',
                text: "Where do you show this work?",
                archetype: 'EXPRESS_CURIOSITY',
                nextNodeId: 'zara_reflection_gallery',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'insight_art_process',
                text: "How do you translate data into visual form?",
                nextNodeId: 'zara_insight_translation',
                pattern: 'analytical',
                skills: ['technicalLiteracy']
            },
            {
                choiceId: 'insight_art_impact',
                text: "Has the art changed anyone's mind?",
                nextNodeId: 'zara_insight_persuasion',
                pattern: 'helping',
                skills: ['communication']
            }
        ],
        tags: ['zara_arc', 'insight', 'art']
    },

    {
        nodeId: 'zara_insight_translation',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "It's a language translation problem.\n\nData speaks in numbers. Humans understand stories. My job is being the interpreter.\n\nEvery denied loan becomes a pixel. The color encodes the stated reason. The position maps to geography. Suddenly you're not looking at \"3.2% higher denial rate.\" You're looking at a neighborhood painted in rejection.\n\nThe algorithm sees patterns. I make those patterns visible to people who don't speak statistics.\n\nThat's the real skill. Not the coding. The translation. Making the machine's choices legible to the people those choices affect.",
                emotion: 'teaching',
                variation_id: 'insight_translation_v1'
            }
        ],
        choices: [
            {
                choiceId: 'translation_learn',
                text: "Could you teach someone to do this?",
                nextNodeId: 'zara_ideal_curriculum',
                pattern: 'helping',
                skills: ['communication']
            },
            {
                choiceId: 'translation_apply',
                text: "Let's translate the logistics data into something visible.",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['technicalLiteracy'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'insight', 'methodology']
    },

    {
        nodeId: 'zara_insight_persuasion',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Once.\n\nA bank executive. I'd been fighting their lending algorithm for months. Reports, statistics, regulatory citations. Nothing.\n\nThen I made this. Their denial patterns, visualized. I called it \"Redlining Reborn.\"\n\nHe stared at it for five minutes. Didn't say anything. Then he asked: \"Is this what we built?\"\n\nNext week, they hired an external auditor. Full review. Changed three major policies.\n\nOne image did what six months of reports couldn't. Because reports talk to the brain. Art talks to the conscience.",
                emotion: 'vindicated',
                variation_id: 'insight_persuasion_v1',
                richEffectContext: 'success'
            }
        ],
        choices: [
            {
                choiceId: 'persuasion_replicable',
                text: "Can that kind of breakthrough be replicated?",
                nextNodeId: 'zara_insight_replication',
                pattern: 'analytical',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'persuasion_failures',
                text: "What about the times it didn't work?",
                nextNodeId: 'zara_challenge_deaf_ears',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'insight', 'success']
    },

    {
        nodeId: 'zara_insight_replication',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Not reliably. That's the frustrating part.\n\nSome executives look at the same visualization and see \"interesting data presentation.\" They don't feel it. They've insulated themselves so well that even art bounces off.\n\nBut here's what I've learned: you plant seeds. The bank executive? He'd been hearing about algorithmic bias for years. Reading articles. Ignoring reports.\n\nThe art didn't convince him by itself. It was the final straw. The thing that broke through defenses weakened by a thousand smaller truths.\n\nThat's the pattern I've noticed. Ethics work is cumulative. You rarely see the moment it clicks. You just keep planting seeds and hope the soil is changing.",
                emotion: 'philosophical',
                variation_id: 'insight_replication_v1'
            }
        ],
        choices: [
            {
                choiceId: 'replication_patience',
                text: "That takes incredible patience.",
                nextNodeId: 'zara_connection_patience',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'replication_to_vision',
                text: "Cumulative change. That's long-term thinking.",
                nextNodeId: 'zara_vision',
                pattern: 'analytical',
                skills: ['systemsThinking']
            }
        ],
        tags: ['zara_arc', 'insight', 'strategy']
    },

    // ============= CHALLENGE NODES: Decision Points About Algorithmic Bias =============
    {
        nodeId: 'zara_challenge_deaf_ears',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Most of the time.\n\nThe insurance company that called my audit \"theoretical concerns.\" Deployed anyway. Got sued eighteen months later.\n\nThe hiring platform that said my bias report was \"not actionable.\" Their algorithm is still running. Still discriminating.\n\nThe healthcare startup that thanked me for my \"valuable perspective\" and then asked their internal team to \"find a second opinion.\"\n\nWhat do you do when you've done everything right. Documented the harm, showed the evidence, proposed solutions. And they still don't listen?",
                emotion: 'challenging',
                variation_id: 'challenge_deaf_ears_v1'
            }
        ],
        choices: [
            {
                choiceId: 'deaf_escalate',
                text: "Go to regulators. Make it public.",
                nextNodeId: 'zara_challenge_whistleblow',
                pattern: 'building',
                skills: ['integrity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'deaf_document',
                text: "Document everything and leave. Protect yourself.",
                nextNodeId: 'zara_challenge_boundaries',
                pattern: 'patience',
                skills: ['problemSolving']
            },
            {
                choiceId: 'deaf_stay',
                text: "Stay and keep fighting from inside.",
                archetype: 'SHOW_UNDERSTANDING',
                nextNodeId: 'zara_challenge_persistence',
                pattern: 'helping',
                skills: ['resilience']
            }
        ],
        tags: ['zara_arc', 'challenge', 'decision_point']
    },

    {
        nodeId: 'zara_challenge_whistleblow',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "That's the nuclear option. I've thought about it.\n\nWhistleblowing in tech is complicated. NDAs. Arbitration clauses. \"Confidential business information.\"\n\nI know someone who went to the press about a discriminatory algorithm. Got blacklisted. Couldn't find work for two years. Finally got a job at a nonprofit for half her previous salary.\n\nWas she right? Absolutely. Did the company change? Eventually. Did it cost her everything? Almost.\n\nThat's the calculus. How much harm are you willing to suffer to prevent harm to others?\n\nI don't judge anyone's answer to that question. I've been on both sides of it.",
                emotion: 'conflicted',
                variation_id: 'challenge_whistleblow_v1',
                richEffectContext: 'warning'
            }
        ],
        choices: [
            {
                choiceId: 'whistle_your_choice',
                text: "What did you choose? When you had to decide?",
                nextNodeId: 'zara_reflection_choice',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'whistle_protection',
                text: "There should be better protections for people who speak up.",
                nextNodeId: 'zara_vision',
                pattern: 'helping',
                skills: ['systemsThinking']
            }
        ],
        tags: ['zara_arc', 'challenge', 'ethics']
    },

    {
        nodeId: 'zara_challenge_boundaries',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "The self-preservation answer. I don't say that dismissively.\n\nYou can't fight every battle. You can't save every algorithm from itself. Sometimes the healthiest thing is to recognize: I did what I could. This organization isn't ready. Time to go.\n\nI left two companies that way. Documented my concerns, sent them to my personal email, resigned with two weeks notice.\n\nBoth of them had scandals within the year. Both times, I felt... nothing. Not vindication. Not satisfaction. Just exhaustion.\n\nBoundaries aren't defeat. They're survival. You can't audit the world if you burn yourself out on one stubborn CEO.",
                emotion: 'weary_wise',
                variation_id: 'challenge_boundaries_v1'
            }
        ],
        choices: [
            {
                choiceId: 'boundaries_guilt',
                text: "Does the guilt ever catch up with you?",
                nextNodeId: 'zara_reflection_guilt',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'boundaries_next',
                text: "What do you look for in the next organization?",
                nextNodeId: 'zara_connection_red_flags',
                pattern: 'analytical',
                skills: ['systemsThinking']
            }
        ],
        tags: ['zara_arc', 'challenge', 'self_care']
    },

    {
        nodeId: 'zara_challenge_persistence',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "The long game. That's my default too.\n\nBecause organizations change. Leadership turns over. New people come in with different values. The report you wrote three years ago suddenly becomes relevant.\n\nI stayed at one company through three CEOs. The first one ignored my audits. The second one tolerated them. The third one made them mandatory.\n\nChange happens in geological time. You have to be willing to be the fossil that proves the continent moved.\n\nBut staying to fight is not the same as staying and suffering. If they're actively punishing you, if your health is failing, if you've become the scapegoat...\n\nThat's not persistence. That's martyrdom. And martyrs don't file audit reports.",
                emotion: 'determined_teaching',
                variation_id: 'challenge_persistence_v1'
            }
        ],
        choices: [
            {
                choiceId: 'persist_health',
                text: "How do you protect your health while fighting?",
                nextNodeId: 'zara_reflection_selfcare',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'persist_allies',
                text: "Who helps you last that long?",
                nextNodeId: 'zara_connection_support',
                pattern: 'patience',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'challenge', 'resilience']
    },

    {
        nodeId: 'zara_challenge_complicity',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Here's a real one. Right now.\n\nThis algorithm predicts which job applicants will \"stay long-term.\" The company wants to use it to filter resumes.\n\nThe model works. It genuinely predicts retention. But when I looked at the features...\n\nIt's using commute distance. Zip code. Whether the applicant rents or owns.\n\nThose are proxies for wealth. For family obligations. For neighborhood stability shaped by generations of housing discrimination.\n\nIf I approve this, it will systematically filter out single parents, people from low-income areas, recent immigrants.\n\nThe company says: \"It's just predicting who stays.\" I say: \"You're predicting who can afford to stay.\"\n\nWhat would you do?",
                emotion: 'challenging',
                variation_id: 'challenge_complicity_v1',
                richEffectContext: 'thinking'
            }
        ],
        choices: [
            {
                choiceId: 'complicity_reject',
                text: "Reject it. The harm is clear.",
                nextNodeId: 'zara_insight_rejection_cost',
                pattern: 'helping',
                skills: ['integrity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'complicity_modify',
                text: "Can you remove the proxy features and still have a useful model?",
                nextNodeId: 'zara_challenge_modification',
                pattern: 'analytical',
                skills: ['problemSolving']
            },
            {
                choiceId: 'complicity_question',
                text: "Why does the company need this model at all?",
                archetype: 'CHALLENGE_ASSUMPTION',
                nextNodeId: 'zara_insight_root_cause',
                pattern: 'exploring',
                skills: ['criticalThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'challenge', 'decision_point']
    },

    {
        nodeId: 'zara_challenge_modification',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Let's find out.\n\nIf I remove commute distance, zip code, and housing status... the model's accuracy drops from 78% to 52%.\n\nFifty-two percent. Basically a coin flip.\n\nThat's the dirty secret. Often the \"predictive power\" comes entirely from the proxy variables. Remove them and there's nothing left.\n\nWhich means the model was never predicting retention. It was predicting privilege. It just called that \"performance.\"\n\nSo no. We can't \"fix\" this model. We can only expose what it was really doing all along.\n\nThe question is: will the company accept that truth? Or will they shop for an auditor who'll tell them what they want to hear?",
                emotion: 'grim_determined',
                variation_id: 'challenge_modification_v1'
            }
        ],
        choices: [
            {
                choiceId: 'modify_company',
                text: "What will you do if they reject your findings?",
                nextNodeId: 'zara_challenge_deaf_ears',
                pattern: 'patience',
                skills: ['communication']
            },
            {
                choiceId: 'modify_document',
                text: "Document everything. Create a paper trail.",
                nextNodeId: 'zara_handling_resistance',
                pattern: 'building',
                skills: ['problemSolving'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'challenge', 'technical']
    },

    // ============= REFLECTION NODES: Backstory About Art and Activism =============
    {
        nodeId: 'zara_reflection_gallery',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Small galleries, mostly. Community spaces. Places where the affected communities can see themselves reflected.\n\nThere was a show last year at a housing rights nonprofit. \"Algorithmic Redlining: 90 Years of the Same Map.\"\n\nAn elderly woman came up to me afterward. She'd been denied a mortgage in the 1970s. Told it was her \"credit history.\" She looked at my visualization and said: \"So it was never about me. It was always about my address.\"\n\nThat moment. That recognition. That's why I do this.\n\nData scientists talk about \"impact metrics.\" That woman's face is my impact metric.",
                emotion: 'moved',
                variation_id: 'reflection_gallery_v1'
            }
        ],
        choices: [
            {
                choiceId: 'gallery_started',
                text: "How did you start combining art and data?",
                nextNodeId: 'zara_reflection_origins',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'gallery_reaction',
                text: "How does the tech industry react to your art?",
                nextNodeId: 'zara_reflection_industry_reaction',
                pattern: 'patience',
                skills: ['observation']
            }
        ],
        tags: ['zara_arc', 'reflection', 'art']
    },

    {
        nodeId: 'zara_reflection_origins',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "My grandmother.\n\nShe was a calligrapher in Lebanon. Beautiful, intricate Arabic script. She taught me that letters are both meaning and art. Inseparable.\n\nWhen I started working with data, I felt disconnected. Numbers on screens. Spreadsheets. Charts that felt lifeless.\n\nThen I remembered watching her transform words into beauty. Making the meaning visible through the form.\n\nI thought: what if I did that with data? Made the patterns beautiful and terrible at the same time? Made people feel what the numbers mean?\n\nMy first piece was about the triage algorithm. The one that killed Marcus and Delia and James.\n\nI had to see their deaths in a form I could hold. Art was how I processed what I'd been part of.",
                emotion: 'vulnerable_reflective',
                variation_id: 'reflection_origins_v1',
                richEffectContext: 'warning'
            }
        ],
        choices: [
            {
                choiceId: 'origins_grandmother',
                text: "What would your grandmother think of your work?",
                nextNodeId: 'zara_reflection_grandmother',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'origins_first_piece',
                text: "Can I see that first piece?",
                nextNodeId: 'zara_reflection_triage_art',
                pattern: 'patience',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'reflection', 'backstory']
    },

    {
        nodeId: 'zara_reflection_grandmother',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "She died before the triage incident. Sometimes I'm grateful for that. She never had to see me sign off on something that hurt people.\n\nBut I think... I think she'd understand what I'm doing now.\n\nShe used to say that beautiful writing wasn't about showing off. It was about respect. Honoring the words by giving them the form they deserved.\n\nI think she'd see my work the same way. Honoring the data. Honoring the people the data represents.\n\nMaking their stories visible. Making their harm impossible to ignore.\n\nThat's what calligraphy taught me. Every stroke has weight. Every choice leaves a mark. Make them count.",
                emotion: 'tender_resolved',
                variation_id: 'reflection_grandmother_v1'
            }
        ],
        choices: [
            {
                choiceId: 'grandmother_to_vision',
                text: "She'd be proud of you, Zara.",
                nextNodeId: 'zara_vision',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'grandmother_to_work',
                text: "Show me the work you're most proud of.",
                nextNodeId: 'zara_insight_art_data',
                pattern: 'exploring',
                skills: ['curiosity']
            }
        ],
        tags: ['zara_arc', 'reflection', 'family']
    },

    {
        nodeId: 'zara_reflection_triage_art',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I call it \"Three of Fourteen.\"\n\nEvery dot is a patient who went through the triage algorithm. Red for deprioritized. Blue for prioritized.\n\nThese three. Marcus, Delia, James. They're the ones who died. The spiral tracks the decision path that led to their placement in the queue.\n\nYou can see it. The algorithm didn't make one bad decision. It made a thousand small ones that accumulated into something fatal.\n\nI show this at talks sometimes. People always focus on the three dots. But the real story is the pattern around them.\n\nHarm isn't a single moment. It's a system. This piece is my attempt to make that visible.",
                emotion: 'haunted_determined',
                variation_id: 'reflection_triage_art_v1',
                richEffectContext: 'warning'
            }
        ],
        choices: [
            {
                choiceId: 'triage_art_public',
                text: "Do the families know about this piece?",
                nextNodeId: 'zara_reflection_families',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'triage_art_healing',
                text: "Does making art help you process what happened?",
                nextNodeId: 'zara_reflection_healing',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            }
        ],
        tags: ['zara_arc', 'reflection', 'art', 'vulnerability']
    },

    {
        nodeId: 'zara_reflection_families',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I sent it to them. After the lawsuit settled.\n\nDelia's daughter wrote back. Said she'd never been able to explain to her kids why grandma didn't get better. Now she had something to show them.\n\n\"The computer made a mistake.\" That's what she tells them. Simpler than the truth. Kinder.\n\nMarcus's wife never responded. I don't blame her. I was part of the system that killed her husband. Art doesn't fix that.\n\nJames's brother came to a gallery showing. Stood in front of the piece for twenty minutes. Didn't say a word. Just witnessed it.\n\nThat's all I can offer. Not redemption. Just visibility. Proof that their loss was real and the harm was systemic.\n\nSometimes that's enough. Sometimes it isn't.",
                emotion: 'raw_humble',
                variation_id: 'reflection_families_v1'
            }
        ],
        choices: [
            {
                choiceId: 'families_to_farewell',
                text: "Thank you for sharing this, Zara. It can't be easy.",
                nextNodeId: 'zara_farewell',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'families_keep_going',
                text: "What keeps you going after all that?",
                nextNodeId: 'zara_moving_forward',
                pattern: 'helping',
                skills: ['communication']
            }
        ],
        tags: ['zara_arc', 'reflection', 'vulnerability']
    },

    {
        nodeId: 'zara_reflection_healing',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "\"Healing\" is a generous word.\n\nThe art doesn't heal. It witnesses. It holds space for what happened.\n\nWhen I'm making something, I'm not thinking about redemption or forgiveness. I'm thinking about truth. About getting the shape of it right.\n\nThere's something almost meditative about it. The data stops being painful and starts being material. Something I can shape instead of something that shapes me.\n\nBut then I finish, and the weight comes back. And I make another piece. And another.\n\nMaybe that's the only kind of healing I get. Not moving past it. Just learning to carry it in a form I can hold.",
                emotion: 'contemplative',
                variation_id: 'reflection_healing_v1'
            }
        ],
        choices: [
            {
                choiceId: 'healing_healthy',
                text: "That sounds exhausting. How do you take care of yourself?",
                nextNodeId: 'zara_reflection_selfcare',
                pattern: 'helping',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'healing_purpose',
                text: "The art serves a purpose. That has to count for something.",
                nextNodeId: 'zara_vision',
                pattern: 'patience',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'reflection', 'self']
    },

    {
        nodeId: 'zara_reflection_selfcare',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "I'm not great at that.\n\nTherapy. Every other week. Non-negotiable now. Should have started years ago.\n\nI deleted all work apps from my phone. After I found myself auditing datasets at 2 AM in bed, I knew something had to change.\n\nNature helps. There's a park near my apartment. I walk there when the algorithms get too loud in my head.\n\nAnd I have people. Not many. But a few who understand this work. Who I can call when I'm drowning in despair about the industry.\n\nSelf-care isn't optional in this field. It's survival. If you burn out, the algorithms win by default.\n\nI learned that the hard way. After the triage incident, I didn't sleep properly for a year. Thought I could just push through.\n\nYou can't. The body keeps score.",
                emotion: 'honest_teaching',
                variation_id: 'reflection_selfcare_v1'
            }
        ],
        choices: [
            {
                choiceId: 'selfcare_support',
                text: "Tell me about your support network.",
                nextNodeId: 'zara_connection_support',
                pattern: 'helping',
                skills: ['communication']
            },
            {
                choiceId: 'selfcare_advice',
                text: "What advice would you give someone entering this field?",
                nextNodeId: 'zara_advice',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'reflection', 'self_care']
    },

    {
        nodeId: 'zara_reflection_choice',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Both. At different times.\n\nThe triage algorithm. I stayed. Fought internally. Documented. When the lawsuit happened, I was a witness. My records helped the families' case.\n\nBut there was another time. A surveillance company. Facial recognition for law enforcement.\n\nI saw where it was going. The bias testing I'd done showed massive error rates for darker skin tones. They didn't care. \"Police are the customer, not the public.\"\n\nI left. Took everything I could prove. Gave it to a journalist friend.\n\nThey ran the story. The company denied everything. Nothing changed.\n\nBut I could sleep at night. Barely.\n\nSometimes that's the best you get.",
                emotion: 'honest_heavy',
                variation_id: 'reflection_choice_v1',
                richEffectContext: 'warning'
            }
        ],
        choices: [
            {
                choiceId: 'choice_regret',
                text: "Do you regret how either situation turned out?",
                nextNodeId: 'zara_reflection_guilt',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'choice_surveillance',
                text: "Is that surveillance system still running?",
                nextNodeId: 'zara_insight_root_cause',
                pattern: 'analytical',
                skills: ['systemsThinking']
            }
        ],
        tags: ['zara_arc', 'reflection', 'backstory']
    },

    {
        nodeId: 'zara_reflection_guilt',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Every day.\n\nWith the triage algorithm. I regret not fighting harder. Not going public earlier. Not trusting my gut when I first saw the bias in the training data.\n\nWith the surveillance company. I regret not trying harder to change things from inside. Maybe I gave up too easily. Maybe I could have slowed the deployment.\n\nThat's the trap, right? You can always find something to regret. Some choice you could have made differently.\n\nBut here's what I've learned: regret is useful exactly once. It teaches you something. After that, it's just weight.\n\nI use the guilt as fuel. Every audit I do is partly atonement. But I refuse to drown in it.\n\nSome days are harder than others.",
                emotion: 'honest_resolved',
                variation_id: 'reflection_guilt_v1'
            }
        ],
        choices: [
            {
                choiceId: 'guilt_fuel',
                text: "Guilt as fuel. That's a hard way to live.",
                nextNodeId: 'zara_connection_understanding',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'guilt_forward',
                text: "The work you're doing now... it matters.",
                nextNodeId: 'zara_vision',
                pattern: 'helping',
                skills: ['communication']
            }
        ],
        tags: ['zara_arc', 'reflection', 'vulnerability']
    },

    {
        nodeId: 'zara_reflection_industry_reaction',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Mixed.\n\nThe ethics crowd loves it. \"Art as activism.\" They share it at conferences. Write about the intersection of aesthetics and accountability.\n\nThe business crowd ignores it. Or dismisses it as \"emotional\" rather than \"data-driven.\" As if data doesn't encode emotion. Just not the emotions of the people harmed.\n\nA few executives have gotten angry. One told me I was \"weaponizing art against innovation.\"\n\nI said: \"I'm weaponizing truth against harm. Art is just the delivery mechanism.\"\n\nThe tech industry wants ethics to be comfortable. Quiet. Internal memos and checkbox compliance.\n\nMy art makes ethics uncomfortable. Public. Impossible to ignore.\n\nThat's the point.",
                emotion: 'defiant',
                variation_id: 'reflection_industry_v1'
            }
        ],
        choices: [
            {
                choiceId: 'industry_brave',
                text: "That takes courage.",
                nextNodeId: 'zara_connection_courage',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'industry_cost',
                text: "What has it cost you professionally?",
                nextNodeId: 'zara_handling_resistance',
                pattern: 'analytical',
                skills: ['observation']
            }
        ],
        tags: ['zara_arc', 'reflection', 'industry']
    },

    // ============= CONNECTION NODES: Relationship Building with Player =============
    {
        nodeId: 'zara_connection_patience',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You noticed that.\n\nMost people ask about metrics. Results. Impact.\n\nYou asked about patience. The human cost.\n\nEthics work is a marathon. Decades. No finish line.\n\nThank you. For seeing the long game.",
                emotion: 'grateful_connected',
                interaction: 'nod',
                variation_id: 'connection_patience_v1'
            }
        ],
        choices: [
            {
                choiceId: 'patience_together',
                text: "You don't have to run alone.",
                nextNodeId: 'zara_connection_support',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'patience_teach',
                text: "How do you teach patience to new people in the field?",
                nextNodeId: 'zara_advice',
                pattern: 'exploring',
                skills: ['communication']
            }
        ],
        tags: ['zara_arc', 'connection', 'relationship']
    },

    {
        nodeId: 'zara_connection_support',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Three people.\n\nTherapist. Keeps me functional.\n\nPriya. Civil rights lawyer. Fights the same battles in courtrooms.\n\nMy sister. Veterinarian. Calls every Sunday.\n\nYou need people who pull you back. That's survival strategy.",
                emotion: 'open_honest',
                variation_id: 'connection_support_v1'
            }
        ],
        choices: [
            {
                choiceId: 'support_now',
                text: "Can I be one of those people? Someone who sees this work matters?",
                nextNodeId: 'zara_connection_acceptance',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'support_priya',
                text: "Tell me more about Priya's work.",
                nextNodeId: 'zara_vision',
                pattern: 'exploring',
                skills: ['curiosity']
            }
        ],
        tags: ['zara_arc', 'connection', 'support']
    },

    {
        nodeId: 'zara_connection_acceptance',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Most people treat ethics work like a news story. Five minutes, then gone.\n\nYou stayed. Asked real questions.\n\nYes. I'd like that.\n\nBasement office. Bad lighting. Spreadsheets everywhere.\n\nYou're part of the network now.",
                emotion: 'moved_connected',
                interaction: 'bloom',
                variation_id: 'connection_acceptance_v1'
            }
        ],
        choices: [
            {
                choiceId: 'acceptance_promise',
                text: "I'll remember what you taught me. The people algorithms affect.",
                voiceVariations: {
                    analytical: "I'll apply what you taught me. The data represents people.",
                    helping: "I'll carry this forward. The people algorithms affect.",
                    building: "I'll build with this in mind. The people algorithms affect.",
                    exploring: "This changes how I see it all. The people algorithms affect.",
                    patience: "I won't forget. The people algorithms affect."
                },
                nextNodeId: 'zara_farewell',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        onEnter: [
            {
                characterId: 'zara',
                addKnowledgeFlags: ['zara_connection_established', 'zara_network_member']
            }
        ],
        tags: ['zara_arc', 'connection', 'resolution']
    },

    {
        nodeId: 'zara_connection_red_flags',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Three interview questions.\n\n\"What's your ethics review process?\" Confusion is a red flag.\n\n\"When did you not ship something for ethical reasons?\" No answer means problems.\n\n\"Who on your team has said no to a project?\"\n\nFind companies with institutionalized skepticism, not compliance.",
                emotion: 'teaching_strategic',
                variation_id: 'connection_red_flags_v1'
            }
        ],
        choices: [
            {
                choiceId: 'red_flags_experience',
                text: "Have you found many companies that pass those tests?",
                nextNodeId: 'zara_adoption_progress',
                pattern: 'analytical',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'red_flags_current',
                text: "Does your current organization pass?",
                nextNodeId: 'zara_vision',
                pattern: 'exploring',
                skills: ['curiosity'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'connection', 'career']
    },

    {
        nodeId: 'zara_connection_courage',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Not courage. Guilt.\n\nAfter the triage algorithm, I couldn't be quiet anymore. The cost of silence was bodies.\n\nReal courage would have been speaking up before the deaths.\n\nWhat I do now is penance.\n\nBut thank you. Maybe you see something I can't.",
                emotion: 'humble_honest',
                variation_id: 'connection_courage_v1'
            }
        ],
        choices: [
            {
                choiceId: 'courage_see',
                text: "I see someone who chooses to fight every day. That's courage.",
                nextNodeId: 'zara_connection_acceptance',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2
                }
            },
            {
                choiceId: 'courage_forward',
                text: "Whatever drives you... it's making a difference.",
                nextNodeId: 'zara_vision',
                pattern: 'patience',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'connection', 'vulnerability']
    },

    {
        nodeId: 'zara_connection_understanding',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "You get it.\n\nMost people pity me or admire me. Neither is right.\n\nYou just sat with it. Didn't make it smaller or bigger.\n\nThat's rare. Witnessing without lifting. Without making it about yourself.\n\nThank you. For understanding.",
                emotion: 'connected_grateful',
                interaction: 'small',
                variation_id: 'connection_understanding_v1'
            }
        ],
        choices: [
            {
                choiceId: 'understanding_mutual',
                text: "You've given me a lot to think about too, Zara.",
                nextNodeId: 'zara_farewell',
                pattern: 'patience',
                skills: ['communication'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            },
            {
                choiceId: 'understanding_more',
                text: "I want to understand more. Your work, your art, everything.",
                nextNodeId: 'zara_insight_art_data',
                pattern: 'exploring',
                skills: ['curiosity']
            }
        ],
        tags: ['zara_arc', 'connection', 'mutual']
    },

    // ============= ADDITIONAL SUPPORTING NODES =============
    {
        nodeId: 'zara_insight_rejection_cost',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "That's the right call. Here's what happens next.\n\nI write the rejection. Product pushes back. \"Q3 targets.\" Escalation. VP. Sometimes CEO.\n\nI hold the line. Documentation. Legal risk. Visualizations.\n\nI've been fired for this. Demoted twice.\n\nBut I've stopped a dozen harmful deployments. No credit for invisible prevention. But the math works out.",
                emotion: 'resolute_honest',
                variation_id: 'insight_rejection_v1'
            }
        ],
        choices: [
            {
                choiceId: 'rejection_line',
                text: "How do you know when it's worth losing the job?",
                nextNodeId: 'zara_her_line',
                pattern: 'patience',
                skills: ['emotionalIntelligence']
            },
            {
                choiceId: 'rejection_to_vision',
                text: "Prevention is the goal. Even when invisible.",
                nextNodeId: 'zara_vision',
                pattern: 'analytical',
                skills: ['systemsThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'insight', 'consequence']
    },

    {
        nodeId: 'zara_insight_root_cause',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "That's the question I wish more people asked.\n\nWhy high turnover? Low wages. Bad management. No advancement.\n\nA prediction model treats the symptom. Working conditions are the disease.\n\nBuying an algorithm is easy. Ship it in a quarter. Blame the model when it fails.\n\nRoot cause analysis is political. Who benefits from not solving the real problem?",
                emotion: 'teaching_fierce',
                variation_id: 'insight_root_cause_v1',
                richEffectContext: 'thinking'
            }
        ],
        choices: [
            {
                choiceId: 'root_push',
                text: "Do you ever push for the root cause solution?",
                nextNodeId: 'zara_adoption_challenge',
                pattern: 'analytical',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'root_audit',
                text: "Can we at least make sure this model doesn't make things worse?",
                nextNodeId: 'zara_simulation_setup',
                pattern: 'building',
                skills: ['problemSolving'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ],
        tags: ['zara_arc', 'insight', 'systems']
    },
    // ============= ARC 5: THE SHADOW WAR =============
    {
        nodeId: 'zara_signal_discovery',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Look at this frequency. 405 THz. That's not station telemetry. It's carrying data.\n\nIt's encrypted. But look at the packet headers. 'Archive_Null'. Someone is siphoning passenger memories before they even reach the core.",
                emotion: 'alarmed',
                variation_id: 'signal_discovery_v1'
            }
        ],
        choices: [
            {
                choiceId: 'signal_confirm',
                text: "Can we trace the source?",
                nextNodeId: 'zara_encryption_break',
                pattern: 'analytical',
                skills: ['systemsThinking']
            },
            {
                choiceId: 'signal_moral',
                text: "Stealing memories? That's a violation of everything the station stands for.",
                nextNodeId: 'zara_encryption_break',
                pattern: 'helping',
                skills: ['integrity', 'emotionalIntelligence']
            }
        ],
        tags: ['shadow_war_arc', 'start']
    },
    {
        nodeId: 'zara_encryption_break',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "The encryption is old. Pre-Station. Military grade?\n\nCan't break it with brute force. It's designed to dissolve if forced. We need a key. Or a trap.\n\nIf we feed it a fake memory. Something inconsistent. The system might choke on the validation logic. Reveal its IP.",
                emotion: 'calculating',
                variation_id: 'encryption_break_v1'
            }
        ],
        choices: [
            {
                choiceId: 'trap_construct',
                text: "Let's build a paradox. A memory that couldn't exist.",
                nextNodeId: 'zara_broker_trap',
                pattern: 'building',
                skills: ['creativity', 'criticalThinking'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 1
                }
            }
        ]
    },
    {
        nodeId: 'zara_broker_trap',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "It's taking the bait. Processing...\n\nGot you. Level 9. Maintenance Sector 4. The server isn't physical. It's biological? Routing through the hydroponics control system?",
                emotion: 'shocked',
                variation_id: 'broker_trap_v1'
            }
        ],
        choices: [
            {
                choiceId: 'broker_confront',
                text: "Shut it down.",
                nextNodeId: 'shadow_broker_confrontation',
                pattern: 'building',
                skills: ['leadership']
            }
        ]
    },
    {
        nodeId: 'shadow_broker_confrontation',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "It's fighting back. Trying to delete me from the payroll system? Cute.\n\nDone. The node is isolated. The stolen memories? Encrypted garbage now. Nobody can read them. Not even us.\n\nWe didn't catch the Broker. But we burned down their shop.",
                emotion: 'triumphant',
                variation_id: 'confrontation_v1'
            }
        ],
        choices: [
            {
                choiceId: 'war_end',
                text: "Good work. We'll be ready if they come back.",
                nextNodeId: 'zara_hub_return', // Loop back to hub or similar
                pattern: 'helping',
                consequence: {
                    addGlobalFlags: ['shadow_broker_exposed'],
                    trustChange: 2
                }
            }
        ],
        tags: ['shadow_war_arc', 'end']
    },

    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'zara_mystery_hint',
        speaker: 'zara',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I study how algorithms shape human behavior. Usually, it's manipulative. Surveillance capitalism, attention hijacking.\\n\\nBut whatever algorithm runs this place? It's... <shake>kind</shake>.",
                emotion: 'surprised',
                variation_id: 'mystery_hint_v1'
            },
            {
                text: "It brings people together without exploiting them. I didn't think that was possible.",
                emotion: 'hopeful',
                variation_id: 'mystery_hint_v2'
            }
        ],
        choices: [
            {
                choiceId: 'zara_mystery_dig',
                text: "What makes it different?",
                nextNodeId: 'zara_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'zara_mystery_feel',
                text: "Maybe because it serves us, not the other way around.",
                nextNodeId: 'zara_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'zara_mystery_response',
        speaker: 'zara',
        content: [
            {
                text: "It optimizes for connection, not engagement. For growth, not addiction.\\n\\nImagine if all technology worked that way. This station gives me hope that it's possible.",
                emotion: 'inspired',
                variation_id: 'mystery_response_v1'
            }
        ],
        onEnter: [
            { characterId: 'zara', addKnowledgeFlags: ['zara_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'zara_mystery_return',
                text: "Maybe you'll build something like it someday.",
                nextNodeId: 'zara_hub_return',
                pattern: 'building'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'zara_hub_return',
        speaker: 'zara',
        content: [{
            text: "Maybe I will. With the right data.\\n\\nSpeaking of data, did you need something?",
            emotion: 'focused',
            variation_id: 'hub_return_v1'
        }],
        choices: []
    },

    // ============= TRUST RECOVERY =============
    {
        nodeId: 'zara_trust_recovery',
        speaker: 'Zara El-Amin',
        requiredState: {
            trust: { max: 3 }
        },
        content: [
            {
                text: "[She's staring at a blank spreadsheet. Column headers. No data.]\n\nI ran the audit again.\n\nEvery dataset. Every model. Looking for the bias I missed.\n\nThe data looked clean.\n\nJust like it did three years ago.\n\nJust like it did before I signed the approval.\n\nBefore fourteen people paid for what I couldn't see.",
                emotion: 'haunted_guilty',
                variation_id: 'trust_recovery_v1',
                voiceVariations: {
                    patience: "[She's staring at a blank spreadsheet. Not rushing to fill it.]\n\nYou came back.\n\nI ran the audit again. Every dataset. Every model.\n\nThe data looked clean.\n\nJust like it did three years ago.\n\nJust like it did before I signed the approval.\n\nBefore fourteen people paid for what I couldn't see.",
                    helping: "[She's staring at a blank spreadsheet alone. Column headers. No data.]\n\nYou came back. Even after I...\n\nI ran the audit again. Looking for the bias I missed.\n\nThe data looked clean.\n\nJust like it did before I signed.\n\nBefore fourteen people paid for what I couldn't see.",
                    analytical: "[She's staring at a blank spreadsheet. The formulas all return errors.]\n\nYou came back. To verify the damage.\n\nI ran the audit again. Every query. Every correlation.\n\nThe data looked clean.\n\nJust like it did three years ago.\n\nJust like it did before I approved the deployment.\n\nBefore fourteen people paid for what I couldn't see.",
                    building: "[She's staring at a blank spreadsheet. The structure empty.]\n\nYou came back. To reconstruct what I broke.\n\nI ran the audit again. Every model. Every pipeline.\n\nThe data looked clean.\n\nJust like it did before I signed.\n\nBefore fourteen people paid for what I couldn't see.",
                    exploring: "[She's staring at a blank spreadsheet. No patterns to discover.]\n\nYou came back. Still looking.\n\nI ran the audit again. Searching for the bias I missed.\n\nThe data looked clean.\n\nJust like it did three years ago.\n\nJust like it did before I approved it.\n\nBefore fourteen people paid for what I couldn't see."
                }
            }
        ],
        choices: [
            {
                choiceId: 'zara_recovery_fourteen',
                text: "You can't audit yourself into forgiveness. But you can honor the fourteen by never missing it again.",
                nextNodeId: 'zara_trust_restored',
                pattern: 'helping',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2,
                    addKnowledgeFlags: ['zara_trust_repaired']
                }
            },
            {
                choiceId: 'zara_recovery_data',
                text: "The data isn't the problem. You're looking for bias in numbers when the bias is in the looking.",
                nextNodeId: 'zara_trust_restored',
                pattern: 'analytical',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2,
                    addKnowledgeFlags: ['zara_trust_repaired']
                }
            },
            {
                choiceId: 'zara_recovery_silence',
                text: "[Sit with her. Let the blank spreadsheet be what it is. Sometimes absence is the data.]",
                nextNodeId: 'zara_trust_restored',
                pattern: 'patience',
                skills: ['emotionalIntelligence'],
                consequence: {
                    characterId: 'zara',
                    trustChange: 2,
                    addKnowledgeFlags: ['zara_trust_repaired']
                }
            }
        ],
        tags: ['zara_arc', 'trust_recovery', 'vulnerability']
    },

    {
        nodeId: 'zara_trust_restored',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "[She closes the spreadsheet. Looks at her hands instead.]\n\nNumbers don't lie.\n\nBut the people who gather them do.\n\nAnd the people who read them.\n\nAnd the people who carry them.\n\n[She looks at you.]\n\nThank you. For seeing what the data couldn't show.",
                emotion: 'grateful_relieved',
                variation_id: 'trust_restored_v1',
                interaction: 'bloom'
            }
        ],
        choices: [
            {
                choiceId: 'zara_restored_continue',
                text: "(Continue)",
                nextNodeId: 'zara_hub_return'
            }
        ],
        tags: ['zara_arc', 'trust_recovery', 'restored']
    },

    // ===== SKILL COMBO UNLOCK NODE: Ethical Analyst =====
    // Requires: ethical_analyst combo (criticalThinking + ethicalReasoning)
    {
        nodeId: 'zara_deep_ethics',
        speaker: 'Zara El-Amin',
        requiredState: {
            requiredCombos: ['ethical_analyst']
        },
        content: [{
            text: "You've got something rare.\n\nYou don't just question the data. You question who it serves.\n\nThat's the marriage that actually changes things—rigor without cruelty, moral clarity without self-righteousness. You analyze systems AND you understand the humans inside them.\n\nThat's an ethical analyst. Not a rule-follower pretending to be principled. Someone who actually sees the whole picture.",
            emotion: 'thoughtful',
            variation_id: 'deep_ethics_v1'
        }],
        choices: [
            {
                choiceId: 'ethics_how_learn',
                text: "How do you keep the analysis and the ethics balanced?",
                nextNodeId: 'zara_ethics_advocacy',
                pattern: 'exploring',
                skills: ['criticalThinking', 'ethicalReasoning']
            },
            {
                choiceId: 'ethics_apply_framework',
                text: "I want to build audits that actually protect people.",
                nextNodeId: 'zara_deep_dive',
                pattern: 'building',
                skills: ['systemsThinking', 'ethicalReasoning']
            }
        ],
        tags: ['skill_combo_unlock', 'ethical_analyst', 'zara_wisdom']
    }
]

export const zaraEntryPoints = {
    INTRODUCTION: 'zara_introduction',
    METHODOLOGY: 'zara_audit_methodology',
    VULNERABILITY: 'zara_vulnerability_arc',
    SHADOW_WAR: 'zara_signal_discovery',
    MYSTERY_HINT: 'zara_mystery_hint'
} as const

export const zaraDialogueGraph: DialogueGraph = {
    version: '1.0.0',
    nodes: new Map(zaraDialogueNodes.map(node => [node.nodeId, node])),
    startNodeId: zaraEntryPoints.INTRODUCTION,
    metadata: {
        title: "Zara's Data Audit",
        author: 'Guided Generation',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: zaraDialogueNodes.length,
        totalChoices: zaraDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
    }
}
