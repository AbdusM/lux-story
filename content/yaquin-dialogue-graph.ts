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
        // NOTE: Strategic targeting - shake applied only to the self-doubt question, not the confident teaching setup.
        // This isolates the vulnerable moment of imposter syndrome, emphasizing the internal conflict.
        text: `Home office in Hoover. Ring light on. Camera rolling.

Forget the textbook. Chapter 4's garbage. Here's how you actually mix alginate without gagging patients.

<shake>Is it garbage? Or am I just uneducated?</shake>`,
        emotion: 'conflicted',
        variation_id: 'yaquin_intro_v1',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_intro_garbage',
        text: "If the textbook doesn't work, it's garbage.",
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
        nextNodeId: 'yaquin_credential_gap',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'yaquin_intro_content',
        text: "You're teaching online?",
        nextNodeId: 'yaquin_creator_path',
        pattern: 'exploring',
        skills: ['digitalLiteracy']
      },
      {
        choiceId: 'yaquin_intro_patience',
        text: "[Let the self-doubt sit. He's working something out.]",
        nextNodeId: 'yaquin_credential_gap',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
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
        text: `Imagine... the textbook says 'mix 45 seconds.' Do that. sets in the bowl. Mold ruined.|8 years experience. Know the paste feel. Know patient fear.|Books don't teach that.`,
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'textbook_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_tacit_knowledge',
        text: "That's knowledge nobody else can teach.",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'analytical',
        skills: ['pedagogy']
      },
      {
        choiceId: 'yaquin_teach_that',
        text: "So teach THAT. The real stuff.",
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
        text: `'Just' an assistant. No dental school.|But dentists ask me about difficult patients. Ask me to train new hires.|Doing the work. No paper.`,
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'credential_v1',
        useChatPacing: true
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
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'helping',
        skills: ['encouragement'],
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
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_build_own_credential',
        text: "What if your students are the proof?",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
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
        text: `Started six months ago. Phone videos. No plan.|"Here's what textbooks miss."|87 followers. Some dental assistants. Some students. Few actual dentists watching.|<jitter>Real question. teaching online or shouting into void?</jitter>`,
        emotion: 'curious',
        variation_id: 'creator_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_creator_continue',
        text: "87 followers who found value. That's not nothing.",
        nextNodeId: 'yaquin_curriculum_dream',
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
        nextNodeId: 'yaquin_curriculum_dream',
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
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'building',
        skills: ['leadership', 'collaboration'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
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
        text: `Want to build a course. 'The Real Dental Assistant.'|Reality. not theory. Calm crying kids. Mix paste. Anticipate doctor needs.|<jitter>But the syllabus... keeps adding history. Anatomy. Ethics.</jitter>`,
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
        text: `This list. 8 years instinct → checklist. Impossible.

<shake>One pilot this weekend. Pick wrong. nobody watches. Back to cleaning spit valves.</shake>`,
        emotion: 'tense',
        variation_id: 'curriculum_setup_v2',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
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
        text: `"Hello class. Today. 19th century forceps."|"Bored watching myself. Nobody pays $50 for this. Sound like professors I hated."`,
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
        text: `Pink. Goopy. 30 seconds before stone. Go!

<bloom>That's it.</bloom> Not lecture. Cooking show for teeth.`,
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
        skills: ['branding']
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
        text: `You're nervous. Drill's loud. Watch my eyes. Breathe with me.

All day. Don't fix teeth. fix fear. That's what I'm selling.`,
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
        text: `Video ready. Platform ready.|<jitter>Publish. dentists see it. Might fire me. 'Who's this guy?'</jitter>|Don't publish. guy shouting at phone in basement.`,
        emotion: 'anxious',
        variation_id: 'launch_v1',
        useChatPacing: true
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
        skills: ['strategy']
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
        text: `Live.|First comment: 'Finally someone explains mixing ratio!'|Doing it. Actually doing it. Teacher.`,
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
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_launched']
      }
    ],
    tags: ['ending', 'yaquin_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }  },

  {
    nodeId: 'yaquin_audience_first',
    speaker: 'Yaquin',
    content: [
      {
        text: `Smart. Brand name. 'Dental Ninja.' Build trust, then sell.|Safer. Still forward.|Thank you. Kept me from reckless mistake.`,
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
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_building_audience']
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
        text: `Yeah. Back to school. Get degree. Maybe then people listen.|Nice fantasy. Just an assistant.|Thanks for listening.`,
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

  {
    nodeId: 'yaquin_farewell',
    speaker: 'Yaquin',
    content: [
      {
        text: `Lot of editing ahead.|See Samuel? Tell him. class is in session.`,
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
        addGlobalFlags: ['yaquin_arc_complete']
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
      text: `It worked. The course launched. 127 students enrolled.

Eight weeks later. Three laptops. Support tickets. Dashboards.

<shake>47 unread messages. 15 refunds. DDS calling it "amateur hour."</shake>

Teaching? Easy. Running a course business? That's the real education.`,
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
      text: `Self-paced doesn't work. Need live instruction. Videos too fast. Can't stay motivated.

Great content, wrong format. Need teacher, not YouTube.

<shake>Half career-switchers. crushing it. Other half. boss-mandated. Struggling. Refunds.</shake>`,
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
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'crisis']
  },

  {
    nodeId: 'yaquin_p2_dds_comment',
    speaker: 'Yaquin',
    content: [{
      text: `**Dr. Sarah Chen, DDS**: "Amateur hour. No credentials, structure, accountability. YouTube videos for $497. Assistants deserve real education, not shortcuts."

Not wrong about credentials. Assistant teaching assistants. No degree. No training.

Want to ignore her. Defend myself. Or... maybe she's right.`,
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
      text: `30-day guarantee. No questions. Stand behind quality.

Boss made me. Too hard. Didn't finish, want money.

Honor all. lose $7,500. Get strict. look like scammer.

<jitter>Worst part? Don't know if they're right. Maybe IS too hard. Maybe IS "amateur hour."</jitter>`,
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
      text: `Ignore Dr. Chen. Or...

Invite her to review? Add as credentialed advisor?

Or respond publicly: "Not a DDS. 40 hours/week doing actual work. Students need both perspectives."

Defend ground or acknowledge gap?`,
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
      text: `Data:
**Self-motivated**: 85% completion. Glowing reviews.
**Boss-mandated**: 32% completion. Most refunds.

**Option 1**: Cohort-based. Fewer students, live, higher price.
**Option 2**: Improve self-paced. Forums, office hours.
**Option 3**: Two-tier. Self-paced ($497) + Cohort ($1,497).

What would you do?`,
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
    }  },

  {
    nodeId: 'yaquin_p2_scaling_offer',
    speaker: 'Yaquin',
    content: [{
      text: `Three Birmingham offices reached out. License course for new hires. 50+ students.

**Offer**: $15K/office, annual. They onboard, I provide content.

$45K. Nine months salary.

But not teaching. licensing. Content creator, not educator.

That what I want?`,
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
      text: `Keep self-paced for motivated learners. Add cohort "Dental Mastery". 8 weeks, live, small groups. Maybe reach out to Dr. Chen. Co-teach advanced modules.

Not about perfect. Serving students where they are. Some need independence. Some need structure. Why not both?`,
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
      text: `Two weeks later. Implemented changes:
• Cohort program: 24 students @ $1,497
• Self-paced: office hours, forum
• Refunds: approved 8, denied 7
• Dr. Chen: reviewing curriculum (for fee)

Revenue up. Completion up. Refunds down.

More important? Learning business, not just teaching skill.`,
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
      text: `Mixed. Refunded students. 1-star reviews: "Bait and switch." Stayed students thriving: "Real teaching now, not just videos."

**Student**: "Almost quit. Cohort saved me. Getting hired next week because of you."

That's why. Not revenue. Not validation. That message.`,
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
      text: `Dr. Chen reviewed curriculum. Tore apart. "Outdated. Wrong. Too simplified." Brutal.

She was right. Updated everything.

Then: "Missing the why. Teach how, but students need why."

Now paid consultant. Reviews content. Cited as clinical advisor.

Critics → collaborators if humble enough to listen.`,
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
      text: `{{met_jordan:Jordan calls it 'user experience.' I call it survival.|I learned that from running the clinic floor.}}|If the student is confused, it's my fault. If the tool is hard to use, fix the tool.|Academics blame the student. I blame the design.`,
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
      text: `Started. assistant who thought textbooks garbage.|Now. creator who knows content is 20%.|Other 80%? Operations. Strategy. Communication. Resilience.|*Smiles.*|200+ students. Some finish. Some quit. Bad reviews.|Okay with that.|Because who succeed? Know things textbooks never taught.|Just like I did.`,
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
      text: `For being here when messy.|*Packing equipment.*|Cohort Monday. Twenty students. Live sessions. Real teaching.|See Samuel? Tell him. building business that teaches.`,
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
      text: `*Stops packing. Looks at you.*|Biggest challenge?|*Thinks.*|Scaling. How teach 200 students same quality as 20?|But you. what's your challenge?|You help people. But who helps you figure out your path?`,
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
      text: `*Nods.*|Know that feeling.|But you here. Helping. That's path.|Not about having all answers.|About showing up when messy.|*Resumes packing.*|You doing that.|See Samuel. Tell him Yaquin says you ready.`,
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
      }
    ],
    tags: ['reciprocity', 'yaquin_arc']
  }
]

export const yaquinEntryPoints = {
  INTRODUCTION: 'yaquin_introduction',
  PHASE2_ENTRY: 'yaquin_phase2_entry'
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