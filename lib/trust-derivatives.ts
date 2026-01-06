/**
 * Trust System Derivatives
 * Feature IDs: D-003, D-005, D-010, D-039, D-057, D-082, D-093
 *
 * This module extends the core trust system with advanced mechanics:
 * - Pattern-based voice tone changes
 * - Trust asymmetry gameplay
 * - Consequence echo intensity
 * - Trust relationship timeline
 * - Trust as social currency
 * - Trust momentum system
 * - Trust relationship inheritance
 */

import { PatternType, PATTERN_METADATA } from './patterns'
import { PlayerPatterns, CharacterState, GameState } from './character-state'
import { TRUST_THRESHOLDS, MAX_TRUST, MIN_TRUST } from './constants'
import { CHARACTER_PATTERN_AFFINITIES, AffinityLevel, getPatternAffinityLevel } from './pattern-affinity'

// ═══════════════════════════════════════════════════════════════════════════
// D-003: TRUST-BASED PATTERN VOICE TONE
// Pattern voices change tone based on character trust
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Voice tone based on trust level
 */
export type VoiceTone = 'whisper' | 'speak' | 'urge' | 'command'

/**
 * Get voice tone based on trust level with a character
 */
export function getVoiceToneForTrust(trust: number): VoiceTone {
  if (trust >= TRUST_THRESHOLDS.bonded) return 'command'  // Trust 10
  if (trust >= TRUST_THRESHOLDS.trusted) return 'urge'     // Trust 6+
  if (trust >= TRUST_THRESHOLDS.friendly) return 'speak'   // Trust 4+
  return 'whisper'                                          // Trust 0-3
}

/**
 * Voice modifiers based on tone
 */
export const VOICE_TONE_MODIFIERS: Record<VoiceTone, {
  prefix: string
  suffix: string
  intensity: number
}> = {
  whisper: {
    prefix: '*barely audible*',
    suffix: '',
    intensity: 0.3
  },
  speak: {
    prefix: '',
    suffix: '',
    intensity: 0.6
  },
  urge: {
    prefix: '',
    suffix: '—listen.',
    intensity: 0.85
  },
  command: {
    prefix: '*with certainty*',
    suffix: '',
    intensity: 1.0
  }
}

/**
 * Format a pattern voice message based on trust-derived tone
 */
export function formatVoiceWithTone(
  pattern: PatternType,
  message: string,
  trust: number
): { text: string; intensity: number } {
  const tone = getVoiceToneForTrust(trust)
  const modifier = VOICE_TONE_MODIFIERS[tone]
  const metadata = PATTERN_METADATA[pattern]

  const text = [
    modifier.prefix,
    `[${metadata.label}]`,
    message,
    modifier.suffix
  ].filter(Boolean).join(' ')

  return { text: text.trim(), intensity: modifier.intensity }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-005: TRUST ASYMMETRY GAMEPLAY
// Characters react when trust is unbalanced
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Trust asymmetry thresholds
 */
export const TRUST_ASYMMETRY = {
  MINOR: 2,     // 2+ points difference - noticed
  NOTABLE: 4,   // 4+ points difference - commented on
  MAJOR: 6      // 6+ points difference - affects behavior
} as const

/**
 * Asymmetry reaction types
 */
export type AsymmetryReaction =
  | 'jealousy'        // Character feels player prefers others
  | 'curiosity'       // Character wonders why player trusts them more
  | 'concern'         // Character worried about player's other relationships
  | 'competition'     // Character tries to match the higher-trust relationship
  | 'withdrawal'      // Character pulls back due to feeling neglected

/**
 * Calculate trust asymmetry between two characters
 */
export function calculateTrustAsymmetry(
  characterATrust: number,
  characterBTrust: number
): { delta: number; level: 'none' | 'minor' | 'notable' | 'major' } {
  const delta = Math.abs(characterATrust - characterBTrust)

  if (delta >= TRUST_ASYMMETRY.MAJOR) return { delta, level: 'major' }
  if (delta >= TRUST_ASYMMETRY.NOTABLE) return { delta, level: 'notable' }
  if (delta >= TRUST_ASYMMETRY.MINOR) return { delta, level: 'minor' }
  return { delta, level: 'none' }
}

/**
 * Asymmetry comment templates
 */
export const ASYMMETRY_COMMENTS: Record<string, {
  jealousy: string[]
  curiosity: string[]
  concern: string[]
}> = {
  maya: {
    jealousy: [
      "I see you've been spending more time with others...",
      "Guess I'm not the only maker you've found."
    ],
    curiosity: [
      "Why do you keep coming back to me?",
      "Most people move on. You haven't. Why?"
    ],
    concern: [
      "Are things okay with the others? You seem... distant from them.",
      "You've been focusing a lot here. Is everything alright?"
    ]
  },
  samuel: {
    jealousy: [
      "The station notices where you spend your time.",
      "Every path you take leaves traces."
    ],
    curiosity: [
      "You trust me with much. I wonder why.",
      "What is it you see in an old station keeper?"
    ],
    concern: [
      "I sense discord in your other connections.",
      "Not all relationships can flourish. Choose wisely."
    ]
  },
  devon: {
    jealousy: [
      "You've found other systems to analyze, I see.",
      "I'm not the only optimizer in the station."
    ],
    curiosity: [
      "Your frequent visits are... unexpected.",
      "What data are you gathering from our conversations?"
    ],
    concern: [
      "Your relationship metrics seem skewed.",
      "Optimization requires balance across all nodes."
    ]
  }
}

/**
 * Get asymmetry comment for a character
 */
export function getAsymmetryComment(
  characterId: string,
  reaction: AsymmetryReaction,
  gameState: GameState
): string | null {
  const comments = ASYMMETRY_COMMENTS[characterId]
  if (!comments) return null

  const reactionComments = comments[reaction as keyof typeof comments]
  if (!reactionComments?.length) return null

  // Use a deterministic but varying selection based on game state
  const index = (gameState.lastSaved % reactionComments.length)
  return reactionComments[index]
}

/**
 * Analyze trust asymmetry across all characters
 */
export function analyzeTrustAsymmetry(
  characters: Map<string, CharacterState>,
  focusCharacterId: string
): {
  characterId: string
  asymmetry: ReturnType<typeof calculateTrustAsymmetry>
  direction: 'higher' | 'lower'
}[] {
  const focusChar = characters.get(focusCharacterId)
  if (!focusChar) return []

  const results: {
    characterId: string
    asymmetry: ReturnType<typeof calculateTrustAsymmetry>
    direction: 'higher' | 'lower'
  }[] = []

  characters.forEach((char, id) => {
    if (id === focusCharacterId) return
    // Skip sector/location entries
    if (['station_entry', 'grand_hall', 'market', 'deep_station'].includes(id)) return

    const asymmetry = calculateTrustAsymmetry(focusChar.trust, char.trust)
    if (asymmetry.level !== 'none') {
      results.push({
        characterId: id,
        asymmetry,
        direction: focusChar.trust > char.trust ? 'higher' : 'lower'
      })
    }
  })

  return results.sort((a, b) => b.asymmetry.delta - a.asymmetry.delta)
}

// ═══════════════════════════════════════════════════════════════════════════
// D-010: CONSEQUENCE ECHO INTENSITY
// High trust = vivid memories, low trust = vague
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Echo memory intensity levels
 */
export type EchoIntensity = 'faded' | 'hazy' | 'clear' | 'vivid' | 'indelible'

/**
 * Get echo intensity based on trust at time of event
 */
export function getEchoIntensity(trustAtEvent: number): EchoIntensity {
  if (trustAtEvent >= 9) return 'indelible'
  if (trustAtEvent >= 7) return 'vivid'
  if (trustAtEvent >= 5) return 'clear'
  if (trustAtEvent >= 3) return 'hazy'
  return 'faded'
}

/**
 * Echo intensity modifiers for consequence display
 */
export const ECHO_INTENSITY_MODIFIERS: Record<EchoIntensity, {
  prefix: string
  detailLevel: number  // 0-1, how much detail to include
  fadeDelay: number    // Sessions before echo fades one level
}> = {
  faded: {
    prefix: 'A distant memory stirs...',
    detailLevel: 0.2,
    fadeDelay: 2
  },
  hazy: {
    prefix: 'You recall something...',
    detailLevel: 0.4,
    fadeDelay: 4
  },
  clear: {
    prefix: 'You remember clearly...',
    detailLevel: 0.7,
    fadeDelay: 6
  },
  vivid: {
    prefix: 'The memory surfaces, sharp and bright...',
    detailLevel: 0.9,
    fadeDelay: 10
  },
  indelible: {
    prefix: 'This moment is etched into you forever...',
    detailLevel: 1.0,
    fadeDelay: Infinity // Never fades
  }
}

/**
 * Stored consequence echo with intensity tracking
 */
export interface StoredEcho {
  id: string
  characterId: string
  nodeId: string
  choiceId: string
  trustAtEvent: number
  intensity: EchoIntensity
  createdAt: number
  lastTriggered: number
  triggerCount: number
  echoText: string
  detailedText: string
}

/**
 * Format echo text based on intensity
 */
export function formatEchoByIntensity(echo: StoredEcho): string {
  const modifier = ECHO_INTENSITY_MODIFIERS[echo.intensity]

  // Calculate how much detail to show
  if (modifier.detailLevel >= 0.7) {
    return `${modifier.prefix} ${echo.detailedText}`
  } else if (modifier.detailLevel >= 0.4) {
    return `${modifier.prefix} ${echo.echoText}`
  } else {
    // Faded - just the prefix and minimal info
    return modifier.prefix
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-039: TRUST RELATIONSHIP TIMELINE
// Graph showing trust evolution over time
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Trust timeline data point
 */
export interface TrustTimelinePoint {
  timestamp: number
  trust: number
  event: string
  nodeId: string
  delta: number
}

/**
 * Trust timeline for a character
 */
export interface TrustTimeline {
  characterId: string
  points: TrustTimelinePoint[]
  peakTrust: number
  peakTimestamp: number
  lowestTrust: number
  lowestTimestamp: number
  currentStreak: number  // Sessions of consistent positive growth
}

/**
 * Create empty trust timeline
 */
export function createTrustTimeline(characterId: string): TrustTimeline {
  return {
    characterId,
    points: [],
    peakTrust: 0,
    peakTimestamp: 0,
    lowestTrust: MAX_TRUST,
    lowestTimestamp: 0,
    currentStreak: 0
  }
}

/**
 * Record a trust change in timeline
 */
export function recordTrustChange(
  timeline: TrustTimeline,
  newTrust: number,
  delta: number,
  nodeId: string,
  event: string
): TrustTimeline {
  const timestamp = Date.now()

  const point: TrustTimelinePoint = {
    timestamp,
    trust: newTrust,
    event,
    nodeId,
    delta
  }

  // Update streak
  let newStreak = timeline.currentStreak
  if (delta > 0) {
    newStreak = timeline.currentStreak + 1
  } else if (delta < 0) {
    newStreak = 0
  }

  return {
    characterId: timeline.characterId,
    points: [...timeline.points, point],
    peakTrust: newTrust > timeline.peakTrust ? newTrust : timeline.peakTrust,
    peakTimestamp: newTrust > timeline.peakTrust ? timestamp : timeline.peakTimestamp,
    lowestTrust: newTrust < timeline.lowestTrust ? newTrust : timeline.lowestTrust,
    lowestTimestamp: newTrust < timeline.lowestTrust ? timestamp : timeline.lowestTimestamp,
    currentStreak: newStreak
  }
}

/**
 * Get trust trend (improving, stable, declining)
 */
export function getTrustTrend(
  timeline: TrustTimeline,
  windowSize: number = 5
): 'improving' | 'stable' | 'declining' {
  if (timeline.points.length < 2) return 'stable'

  const recentPoints = timeline.points.slice(-windowSize)
  const totalDelta = recentPoints.reduce((sum, p) => sum + p.delta, 0)

  if (totalDelta > 1) return 'improving'
  if (totalDelta < -1) return 'declining'
  return 'stable'
}

// ═══════════════════════════════════════════════════════════════════════════
// D-057: TRUST AS SOCIAL CURRENCY
// High trust unlocks better information trades
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Information value tier
 */
export type InfoValueTier = 'common' | 'uncommon' | 'rare' | 'secret' | 'legendary'

/**
 * Trust required to access information tiers
 */
export const INFO_TIER_TRUST_REQUIREMENTS: Record<InfoValueTier, number> = {
  common: 0,
  uncommon: 3,
  rare: 5,
  secret: 7,
  legendary: 9
}

/**
 * Information trade offer
 */
export interface InfoTradeOffer {
  id: string
  characterId: string
  infoId: string
  tier: InfoValueTier
  trustRequired: number
  trustCost: number       // Trust spent when accepting
  description: string
  preview: string         // What player sees before unlocking
  fullContent: string     // What player gets after unlocking
}

/**
 * Check if player can afford an info trade
 */
export function canAffordInfoTrade(
  trust: number,
  offer: InfoTradeOffer
): { canAfford: boolean; reason?: string } {
  if (trust < offer.trustRequired) {
    return {
      canAfford: false,
      reason: `Requires trust level ${offer.trustRequired}. Current: ${trust}.`
    }
  }

  if (trust - offer.trustCost < 0) {
    return {
      canAfford: false,
      reason: `Would cost ${offer.trustCost} trust. Not enough to spare.`
    }
  }

  return { canAfford: true }
}

/**
 * Calculate trust value of information based on rarity and source
 */
export function calculateInfoTrustValue(
  tier: InfoValueTier,
  sourceCharacterId: string,
  sourceCharacterTrust: number
): number {
  const baseTrustValues: Record<InfoValueTier, number> = {
    common: 0,
    uncommon: 1,
    rare: 2,
    secret: 3,
    legendary: 5
  }

  const baseValue = baseTrustValues[tier]

  // High-trust sources provide more valuable info
  const trustMultiplier = sourceCharacterTrust >= 8 ? 1.5 :
    sourceCharacterTrust >= 5 ? 1.25 : 1.0

  return Math.floor(baseValue * trustMultiplier)
}

// ═══════════════════════════════════════════════════════════════════════════
// D-082: TRUST MOMENTUM SYSTEM
// Trust changes faster/slower based on momentum
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Momentum state for trust changes
 */
export interface TrustMomentum {
  characterId: string
  momentum: number        // -1.0 to 1.0 (negative = declining, positive = growing)
  consecutivePositive: number
  consecutiveNegative: number
  lastChangeAt: number
}

/**
 * Momentum multiplier bounds
 */
export const MOMENTUM_CONFIG = {
  MAX_MULTIPLIER: 1.5,    // +50% trust change at max momentum
  MIN_MULTIPLIER: 0.5,    // -50% trust change at min momentum
  DECAY_PER_SESSION: 0.1, // Momentum decays 10% per session without interaction
  POSITIVE_BOOST: 0.15,   // Each positive change boosts momentum
  NEGATIVE_BOOST: -0.2,   // Each negative change reduces momentum (faster than build)
  STREAK_THRESHOLD: 3     // Consecutive same-direction changes before bonus kicks in
} as const

/**
 * Create initial trust momentum
 */
export function createTrustMomentum(characterId: string): TrustMomentum {
  return {
    characterId,
    momentum: 0,
    consecutivePositive: 0,
    consecutiveNegative: 0,
    lastChangeAt: Date.now()
  }
}

/**
 * Update momentum based on trust change
 */
export function updateTrustMomentum(
  current: TrustMomentum,
  trustDelta: number
): TrustMomentum {
  const now = Date.now()

  // Calculate session decay (rough estimate: 1 session = 10 minutes)
  const sessionsSinceChange = Math.floor(
    (now - current.lastChangeAt) / (10 * 60 * 1000)
  )
  const decayedMomentum = current.momentum * Math.pow(
    1 - MOMENTUM_CONFIG.DECAY_PER_SESSION,
    sessionsSinceChange
  )

  // Update based on direction
  let newMomentum = decayedMomentum
  let newConsecPositive = current.consecutivePositive
  let newConsecNegative = current.consecutiveNegative

  if (trustDelta > 0) {
    newMomentum += MOMENTUM_CONFIG.POSITIVE_BOOST
    newConsecPositive++
    newConsecNegative = 0

    // Streak bonus
    if (newConsecPositive >= MOMENTUM_CONFIG.STREAK_THRESHOLD) {
      newMomentum += MOMENTUM_CONFIG.POSITIVE_BOOST * 0.5
    }
  } else if (trustDelta < 0) {
    newMomentum += MOMENTUM_CONFIG.NEGATIVE_BOOST
    newConsecNegative++
    newConsecPositive = 0

    // Streak penalty
    if (newConsecNegative >= MOMENTUM_CONFIG.STREAK_THRESHOLD) {
      newMomentum += MOMENTUM_CONFIG.NEGATIVE_BOOST * 0.5
    }
  }

  // Clamp momentum
  newMomentum = Math.max(-1, Math.min(1, newMomentum))

  return {
    characterId: current.characterId,
    momentum: newMomentum,
    consecutivePositive: newConsecPositive,
    consecutiveNegative: newConsecNegative,
    lastChangeAt: now
  }
}

/**
 * Get trust change multiplier from momentum
 */
export function getMomentumMultiplier(momentum: TrustMomentum): number {
  // Linear interpolation between MIN and MAX based on momentum
  const normalizedMomentum = (momentum.momentum + 1) / 2 // Convert -1..1 to 0..1
  return MOMENTUM_CONFIG.MIN_MULTIPLIER +
    normalizedMomentum * (MOMENTUM_CONFIG.MAX_MULTIPLIER - MOMENTUM_CONFIG.MIN_MULTIPLIER)
}

/**
 * Apply momentum to a trust change
 */
export function applyMomentumToTrustChange(
  baseDelta: number,
  momentum: TrustMomentum
): number {
  const multiplier = getMomentumMultiplier(momentum)
  return Math.round(baseDelta * multiplier)
}

// ═══════════════════════════════════════════════════════════════════════════
// D-093: TRUST RELATIONSHIP INHERITANCE
// Friends of trusted characters trust you faster
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Character relationship network (simplified for trust inheritance)
 */
export interface CharacterRelationship {
  characterA: string
  characterB: string
  relationship: 'close_friend' | 'friend' | 'colleague' | 'rival' | 'stranger'
  trustTransfer: number  // How much trust carries over (-1 to 1)
}

/**
 * Trust transfer rates based on relationship type
 */
export const TRUST_TRANSFER_RATES: Record<CharacterRelationship['relationship'], number> = {
  close_friend: 0.5,   // 50% of trust carries over
  friend: 0.25,        // 25% carries over
  colleague: 0.1,      // 10% carries over
  rival: -0.25,        // Negative transfer! They distrust who their rival trusts
  stranger: 0          // No transfer
}

/**
 * Character relationship network
 * Defines how trust flows between characters
 */
export const CHARACTER_RELATIONSHIPS: CharacterRelationship[] = [
  // Samuel's connections (the hub)
  { characterA: 'samuel', characterB: 'maya', relationship: 'close_friend', trustTransfer: 0.5 },
  { characterA: 'samuel', characterB: 'devon', relationship: 'colleague', trustTransfer: 0.1 },
  { characterA: 'samuel', characterB: 'marcus', relationship: 'friend', trustTransfer: 0.25 },
  { characterA: 'samuel', characterB: 'rohan', relationship: 'friend', trustTransfer: 0.25 },

  // Maya's connections
  { characterA: 'maya', characterB: 'devon', relationship: 'colleague', trustTransfer: 0.1 },
  { characterA: 'maya', characterB: 'asha', relationship: 'friend', trustTransfer: 0.25 },

  // Devon's connections
  { characterA: 'devon', characterB: 'kai', relationship: 'close_friend', trustTransfer: 0.5 },
  { characterA: 'devon', characterB: 'silas', relationship: 'friend', trustTransfer: 0.25 },

  // Marcus's connections
  { characterA: 'marcus', characterB: 'grace', relationship: 'close_friend', trustTransfer: 0.5 },
  { characterA: 'marcus', characterB: 'jordan', relationship: 'friend', trustTransfer: 0.25 },

  // Rohan's connections
  { characterA: 'rohan', characterB: 'elena', relationship: 'close_friend', trustTransfer: 0.5 },
  { characterA: 'rohan', characterB: 'yaquin', relationship: 'colleague', trustTransfer: 0.1 },

  // Tess's connections
  { characterA: 'tess', characterB: 'lira', relationship: 'close_friend', trustTransfer: 0.5 },
  { characterA: 'tess', characterB: 'zara', relationship: 'friend', trustTransfer: 0.25 },

  // Jordan's connections
  { characterA: 'jordan', characterB: 'alex', relationship: 'friend', trustTransfer: 0.25 },
  { characterA: 'jordan', characterB: 'yaquin', relationship: 'colleague', trustTransfer: 0.1 },

  // Rivalries
  { characterA: 'rohan', characterB: 'maya', relationship: 'rival', trustTransfer: -0.25 },
  { characterA: 'kai', characterB: 'alex', relationship: 'rival', trustTransfer: -0.25 }
]

/**
 * Get relationship between two characters
 */
export function getCharacterRelationship(
  charA: string,
  charB: string
): CharacterRelationship | null {
  return CHARACTER_RELATIONSHIPS.find(
    r => (r.characterA === charA && r.characterB === charB) ||
         (r.characterA === charB && r.characterB === charA)
  ) || null
}

/**
 * Calculate inherited trust bonus for a new character
 * based on existing relationships
 */
export function calculateInheritedTrust(
  targetCharacterId: string,
  characters: Map<string, CharacterState>
): number {
  let inheritedTrust = 0

  CHARACTER_RELATIONSHIPS
    .filter(r =>
      r.characterA === targetCharacterId ||
      r.characterB === targetCharacterId
    )
    .forEach(relationship => {
      const otherCharId = relationship.characterA === targetCharacterId
        ? relationship.characterB
        : relationship.characterA

      const otherChar = characters.get(otherCharId)
      if (!otherChar) return

      // Calculate trust transfer
      const transferRate = TRUST_TRANSFER_RATES[relationship.relationship]
      const transferred = Math.floor(otherChar.trust * transferRate)

      inheritedTrust += transferred
    })

  // Clamp to reasonable bounds
  return Math.max(MIN_TRUST, Math.min(3, inheritedTrust)) // Max inherited bonus is 3
}

/**
 * Get all characters who would be affected by a trust change
 * (for showing ripple effects)
 */
export function getTrustRippleTargets(
  changedCharacterId: string,
  trustDelta: number
): { characterId: string; expectedDelta: number }[] {
  const ripples: { characterId: string; expectedDelta: number }[] = []

  CHARACTER_RELATIONSHIPS
    .filter(r =>
      r.characterA === changedCharacterId ||
      r.characterB === changedCharacterId
    )
    .forEach(relationship => {
      const otherCharId = relationship.characterA === changedCharacterId
        ? relationship.characterB
        : relationship.characterA

      const transferRate = TRUST_TRANSFER_RATES[relationship.relationship]
      const rippleDelta = Math.floor(trustDelta * transferRate * 0.5) // Ripples are half strength

      if (rippleDelta !== 0) {
        ripples.push({
          characterId: otherCharId,
          expectedDelta: rippleDelta
        })
      }
    })

  return ripples
}
