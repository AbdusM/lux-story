/**
 * Elena's Dialogue Graph
 * The Master Electrician - Platform 3 (Construction / Trades)
 *
 * CHARACTER: The Builder Who Stayed
 * Core Conflict: Respect vs. Erasure - proving trades have dignity in a "college-or-nothing" world
 * Arc: From defensive about her choices to confident in her craft
 * Mechanic: "The Troubleshoot" - diagnosing a complex wiring problem through dialogue choices
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const elenaDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'elena_introduction',
    speaker: 'Elena',
    content: [
      {
        text: `*Sound of a voltmeter clicking.*

Four-twenty-seven volts. Three-phase. Industrial.

*She looks up from a panel box, safety glasses pushed back on her forehead.*

You're not from the site. Safety vest's too clean.`,
        emotion: 'curious',
        variation_id: 'elena_intro_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "*Sound of a voltmeter clicking.*\n\nFour-twenty-seven volts. Three-phase. Industrial.\n\n*She looks up from a panel box.*\n\nYou look like you work with your hands. Calluses don't lie. What do you build?", altEmotion: 'interested' },
          { pattern: 'analytical', minLevel: 4, altText: "*Sound of a voltmeter clicking.*\n\nFour-twenty-seven volts. Three-phase.\n\n*She looks up from a panel box.*\n\nYou're reading the numbers on the meter, aren't you? Most people just see wires. You see systems.", altEmotion: 'impressed' },
          { pattern: 'patience', minLevel: 4, altText: "*Sound of a voltmeter clicking.*\n\nFour-twenty-seven volts. Three-phase.\n\n*She looks up, takes her time.*\n\nYou didn't rush in. Good. This room has enough voltage to stop a heart. Patience keeps people alive.", altEmotion: 'approving' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'elena_intro_honest',
        text: "I'm just passing through. Samuel said I should talk to people here.",
        nextNodeId: 'elena_samuel_mention',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_intro_curious',
        text: "What are you working on?",
        nextNodeId: 'elena_the_job',
        pattern: 'exploring',
        skills: ['curiosity', 'communication']
      },
      {
        choiceId: 'elena_intro_technical',
        text: "Four-twenty-seven? That's heavy industrial. What's the load?",
        nextNodeId: 'elena_technical_respect',
        pattern: 'analytical',
        skills: ['technicalLiteracy'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'elena',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'elena_arc']
  },

  {
    nodeId: 'elena_samuel_mention',
    speaker: 'Elena',
    content: [
      {
        text: `Samuel. Yeah, he's good people.

*She sets down the voltmeter.*

He told you to talk to the electrician? Most folks want the tech people. The coders. The "future of work."

*Small laugh.*

Nobody asks about the people who keep the lights on.`,
        emotion: 'wry',
        variation_id: 'samuel_mention_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_why_not',
        text: "Why do you think that is?",
        nextNodeId: 'elena_invisible_trade',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'elena_interested',
        text: "I'm interested. Tell me what you do.",
        nextNodeId: 'elena_the_job',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc']
  },

  {
    nodeId: 'elena_technical_respect',
    speaker: 'Elena',
    content: [
      {
        text: `*She pauses, looks at you differently.*

You know electrical. Not many people ask about load.

We're pulling 800 amps across three phases. New data center going in downtown. Those servers need serious power—and they need it clean.

*Taps the panel.*

One voltage spike, one dirty sine wave, and a million dollars of equipment fries. No pressure.`,
        emotion: 'impressed',
        interaction: 'nod',
        variation_id: 'technical_respect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_learned_where',
        text: "Where'd you learn this?",
        nextNodeId: 'elena_apprenticeship',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'elena_redundancy',
        text: "What's your redundancy plan if the main feed fails?",
        nextNodeId: 'elena_problem_solver',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'technical']
  },

  {
    nodeId: 'elena_the_job',
    speaker: 'Elena',
    content: [
      {
        text: `*She gestures around the room.*

Journeyman electrician. Eleven years. Started as an apprentice at seventeen, got my license at twenty-one.

This building? I'm wiring the whole east wing. Three floors. Thirty thousand feet of cable. Every outlet, every switch, every breaker—I touch it.

When they flip the lights on opening day? That's me.`,
        emotion: 'proud',
        interaction: 'bloom',
        variation_id: 'the_job_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "*She gestures around the room.*\n\nJourneyman electrician. Eleven years.\n\nThis building? I'm wiring the whole east wing. Every outlet, every switch.\n\n*She looks at you.*\n\nYou get it. Building something you can point to. Something real.", altEmotion: 'kindred' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'elena_apprentice_path',
        text: "You started at seventeen? No college?",
        nextNodeId: 'elena_the_choice',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'elena_pride_visible',
        text: "That pride in your voice—it's real.",
        nextNodeId: 'elena_pride_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['elena_arc']
  },

  {
    nodeId: 'elena_invisible_trade',
    speaker: 'Elena',
    content: [
      {
        text: `*Crosses arms.*

Because we're invisible until something breaks.

Nobody thinks about electricity until the power goes out. Nobody thinks about plumbing until the toilet backs up. Nobody thinks about HVAC until they're sweating in July.

We're infrastructure. We're supposed to be invisible.

But invisible doesn't mean easy. Invisible doesn't mean unskilled.`,
        emotion: 'frustrated',
        interaction: 'small',
        variation_id: 'invisible_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_undervalued',
        text: "Sounds like you've had to defend your work before.",
        nextNodeId: 'elena_the_choice',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_skill_level',
        text: "What's the skill level like? Really?",
        nextNodeId: 'elena_apprenticeship',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['elena_arc', 'economic_reality']
  },

  // ============= BACKSTORY =============
  {
    nodeId: 'elena_the_choice',
    speaker: 'Elena',
    content: [
      {
        text: `*She sets down her tools.*

Yeah. No college.

My counselor in high school? She looked at my grades—honor roll, by the way—and said, "Elena, you're too smart for vocational."

Too smart. Like using my brain AND my hands was a waste.

*Quiet for a moment.*

My dad's a plumber. Thirty-two years. Owns his own business now. Three trucks. Six employees. My mom's a welder. They met at Lawson State.

I knew what I wanted. I just had to fight everyone who told me I was wrong.`,
        emotion: 'determined',
        variation_id: 'the_choice_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "*She sets down her tools.*\n\nNo college. My counselor said I was 'too smart for vocational.'\n\n*Quiet.*\n\nMy dad's a plumber. Owns his own business. My mom's a welder.\n\nYou build things. You know the fight—proving that making things is real work.", altEmotion: 'kindred' },
          { pattern: 'patience', minLevel: 4, altText: "*She sets down her tools.*\n\nNo college. My counselor said I was 'too smart for vocational.'\n\nI knew what I wanted. But I had to wait—apprenticeship is four years. Four years of learning before they let you work alone.\n\nPatience isn't passive. It's how you get good.", altEmotion: 'reflective' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'elena_fight_worth',
        text: "Was it worth the fight?",
        nextNodeId: 'elena_worth_it',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'elena_apprentice_detail',
        text: "What was the apprenticeship like?",
        nextNodeId: 'elena_apprenticeship',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['elena_arc', 'backstory']
  },

  {
    nodeId: 'elena_apprenticeship',
    speaker: 'Elena',
    content: [
      {
        text: `Four years. Eight thousand hours of supervised work. Plus classes—electrical theory, code, safety.

My journeyman, Ray? He'd been doing this thirty years. Watched every wire I pulled. Every connection I made.

*Small smile.*

First time he let me work unsupervised, I cried in my truck. Not sad—proud. I'd earned it.

That's what people don't understand. This isn't "fall back" work. It's climb-up work. You start at the bottom and prove yourself every single day.`,
        emotion: 'proud',
        interaction: 'nod',
        variation_id: 'apprenticeship_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_ray_mentor',
        text: "Ray sounds like a good teacher.",
        nextNodeId: 'elena_mentorship',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_eight_thousand',
        text: "Eight thousand hours. That's more than some college degrees.",
        nextNodeId: 'elena_education_comparison',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['elena_arc', 'apprenticeship']
  },

  {
    nodeId: 'elena_worth_it',
    speaker: 'Elena',
    content: [
      {
        text: `*Long pause.*

Last year I made eighty-seven thousand dollars. No student debt. Union benefits. Pension.

My cousin went to college. Marketing degree. She's thirty-two, still paying loans, making forty-five at a startup that might fold next month.

*Looks at her hands.*

I can walk into any city in America and find work. Hospitals need power. Schools need power. Data centers need power.

Was it worth the fight? Yeah. But I shouldn't have had to fight.`,
        emotion: 'resolved',
        interaction: 'bloom',
        variation_id: 'worth_it_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_shouldnt_fight',
        text: "What do you mean, you shouldn't have had to fight?",
        nextNodeId: 'elena_systemic_problem',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_advice_seeking',
        text: "What would you tell someone considering trades?",
        nextNodeId: 'elena_advice',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['elena_arc', 'economic_reality']
  },

  {
    nodeId: 'elena_systemic_problem',
    speaker: 'Elena',
    content: [
      {
        text: `*She leans against the panel.*

Every kid in America gets told the same story: college or failure. Four-year degree or you're nothing.

Meanwhile, we've got half a million open construction jobs. Electricians, plumbers, welders—we're retiring faster than we're replacing.

*Shakes head.*

The infrastructure's crumbling. Bridges, pipes, wiring. And we told a whole generation that fixing it wasn't good enough for them.

Now we're surprised when there's nobody left who knows how.`,
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'systemic_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_what_changes',
        text: "What needs to change?",
        nextNodeId: 'elena_vision',
        pattern: 'exploring',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'elena_automation_worry',
        text: "Some people say robots will replace trades too.",
        nextNodeId: 'elena_automation_response',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['elena_arc', 'economic_reality', 'labor_gap']
  },

  {
    nodeId: 'elena_automation_response',
    speaker: 'Elena',
    content: [
      {
        text: `*Laughs.*

Show me a robot that can troubleshoot a junction box in a hundred-year-old building where nothing's to code.

*Taps her head.*

This work isn't repetitive. Every job is different. Every building has surprises. You need judgment. Problem-solving. Creativity.

Machines are good at the same thing over and over. I'm good at the thing that's never been done before.`,
        emotion: 'confident',
        interaction: 'nod',
        variation_id: 'automation_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "*Laughs.*\n\nShow me a robot that can troubleshoot a junction box in a hundred-year-old building.\n\nYou think in systems. You know—the edge cases break the automation. The weird problems need human judgment.\n\nThat's job security.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'elena_problem_example',
        text: "Give me an example. A problem that needed judgment.",
        nextNodeId: 'elena_troubleshoot_setup',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'elena_future_path',
        text: "What's next for you? Where does this career go?",
        nextNodeId: 'elena_vision',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['elena_arc', 'automation']
  },

  // ============= THE TROUBLESHOOT (Interactive Mechanic) =============
  {
    nodeId: 'elena_troubleshoot_setup',
    speaker: 'Elena',
    content: [
      {
        text: `*She grins.*

Okay. Real story. Last month.

Got called to a restaurant—their kitchen kept tripping breakers. Every night, same time, lights go out.

Previous electrician said "faulty breaker." Replaced it twice. Still tripping.

I showed up. Watched. Waited. Ten PM, pop. Lights out.

*Looks at you.*

What's your first instinct? Where would you look?`,
        emotion: 'testing',
        variation_id: 'troubleshoot_v1'
      }
    ],
    choices: [
      {
        choiceId: 'troubleshoot_breaker',
        text: "Check the breaker panel. See what's pulling too much current.",
        nextNodeId: 'elena_troubleshoot_breaker',
        pattern: 'analytical',
        skills: ['technicalLiteracy']
      },
      {
        choiceId: 'troubleshoot_time',
        text: "The timing's suspicious. What happens at ten PM?",
        nextNodeId: 'elena_troubleshoot_correct',
        pattern: 'analytical',
        skills: ['criticalThinking', 'observation'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'troubleshoot_ask',
        text: "I'd ask the staff. What changes at that time?",
        nextNodeId: 'elena_troubleshoot_correct',
        pattern: 'helping',
        skills: ['communication', 'problemSolving'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['elena_arc', 'troubleshoot', 'interactive']
  },

  {
    nodeId: 'elena_troubleshoot_breaker',
    speaker: 'Elena',
    content: [
      {
        text: `Good instinct. Most electricians would do the same.

But the previous guy already did that. Twice. Breaker's fine.

*Taps her temple.*

The answer isn't always in the box. Sometimes it's in the behavior.

What's different at ten PM versus nine PM?`,
        emotion: 'teaching',
        variation_id: 'troubleshoot_breaker_v1'
      }
    ],
    choices: [
      {
        choiceId: 'troubleshoot_behavior',
        text: "The kitchen. Closing shift. They're probably running different equipment.",
        nextNodeId: 'elena_troubleshoot_correct',
        pattern: 'analytical',
        skills: ['observation'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'troubleshoot']
  },

  {
    nodeId: 'elena_troubleshoot_correct',
    speaker: 'Elena',
    content: [
      {
        text: `*Her face lights up.*

Exactly. You get it.

Ten PM: closing time. Kitchen runs the dishwasher AND the sanitizer AND the ice machine refill—all at once.

Those three on the same circuit? Overload. Every night.

*Laughs.*

The fix wasn't electrical. It was a conversation. "Don't run all three at once." Problem solved.

Previous guy looked at wires. I looked at people.`,
        emotion: 'delighted',
        interaction: 'bloom',
        variation_id: 'troubleshoot_correct_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_lesson_learned',
        text: "That's... not what I expected from electrical work.",
        nextNodeId: 'elena_real_skill',
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'elena_teach_that',
        text: "Do they teach that? The people part?",
        nextNodeId: 'elena_mentorship',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['elena_arc', 'troubleshoot', 'revelation']
  },

  {
    nodeId: 'elena_real_skill',
    speaker: 'Elena',
    content: [
      {
        text: `*Nods.*

That's the real skill. Not just knowing the code—knowing the context.

Every building has a history. Every client has a story. The wires don't exist in a vacuum.

*Looks around.*

This data center? I talked to the IT guys for three hours before I touched a panel. What do they need? What might change? What can't ever fail?

The technical stuff is trainable. The judgment? That takes years. And it's worth something.`,
        emotion: 'wise',
        interaction: 'nod',
        variation_id: 'real_skill_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_to_vision',
        text: "Where do you see yourself in ten years?",
        nextNodeId: 'elena_vision',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['elena_arc', 'wisdom']
  },

  // ============= MENTORSHIP & FUTURE =============
  {
    nodeId: 'elena_mentorship',
    speaker: 'Elena',
    content: [
      {
        text: `Ray taught me something that changed everything.

"Elena," he said, "the wire doesn't care about your degree. It cares about your attention. You rush, you die. You focus, you live."

*Pause.*

I've got two apprentices now. Teaching them the same thing.

This work is a chain. Ray learned from someone. I learned from Ray. Now I'm passing it on.

That's how trades survive. Not through textbooks. Through people.`,
        emotion: 'reflective',
        interaction: 'small',
        variation_id: 'mentorship_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Ray taught me something that changed everything.\n\n'The wire doesn't care about your degree. It cares about your attention.'\n\n*Pause.*\n\nYou understand teaching. Passing something on. That's what you want to do too, isn't it?", altEmotion: 'kindred' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'elena_apprentices',
        text: "What are your apprentices like?",
        nextNodeId: 'elena_next_generation',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_chain_continues',
        text: "That chain—it's how the work stays alive.",
        nextNodeId: 'elena_vision',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['elena_arc', 'mentorship']
  },

  {
    nodeId: 'elena_next_generation',
    speaker: 'Elena',
    content: [
      {
        text: `*Smiles.*

DeAndre's nineteen. Kid's got hands like mine—steady, patient. He'll be better than me in five years.

Jasmine's twenty-two. Came from IT, got tired of sitting at a desk. She asks questions nobody else thinks to ask.

*Looks at her hands.*

People ask why I stay in the field. I could be a supervisor. Project manager. Sit in an office.

But this? Teaching someone to do something real? That's the job.`,
        emotion: 'proud',
        interaction: 'bloom',
        variation_id: 'next_gen_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_to_vision',
        text: "You've built something. Not just buildings—a legacy.",
        nextNodeId: 'elena_vision',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['elena_arc', 'next_generation']
  },

  {
    nodeId: 'elena_vision',
    speaker: 'Elena',
    content: [
      {
        text: `*She looks out the window at the city.*

Ten years? I want to open a training center. Not just electrical—all trades. Plumbing, welding, HVAC.

A place where kids can learn before they commit. Try things. Get their hands dirty.

*Turns back to you.*

And I want to change the story. "Trades aren't fallback." Trades are choice. Skilled, paid, respected choice.

Birmingham built this country. Steel, iron, hands. We can build it again.`,
        emotion: 'visionary',
        interaction: 'bloom',
        variation_id: 'vision_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_final_wisdom',
        text: "What would you tell someone standing where I'm standing?",
        nextNodeId: 'elena_farewell',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'elena_return_samuel',
        text: "Thank you, Elena. I should get back to Samuel.",
        nextNodeId: 'elena_farewell',
        pattern: 'exploring'
      }
    ],
    tags: ['elena_arc', 'vision', 'climax']
  },

  // ============= FAREWELL =============
  {
    nodeId: 'elena_farewell',
    speaker: 'Elena',
    content: [
      {
        text: `*She picks up her voltmeter, then pauses.*

Here's what I know.

The world needs people who build things. Fix things. Keep the lights on.

Whatever you're figuring out? Don't let anyone tell you what's "good enough" for you. Only you know what fits.

*Nods toward the panel.*

Now I've got work to do. But if you ever want to learn how to wire a three-way switch... you know where to find me.`,
        emotion: 'warm',
        interaction: 'nod',
        variation_id: 'farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_goodbye',
        text: "Thank you, Elena.",
        nextNodeId: samuelEntryPoints.ELENA_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['elena_arc_complete'],
        thoughtId: 'hands-on-truth'
      }
    ],
    tags: ['ending', 'elena_arc']
  },

  // Additional nodes for depth
  {
    nodeId: 'elena_problem_solver',
    speaker: 'Elena',
    content: [
      {
        text: `*Raises an eyebrow.*

Redundancy? You're thinking like an engineer.

Two separate feeds from the grid. Plus a generator bay for emergency. Plus UPS systems for the fifteen-second gap between power loss and generator startup.

*Taps the panel.*

This is the kind of building where "lights out" means millions in losses. We don't do single points of failure.`,
        emotion: 'impressed',
        variation_id: 'problem_solver_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_learned_systems',
        text: "Where'd you learn systems thinking like that?",
        nextNodeId: 'elena_apprenticeship',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['elena_arc', 'technical']
  },

  {
    nodeId: 'elena_pride_response',
    speaker: 'Elena',
    content: [
      {
        text: `*She stops. Looks at you.*

Yeah. It is.

*Quiet for a moment.*

People don't usually... see that. They see the hard hat and the tool belt and think "backup plan."

*Sets down her tools.*

But I chose this. And I'm good at it. And it matters.

Thank you for noticing.`,
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'pride_response_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_tell_more',
        text: "Tell me how you got here.",
        nextNodeId: 'elena_the_choice',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'emotional_moment']
  },

  {
    nodeId: 'elena_education_comparison',
    speaker: 'Elena',
    content: [
      {
        text: `*Nods slowly.*

More hours than a bachelor's degree. But nobody counts it the same.

*Crosses arms.*

College kids get four years to figure themselves out. Internships. Study abroad. "Finding themselves."

Apprentices? We're working from day one. Learning and earning. No debt. Real skills.

But ask a guidance counselor which path is "serious" and they'll point to the diploma, not the license.`,
        emotion: 'frustrated',
        variation_id: 'education_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_systemic_from_education',
        text: "That sounds like a systemic problem.",
        nextNodeId: 'elena_systemic_problem',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['elena_arc', 'education']
  },

  {
    nodeId: 'elena_advice',
    speaker: 'Elena',
    content: [
      {
        text: `*Thinks.*

Try it. Actually try it.

Most high schools have shop classes—if they haven't cut them. Community colleges have pre-apprenticeship programs. Some unions do summer camps.

*Looks at her hands.*

You won't know if it fits until you hold a tool. Feel the work. See if your brain lights up the way mine does.

And if it does? Don't let anyone talk you out of it.`,
        emotion: 'earnest',
        variation_id: 'advice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_to_vision_from_advice',
        text: "What's your vision for the future?",
        nextNodeId: 'elena_vision',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['elena_arc', 'advice']
  }
]

export const elenaEntryPoints = {
  INTRODUCTION: 'elena_introduction'
} as const

export const elenaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(elenaDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: elenaEntryPoints.INTRODUCTION,
  metadata: {
    title: "Elena's Workshop",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: elenaDialogueNodes.length,
    totalChoices: elenaDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
