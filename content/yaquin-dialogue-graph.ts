/**
 * Yaquin's Dialogue Graph
 * The Practical Creator - Platform 5 (Creator Economy / EdTech)
 *
 * CHARACTER: The Dental Assistant Turned Educator
 * Core Conflict: "Tacit Knowledge" vs. "Formal Credentials"
 * Arc: Realizing that his practical skills are more valuable than theoretical degrees
 * Mechanic: "The Curriculum" - Designing a course that strips away the fluff
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const yaquinDialogueNodes: DialogueNode[] = [
  // ... [KEEPING INTRO NODES] ...
  {
    nodeId: 'yaquin_introduction',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He's surrounded by dental models—sets of teeth, gum molds—and a ring light setup. He's talking to his phone.*

"Okay, guys, forget the textbook. Chapter 4 is garbage. This is how you actually mix the alginate so it doesn't gag the patient."

*He stops recording and sighs.*

Is it garbage? Or am I just uneducated?`,
        emotion: 'frustrated_passion',
        variation_id: 'yaquin_intro_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_intro_garbage',
        text: "If the textbook doesn't work, it's garbage.",
        nextNodeId: 'yaquin_textbook_problem',
        pattern: 'building',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_intro_authority',
        text: "Why do you think you're uneducated?",
        nextNodeId: 'yaquin_credential_gap',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'yaquin_intro_content',
        text: "You're teaching online?",
        nextNodeId: 'yaquin_creator_path',
        pattern: 'exploring',
        skills: ['digitalLiteracy']
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
    nodeId: 'yaquin_textbook_problem',
    speaker: 'Yaquin',
    content: [
      {
        text: `Right? It says 'mix for 45 seconds.' If you do that, it sets in the bowl. You ruin the mold.

I've been a dental assistant for 8 years. I know the feel of the paste. I know the look in a patient's eyes when they're scared.

The books don't teach that.`,
        emotion: 'confident',
        variation_id: 'textbook_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_tacit_knowledge',
        text: "That's called tacit knowledge. It's valuable.",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'analytical',
        skills: ['pedagogy']
      },
      {
        choiceId: 'yaquin_teach_that',
        text: "So teach THAT. The real stuff.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  {
    nodeId: 'yaquin_credential_gap',
    speaker: 'Yaquin',
    content: [
      {
        text: `I'm 'just' an assistant. I didn't go to dental school.

But the dentists ask *me* how to handle the difficult patients. They ask *me* to train the new hires.

I'm doing the work, but I don't have the paper.`,
        emotion: 'insecure',
        variation_id: 'credential_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_competence',
        text: "Competence matters more than paper.",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'helping',
        skills: ['encouragement'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'yaquin_curriculum_dream',
    speaker: 'Yaquin',
    content: [
      {
        text: `I want to build a course. 'The Real Dental Assistant.'

Not theory. Reality. How to calm a crying kid. How to mix the paste. How to anticipate what the doctor needs before they ask.

But I keep looking at the syllabus and thinking... I need to include the history of dentistry. And anatomy. And ethics.`,
        emotion: 'overwhelmed',
        variation_id: 'dream_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_help_edit',
        text: "You're adding fluff. Let's cut it.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building',
        skills: ['instructionalDesign']
      }
    ]
  },

  // ============= THE CURRICULUM (Immersive Scenario) =============
  {
    nodeId: 'yaquin_curriculum_setup',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He slams a notebook onto the table. It's thick, messy, and covered in coffee stains.*

"Look at this list. I'm trying to turn 8 years of instinct into a checklist. It's impossible."

*He points to three potential modules.*

"I only have time to film one pilot module this weekend. If I pick the wrong one, nobody watches, and I go back to cleaning spit valves."`,
        emotion: 'frustrated_focused',
        variation_id: 'curriculum_setup_v2',
        richEffectContext: 'warning', // Editor Mode
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'module_history',
        text: "[ACTION] 'Module 1: The History of Dentistry (1800-Present).'",
        nextNodeId: 'yaquin_fail_boring',
        pattern: 'analytical', // Trap choice: boring
        skills: ['curriculumDesign']
      },
      {
        choiceId: 'module_practical',
        text: "[ACTION] 'Module 1: The Perfect Impression (How not to choke your patient).'",
        nextNodeId: 'yaquin_success_practical',
        pattern: 'building',
        skills: ['marketing', 'empathy']
      },
      {
        choiceId: 'module_soft_skills',
        text: "[ACTION] 'Module 1: Reading the Room (Patient Psychology).'",
        nextNodeId: 'yaquin_success_psych',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE: BORING ---
  {
    nodeId: 'yaquin_fail_boring',
    speaker: 'Yaquin',
    content: [
      {
        text: `*Yaquin films it. He watches the playback.*

"Hello class. Today we will discuss 19th century forceps."

*He puts his head in his hands.*

"I'm bored. I'm literally bored watching myself. Nobody is going to pay $50 for this. I sound like the professors I hated."`,
        emotion: 'defeated',
        variation_id: 'fail_boring_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_curriculum',
        text: "Cut the history. Teach the skill.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building'
      },
      {
        choiceId: 'give_up_boring',
        text: "Maybe you need a degree to teach.",
        nextNodeId: 'yaquin_bad_ending',
        pattern: 'analytical',
        consequence: {
           addGlobalFlags: ['yaquin_chose_safe'] 
        }
      }
    ]
  },

  // --- SUCCESS VARIATIONS ---
  {
    nodeId: 'yaquin_success_practical',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He films it. Fast. Energetic. He mixes the paste on camera, making a mess, laughing.*

"See? It's pink. It's goopy. And you have 30 seconds before it turns to stone. Go!"

*He watches the playback, grinning.*

"That's it. That's the energy. It's not a lecture. It's a cooking show for teeth."`,
        emotion: 'excited',
        variation_id: 'success_practical_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'confirm_practical',
        text: "That's your brand. 'The Cooking Show for Teeth.'",
        nextNodeId: 'yaquin_launch_decision',
        pattern: 'building',
        skills: ['branding']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_practical']
      }
    ]
  },

  {
    nodeId: 'yaquin_success_psych',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He talks to the camera like it's a scared patient.*

"I know you're nervous. I know the drill sounds loud. Watch my eyes. Breathe with me."

*He stops recording.*

"That's what I do all day. I don't fix teeth. I fix fear. That's what I'm selling."`,
        emotion: 'inspired',
        variation_id: 'success_psych_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'confirm_psych',
        text: "You're teaching emotional intelligence, not just dentistry.",
        nextNodeId: 'yaquin_launch_decision',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_psych']
      }
    ]
  },

  // ============= THE LAUNCH (Climax) =============
  {
    nodeId: 'yaquin_launch_decision',
    speaker: 'Yaquin',
    content: [
      {
        text: "I have the video. I have the platform.

But if I hit publish... the dentists I work for will see it. They might fire me. 'Who does this guy think he is?'

But if I don't... I'm just a guy shouting at his phone in a basement.",
        emotion: 'nervous_energy',
        variation_id: 'launch_v1'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'launch_now',
        text: "Launch it. Ask for forgiveness, not permission.",
        nextNodeId: 'yaquin_launched',
        pattern: 'building',
        skills: ['entrepreneurship', 'courage']
      },
      {
        choiceId: 'launch_wait',
        text: "Build an audience anonymously first.",
        nextNodeId: 'yaquin_audience_first',
        pattern: 'analytical',
        skills: ['strategy']
      }
    ]
  },

  {
    nodeId: 'yaquin_launched',
    speaker: 'Yaquin',
    content: [
      {
        text: "*He hits the button.*

It's live.

First comment: 'Finally someone explains the mixing ratio!'

I'm doing it. I'm actually doing it. I'm a teacher.",
        emotion: 'triumphant',
        variation_id: 'launched_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell_launched',
        text: "You always were.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'helping'
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
    nodeId: 'yaquin_audience_first',
    speaker: 'Yaquin',
    content: [
      {
        text: "Smart. I'll create a brand name. 'The Dental Ninja.' Build trust, then sell the course.

It's safer. But it's still moving forward.

Thank you. You kept me from making a reckless mistake.",
        emotion: 'relieved',
        variation_id: 'audience_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell_audience',
        text: "Strategy beats speed.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'analytical'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_building_audience']
      }
    ],
    tags: ['ending', 'yaquin_arc']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'yaquin_bad_ending',
    speaker: 'Yaquin',
    content: [
      {
        text: "Yeah. I should probably just go back to school. Get the degree. Then maybe people will listen.

This was... a nice fantasy. But I'm just an assistant.

Thanks for listening.",
        emotion: 'deflated',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_safe', 'yaquin_arc_complete']
      }
    ],
    tags: ['ending', 'bad_ending', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_farewell',
    speaker: 'Yaquin',
    content: [
      {
        text: "I have a lot of editing to do.

If you see Samuel, tell him... tell him class is in session.",
        emotion: 'happy',
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
