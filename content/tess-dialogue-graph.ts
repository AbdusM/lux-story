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
        text: `The B-Side. Vinyl crates, concert posters. Phone rings. She ignores it.

*Flipping through records.*

That phone. Developer again. Third call today.

Offering to buy the building. "Prime real estate." Like it's just square footage.`,
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'tess_intro_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_intro_offer',
        text: "How much are they offering?",
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
        nextNodeId: 'tess_the_shop',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'tess_intro_business',
        text: "How's business?",
        nextNodeId: 'tess_the_numbers',
        pattern: 'building',
        skills: ['criticalThinking', 'adaptability']
      },
      {
        choiceId: 'tess_intro_listen',
        text: "[Wait. Let her talk.]",
        nextNodeId: 'tess_the_shop',
        pattern: 'patience',
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
        text: `Enough to retire. Buy a condo somewhere warm. Never worry about rent again.

*Laughs.*

My accountant thinks I'm insane for even hesitating.`,
        emotion: 'conflicted',
        interaction: 'nod',
        variation_id: 'offer_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_offer_rational',
        text: "Sounds like a smart deal. What's holding you back?",
        nextNodeId: 'tess_the_shop',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'tess_offer_emotional',
        text: "Money isn't everything.",
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
        text: `Started this place twelve years ago. Just me, two crates, and a dream.

Know how many artists played their first show here? Before anyone knew their names?

*Points to wall of photos.*

That kid right there. Now selling out arenas. First gig was in my back room to fifteen people.

This isn't a store. It's where real gets discovered before the algorithm buries it.`,
        emotion: 'passionate',
        interaction: 'bloom',
        variation_id: 'shop_v1',
        useChatPacing: true
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
        choiceId: 'tess_shop_romantic',
        text: "That matters. But can it pay the bills?",
        nextNodeId: 'tess_the_numbers',
        pattern: 'building',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'tess_shop_curious',
        text: "What made you start this?",
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
        text: `Was working corporate. Marketing. Good salary. Nice apartment.

Every day felt fake. Selling people things they didn't need with words that didn't mean anything.

Then one night. Small venue. Unknown band. Something real happened in that room.

Next morning I quit. Everyone thought I lost my mind.`,
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
        nextNodeId: 'tess_the_numbers',
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
        nextNodeId: 'tess_the_numbers',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'tess_phoniness',
    speaker: 'Tess',
    content: [
      {
        text: `Exactly. Streaming killed discovery. Everything optimized for engagement. Safe. Predictable.

Real music. The stuff that changes you. It's getting harder to find.

Someone has to catch it. Before it disappears.

*Gestures around.*

That's what this place does. Was. Is supposed to.`,
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
        nextNodeId: 'tess_the_numbers',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'problemSolving']
      },
      {
        choiceId: 'tess_phoniness_how',
        text: "But how? When the numbers don't work?",
        nextNodeId: 'tess_the_numbers',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'tess_the_numbers',
    speaker: 'Tess',
    content: [
      {
        text: `Here's reality. Vinyl sales cover rent. Barely.

Shows used to pay the rest. But venues closing everywhere. Competition with living rooms and headphones.

Last three months. Red. Red. Red.

Developer's offer sits on my desk like a loaded question.`,
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'numbers_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_numbers_pivot',
        text: "What if you pivoted? Changed the model?",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'building',
        skills: ['problemSolving', 'creativity'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'tess_numbers_accept',
        text: "Sometimes endings aren't failures.",
        nextNodeId: 'tess_decision_cautious_path',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'tess_numbers_explore',
        text: "What options have you considered?",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication']
      }
    ],
    tags: ['tess_arc', 'decision_point']
  },

  // ============= THE PITCH (Reinvention Scenario) =============
  {
    nodeId: 'tess_the_pitch_setup',
    speaker: 'Tess',
    content: [
      {
        text: `Ideas keep me up at night. But I can't see them clearly.

*Pulls out notebook.*

Help me think. What's the pitch? What could this place become?

Not just survive. Actually matter again.`,
        emotion: 'focused',
        interaction: 'nod',
        variation_id: 'pitch_setup_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
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
        text: `Online-only. Cut the physical space. Just ship records.

*Stares at the room.*

Then I'm just another website. Competing with Amazon. Why would anyone choose me?

The whole point was the space. The discovery. The human.`,
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
        text: `Community. Yes. People are lonely. Headphones isolate.

*Writing fast.*

Weekly listening sessions. Curated. Deep dives. Talk about what we're hearing.

Record club. Like book club. But for albums. Monthly memberships.

Not selling plastic. Selling belonging.`,
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
        altText: `Community. Yes. People are lonely. Headphones isolate.\n\n*Writing fast.*\n\nYou see it clearly. Connection. Belonging. That's what you've been pointing at in every conversation.\n\nNot selling plastic. Selling what people actually need.`,
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
        text: `Experience. Can't stream this.

*Gestures around.*

The smell of vinyl. The crackle before the first note. Someone handing you an album and saying "this will change you."

Maybe the business isn't records at all. It's curation. Discovery. The human recommending what no algorithm ever could.`,
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
        altText: `Experience. Can't stream this.\n\n*Gestures around.*\n\nYou're a builder. You see structures. Possibility in the bones of a thing.\n\nThe business isn't records. It's what we build around them.`,
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
        text: `*Stares at notebook. Pages of scrawl.*

This could work. Community hub. Experience destination. Local artist residency.

The B-Side 2.0.

Still scared. Still might fail.

But at least it means something.`,
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
        nextNodeId: 'tess_decision_made',
        pattern: 'building',
        skills: ['problemSolving', 'adaptability'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      },
      {
        choiceId: 'climax_time',
        text: "Take a week. Let it settle.",
        nextNodeId: 'tess_decision_made',
        pattern: 'patience',
        skills: ['leadership', 'emotionalIntelligence']
      },
      {
        choiceId: 'climax_explore',
        text: "What's the first step? Start there.",
        nextNodeId: 'tess_decision_made',
        pattern: 'exploring',
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
    }  },

  // ============= DECISIONS =============
  {
    nodeId: 'tess_decision_made',
    speaker: 'Tess',
    content: [
      {
        text: `*Picks up phone. Dials.*

"Mr. Harrison? Tess Rivera. About your offer. I'm going to have to decline."

*Pause.*

"Because I'm not done yet."

*Hangs up.*

Scared. Alive. Both.`,
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
        text: `*Looks around the room.*

Twelve years. That's a good run. Better than most.

Maybe the smart play is knowing when it's over.

*Picks up developer's card.*

I'll think about it.`,
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

  // ============= FAREWELLS =============
  {
    nodeId: 'tess_farewell',
    speaker: 'Tess',
    content: [
      {
        text: `You. Stranger walking in. Helped me see it.

Sometimes we need someone outside our own head.

*Hands you a record.*

House gift. Something I think you'll like.

Come back when we reopen. First listening session's on me.`,
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
        altText: `You're a builder. I saw it in how you think.\n\n*Hands you a record.*\n\nHouse gift. Something I think you'll like.\n\nCome back when we reopen. You might want to help build it.`,
        altEmotion: 'kindred'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: `You asked the right questions. Explorers always do.\n\n*Hands you a record.*\n\nHouse gift. Something I think you'll like.\n\nCome back when we reopen. Curious people belong here.`,
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
        text: `*Looks around one more time.*

If this is how it ends. At least it was real.

Twelve years of catching what mattered before it disappeared.

That's not nothing.`,
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
        text: `Enough about me. You walked into a record shop and helped a stranger figure out her life.

What are you looking for? What's your version of this?`,
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
        text: `*Nods.*

That's worth protecting. Whatever it is.

Don't let the phoniness get to it.

*Picks up phone again.*

I have some calls to make. Come back sometime.

And see Samuel. He'll want to know how this went.`,
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

  // ============= PHASE 2: THE PIVOT =============
  {
    nodeId: 'tess_phase2_entry',
    speaker: 'Tess',
    content: [
      {
        text: `Six weeks later. Back room converted. Listening stations. Coffee bar.

*Exhausted but alive.*

First listening session yesterday. Forty people. Sold out.

Problem: now I'm doing everything. Coffee. Curation. Community. Accounting. Dying.`,
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
        text: `Working: the vibe. People lingering. Conversations happening. Artists booking the space.

Not working: me. I haven't slept in three days. Made a customer cry yesterday because I snapped.

Money's still tight. But the energy... there's something here.

*Phone buzzes.*

Developer again. Raised the offer.`,
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
        text: `*Takes a breath.*

You're right. Can't catch anything if I fall first.

Know what's funny? I left corporate because it felt fake. Now I'm building my own business. Same pressure. But different.

This time it's real.`,
        emotion: 'determined',
        interaction: 'nod',
        variation_id: 'p2_solution_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'p2_next',
        text: "What's the first thing you'll change?",
        nextNodeId: 'tess_p2_resolution',
        pattern: 'building',
        skills: ['problemSolving']
      },
      {
        choiceId: 'p2_reflect',
        text: "Real matters more.",
        nextNodeId: 'tess_p2_resolution',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['phase2', 'tess_arc'],
    metadata: {
      sessionBoundary: true  // Session 2: Arc complete
    }  },

  {
    nodeId: 'tess_p2_resolution',
    speaker: 'Tess',
    content: [
      {
        text: `*Deletes developer's number.*

First: hire Maya. She's been helping volunteer. Knows the music. Needs a job.

Second: cap events at twice a week. Quality over quantity.

Third: remember why I'm doing this.

*Picks up record. Puts it on.*

This. This is why.`,
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
        text: `People keep asking if I regret not selling. Every time the rent comes due.

But last night. Kid came in. Maybe seventeen. Flipping through crates like I used to.

Watched her find something. Eyes went wide.

That moment. Can't stream that. Can't algorithm that.

That's what I'm catching.`,
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
        altText: `People keep asking if I regret not selling.\n\nBut you know the answer. You're a builder. You see what I'm building here.\n\nNot just a store. A place where real survives.\n\nThat's what we're catching.`,
        altEmotion: 'kindred'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: `People keep asking if I regret not selling.\n\nBut explorers like you understand. The question isn't profit. It's discovery.\n\nWhat happens in that moment when someone finds something real.\n\nThat's what we're catching.`,
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
        text: `*Pulls out album. Hands it over.*

For you. Something new. Artist playing here next month.

You showed up. Twice. Helped me see what I was building.

Don't be a stranger.`,
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
        text: `Next? Keep going. One album at a time. One listener at a time.

But I'm curious. What about you?

What are you building out there?`,
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
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'tess_arc', 'phase2']
  },

  {
    nodeId: 'tess_p2_reciprocity_response',
    speaker: 'Tess',
    content: [
      {
        text: `*Nods.*

Good. Keep at it. Whatever it is.

The world needs more real. Less algorithm. Less phony.

*Music swells.*

Go on. Samuel's waiting. Tell him The B-Side is still standing.`,
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
    tags: ['reciprocity', 'tess_arc', 'phase2']
  }
]

export const tessEntryPoints = {
  INTRODUCTION: 'tess_introduction',
  PHASE2_ENTRY: 'tess_phase2_entry'
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
