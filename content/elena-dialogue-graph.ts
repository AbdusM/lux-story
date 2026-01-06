/**
 * Elena's Dialogue Graph
 * The Pattern Researcher - Platform 4 (Data Science / Analytics)
 *
 * CHARACTER: The Pattern Seer
 * Core Theme: "The Pattern" - seeing connections others miss
 * Arc: From "Data Spiraling" to "Structured Clarity"
 * Vulnerability: The pattern she found that no one believed
 * Meta-layer: She studies behavioral patterns - including the player's
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

const nodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'elena_intro',
    speaker: 'Elena',
    content: [{
      text: "Can you hear the hum? Not the station... the data. It's screaming.",
      emotion: 'anxious',
      microAction: 'She runs her hands through a chaotic spread of holographic documents.',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_data',
        text: 'What kind of data?',
        voiceVariations: {
          analytical: "What kind of data? What's the signal-to-noise ratio?",
          helping: "What kind of data? You seem overwhelmed.",
          building: "What kind of data? Maybe we can structure it.",
          exploring: "What kind of data? Show me.",
          patience: "What kind of data? Take me through it slowly."
        },
        nextNodeId: 'elena_overload',
        pattern: 'exploring',
        skills: ['observation']
      },
      {
        choiceId: 'calm_down',
        text: 'Focus, Elena. One stream at a time.',
        voiceVariations: {
          analytical: "Prioritize, Elena. What's the most significant anomaly?",
          helping: "Hey. I'm here. Let's take this together, one piece at a time.",
          building: "Let's organize this. One stream at a time.",
          exploring: "Slow down. What's the one thing you want me to see first?",
          patience: "Breathe. One stream at a time. I'm not going anywhere."
        },
        nextNodeId: 'elena_synthesis_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['met_elena']
      }
    ]
  },

  // ============= INITIAL BRANCH: DATA OVERLOAD =============
  {
    nodeId: 'elena_overload',
    speaker: 'Elena',
    content: [{
      text: "Everything. Supply chains, crew manifestos, external comms. There's a contradiction in the archives. A lie buried under three petabytes of noise.",
      emotion: 'paranoid',
      microAction: 'She swipes a document away violently.',
      variation_id: 'default',
      interrupt: {
        duration: 3500,
        type: 'grounding',
        action: 'Gently close the holographic display',
        targetNodeId: 'elena_interrupt_grounding',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    }],
    choices: [
      {
        choiceId: 'brute_force',
        text: 'We can read it all. If we split the workload...',
        nextNodeId: 'elena_fail_manual',
        pattern: 'building'
      },
      {
        choiceId: 'ai_research',
        text: 'We don\'t read it. We query it. Let me show you how to filter the noise.',
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'analytical',
        skills: ['digitalLiteracy'],
        visibleCondition: {
          patterns: {
            analytical: { min: 1 }
          }
        }
      }
    ]
  },

  // ============= INITIAL BRANCH: SYNTHESIS LESSON (PATIENCE PATH) =============
  {
    nodeId: 'elena_synthesis_lesson',
    speaker: 'Elena',
    content: [{
      text: "*She pauses, takes a breath.*\n\nYou're right. I get lost sometimes. The patterns pull me in and I forget to surface.\n\n*She minimizes most of the holograms, leaving just one.*\n\nOne stream at a time. Okay. Let me show you what I found.",
      emotion: 'calmer',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'patience', minLevel: 4, altText: "*She pauses, takes a breath.*\n\nYou understand, don't you? That pull between diving deep and staying grounded. Not many people get that balance.\n\n*She minimizes most of the holograms.*\n\nOne stream at a time. Thank you.", altEmotion: 'grateful' }
      ]
    }],
    choices: [
      {
        choiceId: 'what_did_you_find',
        text: "Show me what you found.",
        voiceVariations: {
          analytical: "Walk me through the data. What did you find?",
          helping: "I'm listening. Show me what you found.",
          building: "Let's build the picture. Show me what you found.",
          exploring: "I'm curious. Show me what you found.",
          patience: "Whenever you're ready. Show me what you found."
        },
        nextNodeId: 'elena_first_pattern',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'how_do_you_see_patterns',
        text: "Before we dive in... how do you see patterns others miss?",
        nextNodeId: 'elena_methodology_intro',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  // ============= BRUTE FORCE FAIL =============
  {
    nodeId: 'elena_fail_manual',
    speaker: 'Elena',
    content: [{
      text: "*She laughs, but there's no joy in it.*\n\nSplit the workload? There are 3.2 million documents. At one per minute, that's six years of reading. Non-stop.\n\nI tried that. For the first month. I read until my eyes bled. Literally. Burst vessels.\n\n*She touches the corner of her eye.*\n\nThere has to be a smarter way.",
      emotion: 'exhausted',
      variation_id: 'default',
      richEffectContext: 'warning'
    }],
    choices: [
      {
        choiceId: 'smarter_approach',
        text: "You're right. We query, not read. Show me the data.",
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'analytical',
        skills: ['adaptability']
      },
      {
        choiceId: 'why_obsessed',
        text: "Why does finding this matter so much to you?",
        nextNodeId: 'elena_why_it_matters',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  // ============= METHODOLOGY ARC =============
  {
    nodeId: 'elena_methodology_intro',
    speaker: 'Elena',
    content: [{
      text: "*She tilts her head, studying you with sudden interest.*\n\nMost people ask what I found. You asked how I see.\n\n*She pulls up a new visualization - a web of glowing connections.*\n\nPatterns aren't in the data. They're in the spaces between. The things that should connect but don't. The correlations that are too perfect.\n\nI learned to trust absence as much as presence.",
      emotion: 'intrigued',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "*She tilts her head, studying you with sudden interest.*\n\nYou see it too, don't you? The way questions about process reveal more than questions about results.\n\n*A web of glowing connections appears.*\n\nPatterns aren't in the data. They're in the spaces between. You understand.", altEmotion: 'kindred' }
      ]
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['knows_elena_methodology']
      }
    ],
    choices: [
      {
        choiceId: 'explain_absence',
        text: "Trust absence? What does that mean?",
        nextNodeId: 'elena_methodology_absence',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'perfect_correlations',
        text: "Too-perfect correlations. You're looking for fabrication.",
        nextNodeId: 'elena_methodology_fabrication',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_methodology_absence',
    speaker: 'Elena',
    content: [{
      text: "When you expect a connection and it's not there, that's data.\n\n*She highlights a gap in the visualization.*\n\nThis maintenance log references a parts shipment. But the parts shipment doesn't reference this maintenance log. Someone edited one but not the other.\n\nMost analysts look for what's there. I look for what should be there but isn't. The dog that didn't bark.",
      emotion: 'teaching',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'dog_reference',
        text: "Sherlock Holmes. The curious incident.",
        nextNodeId: 'elena_methodology_deeper',
        pattern: 'analytical',
        skills: ['informationLiteracy'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'how_learn_this',
        text: "How did you learn to see this way?",
        nextNodeId: 'elena_origin_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'elena_methodology_fabrication',
    speaker: 'Elena',
    content: [{
      text: "*Her eyes widen slightly.*\n\nExactly. Real data is messy. It has outliers, errors, human inconsistencies. When data is too clean, too consistent...\n\n*She zooms in on a cluster of entries.*\n\nThese timestamps are all exactly five minutes apart. No human works that precisely. But a script copying data would.\n\nSomeone manufactured this. The question is why.",
      emotion: 'impressed',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 5, altText: "*Her eyes widen slightly.*\n\nYou think like a pattern researcher. Most people accept clean data as reliable. You see it as suspicious.\n\n*She zooms in on a cluster of entries.*\n\nThese timestamps are all exactly five minutes apart. Someone manufactured this. You already knew that, didn't you?", altEmotion: 'kindred_impressed' }
      ]
    }],
    choices: [
      {
        choiceId: 'follow_the_pattern',
        text: "Follow the fabrication. Where does it lead?",
        nextNodeId: 'elena_first_pattern',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'who_taught_you',
        text: "Who taught you to see data this way?",
        nextNodeId: 'elena_origin_story',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'elena_methodology_deeper',
    speaker: 'Elena',
    content: [{
      text: "*A genuine smile breaks through.*\n\nYou read. Actually read. Not just scan for keywords.\n\n*She sits back.*\n\nYes. The dog that didn't bark. That story changed how I see everything. Holmes noticed what everyone else ignored - the absence of evidence is itself evidence.\n\nData science isn't about finding needles in haystacks. It's about noticing when there should be a needle and there isn't.",
      emotion: 'warm',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['shared_literary_reference']
      }
    ],
    choices: [
      {
        choiceId: 'apply_method',
        text: "Let's apply that method. Show me what's missing.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'analytical',
        skills: ['learningAgility']
      },
      {
        choiceId: 'what_led_to_this',
        text: "What led you to pattern research?",
        nextNodeId: 'elena_origin_story',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },

  // ============= ORIGIN STORY ARC =============
  {
    nodeId: 'elena_origin_story',
    speaker: 'Elena',
    content: [{
      text: "*She pauses, something shifting in her expression.*\n\nI was fifteen. My older sister was dating someone our parents loved. Charming, successful, said all the right things.\n\n*Her voice drops.*\n\nBut I noticed patterns. How he'd isolate her from friends. How his compliments were always slightly off. The micro-expressions when he thought no one was watching.\n\nNo one believed me. Not even my sister. Until it was too late.",
      emotion: 'haunted',
      variation_id: 'default',
      interrupt: {
        duration: 4000,
        type: 'silence',
        action: 'Let the weight of that sit. She needs a witness, not a fixer.',
        targetNodeId: 'elena_origin_interrupted',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    }],
    choices: [
      {
        choiceId: 'what_happened',
        text: "What happened to your sister?",
        voiceVariations: {
          analytical: "What happened next? With your sister?",
          helping: "What happened to your sister? Only if you want to share.",
          building: "What happened after that? With your sister?",
          exploring: "What happened to your sister? If you're okay telling me.",
          patience: "Take your time. What happened to your sister?"
        },
        nextNodeId: 'elena_origin_deeper',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'you_saw_it',
        text: "You saw what they couldn't see. That's why you do this.",
        voiceVariations: {
          analytical: "You saw the pattern before anyone else. That's why you do this.",
          helping: "You saw what they couldn't see. You tried to protect her.",
          building: "You saw it and you acted. That's why you do this work.",
          exploring: "You saw what others missed. That's what drives you.",
          patience: "You saw it. They didn't. And now you carry that."
        },
        nextNodeId: 'elena_origin_acknowledged',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['backstory', 'elena_arc']
  },

  {
    nodeId: 'elena_origin_interrupted',
    speaker: 'Elena',
    content: [{
      text: "*She looks at you. Notes that you didn't rush to fill the silence.*\n\nYou didn't ask what happened. You didn't try to fix it.\n\n*Long pause.*\n\nMost people immediately want the ending. The resolution. You just... stayed with it.\n\nThat's rare. That's pattern recognition of a different kind.",
      emotion: 'grateful_surprised',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'continue_when_ready',
        text: "Tell me more when you're ready.",
        nextNodeId: 'elena_origin_deeper',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['interrupt_target', 'elena_arc']
  },

  {
    nodeId: 'elena_origin_deeper',
    speaker: 'Elena',
    content: [{
      text: "She got out. Eventually. But not before...\n\n*She stops.*\n\nThe point is, I spent years afterward asking myself: what if I'd had proof? What if I could have shown them the patterns I saw?\n\nThat's when I discovered data science. A way to make invisible patterns visible. To show people what they're refusing to see.",
      emotion: 'resolved',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'noble_purpose',
        text: "That's a powerful reason to do this work.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'but_people_still_dont_listen',
        text: "But people still don't always listen, do they?",
        nextNodeId: 'elena_not_listening',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_origin_acknowledged',
    speaker: 'Elena',
    content: [{
      text: "*She looks at you with something like recognition.*\n\nYes. That's exactly it.\n\nEveryone else sees events. I see the trajectory that led to them. The pattern that was always there, invisible until it exploded.\n\n*She touches the visualization.*\n\nThis work... it's not about data. It's about refusing to be gaslit by reality. About proving that what you saw was real, even when everyone says it wasn't.",
      emotion: 'understood',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['understands_elena_motivation']
      }
    ],
    choices: [
      {
        choiceId: 'show_current_pattern',
        text: "Show me the pattern you're chasing now.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },

  {
    nodeId: 'elena_not_listening',
    speaker: 'Elena',
    content: [{
      text: "*A bitter laugh.*\n\nNo. They don't.\n\nI've found three major discrepancies in the past year. Each one dismissed. 'Coincidence.' 'Data artifact.' 'You're seeing things that aren't there.'\n\n*She pulls up a document.*\n\nBut this one. This one I can prove. If I can just find the right angle...",
      emotion: 'frustrated_determined',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'help_prove_it',
        text: "Then let's prove it together.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'helping',
        skills: ['collaboration']
      }
    ]
  },

  // ============= WHY IT MATTERS (EMOTIONAL CORE) =============
  {
    nodeId: 'elena_why_it_matters',
    speaker: 'Elena',
    content: [{
      text: "*She stops. The frantic energy drains, replaced by something raw.*\n\nBecause the last time I dismissed a pattern as noise... people died.\n\n*Her hands shake slightly.*\n\nStation Seven. Three years ago. I was the data analyst on duty. There was an anomaly in the life support logs. Three data points. I flagged it as 'sensor drift.' Standard procedure.\n\nIt wasn't drift.",
      emotion: 'haunted',
      variation_id: 'default',
      richEffectContext: 'warning'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['knows_station_seven_surface']
      }
    ],
    choices: [
      {
        choiceId: 'what_happened_seven',
        text: "What happened?",
        nextNodeId: 'elena_station_seven_detail',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'not_your_fault',
        text: "That wasn't your fault. You followed procedure.",
        nextNodeId: 'elena_fault_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['backstory', 'elena_arc', 'emotional_core']
  },

  {
    nodeId: 'elena_station_seven_detail',
    speaker: 'Elena',
    content: [{
      text: "It was a slow leak. Carbon monoxide. The sensors picked up elevated levels three times over twelve hours. Each time, I logged it as drift because the pattern was inconsistent.\n\n*Her voice is hollow.*\n\nBy the time someone physically noticed - the headaches, the confusion - it was too late for four of them.\n\nFour people. Four people who trusted that someone was watching the data.",
      emotion: 'grief',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'station_seven_comfort',
        text: "You're still watching. That's how you honor them.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'station_seven_analytical',
        text: "Three inconsistent data points. No human would have caught that.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_fault_response',
    speaker: 'Elena',
    content: [{
      text: "*She shakes her head.*\n\nThat's what everyone says. 'You followed procedure.' 'The system failed, not you.' But I saw the anomaly. I made the judgment call.\n\n*She meets your eyes.*\n\nThe truth is, if I'd trusted my instinct instead of the protocol... if I'd looked closer instead of categorizing and moving on...\n\nSo now I look closer. At everything. Even when it makes people uncomfortable. Even when they call me paranoid.",
      emotion: 'bitter_resolved',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'paranoid_or_prepared',
        text: "There's a difference between paranoid and prepared.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'weight_of_watching',
        text: "That's a heavy weight to carry with every data point.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_station_seven_resolution',
    speaker: 'Elena',
    content: [{
      text: "*She exhales slowly, something releasing.*\n\nI've never told anyone the full story. Most people only know I worked at Station Seven. They don't know I was the one who missed it.\n\n*She gestures at the holographic chaos.*\n\nSo when I see patterns now, I don't dismiss them. Even if it makes me look obsessed. Even if no one believes me.\n\nSomewhere in three petabytes of data, there might be another three data points. And this time I won't dismiss them.",
      emotion: 'vulnerable_determined',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'help_find_it',
        text: "Then let's find what's hiding in the noise. Together.",
        voiceVariations: {
          analytical: "Show me the data. Let's isolate the signal together.",
          helping: "You're not alone in this anymore. Let's find it together.",
          building: "Let's build a filter. Find what's hiding in the noise.",
          exploring: "I want to see what you see. Let's dig in together.",
          patience: "However long it takes. Let's find it together."
        },
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'resolution']
  },

  // ============= THE FIRST PATTERN =============
  {
    nodeId: 'elena_first_pattern',
    speaker: 'Elena',
    content: [{
      text: "*She brings up a new visualization.*\n\nLook. This is a year of maintenance logs. Normal operations, right? But watch what happens when I overlay the parts shipment data.\n\n*Red lines appear, connecting disparate points.*\n\nThese components are being replaced 40% faster than their rated lifespan. Either the manufacturer's specs are wrong... or something's wearing them out that isn't being logged.",
      emotion: 'focused',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'environmental_factor',
        text: "Environmental stress? Something in the operating conditions?",
        nextNodeId: 'elena_environmental_theory',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'deliberate_damage',
        text: "Or someone's deliberately causing the damage. Insurance fraud?",
        nextNodeId: 'elena_fraud_theory',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_environmental_theory',
    speaker: 'Elena',
    content: [{
      text: "*She nods, impressed.*\n\nThat's what I thought first. But the environmental sensors show nothing unusual. Temperature, humidity, vibration - all within spec.\n\n*She zooms in on a specific cluster.*\n\nExcept... there are three hours every week where the sensor data is identical. Exactly identical. Copy-paste identical.\n\nSomeone's masking something that happens during those three hours.",
      emotion: 'vindicated',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_happens_then',
        text: "What happens during those three hours?",
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },

  {
    nodeId: 'elena_fraud_theory',
    speaker: 'Elena',
    content: [{
      text: "Insurance fraud. That's... that's actually a possibility I hadn't fully explored.\n\n*She pulls up financial data alongside the maintenance logs.*\n\nBut look at the claims. They're not inflated. If anything, they're under-reporting the component failures.\n\n*She frowns.*\n\nWhy hide damage and not claim for it? Unless... the damage is evidence of something they need to keep hidden.",
      emotion: 'intrigued',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_hidden',
        text: "Hidden from who? And why?",
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  // ============= SIMULATION: PERPLEXITY SEARCH =============
  {
    nodeId: 'elena_simulation_perplexity',
    speaker: 'Elena',
    content: [{
      text: "Show me. The raw logs are a mess.",
      emotion: 'skeptical',
      variation_id: 'default'
    }],
    simulation: {
      type: 'prompt_engineering',
      title: 'Deep Research Protocol',
      taskDescription: 'The archives are flooded with noise. Construct a search query that isolates timestamp anomalies excluding standard maintenance logs.',
      initialContext: {
        label: 'Current Search Query',
        content: 'search "station errors"',
        displayStyle: 'code'
      },
      successFeedback: 'FILTER ACTIVE: 3 anomalies isolated in Sector 7.'
    },
    choices: [
      {
        choiceId: 'sim_basic_search',
        text: 'SEARCH: "error logs timestamp issue"',
        nextNodeId: 'elena_simulation_perplexity_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_advanced_search',
        text: 'SEARCH: "timestamp_gap" -maintenance filetype:log',
        nextNodeId: 'elena_truth_found',
        pattern: 'analytical',
        skills: ['promptEngineering'],
        consequence: {
          characterId: 'elena',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_perplexity'],
          addGlobalFlags: ['golden_prompt_deep_search']
        }
      }
    ]
  },

  {
    nodeId: 'elena_simulation_perplexity_fail',
    speaker: 'Elena',
    content: [{
      text: "Still too much noise. Thousands of matches. We need to be more specific.",
      emotion: 'frustrated',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_search',
        text: 'Let me try different filter parameters.',
        nextNodeId: 'elena_simulation_perplexity'
      }
    ]
  },

  {
    nodeId: 'elena_truth_found',
    speaker: 'Elena',
    content: [{
      text: "It worked... The noise is gone. The anomaly wasn't in the data... it was in the timestamp. Someone paused the logs for three seconds.",
      emotion: 'amazed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'keep_going',
        text: 'This is just the beginning. Let me show you how to synthesize it.',
        nextNodeId: 'elena_notebook_intro'
      }
    ]
  },

  // ============= NOTEBOOK SIMULATION =============
  {
    nodeId: 'elena_notebook_intro',
    speaker: 'Elena',
    content: [{
      text: "Synthesize? These reports are dense. It will take weeks to cross-reference the anomaly with the crew logs.",
      emotion: 'neutral',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'notebook_sim_start',
        text: 'Don\'t read them linearly. Let the AI map the connections.',
        nextNodeId: 'elena_simulation_notebooklm',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'elena_simulation_notebooklm',
    speaker: 'Elena',
    content: [{
      text: "Map the connections? How? It's just flat text.",
      emotion: 'skeptical',
      variation_id: 'default'
    }],
    simulation: {
      type: 'data_analysis',
      title: 'Contextual Synthesis',
      taskDescription: 'The crew logs are 500 pages of bureaucratic jargon. Generate an "Audio Overview" that focuses specifically on the 3-second time gap.',
      initialContext: {
        label: 'Crew_Logs_Vol_1-5.pdf',
        content: '[UPLOADED]',
        displayStyle: 'text'
      },
      successFeedback: 'AUDIO GENERATED: Two voices discussing the "missing seconds" in the engine room.'
    },
    choices: [
      {
        choiceId: 'sim_summarize',
        text: 'PROMPT: "Summarize this document."',
        nextNodeId: 'elena_simulation_notebook_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_audio_deep',
        text: 'PROMPT: "Generate Audio Overview. Focus on: Engine Room status during the timestamp gap."',
        nextNodeId: 'elena_notebook_success',
        pattern: 'analytical',
        skills: ['informationLiteracy'],
        consequence: {
          characterId: 'elena',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_notebooklm'],
          addGlobalFlags: ['golden_prompt_notebooklm']
        }
      }
    ]
  },

  {
    nodeId: 'elena_simulation_notebook_fail',
    speaker: 'Elena',
    content: [{
      text: "It just gave me a generic summary of cafeteria menus and maintenance schedules. Useless.",
      emotion: 'annoyed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_notebook',
        text: 'You have to direct the focus. Tell it WHAT to look for.',
        nextNodeId: 'elena_simulation_notebooklm'
      }
    ]
  },

  {
    nodeId: 'elena_notebook_success',
    speaker: 'Elena',
    content: [{
      text: "I hear it... the voices are discussing a power surge. But the logs don't show a surge.",
      emotion: 'intrigued',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'visualize_data',
        text: 'The text is hiding the surge. But maybe we can see it.',
        nextNodeId: 'elena_midjourney_intro',
        pattern: 'exploring'
      }
    ]
  },

  // ============= MIDJOURNEY SIMULATION =============
  {
    nodeId: 'elena_midjourney_intro',
    speaker: 'Elena',
    content: [{
      text: "See it? How? We don't have camera footage from that sector.",
      emotion: 'confused',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'start_mj_sim',
        text: 'We reconstruct it. Based on the ambient sensor data.',
        nextNodeId: 'elena_simulation_midjourney',
        pattern: 'exploring',
        skills: ['visionaryThinking']
      }
    ]
  },

  {
    nodeId: 'elena_simulation_midjourney',
    speaker: 'Elena',
    content: [{
      text: "Reconstruct the scene... from scattered sensor data?",
      emotion: 'curious',
      variation_id: 'default'
    }],
    simulation: {
      type: 'creative_direction',
      title: 'Visual Reconstruction',
      taskDescription: 'Reconstruct the engine room environment during the surge using sensor metadata. We need to see the "Shadow" that triggered the sensors.',
      initialContext: {
        label: 'Sensor Data',
        content: 'Temp: 450K, Light: +2000%, Air: Ionized',
        displayStyle: 'code'
      },
      successFeedback: 'IMAGE GENERATED: A blinding white silhouette standing in the core.'
    },
    choices: [
      {
        choiceId: 'sim_mj_basic',
        text: 'PROMPT: "/imagine engine room explosion"',
        nextNodeId: 'elena_simulation_mj_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_mj_pro',
        text: 'PROMPT: "/imagine engine room, volumetric lighting, blinding white silhouette, ionized air, cinematic, 8k --v 6.0"',
        nextNodeId: 'elena_mj_success',
        pattern: 'exploring',
        skills: ['creativity', 'promptEngineering'],
        consequence: {
          characterId: 'elena',
          trustChange: 15,
          addKnowledgeFlags: ['unlocked_midjourney'],
          addGlobalFlags: ['golden_prompt_midjourney']
        }
      }
    ]
  },

  {
    nodeId: 'elena_simulation_mj_fail',
    speaker: 'Elena',
    content: [{
      text: "This looks like a cartoon. It doesn't help me analyze the physics.",
      emotion: 'disappointed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_mj',
        text: 'Too generic. Be specific about the lighting and atmosphere.',
        nextNodeId: 'elena_simulation_midjourney'
      }
    ]
  },

  {
    nodeId: 'elena_mj_success',
    speaker: 'Elena',
    content: [{
      text: "That silhouette... it matches the heat signature perfectly. It wasn't a malfunction. Someone was IN the core.",
      emotion: 'horrified',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_now',
        text: "What do you do with this information?",
        nextNodeId: 'elena_decision_point',
        pattern: 'exploring'
      },
      {
        choiceId: 'tools_reveal_truth',
        text: "Now you see. The tools don't just process data. They reveal truth.",
        nextNodeId: 'elena_decision_point',
        pattern: 'analytical',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  // ============= DECISION POINT =============
  {
    nodeId: 'elena_decision_point',
    speaker: 'Elena',
    content: [{
      text: "*She stares at the reconstruction.*\n\nI have proof now. Proof that someone was there. Proof that the logs were altered.\n\n*She looks at you.*\n\nBut proof of what, exactly? I still don't know what they were doing. I don't know who. And if I go public with this...\n\nLast time I raised concerns about data anomalies, I was 'reassigned' to a less sensitive position. They called it paranoia.",
      emotion: 'conflicted',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'gather_more',
        text: "Gather more evidence before you act. Make it undeniable.",
        nextNodeId: 'elena_caution_path',
        pattern: 'patience',
        skills: ['strategicThinking']
      },
      {
        choiceId: 'find_allies',
        text: "Find allies. Someone else in the station who's noticed things.",
        nextNodeId: 'elena_allies_path',
        pattern: 'helping',
        skills: ['collaboration']
      },
      {
        choiceId: 'act_now',
        text: "Act now. Every day of silence is a day they might cover more tracks.",
        nextNodeId: 'elena_action_path',
        pattern: 'building',
        skills: ['strategicThinking']
      }
    ],
    tags: ['elena_arc', 'decision_point']
  },

  {
    nodeId: 'elena_caution_path',
    speaker: 'Elena',
    content: [{
      text: "*She nods slowly.*\n\nYou're right. I have a tendency to... act on patterns before I've fully traced them. That's how I got burned before.\n\n*She begins organizing the data.*\n\nI'll keep digging. Quietly. Document everything. Build a case they can't dismiss.\n\nBut I'm going to need someone to check my work. Someone who can see when I'm spiraling versus when I'm onto something real.",
      emotion: 'measured',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'i_can_help',
        text: "I can do that. I'll be your sanity check.",
        nextNodeId: 'elena_partnership_formed',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 3
        }
      }
    ]
  },

  {
    nodeId: 'elena_allies_path',
    speaker: 'Elena',
    content: [{
      text: "*Her eyes light up.*\n\nAllies. Yes. I've been so focused on the data I forgot about the people.\n\n*She pulls up a personnel roster.*\n\nRohan in the server room - he's noticed timestamp irregularities too. He mentioned it once, then went quiet. And there's a maintenance tech, Kai, who's been asking questions about the component failures.\n\nMaybe I'm not the only one who's seen the pattern.",
      emotion: 'hopeful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'build_network',
        text: "Build a network. Cross-reference what everyone's seen.",
        nextNodeId: 'elena_partnership_formed',
        pattern: 'building',
        skills: ['collaboration', 'leadership'],
        consequence: {
          characterId: 'elena',
          trustChange: 2,
          addKnowledgeFlags: ['rohan_connection', 'kai_connection']
        }
      }
    ]
  },

  {
    nodeId: 'elena_action_path',
    speaker: 'Elena',
    content: [{
      text: "*She takes a sharp breath.*\n\nYou're right. I've been cautious before. It cost four lives.\n\n*She starts archiving the data.*\n\nI'm sending this to the oversight committee. Tonight. With everything we found. They might ignore it. They might fire me. But at least this time...\n\n*She looks at the visualization.*\n\nThis time I won't be wondering if I should have done something.",
      emotion: 'determined',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'ill_back_you',
        text: "I'll back you up. Whatever happens.",
        nextNodeId: 'elena_partnership_formed',
        pattern: 'helping',
        skills: ['courage', 'collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 4
        }
      }
    ]
  },

  // ============= PARTNERSHIP FORMED =============
  {
    nodeId: 'elena_partnership_formed',
    speaker: 'Elena',
    content: [{
      text: "*She extends her hand. It's steady now.*\n\nYou know, when I started today, I thought I was alone in this. Another pattern-seer in a world of people who don't want to look.\n\n*A real smile.*\n\nBut you didn't look away. You didn't dismiss what I was seeing. You helped me refine it.\n\nThat's worth more than all the data in this station.",
      emotion: 'warm',
      variation_id: 'default',
      interaction: 'nod'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_partnership'],
        addGlobalFlags: ['elena_arc_progress']
      }
    ],
    choices: [
      {
        choiceId: 'patterns_and_people',
        text: "Patterns are just data about people. Understanding both matters.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'continue_forward',
        text: "We're just getting started. What's next?",
        nextNodeId: 'elena_next_steps',
        pattern: 'building',
        skills: ['learningAgility']
      }
    ],
    tags: ['elena_arc', 'milestone']
  },

  // ============= STATION OBSERVATIONS ARC =============
  {
    nodeId: 'elena_station_observations',
    speaker: 'Elena',
    content: [{
      text: "*She gestures at the station around them.*\n\nYou know what's fascinating about Grand Central Terminus? The patterns here are different from anywhere else I've worked.\n\n*She pulls up an overlay only she can see.*\n\nMost places, people's movements are predictable. Commute patterns, lunch rushes, exit flows. Here? The travelers move like... like they're responding to something I can't see.",
      emotion: 'curious',
      variation_id: 'default'
    }],
    requiredState: {
      trust: { min: 4 }
    },
    choices: [
      {
        choiceId: 'what_do_you_mean',
        text: "What do you mean, responding to something?",
        nextNodeId: 'elena_station_deeper',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'samuel_influence',
        text: "Samuel. He guides people to where they need to be.",
        nextNodeId: 'elena_samuel_observation',
        pattern: 'analytical',
        skills: ['observation']
      }
    ],
    tags: ['station_observations', 'elena_arc']
  },

  {
    nodeId: 'elena_station_deeper',
    speaker: 'Elena',
    content: [{
      text: "Watch the platforms. Someone arrives, looks confused. Then, without anyone visibly directing them, they drift toward a specific platform. Every time.\n\n*She squints at the data.*\n\nIt's not random. There's a pattern in the wandering. As if the station itself is... sorting people.\n\n*She shakes her head.*\n\nOr I'm seeing patterns that aren't there. Occupational hazard.",
      emotion: 'uncertain',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'station_alive',
        text: "Maybe the station knows something we don't.",
        nextNodeId: 'elena_station_theory',
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'unconscious_signals',
        text: "Unconscious signals. Micro-expressions, body language. People following cues they're not aware of.",
        nextNodeId: 'elena_signals_theory',
        pattern: 'analytical',
        skills: ['observation'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_samuel_observation',
    speaker: 'Elena',
    content: [{
      text: "*She nods slowly.*\n\nSamuel. Yes. I've been watching him.\n\n*Her voice drops to a whisper.*\n\nHe knows things he shouldn't know. When I first arrived, he mentioned my sister. Offhand, casual. But I never told anyone here about her.\n\nEither he has access to personnel files I can't find... or there's something else going on.",
      emotion: 'suspicious_intrigued',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'confront_samuel',
        text: "Have you asked him directly?",
        nextNodeId: 'elena_samuel_confrontation',
        pattern: 'building',
        skills: ['courage']
      },
      {
        choiceId: 'observe_more',
        text: "Keep watching. Gather more data before concluding anything.",
        nextNodeId: 'elena_patience_acknowledged',
        pattern: 'patience',
        skills: ['patience'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_station_theory',
    speaker: 'Elena',
    content: [{
      text: "*She laughs, but it's not dismissive.*\n\nA week ago, I would have said that's magical thinking. But the data doesn't lie, and the data says people find where they need to be here. Consistently.\n\n*She looks at you.*\n\nYou know what else the data says? That you were going to come talk to me. Your trajectory from the moment you entered... it was heading here.\n\nMakes you wonder who's really making the choices.",
      emotion: 'philosophical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'free_will',
        text: "I chose to come here. The station didn't choose for me.",
        nextNodeId: 'elena_choice_debate',
        pattern: 'building',
        skills: ['leadership']
      },
      {
        choiceId: 'both_true',
        text: "Maybe both are true. I chose, and the station made sure my choice led here.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_signals_theory',
    speaker: 'Elena',
    content: [{
      text: "*She considers this.*\n\nUnconscious signals. Possible. There's literature on collective navigation behaviors. Swarm intelligence, emergence.\n\n*She pulls up her notes.*\n\nBut that doesn't explain how accurate it is. In a swarm, individuals make mistakes, but the collective finds the path. Here? Every individual finds their path. The error rate is... impossible.\n\nUnless someone designed it that way.",
      emotion: 'analytical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'who_designed',
        text: "Who would design something like that?",
        nextNodeId: 'elena_design_question',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_samuel_confrontation',
    speaker: 'Elena',
    content: [{
      text: "*She shakes her head.*\n\nI tried. Once. He just smiled and said, 'The station shares what needs to be shared.'\n\n*She mimics his cadence.*\n\nWhich is either profound wisdom or the most evasive non-answer I've ever encountered. I still can't tell which.\n\nBut there's no hostility in him. Whatever he knows, he's not using it against anyone. At least... not that I've detected.",
      emotion: 'frustrated_thoughtful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'trust_samuel',
        text: "Maybe some patterns aren't meant to be fully understood. Just trusted.",
        nextNodeId: 'elena_trust_discussion',
        pattern: 'patience',
        skills: ['wisdom']
      },
      {
        choiceId: 'keep_investigating',
        text: "Every pattern can be understood with enough data.",
        nextNodeId: 'elena_data_limits',
        pattern: 'analytical',
        skills: ['resilience']
      }
    ]
  },

  {
    nodeId: 'elena_patience_acknowledged',
    speaker: 'Elena',
    content: [{
      text: "*She smiles, genuine.*\n\nPatience. That's what I usually lack. I see a pattern and I want to chase it immediately.\n\nYou're reminding me that watching is also a form of action. That sometimes the pattern reveals itself if you give it time.\n\n*She takes a breath.*\n\nThank you. I needed that reminder.",
      emotion: 'grateful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'continue_observation',
        text: "(Continue)",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'elena_choice_debate',
    speaker: 'Elena',
    content: [{
      text: "*She holds up her hands.*\n\nI'm not trying to take away your agency. But think about it. Every choice you make is based on information. Where did that information come from? What shaped your preferences?\n\n*She gestures at herself.*\n\nI chose to become a pattern researcher because of my sister. That choice was 'mine,' but it was also the inevitable result of experiences I didn't choose.\n\nFree will and determinism aren't opposites. They're... nested.",
      emotion: 'philosophical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'accept_complexity',
        text: "I can live with that complexity.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ]
  },

  {
    nodeId: 'elena_design_question',
    speaker: 'Elena',
    content: [{
      text: "That's the question, isn't it?\n\n*She stares at the station architecture.*\n\nSomeone, or something, built this place to guide people to exactly where they need to be. That's either the most benevolent system ever created... or the most sophisticated manipulation.\n\n*She looks at you.*\n\nI haven't figured out which. Yet.",
      emotion: 'intense',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'maybe_both',
        text: "Guidance and manipulation aren't always opposites.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_trust_discussion',
    speaker: 'Elena',
    content: [{
      text: "*She's quiet for a long moment.*\n\nTrust without understanding. That's... hard for me. My whole life has been about seeing through things. Understanding the mechanism behind the magic.\n\n*She looks at the station.*\n\nBut maybe some systems are designed to be trusted rather than understood. Like... like a relationship, I suppose. You don't analyze love into atoms.",
      emotion: 'contemplative',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'balance_both',
        text: "Maybe it's about knowing when to analyze and when to trust.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience',
        skills: ['wisdom']
      }
    ]
  },

  {
    nodeId: 'elena_data_limits',
    speaker: 'Elena',
    content: [{
      text: "*A flicker of doubt.*\n\nEvery pattern can be understood. That's what I've always believed.\n\n*She pauses.*\n\nBut what if some patterns are... recursive? What if understanding the pattern changes the pattern? What if the observer is part of the data?\n\n*She rubs her temples.*\n\nI'm getting into philosophy. That usually means I've hit a wall in the analysis.",
      emotion: 'uncertain',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'walls_lead_somewhere',
        text: "Walls are just patterns you haven't decoded yet.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'building',
        skills: ['resilience']
      }
    ]
  },

  // ============= META REFLECTION: PLAYER ANALYSIS =============
  {
    nodeId: 'elena_meta_reflection',
    speaker: 'Elena',
    content: [{
      text: "*She looks at you differently now. Assessing.*\n\nYou know, I've been analyzing data about the station this whole time. But I've also been analyzing you.\n\n*She pulls up a small visualization.*\n\nEvery choice you've made. Every question you've asked. They form a pattern too.",
      emotion: 'knowing',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 5, altText: "*She looks at you with recognition.*\n\nYou know I've been analyzing you, don't you? You're probably analyzing me back. Two pattern-seers, each trying to understand the other.\n\n*A small smile.*\n\nYour choices form a pattern. Heavy on analysis. You want to understand before you act.", altEmotion: 'kindred' },
        { pattern: 'patience', minLevel: 5, altText: "*She looks at you with something like respect.*\n\nI've been analyzing you. But you already knew that, didn't you? You've been patient, letting me reveal myself at my own pace.\n\nYour pattern is clear: you trust the process. You don't force.", altEmotion: 'impressed' },
        { pattern: 'helping', minLevel: 5, altText: "*She looks at you with warmth.*\n\nI've been analyzing you. And the pattern is clear: every choice you've made has been about supporting someone else.\n\nYou're not here for yourself, are you? You're here for everyone you might help.", altEmotion: 'touched' },
        { pattern: 'building', minLevel: 5, altText: "*She looks at you thoughtfully.*\n\nI've been analyzing you. Your pattern is about construction. You want to build something that lasts.\n\nEvery choice you've made is about creating, not just understanding.", altEmotion: 'respectful' },
        { pattern: 'exploring', minLevel: 5, altText: "*She looks at you with curiosity.*\n\nI've been analyzing you. And the pattern is fascinating: you're driven by discovery. Every choice opens a new door.\n\nYou're not looking for answers. You're looking for better questions.", altEmotion: 'intrigued' }
      ]
    }],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'what_do_you_see',
        text: "What pattern do you see in me?",
        nextNodeId: 'elena_player_analysis',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'turn_around_fair',
        text: "Turn about is fair play. What's your pattern?",
        nextNodeId: 'elena_self_analysis',
        pattern: 'analytical',
        skills: ['curiosity'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['meta', 'elena_arc']
  },

  {
    nodeId: 'elena_player_analysis',
    speaker: 'Elena',
    content: [{
      text: "*She studies the data.*\n\nYou're consistent. That's the first thing. Your choices aren't random - they follow a logic, even when you might not be aware of it.\n\n*She traces a line in the visualization.*\n\nYou lean toward [pattern]. Not exclusively, but there's a center of gravity. When you're uncertain, that's where you default.\n\nIt's... actually reassuring. In a world of noise, you're signal.",
      emotion: 'appreciative',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'is_that_good',
        text: "Is that a good thing?",
        nextNodeId: 'elena_pattern_meaning',
        pattern: 'exploring'
      },
      {
        choiceId: 'what_about_you',
        text: "And what's your center of gravity?",
        nextNodeId: 'elena_self_analysis',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_self_analysis',
    speaker: 'Elena',
    content: [{
      text: "*She pauses, then laughs softly.*\n\nMe? I'm easy. Analytical to a fault. I see patterns in everything, even when they're not there.\n\n*She gestures at herself.*\n\nIt's a gift and a curse. I can spot a lie in a dataset from across the room. But I also struggle to trust anything that isn't proven.\n\n*Her voice softens.*\n\nPeople. Relationships. Intuition. All noise until I can quantify them. It makes me... difficult to be close to.",
      emotion: 'vulnerable',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'patterns_arent_everything',
        text: "Patterns aren't everything. Some things can't be analyzed.",
        nextNodeId: 'elena_pattern_limits',
        pattern: 'patience',
        skills: ['wisdom']
      },
      {
        choiceId: 'difficulty_is_worth_it',
        text: "Being difficult to know doesn't mean you're not worth knowing.",
        nextNodeId: 'elena_worth_knowing',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_pattern_meaning',
    speaker: 'Elena',
    content: [{
      text: "Good or bad aren't pattern categories. Patterns just... are.\n\n*She shrugs.*\n\nBut if it helps - the pattern I see in you is the pattern of someone who cares about truth. Who wants to understand before they judge. Who's willing to sit with complexity.\n\nThose are rare qualities. In my experience, people who have them tend to matter.",
      emotion: 'sincere',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'appreciate_that',
        text: "Thank you. That... means something.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_pattern_limits',
    speaker: 'Elena',
    content: [{
      text: "*She's quiet for a moment.*\n\nI know. Rationally, I know that. But knowing and feeling are different patterns.\n\n*She looks at her hands.*\n\nMy therapist says I use analysis as a defense mechanism. If I can understand something, I can control it. If I can predict behavior, I can't be surprised. If I can see the pattern, I can't be hurt.\n\n*A small, sad smile.*\n\nIt's a cage made of clarity.",
      emotion: 'honest',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'clarity_cage',
        text: "Even cages can have doors.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        skills: ['encouragement'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_worth_knowing',
    speaker: 'Elena',
    content: [{
      text: "*She blinks, caught off guard.*\n\nThat's... not the response most people give. Usually it's 'you just need to open up more' or 'stop analyzing everything.'\n\n*She meets your eyes.*\n\nYou're not trying to change how I work. You're just... accepting it.\n\n*A pause.*\n\nI don't have a pattern for that.",
      emotion: 'touched',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_accepted']
      }
    ],
    choices: [
      {
        choiceId: 'new_patterns',
        text: "Good. Maybe we're creating new patterns.",
        nextNodeId: 'elena_next_steps',
        pattern: 'building',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  // ============= RECIPROCITY: ELENA ASKS ABOUT THE PLAYER =============
  {
    nodeId: 'elena_reciprocity',
    speaker: 'Elena',
    content: [{
      text: "*She sets down her data tablet.*\n\nI've been talking about my patterns, my history, my obsessions. But I'm curious about you now.\n\n*She leans forward.*\n\nWhen you came to this station... what pattern were you looking for? What anomaly in your own life brought you here?",
      emotion: 'curious',
      variation_id: 'default'
    }],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'looking_for_direction',
        text: "I was looking for direction. Too many paths, not enough clarity.",
        nextNodeId: 'elena_reciprocity_direction',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'looking_for_purpose',
        text: "I was looking for purpose. Something that matters.",
        nextNodeId: 'elena_reciprocity_purpose',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'looking_for_change',
        text: "I was looking for change. The pattern I was in wasn't working.",
        nextNodeId: 'elena_reciprocity_change',
        pattern: 'building',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'not_sure',
        text: "Honestly? I'm still figuring that out.",
        nextNodeId: 'elena_reciprocity_uncertain',
        pattern: 'patience',
        skills: ['integrity']
      }
    ],
    tags: ['reciprocity', 'elena_arc']
  },

  {
    nodeId: 'elena_reciprocity_direction',
    speaker: 'Elena',
    content: [{
      text: "*She nods slowly.*\n\nToo many paths. I understand that. Data paralysis. When you have too much information, every option looks equally valid.\n\n*She pulls up a simple visualization.*\n\nBut here's what I've learned: direction isn't something you find. It's something you create by moving. The pattern reveals itself in the walking, not in the mapping.\n\nYou've been walking here. That's already direction.",
      emotion: 'understanding',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'helpful_perspective',
        text: "That's a helpful way to think about it.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_purpose',
    speaker: 'Elena',
    content: [{
      text: "*Her expression softens.*\n\nPurpose. That's the hardest pattern to find because it's not in the data. It's in how the data makes you feel.\n\n*She gestures at her work.*\n\nI thought my purpose was finding hidden truths. But really, it's about protecting people from what they can't see coming. The truth is just the tool.\n\nWhat do you want to protect?",
      emotion: 'thoughtful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'protect_answer',
        text: "I want to protect people from... from being unseen. Unheard.",
        nextNodeId: 'elena_reciprocity_resonance',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'still_thinking',
        text: "I'm still figuring that out.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_change',
    speaker: 'Elena',
    content: [{
      text: "*She tilts her head.*\n\nRecognizing a broken pattern is the first step. Most people never get there. They just keep running the same loops, expecting different outputs.\n\n*She looks at you with respect.*\n\nThe fact that you're here, actively seeking different input... that's already a new pattern. You're not stuck. You're debugging.",
      emotion: 'encouraging',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'debugging_life',
        text: "Debugging life. I like that framing.",
        nextNodeId: 'elena_next_steps',
        pattern: 'building',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_uncertain',
    speaker: 'Elena',
    content: [{
      text: "*She smiles, warm and genuine.*\n\nThat's an honest answer. I respect that more than false certainty.\n\n*She leans back.*\n\nYou know what? Most of the people I trust most are the ones who say 'I don't know' instead of pretending they do. It takes courage to hold uncertainty.\n\nThe pattern will emerge. You're gathering data right now, even if you don't realize it.",
      emotion: 'warm',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'thanks_for_patience',
        text: "Thanks for being patient with my uncertainty.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_resonance',
    speaker: 'Elena',
    content: [{
      text: "*She's very still.*\n\nProtecting people from being unseen. That's... that's my pattern too. That's exactly it.\n\n*Her voice drops.*\n\nMy sister was unseen. Those four people at Station Seven were unseen. Every lie in the data is someone trying to make something invisible.\n\n*She looks at you with new recognition.*\n\nWe're the same kind of pattern-seer, aren't we? Just using different tools.",
      emotion: 'moved',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['deep_connection']
      }
    ],
    choices: [
      {
        choiceId: 'same_mission',
        text: "Same mission, different methods.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 3
        }
      }
    ]
  },

  // ============= VULNERABILITY ARC (Trust >= 6) =============
  {
    nodeId: 'elena_vulnerability_arc',
    speaker: 'Elena',
    content: [{
      text: `*She stops scrolling. Stares at nothing.*

Can I tell you why I do this? Why I can't stop looking?

*Pause.*

Three years ago. Station Seven. I was the data analyst on duty.

There was an anomaly in the life support logs. Three data points. I flagged it as "sensor drift." Standard procedure.

*Voice drops.*

It wasn't drift. It was a slow leak. By the time anyone noticed... four people. Four people who trusted that someone was watching the data.

*Looks at you.*

I was watching. And I dismissed it as noise.`,
      emotion: 'haunted_guilty',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_vulnerability_revealed', 'knows_about_station_seven']
      }
    ],
    choices: [
      {
        choiceId: 'elena_vuln_not_your_fault',
        text: "You followed procedure. The system failed, not you.",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_vuln_carry_them',
        text: "You carry them with you. Every anomaly you chase.",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'elena_vuln_silence',
        text: "[Let the weight of it sit. She needs a witness, not absolution.]",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['elena_arc', 'vulnerability', 'emotional_core']
  },

  {
    nodeId: 'elena_vulnerability_response',
    speaker: 'Elena',
    content: [{
      text: `*She wipes her eyes.*

I know I can't save them. But every lie I uncover... every contradiction I surface... it's for them.

*Quiet.*

The paranoia isn't paranoia when you know what you missed. When you know what "noise" can hide.

*Small, tired smile.*

So I keep looking. Because somewhere in three petabytes of data, there might be another three data points. And this time... this time I won't dismiss them.

That's why I can't stop. That's why I need the tools. Not to replace my judgment—to extend it. To see what I couldn't see before.`,
      emotion: 'resolved_determined',
      interaction: 'nod',
      variation_id: 'vulnerability_response_v1'
    }],
    choices: [
      {
        choiceId: 'elena_vuln_to_truth',
        text: "Then let's find what's hiding in this noise. Together.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'vulnerability', 'resolution']
  },

  // ============= DEEP TRUST ARC (Trust >= 8) =============
  {
    nodeId: 'elena_deep_trust',
    speaker: 'Elena',
    content: [{
      text: "*She looks around, then pulls you aside.*\n\nThere's something I haven't told anyone. About what I found. The real pattern.\n\n*Her voice is barely a whisper.*\n\nIt's not just this station. The anomalies I'm finding... they're everywhere. Every major system I've checked. Like someone is testing something. Probing for weaknesses.\n\n*She meets your eyes.*\n\nAnd they're getting faster.",
      emotion: 'fearful_urgent',
      variation_id: 'default',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 }
    },
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_deep_secret'],
        addGlobalFlags: ['knows_larger_pattern']
      }
    ],
    choices: [
      {
        choiceId: 'who_is_testing',
        text: "Who's testing? And for what?",
        nextNodeId: 'elena_larger_conspiracy',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'what_can_we_do',
        text: "What can we do about it?",
        nextNodeId: 'elena_action_plan',
        pattern: 'building',
        skills: ['strategicThinking']
      }
    ],
    tags: ['elena_arc', 'deep_trust', 'mystery']
  },

  {
    nodeId: 'elena_larger_conspiracy',
    speaker: 'Elena',
    content: [{
      text: "*She shakes her head.*\n\nI don't know. That's what terrifies me. The pattern is clear - coordinated probes across multiple systems - but the source is invisible.\n\n*She pulls up a map with glowing red dots.*\n\nEvery dot is an anomaly I've found. They're connected. The timing, the methodology, the data signatures. But who's behind them...\n\n*She looks exhausted.*\n\nSometimes I think I'm the only one who sees it. And that makes me question if it's even real.",
      emotion: 'desperate',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'its_real',
        text: "You're not imagining this. The pattern is real. Let me help you document it.",
        nextNodeId: 'elena_validation',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 3
        }
      }
    ]
  },

  {
    nodeId: 'elena_action_plan',
    speaker: 'Elena',
    content: [{
      text: "*A flicker of hope.*\n\nDo? First, we need to confirm I'm not imagining things. Second, we need to find others who've noticed. Third...\n\n*She pauses.*\n\nThird, we need to get this to someone who can actually do something about it. But who do you trust with information this big?\n\n*She looks at you.*\n\nThat's why I'm telling you. Because in all my pattern analysis of people at this station, you're the one who keeps showing up as trustworthy.",
      emotion: 'hopeful_cautious',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'help_verify',
        text: "Let's start with verification. Show me everything.",
        nextNodeId: 'elena_validation',
        pattern: 'analytical',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_validation',
    speaker: 'Elena',
    content: [{
      text: "*She exhales, tension leaving her shoulders.*\n\nYou believe me. You're not dismissing it as paranoia. You're not telling me to 'take a break.'\n\n*She starts organizing the data.*\n\nThis is what I needed. Not just someone to help with the analysis - someone who takes it seriously. Who treats the pattern as real until proven otherwise.\n\n*She looks at you with genuine gratitude.*\n\nWe're going to figure this out. Together.",
      emotion: 'relieved',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['elena_validated']
      }
    ],
    choices: [
      {
        choiceId: 'continue_together',
        text: "Together.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  // ============= NEXT STEPS AND TRANSITIONS =============
  {
    nodeId: 'elena_next_steps',
    speaker: 'Elena',
    content: [{
      text: "*She saves her work and turns to you.*\n\nI've been in this rabbit hole for too long. Thank you for... grounding me. For being a second pair of eyes.\n\n*She gestures at the station.*\n\nIf you want to come back, I'll be here. The patterns don't stop. Neither do I.\n\nAnd if you see anything strange out there in the station - any data that doesn't fit - you know where to find me.",
      emotion: 'warm',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "I'll be back. Stay sharp.",
        nextNodeId: samuelEntryPoints.ELENA_REFLECTION_GATEWAY,
        pattern: 'building',
        consequence: {
          addGlobalFlags: ['elena_arc_progress']
        }
      }
    ],
    tags: ['transition', 'elena_arc']
  },

  // ============= INTERRUPT TARGET NODES =============
  {
    nodeId: 'elena_interrupt_grounding',
    speaker: 'Elena',
    content: [{
      text: `*The holographics fade. She blinks like waking from a trance.*

*Long breath.*

Sorry. I... I get lost in it. The patterns. The noise.

*Quieter.*

You're the first person who's tried to pull me out instead of pushing me deeper.

*Looks at her hands.*

My therapist calls it "data spiraling." I call it... not being able to look away from the fire.

Thank you. For closing the display. Most people want me to find things faster.`,
      emotion: 'vulnerable_grateful',
      variation_id: 'interrupt_grounding_v1'
    }],
    choices: [
      {
        choiceId: 'elena_from_interrupt',
        text: "The truth will still be there after you breathe.",
        nextNodeId: 'elena_synthesis_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'interrupt_response']
  },

  // ============= REVISIT NODES =============
  {
    nodeId: 'elena_revisit_initial',
    speaker: 'Elena',
    content: [{
      text: "*She looks up from her screens, a genuine smile breaking through the focus.*\n\nYou came back. Good. I've found something new.\n\n*She gestures you over.*\n\nThe pattern we identified before? It's spreading. But I've also found what might be a counter-pattern. Someone else is watching.",
      emotion: 'eager',
      variation_id: 'default'
    }],
    requiredState: {
      hasGlobalFlags: ['elena_arc_progress']
    },
    choices: [
      {
        choiceId: 'show_counter_pattern',
        text: "Show me the counter-pattern.",
        nextNodeId: 'elena_counter_pattern',
        pattern: 'analytical',
        skills: ['curiosity']
      },
      {
        choiceId: 'how_are_you',
        text: "Before we dive in - how are you holding up?",
        nextNodeId: 'elena_revisit_wellbeing',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'revisit']
  },

  {
    nodeId: 'elena_revisit_wellbeing',
    speaker: 'Elena',
    content: [{
      text: "*She pauses, surprised by the question.*\n\nHow am I? People don't usually ask that. They want the data, not the analyst.\n\n*She considers.*\n\nBetter. Since we talked. Having someone who believes the pattern is real, who doesn't think I'm spiraling... it helps. I sleep now. Sometimes.\n\n*A small smile.*\n\nThank you for asking. Really.",
      emotion: 'touched',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'good_to_hear',
        text: "I'm glad. Now - show me what you found.",
        nextNodeId: 'elena_counter_pattern',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'elena_counter_pattern',
    speaker: 'Elena',
    content: [{
      text: "*She pulls up a new visualization - blue lines intersecting with the red anomalies.*\n\nLook. Wherever there's a probe, there's a response. Not immediate, but consistent. Someone's tracking the same things we are.\n\n*She frowns.*\n\nThe question is: are they the source, or another watcher? Ally or adversary?\n\n*She looks at you.*\n\nI could use your instincts here. The data alone isn't telling me.",
      emotion: 'analytical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'ally_intuition',
        text: "My gut says ally. The responses are defensive, not opportunistic.",
        nextNodeId: 'elena_ally_path',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'adversary_caution',
        text: "Be careful. Could be a honeypot. Someone baiting pattern-seekers.",
        nextNodeId: 'elena_caution_validated',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_ally_path',
    speaker: 'Elena',
    content: [{
      text: "*She nods slowly.*\n\nDefensive, not opportunistic. I see it too. The timing suggests they're responding to the probes, not coordinating with them.\n\n*She starts a new search.*\n\nIf there's another watcher... maybe I can find them. Leave a signal in the pattern. See if they respond.\n\nIt's a risk. But it might be worth it to not be alone in this.",
      emotion: 'hopeful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'support_signal',
        text: "Reach out. Carefully. But reach out.",
        nextNodeId: 'elena_signal_sent',
        pattern: 'building',
        skills: ['collaboration']
      }
    ]
  },

  {
    nodeId: 'elena_caution_validated',
    speaker: 'Elena',
    content: [{
      text: "*Her expression sharpens.*\n\nA honeypot. I hadn't fully considered that. Someone specifically targeting pattern-seekers.\n\n*She starts analyzing differently.*\n\nIf that's true... they know we're watching. The probe anomalies might be bait. Which means we need to be very careful about how we respond.\n\n*She looks at you with respect.*\n\nYou're good at this. Seeing angles I miss when I'm too deep in the data.",
      emotion: 'alert',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'proceed_carefully',
        text: "Let's watch a bit longer before making any moves.",
        nextNodeId: 'elena_watching_continues',
        pattern: 'patience',
        skills: ['strategicThinking']
      }
    ]
  },

  {
    nodeId: 'elena_signal_sent',
    speaker: 'Elena',
    content: [{
      text: "*She types something into the system - a small anomaly of her own.*\n\nDone. It's subtle. A pattern that says 'I see you' to anyone looking for patterns. Invisible to anyone who isn't.\n\n*She sits back.*\n\nNow we wait. If there's really another watcher out there... they'll respond. And if they don't...\n\n*She shrugs.*\n\nWe keep watching alone. But at least we tried.",
      emotion: 'resolved',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['elena_signal_sent']
      }
    ],
    choices: [
      {
        choiceId: 'wait_together',
        text: "We're not alone. We have each other.",
        nextNodeId: 'elena_partnership_deepened',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_watching_continues',
    speaker: 'Elena',
    content: [{
      text: "*She nods.*\n\nPatience. You're right. I have a tendency to act when I should observe.\n\n*She adjusts her monitoring.*\n\nWe'll watch. Gather more data. Wait for the pattern to fully reveal itself.\n\n*She glances at you.*\n\nHaving you here helps. You're like... a balancing function. When I want to jump, you remind me to look first.",
      emotion: 'appreciative',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'balance_together',
        text: "And you remind me to see patterns I'd miss. We balance each other.",
        nextNodeId: 'elena_partnership_deepened',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_partnership_deepened',
    speaker: 'Elena',
    content: [{
      text: "*She smiles - a real smile, not the nervous ones from before.*\n\nBalance. I like that. I've been tilted for so long, trying to see everything alone.\n\n*She gestures at the patterns around them.*\n\nWhatever we find, whatever this all means... I'm glad I'm not chasing it solo anymore.\n\n*She extends her hand.*\n\nPartners. In pattern-seeking and in whatever comes next.",
      emotion: 'warm',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_partnership_deepened'],
        addGlobalFlags: ['elena_trust_established']
      }
    ],
    choices: [
      {
        choiceId: 'shake_on_it',
        text: "*Take her hand.* Partners.",
        nextNodeId: 'elena_farewell',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 2,
          addGlobalFlags: ['elena_arc_complete']
        }
      }
    ],
    tags: ['elena_arc', 'milestone']
  },

  // ============= FAREWELL =============
  {
    nodeId: 'elena_farewell',
    speaker: 'Elena',
    content: [{
      text: "*She saves her work.*\n\nGo on. Explore the station. Talk to others. I'll be here, watching the patterns.\n\n*A knowing look.*\n\nAnd I'll be watching your pattern too. Not in a creepy way. Just... appreciating how you move through the world.\n\nYou make sense, you know? Your data is... coherent.",
      emotion: 'fond',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 5, altText: "*She saves her work.*\n\nYou think like me. That's rare. Go explore, but come back. I want to compare notes on what you see.\n\nYour analytical pattern... it's beautiful. Clean signal in a noisy world.", altEmotion: 'kindred' },
        { pattern: 'patience', minLevel: 5, altText: "*She saves her work.*\n\nYou've taught me something today. That patience isn't passive. It's a different kind of pattern-seeking.\n\nCome back when you can. I'll try to remember to breathe.", altEmotion: 'grateful' },
        { pattern: 'helping', minLevel: 5, altText: "*She saves her work.*\n\nYou came here to help me. And you did. More than you know.\n\nThe station is lucky to have someone like you moving through it. Come back soon.", altEmotion: 'touched' }
      ]
    }],
    choices: [
      {
        choiceId: 'return_to_samuel',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.ELENA_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'elena_arc']
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'elena_career_reflection_curator',
    speaker: 'Elena',
    content: [
      {
        text: `The way you organize your thinking... patient, analytical. You see how pieces connect.

Information architects do that—they create systems that help people find what they need. Organizers of knowledge.

In a world drowning in data, that skill matters more than ever.`,
        emotion: 'appreciative',
        variation_id: 'career_curator_v1'
      }
    ],
    requiredState: {
      patterns: {
        analytical: { min: 4 },
        patience: { min: 5 }
      }
    },
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['combo_knowledge_curator_achieved', 'elena_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'elena_career_curator_continue',
        text: "Making knowledge accessible. That resonates.",
        nextNodeId: 'elena_intro',
        pattern: 'patience'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'information_science']
  },

  {
    nodeId: 'elena_career_reflection_navigator',
    speaker: 'Elena',
    content: [
      {
        text: `You explore with purpose. Following threads, asking the right questions.

Research librarians are like that—guides through vast seas of information. They help discoveries happen by connecting seekers with knowledge.

Your curiosity combined with analysis... that's exactly what they need.`,
        emotion: 'interested',
        variation_id: 'career_navigator_v1'
      }
    ],
    requiredState: {
      patterns: {
        exploring: { min: 5 },
        analytical: { min: 4 }
      }
    },
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['combo_research_navigator_achieved', 'elena_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'elena_career_navigator_continue',
        text: "Helping others find their way through information.",
        nextNodeId: 'elena_intro',
        pattern: 'exploring'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'information_science']
  }
]

export const elenaDialogueNodes = nodes

export const elenaEntryPoints = {
  /** Main introduction - first meeting Elena */
  INTRODUCTION: 'elena_intro',

  /** Revisit entry - returning after first arc progress */
  REVISIT: 'elena_revisit_initial',

  /** Station observations branch - discussing what she's noticed */
  STATION_OBSERVATIONS: 'elena_station_observations',

  /** Reciprocity - Elena asks about the player */
  RECIPROCITY: 'elena_reciprocity',

  /** Vulnerability arc - trust-gated deep revelation */
  VULNERABILITY: 'elena_vulnerability_arc',

  /** Deep trust arc - trust >= 8 revelations */
  DEEP_TRUST: 'elena_deep_trust',

  /** Meta reflection - player pattern analysis */
  META_REFLECTION: 'elena_meta_reflection'
} as const

export type ElenaEntryPoint = typeof elenaEntryPoints[keyof typeof elenaEntryPoints]

export const elenaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(nodes.map(n => [n.nodeId, n])),
  startNodeId: elenaEntryPoints.INTRODUCTION,
  metadata: {
    title: 'Elena Arc - The Pattern Researcher',
    author: 'System',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: nodes.length,
    totalChoices: nodes.reduce((acc, n) => acc + n.choices.length, 0)
  }
}
