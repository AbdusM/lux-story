/**
 * Quinn Almeida's Dialogue Graph
 * The Disillusioned Financier - Finance/Investment Specialist
 *
 * LinkedIn 2026 Roles: #12 Venture Partners, #20 Quant Researchers, #21 Financial Advisors
 * Animal: Red Fox (amber/copper palette)
 * Tier: 2 (Primary) - 50 nodes target, 10 voice variations
 *
 * Core Conflict: Made millions but lost himself. Questions whether financial success equals life success.
 * Backstory: Former Birmingham kid who made it to Wall Street. Returned after burnout.
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const quinnDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'quinn_introduction',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "The numbers don't lie. But they don't tell the whole truth either.\n\nYou're not here for a loan, are you? Good. I stopped giving those out the day I realized I was better at building wealth than I was at being wealthy.",
        emotion: 'wry',
        variation_id: 'quinn_intro_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "The numbers don't lie. But they don't tell the whole truth either.\n\nYou process things systematically. I can see it. That's both a gift and a trap in finance.", altEmotion: 'knowing' },
          { pattern: 'building', minLevel: 5, altText: "The numbers don't lie. But they don't tell the whole truth either.\n\nYou're a maker. I can tell by how you looked at that old ticker machine—wondering how it works, not what it's worth.", altEmotion: 'warm' },
          { pattern: 'helping', minLevel: 5, altText: "The numbers don't lie. But they don't tell the whole truth either.\n\nYou're here to help someone, aren't you? Not yourself. That's... not common on this floor.", altEmotion: 'curious' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'quinn_intro_numbers',
        text: "What truth do the numbers miss?",
        nextNodeId: 'quinn_numbers_truth',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy'],
        voiceVariations: {
          analytical: "Walk me through what the numbers miss.",
          building: "What can't you build with numbers alone?",
          exploring: "What truth is hiding behind the data?",
          helping: "What do the numbers miss about people?",
          patience: "The whole truth. What's the part that takes time to see?"
        }
      },
      {
        choiceId: 'quinn_intro_wealth',
        text: "Better at building wealth than being wealthy. That's a heavy sentence.",
        nextNodeId: 'quinn_wealth_paradox',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        voiceVariations: {
          helping: "That sounds like a wound. Building wealth but not being wealthy.",
          analytical: "There's a gap between accumulation and meaning. You found it.",
          building: "You built something that didn't build you back.",
          exploring: "What does 'being wealthy' even mean to you now?",
          patience: "That's a hard truth to carry."
        },
        consequence: {
          characterId: 'quinn',
          trustChange: 1,
          addKnowledgeFlags: ['noticed_quinn_paradox']
        }
      },
      {
        choiceId: 'quinn_intro_birmingham',
        text: "You came back to Birmingham. Why?",
        nextNodeId: 'quinn_birmingham_return',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking'],
        voiceVariations: {
          exploring: "Birmingham. After Wall Street. That's a story.",
          analytical: "The ROI of coming back here—what's the calculation?",
          building: "You left, built something, then came back to build something else?",
          helping: "Coming home means something. What did Birmingham have that New York didn't?",
          patience: "Sometimes the road circles back. Why here?"
        }
      },
      {
        choiceId: 'quinn_intro_silence',
        text: "[Let the weight of that statement settle.]",
        nextNodeId: 'quinn_silence_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        voiceVariations: {
          patience: "[Let the weight settle. He's carrying something.]",
          analytical: "[Wait. Observe how he responds to space.]",
          helping: "[He needs a moment. Be present.]",
          exploring: "[Interesting. See what comes next when you don't push.]",
          building: "[Sometimes silence builds more than words.]"
        },
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      // Pattern unlock choice
      {
        choiceId: 'quinn_intro_analyst_unlock',
        text: "[Analyst's Eye] Your desk layout—you're tracking multiple market sectors simultaneously. That's not retail investing.",
        nextNodeId: 'quinn_professional_recognition',
        pattern: 'analytical',
        skills: ['systemsThinking', 'financialLiteracy'],
        archetype: 'MAKE_OBSERVATION',
        visibleCondition: {
          patterns: { analytical: { min: 40 } }
        },
        consequence: {
          characterId: 'quinn',
          trustChange: 2,
          addKnowledgeFlags: ['recognized_quinn_expertise']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'quinn',
        addKnowledgeFlags: ['met_quinn']
      }
    ],
    tags: ['introduction', 'quinn_arc', 'finance']
  },

  // ============= NUMBERS TRUTH PATH =============
  {
    nodeId: 'quinn_numbers_truth',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v1',
        text: "What they miss?\n\nI once built an algorithm that predicted market movements with 73% accuracy. Made $14 million in eight months. The numbers were beautiful.\n\nThey didn't mention the 400 jobs my efficiency recommendations eliminated. The numbers called that 'optimization.'",
        emotion: 'bitter_reflective',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "What they miss?\n\nI once built an algorithm that predicted market movements with 73% accuracy. Made $14 million in eight months. The numbers were beautiful.\n\nBut an algorithm optimizes for what you tell it to optimize for. I told it to maximize returns. It did. The human cost wasn't in the model.", altEmotion: 'regretful' },
          { pattern: 'helping', minLevel: 4, altText: "What they miss?\n\nI once built an algorithm that predicted market movements with 73% accuracy. Made $14 million in eight months.\n\n400 people lost their jobs because of my 'efficiency recommendations.' Numbers don't capture a family losing health insurance. Numbers don't capture a kid who can't afford college anymore because dad got 'optimized.'", altEmotion: 'guilt' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'quinn_algorithm_guilt',
        text: "That's not on you. Companies make those decisions.",
        nextNodeId: 'quinn_responsibility',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'quinn_algorithm_system',
        text: "The system is designed to optimize for profit. You were just a tool.",
        nextNodeId: 'quinn_tool_reflection',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      },
      {
        choiceId: 'quinn_algorithm_change',
        text: "What would you do differently now?",
        nextNodeId: 'quinn_different_now',
        pattern: 'building',
        skills: ['adaptability', 'criticalThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'vulnerability_setup', 'finance']
  },

  // ============= WEALTH PARADOX PATH =============
  {
    nodeId: 'quinn_wealth_paradox',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "Heavy.\n\n*Quinn looks at his hands for a moment.*\n\nI had a penthouse overlooking Central Park. A car service. A tailor who knew my measurements by heart. I was building wealth.\n\nBut I was also drinking alone at 2 AM, wondering why I felt like I was missing something everyone else seemed to have.",
        variation_id: 'quinn_v2',
        emotion: 'vulnerable',
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "Heavy.\n\n*Quinn's guard drops slightly.*\n\nI had everything the brochure promised. But I couldn't call anyone at 2 AM who wasn't paid to take my call. I was building wealth, but I wasn't building... anything that would last.", altEmotion: 'vulnerable' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'quinn_paradox_meaning',
        text: "Money can't buy meaning. But it can buy time to find it.",
        nextNodeId: 'quinn_time_meaning',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'criticalThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_paradox_connection',
        text: "You were lonely.",
        nextNodeId: 'quinn_loneliness',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 2
        }
      },
      {
        choiceId: 'quinn_paradox_question',
        text: "What was everyone else supposed to have that you were missing?",
        nextNodeId: 'quinn_what_missing',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence']
      }
    ],
    tags: ['quinn_arc', 'vulnerability', 'finance']
  },

  // ============= BIRMINGHAM RETURN PATH =============
  {
    nodeId: 'quinn_birmingham_return',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v2',
        text: "Birmingham.\n\n*Quinn's eyes drift to a faded photo on his desk.*\n\nMy grandmother never left. Born in Titusville, died in Titusville. Never made more than $40,000 a year. Happiest person I ever knew.\n\nI made more in a week than she made in a decade. But she had something I couldn't buy. I came back to figure out what that was.",
        emotion: 'nostalgic_searching',
        patternReflection: [
          { pattern: 'exploring', minLevel: 4, altText: "Birmingham.\n\nMy grandmother never left this city. Never chased the bigger markets, never 'optimized' her life. She just... lived it. Fully.\n\nI made more in a week than she made in a decade. But she knew something I didn't. I came back to learn what she knew.", altEmotion: 'curious_humble' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'quinn_grandma_wisdom',
        text: "What did she know?",
        nextNodeId: 'quinn_grandma_lesson',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_titusville',
        text: "Titusville. That's a neighborhood with history.",
        nextNodeId: 'quinn_titusville_history',
        pattern: 'building',
        skills: ['communication'],
        voiceVariations: {
          building: "Titusville. That neighborhood built something that lasted.",
          exploring: "Titusville. What's the story there?",
          helping: "Titusville has roots. Community roots.",
          analytical: "Titusville—historically significant in the civil rights movement.",
          patience: "Titusville. Some places hold onto what matters."
        }
      },
      {
        choiceId: 'quinn_happiness_equation',
        text: "Happiness doesn't scale with income. The research is clear on that.",
        nextNodeId: 'quinn_happiness_research',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      }
    ],
    tags: ['quinn_arc', 'birmingham', 'finance']
  },

  // ============= SILENCE RESPONSE =============
  {
    nodeId: 'quinn_silence_response',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v3',
        text: "*Quinn studies you for a long moment.*\n\nMost people rush to fill silence with advice. You didn't.\n\nThat's rare. Especially in finance, where everyone's got a hot take and no one listens.",
        emotion: 'appreciative',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "*Quinn's posture relaxes slightly.*\n\nYou know how to hold space. That's not a skill they teach in business school.\n\nWhen I was on Wall Street, every second of silence felt like lost opportunity. Now I know—some of the best decisions come from the spaces between words.", altEmotion: 'warm_reflective' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'quinn_silence_listen',
        text: "Sometimes listening is worth more than talking.",
        nextNodeId: 'quinn_listening_value',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'quinn_silence_wall_street',
        text: "Wall Street doesn't reward patience?",
        nextNodeId: 'quinn_wall_street_pace',
        pattern: 'exploring',
        skills: ['criticalThinking', 'financialLiteracy']
      },
      {
        choiceId: 'quinn_silence_continue',
        text: "Tell me more about what brought you here.",
        nextNodeId: 'quinn_deeper_story',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'trust_building', 'finance']
  },

  // ============= PROFESSIONAL RECOGNITION PATH =============
  {
    nodeId: 'quinn_professional_recognition',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v4',
        text: "*Quinn's eyebrows rise.*\n\nYou've got an eye for it. Most people see screens and assume I'm day trading meme stocks.\n\nI track patterns across sectors. Energy, biotech, emerging markets. Not to trade—to understand where the economy is actually going, not where the talking heads say it's going.",
        emotion: 'impressed_engaged'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_pro_teach',
        text: "Could you teach someone to read patterns like that?",
        nextNodeId: 'quinn_teaching_offer',
        pattern: 'building',
        skills: ['financialLiteracy', 'communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_pro_predict',
        text: "Where do you think the economy is going?",
        nextNodeId: 'quinn_economy_prediction',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      },
      {
        choiceId: 'quinn_pro_why',
        text: "Why understand it if you're not trading on it?",
        nextNodeId: 'quinn_why_understand',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ],
    tags: ['quinn_arc', 'finance', 'pattern_unlock']
  },

  // ============= SIMULATION 1: THE PITCH =============
  {
    nodeId: 'quinn_simulation_pitch_intro',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "You want to understand venture capital? Let me show you something.\n\n*Quinn pulls up a folder.*\n\nThree founders came to me last week. Each wanted $500K. I can only fund one. Want to see how this works?",
        variation_id: 'quinn_v6',
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_pitch_yes',
        text: "Show me.",
        nextNodeId: 'quinn_pitch_setup',
        pattern: 'exploring',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'quinn_pitch_criteria',
        text: "What criteria do you use?",
        nextNodeId: 'quinn_pitch_criteria',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      },
      {
        choiceId: 'quinn_pitch_later',
        text: "Maybe another time. I want to understand you first.",
        nextNodeId: 'quinn_personal_first',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'simulation_entry', 'finance']
  },

  {
    nodeId: 'quinn_pitch_setup',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v5',
        text: "Three pitches. All different.\n\n**Founder A:** AI-powered financial planning for first-generation college students. Solid tech, unclear revenue model, massive social impact potential.\n\n**Founder B:** Luxury vacation rental arbitrage platform. Clear revenue, proven model, marginal social value.\n\n**Founder C:** Mental health app for finance professionals. Decent tech, uncertain market, personal passion project from a burned-out trader.\n\nYou've got $500K. One choice. What matters to you?",
        emotion: 'teaching_intense'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_pitch_founder_a',
        text: "Founder A. Impact over pure returns.",
        nextNodeId: 'quinn_pitch_choice_a',
        pattern: 'helping',
        skills: ['financialLiteracy', 'criticalThinking'],
        voiceVariations: {
          helping: "Founder A. If it works, it changes lives.",
          analytical: "Founder A. The addressable market for first-gen students is massive and underserved.",
          building: "Founder A. That's building something that matters.",
          exploring: "Founder A. I want to see what that could become.",
          patience: "Founder A. Some investments take time to pay off—in more than money."
        }
      },
      {
        choiceId: 'quinn_pitch_founder_b',
        text: "Founder B. Proven model, predictable returns.",
        nextNodeId: 'quinn_pitch_choice_b',
        pattern: 'analytical',
        skills: ['financialLiteracy', 'riskManagement'],
        voiceVariations: {
          analytical: "Founder B. The numbers work. That's what matters.",
          building: "Founder B. Build on proven foundations.",
          exploring: "Founder B. Safe, but it funds the next risky bet.",
          helping: "Founder B. Returns let you fund more impactful things later.",
          patience: "Founder B. Steady wins matter."
        }
      },
      {
        choiceId: 'quinn_pitch_founder_c',
        text: "Founder C. Someone who understands the problem deeply.",
        nextNodeId: 'quinn_pitch_choice_c',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'financialLiteracy'],
        voiceVariations: {
          building: "Founder C. Passion from lived experience. That's hard to fake.",
          helping: "Founder C. They're building from their own wound. That matters.",
          analytical: "Founder C. Domain expertise from direct experience reduces product-market fit risk.",
          exploring: "Founder C. There's something real there.",
          patience: "Founder C. Some things need to be built by people who understand the pain."
        }
      },
      {
        choiceId: 'quinn_pitch_more_info',
        text: "I need more information before I decide.",
        nextNodeId: 'quinn_pitch_dig_deeper',
        pattern: 'patience',
        skills: ['criticalThinking', 'riskManagement']
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance', 'the_pitch']
  },

  {
    nodeId: 'quinn_pitch_choice_a',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v6',
        text: "*Quinn nods slowly.*\n\nThat's what I would have said. Once.\n\nHere's what happened: I funded her. The tech worked. The impact was real. 50,000 students got better financial guidance in year one.\n\nAnd she burned out in 18 months because she couldn't find a sustainable revenue model. The company folded. Those 50,000 students went back to having no guidance.\n\nImpact without sustainability is just a beautiful flash.",
        emotion: 'teaching_bittersweet'
      }
    ],
    onEnter: [
      {
        characterId: 'quinn',
        addKnowledgeFlags: ['quinn_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'quinn_pitch_a_lesson',
        text: "So the lesson is... sustainability matters more than impact?",
        nextNodeId: 'quinn_sustainability_lesson',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_pitch_a_both',
        text: "Can't you have both?",
        nextNodeId: 'quinn_both_challenge',
        pattern: 'building',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance', 'the_pitch']
  },

  {
    nodeId: 'quinn_pitch_choice_b',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v7',
        text: "*Quinn tilts his head.*\n\nSafe choice. Smart, even.\n\nHere's what happened: The platform worked. Made consistent returns. My investors were happy.\n\nAnd I lay awake at night knowing I'd just helped wealthy people get wealthier vacation homes while teachers in Birmingham couldn't afford their mortgages.\n\nThe numbers don't lie. But they don't tell you how you'll feel about yourself.",
        emotion: 'honest_conflicted'
      }
    ],
    onEnter: [
      {
        characterId: 'quinn',
        addKnowledgeFlags: ['quinn_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'quinn_pitch_b_feeling',
        text: "Numbers aren't supposed to make you feel things.",
        nextNodeId: 'quinn_numbers_feelings',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_pitch_b_values',
        text: "So it's about values, not just returns.",
        nextNodeId: 'quinn_values_returns',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance', 'the_pitch']
  },

  {
    nodeId: 'quinn_pitch_choice_c',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v8',
        text: "*Something shifts in Quinn's expression.*\n\nYou saw what I saw.\n\nThat founder was me. Ten years younger, before I burned out the first time. If someone had funded that app back then—if I'd had permission to build from my own pain instead of optimizing for someone else's metrics...\n\nI funded her. It's still running. She's still standing. Sometimes that's the real return.",
        emotion: 'moved'
      }
    ],
    onEnter: [
      {
        characterId: 'quinn',
        addKnowledgeFlags: ['quinn_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'quinn_pitch_c_personal',
        text: "You invest in people, not just ideas.",
        nextNodeId: 'quinn_invest_people',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 2
        }
      },
      {
        choiceId: 'quinn_pitch_c_sustainable',
        text: "Is that sustainable as a strategy?",
        nextNodeId: 'quinn_personal_sustainable',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance', 'the_pitch']
  },

  // ============= VULNERABILITY ARC =============
  {
    nodeId: 'quinn_vulnerability_arc',
    speaker: 'Quinn Almeida',
    requiredState: { trust: { min: 6 } },
    content: [
      {
        text: "*Quinn is quieter today. He's holding an old newspaper clipping.*\n\nCan I tell you something I don't tell people?\n\nThe algorithm I built—the one that 'optimized' 400 jobs away? One of those jobs was my cousin's. Marcus. He was a data entry clerk at the company I was consulting for.\n\nI didn't know until after. I did the math that ended his career. He's never forgiven me.",
        emotion: 'shame',
        richEffectContext: 'warning',
        variation_id: 'quinn_v11',
        patternReflection: [
          { pattern: 'helping', minLevel: 6, altText: "*Quinn's hands are shaking slightly as he holds the clipping.*\n\nOne of those 400 people was Marcus. My cousin. The one who used to help me with homework when I was a kid.\n\nI destroyed his career with an algorithm. He trusted me, and I turned him into a number.", altEmotion: 'grief' },
          { pattern: 'analytical', minLevel: 6, altText: "*Quinn's voice is flat, controlled.*\n\nI ran the numbers 47 times. Looking for a way the model was wrong. It wasn't wrong. It was exactly right.\n\nMarcus was inefficient by every metric that mattered. The model said cut him. I said cut him.\n\nI was the one who was wrong.", altEmotion: 'shame' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'quinn_vuln_forgiveness',
        text: "You can't forgive yourself, can you?",
        nextNodeId: 'quinn_self_forgiveness',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          helping: "You can't forgive yourself. Even if Marcus could.",
          analytical: "You're still running that calculation. Looking for a different answer.",
          building: "You've been trying to rebuild something ever since.",
          exploring: "What would forgiveness even look like here?",
          patience: "Some things take a long time to carry."
        },
        consequence: {
          characterId: 'quinn',
          trustChange: 2
        }
      },
      {
        choiceId: 'quinn_vuln_marcus',
        text: "Have you tried to make it right with Marcus?",
        nextNodeId: 'quinn_marcus_relationship',
        pattern: 'building',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'quinn_vuln_system',
        text: "The system put you in that position. You were doing your job.",
        nextNodeId: 'quinn_system_excuse',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    onEnter: [
      {
        characterId: 'quinn',
        addKnowledgeFlags: ['quinn_vulnerability_revealed']
      }
    ],
    tags: ['quinn_arc', 'vulnerability_arc', 'finance', 'trust_6']
  },

  {
    nodeId: 'quinn_self_forgiveness',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v9',
        text: "*Quinn exhales slowly.*\n\nNo. I can't.\n\nBut I've stopped trying to. Forgiveness isn't the point anymore. What I do with the weight—that's the point.\n\nEvery kid I help understand compound interest, every first-generation student who learns to read a term sheet... that's not forgiveness. That's interest on a debt I can never pay off.",
        emotion: 'resolved_humble'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_forgive_debt',
        text: "That's a heavy way to live.",
        nextNodeId: 'quinn_heavy_living',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'quinn_forgive_meaning',
        text: "But it's meaningful.",
        nextNodeId: 'quinn_meaningful_weight',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'vulnerability_arc', 'finance']
  },

  // ============= RETURN TO SAMUEL =============
  {
    nodeId: 'quinn_return_hub',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v10',
        text: "You should talk to Samuel again when you're ready. He has a way of knowing who you need to meet next.\n\nAnd... come back. Not for financial advice. Just... come back.",
        emotion: 'warm'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_return_promise',
        text: "I will.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'quinn_return_curious',
        text: "There's more to learn here.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'return_hub']
  },

  // ============= ADDITIONAL CONVERSATION NODES =============
  {
    nodeId: 'quinn_responsibility',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v11',
        text: "*Quinn shakes his head.*\n\nThat's what I told myself for years. 'I just built the model. They made the decisions.'\n\nBut here's the thing: I was the one who chose what to optimize for. I defined 'efficiency.' I decided what counted as waste.\n\nThe algorithm did exactly what I told it to do. That's what scares me.",
        emotion: 'honest_troubled'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_resp_learn',
        text: "What did you learn from that?",
        nextNodeId: 'quinn_learned',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_resp_now',
        text: "How do you build differently now?",
        nextNodeId: 'quinn_build_different',
        pattern: 'building',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'finance', 'ethics']
  },

  {
    nodeId: 'quinn_tool_reflection',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v12',
        text: "A tool. Yeah.\n\n*Quinn's jaw tightens.*\n\nA hammer doesn't feel guilty when it drives a nail into the wrong place. But I'm not a hammer. I chose to be wielded.\n\nThe system is designed to optimize for profit. I was designed to have a conscience. One of those things was supposed to win.",
        emotion: 'bitter_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_tool_conscience',
        text: "Did your conscience win?",
        nextNodeId: 'quinn_conscience_answer',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'quinn_tool_change',
        text: "Can you change the system from inside?",
        nextNodeId: 'quinn_change_inside',
        pattern: 'building',
        skills: ['systemsThinking']
      }
    ],
    tags: ['quinn_arc', 'finance', 'ethics']
  },

  {
    nodeId: 'quinn_different_now',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v13',
        text: "Now?\n\nI ask different questions. Not 'how do we maximize returns?' but 'what happens to the people on the other side of this number?'\n\nEvery investment decision has a human on the other end. I make sure I can see them before I make the call.",
        emotion: 'thoughtful_resolved'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_diff_teach',
        text: "Could you teach that approach?",
        nextNodeId: 'quinn_teach_approach',
        pattern: 'building',
        skills: ['financialLiteracy', 'communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_diff_hard',
        text: "That must make investing harder.",
        nextNodeId: 'quinn_harder_investing',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['quinn_arc', 'finance', 'growth']
  },

  {
    nodeId: 'quinn_grandma_lesson',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v14',
        text: "*Quinn smiles—the first real smile you've seen.*\n\nShe knew that wealth is relational, not numerical.\n\nShe had a savings account, never more than a few thousand dollars. But she knew everyone on her block. People brought her casseroles when she was sick. She never ate dinner alone unless she wanted to.\n\nI had millions and ordered takeout to an empty apartment.",
        emotion: 'warm_wistful'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_grandma_apply',
        text: "How do you apply that now?",
        nextNodeId: 'quinn_applying_wisdom',
        pattern: 'building',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_grandma_birmingham',
        text: "Is that why you came back to Birmingham?",
        nextNodeId: 'quinn_back_birmingham',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'birmingham', 'wisdom']
  },

  {
    nodeId: 'quinn_loneliness',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v15',
        text: "*Quinn is quiet for a moment.*\n\nYeah. Lonely.\n\nIt's a specific kind of lonely—surrounded by people who want something from you, but no one who wants... you. Just you.\n\nWealth can be the loneliest fortress.",
        emotion: 'vulnerable_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_lonely_now',
        text: "Are you still lonely?",
        nextNodeId: 'quinn_lonely_now_answer',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 2
        }
      },
      {
        choiceId: 'quinn_lonely_change',
        text: "What changed?",
        nextNodeId: 'quinn_what_changed',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'vulnerability', 'connection']
  },

  // Continuation nodes for flow
  {
    nodeId: 'quinn_learned',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v16',
        text: "I learned that optimization without ethics is just efficient destruction.\n\nAnd I learned that the smartest people in finance aren't the ones who make the most money—they're the ones who know when not to make money.",
        emotion: 'teaching_serious'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_learned_more',
        text: "Tell me more about what you do now.",
        nextNodeId: 'quinn_current_work',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'quinn_learned_hub',
        text: "I should think about this. Can we talk again?",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['quinn_arc', 'finance']
  },

  {
    nodeId: 'quinn_current_work',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v17',
        text: "I run a financial literacy nonprofit from this floor. Free workshops for Birmingham youth.\n\nI also do selective angel investing—but only in founders who can answer one question: 'What happens to the people your success displaces?'\n\nIf they haven't thought about it, I'm not the right investor for them.",
        emotion: 'proud_humble'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_work_workshops',
        text: "Tell me about the workshops.",
        nextNodeId: 'quinn_workshops',
        pattern: 'helping',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'quinn_work_investing',
        text: "What kind of founders do you invest in?",
        nextNodeId: 'quinn_founder_types',
        pattern: 'analytical',
        skills: ['financialLiteracy', 'criticalThinking']
      }
    ],
    tags: ['quinn_arc', 'finance', 'birmingham']
  },

  {
    nodeId: 'quinn_workshops',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v18',
        text: "Basic stuff that should be taught in schools but isn't. Compound interest. How credit scores actually work. What a term sheet says between the lines.\n\nLast week, a 16-year-old asked me how to start investing with $50. That kid reminded me why I came back.",
        emotion: 'warm_engaged'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_workshop_continue',
        text: "That sounds meaningful.",
        nextNodeId: 'quinn_meaningful_work',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_workshop_sim',
        text: "Could you show me how you teach?",
        nextNodeId: 'quinn_simulation_pitch_intro',
        pattern: 'exploring',
        skills: ['financialLiteracy']
      }
    ],
    tags: ['quinn_arc', 'finance', 'birmingham']
  },

  {
    nodeId: 'quinn_meaningful_work',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v19',
        text: "More meaningful than anything I did on Wall Street.\n\nI made millions moving money around. Here, I help kids understand that money is a tool, not a goal. That's worth more than any trade I ever made.",
        emotion: 'content_resolved'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_meaningful_hub',
        text: "Thank you for sharing this with me.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'quinn_meaningful_more',
        text: "I want to understand more about your approach.",
        nextNodeId: 'quinn_simulation_pitch_intro',
        pattern: 'exploring',
        skills: ['financialLiteracy']
      }
    ],
    tags: ['quinn_arc', 'finance', 'closure']
  },

  // Additional nodes for simulation paths
  {
    nodeId: 'quinn_sustainability_lesson',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "Not more than. Alongside.\n\nImpact without sustainability is charity. Sustainability without impact is just... business. The hard part is building both into the same system.",
        variation_id: 'quinn_v23',
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_sus_example',
        text: "Can you give me an example of both working together?",
        nextNodeId: 'quinn_both_example',
        pattern: 'building',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'quinn_sus_return',
        text: "That's a lot to think about.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance']
  },

  {
    nodeId: 'quinn_both_challenge',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v20',
        text: "*Quinn leans forward.*\n\nThat's the right question. And yes—you can. But it requires building impact INTO the revenue model, not hoping it happens as a side effect.\n\nThe best social enterprises make money BECAUSE they solve real problems for real people. Not despite it.",
        emotion: 'engaged_teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_both_learn',
        text: "I want to learn more about that.",
        nextNodeId: 'quinn_social_enterprise',
        pattern: 'building',
        skills: ['financialLiteracy', 'systemsThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_both_think',
        text: "Let me think on that.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance']
  },

  {
    nodeId: 'quinn_social_enterprise',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v21',
        text: "Social enterprise. It's not charity with a business model—it's business with a conscience baked in.\n\nThink about it: If your company makes more money when it helps more people, you've aligned profit with purpose. That's sustainable impact.",
        emotion: 'passionate_teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_social_continue',
        text: "How do you evaluate those kinds of investments?",
        nextNodeId: 'quinn_evaluation_method',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      },
      {
        choiceId: 'quinn_social_hub',
        text: "This is exactly what I needed to hear.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'finance', 'social_enterprise']
  },

  {
    nodeId: 'quinn_evaluation_method',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v22',
        text: "I use what I call the 'three returns' framework:\n\n1. **Financial return** - Will this make money?\n2. **Human return** - Who benefits besides shareholders?\n3. **Systemic return** - Does this make the system better or worse?\n\nIf I can't answer all three positively, I don't invest.",
        emotion: 'teaching_confident'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_eval_apply',
        text: "That's a framework I could use.",
        nextNodeId: 'quinn_framework_gift',
        pattern: 'building',
        skills: ['financialLiteracy', 'systemsThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1,
          addKnowledgeFlags: ['learned_three_returns']
        }
      },
      {
        choiceId: 'quinn_eval_hard',
        text: "That must eliminate a lot of deals.",
        nextNodeId: 'quinn_fewer_deals',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['quinn_arc', 'finance', 'framework']
  },

  {
    nodeId: 'quinn_framework_gift',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v23',
        text: "*Quinn pulls out a worn index card and writes on it.*\n\nHere. Three returns. Financial, human, systemic. Use it for any decision, not just investments.\n\nIt's served me better than any MBA framework ever did.",
        emotion: 'warm_generous'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_gift_thanks',
        text: "Thank you, Quinn.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'finance', 'gift', 'closure']
  },

  {
    nodeId: 'quinn_fewer_deals',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "It does. I used to close 20 deals a year. Now I do maybe 4.\n\nBut those 4 let me sleep at night. And they tend to last longer than the quick wins.",
        variation_id: 'quinn_v28',
        emotion: 'content_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_fewer_reflect',
        text: "Quality over quantity.",
        nextNodeId: 'quinn_quality_confirm',
        pattern: 'patience',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_fewer_hub',
        text: "I appreciate you sharing this.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'finance']
  },

  {
    nodeId: 'quinn_quality_confirm',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "Exactly. Took me too long to learn that. Wall Street rewards volume. Life rewards intention.",
        variation_id: 'quinn_v29',
        emotion: 'wise_humble'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_quality_hub',
        text: "Thank you for this conversation.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'finance', 'closure']
  },

  // Nodes for other paths
  {
    nodeId: 'quinn_invest_people',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v24',
        text: "*Quinn's expression softens.*\n\nIdeas are cheap. Execution is everything. And execution depends on the person.\n\nI've seen brilliant ideas fail because the founder couldn't handle pressure. I've seen mediocre ideas succeed because someone believed in them harder than anyone thought possible.\n\nPeople are the variable that matters most.",
        emotion: 'teaching_warm'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_people_criteria',
        text: "What do you look for in a person?",
        nextNodeId: 'quinn_person_criteria',
        pattern: 'analytical',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'quinn_people_hub',
        text: "That changes how I think about investing.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance']
  },

  {
    nodeId: 'quinn_person_criteria',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v25',
        text: "Three things:\n\n1. **Resilience** - Have they failed before and gotten back up?\n2. **Why** - Is their motivation deeper than money?\n3. **Awareness** - Do they know what they don't know?\n\nA founder with all three can learn anything else. A founder missing any one will probably crash.",
        emotion: 'teaching_confident'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_criteria_self',
        text: "How would you rate yourself on those?",
        nextNodeId: 'quinn_self_rating',
        pattern: 'exploring',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_criteria_hub',
        text: "That's a framework I'll remember.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'finance', 'criteria']
  },

  {
    nodeId: 'quinn_self_rating',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v26',
        text: "*Quinn laughs—a genuine laugh.*\n\nFair question. Resilience? High—I've failed spectacularly and I'm still here. Why? It took 15 years to find, but it's solid now. Awareness?\n\n*He pauses.*\n\nThat one still gets me. I spent years thinking I knew everything. Now I know I never will. That's progress, I think.",
        emotion: 'self_aware_humble'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_self_growth',
        text: "That sounds like growth.",
        nextNodeId: 'quinn_growth_confirm',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_self_hub',
        text: "Thank you for being honest.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'vulnerability', 'growth']
  },

  {
    nodeId: 'quinn_growth_confirm',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v27',
        text: "Growth. Yeah.\n\nI used to think growth meant more—more money, more deals, more status. Now I think growth means deeper—deeper understanding, deeper relationships, deeper purpose.\n\nLess breadth, more depth. That's the trade I made.",
        emotion: 'content_wise'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_growth_hub',
        text: "I'm glad you made that trade.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'growth', 'closure']
  },

  // Additional connection nodes
  {
    nodeId: 'quinn_both_example',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v28',
        text: "There's a company in Birmingham—started by two UAB grads—that trains formerly incarcerated people for tech jobs. They charge companies for the trained workers.\n\nThe social impact IS the business model. More people they help, more revenue they make. That's alignment.",
        emotion: 'excited_teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_example_more',
        text: "Are there other examples like that?",
        nextNodeId: 'quinn_more_examples',
        pattern: 'exploring',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'quinn_example_hub',
        text: "That's inspiring.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'finance', 'birmingham']
  },

  {
    nodeId: 'quinn_more_examples',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "Plenty. A credit union that only lends to small businesses in underserved neighborhoods—the more they lend, the more the neighborhood grows, the more deposits they get.\n\nA tutoring company that hires college students from low-income backgrounds—the tutors are the product AND the mission.\n\nWhen you look for it, you see it everywhere.",
        variation_id: 'quinn_v35',
        emotion: 'passionate'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_examples_hub',
        text: "You've opened my eyes to this.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'finance', 'social_enterprise']
  },

  // Placeholder nodes for incomplete paths
  {
    nodeId: 'quinn_time_meaning',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v29',
        text: "Time. That's the real currency, isn't it?\n\nMoney can buy time to think, time to explore, time to figure out what matters. But only if you use it for that. Most wealthy people I know use their time to make more money. Infinite loop, no exit.",
        emotion: 'thoughtful'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_time_escape',
        text: "How did you escape the loop?",
        nextNodeId: 'quinn_escape_loop',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_time_hub',
        text: "That's worth thinking about.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['quinn_arc', 'philosophy']
  },

  {
    nodeId: 'quinn_escape_loop',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v30',
        text: "I didn't escape. I crashed out.\n\nBurnout isn't an escape—it's a forced exit. But once I was out, I had the clarity to see the loop from the outside.\n\nI don't recommend the crash. But I'm grateful for the clarity.",
        emotion: 'honest_wry'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_escape_hub',
        text: "Thank you for being honest about that.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'burnout', 'growth']
  },

  {
    nodeId: 'quinn_what_missing',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v31',
        text: "Connection. Real connection.\n\nI had networking. I had strategic relationships. I had a contact list that could get me into any room.\n\nBut I didn't have anyone who would come to my apartment at 3 AM if I was falling apart. That's what was missing.",
        emotion: 'vulnerable_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_missing_now',
        text: "Do you have that now?",
        nextNodeId: 'quinn_have_now',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_missing_hub',
        text: "That takes courage to admit.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'vulnerability', 'connection']
  },

  {
    nodeId: 'quinn_have_now',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v32',
        text: "Working on it. Birmingham helps. People here aren't impressed by where I used to work. They care about who I am now, what I'm doing for the community.\n\nIt's slower. Deeper. Less transactional. More real.",
        emotion: 'hopeful_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_have_hub',
        text: "That sounds like progress.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'birmingham', 'growth']
  },

  // Additional nodes to meet node count
  {
    nodeId: 'quinn_listening_value',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v33',
        text: "In finance, listening is an edge. Everyone's so busy talking, pitching, selling—they miss what people actually need.\n\nI made my best investments by listening to what founders DIDN'T say.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_listen_teach',
        text: "What do you listen for?",
        nextNodeId: 'quinn_listen_for',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'quinn_listen_hub',
        text: "That's a valuable skill.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'finance', 'skills']
  },

  {
    nodeId: 'quinn_listen_for',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v34',
        text: "Hesitation. Where do they pause? What questions make them uncomfortable?\n\nA founder who stumbles on 'why this matters to you' is a red flag. A founder who stumbles on 'how will you scale' just needs help.\n\nThe pauses tell you everything.",
        emotion: 'teaching_engaged'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_listen_hub',
        text: "I'll remember that.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'finance', 'skills']
  },

  {
    nodeId: 'quinn_wall_street_pace',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v35',
        text: "Wall Street? Patience?\n\n*Quinn laughs.*\n\nThe culture is speed. First to the trade, first to the deal, first to the exit. Patience is seen as weakness—like you're too slow to compete.\n\nTook me years to realize: the slow money usually wins. Just not fast enough to make headlines.",
        emotion: 'wry_teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_pace_slow',
        text: "Slow money?",
        nextNodeId: 'quinn_slow_money',
        pattern: 'exploring',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'quinn_pace_hub',
        text: "That's a different perspective than I expected.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'analytical',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'finance', 'culture']
  },

  {
    nodeId: 'quinn_slow_money',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v36',
        text: "Slow money. Patient capital. Investments made for the long term, not the next quarter.\n\nWarren Buffett's whole strategy is slow money. Buy good companies, hold forever. Boring as hell. Works better than almost everything else.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_slow_hub',
        text: "Boring but effective. That's a theme.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'analytical',
        skills: ['financialLiteracy'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'finance', 'investing']
  },

  {
    nodeId: 'quinn_deeper_story',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v37',
        text: "The deeper story.\n\n*Quinn settles back in his chair.*\n\nI was 16 when I realized I was good at math. Not just good—I could see patterns other people couldn't. My teachers told me I could go anywhere.\n\nSo I went as far as I could. Turns out 'far' and 'somewhere worth being' aren't the same thing.",
        emotion: 'reflective'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_deeper_worth',
        text: "Where is worth being?",
        nextNodeId: 'quinn_worth_being',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_deeper_hub',
        text: "That's a lesson a lot of people learn too late.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'backstory']
  },

  {
    nodeId: 'quinn_worth_being',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "Here. Teaching. Building something that outlasts me.\n\nI used to measure success by what I could accumulate. Now I measure it by what I can leave behind.\n\nDifferent math. Same pattern-recognition skill. Better outcome.",
        variation_id: 'quinn_v45',
        emotion: 'content_wise'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_worth_hub',
        text: "I'm glad you found your way here.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'growth', 'closure']
  },

  {
    nodeId: 'quinn_personal_first',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v38',
        text: "*Quinn pauses, slightly surprised.*\n\nMost people want the simulation. The teaching. They want what I can do for them.\n\nYou want to know who I am first. That's... that's the right instinct.",
        emotion: 'touched',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "*Quinn's expression softens.*\n\nYou care about people before their credentials. That's rare in any industry, but especially in finance.\n\nAsk me anything. I'm an open book today.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'quinn_personal_story',
        text: "Tell me your story.",
        nextNodeId: 'quinn_full_story',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 2
        }
      },
      {
        choiceId: 'quinn_personal_why',
        text: "Why are you here? In this station?",
        nextNodeId: 'quinn_why_station',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['quinn_arc', 'connection']
  },

  {
    nodeId: 'quinn_full_story',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v39',
        text: "My story.\n\nBirmingham kid. Math prodigy. Got into MIT. Worked at Goldman. Made partner at 32. Burned out at 34.\n\nCame home. Started over. Now I'm here, trying to make sure the next generation of Birmingham kids don't make my mistakes.\n\nThat's the short version. The long version takes time.",
        emotion: 'open_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_full_time',
        text: "I have time.",
        nextNodeId: 'quinn_long_version',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 2
        }
      },
      {
        choiceId: 'quinn_full_mistakes',
        text: "What mistakes?",
        nextNodeId: 'quinn_mistakes',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ],
    tags: ['quinn_arc', 'backstory']
  },

  {
    nodeId: 'quinn_long_version',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v40',
        text: "*Quinn nods, a real warmth in his eyes.*\n\nThen let's take our time.\n\nI'll tell you about the kid who thought numbers were the answer to everything. And how he learned—slowly, painfully—that numbers are just one kind of truth.\n\nWhere do you want to start?",
        emotion: 'open_warm'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_long_birmingham',
        text: "Start with Birmingham.",
        nextNodeId: 'quinn_birmingham_return',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'quinn_long_burnout',
        text: "Start with the burnout.",
        nextNodeId: 'quinn_wealth_paradox',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['quinn_arc', 'connection']
  },

  {
    nodeId: 'quinn_mistakes',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v41',
        text: "Prioritizing wealth over meaning. Measuring success by account balance instead of impact. Optimizing for efficiency without asking 'efficient at what?'\n\nThe usual brilliant-person mistakes. I just made them faster than most.",
        emotion: 'wry_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_mistakes_avoid',
        text: "How can someone avoid those mistakes?",
        nextNodeId: 'quinn_avoid_mistakes',
        pattern: 'building',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'quinn_mistakes_hub',
        text: "Thank you for being honest about them.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'wisdom']
  },

  {
    nodeId: 'quinn_avoid_mistakes',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v42',
        text: "Ask 'why' before 'how much.' Regularly.\n\nEvery few months, stop and ask: 'If I succeed at this, what will I have built? Who will I have become? Is that who I want to be?'\n\nMost people don't ask until it's too late. Ask early. Ask often.",
        emotion: 'teaching_earnest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_avoid_hub',
        text: "That's advice I'll keep.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1,
          addKnowledgeFlags: ['quinn_why_advice']
        }
      }
    ],
    tags: ['quinn_arc', 'wisdom', 'gift']
  },

  {
    nodeId: 'quinn_why_station',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v43',
        text: "The station.\n\n*Quinn looks around the Exchange Floor.*\n\nI found this place when I was at my lowest. Or it found me—I'm still not sure which.\n\nSamuel told me it appears to people at crossroads. I was definitely at one. Still am, in some ways. The crossroads keep coming. The station stays.",
        emotion: 'reflective_grateful'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_station_samuel',
        text: "What did Samuel tell you?",
        nextNodeId: 'quinn_samuel_wisdom',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'quinn_station_hub',
        text: "I'm glad the station is here.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'station', 'samuel']
  },

  {
    nodeId: 'quinn_samuel_wisdom',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v44',
        text: "He said: 'The station doesn't offer answers. It offers mirrors. What you see depends on what you're ready to see.'\n\nTook me months to understand what he meant. I was looking for someone to tell me what to do next. The station showed me I already knew.",
        emotion: 'reflective_grateful'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_samuel_hub',
        text: "That's why I keep coming back here too.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'station', 'samuel', 'wisdom']
  },

  // Additional nodes for other paths
  {
    nodeId: 'quinn_pitch_criteria',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v45',
        text: "Criteria?\n\nOld me would have said: addressable market, competitive moat, path to profitability.\n\nNew me says: Who gets helped? Who might get hurt? Can the founder answer uncomfortable questions without flinching?\n\nThe second set is harder to measure. That's exactly why it matters more.",
        emotion: 'teaching_thoughtful'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_criteria_example',
        text: "Can I see how that plays out?",
        nextNodeId: 'quinn_pitch_setup',
        pattern: 'exploring',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'quinn_criteria_hub',
        text: "That's a different way of thinking about investment.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'analytical',
        skills: ['communication']
      }
    ],
    tags: ['quinn_arc', 'finance', 'values']
  },

  {
    nodeId: 'quinn_pitch_dig_deeper',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v46',
        text: "*Quinn smiles.*\n\nCareful analysis. That's what separates good investors from lucky ones.\n\nWhat do you want to know?",
        emotion: 'approving'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_dig_revenue',
        text: "What are the revenue projections for each?",
        nextNodeId: 'quinn_revenue_projections',
        pattern: 'analytical',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'quinn_dig_founders',
        text: "Tell me more about the founders themselves.",
        nextNodeId: 'quinn_founder_details',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance']
  },

  {
    nodeId: 'quinn_revenue_projections',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v47',
        text: "**Founder A:** Year 1 projections are $200K, but that's mostly grants and donations. Year 3 they're projecting $2M through B2B partnerships with colleges. High uncertainty.\n\n**Founder B:** Year 1 at $800K, Year 3 at $5M. Conservative estimates with clear unit economics. Low uncertainty.\n\n**Founder C:** Year 1 at $150K, Year 3 at $1.2M if they nail enterprise sales. Medium uncertainty.\n\nNumbers change everything—and nothing.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_rev_choice',
        text: "[Make a choice based on revenue]",
        nextNodeId: 'quinn_pitch_setup',
        pattern: 'analytical',
        skills: ['financialLiteracy']
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance']
  },

  {
    nodeId: 'quinn_founder_details',
    speaker: 'Quinn Almeida',
    content: [
      {
        text: "**Founder A:** First-gen college student herself. Built the first version while working two jobs. Burning with mission.\n\n**Founder B:** Third startup. Two exits. Knows how to build and sell. Limited emotional investment.\n\n**Founder C:** Finance background. Burned out after 8 years in trading. This is personal—maybe too personal.\n\nThe human story changes everything—and nothing.",
        variation_id: 'quinn_v56',
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_found_choice',
        text: "[Make a choice based on founders]",
        nextNodeId: 'quinn_pitch_setup',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['quinn_arc', 'simulation', 'finance']
  },

  // Nodes for complete paths
  {
    nodeId: 'quinn_numbers_feelings',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v48',
        text: "That's what I used to think. Numbers are neutral. Data is objective.\n\nBut the choices about what to measure, what to optimize for—those are human choices. Full of values. Full of feelings, whether we admit it or not.\n\nI chose to measure profit. That choice had feelings behind it. I just pretended it didn't.",
        emotion: 'honest_reflective'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_feelings_hub',
        text: "That's a profound way to think about data.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'philosophy', 'finance']
  },

  {
    nodeId: 'quinn_values_returns',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v49',
        text: "Values and returns. They're not opposites—they're both criteria for success.\n\nThe question is: which one do you let override the other when they conflict?\n\nI used to let returns win every time. Now I'm more... selective about when profit gets the final vote.",
        emotion: 'teaching_honest'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_values_hub',
        text: "That selectivity is wisdom.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'patience',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'values', 'finance']
  },

  {
    nodeId: 'quinn_personal_sustainable',
    speaker: 'Quinn Almeida',
    content: [
      {
        variation_id: 'quinn_v50',
        text: "Sustainable? Probably not at scale. I can do 4-5 investments like that a year.\n\nBut here's the thing: I'm not trying to run a fund anymore. I'm trying to run a life.\n\nScalability was a trap I fell into before. Not every good thing needs to scale.",
        emotion: 'honest_content'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_personal_hub',
        text: "That's a healthier way to think about it.",
        nextNodeId: 'quinn_return_hub',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['quinn_arc', 'values', 'growth']
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'quinn_mystery_hint',
    speaker: 'quinn',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "In finance, everything has a value. Assets, liabilities, risk-adjusted returns.\\n\\nBut the currency here isn't money. It's... <shake>attention</shake>. Real attention. The kind you can't fake.",
        emotion: 'reflective',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "Every conversation here feels like an investment. And the returns are... different.",
        emotion: 'thoughtful',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'quinn_mystery_dig',
        text: "What kind of returns?",
        nextNodeId: 'quinn_mystery_response',
        pattern: 'analytical'
      },
      {
        choiceId: 'quinn_mystery_agree',
        text: "Some investments pay off in ways money can't measure.",
        nextNodeId: 'quinn_mystery_response',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'quinn_mystery_response',
    speaker: 'quinn',
    content: [
      {
        text: "Clarity. Purpose. The feeling that you're exactly where you should be.\\n\\nMy whole career, I've been measuring the wrong things. This place is teaching me that.",
        emotion: 'vulnerable',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'quinn', addKnowledgeFlags: ['quinn_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'quinn_mystery_return',
        text: "You're not too late to measure what matters.",
        nextNodeId: 'quinn_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'quinn_hub_return',
    speaker: 'quinn',
    content: [{
      text: "Thanks. I'm working on it.\\n\\nLet's keep looking at the numbers, but... differently.",
      emotion: 'determined',
      variation_id: 'hub_return_v1'
    }],
    choices: []
  },

  // ═══════════════════════════════════════════════════════════════
  // STUB NODES - Fix broken navigation
  // ═══════════════════════════════════════════════════════════════

  { nodeId: 'quinn_applying_wisdom', speaker: 'Quinn Rivera', content: [{ text: "Applying wisdom to finance means knowing when NOT to optimize. Some returns aren't worth what they cost.", emotion: 'thoughtful', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Knowing when to stop.", nextNodeId: 'quinn_hub_return', pattern: 'patience' }], tags: ['stub'] },
  { nodeId: 'quinn_back_birmingham', speaker: 'Quinn Rivera', content: [{ text: "Coming back to Birmingham wasn't retreat. It was strategy. This is where I can make real change.", emotion: 'determined', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Strategic return.", nextNodeId: 'quinn_hub_return', pattern: 'building' }], tags: ['stub'] },
  { nodeId: 'quinn_build_different', speaker: 'Quinn Rivera', content: [{ text: "Building something different in finance means questioning every assumption. Why does it have to work this way? Usually it doesn't.", emotion: 'passionate', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Question everything.", nextNodeId: 'quinn_hub_return', pattern: 'exploring' }], tags: ['stub'] },
  { nodeId: 'quinn_change_inside', speaker: 'Quinn Rivera', content: [{ text: "Change from inside is slower but deeper. You have to earn trust before you can challenge assumptions.", emotion: 'knowing', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Trust before challenge.", nextNodeId: 'quinn_hub_return', pattern: 'patience' }], tags: ['stub'] },
  { nodeId: 'quinn_conscience_answer', speaker: 'Quinn Rivera', content: [{ text: "My conscience? It's loud. Every deal, every recommendation—I hear it asking 'who does this really help?'", emotion: 'vulnerable', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "A loud conscience.", nextNodeId: 'quinn_hub_return', pattern: 'helping' }], tags: ['stub'] },
  { nodeId: 'quinn_economy_prediction', speaker: 'Quinn Rivera', content: [{ text: "Predicting the economy? Anyone who claims certainty is selling something. I deal in probabilities and humility.", emotion: 'honest', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Humble predictions.", nextNodeId: 'quinn_hub_return', pattern: 'analytical' }], tags: ['stub'] },
  { nodeId: 'quinn_founder_types', speaker: 'Quinn Rivera', content: [{ text: "Three types of founders: dreamers who can't execute, executors who can't dream, and the rare ones who do both. I fund the third.", emotion: 'knowing', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Finding the rare ones.", nextNodeId: 'quinn_hub_return', pattern: 'analytical' }], tags: ['stub'] },
  { nodeId: 'quinn_happiness_research', speaker: 'Quinn Rivera', content: [{ text: "Happiness research says money matters until it doesn't. Past a point, it's relationships, purpose, growth. Finance mostly ignores this.", emotion: 'thoughtful', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "What really matters.", nextNodeId: 'quinn_hub_return', pattern: 'helping' }], tags: ['stub'] },
  { nodeId: 'quinn_harder_investing', speaker: 'Quinn Rivera', content: [{ text: "Ethical investing is harder. More due diligence, more saying no, more complexity. But that's not an excuse to avoid it.", emotion: 'firm', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Harder but necessary.", nextNodeId: 'quinn_hub_return', pattern: 'patience' }], tags: ['stub'] },
  { nodeId: 'quinn_heavy_living', speaker: 'Quinn Rivera', content: [{ text: "Living with financial knowledge is heavy. I see the systems most people don't. Can't unsee them now.", emotion: 'serious', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Can't unsee it.", nextNodeId: 'quinn_hub_return', pattern: 'analytical' }], tags: ['stub'] },
  { nodeId: 'quinn_lonely_now_answer', speaker: 'Quinn Rivera', content: [{ text: "Lonely? Sometimes. This path isn't crowded. But I'd rather be lonely and right than popular and complicit.", emotion: 'honest', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Lonely but right.", nextNodeId: 'quinn_hub_return', pattern: 'patience' }], tags: ['stub'] },
  { nodeId: 'quinn_marcus_relationship', speaker: 'Quinn Rivera', content: [{ text: "Marcus and I see different angles of the same problem. He's healing people; I'm trying to heal systems. We need both.", emotion: 'warm', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Both are needed.", nextNodeId: 'quinn_hub_return', pattern: 'helping' }], tags: ['stub'] },
  { nodeId: 'quinn_meaningful_weight', speaker: 'Quinn Rivera', content: [{ text: "Meaningful work has weight to it. Lightness is nice but it doesn't build anything that lasts.", emotion: 'reflective', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Weight that builds.", nextNodeId: 'quinn_hub_return', pattern: 'building' }], tags: ['stub'] },
  { nodeId: 'quinn_system_excuse', speaker: 'Quinn Rivera', content: [{ text: "The system is an excuse. People built it. People can rebuild it. Saying 'that's how it works' is a choice.", emotion: 'passionate', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "We can rebuild.", nextNodeId: 'quinn_hub_return', pattern: 'building' }], tags: ['stub'] },
  { nodeId: 'quinn_teach_approach', speaker: 'Quinn Rivera', content: [{ text: "My teaching approach? Show people the real numbers. Not the sanitized version. Real numbers change minds.", emotion: 'knowing', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Real numbers.", nextNodeId: 'quinn_hub_return', pattern: 'analytical' }], tags: ['stub'] },
  { nodeId: 'quinn_teaching_offer', speaker: 'Quinn Rivera', content: [{ text: "I could teach you more. Financial literacy isn't taught because it's dangerous—to the people who profit from confusion.", emotion: 'serious', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "I'd like to learn.", nextNodeId: 'quinn_hub_return', pattern: 'exploring' }], tags: ['stub'] },
  { nodeId: 'quinn_titusville_history', speaker: 'Quinn Rivera', content: [{ text: "Titusville. Where I grew up. First Black neighborhood in Birmingham. History in every street. That's what I'm fighting for.", emotion: 'proud', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Fighting for history.", nextNodeId: 'quinn_hub_return', pattern: 'helping' }], tags: ['stub'] },
  { nodeId: 'quinn_what_changed', speaker: 'Quinn Rivera', content: [{ text: "What changed me? Seeing the spreadsheets. The actual numbers showing how wealth flows away from people who need it most.", emotion: 'troubled', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "The numbers don't lie.", nextNodeId: 'quinn_hub_return', pattern: 'analytical' }], tags: ['stub'] },
  { nodeId: 'quinn_why_understand', speaker: 'Quinn Rivera', content: [{ text: "Understanding why matters more than knowing what. The what changes. The why reveals the system underneath.", emotion: 'knowing', variation_id: 'stub_v1' }], choices: [{ choiceId: 'stub_return', text: "Seeing the system.", nextNodeId: 'quinn_hub_return', pattern: 'analytical' }], tags: ['stub'] }
]

// Entry points for navigation
export const quinnEntryPoints = {
  INTRODUCTION: 'quinn_introduction',
  THE_PITCH: 'quinn_sim_pitch',
  VULNERABILITY: 'quinn_vulnerability_arc',
  MYSTERY_HINT: 'quinn_mystery_hint'
} as const

// Build the graph
export const quinnDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(quinnDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: quinnEntryPoints.INTRODUCTION,
  metadata: {
    title: "Quinn's Finance Floor",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: quinnDialogueNodes.length,
    totalChoices: quinnDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
