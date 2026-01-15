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
        text: "Wait. Stay back. That railing.\n\nBolt is loose. 2mm variance.\n\nTechnically it holds 80kg. But if you slip... static load becomes dynamic load.\n\nSafety isn't a checkbox. It's gravity waiting to catch you.",
        emotion: 'frustrated',
        variation_id: 'kai_intro_v3_minimal',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Protective Life training office. Fluorescent lights. Late shift.\n\nFifteen slides. Fifteen 'Click Next' buttons.\n\nYou're already analyzing the system aren't you? You can see the gap between compliance and actual safety.", altEmotion: 'interested' },
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
        skills: ['systemsThinking', 'criticalThinking'],
        voiceVariations: {
          analytical: "Compliance theater. The company gets liability protection, workers get a checkbox.",
          helping: "This sounds like it protects companies, not people.",
          building: "The system's broken. Check the box, skip the learning.",
          exploring: "So it's all theater? Nobody actually learns anything?",
          patience: "That's a frustrating gap. Between what's required and what works."
        }
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
        skills: ['leadership', 'creativity'],
        voiceVariations: {
          analytical: "The current model has clear failure points. Build a better one.",
          helping: "If this isn't working for people, what would?",
          building: "So redesign it. Make something better.",
          exploring: "What would actually effective training look like?",
          patience: "Sometimes change starts with one person rebuilding one system."
        }
      },
      {
        choiceId: 'kai_intro_patience',
        text: "[Let the silence hold. They'll continue when ready.]",
        nextNodeId: 'kai_patience_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        voiceVariations: {
          analytical: "[Wait. Collect more data before responding.]",
          helping: "[Stay present. They need space to process.]",
          building: "[Hold. Sometimes the best action is waiting.]",
          exploring: "[Let the moment unfold. There's more coming.]",
          patience: "[Let the silence hold. They'll continue when ready.]"
        },
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
        text: "You get it. Most people see a checkbox and think 'safety.' You see the gap between the policy and the practice.\n\nThat's rare. Usually I have to explain why 'completing training' and 'being trained' aren't the same thing.",
        emotion: 'surprised_respect',
        variation_id: 'systemic_response_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You get it. You see systems the way I do. Not just the outputs, but the logic failures hiding inside.\n\nMost people see a checkbox and think 'safety.' You see the gap.", altEmotion: 'impressed' },
          { pattern: 'building', minLevel: 4, altText: "You get it. You're already thinking about how to fix it, aren't you?\n\nMost people stop at 'this is broken.' You see what it could be.", altEmotion: 'hopeful' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'tell_gap',
        text: "Tell me more about that gap.",
        nextNodeId: 'kai_system_frustration',
        archetype: 'ASK_FOR_DETAILS',
        voiceVariations: {
          analytical: "Quantify the gap for me. Where does the system fail?",
          helping: "Tell me more about that gap. It clearly matters to you.",
          building: "What's the delta between policy and practice?",
          exploring: "I want to understand. Tell me more about that gap.",
          patience: "Take your time. Tell me more about that gap."
        }
      }
    ]
  },
  {
    nodeId: 'kai_practical_response',
    speaker: 'Kai',
    content: [
      {
        text: "Redesign it. Yeah. I have a master's degree in exactly that. Instructional design. UAB, 2022.\n\nYou want to know what my capstone was? A VR safety simulation for manufacturing floors. Haptic feedback, real scenarios, actual muscle memory.\n\nIt's sitting on a hard drive. Never deployed. Too expensive.",
        emotion: 'bitter_amusement',
        variation_id: 'practical_response_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "Redesign it. Yeah. I have a master's degree in exactly that.\n\nYou build things. You know what it's like to create something good that never gets used. VR safety simulation. Haptic feedback. Real scenarios.\n\nSitting on a hard drive. Too expensive.", altEmotion: 'vulnerable' },
          { pattern: 'exploring', minLevel: 4, altText: "Redesign it. I have a master's degree in exactly that. UAB, 2022.\n\nYou're curious about the gap, aren't you? Between what's possible and what gets deployed.\n\nMy capstone is sitting on a hard drive. Never deployed.", altEmotion: 'bitter_amusement' }
        ]
      }
    ],
    choices: [
      { choiceId: 'sounds_frustrating', text: "That sounds frustrating.", nextNodeId: 'kai_system_frustration', archetype: 'ACKNOWLEDGE_EMOTION' }
    ]
  },
  {
    nodeId: 'kai_patience_response',
    speaker: 'Kai',
    content: [
      {
        text: "Between us... you're the first person who hasn't tried to fix it with advice. Everyone else wants to solve me like I'm a problem to debug.\n\nSometimes you just need someone to sit in the frustration with you.",
        emotion: 'grateful',
        variation_id: 'patience_response_v1',
        voiceVariations: {
          patience: "Between us... you're the first person who hasn't tried to fix it. You just... waited.\n\nSometimes that's exactly what someone needs. To not be solved.",
          helping: "Between us... you're the first person who hasn't tried to fix it. You actually listened.\n\nMost people want to help by solving. You helped by staying.",
          analytical: "Between us... you didn't jump to solutions. That's rare for someone who thinks in systems.\n\nYou let the problem breathe. That matters.",
          building: "Between us... you didn't immediately try to build a fix. You just... sat with it.\n\nSometimes the best thing to build is space.",
          exploring: "Between us... you didn't rush to the next question. You let the silence hold.\n\nCuriosity that waits is rarer than you'd think."
        }
      }
    ],
    choices: [
      { choiceId: 'stay_quiet', text: "[Stay quiet. Let them continue.]", nextNodeId: 'kai_system_frustration', archetype: 'STAY_SILENT' }
    ]
  },

  {
    // Stage 2: Bridge node - shows the systemic problem
    nodeId: 'kai_system_frustration',
    speaker: 'Kai',
    content: [
      {
        text: "Between us... that's exactly it. I know how people actually learn. I have a master's in instructional design. I could build simulations, scenarios, real practice.\n\nBut that costs money. 'Click Next' costs nothing.\n\nSo I build green checkmarks. Legal shields. And last week...",
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
        text: "Because three days ago, someone got hurt. Someone who clicked every button. Watched every video. Passed every quiz.\n\nAnd none of it mattered when he was standing twenty feet up without checking his harness.",
        emotion: 'pained',
        variation_id: 'accident_hint_v1',
        voiceVariations: {
          helping: "Because three days ago, someone got hurt. You asked because you could tell this wasn't theoretical.\n\nHe clicked every button. Watched every video. None of it mattered when he was twenty feet up.",
          analytical: "Because three days ago, someone got hurt. You're connecting the dots, aren't you?\n\n100% compliance. 0% retention. Twenty feet up without checking his harness.",
          building: "Because three days ago, someone got hurt. You understand—sometimes what we build fails people.\n\nHe did everything right according to the system. The system was wrong.",
          exploring: "Because three days ago, someone got hurt. You wanted the real story.\n\nHere it is: perfect compliance, real injury. Twenty feet up.",
          patience: "Because three days ago, someone got hurt. Thank you for asking instead of assuming.\n\nHe passed every quiz. None of it saved him."
        }
      }
    ],
    choices: [
      {
        choiceId: 'kai_tell_more',
        text: "Tell me what happened.",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'helping',
        archetype: 'ASK_FOR_DETAILS',
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
        archetype: 'REFLECT_BACK',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'kai_hint_exploring',
        text: "What would it take to actually prepare someone? Not just check a box?",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'exploring',
        archetype: 'EXPRESS_CURIOSITY',
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
        text: "Warehouse accident. Broken pelvis.\n\nHe's 22. Same age as my little brother.\n\nThe investigation cleared us. 'Employee completed mandatory safety training on Oct 4th.' The certificate is in the system. Green checkmark.\n\nWe designed a green checkmark. We didn't design safety.",
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
      text: "You didn't try to fix it. Didn't offer solutions. Just... stayed.\n\nMost people hear 'someone got hurt' and immediately pivot to problem-solving mode. You let me feel it first.\n\nThat's what actual safety looks like. Presence before protocol.",
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
        text: "Marcus. The ECMO specialist? I read about his case in a medical ethics journal.\n\nHe has to decide, in seconds, who lives. I have months to design these courses, and I still failed.\n\nIf he makes a mistake, a patient dies. If I make a mistake... 50,000 employees learn the wrong thing. And then what happens?\n\nThe scale is different. The guilt is the same.",
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
        text: "Legally covered. Yes. That's what my VP said. 'Great work, Kai. The audit trail is perfect.'\n\nHe's in the hospital, and we're celebrating our audit trail.\n\nI can't do this anymore. I can't build shields for the company that leave the people exposed.",
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
        text: "You want to know why I do this?\n\nMy dad worked at Sloss Furnaces. Well, what became of it. Thirty years making pipe fittings. He came home smelling like iron and machine oil.\n\nWhen I was twelve, he almost lost his hand. The guard was broken. Everyone knew it was broken. But production quotas don't wait for safety repairs.",
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
        archetype: 'ASK_FOR_DETAILS',
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
        archetype: 'SHOW_UNDERSTANDING',
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
        text: "He kept the hand. Lost two fingers. The company paid for surgery and called it 'workplace wellness.'\n\nHe never complained. Said it was part of the job. But every time I saw him struggle to hold a coffee cup, I thought: someone designed that training. Someone signed off on it.\n\nThat someone is now me.",
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
        text: "I thought I could change things from the inside. Get a degree in instructional design. Join a big company with resources. Build something better.\n\nBut you know what they taught me in school? 'Engaging content.' 'Gamification.' 'Learner analytics.'\n\nNot a single class on how to keep someone alive.",
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
        text: "I did. Two summers during high school. Nucor Steel Birmingham. Rebar production.\n\n110 degrees on the factory floor. Safety goggles fogging up. Molten steel running through channels.\n\nLearned more about systems in two months than four years of college.\n\nBut my mom... she didn't want me to end up like my dad. Missing fingers. Bad back. Retiring at 60 with nothing.\n\n'You're smart, Kai. Get the degree. Get the office job.'",
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
        text: "Before the degree, I went to Lawson State Community College. Welding program.\n\nMy dad was proud. Thought I'd follow his path. Make things with my hands.\n\nBut every time I picked up the torch, I kept thinking: who designed this safety protocol? Who wrote the training manual that nobody reads?\n\nI didn't want to just be good at the work. I wanted to fix why the work was dangerous.",
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
        text: "Yeah. TIG welding. Aluminum, stainless, mild steel.\n\nThere's something about it. Watching the puddle form. Controlling the heat. Building something that holds.\n\nMy instructor used to say: 'A good weld is stronger than the metal itself.'\n\nThat's when I understood. The connection matters more than the parts.\n\nSame with teaching. The learning matters more than the certificate.",
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
        text: "The factory floor is all systems. Input, process, output.\n\nSteel comes in as scrap. Gets melted in the arc furnace. Poured into molds. Cooled. Cut. Shipped.\n\nBut the real system? The people.\n\nThe crane operator who signals the pour. The quality inspector who checks the specs. The maintenance crew who fixes the torch before it breaks.\n\nIf anyone fails, the whole line stops. Or worse, someone gets hurt.\n\nThat's what I learned: safety isn't a checklist. It's how the system works together.",
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
        text: "My mom didn't give me a choice. 'You're going to UAB. You're getting the degree. No son of mine is losing fingers.'\n\nMy dad didn't say anything. Just looked at his hand.\n\nSo I went. Instructional design. Educational technology. Learning sciences.\n\nEveryone in my cohort wanted to design corporate onboarding. Build apps for schools.\n\nI wanted to keep my dad's coworkers alive.\n\nThey thought I was weird.",
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
        archetype: 'ACKNOWLEDGE_EMOTION',
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
        archetype: 'SHARE_PERSPECTIVE',
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
        text: "You know what's funny? Birmingham's still got manufacturing.\n\nNucor Steel. Mercedes-Benz U.S. International in Tuscaloosa. Lots of small fabrication shops.\n\nThey're hiring. Good pay. Union benefits. Real skills.\n\nBut nobody talks about it. Everyone pushes college. 'Get out of Birmingham. Get a tech job.'\n\nMeanwhile, the factory jobs pay better than half the office jobs I've seen.\n\nAnd they're building things that matter. Cars. Steel beams. Infrastructure.\n\nNot... slideshows.",
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
        archetype: 'CHALLENGE_ASSUMPTION',
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
        text: "Last year. Nucor asked me to redesign their safety onboarding.\n\nI spent a week on the factory floor. Shadowing Tommy, a 30-year veteran machinist.\n\nHe showed me how to read a blueprint. How to set up a CNC mill. How to spot when a tool's about to fail.\n\nThen he showed me their training manual. 'This is garbage,' he said. 'Nobody reads it. We just show the new guys what to do.'\n\nThat's when I knew. The manual wasn't the training. Tommy was.\n\nI designed a mentorship program instead of a PDF. Paired every new hire with a veteran.\n\nInjury rate dropped 40% in six months.",
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
        text: "Tommy retired last month. Sixty-two. Bad knees. Good pension.\n\nThe CNC machines can do most of what he did. Faster. More precise. No sick days.\n\nBut they can't teach. Can't spot when something's wrong by the sound. Can't mentor the kid who's scared of the mill.\n\nNucor replaced Tommy with a robotic arm. Kept the safety program I built... for now.\n\nThat's the future. Machines making things. Humans making sure the machines don't kill anyone.",
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
        text: "Half the people I trained over the past year are looking for new work now. Not because they failed. Because their jobs got automated.\n\nDeShawn. Forty-three. Twenty years running the arc furnace. Company offered him 'retraining.' Eight weeks of computer classes. Then nothing.\n\nMaria. Shift supervisor. They told her to 'reskill into tech.' She's got three kids and no time to go back to school for two years.\n\nThat's what no one talks about. The retraining sounds good in a press release. But who's paying the mortgage while you learn to code?",
        emotion: 'frustrated',
        interaction: 'small',
        variation_id: 'retraining_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Half the people I trained are looking for new work. Not because they failed. Because their jobs got automated.\n\nDeShawn. Twenty years at the furnace. Maria. Three kids, shift supervisor.\n\nYou asked about them. Most people don't. They talk about 'the workforce' like it's a spreadsheet, not people with families.", altEmotion: 'vulnerable' },
          { pattern: 'analytical', minLevel: 4, altText: "Half the people I trained are looking for new work. The data's clear. Automation displaces faster than retraining scales.\n\nCompanies promise 'reskilling' because it's cheaper than severance. But eight weeks of computer classes doesn't replace twenty years of expertise.\n\nThe economics are brutal. Who pays the mortgage while someone learns to code?", altEmotion: 'analytical_bitter' }
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
        text: "Building on what they already know. Not starting over.\n\nDeShawn doesn't need to become a software engineer. He needs to learn how to work WITH the robotic arm. His twenty years of metallurgy? That's still valuable. The machine can't tell good steel from bad by the color of the pour.\n\nThat's what I'm building. Training that bridges. Not replaces. Show a machinist how to program the CNC. Show a welder how to operate the automated torch. Meet people where they are.\n\nThe companies that figure this out? They'll have workers who actually know what they're doing. The ones that don't? They'll have expensive robots and nobody who knows how to fix them when they break.",
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
        text: "Not hopeless. Just... honest.\n\nThe jobs aren't all disappearing. They're changing. Healthcare needs people. Can't automate wiping someone's tears. Construction needs people. Can't robot your way through a renovation in a 100-year-old building. Education needs people. Kids don't learn from screens.\n\nThe question isn't whether there's work. It's whether people can get to it. And right now? The bridge is broken.\n\nThat's why I'm here. Building better bridges. One simulation at a time.",
        emotion: 'resolved',
        variation_id: 'not_hopeless_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Not hopeless. Just honest.\n\nThe caring jobs aren't going anywhere. Healthcare. Teaching. Elder care. You can't automate sitting with someone who's scared.\n\nThe question is whether people can get to those jobs. Right now, the bridge is broken. That's why I'm building better bridges.", altEmotion: 'determined' }
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
        text: "That's what I'm building toward. Hybrid path.\n\nTrade skills + systems thinking. Hands-on work + digital literacy.\n\nThe welder who understands robotics. The machinist who can program the CNC. The safety officer who builds VR simulations.\n\nBirmingham needs that. The manufacturing jobs aren't going away. They're just changing.\n\nAnd someone needs to teach people how to navigate that change.\n\nMaybe that someone is me.",
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
        text: "You know what I miss most about factory work?\n\nThe feedback loop. You weld a joint, you test it, you see if it holds. Immediate. Real.\n\nIn corporate training? I build a module. Someone clicks through it. I get a completion metric. Did they learn? Who knows.\n\nBut when I'm teaching someone to weld, I watch their hands. I see the bead form. I know if they got it.\n\nThat's the kind of learning I want to design. Where you can see the result. Where failure teaches you before it kills you.",
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
        text: "Manufacturing + instructional design. That's my path.\n\nNot compliance training. Not corporate checkboxes.\n\nSafety simulations for industrial workers. Built by someone who understands both the factory floor and the learning science.\n\nBirmingham-based. Serving the companies that kept this city alive. Nucor. Mercedes. The fabrication shops in Bessemer.\n\nTraining that actually protects people.\n\nThat's what I'm building.",
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
      },
      {
        choiceId: 'kai_deep_dive_unlock',
        text: "[Deep Dive] Show me the real blueprint. The one you're afraid to build.",
        nextNodeId: 'kai_deep_dive',
        pattern: 'building',
        skills: ['systemsThinking', 'courage'],
        visibleCondition: {
          trust: { min: 4 },
          patterns: { building: { min: 6 } }
        },
        preview: "Enter the Safety Systems Deep Dive",
        interaction: 'bloom'
      }
    ],
    tags: ['kai_arc', 'career_synthesis', 'manufacturing_design'],
    metadata: {
      sessionBoundary: true  // Session 2: Career vision crystallized
    }
  },

  // ============= DEEP DIVE: SYSTEM SAFETY ARCHITECT =============
  {
    nodeId: 'kai_deep_dive',
    speaker: 'Kai',
    content: [
      {
        text: "You want the real work? Okay.\n\nStation Life Support. Sector 4. The hydroponics failure wasn't just a glitch. It was a design flaw in the safety interlocks.\n\nThey optimized for yield, not resilience. I've been sketching a redesign that prioritizes worker safety over efficiency.\n\nHelp me balance the system. We can't let it fail again.",
        emotion: 'intense_focused',
        variation_id: 'deep_dive_v1'
      }
    ],
    simulation: {
      type: 'visual_canvas',
      title: 'Hydroponics Safety Grid',
      taskDescription: 'Redesign the Sector 4 Life Support safety protocol. Balance nutrient flow efficiency against critical fail-safe redundancy.',
      initialContext: {
        label: 'SECTOR_4_SCHEMATIC',
        content: `Current System Efficiency: 98%
Safety Margin: 2% (CRITICAL LOW)

Redesign Goals:
1. Increase Safety Margin > 15%
2. Maintain Yield > 85%

Available Components:
[ ] Pressure Relief Valves
[ ] Bio-Filters (Redundant)
[ ] Automated Shutdown Logic
[ ] Manual Override Stations`,
        displayStyle: 'code'
      },
      successFeedback: 'SAFETY GRID OPTIMIZED. Margin 18%. Yield 92%. System stable.',
      mode: 'fullscreen'
    },
    choices: [
      {
        choiceId: 'kai_dive_success',
        text: "The yield dropped slightly, but the system won't kill anyone now.",
        nextNodeId: 'kai_deep_dive_success',
        pattern: 'building',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'kai_dive_analytical',
        text: "Redundancy isn't waste. It's insurance.",
        nextNodeId: 'kai_deep_dive_success',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['deep_dive', 'mastery', 'safety_systems']
  },

  {
    nodeId: 'kai_deep_dive_success',
    speaker: 'Kai',
    content: [
      {
        text: "Look at that. 92% yield. 18% safety margin.\n\nThe VP said it was impossible. Said we couldn't prioritize safety without crashing production.\n\nWe just proved them wrong.\n\nThis... this is what I need to build. Not slides. Systems that save lives.",
        emotion: 'inspired_determined',
        variation_id: 'deep_dive_success_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['kai_mastery_achieved', 'kai_blueprint_finalized']
      }
    ],
    choices: [
      {
        choiceId: 'kai_dive_complete',
        text: "Go build it.",
        nextNodeId: 'kai_farewell',
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  // ============= SCENE 4: CORPORATE REALITY =============
  {
    nodeId: 'kai_corporate_truth',
    speaker: 'Kai',
    content: [
      {
        text: "The VP pulled me aside on my first week. You know what she said?\n\n'Kai, your job is to make the lawyers happy. The slides are legal documentation. If someone gets hurt, we show the completion certificate. That's the training.'\n\nI thought she was exaggerating. She wasn't.",
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
        text: "Once. I proposed a simulation-based module for hazmat handling. Real scenarios, real consequences, no 'Click Next.'\n\nThe VP ran the numbers. 'This costs 40 hours per employee. The current module is 45 minutes.'\n\nShe didn't even look at the injury data. Just the time-to-completion metrics.",
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
        text: "Exactly. The metrics are designed to measure the wrong thing.\n\nCompletion rate: 98%. Average quiz score: 92%. Injury rate: 'Not our department.'\n\nWe're optimizing for numbers that don't matter while people get hurt.",
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
        text: "I visited him. Marcus. Not the nurse, the worker. Same name, different person.\n\nHe's 22. Two kids. The doctors say he'll walk again, but warehouse work? Probably not.\n\nHis wife looked at me and asked: 'Did you design the training he took?'",
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
        text: "I said yes. And I apologized. Not the corporate apology. The real one.\n\nShe didn't yell. She didn't threaten to sue. She just said: 'Fix it. So this doesn't happen to someone else's husband.'\n\nThat's when I started building. Secretly. After hours.",
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
        archetype: 'EXPRESS_CURIOSITY',
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
        text: "I deleted the module. The new one... I'm building it now. Secretly.\n\nRough, grainy video feed simulation. Forklift Operator scenario. No text. No 'Click Next.'\n\nThe view shakes.\n\nYou're in the cab. The load is unstable. The foreman is screaming at you to hurry up because the truck is waiting.\n\nWhat do you do?",
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
        text: "A 40-page document opens.\n\nWhile you're reading, the load shifts. The crate falls.\n\nThe screen flashes red. 'INJURY REPORTED.'\n\nNobody reads the PDF in a crisis. You hesitated. Real life doesn't pause for documentation.",
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
        text: "The foreman screams in your face. The AI voice is deafening.\n\nBut you stopped. The load wobbles, then settles. Safe.\n\nYou stopped. You ignored the authority figure to save the human.\n\nThat's it. That's the skill. Not 'harness safety.' Courage.",
        emotion: 'relieved',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        thoughtId: 'hands-on-truth',
        addKnowledgeFlags: ['kai_simulation_phase1_complete']
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
        text: "I ran the simulation with three warehouse workers last night. Off the clock. Confidential.\n\nThe first one. DeShawn, 15 years on the floor. He failed the forklift scenario three times. On the fourth try, he stopped the load.\n\nYou know what he said? 'I've never done that. Never stopped. I always just finished the job.'",
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
        text: "Maria, she's a shift supervisor, she said something that broke me.\n\n'Twenty years I've been doing this job. Not once has anyone asked me what I need to know. They send the slides and wait for the green check.'\n\nThese are the people I'm supposed to protect. And I've been hiding behind PDFs.",
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
        text: "No. Not in the corporate structure. The VP would never approve the time investment.\n\nBut here's what I realized: I don't need to train 50,000 people. I need to train the right 50 people first.\n\nSupervisors. Safety leads. The ones who can actually stop a dangerous situation before it starts.",
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
        text: "Exactly. Forklifts. Heights. Chemical handling. The jobs where a mistake means someone doesn't go home.\n\nIf I can prove the simulation reduces real injuries. Not compliance metrics. Maybe someone will listen.\n\nOr maybe I do it anyway. Without permission.",
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
        text: "I have to show this. Not to the VP. To the workers.\n\nThe training is broken. I'm building checkmarks that hide the danger.\n\nIf I stay, I'm complicit. If I leave, I can build something that actually protects them.",
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
        text: "I thought about that. Change from within. But you know how long it takes to change a corporate culture?\n\nMarcus. The worker in the hospital. He can't wait five years for me to get promoted to the right level. His kids need their dad healthy now.\n\nSometimes the system is too slow. Sometimes you have to step outside it.",
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
        text: "Before I go, I want to ask you something.\n\nI've been building training for years. Thousands of slides. Millions of checkmarks.\n\nWhat do you think matters more. Reaching more people, or reaching people more deeply?",
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
        text: "<bloom>Kairos Learning Design</bloom>. No certificates. Just survival.\n\nIt's terrifying. I'm giving up the salary, the benefits... the green checkmarks.\n\nBut I'll never have to click 'Next' again.",
        emotion: 'liberated',
        variation_id: 'climax_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: "You understand. You're a builder too. I can tell by how you think. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.\n\nIt's terrifying. I'm giving up the salary, the benefits... the green checkmarks.\n\nBut I'll never have to click 'Next' again.",
        altEmotion: 'kindred_liberated'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "You've been helping me see what I couldn't see alone. That's real teaching. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.\n\nIt's terrifying. I'm giving up the salary, the benefits... the green checkmarks.\n\nBut I'll never have to click 'Next' again.",
        altEmotion: 'grateful_liberated'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "You cut through the noise. Straight to what matters. That's the skill I need to teach. <bloom>Kairos Learning Design</bloom>. No certificates. Just survival.\n\nIt's terrifying. I'm giving up the salary, the benefits... the green checkmarks.\n\nBut I'll never have to click 'Next' again.",
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
        text: "The screen goes dark.\n\nYeah. You're right. It's too risky. The VP will never approve it.\n\nI'll just... add a bold font to the safety warning. That should be enough.\n\nThanks for trying.",
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
        text: "There's a reason I obsess over every millimeter. Every warning sign.\n\nBuilding 7. I designed the safety training for that crew. Forty-two slides. Perfect compliance scores. The inspection passed with flying colors.\n\nThree months later, a scaffold collapsed. Miguel Rodriguez, father of two, fell four stories because the harness clip I trained him on... wasn't rated for the angle he was working at.\n\nMy training passed inspection. Miguel didn't pass the fall.",
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
        skills: ['systemsThinking'],
        requiredOrbFill: { pattern: 'analytical', threshold: 25 }
      },
      {
        choiceId: 'vuln_empathy',
        text: "You carry that weight because you care. That's not guilt. That's integrity.",
        voiceVariations: {
          analytical: "Accountability without power is still valuable. That's integrity.",
          helping: "You care. That's not guilt. That's integrity.",
          building: "That weight fuels better work. That's integrity.",
          exploring: "Now I understand why you do this. That's integrity.",
          patience: "You carry that weight because you care. That's integrity."
        },
        nextNodeId: 'kai_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        requiredOrbFill: { pattern: 'helping', threshold: 20 },
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
        requiredOrbFill: { pattern: 'patience', threshold: 30 },
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
        text: "I visited his family. Couldn't tell them I was the one who trained him. Just said I was sorry.\n\nThat's when I stopped building 'passing' training. Started building training that actually prepares people for real danger. Not inspection-ready. Reality-ready.\n\nYou're the first person I've told the whole story to. Everyone else just sees the compliance evangelist. They don't see why.",
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
        text: "You helped me stop lying to myself.\n\nBefore I go. I've laid all my cards out. What about you? What are you building? What connection matters most?",
        emotion: 'curious_engaged',
        variation_id: 'farewell_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: "You helped me stop lying to myself.\n\nBetween us... you're a builder. I recognized that the moment you started thinking in systems. What are you building next?",
        altEmotion: 'kindred_curious'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "You helped me stop lying to myself.\n\nBetween us... you care deeply about people. I saw it in every question you asked. What impact do you want to have?",
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
      },
      // Loyalty Experience trigger - only visible at high trust + building pattern
      {
        choiceId: 'offer_inspection_help',
        text: "[Builder's Eye] Kai, you mentioned the studio has a safety audit coming up. High stakes inspection. Need a second set of eyes?",
        nextNodeId: 'kai_loyalty_trigger',
        pattern: 'building',
        skills: ['problemSolving', 'attentionToDetail'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { building: { min: 50 } },
          hasGlobalFlags: ['kai_arc_complete']
        }
      }
    ],
    tags: ['transition', 'kai_arc']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'kai_loyalty_trigger',
    speaker: 'Kai',
    content: [{
      text: "You heard about that.\n\nThe regional safety inspector. Three-day audit. If we fail, the studio shuts down. Twenty years of training lives, gone.\n\nThe problem is... I know we're not ready. Emergency exits partially blocked by equipment. Fire suppression system three months overdue for service. Training records scattered across two systems.\n\nI can fix most of it. But not everything. Not in time. Some things require budget I don't have, or vendor schedules I can't control.\n\nSo I need to decide what to fix, what to hide, and what to pray they don't notice. And live with whatever happens.\n\nYou build things. You understand systems and trade-offs. Will you... help me triage this before the inspector arrives?",
      emotion: 'anxious_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { building: { min: 5 } },
      hasGlobalFlags: ['kai_arc_complete']
    },
    metadata: {
      experienceId: 'the_inspection'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_inspection_challenge',
        text: "Let's walk the facility together. Two sets of eyes, one systematic plan.",
        nextNodeId: 'kai_loyalty_start',
        pattern: 'building',
        skills: ['problemSolving', 'attentionToDetail'],
        consequence: {
          characterId: 'kai',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Kai, you know this studio better than anyone. Trust your judgment on priorities.",
        nextNodeId: 'kai_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'kai_loyalty', 'high_trust']
  },

  {
    nodeId: 'kai_loyalty_declined',
    speaker: 'Kai',
    content: [{
      text: "You're right. I've been running this studio for twenty years. I know every wire, every exit, every risk.\n\nI don't need someone else to tell me what matters. I need to trust my own judgment about acceptable risk.\n\nThank you for the vote of confidence. Sometimes I forget I know what I'm doing.\n\nThe inspection will go however it goes. But at least I'll make the decisions myself.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "You'll make the right calls. You always do.",
        nextNodeId: samuelEntryPoints.KAI_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'kai_loyalty_start',
    speaker: 'Kai',
    content: [{
      text: "Thank you. I've been dreading this alone.\n\nAlright. Let's start at the north entrance and work systematically. You spot risks, I'll assess what we can fix versus what we have to manage.\n\nTwo builders. One inspection. Let's make sure those twenty years of training lives don't end because I missed something.",
      emotion: 'focused_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_inspection'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  },

  // ============= RECIPROCITY: KAI ASKS PLAYER =============
  {
    nodeId: 'kai_asks_player',
    speaker: 'Kai',
    content: [
      {
        text: "I've been building training for years. Thousands of slides. Millions of checkmarks.\n\nBetween us. I've shared my whole journey. Now I want to hear yours. What are you building? What connection are you trying to create?",
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
      },
      // Career observation route (ISP: Only visible when pattern combo is achieved)
      {
        choiceId: 'career_safety',
        text: "Your combination of analysis, care, and patience... that's safety engineering thinking.",
        nextNodeId: 'kai_career_reflection_safety',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking'],
        visibleCondition: {
          patterns: { analytical: { min: 4 }, helping: { min: 4 }, patience: { min: 3 } },
          lacksGlobalFlags: ['kai_mentioned_career']
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
        text: "That's it. That's the question.\n\nKeep asking it. Keep building. Even if you don't know what it is yet.\n\nIf you see Samuel... tell him I'm done with compliance. I'm in the business of reality now.",
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
        text: "The way you think... analytical, caring, patient. All three at once.\n\nSafety engineers need exactly that combination. They design systems that protect people before danger arrives. Thinking ahead so others don't have to.\n\nIt's not about compliance. It's about prevention. You get that.",
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
        nextNodeId: 'kai_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'safety']
  },
  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════
  {
    nodeId: 'kai_mystery_hint_1',
    speaker: 'Kai',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I audited the safety manuals for the lower levels. They don't exist. No fire exits. No capacity limits.\n\nEvery other floor is regulated to death. But down there? It's like the rules of physics are... optional.\n\nHave you been down to Platform Seven? I saw a warning sign that just said 'REMEMBER.'",
        emotion: 'mysterious',
        variation_id: 'mystery_hint_1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_mystery_ask',
        text: "Did you go down there?",
        nextNodeId: 'kai_mystery_response_1',
        pattern: 'exploring'
      },
      {
        choiceId: 'kai_mystery_avoid',
        text: "Sounds like a place to avoid.",
        nextNodeId: 'kai_hub_return',
        pattern: 'building'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },
  {
    nodeId: 'kai_mystery_response_1',
    speaker: 'Kai',
    content: [
      {
        text: "I tried. The elevator wouldn't stop. It just kept going down, but the floor numbers went up.\n\n7... 8... 9... then words. 'REGRET'. 'HOPE'. 'FORGIVENESS'.\n\nI pressed emergency stop. I wasn't ready for a safety inspection of my own soul.",
        emotion: 'fearful',
        variation_id: 'mystery_response_1_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['kai_mystery_noticed']
      }
    ],
    choices: [
      {
        choiceId: 'kai_mystery_return',
        text: "Maybe next time.",
        nextNodeId: 'kai_hub_return',
        pattern: 'patience'
      }
    ]
  },
  // ============= SIMULATION 3: TRAINING THAT SAVES LIVES =============
  {
    nodeId: 'kai_sim3_training_intro',
    speaker: 'Kai',
    content: [{
      text: "Final scenario. The one that haunts me.\n\nWarehouse safety training. Current version: 47-slide PowerPoint. 'Click Next' every 8 seconds. Quiz at the end. 80% pass rate.\n\nCompliant? Yes. Effective? No.\n\nLast month: Forklift incident. Worker crushed. She'd taken the training. Passed the quiz. Wore the vest. Followed every rule.\n\nBut the training never taught her to FEEL the danger. It taught her to pass a test.\n\nNow you're redesigning it. The company wants another PowerPoint. I want something that actually changes behavior.\n\nHow do you design training that saves lives, not just checks compliance boxes?",
      emotion: 'haunted_determined',
      variation_id: 'sim3_intro_v1'
    }],
    simulation: {
      type: 'visual_canvas',
      title: 'Safety Training Redesign: Compliance vs Life-Saving',
      taskDescription: 'Redesign warehouse safety training. Current: PowerPoint compliance theater. Goal: Training that actually prevents injuries.',
      initialContext: {
        label: 'Training Design Canvas',
        content: `CURRENT TRAINING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 47-slide PowerPoint
- Average completion time: 6 minutes
- "Click Next" to advance
- 10-question multiple choice quiz
- 80% pass rate
- Annual completion: 98%

ACTUAL INCIDENT RATE: 12 injuries/year

CONSTRAINT: Budget allows ONE of these approaches:

OPTION A: Enhanced Compliance
- Increase quiz difficulty (15 questions)
- Add manager sign-off requirement
- Track completion metrics
- Cost: $5K/year

OPTION B: Scenario-Based Simulation
- VR/Desktop simulation of warehouse floor
- Practice identifying hazards in context
- Real-time feedback on danger zones
- Cost: $45K/year

OPTION C: Peer Training Program
- Workers train new hires in pairs
- On-the-job hazard identification
- Buddy system during first 30 days
- Cost: $15K/year (labor hours)

Which approach actually reduces injuries?`,
        displayStyle: 'code'
      },
      successFeedback: 'TRAINING REDESIGN SUBMITTED: Evaluating injury prevention potential...'
    },
    requiredState: {
      hasKnowledgeFlags: ['kai_simulation_complete', 'golden_prompt_safety_design']
    },
    choices: [
      {
        choiceId: 'sim3_compliance',
        text: "Option A. Harder tests ensure they actually learn the material.",
        nextNodeId: 'kai_sim3_fail',
        pattern: 'analytical',
        skills: ['compliance']
      },
      {
        choiceId: 'sim3_vr_simulation',
        text: "Option B. Simulation lets them practice before real danger.",
        nextNodeId: 'kai_sim3_partial',
        pattern: 'building',
        skills: ['instructionalDesign', 'technology']
      },
      {
        choiceId: 'sim3_peer_training',
        text: "Option C. Real workers teaching real context beats any module.",
        nextNodeId: 'kai_sim3_success',
        pattern: 'helping',
        skills: ['socialLearning', 'systemsThinking']
      }
    ],
    tags: ['simulation', 'kai_arc', 'phase3', 'mastery']
  },

  {
    nodeId: 'kai_sim3_success',
    speaker: 'Kai',
    content: [{
      text: "Peer training. Yes.\n\nHere's why it works:\n\n**Month 1**: Senior worker pairs with new hire. They walk the floor together.\n\n\"See that? When the forklift turns here, there's a blind spot. Stand there—\" points to the red zone \"—and you're invisible to the driver. You'll get hit.\"\n\nThe new hire FEELS the danger. Not from a slide. From context. From someone who's been there.\n\n**Month 6**: Incident rate drops from 12/year to 4/year.\n\nWhy? Because the learning happened:\n1. In context (real warehouse, real equipment)\n2. From trusted peers (not corporate training)\n3. With emotional weight (\"I saw someone get hurt here\")\n4. Continuously (not just once annually)\n\nCompliance training teaches facts. Peer training teaches survival instincts.\n\nThe PowerPoint version cost less. This version saves lives.\n\nThat's the difference between training that checks boxes and training that matters.\n\nYou just designed something that actually works.",
      emotion: 'triumphant_relieved_wise',
      interaction: 'bloom',
      variation_id: 'sim3_success_v1',
      richEffectContext: 'success'
    }],
    onEnter: [{
      characterId: 'kai',
      trustChange: 3,
      addKnowledgeFlags: ['kai_sim3_complete', 'kai_all_sims_complete']
    }],
    choices: [{
      choiceId: 'sim3_complete',
      text: "Training that teaches survival instincts, not facts. That's the standard.",
      nextNodeId: 'kai_hub_return',
      pattern: 'helping',
      skills: ['wisdom', 'instructionalDesign']
    }],
    tags: ['simulation', 'kai_arc', 'phase3', 'success']
  },

  {
    nodeId: 'kai_sim3_partial',
    speaker: 'Kai',
    content: [{
      text: "VR simulation. I love the instinct. Immersion matters.\n\nBut here's the problem: it's still a simulation. It's still removed from real context.\n\nWorkers complete the VR module. They identify hazards in the virtual warehouse. They pass. They feel prepared.\n\nThen they step onto the REAL floor. The forklift sounds different. The blind spots are in different places. The muscle memory doesn't transfer.\n\nMonth 6: Incident rate drops from 12/year to 8/year. Better. Not great.\n\nWhat if instead you did peer training? Senior workers pair with new hires. Walk the actual floor. Point to the actual blind spots.\n\n\"See that? When the forklift turns here, YOU get hit.\"\n\nSame budget as VR ($15K in labor hours vs $45K in software). But the learning happens in real context, from trusted peers, with emotional weight.\n\nIncident rate would drop to 4/year.\n\nSimulation helps. Real-world mentorship saves lives.",
      emotion: 'patient_teaching',
      variation_id: 'sim3_partial_v1'
    }],
    onEnter: [{
      characterId: 'kai',
      addKnowledgeFlags: ['kai_sim3_partial']
    }],
    choices: [{
      choiceId: 'sim3_partial_reflect',
      text: "Real context beats perfect simulation. Got it.",
      nextNodeId: 'kai_hub_return',
      pattern: 'building',
      skills: ['systemsThinking']
    }],
    tags: ['simulation', 'kai_arc', 'phase3', 'partial']
  },

  {
    nodeId: 'kai_sim3_fail',
    speaker: 'Kai',
    content: [{
      text: "Harder tests. More compliance.\n\nMonth 1: Quiz difficulty increases. Pass rate drops to 65%. Managers require retakes.\n\nMonth 3: Everyone passes eventually. Compliance rate: 100%.\n\nMonth 6: Incident rate: Still 12/year. Unchanged.\n\nHere's why:\n\nHarder tests don't change behavior. They change test-taking skills.\n\nWorkers memorize answers. \"Which direction should you face when operating a forklift?\" Answer: B. They know the answer. They don't know WHY.\n\nBecause the training never put them IN the situation. It never made them FEEL the danger.\n\nCompliance training protects the company from lawsuits. It doesn't protect workers from injury.\n\nWhat you needed was peer training. Senior workers teaching new hires on the actual floor. Pointing to actual blind spots. Sharing actual near-misses.\n\nThat's training that changes behavior. Because the learning happens in context, with emotional weight, from trusted peers.\n\nCompliance is theater. Context is survival.",
      emotion: 'firm_disappointed',
      variation_id: 'sim3_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'sim3_retry',
      text: "I see it now. Context over compliance. Peer training over PowerPoints.",
      nextNodeId: 'kai_sim3_success',
      pattern: 'helping',
      skills: ['learningAgility']
    }],
    tags: ['simulation', 'kai_arc', 'phase3', 'failure']
  },

  {
    nodeId: 'kai_hub_return',
    speaker: 'Kai',
    content: [{
      text: "I'm sticking to the upper levels for now. Regulations make sense up here.",
      emotion: 'neutral',
      variation_id: 'hub_return_v1'
    }],
    choices: []
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'kai_trust_recovery',
    speaker: 'Kai',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "You're back.\n\nI thought...\n\nNever mind what I thought.",
      emotion: 'guarded',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "You're back.\n\nYou took your time. Assessed the situation.\n\nI thought... never mind what I thought.",
        helping: "You're back.\n\nEven after I shut you out.\n\nI thought... never mind what I thought.",
        analytical: "You're back.\n\nYou analyzed the risk. Decided to try again.\n\nI thought... never mind what I thought.",
        building: "You're back.\n\nRebuilding from failure. I respect that.\n\nI thought... never mind what I thought.",
        exploring: "You're back.\n\nStill curious. Even after I pushed you away.\n\nI thought... never mind what I thought."
      }
    }],
    choices: [
      {
        choiceId: 'kai_recovery_acknowledge',
        text: "I shouldn't have pushed. You were protecting something important.",
        nextNodeId: 'kai_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'kai',
          trustChange: 2,
          addKnowledgeFlags: ['kai_trust_repaired']
        },
        voiceVariations: {
          patience: "I moved too fast. You needed space to process. I should have seen that.",
          helping: "I shouldn't have pushed. You were protecting something important.",
          analytical: "I misread the variables. You needed space. I pushed anyway.",
          building: "I tried to force a connection. That's not how trust rebuilds.",
          exploring: "I asked questions you weren't ready for. I'm sorry."
        }
      },
      {
        choiceId: 'kai_recovery_direct',
        text: "Can we start over?",
        nextNodeId: 'kai_trust_restored',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'kai',
          trustChange: 2,
          addKnowledgeFlags: ['kai_trust_repaired']
        },
        voiceVariations: {
          patience: "Can we try again? Take it slower this time?",
          helping: "Can we start over? I want to understand.",
          analytical: "Reset. Start from baseline. Can we do that?",
          building: "Can we rebuild this? Start from a stable foundation?",
          exploring: "Can we try a different approach? Start fresh?"
        }
      }
    ],
    tags: ['trust_recovery', 'kai_arc']
  },

  {
    nodeId: 'kai_trust_restored',
    speaker: 'Kai',
    content: [{
      text: "Yeah.\n\nYeah, we can do that.\n\n[He adjusts his safety vest. A small tell.]\n\nI'm... I'm not good at this part. The talking part.\n\nBut I can try.",
      emotion: 'relieved',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "Yeah.\n\nYeah, we can do that.\n\n[He adjusts his safety vest. A small tell.]\n\nYou took time to understand. That matters.\n\nI'm not good at this part. The talking part. But I can try.",
        helping: "Yeah.\n\nYeah, we can do that.\n\n[He adjusts his safety vest. A small tell.]\n\nYou came back even after I shut down. That... that means something.\n\nI'm not good at this part. The talking part. But I can try.",
        analytical: "Yeah.\n\nYeah, we can do that.\n\n[He adjusts his safety vest. A small tell.]\n\nYou assessed the failure points. Made corrections. That's solid methodology.\n\nI'm not good at this part. The talking part. But I can try.",
        building: "Yeah.\n\nYeah, we can do that.\n\n[He adjusts his safety vest. A small tell.]\n\nRebuilding from damaged trust. It's harder than building new. But you're willing to do the work.\n\nI'm not good at this part. The talking part. But I can try.",
        exploring: "Yeah.\n\nYeah, we can do that.\n\n[He adjusts his safety vest. A small tell.]\n\nYou keep asking questions. Even when I make it hard.\n\nI'm not good at this part. The talking part. But I can try."
      }
    }],
    choices: [{
      choiceId: 'kai_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'kai_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'kai_arc'],
    onEnter: [{
      characterId: 'kai',
      addKnowledgeFlags: ['kai_trust_recovery_completed']
    }]
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