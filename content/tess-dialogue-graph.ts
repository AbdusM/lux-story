/**
 * Tess's Dialogue Graph
 * The Visionary Founder - The Waiting Room (Education Reform)
 *
 * CHARACTER: The Aspiring School Founder
 * Core Conflict: Security of a counselor job vs. the risk of founding a radical new school
 * Arc: Validating "Experiential Learning" as legitimate education
 * Mechanic: "The Pitch" - Helping Tess refine her manifesto/grant proposal
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const tessDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'tess_introduction',
    speaker: 'Tess',
    content: [
      {
        text: `*She's pacing the Waiting Room, hiking boots clunking against the marble floor. She's wearing a blazer over a flannel shirt.*

*She stops, staring at a corkboard covered in index cards.*

'Not rigor. Resilience. No, that sounds too soft. Grit? No, that's overused.'

*She turns to you, eyes wide.*

Hey. You look like you've been outside recently. Does 'Wilderness Immersion' sound like a vacation or a crucible?`,
        emotion: 'frantic_focused',
        variation_id: 'tess_intro_v1',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'tess_intro_crucible',
        text: "It sounds like hard work. A crucible.",
        nextNodeId: 'tess_validates_crucible',
        pattern: 'building',
        skills: ['communication', 'criticalThinking'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_intro_vacation',
        text: "Honestly? It sounds like a camping trip.",
        nextNodeId: 'tess_defends_rigor',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'tess_intro_curious',
        text: "What are you trying to name?",
        nextNodeId: 'tess_explains_school',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication']
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
    nodeId: 'tess_validates_crucible',
    speaker: 'Tess',
    content: [
      {
        text: `Exactly. It's not s'mores and ghost stories. It's twelve weeks on the Appalachian Trail with thirty pounds on your back and no phone.

I'm trying to explain to a grant committee why that teaches you more than AP Calculus.`,
        emotion: 'passionate',
        variation_id: 'crucible_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_ask_school',
        text: "You're starting a hiking program?",
        nextNodeId: 'tess_explains_school',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'tess_relate_learning',
        text: "Real learning happens when you're uncomfortable.",
        nextNodeId: 'tess_explains_school',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'tess_defends_rigor',
    speaker: 'Tess',
    content: [
      {
        text: `See, that's the problem. That's what the investors hear. 'Camping.'

They don't see the decision-making. The logistics. The conflict resolution when you're wet, hungry, and lost at 4,000 feet.

I need to make them see the *curriculum* inside the chaos.`,
        emotion: 'frustrated_determined',
        variation_id: 'defends_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_ask_curriculum',
        text: "So translate it. What's the curriculum?",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'building',
        skills: ['communication', 'communication']
      }
    ]
  },

  // ============= THE BACKSTORY =============
  {
    nodeId: 'tess_explains_school',
    speaker: 'Tess',
    content: [
      {
        text: `I'm trying to restart 'Walkabout.'

It was this incredible program in Philly. Instead of senior year—sitting in rows, taking standardized tests—you went out. Hiked the trail. Did service projects. Built your own syllabus.

I did it ten years ago. It changed my life. I learned more about leadership in those woods than I did in four years of college.`,
        emotion: 'nostalgic_inspired',
        variation_id: 'school_story_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_what_happened',
        text: "What happened to the program?",
        nextNodeId: 'tess_defunding_reveal',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'tess_why_founder',
        text: "And now you want to bring it back?",
        nextNodeId: 'tess_founder_motivation',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'tess_defunding_reveal',
    speaker: 'Tess',
    content: [
      {
        text: `Defunded. 'Not enough measurable outcomes.' 'High liability.'

They want spreadsheets. They want test scores. You can't put 'learned how to trust myself' on a scantron sheet.

So I'm starting my own. 'The Apex Semester.' But I need $250,000 in seed funding, and my pitch deck is... well, it's messy.`,
        emotion: 'determined_anxious',
        variation_id: 'defunding_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_help_pitch',
        text: "Let me help you with the pitch.",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'building',
        skills: ['collaboration', 'communication'],
        consequence: {
          characterId: 'tess',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'tess_founder_motivation',
    speaker: 'Tess',
    content: [
      {
        text: `I have a safe job right now. Career Counselor at the high school. Pension. Health insurance. Summer break.

But I see these kids... they're burnt out at 17. They don't need another AP class. They need to know they can survive something hard.

If I do this, I quit the safe job. No net.`,
        emotion: 'vulnerable',
        variation_id: 'motivation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_risk_validation',
        text: "The safe path isn't always the right path.",
        nextNodeId: 'tess_defunding_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'problemSolving'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ]
  },

  // ============= THE PITCH (Immersive Scenario) =============
  {
    nodeId: 'tess_the_pitch_setup',
    speaker: 'Tess',
    content: [
      {
        text: "*She thrusts a tablet into your hands. The slide is a wall of text. Bullets, charts, paragraphs.* \n\n**SYSTEM ACTIVE: DECK EDITOR v2.0** \n**CURRENT SLIDE:** 'The Pedagogical Benefits of Wilderness Immersion for Adolescent Neural Development' \n\nToo long. Too academic. They'll fall asleep. \n\n*The cursor blinks at the headline.* \n\nFix it. What are we actually selling?",
        emotion: 'focused_work_mode',
        variation_id: 'pitch_scenario_v1',
        richEffectContext: 'warning', // Editor Mode
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'pitch_resilience',
        text: "[ACTION] Delete the paragraph. Type: 'FORGING ANTIFRAGILE LEADERS.'",
        nextNodeId: 'tess_pitch_resilience',
        pattern: 'building',
        skills: ['criticalThinking', 'communication', 'creativity']
      },
      {
        choiceId: 'pitch_mental_health',
        text: "[ACTION] Highlight the burnout stats. Type: 'THE CURE FOR ACADEMIC EXHAUSTION.'",
        nextNodeId: 'tess_pitch_mental_health',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'pitch_skills',
        text: "[ACTION] Focus on the outcomes. Type: 'REAL-WORLD PROJECT MANAGEMENT LAB.'",
        nextNodeId: 'tess_pitch_skills',
        pattern: 'analytical',
        skills: ['communication', 'culturalCompetence']
      }
    ],
    tags: ['pitch_mechanic', 'tess_arc', 'immersive_scenario']
  },

  // --- Pitch Variation: Resilience ---
  {
    nodeId: 'tess_pitch_resilience',
    speaker: 'Tess',
    content: [
      {
        text: `'Antifragile.' I like that. Investors love that word.

So the hike isn't about nature. It's about... stress inoculation? Learning to thrive in chaos?

Yes. 'We don't teach history; we teach how to make history when the map runs out.'`,
        emotion: 'inspired',
        variation_id: 'pitch_resilience_v1'
      }
    ],
    choices: [
      {
        choiceId: 'pitch_resilience_affirm',
        text: "Exactly. You're building leaders, not hikers.",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_pitch_resilience']
      }
    ]
  },

  // --- Pitch Variation: Mental Health ---
  {
    nodeId: 'tess_pitch_mental_health',
    speaker: 'Tess',
    content: [
      {
        text: `Burnout. God, yes. The suicide rates, the anxiety... schools are pressure cookers.

So this isn't a gap year. It's a reset. 'Disconnect to Reconnect.'

'We give students the one thing high school steals: Their agency.'`,
        emotion: 'empathetic_determined',
        variation_id: 'pitch_mental_health_v1'
      }
    ],
    choices: [
      {
        choiceId: 'pitch_mental_health_affirm',
        text: "That's the mission. Wellness is the foundation of success.",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_pitch_mental_health']
      }
    ]
  },

  // --- Pitch Variation: Skills ---
  {
    nodeId: 'tess_pitch_skills',
    speaker: 'Tess',
    content: [
      {
        text: `Right. Translate it into corporate speak. 

Setting up camp in a storm? 'Crisis Management.'
Navigating by compass? 'Strategic Planning.'
Cooking for 12 people on a fire? 'Resource Allocation.'

It's an executive MBA for 18-year-olds.`,
        emotion: 'analytical_excited',
        variation_id: 'pitch_skills_v1'
      }
    ],
    choices: [
      {
        choiceId: 'pitch_skills_affirm',
        text: "It's experiential career prep. That gets funded.",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'analytical',
        skills: ['communication', 'financialLiteracy']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_pitch_skills']
      }
    ]
  },

  // ============= THE CLIMAX: THE DECISION =============
  {
    nodeId: 'tess_pitch_climax',
    speaker: 'Tess',
    content: [
      {
        text: `*She writes the headline on a card and pins it to the center of the board. She steps back, looking at the full picture.*

It works. I can sell this. I know I can.

But if I send this email... I'm resigning. I'm leaving the pension. The tenure track.

If I fail, I'm just an unemployed hiker.`,
        emotion: 'scared_excited',
        variation_id: 'climax_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'tess_commit_leap',
        text: "You can't lead a 'Walkabout' if you're afraid to leave the path.",
        nextNodeId: 'tess_decision_made',
        pattern: 'building',
        skills: ['leadership', 'adaptability', 'emotionalIntelligence']
      },
      {
        choiceId: 'tess_commit_safety',
        text: "Is there a way to do this part-time? Test it first?",
        nextNodeId: 'tess_decision_cautious',
        pattern: 'analytical',
        skills: ['problemSolving', 'criticalThinking']
      },
      {
        choiceId: 'tess_commit_belief',
        text: "The students need this. They need you to be brave first.",
        nextNodeId: 'tess_decision_made',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'tess_decision_made',
    speaker: 'Tess',
    content: [
      {
        text: `*She takes a deep breath, her hand hovering over her phone.*

You're right. I can't teach courage if I'm playing it safe.

*She taps 'Send'.*

It's done. Resignation sent. Grant application submitted.

I'm terrifyingly free.`,
        emotion: 'liberated',
        variation_id: 'decision_made_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'tess_farewell_success',
        text: "Congratulations, Founder.",
        nextNodeId: 'tess_farewell',
        pattern: 'building',
        skills: ['collaboration']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_arc_complete', 'tess_chose_risk']
      }
    ],
    tags: ['ending', 'tess_arc']
  },

  {
    nodeId: 'tess_decision_cautious',
    speaker: 'Tess',
    content: [
      {
        text: `Maybe... maybe I can run a pilot program this summer. Keep the job, prove the concept.

Yeah. That's smarter. I don't need to blow up my life to build a new one.

Thank you. I almost jumped without a parachute.`,
        emotion: 'relieved',
        variation_id: 'decision_cautious_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_farewell_cautious',
        text: "Smart growth is still growth.",
        nextNodeId: 'tess_farewell',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_arc_complete', 'tess_chose_safe']
      }
    ],
    tags: ['ending', 'tess_arc']
  },

  {
    nodeId: 'tess_farewell',
    speaker: 'Tess',
    content: [
      {
        text: `I have a lot of work to do. But for the first time in years, I know exactly where I'm going.

If you see Samuel, tell him... tell him I'm finally going for a walk.`,
        emotion: 'grateful',
        variation_id: 'farewell_v1'
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
    tags: ['transition', 'tess_arc']
  }
]

export const tessEntryPoints = {
  INTRODUCTION: 'tess_introduction'
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