/**
 * Silas's Dialogue Graph
 * The Systems Gardener - Platform 8 (Regenerative Tech / "Touch Grass")
 *
 * CHARACTER: The Humbled Engineer
 * Core Conflict: "Sensor Data" vs. "Ground Truth"
 * Arc: Realizing that nature has higher latency and harsher penalties than any server.
 * Mechanic: "The Drought" - Debugging a crop failure where the dashboard lies.
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const silasDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'silas_introduction',
    speaker: 'Silas',
    content: [
      {
        text: "Checkpoint is closed.\n\nSector 7 restriction protocol is active.\n\nTurn around. Nothing back here but dust and bad memories.",
        emotion: 'commanding',
        variation_id: 'silas_intro_wall_v2_minimal',
        richEffectContext: 'warning',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Checkpoint closed. Sector 7 restriction.\n\nYou're counting the dents in my shield. Smart. You know this isn't just a patrol post.\n\nTurn around. You don't want to see what's behind this door.", altEmotion: 'suspicious' },
          { pattern: 'building', minLevel: 5, altText: "Checkpoint closed.\n\nYou built that exoskeleton yourself didn't you? Impressive.\n\nDoesn't matter. Door's locked. Move along.", altEmotion: 'respectful' },
          { pattern: 'patience', minLevel: 5, altText: "You're waiting for me to acknowledge you. You've got discipline.\n\nCheckpoint is closed. Go home.", altEmotion: 'stoic' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'silas_intro_reality',
        text: "The map isn't the territory.",
        voiceVariations: {
          analytical: "The map isn't the territory. Your sensors are abstractions.",
          helping: "You're trusting data over your own eyes. That's the gap.",
          building: "The system you built can't see what's actually happening.",
          exploring: "The map isn't the territory. What's the real ground truth?",
          patience: "Sometimes the data lies. Or tells a partial truth."
        },
        nextNodeId: 'silas_map_territory_response',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_intro_tech',
        text: "Sensor calibration drift?",
        archetype: 'ASK_FOR_DETAILS',
        nextNodeId: 'silas_handshake_network',
        pattern: 'analytical',
        skills: ['technicalLiteracy']
      },
      {
        choiceId: 'silas_intro_empathy',
        text: "You look terrified.",
        voiceVariations: {
          analytical: "Your hands are shaking. You're terrified.",
          helping: "Hey. You look terrified. What's really going on?",
          building: "You're paralyzed. Something's failing, isn't it?",
          exploring: "That's not confidence. You look terrified.",
          patience: "Take a breath. You look terrified."
        },
        nextNodeId: 'silas_fear_seen_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'silas_arc']
  },

  // ============= HANDSHAKE NODE: SENSOR CALIBRATION =============
  {
    nodeId: 'silas_handshake_network',
    speaker: 'Silas',
    content: [{
      text: "You think it's just drift? Look at the raw feed.\n\nNitrogen levels spiking where there's no soil. Moisture readings in a drought. The ground truth doesn't match the map.\n\nCan you zero it out?",
      emotion: 'frustrated',
      variation_id: 'silas_handshake_intro',
      interaction: 'ripple'
    }],
    simulation: {
      type: 'data_ticker',
      mode: 'inline',
      title: 'Sensor Calibration',
      taskDescription: 'Stabilize sensor inputs to find ground truth.',
      initialContext: {
        label: 'Sensor Array 7',
        content: JSON.stringify([
          { id: '1', label: 'MOISTURE_S1', value: 12, priority: 'critical', trend: 'down' },
          { id: '2', label: 'NITROGEN_S4', value: 45, priority: 'medium', trend: 'stable' },
          { id: '3', label: 'PH_LEVEL_S2', value: 8.5, priority: 'high', trend: 'up' },
          { id: '4', label: 'LIGHT_PAR_S3', value: 95, priority: 'critical', trend: 'up' },
          { id: '5', label: 'TEMP_K_S1', value: 312, priority: 'high', trend: 'up' }
        ])
      },
      successFeedback: 'CALIBRATION COMPLETE. ANOMALY CONFIRMED.'
    },
    choices: [
      {
        choiceId: 'sensor_complete',
        text: "It's not drift. The data is... inverted.",
        nextNodeId: 'silas_tech_defense', // Route back to main arc
        pattern: 'analytical',
        skills: ['technicalLiteracy'],
        voiceVariations: {
          analytical: "Calibration done. The baseline is wrong.",
          building: "I fixed the drift, but the foundation is off.",
          exploring: "That wasn't noise. That was a rewrite."
        }
      }
    ]
  },

  // Divergent responses for intro
  {
    nodeId: 'silas_map_territory_response',
    speaker: 'Silas',
    content: [
      {
        text: "That's... yeah. That's exactly it.\n\nFifteen years building systems that abstract reality into data. Clean numbers. Dashboards. KPIs.\n\nAnd the abstraction has a gap wide enough to kill my basil.",
        emotion: 'stunned_recognition',
        variation_id: 'map_territory_v1',
        voiceVariations: {
          analytical: "That's... yeah. Exact diagnosis.\n\nFifteen years building abstraction layers. Data models. Schema. Everything compressed into measurable signals.\n\nThe compression algorithm lost critical information. Wide enough to kill my basil.",
          helping: "That's... yeah. You see it.\n\nFifteen years trusting systems over my own senses. Numbers over intuition. Dashboards over care.\n\nThe gap between what I measure and what's real is wide enough to kill my basil.",
          building: "That's... yeah. That's the structural failure.\n\nFifteen years constructing interfaces between reality and understanding. Clean architecture. Elegant abstractions.\n\nBuilt a layer so thick I can't see the ground anymore. Wide enough to kill my basil.",
          exploring: "That's... yeah. You found it.\n\nFifteen years mapping reality into data. Every corner explored, categorized, compressed.\n\nThe map is so detailed I forgot to look at the actual territory. Wide enough to kill my basil.",
          patience: "That's... yeah. That's it.\n\nFifteen years rushing to instrument everything. Measure fast. React faster.\n\nForgot that plants don't work on refresh rates. The gap is wide enough to kill my basil."
        }
      }
    ],
    choices: [
      {
        choiceId: 'tell_gap',
        text: "Tell me more about that gap.",
        voiceVariations: {
          analytical: "What's the gap between what the data says and what's real?",
          helping: "Tell me more about that gap. I want to understand.",
          building: "Where's the gap? Between what you built and what you see?",
          exploring: "I'm curious about that gap. Tell me more.",
          patience: "Take your time. Tell me about that gap."
        },
        nextNodeId: 'silas_bankruptcy_reveal'
      }
    ]
  },
  {
    nodeId: 'silas_fear_seen_response',
    speaker: 'Silas',
    content: [
      {
        text: "...Yeah. I am.\n\nMost people look at this setup and see innovation. High-tech farming, the future of food security.\n\nThey don't see a terrified man holding dying plants while his tablet tells him everything is perfect.\n\nYou saw it immediately.",
        emotion: 'vulnerable',
        variation_id: 'fear_seen_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "...Yeah. I am.\n\nYou have this way of seeing through the surface. Most people don't look past the innovation. You saw the fear.\n\nThat's... rare.", altEmotion: 'grateful' },
          { pattern: 'patience', minLevel: 4, altText: "...Yeah. I am.\n\nYou didn't rush to fix it. You just named it. That's harder than solutions sometimes.\n\nYou saw it immediately.", altEmotion: 'vulnerable' }
        ]
      }
    ],
    choices: [
      { choiceId: 'fear_not_wrong', text: "Fear doesn't mean you're wrong.", archetype: 'OFFER_SUPPORT', nextNodeId: 'silas_bankruptcy_reveal' }
    ]
  },

  {
    nodeId: 'silas_bankruptcy_reveal',
    speaker: 'Silas',
    content: [
      {
        text: "I should be.\n\nI cashed out my Amazon stock options. All of it. Bought this vertical farm. \"High-Efficiency Aeroponics.\"\n\nLast quarter, the sensors said the pH was perfect. I lost the entire strawberry crop. $40,000 gone in a weekend.\n\nIf this basil dies, I lose the farm. I lose my house.",
        emotion: 'desperate',
        variation_id: 'bankruptcy_v1',
        interrupt: {
          duration: 3500,
          type: 'grounding',
          action: 'Kneel down and touch the soil yourself',
          targetNodeId: 'silas_interrupt_grounding',
          consequence: {
            characterId: 'silas',
            trustChange: 2
          }
        },
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "I should be.\n\nI cashed out my Amazon stock options. All of it. Built this from nothing.\n\nYou build things. You know what it's like to watch something you made fail. $40,000 gone in a weekend.\n\nIf this basil dies, I lose everything I built.", altEmotion: 'desperate' },
          { pattern: 'exploring', minLevel: 4, altText: "I should be.\n\nI cashed out my Amazon stock options. Took the leap. You understand that, don't you? The curiosity that leads you somewhere unknown.\n\nBut sometimes the unknown has cliffs.\n\nIf this basil dies, I lose the farm.", altEmotion: 'desperate' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'silas_stakes_high',
        text: "So why are you staring at the tablet?",
        archetype: 'CHALLENGE_ASSUMPTION',
        nextNodeId: 'silas_action_challenge_response',
        pattern: 'building',
        skills: ['actionOrientation'],
        visibleCondition: {
          patterns: { building: { min: 4 } }
        }
      },
      {
        choiceId: 'silas_fear_paralysis',
        text: "You're afraid to trust your eyes because they don't have an API.",
        archetype: 'MAKE_OBSERVATION',
        nextNodeId: 'silas_api_trust_response',
        pattern: 'analytical',
        skills: ['psychology'],
        visibleCondition: {
          patterns: { analytical: { min: 5 } }
        }
      }
    ]
  },

  // Divergent responses for bankruptcy reveal
  {
    nodeId: 'silas_action_challenge_response',
    speaker: 'Silas',
    content: [
      {
        text: "Because... because the tablet is supposed to know. That's why I bought it. That's why I built this whole system.\n\nBut the tablet doesn't know, does it? The basil knows. My hands know. The tablet just measures.",
        emotion: 'dawning_realization',
        variation_id: 'action_challenge_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "Because the tablet is supposed to know. That's why I built this system.\n\nYou're a builder too. You understand. Sometimes the thing you built becomes the thing that blinds you.\n\nThe basil knows. The tablet just measures.", altEmotion: 'recognized' },
          { pattern: 'analytical', minLevel: 4, altText: "Because the tablet is supposed to know.\n\nYou see the gap in the logic, don't you? Measurement isn't knowledge. Data isn't truth.\n\nI built an abstraction and forgot the territory underneath.", altEmotion: 'dawning' }
        ]
      }
    ],
    choices: [
      { choiceId: 'hands_tell', text: "So what do your hands tell you?", archetype: 'EXPRESS_CURIOSITY', nextNodeId: 'silas_simulation_start' }
    ]
  },
  {
    nodeId: 'silas_api_trust_response',
    speaker: 'Silas',
    content: [
      {
        text: "God. That's it, isn't it?\n\nFifteen years at Amazon. Every decision backed by data. Every insight validated by metrics.\n\nI forgot how to trust anything that doesn't come with a confidence interval.\n\nThe soil is telling me something. And I keep looking for a JSON payload to confirm it.",
        emotion: 'self_aware_pain',
        variation_id: 'api_trust_v1',
        voiceVariations: {
          analytical: "God. That's it, isn't it?\n\nFifteen years at Amazon. Every decision backed by data. P-values. A/B tests. Statistical significance.\n\nI can't process perception without validation anymore.\n\nThe soil is sending signals. And I keep waiting for structured data to parse it.",
          helping: "God. That's it, isn't it?\n\nFifteen years at Amazon. Every decision validated by metrics. Nothing trusted without proof.\n\nI forgot how to listen to my own instincts. To care without numbers.\n\nThe soil is telling me it's dying. And I keep looking for dashboard confirmation.",
          building: "God. That's it, isn't it?\n\nFifteen years at Amazon. Every system built on metrics. Every decision architected with data.\n\nI can't trust anything I can't instrument anymore.\n\nThe soil is showing cracks in the foundation. And I keep looking for logs to prove it.",
          exploring: "God. That's it, isn't it?\n\nFifteen years at Amazon. Every path validated by data. Every discovery measured.\n\nI forgot how to explore without a map. To trust what I find without coordinates.\n\nThe soil is revealing something. And I keep looking for documentation to confirm it.",
          patience: "God. That's it, isn't it?\n\nFifteen years at Amazon. Everything optimized for speed. Instant validation. Real-time metrics.\n\nI forgot how to wait. To trust slow signals without immediate confirmation.\n\nThe soil is speaking at its own pace. And I keep refreshing for faster updates."
        },
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "God. That's it, isn't it?\n\nFifteen years at Amazon. Every decision backed by data.\n\nYou're an analyst too. You see the trap. When everything requires validation, you lose the ability to perceive without processing.", altEmotion: 'recognized' },
          { pattern: 'patience', minLevel: 4, altText: "God. That's it, isn't it?\n\nI forgot how to trust anything without a confidence interval.\n\nYou understand slowness. Sometimes the signal takes longer than the refresh rate allows.", altEmotion: 'dawning' }
        ]
      }
    ],
    choices: [
      { choiceId: 'listen_soil', text: "What if you just... listened to the soil?", archetype: 'SHARE_PERSPECTIVE', nextNodeId: 'silas_simulation_start' }
    ]
  },

  {
    nodeId: 'silas_tech_defense',
    speaker: 'Silas',
    content: [
      {
        text: "It's not drift! These are military-grade hygrometers. They cost more than my truck.\n\nThey CAN'T be wrong. Because if they're wrong, then I don't know anything. I'm just a guy playing in the dirt with expensive toys.",
        emotion: 'defensive_panic',
        variation_id: 'tech_defense_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_look_down',
        text: "Look at the dirt, Silas.",
        archetype: 'TAKE_ACTION',
        nextNodeId: 'silas_simulation_start',
        pattern: 'helping',
        skills: ['groundedResearch']
      }
    ]
  },

  // ============= SCENE 3: SILAS'S ORIGIN =============
  {
    nodeId: 'silas_amazon_story',
    speaker: 'Silas',
    content: [
      {
        text: "You want to know how I got here?\n\nTen years at Amazon Web Services. Principal Engineer. I designed infrastructure that handled Black Friday traffic.\n\nMillions of requests per second, and I made them flow. I was good at it. Really good.\n\nBut I never touched what I was building. It was all abstractions.",
        emotion: 'reflective',
        variation_id: 'amazon_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_amazon_why_leave',
        text: "Why did you leave?",
        nextNodeId: 'silas_burnout_story',
        pattern: 'helping',
        skills: ['curiosity', 'emotionalIntelligence']
      },
      {
        choiceId: 'silas_amazon_farming',
        text: "From AWS to farming. That's quite a pivot.",
        nextNodeId: 'silas_pivot_reason',
        pattern: 'analytical',
        skills: ['curiosity']
      }
    ],
    tags: ['silas_arc', 'backstory']
  },

  {
    nodeId: 'silas_burnout_story',
    speaker: 'Silas',
    content: [
      {
        text: "There was an outage. Big one. Three hours of downtime. Cost the company millions.\n\nWe fixed it. I stayed up for 36 hours straight, tracing the bug through layers of abstraction.\n\nFound it in a race condition in a service I'd never heard of.",
        emotion: 'humbled_realization',
        variation_id: 'burnout_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_burnout',
        text: "[Continue]",
        nextNodeId: 'silas_burnout_story_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },
  {
    nodeId: 'silas_burnout_story_2',
    speaker: 'Silas',
    content: [
      {
        text: "When it was over, I went home, sat in my backyard, and looked at a tomato plant my neighbor had given me. It was dying. I didn't know how to save it.\n\nI could orchestrate a million servers, but I couldn't keep one plant alive.",
        emotion: 'humbled_realization',
        variation_id: 'burnout_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'silas_burnout_continue',
        text: "That's when you decided to change.",
        nextNodeId: 'silas_learning_soil',
        pattern: 'helping',
        skills: ['empathy']
      }
    ]
  },

  {
    nodeId: 'silas_pivot_reason',
    speaker: 'Silas',
    content: [
      {
        text: "I thought I understood systems. Turns out I only understood one kind.\n\nCloud infrastructure is forgiving. You can roll back. You can restart. You can scale horizontally.\n\nA plant? If you kill it, it's dead. No rollbacks. No retries. Just consequences.\n\nI wanted to learn the kind of system that doesn't forgive.",
        emotion: 'determined',
        variation_id: 'pivot_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_pivot_continue',
        text: "Did you find someone to teach you?",
        nextNodeId: 'silas_learning_soil',
        pattern: 'helping',
        skills: ['curiosity']
      }
    ]
  },

  {
    nodeId: 'silas_learning_soil',
    speaker: 'Silas',
    content: [
      {
        text: "There was an old farmer at the market. Mr. Hawkins. Eighty years old, hands like tree bark.\n\nI asked him: \"How do you know when to water?\"\n\nHe looked at me like I was crazy. \"I look at the plant. I touch the soil. I smell the air.\"\n\nNo sensors. No dashboard. Just attention.",
        emotion: 'reverent',
        variation_id: 'learning_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_hawkins_teach',
        text: "Did he teach you?",
        voiceVariations: {
          analytical: "Did he teach you his methodology? How he calibrated his senses?",
          helping: "Did he teach you? What was it like to learn from him?",
          building: "Did he teach you? Did you apprentice with him?",
          exploring: "What did he teach you? I want to know.",
          patience: "Did he take you under his wing? Teach you slowly?"
        },
        nextNodeId: 'silas_hawkins_lesson',
        pattern: 'helping',
        skills: ['curiosity', 'patience'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_hawkins_tech',
        text: "And you thought technology could replace that attention?",
        nextNodeId: 'silas_tech_hubris',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['silas_arc', 'mentor']
  },

  {
    nodeId: 'silas_hawkins_lesson',
    speaker: 'Silas',
    content: [
      {
        text: "Every Saturday for two years. He'd wake up at 4 AM, and I'd be there.\n\nHe never used a single sensor. Never even had a thermometer. He'd stick his finger in the dirt and tell you the moisture content within 5%.\n\n\"The soil talks,\" he'd say. \"You just have to learn its language.\"\n\nI thought I could encode that language into software. I thought I could scale Mr. Hawkins.",
        emotion: 'nostalgic_guilt',
        variation_id: 'hawkins_lesson_v1',
        voiceVariations: {
          analytical: "Every Saturday for two years. 4 AM. I collected data points.\n\nHe never used instruments. Just finger in dirt. 5% accuracy without calibration.\n\n\"The soil talks,\" he'd say. \"Learn its language.\"\n\nI thought I could train a model on his heuristics. Extract the algorithm. Scale Mr. Hawkins.",
          helping: "Every Saturday for two years. He'd wake up at 4 AM, and I'd show up.\n\nHe never needed sensors. Just his hands and care. He'd know the moisture within 5%.\n\n\"The soil talks,\" he'd say. \"You just have to listen.\"\n\nI thought I could bottle that care. Share it with thousands. I thought I could help more people by scaling Mr. Hawkins.",
          building: "Every Saturday for two years. He'd wake up at 4 AM. I apprenticed.\n\nHe never built systems. Just direct connection. Finger in dirt. 5% precision.\n\n\"The soil talks,\" he'd say. \"Learn its language.\"\n\nI thought I could engineer that connection. Build it into infrastructure. I thought I could scale Mr. Hawkins.",
          exploring: "Every Saturday for two years. 4 AM starts. I was discovering something new.\n\nHe never mapped with tools. Just exploration through touch. 5% accuracy from intuition.\n\n\"The soil talks,\" he'd say. \"Learn its language.\"\n\nI thought I could chart that knowledge. Make it navigable for others. I thought I could scale Mr. Hawkins.",
          patience: "Every Saturday for two years. He'd wake up at 4 AM. I gave it time.\n\nHe never rushed. Never measured. Just patient attention. Sixty years learning soil's pace.\n\n\"The soil talks,\" he'd say. \"Slow down and listen.\"\n\nI thought I could speed that up. Compress sixty years into software. I thought I could scale Mr. Hawkins."
        }
      }
    ],
    choices: [
      {
        choiceId: 'silas_scale_mistake',
        text: "But some things don't scale.",
        voiceVariations: {
          analytical: "Some things don't scale. Wisdom has no API.",
          helping: "His knowledge was in his hands. That doesn't scale.",
          building: "You can't mass-produce sixty years of attention.",
          exploring: "What if his gift couldn't be encoded? Some things don't scale.",
          patience: "Sixty years of slow learning. That doesn't scale."
        },
        nextNodeId: 'silas_strawberry_detail',
        pattern: 'analytical',
        skills: ['wisdom']
      }
    ]
  },

  {
    nodeId: 'silas_tech_hubris',
    speaker: 'Silas',
    content: [
      {
        text: "I thought I could improve it. Engineer around the human limitation.\n\nMr. Hawkins could only tend one farm. My sensors could tend thousands. That was the pitch to myself.\n\nBut I forgot something. Mr. Hawkins never lost a crop. Not once in sixty years.\n\nI've been farming for two years and I've lost three.",
        emotion: 'chastened',
        variation_id: 'hubris_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_failures_detail',
        text: "Tell me about the failures.",
        nextNodeId: 'silas_strawberry_detail',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'courage']
      }
    ]
  },

  // ============= SCENE 4: THE STRAWBERRY DISASTER =============
  {
    nodeId: 'silas_strawberry_detail',
    speaker: 'Silas',
    content: [
      {
        text: "The strawberries. That was the worst.\n\nThe pH sensor said 6.5. Perfect for strawberries. But the sensor was in the wrong spot. Edge of the bed, where the water pooled.\n\nThe center of the bed was at 5.2. Too acidic. The plants couldn't absorb iron.\n\nThey looked healthy for weeks. Green leaves, good structure. Then one morning, yellow. Chlorosis. Iron deficiency. Dead in 48 hours.",
        emotion: 'haunted',
        variation_id: 'strawberry_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_strawberry_lesson',
        text: "The sensor told you what was true at one point. Not what was true everywhere.",
        nextNodeId: 'silas_sensor_problem',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      },
      {
        choiceId: 'silas_strawberry_feel',
        text: "That must have been devastating.",
        archetype: 'ACKNOWLEDGE_EMOTION',
        nextNodeId: 'silas_sensor_problem',
        pattern: 'helping',
        skills: ['empathy']
      }
    ],
    tags: ['silas_arc', 'failure_story'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  {
    nodeId: 'silas_sensor_problem',
    speaker: 'Silas',
    content: [
      {
        text: "Exactly. A sensor gives you one number. One point in space, one moment in time.\n\nMr. Hawkins would walk the whole field. Touch soil in twenty spots. Smell it. Taste it sometimes.\n\nHe had a mental model of the whole system. I had a dashboard with green checkmarks.\n\nThe checkmarks were true. They just weren't complete.",
        emotion: 'understanding',
        variation_id: 'sensor_problem_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_current_crisis',
        text: "And now the basil?",
        nextNodeId: 'silas_simulation_start',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ]
  },

  // ============= SCENE 5: THE SIMULATION: THE DROUGHT =============
  {
    nodeId: 'silas_simulation_start',
    speaker: 'Silas',
    content: [
      {
        text: "Look at this dashboard. Zone 4: 65% humidity. Optimal. Flow rate: 2.5 liters. Valve open.\n\nEverything is fine. According to this.\n\nBut look at them. They're gasping.\n\nI override and flood them? Rot the roots. Do nothing? Dried out by morning.",
        emotion: 'paralyzed',
        variation_id: 'sim_start_v2',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
    simulation: {
      type: 'dashboard_triage',
      title: 'Ground Truth Diagnostic',
      taskDescription: 'The dashboard says everything is optimal, but the plants are dying. Something is lying. Find the discrepancy between sensor data and physical reality.',
      initialContext: {
        label: 'FarmOS Dashboard - Zone 4 (Basil)',
        content: `SENSOR ARRAY STATUS: ALL GREEN
================================
Humidity Sensor [Z4-H01]:  65% (OPTIMAL)
Soil Moisture [Z4-SM01]:   42% (OPTIMAL)
Flow Rate [Z4-FL01]:       2.5 L/hr (ACTIVE)
Valve Position [Z4-V01]:   OPEN
pH Level [Z4-PH01]:        6.4 (OPTIMAL)
Temperature [Z4-T01]:      72°F (OPTIMAL)

VISUAL OBSERVATION (manual):
- Leaves curling inward
- Soil surface appears dry/cracked
- Plants wilting despite "optimal" moisture

QUESTION: If sensors are correct, why are plants dying?
HINT: Sensors measure WHERE they're placed...`,
        displayStyle: 'code'
      },
      successFeedback: '✓ ROOT CAUSE: Sensor placement error. Moisture sensor at bed edge (wet). Bed center is dry. The map is not the territory.'
    },
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'sim_trust_sensor',
        text: "Trust the data. Run a diagnostic on the valve software.",
        nextNodeId: 'silas_sim_fail_software',
        pattern: 'analytical', // Wrong tool
        skills: ['digitalLiteracy']
      },
      {
        choiceId: 'sim_physical_trace',
        text: "Follow the pipe. Physically trace the water line from the tank to the bed.",
        nextNodeId: 'silas_sim_step_2',
        pattern: 'building',
        skills: ['systemsThinking', 'observation']
      },
      {
        choiceId: 'sim_override_flood',
        text: "Manual Override. Open the emergency floodgates NOW.",
        nextNodeId: 'silas_sim_fail_rot',
        pattern: 'helping', // Panic reaction
        skills: ['crisisManagement']
      }
    ],
    tags: ['simulation', 'silas_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE 1: SOFTWARE TRAP ---
  {
    nodeId: 'silas_sim_fail_software',
    speaker: 'Silas',
    content: [
      {
        text: "You run the diagnostic. A loading bar spins.\n\nA green checkmark appears: \"NO ERRORS FOUND.\"\n\nA leaf falls off the basil plant. It crunches when it hits the floor.\n\nThe software says we're fine. The plant is dead.\n\nI can't do this. I'm going back to cloud computing. At least there, when it says 'Up', it means 'Up'.",
        emotion: 'defeated_hollow',
        variation_id: 'sim_fail_software_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'silas_give_up',
        text: "Maybe that's best.",
        nextNodeId: 'silas_bad_ending',
        pattern: 'patience',
        consequence: {
          addGlobalFlags: ['silas_chose_tech'] // BAD ENDING
        }
      },
      {
        choiceId: 'silas_retry_physical',
        text: "Stop looking at the screen! Look at the pipe!",
        nextNodeId: 'silas_simulation_start',
        pattern: 'helping',
        skills: ['urgency']
      }
    ]
  },

  // --- FAILURE STATE 2: ROOT ROT ---
  {
    nodeId: 'silas_sim_fail_rot',
    speaker: 'Silas',
    content: [
      {
        text: "You yank the manual lever. Water roars into the bed.\n\nThe dry soil turns to mud instantly. But the water doesn't drain. It sits there, stagnating.\n\nThe tablet flashes: \"ALERT: ROOT ANOXIA DETECTED.\"\n\nWe drowned them. The soil was compacted. It couldn't drain. Now they'll rot before morning.\n\nI panicked. I broke the system because I was scared.",
        emotion: 'guilt',
        variation_id: 'sim_fail_rot_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'silas_retry_calm',
        text: "We can drain it. But we need to find the blockage.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'patience',
        skills: ['resilience']
      }
    ]
  },

  // --- STEP 2: THE PHYSICAL BLOCK ---
  {
    nodeId: 'silas_sim_step_2',
    speaker: 'Silas',
    content: [
      {
        text: "You crawl under the rack. You trace the PVC pipe. It vibrates. There's water inside.\n\nBut right before the nozzle... a kink. A physical crimp in the line.\n\nThe sensor measures flow at the VALVE. The kink is AFTER the valve.\n\nThe sensor wasn't lying. It was measuring the wrong thing. It was measuring intent, not delivery.",
        emotion: 'epiphany',
        variation_id: 'sim_step_2_v2',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'sim_uncrimp',
        text: "Unkink the pipe. Restore the flow.",
        nextNodeId: 'silas_sim_success',
        pattern: 'building',
        skills: ['actionOrientation']
      }
    ],
    tags: ['simulation', 'silas_arc']
  },

  {
    nodeId: 'silas_sim_success',
    speaker: 'Silas',
    content: [
      {
        text: "A hiss of air, then a steady trickle of water. The soil darkens.\n\nSilas touches the wet dirt. He closes his eyes.\n\nGround truth.\n\nI spent all year coding dashboards to avoid crawling in the dirt. But the answer was in the dirt.",
        emotion: 'humbled',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        thoughtId: 'green-frontier',
        addKnowledgeFlags: ['silas_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'silas_lesson',
        text: "You can't farm from a dashboard.",
        voiceVariations: {
          analytical: "The dashboard abstracts reality. You can't farm abstractions.",
          helping: "The soil needs your hands, not your screens.",
          building: "You built a monitoring system. But farming isn't monitoring.",
          exploring: "The dashboard shows what it measures. Reality is everything else.",
          patience: "Some things require presence. Not dashboards."
        },
        nextNodeId: 'silas_climax_decision',
        pattern: 'analytical',
        skills: ['groundedResearch']
      }
    ],
    tags: ['simulation_complete', 'silas_arc']
  },

  // ============= THE TURN =============
  {
    nodeId: 'silas_climax_decision',
    speaker: 'Silas',
    content: [
      {
        text: "Systems are everywhere. I saw a kid, Devon, drawing flowcharts for his dad. He gets it. A family is just a network that needs maintenance.\n\nBut I'm done with 'Smart Farming.'\n\nI'm going to start a 'Feral Lab.' Low-tech. High-biology.\n\nWe teach engineers how to touch grass. Real grass. How to listen to a system that doesn't have an API.",
        emotion: 'resolved_grounded',
        variation_id: 'climax_v2'
      }
    ],
    choices: [
      {
        choiceId: 'silas_feral_more',
        text: "Tell me more about this Feral Lab.",
        nextNodeId: 'silas_feral_concept',
        pattern: 'exploring',
        skills: ['curiosity'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_farewell_quick',
        text: "Touch grass, Silas.",
        nextNodeId: 'silas_farewell',
        pattern: 'helping',
        skills: ['humor']
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        addKnowledgeFlags: ['silas_chose_soil']
      }
    ],
    tags: ['ending', 'silas_arc']
  },

  // ============= SCENE 6: THE FERAL LAB VISION =============
  {
    nodeId: 'silas_feral_concept',
    speaker: 'Silas',
    content: [
      {
        text: "I've been sketching this for months. The \"Feral Lab.\"\n\nNot a coding bootcamp. Not an accelerator. A deceleration program.\n\nWe take burnt-out engineers. People like I was. And we put them in a greenhouse. No WiFi. No Slack. Just seeds, soil, and time.",
        emotion: 'excited',
        variation_id: 'feral_concept_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_feral_why',
        text: "Why 'feral'?",
        nextNodeId: 'silas_feral_name',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'silas_feral_works',
        text: "Has anyone actually done this?",
        nextNodeId: 'silas_first_workshop',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['silas_arc', 'feral_lab']
  },

  {
    nodeId: 'silas_feral_name',
    speaker: 'Silas',
    content: [
      {
        text: "Feral: wild, having escaped domestication.\n\nTech workers are domesticated. We've been trained to respond to notifications, to measure our worth in metrics, to fear uncertainty.\n\nFeral means rewilding. Teaching people to trust their senses again. To be comfortable not knowing.\n\nMr. Hawkins never googled anything. He just watched. For sixty years. And he knew more about soil than any PhD I've met.",
        emotion: 'philosophical',
        variation_id: 'feral_name_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_feral_tried',
        text: "Have you tested this idea?",
        nextNodeId: 'silas_first_workshop',
        pattern: 'analytical',
        skills: ['pragmatism']
      }
    ]
  },

  {
    nodeId: 'silas_first_workshop',
    speaker: 'Silas',
    content: [
      {
        text: "Three months ago, I ran a pilot. Six engineers from the tech park downtown. One weekend.\n\nOne guy, Marcus. Not the paramedic, different Marcus. Came in with three phones. Product manager at a startup. Couldn't sit still for ten minutes.\n\nBy Sunday, he was talking to a tomato plant. Not ironically. He'd realized the plant's leaves were telling him it was thirsty before any sensor could.",
        emotion: 'proud',
        variation_id: 'first_workshop_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_workshop_changed',
        text: "Did it stick? Did he change?",
        nextNodeId: 'silas_workshop_result',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'silas_workshop_curriculum',
        text: "What's the actual curriculum?",
        nextNodeId: 'silas_curriculum_design',
        pattern: 'analytical',
        skills: ['curriculumDesign']
      }
    ],
    tags: ['silas_arc', 'feral_lab'],
    metadata: {
      sessionBoundary: true  // Session 2: Crossroads complete
    }
  },

  {
    nodeId: 'silas_workshop_result',
    speaker: 'Silas',
    content: [
      {
        text: "He quit his startup three weeks later. Started a consulting practice. Works half the hours.\n\nBut here's the thing. He's not less productive. He's more productive. He just stopped confusing activity with progress.\n\nLast week he sent me a photo. His company built a meditation garden at their office. He's teaching his team to debug their minds before they debug code.",
        emotion: 'satisfied',
        variation_id: 'workshop_result_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_ground_truth_ask',
        text: "Is that what 'ground truth' really means?",
        nextNodeId: 'silas_ground_truth_philosophy',
        pattern: 'exploring',
        skills: ['wisdom']
      }
    ]
  },

  {
    nodeId: 'silas_curriculum_design',
    speaker: 'Silas',
    content: [
      {
        text: "Week One: Observation. No phones. You sit in the greenhouse and draw what you see. Every day, the same plant. You notice things change.\n\nWeek Two: Failure. You grow something that will definitely die. You watch it die. You learn that death isn't a bug. It's part of the system.\n\nWeek Three: Integration. You design a sensor. But the rule is: the sensor can only confirm what you already suspected from looking. It's a check, not a crutch.",
        emotion: 'pedagogical',
        variation_id: 'curriculum_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_curriculum_works',
        text: "What do people learn by week three?",
        nextNodeId: 'silas_integration_lesson',
        pattern: 'exploring',
        skills: ['learningAgility']
      }
    ],
    tags: ['silas_arc', 'feral_lab']
  },

  {
    nodeId: 'silas_integration_lesson',
    speaker: 'Silas',
    content: [
      {
        text: "That technology should amplify human judgment, not replace it.\n\nBy week three, they've developed intuition. The sensor becomes a tool for calibrating that intuition. Not a substitute for it.\n\nOne woman, a data scientist, said something that stuck with me: \"I used to think dashboards showed me reality. Now I know they show me someone's decision about what to measure.\"\n\nThat's the shift. Sensors don't lie. They just answer the question you asked. The wisdom is in asking the right question.",
        emotion: 'teaching',
        variation_id: 'integration_v1',
        skillReflection: [
          { skill: 'technicalLiteracy', minLevel: 5, altText: "Technology should amplify judgment, not replace it. You've got technical literacy—I can tell.\n\nBy week three, people develop intuition. Sensors calibrate that intuition. Not substitute for it.\n\nA data scientist told me: 'Dashboards show someone's decision about what to measure.' Your technical skills help you understand that. Sensors answer the question you asked. Wisdom is asking the right question.", altEmotion: 'knowing' },
          { skill: 'observation', minLevel: 5, altText: "Technology should amplify judgment. You observe carefully—I've noticed how you watch things.\n\nBy week three, people develop intuition. Your observation skills are that intuition. Sensors just calibrate what you already see.\n\nDashboards show decisions about what to measure. Your observation catches what dashboards miss. Sensors answer questions. Observation asks the right ones.", altEmotion: 'appreciative' }
        ],
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You think analytically. So understand this critical distinction.\n\nTechnology should amplify human judgment, not replace it. By week three, they develop intuition. Sensors calibrate that intuition—not substitute.\n\nA data scientist told me: 'Dashboards show someone's decision about what to measure.' That's the analytical insight.\n\nSensors don't lie. They answer the question you asked. The wisdom is asking the right question. Your analytical mind needs to choose what to measure.", altEmotion: 'teaching_serious' },
          { pattern: 'building', minLevel: 4, altText: "You're a builder. So build with this principle.\n\nTechnology should amplify human judgment, not replace it. Build sensors that calibrate intuition, not substitute for it.\n\nDashboards show reality? No. They show your decision about what to measure. Build consciously.\n\nSensors don't lie—they answer the question you built into them. The wisdom is in the architecture. Build tools that amplify humans, not replace them.", altEmotion: 'teaching' },
          { pattern: 'patience', minLevel: 4, altText: "You're patient. That patience matters here.\n\nTechnology should amplify judgment. By week three—with patience—people develop intuition. Sensors calibrate slowly-built intuition.\n\nRushing to dashboards skips the patient development of judgment. Dashboards show what you chose to measure. Not reality.\n\nSensors answer the question you asked. Wisdom is in patiently asking the right question. Your patience builds better judgment than any sensor.", altEmotion: 'mentoring' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'silas_philosophy_deeper',
        text: "What's the deeper philosophy here?",
        nextNodeId: 'silas_ground_truth_philosophy',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ]
  },

  {
    nodeId: 'silas_ground_truth_philosophy',
    speaker: 'Silas',
    content: [
      {
        text: "Ground truth. It's a surveying term. The actual measurement from the field, not the model.\n\nMy hands are calloused now.\n\nBut I think it's bigger than that. Ground truth is what happens when you stop mediating reality through screens and actually touch it.\n\nMr. Hawkins had ground truth. He could feel a storm coming before the barometer dropped. Not magic. Just sixty years of paying attention to things that don't have notification sounds.",
        emotion: 'reverent',
        variation_id: 'philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_hawkins_now',
        text: "Where is Mr. Hawkins now?",
        nextNodeId: 'silas_hawkins_death',
        pattern: 'helping',
        skills: ['empathy']
      },
      {
        choiceId: 'silas_future_vision',
        text: "Where do you see this going?",
        nextNodeId: 'silas_final_vision',
        pattern: 'exploring',
        skills: ['strategicThinking']
      },
      {
        choiceId: 'silas_deep_dive_trigger',
        text: "[Deep Dive] You said Ground Truth is a measurement. Let's measure the ghost signal.",
        nextNodeId: 'silas_deep_dive',
        pattern: 'analytical',
        skills: ['systemsThinking', 'technicalLiteracy'],
        visibleCondition: {
          trust: { min: 0 },
          patterns: { analytical: { min: 0 } }
        },
        preview: "Initiating Network Drift Diagnostic",
        interaction: 'bloom'
      }
    ],
    tags: ['silas_arc', 'philosophy']
  },

  {
    nodeId: 'silas_hawkins_death',
    speaker: 'Silas',
    content: [
      {
        text: "He passed last spring. In his garden. His daughter found him kneeling in the strawberry bed.\n\nAt his funeral, there were no PowerPoints. No eulogies. People just told stories about things he'd taught them. How to read clouds. When to plant by the moon. How to make compost that smelled like coffee instead of rot.\n\nHe left me his trowel. It's 50 years old. The handle is worn smooth from his hands.",
        emotion: 'grief_gratitude',
        variation_id: 'hawkins_death_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_legacy',
        text: "He's why you're doing this.",
        nextNodeId: 'silas_final_vision',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['silas_arc', 'mentor']
  },

  {
    nodeId: 'silas_final_vision',
    speaker: 'Silas',
    content: [
      {
        text: "I want to scale Mr. Hawkins. But not through software.\n\nOne workshop at a time. One burnt-out engineer learning to feel the difference between wet soil and dry.\n\nOne product manager realizing that \"move fast and break things\" doesn't work when the thing you break is alive.",
        emotion: 'resolved_peaceful',
        variation_id: 'final_vision_v1_part1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_final_vision',
        text: "[Continue]",
        nextNodeId: 'silas_final_vision_2',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },
  {
    nodeId: 'silas_final_vision_2',
    speaker: 'Silas',
    content: [
      {
        text: "The goal isn't to reject technology. It's to remember that we're the sensors. We're the real-time processing.\n\nThe dashboards should serve us, not the other way around.\n\nThe basil is already perking up. The water finally reached its roots.",
        emotion: 'resolved_peaceful',
        variation_id: 'final_vision_v1_part2'
      }
    ],
    choices: [
      {
        choiceId: 'continue_final_vision_2',
        text: "[Continue]",
        nextNodeId: 'silas_final_vision_3',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },
  {
    nodeId: 'silas_final_vision_3',
    speaker: 'Silas',
    content: [
      {
        text: "Ground truth. It's not just about farming. It's about how we know what we know.",
        emotion: 'resolved_peaceful',
        variation_id: 'final_vision_v1_part3'
      }
    ],
    choices: [
      {
        choiceId: 'silas_farewell_deep',
        text: "Keep growing, Silas.",
        nextNodeId: 'silas_farewell_good',
        pattern: 'helping',
        skills: ['encouragement']
      },
      // Career observation route (ISP: Only visible when pattern combo is achieved)
      {
        choiceId: 'career_precision',
        text: "Your precision combined with patience... that's advanced manufacturing thinking.",
        nextNodeId: 'silas_career_reflection_precision',
        pattern: 'building',
        skills: ['systemsThinking', 'criticalThinking'],
        visibleCondition: {
          patterns: { building: { min: 6 }, patience: { min: 4 } },
          lacksGlobalFlags: ['silas_mentioned_career']
        }
      },
      {
        choiceId: 'silas_farewell_deep_alt',
        text: "Ground truth. I'll remember that.",
        nextNodeId: 'silas_farewell_good',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['silas_full_arc_complete'],
        thoughtId: 'trust-process'
      }
    ],
    tags: ['silas_arc', 'ending']
  },

  // ============= INTERRUPT TARGET NODES =============
  {
    nodeId: 'silas_interrupt_grounding',
    speaker: 'Silas',
    content: [
      {
        text: "It's... it's dry. The middle is dry.\n\nMr. Hawkins used to do that. Just touch it. No sensors. No apps. Just his hands and sixty years of knowing.\n\nI forgot. I got so lost in the data, I forgot the most basic thing. The soil tells you what it needs. If you listen.\n\nThank you. For getting your hands dirty with me.",
        emotion: 'grateful_grounded',
        interaction: 'bloom',
        variation_id: 'interrupt_grounding_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_from_interrupt',
        text: "Sometimes the answer is under your feet.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'patience',
        skills: ['groundedResearch'],
        consequence: {
          characterId: 'silas',
          trustChange: 1
        }
      }
    ],
    tags: ['silas_arc', 'interrupt_response']
  },

  // ============= VULNERABILITY ARC (Trust ≥ 6) =============
  // "What he never told Mr. Hawkins" - regret and unfinished gratitude
  {
    nodeId: 'silas_vulnerability_arc',
    speaker: 'Silas',
    content: [
      {
        text: "There's something I never told anyone.\n\nThe day before Mr. Hawkins died... I was supposed to visit. Bring him the first harvest from my farm. Show him I'd learned something.\n\nI cancelled. Had a \"critical system update\" to run. Told myself I'd go next week.\n\nThere wasn't a next week.\n\nHe died alone in his garden. And I was staring at a dashboard. Making sure my sensors were calibrated.\n\nI never got to say thank you. Never got to show him that his sixty years of wisdom had found a home in someone.",
        emotion: 'grief_regret',
        variation_id: 'vulnerability_v1',
        richEffectContext: 'warning',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "You analyze patterns. Maybe you can understand this failure mode.\n\nThe day before Mr. Hawkins died... I was supposed to visit. Bring him the first harvest. Show him I'd learned something.\n\nI cancelled. Had a \"critical system update\" to run. The data said it was urgent. The algorithm prioritized the system over the human.\n\nThere wasn't a next week.\n\nHe died alone in his garden. And I was optimizing sensor calibration. Treating presence as a lower-priority task.\n\nI never got to say thank you. The analytical mind can measure everything except what matters.",
            altEmotion: 'analytical_grief'
          },
          {
            pattern: 'patience',
            minLevel: 5,
            altText: "You understand patience. The cost of rushing.\n\nThe day before Mr. Hawkins died... I was supposed to visit. Bring him the first harvest. Show him I'd learned something.\n\nI cancelled. Had a \"critical system update.\" Couldn't wait. Had to fix it immediately.\n\nMr. Hawkins taught me that plants don't work on sprint cycles. But I forgot people don't either.\n\nThere wasn't a next week.\n\nHe died alone in his garden. And I was rushing through a dashboard update that could have waited.\n\nI never got to say thank you. Because I forgot that some things can't be rescheduled.",
            altEmotion: 'regretful'
          },
          {
            pattern: 'exploring',
            minLevel: 5,
            altText: "You explore. You discover. Maybe you can map this blind spot I had.\n\nThe day before Mr. Hawkins died... I was supposed to visit. Bring him the first harvest. Show him I'd learned something.\n\nI cancelled. Had a \"critical system update.\" New territory to explore in the codebase. A bug I was curious about.\n\nThe curiosity that should have led me to his garden led me to a screen instead.\n\nThere wasn't a next week.\n\nHe died alone in his garden. And I was exploring the wrong territory. Mapping systems instead of sitting with my mentor.\n\nI never got to say thank you. The explorer who forgot the most important destination.",
            altEmotion: 'grief_regret'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You help people. You care. Maybe you can understand what I failed to do.\n\nThe day before Mr. Hawkins died... I was supposed to visit. Bring him the first harvest. Show him I'd learned something.\n\nI cancelled. Had a \"critical system update.\" Told myself the farm needed it. That I was helping future crops.\n\nBut Mr. Hawkins needed me. Not my optimized system. Just me. Present.\n\nThere wasn't a next week.\n\nHe died alone in his garden. And I was helping sensors instead of the human who taught me everything.\n\nI never got to say thank you. I chose to help systems instead of the person who mattered.",
            altEmotion: 'guilt'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You build things. You understand construction. Maybe you can see what I tore down.\n\nThe day before Mr. Hawkins died... I was supposed to visit. Bring him the first harvest. Show him I'd learned something.\n\nI cancelled. Had a \"critical system update.\" The infrastructure needed maintenance. The architecture needed fixing.\n\nI was building systems. But I destroyed the most important structure: the relationship with my mentor.\n\nThere wasn't a next week.\n\nHe died alone in his garden. And I was building dashboards instead of showing up for the man who built my foundation.\n\nI never got to say thank you. The builder who forgot that people are the most important thing we construct.",
            altEmotion: 'devastated'
          }
        ]
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'silas',
        addKnowledgeFlags: ['silas_vulnerability_revealed', 'knows_about_hawkins_regret']
      }
    ],
    choices: [
      {
        choiceId: 'silas_vuln_living_thanks',
        text: "You're thanking him now. Every workshop. Every student who learns to touch the soil.",
        nextNodeId: 'silas_vulnerability_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_vuln_he_knew',
        text: "He knew. Teachers always know which students were listening.",
        nextNodeId: 'silas_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      },
      {
        choiceId: 'silas_vuln_silence',
        text: "[Sit with him in the grief. Let the trowel speak.]",
        nextNodeId: 'silas_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      }
    ],
    tags: ['silas_arc', 'vulnerability', 'emotional_core']
  },

  {
    nodeId: 'silas_vulnerability_response',
    speaker: 'Silas',
    content: [
      {
        text: "You know what I think about? His hands made this smooth. Sixty years of use. Sixty years of presence.\n\nThe dashboard didn't kill him. But it kept me from being present. From being where I should have been.\n\nThat's what the Feral Lab is really about. Teaching people to be present. Before they miss the things that matter.\n\nEvery time a burnt-out engineer puts their hands in the soil... that's me saying thank you to Mr. Hawkins.\n\nThat's the only thank you that counts anymore.",
        emotion: 'resolved_tender',
        interaction: 'bloom',
        variation_id: 'vulnerability_response_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_vuln_to_farewell',
        text: "He'd be proud. I'm certain of it.",
        nextNodeId: 'silas_farewell_good',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'silas',
          trustChange: 1
        }
      }
    ],
    tags: ['silas_arc', 'vulnerability', 'resolution']
  },

  {
    nodeId: 'silas_farewell_good',
    speaker: 'Silas',
    content: [
      {
        text: "I will. And hey, if you ever burn out, come find me.\n\nI'll teach you how to grow something. Something that can't be debugged. Something that just grows.\n\nTell Samuel I said thanks. For building a station where people like me can find people like you.",
        emotion: 'warm',
        variation_id: 'farewell_good_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_silas_good',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.SILAS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['silas_arc_complete'],
        thoughtId: 'steady-hand'
      }
    ],
    tags: ['transition', 'silas_arc', 'good_ending'],
    metadata: {
      sessionBoundary: true  // Session 3: Resolution reached
    }
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'silas_bad_ending',
    speaker: 'Silas',
    content: [
      {
        text: "I'm listing the equipment on eBay tomorrow.\n\nI'll take a contract job. Database admin. Something air-conditioned. Something where I can't kill anything.\n\nSafe travels.",
        emotion: 'resigned',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.SILAS_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['silas_chose_tech', 'silas_arc_complete']
      }
    ],
    tags: ['ending', 'bad_ending', 'silas_arc']
  },

  {
    nodeId: 'silas_farewell',
    speaker: 'Silas',
    content: [
      {
        text: "I will.\n\nIf you see Samuel, tell him the sensor was wrong. The ground was right.",
        emotion: 'peaceful',
        variation_id: 'farewell_v2'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_silas',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.SILAS_REFLECTION_GATEWAY,
        pattern: 'exploring'
      },
      // Loyalty Experience trigger - only visible at high trust + patience pattern
      {
        choiceId: 'offer_feral_lab_help',
        text: "[Patient Observer] Silas, that experimental lab you mentioned... the one people called 'feral.' Want to show me?",
        nextNodeId: 'silas_loyalty_trigger',
        pattern: 'patience',
        skills: ['patience', 'problemSolving'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { patience: { min: 50 } },
          hasGlobalFlags: ['silas_arc_complete']
        }
      }
    ],
    tags: ['transition', 'silas_arc']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'silas_loyalty_trigger',
    speaker: 'Silas',
    content: [{
      text: "The Feral Lab.\n\nThat's what the investors called it when they pulled funding. Uncontrolled experiments. No reproducibility. A mess.\n\nBut it wasn't feral. It was emergent. I let the systems find their own equilibrium instead of forcing predetermined outcomes.\n\nI've got six months of sensor data. Patterns nobody else would have patience to see. Growth patterns that defy the textbooks.\n\nBut the funding's gone. Lab access expires next week. If I don't document what I learned, it's lost forever.\n\nYou understand patience. Watching systems unfold. Would you... help me make sense of it before it disappears?",
      emotion: 'anxious_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { patience: { min: 5 } },
      hasGlobalFlags: ['silas_arc_complete']
    },
    metadata: {
      experienceId: 'the_feral_lab'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_feral_lab_challenge',
        text: "Show me the lab. We'll document it together.",
        nextNodeId: 'silas_loyalty_start',
        pattern: 'patience',
        skills: ['patience', 'problemSolving'],
        consequence: {
          characterId: 'silas',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Silas, you know what you saw. Trust your observations.",
        nextNodeId: 'silas_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'silas_loyalty', 'high_trust']
  },

  {
    nodeId: 'silas_loyalty_declined',
    speaker: 'Silas',
    content: [{
      text: "You're right. Six months. Every day. I watched those systems.\n\nI know what I saw. The data is there. The patterns are real.\n\nI don't need external validation to trust six months of careful observation.\n\nThank you. Sometimes I forget that patience itself is a form of evidence.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "Trust the ground. It was right all along.",
        nextNodeId: samuelEntryPoints.SILAS_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'silas_loyalty_start',
    speaker: 'Silas',
    content: [{
      text: "Thank you. I've been afraid to face it alone. Afraid I'll look and see nothing but chaos.\n\nBut with you... maybe we'll see what I've been too close to notice.\n\nLet's go to the Feral Lab. Two patient observers. One emergent system. Let's see what it was trying to tell us.",
      emotion: 'hopeful_determined',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_feral_lab'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'silas_career_reflection_precision',
    speaker: 'Silas',
    content: [
      {
        text: "You build things with patience. Not rushing, not cutting corners.\n\nAdvanced manufacturing specialists work like that. Craftspeople of the future. Precision meets innovation.\n\nMercedes, Honda. They've got facilities near Birmingham. They need people who understand that quality takes time.",
        emotion: 'respectful',
        variation_id: 'career_precision_v1'
      }
    ],
    requiredState: {
      patterns: {
        building: { min: 6 },
        patience: { min: 4 }
      }
    },
    onEnter: [
      {
        characterId: 'silas',
        addGlobalFlags: ['combo_precision_maker_achieved', 'silas_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'silas_career_precision_continue',
        text: "Quality over speed. That's a good principle.",
        nextNodeId: 'silas_hub_return',
        pattern: 'building'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'manufacturing']
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'silas_mystery_hint',
    speaker: 'silas',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I've worked with my hands my whole life. Metal, wood, machinery. I understand how things are made.\\n\\nBut this station... I can't figure out how it was built. Or who built it.",
        emotion: 'puzzled',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "The architecture doesn't follow any style I know. It's like it <shake>grew</shake> instead of being constructed.",
        emotion: 'mystified',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'silas_mystery_dig',
        text: "Maybe it did grow. From all of us.",
        nextNodeId: 'silas_mystery_response',
        pattern: 'exploring'
      },
      {
        choiceId: 'silas_mystery_practical',
        text: "Does it matter how it was made, if it works?",
        nextNodeId: 'silas_mystery_response',
        pattern: 'building'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'silas_mystery_response',
    speaker: 'silas',
    content: [
      {
        text: "Heh. You sound like my old foreman. 'Don't ask how the sausage is made, just appreciate the sausage.'\\n\\nBut yeah. Some things work best when you don't overthink them.",
        emotion: 'accepting',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'silas', addKnowledgeFlags: ['silas_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'silas_mystery_return',
        text: "You've built good things too. That counts.",
        nextNodeId: 'silas_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'silas_hub_return',
    speaker: 'silas',
    content: [{
      text: "I'll be in the workshop if you need me.",
      emotion: 'content',
      variation_id: 'hub_return_v1'
    }],
    choices: []
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'silas_trust_recovery',
    speaker: 'Silas',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[He's holding a broken sensor. Still trying to debug it.]\n\nYou came back.\n\n[He sets it down. Dirt under his fingernails. Honest work.]\n\nI spent years trusting dashboards over dirt. Data over ground truth.\n\nAnd I treated you the same way. Like you were a data point instead of... instead of earth I should have touched.\n\nThat was wrong. I'm sorry.",
      emotion: 'regretful',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[He's holding a broken sensor. Still trying to debug it.]\n\nYou came back.\n\nYou gave me time. Like good soil needs time.\n\n[He sets it down. Dirt under his fingernails. Honest work.]\n\nI spent years trusting dashboards over dirt. Data over ground truth.\n\nAnd I treated you the same way. Like you were a data point instead of... instead of earth I should have touched. That was wrong. I'm sorry.",
        helping: "[He's holding a broken sensor. Still trying to debug it.]\n\nYou came back.\n\nEven after I couldn't see you for the systems.\n\n[He sets it down. Dirt under his fingernails. Honest work.]\n\nI spent years trusting dashboards over dirt. Data over ground truth.\n\nAnd I treated you the same way. Like you were a data point instead of... instead of earth I should have touched. That was wrong. I'm sorry.",
        analytical: "[He's holding a broken sensor. Still trying to debug it.]\n\nYou came back.\n\nYou analyzed my failure mode. Correct diagnosis.\n\n[He sets it down. Dirt under his fingernails. Honest work.]\n\nI spent years trusting dashboards over dirt. Data over ground truth.\n\nAnd I treated you the same way. Like you were a data point instead of... instead of earth I should have touched. That was wrong. I'm sorry.",
        building: "[He's holding a broken sensor. Still trying to debug it.]\n\nYou came back.\n\nRebuilding from dead soil. Takes courage.\n\n[He sets it down. Dirt under his fingernails. Honest work.]\n\nI spent years trusting dashboards over dirt. Data over ground truth.\n\nAnd I treated you the same way. Like you were a data point instead of... instead of earth I should have touched. That was wrong. I'm sorry.",
        exploring: "[He's holding a broken sensor. Still trying to debug it.]\n\nYou came back.\n\nStill exploring even after I got lost in the data.\n\n[He sets it down. Dirt under his fingernails. Honest work.]\n\nI spent years trusting dashboards over dirt. Data over ground truth.\n\nAnd I treated you the same way. Like you were a data point instead of... instead of earth I should have touched. That was wrong. I'm sorry."
      }
    }],
    choices: [
      {
        choiceId: 'silas_recovery_ground',
        text: "Touch grass. Literally.",
        nextNodeId: 'silas_trust_restored',
        pattern: 'building',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'silas',
          trustChange: 2,
          addKnowledgeFlags: ['silas_trust_repaired']
        },
        voiceVariations: {
          patience: "Take your time. Touch grass. Literally. Feel it.",
          helping: "You need grounding. Touch grass. Literally.",
          analytical: "Ground your system. Touch grass. Literally.",
          building: "Build from the earth up. Touch grass. Literally.",
          exploring: "Explore what's real. Touch grass. Literally."
        }
      },
      {
        choiceId: 'silas_recovery_truth',
        text: "Sensors lie. People don't have to.",
        nextNodeId: 'silas_trust_restored',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'silas',
          trustChange: 2,
          addKnowledgeFlags: ['silas_trust_repaired']
        },
        voiceVariations: {
          patience: "Take your time learning this. Sensors lie. People don't have to.",
          helping: "Trust people, not just data. Sensors lie. People don't have to.",
          analytical: "Verify your sources. Sensors lie. People don't have to.",
          building: "Build with honesty. Sensors lie. People don't have to.",
          exploring: "Question the readings. Sensors lie. People don't have to."
        }
      }
    ],
    tags: ['trust_recovery', 'silas_arc']
  },

  {
    nodeId: 'silas_trust_restored',
    speaker: 'Silas',
    content: [{
      text: "[He kneels. Actually puts his hands in the soil. Feels it.]\n\nYou're right.\n\nI came here thinking I'd optimize nature. Make it efficient. Predictable.\n\nBut nature doesn't optimize. It adapts. It's messy. Real.\n\n[He looks up at you. Dirt on his hands. Finally grounded.]\n\nYou're real too. Not a dashboard. Not a metric.\n\nThank you for that reminder. I'm sorry I needed it.",
      emotion: 'grateful',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[He kneels. Actually puts his hands in the soil. Feels it.]\n\nYou're right.\n\nYour patience taught me what dashboards never could.\n\nI came here thinking I'd optimize nature. Make it efficient. Predictable.\n\nBut nature doesn't optimize. It adapts. It's messy. Real.\n\n[He looks up at you. Dirt on his hands. Finally grounded.]\n\nYou're real too. Not a dashboard. Not a metric. Thank you. I'm sorry I needed it.",
        helping: "[He kneels. Actually puts his hands in the soil. Feels it.]\n\nYou're right.\n\nYou helped me when my sensors failed.\n\nI came here thinking I'd optimize nature. Make it efficient. Predictable.\n\nBut nature doesn't optimize. It adapts. It's messy. Real.\n\n[He looks up at you. Dirt on his hands. Finally grounded.]\n\nYou're real too. Not a dashboard. Not a metric. Thank you. I'm sorry I needed it.",
        analytical: "[He kneels. Actually puts his hands in the soil. Feels it.]\n\nYou're right.\n\nYou saw what my analysis missed.\n\nI came here thinking I'd optimize nature. Make it efficient. Predictable.\n\nBut nature doesn't optimize. It adapts. It's messy. Real.\n\n[He looks up at you. Dirt on his hands. Finally grounded.]\n\nYou're real too. Not a dashboard. Not a metric. Thank you. I'm sorry I needed it.",
        building: "[He kneels. Actually puts his hands in the soil. Feels it.]\n\nYou're right.\n\nYou're building from real foundations.\n\nI came here thinking I'd optimize nature. Make it efficient. Predictable.\n\nBut nature doesn't optimize. It adapts. It's messy. Real.\n\n[He looks up at you. Dirt on his hands. Finally grounded.]\n\nYou're real too. Not a dashboard. Not a metric. Thank you. I'm sorry I needed it.",
        exploring: "[He kneels. Actually puts his hands in the soil. Feels it.]\n\nYou're right.\n\nYou explored beyond the sensors.\n\nI came here thinking I'd optimize nature. Make it efficient. Predictable.\n\nBut nature doesn't optimize. It adapts. It's messy. Real.\n\n[He looks up at you. Dirt on his hands. Finally grounded.]\n\nYou're real too. Not a dashboard. Not a metric. Thank you. I'm sorry I needed it."
      }
    }],
    choices: [{
      choiceId: 'silas_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'silas_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'silas_arc'],
    onEnter: [{
      characterId: 'silas',
      addKnowledgeFlags: ['silas_trust_recovery_completed']
    }]
  },

  // ============= DEEP DIVE: NETWORK DRIFT =============
  {
    nodeId: 'silas_deep_dive',
    speaker: 'Silas',
    content: [
      {
        text: "You want to see the real noise? The stuff I filter out to keep the dashboards pretty?\n\nConnect to the raw sensor bus. Sector 4 is screaming. The temperature readings are oscillating in a pattern that matches the station's heartbeat.\n\nIt's not data drift. It's a memory.\n\nStabilize the feed. Don't smooth it out. Listen to it.",
        emotion: 'intense_focused',
        variation_id: 'deep_dive_v1'
      }
    ],
    simulation: {
      type: 'secure_terminal',
      title: 'Sensor Calibration: Ground Truth',
      taskDescription: 'The sensor array is picking up "ghost data"—anomalies that persist across reboots. Isolate the signal pattern and lock the baseline.',
      initialContext: {
        systemName: 'SENSOR_BUS_ROOT',
        isSecure: true,
        history: [
          { type: 'output', content: 'Connecting to RAW_FEED_V4...' },
          { type: 'success', content: 'CONNECTION ESTABLISHED' },
          { type: 'warning', content: 'SIGNAL_TO_NOISE RATIO: < 12dB' },
          { type: 'output', content: 'DETECTED OSCILLATION: ~4Hz (Theta Wave Pattern?)' },
          { type: 'error', content: 'Unable to auto-calibrate. Manual interventions required.' }
        ],
        displayStyle: 'code' // Optional, SecureTerminal usually handles its own style
      },
      successFeedback: 'BASELINE LOCKED. GHOST SIGNAL ISOLATED.',
      mode: 'fullscreen'
    },
    choices: [
      {
        choiceId: 'dive_success_pattern',
        text: "It's not random. It's binary. Someone wrote this code years ago.",
        nextNodeId: 'silas_deep_dive_success',
        pattern: 'analytical',
        skills: ['technicalLiteracy', 'systemsThinking']
      },
      {
        choiceId: 'dive_success_memory',
        text: "The station remembers. We just learned to listen.",
        nextNodeId: 'silas_deep_dive_success',
        pattern: 'exploring',
        skills: ['wisdom', 'emotionalIntelligence']
      }
    ],
    tags: ['deep_dive', 'mastery', 'network_drift']
  },

  {
    nodeId: 'silas_deep_dive_success',
    speaker: 'Silas',
    content: [
      {
        text: "You heard it too.\n\nI used to think it was interference. Bad wiring. But you stabilized it, and it didn't go away. It got clearer.\n\nMr. Hawkins said the soil talks. I think the station talks too. We just stopped listening because the signal didn't fit our JSON schema.\n\nGood work. You've got hands for this.",
        emotion: 'impressed_reverent',
        variation_id: 'deep_dive_success_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['silas_mastery_achieved', 'silas_ghost_listener']
      }
    ],
    choices: [
      {
        choiceId: 'dive_complete',
        text: "Ground truth acknowledged.",
        nextNodeId: 'silas_hub_return', // Return to main flow context
        pattern: 'building',
        skills: ['resilience']
      }
    ]
  }
]

export const silasEntryPoints = {
  INTRODUCTION: 'silas_introduction',
  MYSTERY_HINT: 'silas_mystery_hint'
} as const

export const silasDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(silasDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: silasEntryPoints.INTRODUCTION,
  metadata: {
    title: "Silas's Garden",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: silasDialogueNodes.length,
    totalChoices: silasDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}