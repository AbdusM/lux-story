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
        voiceVariations: {
          analytical: "What they miss?\n\nI once built an algorithm—73% accuracy predicting market movements. $14 million in eight months. Statistically significant. Elegant logic.\n\n400 jobs eliminated by my efficiency model. The numbers classified that as 'optimization.' Cost-benefit analysis didn't include a variable for human cost.",
          helping: "What they miss?\n\nI once built an algorithm that predicted market movements with 73% accuracy. Made $14 million in eight months.\n\n400 families lost their income because of my recommendations. The numbers don't capture a parent who can't afford their kid's medication. Numbers don't measure a family that falls apart under financial stress.",
          building: "What they miss?\n\nI once built an algorithm that predicted market movements with 73% accuracy. Made $14 million in eight months. The architecture was elegant.\n\n400 jobs demolished by my efficiency framework. The numbers called that 'optimization.' I built wealth while destroying livelihoods.",
          exploring: "What they miss?\n\nI once built an algorithm that predicted market movements with 73% accuracy. Made $14 million in eight months. Discovered a pattern.\n\n400 jobs vanished because of my exploration. The numbers mapped that as 'optimization.' I charted profit but ignored the territory of consequences.",
          patience: "What they miss?\n\nI once built an algorithm that predicted market movements with 73% accuracy. Made $14 million in eight months. Fast returns.\n\n400 people lost careers they'd spent years building. The numbers called that 'optimization.' Instant profit, decades of damage."
        },
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
        voiceVariations: {
          analytical: "Heavy.\n\n*Quinn examines his hands like data.*\n\nI had a penthouse overlooking Central Park. Optimal commute. Custom tailoring. Peak wealth accumulation metrics.\n\nBut the correlation between wealth and well-being broke down. Drinking alone at 2 AM, analyzing why the happiness function returned null.",
          helping: "Heavy.\n\n*Quinn's voice softens.*\n\nI had a penthouse overlooking Central Park. Every luxury. A tailor who remembered me. I was building wealth.\n\nBut I was also drinking alone at 2 AM, realizing I had no one to call. No one who cared about me, just my portfolio.",
          building: "Heavy.\n\n*Quinn looks at what he's built.*\n\nI had a penthouse overlooking Central Park. A car service. A tailor who knew my measurements. I was building wealth—stacking success.\n\nBut I was also drinking alone at 2 AM, wondering why the foundation felt hollow. Why nothing I constructed made me feel whole.",
          exploring: "Heavy.\n\n*Quinn maps his past.*\n\nI had a penthouse overlooking Central Park. A car service. A tailor who knew my measurements. I was exploring wealth's territory.\n\nBut I was also drinking alone at 2 AM, lost despite all the markers of arrival. Missing something I couldn't chart.",
          patience: "Heavy.\n\n*Quinn sits with it.*\n\nI had a penthouse overlooking Central Park. A car service. A tailor who knew my measurements. I was building wealth fast.\n\nBut I was also drinking alone at 2 AM, wondering why years of accumulation felt empty. Why speed left me nowhere."
        },
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "Heavy.\n\n*Quinn's guard drops slightly.*\n\nI had everything the brochure promised. But I couldn't call anyone at 2 AM who wasn't paid to take my call. I was building wealth, but I wasn't building... anything that would last.", altEmotion: 'vulnerable' },
          { pattern: 'analytical', minLevel: 5, altText: "Heavy.\n\nI had a penthouse, optimal metrics across every financial benchmark. But the happiness correlation inverted.\n\nDrinking alone at 2 AM, analyzing why the model failed. Wealth accumulated; meaning returned null.", altEmotion: 'matter_of_fact' },
          { pattern: 'patience', minLevel: 5, altText: "Heavy.\n\nI had everything speed could buy. Penthouse. Car service. Instant gratification.\n\nBut I was also drinking alone at 2 AM, finally slow enough to realize I'd raced past everything that mattered.", altEmotion: 'reflective' },
          { pattern: 'exploring', minLevel: 5, altText: "Heavy.\n\nI had explored every territory wealth could open. Penthouse views. Exclusive circles.\n\nBut at 2 AM, drinking alone, I realized I'd mapped the wrong continent entirely.", altEmotion: 'searching' },
          { pattern: 'building', minLevel: 5, altText: "Heavy.\n\nI built everything the plan required. Penthouse. Portfolio. Perfect on paper.\n\nBut at 2 AM, drinking alone, I realized the structure was hollow. I'd built walls, not a home.", altEmotion: 'honest' }
        ],
        interrupt: {
          duration: 3500,
          type: 'silence',
          action: 'Let him sit in the emptiness for a beat. No fixes yet.',
          targetNodeId: 'quinn_interrupt_acknowledged',
          consequence: {
            characterId: 'quinn',
            trustChange: 2
          }
        }
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
  {
    nodeId: 'quinn_interrupt_acknowledged',
    speaker: 'Quinn Almeida',
    content: [{
      text: "You didn't try to reframe it. You just let the silence land.\n\nMost people rush to fix the feeling. You didn't. That meant more than you think.",
      emotion: 'grateful',
      variation_id: 'quinn_interrupt_v1'
    }],
    choices: [
      {
        choiceId: 'quinn_interrupt_continue',
        text: "You were lonely.",
        nextNodeId: 'quinn_loneliness',
        pattern: 'helping',
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'quinn_arc']
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
        voiceVariations: {
          analytical: "Birmingham.\n\n*Quinn's eyes drift to a faded photo.*\n\nMy grandmother never left. Born in Titusville, died in Titusville. Never exceeded $40,000 annual income. Statistically highest life satisfaction I've measured.\n\nI made more in a week than she made in a decade. But she optimized for a variable I couldn't quantify. I came back to analyze what that was.",
          helping: "Birmingham.\n\n*Quinn's eyes find a faded photo.*\n\nMy grandmother never left. Born in Titusville, died in Titusville. Never made more than $40,000 a year. Loved more people than I've ever known.\n\nI made more in a week than she made in a decade. But she gave something I couldn't buy. I came back to learn how to care like that.",
          building: "Birmingham.\n\n*Quinn's eyes rest on a faded photo.*\n\nMy grandmother never left. Born in Titusville, died in Titusville. Never made more than $40,000 a year. Built the strongest foundation I ever witnessed.\n\nI made more in a week than she made in a decade. But she constructed something that lasted. I came back to rebuild what she had.",
          exploring: "Birmingham.\n\n*Quinn's eyes drift to a faded photo.*\n\nMy grandmother never left. Born in Titusville, died in Titusville. Never chased markets. Happiest person I ever knew.\n\nI made more in a week than she made in a decade. But she discovered something I'm still searching for. I came back to find what she found.",
          patience: "Birmingham.\n\n*Quinn's eyes rest on a faded photo.*\n\nMy grandmother never left. Born in Titusville, died in Titusville. Never made more than $40,000 a year. Lived 87 years of contentment.\n\nI made more in a week than she made in a decade. But she accumulated something I raced past. I came back to slow down and learn what time taught her."
        },
        patternReflection: [
          { pattern: 'exploring', minLevel: 4, altText: "Birmingham.\n\nMy grandmother never left this city. Never chased the bigger markets, never 'optimized' her life. She just... lived it. Fully.\n\nI made more in a week than she made in a decade. But she knew something I didn't. I came back to learn what she knew.", altEmotion: 'curious_humble' },
          { pattern: 'analytical', minLevel: 4, altText: "Birmingham.\n\nMy grandmother's data: $40k annual income, zero mobility, 87 years of life satisfaction. The metrics don't compute.\n\nI made more in a week than she made in a decade. But her formula worked. I came back to reverse-engineer it.", altEmotion: 'puzzled_respectful' },
          { pattern: 'patience', minLevel: 4, altText: "Birmingham.\n\nMy grandmother never rushed anywhere. Born here, died here. Took 87 years to live a full life.\n\nI made more in a week than she made in a decade. But she had time for everyone. I came back to learn what slowness taught her.", altEmotion: 'reflective' },
          { pattern: 'helping', minLevel: 4, altText: "Birmingham.\n\nMy grandmother spent her life caring for others. Neighbors, family, church. Never accumulated much except love.\n\nI made more in a week than she made in a decade. But people showed up when she needed them. I came back to learn how she built that.", altEmotion: 'tender' },
          { pattern: 'building', minLevel: 4, altText: "Birmingham.\n\nMy grandmother built something without money. Community. Trust. A legacy that outlived her savings.\n\nI made more in a week than she made in a decade. But what I built was fragile. Hers still stands. I came back to learn her architecture.", altEmotion: 'humble' }
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
          { pattern: 'patience', minLevel: 4, altText: "*Quinn's posture relaxes slightly.*\n\nYou know how to hold space. That's not a skill they teach in business school.\n\nWhen I was on Wall Street, every second of silence felt like lost opportunity. Now I know—some of the best decisions come from the spaces between words.", altEmotion: 'warm_reflective' },
          { pattern: 'analytical', minLevel: 4, altText: "*Quinn observes you carefully.*\n\nYou're analyzing, not filling. Collecting data instead of projecting it.\n\nOn Wall Street, everyone talked past each other. The ones who listened saw the patterns others missed.", altEmotion: 'appreciative' },
          { pattern: 'exploring', minLevel: 4, altText: "*Quinn's expression shifts.*\n\nYou're curious enough to wait. To see what unfolds without forcing it.\n\nMost people want answers immediately. Explorers know the best discoveries come from patience.", altEmotion: 'warm' },
          { pattern: 'helping', minLevel: 4, altText: "*Quinn's guard lowers.*\n\nYou gave me space. That's care disguised as nothing.\n\nIn finance, everyone wants to help by giving advice. You helped by just... being here.", altEmotion: 'touched' },
          { pattern: 'building', minLevel: 4, altText: "*Quinn nods slowly.*\n\nSilence is foundation work. You can't build trust on noise.\n\nThe best structures need quiet moments. You seem to understand that.", altEmotion: 'respectful' }
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
          { pattern: 'analytical', minLevel: 6, altText: "*Quinn's voice is flat, controlled.*\n\nI ran the numbers 47 times. Looking for a way the model was wrong. It wasn't wrong. It was exactly right.\n\nMarcus was inefficient by every metric that mattered. The model said cut him. I said cut him.\n\nI was the one who was wrong.", altEmotion: 'shame' },
          { pattern: 'patience', minLevel: 6, altText: "*Quinn's breathing is slow, deliberate. He's been carrying this a long time.*\n\nYou take your time with decisions. I should have too.\n\nI rushed the optimization. 'Move fast, maximize efficiency.' Didn't pause to ask who the efficiency was for.\n\nMarcus lost his job. And I lost years wondering if patience would have found a different answer.", altEmotion: 'regret' },
          { pattern: 'exploring', minLevel: 6, altText: "*Quinn traces the edge of the clipping. Mapping old territory.*\n\nYou explore options. I stopped exploring.\n\nI found one path—'optimize labor costs'—and I followed it. Didn't explore alternatives. Didn't map what else was possible.\n\nMarcus was collateral to my lack of curiosity. The explorer who only charted one route.", altEmotion: 'shame_regret' },
          { pattern: 'building', minLevel: 6, altText: "*Quinn's hands are trembling. The clipping is worn from years of holding.*\n\nYou build things. I built something that destroyed.\n\nI built an algorithm. Clean code. Elegant logic. And it dismantled 400 careers. Including Marcus's.\n\nI've been trying to rebuild what I tore down. But you can't rebuild trust with efficiency metrics.", altEmotion: 'builder_shame' }
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
      },
      // Loyalty Experience trigger - only visible at high trust + analytical pattern
      {
        choiceId: 'offer_portfolio_help',
        text: "[Financial Analyst] Quinn, you mentioned rebuilding your portfolio ethically. Want to work through it together?",
        nextNodeId: 'quinn_loyalty_trigger',
        pattern: 'analytical',
        skills: ['criticalThinking', 'dataAnalysis'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { analytical: { min: 50 } },
          hasGlobalFlags: ['quinn_arc_complete']
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['quinn_arc_complete']
      }
    ],
    tags: ['quinn_arc', 'return_hub']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'quinn_loyalty_trigger',
    speaker: 'Quinn Almeida',
    content: [{
      text: "You want to help rebuild it.\n\nI've been staring at this spreadsheet for weeks. Every investment I made. Every client I advised. Tracking where the money went. What it enabled.\n\nSome of it was fine. Index funds. Municipal bonds. Boring stuff.\n\nBut some of it... private equity that gutted companies. Real estate funds that displaced families. Returns built on exploitation I chose not to see.\n\nI can't just delete it and start over. I need to understand the full scope. Document it. Make it right where I can.\n\nBut doing that alone means facing every compromise I made. Every time I prioritized returns over impact.\n\nYou understand analysis and systems. Would you... help me audit my own complicity?",
      emotion: 'anxious_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { analytical: { min: 5 } },
      hasGlobalFlags: ['quinn_arc_complete']
    },
    metadata: {
      experienceId: 'the_portfolio'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_portfolio_challenge',
        text: "Let's go through it together. Line by line. No judgment, just truth.",
        nextNodeId: 'quinn_loyalty_start',
        pattern: 'analytical',
        skills: ['criticalThinking', 'dataAnalysis'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Quinn, you're already doing the hardest part. Trust your analysis.",
        nextNodeId: 'quinn_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'quinn',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'quinn_loyalty', 'high_trust']
  },

  {
    nodeId: 'quinn_loyalty_declined',
    speaker: 'Quinn Almeida',
    content: [{
      text: "You're right. I've been avoiding this because I'm afraid of what I'll find.\n\nBut I know how to analyze financial systems. I can apply that same rigor to my own portfolio.\n\nThe numbers don't lie. They'll show me exactly where I compromised. And that's what I need to see.\n\nThank you for the confidence. Sometimes courage is just doing the analysis you're afraid of.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "The truth is in the spreadsheet. Go find it.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'quinn',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'quinn_loyalty_start',
    speaker: 'Quinn Almeida',
    content: [{
      text: "No judgment. Just truth. That's exactly what I need.\n\nOkay. Let me pull up the full portfolio history. Two analysts. One reckoning. Let's see what I built and what I need to rebuild.",
      emotion: 'determined_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_portfolio'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
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
        emotion: 'warm_wistful',
        skillReflection: [
          { skill: 'financialLiteracy', minLevel: 5, altText: "*Quinn smiles—the first real smile you've seen.*\n\nYou understand money. I can tell by your questions. But my grandmother taught me something your financial literacy probably hasn't covered.\n\nWealth is relational, not numerical. She had thousands in savings—and everyone on her block. I had millions and ordered takeout alone.\n\nReal financial wisdom includes relationships in the ledger.", altEmotion: 'teaching_warm' },
          { skill: 'emotionalIntelligence', minLevel: 5, altText: "*Quinn smiles—the first real smile you've seen.*\n\nYou read people well. You've been doing it with me this whole conversation.\n\nMy grandmother had that too. She knew wealth is relational. A few thousand dollars and everyone on her block. Never ate alone unless she wanted to.\n\nEmotional intelligence is its own kind of wealth. You already have it.", altEmotion: 'knowing_warm' }
        ]
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
      },
      {
        choiceId: 'quinn_go_deeper',
        text: "Quinn... all this financial wisdom. What's the lesson that cost you personally?",
        nextNodeId: 'quinn_vulnerability_arc',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: { trust: { min: 6 } },
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
          { pattern: 'helping', minLevel: 4, altText: "*Quinn's expression softens.*\n\nYou care about people before their credentials. That's rare in any industry, but especially in finance.\n\nAsk me anything. I'm an open book today.", altEmotion: 'warm' },
          { pattern: 'analytical', minLevel: 4, altText: "*Quinn tilts his head.*\n\nMost people optimize for immediate utility. You're gathering context first.\n\nThat's actually the smarter approach. Understanding the person behind the knowledge.", altEmotion: 'intrigued' },
          { pattern: 'patience', minLevel: 4, altText: "*Quinn's pace slows.*\n\nYou're not rushing to the value. You're taking time to understand.\n\nIn my world, everyone wanted the shortcut. You want the full journey.", altEmotion: 'appreciative' },
          { pattern: 'exploring', minLevel: 4, altText: "*Quinn's eyes light up slightly.*\n\nYou're curious about the person, not just the skills. Most people skip straight to 'what can you teach me?'\n\nI like that. Discovery over transaction.", altEmotion: 'warm' },
          { pattern: 'building', minLevel: 4, altText: "*Quinn nods slowly.*\n\nYou're laying foundation before construction. Understanding me before building on my expertise.\n\nThat's how you build relationships that last.", altEmotion: 'respectful' }
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

  // ============= SIMULATION 1: BUDGET BASICS =============
  {
    nodeId: 'quinn_sim1_budget_intro',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Want to understand finance? Start simple. Real simple.\n\nMeet Jasmine. 23, first job out of college. $42K salary. Birmingham.\n\nShe asked me to look at her budget. I'm going to show you what I see—and what most people miss.\n\nReady?",
      emotion: 'teaching',
      variation_id: 'sim1_intro_v1'
    }],
    simulation: {
      phase: 1,
      difficulty: 'introduction',
      variantId: 'quinn_budget_phase1',
      type: 'dashboard_triage',
      title: 'Financial Literacy: The 50/30/20 Rule',
      taskDescription: 'Jasmine earns $42K ($2,625/month after tax). Categorize her expenses using the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
      initialContext: {
        label: 'Monthly Budget Analysis',
        content: `INCOME: $2,625/month (after tax)

EXPENSES:
- Rent: $950
- Car payment: $320
- Groceries: $280
- Utilities: $110
- Insurance: $85
- Streaming services: $45
- Restaurants: $220
- Gym: $35
- Student loans: $180
- Gas: $120

TARGET: 50% needs ($1,312) | 30% wants ($787) | 20% savings ($525)`,
        displayStyle: 'code'
      },
      successFeedback: 'BUDGET ANALYZED: Total expenses $2,345. No savings allocated. Red flag detected.'
    },
    choices: [{
      choiceId: 'sim1_continue',
      text: "I see the problem. She's not saving anything.",
      nextNodeId: 'quinn_sim1_diagnosis',
      pattern: 'analytical',
      skills: ['financialLiteracy', 'criticalThinking']
    }],
    tags: ['simulation', 'finance', 'phase1']
  },

  {
    nodeId: 'quinn_sim1_diagnosis',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Exactly. $2,345 spent. Zero saved. Most people would say 'she's doing fine—she's not in debt.'\n\nBut here's what I see: one car repair away from a credit card spiral. No emergency fund. No retirement. No financial breathing room.\n\nThe invisible crisis. What would you tell her to cut?",
      emotion: 'serious',
      variation_id: 'sim1_diagnosis_v1'
    }],
    choices: [
      {
        choiceId: 'sim1_cut_wants',
        text: "Cut the 'wants': streaming, restaurants, gym. That's $300 right there.",
        nextNodeId: 'quinn_sim1_success',
        pattern: 'analytical',
        skills: ['financialLiteracy', 'prioritization']
      },
      {
        choiceId: 'sim1_cut_needs',
        text: "She needs a cheaper apartment. $950 is 36% of income—too high.",
        nextNodeId: 'quinn_sim1_partial',
        pattern: 'building',
        skills: ['strategicThinking']
      },
      {
        choiceId: 'sim1_increase_income',
        text: "Don't cut anything. Help her increase income instead.",
        nextNodeId: 'quinn_sim1_partial',
        pattern: 'building',
        skills: ['entrepreneurship']
      }
    ],
    tags: ['simulation', 'finance', 'phase1']
  },

  {
    nodeId: 'quinn_sim1_success',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Good call. The low-hanging fruit.\n\nStreaming: Keep one, cut three. Save $30.\nRestaurants: Half as often. Save $110.\nGym: Planet Fitness is $10. Save $25.\n\n$165/month saved. Not the full 20%, but it's a start. And here's the key—she still gets to live.\n\nFinancial advice that makes you miserable doesn't stick. You have to find the balance.\n\nThat's lesson one: small changes compound. $165/month is $2,000/year. In 5 years, with modest returns, that's $11,000. Her first emergency fund.\n\nNot bad for cutting two streaming services.",
      emotion: 'proud_teaching',
      interaction: 'nod',
      variation_id: 'sim1_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'sim1_complete',
      text: "Small changes compound. I get it.",
      nextNodeId: 'quinn_hub_return',
      pattern: 'analytical',
      skills: ['financialLiteracy']
    }],
    onEnter: [{
      characterId: 'quinn',
      addKnowledgeFlags: ['quinn_sim1_complete']
    }],
    tags: ['simulation', 'finance', 'phase1', 'success']
  },

  {
    nodeId: 'quinn_sim1_partial',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Not wrong, but harder to execute.\n\nMoving costs money. New apartment, deposit, movers—$2,000 upfront she doesn't have. And income growth takes time.\n\nI teach people to start with what they can control today. Cut the streaming services. Skip restaurants twice a month. That's $165 saved immediately.\n\nSmall wins build momentum. Once she has $1,000 saved, then we talk about the bigger moves.\n\nFinance isn't just math. It's psychology. You have to meet people where they are.",
      emotion: 'patient_teaching',
      variation_id: 'sim1_partial_v1'
    }],
    choices: [{
      choiceId: 'sim1_partial_complete',
      text: "Meet them where they are. Got it.",
      nextNodeId: 'quinn_hub_return',
      pattern: 'helping',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [{
      characterId: 'quinn',
      addKnowledgeFlags: ['quinn_sim1_partial']
    }],
    tags: ['simulation', 'finance', 'phase1', 'partial']
  },

  // ============= SIMULATION 2: INVESTMENT ALLOCATION =============
  {
    nodeId: 'quinn_sim2_portfolio_intro',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Alright. Next level. You've got $10,000 to invest. First time.\n\nMost people freeze here. Too many choices. Too much jargon. FOMO from crypto bros. Fear from the last crash.\n\nBut investing isn't gambling—it's calculated risk. Let me show you how I think about allocation.\n\nAge: 28. Time horizon: 30+ years to retirement. Risk tolerance: moderate.\n\nHow would you split it?",
      emotion: 'teaching',
      variation_id: 'sim2_intro_v1'
    }],
    simulation: {
      phase: 2,
      difficulty: 'application',
      variantId: 'quinn_portfolio_phase2',
      timeLimit: 120,
      type: 'dashboard_triage',
      title: 'Portfolio Allocation',
      taskDescription: 'Allocate $10,000 across asset classes. Balance growth potential vs risk for a 30-year horizon.',
      initialContext: {
        label: 'Investment Options',
        content: `TOTAL: $10,000
TIME HORIZON: 30 years
RISK TOLERANCE: Moderate

OPTIONS:
1. S&P 500 Index (Stocks) - High growth, high volatility
2. Bond Index - Low growth, low volatility
3. Real Estate (REITs) - Moderate growth, moderate risk
4. International Stocks - High growth, currency risk
5. Cash/Savings - No growth, no risk

CLASSIC ALLOCATION (Age 28):
- 70-80% stocks
- 20-30% bonds
- 0-10% alternatives`,
        displayStyle: 'text'
      },
      successFeedback: 'ALLOCATION SUBMITTED: Reviewing risk profile...'
    },
    choices: [{
      choiceId: 'sim2_continue',
      text: "70% stocks, 20% bonds, 10% REITs. Diversified growth.",
      nextNodeId: 'quinn_sim2_analysis',
      pattern: 'analytical',
      skills: ['financialLiteracy', 'riskManagement']
    }],
    requiredState: {
      hasKnowledgeFlags: ['quinn_sim1_complete', 'quinn_sim1_partial']
    },
    tags: ['simulation', 'finance', 'phase2']
  },

  {
    nodeId: 'quinn_sim2_analysis',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Solid. Textbook, even. 70/20/10 is what most advisors would recommend at 28.\n\nBut here's what they don't tell you: that allocation assumes you can stomach a 40% drop and not panic-sell.\n\n2008: Down 37%. 2020: Down 34%. 2022: Down 18%.\n\nCan you watch $10K become $6K and not touch it? Most people can't. They sell at the bottom, lock in losses, miss the recovery.\n\nSo I ask differently: what allocation lets you sleep at night? Because the best portfolio is the one you don't abandon.\n\nWould you adjust knowing that?",
      emotion: 'challenging',
      variation_id: 'sim2_analysis_v1'
    }],
    choices: [
      {
        choiceId: 'sim2_stay_course',
        text: "I'd stay the course. Volatility is the price of growth.",
        nextNodeId: 'quinn_sim2_success',
        pattern: 'patience',
        skills: ['resilience', 'discipline']
      },
      {
        choiceId: 'sim2_more_conservative',
        text: "Shift to 50/40/10. Sleep better, grow slower.",
        nextNodeId: 'quinn_sim2_partial',
        pattern: 'patience',
        skills: ['selfAwareness']
      },
      {
        choiceId: 'sim2_timing',
        text: "What if I wait for the next dip to invest?",
        nextNodeId: 'quinn_sim2_fail',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['simulation', 'finance', 'phase2']
  },

  {
    nodeId: 'quinn_sim2_success',
    speaker: 'Quinn Almeida',
    content: [{
      text: "That's the mindset. Volatility is the price you pay for growth.\n\n$10K at 8% average returns for 30 years? $100K. That's the power of compound interest and staying invested.\n\nMost people trade that away chasing hot stocks or panic-selling in crashes. You just committed to not being most people.\n\nLesson two: time in the market beats timing the market. Every. Single. Time.\n\nWelcome to the long game.",
      emotion: 'proud',
      interaction: 'nod',
      variation_id: 'sim2_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'sim2_complete',
      text: "Time in the market. Got it.",
      nextNodeId: 'quinn_hub_return',
      pattern: 'patience',
      skills: ['discipline']
    }],
    onEnter: [{
      characterId: 'quinn',
      addKnowledgeFlags: ['quinn_sim2_complete']
    }],
    tags: ['simulation', 'finance', 'phase2', 'success']
  },

  {
    nodeId: 'quinn_sim2_partial',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Honest answer. I respect that.\n\n50/40/10 still grows—just slower. $10K at 6% for 30 years? $57K instead of $100K.\n\nYou're trading $43K for peace of mind. Some people say that's a bad trade. I say it depends on whether that peace lets you stay invested.\n\nA conservative portfolio you stick with beats an aggressive portfolio you abandon.\n\nKnow yourself. That's half the battle.",
      emotion: 'understanding',
      variation_id: 'sim2_partial_v1'
    }],
    choices: [{
      choiceId: 'sim2_partial_complete',
      text: "Know yourself. That's the lesson.",
      nextNodeId: 'quinn_hub_return',
      pattern: 'helping',
      skills: ['selfAwareness']
    }],
    onEnter: [{
      characterId: 'quinn',
      addKnowledgeFlags: ['quinn_sim2_partial']
    }],
    tags: ['simulation', 'finance', 'phase2', 'partial']
  },

  {
    nodeId: 'quinn_sim2_fail',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Market timing. The dream that kills portfolios.\n\nHere's the data: Missing the 10 best days in the market over 30 years cuts your returns in half. And those best days? Often happen right after the worst days.\n\nYou can't predict them. Nobody can. The people who try miss the recovery waiting for the perfect entry.\n\n'Time in beats timing.' That's not a slogan—it's math.\n\nWant to try that allocation again?",
      emotion: 'firm_teaching',
      variation_id: 'sim2_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'sim2_retry',
      text: "You're right. I'll stay invested through the volatility.",
      nextNodeId: 'quinn_sim2_success',
      pattern: 'patience',
      skills: ['learningAgility']
    }],
    tags: ['simulation', 'finance', 'phase2', 'failure']
  },

  // ============= SIMULATION 3: ETHICAL INVESTMENT DILEMMA =============
  {
    nodeId: 'quinn_sim3_ethics_intro',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Final scenario. This one's harder. No right answer.\n\nYou're managing a $2M portfolio for a nonprofit focused on youth education in Birmingham.\n\nYou find an investment opportunity: defense contractor. 18% annual returns. Stable. Ethical concerns.\n\nThat $2M becomes $2.36M in year one. Extra $360K for scholarships. Real kids. Real futures.\n\nBut it's weapons manufacturing. Some of those weapons go to conflicts you don't support.\n\nDo you invest?",
      emotion: 'serious',
      variation_id: 'sim3_intro_v1'
    }],
    simulation: {
      phase: 3,
      difficulty: 'mastery',
      variantId: 'quinn_ethics_phase3',
      timeLimit: 90,
      successThreshold: 85,
      type: 'chat_negotiation',
      title: 'Values vs Returns: The Ethical Investor',
      taskDescription: 'A defense contractor offers 18% returns for a youth education nonprofit. High returns fund scholarships. But the source conflicts with values. What do you do?',
      initialContext: {
        label: 'Investment Proposal',
        content: `OPPORTUNITY: Defense Contractor Stock
PROJECTED RETURN: 18% annually
PORTFOLIO SIZE: $2M
POTENTIAL IMPACT: $360K/year → 36 full scholarships

CONCERNS:
- Weapons manufacturing
- Contracts with controversial regimes
- Misalignment with nonprofit mission

ALTERNATIVES:
- S&P 500: 10% average (lower returns, neutral ethics)
- ESG Funds: 8% average (lower returns, aligned values)
- Impact Investing: 6% average (lower returns, direct mission alignment)`,
        displayStyle: 'text'
      },
      successFeedback: 'DECISION LOGGED: This is the hard part of fiduciary duty.'
    },
    requiredState: {
      hasKnowledgeFlags: ['quinn_sim2_complete', 'quinn_sim2_partial']
    },
    choices: [
      {
        choiceId: 'sim3_invest',
        text: "Invest. 36 more kids get scholarships. The ends justify the means.",
        nextNodeId: 'quinn_sim3_pragmatic',
        pattern: 'analytical',
        skills: ['pragmatism', 'utilitarian']
      },
      {
        choiceId: 'sim3_decline',
        text: "Decline. You can't fund education with weapons money.",
        nextNodeId: 'quinn_sim3_principled',
        pattern: 'helping',
        skills: ['integrity', 'values']
      },
      {
        choiceId: 'sim3_third_way',
        text: "Find a middle ground. ESG funds at 8% still fund 16 scholarships.",
        nextNodeId: 'quinn_sim3_balanced',
        pattern: 'patience',
        skills: ['criticalThinking', 'negotiation']
      }
    ],
    tags: ['simulation', 'finance', 'phase3', 'ethics']
  },

  {
    nodeId: 'quinn_sim3_pragmatic',
    speaker: 'Quinn Almeida',
    content: [{
      text: "The utilitarian play. Greatest good for the greatest number.\n\n36 kids who wouldn't have gone to college, now do. Some become teachers, nurses, engineers. Compound impact over generations.\n\nBut here's what happens: word gets out. Donors ask questions. 'We're funding scholarships with defense money?' Some pull support. Board members resign.\n\nYou gained $360K in returns. You lose $500K in donations.\n\nAnd the mission? Compromised. The kids you're helping now learn that ethics bend when the numbers are good enough.\n\nWhat did you really win?",
      emotion: 'challenging',
      variation_id: 'sim3_pragmatic_v1',
      richEffectContext: 'warning'
    }],
    choices: [{
      choiceId: 'sim3_prag_reflect',
      text: "I see it now. Short-term gains, long-term cost.",
      nextNodeId: 'quinn_sim3_lesson',
      pattern: 'analytical',
      skills: ['systemsThinking']
    }],
    tags: ['simulation', 'finance', 'phase3']
  },

  {
    nodeId: 'quinn_sim3_principled',
    speaker: 'Quinn Almeida',
    content: [{
      text: "The values play. Clean hands matter more than full coffers.\n\nYou decline. Invest in ESG funds instead. 8% returns, not 18%. That's 16 scholarships, not 36.\n\n20 kids don't get funding this year. You have to call their families. Explain why they didn't make the cut.\n\nBut the nonprofit's integrity stays intact. Donors keep giving. The mission stays clear.\n\nHere's the hard part: those 20 kids? They're real. Their futures mattered too.\n\nValues aren't free. Someone always pays.",
      emotion: 'somber',
      variation_id: 'sim3_principled_v1'
    }],
    choices: [{
      choiceId: 'sim3_prin_reflect',
      text: "Someone always pays. That's the weight of it.",
      nextNodeId: 'quinn_sim3_lesson',
      pattern: 'helping',
      skills: ['emotionalIntelligence']
    }],
    tags: ['simulation', 'finance', 'phase3']
  },

  {
    nodeId: 'quinn_sim3_balanced',
    speaker: 'Quinn Almeida',
    content: [{
      text: "The middle path. Harder to walk, but often the right one.\n\n8% ESG returns fund 16 scholarships. Not as many as 36. More than 0.\n\nYou call donors: 'We're prioritizing aligned investments.' They respect it. Some increase giving to close the gap.\n\nThe 20 kids who didn't get funding? You build a waitlist. Launch a separate campaign. Raise $200K in new donations from people who care about ethical investing.\n\nNet result: 26 scholarships funded. Not 36, but close. And you built something sustainable.\n\nLesson three: the best financial decisions serve both values AND value. When you can't have both, get creative.\n\nThat's what separates good investors from great ones.",
      emotion: 'proud_wise',
      interaction: 'bloom',
      variation_id: 'sim3_balanced_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'sim3_balanced_complete',
      text: "Values AND value. That's the real skill.",
      nextNodeId: 'quinn_sim3_lesson',
      pattern: 'building',
      skills: ['creativity', 'strategicThinking']
    }],
    onEnter: [{
      characterId: 'quinn',
      trustChange: 2,
      addKnowledgeFlags: ['quinn_sim3_complete']
    }],
    tags: ['simulation', 'finance', 'phase3', 'success']
  },

  {
    nodeId: 'quinn_sim3_lesson',
    speaker: 'Quinn Almeida',
    content: [{
      text: "Finance isn't just math. It's philosophy. Every allocation is a statement about what you value.\n\nMost people don't realize they're making ethical choices when they invest. They think they're just 'maximizing returns.'\n\nBut you can't separate money from meaning. Every dollar you invest votes for the kind of world you want.\n\nThat's why I came back to Birmingham. Not to make more money. To make money mean something.\n\nYou get it now?",
      emotion: 'earnest',
      variation_id: 'sim3_lesson_v1'
    }],
    choices: [{
      choiceId: 'sim3_complete',
      text: "Money votes for the world you want. I get it.",
      nextNodeId: 'quinn_hub_return',
      pattern: 'helping',
      skills: ['values', 'purpose']
    }],
    onEnter: [{
      characterId: 'quinn',
      addKnowledgeFlags: ['quinn_all_sims_complete']
    }],
    tags: ['simulation', 'finance', 'phase3', 'mastery']
  },

  {
    nodeId: 'quinn_hub_return',
    speaker: 'quinn',
    content: [{
      text: "Thanks. I'm working on it.\\n\\nLet's keep looking at the numbers, but... differently.",
      emotion: 'determined',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['terminal']
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'quinn_trust_recovery',
    speaker: 'Quinn Almeida',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[He's holding a spreadsheet. Red numbers everywhere.]\n\nYou came back.\n\nThe ROI on that decision is... questionable.\n\n[He sets it down. Tries to smile. Can't quite.]\n\nI've calculated risk my whole life. Assessed value. Maximized returns.\n\nBut I couldn't calculate how to not lose you when it mattered.\n\nTurns out some things can't be optimized.",
      emotion: 'regretful',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[He's holding a spreadsheet. Red numbers everywhere.]\n\nYou came back.\n\nYou gave me time to recalculate. I appreciate that.\n\nThe ROI on that decision is... questionable.\n\n[He sets it down. Tries to smile. Can't quite.]\n\nI've calculated risk my whole life. Assessed value. Maximized returns.\n\nBut I couldn't calculate how to not lose you when it mattered. Turns out some things can't be optimized.",
        helping: "[He's holding a spreadsheet. Red numbers everywhere.]\n\nYou came back.\n\nEven after I treated you like a line item instead of a person.\n\nThe ROI on that decision is... questionable.\n\n[He sets it down. Tries to smile. Can't quite.]\n\nI've calculated risk my whole life. Assessed value. Maximized returns.\n\nBut I couldn't calculate how to not lose you when it mattered. Turns out some things can't be optimized.",
        analytical: "[He's holding a spreadsheet. Red numbers everywhere.]\n\nYou came back.\n\nYou reassessed the variables. Made a different calculation.\n\nThe ROI on that decision is... questionable.\n\n[He sets it down. Tries to smile. Can't quite.]\n\nI've calculated risk my whole life. Assessed value. Maximized returns.\n\nBut I couldn't calculate how to not lose you when it mattered. Turns out some things can't be optimized.",
        building: "[He's holding a spreadsheet. Red numbers everywhere.]\n\nYou came back.\n\nRebuilding from negative equity. Brave.\n\nThe ROI on that decision is... questionable.\n\n[He sets it down. Tries to smile. Can't quite.]\n\nI've calculated risk my whole life. Assessed value. Maximized returns.\n\nBut I couldn't calculate how to not lose you when it mattered. Turns out some things can't be optimized.",
        exploring: "[He's holding a spreadsheet. Red numbers everywhere.]\n\nYou came back.\n\nStill curious even after I tried to quantify everything.\n\nThe ROI on that decision is... questionable.\n\n[He sets it down. Tries to smile. Can't quite.]\n\nI've calculated risk my whole life. Assessed value. Maximized returns.\n\nBut I couldn't calculate how to not lose you when it mattered. Turns out some things can't be optimized."
      }
    }],
    choices: [
      {
        choiceId: 'quinn_recovery_human',
        text: "I'm not an investment. I'm a person.",
        nextNodeId: 'quinn_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 2,
          addKnowledgeFlags: ['quinn_trust_repaired']
        },
        voiceVariations: {
          patience: "Take a breath. I'm not an investment. I'm a person.",
          helping: "I'm not an investment. I'm a person. And people can't be optimized.",
          analytical: "You're modeling the wrong system. I'm not an investment. I'm a person.",
          building: "Stop calculating. I'm not an investment. I'm a person.",
          exploring: "You're looking at the wrong metrics. I'm not an investment. I'm a person."
        }
      },
      {
        choiceId: 'quinn_recovery_worth',
        text: "Some returns can't be measured in dollars.",
        nextNodeId: 'quinn_trust_restored',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'quinn',
          trustChange: 2,
          addKnowledgeFlags: ['quinn_trust_repaired']
        },
        voiceVariations: {
          patience: "Give it time. Some returns can't be measured in dollars.",
          helping: "Some returns can't be measured in dollars. Like this. Right here.",
          analytical: "Expand your metrics. Some returns can't be measured in dollars.",
          building: "Build different measures. Some returns can't be measured in dollars.",
          exploring: "Look beyond the spreadsheet. Some returns can't be measured in dollars."
        }
      }
    ],
    tags: ['trust_recovery', 'quinn_arc']
  },

  {
    nodeId: 'quinn_trust_restored',
    speaker: 'Quinn Almeida',
    content: [{
      text: "[He crumples the spreadsheet. Laughs.]\n\nYou're right.\n\nI made millions optimizing systems. Squeezing efficiency. Finding alpha.\n\nAnd then I came home to Birmingham with nothing but money and regret.\n\n[He looks at you.]\n\nYou... you're teaching me a different kind of value. One that doesn't compound quarterly.\n\nThank you for that. And I'm sorry I forgot it.",
      emotion: 'grateful_humbled',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[He crumples the spreadsheet. Laughs.]\n\nYou're right.\n\nYou waited for me to figure it out. That patience is... it's an asset I never learned to value.\n\nI made millions optimizing systems. Squeezing efficiency. Finding alpha.\n\nAnd then I came home to Birmingham with nothing but money and regret.\n\n[He looks at you.]\n\nYou're teaching me a different kind of value. Thank you. I'm sorry I forgot it.",
        helping: "[He crumples the spreadsheet. Laughs.]\n\nYou're right.\n\nYou care about me as a person, not a portfolio. That's... that's rare.\n\nI made millions optimizing systems. Squeezing efficiency. Finding alpha.\n\nAnd then I came home to Birmingham with nothing but money and regret.\n\n[He looks at you.]\n\nYou're teaching me a different kind of value. Thank you. I'm sorry I forgot it.",
        analytical: "[He crumples the spreadsheet. Laughs.]\n\nYou're right.\n\nYou see what the models miss. That's intelligence my algorithms never captured.\n\nI made millions optimizing systems. Squeezing efficiency. Finding alpha.\n\nAnd then I came home to Birmingham with nothing but money and regret.\n\n[He looks at you.]\n\nYou're teaching me a different kind of value. Thank you. I'm sorry I forgot it.",
        building: "[He crumples the spreadsheet. Laughs.]\n\nYou're right.\n\nYou're building something that can't be traded or leveraged. That's real wealth.\n\nI made millions optimizing systems. Squeezing efficiency. Finding alpha.\n\nAnd then I came home to Birmingham with nothing but money and regret.\n\n[He looks at you.]\n\nYou're teaching me a different kind of value. Thank you. I'm sorry I forgot it.",
        exploring: "[He crumples the spreadsheet. Laughs.]\n\nYou're right.\n\nYou explored beyond my spreadsheets. Found value I couldn't measure.\n\nI made millions optimizing systems. Squeezing efficiency. Finding alpha.\n\nAnd then I came home to Birmingham with nothing but money and regret.\n\n[He looks at you.]\n\nYou're teaching me a different kind of value. Thank you. I'm sorry I forgot it."
      }
    }],
    choices: [{
      choiceId: 'quinn_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'quinn_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'quinn_arc'],
    onEnter: [{
      characterId: 'quinn',
      addKnowledgeFlags: ['quinn_trust_recovery_completed']
    }]
  },

  // ═══════════════════════════════════════════════════════════════
  // SKILL COMBO UNLOCK - Financial Mentor
  // ═══════════════════════════════════════════════════════════════
  {
    nodeId: 'quinn_wealth_wisdom',
    requiredState: {
      requiredCombos: ['financial_mentor']
    },
    speaker: 'Quinn Almeida',
    content: [{
      text: "You know what makes a real mentor in finance?\n\nIt's not the biggest portfolio or the fastest trades. It's knowing that wealth without relationships is just numbers on a screen. And that relationships without wisdom become codependency.\n\nA financial mentor has to see both—the math AND the person. Financial literacy opens the door. But emotional intelligence teaches you when to stop knocking.",
      emotion: 'sincere',
      variation_id: 'wealth_wisdom_v1'
    }],
    choices: [
      {
        choiceId: 'quinn_mentor_apply',
        text: "How do you balance both in advising others?",
        nextNodeId: 'quinn_mentor_balance',
        pattern: 'helping',
        skills: ['financialLiteracy', 'emotionalIntelligence'],
        consequence: {
          characterId: 'quinn',
          trustChange: 1
        }
      },
      {
        choiceId: 'quinn_mentor_teach',
        text: "That's what you're doing here, isn't it?",
        nextNodeId: 'quinn_mentor_action',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['skill_combo_unlock', 'financial_mentor', 'quinn_wisdom']
  },

  // ═══════════════════════════════════════════════════════════════
  // STUB NODES - Fix broken navigation
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'quinn_applying_wisdom',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Applying wisdom to finance means knowing when NOT to optimize.\n\nI had a client once—solid business, good margins, ready to scale. Every metric said 'grow fast.' But when I talked to the owner, she was already working seventy-hour weeks. Scaling would have broken her.\n\nSome returns aren't worth what they cost. The spreadsheet doesn't show burnout, family strain, or losing yourself in the numbers.",
      emotion: 'thoughtful',
      variation_id: 'quinn_applying_wisdom_v1'
    }],
    choices: [
      { choiceId: 'wisdom_measure', text: "How do you measure what doesn't show on spreadsheets?", nextNodeId: 'quinn_evaluation_method', pattern: 'analytical' },
      { choiceId: 'wisdom_clients', text: "Do clients listen when you tell them to slow down?", nextNodeId: 'quinn_fewer_deals', pattern: 'patience' },
      { choiceId: 'wisdom_learn', text: "How did you learn to see beyond the numbers?", nextNodeId: 'quinn_grandma_lesson', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'quinn_back_birmingham',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Coming back to Birmingham wasn't retreat. It was strategy.\n\nWall Street had everything—money, prestige, access. But I was optimizing someone else's game. Moving numbers for people who already had more than they needed.\n\nThis is where I can make real change. Where the money I move actually reaches people. Where I know the names of the founders I fund and the neighborhoods my investments affect.",
      emotion: 'determined',
      variation_id: 'quinn_back_birmingham_v1'
    }],
    choices: [
      { choiceId: 'birmingham_difference', text: "What's different about working here?", nextNodeId: 'quinn_current_work', pattern: 'exploring' },
      { choiceId: 'birmingham_sacrifice', text: "Did you sacrifice anything to come back?", nextNodeId: 'quinn_loneliness', pattern: 'helping' },
      { choiceId: 'birmingham_roots', text: "Tell me about your roots here.", nextNodeId: 'quinn_titusville_history', pattern: 'patience' }
    ]
  },

  {
    nodeId: 'quinn_build_different',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Building something different in finance means questioning every assumption.\n\nWhy do we measure success by AUM? Why does due diligence take six months for a $50K investment but six weeks for a $50M one? Why do the people with the least capital face the highest interest rates?\n\nUsually 'that's how it works' means 'that's how it profits the people who built it.' Usually it doesn't have to work that way.",
      emotion: 'passionate',
      variation_id: 'quinn_build_different_v1'
    }],
    choices: [
      { choiceId: 'different_change', text: "What are you changing specifically?", nextNodeId: 'quinn_social_enterprise', pattern: 'building' },
      { choiceId: 'different_resist', text: "Does the industry resist your approach?", nextNodeId: 'quinn_change_inside', pattern: 'patience' },
      { choiceId: 'different_examples', text: "What assumptions have you overturned?", nextNodeId: 'quinn_both_example', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'quinn_change_inside',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Change from inside is slower but deeper.\n\nI used to think you had to burn down the system to fix it. Revolutionary thinking. But revolutions mostly replace one power structure with another.\n\nNow I earn trust before I challenge assumptions. Learn the language before I critique the grammar. It's slower, but when change happens this way, it sticks.",
      emotion: 'knowing',
      variation_id: 'quinn_change_inside_v1'
    }],
    choices: [
      { choiceId: 'inside_trust', text: "How do you earn trust in finance?", nextNodeId: 'quinn_current_work', pattern: 'building' },
      { choiceId: 'inside_patience', text: "How do you stay patient with slow change?", nextNodeId: 'quinn_meaningful_work', pattern: 'patience' },
      { choiceId: 'inside_examples', text: "What change have you achieved this way?", nextNodeId: 'quinn_workshops', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'quinn_conscience_answer',
    speaker: 'Quinn Rivera',
    content: [{
      text: "My conscience? It's loud. Probably too loud.\n\nEvery deal, every recommendation—I hear it asking 'who does this really help?' Not just the pitch deck version of help. The real downstream effects. Will this create jobs or cut them? Build wealth locally or extract it?\n\nSome nights I lie awake running the numbers again. Wondering if I missed something. If my analysis has gaps that hurt people.",
      emotion: 'vulnerable',
      variation_id: 'quinn_conscience_answer_v1'
    }],
    choices: [
      { choiceId: 'conscience_cope', text: "How do you cope with that weight?", nextNodeId: 'quinn_loneliness', pattern: 'helping' },
      { choiceId: 'conscience_certain', text: "Can you ever be certain you're doing good?", nextNodeId: 'quinn_economy_prediction', pattern: 'analytical' },
      { choiceId: 'conscience_ignore', text: "Have you ever ignored your conscience?", nextNodeId: 'quinn_self_forgiveness', pattern: 'patience' }
    ]
  },

  {
    nodeId: 'quinn_economy_prediction',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Predicting the economy? Anyone who claims certainty is selling something.\n\nI've watched Nobel laureates get blindsided by crises. I've seen confident forecasts become punchlines. The economy is billions of people making trillions of decisions—no model captures that.\n\nI deal in probabilities and humility. Best case, worst case, likely case. Range of outcomes, not point predictions. And always, always acknowledging what I don't know.",
      emotion: 'honest',
      variation_id: 'quinn_economy_prediction_v1'
    }],
    choices: [
      { choiceId: 'predict_decide', text: "How do you make decisions with so much uncertainty?", nextNodeId: 'quinn_evaluation_method', pattern: 'analytical' },
      { choiceId: 'predict_clients', text: "Do clients want more certainty than you can give?", nextNodeId: 'quinn_teach_approach', pattern: 'helping' },
      { choiceId: 'predict_prepare', text: "How do you prepare for what you can't predict?", nextNodeId: 'quinn_sustainability_lesson', pattern: 'building' }
    ]
  },

  {
    nodeId: 'quinn_founder_types',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Three types of founders cross my desk.\n\nDreamers who can't execute—beautiful visions, no path to reality. Executors who can't dream—efficient machines building something nobody needs. And the rare ones who do both: see the possibility AND map the path to reach it.\n\nI fund the third. They're hard to find. But when you do, they change everything.",
      emotion: 'knowing',
      variation_id: 'quinn_founder_types_v1'
    }],
    choices: [
      { choiceId: 'founder_spot', text: "How do you spot the rare ones?", nextNodeId: 'quinn_person_criteria', pattern: 'analytical' },
      { choiceId: 'founder_help', text: "Can you help dreamers become executors?", nextNodeId: 'quinn_workshops', pattern: 'helping' },
      { choiceId: 'founder_example', text: "Tell me about one of them.", nextNodeId: 'quinn_both_example', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'quinn_happiness_research',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Happiness research says money matters until it doesn't.\n\nUp to a point—about $75K in most studies—more money means less stress, better health, real improvement. But past that point? Diminishing returns. What matters then is relationships, purpose, growth.\n\nFinance mostly ignores this. We optimize for wealth accumulation without asking what it's for. Help people retire with millions they're too burnt out to enjoy.",
      emotion: 'thoughtful',
      variation_id: 'quinn_happiness_research_v1'
    }],
    choices: [
      { choiceId: 'happiness_clients', text: "Do you talk to clients about this?", nextNodeId: 'quinn_teach_approach', pattern: 'helping' },
      { choiceId: 'happiness_change', text: "How should finance change?", nextNodeId: 'quinn_build_different', pattern: 'building' },
      { choiceId: 'happiness_you', text: "Has this shaped your own choices?", nextNodeId: 'quinn_back_birmingham', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'quinn_harder_investing',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Ethical investing is harder. Full stop.\n\nMore due diligence—you can't just check financials, you need to understand supply chains, labor practices, environmental impact. More saying no—profitable opportunities that fail values tests. More complexity—navigating tradeoffs between different goods.\n\nBut that's not an excuse to avoid it. 'It's hard' has never been a reason to stop doing what's right.",
      emotion: 'firm',
      variation_id: 'quinn_harder_investing_v1'
    }],
    choices: [
      { choiceId: 'harder_method', text: "How do you evaluate ethics alongside returns?", nextNodeId: 'quinn_evaluation_method', pattern: 'analytical' },
      { choiceId: 'harder_tradeoff', text: "What's the hardest tradeoff you've faced?", nextNodeId: 'quinn_conscience_answer', pattern: 'patience' },
      { choiceId: 'harder_worth', text: "Is it worth the extra effort?", nextNodeId: 'quinn_meaningful_work', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'quinn_heavy_living',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Living with financial knowledge is heavy.\n\nI see the systems most people don't. The way interest compounds against the poor. The hidden fees that drain working-class savings. The tax structures that let wealth shelter itself while labor gets taxed at every turn.\n\nI used to think knowledge was neutral. Now I know it's a weight. Can't unsee it. Can't unlearn what the numbers really mean.",
      emotion: 'serious',
      variation_id: 'quinn_heavy_living_v1'
    }],
    choices: [
      { choiceId: 'heavy_share', text: "Why do you share this knowledge?", nextNodeId: 'quinn_teaching_offer', pattern: 'helping' },
      { choiceId: 'heavy_change', text: "Can knowledge alone change things?", nextNodeId: 'quinn_system_excuse', pattern: 'building' },
      { choiceId: 'heavy_cope', text: "How do you carry that weight?", nextNodeId: 'quinn_loneliness', pattern: 'patience' }
    ]
  },
  {
    nodeId: 'quinn_lonely_now_answer',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Lonely? Sometimes. More often than I admit.\n\nThis path isn't crowded. Most people in finance either don't see the problems or choose not to look. The ones who do see often burn out or sell out.\n\nBut I'd rather be lonely and right than popular and complicit. At least when I look at myself in the mirror, I know whose side I'm on.",
      emotion: 'honest',
      variation_id: 'quinn_lonely_now_answer_v1'
    }],
    choices: [
      { choiceId: 'lonely_others', text: "Are there others doing this work?", nextNodeId: 'quinn_marcus_relationship', pattern: 'exploring' },
      { choiceId: 'lonely_sustain', text: "How do you sustain yourself?", nextNodeId: 'quinn_meaningful_work', pattern: 'helping' },
      { choiceId: 'lonely_worth', text: "Is the isolation worth it?", nextNodeId: 'quinn_conscience_answer', pattern: 'patience' }
    ]
  },

  {
    nodeId: 'quinn_marcus_relationship',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Marcus and I see different angles of the same problem.\n\nHe's healing people one at a time. Bedside, hands-on, immediate impact. I'm trying to heal systems—the financial structures that determine who gets care and who doesn't.\n\nWe need both. Individual care without systemic change just puts Band-Aids on bullet wounds. Systemic change without individual care loses the human thread.",
      emotion: 'warm',
      variation_id: 'quinn_marcus_relationship_v1'
    }],
    choices: [
      { choiceId: 'marcus_learn', text: "What have you learned from each other?", nextNodeId: 'quinn_both_challenge', pattern: 'exploring' },
      { choiceId: 'marcus_work', text: "Do you ever work together?", nextNodeId: 'quinn_social_enterprise', pattern: 'building' },
      { choiceId: 'marcus_balance', text: "How do you balance both perspectives?", nextNodeId: 'quinn_applying_wisdom', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'quinn_meaningful_weight',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Meaningful work has weight to it.\n\nLightness is nice. Easy jobs, quick wins, simple problems. But it doesn't build anything that lasts.\n\nThe work that matters—the kind that actually changes systems—it's heavy. It requires showing up when you don't want to. Saying hard things to powerful people. Carrying the knowledge of what the numbers really mean.",
      emotion: 'reflective',
      variation_id: 'quinn_meaningful_weight_v1'
    }],
    choices: [
      { choiceId: 'weight_choose', text: "How do you choose what's worth the weight?", nextNodeId: 'quinn_responsibility', pattern: 'patience' },
      { choiceId: 'weight_carry', text: "How do you carry it without burning out?", nextNodeId: 'quinn_loneliness', pattern: 'helping' },
      { choiceId: 'weight_results', text: "What has all that weight built?", nextNodeId: 'quinn_current_work', pattern: 'building' }
    ]
  },

  {
    nodeId: 'quinn_system_excuse',
    speaker: 'Quinn Rivera',
    content: [{
      text: "The system is an excuse.\n\nPeople built it. People can rebuild it. Every rule that exists was written by someone. Every fee that drains working families was designed by someone. Every loophole that shelters wealth was lobbied for by someone.\n\nSaying 'that's how it works' is a choice. A choice to accept what someone else decided. I don't accept it.",
      emotion: 'passionate',
      variation_id: 'quinn_system_excuse_v1'
    }],
    choices: [
      { choiceId: 'system_rebuild', text: "How do you actually rebuild systems?", nextNodeId: 'quinn_change_inside', pattern: 'building' },
      { choiceId: 'system_possible', text: "Is real change possible?", nextNodeId: 'quinn_back_birmingham', pattern: 'exploring' },
      { choiceId: 'system_start', text: "Where do you start?", nextNodeId: 'quinn_workshops', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'quinn_teach_approach',
    speaker: 'Quinn Rivera',
    content: [{
      text: "My teaching approach? Show people the real numbers. Not the sanitized version.\n\nFinancial literacy programs often teach budgeting tips while ignoring the structural forces that make budgeting impossible. 'Save more' advice to people who don't earn enough to save.\n\nReal numbers change minds. Show people the actual interest they're paying. The actual wealth gap data. The actual difference between how money works for the rich and everyone else. Truth is the curriculum.",
      emotion: 'knowing',
      variation_id: 'quinn_teach_approach_v1'
    }],
    choices: [
      { choiceId: 'teach_react', text: "How do people react to the truth?", nextNodeId: 'quinn_what_changed', pattern: 'exploring' },
      { choiceId: 'teach_action', text: "Does knowledge lead to action?", nextNodeId: 'quinn_system_excuse', pattern: 'building' },
      { choiceId: 'teach_example', text: "Can you show me an example?", nextNodeId: 'quinn_numbers_truth', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'quinn_teaching_offer',
    speaker: 'Quinn Rivera',
    content: [{
      text: "I could teach you more. If you want to learn.\n\nFinancial literacy isn't taught in most schools. Not because it's too complicated—kids can learn it. It's not taught because it's dangerous. Dangerous to the people who profit from confusion.\n\nWhen people understand compound interest, they stop taking predatory loans. When they understand fees, they demand better. Knowledge is power, and some powers don't want to share.",
      emotion: 'serious',
      variation_id: 'quinn_teaching_offer_v1'
    }],
    choices: [
      { choiceId: 'teach_start', text: "Where would we start?", nextNodeId: 'quinn_numbers_truth', pattern: 'exploring' },
      { choiceId: 'teach_dangerous', text: "What makes it dangerous?", nextNodeId: 'quinn_heavy_living', pattern: 'analytical' },
      { choiceId: 'teach_workshops', text: "Do you teach this to others?", nextNodeId: 'quinn_workshops', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'quinn_titusville_history',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Titusville. Where I grew up.\n\nFirst Black neighborhood in Birmingham. History in every street. Civil rights leaders walked these blocks. Businesses thrived here when they couldn't operate downtown. Community was built brick by brick.\n\nThen came redlining. Disinvestment. Capital flight. The same financial systems I now work within hollowed out my community. That's what I'm fighting for. To reverse that flow.",
      emotion: 'proud',
      variation_id: 'quinn_titusville_history_v1'
    }],
    choices: [
      { choiceId: 'titusville_reverse', text: "How do you reverse the flow?", nextNodeId: 'quinn_social_enterprise', pattern: 'building' },
      { choiceId: 'titusville_family', text: "Is your family still there?", nextNodeId: 'quinn_grandma_lesson', pattern: 'helping' },
      { choiceId: 'titusville_working', text: "Is it working?", nextNodeId: 'quinn_current_work', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'quinn_what_changed',
    speaker: 'Quinn Rivera',
    content: [{
      text: "What changed me? Seeing the spreadsheets. The actual numbers.\n\nI was working at a wealth management firm. High net worth clients. One day I pulled the data on where our clients' wealth came from and where it went.\n\nMoney flowing from working neighborhoods into tax shelters. Capital extracted from communities like mine and deposited in offshore accounts. The numbers didn't lie. Wealth flows away from people who need it most.",
      emotion: 'troubled',
      variation_id: 'quinn_what_changed_v1'
    }],
    choices: [
      { choiceId: 'changed_after', text: "What did you do after seeing that?", nextNodeId: 'quinn_back_birmingham', pattern: 'exploring' },
      { choiceId: 'changed_show', text: "Can you show me those patterns?", nextNodeId: 'quinn_numbers_truth', pattern: 'analytical' },
      { choiceId: 'changed_feel', text: "How did it feel to see that?", nextNodeId: 'quinn_conscience_answer', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'quinn_why_understand',
    speaker: 'Quinn Rivera',
    content: [{
      text: "Understanding why matters more than knowing what.\n\nAnyone can memorize financial formulas. What changes when interest rates rise. What happens in a recession. That's surface knowledge.\n\nThe why reveals the system underneath. Why do interest rates affect poor people differently than rich people? Why do recessions hit some neighborhoods harder? The why shows you the architecture of inequality.",
      emotion: 'knowing',
      variation_id: 'quinn_why_understand_v1'
    }],
    choices: [
      { choiceId: 'why_teach', text: "Can you teach me the why?", nextNodeId: 'quinn_teaching_offer', pattern: 'exploring' },
      { choiceId: 'why_use', text: "How do you use that understanding?", nextNodeId: 'quinn_evaluation_method', pattern: 'analytical' },
      { choiceId: 'why_change', text: "Does understanding help change things?", nextNodeId: 'quinn_system_excuse', pattern: 'building' }
    ]
  },

  {
    nodeId: 'quinn_mentor_balance',
    speaker: 'Quinn Rivera',
    content: [{
      text: "I listen more than I advise. That's the first rule.\n\nFinancial numbers are just one language. People speak in hopes and fears too. A founder might say 'I need capital for expansion' when they really mean 'I'm scared of failing my employees.' A family might ask about retirement accounts when they're really worried about being a burden on their kids.\n\nA good mentor translates between both languages. Hears what's said and what's meant.",
      emotion: 'thoughtful',
      variation_id: 'quinn_mentor_balance_v1'
    }],
    choices: [
      { choiceId: 'mentor_learn', text: "How did you learn to hear both?", nextNodeId: 'quinn_grandma_lesson', pattern: 'patience' },
      { choiceId: 'mentor_example', text: "Can you give me an example?", nextNodeId: 'quinn_invest_people', pattern: 'exploring' },
      { choiceId: 'mentor_teach', text: "What do you hope people learn from you?", nextNodeId: 'quinn_teach_approach', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'quinn_mentor_action',
    speaker: 'Quinn Rivera',
    content: [{
      text: "That's exactly what I'm doing. Teaching the numbers, yes. The mechanics of how money works.\n\nBut also showing you that behind every number is a person who deserves respect. A savings account is someone's security. A debt is someone's stress. An investment is someone's dream.\n\nFinance pretends it's about math. It's really about people. The math just helps us see them clearly.",
      emotion: 'confident',
      variation_id: 'quinn_mentor_action_v1'
    }],
    choices: [
      { choiceId: 'action_continue', text: "I want to keep learning.", nextNodeId: 'quinn_teaching_offer', pattern: 'exploring' },
      { choiceId: 'action_apply', text: "How can I apply this?", nextNodeId: 'quinn_applying_wisdom', pattern: 'building' },
      { choiceId: 'action_why', text: "Why does this matter so much to you?", nextNodeId: 'quinn_titusville_history', pattern: 'helping' }
    ]
  }
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
