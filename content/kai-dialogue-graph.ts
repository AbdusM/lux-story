/**
 * Kai's Dialogue Graph
 * The Instructional Architect - Platform 6 (Corporate Innovation / L&D)
 *
 * CHARACTER: The Guilty Teacher
 * Core Conflict: "Compliance Safety" vs. "Real-World Danger"
 * Arc: From hiding behind "Click Next" modules to building simulations that actually save lives.
 * Mechanic: "The Safety Drill" - Rebuilding a failed safety module that caused a real injury.
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const kaiDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION (Gradual Reveal) =============
  {
    nodeId: 'kai_introduction',
    speaker: 'Kai',
    content: [
      {
        // Stage 1: Show corporate frustration first (matches Samuel's "burning the rulebook" setup)
        text: "Wait—stay back! That railing... the bolt is loose. 2mm variance.\n\nTechnically it holds 80kg, but if you slip... static load becomes dynamic load and... just stand there. Please.\n\nSafety isn't a checkbox. It's gravity waiting to catch you.",
        emotion: 'frustrated',
        variation_id: 'kai_intro_v3',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Protective Life training office. Fluorescent lights. Late shift.\n\nFifteen slides. Fifteen 'Click Next' buttons.\n\nYou're already analyzing the system, aren't you? You can see the gap between compliance and actual safety.", altEmotion: 'interested' },
          { pattern: 'building', minLevel: 5, altText: "Protective Life training office. Late shift.\n\nFifteen slides. Fifteen 'Click Next' buttons. That's what passes for safety training.\n\nYou look like someone who builds things. You know this could be designed better.", altEmotion: 'frustrated' },
          { pattern: 'helping', minLevel: 5, altText: "Protective Life training office. Fluorescent lights.\n\nFifteen slides. 'Ensure harness is secured.' Click Next.\n\nYou've got kind eyes. You're probably wondering why this matters to me so much.", altEmotion: 'vulnerable' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'kai_intro_systemic',
        text: "Compliance theater. The company gets liability protection, workers get a checkbox.",
        nextNodeId: 'kai_systemic_response',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      },
      {
        choiceId: 'kai_intro_curious',
        text: "Why does that matter to you personally?",
        voiceVariations: {
          analytical: "There's history behind that frustration. Why does it matter to you personally?",
          helping: "I can hear this is personal. Why does it matter to you?",
          building: "What happened that made you want to fix this? Why does it matter?",
          exploring: "There's a story here. Why does it matter to you personally?",
          patience: "Take your time. Why does this matter to you personally?"
        },
        nextNodeId: 'kai_accident_hint',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      },
      {
        choiceId: 'kai_intro_practical',
        text: "So redesign it. Make something better.",
        nextNodeId: 'kai_practical_response',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      },
      {
        choiceId: 'kai_intro_patience',
        text: "[Let the silence hold. They'll continue when ready.]",
        nextNodeId: 'kai_patience_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'kai_arc']
  },

  // Divergent responses for intro
  {
    nodeId: 'kai_systemic_response',
    speaker: 'Kai',
    content: [
      {
        text: `*They pause, a sharp look crossing their face.*

You get it. Most people see a checkbox and think "safety." You see the gap between the policy and the practice.

That's rare. Usually I have to explain why "completing training" and "being trained" aren't the same thing.`,
        emotion: 'surprised_respect',
        variation_id: 'systemic_response_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "*They pause, a sharp look crossing their face.*\n\nYou get it. You see systems the way I do—not just the outputs, but the logic failures hiding inside.\n\nMost people see a checkbox and think 'safety.' You see the gap.", altEmotion: 'impressed' },
          { pattern: 'building', minLevel: 4, altText: "*They pause.*\n\nYou get it. You're already thinking about how to fix it, aren't you?\n\nMost people stop at 'this is broken.' You see what it could be.", altEmotion: 'hopeful' }
        ]
      }
    ],
    choices: [
      { choiceId: 'tell_gap', text: "Tell me more about that gap.", nextNodeId: 'kai_system_frustration' }
    ]
  },
  {
    nodeId: 'kai_practical_response',
    speaker: 'Kai',
    content: [
      {
        text: `*They laugh - but it's hollow.*

Redesign it. Yeah. I have a master's degree in exactly that. Instructional design. UAB, 2022.

You want to know what my capstone was? A VR safety simulation for manufacturing floors. Haptic feedback, real scenarios, actual muscle memory.

It's sitting on a hard drive. Never deployed. Too expensive.`,
        emotion: 'bitter_amusement',
        variation_id: 'practical_response_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "*They laugh - but it's hollow.*\n\nRedesign it. Yeah. I have a master's degree in exactly that.\n\nYou build things. You know what it's like to create something good that never gets used. VR safety simulation. Haptic feedback. Real scenarios.\n\nSitting on a hard drive. Too expensive.", altEmotion: 'vulnerable' },
          { pattern: 'exploring', minLevel: 4, altText: "*They laugh - but it's hollow.*\n\nRedesign it. I have a master's degree in exactly that. UAB, 2022.\n\nYou're curious about the gap, aren't you? Between what's possible and what gets deployed.\n\nMy capstone is sitting on a hard drive. Never deployed.", altEmotion: 'bitter_amusement' }
        ]
      }
    ],
    choices: [
      { choiceId: 'sounds_frustrating', text: "That sounds frustrating.", nextNodeId: 'kai_system_frustration' }
    ]
  },
  {
    nodeId: 'kai_patience_response',
    speaker: 'Kai',
    content: [
      {
        text: `*They take a breath. The fluorescent lights hum.*

*After a moment, they continue - but their voice is quieter now.*

Between us... you're the first person who hasn't tried to fix it with advice. Everyone else wants to solve me like I'm a problem to debug.

Sometimes you just need someone to sit in the frustration with you.`,
        emotion: 'grateful',
        variation_id: 'patience_response_v1'
      }
    ],
    choices: [
      { choiceId: 'stay_quiet', text: "[Stay quiet. Let them continue.]", nextNodeId: 'kai_system_frustration' }
    ]
  },

  {
    // Stage 2: Bridge node - shows the systemic problem
    nodeId: 'kai_system_frustration',
    speaker: 'Kai',
    content: [
      {
        text: `Between us... that's exactly it. I know how people actually learn. I have a master's in instructional design. I could build simulations, scenarios, real practice.

But that costs money. "Click Next" costs nothing.

So I build green checkmarks. Legal shields. And last week...`,
        emotion: 'bitter',
        variation_id: 'system_frustration_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_what_happened',
        text: "What happened last week?",
        voiceVariations: {
          analytical: "What's the timeline? What happened last week?",
          helping: "You can tell me. What happened last week?",
          building: "What went wrong? What happened last week?",
          exploring: "I want to understand. What happened last week?",
          patience: "Whenever you're ready. What happened last week?"
        },
        nextNodeId: 'kai_accident_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      },
      {
        choiceId: 'kai_knew_coming',
        text: "Something went wrong. You saw it coming.",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'kai_system_exploring',
        text: "What would real learning look like? If you could redesign it from scratch?",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'exploring',
        skills: ['curiosity', 'creativity'],
        visibleCondition: {
          patterns: { exploring: { min: 3 } }
        },
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ]
  },

  {
    // Stage 2 (alternate): More direct path to the hint
    nodeId: 'kai_accident_hint',
    speaker: 'Kai',
    content: [
      {
        text: `Because three days ago, someone got hurt. Someone who clicked every button. Watched every video. Passed every quiz.

And none of it mattered when he was standing twenty feet up without checking his harness.`,
        emotion: 'pained',
        variation_id: 'accident_hint_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_tell_more',
        text: "Tell me what happened.",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'empathy'],
        visibleCondition: {
          patterns: { helping: { min: 4 } }
        },
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'kai_your_fault',
        text: "You designed the training. You feel responsible.",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'analytical',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'kai_hint_exploring',
        text: "What would it take to actually prepare someone? Not just check a box?",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
        visibleCondition: {
          patterns: { exploring: { min: 4 }, building: { min: 2 } }
        },
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ]
  },

  {
    // Stage 3: Full reveal (now feels earned after buildup)
    nodeId: 'kai_accident_reveal',
    speaker: 'Kai',
    content: [
      {
        text: `Warehouse accident. Broken pelvis.

He's 22. Same age as my little brother.

The investigation cleared us. "Employee completed mandatory safety training on Oct 4th." The certificate is in the system. Green checkmark.

We designed a green checkmark. We didn't design safety.`,
        emotion: 'guilty',
        variation_id: 'accident_v1',
        // E2-031: Interrupt opportunity when Kai reveals their guilt
        interrupt: {
          duration: 3500,
          type: 'connection',
          action: 'Reach out. Let them know this weight isn\'t theirs alone.',
          targetNodeId: 'kai_interrupt_acknowledged',
          consequence: {
            characterId: 'kai',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'kai_accountability',
        text: "You feel responsible because you designed the checkmark.",
        voiceVariations: {
          analytical: "The system worked as designed. You designed the checkmark.",
          helping: "This is why it haunts you. You designed the checkmark.",
          building: "You built something that failed its purpose. You designed the checkmark.",
          exploring: "That's the weight you carry. You designed the checkmark.",
          patience: "You feel responsible. Because you designed the checkmark."
        },
        nextNodeId: 'kai_origin_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'kai_system_fail',
        text: "The paperwork protected them. Not him.",
        nextNodeId: 'kai_origin_story',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'kai_marcus_connection',
        text: "I met a nurse, Marcus. He talks about the difference between the machine and the patient too.",
        nextNodeId: 'kai_marcus_reference',
        pattern: 'building',
        skills: ['collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['marcus_arc_complete']
        }
      },
      {
        choiceId: 'kai_reveal_exploring',
        text: "What did that moment teach you? When the system passed but the person failed?",
        nextNodeId: 'kai_origin_story',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'kai_interrupt_acknowledged',
    speaker: 'Kai',
    content: [{
      text: `*They look at you, surprised.*

You didn't try to fix it. Didn't offer solutions. Just... stayed.

*A shaky breath.*

Most people hear "someone got hurt" and immediately pivot to problem-solving mode. You let me feel it first.

That's... that's what actual safety looks like. Presence before protocol.`,
      emotion: 'moved',
      microAction: 'Their shoulders drop slightly.',
      variation_id: 'interrupt_v1'
    }],
    choices: [
      {
        choiceId: 'kai_interrupt_continue',
        text: "Tell me what you want to do about it.",
        nextNodeId: 'kai_origin_story',
        pattern: 'helping',
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'kai_arc']
  },
  {
    nodeId: 'kai_marcus_reference',
    speaker: 'Kai',
    content: [
      {
        text: `Marcus. The ECMO specialist? I read about his case in a medical ethics journal.

He has to decide, in seconds, who lives. I have months to design these courses, and I still failed.

If he makes a mistake, a patient dies. If I make a mistake... 50,000 employees learn the wrong thing. And then what happens?

The scale is different. The guilt is the same.`,
        emotion: 'reflective_guilt',
        variation_id: 'marcus_ref_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_marcus_back',
        text: "So fix it. Like he did.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'building'
      }
    ]
  },

  {
    nodeId: 'kai_compliance_trap',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai laughs, a brittle, snapping sound" - anger conveyed through dialogue
        text: `Legally covered. Yes. That's what my VP said. "Great work, Kai. The audit trail is perfect."

He's in the hospital, and we're celebrating our audit trail.

I can't do this anymore. I can't build shields for the company that leave the people exposed.`,
        emotion: 'angry',
        variation_id: 'compliance_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        thoughtId: 'industrial-legacy'
      }
    ],
    choices: [
      {
        choiceId: 'kai_move_to_sim',
        text: "So build something that actually protects them.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  // ============= SCENE 3: KAI'S ORIGIN STORY =============
  {
    nodeId: 'kai_origin_story',
    speaker: 'Kai',
    content: [
      {
        text: `You want to know why I do this?

My dad worked at Sloss Furnaces. Well, what became of it. Thirty years making pipe fittings. He came home smelling like iron and machine oil.

When I was twelve, he almost lost his hand. The guard was broken. Everyone knew it was broken. But production quotas don't wait for safety repairs.`,
        emotion: 'reflective',
        variation_id: 'origin_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_origin_father',
        text: "What happened to your dad?",
        nextNodeId: 'kai_father_outcome',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'empathy'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'kai_origin_training',
        text: "So you went into training to fix that system.",
        nextNodeId: 'kai_training_choice',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['kai_arc', 'backstory']
  },

  {
    nodeId: 'kai_father_outcome',
    speaker: 'Kai',
    content: [
      {
        text: `He kept the hand. Lost two fingers. The company paid for surgery and called it "workplace wellness."

He never complained. Said it was part of the job. But every time I saw him struggle to hold a coffee cup, I thought: someone designed that training. Someone signed off on it.

That someone is now me.`,
        emotion: 'determined',
        variation_id: 'father_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        thoughtId: 'long-game'
      }
    ],
    choices: [
      {
        choiceId: 'kai_father_to_training',
        text: "You wanted to make sure it didn't happen to anyone else.",
        nextNodeId: 'kai_training_choice',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'kai_training_choice',
    speaker: 'Kai',
    content: [
      {
        text: `I thought I could change things from the inside. Get a degree in instructional design. Join a big company with resources. Build something better.

But you know what they taught me in school? "Engaging content." "Gamification." "Learner analytics."

Not a single class on how to keep someone alive.`,
        emotion: 'frustrated',
        variation_id: 'training_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_corporate_reality',
        text: "What did you find when you got inside?",
        nextNodeId: 'kai_vocational_path',
        pattern: 'analytical',
        skills: ['criticalThinking', 'observation']
      },
      {
        choiceId: 'kai_why_not_factory',
        text: "Why didn't you just work in the factory like your dad?",
        nextNodeId: 'kai_intro_extended',
        pattern: 'exploring',
        skills: ['communication', 'curiosity']
      }
    ]
  },

  // ============= EXPANSION: Manufacturing Background (12 nodes) =============

  {
    nodeId: 'kai_intro_extended',
    speaker: 'Kai',
    content: [
      {
        text: `I did. Two summers during high school. Nucor Steel Birmingham. Rebar production.

110 degrees on the factory floor. Safety goggles fogging up. Molten steel running through channels.

Learned more about systems in two months than four years of college.

But my mom... she didn't want me to end up like my dad. Missing fingers. Bad back. Retiring at 60 with nothing.

"You're smart, Kai. Get the degree. Get the office job."`,
        emotion: 'conflicted',
        variation_id: 'extended_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_factory_learning',
        text: "What did you learn on the factory floor?",
        nextNodeId: 'kai_systems_revelation',
        pattern: 'exploring',
        skills: ['curiosity', 'observation']
      },
      {
        choiceId: 'kai_mom_pressure',
        text: "Your mom wanted better for you.",
        nextNodeId: 'kai_college_pressure',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'culturalCompetence'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ],
    tags: ['kai_arc', 'manufacturing_background', 'birmingham']
  },

  {
    nodeId: 'kai_vocational_path',
    speaker: 'Kai',
    content: [
      {
        text: `Before the degree, I went to Lawson State Community College. Welding program.

My dad was proud. Thought I'd follow his path. Make things with my hands.

But every time I picked up the torch, I kept thinking: who designed this safety protocol? Who wrote the training manual that nobody reads?

I didn't want to just be good at the work. I wanted to fix why the work was dangerous.`,
        emotion: 'reflective',
        variation_id: 'vocational_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_welding_skill',
        text: "Can you still weld?",
        nextNodeId: 'kai_first_weld',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'kai_systems_mind',
        text: "You saw the system, not just the task.",
        nextNodeId: 'kai_systems_revelation',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      }
    ],
    tags: ['kai_arc', 'vocational_training', 'birmingham']
  },

  {
    nodeId: 'kai_first_weld',
    speaker: 'Kai',
    content: [
      {
        text: `*Smiles slightly.*

Yeah. TIG welding. Aluminum, stainless, mild steel.

There's something about it. Watching the puddle form. Controlling the heat. Building something that holds.

My instructor used to say: "A good weld is stronger than the metal itself."

That's when I understood. The connection matters more than the parts.

Same with teaching. The learning matters more than the certificate.`,
        emotion: 'warm',
        interaction: 'small',
        variation_id: 'weld_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_weld_to_teaching',
        text: "You brought that precision into training design.",
        nextNodeId: 'kai_hands_on_wisdom',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication']
      },
      {
        choiceId: 'kai_weld_miss_it',
        text: "Do you miss working with your hands?",
        nextNodeId: 'kai_hands_on_wisdom',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ],
    tags: ['kai_arc', 'skill_moment', 'hands_on']
  },

  {
    nodeId: 'kai_systems_revelation',
    speaker: 'Kai',
    content: [
      {
        text: `The factory floor is all systems. Input, process, output.

Steel comes in as scrap. Gets melted in the arc furnace. Poured into molds. Cooled. Cut. Shipped.

But the real system? The people.

The crane operator who signals the pour. The quality inspector who checks the specs. The maintenance crew who fixes the torch before it breaks.

If anyone fails, the whole line stops. Or worse, someone gets hurt.

That's what I learned: safety isn't a checklist. It's how the system works together.`,
        emotion: 'illuminated',
        interaction: 'bloom',
        variation_id: 'systems_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_systems_to_training',
        text: "And training is how you teach the system to work.",
        nextNodeId: 'kai_hybrid_path',
        pattern: 'analytical',
        skills: ['systemsThinking', 'leadership']
      },
      {
        choiceId: 'kai_systems_college',
        text: "Is that when you decided to go to college?",
        nextNodeId: 'kai_college_pressure',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['kai_arc', 'systems_thinking', 'revelation']
  },

  {
    nodeId: 'kai_college_pressure',
    speaker: 'Kai',
    content: [
      {
        text: `My mom didn't give me a choice. "You're going to UAB. You're getting the degree. No son of mine is losing fingers."

My dad didn't say anything. Just looked at his hand.

So I went. Instructional design. Educational technology. Learning sciences.

Everyone in my cohort wanted to design corporate onboarding. Build apps for schools.

I wanted to keep my dad's coworkers alive.

*Quiet.*

They thought I was weird.`,
        emotion: 'isolated',
        variation_id: 'college_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_college_validate',
        text: "You weren't weird. You cared about something that mattered.",
        nextNodeId: 'kai_birmingham_steel',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'encouragement'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'kai_college_unique',
        text: "That perspective made you unique. You understood both sides.",
        nextNodeId: 'kai_hybrid_path',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication']
      }
    ],
    tags: ['kai_arc', 'college_dilemma', 'family_pressure']
  },

  {
    nodeId: 'kai_birmingham_steel',
    speaker: 'Kai',
    content: [
      {
        text: `You know what's funny? Birmingham's still got manufacturing.

Nucor Steel. Mercedes-Benz U.S. International in Tuscaloosa. Lots of small fabrication shops.

They're hiring. Good pay. Union benefits. Real skills.

But nobody talks about it. Everyone pushes college. "Get out of Birmingham. Get a tech job."

Meanwhile, the factory jobs pay better than half the office jobs I've seen.

And they're building things that matter. Cars. Steel beams. Infrastructure.

Not... slideshows.`,
        emotion: 'frustrated',
        variation_id: 'birmingham_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_birmingham_both',
        text: "What if you could do both? Manufacturing expertise + training design.",
        nextNodeId: 'kai_hybrid_path',
        pattern: 'building',
        skills: ['creativity', 'problemSolving']
      },
      {
        choiceId: 'kai_birmingham_mentor',
        text: "Have you worked with any of those companies?",
        nextNodeId: 'kai_mentorship',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['kai_arc', 'birmingham_opportunity', 'manufacturing']
  },

  {
    nodeId: 'kai_mentorship',
    speaker: 'Kai',
    content: [
      {
        text: `Last year. Nucor asked me to redesign their safety onboarding.

I spent a week on the factory floor. Shadowing Tommy, a 30-year veteran machinist.

He showed me how to read a blueprint. How to set up a CNC mill. How to spot when a tool's about to fail.

Then he showed me their training manual. "This is garbage," he said. "Nobody reads it. We just show the new guys what to do."

*Small laugh.*

That's when I knew. The manual wasn't the training. Tommy was.

I designed a mentorship program instead of a PDF. Paired every new hire with a veteran.

Injury rate dropped 40% in six months.`,
        emotion: 'proud',
        interaction: 'bloom',
        variation_id: 'mentorship_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_mentorship_impact',
        text: "You created real change there.",
        nextNodeId: 'kai_automation_fear',
        pattern: 'helping',
        skills: ['encouragement', 'leadership']
      },
      {
        choiceId: 'kai_mentorship_scale',
        text: "Could that model work in other industries?",
        nextNodeId: 'kai_career_synthesis',
        pattern: 'building',
        skills: ['systemsThinking', 'entrepreneurship']
      }
    ],
    tags: ['kai_arc', 'mentorship', 'impact_story']
  },

  {
    nodeId: 'kai_automation_fear',
    speaker: 'Kai',
    content: [
      {
        text: `Tommy retired last month. Sixty-two. Bad knees. Good pension.

The CNC machines can do most of what he did. Faster. More precise. No sick days.

But they can't teach. Can't spot when something's wrong by the sound. Can't mentor the kid who's scared of the mill.

Nucor replaced Tommy with a robotic arm. Kept the safety program I built... for now.

*Looks at hands.*

That's the future. Machines making things. Humans making sure the machines don't kill anyone.`,
        emotion: 'uncertain',
        variation_id: 'automation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_automation_human',
        text: "The human expertise becomes more valuable, not less.",
        nextNodeId: 'kai_hybrid_path',
        pattern: 'helping',
        skills: ['encouragement', 'criticalThinking']
      },
      {
        choiceId: 'kai_automation_adapt',
        text: "Then you train people to work WITH the machines.",
        nextNodeId: 'kai_hybrid_path',
        pattern: 'analytical',
        skills: ['adaptability', 'systemsThinking']
      },
      {
        choiceId: 'kai_automation_workers',
        text: "What happens to the workers? The ones who can't retire yet?",
        nextNodeId: 'kai_retraining_reality',
        pattern: 'helping',
        skills: ['empathy', 'criticalThinking'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ],
    tags: ['kai_arc', 'automation', 'future_of_work']
  },

  // ============= ECONOMIC CONSEQUENCES (New Branch) =============
  {
    nodeId: 'kai_retraining_reality',
    speaker: 'Kai',
    content: [
      {
        text: `*Quiet for a moment.*

Half the people I trained over the past year are looking for new work now. Not because they failed—because their jobs got automated.

DeShawn. Forty-three. Twenty years running the arc furnace. Company offered him "retraining"—eight weeks of computer classes. Then nothing.

Maria. Shift supervisor. They told her to "reskill into tech." She's got three kids and no time to go back to school for two years.

*Voice drops.*

That's what no one talks about. The retraining sounds good in a press release. But who's paying the mortgage while you learn to code?`,
        emotion: 'frustrated',
        interaction: 'small',
        variation_id: 'retraining_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "*Quiet for a moment.*\n\nHalf the people I trained are looking for new work. Not because they failed—because their jobs got automated.\n\nDeShawn. Twenty years at the furnace. Maria. Three kids, shift supervisor.\n\n*Voice drops.*\n\nYou asked about them. Most people don't. They talk about 'the workforce' like it's a spreadsheet, not people with families.", altEmotion: 'vulnerable' },
          { pattern: 'analytical', minLevel: 4, altText: "*Quiet for a moment.*\n\nHalf the people I trained are looking for new work. The data's clear—automation displaces faster than retraining scales.\n\nCompanies promise 'reskilling' because it's cheaper than severance. But eight weeks of computer classes doesn't replace twenty years of expertise.\n\nThe economics are brutal. Who pays the mortgage while someone learns to code?", altEmotion: 'analytical_bitter' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'kai_what_works',
        text: "So what actually works? What helps people adapt?",
        nextNodeId: 'kai_what_actually_works',
        pattern: 'analytical',
        skills: ['problemSolving', 'criticalThinking']
      },
      {
        choiceId: 'kai_despair',
        text: "That sounds... hopeless.",
        nextNodeId: 'kai_not_hopeless',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['kai_arc', 'economic_reality', 'retraining']
  },

  {
    nodeId: 'kai_what_actually_works',
    speaker: 'Kai',
    content: [
      {
        text: `Building on what they already know. Not starting over.

DeShawn doesn't need to become a software engineer. He needs to learn how to work WITH the robotic arm. His twenty years of metallurgy? That's still valuable. The machine can't tell good steel from bad by the color of the pour.

That's what I'm building. Training that bridges—not replaces. Show a machinist how to program the CNC. Show a welder how to operate the automated torch. Meet people where they are.

The companies that figure this out? They'll have workers who actually know what they're doing. The ones that don't? They'll have expensive robots and nobody who knows how to fix them when they break.`,
        emotion: 'determined',
        interaction: 'bloom',
        variation_id: 'what_works_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_back_to_hybrid',
        text: "That's the hybrid path you mentioned.",
        nextNodeId: 'kai_hybrid_path',
        pattern: 'analytical'
      }
    ],
    tags: ['kai_arc', 'practical_solution', 'economic_reality']
  },

  {
    nodeId: 'kai_not_hopeless',
    speaker: 'Kai',
    content: [
      {
        text: `*Small shake of the head.*

Not hopeless. Just... honest.

The jobs aren't all disappearing. They're changing. Healthcare needs people—can't automate wiping someone's tears. Construction needs people—can't robot your way through a renovation in a 100-year-old building. Education needs people—kids don't learn from screens.

The question isn't whether there's work. It's whether people can get to it. And right now? The bridge is broken.

That's why I'm here. Building better bridges. One simulation at a time.`,
        emotion: 'resolved',
        variation_id: 'not_hopeless_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "*Small shake of the head.*\n\nNot hopeless. Just honest.\n\nThe caring jobs aren't going anywhere. Healthcare. Teaching. Elder care. You can't automate sitting with someone who's scared.\n\nThe question is whether people can get to those jobs. Right now, the bridge is broken. That's why I'm building better bridges.", altEmotion: 'determined' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'kai_continue_to_hybrid',
        text: "So you're building that bridge.",
        nextNodeId: 'kai_hybrid_path',
        pattern: 'building'
      }
    ],
    tags: ['kai_arc', 'hope', 'economic_reality']
  },

  {
    nodeId: 'kai_hybrid_path',
    speaker: 'Kai',
    content: [
      {
        text: `That's what I'm building toward. Hybrid path.

Trade skills + systems thinking. Hands-on work + digital literacy.

The welder who understands robotics. The machinist who can program the CNC. The safety officer who builds VR simulations.

Birmingham needs that. The manufacturing jobs aren't going away. They're just changing.

And someone needs to teach people how to navigate that change.

*Looks up.*

Maybe that someone is me.`,
        emotion: 'determined',
        interaction: 'nod',
        variation_id: 'hybrid_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_hybrid_vision',
        text: "That's the path forward. You're bridging two worlds.",
        voiceVariations: {
          analytical: "That's a rare skillset. You're bridging two worlds.",
          helping: "That's beautiful work. You're bridging two worlds.",
          building: "You're the translator they need. You're bridging two worlds.",
          exploring: "That's the path forward. You're bridging two worlds.",
          patience: "You're exactly where you need to be. Bridging two worlds."
        },
        nextNodeId: 'kai_hands_on_wisdom',
        pattern: 'helping',
        skills: ['encouragement', 'leadership']
      },
      {
        choiceId: 'kai_hybrid_build',
        text: "What would that training look like?",
        nextNodeId: 'kai_career_synthesis',
        pattern: 'building',
        skills: ['creativity', 'problemSolving']
      }
    ],
    tags: ['kai_arc', 'hybrid_path', 'career_vision']
  },

  {
    nodeId: 'kai_hands_on_wisdom',
    speaker: 'Kai',
    content: [
      {
        text: `You know what I miss most about factory work?

The feedback loop. You weld a joint, you test it, you see if it holds. Immediate. Real.

In corporate training? I build a module. Someone clicks through it. I get a completion metric. Did they learn? Who knows.

But when I'm teaching someone to weld, I watch their hands. I see the bead form. I know if they got it.

That's the kind of learning I want to design. Where you can see the result. Where failure teaches you before it kills you.`,
        emotion: 'passionate',
        interaction: 'bloom',
        variation_id: 'wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_wisdom_simulation',
        text: "That's why you're building simulations. Safe failure.",
        nextNodeId: 'kai_career_synthesis',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication']
      },
      {
        choiceId: 'kai_wisdom_real',
        text: "You want learning to feel real.",
        nextNodeId: 'kai_career_synthesis',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['kai_arc', 'learning_philosophy', 'hands_on']
  },

  {
    nodeId: 'kai_career_synthesis',
    speaker: 'Kai',
    content: [
      {
        text: `Manufacturing + instructional design. That's my path.

Not compliance training. Not corporate checkboxes.

Safety simulations for industrial workers. Built by someone who understands both the factory floor and the learning science.

Birmingham-based. Serving the companies that kept this city alive. Nucor. Mercedes. The fabrication shops in Bessemer.

Training that actually protects people.

*Quiet confidence.*

That's what I'm building.`,
        emotion: 'resolved',
        interaction: 'bloom',
        variation_id: 'synthesis_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_synthesis_to_corporate',
        text: "So what are you still doing at Protective Life?",
        nextNodeId: 'kai_corporate_truth',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'kai_synthesis_validation',
        text: "That's exactly what the world needs.",
        nextNodeId: 'kai_corporate_truth',
        pattern: 'helping',
        skills: ['encouragement', 'leadership'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      }
    ],
    tags: ['kai_arc', 'career_synthesis', 'manufacturing_design'],
    metadata: {
      sessionBoundary: true  // Session 2: Career vision crystallized
    }
  },

  // ============= SCENE 4: CORPORATE REALITY =============
  {
    nodeId: 'kai_corporate_truth',
    speaker: 'Kai',
    content: [
      {
        text: `The VP pulled me aside on my first week. You know what she said?

"Kai, your job is to make the lawyers happy. The slides are legal documentation. If someone gets hurt, we show the completion certificate. That's the training."

I thought she was exaggerating. She wasn't.`,
        emotion: 'disillusioned',
        variation_id: 'corporate_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_vp_pushback',
        text: "Did you ever push back?",
        nextNodeId: 'kai_pushback_story',
        pattern: 'helping',
        skills: ['courage', 'leadership']
      },
      {
        choiceId: 'kai_vp_system',
        text: "The system rewards compliance, not competence.",
        nextNodeId: 'kai_compliance_revelation',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      }
    ],
    tags: ['kai_arc', 'corporate_conflict'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  {
    nodeId: 'kai_pushback_story',
    speaker: 'Kai',
    content: [
      {
        text: `Once. I proposed a simulation-based module for hazmat handling. Real scenarios, real consequences, no "Click Next."

The VP ran the numbers. "This costs 40 hours per employee. The current module is 45 minutes."

She didn't even look at the injury data. Just the time-to-completion metrics.`,
        emotion: 'bitter',
        variation_id: 'pushback_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_pushback_continue',
        text: "And now someone is in the hospital.",
        nextNodeId: 'kai_hospital_connection',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'kai_compliance_revelation',
    speaker: 'Kai',
    content: [
      {
        text: `Exactly. The metrics are designed to measure the wrong thing.

Completion rate: 98%. Average quiz score: 92%. Injury rate: "Not our department."

We're optimizing for numbers that don't matter while people get hurt.`,
        emotion: 'analytical_anger',
        variation_id: 'compliance_rev_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_compliance_continue',
        text: "Until it became personal.",
        nextNodeId: 'kai_hospital_connection',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= SCENE 5: HOSPITAL VISIT =============
  {
    nodeId: 'kai_hospital_connection',
    speaker: 'Kai',
    content: [
      {
        text: `I visited him. Marcus. not the nurse, the worker. Same name, different person.

He's 22. Two kids. The doctors say he'll walk again, but warehouse work? Probably not.

His wife looked at me and asked: "Did you design the training he took?"`,
        emotion: 'guilt_shame',
        variation_id: 'hospital_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_hospital_truth',
        text: "What did you tell her?",
        nextNodeId: 'kai_wife_confession',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'courage']
      },
      {
        choiceId: 'kai_hospital_avoid',
        text: "That must have been unbearable.",
        nextNodeId: 'kai_wife_confession',
        pattern: 'helping',
        skills: ['empathy']
      }
    ],
    tags: ['kai_arc', 'emotional_core']
  },

  {
    nodeId: 'kai_wife_confession',
    speaker: 'Kai',
    content: [
      {
        text: `I said yes. And I apologized. Not the corporate apology. the real one.

She didn't yell. She didn't threaten to sue. She just said: "Fix it. So this doesn't happen to someone else's husband."

That's when I started building. Secretly. After hours.`,
        emotion: 'determined_quiet',
        variation_id: 'confession_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_building_start',
        text: "Show me what you're building.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'building',
        skills: ['curiosity', 'problemSolving']
      }
    ]
  },

  // ============= SCENE 6: THE SIMULATION: THE SAFETY DRILL =============
  {
    nodeId: 'kai_simulation_setup',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai turns" and "Kai taps" - showing screen result, not process
        text: `I deleted the module. The new one... I'm building it now. Secretly.

Rough, grainy video feed simulation. Forklift Operator scenario. No text. No "Click Next."

*The view shakes.*

You're in the cab. The load is unstable. The foreman is screaming at you to hurry up because the truck is waiting.

What do you do?`,
        emotion: 'intense',
        variation_id: 'sim_setup_v2',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    simulation: {
      type: 'visual_canvas',
      title: 'Safety System Blueprint',
      taskDescription: 'The current protocol relies entirely on individual compliance. Redesign the workflow to include systemic fail-safes that protect workers even when they make mistakes.',
      initialContext: {
        label: 'Blueprint: Zone 4 (Forklift Loading)',
        content: 'Current State: [Worker] -> [Load Check] -> [Move]\nRisk Factor: High (Human Error)\n\nDrag components to build redundancy:\n[ ] Automated Load Sensors\n[ ] Physical Barriers\n[ ] Teammate Spotter Protocol',
        displayStyle: 'code'
      },
      successFeedback: '✓ SYSTEM REDUNDANCY ACHIEVED.'
    },
    choices: [
      {
        choiceId: 'sim_pressure_compliance',
        text: 'Deploy: Add "Mandatory PDF Review" before shift.',
        nextNodeId: 'kai_sim_fail_pdf',
        pattern: 'building'
      },
      {
        choiceId: 'sim_pressure_safety',
        text: 'Deploy: Install Auto-Sensors + Physical Barriers.',
        nextNodeId: 'kai_sim_success',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          addGlobalFlags: ['golden_prompt_safety_design']
        }
      }
    ],
    tags: ['simulation', 'kai_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE 1: COMPLIANCE ---
  {
    nodeId: 'kai_sim_fail_compliance',
    speaker: 'Kai',
    content: [
      {
        text: "The checklist completes. Every box green.\n\nSuddenly, the screen flashes red.\n\nCRITICAL ERROR. SYSTEM <shake>CRASH</shake>.\n\nWe followed every rule. And the system still failed. Because the rules were designed to protect the company, not the people.",
        emotion: 'shocked',
        variation_id: 'fail_compliance_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'kai_retry_compliance',
        text: "I didn't think... let me try again.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'patience',
        skills: ['learningAgility']
      },
      {
        choiceId: 'kai_give_up_compliance',
        text: "It's too hard. Stick to the slides.",
        nextNodeId: 'kai_bad_ending',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['kai_chose_safety'] // BAD ENDING
        }
      }
    ]
  },

  // --- FAILURE STATE 2: PDF ---
  {
    nodeId: 'kai_sim_fail_pdf',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai shakes their head" - frustration conveyed through teaching moment
        text: `A 40-page document opens.

While you're reading, the load shifts. The crate falls.

The screen flashes red. "INJURY REPORTED."

Nobody reads the PDF in a crisis. You hesitated. Real life doesn't pause for documentation.`,
        emotion: 'frustrated',
        variation_id: 'sim_fail_pdf_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'kai_retry_pdf',
        text: "You're right. No manuals. Action.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'patience',
        skills: ['learningAgility']
      }
    ]
  },

  // --- SUCCESS STATE ---
  {
    nodeId: 'kai_sim_success',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai exhales, shoulders dropping" - relief conveyed through dialogue revelation
        text: `The foreman screams in your face. The AI voice is deafening.

But you stopped. The load wobbles, then settles. Safe.

You stopped. You ignored the authority figure to save the human.

That's it. That's the skill. Not "harness safety." *Courage.*`,
        emotion: 'relieved',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        thoughtId: 'hands-on-truth'
      }
    ],
    choices: [
      {
        choiceId: 'kai_teach_courage',
        text: "Slides can't teach courage.",
        nextNodeId: 'kai_real_test',
        pattern: 'helping',
        skills: ['leadership', 'instructionalDesign']
      },
      {
        choiceId: 'kai_sim_power',
        text: "I felt that fear. I'll remember it.",
        nextNodeId: 'kai_real_test',
        pattern: 'building',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation_complete', 'kai_arc']
  },

  // ============= SCENE 7: TESTING WITH WORKERS =============
  {
    nodeId: 'kai_real_test',
    speaker: 'Kai',
    content: [
      {
        text: `I ran the simulation with three warehouse workers last night. Off the clock. Confidential.

The first one. DeShawn, 15 years on the floor. he failed the forklift scenario three times. On the fourth try, he stopped the load.

You know what he said? "I've never done that. Never stopped. I always just finished the job."`,
        emotion: 'hopeful',
        variation_id: 'real_test_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_test_impact',
        text: "That's real learning. Not a checkbox.",
        nextNodeId: 'kai_worker_feedback',
        pattern: 'helping',
        skills: ['instructionalDesign', 'emotionalIntelligence']
      },
      {
        choiceId: 'kai_test_data',
        text: "Three workers isn't a large sample size, but it's proof of concept.",
        nextNodeId: 'kai_worker_feedback',
        pattern: 'analytical',
        skills: ['criticalThinking', 'pragmatism']
      }
    ],
    tags: ['kai_arc', 'validation']
  },

  {
    nodeId: 'kai_worker_feedback',
    speaker: 'Kai',
    content: [
      {
        text: `Maria, she's a shift supervisor, she said something that broke me.

"Twenty years I've been doing this job. Not once has anyone asked me what I need to know. They send the slides and wait for the green check."

These are the people I'm supposed to protect. And I've been hiding behind PDFs.`,
        emotion: 'revelation',
        variation_id: 'feedback_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_scale_problem',
        text: "Can you scale this? One simulation for 50,000 employees?",
        nextNodeId: 'kai_scale_challenge',
        pattern: 'analytical',
        skills: ['strategicThinking', 'problemSolving']
      },
      {
        choiceId: 'kai_impact_problem',
        text: "What matters is impact, not scale. Start with the most dangerous jobs.",
        nextNodeId: 'kai_impact_focus',
        pattern: 'helping',
        skills: ['pragmatism', 'triage']
      }
    ]
  },

  {
    nodeId: 'kai_scale_challenge',
    speaker: 'Kai',
    content: [
      {
        text: `No. Not in the corporate structure. The VP would never approve the time investment.

But here's what I realized: I don't need to train 50,000 people. I need to train the right 50 people first.

Supervisors. Safety leads. The ones who can actually stop a dangerous situation before it starts.`,
        emotion: 'strategic',
        variation_id: 'scale_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_continue_realization',
        text: "Multiply through influence, not compliance.",
        nextNodeId: 'kai_studio_realization',
        pattern: 'building',
        skills: ['leadership', 'strategicThinking']
      }
    ]
  },

  {
    nodeId: 'kai_impact_focus',
    speaker: 'Kai',
    content: [
      {
        text: `Exactly. Forklifts. Heights. Chemical handling. The jobs where a mistake means someone doesn't go home.

If I can prove the simulation reduces real injuries—not compliance metrics—maybe someone will listen.

Or maybe I do it anyway. Without permission.`,
        emotion: 'determined',
        variation_id: 'impact_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_continue_impact',
        text: "Sometimes the right thing doesn't need permission.",
        nextNodeId: 'kai_studio_realization',
        pattern: 'helping',
        skills: ['courage', 'integrity']
      }
    ]
  },

  // ============= SCENE 8: THE REALIZATION =============
  {
    nodeId: 'kai_studio_realization',
    speaker: 'Kai',
    content: [
      {
        text: `I have to show this. Not to the VP. to the workers.

The training is broken. I'm building checkmarks that hide the danger.

If I stay, I'm complicit. If I leave, I can build something that actually protects them.`,
        emotion: 'determined',
        variation_id: 'studio_v2'
      }
    ],
    choices: [
      {
        choiceId: 'kai_leave',
        text: "Leave. Build the studio that saves lives.",
        nextNodeId: 'kai_final_choice',
        pattern: 'building',
        skills: ['entrepreneurship', 'courage']
      },
      {
        choiceId: 'kai_stay_change',
        text: "What if you stayed and fought from inside?",
        nextNodeId: 'kai_insider_path',
        pattern: 'analytical',
        skills: ['strategicThinking', 'pragmatism']
      }
    ]
  },

  {
    nodeId: 'kai_insider_path',
    speaker: 'Kai',
    content: [
      {
        text: `I thought about that. Change from within. But you know how long it takes to change a corporate culture?

Marcus. the worker in the hospital. he can't wait five years for me to get promoted to the right level. His kids need their dad healthy now.

Sometimes the system is too slow. Sometimes you have to step outside it.`,
        emotion: 'resolved',
        variation_id: 'insider_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_accept_outside',
        text: "You're right. Build it outside.",
        nextNodeId: 'kai_final_choice',
        pattern: 'building',
        skills: ['creativity', 'courage']
      }
    ]
  },

  // ============= SCENE 9: FINAL CHOICE =============
  {
    nodeId: 'kai_final_choice',
    speaker: 'Kai',
    content: [
      {
        text: `Before I go, I want to ask you something.

I've been building training for years. Thousands of slides. Millions of checkmarks.

What do you think matters more. reaching more people, or reaching people more deeply?`,
        emotion: 'reflective',
        variation_id: 'final_choice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_choose_depth',
        text: "Depth. One person who learns beats a thousand who click through.",
        nextNodeId: 'kai_climax_decision',
        pattern: 'helping',
        skills: ['wisdom', 'instructionalDesign'],
        consequence: {
          characterId: 'kai',
          trustChange: 3
        }
      },
      {
        choiceId: 'kai_choose_reach',
        text: "Reach. You can't save everyone, but you can give everyone a chance. Sometimes access matters more than perfection.",
        nextNodeId: 'kai_climax_decision',
        pattern: 'building',
        skills: ['pragmatism', 'strategicThinking']
      },
      {
        choiceId: 'kai_choose_both',
        text: "Both. Start deep, then find ways to scale what works. But honestly? I struggle with that balance. I want to do both and end up doing neither well.",
        nextNodeId: 'kai_climax_decision',
        pattern: 'analytical',
        skills: ['systemsThinking', 'leadership', 'emotionalIntelligence']
      },
      {
        choiceId: 'kai_choose_uncertain',
        text: "I don't know. That's the question I'm wrestling with too. How do you measure impact? How do you know you're making a difference?",
        nextNodeId: 'kai_climax_decision',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'criticalThinking'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      }
    ],
    tags: ['kai_arc', 'philosophical_choice'],
    metadata: {
      sessionBoundary: true  // Session 2: Crossroads complete
    }
  },

  {
    nodeId: 'kai_climax_decision',
    speaker: 'Kai',
    content: [
      {
        text: `<bloom>Kairos Learning Design</bloom>. No certificates. Just survival.

It's terrifying. I'm giving up the salary, the benefits... the green checkmarks.

But I'll never have to click 'Next' again.`,
        emotion: 'liberated',
        variation_id: 'climax_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `You understand. You're a builder too. I can tell by how you think. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.

It's terrifying. I'm giving up the salary, the benefits... the green checkmarks.

But I'll never have to click 'Next' again.`,
        altEmotion: 'kindred_liberated'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `You've been helping me see what I couldn't see alone. That's real teaching. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.

It's terrifying. I'm giving up the salary, the benefits... the green checkmarks.

But I'll never have to click 'Next' again.`,
        altEmotion: 'grateful_liberated'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `You cut through the noise. straight to what matters. That's the skill I need to teach. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.

It's terrifying. I'm giving up the salary, the benefits... the green checkmarks.

But I'll never have to click 'Next' again.`,
        altEmotion: 'recognized_liberated'
      }
    ],
    requiredState: {
      lacksGlobalFlags: ['kai_chose_safety']
    },
    choices: [
      {
        choiceId: 'kai_farewell',
        text: "Go build it.",
        voiceVariations: {
          analytical: "The logic is sound. Go build it.",
          helping: "You've got this. Go build it.",
          building: "Start now. Go build it.",
          exploring: "See what happens. Go build it.",
          patience: "When you're ready. Go build it."
        },
        nextNodeId: 'kai_farewell',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['kai_chose_studio'],
        addGlobalFlags: ['kai_arc_complete'],
        thoughtId: 'steady-hand'
      }
    ],
    tags: ['ending', 'kai_arc']
  },

  // ============= BAD ENDING (Resignation) =============
  {
    nodeId: 'kai_bad_ending',
    speaker: 'Kai',
    content: [
      {
        text: `The screen goes dark.

Yeah. You're right. It's too risky. The VP will never approve it.

I'll just... add a bold font to the safety warning. That should be enough.

Thanks for trying.`,
        emotion: 'defeated',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.KAI_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['kai_chose_safety', 'kai_arc_complete'] // Bad ending flag
      }
    ],
    tags: ['ending', 'bad_ending', 'kai_arc']
  },

  // ============= E2-064: KAI'S VULNERABILITY ARC =============
  // "The project that failed inspection"
  {
    nodeId: 'kai_vulnerability_arc',
    speaker: 'Kai',
    content: [
      {
        text: `*They look at the safety manuals, then away.*

There's a reason I obsess over every millimeter. Every warning sign.

Building 7. I designed the safety training for that crew. Forty-two slides. Perfect compliance scores. The inspection passed with flying colors.

*Their voice cracks.*

Three months later, a scaffold collapsed. Miguel Rodriguez, father of two, fell four stories because the harness clip I trained him on... wasn't rated for the angle he was working at.

My training passed inspection. Miguel didn't pass the fall.`,
        emotion: 'devastated',
        microAction: 'Their hands grip the edge of the table.',
        variation_id: 'vulnerability_v1',
        richEffectContext: 'error'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['kai_vulnerability_revealed', 'knows_about_miguel']
      }
    ],
    choices: [
      {
        choiceId: 'vuln_inspection_failure',
        text: "The inspection failed him. Not you.",
        nextNodeId: 'kai_vulnerability_reflection',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'vuln_empathy',
        text: "You carry that weight because you care. That's not guilt—that's integrity.",
        voiceVariations: {
          analytical: "Accountability without power is still valuable. That's integrity.",
          helping: "You care. That's not guilt—that's integrity.",
          building: "That weight fuels better work. That's integrity.",
          exploring: "Now I understand why you do this. That's integrity.",
          patience: "You carry that weight because you care. That's integrity."
        },
        nextNodeId: 'kai_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_silence',
        text: "[Stay silent. This wound is still open.]",
        nextNodeId: 'kai_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'kai_arc', 'emotional_core']
  },
  {
    nodeId: 'kai_vulnerability_reflection',
    speaker: 'Kai',
    content: [
      {
        text: `*They take a shaky breath.*

I visited his family. Couldn't tell them I was the one who trained him. Just said I was sorry.

That's when I stopped building "passing" training. Started building training that actually prepares people for real danger. Not inspection-ready. Reality-ready.

*A pause.*

You're the first person I've told the whole story to. Everyone else just sees the compliance evangelist. They don't see why.`,
        emotion: 'vulnerable_resolved',
        variation_id: 'reflection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'kai_farewell',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'kai_arc']
  },
  {
    nodeId: 'kai_farewell',
    speaker: 'Kai',
    content: [
      {
        text: `You helped me stop lying to myself.

Before I go—I've laid all my cards out. What about you? What are you building? What connection matters most?`,
        emotion: 'curious_engaged',
        variation_id: 'farewell_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `You helped me stop lying to myself.

Between us... you're a builder. I recognized that the moment you started thinking in systems. What are you building next?`,
        altEmotion: 'kindred_curious'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `You helped me stop lying to myself.

Between us... you care deeply about people. I saw it in every question you asked. What impact do you want to have?`,
        altEmotion: 'grateful_curious'
      }
    ],
    choices: [
      {
        choiceId: 'kai_asks_before_leave',
        text: "I'll tell you what I'm building...",
        nextNodeId: 'kai_asks_player',
        pattern: 'helping',
        skills: ['communication', 'curiosity']
      },
      {
        choiceId: 'return_to_samuel_kai',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.KAI_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'kai_arc']
  },
  // ============= RECIPROCITY: KAI ASKS PLAYER =============
  {
    nodeId: 'kai_asks_player',
    speaker: 'Kai',
    content: [
      {
        text: `*Looks at you directly.*

I've been building training for years. Thousands of slides. Millions of checkmarks.

Between us. I've shared my whole journey. Now I want to hear yours. What are you building? What connection are you trying to create?`,
        emotion: 'curious_engaged',
        variation_id: 'kai_reciprocity_v1'
      }
    ],
    choices: [
      {
        choiceId: 'player_building_helping',
        text: "Depth. Real conversations that change something. One person at a time, but done right.",
        nextNodeId: 'kai_reciprocity_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'player_building_systems',
        text: "Reach. Finding ways to help more people. Still figuring out how to scale without losing the soul.",
        nextNodeId: 'kai_reciprocity_response',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'systemsThinking'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'player_building_understanding',
        text: "Understanding. How people actually learn. What makes change stick versus slide off.",
        nextNodeId: 'kai_reciprocity_response',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'criticalThinking']
      },
      {
        choiceId: 'player_still_figuring',
        text: "Figuring that out. That's why I'm here. To stop lying to myself about what I'm actually doing.",
        nextNodeId: 'kai_reciprocity_response',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'kai',
          trustChange: 3
        }
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'kai_arc']
  },
  {
    nodeId: 'kai_reciprocity_response',
    speaker: 'Kai',
    content: [
      {
        text: `
        
That's it. That's the question.

Keep asking it. Keep building. Even if you don't know what it is yet.

If you see Samuel... tell him I'm done with compliance. I'm in the business of reality now.`,
        emotion: 'affirming',
        variation_id: 'kai_response_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_kai_after',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.KAI_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['reciprocity', 'kai_arc']
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'kai_career_reflection_safety',
    speaker: 'Kai',
    content: [
      {
        text: `The way you think... analytical, caring, patient. All three at once.

Safety engineers need exactly that combination. They design systems that protect people before danger arrives. Thinking ahead so others don't have to.

It's not about compliance. It's about prevention. You get that.`,
        emotion: 'serious',
        variation_id: 'career_safety_v1'
      }
    ],
    requiredState: {
      patterns: {
        analytical: { min: 4 },
        helping: { min: 4 },
        patience: { min: 3 }
      }
    },
    onEnter: [
      {
        characterId: 'kai',
        addGlobalFlags: ['combo_safety_designer_achieved', 'kai_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'kai_career_safety_continue',
        text: "Prevention over reaction. That's what matters.",
        nextNodeId: 'kai_introduction',
        pattern: 'helping'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'safety']
  }
]

export const kaiEntryPoints = {
  INTRODUCTION: 'kai_introduction'
} as const

export const kaiDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(kaiDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: kaiEntryPoints.INTRODUCTION,
  metadata: {
    title: "Kai's Studio",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: kaiDialogueNodes.length,
    totalChoices: kaiDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}