/**
 * Narrative System Derivatives
 * Feature IDs: D-008, D-020, D-061, D-062, D-064, D-065
 *
 * This module extends the core narrative system with advanced mechanics:
 * - Rich text effects triggered by player state
 * - Magical realism at high pattern levels
 * - Player-generated story arcs from choice combinations
 * - Consequence cascade chains across characters
 * - Pattern-based narrative framing
 * - Meta-narrative access at pattern mastery
 */

import type { CSSProperties } from 'react'
import { PatternType, PATTERN_THRESHOLDS, getDominantPatternOrFallback } from './patterns'
import { PlayerPatterns, GameState } from './character-state'
import { CharacterId } from './graph-registry'

// ═══════════════════════════════════════════════════════════════════════════
// D-008: RICH TEXT EFFECTS TRIGGERED BY STATE
// Text styling changes based on player state (trust, patterns, emotions)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Text effect types
 */
export type TextEffectType =
  | 'shimmer'      // Sparkle/glitter effect
  | 'pulse'        // Gentle pulsing
  | 'echo'         // Trailing echo effect
  | 'fade'         // Fading in/out
  | 'glow'         // Luminous glow
  | 'static'       // Glitch/static effect
  | 'handwritten'  // Cursive/personal feel
  | 'typewriter'   // Mechanical typing
  | 'whisper'      // Smaller, intimate
  | 'bold_emphasis'// Strong emphasis

/**
 * Text effect configuration
 */
export interface TextEffect {
  type: TextEffectType
  trigger: TextEffectTrigger
  color?: string
  intensity?: 'subtle' | 'medium' | 'strong'
  duration?: number // ms
}

/**
 * What triggers a text effect
 */
export interface TextEffectTrigger {
  condition: 'pattern_level' | 'trust_level' | 'nervous_state' | 'flag_present' | 'character_speaking'
  pattern?: PatternType
  minLevel?: number
  trustMin?: number
  nervousState?: 'calm' | 'engaged' | 'stressed' | 'fight_flight' | 'shutdown'
  flag?: string
  characterId?: CharacterId
}

/**
 * Pattern-specific text effect mappings
 */
export const PATTERN_TEXT_EFFECTS: Record<PatternType, TextEffect> = {
  analytical: {
    type: 'typewriter',
    trigger: { condition: 'pattern_level', pattern: 'analytical', minLevel: PATTERN_THRESHOLDS.FLOURISHING },
    color: '#60a5fa', // Blue
    intensity: 'subtle'
  },
  patience: {
    type: 'fade',
    trigger: { condition: 'pattern_level', pattern: 'patience', minLevel: PATTERN_THRESHOLDS.FLOURISHING },
    color: '#34d399', // Green
    intensity: 'subtle',
    duration: 2000
  },
  exploring: {
    type: 'shimmer',
    trigger: { condition: 'pattern_level', pattern: 'exploring', minLevel: PATTERN_THRESHOLDS.FLOURISHING },
    color: '#fbbf24', // Amber
    intensity: 'medium'
  },
  helping: {
    type: 'glow',
    trigger: { condition: 'pattern_level', pattern: 'helping', minLevel: PATTERN_THRESHOLDS.FLOURISHING },
    color: '#f472b6', // Pink
    intensity: 'subtle'
  },
  building: {
    type: 'pulse',
    trigger: { condition: 'pattern_level', pattern: 'building', minLevel: PATTERN_THRESHOLDS.FLOURISHING },
    color: '#a78bfa', // Purple
    intensity: 'medium'
  }
}

/**
 * Trust-level text effects
 */
export const TRUST_TEXT_EFFECTS: { minTrust: number; effect: TextEffect }[] = [
  {
    minTrust: 8,
    effect: {
      type: 'handwritten',
      trigger: { condition: 'trust_level', trustMin: 8 },
      intensity: 'subtle'
    }
  },
  {
    minTrust: 9,
    effect: {
      type: 'whisper',
      trigger: { condition: 'trust_level', trustMin: 9 },
      intensity: 'medium'
    }
  }
]

/**
 * Character-specific text effects
 */
export const CHARACTER_TEXT_EFFECTS: Record<string, TextEffect> = {
  samuel: {
    type: 'echo',
    trigger: { condition: 'character_speaking', characterId: 'samuel' },
    color: '#f5f5dc', // Warm white
    intensity: 'subtle'
  },
  rohan: {
    type: 'static',
    trigger: { condition: 'character_speaking', characterId: 'rohan' },
    color: '#6b7280',
    intensity: 'subtle'
  },
  lira: {
    type: 'shimmer',
    trigger: { condition: 'character_speaking', characterId: 'lira' },
    color: '#c084fc',
    intensity: 'medium'
  }
}

/**
 * Get applicable text effects for current state
 */
export function getActiveTextEffects(
  gameState: GameState,
  speakerId?: CharacterId
): TextEffect[] {
  const effects: TextEffect[] = []

  // Check pattern effects
  Object.entries(PATTERN_TEXT_EFFECTS).forEach(([pattern, effect]) => {
    const patternKey = pattern as PatternType
    if (gameState.patterns[patternKey] >= (effect.trigger.minLevel ?? 0)) {
      effects.push(effect)
    }
  })

  // Check trust effects (use highest trust character)
  if (speakerId) {
    const charState = gameState.characters.get(speakerId)
    if (charState) {
      TRUST_TEXT_EFFECTS.forEach(({ minTrust, effect }) => {
        if (charState.trust >= minTrust) {
          effects.push(effect)
        }
      })
    }
  }

  // Check character-specific effects
  if (speakerId && CHARACTER_TEXT_EFFECTS[speakerId]) {
    effects.push(CHARACTER_TEXT_EFFECTS[speakerId])
  }

  return effects
}

/**
 * Convert TextEffect[] to CSS class string for styling
 * Maps effects to corresponding CSS classes in globals.css
 */
export function getTextEffectClasses(effects: TextEffect[]): string {
  if (effects.length === 0) return ''

  const classes: string[] = []

  effects.forEach(effect => {
    // Base effect class
    classes.push(`text-effect-${effect.type}`)

    // Intensity modifier
    if (effect.intensity) {
      classes.push(`text-effect-${effect.intensity}`)
    }

    // Pattern-specific color override
    if (effect.trigger.condition === 'pattern_level' && effect.trigger.pattern) {
      classes.push(`text-effect-pattern-${effect.trigger.pattern}`)
    }

    // Character-specific color override
    if (effect.trigger.condition === 'character_speaking' && effect.trigger.characterId) {
      classes.push(`text-effect-character-${effect.trigger.characterId}`)
    }
  })

  return classes.join(' ')
}

/**
 * Get CSS style object for inline color variables
 * Used when effects need custom colors beyond CSS class defaults
 */
export function getTextEffectStyles(effects: TextEffect[]): CSSProperties {
  const styles: CSSProperties = {}

  effects.forEach(effect => {
    if (effect.color) {
      // Set appropriate CSS variable based on effect type
      if (effect.type === 'shimmer') {
        (styles as Record<string, string>)['--shimmer-color'] = effect.color
      } else if (effect.type === 'glow') {
        (styles as Record<string, string>)['--glow-color'] = effect.color
      } else if (effect.type === 'echo') {
        (styles as Record<string, string>)['--echo-color'] = effect.color
      }
    }
  })

  return styles
}

// ═══════════════════════════════════════════════════════════════════════════
// D-020: MAGICAL REALISM AT HIGH PATTERN LEVELS
// At mastery, reality becomes more fluid - station responds to player
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Magical realism manifestation
 */
export interface MagicalRealism {
  id: string
  name: string
  description: string
  triggerPattern: PatternType
  minLevel: number
  manifestation: string
  characterReaction?: { characterId: CharacterId; dialogue: string }
}

/**
 * Magical realism manifestations registry
 */
export const MAGICAL_REALISM_MANIFESTATIONS: MagicalRealism[] = [
  // Analytical mastery
  {
    id: 'data_streams',
    name: 'Data Streams',
    description: 'You begin to see information flowing through the station',
    triggerPattern: 'analytical',
    minLevel: PATTERN_THRESHOLDS.FLOURISHING,
    manifestation: 'Faint streams of light flow between connection points. Data made visible.',
    characterReaction: {
      characterId: 'devon',
      dialogue: "You're seeing the station's nervous system now. Most people can't."
    }
  },
  {
    id: 'probability_echoes',
    name: 'Probability Echoes',
    description: 'You glimpse paths not taken',
    triggerPattern: 'analytical',
    minLevel: 10,
    manifestation: 'Ghost images flicker - versions of choices you didn\'t make.',
    characterReaction: {
      characterId: 'elena',
      dialogue: "The patterns you study... they're studying you back."
    }
  },

  // Patience mastery
  {
    id: 'time_whispers',
    name: 'Time Whispers',
    description: 'Time becomes perceptible',
    triggerPattern: 'patience',
    minLevel: PATTERN_THRESHOLDS.FLOURISHING,
    manifestation: 'You hear the soft tick of moments passing. Time has weight here.',
    characterReaction: {
      characterId: 'samuel',
      dialogue: "You've learned to listen. The station speaks to those who wait."
    }
  },
  {
    id: 'stillness_pools',
    name: 'Stillness Pools',
    description: 'Pockets of frozen time appear',
    triggerPattern: 'patience',
    minLevel: 10,
    manifestation: 'Small pools of absolute stillness. Step into one and the world pauses.',
    characterReaction: {
      characterId: 'grace',
      dialogue: "You've found the quiet places. They've always been there."
    }
  },

  // Exploring mastery
  {
    id: 'path_sense',
    name: 'Path Sense',
    description: 'Hidden paths reveal themselves',
    triggerPattern: 'exploring',
    minLevel: PATTERN_THRESHOLDS.FLOURISHING,
    manifestation: 'Walls shimmer. Doors appear where there were none.',
    characterReaction: {
      characterId: 'rohan',
      dialogue: "The station shows you what it hides from others. You've earned its trust."
    }
  },
  {
    id: 'station_memory',
    name: 'Station Memory',
    description: 'The station shares its memories',
    triggerPattern: 'exploring',
    minLevel: 10,
    manifestation: 'Touching walls, you see flashes of those who came before.',
    characterReaction: {
      characterId: 'samuel',
      dialogue: "Every traveler leaves an echo. You're learning to hear them all."
    }
  },

  // Helping mastery
  {
    id: 'emotion_sight',
    name: 'Emotion Sight',
    description: 'You sense others\' feelings as colors',
    triggerPattern: 'helping',
    minLevel: PATTERN_THRESHOLDS.FLOURISHING,
    manifestation: 'A soft aura surrounds people. Blue for calm, red for worry, gold for hope.',
    characterReaction: {
      characterId: 'grace',
      dialogue: "You see what I see now. The colors people carry inside them."
    }
  },
  {
    id: 'connection_threads',
    name: 'Connection Threads',
    description: 'Relationships become visible',
    triggerPattern: 'helping',
    minLevel: 10,
    manifestation: 'Faint threads connect people who matter to each other. Some shine, some fray.',
    characterReaction: {
      characterId: 'jordan',
      dialogue: "The web that holds us all together. You can see it now."
    }
  },

  // Building mastery
  {
    id: 'potential_sight',
    name: 'Potential Sight',
    description: 'You see what things could become',
    triggerPattern: 'building',
    minLevel: PATTERN_THRESHOLDS.FLOURISHING,
    manifestation: 'Objects shimmer with possibility. You see their potential forms overlaid.',
    characterReaction: {
      characterId: 'maya',
      dialogue: "That's how I see everything. What it is, and what it could be."
    }
  },
  {
    id: 'creation_pulse',
    name: 'Creation Pulse',
    description: 'Your intent shapes small things',
    triggerPattern: 'building',
    minLevel: 10,
    manifestation: 'Small things move toward completion when you focus on them.',
    characterReaction: {
      characterId: 'silas',
      dialogue: "The station responds to builders. Always has. Now it responds to you."
    }
  }
]

/**
 * Get active magical realism manifestations
 */
export function getActiveMagicalRealisms(
  patterns: PlayerPatterns
): MagicalRealism[] {
  return MAGICAL_REALISM_MANIFESTATIONS.filter(m =>
    patterns[m.triggerPattern] >= m.minLevel
  )
}

/**
 * Check if player has any magical realism perception
 */
export function hasMagicalPerception(patterns: PlayerPatterns): boolean {
  return getActiveMagicalRealisms(patterns).length > 0
}

// ═══════════════════════════════════════════════════════════════════════════
// D-061: PLAYER-GENERATED STORY ARCS
// Unique story arcs emerge from choice combinations across characters
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Emergent story arc definition
 */
export interface EmergentStoryArc {
  id: string
  name: string
  description: string
  requiredChoices: {
    characterId: CharacterId
    flagRequired: string
    description: string
  }[]
  unlockFlag: string
  arcContent: {
    introductionNodeId: string
    climaxNodeId: string
    resolutionOptions: string[]
  }
  reward: {
    patternBonus?: Partial<PlayerPatterns>
    trustBonus?: { characterId: CharacterId; amount: number }[]
    specialFlag: string
  }
}

/**
 * Emergent story arcs registry
 */
export const EMERGENT_STORY_ARCS: EmergentStoryArc[] = [
  {
    id: 'the_old_project',
    name: 'The Old Project',
    description: 'Maya, Devon, and Rohan were once working on something together',
    requiredChoices: [
      { characterId: 'maya', flagRequired: 'maya_past_failure', description: 'Learned about Maya\'s failed project' },
      { characterId: 'devon', flagRequired: 'devon_past_failure', description: 'Learned about Devon\'s regret' },
      { characterId: 'rohan', flagRequired: 'rohan_data_truth', description: 'Learned what Rohan discovered' }
    ],
    unlockFlag: 'arc_old_project_discovered',
    arcContent: {
      introductionNodeId: 'old_project_revelation',
      climaxNodeId: 'old_project_confrontation',
      resolutionOptions: ['reunite_team', 'let_it_go', 'expose_truth']
    },
    reward: {
      patternBonus: { analytical: 2, building: 1 },
      trustBonus: [
        { characterId: 'maya', amount: 1 },
        { characterId: 'devon', amount: 1 },
        { characterId: 'rohan', amount: 1 }
      ],
      specialFlag: 'old_project_resolved'
    }
  },
  {
    id: 'the_patient',
    name: 'The Patient',
    description: 'Marcus, Grace, and Zara share a common secret - a patient they all failed',
    requiredChoices: [
      { characterId: 'marcus', flagRequired: 'marcus_breach_patient', description: 'Learned about Marcus\'s patient' },
      { characterId: 'grace', flagRequired: 'grace_young_patient', description: 'Learned about Grace\'s young patient' },
      { characterId: 'zara', flagRequired: 'zara_algorithm_tragedy', description: 'Learned about Zara\'s triage tragedy' }
    ],
    unlockFlag: 'arc_the_patient_discovered',
    arcContent: {
      introductionNodeId: 'patient_connection',
      climaxNodeId: 'patient_memorial',
      resolutionOptions: ['honor_memory', 'find_family', 'systemic_change']
    },
    reward: {
      patternBonus: { helping: 2, patience: 1 },
      trustBonus: [
        { characterId: 'marcus', amount: 2 },
        { characterId: 'grace', amount: 2 },
        { characterId: 'zara', amount: 2 }
      ],
      specialFlag: 'patient_honored'
    }
  },
  {
    id: 'the_artists_legacy',
    name: 'The Artists\' Legacy',
    description: 'Asha, Lira, and Elena discover they\'re all connected to the same mentor',
    requiredChoices: [
      { characterId: 'asha', flagRequired: 'asha_grandmother_taught', description: 'Learned about Asha\'s grandmother' },
      { characterId: 'lira', flagRequired: 'lira_grandmother_rose', description: 'Learned about Lira\'s grandmother Rose' },
      { characterId: 'elena', flagRequired: 'elena_mentor_patterns', description: 'Learned about Elena\'s mentor' }
    ],
    unlockFlag: 'arc_artists_legacy_discovered',
    arcContent: {
      introductionNodeId: 'artists_connection',
      climaxNodeId: 'legacy_celebration',
      resolutionOptions: ['collaborative_piece', 'individual_tributes', 'archive_history']
    },
    reward: {
      patternBonus: { exploring: 2, building: 2 },
      trustBonus: [
        { characterId: 'asha', amount: 2 },
        { characterId: 'lira', amount: 2 },
        { characterId: 'elena', amount: 2 }
      ],
      specialFlag: 'artists_legacy_honored'
    }
  },
  {
    id: 'station_keepers_secret',
    name: 'The Station Keeper\'s Secret',
    description: 'Samuel has been hiding something - and multiple characters know pieces',
    requiredChoices: [
      { characterId: 'samuel', flagRequired: 'samuel_past_revealed', description: 'Samuel shared his past' },
      { characterId: 'tess', flagRequired: 'tess_samuel_history', description: 'Tess mentioned knowing Samuel before' },
      { characterId: 'jordan', flagRequired: 'jordan_station_truth', description: 'Jordan hinted at station secrets' }
    ],
    unlockFlag: 'arc_keeper_secret_discovered',
    arcContent: {
      introductionNodeId: 'keeper_truth',
      climaxNodeId: 'keeper_choice',
      resolutionOptions: ['protect_secret', 'share_burden', 'break_cycle']
    },
    reward: {
      patternBonus: { patience: 3 },
      trustBonus: [
        { characterId: 'samuel', amount: 3 }
      ],
      specialFlag: 'keeper_secret_resolved'
    }
  }
]

/**
 * Check if an emergent arc is unlocked
 */
export function isEmergentArcUnlocked(
  arcId: string,
  gameState: GameState
): { unlocked: boolean; missingPieces: string[] } {
  const arc = EMERGENT_STORY_ARCS.find(a => a.id === arcId)
  if (!arc) return { unlocked: false, missingPieces: ['Arc not found'] }

  const missingPieces: string[] = []

  arc.requiredChoices.forEach(choice => {
    if (!gameState.globalFlags.has(choice.flagRequired)) {
      missingPieces.push(choice.description)
    }
  })

  return {
    unlocked: missingPieces.length === 0,
    missingPieces
  }
}

/**
 * Get newly discovered arcs based on flag changes
 */
export function getNewlyDiscoveredArcs(
  oldFlags: Set<string>,
  newFlags: Set<string>
): EmergentStoryArc[] {
  return EMERGENT_STORY_ARCS.filter(arc => {
    // Was not previously unlocked
    const wasUnlocked = arc.requiredChoices.every(c => oldFlags.has(c.flagRequired))
    // Is now unlocked
    const isUnlocked = arc.requiredChoices.every(c => newFlags.has(c.flagRequired))
    // Not already discovered
    const alreadyDiscovered = oldFlags.has(arc.unlockFlag)

    return !wasUnlocked && isUnlocked && !alreadyDiscovered
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// D-062: CONSEQUENCE CASCADE CHAINS
// Choices cause 3+ degree cascades across characters
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cascade effect definition
 */
export interface CascadeEffect {
  id: string
  trigger: {
    flagSet: string
    characterId: CharacterId
  }
  chain: CascadeLink[]
}

/**
 * Single link in a cascade chain
 */
export interface CascadeLink {
  degree: number // 1st, 2nd, 3rd degree effect
  characterAffected: CharacterId
  effect: {
    trustChange?: number
    flagSet?: string
    dialogueUnlock?: string
  }
  description: string
  delay?: number // Dialogues/sessions before this manifests
}

/**
 * Cascade effects registry
 */
export const CASCADE_EFFECTS: CascadeEffect[] = [
  {
    id: 'maya_trust_cascade',
    trigger: { flagSet: 'helped_maya_deeply', characterId: 'maya' },
    chain: [
      {
        degree: 1,
        characterAffected: 'maya',
        effect: { trustChange: 2, flagSet: 'maya_vouches_for_player' },
        description: 'Maya trusts you more deeply.'
      },
      {
        degree: 2,
        characterAffected: 'devon',
        effect: { trustChange: 1, dialogueUnlock: 'devon_heard_from_maya' },
        description: 'Devon heard good things from Maya.',
        delay: 1
      },
      {
        degree: 3,
        characterAffected: 'yaquin',
        effect: { flagSet: 'yaquin_curious_about_player' },
        description: 'Yaquin is curious about someone Maya respects.',
        delay: 2
      }
    ]
  },
  {
    id: 'marcus_breach_cascade',
    trigger: { flagSet: 'learned_marcus_breach', characterId: 'marcus' },
    chain: [
      {
        degree: 1,
        characterAffected: 'marcus',
        effect: { trustChange: -1, flagSet: 'marcus_vulnerable_revealed' },
        description: 'Marcus feels exposed, trust wavers.'
      },
      {
        degree: 2,
        characterAffected: 'grace',
        effect: { dialogueUnlock: 'grace_comfort_marcus' },
        description: 'Grace notices Marcus is struggling.',
        delay: 1
      },
      {
        degree: 3,
        characterAffected: 'zara',
        effect: { flagSet: 'zara_relates_to_marcus' },
        description: 'Zara sees herself in Marcus\'s struggle.',
        delay: 2
      }
    ]
  },
  {
    id: 'rohan_truth_cascade',
    trigger: { flagSet: 'supported_rohan_truth', characterId: 'rohan' },
    chain: [
      {
        degree: 1,
        characterAffected: 'rohan',
        effect: { trustChange: 3, flagSet: 'rohan_feels_understood' },
        description: 'Rohan finally feels someone believes him.'
      },
      {
        degree: 2,
        characterAffected: 'elena',
        effect: { dialogueUnlock: 'elena_validates_rohan' },
        description: 'Elena\'s data supports what Rohan said.',
        delay: 1
      },
      {
        degree: 3,
        characterAffected: 'samuel',
        effect: { flagSet: 'samuel_reconsiders_rohan' },
        description: 'Samuel begins to reconsider his stance.',
        delay: 2
      },
      {
        degree: 4,
        characterAffected: 'maya',
        effect: { dialogueUnlock: 'maya_apologizes_to_rohan' },
        description: 'Maya realizes she should have listened.',
        delay: 3
      }
    ]
  }
]

/**
 * Get cascade effects triggered by a new flag
 */
export function getCascadeEffectsForFlag(
  flagSet: string,
  characterId: CharacterId
): CascadeEffect | null {
  return CASCADE_EFFECTS.find(c =>
    c.trigger.flagSet === flagSet && c.trigger.characterId === characterId
  ) ?? null
}

/**
 * Get pending cascade effects for current state
 */
export function getPendingCascadeLinks(
  gameState: GameState,
  sessionNumber: number
): CascadeLink[] {
  const pending: CascadeLink[] = []

  CASCADE_EFFECTS.forEach(cascade => {
    // Check if trigger has fired
    if (!gameState.globalFlags.has(cascade.trigger.flagSet)) return

    // Check each link in the chain
    cascade.chain.forEach(link => {
      // Skip if already applied
      if (link.effect.flagSet && gameState.globalFlags.has(link.effect.flagSet)) return
      if (link.effect.dialogueUnlock && gameState.globalFlags.has(link.effect.dialogueUnlock)) return

      // Check if delay has passed (simplified: assume 1 session = 1 delay unit)
      const triggerSession = 0 // Would need to track when trigger fired
      if ((link.delay ?? 0) <= sessionNumber - triggerSession) {
        pending.push(link)
      }
    })
  })

  return pending
}

// ═══════════════════════════════════════════════════════════════════════════
// D-064: NARRATIVE FRAMING BASED ON DOMINANT PATTERN
// Station appears different to different patterns
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pattern-based narrative framing
 */
export interface NarrativeFraming {
  pattern: PatternType
  stationMetaphor: string
  visualTheme: string
  primaryColors: string[]
  characterFocus: CharacterId[]
  narrativeVoice: string
  descriptors: string[]
}

/**
 * Narrative framings by pattern
 */
export const NARRATIVE_FRAMINGS: Record<PatternType, NarrativeFraming> = {
  analytical: {
    pattern: 'analytical',
    stationMetaphor: 'A vast puzzle with interlocking systems',
    visualTheme: 'Clean lines, data flows, connection maps',
    primaryColors: ['#60a5fa', '#3b82f6', '#1e40af'],
    characterFocus: ['devon', 'elena', 'rohan'],
    narrativeVoice: 'Precise, observational, cause-and-effect',
    descriptors: ['calculated', 'systematic', 'logical', 'precise', 'structured']
  },
  patience: {
    pattern: 'patience',
    stationMetaphor: 'A living garden that grows with time',
    visualTheme: 'Organic growth, seasonal changes, deep roots',
    primaryColors: ['#34d399', '#10b981', '#065f46'],
    characterFocus: ['samuel', 'grace', 'lira'],
    narrativeVoice: 'Contemplative, measured, unhurried',
    descriptors: ['patient', 'enduring', 'thoughtful', 'deliberate', 'steady']
  },
  exploring: {
    pattern: 'exploring',
    stationMetaphor: 'An endless labyrinth of discovery',
    visualTheme: 'Hidden passages, doorways, unknown spaces',
    primaryColors: ['#fbbf24', '#f59e0b', '#b45309'],
    characterFocus: ['rohan', 'jordan', 'elena'],
    narrativeVoice: 'Curious, discovery-oriented, wonder-filled',
    descriptors: ['curious', 'adventurous', 'seeking', 'discovering', 'wondering']
  },
  helping: {
    pattern: 'helping',
    stationMetaphor: 'A community bound by invisible threads',
    visualTheme: 'Connection webs, gathering spaces, warm light',
    primaryColors: ['#f472b6', '#ec4899', '#be185d'],
    characterFocus: ['grace', 'jordan', 'tess'],
    narrativeVoice: 'Empathetic, relational, people-focused',
    descriptors: ['caring', 'supportive', 'connected', 'nurturing', 'compassionate']
  },
  building: {
    pattern: 'building',
    stationMetaphor: 'A workshop of infinite potential',
    visualTheme: 'Tools, blueprints, works-in-progress',
    primaryColors: ['#a78bfa', '#8b5cf6', '#5b21b6'],
    characterFocus: ['maya', 'silas', 'yaquin'],
    narrativeVoice: 'Creative, constructive, possibility-focused',
    descriptors: ['creative', 'constructive', 'innovative', 'building', 'making']
  }
}

/**
 * Get narrative framing for current player state
 */
export function getNarrativeFraming(patterns: PlayerPatterns): NarrativeFraming {
  const dominant = getDominantPatternOrFallback(patterns, 'analytical')
  return NARRATIVE_FRAMINGS[dominant]
}

/**
 * Get a narrative descriptor based on player's patterns
 */
export function getPatternNarrativeDescriptor(patterns: PlayerPatterns): string {
  const framing = getNarrativeFraming(patterns)
  const index = Math.floor(Math.random() * framing.descriptors.length)
  return framing.descriptors[index]
}

// ═══════════════════════════════════════════════════════════════════════════
// D-065: META-NARRATIVE AT PATTERN MASTERY
// At high pattern levels, players access meta-layer of the game
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Meta-narrative revelation
 */
export interface MetaNarrativeRevelation {
  id: string
  name: string
  requirement: {
    anyPatternAtLevel?: number
    totalPatternSum?: number
    specificPatterns?: Partial<Record<PatternType, number>>
  }
  revelation: string
  characterAcknowledgement: { characterId: CharacterId; dialogue: string }
  unlocksDialogue: string[]
}

/**
 * Meta-narrative revelations registry
 */
export const META_NARRATIVE_REVELATIONS: MetaNarrativeRevelation[] = [
  {
    id: 'station_awareness',
    name: 'Station Awareness',
    requirement: { anyPatternAtLevel: PATTERN_THRESHOLDS.FLOURISHING },
    revelation: 'The station is more than a place. It\'s a test. Or a gift. Or both.',
    characterAcknowledgement: {
      characterId: 'samuel',
      dialogue: "You're starting to understand. This place finds people who are ready to be found."
    },
    unlocksDialogue: ['meta_station_purpose', 'meta_samuel_origin']
  },
  {
    id: 'pattern_truth',
    name: 'Pattern Truth',
    requirement: { totalPatternSum: 35 },
    revelation: 'The patterns aren\'t measuring you. They\'re teaching you who you already are.',
    characterAcknowledgement: {
      characterId: 'elena',
      dialogue: "The patterns don't lie. They don't judge either. They just... show."
    },
    unlocksDialogue: ['meta_pattern_purpose', 'meta_elena_research']
  },
  {
    id: 'character_nature',
    name: 'Character Nature',
    requirement: {
      specificPatterns: {
        helping: PATTERN_THRESHOLDS.DEVELOPING,
        exploring: PATTERN_THRESHOLDS.DEVELOPING
      }
    },
    revelation: 'Everyone here chose to be here. Even if they don\'t remember choosing.',
    characterAcknowledgement: {
      characterId: 'jordan',
      dialogue: "We're all travelers. Some of us just stayed longer than we planned."
    },
    unlocksDialogue: ['meta_character_origins', 'meta_jordan_truth']
  },
  {
    id: 'player_nature',
    name: 'Player Nature',
    requirement: { totalPatternSum: 45, anyPatternAtLevel: 10 },
    revelation: 'You\'ve been here before. You\'ll be here again. The station remembers.',
    characterAcknowledgement: {
      characterId: 'samuel',
      dialogue: "Welcome back. We wondered when you'd return this time."
    },
    unlocksDialogue: ['meta_player_cycle', 'meta_samuel_full_truth']
  }
]

/**
 * Check if meta-narrative revelation is unlocked
 */
export function isMetaRevelationUnlocked(
  revelationId: string,
  patterns: PlayerPatterns
): boolean {
  const revelation = META_NARRATIVE_REVELATIONS.find(r => r.id === revelationId)
  if (!revelation) return false

  const { requirement } = revelation

  // Check any pattern at level
  if (requirement.anyPatternAtLevel) {
    const hasAnyAtLevel = Object.values(patterns).some(
      v => v >= requirement.anyPatternAtLevel!
    )
    if (!hasAnyAtLevel) return false
  }

  // Check total pattern sum
  if (requirement.totalPatternSum) {
    const total = Object.values(patterns).reduce((sum, v) => sum + v, 0)
    if (total < requirement.totalPatternSum) return false
  }

  // Check specific patterns
  if (requirement.specificPatterns) {
    for (const [pattern, minLevel] of Object.entries(requirement.specificPatterns)) {
      if (patterns[pattern as PatternType] < minLevel!) return false
    }
  }

  return true
}

/**
 * Get all unlocked meta-narrative revelations
 */
export function getUnlockedMetaRevelations(
  patterns: PlayerPatterns
): MetaNarrativeRevelation[] {
  return META_NARRATIVE_REVELATIONS.filter(r =>
    isMetaRevelationUnlocked(r.id, patterns)
  )
}

/**
 * Check if player has any meta-awareness
 */
export function hasMetaAwareness(patterns: PlayerPatterns): boolean {
  return getUnlockedMetaRevelations(patterns).length > 0
}
