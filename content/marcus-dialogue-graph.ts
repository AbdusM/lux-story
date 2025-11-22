/**
 * Marcus's Dialogue Graph
 * The High-Stakes Operator - Platform 4 (Medical Tech)
 *
 * CHARACTER: The Cardiothoracic Specialist
 * Core Conflict: The weight of holding a life in a machine vs. the precision of engineering
 * Arc: From "just a nurse" to recognizing the technical mastery of life-support systems
 * Mechanic: "The Simulation" - A text-based "VR" experience of an ECMO procedure
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const marcusDialogueNodes: DialogueNode[] = [
  // ... [INTRODUCTION NODES SAME AS BEFORE UNTIL SIMULATION] ...
  // ============= INTRODUCTION =============
  {
    nodeId: 'marcus_introduction',
    speaker: 'Marcus',
    content: [
      {
        text: `*He's staring at his hands, holding them perfectly still in the air. His breathing is shallow, controlled.*

Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable.

*He blinks, looking at you.*

Don't bump the table. Please.`,
        emotion: 'focused_tense',
        variation_id: 'marcus_intro_v1',
        richEffectContext: 'warning' // High tension
      }
    ],
    choices: [
      {
        choiceId: 'marcus_intro_sorry',
        text: "*Step back carefully* I won't touch anything.",
        nextNodeId: 'marcus_visualizes_machine',
        pattern: 'patience',
        skills: ['adaptability', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_intro_curious',
        text: "What are you seeing right now?",
        nextNodeId: 'marcus_visualizes_machine',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'marcus_intro_check',
        text: "You look like you're holding something invisible.",
        nextNodeId: 'marcus_visualizes_machine',
        pattern: 'analytical',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'marcus_arc']
  },

  {
    nodeId: 'marcus_visualizes_machine',
    speaker: 'Marcus',
    content: [
      {
        text: `I'm holding a life. Well, the machine that holds the life.

ECMO. Extracorporeal Membrane Oxygenation. It pulls blood out, oxygenates it, warms it, and pumps it back in.

For the last twelve hours, I was the only thing keeping a 40-year-old father alive while his heart waited for a transplant.`,
        emotion: 'exhausted_proud',
        variation_id: 'visualizes_machine_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_high_stakes',
        text: "That sounds incredibly high-stakes.",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'marcus_machine_mechanics',
        text: "You run the machine yourself?",
        nextNodeId: 'marcus_technical_pride',
        pattern: 'analytical',
        skills: ['criticalThinking', 'digitalLiteracy']
      }
    ]
  },

  {
    nodeId: 'marcus_technical_pride',
    speaker: 'Marcus',
    content: [
      {
        text: `Me and the machine. We're a loop. I watch the flow dynamics, the hemolysis numbers, the clot risks.

People think nursing is just... comforting. And it is. But in the CVICU (Cardiovascular Intensive Care Unit), it's engineering. Fluid dynamics. Pressure regulation.

If I calculate the heparin drip wrong, he bleeds out. If I miss a clot, he strokes out.`,
        emotion: 'proud',
        variation_id: 'technical_pride_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_engineering_mindset',
        text: "You think like an engineer.",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_heavy_burden',
        text: "That's a terrifying amount of responsibility.",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= THE INCIDENT: THE AIR BUBBLE =============
  {
    nodeId: 'marcus_the_bubble',
    speaker: 'Marcus',
    content: [
      {
        text: `But the real enemy? Air.

One bubble. One tiny pocket of air in the return line. If it hits his brain? Stroke. If it hits his heart? Vapor lock. Death.

Instant.

Tonight... the alarm screamed. 'AIR IN LINE.'`,
        emotion: 'tense',
        variation_id: 'the_bubble_v1',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'marcus_what_did_you_do',
        text: "What did you do?",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'exploring',
        skills: ['problemSolving']
      },
      {
        choiceId: 'marcus_panic_check',
        text: "Did you panic?",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= THE SIMULATION (Updated: Character Narrates System) =============
  {
    nodeId: 'marcus_simulation_start',
    speaker: 'Marcus',
    content: [
      {
        text: `I didn't think. I just moved. 

I want you to see it. Close your eyes. Put your hands out.

*He guides your hands into position. The air around you seems to hum with machinery.*

*Marcus's voice becomes tight, mechanical.*

"Monitor is screaming. Red strobe. Oxygen saturation dropping. 98... 95... 92. The bubble detector is flashing. It sees air in the arterial line."`,
        emotion: 'clinical_simulation',
        variation_id: 'sim_start_v2',
        richEffectContext: 'warning' // Simulation UI feel
      }
    ],
    choices: [
      {
        choiceId: 'sim_clamp_line',
        text: "[ACTION] CLAMP THE LINE immediately to stop flow.",
        nextNodeId: 'marcus_sim_step_2',
        pattern: 'building',
        skills: ['problemSolving', 'criticalThinking']
      },
      {
        choiceId: 'sim_call_help',
        text: "[ACTION] Yell for the surgeon.",
        nextNodeId: 'marcus_sim_fail_slow',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['simulation', 'marcus_arc', 'interactive_episode']
  },

  {
    nodeId: 'marcus_sim_fail_slow',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus shakes his head, dropping his hands.*

"Too slow. By the time the surgeon turned around, the bubble traveled 40cm. It hit the patient's carotid artery."

*He looks at you, eyes haunted.*

"Flatline. Asystole. He's gone. You have 1.5 seconds. You can't wait for permission."`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_v2',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_sim',
        text: "Reset. Let me try again.",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'patience',
        skills: ['adaptability', 'emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'marcus_sim_step_2',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus nods. He mimes clamping a heavy tubing.*

"Good. Flow stopped. But look at the patient map."

*He points to the invisible monitor.*

"Blood pressure crashing. He has no flow. You clamped his life support. The bubble is trapped right before the cannula."

"What do you do?"`,
        emotion: 'clinical_simulation',
        variation_id: 'sim_step_2_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'sim_flick_line',
        text: "[ACTION] Flick the tubing to dislodge the bubble back to the port.",
        nextNodeId: 'marcus_sim_step_3',
        pattern: 'building',
        skills: ['digitalLiteracy', 'problemSolving']
      },
      {
        choiceId: 'sim_unclamp',
        text: "[ACTION] Unclamp. He needs blood flow!",
        nextNodeId: 'marcus_sim_fail_air',
        pattern: 'helping',
        skills: ['emotionalIntelligence'] // Good intention, bad outcome
      }
    ],
    tags: ['simulation', 'marcus_arc']
  },

  {
    nodeId: 'marcus_sim_fail_air',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus winces.*

"You unclamped. I saw the bubble enter the cannula. It's in him now."

*He looks down at his hands.*

"Vapor lock. Massive stroke. He's gone. You saved the flow, but you delivered the poison. Precision matters more than speed."`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_air_v2',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_sim_2',
        text: "Reset. I understand now.",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'analytical',
        skills: ['adaptability']
      }
    ]
  },

  {
    nodeId: 'marcus_sim_step_3',
    speaker: 'Marcus',
    content: [
      {
        text: `*He mimics flicking the line. Hard.*

"Bubble isolated. It's at the access port. You have a syringe."

"Patient O2 is dropping. 88... 85... 82..."

"He's becoming hypoxic. You have seconds."`,
        emotion: 'clinical_simulation',
        variation_id: 'sim_step_3_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'sim_aspirate',
        text: "[ACTION] Aspirate (suck out) the bubble with the syringe.",
        nextNodeId: 'marcus_sim_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'digitalLiteracy']
      },
      {
        choiceId: 'sim_push_fluid',
        text: "[ACTION] Push saline into the port.",
        nextNodeId: 'marcus_sim_fail_push',
        pattern: 'building',
        skills: ['creativity'] // Creative but wrong
      }
    ],
    tags: ['simulation', 'marcus_arc']
  },

  {
    nodeId: 'marcus_sim_fail_push',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus sighs, a heavy sound.*

"You pushed against the pressure. You just drove the bubble further down the line."

"Now it's impossible to retrieve. We have to change the whole circuit. He won't survive the changeover time."

"It's over."`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_push_v2',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_sim_3',
        text: "One more time. I can do this.",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'patience',
        skills: ['adaptability', 'emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'marcus_sim_success',
    speaker: 'Marcus',
    content: [
      {
        text: `*The hum of the machine seems to settle into a steady rhythm.*

"System stable. Patient O2 rising... 98%."

*Marcus opens his eyes. He looks exhausted but alive.*

"You got it. Clean line. Flow restored. He wakes up tomorrow."`,
        emotion: 'relieved_triumphant',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_post_sim_reaction',
        text: "That was... intense.",
        nextNodeId: 'marcus_career_bridge',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'marcus_post_sim_tech',
        text: "The precision required... that's engineering.",
        nextNodeId: 'marcus_career_bridge',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['completed_ecmo_simulation'],
        addGlobalFlags: ['marcus_sim_complete']
      }
    ],
    tags: ['simulation_complete', 'marcus_arc']
  },

  // ... [CAREER BRIDGE & ENDING - UNCHANGED] ...
  {
    nodeId: 'marcus_career_bridge',
    speaker: 'Marcus',
    content: [
      {
        text: `That's the job. It's not just 'caring.' It's technical mastery.

There's a whole world of this. Perfusionists run these machines in surgery. Biomedical engineers design them so they don't trap air in the first place. Healthcare software devs write the code that screams 'AIR IN LINE.'

I started as a nurse. But now? I'm thinking about designing the next machine.`,
        emotion: 'inspired',
        variation_id: 'career_bridge_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_biomed_path',
        text: "You'd be amazing at designing them. You know exactly how they fail.",
        nextNodeId: 'marcus_farewell',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'marcus_perfusion_path',
        text: "The operating room needs people like you running the console.",
        nextNodeId: 'marcus_farewell',
        pattern: 'helping',
        skills: ['adaptability'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['career_bridge', 'marcus_arc']
  },

  {
    nodeId: 'marcus_farewell',
    speaker: 'Marcus',
    content: [
      {
        text: `Thanks. It felt good to walk someone else through it. Makes the weight a little lighter.

If you see Samuel... tell him the patient made it. The machine held.`,
        emotion: 'grateful',
        variation_id: 'farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel',
        text: "I'll tell him.",
        nextNodeId: samuelEntryPoints.MARCUS_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['completed_arc'],
        addGlobalFlags: ['marcus_arc_complete']
      }
    ],
    tags: ['ending', 'marcus_arc']
  }
]

// Export entry points
export const marcusEntryPoints = {
  INTRODUCTION: 'marcus_introduction',
  SIMULATION_START: 'marcus_simulation_start'
} as const

export const marcusDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(marcusDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: marcusEntryPoints.INTRODUCTION,
  metadata: {
    title: "Marcus's Circuit",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: marcusDialogueNodes.length,
    totalChoices: marcusDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}