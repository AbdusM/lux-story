/**
 * Samuel Washington's Dialogue Graph
 * The Station Keeper - Hub character who guides travelers between platforms
 *
 * Role: Navigator, mentor, former traveler who chose to guide others
 * Background: Former Southern Company engineer, Birmingham native
 * Voice: Warm, patient, knowing but not mystical
 */

import {
  DialogueNode,
  DialogueGraph
} from '@/lib/dialogue-graph'
import { mayaRevisitEntryPoints } from './maya-revisit-graph'

export const samuelDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'samuel_introduction',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Welcome to Grand Central Terminus. I'm Samuel Washington, and I keep this station.\n\nYou have the look of someone standing at a crossroads. Not sure which way to turn, which path to take. The good news? You're in exactly the right place.",
        emotion: 'warm',
        variation_id: 'intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_what_is_this',
        text: "What is this place?",
        nextNodeId: 'samuel_explains_station',
        pattern: 'exploring',
        skills: ['communication', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_about_platforms',
        text: "I see platforms. Where do they lead?",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_who_are_you',
        text: "Who are you, really?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  // ============= STATION EXPLANATION =============
  {
    nodeId: 'samuel_explains_station',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "This station exists for people at a turning point. Not on any map. You can't find it unless you need it.\n\nEvery platform represents a different path. The travelers here? All asking the same question: 'What am I supposed to do?'",
        emotion: 'knowing',
        variation_id: 'explains_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_your_story',
        text: "Were you a traveler once?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'ready_to_explore',
        text: "I'm ready to explore the platforms.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'samuel_explains_platforms',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Each platform leads somewhere different.\n\nPlatform 1—The Care Line. People who heal, teach, help others grow.\n\nPlatform 3—The Builder's Track. Engineers, makers, creators.\n\nYou don't choose by logic alone. Talk to travelers. See which resonates.\n\nYour path reveals itself through connection.",
        emotion: 'reflective',
        variation_id: 'platforms_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_backstory',
        text: "What's your story? How did you become the Station Keeper?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_to_meet',
        text: "I'd like to meet someone.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        skills: ['communication']
      }
    ]
  },

  // ============= SAMUEL'S BACKSTORY =============
  {
    nodeId: 'samuel_backstory_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You want to know my story? Fair question.\n\nI was an engineer at Southern Company for twenty-three years. Power plants, electrical grids, the infrastructure that keeps Birmingham running. Good job, stable, respected. My father was proud - first in our family to work in an office instead of at Sloss Furnaces.",
        emotion: 'reflective',
        variation_id: 'backstory_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_why_leave',
        text: "Why did you leave?",
        nextNodeId: 'samuel_backstory_revelation',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'acknowledge',
        text: "That sounds like a good life.",
        nextNodeId: 'samuel_backstory_revelation',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_backstory']
      }
    ]
  },

  {
    nodeId: 'samuel_backstory_revelation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It was a good life. But it wasn't MY life.\n\nOne day, standing in front of Vulcan, looking down at Birmingham. Twenty-three years building other people's systems.\n\nI was good at it. But I'd never asked what I wanted to build.",
        emotion: 'vulnerable',
        variation_id: 'revelation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_did_you_want',
        text: "What did you want to build?",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'relate',
        text: "I understand that feeling.",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'acquaintance'
        }
      }
    ]
  },

  // ============= PAUSE: After Backstory Revelation (Breathing Room) =============
  {
    nodeId: 'samuel_pause_after_backstory',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That was a lifetime ago. But it still matters.",
        emotion: 'thoughtful',
        variation_id: 'pause_backstory_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_continue_after_backstory',
        text: "(Continue)",
        nextNodeId: 'samuel_purpose_found',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'samuel_arc']
  },

  {
    nodeId: 'samuel_purpose_found',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I wanted to help people find their own blueprints. Not hand them answers. Create space for the right questions.\n\nThat's this station. I didn't build it. It was waiting for someone to keep it.\n\nTime works differently here. Long enough to see hundreds find their way.",
        emotion: 'warm',
        variation_id: 'purpose_v1'
      }
    ],
    choices: [
      {
        choiceId: 'beautiful',
        text: "That's a beautiful purpose.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_for_my_blueprint',
        text: "I'm ready to find my blueprint.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'how_did_you_find_station',
        text: "How did you find the station?",
        nextNodeId: 'samuel_traveler_origin',
        pattern: 'exploring',
        skills: ['communication', 'creativity'],
        visibleCondition: {
          trust: { min: 5 }
        },
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_purpose']
      }
    ]
  },

  // ============= SAMUEL'S TRAVELER ORIGIN (High Trust - Split for Chat Pacing) =============
  {
    nodeId: 'samuel_traveler_origin',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I was a traveler once.\n\nThirty-five years ago. Same letter. Same choice.",
        emotion: 'vulnerable_opening',
        variation_id: 'traveler_origin_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'samuel_origin_curious',
        text: "What was your crossroads?",
        nextNodeId: 'samuel_origin_choice',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'samuel_origin_listen',
        text: "[Listen]",
        nextNodeId: 'samuel_origin_choice',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_samuel_was_traveler']
      }
    ],
    tags: ['backstory', 'fridge_logic_fix', 'samuel_arc']
  },

  {
    nodeId: 'samuel_origin_choice',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "VP of Engineering at Southern Company. Or stay technical.\n\nPower and money. Or do what I loved.",
        emotion: 'reflective',
        variation_id: 'origin_choice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_which_train',
        text: "Which did you choose?",
        nextNodeId: 'samuel_origin_wrong_train',
        pattern: 'analytical',
        skills: ['communication']
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  {
    nodeId: 'samuel_origin_wrong_train',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Management. Twenty years in meetings about meetings.\n\nEvery promotion moved me further from why I became an engineer.",
        emotion: 'regretful',
        variation_id: 'wrong_train_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_what_changed',
        text: "What made you realize?",
        nextNodeId: 'samuel_origin_daughter_moment',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  {
    nodeId: 'samuel_origin_daughter_moment',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "My daughter. Nineteen, at her own crossroads.\n\nI brought her here. Saw the relief in her eyes when she boarded her train.",
        emotion: 'bittersweet',
        variation_id: 'daughter_moment_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_realization',
        text: "And you realized...",
        nextNodeId: 'samuel_origin_keeper_choice',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'ask_about_daughter',
        text: "Where is she now?",
        nextNodeId: 'samuel_daughter_path',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  {
    nodeId: 'samuel_origin_keeper_choice',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I'd been on the wrong train for twenty years.\n\nCame back through. Chose differently.\n\nI chose to stay. To help others avoid my mistakes.",
        emotion: 'purposeful',
        variation_id: 'keeper_choice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_courage_recognition',
        text: "That takes real courage.",
        nextNodeId: 'samuel_daughter_path',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_about_daughter_after',
        text: "Where is your daughter now?",
        nextNodeId: 'samuel_daughter_path',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_about_letters',
        text: "The letters... do you send them?",
        nextNodeId: 'samuel_letter_system',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  // ============= SAMUEL'S DAUGHTER (Emotional Anchor) =============
  {
    nodeId: 'samuel_daughter_path',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Biomedical engineer at the CDC. Designs diagnostic systems.\n\nCalls every Sunday. Still thanks me for bringing her here.\n\nShe could have been a lawyer. That's what I wanted.\n\nBut she boarded her own train.\n\nWatching her find that—that's when I knew.",
        emotion: 'paternal_pride',
        variation_id: 'daughter_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_purpose',
        text: "So you stayed to give others what you gave her.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_about_letters_from_daughter',
        text: "And the letters people receive... you send those?",
        nextNodeId: 'samuel_letter_system',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_about_daughter']
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  // ============= LETTER SYSTEM EXPLANATION (Fridge Logic Fix) =============
  {
    nodeId: 'samuel_letter_system',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I write one every night. To someone whose name comes to me.\n\nLike you knew [character] needed your perspective. The station speaks through us.\n\nAfter thirty-five years, you learn to trust what you can't explain.",
        emotion: 'mystical_acceptance',
        variation_id: 'letter_system_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'understand_letters',
        text: "So the station chose you to guide others.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_letter_system']
      }
    ],
    tags: ['fridge_logic_fix', 'samuel_arc']
  },

  // ============= HUB: INITIAL (Discovery-based character routing) =============
  {
    nodeId: 'samuel_hub_initial',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Three travelers tonight. Each at their own crossroads.\n\nBefore I tell you about them—when you think about your decision, what pulls at you most?",
        emotion: 'curious',
        variation_id: 'hub_initial_v1'
      }
    ],
    requiredState: {
      lacksGlobalFlags: ['met_maya', 'met_devon', 'met_jordan']
    },
    choices: [
      {
        choiceId: 'hub_helping_others',
        text: "Wanting to help people, but not sure I'm on the right path for it.",
        nextNodeId: 'samuel_discovers_helping',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          addKnowledgeFlags: ['player_values_helping']
        }
      },
      {
        choiceId: 'hub_systems_logic',
        text: "I like solving problems logically, but I feel like something's missing.",
        nextNodeId: 'samuel_discovers_building',
        pattern: 'building',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          addKnowledgeFlags: ['player_values_logic']
        }
      },
      {
        choiceId: 'hub_multiple_paths',
        text: "I've tried different things and I'm not sure if that's okay.",
        nextNodeId: 'samuel_discovers_exploring',
        pattern: 'exploring',
        skills: ['adaptability', 'communication'],
        consequence: {
          characterId: 'samuel',
          addKnowledgeFlags: ['player_values_adaptability']
        }
      },
      {
        choiceId: 'hub_education_reform',
        text: "I'm interested in education and leadership, but the system feels broken.",
        nextNodeId: 'samuel_discovers_tess',
        pattern: 'building',
        skills: ['visionaryThinking', 'education']
      },
      {
        choiceId: 'hub_not_sure',
        text: "I'm not sure what I'm looking for yet.",
        nextNodeId: 'samuel_hub_fallback',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"],
        consequence: {
          characterId: 'samuel',
          addKnowledgeFlags: ['player_uncertain']
        }
      }
    ]
  },

  // ============= DISCOVERY PATH: HELPING → MAYA =============
  {
    nodeId: 'samuel_discovers_helping',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's a particular kind of struggle. When your heart knows what it wants but the path feels... complicated.\n\nThere's someone on Platform 1 who understands that. Maya Chen - brilliant pre-med student at UAB. She's supposed to become a doctor, and she's good enough.\n\nBut between what she's 'supposed' to do and what she dreams about, there's a gap that's tearing her apart.",
        emotion: 'knowing',
        variation_id: 'discovers_helping_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_maya',
        text: "I'd like to talk to her.",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'ask_about_others',
        text: "Who else is here tonight?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      }
    ]
  },

  // ============= DISCOVERY PATH: BUILDING → DEVON =============
  {
    nodeId: 'samuel_discovers_building',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The engineer's dilemma. You can map every system, but life throws you something that doesn't fit the flowchart.\n\nDevon Kumar is on Platform 3. UAB engineering student. He built a decision tree to help his grieving father. It failed catastrophically.\n\nNow he's trying to debug human connection.",
        emotion: 'understanding',
        variation_id: 'discovers_building_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_devon',
        text: "That sounds... familiar. I'll find him.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['problemSolving'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'devon_empathy',
        text: "He must feel so lost. Trying to help but not knowing how.",
        nextNodeId: 'devon_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'ask_about_others',
        text: "Are there other travelers here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: EXPLORING → JORDAN =============
  {
    nodeId: 'samuel_discovers_exploring',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Seven jobs in twelve years. Jordan Packard. Conference Room B, mentorship panel.\n\nShe's terrified thirty students will see chaos instead of evolution. Impostor syndrome while she's the expert.\n\nThe question isn't 'what should I become?' It's 'how do I own what I've been?'",
        emotion: 'amused_empathetic',
        variation_id: 'discovers_exploring_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_jordan',
        text: "I need to hear her story.",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['communication', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'ask_about_others',
        text: "Tell me about the others first.",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'patience',
        skills: ['communication', 'collaboration', 'adaptability']
      }
    ]
  },

  // ============= DISCOVERY PATH: EDUCATION → TESS =============
  {
    nodeId: 'samuel_discovers_tess',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The system works for some, but fails many. Tess is in the Waiting Room. She's a Career Counselor who's realizing she can't counsel students into a broken world—she has to build a new one.\n\nShe's trying to start a school that counts 'hiking the Appalachian Trail' as senior year physics.",
        emotion: 'intrigued',
        variation_id: 'discovers_tess_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_tess',
        text: "That sounds radical. I want to meet her.",
        nextNodeId: 'tess_introduction', // Links to new graph
        pattern: 'building',
        skills: ['curiosity'],
        consequence: {
          addGlobalFlags: ['met_tess']
        }
      },
      {
        choiceId: 'ask_about_others_tess',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= FALLBACK: UNSURE → GUIDED CHOICE =============
  {
    nodeId: 'samuel_hub_fallback',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's honest. That's why you're here.\n\nTonight's travelers:\n\n**Maya Chen** - Platform 1. Pre-med who wants to help, but maybe differently.\n\n**Devon Kumar** - Platform 3. Engineer learning logic isn't enough.\n\n**Jordan Packard** - Conference Room B. Seven jobs. One question.\n\nWho speaks to you?",
        emotion: 'gentle_guide',
        variation_id: 'fallback_v1'
      }
    ],
    choices: [
      {
        choiceId: 'choose_maya',
        text: "Maya - the helping but uncertain path.",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'choose_devon',
        text: "Devon - logic meeting its limits.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['criticalThinking', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'choose_jordan',
        text: "Jordan - owning a non-linear journey.",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['adaptability', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      }
    ]
  },

  // ============= OTHER TRAVELERS (Optional exploration before committing) =============
  {
    nodeId: 'samuel_other_travelers',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The full picture:\n\n**Maya Chen** - Platform 1. Pre-med brilliance, family expectations, robotics dreams.\n\n**Devon Kumar** - Platform 3. Systems engineer who tried to debug grief.\n\n**Jordan Packard** - Conference Room B. Seven careers. Adaptability or chaos?\n\nWho do you want to meet?",
        emotion: 'patient_informative',
        variation_id: 'other_travelers_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_maya_alt',
        text: "Maya on Platform 1.",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'meet_devon_alt',
        text: "Devon on Platform 3.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['criticalThinking', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'meet_jordan_alt',
        text: "Jordan in Conference Room B.",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['adaptability', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      }
    ]
  },


  // ============= MAYA REFLECTION GATEWAY (First return from Maya) =============
  {
    nodeId: 'samuel_maya_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Welcome back. I can see the conversation went deep - Maya has that effect on people who really listen to her.\n\nHow are you feeling about what just happened between you two?",
        emotion: 'warm_observant',
        variation_id: 'reflection_gateway_v3_clean'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_maya']
    },
    choices: [
      {
        choiceId: 'hope_i_helped',
        text: "I hope I helped her.",
        nextNodeId: 'samuel_reflect_on_influence',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'unsure_what_i_did',
        text: "I'm not sure what I actually did.",
        nextNodeId: 'samuel_reflect_on_influence',
        pattern: 'exploring',
        skills: ['criticalThinking', 'adaptability']
      },
      {
        choiceId: 'skip_reflection',
        text: "She made her own choice.",
        nextNodeId: 'samuel_reflect_on_agency',
        pattern: 'patience',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_maya']
      }
    ]
  },

  // ============= REFLECTION: Understanding Influence vs. Agency - Part 1 =============
  {
    nodeId: 'samuel_reflect_on_influence',
    learningObjectives: ['samuel_reflective_observation'],
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You did help her. But not in the way most people think 'helping' works.\n\nYou didn't fix her problem. You created space for her to see options she couldn't see before.\n\nYou've got the helper instinct - what drives UAB resident advisors and Birmingham guidance counselors.",
        emotion: 'teaching',
        variation_id: 'influence_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_samuel_influence',
        text: "(Continue)",
        nextNodeId: 'samuel_reflect_on_influence_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel'
      }
    ]
  },

  // ============= REFLECTION: Understanding Influence vs. Agency - Part 2 =============
  {
    nodeId: 'samuel_reflect_on_influence_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "But I learned at Southern Company: the best mentors help people find their own answers, not just feel supported.\n\nThese reflection skills you're using right now? They're the foundation of counseling, coaching, teaching. Real careers in Birmingham that value this exact capacity.",
        emotion: 'teaching',
        variation_id: 'influence_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'what_did_maya_choose',
        text: "What path did she choose?",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'exploring',
        skills: ['communication', 'creativity']
      },
      {
        choiceId: 'how_do_you_know',
        text: "How do you know I didn't just tell her?",
        nextNodeId: 'samuel_systemic_proof',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'accept_insight',
        text: "That distinction matters.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'patience',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_reflect_on_agency',
    learningObjectives: ['samuel_abstract_conceptualization'],
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Exactly. She made her own choice. That's the most important thing.\n\nYou understand agency. That's advanced.\n\nTook me fifteen years to learn I can't engineer people's decisions. We illuminate paths. Travelers choose.",
        emotion: 'proud',
        variation_id: 'agency_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_agency_reflection',
        text: "(Continue)",
        nextNodeId: 'samuel_reflect_on_agency_pt2',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_facilitator_skills']
      }
    ]
  },

  {
    nodeId: 'samuel_reflect_on_agency_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Innovation Depot (Birmingham's startup hub) mentors do exactly what you just did: ask questions, hold space, let the founder discover their path. That's facilitator instinct - a professional skill that drives leadership development, organizational psychology, HR careers across this city.",
        emotion: 'proud',
        variation_id: 'agency_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'what_path_did_she_choose',
        text: "Which path did she choose?",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'is_that_what_you_do',
        text: "Is that what you do here? Be a mirror?",
        nextNodeId: 'samuel_station_keeper_truth',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  // ============= REFLECTION: Maya's Specific Choice =============
  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She went back to studying. Sometimes the timing isn't right. Or maybe we pushed too hard, too fast.\n\nRespecting someone's 'no' is just as important as encouraging their 'yes'. You gave her space. That counts.",
        emotion: 'gentle_truth',
        variation_id: 'early_exit_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['early_connection_made']
    },
    choices: [
      {
        choiceId: 'wish_i_could_do_more',
        text: "I wish I could have done more.",
        nextNodeId: 'samuel_patience_wisdom',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'timing_matters',
        text: "Timing matters.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['adaptability', 'timeManagement']
      }
    ]
  },

  // NUANCE: Robotics + Patience
  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing robotics. But what struck me was how she got there.\n\nYou didn't push. You waited. You let the silence do the work.\n\nThat's the difference between forcing a flower open and letting it bloom. She chose this because she felt safe, not because she was persuaded.",
        emotion: 'deep_respect',
        variation_id: 'robotics_patience_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_robotics'],
      patterns: {
        patience: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'patience_was_key',
        text: "The silence felt necessary.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'she_needed_space',
        text: "She just needed room to breathe.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  // NUANCE: Robotics + Analytical
  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing robotics. You helped her see the logic of it - that UAB has a program, that it's a valid field.\n\nSometimes passion needs a scaffold. You built that for her. You took a dream that felt impossible and gave it structure.",
        emotion: 'affirming_analytical',
        variation_id: 'robotics_analytical_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_robotics'],
      patterns: {
        analytical: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'structure_supports_dreams',
        text: "Dreams need foundations.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'logic_validated_feeling',
        text: "The facts helped her trust her feelings.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing robotics. The path she's been afraid to name out loud because it felt like betraying twenty years of her parents' sacrifice.\n\nYou helped her see that honoring their love doesn't require abandoning herself. That's wisdom most people spend decades learning.",
        emotion: 'reflective',
        variation_id: 'robotics_path_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_robotics']
    },
    choices: [
      {
        choiceId: 'how_do_you_know_robotics',
        text: "How do you know that's what she'll choose?",
        nextNodeId: 'samuel_station_sees_all',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'glad_she_found_it',
        text: "I'm glad she found that clarity.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'what_about_me',
        text: "What about my path?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring',
        skills: ['adaptability', 'criticalThinking']
      }
    ]
  },

  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing the hybrid path - biomedical engineering. The road where she doesn't have to choose between her parents' dreams and her own.\n\nYou helped her see both paths could honor her family. You showed her that 'and' is sometimes more powerful than 'or.' That takes someone who understands complexity, not just solutions.",
        emotion: 'appreciative',
        variation_id: 'hybrid_path_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_hybrid']
    },
    choices: [
      {
        choiceId: 'perfect_solution',
        text: "It does seem like the perfect solution.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'she_found_her_bridge',
        text: "She found her own bridge.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_pattern_am_i_showing',
        text: "What pattern am I showing?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      }
    ]
  },

  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing to keep exploring. Not rushing the decision, not forcing clarity before it's ready to emerge.\n\nYou gave her permission to not know yet. In a world that demands immediate answers, that's a profound gift. That takes someone comfortable with ambiguity - someone patient.",
        emotion: 'knowing',
        variation_id: 'self_path_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_self']
    },
    choices: [
      {
        choiceId: 'is_that_okay',
        text: "Is it okay that she doesn't have an answer yet?",
        nextNodeId: 'samuel_patience_wisdom',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'recognize_the_gift',
        text: "Sometimes not knowing is the answer.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_does_that_say',
        text: "What does that say about me?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence']
      }
    ]
  },

  // ============= CONTEMPLATION MOMENTS (Optional Depth) =============
  {
    nodeId: 'samuel_station_sees_all',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station doesn't just connect platforms. It connects moments. I saw her at the robotics lab when she was sixteen, sneaking in after her parents thought she was at SAT prep.\n\nShe's always known. You just helped her believe knowing was allowed.",
        emotion: 'mystical_truth',
        variation_id: 'station_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_station_truth',
        text: "[Nod in understanding]",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_patience_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "More than okay. Courageous.\n\nOur world demands you choose fast. Lock in your path before you've walked it.\n\nMaya sitting with uncertainty? That's refusing to let urgency override truth.\n\nNot knowing is honest. The best facilitators hold space for emergence.",
        emotion: 'wise',
        variation_id: 'patience_wisdom_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_patience_wisdom',
        text: "(Continue)",
        nextNodeId: 'samuel_patience_wisdom_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_coaching_skills']
      }
    ]
  },

  {
    nodeId: 'samuel_patience_wisdom_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You just demonstrated a professional competency that career counselors, coaches, and organizational development specialists spend years developing.",
        emotion: 'wise',
        variation_id: 'patience_wisdom_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_patience',
        text: "That's a different kind of strength.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_systemic_proof',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Because the station remembers. If you'd tried to control her - 'You should be a doctor,' 'You should follow your passion' - her trust in you wouldn't have grown. But it did. The system doesn't lie.\n\nTrust is how the station measures genuine connection. And Maya trusted you because you listened without an agenda.",
        emotion: 'knowing',
        variation_id: 'systemic_proof_v1'
      }
    ],
    choices: [
      {
        choiceId: 'trust_as_measurement',
        text: "Trust as a measurement of authenticity.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_station_keeper_truth',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I don't give directions. I help them see what they already know.\n\nI followed other people's blueprints for twenty-three years. Now I help people draw their own.\n\nThe best guides don't lead. They witness.",
        emotion: 'vulnerable_wisdom',
        variation_id: 'keeper_truth_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'witness_not_lead',
        text: "Witness, not lead.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_your_pattern_emerges',
    learningObjectives: ['samuel_active_experimentation'],
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your path? It's being written right now, in how you show up for others.\n\nSome people come to this station knowing exactly what they want to build. Others come to discover their purpose through building others up. You're in the second group. That's not a lesser path - it's often the deeper one.",
        emotion: 'reflective',
        variation_id: 'pattern_emerges_v1'
      }
    ],
    choices: [
      {
        choiceId: 'accept_the_pattern',
        text: "I'm starting to see that.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'but_what_specifically',
        text: "But what does that mean, specifically?",
        nextNodeId: 'samuel_specificity_trap',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_specificity_trap',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "'What specifically should I do?' That keeps people stuck.\n\nThe pattern is bigger than any role. You hold space. Ask questions that matter. Meet people in uncertainty.\n\nThose skills work everywhere. The form will emerge.\n\nTrust the pattern.",
        emotion: 'patient_wisdom',
        variation_id: 'specificity_trap_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'trust_the_pattern',
        text: "Trust the pattern.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_contemplation_offer',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "We can keep talking about Maya. There's value in sitting with an experience.\n\nOr, if you're ready, there are other travelers. Each one will show you something different.",
        emotion: 'offering_space',
        variation_id: 'contemplation_offer_v1'
      }
    ],
    choices: [
      {
        choiceId: 'contemplate_more',
        text: "Tell me more about what you saw.",
        nextNodeId: 'samuel_deep_reflection',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'ready_for_next',
        text: "I'm ready to meet someone else.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      },
      {
        choiceId: 'revisit_maya',
        text: "Can I talk to Maya again?",
        nextNodeId: 'samuel_maya_revisit_guidance',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'collaboration']
      }
    ]
  },

  {
    nodeId: 'samuel_deep_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I saw you listening to what Maya wasn't saying. Most people hear the words - 'I'm pre-med, I have good grades' - and think they understand.\n\nYou heard the weight underneath the words.\n\nThe fear of disappointing her parents. The shame of wanting something different. The loneliness of succeeding at a path that isn't yours.",
        emotion: 'deep_knowing',
        variation_id: 'deep_reflection_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_deep_reflection',
        text: "(Continue)",
        nextNodeId: 'samuel_deep_reflection_pt2',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'samuel_deep_reflection_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's not a skill they teach in school. That's wisdom born from your own wrestling. You recognized her struggle because you've felt something like it yourself.",
        emotion: 'deep_knowing',
        variation_id: 'deep_reflection_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'how_did_you_see_that',
        text: "How could you see all that?",
        nextNodeId: 'samuel_station_truth_deep',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'yes_i_have',
        text: "I have felt something like that.",
        nextNodeId: 'samuel_solidarity',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      },
      {
        choiceId: 'ready_now',
        text: "I think I'm ready for the next platform.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ["communication","criticalThinking"]
      }
    ]
  },

  {
    nodeId: 'samuel_station_truth_deep',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station shows me moments. Fragments. Your conversation with Maya, yes, but also... glimpses of what brought you here.\n\nEveryone who finds this place is standing at their own crossroads. You're not just helping Maya find her path. You're finding yours by walking beside her through her uncertainty.",
        emotion: 'mystical',
        variation_id: 'station_truth_deep_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_deep',
        text: "[Sit with this truth]",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_solidarity',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I know you have. That's why you could meet her there. We can only guide people through territory we've walked ourselves.\n\nYour uncertainty isn't a flaw. It's your qualification. The station doesn't call people who have all the answers. It calls people who know how to sit with questions.",
        emotion: 'warm_solidarity',
        variation_id: 'solidarity_v1'
      }
    ],
    choices: [
      {
        choiceId: 'thank_you',
        text: "Thank you for seeing that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"]
      }
    ]
  },

  {
    nodeId: 'samuel_maya_revisit_guidance',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Of course. She'll be glad to see you.\n\nThe relationship you built with her doesn't end when the conversation does. That's one of the gifts of this place - the connections are real, and they persist.\n\nYou'll find her back on Platform 1.",
        emotion: 'encouraging',
        variation_id: 'revisit_guidance_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_maya_revisit',
        text: "Take me to Platform 1.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ]
  },

  // ============= RECIPROCITY ENGINE: SAMUEL REFLECTIONS =============
  // These nodes close the feedback loop when player shares personal information with NPCs
  {
    nodeId: 'samuel_reflects_stable_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What you told Maya. About your parents' stable careers.\n\nThat explains your patience. Solid foundation. You've never had to rush because you've never had to run.\n\nThe station shows me patterns. Your patience is an inheritance.",
        emotion: 'insightful',
        variation_id: 'stable_parents_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_stable_parents'],
      lacksKnowledgeFlags: ['closed_reciprocity_loop'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'never_thought_of_it',
        text: "I never thought of patience as inherited.",
        nextNodeId: 'samuel_inheritance_wisdom',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'makes_sense',
        text: "That actually makes a lot of sense.",
        nextNodeId: 'samuel_pattern_confirmation',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_entrepreneur_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What you told Maya. Parents always building something new.\n\nThat explains your exploring pattern. You see opportunities, not closed doors. Risk feels like possibility.\n\nThe station called you here because you help others see possibility where they see walls.",
        emotion: 'appreciative',
        variation_id: 'entrepreneur_parents_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_entrepreneur_parents'],
      lacksKnowledgeFlags: ['closed_reciprocity_loop'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'pattern_recognition',
        text: "You really do see the patterns, don't you?",
        nextNodeId: 'samuel_pattern_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'helping_see_possibility',
        text: "I try to help people see what's possible.",
        nextNodeId: 'samuel_possibility_keeper',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_struggling_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya mentioned you shared something difficult with her. About watching your parents struggle.\n\nThat kind of witnessing changes you. Makes you see need before it's spoken. Makes you hold space before it's asked for.",
        emotion: 'deep_respect',
        variation_id: 'struggling_parents_reflection_v1_pt1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_struggling_parents'],
      lacksKnowledgeFlags: ['closed_reciprocity_loop'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'continue_struggling_parents_reflection',
        text: "(Continue)",
        nextNodeId: 'samuel_reflects_struggling_parents_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop'],
        trustChange: 1
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_struggling_parents_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You have the helper pattern not because you chose it, but because life taught you early what it means to need help. That's not a burden. That's wisdom.\n\nThe station recognizes servants who serve from understanding, not obligation.",
        emotion: 'deep_respect',
        variation_id: 'struggling_parents_reflection_v1_pt2'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_struggling_parents'],
      lacksKnowledgeFlags: ['closed_reciprocity_loop'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'wisdom_from_struggle',
        text: "I never saw it as wisdom before.",
        nextNodeId: 'samuel_struggle_transformation',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'understanding_not_obligation',
        text: "Understanding, not obligation. I like that framing.",
        nextNodeId: 'samuel_service_philosophy',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_absent_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What you shared with Maya. Success and absence in your family.\n\nYou learned achievement can become a disappearing act. That's why you're patient. You know where rushing leads.\n\nThe station brought you here because you understand: presence matters more than performance.",
        emotion: 'understanding',
        variation_id: 'absent_parents_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_absent_parents'],
      lacksKnowledgeFlags: ['closed_reciprocity_loop'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'presence_over_performance',
        text: "Presence over performance. Still learning that.",
        nextNodeId: 'samuel_presence_teaching',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'hollow_success',
        text: "I've seen what hollow success looks like.",
        nextNodeId: 'samuel_hollow_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_boundaries',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya told me you chose NOT to share when she asked.\n\nRare. Most people perform vulnerability to earn connection. You set a boundary. Kindly but firmly.\n\nThat's mastery. Maya's trust grew because of your 'no,' not despite it.",
        emotion: 'profound_respect',
        variation_id: 'boundaries_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_set_boundary'],
      lacksKnowledgeFlags: ['closed_reciprocity_loop'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'didnt_feel_like_mastery',
        text: "It didn't feel like mastery. Just honesty.",
        nextNodeId: 'samuel_honesty_mastery',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'walls_vs_boundaries',
        text: "Walls and boundaries - that's an important distinction.",
        nextNodeId: 'samuel_boundary_philosophy',
        pattern: 'analytical',
        skills: ["criticalThinking","communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_boundary_wisdom', 'closed_reciprocity_loop']
      }
    ]
  },

  // Continuation nodes for reciprocity reflections
  {
    nodeId: 'samuel_inheritance_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Most people don't. They think traits are just personality.\n\nWe're all carrying patterns we learned before we had words.\n\nYour parents showed you steady work creates space. Security as foundation. You give that gift now.",
        emotion: 'teaching',
        variation_id: 'inheritance_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_inheritance',
        text: "That's a beautiful way to see it.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_pattern_confirmation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It does, doesn't it? The station helps us see these connections. Your foundation gives you a particular kind of wisdom - the ability to be present without urgency.\n\nThat's what Maya needed from you. That's what you had to give.",
        emotion: 'affirming',
        variation_id: 'pattern_confirmation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_confirmation',
        text: "[Nod thoughtfully]",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_pattern_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's what this station is for. I see the patterns because I've learned to watch for them. You're doing the same thing with the travelers you meet - seeing what they can't see in themselves.\n\nEntrepreneurs raise explorers. It's not destiny, but it is inheritance.",
        emotion: 'knowing',
        variation_id: 'pattern_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_pattern',
        text: "I'm starting to see it too.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_possibility_keeper',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "And you succeed. Maya saw robotics as a betrayal. You helped her see it as a bridge. That's the entrepreneur's child in you - finding the third option when everyone else sees only two.",
        emotion: 'proud',
        variation_id: 'possibility_keeper_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_possibility',
        text: "There's usually a third option.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['creativity', 'problemSolving', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_struggle_transformation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Struggle becomes wisdom when we let it teach us instead of harden us. You learned to see. You learned to respond. You learned that help isn't charity - it's connection.\n\nThat's transformation. And it's powerful.",
        emotion: 'reverent',
        variation_id: 'struggle_transformation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_struggle',
        text: "Thank you for reflecting that back.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_service_philosophy',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It's everything. Service from obligation breeds resentment. Service from understanding breeds connection. You serve because you know what it's like to need. That authenticity - people feel it.",
        emotion: 'deep_teaching',
        variation_id: 'service_philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_service',
        text: "I want to keep doing that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_presence_teaching',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "We all are. It's the hardest lesson because the world rewards performance. But you're learning. The fact that you're here, taking time with Maya, with these conversations - that's presence. That's the work.",
        emotion: 'encouraging',
        variation_id: 'presence_teaching_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_presence',
        text: "Presence is the work.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_hollow_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "And now you're building something different. The station brought you here because you understand what matters. Not titles. Not achievements. Connection. Presence. Being seen and seeing others.\n\nThat's not hollow. That's real.",
        emotion: 'affirming_depth',
        variation_id: 'hollow_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_hollow',
        text: "I'm trying to build something real.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_honesty_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's why it is mastery. True skill looks effortless. You didn't perform - you were honest. And honesty without cruelty, boundaries without walls - that's the work of a lifetime.\n\nKeep being honest. The station sees it. So do the travelers.",
        emotion: 'profound_recognition',
        variation_id: 'honesty_mastery_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_honesty',
        text: "I will.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership']
      }
    ]
  },

  {
    nodeId: 'samuel_boundary_philosophy',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Walls keep people out. Boundaries invite them in on your terms.\n\nWalls say 'I don't trust you.' Boundaries say 'I trust myself while staying open.'\n\nYou showed Maya the difference.",
        emotion: 'teaching_nuance',
        variation_id: 'boundary_philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_boundary',
        text: "Boundaries invite connection.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // ============= DEVON REFLECTION GATEWAY (Return from Devon) =============
  {
    nodeId: 'samuel_devon_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I saw Devon leaving Platform 3. He wasn't looking at his phone or checking schematics. He was just... walking. Present.\n\nThat's a significant shift for a young man who tries to optimize every second. How did you navigate that conversation?",
        emotion: 'observant',
        variation_id: 'devon_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['devon_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_devon']
    },
    choices: [
      {
        choiceId: 'helped_him_integrate',
        text: "I helped him see that logic and emotion aren't enemies.",
        nextNodeId: 'samuel_reflects_devon_systems',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'focused_on_connection',
        text: "We focused on connection instead of fixing.",
        nextNodeId: 'samuel_reflects_devon_systems',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'just_listened_devon',
        text: "I just let him talk until he found his own answer.",
        nextNodeId: 'samuel_reflects_devon_systems',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_devon']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_devon_systems',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Devon's trap is common in this city. Engineers, researchers, data scientists - we think if we can just measure the problem accurately enough, the solution will appear.\n\nBut grief isn't a problem to be solved. It's a landscape to be traversed. You helped him put down the map and look at the terrain.",
        emotion: 'teaching',
        variation_id: 'devon_systems_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_did_he_choose',
        text: "He made a choice about how to talk to his dad.",
        nextNodeId: 'samuel_devon_path_reflection',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'systems_can_hold_grief',
        text: "I think he realized systems can hold grief too.",
        nextNodeId: 'samuel_devon_path_reflection',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // NUANCE: Integration + Helping (Gentle Presence)
  {
    nodeId: 'samuel_devon_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He's choosing integration. But more importantly, he's choosing it because he feels safe.\n\nYou approached his logic with so much gentleness. You didn't try to break his system; you helped him expand it to include himself.\n\nThat's how you help a rigid mind become flexible. Warmth melts structure.",
        emotion: 'warm_approval',
        variation_id: 'devon_integration_helping_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_integration'],
      patterns: {
        helping: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'gentleness_is_strength',
        text: "He just needed to know he wasn't broken.",
        nextNodeId: 'samuel_devon_systems_wisdom',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  // NUANCE: Integration + Analytical (Structural Insight)
  {
    nodeId: 'samuel_devon_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He's choosing integration. You spoke his language perfectly.\n\nYou helped him see that emotions are variables, not errors. That was the key. You didn't ask him to stop being an engineer; you helped him become a better one.\n\nThat's systemic change.",
        emotion: 'respectful_analytical',
        variation_id: 'devon_integration_analytical_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_integration'],
      patterns: {
        analytical: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'better_system',
        text: "It's a more robust system now.",
        nextNodeId: 'samuel_devon_systems_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'systemsThinking']
      }
    ]
  },

  // VARIATION 1: Integration Frame (Engineer AND Son)
  {
    nodeId: 'samuel_devon_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He's choosing integration. Not abandoning his analytical mind, but using it to serve his heart.\n\nThat's rare. Most people swing like a pendulum - all logic or all emotion. You helped him find the synthesis.\n\n'Engineer and Son.' That's a powerful identity.",
        emotion: 'affirming',
        variation_id: 'devon_integration_reflection_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_integration']
    },
    choices: [
      {
        choiceId: 'hope_it_works',
        text: "It won't be easy, but it's honest.",
        nextNodeId: 'samuel_devon_systems_wisdom',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'he_needed_permission',
        text: "He just needed to know he didn't have to amputate parts of himself.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // VARIATION 2: Heart Frame (Logic < Heart)
  {
    nodeId: 'samuel_devon_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He's putting the flowchart away. Leading with vulnerability.\n\nThat takes courage for someone wired like him. To walk into a conversation without a script? That's free-fall.\n\nYou gave him the parachute.",
        emotion: 'respectful',
        variation_id: 'devon_heart_reflection_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_heart']
    },
    choices: [
      {
        choiceId: 'vulnerability_is_strength',
        text: "Vulnerability is data too.",
        nextNodeId: 'samuel_devon_heart_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'he_was_ready',
        text: "He was ready. He just needed a nudge.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // VARIATION 3: Presence Frame (Just be there)
  {
    nodeId: 'samuel_devon_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He's choosing simply to be there. No agenda. No optimization.\n\nThat's the hardest path for a fixer. To sit with broken things and not reach for the glue.\n\nYou taught him that presence is an action. That's profound.",
        emotion: 'deep_knowing',
        variation_id: 'devon_presence_reflection_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_presence']
    },
    choices: [
      {
        choiceId: 'presence_is_hard',
        text: "It's the hardest thing to do.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'mom_legacy',
        text: "He realized that's what his mother did.",
        nextNodeId: 'samuel_devon_systems_wisdom',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  // Follow-up wisdom nodes for Devon
  {
    nodeId: 'samuel_devon_systems_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Systems thinking is Birmingham's language. Logistics, medical protocols, engineering specs. But the city's soul is in the gaps between the systems.\n\nDevon will be a better engineer because he learned to feel. And a better son because he learned to think.",
        emotion: 'wise',
        variation_id: 'devon_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_hub_devon',
        text: "He's going to be okay.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_devon_heart_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped him debug his own operating system. The error wasn't in the code - it was in the assumption that feelings are bugs.\n\nOnce he saw emotions as features, everything clicked.",
        emotion: 'amused_wise',
        variation_id: 'devon_heart_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_hub_devon_heart',
        text: "I'm glad I could help him see that.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= MARCUS REFLECTION GATEWAY (Return from Marcus) =============
  {
    nodeId: 'samuel_marcus_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Marcus just walked past. He looked... lighter. He said the patient made it.\n\nBut more than that, he said you saw the engineering in his work. That you understood the weight of the machine.\n\nHow was it, stepping into that kind of pressure?",
        emotion: 'respectful',
        variation_id: 'marcus_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['marcus_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_marcus']
    },
    choices: [
      {
        choiceId: 'marcus_pressure_intense',
        text: "It was intense. One mistake and it's over.",
        nextNodeId: 'samuel_reflects_marcus_stakes',
        pattern: 'analytical',
        skills: ['criticalThinking', 'crisisManagement']
      },
      {
        choiceId: 'marcus_pressure_meaningful',
        text: "It felt meaningful to hold a life like that.",
        nextNodeId: 'samuel_reflects_marcus_stakes',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'empathy']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_marcus']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_marcus_stakes',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "High stakes clarify things. In that simulation, there was no room for doubt. You had to act.\n\nThat decisiveness you showed? That's a skill. Not everyone can move when the alarm screams.\n\nYou helped Marcus see that his work isn't just care—it's precision engineering. You built a bridge between his identity as a nurse and his potential as an innovator.",
        emotion: 'proud',
        variation_id: 'marcus_stakes_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_bridge_return',
        text: "He's going to design better machines.",
        nextNodeId: 'samuel_hub_after_devon', // Or appropriate hub
        pattern: 'building',
        skills: ['careerDevelopment', 'innovation']
      }
    ]
  },

  // ============= TESS REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_tess_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Tess just left. She wasn't pacing anymore. She looked... focused. Like she finally had a map.\n\nStarting something new is terrifying. Most people wait for permission. It seems she decided not to wait.",
        emotion: 'proud',
        variation_id: 'tess_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['tess_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_tess']
    },
    choices: [
      {
        choiceId: 'tess_encouraged_risk',
        text: "She needed to know the risk was worth it.",
        nextNodeId: 'samuel_reflects_tess_risk',
        pattern: 'building',
        skills: ['leadership', 'entrepreneurship'],
        visibleCondition: {
          hasGlobalFlags: ['tess_chose_risk']
        }
      },
      {
        choiceId: 'tess_encouraged_caution',
        text: "She's going to test it first. Smart growth.",
        nextNodeId: 'samuel_reflects_tess_caution',
        pattern: 'analytical',
        skills: ['riskManagement'],
        visibleCondition: {
          hasGlobalFlags: ['tess_chose_safe']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_tess']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_tess_risk',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped her jump. That's a heavy thing to do.\n\nBut you saw that her safety was actually a cage. Sometimes the most dangerous thing you can do is stay safe.\n\nYou have the eye of a founder - seeing what could be, not just what is.",
        emotion: 'respectful',
        variation_id: 'tess_risk_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_return_hub',
        text: "She's going to build something amazing.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_tess_caution',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped her build a bridge instead of a cliff.\n\nVisionaries often burn out because they try to do everything at once. You taught her that sustainability is part of the mission.\n\nThat's the wisdom of a strategist.",
        emotion: 'wise',
        variation_id: 'tess_caution_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_return_hub_safe',
        text: "She'll get there, one step at a time.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= JORDAN REFLECTION GATEWAY (Return from Jordan) =============
  {
    nodeId: 'samuel_jordan_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You're back. I saw Jordan heading into that classroom earlier - she looked different than when she arrived. Less frantic. More grounded.\n\nSeven jobs in seven years. Most people would call that instability. But I've learned the station measures something deeper than résumés. How did her journey look to you?",
        emotion: 'observant',
        variation_id: 'jordan_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['jordan_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_jordan']
    },
    choices: [
      {
        choiceId: 'seemed_lost',
        text: "She seemed lost, searching for solid ground.",
        nextNodeId: 'samuel_jordan_mentorship_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'was_building',
        text: "She was building something, even if she didn't realize it.",
        nextNodeId: 'samuel_jordan_mentorship_reflection',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'reminded_me',
        text: "She reminded me of myself.",
        nextNodeId: 'samuel_jordan_mentorship_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_jordan']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_mentorship_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The students in that classroom needed Jordan more than they knew. Not because she has all the answers - but because she's lived the questions they're afraid to ask.\n\nThere's a difference between helping someone see their path and convincing them to walk yours. What did you offer her in those moments before her speech?",
        emotion: 'teaching',
        variation_id: 'mentorship_question_v1'
      }
    ],
    choices: [
      {
        choiceId: 'offered_mirror',
        text: "I tried to show her what she couldn't see in herself.",
        nextNodeId: 'samuel_jordan_path_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership']
      },
      {
        choiceId: 'asked_questions',
        text: "I asked questions. Let her find her own answers.",
        nextNodeId: 'samuel_jordan_path_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'just_listened',
        text: "Just listened. Sometimes that's enough.",
        nextNodeId: 'samuel_jordan_path_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication', 'communication']
      }
    ]
  },

  // VARIATION 1: Accumulation Frame
  {
    nodeId: 'samuel_jordan_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She walked into that classroom and told them the truth: every job that felt like failure was building her foundation.\n\nMarketing taught user empathy. Startup taught shipping under pressure. Agency refined her craft. Seven years. Seven teachers.\n\nYou helped her see accumulation isn't collecting baggage - it's gathering wisdom.",
        emotion: 'affirming',
        variation_id: 'accumulation_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['jordan_chose_accumulation']
    },
    choices: [
      {
        choiceId: 'will_she_believe_it',
        text: "Do you think she believed it? Or just needed to hear it?",
        nextNodeId: 'samuel_jordan_belief_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'gave_permission',
        text: "She gave those students permission to be imperfect.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'wonder_future',
        text: "I wonder what she'll do with that frame after today.",
        nextNodeId: 'samuel_jordan_future_wisdom',
        pattern: 'exploring',
        skills: ["communication","criticalThinking"]
      }
    ]
  },

  // VARIATION 2: Birmingham Frame - Part 1
  {
    nodeId: 'samuel_jordan_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She stood before those students and claimed her place in this city's story.\n\nBirmingham - where reinvention isn't weakness, it's the foundation.\n\nThis city transformed from steel mills to medical research, railroads to tech hubs. Jordan moved through seven companies in a place that rewards people who pivot.\n\nShe wasn't failing - she was adapting faster than most.",
        emotion: 'proud',
        variation_id: 'birmingham_reflection_v1_pt1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['jordan_chose_birmingham']
    },
    choices: [
      {
        choiceId: 'continue_birmingham_reflection',
        text: "(Continue)",
        nextNodeId: 'samuel_jordan_path_reflection_pt2',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },

  // VARIATION 2: Birmingham Frame - Part 2
  {
    nodeId: 'samuel_jordan_path_reflection_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped her see that she's not a fraud. She's proof that Birmingham values evolution over staying still.\n\nThose students needed to hear that career paths don't have to be straight lines - not in this city.",
        emotion: 'proud',
        variation_id: 'birmingham_reflection_v1_pt2'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['jordan_chose_birmingham']
    },
    choices: [
      {
        choiceId: 'city_rewards_reinvention',
        text: "This city really does reward reinvention, doesn't it?",
        nextNodeId: 'samuel_jordan_city_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'part_of_story',
        text: "She's part of Birmingham's next chapter now.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ripple_effect',
        text: "I wonder how many students will take a winding path because of her.",
        nextNodeId: 'samuel_jordan_ripple_wisdom',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'criticalThinking', 'communication']
      }
    ]
  },

  // VARIATION 3: Internal Validation Frame
  {
    nodeId: 'samuel_jordan_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She walked in with a different story. Not seven failures - seven chapters.\n\nYou gave her permission to rewrite the narrative. Impostor syndrome lives in the gap between others' definitions and the story we're living. Jordan closed that gap.\n\nThe most powerful thing you can give someone? They control the frame.",
        emotion: 'contemplative',
        variation_id: 'internal_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['jordan_chose_internal']
    },
    choices: [
      {
        choiceId: 'story_might_change',
        text: "But what if the story she tells herself changes again?",
        nextNodeId: 'samuel_jordan_narrative_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'needed_authorship',
        text: "She just needed permission to author her own story.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'lonely_frame',
        text: "Isn't 'only your story matters' lonely?",
        nextNodeId: 'samuel_jordan_sovereignty_wisdom',
        pattern: 'helping',
        skills: ['criticalThinking', 'emotionalIntelligence', 'communication']
      }
    ]
  },

  // Follow-up wisdom nodes
  {
    nodeId: 'samuel_jordan_belief_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's the right question. Sometimes we need to hear something before we can believe it. The hearing plants the seed.\n\nShe'll test that frame. Have a hard day. Wonder if she's really qualified or just performing confidence. But the seed is planted.\n\nEvery time she shares what she learned at one job with someone from another, she'll water it.",
        emotion: 'patient_wisdom',
        variation_id: 'belief_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hope_it_roots',
        text: "I hope it takes root.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_future_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She'll carry it differently depending on the day. Some days true. Some days just words.\n\nBut the frame becomes real when she uses it to help the next person.\n\nThat's when accumulation transforms into foundation.",
        emotion: 'knowing',
        variation_id: 'future_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'shell_guide_others',
        text: "She'll be a good guide for others.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_city_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Always has. Built by people who pivoted when steel dried up. Warehouses into innovation centers.\n\nJordan's carrying forward what Birmingham does. Those students are watching someone prove nonlinear paths are legitimate.\n\nThis station sits here for a reason. Birmingham's always been a crossroads.",
        emotion: 'reverent',
        variation_id: 'city_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'teaching_next_generation',
        text: "And she's teaching the next generation that.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_ripple_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "More than you think.\n\nFive years from now, one of them will be on their third job, feeling like a failure. They'll remember Jordan. 'Seven companies. All of it mattered.'\n\nThat's how change happens. One person shows it's possible. Then another.\n\nYou started that ripple.",
        emotion: 'hopeful',
        variation_id: 'ripple_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hope_it_reaches',
        text: "I hope it reaches the people who need it.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_narrative_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It probably will. Stories evolve.\n\nJordan might tell herself a different story in five years. That's okay.\n\nThe power is knowing you can rewrite when the old story stops serving you. You gave her that.",
        emotion: 'wise',
        variation_id: 'narrative_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'good_tool',
        text: "That's a good tool to carry.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_sovereignty_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It can be, if you mean 'no one else matters' or 'you're completely alone.'\n\nBut Jordan heard it differently. 'You decide which story you tell.' Others' opinions have weight. But she's the editor.\n\nThat's not lonely. That's sovereignty.",
        emotion: 'nuanced',
        variation_id: 'sovereignty_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'like_distinction',
        text: "I like that distinction.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_hub_return',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Jordan's in there teaching right now. Living the frame you helped her find. That's the beautiful thing about this station - influence ripples outward in ways we don't always see immediately.\n\nThere are other travelers tonight if you're ready. Or we can sit with what just happened a bit longer. The choice is yours.",
        emotion: 'offering_space',
        variation_id: 'jordan_hub_return_v1'
      }
    ],
    choices: [
      {
        choiceId: 'reflect_more_jordan',
        text: "Tell me more about what you saw with Jordan.",
        nextNodeId: 'samuel_deep_jordan_reflection',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'meet_other_travelers',
        text: "I'm ready to meet someone else.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      }
    ]
  },

  {
    nodeId: 'samuel_deep_jordan_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I saw you meeting Jordan where she was - in that spiral of doubt. You didn't try to fix her impostor syndrome. You helped her reframe it.\n\nThat's wisdom. Most people want to eliminate doubt. You understood doubt isn't always the enemy.\n\nJordan needed someone who could sit in uncertainty without rushing to resolution. You gave her that gift.",
        emotion: 'deep_knowing',
        variation_id: 'deep_jordan_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_after_deep_jordan',
        text: "[Nod thoughtfully]",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // ============= HUB: AFTER MAYA (Maya + Devon available) =============
  {
    nodeId: 'samuel_hub_after_maya',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 3 has another traveler tonight. Devon Kumar - engineering student. Builds systems to avoid dealing with emotions. Reminds me of myself at that age, if I'm honest.\n\nOr you can return to Maya if you'd like. The choice is yours.",
        emotion: 'reflective',
        variation_id: 'hub_after_maya_v3_clean'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete'],
      lacksGlobalFlags: ['devon_arc_complete']
    },
    choices: [
      {
        choiceId: 'return_to_maya',
        text: "I'd like to talk to Maya again.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME, // Type-safe revisit navigation ✅
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'meet_devon',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring',
        skills: ['communication', 'creativity']
      },
      {
        choiceId: 'tell_me_pattern',
        text: "What do you see in me?",
        nextNodeId: 'samuel_pattern_observation',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"],
        visibleCondition: {
          trust: { min: 3 }
        }
      },
      // Reciprocity Engine reflection triggers
      {
        choiceId: 'reflect_stable_parents',
        text: "You mentioned understanding where my patience comes from...",
        nextNodeId: 'samuel_reflects_stable_parents',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"],
        visibleCondition: {
          hasGlobalFlags: ['player_revealed_stable_parents'],
          lacksKnowledgeFlags: ['closed_reciprocity_loop'],
          trust: { min: 5 }
        }
      },
      {
        choiceId: 'reflect_entrepreneur_parents',
        text: "You said something about how I see possibilities...",
        nextNodeId: 'samuel_reflects_entrepreneur_parents',
        pattern: 'exploring',
        skills: ["communication","criticalThinking"],
        visibleCondition: {
          hasGlobalFlags: ['player_revealed_entrepreneur_parents'],
          lacksKnowledgeFlags: ['closed_reciprocity_loop'],
          trust: { min: 5 }
        }
      },
      {
        choiceId: 'reflect_struggling_parents',
        text: "I've been thinking about what I shared with Maya...",
        nextNodeId: 'samuel_reflects_struggling_parents',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"],
        visibleCondition: {
          hasGlobalFlags: ['player_revealed_struggling_parents'],
          lacksKnowledgeFlags: ['closed_reciprocity_loop'],
          trust: { min: 5 }
        }
      },
      {
        choiceId: 'reflect_absent_parents',
        text: "What you said about presence over performance...",
        nextNodeId: 'samuel_reflects_absent_parents',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"],
        visibleCondition: {
          hasGlobalFlags: ['player_revealed_absent_parents'],
          lacksKnowledgeFlags: ['closed_reciprocity_loop'],
          trust: { min: 5 }
        }
      },
      {
        choiceId: 'reflect_boundaries',
        text: "Maya mentioned something about boundaries?",
        nextNodeId: 'samuel_reflects_boundaries',
        pattern: 'analytical',
        skills: ["criticalThinking","communication"],
        visibleCondition: {
          hasGlobalFlags: ['player_set_boundary'],
          lacksKnowledgeFlags: ['closed_reciprocity_loop'],
          trust: { min: 5 }
        }
      },
      {
        choiceId: 'acknowledge_robotics_share',
        text: "Did you notice Maya opened up about robotics?",
        nextNodeId: 'samuel_acknowledges_robotics',
        pattern: 'exploring',
        skills: ["communication","criticalThinking"],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'acknowledge_family_share',
        text: "She told me about her family's expectations.",
        nextNodeId: 'samuel_acknowledges_family',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      }
    ]
  },

  // ============= TRUST MILESTONE ACKNOWLEDGMENTS =============
  {
    nodeId: 'samuel_acknowledges_robotics',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I did. Maya doesn't share that with many people. She's been building robots since high school, but she guards that passion like a secret shame.\n\nWhatever you said, whatever space you held - it created safety for her to name what she loves. Trust like that is earned through presence, not technique.",
        emotion: 'recognizing_achievement',
        variation_id: 'ack_robotics_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    choices: [
      {
        choiceId: 'how_did_you_know',
        text: "How did you know she loves robotics?",
        nextNodeId: 'samuel_station_knows_passions',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'accept_acknowledgment',
        text: "I just listened.",
        nextNodeId: 'samuel_listening_wisdom',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'back_to_hub',
        text: "What about the other travelers?",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      }
    ]
  },

  {
    nodeId: 'samuel_acknowledges_family',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The weight of immigrant parents' dreams. Twenty years of sacrifice distilled into expectations she never asked for.\n\nShe told you about that. That means she felt safe enough to show you the conflict at her core. You didn't judge, you didn't solve - you witnessed.\n\nThat's what created the opening.",
        emotion: 'honoring_depth',
        variation_id: 'ack_family_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    choices: [
      {
        choiceId: 'what_does_that_mean',
        text: "What does 'witnessing' really mean?",
        nextNodeId: 'samuel_teaching_witnessing',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'recognize_weight',
        text: "It's a lot to carry.",
        nextNodeId: 'samuel_empathy_recognition',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'continue_exploring',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring',
        skills: ['communication', 'creativity']
      }
    ]
  },

  {
    nodeId: 'samuel_station_knows_passions',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station shows me glimpses. Who people are when they're alone with what they love.\n\nMaya late at night, soldering circuit boards while textbooks gather dust. Her face when she talks about surgical robots.\n\nThe station doesn't judge. It recognizes.",
        emotion: 'mystical_knowing',
        variation_id: 'knows_passions_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_passions',
        text: "That's a gift, seeing people that clearly.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_listening_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "'Just listened.' As if that's simple. As if most people know how to listen without planning their next response, without fixing, without judging.\n\nYou're learning something most people never master: presence without agenda. Keep practicing that. It's the foundation of everything meaningful you'll do in this world.",
        emotion: 'teaching_gently',
        variation_id: 'listening_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "What's next?",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['communication', 'adaptability']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_listening_skill']
      }
    ]
  },

  {
    nodeId: 'samuel_teaching_witnessing',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Witnessing means being present without needing to change it, fix it, or make it about you.\n\nMost 'help' makes the helper feel better. Witnessing? Sitting in the discomfort. Holding space without rushing to resolution.",
        emotion: 'teaching_depth',
        variation_id: 'teaching_witnessing_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_witnessing_teaching',
        text: "(Continue)",
        nextNodeId: 'samuel_teaching_witnessing_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['taught_witnessing']
      }
    ]
  },

  {
    nodeId: 'samuel_teaching_witnessing_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya needed someone to see her conflict without collapsing it into a simple answer. You did that. That's rare.",
        emotion: 'teaching_depth',
        variation_id: 'teaching_witnessing_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'understand_witnessing',
        text: "Present without fixing.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_empathy_recognition',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It is. And you didn't try to make it lighter by offering easy solutions. You didn't say 'just follow your passion' or 'just honor your parents' - as if two decades of love and sacrifice can be resolved with 'just.'",
        emotion: 'affirming',
        variation_id: 'empathy_recognition_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_empathy_recognition',
        text: "(Continue)",
        nextNodeId: 'samuel_empathy_recognition_pt2',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_empathy_recognition_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You sat with the weight. That's empathy. Not sympathy - feeling sorry for someone. Empathy - feeling with someone. You're building something important here.",
        emotion: 'affirming',
        variation_id: 'empathy_recognition_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_journey',
        text: "Let's meet the next traveler.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      }
    ]
  },

  {
    nodeId: 'samuel_devon_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Devon's on Platform 3. Engineering student, probably hunched over a blueprint.\n\nHe organizes everything into systems. Systems are predictable. People aren't.\n\nBrilliant at solving problems. Struggles when they involve hearts.",
        emotion: 'understanding',
        variation_id: 'devon_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_devon',
        text: "I'll go meet Devon.",
        nextNodeId: 'devon_introduction',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'devon_understand',
        text: "Hearts are harder than mechanics. I understand that struggle.",
        nextNodeId: 'devon_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'why_me',
        text: "Why do you think I should talk to him?",
        nextNodeId: 'samuel_why_devon',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'samuel_why_devon',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Because you've shown you can meet people where they are. Maya needed someone to validate her hidden dream. Devon needs something different - someone to show him that vulnerability isn't weakness, it's data he's been ignoring.\n\nYou're building a particular kind of skill here. The station is showing you.",
        emotion: 'wise',
        variation_id: 'why_devon_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_now',
        text: "I'll go find Devon.",
        nextNodeId: 'devon_introduction', // Cross-graph (future)
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      }
    ]
  },

  // ============= JORDAN INTRODUCTION (After Devon complete) =============
  {
    nodeId: 'samuel_jordan_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "There's someone else here tonight - Jordan Packard. Conference rooms, guest instructor for Career Day.\n\nSeven jobs in seven years. Most people see 'instability.' But I see someone learning this city's ecosystem.\n\nShe's about to give a speech, but carrying doubt about whether she belongs in front of that room.",
        emotion: 'observant',
        variation_id: 'jordan_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_jordan',
        text: "I'll go talk to her.",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'jordan_empathy',
        text: "Seven jobs means seven times she took a risk. That takes courage.",
        nextNodeId: 'jordan_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'why_me_jordan',
        text: "Why do you think I should talk to her?",
        nextNodeId: 'samuel_why_jordan',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'samuel_why_jordan',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Impostor syndrome doesn't care about résumés.\n\nJordan's built real skills but feels like a fraud.\n\nYou help people see frames they can't see. Jordan needs to see her winding path isn't a liability—it's what makes her valuable.\n\nThose students need someone who's lived it.",
        emotion: 'teaching',
        variation_id: 'why_jordan_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_jordan_now',
        text: "I'll go find her.",
        nextNodeId: 'jordan_introduction',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      }
    ]
  },

  // ============= HUB: AFTER DEVON (Maya + Devon + Jordan available) =============
  {
    nodeId: 'samuel_hub_after_devon',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya's on Platform 1. Devon's on Platform 3, building his bridges.\n\nJordan's by the conference rooms. Guest instructor. Wrestling with whether seven jobs makes her qualified or fraudulent.\n\nTwenty minutes before she speaks.\n\nWhere does your attention pull you?",
        emotion: 'offering_space',
        variation_id: 'hub_after_devon_v3_clean'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['devon_arc_complete'],
      lacksGlobalFlags: ['jordan_arc_complete']
    },
    choices: [
      {
        choiceId: 'meet_marcus',
        text: "There's someone near the medical bay?",
        nextNodeId: 'samuel_marcus_intro',
        pattern: 'building',
        skills: ['curiosity', 'technicalLiteracy']
      },
      {
        choiceId: 'return_to_maya_2',
        text: "I'd like to talk to Maya again.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'return_to_devon',
        text: "I'll check in with Devon.",
        nextNodeId: 'devon_introduction',
        pattern: 'exploring',
        skills: ['communication', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['met_devon'],
          lacksGlobalFlags: ['devon_arc_complete'] // Don't loop back after completing Devon's arc
        }
      },
      {
        choiceId: 'meet_jordan',
        text: "Tell me more about Jordan.",
        nextNodeId: 'samuel_jordan_intro',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      },
      {
        choiceId: 'tell_me_pattern_2',
        text: "What pattern do you see in me now?",
        nextNodeId: 'samuel_pattern_observation',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence'],
        visibleCondition: {
          trust: { min: 3 }
        }
      }
    ]
  },

  {
    nodeId: 'samuel_marcus_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's Marcus. CVICU Nurse. He's standing by Platform 4, looking like he's still on shift.\n\nHe deals with life and death every night. But he's realizing the machines he uses are just as important as the medicine.\n\nGo gently. He's still carrying the weight of his last shift.",
        emotion: 'respectful',
        variation_id: 'marcus_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_marcus',
        text: "I'll go talk to him.",
        nextNodeId: 'marcus_introduction', // Links to new graph
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          addGlobalFlags: ['met_marcus']
        }
      }
    ]
  },

  // ============= PATTERN OBSERVATION (Trust-gated wisdom) =============
  {
    nodeId: 'samuel_pattern_observation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? Someone who listens more than they speak. Who asks questions that make people think.\n\nYou're not here by accident. The station called you because you can hold space for others' becoming.\n\nThat's a rare gift, and a difficult one. You'll often help others find clarity before you find your own.",
        emotion: 'knowing',
        variation_id: 'pattern_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 }
    },
    choices: [
      {
        choiceId: 'what_about_my_path',
        text: "What about my own path?",
        nextNodeId: 'samuel_your_path',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept',
        text: "Thank you for seeing that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  {
    nodeId: 'samuel_your_path',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your path is being revealed now. Every traveler you help is a mirror.\n\nThe station provides encounters. The meaning emerges from what you do with them.\n\nKeep walking. Your blueprint is taking shape.",
        emotion: 'patient',
        variation_id: 'your_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'create_action_plan',
        text: "I want to map out what I've learned.",
        nextNodeId: 'samuel_action_plan_intro',
        pattern: 'building',
        skills: ['criticalThinking', 'leadership']
      },
      {
        choiceId: 'continue',
        text: "I'll keep exploring.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel'
      }
    ]
  },

  {
    nodeId: 'samuel_action_plan_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Smart. Insight fades if you don't anchor it.\n\nTake everything we've uncovered tonight. The patterns, the instincts, the choices. Don't let them fade.\n\nMap them out. Make them real. That's how you bring the station home with you.",
        emotion: 'teaching',
        variation_id: 'action_plan_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'will_do',
        text: "I'll do that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'building',
        skills: ['timeManagement', 'problemSolving']
      }
    ],
    tags: ['synthesis', 'samuel_arc']
  },

  // ============= PATTERN-GATED BONUS CONTENT =============
  // These nodes unlock after consistent pattern demonstrations
  // Reward players for decision-making styles with deeper character insights

  {
    nodeId: 'samuel_analytical_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You approach encounters systematically. I've noticed.\n\nLet me share something from my therapeutic practice. I tracked patterns across 847 client sessions before I arrived here. Looking for the algorithms of human change.\n\nThe data revealed something surprising: Insight doesn't cause transformation. It's a correlation, not causation. People change when they feel safe enough to act on what they already know.\n\nYou analyze carefully—Maya's contradiction, Devon's grief patterns, Jordan's career trajectory. But you also know when analysis ends and presence begins.\n\nThat's wisdom. Knowing that some problems need frameworks, others need witnessing.\n\nIn your own journey, how do you balance systematic thinking with intuitive knowing?",
        emotion: 'wise_analytical',
        variation_id: 'analytical_bonus_v1'
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        analytical: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'analytical_balance',
        text: "Analysis provides structure. Intuition provides direction.",
        nextNodeId: 'samuel_structure_direction',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'analytical_limits',
        text: "I'm learning when analysis becomes avoidance.",
        nextNodeId: 'samuel_analysis_avoidance',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['pattern_bonus', 'analytical', 'wisdom_sharing', 'samuel_arc']
  },

  {
    nodeId: 'samuel_patience_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He settles into stillness, his presence expanding*\n\nYou understand patience. Not the passive kind—the active kind.\n\nIn therapy, I learned that patience isn't waiting. It's creating space for emergence. Not rushing the client's process. Not solving before they're ready.\n\nI see you doing this. With Maya's anxiety, Devon's grief, Jordan's doubt. You don't force resolution. You hold space for their unfolding.\n\nThat's a rare gift. Most people can't tolerate another's struggle without trying to fix it.\n\nYou can.\n\nI spent thirty years developing that capacity. You seem to carry it naturally.\n\nOr perhaps you've learned it through your own necessary waiting. Which is it?",
        emotion: 'deeply_present',
        variation_id: 'patience_bonus_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 },
      patterns: {
        patience: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'patience_learned',
        text: "Learned. Through waiting I didn't choose.",
        nextNodeId: 'samuel_necessary_waiting',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'patience_practice',
        text: "Still practicing. Every encounter teaches me.",
        nextNodeId: 'samuel_practice_patience',
        pattern: 'exploring',
        skills: ['adaptability', 'communication']
      },
      {
        choiceId: 'patience_natural',
        text: "Maybe both. Some things are native, some cultivated.",
        nextNodeId: 'samuel_native_cultivated',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    tags: ['pattern_bonus', 'patience', 'deep_wisdom', 'samuel_arc']
  },

  {
    nodeId: 'samuel_exploring_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You ask questions that open doors. That's your gift.\n\nIn my practice, I learned to distinguish between questions that narrow (diagnostic) and questions that expand (therapeutic). \n\n'What's wrong?' narrows.\n'What else is possible?' expands.\n\nYou naturally ask the expansive kind. With Maya: 'What if you could bridge both?' With Jordan: 'What patterns connect your jobs?' With Devon: 'What would presence look like?'\n\nYou're not gathering information—you're creating possibility space.\n\nBirmingham needs that. Not more answers, more possibilities. Career paths nobody's named yet. Combinations that don't fit the boxes.\n\nHow did you develop that exploratory approach? Were you taught, or did necessity force you to find alternatives?",
        emotion: 'recognizing_kindred',
        variation_id: 'exploring_bonus_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: {
        exploring: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'exploring_necessity',
        text: "Necessity. Traditional paths didn't fit me.",
        nextNodeId: 'samuel_paths_not_fit',
        pattern: 'exploring',
        skills: ['adaptability', 'creativity']
      },
      {
        choiceId: 'exploring_curiosity',
        text: "Curiosity. I can't help asking 'what if?'",
        nextNodeId: 'samuel_native_curiosity',
        pattern: 'exploring',
        skills: ['creativity', 'criticalThinking']
      },
      {
        choiceId: 'exploring_learned',
        text: "Learned from watching closed doors create suffering.",
        nextNodeId: 'samuel_closed_doors',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'creativity']
      }
    ],
    tags: ['pattern_bonus', 'exploring', 'possibility_creation', 'samuel_arc']
  },

  {
    nodeId: 'samuel_helping_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*His eyes glisten slightly—the first time you've seen emotion break through*\n\nYou help by witnessing. That's the highest form.\n\nI watched you tonight. Maya needed to be seen beyond her parents' expectations. Devon needed someone to hold him while he held everyone else. Jordan needed her competence reflected back.\n\nYou didn't fix them. You didn't advise them. You just... saw them fully.\n\nThat's what I tried to do for thirty years as a therapist. Some clinicians solve problems. Others bear witness to the humanity beneath the problems.\n\nYou're the latter kind. Naturally.\n\nI need you to know something: This station appeared for you too. Not just for Maya and Devon and Jordan.\n\nYou're not just a helper. You're also a traveler who needs to be helped.\n\nWho witnesses you?",
        emotion: 'vulnerable_profound',
        variation_id: 'helping_bonus_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      patterns: {
        helping: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'helping_question',
        text: "That's... a question I avoid asking.",
        nextNodeId: 'samuel_avoiding_question',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'helping_mutual',
        text: "Maybe we witness each other. Right now.",
        nextNodeId: 'samuel_mutual_witnessing',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration']
      },
      {
        choiceId: 'helping_role',
        text: "I'm more comfortable in the helper role.",
        nextNodeId: 'samuel_comfortable_role',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    tags: ['pattern_bonus', 'helping', 'profound_connection', 'samuel_arc']
  },

  {
    nodeId: 'samuel_building_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You build bridges between people and their possibilities. That's what I've observed.\n\nLet me tell you about the last structure I built before arriving here. Not physical—conceptual. A framework for career resilience I developed with Birmingham educators.\n\nWe were trying to help students in neighborhoods with 40% unemployment. Traditional career counseling wasn't working. 'Find your passion' means nothing when you're worried about survival.\n\nSo we built something new: Career as construction project. You work with available materials—skills, connections, constraints. You build what's possible now, not what's ideal someday.\n\nMaya's building her robotics prototype with borrowed equipment. Devon's building meaning from his mother's legacy. Jordan's building a career cathedral from seven different quarries.\n\nYou helped them see themselves as builders, not failures.\n\nWhat are you building with your own available materials?",
        emotion: 'wise_constructive',
        variation_id: 'building_bonus_v1'
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        building: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'building_still_discovering',
        text: "Still discovering what materials I have.",
        nextNodeId: 'samuel_inventory_phase',
        pattern: 'exploring',
        skills: ['adaptability', 'creativity']
      },
      {
        choiceId: 'building_framework',
        text: "Maybe a framework for helping others build.",
        nextNodeId: 'samuel_helper_framework',
        pattern: 'building',
        skills: ['creativity', 'leadership']
      },
      {
        choiceId: 'building_between',
        text: "Bridges between people and their potential.",
        nextNodeId: 'samuel_bridge_builder',
        pattern: 'helping',
        skills: ['collaboration', 'communication']
      }
    ],
    tags: ['pattern_bonus', 'building', 'framework_creation', 'samuel_arc']
  }
]

// ============= PUBLIC API: EXPORTED ENTRY POINTS =============
// These nodes are designed for cross-graph navigation.
// Do NOT link to internal nodes - only use these exported IDs.
// This provides compile-time safety and refactor protection.

export const samuelEntryPoints = {
  /** Initial entry point - game starts here */
  INTRODUCTION: 'samuel_introduction',

  /** Hub shown when player first arrives (only Maya available) */
  HUB_INITIAL: 'samuel_hub_initial',

  /** Reflection gateway - first return from Maya (mirrors player's influence) */
  MAYA_REFLECTION_GATEWAY: 'samuel_maya_reflection_gateway',

  /** Reflection gateway - return from Devon (validates systems/heart integration) */
  DEVON_REFLECTION_GATEWAY: 'samuel_devon_reflection_gateway',

  /** Reflection gateway - return from Marcus (validates crisis management) */
  MARCUS_REFLECTION_GATEWAY: 'samuel_marcus_reflection_gateway',

  /** Reflection gateway - return from Jordan (celebrates mentorship influence) */
  JORDAN_REFLECTION_GATEWAY: 'samuel_jordan_reflection_gateway',

  /** Hub after completing Maya's arc (Maya + Devon available) */
  HUB_AFTER_MAYA: 'samuel_hub_after_maya',

  /** Hub after completing Devon's arc (Maya + Devon + Jordan available) */
  HUB_AFTER_DEVON: 'samuel_hub_after_devon',

  /** Reflection gateway - return from Tess (validates entrepreneurial risk) */
  TESS_REFLECTION_GATEWAY: 'samuel_tess_reflection_gateway',

  /** Samuel's backstory reveal (trust-gated) */
  BACKSTORY: 'samuel_backstory_intro',

  /** Pattern observation (trust ≥3 required) */
  PATTERN_OBSERVATION: 'samuel_pattern_observation'
} as const

// Type export for TypeScript autocomplete
export type SamuelEntryPoint = typeof samuelEntryPoints[keyof typeof samuelEntryPoints]

export const samuelDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(samuelDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: samuelEntryPoints.INTRODUCTION,
  metadata: {
    title: "Samuel's Guidance",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: samuelDialogueNodes.length,
    totalChoices: samuelDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}