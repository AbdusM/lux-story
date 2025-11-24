/**
 * Kai's Dialogue Graph
 * The Instructional Architect - Platform 6 (Corporate Innovation / L&D)
 *
 * CHARACTER: The Guilty Teacher
 * Core Conflict: "Compliance Safety" vs. "Real-World Danger"
 * Arc: From hiding behind "Click Next" modules to building simulations that actually save lives.
 * Mechanic: "The Safety Drill" - Rebuilding a failed safety module that caused a real injury.
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const kaiDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'kai_introduction',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed behavioral choreography - tablet and tension shown through dialogue only
        text: `*Tablet. Same slide. Swiping back and forth.*

*Whisper.*

"Ensure the safety harness is secured. Click Next."

It was right there. Slide 14. "Ensure harness is secured." He clicked Next. He clicked it. I have the logs.

But he didn't secure the harness.`,
        emotion: 'haunted',
        variation_id: 'kai_intro_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'kai_intro_accident',
        text: "What happened?",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'crisisManagement'],
        consequence: {
          characterId: 'kai',
          trustChange: 2
        }
      },
      {
        choiceId: 'kai_intro_design',
        text: "Clicking isn't learning. You know that.",
        nextNodeId: 'kai_accident_reveal',
        pattern: 'analytical',
        skills: ['instructionalDesign', 'criticalThinking']
      },
      {
        choiceId: 'kai_intro_defensive',
        text: "If he clicked it, you're legally covered. That's the job.",
        nextNodeId: 'kai_compliance_trap',
        pattern: 'building',
        skills: ['riskManagement']
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'kai_arc']
  },

  {
    nodeId: 'kai_accident_reveal',
    speaker: 'Kai',
    content: [
      {
        text: `Warehouse accident. Three days ago. Broken pelvis.

He's 22. Same age as my little brother.

The investigation cleared us. "Employee completed mandatory safety training on Oct 4th." The certificate is in the system. Green checkmark.

We designed a green checkmark. We didn't design safety.`,
        emotion: 'guilty',
        variation_id: 'accident_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_accountability',
        text: "You feel responsible because you designed the checkmark.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'kai_system_fail',
        text: "The system worked for the company. It failed the human.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'kai_marcus_connection',
        text: "I met a nurse, Marcus. He talks about the difference between the machine and the patient too.",
        nextNodeId: 'kai_marcus_reference',
        pattern: 'building',
        skills: ['collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['marcus_arc_complete']
        }
      }
    ]
  },

  {
    nodeId: 'kai_marcus_reference',
    speaker: 'Kai',
    content: [
      {
        text: `Marcus. The ECMO specialist? I read about his case in a medical ethics journal.

He has to decide, in seconds, who lives. I have months to design these courses, and I still failed.

If he makes a mistake, a patient dies. If I make a mistake... 50,000 employees learn the wrong thing. And then what happens?

The scale is different. The guilt is the same.`,
        emotion: 'reflective_guilt',
        variation_id: 'marcus_ref_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_marcus_back',
        text: "So fix it. Like he did.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'building'
      }
    ]
  },

  {
    nodeId: 'kai_compliance_trap',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai laughs, a brittle, snapping sound" - anger conveyed through dialogue
        text: `Legally covered. Yes. That's what my VP said. "Great work, Kai. The audit trail is perfect."

He's in the hospital, and we're celebrating our audit trail.

I can't do this anymore. I can't build shields for the company that leave the people exposed.`,
        emotion: 'angry',
        variation_id: 'compliance_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_move_to_sim',
        text: "So build something that actually protects them.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  // ============= THE SIMULATION: THE SAFETY DRILL =============
  {
    nodeId: 'kai_simulation_setup',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai turns" and "Kai taps" - showing screen result, not process
        text: `I deleted the module. The new one... I'm building it now. Secretly.

*Rough, grainy video feed simulation. Forklift Operator scenario. No text. No "Click Next."*

*The view shakes.*

You're in the cab. The load is unstable. The foreman is screaming at you to hurry up because the truck is waiting.

What do you do?`,
        emotion: 'intense',
        variation_id: 'sim_setup_v2',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'sim_pressure_compliance',
        text: "Follow the foreman's order. Move the load quickly.",
        nextNodeId: 'kai_sim_fail_compliance',
        pattern: 'building', // Trying to be "productive"
        skills: ['adaptability'] 
      },
      {
        choiceId: 'sim_pressure_safety',
        text: "Stop. Get out of the cab. Refuse to move.",
        nextNodeId: 'kai_sim_success',
        pattern: 'helping',
        skills: ['courage', 'leadership']
      },
      {
        choiceId: 'sim_check_manual',
        text: "Check the safety manual PDF.",
        nextNodeId: 'kai_sim_fail_pdf',
        pattern: 'analytical',
        skills: ['informationLiteracy']
      }
    ],
    tags: ['simulation', 'kai_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE 1: COMPLIANCE ---
  {
    nodeId: 'kai_sim_fail_compliance',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai stares at the black screen, face pale" - horror conveyed through result
        text: `*The screen goes black. A sickening crunch of metal on concrete.*

*Red text floods the view: "FATAL ACCIDENT REPORTED."*

You listened to the boss. You got the job done. And you killed someone.

That's what the old training taught them. "Efficiency first."`,
        emotion: 'horrified',
        variation_id: 'sim_fail_compliance_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'kai_retry_compliance',
        text: "I didn't think... let me try again.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'patience',
        skills: ['learningAgility']
      },
      {
        choiceId: 'kai_give_up_compliance',
        text: "It's too hard. Maybe just stick to the slides.",
        nextNodeId: 'kai_bad_ending',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['kai_chose_safety'] // BAD ENDING
        }
      }
    ]
  },

  // --- FAILURE STATE 2: PDF ---
  {
    nodeId: 'kai_sim_fail_pdf',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai shakes their head" - frustration conveyed through teaching moment
        text: `*You tap the PDF icon. A 40-page document opens.*

*While you're reading, the load shifts. The crate falls.*

*The screen flashes red. "INJURY REPORTED."*

Nobody reads the PDF in a crisis. You hesitated. Real life doesn't pause for documentation.`,
        emotion: 'frustrated',
        variation_id: 'sim_fail_pdf_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'kai_retry_pdf',
        text: "You're right. No manuals. Action.",
        nextNodeId: 'kai_simulation_setup',
        pattern: 'patience',
        skills: ['learningAgility']
      }
    ]
  },

  // --- SUCCESS STATE ---
  {
    nodeId: 'kai_sim_success',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Removed "Kai exhales, shoulders dropping" - relief conveyed through dialogue revelation
        text: `*The foreman screams in your face. The AI voice is deafening.*

*But you stopped. The load wobbles, then settles. Safe.*

You stopped. You ignored the authority figure to save the human.

That's it. That's the skill. Not "harness safety." *Courage.*`,
        emotion: 'relieved',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'kai_teach_courage',
        text: "You can't teach courage with a slide deck.",
        nextNodeId: 'kai_studio_realization',
        pattern: 'helping',
        skills: ['leadership', 'instructionalDesign']
      },
      {
        choiceId: 'kai_sim_power',
        text: "I felt that fear. I'll remember it.",
        nextNodeId: 'kai_studio_realization',
        pattern: 'building',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation_complete', 'kai_arc']
  },

  // ============= THE REALIZATION =============
  {
    nodeId: 'kai_studio_realization',
    speaker: 'Kai',
    content: [
      {
        // NOTE: Fixed continuity error - removed Rohan reference (character doesn't exist in this story)
        text: `I have to show this. Not to the VP—to the workers.

The training is broken. I'm building checkmarks that hide the danger.

If I stay, I'm complicit. If I leave, I can build something that actually protects them.`,
        emotion: 'determined',
        variation_id: 'studio_v2'
      }
    ],
    choices: [
      {
        choiceId: 'kai_leave',
        text: "Leave. Build the studio that saves lives.",
        nextNodeId: 'kai_climax_decision',
        pattern: 'building',
        skills: ['entrepreneurship', 'courage']
      }
    ]
  },

  {
    nodeId: 'kai_climax_decision',
    speaker: 'Kai',
    content: [
      {
        text: `Kairos Learning Design. No certificates. Just survival.

It's terrifying. I'm giving up the salary, the benefits... the green checkmarks.

But I'll never have to click 'Next' again.`,
        emotion: 'liberated',
        variation_id: 'climax_v2'
      }
    ],
    requiredState: {
      lacksGlobalFlags: ['kai_chose_safety']
    },
    choices: [
      {
        choiceId: 'kai_farewell',
        text: "Go build it.",
        nextNodeId: 'kai_farewell',
        pattern: 'helping',
        skills: ['encouragement']
      }
    ],
    onEnter: [
      {
        characterId: 'kai',
        addKnowledgeFlags: ['kai_chose_studio'],
        addGlobalFlags: ['kai_arc_complete']
      }
    ],
    tags: ['ending', 'kai_arc']
  },

  // ============= BAD ENDING (Resignation) =============
  {
    nodeId: 'kai_bad_ending',
    speaker: 'Kai',
    content: [
      {
        text: `*Kai closes the tablet. The screen goes dark.*

Yeah. You're right. It's too risky. The VP will never approve it.

I'll just... add a bold font to the safety warning. That should be enough.

Thanks for trying.`,
        emotion: 'defeated',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.KAI_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['kai_chose_safety', 'kai_arc_complete'] // Bad ending flag
      }
    ],
    tags: ['ending', 'bad_ending', 'kai_arc']
  },

  {
    nodeId: 'kai_farewell',
    speaker: 'Kai',
    content: [
      {
        text: `Thank you. You didn't just help me fix a module. You helped me stop lying to myself.

If you see Samuel... tell him I'm done with compliance. I'm in the business of reality now.`,
        emotion: 'grateful',
        variation_id: 'farewell_v2'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_kai',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.KAI_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'kai_arc']
  }
]

export const kaiEntryPoints = {
  INTRODUCTION: 'kai_introduction'
} as const

export const kaiDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(kaiDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: kaiEntryPoints.INTRODUCTION,
  metadata: {
    title: "Kai's Studio",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: kaiDialogueNodes.length,
    totalChoices: kaiDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}