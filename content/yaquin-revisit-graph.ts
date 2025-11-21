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

export const yaquinRevisitNodes: DialogueNode[] = [
  // ============= WELCOME BACK =============
  {
    nodeId: 'yaquin_revisit_welcome',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He's pacing again, but this time with a tablet. He looks tired but electric.*

It happened. It actually happened.

The 'Alginate Mixing Hack' video? 400,000 views. I have 12,000 subscribers. My inbox is full of people asking for the course.

I... I don't know what to do.`,
        emotion: 'overwhelmed_excited',
        variation_id: 'revisit_intro_v1',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_celebrate',
        text: "That's incredible! You built an audience.",
        nextNodeId: 'yaquin_the_problem',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'encouragement']
      },
      {
        choiceId: 'yaquin_analyze_traffic',
        text: "That's a lot of traffic. What's the conversion rate?",
        nextNodeId: 'yaquin_the_problem',
        pattern: 'analytical',
        skills: ['dataLiteracy', 'businessAcumen']
      },
      {
        choiceId: 'yaquin_ask_problem',
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
        text: `The problem is... I'm still working full-time at the clinic. I'm answering YouTube comments at 2 AM.

And now brands are emailing me. 'Sponsor our dental floss!' 'Review our curing light!'

Do I sell out? Do I launch the paid course now? Do I quit my job? I feel like I'm holding a tiger by the tail.`,
        emotion: 'anxious',
        variation_id: 'the_problem_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_monetization_strategy',
        text: "You need a monetization strategy, not just a reaction.",
        nextNodeId: 'yaquin_strategy_session',
        pattern: 'building',
        skills: ['strategicThinking', 'businessModel']
      }
    ]
  },

  // ============= STRATEGY SESSION =============
  {
    nodeId: 'yaquin_strategy_session',
    speaker: 'Yaquin',
    content: [
      {
        text: `Okay. Strategy. 

Option A: Take the sponsorship money. Quick cash, easy.

Option B: Launch the 'Chairside Masterclass' for $497. High effort, high reward.

Option C: Membership. $10/month for weekly tips. Recurring revenue.

Which one builds a real school?`,
        emotion: 'calculating',
        variation_id: 'strategy_session_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'strat_course',
        text: "Launch the Course. Own your product. Don't rent your audience to sponsors.",
        nextNodeId: 'yaquin_course_path',
        pattern: 'building',
        skills: ['entrepreneurship', 'productStrategy'],
        consequence: {
          addGlobalFlags: ['yaquin_chose_course']
        }
      },
      {
        choiceId: 'strat_membership',
        text: "Membership. Build a community of practice, not just a transaction.",
        nextNodeId: 'yaquin_membership_path',
        pattern: 'helping',
        skills: ['communityBuilding', 'businessModel'],
        consequence: {
          addGlobalFlags: ['yaquin_chose_membership']
        }
      },
      {
        choiceId: 'strat_sponsorship',
        text: "Sponsorships give you runway to quit your job. Then build the course.",
        nextNodeId: 'yaquin_sponsorship_path',
        pattern: 'analytical',
        skills: ['riskManagement', 'financialLiteracy'],
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
        text: `You're right. If I take ads, I'm just an influencer. If I sell a course, I'm an educator.

It's scary though. Asking for $500. But I know the value is there. One raise negotiation pays for it.

I'm going to do it. 'The Chairside Masterclass.' Launching next week.`,
        emotion: 'determined',
        variation_id: 'course_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'course_support',
        text: "Your audience is ready. They trust you.",
        nextNodeId: 'yaquin_revisit_farewell',
        pattern: 'helping',
        skills: ['empowerment']
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
        text: `A community. Yeah. 'The Assistant's Lounge.'

They're lonely. They want to talk to each other, not just listen to me.

Recurring revenue means I can quit the clinic safely. And I build a tribe, not just a customer list.`,
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
        skills: ['strategicThinking']
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
        text: `Runway. That's the smart play. I can't film a masterclass while working 40 hours a week.

I'll take the dental floss deal. Use the cash to buy better lights, a mic, and... time.

It feels like selling out a little, but it's actually buying my freedom.`,
        emotion: 'pragmatic',
        variation_id: 'sponsorship_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'sponsorship_support',
        text: "Capital is a tool. Use it to build the school.",
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
        text: `Thanks. Again. 

First you helped me start. Now you're helping me scale.

I guess this is what a Founder's journey looks like. It never stops being scary, does it?`,
        emotion: 'grateful_mature',
        variation_id: 'revisit_farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_revisit',
        text: "That means you're growing.",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY, // Loops back to Samuel
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_phase_2_complete']
      }
    ],
    tags: ['revisit', 'yaquin_arc']
  }
]

// Export entry points
export const yaquinRevisitEntryPoints = {
  WELCOME: 'yaquin_revisit_welcome'
} as const

export const yaquinRevisitGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(yaquinRevisitNodes.map(node => [node.nodeId, node])),
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
