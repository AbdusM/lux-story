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
      text: "Stand up! Look around you. See that? That's not a crowd, that's potential energy waiting for a spark.\n\nWe don't need permission to fix the vents. We just need enough hands.\n\nYou. You've got hands. You in or out?",
      emotion: 'friendly_but_anxious',
      variation_id: 'jordan_intro_v2_visual_hook',
      patternReflection: [
        { pattern: 'exploring', minLevel: 5, altText: "Hey! Career Day at Covalence—the coding bootcamp at Innovation Depot.\n\nSeven jobs. Twelve years. I've explored everything.\n\nYou have that same look, you know. Like you want to see what's around every corner.\n\nWhat do you tell students when your path looks like this?", altEmotion: 'warm' },
        { pattern: 'patience', minLevel: 5, altText: "Hey! Career Day at Covalence. Got here way too early.\n\nI've rewritten this speech six times. Seven jobs. Twelve years.\n\nYou're calm. That's nice. Most people get anxious just looking at my resume.", altEmotion: 'grateful' },
        { pattern: 'building', minLevel: 5, altText: "Hey! Career Day at Covalence—the coding bootcamp.\n\nUX Designer. Product Manager. Senior Designer. I've built things in every one of those roles.\n\nYou build things too, don't you? I can tell.\n\nWhat do you tell students when your path looks like this?", altEmotion: 'curious' }
      ]
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
        },
        voiceVariations: {
          analytical: "Seven jobs in twelve years. What pattern connects them?",
          helping: "That's quite a journey. How did each role shape you?",
          building: "Each role built on the last? What did you create in each?",
          exploring: "That's a lot of different roles. What's the through-line?",
          patience: "Seven jobs. Twelve years. That's a story. Take your time telling it."
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
        },
        voiceVariations: {
          analytical: "Six iterations. That's thorough preparation.",
          helping: "Six rewrites means you care about getting it right.",
          building: "Six drafts is solid craftsmanship. What's changing each time?",
          exploring: "Six versions—you're searching for the right story.",
          patience: "Taking time to get it right. That's wise."
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
        },
        voiceVariations: {
          analytical: "You seem uncertain about your own story.",
          helping: "Something's weighing on you about this speech.",
          building: "You've built a lot. Why hesitate to share it?",
          exploring: "There's doubt underneath the confidence, isn't there?",
          patience: "You're wrestling with something. I can wait."
        }
      },
      {
        choiceId: 'jordan_intro_patience',
        text: "[Let the silence hold. She's still figuring out how to begin.]",
        nextNodeId: 'jordan_career_question',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "[Wait. Observe what she does with the silence.]",
          helping: "[Just be present. Let her find her words.]",
          building: "[Hold space. She's assembling something.]",
          exploring: "[Watch. Sometimes the pause reveals more than words.]",
          patience: "[Let the silence hold. She's still figuring out how to begin.]"
        }
      },
      // Pattern unlock choices - only visible when player has built enough pattern affinity
      {
        choiceId: 'intro_seven_jobs_unlock',
        text: "[Seeker's Eye] Seven jobs isn't chaos—it's exploration. Tell me what you found.",
        nextNodeId: 'jordan_seven_jobs_story',
        pattern: 'exploring',
        skills: ['communication'],
        visibleCondition: {
          patterns: { exploring: { min: 40 } }
        },
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      },
      {
        choiceId: 'intro_impostor_unlock',
        text: "[Empathy Sense] You're nervous. Not about the speech—about whether you deserve to give it.",
        nextNodeId: 'jordan_impostor_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          patterns: { helping: { min: 50 } }
        },
        consequence: {
          characterId: 'jordan',
          trustChange: 2
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
      variation_id: 'jordan_career_1',
      patternReflection: [
        { pattern: 'helping', minLevel: 4, altText: "Mentorship panel. Thirty students trying to break into tech.\n\nShare my 'journey' and give advice. Sounds simple.\n\nYou actually want to help, don't you? I can tell. Most people just want to hear themselves talk.", altEmotion: 'grateful' },
        { pattern: 'patience', minLevel: 4, altText: "Mentorship panel. Thirty students.\n\nI've rewritten this speech six times. You're not rushing me to get to the point.\n\nThat's... actually helpful. The silence lets me think.", altEmotion: 'reflective' }
      ]
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
        },
        voiceVariations: {
          analytical: "Walk me through the data. What does your path look like?",
          helping: "I'd like to hear your story. What does your path look like?",
          building: "Show me the blueprint. What did you build over those twelve years?",
          exploring: "What does your path look like?",
          patience: "Take your time. Tell me what your path looks like."
        }
      },
      {
        choiceId: 'jordan_career_relate_messy',
        text: "Maybe messy paths are the most honest ones to share.",
        nextNodeId: 'jordan_job_reveal_1',
        pattern: 'exploring',
        skills: ['curiosity', 'communication', 'leadership'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "Non-linear paths are common. The honest data is messy.",
          helping: "Real journeys aren't neat. Your mess might help someone.",
          building: "The best projects have messy blueprints. Same with careers.",
          exploring: "Maybe messy paths are the most honest ones to share.",
          patience: "Life isn't linear. Maybe that's the point."
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
        },
        voiceVariations: {
          analytical: "Six rewrites means you're overthinking the story you're telling.",
          helping: "You're being too hard on yourself with all those rewrites.",
          building: "At some point, the drafts are done. Ship it.",
          exploring: "Six versions—maybe you're looking for the wrong story.",
          patience: "Sometimes the best version is just the one you finally let go."
        }
      },
      {
        choiceId: 'jordan_career_structure',
        text: "What if you structured it differently? Build from the outcome backward.",
        nextNodeId: 'jordan_job_reveal_1',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "Reverse-engineer the narrative. Start from where you are now.",
          helping: "What if you told it from where you landed, looking back?",
          building: "What if you structured it differently? Build from the outcome backward.",
          exploring: "What if you started at the end and worked backwards?",
          patience: "Sometimes the ending shows you how the beginning should feel."
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
      variation_id: 'jordan_job1_1',
      patternReflection: [
        { pattern: 'exploring', minLevel: 4, altText: "Alabama A&M. One semester, then got recruited by a startup. 'The next big thing.'\n\nFolded in eight months. You understand that, right? The leap into something unknown. The crash.\n\nTwenty years old, back with my mom.", altEmotion: 'rueful' },
        { pattern: 'building', minLevel: 4, altText: "Alabama A&M. Computer science major. One semester.\n\nThe startup folded in eight months. You've built things that failed too, haven't you? You know the feeling.\n\nNo degree, no job, no plan.", altEmotion: 'vulnerable' }
      ]
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
        },
        voiceVariations: {
          analytical: "The startup failed. Then what? Walk me through the recovery.",
          helping: "That must have been hard. What came next?",
          building: "So the first project failed. What did you build next?",
          exploring: "What did you do after the startup collapsed?",
          patience: "Take your time. What came after the crash?"
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
        },
        voiceVariations: {
          analytical: "Failure at twenty means you tried. That's statistically rare.",
          helping: "At least you took a risk. That's more than most people do at twenty.",
          building: "You shipped something at twenty. Most people never ship anything.",
          exploring: "Most people don't take risks like that. You did.",
          patience: "You tried something big. That matters."
        }
      },
      {
        choiceId: 'jordan_job1_pattern_observe',
        text: "Sounds like you've been figuring it out as you go since the beginning.",
        nextNodeId: 'jordan_job_reveal_2',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability', 'communication'],
        visibleCondition: {
          patterns: { analytical: { min: 4 } }
        },
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_1']
        },
        voiceVariations: {
          analytical: "Sounds like you've been figuring it out as you go since the beginning.",
          helping: "You've been adapting from the start. That's resilience.",
          building: "No blueprint. Just iteration. That's how real things get built.",
          exploring: "So the pattern started early—learning by doing.",
          patience: "Life rarely follows a plan. You figured that out young."
        }
      },
      {
        choiceId: 'jordan_job1_patience',
        text: "[Nod quietly. That's a hard thing to share.]",
        nextNodeId: 'jordan_job_reveal_2',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        visibleCondition: {
          patterns: { patience: { min: 3 } }
        },
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_1']
        },
        voiceVariations: {
          analytical: "[Process. That's significant context.]",
          helping: "[Just be present. She's trusting you with something.]",
          building: "[Let the foundation settle before building more.]",
          exploring: "[Let her continue. There's more to this story.]",
          patience: "[Nod quietly. That's a hard thing to share.]"
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
        },
        voiceVariations: {
          analytical: "Sales has transferable skills. Did you leverage that into something else?",
          helping: "That's a tough job. Did you move on after that?",
          building: "Sales is a skill. What did you build on top of it?",
          exploring: "Did you stay in sales after that?",
          patience: "And then? What came next?"
        }
      },
      {
        choiceId: 'jordan_job2_validate_skill',
        text: "That's actually a really valuable skill. reading people that quickly.",
        nextNodeId: 'jordan_job_reveal_3',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_2']
        },
        voiceVariations: {
          analytical: "Reading people in three seconds—that's pattern recognition.",
          helping: "That's actually a really valuable skill. reading people that quickly.",
          building: "Three-second reads. That's a tool you can use anywhere.",
          exploring: "Reading people fast is rare. Where else did you use that?",
          patience: "That kind of intuition takes time to develop. You earned it."
        }
      },
      {
        choiceId: 'jordan_job2_connect_ux',
        text: "Applied empathy sounds a lot like user experience design.",
        nextNodeId: 'jordan_job_reveal_3',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'communication'],
        visibleCondition: {
          patterns: { analytical: { min: 3 } }
        },
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_2']
        },
        voiceVariations: {
          analytical: "Applied empathy sounds a lot like user experience design.",
          helping: "Understanding people's needs—that's what good design is about.",
          building: "User research is just systematic empathy. You had a head start.",
          exploring: "The connection between sales and UX—that's interesting.",
          patience: "Listening. Understanding. That's the root of good design."
        }
      },
      {
        choiceId: 'jordan_job2_patience',
        text: "[Stay present. Let her find her rhythm in the telling.]",
        nextNodeId: 'jordan_job_reveal_3',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_2']
        },
        voiceVariations: {
          analytical: "[Data is still incoming. Wait for the full dataset.]",
          helping: "[She's finding her voice. Just listen.]",
          building: "[The story is under construction. Give it space.]",
          exploring: "[There's more. Stay curious.]",
          patience: "[Stay present. Let her find her rhythm in the telling.]"
        }
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_job_reveal_3',
    speaker: 'Jordan Packard',
    content: [{
      text: `Got restless. Taught myself graphic design. YouTube, library books. Freelance work. logos, flyers.

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
        pattern: 'building',
        skills: ['adaptability', 'communication', 'leadership'],
        visibleCondition: {
          patterns: { building: { min: 3 } }
        },
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_3']
        }
      },
      {
        choiceId: 'jordan_job3_pattern_skills',
        text: "Each skill was a piece. What were you building?",
        nextNodeId: 'jordan_pattern_acknowledgment',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'communication'],
        visibleCondition: {
          patterns: { analytical: { min: 5 } }
        },
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_3']
        }
      },
      {
        choiceId: 'jordan_job3_building_toolkit',
        text: "You were building a toolkit. Each skill was a tool you'd need later.",
        nextNodeId: 'jordan_pattern_acknowledgment',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
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
      text: `You're really following along. Most people zone out by job three. eyes glaze over, polite nods. But you're actually listening.

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

Experience design. User motivation. I didn't have the language yet.`,
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
        text: "That's actually brilliant. seeing the deeper pattern underneath the job title.",
        nextNodeId: 'jordan_job_reveal_6',
        pattern: 'exploring',
        skills: ['curiosity', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_5']
        }
      },
      {
        choiceId: 'jordan_job5_pattern_thread',
        text: "You've been doing UX design this whole time. You kept changing the medium.",
        nextNodeId: 'jordan_job_reveal_6',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1,
          addKnowledgeFlags: ['knows_job_5']
        }
      },
      {
        choiceId: 'jordan_job5_building_experiences',
        text: "You were always building experiences. Gyms, apps, client relationships. all the same craft.",
        nextNodeId: 'jordan_job_reveal_6',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
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
        text: "Most people would see that as survival work. You made it an education.",
        nextNodeId: 'jordan_job_reveal_7',
        pattern: 'building',
        skills: ['creativity', 'criticalThinking', 'communication'],
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
    tags: ['job_revelation', 'jordan_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  // ============= JOB REVEAL 7: UX Designer Current (Immersive Scenario) =============
  {
    nodeId: 'jordan_job_reveal_7',
    speaker: 'Jordan Packard',
    content: [{
      text: "The Product Manager is pinging me. We're launch-critical.",
      emotion: 'focused',
      variation_id: 'job7_scenario_v2'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Launch Crisis: Day 0',
      taskDescription: 'The PM wants to ship the feature without the new onboarding flow to meet the deadline. You know this will cause 80% churn.',
      initialContext: {
        label: 'Slack: #product-launch',
        content: `PM_Alex: We're red on timeline. Cut the new onboarding tour.
Jordan: That's the retention fix. We can't cut it.
PM_Alex: Marketing promises go live at 9 AM. The code isn't ready.
PM_Alex: Ship the old flow. We'll patch it later.`,
        displayStyle: 'text'
      },
      successFeedback: '✓ PM AGREED: "Fine. We delay launch 24h. Better than churn."'
    },
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

It's not about the pixels. It's deeper than that. If I can't figure this out, maybe I'm a graphic designer pretending to be UX.`,
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
        text: "Maybe the app isn't good.",
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

They needed encouragement, not data entry.

That's when I realized:
User research? That's customer service listening.
Wireframing? That's graphic design.
Motivation loops? That's personal training.

I've been training for this job my whole life.`,
      emotion: 'triumphant',
      variation_id: 'job7_insight_v1',
      richEffectContext: 'success'
    }],
    onEnter: [
      {
        characterId: 'jordan',
        thoughtId: 'hidden-connections'
      }
    ],
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
      text: `Now I lead a team, teach at the bootcamp, and finally. FINALLY. my mom tells people what I do without apologizing first.`,
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
      },
      {
        choiceId: 'jordan_job7_building_composite',
        text: "You built yourself into something new. A composite that couldn't exist any other way.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity', 'leadership']
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_mentor_context',
    speaker: 'Jordan Packard',
    content: [{
      text: `You see the pattern. I can see it too. Intellectually.

But when I'm alone? Seven jobs. Twelve years. Someone who couldn't stick.

The story makes sense. The feeling doesn't match.`,
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
      text: `Thirty people at Career Day. Making huge bets on themselves. Time. Money. Hope.

What do I tell them? That it's okay to fail six times first?`,
      emotion: 'vulnerable',
      variation_id: 'jordan_mentor_1_pt2'
    }],
    choices: [
      {
        choiceId: 'jordan_to_student_question',
        text: "What would they ask you?",
        nextNodeId: 'jordan_student_question',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence']
      }
    ],
    tags: ['vulnerability', 'jordan_arc']
  },

  // EXPANSION: Student question
  {
    nodeId: 'jordan_student_question',
    speaker: 'Jordan Packard',
    content: [{
      text: `Last year. Different bootcamp. Student raised her hand.

"How do you know when to quit versus when to push through?"

*Quiet.*

I froze. Because I still don't know.`,
      emotion: 'haunted',
      variation_id: 'student_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_student_to_voice',
        text: "What did you say?",
        nextNodeId: 'jordan_impostor_voice',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['jordan_arc', 'student_interaction']
  },

  // EXPANSION: Impostor voice
  {
    nodeId: 'jordan_impostor_voice',
    speaker: 'Jordan Packard',
    content: [{
      text: `Said something about trusting your gut. Sounded wise.

Felt like a fraud.

*Looks at speech notes.*

Voice in my head: "Who are you to teach? You couldn't even keep one job."`,
      emotion: 'raw',
      variation_id: 'impostor_v1',
      // E2-031: Interrupt opportunity when Jordan reveals impostor syndrome
      interrupt: {
        duration: 3500,
        type: 'connection',
        action: 'Reach out. That inner critic needs a witness.',
        targetNodeId: 'jordan_interrupt_acknowledged',
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      }
    }],
    choices: [
      {
        choiceId: 'jordan_voice_to_taught',
        text: "But you did learn something. From all seven.",
        nextNodeId: 'jordan_what_jobs_taught',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      }
    ],
    tags: ['jordan_arc', 'impostor_syndrome']
  },
  {
    nodeId: 'jordan_interrupt_acknowledged',
    speaker: 'Jordan Packard',
    content: [{
      text: `*They stop. Look at you.*

You didn't argue with it. Didn't say "you're not a fraud" like everyone does.

*A breath.*

You just... heard it. The voice. Without flinching.

That's different. Most people rush to fix impostor syndrome. You let it exist first.`,
      emotion: 'seen',
      microAction: 'Their shoulders relax slightly.',
      variation_id: 'interrupt_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_interrupt_continue',
        text: "That voice learned those words somewhere. Where?",
        nextNodeId: 'jordan_what_jobs_taught',
        pattern: 'exploring',
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'jordan_arc']
  },

  // EXPANSION: What jobs taught
  {
    nodeId: 'jordan_what_jobs_taught',
    speaker: 'Jordan Packard',
    content: [{
      text: `*Pause.*

Yeah. I did.

UX taught me people lie about what they want. Watch what they do.

Gym taught me motivation beats talent.

Marketing taught me stories matter more than features.

*Looks up.*

Seven jobs. Same lesson different ways: Pay attention. Adapt. Keep going.`,
      emotion: 'realizing',
      variation_id: 'taught_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_taught_to_clarity',
        text: "That IS the speech.",
        nextNodeId: 'jordan_moment_clarity',
        pattern: 'building',
        skills: ['communication', 'leadership']
      }
    ],
    tags: ['jordan_arc', 'insight']
  },

  // EXPANSION: Moment of clarity
  {
    nodeId: 'jordan_moment_clarity',
    speaker: 'Jordan Packard',
    content: [{
      text: `*Stands. Paces.*

Wait.

Those students. They're not betting on one path.

They're betting on themselves. To figure it out. To adapt when it doesn't work.

Maybe that's what I tell them.`,
      emotion: 'energized',
      variation_id: 'clarity_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_clarity_to_question',
        text: "You just answered your own question.",
        nextNodeId: 'jordan_final_doubt',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['jordan_arc', 'breakthrough'],
    metadata: {
      sessionBoundary: true  // Session 2: Breakthrough moment
    }
  },

  // EXPANSION: Final doubt before crossroads
  {
    nodeId: 'jordan_final_doubt',
    speaker: 'Jordan Packard',
    content: [{
      text: `Still scared though.

Thirty faces. Hoping I have answers.

*Checks time.*

Speech in twenty minutes.

Which version of this story do I tell?`,
      emotion: 'determined_anxious',
      variation_id: 'doubt_v1'
    }],
    choices: [
      {
        choiceId: 'jordan_doubt_to_ask',
        text: "(Continue)",
        nextNodeId: 'jordan_asks_player',
        pattern: 'patience'
      }
    ],
    tags: ['jordan_arc', 'transition']
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
        nextNodeId: 'jordan_crossroads',
        pattern: 'exploring',
        skills: ['adaptability', 'criticalThinking']
      },
      {
        choiceId: 'player_analyze_options',
        text: "I break it down. Research every option, weigh pros and cons. Sometimes I get paralyzed by too much information.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'player_ask_others',
        text: "I talk to people. See how they handled similar situations. Their stories help me see possibilities I couldn't see alone.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'helping',
        skills: ['collaboration', 'communication']
      },
      {
        choiceId: 'player_feel_stuck',
        text: "Honestly? I freeze. The uncertainty feels heavy, and I end up not choosing anything. That's probably worse than choosing wrong.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
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
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `Twenty minutes before that room fills up. You've been here with me the whole time. patient, listening. That's rare.

I keep rewriting this speech. Which version is true?

Past as liability? Past as asset? Or I define what it means?`,
        altEmotion: 'grateful_desperate'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: `Twenty minutes before that room fills up. You ask questions like you're building a map of me. I see that.

I keep rewriting this speech. Which version is true?

Past as liability? Past as asset? Or I define what it means?`,
        altEmotion: 'seen_desperate'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `Twenty minutes before that room fills up. You connected the dots in my story I couldn't see myself.

I keep rewriting this speech. Which version is true?

Past as liability? Past as asset? Or I define what it means?`,
        altEmotion: 'recognized_desperate'
      }
    ],
    requiredState: {
      trust: { min: 6 },  // Reduced from 8 to prevent forced perfect-replay loop
      lacksGlobalFlags: ['jordan_chose_shallow'] // Only if NOT failed
    },
    choices: [
      // Career observation route (ISP: Only visible when pattern combo is achieved)
      {
        choiceId: 'jordan_crossroads_career_counselor',
        text: "You help people find their way. That sounds like a calling.",
        nextNodeId: 'jordan_career_reflection_counselor',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          patterns: { helping: { min: 4 }, exploring: { min: 5 } },
          lacksGlobalFlags: ['jordan_mentioned_career']
        }
      },
      // Pattern-enhanced: Helping players see mentorship framing
      {
        choiceId: 'jordan_crossroads_accumulation_helping',
        text: "What if your past is exactly why you're the perfect mentor?",
        nextNodeId: 'jordan_chooses_accumulation',
        pattern: 'helping',
        skills: ['creativity', 'criticalThinking', 'leadership'],
        preview: "Reframe seven jobs as seven kinds of wisdom to share",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { helping: { min: 3 } }
        }
      },
      {
        choiceId: 'jordan_crossroads_accumulation',
        text: "What if your past is exactly why you're the perfect mentor?",
        nextNodeId: 'jordan_chooses_accumulation',
        pattern: 'helping',
        skills: ['creativity', 'criticalThinking', 'leadership']
      },
      // Pattern-enhanced: Exploring players see adaptability as asset
      {
        choiceId: 'jordan_crossroads_birmingham_exploring',
        text: "What if you're proof that Birmingham rewards people who adapt?",
        nextNodeId: 'jordan_chooses_birmingham',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability', 'creativity'],
        preview: "Connect their journey to the city's own transformation",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { exploring: { min: 3 } }
        }
      },
      {
        choiceId: 'jordan_crossroads_birmingham',
        text: "What if you're proof that Birmingham rewards people who adapt?",
        nextNodeId: 'jordan_chooses_birmingham',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability', 'creativity']
      },
      // Pattern-enhanced: Patience players see internal narrative power
      {
        choiceId: 'jordan_crossroads_internal_patience',
        text: "What if the story you tell yourself is the only one that matters?",
        nextNodeId: 'jordan_chooses_internal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership'],
        preview: "Invite them to find meaning on their own terms",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { patience: { min: 3 } }
        }
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
    tags: ['crossroads', 'jordan_arc', 'pattern_enhanced']
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

{{met_yaquin:I met a dental assistant, Yaquin. He gets it.|I heard about a guy teaching dental skills on TikTok. Yaquin? He gets it.}} Accumulating skills, not titles.`,
      emotion: 'empowered',
      variation_id: 'jordan_accumulation_1'
    }],
    choices: [
      {
        choiceId: 'jordan_accumulation_celebrate',
        text: "That's the speech they need to hear.",
        nextNodeId: 'jordan_farewell_accumulation',
        pattern: 'helping',
        skills: ["emotionalIntelligence", "communication"]
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_accumulation', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_accumulation'],
      thoughtId: 'curious-wanderer'
    }],
    tags: ['ending', 'jordan_arc']
  },

  // ============= JORDAN'S VULNERABILITY ARC =============
  // "The job that broke her"
  {
    nodeId: 'jordan_vulnerability_arc',
    speaker: 'Jordan Packard',
    content: [{
      text: `*She stares at her hands.*

There's a reason I've had seven jobs. It's not wanderlust.

Job four. Startup. I was head of product. Eighty-hour weeks. I believed in it. Really believed.

Then I found the Slack channel. The one I wasn't supposed to see.

*Her voice tightens.*

"Jordan's great for optics but we need a real PM." From my own CEO. The person who hired me.

I didn't quit. I stayed six more months. Smiled. Delivered. Then had a breakdown in a Target parking lot.

That's why I left tech. That's why I teach bootcamps now. Because I couldn't handle being the person they pretended to value.`,
      emotion: 'shattered',
      microAction: 'Her confident posture crumbles slightly.',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'error'
    }],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'jordan',
        addKnowledgeFlags: ['jordan_vulnerability_revealed', 'knows_the_slack']
      }
    ],
    choices: [
      {
        choiceId: 'vuln_not_optics',
        text: "You weren't optics. You were doing the work while they took credit.",
        nextNodeId: 'jordan_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_teaching_matters',
        text: "Teaching isn't running away. It's using everything you learned to protect others.",
        nextNodeId: 'jordan_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_silence',
        text: "[Stay silent. Let her feel the weight of finally saying it.]",
        nextNodeId: 'jordan_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'jordan_arc', 'emotional_core']
  },
  {
    nodeId: 'jordan_vulnerability_reflection',
    speaker: 'Jordan Packard',
    content: [{
      text: `*She takes a breath.*

I've never told anyone about that Slack channel. Not my therapist. Not my mom.

*A fragile laugh.*

The impostor syndrome isn't random. It started there. In that moment where I realized they saw me as decoration, not contribution.

But you know what? Those bootcamp students? They don't see decoration. They see someone who's been through it.

Maybe that's worth more than a title ever was.`,
      emotion: 'vulnerable_resolved',
      variation_id: 'reflection_v1'
    }],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'jordan_farewell_accumulation',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'jordan_arc']
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
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: `Accumulation. Experience building on experience.

But what if they see through it? What if they know I'm a fraud?

The voice will be there when I walk through that door. Probably for years.

But you listened. Really listened. That's what I needed.

Thank you. Good luck with your journey.`,
        altEmotion: 'grateful_seen'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: `Accumulation. Experience building on experience.

But what if they see through it? What if they know I'm a fraud?

The voice will be there when I walk through that door. Probably for years.

You asked questions that helped me see my own story differently.

Thank you. Good luck with your journey.`,
        altEmotion: 'grateful_clarified'
      }
    ],
    choices: [
      {
        choiceId: 'jordan_farewell_accumulation_end',
        text: "Good luck with your speech.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'helping',
        skills: ["emotionalIntelligence", "communication"]
      }
    ],
    tags: ['transition', 'jordan_arc', 'bittersweet'],
    metadata: {
      sessionBoundary: true  // Session 2: Arc complete
    }
  },

  {
    nodeId: 'jordan_chooses_birmingham',
    speaker: 'Jordan Packard',
    content: [
      {
        text: "Exactly. Birmingham changed. Iron, then medical, now tech.|This city reinvents itself every twenty years. Why can't I?|Maybe my 'instability' is actually... adaptation.",
        emotion: 'thoughtful',
        variation_id: 'birmingham_v1',
        richEffectContext: 'thinking'
      }
    ],
    onEnter: [
      {
        characterId: 'jordan',
        thoughtId: 'industrial-legacy',
        addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_birmingham']
      }
    ],
    choices: [
      {
        choiceId: 'jordan_birmingham_farewell',
        text: "Good luck with your speech.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
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
        skills: ["emotionalIntelligence", "communication"]
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
        skills: ["emotionalIntelligence", "communication", "leadership"]
      }
    ],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['chose_internal', 'completed_arc'],
      addGlobalFlags: ['jordan_arc_complete', 'jordan_chose_internal'],
      thoughtId: 'hidden-connections'
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
      text: `You're right. It's safer to stick to the script.

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
  },

  // ============= PATTERN UNLOCK NODES =============
  // These become available when player demonstrates sufficient pattern affinity

  {
    nodeId: 'jordan_seven_jobs_story',
    speaker: 'Jordan Packard',
    content: [{
      text: "*Jordan's professional composure cracks into something more real.*\n\nYou ask a lot of questions. Good ones. The kind that don't have easy answers.\n\n*They lean back.*\n\nSeven jobs. Four years. That's my track record. Barista. Data entry. Non-profit coordinator. Social media manager. Tutoring. Freelance writing. And now... this.\n\n*Gestures at the station around them.*\n\nMy parents call it 'unfocused.' LinkedIn would call it 'a red flag.'\n\n*Meets your eyes.*\n\nBut you know what? Every single one of those jobs taught me something. How to read people. How to translate between different worlds. How to find patterns in chaos.\n\nI'm not unfocused. I'm synthesizing.",
      emotion: 'vulnerable_defiant',
      variation_id: 'seven_jobs_v1'
    }],
    requiredState: {
      patterns: { exploring: { min: 40 } }
    },
    onEnter: [
      {
        characterId: 'jordan',
        addKnowledgeFlags: ['jordan_career_history_shared']
      }
    ],
    choices: [
      {
        choiceId: 'seven_synthesis',
        text: "Synthesizing. That's exactly what career navigation is—connecting dots others can't see.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 3
        }
      },
      {
        choiceId: 'seven_pattern',
        text: "What's the pattern you see across all seven?",
        nextNodeId: 'jordan_crossroads',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      }
    ],
    tags: ['jordan_arc', 'pattern_unlock', 'exploring', 'backstory']
  },

  {
    nodeId: 'jordan_impostor_reveal',
    speaker: 'Jordan Packard',
    content: [{
      text: "*Jordan's voice drops. This is clearly difficult.*\n\nYou really care, don't you? About people. Not just the answers.\n\n*Long pause.*\n\nCan I tell you something I don't tell... anyone?\n\n*They don't wait for an answer.*\n\nEvery day, I help people find their paths. I see their patterns. I match them with possibilities. And every single day, a voice in my head says: 'Who are you to guide anyone? You don't even know where YOU'RE going.'\n\n*Quiet laugh.*\n\nImpostor syndrome. The career navigator who can't navigate their own career.\n\n*Looks at you.*\n\nBut maybe that's why I'm good at this. Because I know what it's like to be lost. To feel like everyone else has a map except you.\n\nI don't guide people despite being lost. I guide them BECAUSE I understand lost.",
      emotion: 'vulnerable_honest',
      variation_id: 'impostor_v1'
    }],
    requiredState: {
      patterns: { helping: { min: 50 } }
    },
    onEnter: [
      {
        characterId: 'jordan',
        addKnowledgeFlags: ['jordan_impostor_revealed']
      }
    ],
    choices: [
      {
        choiceId: 'impostor_strength',
        text: "That's not impostor syndrome. That's empathy. Your uncertainty is your superpower.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'jordan',
          trustChange: 4
        }
      },
      {
        choiceId: 'impostor_trust',
        text: "Thank you for trusting me with that. It couldn't have been easy to say.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'jordan',
          trustChange: 3
        }
      }
    ],
    tags: ['jordan_arc', 'pattern_unlock', 'helping', 'vulnerability']
  },

  {
    nodeId: 'jordan_unexpected_paths',
    speaker: 'Jordan Packard',
    content: [{
      text: "*Jordan's energy shifts—something profound surfacing.*\n\nYou've asked a lot of questions today. More than most. And you've actually listened to the answers.\n\n*They pull out a worn notebook.*\n\nI keep a collection. Stories of people who found their path in unexpected ways. The accountant who became a chocolatier. The lawyer who became a forest ranger.\n\n*Opens to a specific page.*\n\nBut this one... this is my favorite. My grandmother.\n\nShe was going to be a teacher. Had the degree. Had the job offer. Then she met a woman on a bus who was starting a community center in a neighborhood everyone had given up on.\n\n*Voice softens.*\n\nGrandma spent forty years in that community center. Changed thousands of lives. Never taught in a classroom.\n\n*Meets your eyes.*\n\nThat's what I'm trying to do here. Help people find their bus moment. The unexpected conversation that changes everything.\n\nMaybe this is yours.",
      emotion: 'profound_hopeful',
      variation_id: 'unexpected_v1'
    }],
    requiredState: {
      patterns: { exploring: { min: 70 } },
      trust: { min: 5 }
    },
    onEnter: [
      {
        characterId: 'jordan',
        addKnowledgeFlags: ['jordan_grandmother_story', 'jordan_deepest_shared'],
        addGlobalFlags: ['jordan_full_trust']
      }
    ],
    choices: [
      {
        choiceId: 'unexpected_honored',
        text: "I hope it is. And I hope I can help someone find theirs someday.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership'],
        consequence: {
          characterId: 'jordan',
          trustChange: 4
        }
      },
      {
        choiceId: 'unexpected_curious',
        text: "What happened to the woman who started the community center?",
        nextNodeId: 'jordan_crossroads',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 3
        }
      }
    ],
    tags: ['jordan_arc', 'pattern_unlock', 'exploring', 'high_trust', 'profound']
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'jordan_career_reflection_counselor',
    speaker: 'Jordan Packard',
    content: [
      {
        text: `You explore while helping. That's rare—most people pick one or the other.

Career counselors have that combination. They're guides who help others find their way—seeing potential before it blooms.

Seven jobs taught me something: the best navigators are the ones who genuinely want to help people explore.`,
        emotion: 'reflective',
        variation_id: 'career_counselor_v1'
      }
    ],
    requiredState: {
      patterns: {
        helping: { min: 4 },
        exploring: { min: 5 }
      }
    },
    onEnter: [
      {
        characterId: 'jordan',
        addGlobalFlags: ['combo_path_finder_achieved', 'jordan_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'jordan_career_counselor_continue',
        text: "Helping others explore their paths. That resonates.",
        nextNodeId: 'jordan_crossroads',
        pattern: 'exploring'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'career_services']
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