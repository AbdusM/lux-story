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
        text: `Seventy-two beats. Flow rate stable.

...Don't bump the table.`,
        emotion: 'focused_tense',
        interaction: 'shake',
        variation_id: 'marcus_intro_v1',
        richEffectContext: 'warning', // High tension

        // TODO: [SFX] Faint heart monitor beeping in background
        // TODO: [VFX] Marcus's hands glow/shimmer when speaking (medical visualization)
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
        text: `I'm holding a life. The machine that holds the life.

ECMO. Pulls blood out, adds oxygen, pumps it back in.

Twelve hours. Just me and the machine. Keeping a father alive.`,
        emotion: 'exhausted',
        interaction: 'small',
        variation_id: 'visualizes_machine_v1',

        // TODO: [SFX] Subtle mechanical hum (ECMO machine sound)
        // TODO: [VFX] Soft glow effect on "ECMO" - educational highlight
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
        text: `Me and the machine. We're a loop.

Flow dynamics. Hemolysis. Clot risks.

CVICU isn't just comfort. It's engineering.

Wrong heparin calc? He bleeds. Missed clot? Stroke.`,
        emotion: 'proud',
        interaction: 'nod',
        variation_id: 'technical_pride_v1',

        // TODO: [SFX] Soft beeping (medical equipment ambience)
        // TODO: [VFX] Technical terms glow subtly for educational emphasis
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
        text: `The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|<shake>'AIR IN LINE.'</shake>`,
        emotion: 'critical',
        // NOTE: Removed node-level 'shake' - using inline targeting for precision
        variation_id: 'the_bubble_v1',
        richEffectContext: 'warning',
        useChatPacing: true,

        // TODO: [SFX] Sharp alarm sound on "AIR IN LINE"
        // TODO: [VFX] Screen flash red on final line
        // TODO: [SFX] Urgent beeping escalates throughout
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
        text: `I didn't think. Just moved.|Close your eyes. Hands out.|*Guides your hands into position*|Monitor screaming. Red strobe.|O2 dropping: 98... 95... 92.|Bubble detector flashing.|Air in the arterial line.`,
        emotion: 'clinical',
        interaction: 'shake',
        variation_id: 'sim_start_v2',
        richEffectContext: 'warning',
        useChatPacing: true,

        // TODO: [SFX] Alarm escalating with each O2 drop
        // TODO: [VFX] Red strobe effect on screen
        // TODO: [SFX] Bubble detector beeping urgently
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
        text: `*Shakes head, drops hands*

Too slow.

Bubble traveled 40cm. Hit the carotid.

Flatline. Asystole. Gone.

1.5 seconds. Can't wait for permission.`,
        emotion: 'critical',
        interaction: 'shake',
        variation_id: 'sim_fail_v2',
        richEffectContext: 'error',

        // TODO: [SFX] Flatline tone on "Asystole"
        // TODO: [VFX] Screen goes dark/red on "Gone"
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
        text: `*Nods, mimes clamping heavy tubing*

Good. Flow stopped.

*Points to invisible monitor*

Blood pressure crashing. No flow. You clamped his life support.

Bubble trapped before the cannula.

What do you do?`,
        emotion: 'clinical',
        interaction: 'nod',
        variation_id: 'sim_step_2_v2',
        richEffectContext: 'warning',

        // TODO: [SFX] BP alarm beeping urgently
        // TODO: [VFX] Pressure gauge visual dropping
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
        text: `*Winces*

You unclamped. Bubble entered the cannula.

It's in him.

*Looks down at hands*

Vapor lock. Massive stroke. Gone.

Saved the flow. Delivered the poison.

Precision over speed.`,
        emotion: 'critical',
        interaction: 'small',
        variation_id: 'sim_fail_air_v2',
        richEffectContext: 'error',

        // TODO: [SFX] Flatline after "Gone"
        // TODO: [VFX] Red fade on screen
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
        text: `*Mimics flicking the line. Hard.*

Bubble isolated. Access port. You have a syringe.

Patient O2 dropping: 88... 85... 82...

Hypoxic. Seconds left.`,
        emotion: 'clinical',
        interaction: 'jitter',
        variation_id: 'sim_step_3_v2',
        richEffectContext: 'warning',

        // TODO: [SFX] O2 alarm escalating
        // TODO: [VFX] O2 numbers flashing red as they drop
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
        text: `*Heavy sigh*

Pushed against pressure. Drove bubble further down.

Impossible to retrieve now. Whole circuit change needed.

Won't survive changeover time.

It's over.`,
        emotion: 'critical',
        interaction: 'small',
        variation_id: 'sim_fail_push_v2',
        richEffectContext: 'error',

        // TODO: [SFX] Flatline
        // TODO: [VFX] Screen darkens
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
        text: `*Machine hum settles to steady rhythm*

System stable. Patient O2 rising... 98%.

*Opens eyes, exhausted but alive*

You got it. Clean line. Flow restored.

He wakes up tomorrow.`,
        emotion: 'relieved',
        interaction: 'bloom',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success',

        // TODO: [SFX] Clean beep tone, steady rhythm
        // TODO: [VFX] Green success glow
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
        text: `That's the job. Not just caring. Technical mastery.

Whole world here. Perfusionists run these in surgery. Biomedical engineers design them bubble-free. Software devs code the alarms.

Started as a nurse.

Now? Designing the next machine.`,
        emotion: 'inspired',
        interaction: 'bloom',
        variation_id: 'career_bridge_v1',

        // TODO: [VFX] Career pathway icons appear subtly (perfusion, biomed, software)
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
        text: `Thanks. Felt good walking you through it.

Makes the weight lighter.

If you see Samuel... tell him the patient made it.

The machine held.`,
        emotion: 'grateful',
        interaction: 'small',
        variation_id: 'farewell_v1',

        // TODO: [SFX] Soft, relieved exhale
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
        text: `*Three days later. ECMO console. Not alone.*|*Young specialist. Fresh scrubs. Wide eyes. Trembling hands.*|This is Jordan. New to CVICU. Showing them the ropes.|*Glances at you*|Funny you asked about teaching.|About to find out if I'm any good.`,
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'p2_entry_v1',
        useChatPacing: true,

        // TODO: [SFX] ECMO machine humming in background
        // TODO: [VFX] Jordan appears nervous (subtle animation)
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
        text: `*Swallows hard*|First week. Read manuals. Watched videos.|But standing here next to the real thing...|*Gestures at ECMO circuit - tubes thick as hoses, pump humming*|Person's blood in those lines. Entire circulatory system.|*Whispers*|What if I mess up?`,
        emotion: 'anxious',
        interaction: 'jitter',
        variation_id: 'jordan_nervous_v1',
        useChatPacing: true,

        // TODO: [SFX] ECMO pump steady hum
        // TODO: [VFX] Jordan's hand trembles slightly
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
        text: `Start simple. See that number? Flow rate.|Liters per minute the pump moves.|Normal cardiac output: 4 to 8. We're at 4.5 because—|*Sharp BEEP*|CRITICAL SYSTEM MESSAGE|*Phone buzzes. Expression darkens.*`,
        emotion: 'focused',
        interaction: 'shake',
        variation_id: 'teaching_interrupted_v1',
        richEffectContext: 'warning',
        useChatPacing: true,

        // TODO: [SFX] Sharp alert beep cutting through
        // TODO: [VFX] Red alert flash on screen
        // TODO: [SFX] Phone vibration
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
        text: `*Reads message. Voice tight.*|"Equipment allocation crisis.|Three ECMO machines. Five patients need ECMO within 6 hours.|Triage committee convening.|Senior specialists standby for recommendations."|*Jordan goes pale.*|Three machines. Five patients.|Someone's not getting one.|They want my recommendation on who.`,
        emotion: 'heavy',
        interaction: 'shake',
        variation_id: 'crisis_announcement_v1',
        richEffectContext: 'error',
        useChatPacing: true,

        // TODO: [SFX] Phone notification sound
        // TODO: [VFX] Screen flash red on "allocation crisis"
        // TODO: [MUSIC] Tension builds
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
        text: `*Pulls up tablet. Hands it over.*|Five cases. All critical. All need ECMO.|**Patient A**: 45, heart failure, transplant list, stable.|**Patient B**: 28, motorcycle accident, lung damage, deteriorating fast.|**Patient C**: 67, post-surgery complications, high mortality even with ECMO.|**Patient D**: 52, COVID complications, slight improvement.|**Patient E**: 19, sudden cardiac event, unknown cause, unstable.|*Jordan frozen. Staring.*|Committee wants data. Survival probability. Resource utilization.|But...`,
        emotion: 'conflicted',
        interaction: 'small',
        variation_id: 'cases_review_v1',

        // TODO: [VFX] Tablet screen glow with patient data
        // TODO: [SFX] Quiet tension ambience
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
        text: `*Nods slowly.*|Survival probability. Cleanest metric. Evidence-based.|Patient C: 30% survival even with ECMO.|Patient D: improving without it.|Prioritizes A, B, E.|*Looks down.*|Patient C has grandchildren visiting daily.|Patient D: single parent, three kids under 10.|*Jaw tightens.*|Data says one thing. Humans say another.`,
        emotion: 'conflicted',
        interaction: 'small',
        variation_id: 'framework_survival_v1',
        useChatPacing: true,

        // TODO: [VFX] Data visualization vs family photos contrast
        // TODO: [SFX] Soft tension music
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
        text: `*Looks at Patient E's file.*|Nineteen years old. Entire life ahead.|But cardiac event unknown cause. Could recur. High complication risk.|Patient B - 28, motorcycle accident - reversible lung damage. Clear recovery path.|*Rubs temples.*|Years of life: one metric. Quality of those years: another.|Who are we to decide whose future is worth more?`,
        emotion: 'heavy',
        interaction: 'small',
        variation_id: 'framework_years_v1',
        useChatPacing: true,

        // TODO: [VFX] Patient files highlighted on screen
        // TODO: [SFX] Quiet ethical tension
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
        text: `*Sets down tablet.*|You're right. Not just math.|Medical criteria: survival probability, reversibility, resource utilization.|Human factors: family impact, quality of life, patient values.|System factors: bed availability, staffing, follow-up capacity.|*Pulls out notebook. Sketches decision matrix.*|Build a framework. Weight factors. Score patients.|Process becomes transparent.|*Looks up.*|Doesn't make it easier. Makes it defensible.`,
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'framework_holistic_v1',
        useChatPacing: true,

        // TODO: [VFX] Decision matrix visualization appearing
        // TODO: [SFX] Pen scratching on paper
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
        text: `*Silent this whole time. Just listening. Now speaks. Voice shaking.*|Marcus... how do you live with this?|Came into medicine to help people. Save lives.|*Gestures at tablet.*|But this? Choosing who gets the machine...|That's choosing who lives.|How do you make that choice and go home and sleep?`,
        emotion: 'anxious',
        interaction: 'jitter',
        variation_id: 'jordan_question_v1',
        useChatPacing: true,

        // TODO: [VFX] Jordan's hands trembling
        // TODO: [SFX] Voice breaks slightly
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
        text: `*Quiet. Long moment. Voice softer.*|Jordan, you don't sleep well. Not at first. Maybe not ever.|But here's what I learned:|You're not choosing who lives. You're doing triage with limited resources. There's a difference.|*Picks up tablet.*|Five machines? All five patients get them.|Shortage isn't your fault. Disease isn't. Accident isn't.|Your responsibility: best decision with available information.|*Looks at Jordan directly.*|Document reasoning. Consult colleagues. Follow ethical principles. Decide.|Yeah, it weighs on you. But that weight keeps you honest.|Day it doesn't bother you? Day you should quit.`,
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'teaching_burden_v1',
        useChatPacing: true,

        // TODO: [VFX] Marcus's expression softens
        // TODO: [SFX] Quiet mentorship moment
        // TODO: [MUSIC] Reflective, gentle
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
        text: `*Checks phone.*|Committee meets in 30 minutes. Need recommendations.|*Pauses.*|Protocol says involve ethics committee for allocation. Oversight. Shared responsibility.|But they're backlogged. By the time they review, Patient B might deteriorate beyond ECMO effectiveness.|*Looks conflicted.*|Medical decision now, or shared ethical decision later?`,
        emotion: 'conflicted',
        interaction: 'shake',
        variation_id: 'ethics_decision_v1',
        useChatPacing: true,

        // TODO: [SFX] Phone notification
        // TODO: [VFX] Clock ticking visual
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
        text: `*Deep breath.*|Decision framework set. Now the harder part.|*Looks at patient list.*|Families. All in waiting room now.|Five families who don't know they're in competition for three machines.|How to communicate?|Full transparency: "Resources are limited"?|Or frame gently - clinical picture without mentioning shortage?|*Voice drops.*|More ethical: harsh truth, or protecting them from triage machinery?`,
        emotion: 'conflicted',
        interaction: 'small',
        variation_id: 'communication_v1',
        useChatPacing: true,

        // TODO: [VFX] Waiting room visual in background
        // TODO: [SFX] Muffled waiting room sounds
        // TODO: [MUSIC] Ethical weight builds
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
        text: `*Two hours later.*|*Returns. Exhausted but composed.*|Machines allocated. Patients A, B, E got them.|Patient D improved enough - managing without ECMO now.|Patient C... family chose comfort care. Already considering it.|*Sits down heavily.*|No one died from my recommendation.|But that's luck as much as judgment.|*Looks at Jordan, observing everything.*|Still want to work in CVICU?`,
        emotion: 'exhausted',
        interaction: 'small',
        variation_id: 'resolution_v1',
        useChatPacing: true,

        // TODO: [VFX] Time transition effect
        // TODO: [SFX] Relieved exhale
        // TODO: [MUSIC] Tension releases slightly
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
        text: `*Nods slowly.*|Yeah. I do.|If someone has to make these decisions... should be someone who loses sleep over them.|*Looks at ECMO machine, then Marcus.*|Teach me. Not just technical stuff. All of it.|The weight. The framework. How to carry it.`,
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'jordan_reflection_v1',
        useChatPacing: true,

        // TODO: [VFX] Jordan's resolve strengthens
        // TODO: [SFX] ECMO machine steady hum
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
        text: `*Almost smiles.*|Yeah. Maybe I am.|*Stands. Stretches.*|Was thinking about equipment design before. Machines that don't trap air bubbles.|But maybe another way to improve the system:|Teaching next generation to think critically about these machines. About the decisions around them.|*Hand on Jordan's shoulder.*|Same patience. Different kind of impact.|*Looks at you.*|Thanks. For helping me figure that out.`,
        emotion: 'grateful',
        interaction: 'bloom',
        variation_id: 'p2_complete_v1',
        useChatPacing: true,

        // TODO: [VFX] Warm resolution glow
        // TODO: [SFX] Hopeful music swell
        // TODO: [MUSIC] Inspiring, forward-looking
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