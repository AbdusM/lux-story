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
        text: `Woodlawn High guidance office. Grant applications everywhere.

Not rigor. Resilience? Too soft. Grit? Overused.

You look like you've been outside. Wilderness Immersion. Vacation or crucible?`,
        emotion: 'passionate',
        interaction: 'jitter',
        variation_id: 'tess_intro_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_intro_crucible',
        text: "Sounds like you're being tested.",
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
      },
      {
        choiceId: 'tess_intro_patient_listen',
        text: "[Wait. Let her work through it.]",
        nextNodeId: 'tess_explains_school',
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
    nodeId: 'tess_validates_crucible',
    speaker: 'Tess',
    content: [
      {
        text: `Exactly. Not s'mores and ghost stories.|Twelve weeks on the Appalachian Trail. Thirty pounds on your back. No phone.|Here's the play: Grant committee needs to see why *this* teaches more than AP Calculus.`,
        emotion: 'passionate',
        interaction: 'nod',
        variation_id: 'crucible_v1',
        useChatPacing: true
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
        text: "Sounds like it pushes people. Hard.",
        nextNodeId: 'tess_explains_school',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_crucible_exploring',
        text: "What happens to students at the end of twelve weeks? Who do they become?",
        nextNodeId: 'tess_explains_school',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
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
        text: `That's the problem. Investors hear 'camping.' They miss the decision-making. Logistics. Conflict resolution at 4,000 feet. wet, hungry, lost. Need to show the curriculum inside the chaos.`,
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'defends_v1',
        useChatPacing: true
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
        text: `Restarting 'Walkabout.' Program in Philly.|Instead of senior year. rows, tests. you went out. Trail. Service projects. Built your own syllabus.|Did it ten years ago. Changed my life.|Learned more about leadership in those woods than four years of college.`,
        emotion: 'inspired',
        interaction: 'bloom',
        variation_id: 'school_story_v1',
        useChatPacing: true
      }
    ],
    onEnter: [
      {
        characterId: 'tess',
        thoughtId: 'green-frontier'
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
      },
      {
        choiceId: 'tess_school_exploring',
        text: "What did you discover about yourself out there? What shifted?",
        nextNodeId: 'tess_founder_motivation',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'tess_defunding_reveal',
    speaker: 'Tess',
    content: [
      {
        text: `Defunded. 'Not enough measurable outcomes.' 'High liability.'|They want spreadsheets. Test scores. Can't put 'learned to trust myself' on a scantron.|Starting my own. 'The Apex Semester.' Need $250K seed funding.|Pitch deck is... messy.`,
        emotion: 'determined',
        interaction: 'shake',
        variation_id: 'defunding_v1',
        useChatPacing: true
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
        text: `Safe job now. Career Counselor. Pension, health insurance, summer break.|But these kids... burnt out at 17. Don't need another AP class.|They need to know they can survive something hard.|If I do this, I quit. <shake>No net.</shake>`,
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'motivation_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_risk_validation',
        text: "You don't sound like someone who wants safe.",
        nextNodeId: 'tess_defunding_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'problemSolving'],
        consequence: {
          characterId: 'tess',
          trustChange: 1
        }
      },
      {
        choiceId: 'tess_motivation_exploring',
        text: "What happens if you don't try?",
        nextNodeId: 'tess_defunding_reveal',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
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
        text: `The Pedagogical Benefits of Wilderness Immersion for Adolescent Neural Development.

Sound like a textbook. They'll sleep before I ask for money.

Fix it. Be ruthless. What are we actually selling?`,
        emotion: 'focused',
        interaction: 'shake',
        variation_id: 'pitch_scenario_v2',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'pitch_resilience',
        text: "Scrap it. What are you actually building?",
        nextNodeId: 'tess_pitch_resilience',
        pattern: 'building',
        skills: ['criticalThinking', 'communication', 'creativity']
      },
      {
        choiceId: 'pitch_mental_health',
        text: "Lead with the burnout numbers. That's the problem you're solving.",
        nextNodeId: 'tess_pitch_mental_health',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'pitch_safe',
        text: "Keep the academic tone but bold the key stats. 'Evidence-Based Outdoor Education.'",
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
        text: `Evidence-Based Outdoor Education. Accurate. Professional.

Boring.

Committee will nod, say 'interesting,' fund another STEM lab. Safer.

Can't make them feel urgency? Already lost.`,
        emotion: 'deflated',
        interaction: 'small',
        variation_id: 'pitch_fail_safe_v1',
        richEffectContext: 'error',
        useChatPacing: true
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
        text: `'Antifragile.' Like that. Investors love that word.|Hike isn't about nature. Stress inoculation. Learning to thrive in chaos.|Yes. 'We don't teach history. We teach how to make history when the map runs out.'`,
        emotion: 'inspired',
        interaction: 'bloom',
        variation_id: 'pitch_resilience_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'pitch_resilience_affirm',
        text: "Now that sounds like something worth funding.",
        nextNodeId: 'tess_pitch_climax',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['tess_pitch_resilience'],
        thoughtId: 'steady-hand'
      }
    ]
  },

  {
    nodeId: 'tess_pitch_mental_health',
    speaker: 'Tess',
    content: [
      {
        text: `Burnout. Yes. Suicide rates, anxiety. schools are pressure cookers.|Not a gap year. A reset. 'Disconnect to Reconnect.'|'We give students what high school steals: Their agency.'`,
        emotion: 'passionate',
        interaction: 'nod',
        variation_id: 'pitch_mental_health_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'pitch_mental_health_affirm',
        text: "Agency. That's what you're selling.",
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
        text: `It works. Can sell this.

But this email... resignation. Leaving pension. Tenure track.

If I fail, I'm an unemployed hiker.`,
        emotion: 'anxious',
        interaction: 'shake',
        variation_id: 'climax_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `It works. Can sell this. You helped me see it—you're a builder too.

But this email... resignation. Leaving pension. Tenure track.

Fail, and I'm nobody.`,
        altEmotion: 'kindred_anxious'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `It works. Can sell this. The way you listened—you made space for me to find my own answer.

But this email... resignation. Leaving pension. Tenure track.

Everything I've built. Gone.`,
        altEmotion: 'grateful_anxious'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: `It works. Can sell this. You're curious about the world—I see it in your questions.

But this email... resignation. Leaving pension. Tenure track.

What if I'm wrong about all of it?`,
        altEmotion: 'recognized_anxious'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'tess_commit_leap',
        text: "You're asking students to take a leap. Can you?",
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
        text: "What would you tell a student in this moment?",
        nextNodeId: 'tess_decision_made',
        pattern: 'building',
        skills: ['leadership', 'courage']
      }
    ]
  },

  {
    nodeId: 'tess_decision_made',
    speaker: 'Tess',
    content: [
      {
        // NOTE: Removed "*Phone notification sound*" - sound effects handled by UI/audio system, not text
        text: `Can't teach courage playing it safe.|Done. Resignation sent. Grant submitted.|Terrifyingly free.`,
        emotion: 'excited',
        interaction: 'bloom',
        variation_id: 'decision_made_v1',
        richEffectContext: 'success',
        useChatPacing: true
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
        text: `Maybe... pilot program this summer. Keep job, prove concept.|Smarter. Don't need to blow up my life to build a new one.|Thank you. Almost jumped without a parachute.`,
        emotion: 'relieved',
        interaction: 'small',
        variation_id: 'decision_cautious_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'tess_farewell_cautious',
        text: "You'll know when you're ready.",
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
        text: `{{met_kai:Kai is trying to change the system from within. I respect that. But I have to build outside it.|I'm building outside the system.}} I'm heading back to Woodlawn. I have a grant proposal to write.\n\nBefore I go. here's the play: I showed my hand. Your turn. What are you building? What's your move?`,
        emotion: 'curious_engaged',
        interaction: 'nod',
        variation_id: 'farewell_v1',
        useChatPacing: true
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `{{met_kai:Kai is trying to change the system from within. I respect that. But I have to build outside it.|I'm building outside the system.}} I'm heading back to Woodlawn. I have a grant proposal to write.\n\nHere's the play: you're a builder too. I saw it in how you think. What are you building next?`,
        altEmotion: 'kindred_curious'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: `{{met_kai:Kai is trying to change the system from within. I respect that. But I have to build outside it.|I'm building outside the system.}} I'm heading back to Woodlawn. I have a grant proposal to write.\n\nHere's the play: you're an explorer. Your curiosity is contagious. Where does that curiosity lead next?`,
        altEmotion: 'recognized_curious'
      }
    ],
    choices: [
      {
        choiceId: 'tess_asks_before_leave',
        text: "I'll tell you what I'm building...",
        nextNodeId: 'tess_asks_player',
        pattern: 'helping',
        skills: ['communication', 'curiosity']
      },
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
      text: `Six weeks later. Surrounded by incident reports, consent forms, trail map on laptop.

Eight students on Appalachian Trail. Day 3 of 5.

Three incident reports. Twelve parent calls. Board meeting Monday.

Welcome to education reform in practice.`,
      emotion: 'exhausted',
      interaction: 'shake',
      variation_id: 'p2_entry_v1',
      useChatPacing: true
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
      text: `DeShawn. 16, Birmingham inner city, first time camping. panic attack Day 2. Complete darkness. No streetlights. Sounds he'd never heard. Couldn't breathe. Thought he was dying.

Guide talked him down. Physically safe. But two others want to quit.

Parents threatening to pull kids, report me for 'reckless endangerment.'`,
      emotion: 'anxious',
      interaction: 'small',
      variation_id: 'crisis_reveal_v1',
      useChatPacing: true
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
      text: `DeShawn physically fine. Emotionally? Humiliated. Thinks he 'failed.'

Riley: 'I want to come home.' Jamie: Silent, but parents called twice. 'Too risky.'

Grant committee warned me. 'What happens when theory meets real students?'

Visionary or just reckless?`,
      emotion: 'conflicted',
      interaction: 'shake',
      variation_id: 'ripple_v1',
      useChatPacing: true
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
      text: `**DeShawn**: 'Ms. Tess, I'm sorry. Ruined everything.'

**Tess**: 'You didn't ruin anything. Normal reaction to extreme environment.'

**DeShawn**: 'Everyone else is fine. I'm the weak one.'

What do I say?`,
      emotion: 'vulnerable',
      interaction: 'small',
      variation_id: 'deshawn_talk_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_deshawn_courage',
        text: "He's still there. That already says something.",
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
        text: "Offer him an alternative assignment. wilderness isn't for everyone.",
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
      text: `**DeShawn**: 'I... I want to finish. But need help. Someone to say it's okay to be scared.'

**Tess**: 'Guide checks in every hour. When you finish those two days, you'll know something no classroom can teach.'

One down. Now parents.`,
      emotion: 'relieved',
      interaction: 'nod',
      variation_id: 'deshawn_commits_v1',
      useChatPacing: true
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
      text: `**Riley's Mom**: 'Bring my child home NOW.' **Jamie's Dad**: 'Outdoor education, not survival training.' **Another**: 'My lawyer says duty of care violation.'

Two options. Defend rigor. 'This IS wilderness education.'

Or modify. gentler, safer, palatable.

If I cave, still teaching resilience? Or babysitting in the woods?`,
      emotion: 'frustrated',
      interaction: 'shake',
      variation_id: 'parent_calls_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_defend_rigor',
        text: "Stand firm. They knew what they signed up for.",
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
        text: "Create two tracks. intense and modified. Let families choose.",
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
        pattern: 'building',
        skills: ['systemsThinking', 'communication']
      }
    ],
    tags: ['phase2', 'tess_arc', 'leadership']
  },

  {
    nodeId: 'tess_p2_parent_strategy',
    speaker: 'Tess',
    content: [{
      text: `Calling each parent personally. Not defensive. Not apologetic. Educational.

What happened. Why it matters. What we're doing to support your child.

Truth is, DeShawn's panic attack IS the curriculum. Can they see that?`,
      emotion: 'determined',
      interaction: 'nod',
      variation_id: 'strategy_v1',
      useChatPacing: true
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
        text: "Help them see what happened differently.",
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
      text: `Maybe naive thinking everyone thrives same format. What if scaling?

<bloom>**Level 1**: Supported (frequent check-ins, shorter distances) **Level 2**: Standard immersion **Level 3**: Advanced challenge</bloom>

Students choose. Parents heard. Integrity intact.

Compromise or good design?`,
      emotion: 'focused',
      variation_id: 'adaptation_v1',
      useChatPacing: true,
      // NOTE: Inline bloom applied only to the three-tier system solution itself,
      // not to the preceding doubt or following reflection. This targets the
      // epiphany moment of the differentiated design breakthrough.
    }],
    choices: [
      {
        choiceId: 'p2_good_design',
        text: "Meeting people where they are isn't compromise.",
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
      text: `Board meeting in 48 hours.

<jitter>Questions: Safe? Qualified? Liability? Better than AP classes?</jitter>

Go in with data. completion rates, assessments, testimonials.

Or vision. 'Education is becoming, not just learning.'

Or both and risk sounding like a TED Talk.`,
      emotion: 'anxious',
      variation_id: 'board_prep_v1',
      useChatPacing: true,
      // NOTE: Inline jitter applied only to the rapid-fire board questions (anxiety peak),
      // not to the surrounding setup or strategic options. This emphasizes the panic
      // moment without affecting her composed strategizing that follows.
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
        text: "Show them what this could become.",
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
      text: `Monday. School board. five skeptical faces.

**Board Member 1**: 'Ms. Rodriguez, complaints about student safety.'

**Tess**: 'I want to address them directly.'

DeShawn had a panic attack. Not unsafe. working. Real fear. Chose to continue. That's resilience.

**Board Member 2**: 'Panic attacks are... good?'

How do I answer?`,
      emotion: 'focused',
      interaction: 'big',
      variation_id: 'board_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_reframe_fear',
        text: "He learned something about himself out there. That's the point.",
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
      text: `*Board members exchange glances.*|**Member 3**: 'Expensive. Risky. Unproven.'|*Nods.*|**Tess**: <big>'All of those. Also the future of education.'</big>|*Leans forward.*|<big>'Keep doing what we've always done. safe, measurable, forgettable. Or teach students to face the unknown.'</big>|**Chair**: 'If more quit?'|*Meets eyes.*|<big>'Then I learn. Iterate. That's what builders do.'</big>|*Silence.*|**Chair**: 'Continue. Monthly reports.'|*Exhales.*`,
      emotion: 'proud',
      variation_id: 'leadership_v1',
      useChatPacing: true,
      // NOTE: Inline big applied strategically to three core leadership assertions:
      // (1) the future of education claim, (2) the dichotomy between safe/forgettable vs. brave,
      // (3) the builder identity. These are the turning points that secure board approval,
      // not the procedural dialogue or their concerns.
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
      text: `*Three days later. Students return.*|*DeShawn off bus. Muddy. Exhausted. Grinning.*|**DeShawn**: 'Ms. Tess, I did it. All five days.'|Riley quit Day 4. Jamie finished but parents pulled them.|*Watches DeShawn hug his mom.*|Not everyone finished. Not everyone stayed.|But the ones who did? They know something now.|*Turns.*|This is founding. Messy. Incomplete. Real.`,
      emotion: 'grateful',
      interaction: 'ripple',
      variation_id: 'resolution_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'p2_deshawn_outcome',
        text: "Look at DeShawn's face.",
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
      text: `Adding three changes:

<bloom>1. Pre-program exposure trips. test woods before committing 2. Tiered paths. meet students where they are 3. Parent education. help them understand</bloom>

Month ago, thought founding was perfect curriculum.

Now know it's leading through uncertainty. Every crisis is data. Every dropout a lesson.

<bloom>Not a visionary. Builder willing to break things to make them better.</bloom>`,
      emotion: 'proud',
      variation_id: 'reflection_v1',
      useChatPacing: true,
      // NOTE: Inline bloom applied to two climactic epiphany moments:
      // (1) the three concrete program improvements, and (2) the identity shift
      // from "visionary" to "builder." These are the breakthrough realizations,
      // not the surrounding narrative context.
    }],
    choices: [
      {
        choiceId: 'p2_complete',
        text: "You're figuring it out as you go. That's real.",
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
      text: `Thank you. For being here when it got hard.|*Picks up pack.*|New cohort next week. Fifteen students. Word spreading.|See Samuel? Tell him I'm learning to lead by walking through fire.`,
      emotion: 'grateful',
      interaction: 'nod',
      variation_id: 'complete_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'tess_p2_asks_before_leave',
        text: "Before you go. what's your biggest challenge?",
        nextNodeId: 'tess_p2_asks_player',
        pattern: 'helping',
        skills: ['communication', 'curiosity']
      },
      {
        choiceId: 'return_to_samuel_tess_p2',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.TESS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['phase2', 'tess_arc', 'completion']
  },
  // ============= RECIPROCITY: TESS ASKS PLAYER (Phase 1) =============
  {
    nodeId: 'tess_asks_player',
    speaker: 'Tess',
    content: [{
      text: `*Stops. Looks at you.*|What building?|*Thinks.*|You helping me build this. But what you building for yourself?|What vision you chasing?`,
      emotion: 'curious_engaged',
      interaction: 'nod',
      variation_id: 'tess_reciprocity_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'player_building_helping',
        text: "Opening doors. Showing people resources they didn't know existed. That's what I want. to be the person who says 'here, this might help.'",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'player_building_systems',
        text: "Building maps. Ways to find what you need faster. The information exists—someone has to organize it.",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'systemsThinking']
      },
      {
        choiceId: 'player_building_understanding',
        text: "Learning what people need. Not what they say—what they're looking for underneath.",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'criticalThinking']
      },
      {
        choiceId: 'player_still_figuring',
        text: "Still looking. Like everyone who ends up here. Maybe that's the point. you find by searching.",
        nextNodeId: 'tess_reciprocity_response',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'tess_arc']
  },
  {
    nodeId: 'tess_reciprocity_response',
    speaker: 'Tess',
    content: [{
      text: `*Nods.*|That's it.|Building something.|Even if not sure what yet.|*Shoulders pack.*|Keep building. See where it goes.|Tell Samuel classroom is everywhere.`,
      emotion: 'affirming',
      interaction: 'nod',
      variation_id: 'tess_response_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'return_to_samuel_tess_after',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.TESS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['reciprocity', 'tess_arc']
  },
  // ============= RECIPROCITY: TESS ASKS PLAYER (Phase 2) =============
  {
    nodeId: 'tess_p2_asks_player',
    speaker: 'Tess',
    content: [{
      text: `*Pauses. Looks at you.*|Biggest challenge?|*Thinks.*|Mine. scaling without losing rigor. Balancing safety with growth.|But you?|What challenge you facing?|How you handle when things get messy?`,
      emotion: 'curious_engaged',
      interaction: 'nod',
      variation_id: 'tess_p2_reciprocity_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'player_challenge_balance',
        text: "Knowing which door to open first. Ten people need ten different resources. I can only point to one at a time.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      },
      {
        choiceId: 'player_challenge_quality',
        text: "Keeping the map accurate. Information changes. Resources disappear. What I told someone yesterday might be wrong today.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'criticalThinking']
      },
      {
        choiceId: 'player_challenge_uncertainty',
        text: "Not knowing if the path I pointed to was right. They walk off. I never know if they found what they needed.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'player_challenge_patience',
        text: "Waiting. Someone needs help now. The resource exists. But forms. Waitlists. I want to cut through.",
        nextNodeId: 'tess_p2_reciprocity_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'tess_arc', 'phase2']
  },
  {
    nodeId: 'tess_p2_reciprocity_response',
    speaker: 'Tess',
    content: [{
      text: `*Nods.*|Know that feeling.|But you here. Showing up when messy.|That's leadership.|*Picks up pack.*|Keep showing up. See Samuel. Tell him I'm learning.`,
      emotion: 'affirming',
      interaction: 'nod',
      variation_id: 'tess_p2_response_v1',
      useChatPacing: true
    }],
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
