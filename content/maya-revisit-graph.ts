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
import { buildDialogueNodesMap } from './drafts/draft-filter'

/**
 * IMPORTANT: We use string literals for Samuel's entry points to avoid circular dependencies
 * samuel-dialogue-graph.ts imports maya-revisit-graph.ts
 * If we import back, we create a cycle
 */
// Avoid circular dependency by using the stable Samuel hub router entrypoint.
const SAMUEL_HUB_ROUTER = 'samuel_hub_router'

export const mayaRevisitNodes: DialogueNode[] = [
  // ============= WELCOME BACK (Entry Point) =============
  {
    nodeId: 'maya_revisit_welcome',
    speaker: 'Maya Chen',
    content: [
      {
        // Deep callbacks to specific moments from the first arc
        text: `Hey, it's so good to see you again.

I've been thinking about our conversation a lot{{noticed_contradiction:; you saw right through me when I said my parents were proud.|}}{{player_gave_space:; you gave me room to breathe instead of pushing.|}}{{shared_parent_failure:; when you shared your family stuff, I realized I wasn't alone.|}}{{challenged_expectations:; you asked what I wanted, not what I should want.|}}\n\nIt really changed things for me.`,
        emotion: 'warm',
        variation_id: 'revisit_welcome_v2_callbacks'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    choices: [
      // Robotics path choices
      {
        choiceId: 'ask_how_are_you_robotics',
        taxonomyClass: 'accept',
        text: "How have you been?",
        nextNodeId: 'maya_revisit_update_robotics',
        pattern: 'helping',
        visibleCondition: { hasKnowledgeFlags: ['chose_robotics'] }
      },
      {
        choiceId: 'ask_about_decision_robotics',
        taxonomyClass: 'reject',
        text: "How's your path going?",
        nextNodeId: 'maya_revisit_update_robotics',
        pattern: 'analytical',
        visibleCondition: { hasKnowledgeFlags: ['chose_robotics'] }
      },
      // Hybrid path choices
      {
        choiceId: 'ask_how_are_you_hybrid',
        taxonomyClass: 'deflect',
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
        text: `I finally talked to my parents about robotics. It got loud, but I explained I can still save lives by building surgical tools, and they're starting to listen. {{tried_parent_conversation:That conversation you pushed me to have was the turning point.|}}{{knows_anxiety:And I told them the panic had a cause, not a flaw.|}}`,
        emotion: 'hopeful',
        variation_id: 'update_robotics_v2_callbacks'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_robotics']
    },
    choices: [
      {
        choiceId: 'encourage_robotics',
        text: "Quick update: robotics track is moving, stakes are rising, and I.",
        nextNodeId: 'maya_revisit_closing',
        pattern: 'helping'
      },
      {
        choiceId: 'ask_next_steps_robotics',
        text: "What's your next step?",
        nextNodeId: 'maya_revisit_next_steps_robotics',
        pattern: 'building'
      }
    ]
  },

  {
    nodeId: 'maya_revisit_update_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: `I applied to UAB biomedical engineering and it finally feels aligned. My parents can name it, I can build, and the medicine-vs-engineering split isn't tearing me up anymore. {{knows_biomedical_engineering:You gave me the language for this path before I could even imagine it.|}}{{knows_anxiety:The anxiety got quieter once I stopped pretending.|}}`,
        emotion: 'excited',
        variation_id: 'update_hybrid_v2_callbacks'
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
        text: `I'm still figuring it out, but now it's deliberate instead of panic. I'm talking to professors, visiting labs, and finally admitting I love building things. {{player_gave_space:You gave me permission to not have a final answer yet.|}}{{challenged_expectations:You asked what I wanted, and now I'm actually searching for it.|}}`,
        emotion: 'reflective',
        variation_id: 'update_self_v2_callbacks'
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
        text: "I'm meeting with the robotics engineering advisor next week.",
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
        text: "If I get accepted, I start in the fall semester.",
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
        text: "I learned that my parents' dreams for me came from love, not control. They wanted security and respect for their daughter.",
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
        text: "Thank you for coming back to check on me.",
        emotion: 'grateful',
        variation_id: 'revisit_closing_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_after_revisit',
        taxonomyClass: 'accept',
        text: "Return to Samuel",
        nextNodeId: SAMUEL_HUB_ROUTER,
        pattern: 'exploring'
      },
      {
        choiceId: 'stay_longer',
        taxonomyClass: 'reject',
        text: "Can we talk more?",
        nextNodeId: 'maya_revisit_extended',
        pattern: 'patience'
      },
      // Loyalty Experience trigger - only visible at high trust + building pattern
      {
        choiceId: 'offer_demo_help',
        taxonomyClass: 'deflect',
        text: "[Builder's Insight] You mentioned a demo coming up. Need help preparing?",
        nextNodeId: 'maya_loyalty_trigger',
        pattern: 'building',
        skills: ['communication', 'collaboration'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { building: { min: 50 } }
        }
      }
    ]
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'maya_loyalty_trigger',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Yeah, you caught it.\n\nThe Innovation Showcase is next week with real investors, and my hands still shake in rehearsal while my parents finally take this seriously.\n\nI need your help getting through the demo.",
        emotion: 'vulnerable_determined',
        variation_id: 'loyalty_trigger_v1',
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 8 },
      patterns: { building: { min: 5 } }
    },
    metadata: {
      experienceId: 'the_demo'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_demo_challenge',
        text: "I'm with you. Let's make this demo undeniable.",
        nextNodeId: 'maya_loyalty_start',  // Experience engine takes over
        pattern: 'building',
        skills: ['collaboration', 'emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "You've got this, Maya. You don't need me - you need to trust yourself.",
        nextNodeId: 'maya_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'maya_loyalty', 'high_trust']
  },

  {
    nodeId: 'maya_loyalty_declined',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You're right: I've leaned on other people's belief for too long.\n\nMaybe it's time I trust myself.\n\nThank you for seeing me and giving me space to become this.",
        emotion: 'resolved_grateful',
        variation_id: 'loyalty_declined_v1'
      }
    ],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "Go show them who you are.",
        nextNodeId: SAMUEL_HUB_ROUTER,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'maya_loyalty_start',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Thank you; I can't tell you what this means.\n\nDeep breath. Let's do this together.",
        emotion: 'nervous_determined',
        variation_id: 'loyalty_start_v1'
      }
    ],
    metadata: {
      experienceId: 'the_demo'  // Experience engine takes over from here
    },
    choices: []  // Experience engine handles next steps
  },

  // ============= EXTENDED CONVERSATION (Optional) =============
  {
    nodeId: 'maya_revisit_extended',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Of course!",
        emotion: 'curious',
        variation_id: 'extended_v1'
      }
    ],
    choices: [
      {
        choiceId: 'reflect_still_searching',
        taxonomyClass: 'accept',
        text: "I'm still searching. Conversations like this show options, not final answers.",
        nextNodeId: 'maya_revisit_reflection_searching',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'reflect_helping_others',
        taxonomyClass: 'reject',
        text: "Helping others find their path might be mine too: ask good questions and create space.",
        nextNodeId: 'maya_revisit_reflection_helping',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'deflect',
        text: "I'd rather not talk yet. My uncertainty feels too raw today.",
        nextNodeId: 'maya_revisit_deflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'reflect_seeing_patterns',
        taxonomyClass: 'deflect',
        text: "I'm seeing patterns in how I show up. Maybe that's the path.",
        nextNodeId: 'maya_revisit_reflection_helping',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'maya_revisit_reflection_searching',
    speaker: 'Maya Chen',
    content: [
      {
        text: "That's okay.",
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
        text: "I can see that.",
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
        text: "Okay, I won't push.",
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
  nodes: buildDialogueNodesMap('maya_revisit', mayaRevisitNodes),
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
