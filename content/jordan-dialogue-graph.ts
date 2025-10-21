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
  // ============= INTRODUCTION (Trust 0) =============
  {
    nodeId: 'jordan_introduction',
    speaker: 'Jordan Packard',
    content: [{
      text: "Hey there! Career Day at the coding bootcamp. Innovation Depot, Conference Room B. Got here way too early. Classic overcompensation.\n\nI've rewritten this speech six times. Look—\n\nUX Designer. Gym Manager. Marketing Coordinator. Uber Driver. Freelance Developer. Product Manager. Senior Designer.\n\nSeven jobs. Twelve years.\n\nWhat do you tell thirty students about career paths when yours looks like this?",
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
        skills: ['emotional_intelligence', 'communication'],
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
        skills: ['critical_thinking', 'communication'],
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

  // ============= CAREER CONTEXT (Trust 1) =============
  {
    nodeId: 'jordan_career_question',
    speaker: 'Jordan Packard',
    content: [{
      text: "It's a mentorship panel for a coding bootcamp cohort—about thirty students trying to break into tech. I'm supposed to share my 'journey' and give advice. Which sounds simple until you actually sit down to figure out what to say, you know?\n\nI've rewritten this speech like six times. What do you even tell people about career paths when yours looks like... well. Mine.",
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
        skills: ['emotional_intelligence', 'communication', 'leadership'],
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

  // ============= JOB REVEAL 1: Alabama A&M (Trust 2) =============
  {
    nodeId: 'jordan_job_reveal_1',
    speaker: 'Jordan Packard',
    content: [{
      text: "Okay, so. I started at Alabama A&M in Huntsville—computer science major. Did one semester, got recruited by this startup that was 'the next big thing.' Dropped out to join them.\n\nThey folded in eight months. No degree, no job, no plan. I was twenty years old, back in Birmingham, living with my mom who kept asking when I was going back to school.",
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
        skills: ['emotional_intelligence', 'communication', 'leadership'],
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
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_1']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= JOB REVEAL 2: Galleria Sales (Trust 3) =============
  {
    nodeId: 'jordan_job_reveal_2',
    speaker: 'Jordan Packard',
    content: [{
      text: "I got a job selling phones at the Galleria. You know, the kiosks in the middle of the walkway where you try to make eye contact with people speed-walking past you?\n\nIt was humbling. But I learned something crucial: how to read people in three seconds. How to ask questions that made them feel heard instead of sold to. Customer service is just applied empathy, really.",
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
        skills: ['emotional_intelligence', 'communication'],
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
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_2']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= JOB REVEAL 3: Graphic Design (Trust 4) =============
  {
    nodeId: 'jordan_job_reveal_3',
    speaker: 'Jordan Packard',
    content: [{
      text: "No, I got restless. Taught myself graphic design through YouTube tutorials and library books. Started doing freelance work—logos, flyers, that kind of thing.\n\nI wasn't great at first. But I learned visual hierarchy. How people's eyes move across a page. How color creates emotion before words even register.",
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
        skills: ['emotional_intelligence', 'communication', 'leadership'],
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
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_3']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= PATTERN ACKNOWLEDGMENT: Jordan notices player engagement =============
  {
    nodeId: 'jordan_pattern_acknowledgment',
    speaker: 'Jordan Packard',
    content: [{
      text: "You're really following along. Most people zone out by job three—eyes glaze over, polite nods. But you're actually listening.\n\nThat means a lot. Thank you.",
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

  // ============= JOB REVEAL 4: Marketing Firm (Trust 5) =============
  {
    nodeId: 'jordan_job_reveal_4',
    speaker: 'Jordan Packard',
    content: [{
      text: "I got hired at a small marketing firm downtown. Finally, a 'real' job with benefits and everything. I did social media management, some campaign planning.\n\nIt was fine. Professional. But I realized I liked making things more than I liked talking about things other people made. Does that make sense?",
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
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_4']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= PAUSE: After Job 4 Reveal (Breathing Room) =============
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

  // ============= JOB REVEAL 5: Personal Trainer (Trust 6) =============
  {
    nodeId: 'jordan_job_reveal_5',
    speaker: 'Jordan Packard',
    content: [{
      text: "Okay, this is where it gets weird. I quit to become a personal trainer.\n\nI know. But hear me out—I'd been going to the gym to deal with work stress, and I realized trainers are really just motivation psychologists. They're designing experiences that make people believe they can do hard things.\n\nThat clicked for me. Experience design. User motivation. I just didn't have the language for it yet.",
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
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_5']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= JOB REVEAL 6: Uber Driver (Trust 7) =============
  {
    nodeId: 'jordan_job_reveal_6',
    speaker: 'Jordan Packard',
    content: [{
      text: "I didn't. Not directly. Personal training didn't pay enough, so I started driving for Uber on the side.\n\nBest education in Birmingham I ever got. You learn every neighborhood, every traffic pattern, every event that changes the flow of the city. You learn logistics. Efficiency. Route optimization.\n\nAnd you talk to hundreds of people. Tourists, business folks, college kids. Everyone's going somewhere, and they all have a story about why.",
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
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_6']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= JOB REVEAL 7: UX Designer Current (Trust 8) - Part 1 =============
  {
    nodeId: 'jordan_job_reveal_7',
    speaker: 'Jordan Packard',
    content: [{
      text: "Birmingham-Jefferson Convention Complex (BJCC) career fair, three years ago. I was there dropping off a passenger, saw the banner, wandered in on a whim.\n\nThere was a booth for Innovation Depot (Birmingham's startup hub)—health tech startup looking for a UX designer. I didn't even know what UX meant, but when they explained it, everything clicked.\n\nUser research? That's customer service. Visual design? Graphic design. Motivation psychology? Personal training. Systems thinking (seeing how parts connect)? Uber. They hired me as a junior designer that week.",
      emotion: 'triumphant',
      variation_id: 'jordan_job7_1_pt1'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['knows_job_6'],
      lacksKnowledgeFlags: ['knows_job_7']
    },
    choices: [
      {
        choiceId: 'continue_job7',
        text: "(Continue)",
        nextNodeId: 'jordan_job_reveal_7_pt2',
        pattern: 'patience'
      }
    ]
  },

  // ============= JOB REVEAL 7: UX Designer Current - Part 2 =============
  {
    nodeId: 'jordan_job_reveal_7_pt2',
    speaker: 'Jordan Packard',
    content: [{
      text: "Now I lead a team, teach at the bootcamp, and finally—FINALLY—my mom tells people what I do without apologizing first.",
      emotion: 'triumphant',
      variation_id: 'jordan_job7_1_pt2'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['knows_job_6'],
      lacksKnowledgeFlags: ['knows_job_7']
    },
    choices: [
      {
        choiceId: 'jordan_job7_ask_mentor',
        text: "So why are you nervous about the mentorship talk?",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'exploring',
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_7']
        }
      },
      {
        choiceId: 'jordan_job7_celebrate',
        text: "That's an incredible story. You should be proud of every single step.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'helping',
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_7']
        }
      },
      {
        choiceId: 'jordan_job7_pattern_complete',
        text: "You didn't wander. You were assembling exactly the skills you needed.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'analytical',
        skills: ['critical_thinking', 'creativity'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_7']
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  // ============= MENTOR CONTEXT (Trust 8) - Part 1 =============
  {
    nodeId: 'jordan_mentor_context',
    speaker: 'Jordan Packard',
    content: [{
      text: "Because when I look at that story, I don't see a clever pattern.\n\nI see seven jobs in twelve years. Someone who couldn't stick with anything. Couldn't commit.\n\nCouldn't figure it out while everyone else was building careers, I was... what? Collecting participation trophies?",
      emotion: 'vulnerable',
      variation_id: 'jordan_mentor_1_pt1'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['knows_job_7']
    },
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

  // ============= MENTOR CONTEXT - Part 2 =============
  {
    nodeId: 'jordan_mentor_context_pt2',
    speaker: 'Jordan Packard',
    content: [{
      text: "And now I'm supposed to stand in front of thirty people who are making a huge bet on themselves—time, money, hope—and tell them what?\n\nThat it's okay to fail six times first?",
      emotion: 'vulnerable',
      variation_id: 'jordan_mentor_1_pt2'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['knows_job_7']
    },
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

  // ============= RECIPROCITY: Jordan Asks Player =============
  {
    nodeId: 'jordan_asks_player',
    speaker: 'Jordan Packard',
    content: [{
      text: "Actually, can I ask you something? I've been talking about my path this whole time, but... how do YOU deal with uncertainty?\n\nLike, when you don't know if you're making the right choice—career, life, whatever. What do you do with that feeling?",
      emotion: 'curious',
      variation_id: 'jordan_reciprocity_v1'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['knows_job_7']
    },
    choices: [
      {
        choiceId: 'player_trust_process',
        text: "I try to trust that even wrong turns teach me something.",
        nextNodeId: 'jordan_response_trust',
        pattern: 'exploring',
        skills: ['adaptability', 'critical_thinking']
      },
      {
        choiceId: 'jordan_strength_recognition',
        text: "You're asking me, but you've already navigated seven careers. You know how.",
        nextNodeId: 'jordan_response_trust',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      },
      {
        choiceId: 'player_plan_reduce_uncertainty',
        text: "I make plans. Structure helps me feel less lost.",
        nextNodeId: 'jordan_response_plan',
        pattern: 'exploring',
        skills: ['problem_solving']
      },
      {
        choiceId: 'player_sit_with_discomfort',
        text: "I sit with it. Uncertainty doesn't always need solving.",
        nextNodeId: 'jordan_response_acceptance',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'adaptability']
      },
      {
        choiceId: 'player_uncertainty_terrifies',
        text: "Honestly? It terrifies me. I avoid it when I can.",
        nextNodeId: 'jordan_response_fear',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'communication']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'jordan_arc']
  },

  {
    nodeId: 'jordan_response_trust',
    speaker: 'Jordan Packard',
    content: [{
      text: "That's... really wise, actually. Wrong turns teach you something. Maybe that's what I needed to hear about my own path.\n\nThank you for sharing that with me.",
      emotion: 'thoughtful',
      variation_id: 'jordan_response_trust_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_continue_after_trust',
        text: "(Continue)",
        nextNodeId: 'jordan_impostor_reveal',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'jordan_arc']
  },

  {
    nodeId: 'jordan_response_plan',
    speaker: 'Jordan Packard',
    content: [{
      text: "Yeah, I get that. Structure as a life raft. I tried that for years—making plans, setting goals. Sometimes it helped. Sometimes life just... laughed at my spreadsheets.\n\nBut I respect the attempt. Thanks for being honest.",
      emotion: 'understanding',
      variation_id: 'jordan_response_plan_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_continue_after_plan',
        text: "(Continue)",
        nextNodeId: 'jordan_impostor_reveal',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'jordan_arc']
  },

  {
    nodeId: 'jordan_response_acceptance',
    speaker: 'Jordan Packard',
    content: [{
      text: "Wow. That's... I don't know if I'm there yet. Just sitting with uncertainty without trying to fix it or understand it or plan around it?\n\nThat takes real strength. Thank you for that perspective.",
      emotion: 'impressed',
      variation_id: 'jordan_response_acceptance_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_continue_after_acceptance',
        text: "(Continue)",
        nextNodeId: 'jordan_impostor_reveal',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'jordan_arc']
  },

  {
    nodeId: 'jordan_response_fear',
    speaker: 'Jordan Packard',
    content: [{
      text: "Okay, thank you for saying that. Because same. God, same. I spent twelve years running from uncertainty by just... jumping to the next thing.\n\nMaybe we're both still learning. Thanks for being real with me.",
      emotion: 'connected',
      variation_id: 'jordan_response_fear_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_continue_after_fear',
        text: "(Continue)",
        nextNodeId: 'jordan_impostor_reveal',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'jordan_arc']
  },

  // ============= IMPOSTOR SYNDROME REVEAL (Trust 9) =============
  {
    nodeId: 'jordan_impostor_reveal',
    speaker: 'Jordan Packard',
    content: [{
      text: "Let me show you something. A text from my mom after I quit the marketing firm.\n\n'Another one? Are you sure you're not just being picky, baby?'\n\nShe didn't say it to be cruel—she was worried about me. But I hear that voice every time someone calls me a 'senior designer' or asks me to mentor.\n\nWhat if I'm not proof of adaptability? What if I'm just a fraud who got lucky at a career fair? What if those students look at my résumé and think, 'This person has no idea what they're doing'?\n\nBecause some days, that's exactly what I think.",
      emotion: 'raw',
      variation_id: 'jordan_impostor_1'
    }],
    requiredState: {
      trust: { min: 9 },
      lacksKnowledgeFlags: ['impostor_revealed']
    },
    choices: [
      {
        choiceId: 'jordan_impostor_ask_real',
        text: "What if you believed your story?",
        nextNodeId: 'jordan_crossroads',
        pattern: 'exploring',
        skills: ['creativity', 'critical_thinking', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['impostor_revealed']
        }
      },
      {
        choiceId: 'jordan_impostor_affirm',
        text: "You're not a fraud. You're the most qualified person to give this talk.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'helping',
        skills: ['emotional_intelligence', 'leadership'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['impostor_revealed']
        }
      },
      {
        choiceId: 'jordan_impostor_reframe',
        text: "Luck is what people call it when preparation meets opportunity. You created both.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'analytical',
        skills: ['critical_thinking', 'creativity'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['impostor_revealed']
        }
      }
    ],
    tags: ['climax', 'jordan_arc']
  },

  // ============= CROSSROADS (Trust 10) =============
  {
    nodeId: 'jordan_crossroads',
    speaker: 'Jordan Packard',
    content: [{
      text: "I have twenty minutes before that room fills up. Twenty minutes to decide what story I'm telling—about myself, about career paths, about Birmingham, about what counts as success.\n\nI keep rewriting this speech because I don't know which version is true. The one where my past is a liability? The one where it's an asset? The one where it doesn't matter because I define what it means?\n\nWhich story should I tell those students?",
      emotion: 'desperate_clarity',
      variation_id: 'jordan_crossroads_1'
    }],
    requiredState: {
      trust: { min: 10 },
      hasKnowledgeFlags: ['impostor_revealed']
    },
    choices: [
      {
        choiceId: 'jordan_crossroads_accumulation',
        text: "What if your past is exactly why you're the perfect mentor?",
        nextNodeId: 'jordan_chooses_accumulation',
        pattern: 'helping',
        skills: ['creativity', 'critical_thinking', 'leadership']
      },
      {
        choiceId: 'jordan_crossroads_birmingham',
        text: "What if you're proof that Birmingham rewards people who adapt?",
        nextNodeId: 'jordan_chooses_birmingham',
        pattern: 'analytical',
        skills: ['critical_thinking', 'adaptability', 'creativity']
      },
      {
        choiceId: 'jordan_crossroads_internal',
        text: "What if the story you tell yourself is the only one that matters?",
        nextNodeId: 'jordan_chooses_internal',
        pattern: 'patience',
        skills: ['emotional_intelligence', 'leadership']
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      setRelationshipStatus: 'confidant'
    }],
    tags: ['crossroads', 'jordan_arc']
  },

  // ============= ENDING A: ACCUMULATION FRAME =============
  {
    nodeId: 'jordan_chooses_accumulation',
    speaker: 'Jordan Packard',
    content: [{
      text: "You're right.\n\nI'm going to write all seven jobs on the whiteboard. Then draw lines between them.\n\nCustomer service to user research. Visual design to interface work. Motivation psychology to engagement.\n\nI'm not a fraud. I'm a composite.\n\nThose students need to hear that nothing is wasted.",
      emotion: 'empowered',
      variation_id: 'jordan_accumulation_1'
    }],
    requiredState: {
      hasKnowledgeFlags: ['impostor_revealed']
    },
    choices: [
      {
        choiceId: 'jordan_accumulation_celebrate',
        text: "That's the speech they need to hear.",
        nextNodeId: 'jordan_farewell_accumulation',
        pattern: 'helping'
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_accumulation', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_accumulation']
    }],
    tags: ['ending', 'jordan_arc']
  },

  // ============= ENDING B: BIRMINGHAM FRAME =============
  {
    nodeId: 'jordan_chooses_birmingham',
    speaker: 'Jordan Packard',
    content: [{
      text: "Birmingham. This city is the whole metaphor.\n\nSteel mills collapsed. The city could've died. Instead—UAB, Innovation Depot, startups. It adapted.\n\nI'm not an anomaly. I'm a Birmingham career path.\n\nI'm going to tell those students: if Birmingham can reinvent itself after industrial collapse, they can pivot from one career to another.\n\nAdaptability isn't failure here. It's survival.",
      emotion: 'grounded',
      variation_id: 'jordan_birmingham_1'
    }],
    requiredState: {
      hasKnowledgeFlags: ['impostor_revealed']
    },
    choices: [
      {
        choiceId: 'jordan_birmingham_affirm',
        text: "The parallel between you and the city—that's powerful.",
        nextNodeId: 'jordan_farewell_birmingham',
        pattern: 'helping'
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_birmingham', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_birmingham']
    }],
    tags: ['ending', 'jordan_arc']
  },

  // ============= ENDING C: INTERNAL VALIDATION FRAME =============
  {
    nodeId: 'jordan_chooses_internal',
    speaker: 'Jordan Packard',
    content: [{
      text: "The story I tell myself is the only one that matters.\n\nI don't need to convince them. I don't need to prove anything.\n\nI'm going to walk in there and say: 'I spent twelve years thinking I was lost. But I wasn't. I was building.'\n\nThat's the speech. Raw. Honest. Just the truth.",
      emotion: 'serene',
      variation_id: 'jordan_internal_1'
    }],
    requiredState: {
      hasKnowledgeFlags: ['impostor_revealed']
    },
    choices: [
      {
        choiceId: 'jordan_internal_honor',
        text: "That vulnerability is your most powerful teaching tool.",
        nextNodeId: 'jordan_farewell_internal',
        pattern: 'helping'
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_internal', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_internal']
    }],
    tags: ['ending', 'jordan_arc']
  },

  // ============= FAREWELL NODES (Return to Samuel for Reflection) =============
  {
    nodeId: 'jordan_farewell_accumulation',
    speaker: 'Jordan Packard',
    content: [{
      text: "Accumulation. Experience building on experience.\n\nBut what if they see through it? What if they know I'm a fraud?\n\nThe voice will be there when I walk through that door. Probably for years.\n\nBut at least now I can name it.\n\nThank you. Good luck with your journey.",
      emotion: 'grateful_but_shaken',
      variation_id: 'jordan_farewell_accumulation_v2_complex'
    }],
    choices: [
      {
        choiceId: 'jordan_farewell_accumulation_end',
        text: "Good luck with your speech.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    tags: ['transition', 'jordan_arc', 'bittersweet']
  },

  {
    nodeId: 'jordan_farewell_birmingham',
    speaker: 'Jordan Packard',
    content: [{
      text: "Birmingham. Adaptation is survival here.\n\nSome of those jobs? I hated them. Rage-quit after six weeks. Got laid off.\n\nBut I'm going in there anyway.\n\nThank you for this. Birmingham's full of people rebuilding their maps.\n\nGood luck with yours.",
      emotion: 'determined_doubt',
      variation_id: 'jordan_farewell_birmingham_v2_complex'
    }],
    choices: [
      {
        choiceId: 'jordan_farewell_birmingham_end',
        text: "Maybe so. Good luck with the speech.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    tags: ['transition', 'jordan_arc', 'bittersweet']
  },

  {
    nodeId: 'jordan_farewell_internal',
    speaker: 'Jordan Packard',
    content: [{
      text: "I feel lighter.\n\nThe doubts will be back. Impostor syndrome doesn't get defeated once.\n\nBut for today, I believe what I said.\n\nThank you for not trying to fix me. For letting doubt and confidence exist together.\n\nGood luck with your journey.",
      emotion: 'peaceful_but_realistic',
      variation_id: 'jordan_farewell_internal_v2_complex'
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
  }
]

// ============= PUBLIC API: EXPORTED ENTRY POINTS =============
// These entry points are for cross-graph navigation.
// ONLY use these exported constants when linking from other graphs.

export const jordanEntryPoints = {
  /** Initial entry point - meeting Jordan before her Career Day talk */
  INTRODUCTION: 'jordan_introduction'
} as const

// Type export for TypeScript autocomplete
export type JordanEntryPoint = typeof jordanEntryPoints[keyof typeof jordanEntryPoints]

export const jordanDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(jordanDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: jordanEntryPoints.INTRODUCTION,
  metadata: {
    title: "Jordan's Journey",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: jordanDialogueNodes.length,
    totalChoices: jordanDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}