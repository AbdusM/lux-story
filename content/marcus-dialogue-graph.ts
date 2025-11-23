/**
 * Marcus's Dialogue Graph
 * The High-Stakes Operator - Platform 4 (Medical Tech)
 *
 * CHARACTER: The Cardiothoracic Specialist
 * Core Conflict: The weight of holding a life in a machine vs. the precision of engineering
 * Arc: From "just a nurse" to recognizing the technical mastery of life-support systems
 * Mechanic: "The Simulation" - A text-based "VR" experience of an ECMO procedure
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const marcusDialogueNodes: DialogueNode[] = [
  // ... [INTRODUCTION NODES SAME AS BEFORE UNTIL SIMULATION] ...
  // ============= INTRODUCTION =============
  {
    nodeId: 'marcus_introduction',
    speaker: 'Marcus',
    content: [
      {
        text: `*He's staring at his hands, holding them perfectly still in the air. His breathing is shallow, controlled.*

Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable.

*He blinks, looking at you.*

Don't bump the table. Please.`,
        emotion: 'focused_tense',
        variation_id: 'marcus_intro_v1',
        richEffectContext: 'warning' // High tension
      }
    ],
    choices: [
      {
        choiceId: 'marcus_intro_sorry',
        text: "*Step back carefully* I won't touch anything.",
        nextNodeId: 'marcus_visualizes_machine',
        pattern: 'patience',
        skills: ['adaptability', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_intro_curious',
        text: "What are you seeing right now?",
        nextNodeId: 'marcus_visualizes_machine',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'marcus_intro_check',
        text: "You look like you're holding something invisible.",
        nextNodeId: 'marcus_visualizes_machine',
        pattern: 'analytical',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'marcus_arc']
  },

  {
    nodeId: 'marcus_visualizes_machine',
    speaker: 'Marcus',
    content: [
      {
        text: `I'm holding a life. Well, the machine that holds the life.

ECMO. Extracorporeal Membrane Oxygenation. It pulls blood out, oxygenates it, warms it, and pumps it back in.

For the last twelve hours, I was the only thing keeping a 40-year-old father alive while his heart waited for a transplant.`,
        emotion: 'exhausted_proud',
        variation_id: 'visualizes_machine_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_high_stakes',
        text: "That sounds incredibly high-stakes.",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'marcus_machine_mechanics',
        text: "You run the machine yourself?",
        nextNodeId: 'marcus_technical_pride',
        pattern: 'analytical',
        skills: ['criticalThinking', 'digitalLiteracy']
      }
    ]
  },

  {
    nodeId: 'marcus_technical_pride',
    speaker: 'Marcus',
    content: [
      {
        text: `Me and the machine. We're a loop. I watch the flow dynamics, the hemolysis numbers, the clot risks.

People think nursing is just... comforting. And it is. But in the CVICU (Cardiovascular Intensive Care Unit), it's engineering. Fluid dynamics. Pressure regulation.

If I calculate the heparin drip wrong, he bleeds out. If I miss a clot, he strokes out.`,
        emotion: 'proud',
        variation_id: 'technical_pride_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_engineering_mindset',
        text: "You think like an engineer.",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_heavy_burden',
        text: "That's a terrifying amount of responsibility.",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= THE INCIDENT: THE AIR BUBBLE =============
  {
    nodeId: 'marcus_the_bubble',
    speaker: 'Marcus',
    content: [
      {
        text: `But the real enemy? Air.

One bubble. One tiny pocket of air in the return line. If it hits his brain? Stroke. If it hits his heart? Vapor lock. Death.

Instant.

Tonight... the alarm screamed. 'AIR IN LINE.'`,
        emotion: 'tense',
        variation_id: 'the_bubble_v1',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'marcus_what_did_you_do',
        text: "What did you do?",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'exploring',
        skills: ['problemSolving']
      },
      {
        choiceId: 'marcus_panic_check',
        text: "Did you panic?",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= THE SIMULATION (Updated: Character Narrates System) =============
  {
    nodeId: 'marcus_simulation_start',
    speaker: 'Marcus',
    content: [
      {
        text: `I didn't think. I just moved. 

I want you to see it. Close your eyes. Put your hands out.

*He guides your hands into position. The air around you seems to hum with machinery.*

*Marcus's voice becomes tight, mechanical.*

"Monitor is screaming. Red strobe. Oxygen saturation dropping. 98... 95... 92. The bubble detector is flashing. It sees air in the arterial line."`,
        emotion: 'clinical_simulation',
        variation_id: 'sim_start_v2',
        richEffectContext: 'warning' // Simulation UI feel
      }
    ],
    choices: [
      {
        choiceId: 'sim_clamp_line',
        text: "[ACTION] CLAMP THE LINE immediately to stop flow.",
        nextNodeId: 'marcus_sim_step_2',
        pattern: 'building',
        skills: ['problemSolving', 'criticalThinking']
      },
      {
        choiceId: 'sim_call_help',
        text: "[ACTION] Yell for the surgeon.",
        nextNodeId: 'marcus_sim_fail_slow',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['simulation', 'marcus_arc', 'interactive_episode']
  },

  {
    nodeId: 'marcus_sim_fail_slow',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus shakes his head, dropping his hands.*

"Too slow. By the time the surgeon turned around, the bubble traveled 40cm. It hit the patient's carotid artery."

*He looks at you, eyes haunted.*

"Flatline. Asystole. He's gone. You have 1.5 seconds. You can't wait for permission."`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_v2',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_sim',
        text: "Reset. Let me try again.",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'patience',
        skills: ['adaptability', 'emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'marcus_sim_step_2',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus nods. He mimes clamping a heavy tubing.*

"Good. Flow stopped. But look at the patient map."

*He points to the invisible monitor.*

"Blood pressure crashing. He has no flow. You clamped his life support. The bubble is trapped right before the cannula."

"What do you do?"`,
        emotion: 'clinical_simulation',
        variation_id: 'sim_step_2_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'sim_flick_line',
        text: "[ACTION] Flick the tubing to dislodge the bubble back to the port.",
        nextNodeId: 'marcus_sim_step_3',
        pattern: 'building',
        skills: ['digitalLiteracy', 'problemSolving']
      },
      {
        choiceId: 'sim_unclamp',
        text: "[ACTION] Unclamp. He needs blood flow!",
        nextNodeId: 'marcus_sim_fail_air',
        pattern: 'helping',
        skills: ['emotionalIntelligence'] // Good intention, bad outcome
      }
    ],
    tags: ['simulation', 'marcus_arc']
  },

  {
    nodeId: 'marcus_sim_fail_air',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus winces.*

"You unclamped. I saw the bubble enter the cannula. It's in him now."

*He looks down at his hands.*

"Vapor lock. Massive stroke. He's gone. You saved the flow, but you delivered the poison. Precision matters more than speed."`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_air_v2',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_sim_2',
        text: "Reset. I understand now.",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'analytical',
        skills: ['adaptability']
      }
    ]
  },

  {
    nodeId: 'marcus_sim_step_3',
    speaker: 'Marcus',
    content: [
      {
        text: `*He mimics flicking the line. Hard.*

"Bubble isolated. It's at the access port. You have a syringe."

"Patient O2 is dropping. 88... 85... 82..."

"He's becoming hypoxic. You have seconds."`,
        emotion: 'clinical_simulation',
        variation_id: 'sim_step_3_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'sim_aspirate',
        text: "[ACTION] Aspirate (suck out) the bubble with the syringe.",
        nextNodeId: 'marcus_sim_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'digitalLiteracy']
      },
      {
        choiceId: 'sim_push_fluid',
        text: "[ACTION] Push saline into the port.",
        nextNodeId: 'marcus_sim_fail_push',
        pattern: 'building',
        skills: ['creativity'] // Creative but wrong
      }
    ],
    tags: ['simulation', 'marcus_arc']
  },

  {
    nodeId: 'marcus_sim_fail_push',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus sighs, a heavy sound.*

"You pushed against the pressure. You just drove the bubble further down the line."

"Now it's impossible to retrieve. We have to change the whole circuit. He won't survive the changeover time."

"It's over."`,
        emotion: 'critical_failure',
        variation_id: 'sim_fail_push_v2',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_sim_3',
        text: "One more time. I can do this.",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'patience',
        skills: ['adaptability', 'emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'marcus_sim_success',
    speaker: 'Marcus',
    content: [
      {
        text: `*The hum of the machine seems to settle into a steady rhythm.*

"System stable. Patient O2 rising... 98%."

*Marcus opens his eyes. He looks exhausted but alive.*

"You got it. Clean line. Flow restored. He wakes up tomorrow."`,
        emotion: 'relieved_triumphant',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_post_sim_reaction',
        text: "That was... intense.",
        nextNodeId: 'marcus_career_bridge',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'marcus_post_sim_tech',
        text: "The precision required... that's engineering.",
        nextNodeId: 'marcus_career_bridge',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['completed_ecmo_simulation'],
        addGlobalFlags: ['marcus_sim_complete']
      }
    ],
    tags: ['simulation_complete', 'marcus_arc']
  },

  // ... [CAREER BRIDGE & ENDING - UNCHANGED] ...
  {
    nodeId: 'marcus_career_bridge',
    speaker: 'Marcus',
    content: [
      {
        text: `That's the job. It's not just 'caring.' It's technical mastery.

There's a whole world of this. Perfusionists run these machines in surgery. Biomedical engineers design them so they don't trap air in the first place. Healthcare software devs write the code that screams 'AIR IN LINE.'

I started as a nurse. But now? I'm thinking about designing the next machine.`,
        emotion: 'inspired',
        variation_id: 'career_bridge_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_biomed_path',
        text: "You'd be amazing at designing them. You know exactly how they fail.",
        nextNodeId: 'marcus_farewell',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'marcus_perfusion_path',
        text: "The operating room needs people like you running the console.",
        nextNodeId: 'marcus_farewell',
        pattern: 'helping',
        skills: ['adaptability'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['career_bridge', 'marcus_arc']
  },

  {
    nodeId: 'marcus_farewell',
    speaker: 'Marcus',
    content: [
      {
        text: `Thanks. It felt good to walk someone else through it. Makes the weight a little lighter.

If you see Samuel... tell him the patient made it. The machine held.`,
        emotion: 'grateful',
        variation_id: 'farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel',
        text: "I'll tell him.",
        nextNodeId: samuelEntryPoints.MARCUS_REFLECTION_GATEWAY,
        pattern: 'patience'
      },
      {
        choiceId: 'marcus_ask_about_teaching',
        text: "Have you thought about teaching others what you know?",
        nextNodeId: 'marcus_phase2_entry',
        pattern: 'building',
        skills: ['leadership', 'communication'],
        visibleCondition: {
          hasGlobalFlags: ['marcus_arc_complete']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['completed_arc'],
        addGlobalFlags: ['marcus_arc_complete']
      }
    ],
    tags: ['ending', 'marcus_arc']
  },

  // ============= PHASE 2: CRISIS MANAGEMENT & MENTORSHIP =============
  {
    nodeId: 'marcus_phase2_entry',
    speaker: 'Marcus',
    content: [
      {
        text: `*Three days later. Marcus is at the ECMO console again, but this time he's not alone.*

*A young specialist in fresh scrubs stands next to him, eyes wide, hands trembling slightly.*

This is Jordan. New to the CVICU. I'm supposed to show them the ropes.

*Marcus glances at you, then back at the machine.*

Funny you ask about teaching. I'm about to find out if I'm any good at it.`,
        emotion: 'focused',
        variation_id: 'p2_entry_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_jordan_intro',
        text: "*Nod to Jordan* First day on ECMO?",
        nextNodeId: 'marcus_p2_jordan_nervous',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'p2_marcus_check',
        text: "How's it feel being on the other side?",
        nextNodeId: 'marcus_p2_jordan_nervous',
        pattern: 'analytical',
        skills: ['emotionalIntelligence']
      }
    ],
    requiredState: {
      hasGlobalFlags: ['marcus_arc_complete']
    },
    tags: ['phase2', 'marcus_arc', 'mentorship']
  },

  {
    nodeId: 'marcus_p2_jordan_nervous',
    speaker: 'Jordan',
    content: [
      {
        text: `*Jordan swallows hard.*

First week, actually. I've read the manuals. Watched the videos. But standing here next to the real thing...

*They gesture at the ECMO circuit - tubes thick as garden hoses, pump humming steadily.*

There's a person's blood in those lines. Their entire circulatory system running through that machine.

*Voice drops to almost a whisper.*

What if I mess up?`,
        emotion: 'anxious',
        variation_id: 'jordan_nervous_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_jordan_reassure',
        text: "You'll learn. Marcus is a great teacher.",
        nextNodeId: 'marcus_p2_teaching_moment',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'p2_jordan_real_talk',
        text: "The stakes are high. But that's why the training matters.",
        nextNodeId: 'marcus_p2_teaching_moment',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['phase2', 'marcus_arc']
  },

  {
    nodeId: 'marcus_p2_teaching_moment',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus looks at Jordan, then at the machine, then back.*

Okay. Let's start simple. See that number? Flow rate. It tells you how many liters per minute the pump is moving.

*He points to the display.*

Normal cardiac output is 4 to 8 liters per minute. We're running at 4.5 right now for this patient because—

*Suddenly, a sharp BEEP. An alert flashes on the console: CRITICAL SYSTEM MESSAGE.*

*Marcus's phone buzzes. He glances at it, and his expression goes dark.*`,
        emotion: 'tense',
        variation_id: 'teaching_interrupted_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'p2_whats_wrong',
        text: "What's the alert?",
        nextNodeId: 'marcus_p2_equipment_crisis',
        pattern: 'exploring',
        skills: ['problemSolving']
      },
      {
        choiceId: 'p2_stay_calm',
        text: "*Keep voice steady* Talk us through it.",
        nextNodeId: 'marcus_p2_equipment_crisis',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership']
      }
    ],
    tags: ['phase2', 'marcus_arc']
  },

  {
    nodeId: 'marcus_p2_equipment_crisis',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus reads the message aloud, voice tight.*

"Equipment allocation crisis. Three ECMO machines available. Five patients requiring ECMO support within next 6 hours. Triage committee convening. Senior specialists to standby for recommendations."

*He looks at Jordan, whose face has gone pale.*

*Then to you.*

Three machines. Five patients. Someone's not getting one.

*The weight of it hangs in the air like smoke.*

And they want my recommendation on who.`,
        emotion: 'heavy',
        variation_id: 'crisis_announcement_v1',
        richEffectContext: 'error',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_medical_criteria',
        text: "It has to be based on medical criteria, right?",
        nextNodeId: 'marcus_p2_cases_review',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'p2_impossible_choice',
        text: "How do you even make that choice?",
        nextNodeId: 'marcus_p2_cases_review',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['aware_of_crisis']
      }
    ],
    tags: ['phase2', 'marcus_arc', 'crisis']
  },

  {
    nodeId: 'marcus_p2_cases_review',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus pulls up a tablet, hands it to you.*

Here are the five cases. All critical. All need ECMO.

**Patient A**: 45, heart failure, on transplant list, stable for now.
**Patient B**: 28, motorcycle accident, severe lung damage, deteriorating fast.
**Patient C**: 67, post-surgery complications, high mortality risk even with ECMO.
**Patient D**: 52, COVID complications, showing slight improvement.
**Patient E**: 19, sudden cardiac event, cause unknown, very unstable.

*Jordan is frozen, staring at the list.*

*Marcus looks at you.*

The committee will want data. Survival probability. Resource utilization. But...

*He trails off.*`,
        emotion: 'conflicted',
        variation_id: 'cases_review_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_survival_focus',
        text: "Focus on who has the best chance of surviving.",
        nextNodeId: 'marcus_p2_framework_survival',
        pattern: 'analytical',
        skills: ['criticalThinking', 'informationLiteracy']
      },
      {
        choiceId: 'p2_years_focus',
        text: "Consider years of life remaining. Patient E is only 19.",
        nextNodeId: 'marcus_p2_framework_years',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'integrity']
      },
      {
        choiceId: 'p2_holistic',
        text: "It needs to be holistic - medical and human factors.",
        nextNodeId: 'marcus_p2_framework_holistic',
        pattern: 'building',
        skills: ['systemsThinking', 'leadership']
      }
    ],
    tags: ['phase2', 'marcus_arc', 'triage']
  },

  {
    nodeId: 'marcus_p2_framework_survival',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus nods slowly.*

Survival probability. That's the cleanest metric. Evidence-based.

Patient C has a 30% survival rate even with ECMO. Patient D is improving without it.

That would prioritize A, B, and E.

*He looks down.*

Patient C has grandchildren visiting every day. Patient D is a single parent with three kids under 10.

*His jaw tightens.*

The data says one thing. The humans say another.`,
        emotion: 'conflicted',
        variation_id: 'framework_survival_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_stick_to_data',
        text: "The data has to guide the decision. It's objective.",
        nextNodeId: 'marcus_p2_jordan_question',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          addKnowledgeFlags: ['chose_data_driven']
        }
      },
      {
        choiceId: 'p2_human_factors',
        text: "The human context matters too. This isn't just numbers.",
        nextNodeId: 'marcus_p2_jordan_question',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          addKnowledgeFlags: ['chose_holistic']
        }
      }
    ],
    tags: ['phase2', 'marcus_arc']
  },

  {
    nodeId: 'marcus_p2_framework_years',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus looks at Patient E's file.*

Nineteen years old. Entire life ahead of them.

But Patient E's cardiac event has an unknown cause. Could happen again. High risk of complications.

Patient B - the 28-year-old from the motorcycle accident - has reversible lung damage. Clear path to recovery.

*He rubs his temples.*

Years of life is one metric. Quality of those years is another. And who are we to decide whose future is worth more?`,
        emotion: 'heavy',
        variation_id: 'framework_years_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_youngest_first',
        text: "Give priority to the youngest patients. It's defensible.",
        nextNodeId: 'marcus_p2_jordan_question',
        pattern: 'helping',
        skills: ['integrity'],
        consequence: {
          characterId: 'marcus',
          addKnowledgeFlags: ['chose_age_based']
        }
      },
      {
        choiceId: 'p2_recovery_path',
        text: "Focus on clearest path to recovery, regardless of age.",
        nextNodeId: 'marcus_p2_jordan_question',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          addKnowledgeFlags: ['chose_recovery_path']
        }
      }
    ],
    tags: ['phase2', 'marcus_arc']
  },

  {
    nodeId: 'marcus_p2_framework_holistic',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus sets down the tablet.*

You're right. This isn't just a math problem.

Medical criteria: survival probability, reversibility, resource utilization.

Human factors: family impact, quality of life, patient values.

System factors: bed availability, staffing, follow-up care capacity.

*He pulls out a notebook, starts sketching a decision matrix.*

We build a framework. Weight each factor. Score each patient. At least then the process is transparent.

*He looks up.*

Still doesn't make it easier. But it makes it defensible.`,
        emotion: 'focused',
        variation_id: 'framework_holistic_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_build_matrix',
        text: "Let's build the matrix. Make it systematic.",
        nextNodeId: 'marcus_p2_jordan_question',
        pattern: 'building',
        skills: ['systemsThinking', 'problemSolving'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2,
          addKnowledgeFlags: ['chose_systematic']
        }
      },
      {
        choiceId: 'p2_trust_judgment',
        text: "The framework helps, but you still have to use judgment.",
        nextNodeId: 'marcus_p2_jordan_question',
        pattern: 'patience',
        skills: ['leadership', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1,
          addKnowledgeFlags: ['chose_balanced']
        }
      }
    ],
    tags: ['phase2', 'marcus_arc']
  },

  {
    nodeId: 'marcus_p2_jordan_question',
    speaker: 'Jordan',
    content: [
      {
        text: `*Jordan has been silent this whole time, just listening. Now they speak, voice shaking.*

Marcus... how do you live with this?

I came into medicine to help people. To save lives.

*They gesture at the tablet.*

But this? Choosing who gets the machine and who doesn't... that's choosing who lives.

How do you make that choice and then go home and sleep at night?`,
        emotion: 'distressed',
        variation_id: 'jordan_question_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_marcus_answer_honest',
        text: "*Look to Marcus* That's a fair question.",
        nextNodeId: 'marcus_p2_teaching_burden',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'p2_marcus_answer_redirect',
        text: "Marcus, how do you teach someone to carry this weight?",
        nextNodeId: 'marcus_p2_teaching_burden',
        pattern: 'exploring',
        skills: ['communication', 'leadership']
      }
    ],
    tags: ['phase2', 'marcus_arc', 'mentorship']
  },

  {
    nodeId: 'marcus_p2_teaching_burden',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus is quiet for a long moment. When he speaks, his voice is softer.*

Jordan, you don't sleep well. Not at first. Maybe not ever.

But here's what I learned: You're not choosing who lives. You're doing triage with limited resources. There's a difference.

*He picks up the tablet again.*

If we had five machines, all five patients would get them. The shortage isn't your fault. The disease isn't your fault. The accident isn't your fault.

What IS your responsibility is making the best decision you can with the information you have.

*He looks at Jordan directly.*

You document your reasoning. You consult with colleagues. You follow ethical principles. And then you decide.

And yeah, it weighs on you. But that weight? That's what keeps you honest. The day it doesn't bother you anymore is the day you should quit.`,
        emotion: 'mentor',
        variation_id: 'teaching_burden_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_good_answer',
        text: "*To Jordan* That's wisdom you can't get from a textbook.",
        nextNodeId: 'marcus_p2_ethics_decision',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'p2_systematic_approach',
        text: "The systematic approach helps carry that burden.",
        nextNodeId: 'marcus_p2_ethics_decision',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    tags: ['phase2', 'marcus_arc', 'mentorship']
  },

  {
    nodeId: 'marcus_p2_ethics_decision',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus checks his phone.*

The committee meets in 30 minutes. I need to present my recommendations.

*He pauses.*

Protocol says I should involve the ethics committee for allocation decisions. They'd provide oversight, spread the responsibility.

But they're already backlogged with other cases. By the time they review and deliberate, Patient B might deteriorate beyond the point where ECMO would help.

*He looks conflicted.*

Medical decision now, or shared ethical decision later?`,
        emotion: 'pressured',
        variation_id: 'ethics_decision_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_wait_for_ethics',
        text: "Wait for the ethics committee. This is too important to rush.",
        nextNodeId: 'marcus_p2_communication',
        pattern: 'patience',
        skills: ['integrity', 'collaboration'],
        consequence: {
          characterId: 'marcus',
          addKnowledgeFlags: ['chose_ethics_committee']
        }
      },
      {
        choiceId: 'p2_make_call',
        text: "Make the call based on medical criteria. You can defend it.",
        nextNodeId: 'marcus_p2_communication',
        pattern: 'building',
        skills: ['leadership', 'actionOrientation'],
        consequence: {
          characterId: 'marcus',
          addKnowledgeFlags: ['chose_medical_decision']
        }
      }
    ],
    tags: ['phase2', 'marcus_arc', 'crisis']
  },

  {
    nodeId: 'marcus_p2_communication',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus takes a deep breath.*

Okay. Decision framework is set. Now comes the harder part.

*He looks at the patient list.*

Families. They're all in the waiting room right now. Five families who don't know yet that they're in competition for three machines.

How do I communicate this? Full transparency - "I'm sorry, but resources are limited"?

Or frame it more gently - focus on the clinical picture without mentioning the shortage?

*His voice drops.*

What's more ethical: the harsh truth, or protecting them from the machinery of triage?`,
        emotion: 'conflicted',
        variation_id: 'communication_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_full_transparency',
        text: "Be transparent. They deserve to know the full situation.",
        nextNodeId: 'marcus_p2_resolution',
        pattern: 'analytical',
        skills: ['communication', 'integrity'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1,
          addKnowledgeFlags: ['chose_transparency']
        }
      },
      {
        choiceId: 'p2_gentle_framing',
        text: "Frame it around clinical needs. Spare them the triage details.",
        nextNodeId: 'marcus_p2_resolution',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'marcus',
          addKnowledgeFlags: ['chose_gentle_approach']
        }
      }
    ],
    tags: ['phase2', 'marcus_arc']
  },

  {
    nodeId: 'marcus_p2_resolution',
    speaker: 'Marcus',
    content: [
      {
        text: `*Two hours later.*

*Marcus comes back, looking exhausted but composed.*

Machines allocated. Patients A, B, and E got them.

Patient D improved enough that they're managing without ECMO for now. Patient C... family decided on comfort care. They'd been considering it anyway.

*He sits down heavily.*

No one died because of my recommendation. But that's luck as much as judgment.

*He looks at Jordan, who's been observing everything.*

Still want to work in the CVICU?`,
        emotion: 'exhausted_relieved',
        variation_id: 'resolution_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_jordan_responds',
        text: "*Wait for Jordan's answer*",
        nextNodeId: 'marcus_p2_jordan_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['crisis_resolved']
      }
    ],
    tags: ['phase2', 'marcus_arc', 'resolution']
  },

  {
    nodeId: 'marcus_p2_jordan_reflection',
    speaker: 'Jordan',
    content: [
      {
        text: `*Jordan nods slowly.*

Yeah. I do.

Because if someone has to make these decisions... it should be someone who loses sleep over them.

*They look at the ECMO machine, then back at Marcus.*

Teach me. Not just the technical stuff. All of it.

The weight. The framework. How to carry it.`,
        emotion: 'determined',
        variation_id: 'jordan_reflection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_final_teaching',
        text: "*To Marcus* Looks like you're a natural teacher after all.",
        nextNodeId: 'marcus_p2_complete',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'p2_proud_moment',
        text: "Jordan's going to be a great specialist.",
        nextNodeId: 'marcus_p2_complete',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    tags: ['phase2', 'marcus_arc', 'mentorship']
  },

  {
    nodeId: 'marcus_p2_complete',
    speaker: 'Marcus',
    content: [
      {
        text: `*Marcus almost smiles.*

Yeah. Maybe I am.

*He stands, stretches.*

You know what? I was thinking about equipment design before. Making machines that don't trap air bubbles.

But maybe there's another way to improve the system: teaching the next generation to think critically about these machines. About the decisions around them.

*He puts a hand on Jordan's shoulder.*

Same patient. Different kind of impact.

*He looks at you.*

Thanks. For helping me figure that out.`,
        emotion: 'grateful_inspired',
        variation_id: 'p2_complete_v1'
      }
    ],
    choices: [
      {
        choiceId: 'p2_return_to_samuel',
        text: "Samuel will want to hear about this.",
        nextNodeId: samuelEntryPoints.MARCUS_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['completed_phase2', 'mentor_identified'],
        addGlobalFlags: ['marcus_phase2_complete']
      }
    ],
    tags: ['phase2_complete', 'marcus_arc', 'mentorship']
  }
]

// Export entry points
export const marcusEntryPoints = {
  INTRODUCTION: 'marcus_introduction',
  SIMULATION_START: 'marcus_simulation_start',
  PHASE2_ENTRY: 'marcus_phase2_entry'
} as const

export const marcusDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(marcusDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: marcusEntryPoints.INTRODUCTION,
  metadata: {
    title: "Marcus's Circuit",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: marcusDialogueNodes.length,
    totalChoices: marcusDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}