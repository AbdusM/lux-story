/**
 * Alex's Dialogue Graph
 * The Credential Paradox - Platform 8: The Learning Loop
 *
 * CHARACTER: Former bootcamp instructor, now documentation writer
 * Core Conflict: Credential culture vs. genuine learning
 * Arc: From burnout and skepticism to rediscovering curiosity
 * Theme: Learning to learn > chasing certificates
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const alexDialogueNodes: DialogueNode[] = [
  // ============= SCENE 1: THE DISMISSAL =============
  {
    nodeId: 'alex_introduction',
    speaker: 'Alex',
    content: [
      {
        text: `Platform 8. "The Learning Loop." Screens everywhere showing course thumbnails, completion bars frozen at 34%, headlines cycling between "THIS SKILL IS DEAD" and "THIS SKILL IS BACK."

*Looks up from laptop.*

Oh great, another traveler looking for the "right path."

Let me guess—someone told you to "just learn AI" and now you're here wondering which certification will finally make you feel ready?`,
        emotion: 'cynical',
        interaction: 'shake',
        variation_id: 'alex_intro_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_intro_burnout',
        text: "You sound burned out.",
        nextNodeId: 'alex_response_helping',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_intro_ai_worth',
        text: "Is learning AI actually worth it?",
        nextNodeId: 'alex_response_analytical',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_intro_ready',
        text: "What do you mean 'finally feel ready'?",
        nextNodeId: 'alex_response_exploring',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_intro_direction',
        text: "I don't need certifications. I need direction.",
        nextNodeId: 'alex_response_building',
        pattern: 'building',
        skills: ['adaptability', 'creativity'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'alex',
        setRelationshipStatus: 'stranger',
        addGlobalFlags: ['met_alex']
      }
    ],
    tags: ['introduction', 'alex_arc']
  },

  // Responses to Scene 1 choices
  {
    nodeId: 'alex_response_helping',
    speaker: 'Alex',
    content: [
      {
        text: `*Pauses. Sets down laptop.*

Yeah. Maybe.

...Sorry. That was my old instructor voice. Muscle memory.

I'm Alex. I used to teach bootcamps. Now I write documentation for tools I'm not sure anyone needs.

You're the first person to ask how I am instead of what I know.`,
        emotion: 'surprised_vulnerable',
        interaction: 'nod',
        variation_id: 'response_helping_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_helping',
        text: "What happened with the bootcamps?",
        nextNodeId: 'alex_contradiction',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_response_analytical',
    speaker: 'Alex',
    content: [
      {
        text: `*Laughs bitterly.*

Worth it for who? The platform selling the course? The company looking for cheap keywords on resumes?

I'm Alex. Former bootcamp instructor. Now documentation writer.

You want data? I watched three cohorts do everything "right"—courses, projects, networking—and still struggle. The ones who succeeded? Weren't the best coders.`,
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'response_analytical_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_analytical',
        text: "Then what made the difference?",
        nextNodeId: 'alex_contradiction',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_response_exploring',
    speaker: 'Alex',
    content: [
      {
        text: `*Sets down coffee.*

"Ready." The trap word.

One more course. One more certificate. One more bootcamp. Then you'll be ready.

Except you never are. The finish line keeps moving.

I'm Alex. I taught that lie for three years. Now I write docs for AI tools and wonder if any of it matters.`,
        emotion: 'reflective',
        interaction: 'nod',
        variation_id: 'response_exploring_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_exploring',
        text: "What made you stop teaching?",
        nextNodeId: 'alex_contradiction',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_response_building',
    speaker: 'Alex',
    content: [
      {
        text: `*Looks up sharply.*

Direction over credentials. That's... refreshing.

Most people want the shortcut. The checklist. The guarantee.

I'm Alex. Former bootcamp instructor. Current documentation hermit.

You might actually survive out there.`,
        emotion: 'intrigued',
        interaction: 'nod',
        variation_id: 'response_building_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_building',
        text: "What do you mean, survive?",
        nextNodeId: 'alex_contradiction',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['alex_arc']
  },

  // ============= SCENE 2: THE CONTRADICTION =============
  {
    nodeId: 'alex_contradiction',
    speaker: 'Alex',
    content: [
      {
        text: `You know what's wild?

The people who told my students "just build projects" were the same ones who got their jobs through connections.

And the ones screaming "prompt engineering is dead" online? Half of them are selling prompt templates on the side.

*Shakes head.*

I watched three cohorts do everything right—courses, projects, networking—and still struggle. Started wondering if I was selling snake oil with a curriculum.

I'm not saying don't learn. I'm saying... be suspicious of anyone who makes it sound simple. Including me.`,
        emotion: 'conflicted',
        interaction: 'shake',
        variation_id: 'contradiction_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_contradict_success',
        text: "So what actually helped the students who did succeed?",
        nextNodeId: 'alex_students_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_contradict_cares',
        text: "It sounds like you still care about teaching.",
        nextNodeId: 'alex_still_cares',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_contradict_learning',
        text: "What are YOU learning right now?",
        nextNodeId: 'alex_learning_now',
        pattern: 'exploring',
        skills: ['criticalThinking', 'creativity'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_contradict_build',
        text: "Forget what worked for others—what would you build if no one was watching?",
        nextNodeId: 'alex_if_no_watching',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_contradict_time',
        text: "Sometimes figuring things out just takes longer. That's not failure.",
        nextNodeId: 'alex_takes_time',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'pivotal']
  },

  // Scene 2 branch responses
  {
    nodeId: 'alex_students_success',
    speaker: 'Alex',
    content: [
      {
        text: `*Leans back.*

The ones who made it? They weren't the best coders.

They were the ones who could explain what they built and why it mattered.

Technical skills got them in the door. <bloom>Storytelling</bloom> got them the job.

Weird, right? We spend all this time on syntax and none on "why should anyone care?"`,
        emotion: 'reflective',
        interaction: 'nod',
        variation_id: 'success_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_turn_from_success',
        text: "That changes how I think about learning.",
        nextNodeId: 'alex_turn',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_still_cares',
    speaker: 'Alex',
    content: [
      {
        text: `*Long pause.*

...Maybe.

It's hard to watch people struggle when you know the game is rigged. When the advice is "network more" but nobody teaches networking. When "soft skills" get dismissed but they're what actually matter.

*Sighs.*

I got tired of pretending I had answers I didn't have.`,
        emotion: 'vulnerable',
        interaction: 'nod',
        variation_id: 'cares_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_turn_from_cares',
        text: "Honesty is rare. That matters.",
        nextNodeId: 'alex_turn',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_learning_now',
    speaker: 'Alex',
    content: [
      {
        text: `*Surprised laugh.*

What am I learning?

...Okay, fine. I've been messing with local LLMs. Running models on my own machine. Not for a job or a side hustle.

Just because I remembered what <bloom>curiosity</bloom> felt like before I had to monetize it.

It's dumb. It won't look good on a resume. But it's the first thing that's felt real in a while.`,
        emotion: 'surprised_honest',
        interaction: 'bloom',
        variation_id: 'learning_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_turn_from_learning',
        text: "That doesn't sound dumb at all.",
        nextNodeId: 'alex_turn',
        pattern: 'exploring',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_if_no_watching',
    speaker: 'Alex',
    content: [
      {
        text: `*Stops.*

If no one was watching?

*Long pause.*

I'd build a tool that helps people figure out what they actually want to learn—not what LinkedIn says they should.

Something that asks questions instead of selling answers. Kind of the opposite of what I used to do.

*Bitter laugh.*

Probably wouldn't make any money.`,
        emotion: 'dreaming',
        interaction: 'bloom',
        variation_id: 'no_watching_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_turn_from_no_watching',
        text: "That sounds worth building.",
        nextNodeId: 'alex_turn',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }  },

  {
    nodeId: 'alex_takes_time',
    speaker: 'Alex',
    content: [
      {
        text: `*Stops typing.*

You know how long it took me to admit the bootcamp thing wasn't working? Three years.

Three years of telling myself "next cohort will be different."

*Quiet.*

Sometimes the slow realization is the only honest one. The quick pivots, the "fail fast" mantras—sometimes they're just avoiding the real question.`,
        emotion: 'reflective',
        interaction: 'nod',
        variation_id: 'takes_time_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_turn_from_time',
        text: "What was the real question?",
        nextNodeId: 'alex_turn',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['alex_arc']
  },

  // ============= SCENE 3: THE TURN =============
  {
    nodeId: 'alex_turn',
    speaker: 'Alex',
    content: [
      {
        text: `Here's what I wish someone told me earlier:

The people who succeed aren't the ones who found the perfect course.

They're the ones who <bloom>stayed curious longer than they stayed scared</bloom>.

That sounds like fortune cookie garbage, I know. But watch—in five years, the tools will be completely different. The courses will be obsolete.

But the people who learned <ripple>how to learn</ripple>? They'll adapt again.`,
        emotion: 'knowing',
        interaction: 'bloom',
        variation_id: 'turn_v1',
        useChatPacing: true
      }
    ],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `Here's what I wish someone told me earlier:

The people who succeed aren't the ones who found the perfect course.

They're the ones who could <bloom>explain their thinking</bloom>. Who could trace the "why" behind the "what."

You're like that. You lead with evidence. That's rare. Just... don't let analysis become avoidance.`,
        altEmotion: 'knowing_direct'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `You know what?

You're good at this—<bloom>seeing people</bloom>. Most folks here just want answers.

You asked how I was doing first. That's rare. That's also a skill no course teaches.

Just... don't forget to look in the mirror sometimes.`,
        altEmotion: 'knowing_warm'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: `Here's the thing about curiosity:

The question is beautiful. But at some point, you have to <bloom>live inside an answer</bloom>.

You pull at threads others ignore. That's valuable. Just don't let the exploration become endless.`,
        altEmotion: 'knowing_curious'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: `You understand. You're a <bloom>builder</bloom> too.

You'd rather ship something imperfect than plan something perfect. That's how things actually get made.

Just... make sure you're going somewhere you actually want to be. Speed without direction is just motion.`,
        altEmotion: 'knowing_kindred'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: `You know what most people miss?

<bloom>Not all progress is visible.</bloom> You understand that.

Some things need time. Some things need you to stop waiting and act. The wisdom is knowing which is which.`,
        altEmotion: 'knowing_patient'
      }
    ],
    choices: [
      {
        choiceId: 'alex_final_both',
        text: "What if I'm both curious AND scared?",
        nextNodeId: 'alex_closing_both',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'alex_final_enough',
        text: "How do I know when I've learned enough?",
        nextNodeId: 'alex_closing_enough',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'alex_final_next',
        text: "What's next for you?",
        nextNodeId: 'alex_closing_next',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'climax', 'revelation']
  },

  // ============= SCENE 4: THE REFRAME / CLOSING =============
  {
    nodeId: 'alex_closing_both',
    speaker: 'Alex',
    content: [
      {
        text: `*Laughs.*

Both is the honest answer.

Anyone who says they're not scared is either lying or not paying attention.

The question isn't how to stop being scared. It's whether you let the fear make the decisions.

*Closes laptop.*

You're asking good questions. That's the whole game.`,
        emotion: 'warm',
        interaction: 'nod',
        variation_id: 'closing_both_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_to_summary_both',
        text: "[Continue]",
        nextNodeId: 'alex_pattern_summary',
        pattern: 'patience'
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_closing_enough',
    speaker: 'Alex',
    content: [
      {
        text: `You don't.

That's the trap. "Enough" is a moving target. There's always another course, another skill, another gap.

Better question: what do you want to be able to <bloom>DO</bloom>?

Start there. Learn what you need. Ship something. Learn what you missed. Repeat.

*Shrugs.*

It's messier than a certificate. But it's real.`,
        emotion: 'direct',
        interaction: 'nod',
        variation_id: 'closing_enough_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_to_summary_enough',
        text: "[Continue]",
        nextNodeId: 'alex_pattern_summary',
        pattern: 'analytical'
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_closing_next',
    speaker: 'Alex',
    content: [
      {
        text: `*Long pause.*

Honestly? I don't know.

Maybe that's okay. Maybe I'm finally comfortable not having the syllabus figured out.

*Small smile.*

The documentation job pays the bills. The late-night LLM experiments feed the soul. For now, that's enough.

Ask me again in a year. The answer will probably be different.`,
        emotion: 'peaceful',
        interaction: 'nod',
        variation_id: 'closing_next_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_to_summary_next',
        text: "[Continue]",
        nextNodeId: 'alex_pattern_summary',
        pattern: 'exploring'
      }
    ],
    tags: ['alex_arc']
  },

  // ============= PATTERN SUMMARY =============
  {
    nodeId: 'alex_pattern_summary',
    speaker: 'Alex',
    content: [
      {
        text: `*Stands.*

Hey. Thanks for listening. Most people just want the shortcut and leave.

You're different.

Go on—Samuel's probably wondering where you wandered off to. Tell him Platform 8 says hi.

And remember: the people who figure it out aren't the ones with the most certificates.

They're the ones who kept showing up.`,
        emotion: 'affirming',
        interaction: 'bloom',
        variation_id: 'summary_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['alex_arc_complete'],
        characterId: 'alex',
        setRelationshipStatus: 'acquaintance'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_from_alex',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.ALEX_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['alex_arc', 'arc_complete']
  }
]

export const alexEntryPoints = {
  INTRODUCTION: 'alex_introduction'
} as const

export const alexDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(alexDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: alexEntryPoints.INTRODUCTION,
  metadata: {
    title: "The Credential Paradox",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: alexDialogueNodes.length,
    totalChoices: alexDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
