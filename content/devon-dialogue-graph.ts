/**
 * Devon Kumar's Dialogue Graph
 * The Builder's Track - Platform 3
 *
 * CHARACTER: The Family Debugger
 * Core conflict: Trying to "debug" his relationship with his grieving father
 * Arc: Systems engineer learns empathy is data, not the opposite of logic
 * Voice: Precise, technical, uncomfortable with emotional ambiguity
 *
 * Background: Engineering student at UAB, father in Huntsville
 * Recently widowed father, Devon built conversational flowchart to "help"
 * System failed catastrophically - logic interpreted as coldness
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
        text: "If input is 'I'm fine,' then route to conversational branch 4.B, sub-routine 'gentle_probe.' | No, no, the latency on that is too high... | *He finally notices you, his posture immediately becoming guarded.* | Oh. I didn't see you. | This is a... closed system. Are you a variable I need to account for?",
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
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['recognizes_technical_work']
        }
      },
      {
        choiceId: 'intro_gentle',
        text: "I'm just passing through. You seem focused.",
        nextNodeId: 'devon_defends_focus',
        pattern: 'patience'
      }
    ]
  },

  // ============= EXPLAINING THE SYSTEM =============
  {
    nodeId: 'devon_explains_system',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "It's an optimization system. A conversational flowchart. You map inputs - what someone says - to outputs - appropriate responses. Like error handling in code, but for humans.\n\nI'm trying to reduce latency in communication. Make interactions more... efficient.",
        emotion: 'matter-of-fact',
        variation_id: 'explains_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_why_need',
        text: "Why do you need a system for conversations?",
        nextNodeId: 'devon_why_system',
        pattern: 'exploring',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_who_for',
        text: "Who is this for?",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
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
        text: "*His guarded posture relaxes slightly*\n\nYou recognize the structure. Most people just see... scribbles. Yes, it's a decision tree. Conversational routing logic.\n\nIf input A, then response B. If emotional_state == 'defensive', route to de-escalation subroutine. That kind of thing.",
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
        text: "Focus is necessary. Systems don't build themselves. And unlike people, systems are... predictable. They do what you design them to do.\n\n*He returns to his flowchart, but you can tell he's still aware of your presence*",
        emotion: 'defensive',
        variation_id: 'defends_v1'
      }
    ],
    choices: [
      {
        choiceId: 'stay_quiet',
        text: "*Wait quietly*",
        nextNodeId: 'devon_opens_up',
        pattern: 'patience',
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_about_people',
        text: "People aren't predictable?",
        nextNodeId: 'devon_people_problem',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'devon_opens_up',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*After a long silence, he looks up. There's something different in his eyes - recognition, maybe*\n\nYou... just waited. Most people fill silences. They're uncomfortable with latency. But you let the system complete its processing.\n\n*He sets down his pen*\n\nThis flowchart - it's not for an engineering class. It's for someone important to me.",
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
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['respected_his_process']
      }
    ]
  },

  {
    nodeId: 'devon_people_problem',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*He looks up sharply, as if you've identified the core bug*\n\nExactly. People are... non-deterministic. Same input, different outputs depending on state variables I can't observe. Emotional cache, historical context, unspoken expectations.\n\nSystems have specifications. People have... feelings. And I'm not good at debugging feelings.",
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
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  // ============= BUILDING TRUST =============
  {
    nodeId: 'devon_why_system',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Because conversations have failure modes. Misunderstandings, emotional escalations, unintended offenses. If you map the topology of a conversation in advance, you can route around the failure points.\n\nSystems thinking. It works for electrical grids. Why not for communication?",
        emotion: 'earnest',
        variation_id: 'why_system_v1'
      }
    ],
    choices: [
      {
        choiceId: 'who_is_this_for',
        text: "Is there someone specific you're trying to talk to?",
        nextNodeId: 'devon_father_reveal',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_assumption',
        text: "But conversations aren't circuits. There's unpredictability.",
        nextNodeId: 'devon_defends_logic',
        pattern: 'analytical'
      }
    ]
  },

  {
    nodeId: 'devon_validated',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*For the first time, he makes eye contact*\n\nThank you. Most people think I'm... cold. That I don't care. But systems are how I show I care. I'm trying to solve a problem. I'm trying to make things work.\n\nThis system - it's for my dad. In Huntsville.",
        emotion: 'grateful',
        variation_id: 'validated_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_about_dad',
        text: "What's going on with your dad?",
        nextNodeId: 'devon_father_reveal',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['validated_his_approach']
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
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_why_failing',
        text: "Why do you think conversations are failing?",
        nextNodeId: 'devon_system_failure',
        pattern: 'analytical'
      }
    ]
  },

  // ============= THE CORE REVEAL =============
  {
    nodeId: 'devon_father_reveal',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My dad. He lives up in Huntsville. Since mom died six months ago, every phone call is... an exception error.\n\nHe says he's fine. But his voice has this... lag. Like packet loss. Information that isn't being transmitted. And I don't know how to debug grief.",
        emotion: 'vulnerable',
        variation_id: 'father_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'express_sympathy',
        text: "I'm sorry about your mom.",
        nextNodeId: 'devon_accepts_sympathy',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['knows_about_mother']
        }
      },
      {
        choiceId: 'ask_about_system',
        text: "So you built this flowchart to help him?",
        nextNodeId: 'devon_system_purpose',
        pattern: 'analytical',
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
    nodeId: 'devon_accepts_sympathy',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*He nods stiffly, clearly uncomfortable with the emotional directness* | Thank you. She was... she was the interpreter. Between me and dad. She translated my logic into warmth. | And now that translation layer is gone. | So I built a system. To optimize our conversations. To help him.",
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
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'did_it_work',
        text: "Did it work?",
        nextNodeId: 'devon_system_failure',
        pattern: 'analytical'
      }
    ]
  },

  // ============= BIRMINGHAM CAREER INTEGRATION: NASA/UAB Engineering =============
  {
    nodeId: 'devon_father_aerospace',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "He's an aerospace engineer at NASA Marshall. | Twenty-five years debugging rocket systems. Guidance control, error detection, mission-critical protocols. | *Devon looks at his flowchart* | He can troubleshoot a spacecraft traveling 17,000 miles per hour, but he can't... | He can't debug his own grief.",
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
        consequence: {
          characterId: 'devon',
          addKnowledgeFlags: ['father_nasa_engineer', 'inspired_by_father']
        }
      },
      {
        choiceId: 'comment_on_similarity',
        text: "You're doing what he does - trying to debug systems.",
        nextNodeId: 'devon_realizes_parallel',
        pattern: 'analytical',
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
        text: "Yeah. UAB's Integrated Systems Engineering program. | I'm doing my senior capstone on error detection in distributed systems - how different components communicate when something fails. | *He half-smiles* | Southern Company's DevOps team will be at our Engineering Week showcase next month. They're looking for graduates who understand system resilience. | Ironic, right? I can debug code exceptions but not emotional ones.",
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
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['knows_uab_program', 'knows_capstone']
        }
      },
      {
        choiceId: 'connect_to_dad',
        text: "Maybe you and your dad could talk about system failures together.",
        nextNodeId: 'devon_realizes_bridge',
        pattern: 'helping',
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
        text: "It's about making systems that don't just work - they work even when things go wrong. Redundancy, graceful degradation, error handling. | *He looks down at his conversation flowchart* | I thought I could apply the same principles to people. Build a system that handles conversational failures gracefully. | But people aren't systems. And grief isn't a bug to patch.",
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
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'devon_realizes_parallel',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*He stops, looks at you with sudden recognition* | You're right. I'm debugging our relationship like it's a mission-critical system. | Dad does the same thing - solves problems by analyzing failure modes, testing solutions, iterating. That's how we were taught to think at UAB Engineering. | But mom... she didn't think in flowcharts. And now neither of us knows how to talk without her translation layer.",
        emotion: 'breakthrough',
        variation_id: 'realizes_parallel_v1'
      }
    ],
    choices: [
      {
        choiceId: 'suggest_shared_language',
        text: "Maybe engineering IS your shared language with him.",
        nextNodeId: 'devon_realizes_bridge',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'devon_realizes_bridge',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*Something shifts in his expression* | What if... what if I stopped trying to optimize the conversation and just... asked him about the systems he's debugging at Marshall? | Not as a therapeutic technique. Just as his son who also debugs complex systems. | *He looks at you with cautious hope* | We both understand system failures. Maybe that's enough.",
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
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  {
    nodeId: 'devon_grateful_insight',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*He carefully folds up his conversation flowchart* | Thank you. I've been so focused on fixing the conversation that I forgot we could just... have one. | About rockets and distributed systems and things that fail and how you handle it. | *He manages a real smile* | That's what engineers do, right? We learn from failures.",
        emotion: 'grateful',
        variation_id: 'grateful_insight_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_farewell_engineer',
        text: "Good luck with your capstone - and with your dad.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'devon_system_purpose',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Yes. I mapped conversational patterns. Identified failure modes. Built decision trees for different emotional states.\n\nIf he says 'I'm fine' but voice pattern indicates stress, route to gentle probe subroutine. If he mentions mom, acknowledge without dwelling. Optimize for minimal emotional latency.",
        emotion: 'clinical',
        variation_id: 'system_purpose_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_if_worked',
        text: "And did it work?",
        nextNodeId: 'devon_system_failure',
        pattern: 'analytical'
      }
    ]
  },

  // ============= THE GLITCH =============
  {
    nodeId: 'devon_system_failure',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "No. I followed the flowchart perfectly. Every decision node, every optimal response path. And it made everything worse.\n\nHe said I sounded like I was reading from a script. That I was treating him like a problem to solve instead of a person to be with. The system was perfect. And it was completely wrong.",
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
        text: "*His technical precision cracks*\n\nIt did. Because he was right. I was treating him like a system failure. Like debugging code. But you can't debug a memory. You can't optimize grief.\n\nAnd I don't know any other way to help.",
        emotion: 'broken',
        variation_id: 'admits_hurt_v1'
      }
    ],
    choices: [
      {
        choiceId: 'reframe_empathy',
        text: "Maybe empathy IS a kind of data.",
        nextNodeId: 'devon_reframe',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_binary',
        text: "You're thinking in binaries. Logic OR emotion. What about both?",
        nextNodeId: 'devon_integration_idea',
        pattern: 'analytical',
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
        text: "The system assumed emotional states could be categorized and responses could be optimized. But grief isn't a bug. It's not something to route around.\n\nI was treating symptoms - the silences, the 'I'm fine' responses - instead of the underlying condition. The system was solving the wrong problem.",
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
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  // ============= THE INTEGRATION =============
  // NOTE: devon_vulnerable_moment is orphaned (no incoming links)
  // Commented out pending integration or removal decision
  // {
  //   nodeId: 'devon_vulnerable_moment',
  //   speaker: 'Devon Kumar',
  //   content: [
  //     {
  //       text: "*He puts the flowchart down, the technical precision in his voice gone for the first time*\n\nIt's a conversational map for my dad. He lives up in Huntsville. Since mom died... every call is an exception error. I built a system to help him, to optimize his grief. A flowchart.\n\n*He looks at you, his eyes filled with a kind of logical despair*\n\nBut there's no schematic for a sad dad. And you can't debug a memory. My system is perfect, and it is completely useless.",
  //       emotion: 'raw_vulnerable',
  //       variation_id: 'vulnerable_v1'
  //     }
  //   ],
  //   requiredState: {
  //     trust: { min: 5 },
  //     hasKnowledgeFlags: ['system_failed']
  //   },
  //   choices: [
  //     {
  //       choiceId: 'empathy_is_data',
  //       text: "Listening is data collection. A hug is data transmission.",
  //       nextNodeId: 'devon_reframe',
  //       pattern: 'helping',
  //       consequence: {
  //         characterId: 'devon',
  //         trustChange: 2
  //         }
  //       },
  //       {
  //         choiceId: 'expand_definition',
  //         text: "Expand your definition of 'system.' Include emotions.",
  //         nextNodeId: 'devon_integration_idea',
  //         pattern: 'analytical',
  //         consequence: {
  //           characterId: 'devon',
  //           trustChange: 2
  //         }
  //       }
  //     ]
  //   },

  {
    nodeId: 'devon_reframe',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "*He stops, processing this like a revelation*\n\nEmpathy as data collection. Presence as bandwidth. You're saying... I don't have to abandon systems thinking. I have to expand what counts as data.\n\nEmotions aren't noise interfering with the signal. They ARE the signal.",
        emotion: 'dawning_realization',
        variation_id: 'reframe_v1'
      }
    ],
    choices: [
      {
        choiceId: 'confirm',
        text: "Exactly. You're not broken. Your framework just needed updating.",
        nextNodeId: 'devon_crossroads',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['empathy_reframe']
      }
    ]
  },

  {
    nodeId: 'devon_integration_idea',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "A system that includes emotional variables. Not logic OR emotion. Logic AND emotion. An integrated architecture.\n\n*He's thinking out loud now, the engineer returning but softer*\n\nGrief isn't a bug to fix. It's a valid system state. Requiring presence, not optimization. Requiring connection, not solutions.",
        emotion: 'integrating',
        variation_id: 'integration_v1'
      }
    ],
    choices: [
      {
        choiceId: 'affirm',
        text: "Now you're thinking in systems that can hold complexity.",
        nextNodeId: 'devon_crossroads',
        pattern: 'analytical',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['integration_insight']
      }
    ]
  },

  {
    nodeId: 'devon_realizes_connection',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "The right problem isn't 'How do I fix my dad.' The right problem is 'How do I be present with my dad.'\n\nYou can't optimize connection. You can only... show up for it. Be in the system instead of trying to design it from outside.",
        emotion: 'understanding',
        variation_id: 'realizes_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_now',
        text: "So what will you do?",
        nextNodeId: 'devon_crossroads',
        pattern: 'exploring'
      }
    ]
  },

  // ============= CROSSROADS (Multiple Paths) =============
  {
    nodeId: 'devon_crossroads',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I need to call him. But differently this time. No flowchart. No optimization.\n\nJust... me, talking to my dad. Listening for the data I've been filtering out. The pauses. The pain. The love underneath the 'I'm fine.'\n\nWhat if I just... let the conversation be what it needs to be?",
        emotion: 'ready',
        variation_id: 'crossroads_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      hasKnowledgeFlags: ['system_failed']
    },
    choices: [
      {
        choiceId: 'crossroads_integrated',
        text: "You don't have to choose between engineer and son. Be both.",
        nextNodeId: 'devon_chooses_integration',
        pattern: 'analytical'
      },
      {
        choiceId: 'crossroads_emotional',
        text: "Trust your heart. The flowchart can wait.",
        nextNodeId: 'devon_chooses_heart',
        pattern: 'helping'
      },
      {
        choiceId: 'crossroads_support',
        text: "Whatever feels right. He just needs you there.",
        nextNodeId: 'devon_chooses_presence',
        pattern: 'patience'
      }
    ],
    tags: ['climax', 'devon_arc']
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
        pattern: 'analytical'
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
        pattern: 'helping'
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
        pattern: 'patience'
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

  // ============= FAREWELL NODES (Return to Samuel) =============
  {
    nodeId: 'devon_farewell_integration',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to go call him now. Integrated approach - engineer and son, both online.\n\nSamuel's probably at the main platform. He has a way of knowing when someone's found their path. Or at least the next step of it.\n\nThank you. For being a good debugging partner.",
        emotion: 'grateful',
        variation_id: 'farewell_integration_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_integration',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.HUB_AFTER_DEVON,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'devon_arc']
  },

  {
    nodeId: 'devon_farewell_heart',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to find a quiet place and call him. Let my heart do the talking instead of my head.\n\nYou should go see Samuel. He's good at helping people find what they need. Even if what they need is just... permission to feel.\n\nThank you for giving me that permission.",
        emotion: 'warm',
        variation_id: 'farewell_heart_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_heart',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.HUB_AFTER_DEVON,
        pattern: 'helping'
      }
    ],
    tags: ['transition', 'devon_arc']
  },

  {
    nodeId: 'devon_farewell_presence',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him right now. Just to say hi. To be present. No agenda. No system. Just me and dad.\n\nSamuel's at the main platform if you need direction. He's good at that. Being present while you figure things out.\n\nI think I finally understand what he does.",
        emotion: 'centered',
        variation_id: 'farewell_presence_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_presence',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.HUB_AFTER_DEVON,
        pattern: 'patience'
      }
    ],
    tags: ['transition', 'devon_arc']
  }
]

// ============= PUBLIC API: EXPORTED ENTRY POINTS =============
// These nodes are designed for cross-graph navigation.
// Do NOT link to internal nodes - only use these exported IDs.

export const devonEntryPoints = {
  /** Initial entry point - Samuel introduces Devon */
  INTRODUCTION: 'devon_introduction',

  /** Core vulnerable moment - requires trust ≥5 */
  // VULNERABLE_MOMENT: 'devon_vulnerable_moment', // Commented out - orphaned node

  /** Crossroads decision point */
  CROSSROADS: 'devon_crossroads'
} as const

// Type export for TypeScript autocomplete
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