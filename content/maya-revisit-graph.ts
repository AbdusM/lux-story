/**
 * Maya Chen's Revisit Dialogue Graph
 * Post-arc interactions - Maya remembers your shared history
 *
 * CRITICAL: This graph is ONLY loaded when maya_arc_complete flag is set
 * If player hasn't completed Maya's arc, they get maya-dialogue-graph.ts instead
 */

import {
  DialogueNode,
  DialogueGraph
} from '@/lib/dialogue-graph'

/**
 * IMPORTANT: We use string literals for Samuel's entry points to avoid circular dependencies
 * samuel-dialogue-graph.ts imports maya-revisit-graph.ts
 * If we import back, we create a cycle
 */
const SAMUEL_HUB_AFTER_MAYA = 'samuel_hub_after_maya'

export const mayaRevisitNodes: DialogueNode[] = [
  // ============= WELCOME BACK (Entry Point) =============
  {
    nodeId: 'maya_revisit_welcome',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Hey! It's so good to see you again.\n\nI've been thinking about our conversation a lot. It really changed things for me.",
        emotion: 'warm',
        variation_id: 'revisit_welcome_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    choices: [
      // Robotics path choices
      {
        choiceId: 'ask_how_are_you_robotics',
        text: "How have you been?",
        nextNodeId: 'maya_revisit_update_robotics',
        pattern: 'helping',
        visibleCondition: { hasKnowledgeFlags: ['chose_robotics'] }
      },
      {
        choiceId: 'ask_about_decision_robotics',
        text: "How's your path going?",
        nextNodeId: 'maya_revisit_update_robotics',
        pattern: 'exploring',
        visibleCondition: { hasKnowledgeFlags: ['chose_robotics'] }
      },
      // Hybrid path choices
      {
        choiceId: 'ask_how_are_you_hybrid',
        text: "How have you been?",
        nextNodeId: 'maya_revisit_update_hybrid',
        pattern: 'helping',
        visibleCondition: { hasKnowledgeFlags: ['chose_hybrid'] }
      },
      {
        choiceId: 'ask_about_decision_hybrid',
        text: "How's your path going?",
        nextNodeId: 'maya_revisit_update_hybrid',
        pattern: 'exploring',
        visibleCondition: { hasKnowledgeFlags: ['chose_hybrid'] }
      },
      // Self-discovery path choices
      {
        choiceId: 'ask_how_are_you_self',
        text: "How have you been?",
        nextNodeId: 'maya_revisit_update_self',
        pattern: 'helping',
        visibleCondition: { hasKnowledgeFlags: ['chose_self'] }
      },
      {
        choiceId: 'ask_about_decision_self',
        text: "How's your path going?",
        nextNodeId: 'maya_revisit_update_self',
        pattern: 'exploring',
        visibleCondition: { hasKnowledgeFlags: ['chose_self'] }
      }
    ]
  },

  // ============= UPDATE (Branches based on choice) =============
  {
    nodeId: 'maya_revisit_update_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I spoke to my parents about the robotics program. It wasn't easy - there were tears, some yelling, a lot of confusion.\n\nBut I explained how surgical robots save lives, how I could still help people, just in a different way. They're... processing. It's a start.",
        emotion: 'hopeful',
        variation_id: 'update_robotics_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_robotics']
    },
    choices: [
      {
        choiceId: 'encourage_robotics',
        text: "They'll see it eventually.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'helping'
      },
      {
        choiceId: 'ask_next_steps_robotics',
        text: "What's your next step?",
        nextNodeId: 'maya_revisit_next_steps_robotics',
        pattern: 'analytical'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_update_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I submitted my application to UAB's biomedical engineering program. It's perfect - surgical robots, prosthetics, diagnostic devices.\n\nMy parents are actually proud. They keep telling relatives their daughter will be a 'medical engineer.' It's close enough to doctor for them. And I get to build things.",
        emotion: 'excited',
        variation_id: 'update_hybrid_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_hybrid']
    },
    choices: [
      {
        choiceId: 'celebrate_hybrid',
        text: "That's wonderful news!",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'helping'
      },
      {
        choiceId: 'ask_next_steps_hybrid',
        text: "When do you start?",
        nextNodeId: 'maya_revisit_next_steps_hybrid',
        pattern: 'analytical'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_update_self',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I'm still figuring it out, honestly. But I'm taking my time with the decision now instead of rushing into pre-med on autopilot.\n\nI've been talking to professors, visiting different labs, even sitting in on a biomedical engineering class. Your belief that I could choose for myself - that's what gave me permission to explore.",
        emotion: 'reflective',
        variation_id: 'update_self_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_self']
    },
    choices: [
      {
        choiceId: 'support_exploration',
        text: "Take all the time you need.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'patience'
      },
      {
        choiceId: 'ask_insights_self',
        text: "What have you learned?",
        nextNodeId: 'maya_revisit_insights',
        pattern: 'exploring'
      }
    ]
  },

  // ============= NEXT STEPS (Optional Depth) =============
  {
    nodeId: 'maya_revisit_next_steps_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I'm meeting with the robotics engineering advisor next week. Going to map out the transfer process, look at which of my credits apply.\n\nIt's scary, but it's the good kind of scary. The kind that means you're moving toward something you actually want.",
        emotion: 'nervous_excited',
        variation_id: 'next_steps_robotics_v1'
      }
    ],
    choices: [
      {
        choiceId: 'finish_robotics',
        text: "I'm proud of you.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_next_steps_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "If I get accepted, I start in the fall semester. The program director actually reached out after seeing my MCAT scores and robotics projects.\n\nTurns out having 'too many interests' isn't a weakness - it's exactly what interdisciplinary programs look for.",
        emotion: 'confident',
        variation_id: 'next_steps_hybrid_v1'
      }
    ],
    choices: [
      {
        choiceId: 'finish_hybrid',
        text: "You're going to do amazing things.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_insights',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I learned that my parents' dreams for me came from love, not control. They wanted security and respect for their daughter.\n\nBut I also learned that honoring their love doesn't mean abandoning myself. I can find a path that respects their sacrifice AND feels like mine. That's what I'm searching for now.",
        emotion: 'mature',
        variation_id: 'insights_self_v1'
      }
    ],
    choices: [
      {
        choiceId: 'finish_insights',
        text: "That's beautiful wisdom.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'patience'
      }
    ]
  },

  // ============= CLOSING (Return to Samuel) =============
  {
    nodeId: 'maya_revisit_closing',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Thank you for coming back to check on me. It means a lot.\n\nSamuel's probably at the main platform if you want to see what other travelers need guidance tonight. Good luck with your own journey.",
        emotion: 'grateful',
        variation_id: 'revisit_closing_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_after_revisit',
        text: "Return to Samuel",
        nextNodeId: SAMUEL_HUB_AFTER_MAYA, // Avoids circular dependency ✅
        pattern: 'exploring'
      },
      {
        choiceId: 'stay_longer',
        text: "Can we talk more?",
        nextNodeId: 'maya_revisit_extended',
        pattern: 'patience'
      }
    ]
  },

  // ============= EXTENDED CONVERSATION (Optional) =============
  {
    nodeId: 'maya_revisit_extended',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Of course! I'm here as long as you need.\n\nActually, I wanted to ask you something. You helped me with my crossroads - but how is YOUR journey going? Have you found your path yet?",
        emotion: 'curious',
        variation_id: 'extended_v1'
      }
    ],
    choices: [
      {
        choiceId: 'reflect_still_searching',
        text: "I'm still searching.",
        nextNodeId: 'maya_revisit_reflection_searching',
        pattern: 'exploring'
      },
      {
        choiceId: 'reflect_helping_others',
        text: "Helping others is my path.",
        nextNodeId: 'maya_revisit_reflection_helping',
        pattern: 'helping'
      },
      {
        choiceId: 'deflect',
        text: "This isn't about me.",
        nextNodeId: 'maya_revisit_deflection',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_reflection_searching',
    speaker: 'Maya Chen',
    content: [
      {
        text: "That's okay. The station keeper told me that sometimes the answer finds you by helping others find theirs.\n\nMaybe your path is revealing itself through these conversations, even if you can't see the shape of it yet.",
        emotion: 'understanding',
        variation_id: 'reflection_searching_v1'
      }
    ],
    choices: [
      {
        choiceId: 'end_extended_searching',
        text: "Maybe you're right.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_reflection_helping',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I can see that. You have a gift for it - meeting people where they are, asking the right questions instead of giving answers.\n\nThat's rare. That's valuable. Maybe your path is guiding others through their crossroads.",
        emotion: 'appreciative',
        variation_id: 'reflection_helping_v1'
      }
    ],
    choices: [
      {
        choiceId: 'end_extended_helping',
        text: "Thank you for saying that.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_deflection',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*smiles gently*\n\nOkay, I won't push. Just know that you've already made a difference in at least one person's life. That counts for something.\n\nWhenever you're ready to talk about your journey, I'll listen the way you listened to me.",
        emotion: 'warm',
        variation_id: 'deflection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'end_extended_deflection',
        text: "I appreciate that.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'patience'
      }
    ]
  }
]

// ============= PUBLIC API: EXPORTED ENTRY POINTS =============
// These entry points are for cross-graph navigation.
// ONLY use these exported constants when linking from other graphs.

export const mayaRevisitEntryPoints = {
  /** Welcome back node - acknowledges shared history */
  WELCOME: 'maya_revisit_welcome'
} as const

// Type export for TypeScript autocomplete
export type MayaRevisitEntryPoint = typeof mayaRevisitEntryPoints[keyof typeof mayaRevisitEntryPoints]

export const mayaRevisitGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(mayaRevisitNodes.map(node => [node.nodeId, node])),
  startNodeId: mayaRevisitEntryPoints.WELCOME,
  metadata: {
    title: "Maya's Revisit Content",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: mayaRevisitNodes.length,
    totalChoices: mayaRevisitNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}