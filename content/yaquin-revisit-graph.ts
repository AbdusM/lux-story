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
        text: `*He's pacing again, but this time with a tablet. He looks tired but electric.*

It happened. It actually happened.{{yaquin_chose_practical:

Remember when you said to just start small? A mini-course instead of the whole thing? That's exactly what I did.|}}{{yaquin_chose_psych:

That psychology angle you pushed me toward. understanding *why* dental assistants struggle, not just what they struggle with. that's what resonated.|}}{{generous_refunds:

And the generous refund policy you suggested? Zero refund requests. People trust me because I trusted them first.|}}\n\nThe 'Alginate Mixing Hack' video? 400,000 views. I have 12,000 subscribers. My inbox is full of people asking for the course.

I... I don't know what to do.`,
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
        text: "That's incredible! You built an audience.",
        nextNodeId: 'yaquin_the_problem',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'yaquin_analyze_traffic',
        text: "That's a lot of traffic. What's the conversion rate?",
        nextNodeId: 'yaquin_the_problem',
        pattern: 'analytical',
        skills: ['digitalLiteracy', 'financialLiteracy']
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
        skills: ['leadership', 'creativity'],
        consequence: {
          addGlobalFlags: ['yaquin_chose_course']
        }
      },
      {
        choiceId: 'strat_membership',
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
        // Deep callbacks to both original arc choices and this revisit's choices
        text: `Thanks. Again.{{yaquin_chose_practical:

You told me to start small. I did. Now I'm scaling big.|}}{{yaquin_chose_psych:

You pushed me to understand the psychology, not just the technique. That's why the community stuck around.|}}{{credentialed_advisor:

Getting that advisor you suggested? Best decision I made. She's helped me avoid so many beginner mistakes.|}}\n\nFirst you helped me start. Now you're helping me scale.{{yaquin_chose_course:

A real course. A real product. My product.|}}{{yaquin_chose_membership:

A real community. Not just viewers. a tribe.|}}{{yaquin_chose_sponsorship:

The sponsorship money is buying me freedom to build something real.|}}\n\nI guess this is what a Founder's journey looks like. It never stops being scary, does it?`,
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
        text: "[Builder's Drive] You've built it. Now it's time to launch it. Need a hand hitting publish?",
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
        text: `You know about the course.

Eight months. Forty-seven lessons. Every technique I've mastered over ten years, distilled into video.

But now it's sitting in draft mode. The "Publish" button is right there, and I... I can't click it.

What if nobody enrolls? What if the one student who does says I'm a fraud? That I should have gone to college like everyone else?

I know this is good. I know people need this. But launching means the world gets to judge it. Gets to judge me.

You understand building. Would you... be there when I hit publish? Just so I'm not alone when I find out if this was all worth it?`,
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
        text: `You're right. I built this. All of it.

I don't need someone holding my hand. I just needed someone to remind me that it's real.

Okay. I'm doing this. Tonight.

Thanks for believing in it. That's enough.`,
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
        text: `Thank you. God, thank you.

Okay. Let's do this. Together.

Here we go. "Dental Assisting Fundamentals: From Certified to Confident."

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
