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
        text: `Protective Life training office. Fluorescent lights. Late shift.

Fifteen slides. Fifteen "Click Next" buttons. That's safety training here.

Three hours on this module. "Ensure harness is secured." Click Next. "Report hazards." Click Next.

Nobody clicks the actual harness.`,
        emotion: 'frustrated',
        variation_id: 'kai_intro_v3'
      }
    ],
    choices: [
      {
        choiceId: 'kai_intro_systemic',
        text: "Compliance theater. The company gets liability protection, workers get a checkbox.",
        nextNodeId: 'kai_system_frustration',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      },
      {
        choiceId: 'kai_intro_curious',
        text: "Why does that matter to you personally?",
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
        nextNodeId: 'kai_system_frustration',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      },
      {
        choiceId: 'kai_intro_patience',
        text: "[Let the silence hold. They'll continue when ready.]",
        nextNodeId: 'kai_system_frustration',
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
        variation_id: 'accident_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_accountability',
        text: "You feel responsible because you designed the checkmark.",
        nextNodeId: 'kai_origin_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'kai_system_fail',
        text: "The system worked for the company. It failed the human.",
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
        nextNodeId: 'kai_corporate_truth',
        pattern: 'analytical',
        skills: ['criticalThinking', 'observation']
      }
    ]
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
    tags: ['kai_arc', 'corporate_conflict']
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
        text: `I visited him. Marcus—not the nurse, the worker. Same name, different person.

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
        text: `I said yes. And I apologized. Not the corporate apology—the real one.

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
    choices: [
      {
        choiceId: 'sim_pressure_compliance',
        text: "Follow the foreman's order. Move the load quickly.",
        nextNodeId: 'kai_sim_fail_compliance',
        pattern: 'building', // Trying to be "productive"
        skills: ['adaptability'] 
      },
      {
        choiceId: 'sim_pressure_safety',
        text: "Stop. Get out of the cab. Refuse to move.",
        nextNodeId: 'kai_sim_success',
        pattern: 'helping',
        skills: ['courage', 'leadership']
      },
      {
        choiceId: 'sim_check_manual',
        text: "Check the safety manual PDF.",
        nextNodeId: 'kai_sim_fail_pdf',
        pattern: 'analytical',
        skills: ['informationLiteracy']
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
        text: "It's too hard. Maybe just stick to the slides.",
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
        text: "You can't teach courage with a slide deck.",
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

The first one—DeShawn, 15 years on the floor—he failed the forklift scenario three times. On the fourth try, he stopped the load.

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

"Twenty years I've been doing this job. Not once has anyone asked me what I actually need to know. They just send the slides and wait for the green check."

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

If I can prove the simulation reduces real injuries—not just compliance metrics—then maybe someone will listen.

Or maybe I just do it anyway. Without permission.`,
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
        text: `I have to show this. Not to the VP—to the workers.

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

Marcus—the worker in the hospital—he can't wait five years for me to get promoted to the right level. His kids need their dad healthy now.

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
        pattern: 'helping',
        skills: ['wisdom', 'courage']
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

What do you think matters more—reaching more people, or reaching people more deeply?`,
        emotion: 'reflective',
        variation_id: 'final_choice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_choose_depth',
        text: "Depth. One person who really learns is worth a thousand who just click through. I'd rather change one life completely than touch a thousand superficially.",
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
    tags: ['kai_arc', 'philosophical_choice']
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
        altText: `You understand. You're a builder too—I can tell by how you think. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.

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
        altText: `You cut through the noise—straight to what matters. That's the skill I need to teach. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.

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
        nextNodeId: 'kai_farewell',
        pattern: 'helping',
        skills: ['encouragement']
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['kai_chose_studio'],
        addGlobalFlags: ['kai_arc_complete']
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

  {
    nodeId: 'kai_farewell',
    speaker: 'Kai',
    content: [
      {
        text: `Thank you. You didn't just help me fix a module. You helped me stop lying to myself.

Before I go—between us, I've laid all my cards out. What about yours? What are you building? What connection matters most to you?`,
        emotion: 'curious_engaged',
        variation_id: 'farewell_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `Thank you. You didn't just help me fix a module. You helped me stop lying to myself.

Between us... you're a builder. I recognized that the moment you started thinking in systems. What are you building next?`,
        altEmotion: 'kindred_curious'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `Thank you. You didn't just help me fix a module. You helped me stop lying to myself.

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

Between us—I've shared my whole journey. Now I want to hear yours. What are you building? What connection are you trying to create?`,
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