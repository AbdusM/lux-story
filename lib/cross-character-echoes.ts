/**
 * Cross-Character Echo Definitions
 *
 * Lux Story 2.0 - The Consequence Web
 *
 * Maps which characters reference the player's relationships with others.
 * When an arc completes, these echoes queue for delivery.
 *
 * Design Philosophy:
 * - Samuel is the central hub, aware of all relationships
 * - Characters who would realistically interact reference each other
 * - Echoes are thematically relevant (trades → trades, care → care)
 * - Some echoes require trust or pattern thresholds
 */

import type { CrossCharacterEcho } from './cross-character-memory'

/**
 * All cross-character echoes in the system
 *
 * Organization:
 * 1. Samuel references (hub awareness)
 * 2. Peer references (characters who'd interact)
 * 3. Thematic connections (shared themes)
 */
export const CROSS_CHARACTER_ECHOES: CrossCharacterEcho[] = [
  // ============= MAYA ARC COMPLETE =============
  {
    sourceCharacter: 'maya',
    sourceFlag: 'maya_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Maya's been different lately. Lighter. Whatever you two talked about... it helped.",
      emotion: 'warm',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'maya',
    sourceFlag: 'maya_arc_complete',
    targetCharacter: 'devon',
    delay: 1,
    echo: {
      text: "Maya mentioned you. Said you didn't try to fix her. That's... that's rare.",
      emotion: 'thoughtful',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'maya',
    sourceFlag: 'maya_arc_complete',
    targetCharacter: 'rohan',
    delay: 2,
    echo: {
      text: "I heard you talked to Maya. She's building something interesting. Did she show you Pepper?",
      emotion: 'curious',
      timing: 'immediate'
    },
    requiredPattern: { pattern: 'building', minLevel: 3 }
  },

  // ============= DEVON ARC COMPLETE =============
  {
    sourceCharacter: 'devon',
    sourceFlag: 'devon_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Devon's starting to see beyond the numbers. I wondered if someone could reach him.",
      emotion: 'knowing',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'devon',
    sourceFlag: 'devon_arc_complete',
    targetCharacter: 'maya',
    delay: 1,
    echo: {
      text: "Devon said something about you. Something about... understanding systems. He meant it as a compliment.",
      emotion: 'amused',
      timing: 'immediate'
    }
  },

  // ============= ELENA ARC COMPLETE =============
  {
    sourceCharacter: 'elena',
    sourceFlag: 'elena_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Elena finished her shift smiling today. That's rare. Said she met someone who actually listens.",
      emotion: 'warm',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'elena',
    sourceFlag: 'elena_arc_complete',
    targetCharacter: 'grace',
    delay: 1,
    echo: {
      text: "The electrician—Elena—she talked about you. Said you get it. The invisible work.",
      emotion: 'knowing',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'elena',
    sourceFlag: 'elena_arc_complete',
    targetCharacter: 'marcus',
    delay: 2,
    echo: {
      text: "Elena mentioned you helped her see something. Hands-on work... it has dignity. She needed to hear that from someone outside the trade.",
      emotion: 'warm',
      timing: 'immediate'
    },
    requiredPattern: { pattern: 'building', minLevel: 3 }
  },

  // ============= GRACE ARC COMPLETE =============
  {
    sourceCharacter: 'grace',
    sourceFlag: 'grace_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Grace left looking lighter. Said you sat with her. Really sat. That's a gift, you know.",
      emotion: 'gentle',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'grace',
    sourceFlag: 'grace_arc_complete',
    targetCharacter: 'elena',
    delay: 1,
    echo: {
      text: "Grace—the home health aide—she mentioned you. Said you understood about the work nobody sees.",
      emotion: 'thoughtful',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'grace',
    sourceFlag: 'grace_arc_complete',
    targetCharacter: 'marcus',
    delay: 1,
    echo: {
      text: "Grace spoke about you. Care work recognizes care work. She could tell you mean it.",
      emotion: 'warm',
      timing: 'immediate'
    },
    requiredPattern: { pattern: 'helping', minLevel: 3 }
  },

  // ============= MARCUS ARC COMPLETE =============
  {
    sourceCharacter: 'marcus',
    sourceFlag: 'marcus_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Marcus stopped by. Said you helped him remember why he started. That's not small.",
      emotion: 'warm',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'marcus',
    sourceFlag: 'marcus_arc_complete',
    targetCharacter: 'grace',
    delay: 1,
    echo: {
      text: "Marcus—the healthcare one—he mentioned your conversation. Said you understand triage. Not everyone does.",
      emotion: 'knowing',
      timing: 'immediate'
    }
  },

  // ============= ROHAN ARC COMPLETE =============
  {
    sourceCharacter: 'rohan',
    sourceFlag: 'rohan_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Rohan's been talking differently. Less... closed. Did you two go deep?",
      emotion: 'curious',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'rohan',
    sourceFlag: 'rohan_arc_complete',
    targetCharacter: 'devon',
    delay: 1,
    echo: {
      text: "Rohan said something strange. That you made him question the questions. Coming from him, that's... something.",
      emotion: 'thoughtful',
      timing: 'immediate'
    },
    requiredPattern: { pattern: 'analytical', minLevel: 3 }
  },
  {
    sourceCharacter: 'rohan',
    sourceFlag: 'rohan_arc_complete',
    targetCharacter: 'maya',
    delay: 2,
    echo: {
      text: "Rohan talked about you. Said you sat with the uncomfortable stuff. He respects that.",
      emotion: 'knowing',
      timing: 'immediate'
    }
  },

  // ============= TESS ARC COMPLETE =============
  {
    sourceCharacter: 'tess',
    sourceFlag: 'tess_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Tess came through. Still sharp, but... less armored. Your doing?",
      emotion: 'warm',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'tess',
    sourceFlag: 'tess_arc_complete',
    targetCharacter: 'yaquin',
    delay: 1,
    echo: {
      text: "Tess mentioned you. Said you actually challenged her. Most people don't bother.",
      emotion: 'amused',
      timing: 'immediate'
    }
  },

  // ============= YAQUIN ARC COMPLETE =============
  {
    sourceCharacter: 'yaquin',
    sourceFlag: 'yaquin_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Yaquin's been creating again. Real creating. Said you helped her find the why behind it.",
      emotion: 'warm',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'yaquin',
    sourceFlag: 'yaquin_arc_complete',
    targetCharacter: 'tess',
    delay: 1,
    echo: {
      text: "Yaquin talked about your conversation. Said you see creation as service. That resonated with her.",
      emotion: 'thoughtful',
      timing: 'immediate'
    },
    requiredPattern: { pattern: 'building', minLevel: 3 }
  },

  // ============= KAI ARC COMPLETE =============
  {
    sourceCharacter: 'kai',
    sourceFlag: 'kai_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Kai seems more grounded. Said you talked about teaching, about passing things on.",
      emotion: 'knowing',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'kai',
    sourceFlag: 'kai_arc_complete',
    targetCharacter: 'elena',
    delay: 1,
    echo: {
      text: "Kai mentioned you. Said you understand about training people up. The real investment.",
      emotion: 'warm',
      timing: 'immediate'
    }
  },

  // ============= SILAS ARC COMPLETE =============
  {
    sourceCharacter: 'silas',
    sourceFlag: 'silas_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Silas left more quietly than he arrived. Peaceful quiet, though. You found his ground.",
      emotion: 'gentle',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'silas',
    sourceFlag: 'silas_arc_complete',
    targetCharacter: 'rohan',
    delay: 1,
    echo: {
      text: "Silas mentioned your talk. Said you understand about letting go without giving up.",
      emotion: 'thoughtful',
      timing: 'immediate'
    },
    requiredPattern: { pattern: 'patience', minLevel: 3 }
  },

  // ============= JORDAN ARC COMPLETE =============
  {
    sourceCharacter: 'jordan',
    sourceFlag: 'jordan_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Jordan's been mentoring differently. More present. Said you showed them something.",
      emotion: 'warm',
      timing: 'immediate'
    }
  },

  // ============= ALEX ARC COMPLETE =============
  {
    sourceCharacter: 'alex',
    sourceFlag: 'alex_arc_complete',
    targetCharacter: 'samuel',
    delay: 0,
    echo: {
      text: "Alex is asking better questions these days. The kind without easy answers. Your influence?",
      emotion: 'knowing',
      timing: 'immediate'
    }
  },
  {
    sourceCharacter: 'alex',
    sourceFlag: 'alex_arc_complete',
    targetCharacter: 'kai',
    delay: 1,
    echo: {
      text: "Alex talked about you. Said you helped them see teaching as learning, not just giving.",
      emotion: 'warm',
      timing: 'immediate'
    },
    requiredPattern: { pattern: 'exploring', minLevel: 3 }
  }
]

/**
 * Get all echoes for a specific source flag
 */
export function getEchosForFlag(flag: string): CrossCharacterEcho[] {
  return CROSS_CHARACTER_ECHOES.filter(e => e.sourceFlag === flag)
}

/**
 * Get all echoes where a specific character is the target
 */
export function getEchosForTarget(characterId: string): CrossCharacterEcho[] {
  return CROSS_CHARACTER_ECHOES.filter(e => e.targetCharacter === characterId)
}

/**
 * Get summary of echo network (for debugging)
 */
export function getEchoNetworkSummary(): Record<string, string[]> {
  const summary: Record<string, string[]> = {}

  for (const echo of CROSS_CHARACTER_ECHOES) {
    const key = echo.sourceCharacter
    if (!summary[key]) summary[key] = []
    if (!summary[key].includes(echo.targetCharacter)) {
      summary[key].push(echo.targetCharacter)
    }
  }

  return summary
}
