/**
 * Yaquin's Dialogue Graph
 * The Practical Creator - Platform 5 (Creator Economy / EdTech)
 *
 * CHARACTER: The Dental Assistant Turned Educator
 * Core Conflict: "Tacit Knowledge" vs. "Formal Credentials"
 * Arc: Realizing that his practical skills are more valuable than theoretical degrees
 * Mechanic: "The Curriculum" - Designing a course that strips away the fluff
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const yaquinDialogueNodes: DialogueNode[] = [
  // ... [KEEPING INTRO NODES] ...
  {
    nodeId: 'yaquin_introduction',
    speaker: 'Yaquin',
    content: [
      {
        text: "Shhh. The static... it's thinning.\n\nCan you hear it? The Star Song. It's in the key of G minor today.",
        emotion: 'mystical',
        variation_id: 'yaquin_intro_elder_v2_minimal',
        richEffectContext: 'warning',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "Engineering marvel isn't it? Tuned to the frequency of the Void.\n\nYou're a builder. You hear the structure in the silence.", altEmotion: 'kindred' },
          { pattern: 'helping', minLevel: 4, altText: "Shhh. The static is thinning.\n\nYou're worried about me. Don't be. The stars are heavy but I can carry them.\n\nListen. G minor.", altEmotion: 'peaceful' },
          { pattern: 'analytical', minLevel: 4, altText: "Shhh. Signal to noise ratio is improving.\n\nYou're analyzing the data stream. Valid. But some data is felt not measured.", altEmotion: 'challenge' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_intro_garbage',
        text: "If the textbook doesn't work, it's garbage.",
        voiceVariations: {
          analytical: "Theory without application is incomplete data.",
          helping: "Real knowledge comes from serving real people.",
          building: "If it doesn't work in practice, it's not finished yet.",
          exploring: "The textbook is a map, not the territory.",
          patience: "Eight years of practice teaches what no book can."
        },
        nextNodeId: 'yaquin_textbook_problem',
        pattern: 'building',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_intro_authority',
        text: "Why do you think you're uneducated?",
        voiceVariations: {
          analytical: "What's the metric? How are you measuring 'educated'?",
          helping: "Who told you that? Whose voice is that in your head?",
          building: "You've built eight years of expertise. That's an education.",
          exploring: "I'm curious who gets to define 'educated' in your field.",
          patience: "That belief sounds heavy. Where does it come from?"
        },
        nextNodeId: 'yaquin_credential_gap',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'yaquin_intro_content',
        text: "You're teaching online?",
        nextNodeId: 'yaquin_creator_path',
        pattern: 'exploring',
        skills: ['digitalLiteracy'],
        archetype: 'ASK_FOR_DETAILS'
      },
      {
        choiceId: 'yaquin_intro_patience',
        text: "[Let the self-doubt sit. He's working something out.]",
        nextNodeId: 'yaquin_credential_gap',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        archetype: 'STAY_SILENT',
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_textbook_problem',
    speaker: 'Yaquin',
    content: [
      {
        text: "Textbook says 'mix 45 seconds.' Do that? Sets in the bowl. Mold ruined.\n\n8 years experience. Know the paste feel. Know patient fear.\n\nBooks don't teach that.",
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'textbook_v2_minimal',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_tacit_knowledge',
        text: "That's knowledge nobody else can teach.",
        voiceVariations: {
          analytical: "Tacit knowledge. It's the hidden variable textbooks can't capture.",
          helping: "That's wisdom earned through caring for people. It's irreplaceable.",
          building: "You've constructed expertise through repetition. That's real craft.",
          exploring: "The gap between theory and practice. That's where mastery lives.",
          patience: "Eight years of patience and attention. That can't be rushed."
        },
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'analytical',
        skills: ['pedagogy']
      },
      {
        choiceId: 'yaquin_teach_that',
        text: "So teach THAT. The real stuff.",
        voiceVariations: {
          analytical: "Strip away the theory. Document what actually works.",
          helping: "Share what you know. People need teachers who've been there.",
          building: "Build the course that should have existed when you started.",
          exploring: "What if your curriculum rewrote the rules?",
          patience: "The right lesson, at the right moment. That's what you can offer."
        },
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building',
        skills: ['leadership']
      },
      {
        choiceId: 'yaquin_explore_patient_fear',
        text: "Tell me about the patient fear. What do you see that textbooks miss?",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        archetype: 'ASK_FOR_DETAILS',
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'yaquin_credential_gap',
    speaker: 'Yaquin',
    content: [
      {
        text: "'Just' an assistant. No dental school.\n\nBut dentists ask me about difficult patients. Ask me to train new hires.\n\nDoing the work. No paper.",
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'credential_v2_minimal',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "'Just' an assistant. No dental school.\n\nBut dentists ask me about difficult patients. Ask me to train new hires.\n\nYou get it don't you? The gap between what you do and what you're called.", altEmotion: 'vulnerable' },
          { pattern: 'building', minLevel: 4, altText: "'Just' an assistant. No dental school.\n\nBut dentists ask me to train new hires. I built my skills through doing.\n\nYou build things. You know competence isn't about paper.", altEmotion: 'reflective' },
          { pattern: 'patience', minLevel: 4, altText: "'Just' an assistant. No dental school.\n\nBut dentists ask me about difficult patients. Eight years.\n\nYou're not jumping to reassure me. That's... good. I need to sit with this.", altEmotion: 'grateful' }
        ]
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        thoughtId: 'community-heart'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_competence',
        text: "Eight years doing the work. That's the credential.",
        voiceVariations: {
          analytical: "Eight years of data. That's a more reliable sample than any degree.",
          helping: "You've earned your authority through service. That's real.",
          building: "You built your expertise patient by patient. That's craftsmanship.",
          exploring: "Experience is the credential the gatekeepers can't invalidate.",
          patience: "Eight years. The credential writes itself."
        },
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'helping',
        skills: ['encouragement'],
        visibleCondition: {
          patterns: { helping: { min: 3 } }
        },
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_explore_credential_meaning',
        text: "What does 'educated' mean to you? Who decides?",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
        visibleCondition: {
          patterns: { exploring: { min: 3 } }
        },
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_build_own_credential',
        text: "What if your students are the proof?",
        voiceVariations: {
          analytical: "Outcomes are the only metric that matters. Track your students.",
          helping: "Every person you've helped is a letter of recommendation.",
          building: "Build your reputation through results, not paper.",
          exploring: "What if success stories are the new credentials?",
          patience: "Let time prove what you've taught. Results take patience."
        },
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        visibleCondition: {
          patterns: { building: { min: 4 } }
        },
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'yaquin_creator_path',
    speaker: 'Yaquin',
    content: [
      {
        // NOTE: Strategic targeting - jitter applied only to the anxious core question about validation and audience.
        // Targets the existential doubt ("shouting into void?"), not the factual setup about followers.
        text: "Started six months ago. Phone videos. No plan.|'Here's what textbooks miss.'|87 followers. Some dental assistants. Some students. Few actual dentists watching.|<jitter>Real question. teaching online or shouting into void?</jitter>",
        emotion: 'curious',
        variation_id: 'creator_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_creator_continue',
        text: "87 followers who found value. That's not nothing.",
        nextNodeId: 'yaquin_creator_encouraged',
        pattern: 'helping',
        skills: ['encouragement'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_explore_who_watches',
        text: "Those dentists watching. what draws them? What are they looking for?",
        nextNodeId: 'yaquin_creator_explored',
        pattern: 'exploring',
        skills: ['curiosity', 'communication'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_build_community',
        text: "87 is a tribe. What if you built with them, not just for them?",
        nextNodeId: 'yaquin_creator_community',
        pattern: 'building',
        skills: ['leadership', 'collaboration'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  // ============= DIVERGENT RESPONSES TO CREATOR PATH =============
  {
    nodeId: 'yaquin_creator_encouraged',
    speaker: 'Yaquin',
    content: [
      {
        text: "87. Right.|Before the videos? Zero. Eight years doing the work. Nobody asking questions. Nobody learning from the mistakes I already made.|Now 87 people want to know what I know.",
        emotion: 'reflective',
        variation_id: 'encouraged_v1',
        useChatPacing: true
      },
      {
        text: "Maybe that's not shouting into void. Maybe that's building something.",
        emotion: 'hopeful',
        variation_id: 'encouraged_v2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_encouraged',
        text: "[Continue]",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'yaquin_creator_explored',
    speaker: 'Yaquin',
    content: [
      {
        text: "The dentists? Good question.|They watch but don't comment. Think they're embarrassed? Like admitting they don't know something basic.",
        emotion: 'curious',
        variation_id: 'explored_v1',
        useChatPacing: true
      },
      {
        text: "Or maybe they see what I see. The gap between textbook and chair. What you're supposed to know versus what actually works.|That gap? Eight years of filling it. Maybe that's what they want.",
        emotion: 'realizing',
        variation_id: 'explored_v2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_explored',
        text: "[Continue]",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'yaquin_creator_community',
    speaker: 'Yaquin',
    content: [
      {
        text: "Build WITH them?|Never thought of it like that. Always felt like I teach, they learn. One direction.",
        emotion: 'surprised',
        variation_id: 'community_v1',
        useChatPacing: true
      },
      {
        text: "But you're right. Some of them been doing this longer than me. Different clinics. Different problems. Different solutions.|What if the course isn't me telling them things but us figuring it out together?",
        emotion: 'excited',
        variation_id: 'community_v2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_community',
        text: "[Continue]",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'yaquin_curriculum_dream',
    speaker: 'Yaquin',
    content: [
      {
        // NOTE: Strategic targeting - jitter applied only to the anxiety about scope creep and fluff.
        // Isolates the moment of panic ("keeps adding..."), not the vision statement.
        text: "Want to build a course. 'The Real Dental Assistant.'|Reality. not theory. Calm crying kids. Mix paste. Anticipate doctor needs.|<jitter>But the syllabus keeps adding history. Anatomy. Ethics.</jitter>",
        emotion: 'anxious',
        variation_id: 'dream_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_help_edit',
        text: "You're adding fluff. Let's cut it.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building',
        skills: ['instructionalDesign']
      },
      {
        choiceId: 'yaquin_dream_patience',
        text: "[Let him talk through the anxiety. Sometimes the spiral needs to complete.]",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  // ============= THE CURRICULUM (Immersive Scenario) =============
  {
    nodeId: 'yaquin_curriculum_setup',
    speaker: 'Yaquin',
    content: [
      {
        // TODO: [SFX] Heavy notebook slam, papers rustling
        // TODO: [VFX] Camera shake on notebook slam
        // NOTE: Removed "slams" and "points" - showing environment and result, not choreography
        // NOTE: Strategic targeting - shake applied only to the high-stakes consequence statement.
        // Targets the climactic moment of pressure ("Back to cleaning spit valves"), not the setup.
        text: "This list. 8 years instinct to checklist. Impossible.\n\n<shake>One pilot this weekend. Pick wrong. nobody watches. Back to cleaning spit valves.</shake>",
        emotion: 'tense',
        variation_id: 'curriculum_setup_v2',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    simulation: {
      type: 'creative_direction',
      title: 'Course Module Design',
      taskDescription: 'Design the opening module for "The Real Dental Assistant" course. The hook needs to grab attention and prove this isn\'t another boring textbook.',
      initialContext: {
        label: 'Module 1 Draft Options',
        content: `OPTION A: "Chapter 1: The History of Dental Assisting (1850-Present)"
- Timeline of profession development
- Key figures and milestones
- Regulatory evolution

OPTION B: "Module 1: The Perfect Impression (How Not to Choke Your Patient)"
- Real scenario: anxious patient, 30 seconds to mix
- Texture cues the textbook never mentions
- Recovery moves when things go wrong

OPTION C: "Unit 1: Anatomy Review and Medical Terminology"
- Latin roots and prefixes
- Tooth numbering systems
- Quiz at the end

Which opening sells the VALUE of practical experience?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ HOOK CONFIRMED: "The Perfect Impression" - practical, memorable, proves expertise immediately.'
    },
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'module_history',
        text: "'Module 1: The History of Dentistry (1800-Present).'",
        nextNodeId: 'yaquin_fail_boring',
        pattern: 'analytical', // Trap choice: boring
        skills: ['curriculumDesign']
      },
      {
        choiceId: 'module_practical',
        text: "'Module 1: The Perfect Impression (How not to choke your patient).'",
        nextNodeId: 'yaquin_success_practical',
        pattern: 'building',
        skills: ['marketing', 'empathy']
      },
      {
        choiceId: 'module_soft_skills',
        text: "'Module 1: Reading the Room (Patient Psychology).'",
        nextNodeId: 'yaquin_success_psych',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE: BORING ---
  {
    nodeId: 'yaquin_fail_boring',
    speaker: 'Yaquin',
    content: [
      {
        // NOTE: Removed filming process and "head in hands" - dialogue carries the failure without choreography
        text: "'Hello class. Today. 19th century forceps.'|'Bored watching myself. Nobody pays $50 for this. Sound like professors I hated.'",
        emotion: 'heavy',
        interaction: 'small',
        variation_id: 'fail_boring_v1',
        richEffectContext: 'error',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'retry_curriculum',
        text: "Cut the history. Teach the skill.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building'
      },
      {
        choiceId: 'give_up_boring',
        text: "Maybe you need a degree to teach.",
        nextNodeId: 'yaquin_bad_ending',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['yaquin_chose_safe']
        }
      }
    ]
  },

  // --- SUCCESS VARIATIONS ---
  {
    nodeId: 'yaquin_success_practical',
    speaker: 'Yaquin',
    content: [
      {
        // TODO: [SFX] Mixing sounds, laughter, timer ticking
        // TODO: [VFX] Success glow on playback screen
        // NOTE: Removed filming process and "grins" - converted to audio cues only
        text: "Pink. Goopy. 30 seconds before stone. Go!\n\n<bloom>That's it.</bloom> Not lecture. Cooking show for teeth.",
        emotion: 'excited',
        interaction: 'bloom',
        variation_id: 'success_practical_v1',
        richEffectContext: 'success',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'confirm_practical',
        text: "That's your brand. 'The Cooking Show for Teeth.'",
        nextNodeId: 'yaquin_launch_decision',
        pattern: 'building',
        skills: ['marketing']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_practical']
      }
    ]
  },

  {
    nodeId: 'yaquin_success_psych',
    speaker: 'Yaquin',
    content: [
      {
        text: "You're nervous. Drill's loud. Watch my eyes. Breathe with me.\n\nAll day. Don't fix teeth. fix fear. That's what I'm selling.",
        emotion: 'inspired',
        interaction: 'bloom',
        variation_id: 'success_psych_v1',
        richEffectContext: 'success',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'confirm_psych',
        text: "That's not dentistry. That's something else.",
        nextNodeId: 'yaquin_launch_decision',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_psych']
      }
    ]
  },

  // ============= THE LAUNCH (Climax) =============
  {
    nodeId: 'yaquin_launch_decision',
    speaker: 'Yaquin',
    content: [
      {
        // NOTE: Strategic targeting - jitter applied only to the anxiety peaks about career consequences.
        // Targets the panic about professional risk, not the factual readiness statement.
        text: "Video ready. Platform ready.|<jitter>Publish. dentists see it. Might fire me. 'Who's this guy?'</jitter>|Don't publish. guy shouting at phone in basement.",
        emotion: 'anxious',
        variation_id: 'launch_v1',
        useChatPacing: true,
        interrupt: {
          duration: 3500,
          type: 'encouragement',
          action: 'Put your hand over his on the publish button',
          targetNodeId: 'yaquin_interrupt_encouragement',
          consequence: {
            characterId: 'yaquin',
            trustChange: 2
          }
        }
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `Video ready. Platform ready. You're a builder. I can tell from how you approached this.|<jitter>Publish. dentists see it. Might fire me. 'Who's this guy?'</jitter>|Don't publish. guy shouting at phone in basement.`,
        altEmotion: 'kindred_anxious'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `Video ready. Platform ready. You've been here with me through all of this. That means something.|<jitter>Publish. dentists see it. Might fire me. 'Who's this guy?'</jitter>|Don't publish. guy shouting at phone in basement.`,
        altEmotion: 'grateful_anxious'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `Video ready. Platform ready. You helped me see the data clearly. the path forward.|<jitter>Publish. dentists see it. Might fire me. 'Who's this guy?'</jitter>|Don't publish. guy shouting at phone in basement.`,
        altEmotion: 'recognized_anxious'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'launch_now',
        text: "Launch it. Ask for forgiveness, not permission.",
        nextNodeId: 'yaquin_launched',
        pattern: 'building',
        skills: ['entrepreneurship', 'courage']
      },
      {
        choiceId: 'launch_wait',
        text: "Build an audience anonymously first.",
        nextNodeId: 'yaquin_audience_first',
        pattern: 'analytical',
        skills: ['strategicThinking']
      },
      {
        choiceId: 'launch_patience',
        text: "[Let the decision breathe. This isn't a choice to rush.]",
        nextNodeId: 'yaquin_audience_first',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'yaquin_launched',
    speaker: 'Yaquin',
    content: [
      {
        // TODO: [SFX] Button click, notification chime, heartbeat
        // TODO: [VFX] Screen flash, comment notification pop
        // TODO: [MUSIC] Triumphant swell, achievement fanfare
        // NOTE: Removed "hits button" - action implicit from "Live"
        text: "Live.|First comment: 'Finally someone explains mixing ratio!'|Doing it. Actually doing it. Teacher.",
        emotion: 'excited',
        interaction: 'big',
        variation_id: 'launched_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell_launched',
        text: "You always were.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_launched'],
        thoughtId: 'community-heart'
      }
    ],
    tags: ['ending', 'yaquin_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  {
    nodeId: 'yaquin_audience_first',
    speaker: 'Yaquin',
    content: [
      {
        text: "Smart. Brand name. 'Dental Ninja.' Build trust, then sell.|Safer. Still forward.|Thank you. Kept me from reckless mistake.",
        emotion: 'relieved',
        interaction: 'nod',
        variation_id: 'audience_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell_audience',
        text: "Strategy beats speed.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'analytical'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_building_audience'],
        thoughtId: 'empathy-bridge'
      }
    ],
    tags: ['ending', 'yaquin_arc']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'yaquin_bad_ending',
    speaker: 'Yaquin',
    content: [
      {
        text: "Yeah. Back to school. Get degree. Maybe then people listen.|Nice fantasy. Just an assistant.|Thanks for listening.",
        emotion: 'heavy',
        interaction: 'small',
        variation_id: 'bad_ending_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_safe', 'yaquin_arc_complete']
      }
    ],
    tags: ['ending', 'bad_ending', 'yaquin_arc']
  },

  // ============= INTERRUPT TARGET NODES =============
  {
    nodeId: 'yaquin_interrupt_encouragement',
    speaker: 'Yaquin',
    content: [
      {
        text: "Nobody ever sat with me like this. Through the fear.\n\nMy father wanted me to be a dentist. Real dentist. With degree. When I said I was 'just' assistant, he didn't talk to me for a month.\n\nPublishing this means telling the world I'm good enough. Without the paper. Without his approval.\n\nYou being here. It helps. Really helps.\n\nTogether?",
        emotion: 'vulnerable_hopeful',
        interaction: 'bloom',
        variation_id: 'interrupt_encouragement_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_from_interrupt',
        text: "Together.",
        nextNodeId: 'yaquin_launched',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['yaquin_arc', 'interrupt_response']
  },

  // ============= VULNERABILITY ARC (Trust ≥ 6) =============
  // "The day his father stopped talking" - family shame and self-worth
  {
    nodeId: 'yaquin_vulnerability_arc',
    speaker: 'Yaquin',
    content: [
      {
        text: "Can tell you something? Not about course. About me.\n\nMy father came here from Manila. 1989. Worked three jobs. Saved every penny. Sent all four kids to college.\n\nMy sister: engineer. My brother: pharmacist. Other sister: accountant.\n\nMe: dental assistant.\n\nDay I told him I wasn't going to dental school. He looked at me like I'd died.\n\nDidn't speak to me for month. When he finally did, he said: 'You had same chances as your siblings. Why you waste them?'\n\nStill hears that. Every time someone says 'just an assistant.' Every time I doubt myself. His voice.",
        emotion: 'shame_pain',
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
        characterId: 'yaquin',
        addKnowledgeFlags: ['yaquin_vulnerability_revealed', 'knows_about_father']
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_vuln_different_success',
        text: "Your success looks different. That doesn't make it less.",
        nextNodeId: 'yaquin_vulnerability_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2
        }
      },
      {
        choiceId: 'yaquin_vuln_teaching_honored',
        text: "He came here so you could have choices. You chose. That honors him.",
        nextNodeId: 'yaquin_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2
        }
      },
      {
        choiceId: 'yaquin_vuln_silence',
        text: "[Let the weight of it sit. Some pain needs witness, not words.]",
        nextNodeId: 'yaquin_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2
        }
      }
    ],
    tags: ['yaquin_arc', 'vulnerability', 'emotional_core']
  },

  {
    nodeId: 'yaquin_vulnerability_response',
    speaker: 'Yaquin',
    content: [
      {
        text: "Know what's funny? My students ask where I learned this. I tell them: from watching. From failing. From eight years of 'not good enough.'\n\nMy father worked three jobs because he saw what he didn't have. Wanted us to have it.\n\nBut maybe what I have IS something. 200 people learning from my mistakes. That's building something.\n\nMaybe when course hits 1,000 students, I'll show him. Say: 'Look, Tatay. This is what I built. Different than sister's buildings. Different than brother's pharmacy. But mine.'\n\nMaybe he'll understand then. Maybe not.\n\nBut I'll know.",
        emotion: 'resolved_hopeful',
        interaction: 'bloom',
        variation_id: 'vulnerability_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_vuln_to_farewell',
        text: "You already built something. Now you're sharing it.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['yaquin_arc', 'vulnerability', 'resolution']
  },

  {
    nodeId: 'yaquin_farewell',
    speaker: 'Yaquin',
    content: [
      {
        text: "Lot of editing ahead.|See Samuel? Tell him. class is in session.",
        emotion: 'proud',
        interaction: 'nod',
        variation_id: 'farewell_v1',
        useChatPacing: true
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `Lot of editing ahead. You're a builder too. saw it in how you helped.|See Samuel? Tell him. class is in session.`,
        altEmotion: 'kindred_proud'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `Lot of editing ahead. You care about people learning. really learning. Saw that.|See Samuel? Tell him. class is in session.`,
        altEmotion: 'grateful_proud'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_yaquin',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      },
      {
        choiceId: 'yaquin_ask_about_course',
        text: "How's the course going with actual students?",
        nextNodeId: 'yaquin_phase2_entry',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          hasGlobalFlags: ['yaquin_arc_complete']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        addKnowledgeFlags: ['completed_arc'],
        addGlobalFlags: ['yaquin_arc_complete'],
        thoughtId: 'community-heart'
      }
    ],
    tags: ['transition', 'yaquin_arc']
  },

  // ============= PHASE 2: COURSE LAUNCH AFTERMATH + SCALING CHALLENGE =============

  {
    nodeId: 'yaquin_phase2_entry',
    speaker: 'Yaquin',
    content: [{
      // TODO: [SFX] Multiple notification pings, keyboard typing, overwhelmed ambience
      // TODO: [VFX] Screen overlays showing dashboards, red notification badges
      // NOTE: Strategic targeting - shake applied only to the overwhelming cascade of problems and realizations.
      // Targets the crescendo moment revealing the full scope of challenges.
      text: "It worked. The course launched. 127 students enrolled.\n\nEight weeks later. Three laptops. Support tickets. Dashboards.\n\n<shake>47 unread messages. 15 refunds. DDS calling it 'amateur hour.'</shake>\n\nTeaching? Easy. Running a course business? That's the real education.",
      emotion: 'exhausted',
      variation_id: 'p2_entry_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_refund_requests',
        text: "15 refund requests? What's happening?",
        nextNodeId: 'yaquin_p2_quality_crisis',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'p2_dds_comment',
        text: "What did the DDS say?",
        nextNodeId: 'yaquin_p2_dds_comment',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    requiredState: {
      hasGlobalFlags: ['yaquin_arc_complete']
    },
    tags: ['phase2', 'yaquin_arc', 'crisis']
  },

  {
    nodeId: 'yaquin_p2_quality_crisis',
    speaker: 'Yaquin',
    content: [{
      // NOTE: Strategic targeting - shake applied only to the realization of the fundamental format problem.
      // Targets the vulnerability moment of failure awareness ("Struggling. Refunds."), not the customer feedback.
      text: "Self-paced doesn't work. Need live instruction. Videos too fast. Can't stay motivated.\n\nGreat content, wrong format. Need teacher, not YouTube.\n\n<shake>Half career-switchers. crushing it. Other half. boss-mandated. Struggling. Refunds.</shake>",
      emotion: 'tense',
      variation_id: 'quality_crisis_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_two_student_types',
        text: "You have two different student types. One format won't work.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'analytical',
        skills: ['criticalThinking', 'strategicThinking']
      },
      {
        choiceId: 'p2_refund_policy',
        text: "What's your refund policy?",
        nextNodeId: 'yaquin_p2_refund_pressure',
        pattern: 'building',
        skills: ['pragmatism']
      },
      {
        choiceId: 'p2_synthetic_director',
        text: "[AI] Stop doing the manual labor. Design the curriculum, let a synthetic system deliver it.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'patience',
        visibleCondition: {
          patterns: { patience: { min: 6 } }
        },
        consequence: {
          characterId: 'yaquin',
          trustChange: 2,
          addKnowledgeFlags: ['used_synthetic_artist_insight'],
          thoughtId: 'synthetic-artist'
        }
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'crisis']
  },

  {
    nodeId: 'yaquin_p2_dds_comment',
    speaker: 'Yaquin',
    content: [{
      text: "**Dr. Sarah Chen, DDS**: 'Amateur hour. No credentials, structure, accountability. YouTube videos for $497. Assistants deserve real education, not shortcuts.'\n\nNot wrong about credentials. Assistant teaching assistants. No degree. No training.\n\nWant to ignore her. Defend myself. Or maybe she's right.",
      emotion: 'vulnerable',
      interaction: 'small',
      variation_id: 'dds_comment_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_credentials_matter',
        text: "Credentials aren't everything. Your experience is the credential.",
        nextNodeId: 'yaquin_p2_credibility_response',
        pattern: 'helping',
        skills: ['encouragement', 'emotionalIntelligence']
      },
      {
        choiceId: 'p2_take_feedback',
        text: "Use it as feedback. What can you improve?",
        nextNodeId: 'yaquin_p2_credibility_response',
        pattern: 'building',
        skills: ['learningAgility', 'humility']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'imposter_syndrome']
  },

  {
    nodeId: 'yaquin_p2_refund_pressure',
    speaker: 'Yaquin',
    content: [{
      // NOTE: Strategic targeting - jitter applied only to the core moment of self-doubt and uncertainty.
      // Targets the anxiety about whether the criticism is valid ("Maybe IS..."), isolating the panic from policy discussion.
      text: "30-day guarantee. No questions. Stand behind quality.\n\nBoss made me. Too hard. Didn't finish, want money.\n\nHonor all. lose $7,500. Get strict. look like scammer.\n\n<jitter>Worst part? Don't know if they're right. Maybe IS too hard. Maybe IS 'amateur hour.'</jitter>",
      emotion: 'conflicted',
      variation_id: 'refund_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_generous_refunds',
        text: "Honor the refunds. Build reputation over revenue.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'helping',
        skills: ['integrity', 'patience'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['generous_refunds']
        }
      },
      {
        choiceId: 'p2_firm_policy',
        text: "Hold the line. 'Not finishing' isn't a refund reason.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'building',
        skills: ['accountability', 'courage']
      },
      {
        choiceId: 'p2_case_by_case',
        text: "Case-by-case. Talk to each student, understand why.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'fairness']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'business_ethics']
  },

  {
    nodeId: 'yaquin_p2_credibility_response',
    speaker: 'Yaquin',
    content: [{
      text: "Ignore Dr. Chen. Or.\n\nInvite her to review? Add as credentialed advisor?\n\nOr respond publicly: 'Not a DDS. 40 hours/week doing actual work. Students need both perspectives.'\n\nDefend ground or acknowledge gap?",
      emotion: 'analytical',
      interaction: 'nod',
      variation_id: 'credibility_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_invite_advisor',
        text: "Invite her to be an advisor. Turn critic into collaborator.",
        nextNodeId: 'yaquin_p2_scaling_offer',
        pattern: 'building',
        skills: ['collaboration', 'strategicThinking'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1,
          addKnowledgeFlags: ['credentialed_advisor']
        }
      },
      {
        choiceId: 'p2_defend_experience',
        text: "Defend your expertise. You know things DDS programs don't teach.",
        nextNodeId: 'yaquin_p2_scaling_offer',
        pattern: 'helping',
        skills: ['courage', 'integrity']
      },
      {
        choiceId: 'p2_credibility_patience',
        text: "[Sit with the criticism. Not every wound needs immediate defense.]",
        nextNodeId: 'yaquin_p2_scaling_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'credibility']
  },

  {
    nodeId: 'yaquin_p2_format_decision',
    speaker: 'Yaquin',
    content: [{
      // TODO: [SFX] Pen scratching on paper, data visualization sounds
      // TODO: [VFX] Animated charts/graphs showing completion rates, decision tree branches
      text: "Data:\n**Self-motivated**: 85% completion. Glowing reviews.\n**Boss-mandated**: 32% completion. Most refunds.\n\n**Option 1**: Cohort-based. Fewer students, live, higher price.\n**Option 2**: Improve self-paced. Forums, office hours.\n**Option 3**: Two-tier. Self-paced ($497) + Cohort ($1,497).\n\nWhat would you do?",
      emotion: 'analytical',
      interaction: 'nod',
      variation_id: 'format_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_cohort_based',
        text: "Go cohort-based. Quality over quantity.",
        nextNodeId: 'yaquin_p2_scaling_choice',
        pattern: 'helping',
        skills: ['pedagogy', 'visionaryThinking'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_cohort']
        }
      },
      {
        choiceId: 'p2_improve_self_paced',
        text: "Double down on self-paced. Fix what's broken.",
        nextNodeId: 'yaquin_p2_scaling_choice',
        pattern: 'building',
        skills: ['learningAgility', 'resilience']
      },
      {
        choiceId: 'p2_two_tier',
        text: "Two-tier. Serve both student types.",
        nextNodeId: 'yaquin_p2_scaling_choice',
        pattern: 'analytical',
        skills: ['strategicThinking', 'entrepreneurship'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'product_strategy'],
    metadata: {
      sessionBoundary: true  // Session 2: Crossroads complete
    }
  },

  {
    nodeId: 'yaquin_p2_scaling_offer',
    speaker: 'Yaquin',
    content: [{
      text: "Three Birmingham offices reached out. License course for new hires. 50+ students.\n\n**Offer**: $15K/office, annual. They onboard, I provide content.\n\n$45K. Nine months salary.\n\nBut not teaching. licensing. Content creator, not educator.\n\nThat what I want?",
      emotion: 'conflicted',
      interaction: 'small',
      variation_id: 'scaling_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_take_license',
        text: "Take the deal. Sustainable income lets you teach better.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'analytical',
        skills: ['pragmatism', 'entrepreneurship'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_licensing']
        }
      },
      {
        choiceId: 'p2_stay_direct',
        text: "Stay direct. Teaching is the point, not licensing.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'helping',
        skills: ['integrity', 'visionaryThinking']
      },
      {
        choiceId: 'p2_both',
        text: "Do both. License for income, teach for impact.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'building',
        skills: ['strategicThinking', 'adaptability']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'scaling']
  },

  {
    nodeId: 'yaquin_p2_scaling_choice',
    speaker: 'Yaquin',
    content: [{
      text: "Keep self-paced for motivated learners. Add cohort 'Dental Mastery'. 8 weeks, live, small groups. Maybe reach out to Dr. Chen. Co-teach advanced modules.\n\nNot about perfect. Serving students where they are. Some need independence. Some need structure. Why not both?",
      emotion: 'focused',
      interaction: 'nod',
      variation_id: 'scaling_choice_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_solid_plan',
        text: "That's a solid plan. Iteration, not perfection.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'building',
        skills: ['encouragement']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'strategy']
  },

  {
    nodeId: 'yaquin_p2_implementation',
    speaker: 'Yaquin',
    content: [{
      // TODO: [SFX] Success notification chimes, positive metrics sounds
      // TODO: [VFX] Green upward arrows on metrics, growth visualization
      text: "Two weeks later. Implemented changes:\n- Cohort program: 24 students @ $1,497\n- Self-paced: office hours, forum\n- Refunds: approved 8, denied 7\n- Dr. Chen: reviewing curriculum (for fee)\n\nRevenue up. Completion up. Refunds down.\n\nMore important? Learning business, not just teaching skill.",
      emotion: 'proud',
      interaction: 'bloom',
      variation_id: 'implementation_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_student_reactions',
        text: "How did students react to the changes?",
        nextNodeId: 'yaquin_p2_student_reactions',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'execution']
  },

  {
    nodeId: 'yaquin_p2_student_reactions',
    speaker: 'Yaquin',
    content: [{
      text: "Mixed. Refunded students. 1-star reviews: 'Bait and switch.' Stayed students thriving: 'Real teaching now, not just videos.'\n\n**Student**: 'Almost quit. Cohort saved me. Getting hired next week because of you.'\n\nThat's why. Not revenue. Not validation. That message.",
      emotion: 'grateful',
      interaction: 'small',
      variation_id: 'reactions_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_dds_outcome',
        text: "What happened with Dr. Chen?",
        nextNodeId: 'yaquin_p2_dds_outcome',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'impact']
  },

  {
    nodeId: 'yaquin_p2_dds_outcome',
    speaker: 'Yaquin',
    content: [{
      text: "Dr. Chen reviewed curriculum. Tore apart. 'Outdated. Wrong. Too simplified.' Brutal.\n\nShe was right. Updated everything.\n\nThen: 'Missing the why. Teach how, but students need why.'\n\nNow paid consultant. Reviews content. Cited as clinical advisor.\n\nCritics become collaborators if humble enough to listen.",
      emotion: 'proud',
      interaction: 'bloom',
      variation_id: 'dds_outcome_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_operational_wisdom',
        text: "You've learned to operate at scale.",
        nextNodeId: 'yaquin_p2_operational_wisdom',
        pattern: 'analytical',
        skills: ['strategicThinking']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'collaboration']
  },

  {
    nodeId: 'yaquin_p2_operational_wisdom',
    speaker: 'Yaquin',
    content: [{
      text: "{{met_jordan:Jordan calls it 'user experience.' I call it survival.|I learned that from running the clinic floor.}}|If the student is confused, it's my fault. If the tool is hard to use, fix the tool.|Academics blame the student. I blame the design.",
      emotion: 'confident',
      interaction: 'nod',
      variation_id: 'operational_wisdom_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_reflection',
        text: "You've become what you needed when you started.",
        nextNodeId: 'yaquin_p2_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'wisdom']
  },

  {
    nodeId: 'yaquin_p2_reflection',
    speaker: 'Yaquin',
    content: [{
      text: "Started. assistant who thought textbooks garbage.|Now. creator who knows content is 20%.|Other 80%? Operations. Strategy. Communication. Resilience.|200+ students. Some finish. Some quit. Bad reviews.|Okay with that.|Because who succeed? Know things textbooks never taught.|Just like I did.",
      emotion: 'proud',
      interaction: 'bloom',
      variation_id: 'reflection_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_complete',
        text: "Class is definitely in session.",
        nextNodeId: 'yaquin_p2_complete',
        pattern: 'helping',
        skills: ['encouragement']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'growth']
  },

  {
    nodeId: 'yaquin_p2_complete',
    speaker: 'Yaquin',
    content: [{
      text: "For being here when messy.|Cohort Monday. Twenty students. Live sessions. Real teaching.|See Samuel? Tell him. building business that teaches.",
      emotion: 'grateful',
      interaction: 'nod',
      variation_id: 'complete_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'yaquin_asks_before_leave',
        text: "Before you go. what's your biggest challenge right now?",
        nextNodeId: 'yaquin_asks_player',
        pattern: 'helping',
        skills: ['communication', 'curiosity']
      },
      {
        choiceId: 'return_to_samuel_yaquin_p2',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'completion']
  },
  // ============= RECIPROCITY: YAQUIN ASKS PLAYER =============
  {
    nodeId: 'yaquin_asks_player',
    speaker: 'Yaquin',
    content: [{
      text: "Biggest challenge?|Scaling. How teach 200 students same quality as 20?|But you. what's your challenge?|You help people. But who helps you figure out your path?",
      emotion: 'curious_engaged',
      interaction: 'nod',
      variation_id: 'yaquin_reciprocity_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'player_challenge_uncertainty',
        text: "My challenge is uncertainty. I help others find their path, but I'm still searching for mine. It's hard to guide when you're lost yourself. sometimes I feel like a fraud, pointing directions I haven't walked.",
        nextNodeId: 'yaquin_reciprocity_response',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'player_challenge_balance',
        text: "Holding everyone's stories. Each person's struggle. I carry them home. Some nights they're heavy.",
        nextNodeId: 'yaquin_reciprocity_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'player_challenge_impostor',
        text: "Standing in front of people who've been here longer. Who know more. Wondering why they listen to me.",
        nextNodeId: 'yaquin_reciprocity_response',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'criticalThinking']
      },
      {
        choiceId: 'player_challenge_patience',
        text: "Planting seeds I won't see grow. Community takes generations. I want to see it bloom now.",
        nextNodeId: 'yaquin_reciprocity_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'yaquin_arc']
  },
  {
    nodeId: 'yaquin_reciprocity_response',
    speaker: 'Yaquin',
    content: [{
      text: "Know that feeling.|But you here. Helping. That's path.|Not about having all answers.|About showing up when messy.|You doing that.|See Samuel. Tell him Yaquin says you ready.",
      emotion: 'affirming',
      interaction: 'nod',
      variation_id: 'yaquin_response_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'return_to_samuel_yaquin_after',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      },
      {
        choiceId: 'yaquin_check_reviews',
        text: "Before I go... how are the course reviews looking?",
        nextNodeId: 'yaquin_simulation_intro',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          hasGlobalFlags: ['yaquin_arc_complete']
        }
      }
    ],
    tags: ['reciprocity', 'yaquin_arc']
  },

  // ============= COURSE REVIEW SIMULATION =============
  // Theme: Dealing with controversial feedback on course content, balancing accuracy with audience needs
  {
    nodeId: 'yaquin_simulation_intro',
    speaker: 'Yaquin',
    content: [{
      text: "Reviews came in. 200 students, 47 reviews posted.\n\nMost are good. Five stars. 'Changed my career.' 'Finally understand mixing ratios.'\n\nBut three reviews. They're brutal. And one of them? From a DDS. Says I'm teaching 'dangerous misinformation.'\n\n<shake>Posted publicly. Other students are asking questions now.</shake>",
      emotion: 'anxious',
      variation_id: 'sim_intro_v1',
      richEffectContext: 'warning',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'sim_intro_show_reviews',
        text: "Show me the reviews. Let's see what we're dealing with.",
        nextNodeId: 'yaquin_simulation_phase_1',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'sim_intro_how_feel',
        text: "How are you feeling about this? That sounds hard.",
        nextNodeId: 'yaquin_simulation_phase_1',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'sim_intro_wait',
        text: "[Give him a moment. He's processing.]",
        nextNodeId: 'yaquin_simulation_phase_1',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'course_review']
  },

  {
    nodeId: 'yaquin_simulation_phase_1',
    speaker: 'Yaquin',
    content: [{
      text: "**Review from Dr. Patricia Lam, DDS:**\n'This course teaches outdated impression techniques. The 45-second mixing time is WRONG for modern alginate formulations. Students following this could compromise patient safety. 1 star.'\n\n**Review from DentalTech_Mike:**\n'Great practical tips but the anatomy section has errors. Tooth numbering inconsistent between modules. Fix this.'\n\n**Review from Anonymous:**\n'Yaquin isn't a real dentist. Why am I taking advice from an assistant? Refund requested.'\n\nThree different problems. One is technical accuracy. One is production quality. One is about me. Who I am.\n\nWhich one do I address first?",
      emotion: 'conflicted',
      variation_id: 'phase1_v1',
      useChatPacing: true
    }],
    simulation: {
      type: 'dashboard_triage',
      title: 'Course Review Triage',
      taskDescription: 'Three critical reviews require different responses. Prioritize which to address first to protect course reputation while maintaining integrity.',
      initialContext: {
        label: 'Review Dashboard',
        content: `CRITICAL REVIEWS (3)
─────────────────────
[1] Dr. Patricia Lam, DDS - Technical accuracy concern
    Impact: HIGH (credibility at stake)
    Type: Factual dispute

[2] DentalTech_Mike - Production quality issue
    Impact: MEDIUM (fixable)
    Type: Error correction

[3] Anonymous - Credential challenge
    Impact: VARIABLE (emotional trigger)
    Type: Identity attack`,
        displayStyle: 'code'
      },
      successFeedback: 'TRIAGE COMPLETE: Priority response strategy identified.'
    },
    choices: [
      {
        choiceId: 'phase1_technical_first',
        text: "Address Dr. Lam's technical concern first. If she's right, fix it. If she's wrong, defend with evidence.",
        nextNodeId: 'yaquin_simulation_phase_2',
        pattern: 'analytical',
        skills: ['criticalThinking', 'integrity'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1,
          addKnowledgeFlags: ['chose_technical_first']
        }
      },
      {
        choiceId: 'phase1_credential_first',
        text: "Address the credential attack first. If you don't own your expertise, the other criticisms hit harder.",
        nextNodeId: 'yaquin_simulation_phase_2',
        pattern: 'building',
        skills: ['courage', 'communication'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_credential_first']
        }
      },
      {
        choiceId: 'phase1_quality_first',
        text: "Fix the errors first. Quick wins build momentum and show responsiveness.",
        nextNodeId: 'yaquin_simulation_phase_2',
        pattern: 'building',
        skills: ['pragmatism', 'adaptability'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_quality_first']
        }
      },
      {
        choiceId: 'phase1_patience',
        text: "[Don't rush to respond. Reactive responses often make things worse.]",
        nextNodeId: 'yaquin_simulation_phase_2',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'strategicThinking'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1,
          addKnowledgeFlags: ['chose_patience']
        }
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'decision_point']
  },

  {
    nodeId: 'yaquin_simulation_phase_2',
    speaker: 'Yaquin',
    content: [{
      text: "Okay. The technical one. Dr. Lam.\n\nI looked up her claim. She's right about one thing. Modern alginate brands vary. Some set in 30 seconds. Some in 60. My '45 seconds' was based on the brand I used for eight years.\n\nBut here's the thing. I also taught texture cues. 'When it stops being shiny, it's ready.' That works for ANY brand.\n\nHow do I respond? Admit I was wrong? Defend my approach? Both?",
      emotion: 'analytical',
      variation_id: 'phase2_v1',
      useChatPacing: true
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Public Response Strategy',
      taskDescription: 'Dr. Lam raised a valid technical concern publicly. Craft a response that maintains credibility, acknowledges the feedback, and reinforces your teaching methodology.',
      initialContext: {
        label: 'Response Draft',
        content: `DRAFT OPTIONS:
─────────────────────
[A] DEFENSIVE: "My 8 years of experience proves the 45-second method works. Dr. Lam may be referring to different clinical contexts."

[B] FULL ADMISSION: "You're right. I'll remove the timing guidance entirely and update the module."

[C] BALANCED: "Thank you for this feedback. You're correct that timing varies by brand. I'll add a comparison chart. However, the texture-based method I teach is brand-agnostic and the core skill."`,
        displayStyle: 'text'
      },
      successFeedback: 'RESPONSE SENT: Balanced approach maintains credibility while showing growth.'
    },
    choices: [
      {
        choiceId: 'phase2_defensive',
        text: "Go defensive. Your experience is valid. Don't let one DDS undermine your authority.",
        nextNodeId: 'yaquin_simulation_fail',
        pattern: 'building',
        skills: ['courage'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_defensive']
        }
      },
      {
        choiceId: 'phase2_full_admit',
        text: "Full admission. Remove the timing guidance. Better to be safe.",
        nextNodeId: 'yaquin_simulation_fail',
        pattern: 'helping',
        skills: ['humility'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_full_admit']
        }
      },
      {
        choiceId: 'phase2_balanced',
        text: "Balanced response. Acknowledge what's valid, reinforce what's still true, and improve the course.",
        nextNodeId: 'yaquin_simulation_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication', 'integrity'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2,
          addKnowledgeFlags: ['chose_balanced']
        }
      },
      {
        choiceId: 'phase2_explore',
        text: "What if you reached out to Dr. Lam privately first? Before responding publicly?",
        nextNodeId: 'yaquin_simulation_success',
        pattern: 'exploring',
        skills: ['strategicThinking', 'collaboration'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2,
          addKnowledgeFlags: ['chose_private_outreach']
        }
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'critical_decision']
  },

  {
    nodeId: 'yaquin_simulation_success',
    speaker: 'Yaquin',
    content: [{
      text: "<bloom>That's it.</bloom>\n\nAcknowledge what's true. Stand by what's still valid. Improve based on feedback.\n\n'Dr. Lam, thank you for this feedback. You're absolutely right. Timing varies by brand, and I should have included a comparison chart. I'll update Module 1 this week. However, the texture-based method remains the core skill because it's brand-agnostic. I learned this from 8 years of chair-side work. Perhaps we could collaborate on a more comprehensive timing guide? Your clinical expertise would strengthen the course.'\n\nNot defensive. Not doormat. Professional.\n\nThe anonymous attacker? I'm not responding. Can't win that fight. But the students watching? They'll see how I handle legitimate criticism.\n\nThat's the real review. How I respond when challenged.",
      emotion: 'confident',
      interaction: 'bloom',
      variation_id: 'success_v1',
      richEffectContext: 'success',
      useChatPacing: true
    }],
    onEnter: [
      {
        characterId: 'yaquin',
        addKnowledgeFlags: ['completed_review_simulation'],
        addGlobalFlags: ['yaquin_review_simulation_complete']
      }
    ],
    choices: [
      {
        choiceId: 'success_continue',
        text: "That's the mark of a real educator. Growth, not ego.",
        nextNodeId: 'yaquin_simulation_aftermath',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'success_dr_lam',
        text: "What if Dr. Lam actually collaborates? That could be huge.",
        nextNodeId: 'yaquin_simulation_aftermath',
        pattern: 'exploring',
        skills: ['visionaryThinking']
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'success_outcome']
  },

  {
    nodeId: 'yaquin_simulation_fail',
    speaker: 'Yaquin',
    content: [{
      text: "Posted the response. Waited.\n\nMinutes pass. Then more reviews flood in.\n\n'Can't even take feedback.'\n'This is why I don't trust non-credentialed instructors.'\n'Dr. Lam is right. Unsubscribed.'\n\nMade it worse. Way worse.\n\nI reacted instead of responded. Let the fear drive. Now I've given them ammunition.\n\nCan we try again? Different approach?",
      emotion: 'devastated',
      interaction: 'small',
      variation_id: 'fail_v1',
      richEffectContext: 'error',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'fail_retry',
        text: "Yes. Delete the response. Think it through. We can recover from this.",
        nextNodeId: 'yaquin_simulation_phase_2',
        pattern: 'building',
        skills: ['resilience', 'adaptability']
      },
      {
        choiceId: 'fail_learn',
        text: "This is a lesson. Reactive responses hurt more than silence. Let's be strategic.",
        nextNodeId: 'yaquin_simulation_phase_2',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'learningAgility'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'failure_state', 'recovery']
  },

  {
    nodeId: 'yaquin_simulation_aftermath',
    speaker: 'Yaquin',
    content: [{
      text: "A week later. Dr. Lam responded. Publicly.\n\n'Impressed by how Yaquin handled this feedback. Rare to see an educator acknowledge gaps AND stand by their methodology. I'd be happy to review the timing chart. This is how professional development should work.'\n\nFive new five-star reviews. All mentioning the exchange.\n\n'This is how a teacher should respond to criticism.'\n'Bought the course BECAUSE of how he handled Dr. Lam.'\n'Integrity matters more than perfection.'\n\nThe worst review became the best marketing.\n\nNot because I won the argument. Because I didn't make it a fight.\n\nThat's what eight years of patient care taught me. Not how to be right. How to listen. How to grow. How to stay open when it hurts.\n\nThat's the real curriculum. The one textbooks can't teach.",
      emotion: 'proud_reflective',
      interaction: 'nod',
      variation_id: 'aftermath_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'aftermath_return',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      },
      {
        choiceId: 'aftermath_insight',
        text: "The real curriculum. That's what you're actually teaching.",
        nextNodeId: 'yaquin_simulation_insight',
        pattern: 'analytical',
        skills: ['communication'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'resolution']
  },

  {
    nodeId: 'yaquin_simulation_insight',
    speaker: 'Yaquin',
    content: [{
      text: "The real curriculum.\n\nAll this time, I thought I was teaching dental skills. Mixing paste. Calming patients. Reading cues.\n\nBut the students who stay? The ones who thrive? They're not just learning technique.\n\nThey're learning how to learn. How to take criticism. How to grow without breaking.\n\nDr. Lam taught me that. In public. Painfully. And now 200 students got to watch me learn it.\n\nMaybe that's worth more than perfect content. A teacher who models growth.\n\nThank you. For helping me see it.\n\nSee Samuel. Tell him the curriculum expanded today.",
      emotion: 'grateful_enlightened',
      interaction: 'bloom',
      variation_id: 'insight_v1',
      useChatPacing: true
    }],
    onEnter: [
      {
        characterId: 'yaquin',
        addKnowledgeFlags: ['yaquin_curriculum_insight'],
        thoughtId: 'growth-curriculum'
      }
    ],
    choices: [
      {
        choiceId: 'insight_return',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'insight', 'completion']
  }
]

export const yaquinEntryPoints = {
  INTRODUCTION: 'yaquin_introduction',
  PHASE2_ENTRY: 'yaquin_phase2_entry',
  /** Course review simulation - handling controversial feedback */
  SIMULATION: 'yaquin_simulation_intro'
} as const

export const yaquinDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(yaquinDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: yaquinEntryPoints.INTRODUCTION,
  metadata: {
    title: "Yaquin's Course",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: yaquinDialogueNodes.length,
    totalChoices: yaquinDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}