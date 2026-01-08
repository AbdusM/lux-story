/**
 * Tess's Dialogue Graph
 * The Curator - The B-Side (Independent Music)
 *
 * CHARACTER: Independent Record Shop Owner
 * Core Conflict: Sell the building to developers vs. reinvent to survive
 * Arc: Protecting authentic music culture in an algorithm age
 * Theme: Catcher in the Rye inspired - catching what's real before it falls
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const tessDialogueNodes: DialogueNode[] = [
  // ============= PHASE 1: THE OFFER =============
  {
    nodeId: 'tess_introduction',
    speaker: 'Tess',
    content: [
      {
        text: "The B-Side. Vinyl crates. Concert posters.\n\nPhone rings. Ignore it.\n\nDeveloper again. Third call today.\n\nOffering to buy the building. \"Prime real estate.\" Like it's just square footage.",
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'tess_intro_v2_minimal',
        richEffectContext: 'thinking',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'patience', minLevel: 5, altText: "The B-Side. Vinyl crates. Phone rings. Ignore it.\n\nYou're not rushing me. That's nice. Most people want the quick version.\n\nThat phone. Developer again. Wants to buy the building.", altEmotion: 'grateful' },
          { pattern: 'building', minLevel: 5, altText: "The B-Side. Vinyl crates. Concert posters I designed myself.\n\nYou look like someone who makes things. This whole place. I built it from nothing.\n\nNow developers want to buy it. 'Prime real estate.'", altEmotion: 'conflicted' },
          { pattern: 'exploring', minLevel: 5, altText: "The B-Side. Vinyl crates. Phone rings. Ignore it.\n\nYou're looking around. Good. Most people don't even see what's here.\n\nThat phone. Developer again. Wants to turn this into something... else.", altEmotion: 'curious' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'tess_intro_offer',
        text: "How much are they offering?",
        voiceVariations: {
          analytical: "What's the number? Let's understand the actual math here.",
          helping: "They must be offering a lot to make you this conflicted.",
          building: "Numbers matter. What would it take for you to walk away?",
          exploring: "I'm curious. What does 'enough' look like to a developer?",
          patience: "Take your time. What are they putting on the table?"
        },
        nextNodeId: 'tess_the_offer',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_intro_why_stay',
        text: "You don't want to sell?",
        voiceVariations: {
          analytical: "The rational move would be to take the money. Why aren't you?",
          helping: "There's something here worth more than money, isn't there?",
          building: "You built this. Selling feels like giving away part of yourself.",
          exploring: "What's the story that makes this worth fighting for?",
          patience: "I sense there's more to this than the offer."
        },
        nextNodeId: 'tess_the_shop',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'tess_intro_business',
        text: "How's business?",
        nextNodeId: 'tess_the_numbers',
        pattern: 'building',
        skills: ['criticalThinking', 'adaptability'],
        voiceVariations: {
          analytical: "What do the numbers actually look like?",
          helping: "Is the shop doing okay? You seem stressed.",
          building: "How's business? Is this model sustainable?",
          exploring: "I'm curious. How does a record shop survive these days?",
          patience: "Business must be complicated. How are things really?"
        }
      },
      {
        choiceId: 'tess_intro_listen',
        text: "[Wait. Let her talk.]",
        nextNodeId: 'tess_the_shop',
        pattern: 'patience',
        archetype: 'STAY_SILENT',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'tess_arc']
  },

  {
    nodeId: 'tess_the_offer',
    speaker: 'Tess',
    content: [
      {
        text: "Enough to retire. Buy a condo somewhere warm. Never worry about rent again.\n\nMy accountant thinks I'm insane for even hesitating.",
        emotion: 'conflicted',
        interaction: 'nod',
        variation_id: 'offer_v2_minimal',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "Enough to retire. Buy a condo. Never worry about rent.\n\nYou're running the numbers in your head aren't you? I can see it.\n\nMy accountant thinks I'm insane for hesitating. He's probably right.", altEmotion: 'conflicted' },
          { pattern: 'building', minLevel: 4, altText: "Enough to retire. Never worry about rent again.\n\nBut this place... I built it. You understand that don't you? The difference between a smart deal and something you created.\n\nMy accountant thinks I'm insane for hesitating.", altEmotion: 'vulnerable' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'tess_offer_rational',
        text: "Sounds like a smart deal. What's holding you back?",
        voiceVariations: {
          analytical: "The math works. What variable am I missing?",
          helping: "You could rest. Finally take care of yourself. What's the hesitation?",
          building: "Security vs. purpose. That's a hard calculation.",
          exploring: "There's a story behind the hesitation. What is it?",
          patience: "You've had time to think about this. What keeps surfacing?"
        },
        nextNodeId: 'tess_the_shop',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'tess_offer_emotional',
        text: "Money isn't everything.",
        voiceVariations: {
          analytical: "ROI isn't just financial. What's the intangible value here?",
          helping: "Your heart knows something your accountant doesn't.",
          building: "Some things can't be bought back once they're sold.",
          exploring: "There's a deeper currency at play here, isn't there?",
          patience: "The things that matter most rarely come with a price tag."
        },
        nextNodeId: 'tess_the_shop',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'tess_the_shop',
    speaker: 'Tess',
    content: [
      {
        text: "Started this place twelve years ago. Just me. Two crates. And a dream.\n\nKnow how many artists played their first show here? Before anyone knew their names?\n\nThat kid right there. Now selling out arenas. First gig was in my back room to fifteen people.\n\nThis isn't a store. It's where real gets discovered before the algorithm buries it.",
        emotion: 'passionate',
        interaction: 'bloom',
        variation_id: 'shop_v2_minimal',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "Started this place twelve years ago. Just me. Two crates.\n\nYou build things. You understand what it means to make something from nothing.\n\nThat kid there. Selling out arenas now. First gig was here.", altEmotion: 'proud' },
          { pattern: 'helping', minLevel: 4, altText: "Know how many artists played their first show here? Before anyone knew their names?\n\nYou care about people. I can tell. This place is about giving people a chance.\n\nThat kid right there. Selling out arenas now.", altEmotion: 'passionate' }
        ]
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        thoughtId: 'authentic-discovery'
      }
    ],
    choices: [
      {
        choiceId: 'tess_shop_story',
        text: "Tell me about someone this place changed.",
        nextNodeId: 'tess_customer_moment',
        pattern: 'exploring',
        archetype: 'ASK_FOR_DETAILS',
        skills: ['communication', 'emotionalIntelligence'],
        visibleCondition: {
          patterns: { exploring: { min: 4 } }
        },
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'tess_shop_romantic',
        text: "That matters. But can it pay the bills?",
        nextNodeId: 'tess_the_numbers',
        pattern: 'building',
        archetype: 'CHALLENGE_ASSUMPTION',
        skills: ['criticalThinking', 'communication'],
        visibleCondition: {
          patterns: { building: { min: 3 } }
        }
      },
      {
        choiceId: 'tess_shop_curious',
        text: "What made you start this?",
        voiceVariations: {
          analytical: "Walk me through the decision. What was the catalyst?",
          helping: "Something called you here. What was it?",
          building: "Every creator has an origin story. What's yours?",
          exploring: "I want to understand the moment everything changed.",
          patience: "Take me back to the beginning."
        },
        nextNodeId: 'tess_backstory',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_shop_algorithm',
        text: "Algorithm culture. Everything sounds the same now.",
        nextNodeId: 'tess_phoniness',
        pattern: 'analytical',
        skills: ['criticalThinking', 'culturalCompetence'],
        visibleCondition: {
          patterns: { analytical: { min: 3 } }
        },
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'tess_backstory',
    speaker: 'Tess',
    content: [
      {
        text: "Was working corporate. Marketing. Good salary. Nice apartment.\n\nEvery day felt fake. Selling people things they didn't need with words that didn't mean anything.\n\nThen one night. Small venue. Unknown band. Something real happened in that room.\n\nNext morning I quit. Everyone thought I lost my mind.",
        emotion: 'reflective',
        interaction: 'small',
        variation_id: 'backstory_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_backstory_risk',
        text: "That took guts.",
        voiceVariations: {
          analytical: "Statistically, most people wouldn't risk that. You beat the odds.",
          helping: "Following your heart like that. Most people are too scared.",
          building: "Burning it down to build something real. I respect that.",
          exploring: "Chasing the unknown over the comfortable. That's rare.",
          patience: "Sometimes the right path takes years to reveal itself."
        },
        nextNodeId: 'tess_backstory_courage_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_backstory_reality',
        text: "And now?",
        nextNodeId: 'tess_backstory_reality_response',
        pattern: 'patience',
        skills: ['communication'],
        voiceVariations: {
          analytical: "What's the current state of things?",
          helping: "How are you holding up now?",
          building: "What did you build from that decision?",
          exploring: "Where did that journey lead you?",
          patience: "And now?"
        }
      }
    ]
  },

  // ============= DIVERGENT RESPONSES TO BACKSTORY =============
  {
    nodeId: 'tess_backstory_courage_response',
    speaker: 'Tess',
    content: [
      {
        text: "Most people call it reckless. Or lucky. You're the first to call it guts.\n\nMaybe it was both. Reckless enough to jump. Lucky enough to land somewhere that matters.\n\nBut courage... yeah. I'll take that.",
        emotion: 'touched',
        variation_id: 'courage_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_courage',
        text: "[Continue]",
        nextNodeId: 'tess_the_numbers',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'tess_backstory_reality_response',
    speaker: 'Tess',
    content: [
      {
        text: "Now? Now I'm standing in my own shop wondering if I traded one kind of fake for another kind of broke.\n\nAt least when I couldn't sleep in the corporate job, it was because I felt hollow. Now when I can't sleep, it's because I feel everything.\n\nNot sure which is worse. But at least this is mine.",
        emotion: 'wry',
        variation_id: 'reality_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_reality',
        text: "[Continue]",
        nextNodeId: 'tess_the_numbers',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'tess_phoniness',
    speaker: 'Tess',
    content: [
      {
        text: "Exactly. Streaming killed discovery. Everything optimized for engagement. Safe. Predictable.\n\nReal music. The stuff that changes you. It's getting harder to find.\n\nSomeone has to catch it. Before it disappears.\n\nThat's what this place does. Was. Is supposed to.",
        emotion: 'determined',
        interaction: 'shake',
        variation_id: 'phoniness_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_phoniness_fight',
        text: "So fight for it.",
        nextNodeId: 'tess_phoniness_fight_response',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'problemSolving'],
        voiceVariations: {
          analytical: "The math says you need a new strategy. What's the plan?",
          helping: "You clearly care about this. How can I help you fight?",
          building: "So fight for it. Build something they can't ignore.",
          exploring: "There's got to be a way forward. What haven't you tried?",
          patience: "Real things take time to save. What's your next move?"
        }
      },
      {
        choiceId: 'tess_phoniness_how',
        text: "But how? When the numbers don't work?",
        nextNodeId: 'tess_phoniness_how_response',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        voiceVariations: {
          analytical: "But how? When the numbers don't work?",
          helping: "What would it take to make this work? Really?",
          building: "What would you need to build to survive?",
          exploring: "What options haven't you explored yet?",
          patience: "The numbers are one story. What's another way to look at this?"
        }
      }
    ]
  },

  // ============= DIVERGENT RESPONSES TO PHONINESS =============
  {
    nodeId: 'tess_phoniness_fight_response',
    speaker: 'Tess',
    content: [
      {
        text: "Fight for it. Like it's simple.\n\nYou know what? You're right. Everyone tells me to be practical. Be realistic. Take the money.\n\nNo one's said \"fight for it\" in months.\n\nMaybe that's the problem.",
        emotion: 'fierce',
        variation_id: 'fight_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_fight',
        text: "[Continue]",
        nextNodeId: 'tess_the_numbers',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'tess_phoniness_how_response',
    speaker: 'Tess',
    content: [
      {
        text: "That's the question, isn't it? \"How\" is where dreams go to die.\n\nPassion says keep going. Math says sell.\n\nEvery month I solve that equation differently. Some months passion wins. Lately, math's been catching up.",
        emotion: 'tired',
        variation_id: 'how_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_how',
        text: "[Continue]",
        nextNodeId: 'tess_the_numbers',
        pattern: 'patience'
      }
    ]
  },

  // EXPANSION: Customer story
  {
    nodeId: 'tess_customer_moment',
    speaker: 'Tess',
    content: [
      {
        text: "Kid came in last week. Sixteen. Headphones generation.\n\nSaid her mom used to come here. Before she died.\n\nSpent three hours listening. Crying. Finding pieces of her mom in the grooves.\n\nCan't do that on Spotify.",
        emotion: 'moved',
        interaction: 'small',
        variation_id: 'customer_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_customer_to_numbers',
        text: "That's why this matters.",
        nextNodeId: 'tess_the_numbers',
        pattern: 'helping',
        archetype: 'ACKNOWLEDGE_EMOTION',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    tags: ['tess_arc', 'story']
  },

  {
    nodeId: 'tess_the_numbers',
    speaker: 'Tess',
    content: [
      {
        text: "Here's reality. Vinyl sales cover rent. Barely.\n\nShows used to pay the rest. Venues closing everywhere.\n\nLast three months. Red. Red. Red.\n\nDeveloper's offer sits on my desk like a loaded question.",
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'numbers_v1',
        useChatPacing: true,
        // E2-031: Interrupt opportunity when Tess reveals financial vulnerability
        interrupt: {
          duration: 3500,
          type: 'silence',
          action: 'Let the weight of those numbers settle. She needs a witness, not advice.',
          targetNodeId: 'tess_interrupt_acknowledged',
          consequence: {
            characterId: 'tess',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'tess_numbers_fear',
        text: "What scares you most? Selling or staying?",
        nextNodeId: 'tess_real_fear',
        pattern: 'helping',
        archetype: 'ASK_FOR_DETAILS',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'tess_numbers_pivot',
        text: "What if you pivoted? Changed the model?",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'building',
        archetype: 'SHARE_PERSPECTIVE',
        skills: ['problemSolving', 'creativity'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_numbers_accept',
        text: "Sometimes endings aren't failures.",
        nextNodeId: 'tess_decision_cautious_path',
        pattern: 'patience',
        archetype: 'SHARE_PERSPECTIVE',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['tess_arc', 'decision_point']
  },
  {
    nodeId: 'tess_interrupt_acknowledged',
    speaker: 'Tess',
    content: [{
      text: "You didn't jump in with advice. No \"have you tried...\" or \"what if you...\"\n\nEveryone wants to fix it. You just... let it be heavy for a minute.\n\nThat's rare. Most people can't sit with someone else's red ink.",
      emotion: 'grateful',
      microAction: 'She sets down the spreadsheet.',
      variation_id: 'interrupt_v1'
    }],
    choices: [
      {
        choiceId: 'tess_interrupt_continue',
        text: "What do you actually want? Not what makes sense. What do you want?",
        nextNodeId: 'tess_real_fear',
        pattern: 'helping',
        archetype: 'ASK_FOR_DETAILS',
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'tess_arc']
  },

  // EXPANSION: Real fear
  {
    nodeId: 'tess_real_fear',
    speaker: 'Tess',
    content: [
      {
        text: "Selling? I'd survive. Get a condo. Retire early.\n\nStaying? I might fail. Lose everything anyway.\n\nBut the real fear? Becoming what I left corporate for.\n\nPhony. Safe. Optimized.",
        emotion: 'raw',
        interaction: 'shake',
        variation_id: 'fear_v2_minimal',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_fear_to_pitch',
        text: "Then let's find a way that stays real.",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'building',
        archetype: 'OFFER_SUPPORT',
        skills: ['problemSolving', 'emotionalIntelligence']
      }
    ],
    tags: ['tess_arc', 'vulnerability']
  },

  // ============= THE PITCH (Reinvention Scenario) =============
  {
    nodeId: 'tess_the_pitch_setup',
    speaker: 'Tess',
    content: [
      {
        text: "Ideas keep me up at night. But I can't see them clearly.\n\nHelp me think. What's the pitch? What could this place become?\n\nNot just survive. Actually matter again.",
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'pitch_setup_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'Pitch Practice: The Skeptical Investor',
      taskDescription: 'An old friend from your corporate days is considering investing. But she thinks vinyl is dead. Convince her that The B-Side 2.0 is about community, not product.',
      initialContext: {
        label: 'Text Messages: Rachel (Former Colleague)',
        content: `RACHEL: Got your pitch deck. I like you, Tess. But vinyl? In 2024?

RACHEL: The margins are terrible. Streaming owns the market.

RACHEL: What am I missing?

[Your response will shape whether she invests...]`,
        displayStyle: 'text'
      },
      successFeedback: '✓ RACHEL: "Community hub with vinyl as the hook... that\'s different. Let\'s talk numbers over coffee."'
    },
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'pitch_community',
        text: "Make it about community. Listening parties. Record clubs. Belonging.",
        nextNodeId: 'tess_pitch_community',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'creativity']
      },
      {
        choiceId: 'pitch_experience',
        text: "Sell the experience, not the product. What streaming can't give you.",
        nextNodeId: 'tess_pitch_experience',
        pattern: 'building',
        skills: ['creativity', 'criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'pitch_safe',
        text: "Cut costs. Go online-only. Reduce risk.",
        nextNodeId: 'tess_pitch_fail_safe',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability']
      }
    ],
    tags: ['pitch_mechanic', 'tess_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE: TOO SAFE ---
  {
    nodeId: 'tess_pitch_fail_safe',
    speaker: 'Tess',
    content: [
      {
        text: "Online-only. Cut the physical space. Just ship records.\n\nThen I'm just another website. Competing with Amazon. Why would anyone choose me?\n\nThe whole point was the space. The discovery. The human.",
        emotion: 'deflated',
        interaction: 'small',
        variation_id: 'pitch_fail_v1',
        richEffectContext: 'error',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'retry_pitch',
        text: "You're right. Think bigger.",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'patience',
        skills: ['adaptability']
      },
      {
        choiceId: 'accept_safe',
        text: "Safe might be smart.",
        nextNodeId: 'tess_decision_cautious_path',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['tess_chose_safe']
        }
      }
    ]
  },

  // --- SUCCESS: COMMUNITY ANGLE ---
  {
    nodeId: 'tess_pitch_community',
    speaker: 'Tess',
    content: [
      {
        text: "Community. Yes. People are lonely. Headphones isolate.\n\nWeekly listening sessions. Curated. Deep dives. Talk about what we're hearing.\n\nRecord club. Like book club. But for albums. Monthly memberships.\n\nNot selling plastic. Selling belonging.",
        emotion: 'excited',
        interaction: 'bloom',
        variation_id: 'community_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'community_plus',
        text: "And partner with local artists. They need a home base too.",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'building',
        skills: ['collaboration', 'problemSolving'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'community_explore',
        text: "What if you added a coffee bar? Give people a reason to stay?",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'exploring',
        skills: ['creativity', 'criticalThinking']
      }
    ],
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "Community. Yes. People are lonely. Headphones isolate.\n\nYou see it clearly. Connection. Belonging. That's what you've been pointing at in every conversation.\n\nNot selling plastic. Selling what people actually need.",
        altEmotion: 'inspired'
      }
    ]
  },

  // --- SUCCESS: EXPERIENCE ANGLE ---
  {
    nodeId: 'tess_pitch_experience',
    speaker: 'Tess',
    content: [
      {
        text: "Experience. Can't stream this.\n\nThe smell of vinyl. The crackle before the first note. Someone handing you an album and saying \"this will change you.\"\n\nMaybe the business isn't records at all. It's curation. Discovery. The human recommending what no algorithm ever could.",
        emotion: 'inspired',
        interaction: 'bloom',
        variation_id: 'experience_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'experience_events',
        text: "Host 'discovery nights.' Featured artists. Conversation. Connection.",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'building',
        skills: ['creativity', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'experience_premium',
        text: "Charge premium for the curation. Make it exclusive.",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: "Experience. Can't stream this.\n\nYou're a builder. You see structures. Possibility in the bones of a thing.\n\nThe business isn't records. It's what we build around them.",
        altEmotion: 'kindred'
      }
    ]
  },

  // --- PITCH CLIMAX ---
  {
    nodeId: 'tess_pitch_climax',
    speaker: 'Tess',
    content: [
      {
        text: "This could work. Community hub. Experience destination. Local artist residency.\n\nThe B-Side 2.0.\n\nStill scared. Still might fail.\n\nBut at least it means something.",
        emotion: 'hopeful',
        interaction: 'nod',
        variation_id: 'climax_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'climax_bold',
        text: "Do it. Call the developer. Tell them no.",
        nextNodeId: 'tess_moment_before',
        pattern: 'building',
        archetype: 'TAKE_ACTION',
        skills: ['problemSolving', 'adaptability'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'climax_time',
        text: "Take a week. Let it settle.",
        nextNodeId: 'tess_moment_before',
        pattern: 'patience',
        skills: ['leadership', 'emotionalIntelligence']
      },
      {
        choiceId: 'climax_explore',
        text: "What's the first step? Start there.",
        nextNodeId: 'tess_moment_before',
        pattern: 'exploring',
        archetype: 'SEEK_CLARIFICATION',
        skills: ['problemSolving', 'criticalThinking'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    tags: ['tess_arc', 'climax'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  // EXPANSION: Moment before
  {
    nodeId: 'tess_moment_before',
    speaker: 'Tess',
    content: [
      {
        text: "Every artist up there. Before anyone cared.\n\nYeah. I'm calling.",
        emotion: 'resolute',
        interaction: 'nod',
        variation_id: 'moment_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'moment_to_decision',
        text: "[Watch]",
        nextNodeId: 'tess_decision_made',
        pattern: 'patience'
      }
    ],
    tags: ['tess_arc', 'decision']
  },

  // ============= DECISIONS =============
  {
    nodeId: 'tess_decision_made',
    speaker: 'Tess',
    content: [
      {
        text: "\"Mr. Harrison? Tess Rivera. About your offer. I'm going to have to decline.\"\n\n\"Because I'm not done yet.\"\n\nScared. Alive. Both.",
        emotion: 'determined',
        interaction: 'bloom',
        variation_id: 'decision_bold_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'decision_support',
        text: "That took courage.",
        nextNodeId: 'tess_farewell',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'decision_practical',
        text: "Now the real work starts.",
        nextNodeId: 'tess_farewell',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ],
    tags: ['tess_arc', 'decision']
  },

  {
    nodeId: 'tess_decision_cautious_path',
    speaker: 'Tess',
    content: [
      {
        text: "Twelve years. That's a good run. Better than most.\n\nMaybe the smart play is knowing when it's over.\n\nI'll think about it.",
        emotion: 'resigned',
        interaction: 'small',
        variation_id: 'decision_cautious_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'cautious_push',
        text: "Before you decide. What's the worst that happens if you try?",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'cautious_accept',
        text: "Endings can be graceful too.",
        nextNodeId: 'tess_farewell_cautious',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['tess_arc', 'decision']
  },

  // ============= TESS'S VULNERABILITY ARC =============
  // "The partnership that ended her"
  {
    nodeId: 'tess_vulnerability_arc',
    speaker: 'Tess',
    content: [{
      text: "This shop wasn't always mine alone.\n\nElena. My business partner. My best friend. We built this place together. Every shelf, every playlist, every late night wondering if we'd make rent.\n\nThree years in, she got an offer. Corporate gig. Six figures. Benefits. Security.\n\nShe said: \"Come with me. We can do this again later.\"\n\nI said: \"This IS later. This is now.\"\n\nShe left. Took half the startup capital with her. Legally hers. But it felt like she took half my belief too.",
      emotion: 'grief_anger',
      microAction: 'She grips the record sleeve tighter.',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['tess_vulnerability_revealed', 'knows_about_elena']
      }
    ],
    choices: [
      {
        choiceId: 'vuln_she_chose_fear',
        text: "She chose security. You chose meaning. Neither is wrong.",
        nextNodeId: 'tess_vulnerability_reflection',
        pattern: 'patience',
        archetype: 'SHOW_UNDERSTANDING',
        skills: ['emotionalIntelligence'],
        requiredOrbFill: { pattern: 'patience', threshold: 25 },
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_still_standing',
        text: "But you're still here. The shop is still here. You rebuilt.",
        nextNodeId: 'tess_vulnerability_reflection',
        pattern: 'helping',
        archetype: 'ACKNOWLEDGE_EMOTION',
        skills: ['emotionalIntelligence', 'communication'],
        requiredOrbFill: { pattern: 'helping', threshold: 20 },
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_silence',
        text: "[Let the grief have its space.]",
        nextNodeId: 'tess_vulnerability_reflection',
        pattern: 'patience',
        archetype: 'STAY_SILENT',
        skills: ['emotionalIntelligence'],
        requiredOrbFill: { pattern: 'patience', threshold: 30 },
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'tess_arc', 'emotional_core']
  },
  {
    nodeId: 'tess_vulnerability_reflection',
    speaker: 'Tess',
    content: [{
      text: "I haven't spoken to her in four years. She sends a Christmas card. I don't open them.\n\nThe developer's offer? Part of me wants to take it just to prove I can walk away too. That I'm not the one who got left holding the dream while everyone else grew up.\n\nBut that's spite talking. Not truth.\n\nYou're the first person I've told the Elena story to. Everyone else just sees \"passionate small business owner.\" They don't see the wound underneath.",
      emotion: 'vulnerable_released',
      variation_id: 'reflection_v1'
    }],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'tess_farewell',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'tess_arc']
  },

  // ============= FAREWELLS =============
  {
    nodeId: 'tess_farewell',
    speaker: 'Tess',
    content: [
      {
        text: "You. Stranger walking in. Helped me see it.\n\nSometimes we need someone outside our own head.\n\nHouse gift. Something I think you'll like.\n\nCome back when we reopen. First listening session's on me.",
        emotion: 'grateful',
        interaction: 'nod',
        variation_id: 'farewell_v1',
        useChatPacing: true
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: "You're a builder. I saw it in how you think.\n\nHouse gift. Something I think you'll like.\n\nCome back when we reopen. You might want to help build it.",
        altEmotion: 'kindred'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "You asked the right questions. Explorers always do.\n\nHouse gift. Something I think you'll like.\n\nCome back when we reopen. Curious people belong here.",
        altEmotion: 'recognized'
      }
    ],
    choices: [
      {
        choiceId: 'farewell_question',
        text: "What will you try first?",
        nextNodeId: 'tess_asks_player',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'farewell_return',
        text: "I'll be back.",
        nextNodeId: 'tess_asks_player',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['tess_arc', 'farewell']
  },

  {
    nodeId: 'tess_farewell_cautious',
    speaker: 'Tess',
    content: [
      {
        text: "If this is how it ends. At least it was real.\n\nTwelve years of catching what mattered before it disappeared.\n\nThat's not nothing.",
        emotion: 'melancholic',
        interaction: 'small',
        variation_id: 'farewell_cautious_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'cautious_farewell_return',
        text: "It meant something. To a lot of people.",
        nextNodeId: 'tess_asks_player',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['tess_arc', 'farewell']
  },

  // ============= RECIPROCITY =============
  {
    nodeId: 'tess_asks_player',
    speaker: 'Tess',
    content: [
      {
        text: "Enough about me. You walked into a record shop and helped a stranger figure out her life.\n\nWhat are you looking for? What's your version of this?",
        emotion: 'curious_engaged',
        interaction: 'nod',
        variation_id: 'asks_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'player_own_build',
        text: "Something I can build. Something that's mine.",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'creativity']
      },
      {
        choiceId: 'player_own_meaning',
        text: "Something that matters. Not just money or status.",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'player_own_help',
        text: "Ways to help people. Make their lives better.",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'player_own_figuring',
        text: "Still figuring it out. That's why I'm here.",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'tess_arc']
  },

  {
    nodeId: 'tess_reciprocity_response',
    speaker: 'Tess',
    content: [
      {
        text: "That's worth protecting. Whatever it is.\n\nDon't let the phoniness get to it.\n\nI have some calls to make. Come back sometime.\n\nAnd see Samuel. He'll want to know how this went.",
        emotion: 'affirming',
        interaction: 'nod',
        variation_id: 'reciprocity_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_tess',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.TESS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['reciprocity', 'tess_arc']
  },

  // ============= CLASSROOM CRISIS SIMULATION =============
  // Tess's simulation: Managing a student conflict that escalates
  {
    nodeId: 'tess_simulation_intro',
    speaker: 'Tess',
    content: [
      {
        text: "Before I ran the shop, I taught. Middle school. Music and English.\n\nYou want to know what running a small business taught me about people? Nothing the classroom hadn't already.\n\nThere was this day. Two students. A conflict that started small. I had thirty seconds to decide how to handle it.\n\nWant to walk through it? See how you'd have handled it?",
        emotion: 'reflective',
        variation_id: 'sim_intro_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_sim_accept',
        text: "Show me. I want to understand.",
        nextNodeId: 'tess_simulation_phase_1',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_sim_why_matters',
        text: "Why does this moment still stay with you?",
        nextNodeId: 'tess_simulation_context',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation', 'tess_arc']
  },

  {
    nodeId: 'tess_simulation_context',
    speaker: 'Tess',
    content: [
      {
        text: "Because I got it wrong the first time. Then I got it right.\n\nThe difference taught me everything I know about running this place. About people. About what they really need when things get heated.\n\nMarcus. One of the kids. He ended up becoming a teacher himself. Told me years later that day changed how he saw conflict.\n\nWe shape people in ways we never see. Until sometimes, we do.",
        emotion: 'moved',
        variation_id: 'context_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_sim_ready',
        text: "I'm ready. Show me what happened.",
        nextNodeId: 'tess_simulation_phase_1',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['simulation', 'tess_arc', 'backstory']
  },

  {
    nodeId: 'tess_simulation_phase_1',
    speaker: 'Tess',
    content: [
      {
        text: "A classroom. Twenty-five students. The hum of pre-class chaos.\n\nMaya and Jordan. Both smart. Both proud. They're arguing over a group project.\n\nMaya: \"You didn't do ANY of the work! And now you want credit?\"\n\nJordan: \"I was dealing with stuff at home! You don't know what I'm going through!\"\n\nMaya: \"Everyone's going through something! That doesn't mean the rest of us carry you!\"\n\nThe class is watching now. The tension is electric.\n\nWhat do you do?",
        emotion: 'tense',
        variation_id: 'phase1_v1',
        useChatPacing: true
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'The Escalating Conflict',
      taskDescription: 'Two students are in a public confrontation about fairness and contribution. The class is watching. Your response will set the tone for how conflict is handled.',
      initialContext: {
        label: 'Classroom Situation',
        content: `Maya: Frustrated, feels taken advantage of, publicly calling out Jordan
Jordan: Defensive, dealing with undisclosed home issues, feeling attacked
Class: 25 witnesses, tension rising, waiting for adult intervention
Stakes: Trust, fairness, emotional safety for both students`,
        displayStyle: 'text'
      },
      successFeedback: 'Both students feel heard. The class learns that conflict can be resolved with dignity.'
    },
    choices: [
      {
        choiceId: 'tess_p1_authority',
        text: "Stop. Both of you, outside. Now. We're not doing this in front of everyone.",
        nextNodeId: 'tess_simulation_phase_2_authority',
        pattern: 'building',
        skills: ['leadership']
      },
      {
        choiceId: 'tess_p1_empathy',
        text: "Maya, I hear you're frustrated. Jordan, it sounds like something's going on. Let's pause and breathe.",
        nextNodeId: 'tess_simulation_phase_2_empathy',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'tess_p1_analyze',
        text: "Hold on. What's the actual problem here? Is this about the project, or something else?",
        nextNodeId: 'tess_simulation_phase_2_analyze',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'tess_p1_wait',
        text: "[Wait. Let them get it out. Sometimes people need to be heard before they can hear.]",
        nextNodeId: 'tess_simulation_phase_2_patience',
        pattern: 'patience',
        archetype: 'STAY_SILENT',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation', 'tess_arc', 'decision_point']
  },

  // Phase 2 branches based on Phase 1 choice
  {
    nodeId: 'tess_simulation_phase_2_authority',
    speaker: 'Tess',
    content: [
      {
        text: "Both students hesitate. The class watches.\n\nMaya: \"Fine. But this isn't over.\"\n\nJordan follows, head down.\n\nOutside, in the hallway, the dynamic shifts. No audience. But both are still defensive.\n\nMaya: \"I'm not apologizing. I did the work.\"\n\nJordan: \"I didn't ask you to.\"\n\nWhat's your next move?",
        emotion: 'controlled',
        variation_id: 'p2_authority_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_p2a_separate',
        text: "I'm going to talk to each of you separately. Maya, wait here. Jordan, come with me.",
        nextNodeId: 'tess_simulation_success',
        pattern: 'analytical',
        skills: ['leadership', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_p2a_force_dialogue',
        text: "You're both going to stand here until you actually hear each other. Maya, what do you need Jordan to understand?",
        nextNodeId: 'tess_simulation_fail',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    tags: ['simulation', 'tess_arc']
  },

  {
    nodeId: 'tess_simulation_phase_2_empathy',
    speaker: 'Tess',
    content: [
      {
        text: "Your calm tone cuts through the tension.\n\nMaya's hands unclench slightly. Jordan's shoulders drop an inch.\n\nMaya: \"I just... I worked so hard. And it feels like no one cares.\"\n\nJordan: \"I do care. I just... couldn't.\"\n\nThe class is still watching, but the energy has shifted. This isn't entertainment anymore. It's something real.\n\nA student in the back whispers: \"This is heavy.\"\n\nHow do you guide this forward?",
        emotion: 'tender',
        variation_id: 'p2_empathy_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_p2e_private',
        text: "Thank you both for being honest. Let's finish this conversation privately. Class, open your notebooks.",
        nextNodeId: 'tess_simulation_success',
        pattern: 'patience',
        skills: ['leadership', 'emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'tess_p2e_class_moment',
        text: "This is real. And the class should see what happens next. Jordan, would you be willing to share what's been going on?",
        nextNodeId: 'tess_simulation_fail',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['simulation', 'tess_arc']
  },

  {
    nodeId: 'tess_simulation_phase_2_analyze',
    speaker: 'Tess',
    content: [
      {
        text: "Your question lands like a pause button.\n\nBoth students blink. The momentum breaks.\n\nMaya: \"The project! Obviously!\"\n\nYou wait.\n\nMaya, slower: \"...Okay, maybe it's not just the project. I'm tired of being the one who always has to care.\"\n\nJordan: \"I didn't know you felt like that.\"\n\nThe class leans in. Something has shifted.\n\nWhere do you take this?",
        emotion: 'curious',
        variation_id: 'p2_analyze_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_p2n_deeper',
        text: "Maya, that sounds exhausting. Jordan, what's making it hard to contribute right now?",
        nextNodeId: 'tess_simulation_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'tess_p2n_solve',
        text: "Good. Now we know the real issue. Let's fix the project division right now.",
        nextNodeId: 'tess_simulation_fail',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ],
    tags: ['simulation', 'tess_arc']
  },

  {
    nodeId: 'tess_simulation_phase_2_patience',
    speaker: 'Tess',
    content: [
      {
        text: "You don't intervene. The room holds its breath.\n\nMaya, expecting you to stop it, looks confused when you don't.\n\nMaya: \"Aren't you going to... do something?\"\n\nYou meet her eyes calmly.\n\nMaya: \"...I'm just so tired. I always have to be the one who cares.\"\n\nJordan: \"I care too. I just... things are really hard at home right now.\"\n\nThe anger drains from Maya's face.\n\nMaya: \"...I didn't know.\"\n\nNow what?",
        emotion: 'raw',
        variation_id: 'p2_patience_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_p2p_bridge',
        text: "You're both carrying more than you should have to. Let's figure this out together - privately.",
        nextNodeId: 'tess_simulation_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'tess_p2p_public_resolution',
        text: "The class should see how this resolves. Jordan, would you feel comfortable sharing more?",
        nextNodeId: 'tess_simulation_fail',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['simulation', 'tess_arc']
  },

  // Success outcome
  {
    nodeId: 'tess_simulation_success',
    speaker: 'Tess',
    content: [
      {
        text: "That's what I should have done. What I eventually learned to do.\n\nMaya became a social worker. Jordan's a teacher now. Teaches conflict resolution to middle schoolers.\n\nYou protected their dignity. Gave them space to be human without an audience judging them.\n\nThat's what I try to do here. At the shop. When artists are struggling. When customers are hurting.\n\nPeople need to be seen. But they also need the grace of privacy when they're falling apart.\n\nYou understand that. Not everyone does.",
        emotion: 'proud',
        interaction: 'bloom',
        variation_id: 'success_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['tess_simulation_complete', 'tess_teaching_past']
      }
    ],
    choices: [
      {
        choiceId: 'tess_success_teaching',
        text: "You were a good teacher. You still are.",
        nextNodeId: 'tess_simulation_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'tess_success_privacy',
        text: "Privacy and dignity. That's what the shop is really about.",
        nextNodeId: 'tess_simulation_reflection',
        pattern: 'analytical',
        skills: ['communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'tess_arc', 'success']
  },

  // Failure outcome
  {
    nodeId: 'tess_simulation_fail',
    speaker: 'Tess',
    content: [
      {
        text: "That's what I did. The first time.\n\nI pushed too hard. Made it public when it needed to be private. Jordan shut down completely. Didn't talk for a week.\n\nMaya felt guilty for months. Said she'd ruined Jordan's life by calling them out.\n\nPeople need to be seen. But not dissected in front of an audience. There's a difference between transparency and exposure.\n\nI learned that the hard way. Cost me a relationship with two students I really cared about.\n\nWant to try again? See a different path?",
        emotion: 'regretful',
        variation_id: 'fail_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_fail_retry',
        text: "Yes. Show me how to do it right.",
        nextNodeId: 'tess_simulation_phase_1',
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'tess_fail_reflect',
        text: "What did you learn from getting it wrong?",
        nextNodeId: 'tess_simulation_fail_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'tess_arc', 'failure']
  },

  {
    nodeId: 'tess_simulation_fail_reflection',
    speaker: 'Tess',
    content: [
      {
        text: "I learned that being right isn't the same as being helpful.\n\nI wanted to fix it. Publicly. Show the class that conflict could be resolved. That I was a good teacher.\n\nBut it wasn't about me. It wasn't about the class. It was about two kids who were hurting.\n\nI made their pain educational. That's not teaching. That's exploitation.\n\nAfter that, I changed. Every time I wanted to make something a \"learning moment,\" I asked: whose moment is this? If it's theirs, step back. Let them own it.\n\nThat's why the shop works. It's not my moment. It's theirs. I just hold the space.",
        emotion: 'wise',
        variation_id: 'fail_reflect_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_fail_to_sim_reflection',
        text: "That's wisdom earned through failure. Thank you for sharing it.",
        nextNodeId: 'tess_simulation_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'tess_arc', 'wisdom']
  },

  {
    nodeId: 'tess_simulation_reflection',
    speaker: 'Tess',
    content: [
      {
        text: "You know what's funny? Running a record shop is exactly like teaching.\n\nPeople come in confused. Looking for something they can't name. And you have thirty seconds to decide: do I tell them what to listen to? Or do I help them discover it themselves?\n\nEvery customer is Maya and Jordan. Carrying something. Looking for space to process it.\n\nAnd every day, I get to choose: authority or empathy. Analysis or patience. Fixing or witnessing.\n\nMost days, I still get it wrong. But I know what I'm aiming for now.\n\nThat's something.",
        emotion: 'content',
        variation_id: 'reflection_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['tess_teaching_wisdom']
      }
    ],
    choices: [
      {
        choiceId: 'tess_sim_to_main',
        text: "[Continue]",
        nextNodeId: 'tess_the_numbers',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'tess_arc', 'conclusion']
  },

  // ============= PHASE 2: THE PIVOT =============
  {
    nodeId: 'tess_phase2_entry',
    speaker: 'Tess',
    content: [
      {
        text: "Six weeks later. Back room converted. Listening stations. Coffee bar.\n\nFirst listening session yesterday. Forty people. Sold out.\n\nProblem: now I'm doing everything. Coffee. Curation. Community. Accounting. Dying.",
        emotion: 'overwhelmed',
        interaction: 'shake',
        variation_id: 'p2_entry_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_delegate',
        text: "You need help. Can't do it all alone.",
        nextNodeId: 'tess_p2_crisis_reveal',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'p2_celebrate',
        text: "Forty people. That's amazing.",
        nextNodeId: 'tess_p2_crisis_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'p2_explore',
        text: "What's working? What isn't?",
        nextNodeId: 'tess_p2_crisis_reveal',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication']
      }
    ],
    tags: ['phase2', 'tess_arc']
  },

  {
    nodeId: 'tess_p2_crisis_reveal',
    speaker: 'Tess',
    content: [
      {
        text: "Working: the vibe. People lingering. Conversations happening. Artists booking the space.\n\nNot working: me. I haven't slept in three days. Made a customer cry yesterday because I snapped.\n\nMoney's still tight. But the energy... there's something here.\n\nDeveloper again. Raised the offer.",
        emotion: 'conflicted',
        interaction: 'small',
        variation_id: 'p2_crisis_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_hire',
        text: "Hire someone. Even part-time. You'll burn out.",
        nextNodeId: 'tess_p2_solution',
        pattern: 'building',
        skills: ['problemSolving', 'leadership']
      },
      {
        choiceId: 'p2_systems',
        text: "Systems. You need systems. Simplify the operation.",
        nextNodeId: 'tess_p2_solution',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'p2_breathe',
        text: "One day at a time. Rome wasn't built in six weeks.",
        nextNodeId: 'tess_p2_solution',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    tags: ['phase2', 'tess_arc', 'crisis']
  },

  {
    nodeId: 'tess_p2_solution',
    speaker: 'Tess',
    content: [
      {
        text: "You're right. Can't catch anything if I fall first.\n\nKnow what's funny? I left corporate because it felt fake. Now I'm building my own business. Same pressure.\n\nBut different. This time it's real.",
        emotion: 'determined',
        interaction: 'nod',
        variation_id: 'p2_solution_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_solution_action',
        text: "So what's the first move?",
        nextNodeId: 'tess_p2_first_hire',
        pattern: 'building',
        skills: ['problemSolving', 'leadership']
      }
    ],
    tags: ['phase2', 'tess_arc'],
    metadata: {
      sessionBoundary: true  // Session 2: Crossroads complete
    }
  },

  // EXPANSION: First hire
  {
    nodeId: 'tess_p2_first_hire',
    speaker: 'Tess',
    content: [
      {
        text: "Posted for help yesterday. Barista slash music lover. Part-time.\n\nApplications flooded in. People want to be part of this.\n\nOne girl. Sixteen. Same kid from before. Her mom's old record shop.\n\nShe gets it. Hired her this morning.",
        emotion: 'hopeful',
        interaction: 'bloom',
        variation_id: 'p2_hire_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_hire_to_community',
        text: "That's a full circle.",
        nextNodeId: 'tess_p2_community_proof',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['phase2', 'tess_arc']
  },

  // EXPANSION: Community proof
  {
    nodeId: 'tess_p2_community_proof',
    speaker: 'Tess',
    content: [
      {
        text: "Artist came in last night. Said she found her sound here. Listening party, three months ago.\n\nSigned to a label last week. Independent. Small. Real.\n\nFirst thing she did? Booked a show here. \"Where it started.\"\n\nThis is why. Not money. This.",
        emotion: 'moved',
        interaction: 'bloom',
        variation_id: 'p2_community_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_community_to_resolution',
        text: "You're building something that lasts.",
        nextNodeId: 'tess_p2_resolution',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['phase2', 'tess_arc']
  },

  {
    nodeId: 'tess_p2_resolution',
    speaker: 'Tess',
    content: [
      {
        text: "First: hire Maya. She's been helping volunteer. Knows the music. Needs a job.\n\nSecond: cap events at twice a week. Quality over quantity.\n\nThird: remember why I'm doing this.\n\nThis. This is why.",
        emotion: 'peaceful',
        interaction: 'bloom',
        variation_id: 'p2_resolution_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_affirm',
        text: "You've got this.",
        nextNodeId: 'tess_p2_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['phase2', 'tess_arc', 'resolution']
  },

  {
    nodeId: 'tess_p2_reflection',
    speaker: 'Tess',
    content: [
      {
        text: "People keep asking if I regret not selling. Every time the rent comes due.\n\nBut last night. Kid came in. Maybe seventeen. Flipping through crates like I used to.\n\nWatched her find something. Eyes went wide.\n\nThat moment. Can't stream that. Can't algorithm that.\n\nThat's what I'm catching.",
        emotion: 'content',
        interaction: 'nod',
        variation_id: 'p2_reflection_v1',
        useChatPacing: true
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: "People keep asking if I regret not selling.\n\nBut you know the answer. You're a builder. You see what I'm building here.\n\nNot just a store. A place where real survives.\n\nThat's what we're catching.",
        altEmotion: 'kindred'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "People keep asking if I regret not selling.\n\nBut explorers like you understand. The question isn't profit. It's discovery.\n\nWhat happens in that moment when someone finds something real.\n\nThat's what we're catching.",
        altEmotion: 'recognized'
      }
    ],
    choices: [
      {
        choiceId: 'p2_complete',
        text: "[Continue]",
        nextNodeId: 'tess_p2_complete',
        pattern: 'patience'
      }
    ],
    tags: ['phase2', 'tess_arc', 'reflection']
  },

  {
    nodeId: 'tess_p2_complete',
    speaker: 'Tess',
    content: [
      {
        text: "For you. Something new. Artist playing here next month.\n\nYou showed up. Twice. Helped me see what I was building.\n\nDon't be a stranger.",
        emotion: 'grateful',
        interaction: 'nod',
        variation_id: 'p2_complete_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_asks_player',
        text: "What's next for The B-Side?",
        nextNodeId: 'tess_p2_asks_player',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'return_to_samuel_tess_p2',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.TESS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['phase2', 'tess_arc', 'complete']
  },

  {
    nodeId: 'tess_p2_asks_player',
    speaker: 'Tess',
    content: [
      {
        text: "Next? Keep going. One album at a time. One listener at a time.\n\nBut I'm curious. What about you?\n\nWhat are you building out there?",
        emotion: 'curious_engaged',
        interaction: 'nod',
        variation_id: 'p2_asks_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_player_building',
        text: "Still figuring it out. But something real.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'creativity']
      },
      {
        choiceId: 'p2_player_helping',
        text: "Helping where I can. Making things a little better.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'p2_player_exploring',
        text: "Exploring. Trying things. Seeing what sticks.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'exploring',
        skills: ['adaptability', 'emotionalIntelligence']
      },
      {
        choiceId: 'p2_player_patience',
        text: "Taking it slow. Letting it unfold.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      // Career observation routes (ISP: Only visible when pattern combos are achieved)
      {
        choiceId: 'p2_career_educator',
        text: "You know... the way you teach through music reminds me of something.",
        nextNodeId: 'tess_career_reflection_educator',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          patterns: { helping: { min: 5 }, patience: { min: 5 } },
          lacksGlobalFlags: ['tess_mentioned_career']
        }
      },
      {
        choiceId: 'p2_career_curriculum',
        text: "The way you build experiences here... it's like curriculum design.",
        nextNodeId: 'tess_career_reflection_curriculum',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
        visibleCondition: {
          patterns: { building: { min: 4 }, helping: { min: 5 } },
          lacksGlobalFlags: ['tess_mentioned_career']
        }
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'tess_arc', 'phase2']
  },

  {
    nodeId: 'tess_p2_reciprocity_response',
    speaker: 'Tess',
    content: [
      {
        text: "Good. Keep at it. Whatever it is.\n\nThe world needs more real. Less algorithm. Less phony.\n\nGo on. Samuel's waiting. Tell him The B-Side is still standing.",
        emotion: 'affirming',
        interaction: 'nod',
        variation_id: 'p2_reciprocity_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_tess_p2_after',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.TESS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['reciprocity', 'tess_arc', 'phase2'],
    metadata: {
      sessionBoundary: true  // Session 3: Arc complete
    }
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'tess_career_reflection_educator',
    speaker: 'Tess',
    content: [
      {
        text: "You know what I see in you? Someone who understands that real learning takes time.\n\nNot everyone gets that. Most people want quick fixes. Fast results. But you... you've got the patience.\n\nEducation specialists. The ones who create spaces where everyone can grow. They all have what you have. That rare combination of wanting to help and knowing it can't be rushed.",
        emotion: 'thoughtful',
        variation_id: 'career_educator_v1'
      }
    ],
    requiredState: {
      patterns: {
        helping: { min: 5 },
        patience: { min: 5 }
      }
    },
    onEnter: [
      {
        characterId: 'tess',
        addGlobalFlags: ['combo_patient_teacher_achieved', 'tess_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'tess_career_educator_continue',
        text: "That's something to think about.",
        nextNodeId: 'tess_phase2_entry',
        pattern: 'patience'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'education']
  },

  {
    nodeId: 'tess_career_reflection_curriculum',
    speaker: 'Tess',
    content: [
      {
        text: "I've been thinking about the way you approach things. Building while helping.\n\nCurriculum developers do that. They're architects of learning experiences. Building bridges between knowledge and understanding.\n\nNot just teaching, but designing how others learn. Your instincts point that direction.",
        emotion: 'warm',
        variation_id: 'career_curriculum_v1'
      }
    ],
    requiredState: {
      patterns: {
        building: { min: 4 },
        helping: { min: 5 }
      }
    },
    onEnter: [
      {
        characterId: 'tess',
        addGlobalFlags: ['combo_curriculum_designer_achieved', 'tess_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'tess_career_curriculum_continue',
        text: "Building how people learn... I hadn't thought of it that way.",
        nextNodeId: 'tess_phase2_entry',
        pattern: 'building'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'education']
  }
]

export const tessEntryPoints = {
  INTRODUCTION: 'tess_introduction',
  PHASE2_ENTRY: 'tess_phase2_entry',
  SIMULATION: 'tess_simulation_intro'
} as const

export const tessDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(tessDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: tessEntryPoints.INTRODUCTION,
  metadata: {
    title: "Tess's Vision",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: tessDialogueNodes.length,
    totalChoices: tessDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
