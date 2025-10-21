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
        skills: ['emotional_intelligence', 'communication'],
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
        text: "This station exists for people like you - people at a turning point. It's not on any map. You can't find it unless you need it.\n\nEvery platform here represents a different path, a different way of contributing to the world. The travelers you meet here? They're all asking the same question you are: 'What am I supposed to do with my life?'",
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
        skills: ['emotional_intelligence', 'communication']
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
        text: "Each platform leads somewhere different. Platform 1 - The Care Line - that's where you find people who heal, who teach, who help others grow. Platform 3 - The Builder's Track - engineers, makers, people who create with their hands.\n\nThe thing is, you don't choose a platform by logic alone. You talk to the travelers, hear their stories, see which ones resonate. Your path reveals itself through connection.",
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['emotional_intelligence', 'communication']
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
        text: "It was a good life. But it wasn't MY life, if that makes sense.\n\nOne day I'm standing in front of Vulcan, looking down at Birmingham spread out below. And I realize I've spent twenty-three years building other people's systems, following other people's blueprints. I was good at it. But I'd never asked myself what I actually wanted to build.",
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
        skills: ['communication', 'critical_thinking'],
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
        skills: ['emotional_intelligence', 'communication'],
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
        text: "I wanted to help people find their own blueprints. Not hand them answers, but create a space where they could ask the right questions.\n\nThat's what this station is. I didn't build it - it was here, waiting for someone to keep it. Been doing this for... well, time works differently here. Long enough to see hundreds of travelers find their way.",
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['emotional_intelligence']
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
        skills: ['emotional_intelligence']
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
        skills: ['emotional_intelligence'],
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
        skills: ['critical_thinking'],
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking', 'communication']
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
        text: "There are three travelers here tonight. Each one at their own crossroads.\n\nBefore I tell you about them, let me ask you something: When you think about the decision in front of you - whatever brought you to this station - what pulls at you most?",
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
        skills: ['communication', 'emotional_intelligence'],
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
        skills: ['critical_thinking', 'communication'],
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
        choiceId: 'hub_not_sure',
        text: "I'm not sure what I'm looking for yet.",
        nextNodeId: 'samuel_hub_fallback',
        pattern: 'patience',
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
        text: "That's a particular kind of struggle. When your heart knows what it wants but the path there feels... complicated.\n\nThere's someone on Platform 1 tonight who understands that tension. Maya Chen - brilliant pre-med student at UAB. She's supposed to become a doctor, and she's good enough to do it. But between what she's 'supposed' to do and what she dreams about, there's a gap that's tearing her apart.",
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
        skills: ['emotional_intelligence', 'collaboration'],
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
        text: "Ah. The engineer's dilemma. You can map every system, optimize every process, but then life throws you something that doesn't fit the flowchart.\n\nDevon Kumar is on Platform 3 - The Builder's Track. UAB engineering student, sharp as they come. He built a conversational decision tree to help his grieving father. Logic, optimization, efficiency. It failed catastrophically. Now he's sitting there trying to debug human connection.",
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
        skills: ['problem_solving'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'devon_empathy',
        text: "He must feel so lost. Trying to help but not knowing how.",
        nextNodeId: 'devon_introduction',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
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
        text: "Seven jobs in twelve years. That's Jordan Packard's count, anyway. She's in Conference Room B preparing for a mentorship panel at a coding bootcamp.\n\nHere's the thing - she's terrified those thirty students will see her résumé as chaos instead of evolution. Impostor syndrome while you're supposed to be the expert. The question isn't 'what should I become?' but 'how do I own what I've already been?'",
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

  // ============= FALLBACK: UNSURE → GUIDED CHOICE =============
  {
    nodeId: 'samuel_hub_fallback',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's honest. And honestly, that's why you're here.\n\nLet me tell you about tonight's travelers. Listen to their stories - see which one pulls at something inside you:\n\n**Maya Chen** on Platform 1 - Pre-med student who wants to help people, but maybe not the way everyone expects.\n\n**Devon Kumar** on Platform 3 - Engineer learning that some problems can't be solved with logic alone.\n\n**Jordan Packard** in Conference Room B - Seven jobs, one powerful question about whether that makes her experienced or unfocused.\n\nWho speaks to you?",
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
        skills: ['emotional_intelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'choose_devon',
        text: "Devon - logic meeting its limits.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['critical_thinking', 'collaboration'],
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
        text: "Fair question. Let me paint the full picture:\n\n**Maya Chen** - Platform 1. Pre-med brilliance, family expectations, robotics dreams. The weight of making others proud while finding yourself.\n\n**Devon Kumar** - Platform 3. Systems engineer who tried to debug grief with a flowchart. Learning that empathy isn't the opposite of logic.\n\n**Jordan Packard** - Conference Room B. Seven careers, thirty students waiting for wisdom, one question: Is my path proof of adaptability or just chaos?\n\nWho do you want to meet first?",
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
        skills: ['emotional_intelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'meet_devon_alt',
        text: "Devon on Platform 3.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['critical_thinking', 'collaboration'],
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
        skills: ['emotional_intelligence']
      },
      {
        choiceId: 'unsure_what_i_did',
        text: "I'm not sure what I actually did.",
        nextNodeId: 'samuel_reflect_on_influence',
        pattern: 'exploring',
        skills: ['critical_thinking', 'adaptability']
      },
      {
        choiceId: 'skip_reflection',
        text: "She made her own choice.",
        nextNodeId: 'samuel_reflect_on_agency',
        pattern: 'patience',
        skills: ['critical_thinking', 'emotional_intelligence']
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
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You did help her. But not in the way most people think 'helping' works.\n\nYou didn't fix her problem. You didn't tell her what to do. You created space for her to see options she couldn't see before.\n\nYou've got the helper instinct - that's what drives our UAB Medical resident advisors and Birmingham City Schools guidance counselors.",
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
        pattern: 'exploring'
      },
      {
        choiceId: 'how_do_you_know',
        text: "How do you know I didn't just tell her?",
        nextNodeId: 'samuel_systemic_proof',
        pattern: 'analytical',
        skills: ['critical_thinking']
      },
      {
        choiceId: 'accept_insight',
        text: "That distinction matters.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'patience',
        skills: ['critical_thinking', 'emotional_intelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_reflect_on_agency',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Exactly. She made her own choice. That's the most important thing you could understand about what just happened.\n\nYou understand agency - that's advanced.\n\nTook me fifteen years at Southern Company to learn I couldn't engineer people's decisions. The best career counselors in Birmingham know this: we illuminate paths, but the traveler chooses the direction.",
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
        skills: ['emotional_intelligence', 'communication']
      }
    ]
  },

  // ============= REFLECTION: Maya's Specific Choice =============
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
        skills: ['critical_thinking', 'communication']
      },
      {
        choiceId: 'glad_she_found_it',
        text: "I'm glad she found that clarity.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication']
      },
      {
        choiceId: 'what_about_me',
        text: "What about my path?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring',
        skills: ['adaptability', 'critical_thinking']
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
        skills: ['critical_thinking', 'communication']
      },
      {
        choiceId: 'she_found_her_bridge',
        text: "She found her own bridge.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_pattern_am_i_showing',
        text: "What pattern am I showing?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring'
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
        skills: ['emotional_intelligence', 'communication']
      },
      {
        choiceId: 'recognize_the_gift',
        text: "Sometimes not knowing is the answer.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_does_that_say',
        text: "What does that say about me?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring'
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
        text: "Is it okay? It's more than okay - it's courageous.\n\nOur whole world is designed to make you choose fast, commit early, lock in your path before you've even walked it. Maya choosing to sit with uncertainty? That's her refusing to let urgency override truth.\n\nNot knowing is honest - and that's the foundation of coaching, not fixing. Birmingham's Innovation Depot startup mentors know this. The best facilitators don't rush to answers. They hold space for emergence.",
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
        text: "That's exactly what I do. I don't give travelers directions - I help them see what they already know but can't admit yet.\n\nI was an engineer who followed other people's blueprints for twenty-three years. Now I help people draw their own. The station chose me because I learned this truth the hard way: The best guides don't lead. They witness.",
        emotion: 'vulnerable_wisdom',
        variation_id: 'keeper_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'witness_not_lead',
        text: "Witness, not lead.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_your_pattern_emerges',
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
        skills: ['emotional_intelligence', 'communication']
      },
      {
        choiceId: 'but_what_specifically',
        text: "But what does that mean, specifically?",
        nextNodeId: 'samuel_specificity_trap',
        pattern: 'analytical',
        skills: ['critical_thinking', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_specificity_trap',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's the question that keeps people stuck. 'What specifically should I do?' As if your purpose can be reduced to a job title or a five-year plan.\n\nThe pattern is bigger than any single role. You're learning to hold space, to ask questions that matter, to meet people in their uncertainty. Those skills? They're valuable everywhere - teaching, counseling, leadership, design, ministry, coaching. The form will emerge. Trust the pattern.",
        emotion: 'patient_wisdom',
        variation_id: 'specificity_trap_v1'
      }
    ],
    choices: [
      {
        choiceId: 'trust_the_pattern',
        text: "Trust the pattern.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
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
        text: "We can keep talking about what happened with Maya, if you want. There's value in sitting with an experience before rushing to the next one.\n\nOr, if you're ready, there are other travelers on the platforms tonight. Each one will show you something different about yourself.",
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
        skills: ['communication', 'emotional_intelligence']
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
        pattern: 'helping'
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
        skills: ['communication', 'critical_thinking']
      },
      {
        choiceId: 'yes_i_have',
        text: "I have felt something like that.",
        nextNodeId: 'samuel_solidarity',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication'],
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
        pattern: 'exploring'
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
        pattern: 'patience'
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
        pattern: 'helping'
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
        text: "I was thinking about what you told Maya. About your parents and their stable careers.\n\nIt helps me understand the way you approach problems - with a patience that comes from solid foundation. You've never had to rush because you've never had to run. That's a gift you give others without realizing it.\n\nThe station shows me these patterns. Your patience isn't just a trait - it's an inheritance.",
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
        skills: ['communication', 'critical_thinking']
      },
      {
        choiceId: 'makes_sense',
        text: "That actually makes a lot of sense.",
        nextNodeId: 'samuel_pattern_confirmation',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication']
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
        text: "Maya told me you opened up to her. About growing up with parents who were always building something new.\n\nThat explains your exploring pattern. You don't see closed doors - you see opportunities to build new ones. Risk feels like possibility to you because that's the water you swam in growing up.\n\nThe station called you here because you have the rare ability to help others see possibility where they see only walls.",
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
        skills: ['critical_thinking', 'communication']
      },
      {
        choiceId: 'helping_see_possibility',
        text: "I try to help people see what's possible.",
        nextNodeId: 'samuel_possibility_keeper',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication', 'leadership']
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
        skills: ['emotional_intelligence', 'communication']
      },
      {
        choiceId: 'understanding_not_obligation',
        text: "Understanding, not obligation. I like that framing.",
        nextNodeId: 'samuel_service_philosophy',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_absent_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I heard you shared something personal with Maya. About success and absence in your family.\n\nYou learned early that achievement can become a disappearing act. That's why you have such patience with others' journeys. You're not rushing anyone because you know where rushing leads - to being successful and hollow.\n\nThe station brought you here because you understand something crucial: presence matters more than performance.",
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
        skills: ['emotional_intelligence', 'adaptability']
      },
      {
        choiceId: 'hollow_success',
        text: "I've seen what hollow success looks like.",
        nextNodeId: 'samuel_hollow_wisdom',
        pattern: 'analytical',
        skills: ['critical_thinking', 'emotional_intelligence']
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
        text: "Maya told me something interesting. Not what you shared with her - but that you chose NOT to share something when she asked.\n\nDo you know how rare that is? Most people perform vulnerability to earn connection. But you set a boundary, kindly but firmly.\n\nThat's mastery. Maya's trust in you grew not despite your 'no,' but because of it. The station respects those who know the difference between walls and boundaries.",
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
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'walls_vs_boundaries',
        text: "Walls and boundaries - that's an important distinction.",
        nextNodeId: 'samuel_boundary_philosophy',
        pattern: 'analytical'
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
        text: "Most people don't. They think their traits are just personality. But we're all carrying forward patterns we learned before we had words for them.\n\nYour parents showed you that steady work creates space for rest. That security isn't boring - it's the foundation for everything else. You give that gift to others now, whether you realize it or not.",
        emotion: 'teaching',
        variation_id: 'inheritance_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_inheritance',
        text: "That's a beautiful way to see it.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
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
        pattern: 'exploring'
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
        pattern: 'helping'
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
        pattern: 'exploring'
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
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_boundary_philosophy',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Walls keep people out. Boundaries invite people in - on your terms. Walls say 'I don't trust you.' Boundaries say 'I trust myself to protect what matters while staying open to connection.'\n\nYou showed Maya the difference. She'll remember that.",
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
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
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
        skills: ['emotional_intelligence', 'communication']
      },
      {
        choiceId: 'was_building',
        text: "She was building something, even if she didn't realize it.",
        nextNodeId: 'samuel_jordan_mentorship_reflection',
        pattern: 'analytical',
        skills: ['critical_thinking', 'communication']
      },
      {
        choiceId: 'reminded_me',
        text: "She reminded me of myself.",
        nextNodeId: 'samuel_jordan_mentorship_reflection',
        pattern: 'patience'
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
        skills: ['emotional_intelligence', 'communication', 'leadership']
      },
      {
        choiceId: 'asked_questions',
        text: "I asked questions. Let her find her own answers.",
        nextNodeId: 'samuel_jordan_path_reflection',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'just_listened',
        text: "Just listened. Sometimes that's enough.",
        nextNodeId: 'samuel_jordan_path_reflection',
        pattern: 'patience'
      }
    ]
  },

  // VARIATION 1: Accumulation Frame
  {
    nodeId: 'samuel_jordan_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She walked into that classroom and told them the truth they needed to hear: every job that felt like failure was building her foundation.\n\nThe marketing role that taught her user empathy. The startup that showed her how to ship under pressure. The agency work that refined her craft. Seven years. Seven teachers. Each one necessary.\n\nYou helped her see that accumulation isn't the same as collecting baggage - it's gathering wisdom. Those students needed a mentor who had stumbled, not someone who made it look easy from day one.",
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
        skills: ['critical_thinking', 'communication']
      },
      {
        choiceId: 'gave_permission',
        text: "She gave those students permission to be imperfect.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'wonder_future',
        text: "I wonder what she'll do with that frame after today.",
        nextNodeId: 'samuel_jordan_future_wisdom',
        pattern: 'exploring'
      }
    ]
  },

  // VARIATION 2: Birmingham Frame - Part 1
  {
    nodeId: 'samuel_jordan_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She stood before those students and claimed her place in this city's story.\n\nBirmingham - where reinvention isn't weakness, it's the foundation.\n\nLook at this city. It transformed from steel mills to medical research, from railroads to tech hubs. Jordan moved through seven companies in a place that rewards people who can pivot, who can see what's next.\n\nShe wasn't failing - she was adapting faster than most.",
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
        skills: ['critical_thinking', 'communication']
      },
      {
        choiceId: 'part_of_story',
        text: "She's part of Birmingham's next chapter now.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ripple_effect',
        text: "I wonder how many students will take a winding path because of her.",
        nextNodeId: 'samuel_jordan_ripple_wisdom',
        pattern: 'helping'
      }
    ]
  },

  // VARIATION 3: Internal Validation Frame
  {
    nodeId: 'samuel_jordan_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She walked into that room carrying a different story than the one she arrived with. Not seven failures - seven chapters of becoming someone who understands design from seven different angles.\n\n'The story you tell yourself is the only one that matters.' You gave her permission to rewrite the narrative. Impostor syndrome lives in the gap between others' definitions of success and the story we're living. Jordan closed that gap.\n\nThe most powerful thing you can give someone isn't validation from the outside. It's the reminder that they control the frame.",
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
        skills: ['critical_thinking', 'communication']
      },
      {
        choiceId: 'needed_authorship',
        text: "She just needed permission to author her own story.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'lonely_frame',
        text: "Isn't 'only your story matters' lonely?",
        nextNodeId: 'samuel_jordan_sovereignty_wisdom',
        pattern: 'helping'
      }
    ]
  },

  // Follow-up wisdom nodes
  {
    nodeId: 'samuel_jordan_belief_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's the right question. Sometimes we need to hear something before we can believe it. The hearing plants the seed. The believing - that takes time, evidence, lived experience.\n\nShe'll test that frame. Have a hard day. Wonder if she's really qualified or just performing confidence. But the seed is planted. And every time she shares what she learned at one job with someone from another, she'll water it.",
        emotion: 'patient_wisdom',
        variation_id: 'belief_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hope_it_roots',
        text: "I hope it takes root.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_future_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She'll carry it differently depending on the day. Some days it'll feel true. Some days it'll feel like something she said once to sound confident.\n\nBut here's what I've seen: the frame becomes real when she uses it to help the next person. When a junior designer is drowning and Jordan says, 'I've been there at three different companies. Let me tell you what worked.'\n\nThat's when accumulation transforms from a frame into a foundation.",
        emotion: 'knowing',
        variation_id: 'future_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'shell_guide_others',
        text: "She'll be a good guide for others.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_city_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Always has. This city was built by people who knew how to pivot when the steel dried up. Who turned abandoned warehouses into innovation centers. Who saw 'decline' and chose 'transformation.'\n\nJordan's carrying forward what Birmingham has always done. And those students - they're watching someone prove that the path doesn't have to be linear to be legitimate.\n\nThis station sits in Birmingham for a reason. It's always been a crossroads city.",
        emotion: 'reverent',
        variation_id: 'city_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'teaching_next_generation',
        text: "And she's teaching the next generation that.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_ripple_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "More than you think. Maybe not immediately - but five years from now, one of them will be on their third job, feeling like a failure, and they'll remember Jordan saying, 'Seven companies. Seven teachers. All of it mattered.'\n\nThat's how change happens in Birmingham. One person shows it's possible. Then another. Then a dozen. Then it's just how things work here.\n\nYou helped start that ripple today.",
        emotion: 'hopeful',
        variation_id: 'ripple_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hope_it_reaches',
        text: "I hope it reaches the people who need it.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_narrative_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It probably will. Stories aren't fixed - they evolve as we do. Jordan might tell herself a different story in five years, and that's okay.\n\nThe power isn't in finding the one true story. It's in knowing you have the agency to rewrite when the old story stops serving you. You gave her that agency. She'll use it again when she needs to.",
        emotion: 'wise',
        variation_id: 'narrative_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'good_tool',
        text: "That's a good tool to carry.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_sovereignty_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It can be, if you take it to mean 'no one else's opinion matters' or 'you're completely alone in deciding who you are.'\n\nBut I think Jordan heard it differently. Not 'only your story matters' - but 'you get to decide which story you tell about yourself.' Other people's stories still exist. Their opinions still have weight. But she's the editor. She chooses which feedback to integrate and which to set aside.\n\nThat's not lonely. That's sovereignty.",
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
        skills: ['communication', 'emotional_intelligence']
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
        text: "I saw you meeting Jordan where she was - in that spiral of doubt right before a moment that mattered. You didn't try to fix her impostor syndrome. You helped her reframe it.\n\nThat's wisdom. Most people want to eliminate doubt, make it go away. You understood that doubt isn't always the enemy. Sometimes it's information. Sometimes it's the question that leads to the answer.\n\nJordan needed someone who could sit in uncertainty without rushing to resolution. You gave her that gift.",
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
        skills: ['emotional_intelligence', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'meet_devon',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring'
      },
      {
        choiceId: 'tell_me_pattern',
        text: "What do you see in me?",
        nextNodeId: 'samuel_pattern_observation',
        pattern: 'patience',
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
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'acknowledge_family_share',
        text: "She told me about her family's expectations.",
        nextNodeId: 'samuel_acknowledges_family',
        pattern: 'patience',
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
        text: "I did. Maya doesn't share that with many people. She's been building robots since high school, but she guards that passion like a secret shame.\n\nWhatever you said, whatever space you held - it created safety for her to name what she loves. That's not a small thing. Trust like that is earned through presence, not technique.",
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
        skills: ['communication', 'critical_thinking']
      },
      {
        choiceId: 'accept_acknowledgment',
        text: "I just listened.",
        nextNodeId: 'samuel_listening_wisdom',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'back_to_hub',
        text: "What about the other travelers?",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_acknowledges_family',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The weight of immigrant parents' dreams. That's the heaviest burden Maya carries - twenty years of sacrifice distilled into expectations she never asked for but can't bring herself to disappoint.\n\nShe told you about that. That means she felt safe enough to show you the conflict at her core. Most people never get to see that depth. You didn't judge, you didn't solve - you witnessed. That's what created the opening.",
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
        skills: ['communication', 'critical_thinking']
      },
      {
        choiceId: 'recognize_weight',
        text: "It's a lot to carry.",
        nextNodeId: 'samuel_empathy_recognition',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'continue_exploring',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_station_knows_passions',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station shows me glimpses. Fragments of who people are when they're alone with what they love.\n\nI've seen Maya late at night in her dorm room, soldering circuit boards while her textbooks gather dust. I've seen the way her face changes when she talks about surgical robots - like sun breaking through clouds. The station doesn't judge passions. It just recognizes them.",
        emotion: 'mystical_knowing',
        variation_id: 'knows_passions_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_passions',
        text: "That's a gift, seeing people that clearly.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
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
        pattern: 'exploring'
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
        text: "Witnessing means being fully present to someone's experience without needing to change it, fix it, or make it about you.\n\nMost 'help' is really about making the helper feel better - 'I fixed your problem, now I can stop feeling uncomfortable about your pain.' But witnessing? That's sitting in the discomfort with someone. Holding space for their truth without rushing to resolution.",
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
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_devon_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Devon's on Platform 3 - The Builder's Track. Engineering student, probably hunched over some blueprint or schematic right now.\n\nHe organizes everything into systems because systems are predictable. People aren't. He's brilliant at designing solutions for problems, but he struggles when the problems involve hearts instead of mechanics.",
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking']
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
        text: "There's someone else here tonight - Jordan Packard. She's over by the conference rooms, guest instructor for a coding bootcamp's Career Day.\n\nSeven jobs in seven years. Most people see that and think 'instability.' But I see someone who's been learning this city's full ecosystem - tech, design, startups, agencies. She's about to give a speech to students, but she's carrying a lot of doubt about whether she belongs in front of that room.",
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
        skills: ['emotional_intelligence', 'communication', 'leadership'],
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
        skills: ['critical_thinking']
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
        text: "Maya's on Platform 1 if you want to see how her journey's unfolding. Devon's still on Platform 3, building his bridges between logic and heart.\n\nAnd there's Jordan Packard over by the conference rooms - guest instructor tonight, wrestling with whether seven jobs makes her qualified or fraudulent. She has twenty minutes before she speaks to a room full of students.\n\nWhere does your attention pull you?",
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
        choiceId: 'return_to_maya_2',
        text: "I'd like to talk to Maya again.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping',
        skills: ['emotional_intelligence', 'collaboration'],
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
          hasGlobalFlags: ['met_devon']
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
        skills: ['communication', 'emotional_intelligence'],
        visibleCondition: {
          trust: { min: 3 }
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
        text: "What do I see in you? I see someone who listens more than they speak. Who asks questions that make people think instead of giving answers that shut down thinking.\n\nYou're not here by accident. The station called you because you have the capacity to hold space for others' becoming. That's a rare gift, and a difficult one. It means you'll often help others find clarity before you find your own.",
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
        skills: ['emotional_intelligence', 'communication'],
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
        text: "Your path is being revealed right now, in these conversations. Every traveler you help is a mirror showing you something about yourself.\n\nThe station doesn't give answers. It provides encounters. The meaning emerges from what you do with them. Keep walking the platforms. Your blueprint is taking shape, even if you can't see the full design yet.",
        emotion: 'patient',
        variation_id: 'your_path_v1'
      }
    ],
    choices: [
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

  /** Reflection gateway - return from Jordan (celebrates mentorship influence) */
  JORDAN_REFLECTION_GATEWAY: 'samuel_jordan_reflection_gateway',

  /** Hub after completing Maya's arc (Maya + Devon available) */
  HUB_AFTER_MAYA: 'samuel_hub_after_maya',

  /** Hub after completing Devon's arc (Maya + Devon + Jordan available) */
  HUB_AFTER_DEVON: 'samuel_hub_after_devon',

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