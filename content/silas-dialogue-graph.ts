/**
 * Silas's Dialogue Graph
 * The Systems Gardener - Platform 8 (Regenerative Tech / "Touch Grass")
 *
 * CHARACTER: The Humbled Engineer
 * Core Conflict: "Sensor Data" vs. "Ground Truth"
 * Arc: Realizing that nature has higher latency and harsher penalties than any server.
 * Mechanic: "The Drought" - Debugging a crop failure where the dashboard lies.
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const silasDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'silas_introduction',
    speaker: 'Silas',
    content: [
      {
        text: `"My grandmother died in the Texas freeze of '21. Not from the cold—from the insulin that spoiled when the power went out for four days."\n\n*Silas's voice is flat, controlled*\n\n"She lived 30 minutes from a wind farm. Thousands of turbines, just sitting there frozen because the grid operators didn't weatherize the infrastructure. Not 'couldn't'—*didn't*. Too expensive."\n\n*A pause*\n\n"I'm an engineer, not an activist. I don't do protests or policy papers. But I can design microgrids that don't give up when it gets hard. Systems that keep the lights on when the 'too expensive' excuses start flying."\n\n*He meets your eyes*\n\n"So when people ask me why I care about renewable energy, I don't talk about carbon emissions. I talk about my grandmother's fridge, and the insulin inside it, and the fact that she died because someone decided resilience wasn't worth the investment."\n\n*His voice drops*\n\n"I'm making it worth the investment.",
        emotion: 'grounded_anger',
        variation_id: 'silas_intro_rewrite',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'silas_intro_empathy',
        text: "I'm sorry for your loss.",
        nextNodeId: 'silas_grief_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_intro_tech',
        text: "How do you design systems that won't fail like that?",
        nextNodeId: 'silas_technical_philosophy',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'silas_arc']
  },

  {
    nodeId: 'silas_grief_response',
    speaker: 'Silas',
    content: [
      {
        text: `Don't be sorry. Be redundant.

Grief is just data without a use case. I turned mine into a spec sheet.

Every system I build now has triple redundancy. Solar, wind, and diesel backup. Because failure isn't an abstraction for me anymore.`,
        emotion: 'stoic',
        variation_id: 'grief_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_resilience',
        text: "Resilience is expensive. How do you pay for it?",
        nextNodeId: 'silas_bankruptcy_reveal',
        pattern: 'building',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'silas_pressure',
        text: "That's a lot of pressure to put on a circuit breaker.",
        nextNodeId: 'silas_technical_philosophy',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'silas_yaquin_connection',
        text: "Yaquin talked about fixing systems by removing the fluff. You're adding redundancy.",
        nextNodeId: 'silas_yaquin_reference',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        visibleCondition: {
          hasGlobalFlags: ['yaquin_arc_complete']
        }
      }
    ]
  },

  {
    nodeId: 'silas_yaquin_reference',
    speaker: 'Silas',
    content: [
      {
        text: `Yaquin? The guy rewriting the dental books?

He's right. In education, you cut. In life support, you add.

But we're both fighting the same enemy: "Good Enough."

The textbook says the old way is good enough. The grid operator says the old transformer is good enough. It's not.`,
        emotion: 'solidarity',
        variation_id: 'yaquin_ref_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_yaquin_back',
        text: "It's definitely not.",
        nextNodeId: 'silas_technical_philosophy',
        pattern: 'building'
      }
    ]
  },

  {
    nodeId: 'silas_technical_philosophy',
    speaker: 'Silas',
    content: [
      {
        text: `You assume the worst case. You design for the 100-year storm happening every Tuesday.

Most engineers optimize for efficiency. I optimize for survival.

But survival is expensive. And right now... I'm not sure I can afford it.`,
        emotion: 'worried',
        variation_id: 'philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_ask_trouble',
        text: "What's wrong?",
        nextNodeId: 'silas_bankruptcy_reveal',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'silas_bankruptcy_reveal',
    speaker: 'Silas',
    content: [
      {
        text: `I cashed out my Amazon stock options. All of it. Bought this vertical farm. "High-Efficiency Aeroponics."

Last quarter, the sensors said the pH was perfect. I lost the entire strawberry crop. $40,000 gone in a weekend.

If this basil dies, I lose the farm. I lose my house.`,
        emotion: 'desperate',
        variation_id: 'bankruptcy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_stakes_high',
        text: "So why are you staring at the tablet?",
        nextNodeId: 'silas_simulation_start',
        pattern: 'building',
        skills: ['actionOrientation']
      },
      {
        choiceId: 'silas_fear_paralysis',
        text: "You're afraid to trust your eyes because they don't have an API.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'analytical',
        skills: ['psychology']
      }
    ]
  },

  // ============= THE SIMULATION: MICROGRID CRISIS =============
  {
    nodeId: 'silas_simulation_start',
    speaker: 'Silas',
    content: [
      {
        text: `*Silas pulls up a grid visualization on the wall monitor*

"This is the microgrid we built for the coastal district. Hurricane's hitting in 3 hours. Main grid will fail—it always does."

┌─────────────────────────────────┐
│ MICROGRID STATUS: OPERATIONAL   │
├─────────────────────────────────┤
│ Solar Array:      0 kW (night)  │
│ Battery Storage:  847 kWh       │
│ Wind Turbines:    142 kW        │
│ Diesel Backup:    OFFLINE       │
├─────────────────────────────────┤
│ TOTAL CAPACITY:   142 kW        │
│ PROJECTED DEMAND: 380 kW        │
│ DEFICIT:          238 kW (63%)  │
└─────────────────────────────────┘

**CONNECTED BUILDINGS**
├─ Community Center    [120 kW] ← Shelter (200 people)
├─ Medical Clinic      [90 kW]  ← Dialysis, O2, ICU
├─ Fire Station        [45 kW]  ← Emergency response
├─ School              [80 kW]  ← Backup shelter
└─ Residential         [45 kW]  ← 43 homes

*He taps the deficit line*

"We don't have enough power for everyone. The battery will drain in 4 hours if we try. So we have to choose."

*His voice is completely flat*

"This is the part they don't put in the renewable energy brochures.",
        emotion: 'grim_practical',
        variation_id: 'sim_start_v3',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'sim_medical_priority',
        text: "[ACTION] Prioritize medical clinic—lives over comfort.",
        nextNodeId: 'silas_sim_medical_priority',
        pattern: 'helping',
        skills: ['crisisManagement', 'triage']
      },
      {
        choiceId: 'sim_community_priority',
        text: "[ACTION] Prioritize community center. It's the main shelter.",
        nextNodeId: 'silas_microgrid_failure', // FAILURE STATE INJECTION
        pattern: 'building',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'sim_distribute_evenly',
        text: "[ACTION] Distribute power evenly—reduce load across all buildings.",
        nextNodeId: 'silas_sim_fail_brownout',
        pattern: 'analytical', // Trying to be "fair" kills everyone
        skills: ['fairness']
      }
    ],
    tags: ['simulation', 'silas_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE 1: WRONG PRIORITY ---
  {
    nodeId: 'silas_microgrid_failure',
    speaker: 'Silas',
    content: [
      {
        text: `*The community center's lights flicker and die*

"The microgrid failed."

*Silas's voice is flat, emotionless—the engineer's mask firmly in place*

"You prioritized the community center because it's a shelter. Smart call on paper. Except you didn't account for the medical clinic two blocks over running on the same transformer."

*He pulls up a map*

"Dialysis machines. Oxygen concentrators. All offline. The clinic's backup generator has 30 minutes of fuel, and the roads are flooded."

*A long pause*

"This is what I meant about systems thinking. You can't just pick the 'most important' building. You have to map the dependencies."

**CONSEQUENCE**: Medical emergency, lives at risk, community trust shaken
**LESSON**: Renewable systems require NETWORK thinking, not priority lists`,
        emotion: 'devastated_flat',
        variation_id: 'sim_fail_priority_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'silas_retry_priority',
        text: "I didn't see the dependency. Let me try again.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'patience',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'silas_give_up_priority',
        text: "It's too complex. I can't make these calls.",
        nextNodeId: 'silas_bad_ending',
        pattern: 'helping',
        consequence: {
          addGlobalFlags: ['silas_chose_tech'] // BAD ENDING
        }
      }
    ],
    tags: ['simulation', 'silas_arc']
  },

  // --- FAILURE STATE 2: BROWNOUT ---
  {
    nodeId: 'silas_sim_fail_brownout',
    speaker: 'Silas',
    content: [
      {
        text: `*You try to balance the load. Voltage drops across the board.*

**SYSTEM ALERT: UNDERVOLTAGE LOCKOUT.**

*Every breaker trips at once. The entire grid goes dark.*

"Fairness," Silas says quietly, "is a physics violation."

"You tried to give everyone 60% power. Motors burned out. Compressors stalled. Now nobody has anything.",
        emotion: 'cold_logic',
        variation_id: 'sim_fail_brownout_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'silas_retry_brownout',
        text: "You're right. Physics doesn't care about fairness.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'analytical',
        skills: ['physics']
      }
    ]
  },

  // --- SUCCESS STATE ---
  {
    nodeId: 'silas_sim_medical_priority',
    speaker: 'Silas',
    content: [
      {
        text: `*You cut the residential and school lines. The clinic stays green.*

"It's ugly," Silas says. "Those 43 homes are dark. The school is dark."

*He points to the clinic status.*

"But the ventilators are running. The insulin is cold."

*He exhales.*

"You saved the critical node. You let the rest fail safely. That's resilience. It's not about everything working. It's about the right things surviving.",
        emotion: 'respect',
        variation_id: 'sim_success_v3',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'silas_lesson_survival',
        text: "Resilience is about choices.",
        nextNodeId: 'silas_climax_decision',
        pattern: 'building',
        skills: ['decisionMaking']
      }
    ],
    tags: ['simulation_complete', 'silas_arc']
  },

  // ============= THE TURN =============
  {
    nodeId: 'silas_climax_decision',
    speaker: 'Silas',
    content: [
      {
        text: "Systems are everywhere. I saw a kid, Devon, drawing flowcharts for his dad. He gets it. A family is just a network that needs maintenance.

But I'm done with 'Smart Farming.'

I'm going to start a 'Feral Lab.' Low-tech. High-biology.

We teach engineers how to touch grass. Real grass. How to listen to a system that doesn't have an API.",
        emotion: 'resolved_grounded',
        variation_id: 'climax_v2'
      }
    ],
    choices: [
      {
        choiceId: 'silas_farewell',
        text: "Touch grass, Silas.",
        nextNodeId: 'silas_farewell',
        pattern: 'helping',
        skills: ['humor']
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        addKnowledgeFlags: ['silas_chose_soil'],
        addGlobalFlags: ['silas_arc_complete']
      }
    ],
    tags: ['ending', 'silas_arc']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'silas_bad_ending',
    speaker: 'Silas',
    content: [
      {
        text: "*Silas stands up, dusting off his knees.*

I'm listing the equipment on eBay tomorrow.

I'll take a contract job. Database admin. Something air-conditioned. Something where I can't kill anything.

Safe travels.",
        emotion: 'resigned',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.SILAS_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['silas_chose_tech', 'silas_arc_complete']
      }
    ],
    tags: ['ending', 'bad_ending', 'silas_arc']
  },

  {
    nodeId: 'silas_farewell',
    speaker: 'Silas',
    content: [
      {
        text: "I will.

If you see Samuel, tell him... tell him the sensor was wrong. The ground was right.",
        emotion: 'peaceful',
        variation_id: 'farewell_v2'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_silas',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.SILAS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'silas_arc']
  }
]

export const silasEntryPoints = {
  INTRODUCTION: 'silas_introduction'
} as const

export const silasDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(silasDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: silasEntryPoints.INTRODUCTION,
  metadata: {
    title: "Silas's Garden",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: silasDialogueNodes.length,
    totalChoices: silasDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
