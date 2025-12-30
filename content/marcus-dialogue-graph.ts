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

<shake>...Don't bump the table.</shake>

Night shift. 3:00 AM. The ICU is dark, except for the glow of monitors.`,
        emotion: 'focused',
        variation_id: 'marcus_intro_v1',
        richEffectContext: 'warning',
        patternReflection: [
          { pattern: 'patience', minLevel: 5, altText: "Seventy-two beats. Flow rate stable.\n\n...Don't bump the table.\n\nNight shift. 3:00 AM. The ICU is dark.\n\nYou're waiting. Good. Most people rush in. You understand stillness.", altEmotion: 'appreciative' },
          { pattern: 'analytical', minLevel: 5, altText: "Seventy-two beats. Flow rate stable.\n\n...Don't bump the table.\n\nYou're reading the numbers already, aren't you? Heart rate, flow rate. You think in systems.", altEmotion: 'curious' },
          { pattern: 'helping', minLevel: 5, altText: "Seventy-two beats. Flow rate stable.\n\n...Don't bump the table.\n\nNight shift. 3:00 AM.\n\nYou have kind energy. That matters here. This job needs people who care.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'marcus_intro_sorry',
        text: "I won't touch anything.",
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
        patternReflection: [
          { pattern: 'building', minLevel: 5, altText: "I'm holding a life. The machine that holds the life.\n\nECMO. Pulls blood out, adds oxygen, pumps it back in. Engineering meets medicine.\n\nYou build things. You'd appreciate what this machine does.", altEmotion: 'reflective' },
          { pattern: 'helping', minLevel: 5, altText: "I'm holding a life. The machine that holds the life.\n\nTwelve hours. Just me and the machine. Keeping a father alive so he can see his kids again.\n\nThat's why you're here too, isn't it? You want to help people.", altEmotion: 'vulnerable' },
          { pattern: 'patience', minLevel: 5, altText: "I'm holding a life. The machine that holds the life.\n\nTwelve hours. Just me and the machine.\n\nYou understand waiting. This whole job is waiting—watching, being present, not rushing.", altEmotion: 'tired' }
        ]
        // TODO: [SFX] Subtle mechanical hum (ECMO machine sound)
        // TODO: [VFX] Soft glow effect on "ECMO" - educational highlight
      }
    ],
    choices: [
      {
        choiceId: 'marcus_high_stakes',
        text: "That sounds intense.",
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
      },
      {
        choiceId: 'marcus_visualizes_exploring',
        text: "What does it feel like? Being the connection between the machine and the person?",
        nextNodeId: 'marcus_technical_pride',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_let_breathe',
        text: "[Let the weight of that settle. No need to fill the silence.]",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
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
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "Me and the machine. We're a loop.\n\nFlow dynamics. Hemolysis. Clot risks. You're following the logic, aren't you?\n\nCVICU isn't just comfort. It's engineering. You understand that.", altEmotion: 'proud' },
          { pattern: 'building', minLevel: 4, altText: "Me and the machine. We're a loop.\n\nFlow dynamics. Hemolysis. Clot risks. This is real building—just biological instead of digital.\n\nYou build things too. Different materials, same precision.", altEmotion: 'knowing' }
        ],

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
        visibleCondition: {
          patterns: { analytical: { min: 3 } }
        },
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_heavy_burden',
        text: "That's a lot to carry.",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'marcus_technical_exploring',
        text: "How did you learn to think that way? Where does that precision come from?",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'exploring',
        skills: ['curiosity', 'communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_respect_silence',
        text: "[Nod. Sometimes precision speaks for itself.]",
        nextNodeId: 'marcus_the_bubble',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        visibleCondition: {
          patterns: { patience: { min: 3 } }
        },
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
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
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|<shake>'AIR IN LINE.'</shake>\n\nYou're not flinching. Good. Panic doesn't help in these moments.", altEmotion: 'critical' },
          { pattern: 'analytical', minLevel: 4, altText: "The real enemy? Air. One bubble in the line.|Brain? Stroke. Heart? Death. The logic is simple. The stakes aren't.|Tonight... the alarm screamed.|<shake>'AIR IN LINE.'</shake>", altEmotion: 'critical' }
        ],

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
      },
      {
        choiceId: 'marcus_bubble_exploring',
        text: "What happens in your mind in that moment? Between alarm and action?",
        nextNodeId: 'marcus_simulation_start',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        visibleCondition: {
          patterns: { exploring: { min: 4 } }
        },
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ]
  },

  // ============= THE SIMULATION (Updated: Character Narrates System) =============
  {
    nodeId: 'marcus_simulation_start',
    speaker: 'Marcus',
    content: [
      {
        text: `I didn't think. Just moved. Close your eyes. Hands out.

<shake>Monitor screaming. Red strobe.</shake>

<shake>O2 dropping: 98... 95... 92.</shake>

<shake>Bubble detector flashing.</shake>

<shake>Air in the arterial line.</shake>`,
        emotion: 'clinical',
        variation_id: 'sim_start_v2',
        richEffectContext: 'warning',
        useChatPacing: true,

        // TODO: [SFX] Alarm escalating with each O2 drop
        // TODO: [VFX] Red strobe effect on screen
        // TODO: [SFX] Bubble detector beeping urgently
        // NOTE: Using inline shake targeting for alarm moments only, not calm setup
      }
    ],
    choices: [
      {
        choiceId: 'sim_clamp_line',
        text: "CLAMP THE LINE immediately to stop flow.",
        nextNodeId: 'marcus_sim_step_2',
        pattern: 'building',
        skills: ['problemSolving', 'criticalThinking']
      },
      {
        choiceId: 'sim_call_help',
        text: "Yell for the surgeon.",
        nextNodeId: 'marcus_sim_fail_slow',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'sim_assess_first',
        text: "[Pause. Breathe. Read the monitors before acting.]",
        nextNodeId: 'marcus_sim_step_2',
        pattern: 'patience',
        skills: ['criticalThinking', 'adaptability'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'marcus_arc', 'interactive_episode']
  },

  {
    nodeId: 'marcus_sim_fail_slow',
    speaker: 'Marcus',
    content: [
      {
        text: `Too slow.

Bubble traveled 40cm. Hit the carotid.

<shake>Flatline. Asystole. Gone.</shake>

1.5 seconds. Can't wait for permission.`,
        emotion: 'critical',
        variation_id: 'sim_fail_v2',
        richEffectContext: 'error',

        // TODO: [SFX] Flatline tone on "Asystole"
        // TODO: [VFX] Screen goes dark/red on "Gone"
        // NOTE: Inline shake on the death moment only, not the explanation
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
        text: `Good. Flow stopped.

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
        text: "Flick the tubing to dislodge the bubble back to the port.",
        nextNodeId: 'marcus_sim_step_3',
        pattern: 'building',
        skills: ['digitalLiteracy', 'problemSolving']
      },
      {
        choiceId: 'sim_unclamp',
        text: "Unclamp. He needs blood flow!",
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
        text: `You unclamped. Bubble entered the cannula.

It's in him.

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
        text: `Bubble isolated. Access port. You have a syringe.

<jitter>Patient O2 dropping: 88... 85... 82...</jitter>

<jitter>Hypoxic. Seconds left.</jitter>`,
        emotion: 'clinical',
        // NOTE: Removed node-level 'jitter' - using inline targeting for O2 crisis moments
        variation_id: 'sim_step_3_v2',
        richEffectContext: 'warning',

        // TODO: [SFX] O2 alarm escalating
        // TODO: [VFX] O2 numbers flashing red as they drop
      }
    ],
    choices: [
      {
        choiceId: 'sim_aspirate',
        text: "Aspirate (suck out) the bubble with the syringe.",
        nextNodeId: 'marcus_sim_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'digitalLiteracy']
      },
      {
        choiceId: 'sim_push_fluid',
        text: "Push saline into the port.",
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
        text: `Pushed against pressure. Drove bubble further down.

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
        text: `Machine hum settles to steady rhythm.

System stable. Patient O2 rising... 98%.

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
        text: "That was real.",
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
    tags: ['simulation_complete', 'marcus_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }  },

  // ... [CAREER BRIDGE & ENDING - UNCHANGED] ...
  {
    nodeId: 'marcus_career_bridge',
    speaker: 'Marcus',
    content: [
      {
        text: `That's the job. Caring AND technical mastery.

Whole world here. Perfusionists run these in surgery. Biomedical engineers design them bubble-free. Software devs code the alarms.

Started as a nurse. Now? Designing the next machine.`,
        emotion: 'inspired',
        interaction: 'bloom',
        variation_id: 'career_bridge_v1',

        // TODO: [VFX] Career pathway icons appear subtly (perfusion, biomed, software)
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `You get it. Making things that matter. Heart and precision, together.

Whole world here. Perfusionists, biomedical engineers, software devs. All building.

Started as a nurse. Now? Designing the next machine.`,
        altEmotion: 'kindred_inspired'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `You think in systems. I saw that when you worked the simulation. That's what this takes—seeing how parts connect.

Whole world here. Perfusionists, engineers, devs. Systems within systems.

Started as a nurse. Now? Designing the next machine.`,
        altEmotion: 'recognized_inspired'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `You showed up when it mattered. That's what this work is—presence when it counts.

Whole world here. Perfusionists, engineers, devs. People who stay.

Started as a nurse. Now? Designing the next machine.`,
        altEmotion: 'grateful_inspired'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_biomed_path',
        text: "You'd be amazing at designing them. You know exactly how they fail.",
        nextNodeId: 'marcus_crossroads_3',
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
        nextNodeId: 'marcus_crossroads_3',
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['career_bridge', 'marcus_arc']
  },

  // ============= EXPANSION: Healthcare + Making Journey (7 nodes) =============

  {
    nodeId: 'marcus_crossroads_3',
    speaker: 'Marcus',
    content: [
      {
        text: `Designing them. Yeah.

Problem is... the system's broken.

I see patients get readmitted. Same issue. Same machine. Nobody fixed the root cause.

Insurance denies the equipment we need. Use the cheaper version. Doesn't work as well. Patients suffer.

Makes me want to build something better.`,
        emotion: 'frustrated',
        variation_id: 'crossroads_3_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_crossroads_validate',
        text: "You want to fix it from the inside.",
        nextNodeId: 'marcus_making_discovery',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'marcus_crossroads_build',
        text: "What would you build if you could?",
        nextNodeId: 'marcus_making_discovery',
        pattern: 'building',
        skills: ['creativity', 'problemSolving']
      }
    ],
    tags: ['marcus_arc', 'crossroads', 'healthcare_critique']
  },

  {
    nodeId: 'marcus_making_discovery',
    speaker: 'Marcus',
    content: [
      {
        text: `Six months ago. Patient needed a heart model. For surgery planning.

Surgeon wanted to practice the incision on something real. Something they could hold.

Hospital doesn't have those. Too expensive.

Friend of mine runs a makerspace in Woodlawn. 3D printers. CNC machines.

Brought him the CT scans. He printed a heart. Perfect replica. Silicone.

Surgeon practiced. Surgery went clean.

*Stares at hands.*

I made that happen.`,
        emotion: 'dawning_realization',
        interaction: 'bloom',
        variation_id: 'making_discovery_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_discovery_both',
        text: "You're both a nurse and a maker.",
        nextNodeId: 'marcus_biodesign_realization',
        pattern: 'analytical',
        skills: ['systemsThinking', 'communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'marcus_discovery_impact',
        text: "You saved that patient twice. Once with care, once with making.",
        nextNodeId: 'marcus_patient_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['marcus_arc', 'maker_crossover', 'birmingham']
  },

  {
    nodeId: 'marcus_biodesign_realization',
    speaker: 'Marcus',
    content: [
      {
        text: `Biodesign.

*Looks up.*

UAB has a program. Biomedical Engineering. Design medical devices. 3D-printed prosthetics. Custom surgical tools.

Nursing gives you the clinical knowledge. Making gives you the build skills.

Together? You design things that actually work. Because you know what fails.`,
        emotion: 'illuminated',
        variation_id: 'biodesign_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_biodesign_uab',
        text: "UAB is right here in Birmingham. You could do this.",
        nextNodeId: 'marcus_uab_connection',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      },
      {
        choiceId: 'marcus_biodesign_why',
        text: "Why does this matter to you?",
        nextNodeId: 'marcus_patient_story',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence']
      }
    ],
    tags: ['marcus_arc', 'career_revelation', 'biodesign']
  },

  {
    nodeId: 'marcus_uab_connection',
    speaker: 'Marcus',
    content: [
      {
        text: `UAB. Children's of Alabama. The whole medical district.

Birmingham's got this whole ecosystem. Hospitals. Research labs. Makerspaces.

Could design a device at UAB. Test it at Children's. Build prototypes at Woodlawn makerspace.

All within five miles.

*Small smile.*

Never thought of Birmingham as a medical tech hub. But... it is.`,
        emotion: 'hopeful',
        interaction: 'nod',
        variation_id: 'uab_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_uab_local',
        text: "You don't have to leave to do groundbreaking work.",
        nextNodeId: 'marcus_mentorship_moment',
        pattern: 'helping',
        skills: ['encouragement', 'culturalCompetence']
      },
      {
        choiceId: 'marcus_uab_community',
        text: "You could build for the community you already serve.",
        nextNodeId: 'marcus_mentorship_moment',
        pattern: 'building',
        skills: ['leadership', 'communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'birmingham_opportunity']
  },

  {
    nodeId: 'marcus_patient_story',
    speaker: 'Marcus',
    content: [
      {
        text: `Eight-year-old girl. Cardiac arrest. We got her back, but her heart's weak.

Needs a ventricular assist device. Pediatric-sized. Custom fit.

Standard one's too big. Insurance won't cover custom. Hospital says wait.

She's waiting. Still.

*Quiet.*

I want to build devices that fit her. Not the other way around.

That's why this matters.`,
        emotion: 'raw_conviction',
        variation_id: 'patient_story_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_patient_validate',
        text: "She's why you're doing this.",
        nextNodeId: 'marcus_mentorship_moment',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'marcus_patient_action',
        text: "You could design that device. You know what she needs.",
        nextNodeId: 'marcus_biodesign_realization',
        pattern: 'building',
        skills: ['problemSolving', 'leadership']
      }
    ],
    tags: ['marcus_arc', 'emotional_anchor', 'patient_care']
  },

  {
    nodeId: 'marcus_mentorship_moment',
    speaker: 'Marcus',
    content: [
      {
        text: `Met a kid at the makerspace last week. Seventeen. Wants to be a nurse.

Showed him how to read an ECG. How to spot arrhythmias.

Then showed him the 3D printer. How to model a stent from CT data.

His eyes lit up.

*Small laugh.*

He didn't know you could do both. Be clinical and technical. Heart and hands.

Now he does.`,
        emotion: 'warm',
        interaction: 'small',
        variation_id: 'mentorship_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_mentorship_legacy',
        text: "You're showing him a path you're still discovering yourself.",
        nextNodeId: 'marcus_arc_synthesis',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership']
      },
      {
        choiceId: 'marcus_mentorship_bridge',
        text: "You're the bridge between two worlds.",
        nextNodeId: 'marcus_arc_synthesis',
        pattern: 'building',
        skills: ['communication', 'leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'mentorship', 'teaching']
  },

  {
    nodeId: 'marcus_arc_synthesis',
    speaker: 'Marcus',
    content: [
      {
        text: `Healthcare plus making. Clinical knowledge plus build skills.

It's not two careers. It's one path.

Biomedical engineering. Medical device design. Clinical engineering.

And I don't have to choose. I get to merge them.

*Looks at you.*

Thanks. For walking through this with me. Helped me see it.`,
        emotion: 'confident',
        interaction: 'bloom',
        variation_id: 'synthesis_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_synthesis_complete',
        text: "You're going to change lives with this.",
        nextNodeId: 'marcus_farewell',
        pattern: 'helping',
        skills: ['encouragement', 'communication']
      },
      {
        choiceId: 'marcus_synthesis_build',
        text: "Go build what the world needs.",
        nextNodeId: 'marcus_farewell',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    tags: ['marcus_arc', 'synthesis', 'career_clarity'],
    metadata: {
      sessionBoundary: true  // Session 3: Career synthesis complete
    }
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
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `Thanks. Felt good walking you through it. You were here when it mattered. that's rare.

Makes the weight lighter.

If you see Samuel... tell him the patient made it.

The machine held.`,
        altEmotion: 'deep_grateful'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: `Thanks. Felt good walking you through it. You think like an engineer. I saw that.

Makes the weight lighter.

If you see Samuel... tell him the patient made it.

The machine held.`,
        altEmotion: 'kindred_grateful'
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
        addGlobalFlags: ['marcus_arc_complete'],
        thoughtId: 'steady-hand'
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
        text: `*Three days later. ECMO console. Not alone.*|This is Jordan. New to CVICU. First week. Showing them the ropes.|Funny you asked about teaching.|About to find out if I'm any good.`,
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
        text: "First day on ECMO?",
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
        text: `First week. Read manuals. Watched videos.

But standing here next to the real thing...

Person's blood in those lines. Entire circulatory system.

<jitter>What if I mess up?</jitter>`,
        emotion: 'anxious',
        // NOTE: Removed node-level 'jitter' - using inline targeting for the final fear moment
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
        // NOTE: Removed "*Phone buzzes. Expression darkens.*" - audio handled by system, emotion shown through dialogue disruption
        text: `Start simple. See that number? Flow rate.|Liters per minute the pump moves.|Normal cardiac output: 4 to 8. We're at 4.5 because. |<shake>*Sharp BEEP*</shake>|<shake>CRITICAL SYSTEM MESSAGE</shake>`,
        emotion: 'focused',
        variation_id: 'teaching_interrupted_v1',
        richEffectContext: 'warning',
        useChatPacing: true,

        // TODO: [SFX] Sharp alert beep cutting through
        // TODO: [VFX] Red alert flash on screen
        // TODO: [SFX] Phone vibration
        // NOTE: Inline shake on interruption only, teaching remains calm
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
        text: "Talk us through it.",
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
        text: `Equipment allocation crisis.

<shake>Three ECMO machines. Five patients need ECMO within 6 hours.</shake>

Triage committee convening. Senior specialists standby for recommendations.

<shake>Three machines. Five patients.</shake>

<shake>Someone's not getting one.</shake>

They want my recommendation on who.`,
        emotion: 'heavy',
        variation_id: 'crisis_announcement_v1',
        richEffectContext: 'error',
        useChatPacing: true,

        // TODO: [SFX] Phone notification sound
        // TODO: [VFX] Screen flash red on "allocation crisis"
        // TODO: [MUSIC] Tension builds
        // NOTE: Inline shake on the impossible math (3 vs 5) and "someone's not getting one"
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
        pattern: 'exploring',
        skills: ['curiosity']
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
        text: `Five cases. All critical. All need ECMO.

**Patient A**: 45, heart failure, transplant list, stable.
**Patient B**: 28, motorcycle accident, lung damage, deteriorating fast.
**Patient C**: 67, post-surgery complications, high mortality even with ECMO.
**Patient D**: 52, COVID complications, slight improvement.
**Patient E**: 19, sudden cardiac event, unknown cause, unstable.

Committee wants data. Survival probability. Resource utilization.

But...`,
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
        // NOTE: Removed "*Nods slowly*", "*Looks down*", "*Jaw tightens*" - conflict conveyed through dialogue contrast
        text: `Survival probability. Cleanest metric. Evidence-based.|Patient C: 30% survival even with ECMO.|Patient D: improving without it.|Prioritizes A, B, E.|Patient C has grandchildren visiting daily.|Patient D: single parent, three kids under 10.|Data says one thing. Humans say another.`,
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
        text: "The human context matters. Not just numbers.",
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
        text: `Nineteen years old. Entire life ahead.

But cardiac event unknown cause. Could recur. High complication risk.

Patient B - 28, motorcycle accident - reversible lung damage. Clear recovery path.

Years of life: one metric. Quality of those years: another.

Who are we to decide whose future is worth more?`,
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
    tags: ['phase2', 'marcus_arc'],
    metadata: {
      sessionBoundary: true  // Session 2: Crossroads complete
    }  },

  {
    nodeId: 'marcus_p2_framework_holistic',
    speaker: 'Marcus',
    content: [
      {
        text: `Not just math.

Medical criteria: survival probability, reversibility, resource utilization.

Human factors: family impact, quality of life, patient values.

System factors: bed availability, staffing, follow-up capacity.

Build a framework. Weight factors. Score patients.

Process becomes transparent.

Doesn't make it easier. Makes it defensible.`,
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
        text: "Numbers guide you. But something else decides.",
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
        text: `<jitter>Marcus... how do you live with this?</jitter>

Came into medicine to help people. Save lives.

<jitter>But this? Choosing who gets the machine...</jitter>

<jitter>That's choosing who lives.</jitter>

<jitter>How do you make that choice and go home and sleep?</jitter>`,
        emotion: 'anxious',
        // NOTE: Removed node-level 'jitter' - using inline targeting for emotional crescendo moments
        variation_id: 'jordan_question_v1',
        useChatPacing: true,

        // TODO: [VFX] Jordan's hands trembling
        // TODO: [SFX] Voice breaks slightly
      }
    ],
    choices: [
      {
        choiceId: 'p2_marcus_answer_honest',
        text: "That's a fair question.",
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
        text: `Jordan, you don't sleep well. Not at first. Maybe not ever.

But here's what I learned: You're not choosing who lives. You're doing triage with limited resources. There's a difference.

Five machines? All five patients get them.

Shortage isn't your fault. Disease isn't. Accident isn't.

Your responsibility: best decision with available information.

Document reasoning. Consult colleagues. Follow ethical principles. Decide.

Yeah, it weighs on you. But that weight keeps you honest.

Day it doesn't bother you? Day you should quit.`,
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
        text: `*Checks phone.*|Committee meets in 30 minutes. Need recommendations.|*Pauses.*|Protocol says involve ethics committee for allocation. Oversight. Shared responsibility.|<shake>But they're backlogged. By the time they review, Patient B might deteriorate beyond ECMO effectiveness.</shake>|*Looks conflicted.*|<shake>Medical decision now, or shared ethical decision later?</shake>`,
        emotion: 'conflicted',
        // NOTE: Removed node-level 'shake' - using inline targeting for the dilemma and time pressure moments
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
        // NOTE: Removed "*Nods slowly*", "*Looks at ECMO machine, then Marcus*" - resolve shown through commitment in dialogue
        text: `Yeah. I do.|If someone has to make these decisions... should be someone who loses sleep over them.|Teach me. Not just technical stuff. All of it.|The weight. The framework. How to carry it.`,
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
        choiceId: 'marcus_asks_before_leave',
        text: "Before you go, how do you know when you're making the right choice?",
        nextNodeId: 'marcus_asks_player',
        pattern: 'helping',
        skills: ['communication', 'curiosity']
      },
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
  },
  // ============= RECIPROCITY: MARCUS ASKS PLAYER =============
  {
    nodeId: 'marcus_asks_player',
    speaker: 'Marcus',
    content: [
      {
        text: `*Pauses. Looks at you.*|How know right choice?|*Thinks.*|For me. when decision feels heavy. When I lose sleep.|Means I care.|But you?|How you know?|When helping others, how you know you helping right way?`,
        emotion: 'curious_engaged',
        interaction: 'nod',
        variation_id: 'marcus_reciprocity_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'player_know_by_feeling',
        text: "I trust my gut. When something feels right, even if it's hard, I know it's the path I need to take. But sometimes I second-guess that feeling.",
        nextNodeId: 'marcus_reciprocity_response',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'player_know_by_impact',
        text: "I look at the impact. Are people better off? Are they more capable? But it's hard to measure that in the moment. You only see it later.",
        nextNodeId: 'marcus_reciprocity_response',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'criticalThinking']
      },
      {
        choiceId: 'player_know_by_connection',
        text: "When someone feels safe enough to be vulnerable. That's how I know.",
        nextNodeId: 'marcus_reciprocity_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'player_dont_always_know',
        text: "Honestly? I don't always know. I make choices and hope they're right. Sometimes I only know in hindsight, and sometimes I never know for sure.",
        nextNodeId: 'marcus_reciprocity_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'marcus_arc']
  },
  {
    nodeId: 'marcus_reciprocity_response',
    speaker: 'Marcus',
    content: [
      {
        text: `*Nods slowly.*|That's it.|Not knowing for sure.|But showing up anyway.|That's what matters.|*Looks at Jordan.*|Teaching her that.|You teaching me that.|*Turns back.*|Samuel waiting. Tell him Marcus says thank you.`,
        emotion: 'grateful',
        interaction: 'nod',
        variation_id: 'marcus_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_marcus_after',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.MARCUS_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'marcus_arc']
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