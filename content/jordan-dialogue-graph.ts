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
    content: [
      {
        text: "Stand up. Look around you. See that? Not a crowd.\n\nThat is potential energy waiting for a spark.\n\nWe don't need permission to fix the vents. Just need enough hands.\n\nYou. You've got hands. In or out?",
        emotion: 'friendly_but_anxious',
        variation_id: 'jordan_intro_v3_minimal',
        patternReflection: [
          { pattern: 'exploring', minLevel: 5, altText: "Hey. Career Day at Covalence. Coding bootcamp.\n\nSeven jobs. Twelve years. I've explored everything.\n\nYou have that same look. Like you want to see what's around every corner.", altEmotion: 'warm' },
          { pattern: 'patience', minLevel: 5, altText: "Hey. Career Day at Covalence. Got here way too early.\n\nRewrote this speech six times. Seven jobs. Twelve years.\n\nYou're calm. Nice.", altEmotion: 'grateful' },
          { pattern: 'building', minLevel: 5, altText: "Hey. Career Day at Covalence.\n\nUX Designer. Product Manager. Senior Designer. Built things in every role.\n\nYou build things too. I can tell.", altEmotion: 'curious' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'jordan_intro_ask_jobs',
        text: "That's a lot of different roles. What's the through-line?",
        nextNodeId: 'jordan_handshake_layout',
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
          exploring: "Six versions. You're searching for the right story.",
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
        text: "[Seeker's Eye] Seven jobs isn't chaos. It's exploration. Tell me what you found.",
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
        text: "[Empathy Sense] You're nervous. Not about the speech. About whether you deserve to give it.",
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

  // ============= HANDSHAKE NODE: ROOM LAYOUT =============
  {
    nodeId: 'jordan_handshake_layout',
    speaker: 'Jordan Packard',
    content: [{
      text: "Actually, forget the speech. Look at this floor plan. They put the high-voltage demo next to the hydration station. Classic disaster.",
      emotion: 'focused',
      variation_id: 'jordan_handshake_intro',
      interaction: 'ripple'
    }],
    simulation: {
      type: 'architect_3d',
      mode: 'inline',
      inlineHeight: 'h-80',
      title: 'Crowd Flow Dynamics',
      taskDescription: 'Plot 3 waypoints for optimal safe egress pathways.',
      initialContext: {
        label: 'Main Hall Analysis',
        content: 'Capacity: 300. Flow Status: Chaotic.',
        target: {
          // Navigation variant expects connected route (3+ waypoints, 2+ connections)
          targetScore: 3
        }
      },
      successFeedback: 'FLOW OPTIMIZED. EGRESS ROUTES SECURE.'
    },
    choices: [
      {
        choiceId: 'layout_complete',
        text: "Safety grid established. You're clear.",
        nextNodeId: 'jordan_career_question', // Route back to main arc
        pattern: 'building',
        skills: ['systemsThinking'],
        voiceVariations: {
          analytical: "Grid secured. Risk minimized.",
          building: "The foundation is safe now. We can build.",
          helping: "People are safe. That's what matters."
        }
      }
    ]
  },

  {
    nodeId: 'jordan_career_question',
    speaker: 'Jordan Packard',
    content: [
      {
        text: "Mentorship panel. Thirty students trying to break into tech.\n\nShare my 'journey' and advice.\n\nRewrote this six times. What do you tell people when your path looks like mine?",
        emotion: 'uncertain',
        variation_id: 'jordan_career_v2',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Mentorship panel. Thirty students.\n\nShare my 'journey'. You actually want to help don't you?", altEmotion: 'grateful' },
          { pattern: 'patience', minLevel: 4, altText: "Mentorship panel. Thirty students.\n\nRewritten this six times. You're not rushing me.\n\nThe silence lets me think.", altEmotion: 'reflective' }
        ]
      }
    ],
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
          exploring: "Six versions. Maybe you're looking for the wrong story.",
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
      text: "Alabama A&M. Computer science major. One semester.\n\nRecruited by a startup. 'The next big thing.'\n\nFolded in eight months. No degree. No job. No plan.\n\nTwenty years old. Back with my mom. She kept asking when I'd go back to school.",
      emotion: 'rueful',
      variation_id: 'jordan_job1_v2',
      patternReflection: [
        { pattern: 'exploring', minLevel: 4, altText: "Alabama A&M. One semester. Recruited by a startup. 'The next big thing.'\n\nFolded in eight months. You understand? The leap into unknown. The crash.\n\nTwenty years old. Back with my mom.", altEmotion: 'rueful' },
        { pattern: 'building', minLevel: 4, altText: "Alabama A&M. Computer science major. One semester.\n\nStartup folded in eight months. You've built things that failed too right? You know the feeling.\n\nNo degree. No job. No plan.", altEmotion: 'vulnerable' }
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
          exploring: "So the pattern started early. Learning by doing.",
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
      text: "Selling phones at the Galleria. Those kiosks where you chase people speed-walking past.\n\nHumbling.\n\nBut I learned to read people in three seconds. Ask questions that made them feel heard.\n\nCustomer service is applied empathy.",
      emotion: 'reflective',
      variation_id: 'jordan_job2_v2',
      voiceVariations: {
        analytical: "Selling phones at the Galleria. Those kiosks where you analyze people mid-stride.\n\nHumbling.\n\nBut I learned pattern recognition in three seconds. Questions that mapped their decision tree.\n\nCustomer service is applied behavioral analysis.",
        helping: "Selling phones at the Galleria. Those kiosks where you meet people at their busiest.\n\nHumbling.\n\nBut I learned to care in three seconds. Ask questions that made them feel seen, not sold to.\n\nCustomer service is just caring about strangers.",
        building: "Selling phones at the Galleria. Those kiosks where you construct rapport instantly.\n\nHumbling.\n\nBut I learned to build trust in three seconds. Questions that created connection.\n\nCustomer service is relationship architecture.",
        exploring: "Selling phones at the Galleria. Those kiosks where you discover people mid-journey.\n\nHumbling.\n\nBut I learned to explore needs in three seconds. Questions that opened new territory.\n\nCustomer service is navigating what people actually want.",
        patience: "Selling phones at the Galleria. Those kiosks where everyone's rushing past.\n\nHumbling.\n\nBut I learned to slow moments down. Three seconds of real attention. Questions that gave them space.\n\nCustomer service is patience when everyone's impatient."
      }
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
          analytical: "Reading people in three seconds. That's pattern recognition.",
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
          helping: "Understanding people's needs. That's what good design is about.",
          building: "User research is just systematic empathy. You had a head start.",
          exploring: "The connection between sales and UX. That's interesting.",
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
      text: "Got restless. Taught myself graphic design. YouTube. Library books. Freelance work.\n\nWasn't great at first.\n\nBut I learned visual hierarchy. How eyes move. How color creates emotion.",
      emotion: 'nostalgic',
      variation_id: 'jordan_job3_v2'
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
        archetype: 'EXPRESS_CURIOSITY',
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
        archetype: 'OFFER_SUPPORT',
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
        archetype: 'ASK_FOR_DETAILS',
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
        archetype: 'MAKE_OBSERVATION',
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
      text: "You're really following along. Most people zone out by job three.\n\nEyes glaze over. Polite nods.\n\nBut you're actually listening. Means a lot.",
      emotion: 'appreciative',
      variation_id: 'jordan_acknowledgment_v2',
      voiceVariations: {
        analytical: "You're tracking the data points. Most people lose the thread by job three.\n\nPattern recognition failure. Polite nods.\n\nBut you're processing it. That matters.",
        helping: "You're really staying with me. Most people check out by job three.\n\nEyes glaze over. Polite patience.\n\nBut you care about the story. Thank you.",
        building: "You're following the structure. Most people lose the blueprint by job three.\n\nFoundation forgotten. Polite nods.\n\nBut you're building the picture with me. Means a lot.",
        exploring: "You're still curious. Most people stop exploring by job three.\n\nTerritory too complicated. Polite nods.\n\nBut you want to see where this goes. That's rare.",
        patience: "You're giving this time. Most people rush past by job three.\n\nEyes glaze over. Polite waiting.\n\nBut you're actually present. Really means something."
      }
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
      text: "Small marketing firm downtown. Finally a 'real' job. Benefits and everything.\n\nSocial media management, campaign planning.\n\nIt was fine. But I liked making things more than talking about other people's things.",
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
      text: "This is where it gets weird. Quit to become a personal trainer.\n\nTrainers are motivation psychologists. Designing experiences that make people believe they can do hard things.\n\nExperience design. User motivation. Didn't have the language yet.",
      emotion: 'animated',
      variation_id: 'jordan_job5_v2'
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
      text: "Started driving for Uber on the side.\n\nBest education in Birmingham I ever got. Every neighborhood, every traffic pattern. Logistics. Route optimization.\n\nAnd hundreds of conversations. Everyone's going somewhere.",
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
      trust: { min: 2 },  // Shift Left: lowered from 8 for early accessibility
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
      text: "We tried that. A/B tested ten different button styles. It didn't move the needle a single percent.\n\nIt's not about the pixels. It's deeper than that. If I can't figure this out, maybe I'm a graphic designer pretending to be UX.",
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
      text: "Exactly. It wasn't a software bug. It was a human bug.\n\nThey needed encouragement, not data entry.\n\nThat's when I realized:\nUser research? That's customer service listening.\nWireframing? That's graphic design.\nMotivation loops? That's personal training.\n\nI've been training for this job my whole life.",
      emotion: 'triumphant',
      variation_id: 'job7_insight_v1',
      richEffectContext: 'success',
      voiceVariations: {
        analytical: "Exactly. It wasn't a code error. It was a logic error about users.\n\nThey needed validation algorithms, not data structures.\n\nThat's when the patterns connected:\nUser research? Pattern recognition from customer service.\nWireframing? Visual logic from graphic design.\nMotivation loops? Behavioral systems from personal training.\n\nEvery data point was preparing me for this.",
        helping: "Exactly. It wasn't a technical problem. It was an emotional one.\n\nThey needed support, not features.\n\nThat's when I understood:\nUser research? Listening from customer service.\nWireframing? Communication from graphic design.\nMotivation loops? Encouragement from personal training.\n\nI've been learning how to help people my whole life.",
        building: "Exactly. It wasn't a bug. It was missing infrastructure.\n\nThey needed scaffolding, not tools.\n\nThat's when the blueprint emerged:\nUser research? Foundation from customer service.\nWireframing? Structure from graphic design.\nMotivation loops? Architecture from personal training.\n\nI've been building toward this my whole life.",
        exploring: "Exactly. It wasn't a software issue. It was an unmapped territory.\n\nThey needed guidance, not navigation.\n\nThat's when I discovered the map:\nUser research? Exploration from customer service.\nWireframing? Charting from graphic design.\nMotivation loops? Pathfinding from personal training.\n\nI've been exploring toward this destination my whole life.",
        patience: "Exactly. It wasn't a quick fix. It was years of slow accumulation.\n\nThey needed time and attention, not speed.\n\nThat's when it all came together:\nUser research? Patience from customer service.\nWireframing? Process from graphic design.\nMotivation loops? Persistence from personal training.\n\nEvery step was preparing me. I just had to wait to see it."
      }
    }],
    onEnter: [
      {
        characterId: 'jordan',
        thoughtId: 'hidden-connections',
        addKnowledgeFlags: ['jordan_simulation_phase1_complete']
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
      text: "Now I lead a team, teach at the bootcamp, and finally. FINALLY. My mom tells people what I do without apologizing first.",
      emotion: 'triumphant',
      variation_id: 'jordan_job7_1_pt2'
    }],
    choices: [
      {
        choiceId: 'jordan_job7_ask_mentor',
        text: "So why are you nervous about the mentorship talk?",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence'],
        archetype: 'ASK_FOR_DETAILS'
      },
      {
        choiceId: 'jordan_job7_celebrate',
        text: "That's an incredible story. You should be proud of every single step.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        archetype: 'ACKNOWLEDGE_EMOTION'
      },
      {
        choiceId: 'jordan_job7_pattern_complete',
        text: "You didn't wander. You were assembling exactly the skills you needed.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity'],
        archetype: 'MAKE_OBSERVATION'
      },
      {
        choiceId: 'jordan_job7_building_composite',
        text: "You built yourself into something new. A composite that couldn't exist any other way.",
        nextNodeId: 'jordan_mentor_context',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity', 'leadership'],
        archetype: 'SHARE_PERSPECTIVE'
      }
    ],
    tags: ['job_revelation', 'jordan_arc']
  },

  {
    nodeId: 'jordan_mentor_context',
    speaker: 'Jordan Packard',
    content: [{
      text: "You see the pattern. I can see it too. Intellectually.\n\nBut when I'm alone? Seven jobs. Twelve years. Someone who couldn't stick.\n\nThe story makes sense. The feeling doesn't match.",
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
      text: "Thirty people at Career Day. Making huge bets on themselves. Time. Money. Hope.\n\nWhat do I tell them? That it's okay to fail six times first?",
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
      text: "Last year. Different bootcamp. Student raised her hand.\n\n\"How do you know when to quit versus when to push through?\"\n\nI froze. Because I still don't know.",
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
      text: "Said something about trusting your gut. Sounded wise.\n\nFelt like a fraud.\n\nVoice in my head: \"Who are you to teach? You couldn't even keep one job.\"",
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
      text: "You didn't argue with it. Didn't say \"you're not a fraud\" like everyone does.\n\nYou just... heard it. The voice. Without flinching.\n\nThat's different. Most people rush to fix impostor syndrome. You let it exist first.",
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
      text: "Yeah. I did.\n\nUX taught me people lie about what they want. Watch what they do.\n\nGym taught me motivation beats talent.\n\nMarketing taught me stories matter more than features.\n\nSeven jobs. Same lesson different ways: Pay attention. Adapt. Keep going.",
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
      text: "Wait.\n\nThose students. They're not betting on one path.\n\nThey're betting on themselves. To figure it out. To adapt when it doesn't work.\n\nMaybe that's what I tell them.",
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
      },
      {
        choiceId: 'jordan_go_deeper',
        text: "Jordan... all those jobs, all that adapting. What were you really running from?",
        nextNodeId: 'jordan_vulnerability_arc',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: { trust: { min: 6 } },
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
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
      text: "Still scared though.\n\nThirty faces. Hoping I have answers.\n\nSpeech in twenty minutes.\n\nWhich version of this story do I tell?",
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
      text: "Can I ask you something? I've been talking about my path.\n\nHow do YOU deal with uncertainty? When you don't know if you're making the right choice?\n\nWhat do you do with that feeling?",
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
      text: "Twenty minutes before that room fills up.\n\nI keep rewriting this speech. Which version is true?\n\nPast as liability? Past as asset? Or I define what it means?\n\nWhich story should I tell them?",
      emotion: 'desperate_clarity',
      variation_id: 'jordan_crossroads_1',
      useChatPacing: true,
      richEffectContext: 'thinking'
    }],
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "Twenty minutes before that room fills up. You've been here with me the whole time. Patient, listening. That's rare.\n\nI keep rewriting this speech. Which version is true?\n\nPast as liability? Past as asset? Or I define what it means?",
        altEmotion: 'grateful_desperate'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "Twenty minutes before that room fills up. You ask questions like you're building a map of me. I see that.\n\nI keep rewriting this speech. Which version is true?\n\nPast as liability? Past as asset? Or I define what it means?",
        altEmotion: 'seen_desperate'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "Twenty minutes before that room fills up. You connected the dots in my story I couldn't see myself.\n\nI keep rewriting this speech. Which version is true?\n\nPast as liability? Past as asset? Or I define what it means?",
        altEmotion: 'recognized_desperate'
      }
    ],
    requiredState: {
      trust: { min: 6 },  // Reduced from 8 to prevent forced perfect-replay loop
      lacksGlobalFlags: ['jordan_chose_shallow'] // Only if NOT failed
    },
    choices: [
      {
        choiceId: 'jordan_crossroads_deep_dive',
        text: "[Deep Dive] Forget the speech. Show them what adaptation looks like.",
        nextNodeId: 'jordan_deep_dive',
        pattern: 'building',
        skills: ['systemsThinking', 'resilience'],
        visibleCondition: {
          trust: { min: 4 },
          patterns: { building: { min: 6 } }
        },
        preview: "Reinforce the failing corridor structure",
        interaction: 'bloom'
      },
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
      text: "You're right.\n\nI'm going to write all seven jobs on the whiteboard. Then draw lines between them.\n\nCustomer service to user research. Visual design to interface work. Motivation psychology to engagement.\n\nI'm not a fraud. I'm a composite.\n\nThose students need to hear that nothing is wasted.\n\n{{met_yaquin:I met a dental assistant, Yaquin. He gets it.|I heard about a guy teaching dental skills on TikTok. Yaquin? He gets it.}} Accumulating skills, not titles.",
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
      text: "There's a reason I've had seven jobs. It's not wanderlust.\n\nJob four. Startup. I was head of product. Eighty-hour weeks. I believed in it. Really believed.\n\nThen I found the Slack channel. The one I wasn't supposed to see.\n\n\"Jordan's great for optics but we need a real PM.\" From my own CEO. The person who hired me.\n\nI didn't quit. I stayed six more months. Smiled. Delivered. Then had a breakdown in a Target parking lot.\n\nThat's why I left tech. That's why I teach bootcamps now.",
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
        requiredOrbFill: { pattern: 'helping', threshold: 25 },
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
        requiredOrbFill: { pattern: 'patience', threshold: 20 },
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
        requiredOrbFill: { pattern: 'patience', threshold: 30 },
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
      text: "I've never told anyone about that Slack channel. Not my therapist. Not my mom.\n\nThe impostor syndrome isn't random. It started there. In that moment where I realized they saw me as decoration, not contribution.\n\nBut you know what? Those bootcamp students? They don't see decoration. They see someone who's been through it.\n\nMaybe that's worth more than a title ever was.",
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
      text: "Accumulation. Experience building on experience.\n\nBut what if they see through it? What if they know I'm a fraud?\n\nThe voice will be there when I walk through that door. Probably for years.\n\nBut at least now I can name it.\n\nThank you. Good luck with your journey.",
      emotion: 'grateful_but_shaken',
      variation_id: 'jordan_farewell_accumulation_v2_complex'
    }],
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "Accumulation. Experience building on experience.\n\nBut what if they see through it? What if they know I'm a fraud?\n\nThe voice will be there when I walk through that door. Probably for years.\n\nBut you listened. Really listened. That's what I needed.\n\nThank you. Good luck with your journey.",
        altEmotion: 'grateful_seen'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "Accumulation. Experience building on experience.\n\nBut what if they see through it? What if they know I'm a fraud?\n\nThe voice will be there when I walk through that door. Probably for years.\n\nYou asked questions that helped me see my own story differently.\n\nThank you. Good luck with your journey.",
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
      text: "Birmingham. Adaptation is survival here.\n\nThank you for this. Birmingham's full of people rebuilding their maps.\n\nGood luck with yours.",
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
      },
      // Loyalty Experience trigger - only visible at high trust + helping pattern
      {
        choiceId: 'offer_crossroads_help',
        text: "[Helper's Insight] Jordan, before you go... you mentioned a client at a crossroads. Want to talk through it?",
        nextNodeId: 'jordan_loyalty_trigger',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { helping: { min: 50 } },
          hasGlobalFlags: ['jordan_arc_complete']
        }
      }
    ],
    tags: ['transition', 'jordan_arc', 'bittersweet']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'jordan_loyalty_trigger',
    speaker: 'Jordan Packard',
    content: [{
      text: "You remember.\n\nThere's a student. Brilliant kid. Got into MIT. Full ride.\n\nBut her grandmother raised her. Single parent. Terminal illness. Six months maybe.\n\nStudent wants to defer. Stay in Birmingham. Be there at the end.\n\nFamily says go. Grandmother says go. Everyone says this opportunity won't come again.\n\nBut the kid keeps saying 'what if she dies while I'm gone? What if I miss it?'\n\nI've been a career counselor for twelve years. I'm supposed to have an answer. But this one... I don't know what's right.\n\nYou understand helping people. Would you... sit with me and think through this before I meet with her tomorrow?",
      emotion: 'anxious_vulnerable',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { helping: { min: 5 } },
      hasGlobalFlags: ['jordan_arc_complete']
    },
    metadata: {
      experienceId: 'the_crossroads'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_crossroads_challenge',
        text: "Let's think through it together. There might not be a right answer, but we can find a human one.",
        nextNodeId: 'jordan_loyalty_start',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Jordan, you've guided hundreds of people. Trust your instincts.",
        nextNodeId: 'jordan_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'jordan',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'jordan_loyalty', 'high_trust']
  },

  {
    nodeId: 'jordan_loyalty_declined',
    speaker: 'Jordan Packard',
    content: [{
      text: "You're right. I've sat with hundreds of people at crossroads.\n\nI know how to hold space for impossible choices. I know how to help someone find their own answer instead of giving them mine.\n\nI just needed to remember that I know how to do this.\n\nThank you for the confidence.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "You'll help her find her path. You always do.",
        nextNodeId: samuelEntryPoints.JORDAN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'jordan',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'jordan_loyalty_start',
    speaker: 'Jordan Packard',
    content: [{
      text: "A human answer. Yeah. Not right or wrong. Just... human.\n\nOkay. Let's sit with this together. Two people who care about helping people find their way.\n\nThe Crossroads. Let's see if we can hold space for the impossible.",
      emotion: 'grateful_determined',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_crossroads'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  },

  {
    nodeId: 'jordan_chooses_internal',
    speaker: 'Jordan Packard',
    content: [{
      text: "The story I tell myself is the only one that matters.\n\nI'm going to walk in there and say: 'I spent twelve years thinking I was lost. But I wasn't. I was building.'\n\nThat's the speech. Raw. Honest. Just the truth.",
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
      text: "I feel lighter.\n\nThank you for not trying to fix me. For letting doubt and confidence exist together.\n\nGood luck with your journey.",
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
      text: "You're right. It's safer to stick to the script.\n\nI'll talk about 'agile methodology' and 'design systems.' The stuff they want to hear.\n\nMy story is too messy. Better to hide it.",
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
      text: "You ask a lot of questions. Good ones. The kind that don't have easy answers.\n\nSeven jobs. Four years. That's my track record. Barista. Data entry. Non-profit coordinator. Social media manager. Tutoring. Freelance writing. And now... this.\n\nMy parents call it 'unfocused.' LinkedIn would call it 'a red flag.'\n\nBut you know what? Every single one of those jobs taught me something. How to read people. How to translate between different worlds. How to find patterns in chaos.\n\nI'm not unfocused. I'm synthesizing.",
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
        text: "Synthesizing. That's exactly what career navigation is. Connecting dots others can't see.",
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
      text: "You really care, don't you? About people. Not just the answers.\n\nCan I tell you something I don't tell... anyone?\n\nEvery day, I help people find their paths. I see their patterns. I match them with possibilities. And every single day, a voice in my head says: 'Who are you to guide anyone? You don't even know where YOU'RE going.'\n\nImpostor syndrome. The career navigator who can't navigate their own career.\n\nBut maybe that's why I'm good at this. Because I know what it's like to be lost. To feel like everyone else has a map except you.\n\nI don't guide people despite being lost. I guide them BECAUSE I understand lost.",
      emotion: 'vulnerable_honest',
      variation_id: 'impostor_v1'
    }],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "You ask really good questions. You see patterns I don't even notice in myself.\n\nCan I tell you something I don't tell anyone?\n\nEvery day, I help people find their paths. I analyze their skills, match them with possibilities. And every single day, a voice says: 'Who are you to guide anyone? You can't even figure out your own path.'\n\nImpostor syndrome. The career navigator who can't navigate their own career.\n\nBut maybe that analytical distance you have - maybe that's why you see things I can't. Because I know what it's like to be lost.",
        altEmotion: 'vulnerable_thoughtful'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "You don't rush me to the point. You wait. That's rare.\n\nCan I tell you something I don't tell anyone?\n\nEvery day, I help people find their paths. I give them time to discover themselves. And every single day, a voice says: 'Who are you to guide anyone? You're still figuring yourself out.'\n\nImpostor syndrome. The career navigator who can't navigate their own career.\n\nBut maybe that patience - maybe that's the key. I don't guide people despite being lost. I guide them BECAUSE I understand the journey takes time.",
        altEmotion: 'vulnerable_grateful'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "You're a builder. You see potential and construct paths forward.\n\nCan I tell you something I don't tell anyone?\n\nEvery day, I help people build their careers. I help them construct meaning from scattered experiences. And every single day, a voice says: 'Who are you to build anything? Your own foundation keeps shifting.'\n\nImpostor syndrome. The career navigator who can't navigate their own career.\n\nBut maybe that's why I'm good at this. Because I know what it's like to rebuild. To construct meaning from chaos.",
        altEmotion: 'vulnerable_determined'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "You're curious. You explore instead of assuming you know.\n\nCan I tell you something I don't tell anyone?\n\nEvery day, I help people explore their options. I map out possibilities they haven't seen. And every single day, a voice says: 'Who are you to guide anyone? You're still wandering yourself.'\n\nImpostor syndrome. The career navigator who can't navigate their own career.\n\nBut maybe that's exactly why. I don't guide people despite being lost. I guide them BECAUSE I understand what it's like to explore without a map.",
        altEmotion: 'vulnerable_hopeful'
      }
    ],
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
      text: "You've asked a lot of questions today. More than most. And you've actually listened to the answers.\n\nI keep a collection. Stories of people who found their path in unexpected ways. The accountant who became a chocolatier. The lawyer who became a forest ranger.\n\nBut this one... this is my favorite. My grandmother.\n\nShe was going to be a teacher. Had the degree. Had the job offer. Then she met a woman on a bus who was starting a community center in a neighborhood everyone had given up on.\n\nGrandma spent forty years in that community center. Changed thousands of lives. Never taught in a classroom.\n\nThat's what I'm trying to do here. Help people find their bus moment. The unexpected conversation that changes everything.\n\nMaybe this is yours.",
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
        text: "You explore while helping. That's rare. Most people pick one or the other.\n\nCareer counselors have that combination. They're guides who help others find their way. Seeing potential before it blooms.\n\nSeven jobs taught me something: the best navigators are the ones who genuinely want to help people explore.",
        emotion: 'reflective',
        variation_id: 'career_counselor_v1',
        skillReflection: [
          { skill: 'mentorship', minLevel: 5, altText: "You explore while helping. And you mentor naturally—I can see it.\n\nCareer counselors have that gift. Guides who see potential before it blooms. Your mentorship instinct is already developed.\n\nSeven jobs taught me: the best navigators genuinely want to help people explore. You're already that kind of guide.", altEmotion: 'knowing_warm' },
          { skill: 'emotionalIntelligence', minLevel: 5, altText: "You explore while helping. That's rare. And you read people well—I've noticed.\n\nCareer counselors need that emotional intelligence. Seeing potential others can't see yet. Helping without pushing.\n\nYour emotional intelligence makes you a natural guide. Seven jobs taught me: the best navigators feel their way forward. You already do.", altEmotion: 'appreciative' }
        ]
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
  },

  // ============= ARC 4: CAREER CROSSROADS =============
  {
    nodeId: 'jordan_alternative_lives',
    speaker: 'Jordan Packard',
    content: [
      {
        text: "Look at that. There's a version of me that stayed in the startup. A version that became a full-time trainer. A version that went back to architecture school.\n\nI used to think those were wasted lives. Dead ends. But seeing them like this... they're just different drafts of the same story.",
        emotion: 'awestruck',
        variation_id: 'arc4_alternatives_v1'
      }
    ],
    choices: [
      {
        choiceId: 'jordan_alt_perspective',
        text: "You didn't lose those lives. You integrated them.",
        nextNodeId: 'jordan_career_crossroads',
        pattern: 'building',
        skills: ['systemsThinking'],
        consequence: {
          addGlobalFlags: ['jordan_alternatives_integrated']
        }
      },
      {
        choiceId: 'jordan_alt_choice',
        text: "Which one looks the happiest?",
        nextNodeId: 'jordan_career_crossroads',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['arc_career_crossroads']
  },

  {
    nodeId: 'jordan_career_crossroads',
    speaker: 'Jordan Packard',
    content: [
      {
        text: "The students are waiting. All thirty of them. They want to know the 'secret' to a perfect career.\n\nI can give them the polished LinkedIn version. The 'Seven Steps to Success.' It's safe. It's what they paid for.\n\nOr I can tell them the truth. That I'm still figuring it out. That the 'path' is just a series of best guesses and course corrections.\n\nWhich Jordan walks through that door?",
        emotion: 'conflicted',
        variation_id: 'crossroads_v1'
      }
    ],
    choices: [
      {
        choiceId: 'crossroads_truth',
        text: "Tell them the truth. They need to know it's okay to be lost.",
        nextNodeId: 'jordan_chooses_internal',
        pattern: 'helping',
        skills: ['leadership', 'integrity'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2
        }
      },
      {
        choiceId: 'crossroads_safe',
        text: "Give them the framework. They need structure before they can handle chaos.",
        nextNodeId: 'jordan_chooses_birmingham',
        pattern: 'building',
        skills: ['pedagogy'],
        consequence: {
          characterId: 'jordan',
          trustChange: 1
        }
      }
    ],
    tags: ['arc_career_crossroads', 'turning_point']
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'jordan_mystery_hint',
    speaker: 'jordan',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I've helped hundreds of people find their career paths. Asked all the standard questions.\\n\\nBut here? The questions ask themselves. People discover things about themselves just by being here.",
        emotion: 'amazed',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "It's like the station is doing my job, but better. And it doesn't even have a methodology.",
        emotion: 'humbled',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'jordan_mystery_dig',
        text: "Maybe its methodology is the people themselves.",
        nextNodeId: 'jordan_mystery_response',
        pattern: 'analytical'
      },
      {
        choiceId: 'jordan_mystery_feel',
        text: "You helped me discover things too.",
        nextNodeId: 'jordan_mystery_response',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'jordan_mystery_response',
    speaker: 'jordan',
    content: [
      {
        text: "You know what? I think you're right. The station isn't the teacher. We are. It just... brings us together.\\n\\nEvery conversation here is a kind of guidance session. Including this one.",
        emotion: 'realizing',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'jordan', addKnowledgeFlags: ['jordan_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'jordan_mystery_return',
        text: "Then I'm glad we had this session.",
        nextNodeId: 'jordan_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'jordan_hub_return',
    speaker: 'jordan',
    content: [{
      text: "I've got a lot to think about. Thank you.",
      emotion: 'warm',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['terminal']
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'jordan_trust_recovery',
    speaker: 'Jordan Packard',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[She's holding a resume. Seven different job titles crossed out and rewritten.]\n\nYou came back.\n\nI thought... well. I've been through seven career changes. I know when someone's about to walk away.\n\n[She sets the resume down.]\n\nI tell my students to own their whole story. Then I couldn't do it myself when it mattered.\n\nThat's embarrassing. And unfair to you.",
      emotion: 'regretful',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[She's holding a resume. Seven different job titles crossed out and rewritten.]\n\nYou came back.\n\nYou gave me time. That's generous.\n\nI thought... well. I've been through seven career changes. I know when someone's about to walk away.\n\n[She sets the resume down.]\n\nI tell my students to own their whole story. Then I couldn't do it myself when it mattered.\n\nThat's embarrassing. And unfair to you.",
        helping: "[She's holding a resume. Seven different job titles crossed out and rewritten.]\n\nYou came back.\n\nEven after I... I failed you as a mentor.\n\nI thought... well. I've been through seven career changes. I know when someone's about to walk away.\n\n[She sets the resume down.]\n\nI tell my students to own their whole story. Then I couldn't do it myself when it mattered.\n\nThat's embarrassing. And unfair to you.",
        analytical: "[She's holding a resume. Seven different job titles crossed out and rewritten.]\n\nYou came back.\n\nYou assessed the situation and decided to try again.\n\nI thought... well. I've been through seven career changes. I know when someone's about to walk away.\n\n[She sets the resume down.]\n\nI tell my students to own their whole story. Then I couldn't do it myself when it mattered.\n\nThat's embarrassing. And unfair to you.",
        building: "[She's holding a resume. Seven different job titles crossed out and rewritten.]\n\nYou came back.\n\nRebuilding trust I damaged. That takes guts.\n\nI thought... well. I've been through seven career changes. I know when someone's about to walk away.\n\n[She sets the resume down.]\n\nI tell my students to own their whole story. Then I couldn't do it myself when it mattered.\n\nThat's embarrassing. And unfair to you.",
        exploring: "[She's holding a resume. Seven different job titles crossed out and rewritten.]\n\nYou came back.\n\nStill exploring even after I got lost.\n\nI thought... well. I've been through seven career changes. I know when someone's about to walk away.\n\n[She sets the resume down.]\n\nI tell my students to own their whole story. Then I couldn't do it myself when it mattered.\n\nThat's embarrassing. And unfair to you."
      }
    }],
    choices: [
      {
        choiceId: 'jordan_recovery_practice',
        text: "You're still practicing. That's the whole point.",
        nextNodeId: 'jordan_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2,
          addKnowledgeFlags: ['jordan_trust_repaired']
        },
        voiceVariations: {
          patience: "Take your time. You're still practicing. That's the whole point.",
          helping: "You're still practicing. That's the whole point. You're human, not a finished product.",
          analytical: "Iteration is the process. You're still practicing. That's the whole point.",
          building: "You're still building yourself. Still practicing. That's the whole point.",
          exploring: "You're still exploring your own story. Still practicing. That's the whole point."
        }
      },
      {
        choiceId: 'jordan_recovery_seven',
        text: "Seven careers means you know how to start over. So start over here.",
        nextNodeId: 'jordan_trust_restored',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'jordan',
          trustChange: 2,
          addKnowledgeFlags: ['jordan_trust_repaired']
        },
        voiceVariations: {
          patience: "You've done this seven times. One more time. Start over here.",
          helping: "Seven careers means you know how to rebuild. So rebuild this. Start over here.",
          analytical: "Seven iterations of self. Apply that methodology. Start over here.",
          building: "Seven careers means you know how to start over. Build again. Right here.",
          exploring: "Seven careers. Seven new beginnings. So start over here. Explore this."
        }
      }
    ],
    tags: ['trust_recovery', 'jordan_arc']
  },

  {
    nodeId: 'jordan_trust_restored',
    speaker: 'Jordan Packard',
    content: [{
      text: "[She picks up the resume again. This time doesn't cross anything out.]\n\nYou're right.\n\nSeven careers. Seven times I started from zero. Seven times I felt like an impostor in the new role.\n\n[A quiet laugh.]\n\nAnd here I am, teaching people how to navigate transitions, still terrified I'm a fraud.\n\n[She looks at you directly.]\n\nThank you. For showing me I'm still learning too.\n\nI'm sorry I forgot that.",
      emotion: 'grateful_humbled',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[She picks up the resume again. This time doesn't cross anything out.]\n\nYou're right.\n\nYou waited for me to see it.\n\nSeven careers. Seven times I started from zero. Seven times I felt like an impostor in the new role.\n\n[A quiet laugh.]\n\nAnd here I am, teaching people how to navigate transitions, still terrified I'm a fraud.\n\n[She looks at you directly.]\n\nThank you. For showing me I'm still learning too. I'm sorry I forgot that.",
        helping: "[She picks up the resume again. This time doesn't cross anything out.]\n\nYou're right.\n\nYou helped me when I couldn't help myself.\n\nSeven careers. Seven times I started from zero. Seven times I felt like an impostor in the new role.\n\n[A quiet laugh.]\n\nAnd here I am, teaching people how to navigate transitions, still terrified I'm a fraud.\n\n[She looks at you directly.]\n\nThank you. For showing me I'm still learning too. I'm sorry I forgot that.",
        analytical: "[She picks up the resume again. This time doesn't cross anything out.]\n\nYou're right.\n\nYou analyzed what I couldn't see in myself.\n\nSeven careers. Seven times I started from zero. Seven times I felt like an impostor in the new role.\n\n[A quiet laugh.]\n\nAnd here I am, teaching people how to navigate transitions, still terrified I'm a fraud.\n\n[She looks at you directly.]\n\nThank you. For showing me I'm still learning too. I'm sorry I forgot that.",
        building: "[She picks up the resume again. This time doesn't cross anything out.]\n\nYou're right.\n\nYou rebuilt what I tore down.\n\nSeven careers. Seven times I started from zero. Seven times I felt like an impostor in the new role.\n\n[A quiet laugh.]\n\nAnd here I am, teaching people how to navigate transitions, still terrified I'm a fraud.\n\n[She looks at you directly.]\n\nThank you. For showing me I'm still learning too. I'm sorry I forgot that.",
        exploring: "[She picks up the resume again. This time doesn't cross anything out.]\n\nYou're right.\n\nYou explored the path back when I couldn't find it.\n\nSeven careers. Seven times I started from zero. Seven times I felt like an impostor in the new role.\n\n[A quiet laugh.]\n\nAnd here I am, teaching people how to navigate transitions, still terrified I'm a fraud.\n\n[She looks at you directly.]\n\nThank you. For showing me I'm still learning too. I'm sorry I forgot that."
      }
    }],
    choices: [{
      choiceId: 'jordan_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'jordan_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'jordan_arc'],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['jordan_trust_recovery_completed']
    }]
  },

  // ============= DEEP DIVE: STRUCTURAL INTEGRITY =============
  {
    nodeId: 'jordan_deep_dive',
    speaker: 'Jordan Packard',
    content: [
      {
        text: "The speech... the speech is just words.\n\n(A low rumble shakes the floor nearby.)\n\nYou feel that? The service corridor behind the stage. The support struts are vibrating. They're going to buckle under the weight of the crowd.\n\nI used to frame houses one summer. I know that sound.\n\nForget the PowerPoint. Grab that toolkit. We have ten minutes before the doors open.",
        emotion: 'commanding',
        variation_id: 'deep_dive_v1'
      }
    ],
    simulation: {
      type: 'visual_canvas',
      title: 'Structural Reinforcement',
      taskDescription: 'The corridor supports are failing. Reinforce the load-bearing points using improvised materials. Prioritize stability over aesthetics.',
      initialContext: {
        label: 'Service Corridor B',
        content: 'Load Map: CRITICAL',
        tools: ['Brace', 'Weld', 'Jack'],
        gridSize: 8,
        elements: [
          { x: 3, y: 7, type: 'beam_stress_high' },
          { x: 4, y: 7, type: 'beam_stress_critical' },
          { x: 3, y: 3, type: 'load_vector_down' }
        ],
        displayStyle: 'visual',
        mode: 'fullscreen'
      },
      successFeedback: 'INTEGRITY RESTORED. COLLAPSE AVERTED.',
      mode: 'fullscreen'
    },
    choices: [
      {
        choiceId: 'dive_success_hands',
        text: "You didn't hesitate. You just fixed it.",
        nextNodeId: 'jordan_deep_dive_success',
        pattern: 'building',
        skills: ['systemsThinking', 'problemSolving']
      },
      {
        choiceId: 'dive_success_synthesis',
        text: "Framing houses. Physics. Leadership. You used it all.",
        nextNodeId: 'jordan_deep_dive_success',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['deep_dive', 'mastery', 'crisis']
  },

  {
    nodeId: 'jordan_deep_dive_success',
    speaker: 'Jordan Packard',
    content: [
      {
        text: "Dust on my blazer. Grease on my hands.\n\nI feel... calm.\n\nI was so worried about explaining my value that I forgot I actually HAVE value. Real, tangible capability.\n\nI'm going to go out there like this. Dirty hands and all. Let them see the work.",
        emotion: 'empowered_calm',
        variation_id: 'deep_dive_success_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['jordan_mastery_achieved', 'jordan_builder_unlocked']
      }
    ],
    choices: [
      {
        choiceId: 'dive_complete',
        text: "Show them the work, Jordan.",
        nextNodeId: 'jordan_mentor_context', // Return to flow but changed
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMULATION PHASE 1: Career Choice Paralysis (trust ≥ 2)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'jordan_simulation_phase1_setup',
    speaker: 'Jordan Packard',
    content: [{
      text: "One of my students is stuck. Two job offers. Both good. Different directions.\n\nShe keeps asking: \"Which one is the RIGHT choice?\" Like there's a formula.\n\nWant to help me think through how to guide her?",
      emotion: 'focused',
      variation_id: 'sim_phase1_setup_v1'
    }],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'phase1_accept',
        text: "Let\'s work through it together.",
        nextNodeId: 'jordan_simulation_phase1',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'phase1_decline',
        text: "You know how to guide people. Trust your instincts.",
        nextNodeId: 'jordan_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'jordan_sim', 'phase1']
  },

  {
    nodeId: 'jordan_simulation_phase1',
    speaker: 'Jordan Packard',
    content: [{
      text: "Here\'s the situation. Let me know what you\'d say.",
      emotion: 'focused',
      variation_id: 'simulation_phase1_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Career Choice Paralysis',
      taskDescription: 'A student has two job offers and can\'t decide. She keeps asking which is \"right.\" How do you guide her to find her own answer?',
      phase: 1,
      difficulty: 'introduction',
      variantId: 'jordan_choice_paralysis_phase1',
      timeLimit: 90,
      initialContext: {
        label: 'STUDENT_SESSION',
        content: `STUDENT (anxious):
"I have two offers. Both good. Different.

Offer A: Big tech company. Great pay. Structured career path. But it's a role I've done before. Safe.

Offer B: Startup. Lower pay. Risky. But I'd learn new skills. Build something from scratch.

Everyone has an opinion. My parents say A. My friends say B.

Which one is RIGHT? I need to make the perfect choice."

CONTEXT:
- She's 24, early career
- First time choosing between opportunities (not just taking what's available)
- Terrified of regret
- Keeps asking you to tell her which to pick

APPROACH OPTIONS:
A) Tell her which one to choose (she's asking for an answer)
B) Ask her which one excites her more (focus on emotion)
C) Help her see there's no "wrong" choice - both paths teach something (reframe)
D) Build a pros/cons list together (analytical approach)

What's the most empowering guidance?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ BREAKTHROUGH: Option C - "There is no perfect choice. There are two different adventures. Which adventure do you want to experience first?" She relaxes. The paralysis breaks.',
      successThreshold: 80,
      unlockRequirements: {
        trustMin: 2
      }
    },
    choices: [{
      choiceId: 'phase1_success',
      text: "She stopped asking which is right. Started asking which feels true.",
      nextNodeId: 'jordan_simulation_phase1_success',
      pattern: 'helping',
      skills: ['emotionalIntelligence', 'communication']
    }],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['jordan_simulation_phase1_complete']
    }],
    tags: ['simulation', 'phase1', 'jordan_sim']
  },

  {
    nodeId: 'jordan_simulation_phase1_success',
    speaker: 'Jordan Packard',
    content: [{
      text: "Exactly. That shift. From \"right\" to \"true.\"\n\nThat\'s the work. Not giving answers. Helping people find the question underneath the question.\n\nYou get it. Most people want to be the expert. You want to be the guide.",
      emotion: 'impressed',
      variation_id: 'phase1_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'phase1_success_continue',
      text: "Guides trust the person to find their own path.",
      nextNodeId: 'jordan_hub_return',
      pattern: 'helping',
      skills: ['leadership']
    }],
    onEnter: [{
      characterId: 'jordan',
      trustChange: 2
    }],
    tags: ['simulation', 'phase1', 'success']
  },

  {
    nodeId: 'jordan_simulation_phase1_fail',
    speaker: 'Jordan Packard',
    content: [{
      text: "That approach... it might work short-term. But she\'ll come back with the next choice. And the next.\n\nWe didn\'t teach her how to choose. We just made the choice for her.\n\nGuidance isn\'t about having the answer. It\'s about helping someone find their own compass.",
      emotion: 'disappointed',
      variation_id: 'phase1_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'phase1_fail_reflect',
      text: "You\'re right. I was trying to fix it instead of guide it.",
      nextNodeId: 'jordan_hub_return',
      pattern: 'patience',
      skills: ['criticalThinking']
    }],
    onEnter: [{
      characterId: 'jordan',
      trustChange: 1
    }],
    tags: ['simulation', 'phase1', 'fail']
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMULATION PHASE 2: Industry Pivot Crisis (trust ≥ 5)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'jordan_simulation_phase2_setup',
    speaker: 'Jordan Packard',
    content: [{
      text: "Got a tough one. Finance professional. Ten years in. Wants to pivot to nonprofit work.\n\nEveryone says it\'s career suicide. She says it\'s her calling.\n\nBut she\'s terrified her skills won\'t transfer. That she\'ll start over at the bottom.\n\nThis is where career guidance gets hard. Want to work through it with me?",
      emotion: 'serious',
      variation_id: 'sim_phase2_setup_v1'
    }],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['jordan_simulation_phase1_complete']
    },
    choices: [
      {
        choiceId: 'phase2_accept',
        text: "Let\'s help her see what transfers.",
        nextNodeId: 'jordan_simulation_phase2',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'phase2_decline',
        text: "That\'s complex. But you\'ve navigated seven careers. You know transitions.",
        nextNodeId: 'jordan_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'jordan_sim', 'phase2']
  },

  {
    nodeId: 'jordan_simulation_phase2',
    speaker: 'Jordan Packard',
    content: [{
      text: "Here\'s where she is. Help me guide her through this.",
      emotion: 'focused',
      variation_id: 'simulation_phase2_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Industry Pivot Crisis',
      taskDescription: 'A finance professional wants to pivot to nonprofit work but can\'t see how her skills transfer. How do you help her see what she\'s built?',
      phase: 2,
      difficulty: 'application',
      variantId: 'jordan_industry_pivot_phase2',
      timeLimit: 120,
      initialContext: {
        label: 'PIVOT_SESSION',
        content: `PROFESSIONAL (defeated):
"I\'ve been in finance for ten years. Investment analysis. Portfolio management. High-stakes decisions.

But I want to work for a nonprofit. Climate action. Education. Something that matters.

Problem: Nonprofits don\'t need investment analysts. They need grant writers. Program coordinators. Fundraisers.

I\'d have to start over. Take a pay cut AND lose my expertise.

Everyone says I\'m throwing away my career. Maybe they\'re right."

YOUR KNOWLEDGE:
- She manages $500M in assets
- Makes decisions under uncertainty
- Communicates complex data to non-technical stakeholders
- Builds relationships with high-net-worth clients
- Led a team of 7 analysts

APPROACH OPTIONS:
A) Help her translate skills to nonprofit language (reframe)
B) Tell her to stay in finance but volunteer (compromise)
C) Focus on her passion and ignore the practical concerns (validation)
D) Map her expertise to nonprofit needs she doesn\'t see yet (discovery)

What helps her see what she\'s actually built?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ REFRAME: Options A+D combined - "You don\'t manage portfolios. You allocate scarce resources under uncertainty. That\'s EXACTLY what nonprofit directors do. Different spreadsheet. Same skill." She sits up straighter.',
      successThreshold: 85,
      unlockRequirements: {
        trustMin: 5,
        previousPhaseCompleted: 'jordan_choice_paralysis_phase1'
      }
    },
    choices: [{
      choiceId: 'phase2_success',
      text: "She didn\'t lose her expertise. She just found a new place to use it.",
      nextNodeId: 'jordan_simulation_phase2_success',
      pattern: 'analytical',
      skills: ['systemsThinking', 'communication']
    }],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['jordan_simulation_phase2_complete']
    }],
    tags: ['simulation', 'phase2', 'jordan_sim']
  },

  {
    nodeId: 'jordan_simulation_phase2_success',
    speaker: 'Jordan Packard',
    content: [{
      text: "That\'s it. THAT\'S the work.\n\nHelping people see the through-line. The pattern connecting their past to their future.\n\nShe thought she was starting over. But she\'s not. She\'s just... redirecting.\n\nLike I did. Seven times.\n\nMaybe that\'s why I can see it in others. Because I had to learn to see it in myself.",
      emotion: 'profound',
      variation_id: 'phase2_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'phase2_success_continue',
      text: "Your seven jobs weren\'t wandering. They were research.",
      nextNodeId: 'jordan_hub_return',
      pattern: 'exploring',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [{
      characterId: 'jordan',
      trustChange: 2
    }],
    tags: ['simulation', 'phase2', 'success']
  },

  {
    nodeId: 'jordan_simulation_phase2_fail',
    speaker: 'Jordan Packard',
    content: [{
      text: "Safe advice. Practical.\n\nBut she didn\'t come to me for safe. She came because she\'s ready to leap and doesn\'t know how.\n\nIf I don\'t help her see what she\'s really built, she\'ll stay stuck. Or worse - she\'ll leap without seeing her own parachute.\n\nGuidance isn\'t about reducing risk. It\'s about helping people see what they\'re capable of carrying across the gap.",
      emotion: 'disappointed',
      variation_id: 'phase2_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'phase2_fail_reflect',
      text: "You\'re right. I was protecting her from risk instead of helping her navigate it.",
      nextNodeId: 'jordan_hub_return',
      pattern: 'analytical',
      skills: ['criticalThinking']
    }],
    onEnter: [{
      characterId: 'jordan',
      trustChange: 1
    }],
    tags: ['simulation', 'phase2', 'fail']
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMULATION PHASE 3: The Unanswerable Question (trust ≥ 8)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'jordan_simulation_phase3_setup',
    speaker: 'Jordan Packard',
    content: [{
      text: "There\'s a question I can\'t answer. The one that student asked me last year.\n\n\"How do you know when to quit versus when to push through?\"\n\nI froze then. Still don\'t have the answer.\n\nBut now... there\'s another student asking the exact same thing. Different context. Same impossible question.\n\nI have to face it this time. Will you... be there while I try?",
      emotion: 'vulnerable',
      variation_id: 'sim_phase3_setup_v1',
      richEffectContext: 'thinking'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['jordan_simulation_phase2_complete', 'jordan_vulnerability_revealed']
    },
    choices: [
      {
        choiceId: 'phase3_accept',
        text: "I\'ll be right here. Let\'s face it together.",
        nextNodeId: 'jordan_simulation_phase3',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'phase3_decline',
        text: "Some questions don\'t have answers. Maybe that\'s what you tell her.",
        nextNodeId: 'jordan_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'jordan_sim', 'phase3', 'vulnerability']
  },

  {
    nodeId: 'jordan_simulation_phase3',
    speaker: 'Jordan Packard',
    content: [{
      text: "Here it is. The question I couldn\'t answer.",
      emotion: 'raw',
      variation_id: 'simulation_phase3_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'The Unanswerable Question',
      taskDescription: 'A student asks the question Jordan couldn\'t answer: \"How do you know when to quit versus when to push through?\" This time, Jordan has to try.',
      phase: 3,
      difficulty: 'mastery',
      variantId: 'jordan_unanswerable_phase3',
      timeLimit: 90,
      initialContext: {
        label: 'THE_QUESTION',
        content: `STUDENT (desperate):
"I\'ve been at this startup for two years. Grind culture. Toxic management. But I believe in the mission. Really believe.

Everyone says I should quit. My friends. My therapist. Even my partner.

But what if I\'m just being weak? What if I quit every time things get hard?

You\'ve had seven jobs. You know what it\'s like to leave. To start over.

How do you know when to quit versus when to push through?

Please. I need to know if leaving makes me a quitter or just... smart."

JORDAN\'S INTERNAL VOICE:
"This is the question. The one I froze on last year. The one that exposed me as a fraud.

Because I don\'t know the answer. I\'ve quit six times. Stayed too long once. Which was wisdom? Which was fear?"

APPROACH OPTIONS:
A) Share your own story - the startup that broke you, the Slack channel, the Target parking lot (vulnerability)
B) Give a framework - "Quit when X, stay when Y" (expertise)
C) Admit you don\'t know, but help them find their own answer (honesty + guidance)
D) Deflect with platitudes - "Trust your gut" (avoidance)

What does Jordan say this time?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ BREAKTHROUGH: Option A+C combined - Jordan shares the Slack channel story. Then: "I can\'t tell you when to quit. But I can tell you this: staying in a place that tells you you\'re not enough will kill the part of you that knows you are." The student cries. Then nods.',
      successThreshold: 95,
      unlockRequirements: {
        trustMin: 8,
        previousPhaseCompleted: 'jordan_industry_pivot_phase2',
        requiredFlags: ['jordan_vulnerability_revealed']
      }
    },
    choices: [{
      choiceId: 'phase3_success',
      text: "You didn\'t give the answer. You gave yourself. That was braver.",
      nextNodeId: 'jordan_simulation_phase3_success',
      pattern: 'helping',
      skills: ['emotionalIntelligence', 'leadership']
    }],
    onEnter: [{
      characterId: 'jordan',
      addKnowledgeFlags: ['jordan_simulation_phase3_complete', 'jordan_faced_the_question']
    }],
    tags: ['simulation', 'phase3', 'jordan_sim', 'mastery']
  },

  {
    nodeId: 'jordan_simulation_phase3_success',
    speaker: 'Jordan Packard',
    content: [{
      text: "I\'ve been a career counselor for twelve years.\n\nToday was the first time I counseled from my scars instead of my credentials.\n\nThe impostor voice is still there. Probably always will be.\n\nBut now I know: that voice doesn\'t disqualify me. It makes me human. And humans can guide other humans.\n\nExperts can\'t.\n\nThank you for being here when I faced it.",
      emotion: 'transformed',
      variation_id: 'phase3_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'phase3_success_continue',
      text: "Your uncertainty is your superpower, Jordan. It always was.",
      nextNodeId: 'jordan_hub_return',
      pattern: 'helping',
      skills: ['emotionalIntelligence', 'leadership']
    }],
    onEnter: [{
      characterId: 'jordan',
      trustChange: 3,
      addGlobalFlags: ['jordan_mastery_achieved']
    }],
    tags: ['simulation', 'phase3', 'success', 'transformation']
  },

  {
    nodeId: 'jordan_simulation_phase3_fail',
    speaker: 'Jordan Packard',
    content: [{
      text: "I gave advice. Clean. Professional. Safe.\n\nAnd I saw it in her eyes. The same thing I saw last year.\n\n\"You don\'t really get it, do you?\"\n\nShe was right. I didn\'t give guidance. I gave distance.\n\nThe question still stands. Unanswered. And now I\'ve failed twice.",
      emotion: 'defeated',
      variation_id: 'phase3_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'phase3_fail_reflect',
      text: "Maybe next time you\'ll be ready to face it.",
      nextNodeId: 'jordan_hub_return',
      pattern: 'patience',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [{
      characterId: 'jordan',
      trustChange: 1
    }],
    tags: ['simulation', 'phase3', 'fail']
  }
]

export const jordanEntryPoints = {
  INTRODUCTION: 'jordan_introduction',
  MYSTERY_HINT: 'jordan_mystery_hint'
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
