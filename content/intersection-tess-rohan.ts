/**
 * Tess + Rohan Intersection Scene
 * "The Guardians"
 *
 * TRIGGER: Player has met both Tess and Rohan
 * THEME: Preserving authenticity against automation
 * LOCATION: The B-Side record shop
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const tessRohanIntersectionNodes: DialogueNode[] = [
  {
    nodeId: 'tess_rohan_intro',
    speaker: 'Tess',
    content: [
      {
        text: `*Door chimes. Man walks in. Looks exhausted. Server room cold still in his eyes.*

Welcome to The B-Side. Looking for something specific?

ROHAN: "Something... real. Not algorithmic. Not recommended for me."

*Tess looks up. Really looks.*

You're the guy from the server room. Platform 7.

ROHAN: "Rohan. And you're... fighting the same fight I am."`,
        emotion: 'curious_recognition',
        variation_id: 'intro_v1',
        useChatPacing: true
      }
    ],
    requiredState: {
      hasGlobalFlags: ['met_tess', 'met_rohan']
    },
    choices: [
      {
        choiceId: 'tess_rohan_fight',
        text: "What fight?",
        nextNodeId: 'tess_rohan_fight_reveal',
        pattern: 'exploring',
        skills: ['communication', 'curiosity']
      },
      {
        choiceId: 'tess_rohan_real',
        text: "Rohan, what brings you here?",
        nextNodeId: 'tess_rohan_why',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['intersection', 'tess_rohan']
  },

  {
    nodeId: 'tess_rohan_fight_reveal',
    speaker: 'Rohan',
    content: [
      {
        text: `ROHAN: "Preservation. Against replacement."

TESS: "You preserve code. I preserve music."

ROHAN: "AI generates code. Algorithms generate playlists."

TESS: "And both claim it's just as good."

*Pause.*

ROHAN: "But it's not. Is it?"

TESS: "No. It's not."`,
        emotion: 'kindred_recognition',
        variation_id: 'fight_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'fight_to_why',
        text: "(Continue)",
        nextNodeId: 'tess_rohan_why',
        pattern: 'patience'
      }
    ],
    tags: ['intersection', 'tess_rohan']
  },

  {
    nodeId: 'tess_rohan_why',
    speaker: 'Tess',
    content: [
      {
        text: `TESS: "What made you come here?"

ROHAN: "Been debugging for twelve hours. AI kept suggesting Stack Overflow answers from 2015. Deprecated libraries. Confident lies."

TESS: "And you needed..."

ROHAN: "Something made by a human. On purpose. With intention."

*Tess nods slowly.*

TESS: "I've got the perfect album. Not for you. Just... perfect."

*She pulls a record. Miles Davis. Kind of Blue.*

ROHAN: "I don't know jazz."

TESS: "That's why it's perfect."`,
        emotion: 'understanding',
        variation_id: 'why_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'why_to_listening',
        text: "(Continue)",
        nextNodeId: 'tess_rohan_listening',
        pattern: 'patience'
      }
    ],
    tags: ['intersection', 'tess_rohan']
  },

  {
    nodeId: 'tess_rohan_listening',
    speaker: 'Rohan',
    content: [
      {
        text: `*Tess plays the record. Vinyl crackle. Then trumpet.*

ROHAN: *After two minutes* "They're... improvising."

TESS: "Every take. Recorded in one day. No algorithm. No overdubs. Just five humans listening to each other."

ROHAN: "Like debugging. When you understand the system so well you can improvise solutions."

*Tess stops. Looks at him.*

TESS: "Yes. Exactly that."

ROHAN: "The AI can't do this. It can generate notes. But not... listening."`,
        emotion: 'profound_recognition',
        variation_id: 'listening_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'listening_core',
        text: "That's what you're both preserving. The listening.",
        nextNodeId: 'tess_rohan_core',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'listening_together',
        text: "What if there were others? Fighting the same fight?",
        nextNodeId: 'tess_rohan_network',
        pattern: 'building',
        skills: ['collaboration', 'leadership']
      }
    ],
    tags: ['intersection', 'tess_rohan', 'revelation'],
    metadata: {
      sessionBoundary: true  // Mid-point: Shared recognition
    }
  },

  {
    nodeId: 'tess_rohan_core',
    speaker: 'Tess',
    content: [
      {
        text: `TESS: "Listening. Yeah."

ROHAN: "My mentor David. He taught me to listen to code. What it's trying to tell you."

TESS: "And mine taught me to listen to silence. What's not being played matters as much as what is."

*Rohan picks up the album cover.*

ROHAN: "David's retiring. His knowledge... I'm trying to preserve it. But I can't do it alone."

TESS: "The record shop almost closed. I'm trying to keep the space alive. But I'm exhausted."

*They look at each other.*

ROHAN: "We're both fighting obsolescence."

TESS: "By refusing to be optimized."`,
        emotion: 'fierce_solidarity',
        variation_id: 'core_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'core_to_farewell',
        text: "(Continue)",
        nextNodeId: 'tess_rohan_farewell',
        pattern: 'patience'
      }
    ],
    tags: ['intersection', 'tess_rohan']
  },

  {
    nodeId: 'tess_rohan_network',
    speaker: 'Rohan',
    content: [
      {
        text: `ROHAN: "Others?"

TESS: "I'm building listening sessions. Community events. People choosing music together."

ROHAN: "I'm building an academy. Teaching first principles. Not frameworks."

*Pause.*

TESS: "What if we weren't fighting alone?"

ROHAN: "A network. Curators. Teachers. Preservers."

TESS: "People who give a damn about intention."

*Rohan pulls out his phone.*

ROHAN: "David would want to meet you. And his student. The one who gets it."

TESS: "And the kid I hired. The one who found her mom in the grooves."

*They exchange numbers.*`,
        emotion: 'hopeful_determined',
        variation_id: 'network_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_rohan_network', 'guardian_alliance'],
        characterId: 'tess',
        thoughtId: 'collaborative-builder'
      },
      {
        characterId: 'rohan',
        thoughtId: 'collaborative-builder'
      }
    ],
    choices: [
      {
        choiceId: 'network_to_farewell',
        text: "That's how movements start.",
        nextNodeId: 'tess_rohan_farewell',
        pattern: 'building',
        skills: ['leadership', 'collaboration']
      }
    ],
    tags: ['intersection', 'tess_rohan', 'alliance']
  },

  {
    nodeId: 'tess_rohan_farewell',
    speaker: 'Tess',
    content: [
      {
        text: `*Rohan buys the Miles Davis album.*

ROHAN: "Thank you. For this."

TESS: "Come back next week. I'm hosting a listening session. Bring David if he can make it."

ROHAN: "I will."

*He pauses at the door.*

ROHAN: "The algorithm would have recommended smooth jazz. Based on my 'profile.'"

TESS: "Fuck the algorithm."

ROHAN: *Small smile.* "Yeah. Fuck the algorithm."

*Door chimes. He's gone. Record still spinning.*`,
        emotion: 'warm_fierce',
        variation_id: 'farewell_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_rohan_complete',
        text: "That connection mattered.",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['intersection', 'tess_rohan', 'complete']
  }
]

export const tessRohanIntersectionGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(tessRohanIntersectionNodes.map(node => [node.nodeId, node])),
  startNodeId: 'tess_rohan_intro',
  metadata: {
    title: "The Guardians",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: tessRohanIntersectionNodes.length,
    totalChoices: tessRohanIntersectionNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
