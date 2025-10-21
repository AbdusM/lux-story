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
        skills: ['critical_thinking', 'communication'],
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
        skills: ['emotional_intelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
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
        skills: ['communication', 'critical_thinking'],
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
        skills: ['emotional_intelligence', 'communication'],
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
        text: "You recognize the structure. Most people just see... scribbles. Yes, it's a decision tree. Conversational routing logic.\n\nIf input A, then response B. If emotional_state == 'defensive', route to de-escalation subroutine. That kind of thing.",
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
        skills: ['critical_thinking', 'communication'],
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['emotional_intelligence', 'adaptability'],
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
        skills: ['communication', 'emotional_intelligence'],
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
        skills: ['emotional_intelligence'],
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
        skills: ['emotional_intelligence', 'critical_thinking'],
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_assumption',
        text: "Conversations aren't circuits though.",
        nextNodeId: 'devon_defends_focus',
        pattern: 'analytical',
        skills: ['critical_thinking']
      }
    ]
  },

  {
    nodeId: 'devon_validated',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Thank you. Most people think I'm... cold. That I don't care. But systems are how I show I care. I'm trying to solve a problem. I'm trying to make things work.\n\nThis system - it's for my dad. In Huntsville.",
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
        characterId: 'devon'
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking']
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
        nextNodeId: 'devon_pause_after_father_reveal',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking', 'communication'],
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

  // ============= PAUSE: After Father Reveal (Breathing Room) =============
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking']
      }
    ]
  },

  // ============= BIRMINGHAM CAREER INTEGRATION: NASA/UAB Engineering =============
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking', 'emotional_intelligence'],
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
        text: "Yeah. University of Alabama at Birmingham's (UAB) Integrated Systems Engineering program.\n\nI'm doing my senior capstone (final project) on error detection in distributed systems (seeing how parts connect) - how different components communicate when something fails.\n\nSouthern Company's DevOps team will be at our Engineering Week showcase next month. They're looking for graduates who understand system resilience.\n\nIronic, right? I can debug code exceptions but not emotional ones.",
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
          addKnowledgeFlags: ['knows_uab_program']
        }
      },
      {
        choiceId: 'connect_to_dad',
        text: "Talk system failures with your dad?",
        nextNodeId: 'devon_realizes_bridge',
        pattern: 'building',
        skills: ['creativity', 'emotional_intelligence', 'communication'],
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
        text: "It's about making systems that don't just work - they work even when things go wrong. Redundancy, graceful degradation, error handling.\n\nI thought I could apply the same principles to people. Build a system that handles conversational failures gracefully.\n\nBut people aren't systems. And grief isn't a bug to patch.",
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
        text: "You're right. I'm debugging our relationship like it's a mission-critical system.\n\nDad does the same thing - solves problems by analyzing failure modes, testing solutions, iterating. That's how we were taught to think at UAB Engineering.\n\nBut mom... she didn't think in flowcharts. And now neither of us knows how to talk without her translation layer.",
        emotion: 'breakthrough',
        variation_id: 'realizes_parallel_v1'
      }
    ],
    choices: [
      {
        choiceId: 'suggest_shared_language',
        text: "Engineering is your shared language.",
        nextNodeId: 'devon_realizes_bridge',
        pattern: 'building',
        skills: ['creativity', 'critical_thinking', 'emotional_intelligence'],
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
        text: "What if... what if I stopped trying to optimize the conversation and just... asked him about the systems he's debugging at Marshall? | Not as a therapeutic technique. Just as his son who also debugs complex systems. | We both understand system failures. Maybe that's enough.",
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
        text: "Thank you. I've been so focused on fixing the conversation that I forgot we could just... have one. | About rockets and distributed systems and things that fail and how you handle it. | That's what engineers do, right? We learn from failures.",
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

  // ============= RECIPROCITY: Devon Asks Player =============
  {
    nodeId: 'devon_asks_player',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Can I ask you something? You've helped me see that logic and emotion aren't opposites. But how do YOU navigate that balance?\n\nYou seem comfortable with both. I'm curious how you think about it.",
        emotion: 'curious',
        variation_id: 'devon_reciprocity_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['devon_arc_complete']
    },
    choices: [
      {
        choiceId: 'player_logic_primary',
        text: "Logic keeps me safe. Emotions feel unpredictable.",
        nextNodeId: 'devon_response_logic',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'devon_reflect_growth',
        text: "You've already figured it out. You're asking me because you care.",
        nextNodeId: 'devon_response_both',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'player_emotion_primary',
        text: "I trust my feelings first. Logic comes after.",
        nextNodeId: 'devon_response_emotion',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'player_both_integrated',
        text: "Both matter, but integrating them is hard work.",
        nextNodeId: 'devon_response_both',
        pattern: 'exploring',
        skills: ['adaptability', 'critical_thinking']
      },
      {
        choiceId: 'player_still_learning',
        text: "Honestly? I'm still figuring that out myself.",
        nextNodeId: 'devon_response_learning',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'communication']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'devon_arc']
  },

  {
    nodeId: 'devon_response_logic',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Yeah. Predictable is safe. I get that completely. Maybe we're both learning that safety isn't the only thing worth optimizing for.",
        emotion: 'thoughtful',
        variation_id: 'devon_response_logic_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_after_logic',
        text: "(Continue)",
        nextNodeId: 'devon_shared_insight_logic',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'devon_arc']
  },

  {
    nodeId: 'devon_shared_insight_logic',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know what's strange? I spent all that time building a system to talk to my dad.\n\nBut talking to you tonight, without any system at all, felt more real than any of my optimized conversation paths.\n\nMaybe that's the actual solution. Not a better system. Just... showing up as the messy, uncertain person I actually am.",
        emotion: 'breakthrough',
        variation_id: 'devon_shared_insight_logic_v1'
      }
    ],
    choices: [
      {
        choiceId: 'logic_brave',
        text: "That's the bravest thing you could do.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'logic_real',
        text: "Real connection doesn't optimize well.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'analytical',
        skills: ['critical_thinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'logic_dad',
        text: "Your dad will feel the difference.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      }
    ],
    tags: ['reciprocity', 'mutual_insight', 'devon_arc']
  },

  {
    nodeId: 'devon_response_emotion',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "That's the opposite of how I operate. But maybe that's why you could see what I couldn't—you weren't filtering everything through systems first.\n\nThat's valuable. Thank you for sharing that.",
        emotion: 'appreciative',
        variation_id: 'devon_response_emotion_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_after_emotion',
        text: "(Continue)",
        nextNodeId: 'devon_shared_insight_emotion',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'devon_arc']
  },

  {
    nodeId: 'devon_shared_insight_emotion',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "We approach things completely differently, but somehow we understood each other tonight.\n\nYou feel first, then think. I think first, then struggle with feeling. Neither is wrong.\n\nAnd maybe that's what my dad needs. Not me trying to be more like him or him more like me. Just both of us showing up honestly.\n\nYou taught me that.",
        emotion: 'grateful_clarity',
        variation_id: 'devon_shared_insight_emotion_v1'
      }
    ],
    choices: [
      {
        choiceId: 'emotion_humanity',
        text: "Different approaches, same humanity.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'analytical',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'emotion_complement',
        text: "Maybe that's why it worked. We complement each other.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'emotion_authentic',
        text: "Both showing up authentically. That's all it takes.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'patience',
        skills: ['emotional_intelligence'],
        consequence: {
          characterId: 'devon',
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      }
    ],
    tags: ['reciprocity', 'mutual_insight', 'devon_arc']
  },

  {
    nodeId: 'devon_response_both',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Yeah, it is hard work. But you make it look natural. Maybe that's what integration actually is—not seamless, just... committed to both.\n\nI appreciate you being honest about the difficulty.",
        emotion: 'understanding',
        variation_id: 'devon_response_both_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_after_both',
        text: "(Continue)",
        nextNodeId: 'devon_shared_insight_both',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'devon_arc']
  },

  {
    nodeId: 'devon_shared_insight_both',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I think I've been trying to solve the wrong problem this whole time.\n\nI wanted a system that would let me be logical AND emotional. Perfect integration.\n\nBut you just showed me something better. You don't integrate them perfectly. You commit to both, even when they conflict. Even when it's messy.\n\nThat's what I need to do with my dad. Not find the optimal balance. Just show up committed to both sides of myself.",
        emotion: 'realization',
        variation_id: 'devon_shared_insight_both_v1'
      }
    ],
    choices: [
      {
        choiceId: 'both_commitment',
        text: "Commitment over perfection.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'critical_thinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'both_messy',
        text: "Messy and real beats optimized and empty.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'analytical',
        skills: ['critical_thinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'both_integrated',
        text: "Engineer AND son. Both at once.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved', 'integration_understood']
        }
      }
    ],
    tags: ['reciprocity', 'mutual_insight', 'devon_arc']
  },

  {
    nodeId: 'devon_response_learning',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "That makes two of us. Maybe that's the real insight—nobody has this perfectly figured out. We're all just... debugging ourselves as we go.\n\nThank you for being honest about that.",
        emotion: 'connected',
        variation_id: 'devon_response_learning_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_after_learning',
        text: "(Continue)",
        nextNodeId: 'devon_shared_insight_learning',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'devon_arc']
  },

  {
    nodeId: 'devon_shared_insight_learning',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know what's funny? I built this whole flowchart trying to debug my relationship with my dad.\n\nBut tonight, talking to you, both of us admitting we're still figuring things out—that felt more connected than any optimized conversation could be.\n\nMaybe that's the variable I was missing. Not how to hide uncertainty, but how to share it.\n\nWe're both learning. And somehow that makes this real.",
        emotion: 'breakthrough',
        variation_id: 'devon_shared_insight_learning_v1'
      }
    ],
    choices: [
      {
        choiceId: 'learning_connection',
        text: "Shared uncertainty is its own kind of connection.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'learning_debug',
        text: "We're all debugging ourselves as we go.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'analytical',
        skills: ['critical_thinking', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      },
      {
        choiceId: 'learning_honest',
        text: "Being honest about not knowing—that's the real variable.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['mutual_recognition_achieved']
        }
      }
    ],
    tags: ['reciprocity', 'mutual_insight', 'devon_arc']
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking', 'problem_solving'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_actually_happened',
        text: "What actually happened when you showed him?",
        nextNodeId: 'devon_flowchart_incident',
        pattern: 'exploring',
        visibleCondition: {
          trust: { min: 3 }
        },
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

  // ============= FLOWCHART INCIDENT (Specific Emotional Scene) =============
  {
    nodeId: 'devon_flowchart_incident',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Three weeks after Mom died, I found Dad in her chair. Just sitting. For four hours.\n\nI panicked. Built the decision tree that night. Thirty-seven pages. Color-coded.",
        emotion: 'controlled_pain',
        variation_id: 'flowchart_incident_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 }
    },
    choices: [
      {
        choiceId: 'devon_flowchart_what_happened',
        text: "What happened when you showed him?",
        nextNodeId: 'devon_flowchart_reaction',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'devon_flowchart_wait',
        text: "[Wait for him to continue]",
        nextNodeId: 'devon_flowchart_reaction',
        pattern: 'patience',
        skills: ['emotional_intelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['revealed_flowchart_incident']
      }
    ],
    tags: ['emotional_incident', 'devon_arc', 'bg3_depth']
  },

  {
    nodeId: 'devon_flowchart_reaction',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "He looked at it. Looked at me.\n\n'Your mother would be so proud of how smart you are.'\n\nThen he went to his room. Didn't speak to me for a week.",
        emotion: 'hollow',
        variation_id: 'flowchart_reaction_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_wound',
        text: "He wasn't rejecting your help.",
        nextNodeId: 'devon_admits_hurt',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['shared_flowchart_failure']
        }
      },
      {
        choiceId: 'technical_analysis',
        text: "The flowchart assumed grief could be solved.",
        nextNodeId: 'devon_analyzes_failure',
        pattern: 'analytical',
        skills: ['critical_thinking', 'emotional_intelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['shared_flowchart_failure']
        }
      }
    ],
    tags: ['emotional_incident', 'devon_arc']
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
        skills: ['emotional_intelligence', 'adaptability'],
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
        skills: ['creativity', 'critical_thinking', 'emotional_intelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_binary',
        text: "What about logic AND emotion?",
        nextNodeId: 'devon_integration_idea',
        pattern: 'building',
        skills: ['critical_thinking', 'creativity'],
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
    ]
  },

  {
    nodeId: 'devon_integration_idea',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "A system that includes emotional variables. Not logic OR emotion. Logic AND emotion. An integrated architecture.\n\nGrief isn't a bug to fix. It's a valid system state. Requiring presence, not optimization. Requiring connection, not solutions.",
        emotion: 'integrating',
        variation_id: 'integration_v1'
      }
    ],
    choices: [
      {
        choiceId: 'affirm',
        text: "Now you're thinking in systems that can hold complexity.",
        nextNodeId: 'devon_pause_before_crossroads',
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
        addKnowledgeFlags: ['integration_insight', 'devon_integration_insight']
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
        nextNodeId: 'devon_pause_before_crossroads',
        pattern: 'exploring'
      }
    ]
  },

  // ============= PAUSE: Before Crossroads (Breathing Room) =============
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

  // ============= CROSSROADS (Multiple Paths) =============
  {
    nodeId: 'devon_crossroads',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You helped me see emotions as data. Now I can work with them.\n\nI need to call him. But differently this time. No flowchart. Just... me, talking to my dad. Listening for the data I've been filtering out. The pauses. The pain. The love underneath the 'I'm fine.'\n\nWhat if I just... let the conversation be what it needs to be?",
        emotion: 'ready',
        variation_id: 'crossroads_reframe'
      },
      {
        text: "You helped me integrate logic and heart. They're not enemies.\n\nI need to call him. But differently this time. Not logic OR emotion—both. Just... me, talking to my dad. Present with all of it. The pauses. The pain. The love underneath the 'I'm fine.'\n\nWhat if I just... let the conversation be what it needs to be?",
        emotion: 'ready',
        variation_id: 'crossroads_integration'
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
        pattern: 'analytical',
        skills: ['critical_thinking', 'creativity', 'emotional_intelligence']
      },
      {
        choiceId: 'crossroads_emotional',
        text: "Trust your heart. The flowchart can wait.",
        nextNodeId: 'devon_chooses_heart',
        pattern: 'helping',
        skills: ['emotional_intelligence']
      },
      {
        choiceId: 'crossroads_support',
        text: "Whatever feels right. He just needs you there.",
        nextNodeId: 'devon_chooses_presence',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'adaptability']
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
        text: "I'm going to call him. Integrated approach - engineer and son, both online.\n\nBut I'm terrified I'll optimize again. Fall back into solution mode. Build another system without realizing it.\n\nThis will be work. Every conversation. Catching myself before I try to fix instead of feel.\n\nThe flowchart failed catastrophically. But the instinct that built it? That's still in me.\n\nThank you for showing me empathy isn't the opposite of logic. But knowing that and living it are different things.\n\nSamuel's at the main platform. Good debugging partner, by the way.",
        emotion: 'determined_but_fragile',
        variation_id: 'farewell_integration_v2_complex'
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
    tags: ['transition', 'devon_arc', 'bittersweet']
  },

  {
    nodeId: 'devon_farewell_heart',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him. Let my heart do the talking.\n\nI don't know how. Twenty-two years of thinking first.\n\nBut that's what trying looks like. Doing it even when you don't know how.\n\nThank you. Tell Samuel Devon finally understood.",
        emotion: 'vulnerable_determination',
        variation_id: 'farewell_heart_v2_complex'
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
        nextNodeId: samuelEntryPoints.HUB_AFTER_DEVON,
        pattern: 'patience'
      }
    ],
    tags: ['transition', 'devon_arc', 'bittersweet']
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