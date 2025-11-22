/**
 * Kai's Dialogue Graph
 * The Instructional Architect - Platform 6 (Corporate Innovation / L&D)
 *
 * CHARACTER: The Frustrated Futurist
 * Core Conflict: "Safe & Boring" vs. "Disruptive & Effective"
 * Arc: From Corporate L&D Manager to Founder of an AI Learning Studio
 * Mechanic: "The Transformation" - Converting a boring slide deck into an AI simulation
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const kaiDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'kai_introduction',
    speaker: 'Kai',
    content: [
      {
        text: `*Kai is leaning against a glass wall, scrolling through a tablet with a look of profound boredom. They are dressed in a sharp, corporate-casual blazer.*

*They tap the screen aggressively.*

'Click Next to Continue.' 'Click Next to Continue.'

*They look up at you, eyes tired.*

Do you know how much money my company spends to make 50,000 people click 'Next' without reading a single word? Millions.`,
        emotion: 'cynical_bored',
        variation_id: 'kai_intro_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'kai_intro_waste',
        text: "That sounds like a waste of potential.",
        nextNodeId: 'kai_potential_reveal',
        pattern: 'building',
        skills: ['criticalThinking', 'financialLiteracy'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      },
      {
        choiceId: 'kai_intro_empathy',
        text: "You sound like you want to build something better.",
        nextNodeId: 'kai_potential_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'kai_intro_curious',
        text: "What *should* they be doing?",
        nextNodeId: 'kai_vision_reveal',
        pattern: 'exploring',
        skills: ['criticalThinking', 'creativity']
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'kai_arc']
  },

  {
    nodeId: 'kai_potential_reveal',
    speaker: 'Kai',
    content: [
      {
        text: `It's worse than a waste. It's active harm. We're training people to ignore us.

I have a Master's in Instructional Design. I know about cognitive load, spaced repetition, flow states.

But the VP just wants a completion certificate to show the auditors.`,
        emotion: 'frustrated',
        variation_id: 'potential_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_vision_ask',
        text: "If you were the VP, what would you build?",
        nextNodeId: 'kai_vision_reveal',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      },
      {
        choiceId: 'kai_trap_recognition',
        text: "You're trapped between your expertise and their bureaucracy.",
        nextNodeId: 'kai_golden_handcuffs',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'kai_vision_reveal',
    speaker: 'Kai',
    content: [
      {
        text: `I'd burn the slides.

Imagine an AI-driven simulation. You're a manager facing a supply chain crisis. The characters react to your voice. The scenario adapts. You fail, you learn, you try again.

It's limbic learning. You feel the pressure. You remember it forever.

But I can't even get approval for a branching scenario. 'Too complex,' they say.`,
        emotion: 'inspired_then_deflated',
        variation_id: 'vision_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_show_me',
        text: "Do you have a prototype?",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'building',
        skills: ['creativity', 'digitalLiteracy'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'kai_risk_assess',
        text: "The risk isn't complexity. The risk is irrelevance.",
        nextNodeId: 'kai_risk_realization',
        pattern: 'analytical',
        skills: ['strategicThinking', 'persuasion']
      }
    ]
  },

  {
    nodeId: 'kai_golden_handcuffs',
    speaker: 'Kai',
    content: [
      {
        text: `Exactly. And they pay me very well to stay trapped.

Golden handcuffs. I have a mortgage. A 401k.

Is it worth blowing all that up just because I'm bored?`, 
        emotion: 'fearful',
        variation_id: 'handcuffs_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_boredom_cost',
        text: "Boredom is expensive. It costs you your spark.",
        nextNodeId: 'kai_vision_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'careerDevelopment']
      }
    ]
  },

  // ============= THE SIMULATION: AI TRANSFORMATION =============
  {
    nodeId: 'kai_simulation_setup',
    speaker: 'Kai',
    content: [
      {
        text: `I... I have a sandbox version. On my personal laptop.

*Kai opens a sleek laptop. On screen is a split view: Left side is a wall of text titled 'Conflict Resolution Policy'. Right side is a blank canvas.*

I was trying to redesign the 'Difficult Conversations' module.

**SYSTEM ACTIVE: LEARNING ARCHITECT v4.0**
**SOURCE:** Static PDF (45 pages)
**GOAL:** Immersive Simulation

Help me. How do we turn page 14—'De-escalating Angry Clients'—into something real?`,
        emotion: 'nervous_excited',
        variation_id: 'sim_setup_v1',
        richEffectContext: 'warning', // Editor Mode
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'sim_ai_avatar',
        text: "[ACTION] Generate an AI avatar client who interrupts you if you pause too long.",
        nextNodeId: 'kai_sim_step_2',
        pattern: 'building',
        skills: ['digitalLiteracy', 'creativity', 'technicalLiteracy']
      },
      {
        choiceId: 'sim_emotional_mapping',
        text: "[ACTION] Map the user's voice tone to the client's anger level.",
        nextNodeId: 'kai_sim_step_2',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'systemsThinking']
      },
      {
        choiceId: 'sim_branching_consequence',
        text: "[ACTION] Create a failure branch where the client cancels the contract immediately.",
        nextNodeId: 'kai_sim_step_2',
        pattern: 'analytical',
        skills: ['gameDesign', 'strategicThinking']
      }
    ],
    tags: ['simulation', 'kai_arc', 'immersive_scenario']
  },

  {
    nodeId: 'kai_sim_step_2',
    speaker: 'SYSTEM ALERT',
    content: [
      {
        text: `*Kai types furiously. The screen shifts.*

**SCENARIO GENERATED.**
**CLIENT STATE:** Furious.
**STAKES:** $2M Contract.

*The AI client screams: "I don't care about your policy! I want it fixed NOW!"*

The traditional module would ask a multiple-choice question here. 'A) Apologize, B) Quote policy.'

That's too easy. What do we do instead?`,
        emotion: 'focused_flow',
        variation_id: 'sim_step_2_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'sim_pressure_timer',
        text: "[ACTION] Remove the pause button. Force a real-time response in 5 seconds.",
        nextNodeId: 'kai_sim_success',
        pattern: 'building',
        skills: ['learningAgility', 'riskManagement']
      },
      {
        choiceId: 'sim_ambiguity',
        text: "[ACTION] Make both options 'right' but with different trade-offs.",
        nextNodeId: 'kai_sim_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'instructionalDesign']
      }
    ],
    tags: ['simulation', 'kai_arc']
  },

  {
    nodeId: 'kai_sim_success',
    speaker: 'Kai',
    content: [
      {
        text: `*Kai leans back. The simulation runs. It's tense, messy, and real.*

My heart is racing just watching it.

That... that actually teaches something. It teaches composure.

If I show this to the VP, they'll freak out. "It's too unpredictable." "It's not compliant."`,
        emotion: 'awed_scared',
        variation_id: 'sim_success_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'kai_pitch_it',
        text: "Show them anyway. Disruption is always scary at first.",
        nextNodeId: 'kai_corporate_rejection',
        pattern: 'building',
        skills: ['courage', 'leadership']
      },
      {
        choiceId: 'kai_build_outside',
        text: "Maybe this isn't for them. Maybe this is for *your* studio.",
        nextNodeId: 'kai_studio_realization',
        pattern: 'exploring',
        skills: ['entrepreneurship', 'visionaryThinking']
      }
    ],
    tags: ['simulation_complete', 'kai_arc']
  },

  // ============= THE CROSSROADS =============
  {
    nodeId: 'kai_corporate_rejection',
    speaker: 'Kai',
    content: [
      {
        text: "I tried. Last year. I showed a prototype like this.\n\nThey buried it. 'Let's stick to Articulate Storyline. It's safer.'\n\nYou're right. It's not that I *can't* build this there. It's that they won't let me.",
        emotion: 'resigned_clarity',
        variation_id: 'rejection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_go_solo',
        text: "Then you have to build it yourself. Outside.",
        nextNodeId: 'kai_studio_realization',
        pattern: 'building',
        skills: ['entrepreneurship']
      }
    ]
  },

  {
    nodeId: 'kai_studio_realization',
    speaker: 'Kai',
    content: [
      {
        text: "A studio. 'Kairos Learning Design.'\n\nI met a guy downstairs, Rohan. He said the code is broken. I think the training is broken too. We're both just trying to find the truth.\n\nI could work with companies that actually want to change. Tech startups. Healthcare innovators.\n\nI have the skills. I have the vision. I just... I've been waiting for permission.",
        emotion: 'dawning_hope',
        variation_id: 'studio_v1',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'kai_give_permission',
        text: "You don't need their permission to be brilliant.",
        nextNodeId: 'kai_climax_decision',
        pattern: 'helping',
        skills: ['empowerment', 'leadership']
      },
      {
        choiceId: 'kai_market_need',
        text: "The market is starving for this. You'll find clients.",
        nextNodeId: 'kai_climax_decision',
        pattern: 'analytical',
        skills: ['businessAcumen', 'marketPositioning']
      }
    ]
  },

  {
    nodeId: 'kai_climax_decision',
    speaker: 'Kai',
    content: [
      {
        text: "*Kai closes the laptop. But this time, not in frustration. In resolution.*

I'm going to do it. I'm going to resign.

I'll freelance first. Build the portfolio. Then the studio.

It's risky. But staying is riskier. Staying means my brain slowly dies.",
        emotion: 'determined',
        variation_id: 'climax_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_farewell',
        text: "Go build the future, Kai.",
        nextNodeId: 'kai_farewell',
        pattern: 'building',
        skills: ['inspiration']
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['kai_chose_studio'],
        addGlobalFlags: ['kai_arc_complete']
      }
    ],
    tags: ['ending', 'kai_arc']
  },

  {
    nodeId: 'kai_farewell',
    speaker: 'Kai',
    content: [
      {
        text: "Thank you. You pushed me off the ledge I've been standing on for five years.

If you see Samuel... tell him I'm done clicking 'Next.' I'm writing the new code.",
        emotion: 'grateful',
        variation_id: 'farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_kai',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.KAI_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'kai_arc']
  }
]

export const kaiEntryPoints = {
  INTRODUCTION: 'kai_introduction'
} as const

export const kaiDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(kaiDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: kaiEntryPoints.INTRODUCTION,
  metadata: {
    title: "Kai's Studio",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: kaiDialogueNodes.length,
    totalChoices: kaiDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
