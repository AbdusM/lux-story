/**
 * Consequence Echoes System
 *
 * Provides dialogue-based feedback for state changes (trust, patterns).
 * Instead of silent stat changes, NPCs respond through dialogue.
 *
 * Based on BG3 insight: "Choices have palpable emotional consequences
 * that the player must face - not toast notifications."
 */

import type { PlayerPatterns } from './character-state'
import type { SoundType } from './audio-feedback'

// Note: Using string for emotion to support compound emotions in dialogue content

export type EchoIntensity = 'subtle' | 'noticeable' | 'significant'
export type EchoDirection = 'up' | 'down'

export interface ConsequenceEcho {
  text: string
  emotion?: string
  /** Timing: immediate = same turn, delayed = next node */
  timing: 'immediate' | 'delayed'
  /** ISP Upgrade: Associated sound for multi-sensory feedback */
  soundCue?: SoundType
}

/**
 * Character-specific echo templates
 * Each character has distinct ways of showing trust changes through dialogue
 */
export const CHARACTER_ECHOES: Record<string, {
  trustUp: Record<EchoIntensity, ConsequenceEcho[]>
  trustDown: Record<EchoIntensity, ConsequenceEcho[]>
  patternRecognition: Record<string, ConsequenceEcho[]>
}> = {
  samuel: {
    trustUp: {
      subtle: [
        { text: "Samuel nods slowly.", emotion: 'warm', timing: 'immediate' },
        { text: "\"Mm.\" Something in his expression softens.", emotion: 'warm', timing: 'immediate' },
        { text: "Samuel's eyes crinkle at the corners.", emotion: 'warm', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"You see things clearly.\" Samuel sounds almost surprised.", emotion: 'warm', timing: 'immediate' },
        { text: "Samuel leans back, studying you differently now.", emotion: 'knowing', timing: 'immediate' },
        { text: "\"That's... that's the right question.\"", emotion: 'warm', timing: 'immediate' }
      ],
      significant: [
        { text: "Samuel goes quiet for a moment. \"You remind me of myself. Before I found this place.\"", emotion: 'vulnerable', timing: 'immediate' },
        { text: "\"Not many people get that.\" His voice is softer now.", emotion: 'warm', timing: 'immediate' },
        { text: "Something shifts in how Samuel looks at you. Like you've passed a test he didn't tell you about.", emotion: 'knowing', timing: 'immediate' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Samuel's gaze drifts to the departures board.", emotion: 'neutral', timing: 'immediate' },
        { text: "A pause. Just slightly too long.", emotion: 'neutral', timing: 'immediate' },
        { text: "Samuel nods, but the warmth dims slightly.", emotion: 'neutral', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Mm.\" Samuel's jaw tightens almost imperceptibly.", emotion: 'guarded', timing: 'immediate' },
        { text: "Something closes behind Samuel's eyes.", emotion: 'guarded', timing: 'immediate' },
        { text: "Samuel glances at the clock. \"Time moves differently for everyone.\"", emotion: 'neutral', timing: 'immediate' }
      ],
      significant: [
        { text: "Samuel exhales slowly. \"I've seen that path before. It's harder than it looks.\"", emotion: 'concerned', timing: 'immediate' },
        { text: "\"You can always come back when you're ready.\" His voice is kind, but distant.", emotion: 'guarded', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You think through things. I can see it in how you ask questions.\"", emotion: 'knowing', timing: 'delayed' }
      ],
      helping: [
        { text: "\"You lead with care. That's not something you can fake.\"", emotion: 'warm', timing: 'delayed' }
      ],
      building: [
        { text: "\"You're a maker. I can tell. You see possibility where others see problems.\"", emotion: 'warm', timing: 'delayed' }
      ],
      patience: [
        { text: "\"You don't rush to fill silences. That's rare these days.\"", emotion: 'knowing', timing: 'delayed' }
      ],
      exploring: [
        { text: "\"Curious, aren't you? Good. Curiosity is how people find their path.\"", emotion: 'warm', timing: 'delayed' }
      ]
    }
  },

  maya: {
    trustUp: {
      subtle: [
        { text: "Maya's pen stops moving for just a second.", emotion: 'thoughtful', timing: 'immediate' },
        { text: "Something flickers across Maya's face. surprise, maybe.", emotion: 'curious', timing: 'immediate' },
        { text: "Maya looks up from her notebook.", emotion: 'open', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Huh.\" Maya sets down her pen. \"I wasn't expecting you to say that.\"", emotion: 'surprised', timing: 'immediate' },
        { text: "Maya tilts her head, really looking at you now.", emotion: 'curious', timing: 'immediate' },
        { text: "\"That's... yeah. That's exactly it.\" Her voice catches slightly.", emotion: 'vulnerable', timing: 'immediate' }
      ],
      significant: [
        { text: "Maya closes her notebook. \"I don't usually tell people this stuff.\" She doesn't look away.", emotion: 'vulnerable', timing: 'immediate' },
        { text: "\"You get it.\" Maya sounds almost relieved. \"Most people don't get it.\"", emotion: 'grateful', timing: 'immediate' },
        { text: "For a moment, Maya looks like she might cry. Then she laughs instead. \"Sorry. It's just. nobody asks the right questions.\"", emotion: 'vulnerable', timing: 'immediate' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Maya's hand moves to cover her notebook.", emotion: 'guarded', timing: 'immediate' },
        { text: "She looks back at her sketch.", emotion: 'neutral', timing: 'immediate' },
        { text: "\"Yeah.\" Maya's voice goes flat.", emotion: 'guarded', timing: 'immediate' }
      ],
      noticeable: [
        { text: "Maya's jaw tightens. \"Right. Sure.\"", emotion: 'defensive', timing: 'immediate' },
        { text: "Something shutters behind Maya's eyes.", emotion: 'guarded', timing: 'immediate' },
        { text: "\"Anyway.\" Maya flips to a new page. Conversation over.", emotion: 'dismissive', timing: 'immediate' }
      ],
      significant: [
        { text: "Maya stands up. \"I should probably. \" She doesn't finish the sentence.", emotion: 'hurt', timing: 'immediate' },
        { text: "\"You sound like my parents.\" Maya's voice is cold now.", emotion: 'angry', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You're like a detective.\" Maya sounds more curious than critical.", emotion: 'curious', timing: 'delayed' }
      ],
      helping: [
        { text: "\"You actually care what people say. That's... rare.\"", emotion: 'surprised', timing: 'delayed' }
      ],
      exploring: [
        { text: "\"You're curious about everything, aren't you? I like that.\"", emotion: 'warm', timing: 'delayed' }
      ]
    }
  },

  devon: {
    trustUp: {
      subtle: [
        { text: "Devon's typing slows.", emotion: 'thoughtful', timing: 'immediate' },
        { text: "A micro-pause. Devon processes something.", emotion: 'neutral', timing: 'immediate' },
        { text: "Devon's posture shifts. slightly more open.", emotion: 'open', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"That's... a valid point.\" Devon sounds almost surprised at their own admission.", emotion: 'surprised', timing: 'immediate' },
        { text: "Devon stops typing entirely. \"Go on.\"", emotion: 'curious', timing: 'immediate' },
        { text: "\"Huh.\" Devon removes their headphones. Full attention.", emotion: 'engaged', timing: 'immediate' }
      ],
      significant: [
        { text: "\"Nobody's ever framed it that way before.\" Devon looks at you differently now.", emotion: 'vulnerable', timing: 'immediate' },
        { text: "Devon closes their laptop. \"Okay. I'm listening. Really listening.\"", emotion: 'open', timing: 'immediate' },
        { text: "\"I... appreciate that.\" Devon's voice cracks slightly on 'appreciate.'", emotion: 'vulnerable', timing: 'immediate' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Devon's typing resumes at double speed.", emotion: 'dismissive', timing: 'immediate' },
        { text: "\"Noted.\" Devon doesn't look up.", emotion: 'neutral', timing: 'immediate' },
        { text: "Devon reaches for their headphones.", emotion: 'guarded', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"That's statistically unlikely to help.\" Devon's voice is flat.", emotion: 'dismissive', timing: 'immediate' },
        { text: "Devon's screen reflects in their glasses. They're already somewhere else.", emotion: 'distant', timing: 'immediate' }
      ],
      significant: [
        { text: "\"I have to. \" Devon grabs their laptop. \"I should go.\"", emotion: 'upset', timing: 'immediate' },
        { text: "\"I thought you were different.\" Devon won't meet your eyes.", emotion: 'hurt', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You think in systems. I respect that.\"", emotion: 'approving', timing: 'delayed' }
      ],
      patience: [
        { text: "\"You don't rush to conclusions. That's... unusual. In a good way.\"", emotion: 'surprised', timing: 'delayed' }
      ],
      building: [
        { text: "\"You want to fix things. Actually fix them. Not just talk about it.\"", emotion: 'approving', timing: 'delayed' }
      ]
    }
  },

  jordan: {
    trustUp: {
      subtle: [
        { text: "Jordan's smile reaches their eyes.", emotion: 'warm', timing: 'immediate' },
        { text: "Something relaxes in Jordan's shoulders.", emotion: 'open', timing: 'immediate' },
        { text: "Jordan nods slowly, thoughtfully.", emotion: 'reflective', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Now that's the real question.\" Jordan looks impressed.", emotion: 'warm', timing: 'immediate' },
        { text: "Jordan stops walking. \"Say more about that.\"", emotion: 'curious', timing: 'immediate' },
        { text: "\"You're finding your way. I can see it.\"", emotion: 'knowing', timing: 'immediate' }
      ],
      significant: [
        { text: "Jordan sits down on a nearby bench. \"I don't tell everyone this story.\"", emotion: 'vulnerable', timing: 'immediate' },
        { text: "\"You remind me why I started doing this.\" Jordan's voice is quiet.", emotion: 'moved', timing: 'immediate' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Jordan's pace quickens slightly.", emotion: 'neutral', timing: 'immediate' },
        { text: "\"Mm.\" Jordan's attention drifts to the arrivals board.", emotion: 'distant', timing: 'immediate' }
      ],
      noticeable: [
        { text: "Jordan's smile becomes professional. Polite.", emotion: 'guarded', timing: 'immediate' },
        { text: "\"That's one way to look at it.\" Jordan doesn't offer another.", emotion: 'distant', timing: 'immediate' }
      ],
      significant: [
        { text: "Jordan stops. \"Everyone has to find their own path.\" It sounds like goodbye.", emotion: 'sad', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      exploring: [
        { text: "\"You're a seeker. I knew it the moment you asked that first question.\"", emotion: 'knowing', timing: 'delayed' }
      ],
      patience: [
        { text: "\"You understand that some journeys take time. Not everyone does.\"", emotion: 'warm', timing: 'delayed' }
      ]
    }
  },

  marcus: {
    trustUp: {
      subtle: [
        { text: "Marcus sets down his tool. Full attention.", emotion: 'open', timing: 'immediate' },
        { text: "A genuine nod. \"Alright then.\"", emotion: 'approving', timing: 'immediate' },
        { text: "Marcus's hands stop moving. He's listening.", emotion: 'engaged', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Now you're talking.\" Marcus grins.", emotion: 'warm', timing: 'immediate' },
        { text: "\"That's the real work right there.\" He sounds impressed.", emotion: 'approving', timing: 'immediate' },
        { text: "Marcus pulls up a second stool. \"Sit. Tell me more.\"", emotion: 'warm', timing: 'immediate' }
      ],
      significant: [
        { text: "Marcus stops working entirely. \"My daughter asked me the same thing once.\" His voice is rough.", emotion: 'vulnerable', timing: 'immediate' },
        { text: "\"You get it. The thing about building. it's never just about the thing you're building.\"", emotion: 'moved', timing: 'immediate' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Marcus turns back to his work.", emotion: 'neutral', timing: 'immediate' },
        { text: "\"Mm-hm.\" He doesn't look up.", emotion: 'dismissive', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Lot of people say that.\" Marcus sounds tired.", emotion: 'disappointed', timing: 'immediate' },
        { text: "Marcus picks up a different tool. The conversation has moved on.", emotion: 'distant', timing: 'immediate' }
      ],
      significant: [
        { text: "\"I got work to do.\" Marcus's back is already turned.", emotion: 'dismissive', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      building: [
        { text: "\"You're a builder. I can always tell. It's in how you look at problems.\"", emotion: 'warm', timing: 'delayed' }
      ],
      helping: [
        { text: "\"You build things for people. Not just things for things' sake.\"", emotion: 'approving', timing: 'delayed' }
      ]
    }
  },

  kai: {
    trustUp: {
      subtle: [
        { text: "Kai's posture relaxes—just slightly.", emotion: 'open', timing: 'immediate' },
        { text: "He uncrosses his arms.", emotion: 'neutral', timing: 'immediate' },
        { text: "A brief nod. Acknowledgment.", emotion: 'approving', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Solid,\" Kai says. High praise from him.", emotion: 'approving', timing: 'immediate', soundCue: 'echo-kai' },
        { text: "He actually makes eye contact. Holds it.", emotion: 'engaged', timing: 'immediate' },
        { text: "\"You've thought this through. I respect that.\"", emotion: 'warm', timing: 'immediate', soundCue: 'trust' }
      ],
      significant: [
        { text: "Kai grins—full and genuine. \"Now we're talking.\"", emotion: 'warm', timing: 'immediate', soundCue: 'trust' },
        { text: "\"You'd make a good safety officer,\" he says. \"That's not nothing.\"", emotion: 'approving', timing: 'immediate', soundCue: 'echo-kai' },
        { text: "He extends his hand. \"Partners on this one?\"", emotion: 'trusting', timing: 'immediate', soundCue: 'trust' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Kai's jaw tightens almost imperceptibly.", emotion: 'guarded', timing: 'immediate' },
        { text: "His stance shifts. Defensive.", emotion: 'neutral', timing: 'immediate' }
      ],
      noticeable: [
        { text: "He steps back. Creates distance.", emotion: 'distant', timing: 'immediate' },
        { text: "\"That's one way to look at it.\" His voice is flat.", emotion: 'disappointed', timing: 'immediate' }
      ],
      significant: [
        { text: "\"That's exactly the kind of thinking that gets people hurt.\"", emotion: 'angry', timing: 'immediate' },
        { text: "Kai shakes his head slowly. \"I thought you understood.\"", emotion: 'hurt', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You assess risk properly. That's rare.\"", emotion: 'approving', timing: 'delayed', soundCue: 'pattern-analytical' }
      ],
      patience: [
        { text: "\"Good. Don't rush into danger,\" he approves.", emotion: 'warm', timing: 'delayed', soundCue: 'pattern-patience' }
      ],
      exploring: [
        { text: "He's wary of your curiosity. But intrigued too.", emotion: 'curious', timing: 'delayed', soundCue: 'pattern-exploring' }
      ],
      helping: [
        { text: "\"Wanting to help is step one. Step two is not making it worse.\"", emotion: 'knowing', timing: 'delayed', soundCue: 'pattern-helping' }
      ],
      building: [
        { text: "\"Build it safe or don't build it. Simple.\"", emotion: 'approving', timing: 'delayed', soundCue: 'pattern-building' }
      ]
    }
  },

  rohan: {
    trustUp: {
      subtle: [
        { text: "Rohan's gaze lingers a moment longer.", emotion: 'curious', timing: 'immediate', soundCue: 'echo-rohan' },
        { text: "Something shifts behind those dark eyes.", emotion: 'thoughtful', timing: 'immediate' },
        { text: "He nods—barely, but you catch it.", emotion: 'approving', timing: 'immediate' }
      ],
      noticeable: [
        { text: "Rohan sets down his coffee. Gives you his full attention.", emotion: 'engaged', timing: 'immediate', soundCue: 'trust' },
        { text: "\"Interesting,\" he says. From him, that's a standing ovation.", emotion: 'warm', timing: 'immediate', soundCue: 'echo-rohan' },
        { text: "The corner of his mouth twitches. Almost a smile.", emotion: 'amused', timing: 'immediate' }
      ],
      significant: [
        { text: "Rohan actually laughs. The sound surprises both of you.", emotion: 'warm', timing: 'immediate', soundCue: 'trust' },
        { text: "\"You see things clearly,\" he says. \"That's rare.\"", emotion: 'approving', timing: 'immediate', soundCue: 'echo-rohan' },
        { text: "He leans back, genuinely impressed. \"Keep going.\"", emotion: 'open', timing: 'immediate' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Rohan's expression doesn't change. But something closes off.", emotion: 'guarded', timing: 'immediate' },
        { text: "His attention drifts back to his coffee.", emotion: 'distant', timing: 'immediate' }
      ],
      noticeable: [
        { text: "He looks away. The conversation feels thinner now.", emotion: 'disappointed', timing: 'immediate' },
        { text: "\"Mm.\" Rohan's monosyllables carry weight.", emotion: 'guarded', timing: 'immediate' }
      ],
      significant: [
        { text: "\"I thought you understood,\" he says quietly.", emotion: 'hurt', timing: 'immediate' },
        { text: "Rohan stands. \"I should get back to work.\" It sounds final.", emotion: 'cold', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "Rohan notices your precision. It mirrors his own.", emotion: 'approving', timing: 'delayed', soundCue: 'pattern-analytical' }
      ],
      patience: [
        { text: "He appreciates that you didn't rush to fill the silence.", emotion: 'warm', timing: 'delayed', soundCue: 'pattern-patience' }
      ],
      exploring: [
        { text: "\"Curious mind,\" he observes. Not quite approval. But close.", emotion: 'curious', timing: 'delayed', soundCue: 'pattern-exploring' }
      ],
      helping: [
        { text: "Your concern seems to unsettle him. He's not used to it.", emotion: 'guarded', timing: 'delayed', soundCue: 'pattern-helping' }
      ],
      building: [
        { text: "He watches you construct the idea. Nods slowly.", emotion: 'approving', timing: 'delayed', soundCue: 'pattern-building' }
      ]
    }
  },

  tess: {
    trustUp: {
      subtle: [
        { text: "Tess's eyes narrow approvingly.", emotion: 'interested', timing: 'immediate' },
        { text: "A flicker of respect crosses Tess's face.", emotion: 'approving', timing: 'immediate' },
        { text: "Tess shifts her stance. Reassessing.", emotion: 'curious', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Okay. That's a move.\" Tess sounds almost impressed.", emotion: 'approving', timing: 'immediate', soundCue: 'trust' },
        { text: "\"Here's the play. \" Tess stops. \"Actually, what's your play?\"", emotion: 'curious', timing: 'immediate' },
        { text: "Tess laughs. a real one, not her usual sharp smile. \"Didn't see that coming.\"", emotion: 'surprised', timing: 'immediate' }
      ],
      significant: [
        { text: "\"You're smarter than you let on.\" Tess's guard drops completely. \"So am I. Let me tell you something real.\"", emotion: 'vulnerable', timing: 'immediate', soundCue: 'trust' },
        { text: "\"Most people play defense. You play offense. I respect that.\"", emotion: 'warm', timing: 'immediate' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Tess's smile sharpens.", emotion: 'guarded', timing: 'immediate' },
        { text: "\"Mm.\" Tess checks her phone.", emotion: 'dismissive', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"That's a defensive play.\" Tess sounds bored.", emotion: 'disappointed', timing: 'immediate' },
        { text: "Tess's walls go back up. Click.", emotion: 'guarded', timing: 'immediate' }
      ],
      significant: [
        { text: "\"I had you wrong.\" Tess's voice is ice. \"My mistake.\"", emotion: 'cold', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You see the board. Most people only see the pieces in front of them.\"", emotion: 'approving', timing: 'delayed', soundCue: 'pattern-analytical' }
      ],
      building: [
        { text: "\"You're building something. I can tell. What's the endgame?\"", emotion: 'curious', timing: 'delayed', soundCue: 'pattern-building' }
      ]
    }
  },

  yaquin: {
    trustUp: {
      subtle: [
        { text: "Yaquin's gaze sharpens with interest.", emotion: 'curious', timing: 'immediate', soundCue: 'echo-yaquin' },
        { text: "A small smile plays at Yaquin's lips.", emotion: 'amused', timing: 'immediate' },
        { text: "Yaquin tilts their head, considering.", emotion: 'thoughtful', timing: 'immediate' }
      ],
      noticeable: [
        { text: "\"Imagine...\" Yaquin pauses, delighted. \"You already see it, don't you?\"", emotion: 'excited', timing: 'immediate', soundCue: 'echo-yaquin' },
        { text: "\"Most people don't ask that.\" Yaquin sounds genuinely surprised.", emotion: 'surprised', timing: 'immediate', soundCue: 'trust' },
        { text: "Yaquin puts away their phone. Full presence.", emotion: 'engaged', timing: 'immediate' }
      ],
      significant: [
        { text: "\"You see the poetry in it.\" Yaquin's voice goes soft. \"I thought I was the only one.\"", emotion: 'moved', timing: 'immediate', soundCue: 'trust' },
        { text: "\"Let me show you something. Something I don't show everyone.\"", emotion: 'trusting', timing: 'immediate', soundCue: 'identity' }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Yaquin's eyes drift to the window.", emotion: 'distant', timing: 'immediate' },
        { text: "\"Ah.\" Yaquin's energy recedes.", emotion: 'neutral', timing: 'immediate' }
      ],
      noticeable: [
        { text: "Yaquin's smile becomes wistful. \"Not everyone can see it.\"", emotion: 'sad', timing: 'immediate' },
        { text: "\"Perhaps the trains speak differently to you.\" It sounds like goodbye.", emotion: 'resigned', timing: 'immediate' }
      ],
      significant: [
        { text: "\"I imagined you might...\" Yaquin trails off. \"No matter. Safe travels.\"", emotion: 'disappointed', timing: 'immediate' }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You decode the rhythms. See the patterns others miss.\"", emotion: 'curious', timing: 'delayed', soundCue: 'pattern-analytical' }
      ],
      patience: [
        { text: "\"You understand that some things can't be rushed. That's wisdom.\"", emotion: 'approving', timing: 'delayed', soundCue: 'pattern-patience' }
      ],
      exploring: [
        { text: "\"You're a traveler in the truest sense. Not just of places. of ideas.\"", emotion: 'warm', timing: 'delayed', soundCue: 'pattern-exploring' }
      ],
      helping: [
        { text: "\"Your kindness makes her eyes shine.\"", emotion: 'warm', timing: 'delayed', soundCue: 'pattern-helping' }
      ],
      building: [
        { text: "\"She loves watching you create. It inspires her.\"", emotion: 'moved', timing: 'delayed', soundCue: 'pattern-building' }
      ]
    }
  },

  elena: {
    trustUp: {
      subtle: [
        { text: "Elena notes the detail you mentioned.", emotion: "thoughtful", timing: "immediate" },
        { text: "A glimmer of recognition in Elena's eyes.", emotion: "open", timing: "immediate" },
        { text: "She pauses her work for a beat.", emotion: "curious", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"You see the structure underneath, don't you?\"", emotion: "approving", timing: "immediate" },
        { text: "Elena actually stops sketching. \"Go on.\"", emotion: "engaged", timing: "immediate" },
        { text: "\"That's a rare perspective.\"", emotion: "warm", timing: "immediate" }
      ],
      significant: [
        { text: "\"I usually don't share these drafts.\" Elena opens a new file.", emotion: "guarded", timing: "immediate" },
        { text: "\"You remind me of how I used to think. Before the accident.\"", emotion: "vulnerable", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Elena turns back to her screen.", emotion: "neutral", timing: "immediate" },
        { text: "\"Mm.\" She doesn't look up.", emotion: "distant", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That's not how the system works.\"", emotion: "dismissive", timing: "immediate" },
        { text: "Elena closes the projection. \"Let's move on.\"", emotion: "guarded", timing: "immediate" }
      ],
      significant: [
        { text: "\"I don't have time for theories.\"", emotion: "cold", timing: "immediate" }
      ]
    },
    patternRecognition: {
      building: [
        { text: "\"You understand that things must be made, not just dreamt.\"", emotion: "approving", timing: "delayed" }
      ],
      exploring: [
        { text: "\"You look for the source code of the world. I respect that.\"", emotion: "curious", timing: "delayed" }
      ]
    }
  },

  grace: {
    trustUp: {
      subtle: [
        { text: "Grace's smile reaches her eyes.", emotion: "warm", timing: "immediate" },
        { text: "She nods, a slow, gentle movement.", emotion: "open", timing: "immediate" },
        { text: "Grace leans in slightly.", emotion: "engaged", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"You have a kind spirit.\"", emotion: "warm", timing: "immediate" },
        { text: "Grace rests her hands. \"I'm glad you're here.\"", emotion: "grateful", timing: "immediate" },
        { text: "\"That is a wise observation.\"", emotion: "approving", timing: "immediate" }
      ],
      significant: [
        { text: "\"I feel I can speak freely with you.\"", emotion: "trusting", timing: "immediate" },
        { text: "Grace's voice drops to a whisper. \"Let me tell you something.\"", emotion: "vulnerable", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Grace's smile fades slightly.", emotion: "neutral", timing: "immediate" },
        { text: "She looks past you.", emotion: "distant", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"Perhaps we should speak later.\"", emotion: "polite", timing: "immediate" },
        { text: "Grace withdraws her hand.", emotion: "guarded", timing: "immediate" }
      ],
      significant: [
        { text: "\"I fear we do not understand each other.\"", emotion: "sad", timing: "immediate" }
      ]
    },
    patternRecognition: {
      helping: [
        { text: "\"Your heart is open. It is a dangerous gift here.\"", emotion: "concerned", timing: "delayed" }
      ],
      patience: [
        { text: "\"You know the value of stillness.\"", emotion: "approving", timing: "delayed" }
      ]
    }
  },

  alex: {
    trustUp: {
      subtle: [
        { text: "Alex gives a sharp nod.", emotion: "approving", timing: "immediate" },
        { text: "He checks his watch, but stays.", emotion: "curious", timing: "immediate" },
        { text: "A flicker of interest.", emotion: "engaged", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"Smart call.\"", emotion: "approving", timing: "immediate" },
        { text: "Alex lowers his guard. \"Okay, I'm listening.\"", emotion: "open", timing: "immediate" },
        { text: "\"You handle yourself well.\"", emotion: "impressed", timing: "immediate" }
      ],
      significant: [
        { text: "\"I don't trust easy. But you're alright.\"", emotion: "trusting", timing: "immediate" },
        { text: "Alex signals the others to wait. He's talking to you.", emotion: "respectful", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Alex shifts his weight.", emotion: "impatient", timing: "immediate" },
        { text: "He scans the room.", emotion: "distracted", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"We're wasting time.\"", emotion: "annoyed", timing: "immediate" },
        { text: "Alex checks his comms.", emotion: "dismissive", timing: "immediate" }
      ],
      significant: [
        { text: "\"You're a liability.\"", emotion: "hostile", timing: "immediate" }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You see the angles. Good.\"", emotion: "approving", timing: "delayed" }
      ],
      building: [
        { text: "\"Practical. I like practical.\"", emotion: "approving", timing: "delayed" }
      ]
    }
  },

  asha: {
    trustUp: {
      subtle: [
        { text: "Asha stops pacing.", emotion: "curious", timing: "immediate" },
        { text: "Her eyes widen slightly.", emotion: "interested", timing: "immediate" },
        { text: "Asha tilts her head.", emotion: "thoughtful", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"Yes! Exactly!\"", emotion: "excited", timing: "immediate" },
        { text: "Asha grabs her notebook. \"Say that again?\"", emotion: "engaged", timing: "immediate" },
        { text: "\"Finally, someone gets the vision.\"", emotion: "relieved", timing: "immediate" }
      ],
      significant: [
        { text: "\"You see it too. The potential.\"", emotion: "connected", timing: "immediate" },
        { text: "Asha shows you the hidden page. \"Look at this.\"", emotion: "trusting", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Asha taps her pen impatiently.", emotion: "annoyed", timing: "immediate" },
        { text: "She looks at the ceiling.", emotion: "bored", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"You're thinking too small.\"", emotion: "critical", timing: "immediate" },
        { text: "Asha closes her book.", emotion: "dismissive", timing: "immediate" }
      ],
      significant: [
        { text: "\"You just don't see it.\"", emotion: "disappointed", timing: "immediate" }
      ]
    },
    patternRecognition: {
      exploring: [
        { text: "\"You're a fellow voyager. I can tell.\"", emotion: "excited", timing: "delayed" }
      ],
      building: [
        { text: "\"We are the architects of the new world.\"", emotion: "inspired", timing: "delayed" }
      ]
    }
  },

  silas: {
    trustUp: {
      subtle: [
        { text: "Silas stops cleaning.", emotion: "attentive", timing: "immediate" },
        { text: "A grunt of acknowledgement.", emotion: "neutral", timing: "immediate" },
        { text: "He looks you in the eye.", emotion: "direct", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"Not bad, kid.\"", emotion: "approving", timing: "immediate" },
        { text: "Silas leans on his broom. \"Tell me more.\"", emotion: "engaged", timing: "immediate" },
        { text: "\"You got a good head on your shoulders.\"", emotion: "warm", timing: "immediate" }
      ],
      significant: [
        { text: "\"I've seen 'em come and go. You... you might stay.\"", emotion: "reflective", timing: "immediate" },
        { text: "Silas offers you the good chair.", emotion: "welcoming", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Silas keeps sweeping.", emotion: "dismissive", timing: "immediate" },
        { text: "He spits on the tracks.", emotion: "disgusted", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"Don't waste my time.\"", emotion: "gruff", timing: "immediate" },
        { text: "Silas turns his back.", emotion: "cold", timing: "immediate" }
      ],
      significant: [
        { text: "\"Get lost.\"", emotion: "hostile", timing: "immediate" }
      ]
    },
    patternRecognition: {
      building: [
        { text: "\"You respect good work. I can see that.\"", emotion: "approving", timing: "delayed" }
      ],
      patience: [
        { text: "\"You don't rush the job.\"", emotion: "approving", timing: "delayed" }
      ]
    }
  },

  lira: {
    trustUp: {
      subtle: [
        { text: "Lira hums a soft note.", emotion: "happy", timing: "immediate" },
        { text: "She nods to the rhythm.", emotion: "open", timing: "immediate" },
        { text: "Lira pauses her song.", emotion: "attentive", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"You hear the melody.\"", emotion: "warm", timing: "immediate" },
        { text: "Lira smiles. A real one.", emotion: "connected", timing: "immediate" },
        { text: "\"We are in harmony.\"", emotion: "spiritual", timing: "immediate" }
      ],
      significant: [
        { text: "\"I wrote this for someone special. Listen.\"", emotion: "vulnerable", timing: "immediate" },
        { text: "Lira trusts you with the silence.", emotion: "peaceful", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "The humming stops.", emotion: "tense", timing: "immediate" },
        { text: "Lira looks distressed.", emotion: "anxious", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"Too loud. Too much noise.\"", emotion: "overwhelmed", timing: "immediate" },
        { text: "Lira covers her ears.", emotion: "defensive", timing: "immediate" }
      ],
      significant: [
        { text: "\"The dissonance... it hurts.\"", emotion: "pained", timing: "immediate" }
      ]
    },
    patternRecognition: {
      exploring: [
        { text: "\"You chase the new sounds.\"", emotion: "curious", timing: "delayed" }
      ],
      helping: [
        { text: "\"Your voice heals.\"", emotion: "grateful", timing: "delayed" }
      ]
    }
  },

  zara: {
    trustUp: {
      subtle: [
        { text: "Zara marks something on her clipboard.", emotion: "interested", timing: "immediate" },
        { text: "She adjusts her glasses.", emotion: "thoughtful", timing: "immediate" },
        { text: "A quick, efficient nod.", emotion: "approving", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"The data supports your conclusion.\"", emotion: "approving", timing: "immediate" },
        { text: "Zara actually smiles. \"Logical.\"", emotion: "pleased", timing: "immediate" },
        { text: "\"You might be an outlier.\"", emotion: "intrigued", timing: "immediate" }
      ],
      significant: [
        { text: "\"I'm adjusting my predictive model for you.\"", emotion: "impressed", timing: "immediate" },
        { text: "Zara shows you the raw feed. \"Don't tell management.\"", emotion: "conspiratorial", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Zara checks the time.", emotion: "impatient", timing: "immediate" },
        { text: "She frowns at the data.", emotion: "critical", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That does not compute.\"", emotion: "confused", timing: "immediate" },
        { text: "Zara writes a citation.", emotion: "stern", timing: "immediate" }
      ],
      significant: [
        { text: "\"Inefficient. And disappointing.\"", emotion: "cold", timing: "immediate" }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"Your variables are sound.\"", emotion: "approving", timing: "delayed" }
      ],
      building: [
        { text: "\"You optimize the workflow.\"", emotion: "pleased", timing: "delayed" }
      ]
    }
  }
}

/**
 * Get an appropriate echo for a trust change
 */
export function getConsequenceEcho(
  characterId: string,
  trustChange: number,
): ConsequenceEcho | null {
  const echoes = CHARACTER_ECHOES[characterId]
  if (!echoes) return null

  // Determine direction and intensity
  const direction: EchoDirection = trustChange > 0 ? 'up' : 'down'
  const absChange = Math.abs(trustChange)

  let intensity: EchoIntensity
  if (absChange >= 3) {
    intensity = 'significant'
  } else if (absChange >= 2) {
    intensity = 'noticeable'
  } else {
    intensity = 'subtle'
  }

  const pool = direction === 'up' ? echoes.trustUp[intensity] : echoes.trustDown[intensity]
  if (!pool || pool.length === 0) return null

  // Random selection from pool
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Get a pattern recognition echo when player crosses a threshold
 */
export function getPatternRecognitionEcho(
  characterId: string,
  pattern: string
): ConsequenceEcho | null {
  const echoes = CHARACTER_ECHOES[characterId]
  if (!echoes?.patternRecognition?.[pattern]) return null

  const pool = echoes.patternRecognition[pattern]
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Pattern reflection type for dialogue content
 */
export interface PatternReflection {
  pattern: keyof PlayerPatterns
  minLevel: number
  altText: string
  altEmotion?: string
}

/**
 * Apply pattern reflection to dialogue content.
 * If player has a dominant pattern that matches a reflection, returns modified content.
 * Otherwise returns the original text.
 */
export function applyPatternReflection(
  baseText: string,
  baseEmotion: string | undefined,
  reflections: PatternReflection[] | undefined,
  patterns: PlayerPatterns
): { text: string; emotion?: string } {
  if (!reflections || reflections.length === 0) {
    return { text: baseText, emotion: baseEmotion }
  }

  // Check each reflection in order
  for (const reflection of reflections) {
    const patternValue = patterns[reflection.pattern] || 0
    if (patternValue >= reflection.minLevel) {
      return {
        text: reflection.altText,
        emotion: reflection.altEmotion || baseEmotion
      }
    }
  }

  return { text: baseText, emotion: baseEmotion }
}

/**
 * Get the dominant pattern from player patterns
 * Returns the pattern with the highest value, or null if none >= threshold
 */
export function getDominantPattern(
  patterns: PlayerPatterns,
  threshold: number = 5
): keyof PlayerPatterns | null {
  const patternKeys: (keyof PlayerPatterns)[] = ['analytical', 'helping', 'building', 'patience', 'exploring']

  let dominant: keyof PlayerPatterns | null = null
  let maxValue = threshold - 1 // Must be >= threshold

  for (const pattern of patternKeys) {
    const value = patterns[pattern] || 0
    if (value >= threshold && value > maxValue) {
      maxValue = value
      dominant = pattern
    }
  }

  return dominant
}

/**
 * Get the voiced choice text based on player's dominant pattern
 * Falls back to base text if no voice variation available
 */
export function getVoicedChoiceText(
  baseText: string,
  voiceVariations: Partial<Record<keyof PlayerPatterns, string>> | undefined,
  patterns: PlayerPatterns
): string {
  if (!voiceVariations) return baseText

  const dominant = getDominantPattern(patterns)
  if (!dominant) return baseText

  return voiceVariations[dominant] || baseText
}

/**
 * Determine if a pattern threshold has been crossed
 * Returns the pattern name if threshold crossed, null otherwise
 */
export function checkPatternThreshold(
  oldPatterns: PlayerPatterns,
  newPatterns: PlayerPatterns,
  threshold: number = 5
): string | null {
  const patternKeys: (keyof PlayerPatterns)[] = ['analytical', 'helping', 'building', 'patience', 'exploring']

  for (const pattern of patternKeys) {
    const oldValue = oldPatterns[pattern] || 0
    const newValue = newPatterns[pattern] || 0
    if (oldValue < threshold && newValue >= threshold) {
      return pattern
    }
  }
  return null
}

/**
 * Orb milestone echoes - Samuel acknowledges growth through dialogue
 * These are subtle acknowledgments that don't break immersion.
 * The player discovers their orbs in the Journal; Samuel just notices.
 */
export const ORB_MILESTONE_ECHOES: Record<string, ConsequenceEcho[]> = {
  // First orb earned - Discovery moment: Samuel notices something and teaches about patterns
  // This is the ONLY pattern education - no upfront modal. Keep it natural, in Samuel's voice.
  firstOrb: [
    { text: "\"The choices you make here... they reveal something. Patterns. The station notices. Check your Journal when you get a chance—you might see what I mean.\"", emotion: 'knowing', timing: 'delayed' },
    { text: "\"Something's taking shape in you. The way you chose just now—that wasn't random. Open your Journal sometime. You'll see the patterns starting to form.\"", emotion: 'warm', timing: 'delayed' },
    { text: "\"You felt that, didn't you? Every choice here leaves a mark—shows a pattern in who you are. Your Journal's keeping track. Worth a look.\"", emotion: 'knowing', timing: 'delayed' }
  ],
  // Reaching 'emerging' tier (10+ orbs)
  tierEmerging: [
    { text: "\"You've been busy. The choices you make. they're becoming a pattern.\"", emotion: 'warm', timing: 'delayed' },
    { text: "\"I see you differently now. Something's taking shape.\"", emotion: 'knowing', timing: 'delayed' }
  ],
  // Reaching 'developing' tier (25+ orbs)
  tierDeveloping: [
    { text: "\"You know what you're doing now. Not everyone gets this far.\"", emotion: 'warm', timing: 'delayed' },
    { text: "\"The path you're walking. it's becoming yours. Uniquely yours.\"", emotion: 'knowing', timing: 'delayed' }
  ],
  // Reaching 'flourishing' tier (50+ orbs)
  tierFlourishing: [
    { text: "\"I've watched a lot of travelers. You're different. You're actually listening.\"", emotion: 'moved', timing: 'delayed' },
    { text: "\"Most people rush through. But you... you're really building something.\"", emotion: 'warm', timing: 'delayed' }
  ],
  // Reaching 'mastered' tier (100+ orbs)
  tierMastered: [
    { text: "\"You've done the work. Real work. The kind that changes you.\"", emotion: 'proud', timing: 'delayed' },
    { text: "\"When I started here, I wondered if anyone would really get it. You do.\"", emotion: 'vulnerable', timing: 'delayed' }
  ],
  // Streak achievements
  streak3: [
    { text: "\"You're finding your rhythm.\"", emotion: 'warm', timing: 'delayed' }
  ],
  streak5: [
    { text: "\"A strong streak. That kind of consistency. it means something.\"", emotion: 'knowing', timing: 'delayed' }
  ],
  streak10: [
    { text: "\"Ten in a row. That's not luck. That's who you are.\"", emotion: 'proud', timing: 'delayed' }
  ]
}

/**
 * Get an orb milestone echo for Samuel to deliver
 * Only returns if the milestone hasn't been acknowledged before
 */
export function getOrbMilestoneEcho(
  milestone: keyof typeof ORB_MILESTONE_ECHOES
): ConsequenceEcho | null {
  const pool = ORB_MILESTONE_ECHOES[milestone]
  if (!pool || pool.length === 0) return null

  return pool[Math.floor(Math.random() * pool.length)]
}

// ============================================
// PATTERN-CHARACTER RESONANCE ECHOES
// ============================================

/**
 * Echoes that show when player's dominant pattern resonates with a character
 * These appear subtly in dialogue to show the connection building
 */
export const RESONANCE_ECHOES: Record<string, {
  high: ConsequenceEcho[]      // Primary pattern resonance
  secondary: ConsequenceEcho[] // Secondary pattern resonance
  friction: ConsequenceEcho[]  // Friction pattern (tension, not hostility)
}> = {
  maya: {
    high: [
      // Building resonance - Maya connects with fellow makers
      { text: "Maya's eyes light up. 'You get it. Most people don't get it.'", emotion: 'excited', timing: 'immediate' },
      { text: "Something shifts in Maya's posture. You're speaking her language.", emotion: 'open', timing: 'immediate' },
      { text: "'You're a maker too, aren't you?' Maya sounds hopeful.", emotion: 'curious', timing: 'immediate' }
    ],
    secondary: [
      // Analytical resonance
      { text: "Maya nods slowly. 'You think things through. I like that.'", emotion: 'approving', timing: 'immediate' },
      { text: "'That's... actually a really good point.' Maya looks at you differently.", emotion: 'surprised', timing: 'immediate' }
    ],
    friction: [
      // Helping friction - Maya bristles at being "helped"
      { text: "Maya's shoulders tense slightly. 'I don't need—' She stops herself.", emotion: 'guarded', timing: 'immediate' },
      { text: "Something flickers in Maya's expression. Resistance, maybe.", emotion: 'defensive', timing: 'immediate' },
      { text: "'Thanks, but I can figure it out myself.' Maya's voice is polite but firm.", emotion: 'guarded', timing: 'immediate' }
    ]
  },

  devon: {
    high: [
      // Analytical resonance
      { text: "Devon's posture relaxes. You speak his language.", emotion: 'open', timing: 'immediate' },
      { text: "'Finally. Someone who thinks in systems.' Devon almost smiles.", emotion: 'approving', timing: 'immediate' },
      { text: "Devon stops typing. Full attention. 'Go on.'", emotion: 'engaged', timing: 'immediate' }
    ],
    secondary: [
      // Building resonance
      { text: "'You make things. I can tell.' Devon sounds almost curious.", emotion: 'interested', timing: 'immediate' },
      { text: "Devon nods. 'You understand the build process.'", emotion: 'approving', timing: 'immediate' }
    ],
    friction: [
      // Helping friction - direct emotional support makes Devon uncomfortable
      { text: "Devon shifts uncomfortably. 'I appreciate the sentiment, but...'", emotion: 'awkward', timing: 'immediate' },
      { text: "'I don't really do the... feelings thing.' Devon looks away.", emotion: 'guarded', timing: 'immediate' },
      { text: "Devon's walls go up. Not hostile, just... protected.", emotion: 'distant', timing: 'immediate' }
    ]
  },

  samuel: {
    high: [
      // Patience resonance
      { text: "Samuel nods slowly, appreciatively. 'You understand that some things can't be rushed.'", emotion: 'warm', timing: 'immediate' },
      { text: "'Patience.' Samuel's voice carries weight. 'That's rare these days.'", emotion: 'approving', timing: 'immediate' }
    ],
    secondary: [
      // Helping resonance
      { text: "'You lead with care.' Samuel sounds almost moved. 'I see that.'", emotion: 'warm', timing: 'immediate' },
      { text: "Samuel studies you differently. 'You're a guide too, in your way.'", emotion: 'knowing', timing: 'immediate' }
    ],
    friction: [
      // Building friction - wary of quick fixes
      { text: "Samuel pauses. 'Not everything needs to be fixed, you know.'", emotion: 'thoughtful', timing: 'immediate' },
      { text: "'Some journeys take time.' Samuel's voice is gentle but firm.", emotion: 'neutral', timing: 'immediate' }
    ]
  }
}

/**
 * Get a resonance echo for a character based on player's pattern
 */
export function getResonanceEcho(
  characterId: string,
  resonanceType: 'high' | 'secondary' | 'friction'
): ConsequenceEcho | null {
  const echoes = RESONANCE_ECHOES[characterId]
  if (!echoes) return null

  const pool = echoes[resonanceType]
  if (!pool || pool.length === 0) return null

  return pool[Math.floor(Math.random() * pool.length)]
}

// ============================================
// VULNERABILITY DISCOVERY HINTS
// ============================================

/**
 * Subtle hints that appear before vulnerabilities are fully discovered
 * These guide observant players toward deeper conversations
 */
export const DISCOVERY_HINTS: Record<string, {
  vulnerability: string
  hints: ConsequenceEcho[]
  trustRange: { min: number; max: number }  // When these hints appear
}[]> = {
  maya: [
    {
      vulnerability: 'family_expectations',
      trustRange: { min: 2, max: 4 },
      hints: [
        { text: "Maya glances at her phone. 'My mom texted again.' She doesn't open it.", emotion: 'conflicted', timing: 'immediate' },
        { text: "There's something she's not saying about her parents.", emotion: 'curious', timing: 'delayed' },
        { text: "'Supposedly.' Maya uses that word a lot when talking about her future.", emotion: 'thoughtful', timing: 'delayed' }
      ]
    },
    {
      vulnerability: 'imposter_syndrome',
      trustRange: { min: 4, max: 6 },
      hints: [
        { text: "Maya deflects your compliment about her robot. 'It's nothing serious.'", emotion: 'guarded', timing: 'immediate' },
        { text: "She compares herself to Devon a lot. And not favorably.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "'Real engineers' - Maya uses that phrase. As if she's not one.", emotion: 'curious', timing: 'delayed' }
      ]
    },
    {
      vulnerability: 'unsent_email',
      trustRange: { min: 5, max: 7 },
      hints: [
        { text: "Maya mentions Innovation Depot. Then quickly changes the subject.", emotion: 'guarded', timing: 'immediate' },
        { text: "There's a story there. About an opportunity not taken.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "'I almost...' Maya trails off. 'Never mind.'", emotion: 'vulnerable', timing: 'immediate' }
      ]
    }
  ],

  devon: [
    {
      vulnerability: 'father_disconnect',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Devon's jaw tightens at the mention of family calls.", emotion: 'guarded', timing: 'immediate' },
        { text: "The Conversation Optimizer project seems... personal somehow.", emotion: 'curious', timing: 'delayed' },
        { text: "'I'm fine.' Devon says it like he's heard it too many times.", emotion: 'thoughtful', timing: 'delayed' }
      ]
    }
  ]
}

/**
 * Get a discovery hint for a character's vulnerability
 */
export function getDiscoveryHint(
  characterId: string,
  vulnerabilityId: string,
  trust: number
): ConsequenceEcho | null {
  const characterHints = DISCOVERY_HINTS[characterId]
  if (!characterHints) return null

  const vulnHints = characterHints.find(h => h.vulnerability === vulnerabilityId)
  if (!vulnHints) return null

  // Check if trust is in range
  if (trust < vulnHints.trustRange.min || trust > vulnHints.trustRange.max) {
    return null
  }

  const pool = vulnHints.hints
  return pool[Math.floor(Math.random() * pool.length)]
}

// ============================================
// VULNERABILITY REVELATION ECHOES
// ============================================

/**
 * Echoes for when a vulnerability is actually discovered
 * These mark significant relationship moments
 */
export const VULNERABILITY_REVELATION_ECHOES: Record<string, ConsequenceEcho[]> = {
  maya_family_guilt: [
    { text: "Maya goes quiet for a moment. You've touched something real.", emotion: 'vulnerable', timing: 'immediate' },
    { text: "She didn't mean to say that much. But she's not taking it back.", emotion: 'open', timing: 'immediate' }
  ],
  maya_imposter_syndrome: [
    { text: "Maya's walls crumble, just a little. 'I don't usually admit that.'", emotion: 'vulnerable', timing: 'immediate' },
    { text: "'You're the first person who's asked the right question.'", emotion: 'grateful', timing: 'immediate' }
  ],
  maya_unsent_email: [
    { text: "The weight of the unsent email hangs between you. A path not taken.", emotion: 'melancholy', timing: 'immediate' },
    { text: "Maya looks at you differently now. Like you've seen something private.", emotion: 'vulnerable', timing: 'immediate' }
  ]
}

/**
 * Get a revelation echo for discovering a vulnerability
 */
export function getVulnerabilityRevelationEcho(
  vulnerabilityId: string
): ConsequenceEcho | null {
  const pool = VULNERABILITY_REVELATION_ECHOES[vulnerabilityId]
  if (!pool || pool.length === 0) return null

  return pool[Math.floor(Math.random() * pool.length)]
}
