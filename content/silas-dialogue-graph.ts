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
        text: `The dashboard says we're fine. The dashboard says I'm a genius.

But the basil is dying.

I'm holding this soil. It crumbles into dust. Bone dry. The tablet says "MOISTURE OPTIMAL." The tablet lies.`,
        emotion: 'fearful_disbelief',
        variation_id: 'silas_intro_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'silas_intro_reality',
        text: "The map isn't the territory.",
        nextNodeId: 'silas_bankruptcy_reveal',
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
        nextNodeId: 'silas_tech_defense',
        pattern: 'analytical',
        skills: ['technicalLiteracy']
      },
      {
        choiceId: 'silas_intro_empathy',
        text: "You look terrified.",
        nextNodeId: 'silas_bankruptcy_reveal',
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

  {
    nodeId: 'silas_bankruptcy_reveal',
    speaker: 'Silas',
    content: [
      {
        text: `I should be.

I cashed out my Amazon stock options. All of it. Bought this vertical farm. "High-Efficiency Aeroponics."

Last quarter, the sensors said the pH was perfect. I lost the entire strawberry crop. $40,000 gone in a weekend.

If this basil dies, I lose the farm. I lose my house.`,
        emotion: 'desperate',
        variation_id: 'bankruptcy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_stakes_high',
        text: "So why are you staring at the tablet?",
        nextNodeId: 'silas_simulation_start',
        pattern: 'building',
        skills: ['actionOrientation']
      },
      {
        choiceId: 'silas_fear_paralysis',
        text: "You're afraid to trust your eyes because they don't have an API.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'analytical',
        skills: ['psychology']
      }
    ]
  },

  {
    nodeId: 'silas_tech_defense',
    speaker: 'Silas',
    content: [
      {
        text: `It's not drift! These are military-grade hygrometers. They cost more than my truck.

They *can't* be wrong. Because if they're wrong, then I don't know anything. I'm just a guy playing in the dirt with expensive toys.`,
        emotion: 'defensive_panic',
        variation_id: 'tech_defense_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_look_down',
        text: "Look at the dirt, Silas.",
        nextNodeId: 'silas_simulation_start',
        pattern: 'helping',
        skills: ['grounding']
      }
    ]
  },

  // ============= SCENE 3: SILAS'S ORIGIN =============
  {
    nodeId: 'silas_amazon_story',
    speaker: 'Silas',
    content: [
      {
        text: `You want to know how I got here?

Ten years at Amazon Web Services. Principal Engineer. I designed infrastructure that handled Black Friday traffic. Millions of requests per second, and I made them flow.

I was good at it. Really good. But I never touched what I was building. It was all abstractions.`,
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
        text: `There was an outage. Big one. Three hours of downtime. Cost the company millions.

We fixed it. I stayed up for 36 hours straight, tracing the bug through layers of abstraction. Found it in a race condition in a service I'd never heard of.

When it was over, I went home, sat in my backyard, and looked at a tomato plant my neighbor had given me. It was dying. I didn't know how to save it.

I could orchestrate a million servers, but I couldn't keep one plant alive.`,
        emotion: 'humbled_realization',
        variation_id: 'burnout_v1'
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
        text: `I thought I understood systems. Turns out I only understood one kind.

Cloud infrastructure is forgiving. You can roll back. You can restart. You can scale horizontally.

A plant? If you kill it, it's dead. No rollbacks. No retries. Just consequences.

I wanted to learn the kind of system that doesn't forgive.`,
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
        text: `There was an old farmer at the market. Mr. Hawkins. Eighty years old, hands like tree bark.

I asked him: "How do you know when to water?"

He looked at me like I was crazy. "I look at the plant. I touch the soil. I smell the air."

No sensors. No dashboard. Just... attention.`,
        emotion: 'reverent',
        variation_id: 'learning_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_hawkins_teach',
        text: "Did he teach you?",
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
        text: `Every Saturday for two years. He'd wake up at 4 AM, and I'd be there.

He never used a single sensor. Never even had a thermometer. He'd stick his finger in the dirt and tell you the moisture content within 5%.

"The soil talks," he'd say. "You just have to learn its language."

I thought I could encode that language into software. I thought I could scale Mr. Hawkins.`,
        emotion: 'nostalgic_guilt',
        variation_id: 'hawkins_lesson_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_scale_mistake',
        text: "But some things don't scale.",
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
        text: `I thought I could improve it. Engineer around the human limitation.

Mr. Hawkins could only tend one farm. My sensors could tend thousands. That was the pitch to myself.

But I forgot something. Mr. Hawkins never lost a crop. Not once in sixty years.

I've been farming for two years and I've lost three.`,
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
        text: `The strawberries. That was the worst.

The pH sensor said 6.5—perfect for strawberries. But the sensor was in the wrong spot. Edge of the bed, where the water pooled.

The center of the bed was at 5.2. Too acidic. The plants couldn't absorb iron.

They looked healthy for weeks. Green leaves, good structure. Then one morning—yellow. Chlorosis. Iron deficiency. Dead in 48 hours.`,
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
        nextNodeId: 'silas_sensor_problem',
        pattern: 'helping',
        skills: ['empathy']
      }
    ],
    tags: ['silas_arc', 'failure_story']
  },

  {
    nodeId: 'silas_sensor_problem',
    speaker: 'Silas',
    content: [
      {
        text: `Exactly. A sensor gives you one number. One point in space, one moment in time.

Mr. Hawkins would walk the whole field. Touch soil in twenty spots. Smell it. Taste it sometimes.

He had a mental model of the whole system. I had a dashboard with green checkmarks.

The checkmarks were true. They just weren't complete.`,
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
        text: `*He shoves the tablet at you.*

*The screen displays a readout:*
"SYSTEM STATUS: ZONE 4 - 65% HUMIDITY (OPTIMAL)"
"FLOW RATE: 2.5 L/MIN"
"VALVE STATE: OPEN"

It says the water is flowing. It says everything is fine.

*He points to the wilted plants.*

But look at them. They're gasping.

What do I do? If I override the system and flood them, I could rot the roots. If I do nothing, they dry out by morning.`,
        emotion: 'paralyzed',
        variation_id: 'sim_start_v2',
        richEffectContext: 'warning',
        useChatPacing: true
      }
    ],
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
        text: `*You run the diagnostic. A loading bar spins.*

*A green checkmark appears: "NO ERRORS FOUND."*

*Silas stares at the screen. A leaf falls off the basil plant next to him. It crunches when it hits the floor.*

The software says we're fine. The plant is dead.

I... I can't do this. I'm going back to cloud computing. At least there, when it says 'Up', it means 'Up'.`,
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
        text: `*You yank the manual lever. Water roars into the bed.*

*The dry soil turns to mud instantly. But the water doesn't drain. It sits there, stagnating.*

*The tablet flashes: "ALERT: ROOT ANOXIA DETECTED."*

*Silas groans.*

We drowned them. The soil was compacted. It couldn't drain. Now they'll rot before morning.

I panicked. I broke the system because I was scared.`,
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
        text: `*You crawl under the rack. You trace the PVC pipe. It vibrates—there's water inside.*

*But right before the nozzle... a kink. A physical crimp in the line.*

*Silas crawls next to you.*

The sensor measures flow at the *valve*. The kink is *after* the valve.

The sensor wasn't lying. It was measuring the wrong thing. It was measuring intent, not delivery.`,
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
        text: `*A hiss of air, then a steady trickle of water. The soil darkens.*

*Silas touches the wet dirt. He closes his eyes.*

Ground truth.

I spent all year coding dashboards to avoid crawling in the dirt. But the answer was in the dirt.`,
        emotion: 'humbled',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    onEnter: [
      {
        characterId: 'silas',
        thoughtId: 'green-frontier'
      }
    ],
    choices: [
      {
        choiceId: 'silas_lesson',
        text: "You can't farm from a dashboard.",
        nextNodeId: 'silas_climax_decision',
        pattern: 'analytical',
        skills: ['groundedness']
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
        text: `Systems are everywhere. I saw a kid, Devon, drawing flowcharts for his dad. He gets it. A family is just a network that needs maintenance.

But I'm done with 'Smart Farming.'

I'm going to start a 'Feral Lab.' Low-tech. High-biology.

We teach engineers how to touch grass. Real grass. How to listen to a system that doesn't have an API.`,
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
        text: `*His eyes light up. He wipes dirt on his jeans and pulls out a worn notebook.*

I've been sketching this for months. The "Feral Lab."

Not a coding bootcamp. Not an accelerator. A deceleration program.

We take burnt-out engineers—people like I was—and we put them in a greenhouse. No WiFi. No Slack. Just seeds, soil, and time.`,
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
        text: `Feral: wild, having escaped domestication.

Tech workers are domesticated. We've been trained to respond to notifications, to measure our worth in metrics, to fear uncertainty.

Feral means rewilding. Teaching people to trust their senses again. To be comfortable not knowing.

Mr. Hawkins never googled anything. He just... watched. For sixty years. And he knew more about soil than any PhD I've met.`,
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
        text: `Three months ago, I ran a pilot. Six engineers from the tech park downtown. One weekend.

One guy, Marcus—not the paramedic, different Marcus—came in with three phones. Product manager at a startup. Couldn't sit still for ten minutes.

By Sunday, he was talking to a tomato plant. Not ironically. He'd realized the plant's leaves were telling him it was thirsty before any sensor could.`,
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
    tags: ['silas_arc', 'feral_lab']
  },

  {
    nodeId: 'silas_workshop_result',
    speaker: 'Silas',
    content: [
      {
        text: `He quit his startup three weeks later. Started a consulting practice. Works half the hours.

But here's the thing—he's not less productive. He's more productive. He just stopped confusing activity with progress.

Last week he sent me a photo. His company built a meditation garden at their office. He's teaching his team to debug their minds before they debug code.`,
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
        text: `Week One: Observation. No phones. You sit in the greenhouse and draw what you see. Every day, the same plant. You notice things change.

Week Two: Failure. You grow something that will definitely die. You watch it die. You learn that death isn't a bug—it's part of the system.

Week Three: Integration. You design a sensor. But the rule is: the sensor can only confirm what you already suspected from looking. It's a check, not a crutch.`,
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
        text: `That technology should amplify human judgment, not replace it.

By week three, they've developed intuition. The sensor becomes a tool for calibrating that intuition—not a substitute for it.

One woman, a data scientist, said something that stuck with me: "I used to think dashboards showed me reality. Now I know they show me someone's decision about what to measure."

That's the shift. Sensors don't lie—they just answer the question you asked. The wisdom is in asking the right question.`,
        emotion: 'teaching',
        variation_id: 'integration_v1'
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
        text: `*He sets down the notebook and looks at his hands. They're calloused now.*

Ground truth. It's a surveying term. The actual measurement from the field, not the model.

But I think it's bigger than that. Ground truth is what happens when you stop mediating reality through screens and actually touch it.

Mr. Hawkins had ground truth. He could feel a storm coming before the barometer dropped. Not magic—just sixty years of paying attention to things that don't have notification sounds.`,
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
      }
    ],
    tags: ['silas_arc', 'philosophy']
  },

  {
    nodeId: 'silas_hawkins_death',
    speaker: 'Silas',
    content: [
      {
        text: `*He's quiet for a moment.*

He passed last spring. In his garden. His daughter found him kneeling in the strawberry bed.

At his funeral, there were no PowerPoints. No eulogies. People just told stories about things he'd taught them. How to read clouds. When to plant by the moon. How to make compost that smelled like coffee instead of rot.

He left me his trowel. It's 50 years old. The handle is worn smooth from his hands.`,
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
        text: `I want to scale Mr. Hawkins. But not through software.

One workshop at a time. One burnt-out engineer learning to feel the difference between wet soil and dry. One product manager realizing that "move fast and break things" doesn't work when the thing you break is alive.

The goal isn't to reject technology. It's to remember that we're the sensors. We're the real-time processing. The dashboards should serve us, not the other way around.

The basil is already perking up. The water finally reached its roots.

Ground truth. It's not just about farming. It's about how we know what we know.`,
        emotion: 'resolved_peaceful',
        variation_id: 'final_vision_v1'
      }
    ],
    choices: [
      {
        choiceId: 'silas_farewell_deep',
        text: "Keep growing, Silas.",
        nextNodeId: 'silas_farewell_good',
        pattern: 'helping',
        skills: ['encouragement'],
        consequence: {
          characterId: 'silas',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['silas_full_arc_complete']
      }
    ],
    tags: ['silas_arc', 'ending']
  },

  {
    nodeId: 'silas_farewell_good',
    speaker: 'Silas',
    content: [
      {
        text: `*He smiles—maybe the first genuine smile you've seen from him.*

I will. And hey—if you ever burn out, come find me.

I'll teach you how to grow something. Something that can't be debugged. Something that just... grows.

Tell Samuel I said thanks. For building a station where people like me can find people like you.`,
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
        addGlobalFlags: ['silas_arc_complete']
      }
    ],
    tags: ['transition', 'silas_arc', 'good_ending']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'silas_bad_ending',
    speaker: 'Silas',
    content: [
      {
        text: `*Silas stands up, dusting off his knees.*

I'm listing the equipment on eBay tomorrow.

I'll take a contract job. Database admin. Something air-conditioned. Something where I can't kill anything.

Safe travels.`,
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
        text: `I will.

If you see Samuel, tell him... tell him the sensor was wrong. The ground was right.`,
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
      }
    ],
    tags: ['transition', 'silas_arc']
  }
]

export const silasEntryPoints = {
  INTRODUCTION: 'silas_introduction'
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