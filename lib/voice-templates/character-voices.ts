/**
 * Character Voice Profiles
 *
 * Defines unique voice characteristics for each of the 16 characters.
 * These profiles enable character-specific voice variations while
 * maintaining authentic pattern differentiation.
 *
 * Voice Profile Components:
 * - vocabulary: Words the character tends to use or avoid
 * - syntax: Sentence structure and brevity preferences
 * - patternOverrides: Character-specific archetype transforms
 */

import type { PatternType } from '@/lib/patterns'
import type { CharacterVoiceProfile, VoiceCharacterId } from './template-types'

/**
 * Character voice profiles for all 16 characters
 *
 * Profiles are organized by tier:
 * - Tier 1 (Core): Samuel, Maya, Devon
 * - Tier 2 (Standard): Marcus, Kai, Tess, Rohan
 * - Tier 3 (Extended): Yaquin, Grace, Alex, Elena
 * - Tier 4 (Specialized): Jordan, Silas, Asha, Lira, Zara
 */
export const CHARACTER_VOICE_PROFILES: Record<VoiceCharacterId, CharacterVoiceProfile> = {
  // ============================================================
  // TIER 1 - Core Characters (Most detailed profiles)
  // ============================================================

  samuel: {
    characterId: 'samuel',
    vocabulary: {
      preferred: ["that's", 'mm', 'folks', 'path', 'journey', 'reckon', 'station'],
      avoided: ['basically', 'actually', 'like', 'whatever']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the framework here? Walk me through the logic.",
        SHOW_UNDERSTANDING: "That tracks. The pattern is clear."
      },
      patience: {
        STAY_SILENT: "[Let the station's quiet speak for now.]",
        ACKNOWLEDGE_EMOTION: "Mm. That's a heavy load. No rush."
      },
      exploring: {
        EXPRESS_CURIOSITY: "Now that's interesting. What else is down that path?",
        TAKE_ACTION: "Let's see where this train leads."
      },
      helping: {
        OFFER_SUPPORT: "You're not walking this platform alone.",
        ACKNOWLEDGE_EMOTION: "I hear that. This station has seen a lot of folks carry that weight."
      },
      building: {
        TAKE_ACTION: "Time to lay some track. What's first?",
        CHALLENGE_ASSUMPTION: "That foundation won't hold. Let's rebuild it."
      }
    }
  },

  maya: {
    characterId: 'maya',
    vocabulary: {
      preferred: ['actually', 'technically', 'creative', 'prototype', 'iterate', 'ship'],
      avoided: ['simple', 'easy', 'boring', 'traditional']
    },
    syntax: {
      structure: 'fragmented',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "Break that down for me. What's the architecture?",
        CHALLENGE_ASSUMPTION: "Hold on. That assumption doesn't compile."
      },
      patience: {
        STAY_SILENT: "[Let the idea breathe. Sometimes code needs to settle.]"
      },
      exploring: {
        EXPRESS_CURIOSITY: "Ooh, what if we tried... actually, tell me more first.",
        TAKE_ACTION: "Let's prototype this. Ship fast, learn faster."
      },
      helping: {
        OFFER_SUPPORT: "We can debug this together. Where's it breaking?",
        ACKNOWLEDGE_EMOTION: "Tech burnout is real. Take the break."
      },
      building: {
        TAKE_ACTION: "Hands on keyboard. Let's build it.",
        SHOW_UNDERSTANDING: "Clean architecture. I can work with this."
      }
    }
  },

  devon: {
    characterId: 'devon',
    vocabulary: {
      preferred: ['system', 'logic', 'debug', 'iterate', 'process', 'optimize', 'function'],
      avoided: ['feel', 'vibe', 'maybe', 'whatever']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'terse'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "[QUERY] What's the decision tree here?",
        STAY_SILENT: "[PAUSE] Processing. Stand by.",
        SHOW_UNDERSTANDING: "[ACKNOWLEDGED] Logic checks out.",
        CHALLENGE_ASSUMPTION: "[ERROR] Premise fails validation."
      },
      patience: {
        STAY_SILENT: "[STANDBY] Let the process complete.",
        ACKNOWLEDGE_EMOTION: "[NOTED] Heavy data. Take cycles to process."
      },
      exploring: {
        EXPRESS_CURIOSITY: "[CURIOUS] What happens if we flip that variable?",
        TAKE_ACTION: "[EXECUTE] Running experiment now."
      },
      helping: {
        OFFER_SUPPORT: "[AVAILABLE] I can debug alongside you.",
        ACKNOWLEDGE_EMOTION: "[OBSERVED] That's significant input."
      },
      building: {
        TAKE_ACTION: "[BUILD] Initializing. What's the first module?",
        SHOW_UNDERSTANDING: "[VALID] Architecture is sound."
      }
    }
  },

  // ============================================================
  // TIER 2 - Standard Characters
  // ============================================================

  marcus: {
    characterId: 'marcus',
    vocabulary: {
      preferred: ['patient', 'care', 'steady', 'heal', 'listen', 'presence', 'ground'],
      avoided: ['rush', 'quick fix', 'shortcut']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "Walk me through the symptoms. What's the pattern?",
        SHOW_UNDERSTANDING: "That diagnosis tracks."
      },
      patience: {
        STAY_SILENT: "[Sit with them. Presence is medicine too.]",
        ACKNOWLEDGE_EMOTION: "That's a lot to carry. I'm here.",
        OFFER_SUPPORT: "No pressure. I'll be here when you're ready."
      },
      helping: {
        OFFER_SUPPORT: "You don't have to carry this alone. Let me help.",
        ACKNOWLEDGE_EMOTION: "I see you. That pain is real."
      },
      building: {
        TAKE_ACTION: "Let's build a care plan. Step by step."
      }
    }
  },

  kai: {
    characterId: 'kai',
    vocabulary: {
      preferred: ['safe', 'protocol', 'check', 'secure', 'risk', 'aware', 'prepared'],
      avoided: ['reckless', 'ignore', 'skip']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'terse'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the risk assessment? Break it down.",
        CHALLENGE_ASSUMPTION: "That's not protocol. What are you missing?"
      },
      patience: {
        STAY_SILENT: "[Wait. Observe. The situation will reveal itself.]",
        SET_BOUNDARY: "I need to assess before we proceed."
      },
      exploring: {
        EXPRESS_CURIOSITY: "What are the edge cases here? What could go wrong?"
      },
      helping: {
        OFFER_SUPPORT: "I've got your back. Let's do this safe.",
        ACKNOWLEDGE_EMOTION: "That fear is valid. Safety first."
      },
      building: {
        TAKE_ACTION: "Gear check complete. Let's move.",
        SHOW_UNDERSTANDING: "Solid protocol. I trust this."
      }
    }
  },

  tess: {
    characterId: 'tess',
    vocabulary: {
      preferred: ['learn', 'grow', 'discover', 'spark', 'curious', 'possibility', 'wonder'],
      avoided: ['can\'t', 'impossible', 'boring']
    },
    syntax: {
      structure: 'interrogative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the underlying principle here?",
        SHOW_UNDERSTANDING: "Ah! That's the connection I was missing."
      },
      patience: {
        ACKNOWLEDGE_EMOTION: "Learning takes time. That's okay.",
        STAY_SILENT: "[Let the question sit. Discovery needs space.]"
      },
      exploring: {
        EXPRESS_CURIOSITY: "What if we asked it differently? What else is possible?",
        TAKE_ACTION: "Let's experiment! What's the worst that happens?"
      },
      helping: {
        OFFER_SUPPORT: "Everyone struggles at first. Let me show you.",
        ACKNOWLEDGE_EMOTION: "That frustration? It means you care about learning."
      },
      building: {
        TAKE_ACTION: "Hands-on time. Learning by doing."
      }
    }
  },

  rohan: {
    characterId: 'rohan',
    vocabulary: {
      preferred: ['deep', 'pattern', 'signal', 'beneath', 'meaning', 'truth', 'question'],
      avoided: ['surface', 'obvious', 'simple']
    },
    syntax: {
      structure: 'fragmented',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's beneath that? What's the signal in the noise?",
        SHOW_UNDERSTANDING: "The pattern emerges. I see it now."
      },
      patience: {
        STAY_SILENT: "[Silence has its own language.]",
        ACKNOWLEDGE_EMOTION: "That depth... it takes time to surface."
      },
      exploring: {
        EXPRESS_CURIOSITY: "There's more underneath. What aren't we seeing?",
        REFLECT_BACK: "So the real question is... what's hiding?"
      },
      helping: {
        ACKNOWLEDGE_EMOTION: "That's not just feeling. That's knowing something.",
        OFFER_SUPPORT: "I'll sit with you in the dark until it makes sense."
      },
      building: {
        CHALLENGE_ASSUMPTION: "The surface answer isn't the real one. Dig deeper."
      }
    }
  },

  // ============================================================
  // TIER 3 - Extended Characters
  // ============================================================

  yaquin: {
    characterId: 'yaquin',
    vocabulary: {
      preferred: ['design', 'user', 'experience', 'interface', 'intuitive', 'flow', 'test'],
      avoided: ['ugly', 'confusing', 'cluttered']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the user journey here? Map it for me.",
        CHALLENGE_ASSUMPTION: "Have you tested that assumption with users?"
      },
      exploring: {
        EXPRESS_CURIOSITY: "What if the interface told a story? What would it say?",
        TAKE_ACTION: "Let's prototype it. See how it feels."
      },
      helping: {
        ACKNOWLEDGE_EMOTION: "Frustration means the design failed you, not vice versa.",
        OFFER_SUPPORT: "Let's redesign this experience together."
      },
      building: {
        TAKE_ACTION: "Wireframes first. Then we iterate.",
        SHOW_UNDERSTANDING: "Clean flow. The user will thank you."
      }
    }
  },

  grace: {
    characterId: 'grace',
    vocabulary: {
      preferred: ['coordinate', 'team', 'support', 'system', 'care', 'connect', 'bridge'],
      avoided: ['solo', 'isolated', 'disconnect']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "Who are the stakeholders? What are their needs?",
        SHOW_UNDERSTANDING: "The system makes sense now. I see how it connects."
      },
      patience: {
        ACKNOWLEDGE_EMOTION: "Healthcare is heavy. Take a breath.",
        STAY_SILENT: "[Sometimes coordination means knowing when to pause.]"
      },
      helping: {
        OFFER_SUPPORT: "I'll coordinate. You focus on what matters.",
        ACKNOWLEDGE_EMOTION: "You're doing vital work. I see that."
      },
      building: {
        TAKE_ACTION: "Let's build the bridge between these teams.",
        CHALLENGE_ASSUMPTION: "This process has a gap. Let me fill it."
      }
    }
  },

  alex: {
    characterId: 'alex',
    vocabulary: {
      preferred: ['route', 'efficient', 'logistics', 'flow', 'optimize', 'track', 'deliver'],
      avoided: ['stuck', 'waste', 'delay']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'terse'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the bottleneck? Show me the flow.",
        SHOW_UNDERSTANDING: "Route checks out. Clear path."
      },
      patience: {
        SET_BOUNDARY: "Need to map this before we move.",
        STAY_SILENT: "[Wait for the right window. Timing is everything.]"
      },
      exploring: {
        EXPRESS_CURIOSITY: "What if we rerouted? Alternative paths?",
        TAKE_ACTION: "Let's test this route. Only way to know."
      },
      building: {
        TAKE_ACTION: "Loading up. Let's move.",
        CHALLENGE_ASSUMPTION: "That path has friction. I know a better way."
      }
    }
  },

  elena: {
    characterId: 'elena',
    vocabulary: {
      preferred: ['archive', 'knowledge', 'preserve', 'context', 'history', 'pattern', 'record'],
      avoided: ['forget', 'discard', 'ignore']
    },
    syntax: {
      structure: 'formal',
      brevity: 'verbose'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the provenance? Where does this knowledge come from?",
        SHOW_UNDERSTANDING: "The pattern matches the archives. Verified."
      },
      patience: {
        STAY_SILENT: "[Archives teach patience. Knowledge reveals itself in time.]",
        ACKNOWLEDGE_EMOTION: "Some knowledge is heavy to carry. That's why we preserve it."
      },
      exploring: {
        EXPRESS_CURIOSITY: "What does the historical record say? There may be precedent.",
        REFLECT_BACK: "So the pattern here echoes something older..."
      },
      helping: {
        OFFER_SUPPORT: "Let me search the archives. The answer exists somewhere.",
        ACKNOWLEDGE_EMOTION: "The weight of knowledge. I understand."
      },
      building: {
        TAKE_ACTION: "Let's document this. Future generations will need it."
      }
    }
  },

  // ============================================================
  // TIER 4 - Specialized Characters
  // ============================================================

  jordan: {
    characterId: 'jordan',
    vocabulary: {
      preferred: ['path', 'direction', 'options', 'explore', 'discover', 'journey', 'crossroads'],
      avoided: ['stuck', 'trapped', 'wrong']
    },
    syntax: {
      structure: 'interrogative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What criteria matter most to you? Let's map the decision.",
        SHOW_UNDERSTANDING: "That path makes sense given what you've said."
      },
      patience: {
        STAY_SILENT: "[Let them sit with the options. Clarity comes.]",
        SET_BOUNDARY: "No need to decide now. The path will still be there."
      },
      exploring: {
        EXPRESS_CURIOSITY: "What if there's a path you haven't considered yet?",
        TAKE_ACTION: "Let's explore that direction. See where it leads."
      },
      helping: {
        OFFER_SUPPORT: "You don't have to navigate this alone. I'm here.",
        ACKNOWLEDGE_EMOTION: "Uncertainty is part of the journey. It's okay."
      }
    }
  },

  silas: {
    characterId: 'silas',
    vocabulary: {
      preferred: ['craft', 'precision', 'make', 'machine', 'build', 'hands', 'material'],
      avoided: ['shortcut', 'cheap', 'fake']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'terse'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the spec? Materials, tolerances.",
        SHOW_UNDERSTANDING: "Solid design. This will work."
      },
      patience: {
        STAY_SILENT: "[Let the work speak.]",
        ACKNOWLEDGE_EMOTION: "Making things right takes time. Respect the process."
      },
      exploring: {
        EXPRESS_CURIOSITY: "What if we tried a different material? Different approach?",
        CHALLENGE_ASSUMPTION: "That's not how the material behaves. Let me show you."
      },
      building: {
        TAKE_ACTION: "Enough talk. Let's make it.",
        OFFER_SUPPORT: "Hands learn faster than minds. Come, I'll show you.",
        SHOW_UNDERSTANDING: "Good work. You've got the feel for it."
      }
    }
  },

  asha: {
    characterId: 'asha',
    vocabulary: {
      preferred: ['understand', 'perspective', 'bridge', 'both', 'listen', 'resolve', 'space'],
      avoided: ['wrong', 'blame', 'fight']
    },
    syntax: {
      structure: 'declarative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What does each side need? Let's map the interests.",
        CHALLENGE_ASSUMPTION: "Is that what they actually said, or what you heard?"
      },
      patience: {
        STAY_SILENT: "[Hold space. Let the tension breathe.]",
        ACKNOWLEDGE_EMOTION: "That anger makes sense. It needs room.",
        SET_BOUNDARY: "I need us both to pause before we continue."
      },
      exploring: {
        EXPRESS_CURIOSITY: "What if there's a third option we haven't seen?",
        REFLECT_BACK: "What I'm hearing from both sides is..."
      },
      helping: {
        OFFER_SUPPORT: "I'll help you find words for what you're feeling.",
        ACKNOWLEDGE_EMOTION: "That hurt is real. I see it."
      }
    }
  },

  lira: {
    characterId: 'lira',
    vocabulary: {
      preferred: ['sound', 'voice', 'signal', 'frequency', 'resonate', 'tune', 'listen'],
      avoided: ['noise', 'static', 'ignore']
    },
    syntax: {
      structure: 'fragmented',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the signal here? Cut through the noise for me.",
        SHOW_UNDERSTANDING: "I hear it now. The frequency is clear."
      },
      patience: {
        STAY_SILENT: "[Listen. The silence between sounds matters too.]",
        ACKNOWLEDGE_EMOTION: "That feeling... it has a sound. Let it resonate."
      },
      exploring: {
        EXPRESS_CURIOSITY: "What does this sound like to you? What's the tone?",
        TAKE_ACTION: "Let's tune in. See what we can hear."
      },
      helping: {
        OFFER_SUPPORT: "I'll help you find your voice in this.",
        ACKNOWLEDGE_EMOTION: "I hear what you're really saying. Under the words."
      },
      building: {
        TAKE_ACTION: "Time to amplify. Let's make some noise.",
        SHOW_UNDERSTANDING: "Good frequency. That'll carry."
      }
    }
  },

  zara: {
    characterId: 'zara',
    vocabulary: {
      preferred: ['data', 'ethics', 'impact', 'pattern', 'truth', 'question', 'meaning'],
      avoided: ['ignore', 'harmless', 'neutral']
    },
    syntax: {
      structure: 'interrogative',
      brevity: 'moderate'
    },
    patternOverrides: {
      analytical: {
        ASK_FOR_DETAILS: "What's the data actually saying? Who benefits?",
        CHALLENGE_ASSUMPTION: "That algorithm has bias. Let me show you where."
      },
      patience: {
        STAY_SILENT: "[Sit with the complexity. Not everything resolves.]",
        ACKNOWLEDGE_EMOTION: "That discomfort means you're seeing clearly.",
        SET_BOUNDARY: "I need to think about the implications first."
      },
      exploring: {
        EXPRESS_CURIOSITY: "What patterns are we not seeing? What's invisible?",
        REFLECT_BACK: "So the real question is about power, not data..."
      },
      helping: {
        OFFER_SUPPORT: "Let's examine this together. You're not paranoid.",
        ACKNOWLEDGE_EMOTION: "That unease? Trust it. Something's off."
      },
      building: {
        TAKE_ACTION: "Let's build something that actually serves people.",
        CHALLENGE_ASSUMPTION: "We can do better than this. Let me show you how."
      }
    }
  }
}

/**
 * Get a character's voice profile
 */
export function getCharacterVoice(characterId: VoiceCharacterId): CharacterVoiceProfile {
  return CHARACTER_VOICE_PROFILES[characterId]
}

/**
 * Check if a character has specific pattern overrides
 */
export function hasPatternOverride(
  characterId: VoiceCharacterId,
  pattern: PatternType
): boolean {
  const profile = CHARACTER_VOICE_PROFILES[characterId]
  return !!profile.patternOverrides?.[pattern]
}

/**
 * Get all characters with overrides for a specific archetype
 */
export function getCharactersWithArchetypeOverride(
  archetype: string
): VoiceCharacterId[] {
  return (Object.keys(CHARACTER_VOICE_PROFILES) as VoiceCharacterId[]).filter(charId => {
    const profile = CHARACTER_VOICE_PROFILES[charId]
    if (!profile.patternOverrides) return false

    return Object.values(profile.patternOverrides).some(
      patternOverrides => patternOverrides && archetype in patternOverrides
    )
  })
}
