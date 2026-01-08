/**
 * Character System Derivatives
 * Feature IDs: D-016, D-017, D-018, D-063, D-095
 *
 * This module extends the core character system with advanced mechanics:
 * - Character-influenced environmental changes (station changes based on character trust)
 * - Cross-character loyalty prerequisites (multi-character requirements)
 * - Sector-specific character appearances
 * - Character relationship drama (competing for attention)
 * - Multi-character simultaneous interactions
 */

import type { PatternType as _PatternType } from './patterns'
import { GameState, CharacterState as _CharacterState, PlayerPatterns } from './character-state'
import { CharacterId, CHARACTER_IDS as _CHARACTER_IDS } from './graph-registry'

// ═══════════════════════════════════════════════════════════════════════════
// D-016: CHARACTER-INFLUENCED ENVIRONMENTAL CHANGES
// Different characters influence different station aspects based on trust
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Character influence domain - what aspects of the station they affect
 */
export interface CharacterInfluence {
  characterId: CharacterId
  domain: 'infrastructure' | 'aesthetics' | 'atmosphere' | 'secrets' | 'commerce'
  description: string
  trustThreshold: number // Minimum trust to trigger influence
  effects: EnvironmentalEffect[]
}

/**
 * Single environmental effect
 */
export interface EnvironmentalEffect {
  trigger: 'trust_reached' | 'loyalty_complete' | 'arc_complete'
  triggerValue?: number // For trust_reached
  effect: string
  visualDescription: string
  platformAffected?: string // Specific platform, or 'all'
  warmthChange?: number // -5 to 5
  accessibilityChange?: boolean
}

/**
 * Character influence registry
 */
export const CHARACTER_INFLUENCES: CharacterInfluence[] = [
  // Infrastructure characters
  {
    characterId: 'devon',
    domain: 'infrastructure',
    description: 'Devon maintains station systems - high trust means smoother operations',
    trustThreshold: 6,
    effects: [
      {
        trigger: 'trust_reached',
        triggerValue: 6,
        effect: 'station_systems_stable',
        visualDescription: 'The station hums with quiet efficiency. Fewer glitches, steadier lights.',
        warmthChange: 1
      },
      {
        trigger: 'loyalty_complete',
        effect: 'deep_systems_access',
        visualDescription: 'Devon has given you access to the deeper maintenance tunnels.',
        accessibilityChange: true,
        platformAffected: 'forgotten'
      }
    ]
  },
  {
    characterId: 'silas',
    domain: 'infrastructure',
    description: 'Silas repairs and maintains - high trust means functional equipment',
    trustThreshold: 6,
    effects: [
      {
        trigger: 'trust_reached',
        triggerValue: 6,
        effect: 'equipment_functional',
        visualDescription: 'Old machinery starts working again. Rusted gates now open smoothly.',
        warmthChange: 1
      },
      {
        trigger: 'arc_complete',
        effect: 'hidden_workshops_revealed',
        visualDescription: 'Silas shows you his hidden workshops throughout the station.'
      }
    ]
  },

  // Aesthetics characters
  {
    characterId: 'asha',
    domain: 'aesthetics',
    description: 'Asha\'s murals bring color and meaning to spaces',
    trustThreshold: 5,
    effects: [
      {
        trigger: 'trust_reached',
        triggerValue: 5,
        effect: 'murals_appear',
        visualDescription: 'New murals appear on previously bare walls. Colors that weren\'t there before.',
        warmthChange: 2
      },
      {
        trigger: 'loyalty_complete',
        effect: 'personal_mural',
        visualDescription: 'Asha has painted a mural that captures your journey through the station.'
      }
    ]
  },
  {
    characterId: 'lira',
    domain: 'atmosphere',
    description: 'Lira\'s compositions fill the station with sound',
    trustThreshold: 5,
    effects: [
      {
        trigger: 'trust_reached',
        triggerValue: 5,
        effect: 'ambient_music',
        visualDescription: 'Soft melodies drift through the corridors. The station breathes with rhythm.',
        warmthChange: 1
      },
      {
        trigger: 'loyalty_complete',
        effect: 'memory_song_plays',
        visualDescription: 'Lira\'s Memory Song echoes through the station at meaningful moments.'
      }
    ]
  },

  // Secrets characters
  {
    characterId: 'rohan',
    domain: 'secrets',
    description: 'Rohan knows the station\'s hidden truths',
    trustThreshold: 7,
    effects: [
      {
        trigger: 'trust_reached',
        triggerValue: 7,
        effect: 'hidden_passages_revealed',
        visualDescription: 'You start noticing doors that weren\'t there before. Rohan nods knowingly.'
      },
      {
        trigger: 'loyalty_complete',
        effect: 'truth_unveiled',
        visualDescription: 'Rohan has shown you what lies beneath the station\'s surface.'
      }
    ]
  },
  {
    characterId: 'samuel',
    domain: 'secrets',
    description: 'Samuel is the station\'s keeper - his trust opens doors',
    trustThreshold: 8,
    effects: [
      {
        trigger: 'trust_reached',
        triggerValue: 8,
        effect: 'conductor_secrets',
        visualDescription: 'Samuel begins showing you things no one else sees.',
        accessibilityChange: true,
        platformAffected: 'p7'
      },
      {
        trigger: 'loyalty_complete',
        effect: 'station_responds',
        visualDescription: 'The station itself seems to recognize you now.'
      }
    ]
  },

  // Commerce characters
  {
    characterId: 'tess',
    domain: 'commerce',
    description: 'Tess influences trade and exchange in the market',
    trustThreshold: 5,
    effects: [
      {
        trigger: 'trust_reached',
        triggerValue: 5,
        effect: 'better_trades',
        visualDescription: 'Merchants treat you better. Tess has put in a good word.'
      },
      {
        trigger: 'arc_complete',
        effect: 'tess_network',
        visualDescription: 'You\'re part of Tess\'s network now. Doors open that were closed.'
      }
    ]
  }
]

/**
 * Get active environmental effects for current game state
 */
export function getActiveEnvironmentalEffects(gameState: GameState): EnvironmentalEffect[] {
  const activeEffects: EnvironmentalEffect[] = []

  CHARACTER_INFLUENCES.forEach(influence => {
    const charState = gameState.characters.get(influence.characterId)
    if (!charState) return

    influence.effects.forEach(effect => {
      let isActive = false

      switch (effect.trigger) {
        case 'trust_reached':
          isActive = charState.trust >= (effect.triggerValue ?? influence.trustThreshold)
          break
        case 'loyalty_complete':
          isActive = gameState.globalFlags.has(`${influence.characterId}_loyalty_complete`)
          break
        case 'arc_complete':
          isActive = gameState.globalFlags.has(`${influence.characterId}_arc_complete`)
          break
      }

      if (isActive) {
        activeEffects.push(effect)
      }
    })
  })

  return activeEffects
}

/**
 * Calculate total warmth modifier from character influences
 */
export function calculateCharacterWarmthModifier(gameState: GameState): number {
  return getActiveEnvironmentalEffects(gameState)
    .filter(e => e.warmthChange !== undefined)
    .reduce((total, e) => total + (e.warmthChange ?? 0), 0)
}

/**
 * Get newly unlocked platforms from character influences
 */
export function getUnlockedPlatforms(gameState: GameState): string[] {
  return getActiveEnvironmentalEffects(gameState)
    .filter(e => e.accessibilityChange && e.platformAffected)
    .map(e => e.platformAffected!)
}

// ═══════════════════════════════════════════════════════════════════════════
// D-017: CROSS-CHARACTER LOYALTY EXPERIENCE PREREQUISITES
// Some loyalty experiences require relationships with multiple characters
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross-character requirement definition
 */
export interface CrossCharacterRequirement {
  experienceId: string
  experienceName: string
  characterId: CharacterId
  description: string
  requirements: {
    characterId: CharacterId
    minTrust: number
    relationshipStatus?: 'stranger' | 'acquaintance' | 'confidant'
    requiredFlags?: string[]
  }[]
  conflictingCharacters?: CharacterId[] // Can't be close to these
  unlockHint: string
}

/**
 * Cross-character loyalty requirements registry
 */
export const CROSS_CHARACTER_REQUIREMENTS: CrossCharacterRequirement[] = [
  {
    experienceId: 'the_mediation',
    experienceName: 'The Mediation',
    characterId: 'jordan',
    description: 'Help Jordan mediate a conflict between two characters who need to work together',
    requirements: [
      { characterId: 'maya', minTrust: 5 },
      { characterId: 'devon', minTrust: 5 }
    ],
    unlockHint: 'Jordan mentions needing to bridge a gap between the tech team...'
  },
  {
    experienceId: 'the_council',
    experienceName: 'The Council',
    characterId: 'samuel',
    description: 'Samuel invites you to a gathering of station leaders',
    requirements: [
      { characterId: 'tess', minTrust: 6 },
      { characterId: 'marcus', minTrust: 6 },
      { characterId: 'rohan', minTrust: 6 }
    ],
    unlockHint: 'You\'ll need to earn trust from those who guide this station...'
  },
  {
    experienceId: 'the_collaboration',
    experienceName: 'The Collaboration',
    characterId: 'maya',
    description: 'Maya needs you to help coordinate multiple teams',
    requirements: [
      { characterId: 'devon', minTrust: 6, requiredFlags: ['devon_arc_complete'] },
      { characterId: 'yaquin', minTrust: 5 }
    ],
    unlockHint: 'Maya is planning something big that will need everyone...'
  },
  {
    experienceId: 'the_diagnosis',
    experienceName: 'The Diagnosis',
    characterId: 'marcus',
    description: 'Marcus faces a case requiring multiple perspectives',
    requirements: [
      { characterId: 'grace', minTrust: 6 },
      { characterId: 'zara', minTrust: 5 }
    ],
    unlockHint: 'Marcus mutters about needing both heart and logic...'
  },
  {
    experienceId: 'the_symphony',
    experienceName: 'The Symphony',
    characterId: 'lira',
    description: 'Lira wants to compose something that captures everyone',
    requirements: [
      { characterId: 'asha', minTrust: 6 },
      { characterId: 'elena', minTrust: 5 },
      { characterId: 'samuel', minTrust: 5 }
    ],
    unlockHint: 'Lira speaks of a piece that needs many voices...'
  },
  {
    experienceId: 'the_choice',
    experienceName: 'The Choice',
    characterId: 'rohan',
    description: 'Rohan presents you with conflicting truths from different sources',
    requirements: [
      { characterId: 'maya', minTrust: 7 },
      { characterId: 'devon', minTrust: 7 }
    ],
    conflictingCharacters: ['zara'], // If too close to Zara, different experience
    unlockHint: 'Rohan has been comparing notes with others...'
  }
]

/**
 * Check if a cross-character loyalty experience is unlocked
 */
export function isCrossCharacterExperienceUnlocked(
  requirementId: string,
  gameState: GameState
): { unlocked: boolean; missingRequirements: string[] } {
  const requirement = CROSS_CHARACTER_REQUIREMENTS.find(r => r.experienceId === requirementId)
  if (!requirement) {
    return { unlocked: false, missingRequirements: ['Unknown requirement'] }
  }

  const missingRequirements: string[] = []

  // Check all required characters
  requirement.requirements.forEach(req => {
    const charState = gameState.characters.get(req.characterId)
    if (!charState) {
      missingRequirements.push(`Missing relationship with ${req.characterId}`)
      return
    }

    if (charState.trust < req.minTrust) {
      missingRequirements.push(`Need trust ${req.minTrust}+ with ${req.characterId} (currently ${charState.trust})`)
    }

    if (req.relationshipStatus && charState.relationshipStatus !== req.relationshipStatus) {
      missingRequirements.push(`Need ${req.relationshipStatus} status with ${req.characterId}`)
    }

    if (req.requiredFlags) {
      req.requiredFlags.forEach(flag => {
        if (!gameState.globalFlags.has(flag)) {
          missingRequirements.push(`Missing flag: ${flag}`)
        }
      })
    }
  })

  // Check conflicting characters
  if (requirement.conflictingCharacters) {
    requirement.conflictingCharacters.forEach(conflictId => {
      const charState = gameState.characters.get(conflictId)
      if (charState && charState.trust >= 8) {
        missingRequirements.push(`Too close to ${conflictId} for this path`)
      }
    })
  }

  return {
    unlocked: missingRequirements.length === 0,
    missingRequirements
  }
}

/**
 * Get all available cross-character experiences for current state
 */
export function getAvailableCrossCharacterExperiences(
  gameState: GameState
): CrossCharacterRequirement[] {
  return CROSS_CHARACTER_REQUIREMENTS.filter(req => {
    const { unlocked } = isCrossCharacterExperienceUnlocked(req.experienceId, gameState)
    // Check not already completed
    const completed = gameState.globalFlags.has(`${req.experienceId}_complete`)
    return unlocked && !completed
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// D-018: SECTOR-SPECIFIC CHARACTER APPEARANCES
// Characters appear in different sectors based on their roles and state
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sector types in the station
 */
export type SectorId = 'hub' | 'market' | 'deep_station' | 'platforms' | 'workshops' | 'archives'

/**
 * Character location configuration
 */
export interface CharacterLocation {
  characterId: CharacterId
  primarySector: SectorId
  secondarySectors: SectorId[]
  conditions?: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
    requiredFlags?: string[]
    minTrust?: number
  }
  description: string
}

/**
 * Character location registry - where each character can be found
 */
export const CHARACTER_LOCATIONS: CharacterLocation[] = [
  // Hub Characters (always accessible)
  {
    characterId: 'samuel',
    primarySector: 'hub',
    secondarySectors: ['deep_station'],
    conditions: { timeOfDay: 'night' }, // Deep station at night only
    description: 'Samuel tends the station from the central hub'
  },
  {
    characterId: 'jordan',
    primarySector: 'hub',
    secondarySectors: ['market'],
    description: 'Jordan guides newcomers and helps with directions'
  },

  // Market Characters
  {
    characterId: 'tess',
    primarySector: 'market',
    secondarySectors: ['hub'],
    description: 'Tess runs the education stall in the market'
  },
  {
    characterId: 'alex',
    primarySector: 'market',
    secondarySectors: ['workshops'],
    description: 'Alex handles logistics between market and workshops'
  },

  // Workshop Characters
  {
    characterId: 'silas',
    primarySector: 'workshops',
    secondarySectors: ['platforms'],
    description: 'Silas works in the maintenance workshops'
  },
  {
    characterId: 'devon',
    primarySector: 'workshops',
    secondarySectors: ['deep_station'],
    conditions: { requiredFlags: ['devon_arc_complete'] },
    description: 'Devon maintains the station\'s systems'
  },

  // Platform Characters
  {
    characterId: 'maya',
    primarySector: 'platforms',
    secondarySectors: ['workshops'],
    description: 'Maya works on her tech projects near the platforms'
  },
  {
    characterId: 'yaquin',
    primarySector: 'platforms',
    secondarySectors: ['market'],
    description: 'Yaquin develops educational content'
  },

  // Deep Station Characters
  {
    characterId: 'rohan',
    primarySector: 'deep_station',
    secondarySectors: ['archives'],
    conditions: { minTrust: 4 },
    description: 'Rohan researches in the quieter depths'
  },
  {
    characterId: 'marcus',
    primarySector: 'deep_station',
    secondarySectors: ['hub'],
    description: 'Marcus handles security and medical matters'
  },

  // Archive Characters
  {
    characterId: 'elena',
    primarySector: 'archives',
    secondarySectors: ['deep_station'],
    description: 'Elena studies patterns in the old records'
  },
  {
    characterId: 'zara',
    primarySector: 'archives',
    secondarySectors: ['hub'],
    description: 'Zara audits systems and maintains ethical standards'
  },

  // Wandering Artists
  {
    characterId: 'asha',
    primarySector: 'platforms',
    secondarySectors: ['market', 'hub'],
    description: 'Asha paints wherever inspiration strikes'
  },
  {
    characterId: 'lira',
    primarySector: 'deep_station',
    secondarySectors: ['archives', 'platforms'],
    description: 'Lira finds melodies in the station\'s quieter corners'
  },

  // Support Characters
  {
    characterId: 'grace',
    primarySector: 'hub',
    secondarySectors: ['deep_station'],
    description: 'Grace cares for those who need it most'
  },
  {
    characterId: 'kai',
    primarySector: 'workshops',
    secondarySectors: ['platforms'],
    description: 'Kai ensures everything meets safety standards'
  }
]

/**
 * Get characters available in a specific sector
 */
export function getCharactersInSector(
  sectorId: SectorId,
  gameState: GameState,
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
): CharacterId[] {
  const availableCharacters: CharacterId[] = []

  CHARACTER_LOCATIONS.forEach(location => {
    // Check if this is their primary sector or secondary
    const isPrimary = location.primarySector === sectorId
    const isSecondary = location.secondarySectors.includes(sectorId)

    if (!isPrimary && !isSecondary) return

    // Check conditions
    if (location.conditions) {
      // Time condition
      if (location.conditions.timeOfDay && location.conditions.timeOfDay !== timeOfDay) {
        // Secondary sector with wrong time - skip
        if (isSecondary) return
      }

      // Flag conditions
      if (location.conditions.requiredFlags) {
        const hasAllFlags = location.conditions.requiredFlags.every(
          flag => gameState.globalFlags.has(flag)
        )
        if (!hasAllFlags) return
      }

      // Trust condition
      if (location.conditions.minTrust) {
        const charState = gameState.characters.get(location.characterId)
        if (!charState || charState.trust < location.conditions.minTrust) return
      }
    }

    availableCharacters.push(location.characterId)
  })

  return availableCharacters
}

/**
 * Get sector for a character based on current state
 */
export function getCharacterCurrentSector(
  characterId: CharacterId,
  _gameState: GameState
): SectorId {
  const location = CHARACTER_LOCATIONS.find(l => l.characterId === characterId)
  return location?.primarySector ?? 'hub'
}

// ═══════════════════════════════════════════════════════════════════════════
// D-063: CHARACTER RELATIONSHIP DRAMA
// Characters compete for player attention and may conflict
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Character tension pair
 */
export interface CharacterTension {
  characters: [CharacterId, CharacterId]
  nature: 'rivalry' | 'history' | 'philosophical' | 'professional'
  description: string
  triggersAt: { bothTrust: number } // When both characters reach this trust
  dialogueFlags: {
    characterA: string // Flag set when A mentions tension
    characterB: string // Flag set when B mentions tension
    playerAware: string // Set when player knows about tension
  }
}

/**
 * Character tension registry
 */
export const CHARACTER_TENSIONS: CharacterTension[] = [
  {
    characters: ['maya', 'devon'],
    nature: 'professional',
    description: 'Maya moves fast, Devon wants stability. They clash on project timelines.',
    triggersAt: { bothTrust: 6 },
    dialogueFlags: {
      characterA: 'maya_devon_tension_mentioned',
      characterB: 'devon_maya_tension_mentioned',
      playerAware: 'player_knows_maya_devon_tension'
    }
  },
  {
    characters: ['rohan', 'zara'],
    nature: 'philosophical',
    description: 'Rohan pursues truth at all costs. Zara believes some truths need careful handling.',
    triggersAt: { bothTrust: 7 },
    dialogueFlags: {
      characterA: 'rohan_zara_tension_mentioned',
      characterB: 'zara_rohan_tension_mentioned',
      playerAware: 'player_knows_rohan_zara_tension'
    }
  },
  {
    characters: ['marcus', 'grace'],
    nature: 'professional',
    description: 'Marcus prioritizes systematic triage. Grace believes every case deserves full attention.',
    triggersAt: { bothTrust: 6 },
    dialogueFlags: {
      characterA: 'marcus_grace_tension_mentioned',
      characterB: 'grace_marcus_tension_mentioned',
      playerAware: 'player_knows_marcus_grace_tension'
    }
  },
  {
    characters: ['kai', 'silas'],
    nature: 'professional',
    description: 'Kai enforces standards. Silas bends them to get things working.',
    triggersAt: { bothTrust: 5 },
    dialogueFlags: {
      characterA: 'kai_silas_tension_mentioned',
      characterB: 'silas_kai_tension_mentioned',
      playerAware: 'player_knows_kai_silas_tension'
    }
  },
  {
    characters: ['asha', 'elena'],
    nature: 'philosophical',
    description: 'Asha creates from emotion. Elena seeks patterns behind everything.',
    triggersAt: { bothTrust: 6 },
    dialogueFlags: {
      characterA: 'asha_elena_tension_mentioned',
      characterB: 'elena_asha_tension_mentioned',
      playerAware: 'player_knows_asha_elena_tension'
    }
  }
]

/**
 * Check which tensions are active (both characters at threshold)
 */
export function getActiveTensions(gameState: GameState): CharacterTension[] {
  return CHARACTER_TENSIONS.filter(tension => {
    const [charA, charB] = tension.characters
    const stateA = gameState.characters.get(charA)
    const stateB = gameState.characters.get(charB)

    if (!stateA || !stateB) return false

    return stateA.trust >= tension.triggersAt.bothTrust &&
           stateB.trust >= tension.triggersAt.bothTrust
  })
}

/**
 * Check if getting closer to one character affects another
 */
export function checkForJealousyTrigger(
  characterId: CharacterId,
  newTrust: number,
  gameState: GameState
): { triggeredCharacter: CharacterId; message: string } | null {
  // Find tensions involving this character
  const relevantTensions = CHARACTER_TENSIONS.filter(t =>
    t.characters.includes(characterId)
  )

  for (const tension of relevantTensions) {
    const otherChar = tension.characters.find(c => c !== characterId)!
    const otherState = gameState.characters.get(otherChar)

    if (!otherState) continue

    // Jealousy triggers when:
    // 1. Player is getting close to one character (trust >= 7)
    // 2. The other character also has high trust (>= 6)
    // 3. The tension is known to the player
    if (
      newTrust >= 7 &&
      otherState.trust >= 6 &&
      gameState.globalFlags.has(tension.dialogueFlags.playerAware)
    ) {
      return {
        triggeredCharacter: otherChar,
        message: `${otherChar} notices how close you're getting to ${characterId}...`
      }
    }
  }

  return null
}

/**
 * Drama event that can be triggered
 */
export interface DramaEvent {
  id: string
  tension: CharacterTension
  type: 'confrontation' | 'choice_required' | 'mediation_opportunity'
  description: string
}

/**
 * Get pending drama events based on current state
 */
export function getPendingDramaEvents(gameState: GameState): DramaEvent[] {
  const events: DramaEvent[] = []
  const activeTensions = getActiveTensions(gameState)

  activeTensions.forEach(tension => {
    const [charA, charB] = tension.characters
    const playerAware = gameState.globalFlags.has(tension.dialogueFlags.playerAware)
    const bothMentioned = gameState.globalFlags.has(tension.dialogueFlags.characterA) &&
                         gameState.globalFlags.has(tension.dialogueFlags.characterB)

    if (playerAware && bothMentioned) {
      // Check trust levels to determine event type
      const stateA = gameState.characters.get(charA)!
      const stateB = gameState.characters.get(charB)!
      const trustDiff = Math.abs(stateA.trust - stateB.trust)

      if (trustDiff >= 3) {
        events.push({
          id: `choice_${charA}_${charB}`,
          tension,
          type: 'choice_required',
          description: `${charA} and ${charB} are pulling you in different directions...`
        })
      } else {
        events.push({
          id: `mediation_${charA}_${charB}`,
          tension,
          type: 'mediation_opportunity',
          description: `Perhaps you could help ${charA} and ${charB} understand each other...`
        })
      }
    }
  })

  return events
}

// ═══════════════════════════════════════════════════════════════════════════
// D-095: MULTI-CHARACTER SIMULTANEOUS INTERACTIONS
// Conversations with 3+ characters at once
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Multi-character scene definition
 */
export interface MultiCharacterScene {
  id: string
  name: string
  description: string
  participants: CharacterId[]
  location: SectorId
  requirements: {
    minTrustWithAll: number
    requiredFlags?: string[]
    minPatterns?: Partial<PlayerPatterns>
  }
  topic: string
  dynamics: SceneDynamic[]
  outcomes: SceneOutcome[]
}

/**
 * How characters interact within the scene
 */
export interface SceneDynamic {
  speaker: CharacterId
  agrees: CharacterId[]
  disagrees: CharacterId[]
  position: string
}

/**
 * Possible outcomes based on player mediation
 */
export interface SceneOutcome {
  id: string
  condition: 'consensus' | 'side_with_majority' | 'side_with_minority' | 'abstain'
  description: string
  trustChanges: { characterId: CharacterId; change: number }[]
  flagSet: string
}

/**
 * Multi-character scenes registry
 */
export const MULTI_CHARACTER_SCENES: MultiCharacterScene[] = [
  {
    id: 'tech_ethics_debate',
    name: 'The Tech Ethics Debate',
    description: 'Maya, Devon, and Rohan debate the station\'s technology direction',
    participants: ['maya', 'devon', 'rohan'],
    location: 'platforms',
    requirements: {
      minTrustWithAll: 5,
      minPatterns: { analytical: 3 }
    },
    topic: 'Should the station adopt Maya\'s new system?',
    dynamics: [
      {
        speaker: 'maya',
        agrees: [],
        disagrees: ['devon'],
        position: 'We need to innovate or fall behind'
      },
      {
        speaker: 'devon',
        agrees: [],
        disagrees: ['maya'],
        position: 'Stability matters more than speed'
      },
      {
        speaker: 'rohan',
        agrees: [],
        disagrees: [],
        position: 'There\'s data we\'re not seeing that matters here'
      }
    ],
    outcomes: [
      {
        id: 'maya_wins',
        condition: 'side_with_majority',
        description: 'The station moves forward with Maya\'s vision',
        trustChanges: [
          { characterId: 'maya', change: 2 },
          { characterId: 'devon', change: -1 },
          { characterId: 'rohan', change: 0 }
        ],
        flagSet: 'tech_debate_maya_won'
      },
      {
        id: 'compromise_reached',
        condition: 'consensus',
        description: 'You helped them find a middle ground',
        trustChanges: [
          { characterId: 'maya', change: 1 },
          { characterId: 'devon', change: 1 },
          { characterId: 'rohan', change: 2 }
        ],
        flagSet: 'tech_debate_compromise'
      }
    ]
  },
  {
    id: 'patient_case_conference',
    name: 'The Case Conference',
    description: 'Marcus, Grace, and Zara discuss a difficult patient case',
    participants: ['marcus', 'grace', 'zara'],
    location: 'deep_station',
    requirements: {
      minTrustWithAll: 6,
      minPatterns: { helping: 3, analytical: 2 }
    },
    topic: 'How do we handle a case where the protocol conflicts with compassion?',
    dynamics: [
      {
        speaker: 'marcus',
        agrees: ['zara'],
        disagrees: ['grace'],
        position: 'Protocol exists for a reason. We follow it.'
      },
      {
        speaker: 'grace',
        agrees: [],
        disagrees: ['marcus'],
        position: 'This person needs us to bend the rules.'
      },
      {
        speaker: 'zara',
        agrees: ['marcus'],
        disagrees: [],
        position: 'The rules protect everyone, including those who break them.'
      }
    ],
    outcomes: [
      {
        id: 'compassion_wins',
        condition: 'side_with_minority',
        description: 'You stood with Grace. The rules bent.',
        trustChanges: [
          { characterId: 'grace', change: 3 },
          { characterId: 'marcus', change: -1 },
          { characterId: 'zara', change: -1 }
        ],
        flagSet: 'case_compassion_won'
      },
      {
        id: 'protocol_upheld',
        condition: 'side_with_majority',
        description: 'The protocol held. Order maintained.',
        trustChanges: [
          { characterId: 'marcus', change: 1 },
          { characterId: 'zara', change: 1 },
          { characterId: 'grace', change: -1 }
        ],
        flagSet: 'case_protocol_won'
      }
    ]
  },
  {
    id: 'art_commission_meeting',
    name: 'The Commission',
    description: 'Asha, Lira, and Elena collaborate on a station project',
    participants: ['asha', 'lira', 'elena'],
    location: 'archives',
    requirements: {
      minTrustWithAll: 5,
      minPatterns: { exploring: 3 }
    },
    topic: 'What should the station\'s new artwork represent?',
    dynamics: [
      {
        speaker: 'asha',
        agrees: [],
        disagrees: ['elena'],
        position: 'Art should come from the heart, not analysis'
      },
      {
        speaker: 'elena',
        agrees: [],
        disagrees: ['asha'],
        position: 'There are patterns in what moves people. We should use them.'
      },
      {
        speaker: 'lira',
        agrees: ['asha', 'elena'],
        disagrees: [],
        position: 'The best art uses both - feeling guided by understanding'
      }
    ],
    outcomes: [
      {
        id: 'pure_emotion',
        condition: 'side_with_minority',
        description: 'Raw emotion won. The piece will move people.',
        trustChanges: [
          { characterId: 'asha', change: 2 },
          { characterId: 'elena', change: -1 },
          { characterId: 'lira', change: 0 }
        ],
        flagSet: 'art_emotion_approach'
      },
      {
        id: 'synthesis',
        condition: 'consensus',
        description: 'You helped them blend their approaches',
        trustChanges: [
          { characterId: 'asha', change: 1 },
          { characterId: 'elena', change: 1 },
          { characterId: 'lira', change: 2 }
        ],
        flagSet: 'art_synthesis_approach'
      }
    ]
  }
]

/**
 * Check if a multi-character scene is available
 */
export function isMultiCharacterSceneAvailable(
  sceneId: string,
  gameState: GameState
): { available: boolean; missing: string[] } {
  const scene = MULTI_CHARACTER_SCENES.find(s => s.id === sceneId)
  if (!scene) {
    return { available: false, missing: ['Scene not found'] }
  }

  const missing: string[] = []

  // Check trust with all participants
  scene.participants.forEach(charId => {
    const charState = gameState.characters.get(charId)
    if (!charState) {
      missing.push(`No relationship with ${charId}`)
    } else if (charState.trust < scene.requirements.minTrustWithAll) {
      missing.push(`Trust with ${charId}: ${charState.trust}/${scene.requirements.minTrustWithAll}`)
    }
  })

  // Check flags
  if (scene.requirements.requiredFlags) {
    scene.requirements.requiredFlags.forEach(flag => {
      if (!gameState.globalFlags.has(flag)) {
        missing.push(`Missing flag: ${flag}`)
      }
    })
  }

  // Check patterns
  if (scene.requirements.minPatterns) {
    Object.entries(scene.requirements.minPatterns).forEach(([pattern, min]) => {
      const patternKey = pattern as keyof PlayerPatterns
      if (gameState.patterns[patternKey] < min!) {
        missing.push(`${pattern} pattern: ${gameState.patterns[patternKey]}/${min}`)
      }
    })
  }

  // Check not already completed
  const outcomes = scene.outcomes.map(o => o.flagSet)
  const alreadyDone = outcomes.some(flag => gameState.globalFlags.has(flag))
  if (alreadyDone) {
    missing.push('Scene already completed')
  }

  return {
    available: missing.length === 0,
    missing
  }
}

/**
 * Get all available multi-character scenes
 */
export function getAvailableMultiCharacterScenes(
  gameState: GameState
): MultiCharacterScene[] {
  return MULTI_CHARACTER_SCENES.filter(scene => {
    const { available } = isMultiCharacterSceneAvailable(scene.id, gameState)
    return available
  })
}

/**
 * Calculate outcome for a multi-character scene
 */
export function resolveMultiCharacterScene(
  sceneId: string,
  playerChoice: 'consensus' | 'side_with_majority' | 'side_with_minority' | 'abstain'
): SceneOutcome | null {
  const scene = MULTI_CHARACTER_SCENES.find(s => s.id === sceneId)
  if (!scene) return null

  return scene.outcomes.find(o => o.condition === playerChoice) ?? null
}
