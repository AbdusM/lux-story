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