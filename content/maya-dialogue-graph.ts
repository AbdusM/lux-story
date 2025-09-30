/**
 * Maya Chen's Dialogue Graph
 * A complete, branching narrative arc with conditional nodes
 * This will be populated with AI-generated variations
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { StateChange } from '../lib/character-state'
import { samuelEntryPoints } from './samuel-dialogue-graph'

// Node definitions with placeholder content
// The AI pipeline will generate variations for each

export const mayaDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'maya_introduction',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Oh, hello. I'm Maya. Are you... waiting for a train too? This place is strange, isn't it? Not quite real, but more real than anywhere I've been.",
        emotion: 'anxious',
        variation_id: 'intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'intro_studies',
        text: "You look like you're studying hard. Pre-med?",
        nextNodeId: 'maya_studies_response',
        pattern: 'analytical',
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: ['asked_about_studies']
        }
      },
      {
        choiceId: 'intro_anxiety',
        text: "You seem anxious. Want to talk about it?",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 1 }
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
    tags: ['introduction', 'maya_arc']
  },

  // ============= STUDIES PATH =============
  {
    nodeId: 'maya_studies_response',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Yes, pre-med at UAB. Second year. Organic chemistry is... intense. But that's what's expected, right? Become a doctor, make the family proud.",
        emotion: 'neutral',
        variation_id: 'studies_v1'
      }
    ],
    requiredState: {
      trust: { max: 2 }
    },
    choices: [
      {
        choiceId: 'studies_expected',
        text: "Expected by whom?",
        nextNodeId: 'maya_family_intro',
        pattern: 'exploring'
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
        text: "My parents. They immigrated here with nothing. Worked three jobs each to get me through school. Their dream is simple: 'Our daughter, the doctor.' How can I disappoint them?",
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
        text: "What if the safe path isn't the right path for you?",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        visibleCondition: {
          trust: { min: 2 }
        }
      },
      {
        choiceId: 'deflect_understand',
        text: "I understand the conflict between duty and desire.",
        nextNodeId: 'maya_family_pressure',
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
        text: "It's just... everyone sees me as this perfect pre-med student. Good grades, clear path, making my parents' dreams come true.\n\nBut late at night, when I'm supposed to be memorizing anatomy, I'm actually... doing something else.",
        emotion: 'anxious',
        variation_id: 'anxiety_reveal_v1'
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
        text: "Whatever it is, it's okay to have your own interests.",
        nextNodeId: 'maya_grateful_support',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_anxiety']
      }
    ],
    tags: ['trust_gate', 'maya_arc']
  },

  // ============= ROBOTICS HINT PATH =============
  {
    nodeId: 'maya_robotics_hint',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... build things. Small things. With circuits and servos. Things that move and think and help. | But that's not medicine, is it? That's engineering, and engineers aren't doctors.",
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
          trust: { min: 3 }
        }
      },
      {
        choiceId: 'hint_question',
        text: "What if there's a field that combines both?",
        nextNodeId: 'maya_uab_revelation',
        pattern: 'helping'
      },
      {
        choiceId: 'hint_support',
        text: "Building healing devices IS medicine.",
        nextNodeId: 'maya_grateful_support',
        pattern: 'helping'
      }
    ]
  },

  // ============= UAB BIOMEDICAL ENGINEERING REVELATION (Birmingham Integration) =============
  {
    nodeId: 'maya_uab_revelation',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She pulls out her phone, searches for something, then stares at the screen* | Wait. Biomedical Engineering at UAB. They literally build surgical robots, prosthetics, medical devices. | *Her voice trembles with recognition* | This is... this is an actual field. Building technology that heals people. That's real medicine.",
        emotion: 'dawning_realization',
        variation_id: 'uab_revelation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'uab_encourage_research',
        text: "UAB's program is nationally recognized.",
        nextNodeId: 'maya_actionable_path',
        pattern: 'analytical',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['knows_biomedical_engineering', 'knows_uab_program']
        }
      },
      {
        choiceId: 'uab_validate_feeling',
        text: "You just found your bridge between both worlds.",
        nextNodeId: 'maya_grateful_support',
        pattern: 'helping',
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

  {
    nodeId: 'maya_actionable_path',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I could talk to someone in the UAB program. See what the pathway looks like. | *She looks at you with something like hope* | My parents always wanted me to go to UAB for medical school. What if I tell them... same school, just a different building?",
        emotion: 'hopeful_strategic',
        variation_id: 'actionable_v1'
      }
    ],
    choices: [
      {
        choiceId: 'support_strategy',
        text: "Frame it as innovation in medicine, not abandoning it.",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'analytical',
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
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: ['knows_innovation_depot']
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
        text: "Really? I've heard of Innovation Depot but never thought... could I actually do that? Start something here in Birmingham? It feels so far from what my parents expect, but so close to what I dream about.",
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
        text: "My parents immigrated here with nothing. They worked three jobs to put me through school. They dream of saying 'our daughter, the doctor.'\n\nHow can I tell them I'd rather build machines than heal people?",
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
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['challenged_expectations']
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
        nextNodeId: 'maya_chooses_robotics',
        pattern: 'helping'
        // Removed flag requirement - always show at trust 10
      },
      {
        choiceId: 'crossroads_hybrid',
        text: "Could both paths honor what matters?",
        nextNodeId: 'maya_chooses_hybrid',
        pattern: 'analytical'
        // Removed flag requirement - always show at trust 10
      },
      {
        choiceId: 'crossroads_support',
        text: "Whatever you choose, I believe in you.",
        nextNodeId: 'maya_chooses_self',
        pattern: 'patience'
      }
    ],
    tags: ['climax', 'maya_arc']
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
        nextNodeId: 'maya_farewell_robotics',
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
        nextNodeId: 'maya_farewell_hybrid',
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
        nextNodeId: 'maya_farewell_self',
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

  // ============= FAREWELL NODES (Return to Samuel for Reflection) =============
  {
    nodeId: 'maya_farewell_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I'm going to talk to my parents tonight. Tell them about the robotics program, about what I actually want.\n\nSamuel is probably waiting for you at the main platform. He has a way of knowing when someone's journey is shifting. Good luck with yours.",
        emotion: 'grateful',
        variation_id: 'farewell_robotics_v1'
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
    tags: ['transition', 'maya_arc']
  },

  {
    nodeId: 'maya_farewell_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Biomedical engineering. The best of both worlds. I'm going to submit my transfer application tomorrow.\n\nSamuel is probably at the main platform. He helped me find this place - maybe he can help you too. Thank you again.",
        emotion: 'excited',
        variation_id: 'farewell_hybrid_v1'
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
    tags: ['transition', 'maya_arc']
  },

  {
    nodeId: 'maya_farewell_self',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I need some time to think about what's next. But I know it'll be MY choice, not anyone else's.\n\nYou should talk to Samuel. He's been doing this a long time - helping people find their way. Safe travels.",
        emotion: 'peaceful',
        variation_id: 'farewell_self_v1'
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
    tags: ['transition', 'maya_arc']
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