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
        pattern: 'patience'
      },
      {
        choiceId: 'ready_to_explore',
        text: "I'm ready to explore the platforms.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
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
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_to_meet',
        text: "I'd like to meet someone.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping'
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
        pattern: 'exploring'
      },
      {
        choiceId: 'acknowledge',
        text: "That sounds like a good life.",
        nextNodeId: 'samuel_backstory_revelation',
        pattern: 'patience'
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
        nextNodeId: 'samuel_purpose_found',
        pattern: 'exploring',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'relate',
        text: "I understand that feeling.",
        nextNodeId: 'samuel_purpose_found',
        pattern: 'helping',
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'acquaintance'
        }
      }
    ]
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
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_for_my_blueprint',
        text: "I'm ready to find my blueprint.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_purpose']
      }
    ]
  },

  // ============= HUB: INITIAL (Only Maya available) =============
  {
    nodeId: 'samuel_hub_initial',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Tonight, there's a young woman on Platform 1 - The Care Line. Her name is Maya Chen. Pre-med student at UAB, brilliant mind. But she's carrying a weight she doesn't quite know how to put down.\n\nI have a feeling you two should meet. Sometimes the best way to find your own path is to help someone else see theirs.",
        emotion: 'knowing',
        variation_id: 'hub_initial_v1'
      }
    ],
    requiredState: {
      lacksGlobalFlags: ['met_maya', 'maya_arc_complete']
    },
    choices: [
      {
        choiceId: 'go_to_maya',
        text: "I'll find her on Platform 1.",
        nextNodeId: 'maya_introduction', // Cross-graph to Maya
        pattern: 'helping',
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'tell_me_more',
        text: "Tell me more about Maya first.",
        nextNodeId: 'samuel_maya_context',
        pattern: 'analytical'
      },
      {
        choiceId: 'need_time',
        text: "I need a moment to think.",
        nextNodeId: 'samuel_patience_response',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_maya_context',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya's parents are immigrants. They sacrificed everything to give her opportunities they never had. Now she's succeeding by every measure - top grades, MCAT scores, acceptance letters.\n\nBut success and fulfillment aren't always the same thing. She's torn between honoring her parents' dreams and finding her own. It's a weight many first-generation students carry.",
        emotion: 'empathetic',
        variation_id: 'maya_context_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_now',
        text: "I'll go talk to her.",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      }
    ]
  },

  {
    nodeId: 'samuel_patience_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Take all the time you need. The platforms aren't going anywhere, and neither am I.\n\nThis station has been here for as long as people have needed it. It'll be here when you're ready.",
        emotion: 'patient',
        variation_id: 'patience_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ready_now',
        text: "Actually, I'm ready now.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  },

  // ============= HUB: AFTER MAYA (Maya + Devon available) =============
  {
    nodeId: 'samuel_hub_after_maya',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped Maya find her path. I saw the way she walked away from your conversation - lighter, clearer. That's the gift of this place, working through people like you.\n\nPlatform 3 has another traveler tonight. Devon Kumar - engineering student. Builds systems to avoid dealing with emotions. Reminds me of myself at that age, if I'm honest.",
        emotion: 'reflective',
        variation_id: 'hub_after_maya_v1'
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
        nextNodeId: 'devon_introduction', // Cross-graph to Devon (future)
        pattern: 'exploring',
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'why_me',
        text: "Why do you think I should talk to him?",
        nextNodeId: 'samuel_why_devon',
        pattern: 'analytical'
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
        characterId: 'samuel',
        addKnowledgeFlags: ['pattern_revealed']
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

  /** Hub after completing Maya's arc (Maya + Devon available) */
  HUB_AFTER_MAYA: 'samuel_hub_after_maya',

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