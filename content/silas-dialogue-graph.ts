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
        text: `*Silas is kneeling in the dirt. Not digging—shaking. He's holding a clump of soil like it's a live grenade.*

*He looks at a tablet propped up on a crate. It displays a cheerful green checkmark: "MOISTURE OPTIMAL."*

*He squeezes the soil. It crumbles into dust. Bone dry.*

The dashboard says we're fine. The dashboard says I'm a genius.

But the basil is dying.`,
        emotion: 'fearful_disbelief',
        variation_id: 'silas_intro_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'silas_intro_reality',
        text: "The map isn't the territory.",
        nextNodeId: 'silas_bankruptcy_reveal',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_intro_tech',
        text: "Sensor calibration drift?",
        nextNodeId: 'silas_tech_defense',
        pattern: 'analytical',
        skills: ['technicalLiteracy']
      },
      {
        choiceId: 'silas_intro_empathy',
        text: "You look terrified.",
        nextNodeId: 'silas_bankruptcy_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
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
    nodeId: 'silas_bankruptcy_reveal',
    speaker: 'Silas',
    content: [
      {
        text: `I should be.

I cashed out my Amazon stock options. All of it. Bought this vertical farm. "High-Efficiency Aeroponics."

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

  {
    nodeId: 'silas_tech_defense',
    speaker: 'Silas',
    content: [
      {
        text: `It's not drift! These are military-grade hygrometers. They cost more than my truck.

They *can't* be wrong. Because if they're wrong, then I don't know anything. I'm just a guy playing in the dirt with expensive toys.`,
        emotion: 'defensive_panic',
        variation_id: 'tech_defense_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_look_down',
        text: "Look at the dirt, Silas.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'helping',
        skills: ['grounding']
      }
    ]
  },

  // ============= THE SIMULATION: THE DROUGHT =============
  {
    nodeId: 'silas_simulation_start',
    speaker: 'Silas',
    content: [
      {
        text: `*He shoves the tablet at you.*

**SYSTEM STATUS:**
**ZONE 4:** 65% HUMIDITY (OPTIMAL)
**FLOW RATE:** 2.5 L/MIN
**VALVE STATE:** OPEN

It says the water is flowing. It says everything is fine.

*He points to the wilted plants.*

But look at them. They're gasping.

What do I do? If I override the system and flood them, I could rot the roots. If I do nothing, they dry out by morning.`,
        emotion: 'paralyzed',
        variation_id: 'sim_start_v2',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'sim_trust_sensor',
        text: "[ACTION] Trust the data. Run a diagnostic on the valve software.",
        nextNodeId: 'silas_sim_fail_software',
        pattern: 'analytical', // Wrong tool
        skills: ['digitalLiteracy'] 
      },
      {
        choiceId: 'sim_physical_trace',
        text: "[ACTION] Follow the pipe. Physically trace the water line from the tank to the bed.",
        nextNodeId: 'silas_sim_step_2',
        pattern: 'building',
        skills: ['systemsThinking', 'observation']
      },
      {
        choiceId: 'sim_override_flood',
        text: "[ACTION] Manual Override. Open the emergency floodgates NOW.",
        nextNodeId: 'silas_sim_fail_rot',
        pattern: 'helping', // Panic reaction
        skills: ['crisisManagement']
      }
    ],
    tags: ['simulation', 'silas_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE 1: SOFTWARE TRAP ---
  {
    nodeId: 'silas_sim_fail_software',
    speaker: 'Silas',
    content: [
      {
        text: `*You run the diagnostic. A loading bar spins.*

**DIAGNOSTIC COMPLETE: NO ERRORS FOUND.**

*Silas stares at the screen. A leaf falls off the basil plant next to him. It crunches when it hits the floor.*

The software says we're fine. The plant is dead.

I... I can't do this. I'm going back to cloud computing. At least there, when it says 'Up', it means 'Up'.`,
        emotion: 'defeated_hollow',
        variation_id: 'sim_fail_software_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'silas_give_up',
        text: "Maybe that's best.",
        nextNodeId: 'silas_bad_ending',
        pattern: 'patience',
        consequence: {
          addGlobalFlags: ['silas_chose_tech'] // BAD ENDING
        }
      },
      {
        choiceId: 'silas_retry_physical',
        text: "Stop looking at the screen! Look at the pipe!",
        nextNodeId: 'silas_simulation_start',
        pattern: 'helping',
        skills: ['urgency']
      }
    ]
  },

  // --- FAILURE STATE 2: ROOT ROT ---
  {
    nodeId: 'silas_sim_fail_rot',
    speaker: 'Silas',
    content: [
      {
        text: `*You yank the manual lever. Water roars into the bed.*

*The dry soil turns to mud instantly. But the water doesn't drain. It sits there, stagnating.*

**ALERT: ROOT ANOXIA DETECTED.**

*Silas groans.*

We drowned them. The soil was compacted. It couldn't drain. Now they'll rot before morning.

I panicked. I broke the system because I was scared.`,
        emotion: 'guilt',
        variation_id: 'sim_fail_rot_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'silas_retry_calm',
        text: "We can drain it. But we need to find the blockage.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'patience',
        skills: ['resilience']
      }
    ]
  },

  // --- STEP 2: THE PHYSICAL BLOCK ---
  {
    nodeId: 'silas_sim_step_2',
    speaker: 'Silas',
    content: [
      {
        text: `*You crawl under the rack. You trace the PVC pipe. It vibrates—there's water inside.*

*But right before the nozzle... a kink. A physical crimp in the line.*

*Silas crawls next to you.*

The sensor measures flow at the *valve*. The kink is *after* the valve.

The sensor wasn't lying. It was measuring the wrong thing. It was measuring intent, not delivery.`,
        emotion: 'epiphany',
        variation_id: 'sim_step_2_v2',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'sim_uncrimp',
        text: "[ACTION] Unkink the pipe. Restore the flow.",
        nextNodeId: 'silas_sim_success',
        pattern: 'building',
        skills: ['actionOrientation']
      }
    ],
    tags: ['simulation', 'silas_arc']
  },

  {
    nodeId: 'silas_sim_success',
    speaker: 'Silas',
    content: [
      {
        text: `*A hiss of air, then a steady trickle of water. The soil darkens.*

*Silas touches the wet dirt. He closes his eyes.*

Ground truth.

I spent all year coding dashboards to avoid crawling in the dirt. But the answer was in the dirt.`,
        emotion: 'humbled',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'silas_lesson',
        text: "You can't farm from a dashboard.",
        nextNodeId: 'silas_climax_decision',
        pattern: 'wisdom',
        skills: ['groundedness']
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