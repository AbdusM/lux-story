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
        text: "Wait. Don't touch that.\n\nOh. Hi.\n\nYou aren't one of the librarians. Usually the only people up here are chasing me out.",
        emotion: 'anxious_scattered',
        variation_id: 'intro_v3_minimal',
        richEffectContext: 'warning',
        skillReflection: [
          { skill: 'emotionalIntelligence', minLevel: 5, altText: "Wait. Don't touch that.\n\nOh. Hi.\n\nYou have patient eyes. Most people don't look at me like that.\n\nI know this looks like chaos. It is chaos. But there's a pattern in there somewhere.", altEmotion: 'noticed' },
          { skill: 'creativity', minLevel: 5, altText: "Wait. Don't touch that.\n\nOh. Hi.\n\nYou're looking at the robot parts, aren't you? Most people just see the mess.\n\nYou've got that look—like you build things too.", altEmotion: 'curious' }
        ],
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "Wait. Don't touch that.\n\nOh. Hi.\n\nYou have kind eyes. Sorry, I'm scattered.\n\nBiochem notes, robotics parts. I know it looks like a disaster. It is a disaster.", altEmotion: 'vulnerable' },
          { pattern: 'analytical', minLevel: 5, altText: "Wait. Don't touch that.\n\nOh. Hi.\n\nYou're taking this all in, aren't you? The chaos.\n\nYes, there's a system. Sort of. I'm trying to be two different people at the same table.", altEmotion: 'anxious_scattered' },
          { pattern: 'building', minLevel: 5, altText: "Wait. Don't touch that.\n\nOh. Hi.\n\nYou noticed the robot parts. Most people don't even see them under all the biochem stuff.\n\nI know it looks like chaos. But there's something I'm building here. Something real.", altEmotion: 'hopeful' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'intro_studies',
        text: "Pre-med and robotics? That's an interesting combination.",
        nextNodeId: 'maya_studies_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        voiceVariations: {
          analytical: "Pre-med and robotics? Walk me through how those connect.",
          building: "Pre-med and robotics? Are you building something that combines them?",
          exploring: "Pre-med and robotics? That's unusual. What's the story there?",
          helping: "That's a lot to balance. How are you managing both?",
          patience: "Pre-med and robotics. That takes dedication."
        },
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
        voiceVariations: {
          helping: "That sounds exhausting. Being pulled in two directions.",
          analytical: "Two tracks, one person. That's a structural problem.",
          building: "You're trying to build two different futures. At the same time.",
          exploring: "What if you didn't have to choose between them?",
          patience: "Two paths. That's heavy to carry."
        },
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
        skills: ['communication', 'criticalThinking'],
        voiceVariations: {
          exploring: "This station appears when we need it. What brought you here?",
          analytical: "This place has a pattern. It shows up at crossroads. What's yours?",
          helping: "This station finds people who are searching. What are you looking for?",
          building: "People come here to figure out what to build next. You too?",
          patience: "The station knows when we need a pause. Why now, for you?"
        }
      },
      {
        choiceId: 'intro_patience',
        text: "[Let her settle. The scattered energy needs room to breathe.]",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        voiceVariations: {
          patience: "[Give her space. Let the chaos settle on its own.]",
          helping: "[She needs a moment. Be present without pushing.]",
          analytical: "[Wait. Observe. The situation will clarify itself.]",
          exploring: "[Interesting. See what she does when given room.]",
          building: "[Sometimes the best thing is to not intervene.]"
        },
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      // Shift Left: Early simulation access
      {
        choiceId: 'maya_intro_show_work',
        text: "Show me what you're working on.",
        nextNodeId: 'maya_simulation_intro',
        pattern: 'exploring',
        skills: ['curiosity', 'learningAgility'],
        voiceVariations: {
          exploring: "Can you show me what you're building?",
          analytical: "Let me see this chaos in action.",
          building: "Show me the prototype.",
          helping: "I'd love to understand what drives you.",
          patience: "Demonstrate. I'll watch."
        }
      },
      // Pattern unlock choices - only visible when player has built enough pattern affinity
      {
        choiceId: 'intro_workshop_unlock',
        text: "[Builder's Eye] I see those component bins. You're building something real, aren't you?",
        nextNodeId: 'maya_workshop_invitation',
        pattern: 'building',
        skills: ['creativity'],
        archetype: 'MAKE_OBSERVATION',
        visibleCondition: {
          patterns: { building: { min: 40 } }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'intro_technical_unlock',
        text: "[Pattern Sense] The chaos has structure. Walk me through your system.",
        nextNodeId: 'maya_technical_deep_dive',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        archetype: 'ASK_FOR_DETAILS',
        visibleCondition: {
          patterns: { analytical: { min: 50 } }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['met_player']
      },
      // TD-005: First meeting with Maya warms up the technology platform
      {
        platformChanges: [{
          platformId: 'platform-7',
          warmthDelta: 1
        }]
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
        variation_id: 'studies_v2_clean',
        voiceVariations: {
          analytical: "Yeah, pre-med at UAB. Second year. You're analyzing me, aren't you? Organic chem is... it's killing me.\n\nBut my parents are so proud. The math works for them, at least.",
          helping: "Yeah, pre-med at UAB. Second year. You seem like someone who actually listens.\n\nOrganic chem is... it's killing me. But my parents are so proud, so. I don't get to complain.",
          building: "Yeah, pre-med at UAB. Second year. You get it - trying to build something while everyone's watching.\n\nOrganic chem is... it's killing me. But my parents are so proud.",
          exploring: "Yeah, pre-med at UAB. Second year. I can tell you're curious about what's really going on.\n\nOrganic chem is... it's killing me. But my parents are so proud, so.",
          patience: "Yeah, pre-med at UAB. Second year. Thanks for not rushing me.\n\nOrganic chem is... it's killing me. But my parents are so proud, so."
        }
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
        voiceVariations: {
          analytical: "Interesting word choice. 'My parents are proud.' Not 'I love it.'",
          helping: "I noticed you talked about their pride. Not yours.",
          exploring: "'My parents.' Not 'I am.' That's telling.",
          building: "You mentioned what they built. What about you?",
          patience: "Your words say one thing. Your face says another."
        },
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
        voiceVariations: {
          helping: "Forget what they want for a second. What do YOU want?",
          analytical: "Their goals are clear. What are yours?",
          exploring: "If you could choose anything. What would it be?",
          building: "What would YOU build, if no one was watching?",
          patience: "Take a breath. What does your gut say?"
        },
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
        variation_id: 'why_here_v1',
        patternReflection: [
          { pattern: 'exploring', minLevel: 4, altText: "I don't know? I was walking back from Sterne and then I'm just... here. Like the station pulled me in.\n\nYou seem curious about this place too. Like you're looking for something.", altEmotion: 'curious' },
          { pattern: 'analytical', minLevel: 4, altText: "I don't know? I was freaking out about tomorrow's exam and then I'm just... here.\n\nYou're trying to figure this out, aren't you? The logic of it? There might not be any.", altEmotion: 'uncertain' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'why_crossroads',
        text: "What kind of crossroads?",
        nextNodeId: 'maya_studies_response',
        pattern: 'exploring',
        skills: ['communication'],
        voiceVariations: {
          exploring: "What kind of crossroads? I want to understand.",
          analytical: "Define 'crossroads.' What are the actual options?",
          helping: "Tell me about this crossroads. I'm listening.",
          building: "Crossroads means choices. What are you choosing between?",
          patience: "A crossroads. Take your time explaining."
        }
      },
      {
        choiceId: 'why_comfort',
        text: "This place does feel safe, doesn't it?",
        nextNodeId: 'maya_anxiety_check',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        voiceVariations: {
          helping: "This place feels safe. Like you can breathe here.",
          patience: "The station has a stillness to it. Calming.",
          exploring: "There's something about this place. Protective.",
          analytical: "Interesting. The architecture creates a sense of shelter.",
          building: "Someone built this place to feel safe. They succeeded."
        },
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
        voiceVariations: {
          building: "Crossroads are where we build something new. What would you make?",
          exploring: "If you could start fresh here. What would you create?",
          analytical: "Crossroads = opportunity. What would you design differently?",
          helping: "What would you build for yourself, if you could?",
          patience: "If you had time to build anything... what would it be?"
        },
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
        text: "My parents came here with nothing. And I mean *nothing*.\n\nNow? Now they have a house in Hoover. A restaurant that wins awards. And a daughter who's supposed to be the crown jewel.",
        emotion: 'conflicted',
        variation_id: 'family_intro_v2_interactive',
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "My parents came here with nothing. And I mean *nothing*.\n\nYou know that look people get when they're terrified of losing ground? That's them every day.\n\nNow they have a house, a restaurant... and a daughter who's supposed to be the proof it was all worth it.", altEmotion: 'vulnerable' },
          { pattern: 'analytical', minLevel: 5, altText: "My parents came here with nothing. You can probably calculate the odds they beat.\n\nNow they have a house in Hoover. A restaurant with good metrics. And a daughter whose success is the final variable in their equation.\n\nCrown jewel. That's what expected outputs look like.", altEmotion: 'matter_of_fact' },
          { pattern: 'patience', minLevel: 5, altText: "My parents came here with nothing. They waited years for everything they have.\n\nNow? A house. A restaurant. A daughter who's supposed to prove the waiting was worth it.\n\nThey're still waiting. For me to become the final piece.", altEmotion: 'heavy' },
          { pattern: 'exploring', minLevel: 5, altText: "My parents came here with nothing. Everything was new, uncertain, worth exploring.\n\nNow? Now they have a house, a restaurant... and a daughter who's supposed to follow a map they drew without asking me.\n\nCrown jewel. Jewelry doesn't get to choose.", altEmotion: 'conflicted' },
          { pattern: 'building', minLevel: 5, altText: "My parents came here with nothing. They built everything from scratch.\n\nNow? House. Restaurant. And a daughter who's supposed to be the capstone of what they constructed.\n\nCrown jewel. The final piece of their architecture.", altEmotion: 'weighted' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'family_ask_expectations',
        text: "Crown jewel? What does that clear path look like?",
        nextNodeId: 'maya_family_expectations',
        pattern: 'analytical',
        skills: ['communication'],
        voiceVariations: {
          analytical: "Crown jewel. What does that title actually require?",
          exploring: "What does 'crown jewel' mean to them? What does it look like?",
          helping: "That's a lot of weight in two words. What do they expect?",
          building: "Crown jewels are made. What are they trying to make you into?",
          patience: "Crown jewel... that's loaded. What does it mean for you?"
        }
      },
      {
        choiceId: 'family_empathy',
        text: "That sounds heavy to carry alone.",
        nextNodeId: 'maya_family_pressure',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          helping: "That sounds really heavy. You don't have to carry it alone.",
          patience: "That's a lot. I can feel the weight of it.",
          analytical: "That's a significant burden. How long have you carried it?",
          exploring: "Heavy. Do they know how it feels from your side?",
          building: "They built their dream. But you're carrying it now."
        },
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'family_legacy',
        text: "They built an empire. You respect that.",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'building',
        skills: ['culturalCompetence'],
        voiceVariations: {
          building: "They built something from nothing. That's real work.",
          analytical: "Starting with nothing, ending with a restaurant. That's impressive math.",
          patience: "Forty years of building. That deserves respect.",
          helping: "They worked so hard for you. That's love, in their way.",
          exploring: "From nothing to all this. What drove them?"
        },
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ]
  },

  // ============= NEW INTERACTIVE NODE: EXPECTATIONS =============
  {
    nodeId: 'maya_family_expectations',
    speaker: 'Maya Chen',
    content: [
      {
        text: "'Our daughter, the doctor.'\n\nThey say it to everyone. At church. To random customers at the restaurant. It's not just a career, it's... it's the finish line to their marathon.\n\nIf I trip, I don't just hurt myself. I waste forty years of their sweat.",
        emotion: 'anxious',
        variation_id: 'expectations_v1'
      }
    ],
    choices: [
      {
        choiceId: 'expectations_permission',
        text: "You aren't a statue they built. You're a person.",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          analytical: "Their sacrifice doesn't define your path. You're a person with your own data.",
          helping: "You aren't a statue they built. You're a person.",
          building: "They built a foundation. But you decide what goes on top.",
          exploring: "Their marathon doesn't have to be your race.",
          patience: "You carry their hopes. But you're still you."
        }
      },
      {
        choiceId: 'expectations_reality',
        text: "But is medicine what YOU want?",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'expectations_deep_insight',
        text: "[Insight] Their marathon ends at YOUR finish line. What if you ran a different race?",
        nextNodeId: 'maya_deflect_passion',
        pattern: 'analytical',
        skills: ['criticalThinking', 'systemsThinking'],
        requiredOrbFill: { pattern: 'analytical', threshold: 30 },
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['maya_arc', 'backstory_depth']
  },

  // ============= DEFLECT PASSION PATH =============
  {
    nodeId: 'maya_deflect_passion',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My dreams? Honestly I try not to think about them. It's easier to just... follow the path, you know?\n\nDreams are stupid when they don't match what everyone expects from you.",
        emotion: 'guarded',
        variation_id: 'deflect_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "My dreams? Honestly I try not to think about them. It's easier to just... follow the path.\n\nBut you build things, don't you? You understand what it's like to have something you want to make, but can't.", altEmotion: 'vulnerable' },
          { pattern: 'patience', minLevel: 4, altText: "My dreams? I try not to think about them.\n\nYou're not rushing to fix me. That's... nice. Most people want to solve me like a problem.", altEmotion: 'grateful' },
          { pattern: 'exploring', minLevel: 4, altText: "My dreams? I try not to think about them. But you keep asking these questions that make me think anyway.\n\nDreams are stupid when they don't match what everyone expects.", altEmotion: 'conflicted' }
        ],
        // E2-CHALLENGE: Opportunity to gently push back on her self-limiting belief
        interrupt: {
          duration: 3000,
          type: 'challenge',
          action: 'Challenge that belief',
          targetNodeId: 'maya_challenge_accepted',
          consequence: {
            characterId: 'maya',
            trustChange: 1,
            addKnowledgeFlags: ['player_challenged_maya']
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'deflect_safe',
        text: "You don't sound happy with that.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        voiceVariations: {
          analytical: "Your voice says something different from your words.",
          helping: "You don't sound happy with that.",
          building: "That doesn't sound like a foundation you want to build on.",
          exploring: "There's something else underneath that, isn't there?",
          patience: "I hear the tension in that. Take your time."
        }
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
        visibleCondition: {
          patterns: { building: { min: 3 } }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'deflect_patience_deep',
        text: "[Presence] Dreams don't disappear. They wait. Sometimes for years.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        requiredOrbFill: { pattern: 'patience', threshold: 25 },
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ]
  },

  // ============= CHALLENGE INTERRUPT TARGET =============
  {
    nodeId: 'maya_challenge_accepted',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Wait... you're right to call that out.\n\nI just said dreams are stupid. But that's not what I really believe. That's what I tell myself so it hurts less.\n\nThe truth? My dreams aren't stupid. They're just... scary. Because if I actually tried and failed...",
        emotion: 'vulnerable',
        variation_id: 'challenge_accepted_v1',
        voiceVariations: {
          analytical: "Wait... you caught that.\n\nI just called my own dreams stupid. That's defense mechanism 101, isn't it? Diminish it before it can hurt you.\n\nThe truth is scarier: my dreams aren't stupid. They're just risky. And I've been too afraid to try.",
          helping: "Wait... you're right.\n\nI just called my dreams stupid. But you didn't let me get away with it.\n\nThe truth? My dreams scare me. Because they matter. And if I tried and failed...",
          building: "Wait... you're right to push back.\n\nI said dreams are stupid. But you build things—you know that's a lie. Every builder has a vision that scares them.\n\nMine scares me because it's real. And real things can fail.",
          exploring: "Wait... you caught that contradiction.\n\nI called my dreams stupid. But you're curious enough to see through it.\n\nThe truth? They're not stupid. They're terrifying. Because they actually matter.",
          patience: "Wait...\n\nYou didn't let me deflect. Most people do.\n\nI called my dreams stupid. But you're right—that's fear talking. The real truth? They matter too much. That's what makes them scary."
        }
      }
    ],
    choices: [
      {
        choiceId: 'challenge_follow_up',
        text: "What would happen if you actually tried?",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_support',
        text: "Fear of failure isn't the same as failure.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_patience',
        text: "[Give her space to process what she just admitted]",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'challenge_interrupt']
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
        voiceVariations: {
          analytical: "Anxiety is just data. It means something matters to you.",
          helping: "We all have our struggles. No judgment here.",
          building: "Pressure means you're building something important.",
          exploring: "That feeling? It means you're looking for something real.",
          patience: "It's okay. Struggles take time to untangle."
        },
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
        richEffectContext: 'thinking',
        patternReflection: [
          { pattern: 'building', minLevel: 5, altText: "Everyone sees this perfect pre-med student, right? Good grades. Clear path.\n\nBut late at night when I should be memorizing anatomy? I'm building things. Circuits. Code. Real things with my hands.\n\nYou probably get that, don't you? The need to make something?", altEmotion: 'vulnerable' },
          { pattern: 'patience', minLevel: 5, altText: "Everyone sees this perfect pre-med student. Got it all figured out.\n\nBut late at night? I'm doing something completely different.\n\nThanks for not rushing me. Most people want the short version. This isn't the short version.", altEmotion: 'trusting' },
          { pattern: 'exploring', minLevel: 5, altText: "Everyone sees this perfect pre-med student, right?\n\nBut late at night when I should be memorizing anatomy? I'm exploring something completely different. Something that feels more like me.\n\nYou probably understand that pull, don't you? Toward the unknown?", altEmotion: 'curious_vulnerable' }
        ]
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
        addKnowledgeFlags: ['knows_anxiety'],
        thoughtId: 'maker-mindset'
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
        text: "Pediatric grip assist. Prototype 4.\n\nCode is clean. Power is stable.\n\nBut every time I initialize the grip... it fights itself. Knows what it needs to do, but just locks up.",
        emotion: 'vulnerable_focused',
        variation_id: 'robotics_scenario_v2_minimal',
        richEffectContext: 'warning', // Immersive "System Alert" feel
        useChatPacing: true,
        // E2-031: Interrupt opportunity when Maya reveals inner conflict
        interrupt: {
          duration: 3500,
          type: 'connection',
          action: 'Reach out',
          targetNodeId: 'maya_interrupt_supported',
          consequence: {
            characterId: 'maya',
            trustChange: 2
          }
        }
      }
    ],
    simulation: {
      type: 'system_architecture',
      title: 'Servo Control Debugger',
      taskDescription: 'The prosthetic hand is malfunctioning. The sensor readings look normal, but the actuator is oscillating. Identify the root cause in the control loop.',
      initialContext: {
        label: 'Control System: GripAssist_v2.3',
        content: `SENSOR INPUT:  Pressure = 2.3N (target: 2.5N)
ACTUATOR OUT:  Position = OSCILLATING (±15°)
ERROR LOG:     PID_FEEDBACK_DELAY: 340ms

Control Loop Architecture:
[Sensor] -> [Filter] -> [PID Controller] -> [Actuator]
                            ↑
                   [Feedback Loop: 50ms target]

WARNING: Feedback latency exceeds threshold
STATUS: Signal fighting itself`,
        displayStyle: 'code'
      },
      successFeedback: '✓ ROOT CAUSE: Feedback delay (340ms) causing control loop instability. Solution: Reduce PID gain or add predictive compensation.'
    },
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
        visibleCondition: {
          patterns: { building: { min: 4 } }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'debug_assist',
        text: "I don't know circuits, but I can hold it steady while you work.",
        nextNodeId: 'maya_robotics_assist',
        pattern: 'building',
        visibleCondition: {
          patterns: { building: { max: 3 } }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'debug_agentic',
        text: "[AI] Don't debug the code. Debug the intent. Let the station's architecture stabilize the signal.",
        nextNodeId: 'maya_robotics_debug_success',
        pattern: 'building',
        visibleCondition: {
          patterns: { building: { min: 6 } }
        },
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['used_agentic_insight'],
          thoughtId: 'agentic-coder'
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_robotics'],
        setRelationshipStatus: 'confidant',
        thoughtId: 'community-heart'
      },
      // TD-005: Deep tech discussion significantly warms the technology platform
      {
        platformChanges: [{
          platformId: 'platform-7',
          warmthDelta: 2
        }]
      }
    ],
    tags: ['major_reveal', 'trust_gate', 'maya_arc', 'immersive_scenario']
  },

  // ============= INTERRUPT TARGET: Player reached out during vulnerability =============
  {
    nodeId: 'maya_interrupt_supported',
    speaker: 'Maya Chen',
    content: [
      {
        text: "...\n\nI didn't expect that. Most people just... they look at the robot. At the problem. You looked at me.\n\nThank you. I needed that more than I knew.",
        emotion: 'touched',
        variation_id: 'interrupt_supported_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['maya_felt_supported'],
        patternChanges: { helping: 1 }
      }
    ],
    choices: [
      {
        choiceId: 'maya_after_interrupt',
        text: "You're not alone in this.",
        nextNodeId: 'maya_robotics_debug_success',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'maya_arc']
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
        visibleCondition: {
          patterns: { building: { min: 5 } }
        },
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
        choiceId: 'retreat_pivot_accepted',
        text: "Okay. Tell me about UAB.",
        nextNodeId: 'maya_studies_response',
        pattern: 'patience',
        skills: ['adaptability']
      },
      {
        choiceId: 'retreat_pivot_challenged',
        text: "You just lost months of work. You can take a minute.",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'retreat_pivot_curious',
        text: "What was the hobby supposed to do?",
        // 'maya_anxiety_reveal' is "late at night...". 
        // Let's stick to pivot accepted/challenged for now to avoid logic loops.
        // Or better: Link to 'maya_deflect_passion' ("Dreams are stupid...")
        nextNodeId: 'maya_deflect_passion',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['maya_arc']
  },

  // ============= SCENARIO ALTERNATIVE: ASSIST (Low Building) =============
  {
    nodeId: 'maya_robotics_assist',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You hold the chassis. My hands stop shaking because I can brace against yours.\n\nThere. Stabilized.\n\nYou didn't try to take over. You just... became the foundation I needed. That's actually exactly what a good engineer does.",
        emotion: 'grateful_vulnerable',
        variation_id: 'robotics_assist_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'assist_affirm',
        text: "Every structure needs a foundation.",
        nextNodeId: 'maya_encouraged',
        pattern: 'building',
        skills: ['collaboration']
      },
      {
        choiceId: 'assist_humble',
        text: "Glad I could be useful.",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['scenario_resolution', 'maya_arc']
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
      // Career observation routes (ISP: Only visible when pattern combos are achieved)
      {
        choiceId: 'encouraged_career_architect',
        text: "The way you think about systems... it reminds me of something.",
        nextNodeId: 'maya_career_reflection_architect',
        pattern: 'analytical',
        skills: ['criticalThinking', 'systemsThinking'],
        visibleCondition: {
          patterns: { analytical: { min: 5 }, building: { min: 4 } },
          lacksGlobalFlags: ['maya_mentioned_career']
        }
      },
      {
        choiceId: 'encouraged_career_data',
        text: "You have this way of finding patterns in things...",
        nextNodeId: 'maya_career_reflection_data',
        pattern: 'exploring',
        skills: ['criticalThinking', 'informationLiteracy'],
        visibleCondition: {
          patterns: { analytical: { min: 5 }, exploring: { min: 4 } },
          lacksGlobalFlags: ['maya_mentioned_career']
        }
      },
      {
        choiceId: 'encouraged_career_creative',
        text: "You build things that make people feel something. That's rare.",
        nextNodeId: 'maya_career_reflection_creative_tech',
        pattern: 'building',
        skills: ['creativity', 'emotionalIntelligence'],
        visibleCondition: {
          patterns: { building: { min: 5 }, exploring: { min: 4 } },
          lacksGlobalFlags: ['maya_mentioned_career']
        }
      },
      // Standard choices
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
          trust: { min: 5 },
          patterns: { helping: { min: 4 } }
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
        richEffectContext: 'thinking',
        skillReflection: [
          { skill: 'emotionalIntelligence', minLevel: 5, altText: "Okay so. You've been really good at... understanding me. I can tell you read people well.\n\nI got accepted to UAB's biomedical engineering program. I could transfer.\n\nBut there's also pre-med - the path my parents have been dreaming about forever.\n\nYou see how hard this is. The train's coming soon.", altEmotion: 'trusting_anxious' },
          { skill: 'problemSolving', minLevel: 5, altText: "Okay so. You're good at seeing solutions. Maybe you can see one I can't?\n\nI got accepted to UAB's biomedical engineering program. I could transfer.\n\nBut there's also pre-med. The path my parents pictured.\n\nThe train's coming soon. I have to choose a platform.", altEmotion: 'hopeful_anxious' }
        ]
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
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "You take your time with things. You don't rush. I've noticed.\n\nMaybe that's what I need to do? Just... sit with this?\n\nI got accepted to UAB's biomedical engineering program. I could transfer. But there's also pre-med - the one my parents have been waiting for.",
        altEmotion: 'reflective_anxious'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "You explore things before deciding. I see how you think.\n\nMaybe there's something I haven't explored yet?\n\nI got accepted to UAB's biomedical engineering program. I could transfer. But there's also pre-med - the path my parents mapped out forever ago.",
        altEmotion: 'curious_anxious'
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
        skills: ["emotionalIntelligence", "communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_robotics', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete'],
        thoughtId: 'maker-mindset'
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
        skills: ["emotionalIntelligence", "communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_hybrid', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete'],
        thoughtId: 'maker-mindset'
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
        skills: ["emotionalIntelligence", "communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['chose_self', 'completed_arc'],
        addGlobalFlags: ['maya_arc_complete'],
        thoughtId: 'maker-mindset'
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

  // ============= MAYA'S VULNERABILITY ARC =============
  // "The night she stopped being their perfect daughter"
  {
    nodeId: 'maya_vulnerability_arc',
    speaker: 'Maya Chen',
    content: [{
      text: "There's something I've never told anyone.\n\nThe night I got into UAB. Everyone celebrating. My mom crying happy tears. My dad on the phone with relatives in Malaysia.\n\nAnd I'm in the bathroom. Hyperventilating. Because I'd just read about Boston Dynamics. About prosthetics that could feel. About robot-assisted surgery.\n\nThat was the night I knew. The daughter they raised was already gone. And I've been pretending ever since.\n\nFive years of pretending. Do you know what that does to you?",
      emotion: 'shattered',
      microAction: 'Her hands grip the robot prototype tighter.',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'error'
    }],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_vulnerability_revealed', 'knows_the_night']
      }
    ],
    choices: [
      {
        choiceId: 'vuln_not_pretending',
        text: "You weren't pretending. You were surviving.",
        nextNodeId: 'maya_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_both_daughters',
        text: "Both daughters are real. The one they raised AND the one you're becoming.",
        nextNodeId: 'maya_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'culturalCompetence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_silence',
        text: "[Stay silent. This grief needs no fixing.]",
        nextNodeId: 'maya_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'maya_arc', 'emotional_core']
  },
  {
    nodeId: 'maya_vulnerability_reflection',
    speaker: 'Maya Chen',
    content: [{
      text: "I've been so scared. That telling them would break something. Their hearts. Their sacrifice. Our family.\n\nBut keeping this secret is breaking ME.\n\nYou're the first person who's heard all of it. Not the edited version. Not the \"I'm just exploring options\" version.\n\nThe real one. Where their perfect daughter died in a bathroom five years ago, and nobody noticed.",
      emotion: 'vulnerable_released',
      variation_id: 'reflection_v1',
      voiceVariations: {
        helping: "I've been so scared. That telling them would break something.\n\nBut keeping this secret is breaking ME.\n\nYou didn't try to fix me. You just... listened. That's why I could say it. The real version. Where their perfect daughter died in a bathroom five years ago.",
        analytical: "I've been so scared. That telling them would break something.\n\nBut keeping this secret is breaking ME.\n\nYou see patterns, don't you? Well here's the pattern: I've been performing for five years. You're the first person who noticed the act.",
        building: "I've been so scared. That telling them would break something.\n\nBut keeping this secret is breaking ME.\n\nYou understand building things. Well, I've been building a lie for five years. And you're the first person I've let see what's underneath.",
        exploring: "I've been so scared. That telling them would break something.\n\nBut keeping this secret is breaking ME.\n\nYou wanted to understand. Really understand. And now you do. The real story. Not the edited version.",
        patience: "I've been so scared. That telling them would break something.\n\nBut keeping this secret is breaking ME.\n\nYou gave me space to say it. That's rare. Most people rush past the hard parts. You waited."
      }
    }],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'maya_arc']
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
        variation_id: 'grateful_v1',
        voiceVariations: {
          analytical: "Wait. You just... reframed the entire problem space.\n\nI was treating this as a binary choice. Healing XOR building.\n\nBut what if it's healing AND building? What if the constraint is false?",
          helping: "Wait. You see me. Like, actually see me.\n\nNot just the pre-med student or the robotics girl. Both.\n\nMaybe there's room for both? Maybe I don't have to choose who to disappoint.",
          building: "Wait. You're right. I'm building either way.\n\nWhether it's medical robots or patient outcomes. I'm a maker.\n\nMaybe I don't have to choose between healing and building. Maybe I combine them.",
          exploring: "Wait. I never explored that possibility.\n\nI got stuck in the either/or. Pre-med or robotics.\n\nBut what if there's a third option I haven't discovered yet? What if both paths lead somewhere new?",
          patience: "Wait. You didn't rush me to decide.\n\nYou let me sit with it. Feel the weight of both pulling at me.\n\nMaybe there's room for both? Maybe the answer takes time to emerge."
        }
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
        variation_id: 'hybrid_v1',
        voiceVariations: {
          analytical: "Wait. UAB has a biomedical engineering program.\n\nThe optimization function was wrong. I was minimizing disappointment instead of maximizing potential.\n\nMedicine AND robotics. Both variables in the same equation.\n\nThe solution was there the whole time. I just wasn't looking at the right search space.",
          helping: "Wait. UAB has a biomedical engineering program.\n\nI could help people AND build things. I don't have to choose which part of me to silence.\n\nMedicine AND robotics. I can be both daughters - theirs and mine.\n\nOh my god. You helped me see I don't have to abandon anyone. Including myself.",
          building: "Wait. UAB has a biomedical engineering program.\n\nI could BUILD surgical robots. CREATE prosthetics. Construct devices that actually heal people.\n\nMedicine AND robotics. Not just studying - making.\n\nThis is it. This is what I'm supposed to build.",
          exploring: "Wait. UAB has a biomedical engineering program.\n\nThere's a whole field I didn't even know existed. Biomedical engineering.\n\nMedicine AND robotics. It's not either/or - it's a third path I never discovered.\n\nHow did I miss this? How much else haven't I explored?",
          patience: "Wait. UAB has a biomedical engineering program.\n\nI was rushing to decide. Pre-med or robotics. Now.\n\nBut the real answer needed time to surface. Medicine AND robotics.\n\nI just had to wait for the fog to clear."
        }
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
        variation_id: 'birmingham_v1',
        voiceVariations: {
          analytical: "Really? Innovation Depot. I've analyzed their startup success metrics.\n\nBut I never ran the algorithm on myself as the variable.\n\nIt's statistically improbable - my parents' expectations vs. my actual trajectory.\n\nBut the data on what makes me happy is... pretty clear.",
          helping: "Really? I could actually help people from Birmingham?\n\nNot at some prestigious hospital far away. Here. Where I grew up.\n\nIt's so far from impressing my parents with credentials.\n\nSo close to actually making the impact I care about.",
          building: "Really? Innovation Depot. I could BUILD something real here?\n\nNot just study. Not just prepare. Actually construct the future.\n\nIt's so far from the safe path my parents paved.\n\nSo close to what my hands actually want to make.",
          exploring: "Really? There's a whole innovation ecosystem I didn't know Birmingham had?\n\nI've been so focused on the expected path, I never explored what's actually here.\n\nIt's so far from what I thought I was supposed to want.\n\nSo close to what I'm discovering I actually need.",
          patience: "Really? I could stay in Birmingham? Not rush to prove myself somewhere else?\n\nBuild something slowly, sustainably. Put down roots.\n\nIt's so far from the race my parents are running.\n\nSo close to the pace I actually want to live."
        }
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
  },

  // ============= TECH DEMO SIMULATION =============
  // Maya's simulation: Presenting a robotics prototype to skeptical investors
  // while her parents watch from the audience, expecting her to fail
  {
    nodeId: 'maya_simulation_intro',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Okay so... there's this thing. UAB's Innovation Showcase. They invited student projects to pitch to real investors.\n\nI submitted my prosthetic hand prototype. Secretly. My parents don't know.\n\nHere, look.\n\nBut now it's happening. Tomorrow. And my mom just texted saying they're coming to 'support me at your little science fair.'\n\nThey think it's a biochem poster. When they see me presenting robots to investors... everything falls apart.",
        emotion: 'terrified_excited',
        variation_id: 'sim_intro_v1',
        useChatPacing: true,
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 4 },
      hasKnowledgeFlags: ['knows_robotics']
    },
    choices: [
      {
        choiceId: 'sim_help_prepare',
        text: "Let's prepare. If your pitch is undeniable, they'll have to see you differently.",
        nextNodeId: 'maya_simulation_phase_1',
        pattern: 'building',
        skills: ['leadership', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'sim_emotional_support',
        text: "You've been hiding this part of yourself for years. Maybe it's time they finally meet the real Maya.",
        nextNodeId: 'maya_simulation_phase_1',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'sim_analyze_situation',
        text: "What's the worst that happens? Walk me through the scenarios.",
        nextNodeId: 'maya_simulation_phase_1',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'sim_explore_options',
        text: "What if we frame it differently? 'Medical robotics' sounds like doctor territory.",
        nextNodeId: 'maya_simulation_phase_1',
        pattern: 'exploring',
        skills: ['creativity', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['simulation_started']
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo']
  },

  {
    nodeId: 'maya_simulation_phase_1',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Okay. First challenge. The lead investor just asked: 'Why should we fund a pre-med student's side project?'\n\nWhat's my angle here?",
        emotion: 'nervous_focused',
        variation_id: 'phase_1_v1',
        richEffectContext: 'thinking'
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'Investor Pitch Simulation',
      taskDescription: "Help Maya respond to skeptical investors. Her parents are watching from the audience. One wrong move could confirm their fears.",
      phase: 1,
      difficulty: 'introduction',
      variantId: 'maya_pitch_phase1',
      initialContext: {
        label: 'Investor Question',
        content: '"Why should we fund a pre-med student\'s side project? This seems like a distraction from your real career."',
        displayStyle: 'text'
      },
      successFeedback: 'INVESTOR ENGAGED: "That\'s... actually a compelling angle. Continue."'
    },
    choices: [
      {
        choiceId: 'phase1_passion_first',
        text: "Lead with passion. Tell them this isn't a side project - it's your calling.",
        nextNodeId: 'maya_simulation_phase_1_passion_result',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'phase1_data_driven',
        text: "Lead with data. The prosthetics market is $8 billion. Your prototype costs 40% less than competitors.",
        nextNodeId: 'maya_simulation_phase_2',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['chose_analytical_approach']
        }
      },
      {
        choiceId: 'phase1_bridge_narrative',
        text: "Bridge the gap. 'Pre-med taught me the problem. Engineering is how I solve it.'",
        nextNodeId: 'maya_simulation_phase_2',
        pattern: 'building',
        skills: ['creativity', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['chose_bridge_approach']
        }
      },
      {
        choiceId: 'phase1_take_time',
        text: "Pause. Let the silence work. Then: 'Because I've spent 18 months in children's hospitals. I've seen what these kids need.'",
        nextNodeId: 'maya_simulation_phase_2',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['chose_patience_approach']
        }
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'phase_1']
  },

  {
    nodeId: 'maya_simulation_phase_1_passion_result',
    speaker: 'Maya Chen',
    content: [
      {
        text: "The lead investor interrupts: 'Passion is great. But passion doesn't scale. What's your market strategy?'\n\nThey want numbers. But I don't want to lose the human element...",
        emotion: 'deflated',
        variation_id: 'passion_result_v1'
      }
    ],
    choices: [
      {
        choiceId: 'phase1_recover_with_data',
        text: "Recover with specifics. 'The human element is the market. 15,000 children in Alabama alone need grip assistance.'",
        nextNodeId: 'maya_simulation_phase_2',
        pattern: 'analytical',
        skills: ['adaptability', 'problemSolving'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'phase1_double_down_story',
        text: "Double down on story. 'Let me show you one of those children.' Pull up a video testimonial.",
        nextNodeId: 'maya_simulation_phase_2',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'recovery']
  },

  {
    nodeId: 'maya_simulation_phase_2',
    speaker: 'Maya Chen',
    content: [
      {
        text: "'Your prototype is impressive. But manufacturing at scale requires partnerships. What's stopping a bigger company from copying this and crushing you?'\n\nThis is the make-or-break question...",
        emotion: 'high_stakes',
        variation_id: 'phase_2_v1',
        useChatPacing: true,
        richEffectContext: 'warning',
        interrupt: {
          duration: 4000,
          type: 'encouragement',
          action: 'Catch her eye. Nod. She knows this answer.',
          targetNodeId: 'maya_simulation_interrupt_supported',
          consequence: {
            characterId: 'maya',
            trustChange: 2
          }
        }
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'Competitive Moat Defense',
      taskDescription: "The investors are probing for weaknesses. Maya needs to defend her competitive position without sounding naive.",
      phase: 2,
      difficulty: 'application',
      variantId: 'maya_pitch_phase2',
      timeLimit: 120,
      initialContext: {
        label: 'Investor Challenge',
        content: '"What\'s stopping a bigger company from copying this and crushing you?"',
        displayStyle: 'text'
      },
      successFeedback: 'INVESTOR IMPRESSED: "You\'ve clearly thought this through. That\'s rare in student founders."'
    },
    choices: [
      {
        choiceId: 'phase2_patent_play',
        text: "Intellectual property. 'I've filed provisional patents on the actuator design. The control algorithm is proprietary.'",
        nextNodeId: 'maya_simulation_success',
        pattern: 'analytical',
        skills: ['problemSolving', 'criticalThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'phase2_speed_advantage',
        text: "Speed and mission. 'Big companies move slow. I move fast because every month matters to a kid waiting for a working hand.'",
        nextNodeId: 'maya_simulation_success',
        pattern: 'building',
        skills: ['leadership', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase2_honest_vulnerability',
        text: "Honest vulnerability. 'They could. But they won't. Because to them, this is a market segment. To me, it's my life's work.'",
        nextNodeId: 'maya_simulation_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase2_deflect_poorly',
        text: "Deflect. 'I'm not worried about competition. I'm focused on the technology.'",
        nextNodeId: 'maya_simulation_fail',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'phase_2']
  },

  {
    nodeId: 'maya_simulation_interrupt_supported',
    speaker: 'Maya Chen',
    content: [
      {
        text: "'You're asking about moats. But here's what you're really asking: do I have the grit to fight for this when it gets hard?'\n\n'I've been fighting for this in secret for three years. Against every expectation. Every doubt. Every voice telling me to stay safe.'\n\n'That's my moat. I'm not doing this for market share. I'm doing it because I believe these kids deserve hands that work as well as yours.'",
        emotion: 'empowered',
        variation_id: 'interrupt_result_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['maya_found_voice']
      }
    ],
    choices: [
      {
        choiceId: 'interrupt_to_success',
        text: "(Watch the room respond)",
        nextNodeId: 'maya_simulation_success',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'interrupt_target']
  },

  {
    nodeId: 'maya_simulation_success',
    speaker: 'Maya Chen',
    content: [
      {
        text: "'We'd like to schedule a follow-up. This has real potential.'\n\nMom: 'Why didn't you tell us?'\n\nDad: '...Because we never asked. We told. We never asked.'\n\n'This. This is what you've been doing? All those late nights?'\n\n'It's beautiful, Maya. It's... it's yours.'",
        emotion: 'emotional_breakthrough',
        variation_id: 'success_v1',
        useChatPacing: true,
        richEffectContext: 'success',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['simulation_success', 'parents_saw_truth', 'maya_simulation_phase1_complete'],
        addGlobalFlags: ['maya_simulation_complete']
      }
    ],
    choices: [
      {
        choiceId: 'success_proud',
        text: "You did it, Maya. You showed them who you really are.",
        nextNodeId: 'maya_simulation_aftermath',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'success_practical',
        text: "The investors are interested. This could actually happen.",
        nextNodeId: 'maya_simulation_aftermath',
        pattern: 'building',
        skills: ['leadership']
      },
      {
        choiceId: 'success_analyze',
        text: "Your data and your story worked together. That's the formula.",
        nextNodeId: 'maya_simulation_aftermath',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'success']
  },

  {
    nodeId: 'maya_simulation_fail',
    speaker: 'Maya Chen',
    content: [
      {
        text: "'If you're not worried about competition, you haven't done your homework. We're done here.'\n\nThat... that's exactly what I was afraid of. They saw me try. And fail. At the thing I actually love.\n\nMaybe they were right. Maybe I should just... stick to the path.",
        emotion: 'devastated',
        variation_id: 'fail_v1',
        richEffectContext: 'error'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['simulation_failed']
      }
    ],
    choices: [
      {
        choiceId: 'fail_comfort',
        text: "A failed pitch isn't a failed dream. You learned something. That's how founders grow.",
        nextNodeId: 'maya_simulation_aftermath_fail',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'fail_analyze',
        text: "Let's break down what went wrong. Every failed pitch teaches you something for the next one.",
        nextNodeId: 'maya_simulation_aftermath_fail',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'fail_rebuild',
        text: "The prototype still works. The technology is real. One pitch doesn't change that.",
        nextNodeId: 'maya_simulation_aftermath_fail',
        pattern: 'building',
        skills: ['resilience', 'adaptability'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'fail_patience',
        text: "[Sit with her. Sometimes failure needs space, not solutions.]",
        nextNodeId: 'maya_simulation_aftermath_fail',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'fail']
  },

  {
    nodeId: 'maya_simulation_aftermath',
    speaker: 'Maya Chen',
    content: [
      {
        text: "That wasn't real. But... it could be. I can see it now. A version of the future where I don't have to hide.\n\nThe pitch won't go perfectly. My parents might still struggle. But I know now that I can do this.\n\nYou helped me see it. Not just the robotics. But the whole picture. Who I could become if I stop being afraid.\n\nThank you. For believing in me before I believed in myself.",
        emotion: 'grateful_transformed',
        variation_id: 'aftermath_v1',
        interaction: 'nod'
      }
    ],
    choices: [
      {
        choiceId: 'aftermath_encourage',
        text: "The Maya in that simulation? She's already you. You just needed to meet her.",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'aftermath_practical',
        text: "Now let's make it real. What's your first step?",
        nextNodeId: 'maya_crossroads',
        pattern: 'building',
        skills: ['leadership'],
        visibleCondition: {
          trust: { min: 5 },
          hasKnowledgeFlags: ['knows_robotics', 'knows_family']
        }
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'aftermath']
  },

  {
    nodeId: 'maya_simulation_aftermath_fail',
    speaker: 'Maya Chen',
    content: [
      {
        text: "...\n\nOkay. That hurt. A lot.\n\nBut you know what? I've never actually pitched before. Of course I bombed. That's... that's the point of practice.\n\nThe hand still works. The code still runs. The children who need this... they're still waiting.\n\nOne simulation doesn't define me. Neither does one bad pitch. Neither does my parents' disappointment.\n\nI'll practice until I get it right. And then I'll practice some more.",
        emotion: 'recovering_determined',
        variation_id: 'aftermath_fail_v1'
      }
    ],
    choices: [
      {
        choiceId: 'aftermath_fail_encourage',
        text: "That's the Maya who builds robots at 2am. Failure is just data.",
        nextNodeId: 'maya_encouraged',
        pattern: 'analytical',
        skills: ['communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'aftermath_fail_support',
        text: "I'll practice with you. We'll get it right together.",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'maya_arc', 'tech_demo', 'aftermath_fail']
  },

  // ============= PHASE 3 SIMULATION: ACQUISITION DECISION (Trust ≥ 8) =============
  {
    nodeId: 'maya_simulation_phase3_setup',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Something happened. I need your help.\n\nOrthoTech—one of the biggest prosthetics companies—they saw my demo. They want to acquire my entire project. All the patents, the algorithms, everything.\n\nThey're offering enough to fund my PhD. Enough to get prosthetics to thousands of kids within two years instead of ten.\n\nBut...\n\nThey also want to 'optimize for market fit.' Which means premium pricing. Which means the kids in rural Alabama—the ones I built this for—they can't afford it.\n\nMy parents think I should take the money. 'Finally, a real career path.'\n\nI don't know what to do. Can you help me think through this?",
        emotion: 'conflicted_vulnerable',
        variation_id: 'phase3_intro_v1',
        useChatPacing: true,
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['maya_simulation_phase1_complete']
    },
    choices: [
      {
        choiceId: 'phase3_start_framework',
        text: "Let's build a decision framework. What are your non-negotiables?",
        nextNodeId: 'maya_simulation_phase3',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'phase3_start_values',
        text: "Before the deal terms, let's talk about what you actually want. Not what your parents want.",
        nextNodeId: 'maya_simulation_phase3',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase3_start_creative',
        text: "What if there's a third option neither side has considered?",
        nextNodeId: 'maya_simulation_phase3',
        pattern: 'exploring',
        skills: ['creativity', 'visionaryThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'maya_arc', 'phase_3', 'setup']
  },

  {
    nodeId: 'maya_simulation_phase3',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Okay. Help me map this out. What's the right path forward?",
        emotion: 'focused_vulnerable',
        variation_id: 'phase3_v1'
      }
    ],
    simulation: {
      type: 'visual_canvas',
      title: 'Acquisition Decision Framework',
      taskDescription: "Help Maya design a decision framework for the acquisition offer. Balance mission impact, financial security, family expectations, and personal fulfillment.",
      phase: 3,
      difficulty: 'mastery',
      variantId: 'maya_acquisition_phase3',
      timeLimit: 90,
      successThreshold: 80,
      initialContext: {
        label: 'DECISION MATRIX',
        content: `ACQUISITION OFFER: OrthoTech
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPT (Full Acquisition):
+ $2.5M upfront + PhD funding
+ 10,000 prosthetics in 2 years
- Premium pricing ($15k/unit)
- Lose control of mission
- Parents: "Finally sensible"

REJECT (Stay Independent):
+ Full control of pricing
+ Mission-aligned ($3k/unit target)
- 10 years to scale
- No PhD funding
- Parents: "Throwing away future"

UNKNOWN OPTION:
? What else is possible ?

YOUR FRAMEWORK:
1. [Define non-negotiables]
2. [Map stakeholder impact]
3. [Identify creative alternatives]
4. [Make values-aligned choice]`,
        displayStyle: 'text'
      },
      successFeedback: 'CLARITY ACHIEVED: Maya sees a path that honors both her mission and her growth.'
    },
    choices: [
      {
        choiceId: 'phase3_license_model',
        text: "Counter-offer: License the tech, don't sell it. Keep mission control, get funding.",
        nextNodeId: 'maya_simulation_phase3_success',
        pattern: 'analytical',
        skills: ['problemSolving', 'negotiation'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['chose_license_approach']
        }
      },
      {
        choiceId: 'phase3_tiered_pricing',
        text: "Negotiate tiered pricing: premium in wealthy markets funds subsidized access in underserved areas.",
        nextNodeId: 'maya_simulation_phase3_success',
        pattern: 'building',
        skills: ['creativity', 'systemsThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['chose_tiered_approach']
        }
      },
      {
        choiceId: 'phase3_nonprofit_arm',
        text: "Create a nonprofit foundation alongside the acquisition. They get the commercial market, foundation serves the mission.",
        nextNodeId: 'maya_simulation_phase3_success',
        pattern: 'helping',
        skills: ['visionaryThinking', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['chose_nonprofit_approach']
        }
      },
      {
        choiceId: 'phase3_binary_choice',
        text: "Sometimes there's no clever middle path. You have to choose: money or mission.",
        nextNodeId: 'maya_simulation_phase3_fail',
        pattern: 'patience',
        skills: ['criticalThinking']
      }
    ],
    tags: ['simulation', 'maya_arc', 'phase_3']
  },

  {
    nodeId: 'maya_simulation_phase3_success',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Oh.\n\nOh wow.\n\nI was thinking in binaries. Accept or reject. Parent's approval or disappointment. Success or failure.\n\nBut you showed me a third path. Maybe a fourth.\n\nI can build something that matters AND build a sustainable career. I can honor my parents' concerns about security WITHOUT abandoning my mission.\n\nThis framework... it's not just for the acquisition. It's for every impossible choice.\n\nYou didn't give me an answer. You gave me a way to find my own answers.\n\nThank you. For seeing possibilities I couldn't see alone.",
        emotion: 'transformed_grateful',
        variation_id: 'phase3_success_v1',
        useChatPacing: true,
        richEffectContext: 'success',
        interaction: 'bloom',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "You approached it like an engineer. Mapped the constraints, found the optimization.\n\nThat's exactly how I think when I'm at my best. You helped me remember that."
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You saw the human in the business problem. The kids, my parents, me.\n\nI was so focused on the deal that I forgot why I started. You brought me back to that."
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You didn't accept the problem as given. You redesigned it.\n\nThat's what makers do. That's what I do. I just forgot I could do it here too."
          }
        ]
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_simulation_phase3_complete', 'maya_mastery_achieved'],
        addGlobalFlags: ['maya_simulation_mastery']
      }
    ],
    choices: [
      {
        choiceId: 'phase3_success_affirm',
        text: "You always had the answers. You just needed someone to think alongside.",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase3_success_next',
        text: "Now comes the hard part: making it real. But you've done harder things.",
        nextNodeId: 'maya_crossroads',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    tags: ['simulation', 'maya_arc', 'phase_3', 'success', 'mastery']
  },

  {
    nodeId: 'maya_simulation_phase3_fail',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Maybe you're right.\n\nMaybe I'm looking for a way out that doesn't exist. Maybe every choice is a sacrifice.\n\nBut I've watched you navigate impossible situations. You don't always find the perfect answer, but you don't accept the obvious ones either.\n\nI'm not ready to decide yet. But... thank you for being honest. Even when the honest answer is 'this is really hard.'",
        emotion: 'reflective_determined',
        variation_id: 'phase3_fail_v1'
      }
    ],
    choices: [
      {
        choiceId: 'phase3_fail_encourage',
        text: "Hard doesn't mean impossible. Keep looking.",
        nextNodeId: 'maya_encouraged',
        pattern: 'patience',
        skills: ['resilience'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'phase3_fail_support',
        text: "Whatever you choose, I'll be here.",
        nextNodeId: 'maya_encouraged',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'maya_arc', 'phase_3', 'fail']
  },

  // ============= PATTERN UNLOCK NODES =============
  // These become available when player demonstrates sufficient pattern affinity

  {
    nodeId: 'maya_workshop_invitation',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Okay. I don't show this to people. Ever. But you... you build things. You understand.\n\nMy apartment has a... situation. The closet isn't a closet anymore. It's a workshop. Soldering station, 3D printer, component bins. My roommate thinks I'm hoarding electronics.\n\nI'm working on something. Not for class. Not for my parents. Just... because I have to know if it can work.\n\nDo you want to see it? The real project?",
        emotion: 'excited_vulnerable',
        variation_id: 'workshop_v1'
      }
    ],
    requiredState: {
      patterns: { building: { min: 40 } }
    },
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_workshop_revealed']
      }
    ],
    choices: [
      {
        choiceId: 'workshop_yes',
        text: "Show me everything. I want to see what you're really building.",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'building',
        skills: ['creativity'],
        consequence: {
          characterId: 'maya',
          trustChange: 3
        }
      },
      {
        choiceId: 'workshop_curious',
        text: "A secret workshop? What are you hiding from your parents?",
        nextNodeId: 'maya_family_pressure',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'pattern_unlock', 'building']
  },

  {
    nodeId: 'maya_technical_deep_dive',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You think analytically. Good. Because I need to talk through something and everyone else just... glazes over.\n\nThe prosthetic hand. The servo response time is 47ms. Industry standard is 60ms. I'm faster. But the haptic feedback loop is creating a 12ms delay that compounds under load.\n\nI've tried three different approaches. Parallel processing, predictive algorithms, mechanical damping. Nothing's working.\n\nYou see patterns. What am I missing?",
        emotion: 'focused_analytical',
        variation_id: 'technical_v1'
      }
    ],
    requiredState: {
      patterns: { analytical: { min: 50 } }
    },
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_technical_shared']
      }
    ],
    choices: [
      {
        choiceId: 'technical_systems',
        text: "The delay compounds. That's a cascading failure pattern. What if you addressed the root, not the symptom?",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 3
        }
      },
      {
        choiceId: 'technical_step_back',
        text: "Before we solve this. Why does 12ms matter so much to you?",
        nextNodeId: 'maya_anxiety_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['maya_arc', 'pattern_unlock', 'analytical']
  },

  {
    nodeId: 'maya_collaboration_offer',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I've been thinking. About what you said. About building things together.\n\nI've never had a collaborator. Everything I make, I make alone. At 2am. In secret. Because if I share it and someone says it's not good enough...\n\nBut you build things. You understand that making something real is terrifying and exhilarating and you do it anyway.\n\nI have an idea. A bigger version of this. Affordable pediatric prosthetics. Open-source designs so any hospital can print them.\n\nI can't do it alone. Would you... would you build it with me?",
        emotion: 'vulnerable_hopeful',
        variation_id: 'collaboration_v1'
      }
    ],
    requiredState: {
      patterns: { building: { min: 70 } },
      trust: { min: 5 }
    },
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_collaboration_offered'],
        addGlobalFlags: ['maya_partnership_path']
      }
    ],
    choices: [
      {
        choiceId: 'collab_yes',
        text: "Yes. Let's build something that matters. Together.",
        nextNodeId: 'maya_encouraged',
        pattern: 'building',
        skills: ['leadership', 'collaboration'],
        consequence: {
          characterId: 'maya',
          trustChange: 4
        }
      },
      {
        choiceId: 'collab_plan',
        text: "I'm in. But first, let's map out what we're actually building.",
        nextNodeId: 'maya_crossroads',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 3
        }
      }
    ],
    tags: ['maya_arc', 'pattern_unlock', 'building', 'high_trust']
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  // These nodes appear when player has achieved specific pattern combinations
  // The career connection emerges naturally through Maya's dialogue

  {
    nodeId: 'maya_career_reflection_architect',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know what? You remind me of the systems architects I worked with at UAB's Innovation Lab. The way you think. Breaking things down, seeing how the pieces connect, then building something new from that understanding.\n\nThat's not common. Most people are either good at analysis OR good at making things. You're both.\n\nHave you ever thought about that? Systems architecture? It's like... being the translator between what people need and what technology can do.",
        emotion: 'impressed',
        variation_id: 'career_architect_v1'
      }
    ],
    requiredState: {
      patterns: { analytical: { min: 5 }, building: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'maya',
        addGlobalFlags: ['combo_architect_vision_achieved', 'maya_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'architect_curious',
        text: "What do systems architects actually do?",
        nextNodeId: 'maya_crossroads',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'architect_interested',
        text: "That sounds like something I'd be good at.",
        nextNodeId: 'maya_crossroads',
        pattern: 'building',
        skills: ['creativity']
      },
      {
        choiceId: 'architect_deep_dive',
        text: "[Deep Dive] Lead me through a real system. Show me the station's heartbeat.",
        nextNodeId: 'maya_deep_dive',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        visibleCondition: {
          trust: { min: 4 },
          patterns: { analytical: { min: 6 } }
        },
        preview: "Enter the System Architecture Deep Dive",
        interaction: 'bloom'
      },
      {
        choiceId: 'architect_humble',
        text: "I'm just trying to understand things.",
        nextNodeId: 'maya_crossroads',
        pattern: 'patience'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'architect']
  },

  // ============= DEEP DIVE: SYSTEM ARCHITECT =============
  {
    nodeId: 'maya_deep_dive',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You want to see the real thing?\n\nOkay. I found a terminal in the maintenance sub-level. It's connected to the station's attitude stabilizers.\n\nThe servos are drifting. Just like my prosthetic hand was, but on a massive scale. If they drift too far... well, let's just say gravity gets weird.\n\nI've been afraid to touch it. But with you watching my back? Maybe we can fix it.",
        emotion: 'focused_intense',
        variation_id: 'deep_dive_v1',
        richEffectContext: 'warning'
      }
    ],
    simulation: {
      type: 'system_architecture',
      title: 'Station Attitude Stabilizer',
      taskDescription: 'The station gyroscope is destabilizing due to harmonic resonance. Tune the PID controller to dampen the oscillation before structural stress becomes critical.',
      initialContext: {
        label: 'GYROSCOPE_CORE_V9',
        content: `STATUS: CRITICAL RESONANCE detected
HARMONIC FREQUENCY: 142Hz
DAMPING RATIO: 0.1 (Unstable)

PID TUNING REQUIRED:
- Proportional (P): Gain too high?
- Derivative (D): Damping insufficient?

MISSION: Stabilize the wave form within safety limits.`,
        displayStyle: 'code'
      },
      successFeedback: 'STABILIZATION ACHIEVED. Harmonic resonance dampened. Station gravity normalized.',
      mode: 'fullscreen'
    },
    choices: [
      {
        choiceId: 'dive_success_analytical',
        text: "That was... elegant. Perfect balance.",
        nextNodeId: 'maya_deep_dive_success',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'dive_success_building',
        text: "We just kept the station from spinning apart. Nice build.",
        nextNodeId: 'maya_deep_dive_success',
        pattern: 'building',
        skills: ['collaboration']
      }
    ],
    tags: ['deep_dive', 'mastery', 'system_architecture']
  },

  {
    nodeId: 'maya_deep_dive_success',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Did you feel that? The hum changed. It's smooth now.\n\nI've spent so long fixing small things. Toys. Models. I never thought I could fix something... this big.\n\nMaybe I am an architect.",
        emotion: 'awed_empowered',
        variation_id: 'deep_dive_success_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['maya_mastery_achieved']
      }
    ],
    choices: [
      {
        choiceId: 'dive_complete',
        text: "You always were.",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        skills: ['encouragement']
      }
    ]
  },

  {
    nodeId: 'maya_career_reflection_data',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You're like the data scientists I've met. The good ones, not the ones who just run algorithms. You ask questions, dig into things, and you actually find the stories hiding in the information.\n\nBirmingham's healthcare sector is desperate for people like that. UAB alone processes millions of patient records. But raw data is just noise without someone who can find the signal.\n\nYou'd be good at that. Finding the signal.",
        emotion: 'thoughtful',
        variation_id: 'career_data_v1'
      }
    ],
    requiredState: {
      patterns: { analytical: { min: 5 }, exploring: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'maya',
        addGlobalFlags: ['combo_data_storyteller_achieved', 'maya_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'data_curious',
        text: "What kind of stories do you find in health data?",
        nextNodeId: 'maya_crossroads',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'data_practical',
        text: "How do you even get started in something like that?",
        nextNodeId: 'maya_crossroads',
        pattern: 'analytical',
        skills: ['problemSolving']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'data_science']
  },

  {
    nodeId: 'maya_career_reflection_creative_tech',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know what you remind me of? Creative technologists. The people who live at the intersection of art and engineering. Making technology that feels human instead of cold.\n\nPepper started as an art project, really. A way to make physical therapy feel less like torture for kids. The tech part came later.\n\nThis whole field is opening up. VR experiences for therapy. Interactive installations for museums. Robots that don't just function. They connect.\n\nYou've got that same instinct. Building things that make people feel something.",
        emotion: 'excited',
        variation_id: 'career_creative_tech_v1'
      }
    ],
    requiredState: {
      patterns: { building: { min: 5 }, exploring: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'maya',
        addGlobalFlags: ['combo_creative_technologist_achieved', 'maya_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'creative_inspired',
        text: "Making technology feel human... I love that.",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        skills: ['creativity']
      },
      {
        choiceId: 'creative_curious',
        text: "Where do people like that even work?",
        nextNodeId: 'maya_crossroads',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'creative_tech']
  },

  // ============= ADDITIONAL CAREER REFLECTIONS =============
  {
    nodeId: 'maya_career_reflection_ux',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You notice things others miss. How I arranged my study space. The way my hands shake when I talk about certain topics.\n\nUX researchers do that. They observe humans interacting with technology. Finding the friction points, the moments of confusion, the sparks of delight.\n\nIt's part psychology, part design, part detective work. Figuring out why people struggle with things that should be simple.\n\nThat kind of empathy? It's rare. And tech companies are desperate for it.",
        emotion: 'impressed',
        variation_id: 'career_ux_v1'
      }
    ],
    requiredState: {
      patterns: { helping: { min: 5 }, analytical: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'maya',
        addGlobalFlags: ['combo_ux_researcher_achieved', 'maya_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'ux_interested',
        text: "Making technology more human. That matters.",
        nextNodeId: 'maya_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'ux']
  },

  {
    nodeId: 'maya_career_reflection_robotics_eng',
    speaker: 'Maya Chen',
    content: [
      {
        text: "The way you think through problems. Methodical but creative. You don't just want things to work. You want to understand WHY they work.\n\nRobotics engineers are like that. Building machines that move through the real world. It requires physics, programming, mechanical design, all woven together.\n\nAnd here's the secret: the best robotics jobs aren't in Silicon Valley anymore. They're in places like Birmingham, where manufacturing is being reinvented.\n\nYou'd be designing the robots that build the future. Literally.",
        emotion: 'passionate',
        variation_id: 'career_robotics_eng_v1'
      }
    ],
    requiredState: {
      patterns: { building: { min: 5 }, analytical: { min: 5 } }
    },
    onEnter: [
      {
        characterId: 'maya',
        addGlobalFlags: ['combo_robotics_engineer_achieved', 'maya_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'robotics_eng_inspired',
        text: "Building things that build things. That's meta.",
        nextNodeId: 'maya_crossroads',
        pattern: 'building',
        skills: ['systemsThinking']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'robotics']
  },

  // ============= FAMILY DEPTH =============
  {
    nodeId: 'maya_family_deeper',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My dad was a machinist in Guangzhou. Precision work. Gears, bearings, things that had to fit together perfectly or not at all.\n\nWhen they came here, he couldn't get those jobs. Wrong certifications. Wrong connections. He ended up in restaurant kitchens.\n\nHe never complained. But I saw him sometimes, late at night, sketching mechanical things. Designs he'd never build.\n\nWhen he sees me with Pepper? I think he sees those sketches coming alive.",
        emotion: 'tender',
        variation_id: 'family_deeper_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'family_deeper_continue',
        text: "You're building his dreams too. In a way.",
        nextNodeId: 'maya_family_legacy',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'family_deeper_mom',
        text: "What about your mom? Where does she fit in this?",
        nextNodeId: 'maya_mom_story',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['maya_arc', 'family', 'emotional_depth']
  },

  {
    nodeId: 'maya_family_legacy',
    speaker: 'Maya Chen',
    content: [
      {
        text: "I never thought of it that way.\n\nHis dreams. My hands. Pepper.\n\nGod. He'd hate that I'm getting emotional about this. He's so practical. \"Don't think about what could have been. Think about what's next.\"\n\nBut maybe what's next can honor what could have been?",
        emotion: 'moved',
        variation_id: 'legacy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'legacy_continue',
        text: "That's not contradiction. That's continuation.",
        nextNodeId: 'maya_hub_return',
        pattern: 'patience',
        skills: ['wisdom'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'family', 'emotional_depth']
  },

  {
    nodeId: 'maya_mom_story',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Mom. She's the one who wanted me to be a doctor. Not for prestige. For survival.\n\nShe was a nurse in China. Here? She had to start over. Certifications don't transfer. She works at a medical supply company now. Warehouse inventory.\n\nShe sees medicine as security. The one thing that doesn't depend on who you know or where you're from. A patient is a patient.\n\nWhen she says \"be a doctor,\" she's really saying \"be safe. Be necessary.\"\n\nI can't hate her for that. But I can't be a prisoner to her fear either.",
        emotion: 'conflicted',
        variation_id: 'mom_story_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mom_story_continue',
        text: "Her fear and your dreams don't have to be opposites.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'family', 'emotional_depth']
  },

  {
    nodeId: 'maya_parents_together',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know what's funny? My parents never agree on anything. Dad thinks I worry too much. Mom thinks I don't worry enough.\n\nBut they both wake up at 5am every day. Both work jobs they're overqualified for. Both never complain.\n\nThey disagree about my future because they both want me to have one better than theirs.\n\nSometimes I wish they'd just fight about whose turn it is to do dishes like normal parents.",
        emotion: 'wistful_affection',
        variation_id: 'parents_together_v1'
      }
    ],
    choices: [
      {
        choiceId: 'parents_together_continue',
        text: "They love you. It just comes out as pressure.",
        nextNodeId: 'maya_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['maya_arc', 'family']
  },

  // ============= IMPOSTER SYNDROME DEPTH =============
  {
    nodeId: 'maya_imposter_deep',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Can I tell you something I've never told anyone?\n\nWhen Pepper wins a competition... when people clap and take pictures... I feel like I'm going to throw up.\n\nNot from joy. From terror.\n\nBecause any second now, someone's going to realize I don't belong here. That I'm just a pre-med student playing with circuits. That real engineers can see right through me.\n\nThe awards make it worse. More expectations. More chances to be exposed.",
        emotion: 'raw_fear',
        variation_id: 'imposter_deep_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'imposter_validate',
        text: "That feeling? It has a name. Imposter syndrome. And it lies.",
        nextNodeId: 'maya_imposter_named',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'imposter_question',
        text: "What would it feel like to actually belong?",
        nextNodeId: 'maya_imposter_imagine',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['maya_arc', 'vulnerability', 'imposter_syndrome']
  },

  {
    nodeId: 'maya_imposter_named',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Imposter syndrome.\n\nI've read about it. In psychology textbooks. About how high-achieving people feel like frauds.\n\nBut knowing the name doesn't make it stop.\n\nAlthough... hearing someone else say it's a lie. That helps more than the textbooks.\n\nYou really think the fear is lying?",
        emotion: 'searching',
        variation_id: 'imposter_named_v1'
      }
    ],
    choices: [
      {
        choiceId: 'imposter_named_confirm',
        text: "Pepper works. The awards are real. You're not performing competence. You have it.",
        nextNodeId: 'maya_imposter_acceptance',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'vulnerability', 'imposter_syndrome']
  },

  {
    nodeId: 'maya_imposter_imagine',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Belonging. What would that even feel like?\n\nMaybe... not checking over my shoulder? Not waiting for someone to tap me and say \"excuse me, this seat is taken\"?\n\nMaybe it would feel like showing Pepper to someone and being proud instead of defensive. Like \"look what I made\" instead of \"please don't look too closely.\"\n\nI don't know if I've ever felt that. About anything.",
        emotion: 'vulnerable_wonder',
        variation_id: 'imposter_imagine_v1'
      }
    ],
    choices: [
      {
        choiceId: 'imposter_imagine_continue',
        text: "You're showing me Pepper right now. And you're not defending. You're sharing.",
        nextNodeId: 'maya_imposter_acceptance',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['maya_arc', 'vulnerability', 'imposter_syndrome']
  },

  {
    nodeId: 'maya_imposter_acceptance',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Huh.\n\nYou're right. I am sharing. Not defending.\n\nThat's... weird. In a good way.\n\nMaybe belonging isn't something you achieve once. Maybe it's something you practice. Like a muscle.\n\nThis conversation. Right now. This is practice.",
        emotion: 'dawning_realization',
        variation_id: 'imposter_acceptance_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_imposter_acknowledged']
      }
    ],
    choices: [
      {
        choiceId: 'acceptance_continue',
        text: "And you're getting stronger.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['leadership', 'encouragement']
      }
    ],
    tags: ['maya_arc', 'vulnerability', 'breakthrough']
  },

  // ============= ROBOTICS PASSION DEPTH =============
  {
    nodeId: 'maya_pepper_origin',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Want to know how Pepper started?\n\nI was eleven. My grandmother had a stroke. Couldn't use her left hand anymore. She was a seamstress. That hand was her life.\n\nI watched her in physical therapy. Squeezing balls. Moving pegs. So bored. So frustrated.\n\nI thought: what if the exercises were a game? What if the equipment responded to you?\n\nI built a terrible prototype with LEGOs and a light sensor. When she squeezed hard enough, it played music.\n\nShe cried. Not from the stroke. From joy.\n\nThat's where Pepper began.",
        emotion: 'tender_pride',
        variation_id: 'pepper_origin_v1'
      }
    ],
    requiredState: {
      trust: { min: 4 }
    },
    choices: [
      {
        choiceId: 'pepper_origin_grandmother',
        text: "Your grandmother. Did she recover?",
        nextNodeId: 'maya_grandmother',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'pepper_origin_evolution',
        text: "How did LEGO Pepper become this Pepper?",
        nextNodeId: 'maya_pepper_evolution',
        pattern: 'analytical',
        skills: ['curiosity']
      }
    ],
    tags: ['maya_arc', 'robotics', 'origin_story']
  },

  {
    nodeId: 'maya_grandmother',
    speaker: 'Maya Chen',
    content: [
      {
        text: "She passed. Three years ago. Never fully recovered, but those last years... she was so alive.\n\nShe'd show my LEGO thing to everyone who visited. \"My granddaughter made this. She's going to be an engineer.\"\n\nNot a doctor. An engineer. She got it. Before I did, even.\n\nSometimes I think Pepper isn't just for kids in therapy. It's for her. Still. Always.",
        emotion: 'grief_and_love',
        variation_id: 'grandmother_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['knows_about_grandmother']
      }
    ],
    choices: [
      {
        choiceId: 'grandmother_continue',
        text: "She saw you clearly. Before anyone else did.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['maya_arc', 'family', 'emotional_core']
  },

  {
    nodeId: 'maya_pepper_evolution',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Oh man. So many iterations.\n\nVersion 2 was cardboard and Arduino. Motion sensors that tracked arm movement.\n\nVersion 3 was 3D printed. Started learning CAD at 14. My school didn't have robotics club, so I convinced the shop teacher to let me stay after.\n\nVersion 4 was the breakthrough. Adaptive difficulty. Pepper adjusts exercises based on how the patient is doing. Too easy? Harder. Frustrated? Easier. Real-time.\n\nThis is version 7. Machine learning integration. Emotion recognition. Haptic feedback.\n\nEach version taught me something I didn't know I needed to learn.",
        emotion: 'technical_excitement',
        variation_id: 'pepper_evolution_v1'
      }
    ],
    choices: [
      {
        choiceId: 'evolution_ml',
        text: "Machine learning for physical therapy. That's cutting edge.",
        nextNodeId: 'maya_pepper_ml',
        pattern: 'analytical',
        skills: ['technicalLiteracy']
      },
      {
        choiceId: 'evolution_alone',
        text: "You taught yourself all of this?",
        nextNodeId: 'maya_self_taught',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['maya_arc', 'robotics', 'technical']
  },

  {
    nodeId: 'maya_pepper_ml',
    speaker: 'Maya Chen',
    content: [
      {
        text: "That's the part that scares people. \"AI in healthcare.\" Sounds dystopian.\n\nBut Pepper's ML isn't making medical decisions. It's just reading patterns. Is the patient slowing down? Getting frustrated? Compensating with other muscles?\n\nHuman therapists catch this stuff, but not in real-time. Not with the granularity a sensor can.\n\nThe AI is a support tool. The therapist is still the expert. Pepper just gives them better data.\n\nThat's the pitch I can never quite land with investors. They want to hear \"AI replaces expensive therapists.\" I'm saying \"AI makes therapists superhuman.\"\n\nOne of those is fundable. The other is true.",
        emotion: 'passionate_frustrated',
        variation_id: 'pepper_ml_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ml_continue',
        text: "The right investors will hear the difference. Keep looking.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['strategicThinking', 'encouragement'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'robotics', 'AI', 'entrepreneurship']
  },

  {
    nodeId: 'maya_self_taught',
    speaker: 'Maya Chen',
    content: [
      {
        text: "YouTube. Stack Overflow. GitHub. Library books. So many library books.\n\nMy high school didn't have programming classes. Definitely no robotics. I learned on borrowed laptops and public wifi.\n\nThe first time I compiled code that actually ran? I literally cried. In a Starbucks. People thought I was breaking up with someone.\n\nBeing self-taught means you have weird gaps. Things everyone \"should\" know that I had to discover by breaking stuff.\n\nBut it also means I understand failure differently. I've rebuilt from zero so many times. Nothing feels impossible anymore. Just hard.",
        emotion: 'hard_won_pride',
        variation_id: 'self_taught_v1'
      }
    ],
    choices: [
      {
        choiceId: 'self_taught_continue',
        text: "That resilience is worth more than any degree.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['encouragement'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'learning', 'resilience']
  },

  // ============= BIRMINGHAM CONNECTION =============
  {
    nodeId: 'maya_birmingham_roots',
    speaker: 'Maya Chen',
    content: [
      {
        text: "People always ask why I don't just move to San Francisco. Or Boston. The \"real\" tech hubs.\n\nBut Birmingham is where my grandmother's ashes are scattered. Where my parents built a life from nothing. Where people pronounce my name right without me spelling it.\n\nAnd you know what? The robotics scene here is actually growing. UAB has an incredible medical device program. There are makerspaces now. Startup incubators.\n\nI don't have to leave home to build my future. I can build my future at home.",
        emotion: 'rooted_pride',
        variation_id: 'birmingham_roots_v1'
      }
    ],
    requiredState: {
      trust: { min: 4 }
    },
    choices: [
      {
        choiceId: 'birmingham_roots_continue',
        text: "Home isn't where you escape from. It's where you build.",
        nextNodeId: 'maya_hub_return',
        pattern: 'building',
        skills: ['wisdom'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'birmingham', 'local']
  },

  {
    nodeId: 'maya_birmingham_community',
    speaker: 'Maya Chen',
    content: [
      {
        text: "See this? Birmingham Robotics Club. Twenty kids. Every Saturday at Innovation Depot.\n\nI started volunteering there last year. Teaching basics. LEGOs and sensors, like I started.\n\nThere's this one kid, Marcus Jr. Not related to our Marcus. He built a robot that helps his mom organize her medication. She has MS. Forgets doses.\n\nThat's what I mean. These kids aren't waiting for permission. They're solving their own problems. In their own communities.\n\nSilicon Valley doesn't have a monopoly on innovation. It just has better marketing.",
        emotion: 'community_fire',
        variation_id: 'birmingham_community_v1'
      }
    ],
    choices: [
      {
        choiceId: 'community_inspired',
        text: "You're not just building robots. You're building builders.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['mentorship'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'birmingham', 'community', 'mentorship']
  },

  // ============= FUTURE VISION =============
  {
    nodeId: 'maya_future_vision',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Five years from now. Here's what I see.\n\nPepper in every children's hospital in Alabama. Then the Southeast. Then everywhere kids need help moving again.\n\nA company. Not a startup trying to get acquired, but a real company. Sustainable. Mission-driven. Based here.\n\nEmployment for people who look like me. Who came from where I came from. Who never saw themselves in tech because tech never showed up in their neighborhoods.\n\nThat's the dream. Bigger than one robot. Bigger than one person.\n\nIs it naive? Maybe. But naive people built everything that matters.",
        emotion: 'visionary_fire',
        variation_id: 'future_vision_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'future_vision_believe',
        text: "It's not naive. It's necessary. The world needs more builders like you.",
        nextNodeId: 'maya_hub_return',
        pattern: 'building',
        skills: ['visionaryThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['maya_arc', 'vision', 'future']
  },

  // ============= MENTOR INFLUENCE =============
  {
    nodeId: 'maya_mentor_devon',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Devon. Have you met him? The systems thinker upstairs.\n\nHe doesn't know it, but he's kind of my model for how to handle family pressure.\n\nHis dad wanted him to be an athlete. Football scholarship material. Devon chose engineering anyway. Almost lost his relationship with his family over it.\n\nBut he didn't rage against them. He just... kept being excellent. Kept showing up. Eventually they saw what he saw.\n\nPatience as rebellion. I'm still learning that.",
        emotion: 'admiring_thoughtful',
        variation_id: 'mentor_devon_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['met_devon']
    },
    choices: [
      {
        choiceId: 'mentor_devon_continue',
        text: "Patience as rebellion. That's beautiful.",
        nextNodeId: 'maya_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['maya_arc', 'cross_character', 'devon']
  },

  {
    nodeId: 'maya_mentor_tess',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Tess! Have you talked to her yet? The education founder.\n\nShe's the one who convinced me the robotics club was worth starting. I thought \"who am I to teach?\"\n\nShe said: \"You're someone who knows what it's like to not have a teacher. That makes you exactly the right person.\"\n\nTess understands something most people don't. The best teachers aren't the ones who never struggled. They're the ones who remember what struggling felt like.",
        emotion: 'grateful',
        variation_id: 'mentor_tess_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['met_tess']
    },
    choices: [
      {
        choiceId: 'mentor_tess_continue',
        text: "Teaching from scars instead of credentials. That's real.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['wisdom']
      }
    ],
    tags: ['maya_arc', 'cross_character', 'tess']
  },

  // ============= TECHNICAL PHILOSOPHY =============
  {
    nodeId: 'maya_tech_philosophy',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know what I've realized? Medicine and engineering aren't opposites. They're the same thing at different scales.\n\nA cell is a machine. DNA is code. The heart is a pump. The brain is a processor. Well, sort of. Terrible metaphor actually. The brain is weirder.\n\nPoint is: my parents think I'm rejecting medicine for robots. But I'm not. I'm just working on different machines.\n\nBodies are machines we can't fully debug yet. Robots are machines I can actually fix.\n\nBoth matter. Both heal.",
        emotion: 'philosophical_clarity',
        variation_id: 'tech_philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tech_philosophy_continue',
        text: "Different machines. Same purpose. Helping people.",
        nextNodeId: 'maya_hub_return',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'philosophy', 'insight']
  },

  {
    nodeId: 'maya_failure_story',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Want to hear about my biggest failure?\n\nLast year. State robotics competition. Pepper froze mid-demo. Just... stopped. In front of judges, sponsors, everyone.\n\nI stood there for what felt like an hour. Forty-five seconds, probably. The longest silence of my life.\n\nFinally figured it out. Power management bug. Battery drainage I hadn't tested for. Rookie mistake.\n\nI almost quit after that. Seriously. Thought \"this is the universe telling me to go to medical school.\"\n\nBut then I realized: every engineer has that story. The public failure. The moment they almost walked away.\n\nThe ones who become great? They debug and keep going.",
        emotion: 'rueful_wisdom',
        variation_id: 'failure_story_v1'
      }
    ],
    choices: [
      {
        choiceId: 'failure_continue',
        text: "You debugged and kept going. That's the difference.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['problemSolving', 'encouragement'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'failure', 'resilience']
  },

  {
    nodeId: 'maya_competition_memory',
    speaker: 'Maya Chen',
    content: [
      {
        text: "See this? FIRST Robotics regional, 2023. Another team's robot crashed into ours during the final match.\n\nWe lost. Badly. I cried in the parking lot.\n\nBut here's the thing: that other team? They came and found me. Apologized. Offered to help fix the damage.\n\nWe ended up staying until 2am in their workshop, rebuilding Pepper together. Trading techniques. Sharing failures.\n\nCompetition isn't zero-sum. The best rivals make you better. Even when they beat you.",
        emotion: 'warm_competitive',
        variation_id: 'competition_memory_v1'
      }
    ],
    choices: [
      {
        choiceId: 'competition_continue',
        text: "Competitors who become collaborators. That's how innovation really works.",
        nextNodeId: 'maya_hub_return',
        pattern: 'building',
        skills: ['collaboration']
      }
    ],
    tags: ['maya_arc', 'competition', 'collaboration']
  },

  // ============= EMOTIONAL DEPTH =============
  {
    nodeId: 'maya_loneliness',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Can I tell you something weird?\n\nI'm never more alone than when I'm succeeding.\n\nAwards ceremonies. Competitions. Demos. I'm surrounded by people... and I can't talk to any of them. Not really.\n\nThey see \"impressive young roboticist.\" They don't see the person who eats lunch alone because she doesn't fit with the pre-meds OR the engineers.\n\nThis station. Talking to you. It's the least alone I've felt in months.",
        emotion: 'lonely_honest',
        variation_id: 'loneliness_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'loneliness_seen',
        text: "I see the person. Not the roboticist. Just... you.",
        nextNodeId: 'maya_loneliness_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['maya_arc', 'vulnerability', 'loneliness']
  },

  {
    nodeId: 'maya_loneliness_response',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Thank you.\n\nThat's... that's what I needed to hear. More than advice. More than solutions.\n\nJust being seen.\n\nMaybe that's what Pepper is really about. Not the sensors or the algorithms. Just... making kids in therapy feel seen. Making them feel like someone understands.\n\nWe build what we need. Don't we?",
        emotion: 'grateful_tears',
        variation_id: 'loneliness_response_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_loneliness_shared']
      }
    ],
    choices: [
      {
        choiceId: 'loneliness_continue',
        text: "We build what we need. And then we share it.",
        nextNodeId: 'maya_hub_return',
        pattern: 'building',
        skills: ['wisdom']
      }
    ],
    tags: ['maya_arc', 'vulnerability', 'breakthrough']
  },

  // ============= ADDITIONAL DEPTH NODES =============
  {
    nodeId: 'maya_midnight_coding',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know my favorite time to code? 2am. When everyone's asleep.\n\nNo notifications. No expectations. Just me and the problem.\n\nThere's something holy about those hours. The world goes quiet and my brain finally stops second-guessing itself.\n\nThat's when Pepper's best features were born. Not in daylight. In the dark. When nobody was watching.",
        emotion: 'peaceful_tired',
        variation_id: 'midnight_coding_v1'
      }
    ],
    choices: [
      {
        choiceId: 'midnight_continue',
        text: "The best work happens when you stop performing.",
        nextNodeId: 'maya_hub_return',
        pattern: 'patience',
        skills: ['creativity']
      }
    ],
    tags: ['maya_arc', 'process', 'insight']
  },

  {
    nodeId: 'maya_doubt_spiral',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Sometimes I wonder if I'm just... playing. You know?\n\nLike there are real engineers out there. Proper training. Proper education. And here I am, a pre-med dropout with YouTube tutorials and salvaged parts.\n\nWhat if Pepper is just a toy? What if I'm wasting years on something that real professionals would build in a weekend?\n\nSorry. The doubt spirals come sometimes. Usually at 4am.",
        emotion: 'vulnerable_doubt',
        variation_id: 'doubt_spiral_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'doubt_counter',
        text: "Real professionals don't build with this much heart. That's your advantage.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      }
    ],
    tags: ['maya_arc', 'vulnerability', 'doubt']
  },

  {
    nodeId: 'maya_first_user',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Want to hear about the first kid who used Pepper? Real patient, not testing.\n\nEight years old. Car accident. Learning to use her arm again.\n\nPhysical therapy was going terribly. She'd just cry. Refused to do the exercises.\n\nHer therapist let me bring Pepper in. Just as an experiment.\n\nTwenty minutes. She did twenty minutes of exercises. Laughing. Competing with Pepper's challenges. Forgot she was in therapy.\n\nHer mom cried. The therapist cried. I definitely didn't cry. Okay, I cried.\n\nThat's why I can't quit. Not the awards. Not the pitch competitions. Her.",
        emotion: 'profound_joy',
        variation_id: 'first_user_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'first_user_continue',
        text: "You're not building a product. You're building moments like that.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['maya_arc', 'impact', 'purpose']
  },

  {
    nodeId: 'maya_name_meaning',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You know what Maya means? In Sanskrit, it's \"illusion.\" The magic that makes the world appear as it is.\n\nMy grandmother chose it. She said: \"You will show people what's possible. What they thought was impossible.\"\n\nI used to think it was about magic tricks. Silly stage stuff.\n\nNow I think she meant something else. The illusion isn't deception. It's vision.\n\nShowing people a future they couldn't imagine until you made it real.",
        emotion: 'contemplative',
        variation_id: 'name_meaning_v1'
      }
    ],
    choices: [
      {
        choiceId: 'name_continue',
        text: "Vision made real. That's exactly what you're doing.",
        nextNodeId: 'maya_hub_return',
        pattern: 'exploring',
        skills: ['wisdom']
      }
    ],
    tags: ['maya_arc', 'identity', 'meaning']
  },

  {
    nodeId: 'maya_what_if',
    speaker: 'Maya Chen',
    content: [
      {
        text: "What if my parents are right?\n\nWhat if I'm throwing away a guaranteed future for a dream that might never work?\n\nWhat if I'm thirty years old, still tinkering with robots in my parents' garage, watching my med school friends buy houses?\n\nBut also... what if I don't try?\n\nWhat if I become a doctor and spend my whole life wondering who I could have been?\n\nWhich regret is worse? I genuinely don't know.",
        emotion: 'existential_uncertainty',
        variation_id: 'what_if_v1'
      }
    ],
    requiredState: {
      trust: { min: 4 }
    },
    choices: [
      {
        choiceId: 'what_if_try',
        text: "The regret of not trying lasts forever. The regret of failing teaches you something.",
        nextNodeId: 'maya_hub_return',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'maya',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_if_both',
        text: "Maybe you don't have to choose between them. Maybe there's a third path.",
        nextNodeId: 'maya_crossroads',
      }
    ],
    tags: ['maya_arc', 'crossroads', 'philosophy']
  },

  // ============= ARC 4: CAREER CROSSROADS =============
  {
    nodeId: 'maya_work_doubt',
    speaker: 'Maya Chen',
    content: [
      {
        text: "My dad asked me yesterday: 'When does the hobby end and the career start?'\n\nHe meant: when do I put the toys away and start studying for the MCAT.\n\nBut it made me wonder. What if this IS the career? And I'm the only one who can't see it because I'm too busy apologizing for it?",
        emotion: 'vulnerable_doubt',
        variation_id: 'arc4_doubt_v1'
      }
    ],
    choices: [
      {
        choiceId: 'doubt_reframing',
        text: "Hobbies don't solve problems for real people. Correcting that grip strength? That's work.",
        nextNodeId: 'maya_hub_return',
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          addGlobalFlags: ['career_doubt_sown']
        }
      },
      {
        choiceId: 'doubt_question',
        text: "What would happen if you stopped apologizing?",
        nextNodeId: 'maya_career_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['arc_career_crossroads']
  },

  {
    nodeId: 'maya_career_crossroads',
    speaker: 'Maya Chen',
    content: [
      {
        text: "If I choose robotics, I lose their approval. If I choose medicine, I lose... this.\n\nI need to know which loss I can live with. Because I can't have both.\n\nOr... can I? Is there a third option I'm not seeing?",
        emotion: 'conflicted',
        variation_id: 'arc4_crossroads_v1'
      }
    ],
    choices: [
      {
        choiceId: 'crossroads_third_way',
        text: "Biomedical engineering. Build the tools doctors use. It honors both paths.",
        nextNodeId: 'maya_hub_return', // Leads to acceptance in later chapters
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          addGlobalFlags: ['maya_third_path_suggested']
        }
      },
      {
        choiceId: 'crossroads_choose_yourself',
        text: "The only approval you get to keep forever is your own.",
        nextNodeId: 'maya_hub_return',
        pattern: 'helping',
        skills: ['integrity'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      }
    ],
    tags: ['arc_career_crossroads', 'turning_point']
  },
  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════
  {
    nodeId: 'maya_mystery_hint_1',
    speaker: 'Maya Chen',
    requiredState: {
      trust: { min: 4 }
    },
    content: [
      {
        text: "My grandmother used to talk about 'thin places.' Where the veil between worlds is worn through.\n\nShe meant holy sites. Temples. But looking at the schematics for this station... the structural stress patterns are impossible. They shouldn't hold.\n\nUnless something else is holding them.",
        emotion: 'mysterious',
        variation_id: 'mystery_hint_1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mystery_ask_more',
        text: "What do you think is holding them?",
        nextNodeId: 'maya_mystery_response_1',
        pattern: 'analytical'
      },
      {
        choiceId: 'mystery_accept',
        text: "Some things aren't meant to be engineered.",
        nextNodeId: 'maya_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },
  {
    nodeId: 'maya_mystery_response_1',
    speaker: 'Maya Chen',
    content: [
      {
        text: "That's just it. The math says 'nothing.' But the readings say 'expectation.'\n\nLike the station stands because we *believe* it stands. Is that engineering? Or is it faith?",
        emotion: 'wondering',
        variation_id: 'mystery_response_1_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['maya_mystery_noticed']
      }
    ],
    choices: [
      {
        choiceId: 'mystery_close',
        text: "A question for another time.",
        nextNodeId: 'maya_hub_return',
        pattern: 'patience'
      }
    ]
  },
  {
    nodeId: 'maya_hub_return',
    speaker: 'Maya Chen',
    content: [{
      text: "I should get back to these schematics. The numbers don't add up, but they're beautiful regardless.\n\nTalk later.",
      emotion: 'thoughtful',
      variation_id: 'hub_return_v1'
    }],
    choices: []
  },

  // ═══════════════════════════════════════════════════════════════
  // LOYALTY EXPERIENCE: The Demo (trust ≥ 8, post-vulnerability)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'maya_loyalty_trigger',
    speaker: 'Maya Chen',
    content: [{
      text: "Hey. I need your help with something.\n\nThe senior design showcase is next week. Faculty, industry partners, parents—everyone will be there.\n\nI've been working on something. Not for class. For me. An adaptive learning interface for kids with ADHD. Uses motion tracking and gamification to keep attention without overstimulation.\n\nIt's... it's good. Really good. But if I present it, my parents will be there. They'll see that I've been 'wasting time' on this instead of focusing on pre-med coursework.\n\nBut I think this could actually help people. Real people. Kids who struggle like I did.\n\nWill you help me prepare? Be my practice audience?",
      emotion: 'vulnerable_determined',
      variation_id: 'loyalty_trigger_v1'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['maya_vulnerability_revealed']
    },
    choices: [
      {
        choiceId: 'accept_loyalty',
        text: "I'll help you prep. Show me what you've built.",
        nextNodeId: 'maya_loyalty_start',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'decline_loyalty',
        text: "This sounds important. Maybe ask Devon? He knows engineering presentations.",
        nextNodeId: 'maya_loyalty_declined',
        pattern: 'patience'
      }
    ],
    tags: ['loyalty_experience', 'the_demo']
  },

  {
    nodeId: 'maya_loyalty_declined',
    speaker: 'Maya Chen',
    content: [{
      text: "Yeah. You're probably right. Devon's presented at conferences. He'd know the technical stuff better.\n\nThanks anyway.",
      emotion: 'disappointed',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [{
      choiceId: 'return_to_hub',
      text: "(Let her go)",
      nextNodeId: 'maya_hub_return',
      pattern: 'patience'
    }],
    tags: ['loyalty_declined']
  },

  {
    nodeId: 'maya_loyalty_start',
    speaker: 'Maya Chen',
    content: [{
      text: "Okay. Here's the prototype.\n\n[She pulls up a tablet showing a colorful, fluid interface. Shapes morph and dance in response to movement, but there's structure underneath—curriculum goals, progress tracking, adaptive difficulty.]\n\nThe pitch is 7 minutes. Faculty will ask technical questions. Industry partners will ask about market viability. And my parents...\n\nMy parents will ask why I'm not in med school.\n\nLet me run through it. Stop me when something doesn't land.",
      emotion: 'focused_anxious',
      variation_id: 'loyalty_start_v1'
    }],
    onEnter: [
      { characterId: 'maya', addKnowledgeFlags: ['maya_loyalty_accepted'] }
    ],
    choices: [{
      choiceId: 'begin_practice',
      text: "Start from the top. I'm listening.",
      nextNodeId: 'maya_loyalty_practice',
      pattern: 'patience',
      skills: ['activeListening']
    }],
    tags: ['loyalty_experience', 'the_demo', 'practice_start']
  },

  {
    nodeId: 'maya_loyalty_practice',
    speaker: 'Maya Chen',
    content: [{
      text: "[Maya takes a breath. Begins.]\n\n\"Traditional educational software treats attention as a binary: focused or distracted. But ADHD brains don't work that way. Attention is kinetic. It flows.\n\nMy interface—MotionMind—tracks micro-movements. Fidgeting, head tilts, posture shifts. Instead of punishing distraction, it channels kinetic energy into curriculum engagement.\n\nA kid bounces their leg? The animation speed increases to match their rhythm. They look away? The interface pauses, waits, invites them back with motion cues.\n\nEarly testing with 12 students showed 340% increase in task completion and 89% reduction in frustration behaviors.\"\n\n[She stops. Looks at you.]\n\nToo technical? Not technical enough? Did I lose you at 'kinetic'?",
      emotion: 'anxious_hopeful',
      variation_id: 'practice_v1'
    }],
    choices: [
      {
        choiceId: 'affirm_technical',
        text: "The data is strong. But lead with the kid, not the stats.",
        nextNodeId: 'maya_loyalty_iteration',
        pattern: 'helping',
        skills: ['communication', 'empathy']
      },
      {
        choiceId: 'question_clarity',
        text: "What does 'frustration behavior' mean? Will parents understand that?",
        nextNodeId: 'maya_loyalty_iteration',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'miss_point',
        text: "It's great. Just be confident and you'll crush it.",
        nextNodeId: 'maya_loyalty_shallow',
        pattern: 'patience'
      }
    ],
    tags: ['loyalty_experience', 'the_demo', 'practice']
  },

  {
    nodeId: 'maya_loyalty_iteration',
    speaker: 'Maya Chen',
    content: [{
      text: "[She nods, thinking.]\n\n\"Right. Start human. Okay.\"\n\n[Takes another breath. Restarts.]\n\n\"I was diagnosed with ADHD at 8. School was torture. Sit still. Focus. Pay attention. But my brain doesn't sit still. It moves.\n\nSo I built something that moves with it.\"\n\n[She demonstrates. The interface responds to her hand waves, her shifting weight. It's mesmerizing.]\n\n\"This is MotionMind. For kids whose attention is kinetic, not broken.\"\n\n[Pause.]\n\nBetter?",
      emotion: 'hopeful_vulnerable',
      variation_id: 'iteration_v1'
    }],
    choices: [{
      choiceId: 'affirm_iteration',
      text: "Much better. Now they'll remember the kid before the data.",
      nextNodeId: 'maya_loyalty_parents_question',
      pattern: 'helping',
      skills: ['emotionalIntelligence']
    }],
    tags: ['loyalty_experience', 'the_demo', 'iteration']
  },

  {
    nodeId: 'maya_loyalty_shallow',
    speaker: 'Maya Chen',
    content: [{
      text: "[She smiles, but it doesn't reach her eyes.]\n\n\"Yeah. Confidence. That's all I need.\"\n\n[She closes the laptop.]\n\nThanks for listening. I should... I should practice more on my own.",
      emotion: 'disappointed_closed_off',
      variation_id: 'shallow_v1'
    }],
    choices: [{
      choiceId: 'shallow_return',
      text: "(Let her go)",
      nextNodeId: 'maya_hub_return',
      pattern: 'patience'
    }],
    onEnter: [{
      characterId: 'maya',
      addKnowledgeFlags: ['maya_loyalty_incomplete']
    }],
    tags: ['loyalty_experience', 'the_demo', 'incomplete']
  },

  {
    nodeId: 'maya_loyalty_parents_question',
    speaker: 'Maya Chen',
    content: [{
      text: "Okay. Now the hard part.\n\n[She sits down. Vulnerability cracks through.]\n\nWhat if they ask why I'm doing this instead of preparing for the MCAT? What if Dad says, 'This is a nice hobby, but when are you going to focus on your future?'\n\nHow do I tell them... this IS my future? That I'm not failing. I'm just not following their plan.\n\nWhat do I say?",
      emotion: 'vulnerable_desperate',
      variation_id: 'parents_question_v1'
    }],
    choices: [
      {
        choiceId: 'truth_gentle',
        text: "Tell them the truth gently: 'This is what I'm good at. This is where I belong.'",
        nextNodeId: 'maya_loyalty_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'courage']
      },
      {
        choiceId: 'compromise',
        text: "Maybe frame it as 'exploring options' so they don't panic.",
        nextNodeId: 'maya_loyalty_partial',
        pattern: 'patience'
      }
    ],
    tags: ['loyalty_experience', 'the_demo', 'parents_crisis']
  },

  {
    nodeId: 'maya_loyalty_success',
    speaker: 'Maya Chen',
    content: [{
      text: "[She closes her eyes. Nods.]\n\n\"This is what I'm good at. This is where I belong.\"\n\n[Opens them.]\n\n\"Simple. Direct. True.\"\n\n[A week later. You get a text.]\n\n\"Presented today. Faculty loved it. Industry partner wants a meeting. And my parents...\n\nMom cried. Said she didn't know I'd been struggling all those years. That she's sorry for not listening.\n\nDad still wants me to 'keep options open.' But he said he's proud. That's... that's enough for now.\n\nThank you. For helping me find the words. For believing this mattered.\n\nIt did. It does.\"",
      emotion: 'grateful_transformed',
      variation_id: 'success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'success_return',
      text: "You found your voice. That's everything.",
      nextNodeId: 'maya_hub_return',
      pattern: 'helping',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [
      {
        characterId: 'maya',
        trustChange: 3,
        addKnowledgeFlags: ['maya_loyalty_complete'],
        addGlobalFlags: ['maya_demo_triumph']
      }
    ],
    tags: ['loyalty_experience', 'the_demo', 'success']
  },

  {
    nodeId: 'maya_loyalty_partial',
    speaker: 'Maya Chen',
    content: [{
      text: "[She nods slowly.]\n\n\"Yeah. 'Exploring options.' Keep it vague. Safe.\"\n\n[Pause.]\n\n\"It's just... I'm tired of being safe. Of hedging.\"\n\n[A week later. You get a text.]\n\n\"Presented. It went okay. Parents seemed... confused but supportive? Hard to tell.\n\nIndustry partner said 'interesting concept, reach out if you pursue this seriously.'\n\nI don't know if I softened the truth too much or if I just wasn't ready.\n\nThanks for trying to help.\"",
      emotion: 'conflicted_uncertain',
      variation_id: 'partial_v1'
    }],
    choices: [{
      choiceId: 'partial_return',
      text: "(She'll find her way)",
      nextNodeId: 'maya_hub_return',
      pattern: 'patience'
    }],
    onEnter: [
      {
        characterId: 'maya',
        trustChange: 1,
        addKnowledgeFlags: ['maya_loyalty_partial']
      }
    ],
    tags: ['loyalty_experience', 'the_demo', 'partial']
  },

  // ============= TRUST RECOVERY SYSTEM =============
  // Accessible when trust has been damaged but player wants to repair
  {
    nodeId: 'maya_trust_recovery',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Look, I know things got weird between us. Maybe I was too closed off. Maybe you pushed too hard. I don't know.\n\nBut you came back. That means something.",
        emotion: 'guarded',
        variation_id: 'trust_recovery_v1',
        voiceVariations: {
          helping: "Look, I know things got weird between us. But you came back. Most people don't.\n\nThat means you actually care about getting this right. Don't you?",
          analytical: "Look, I know things got weird between us. I've been thinking about why.\n\nYou came back though. That's data I can work with.",
          building: "Look, I know things got weird. Building trust takes time, and we stumbled.\n\nBut you came back. That's the foundation for trying again.",
          exploring: "Look, I know things got weird. But you're still curious. Still here.\n\nThat matters more than getting everything perfect the first time.",
          patience: "Look, I know things got weird. But you didn't give up. You waited.\n\nMaybe we can start over. More carefully this time."
        }
      }
    ],
    requiredState: {
      trust: { max: 3 }
    },
    choices: [
      {
        choiceId: 'recovery_apologize',
        text: "I should have been more patient with you.",
        nextNodeId: 'maya_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['maya_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_understand',
        text: "I think I understand better now. Let's try again.",
        nextNodeId: 'maya_trust_restored',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['maya_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_honest',
        text: "We both made mistakes. That's human.",
        nextNodeId: 'maya_trust_restored',
        pattern: 'analytical',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['maya_trust_repair_attempted']
        }
      }
    ],
    tags: ['trust_recovery', 'maya_arc', 'repair']
  },

  {
    nodeId: 'maya_trust_restored',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Okay. Yeah. Let's try this again.\n\nI'm still working through a lot. But maybe... maybe that's okay. Maybe I don't have to have everything figured out before I let someone in.\n\nSo. Where were we?",
        emotion: 'hopeful',
        variation_id: 'trust_restored_v1',
        voiceVariations: {
          helping: "Okay. Yeah.\n\nI'm not used to people trying again after things get hard. Most people just... leave.\n\nThank you for staying. Where were we?",
          analytical: "Okay. Yeah. Second attempt. New data.\n\nI'm still figuring things out. But I'm willing to share more if you're willing to listen differently.\n\nWhere were we?",
          building: "Okay. Yeah. We're rebuilding.\n\nThis time with better foundations. I'll try to be more open. You try to be more patient.\n\nDeal? Good. Where were we?",
          exploring: "Okay. Yeah. Round two.\n\nI'm curious where this goes now that we've cleared the air.\n\nWhere were we?",
          patience: "Okay. Yeah.\n\nYou gave me space to process that. Most people don't wait.\n\nI think I'm ready to open up more. Where were we?"
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        trustChange: 1,
        addKnowledgeFlags: ['maya_trust_repaired']
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_recovery',
        text: "Tell me about what you're really passionate about.",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'exploring',
        skills: ['curiosity', 'communication']
      },
      {
        choiceId: 'continue_from_recovery_family',
        text: "Help me understand your family situation.",
        nextNodeId: 'maya_family_pressure',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['trust_recovery', 'maya_arc', 'fresh_start']
  },

  {
    nodeId: 'maya_rohan_crossover',
    speaker: 'Maya Chen',
    requiredState: {
      requiredCombos: ['innovation_catalyst']
    },
    content: [
      {
        text: "I've been thinking about what Rohan said—about how the best ideas come from weird intersections.\n\nI used to think innovation meant choosing between being technical OR creative. But that's not it at all.\n\nIt's about being both. And knowing when to switch between them. That's the real skill—not the tools or the code, but the rhythm of creative thinking combined with technical rigor.\n\nI feel like I'm actually starting to understand how to build things that matter now.",
        emotion: 'inspired',
        variation_id: 'innovation_catalyst_v1',
        voiceVariations: {
          analytical: "The data is interesting here. Rohan's insight about intersectional thinking—it's actually a known pattern in innovation research. The best breakthroughs happen at the collision of different disciplines.\n\nI'm starting to see how my technical skills and creative instincts aren't contradictions. They're a toolkit. And knowing which tool to use when—that's the real mastery.",
          building: "Rohan made me realize something: the things I want to build aren't just code projects. They're solutions at the intersection of what's possible and what matters.\n\nTechnical skill gives you the power. Creative thinking gives you the direction. Together? That's how you actually build things that change things.",
          helping: "What struck me about Rohan's perspective is how it centers on impact. Not just being clever, but being clever in service of something that helps people.\n\nI've spent so much energy proving I'm capable. But capability means nothing if you don't use it to actually help. The innovation catalyst isn't about being the smartest. It's about being purposefully creative.",
          exploring: "Rohan's way of thinking opened up something new. The intersection of creativity and technical depth—I want to explore that space more.\n\nIt's not about choosing between art and science. It's about discovering what happens at the boundary where they meet. That's where the real innovation lives.",
          patience: "Rohan helped me understand that the best ideas need time. Not just to code, but to think.\n\nCreative breakthroughs mixed with technical rigor—that can't be rushed. You need the patience to let ideas develop, test them methodically, refine them.\n\nI'm learning to sit with uncertainty while I build."
        }
      }
    ],
    choices: [
      {
        choiceId: 'innovation_continue_passion',
        text: "I want to tell you more about what I want to build.",
        nextNodeId: 'maya_robotics_passion',
        pattern: 'exploring',
        skills: ['creativity', 'technicalLiteracy', 'visionaryThinking']
      },
      {
        choiceId: 'innovation_face_pressure',
        text: "How do I balance this with what my parents expect?",
        nextNodeId: 'maya_family_pressure',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['skill_combo_unlock', 'innovation_catalyst', 'maya_wisdom']
  }
]

// ============= PUBLIC API =============
export const mayaEntryPoints = {
  INTRODUCTION: 'maya_introduction',
  ANXIETY_REVEAL: 'maya_anxiety_reveal',
  ROBOTICS_PASSION: 'maya_robotics_passion',
  FAMILY_PRESSURE: 'maya_family_pressure',
  CROSSROADS: 'maya_crossroads',
  /** Tech Demo Simulation - Pitching to investors with parents watching */
  SIMULATION: 'maya_simulation_intro'
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