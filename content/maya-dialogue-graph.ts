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
        text: "Sterne Library. Third floor. The table nobody wants because the AC's broken.\n\nOh. Hi. Were you watching me?\n\nBiochem notes. Robotics parts. Everywhere. I know it looks like a disaster. It is a disaster.\n\nI'm a disaster.",
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
        text: "Yeah, pre-med at UAB. Second year. Organic chem is... it's fine. Actually no, it's killing me.\n\nBut my parents are so proud, so.",
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
        text: "I don't know? I was walking back from Sterne - freaking out about tomorrow's exam - and then I'm just... here. Like the station pulled me in or something.\n\nMaybe 'cause I'm at a crossroads. Or maybe I'm just losing it.",
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
      },
      {
        choiceId: 'why_build_clarity',
        text: "Sometimes crossroads are where we build something new. What would you construct if you could?",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'building',
        skills: ['creativity', 'communication'],
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
        text: "My parents came here with nothing. Literally nothing. Worked three jobs each just to get me through school.\n\nAnd now their big dream is 'Our daughter, the doctor.' They say it to everyone at church. At the restaurant. To random customers.\n\nHow am I supposed to destroy that?",
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
        text: "I want to hear what you want.",
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
        text: "My dreams? Honestly I try not to think about them. It's easier to just... follow the path, you know?\n\nDreams are stupid when they don't match what everyone expects from you.",
        emotion: 'guarded',
        variation_id: 'deflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'deflect_safe',
        text: "You don't sound happy with that.",
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
      },
      {
        choiceId: 'deflect_build_both',
        text: "Is there a version where you don't have to choose?",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'building',
        skills: ['creativity', 'systemsThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
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
        text: "How'd you know? God, is it that obvious?",
        emotion: 'vulnerable',
        variation_id: 'anxiety_check_v1'
      }
    ],
    patternReflection: [
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "You actually see things. Most people just look. You notice.\n\nHow'd you know? Is it that obvious?",
        altEmotion: 'curious_vulnerable'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "There's something about you. Like you actually want to understand, not just... hear yourself talk.\n\nHow'd you know? Is it that obvious?",
        altEmotion: 'trusting_vulnerable'
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
      },
      {
        choiceId: 'anxiety_curious_explore',
        text: "What does that struggle feel like? When you're caught between two selves?",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= ANXIETY REVEAL =============
  {
    nodeId: 'maya_anxiety_reveal',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Everyone sees this perfect pre-med student, right? Good grades. Clear path. Got it all figured out.\n\nBut late at night when I should be memorizing anatomy? I'm doing something completely different.",
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
        text: "...\n\nRobotics. I build robots when I should be studying.\n\nYou didn't push. Most people would've pushed. Thanks for that.",
        emotion: 'grateful_vulnerable',
        variation_id: 'fills_silence_v1_clean'
      }
    ],
    patternReflection: [
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "...\n\nRobotics. I build robots when I should be studying.\n\nYou have this way about you. Patient. Like you actually know some things can't be rushed. It's rare. Thank you.",
        altEmotion: 'deeply_grateful'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "...\n\nRobotics. I build robots when I should be studying.\n\nYou didn't push. You just... you actually care. I can tell. Thank you.",
        altEmotion: 'seen_grateful'
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
        text: "I build these. Or try to. This is a prototype for pediatric grip assistance - helps kids with weak hands grip stuff.\n\nLook. The index actuator's oscillating. I've checked the code like a thousand times. Won't stabilize.\n\nThe hand keeps spasming. Fingers clench into a fist.\n\nIt's fighting itself. Just like me.",
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
        altText: "I build these. Or try to. This is a prototype for pediatric grip assistance - helps kids with weak hands.\n\nYou're a builder too, right? I can tell by how you're looking at it.\n\nThe hand keeps spasming. Fingers clench into a fist.\n\nIt's fighting itself. Just like me.",
        altEmotion: 'kindred_vulnerable'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "I build these. Or try to. This is a prototype for pediatric grip assistance.\n\nYou think systematically, I can tell. Maybe you can see what I'm missing?\n\nThe hand keeps spasming. Fingers clench into a fist.\n\nIt's fighting itself. Just like me.",
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
        text: "Oh god. No no no.\n\nThe servo just popped. Smoke. The circuit's blackened.\n\nI fried it. Three months of work. Gone.\n\nMaybe this is a sign, you know? I'm not an engineer. Should just stick to biology.",
        emotion: 'devastated',
        variation_id: 'robotics_fail_v1',
        richEffectContext: 'error'
      }
    ],
    metadata: {
      sessionBoundary: true  // Session 1: Maya's crisis revealed
    },
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
      },
      {
        choiceId: 'fail_rebuild_learning',
        text: "Three months isn't lost. it's learning. You know what NOT to do now. That's how builders improve.",
        nextNodeId: 'maya_retreat_to_safety',
        pattern: 'building',
        skills: ['creativity', 'adaptability'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
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
        text: "It's fine. It was a hobby anyway.\n\nLet's talk about school. Or something normal.",
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
        text: "Circuits that help people. That counts.",
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
      },
      {
        choiceId: 'encouraged_build_visibility',
        text: "What if you built this secret into something people could see? Something undeniable?",
        nextNodeId: 'maya_crossroads',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
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
        text: "My parents came here with literally nothing.\n\nThree jobs each just to get me through school.\n\nAnd now their whole dream is 'our daughter, the doctor.'\n\nHow do I tell them I'd rather build robots than memorize anatomy? Like... I can't. I just can't do that to them.",
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
        text: "What if they sacrificed for your happiness, not a title?",
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
        text: "Wait. I never thought about it like that.\n\nThey sacrificed for my happiness, not for a title.\n\nMaybe... telling them about the robotics stuff would actually honor what they did? Instead of, like, betraying it?\n\nGod, why does that sound so obvious now?",
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
        text: "I've been so scared of letting them down that I was gonna let myself down forever.\n\nThat's not living. That's just... existing. Going through the motions.\n\nBut how do I actually find the guts to choose my own thing? Like where does that even come from?",
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
        text: "Okay so.\n\nI got accepted to UAB's biomedical engineering program. I could transfer.\n\nBut I also got into the pre-med track. The one my parents have been dreaming about since like... forever.\n\nThe train's coming soon. I have to choose a platform.\n\nAnd I'm freaking out.",
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
        altText: "You've been so patient with me. You get what it's like to carry other people's expectations, don't you?\n\nOkay so. I got accepted to UAB's biomedical engineering program. I could transfer. But I also got the pre-med acceptance - the one my parents have been dreaming about forever.",
        altEmotion: 'grateful_anxious'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "You see patterns other people miss. I noticed that about you.\n\nMaybe you can see a path I can't?\n\nI got accepted to UAB's biomedical engineering program. Could transfer. But there's also the pre-med track - the one my parents are expecting.",
        altEmotion: 'hopeful_anxious'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "You get what it's like to make things, right? That pull to create stuff with your hands?\n\nI got accepted to UAB's biomedical engineering program. I could transfer.\n\nBut there's also pre-med. The path my parents have been picturing since I was like... ten.",
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
        text: "Robotics engineering.\n\nI'm gonna transfer. And I'll help my parents understand that healing comes in different forms, you know?\n\nMaybe my robots will save lives too. Just... differently than they pictured.",
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
        text: "Biomedical engineering. At UAB.\n\nSurgical robots. Prosthetics. Devices that actually heal people.\n\nMy parents get their doctor. Kind of. I get my circuits.\n\nYou helped me see I don't have to choose between them. I can do both.",
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
        text: "I know what I need to do now.\n\nNot what they want. Not what's expected. What feels right to me.\n\nYour faith in me - without pushing me either way - that's what I needed. Just... someone who believes I can make my own choice.\n\nThank you.",
        emotion: 'confident',
        variation_id: 'ending_self_v1'
      }
    ],
    metadata: {
      sessionBoundary: true  // Session 2: Maya's choice made
    },
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
        text: "I've been carrying this by myself for so long.\n\nI don't know what I'm gonna do yet. But talking to you... it helped me see things differently.\n\nI should get back to studying. Maybe we'll talk again sometime?",
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
        text: "It's weird. I've been terrified to say any of this out loud.\n\nBut telling you... seeing it through your eyes... suddenly the decision seems obvious.\n\nBefore I go - can I ask you something?\n\nYou've been helping me figure out my story this whole time. But what about yours? How do you know when you're making the right choice for yourself?",
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
        text: "Honestly? I'm still figuring that out. That's part of why I'm here. to learn how to trust myself enough to make those choices.",
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
        text: "I'm gonna apply to the robotics program. Call my parents tonight.\n\nThey're gonna be heartbroken. But I can't live their dream forever.\n\nThank you for helping me choose myself.\n\nSamuel's waiting for you. Good luck out there.",
        emotion: 'bittersweet_resolve',
        variation_id: 'farewell_robotics_v2_complex',
        useChatPacing: true // Emotional farewell moment
      }
    ],
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "I'm gonna apply to the robotics program. Call my parents tonight.\n\nThey're gonna be heartbroken. But I can't live their dream forever.\n\nYou listened without trying to fix me. That's rare. Thank you for that.\n\nSamuel's waiting for you. Good luck.",
        altEmotion: 'grateful_resolve'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "I'm gonna apply to the robotics program. Call my parents tonight.\n\nThey're gonna be heartbroken. But I can't live their dream forever.\n\nYou get what it means to make things. I could tell. Thank you.\n\nSamuel's waiting for you. Good luck.",
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
        text: "Wait. I never thought about it like that.\n\nMaybe there's room for both? Maybe I don't have to choose between healing and building.",
        emotion: 'hopeful',
        variation_id: 'grateful_v1'
      }
    ],
    choices: [
      {
        choiceId: 'support_explore',
        text: "Is there a way to do both?",
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
      },
      {
        choiceId: 'support_explore_feeling',
        text: "When you imagine healing AND building. what does that future look like?",
        nextNodeId: 'maya_considers_hybrid',
        pattern: 'exploring',
        skills: ['curiosity', 'creativity'],
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
        text: "Wait. UAB has a biomedical engineering program.\n\nI could design surgical robots. Create prosthetics. Build devices that actually heal people.\n\nIt's like... having my cake and eating it too. Medicine AND robotics.\n\nOh my god why didn't I see this before?",
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
        text: "Really? I've heard of Innovation Depot but never thought... could I actually do that? Start something here in Birmingham?\n\nIt's so far from what my parents expect.\n\nSo close to what I actually dream about.",
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
        text: "Your dreams matter as much as their expectations.",
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
        text: "Wait. Hold on let me look something up.\n\nBiomedical Engineering at UAB.\n\nThey literally build surgical robots. Prosthetics. Medical devices.\n\nThis is... this is an actual field? Building technology that heals people?\n\nThat's real medicine. Oh my god.",
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
        text: "I could talk to someone in the UAB program. See what the pathway actually looks like.\n\nMy parents always wanted me at UAB for medical school.\n\nWhat if I tell them... same school, different building?\n\nWould that work?",
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
        text: "I tried. Last month.\n\nPrinted out the MIT robotics program. Prepared my whole case.\n\nTwo sentences in, my mom smiled. That smile.\n\n'That's lovely, Maya. But you'll be a doctor first, yes?'\n\nNot a question.\n\nMy dad wouldn't even look at me.\n\nHonestly? I'd rather they just forbid it. Then I could be angry instead of guilty all the time.",
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
    tags: ['emotional_incident', 'maya_arc', 'bg3_depth'],
    metadata: {
      sessionBoundary: true  // Session 3: Deep vulnerability revealed
    }
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