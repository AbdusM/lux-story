/**
 * Samuel Washington's Dialogue Graph
 * The Station Keeper - Hub character who guides travelers between platforms
 *
 * Role: Navigator, mentor, former traveler who chose to guide others
 * Background: Former Southern Company engineer, Birmingham native
 * Voice: Warm, patient, knowing but not mystical
 */

import {
  DialogueNode,
  DialogueGraph
} from '@/lib/dialogue-graph'
import { mayaRevisitEntryPoints } from './maya-revisit-graph'
import { samuelIdentityNodes } from './samuel-identity-nodes'
import { samuelOrbResonanceNodes } from './samuel-orb-resonance-nodes'
import { systemicCalibrationNodes } from './systemic-calibration' // ISP: The Grand Convergence

export const samuelDialogueNodes: DialogueNode[] = [
  ...systemicCalibrationNodes, // Inject Calibration nodes first

  // ============= CONDUCTOR MODE INTERCEPTION =============
  {
    nodeId: 'samuel_conductor',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "{{conductorAction}} {{targetName}}? Step lively, then.\n\nDon't just stare at the schedule. Looking at it won't get you there.",
        emotion: 'warm_guiding',
        variation_id: 'conductor_v1'
      }
    ],
    choices: [
      {
        choiceId: 'conductor_confirm',
        text: "Let's go.",
        nextNodeId: 'TRAVEL_PENDING',
        pattern: 'exploring',
        skills: ['adaptability'],
        voiceVariations: {
          exploring: "On my way.",
          building: "Time to move.",
          analytical: "Proceeding to destination.",
          helping: "Thanks for the direction, Samuel.",
          patience: "I'm ready."
        }
      }
    ]
  },

  // ============= GOD MODE CONDUCTOR =============
  {
    nodeId: 'samuel_conductor_god_mode',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You want to enter {{simulationTitle}}?\n\nThat's... unusual. But you've got that look in your eye. The one that says you know what you're doin'.\n\nStep on through, then.",
        emotion: 'knowing',
        variation_id: 'conductor_god_mode_v1'
      }
    ],
    choices: [
      {
        choiceId: 'god_mode_confirm',
        text: "Ready when you are.",
        nextNodeId: 'SIMULATION_PENDING',
        pattern: 'exploring',
        skills: ['adaptability'],
        voiceVariations: {
          exploring: "Let's see what this is about.",
          building: "Time to get hands-on.",
          analytical: "Initiating simulation.",
          helping: "Thanks, Samuel.",
          patience: "I'm prepared."
        }
      }
    ]
  },

  // ============= ATMOSPHERIC ARRIVAL =============
  {
    nodeId: 'station_arrival',
    speaker: '', // No speaker - purely atmospheric
    content: [
      {
        text: "The train slows down. Through fogged windows, you catch your first glimpse of the station. High ceilings, warm light spillin' through old glass, sounds of folks talkin' somewhere up ahead.\n\nA figure's waitin' on the platform. Older man, patient stance. Like he's been expectin' you.",
        emotion: 'atmospheric',
        variation_id: 'arrival_v1'
      }
    ],
    choices: [
      {
        choiceId: 'step_forward_confident',
        text: "Step off the train",
        nextNodeId: 'samuel_introduction',
        pattern: 'exploring',
        skills: ['adaptability'],
        voiceVariations: {
          exploring: "Step off. See what this place has to offer.",
          building: "Time to move. Standing here won't change anything.",
          analytical: "Enough observation. Gather data from closer range.",
          helping: "That man is waiting. Better not keep him.",
          patience: "Alright. One step at a time."
        }
      },
      {
        choiceId: 'observe_first',
        text: "Take a moment to look around first",
        nextNodeId: 'station_observation',
        pattern: 'patience',
        skills: ['criticalThinking'],
        voiceVariations: {
          patience: "Wait. Take this in before moving.",
          analytical: "Observe first. Understand the environment.",
          exploring: "Look around. There might be more to see.",
          helping: "Pause. Make sure it's safe for others too.",
          building: "Get the lay of the land before committing."
        }
      },
      {
        choiceId: 'check_others',
        text: "See if anyone else is getting off",
        nextNodeId: 'observe_passengers',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          helping: "Check on the other passengers first.",
          patience: "No rush. See who else is here.",
          exploring: "Interesting.who else ended up in this place?",
          analytical: "Who else is on this train? Data point.",
          building: "See if anyone needs help with their bags."
        }
      }
    ]
  },

  // ============= OBSERVATION BRANCHES =============
  // Player chose to look around - reward their patience with atmosphere
  {
    nodeId: 'station_observation',
    speaker: '', // Atmospheric narration
    content: [
      {
        text: "You pause at the train door, taking it in.\n\nThe station's bigger than it looked from outside. Vaulted ceilings stretch up into shadow, old ironwork catching the light. Platform signs point to places you half-recognize—some you don't. The air smells like old wood and something faintly electric, like possibility.\n\nA few travelers drift past, each heading somewhere with quiet purpose.\n\nThe older man on the platform notices you looking. He smiles, patient. No rush.",
        emotion: 'atmospheric',
        variation_id: 'observation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'step_off_after_looking',
        text: "Step off and approach him",
        nextNodeId: 'samuel_introduction_patient',
        pattern: 'exploring',
        skills: ['adaptability'],
        voiceVariations: {
          exploring: "He seems welcoming. Let's find out more.",
          patience: "Time to move forward. He's been patient.",
          helping: "He looks kind. Go meet him.",
          analytical: "Initial assessment complete. Approach.",
          building: "Seen enough. Time to engage."
        }
      },
      {
        choiceId: 'ask_about_platforms',
        text: "Those platform signs... where do they all go?",
        nextNodeId: 'samuel_introduction_curious',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        voiceVariations: {
          analytical: "Those platform signs.I need to understand the system.",
          exploring: "Where do all those platforms lead? I want to know everything.",
          building: "Each platform is a different path. Which one's mine?",
          patience: "Those signs... worth understanding before choosing.",
          helping: "Do different platforms help different people?"
        }
      }
    ]
  },

  // Player chose to notice others - reward their awareness
  {
    nodeId: 'observe_passengers',
    speaker: '', // Atmospheric narration
    content: [
      {
        text: "You glance down the train car. A few other passengers are gathering their things.a young woman with paint-stained fingers, a guy in scrubs looking exhausted but focused, someone your age staring out the window like they're working up courage.\n\nEach of them alone. Each of them here for something.\n\nOn the platform, the older man waits. His eyes move across all of you, but when they land on you, something shifts. Recognition, maybe. Or just welcome.",
        emotion: 'atmospheric',
        variation_id: 'passengers_v1'
      }
    ],
    choices: [
      {
        choiceId: 'step_off_noticed',
        text: "Step off the train",
        nextNodeId: 'samuel_introduction_noticed',
        pattern: 'exploring',
        skills: ['adaptability'],
        voiceVariations: {
          exploring: "Interesting group. Time to join them.",
          helping: "They all have their own journeys. Mine starts now.",
          analytical: "Others noted. Now gather my own data.",
          building: "Their paths, my path. Let's see where this leads.",
          patience: "Everyone's moving at their own pace. Mine too."
        }
      },
      {
        choiceId: 'wait_for_others',
        text: "Let the others go first",
        nextNodeId: 'samuel_introduction_humble',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          patience: "Let them go first. No need to rush.",
          helping: "They might need clear space. Give them room.",
          exploring: "Watch how they navigate. Learn from it.",
          analytical: "Observe how others approach this. Then proceed.",
          building: "Let the path clear before I step forward."
        }
      }
    ]
  },

  // Samuel's intro variants based on how player arrived
  {
    nodeId: 'samuel_introduction_patient',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You took your time. Good.\n\nMost folks rush off the train like they're late for somethin'. But you... you looked first. That's smart.\n\nI'm Samuel. Been helpin' folks find their way around here for longer than I expected. You look like you got questions.and that's exactly what this place is for.",
        emotion: 'warm',
        variation_id: 'intro_patient_v1',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "You took your time. Good.\n\nI can tell that's not new for you.you're someone who looks before they leap. That's wisdom some folks never learn.\n\nI'm Samuel. You're gonna do well here.", altEmotion: 'knowing' },
          { pattern: 'analytical', minLevel: 4, altText: "You took your time. Good.\n\nI see you taking it all in, processing. That's exactly the kind of mind this place rewards.\n\nI'm Samuel. Welcome to Grand Central.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'ask_what_is_this_patient',
        text: "What is this place exactly?",
        nextNodeId: 'systemic_calibration_start', // ISP: Reroute to Calibration
        pattern: 'exploring',
        skills: ['communication', 'adaptability'],
        voiceVariations: {
          analytical: "What is this place? How does it work?",
          helping: "What brings people here?",
          building: "What is this place? What can I do here?",
          exploring: "What is this place exactly?",
          patience: "I'm curious about this place."
        }
      },
      {
        choiceId: 'ask_about_platforms_patient',
        text: "The platforms.where do they lead?",
        nextNodeId: 'systemic_calibration_start', // ISP: Reroute to Calibration
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        voiceVariations: {
          analytical: "The platforms.where do they lead? What's the system?",
          helping: "Those platforms.who can I meet there?",
          building: "The platforms.what can I accomplish on each one?",
          exploring: "Where do those platforms go?",
          patience: "Tell me about the platforms when you're ready."
        }
      },
      {
        choiceId: 'ask_who_are_you_patient',
        text: "How'd you end up here?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        voiceVariations: {
          analytical: "What's your role here? How did that come about?",
          helping: "You've helped a lot of people. What's your story?",
          building: "How'd you build this position here?",
          exploring: "That's a lot of history. How'd it start?",
          patience: "How'd you end up here?"
        }
      }
    ]
  },

  {
    nodeId: 'samuel_introduction_curious',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Ha! Straight to the big questions. I like that.\n\nI'm Samuel. And those platforms? They go to different... let's call 'em possibilities. Each one's got folks who've walked paths you might want to walk. Or might not. That's the thing about this place.it don't tell you what to choose. Just helps you see clearer.\n\nBut we can get to all that. First.welcome to Grand Central.",
        emotion: 'warm',
        variation_id: 'intro_curious_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tell_me_more_platforms',
        text: "Tell me more about the platforms",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'exploring',
        skills: ['communication', 'adaptability'],
        voiceVariations: {
          analytical: "Break down the platform system for me.",
          helping: "Who would I meet on these platforms?",
          building: "What opportunities are on each platform?",
          exploring: "Tell me more about the platforms",
          patience: "I'd like to hear about each platform."
        }
      },
      {
        choiceId: 'who_are_you_curious',
        text: "And you help people... how?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        voiceVariations: {
          analytical: "And you help people... how exactly?",
          helping: "You care about the travelers. Why?",
          building: "What's your method for helping people?",
          exploring: "What kinds of help do you give?",
          patience: "Tell me more about how you help."
        }
      },
      {
        choiceId: 'ready_to_explore_curious',
        text: "I'm ready to look around",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['communication'],
        voiceVariations: {
          analytical: "I have enough context. Let's begin.",
          helping: "I'm ready to meet people.",
          building: "I'm ready to start. Where first?",
          exploring: "I'm ready to look around",
          patience: "I'm ready when you are."
        }
      }
    ]
  },

  {
    nodeId: 'samuel_introduction_noticed',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You noticed the others. That's good.means you're payin' attention.\n\nEvery person on that train's got their own story, their own reason for being here. Some know it. Some don't yet. That's what this place helps with.\n\nI'm Samuel. Been here a while. And you... you look like you see more than most. That's gonna serve you well.",
        emotion: 'warm',
        variation_id: 'intro_noticed_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_about_others',
        text: "Who were those other passengers?",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        voiceVariations: {
          analytical: "Who were those passengers? What brings them here?",
          helping: "Who were those other passengers? Are they okay?",
          building: "The other passengers.what are they working on?",
          exploring: "I noticed them too. Who are they?",
          patience: "Tell me about the other passengers."
        }
      },
      {
        choiceId: 'ask_about_self',
        text: "What's my reason for being here?",
        nextNodeId: 'samuel_explains_station',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        voiceVariations: {
          analytical: "What's my reason for being here? What data do you have?",
          helping: "I want to understand why I'm here.",
          building: "What am I meant to accomplish here?",
          exploring: "Why am I here, specifically?",
          patience: "I suppose I'm here for a reason."
        }
      },
      {
        choiceId: 'samuel_story_noticed',
        text: "You said you've been here a while...",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        voiceVariations: {
          analytical: "How long exactly have you been here?",
          helping: "You've seen a lot of travelers. Does it ever get to you?",
          building: "You've been here a while. What have you built?",
          exploring: "You've been here a while. What's your story?",
          patience: "You said you've been here a while..."
        }
      }
    ]
  },

  {
    nodeId: 'samuel_introduction_humble',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You let them go first. Watched 'em find their footing.\n\nThat's a rare thing, you know? Most folks are so caught up in their own journey, they forget everyone else is on one too. But you... you see people.\n\nI'm Samuel. And I think you and I are gonna get along just fine. Welcome to Grand Central.",
        emotion: 'warm',
        variation_id: 'intro_humble_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "You let them go first. Watched 'em find their footing.\n\nThat's who you are, isn't it? Someone who makes room for others. I've been watching people arrive here for years, and that quality... it's rarer than you'd think.\n\nI'm Samuel. Welcome home.", altEmotion: 'knowing' },
          { pattern: 'patience', minLevel: 4, altText: "You let them go first. No rush.\n\nI know that kind of patience. It's not passive.it's watching, understanding. That's a strength, even if the world doesn't always see it that way.\n\nI'm Samuel. Welcome to Grand Central.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'ask_what_is_this_humble',
        text: "What is this place?",
        nextNodeId: 'samuel_explains_station',
        pattern: 'exploring',
        skills: ['communication'],
        voiceVariations: {
          analytical: "What is this place? What's the purpose?",
          helping: "What brings people to a place like this?",
          building: "What is this place? What happens here?",
          exploring: "What is this place?",
          patience: "I'm not in any rush. Tell me about this place."
        }
      },
      {
        choiceId: 'ask_about_others_humble',
        text: "Will I see those other travelers again?",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          analytical: "Are traveler paths interconnected?",
          helping: "Will I see those other travelers again?",
          building: "Do travelers work together here?",
          exploring: "Will our paths cross again?",
          patience: "I wonder if I'll meet them again."
        }
      },
      {
        choiceId: 'why_get_along',
        text: "Why do you say we'll get along?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence'],
        voiceVariations: {
          analytical: "What makes you think we'll get along?",
          helping: "You seem to understand people. How?",
          building: "What do you see in me?",
          exploring: "You noticed something about me. What?",
          patience: "Why do you say we'll get along?"
        }
      }
    ]
  },

  // ============= SIMULATION: THE LISTENER'S LOG (HubSpot Metaphor) =============
  {
    nodeId: 'samuel_simulation_crm',
    speaker: 'Samuel Washington',
    content: [{
      text: "Sometimes, helping folks ain't about speeches. It's about remembering.\n\nI keep a log. Every traveler, every question. Patterns emerge if you write 'em down.\n\nHere's a traveler struggling with the schedule. They think they're lost. They ain't lost.they just don't know the destination changed.",
      emotion: 'thoughtful',
      variation_id: 'sim_intro_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Traveler Triage: The Lost Musician',
      taskDescription: 'A traveler is panicking about a missed train. Use the station logs to realize their ticket was automatically rebooked, then calm them down.',
      initialContext: {
        label: 'Station Log: Direct Message',
        content: `Traveler_88: I missed the 4:15 to Nashville! My audition is tomorrow!
Traveler_88: The board says DELAYED but the platform is empty.
Traveler_88: Am I stranded? Please, I can't miss this.`,
        displayStyle: 'text'
      },
      successFeedback: '✓ TRAVELER CALMED: "Oh... it was rebooked to 5:30? Thank you. I can breathe now."'
    },
    choices: [
      {
        choiceId: 'sim_reassure_data',
        text: "Check logs. 'Train 415 merged with 530 due to track maintenance.' Tell them they have time for coffee.",
        nextNodeId: 'samuel_orb_introduction', // Proceed to main flow
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'digitalLiteracy'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['golden_prompt_workflow'],
          addKnowledgeFlags: ['samuel_simulation_phase1_complete']
        },
        voiceVariations: {
          analytical: "Cross-reference: Train 415 merged with 530. Communicate the reschedule.",
          helping: "They're panicking. Check logs, then reassure them they have time.",
          building: "Solve it: find the merge record and give them a clear action.coffee break.",
          exploring: "Dig through the logs. There's gotta be an explanation.",
          patience: "Let me check carefully. Yes.they have time. Tell them gently."
        }
      },
      {
        choiceId: 'sim_analyze_pattern',
        text: "Notice this happens every Tuesday. Suggest better signage for the merge.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'analytical',
        skills: ['systemsThinking', 'informationLiteracy'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['golden_prompt_workflow'],
          addKnowledgeFlags: ['samuel_simulation_phase1_complete']
        },
        voiceVariations: {
          analytical: "Pattern detected: Tuesday merges. Recommend signage improvement.",
          helping: "This keeps happening to people. Suggest better signage so others don't panic.",
          building: "Fix the root cause. Better signage prevents future confusion.",
          exploring: "Wait.this happens every Tuesday? That's a systemic issue.",
          patience: "If we improve signage now, fewer travelers will worry later."
        }
      },
      {
        choiceId: 'sim_dismiss',
        text: "Tell them to just wait. The board is never wrong.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'patience',
        voiceVariations: {
          analytical: "The board is accurate. They should trust the system.",
          helping: "Just tell them to wait. It'll work out.",
          building: "Waiting is the answer. No action needed.",
          exploring: "Maybe they just need to wait and see.",
          patience: "Tell them to just wait. The board is never wrong."
        }
      }
    ],
    tags: ['simulation', 'samuel_arc']
  },

  // ============= ORIGINAL INTRODUCTION (for direct step-off) =============
  {
    nodeId: 'samuel_introduction',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Hey there. Welcome to Grand Central.\n\nI'm Samuel. Been helpin' folks find their way around here for... well, longer than I expected, honestly. Lot more travelers lately too. World's movin' fast out there.\n\nYou look like you got questions. Most people do when they first show up. Every choice you make here... the station pays attention. But we can get to that.",
        emotion: 'warm',
        variation_id: 'intro_v1_part1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Hey there. Welcome to Grand Central.\n\nI'm Samuel. Been helpin' folks find their way around here for... well, longer than I expected. Lot more travelers lately.world's changin' fast. You look like someone who thinks things through. That's gonna matter more than ever.", altEmotion: 'knowing' },
          { pattern: 'helping', minLevel: 5, altText: "Hey there. Welcome to Grand Central.\n\nI'm Samuel. Been helpin' folks find their way around here for a long time. More people arrivin' every day now. You look like someone who notices people. That's rare, and it's gonna serve you well here.", altEmotion: 'warm' },
          { pattern: 'exploring', minLevel: 5, altText: "Hey there. Welcome to Grand Central.\n\nI'm Samuel. Been helpin' folks find their way around here longer than I expected. Lot more travelers lately. You look like someone who's ready to discover things. Good.this place rewards curiosity.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'ask_what_is_this',
        text: "What is this place exactly?",
        nextNodeId: 'systemic_calibration_start', // ISP: Reroute to Calibration
        pattern: 'exploring',
        skills: ['communication', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "What is this place? How does it function?",
          helping: "What draws people to this place?",
          building: "What is this place? What can I accomplish here?",
          exploring: "What is this place exactly?",
          patience: "Tell me about this place."
        }
      },
      {
        choiceId: 'ask_about_platforms',
        text: "I noticed the different platforms. Where do they all go?",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "The platforms seem organized by purpose. What's the system?",
          helping: "I see different people heading different ways. Who's on each platform?",
          building: "Those platforms.what opportunities are on each one?",
          exploring: "I noticed the different platforms. Where do they all go?",
          patience: "I see there are different platforms. Could you tell me about them?"
        }
      },
      {
        choiceId: 'ask_who_are_you',
        text: "How'd you end up working here?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        },
        voiceVariations: {
          analytical: "What's your history here? How did you come to this role?",
          helping: "You've been at this a while. What's your story?",
          building: "How'd you build your life around this place?",
          exploring: "I'm curious.how'd you end up here?",
          patience: "How'd you end up working here?"
        }
      },
      {
        choiceId: 'ask_whats_happening',
        text: "You said more travelers lately. What's happening out there?",
        nextNodeId: 'samuel_changing_world',
        pattern: 'analytical',
        skills: ['criticalThinking', 'curiosity'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "You mentioned increased traffic. What's driving the change?",
          helping: "More travelers... are people struggling out there?",
          building: "The world's changing. What kind of changes?",
          exploring: "You said more travelers lately. What's happening out there?",
          patience: "Sounds like the world is shifting. Tell me more."
        }
      },
      {
        choiceId: 'ready_to_explore_intro',
        text: "I'm ready to look around",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['communication'],
        voiceVariations: {
          analytical: "I have enough context. Show me what's here.",
          helping: "I'm ready to meet the people here.",
          building: "Let's get started. What's first?",
          exploring: "I'm ready to look around",
          patience: "I'm ready whenever you are."
        }
      }
    ]
  },

  // ============= ECONOMIC CONTEXT (Optional Branch) =============
  {
    nodeId: 'samuel_changing_world',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "World's changin'. Always has been, but feels faster now. Machines doin' what people used to do. Jobs that were steady for generations, gone in a decade.\n\nBut here's what I've learned: the work might change, but what people need don't. Someone to fix things when they break. Someone to care for folks when they're vulnerable. Someone to teach the young ones.\n\nThat's why patterns matter more than job titles. You figure out how you're built to contribute, you'll find your place. Even when everything else is shiftin'.",
        emotion: 'wise',
        variation_id: 'changing_world_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "World's changin'. Always has been, but faster now. You can see it in the numbers. Automation, AI, industries shrinkin'. But here's what the data don't tell you: the skills underneath stay valuable. Problem-solvin'. Seein' systems. Figurin' out what's really broken.\n\nThat's why patterns matter more than job titles. You figure out how you think, you'll find where you fit.", altEmotion: 'knowing' },
          { pattern: 'building', minLevel: 4, altText: "World's changin'. Jobs that were steady for generations, gone. But here's what I've learned watchin' folks come through here: people who build things, fix things, make things with their hands. That work's solid ground.\n\nMachines can automate a lot, but they can't replace someone who knows how to solve a problem they've never seen before. That's a builder's gift.", altEmotion: 'warm' },
          { pattern: 'helping', minLevel: 4, altText: "World's changin'. Lot of scared folks comin' through these days. But here's what I've noticed: the jobs that need real human connection, they're not goin' nowhere.\n\nCarin' for people. Teachin'. Healin'. Machines can do a lot, but they can't sit with someone who's hurtin'. That kind of presence. That's always gonna matter.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'trades_wisdom',
        text: "What about people who work with their hands? Factory workers, welders?",
        nextNodeId: 'samuel_trades_wisdom',
        pattern: 'building',
        skills: ['curiosity', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "What's the data on skilled trades? How are they adapting?",
          helping: "What about the people doing physical work? Are they okay?",
          building: "What about people who work with their hands? Factory workers, welders?",
          exploring: "What's happening to the trades? The hands-on work?",
          patience: "I wonder about the people doing physical work."
        }
      },
      {
        choiceId: 'patterns_survival',
        text: "How do patterns help when everything's uncertain?",
        nextNodeId: 'samuel_pattern_survival',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        voiceVariations: {
          analytical: "How do patterns help when everything's uncertain?",
          helping: "How do people find stability when things keep changing?",
          building: "When the world shifts, what keeps people grounded?",
          exploring: "If everything's changing, how does anyone know what to do?",
          patience: "How do people stay steady when things are uncertain?"
        }
      },
      {
        choiceId: 'back_to_exploring',
        text: "Thanks. I'd like to look around now.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        voiceVariations: {
          analytical: "I understand. Let's proceed.",
          helping: "Thank you for sharing that. I'm ready to meet others now.",
          building: "That gives me context. What's next?",
          exploring: "Thanks. I'd like to look around now.",
          patience: "I appreciate the insight. I'm ready to continue."
        }
      }
    ],
    tags: ['economic_context', 'samuel_arc']
  },

  {
    nodeId: 'samuel_trades_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Those folks? They're gonna be alright. Not because nothin's changin' for them. It is. But because they know how to do things that matter.\n\nMy daddy was a welder at Sloss Furnaces. Sixty years ago, folks said that work was dyin'. Still needs welders today. Different machines, same hands.\n\nKai on Platform 6, they came from factory work. Nucor Steel. Knows what it means to build something that holds. Talk to 'em if you want to understand how the old ways and new ways can fit together.",
        emotion: 'warm',
        variation_id: 'trades_v1'
      }
    ],
    choices: [
      {
        choiceId: 'visit_kai_from_trades',
        text: "I'd like to meet Kai.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'building',
        voiceVariations: {
          analytical: "Kai sounds interesting. I want to learn more.",
          helping: "I'd like to hear Kai's story.",
          building: "I'd like to meet Kai.",
          exploring: "Kai sounds like someone worth meeting.",
          patience: "I'd like to talk to Kai when I get the chance."
        }
      },
      {
        choiceId: 'more_about_patterns',
        text: "Tell me more about patterns.",
        nextNodeId: 'samuel_pattern_survival',
        pattern: 'analytical',
        voiceVariations: {
          analytical: "Tell me more about patterns. How do they work?",
          helping: "How do patterns help people understand themselves?",
          building: "How can patterns help me figure out my path?",
          exploring: "I'm curious about these patterns you mention.",
          patience: "I'd like to understand patterns better."
        }
      }
    ],
    tags: ['trades', 'samuel_arc', 'economic_context']
  },

  {
    nodeId: 'samuel_pattern_survival',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Patterns ain't about what job you have. Jobs change. Always have.\n\nIt's about how you move through the world when things get hard. Some folks think their way through. Some folks build their way through. Some folks help others find the way.\n\nMachines can follow instructions. But they can't adapt when the instructions don't fit anymore. You can.\n\nThat's not somethin' you learn from a slide deck.",
        emotion: 'wise',
        variation_id: 'pattern_survival_v1',
        interaction: 'nod'
      }
    ],
    onEnter: [
      {
        thoughtId: 'hidden-connections'
      }
    ],
    choices: [
      {
        choiceId: 'ready_after_wisdom',
        text: "I think I understand.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring'
      },
      {
        choiceId: 'who_should_i_meet',
        text: "Who should I talk to first?",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'helping'
      },
      {
        choiceId: 'pattern_wisdom_deep',
        text: "[Wisdom] You're describing emergence. Patterns that adapt create new possibilities.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['systemsThinking', 'criticalThinking'],
        requiredOrbFill: { pattern: 'exploring', threshold: 35 },
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ],
    tags: ['patterns', 'samuel_arc', 'economic_context']
  },

  {
    nodeId: 'samuel_introduction_2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I've been helping people find their way in <bloom>Birmingham</bloom> for a long time. Longer than I expected.\n\nYou're here to figure some things out. Good. That's what this place is for. No tests, no grades. Just real conversations.",
        emotion: 'warm',
        variation_id: 'intro_v1_combined'
      }
    ],
    choices: [
      {
        choiceId: 'ask_what_is_this_combined',
        text: "What is this place?",
        nextNodeId: 'samuel_explains_station',
        pattern: 'exploring',
        skills: ['communication', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_about_platforms_combined',
        text: "I see platforms. Where do they lead?",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_who_are_you_combined',
        text: "Who are you, really?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'ready_to_explore_combined',
        text: "I'm ready to find my way.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= STATION EXPLANATION =============
  {
    nodeId: 'samuel_explains_station',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Fox Theatre Station. Been here since 1929, y'know, same as the theatre upstairs. Beautiful old building.\n\nEach platform connects you to different folks around the city. People figuring out their own stuff, just like you. Lot of 'em came here because things changed faster than they expected.\n\nYou talk to 'em, see what clicks. That's how you find solid ground when everything's shifting.",
        emotion: 'warm',
        variation_id: 'explains_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Fox Theatre Station. Been here since 1929, same as the theatre upstairs. Beautiful old building.\n\nEach platform connects you to different folks. Lot of 'em came here because the world moved faster than they expected. You seem like the type who wants to understand how it all fits together.that's exactly how you find your footing.", altEmotion: 'knowing' },
          { pattern: 'building', minLevel: 5, altText: "Fox Theatre Station. Been here since 1929, same as the theatre upstairs. Beautiful old building.took real craftsmanship to make this.\n\nEach platform connects to different folks. People who build things, fix things, make things. You seem like one of 'em. That kind of work... it's solid ground.", altEmotion: 'warm' },
          { pattern: 'patience', minLevel: 5, altText: "Fox Theatre Station. Been here since 1929. This place takes its time with folks, and I can tell you do too.\n\nEach platform connects to different people. World's rushin', but some things can't be rushed. The right conversations happen when they're supposed to.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'ask_your_story',
        text: "You been doing this long?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'ready_to_explore',
        text: "Alright, let me check out the platforms",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'samuel_explains_platforms',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "There's Platform 3, heading towards the medical centers. Platform 9 for the tech districts. But there's also the rare lines... \n\nI've seen a coder from Atlanta, a deep-sea welder off the Scottish coast. And just yesterday, a young brother torn between his own startup and helping HBCUs get their fair share of federal funding. \n\nThe question ain't where they're going. It's which song you're trying to hear.",
        emotion: 'thoughtful',
        variation_id: 'platforms_explained_v3'
      }
    ],
    onEnter: [
      {
        thoughtId: 'hidden-connections'
      }
    ],
    choices: [
      {
        choiceId: 'ask_backstory',
        text: "What about you? How'd you end up here?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_to_meet',
        text: "I'm ready to meet somebody",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['curiosity', 'communication']
      }
    ]
  },

  // ============= SAMUEL'S BACKSTORY =============
  {
    nodeId: 'samuel_backstory_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "My story? Yeah, alright.\n\nWorked at Southern Company for twenty-three years. Power plants, electrical grids - the stuff that keeps the lights on in Birmingham. Good job. Stable. My daddy was real proud. First in our family to work in an office instead of out at Sloss Furnaces.",
        emotion: 'reflective',
        variation_id: 'backstory_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 5, altText: "My story? Yeah, alright.\n\nWorked at Southern Company for twenty-three years. Power plants, electrical grids.you know, the real infrastructure that keeps Birmingham running. You've got builder hands yourself, don't you? I can tell.", altEmotion: 'warm' },
          { pattern: 'patience', minLevel: 5, altText: "My story? Yeah, alright. You're the first person in a while to actually ask.\n\nWorked at Southern Company for twenty-three years. Power plants, electrical grids. My daddy was real proud.first in our family to work in an office instead of out at Sloss Furnaces.", altEmotion: 'reflective' },
          { pattern: 'helping', minLevel: 5, altText: "My story? Yeah, you actually want to hear it. That's kind.\n\nWorked at Southern Company for twenty-three years. Power plants, electrical grids.keeping the lights on for people. That mattered to me. My daddy was real proud.", altEmotion: 'warm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'ask_why_leave',
        text: "So why'd you leave?",
        nextNodeId: 'samuel_backstory_revelation',
        pattern: 'exploring',
        skills: ['communication'],
        archetype: 'ASK_FOR_DETAILS'
      },
      {
        choiceId: 'acknowledge',
        text: "Sounds like a solid life",
        nextNodeId: 'samuel_backstory_revelation',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        archetype: 'SHOW_UNDERSTANDING'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_backstory'],
        thoughtId: 'industrial-legacy'
      }
    ]
  },

  {
    nodeId: 'samuel_backstory_revelation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It was solid. But it <shake>wasn't mine</shake>, you know?\n\nOne day I'm standin' up at Vulcan, lookin' down at the whole city. Twenty-three years buildin' other people's systems.\n\nI was good at it. Real good. But I'd never once asked myself what I actually wanted to build.",
        emotion: 'vulnerable',
        variation_id: 'revelation_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "It was solid. But it <shake>wasn't mine</shake>, you know?\n\nTwenty-three years buildin' other people's systems. You understand that, don't you? The difference between making something because you're told to, and building something because it's yours.", altEmotion: 'knowing' },
          { pattern: 'exploring', minLevel: 4, altText: "It was solid. But it <shake>wasn't mine</shake>.\n\nI see that same restlessness in you.the need to find your own thing, not just accept what's handed to you. That's not easy. But it's necessary.", altEmotion: 'warm' },
          { pattern: 'patience', minLevel: 4, altText: "It was solid. But it <shake>wasn't mine</shake>.\n\nTook me twenty-three years to figure that out. You listening like this.you're doing it faster than I did. That's good.", altEmotion: 'reflective' }
        ],
        // E2-031: Interrupt opportunity during vulnerable moment
        interrupt: {
          duration: 3500,
          type: 'silence',
          action: 'Hold the silence. Let him know you hear him.',
          targetNodeId: 'samuel_interrupt_acknowledged',
          consequence: {
            characterId: 'samuel',
            trustChange: 2
          }
        }
      }
    ],
    // MYSTERY PROGRESSION: Samuel's Past advances from 'hidden' to 'hinted'
    onEnter: [
      {
        mysteryChanges: { samuelsPast: 'hinted' }
      }
    ],
    choices: [
      {
        choiceId: 'what_did_you_want',
        text: "So what did you want to build?",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'relate',
        text: "I understand that feeling.",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        archetype: 'ACKNOWLEDGE_EMOTION',
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'acquaintance'
        }
      }
    ]
  },

  // ============= INTERRUPT TARGET: Player held the silence =============
  {
    nodeId: 'samuel_interrupt_acknowledged',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You didn't try to fill the silence. That's rare.\n\nMost folks can't sit with someone else's weight. They rush to fix it, change the subject. You just stayed.\n\nThat means somethin'.",
        emotion: 'moved',
        variation_id: 'interrupt_acknowledged_v1',
        interaction: 'nod'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['samuel_felt_heard']
      }
    ],
    choices: [
      {
        choiceId: 'samuel_after_interrupt',
        text: "(Continue)",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'patience'
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'samuel_arc']
  },

  // ============= E2-062: SAMUEL'S VULNERABILITY ARC =============
  // "What he lost to become the Conductor"
  {
    nodeId: 'samuel_vulnerability_arc',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You want the truth about what this job cost me?\n\nDorothy. My wife of twenty-eight years. When I left Southern Company, she thought I'd lost my mind. 'A train station that don't exist? Samuel, you sound like your father before he...'\n\nShe gave me a choice. The station or her. I told myself I'd make her understand. That once she saw what this place could do for people.\n\nShe was gone before the first passenger arrived.",
        emotion: 'grief_raw',
        variation_id: 'vulnerability_v1',
        microAction: 'His hands rest on the console, trembling slightly.',
        richEffectContext: 'thinking'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['samuel_vulnerability_revealed', 'knows_about_dorothy']
      },
      // MYSTERY PROGRESSION: Letter sender advances to 'investigating' at trust 6
      {
        mysteryChanges: { letterSender: 'investigating' }
      }
    ],
    choices: [
      {
        choiceId: 'vuln_worth_it',
        text: "Was it worth it?",
        nextNodeId: 'samuel_vulnerability_reflection',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        archetype: 'ASK_FOR_DETAILS'
      },
      {
        choiceId: 'vuln_silence',
        text: "[Stay silent. Some grief needs no words.]",
        nextNodeId: 'samuel_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        archetype: 'STAY_SILENT',
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_empathy',
        text: "I'm sorry, Samuel. That's a heavy weight to carry.",
        nextNodeId: 'samuel_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        archetype: 'ACKNOWLEDGE_EMOTION',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    tags: ['vulnerability_arc', 'samuel_arc', 'emotional_core']
  },
  {
    nodeId: 'samuel_vulnerability_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Every day I wonder if I chose right. Every traveler that finds their path here... I tell myself that's the answer.\n\nBut late nights, when the station's quiet? I hear her voice in the echo. Askin' why the people who needed me most weren't the ones in front of me.\n\nYou're the first person I've told that to. The station needed a conductor. But conductors still bleed.",
        emotion: 'vulnerable_resolved',
        variation_id: 'reflection_v1',
        // E2-CHALLENGE: Opportunity to challenge his self-blame about Dorothy
        interrupt: {
          duration: 3500,
          type: 'challenge',
          action: 'Challenge that guilt',
          targetNodeId: 'samuel_challenge_accepted',
          consequence: {
            characterId: 'samuel',
            trustChange: 2,
            addKnowledgeFlags: ['player_challenged_samuel_guilt']
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'samuel_arc']
  },

  // ============= CHALLENGE INTERRUPT TARGET =============
  {
    nodeId: 'samuel_challenge_accepted',
    speaker: 'Samuel Washington',
    content: [{
      text: "Wait. You pushed back on that.\n\n'The people who needed me most weren't the ones in front of me.'\n\nI've carried that for years. Like Dorothy needed me more than the travelers. But you heard something I didn't.\n\nMaybe... maybe the choice wasn't between her and them. Maybe it was between the person I was and the person I needed to become.",
      emotion: 'breakthrough',
      variation_id: 'challenge_accepted_v1',
      voiceVariations: {
        helping: "Wait. You challenged that.\n\nYou heard me blaming myself for choosing service over one person. But maybe that's not the right frame.\n\nMaybe Dorothy needed someone I couldn't be while staying the same. Maybe the station called the person I was becoming.",
        analytical: "Wait. You caught the logic error.\n\n'People who needed me most' - I assumed Dorothy needed me more than thousands of travelers. But need isn't a zero-sum equation.\n\nMaybe the choice was between comfort and calling. Not between love and duty.",
        building: "Wait. You're challenging the foundation I built that guilt on.\n\nI told myself I chose the station over Dorothy. But you see it differently.\n\nMaybe I chose growth over stasis. And maybe that's not betrayal.",
        exploring: "Wait. You questioned the story I've been telling.\n\nI framed it as choosing strangers over family. But you're seeing other angles.\n\nMaybe the real choice was between who I was and who I could be.",
        patience: "Wait. You didn't let me hide behind that guilt.\n\nI've been carrying it like penance. But you see something else.\n\nMaybe some choices aren't about right and wrong. Maybe they're about becoming."
      }
    }],
    choices: [
      {
        choiceId: 'challenge_calling',
        text: "You answered a calling. That doesn't make you wrong about Dorothy.",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_both',
        text: "You couldn't be both people. The station needed who you became.",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_patience',
        text: "[Let the realization settle]",
        nextNodeId: 'samuel_pause_after_backstory',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    tags: ['samuel_arc', 'challenge_interrupt', 'breakthrough']
  },

  // ============= MYSTERY REVEAL: Letter Sender (Trust 8) =============
  // "The truth about the letter that brought you here"
  {
    nodeId: 'samuel_letter_reveal',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You've been patient with me. More patient than most folks ever been. I reckon it's time I told you something.\n\nThat letter you got. The one that brought you here. The handwriting you couldn't quite place.",
        emotion: 'confessional',
        variation_id: 'letter_reveal_v1',
        microAction: 'He pulls a worn envelope from his vest pocket.',
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 8 },
      mysteries: { letterSender: 'investigating' }
    },
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['letter_sender_known']
      },
      // MYSTERY PROGRESSION: Letter sender revealed at trust 8
      {
        mysteryChanges: { letterSender: 'samuel_knows' }
      }
    ],
    choices: [
      {
        choiceId: 'letter_you_wrote_it',
        text: "You wrote it. Didn't you?",
        nextNodeId: 'samuel_letter_confession',
        pattern: 'analytical',
        skills: ['criticalThinking', 'observation'],
        archetype: 'MAKE_OBSERVATION'
      },
      {
        choiceId: 'letter_wait_patiently',
        text: "[Wait for him to continue]",
        nextNodeId: 'samuel_letter_confession',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        archetype: 'STAY_SILENT',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'letter_why_now',
        text: "Why tell me now?",
        nextNodeId: 'samuel_letter_confession',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['mystery_reveal', 'letter_sender', 'samuel_arc']
  },
  {
    nodeId: 'samuel_letter_confession',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station... it knows things. Knows when someone's ready. Knows when someone needs to be here.\n\nI don't write the letters. But I know who does. And it ain't any person you'd recognize.\n\nThis place called you here. Same way it called me, all those years ago. Some journeys choose their travelers.",
        emotion: 'mysterious_reverent',
        variation_id: 'letter_confession_v1',
        richEffectContext: 'thinking'
      }
    ],
    onEnter: [
      {
        mysteryChanges: { stationNature: 'sensing' }
      }
    ],
    choices: [
      {
        choiceId: 'station_alive',
        text: "The station is... alive?",
        nextNodeId: 'samuel_beat_after_station_called',
        pattern: 'exploring',
        skills: ['creativity', 'criticalThinking'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'station_accept',
        text: "I think I understand. Some things don't need explaining.",
        nextNodeId: 'samuel_beat_after_station_called',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ],
    tags: ['mystery_reveal', 'station_nature', 'samuel_arc']
  },

  // ============= BEAT: After Station Called You =============
  {
    nodeId: 'samuel_beat_after_station_called',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Some truths are bigger than words, aren't they? The station chose you. And you chose to answer.\n\n[He looks toward the platforms]\n\nThere are others here tonight who were also called.",
        emotion: 'knowing',
        variation_id: 'beat_after_station_called_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  // ============= PAUSE: After Backstory Revelation (Breathing Room) =============
  {
    nodeId: 'samuel_pause_after_backstory',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Long time ago now. But some things stick with you, y'know?",
        emotion: 'thoughtful',
        variation_id: 'pause_backstory_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_continue_after_backstory',
        text: "(Continue)",
        nextNodeId: 'samuel_purpose_found',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'samuel_arc']
  },

  {
    nodeId: 'samuel_purpose_found',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I wanted to help folks figure out their own path, y'know? Not hand 'em answers - that never works. But help 'em find the right questions? That I can do.\n\nThat's why I'm here. This station sits right between what Birmingham was and what it's still becomin'.",
        emotion: 'warm',
        variation_id: 'purpose_v1_combined',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "I wanted to help folks figure out their own path. Not hand 'em answers.that never works. But help 'em find the right questions?\n\nYou understand that, don't you? It's why you listen the way you do.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'beautiful',
        text: "That's a beautiful purpose.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_for_my_blueprint',
        text: "I'm ready to find my blueprint.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'how_did_you_find_station',
        text: "How did you find the station?",
        nextNodeId: 'samuel_traveler_origin',
        pattern: 'exploring',
        skills: ['communication', 'creativity'],
        visibleCondition: {
          trust: { min: 5 }
        },
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_purpose']
      }
    ]
  },
  {
    nodeId: 'samuel_purpose_found_3',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Been doin' this a while now. Seen folks from all over - Five Points, Bessemer, Homewood, you name it. Different backgrounds, different clothes, but honestly? Same questions underneath it all.",
        emotion: 'warm',
        variation_id: 'purpose_v1_part3'
      }
    ],
    choices: [
      {
        choiceId: 'beautiful_3',
        text: "That's a beautiful purpose.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_for_my_blueprint_3',
        text: "I'm ready to find my blueprint.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'how_did_you_find_station_3',
        text: "How did you find the station?",
        nextNodeId: 'samuel_traveler_origin',
        pattern: 'exploring',
        skills: ['communication', 'creativity'],
        visibleCondition: {
          trust: { min: 5 }
        },
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // ============= SAMUEL'S TRAVELER ORIGIN (High Trust - Split for Chat Pacing) =============
  {
    nodeId: 'samuel_traveler_origin',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Huh. Most folks just wanna know about the platforms. You asked about me.\n\nAlright. Since you took the time... I'll tell you somethin' I don't share much.\n\nI was standin' where you are. Thirty-five years ago. Got the same letter. Had to make the same choice.",
        emotion: 'vulnerable_opening',
        variation_id: 'traveler_origin_v1',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "Huh. Most folks rush to the platforms. You asked about me.\n\nYou take your time with people. That's who you are.\n\nAlright. Since you earned it... I was standin' where you are. Thirty-five years ago.", altEmotion: 'grateful' },
          { pattern: 'helping', minLevel: 4, altText: "Huh. Most folks just wanna know about the platforms. You asked about me.\n\nYou care about people. Really care. I can tell.\n\nI was standin' where you are. Thirty-five years ago.", altEmotion: 'warm' }
        ]
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'samuel_origin_curious',
        text: "What was your crossroads?",
        nextNodeId: 'samuel_origin_choice',
        pattern: 'exploring',
        skills: ['communication'],
        archetype: 'EXPRESS_CURIOSITY'
      },
      {
        choiceId: 'samuel_origin_listen',
        text: "[Listen]",
        nextNodeId: 'samuel_origin_choice',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        archetype: 'STAY_SILENT'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_samuel_was_traveler']
      }
    ],
    tags: ['backstory', 'fridge_logic_fix', 'samuel_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  {
    nodeId: 'samuel_origin_choice',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "VP of Engineering at Southern Company. Corner office downtown, nice view of the Regions Tower. Or stay technical - keep my hands in the work, keep buildin' the grid that powers every light from Irondale to Hoover.\n\nBig money and a fancy title. Or doin' what I actually loved.",
        emotion: 'reflective',
        variation_id: 'origin_choice_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "VP of Engineering. Corner office. Or stay technical.keep my hands in the work.\n\nYou build things. You understand that choice. The difference between managing builders and being one.\n\nBig money and a fancy title. Or doin' what I actually loved.", altEmotion: 'reflective' },
          { pattern: 'exploring', minLevel: 4, altText: "VP of Engineering. Or stay technical.keep buildin' the grid that powers Birmingham.\n\nYou're curious about paths not taken, aren't you? That's the right question.\n\nBig money. Or doin' what I actually loved.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'samuel_which_train',
        text: "Which did you choose?",
        nextNodeId: 'samuel_origin_wrong_train',
        pattern: 'analytical',
        skills: ['communication']
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  {
    nodeId: 'samuel_origin_wrong_train',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Management. Twenty years of meetin's about meetin's.\n\nEvery promotion pushed me further from why I got into engineerin' in the first place.",
        emotion: 'regretful',
        variation_id: 'wrong_train_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_what_changed',
        text: "What made you realize?",
        nextNodeId: 'samuel_origin_daughter_moment',
        pattern: 'exploring',
        skills: ['communication'],
        archetype: 'ASK_FOR_DETAILS'
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  {
    nodeId: 'samuel_origin_daughter_moment',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "My daughter. Nineteen, goin' through the same thing I went through.\n\nBrought her here. Watched her face when she figured out her path. The relief in her eyes...",
        emotion: 'bittersweet',
        variation_id: 'daughter_moment_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_realization',
        text: "And you realized...",
        nextNodeId: 'samuel_origin_keeper_choice',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'ask_about_daughter',
        text: "Where is she now?",
        nextNodeId: 'samuel_daughter_path',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  {
    nodeId: 'samuel_origin_keeper_choice',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Hit me like a ton of bricks. I'd been on the wrong path for twenty years.\n\nCame back through here. Made a different choice this time.\n\nDecided to stay. Help folks avoid makin' the same mistakes I did.",
        emotion: 'purposeful',
        variation_id: 'keeper_choice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'samuel_courage_recognition',
        text: "That takes real courage.",
        nextNodeId: 'samuel_daughter_path',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        archetype: 'ACKNOWLEDGE_EMOTION',
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_about_daughter_after',
        text: "Where is your daughter now?",
        nextNodeId: 'samuel_daughter_path',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_about_letters',
        text: "The letters... do you send them?",
        nextNodeId: 'samuel_letter_system',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  // ============= SAMUEL'S DAUGHTER (Emotional Anchor) =============
  {
    nodeId: 'samuel_daughter_path',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Biomedical engineer at the CDC now. Designs diagnostic systems - saves lives, really.\n\nCalls me every Sunday. Still thanks me for bringin' her here.\n\nI wanted her to be a lawyer, honestly. Good money, stable. But she found her own way.\n\nWatchin' her figure that out... that's when I knew what I was supposed to do.",
        emotion: 'paternal_pride',
        variation_id: 'daughter_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_purpose',
        text: "So you stayed to give others what you gave her.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_about_letters_from_daughter',
        text: "And the letters people receive... you send those?",
        nextNodeId: 'samuel_letter_system',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_about_daughter']
      }
    ],
    tags: ['backstory', 'samuel_arc']
  },

  // ============= LETTER SYSTEM EXPLANATION (Fridge Logic Fix) =============
  {
    nodeId: 'samuel_letter_system',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I write one every night. Name just... comes to me, y'know? Can't really explain it.\n\nLike how you knew somebody here needed to hear what you had to say. Station has a way of connectin' people.\n\nAfter thirty-five years, you stop questionin' it and just go with it.",
        emotion: 'mystical_acceptance',
        variation_id: 'letter_system_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'understand_letters',
        text: "So the station chose you to guide others.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_letter_system']
      }
    ],
    tags: ['fridge_logic_fix', 'samuel_arc']
  },

  // ============= ORB INTRODUCTION (First-time gift from Samuel) =============
  // This scene triggers only once - when player first reaches the hub
  // Samuel narratively introduces orbs as "echoes of who you're becoming"
  {
    nodeId: 'samuel_orb_introduction',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Hey, before you head off... here, take this.",
        emotion: 'warm',
        variation_id: 'orb_intro_v1',
        interaction: 'bloom'
      }
    ],
    choices: [
      {
        choiceId: 'orb_what_is_it',
        text: "What is it?",
        nextNodeId: 'samuel_orb_explanation',
        pattern: 'exploring'
        // No visibleCondition - always available as primary option
      },
      {
        choiceId: 'orb_accept_quietly',
        text: "(Accept it)",
        nextNodeId: 'samuel_orb_explanation',
        pattern: 'patience'
        // No visibleCondition - always available
      }
    ],
    tags: ['orb_introduction', 'tutorial', 'samuel_arc'],
    metadata: {
      sessionBoundary: true  // Session 2: Deeper engagement
    }
  },
  {
    nodeId: 'samuel_orb_explanation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Noticed those patterns already, didn't you? <bloom>Curious things</bloom>, aren't they?\n\nStation's got a way of rememberin'. Every choice you make leaves an echo. Those orbs you're seein'? They're mirrors.not what you've done, but <ripple>who you're becomin'</ripple>.",
        emotion: 'knowing',
        variation_id: 'orb_explanation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_understand',
        text: "I think I understand.",
        nextNodeId: 'samuel_orb_gift_complete',
        pattern: 'patience'
      },
      {
        choiceId: 'orb_ask_more',
        text: "How does it work?",
        nextNodeId: 'samuel_orb_mechanics',
        pattern: 'analytical'
      }
    ],
    tags: ['orb_introduction', 'tutorial']
  },
  {
    nodeId: 'samuel_orb_mechanics',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You'll start seein' five patterns show up. <shake>Analytical folks</shake> who see through problems. <nod>Patient ones</nod> who know when to wait. <bloom>Explorers</bloom> who gotta find new paths. People who <ripple>help others</ripple> find their way. And <big>builders</big> - turn ideas into real things.\n\nJust pay attention. They'll tell you somethin' about yourself.",
        emotion: 'warm',
        variation_id: 'orb_mechanics_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_mechanics_continue',
        text: "I'll pay attention.",
        nextNodeId: 'samuel_orb_gift_complete',
        pattern: 'patience'
      }
    ],
    tags: ['orb_introduction', 'tutorial']
  },
  {
    nodeId: 'samuel_orb_gift_complete',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Good deal. Your journal'll show you what the station remembers. Check it whenever you want.\n\nAlright. Let's find you somebody to talk to.",
        emotion: 'warm',
        variation_id: 'orb_gift_complete_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_to_hub',
        text: "[Continue]",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['orbs_introduced']
      }
    ],
    tags: ['orb_introduction', 'tutorial']
  },

  // ============= HUB: INITIAL (Conversational 3-step character routing) =============
  // Step 1: Broad category selection (3 choices - best practice compliant)
  {
    nodeId: 'samuel_hub_initial',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "{{knows_backstory:Like I was sayin', I spent years buildin' other people's systems. These folks here? They're tryin' to build their own.|{{trust>2:Good to see you gettin' comfortable.|Got a few travelers tonight. Each one at their own crossroads.}}}}\n\nSomebody here you should meet. But first - what's pullin' at you?",
        // samuel seems willing to share smeothing; // a distinant memory sits/// -- to me this is improtant metadata for future; but should not be in dialogue driven version for now
        emotion: 'curious',
        variation_id: 'hub_initial_v1',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "{{knows_backstory:Like I was sayin', I spent years buildin' other people's systems. These folks? They're tryin' to build their own.|Got a few travelers tonight. Each one at their own crossroads.}}\n\nYou think things through, I can tell. See it in how you move through this place. Somebody here might appreciate that.",
            altEmotion: 'knowing'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "{{knows_backstory:Like I was sayin', I spent years buildin' other people's systems. These folks? They're tryin' to build their own.|Got a few travelers tonight. Each one at their own crossroads.}}\n\nYou lead with care. I've seen how you listen to people. There's someone here who needs that.",
            altEmotion: 'warm'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "{{knows_backstory:Like I was sayin', I spent years buildin' other people's systems. These folks? They're tryin' to build their own.|Got a few travelers tonight. Each one at their own crossroads.}}\n\nYou're a builder. I can see it - way you look at problems like they're possibilities. Someone here's got that same fire.",
            altEmotion: 'knowing'
          }
        ]
      }
    ],
    requiredState: {
      lacksGlobalFlags: ['met_maya', 'met_devon', 'met_jordan']
    },
    choices: [
      {
        choiceId: 'hub_category_heart',
        text: "I want to help people, but I'm not sure how.",
        nextNodeId: 'samuel_hub_heart_travelers',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          addKnowledgeFlags: ['player_values_helping']
        }
      },
      {
        choiceId: 'hub_category_mind',
        text: "I want to understand how things work. Really work.",
        nextNodeId: 'samuel_hub_mind_travelers',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          addKnowledgeFlags: ['player_values_logic']
        }
      },
      {
        choiceId: 'hub_category_hands',
        text: "I want to build something real.",
        nextNodeId: 'samuel_hub_hands_travelers',
        pattern: 'building',
        skills: ['creativity', 'communication'],
        consequence: {
          characterId: 'samuel',
          addKnowledgeFlags: ['player_values_building']
        }
      }
    ]
  },

  // Step 2a: Heart travelers (helping-focused)
  {
    nodeId: 'samuel_hub_heart_travelers',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Folks who lead with care... that's rarer than you'd think. Got two travelers here who might get where you're comin' from.\n\nMaya Chen's over on Platform 1. Pre-med at UAB. Her parents gave up everything for her education, but she's been buildin' robots on the side. Secret project.\n\nOr Marcus, down by Platform 2. Works the ICU - runs all the machines keepin' people alive. But he's wonderin' if bein' good at somethin' means it's really his thing.",
        emotion: 'knowing',
        variation_id: 'hub_heart_v1'
      }
    ],
    metadata: {
      sessionBoundary: true  // Session 1 complete: Samuel intro → Gateway to other characters
    },
    choices: [
      {
        choiceId: 'meet_maya_from_heart',
        text: "Tell me more about Maya.",
        nextNodeId: 'samuel_discovers_helping',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'meet_marcus_from_heart',
        text: "I'd like to meet Marcus.",
        nextNodeId: 'samuel_discovers_marcus',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'hub_heart_other',
        text: "[Consider other paths]",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience'
      }
    ]
  },

  // Step 2b: Mind travelers (analytical-focused)
  {
    nodeId: 'samuel_hub_mind_travelers',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Folks who see patterns others miss... got a few of those here tonight.\n\nDevon Kumar's in the coffee shop. Systems engineer - actually built a decision tree to figure out how to talk to his grieving dad.\n\nKai's over in the training office. Instructional designer, fightin' corporate safety theater after somebody got hurt on the job.\n\nAlex runs workshops on Platform 8. Used to teach bootcamp - 'six weeks to six figures' kinda stuff. Now they're questionin' everything they taught.\n\nAnd Rohan... he's down in the basement. Questionin' the foundations. Wonderin' if understandin' how things break teaches you how they should work.",
        emotion: 'knowing',
        variation_id: 'hub_mind_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_devon_from_mind',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_discovers_building',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'meet_kai_from_mind',
        text: "I want to hear Kai's story.",
        nextNodeId: 'samuel_discovers_kai',
        pattern: 'analytical',
        skills: ['strategicThinking']
      },
      {
        choiceId: 'meet_alex_from_mind',
        text: "What happened with Alex?",
        nextNodeId: 'samuel_discovers_alex',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'meet_rohan_from_mind',
        text: "Rohan sounds interesting.",
        nextNodeId: 'samuel_discovers_rohan',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  // Step 2c: Hands travelers (building-focused)
  {
    nodeId: 'samuel_hub_hands_travelers',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Builders carry a different kind of weight. They see what could be.\n\nJordan's been through seven careers, still figurin' it out. Wonders if maybe the winding path IS the path.\n\nTess is a school counselor with this wild idea - wants to prove that hikin' the Appalachian Trail teaches more than AP Calculus.\n\nSilas farms hydroponic basil out past Trussville. His sensors say everything's fine. His plants say otherwise.\n\nAnd Yaquin - dental assistant turned online educator. Knows stuff the textbooks get wrong.",
        emotion: 'knowing',
        variation_id: 'hub_hands_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_jordan_from_hands',
        text: "Tell me about Jordan.",
        nextNodeId: 'samuel_discovers_exploring',
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'meet_tess_from_hands',
        text: "Tess's dream sounds bold.",
        nextNodeId: 'samuel_discovers_tess',
        pattern: 'building',
        skills: ['leadership']
      },
      {
        choiceId: 'meet_silas_from_hands',
        text: "What's happening with Silas?",
        nextNodeId: 'samuel_discovers_silas',
        pattern: 'building',
        skills: ['sustainability']
      }
    ]
  },

  // Legacy hub fallback for "not sure" responses
  {
    nodeId: 'samuel_hub_fallback_legacy',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Hey, that's honest. Not knowin' is the first step to figurin' it out.\n\nWhy don't you just wander a bit? See who catches your attention. Sometimes the right conversation finds you.",
        emotion: 'warm',
        variation_id: 'hub_fallback_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hub_fallback_explore',
        text: "I'll look around.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  },

  // ============= DISCOVERY PATH: HELPING → MAYA =============
  {
    nodeId: 'samuel_discovers_helping',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Yeah, that's a tough one. When your heart knows what it wants but the path to get there feels... complicated.",
        emotion: 'knowing',
        variation_id: 'discovers_helping_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_helping_discover',
        text: "[Continue]",
        nextNodeId: 'samuel_discovers_helping_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },
  {
    nodeId: 'samuel_discovers_helping_2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "There's somebody on Platform 1 who gets that. Maya Chen - super smart pre-med student at UAB. Her parents run a Vietnamese place over on 3rd Avenue. Saved every penny they had to get their daughter into medical school.",
        emotion: 'knowing',
        variation_id: 'discovers_helping_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_helping_discover_2',
        text: "[Continue]",
        nextNodeId: 'samuel_discovers_helping_3',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },
  {
    nodeId: 'samuel_discovers_helping_3',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's supposed to become a doctor, and honestly she's good enough. But between what she's 'supposed' to do and what she actually dreams about... that gap is tearin' her up inside.",
        emotion: 'knowing',
        variation_id: 'discovers_helping_v1_part3'
      }
    ],
    choices: [
      {
        choiceId: 'meet_marcus',
        text: 'I need to meet him.',
        nextNodeId: 'marcus_intro',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'ask_about_others',
        text: "Who else is here tonight?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      }
    ]
  },

  // ============= DISCOVERY PATH: BUILDING → DEVON =============
  {
    nodeId: 'samuel_discovers_building',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The engineer's problem, y'know? You can map out every system, but then life throws somethin' at you that doesn't fit the flowchart.\n\nDevon Kumar's on Platform 3. UAB engineering student, got recruited from the robotics lab in the old Oxmoor Center. His mom's been gone two years now. He actually built a decision tree to try and help his grievin' dad. Didn't work out.\n\nNow he's tryin' to debug human connection.",
        emotion: 'understanding',
        variation_id: 'discovers_building_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_devon',
        text: "That sounds... familiar. I'll find him.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['problemSolving'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'devon_empathy',
        text: "He must feel so lost. Trying to help but not knowing how.",
        nextNodeId: 'devon_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'ask_about_others',
        text: "Are there other travelers here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: EXPLORING → JORDAN =============
  {
    nodeId: 'samuel_discovers_exploring',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Got somebody you should meet.\n\nSeven jobs in twelve years - Jordan Packard. She's down at Railroad Park, preppin' for a mentorship panel at Innovation Depot.\n\nThirty students from Birmingham-Southern gonna hear her story tomorrow. She's scared they'll see chaos instead of evolution. Got impostor syndrome while she's literally the expert.\n\nHer question ain't 'what should I become?' It's 'how do I own what I've been?'",
        emotion: 'amused_empathetic',
        variation_id: 'discovers_exploring_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_jordan',
        text: "I need to hear her story.",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['communication', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'ask_about_others',
        text: "Tell me about the others first.",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'patience',
        skills: ['communication', 'collaboration', 'adaptability']
      }
    ]
  },

  // ============= DISCOVERY PATH: EDUCATION → TESS =============
  {
    nodeId: 'samuel_discovers_tess',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The system works for some folks, but it fails a lot of 'em. Tess is over at the Pizitz Food Hall, sketchbook out, coffee gone cold.\n\nShe's a career counselor at Hoover High who's realizin' she can't counsel students into a broken world. Gotta build a new one.\n\nShe's tryin' to start a school in the old Woodlawn building - one where hikin' Oak Mountain counts as senior year physics.",
        emotion: 'intrigued',
        variation_id: 'discovers_tess_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_tess',
        text: "That sounds radical. I want to meet her.",
        nextNodeId: 'tess_introduction', // Links to new graph
        pattern: 'building',
        skills: ['criticalThinking'],
        consequence: {
          addGlobalFlags: ['met_tess']
        }
      },
      {
        choiceId: 'ask_about_others_tess',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: CREATOR → YAQUIN =============
  {
    nodeId: 'samuel_discovers_yaquin',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 5's a bit louder. Yaquin's over there - dental assistant at Aspen Dental on Highway 280, frustrated with the outdated textbooks.\n\nHe's figured out he knows more than some professors at UAB's dental school, but he doesn't know how to build a school. He's right on the edge of inventin' a whole new way to teach.",
        emotion: 'amused_respect',
        variation_id: 'discovers_yaquin_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_yaquin',
        text: "I want to help him build that.",
        nextNodeId: 'yaquin_introduction', // Links to new graph
        pattern: 'building',
        skills: ['creativity'],
        consequence: {
          addGlobalFlags: ['met_yaquin']
        }
      },
      {
        choiceId: 'ask_about_others_yaquin',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: CORPORATE → KAI =============
  {
    nodeId: 'samuel_discovers_kai',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 6. Glass walls, cold lightin'. That's where Kai is.\n\nInstructional Architect at Protective Life downtown - you know, the big tower on Richard Arrington. They know exactly how people learn, but they're gettin' paid to build compliance checklists.\n\nThey're holdin' a match, tryin' to decide whether to burn the whole rulebook.",
        emotion: 'intrigued_respect',
        variation_id: 'discovers_kai_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_kai',
        text: "I want to help them light it.",
        nextNodeId: 'kai_introduction', // Links to new graph
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          addGlobalFlags: ['met_kai']
        }
      },
      {
        choiceId: 'ask_about_others_kai',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: CREDENTIAL SKEPTICISM → ALEX =============
  {
    nodeId: 'samuel_discovers_alex',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The Learning Loop - Platform 8, west wing. That's where Alex is.\n\nUsed to run the bootcamp circuit. Taught thousands how to code. 'Six weeks to a six-figure salary' - they believed it too, once upon a time.\n\nNow they run free workshops for folks who already tried everything else. Askin' hard questions about what credentials actually mean.",
        emotion: 'knowing',
        variation_id: 'discovers_alex_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_alex',
        text: "I want to understand what they learned.",
        nextNodeId: 'alex_introduction',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          addGlobalFlags: ['met_alex']
        }
      },
      {
        choiceId: 'ask_about_others_alex',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: INFRASTRUCTURE → ROHAN =============
  {
    nodeId: 'samuel_discovers_rohan',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 7. The sub-basement. Rohan's down there.\n\nSite Reliability Engineer at Regions Bank - main operations center out in Riverchase. Hasn't slept in 30 hours. He's the only one who actually knows how money moves through Alabama.\n\nEverybody else is usin' AI to write code they don't understand. He's cleanin' up the mess.",
        emotion: 'grim_respect',
        variation_id: 'discovers_rohan_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_rohan',
        text: "I want to see the machine.",
        nextNodeId: 'rohan_introduction', // Links to new graph
        pattern: 'analytical',
        skills: ['systemsThinking', 'technicalLiteracy'],
        consequence: {
          addGlobalFlags: ['met_rohan']
        }
      },
      {
        choiceId: 'ask_about_others_rohan',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: GROUNDED TECH → SILAS =============
  {
    nodeId: 'samuel_discovers_silas',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 8. The Greenhouse. Silas is over there.\n\nUsed to be a Cloud Architect at Amazon - worked remote from his place in Avondale. Now he uses drones to monitor soil microbiomes on a farm out past Trussville.\n\nFigured out a farm is basically a server cluster that breathes. He's debuggin' nature now.",
        emotion: 'warm_respect',
        variation_id: 'discovers_silas_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_silas',
        text: "I want to get my hands dirty.",
        nextNodeId: 'silas_introduction', // Links to new graph
        pattern: 'building',
        skills: ['sustainability'],
        consequence: {
          addGlobalFlags: ['met_silas']
        }
      },
      {
        choiceId: 'ask_about_others_silas',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= DISCOVERY PATH: HEALTHCARE TECH → MARCUS =============
  {
    nodeId: 'samuel_discovers_marcus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 4, near the Medical Bay. That's Marcus.\n\nCVICU Nurse at UAB Hospital - the kind who keeps people alive through those long night shifts. But he's realizin' the machines he uses are just as important as the medicine.\n\nStandin' there like he's still on duty. Carries the weight of every patient with him. Go easy.",
        emotion: 'respectful',
        variation_id: 'discovers_marcus_v1'
      }
    ],
    choices: [
      {
        choiceId: 'meet_marcus',
        text: "I understand that weight. I'll talk to him.",
        nextNodeId: 'marcus_intro',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          addGlobalFlags: ['met_marcus']
        }
      },
      {
        choiceId: 'ask_about_others_marcus',
        text: "Who else is here?",
        nextNodeId: 'samuel_other_travelers',
        pattern: 'exploring',
        skills: ['communication']
      }
    ]
  },

  // ============= FALLBACK: UNSURE → GUIDED CHOICE =============
  {
    nodeId: 'samuel_hub_fallback',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "{{trust>3:Hey, honesty's the only thing that matters here.|That's honest. That's why you showed up.}}\n\nHere's who's around tonight:\n\n**Maya Chen** - Platform 1. Pre-med student stuck between expectations and dreams.\n\n**Devon Kumar** - Platform 3. Engineer learnin' logic ain't always enough.\n\n**Jordan Packard** - Railroad Park. Seven jobs. Still figurin' it out.\n\n**Marcus** - Platform 4. CVICU nurse where machines meet medicine.\n\n**Tess** - Pizitz Food Hall. Buildin' a school that counts hikin' as physics.\n\n**Yaquin** - Platform 5. Teachin' what universities won't.\n\n**Kai** - Platform 6. Tryin' to innovate inside rigid systems.\n\n**Rohan** - Platform 7. Guardin' infrastructure that matters.\n\n**Silas** - Platform 8. Debuggin' nature itself.\n\nWho speaks to you?",
        emotion: 'gentle_guide',
        variation_id: 'fallback_v2'
      }
    ],
    choices: [
      {
        choiceId: 'choose_maya',
        text: "Maya - the helping but uncertain path.",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'choose_devon',
        text: "Devon - logic meeting its limits.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['criticalThinking', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'choose_jordan',
        text: "Jordan - owning a non-linear journey.",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['adaptability', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'choose_marcus',
        text: "Marcus - where healthcare meets technology.",
        nextNodeId: 'samuel_discovers_marcus',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'technicalLiteracy']
      },
      {
        choiceId: 'choose_tess',
        text: "Tess - reimagining education.",
        nextNodeId: 'samuel_discovers_tess',
        pattern: 'building',
        skills: ['creativity', 'leadership']
      },
      {
        choiceId: 'choose_yaquin',
        text: "Yaquin - teaching outside the system.",
        nextNodeId: 'samuel_discovers_yaquin',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      },
      {
        choiceId: 'choose_kai',
        text: "Kai - innovation within constraints.",
        nextNodeId: 'samuel_discovers_kai',
        pattern: 'analytical',
        skills: ['strategicThinking', 'resilience']
      },
      {
        choiceId: 'choose_rohan',
        text: "Rohan - the infrastructure guardian.",
        nextNodeId: 'samuel_discovers_rohan',
        pattern: 'analytical',
        skills: ['criticalThinking', 'technicalLiteracy']
      },
      {
        choiceId: 'choose_silas',
        text: "Silas - debugging nature.",
        nextNodeId: 'samuel_discovers_silas',
        pattern: 'building',
        skills: ['sustainability', 'systemsThinking']
      }
    ]
  },

  // ============= OTHER TRAVELERS (Optional exploration before committing) =============
  {
    nodeId: 'samuel_other_travelers',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Alright, here's everybody:\n\n**Maya Chen** - Platform 1. Pre-med brilliance, secret robotics dreams.\n\n**Devon Kumar** - Platform 3. Engineer tryin' to debug grief.\n\n**Jordan Packard** - Railroad Park. Seven careers. Still askin' the same question.\n\n**Marcus** - Platform 4. CVICU nurse. Where machines meet medicine.\n\n**Tess** - Pizitz Food Hall. Buildin' a whole new kind of school.\n\n**Yaquin** - Platform 5. Teachin' outside the system.\n\n**Kai** - Platform 6. Innovation within constraints.\n\n**Rohan** - Platform 7. Infrastructure guardian.\n\n**Silas** - Platform 8. Debuggin' nature.\n\n**Alex** - Platform 9. Supply chain. Keepin' things movin'.\n\n**Asha** - Platform 10. Mediator. Turns conflict into understanding.\n\n**Elena** - Platform 11. Archivist. What patterns hide in the data.\n\n**Grace** - Platform 12. Healthcare aide. Care that can't be automated.\n\n**Lira** - Platform 13. Sound designer. Where tech meets art.\n\n**Zara** - Platform 14. Data ethics. The questions no one's askin'.\n\nWho you wanna meet?",
        emotion: 'patient_informative',
        variation_id: 'other_travelers_v2'
      }
    ],
    choices: [
      {
        choiceId: 'meet_maya_alt',
        text: "Maya on Platform 1.",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'meet_devon_alt',
        text: "Devon on Platform 3.",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['criticalThinking', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'meet_jordan_alt',
        text: "Jordan at Railroad Park.",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['adaptability', 'collaboration'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'meet_marcus_alt',
        text: "Marcus on Platform 4.",
        nextNodeId: 'samuel_discovers_marcus',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'technicalLiteracy']
      },
      {
        choiceId: 'meet_tess_alt',
        text: "Tess at Pizitz Food Hall.",
        nextNodeId: 'samuel_discovers_tess',
        pattern: 'building',
        skills: ['creativity', 'leadership']
      },
      {
        choiceId: 'meet_yaquin_alt',
        text: "Yaquin on Platform 5.",
        nextNodeId: 'samuel_discovers_yaquin',
        pattern: 'building',
        skills: ['leadership', 'creativity']
      },
      {
        choiceId: 'meet_kai_alt',
        text: "Kai on Platform 6.",
        nextNodeId: 'samuel_discovers_kai',
        pattern: 'analytical',
        skills: ['strategicThinking', 'resilience']
      },
      {
        choiceId: 'meet_rohan_alt',
        text: "Rohan on Platform 7.",
        nextNodeId: 'samuel_discovers_rohan',
        pattern: 'analytical',
        skills: ['criticalThinking', 'technicalLiteracy']
      },
      {
        choiceId: 'meet_silas_alt',
        text: "Silas on Platform 8.",
        nextNodeId: 'samuel_discovers_silas',
        pattern: 'building',
        skills: ['sustainability', 'systemsThinking']
      },
      {
        choiceId: 'meet_alex_alt',
        text: "Alex on Platform 9.",
        nextNodeId: 'alex_introduction',
        pattern: 'building',
        skills: ['systemsThinking', 'pragmatism'],
        consequence: {
          addGlobalFlags: ['met_alex']
        }
      },
      {
        choiceId: 'meet_asha_alt',
        text: "Asha on Platform 10.",
        nextNodeId: 'asha_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          addGlobalFlags: ['met_asha']
        }
      },
      {
        choiceId: 'meet_elena_alt',
        text: "Elena on Platform 11.",
        nextNodeId: 'elena_intro',
        pattern: 'analytical',
        skills: ['informationLiteracy', 'criticalThinking'],
        consequence: {
          addGlobalFlags: ['met_elena']
        }
      },
      {
        choiceId: 'meet_grace_alt',
        text: "Grace on Platform 12.",
        nextNodeId: 'grace_introduction',
        pattern: 'helping',
        skills: ['empathy', 'patience'],
        consequence: {
          addGlobalFlags: ['met_grace']
        }
      },
      {
        choiceId: 'meet_lira_alt',
        text: "Lira on Platform 13.",
        nextNodeId: 'lira_introduction',
        pattern: 'exploring',
        skills: ['creativity', 'technicalLiteracy'],
        consequence: {
          addGlobalFlags: ['met_lira']
        }
      },
      {
        choiceId: 'meet_zara_alt',
        text: "Zara on Platform 14.",
        nextNodeId: 'zara_introduction',
        pattern: 'analytical',
        skills: ['criticalThinking', 'fairness'],
        consequence: {
          addGlobalFlags: ['met_zara']
        }
      }
    ]
  },


  // ============= MAYA REFLECTION GATEWAY (First return from Maya) =============
  {
    nodeId: 'samuel_maya_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Hey, welcome back. I can tell that conversation went deep - Maya has that effect on people who really listen to her.\n\nHow you feelin' about what just happened?",
        emotion: 'warm_observant',
        variation_id: 'reflection_gateway_v3_clean'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_maya']
    },
    choices: [
      {
        choiceId: 'hope_i_helped',
        text: "I hope I helped her.",
        nextNodeId: 'samuel_reflect_helped_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'unsure_what_i_did',
        text: "I'm not sure what I actually did.",
        nextNodeId: 'samuel_reflect_unsure_response',
        pattern: 'exploring',
        skills: ['criticalThinking', 'adaptability']
      },
      {
        choiceId: 'skip_reflection',
        text: "She made her own choice.",
        nextNodeId: 'samuel_reflect_on_agency',
        pattern: 'patience',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_maya']
      }
    ]
  },

  // ============= DIVERGENT RESPONSES TO MAYA REFLECTION =============
  {
    nodeId: 'samuel_reflect_helped_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You did. But not the way most people think 'helpin'' works.\n\nYou didn't fix her problem. You made space for her to see options she couldn't see before.\n\nThat helper instinct? Same thing that drives UAB resident advisors and guidance counselors all over Birmingham. Real valuable.",
        emotion: 'affirming',
        variation_id: 'helped_response_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_helped',
        text: "[Continue]",
        nextNodeId: 'samuel_reflect_on_influence_pt2',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_reflect_unsure_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That uncertainty? That's actually wisdom.\n\nMost people walk away from conversations thinkin' they gave great advice. You're askin' what really happened. That's the difference between talkin' at someone and actually connectin'.\n\nYou explored her world instead of mappin' your own onto it.",
        emotion: 'appreciative',
        variation_id: 'unsure_response_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_unsure',
        text: "[Continue]",
        nextNodeId: 'samuel_reflect_on_influence_pt2',
        pattern: 'patience'
      }
    ]
  },

  // ============= REFLECTION: Understanding Influence vs. Agency - Part 1 (Legacy) =============
  {
    nodeId: 'samuel_reflect_on_influence',
    learningObjectives: ['samuel_reflective_observation'],
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You did help her. But not the way most people think 'helpin'' works.\n\nYou didn't fix her problem. You made space for her to see options she couldn't see before.\n\nYou got that helper instinct - same thing that drives UAB resident advisors and guidance counselors all over Birmingham.",
        emotion: 'teaching',
        variation_id: 'influence_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_samuel_influence',
        text: "(Continue)",
        nextNodeId: 'samuel_reflect_on_influence_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel'
      }
    ]
  },

  // ============= REFLECTION: Understanding Influence vs. Agency - Part 2 =============
  {
    nodeId: 'samuel_reflect_on_influence_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Learned somethin' at Southern Company though - best mentors help people find their own answers, not just feel supported.\n\nThese reflection skills you're usin' right now? That's the foundation of counselin', coachin', teachin'. Real careers here in Birmingham that value exactly what you're doin'.",
        emotion: 'teaching',
        variation_id: 'influence_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'what_did_maya_choose',
        text: "What path did she choose?",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['communication', 'creativity']
      },
      {
        choiceId: 'how_do_you_know',
        text: "How do you know I didn't just tell her?",
        nextNodeId: 'samuel_systemic_proof',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'accept_insight',
        text: "That distinction matters.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_reflect_on_agency',
    learningObjectives: ['samuel_abstract_conceptualization'],
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Exactly. She made her own choice. That's the most important thing.\n\nYou understand agency. That's... honestly, that's advanced.\n\nTook me fifteen years to learn I can't engineer people's decisions. We light up the paths. Travelers choose.",
        emotion: 'proud',
        variation_id: 'agency_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_agency_reflection',
        text: "(Continue)",
        nextNodeId: 'samuel_reflect_on_agency_pt2',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_facilitator_skills']
      }
    ]
  },

  {
    nodeId: 'samuel_reflect_on_agency_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Mentors over at Innovation Depot do exactly what you just did - ask questions, hold space, let people discover their own path. That's facilitator instinct. Real professional skill that drives leadership development, organizational psychology, HR careers all across Birmingham.",
        emotion: 'proud',
        variation_id: 'agency_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'what_path_did_she_choose',
        text: "Which path did she choose?",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'is_that_what_you_do',
        text: "Is that what you do here? Be a mirror?",
        nextNodeId: 'samuel_station_keeper_truth',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  // ============= CONTEMPLATION MOMENTS (Optional Depth) =============
  {
    nodeId: 'samuel_station_sees_all',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station doesn't just connect platforms. It connects moments. I saw her at the robotics lab when she was sixteen, sneaking in after her parents thought she was at SAT prep.\n\nShe's always known. You just helped her believe knowing was allowed.",
        emotion: 'mystical_truth',
        variation_id: 'station_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_station_truth',
        text: "[Nod in understanding]",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_patience_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "More than okay. Courageous.\n\nOur world demands you choose fast. Lock in your path before you've walked it.\n\nMaya sitting with uncertainty? That's refusing to let urgency override truth.\n\nNot knowing is honest. The best facilitators hold space for emergence.",
        emotion: 'wise',
        variation_id: 'patience_wisdom_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_patience_wisdom',
        text: "(Continue)",
        nextNodeId: 'samuel_patience_wisdom_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_coaching_skills']
      }
    ]
  },

  {
    nodeId: 'samuel_patience_wisdom_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You just demonstrated a professional competency that career counselors, coaches, and organizational development specialists spend years developing.",
        emotion: 'wise',
        variation_id: 'patience_wisdom_v1_pt2'
      }
    ],
    metadata: {
      sessionBoundary: true  // Session 2 complete: Deeper pattern reflection
    },
    choices: [
      {
        choiceId: 'continue_from_patience',
        text: "That's a different kind of strength.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ["emotionalIntelligence", "communication"],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_systemic_proof',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Because the station remembers. If you'd tried to force an answer, her trust wouldn't have grown. But it did.\n\nTrust is the only map that works here. You didn't find the path by analyzing her file. You found it by building a connection. That's how real exploration happens. Person to person.",
        emotion: 'knowing',
        variation_id: 'systemic_proof_v1'
      }
    ],
    choices: [
      {
        choiceId: 'trust_as_map',
        text: "Connection is the map.",
        nextNodeId: 'samuel_beat_after_connection_map',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // ============= BEAT: After Connection is the Map =============
  {
    nodeId: 'samuel_beat_after_connection_map',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Exactly. Person to person. That's the only navigation that matters.\n\n[He nods toward the platforms]\n\nMore connections waiting to be made.",
        emotion: 'warm',
        variation_id: 'beat_after_connection_map_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_station_keeper_truth',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I don't give directions. I help 'em see what they already know.\n\nSpent twenty-three years followin' other people's blueprints. Now I help people draw their own.\n\nBest guides don't lead. They witness.",
        emotion: 'vulnerable_wisdom',
        variation_id: 'keeper_truth_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'witness_not_lead',
        text: "Witness, not lead.",
        nextNodeId: 'samuel_beat_after_witness',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership'],
        archetype: 'SHOW_UNDERSTANDING',
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  // ============= BEAT: After Witness Not Lead =============
  {
    nodeId: 'samuel_beat_after_witness',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's right. We witness people becoming who they're meant to be. That's the work.\n\n[He looks toward the platforms]\n\nThere are others who need a witness tonight.",
        emotion: 'satisfied',
        variation_id: 'beat_after_witness_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_your_pattern_emerges',
    learningObjectives: ['samuel_active_experimentation'],
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your path? It's being written right now, in how you show up for others.\n\nSome people come to this station knowing exactly what they want to build. Others come to discover their purpose through building others up. You're in the second group. That's not a lesser path - it's often the deeper one.",
        emotion: 'reflective',
        variation_id: 'pattern_emerges_v1'
      }
    ],
    choices: [
      {
        choiceId: 'accept_the_pattern',
        text: "I'm starting to see that.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'but_what_specifically',
        text: "But what does that mean, specifically?",
        nextNodeId: 'samuel_specificity_trap',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_specificity_trap',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "'What exactly should I do?' That question keeps people stuck.\n\nThe pattern's bigger than any one job. You hold space. Ask questions that matter. Meet people in uncertainty.\n\nThose skills work everywhere. The specific form'll come.\n\nTrust the pattern.",
        emotion: 'patient_wisdom',
        variation_id: 'specificity_trap_v1',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'trust_the_pattern',
        text: "Trust the pattern.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_contemplation_offer',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "We can keep talkin' about Maya if you want. There's value in sittin' with an experience.\n\nOr, if you're ready, there's other travelers around. Each one'll show you somethin' different.",
        emotion: 'offering_space',
        variation_id: 'contemplation_offer_v1',
        voiceVariations: {
          patience: "We can keep talkin' about Maya. You understand the value of not rushin' past an experience.\n\nOr, when you're ready, there's other travelers. Each one at their own pace.",
          helping: "We can keep talkin' about Maya if you want. I see you're still holding what she shared.\n\nOr, if you're ready, there's other travelers. Each one needin' something different.",
          analytical: "We can keep processing what happened with Maya. There's patterns worth examining.\n\nOr, if you're ready, there's other travelers. Each one'll add data to what you're learning.",
          exploring: "We can keep talkin' about Maya. Or, if you're ready to see what else is here, there's other travelers.\n\nEach one'll show you somethin' different.",
          building: "We can keep talkin' about Maya. Or, if you're ready to move forward, there's other travelers.\n\nEach one'll help you build understanding of this place."
        }
      }
    ],
    choices: [
      {
        choiceId: 'contemplate_more',
        text: "Tell me more about what you saw.",
        nextNodeId: 'samuel_deep_reflection',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'ready_for_next',
        text: "I'm ready to meet someone else.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      },
      {
        choiceId: 'revisit_maya',
        text: "Can I talk to Maya again?",
        nextNodeId: 'samuel_maya_revisit_guidance',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'collaboration']
      }
    ]
  },

  {
    nodeId: 'samuel_deep_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I saw you listening to what Maya wasn't saying. Most people hear the words - 'I'm pre-med, I have good grades' - and think they understand.\n\nYou heard the weight underneath the words.\n\nThe fear of disappointing her parents. The shame of wanting something different. The loneliness of succeeding at a path that isn't yours.",
        emotion: 'deep_knowing',
        variation_id: 'deep_reflection_v1_pt1',
        voiceVariations: {
          helping: "I saw you listening to what Maya wasn't saying. Most people want to fix.\n\nYou just... held space for her struggle. Let her feel it without rushin' to solve it.\n\nThat's rare. That's the kind of listening that changes people.",
          patience: "I saw you not rushing Maya. Most people hear 'pre-med' and move on.\n\nYou waited. You let the silence do its work.\n\nThat patience - that's what let her say what she really needed to say.",
          analytical: "I saw you analyzing what Maya wasn't saying. Most people take words at face value.\n\nYou read the pattern underneath. The contradiction between her achievements and her emotion.\n\nThat's the kind of observation that reveals truth.",
          exploring: "I saw you staying curious about Maya. Most people hear the surface story and stop.\n\nYou kept asking. Kept discovering what was underneath.\n\nThat curiosity - it's what helps people find their own answers.",
          building: "I saw you helping Maya build clarity. Most people impose their own structure.\n\nYou let her construct her own understanding, one piece at a time.\n\nThat's how real insight gets built."
        }
      }
    ],
    choices: [
      {
        choiceId: 'continue_deep_reflection',
        text: "(Continue)",
        nextNodeId: 'samuel_deep_reflection_pt2',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'samuel_deep_reflection_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's not a skill they teach in school. That's wisdom born from your own wrestling. You recognized her struggle because you've felt something like it yourself.",
        emotion: 'deep_knowing',
        variation_id: 'deep_reflection_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'how_did_you_see_that',
        text: "How could you see all that?",
        nextNodeId: 'samuel_station_truth_deep',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'yes_i_have',
        text: "I have felt something like that.",
        nextNodeId: 'samuel_solidarity',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        archetype: 'SHARE_PERSPECTIVE',
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      },
      {
        choiceId: 'ready_now',
        text: "I think I'm ready for the next platform.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ["communication", "criticalThinking"]
      }
    ]
  },

  {
    nodeId: 'samuel_station_truth_deep',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station shows me moments. Fragments. Your conversation with Maya, yes, but also... glimpses of what brought you here.\n\nEveryone who finds this place is standing at their own crossroads. You're not just helping Maya find her path. You're finding yours by walking beside her through her uncertainty.",
        emotion: 'mystical',
        variation_id: 'station_truth_deep_v1',
        voiceVariations: {
          exploring: "The station shows me moments. Fragments. I see your curiosity - how you explore every angle before settling on truth.\n\nEveryone who finds this place is searching. You're finding your path by staying curious about theirs.",
          helping: "The station shows me moments. I see your heart - how you carry others' struggles alongside your own.\n\nEveryone who finds this place needs something. You're finding your path by helping them find theirs.",
          patience: "The station shows me moments. I see your stillness - how you don't rush what needs time.\n\nEveryone who finds this place is between who they were and who they're becoming. You're finding your path by waiting with them.",
          analytical: "The station shows me moments. I see your mind - how you analyze patterns others miss.\n\nEveryone who finds this place carries questions. You're finding your path by understanding theirs.",
          building: "The station shows me moments. I see your hands - how you help others construct meaning.\n\nEveryone who finds this place is building something new. You're finding your path by helping them build theirs."
        }
      }
    ],
    choices: [
      {
        choiceId: 'continue_deep',
        text: "[Sit with this truth]",
        nextNodeId: 'samuel_beat_after_crossroads',
        pattern: 'patience',
        archetype: 'STAY_SILENT'
      }
    ]
  },

  // ============= BEAT: After Crossroads Recognition =============
  {
    nodeId: 'samuel_beat_after_crossroads',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your path and theirs - they're not separate. They're woven together in this moment.\n\n[He gestures outward]\n\nThere are more paths intersecting here tonight.",
        emotion: 'gentle',
        variation_id: 'beat_after_crossroads_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_solidarity',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I know you have. That's why you could meet her there. We can only guide people through territory we've walked ourselves.\n\nYour uncertainty isn't a flaw. It's your qualification. The station doesn't call people who have all the answers. It calls people who know how to sit with questions.",
        emotion: 'warm_solidarity',
        variation_id: 'solidarity_v1'
      }
    ],
    choices: [
      {
        choiceId: 'thank_you',
        text: "Thank you for seeing that.",
        nextNodeId: 'samuel_beat_after_questions',
        pattern: 'patience',
        skills: ["emotionalIntelligence", "communication"],
        archetype: 'EXPRESS_GRATITUDE'
      }
    ]
  },

  // ============= BEAT: After Questions as Qualification =============
  {
    nodeId: 'samuel_beat_after_questions',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You're welcome. Those who can sit with questions - they're the ones who can guide others through uncertainty.\n\n[He nods toward the platforms]\n\nMore questions waiting. More people who need someone like you.",
        emotion: 'affirming',
        variation_id: 'beat_after_questions_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  // ============= YAQUIN REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_yaquin_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Yaquin just sprinted past with a notebook full of diagrams. He said he's launching a 'beta cohort.'\n\nYou helped him realize he doesn't need permission to teach. That's a powerful shift.",
        emotion: 'proud',
        variation_id: 'yaquin_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['yaquin_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_yaquin']
    },
    choices: [
      {
        choiceId: 'yaquin_launched_now',
        text: "He stopped waiting for perfect and started building.",
        nextNodeId: 'samuel_reflects_yaquin_launch',
        pattern: 'building',
        skills: ['problemSolving', 'adaptability'],
        visibleCondition: {
          hasGlobalFlags: ['yaquin_launched']
        }
      },
      {
        choiceId: 'yaquin_building_audience',
        text: "He's building trust first. Playing the long game.",
        nextNodeId: 'samuel_reflects_yaquin_audience',
        pattern: 'analytical',
        skills: ['collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['yaquin_building_audience']
        }
      },
      {
        // Fallback choice if neither specific flag is set (defensive)
        choiceId: 'yaquin_general_reflection',
        text: "I'm glad I could help him find clarity.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          lacksGlobalFlags: ['yaquin_launched', 'yaquin_building_audience']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_yaquin']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_yaquin_launch',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Exactly. Imperfect action beats perfect inaction.\n\nHe was waiting for a credential. You showed him the market only cares about competence.\n\nThat's the new economy. Skill speaks louder than paper.",
        emotion: 'affirming',
        variation_id: 'yaquin_launch_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_return_hub',
        text: "I'm glad he saw it.",
        nextNodeId: 'samuel_beat_after_yaquin_launch',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_yaquin_launch',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He did. And now he's moving. The new economy rewards action over credentials.\n\n[He looks toward the platforms]\n\nOthers here are learning to move too.",
        emotion: 'affirming',
        variation_id: 'beat_after_yaquin_launch_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_yaquin_audience',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Smart. A teacher without students is just a voice in an empty room.\n\nYou helped him think like a strategist. Build the community, then offer the value.\n\nThat's business wisdom applied to education.",
        emotion: 'wise',
        variation_id: 'yaquin_audience_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_return_hub_audience',
        text: "It's a solid plan.",
        nextNodeId: 'samuel_beat_after_yaquin_audience',
        pattern: 'analytical'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_yaquin_audience',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It is. Community first, then content. That's how you build something that lasts.\n\n[He gestures toward the platforms]\n\nReady to meet another strategist?",
        emotion: 'wise',
        variation_id: 'beat_after_yaquin_audience_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= KAI REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_kai_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Kai just walked past. They weren't looking at their tablet. They looked like someone who just quit their job.\n\nLeaving the golden handcuffs is terrifying. You helped them see that safety was actually a trap.",
        emotion: 'proud',
        variation_id: 'kai_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['kai_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_kai']
    },
    choices: [
      {
        choiceId: 'kai_chose_studio',
        text: "They're going to build something real.",
        nextNodeId: 'samuel_reflects_kai_studio',
        pattern: 'building',
        skills: ['entrepreneurship', 'visionaryThinking'],
        visibleCondition: {
          hasGlobalFlags: ['kai_chose_studio']
        }
      },
      {
        // Fallback choice if specific flag is not set (defensive)
        choiceId: 'kai_general_reflection',
        text: "They're finally free to create what matters.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          lacksGlobalFlags: ['kai_chose_studio']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_kai']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_kai_studio',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "A studio. That's the right vessel for their vision.\n\nYou helped them realize they couldn't change the system from the inside if the system was designed to reject change.\n\nSometimes you have to build the new model to make the old one obsolete.",
        emotion: 'wise',
        variation_id: 'kai_studio_v1'
      }
    ],
    choices: [
      {
        choiceId: 'kai_return_hub',
        text: "They're ready.",
        nextNodeId: 'samuel_beat_after_kai_studio',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_kai_studio',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "They are. And they learned the most important lesson: You can't reform what's designed to resist reform. Sometimes revolution is the only evolution.\n\n[He gestures to the platforms]\n\nOthers here tonight are learning similar lessons.",
        emotion: 'wise',
        variation_id: 'beat_after_kai_studio_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= ROHAN REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_rohan_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Rohan just left. He looked tired, but different. Not exhausted. Determined.\n\nHe said he's done fixing bugs. He's going to fix the engineers.\n\nYou helped him see that his value isn't in his speed. It's in his understanding.",
        emotion: 'deep_respect',
        variation_id: 'rohan_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['rohan_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_rohan']
    },
    choices: [
      {
        choiceId: 'rohan_foundation',
        text: "He's a guardian of the truth.",
        nextNodeId: 'samuel_reflects_rohan_truth',
        pattern: 'analytical',
        skills: ['integrity', 'mentorship']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_rohan']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_rohan_truth',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "In a world of generated noise, the person who verifies the truth is the most important person in the room.\n\nYou helped him claim that title. Guardian.\n\nThat's a heavy mantle. But he can carry it.",
        emotion: 'solemn',
        variation_id: 'rohan_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_return_hub',
        text: "He will.",
        nextNodeId: 'samuel_beat_after_rohan_truth',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_rohan_truth',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He will. In a world that increasingly questions what's real, we need guardians of truth.\n\n[He looks toward the platforms]\n\nThere are others here tonight who are finding their titles too.",
        emotion: 'solemn',
        variation_id: 'beat_after_rohan_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= SILAS REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_silas_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Silas just headed back to the greenhouse. He had dirt on his hands and a smile I haven't seen on an engineer in years.\n\nHe's done optimizing imaginary numbers. He's optimizing life.\n\nYou helped him see that leaving 'Big Tech' wasn't a retreat. It was an evolution.",
        emotion: 'grounded',
        variation_id: 'silas_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['silas_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_silas']
    },
    choices: [
      {
        choiceId: 'silas_evolution',
        text: "He's a Systems Gardener now.",
        nextNodeId: 'samuel_reflects_silas_soil',
        pattern: 'building',
        skills: ['systemsThinking', 'wisdom']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_silas']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_silas_soil',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Systems Gardener. I like that.\n\nHe needed someone to validate that his new path was just as complex, just as worthy, as the one he left.\n\nYou gave him permission to touch the soil without losing his mind.",
        emotion: 'warm',
        variation_id: 'silas_soil_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_return_hub',
        text: "He's happy.",
        nextNodeId: 'samuel_beat_after_silas_soil',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_silas_soil',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He is. The soil doesn't care about your credentials. Just your attention, your patience, your care.\n\n[He smiles]\n\nThere are others here tonight learning what really matters.",
        emotion: 'warm',
        variation_id: 'beat_after_silas_soil_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= ALEX REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_alex_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Alex just headed back to their workshop. Less tired than when they arrived.\n\nYou know, they used to sell certainty for a living. Now they're teaching people to sit with doubt.\n\nYou helped them see that the best teachers aren't the ones with all the answers. They're the ones who ask better questions.",
        emotion: 'knowing',
        variation_id: 'alex_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['alex_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_alex']
    },
    choices: [
      {
        choiceId: 'alex_curiosity',
        text: "They stayed curious longer than scared.",
        nextNodeId: 'samuel_reflects_alex_learning',
        pattern: 'exploring',
        skills: ['criticalThinking', 'adaptability']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_alex']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_alex_learning',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Curiosity over fear. That's the whole game, isn't it?\n\nAlex spent years selling shortcuts. Now they understand.there are no shortcuts to becoming yourself.\n\nYou reminded them why they started teaching in the first place.",
        emotion: 'warm',
        variation_id: 'alex_learning_v1'
      }
    ],
    choices: [
      {
        choiceId: 'alex_return_hub',
        text: "They'll figure it out.",
        nextNodeId: 'samuel_beat_after_alex_learning',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_alex_learning',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "They will. Because you reminded them: there are no shortcuts to becoming yourself. Just the daily practice of curiosity.\n\n[He looks around the station]\n\nReady to meet another traveler on that same journey?",
        emotion: 'warm',
        variation_id: 'beat_after_alex_learning_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'patience'
      }
    ]
  },

  // ============= ELENA REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_elena_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Elena just finished her shift. Third one this week she's trained someone new.\n\nYou know what she said? 'This one asks questions before touching anything.' High praise from her.\n\nYou helped her see that teaching isn't separate from the work. It IS the work.",
        emotion: 'knowing',
        variation_id: 'elena_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['elena_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_elena']
    },
    choices: [
      {
        choiceId: 'elena_dignity',
        text: "She takes pride in what she builds.",
        nextNodeId: 'samuel_reflects_elena_building',
        pattern: 'building',
        skills: ['observation', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_elena']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_elena_building',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Pride in the work. That's what the trades have that people forget.\n\nElena can look at a building and say 'I made that safe.' Not 'my company' or 'my software.' Her hands. Her knowledge.\n\nYou reminded her that matters. That it's not just a job.it's a craft.",
        emotion: 'warm',
        variation_id: 'elena_building_v1'
      }
    ],
    choices: [
      {
        choiceId: 'elena_return_hub',
        text: "The lights stay on because of her.",
        nextNodeId: 'samuel_beat_after_elena_building',
        pattern: 'building'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_elena_building',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "They do. Her hands. Her knowledge. That's craft, not just competence.\n\n[He nods toward the platforms]\n\nThere are others here learning what real work means.",
        emotion: 'warm',
        variation_id: 'beat_after_elena_building_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'patience'
      }
    ]
  },

  // ============= GRACE REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_grace_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Grace just left for her next client. She looked... lighter.\n\nShe told me about your conversation. Said you didn't try to fix anything. You just stayed.\n\nIn a world that moves too fast, you reminded her that presence is the rarest gift.",
        emotion: 'gentle',
        variation_id: 'grace_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['grace_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_grace']
    },
    choices: [
      {
        choiceId: 'grace_presence',
        text: "She does impossible work.",
        nextNodeId: 'samuel_reflects_grace_care',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'patience']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_grace']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_grace_care',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Impossible and invisible. That's the heart of care work.\n\nGrace holds space for people at their most vulnerable. She's present when no one else can be. And the world barely notices.\n\nYou noticed. That's what she needed.to be seen seeing.",
        emotion: 'warm',
        variation_id: 'grace_care_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_return_hub',
        text: "Mrs. Patterson is lucky to have her.",
        nextNodeId: 'samuel_beat_after_grace_care',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_grace_care',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She is. And Grace is lucky to have been seen. Care work is impossible and invisible until someone notices.\n\n[He looks toward the platforms]\n\nThere are others here doing work the world doesn't always see.",
        emotion: 'warm',
        variation_id: 'beat_after_grace_care_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_maya_revisit_guidance',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Of course. She'll be glad to see you.\n\nThe relationship you built with her doesn't end when the conversation does. That's one of the gifts of this place - the connections are real, and they persist.\n\nYou'll find her back on Platform 1.",
        emotion: 'encouraging',
        variation_id: 'revisit_guidance_v1',
        voiceVariations: {
          analytical: "Of course. You're tracking the relationship longitudinally - that's good.\n\nThe data point you're collecting isn't just the first conversation. It's how connections develop over time.\n\nPlatform 1. Same variables, evolved state.",
          helping: "Of course. You care enough to check in. That's what she needs - someone who doesn't just solve and leave.\n\nThe relationship you built doesn't end when the crisis does. That's real support.\n\nPlatform 1. She'll be glad to see you.",
          building: "Of course. You're not done building yet - that's the sign of good work.\n\nThe foundations you laid don't just hold one conversation. They're what you build on next time.\n\nPlatform 1. Keep constructing.",
          exploring: "Of course. You're curious how the story continues - that's what relationships need.\n\nThe conversation doesn't end when you walk away. That's when the real discovery starts.\n\nPlatform 1. See what's changed.",
          patience: "Of course. You understand relationships take time, multiple conversations.\n\nThe first talk was just the beginning. The connections that matter persist, grow slowly.\n\nPlatform 1. No rush."
        }
      }
    ],
    choices: [
      {
        choiceId: 'go_to_maya_revisit',
        text: "Take me to Platform 1.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping',
        skills: ["emotionalIntelligence", "communication"]
      }
    ]
  },

  // Continuation nodes for reciprocity reflections
  {
    nodeId: 'samuel_inheritance_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Most people don't. They think traits are just personality.\n\nWe're all carrying patterns we learned before we had words.\n\nYour parents showed you steady work creates space. Security as foundation. You give that gift now.",
        emotion: 'teaching',
        variation_id: 'inheritance_wisdom_v1',
        voiceVariations: {
          analytical: "Most people don't analyze their own origins. They see patterns but not the source code.\n\nWe're all running algorithms we learned before we understood programming.\n\nYour parents debugged the world through steady work. You inherited that methodology.",
          helping: "Most people don't realize how much they give comes from what they received.\n\nWe're all carrying gifts we were handed before we could name them.\n\nYour parents showed you: security creates the space to care for others. You pass that forward.",
          building: "Most people don't see how much they're constructing from blueprints drawn years ago.\n\nWe're all building with materials handed down.\n\nYour parents showed you: steady work creates foundations. You're still laying those foundations for others.",
          exploring: "Most people don't trace back to discover where their curiosity came from.\n\nWe're all walking paths cleared before we could walk.\n\nYour parents showed you: safety enables exploration. You create that safe space for others now.",
          patience: "Most people don't take time to understand what they're carrying from before.\n\nWe're all inheriting patterns planted long ago, growing slowly.\n\nYour parents showed you: steady presence over time. You practice that same patience now."
        }
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_inheritance',
        text: "That's a beautiful way to see it.",
        nextNodeId: 'samuel_beat_after_inheritance',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_inheritance',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It is beautiful, isn't it? The patterns we inherit. The gifts we carry forward.\n\n[He pauses, looking toward the platforms]\n\nThere are other travelers tonight.",
        emotion: 'warm',
        variation_id: 'beat_after_inheritance_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_pattern_confirmation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It does, doesn't it? The station helps us see these connections. Your foundation gives you a particular kind of wisdom - the ability to be present without urgency.\n\nThat's what Maya needed from you. That's what you had to give.",
        emotion: 'affirming',
        variation_id: 'pattern_confirmation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_confirmation',
        text: "[Nod thoughtfully]",
        nextNodeId: 'samuel_beat_after_pattern_confirmation',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_pattern_confirmation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "[He nods back, a moment of mutual understanding]\n\nYou're starting to see how the pieces connect. Good. That awareness will serve you well with the other travelers.",
        emotion: 'knowing',
        variation_id: 'beat_after_pattern_confirmation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_pattern_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's what this station is for. I see the patterns because I've learned to watch for them. You're doing the same thing with the travelers you meet - seeing what they can't see in themselves.\n\nEntrepreneurs raise explorers. It's not destiny, but it is inheritance.",
        emotion: 'knowing',
        variation_id: 'pattern_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_pattern',
        text: "I'm starting to see it too.",
        nextNodeId: 'samuel_beat_after_pattern_wisdom',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_pattern_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You are. And the more you see, the more there is to discover.\n\n[He gestures outward]\n\nSpeak of which - there are more patterns to observe tonight. More travelers to meet.",
        emotion: 'encouraging',
        variation_id: 'beat_after_pattern_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_possibility_keeper',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "And you succeed. Maya saw robotics as a betrayal. You helped her see it as a bridge. That's the entrepreneur's child in you - finding the third option when everyone else sees only two.",
        emotion: 'proud',
        variation_id: 'possibility_keeper_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_possibility',
        text: "There's usually a third option.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['creativity', 'problemSolving', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_struggle_transformation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Struggle becomes wisdom when we let it teach us instead of harden us. You learned to see. You learned to respond. You learned that help isn't charity - it's connection.\n\nThat's transformation. And it's powerful.",
        emotion: 'reverent',
        variation_id: 'struggle_transformation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_struggle',
        text: "Thank you for reflecting that back.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_service_philosophy',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It's everything. Service from obligation breeds resentment. Service from understanding breeds connection. You serve because you know what it's like to need. That authenticity - people feel it.",
        emotion: 'deep_teaching',
        variation_id: 'service_philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_service',
        text: "I want to keep doing that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'leadership', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_presence_teaching',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "We all are. It's the hardest lesson because the world rewards performance. But you're learning. The fact that you're here, taking time with Maya, with these conversations - that's presence. That's the work.",
        emotion: 'encouraging',
        variation_id: 'presence_teaching_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_presence',
        text: "Presence is the work.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_hollow_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "And now you're building something different. The station brought you here because you understand what matters. Not titles. Not achievements. Connection. Presence. Being seen and seeing others.\n\nThat's not hollow. That's real.",
        emotion: 'affirming_depth',
        variation_id: 'hollow_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_hollow',
        text: "I'm trying to build something real.",
        nextNodeId: 'samuel_beat_after_hollow_wisdom',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_hollow_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You are. What's real isn't titles or achievements - it's connection, presence, being seen and seeing others.\n\n[He gestures toward the platforms]\n\nReady to meet another traveler building something real?",
        emotion: 'affirming_depth',
        variation_id: 'beat_after_hollow_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_honesty_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's why it is mastery. True skill looks effortless. You didn't perform - you were honest. And honesty without cruelty, boundaries without walls - that's the work of a lifetime.\n\nKeep being honest. The station sees it. So do the travelers.",
        emotion: 'profound_recognition',
        variation_id: 'honesty_mastery_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_honesty',
        text: "I will.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership']
      }
    ]
  },

  {
    nodeId: 'samuel_boundary_philosophy',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Walls keep people out. Boundaries invite them in on your terms.\n\nWalls say 'I don't trust you.' Boundaries say 'I trust myself while staying open.'\n\nYou showed Maya the difference.",
        emotion: 'teaching_nuance',
        variation_id: 'boundary_philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_boundary',
        text: "Boundaries invite connection.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // ============= DEVON REFLECTION GATEWAY (Return from Devon) =============
  {
    nodeId: 'samuel_devon_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I saw Devon leaving Platform 3. He wasn't looking at his phone or checking schematics. He was just... walking. Present.\n\nThat's a significant shift for a young man who tries to optimize every second. How did you navigate that conversation?",
        emotion: 'observant',
        variation_id: 'devon_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['devon_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_devon']
    },
    choices: [
      {
        choiceId: 'helped_him_integrate',
        text: "I helped him see that logic and emotion aren't enemies.",
        nextNodeId: 'samuel_devon_integrate_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'focused_on_connection',
        text: "We focused on connection instead of fixing.",
        nextNodeId: 'samuel_devon_connection_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'just_listened_devon',
        text: "I just let him talk until he found his own answer.",
        nextNodeId: 'samuel_devon_listened_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_devon']
      }
    ]
  },

  // ============= DIVERGENT RESPONSES TO DEVON REFLECTION =============
  {
    nodeId: 'samuel_devon_integrate_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Integration. That's the engineering word for it, ain't it? Making separate systems work as one.\n\nDevon's been runnin' emotion and logic on separate tracks his whole life. You showed him they can share the same rail.\n\nThat's systems thinking at its best. Applied to the self.",
        emotion: 'impressed',
        variation_id: 'devon_integrate_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_devon_integrate',
        text: "[Continue]",
        nextNodeId: 'samuel_reflects_devon_systems',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_devon_connection_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Connection instead of fixin'. That's somethin' most folks never learn.\n\nEverybody wants to solve everybody else's problems. You gave Devon somethin' rarer. Presence. Attention without agenda.\n\nThat's what his dad needs too. Not solutions. Company.",
        emotion: 'warm',
        variation_id: 'devon_connection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_devon_connection',
        text: "[Continue]",
        nextNodeId: 'samuel_reflects_devon_systems',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_devon_listened_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Just listened. Three simple words that most people never learn to do.\n\nDevon's spent his life solvin' problems. Racing to the answer. You gave him permission to not know. To sit in the question.\n\nSometimes the best thing we can do is hold space while someone finds their own way.",
        emotion: 'approving',
        variation_id: 'devon_listened_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_devon_listened',
        text: "[Continue]",
        nextNodeId: 'samuel_reflects_devon_systems',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_devon_systems',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Devon's trap is common in this city. Engineers, researchers, data scientists - we think if we can just measure the problem accurately enough, the solution will appear.\n\nBut grief isn't a problem to be solved. It's a landscape to be traversed. You helped him put down the map and look at the terrain.",
        emotion: 'teaching',
        variation_id: 'devon_systems_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_did_he_choose',
        text: "He made a choice about how to talk to his dad.",
        nextNodeId: 'samuel_devon_choice_response',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'systems_can_hold_grief',
        text: "I think he realized systems can hold grief too.",
        nextNodeId: 'samuel_devon_systems_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  // ============= DIVERGENT RESPONSES TO DEVON SYSTEMS =============
  {
    nodeId: 'samuel_devon_choice_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "A choice. After months of avoidance and algorithms. That's what matters.\n\nDoesn't matter if the conversation goes perfectly. What matters is he's showin' up. Present. Ready to be human instead of efficient.",
        emotion: 'hopeful',
        variation_id: 'devon_choice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub_choice',
        text: "[Continue]",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_devon_systems_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Now that's insight. Systems can hold grief. Structure can create space for feeling.\n\nMost people think you gotta abandon logic to feel. Devon's learnin' you can build a framework FOR emotion. A container for the chaos.\n\nThat's engineer wisdom applied to the heart.",
        emotion: 'delighted',
        variation_id: 'devon_systems_r_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub_systems',
        text: "[Continue]",
        nextNodeId: 'samuel_beat_after_devon_systems',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_devon_systems',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Engineer wisdom applied to the heart. That's somethin' to remember.\n\n[He looks toward the other platforms]\n\nThere are more travelers if you're ready.",
        emotion: 'warm',
        variation_id: 'beat_after_devon_systems_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // Follow-up wisdom nodes for Devon
  {
    nodeId: 'samuel_devon_systems_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Systems thinking is Birmingham's language. Logistics, medical protocols, engineering specs. But the city's soul is in the gaps between the systems.\n\nDevon will be a better engineer because he learned to feel. And a better son because he learned to think.",
        emotion: 'wise',
        variation_id: 'devon_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_hub_devon',
        text: "He's going to be okay.",
        nextNodeId: 'samuel_beat_after_devon_systems_wisdom',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_devon_systems_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He is. Because he learned the city's most important lesson: Systems thinking measures the gaps, but the soul lives in them.\n\n[He looks toward the platforms]\n\nOthers here are learning to balance head and heart too.",
        emotion: 'wise',
        variation_id: 'beat_after_devon_systems_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_devon_heart_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped him debug his own operating system. The error wasn't in the code - it was in the assumption that feelings are bugs.\n\nOnce he saw emotions as features, everything clicked.",
        emotion: 'amused_wise',
        variation_id: 'devon_heart_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_hub_devon_heart',
        text: "I'm glad I could help him see that.",
        nextNodeId: 'samuel_beat_after_devon_heart',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_devon_heart',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Emotions as features, not bugs. I like that frame.\n\n[He smiles]\n\nNow, let me tell you about who else is here tonight.",
        emotion: 'warm',
        variation_id: 'beat_after_devon_heart_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= MARCUS REFLECTION GATEWAY (Return from Marcus) =============
  {
    nodeId: 'samuel_marcus_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Marcus just walked past. He looked... lighter. He said the patient made it.\n\nBut more than that, he said you saw the engineering in his work. That you understood the weight of the machine.\n\nHow was it, stepping into that kind of pressure?",
        emotion: 'respectful',
        variation_id: 'marcus_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['marcus_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_marcus']
    },
    choices: [
      {
        choiceId: 'marcus_pressure_intense',
        text: "It was intense. One mistake and it's over.",
        nextNodeId: 'samuel_reflects_marcus_stakes',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving']
      },
      {
        choiceId: 'marcus_pressure_meaningful',
        text: "It felt meaningful to hold a life like that.",
        nextNodeId: 'samuel_reflects_marcus_stakes',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_marcus']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_marcus_stakes',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "High stakes clarify things. In that simulation, there was no room for doubt. You had to act.\n\nThat decisiveness you showed? That's a skill. Not everyone can move when the alarm screams.\n\nYou helped Marcus see that his work isn't just care. it's precision engineering. You built a bridge between his identity as a nurse and his potential as an innovator.",
        emotion: 'proud',
        variation_id: 'marcus_stakes_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_bridge_return',
        text: "He's going to design better machines.",
        nextNodeId: 'samuel_beat_after_marcus_stakes',
        pattern: 'building',
        skills: ['adaptability', 'creativity']
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_marcus_stakes',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "He is. And he'll do it with the precision of someone who's held life in the balance.\n\n[He gestures toward the platforms]\n\nThere are others here tonight if you're ready.",
        emotion: 'warm',
        variation_id: 'beat_after_marcus_stakes_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= TESS REFLECTION GATEWAY =============
  {
    nodeId: 'samuel_tess_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Tess just left. She wasn't pacing anymore. She looked... focused. Like she finally had a map.\n\nStarting something new is terrifying. Most people wait for permission. It seems she decided not to wait.",
        emotion: 'proud',
        variation_id: 'tess_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['tess_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_tess']
    },
    choices: [
      {
        choiceId: 'tess_encouraged_risk',
        text: "She needed to know the risk was worth it.",
        nextNodeId: 'samuel_reflects_tess_risk',
        pattern: 'building',
        skills: ['leadership', 'leadership'],
        visibleCondition: {
          hasGlobalFlags: ['tess_chose_risk']
        }
      },
      {
        choiceId: 'tess_encouraged_caution',
        text: "She's going to test it first. Smart growth.",
        nextNodeId: 'samuel_reflects_tess_caution',
        pattern: 'analytical',
        skills: ['problemSolving'],
        visibleCondition: {
          hasGlobalFlags: ['tess_chose_safe']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_tess']
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_tess_risk',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped her jump. That's a heavy thing to do.\n\nBut you saw that her safety was actually a cage. Sometimes the most dangerous thing you can do is stay safe.\n\nYou have the eye of a founder - seeing what could be, not just what is.",
        emotion: 'respectful',
        variation_id: 'tess_risk_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_return_hub',
        text: "She's going to build something amazing.",
        nextNodeId: 'samuel_beat_after_tess_risk',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_tess_risk',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She is. The eye of a founder - you've got it too.\n\n[He turns toward the platforms]\n\nReady to meet another traveler?",
        emotion: 'warm',
        variation_id: 'beat_after_tess_risk_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_reflects_tess_caution',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You helped her build a bridge instead of a cliff.\n\nVisionaries often burn out because they try to do everything at once. You taught her that sustainability is part of the mission.\n\nThat's the wisdom of a strategist.",
        emotion: 'wise',
        variation_id: 'tess_caution_v1'
      }
    ],
    choices: [
      {
        choiceId: 'tess_return_hub_safe',
        text: "She'll get there, one step at a time.",
        nextNodeId: 'samuel_beat_after_tess_caution',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_tess_caution',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She will. One deliberate step at a time. Sustainability isn't slow - it's strategic.\n\n[He looks toward the platforms]\n\nOthers here are learning about their own pace too.",
        emotion: 'wise',
        variation_id: 'beat_after_tess_caution_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= JORDAN REFLECTION GATEWAY (Return from Jordan) =============
  {
    nodeId: 'samuel_jordan_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You're back. I saw Jordan heading into that classroom earlier - she looked different than when she arrived. Less frantic. More grounded.\n\nSeven jobs in seven years. Most people would call that instability. But I've learned the station measures something deeper than résumés. How did her journey look to you?",
        emotion: 'observant',
        variation_id: 'jordan_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['jordan_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_jordan']
    },
    choices: [
      {
        choiceId: 'seemed_lost',
        text: "She seemed lost, searching for solid ground.",
        nextNodeId: 'samuel_jordan_lost_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'was_building',
        text: "She was building something, even if she didn't realize it.",
        nextNodeId: 'samuel_jordan_building_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'reminded_me',
        text: "She reminded me of myself.",
        nextNodeId: 'samuel_jordan_resonance_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_jordan']
      }
    ]
  },
  {
    nodeId: 'samuel_jordan_lost_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Most people are. The difference is whether they admit it.\n\nJordan wore her searching openly. That takes courage. The ones who pretend they have it figured out? They're the truly lost ones. Can't find something you won't acknowledge you're looking for.",
        emotion: 'thoughtful',
        variation_id: 'jordan_lost_v1'
      }
    ],
    choices: [
      { choiceId: 'continue_lost', text: "[Continue]", nextNodeId: 'samuel_jordan_mentorship_reflection' }
    ]
  },
  {
    nodeId: 'samuel_jordan_building_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Now that's a systems thinker's observation. You saw accumulation where others saw chaos.\n\nSeven jobs isn't instability when each one adds a new tool to the kit. Jordan was building a Swiss Army knife while everyone else thought she was just collecting broken pieces.",
        emotion: 'impressed',
        variation_id: 'jordan_building_v1'
      }
    ],
    choices: [
      { choiceId: 'continue_building', text: "[Continue]", nextNodeId: 'samuel_jordan_mentorship_reflection' }
    ]
  },
  {
    nodeId: 'samuel_jordan_resonance_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That recognition. It matters. When we see ourselves in someone's struggle, we can offer understanding no manual provides.\n\nThe station brought you here for a reason. Perhaps it knew you'd understand journeys that don't follow straight lines.",
        emotion: 'knowing',
        variation_id: 'jordan_resonance_v1'
      }
    ],
    choices: [
      { choiceId: 'continue_resonance', text: "[Continue]", nextNodeId: 'samuel_jordan_mentorship_reflection' }
    ]
  },

  {
    nodeId: 'samuel_jordan_mentorship_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The students in that classroom needed Jordan more than they knew. Not because she has all the answers - but because she's lived the questions they're afraid to ask.\n\nThere's a difference between helping someone see their path and convincing them to walk yours. What did you offer her in those moments before her speech?",
        emotion: 'teaching',
        variation_id: 'mentorship_question_v1'
      }
    ],
    choices: [
      {
        choiceId: 'offered_mirror',
        text: "I tried to show her what she couldn't see in herself.",
        nextNodeId: 'samuel_jordan_mirror_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership']
      },
      {
        choiceId: 'asked_questions',
        text: "I asked questions. Let her find her own answers.",
        nextNodeId: 'samuel_jordan_questions_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'just_listened',
        text: "Just listened. Sometimes that's enough.",
        nextNodeId: 'samuel_jordan_listened_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication', 'communication']
      }
    ]
  },

  // Divergent responses for Jordan mentorship reflection
  {
    nodeId: 'samuel_jordan_mirror_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Mirrors are tricky tools. Hold one up and people might see their flaws first.\n\nBut you didn't show her what was wrong. You showed her what was hidden. The experience she'd been discounting. The skills she'd been calling 'just survival.'\n\nThat kind of reflecting? It's an act of faith.",
        emotion: 'affirming',
        variation_id: 'jordan_mirror_v1'
      }
    ],
    choices: [
      { choiceId: 'continue_mirror', text: "[Continue]", nextNodeId: 'samuel_beat_after_jordan_mirror' }
    ]
  },

  {
    nodeId: 'samuel_beat_after_jordan_mirror',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "An act of faith. In her, and in the truth that reflection reveals.\n\n[He stands, gesturing to the platforms]\n\nReady to meet another traveler?",
        emotion: 'warm',
        variation_id: 'beat_after_jordan_mirror_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },
  {
    nodeId: 'samuel_jordan_questions_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The Socratic approach. Oldest teaching method there is. And the hardest.\n\nAnyone can give answers. But questions? Questions let people own their discoveries. Jordan didn't walk out of there with your wisdom. She walked out with her own.\n\nThat's the difference between a lecture and a conversation.",
        emotion: 'wise',
        variation_id: 'jordan_questions_v1'
      }
    ],
    choices: [
      { choiceId: 'continue_questions', text: "[Continue]", nextNodeId: 'samuel_beat_after_jordan_questions' }
    ]
  },

  {
    nodeId: 'samuel_beat_after_jordan_questions',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "A conversation, not a lecture. That's what transforms people.\n\n[He nods thoughtfully]\n\nThere are more conversations waiting tonight.",
        emotion: 'wise',
        variation_id: 'beat_after_jordan_questions_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },
  {
    nodeId: 'samuel_jordan_listened_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Mmm. The rarest gift.\n\nMost people listen just long enough to plan their response. But true listening, the kind that holds space without filling it, that's where people find their own answers.\n\nJordan probably talked herself into courage. You just gave her the room.",
        emotion: 'reverent',
        variation_id: 'jordan_listened_v1'
      }
    ],
    choices: [
      { choiceId: 'continue_listened', text: "[Continue]", nextNodeId: 'samuel_beat_after_jordan_listened' }
    ]
  },

  {
    nodeId: 'samuel_beat_after_jordan_listened',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You gave her the room. That's what this station does too - makes space.\n\n[A quiet moment, then he looks up]\n\nSpeaking of which. There are others waiting.",
        emotion: 'warm',
        variation_id: 'beat_after_jordan_listened_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // Follow-up wisdom nodes
  {
    nodeId: 'samuel_jordan_belief_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's the right question. Sometimes we need to hear something before we can believe it. The hearing plants the seed.\n\nShe'll test that frame. Have a hard day. Wonder if she's really qualified or just performing confidence. But the seed is planted.\n\nEvery time she shares what she learned at one job with someone from another, she'll water it.",
        emotion: 'patient_wisdom',
        variation_id: 'belief_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hope_it_roots',
        text: "I hope it takes root.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_future_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She'll carry it differently depending on the day. Some days true. Some days just words.\n\nBut the frame becomes real when she uses it to help the next person.\n\nThat's when accumulation transforms into foundation.",
        emotion: 'knowing',
        variation_id: 'future_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'shell_guide_others',
        text: "She'll be a good guide for others.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_city_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Always has. Built by people who pivoted when steel dried up. Warehouses into innovation centers.\n\nJordan's carrying forward what Birmingham does. Those students are watching someone prove nonlinear paths are legitimate.\n\nThis station sits here for a reason. Birmingham's always been a crossroads.",
        emotion: 'reverent',
        variation_id: 'city_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'teaching_next_generation',
        text: "And she's teaching the next generation that.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'leadership', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_ripple_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "More than you think.\n\nFive years from now, one of them will be on their third job, feeling like a failure. They'll remember Jordan. 'Seven companies. All of it mattered.'\n\nThat's how change happens. One person shows it's possible. Then another.\n\nYou started that ripple.",
        emotion: 'hopeful',
        variation_id: 'ripple_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hope_it_reaches',
        text: "I hope it reaches the people who need it.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_narrative_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It probably will. Stories evolve.\n\nJordan might tell herself a different story in five years. That's okay.\n\nThe power is knowing you can rewrite when the old story stops serving you. You gave her that.",
        emotion: 'wise',
        variation_id: 'narrative_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'good_tool',
        text: "That's a good tool to carry.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_sovereignty_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It can be, if you mean 'no one else matters' or 'you're completely alone.'\n\nBut Jordan heard it differently. 'You decide which story you tell.' Others' opinions have weight. But she's the editor.\n\nThat's not lonely. That's sovereignty.",
        emotion: 'nuanced',
        variation_id: 'sovereignty_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'like_distinction',
        text: "I like that distinction.",
        nextNodeId: 'samuel_jordan_hub_return',
        pattern: 'patience',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_jordan_hub_return',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Jordan's in there teaching right now. Living the frame you helped her find. That's the beautiful thing about this station - influence ripples outward in ways we don't always see immediately.\n\nThere are other travelers tonight if you're ready. Or we can sit with what just happened a bit longer. The choice is yours.",
        emotion: 'offering_space',
        variation_id: 'jordan_hub_return_v1'
      }
    ],
    choices: [
      {
        choiceId: 'reflect_more_jordan',
        text: "Tell me more about what you saw with Jordan.",
        nextNodeId: 'samuel_deep_jordan_reflection',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'meet_other_travelers',
        text: "I'm ready to meet someone else.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      }
    ]
  },

  {
    nodeId: 'samuel_deep_jordan_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I saw you meeting Jordan where she was - in that spiral of doubt. You didn't try to fix her impostor syndrome. You helped her reframe it.\n\nThat's wisdom. Most people want to eliminate doubt. You understood doubt isn't always the enemy.\n\nJordan needed someone who could sit in uncertainty without rushing to resolution. You gave her that gift.",
        emotion: 'deep_knowing',
        variation_id: 'deep_jordan_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_after_deep_jordan',
        text: "[Nod thoughtfully]",
        nextNodeId: 'samuel_beat_after_deep_jordan_reflection',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_deep_jordan_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You gave her the gift of sitting with uncertainty. Doubt isn't always the enemy - sometimes it's the compass.\n\n[He looks toward the platforms]\n\nOthers here are learning to navigate by that compass too.",
        emotion: 'deep_knowing',
        variation_id: 'beat_after_deep_jordan_reflection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience'
      }
    ]
  },

  // ============= CHECK MESSAGES SYSTEM =============
  {
    nodeId: 'samuel_check_messages',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Looks like a few folks have been trying to reach you.",
        emotion: 'neutral',
        variation_id: 'check_messages_v1'
      }
    ],
    choices: [
      {
        choiceId: 'check_grace',
        text: "Message from Grace: \"Writing things down...\"",
        nextNodeId: 'grace_revisit_welcome',
        pattern: 'helping',
        visibleCondition: {
          hasGlobalFlags: ['CheckInReady_grace']
        }
      },
      {
        choiceId: 'check_devon',
        text: "Message from Devon: \"System Update.\"",
        nextNodeId: 'devon_revisit_welcome',
        pattern: 'building',
        visibleCondition: {
          hasGlobalFlags: ['CheckInReady_devon']
        }
      },
      {
        choiceId: 'close_messages',
        text: "Close messages",
        nextNodeId: 'samuel_hub_initial'
      }
    ],
    tags: ['system', 'messaging']
  },

  // ============= HUB: AFTER MAYA (Maya + Devon available) =============
  {
    nodeId: 'samuel_hub_after_maya',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 3 has another traveler tonight. Devon Kumar - engineering student. Builds systems to avoid dealing with emotions. Reminds me of myself at that age, if I'm honest.\n\nOr you can return to Maya if you'd like. The choice is yours.",
        emotion: 'reflective',
        variation_id: 'hub_after_maya_v3_clean',
        patternReflection: [
          {
            pattern: 'helping',
            minLevel: 4,
            altText: "Saw how you were with Maya. You lead with empathy.that's not somethin' you can teach.\n\nPlatform 3 has Devon Kumar. Engineering student. Builds systems to avoid dealing with emotions. Could use someone who knows how to reach past walls.",
            altEmotion: 'knowing'
          },
          {
            pattern: 'analytical',
            minLevel: 4,
            altText: "You asked Maya the right questions. Dug deeper than most would.\n\nPlatform 3 has Devon Kumar. Engineering student like yourself.well, like the way you think. Builds systems to make sense of chaos. You two might understand each other.",
            altEmotion: 'knowing'
          },
          {
            pattern: 'patience',
            minLevel: 4,
            altText: "You gave Maya space to find her own answers. That patience? Real gift.\n\nPlatform 3 has Devon Kumar. Engineering student who builds walls faster than bridges. Someone patient might help him slow down.",
            altEmotion: 'warm'
          },
          {
            pattern: 'building',
            minLevel: 4,
            altText: "You helped Maya see what she could build. Creator recognizes creator.\n\nPlatform 3 has Devon Kumar. Engineering student who builds systems to avoid feelings. He's got the technical side covered.could use someone to help him build the human side.",
            altEmotion: 'knowing'
          },
          {
            pattern: 'exploring',
            minLevel: 4,
            altText: "You weren't afraid to explore the hard parts with Maya. That curiosity serves you.\n\nPlatform 3 has Devon Kumar. Engineering student with more locked doors than he knows. Someone curious might find what's behind them.",
            altEmotion: 'knowing'
          }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'meet_devon_from_maya',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring',
        skills: ['communication', 'creativity']
      },
      {
        choiceId: 'return_to_maya',
        text: "I'd like to talk to Maya again.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'show_all_from_maya',
        text: "Who else is here tonight? Show me everyone.",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      },
      {
        choiceId: 'tell_me_pattern',
        text: "What do you see in me?",
        nextNodeId: 'samuel_pattern_observation',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence'],
        visibleCondition: {
          trust: { min: 3 },
          patterns: { patience: { min: 3 } }
        }
      },
      // MYSTERY: Letter sender reveal path (trust 8 + investigating)
      {
        choiceId: 'ask_about_letter',
        text: "Samuel... who sent me that letter?",
        nextNodeId: 'samuel_letter_reveal',
        pattern: 'exploring',
        skills: ['criticalThinking', 'observation'],
        visibleCondition: {
          trust: { min: 8 },
          mysteries: { letterSender: 'investigating' }
        }
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete'],
      lacksGlobalFlags: ['devon_arc_complete']
    }
  },

  // ============= TRUST MILESTONE ACKNOWLEDGMENTS =============
  {
    nodeId: 'samuel_acknowledges_family',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The weight of immigrant parents' dreams. Twenty years of sacrifice distilled into expectations she never asked for.\n\nShe told you about that. That means she felt safe enough to show you the conflict at her core. You didn't judge, you didn't solve - you witnessed.\n\nThat's what created the opening.",
        emotion: 'honoring_depth',
        variation_id: 'ack_family_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    choices: [
      {
        choiceId: 'what_does_that_mean',
        text: "What does 'witnessing' really mean?",
        nextNodeId: 'samuel_teaching_witnessing',
        pattern: 'exploring',
        skills: ['communication', 'criticalThinking']
      },
      {
        choiceId: 'recognize_weight',
        text: "It's a lot to carry.",
        nextNodeId: 'samuel_empathy_recognition',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'continue_exploring',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring',
        skills: ['communication', 'creativity']
      }
    ]
  },

  {
    nodeId: 'samuel_station_knows_passions',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station shows me glimpses. Who people are when they're alone with what they love.\n\nMaya late at night, soldering circuit boards while textbooks gather dust. Her face when she talks about surgical robots.\n\nThe station doesn't judge. It recognizes.",
        emotion: 'mystical_knowing',
        variation_id: 'knows_passions_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_passions',
        text: "That's a gift, seeing people that clearly.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },

  {
    nodeId: 'samuel_listening_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "'Just listened.' As if that's simple. As if most people know how to listen without planning their next response, without fixing, without judging.\n\nYou're learning something most people never master: presence without agenda. Keep practicing that. It's the foundation of everything meaningful you'll do in this world.",
        emotion: 'teaching_gently',
        variation_id: 'listening_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "What's next?",
        nextNodeId: 'samuel_beat_after_listening',
        pattern: 'exploring',
        skills: ['communication', 'adaptability']
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_listening_skill']
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_listening',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What's next? Good question. That curiosity - that eagerness to keep exploring - that's what brought you here.\n\n[He gestures toward the platforms]\n\nLet me show you who else is traveling tonight.",
        emotion: 'encouraging',
        variation_id: 'beat_after_listening_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_teaching_witnessing',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Witnessing means being present without needing to change it, fix it, or make it about you.\n\nMost 'help' makes the helper feel better. Witnessing? Sitting in the discomfort. Holding space without rushing to resolution.",
        emotion: 'teaching_depth',
        variation_id: 'teaching_witnessing_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_witnessing_teaching',
        text: "(Continue)",
        nextNodeId: 'samuel_teaching_witnessing_pt2',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['taught_witnessing']
      }
    ]
  },

  {
    nodeId: 'samuel_teaching_witnessing_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya needed someone to see her conflict without collapsing it into a simple answer. You did that. That's rare.",
        emotion: 'teaching_depth',
        variation_id: 'teaching_witnessing_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'understand_witnessing',
        text: "Present without fixing.",
        nextNodeId: 'samuel_beat_after_witnessing',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_beat_after_witnessing',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Exactly. Present without fixing. That's the whole lesson.\n\n[He nods with quiet respect]\n\nNow, let me tell you about the other travelers tonight.",
        emotion: 'proud',
        variation_id: 'beat_after_witnessing_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_hub',
        text: "(Continue)",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_empathy_recognition',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It is. And you didn't try to make it lighter by offering easy solutions. You didn't say 'just follow your passion' or 'just honor your parents' - as if two decades of love and sacrifice can be resolved with 'just.'",
        emotion: 'affirming',
        variation_id: 'empathy_recognition_v1_pt1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_empathy_recognition',
        text: "(Continue)",
        nextNodeId: 'samuel_empathy_recognition_pt2',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_empathy_recognition_pt2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You sat with the weight. That's empathy. Not sympathy - feeling sorry for someone. Empathy - feeling with someone. You're building something important here.",
        emotion: 'affirming',
        variation_id: 'empathy_recognition_v1_pt2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_journey',
        text: "Let's meet the next traveler.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      }
    ]
  },

  {
    nodeId: 'samuel_devon_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Devon's on Platform 3. Engineering student, probably hunched over a blueprint.\n\nHe organizes everything into systems. Systems are predictable. People aren't.\n\nBrilliant at solving problems. Struggles when they involve hearts.",
        emotion: 'understanding',
        variation_id: 'devon_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_devon',
        text: "I'll go meet Devon.",
        nextNodeId: 'samuel_devon_eager_response',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'devon_understand',
        text: "Hearts are harder than mechanics. I understand that struggle.",
        nextNodeId: 'samuel_devon_empathy_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'why_me',
        text: "Why do you think I should talk to him?",
        nextNodeId: 'samuel_why_devon',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  // Divergent responses for Devon intro
  {
    nodeId: 'samuel_devon_eager_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Direct. I appreciate that.\n\nSome people need to overthink every connection before they make one. But sometimes the best way to understand someone is to just show up.\n\nHe's probably deep in some schematic. Don't let that fool you. There's a lot going on under the surface.",
        emotion: 'encouraging',
        variation_id: 'devon_eager_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_platform_eager',
        text: "[Go to Platform 3]",
        nextNodeId: 'devon_introduction',
        consequence: { addGlobalFlags: ['met_devon'] }
      }
    ]
  },
  {
    nodeId: 'samuel_devon_empathy_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Then you might be exactly who he needs to meet.\n\nDevon's built walls out of logic. It's safer to think than to feel. But you just showed you know what it costs to let those walls down.\n\nGo easy with him. But don't let him hide behind his blueprints.",
        emotion: 'meaningful',
        variation_id: 'devon_empathy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_platform_empathy',
        text: "[Go to Platform 3]",
        nextNodeId: 'devon_introduction',
        consequence: { addGlobalFlags: ['met_devon'] }
      }
    ]
  },

  {
    nodeId: 'samuel_why_devon',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Because you've shown you can meet people where they are. Maya needed someone to validate her hidden dream. Devon needs something different - someone to show him that vulnerability isn't weakness, it's data he's been ignoring.\n\nYou're building a particular kind of skill here. The station is showing you.",
        emotion: 'wise',
        variation_id: 'why_devon_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_now',
        text: "I'll go find Devon.",
        nextNodeId: 'devon_introduction', // Cross-graph (future)
        pattern: 'helping',
        skills: ["emotionalIntelligence", "communication"],
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      }
    ]
  },

  // ============= JORDAN INTRODUCTION (After Devon complete) =============
  {
    nodeId: 'samuel_jordan_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "There's someone else here tonight - Jordan Packard. Conference rooms, guest instructor for Career Day.\n\nSeven jobs in seven years. Most people see 'instability.' But I see someone learning this city's ecosystem.\n\nShe's about to give a speech, but carrying doubt about whether she belongs in front of that room.",
        emotion: 'observant',
        variation_id: 'jordan_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_marcus',
        text: 'I\'ll go talk to him.',
        nextNodeId: 'marcus_intro',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'jordan_empathy',
        text: "Seven jobs means seven times she took a risk. That takes courage.",
        nextNodeId: 'jordan_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1,
          addGlobalFlags: ['met_jordan']
        }
      },
      {
        choiceId: 'why_me_jordan',
        text: "Why do you think I should talk to her?",
        nextNodeId: 'samuel_why_jordan',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'samuel_why_jordan',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Impostor syndrome doesn't care about résumés.\n\nJordan's built real skills but feels like a fraud.\n\nYou help people see frames they can't see. Jordan needs to see her winding path isn't a liability. it's what makes her valuable.\n\nThose students need someone who's lived it.",
        emotion: 'teaching',
        variation_id: 'why_jordan_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_jordan_now',
        text: "I'll go find her.",
        nextNodeId: 'jordan_introduction',
        pattern: 'helping',
        skills: ["emotionalIntelligence", "communication"],
        consequence: {
          addGlobalFlags: ['met_jordan']
        }
      }
    ]
  },

  // ============= HUB: AFTER DEVON (Maya + Devon + Jordan available) =============
  {
    nodeId: 'samuel_hub_after_devon',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "{{maya_arc_complete:Maya's on Platform 1, still finding her path.|}}{{devon_arc_complete:Devon's on Platform 3, building his bridges.|}}{{maya_arc_complete:{{devon_arc_complete:\n\n|}}\n\n|}}Jordan's by the conference rooms. Guest instructor. Wrestling with whether seven jobs makes her qualified or fraudulent.\n\nTwenty minutes before she speaks.\n\nWhere does your attention pull you?",
        emotion: 'offering_space',
        variation_id: 'hub_after_devon_v3_clean',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "You're startin' to see how this station works, aren't you? The patterns. The connections.\n\nMaya's still processin'. Devon's building bridges he didn't know he needed. Jordan's about to face a room full of people.\n\nYour analytical eye.where does it tell you to go?",
            altEmotion: 'knowing'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You got a way with people. I've watched you with these travelers. They open up to you.\n\nMaya found some peace. Devon started building bridges. Jordan's about to face her biggest fear.\n\nWho needs you most right now?",
            altEmotion: 'warm'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You're a builder, through and through. Not just things.futures.\n\nMaya's designing her path. Devon's constructing connection. Jordan's rebuilding her confidence.\n\nWhat do you want to help build next?",
            altEmotion: 'knowing'
          },
          {
            pattern: 'patience',
            minLevel: 5,
            altText: "You take your time. That's rare in this station.everyone's in such a hurry to their next platform.\n\nMaya needed space. Devon needed someone who wouldn't rush him. Jordan needs someone who can sit with uncertainty.\n\nYour patience opens doors, friend.",
            altEmotion: 'appreciative'
          },
          {
            pattern: 'exploring',
            minLevel: 5,
            altText: "You follow questions, not answers. I respect that.\n\nMaya showed you her secret world. Devon let you past his walls. Jordan's about to reveal something too.\n\nWhat question is pulling you now?",
            altEmotion: 'curious'
          }
        ]
      }
    ],
    // Note: No requiredState - this hub is a universal return point for all reflection gateways
    // Previously required devon_arc_complete, but that blocked non-linear play paths
    choices: [
      {
        choiceId: 'meet_marcus',
        text: "There's someone near the medical bay?",
        nextNodeId: 'samuel_marcus_intro',
        pattern: 'building',
        skills: ['criticalThinking', 'digitalLiteracy']
      },
      {
        choiceId: 'return_to_maya_2',
        text: "I'd like to talk to Maya again.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'return_to_devon',
        text: "I'll check in with Devon.",
        nextNodeId: 'devon_introduction',
        pattern: 'exploring',
        skills: ['communication', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['met_devon'],
          lacksGlobalFlags: ['devon_arc_complete'] // Don't loop back after completing Devon's arc
        }
      },
      {
        choiceId: 'meet_jordan',
        text: "Tell me more about Jordan.",
        nextNodeId: 'samuel_jordan_intro',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      },
      {
        choiceId: 'show_all_travelers',
        text: "Who else is here tonight? Show me everyone.",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'exploring',
        skills: ['communication', 'collaboration']
      },
      {
        choiceId: 'tell_me_pattern_2',
        text: "What pattern do you see in me now?",
        nextNodeId: 'samuel_pattern_observation',
        pattern: 'patience',
        skills: ['communication', 'emotionalIntelligence'],
        visibleCondition: {
          trust: { min: 3 }
        }
      }
    ]
  },

  {
    nodeId: 'samuel_marcus_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's Marcus. CVICU Nurse. He's standing by Platform 4, looking like he's still on shift.\n\nHe deals with life and death every night. But he's realizing the machines he uses are just as important as the medicine.\n\nGo gently. He's still carrying the weight of his last shift.",
        emotion: 'respectful',
        variation_id: 'marcus_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_marcus',
        text: "I'll go talk to him.",
        nextNodeId: 'marcus_intro', // Links to new graph
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          addGlobalFlags: ['met_marcus']
        }
      }
    ]
  },

  // ============= COMPREHENSIVE HUB: ALL CHARACTERS =============
  // Shows all available characters for efficient navigation
  {
    nodeId: 'samuel_comprehensive_hub',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Tonight's travelers:\n\n**Maya Chen** - Platform 1. Pre-med student choosing between family expectations and robotics dreams.\n\n**Devon Kumar** - Platform 3. Engineering student learning that logic isn't enough.\n\n**Jordan Packard** - Conference Room B. Seven jobs, one question: qualified or fraudulent?\n\n**Marcus** - Platform 4. CVICU nurse realizing machines matter as much as medicine.\n\n**Tess** - Pizitz Food Hall. Career counselor building a new kind of school.\n\n**Yaquin** - Platform 5. Dental assistant teaching what universities won't.\n\n**Kai** - Platform 6. Instructional architect choosing depth over compliance.\n\n**Rohan** - Platform 7. Site reliability engineer guarding the systems that matter.\n\n**Silas** - Platform 8 (Greenhouse). Former cloud architect now debugging nature.\n\n**Alex** - Platform 8 (Learning Loop). Former bootcamp instructor questioning everything they taught.\n\nWho would you like to meet?",
        emotion: 'comprehensive_guide',
        variation_id: 'comprehensive_hub_v1',
        voiceVariations: {
          analytical: "You're looking for patterns, aren't you? Tonight's travelers each facing their own logic puzzle:\n\n**Maya** - Platform 1. Data says pre-med. Heart says robotics. Which variable matters more?\n\n**Devon** - Platform 3. Perfect engineer with a father problem his algorithms can't solve.\n\n**Jordan** - Conference Room B. Seven career paths. One hypothesis: impostor syndrome or valid concern?\n\n**Marcus** - Platform 4. Medical systems analyst. Debugging human+machine failures.\n\n**Rohan** - Platform 7. Site reliability engineer. Knows how fragile everything is.\n\nWho do you want to analyze first?",
          helping: "I can see it in how you listen. You're here to support someone. Tonight's travelers, each carrying their own weight:\n\n**Maya** - Platform 1. Brilliant student crushed by family expectations she can't voice.\n\n**Devon** - Platform 3. Engineer who can't solve what matters most: his dad.\n\n**Jordan** - Conference Room B. Seven jobs. Zero self-compassion. Needs someone to see them clearly.\n\n**Marcus** - Platform 4. Nurse caring for machines because he can't save every patient.\n\n**Tess** - Pizitz. Teacher building a school the system doesn't want to exist.\n\n**Grace** - Platform 2. Caregiver who's never been cared for. Invisible labor, visible exhaustion.\n\nWho needs you tonight?",
          building: "You've got a maker's eye. Tonight's travelers, each constructing something new:\n\n**Maya** - Platform 1. Building medical robots while her family builds walls.\n\n**Devon** - Platform 3. Engineering systems. Rebuilding relationship with his father.\n\n**Jordan** - Conference Room B. Reconstructing their entire self-concept. Seven careers, one foundation.\n\n**Marcus** - Platform 4. Assembling the bridge between human care and machine precision.\n\n**Tess** - Pizitz. Architecting the school system that should exist.\n\n**Silas** - Platform 8 (Greenhouse). Former cloud architect now growing real things.\n\n**Yaquin** - Platform 5. Crafting educational tools from nothing but need and ingenuity.\n\nWho's building what you want to see?",
          exploring: "Curious, aren't you? Tonight's travelers, each asking questions they're afraid to answer:\n\n**Maya** - Platform 1. What if the career everyone expects isn't the one that fits?\n\n**Devon** - Platform 3. What if perfect logic can't solve messy human problems?\n\n**Jordan** - Conference Room B. Am I a chameleon or a fraud? Seven jobs, one identity crisis.\n\n**Marcus** - Platform 4. What if saving lives requires understanding machines?\n\n**Tess** - Pizitz. What if we built schools from scratch? What would change?\n\n**Rohan** - Platform 7. What happens when the systems we trust start to fail?\n\n**Alex** - Platform 8 (Learning Loop). Did I teach people to code, or to hate themselves?\n\nWhich question calls to you?",
          patience: "You take your time with things. These travelers are all in transition, not rushing:\n\n**Maya** - Platform 1. Slowly realizing family's plan isn't hers. Taking years to voice it.\n\n**Devon** - Platform 3. Learning that healing relationships takes longer than fixing code.\n\n**Jordan** - Conference Room B. Seven careers. Still discovering what 'qualified' even means.\n\n**Marcus** - Platform 4. Understanding medicine is a marathon, not heroic sprints.\n\n**Tess** - Pizitz. Building a school one relationship at a time. Slow, intentional.\n\n**Kai** - Platform 6. Choosing depth over speed. Real learning takes time.\n\nWho's on a journey you want to witness?"
        }
      }
    ],
    choices: [
      {
        choiceId: 'comprehensive_meet_maya',
        text: "Maya - Platform 1",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        visibleCondition: {
          lacksGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'comprehensive_revisit_maya',
        text: "Maya - Platform 1 (revisit)",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'comprehensive_meet_devon',
        text: "Devon - Platform 3",
        nextNodeId: 'devon_introduction',
        pattern: 'building',
        skills: ['criticalThinking', 'collaboration'],
        visibleCondition: {
          lacksGlobalFlags: ['devon_arc_complete']
        }
      },
      {
        choiceId: 'comprehensive_meet_jordan',
        text: "Jordan - Conference Room B",
        nextNodeId: 'jordan_introduction',
        pattern: 'exploring',
        skills: ['adaptability', 'collaboration'],
        visibleCondition: {
          lacksGlobalFlags: ['jordan_arc_complete']
        }
      },
      {
        choiceId: 'comprehensive_meet_marcus',
        text: "Marcus - Platform 4 (Medical Bay)",
        nextNodeId: 'samuel_marcus_intro',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          lacksGlobalFlags: ['marcus_arc_complete']
        }
      },
      {
        choiceId: 'comprehensive_meet_tess',
        text: "Tess - Pizitz Food Hall",
        nextNodeId: 'samuel_discovers_tess',
        pattern: 'building',
        skills: ['creativity', 'communication']
      },
      {
        choiceId: 'comprehensive_meet_yaquin',
        text: "Yaquin - Platform 5",
        nextNodeId: 'samuel_discovers_yaquin',
        pattern: 'building',
        skills: ['leadership', 'communication']
      },
      {
        choiceId: 'comprehensive_meet_kai',
        text: "Kai - Platform 6",
        nextNodeId: 'samuel_discovers_kai',
        pattern: 'analytical',
        skills: ['strategicThinking', 'resilience']
      },
      {
        choiceId: 'comprehensive_meet_rohan',
        text: "Rohan - Platform 7",
        nextNodeId: 'samuel_discovers_rohan',
        pattern: 'analytical',
        skills: ['criticalThinking', 'technicalLiteracy']
      },
      {
        choiceId: 'comprehensive_meet_silas',
        text: "Silas - Platform 8 (Greenhouse)",
        nextNodeId: 'samuel_discovers_silas',
        pattern: 'building',
        skills: ['sustainability', 'systemsThinking']
      },
      {
        choiceId: 'comprehensive_meet_alex',
        text: "Alex - Platform 8 (Learning Loop)",
        nextNodeId: 'samuel_discovers_alex',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability'],
        visibleCondition: {
          lacksGlobalFlags: ['alex_arc_complete']
        }
      },
      {
        choiceId: 'comprehensive_back',
        text: "Actually, let me think about it.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['comprehensive_hub', 'navigation', 'samuel_arc'],
    metadata: {
      sessionBoundary: true  // Session 3: Pattern revelation
    }
  },

  // ============= PATTERN OBSERVATION (Trust-gated wisdom) =============
  // These nodes are pattern-specific - players see the one matching their dominant play style

  // ANALYTICAL pattern dominant (logic-driven, data-focused)
  {
    nodeId: 'samuel_pattern_observation_analytical',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? A mind that dissects problems the way surgeons approach tissue - methodical, precise, seeking the underlying structure.\n\nYou asked Maya about her decision framework before her feelings. You looked for patterns in her words. That's not cold - that's clarity.\n\nPeople like you build systems that save lives. The trick is remembering that the data represents real people.",
        emotion: 'knowing',
        variation_id: 'pattern_analytical_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: { analytical: { min: 4 } }
    },
    choices: [
      {
        choiceId: 'what_about_my_path_analytical',
        text: "How does that translate to a career?",
        nextNodeId: 'samuel_your_path',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept_analytical',
        text: "I hadn't thought of analysis as a gift.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  // HELPING pattern dominant (people-focused, supportive)
  {
    nodeId: 'samuel_pattern_observation_helping',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? Someone who feels others' struggles like weather on their skin. You didn't just hear Maya's words - you felt the weight she was carrying.\n\nYou asked about her parents because you sensed the pull between duty and desire. That kind of empathy is both gift and burden.\n\nPeople like you become healers, teachers, counselors. The danger is forgetting to turn that compassion inward.",
        emotion: 'knowing',
        variation_id: 'pattern_helping_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: { helping: { min: 4 } }
    },
    choices: [
      {
        choiceId: 'what_about_my_path_helping',
        text: "What about my own needs?",
        nextNodeId: 'samuel_your_path',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept_helping',
        text: "It does feel like a lot sometimes.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  // EXPLORING pattern dominant (curious, discovery-oriented)
  {
    nodeId: 'samuel_pattern_observation_exploring',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? A mind that can't stop asking 'what if?'\n\nMost people want the map before they walk. You walk to make the map.",
        emotion: 'knowing',
        variation_id: 'pattern_exploring_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: { exploring: { min: 4 } }
    },
    choices: [
      {
        choiceId: 'what_about_my_path_exploring',
        text: "Is exploring enough on its own?",
        nextNodeId: 'samuel_your_path',
        pattern: 'exploring',
        skills: ['communication', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept_exploring',
        text: "I've always wondered why I can't settle on one thing.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  // PATIENCE pattern dominant (thoughtful, long-term thinking)
  {
    nodeId: 'samuel_pattern_observation_patience',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? Someone who understands that change takes time.\n\nThe deepest transformations happen in the pauses between words. You know how to wait.",
        emotion: 'knowing',
        variation_id: 'pattern_patience_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: { patience: { min: 4 } }
    },
    choices: [
      {
        choiceId: 'what_about_my_path_patience',
        text: "Does patience have a place in careers?",
        nextNodeId: 'samuel_your_path',
        pattern: 'patience',
        skills: ['communication', 'leadership'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept_patience',
        text: "Sometimes I feel like the world moves too fast.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  // BUILDING pattern dominant (creative, hands-on)
  {
    nodeId: 'samuel_pattern_observation_building',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? Hands that itch to make things real.\n\nIdeas are nice. You want to hold the finished thing.",
        emotion: 'knowing',
        variation_id: 'pattern_building_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: { building: { min: 4 } }
    },
    choices: [
      {
        choiceId: 'what_about_my_path_building',
        text: "What should I build?",
        nextNodeId: 'samuel_your_path',
        pattern: 'building',
        skills: ['creativity', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept_building',
        text: "I do love making things.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  // Generic fallback (no dominant pattern yet)
  {
    nodeId: 'samuel_pattern_observation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? Someone who listens more than they speak. Who asks questions that make people think.\n\nYou're not here by accident. The station called you because you can hold space for others' becoming.\n\nThat's a rare gift, and a difficult one. You'll often help others find clarity before you find your own.",
        emotion: 'knowing',
        variation_id: 'pattern_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 }
    },
    choices: [
      {
        choiceId: 'what_about_my_path',
        text: "What about my own path?",
        nextNodeId: 'samuel_your_path',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept',
        text: "Thank you for seeing that.",
        nextNodeId: 'samuel_hub_after_devon',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  {
    nodeId: 'samuel_your_path',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your path is being revealed now. Every traveler you help is a mirror.\n\nThe station provides encounters. The meaning emerges from what you do with them.\n\nKeep walking. Your blueprint is taking shape.",
        emotion: 'patient',
        variation_id: 'your_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'create_action_plan',
        text: "I want to map out what I've learned.",
        nextNodeId: 'samuel_action_plan_intro',
        pattern: 'building',
        skills: ['criticalThinking', 'leadership']
      },
      {
        choiceId: 'continue',
        text: "I'll keep exploring.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel'
      }
    ]
  },

  {
    nodeId: 'samuel_action_plan_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Smart. Insight fades if you don't anchor it.\n\nTake everything we've uncovered tonight. The patterns, the instincts, the choices. Don't let them fade.\n\nMap them out. Make them real. That's how you bring the station home with you.",
        emotion: 'teaching',
        variation_id: 'action_plan_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'will_do',
        text: "I'll do that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'building',
        skills: ['timeManagement', 'problemSolving']
      }
    ],
    tags: ['synthesis', 'samuel_arc']
  },

  // ============= PATTERN-GATED BONUS CONTENT =============
  // These nodes unlock after consistent pattern demonstrations
  // Reward players for decision-making styles with deeper character insights

  {
    nodeId: 'samuel_analytical_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You approach encounters systematically. I've noticed.\n\nLet me share something from my therapeutic practice. I tracked patterns across 847 client sessions before I arrived here. Looking for the algorithms of human change.",
        emotion: 'wise_analytical',
        variation_id: 'analytical_bonus_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_analytical',
        text: "[Continue]",
        nextNodeId: 'samuel_analytical_bonus_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        analytical: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_analytical_bonus_2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The data revealed something surprising: Insight doesn't cause transformation. It's a correlation, not causation. People change when they feel safe enough to act on what they already know.\n\nYou analyze carefully. Maya's contradiction, Devon's grief patterns, Jordan's career trajectory. But you also know when analysis ends and presence begins.",
        emotion: 'wise_analytical',
        variation_id: 'analytical_bonus_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_analytical_2',
        text: "[Continue]",
        nextNodeId: 'samuel_analytical_bonus_3',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        analytical: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_analytical_bonus_3',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's wisdom. Knowing that some problems need frameworks, others need witnessing.\n\nIn your own journey, how do you balance systematic thinking with intuitive knowing?",
        emotion: 'wise_analytical',
        variation_id: 'analytical_bonus_v1_part3'
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        analytical: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'analytical_balance',
        text: "Analysis provides structure. Intuition provides direction.",
        nextNodeId: 'samuel_your_path',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'analytical_limits',
        text: "I'm learning when analysis becomes avoidance.",
        nextNodeId: 'samuel_your_path',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      }
    ],
    tags: ['pattern_bonus', 'analytical', 'wisdom_sharing', 'samuel_arc']
  },

  {
    nodeId: 'samuel_patience_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You understand patience. Not the passive kind. the active kind.\n\nIn therapy, I learned that patience isn't waiting. It's creating space for emergence. Not rushing the client's process. Not solving before they're ready.",
        emotion: 'deeply_present',
        variation_id: 'patience_bonus_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_patience',
        text: "[Continue]",
        nextNodeId: 'samuel_patience_bonus_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 5 },
      patterns: {
        patience: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_patience_bonus_2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I see you doing this. With Maya's anxiety, Devon's grief, Jordan's doubt. You don't force resolution. You hold space for their unfolding.\n\nThat's a rare gift. Most people can't tolerate another's struggle without trying to fix it.\n\nYou can.",
        emotion: 'deeply_present',
        variation_id: 'patience_bonus_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_patience_2',
        text: "[Continue]",
        nextNodeId: 'samuel_patience_bonus_3',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 5 },
      patterns: {
        patience: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_patience_bonus_3',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I spent thirty years developing that capacity. You seem to carry it naturally.\n\nOr perhaps you've learned it through your own necessary waiting. Which is it?",
        emotion: 'deeply_present',
        variation_id: 'patience_bonus_v1_part3'
      }
    ],
    requiredState: {
      trust: { min: 5 },
      patterns: {
        patience: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'patience_learned',
        text: "Learned. Through waiting I didn't choose.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'patience_practice',
        text: "Still practicing. Every encounter teaches me.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['adaptability', 'communication']
      },
      {
        choiceId: 'patience_natural',
        text: "Maybe both. Some things are native, some cultivated.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    tags: ['pattern_bonus', 'patience', 'deep_wisdom', 'samuel_arc']
  },

  {
    nodeId: 'samuel_exploring_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You ask questions that open doors. That's your gift.\n\nIn my practice, I learned to distinguish between questions that narrow (diagnostic) and questions that expand (therapeutic). \n\n'What's wrong?' narrows.\n'What else is possible?' expands.",
        emotion: 'recognizing_kindred',
        variation_id: 'exploring_bonus_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_exploring',
        text: "[Continue]",
        nextNodeId: 'samuel_exploring_bonus_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: {
        exploring: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_exploring_bonus_2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You naturally ask the expansive kind. With Maya: 'What if you could bridge both?' With Jordan: 'What patterns connect your jobs?' With Devon: 'What would presence look like?'\n\nYou're not gathering information. you're creating possibility space.",
        emotion: 'recognizing_kindred',
        variation_id: 'exploring_bonus_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_exploring_2',
        text: "[Continue]",
        nextNodeId: 'samuel_exploring_bonus_3',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: {
        exploring: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_exploring_bonus_3',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Birmingham needs that. Not more answers, more possibilities. Career paths nobody's named yet. Combinations that don't fit the boxes.\n\nHow did you develop that exploratory approach? Were you taught, or did necessity force you to find alternatives?",
        emotion: 'recognizing_kindred',
        variation_id: 'exploring_bonus_v1_part3'
      }
    ],
    requiredState: {
      trust: { min: 3 },
      patterns: {
        exploring: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'exploring_necessity',
        text: "Necessity. Traditional paths didn't fit me.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['adaptability', 'creativity']
      },
      {
        choiceId: 'exploring_curiosity',
        text: "Curiosity. I can't help asking 'what if?'",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['creativity', 'criticalThinking']
      },
      {
        choiceId: 'exploring_learned',
        text: "Learned from watching closed doors create suffering.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'creativity']
      }
    ],
    tags: ['pattern_bonus', 'exploring', 'possibility_creation', 'samuel_arc']
  },

  {
    nodeId: 'samuel_helping_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You help by witnessing. That's the highest form.\n\nI watched you tonight. Maya needed to be seen beyond her parents' expectations. Devon needed someone to hold him while he held everyone else. Jordan needed her competence reflected back.",
        emotion: 'vulnerable_profound',
        variation_id: 'helping_bonus_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_helping',
        text: "[Continue]",
        nextNodeId: 'samuel_helping_bonus_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 6 },
      patterns: {
        helping: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_helping_bonus_2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You didn't fix them. You didn't advise them. You just... saw them fully.\n\nThat's what I tried to do for thirty years as a therapist. Some clinicians solve problems. Others bear witness to the humanity beneath the problems.\n\nYou're the latter kind. Naturally.",
        emotion: 'vulnerable_profound',
        variation_id: 'helping_bonus_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_helping_2',
        text: "[Continue]",
        nextNodeId: 'samuel_helping_bonus_3',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 6 },
      patterns: {
        helping: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_helping_bonus_3',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I need you to know something: This station appeared for you too. Not just for Maya and Devon and Jordan.\n\nYou're not just a helper. You're also a traveler who needs to be helped.\n\nWho witnesses you?",
        emotion: 'vulnerable_profound',
        variation_id: 'helping_bonus_v1_part3'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      patterns: {
        helping: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'helping_question',
        text: "That's... a question I avoid asking.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'helping_mutual',
        text: "Maybe we witness each other. Right now.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'collaboration']
      },
      {
        choiceId: 'helping_role',
        text: "I'm more comfortable in the helper role.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    tags: ['pattern_bonus', 'helping', 'profound_connection', 'samuel_arc']
  },

  {
    nodeId: 'samuel_building_bonus',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You build bridges between people and their possibilities. That's what I've observed.\n\nLet me tell you about the last structure I built before arriving here. Not physical. conceptual. A framework for career resilience I developed with Birmingham educators.",
        emotion: 'wise_constructive',
        variation_id: 'building_bonus_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_building',
        text: "[Continue]",
        nextNodeId: 'samuel_building_bonus_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        building: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_building_bonus_2',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "We were trying to help students in neighborhoods with 40% unemployment. Traditional career counseling wasn't working. 'Find your passion' means nothing when you're worried about survival.\n\nSo we built something new: Career as construction project. You work with available materials. skills, connections, constraints. You build what's possible now, not what's ideal someday.",
        emotion: 'wise_constructive',
        variation_id: 'building_bonus_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_building_2',
        text: "[Continue]",
        nextNodeId: 'samuel_building_bonus_3',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        building: { min: 5 }
      }
    }
  },
  {
    nodeId: 'samuel_building_bonus_3',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya's building her robotics prototype with borrowed equipment. Devon's building meaning from his mother's legacy. Jordan's building a career cathedral from seven different quarries.\n\nYou helped them see themselves as builders, not failures.\n\nWhat are you building with your own available materials?",
        emotion: 'wise_constructive',
        variation_id: 'building_bonus_v1_part3'
      }
    ],
    requiredState: {
      trust: { min: 4 },
      patterns: {
        building: { min: 5 }
      }
    },
    choices: [
      {
        choiceId: 'building_still_discovering',
        text: "Still discovering what materials I have.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring',
        skills: ['adaptability', 'creativity']
      },
      {
        choiceId: 'building_framework',
        text: "Maybe a framework for helping others build.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'building',
        skills: ['creativity', 'leadership']
      },
      {
        choiceId: 'building_between',
        text: "Bridges between people and their potential.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['collaboration', 'communication']
      }
    ],
    tags: ['pattern_bonus', 'building', 'framework_creation', 'samuel_arc']
  },

  // ============= ORB-GATED DIALOGUE: DEEPER CONVERSATIONS =============
  // These unlock only after players have demonstrated significant patterns
  // Design: Reward exploration with deeper Samuel backstory and insights

  // Pattern Mastery Conversations - unlock at 10+ orbs in a pattern
  {
    nodeId: 'samuel_orb_analytical_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You think things through. I've watched you. the way you break problems apart, find the pieces that don't fit.\n\nI used to be like that. Spent years at Southern Company running numbers, optimizing systems. Good at it, too.",
        emotion: 'reflective',
        variation_id: 'analytical_mastery_v1'
      }
    ],
    requiredState: {
      patterns: {
        analytical: { min: 10 }
      }
    },
    choices: [
      {
        choiceId: 'analytical_ask_more',
        text: "What changed?",
        nextNodeId: 'samuel_orb_analytical_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'analytical_relate',
        text: "Sometimes logic is the only thing that makes sense.",
        nextNodeId: 'samuel_orb_analytical_affirm',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      }
    ],
    tags: ['orb_gated', 'analytical', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_analytical_reveal',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What changed? I realized systems are just tools. The real work is knowing what you're building them for.\n\nYou've got the analysis down. The question now is: what will you use it for?",
        emotion: 'knowing',
        variation_id: 'analytical_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'analytical_continue',
        text: "I'm still figuring that out.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'analytical', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_analytical_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Logic is a good foundation. But some things only make sense after you've built on it for a while.\n\nKeep thinking. Keep questioning. That's how you find what's worth building.",
        emotion: 'warm',
        variation_id: 'analytical_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'analytical_affirm_continue',
        text: "Thanks, Samuel.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'analytical', 'samuel_backstory', 'mastery_tier']
  },

  // Helping Mastery
  {
    nodeId: 'samuel_orb_helping_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You lead with care. Not everyone does. Most people... they're so busy with their own path, they forget to look around.\n\nBut you see people. Really see them.",
        emotion: 'warm',
        variation_id: 'helping_mastery_v1'
      }
    ],
    requiredState: {
      patterns: {
        helping: { min: 10 }
      }
    },
    choices: [
      {
        choiceId: 'helping_ask_samuel',
        text: "Is that why you stay here? To help people?",
        nextNodeId: 'samuel_orb_helping_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'helping_humble',
        text: "I just try to listen.",
        nextNodeId: 'samuel_orb_helping_affirm',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['orb_gated', 'helping', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_helping_reveal',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's part of it. But truth is. I stay because watching people find their way... it reminds me why any of this matters.\n\nEvery person you help, you're building something. Not systems. Something bigger.",
        emotion: 'vulnerable',
        variation_id: 'helping_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'helping_continue',
        text: "I think I understand.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence']
      }
    ],
    tags: ['orb_gated', 'helping', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_helping_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's the work. Most people think helping means having answers. But the real help? It's just being there. Listening.\n\nYou already know that.",
        emotion: 'warm',
        variation_id: 'helping_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'helping_affirm_continue',
        text: "[Nod]",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'helping', 'samuel_backstory', 'mastery_tier']
  },

  // Building Mastery
  {
    nodeId: 'samuel_orb_building_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You're a maker. I can tell. You look at things differently. like everything's a problem waiting to be solved.\n\nI built things my whole life. Power systems, infrastructure. Things that kept cities running.",
        emotion: 'knowing',
        variation_id: 'building_mastery_v1'
      }
    ],
    requiredState: {
      patterns: {
        building: { min: 10 }
      }
    },
    choices: [
      {
        choiceId: 'building_ask_regret',
        text: "Do you miss it?",
        nextNodeId: 'samuel_orb_building_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'building_relate',
        text: "There's nothing like making something that works.",
        nextNodeId: 'samuel_orb_building_affirm',
        pattern: 'building',
        skills: ['creativity', 'communication']
      }
    ],
    tags: ['orb_gated', 'building', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_building_reveal',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Miss it? Every day. But I'm still building. Just... different things now.\n\nThe best builders? They know when to shift what they're making. You'll figure that out too.",
        emotion: 'reflective',
        variation_id: 'building_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'building_continue',
        text: "I hope so.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'building',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'building', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_building_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Nothing like it. That feeling when pieces click together... when something you made actually does what it's supposed to.\n\nHold onto that. It'll carry you further than you know.",
        emotion: 'warm',
        variation_id: 'building_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'building_affirm_continue',
        text: "Thanks, Samuel.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'building', 'samuel_backstory', 'mastery_tier']
  },

  // Explorer Mastery
  {
    nodeId: 'samuel_orb_exploring_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Curiosity. That's what I see in you. You want to understand everything. not just the answers, but the questions.\n\nThis station? It was built for people like you.",
        emotion: 'knowing',
        variation_id: 'exploring_mastery_v1'
      }
    ],
    requiredState: {
      patterns: {
        exploring: { min: 10 }
      }
    },
    choices: [
      {
        choiceId: 'exploring_ask_station',
        text: "Who built it?",
        nextNodeId: 'samuel_orb_exploring_reveal',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'exploring_wonder',
        text: "I just want to see what's out there.",
        nextNodeId: 'samuel_orb_exploring_affirm',
        pattern: 'exploring',
        skills: ['adaptability', 'communication']
      }
    ],
    tags: ['orb_gated', 'exploring', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_exploring_reveal',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Who built it? That's the question, isn't it.\n\nBest I can tell. it builds itself. From the questions people bring. Each traveler adds something.\n\nIncluding you.",
        emotion: 'mysterious',
        variation_id: 'exploring_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hub_check_messages',
        text: "Check new messages (1)",
        nextNodeId: 'samuel_check_messages',
        pattern: 'exploring',
        visibleCondition: {
          hasGlobalFlags: ['has_new_messages']
        }
      },
      {
        choiceId: 'hub_wait_quietly',
        text: "Just wait for a while. Watch the station breathe.",
        nextNodeId: 'samuel_hub_wait_loop',
        pattern: 'patience',
        skills: ['adaptability']
      },
      {
        choiceId: 'exploring_continue',
        text: "That's... a lot to think about.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'exploring', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_exploring_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Good. Keep that. The world's too full of people who stopped wondering.\n\nYou'll find things others miss. That's not a skill. that's who you are.",
        emotion: 'warm',
        variation_id: 'exploring_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'exploring_affirm_continue',
        text: "I'll keep looking.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring',
        skills: ['adaptability', 'communication']
      }
    ],
    tags: ['orb_gated', 'exploring', 'samuel_backstory', 'mastery_tier']
  },

  // Patience Mastery
  {
    nodeId: 'samuel_orb_patience_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You don't rush. I've noticed. While others push forward, you wait. Listen. Think.\n\nThat's rare. Especially these days.",
        emotion: 'knowing',
        variation_id: 'patience_mastery_v1'
      }
    ],
    requiredState: {
      patterns: {
        patience: { min: 10 }
      }
    },
    choices: [
      {
        choiceId: 'patience_ask_samuel',
        text: "Did you learn patience, or were you always like this?",
        nextNodeId: 'samuel_orb_patience_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'patience_humble',
        text: "Sometimes waiting is all you can do.",
        nextNodeId: 'samuel_orb_patience_affirm',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'patience', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_patience_reveal',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Learned it. The hard way.\n\nSpent years trying to force things. Plans, timelines, deadlines. Took a long time to realize. some things unfold when they're ready. Not before.\n\nYou already understand that.",
        emotion: 'reflective',
        variation_id: 'patience_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'patience_continue',
        text: "Some things can't be rushed.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'patience', 'samuel_backstory', 'mastery_tier']
  },
  {
    nodeId: 'samuel_orb_patience_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "True. But knowing when to wait and when to act. that's the real skill.\n\nYou've got good instincts. Trust them.",
        emotion: 'warm',
        variation_id: 'patience_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'patience_affirm_continue',
        text: "[Nod]",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['orb_gated', 'patience', 'samuel_backstory', 'mastery_tier']
  },

  // ============= MISSING NODES FIX =============
  {
    nodeId: 'samuel_hub_wait_loop',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Sometimes the best move is just to stand still and let the world turn a bit without you pushing it.",
        emotion: 'peaceful',
        variation_id: 'wait_loop_v1'
      }
    ],
    choices: [
      {
        choiceId: 'wait_loop_return',
        text: "I'm ready to move again.",
        nextNodeId: 'samuel_orb_introduction',
        pattern: 'patience'
      }
    ]
  },

  // Grace Placeholder (Temporary)
  {
    nodeId: 'grace_revisit_welcome',
    speaker: 'System',
    content: [
      {
        text: "[Grace's content is currently under construction. Please check back later.]",
        emotion: 'neutral',
        variation_id: 'grace_placeholder'
      }
    ],
    choices: [
      {
        choiceId: 'grace_placeholder_return',
        text: "Return to Station",
        nextNodeId: 'samuel_hub_initial'
        // Removed invalid pattern: 'neutral'
      }
    ]
  },

  // ============= PATTERN MILESTONE GREETINGS =============
  // Samuel greets returning players differently based on pattern progress
  // INVISIBLE DEPTH: Player feels recognized without explicit notifications

  // Greeting Router - directs to appropriate greeting based on pattern milestones
  {
    nodeId: 'samuel_greeting_router',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You're back.",
        emotion: 'warm',
        variation_id: 'greeting_router_v1'
      }
    ],
    choices: [
      {
        choiceId: 'route_to_mastery',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_mastery',
        visibleCondition: {
          patterns: {
            analytical: { min: 6 }
          }
        }
      },
      {
        choiceId: 'route_to_mastery_helping',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_mastery',
        visibleCondition: {
          patterns: {
            helping: { min: 6 }
          }
        }
      },
      {
        choiceId: 'route_to_mastery_building',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_mastery',
        visibleCondition: {
          patterns: {
            building: { min: 6 }
          }
        }
      },
      {
        choiceId: 'route_to_mastery_patience',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_mastery',
        visibleCondition: {
          patterns: {
            patience: { min: 6 }
          }
        }
      },
      {
        choiceId: 'route_to_mastery_exploring',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_mastery',
        visibleCondition: {
          patterns: {
            exploring: { min: 6 }
          }
        }
      },
      {
        choiceId: 'route_to_recognition',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_recognition',
        visibleCondition: {
          patterns: {
            analytical: { min: 5 }
          }
        }
      },
      {
        choiceId: 'route_to_recognition_helping',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_recognition',
        visibleCondition: {
          patterns: {
            helping: { min: 5 }
          }
        }
      },
      {
        choiceId: 'route_to_recognition_building',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_recognition',
        visibleCondition: {
          patterns: {
            building: { min: 5 }
          }
        }
      },
      {
        choiceId: 'route_to_recognition_patience',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_recognition',
        visibleCondition: {
          patterns: {
            patience: { min: 5 }
          }
        }
      },
      {
        choiceId: 'route_to_recognition_exploring',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_recognition',
        visibleCondition: {
          patterns: {
            exploring: { min: 5 }
          }
        }
      },
      {
        choiceId: 'route_to_noticing',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_noticing',
        visibleCondition: {
          patterns: {
            analytical: { min: 3 }
          }
        }
      },
      {
        choiceId: 'route_to_noticing_helping',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_noticing',
        visibleCondition: {
          patterns: {
            helping: { min: 3 }
          }
        }
      },
      {
        choiceId: 'route_to_noticing_building',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_noticing',
        visibleCondition: {
          patterns: {
            building: { min: 3 }
          }
        }
      },
      {
        choiceId: 'route_to_noticing_patience',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_noticing',
        visibleCondition: {
          patterns: {
            patience: { min: 3 }
          }
        }
      },
      {
        choiceId: 'route_to_noticing_exploring',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_noticing',
        visibleCondition: {
          patterns: {
            exploring: { min: 3 }
          }
        }
      },
      {
        choiceId: 'route_to_default',
        text: "[Continue]",
        nextNodeId: 'samuel_greeting_return'
      }
    ],
    tags: ['greeting', 'router']
  },

  // Pattern 3+ - First recognition
  {
    nodeId: 'samuel_greeting_noticing',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station stirs when you enter. Somethin' in your walk has changed since you first stepped off that train.\n\nI've seen it before.folks start movin' through here with more purpose. Like they're rememberin' who they are instead of searchin' for it.",
        emotion: 'observant',
        variation_id: 'greeting_noticing_v1'
      }
    ],
    choices: [
      {
        choiceId: 'noticing_continue',
        text: "What do you mean?",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'analytical'
      },
      {
        choiceId: 'noticing_accept',
        text: "I feel different here.",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'patience'
      }
    ],
    tags: ['greeting', 'milestone']
  },

  // Pattern 5+ - Growing respect
  {
    nodeId: 'samuel_greeting_recognition',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The Weaver takes note of you now. I see the threads formin' around your choices.patterns that weren't there when you arrived.\n\nYou're not just passin' through anymore. This place is becomin' part of you, and you're becomin' part of it.",
        emotion: 'impressed',
        variation_id: 'greeting_recognition_v1'
      }
    ],
    choices: [
      {
        choiceId: 'recognition_curious',
        text: "The Weaver?",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'exploring'
      },
      {
        choiceId: 'recognition_accept',
        text: "I can feel it.",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'patience'
      }
    ],
    tags: ['greeting', 'milestone']
  },

  // Pattern 6+ - Mastery acknowledgment
  {
    nodeId: 'samuel_greeting_mastery',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You've become part of the station's pattern now, not just a visitor passin' through.\n\nI've watched a lot of travelers come through here. Most of 'em find one thread and follow it. You? You're weavin' somethin' new. The station remembers people like you.",
        emotion: 'reverent',
        variation_id: 'greeting_mastery_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mastery_humble',
        text: "I'm just trying to figure things out.",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'patience'
      },
      {
        choiceId: 'mastery_curious',
        text: "What does the station remember?",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'exploring'
      }
    ],
    tags: ['greeting', 'milestone']
  },

  // Default return greeting - with station atmosphere variations
  {
    nodeId: 'samuel_greeting_return',
    speaker: 'Samuel Washington',
    content: [
      // HARMONIOUS (5+ arcs) - Station is alive and thriving
      {
        text: "Listen to her sing.\n\nFive lives touched. Five threads woven. The station hasn't felt like this in a long time.\n\nYou're not just visitin' anymore. You're part of the pattern.",
        emotion: 'reverent',
        variation_id: 'greeting_return_harmonious',
        condition: {
          hasGlobalFlags: ['maya_arc_complete', 'devon_arc_complete', 'jordan_arc_complete', 'marcus_arc_complete', 'tess_arc_complete']
        }
      },
      // ALIVE (3+ arcs) - Station is waking up
      {
        text: "The corridors are brighter tonight. You notice?\n\nThree threads woven, three lives touched. The station's rememberin' what it's for.\n\nWhat brings you through?",
        emotion: 'warm_proud',
        variation_id: 'greeting_return_alive',
        condition: {
          hasGlobalFlags: ['maya_arc_complete', 'devon_arc_complete', 'jordan_arc_complete']
        }
      },
      // AWAKENING (1 arc - maya) - Station is stirring
      {
        text: "The lights hum different now. Warmer.\n\nOne thread woven. The station takes notice. It's been a long time since someone cared enough to really listen.\n\nWhat's on your mind?",
        emotion: 'hopeful',
        variation_id: 'greeting_return_awakening_maya',
        condition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      // AWAKENING (1 arc - devon)
      {
        text: "Somethin's different tonight. Feel that hum?\n\nDevon's been talkin' about you. Said you actually listened. That's rare.\n\nThe station notices kindness. What brings you back?",
        emotion: 'hopeful',
        variation_id: 'greeting_return_awakening_devon',
        condition: {
          hasGlobalFlags: ['devon_arc_complete']
        }
      },
      // DORMANT (default) - Station sleeping
      {
        text: "Good to see you back. The station's still here, and so am I.\n\nWhat brings you through tonight?",
        emotion: 'warm',
        variation_id: 'greeting_return_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_continue',
        text: "Just exploring.",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'exploring'
      }
    ],
    tags: ['greeting']
  },

  // ============= CONTEXTUAL HUB =============
  // Topics appear based on player progress - Invisible Depth in action
  {
    nodeId: 'samuel_contextual_hub',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What would you like to know?",
        emotion: 'attentive',
        variation_id: 'contextual_hub_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ctx_about_station',
        text: "What is this place, really?",
        nextNodeId: 'samuel_station_deep_explanation',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'ctx_about_patterns',
        text: "These patterns I'm developing...",
        nextNodeId: 'samuel_pattern_insight',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        visibleCondition: {
          patterns: {
            analytical: { min: 3 }
          }
        }
      },
      {
        choiceId: 'ctx_about_patterns_helping',
        text: "I keep wanting to help people. Is that a pattern?",
        nextNodeId: 'samuel_pattern_insight',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          patterns: {
            helping: { min: 3 }
          }
        }
      },
      {
        choiceId: 'ctx_about_patterns_building',
        text: "I notice I keep wanting to build things...",
        nextNodeId: 'samuel_pattern_insight',
        pattern: 'building',
        skills: ['creativity'],
        visibleCondition: {
          patterns: {
            building: { min: 3 }
          }
        }
      },
      {
        choiceId: 'ctx_about_people',
        text: "Tell me about the people here.",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          hasGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'ctx_about_careers',
        text: "What careers might fit someone like me?",
        nextNodeId: 'samuel_career_preview',
        pattern: 'exploring',
        skills: ['criticalThinking'],
        visibleCondition: {
          patterns: {
            analytical: { min: 4 },
            building: { min: 4 }
          }
        }
      },
      {
        choiceId: 'ctx_about_careers_helping',
        text: "Are there careers for people who want to help?",
        nextNodeId: 'samuel_career_preview',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          patterns: {
            helping: { min: 4 },
            patience: { min: 3 }
          }
        }
      },
      {
        choiceId: 'ctx_meet_someone',
        text: "I'd like to meet someone new.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['hub', 'contextual']
  },

  // Deep station explanation (unlocked via contextual hub)
  {
    nodeId: 'samuel_station_deep_explanation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "This place... it exists between where you've been and where you're goin'. Call it a crossroads, a waystation, a moment of clarity before the next choice.\n\nEvery platform here represents a different path.not destinations, but ways of movin' through the world. The station doesn't tell you where to go. It shows you who you already are, and lets you decide what to do with that knowledge.",
        emotion: 'philosophical',
        variation_id: 'station_deep_v1'
      }
    ],
    choices: [
      {
        choiceId: 'station_deep_how',
        text: "How does it show you who you are?",
        nextNodeId: 'samuel_pattern_insight',
        pattern: 'analytical'
      },
      {
        choiceId: 'station_deep_accept',
        text: "That makes sense.",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'patience'
      }
    ],
    tags: ['lore', 'station']
  },

  // Pattern insight (unlocked at pattern 3+)
  {
    nodeId: 'samuel_pattern_insight',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Every choice you make here leaves a trace. Not good or bad.just... true. The station watches how you move through problems, how you connect with people, what questions you ask.\n\nThose patterns? They're not somethin' we give you. They're somethin' you already had. We just help you see 'em clearer.",
        emotion: 'knowing',
        variation_id: 'pattern_insight_v1',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "You think before you move. Every conversation, you're trackin' the logic, findin' the structure underneath. That's not somethin' everyone does.or can do.\n\nThe Weaver sees it in you. The station marks you as someone who finds the truth in the tangles.",
            altEmotion: 'impressed'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You lead with your heart. I've watched you with the other travelers.you listen before you speak, and when you do speak, you're already thinkin' about how to help.\n\nThe Harmonic resonates through you. The station knows a healer when it sees one.",
            altEmotion: 'warm'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You don't just see problems.you see possibilities. Your mind's always buildin' somethin', even when you're standin' still.\n\nThe Architect stirs when you're near. The station recognizes someone who shapes the world instead of just movin' through it.",
            altEmotion: 'impressed'
          },
          {
            pattern: 'patience',
            minLevel: 5,
            altText: "You give things time to unfold. Where others rush, you wait. Where others push, you listen.\n\nThe Anchor holds steady in you. The station values someone who knows that the best answers come to those who can be still.",
            altEmotion: 'reverent'
          },
          {
            pattern: 'exploring',
            minLevel: 5,
            altText: "Questions lead you forward. You're not satisfied with surface answers.you dig until you find somethin' real.\n\nThe Voyager calls through you. The station opens its hidden paths to those who seek them.",
            altEmotion: 'knowing'
          }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'insight_what_next',
        text: "What do I do with that knowledge?",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'building'
      },
      {
        choiceId: 'insight_accept',
        text: "I think I understand.",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'patience'
      }
    ],
    tags: ['patterns', 'insight']
  },

  // Career preview (unlocked at pattern 4+ in multiple areas)
  {
    nodeId: 'samuel_career_preview',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Careers? The station doesn't think in job titles. It thinks in... resonance. What makes your heart beat faster, what problems you can't look away from, what you'd do even if nobody paid you.\n\nTalk to the travelers here. Each one's found their own answer to that question. In their stories, you might hear echoes of your own.",
        emotion: 'warm',
        variation_id: 'career_preview_v1',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "You've got the mind for systems.seein' how things connect, findin' the patterns others miss. There are fields that need people who think like you.\n\nMaya could tell you about tech and innovation. Rohan knows the deep engineering side. Elena's got insights about information and research. Each one's found a different way to use that analytical gift.",
            altEmotion: 'knowing'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You lead with care.that's worth more than most realize. There are whole careers built around helpin' others find their way.\n\nMarcus works in healthcare. Grace navigates patient systems. Tess builds education programs. Jordan guides people through career decisions. Each one turned that impulse to help into a life's work.",
            altEmotion: 'warm'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You're a maker. Can see it in how you approach things.always thinkin' about what could be, not just what is.\n\nMaya builds robots. Devon designs systems. Silas works with his hands in advanced manufacturing. They've all found ways to turn that builder's instinct into somethin' real.",
            altEmotion: 'knowing'
          }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'career_preview_continue',
        text: "I'd like to talk to someone specific.",
        nextNodeId: 'samuel_comprehensive_hub',
        pattern: 'exploring'
      },
      {
        choiceId: 'career_preview_think',
        text: "Let me think about that.",
        nextNodeId: 'samuel_contextual_hub',
        pattern: 'patience'
      }
    ],
    tags: ['careers', 'guidance']
  },

  // ============= IDENTITY DIALOGUES =============
  // Triggered when patterns cross threshold 5
  // Samuel notices emerging identity and creates space for reflection
  ...samuelIdentityNodes,

  // ============= ORB RESONANCE DIALOGUES =============
  // Triggered when orb tiers are reached (10+, 30+, 60+, 100+ total choices)
  // Samuel acknowledges the player's journey depth
  ...samuelOrbResonanceNodes,

  // ============= ARC 2: PLATFORM SEVEN (The Substructure) =============
  {
    nodeId: 'samuel_platform_deflect',
    speaker: 'Samuel Washington',
    content: [{
      text: "You been talkin' to Rohan? That boy sees ghosts in the wiring. There ain't no Platform Seven. Skip in the numbers, that's all. Like floors in a hotel skippin' thirteen.",
      emotion: 'defensive',
      variation_id: 'arc2_deflect_v1'
    }],
    choices: [
      {
        choiceId: 'samuel_platform_push',
        text: "He showed me the power draw. It's real.",
        nextNodeId: 'samuel_platform_warning',
        pattern: 'analytical',
        skills: ['criticalThinking', 'courage'],
        consequence: {
          characterId: 'samuel',
          trustChange: -1
        }
      },
      {
        choiceId: 'samuel_platform_drop',
        text: "Okay. Just asking.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ],
    tags: ['arc_platform_seven', 'samuel_arc']
  },

  {
    nodeId: 'samuel_platform_warning',
    speaker: 'Samuel Washington',
    content: [{
      text: "Listen to me closely. Some doors stay closed for a reason. Not because what's behind 'em is evil. But because it's heavy. Heavier than you can carry right now.",
      emotion: 'serious',
      variation_id: 'arc2_warning_v1'
    }],
    choices: [{ choiceId: 'samuel_hub_return_warned', text: "I understand.", nextNodeId: 'samuel_hub_initial' }]
  },

  {
    nodeId: 'samuel_platform_7_truth',
    speaker: 'Samuel Washington',
    content: [{
      text: "You went down there. I can see it on you.\n\nI suppose you earned the truth, then. It's the buffer. Where we keep the things that almost happened. The timelines that were too heavy to be real.",
      emotion: 'resigned',
      variation_id: 'arc2_truth_v1'
    }],
    choices: [{ choiceId: 'samuel_hub_return_truth', text: "Why hide it?", nextNodeId: 'samuel_hub_initial' }]
  },

  // ============= ARC 3: THE QUIET HOUR =============
  {
    nodeId: 'samuel_frozen_time',
    speaker: 'Samuel Washington',
    content: [{
      text: "Don't move.\n\nThe Quiet Hour. Happens once a cycle. System reboot. Just breathe. It'll pass.",
      emotion: 'whisper',
      variation_id: 'arc3_frozen_v1'
    }],
    choices: [
      {
        choiceId: 'quiet_hour_wonder',
        text: "It's beautiful.",
        nextNodeId: 'samuel_quiet_hour_explanation',
        pattern: 'exploring',
        skills: ['observation']
      },
      {
        choiceId: 'quiet_hour_fear',
        text: "Is this a glitch?",
        nextNodeId: 'samuel_quiet_hour_explanation',
        pattern: 'analytical'
      }
    ],
    tags: ['arc_quiet_hour', 'samuel_arc']
  },

  {
    nodeId: 'samuel_quiet_hour_explanation',
    speaker: 'Samuel Washington',
    content: [{
      text: "When you process this much potential... this many futures... the machine gets hot. Needs to cool down. For one hour, no time passes. No choices matter. We just... exist.",
      emotion: 'philosophical',
      variation_id: 'arc3_explain_v1'
    }],
    choices: [{ choiceId: 'quiet_hour_end', text: "A pause in the chaos.", nextNodeId: 'samuel_hub_initial' }]
  },

  // ============= PUZZLE REWARD: TIME LOOPS =============
  {
    nodeId: 'samuel_time_loop_dialogue',
    speaker: 'Samuel Washington',
    content: [{
      text: "You figured out the sequence, didn't you? The loops aren't mistakes. They're rehearsals. We practice the future until we get it right.",
      emotion: 'impressed',
      variation_id: 'puzzle_loop_v1'
    }],
    choices: [{ choiceId: 'puzzle_loop_ack', text: "Practice makes perfect.", nextNodeId: 'samuel_hub_initial' }],
    tags: ['puzzle_reward', 'legendary_info']
  },

  {
    nodeId: 'samuel_station_origin_reward',
    speaker: 'Samuel Washington',
    content: [{
      text: "You see it now. The station isn't a place. It's a wish. A collective wish for a second chance.\n\nEvery brick here was laid by someone who wanted to change their path. You're just the latest architect.",
      emotion: 'proud',
      variation_id: 'puzzle_origin_v1'
    }],
    choices: [{ choiceId: 'origin_ack', text: "I'll build something good.", nextNodeId: 'samuel_hub_initial' }],
    tags: ['puzzle_reward', 'legendary_info']
  },

  {
    nodeId: 'samuel_burden_reward',
    speaker: 'Samuel Washington',
    content: [{
      text: "Someone has to hold the door open. If I leave, if the Anchor lifts, all these potential futures collapse into a single hard reality.\n\nNot everyone is ready for that. So I stay. I hold the moment open.",
      emotion: 'resigned_noble',
      variation_id: 'puzzle_burden_v1'
    }],
    choices: [{ choiceId: 'burden_ack', text: "Thank you for holding the door.", nextNodeId: 'samuel_hub_initial' }],
    tags: ['puzzle_reward', 'legendary_info']
  },
  {
    nodeId: 'samuel_letter_confrontation',
    speaker: 'Samuel (The Conductor)',
    content: [
      {
        variation_id: 'default',
        text: '"Every invitation is a disruption," Samuel sighs, finally acknowledging the letter. "I sent it because the station required a variable. You are that variable."',
        emotion: 'resigned'
      }
    ],
    choices: [
      {
        choiceId: 'sam_admission_why',
        text: 'Why me?',
        nextNodeId: 'samuel_admission',
        visibleCondition: undefined
      },
      {
        choiceId: 'sam_admission_anger',
        text: 'You manipulated my life.',
        nextNodeId: 'samuel_admission',
        visibleCondition: undefined
      }
    ]
  },
  {
    nodeId: 'samuel_admission',
    speaker: 'Samuel (The Conductor)',
    content: [
      {
        variation_id: 'default',
        text: '"We are all manipulated by gravity," Samuel says, turning to the departure board. "The question is not who pulled you here, but whether you have the strength to pull back."',
        emotion: 'grave'
      }
    ],
    choices: [
      {
        choiceId: 'sam_end_arc1',
        text: 'End Conversation',
        nextNodeId: 'samuel_hub_initial',
        consequence: {
          addGlobalFlags: ['letter_mystery_solved'],
          trustChange: 2
        }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS - Trust-gated hints about station nature
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'samuel_mystery_hint_1',
    speaker: 'samuel',
    requiredState: {
      trust: { min: 4 }
    },
    content: [
      {
        text: "You ever wonder why folks end up here? At this particular station?\\n\\nAin't random. Never is.",
        emotion: 'mysterious',
        variation_id: 'mystery_hint_1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mystery_ask_more',
        text: "What do you mean?",
        nextNodeId: 'samuel_mystery_deflect_1',
        pattern: 'exploring'
      },
      {
        choiceId: 'mystery_accept',
        text: "I think I'm starting to understand.",
        nextNodeId: 'samuel_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'samuel_mystery_deflect_1',
    speaker: 'samuel',
    content: [
      {
        text: "Ha. You'll figure it out. Everyone does, eventually.\\n\\nRight now, focus on the folks here. Their stories... they're connected to yours more than you know.",
        emotion: 'knowing',
        variation_id: 'mystery_deflect_1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mystery_understood',
        text: "I'll keep that in mind.",
        nextNodeId: 'samuel_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'samuel_mystery_hint_2',
    speaker: 'samuel',
    requiredState: {
      trust: { min: 6 }
    },
    content: [
      {
        text: "The station... it ain't just a place. It's more like a <shake>mirror</shake>.\\n\\nShows you what you need to see. Not always what you want to.",
        emotion: 'vulnerable',
        variation_id: 'mystery_hint_2_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mystery_mirror_ask',
        text: "A mirror? What am I supposed to see?",
        nextNodeId: 'samuel_mystery_mirror_response',
        pattern: 'exploring'
      },
      {
        choiceId: 'mystery_mirror_reflect',
        text: "I think I've already started seeing it.",
        nextNodeId: 'samuel_mystery_mirror_response',
        pattern: 'analytical'
      }
    ],
    tags: ['mystery', 'revelation']
  },

  {
    nodeId: 'samuel_mystery_mirror_response',
    speaker: 'samuel',
    content: [
      {
        text: "Yourself. Who you really are. Who you could become.\\n\\nEvery conversation here, every choice... it's all showing you something. Pay attention.",
        emotion: 'knowing',
        variation_id: 'mystery_mirror_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'samuel', addKnowledgeFlags: ['mystery_mirror_revealed'] }
    ],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "Thank you, Samuel.",
        nextNodeId: 'samuel_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'revelation']
  },

  {
    nodeId: 'samuel_mystery_revelation',
    speaker: 'samuel',
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['mystery_mirror_revealed']
    },
    content: [
      {
        text: "You've been here a while now. Talked to a lot of folks. Learned their stories.\\n\\n<bloom>You ready to hear what this place really is?</bloom>",
        emotion: 'serious',
        variation_id: 'mystery_revelation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mystery_ready',
        text: "I'm ready.",
        nextNodeId: 'samuel_station_truth',
        pattern: 'patience'
      },
      {
        choiceId: 'mystery_not_yet',
        text: "Not yet. I want to talk to more people first.",
        nextNodeId: 'samuel_hub_return',
        pattern: 'exploring'
      }
    ],
    tags: ['mystery', 'climax']
  },

  {
    nodeId: 'samuel_station_truth',
    speaker: 'samuel',
    content: [
      {
        text: "Grand Central Terminus ain't a train station. Not really.\\n\\nIt's a <bloom>crossroads</bloom>. A place between who you were and who you're becoming.",
        emotion: 'vulnerable',
        variation_id: 'station_truth_v1'
      },
      {
        text: "Every person you met here? They're real. Their struggles are real. But you found 'em because <shake>you needed to</shake>.\\n\\nTheir paths crossed yours for a reason.",
        emotion: 'knowing',
        variation_id: 'station_truth_v2'
      },
      {
        text: "The patterns you've been building... analytical, helping, building, exploring, patience...\\n\\nThey ain't just words. They're <bloom>who you are</bloom>. And now you know it.",
        emotion: 'proud',
        variation_id: 'station_truth_v3'
      }
    ],
    onEnter: [
      { characterId: 'samuel', addKnowledgeFlags: ['station_truth_revealed'] }
    ],
    choices: [
      {
        choiceId: 'truth_grateful',
        text: "Thank you for showing me this.",
        nextNodeId: 'samuel_truth_farewell',
        pattern: 'helping'
      },
      {
        choiceId: 'truth_question',
        text: "What happens now?",
        nextNodeId: 'samuel_truth_farewell',
        pattern: 'exploring'
      }
    ],
    tags: ['mystery', 'revelation', 'climax']
  },

  {
    nodeId: 'samuel_truth_farewell',
    speaker: 'samuel',
    content: [
      {
        text: "Now? You take what you learned here and you <bloom>live it</bloom>.\\n\\nThe station will always be here if you need it. But the real journey... that's out there.",
        emotion: 'warm',
        variation_id: 'truth_farewell_v1'
      },
      {
        text: "I'm proud of you. Truly.\\n\\nNow go. Show the world who you've become.",
        emotion: 'proud',
        variation_id: 'truth_farewell_v2'
      }
    ],
    onEnter: [
      { characterId: 'samuel', addKnowledgeFlags: ['samuel_farewell_complete'] }
    ],
    choices: [
      {
        choiceId: 'farewell_stay',
        text: "I'd like to stay a little longer.",
        nextNodeId: 'samuel_hub_return'
      },
      {
        choiceId: 'farewell_go',
        text: "Goodbye, Samuel.",
        nextNodeId: 'journey_complete_trigger',
        pattern: 'patience'
      }
    ],
    tags: ['farewell', 'ending']
  },

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY COMPLETE TRIGGER - Final node that triggers ending screen
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'journey_complete_trigger',
    speaker: 'samuel',
    content: [
      {
        text: "Safe travels, friend. The world's waiting for you.",
        emotion: 'warm',
        variation_id: 'journey_complete_v1'
      }
    ],
    onEnter: [
      { characterId: 'samuel', addKnowledgeFlags: ['journey_complete'] }
    ],
    choices: [],
    tags: ['ending', 'journey_complete']
  },

  {
    nodeId: 'samuel_hub_return',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You got more questions, or you ready to head somewhere?",
        emotion: 'warm',
        variation_id: 'hub_return_v1'
      }
    ],
    choices: [
      {
        choiceId: 'offer_quiet_hour',
        text: "[Patience] Samuel, you seem quieter than usual. Something weighing on you?",
        nextNodeId: 'samuel_loyalty_trigger',
        pattern: 'patience',
        skills: ['activeListening', 'empathy'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { patience: { min: 5 } },
          hasGlobalFlags: ['samuel_farewell_complete']
        }
      }
    ],
    tags: ['farewell']
  },

  // ═══════════════════════════════════════════════════════════════
  // LOYALTY EXPERIENCE: THE QUIET HOUR
  // Requires: Trust >= 8, Patience >= 50%, samuel_farewell_complete
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'samuel_loyalty_trigger',
    speaker: 'Samuel Washington',
    content: [{
      text: "It's platform seven.\n\nThere's a young man there. Twenty-two. Engineering degree, three job offers, can't decide between any of them. Paralyzed by the weight of choosing wrong.\n\nHe's been sitting on that bench for six hours. Not reading. Not scrolling. Just staring at the tracks.\n\nI've watched a thousand passengers wrestle with choice. But this one... something about him reminds me of myself at that age. The fear that one wrong turn ruins everything.\n\nHe doesn't need advice. He needs someone to sit with him. To make the silence less heavy.\n\nYou understand patience. Would you... sit with him? Just for an hour. Let him know he's not alone in the uncertainty?",
      emotion: 'vulnerable_warm',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { patience: { min: 5 } },
      hasGlobalFlags: ['samuel_farewell_complete']
    },
    metadata: {
      experienceId: 'the_quiet_hour'
    },
    choices: [
      {
        choiceId: 'accept_quiet_hour',
        text: "I'll sit with him.",
        nextNodeId: 'samuel_loyalty_start',
        pattern: 'patience'
      },
      {
        choiceId: 'decline_quiet_hour',
        text: "I'm not sure I'm the right person for that.",
        nextNodeId: 'samuel_loyalty_declined'
      }
    ]
  },

  {
    nodeId: 'samuel_loyalty_declined',
    speaker: 'Samuel Washington',
    content: [{
      text: "That's okay. Not everyone's ready to hold space for someone else's silence.\n\nThe offer stands if you change your mind.",
      emotion: 'understanding',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "Thank you for understanding.",
        nextNodeId: 'samuel_hub_return'
      }
    ]
  },

  {
    nodeId: 'samuel_loyalty_start',
    speaker: 'Samuel Washington',
    content: [{
      text: "Platform seven. The bench by the schedule board.\n\nDon't try to fix him. Don't rush him. Just... be there.\n\nSometimes that's all someone needs.",
      emotion: 'warm_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    onEnter: [
      { characterId: 'samuel', addKnowledgeFlags: ['samuel_loyalty_accepted'] }
    ],
    choices: []
  },

  // ============= TRUST RECOVERY SYSTEM =============
  {
    nodeId: 'samuel_trust_recovery',
    speaker: 'Samuel Washington',
    content: [{
      text: "You came back. Wasn't sure you would after how things went.\n\nI can be a hard man to know sometimes. The station taught me to see patterns, but people... people are more than patterns.\n\nYou came back anyway. That says somethin'.",
      emotion: 'guarded',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "You came back. And you didn't rush it.\n\nI know I can be difficult. Ask too much. See too much. Most people don't have patience for that.\n\nBut you waited. That matters.",
        helping: "You came back. After I pushed you away.\n\nI get protective of this place sometimes. Of the travelers. Forget that guides need grace too.\n\nYou saw past my walls. Thank you for that.",
        analytical: "You came back. I've been processing why that surprised me.\n\nI operate in patterns. When trust breaks, people leave. That's the pattern.\n\nBut you challenged it. You came back.",
        building: "You came back. Ready to rebuild what we started.\n\nI know I can be hard to reach sometimes. Build walls when I should build bridges.\n\nBut you kept building anyway. I respect that.",
        exploring: "You came back. Still curious despite the friction.\n\nMost people leave when the station keeper gets too guarded. Too knowing.\n\nBut you stayed interested. That's... rare."
      }
    }],
    requiredState: {
      trust: { max: 3 }
    },
    choices: [
      {
        choiceId: 'recovery_understanding',
        text: "The station matters to you. I understand that.",
        nextNodeId: 'samuel_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          addKnowledgeFlags: ['samuel_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_patterns',
        text: "Not all patterns hold. Sometimes people surprise you.",
        nextNodeId: 'samuel_trust_restored',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          addKnowledgeFlags: ['samuel_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_patience',
        text: "[Wait. Let him find his words.]",
        nextNodeId: 'samuel_trust_restored',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          addKnowledgeFlags: ['samuel_trust_repair_attempted']
        }
      }
    ],
    tags: ['trust_recovery', 'samuel_arc', 'repair']
  },

  {
    nodeId: 'samuel_trust_restored',
    speaker: 'Samuel Washington',
    content: [{
      text: "Alright then. Let's start again.\n\nI've been doin' this a long time. Sometimes I forget that bein' a guide don't mean havin' all the answers. Just means walkin' alongside folks while they find their own.\n\nYou reminded me of that. Thank you.",
      emotion: 'warm',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "Alright then. Starting fresh.\n\nYou didn't force it. Just gave me time to see what I was doin'.\n\nThat patience - that's what good guides have. Maybe you're teachin' me something too.",
        helping: "Alright then. Let's try again.\n\nYou came back not to fix me, but to understand me. That's different.\n\nMost people want the wise station keeper. You just wanted the person. I appreciate that.",
        analytical: "Alright then. Recalibrating.\n\nYou challenged my assumptions about how trust works. Good data doesn't care about my expectations.\n\nNeither do good people, apparently.",
        building: "Alright then. Rebuilding.\n\nYou kept constructing bridges even when I kept burnin' them down.\n\nThat persistence - that's how real connection gets built. One choice at a time.",
        exploring: "Alright then. New territory.\n\nYou stayed curious even when I made it hard. That says somethin' about your character.\n\nLet's see where this goes."
      }
    }],
    onEnter: [
      {
        characterId: 'samuel',
        trustChange: 1,
        addKnowledgeFlags: ['samuel_trust_repaired']
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_recovery',
        text: "Tell me more about this place.",
        nextNodeId: 'samuel_station_deep_explanation',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'continue_from_recovery_travelers',
        text: "Who should I meet next?",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'helping',
        skills: ['collaboration']
      }
    ],
    tags: ['trust_recovery', 'samuel_arc', 'fresh_start']
  }
]

// ============= PUBLIC API: EXPORTED ENTRY POINTS =============
// These nodes are designed for cross-graph navigation.
// Do NOT link to internal nodes - only use these exported IDs.
// This provides compile-time safety and refactor protection.

export const samuelEntryPoints = {
  /** Atmospheric arrival - game starts here */
  ARRIVAL: 'station_arrival',

  /** Samuel's introduction - after stepping onto platform */
  INTRODUCTION: 'samuel_introduction',

  /** Hub shown when player first arrives (only Maya available) */
  HUB_INITIAL: 'samuel_hub_initial',

  /** Reflection gateway - first return from Maya (mirrors player's influence) */
  MAYA_REFLECTION_GATEWAY: 'samuel_maya_reflection_gateway',

  /** Reflection gateway - return from Devon (validates systems/heart integration) */
  DEVON_REFLECTION_GATEWAY: 'samuel_devon_reflection_gateway',

  /** Reflection gateway - return from Marcus (validates crisis management) */
  MARCUS_REFLECTION_GATEWAY: 'samuel_marcus_reflection_gateway',

  /** Reflection gateway - return from Jordan (celebrates mentorship influence) */
  JORDAN_REFLECTION_GATEWAY: 'samuel_jordan_reflection_gateway',

  /** Hub after completing Maya's arc (Maya + Devon available) */
  HUB_AFTER_MAYA: 'samuel_hub_after_maya',

  /** Hub after completing Devon's arc (Maya + Devon + Jordan available) */
  HUB_AFTER_DEVON: 'samuel_hub_after_devon',

  /** Reflection gateway - return from Tess (validates entrepreneurial risk) */
  TESS_REFLECTION_GATEWAY: 'samuel_tess_reflection_gateway',

  /** Reflection gateway - return from Yaquin (validates creator economy) */
  YAQUIN_REFLECTION_GATEWAY: 'samuel_yaquin_reflection_gateway',

  /** Reflection gateway - return from Kai (validates corporate innovation) */
  KAI_REFLECTION_GATEWAY: 'samuel_kai_reflection_gateway',

  /** Reflection gateway - return from Rohan (validates deep engineering) */
  ROHAN_REFLECTION_GATEWAY: 'samuel_rohan_reflection_gateway',

  /** Reflection gateway - return from Silas (validates grounded engineering) */
  SILAS_REFLECTION_GATEWAY: 'samuel_silas_reflection_gateway',

  /** Reflection gateway - return from Alex (validates learning to learn) */
  ALEX_REFLECTION_GATEWAY: 'samuel_alex_reflection_gateway',

  /** Reflection gateway - return from Elena (validates trades dignity) */
  ELENA_REFLECTION_GATEWAY: 'samuel_elena_reflection_gateway',

  /** Reflection gateway - return from Grace (validates presence-based care) */
  GRACE_REFLECTION_GATEWAY: 'samuel_grace_reflection_gateway',

  /** Samuel's backstory reveal (trust-gated) */
  BACKSTORY: 'samuel_backstory_intro',

  /** Pattern observation (trust ≥3 required) */
  PATTERN_OBSERVATION: 'samuel_pattern_observation',

  /** Orb-gated mastery conversations (10+ orbs in pattern required) */
  ANALYTICAL_MASTERY: 'samuel_orb_analytical_mastery',
  HELPING_MASTERY: 'samuel_orb_helping_mastery',
  BUILDING_MASTERY: 'samuel_orb_building_mastery',
  EXPLORING_MASTERY: 'samuel_orb_exploring_mastery',
  PATIENCE_MASTERY: 'samuel_orb_patience_mastery',

  /** Identity dialogues (pattern threshold 5 - Disco Elysium mechanic) */
  IDENTITY_ANALYTICAL: 'samuel_identity_analytical',
  IDENTITY_PATIENCE: 'samuel_identity_patience',
  IDENTITY_EXPLORING: 'samuel_identity_exploring',
  IDENTITY_HELPING: 'samuel_identity_helping',
  IDENTITY_BUILDING: 'samuel_identity_building',

  /** Pattern Milestone Greetings - Invisible Depth System */
  GREETING_ROUTER: 'samuel_greeting_router',
  GREETING_NOTICING: 'samuel_greeting_noticing',
  GREETING_RECOGNITION: 'samuel_greeting_recognition',
  GREETING_MASTERY: 'samuel_greeting_mastery',
  GREETING_RETURN: 'samuel_greeting_return',

  /** Contextual Hub - Pattern-unlocked topics */
  CONTEXTUAL_HUB: 'samuel_contextual_hub',
  STATION_DEEP_EXPLANATION: 'samuel_station_deep_explanation',
  PATTERN_INSIGHT: 'samuel_pattern_insight',
  CAREER_PREVIEW: 'samuel_career_preview',

  /** Orb Resonance - Tier milestone dialogues */
  ORB_EMERGING: 'samuel_orb_emerging',
  ORB_DEVELOPING: 'samuel_orb_developing',
  ORB_FLOURISHING: 'samuel_orb_flourishing',
  ORB_MASTERED: 'samuel_orb_mastered',

  /** Mystery Breadcrumbs */
  MYSTERY_HINT_1: 'samuel_mystery_hint_1',
  MYSTERY_HINT_2: 'samuel_mystery_hint_2',
  MYSTERY_REVELATION: 'samuel_mystery_revelation'
} as const

// Type export for TypeScript autocomplete
export type SamuelEntryPoint = typeof samuelEntryPoints[keyof typeof samuelEntryPoints]

export const samuelDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(samuelDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: samuelEntryPoints.ARRIVAL,
  metadata: {
    title: "Samuel's Guidance",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: samuelDialogueNodes.length,
    totalChoices: samuelDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}