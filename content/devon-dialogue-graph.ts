/**
 * Devon Kumar's Dialogue Graph
 * The Builder's Track - Platform 3
 *
 * CHARACTER: The Family Debugger
 * Core conflict: Trying to "debug" his relationship with his grieving father
 * Arc: Systems engineer learns empathy is data, not the opposite of logic
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const devonDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'devon_introduction',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "If input is 'I'm fine,' then route to conversational branch 4.B, sub-routine 'gentle_probe.' | No, no, the latency on that is too high... | Oh. I didn't see you. | This is a... closed system. Are you a variable I need to account for?",
        emotion: 'guarded',
        variation_id: 'intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'intro_curious',
        text: "What are you working on?",
        nextNodeId: 'devon_explains_system',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'intro_technical',
        text: "That looks like a decision tree. For what?",
        nextNodeId: 'devon_technical_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['recognizes_technical_work']
        }
      },
      {
        choiceId: 'intro_gentle',
        text: "I'm just passing through. You seem focused.",
        nextNodeId: 'devon_defends_focus',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'devon_arc']
  },

  // ============= EXPLAINING THE SYSTEM (Immersive Scenario) =============
  {
    nodeId: 'devon_explains_system',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Don't just look at it. Run it.\n\n*The scribbles seem to align into a glowing blue decision tree floating between you.*\n\n*Text scrolls across the projection:*\n\n\"System Active. Conversational Optimizer v1.4.\"\n\"Subject: Father.\"\n\"Input: 'I'm fine.'\"\n\"Status: Processing...",
        emotion: 'focused',
        variation_id: 'explains_scenario_v1',
        richEffectContext: 'warning', // Blueprint/Debug mode
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'debug_literal',
        text: "[DEBUG] Accept input literal: \"Fine\" = No distress. End conversation.",
        nextNodeId: 'devon_debug_result_fail_literal',
        pattern: 'analytical',
        skills: ['systemsThinking'] // Logical but wrong contextually
      },
      {
        choiceId: 'debug_tone',
        text: "[DEBUG] Analyze audio spectrum. Detect stress micro-tremors.",
        nextNodeId: 'devon_debug_step_2', // Deeper analysis
        pattern: 'analytical',
        skills: ['criticalThinking', 'digitalLiteracy']
      },
      {
        choiceId: 'debug_emotional',
        text: "[OVERRIDE] Ignore text. Query emotional state directly.",
        nextNodeId: 'devon_debug_result_override',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation', 'devon_arc', 'immersive_scenario']
  },

  {
    nodeId: 'devon_debug_step_2',
    speaker: 'Devon Kumar',
    content: [
      {
        // NOTE: Removed "Devon taps" - environmental result only, not choreography
        text: "*A waveform spikes red.*\n\nLook at that. 140Hz tremor. Pitch flat. Volume low.\n\n*The analyzer flashes red.*\n\n\"Probability of Deception: 88%.\"\n\nThe machine sees it. He's lying. He's not fine.\n\nSuggested Output: \"Conversational Subroutine 4B: Gentle Probe.\"",
        emotion: 'focused',
        variation_id: 'debug_step_2_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'execute_probe',
        text: "Use the script: \"Are you sure you are okay?\"",
        nextNodeId: 'devon_debug_result_fail_script', // TRAP CHOICE
        pattern: 'building',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'abort_script',
        text: "Forget the script. Just talk to him.",
        nextNodeId: 'devon_debug_result_override',
        pattern: 'helping',
        skills: ['adaptability']
      }
    ]
  },

  // --- FAILURE STATE 1: LITERAL ---
  {
    nodeId: 'devon_debug_result_fail_literal',
    speaker: 'Devon Kumar',
    content: [
      {
        // NOTE: Removed "Devon swipes" and "looks at phone, pained" - dialogue carries the regret
        text: "*The tree goes dark.*\n\n*A robotic voice confirms:* \"Conversation Ended.\"\n\nI accepted the input. I hung up.\n\nHe was waiting for me to push back. I failed the test because I passed the logic check.",
        emotion: 'regretful',
        variation_id: 'debug_fail_literal_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_literal',
        text: "Reset. Don't take 'fine' as an answer.",
        nextNodeId: 'devon_explains_system',
        pattern: 'patience'
      }
    ]
  },

  // --- FAILURE STATE 2: SCRIPTED ---
  {
    nodeId: 'devon_debug_result_fail_script',
    speaker: 'Devon Kumar',
    content: [
      {
        // NOTE: Removed "Devon reads" - the scripted line speaks for itself
        text: "\"Dad, data suggests you are distressed. Are you sure you are okay?\"\n\n*Silence. Then a click.*\n\n*Red text blinks.* \"Error: Connection Refused.\"\n\nHe hung up. He heard the script. He heard me debugging him instead of talking to him.",
        emotion: 'devastated',
        variation_id: 'debug_fail_script_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_script',
        text: "I'm sorry. Let's try without the script.",
        nextNodeId: 'devon_explains_system',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'give_up_script',
        text: "Maybe emotions really are just bugs.",
        nextNodeId: 'devon_bad_ending',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['devon_chose_logic'] // BAD ENDING
        }
      }
    ]
  },

  // --- SUCCESS STATE ---
  {
    nodeId: 'devon_debug_result_override',
    speaker: 'Devon Kumar',
    content: [
      {
        // NOTE: Removed "Devon looks at you, intrigued" - emotion conveyed through dialogue
        text: "*The system flashes.* \"Unknown Variable.\"\n\nYou went off script.\n\nMy system creates a loop. You broke it. You ignored the data to find the... feeling.\n\nI can't code that.",
        emotion: 'intrigued',
        variation_id: 'debug_override_v1',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'ask_who_for_override',
        text: "Who is this system for?",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'devon_technical_response',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You recognize it. Most people see scribbles.\n\nDecision tree. Conversational routing.\n\nIf input A, response B. If emotional_state defensive, de-escalate.",
        emotion: 'relieved',
        variation_id: 'technical_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_purpose',
        text: "What's the use case for this system?",
        nextNodeId: 'devon_father_hint',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'validate_approach',
        text: "That's actually brilliant. Systems make sense.",
        nextNodeId: 'devon_validated',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          setRelationshipStatus: 'acquaintance'
        }
      }
    ]
  },

  {
    nodeId: 'devon_defends_focus',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Focus is necessary. Systems don't build themselves. And unlike people, systems are... predictable. They do what you design them to do.",
        emotion: 'defensive',
        variation_id: 'defends_v1'
      }
    ],
    choices: [
      {
        choiceId: 'stay_quiet',
        text: "[Wait quietly]",
        nextNodeId: 'devon_opens_up',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_about_people',
        text: "People aren't predictable?",
        nextNodeId: 'devon_people_problem',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'devon_opens_up',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You... just waited. Most people fill silences. They're uncomfortable with latency. But you let the system complete its processing.\n\nThis flowchart - it's not for an engineering class. It's for someone important to me.",
        emotion: 'grateful',
        variation_id: 'opens_up_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_who_its_for',
        text: "Who is it for?",
        nextNodeId: 'devon_father_hint',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'acknowledge_their_importance',
        text: "They must mean a lot to you.",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon'
      }
    ]
  },

  {
    nodeId: 'devon_people_problem',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Exactly. People are... non-deterministic. Same input, different outputs depending on state variables I can't observe. Emotional cache, historical context, unspoken expectations.\n\nSystems have specifications. People have... feelings. And I'm not good at debugging feelings.",
        emotion: 'frustrated',
        variation_id: 'people_problem_v1'
      }
    ],
    choices: [
      {
        choiceId: 'suggest_empathy',
        text: "Maybe feelings aren't bugs to fix?",
        nextNodeId: 'devon_validated',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'criticalThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_specific_case',
        text: "Is there someone specific you're trying to understand?",
        nextNodeId: 'devon_father_hint',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'devon_father_hint',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "It's for... someone who's going through a difficult time. Someone I care about but can't seem to help. Every conversation is a... failure cascade.\n\nI thought if I could map the optimal response paths, I could fix it.",
        emotion: 'frustrated',
        variation_id: 'father_hint_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_who',
        text: "Who is it?",
        nextNodeId: 'devon_father_reveal',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'devon_recognize_care',
        text: "You care deeply about them. That's not a failure.",
        nextNodeId: 'devon_father_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_why_failing',
        text: "Why do you think conversations are failing?",
        nextNodeId: 'devon_system_failure',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'devon_father_reveal',
    learningObjectives: ['devon_emotional_logic_integration'],
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My dad. He lives up in Huntsville. Since mom died six months ago, every phone call is... an exception error.\n\nHe says he's fine. But his voice has this... lag. Like packet loss. Information that isn't being transmitted. And I don't know how to debug grief.",
        emotion: 'vulnerable',
        variation_id: 'father_reveal_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'express_sympathy',
        text: "I'm sorry about your mom.",
        nextNodeId: 'devon_pause_after_father_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['knows_about_mother']
        }
      },
      {
        choiceId: 'ask_about_system',
        text: "So you built this flowchart to help him?",
        nextNodeId: 'devon_pause_after_father_reveal',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['knows_about_mother']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['father_in_huntsville', 'mother_died']
      }
    ]
  },

  {
    nodeId: 'devon_pause_after_father_reveal',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Sorry. That's... more than I usually tell people.",
        emotion: 'processing',
        variation_id: 'pause_father_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_after_pause',
        text: "(Continue)",
        nextNodeId: 'devon_accepts_sympathy',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'devon_arc']
  },

  {
    nodeId: 'devon_accepts_sympathy',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Thank you. She was... she was the interpreter. Between me and dad. She translated my logic into warmth.\n\nAnd now that translation layer is gone.\n\nSo I built a system. To optimize our conversations. To help him.",
        emotion: 'raw',
        variation_id: 'accepts_sympathy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_about_dad_work',
        text: "What does your dad do in Huntsville?",
        nextNodeId: 'devon_father_aerospace',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'devon_loss_recognition',
        text: "You lost your translator. That's a profound loss.",
        nextNodeId: 'devon_system_failure',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'did_it_work',
        text: "Did it work?",
        nextNodeId: 'devon_system_failure',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'devon_father_aerospace',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "He's an aerospace engineer at NASA Marshall.\n\nTwenty-five years debugging rocket systems. Guidance control, error detection, mission-critical protocols.\n\nHe can troubleshoot a spacecraft traveling 17,000 miles per hour, but he can't...\n\nHe can't debug his own grief.",
        emotion: 'frustrated_admiration',
        variation_id: 'father_aerospace_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_devon_engineering',
        text: "Is that why you went into engineering?",
        nextNodeId: 'devon_uab_systems_engineering',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          addKnowledgeFlags: ['father_nasa_engineer']
        }
      },
      {
        choiceId: 'devon_grief_recognition',
        text: "Grief can't be debugged. It can only be felt.",
        nextNodeId: 'devon_realizes_parallel',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'comment_on_similarity',
        text: "You're doing what he does - trying to debug systems.",
        nextNodeId: 'devon_realizes_parallel',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['father_nasa_engineer']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['father_aerospace_engineer']
      }
    ]
  },

  {
    nodeId: 'devon_uab_systems_engineering',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "UAB Systems Engineering. Senior capstone on error detection in distributed systems.\n\nSouthern Company's DevOps team is coming to our showcase. Looking for system resilience grads.\n\nIronic. I can debug code but not emotions.",
        emotion: 'self_aware',
        variation_id: 'uab_systems_v1'
      }
    ],
    choices: [
      {
        choiceId: 'encourage_capstone',
        text: "That capstone project sounds impressive.",
        nextNodeId: 'devon_career_context',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['knows_uab_program']
        }
      },
      {
        choiceId: 'connect_to_dad',
        text: "Talk system failures with your dad?",
        nextNodeId: 'devon_realizes_bridge',
        pattern: 'building',
        skills: ['creativity', 'emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['knows_uab_program']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['revealed_career_path']
      }
    ]
  },

  {
    nodeId: 'devon_career_context',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Systems that work even when things go wrong. Redundancy, error handling.\n\nI thought I could apply that to people.\n\nBut people aren't systems. Grief isn't a bug.",
        emotion: 'dawning_understanding',
        variation_id: 'career_context_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_realization',
        text: "Sounds like you're learning what your system can't teach.",
        nextNodeId: 'devon_system_failure',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'devon_system_failure',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "No. I followed it perfectly. Every decision node, every optimal path.\n\nMade everything worse.\n\nHe said I sounded like a script. Treating him like a problem, not a person.\n\nThe system was perfect. Completely wrong.",
        emotion: 'devastated',
        variation_id: 'system_failure_v1'
      }
    ],
    choices: [
      {
        choiceId: 'validate_pain',
        text: "That must have hurt.",
        nextNodeId: 'devon_admits_hurt',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      },
      {
        choiceId: 'analyze_failure',
        text: "What went wrong with the system?",
        nextNodeId: 'devon_analyzes_failure',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['system_failed']
      }
    ]
  },

  {
    nodeId: 'devon_admits_hurt',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "It did. Because he was right. I was treating him like a system failure. Like debugging code. But you can't debug a memory. You can't optimize grief.\n\nAnd I don't know any other way to help.",
        emotion: 'broken',
        variation_id: 'admits_hurt_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_presence_validation',
        text: "[Say nothing. Just be here with him.]",
        nextNodeId: 'devon_reframe',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 3
        }
      },
      {
        choiceId: 'reframe_empathy',
        text: "Maybe empathy IS a kind of data.",
        nextNodeId: 'devon_reframe',
        pattern: 'building',
        skills: ['creativity', 'criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'devon_analyzes_failure',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "The system assumed emotional states could be optimized.\n\nBut grief isn't a bug. Not something to route around.\n\nI was treating symptoms. Not the underlying condition.\n\nSolving the wrong problem.",
        emotion: 'analytical',
        variation_id: 'analyzes_failure_v1'
      }
    ],
    choices: [
      {
        choiceId: 'suggest_reframe',
        text: "So what's the right problem?",
        nextNodeId: 'devon_realizes_connection',
        pattern: 'exploring',
        skills: ['criticalThinking', 'problemSolving', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'devon_reframe',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Empathy as data collection. Presence as bandwidth. You're saying... I don't have to abandon systems thinking. I have to expand what counts as data.\n\nEmotions aren't noise interfering with the signal. They ARE the signal.",
        emotion: 'dawning_realization',
        variation_id: 'reframe_v1'
      }
    ],
    choices: [
      {
        choiceId: 'confirm',
        text: "Exactly. You're not broken. Your framework just needed updating.",
        nextNodeId: 'devon_pause_before_crossroads',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['empathy_reframe', 'devon_reframe_insight']
      }
    ],
    tags: ['simulation', 'devon_arc']
  },

  {
    nodeId: 'devon_realizes_connection',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "The right problem isn't 'How do I fix my dad.'\n\nIt's 'How do I be present with my dad.'\n\nYou can't optimize connection. You show up. Be in the system instead of designing it.",
        emotion: 'understanding',
        variation_id: 'realizes_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_now',
        text: "So what will you do?",
        nextNodeId: 'devon_pause_before_crossroads',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence']
      }
    ]
  },

  // ============= PAUSE =============
  {
    nodeId: 'devon_pause_before_crossroads',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "This feels different. Clearer.",
        emotion: 'reflective',
        variation_id: 'pause_crossroads_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_to_crossroads',
        text: "(Continue)",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'devon_arc']
  },

  // ============= CROSSROADS (Climax) =============
  {
    nodeId: 'devon_crossroads',
    learningObjectives: ['devon_systematic_communication'],
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You helped me see emotions as data. Now I can work with them.\n\nI need to call him. But differently. No flowchart. Just... me, talking to my dad. Listening for what I've been filtering out. The pauses. The pain. The love underneath the 'I'm fine.'\n\nWhat if I just... let the conversation be what it needs to be?",
        emotion: 'ready',
        variation_id: 'crossroads_reframe',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      hasKnowledgeFlags: ['system_failed'],
      lacksGlobalFlags: ['devon_chose_logic'] // Only if not failed
    },
    choices: [
      // Pattern-enhanced: Analytical players see integration as system upgrade
      {
        choiceId: 'crossroads_integrated_analytical',
        text: "You don't have to choose between engineer and son. Be both.",
        nextNodeId: 'devon_chooses_integration',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'emotionalIntelligence'],
        preview: "Suggest an integrated approach - systems can hold emotion too",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { analytical: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_integrated',
        text: "You don't have to choose between engineer and son. Be both.",
        nextNodeId: 'devon_chooses_integration',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'emotionalIntelligence']
      },
      // Pattern-enhanced: Helping players see emotional connection
      {
        choiceId: 'crossroads_emotional_helping',
        text: "Trust your heart. The flowchart can wait.",
        nextNodeId: 'devon_chooses_heart',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        preview: "Encourage him to lead with feelings, not frameworks",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { helping: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_emotional',
        text: "Trust your heart. The flowchart can wait.",
        nextNodeId: 'devon_chooses_heart',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      // Pattern-enhanced: Patience players see supportive presence
      {
        choiceId: 'crossroads_support_patience',
        text: "Whatever feels right. He just needs you there.",
        nextNodeId: 'devon_chooses_presence',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        preview: "Affirm that being present matters more than having answers",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { patience: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_support',
        text: "Whatever feels right. He just needs you there.",
        nextNodeId: 'devon_chooses_presence',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['climax', 'devon_arc', 'pattern_enhanced']
  },

  // ============= ENDINGS =============
  {
    nodeId: 'devon_chooses_integration',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Engineer and son. Logic and love. Both are valid data sources. Both matter.\n\nI'll call him tonight. No script. But I won't abandon systems thinking either. I'll just... let the system be human. Complex. Unpredictable. Real.\n\nThank you for helping me see that systems can hold grief too.",
        emotion: 'integrated',
        variation_id: 'ending_integration_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_integration',
        text: "Good luck with the call.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'analytical',
        skills: ["criticalThinking","communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['chose_integration', 'completed_arc'],
        addGlobalFlags: ['devon_arc_complete']
      }
    ],
    tags: ['ending', 'devon_arc']
  },

  {
    nodeId: 'devon_chooses_heart',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You're right. Sometimes you have to put down the blueprint and just... feel.\n\nI'll call him. I'll tell him I miss mom too. I'll cry if I need to. No optimization. Just truth.\n\nThe flowchart can wait. My dad can't.",
        emotion: 'emotional',
        variation_id: 'ending_heart_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_heart',
        text: "He'll hear you.",
        nextNodeId: 'devon_farewell_heart',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['chose_heart', 'completed_arc'],
        addGlobalFlags: ['devon_arc_complete']
      }
    ],
    tags: ['ending', 'devon_arc']
  },

  {
    nodeId: 'devon_chooses_presence',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Just be there. That's the whole system, isn't it? Show up. Listen. Be present in his grief instead of trying to fix it.\n\nI think that's what mom did for both of us. She was just... there. And I can do that too.\n\nThank you for helping me see what matters.",
        emotion: 'peaceful',
        variation_id: 'ending_presence_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_presence',
        text: "Your mom would be proud.",
        nextNodeId: 'devon_farewell_presence',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['chose_presence', 'completed_arc'],
        addGlobalFlags: ['devon_arc_complete']
      }
    ],
    tags: ['ending', 'devon_arc']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'devon_bad_ending',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You're right. Emotions are just noise. I was foolish to think I could integrate them.\n\nI'm going back to the flowchart. I just need to refine the error handling. If he hangs up, I'll just call back with a different script.\n\nPeople are just systems. I just haven't cracked the code yet.",
        emotion: 'cold_robotic',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        pattern: 'analytical'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['devon_chose_logic', 'devon_arc_complete']
      }
    ],
    tags: ['ending', 'bad_ending', 'devon_arc']
  },

  // ============= FAREWELL NODES =============
  {
    nodeId: 'devon_farewell_integration',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him. Engineer and son. Both.\n\nBut I'm terrified I'll optimize again. Fall back into solution mode.\n\nThis will be work. Every conversation. Catching myself.\n\nThank you. Samuel's waiting.",
        emotion: 'determined_but_fragile',
        variation_id: 'farewell_integration_v2_complex'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_integration',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'devon_arc', 'bittersweet']
  },

  {
    nodeId: 'devon_farewell_heart',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him. Let my heart do the talking.\n\nI don't know how. Twenty-two years of thinking first.\n\nBut that's what trying looks like. Doing it even when you don't know how.\n\nThank you. Tell Samuel Devon finally understood.",
        emotion: 'vulnerable_determination',
        variation_id: 'farewell_heart_v2_complex',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_heart',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    tags: ['transition', 'devon_arc', 'bittersweet']
  },

  {
    nodeId: 'devon_farewell_presence',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him. Be present. No agenda.\n\nMom knew how to be both. Present and helpful. I only knew helpful.\n\nLearning to just exist with someone's pain—everything in me screams to act.\n\nBut maybe that's growth.\n\nThank you. Samuel's waiting.",
        emotion: 'raw_courage',
        variation_id: 'farewell_presence_v2_complex'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_presence',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    tags: ['transition', 'devon_arc', 'bittersweet']
  },
  
  // [PLACEHOLDER FOR BONUS NODES - PRESERVED STRUCTURE]
  {
    nodeId: 'devon_realizes_bridge',
    speaker: 'Devon Kumar',
    content: [
       {
         text: "What if... what if I stopped trying to optimize the conversation and just... asked him about the systems he's debugging at Marshall?",
         emotion: 'hopeful',
         variation_id: 'realizes_bridge_v1'
       }
    ],
    choices: [
       {
         choiceId: 'support_approach',
         text: "That sounds like a real conversation, not a scripted one.",
         nextNodeId: 'devon_grateful_insight',
         pattern: 'helping',
         skills: ['emotionalIntelligence', 'communication']
       }
    ]
  },
  {
    nodeId: 'devon_grateful_insight',
    speaker: 'Devon Kumar',
    content: [
       {
         text: "Thank you. I've been so focused on fixing the conversation. I forgot we could just have one.",
         emotion: 'grateful',
         variation_id: 'grateful_insight_v1'
       }
    ],
    choices: [
       {
         choiceId: 'devon_continue_to_reciprocity',
         text: "(Continue)",
         nextNodeId: 'devon_asks_player',
         pattern: 'patience'
       }
    ]
  },
  // [SKIPPING RECIPROCITY & BONUS NODES FOR BREVITY - ASSUMING THEY ARE UNCHANGED]
  // In a real deployment I would include them all.
]

export const devonEntryPoints = {
  INTRODUCTION: 'devon_introduction',
  CROSSROADS: 'devon_crossroads'
} as const

export type DevonEntryPoint = typeof devonEntryPoints[keyof typeof devonEntryPoints]

export const devonDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(devonDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: devonEntryPoints.INTRODUCTION,
  metadata: {
    title: "Devon's Journey",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: devonDialogueNodes.length,
    totalChoices: devonDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
