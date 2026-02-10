/**
 * Alex + Jordan Intersection Scene
 * "The Impostor Club"
 *
 * TRIGGER: Player has met both Alex and Jordan
 * THEME: Mentors doubting themselves while helping others
 * LOCATION: Outside Covalence bootcamp, 10 minutes before Jordan's Career Day speech
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const alexJordanIntersectionNodes: DialogueNode[] = [
  {
    nodeId: 'alex_jordan_intro',
    speaker: 'Jordan Packard',
    content: [
      {
        text: `*Outside Covalence. Jordan pacing. Speech notes crumpled.*

*Alex walks past. Stops.*

ALEX: "You look like you're about to teach."

JORDAN: "Career Day. Thirty students. Ten minutes."

ALEX: "And you're out here instead of in there."

JORDAN: "You get it."

ALEX: *Sits on steps.* "Yeah. I get it."`,
        emotion: 'anxious_recognized',
        variation_id: 'intro_v1',
        useChatPacing: true
      }
    ],
    requiredState: {
      hasGlobalFlags: ['met_alex', 'met_jordan']
    },
    choices: [
      {
        choiceId: 'alex_jordan_what',
        text: "What's stopping you?",
        nextNodeId: 'alex_jordan_fear',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'alex_jordan_both',
        text: "You both taught. What's different now?",
        nextNodeId: 'alex_jordan_difference',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      }
    ],
    tags: ['intersection', 'alex_jordan']
  },

  {
    nodeId: 'alex_jordan_fear',
    speaker: 'Jordan Packard',
    content: [
      {
        text: `JORDAN: "Seven jobs. Twelve years. They're expecting inspiration."

ALEX: "And you're thinking 'who am I to inspire anyone?'"

JORDAN: *Stops pacing.* "How did you—"

ALEX: "Because I quit teaching bootcamps for the same reason."

*Pause.*

JORDAN: "What was your reason?"

ALEX: "I realized I was selling a lie. 'Do this, get that.' Linear path. Except it's not."`,
        emotion: 'vulnerable_honest',
        variation_id: 'fear_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'fear_to_difference',
        text: "(Continue)",
        nextNodeId: 'alex_jordan_difference',
        pattern: 'patience'
      }
    ],
    tags: ['intersection', 'alex_jordan']
  },

  {
    nodeId: 'alex_jordan_difference',
    speaker: 'Alex',
    content: [
      {
        text: `ALEX: "The difference? I was lying then. You're not."

JORDAN: "What?"

ALEX: "I told students 'follow the curriculum, get the job.' Clean. Simple. False."

JORDAN: "And I'm about to tell them my path was chaos."

ALEX: "Which is true. That's scarier."

*Jordan sits down next to Alex.*

JORDAN: "So how do you teach when the truth is messy?"

ALEX: "You stop teaching certainty. Start teaching navigation."`,
        emotion: 'teaching_honest',
        variation_id: 'difference_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'difference_navigation',
        text: "What does that mean?",
        nextNodeId: 'alex_jordan_navigation',
        pattern: 'exploring',
        skills: ['curiosity', 'communication']
      }
    ],
    tags: ['intersection', 'alex_jordan']
  },

  {
    nodeId: 'alex_jordan_navigation',
    speaker: 'Jordan Packard',
    content: [
      {
        text: `JORDAN: "Navigation. Not the map. The skill."

ALEX: "Exactly. I can't give them the path. But I can show them how I figured mine out."

JORDAN: "By failing six times first?"

ALEX: "By paying attention. Adapting. Trying again."

*Jordan looks at speech notes.*

JORDAN: "My speech. I rewrote it six times. Trying to make seven jobs sound intentional."

ALEX: "Were they?"

JORDAN: "No. But the pattern was. I was moving toward something I didn't have words for yet."

ALEX: "That's the speech."`,
        emotion: 'realizing',
        variation_id: 'navigation_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'navigation_pattern',
        text: "The pattern mattered more than the plan.",
        nextNodeId: 'alex_jordan_pattern',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      },
      {
        choiceId: 'navigation_words',
        text: "Maybe they need to hear it's okay not to have words yet.",
        nextNodeId: 'alex_jordan_words',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['intersection', 'alex_jordan', 'insight'],
    metadata: {
      sessionBoundary: true  // Mid-point: Navigation insight
    }
  },

  {
    nodeId: 'alex_jordan_pattern',
    speaker: 'Alex',
    content: [
      {
        text: `ALEX: "The pattern mattered. That's it."

JORDAN: "And the pattern was... adaptability?"

ALEX: "Curiosity. Willingness to start over. Refusing to stay stuck."

*Jordan stands. Looks at the bootcamp building.*

JORDAN: "Those students. They're betting on themselves to figure it out."

ALEX: "Like you did. Seven times."

JORDAN: "And like you're doing now. With your LLM project."

ALEX: "Neither of us stopped. We just kept showing up."

*They look at each other.*

JORDAN: "That's the lesson."

ALEX: "Yeah. That's the lesson."`,
        emotion: 'clear_determined',
        variation_id: 'pattern_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'pattern_to_farewell',
        text: "(Continue)",
        nextNodeId: 'alex_jordan_farewell',
        pattern: 'patience'
      }
    ],
    tags: ['intersection', 'alex_jordan']
  },

  {
    nodeId: 'alex_jordan_words',
    speaker: 'Jordan Packard',
    content: [
      {
        text: `JORDAN: "It's okay not to have words."

ALEX: "It's better than fake certainty."

JORDAN: "One student asked me: 'How do you know when to quit versus push through?'"

ALEX: "What did you say?"

JORDAN: "I froze. Because I still don't know."

ALEX: "Neither do I. And maybe that's the point."

*Jordan looks up.*

JORDAN: "What if the answer is: you don't know. You just keep choosing. And eventually you look back and see the path you made."

ALEX: "Now you sound like a teacher."

JORDAN: *Laughs.* "Shit. I do."`,
        emotion: 'breakthrough_nervous',
        variation_id: 'words_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'words_to_farewell',
        text: "(Continue)",
        nextNodeId: 'alex_jordan_farewell',
        pattern: 'helping'
      }
    ],
    tags: ['intersection', 'alex_jordan']
  },

  {
    nodeId: 'alex_jordan_farewell',
    speaker: 'Alex',
    content: [
      {
        text: `*Jordan checks time.*

JORDAN: "Five minutes. I should go."

ALEX: "You're ready."

JORDAN: "I'm terrified."

ALEX: "Both can be true."

*Jordan walks toward the door. Turns back.*

JORDAN: "Come sit in. You might learn something."

ALEX: "From a Career Day speech?"

JORDAN: "From watching someone show up scared and do it anyway."

*Alex stands.*

ALEX: "Alright. Yeah. Let's go."

*They walk in together. Two teachers. Still learning.*`,
        emotion: 'solidarity_courage',
        variation_id: 'farewell_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['alex_jordan_connected', 'impostor_solidarity'],
        characterId: 'alex',
        thoughtId: 'collaborative-builder'
      },
      {
        characterId: 'jordan',
        thoughtId: 'collaborative-builder'
      }
    ],
    choices: [
      {
        choiceId: 'alex_jordan_complete',
        text: "That's what courage looks like.",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership']
      }
    ],
    tags: ['intersection', 'alex_jordan', 'complete']
  }
]

export const alexJordanIntersectionGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(alexJordanIntersectionNodes.map(node => [node.nodeId, node])),
  startNodeId: 'alex_jordan_intro',
  metadata: {
    title: "The Impostor Club",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: alexJordanIntersectionNodes.length,
    totalChoices: alexJordanIntersectionNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
