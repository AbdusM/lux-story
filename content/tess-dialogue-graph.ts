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
import { buildDialogueNodesMap, filterDraftNodes } from './drafts/draft-filter'

export const tessDialogueNodes: DialogueNode[] = [
  // ============= PHASE 1: THE OFFER =============
  {
    nodeId: 'tess_introduction',
    speaker: 'Tess',
    content: [
      {
        text: "The B-Side. Vinyl crates.",
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
        text: "Enough to retire.",
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
        text: "Started this place twelve years ago. me.",
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
      },
      {
        choiceId: 'tess_shop_plants',
        text: "[Notice the grow lights in the back room]",
        nextNodeId: 'tess_botany_intro',
        pattern: 'exploring',
        archetype: 'MAKE_OBSERVATION',
        skills: ['observation'],
        visibleCondition: {
          patterns: { exploring: { min: 2 } }
        }
      }
    ]
  },

  {
    nodeId: 'tess_backstory',
    speaker: 'Tess',
    content: [
      {
        text: "Was working corporate.",
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
        text: "Most people call it reckless. Or lucky.",
        emotion: 'touched',
        variation_id: 'courage_response_v1',
        useChatPacing: true,
        voiceVariations: {
          analytical: "Most people analyze it to death. Run the risk calculations. You saw the data point that matters - courage.\n\nReckless enough to jump. Lucky enough to land somewhere real.\n\nI'll take that frame.",
          helping: "Most people call it reckless. You're the first to see the heart in it.\n\nMaybe that's what courage is. Risking stability to help something real survive.\n\nThank you for saying that.",
          building: "Most people see destruction. You see construction - tearing down the fake to build something real.\n\nReckless enough to jump. Committed enough to land somewhere I could build.\n\nThat's the right word for it.",
          exploring: "Most people call it reckless. You're curious about what I found on the other side.\n\nMaybe it was both. Reckless enough to jump. Open enough to discover what matters.\n\nCourage to explore. Yeah.",
          patience: "Most people rush to judge it. You took time to understand.\n\nReckless enough to jump. Patient enough to let it become something real over years.\n\nCourage... yeah. I'll take that."
        }
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_courage',
        text: "Ask what the numbers show.",
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
        text: "Now? Now I'm standing in my own shop wondering if I traded one fake for another broke.",
        emotion: 'wry',
        variation_id: 'reality_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_reality',
        text: "Let her finish the point.",
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
        text: "Exactly.",
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
        text: "Fight for it. Like it's simple.",
        emotion: 'fierce',
        variation_id: 'fight_response_v1',
        useChatPacing: true,
        voiceVariations: {
          analytical: "Fight for it. You say it like there's a strategy I haven't seen.\n\nYou're right though. Everyone gives me probability analysis. Risk assessment. Exit strategies.\n\nNo one's mapped out the path to win in months.\n\nMaybe I've been solving the wrong equation.",
          helping: "Fight for it. You say it like you believe in me.\n\nYou know what? You're right. Everyone tells me to protect myself. Be safe. Take care of my future.\n\nNo one's said \"fight for what matters\" in months.\n\nMaybe I forgot that's still an option.",
          building: "Fight for it. Build something they can't ignore.\n\nYou're right. Everyone tells me the structure won't hold. The foundation's cracked. Tear it down.\n\nNo one's said \"keep building\" in months.\n\nMaybe that's exactly what I need to do.",
          exploring: "Fight for it. Like there's still territory to discover.\n\nYou're right. Everyone tells me to retreat. The path's closed. Turn back.\n\nNo one's said \"keep exploring the options\" in months.\n\nMaybe I stopped looking too soon.",
          patience: "Fight for it. You're not rushing me to decide.\n\nYou're right. Everyone tells me time's running out. Decide now. Move fast.\n\nNo one's said \"this is worth the fight\" in months.\n\nMaybe I just needed permission to take my time with this."
        }
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_fight',
        text: "Follow her argument.",
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
        text: "That's the question, isn't it?",
        emotion: 'tired',
        variation_id: 'how_response_v1',
        useChatPacing: true,
        voiceVariations: {
          analytical: "That's the question, isn't it? \"How\" is where the algorithm breaks down.\n\nPassion says keep going. Math says sell. You understand that tension - logic vs. intuition.\n\nEvery month I run the numbers differently. Some months passion outweighs probability. Lately, math's been winning.",
          helping: "That's the question, isn't it? \"How\" is where care meets reality.\n\nPassion says keep going - for the kid who cried in the aisles, for the music that saves lives. Math says I can't help anyone if I'm broke.\n\nEvery month I weigh those needs differently. Lately, the numbers are getting heavier.",
          building: "That's the question, isn't it? \"How\" is where blueprints meet budgets.\n\nPassion says keep building. Math says the foundation's crumbling and I can't afford repairs.\n\nEvery month I reassess the structure. Some months I see ways to reinforce it. Lately, math's been showing me cracks I can't fix.",
          exploring: "That's the question, isn't it? \"How\" is where the path gets foggy.\n\nPassion says keep exploring possibilities. Math says I've hit a dead end and should turn back while I still can.\n\nEvery month I discover a different route. Lately, math's been blocking more paths than it opens.",
          patience: "That's the question, isn't it? \"How\" is where time runs out.\n\nPassion says keep going - good things take time to grow. Math says I've already waited too long and the window's closing.\n\nEvery month I give it more time to work. Lately, math's been saying time's up."
        }
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_numbers_how',
        text: "Ask where she landed.",
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
        text: "Kid came in last week. Sixteen.",
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
        text: "Here's reality. Vinyl sales cover rent.",
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
      text: "You didn't jump in with advice.",
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
        text: "Selling? I'd survive.",
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
        text: "Ideas keep me up at night.",
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
        text: "Online-only. Cut the physical space.",
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
        text: "Community. Yes.",
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
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "Community. The data's clear—isolation is epidemic. Headphones, screens, algorithms.\n\nYou analyzed the gap. Connection is the underserved market.\n\nNot selling plastic. Selling a solution to a measurable problem.",
        altEmotion: 'focused'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "Community. Takes time to build. Can't rush belonging.\n\nYou understand that. Real connection doesn't happen in one transaction.\n\nNot selling plastic. Selling relationships that grow.",
        altEmotion: 'warm'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "Community. A whole territory to discover. People exploring music together.\n\nYou saw the possibility. New pathways through shared listening.\n\nNot selling plastic. Selling journeys taken together.",
        altEmotion: 'excited'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "Community. Infrastructure for belonging. Weekly sessions, monthly clubs.\n\nYou see the architecture. Systems that support connection.\n\nNot selling plastic. Building a third place.",
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
        text: "Experience.",
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
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "Experience. Can't stream this.\n\nYou see the data clearly—algorithms optimize for engagement, not meaning. Human curation fills that gap.\n\nThe business isn't records. It's competitive advantage through irreplicability.",
        altEmotion: 'focused'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "Experience. Can't stream this.\n\nYou understand—discovery takes time. The ritual of browsing, listening, waiting for the right moment.\n\nThe business isn't records. It's space to slow down.",
        altEmotion: 'warm'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "Experience. Can't stream this.\n\nYou're an explorer. You know discovery can't be automated. The joy of finding something unexpected.\n\nThe business isn't records. It's guided exploration.",
        altEmotion: 'excited'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "Experience. Can't stream this.\n\nYou see it—people need guides, not algorithms. Someone who cares what they discover.\n\nThe business isn't records. It's human connection in the recommendation.",
        altEmotion: 'inspired'
      }
    ]
  },

  // --- PITCH CLIMAX ---
  {
    nodeId: 'tess_pitch_climax',
    speaker: 'Tess',
    content: [
      {
        text: "This could work. Community hub.",
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
        text: "Every artist up there.",
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
        text: "\"Mr. Harrison?",
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
        text: "Twelve years.",
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
      richEffectContext: 'warning',
      patternReflection: [
        {
          pattern: 'analytical',
          minLevel: 5,
          altText: "You analyze things carefully. Maybe you can make sense of this.\n\nElena. My business partner. We built this place together. Three years in: corporate offer. Six figures. Security. The numbers made sense.\n\nShe said: \"Come with me. We can do this again later.\"\n\nI ran the analysis. The data said follow the money. But the meaning said stay.\n\nShe left. Took half the startup capital. Legally hers. Analytically sound.\n\nBut it felt like she took half my belief too. Some things can't be calculated in spreadsheets.",
          altEmotion: 'analytical_grief'
        },
        {
          pattern: 'patience',
          minLevel: 5,
          altText: "You're patient. You understand waiting for the right moment.\n\nElena. My business partner. We built this place together. Three years in: corporate offer. Six figures.\n\nShe said: \"Come with me. We can do this again later.\"\n\nLater. That's the word that broke us. She wanted to wait for the right time. I knew this WAS the right time.\n\nShe left. Took half the startup capital. And half my belief that patience always wins.\n\nSometimes later never comes. I chose now. She chose someday.",
          altEmotion: 'grief_anger'
        },
        {
          pattern: 'exploring',
          minLevel: 5,
          altText: "You explore. You discover. Maybe you understand this divergence.\n\nElena. My business partner. We explored this dream together. Every shelf, every playlist. Three years of discovery.\n\nCorporate offer. Six figures. She said: \"Come with me. We can explore corporate later.\"\n\nI'd already explored that path. This shop was the uncharted territory I wanted.\n\nShe left. Took half the startup capital. Chose the mapped road over the unknown.\n\nFelt like she took half my curiosity too. We were explorers who chose different directions.",
          altEmotion: 'grief_disappointment'
        },
        {
          pattern: 'helping',
          minLevel: 5,
          altText: "You help people. We wanted to help people too.\n\nElena. My business partner. We built this place to help our community. A gathering space. Culture. Connection.\n\nCorporate offer. Six figures. She said: \"Come with me. Help more people with better resources.\"\n\nI wanted to help people here. Now. In this neighborhood.\n\nShe left. Took half the startup capital. Chose helping at scale over helping at home.\n\nFelt like she took half my belief that small help matters too.",
          altEmotion: 'grief_abandoned'
        },
        {
          pattern: 'building',
          minLevel: 5,
          altText: "You build things. We built this together.\n\nElena. My business partner. Every shelf we installed. Every playlist we curated. Three years of construction.\n\nCorporate offer. Six figures. She said: \"Come with me. We can build again later.\"\n\nI said: \"This IS what we built. This is now.\"\n\nShe left. Took half the startup capital. Left me to rebuild alone what we constructed together.\n\nFelt like she took half the foundation. The builder who abandoned the project mid-construction.",
          altEmotion: 'grief_betrayed'
        }
      ]
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
        text: "Proceed.",
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
        text: "You. Stranger walking in.",
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
        text: "If this is how it ends.",
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
        text: "Enough about me.",
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
        text: "That's worth protecting.",
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
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
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
        text: "Before I ran the shop, I taught. Middle school.",
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
        text: "Context matters: two students are escalating in public, the class is watching, and your first move sets the tone for trust.",
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
        text: "Classroom conflict escalates: Maya accuses Jordan of freeloading, Jordan fires back about home stress, and the whole class locks in.\n\nThe tension is public and sharp.\n\nWhat do you do first?",
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
        text: "Maya, I hear frustration. Jordan, something's off. Let's pause and breathe.",
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
        text: "[Wait. Let them speak first. People need to be heard before hearing.]",
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
        text: "Both students hesitate.",
        emotion: 'controlled',
        variation_id: 'p2_authority_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_p2a_separate',
        text: "I'll speak with each of you separately. Maya wait here; Jordan, come with me.",
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
        text: "Stay here until you hear each other. Maya, what must Jordan understand?",
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
        text: "Empathy does not mean avoiding standards. It means enforcing them without stripping dignity.",
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
        text: "This is real. Jordan, would you share what's happening?",
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
        text: "Your question lands like a pause button. Both students blink.",
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
        text: "Phase two tests patience under public pressure. The class wants speed, but resolution needs pace control. Your job is to lower heat without losing accountability.",
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
      text: "Yes, that's the move I had to learn too.",
        emotion: 'proud',
        interaction: 'bloom',
        variation_id: 'success_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['tess_simulation_complete', 'tess_teaching_past', 'tess_simulation_phase1_complete']
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
      text: "That's what I did the first time. I pushed too hard and made it public when it needed privacy.",
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
        text: "I learned being right isn't the same as being helpful. I tried to turn their conflict into a public teaching moment.",
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
      text: "Running this record shop feels like teaching: people arrive confused and need room to discover, not be prescribed. I still get it wrong sometimes, but now I know what I'm aiming for.",
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
        text: "Return to the numbers.",
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
        text: "Six weeks later. Back room converted.",
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
        text: "Working: the vibe.",
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
        text: "You're right. Can't catch anything if I fall first.",
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
        text: "Posted for help yesterday.",
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
        text: "Artist came in last night.",
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
        text: "First: hire Maya. She's been helping volunteer.",
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
        text: "People keep asking if I regret not selling.",
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
        text: "Close the session together.",
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
        text: "For you.",
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
        visibleCondition: {
          hasGlobalFlags: ['tess_arc_complete'],
          lacksGlobalFlags: ['reflected_on_tess']
        },
        pattern: 'exploring'
      },
      // Loyalty Experience trigger - only visible at high trust + helping pattern
      {
        choiceId: 'offer_first_class_help',
        text: "[Helper's Intuition] First cohort launches soon. Want backup in your corner?",
        nextNodeId: 'tess_loyalty_trigger',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'problemSolving'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { helping: { min: 50 } },
          hasGlobalFlags: ['tess_arc_complete']
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_arc_complete']
      }
    ],
    tags: ['phase2', 'tess_arc', 'complete']
  },

  {
    nodeId: 'tess_p2_asks_player',
    speaker: 'Tess',
    content: [
      {
        text: "Next?",
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
        text: "Good. Keep at it.",
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
        visibleCondition: {
          hasGlobalFlags: ['tess_arc_complete'],
          lacksGlobalFlags: ['reflected_on_tess']
        },
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
        text: "what I see in you? Someone who understands that real learning takes time.",
        emotion: 'thoughtful',
        variation_id: 'career_educator_v1',
        skillReflection: [
          { skill: 'emotionalIntelligence', minLevel: 5, altText: "You know what I see in you? Emotional intelligence. You read people and respond with patience.\n\nMost want quick fixes. But you... you understand that real learning takes emotional safety.\n\nEducation specialists. The great ones all have your emotional intelligence. They know learning can't be rushed.", altEmotion: 'knowing_warm' },
          { skill: 'instructionalDesign', minLevel: 5, altText: "You know what I see in you? Someone who thinks about how learning works.\n\nNot everyone does. Most people just teach—they don't design learning experiences. But you... you naturally think about structure.\n\nCurriculum designers, education architects—they all started with that same instinct you have.", altEmotion: 'appreciative' }
        ],
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "You know what I see in you? Someone who helps people patiently.\n\nMost people want quick fixes. Fast results. But you... you help in ways that take time. That's rare.\n\nEducation specialists. The ones who create spaces where everyone grows. They all have what you have—that combination of wanting to help and knowing deep help can't be rushed.\n\nYour helping isn't a quick fix. It's a patient transformation. That's the kind the world needs.", altEmotion: 'warm_knowing' },
          { pattern: 'patience', minLevel: 5, altText: "You know what I see in you? Patient understanding of how learning works.\n\nMost people want quick results. Instant transformation. But you... you've got the patience to let things unfold.\n\nEducation specialists who create real growth spaces—they all have your patience. That rare understanding that real learning can't be rushed.\n\nYour patience isn't passive waiting. It's active space-holding for growth. That's the foundation of great education.", altEmotion: 'thoughtful_warm' },
          { pattern: 'building', minLevel: 5, altText: "You know what I see in you? Someone who builds learning experiences carefully.\n\nMost people want quick results. But you... you build with patience. Layer by layer.\n\nCurriculum developers, education architects—they all build like you do. Wanting to help while knowing it can't be rushed. Building bridges between knowledge and understanding.\n\nYour building isn't fast construction. It's patient architecture for growth.", altEmotion: 'knowing' }
        ]
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
        text: "I've been thinking about the way you approach things.",
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
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'tess_mystery_hint',
    speaker: 'tess',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "what the best classrooms have?",
        emotion: 'warm',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "I've never believed in fate. But I believe in <shake>readiness</shake>. And everyone here is ready for something.",
        emotion: 'knowing',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'tess_mystery_ask',
        text: "Ready for what?",
        nextNodeId: 'tess_mystery_response',
        pattern: 'exploring'
      },
      {
        choiceId: 'tess_mystery_agree',
        text: "I think I'm ready too. I just don't know for what yet.",
        nextNodeId: 'tess_mystery_response',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'tess_mystery_response',
    speaker: 'tess',
    content: [
      {
        text: "To become who they're meant to be.",
        emotion: 'inspired',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'tess', addKnowledgeFlags: ['tess_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'tess_mystery_return',
        text: "You're one of those sparks too.",
        nextNodeId: 'tess_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'tess_hub_return',
    speaker: 'tess',
    content: [{
      text: "I'll be here if you need to trace some more connections.",
      emotion: 'warm',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['terminal']
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'tess_trust_recovery',
    speaker: 'Tess',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "Hey.\n\n[She looks up from a crate of records.]\n\nI thought you might not come back.\n\nI don't... I'm not great at this part. The apology track. Usually I just let the music speak.",
      emotion: 'vulnerable',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "Hey.\n\n[She looks up from a crate of records.]\n\nYou gave me time. I wasn't sure you'd come back.\n\nI don't... I'm not great at this part. The apology track. Usually I just let the music speak.",
        helping: "Hey.\n\n[She looks up from a crate of records.]\n\nI thought I pushed you away for good.\n\nI don't... I'm not great at this part. The apology track. Usually I just let the music speak.",
        analytical: "Hey.\n\n[She looks up from a crate of records.]\n\nYou assessed the damage and came back anyway. That says something.\n\nI don't... I'm not great at this part. The apology track. Usually I just let the music speak.",
        building: "Hey.\n\n[She looks up from a crate of records.]\n\nYou're rebuilding something I damaged. That takes guts.\n\nI don't... I'm not great at this part. The apology track. Usually I just let the music speak.",
        exploring: "Hey.\n\n[She looks up from a crate of records.]\n\nStill curious even after I shut you out. I respect that.\n\nI don't... I'm not great at this part. The apology track. Usually I just let the music speak."
      }
    }],
    choices: [
      {
        choiceId: 'tess_recovery_listen',
        text: "Then let it. I'm listening.",
        nextNodeId: 'tess_trust_restored',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 2,
          addKnowledgeFlags: ['tess_trust_repaired']
        },
        voiceVariations: {
          patience: "Then let the music speak. I'm listening. Take your time.",
          helping: "Then let it. I'm here. I'm listening.",
          analytical: "Music as communication. I understand. Go ahead.",
          building: "Build it however feels right. I'm listening.",
          exploring: "Show me. I'm listening."
        }
      },
      {
        choiceId: 'tess_recovery_words',
        text: "Try words. They work too.",
        nextNodeId: 'tess_trust_restored',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 2,
          addKnowledgeFlags: ['tess_trust_repaired']
        },
        voiceVariations: {
          patience: "Words can work. When you're ready.",
          helping: "Try words. They work too. I'm not going anywhere.",
          analytical: "Verbal communication has value. Try it.",
          building: "Build the sentence. It doesn't have to be perfect.",
          exploring: "Give it a shot. See what happens."
        }
      }
    ],
    tags: ['trust_recovery', 'tess_arc']
  },

  {
    nodeId: 'tess_trust_restored',
    speaker: 'Tess',
    content: [{
      text: "[She pulls a record from behind the counter. Worn sleeve. Nina Simone.]\n\nThis one. Track 4. \"I Wish I Knew How It Would Feel to Be Free.\"\n\nThat's... that's the apology.\n\n[She meets your eyes.]\n\nAnd also: I'm sorry. For real. With actual words.",
      emotion: 'grateful',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[She pulls a record from behind the counter. Worn sleeve. Nina Simone.]\n\nThis one. Track 4. \"I Wish I Knew How It Would Feel to Be Free.\"\n\nYou waited for me to find the right words. Most people don't.\n\nThat's... that's the apology.\n\n[She meets your eyes.]\n\nAnd also: I'm sorry. For real. With actual words.",
        helping: "[She pulls a record from behind the counter. Worn sleeve. Nina Simone.]\n\nThis one. Track 4. \"I Wish I Knew How It Would Feel to Be Free.\"\n\nYou gave me space to be messy. That means everything.\n\nThat's... that's the apology.\n\n[She meets your eyes.]\n\nAnd also: I'm sorry. For real. With actual words.",
        analytical: "[She pulls a record from behind the counter. Worn sleeve. Nina Simone.]\n\nThis one. Track 4. \"I Wish I Knew How It Would Feel to Be Free.\"\n\nYou understood the message even when the delivery was broken.\n\nThat's... that's the apology.\n\n[She meets your eyes.]\n\nAnd also: I'm sorry. For real. With actual words.",
        building: "[She pulls a record from behind the counter. Worn sleeve. Nina Simone.]\n\nThis one. Track 4. \"I Wish I Knew How It Would Feel to Be Free.\"\n\nYou helped me rebuild this bridge. Thank you.\n\nThat's... that's the apology.\n\n[She meets your eyes.]\n\nAnd also: I'm sorry. For real. With actual words.",
        exploring: "[She pulls a record from behind the counter. Worn sleeve. Nina Simone.]\n\nThis one. Track 4. \"I Wish I Knew How It Would Feel to Be Free.\"\n\nYou explored the space I couldn't articulate. That helped.\n\nThat's... that's the apology.\n\n[She meets your eyes.]\n\nAnd also: I'm sorry. For real. With actual words."
      }
    }],
    choices: [{
      choiceId: 'tess_recovery_complete',
      text: "Proceed.",
      nextNodeId: 'tess_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'tess_arc'],
    onEnter: [{
      characterId: 'tess',
      addKnowledgeFlags: ['tess_trust_recovery_completed']
    }]
  },

  // ============= BOTANY SIMULATION =============
  {
    nodeId: 'tess_botany_intro',
    speaker: 'Tess',
    content: [
      {
        text: "Plants don't care about algorithms.",
        emotion: 'calm',
        interaction: 'nod',
        variation_id: 'botany_intro_v1'
      }
    ],
    simulation: {
      type: 'botany_grid',
      title: 'Hydroponic Genetic Sequencer',
      taskDescription: 'The Moonlight Orchid is fading. Rebalance nutrient mix to match genetic markers.',
      initialContext: {
        label: 'Genetic Profile: Moonlight Orchid',
        displayStyle: 'visual',
        target: {
          targetState: {
            nitrogen: 65,
            phosphorus: 40,
            potassium: 55
          },
          tolerance: 8,
          plantName: 'Moonlight Orchid',
          hint: 'High nitrogen requirements observed. Phosphorus toxicity risk at high levels.'
        }
      },
      successFeedback: 'GROWTH OPTIMIZED. GENETIC MARKERS STABILIZED.'
    },
    choices: [
      {
        choiceId: 'botany_complete',
        text: "It's thriving now.",
        nextNodeId: 'tess_the_shop',
        pattern: 'building',
        voiceVariations: {
          building: "System stabilized. It's thriving.",
          helping: "It looks much healthier now.",
          analytical: "Nutrient balance optimal."
        }
      }
    ]
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'tess_loyalty_trigger',
    speaker: 'Tess',
    content: [{
      text: "First cohort launches in three days. One student emailed: she can't afford materials and may drop.",
      emotion: 'anxious_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { helping: { min: 5 } },
      hasGlobalFlags: ['tess_arc_complete']
    },
    metadata: {
      experienceId: 'the_first_class'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_first_class_challenge',
        text: "Let's think through this together. There might be a third option.",
        nextNodeId: 'tess_loyalty_start',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'problemSolving'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Tess, you've built something meaningful. Trust your instincts on this.",
        nextNodeId: 'tess_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'tess_loyalty', 'high_trust']
  },

  {
    nodeId: 'tess_loyalty_declined',
    speaker: 'Tess',
    content: [{
      text: "You're right. I've been second-guessing myself because the stakes feel so high.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "Your students are lucky to have you. Go build something beautiful.",
        nextNodeId: samuelEntryPoints.TESS_REFLECTION_GATEWAY,
        visibleCondition: {
          hasGlobalFlags: ['tess_arc_complete'],
          lacksGlobalFlags: ['reflected_on_tess']
        },
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'tess_loyalty_start',
    speaker: 'Tess',
    content: [{
      text: "A third option. Yeah.",
      emotion: 'hopeful_determined',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_first_class'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  }
]

export const tessEntryPoints = {
  INTRODUCTION: 'tess_introduction',
  PHASE2_ENTRY: 'tess_phase2_entry',
  SIMULATION: 'tess_simulation_intro',
  MYSTERY_HINT: 'tess_mystery_hint'
} as const

export const tessDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: buildDialogueNodesMap('tess', tessDialogueNodes),
  startNodeId: tessEntryPoints.INTRODUCTION,
  metadata: {
    title: "Tess's Vision",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: filterDraftNodes('tess', tessDialogueNodes).length,
    totalChoices: filterDraftNodes('tess', tessDialogueNodes).reduce((sum, n) => sum + n.choices.length, 0)
  }
}
