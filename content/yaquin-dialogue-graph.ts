/**
 * Yaquin's Dialogue Graph
 * The Practical Educator - Platform 5 (Creator Economy / EdTech)
 *
 * CHARACTER: The Dental Assistant turned Educator
 * Core Conflict: "I'm just an assistant" vs. "I know the real job better than the textbook"
 * Arc: Moving from tacit knowledge to explicit instruction (Curriculum Design & Business Logic)
 * Mechanic: "The Blueprint" - Structuring a cohort-based course and tech stack
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const yaquinDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'yaquin_introduction',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He's sitting on a bench, aggressively highlighting a thick textbook with a red marker. He groans, crossing out an entire paragraph.*

'Nobody holds the suction tip like that! You'll gag the patient!'

*He looks up, realizing you're there.*

Sorry. I'm just... correcting the 'official' curriculum. It's fifty years out of date.`,
        emotion: 'frustrated_passionate',
        variation_id: 'yaquin_intro_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_intro_validate',
        text: "The map isn't the territory. You know the reality.",
        nextNodeId: 'yaquin_gap_reveal',
        pattern: 'analytical',
        skills: ['criticalThinking', 'culturalCompetence'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_intro_curious',
        text: "Why are you rewriting a textbook?",
        nextNodeId: 'yaquin_gap_reveal',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'yaquin_intro_practical',
        text: "What's the right way to hold it?",
        nextNodeId: 'yaquin_practical_demo',
        pattern: 'building',
        skills: ['digitalLiteracy'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_practical_demo',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He lights up, mimicking the motion.*

Modified pen grasp, rolled slightly distal. Keeps the tongue back, clear line of sight for the doctor, patient breathes easy.

See? Simple. But this book spends three pages on 'historical suction methods' and zero on patient comfort.`,
        emotion: 'confident_teacher',
        variation_id: 'practical_demo_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_should_teach',
        text: "You just taught me that in ten seconds. You should be teaching this.",
        nextNodeId: 'yaquin_impostor_hurdle',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'yaquin_gap_reveal',
    speaker: 'Yaquin',
    content: [
      {
        text: `Because I have three trainees starting Monday. They all paid $15,000 for a certificate, and they don't know how to mix alginate without making a mess.

I have to retrain them from scratch every time. It's exhausting. I wish I could just... download my brain into theirs before they walk in the door.`,
        emotion: 'tired',
        variation_id: 'gap_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_suggest_course',
        text: "You could. Have you thought about making your own course?",
        nextNodeId: 'yaquin_impostor_hurdle',
        pattern: 'building',
        skills: ['leadership', 'problemSolving']
      },
      {
        choiceId: 'yaquin_system_issue',
        text: "That sounds like a systemic failure in dental education.",
        nextNodeId: 'yaquin_impostor_hurdle',
        pattern: 'analytical',
        skills: ['problemSolving']
      }
    ]
  },

  // ============= THE IMPOSTOR HURDLE =============
  {
    nodeId: 'yaquin_impostor_hurdle',
    speaker: 'Yaquin',
    content: [
      {
        text: `Me? Teach a course? I'm just a dental assistant. I don't have a PhD. I don't have a campus.

I just know how to do the job so you don't get fired on day one.

Besides, how would I even do that? Just... put videos online?`,
        emotion: 'skeptical_insecure',
        variation_id: 'impostor_hurdle_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_cohort_idea',
        text: "Not just videos. A cohort. Teach a small group live, online.",
        nextNodeId: 'yaquin_cohort_explanation',
        pattern: 'building',
        skills: ['creativity', 'financialLiteracy'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_youtube_idea',
        text: "Start with YouTube. Solve the specific problems people are searching for.",
        nextNodeId: 'yaquin_youtube_strategy',
        pattern: 'building',
        skills: ['digitalLiteracy', 'communication']
      },
      {
        choiceId: 'yaquin_value_proposition',
        text: "The value isn't the PhD. It's the practical survival skills.",
        nextNodeId: 'yaquin_curriculum_design',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2
        }
      }
    ]
  },

  // ============= THE MECHANICS (Tech Stack & Strategy) =============
  {
    nodeId: 'yaquin_cohort_explanation',
    speaker: 'Yaquin',
    content: [
      {
        text: `A cohort? You mean like... a bootcamp? But for dental assisting?

So instead of a 2-year degree, I give them a 6-week intensive on the stuff that actually matters?

But how do I... charge for that? How do I find them?`,
        emotion: 'curious_overwhelmed',
        variation_id: 'cohort_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_tech_stack',
        text: "Keep it simple. Landing page, mailing list, payment link.",
        nextNodeId: 'yaquin_tech_stack_details',
        pattern: 'analytical',
        skills: ['digitalLiteracy', 'problemSolving']
      }
    ]
  },

  {
    nodeId: 'yaquin_youtube_strategy',
    speaker: 'Yaquin',
    content: [
      {
        text: `YouTube... 'How to mix alginate.' 'How to set up a tray.'

I guess I could record that on my phone in the clinic after hours.

But how does that become a business? I can't pay rent with 'likes.'`,
        emotion: 'calculating',
        variation_id: 'youtube_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_funnel_strategy',
        text: "YouTube builds trust. Then you invite them to a paid workshop.",
        nextNodeId: 'yaquin_tech_stack_details',
        pattern: 'building',
        skills: ['communication', 'financialLiteracy']
      }
    ]
  },

  {
    nodeId: 'yaquin_tech_stack_details',
    speaker: 'Yaquin',
    content: [
      {
        text: `Okay, slow down. I know teeth, not tech.

You're saying I don't need to build a whole university website?

I just need... a way to capture emails and a way to take money?`,
        emotion: 'processing',
        variation_id: 'tech_stack_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'yaquin_email_first',
        text: "The list is your asset. Start a newsletter with tips.",
        nextNodeId: 'yaquin_curriculum_design',
        pattern: 'building',
        skills: ['collaboration', 'communication']
      },
      {
        choiceId: 'yaquin_presell',
        text: "Pre-sell it. Don't build the course until 10 people pay.",
        nextNodeId: 'yaquin_presell_revelation',
        pattern: 'analytical',
        skills: ['problemSolving', 'criticalThinking']
      }
    ]
  },

  {
    nodeId: 'yaquin_presell_revelation',
    speaker: 'Yaquin',
    content: [
      {
        text: `Wait. Ask for money *before* I film the videos?

That sounds... scary. But also smart. If nobody buys it, I haven't wasted three months filming.

Okay. Say I get the 10 people. What do I actually teach them? I can't teach *everything* in 6 weeks.`,
        emotion: 'epiphany',
        variation_id: 'presell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_curriculum_cut',
        text: "That's the secret. You have to cut 80% of the fluff.",
        nextNodeId: 'yaquin_curriculum_design',
        pattern: 'analytical',
        skills: ['timeManagement', 'creativity']
      }
    ]
  },

  // ============= CURRICULUM DESIGN (Immersive Scenario) =============
  {
    nodeId: 'yaquin_curriculum_design',
    speaker: 'Yaquin',
    content: [
      {
        text: "*He slams the notebook onto the bench. A messy list of 20 topics fills the page.* \n\n**SYSTEM ACTIVE: CURRICULUM BUILDER v0.1** \n**CONSTRAINT:** 6 Weeks \n**GOAL:** Job Readiness \n\nI can't teach it all. I have to cut. \n\n*He hands you the red marker.* \n\nWhat goes? Be ruthless.",
        emotion: 'focused_work',
        variation_id: 'curriculum_scenario_v1',
        richEffectContext: 'warning' // Blueprint/Editor Mode
      }
    ],
    choices: [
      {
        choiceId: 'edit_cut_history',
        text: "[ACTION] Cross out 'History of Dentistry (1800-1950)'. It's trivia, not a skill.",
        nextNodeId: 'yaquin_focused_curriculum', // Re-using this node ID for the success state
        pattern: 'building',
        skills: ['creativity', 'criticalThinking'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 2,
          addKnowledgeFlags: ['helped_curriculum']
        }
      },
      {
        choiceId: 'edit_keep_soft',
        text: "[ACTION] Circle 'Patient Etiquette'. Keep it. That's what gets them hired.",
        nextNodeId: 'yaquin_soft_skills_focus',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'edit_condense',
        text: "[ACTION] Draw an arrow merging 'Anatomy' and 'Assisting'. Teach them together.",
        nextNodeId: 'yaquin_overwhelmed_response',
        pattern: 'analytical',
        skills: ['problemSolving']
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'immersive_scenario']
  },

  {
    nodeId: 'yaquin_focused_curriculum',
    speaker: 'Yaquin',
    content: [
      {
        text: "*The red ink bleeds into the paper. Half the list is gone.* \n\nIt looks... clean. \n\n**'The 6-Week Chairside Sprint.'** \n\nNo fluff. Just the skills that make you indispensable. \n\nThat's the product.",
        emotion: 'excited_clarity',
        variation_id: 'focused_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_launch_plan',
        text: "Now you just need to launch it.",
        nextNodeId: 'yaquin_climax_launch',
        pattern: 'building',
        skills: ['timeManagement']
      }
    ]
  },

  {
    nodeId: 'yaquin_soft_skills_focus',
    speaker: 'Yaquin',
    content: [
      {
        text: `That's true. Most firings happen because of attitude, not aptitude.

**'The Professional Assistant.'** Half clinical skills, half patient management. How to calm a terrified kid. How to manage a stressed doctor.

That's a niche nobody else is filling.`,
        emotion: 'thoughtful_clarity',
        variation_id: 'soft_skills_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_launch_plan_soft',
        text: "It's a premium offering. Launch it.",
        nextNodeId: 'yaquin_climax_launch',
        pattern: 'helping',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'yaquin_overwhelmed_response',
    speaker: 'Yaquin',
    content: [
      {
        text: `I... I guess. But that's what the colleges do. They cram it all in, and the students remember none of it.

If I do that, I'm just a cheaper version of a bad product.

No. I need to be different. I need to be *effective*.`,
        emotion: 'determined_correction',
        variation_id: 'overwhelmed_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_recorrect_cut',
        text: "You're right. Be bold. Cut the history.",
        nextNodeId: 'yaquin_focused_curriculum',
        pattern: 'analytical',
        skills: ['adaptability']
      }
    ]
  },

  // ============= CLIMAX: THE LAUNCH =============
  {
    nodeId: 'yaquin_climax_launch',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He pulls out his phone, opening Instagram.*

I have 500 followers. Mostly other assistants complaining about their backs.

I'm going to post it. 'Beta Cohort: Master Chairside Skills in 6 Weeks.' Link in bio to a simple form.

If I do this... I'm not just an assistant anymore. I'm a founder.`,
        emotion: 'nervous_anticipation',
        variation_id: 'climax_launch_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'yaquin_push_button',
        text: "Post it. You have something they need.",
        nextNodeId: 'yaquin_ending_success',
        pattern: 'building',
        skills: ['adaptability', 'leadership']
      },
      {
        choiceId: 'yaquin_hesitate',
        text: "Maybe draft the email list first?",
        nextNodeId: 'yaquin_ending_cautious',
        pattern: 'analytical',
        skills: ['problemSolving']
      }
    ]
  },

  {
    nodeId: 'yaquin_ending_success',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He taps the screen. Takes a deep breath.*

It's up. 

Already a comment: 'Does this cover digital impressions?'

I know digital impressions. I can teach that.

Wow. I'm doing this.`,
        emotion: 'joyful_disbelief',
        variation_id: 'ending_success_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell',
        text: "You're an educator now, Yaquin.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'helping',
        skills: ['leadership']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_launched']
      }
    ],
    tags: ['ending', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_ending_cautious',
    speaker: 'Yaquin',
    content: [
      {
        text: `Yeah. Email first. Less pressure.

I'll write a guide: '5 Things Dental School Didn't Teach You.' Free download in exchange for email.

Build the audience, then sell the course. Smart.`,
        emotion: 'settled_plan',
        variation_id: 'ending_cautious_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell_safe',
        text: "That's a solid strategy.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_building_audience']
      }
    ],
    tags: ['ending', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_farewell',
    speaker: 'Yaquin',
    content: [
      {
        text: `Thank you. I came here looking for a new job, but I think I just invented one instead.

I'm going to go record that video on alginate mixing. 

See you around the station.`,
        emotion: 'grateful',
        variation_id: 'farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_yaquin',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'yaquin_arc']
  }
]

export const yaquinEntryPoints = {
  INTRODUCTION: 'yaquin_introduction'
} as const

export const yaquinDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(yaquinDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: yaquinEntryPoints.INTRODUCTION,
  metadata: {
    title: "Yaquin's Course",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: yaquinDialogueNodes.length,
    totalChoices: yaquinDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}