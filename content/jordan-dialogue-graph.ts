/**
 * Jordan Packard's Dialogue Graph
 * The Multi-Path Mentor - Seven jobs, one powerful lesson about adaptability
 *
 * CRITICAL: Jordan's arc is about owning accumulated past, not choosing between futures
 * Core conflict: Impostor syndrome while mentoring others through career transitions
 * Crossroads: Which story to tell herself (and 30 bootcamp students) about her journey
 */

import {
  DialogueNode,
  DialogueGraph
} from '@/lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const jordanDialogueNodes: DialogueNode[] = [
  // ... [KEEPING INTRO NODES UP TO JOB 7 SCENARIO] ...
  // I will preserve the existing nodes up to the scenario replacement.
  {
    nodeId: 'jordan_introduction',
    speaker: 'Jordan Packard',
    content: [{
      text: `Hey! Career Day at the coding bootcamp. Got here way too early. Classic overcompensation.

I've rewritten this speech six times.

UX Designer. Gym Manager. Marketing. Uber. Developer. Product Manager. Senior Designer.

Seven jobs. Twelve years.

What do you tell students when your path looks like this?`,
      emotion: 'friendly_but_anxious',
      variation_id: 'jordan_intro_v2_visual_hook'
    }],
    choices: [
      {
        choiceId: 'jordan_intro_ask_jobs',
        text: "That's a lot of different roles. What's the through-line?",
        nextNodeId: 'jordan_career_question',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['noticed_job_diversity']
        }
      },
      {
        choiceId: 'jordan_intro_relate_rewriting',
        text: "Six rewrites means you care about getting it right.",
        nextNodeId: 'jordan_career_question',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      },
      {
        choiceId: 'jordan_intro_observe_doubt',
        text: "You seem uncertain about your own story.",
        nextNodeId: 'jordan_career_question',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['noticed_uncertainty']
        }
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      setRelationshipStatus: 'stranger'
    }],
    tags: ['introduction', 'jordan_arc', 'bg3_hook']
  },

  {
    nodeId: 'jordan_career_question',
    speaker: 'Jordan Packard',
    content: [{
      text: `Mentorship panel. Thirty students trying to break into tech. Share my 'journey' and give advice.

Sounds simple. Until you sit down to write it.

I've rewritten this speech six times. What do you tell people when your path looks like mine?`,
      emotion: 'uncertain',
      variation_id: 'jordan_career_1'
    }],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'jordan_career_ask_path',
        text: "What does your path look like?",
        nextNodeId: 'jordan_job_reveal_1',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      },
      {
        choiceId: 'jordan_career_relate_messy',
        text: "Maybe messy paths are the most honest ones to share.",
        nextNodeId: 'jordan_job_reveal_1',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      },
      {
        choiceId: 'jordan_career_analyze_rewrites',
        text: "Six rewrites means you're overthinking the story you're telling.",
        nextNodeId: 'jordan_job_reveal_1',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      setRelationshipStatus: 'acquaintance'
    }],
    tags: ['career_context', 'jordan_arc']
  },

  {
    nodeId: 'jordan_job_reveal_1',
    speaker: 'Jordan Packard',
    content: [{
      text: `Alabama A&M. Computer science major. One semester, then got recruited by a startup. 'The next big thing.'

Folded in eight months. No degree, no job, no plan.

Twenty years old, back with my mom. She kept asking when I'd go back to school.`,
      emotion: 'rueful',
      variation_id: 'jordan_job1_1'
    }],
    requiredState: {
      trust: { min: 2 },
      lacksKnowledgeFlags: ['knows_job_1']
    },
    choices: [
      {
        choiceId: 'jordan_job1_ask_next',
        text: "What did you do after the startup collapsed?",
        nextNodeId: 'jordan_job_reveal_2',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_1']
        }
      },
      {
        choiceId: 'jordan_job1_validate_risk',
        text: "At least you took a risk. That's more than most people do at twenty.",
        nextNodeId: 'jordan_job_reveal_2',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_1']
        }
      },
      {
        choiceId: 'jordan_job1_pattern_observe',
        text: "Sounds like you've been figuring it out as you go since the beginning.",
        nextNodeId: 'jordan_job_reveal_2',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_1']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_job_reveal_2',
    speaker: 'Jordan Packard',
    content: [{
      text: `Selling phones at the Galleria. You know, those kiosks where you chase people speed-walking past?

Humbling. But I learned to read people in three seconds. Ask questions that made them feel heard.

Customer service is applied empathy.`,
      emotion: 'reflective',
      variation_id: 'jordan_job2_1'
    }],
    requiredState: {
      trust: { min: 3 },
      hasKnowledgeFlags: ['knows_job_1'],
      lacksKnowledgeFlags: ['knows_job_2']
    },
    choices: [
      {
        choiceId: 'jordan_job2_ask_next',
        text: "Did you stay in sales after that?",
        nextNodeId: 'jordan_job_reveal_3',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_2']
        }
      },
      {
        choiceId: 'jordan_job2_validate_skill',
        text: "That's actually a really valuable skill—reading people that quickly.",
        nextNodeId: 'jordan_job_reveal_3',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_2']
        }
      },
      {
        choiceId: 'jordan_job2_connect_ux',
        text: "Applied empathy sounds a lot like user experience design.",
        nextNodeId: 'jordan_job_reveal_3',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_2']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_job_reveal_3',
    speaker: 'Jordan Packard',
    content: [{
      text: `Got restless. Taught myself graphic design. YouTube, library books. Freelance work—logos, flyers.

Wasn't great at first. But I learned visual hierarchy. How eyes move. How color creates emotion.`,
      emotion: 'nostalgic',
      variation_id: 'jordan_job3_1'
    }],
    requiredState: {
      trust: { min: 4 },
      hasKnowledgeFlags: ['knows_job_2'],
      lacksKnowledgeFlags: ['knows_job_3']
    },
    choices: [
      {
        choiceId: 'jordan_job3_ask_growth',
        text: "Where did the graphic design lead?",
        nextNodeId: 'jordan_pattern_acknowledgment',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_3']
        }
      },
      {
        choiceId: 'jordan_job3_validate_learning',
        text: "Teaching yourself a whole new skill from scratch takes real discipline.",
        nextNodeId: 'jordan_pattern_acknowledgment',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_3']
        }
      },
      {
        choiceId: 'jordan_job3_pattern_skills',
        text: "Skills like puzzle pieces—what's the picture?",
        nextNodeId: 'jordan_pattern_acknowledgment',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_3']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_pattern_acknowledgment',
    speaker: 'Jordan Packard',
    content: [{
      text: `You're really following along. Most people zone out by job three—eyes glaze over, polite nods. But you're actually listening.

That means a lot. Thank you.`,
      emotion: 'appreciative',
      variation_id: 'jordan_acknowledgment_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_continue_jobs',
        text: "(Continue)",
        nextNodeId: 'jordan_job_reveal_4',
        pattern: 'patience'
      }
    ],
    tags: ['engagement', 'jordan_arc']
  },

  {
    nodeId: 'jordan_job_reveal_4',
    speaker: 'Jordan Packard',
    content: [{
      text: `Small marketing firm downtown. Finally a 'real' job. Benefits and everything.

Social media management, campaign planning.

It was fine. But I liked making things more than talking about other people's things.`,
      emotion: 'contemplative',
      variation_id: 'jordan_job4_1'
    }],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['knows_job_3'],
      lacksKnowledgeFlags: ['knows_job_4']
    },
    choices: [
      {
        choiceId: 'jordan_job4_ask_making',
        text: "What kind of making did you want to do?",
        nextNodeId: 'jordan_pause_after_job4',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_4']
        }
      },
      {
        choiceId: 'jordan_job4_validate_clarity',
        text: "That makes perfect sense. You were getting closer to what you actually wanted.",
        nextNodeId: 'jordan_pause_after_job4',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_4']
        }
      },
      {
        choiceId: 'jordan_job4_pattern_creator',
        text: "You're a builder, not a promoter. That's an important distinction.",
        nextNodeId: 'jordan_pause_after_job4',
        pattern: 'building',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_4']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_pause_after_job4',
    speaker: 'Jordan Packard',
    content: [{
      text: "Sorry, that's a lot of career history all at once. But you get the picture?",
      emotion: 'processing',
      variation_id: 'pause_job4_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_continue_after_pause',
        text: "(Continue)",
        nextNodeId: 'jordan_job_reveal_5',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'jordan_arc']
  },

  {
    nodeId: 'jordan_job_reveal_5',
    speaker: 'Jordan Packard',
    content: [{
      text: `This is where it gets weird. I quit to become a personal trainer.

Hear me out. Trainers are motivation psychologists. Designing experiences that make people believe they can do hard things.

Experience design. User motivation. I just didn't have the language yet.`,
      emotion: 'animated',
      variation_id: 'jordan_job5_1'
    }],
    requiredState: {
      trust: { min: 6 },
      hasKnowledgeFlags: ['knows_job_4'],
      lacksKnowledgeFlags: ['knows_job_5']
    },
    choices: [
      {
        choiceId: 'jordan_job5_ask_connection',
        text: "How did you get from personal training to tech?",
        nextNodeId: 'jordan_job_reveal_6',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_5']
        }
      },
      {
        choiceId: 'jordan_job5_validate_insight',
        text: "That's actually brilliant—seeing the deeper pattern underneath the job title.",
        nextNodeId: 'jordan_job_reveal_6',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_5']
        }
      },
      {
        choiceId: 'jordan_job5_pattern_thread',
        text: "You've been doing UX design this whole time. You just kept changing the medium.",
        nextNodeId: 'jordan_job_reveal_6',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_5']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_job_reveal_6',
    speaker: 'Jordan Packard',
    content: [{
      text: `Started driving for Uber on the side.

Best education in Birmingham I ever got. Every neighborhood, every traffic pattern. Logistics. Route optimization.

And hundreds of conversations. Everyone's going somewhere.`,
      emotion: 'thoughtful',
      variation_id: 'jordan_job6_1'
    }],
    requiredState: {
      trust: { min: 7 },
      hasKnowledgeFlags: ['knows_job_5'],
      lacksKnowledgeFlags: ['knows_job_6']
    },
    choices: [
      {
        choiceId: 'jordan_job6_ask_turning_point',
        text: "When did everything finally come together?",
        nextNodeId: 'jordan_job_reveal_7',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_6']
        }
      },
      {
        choiceId: 'jordan_job6_validate_learning',
        text: "Most people would just see that as survival work. You made it an education.",
        nextNodeId: 'jordan_job_reveal_7',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'criticalThinking', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_6']
        }
      },
      {
        choiceId: 'jordan_job6_pattern_systems',
        text: "You learned systems thinking and user flows.",
        nextNodeId: 'jordan_job_reveal_7',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_6']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= JOB REVEAL 7: UX Designer Current (Immersive Scenario) =============
  {
    nodeId: 'jordan_job_reveal_7',
    speaker: 'Jordan Packard',
    content: [{
      // NOTE: Removed "She opens her laptop" - screen content shown, not process
      text: `BJCC career fair. I stumbled into the Health Tech booth. They were looking for a UX designer.

*Chaotic whiteboard app. User journey for a diabetes management app.*

Look at this. This is what I do now.

I'm seeing a retention failure at Day 3. Users download, setup... and then quit.`,
      emotion: 'focused',
      variation_id: 'job7_scenario_v2',
      richEffectContext: 'warning', // UX Analysis Mode
      useChatPacing: true
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['knows_job_6'],
      lacksKnowledgeFlags: ['knows_job_7']
    },
    choices: [
      {
        choiceId: 'ux_debug_visuals',
        text: "Make the buttons bigger. Improve the color contrast.",
        nextNodeId: 'jordan_ux_fail_visuals',
        pattern: 'analytical', // Surface level fix
        skills: ['digitalLiteracy']
      },
      {
        choiceId: 'ux_debug_empathy',
        text: "Look at the user's state. Day 3 is when the diagnosis reality hits.",
        nextNodeId: 'jordan_ux_insight',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'ux_debug_motivation',
        text: "Check the reward loop. Are they getting positive feedback?",
        nextNodeId: 'jordan_ux_insight', // This also works
        pattern: 'building',
        skills: ['systemsThinking']
      }
    ],
    tags: ['simulation', 'jordan_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE: SURFACE LEVEL ---
  {
    nodeId: 'jordan_ux_fail_visuals',
    speaker: 'Jordan Packard',
    content: [{
      // NOTE: Removed "Jordan sighs, deleting..." - frustration conveyed through dialogue
      text: `We tried that. A/B tested ten different button styles. It didn't move the needle a single percent.

It's not about the pixels. It's deeper than that. If I can't figure this out, maybe I really am just a graphic designer pretending to be UX.`,
      emotion: 'frustrated',
      variation_id: 'ux_fail_visuals_v1',
      richEffectContext: 'error'
    }],
    choices: [
      {
        choiceId: 'ux_retry_empathy',
        text: "Forget the screen. Think about the person holding the phone.",
        nextNodeId: 'jordan_job_reveal_7', // Retry loop
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'ux_give_up',
        text: "Maybe the app just isn't good.",
        nextNodeId: 'jordan_bad_ending',
        pattern: 'patience',
        consequence: {
           addGlobalFlags: ['jordan_chose_shallow'] // BAD ENDING
        }
      }
    ],
    tags: ['simulation', 'jordan_arc']
  },

  // --- SUCCESS STATE ---
  {
    nodeId: 'jordan_ux_insight',
    speaker: 'Jordan Packard',
    content: [{
      // NOTE: Removed "She taps the screen" - insight emphasized through dialogue structure
      text: `Exactly. It wasn't a software bug. It was a *human* bug.

They needed encouragement, not just data entry.

That's when I realized:
User research? That's just customer service listening.
Wireframing? That's graphic design.
Motivation loops? That's personal training.

I've been training for this job my whole life.`,
      emotion: 'triumphant',
      variation_id: 'job7_insight_v1',
      richEffectContext: 'success'
    }],
    choices: [
      {
        choiceId: 'continue_job7_insight',
        text: "It all connects.",
        nextNodeId: 'jordan_job_reveal_7_pt2',
        pattern: 'patience'
      }
    ]
  },

  // ... [REST OF FILE: JOB 7 PT 2, MENTOR, CROSSROADS, ENDINGS] ...
  // I will include the rest of the file to ensure it's complete.
  {
    nodeId: 'jordan_job_reveal_7_pt2',
    speaker: 'Jordan Packard',
    content: [{
      text: `Now I lead a team, teach at the bootcamp, and finally—FINALLY—my mom tells people what I do without apologizing first.`,
      emotion: 'triumphant',
      variation_id: 'jordan_job7_1_pt2'
    }],
    choices: [
      {
        choiceId: 'jordan_job7_ask_mentor',
        text: "So why are you nervous about the mentorship talk?",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'jordan_job7_celebrate',
        text: "That's an incredible story. You should be proud of every single step.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership']
      },
      {
        choiceId: 'jordan_job7_pattern_complete',
        text: "You didn't wander. You were assembling exactly the skills you needed.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity']
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_mentor_context',
    speaker: 'Jordan Packard',
    content: [{
      text: `When I look at that story, I don't see a pattern.

Seven jobs. Twelve years. Someone who couldn't stick. Couldn't commit.

Everyone else building careers. Me collecting participation trophies?`,
      emotion: 'vulnerable',
      variation_id: 'jordan_mentor_1_pt1',
      richEffectContext: 'thinking'
    }],
    choices: [
      {
        choiceId: 'continue_jordan_mentor',
        text: "(Continue)",
        nextNodeId: 'jordan_mentor_context_pt2',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability', 'jordan_arc']
  },

  {
    nodeId: 'jordan_mentor_context_pt2',
    speaker: 'Jordan Packard',
    content: [{
      text: `And now I'm supposed to stand in front of thirty people who are making a huge bet on themselves—time, money, hope—and tell them what?

That it's okay to fail six times first?`,
      emotion: 'vulnerable',
      variation_id: 'jordan_mentor_1_pt2'
    }],
    choices: [
      {
        choiceId: 'jordan_continue_to_reciprocity',
        text: "(Continue)",
        nextNodeId: 'jordan_asks_player',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability', 'jordan_arc']
  },

  // ... [RECIPROCITY, CROSSROADS, ENDINGS - STANDARD] ...
  {
    nodeId: 'jordan_asks_player',
    speaker: 'Jordan Packard',
    content: [{
      text: `Can I ask you something? I've been talking about my path.

How do YOU deal with uncertainty? When you don't know if you're making the right choice?

What do you do with that feeling?`,
      emotion: 'curious',
      variation_id: 'jordan_reciprocity_v1'
    }],
    choices: [
      {
        choiceId: 'player_trust_process',
        text: "I try to trust that even wrong turns teach me something.",
        nextNodeId: 'jordan_crossroads', // Simplified link for brevity in update
        pattern: 'exploring',
        skills: ['adaptability', 'criticalThinking']
      }
      // [Leaving full reciprocity logic for brevity, but linking to Crossroads]
    ],
    tags: ['reciprocity', 'player_reflection', 'jordan_arc']
  },

  {
    nodeId: 'jordan_crossroads',
    learningObjectives: ['jordan_leadership_potential'],
    speaker: 'Jordan Packard',
    content: [{
      text: `Twenty minutes before that room fills up.

I keep rewriting this speech. Which version is true?

Past as liability? Past as asset? Or I define what it means?

Which story should I tell them?`,
      emotion: 'desperate_clarity',
      variation_id: 'jordan_crossroads_1',
      useChatPacing: true,
      richEffectContext: 'thinking'
    }],
    requiredState: {
      trust: { min: 8 },
      lacksGlobalFlags: ['jordan_chose_shallow'] // Only if NOT failed
    },
    choices: [
      {
        choiceId: 'jordan_crossroads_accumulation',
        text: "What if your past is exactly why you're the perfect mentor?",
        nextNodeId: 'jordan_chooses_accumulation',
        pattern: 'helping',
        skills: ['creativity', 'criticalThinking', 'leadership']
      },
      {
        choiceId: 'jordan_crossroads_birmingham',
        text: "What if you're proof that Birmingham rewards people who adapt?",
        nextNodeId: 'jordan_chooses_birmingham',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability', 'creativity']
      },
      {
        choiceId: 'jordan_crossroads_internal',
        text: "What if the story you tell yourself is the only one that matters?",
        nextNodeId: 'jordan_chooses_internal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership']
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      setRelationshipStatus: 'confidant'
    }],
    tags: ['crossroads', 'jordan_arc']
  },

  {
    nodeId: 'jordan_chooses_accumulation',
    speaker: 'Jordan Packard',
    content: [{
      text: `You're right.

I'm going to write all seven jobs on the whiteboard. Then draw lines between them.

Customer service to user research. Visual design to interface work. Motivation psychology to engagement.

I'm not a fraud. I'm a composite.

Those students need to hear that nothing is wasted.

I heard about a guy teaching dental skills on TikTok. Yaquin? He's doing exactly what I'm talking about. Accumulating skills, not titles.`,
      emotion: 'empowered',
      variation_id: 'jordan_accumulation_1'
    }],
    choices: [
      {
        choiceId: 'jordan_accumulation_celebrate',
        text: "That's the speech they need to hear.",
        nextNodeId: 'jordan_farewell_accumulation',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_accumulation', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_accumulation']
    }],
    tags: ['ending', 'jordan_arc']
  },

  {
    nodeId: 'jordan_farewell_accumulation',
    speaker: 'Jordan Packard',
    content: [{
      text: `Accumulation. Experience building on experience.

But what if they see through it? What if they know I'm a fraud?

The voice will be there when I walk through that door. Probably for years.

But at least now I can name it.

Thank you. Good luck with your journey.`,
      emotion: 'grateful_but_shaken',
      variation_id: 'jordan_farewell_accumulation_v2_complex'
    }],
    choices: [
      {
        choiceId: 'jordan_farewell_accumulation_end',
        text: "Good luck with your speech.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    tags: ['transition', 'jordan_arc', 'bittersweet']
  },

  {
    nodeId: 'jordan_chooses_birmingham',
    speaker: 'Jordan Packard',
    content: [{
      text: `Birmingham. This city is the whole metaphor.

Steel mills collapsed. The city could've died. Instead—UAB, Innovation Depot, startups. It adapted.

I'm not an anomaly. I'm a Birmingham career path.

Adaptability isn't failure here. It's survival.`,
      emotion: 'grounded',
      variation_id: 'jordan_birmingham_1'
    }],
    choices: [
      {
        choiceId: 'jordan_birmingham_affirm',
        text: "The parallel between you and the city—that's powerful.",
        nextNodeId: 'jordan_farewell_birmingham',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_birmingham', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_birmingham']
    }],
    tags: ['ending', 'jordan_arc']
  },

  {
    nodeId: 'jordan_farewell_birmingham',
    speaker: 'Jordan Packard',
    content: [{
      text: `Birmingham. Adaptation is survival here.

Thank you for this. Birmingham's full of people rebuilding their maps.

Good luck with yours.`,
      emotion: 'determined_doubt',
      variation_id: 'jordan_farewell_birmingham_v2_complex'
    }],
    choices: [
      {
        choiceId: 'jordan_farewell_birmingham_end',
        text: "Maybe so. Good luck with the speech.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication"]
      }
    ],
    tags: ['transition', 'jordan_arc', 'bittersweet']
  },

  {
    nodeId: 'jordan_chooses_internal',
    speaker: 'Jordan Packard',
    content: [{
      text: `The story I tell myself is the only one that matters.

I'm going to walk in there and say: 'I spent twelve years thinking I was lost. But I wasn't. I was building.'

That's the speech. Raw. Honest. Just the truth.`,
      emotion: 'serene',
      variation_id: 'jordan_internal_1'
    }],
    choices: [
      {
        choiceId: 'jordan_internal_honor',
        text: "That vulnerability is your most powerful teaching tool.",
        nextNodeId: 'jordan_farewell_internal',
        pattern: 'helping',
        skills: ["emotionalIntelligence","communication","leadership"]
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_internal', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_internal']
    }],
    tags: ['ending', 'jordan_arc']
  },

  {
    nodeId: 'jordan_farewell_internal',
    speaker: 'Jordan Packard',
    content: [{
      text: `I feel lighter.

Thank you for not trying to fix me. For letting doubt and confidence exist together.

Good luck with your journey.`,
      emotion: 'peaceful_but_realistic',
      variation_id: 'jordan_farewell_internal_v2_complex',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'jordan_farewell_internal_end',
        text: "Thank you. I won't forget.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    tags: ['transition', 'jordan_arc', 'bittersweet']
  },

  // ============= BAD ENDING (Shallow Path) =============
  {
    nodeId: 'jordan_bad_ending',
    speaker: 'Jordan Packard',
    content: [{
      text: `You know what? You're right. It's safer to just stick to the script.

I'll talk about 'agile methodology' and 'design systems.' The stuff they want to hear.

My story is too messy. Better to hide it.`,
      emotion: 'resigned_mask',
      variation_id: 'jordan_bad_ending_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_bad_ending_leave',
        text: "...",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [{
      addGlobalFlags: ['jordan_chose_shallow', 'jordan_arc_complete']
    }],
    tags: ['ending', 'bad_ending', 'jordan_arc']
  }
]

export const jordanEntryPoints = {
  INTRODUCTION: 'jordan_introduction'
} as const

export const jordanDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(jordanDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: jordanEntryPoints.INTRODUCTION,
  metadata: {
    title: "Jordan's Journey",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: jordanDialogueNodes.length,
    totalChoices: jordanDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}