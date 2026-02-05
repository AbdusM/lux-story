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
import type { TemplateArchetype, VoiceCharacterId } from './voice-templates/template-types'
import { resolveVoiceVariation } from './voice-templates/template-resolver'
import type { DialogueContent } from './dialogue-graph'
import { getDominantPattern } from './patterns'
import { randomPick } from './seeded-random'

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
  /** D-010: Trust level at time of event for intensity-based display */
  trustAtEvent?: number
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
      ],
      analytical: [
        { text: "\"You map out your options carefully. That's strategic thinking.\"", emotion: 'knowing', timing: 'delayed' }
      ],
      building: [
        { text: "\"You're thinking about career as something you construct. Good framework.\"", emotion: 'approving', timing: 'delayed' }
      ],
      helping: [
        { text: "\"You consider how your choices affect others. That shapes good paths.\"", emotion: 'warm', timing: 'delayed' }
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
      ],
      patience: [
        { text: "\"You give ideas time to grow. Teaching is patient work.\"", emotion: 'warm', timing: 'delayed', soundCue: 'pattern-patience' }
      ],
      exploring: [
        { text: "\"You're curious about what education could be. That's the first step to changing it.\"", emotion: 'approving', timing: 'delayed', soundCue: 'pattern-exploring' }
      ],
      helping: [
        { text: "\"You think about the students first. That's what matters most.\"", emotion: 'knowing', timing: 'delayed', soundCue: 'pattern-helping' }
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
      ],
      analytical: [
        { text: "\"You organize your thoughts like you're cataloging them. I appreciate that.\"", emotion: "approving", timing: "delayed" }
      ],
      helping: [
        { text: "\"You ask about the people, not just the systems. That matters here.\"", emotion: "warm", timing: "delayed" }
      ],
      patience: [
        { text: "\"You let the archive speak instead of rushing to conclusions. Good instinct.\"", emotion: "knowing", timing: "delayed" }
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
      ],
      analytical: [
        { text: "\"You see the patterns in how care flows through a system. That's rare.\"", emotion: "knowing", timing: "delayed" }
      ],
      building: [
        { text: "\"You're thinking about what we could build here. I like that vision.\"", emotion: "warm", timing: "delayed" }
      ],
      exploring: [
        { text: "\"You ask the questions most people forget to ask. Keep doing that.\"", emotion: "approving", timing: "delayed" }
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
      ],
      patience: [
        { text: "\"You wait for the right moment. In logistics, timing is everything.\"", emotion: "knowing", timing: "delayed" }
      ],
      exploring: [
        { text: "\"You look for the alternate routes. That's how you find the shortcuts.\"", emotion: "approving", timing: "delayed" }
      ],
      helping: [
        { text: "\"You think about the people at the end of the chain. Not everyone does.\"", emotion: "warm", timing: "delayed" }
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
      ],
      analytical: [
        { text: "\"You measure twice, cut once. That's good practice.\"", emotion: "approving", timing: "delayed" }
      ],
      helping: [
        { text: "\"You don't just fix the machine. You help the person running it.\"", emotion: "warm", timing: "delayed" }
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
      ],
      patience: [
        { text: "\"You listen to the silence between the notes.\"", emotion: "peaceful", timing: "delayed" }
      ],
      building: [
        { text: "\"You compose your own reality.\"", emotion: "inspired", timing: "delayed" }
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
      ],
      exploring: [
        { text: "\"You look for the data that isn't there. The outliers.\"", emotion: "intrigued", timing: "delayed" }
      ],
      patience: [
        { text: "\"You wait for statistical significance.\"", emotion: "approving", timing: "delayed" }
      ]
    }
  },

  // ============================================
  // NEW: LinkedIn 2026 Career Expansion Characters
  // ============================================

  quinn: {
    trustUp: {
      subtle: [
        { text: "Quinn's pen pauses over his notepad.", emotion: "thoughtful", timing: "immediate" },
        { text: "A slight nod. The kind that means he's recalculating.", emotion: "curious", timing: "immediate" },
        { text: "Quinn's posture shifts—almost imperceptibly more open.", emotion: "open", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That's... not the answer I expected.\" Quinn sounds intrigued.", emotion: "surprised", timing: "immediate" },
        { text: "Quinn sets down his coffee. \"Say more about that.\"", emotion: "engaged", timing: "immediate" },
        { text: "\"You're thinking longer-term than most.\" Approval colors his voice.", emotion: "approving", timing: "immediate" }
      ],
      significant: [
        { text: "Quinn goes quiet. \"I used to think like that. Before the 400 jobs.\"", emotion: "vulnerable", timing: "immediate" },
        { text: "\"You see the whole board, not just the next move.\" Quinn's guard drops.", emotion: "warm", timing: "immediate" },
        { text: "\"Most people don't understand that wealth without meaning is just... numbers.\" He looks at you differently now.", emotion: "trusting", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Quinn glances at his watch.", emotion: "neutral", timing: "immediate" },
        { text: "His smile becomes professionally pleasant.", emotion: "guarded", timing: "immediate" },
        { text: "Quinn returns to his notepad.", emotion: "distant", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That's a short-term play.\" Quinn sounds disappointed.", emotion: "disappointed", timing: "immediate" },
        { text: "Something closes behind Quinn's eyes. Back to business.", emotion: "guarded", timing: "immediate" }
      ],
      significant: [
        { text: "\"I've seen that thinking destroy portfolios. And people.\" Quinn's voice is cold.", emotion: "cold", timing: "immediate" },
        { text: "Quinn stands. \"I have other meetings.\" He doesn't.", emotion: "dismissive", timing: "immediate" }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You think in systems. That's rare in this business.\"", emotion: "approving", timing: "delayed" }
      ],
      patience: [
        { text: "\"You understand that real returns take time. Most people don't.\"", emotion: "warm", timing: "delayed" }
      ],
      building: [
        { text: "\"You want to build something that lasts. I respect that.\"", emotion: "approving", timing: "delayed" }
      ]
    }
  },

  dante: {
    trustUp: {
      subtle: [
        { text: "Dante's smile reaches his eyes.", emotion: "warm", timing: "immediate" },
        { text: "He leans in slightly. Really listening.", emotion: "engaged", timing: "immediate" },
        { text: "Something relaxes in Dante's shoulders.", emotion: "open", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"Now that's refreshing.\" Dante laughs—a real one.", emotion: "pleased", timing: "immediate" },
        { text: "\"Most people don't see past the pitch. You do.\"", emotion: "warm", timing: "immediate" },
        { text: "Dante puts his phone face-down. Full attention.", emotion: "engaged", timing: "immediate" }
      ],
      significant: [
        { text: "\"I almost quit after that single mom thing. True story.\" Dante's voice catches.", emotion: "vulnerable", timing: "immediate" },
        { text: "\"You remind me why I stopped chasing numbers.\" Dante looks moved.", emotion: "moved", timing: "immediate" },
        { text: "\"The real close isn't the sale. It's the relationship after.\" He sounds like he's finally saying it out loud.", emotion: "trusting", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Dante's smile becomes a performance.", emotion: "guarded", timing: "immediate" },
        { text: "He checks his phone. Casual but deliberate.", emotion: "dismissive", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That's one way to look at it.\" Translation: wrong way.", emotion: "disappointed", timing: "immediate" },
        { text: "Dante's energy recedes. The charming mask slides into place.", emotion: "guarded", timing: "immediate" }
      ],
      significant: [
        { text: "\"I've heard that pitch before. From people who meant it less.\" Dante's warmth vanishes.", emotion: "cold", timing: "immediate" },
        { text: "\"Good luck with that approach.\" Dante's already looking past you.", emotion: "dismissive", timing: "immediate" }
      ]
    },
    patternRecognition: {
      helping: [
        { text: "\"You actually care about the person, not just the deal. That's my language.\"", emotion: "warm", timing: "delayed" }
      ],
      exploring: [
        { text: "\"You're curious about what makes people tick. That's the real skill.\"", emotion: "approving", timing: "delayed" }
      ],
      building: [
        { text: "\"You want to build something real, not just close and move on.\"", emotion: "approving", timing: "delayed" }
      ]
    }
  },

  nadia: {
    trustUp: {
      subtle: [
        { text: "Nadia's typing slows.", emotion: "thoughtful", timing: "immediate" },
        { text: "She tilts her head slightly. Processing.", emotion: "curious", timing: "immediate" },
        { text: "A micro-nod. Acknowledgment.", emotion: "approving", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That's... actually a sophisticated question.\" Nadia sounds surprised.", emotion: "surprised", timing: "immediate" },
        { text: "Nadia closes her laptop partially. \"Go on.\"", emotion: "engaged", timing: "immediate" },
        { text: "\"You understand the complexity. Most people just want the hype.\"", emotion: "warm", timing: "immediate" }
      ],
      significant: [
        { text: "\"I watched a biased algorithm ruin lives. Your question... it matters.\" Nadia's voice is quiet.", emotion: "vulnerable", timing: "immediate" },
        { text: "\"The hardest part isn't building AI. It's living with what you've built.\" She looks at you like you might understand.", emotion: "trusting", timing: "immediate" },
        { text: "\"You see the person behind the prediction. That's what this field needs.\"", emotion: "moved", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Nadia's fingers resume typing.", emotion: "distant", timing: "immediate" },
        { text: "\"Mm.\" She doesn't look up.", emotion: "dismissive", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That's the surface-level take.\" Nadia sounds tired.", emotion: "disappointed", timing: "immediate" },
        { text: "Her screen reflects in her glasses. She's already elsewhere.", emotion: "guarded", timing: "immediate" }
      ],
      significant: [
        { text: "\"That kind of thinking is how harm gets shipped as 'innovation.'\"", emotion: "cold", timing: "immediate" },
        { text: "\"I've had this conversation too many times.\" Nadia's done.", emotion: "exhausted", timing: "immediate" }
      ]
    },
    patternRecognition: {
      analytical: [
        { text: "\"You think systematically about consequences. That's essential for this work.\"", emotion: "approving", timing: "delayed" }
      ],
      helping: [
        { text: "\"You see the humans in the data. That's what separates ethics from compliance.\"", emotion: "warm", timing: "delayed" }
      ],
      patience: [
        { text: "\"You understand that 'move fast and break things' breaks people. Thank you.\"", emotion: "grateful", timing: "delayed" }
      ]
    }
  },

  isaiah: {
    trustUp: {
      subtle: [
        { text: "Isaiah's story pauses. He's really looking at you now.", emotion: "attentive", timing: "immediate" },
        { text: "Something warms in his expression.", emotion: "warm", timing: "immediate" },
        { text: "Isaiah nods slowly. Taking you seriously.", emotion: "thoughtful", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"You understand that this isn't about money. It never was.\"", emotion: "moved", timing: "immediate" },
        { text: "Isaiah leans back. \"Tell me more. I'm listening.\"", emotion: "engaged", timing: "immediate" },
        { text: "\"Most people see nonprofits as charities. You see them as systems of change.\"", emotion: "approving", timing: "immediate" }
      ],
      significant: [
        { text: "\"There was a kid. Marcus. I couldn't save him.\" Isaiah's voice breaks slightly.", emotion: "vulnerable", timing: "immediate" },
        { text: "\"You remind me why I do this work. Even when it breaks my heart.\"", emotion: "trusting", timing: "immediate" },
        { text: "\"The donors don't see the faces. But you do. I can tell.\"", emotion: "moved", timing: "immediate" }
      ]
    },
    trustDown: {
      subtle: [
        { text: "Isaiah's story becomes more... professional.", emotion: "guarded", timing: "immediate" },
        { text: "He glances at the clock.", emotion: "distant", timing: "immediate" }
      ],
      noticeable: [
        { text: "\"That's the corporate approach.\" Isaiah doesn't hide his disappointment.", emotion: "disappointed", timing: "immediate" },
        { text: "The warmth fades from Isaiah's eyes.", emotion: "guarded", timing: "immediate" }
      ],
      significant: [
        { text: "\"I've heard that justification before. From people who wrote checks instead of showing up.\"", emotion: "bitter", timing: "immediate" },
        { text: "\"The kids don't need efficiency. They need presence.\" Isaiah's voice is cold.", emotion: "cold", timing: "immediate" }
      ]
    },
    patternRecognition: {
      helping: [
        { text: "\"You lead with your heart. That's what this work demands.\"", emotion: "warm", timing: "delayed" }
      ],
      patience: [
        { text: "\"You understand that change takes time. Generational time.\"", emotion: "approving", timing: "delayed" }
      ],
      building: [
        { text: "\"You want to build systems that outlast you. That's the real legacy.\"", emotion: "knowing", timing: "delayed" }
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
  return randomPick(pool)!
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
  return randomPick(pool)!
}

/**
 * Create a resonance echo from a description string (from calculateResonantTrustChange)
 * Returns the character-specific description of why the pattern resonates/creates friction
 */
export function createResonanceEchoFromDescription(
  resonanceDescription: string | null
): ConsequenceEcho | null {
  if (!resonanceDescription) return null

  return {
    text: resonanceDescription,
    emotion: 'knowing',  // Resonance is an insight moment
    timing: 'immediate'
  }
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
 * Enhanced voice resolution using the template system
 *
 * Priority chain:
 * 1. Custom voiceVariations (hand-authored) - ALWAYS wins
 * 2. Character-specific pattern override
 * 3. Template archetype transform
 * 4. Base text fallback
 *
 * @param baseText - The original choice text
 * @param voiceVariations - Hand-authored voice variations (optional)
 * @param patterns - Player's current pattern scores
 * @param characterId - Character being spoken to (enables character overrides)
 * @param archetype - Explicit archetype hint (auto-detected if not provided)
 * @returns The voiced text appropriate for the player's dominant pattern
 */
export function getVoicedChoiceTextV2(
  baseText: string,
  voiceVariations: Partial<Record<keyof PlayerPatterns, string>> | undefined,
  patterns: PlayerPatterns,
  characterId?: VoiceCharacterId,
  archetype?: TemplateArchetype
): string {
  const result = resolveVoiceVariation(
    {
      baseText,
      customOverride: voiceVariations,
      characterId,
      archetype
    },
    patterns
  )

  return result.text
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

  return randomPick(pool)!
}

// ============================================
// VOICE REVELATION ECHOES - "Surface the Magic"
// ============================================

/**
 * Meta-moment echoes that reveal the voice variation system to players.
 * These trigger once when a player establishes a dominant pattern.
 *
 * Purpose: Per Game Designer analysis, the voice variation system is
 * "invisible sophistication" that players may never notice. These
 * one-time echoes surface the magic without breaking immersion.
 *
 * Trigger: First time dominant pattern >= 5 (strong preference established)
 */
export const VOICE_REVELATION_ECHOES: Record<keyof PlayerPatterns, ConsequenceEcho[]> = {
  analytical: [
    {
      text: "Samuel pauses mid-thought. \"You notice it, don't you? The way people respond to you. They pick up on how you think—and they match it. Or try to.\"",
      emotion: 'knowing',
      timing: 'delayed'
    },
    {
      text: "\"Interesting thing about this station,\" Samuel muses. \"The people here... they listen. Really listen. To HOW you say things, not just what. Your questions have a certain... precision. They respond to that.\"",
      emotion: 'warm',
      timing: 'delayed'
    }
  ],
  patience: [
    {
      text: "Samuel watches you for a moment. \"You take your time with things. People notice that. They slow down around you. Give themselves permission to breathe.\"",
      emotion: 'knowing',
      timing: 'delayed'
    },
    {
      text: "\"There's something about the way you hold space,\" Samuel says quietly. \"Others feel it. Watch how they talk to you—they'll be different. More open.\"",
      emotion: 'warm',
      timing: 'delayed'
    }
  ],
  exploring: [
    {
      text: "\"You've got that look,\" Samuel smiles. \"The one that says 'what else?' People here pick up on it. They'll show you paths they don't show everyone.\"",
      emotion: 'knowing',
      timing: 'delayed'
    },
    {
      text: "Samuel chuckles. \"Curious ones like you... you bring it out in others. Watch how people talk to you—they'll be more open to wondering.\"",
      emotion: 'warm',
      timing: 'delayed'
    }
  ],
  helping: [
    {
      text: "\"People trust you,\" Samuel observes. \"You can see it in how they talk to you. They share things they might not share with others.\"",
      emotion: 'knowing',
      timing: 'delayed'
    },
    {
      text: "Samuel leans closer. \"You lead with your heart. People sense that. Watch how they respond to you—there's a softness there. A willingness.\"",
      emotion: 'warm',
      timing: 'delayed'
    }
  ],
  building: [
    {
      text: "\"You're a maker,\" Samuel says with a nod. \"People can tell. Watch how they talk to you—they'll be practical. Solution-focused. They match your energy.\"",
      emotion: 'knowing',
      timing: 'delayed'
    },
    {
      text: "\"There's something about builders,\" Samuel muses. \"Others sense it. They get more concrete with you. More action-oriented. You bring that out.\"",
      emotion: 'warm',
      timing: 'delayed'
    }
  ]
}

/**
 * Get a voice revelation echo when player establishes dominant pattern
 * Should only trigger ONCE per playthrough, stored in knowledge flags
 *
 * @param dominantPattern - The player's established dominant pattern
 * @returns Echo to surface, or null if none available
 */
export function getVoiceRevelationEcho(
  dominantPattern: keyof PlayerPatterns
): ConsequenceEcho | null {
  const pool = VOICE_REVELATION_ECHOES[dominantPattern]
  if (!pool || pool.length === 0) return null

  return randomPick(pool)!
}

/**
 * Check if voice revelation should trigger
 * Returns the dominant pattern if threshold just crossed, null otherwise
 */
export function checkVoiceRevelationTrigger(
  oldPatterns: PlayerPatterns,
  newPatterns: PlayerPatterns,
  alreadyRevealed: boolean
): keyof PlayerPatterns | null {
  // Only trigger once per playthrough
  if (alreadyRevealed) return null

  // Check if any pattern just crossed the revelation threshold (5)
  const REVELATION_THRESHOLD = 5
  const patternKeys: (keyof PlayerPatterns)[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

  for (const pattern of patternKeys) {
    const oldValue = oldPatterns[pattern] || 0
    const newValue = newPatterns[pattern] || 0

    if (oldValue < REVELATION_THRESHOLD && newValue >= REVELATION_THRESHOLD) {
      // Also verify this is actually the dominant pattern
      const isDominant = patternKeys.every(p =>
        p === pattern || newPatterns[p] < newValue
      )

      if (isDominant) {
        return pattern
      }
    }
  }

  return null
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
  },

  marcus: {
    high: [
      // Helping resonance - Marcus connects with fellow caretakers
      { text: "Marcus sets down his tool. 'You think about the people first. I can tell.'", emotion: 'warm', timing: 'immediate' },
      { text: "'You're doing this for someone else, aren't you?' Marcus sounds like he knows.", emotion: 'knowing', timing: 'immediate' },
      { text: "Something softens in Marcus's expression. 'You understand why I do this.'", emotion: 'open', timing: 'immediate' }
    ],
    secondary: [
      // Building resonance
      { text: "'You make things work.' Marcus nods approvingly. 'That matters here.'", emotion: 'approving', timing: 'immediate' },
      { text: "Marcus watches you work. 'Good hands. You build things right.'", emotion: 'impressed', timing: 'immediate' }
    ],
    friction: [
      // Analytical friction - Marcus wary of pure logic over human needs
      { text: "Marcus pauses. 'Numbers don't tell the whole story, you know.'", emotion: 'thoughtful', timing: 'immediate' },
      { text: "'The data's helpful, but... people aren't data points.' Marcus's voice is gentle.", emotion: 'concerned', timing: 'immediate' }
    ]
  },

  kai: {
    high: [
      // Analytical resonance - Kai connects with systematic thinkers
      { text: "Kai's posture shifts. 'You see the patterns. Most people don't.'", emotion: 'approving', timing: 'immediate' },
      { text: "'You think in systems.' Kai sounds almost relieved. 'That's how I stay safe.'", emotion: 'open', timing: 'immediate' },
      { text: "Kai nods slowly. 'You understand risk. Real risk.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Patience resonance
      { text: "'You don't rush.' Kai relaxes slightly. 'Rushing gets people hurt.'", emotion: 'warm', timing: 'immediate' },
      { text: "Kai watches your careful approach. 'Good. Careful is good.'", emotion: 'approving', timing: 'immediate' }
    ],
    friction: [
      // Exploring friction - Kai sees curiosity as reckless
      { text: "Kai tenses. 'Curiosity has costs. Have you counted them?'", emotion: 'guarded', timing: 'immediate' },
      { text: "'That's... bold.' Kai doesn't sound like it's a compliment.", emotion: 'wary', timing: 'immediate' }
    ]
  },

  rohan: {
    high: [
      // Patience resonance - Rohan connects with those who take time
      { text: "Rohan's guard drops slightly. 'You don't demand immediacy. That's... unusual.'", emotion: 'surprised', timing: 'immediate' },
      { text: "'You understand that some things need space.' Rohan almost smiles.", emotion: 'warm', timing: 'immediate' },
      { text: "Rohan stops working. 'You let silence exist. Most people can't.'", emotion: 'approving', timing: 'immediate' }
    ],
    secondary: [
      // Exploring resonance
      { text: "'You're curious about things.' Rohan sounds almost wistful. 'I used to be.'", emotion: 'reflective', timing: 'immediate' },
      { text: "Rohan's eyes sharpen with interest. 'You ask the deeper questions.'", emotion: 'engaged', timing: 'immediate' }
    ],
    friction: [
      // Building friction - Rohan wary of those who want to fix everything
      { text: "Rohan pulls back slightly. 'Not everything needs to be built.'", emotion: 'guarded', timing: 'immediate' },
      { text: "'Sometimes the best thing to build is distance.' Rohan's voice is quiet.", emotion: 'distant', timing: 'immediate' }
    ]
  },

  tess: {
    high: [
      // Helping resonance - Tess connects with fellow educators
      { text: "Tess's smile becomes genuine. 'You care about the people, not just the metrics.'", emotion: 'warm', timing: 'immediate' },
      { text: "'You think about what students actually need.' Tess sounds impressed.", emotion: 'approving', timing: 'immediate' },
      { text: "Something changes in Tess's expression. 'You're a teacher at heart.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Exploring resonance
      { text: "'You ask good questions.' Tess leans in. 'The kind that make people think.'", emotion: 'curious', timing: 'immediate' },
      { text: "Tess nods approvingly. 'You're not afraid to dig deeper.'", emotion: 'engaged', timing: 'immediate' }
    ],
    friction: [
      // Analytical friction - Tess wary of reducing education to systems
      { text: "Tess's smile sharpens. 'Education isn't an optimization problem.'", emotion: 'defensive', timing: 'immediate' },
      { text: "'The numbers miss the point.' Tess sounds like she's heard this before.", emotion: 'tired', timing: 'immediate' }
    ]
  },

  yaquin: {
    high: [
      // Building resonance - Yaquin connects with fellow creators
      { text: "Yaquin's eyes light up. 'You make things. I can tell by how you see the world.'", emotion: 'excited', timing: 'immediate' },
      { text: "'You understand creation.' Yaquin sounds almost reverent. 'The ache of it.'", emotion: 'moved', timing: 'immediate' },
      { text: "Yaquin stops mid-sentence. 'You're a maker. The station brought you here for a reason.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Exploring resonance
      { text: "'You're curious about everything.' Yaquin smiles. 'I love that.'", emotion: 'warm', timing: 'immediate' },
      { text: "Yaquin gestures expansively. 'You see the possibilities, don't you?'", emotion: 'excited', timing: 'immediate' }
    ],
    friction: [
      // Patience friction - Yaquin uncomfortable with those who wait
      { text: "Yaquin shifts restlessly. 'But why wait? The vision is clear.'", emotion: 'impatient', timing: 'immediate' },
      { text: "'Sometimes you have to leap.' Yaquin sounds like they're convincing themselves.", emotion: 'defensive', timing: 'immediate' }
    ]
  },

  grace: {
    high: [
      // Helping resonance - Grace connects with fellow caretakers
      { text: "Grace's hands still. 'You see the people, not just the problems.'", emotion: 'warm', timing: 'immediate' },
      { text: "'Your heart leads.' Grace sounds moved. 'That is a gift, and a burden.'", emotion: 'knowing', timing: 'immediate' },
      { text: "Grace nods slowly. 'You understand that care is a practice, not a feeling.'", emotion: 'approving', timing: 'immediate' }
    ],
    secondary: [
      // Patience resonance
      { text: "'You know that healing takes time.' Grace's voice softens.", emotion: 'warm', timing: 'immediate' },
      { text: "Grace watches you quietly. 'You don't rush to fill silences. Good.'", emotion: 'approving', timing: 'immediate' }
    ],
    friction: [
      // Analytical friction - Grace wary of reducing care to systems
      { text: "Grace pauses. 'Numbers cannot capture suffering.'", emotion: 'sad', timing: 'immediate' },
      { text: "'Analysis has its place. But not here.' Grace's voice is firm.", emotion: 'guarded', timing: 'immediate' }
    ]
  },

  elena: {
    high: [
      // Exploring resonance - Elena connects with fellow seekers
      { text: "Elena looks up from her work. 'You dig for the truth. I can always tell.'", emotion: 'curious', timing: 'immediate' },
      { text: "'You want to understand the root.' Elena sounds almost excited. 'Not just the surface.'", emotion: 'engaged', timing: 'immediate' },
      { text: "Elena's guarded expression softens. 'You're a researcher at heart.'", emotion: 'warm', timing: 'immediate' }
    ],
    secondary: [
      // Analytical resonance
      { text: "'You organize information well.' Elena nods approvingly.", emotion: 'approving', timing: 'immediate' },
      { text: "Elena watches your process. 'Systematic. I appreciate that.'", emotion: 'impressed', timing: 'immediate' }
    ],
    friction: [
      // Helping friction - Elena uncomfortable with emotional support
      { text: "Elena stiffens slightly. 'I don't need... I'm fine.'", emotion: 'guarded', timing: 'immediate' },
      { text: "'The work speaks for itself.' Elena returns to her screen.", emotion: 'distant', timing: 'immediate' }
    ]
  },

  alex: {
    high: [
      // Analytical resonance - Alex connects with strategic thinkers
      { text: "Alex nods sharply. 'You see the whole chain. Most people only see their link.'", emotion: 'approving', timing: 'immediate' },
      { text: "'You think ahead.' Alex sounds almost impressed. 'Three moves, minimum.'", emotion: 'engaged', timing: 'immediate' },
      { text: "Alex's skeptical expression shifts. 'You run the numbers. I respect that.'", emotion: 'warm', timing: 'immediate' }
    ],
    secondary: [
      // Building resonance
      { text: "'You fix things.' Alex gives a curt nod. 'Not just talk about them.'", emotion: 'approving', timing: 'immediate' },
      { text: "Alex watches you work. 'Efficient. I like efficient.'", emotion: 'impressed', timing: 'immediate' }
    ],
    friction: [
      // Patience friction - Alex frustrated by slow approaches
      { text: "Alex checks the time. 'Some problems can't wait for perfect information.'", emotion: 'impatient', timing: 'immediate' },
      { text: "'Speed matters here.' Alex's voice is clipped. 'People are waiting.'", emotion: 'tense', timing: 'immediate' }
    ]
  },

  jordan: {
    high: [
      // Exploring resonance - Jordan connects with fellow seekers
      { text: "Jordan's eyes brighten. 'You're still looking. Still questioning.'", emotion: 'warm', timing: 'immediate' },
      { text: "'You don't have it all figured out.' Jordan sounds relieved. 'Neither do I.'", emotion: 'open', timing: 'immediate' },
      { text: "Jordan stops walking. 'You see paths everywhere. That's how I see it too.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Helping resonance
      { text: "'You think about how choices affect others.' Jordan nods approvingly.", emotion: 'warm', timing: 'immediate' },
      { text: "Jordan studies you. 'You want to help people find their way. I can tell.'", emotion: 'knowing', timing: 'immediate' }
    ],
    friction: [
      // Building friction - Jordan wary of those who commit too fast
      { text: "Jordan hesitates. 'What if you build the wrong thing?'", emotion: 'anxious', timing: 'immediate' },
      { text: "'Sometimes choosing means closing doors.' Jordan sounds uncertain.", emotion: 'conflicted', timing: 'immediate' }
    ]
  },

  silas: {
    high: [
      // Building resonance - Silas connects with fellow makers
      { text: "Silas stops tinkering. 'You make things work. Real things.'", emotion: 'approving', timing: 'immediate' },
      { text: "'You understand the dirt under your fingernails.' Silas almost smiles.", emotion: 'warm', timing: 'immediate' },
      { text: "Silas nods slowly. 'You know what it costs to build something that lasts.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Analytical resonance
      { text: "'You measure twice.' Silas sounds approving. 'Cut once.'", emotion: 'impressed', timing: 'immediate' },
      { text: "Silas watches your approach. 'You think it through. Good.'", emotion: 'warm', timing: 'immediate' }
    ],
    friction: [
      // Helping friction - Silas uncomfortable with emotional support
      { text: "Silas grunts. 'I don't need a pep talk. I need parts.'", emotion: 'gruff', timing: 'immediate' },
      { text: "'Save the feelings talk.' Silas returns to his work. 'Got machines to fix.'", emotion: 'dismissive', timing: 'immediate' }
    ]
  },

  asha: {
    high: [
      // Helping resonance - Asha connects with fellow mediators
      { text: "Asha's energy shifts. 'You listen for what's not being said.'", emotion: 'knowing', timing: 'immediate' },
      { text: "'You hold space for conflict.' Asha sounds relieved. 'That's rare.'", emotion: 'warm', timing: 'immediate' },
      { text: "Asha nods slowly. 'You see both sides. That's the hardest part.'", emotion: 'approving', timing: 'immediate' }
    ],
    secondary: [
      // Patience resonance
      { text: "'You don't rush to judgment.' Asha relaxes. 'Thank you for that.'", emotion: 'grateful', timing: 'immediate' },
      { text: "Asha watches you carefully. 'You let things unfold. Good instinct.'", emotion: 'warm', timing: 'immediate' }
    ],
    friction: [
      // Analytical friction - Asha wary of reducing conflict to logic
      { text: "Asha's expression tightens. 'You can't analyze your way through pain.'", emotion: 'concerned', timing: 'immediate' },
      { text: "'The math doesn't help here.' Asha sounds tired. 'People aren't equations.'", emotion: 'sad', timing: 'immediate' }
    ]
  },

  lira: {
    high: [
      // Exploring resonance - Lira connects with fellow seekers
      { text: "Lira's voice lifts. 'You hear the harmonics. The things between the notes.'", emotion: 'excited', timing: 'immediate' },
      { text: "'You're curious about sound.' Lira looks intrigued. 'Most people just hear noise.'", emotion: 'engaged', timing: 'immediate' },
      { text: "Lira stops adjusting her equipment. 'You listen. Really listen.'", emotion: 'warm', timing: 'immediate' }
    ],
    secondary: [
      // Building resonance
      { text: "'You want to make something.' Lira nods. 'I hear that in your questions.'", emotion: 'knowing', timing: 'immediate' },
      { text: "Lira gestures to her setup. 'You see how it all connects. Good.'", emotion: 'approving', timing: 'immediate' }
    ],
    friction: [
      // Patience friction - Lira frustrated by waiting
      { text: "Lira shifts restlessly. 'But why not try it now? See what happens?'", emotion: 'impatient', timing: 'immediate' },
      { text: "'Silence is just... waiting.' Lira looks uncomfortable.", emotion: 'anxious', timing: 'immediate' }
    ]
  },

  zara: {
    high: [
      // Exploring resonance - Zara connects with fellow questioners
      { text: "Zara's eyes sharpen. 'You ask the uncomfortable questions. Good.'", emotion: 'approving', timing: 'immediate' },
      { text: "'You don't accept the surface answer.' Zara sounds almost excited.", emotion: 'engaged', timing: 'immediate' },
      { text: "Zara puts down her stylus. 'You see the ethics underneath. Most people don't look.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Analytical resonance
      { text: "'You trace the implications.' Zara nods. 'That's how you find the truth.'", emotion: 'warm', timing: 'immediate' },
      { text: "Zara watches your reasoning. 'Systematic ethics. I appreciate that.'", emotion: 'impressed', timing: 'immediate' }
    ],
    friction: [
      // Building friction - Zara wary of builders who don't question
      { text: "Zara hesitates. 'But should we build it? That's the real question.'", emotion: 'concerned', timing: 'immediate' },
      { text: "'Creating has consequences.' Zara's voice carries weight.", emotion: 'serious', timing: 'immediate' }
    ]
  },

  quinn: {
    high: [
      // Analytical resonance - Quinn connects with systematic thinkers
      { text: "Quinn's rapid energy focuses. 'You see the patterns in the numbers.'", emotion: 'excited', timing: 'immediate' },
      { text: "'You think in models.' Quinn sounds relieved. 'Finally, someone who gets it.'", emotion: 'warm', timing: 'immediate' },
      { text: "Quinn stops typing. 'You understand that everything is a system.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Building resonance
      { text: "'You want to optimize, not just analyze.' Quinn nods approvingly.", emotion: 'approving', timing: 'immediate' },
      { text: "Quinn gestures at the models. 'You see what we could build here.'", emotion: 'engaged', timing: 'immediate' }
    ],
    friction: [
      // Helping friction - Quinn uncomfortable with emotional priorities
      { text: "Quinn pauses. 'Feelings are... hard to quantify.'", emotion: 'awkward', timing: 'immediate' },
      { text: "'The math works better without the sentiment.' Quinn sounds uncertain.", emotion: 'conflicted', timing: 'immediate' }
    ]
  },

  dante: {
    high: [
      // Exploring resonance - Dante connects with fellow adventurers
      { text: "Dante's showman facade drops slightly. 'You're curious about what's real.'", emotion: 'genuine', timing: 'immediate' },
      { text: "'You see past the performance.' Dante sounds almost relieved.", emotion: 'open', timing: 'immediate' },
      { text: "Dante stops mid-gesture. 'You ask the questions that matter. Not the easy ones.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Helping resonance
      { text: "'You actually care.' Dante's voice softens. 'That's... rare in sales.'", emotion: 'warm', timing: 'immediate' },
      { text: "Dante studies you. 'You want to help people, not just close deals.'", emotion: 'approving', timing: 'immediate' }
    ],
    friction: [
      // Patience friction - Dante uncomfortable with slowness
      { text: "Dante shifts restlessly. 'But the moment passes. You have to move.'", emotion: 'anxious', timing: 'immediate' },
      { text: "'Waiting costs opportunities.' Dante sounds like he's convincing himself.", emotion: 'defensive', timing: 'immediate' }
    ]
  },

  nadia: {
    high: [
      // Analytical resonance - Nadia connects with systematic thinkers
      { text: "Nadia's guarded expression shifts. 'You see the patterns. The ones most people miss.'", emotion: 'curious', timing: 'immediate' },
      { text: "'You think in systems.' Nadia sounds almost relieved. 'That's how I survived.'", emotion: 'open', timing: 'immediate' },
      { text: "Nadia stops scanning. 'You understand that information is power. And responsibility.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Exploring resonance
      { text: "'You dig deeper.' Nadia nods slowly. 'Not everyone wants the real answer.'", emotion: 'approving', timing: 'immediate' },
      { text: "Nadia watches your approach. 'You're not afraid of what you might find.'", emotion: 'impressed', timing: 'immediate' }
    ],
    friction: [
      // Helping friction - Nadia wary of emotional approaches
      { text: "Nadia's walls go up. 'Empathy can be exploited. Be careful.'", emotion: 'guarded', timing: 'immediate' },
      { text: "'Good intentions don't protect you from being used.' Nadia sounds tired.", emotion: 'wary', timing: 'immediate' }
    ]
  },

  isaiah: {
    high: [
      // Helping resonance - Isaiah connects with fellow servants
      { text: "Isaiah's tired eyes warm. 'You see the mission, not just the work.'", emotion: 'moved', timing: 'immediate' },
      { text: "'You understand service.' Isaiah sounds almost emotional. 'The real kind.'", emotion: 'grateful', timing: 'immediate' },
      { text: "Isaiah sets down his clipboard. 'You care about the people we're here to help.'", emotion: 'knowing', timing: 'immediate' }
    ],
    secondary: [
      // Building resonance
      { text: "'You want to build something that lasts.' Isaiah nods approvingly.", emotion: 'warm', timing: 'immediate' },
      { text: "Isaiah gestures at the organization. 'You see what we could create here.'", emotion: 'hopeful', timing: 'immediate' }
    ],
    friction: [
      // Analytical friction - Isaiah wary of cold analysis
      { text: "Isaiah pauses. 'The numbers don't capture dignity.'", emotion: 'concerned', timing: 'immediate' },
      { text: "'Impact isn't just metrics.' Isaiah's voice is gentle but firm.", emotion: 'thoughtful', timing: 'immediate' }
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

  return randomPick(pool)!
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
  ],

  marcus: [
    {
      vulnerability: 'healthcare_doubt',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Marcus pauses when you mention hospitals. There's a story there.", emotion: 'curious', timing: 'delayed' },
        { text: "'The system works,' Marcus says. But his hands keep moving, like they're not sure.", emotion: 'thoughtful', timing: 'immediate' },
        { text: "He asks if you've ever felt like you're fixing the wrong thing.", emotion: 'vulnerable', timing: 'delayed' }
      ]
    }
  ],

  kai: [
    {
      vulnerability: 'safety_burden',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Kai's eyes scan the exits. Again. It's automatic.", emotion: 'curious', timing: 'immediate' },
        { text: "'Someone has to think about what could go wrong.' Kai sounds tired.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "The weight of watchfulness shows in small ways. Kai carries something.", emotion: 'concerned', timing: 'delayed' }
      ]
    }
  ],

  rohan: [
    {
      vulnerability: 'isolation_choice',
      trustRange: { min: 4, max: 6 },
      hints: [
        { text: "Rohan mentions 'before' - then stops himself.", emotion: 'guarded', timing: 'immediate' },
        { text: "The solitude feels intentional. Protective, maybe.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "'It's easier this way.' Rohan doesn't elaborate.", emotion: 'sad', timing: 'delayed' }
      ]
    }
  ],

  tess: [
    {
      vulnerability: 'founder_loneliness',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Tess's phone buzzes constantly. She doesn't answer any of them.", emotion: 'curious', timing: 'immediate' },
        { text: "'Building something means burning bridges.' Tess sounds like she knows.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "There's a photo on her desk. Turned face-down.", emotion: 'sad', timing: 'delayed' }
      ]
    }
  ],

  yaquin: [
    {
      vulnerability: 'creative_block',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Yaquin's sketchbook is full of crossed-out ideas.", emotion: 'curious', timing: 'immediate' },
        { text: "'I used to...' Yaquin trails off, looking at old work.", emotion: 'wistful', timing: 'delayed' },
        { text: "The spark seems dimmer when Yaquin talks about new projects.", emotion: 'concerned', timing: 'delayed' }
      ]
    }
  ],

  grace: [
    {
      vulnerability: 'caregiver_fatigue',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Grace's hands never quite stop moving. Always working.", emotion: 'concerned', timing: 'immediate' },
        { text: "'Who cares for the caretakers?' Grace asks it like a rhetorical question.", emotion: 'sad', timing: 'delayed' },
        { text: "There are dark circles under her eyes. She hides them with a smile.", emotion: 'thoughtful', timing: 'delayed' }
      ]
    }
  ],

  elena: [
    {
      vulnerability: 'lost_knowledge',
      trustRange: { min: 4, max: 6 },
      hints: [
        { text: "Elena pauses at a certain archive section. Something personal.", emotion: 'curious', timing: 'immediate' },
        { text: "'Some things can't be recovered.' Elena's voice is quiet.", emotion: 'sad', timing: 'delayed' },
        { text: "She keeps searching for something. Or someone.", emotion: 'thoughtful', timing: 'delayed' }
      ]
    }
  ],

  alex: [
    {
      vulnerability: 'efficiency_cost',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Alex checks the time obsessively. Every few minutes.", emotion: 'curious', timing: 'immediate' },
        { text: "'Fast is never fast enough.' Alex doesn't sound proud of it.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "He mentions 'before the optimization.' Like something was lost.", emotion: 'sad', timing: 'delayed' }
      ]
    }
  ],

  jordan: [
    {
      vulnerability: 'path_paralysis',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Jordan keeps circling back to the same question: 'But what if?'", emotion: 'curious', timing: 'immediate' },
        { text: "The map of paths on Jordan's wall is covered in question marks.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "'Everyone wants me to choose.' Jordan sounds exhausted by options.", emotion: 'overwhelmed', timing: 'delayed' }
      ]
    }
  ],

  silas: [
    {
      vulnerability: 'obsolescence_fear',
      trustRange: { min: 4, max: 6 },
      hints: [
        { text: "Silas looks at the new machines differently. Wary.", emotion: 'curious', timing: 'immediate' },
        { text: "'They're replacing everything.' Silas's hands tighten on his tools.", emotion: 'guarded', timing: 'delayed' },
        { text: "He mentions training programs he never finished. A door closed.", emotion: 'sad', timing: 'delayed' }
      ]
    }
  ],

  asha: [
    {
      vulnerability: 'mediator_burden',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Asha rubs her temples. The headaches seem frequent.", emotion: 'concerned', timing: 'immediate' },
        { text: "'Everyone's pain becomes your pain.' Asha says it like a fact.", emotion: 'sad', timing: 'delayed' },
        { text: "She absorbs the tension in every room. It costs something.", emotion: 'thoughtful', timing: 'delayed' }
      ]
    }
  ],

  lira: [
    {
      vulnerability: 'voice_lost',
      trustRange: { min: 4, max: 6 },
      hints: [
        { text: "Lira's voice catches when she talks about her old recordings.", emotion: 'curious', timing: 'immediate' },
        { text: "'I used to sound different.' Lira doesn't explain what changed.", emotion: 'sad', timing: 'delayed' },
        { text: "There's a song she won't play. The file is there, but locked.", emotion: 'guarded', timing: 'delayed' }
      ]
    }
  ],

  zara: [
    {
      vulnerability: 'ethics_compromise',
      trustRange: { min: 4, max: 6 },
      hints: [
        { text: "Zara hesitates before showing certain work. Something's off.", emotion: 'curious', timing: 'immediate' },
        { text: "'I used to believe it was simpler.' Zara sounds different now.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "She deletes a file without showing you. 'That one's... complicated.'", emotion: 'guarded', timing: 'delayed' }
      ]
    }
  ],

  quinn: [
    {
      vulnerability: 'numbers_trap',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Quinn's eyes glaze when the conversation drifts from data.", emotion: 'curious', timing: 'immediate' },
        { text: "'The numbers make sense.' Quinn says it like a lifeline.", emotion: 'guarded', timing: 'delayed' },
        { text: "There's a moment where the models feel like walls, not windows.", emotion: 'sad', timing: 'delayed' }
      ]
    }
  ],

  dante: [
    {
      vulnerability: 'authenticity_mask',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Dante's smile flickers. Just for a moment. Then it's back.", emotion: 'curious', timing: 'immediate' },
        { text: "'This is what people want to see.' Dante sounds practiced.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "Behind the showmanship, something else waits. Watching.", emotion: 'guarded', timing: 'delayed' }
      ]
    }
  ],

  nadia: [
    {
      vulnerability: 'truth_burden',
      trustRange: { min: 4, max: 6 },
      hints: [
        { text: "Nadia triple-checks data before showing it. Even to you.", emotion: 'curious', timing: 'immediate' },
        { text: "'Some truths are expensive.' Nadia knows the cost personally.", emotion: 'guarded', timing: 'delayed' },
        { text: "She mentions former colleagues. The past tense is pointed.", emotion: 'sad', timing: 'delayed' }
      ]
    }
  ],

  isaiah: [
    {
      vulnerability: 'mission_drift',
      trustRange: { min: 3, max: 5 },
      hints: [
        { text: "Isaiah stares at the mission statement on the wall. A long moment.", emotion: 'thoughtful', timing: 'immediate' },
        { text: "'We started this because...' Isaiah trails off. The because got complicated.", emotion: 'sad', timing: 'delayed' },
        { text: "The grant paperwork seems heavier than it should be.", emotion: 'concerned', timing: 'delayed' }
      ]
    }
  ],

  samuel: [
    {
      vulnerability: 'station_weight',
      trustRange: { min: 5, max: 7 },
      hints: [
        { text: "Samuel's hand rests on the station wall. Protective. Or tired.", emotion: 'curious', timing: 'immediate' },
        { text: "'Every traveler leaves something behind.' Samuel sounds like he carries it all.", emotion: 'thoughtful', timing: 'delayed' },
        { text: "The station keeper's burden shows in quiet moments. When he thinks no one's watching.", emotion: 'sad', timing: 'delayed' }
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
  return randomPick(pool)!
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

  return randomPick(pool)!
}

// ============================================
// BIDIRECTIONAL REFLECTION SYSTEM
// NPC responses adapt to WHO the player is becoming
// ============================================

/**
 * Resolve NPC voiceVariations based on player's dominant pattern.
 * This is the BIDIRECTIONAL system - NPCs see the player's patterns
 * just like player choices adapt to their patterns.
 *
 * @param content - The dialogue content with optional voiceVariations
 * @param patterns - Player's current pattern scores
 * @returns Modified content with resolved text (or original if no variation applies)
 */
export function resolveContentVoiceVariation(
  content: DialogueContent,
  patterns: PlayerPatterns
): DialogueContent {
  if (!content.voiceVariations) return content

  const dominantPattern = getDominantPattern(patterns)
  if (dominantPattern && content.voiceVariations[dominantPattern]) {
    return {
      ...content,
      text: content.voiceVariations[dominantPattern]!
    }
  }
  return content
}

/**
 * Apply skill reflection to dialogue content.
 * When player has demonstrated a skill at sufficient level,
 * NPC dialogue changes to acknowledge their competence.
 *
 * @param content - The dialogue content with optional skillReflection
 * @param skillLevels - Player's demonstrated skill levels
 * @returns Modified content (or original if no reflection applies)
 */
export function applySkillReflection(
  content: DialogueContent,
  skillLevels: Record<string, number>
): DialogueContent {
  if (!content.skillReflection || !skillLevels) return content

  for (const reflection of content.skillReflection) {
    const playerLevel = skillLevels[reflection.skill] || 0
    if (playerLevel >= reflection.minLevel) {
      return {
        ...content,
        text: reflection.altText,
        emotion: reflection.altEmotion || content.emotion
      }
    }
  }
  return content
}

/**
 * Apply nervous system reflection to dialogue content.
 * NPC dialogue varies based on player's current nervous system state.
 * Makes Polyvagal Theory VISIBLE in the narrative.
 *
 * @param content - The dialogue content with optional nervousSystemReflection
 * @param nervousState - Player's current nervous system state
 * @returns Modified content (or original if no reflection applies)
 */
export function applyNervousSystemReflection(
  content: DialogueContent,
  nervousState?: 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal'
): DialogueContent {
  if (!content.nervousSystemReflection || !nervousState) return content

  const reflection = content.nervousSystemReflection.find(
    r => r.state === nervousState
  )

  if (reflection) {
    return {
      ...content,
      text: reflection.altText,
      emotion: reflection.altEmotion || content.emotion
    }
  }
  return content
}

/**
 * Skill recognition voice library.
 * Character-specific dialogue when they notice player's demonstrated skills.
 */
export const SKILL_RECOGNITION_VOICES: Record<string, Record<string, string[]>> = {
  emotionalIntelligence: {
    samuel: [
      "You read people well. That's a gift.",
      "You see what's underneath the words, don't you?"
    ],
    maya: [
      "You noticed something others would miss.",
      "That's... perceptive. Most people don't see that."
    ],
    marcus: [
      "You've got good instincts about people.",
      "That kind of awareness is rare. It matters in healthcare."
    ],
    default: [
      "You understand people.",
      "That's real emotional intelligence."
    ]
  },
  criticalThinking: {
    samuel: [
      "You ask the right questions.",
      "You think things through. I can tell."
    ],
    maya: [
      "You see the logic others miss.",
      "That analytical approach... I respect it."
    ],
    rohan: [
      "You question assumptions. Good.",
      "That's the kind of thinking that changes things."
    ],
    default: [
      "You think critically.",
      "That's a valuable skill."
    ]
  },
  resilience: {
    samuel: [
      "You don't break easy. I can see that.",
      "Setbacks don't stop you, do they?"
    ],
    kai: [
      "You bounce back. That's essential in this work.",
      "I've seen people crumble under less. You didn't."
    ],
    default: [
      "You're resilient.",
      "That strength will serve you."
    ]
  }
}

/**
 * Get skill recognition voice from a specific character.
 * Returns character-specific acknowledgment of demonstrated skill.
 *
 * @param skill - The skill being recognized
 * @param level - Player's level in that skill
 * @param characterId - The character speaking
 * @returns Recognition text and style, or null if level too low
 */
export function getSkillVoice(
  skill: string,
  level: number,
  characterId: string
): { text: string; style: 'noticing' | 'impressed' } | null {
  if (level < 5) return null

  const skillVoices = SKILL_RECOGNITION_VOICES[skill]
  if (!skillVoices) return null

  const characterVoices = skillVoices[characterId] || skillVoices.default
  if (!characterVoices || characterVoices.length === 0) return null

  return {
    text: randomPick(characterVoices)!,
    style: level >= 8 ? 'impressed' : 'noticing'
  }
}
