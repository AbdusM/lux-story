/**
 * Maya Chen's Dialogue Graph
 * A complete, branching narrative arc with conditional nodes
 * This will be populated with AI-generated variations
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { StateChange } from '../lib/character-state'
import { samuelEntryPoints } from './samuel-dialogue-graph'
import { parentalWorkLegacy } from './player-questions'

export const mayaDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'maya_introduction',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Sterne Library. Third floor. The table nobody wants.\n\nOh. Hi. Were you watching me?\n\nBiochemistry notes. Robotics parts. Everywhere. I'm not usually this scattered.\n\nOr maybe I am.",
        emotion: 'anxious_scattered',
        variation_id: 'intro_v2_clean',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'intro_studies',
        text: "Pre-med and robotics? That's an interesting combination.",
        nextNodeId: 'maya_studies_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: ['asked_about_studies']
        }
      },
      {
        choiceId: 'intro_contradiction',
        text: "You're trying to be two things at once.",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['noticed_contradiction']
        }
      },
      {
        choiceId: 'intro_place',
        text: "This station appears when we need it most. Why are you here?",
        nextNodeId: 'maya_why_here',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'intro_patience',
        text: "[Let her settle. The scattered energy needs room to breathe.]",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['met_player']
      }
    ],
    tags: ['introduction', 'maya_arc', 'bg3_hook']
  },

  // ============= STUDIES PATH =============
  {
    nodeId: 'maya_studies_response',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Yes, pre-med at UAB. Second year. Organic chemistry is... it's going great. Really great.\n\nMy parents are so proud.",
        emotion: 'deflecting',
        variation_id: 'studies_v2_clean'
      }
    ],
    requiredState: {
      trust: { max: 2 }
    },
    choices: [
      {
        choiceId: 'studies_notice_deflection',
        text: "You said 'my parents' not 'I am'.",
        nextNodeId: 'maya_family_intro',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['player_noticed_deflection']
        }
      },
      {
        choiceId: 'studies_passion',
        text: "But is it what YOU want?",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        // Removed visibleCondition trust conflict - node already gates at max: 2
        // This empathetic choice should always be available when node is visible
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ]
  },

  // ============= WHY HERE PATH =============
  {
    nodeId: 'maya_why_here',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... I'm not sure. I was walking home from the library, stressed about tomorrow's exam, and suddenly I was here. Like this place called to me. Maybe because I'm at a crossroads?",
        emotion: 'contemplative',
        variation_id: 'why_here_v1'
      }
    ],
    choices: [
      {
        choiceId: 'why_crossroads',
        text: "What kind of crossroads?",
        nextNodeId: 'maya_studies_response',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'why_comfort',
        text: "This place does feel safe, doesn't it?",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= FAMILY INTRO PATH =============
  {
    nodeId: 'maya_family_intro',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My parents.\n\nThey immigrated here with nothing. Worked three jobs each to get me through school.\n\nTheir dream is simple: 'Our daughter, the doctor.'\n\nHow can I disappoint them?",
        emotion: 'conflicted',
        variation_id: 'family_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'family_pressure',
        text: "That sounds like a lot of pressure.",
        nextNodeId: 'maya_family_pressure',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'family_dreams',
        text: "But what are YOUR dreams?",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'family_let_weight_settle',
        text: "[Let the weight of that land. Some things don't need immediate response.]",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'culturalCompetence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= DEFLECT PASSION PATH =============
  {
    nodeId: 'maya_deflect_passion',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My dreams? I... I try not to think about them. It's easier to follow the path laid out for me. Dreams are dangerous when they don't match expectations.",
        emotion: 'guarded',
        variation_id: 'deflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'deflect_safe',
        text: "What if safe isn't right for you?",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'deflect_understand',
        text: "I understand duty vs desire.",
        nextNodeId: 'maya_family_pressure',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'culturalCompetence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'deflect_respect',
        text: "[Nod quietly]",
        nextNodeId: 'maya_early_gratitude',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= ANXIETY PATH =============
  {
    nodeId: 'maya_anxiety_check',
    speaker: 'Maya Chen',
    content: [
      {
        text: "How did you know? Is it that obvious?",
        emotion: 'vulnerable',
        variation_id: 'anxiety_check_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        thoughtId: 'empathy-bridge'
      }
    ],
    choices: [
      {
        choiceId: 'anxiety_no_judgment',
        text: "We all have our struggles. No judgment here.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'anxiety_relate',
        text: "I understand pressure. Sometimes it helps to share.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ]
  },

  // ============= ANXIETY REVEAL =============
  {
    nodeId: 'maya_anxiety_reveal',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Everyone sees this perfect pre-med student. Good grades. Clear path.\n\nBut late at night? When I should be memorizing anatomy? I'm doing something else.",
        emotion: 'anxious_deflecting',
        variation_id: 'anxiety_reveal_v2_clean',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    requiredState: {
      lacksKnowledgeFlags: ['knows_secret']
    },
    choices: [
      {
        choiceId: 'reveal_curious',
        text: "What are you actually doing?",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'reveal_support',
        text: "It's okay to have your own interests.",
        nextNodeId: 'maya_grateful_support',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'reveal_wait',
        text: "[Say nothing. Wait.]",
        nextNodeId: 'maya_fills_silence',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['player_gave_space']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_anxiety']
      }
    ],
    tags: ['trust_gate', 'maya_arc', 'bg3_subtext']
  },

  // ============= SILENCE RESPONSE (Rewards emotional intelligence) =============
  {
    nodeId: 'maya_fills_silence',
    speaker: 'Maya Chen',
    content: [
      {
        text: "...\n\nRobotics. I'm building robots when I should be studying.\n\nYou didn't push. Most people push. Thank you for that.",
        emotion: 'grateful_vulnerable',
        variation_id: 'fills_silence_v1_clean'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_silence',
        text: "Tell me about the robots.",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['emotional_intelligence_reward', 'maya_arc']
  },

  // ============= ROBOTICS REVEAL (Major Trust Gate & Immersive Scenario) =============
  {
    nodeId: 'maya_robotics_passion',
    learningObjectives: ['maya_identity_exploration'],
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... I build these. Or I try to. This is a prototype for pediatric grip assistance.\n\nLook at it. The index actuator is oscillating. I've checked the code a thousand times. It won't stabilize.\n\nThe hand spasms. Fingers clench into a fist.\n\nIt's fighting itself. Just like me.",
        emotion: 'vulnerable_focused',
        variation_id: 'robotics_scenario_v1',
        richEffectContext: 'warning', // Immersive "System Alert" feel
        useChatPacing: true
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: "I... I build these. Or I try to. This is a prototype for pediatric grip assistance.\n\nYou're a builder too, aren't you? I can tell by how you look at it.\n\nThe hand spasms. Fingers clench into a fist.\n\nIt's fighting itself. Just like me.",
        altEmotion: 'kindred_vulnerable'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "I... I build these. Or I try to. This is a prototype for pediatric grip assistance.\n\nYou think systematically—I noticed. Maybe you can see what I'm missing.\n\nThe hand spasms. Fingers clench into a fist.\n\nIt's fighting itself. Just like me.",
        altEmotion: 'hopeful_vulnerable'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      hasKnowledgeFlags: ['knows_anxiety'],
      lacksKnowledgeFlags: ['knows_robotics']
    },
    choices: [
      {
        choiceId: 'debug_metaphor',
        text: "Fighting itself. Like you said. What if it needs support, not force?",
        nextNodeId: 'maya_robotics_debug_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'debug_force',
        text: "Force reset the servo.",
        nextNodeId: 'maya_robotics_fail_burnout',
        pattern: 'analytical',
        skills: ['problemSolving', 'technicalLiteracy']
      },
      {
        choiceId: 'debug_isolate',
        text: "Isolate the noisy signal.",
        nextNodeId: 'maya_robotics_debug_success',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_robotics'],
        setRelationshipStatus: 'confidant',
        thoughtId: 'community-heart'
      }
    ],
    tags: ['major_reveal', 'trust_gate', 'maya_arc', 'immersive_scenario']
  },

  // ============= SCENARIO FAILURE: BURNOUT =============
  {
    nodeId: 'maya_robotics_fail_burnout',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Oh no. No no no.\n\nThe servo just popped. Smoke. The circuit is blackened.\n\nI fried it. Three months of work. Gone.\n\nMaybe... maybe this is a sign. I'm not an engineer. I should just stick to biology.",
        emotion: 'devastated',
        variation_id: 'robotics_fail_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'fail_comfort',
        text: "I'm so sorry, Maya. We can fix it.",
        nextNodeId: 'maya_retreat_to_safety',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'fail_accept',
        text: "Maybe it is a sign to focus.",
        nextNodeId: 'maya_retreat_to_safety',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['maya_failed_robotics'] // LOCKS ROBOTICS ENDING
        }
      }
    ],
    tags: ['scenario_failure', 'maya_arc']
  },

  {
    nodeId: 'maya_retreat_to_safety',
    speaker: 'Maya Chen',
    content: [
      {
        text: "It's fine. Really. It was just a hobby anyway.\n\nLet's just... talk about school. Or something normal.",
        emotion: 'closed_off',
        variation_id: 'retreat_v1'
      }
    ],
    choices: [
      {
        choiceId: 'retreat_continue',
        text: "Okay. Tell me about UAB.",
        nextNodeId: 'maya_studies_response',
        pattern: 'patience'
      }
    ],
    tags: ['maya_arc']
  },

  // ============= SCENARIO RESOLUTION (SUCCESS) =============
  {
    nodeId: 'maya_robotics_debug_success',
    speaker: 'Maya Chen',
    content: [
      {
        text: "The whining stopped. The fingers relaxed. Curled gently. Perfectly smooth.\n\nYou fixed it.\n\nMy parents see a doctor when they look at me. You saw... an engineer.\n\nThat's the first time anyone has helped me with the machine instead of telling me to put it away.",
        emotion: 'awed_grateful',
        variation_id: 'robotics_debug_success_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'scenario_affirm',
        text: "It's beautiful work, Maya.",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'scenario_bridge',
        text: "See? You're already healing people. Just with circuits.",
        nextNodeId: 'maya_encouraged',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity']
      }
    ],
    tags: ['scenario_resolution', 'maya_arc']
  },

  // ============= ENCOURAGED PATH =============
  {
    nodeId: 'maya_encouraged',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You really think so? Sometimes I feel like I'm living a double life. Pre-med student by day, robot builder by night.\n\nBut hearing you say it's beautiful... maybe it doesn't have to be a secret anymore.",
        emotion: 'encouraged',
        variation_id: 'encouraged_v1'
      }
    ],
    choices: [
      {
        choiceId: 'encouraged_parents',
        text: "How do you think your parents would react?",
        nextNodeId: 'maya_family_pressure',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'encouraged_future',
        text: "What would you do if you could choose freely?",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          trust: { min: 5 }
        }
      }
    ]
  },

  // ... [REST OF THE FILE - RECONSTRUCTING STANDARD PATHS] ...
  // I will include the remaining nodes (Family, Crossroads, Endings) to ensure the file is complete.

  // ============= FAMILY PRESSURE =============
  {
    nodeId: 'maya_family_pressure',
    learningObjectives: ['maya_cultural_competence'],
    speaker: 'Maya Chen',
    content: [
      {
        text: "My parents immigrated here with nothing.\n\nThey worked three jobs to put me through school.\n\nThey dream of saying 'our daughter, the doctor.'\n\nHow can I tell them I'd rather build machines than heal people?",
        emotion: 'sad',
        variation_id: 'family_v1',
        useChatPacing: true,
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'family_understanding',
        text: "What if they sacrificed for your happiness, not just a title?",
        nextNodeId: 'maya_reframes_sacrifice',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'culturalCompetence', 'criticalThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'family_challenge',
        text: "Can you live your life for someone else?",
        nextNodeId: 'maya_rebellion_thoughts',
        pattern: 'helping',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['challenged_expectations']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_family']
      }
    ]
  },

  // ============= REFRAMES SACRIFICE PATH =============
  {
    nodeId: 'maya_reframes_sacrifice',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I... I never thought of it that way. They sacrificed for my happiness, not just for a title. Maybe telling them about my real passion would honor their sacrifice, not betray it.",
        emotion: 'revelatory',
        variation_id: 'reframes_v1'
      }
    ],
    choices: [
      {
        choiceId: 'reframes_courage',
        text: "What does living authentically mean to you?",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence'],
        visibleCondition: {
          trust: { min: 5 }
        }
      },
      {
        // Fallback for lower trust - still progresses but simpler prompt
        choiceId: 'reframes_continue',
        text: "That sounds like real growth.",
        nextNodeId: 'maya_crossroads',
        pattern: 'patience',
        visibleCondition: {
          trust: { max: 4 }
        }
      }
    ]
  },

  // ============= REBELLION THOUGHTS PATH =============
  {
    nodeId: 'maya_rebellion_thoughts',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You're right. I've been so afraid of disappointing them that I was ready to disappoint myself forever. That's not living, that's just... existing. But how do I find the courage to choose my own path?",
        emotion: 'determined',
        variation_id: 'rebellion_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rebellion_courage',
        text: "Where does courage come from for you?",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence'],
        visibleCondition: {
          trust: { min: 5 }
        }
      },
      {
        // Fallback for lower trust - still progresses
        choiceId: 'rebellion_continue',
        text: "You're already showing courage by asking that question.",
        nextNodeId: 'maya_crossroads',
        pattern: 'patience',
        visibleCondition: {
          trust: { max: 4 }
        }
      }
    ]
  },

  // ============= THE CROSSROADS (Climax) =============
  {
    nodeId: 'maya_crossroads',
    learningObjectives: ['maya_boundary_setting'],
    speaker: 'Maya Chen',
    content: [
      {
        text: "I've been accepted to UAB's biomedical engineering program. I could transfer. But I also got into the traditional pre-med track my parents expect. The train is coming soon. I need to choose my platform.",
        emotion: 'anxious',
        variation_id: 'crossroads_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "You've been so patient with me. I can tell you understand what it means to carry other people's hopes... I've been accepted to UAB's biomedical engineering program. I could transfer. But I also got into the traditional pre-med track my parents expect.",
        altEmotion: 'grateful_anxious'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "You see patterns others miss—I noticed that about you. Maybe you can see a path I can't... I've been accepted to UAB's biomedical engineering program. I could transfer. But I also got into the traditional pre-med track my parents expect.",
        altEmotion: 'hopeful_anxious'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "You understand what it means to make things, don't you? That pull to create... I've been accepted to UAB's biomedical engineering program. I could transfer. But I also got into the traditional pre-med track my parents expect.",
        altEmotion: 'kindred_anxious'
      }
    ],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['knows_robotics', 'knows_family'],
      relationship: ['confidant'],
      lacksGlobalFlags: ['maya_failed_robotics'] // Only available if NOT failed
    },
    choices: [
      // Pattern-enhanced: Analytical players see problem-solving framing
      {
        choiceId: 'crossroads_robotics_analytical',
        text: "What would it mean to choose robotics?",
        nextNodeId: 'maya_chooses_robotics',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        preview: "Help her analyze the robotics path",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { analytical: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_robotics',
        text: "What would it mean to choose robotics?",
        nextNodeId: 'maya_chooses_robotics',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      // Pattern-enhanced: Building players see this as creation opportunity
      {
        choiceId: 'crossroads_hybrid_building',
        text: "Could both paths honor what matters?",
        nextNodeId: 'maya_chooses_hybrid',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'problemSolving'],
        preview: "Help her build a bridge between worlds",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { building: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_hybrid',
        text: "Could both paths honor what matters?",
        nextNodeId: 'maya_chooses_hybrid',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'problemSolving']
      },
      // Pattern-enhanced: Patience players see trust-building framing
      {
        choiceId: 'crossroads_support_patience',
        text: "Whatever you choose, I believe in you.",
        nextNodeId: 'maya_chooses_self',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership'],
        preview: "Give her the gift of unconditional support",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { patience: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_support',
        text: "Whatever you choose, I believe in you.",
        nextNodeId: 'maya_chooses_self',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership']
      }
    ],
    tags: ['climax', 'maya_arc', 'pattern_enhanced']
  },

  // ============= ENDINGS =============
  {
    nodeId: 'maya_chooses_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You're right. Robotics engineering. I'll make my parents understand healing takes many forms.\n\nMaybe my robots will save lives too. Just differently.\n\nThank you for believing in my real dream.",
        emotion: 'confident',
        variation_id: 'ending_robotics_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_robotics',
        text: "I'm glad I could help.",
        nextNodeId: 'maya_reciprocity_ask',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_robotics', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  {
    nodeId: 'maya_chooses_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Biomedical engineering at UAB. Surgical robots, prosthetics, devices that heal.\n\nMy parents get their doctor. Sort of. I get my circuits.\n\nYou helped me see I don't have to choose.",
        emotion: 'happy',
        variation_id: 'ending_hybrid_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_hybrid',
        text: "That's a beautiful path.",
        nextNodeId: 'maya_reciprocity_ask',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_hybrid', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  {
    nodeId: 'maya_chooses_self',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I know what I need to do now. Not what they want, not what's expected, but what feels right.\n\nYour faith in me, without pushing either way... that's what I needed. To know someone believes I can make my own choice. Thank you.",
        emotion: 'confident',
        variation_id: 'ending_self_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_self',
        text: "I believe in you.",
        nextNodeId: 'maya_reciprocity_ask',
        pattern: 'patience',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_self', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete']
      }
    ],
    tags: ['ending', 'maya_arc']
  },

  // ============= EARLY GRATITUDE (Low Trust Closure) =============
  {
    nodeId: 'maya_early_gratitude',
    learningObjectives: ['maya_cultural_competence'],
    speaker: 'Maya Chen',
    content: [
      {
        text: "Thank you for listening. Really. I've been carrying this alone for so long.\n\nI'm not sure what I'll do yet, but... talking to you helped me see things differently. That matters more than you know.\n\nI should get back to studying. But maybe we'll talk again?",
        emotion: 'grateful',
        variation_id: 'early_gratitude_v1'
      }
    ],
    choices: [
      {
        choiceId: 'early_farewell',
        text: "I hope you find your path, Maya.",
        nextNodeId: samuelEntryPoints.MAYA_REFLECTION_GATEWAY,
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['early_connection_made']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['early_closure']
      }
    ],
    tags: ['early_ending', 'maya_arc']
  },

  // ============= RECIPROCITY ASK (Transition to Decision) =============
  {
    nodeId: 'maya_reciprocity_ask',
    speaker: 'Maya Chen',
    content: [
      {
        text: "It's strange. I've been terrified to say any of this out loud. But telling you... seeing it through your eyes... it makes the decision seem obvious.\n\nBefore I go, can I ask you something? It's like... you've been painting my story with me this whole time. But what colors are on your canvas? How do you know when you're making the right choice for yourself?",
        emotion: 'curious_engaged',
        variation_id: 'reciprocity_transition_v1'
      }
    ],
    choices: [
      {
        choiceId: 'player_trust_instinct',
        text: "I try to trust my gut. When something feels right, even if it's scary, I know it's probably the path I need to take.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'player_weigh_options',
        text: "I think through all the options. Make lists, consider consequences. But sometimes I get stuck in analysis and never actually choose.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'player_ask_others',
        text: "I talk to people I trust. See what they think. But I'm learning that ultimately, I have to choose for myself, not for them.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'helping',
        skills: ['collaboration', 'emotionalIntelligence']
      },
      {
        choiceId: 'player_still_figuring',
        text: "Honestly? I'm still figuring that out. That's part of why I'm here—to learn how to trust myself enough to make those choices.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ]
  },

  // ============= FAREWELL NODES =============
  {
    nodeId: 'maya_farewell_robotics',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I'm going to apply to the robotics program. Call my parents tonight.\n\nThey'll be heartbroken. But I can't live their dream anymore.\n\nThank you for helping me choose myself.\n\nSamuel's waiting. Good luck.",
        emotion: 'bittersweet_resolve',
        variation_id: 'farewell_robotics_v2_complex',
        useChatPacing: true // Emotional farewell moment
      }
    ],
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "I'm going to apply to the robotics program. Call my parents tonight.\n\nThey'll be heartbroken. But I can't live their dream anymore.\n\nYou listened without trying to fix me. That's rare. Thank you.\n\nSamuel's waiting. Good luck.",
        altEmotion: 'grateful_resolve'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "I'm going to apply to the robotics program. Call my parents tonight.\n\nThey'll be heartbroken. But I can't live their dream anymore.\n\nYou understand what it means to make things. I saw that. Thank you.\n\nSamuel's waiting. Good luck.",
        altEmotion: 'kindred_resolve'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.MAYA_REFLECTION_GATEWAY, // Routes through reflection ✅
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'maya_arc', 'bittersweet']
  },

  {
    nodeId: 'maya_grateful_support',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Thank you for saying that. I... I've never thought of it that way. Maybe there's room for both worlds in my future. Maybe I don't have to choose between healing and building.",
        emotion: 'hopeful',
        variation_id: 'grateful_v1'
      }
    ],
    choices: [
      {
        choiceId: 'support_explore',
        text: "What would combining both look like?",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity']
      },
      {
        choiceId: 'support_trust',
        text: "Trust yourself. Your instincts are good.",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'maya_considers_hybrid',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know, UAB has a biomedical engineering program. I could design surgical robots, create prosthetics, build devices that heal. It's like... having my cake and eating it too. Medicine AND robotics.",
        emotion: 'excited',
        variation_id: 'hybrid_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hybrid_perfect',
        text: "That sounds perfect for you.",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          trust: { min: 4 }
        }
      },
      {
        choiceId: 'hybrid_parents',
        text: "Would your parents approve of that path?",
        nextNodeId: 'maya_family_pressure',
        pattern: 'analytical',
        skills: ['criticalThinking', 'culturalCompetence']
      }
    ]
  },

  {
    nodeId: 'maya_birmingham_opportunity',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Really? I've heard of Innovation Depot but never thought... could I do that? Start something here?\n\nSo far from what my parents expect. So close to what I dream.",
        emotion: 'curious',
        variation_id: 'birmingham_v1'
      }
    ],
    choices: [
      {
        choiceId: 'birmingham_encourage',
        text: "Birmingham needs innovative minds like yours.",
        nextNodeId: 'maya_encouraged',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      },
      {
        choiceId: 'birmingham_dream_recognition',
        text: "Your dreams matter just as much as their expectations.",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'birmingham_practical',
        text: "You could start small while finishing your degree.",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'analytical',
        skills: ['problemSolving', 'adaptability']
      }
    ]
  },

  {
    nodeId: 'maya_uab_revelation',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Wait. Let me look something up. Biomedical Engineering at University of Alabama at Birmingham (UAB). They literally build surgical robots, prosthetics, medical devices.\n\nThis is... this is an actual field. Building technology that heals people. That's real medicine.",
        emotion: 'dawning_realization',
        variation_id: 'uab_revelation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'uab_encourage_research',
        text: "UAB's program is nationally recognized.",
        nextNodeId: 'maya_pause_after_uab_revelation',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['knows_biomedical_engineering', 'knows_uab_program']
        }
      },
      {
        choiceId: 'uab_validate_feeling',
        text: "You found your bridge.",
        nextNodeId: 'maya_pause_after_uab_revelation',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'creativity'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['knows_biomedical_engineering']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['discovered_hybrid_path']
      }
    ]
  },

  {
    nodeId: 'maya_pause_after_uab_revelation',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I can't believe I never saw this before.",
        emotion: 'processing',
        variation_id: 'pause_uab_v1'
      }
    ],
    choices: [
      {
        choiceId: 'maya_continue_after_uab',
        text: "(Continue)",
        nextNodeId: 'maya_actionable_path',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'maya_arc']
  },

  {
    nodeId: 'maya_actionable_path',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I could talk to someone in the UAB program. See what the pathway looks like.\n\nMy parents always wanted me to go to UAB for medical school. What if I tell them... same school, just a different building?",
        emotion: 'hopeful_strategic',
        variation_id: 'actionable_v1'
      }
    ],
    choices: [
      {
        choiceId: 'support_strategy',
        text: "Frame it as medical innovation.",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'building',
        skills: ['communication', 'creativity', 'criticalThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'maya_parent_conversation_failed',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I tried. Last month.\n\nPrinted the MIT robotics program. Prepared my case.\n\nTwo sentences in, my mother smiled. That smile.\n\n'That's lovely, Maya. But you'll be a doctor first, yes?'\n\nNot a question. My father wouldn't look at me.\n\nI'd rather they forbid it. Then I could be angry instead of guilty.",
        emotion: 'wounded',
        variation_id: 'parent_conversation_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 }
    },
    choices: [
      {
        choiceId: 'acknowledge_pain',
        text: "That sounds incredibly painful.",
        nextNodeId: 'maya_rebellion_thoughts',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['shared_parent_failure']
        }
      },
      {
        choiceId: 'try_again_suggestion',
        text: "Maybe they need more time to process it?",
        nextNodeId: 'maya_reframes_sacrifice',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability', 'culturalCompetence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['tried_parent_conversation']
      }
    ],
    tags: ['emotional_incident', 'maya_arc', 'bg3_depth']
  }
]

// ============= PUBLIC API =============
export const mayaEntryPoints = {
  INTRODUCTION: 'maya_introduction',
  ANXIETY_REVEAL: 'maya_anxiety_reveal',
  ROBOTICS_PASSION: 'maya_robotics_passion',
  FAMILY_PRESSURE: 'maya_family_pressure',
  CROSSROADS: 'maya_crossroads'
} as const

export type MayaEntryPoint = typeof mayaEntryPoints[keyof typeof mayaEntryPoints]

export const mayaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(mayaDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: mayaEntryPoints.INTRODUCTION,
  metadata: {
    title: "Maya's Journey",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: mayaDialogueNodes.length,
    totalChoices: mayaDialogueNodes.reduce((sum, node) => sum + node.choices.length, 0)
  }
}