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
        text: `Hey! It's so good to see you again.

I've been thinking about our conversation a lot.{{noticed_contradiction: You saw right through me that day. when I said my parents were proud, and you caught the thing I wasn't saying.|}}{{player_gave_space: The way you gave me room to breathe instead of pushing... that meant more than you know.|}}{{shared_parent_failure: When you opened up about your own family stuff, I realized I wasn't as alone as I thought.|}}{{challenged_expectations: You were the first person to ask what I wanted, not what I should want.|}}\n\nIt really changed things for me.`,
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
        text: "How have you been?",
        nextNodeId: 'maya_revisit_update_robotics',
        pattern: 'helping',
        visibleCondition: { hasKnowledgeFlags: ['chose_robotics'] }
      },
      {
        choiceId: 'ask_about_decision_robotics',
        text: "How's your path going?",
        nextNodeId: 'maya_revisit_update_robotics',
        pattern: 'analytical',
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
        text: `I spoke to my parents about the robotics program. It wasn't easy - there were tears, some yelling, a lot of confusion.

But I explained how surgical robots save lives, how I could still help people, just in a different way.{{knows_anxiety: I told them about the panic attacks too. Finally.|}} They're... processing. It's a start.{{tried_parent_conversation:

Remember when I said I'd try talking to them? That conversation you encouraged me to have. this was it.|}}\n\nI kept thinking about what you said about engineering being about solving real problems. That's the angle that finally got through to my dad.`,
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
        text: `I submitted my application to UAB's biomedical engineering program. It's perfect - surgical robots, prosthetics, diagnostic devices.{{knows_biomedical_engineering:

You were the one who told me about it, remember? That there's a whole field that's medicine AND engineering? That literally changed everything.|}}\n\nMy parents are actually proud. They keep telling relatives their daughter will be a 'medical engineer.' It's close enough to doctor for them. And I get to build things.{{knows_anxiety:

No more panic attacks either. Turns out when you stop fighting yourself, the anxiety gets quieter.|}}\n\nBest of both worlds. Thanks to you.`,
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
        text: `I'm still figuring it out, honestly. But I'm taking my time with the decision now instead of rushing into pre-med on autopilot.{{player_gave_space:

You showed me that was okay. that not having all the answers right now isn't failure. You gave me that gift.|}}\n\nI've been talking to professors, visiting different labs, even sitting in on a biomedical engineering class.{{knows_robotics: I finally let myself admit I love building things. That was scary to say out loud before.|}}{{challenged_expectations:

You asked me what I wanted, and I didn't have an answer then. Now I'm actually looking for one. that's progress.|}}\n\nYour belief that I could choose for myself - that's what gave me permission to explore.`,
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
        text: "Return to Samuel",
        nextNodeId: SAMUEL_HUB_ROUTER,
        pattern: 'exploring'
      },
      {
        choiceId: 'stay_longer',
        text: "Can we talk more?",
        nextNodeId: 'maya_revisit_extended',
        pattern: 'patience'
      },
      // Loyalty Experience trigger - only visible at high trust + building pattern
      {
        choiceId: 'offer_demo_help',
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
        text: "Yeah, you caught it.\n\nThe Innovation Showcase is next week with real investors, my hands still shake in rehearsal, and my parents are finally seeing this as more than a school project.\n\nEverything points to this demo, and I need your help getting through it.",
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
        text: "You're right. I've been leaning on others my whole life - my parents' expectations, your guidance, everyone else's belief in me.\n\nMaybe it's time I believe in myself.\n\nThank you. For everything. For seeing me. For giving me space to become... this.",
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
        text: "Thank you. I can't tell you what this means.\n\nOkay. Deep breath. Let's do this together.",
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
        text: "I'm still searching. Conversations like this show options, not final answers.",
        nextNodeId: 'maya_revisit_reflection_searching',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'reflect_helping_others',
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
