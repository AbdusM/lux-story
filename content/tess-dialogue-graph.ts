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
  // ... [KEEPING INTRO NODES] ...
  // I will rewrite the scenario node directly in context.
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
        text: `*She thrusts a tablet into your hands. The slide is a wall of text. Bullets, charts, paragraphs.* 

"Look at this. 'The Pedagogical Benefits of Wilderness Immersion for Adolescent Neural Development.'"

*She grimaces.*

"I sound like a textbook. If I present this, they'll fall asleep before I ask for the money."

*The cursor blinks at the headline.*

"Fix it. Be ruthless. What are we actually selling?"`,
        emotion: 'focused_work_mode',
        variation_id: 'pitch_scenario_v2',
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
        choiceId: 'pitch_safe',
        text: "[ACTION] Keep the academic tone but bold the key stats. 'Evidence-Based Outdoor Education.'",
        nextNodeId: 'tess_pitch_fail_safe',
        pattern: 'analytical', // Trap choice: too safe
        skills: ['communication', 'culturalCompetence']
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
        text: `*Tess reads the new headline. She sighs.*

'Evidence-Based Outdoor Education.' It's accurate. It's professional.

And it's boring. I can see the committee now. They'll nod, say 'interesting,' and fund another STEM lab because it's safer.

If I can't make them *feel* the urgency, I've already lost.`,
        emotion: 'deflated',
        variation_id: 'pitch_fail_safe_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_pitch',
        text: "You're right. Be bold.",
        nextNodeId: 'tess_the_pitch_setup',
        pattern: 'patience'
      },
      {
        choiceId: 'accept_safe',
        text: "Maybe boring gets funded.",
        nextNodeId: 'tess_decision_cautious', // Forces Cautious Path
        pattern: 'analytical',
        consequence: {
           addGlobalFlags: ['tess_chose_safe'] 
        }
      }
    ]
  },

  // --- SUCCESS VARIATIONS ---
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

There's someone else here—Kai. From corporate. They're realizing the same thing I did: you can't fix the system from inside a cubicle.

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
      },
      {
        choiceId: 'tess_ask_about_students',
        text: "How's the program going with actual students?",
        nextNodeId: 'tess_phase2_entry',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          hasGlobalFlags: ['tess_arc_complete']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['completed_arc'],
        addGlobalFlags: ['tess_arc_complete']
      }
    ],
    tags: ['transition', 'tess_arc']
  },

  // ============= PHASE 2: FIRST STUDENT CRISIS + LEADERSHIP TEST =============

  {
    nodeId: 'tess_phase2_entry',
    speaker: 'Tess',
    content: [{
      text: `*Six weeks later. Tess is in the Waiting Room again, but this time she's surrounded by incident reports, parental consent forms, and a laptop showing a wilderness trail map.*

*She looks exhausted but energized.*

I have eight students on the Appalachian Trail right now. Day 3 of a 5-day section hike.

*She taps a form.*

And I have three incident reports, twelve parent phone calls, and a school board meeting scheduled for Monday.

*She looks up at you.*

Welcome to education reform in practice.`,
      emotion: 'exhausted_energized',
      variation_id: 'p2_entry_v1'
    }],
    choices: [
      {
        choiceId: 'p2_incident_reports',
        text: "Incident reports? Is everyone safe?",
        nextNodeId: 'tess_p2_crisis_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'p2_parent_calls',
        text: "Twelve parent calls doesn't sound good.",
        nextNodeId: 'tess_p2_crisis_reveal',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    requiredState: {
      hasGlobalFlags: ['tess_arc_complete']
    },
    tags: ['phase2', 'tess_arc', 'crisis']
  },

  {
    nodeId: 'tess_p2_crisis_reveal',
    speaker: 'Tess',
    content: [{
      text: `DeShawn—16, from Birmingham's inner city, first time camping—had a panic attack on Day 2.

Complete darkness. No streetlights. Sounds he'd never heard. He couldn't breathe. Thought he was dying.

*She rubs her eyes.*

My wilderness guide talked him down. He's physically safe. But now two other students want to quit. And the parents...

The parents are threatening to pull their kids and report me to the school board for "reckless endangerment."`,
      emotion: 'worried',
      variation_id: 'crisis_reveal_v1'
    }],
    choices: [
      {
        choiceId: 'p2_deshawn_focus',
        text: "Is DeShawn okay now?",
        nextNodeId: 'tess_p2_ripple_effect',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'empathy']
      },
      {
        choiceId: 'p2_program_risk',
        text: "This could shut down your whole program.",
        nextNodeId: 'tess_p2_ripple_effect',
        pattern: 'analytical',
        skills: ['riskManagement', 'strategicThinking']
      }
    ],
    tags: ['phase2', 'tess_arc', 'crisis']
  },

  {
    nodeId: 'tess_p2_ripple_effect',
    speaker: 'Tess',
    content: [{
      text: `DeShawn is physically fine. But emotionally? He's humiliated. Thinks he "failed" the test.

*She shows you her phone—messages from other students.*

Riley: "I thought this would be fun. I want to come home."
Jamie: Silent, but Jamie's parents called twice saying it's "too risky."

*She sets down the phone.*

This is exactly what the grant committee warned me about. "What happens when theory meets real students?"

I'm about to find out if I'm a visionary or just reckless.`,
      emotion: 'conflicted',
      variation_id: 'ripple_v1'
    }],
    choices: [
      {
        choiceId: 'p2_talk_to_deshawn',
        text: "You need to talk to DeShawn first.",
        nextNodeId: 'tess_p2_deshawn_conversation',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership']
      },
      {
        choiceId: 'p2_assess_program',
        text: "Step back. Assess if the program design needs changing.",
        nextNodeId: 'tess_p2_parent_calls',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability']
      }
    ],
    tags: ['phase2', 'tess_arc', 'decision_point']
  },

  {
    nodeId: 'tess_p2_deshawn_conversation',
    speaker: 'Tess',
    content: [{
      text: `*She pulls up a video call. DeShawn appears—sitting in a tent, eyes red.*

**DeShawn**: "Ms. Tess, I'm sorry. I ruined everything."

*Tess's voice softens.*

**Tess**: "DeShawn, you didn't ruin anything. You had a normal reaction to an extreme environment."

**DeShawn**: "But everyone else is fine. I'm the weak one."

*She looks at you—what do I say?*`,
      emotion: 'compassionate',
      variation_id: 'deshawn_talk_v1'
    }],
    choices: [
      {
        choiceId: 'p2_deshawn_courage',
        text: "Tell him: 'Facing fear is the actual test. You're still here.'",
        nextNodeId: 'tess_p2_deshawn_decision',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'encouragement'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'p2_deshawn_alternative',
        text: "Offer him an alternative assignment—wilderness isn't for everyone.",
        nextNodeId: 'tess_p2_deshawn_decision',
        pattern: 'analytical',
        skills: ['adaptability', 'pragmatism']
      },
      {
        choiceId: 'p2_deshawn_choice',
        text: "Ask him: 'Do you want to finish, or do you want to come home?'",
        nextNodeId: 'tess_p2_deshawn_decision',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'respect']
      }
    ],
    tags: ['phase2', 'tess_arc', 'mentorship']
  },

  {
    nodeId: 'tess_p2_deshawn_decision',
    speaker: 'Tess',
    content: [{
      text: `*DeShawn thinks for a long moment.*

**DeShawn**: "I... I want to finish. But I need help. I need someone to tell me it's okay to be scared."

*Tess nods.*

**Tess**: "Okay. The guide will check in with you every hour. And when you finish those last two days, you're going to know something about yourself nobody can teach in a classroom."

*DeShawn nods. The call ends.*

*Tess exhales.*

One down. Now the parents.`,
      emotion: 'relieved',
      variation_id: 'deshawn_commits_v1'
    }],
    choices: [
      {
        choiceId: 'p2_parent_strategy',
        text: "How are you going to handle the parent calls?",
        nextNodeId: 'tess_p2_parent_strategy',
        pattern: 'analytical',
        skills: ['communication', 'strategicThinking']
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        addKnowledgeFlags: ['deshawn_continues']
      }
    ],
    tags: ['phase2', 'tess_arc', 'resolution']
  },

  {
    nodeId: 'tess_p2_parent_calls',
    speaker: 'Tess',
    content: [{
      text: `*She shows you a list of voicemails.*

**Riley's Mom**: "This is too much. Bring my child home NOW."

**Jamie's Dad**: "We signed up for outdoor education, not survival training."

**Another Parent**: "My lawyer says this violates duty of care."

*Tess sets down the phone.*

I have two options. I can defend the rigor—"This is exactly what wilderness education IS."

Or I can modify the program—make it gentler, safer, more palatable.

But if I cave, am I still teaching resilience? Or am I just babysitting in the woods?`,
      emotion: 'frustrated',
      variation_id: 'parent_calls_v1'
    }],
    choices: [
      {
        choiceId: 'p2_defend_rigor',
        text: "Defend the rigor. They signed up for a crucible.",
        nextNodeId: 'tess_p2_parent_strategy',
        pattern: 'building',
        skills: ['courage', 'leadership'],
        consequence: {
          characterId: 'tess',
          addKnowledgeFlags: ['defended_rigor']
        }
      },
      {
        choiceId: 'p2_two_track',
        text: "Create two tracks—intense and modified. Let families choose.",
        nextNodeId: 'tess_p2_program_adaptation',
        pattern: 'analytical',
        skills: ['adaptability', 'strategicThinking'],
        consequence: {
          characterId: 'tess',
          addKnowledgeFlags: ['two_track_approach']
        }
      },
      {
        choiceId: 'p2_acknowledge_concerns',
        text: "Acknowledge their concerns. Add more support, not less challenge.",
        nextNodeId: 'tess_p2_program_adaptation',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['phase2', 'tess_arc', 'leadership']
  },

  {
    nodeId: 'tess_p2_parent_strategy',
    speaker: 'Tess',
    content: [{
      text: `I'm going to call each parent personally.

Not defensive. Not apologetic. Educational.

"Here's what happened. Here's why it matters. Here's what we're doing to support your child."

*She pulls up her notes.*

The truth is, DeShawn's panic attack IS the curriculum. The question is whether they can see that.`,
      emotion: 'determined',
      variation_id: 'strategy_v1'
    }],
    choices: [
      {
        choiceId: 'p2_transparency',
        text: "Be completely transparent. Share the incident report.",
        nextNodeId: 'tess_p2_board_prep',
        pattern: 'analytical',
        skills: ['integrity', 'communication']
      },
      {
        choiceId: 'p2_educational_frame',
        text: "Frame it educationally. This is learning, not failure.",
        nextNodeId: 'tess_p2_board_prep',
        pattern: 'building',
        skills: ['pedagogy', 'visionaryThinking']
      }
    ],
    tags: ['phase2', 'tess_arc', 'communication']
  },

  {
    nodeId: 'tess_p2_program_adaptation',
    speaker: 'Tess',
    content: [{
      text: `Maybe I was naive thinking everyone would thrive in the same format.

What if I offer scaling?

**Level 1**: Supported wilderness (guide checks in frequently, shorter distances)
**Level 2**: Standard immersion (what we're doing now)
**Level 3**: Advanced challenge (for students who want more)

Students choose their path. Parents feel heard. Program integrity stays intact.

*She sketches it out.*

Is this compromise, or is this good design?`,
      emotion: 'thoughtful',
      variation_id: 'adaptation_v1'
    }],
    choices: [
      {
        choiceId: 'p2_good_design',
        text: "It's good design. Differentiation is core pedagogy.",
        nextNodeId: 'tess_p2_board_prep',
        pattern: 'building',
        skills: ['pedagogy', 'systemsThinking'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'p2_dilution',
        text: "It's dilution. The rigor is the point.",
        nextNodeId: 'tess_p2_board_prep',
        pattern: 'analytical',
        skills: ['criticalThinking', 'integrity']
      }
    ],
    tags: ['phase2', 'tess_arc', 'innovation']
  },

  {
    nodeId: 'tess_p2_board_prep',
    speaker: 'Tess',
    content: [{
      text: `The school board meeting is in 48 hours.

They're going to ask:
- "Is this program safe?"
- "Are you qualified to run this?"
- "What's your liability plan?"
- "Why is this better than AP classes?"

*She looks at you.*

I can go in with data—completion rates, skill assessments, student testimonials.

Or I can go in with vision—"Education is about becoming, not just learning."

Or I can go in with both and hope I don't sound like a TED Talk.`,
      emotion: 'nervous',
      variation_id: 'board_prep_v1'
    }],
    choices: [
      {
        choiceId: 'p2_data_driven',
        text: "Lead with data. Numbers convince skeptics.",
        nextNodeId: 'tess_p2_board_meeting',
        pattern: 'analytical',
        skills: ['informationLiteracy', 'strategicThinking']
      },
      {
        choiceId: 'p2_vision_driven',
        text: "Lead with vision. They need to see what you see.",
        nextNodeId: 'tess_p2_board_meeting',
        pattern: 'building',
        skills: ['visionaryThinking', 'communication']
      },
      {
        choiceId: 'p2_both',
        text: "Both. Data proves it works, vision explains why it matters.",
        nextNodeId: 'tess_p2_board_meeting',
        pattern: 'helping',
        skills: ['communication', 'leadership'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ],
    tags: ['phase2', 'tess_arc', 'preparation']
  },

  {
    nodeId: 'tess_p2_board_meeting',
    speaker: 'Tess',
    content: [{
      text: `*Monday. Tess is standing in front of the school board—five skeptical faces.*

**Board Member 1**: "Ms. Rodriguez, we've received complaints about student safety."

*Tess takes a breath.*

**Tess**: "You have. And I want to address them directly."

*She pulls up her presentation.*

**Tess**: "DeShawn had a panic attack. Not because the program is unsafe, but because it's working. He encountered real fear and chose to continue. That's resilience."

**Board Member 2**: "So you're saying panic attacks are... good?"

*Tess doesn't flinch.*

How do I answer this?`,
      emotion: 'focused',
      variation_id: 'board_v1'
    }],
    choices: [
      {
        choiceId: 'p2_reframe_fear',
        text: "Reframe: 'Learning to manage fear is the skill. The woods are just the classroom.'",
        nextNodeId: 'tess_p2_leadership_moment',
        pattern: 'building',
        skills: ['communication', 'pedagogy']
      },
      {
        choiceId: 'p2_acknowledge_adapt',
        text: "Acknowledge and adapt: 'You're right. I'm adding support tiers.'",
        nextNodeId: 'tess_p2_leadership_moment',
        pattern: 'analytical',
        skills: ['adaptability', 'humility']
      }
    ],
    tags: ['phase2', 'tess_arc', 'climax']
  },

  {
    nodeId: 'tess_p2_leadership_moment',
    speaker: 'Tess',
    content: [{
      text: `*The board members exchange glances.*

**Board Member 3**: "What you're describing sounds... expensive. And risky. And unproven."

*Tess nods.*

**Tess**: "It is all of those things. It's also the future of education."

*She leans forward.*

**Tess**: "We can keep doing what we've always done—safe, measurable, forgettable. Or we can teach students to face the unknown."

**Board Chair**: "And if more students quit?"

*Tess meets their eyes.*

**Tess**: "Then I'll have learned something. And I'll iterate. That's what builders do."

*Silence.*

**Board Chair**: "Continue the program. But submit monthly reports."

*Tess exhales.*`,
      emotion: 'triumphant',
      variation_id: 'leadership_v1'
    }],
    choices: [
      {
        choiceId: 'p2_resolution',
        text: "You stood your ground.",
        nextNodeId: 'tess_p2_resolution',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        trustChange: 2,
        addKnowledgeFlags: ['board_approved']
      }
    ],
    tags: ['phase2', 'tess_arc', 'victory']
  },

  {
    nodeId: 'tess_p2_resolution',
    speaker: 'Tess',
    content: [{
      text: `*Three days later. The students return from the trail.*

*DeShawn steps off the bus. Muddy. Exhausted. Grinning.*

**DeShawn**: "Ms. Tess, I did it. All five days."

*Riley quit on Day 4. Jamie finished but their parents pulled them from the program.*

*Tess watches DeShawn hug his mom.*

Not everyone finished. Not everyone stayed.

But the ones who did? They know something now.

*She turns to you.*

This is what founding looks like. It's messy. It's incomplete. And it's real.`,
      emotion: 'fulfilled',
      variation_id: 'resolution_v1'
    }],
    choices: [
      {
        choiceId: 'p2_deshawn_outcome',
        text: "DeShawn's transformation is the proof.",
        nextNodeId: 'tess_p2_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'p2_iteration',
        text: "What are you changing for the next cohort?",
        nextNodeId: 'tess_p2_reflection',
        pattern: 'building',
        skills: ['adaptability', 'learningAgility']
      }
    ],
    tags: ['phase2', 'tess_arc', 'resolution']
  },

  {
    nodeId: 'tess_p2_reflection',
    speaker: 'Tess',
    content: [{
      text: `I'm adding three changes:

1. Pre-program "exposure trips"—let students test the woods before committing
2. Tiered difficulty paths—meet students where they are
3. Parent education sessions—help them understand what we're doing

*She smiles.*

A month ago, I thought founding a school was about having the perfect curriculum.

Now I know it's about leading through uncertainty. Every crisis is data. Every dropout is a lesson.

I'm not a visionary. I'm a builder who's willing to break things to make them better.`,
      emotion: 'wise',
      variation_id: 'reflection_v1'
    }],
    choices: [
      {
        choiceId: 'p2_complete',
        text: "You're becoming the leader your students need.",
        nextNodeId: 'tess_p2_complete',
        pattern: 'helping',
        skills: ['encouragement', 'leadership']
      }
    ],
    tags: ['phase2', 'tess_arc', 'growth']
  },

  {
    nodeId: 'tess_p2_complete',
    speaker: 'Tess',
    content: [{
      text: `Thank you. For being here when it got hard.

*She picks up her pack.*

I have a new cohort starting next week. Fifteen students this time. Word is spreading.

If you see Samuel, tell him... tell him I'm learning to lead by walking through the fire.`,
      emotion: 'grateful',
      variation_id: 'complete_v1'
    }],
    choices: [
      {
        choiceId: 'return_to_samuel_tess_p2',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.TESS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['phase2', 'tess_arc', 'completion']
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
