/**
 * Silas's Dialogue Graph
 * The Systems Gardener - Platform 8 (Regenerative Tech / "Touch Grass")
 *
 * CHARACTER: The Cloud Architect turned Farmer
 * Core Conflict: "Digital Burnout" vs. "Physical Complexity"
 * Arc: Realizing that a farm is just a server cluster that breathes (Systems Thinking applied to Nature)
 * Mechanic: "The Hive" - Debugging a biological system collapse using sensor data vs. intuition
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
        text: `*He's kneeling by a hydroponic rack, checking the pH levels of a nutrient tank. He's wearing a flannel shirt that smells like soil and ozone.*

*He taps a ruggedized tablet.*

Nitrogen levels are spiking in Zone 4. The mycelium network should have buffered that. 

*He looks at you.*

You look like you've spent too much time staring at pixels. I know the look. I used to be a Cloud Architect at Amazon. Now I debug dirt.`,
        emotion: 'grounded',
        variation_id: 'silas_intro_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'silas_intro_escape',
        text: "Debug dirt? Sounds peaceful.",
        nextNodeId: 'silas_peace_myth',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'silas',
          trustChange: 1
        }
      },
      {
        choiceId: 'silas_intro_systems',
        text: "Mycelium network... you talk about it like it's a server mesh.",
        nextNodeId: 'silas_systems_reveal',
        pattern: 'analytical',
        skills: ['systemsThinking', 'biomimicry'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_intro_why_leave',
        text: "Why did you leave Amazon?",
        nextNodeId: 'silas_burnout_reveal',
        pattern: 'exploring',
        skills: ['communication']
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
    nodeId: 'silas_peace_myth',
    speaker: 'Silas',
    content: [
      {
        text: `Peaceful? Nature isn't peaceful. It's a chaotic, high-throughput system with zero downtime and brutal garbage collection.

People think farming is "simple." It's the most complex distributed system on earth.

If AWS goes down, people can't watch Netflix. If my pollination drones fail, the crop dies.`,
        emotion: 'intense_respect',
        variation_id: 'peace_myth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_stakes',
        text: "Higher stakes. Lower latency.",
        nextNodeId: 'silas_systems_reveal',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'silas_burnout_reveal',
    speaker: 'Silas',
    content: [
      {
        text: `I spent 15 years optimizing virtual machines. Making imaginary numbers go up.

Then I realized: I couldn't eat code. I couldn't hold a server instance.

I wanted to touch something real. Something that fought back.`,
        emotion: 'reflective',
        variation_id: 'burnout_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_atoms_bits',
        text: "From bits to atoms.",
        nextNodeId: 'silas_systems_reveal',
        pattern: 'building',
        skills: ['creativity']
      }
    ]
  },

  {
    nodeId: 'silas_systems_reveal',
    speaker: 'Silas',
    content: [
      {
        text: `Exactly. But here's the joke: I didn't stop being an engineer.

I monitor humidity deltas. I code drone flight paths. I analyze soil microbiome data.

I'm still a systems architect. I just changed the substrate.`,
        emotion: 'proud',
        variation_id: 'systems_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_start_sim',
        text: "Show me the system.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'analytical',
        skills: ['curiosity', 'technicalLiteracy']
      }
    ]
  },

  // ============= THE SIMULATION: HIVE COLLAPSE =============
  {
    nodeId: 'silas_simulation_start',
    speaker: 'Silas',
    content: [
      {
        text: `*He hands you the tablet. It displays a heatmap of a beehive.*

**SYSTEM ALERT: HIVE 4 THERMAL ANOMALY**
**INTERNAL TEMP:** 96°F (RISING)
**HUMIDITY:** 40% (DROPPING)
**AUDIO:** HIGH FREQUENCY BUZZ

The AI says it's a ventilation failure. It recommends opening the vents.

But look at the audio graph. That's not overheating. That's a war cry.`,
        emotion: 'focused_crisis',
        variation_id: 'sim_start_v1',
        richEffectContext: 'warning', // Dashboard Mode
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'hive_trust_ai',
        text: "[ACTION] Trust the sensor. Open the vents to cool the hive.",
        nextNodeId: 'silas_sim_fail_robbers',
        pattern: 'analytical',
        skills: ['dataLiteracy'] // Too trusting of data
      },
      {
        choiceId: 'hive_listen',
        text: "[ACTION] Ignore the temp. Analyze the audio frequency. Is it a Queen signal?",
        nextNodeId: 'silas_sim_step_2',
        pattern: 'helping',
        skills: ['observation', 'patternRecognition']
      },
      {
        choiceId: 'hive_physical',
        text: "[ACTION] Put down the tablet. Put your ear to the box.",
        nextNodeId: 'silas_sim_success', // Shortcutting to success via "Ground Truthing"
        pattern: 'building',
        skills: ['intuition', 'riskManagement']
      }
    ],
    tags: ['simulation', 'silas_arc', 'immersive_scenario']
  },

  {
    nodeId: 'silas_sim_fail_robbers',
    speaker: 'SYSTEM ALERT',
    content: [
      {
        text: `**ALERT: EXTERNAL INTRUSION**

You opened the vents. The smell of honey escaped.

*A dark cloud of wasps descends on the opening.*

It wasn't overheating. They were balling up to defend the entrance. You just opened the front door to a raid.`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_hive',
        text: "Reset. The sensor lied.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['simulation', 'silas_arc']
  },

  {
    nodeId: 'silas_sim_step_2',
    speaker: 'SYSTEM ALERT',
    content: [
      {
        text: `**AUDIO ANALYSIS:** 450Hz. Distinct "piping" sound.

The sensor interpreted the intense vibration of the wings as heat.

They aren't hot. They are preparing to swarm. Or they are fighting off an intruder.

What do you do?`,
        emotion: 'focused_flow',
        variation_id: 'sim_step_2_v1',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'hive_smoke',
        text: "[ACTION] Use smoke to mask the pheromones and calm them.",
        nextNodeId: 'silas_sim_success',
        pattern: 'helping',
        skills: ['problemSolving', 'empathy']
      },
      {
        choiceId: 'hive_sensor_recalibrate',
        text: "[ACTION] Recalibrate the temp sensor threshold.",
        nextNodeId: 'silas_sim_fail_too_late',
        pattern: 'analytical',
        skills: ['technicalLiteracy'] // Trying to fix the tool, not the problem
      }
    ],
    tags: ['simulation', 'silas_arc']
  },

  {
    nodeId: 'silas_sim_fail_too_late',
    speaker: 'SYSTEM ALERT',
    content: [
      {
        text: `**ERROR: HIVE ABSCONDED**

While you were coding, the bees left.

Biological systems don't wait for you to push a commit.`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_late_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_hive_2',
        text: "Reset. Act, don't code.",
        nextNodeId: 'silas_simulation_start',
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
        text: `*The buzzing subsides.*

**HIVE STATUS: STABLE**

You stopped looking at the data and looked at the life.

The sensor was right about the temperature, but wrong about the *cause*. A server overheats because a fan breaks. A hive overheats because they are working together.

You have to know the difference.`,
        emotion: 'deep_respect',
        variation_id: 'sim_success_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'silas_ground_truth',
        text: "Ground truth beats sensor data.",
        nextNodeId: 'silas_new_role',
        pattern: 'building',
        skills: ['wisdom', 'systemsThinking']
      },
      {
        choiceId: 'silas_nature_complexity',
        text: "Nature is the ultimate system.",
        nextNodeId: 'silas_new_role',
        pattern: 'exploring',
        skills: ['biomimicry']
      }
    ],
    tags: ['simulation_complete', 'silas_arc']
  },

  // ============= THE TURN: SYSTEMS GARDENER =============
  {
    nodeId: 'silas_new_role',
    speaker: 'Silas',
    content: [
      {
        text: "I'm not going back to Amazon. But I'm not just a farmer, either.

I'm building a 'Biotic API.' Sensors that listen to the soil, but don't try to control it. Tech that serves the biology, not the other way around.

We need engineers who aren't afraid to get their hands dirty. Literally.",
        emotion: 'visionary',
        variation_id: 'new_role_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_start_agtech',
        text: "Start an AgTech collective. 'Code & Soil.'",
        nextNodeId: 'silas_climax_decision',
        pattern: 'building',
        skills: ['entrepreneurship', 'sustainability']
      }
    ]
  },

  {
    nodeId: 'silas_climax_decision',
    speaker: 'Silas',
    content: [
      {
        text: "*He wipes his hands on his jeans.*

I'm going to launch it. A field lab. For burnt-out coders who want to remember what reality feels like.

We'll code in the morning, farm in the afternoon. Restore the soil, restore the soul.

It's the only way to survive the next ten years.",
        emotion: 'resolved_hopeful',
        variation_id: 'climax_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_farewell',
        text: "Restore the soil, restore the soul.",
        nextNodeId: 'silas_farewell',
        pattern: 'helping',
        skills: ['empathy']
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

  {
    nodeId: 'silas_farewell',
    speaker: 'Silas',
    content: [
      {
        text: "Thanks. I needed to hear that from someone who speaks both languages.

Systems are everywhere. I saw a kid, Devon, drawing flowcharts for his dad. He gets it. A family is just a network that needs maintenance.

If you see Samuel, tell him... tell him the hive is stable. The queen is safe.",
        emotion: 'grateful',
        variation_id: 'farewell_v1'
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
