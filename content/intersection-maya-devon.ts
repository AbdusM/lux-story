/**
 * Maya + Devon Intersection Scene
 * "The Biomedical Bridge"
 *
 * TRIGGER: Player has met both Maya and Devon
 * THEME: Healthcare + Technology convergence
 * LOCATION: Platform overlap between Medical (Maya) and Robotics (Devon)
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const mayaDevonIntersectionNodes: DialogueNode[] = [
  {
    nodeId: 'maya_devon_intro',
    speaker: 'Maya Chen',
    content: [
      {
        text: `*Maya's reviewing anatomy notes. Devon walks past carrying circuit boards.*

Devon? What are you doing on this platform?

*Devon stops.*

DEVON: "Could ask you the same. Thought you were pre-med."

Medical devices course. Studying pacemaker circuits.

DEVON: "No way. I'm prototyping prosthetic feedback sensors."`,
        emotion: 'surprised_intrigued',
        variation_id: 'maya_devon_intro_v1',
        useChatPacing: true
      }
    ],
    requiredState: {
      hasGlobalFlags: ['met_maya', 'met_devon']
    },
    choices: [
      {
        choiceId: 'intersection_curious',
        text: "You two are working on similar problems from different angles.",
        nextNodeId: 'maya_devon_realization',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'intersection_connect',
        text: "Devon, show her the sensor. Maya, show the pacemaker diagram.",
        nextNodeId: 'maya_devon_exchange',
        pattern: 'building',
        skills: ['collaboration', 'creativity'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'intersection_listen',
        text: "[Step back. Let them discover it.]",
        nextNodeId: 'maya_devon_realization',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['intersection', 'maya_devon', 'biomedical']
  },

  {
    nodeId: 'maya_devon_realization',
    speaker: 'Devon',
    content: [
      {
        text: `Wait.

MAYA: "What?"

Your feedback sensors. Closed-loop control system?

MAYA: "Like... how the body regulates itself?"

Exactly. Biological systems are the original control loops.

*Pause.*

MAYA: "And pacemakers are just... automated cardiac response."

You're basically doing what I'm doing. Just inside the body instead of outside it.`,
        emotion: 'excited_realization',
        variation_id: 'realization_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'realization_to_exchange',
        text: "Proceed.",
        nextNodeId: 'maya_devon_exchange',
        pattern: 'exploring'
      }
    ],
    tags: ['intersection', 'maya_devon']
  },

  {
    nodeId: 'maya_devon_exchange',
    speaker: 'Maya Chen',
    content: [
      {
        text: `*They spread papers on the floor. Circuit diagrams. Anatomy sketches.*

MAYA: "Look. The sinoatrial node fires at 60-100 bpm. Natural pacemaker."

DEVON: "And if it fails?"

MAYA: "Artificial pacemaker takes over. Electrical pulses."

DEVON: "Feedback loop. Sensor detects rhythm. Actuator corrects."

*Maya stares at the diagrams.*

MAYA: "I've been thinking of medicine and engineering as separate tracks."

DEVON: "They're not. They're the same problem."`,
        emotion: 'illuminated',
        variation_id: 'exchange_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'exchange_biomedical',
        text: "This is biomedical engineering. You're both already doing it.",
        nextNodeId: 'maya_devon_biomedical',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication']
      },
      {
        choiceId: 'exchange_build',
        text: "What if you built something together?",
        nextNodeId: 'maya_devon_project',
        pattern: 'building',
        skills: ['collaboration', 'creativity'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['intersection', 'maya_devon', 'collaboration'],
    metadata: {
      sessionBoundary: true  // Mid-point: Discovery moment
    }
  },

  {
    nodeId: 'maya_devon_biomedical',
    speaker: 'Devon',
    content: [
      {
        text: `DEVON: "Biomedical engineering."

MAYA: "I didn't even know that was a major."

DEVON: "Neither did I until last month."

*They look at each other.*

MAYA: "We should talk more."

DEVON: "Yeah. Next week? I'll bring my prosthetic prototypes."

MAYA: "I'll bring the cardiac models."

*Devon nods. Walks away with circuits.*

MAYA: *To you* "That just changed everything."`,
        emotion: 'determined_hopeful',
        variation_id: 'biomedical_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['maya_devon_connected', 'biomedical_path_revealed'],
        characterId: 'maya',
        thoughtId: 'systems-thinking'
      }
    ],
    choices: [
      {
        choiceId: 'biomedical_affirm',
        text: "Sometimes the path finds you.",
        nextNodeId: 'maya_devon_farewell',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['intersection', 'maya_devon', 'revelation']
  },

  {
    nodeId: 'maya_devon_project',
    speaker: 'Maya Chen',
    content: [
      {
        text: `MAYA: "Wait. Actually."

DEVON: "What?"

MAYA: "My anatomy professor. She's researching nerve regeneration. Needs someone who understands sensors."

DEVON: "I understand sensors."

MAYA: "And I understand nerves."

*Pause.*

DEVON: "When can we start?"

MAYA: "Friday. Her lab. I'll text you."

*They exchange numbers. Devon walks off.*

MAYA: *To you* "I think I just found my thing."`,
        emotion: 'excited_determined',
        variation_id: 'project_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['maya_devon_project', 'biomedical_path_revealed'],
        characterId: 'maya',
        thoughtId: 'curious-wanderer'
      },
      {
        characterId: 'devon',
        thoughtId: 'systems-thinking'
      }
    ],
    choices: [
      {
        choiceId: 'project_to_farewell',
        text: "That's how collaborations start.",
        nextNodeId: 'maya_devon_farewell',
        pattern: 'building',
        skills: ['collaboration', 'leadership']
      }
    ],
    tags: ['intersection', 'maya_devon', 'project']
  },

  {
    nodeId: 'maya_devon_farewell',
    speaker: 'Maya Chen',
    content: [
      {
        text: `*Maya packs her notes.*

You know what's weird?

I was so focused on "medicine OR engineering" that I couldn't see the "and."

*Looks at you.*

Thanks for being here when we figured it out.

*Walks toward the medical platform. Turns back.*

Go find Samuel. Tell him Maya's got a new plan.`,
        emotion: 'peaceful_excited',
        variation_id: 'farewell_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'maya_devon_complete',
        text: "Good luck with the research.",
        nextNodeId: 'RETURN_TO_SAMUEL', // Will route back to Samuel
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['intersection', 'maya_devon', 'complete']
  }
]

export const mayaDevonIntersectionGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(mayaDevonIntersectionNodes.map(node => [node.nodeId, node])),
  startNodeId: 'maya_devon_intro',
  metadata: {
    title: "The Biomedical Bridge",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: mayaDevonIntersectionNodes.length,
    totalChoices: mayaDevonIntersectionNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
