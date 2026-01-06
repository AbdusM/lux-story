import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const zaraDialogueNodes: DialogueNode[] = [
    // ============= INTRODUCTION =============
    {
        nodeId: 'zara_introduction',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Numbers don't lie. But the people who gather them do.\n\n[She scrolls through a waterfall of spreadsheet rows on a vertical monitor.]\n\n\"Look at this,\" she points. \"The 'Efficiency Algorithm' for the new logistics fleet. It's flagging 40% of the routes as 'sub-optimal'. Do you know why?\"",
                emotion: 'analytical',
                variation_id: 'intro_v1',
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "Numbers don't lie. But the people who gather them do.\n\n[She scrolls through spreadsheet rows.]\n\n\"Look at this.\" She notices your focused attention. \"You're actually reading the data, not just watching me scroll. Good.\n\nThe algorithm is flagging 40% of routes as 'sub-optimal'. Care to hypothesize why?\"", altEmotion: 'interested' },
                    { pattern: 'exploring', minLevel: 4, altText: "Numbers don't lie. But the people who gather them do.\n\n[She scrolls through data.]\n\n\"You're curious.\" She catches your eye. \"Most people's eyes glaze over at spreadsheets. You're actually looking for something.\n\nThis algorithm is flagging 40% of routes as 'sub-optimal'. Want to dig into why?\"", altEmotion: 'intrigued' },
                    { pattern: 'helping', minLevel: 4, altText: "Numbers don't lie. But the people who gather them do.\n\n[She scrolls through data, looking tired.]\n\n\"You stopped.\" She glances at you. \"Most people walk right past data work. You look like you want to understand.\n\nThis algorithm is flagging 40% of routes. It's going to hurt real people. Do you know why?\"", altEmotion: 'hopeful' }
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
                text: "Maybe they ARE sub-optimal. Efficiency is key.",
                nextNodeId: 'zara_challenge_efficiency',
                pattern: 'building',
                skills: ['systemsThinking']
            }
        ],
        tags: ['introduction', 'zara_arc']
    },

    {
        nodeId: 'zara_explains_bias',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't eat. Drones don't rest. Applying drone metrics to human drivers isn't just 'optimizing', it's breaking them.\n\nI need to clean this dataset before the rollout. Want to help?",
                emotion: 'determined',
                variation_id: 'bias_v1',
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't eat. You see the logical flaw, don't you?\n\nApplying drone metrics to human drivers isn't optimization—it's a category error.\n\nI need to clean this dataset. You think systematically. Want to help?", altEmotion: 'energized' },
                    { pattern: 'helping', minLevel: 4, altText: "Because they stop for lunch.\n\nThe algorithm was trained on drone data. Drones don't rest. But humans need breaks.\n\n*Her voice tightens.*\n\nThis is going to hurt real drivers. Real families. I can see you care about that.\n\nWant to help me fix it?", altEmotion: 'urgent' }
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
                    { pattern: 'patience', minLevel: 4, altText: "Efficiency at what cost?\n\n*She pauses, noticing your calm.*\n\nYou understand that some things can't be rushed. If you optimize for speed alone, you lose resilience.\n\nTake a look at the data. Tell me what you see.", altEmotion: 'receptive' }
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
                variation_id: 'sim_success_v1'
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
                text: "Wait—I want to understand more about what you do.",
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
                text: `*She stops scrolling. Looks at you.*

*Pause.*

Most people in tech don't want to hear this. They want clean datasets and fast deployments. They don't want someone slowing them down with "ethics concerns."

*Tired smile.*

You're the first person today who hasn't said "just ship it."

*Quieter.*

Sometimes I wonder if anyone cares. If it's just me in this basement, fighting invisible wars in spreadsheets.

Thank you. For making me feel like it matters.`,
                emotion: 'vulnerable_grateful',
                variation_id: 'interrupt_encouragement_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_from_interrupt',
                text: "The people those algorithms affect—they care.",
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
                text: `*She closes the spreadsheet. Stares at the blank screen.*

You asked why I do this. Why I spend nights in basements hunting for bias in datasets.

*Pause.*

Three years ago. I was a junior analyst at a healthcare company. We built a triage algorithm. It ranked patients by "urgency." The dataset looked clean.

*Voice drops.*

I signed off on it. We deployed to twelve hospitals.

*Hands shake slightly.*

Six months later, the study came back. The algorithm was systematically deprioritizing patients from low-income zip codes. Classifying them as "low urgency" even with the same symptoms.

*Bitter laugh.*

We thought we were making healthcare more efficient. We were making it more biased.

*Looks at you.*

Fourteen patients. Delayed treatment. Three didn't make it.

And I signed the deployment approval.`,
                emotion: 'haunted_guilty',
                variation_id: 'vulnerability_v1',
                richEffectContext: 'warning'
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
                text: `*She wipes her eyes.*

I could have left the industry. Gone to law school. Something without... blood on the spreadsheets.

*Quiet.*

But that would let the same thing happen again. With a different analyst. A different "clean dataset."

*Looks at the logistics data.*

So I stay in the basement. I hunt the bias. Every model I audit, every dataset I scrub—it's penance. And prevention.

*Small, fierce determination.*

This logistics algorithm? It's not going to hurt anyone. Not on my watch.

*Turns back to the screen.*

Because I know what "just ship it" really costs. I've counted the bodies.

Now let's find what this one is hiding.`,
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
                text: `*She pulls up a diagram on her second monitor.*

Want to know how I hunt bias? Most people think it's just statistics. It's not.

*Points at the flowchart.*

Step one: Question the question. What was the model built to optimize? Efficiency? Cost? Speed? Every optimization has a trade-off. Something gets sacrificed.

Step two: Follow the training data. Who collected it? What did they measure? What did they NOT measure?

*Leans back.*

The triage algorithm? It optimized for "urgency indicators." But the training data came from hospitals where low-income patients were already being undertreated. We taught the model to replicate existing bias, then called it "objective."`,
                emotion: 'teaching',
                variation_id: 'methodology_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_method_step_three',
                text: "What's step three?",
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
                text: `Step three: Test the failures.

*She pulls up a scatter plot.*

When the model gets it wrong, who suffers? If errors cluster around certain zip codes, certain demographics, certain income levels—that's not random noise. That's systemic.

*Taps the screen.*

An "85% accuracy rate" sounds great. Until you realize the 15% who get hurt all look the same.

*Quiet.*

Step four: Ask who's not in the room. The people most affected by these algorithms are rarely the ones building them. Or auditing them.

*Looks at you.*

I try to be their voice. Even when it slows the deployment. Even when it makes me unpopular.`,
                emotion: 'determined',
                variation_id: 'step_three_v1',
                patternReflection: [
                    { pattern: 'analytical', minLevel: 4, altText: "Step three: Test the failures.\n\n*She pulls up a scatter plot.*\n\nYou think like this too, don't you? Looking for where the model breaks, not just where it works.\n\nWhen errors cluster around certain demographics—that's not noise. That's signal.\n\n*Nods at you.*\n\nYou'd be good at this work. You already ask the right questions.", altEmotion: 'knowing' }
                ]
            }
        ],
        choices: [
            {
                choiceId: 'zara_step_three_voice',
                text: "That's advocacy, not just analysis.",
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
                text: `*She pauses. Something shifts in her expression.*

Yeah. It is.

*Quiet.*

I used to think I could be neutral. Just follow the data. Let the numbers speak.

*Bitter laugh.*

Numbers don't speak. They're ventriloquized. Someone chose what to measure, how to weight it, what to ignore.

*Looks at her hands.*

So now I'm explicit about it. I advocate for the people the algorithm affects. That's not bias in my audit—that's the whole point of the audit.

*Meets your eyes.*

If you don't ask "who gets hurt?", you're not doing ethics. You're doing math.`,
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
                text: `*Sharp laugh.*

Most programs? One elective. Maybe. "Ethics in AI." Usually taught by someone who's never shipped a production model.

*Stands up, paces.*

They teach you to build. They don't teach you to question. They don't teach you to slow down and ask: should this exist?

*Stops.*

I learned ethics the hard way. In post-mortems. In lawsuits. In obituaries.

*Quiet.*

That's why I'm pushing for curriculum changes. Every data science student should have to audit a real system. See where it breaks. Feel the weight of "oops, we didn't think of that."

*Looks at you.*

Because by the time you're signing deployment approvals, it's too late to start caring.`,
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
                text: `*She stops pacing. Looks at you.*

*Long pause.*

You know... most people in this industry? They hear "ethics" and their eyes glaze over. They want to ship. They want to move fast.

*Voice softens.*

You actually listened. You didn't try to argue that efficiency matters more. You didn't tell me I'm being paranoid.

*Sits back down.*

Sometimes I feel like I'm screaming into the void. That nobody cares about the people these systems affect.

*Quiet.*

Thank you. For caring.

*Takes a breath.*

Okay. Let me show you what this audit actually looks like.`,
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
                text: `*She leans back, thinking.*

I started in statistics. Pure numbers. Then I got a job at a fintech startup and saw how models affected real loan decisions.

*Counts on fingers.*

First: Learn to code. Not just tutorials—build something real. Then break it. See where it fails.

Second: Study the failures. Read about Amazon's hiring algorithm that penalized women. Facebook's housing ads that excluded minorities. Learn what went wrong.

Third: Talk to affected communities. Not about them—to them. The people algorithms target know things the data doesn't show.

*Looks at you.*

Fourth: Find your line. What won't you build? What won't you ship? Because if you don't draw that line before the pressure hits, you'll cross it.

I didn't draw mine until it was too late.`,
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
                text: `*Long silence.*

I don't sign off on anything that touches healthcare, criminal justice, or housing without independent review. Period.

*Stands, walks to the window.*

Even if it delays the project. Even if it costs the contract. Even if they call me difficult.

*Turns back.*

And I audit for proxy discrimination. ZIP codes that correlate with race. Names that correlate with gender. "Neutral" variables that encode exactly what the law says you can't use.

*Quiet.*

My line is: would I be able to look the affected person in the eye and explain why this model made this decision about their life?

If I can't explain it, I can't ship it.`,
                emotion: 'resolute',
                variation_id: 'her_line_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_line_proxy',
                text: "Proxy discrimination—can you give me an example?",
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

    {
        nodeId: 'zara_proxy_example',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: `*She pulls up a dataset visualization.*

Here's a real one. Redlining.

In the 1930s, banks literally drew red lines around Black neighborhoods. Said those areas were "too risky" for mortgages.

*Points at the screen.*

That's illegal now. You can't deny a loan based on race. But you know what you CAN use? ZIP code.

*Cynical smile.*

And wouldn't you know it—ZIP codes correlate almost perfectly with the old redlined areas. Different input, same output. Plausible deniability.

*Quiet.*

The algorithm isn't racist. It's just "predicting risk." Using a variable that happens to encode seventy years of housing discrimination.

That's proxy discrimination. And it's everywhere.`,
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
                text: `*She opens a new window, runs some code.*

Multiple methods. None perfect.

*Types rapidly.*

Disparate impact analysis: Does the model's output differ significantly across protected groups? Even if race isn't an input, do outcomes cluster by race?

Feature importance: Which variables are driving decisions? If ZIP code is doing most of the work, that's a red flag.

Counterfactual testing: What happens if you change just the ZIP code? If the prediction flips, that variable has too much power.

*Leans back.*

But here's the hard part—sometimes the proxy IS predictive. ZIP code might genuinely correlate with risk. The question is: should we use knowledge that's only available because of historical injustice?

*Looks at you.*

That's not a math problem. That's a philosophy problem.`,
                emotion: 'analytical',
                variation_id: 'detection_v1',
                patternReflection: [
                    { pattern: 'analytical', minLevel: 5, altText: "*She opens a new window, runs some code.*\n\nYou already know most of this, don't you?\n\nDisparate impact. Feature importance. Counterfactual testing.\n\n*Types rapidly.*\n\nBut here's where it gets interesting—\n\n*Looks at you.*\n\nThe technical detection is actually the easy part. The hard part is what to do with what you find. That's philosophy, not statistics.\n\nAnd I think you get that.", altEmotion: 'respectful' }
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
                text: `*She's quiet for a long moment.*

My answer? Don't perpetuate injustice, even if it's "statistically valid."

*Stands, paces.*

If ZIP code correlates with risk only because of redlining, then using ZIP code launders historical discrimination into modern decisions.

The math might be right. The ethics are wrong.

*Stops.*

Some people call that "leaving accuracy on the table." I call it not automating oppression.

*Looks at you.*

You want to know what keeps me up at night? Not the obvious bias. It's the subtle kind. The kind that's technically defensible but morally bankrupt.

*Quiet.*

The triage algorithm was subtle. The patients it deprioritized had legitimate "low urgency" scores. The model was accurate. It just... encoded a world where their symptoms already meant less.`,
                emotion: 'haunted_resolved',
                variation_id: 'philosophy_v1'
            }
        ],
        choices: [
            {
                choiceId: 'zara_philosophy_weight',
                text: "You carry that. The three who didn't make it.",
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
                text: `*Her hands shake slightly. She grips the desk edge.*

You want to know their names?

*Voice drops.*

Marcus. Forty-seven. Construction worker. Came in with chest pain. Algorithm scored him "moderate." Wait time: four hours. Heart attack in the waiting room.

*Pause.*

Delia. Sixty-two. Cleaning staff at a hotel. Shortness of breath. "Low urgency." Sent home. Pulmonary embolism killed her two days later.

*Quiet.*

James. Twenty-nine. Line cook. Abdominal pain. The algorithm saw young, male, low-income ZIP code. "Likely drug-seeking." It was appendicitis. It ruptured.

*Looks at you.*

I didn't kill them. The algorithm didn't kill them. But we all played a part in a system that told them their pain mattered less.

That's what I audit against now. Not just accuracy. Dignity.`,
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
                text: "[Hold the weight of their names. Don't try to comfort—just witness.]",
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
                text: `*She looks at you. Really looks.*

*Long silence.*

*Her eyes are wet but she doesn't look away.*

You didn't try to fix it. Didn't say "it wasn't your fault" or "you couldn't have known."

*Quiet.*

People always want to make it better. But some things aren't meant to be better. They're meant to be carried.

*Wipes her eyes.*

Thank you. For just... being here with it.

*Takes a breath.*

That's what good data ethics looks like, actually. Sitting with the weight. Not rushing to solutions. Understanding what's at stake before you build.

*Small, tired smile.*

You'd make a good auditor.`,
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
                text: `*She nods slowly.*

I've been developing a framework. "Human Dignity Impact Assessment."

*Pulls up a document.*

Before any high-stakes algorithm deploys, it has to answer five questions:

1. Who could this harm? Not "users"—specific populations.
2. Can they appeal the decision? Is there a human in the loop?
3. Does it encode historical injustice? Check for proxy discrimination.
4. Who benefits from the optimization? Follow the money.
5. Would the affected population consent to this use of their data?

*Looks at you.*

It's not perfect. But it's better than "accuracy goes brrr."

*Quiet.*

I'm trying to get it adopted as an industry standard. Uphill battle. But what else am I going to do with this guilt?`,
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
                text: `*She sighs heavily.*

Convincing companies? That's the whole job.

*Leans back.*

Money talks. So I frame it as risk mitigation. "This framework prevents lawsuits before they happen." "This audit protects your brand from discrimination scandals."

*Cynical laugh.*

I'd rather say "do this because it's right." But executives don't respond to that.

*Quiet.*

Some companies get it. Usually after a PR disaster. They call me in to "fix their culture." I tell them: the culture isn't the problem. The incentives are.

*Looks at you.*

As long as "ship fast" is rewarded and "ship carefully" is punished, ethics will always be an afterthought.

*Fierce.*

So I push for structural changes. Ethics review in the deployment pipeline. Not optional. Mandatory.

The trick is making it so inconvenient to skip that doing the right thing becomes the path of least resistance.`,
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
                text: `*Small smile.*

Two companies. Both after scandals.

*Counts.*

A fintech startup—after their lending algorithm got profiled in the news for denying loans to minority neighborhoods. Now I audit every model before deployment.

A healthcare company—after a patient sued over an AI misdiagnosis. They hired me to build an ethics review board.

*Quiet.*

Progress happens. Just... slowly. Usually after harm.

*Looks at the ceiling.*

I dream of a world where companies adopt this before the scandal. Where ethics is proactive, not reactive.

*Looks at you.*

But I'll take what I can get. Every audit I do, every framework I install—it's one more barrier between algorithms and harm.

*Determined.*

The goal isn't perfection. It's friction. Make it harder to hurt people by accident.`,
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
                text: `*She laughs, but there's no humor in it.*

Pushback? Oh, I get pushback.

*Counts on fingers.*

"You're slowing down innovation." "Competitors will beat us to market." "This is just theoretical concern." "The model is 95% accurate, what more do you want?"

*Crosses arms.*

My favorite: "You're not a real data scientist, you're a data cop."

*Quiet.*

I've been passed over for promotion twice. "Not a team player." Translation: I won't rubber-stamp deployments.

*Looks at the screen.*

But here's what I've learned: document everything. Build alliances with legal and compliance—they understand liability. Frame it as risk management, not ethics.

*Bitter smile.*

Executives don't care about dignity. They care about lawsuits.`,
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
                text: `*Long pause.*

*She looks at the ceiling.*

Ask me on a good day, I'll say yes. The work matters. Someone has to do it.

*Quiet.*

Ask me at 2 AM when I'm reviewing another "urgent" deployment and my phone keeps buzzing with Slack messages asking why I haven't approved yet...

*Shakes head.*

I think about quitting. A lot. Going to a non-profit. Teaching. Something where the stakes aren't life and death.

*Looks at you.*

But then I remember: if I leave, who replaces me? Someone who'll rubber-stamp everything? Someone who never learned what "just ship it" really costs?

*Fierce.*

No. I stay. I fight. I slow things down enough for someone to think.

*Quieter.*

That has to be worth something. Even if my career doesn't think so.`,
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
                text: `*She looks at you. Something softens.*

Speed bump. I like that.

*Small laugh.*

Most people call me a roadblock. A bottleneck. "The Compliance Karen."

*Quiet.*

But speed bumps have a purpose. They exist in places where speed kills.

*Looks at her screens.*

School zones. Hospital parking lots. Near playgrounds.

*Meets your eyes.*

High-stakes AI is a school zone. People pretend it isn't. They want to gun the engine because they're late for a meeting.

*Fierce.*

I'm the speed bump. I make them slow down long enough to see the kid in the crosswalk.

*Stands taller.*

Yeah. I can live with that.`,
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
                text: `*She pulls up some meeting notes.*

Real community engagement, not performance.

*Reads.*

After the triage disaster, I started reaching out. Not surveys—actual conversations. With patients. With nurses. With people who'd been affected by algorithmic decisions.

*Quiet.*

You know what they told me? They could feel when the system was working against them. Before anyone confirmed it.

*Looks at you.*

The woman denied for housing knew the algorithm was biased before the audit proved it. She'd been denied by "objective" systems her whole life.

*Fierce.*

These communities aren't data points. They're experts. They've been studying algorithmic bias through lived experience longer than any academic.

*Sits back.*

Now I don't audit anything high-stakes without community review. Slows everything down. Worth it.`,
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
                text: `*She stares at her hands.*

Some days I don't.

*Quiet.*

Some days I sit in my car before coming into work. Wondering if any of it matters. If I'm just delaying the inevitable.

*Looks up.*

But then I think about the algorithms I've stopped. The deployments I've blocked. The harm that didn't happen because someone asked "who gets hurt?"

*Fierce.*

Three people died because of a model I approved. I can't change that. But maybe—maybe—I've saved three others by catching what I catch now.

*Quieter.*

I'll never know for sure. That's the hardest part. The harm is visible. The prevention is invisible.

*Small smile.*

But I have to believe it matters. Or I can't do this work.`,
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
                text: `*She thinks carefully.*

Depends.

Sometimes you can fix it. Remove the proxy variable. Retrain on different data. Add fairness constraints to the optimization.

*But.*

Sometimes the problem is the question itself. "Predict who's likely to default on a loan" encodes centuries of financial exclusion. No amount of debiasing makes it fair.

*Looks at you.*

In those cases? You refuse. Or you redesign the whole system.

*Quiet.*

The triage algorithm? We could have removed ZIP code. But the whole approach—ranking human urgency by proxy signals—was broken from the start.

*Fierce.*

The right answer was: hire more nurses. Not: build a better sorting machine for scarcity we chose to create.

*Sits back.*

But that's a policy answer. And data scientists don't make policy. We just build the tools that let policy-makers pretend their hands are clean.`,
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
                text: `*She leans forward.*

We can refuse to build weapons and call them "tools."

*Counts.*

We can ask hard questions before the first line of code. Who wants this? Why? What happens when it breaks?

We can document our objections. Create paper trails. Make it harder to claim "nobody could have predicted."

We can slow things down. Every delay is time for someone to think.

*Looks at you.*

We can teach. Every junior analyst I train, I tell them: your first job isn't to build. It's to understand what you're building for.

*Quiet.*

And we can leave. When the organization won't change. When the harm is clear and the leadership doesn't care.

*Fierce.*

Leaving is an option. Your skills have value. Don't let them make you complicit because you're afraid of unemployment.

*Sits back.*

That's what I should have done, three years ago. Before I signed that deployment approval.`,
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
                text: `*Long pause.*

Because I owed them.

*Quiet.*

Marcus, Delia, James. I couldn't bring them back. But I could stay in the industry and fight to make sure it didn't happen again.

*Looks at the ceiling.*

Leaving would have been easier. Clean break. New identity. "Ex-data scientist turned ethics consultant."

*Shakes head.*

But that felt like running. Like I was trying to wash the blood off my hands by changing professions.

*Meets your eyes.*

So I stayed. In the basement. Auditing algorithms. Being the "difficult" one.

*Quiet.*

Penance doesn't work if it's comfortable.

*Small, tired smile.*

Besides... someone has to do this. And now I know exactly what the stakes are.`,
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
                text: `*She stands, looks at the city lights through the window.*

My vision?

*Quiet.*

Every high-stakes algorithm requires an ethics audit before deployment. Not optional. Not "if there's time." Mandatory.

Community review boards with real power. Not advisory—binding. If affected communities say no, the algorithm doesn't ship.

*Turns back.*

Liability that sticks. When an algorithm causes harm, someone signs for it. Not "the model." A person.

*Fierce.*

And education that matters. Every computer science student learns about Delia and Marcus and James. Learns that "move fast and break things" means breaking people.

*Looks at you.*

It sounds utopian. But so did seatbelts, once.

Someone has to imagine the world where this is normal. Where algorithmic harm is as unthinkable as cars without brakes.

*Quiet determination.*

That's what I'm building. One audit at a time.`,
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
                text: `*She thinks carefully.*

Learn the technical stuff. Really learn it. You can't audit what you don't understand.

*Looks at you.*

But don't let the math make you feel neutral. Every model is a mirror of who built it and what they valued.

*Counts.*

Find your community. Other ethics-focused data people exist. We're just... quiet. Outnumbered. Find us.

Draw your line before you need it. Know what you won't build before the pressure hits.

*Quiet.*

And remember: you can always leave. Your skills are valuable. Don't let anyone convince you that complicity is the price of employment.

*Meets your eyes.*

The industry will try to make you comfortable with harm. Small compromises. "Just this once." "It's not that bad."

Don't let them. Once you start, it's hard to stop.

*Fierce.*

Ask every day: can I look the affected person in the eye? If the answer is no, that's your sign.`,
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
                text: `*She looks at you for a long moment.*

*Small, real smile.*

You listened. Really listened. Most people tune out when I start talking about bias and audits and... the heavy stuff.

*Turns back to her screens.*

I've got more datasets to scrub. More algorithms to slow down. The work never stops.

*Looks over her shoulder.*

But this helped. Talking to someone who gets it. Who doesn't think I'm paranoid or difficult.

*Quiet.*

Take care of yourself. And if you ever build something that touches people's lives...

*Fierce.*

Remember Marcus. Delia. James.

Remember that "ship it" has a body count.

*Nods.*

Now go. Build something that makes the world less cruel.`,
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
                text: `*She freezes.*

*Looks at you.*

*Her eyes are bright.*

*Long pause.*

...Thank you.

*Voice catches.*

Nobody's ever said that before. Everyone just... nods and leaves and goes back to their sprint planning and their velocity metrics.

*Wipes her eye quickly.*

I'll hold you to it. The promise.

*Small, fierce smile.*

Now I have a witness. Someone who knows. If I ever give up, if I ever "just ship it"—you'll know.

*Straightens.*

That's accountability. That's what this industry needs.

*Nods.*

Go. Build something worthy of that promise.

And if you ever need someone to audit it... you know where to find me.`,
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

    // ============= ADDITIONAL BRANCHING NODES =============
    {
        nodeId: 'zara_building_alliances',
        speaker: 'Zara El-Amin',
        content: [
            {
                text: `*She nods.*

Legal, first. They understand risk. Frame it as "potential liability exposure" and suddenly everyone listens.

*Counts.*

Compliance. They have audit checklists. Get ethics questions onto those checklists.

PR and Communications. They care about reputation. "Algorithm discrimination lawsuit" makes them very cooperative.

*Looks at you.*

And find the engineers who care. They exist. Usually quiet. Usually outnumbered. But when you need someone to slow a deployment, one concerned engineer can create weeks of "technical review."

*Small smile.*

It's politics. I hate that. But it's how change happens. You build coalitions. You make ethics everyone's problem.

*Quiet.*

The alternative is being the lone voice in the wilderness. That's how you burn out.`,
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
                text: `*She pulls out a notebook—actual paper, covered in handwriting.*

I've been drafting this. "Ethics for Builders."

*Reads.*

Week 1: Case studies. Amazon's biased hiring. COMPAS sentencing. Facebook housing discrimination. Make it visceral.

Week 2: Technical detection. How to find bias in models. Hands-on auditing.

Week 3: Community engagement. Students interview people affected by algorithmic decisions.

Week 4: System design. How to build with ethics from the start, not bolted on.

Week 5: Advocacy. How to say no. How to document concerns. How to build alliances.

*Looks up.*

Week 6: Personal ethics. Students write their own code of conduct. What they will and won't build.

*Quiet.*

No one graduates without knowing what "just ship it" really costs.

*Fierce.*

That's the curriculum. Now I just need... anyone to adopt it.`,
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
                text: `*Bitter laugh.*

Three universities. Two boot camps. One corporate training program.

*Counts.*

"Interesting but impractical." "Students need job skills, not philosophy." "We don't have room in the curriculum."

*Shakes head.*

One department head told me: "If we teach ethics too much, students might not want to work in the industry."

*Looks at you.*

Like that's a bad thing.

*Quiet.*

I'm not giving up. I'm just... regrouping. Maybe a workshop series instead. Something that doesn't need institutional buy-in.

*Fierce.*

The students who care will find it. And maybe that's enough. Change the people, eventually change the industry.`,
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
                text: `*She opens a folder.*

Structured listening sessions. Not focus groups—those are extractive.

*Reads.*

First: compensate people for their time. Their expertise is worth money.

Second: let them lead. I ask "what do you want me to understand?" not "answer these survey questions."

Third: share power. They review the audit before it's final. They can veto conclusions they think are wrong.

*Looks up.*

Fourth: follow up. Tell them what changed because of what they said. Close the loop.

*Quiet.*

Most "community engagement" is performance. Check a box, write a report, move on.

This is different. This is... partnership.

*Fierce.*

The communities affected by algorithms deserve to shape how those algorithms are evaluated. Not just be "consulted."`,
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
                text: `*She nods slowly.*

Tech loves to "disrupt" and "move fast" and "democratize access."

*Cynical.*

But share actual decision-making power? Let affected communities say no? That's... uncomfortable.

*Quiet.*

There's this myth that engineers are neutral. That technology is objective. That we're just building tools, not making choices.

*Looks at you.*

But every algorithm encodes choices. Whose voice matters. Whose time is valued. Whose risk is acceptable.

*Fierce.*

If we're going to make those choices for communities, the least we can do is let them in the room when we make them.

*Sits back.*

That's not radical. That's just... basic respect. But in tech, it feels revolutionary.`,
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
                text: `*She sighs.*

Honestly? No. Not for everything.

*Shakes head.*

The logistics algorithm we're auditing? It affects thousands of drivers. Full community engagement would take months.

*Quiet.*

But that's the point. Some things should take months. Some decisions are important enough to be slow.

*Looks at you.*

Right now, the industry treats speed as the default. "Ship fast, fix later."

*Fierce.*

I want to flip that. Slow is the default for high-stakes systems. You want to go fast? Prove it won't hurt anyone.

*Sits back.*

Is that practical? Maybe not. But neither are seatbelts, if your only metric is "how fast can we get there."

Sometimes the right answer is: slow down. Take the time. Get it right.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She pulls up something unexpected on her screen—a colorful, abstract visualization.*

You know what this is?

*Traces the swirling patterns.*

It's a bias map. I made it. The algorithm I audited last month—I turned its discrimination patterns into art.

*Quiet.*

Red clusters are denial rates by neighborhood. Blue is approval. See how the red bleeds into exactly the same boundaries as the 1935 redlining maps?

*Looks at you.*

Art makes the invisible visible. Data tells you there's bias. Art makes you feel it.

*Fierce.*

That's why I do both. The spreadsheet convinces the lawyers. The art convinces the humans.`,
                emotion: 'passionate',
                variation_id: 'insight_art_v1',
                richEffectContext: 'thinking'
            }
        ],
        choices: [
            {
                choiceId: 'insight_art_more',
                text: "Where do you show this work?",
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
        characterId: 'zara',
        content: [
            {
                text: `*She opens a processing script alongside the visualization.*

It's a language translation problem.

*Points at code.*

Data speaks in numbers. Humans understand stories. My job is being the interpreter.

*Scrolls through.*

Every denied loan becomes a pixel. The color encodes the stated reason. The position maps to geography. Suddenly you're not looking at "3.2% higher denial rate"—you're looking at a neighborhood painted in rejection.

*Quiet.*

The algorithm sees patterns. I make those patterns visible to people who don't speak statistics.

*Looks at you.*

That's the real skill. Not the coding. The translation. Making the machine's choices legible to the people those choices affect.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She pauses. Something flickers across her face.*

Once.

*Quiet.*

A bank executive. I'd been fighting their lending algorithm for months. Reports, statistics, regulatory citations. Nothing.

*Pulls up an image.*

Then I made this. Their denial patterns, visualized. I called it "Redlining Reborn."

*Looks at the ceiling.*

He stared at it for five minutes. Didn't say anything. Then he asked: "Is this what we built?"

*Fierce.*

Next week, they hired an external auditor. Full review. Changed three major policies.

*Turns to you.*

One image did what six months of reports couldn't. Because reports talk to the brain. Art talks to the conscience.`,
                emotion: 'vindicated',
                variation_id: 'insight_persuasion_v1',
                richEffectContext: 'revelation'
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
        characterId: 'zara',
        content: [
            {
                text: `*She shakes her head slowly.*

Not reliably. That's the frustrating part.

*Leans back.*

Some executives look at the same visualization and see "interesting data presentation." They don't feel it. They've insulated themselves so well that even art bounces off.

*Quiet.*

But here's what I've learned: you plant seeds. The bank executive? He'd been hearing about algorithmic bias for years. Reading articles. Ignoring reports.

*Fierce.*

The art didn't convince him by itself. It was the final straw. The thing that broke through defenses weakened by a thousand smaller truths.

*Looks at you.*

That's the pattern I've noticed. Ethics work is cumulative. You rarely see the moment it clicks. You just keep planting seeds and hope the soil is changing.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*Her expression hardens.*

Most of the time.

*Counts on fingers.*

The insurance company that called my audit "theoretical concerns." Deployed anyway. Got sued eighteen months later.

The hiring platform that said my bias report was "not actionable." Their algorithm is still running. Still discriminating.

*Quiet.*

The healthcare startup that thanked me for my "valuable perspective" and then asked their internal team to "find a second opinion."

*Looks at you directly.*

What do you do when you've done everything right—documented the harm, showed the evidence, proposed solutions—and they still don't listen?

*Waits.*`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She nods slowly.*

That's the nuclear option. I've thought about it.

*Quiet.*

Whistleblowing in tech is... complicated. NDAs. Arbitration clauses. "Confidential business information."

*Looks at her hands.*

I know someone who went to the press about a discriminatory algorithm. Got blacklisted. Couldn't find work for two years. Finally got a job at a nonprofit for half her previous salary.

*Fierce.*

Was she right? Absolutely. Did the company change? Eventually. Did it cost her everything? Almost.

*Turns to you.*

That's the calculus. How much harm are you willing to suffer to prevent harm to others?

I don't judge anyone's answer to that question. I've been on both sides of it.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She exhales.*

The self-preservation answer. I don't say that dismissively.

*Quiet.*

You can't fight every battle. You can't save every algorithm from itself. Sometimes the healthiest thing is to recognize: I did what I could. This organization isn't ready. Time to go.

*Looks at the ceiling.*

I left two companies that way. Documented my concerns, sent them to my personal email, resigned with two weeks notice.

*Fierce.*

Both of them had scandals within the year. Both times, I felt... nothing. Not vindication. Not satisfaction. Just exhaustion.

*Turns to you.*

Boundaries aren't defeat. They're survival. You can't audit the world if you burn yourself out on one stubborn CEO.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*Something fierce lights in her eyes.*

The long game. That's my default too.

*Leans forward.*

Because organizations change. Leadership turns over. New people come in with different values. The report you wrote three years ago suddenly becomes relevant.

*Quiet.*

I stayed at one company through three CEOs. The first one ignored my audits. The second one tolerated them. The third one made them mandatory.

*Looks at you.*

Change happens in geological time. You have to be willing to be the fossil that proves the continent moved.

*Fierce.*

But—and this is important—staying to fight is not the same as staying and suffering. If they're actively punishing you, if your health is failing, if you've become the scapegoat...

*Shakes head.*

That's not persistence. That's martyrdom. And martyrs don't file audit reports.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She pulls up a dataset on her screen.*

Here's a real one. Right now.

*Points.*

This algorithm predicts which job applicants will "stay long-term." The company wants to use it to filter resumes.

*Quiet.*

The model works. It genuinely predicts retention. But when I looked at the features...

*Turns to you.*

It's using commute distance. Zip code. Whether the applicant rents or owns.

*Fierce.*

Those are proxies for wealth. For family obligations. For neighborhood stability—which is itself shaped by generations of housing discrimination.

*Leans back.*

If I approve this, it will systematically filter out single parents, people from low-income areas, recent immigrants.

*Looks at you directly.*

The company says: "It's just predicting who stays." I say: "You're predicting who can afford to stay."

What would you do?`,
                emotion: 'challenging',
                variation_id: 'challenge_complicity_v1',
                richEffectContext: 'decision'
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
        characterId: 'zara',
        content: [
            {
                text: `*She runs some code.*

Let's find out.

*Watches the output.*

If I remove commute distance, zip code, and housing status... the model's accuracy drops from 78% to 52%.

*Looks at you.*

Fifty-two percent. Basically a coin flip.

*Quiet.*

That's the dirty secret. Often the "predictive power" comes entirely from the proxy variables. Remove them and there's nothing left.

*Fierce.*

Which means the model was never predicting retention. It was predicting privilege. It just called that "performance."

*Sits back.*

So no. We can't "fix" this model. We can only expose what it was really doing all along.

The question is: will the company accept that truth? Or will they shop for an auditor who'll tell them what they want to hear?`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She opens a folder of images.*

Small galleries, mostly. Community spaces. Places where the affected communities can see themselves reflected.

*Scrolls through.*

There was a show last year at a housing rights nonprofit. "Algorithmic Redlining: 90 Years of the Same Map."

*Quiet.*

An elderly woman came up to me afterward. She'd been denied a mortgage in the 1970s. Told it was her "credit history." She looked at my visualization and said: "So it was never about me. It was always about my address."

*Eyes bright.*

That moment. That recognition. That's why I do this.

*Fierce.*

Data scientists talk about "impact metrics." That woman's face is my impact metric.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She looks at her hands.*

My grandmother.

*Quiet.*

She was a calligrapher in Lebanon. Beautiful, intricate Arabic script. She taught me that letters are both meaning and art—inseparable.

*Stands, walks to the window.*

When I started working with data, I felt... disconnected. Numbers on screens. Spreadsheets. Charts that felt lifeless.

*Turns back.*

Then I remembered watching her transform words into beauty. Making the meaning visible through the form.

*Fierce.*

I thought: what if I did that with data? What if I made the patterns beautiful and terrible at the same time? Made people feel what the numbers mean?

*Quiet.*

My first piece was about the triage algorithm. The one that killed Marcus and Delia and James.

*Eyes wet.*

I had to see their deaths in a form I could hold. Art was how I processed what I'd been part of.`,
                emotion: 'vulnerable_reflective',
                variation_id: 'reflection_origins_v1',
                richEffectContext: 'memory'
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
        characterId: 'zara',
        content: [
            {
                text: `*She's quiet for a long moment.*

*When she speaks, her voice is thick.*

She died before the triage incident. Sometimes I'm grateful for that. She never had to see me sign off on something that hurt people.

*Wipes her eye.*

But I think... I think she'd understand what I'm doing now.

*Looks at the ceiling.*

She used to say that beautiful writing wasn't about showing off. It was about respect. Honoring the words by giving them the form they deserved.

*Turns to you.*

I think she'd see my work the same way. Honoring the data. Honoring the people the data represents.

*Fierce.*

Making their stories visible. Making their harm impossible to ignore.

*Quiet.*

That's what calligraphy taught me. Every stroke has weight. Every choice leaves a mark. Make them count.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She hesitates. Then opens a file.*

*A visualization appears—a spiral of red and blue dots, with three larger points glowing at the center.*

I call it "Three of Fourteen."

*Quiet.*

Every dot is a patient who went through the triage algorithm. Red for deprioritized. Blue for prioritized.

*Points.*

These three—Marcus, Delia, James—they're the ones who died. The spiral tracks the decision path that led to their placement in the queue.

*Voice drops.*

You can see it. The algorithm didn't make one bad decision. It made a thousand small ones that accumulated into something fatal.

*Looks at you.*

I show this at talks sometimes. People always focus on the three dots. But the real story is the pattern around them.

*Fierce.*

Harm isn't a single moment. It's a system. This piece is my attempt to make that visible.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She nods slowly.*

I sent it to them. After the lawsuit settled.

*Quiet.*

Delia's daughter wrote back. Said she'd never been able to explain to her kids why grandma didn't get better. Now she had something to show them.

*Voice catches.*

"The computer made a mistake." That's what she tells them. Simpler than the truth. Kinder.

*Wipes her eye.*

Marcus's wife never responded. I don't blame her. I was part of the system that killed her husband. Art doesn't fix that.

*Looks at you.*

James's brother came to a gallery showing. Stood in front of the piece for twenty minutes. Didn't say a word. Just... witnessed it.

*Fierce.*

That's all I can offer. Not redemption. Just visibility. Proof that their loss was real and the harm was systemic.

Sometimes that's enough. Sometimes it isn't.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She's quiet.*

"Healing" is a generous word.

*Looks at the triage visualization still on screen.*

The art doesn't heal. It witnesses. It holds space for what happened.

*Stands, paces.*

When I'm making something, I'm not thinking about redemption or forgiveness. I'm thinking about truth. About getting the shape of it right.

*Turns back.*

There's something almost meditative about it. The data stops being painful and starts being... material. Something I can shape instead of something that shapes me.

*Quiet.*

But then I finish, and the weight comes back. And I make another piece. And another.

*Small, tired smile.*

Maybe that's the only kind of healing I get. Not moving past it. Just learning to carry it in a form I can hold.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She laughs—a little ruefully.*

I'm... not great at that.

*Counts.*

Therapy. Every other week. Non-negotiable now. Should have started years ago.

*Quiet.*

I deleted all work apps from my phone. After I found myself auditing datasets at 2 AM in bed, I knew something had to change.

*Looks at the ceiling.*

Nature helps. There's a park near my apartment. I walk there when the algorithms get too loud in my head.

*Turns to you.*

And I have people. Not many. But a few who understand this work. Who I can call when I'm drowning in despair about the industry.

*Fierce.*

Self-care isn't optional in this field. It's survival. If you burn out, the algorithms win by default.

*Quiet.*

I learned that the hard way. After the triage incident, I didn't sleep properly for a year. Thought I could just... push through.

You can't. The body keeps score.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She's silent for a long moment.*

*Then:*

Both. At different times.

*Quiet.*

The triage algorithm—I stayed. Fought internally. Documented. When the lawsuit happened, I was a witness. My records helped the families' case.

*Looks at the floor.*

But there was another time. A surveillance company. Facial recognition for law enforcement.

*Meets your eyes.*

I saw where it was going. The bias testing I'd done showed massive error rates for darker skin tones. They didn't care. "Police are the customer, not the public."

*Fierce.*

I left. Took everything I could prove. Gave it to a journalist friend.

*Quiet.*

They ran the story. The company denied everything. Nothing changed.

*Shrugs.*

But I could sleep at night. Barely.

Sometimes that's the best you get.`,
                emotion: 'honest_heavy',
                variation_id: 'reflection_choice_v1',
                richEffectContext: 'memory'
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
        characterId: 'zara',
        content: [
            {
                text: `*She doesn't answer right away.*

*Sits back down. Folds her hands.*

Every day.

*Quiet.*

With the triage algorithm—I regret not fighting harder. Not going public earlier. Not trusting my gut when I first saw the bias in the training data.

*Looks at the ceiling.*

With the surveillance company—I regret not trying harder to change things from inside. Maybe I gave up too easily. Maybe I could have slowed the deployment.

*Turns to you.*

That's the trap, right? You can always find something to regret. Some choice you could have made differently.

*Fierce.*

But here's what I've learned: regret is useful exactly once. It teaches you something. After that, it's just weight.

*Quiet.*

I use the guilt as fuel. Every audit I do is partly atonement. But I refuse to drown in it.

*Small smile.*

Some days are harder than others.`,
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
                text: "The work you're doing now—it matters.",
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
        characterId: 'zara',
        content: [
            {
                text: `*She snorts.*

Mixed.

*Counts.*

The ethics crowd loves it. "Art as activism." They share it at conferences. Write about the intersection of aesthetics and accountability.

*Cynical.*

The business crowd ignores it. Or dismisses it as "emotional" rather than "data-driven." As if data doesn't encode emotion—just not the emotions of the people harmed.

*Quiet.*

A few executives have gotten angry. One told me I was "weaponizing art against innovation."

*Fierce.*

I said: "I'm weaponizing truth against harm. Art is just the delivery mechanism."

*Looks at you.*

The tech industry wants ethics to be comfortable. Quiet. Internal memos and checkbox compliance.

*Shakes head.*

My art makes ethics uncomfortable. Public. Impossible to ignore.

That's the point.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She looks at you with something like recognition.*

You noticed that.

*Quiet.*

Most people hear about this work and ask about results. Metrics. Impact. "How do you measure success?"

*Shakes head.*

You asked about patience. About endurance. About the human cost of doing this for years.

*Leans forward.*

That's... rare. In tech especially. Everyone wants to sprint. Move fast, break things. Solve problems in one deployment cycle.

*Fierce.*

But ethics work is a marathon measured in decades. You don't see the finish line. You just keep running.

*Softer.*

It helps to talk to someone who gets that. Who doesn't expect quick wins or viral moments.

*Looks at you.*

Thank you. For seeing the long game.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She's quiet for a moment.*

Three people.

*Counts.*

My therapist. Obviously. She keeps me functional.

*Small smile.*

My friend Priya—she's a civil rights lawyer. We met at a conference about algorithmic discrimination in lending. She fights the same battles in courtrooms that I fight in code.

*Softer.*

And my sister. She doesn't understand any of this—she's a veterinarian—but she calls every Sunday. Makes sure I'm eating. Reminds me that life exists outside the basement.

*Looks at you.*

You need people who see you as more than your work. Who value your existence, not just your output.

*Fierce.*

The industry will consume you if you let it. Having people who pull you back... that's not weakness. That's survival strategy.

*Quiet.*

I didn't have that, after the triage incident. Almost didn't survive it. Learned the hard way.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She freezes.*

*Then something in her expression shifts.*

*Her eyes are bright.*

I...

*Long pause.*

You know, most people treat ethics work like a news story. Interesting for five minutes, then on to the next thing.

*Voice quieter.*

You stayed. You asked real questions. You didn't try to fix me or optimize me or tell me to "look on the bright side."

*Wipes her eye quickly.*

Yes. Yeah. I'd... I'd like that.

*Straightens.*

If you ever need someone to audit an algorithm, or talk through a hard choice, or just... understand why data ethics matters...

*Small, real smile.*

You know where to find me. Basement office. Bad fluorescent lighting. Spreadsheets everywhere.

*Fierce and gentle at once.*

You're part of the network now. That means something.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She pulls out a mental checklist.*

When interviewing, I ask three questions.

*Counts.*

First: "What's the ethics review process for new models?" If they look confused or say "we move fast," that's a red flag.

*Nods.*

Second: "Tell me about a time you didn't ship something because of ethical concerns." If they can't name one, either they've never had concerns or they shipped anyway. Both are bad.

*Fierce.*

Third: "Who on your team has ever said no to a project?"

*Looks at you.*

That's the real question. Does this company have people who push back? Do they still work there?

*Quiet.*

The best companies have institutionalized skepticism. The worst have institutionalized compliance.

Find the difference before you sign the offer letter.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She shakes her head.*

Not courage. Guilt.

*Quiet.*

After the triage algorithm, I couldn't be quiet anymore. The cost of silence was too high. I'd already paid it in bodies.

*Looks at her hands.*

Making public art, being "the ethics person," burning bridges with executives—none of that feels brave. It feels necessary.

*Turns to you.*

Real courage would have been speaking up before the deaths. Before the lawsuit. When I first saw the bias in the training data.

*Fierce.*

What I do now isn't courage. It's penance. Making sure I can never be silent again.

*Softer.*

But thank you. For saying that. It's nice to believe, some days, that what I do is more than just guilt management.

*Small smile.*

Maybe you see something I can't.`,
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
                text: "Whatever drives you—it's making a difference.",
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
        characterId: 'zara',
        content: [
            {
                text: `*She looks at you for a long moment.*

You get it.

*Quiet.*

Most people, when I talk about this work, they either pity me or admire me. Neither one is right.

*Shakes head.*

You just... sat with it. Didn't try to make it smaller or bigger than it is.

*Leans forward.*

That's rare. The ability to witness someone's weight without trying to lift it for them. Without making it about yourself.

*Softer.*

I spend so much time in data. Abstractions. Patterns. Sometimes I forget what it's like to be seen as a person, not a role.

*Meets your eyes.*

Thank you. For that. For just... understanding.

*Small, real smile.*

I don't know what you're going to do with your life. But I hope you keep this. The ability to be present. It matters more than you know.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She nods.*

That's the right call. But here's what happens next.

*Counts.*

I write up the rejection. Detailed. Documented. No ambiguity about why.

The product team pushes back. "We need this for Q3 targets." "Competitors are using similar models."

*Quiet.*

Then escalation. The VP gets involved. Sometimes the CEO.

*Looks at you.*

And I hold the line. With documentation. With legal risk analysis. With visualizations of the harm.

*Fierce.*

I've been fired once for this. "Culture fit" issues. I've been demoted twice. "Not a team player."

*Sits back.*

But I've also stopped a dozen harmful deployments. Hundreds of thousands of people who weren't discriminated against by algorithms I refused to approve.

*Quiet.*

You don't get credit for invisible prevention. But the math works out.`,
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
        characterId: 'zara',
        content: [
            {
                text: `*She pauses. A smile spreads slowly.*

Now that's the question I wish more people asked.

*Leans forward.*

They want a retention prediction model because they have high turnover. But why do they have high turnover?

*Counts.*

Low wages. Bad management. No advancement paths. Inflexible scheduling.

*Fierce.*

Building a model to predict who'll leave is treating the symptom. The disease is the working conditions.

*Quiet.*

They could spend this budget on paying people better. On training managers. On creating cultures people want to stay in.

*Looks at you.*

But that's hard. Systemic. Takes years.

Buying an algorithm is easy. Ship it in a quarter. Blame the model when it fails.

*Sits back.*

Root cause analysis isn't technical. It's political. It asks: who benefits from not solving the real problem?

Usually it's the people who'd have to change if you did.`,
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
    }
]

export const zaraEntryPoints = {
    INTRODUCTION: 'zara_introduction',
    METHODOLOGY: 'zara_audit_methodology',
    VULNERABILITY: 'zara_vulnerability_arc'
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
