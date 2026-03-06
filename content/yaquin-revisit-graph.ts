/**
 * Yaquin's Revisit Graph (Phase 2)
 * The Scaling Problem - 10k Subscribers & Monetization
 *
 * Context: Triggered after `yaquin_arc_complete` + (optional time delay logic via Samuel)
 * Core Conflict: "Audience Love" vs. "Business Sustainability"
 * Arc: Moving from Creator (making content) to Entrepreneur (building a business)
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'
import { buildDialogueNodesMap } from './drafts/draft-filter'

export const yaquinRevisitNodes: DialogueNode[] = [
  // ============= WELCOME BACK =============
  {
    nodeId: 'yaquin_revisit_welcome',
    speaker: 'Yaquin',
    content: [
      {
        // Deep callbacks to specific moments from the first arc
        text: `*He's pacing with a tablet, tired but electric.*

It happened{{yaquin_chose_practical:

 — your start-small advice worked: I shipped a mini-course first|}}{{yaquin_chose_psych:

 — your psychology angle landed: *why* assistants struggle, not just what|}}{{generous_refunds:

 — your refund policy worked: zero requests and higher trust|}}: the "Alginate Mixing Hack" hit 400,000 views, I have 12,000 subscribers, and requests keep flooding in.

I don't know what to do next.`,
        emotion: 'overwhelmed_excited',
        variation_id: 'revisit_intro_v2_callbacks',
        richEffectContext: 'thinking'
      }
    ],
    // Belt-and-suspenders: graph registry already only routes here once the arc is complete,
    // but we still gate the entry node to keep the content contract self-contained.
    requiredState: {
      hasGlobalFlags: ['yaquin_arc_complete']
    },
    choices: [
      {
        choiceId: 'yaquin_celebrate',
        taxonomyClass: 'accept',
        text: "That's incredible!",
        nextNodeId: 'yaquin_the_problem',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'yaquin_analyze_traffic',
        taxonomyClass: 'reject',
        text: "That's a lot of traffic. What's the conversion rate?",
        nextNodeId: 'yaquin_the_problem',
        pattern: 'exploring',
        skills: ['digitalLiteracy', 'financialLiteracy']
      },
      {
        choiceId: 'yaquin_ask_problem',
        taxonomyClass: 'deflect',
        text: "Why is that a problem? You have customers.",
        nextNodeId: 'yaquin_the_problem',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ],
    tags: ['revisit', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_the_problem',
    speaker: 'Yaquin',
    content: [
      {
        text: `I'm still full-time at the clinic, answering comments at 2 AM while sponsors push quick endorsements.

Every option has a cost: sell credibility, delay revenue, or quit too soon.

Help me choose the strategy.`,
        emotion: 'anxious',
        variation_id: 'the_problem_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_monetization_strategy',
        text: "You need a monetization strategy, not a reaction.",
        nextNodeId: 'yaquin_strategy_session',
        pattern: 'building',
        skills: ['criticalThinking', 'financialLiteracy']
      }
    ]
  },

  // ============= STRATEGY SESSION =============
  {
    nodeId: 'yaquin_strategy_session',
    speaker: 'Yaquin',
    content: [
      {
        text: `Okay, strategy: A sponsorship cash now, B launch "Chairside Masterclass" at $497, C membership at $10/month with weekly tips.

Which path builds a real school?`,
        emotion: 'calculating',
        variation_id: 'strategy_session_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'strat_course',
        taxonomyClass: 'accept',
        text: "Launch the Course.",
        nextNodeId: 'yaquin_course_path',
        pattern: 'building',
        skills: ['leadership', 'creativity'],
        consequence: {
          addGlobalFlags: ['yaquin_chose_course']
        }
      },
      {
        choiceId: 'strat_membership',
        taxonomyClass: 'reject',
        text: "Membership. Build a community of practice, not just a transaction.",
        nextNodeId: 'yaquin_membership_path',
        pattern: 'helping',
        skills: ['collaboration', 'financialLiteracy'],
        consequence: {
          addGlobalFlags: ['yaquin_chose_membership']
        }
      },
      {
        choiceId: 'strat_sponsorship',
        taxonomyClass: 'deflect',
        text: "Sponsorships give you runway to quit your job. Then build the course.",
        nextNodeId: 'yaquin_sponsorship_path',
        pattern: 'analytical',
        skills: ['problemSolving', 'financialLiteracy'],
        consequence: {
          addGlobalFlags: ['yaquin_chose_sponsorship']
        }
      }
    ],
    tags: ['revisit', 'yaquin_arc', 'business_decision']
  },

  // --- Path A: The Course ---
  {
    nodeId: 'yaquin_course_path',
    speaker: 'Yaquin',
    content: [
      {
        text: `You're right: ads make me an influencer, but a course makes me an educator.

Charging $500 is scary, yet one raise negotiation could repay it.

I'm launching "The Chairside Masterclass" next week.`,
        emotion: 'determined',
        variation_id: 'course_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'course_support',
        text: "Your audience is ready.",
        nextNodeId: 'yaquin_revisit_farewell',
        pattern: 'helping',
        skills: ['leadership']
      }
    ],
    tags: ['revisit', 'yaquin_arc']
  },

  // --- Path B: Membership ---
  {
    nodeId: 'yaquin_membership_path',
    speaker: 'Yaquin',
    content: [
      {
        text: `A community, yes: "The Assistant's Lounge."

They're lonely and need peers, not just my voice.

Recurring revenue lets me leave the clinic safely and build a real network.`,
        emotion: 'inspired',
        variation_id: 'membership_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'membership_support',
        text: "Community is the strongest moat.",
        nextNodeId: 'yaquin_revisit_farewell',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['revisit', 'yaquin_arc']
  },

  // --- Path C: Sponsorship ---
  {
    nodeId: 'yaquin_sponsorship_path',
    speaker: 'Yaquin',
    content: [
      {
        text: `Runway is the smart play; I can't film a masterclass while working full-time.

I'll take one floss sponsorship, buy better gear, and buy time.

It feels messy, but it's a bridge to freedom.`,
        emotion: 'pragmatic',
        variation_id: 'sponsorship_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'sponsorship_support',
        text: "Capital is a tool.",
        nextNodeId: 'yaquin_revisit_farewell',
        pattern: 'analytical',
        skills: ['financialLiteracy']
      }
    ],
    tags: ['revisit', 'yaquin_arc']
  },

  // ============= FAREWELL =============
  {
    nodeId: 'yaquin_revisit_farewell',
    speaker: 'Yaquin',
    content: [
      {
        // Deep callbacks to both original arc choices and this revisit's choices
        text: `Thanks again.{{yaquin_chose_practical:

You told me to start small, and I did.|}}{{yaquin_chose_psych:

You pushed me toward psychology, not just technique.|}}{{credentialed_advisor:

Getting that advisor you suggested was my best move.|}}\n\nFirst you helped me start, now you're helping me scale.{{yaquin_chose_course:

A real course and a real product.|}}{{yaquin_chose_membership:

A real community, not just viewers.|}}{{yaquin_chose_sponsorship:

Sponsorship money is buying me freedom to build something real.|}}\n\nI guess this is a founder's journey; it never stops being scary, does it?`,
        emotion: 'grateful_mature',
        variation_id: 'revisit_farewell_v2_callbacks'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_revisit',
        text: "That means you're growing.",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY, // Loops back to Samuel
        pattern: 'patience',
        visibleCondition: {
          hasGlobalFlags: ['yaquin_arc_complete'],
          lacksGlobalFlags: ['reflected_on_yaquin']
        }
      },
      // Loyalty Experience trigger - only visible at high trust + building pattern
      {
        choiceId: 'offer_launch_help',
        text: "[Builder's Drive] You built it. Ready to hit publish together?",
        nextNodeId: 'yaquin_loyalty_trigger',
        pattern: 'building',
        skills: ['selfMarketing', 'contentCreation'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { building: { min: 50 } }
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_phase_2_complete']
      }
    ],
    tags: ['revisit', 'yaquin_arc']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'yaquin_loyalty_trigger',
    speaker: 'Yaquin',
    content: [
      {
        text: `Eight months, forty-seven lessons, still in draft because I can't press Publish.

If I launch, they judge the course and me.

Will you stay while I hit the button?`,
        emotion: 'anxious_vulnerable',
        variation_id: 'loyalty_trigger_v1',
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 8 },
      patterns: { building: { min: 5 } }
    },
    metadata: {
      experienceId: 'the_launch'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_launch_challenge',
        text: "Let's launch this together. Your expertise deserves to be seen.",
        nextNodeId: 'yaquin_loyalty_start',
        pattern: 'building',
        skills: ['selfMarketing', 'contentCreation'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Yaquin, you've already built something incredible. Trust your work.",
        nextNodeId: 'yaquin_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'yaquin_loyalty', 'high_trust']
  },

  {
    nodeId: 'yaquin_loyalty_declined',
    speaker: 'Yaquin',
    content: [
      {
        text: `You're right: I built this, and I can launch it.

I didn't need rescue, just a reminder that it's real.

I'm publishing tonight, and thanks for believing in me.`,
        emotion: 'resolved_determined',
        variation_id: 'loyalty_declined_v1'
      }
    ],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "Your students are going to learn so much. Go show them.",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'patience',
        visibleCondition: {
          hasGlobalFlags: ['yaquin_arc_complete'],
          lacksGlobalFlags: ['reflected_on_yaquin']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'yaquin_loyalty_start',
    speaker: 'Yaquin',
    content: [
      {
        text: `Thank you, seriously.

Let's do this together: "Dental Assisting Fundamentals: From Certified to Confident."

Ready?`,
        emotion: 'nervous_hopeful',
        variation_id: 'loyalty_start_v1'
      }
    ],
    metadata: {
      experienceId: 'the_launch'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  }
]

// Export entry points
export const yaquinRevisitEntryPoints = {
  WELCOME: 'yaquin_revisit_welcome'
} as const

export const yaquinRevisitGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: buildDialogueNodesMap('yaquin_revisit', yaquinRevisitNodes),
  startNodeId: yaquinRevisitEntryPoints.WELCOME,
  metadata: {
    title: "Yaquin: Scaling Up",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: yaquinRevisitNodes.length,
    totalChoices: yaquinRevisitNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
