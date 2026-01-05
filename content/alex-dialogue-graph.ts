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
        text: "[A pair of eyes blink from inside the ventilation grate. Too big. Night vision goggles.]\n\nD'you bring it? The shiny?\n\n[He scuttles out, pockets jingling.]\n\nI got maps. I got codes. I got a protein bar from 2024. What's your trade?",
        emotion: 'suspicious',
        interaction: 'shake',
        variation_id: 'alex_intro_rat_v1',
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
        choiceId: 'alex_success_to_breaking',
        text: "What made you realize that?",
        nextNodeId: 'alex_bootcamp_breaking_point',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'criticalThinking']
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
        choiceId: 'alex_cares_to_breaking',
        text: "What was the moment you knew you had to stop?",
        nextNodeId: 'alex_bootcamp_breaking_point',
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
        choiceId: 'alex_learning_to_project',
        text: "Tell me more about what you're building.",
        nextNodeId: 'alex_llm_project_reveal',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication'],
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
        choiceId: 'alex_no_watching_to_project',
        text: "Have you started building it?",
        nextNodeId: 'alex_llm_project_reveal',
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
    }
  },

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
        choiceId: 'alex_time_to_breaking',
        text: "What was the real question?",
        nextNodeId: 'alex_bootcamp_breaking_point',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'criticalThinking']
      }
    ],
    tags: ['alex_arc']
  },

  // ============= EXPANSION: BOOTCAMP BACKSTORY =============
  {
    nodeId: 'alex_bootcamp_breaking_point',
    speaker: 'Alex',
    content: [
      {
        text: `*Sets down coffee. Long pause.*

Cohort 3. Final presentations.

One student—brilliant kid, genuinely talented—built this beautiful accessibility tool for blind coders. Screen reader integration, custom keyboard shortcuts, the whole thing.

*Voice quiet.*

They couldn't get past the resume screen. No CS degree. "Insufficient experience." Meanwhile, another student who copy-pasted tutorial projects got three offers because they had "Full-Stack Developer" in the right font on LinkedIn.

I realized I was teaching people to play a game I didn't understand and couldn't win.`,
        emotion: 'haunted',
        interaction: 'shake',
        variation_id: 'breaking_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_breaking_student',
        text: "What happened to the student with the accessibility tool?",
        nextNodeId: 'alex_student_failure_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_breaking_game',
        text: "The game is broken. That's not on you.",
        nextNodeId: 'alex_moral_injury',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'backstory']
  },

  {
    nodeId: 'alex_student_failure_story',
    speaker: 'Alex',
    content: [
      {
        text: `*Looks away.*

Last I heard? Working retail. Still coding on weekends. Still applying.

They messaged me six months later asking if I thought they should do another bootcamp. A different one. "Maybe this time."

*Bitter.*

I didn't know what to tell them. "Keep trying" felt like a lie. "Give up" felt worse.

So I told them to take a break. Figure out what they actually wanted. And I started wondering if I should take my own advice.`,
        emotion: 'regretful',
        interaction: 'nod',
        variation_id: 'failure_story_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_student_to_hype',
        text: "Is it different now? With AI?",
        nextNodeId: 'alex_ai_hype_cycle',
        pattern: 'exploring',
        skills: ['criticalThinking', 'adaptability']
      }
    ],
    tags: ['alex_arc', 'backstory']
  },

  {
    nodeId: 'alex_moral_injury',
    speaker: 'Alex',
    content: [
      {
        text: `Maybe. But I was the one standing in front of them saying "This will change your life."

Charging them money. Promising outcomes I couldn't guarantee. Watching them blame themselves when the system failed them.

*Quiet.*

You ever hear the term "moral injury"? It's when you're complicit in something that violates your values. Even if you didn't create the system.

That's what teaching bootcamps felt like. I became part of the machine that grinds people up.`,
        emotion: 'vulnerable_angry',
        interaction: 'shake',
        variation_id: 'moral_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_moral_to_hype',
        text: "So you left. And now?",
        nextNodeId: 'alex_ai_hype_cycle',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'backstory']
  },

  // ============= EXPANSION: CREDENTIAL TRAP DEEPENING =============
  {
    nodeId: 'alex_ai_hype_cycle',
    speaker: 'Alex',
    content: [
      {
        text: `*Laughs darkly.*

Now I write documentation for AI tools and watch the exact same cycle.

"Learn prompt engineering!" "No wait, prompt engineering is dead!" "Actually, you need to understand transformers!" "Just use Claude/GPT/whatever's new this week!"

*Shakes head.*

Same treadmill. New branding. Same people selling courses. Same people panicking they're falling behind.

The tools change every six months. The anxiety stays the same.`,
        emotion: 'cynical_knowing',
        interaction: 'shake',
        variation_id: 'hype_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_hype_exhausting',
        text: "Doesn't that get exhausting? Constantly relearning?",
        nextNodeId: 'alex_hype_exhaustion_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_hype_leverage',
        text: "But someone has to understand the tools, right?",
        nextNodeId: 'alex_hype_leverage_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability']
      }
    ],
    tags: ['alex_arc', 'credential_critique']
  },

  // ============= DIVERGENT RESPONSES TO HYPE CYCLE =============
  {
    nodeId: 'alex_hype_exhaustion_response',
    speaker: 'Alex',
    content: [
      {
        text: `*Stops mid-gesture.*

You're the first person to ask that. Everyone else just wants to know "what should I learn next?"

*Quieter.*

Yeah. It's exhausting. The constant feeling that whatever you know is about to be obsolete. That you're always one update behind.

But you asking that—asking about the *feeling*, not the strategy—that's different.`,
        emotion: 'surprised_vulnerable',
        variation_id: 'exhaustion_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_treadmill_empathy',
        text: "[Continue]",
        nextNodeId: 'alex_learning_treadmill',
        pattern: 'patience'
      }
    ],
    tags: ['alex_arc', 'credential_critique']
  },

  {
    nodeId: 'alex_hype_leverage_response',
    speaker: 'Alex',
    content: [
      {
        text: `*Tilts head.*

Logical. And you're not wrong.

Someone does need to understand the tools. The documentation I write? It matters. People rely on it.

*Considers.*

But the question is whether "someone" has to be the same person forever. Or whether you can be the bridge without becoming the bridge's foundation.`,
        emotion: 'thoughtful',
        variation_id: 'leverage_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_treadmill_analytical',
        text: "[Continue]",
        nextNodeId: 'alex_learning_treadmill',
        pattern: 'patience'
      }
    ],
    tags: ['alex_arc', 'credential_critique']
  },

  {
    nodeId: 'alex_learning_treadmill',
    speaker: 'Alex',
    content: [
      {
        text: `*Leans back.*

Here's the thing nobody says out loud:

You can't keep up. The treadmill is designed so you can't keep up.

Because if you ever felt "done," you'd stop buying courses. Stop clicking ads. Stop refreshing LinkedIn wondering if you're obsolete.

*Quieter.*

The system needs you anxious. Anxious people are profitable.

I was selling that anxiety for three years. Now I'm writing docs for tools that perpetuate it.

<bloom>But</bloom>—and here's where it gets interesting—I'm also finally learning stuff I actually care about again.`,
        emotion: 'revealing',
        interaction: 'bloom',
        variation_id: 'treadmill_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_treadmill_care',
        text: "What are you learning that you care about?",
        nextNodeId: 'alex_llm_project_reveal',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['alex_arc', 'credential_critique'],
    metadata: {
      sessionBoundary: true  // Session 2: Deeper revelation
    }
  },

  // ============= EXPANSION: GENUINE LEARNING REDISCOVERY =============
  {
    nodeId: 'alex_llm_project_reveal',
    speaker: 'Alex',
    content: [
      {
        text: `*Shifts laptop so you can see the screen.*

I'm building a... I don't even know what to call it. A conversation tool? An anti-curriculum?

It asks you questions about what you're curious about. Not what job you want. Not what salary. Just—what makes you want to learn more?

Then it helps you figure out <bloom>how you like to learn</bloom>. Not which course to buy. How your brain actually works.

*Self-conscious.*

It's messy. Unmonetizable. Probably nobody needs it. But it's the first thing I've built in years that feels honest.`,
        emotion: 'vulnerable_proud',
        interaction: 'bloom',
        variation_id: 'project_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_project_why',
        text: "Why does that feel different than the bootcamp?",
        nextNodeId: 'alex_curiosity_rekindled',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_project_unmonetizable',
        text: "Maybe unmonetizable means you're onto something real.",
        nextNodeId: 'alex_curiosity_rekindled',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      }
    ],
    tags: ['alex_arc', 'transformation']
  },

  {
    nodeId: 'alex_curiosity_rekindled',
    speaker: 'Alex',
    content: [
      {
        text: `*Small smile.*

Because I'm not selling an outcome.

Bootcamps sell the promise: "Do this, get that." Linear. Guaranteed. Except it's not.

This? This is just... exploration. Following curiosity. Asking questions nobody asked me to answer.

*Looks at screen.*

I've been up till 2am three nights this week. Not because of a deadline. Not because someone's paying me.

Because I forgot what happened next in my own code and had to find out.

That's the feeling. That's what we should be chasing. Not certificates. <ripple>That.</ripple>`,
        emotion: 'illuminated',
        interaction: 'bloom',
        variation_id: 'curiosity_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_curiosity_to_player',
        text: "How do I figure out what 'that' is for me?",
        nextNodeId: 'alex_player_learning_pattern',
        pattern: 'exploring',
        skills: ['adaptability', 'criticalThinking']
      }
    ],
    tags: ['alex_arc', 'transformation']
  },

  // ============= EXPANSION: PLAYER APPLICATION =============
  {
    nodeId: 'alex_player_learning_pattern',
    speaker: 'Alex',
    content: [
      {
        text: `*Thoughtful.*

Okay. Real talk. Forget what I taught at bootcamps. Forget the curriculum. Here's what actually matters:

Notice what you do when nobody's watching.

What Wikipedia rabbit holes do you fall into? What YouTube videos do you watch at 1am? What do you explain to people even when they didn't ask?

*Gestures.*

That's your pattern. That's the shape of your curiosity.

Most people try to force themselves into "marketable skills." But the people who actually break through? They find the overlap between what fascinates them and what's useful.

You've been making choices this whole conversation. What patterns are you seeing in yourself?`,
        emotion: 'teaching_honest',
        interaction: 'nod',
        variation_id: 'player_pattern_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_pattern_analytical',
        text: "I like understanding how things work. Systems. Causes.",
        nextNodeId: 'alex_crossroads_moment',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability']
      },
      {
        choiceId: 'alex_pattern_helping',
        text: "I care about people. What helps them. What hurts them.",
        nextNodeId: 'alex_crossroads_moment',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'alex_pattern_exploring',
        text: "I'm always asking 'what if?' Connecting dots others miss.",
        nextNodeId: 'alex_crossroads_moment',
        pattern: 'exploring',
        skills: ['creativity', 'adaptability']
      },
      {
        choiceId: 'alex_pattern_building',
        text: "I want to make things. Ship things. See them exist in the world.",
        nextNodeId: 'alex_crossroads_moment',
        pattern: 'building',
        skills: ['creativity', 'leadership']
      },
      {
        choiceId: 'alex_pattern_patience',
        text: "I take my time. Let things develop. Notice what others rush past.",
        nextNodeId: 'alex_crossroads_moment',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['alex_arc', 'player_reflection']
  },

  {
    nodeId: 'alex_crossroads_moment',
    speaker: 'Alex',
    content: [
      {
        text: `*Nods slowly.*

Yeah. I see it. The pattern is there.

Most people never stop to notice it. They just keep chasing what they're "supposed to" learn.

But here's the crossroads:

You can use that pattern to chase credentials—get really good at gaming the system, collecting the right keywords, playing the LinkedIn game.

Or you can use it to chase genuine mastery—following what actually fascinates you, even when it's not trending.

*Serious.*

Both are valid. Both can work. But only one of them will still matter to you in five years.

Which one pulls you?`,
        emotion: 'challenging',
        interaction: 'nod',
        variation_id: 'crossroads_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_crossroads_mastery',
        text: "I want the real thing. Even if it's harder.",
        nextNodeId: 'alex_final_synthesis',
        pattern: 'building',
        skills: ['leadership', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_crossroads_pragmatic',
        text: "I need to be practical. Bills don't pay themselves.",
        nextNodeId: 'alex_final_synthesis',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_crossroads_both',
        text: "Can it be both? Practical AND meaningful?",
        nextNodeId: 'alex_final_synthesis',
        pattern: 'patience',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      }
    ],
    tags: ['alex_arc', 'pivotal', 'decision']
  },

  {
    nodeId: 'alex_final_synthesis',
    speaker: 'Alex',
    content: [
      {
        text: `*Leans forward.*

Listen. The real answer is this:

The credentials will come if you get good at something that matters. But you only get good at things you can sustain caring about.

I watched hundreds of students burn out chasing skills they didn't care about. The ones who made it? They found the thing they'd do for free and figured out how to get paid for it.

*Gestures around Platform 8.*

This whole station—it's not about finding the "right path." It's about learning to recognize your own signal in all the noise.

You're doing that. Right now. Keep doing it.

And be suspicious of anyone—<bloom>including me</bloom>—who makes it sound simple.`,
        emotion: 'knowing_warm',
        interaction: 'bloom',
        variation_id: 'synthesis_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_synthesis_to_turn',
        text: "[Continue]",
        nextNodeId: 'alex_turn',
        pattern: 'exploring'
      }
    ],
    tags: ['alex_arc', 'synthesis'],
    metadata: {
      sessionBoundary: true  // Session 3: Transformation complete
    }
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
        choiceId: 'alex_turn_practical',
        text: "Okay, but practically—what do I do tomorrow?",
        nextNodeId: 'alex_practical_advice',
        pattern: 'building',
        skills: ['adaptability', 'leadership']
      },
      {
        choiceId: 'alex_turn_fear',
        text: "What if I'm both curious AND scared?",
        nextNodeId: 'alex_fear_acknowledgment',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'alex_turn_balance',
        text: "How do I balance credentials and genuine learning?",
        nextNodeId: 'alex_credential_wisdom',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability']
      }
    ],
    tags: ['alex_arc', 'climax', 'revelation']
  },

  // ============= EXPANSION: PRACTICAL APPLICATION =============
  {
    nodeId: 'alex_practical_advice',
    speaker: 'Alex',
    content: [
      {
        text: `*Straightens.*

Tomorrow? Here's what I'd do if I were starting over:

<bloom>One:</bloom> Pick something small you're actually curious about. Not "marketable." Curious.

<bloom>Two:</bloom> Build something with it. Doesn't matter if it's useful. Doesn't matter if it's been done. Build it anyway.

<bloom>Three:</bloom> When you get stuck—and you will—resist the urge to buy a course. Struggle first. The struggle is where learning happens.

<bloom>Four:</bloom> Share what you made. Not for likes. To practice explaining your thinking.

*Shrugs.*

That's it. Repeat until you've built enough things you can see your own patterns. Then you'll know what to learn next.

No curriculum required.`,
        emotion: 'direct_practical',
        interaction: 'nod',
        variation_id: 'practical_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_practical_to_platform',
        text: "Is that what Platform 8 teaches?",
        nextNodeId: 'alex_platform_8_meaning',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication']
      }
    ],
    tags: ['alex_arc', 'practical']
  },

  {
    nodeId: 'alex_fear_acknowledgment',
    speaker: 'Alex',
    content: [
      {
        text: `*Laughs.*

Both is the only honest answer.

Anyone who says they're not scared is either lying or not paying attention.

I'm scared right now. Scared this side project won't lead anywhere. Scared I wasted three years teaching bootcamps. Scared I'm wrong about all of this.

*Quieter.*

But here's the thing: the fear doesn't go away when you find the "right path."

The fear goes away when you stop needing the path to be right and start being okay with figuring it out.

<bloom>Curiosity is how you live with the fear.</bloom> Not how you eliminate it.`,
        emotion: 'vulnerable_warm',
        interaction: 'bloom',
        variation_id: 'fear_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_fear_to_platform',
        text: "That's what this place is about, isn't it?",
        nextNodeId: 'alex_platform_8_meaning',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['alex_arc', 'emotional']
  },

  {
    nodeId: 'alex_credential_wisdom',
    speaker: 'Alex',
    content: [
      {
        text: `*Thoughtful.*

You don't have to choose between them. But you do have to know which one you're optimizing for at any given moment.

If you need a job next month? Get the credentials. Play the game. Use the keywords. Do what you have to do.

But don't confuse survival strategy with actual learning.

*Gestures.*

The credentials are <bloom>signaling</bloom>. The learning is <bloom>substance</bloom>.

You need both. But if you only chase signals, you end up hollow. And if you only chase substance, you might starve while you're learning.

The wisdom is knowing when to do which.

*Small smile.*

And being honest about it. That's the part most people skip.`,
        emotion: 'balanced_wise',
        interaction: 'nod',
        variation_id: 'wisdom_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_wisdom_to_platform',
        text: "How does Platform 8 fit into all this?",
        nextNodeId: 'alex_platform_8_meaning',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      }
    ],
    tags: ['alex_arc', 'wisdom']
  },

  {
    nodeId: 'alex_platform_8_meaning',
    speaker: 'Alex',
    content: [
      {
        text: `*Looks around at the screens, the frozen progress bars, the cycling headlines.*

Platform 8. "The Learning Loop."

Samuel set it up as a mirror. A place where you see all the noise—the hype cycles, the anxiety, the treadmill—and decide whether you want to keep running.

Most travelers come through, panic, and leave. They want me to tell them which course to take.

But you? You stayed. You asked different questions.

*Meets your eyes.*

That's the loop. Not the courses. Not the credentials.

The loop is: <bloom>Learn. Reflect. Choose. Repeat.</bloom>

You're already doing it. Platform 8 just gave you permission to notice.`,
        emotion: 'affirming_profound',
        interaction: 'bloom',
        variation_id: 'platform_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_platform_both',
        text: "Thank you. This helped.",
        nextNodeId: 'alex_closing_both',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'alex_platform_next',
        text: "What's next for you?",
        nextNodeId: 'alex_closing_next',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'revelation', 'meta']
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
        setRelationshipStatus: 'acquaintance',
        thoughtId: 'curious-wanderer'
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
