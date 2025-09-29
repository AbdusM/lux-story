/**
 * Maya Chen's Dialogue Graph
 * A complete, branching narrative arc with conditional nodes
 * This will be populated with AI-generated variations
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { StateChange } from '../lib/character-state'

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
        text: "Sometimes safe paths aren't the right paths.",
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
        text: "It's just... everyone sees me as this perfect pre-med student. Good grades, clear path, making my parents' dreams come true. But late at night, when I'm supposed to be memorizing anatomy, I'm actually... doing something else.",
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
        text: "I... build things. Small things. With circuits and servos. Things that move and think and help. But that's not medicine, is it? That's engineering, and engineers aren't doctors.",
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
        choiceId: 'hint_support',
        text: "Building healing devices IS medicine.",
        nextNodeId: 'maya_grateful_support',
        pattern: 'helping'
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
        text: "Your passion for robotics is beautiful. Don't hide it.",
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
        text: "Medical robotics is a growing field. You could do both.",
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
        text: "Birmingham's Innovation Depot supports robotics startups.",
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
        text: "You really think so? Sometimes I feel like I'm living a double life. Pre-med student by day, robot builder by night. But hearing you say it's beautiful... maybe it doesn't have to be a secret anymore.",
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
        text: "My parents immigrated here with nothing. They worked three jobs to put me through school. They dream of saying 'our daughter, the doctor.' How can I tell them I'd rather build machines than heal people?",
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
        text: "They sacrificed for your happiness, not just a title.",
        nextNodeId: 'maya_reframes_sacrifice',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'family_challenge',
        text: "Living someone else's dream isn't living at all.",
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
        text: "It takes courage to live authentically.",
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
        text: "Courage isn't the absence of fear. It's action despite fear.",
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
        text: "Follow your robotics passion. Your parents will understand in time.",
        nextNodeId: 'maya_chooses_robotics',
        pattern: 'helping',
        visibleCondition: {
          hasKnowledgeFlags: ['encouraged_robotics']
        }
      },
      {
        choiceId: 'crossroads_hybrid',
        text: "Biomedical engineering honors both paths.",
        nextNodeId: 'maya_chooses_hybrid',
        pattern: 'analytical',
        visibleCondition: {
          hasKnowledgeFlags: ['suggested_hybrid']
        }
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
        text: "You're right. I'm switching to robotics engineering. I'll find a way to make my parents understand that healing can take many forms. Maybe my robots will save lives too, just differently. Thank you for believing in my real dream.",
        emotion: 'confident',
        variation_id: 'ending_robotics_v1'
      }
    ],
    choices: [],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_robotics', 'completed_arc'],
        addGlobalFlags: ['maya_storyline_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  {
    nodeId: 'maya_chooses_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Biomedical engineering at UAB. It's perfect - I can build surgical robots, design prosthetics, create devices that heal. My parents get their doctor, sort of, and I get my circuits. You helped me see I don't have to choose between loves.",
        emotion: 'happy',
        variation_id: 'ending_hybrid_v1'
      }
    ],
    choices: [],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_hybrid', 'completed_arc'],
        addGlobalFlags: ['maya_storyline_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  {
    nodeId: 'maya_chooses_self',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I know what I need to do now. Not what they want, not what's expected, but what feels right. Your faith in me, without pushing either way... that's what I needed. To know someone believes I can make my own choice. Thank you.",
        emotion: 'confident',
        variation_id: 'ending_self_v1'
      }
    ],
    choices: [],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_self', 'completed_arc'],
        addGlobalFlags: ['maya_storyline_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  }
]

// Create the complete dialogue graph
export const mayaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(mayaDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: 'maya_introduction',
  metadata: {
    title: "Maya's Journey",
    author: 'Grand Central Narrative Team',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: mayaDialogueNodes.length,
    totalChoices: mayaDialogueNodes.reduce((sum, node) => sum + node.choices.length, 0)
  }
}