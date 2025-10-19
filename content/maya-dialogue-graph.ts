/**
 * Maya Chen's Dialogue Graph
 * A complete, branching narrative arc with conditional nodes
 * This will be populated with AI-generated variations
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { StateChange } from '../lib/character-state'
import { samuelEntryPoints } from './samuel-dialogue-graph'
import { parentalWorkLegacy } from './player-questions'

// Node definitions with placeholder content
// The AI pipeline will generate variations for each

export const mayaDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'maya_introduction',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Oh. Hi. Sorry, I—were you watching me?\n\nI know it's weird. Biochemistry notes and robotics parts spread everywhere. I'm not usually this... scattered.\n\nOr maybe I am. I don't know anymore.",
        emotion: 'anxious_scattered',
        variation_id: 'intro_v2_clean'
      }
    ],
    choices: [
      {
        choiceId: 'intro_studies',
        text: "Pre-med and robotics? That's an interesting combination.",
        nextNodeId: 'maya_studies_response',
        pattern: 'analytical',
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: ['asked_about_studies']
        }
      },
      {
        choiceId: 'intro_contradiction',
        text: "You're trying to be two things at once.",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['noticed_contradiction']
        }
      },
      {
        choiceId: 'intro_place',
        text: "This station appears when we need it most. Why are you here?",
        nextNodeId: 'maya_why_here',
        pattern: 'exploring'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['met_player']
      }
    ],
    tags: ['introduction', 'maya_arc', 'bg3_hook']
  },

  // ============= STUDIES PATH =============
  {
    nodeId: 'maya_studies_response',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Yes, pre-med at UAB. Second year. Organic chemistry is... it's going great. Really great.\n\nMy parents are so proud.",
        emotion: 'deflecting',
        variation_id: 'studies_v2_clean'
      }
    ],
    requiredState: {
      trust: { max: 2 }
    },
    choices: [
      {
        choiceId: 'studies_notice_deflection',
        text: "You said 'my parents' not 'I am'.",
        nextNodeId: 'maya_family_intro',
        pattern: 'analytical',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['player_noticed_deflection']
        }
      },
      {
        choiceId: 'studies_passion',
        text: "But is it what YOU want?",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 2 }
        }
      }
    ]
  },

  // ============= WHY HERE PATH =============
  {
    nodeId: 'maya_why_here',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... I'm not sure. I was walking home from the library, stressed about tomorrow's exam, and suddenly I was here. Like this place called to me. Maybe because I'm at a crossroads?",
        emotion: 'contemplative',
        variation_id: 'why_here_v1'
      }
    ],
    choices: [
      {
        choiceId: 'why_crossroads',
        text: "What kind of crossroads?",
        nextNodeId: 'maya_studies_response',
        pattern: 'exploring'
      },
      {
        choiceId: 'why_comfort',
        text: "This place does feel safe, doesn't it?",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= FAMILY INTRO PATH =============
  {
    nodeId: 'maya_family_intro',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My parents.\n\nThey immigrated here with nothing. Worked three jobs each to get me through school.\n\nTheir dream is simple: 'Our daughter, the doctor.'\n\nHow can I disappoint them?",
        emotion: 'conflicted',
        variation_id: 'family_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'family_pressure',
        text: "That sounds like a lot of pressure.",
        nextNodeId: 'maya_family_pressure',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'family_dreams',
        text: "But what are YOUR dreams?",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'exploring'
      }
    ]
  },

  // ============= DEFLECT PASSION PATH =============
  {
    nodeId: 'maya_deflect_passion',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My dreams? I... I try not to think about them. It's easier to follow the path laid out for me. Dreams are dangerous when they don't match expectations.",
        emotion: 'guarded',
        variation_id: 'deflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'deflect_safe',
        text: "What if safe isn't right for you?",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 2 }
        }
      },
      {
        choiceId: 'deflect_understand',
        text: "I understand duty vs desire.",
        nextNodeId: 'maya_family_pressure',
        pattern: 'patience',
        visibleCondition: {
          trust: { min: 2 }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'deflect_respect',
        text: "*Nod quietly in understanding*",
        nextNodeId: 'maya_early_gratitude',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= ANXIETY PATH (Trust Gate) =============
  {
    nodeId: 'maya_anxiety_check',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... how did you know? Is it that obvious?",
        emotion: 'vulnerable',
        variation_id: 'anxiety_check_v1'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'anxiety_no_judgment',
        text: "We all have our struggles. No judgment here.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'anxiety_relate',
        text: "I understand pressure. Sometimes it helps to share.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'patience'
      }
    ]
  },

  // ============= ANXIETY REVEAL (Important) =============
  {
    nodeId: 'maya_anxiety_reveal',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I'm fine. Just... everyone sees me as this perfect pre-med student. Good grades, clear path, making my parents' dreams come true.\n\nBut late at night, when I'm supposed to be memorizing anatomy, I'm actually... doing something else.",
        emotion: 'anxious_deflecting',
        variation_id: 'anxiety_reveal_v2_clean'
      }
    ],
    requiredState: {
      trust: { min: 2 },
      lacksKnowledgeFlags: ['knows_secret']
    },
    choices: [
      {
        choiceId: 'reveal_curious',
        text: "What are you actually doing?",
        nextNodeId: 'maya_robotics_hint',
        pattern: 'exploring'
      },
      {
        choiceId: 'reveal_support',
        text: "It's okay to have your own interests.",
        nextNodeId: 'maya_grateful_support',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'reveal_wait',
        text: "[Say nothing. Wait.]",
        nextNodeId: 'maya_fills_silence',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['player_gave_space']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_anxiety']
      }
    ],
    tags: ['trust_gate', 'maya_arc', 'bg3_subtext']
  },

  // ============= SILENCE RESPONSE (Rewards emotional intelligence) =============
  {
    nodeId: 'maya_fills_silence',
    speaker: 'Maya Chen',
    content: [
      {
        text: "...\n\nRobotics. I'm building robots when I should be studying.\n\nYou didn't push. Most people push. Thank you for that.",
        emotion: 'grateful_vulnerable',
        variation_id: 'fills_silence_v1_clean'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_silence',
        text: "Tell me about the robots.",
        nextNodeId: 'maya_robotics_hint',
        pattern: 'exploring'
      }
    ],
    tags: ['emotional_intelligence_reward', 'maya_arc']
  },

  // ============= ROBOTICS HINT PATH =============
  {
    nodeId: 'maya_robotics_hint',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... build things. Small things. With circuits and servos. Things that move and think and help.\n\nBut that's not medicine, is it? That's engineering, and engineers aren't doctors.",
        emotion: 'hesitant',
        variation_id: 'hint_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hint_encourage',
        text: "Tell me more about what you build.",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'exploring',
        visibleCondition: {
          trust: { min: 2 }
        }
      },
      {
        choiceId: 'hint_question',
        text: "What if there's a field that combines both?",
        nextNodeId: 'maya_uab_revelation',
        pattern: 'building',
        skills: ['creativity', 'problem_solving', 'critical_thinking']
      },
      {
        choiceId: 'hint_support',
        text: "Building healing devices IS medicine.",
        nextNodeId: 'maya_grateful_support',
        pattern: 'building',
        skills: ['creativity', 'emotional_intelligence']
      }
    ]
  },

  // ============= UAB BIOMEDICAL ENGINEERING REVELATION (Birmingham Integration) =============
  {
    nodeId: 'maya_uab_revelation',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She pulls out her phone, searches for something, then stares at the screen*\n\nWait. Biomedical Engineering at University of Alabama at Birmingham (UAB). They literally build surgical robots, prosthetics, medical devices.\n\n*Her voice trembles with recognition*\n\nThis is... this is an actual field. Building technology that heals people. That's real medicine.",
        emotion: 'dawning_realization',
        variation_id: 'uab_revelation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'uab_encourage_research',
        text: "UAB's program is nationally recognized.",
        nextNodeId: 'maya_pause_after_uab_revelation',
        pattern: 'analytical',
        skills: ['critical_thinking', 'problem_solving'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['knows_biomedical_engineering', 'knows_uab_program']
        }
      },
      {
        choiceId: 'uab_validate_feeling',
        text: "You found your bridge.",
        nextNodeId: 'maya_pause_after_uab_revelation',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'creativity'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['knows_biomedical_engineering']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['discovered_hybrid_path']
      }
    ]
  },

  // ============= PAUSE: After UAB Revelation (Breathing Room) =============
  {
    nodeId: 'maya_pause_after_uab_revelation',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She stares at her phone screen, eyes wide*\n\nI can't believe I never saw this before.",
        emotion: 'processing',
        variation_id: 'pause_uab_v1'
      }
    ],
    choices: [
      {
        choiceId: 'maya_continue_after_uab',
        text: "(Continue)",
        nextNodeId: 'maya_actionable_path',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'maya_arc']
  },

  {
    nodeId: 'maya_actionable_path',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I could talk to someone in the UAB program. See what the pathway looks like.\n\n*She looks at you with something like hope*\n\nMy parents always wanted me to go to UAB for medical school. What if I tell them... same school, just a different building?",
        emotion: 'hopeful_strategic',
        variation_id: 'actionable_v1'
      }
    ],
    choices: [
      {
        choiceId: 'support_strategy',
        text: "Frame it as medical innovation.",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'building',
        skills: ['communication', 'creativity', 'critical_thinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= GRATEFUL SUPPORT PATH =============
  {
    nodeId: 'maya_grateful_support',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Thank you for saying that. I... I've never thought of it that way. Maybe there's room for both worlds in my future. Maybe I don't have to choose between healing and building.",
        emotion: 'hopeful',
        variation_id: 'grateful_v1'
      }
    ],
    choices: [
      {
        choiceId: 'support_explore',
        text: "What would combining both look like?",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'analytical'
      },
      {
        choiceId: 'support_trust',
        text: "Trust yourself. Your instincts are good.",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= ROBOTICS REVEAL (Major Trust Gate) =============
  {
    nodeId: 'maya_robotics_passion',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... I build robots. Small ones, mostly. Medical assistance robots. I dream about circuits and servos, not cells and organs. My parents would be devastated if they knew how much I love engineering.",
        emotion: 'vulnerable',
        variation_id: 'robotics_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      hasKnowledgeFlags: ['knows_anxiety'],
      lacksKnowledgeFlags: ['knows_robotics']
    },
    choices: [
      {
        choiceId: 'robotics_encourage',
        text: "Your passion for robotics - that's a gift, isn't it?",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'creativity'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['encouraged_robotics']
        }
      },
      {
        choiceId: 'robotics_practical',
        text: "Have you thought about medical robotics?",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'analytical',
        skills: ['problem_solving', 'critical_thinking', 'creativity'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['suggested_hybrid']
        }
      },
      {
        choiceId: 'robotics_birmingham',
        text: "Do you know about Innovation Depot in Birmingham?",
        nextNodeId: 'maya_birmingham_opportunity',
        pattern: 'building',
        skills: ['problem_solving', 'communication'],
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: []
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_robotics'],
        setRelationshipStatus: 'confidant'
      }
    ],
    tags: ['major_reveal', 'trust_gate', 'maya_arc']
  },

  // ============= ENCOURAGED PATH =============
  {
    nodeId: 'maya_encouraged',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You really think so? Sometimes I feel like I'm living a double life. Pre-med student by day, robot builder by night.\n\nBut hearing you say it's beautiful... maybe it doesn't have to be a secret anymore.",
        emotion: 'encouraged',
        variation_id: 'encouraged_v1'
      }
    ],
    choices: [
      {
        choiceId: 'encouraged_parents',
        text: "How do you think your parents would react?",
        nextNodeId: 'maya_family_pressure',
        pattern: 'exploring'
      },
      {
        choiceId: 'encouraged_future',
        text: "What would you do if you could choose freely?",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 5 }
        }
      }
    ]
  },

  // ============= CONSIDERS HYBRID PATH =============
  {
    nodeId: 'maya_considers_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know, UAB has a biomedical engineering program. I could design surgical robots, create prosthetics, build devices that heal. It's like... having my cake and eating it too. Medicine AND robotics.",
        emotion: 'excited',
        variation_id: 'hybrid_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hybrid_perfect',
        text: "That sounds perfect for you.",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 4 }
        }
      },
      {
        choiceId: 'hybrid_parents',
        text: "Would your parents approve of that path?",
        nextNodeId: 'maya_family_pressure',
        pattern: 'analytical'
      }
    ]
  },

  // ============= BIRMINGHAM OPPORTUNITY PATH =============
  {
    nodeId: 'maya_birmingham_opportunity',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Really? I've heard of Innovation Depot (Birmingham's startup hub) but never thought... could I actually do that? Start something here in Birmingham?\n\nIt feels so far from what my parents expect, but so close to what I dream about.",
        emotion: 'curious',
        variation_id: 'birmingham_v1'
      }
    ],
    choices: [
      {
        choiceId: 'birmingham_encourage',
        text: "Birmingham needs innovative minds like yours.",
        nextNodeId: 'maya_encouraged',
        pattern: 'building'
      },
      {
        choiceId: 'birmingham_practical',
        text: "You could start small while finishing your degree.",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'analytical'
      }
    ]
  },

  // ============= FAMILY PRESSURE =============
  {
    nodeId: 'maya_family_pressure',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My parents immigrated here with nothing.\n\nThey worked three jobs to put me through school.\n\nThey dream of saying 'our daughter, the doctor.'\n\nHow can I tell them I'd rather build machines than heal people?",
        emotion: 'sad',
        variation_id: 'family_v1'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'family_understanding',
        text: "What if they sacrificed for your happiness, not just a title?",
        nextNodeId: 'maya_reframes_sacrifice',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'cultural_competence', 'critical_thinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'family_challenge',
        text: "Can you live your life for someone else?",
        nextNodeId: 'maya_rebellion_thoughts',
        pattern: 'helping',
        skills: ['critical_thinking', 'emotional_intelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['challenged_expectations']
        }
      },
      {
        choiceId: 'family_tried_talking',
        text: "Have you tried talking to them about it?",
        nextNodeId: 'maya_parent_conversation_failed',
        pattern: 'analytical',
        visibleCondition: {
          trust: { min: 3 }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_family']
      }
    ]
  },

  // ============= PARENT CONVERSATION SCENE (Specific Incident) =============
  {
    nodeId: 'maya_parent_conversation_failed',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Oh, I tried. Last month.\n\nPrinted out the MIT robotics program. Highlighted the medical device innovation parts. Prepared my whole case for how it's still helping people.\n\nKitchen table. My mother made tea. Good sign, I thought.\n\nTwo sentences in, she smiled. That smile.\n\nThen: 'That's lovely, Maya. But you'll be a doctor first, yes?'\n\nNot 'no.' Not 'we forbid it.' Just a question that wasn't a question.\n\nMy father kept drinking his tea. Wouldn't look at me.\n\nI'd rather they forbid it. At least then I could be angry instead of guilty.\n\nI haven't brought it up since.",
        emotion: 'wounded',
        variation_id: 'parent_conversation_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 }
    },
    choices: [
      {
        choiceId: 'acknowledge_pain',
        text: "That sounds incredibly painful.",
        nextNodeId: 'maya_rebellion_thoughts',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['shared_parent_failure']
        }
      },
      {
        choiceId: 'try_again_suggestion',
        text: "Maybe they need more time to process it?",
        nextNodeId: 'maya_reframes_sacrifice',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['tried_parent_conversation']
      }
    ],
    tags: ['emotional_incident', 'maya_arc', 'bg3_depth']
  },

  // ============= REFRAMES SACRIFICE PATH =============
  {
    nodeId: 'maya_reframes_sacrifice',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... I never thought of it that way. They sacrificed for my happiness, not just for a title. Maybe telling them about my real passion would honor their sacrifice, not betray it.",
        emotion: 'revelatory',
        variation_id: 'reframes_v1'
      }
    ],
    choices: [
      {
        choiceId: 'reframes_courage',
        text: "What does living authentically mean to you?",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 5 }
        }
      },
      {
        choiceId: 'reframes_acknowledge',
        text: "Powerful realization. How do you feel?",
        nextNodeId: 'maya_early_gratitude',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= REBELLION THOUGHTS PATH =============
  {
    nodeId: 'maya_rebellion_thoughts',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You're right. I've been so afraid of disappointing them that I was ready to disappoint myself forever. That's not living, that's just... existing. But how do I find the courage to choose my own path?",
        emotion: 'determined',
        variation_id: 'rebellion_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rebellion_courage',
        text: "Where does courage come from for you?",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 5 }
        }
      },
      {
        choiceId: 'rebellion_acknowledge',
        text: "Start small. One honest conversation at a time.",
        nextNodeId: 'maya_early_gratitude',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= THE CROSSROADS (Climax) =============
  {
    nodeId: 'maya_crossroads',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I've been accepted to UAB's biomedical engineering program. I could transfer. But I also got into the traditional pre-med track my parents expect. The train is coming soon. I need to choose my platform.",
        emotion: 'anxious',
        variation_id: 'crossroads_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['knows_robotics', 'knows_family'],
      relationship: ['confidant']
    },
    choices: [
      {
        choiceId: 'crossroads_robotics',
        text: "What would it mean to choose robotics?",
        nextNodeId: 'maya_pause_robotics',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication']
        // Removed flag requirement - always show at trust 10
      },
      {
        choiceId: 'crossroads_hybrid',
        text: "Could both paths honor what matters?",
        nextNodeId: 'maya_pause_hybrid',
        pattern: 'analytical',
        skills: ['critical_thinking', 'creativity', 'problem_solving']
        // Removed flag requirement - always show at trust 10
      },
      {
        choiceId: 'crossroads_support',
        text: "Whatever you choose, I believe in you.",
        nextNodeId: 'maya_pause_self',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'leadership']
      }
    ],
    tags: ['climax', 'maya_arc']
  },

  // ============= PAUSE: Before Robotics Ending (Breathing Room) =============
  {
    nodeId: 'maya_pause_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She closes her eyes for a moment, then opens them with new certainty*\n\nI know what I need to do.",
        emotion: 'resolved',
        variation_id: 'pause_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'maya_continue_to_robotics',
        text: "(Continue)",
        nextNodeId: 'maya_chooses_robotics',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'maya_arc']
  },

  // ============= PAUSE: Before Hybrid Ending (Breathing Room) =============
  {
    nodeId: 'maya_pause_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She closes her eyes for a moment, then opens them with new certainty*\n\nI know what I need to do.",
        emotion: 'resolved',
        variation_id: 'pause_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'maya_continue_to_hybrid',
        text: "(Continue)",
        nextNodeId: 'maya_chooses_hybrid',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'maya_arc']
  },

  // ============= PAUSE: Before Self Ending (Breathing Room) =============
  {
    nodeId: 'maya_pause_self',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She closes her eyes for a moment, then opens them with new certainty*\n\nI know what I need to do.",
        emotion: 'resolved',
        variation_id: 'pause_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'maya_continue_to_self',
        text: "(Continue)",
        nextNodeId: 'maya_chooses_self',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'maya_arc']
  },

  // ============= ENDINGS =============
  {
    nodeId: 'maya_chooses_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You're right. I'm switching to robotics engineering. I'll find a way to make my parents understand that healing can take many forms.\n\nMaybe my robots will save lives too, just differently. Thank you for believing in my real dream.",
        emotion: 'confident',
        variation_id: 'ending_robotics_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_robotics',
        text: "I'm glad I could help.",
        nextNodeId: 'maya_reciprocity_ask',
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_robotics', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  {
    nodeId: 'maya_chooses_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Biomedical engineering at UAB. It's perfect - I can build surgical robots, design prosthetics, create devices that heal.\n\nMy parents get their doctor, sort of, and I get my circuits. You helped me see I don't have to choose between loves.",
        emotion: 'happy',
        variation_id: 'ending_hybrid_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_hybrid',
        text: "That's a beautiful path.",
        nextNodeId: 'maya_reciprocity_ask',
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_hybrid', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  {
    nodeId: 'maya_chooses_self',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I know what I need to do now. Not what they want, not what's expected, but what feels right.\n\nYour faith in me, without pushing either way... that's what I needed. To know someone believes I can make my own choice. Thank you.",
        emotion: 'confident',
        variation_id: 'ending_self_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_self',
        text: "I believe in you.",
        nextNodeId: 'maya_reciprocity_ask',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_self', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  // ============= EARLY GRATITUDE (Low Trust Closure) =============
  {
    nodeId: 'maya_early_gratitude',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Thank you for listening. Really. I've been carrying this alone for so long.\n\nI'm not sure what I'll do yet, but... talking to you helped me see things differently. That matters more than you know.\n\nI should get back to studying. But maybe we'll talk again?",
        emotion: 'grateful',
        variation_id: 'early_gratitude_v1'
      }
    ],
    choices: [
      {
        choiceId: 'early_farewell',
        text: "I hope you find your path, Maya.",
        nextNodeId: samuelEntryPoints.MAYA_REFLECTION_GATEWAY,
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['early_connection_made']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['early_closure']
      }
    ],
    tags: ['early_ending', 'maya_arc']
  },

  // ============= FAREWELL NODES (Return to Samuel for Reflection) =============
  {
    nodeId: 'maya_farewell_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I'm going to apply to the robotics program. And I'm going to call my parents tonight.\n\nThey'll be heartbroken. My mother will cry. My father will probably go silent for days.\n\nBut I can't live their dream anymore. Even if it was a beautiful dream. Even if it breaks their hearts.\n\nThank you for helping me choose myself. Even when it hurts.\n\nSamuel is waiting for you. He has a way of knowing when someone's journey is shifting. Good luck with yours.",
        emotion: 'bittersweet_resolve',
        variation_id: 'farewell_robotics_v2_complex'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.MAYA_REFLECTION_GATEWAY, // Routes through reflection ✅
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'maya_arc', 'bittersweet']
  },

  {
    nodeId: 'maya_farewell_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Biomedical engineering. Medical robotics. The intersection I need.\n\nMy parents will accept it eventually. It's close enough to their dream that maybe they'll understand. Maybe.\n\nBut I'll always wonder what would have happened if I'd just... chosen purely. For myself. Without compromise.\n\nIs taking the safe middle path brave or cowardly? I guess I'll find out.\n\nThank you for helping me find a path that doesn't break anyone. Even if it feels like it bends me a little.\n\nSamuel is waiting for you. Good luck.",
        emotion: 'ambivalent_hope',
        variation_id: 'farewell_hybrid_v2_complex'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_hybrid',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.MAYA_REFLECTION_GATEWAY, // Routes through reflection ✅
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'maya_arc', 'bittersweet']
  },

  {
    nodeId: 'maya_farewell_self',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I don't know what I'm going to do yet. Medicine or robotics or something else entirely.\n\nBut I know it'll be MY choice, not anyone else's. That's... terrifying, actually.\n\nBecause when it's my choice, I can't blame them if it's wrong. I can't hide behind 'they made me.' The failure would be mine.\n\nBut so would the success.\n\nThank you for not telling me what to do. For trusting me with my own life. That's rarer than you think.\n\nSamuel is waiting for you. He's been doing this a long time - helping people find their way. Safe travels.",
        emotion: 'empowered_but_uncertain',
        variation_id: 'farewell_self_v2_complex'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_self',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.MAYA_REFLECTION_GATEWAY, // Routes through reflection ✅
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'maya_arc', 'bittersweet']
  },

  // ============= RECIPROCITY ENGINE: MUTUAL VULNERABILITY =============
  {
    nodeId: 'maya_reciprocity_ask',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She pauses, looking at you with new curiosity*\n\nYou know so much about my struggle now. You helped me see what I couldn't.\n\nCan I... can I ask you something personal?\n\nAbout your own path?",
        emotion: 'curious',
        variation_id: 'reciprocity_ask_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      hasGlobalFlags: ['maya_arc_complete']
    },
    choices: [
      {
        choiceId: 'allow_question',
        text: "Of course. After everything you've shared, it's only fair.",
        nextNodeId: 'maya_reciprocity_question',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['player_opened_up']
        }
      },
      {
        choiceId: 'deflect_question',
        text: "I'd rather not talk about that, if it's okay.",
        nextNodeId: 'maya_graceful_decline',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'maya_arc']
  },

  // ============= GRACEFUL DECLINE PATH (Rewards boundary-setting) =============
  {
    nodeId: 'maya_graceful_decline',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She smiles softly, with genuine understanding*\n\nOf course. Thank you for being honest with me.\n\n*She fidgets with her notebook*\n\nYou know what? The fact that you feel safe enough to say 'no' means more than any answer you could have given.",
        emotion: 'warm',
        variation_id: 'graceful_decline_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_graceful_decline',
        text: "(Continue)",
        nextNodeId: 'maya_graceful_decline_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['deeper_trust_established']
      }
    ],
    tags: ['reciprocity', 'boundary_respect', 'maya_arc']
  },

  {
    nodeId: 'maya_graceful_decline_pt2',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You've held space for my story without demanding I earn it. I can do the same for you.",
        emotion: 'warm',
        variation_id: 'graceful_decline_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'appreciate_understanding',
        text: "Thank you for understanding.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['respected_boundaries', 'player_set_boundary']
        }
      }
    ],
    tags: ['reciprocity', 'boundary_respect', 'maya_arc']
  },

  // ============= THE QUESTION: Parental Work Legacy =============
  {
    nodeId: 'maya_reciprocity_question',
    speaker: 'Maya Chen',
    content: [
      {
        text: parentalWorkLegacy.questionText,
        emotion: 'interested',
        variation_id: 'parental_work_question_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      hasKnowledgeFlags: ['player_opened_up']
    },
    choices: [
      {
        choiceId: parentalWorkLegacy.choices[0].choiceId,
        text: parentalWorkLegacy.choices[0].choiceText,
        nextNodeId: 'maya_reaction_stable',
        pattern: 'patience',
        consequence: parentalWorkLegacy.choices[0].stateChanges[0]
      },
      {
        choiceId: parentalWorkLegacy.choices[1].choiceId,
        text: parentalWorkLegacy.choices[1].choiceText,
        nextNodeId: 'maya_reaction_entrepreneur',
        pattern: 'exploring',
        consequence: parentalWorkLegacy.choices[1].stateChanges[0]
      },
      {
        choiceId: parentalWorkLegacy.choices[2].choiceId,
        text: parentalWorkLegacy.choices[2].choiceText,
        nextNodeId: 'maya_reaction_struggling',
        pattern: 'helping',
        consequence: parentalWorkLegacy.choices[2].stateChanges[0]
      },
      {
        choiceId: parentalWorkLegacy.choices[3].choiceId,
        text: parentalWorkLegacy.choices[3].choiceText,
        nextNodeId: 'maya_reaction_absent',
        pattern: 'patience',
        consequence: parentalWorkLegacy.choices[3].stateChanges[0]
      }
    ],
    tags: ['reciprocity', 'player_reveal', 'maya_arc']
  },

  // ============= MEANINGFUL REACTIONS (Not quiz show responses) =============
  {
    nodeId: 'maya_reaction_stable',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*Her eyes widen with recognition*\n\nThat makes so much sense. That consistency, that foundation...\n\nI can see why you're so patient with people like me who are spiraling. You grew up with solid ground beneath you.\n\n*She pauses, thoughtful*\n\nFor me, it was the opposite. My parents gave up everything stable to come here. Every day was a gamble on the future.",
        emotion: 'understanding',
        variation_id: 'stable_reaction_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_stable_reaction',
        text: "(Continue)",
        nextNodeId: 'maya_reaction_stable_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy']
      }
    ]
  },

  {
    nodeId: 'maya_reaction_stable_pt2',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Maybe that's why your patience felt so... safe. Like something I could trust.",
        emotion: 'understanding',
        variation_id: 'stable_reaction_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'mutual_understanding',
        text: "We balance each other out.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_stable_parents']
        }
      }
    ]
  },

  {
    nodeId: 'maya_reaction_entrepreneur',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She laughs, but it's not bitter - it's recognition*\n\nOf course! That's why you pushed me toward robotics without hesitation.\n\nRisk is normal for you. Starting fresh, building something from nothing - that's your inherited language.\n\n*She looks at her med school textbooks*\n\nMy parents took one huge risk coming to America. They want me to never have to risk again.\n\nBut you... you grew up seeing risk as possibility, not threat. That's why you could see my path when I couldn't.",
        emotion: 'dawning_understanding',
        variation_id: 'entrepreneur_reaction_v1'
      }
    ],
    choices: [
      {
        choiceId: 'risk_as_inheritance',
        text: "We inherit more than we realize.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'analytical',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_entrepreneur_parents']
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy']
      }
    ]
  },

  {
    nodeId: 'maya_reaction_struggling',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*Her expression softens into something deeper than sympathy*\n\nOh.\n\n*Long pause*\n\nYou know what it's like to watch someone you love fight just to stay afloat.\n\nThat's why you didn't try to fix me or minimize my struggle. You've seen what real weight looks like.",
        emotion: 'profound_connection',
        variation_id: 'struggling_reaction_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_struggling_reaction',
        text: "(Continue)",
        nextNodeId: 'maya_reaction_struggling_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy', 'deep_reciprocal_vulnerability']
      }
    ]
  },

  {
    nodeId: 'maya_reaction_struggling_pt2',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She reaches toward you, then stops*\n\nWhen you helped me, you weren't performing empathy. You were remembering.\n\nThat's... that's different. That's real.",
        emotion: 'profound_connection',
        variation_id: 'struggling_reaction_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'shared_weight',
        text: "Some weights teach us how to help carry others.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['deep_vulnerability_shared', 'player_revealed_struggling_parents'],
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  {
    nodeId: 'maya_reaction_absent',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She nods slowly, understanding crossing her face*\n\nSuccess at the cost of presence.\n\nYou learned early that achievement and absence can be the same thing.\n\n*She looks at her stack of study materials*\n\nI've been so afraid of disappointing my parents, I never considered I might disappear into my achievements.",
        emotion: 'sobering_realization',
        variation_id: 'absent_reaction_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_absent_reaction',
        text: "(Continue)",
        nextNodeId: 'maya_reaction_absent_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy']
      }
    ]
  },

  {
    nodeId: 'maya_reaction_absent_pt2',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You saw that in me, didn't you? The risk of succeeding at the wrong thing.",
        emotion: 'sobering_realization',
        variation_id: 'absent_reaction_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'presence_matters',
        text: "Being present for your own life matters too.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_absent_parents']
        }
      }
    ]
  }
]

// ============= PUBLIC API: EXPORTED ENTRY POINTS =============
// These nodes are designed for cross-graph navigation.
// Do NOT link to internal nodes - only use these exported IDs.

export const mayaEntryPoints = {
  /** Initial entry point - first meeting with Maya */
  INTRODUCTION: 'maya_introduction',

  /** Anxiety reveal (trust ≥2 required) */
  ANXIETY_REVEAL: 'maya_anxiety_reveal',

  /** Robotics passion reveal (trust ≥3 required) */
  ROBOTICS_PASSION: 'maya_robotics_passion',

  /** Family pressure discussion */
  FAMILY_PRESSURE: 'maya_family_pressure',

  /** The crossroads decision (trust ≥5 required) */
  CROSSROADS: 'maya_crossroads'
} as const

// Type export for TypeScript autocomplete
export type MayaEntryPoint = typeof mayaEntryPoints[keyof typeof mayaEntryPoints]

// Create the complete dialogue graph
export const mayaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(mayaDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: mayaEntryPoints.INTRODUCTION,
  metadata: {
    title: "Maya's Journey",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: mayaDialogueNodes.length,
    totalChoices: mayaDialogueNodes.reduce((sum, node) => sum + node.choices.length, 0)
  }
}