/**
 * Crossroads System
 * Dramatic decision moments where characters face major life choices
 *
 * Design Philosophy:
 * - These are the BIG moments - the ones players remember
 * - Multiple approaches available based on player's patterns and trust
 * - No "wrong" answers - different approaches lead to different outcomes
 * - The player helps but doesn't decide - the character chooses
 * - Pattern-gated approaches reward investment without locking out content
 */

import { PatternType } from './patterns'

/**
 * A single approach the player can take during a crossroads
 */
export interface CrossroadsApproach {
  id: string
  label: string              // What player sees
  description: string        // Tooltip/expansion text

  // Requirements (all optional - default approach has none)
  requirements?: {
    pattern?: PatternType    // Must have this as dominant/high pattern
    patternMin?: number      // Minimum level (percentage of total, e.g., 30 = 30%)
    trustMin?: number        // Minimum trust with this character
    requiredFlags?: string[] // Must have these flags
  }

  // What happens if this approach is chosen
  outcome: {
    characterResponse: string[]  // Multi-part response from character
    emotionArc: string[]         // How character feels through response
    trustChange: number          // How this affects relationship
    globalFlagsSet: string[]     // Flags to set
    unlockedContent?: string     // Description of what this unlocks
  }
}

/**
 * A crossroads moment definition
 */
export interface CrossroadsMoment {
  id: string
  characterId: string
  name: string                   // "Maya's Decision", "Devon's Call"

  // Narrative context
  stakes: string                 // What's at risk
  setup: string[]                // Dialogue leading into the crossroads

  // When this crossroads triggers
  triggerConditions: {
    trustMin: number
    requiredFlags: string[]
    requiredTransformations?: string[]  // Must have witnessed these
  }

  // Available approaches
  approaches: CrossroadsApproach[]

  // Fallback/default approach (always available)
  defaultApproach: CrossroadsApproach

  // After resolution
  resolution: {
    sharedDialogue: string[]     // Always shown after any approach
    nextNodeId?: string          // Where to go in dialogue graph
  }
}

/**
 * All crossroads moments
 * Starting with Maya as proof of concept
 */
export const CROSSROADS_MOMENTS: CrossroadsMoment[] = [
  // ============================================
  // MAYA'S CROSSROADS: The Parent Visit
  // ============================================
  {
    id: 'maya_parent_decision',
    characterId: 'maya',
    name: "Maya's Decision",

    stakes: "Maya's parents are visiting tomorrow. She needs to decide what to tell them about her path.",

    setup: [
      "*Maya's phone buzzes. She looks at it, face going pale.*",
      "\"My parents. They're coming tomorrow.\"",
      "*She sets the phone down slowly, hands not quite steady.*",
      "\"They think they're visiting their pre-med daughter.\"",
      "\"I haven't... I don't know how to...\"",
      "*She looks at you, really looks, for the first time.*",
      "\"What do I even say?\""
    ],

    triggerConditions: {
      trustMin: 6,
      requiredFlags: ['knows_robotics', 'knows_maya_family_pressure', 'maya_transformation_complete']
    },

    approaches: [
      // ANALYTICAL APPROACH
      {
        id: 'analytical_approach',
        label: "Help her see the data",
        description: "Walk through the facts: job prospects, salary ranges, career satisfaction statistics for biomedical engineering.",

        requirements: {
          pattern: 'analytical',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Maya listens as you lay out the numbers.*",
            "\"Biomedical engineering... the job growth is actually higher than general practice medicine.\"",
            "\"And the median salary...\"",
            "*She pulls out her phone, starts searching.*",
            "\"UAB has a program. I never even looked because I thought—\"",
            "*A slow exhale.*",
            "\"Facts. They can't argue with facts.\"",
            "\"It's not 'abandoning medicine.' It's... evolving it.\""
          ],
          emotionArc: ['anxious', 'curious', 'surprised', 'hopeful', 'determined'],
          trustChange: 2,
          globalFlagsSet: ['maya_analytical_support', 'maya_considering_biomedical'],
          unlockedContent: "Maya will approach her parents with data and career statistics"
        }
      },

      // PATIENT APPROACH
      {
        id: 'patience_approach',
        label: "Give her space to feel it",
        description: "Don't offer solutions. Just be present. Let her work through the fear herself.",

        requirements: {
          pattern: 'patience',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*You don't say anything. Just... stay.*",
            "*Maya's breathing slows. The silence isn't empty—it's full.*",
            "\"I keep trying to figure out the right words.\"",
            "\"But maybe... maybe there are no right words.\"",
            "*She looks at her robot companion, still perched nearby.*",
            "\"Maybe I just need to show them.\"",
            "\"Show them what makes me come alive.\"",
            "*A small laugh, almost surprised.*",
            "\"When did I get so scared of my own parents seeing who I actually am?\""
          ],
          emotionArc: ['tense', 'softening', 'reflective', 'vulnerable', 'resolving'],
          trustChange: 3,
          globalFlagsSet: ['maya_patience_support', 'maya_show_dont_tell'],
          unlockedContent: "Maya will show her parents her robot instead of explaining"
        }
      },

      // BUILDING APPROACH
      {
        id: 'building_approach',
        label: "Suggest the hybrid path",
        description: "Medical robotics. Surgical automation. Help her see she doesn't have to choose between worlds.",

        requirements: {
          pattern: 'building',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "\"Wait—\" *Maya sits forward.* \"Medical robotics?\"",
            "\"Like... surgical systems? Prosthetic interfaces?\"",
            "*Her robot companion chirps excitedly, sensing her energy shift.*",
            "\"I could design tools that help surgeons. Or... or prosthetics that respond to neural signals.\"",
            "\"It's not abandoning medicine. It's—\"",
            "*Her eyes are bright now, that spark you've seen before.*",
            "\"It's building the future of medicine.\"",
            "\"My parents wanted me to help people. What if I could help millions?\""
          ],
          emotionArc: ['confused', 'intrigued', 'excited', 'inspired', 'determined'],
          trustChange: 2,
          globalFlagsSet: ['maya_building_support', 'maya_medical_robotics_vision'],
          unlockedContent: "Maya will pitch medical robotics as her hybrid path"
        }
      },

      // TRUST-BASED APPROACH
      {
        id: 'trust_approach',
        label: "Share your own story",
        description: "Tell her about a time you had to choose between what was expected and what felt right.",

        requirements: {
          trustMin: 8
        },

        outcome: {
          characterResponse: [
            "*Maya listens. Really listens.*",
            "*When you finish, she's quiet for a long moment.*",
            "\"You get it. You actually get it.\"",
            "\"It's not about disappointing them. It's about...\"",
            "*She trails off, thinking.*",
            "\"...about whether I can live with disappointing myself.\"",
            "\"Every day. For the rest of my life.\"",
            "*She meets your eyes.*",
            "\"Thank you. For trusting me with that.\""
          ],
          emotionArc: ['attentive', 'moved', 'understanding', 'resolved', 'grateful'],
          trustChange: 3,
          globalFlagsSet: ['maya_deep_trust', 'player_shared_story'],
          unlockedContent: "Maya sees you as a true confidant—deepest dialogue unlocked"
        }
      },

      // HELPING APPROACH
      {
        id: 'helping_approach',
        label: "Offer to be there",
        description: "Tell her she doesn't have to face them alone. You could be there—moral support.",

        requirements: {
          pattern: 'helping',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Maya's expression shifts—surprise, then something softer.*",
            "\"You'd... you'd do that?\"",
            "\"I wasn't even—I mean, we barely—\"",
            "*She stops, recalibrating.*",
            "\"Actually, you know what? Yes.\"",
            "\"Having someone there who sees me... the real me...\"",
            "*A determined nod.*",
            "\"It might help them see her too.\""
          ],
          emotionArc: ['surprised', 'touched', 'uncertain', 'deciding', 'grateful'],
          trustChange: 2,
          globalFlagsSet: ['maya_helping_support', 'player_will_attend'],
          unlockedContent: "Player will be present during Maya's conversation with parents"
        }
      },

      // EXPLORING APPROACH
      {
        id: 'exploring_approach',
        label: "Ask what she's really afraid of",
        description: "Dig deeper. Is it their disappointment? Their sacrifice? Something else?",

        requirements: {
          pattern: 'exploring',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Maya starts to answer, then stops.*",
            "\"I was going to say 'disappointing them' but...\"",
            "*A long pause.*",
            "\"It's not that. It's...\"",
            "*Her voice drops.*",
            "\"What if they sacrificed everything... and I'm just not good enough to deserve it?\"",
            "*The words hang there, raw and real.*",
            "\"Not the path. Me. What if I'm the disappointment?\"",
            "*She looks at you, eyes wet but steady.*",
            "\"I've never said that out loud before.\""
          ],
          emotionArc: ['deflecting', 'thinking', 'vulnerable', 'raw', 'relieved'],
          trustChange: 3,
          globalFlagsSet: ['maya_exploring_support', 'maya_core_fear_revealed'],
          unlockedContent: "Maya's deepest fear revealed—new dialogue about self-worth"
        }
      }
    ],

    // DEFAULT (always available)
    defaultApproach: {
      id: 'default_approach',
      label: "Listen and support",
      description: "You don't have all the answers. But you can be here.",

      outcome: {
        characterResponse: [
          "*You don't have the perfect thing to say. But you're here.*",
          "*Maya seems to sense that—the genuine presence, no agenda.*",
          "\"You know what's funny?\"",
          "\"Everyone always has advice. 'Do this.' 'Say that.'\"",
          "\"You're just... here.\"",
          "*A small, real smile.*",
          "\"That actually helps more than you know.\""
        ],
        emotionArc: ['stressed', 'observing', 'softening', 'appreciating'],
        trustChange: 1,
        globalFlagsSet: ['maya_default_support'],
        unlockedContent: "Standard progression through Maya's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*Maya takes a deep breath.*",
        "\"Tomorrow. I'll talk to them tomorrow.\"",
        "*She looks at her robot companion, then back at you.*",
        "\"Whatever happens... I'm glad I'm not doing this alone.\""
      ],
      nextNodeId: 'maya_post_crossroads'
    }
  },

  // ============================================
  // DEVON'S CROSSROADS (Structure for later)
  // ============================================
  {
    id: 'devon_father_call',
    characterId: 'devon',
    name: "Devon's Call",

    stakes: "Devon's father is calling. After months of silence. The phone is ringing.",

    setup: [
      "*Devon's phone lights up. He stares at it like it's a live grenade.*",
      "\"It's him.\"",
      "*The ringtone—generic, impersonal—fills the space.*",
      "\"He never calls. Not since I left for school.\"",
      "*His hand hovers over the phone.*",
      "\"What if he... what if something's wrong?\""
    ],

    triggerConditions: {
      trustMin: 7,
      requiredFlags: ['devon_transformation_complete', 'knows_devon_father'],
      requiredTransformations: ['devon_dropping_script']
    },

    approaches: [
      {
        id: 'analytical_approach',
        label: "Help him prepare",
        description: "Talk through what his father might say. Prepare responses. Have a plan.",

        requirements: {
          pattern: 'analytical',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Devon nods, grabbing onto the structure.*",
            "\"Right. Okay. If he says X, I respond with—\"",
            "*The phone keeps ringing.*",
            "\"No. No, I can't script this.\"",
            "*He picks up the phone.*",
            "\"Dad? ...Yeah. Yeah, I'm here.\""
          ],
          emotionArc: ['panicked', 'focusing', 'realizing', 'brave'],
          trustChange: 1,
          globalFlagsSet: ['devon_analytical_support'],
          unlockedContent: "Devon takes the call with preparation, finds it doesn't matter"
        }
      },

      {
        id: 'patience_approach',
        label: "Just be present",
        description: "Don't say anything. Just sit with him. Let him decide.",

        requirements: {
          pattern: 'patience',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*The phone rings. And rings.*",
            "*Devon looks at you. You don't look away.*",
            "*Something in his shoulders releases.*",
            "*He picks up.*",
            "\"Hey, Dad.\"",
            "*His voice is steadier than you've ever heard it.*"
          ],
          emotionArc: ['frozen', 'seen', 'grounded', 'ready'],
          trustChange: 2,
          globalFlagsSet: ['devon_patience_support'],
          unlockedContent: "Devon takes the call centered, finds his own strength"
        }
      }
    ],

    defaultApproach: {
      id: 'default_approach',
      label: "Encourage him",
      description: "Tell him he can do this. Whatever happens.",

      outcome: {
        characterResponse: [
          "\"Yeah. Yeah, I can do this.\"",
          "*Devon picks up the phone, hand only slightly shaking.*",
          "\"Dad? Hi. No, nothing's wrong. I just...\"",
          "*He looks at you.*",
          "\"I just wanted to hear your voice.\""
        ],
        emotionArc: ['nervous', 'determined', 'connected'],
        trustChange: 1,
        globalFlagsSet: ['devon_default_support'],
        unlockedContent: "Standard progression through Devon's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*The call ends. Devon sits in silence.*",
        "\"He said... he said he misses me.\"",
        "*A pause.*",
        "\"I didn't have to optimize anything. I just had to... talk.\""
      ],
      nextNodeId: 'devon_post_crossroads'
    }
  },

  // ============================================
  // TESS'S CROSSROADS: The Record Deal
  // ============================================
  {
    id: 'tess_record_offer',
    characterId: 'tess',
    name: "Tess's Second Chance",

    stakes: "A label has found Tess's old demo tape. They want to release it—but with 'modern production updates.'",

    setup: [
      "*Tess is holding a letter. Her hands are completely still—no record flipping.*",
      "\"Some intern found my '87 demo tape. Uploaded it to their CEO.\"",
      "*She laughs, but it sounds hollow.*",
      "\"They want to release it. 'Updated for modern audiences.'\"",
      "\"Thirty-seven years I've been saying no to these people.\"",
      "*She looks at you.*",
      "\"So why am I not crumpling this up?\""
    ],

    triggerConditions: {
      trustMin: 6,
      requiredFlags: ['knows_tess_corporate_past', 'tess_transformation_complete']
    },

    approaches: [
      {
        id: 'building_approach',
        label: "Suggest she produce it herself",
        description: "She has the skills. She has the studio. She could release it on her own terms.",

        requirements: {
          pattern: 'building',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Tess goes very still.*",
            "\"Produce it... myself.\"",
            "*She looks around her shop—at the equipment, the connections, the decades of expertise.*",
            "\"I've been so busy gatekeeping other people's music...\"",
            "*A slow, wondering laugh.*",
            "\"I forgot I could gatekeep my own.\"",
            "\"No label. No 'updates.' Just... me. Finally.\""
          ],
          emotionArc: ['frozen', 'considering', 'wondering', 'realizing', 'determined'],
          trustChange: 3,
          globalFlagsSet: ['tess_building_support', 'tess_self_release'],
          unlockedContent: "Tess will self-produce and release her demo as-is"
        }
      },

      {
        id: 'analytical_approach',
        label: "Walk through what 'modern updates' really means",
        description: "Make her confront exactly what they'd change. Let the specifics decide for her.",

        requirements: {
          pattern: 'analytical',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "\"Fine. Let's be specific.\"",
            "*She reads the letter more carefully.*",
            "\"'Contemporary production...' That means auto-tune. 'Updated arrangements...' That means drum machines.\"",
            "*Her jaw tightens.*",
            "\"'Modern vocal processing...' That means making me sound like everyone else.\"",
            "*She sets the letter down.*",
            "\"I walked away in '87 because they wanted to erase me. Nothing's changed.\""
          ],
          emotionArc: ['defensive', 'analytical', 'angry', 'certain'],
          trustChange: 2,
          globalFlagsSet: ['tess_analytical_support', 'tess_refuses_again'],
          unlockedContent: "Tess rejects the offer with clarity, not just stubbornness"
        }
      },

      {
        id: 'patience_approach',
        label: "Ask what 23-year-old Tess would want",
        description: "Not industry Tess. Not curator Tess. The girl who made the tape.",

        requirements: {
          pattern: 'patience',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Tess closes her eyes.*",
            "\"She wanted people to hear it. That's all. Just... hear it.\"",
            "*A long pause.*",
            "\"She didn't care about production quality or market trends.\"",
            "\"She just wanted to know she wasn't singing into the void.\"",
            "*She opens her eyes, something softer there now.*",
            "\"Maybe it doesn't matter how it sounds. Maybe it just matters that it exists.\""
          ],
          emotionArc: ['guarded', 'remembering', 'tender', 'peaceful'],
          trustChange: 3,
          globalFlagsSet: ['tess_patience_support', 'tess_releases_for_young_self'],
          unlockedContent: "Tess agrees to a release, honoring her younger self's wish to be heard"
        }
      },

      {
        id: 'exploring_approach',
        label: "Ask why she kept the tape all these years",
        description: "If she was really done with it, wouldn't she have destroyed it?",

        requirements: {
          pattern: 'exploring',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Tess's hand moves unconsciously to a shelf—an old cassette rack.*",
            "\"I have a copy. Still. In the back.\"",
            "*She looks at it like she's seeing it for the first time.*",
            "\"If I'd really given up... I would have burned it. Wouldn't I?\"",
            "\"Maybe part of me was always waiting.\"",
            "*A strange, complicated smile.*",
            "\"Guess I need to figure out what I was waiting for.\""
          ],
          emotionArc: ['deflecting', 'realizing', 'vulnerable', 'questioning'],
          trustChange: 2,
          globalFlagsSet: ['tess_exploring_support', 'tess_confronts_hope'],
          unlockedContent: "Tess admits she never fully let go of her dream"
        }
      }
    ],

    defaultApproach: {
      id: 'default_approach',
      label: "Remind her she doesn't owe anyone an answer",
      description: "It's her music. Her decision. She doesn't have to decide today.",

      outcome: {
        characterResponse: [
          "*Tess exhales.*",
          "\"You're right. Thirty-seven years. What's another week?\"",
          "*She folds the letter carefully, doesn't throw it away.*",
          "\"I've made a career of telling others what their music is worth.\"",
          "\"Turns out I still don't know what mine is worth.\""
        ],
        emotionArc: ['tense', 'releasing', 'reflective'],
        trustChange: 1,
        globalFlagsSet: ['tess_default_support'],
        unlockedContent: "Standard progression through Tess's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*Tess puts on a record. Something old, scratchy, real.*",
        "\"Whatever I decide... thanks for not telling me what to do.\"",
        "*The music plays.*",
        "\"Everyone's always got opinions about other people's dreams.\""
      ],
      nextNodeId: 'tess_post_crossroads'
    }
  },

  // ============================================
  // SAMUEL'S CROSSROADS: The Final Advice
  // ============================================
  {
    id: 'samuel_final_counsel',
    characterId: 'samuel',
    name: "Samuel's Final Counsel",

    stakes: "You're about to leave the station—choose your platform. Samuel has one last thing to say.",

    setup: [
      "*Samuel finds you at the intersection of all platforms.*",
      "\"So. You've seen the paths. Met the travelers.\"",
      "*His owl eyes are knowing but kind.*",
      "\"Before you board... I need to tell you something.\"",
      "\"Something I don't say. To anyone.\"",
      "*He gestures at the empty bench beside him.*",
      "\"Sit with me?\""
    ],

    triggerConditions: {
      trustMin: 7,
      requiredFlags: ['samuel_transformation_complete', 'characters_met_3_plus']
    },

    approaches: [
      {
        id: 'patience_approach',
        label: "Sit in comfortable silence",
        description: "He'll speak when he's ready. He always does.",

        requirements: {
          pattern: 'patience',
          patternMin: 35
        },

        outcome: {
          characterResponse: [
            "*You sit. The station hums around you.*",
            "*Samuel doesn't speak. Not yet.*",
            "*Minutes pass. The departure board flickers.*",
            "\"You know why I like you?\"",
            "*He smiles.*",
            "\"You don't fill silence with noise.\"",
            "\"That's rare. That's... valuable.\""
          ],
          emotionArc: ['contemplative', 'waiting', 'peaceful', 'warm'],
          trustChange: 2,
          globalFlagsSet: ['samuel_patience_valued'],
          unlockedContent: "Samuel's deepest wisdom comes through silence"
        }
      },

      {
        id: 'exploring_approach',
        label: "Ask about the platforms you haven't visited",
        description: "There might be paths you haven't considered. What hasn't he shown you?",

        requirements: {
          pattern: 'exploring',
          patternMin: 35
        },

        outcome: {
          characterResponse: [
            "*Samuel's eyes crinkle.*",
            "\"Always curious. Good.\"",
            "\"There are platforms that don't appear on the board.\"",
            "\"Paths that only exist when you create them.\"",
            "*He gestures at the empty space between platforms.*",
            "\"Sometimes the train you need... hasn't been built yet.\"",
            "\"And you're the one who has to build it.\""
          ],
          emotionArc: ['pleased', 'mysterious', 'profound', 'encouraging'],
          trustChange: 2,
          globalFlagsSet: ['samuel_hidden_paths_revealed'],
          unlockedContent: "Samuel reveals that some paths must be created, not chosen"
        }
      },

      {
        id: 'helping_approach',
        label: "Ask if there's anything you can do for him",
        description: "He's helped so many. Does anyone ever help him?",

        requirements: {
          pattern: 'helping',
          patternMin: 35
        },

        outcome: {
          characterResponse: [
            "*Samuel goes very still.*",
            "\"Do for... me?\"",
            "*A long pause.*",
            "\"No one's asked me that in... I don't know how long.\"",
            "*He looks at the station around him.*",
            "\"I stay because I chose to. But sometimes...\"",
            "*He doesn't finish. He doesn't have to.*",
            "\"Thank you. For asking.\""
          ],
          emotionArc: ['surprised', 'touched', 'vulnerable', 'grateful'],
          trustChange: 3,
          globalFlagsSet: ['samuel_helper_helped', 'samuel_loneliness_acknowledged'],
          unlockedContent: "Samuel's loneliness is acknowledged—deepest connection"
        }
      }
    ],

    defaultApproach: {
      id: 'default_approach',
      label: "Listen to his advice",
      description: "He's guided you this far. Hear him out.",

      outcome: {
        characterResponse: [
          "*Samuel nods.*",
          "\"Every path has its price. Its gifts. Its losses.\"",
          "\"The only wrong choice is the one you make out of fear.\"",
          "\"Or the one you never make at all.\"",
          "*He looks at you steadily.*",
          "\"Choose, and then become the person who chose well.\""
        ],
        emotionArc: ['wise', 'warm', 'encouraging'],
        trustChange: 1,
        globalFlagsSet: ['samuel_final_wisdom'],
        unlockedContent: "Samuel's core advice for life choices"
      }
    },

    resolution: {
      sharedDialogue: [
        "*The departure board chimes.*",
        "*Samuel stands, offering his hand.*",
        "\"Safe travels. Whatever platform you choose.\"",
        "*His grip is warm, steady.*",
        "\"The station will always be here. If you need it.\""
      ],
      nextNodeId: 'samuel_farewell'
    }
  },

  // ============================================
  // MARCUS'S CROSSROADS: The Night Shift Decision
  // ============================================
  {
    id: 'marcus_overtime_choice',
    characterId: 'marcus',
    name: "Marcus's Balance",

    stakes: "Marcus has been offered a promotion—but it means more night shifts, more codes, more weight.",

    setup: [
      "*Marcus is staring at a schedule, unmoving.*",
      "\"They want to make me shift supervisor.\"",
      "*He doesn't look up.*",
      "\"More money. More responsibility. More nights like tonight.\"",
      "*His hands are clasped, knuckles white.*",
      "\"I save more lives this way. But what about my own?\""
    ],

    triggerConditions: {
      trustMin: 6,
      requiredFlags: ['marcus_transformation_complete', 'knows_marcus_first_patient']
    },

    approaches: [
      {
        id: 'helping_approach',
        label: "Remind him why he started",
        description: "Before the weight, before the counting—why did he choose this?",

        requirements: {
          pattern: 'helping',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Marcus's eyes close.*",
            "\"My grandmother. Her dialysis nurse held her hand every session.\"",
            "\"Made her laugh. Made her feel human, not just a patient.\"",
            "*He opens his eyes.*",
            "\"I wanted to be that person. For someone.\"",
            "\"But supervisor... that's managing schedules. Not holding hands.\""
          ],
          emotionArc: ['remembering', 'tender', 'conflicted'],
          trustChange: 2,
          globalFlagsSet: ['marcus_helping_support', 'marcus_remembers_origin'],
          unlockedContent: "Marcus reconnects with his original calling"
        }
      },

      {
        id: 'analytical_approach',
        label: "Help him weigh the trade-offs",
        description: "More patients helped indirectly vs. fewer patients helped directly.",

        requirements: {
          pattern: 'analytical',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Marcus nods slowly.*",
            "\"Direct care: maybe twenty patients a shift. Personal.\"",
            "\"Supervisor: influence over hundreds. But through policy, not presence.\"",
            "*He looks at his hands.*",
            "\"I count heartbeats because I need to feel them.\"",
            "\"How do you feel a heartbeat through a spreadsheet?\""
          ],
          emotionArc: ['analytical', 'calculating', 'uncertain', 'lost'],
          trustChange: 1,
          globalFlagsSet: ['marcus_analytical_support'],
          unlockedContent: "Marcus sees the math but it doesn't answer the question"
        }
      },

      {
        id: 'patience_approach',
        label: "Ask what his body is telling him",
        description: "He tracks everyone's vital signs. What are his own saying?",

        requirements: {
          pattern: 'patience',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Marcus goes very quiet.*",
            "*Then his hand goes to his own wrist.*",
            "\"...Ninety-two. Higher than it should be.\"",
            "\"My blood pressure's been elevated for months.\"",
            "*A hollow laugh.*",
            "\"I monitor everyone else. I stopped monitoring myself.\"",
            "\"Maybe the answer isn't more. Maybe it's... sustainable.\""
          ],
          emotionArc: ['still', 'checking', 'surprised', 'realizing'],
          trustChange: 3,
          globalFlagsSet: ['marcus_patience_support', 'marcus_self_care_realization'],
          unlockedContent: "Marcus realizes he's been neglecting his own vital signs"
        }
      }
    ],

    defaultApproach: {
      id: 'default_approach',
      label: "Tell him there's no wrong answer",
      description: "Both paths save lives. Just in different ways.",

      outcome: {
        characterResponse: [
          "*Marcus sighs.*",
          "\"That's the problem. Both are right. Both cost something.\"",
          "*He looks at the schedule again.*",
          "\"Maybe I just need more time to figure it out.\"",
          "\"Time's the one thing we never have enough of.\""
        ],
        emotionArc: ['heavy', 'resigned', 'uncertain'],
        trustChange: 1,
        globalFlagsSet: ['marcus_default_support'],
        unlockedContent: "Standard progression through Marcus's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*Marcus puts the schedule away.*",
        "\"Whatever I decide... I won't decide scared.\"",
        "*He almost smiles.*",
        "\"That's something, right?\""
      ],
      nextNodeId: 'marcus_post_crossroads'
    }
  },

  // ============================================
  // ROHAN'S CROSSROADS: The Algorithm Debate
  // ============================================
  {
    id: 'rohan_public_debate',
    characterId: 'rohan',
    name: "Rohan's Stand",

    stakes: "Rohan's been invited to a public debate: 'Should AI replace human educators?' He's terrified.",

    setup: [
      "*Rohan is holding an invitation, his hands trembling.*",
      "\"They want me to defend human education. Against an AI optimist.\"",
      "\"Thousands of people watching.\"",
      "*He sets it down.*",
      "\"What if I'm wrong? What if I've been wrong all along?\"",
      "\"What if I'm just... obsolete, fighting to stay relevant?\""
    ],

    triggerConditions: {
      trustMin: 7,
      requiredFlags: ['rohan_transformation_complete', 'knows_rohan_algorithm_fear']
    },

    approaches: [
      {
        id: 'exploring_approach',
        label: "Ask him what he's actually afraid of",
        description: "Is it being wrong? Or being right and it not mattering?",

        requirements: {
          pattern: 'exploring',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Rohan's face shifts.*",
            "\"Being right and it not mattering.\"",
            "*He says it immediately, like he's been waiting to admit it.*",
            "\"I could prove every point. Win every argument.\"",
            "\"And still watch as humanity chooses convenience over wisdom.\"",
            "*A bitter smile.*",
            "\"That's the real fear. Not being obsolete. Being irrelevant.\""
          ],
          emotionArc: ['defensive', 'realizing', 'raw', 'despairing'],
          trustChange: 3,
          globalFlagsSet: ['rohan_exploring_support', 'rohan_core_fear_named'],
          unlockedContent: "Rohan names his deepest fear—irrelevance despite being right"
        }
      },

      {
        id: 'patience_approach',
        label: "Remind him that some truths take generations",
        description: "Philosophers aren't judged by immediate impact. They plant seeds.",

        requirements: {
          pattern: 'patience',
          patternMin: 35
        },

        outcome: {
          characterResponse: [
            "*Rohan's breathing slows.*",
            "\"Plato didn't see democracy flourish. Kant didn't see human rights enshrined.\"",
            "*He's almost talking to himself now.*",
            "\"They planted. Others harvested.\"",
            "*A long silence.*",
            "\"Maybe my job isn't to win debates.\"",
            "\"Maybe it's to ask the questions that won't be answered for decades.\""
          ],
          emotionArc: ['anxious', 'thinking', 'calming', 'accepting'],
          trustChange: 2,
          globalFlagsSet: ['rohan_patience_support', 'rohan_long_view'],
          unlockedContent: "Rohan finds peace in the generational view of wisdom"
        }
      },

      {
        id: 'analytical_approach',
        label: "Help him prepare his strongest arguments",
        description: "What are the weaknesses in the AI position? What can't algorithms replicate?",

        requirements: {
          pattern: 'analytical',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Rohan straightens.*",
            "\"Right. Arguments. Let's think.\"",
            "\"AI can't model doubt. Can't demonstrate intellectual humility.\"",
            "\"Can't say 'I don't know' and mean it.\"",
            "*He's pacing now, energized.*",
            "\"The Socratic method isn't about answers. It's about teaching people to sit with uncertainty.\"",
            "\"That's not optimizable. That's human.\""
          ],
          emotionArc: ['anxious', 'focusing', 'sharpening', 'confident'],
          trustChange: 2,
          globalFlagsSet: ['rohan_analytical_support', 'rohan_arguments_prepared'],
          unlockedContent: "Rohan crystallizes his strongest defense of human education"
        }
      }
    ],

    defaultApproach: {
      id: 'default_approach',
      label: "Tell him his fear proves his point",
      description: "An algorithm wouldn't be afraid. That fear is human wisdom.",

      outcome: {
        characterResponse: [
          "*Rohan blinks.*",
          "\"The fear... proves the point.\"",
          "\"An optimizer would just calculate odds. Win or lose.\"",
          "*A strange laugh.*",
          "\"But I'm afraid because I care. About truth. About consequences.\"",
          "\"That's exactly what I'm trying to defend.\""
        ],
        emotionArc: ['confused', 'realizing', 'surprised', 'steadier'],
        trustChange: 1,
        globalFlagsSet: ['rohan_default_support'],
        unlockedContent: "Standard progression through Rohan's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*Rohan picks up the invitation again.*",
        "\"I'll do it.\"",
        "*His hands are steadier now.*",
        "\"Win or lose... at least I'll have asked the questions.\""
      ],
      nextNodeId: 'rohan_post_crossroads'
    }
  },

  // ============================================
  // YAQUIN'S CROSSROADS: The Job Offer
  // ============================================
  {
    id: 'yaquin_promotion_offer',
    characterId: 'yaquin',
    name: "Yaquin's Opportunity",

    stakes: "Yaquin's been offered a lead teaching position—but it means stepping into the spotlight she's avoided.",

    setup: [
      "*Yaquin is sitting very still, a letter in her hands.*",
      "\"They want me to lead the new curriculum program.\"",
      "\"My name on the materials. My face in the meetings.\"",
      "*She looks up, eyes wide.*",
      "\"I'm 'just an assistant.' That's what I keep telling myself.\"",
      "\"But they don't see 'just.' They see... me.\""
    ],

    triggerConditions: {
      trustMin: 5,
      requiredFlags: ['yaquin_transformation_complete', 'knows_yaquin_doubt']
    },

    approaches: [
      {
        id: 'exploring_approach',
        label: "Ask who told her she was 'just' anything",
        description: "That word didn't come from nowhere. Where did it start?",

        requirements: {
          pattern: 'exploring',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Yaquin's breath catches.*",
            "\"My... my mother. She meant well.\"",
            "\"'Don't aim too high, m'ija. You'll only fall harder.'\"",
            "*She looks at the letter.*",
            "\"I thought she was protecting me.\"",
            "\"Maybe she was just... scared. For herself. Not for me.\"",
            "*Quieter now.*",
            "\"I don't have to carry her fear.\""
          ],
          emotionArc: ['startled', 'remembering', 'understanding', 'releasing'],
          trustChange: 3,
          globalFlagsSet: ['yaquin_exploring_support', 'yaquin_mother_fear_understood'],
          unlockedContent: "Yaquin traces her self-doubt to its source"
        }
      },

      {
        id: 'helping_approach',
        label: "Offer to help her practice saying yes",
        description: "Sometimes you have to hear yourself say the words out loud.",

        requirements: {
          pattern: 'helping',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Yaquin laughs nervously.*",
            "\"Practice saying yes?\"",
            "*She takes a breath.*",
            "\"I... I accept the position.\"",
            "*Another breath, stronger.*",
            "\"I accept the position.\"",
            "*Her eyes are bright now.*",
            "\"It sounds real when I say it. It sounds... mine.\""
          ],
          emotionArc: ['nervous', 'trying', 'surprised', 'growing'],
          trustChange: 2,
          globalFlagsSet: ['yaquin_helping_support', 'yaquin_practiced_yes'],
          unlockedContent: "Yaquin practices owning her success"
        }
      },

      {
        id: 'patience_approach',
        label: "Remind her she doesn't have to decide now",
        description: "Growth can be gradual. She can step forward without leaping.",

        requirements: {
          pattern: 'patience',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Yaquin's shoulders drop—releasing tension.*",
            "\"I keep thinking it's all or nothing.\"",
            "\"But I could... start small. See how it feels.\"",
            "*She folds the letter carefully.*",
            "\"Ask to shadow the current lead first. Learn before I leap.\"",
            "*A small smile.*",
            "\"That's not saying no. It's saying... not yet. And that's okay.\""
          ],
          emotionArc: ['tense', 'softening', 'thinking', 'peaceful'],
          trustChange: 2,
          globalFlagsSet: ['yaquin_patience_support', 'yaquin_gradual_growth'],
          unlockedContent: "Yaquin chooses measured growth over dramatic leap"
        }
      }
    ],

    defaultApproach: {
      id: 'default_approach',
      label: "Tell her you believe in her",
      description: "Sometimes that's what someone needs to hear.",

      outcome: {
        characterResponse: [
          "*Yaquin looks at you, searching for something.*",
          "\"You mean that.\"",
          "*It's not a question.*",
          "\"I can see you mean that.\"",
          "*She looks at the letter again.*",
          "\"Maybe if someone else believes it... I can learn to.\""
        ],
        emotionArc: ['doubtful', 'searching', 'touched', 'hopeful'],
        trustChange: 1,
        globalFlagsSet: ['yaquin_default_support'],
        unlockedContent: "Standard progression through Yaquin's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*Yaquin stands a little taller.*",
        "\"Whatever I decide... I'm going to stop apologizing for it.\"",
        "*She smiles—small, but real.*",
        "\"That's the hardest part, isn't it? Believing you deserve the space you take up.\""
      ],
      nextNodeId: 'yaquin_post_crossroads'
    }
  }
]

/**
 * Check if a crossroads is ready to trigger
 */
export function checkCrossroadsEligible(
  characterId: string,
  context: {
    trust: number
    globalFlags: Set<string>
    witnessedTransformations: string[]
  }
): CrossroadsMoment | null {
  const eligibleCrossroads = CROSSROADS_MOMENTS.filter(c => {
    // Must be for the right character
    if (c.characterId !== characterId) return false

    // Check if already completed (use a flag pattern)
    if (context.globalFlags.has(`${c.id}_completed`)) return false

    // Check trust gate
    if (context.trust < c.triggerConditions.trustMin) return false

    // Check required flags
    for (const flag of c.triggerConditions.requiredFlags) {
      if (!context.globalFlags.has(flag)) return false
    }

    // Check required transformations
    if (c.triggerConditions.requiredTransformations) {
      for (const transformation of c.triggerConditions.requiredTransformations) {
        if (!context.witnessedTransformations.includes(transformation)) return false
      }
    }

    return true
  })

  return eligibleCrossroads[0] || null
}

/**
 * Get available approaches for a crossroads based on player state
 */
export function getAvailableApproaches(
  crossroads: CrossroadsMoment,
  context: {
    trust: number
    patterns: Record<PatternType, number>
    globalFlags: Set<string>
  }
): {
  available: CrossroadsApproach[]
  locked: { approach: CrossroadsApproach; reason: string }[]
} {
  const totalPatternPoints = Object.values(context.patterns).reduce((a, b) => a + b, 0)

  const available: CrossroadsApproach[] = [crossroads.defaultApproach]
  const locked: { approach: CrossroadsApproach; reason: string }[] = []

  for (const approach of crossroads.approaches) {
    const req = approach.requirements

    if (!req) {
      available.push(approach)
      continue
    }

    let meetsRequirements = true
    let lockReason = ''

    // Check pattern requirement
    if (req.pattern && req.patternMin !== undefined) {
      const patternValue = context.patterns[req.pattern] || 0
      const patternPercentage = totalPatternPoints > 0
        ? (patternValue / totalPatternPoints) * 100
        : 0

      if (patternPercentage < req.patternMin) {
        meetsRequirements = false
        lockReason = `Requires stronger ${req.pattern} pattern`
      }
    }

    // Check trust requirement
    if (req.trustMin !== undefined && context.trust < req.trustMin) {
      meetsRequirements = false
      lockReason = `Requires higher trust`
    }

    // Check flag requirements
    if (req.requiredFlags) {
      for (const flag of req.requiredFlags) {
        if (!context.globalFlags.has(flag)) {
          meetsRequirements = false
          lockReason = `Requires discovering more about this character`
          break
        }
      }
    }

    if (meetsRequirements) {
      available.push(approach)
    } else {
      locked.push({ approach, reason: lockReason })
    }
  }

  return { available, locked }
}

/**
 * Get crossroads by ID
 */
export function getCrossroadsById(id: string): CrossroadsMoment | null {
  return CROSSROADS_MOMENTS.find(c => c.id === id) || null
}

/**
 * Get all crossroads for a character
 */
export function getCharacterCrossroads(characterId: string): CrossroadsMoment[] {
  return CROSSROADS_MOMENTS.filter(c => c.characterId === characterId)
}
