/**
 * Tests for Trust System Derivatives
 * Feature IDs: D-003, D-005, D-010, D-039, D-057, D-082, D-093
 */

import { describe, it, expect } from 'vitest'
import {
  // D-003: Voice Tone
  getVoiceToneForTrust,
  formatVoiceWithTone,
  VOICE_TONE_MODIFIERS,

  // D-005: Trust Asymmetry
  calculateTrustAsymmetry,
  TRUST_ASYMMETRY,

  // D-010: Echo Intensity
  getEchoIntensity,
  formatEchoByIntensity,
  ECHO_INTENSITY_MODIFIERS,
  StoredEcho,

  // D-039: Trust Timeline
  createTrustTimeline,
  recordTrustChange,
  getTrustTrend,

  // D-057: Trust as Currency
  canAffordInfoTrade,
  calculateInfoTrustValue,
  INFO_TIER_TRUST_REQUIREMENTS,
  InfoTradeOffer,

  // D-082: Trust Momentum
  createTrustMomentum,
  updateTrustMomentum,
  getMomentumMultiplier,
  applyMomentumToTrustChange,
  MOMENTUM_CONFIG,

  // D-093: Trust Inheritance
  getCharacterRelationship,
  calculateInheritedTrust,
  getTrustRippleTargets,
  TRUST_TRANSFER_RATES
} from '@/lib/trust-derivatives'

import { TRUST_THRESHOLDS } from '@/lib/constants'

// ═══════════════════════════════════════════════════════════════════════════
// D-003: TRUST-BASED PATTERN VOICE TONE
// ═══════════════════════════════════════════════════════════════════════════

describe('D-003: Trust-Based Pattern Voice Tone', () => {
  it('returns whisper for low trust', () => {
    expect(getVoiceToneForTrust(0)).toBe('whisper')
    expect(getVoiceToneForTrust(3)).toBe('whisper')
  })

  it('returns speak for friendly trust', () => {
    expect(getVoiceToneForTrust(TRUST_THRESHOLDS.friendly)).toBe('speak')
    expect(getVoiceToneForTrust(5)).toBe('speak')
  })

  it('returns urge for trusted level', () => {
    expect(getVoiceToneForTrust(TRUST_THRESHOLDS.trusted)).toBe('urge')
    expect(getVoiceToneForTrust(7)).toBe('urge')
  })

  it('returns command for bonded level', () => {
    expect(getVoiceToneForTrust(TRUST_THRESHOLDS.bonded)).toBe('command')
  })

  it('formats voice with tone correctly', () => {
    const result = formatVoiceWithTone('analytical', 'Think carefully.', 10)
    expect(result.text).toContain('Weaver')
    expect(result.text).toContain('Think carefully.')
    expect(result.intensity).toBe(1.0)
  })

  it('whisper has lowest intensity', () => {
    const whisper = formatVoiceWithTone('patience', 'Wait.', 0)
    const command = formatVoiceWithTone('patience', 'Wait.', 10)
    expect(whisper.intensity).toBeLessThan(command.intensity)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-005: TRUST ASYMMETRY GAMEPLAY
// ═══════════════════════════════════════════════════════════════════════════

describe('D-005: Trust Asymmetry Gameplay', () => {
  it('detects no asymmetry for equal trust', () => {
    const result = calculateTrustAsymmetry(5, 5)
    expect(result.level).toBe('none')
    expect(result.delta).toBe(0)
  })

  it('detects minor asymmetry', () => {
    const result = calculateTrustAsymmetry(5, 3)
    expect(result.level).toBe('minor')
    expect(result.delta).toBe(2)
  })

  it('detects notable asymmetry', () => {
    const result = calculateTrustAsymmetry(8, 4)
    expect(result.level).toBe('notable')
    expect(result.delta).toBe(4)
  })

  it('detects major asymmetry', () => {
    const result = calculateTrustAsymmetry(10, 2)
    expect(result.level).toBe('major')
    expect(result.delta).toBe(8)
  })

  it('is symmetric - order does not matter', () => {
    const resultA = calculateTrustAsymmetry(10, 2)
    const resultB = calculateTrustAsymmetry(2, 10)
    expect(resultA.delta).toBe(resultB.delta)
    expect(resultA.level).toBe(resultB.level)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-010: CONSEQUENCE ECHO INTENSITY
// ═══════════════════════════════════════════════════════════════════════════

describe('D-010: Consequence Echo Intensity', () => {
  it('returns faded for very low trust', () => {
    expect(getEchoIntensity(0)).toBe('faded')
    expect(getEchoIntensity(2)).toBe('faded')
  })

  it('returns hazy for low trust', () => {
    expect(getEchoIntensity(3)).toBe('hazy')
    expect(getEchoIntensity(4)).toBe('hazy')
  })

  it('returns clear for medium trust', () => {
    expect(getEchoIntensity(5)).toBe('clear')
    expect(getEchoIntensity(6)).toBe('clear')
  })

  it('returns vivid for high trust', () => {
    expect(getEchoIntensity(7)).toBe('vivid')
    expect(getEchoIntensity(8)).toBe('vivid')
  })

  it('returns indelible for max trust', () => {
    expect(getEchoIntensity(9)).toBe('indelible')
    expect(getEchoIntensity(10)).toBe('indelible')
  })

  it('formats echo with appropriate detail', () => {
    const fadedEcho: StoredEcho = {
      id: 'test1',
      characterId: 'maya',
      nodeId: 'node1',
      choiceId: 'choice1',
      trustAtEvent: 1,
      intensity: 'faded',
      createdAt: Date.now(),
      lastTriggered: Date.now(),
      triggerCount: 1,
      echoText: 'You helped Maya.',
      detailedText: 'You helped Maya fix the robot when it broke.'
    }

    const vividEcho: StoredEcho = {
      ...fadedEcho,
      trustAtEvent: 8,
      intensity: 'vivid'
    }

    const fadedResult = formatEchoByIntensity(fadedEcho)
    const vividResult = formatEchoByIntensity(vividEcho)

    // Faded should have less detail
    expect(fadedResult.length).toBeLessThan(vividResult.length)
    expect(vividResult).toContain('robot')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-039: TRUST RELATIONSHIP TIMELINE
// ═══════════════════════════════════════════════════════════════════════════

describe('D-039: Trust Relationship Timeline', () => {
  it('creates empty timeline', () => {
    const timeline = createTrustTimeline('maya')
    expect(timeline.characterId).toBe('maya')
    expect(timeline.points).toHaveLength(0)
    expect(timeline.currentStreak).toBe(0)
  })

  it('records trust changes correctly', () => {
    let timeline = createTrustTimeline('maya')
    timeline = recordTrustChange(timeline, 3, 3, 'node1', 'First meeting')

    expect(timeline.points).toHaveLength(1)
    expect(timeline.peakTrust).toBe(3)
    expect(timeline.currentStreak).toBe(1)
  })

  it('tracks positive streaks', () => {
    let timeline = createTrustTimeline('maya')
    timeline = recordTrustChange(timeline, 2, 2, 'node1', 'Event 1')
    timeline = recordTrustChange(timeline, 4, 2, 'node2', 'Event 2')
    timeline = recordTrustChange(timeline, 6, 2, 'node3', 'Event 3')

    expect(timeline.currentStreak).toBe(3)
  })

  it('resets streak on negative change', () => {
    let timeline = createTrustTimeline('maya')
    timeline = recordTrustChange(timeline, 5, 5, 'node1', 'Event 1')
    timeline = recordTrustChange(timeline, 3, -2, 'node2', 'Conflict')

    expect(timeline.currentStreak).toBe(0)
  })

  it('calculates trend correctly', () => {
    let improving = createTrustTimeline('maya')
    improving = recordTrustChange(improving, 2, 2, 'n1', 'e1')
    improving = recordTrustChange(improving, 4, 2, 'n2', 'e2')
    expect(getTrustTrend(improving)).toBe('improving')

    // Need multiple declining changes to trigger declining trend
    let declining = createTrustTimeline('devon')
    declining = recordTrustChange(declining, 5, -2, 'n1', 'e1')
    declining = recordTrustChange(declining, 3, -2, 'n2', 'e2')
    expect(getTrustTrend(declining)).toBe('declining')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-057: TRUST AS SOCIAL CURRENCY
// ═══════════════════════════════════════════════════════════════════════════

describe('D-057: Trust as Social Currency', () => {
  const testOffer: InfoTradeOffer = {
    id: 'test_offer',
    characterId: 'maya',
    infoId: 'secret_1',
    tier: 'rare',
    trustRequired: 5,
    trustCost: 2,
    description: 'A rare piece of information',
    preview: 'Something about...',
    fullContent: 'The full secret revealed!'
  }

  it('cannot afford when trust too low', () => {
    const result = canAffordInfoTrade(3, testOffer)
    expect(result.canAfford).toBe(false)
    expect(result.reason).toContain('Requires trust level 5')
  })

  it('cannot afford when would go negative', () => {
    const lowCostOffer = { ...testOffer, trustCost: 6 }
    const result = canAffordInfoTrade(5, lowCostOffer)
    expect(result.canAfford).toBe(false)
    expect(result.reason).toContain('Not enough to spare')
  })

  it('can afford when requirements met', () => {
    const result = canAffordInfoTrade(7, testOffer)
    expect(result.canAfford).toBe(true)
    expect(result.reason).toBeUndefined()
  })

  it('calculates info value with trust multiplier', () => {
    const lowTrustValue = calculateInfoTrustValue('rare', 'maya', 3)
    const highTrustValue = calculateInfoTrustValue('rare', 'maya', 9)

    expect(highTrustValue).toBeGreaterThan(lowTrustValue)
  })

  it('info tiers have correct trust requirements', () => {
    expect(INFO_TIER_TRUST_REQUIREMENTS.common).toBe(0)
    expect(INFO_TIER_TRUST_REQUIREMENTS.legendary).toBe(9)
    expect(INFO_TIER_TRUST_REQUIREMENTS.rare).toBeLessThan(
      INFO_TIER_TRUST_REQUIREMENTS.secret
    )
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-082: TRUST MOMENTUM SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

describe('D-082: Trust Momentum System', () => {
  it('creates neutral momentum', () => {
    const momentum = createTrustMomentum('maya')
    expect(momentum.momentum).toBe(0)
    expect(momentum.consecutivePositive).toBe(0)
    expect(momentum.consecutiveNegative).toBe(0)
  })

  it('increases momentum on positive trust change', () => {
    let momentum = createTrustMomentum('maya')
    momentum = updateTrustMomentum(momentum, 2) // Positive change

    expect(momentum.momentum).toBeGreaterThan(0)
    expect(momentum.consecutivePositive).toBe(1)
  })

  it('decreases momentum on negative trust change', () => {
    let momentum = createTrustMomentum('maya')
    momentum = updateTrustMomentum(momentum, -2) // Negative change

    expect(momentum.momentum).toBeLessThan(0)
    expect(momentum.consecutiveNegative).toBe(1)
  })

  it('resets opposing streak on direction change', () => {
    let momentum = createTrustMomentum('maya')
    momentum = updateTrustMomentum(momentum, 2)
    momentum = updateTrustMomentum(momentum, 2)
    momentum = updateTrustMomentum(momentum, 2)
    expect(momentum.consecutivePositive).toBe(3)

    momentum = updateTrustMomentum(momentum, -1)
    expect(momentum.consecutivePositive).toBe(0)
    expect(momentum.consecutiveNegative).toBe(1)
  })

  it('momentum multiplier is within bounds', () => {
    const neutralMomentum = createTrustMomentum('maya')
    const multiplier = getMomentumMultiplier(neutralMomentum)

    expect(multiplier).toBeGreaterThanOrEqual(MOMENTUM_CONFIG.MIN_MULTIPLIER)
    expect(multiplier).toBeLessThanOrEqual(MOMENTUM_CONFIG.MAX_MULTIPLIER)
  })

  it('applies momentum to trust changes', () => {
    // High positive momentum should amplify positive changes
    const highMomentum = {
      characterId: 'maya',
      momentum: 0.8,
      consecutivePositive: 5,
      consecutiveNegative: 0,
      lastChangeAt: Date.now()
    }

    const amplifiedChange = applyMomentumToTrustChange(2, highMomentum)
    expect(amplifiedChange).toBeGreaterThan(2)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-093: TRUST RELATIONSHIP INHERITANCE
// ═══════════════════════════════════════════════════════════════════════════

describe('D-093: Trust Relationship Inheritance', () => {
  it('finds existing relationships', () => {
    const relationship = getCharacterRelationship('samuel', 'maya')
    expect(relationship).not.toBeNull()
    expect(relationship?.relationship).toBe('close_friend')
  })

  it('returns null for unrelated characters', () => {
    const relationship = getCharacterRelationship('maya', 'grace')
    expect(relationship).toBeNull()
  })

  it('relationship is bidirectional', () => {
    const relA = getCharacterRelationship('devon', 'kai')
    const relB = getCharacterRelationship('kai', 'devon')
    expect(relA).toEqual(relB)
  })

  it('calculates inherited trust from connections', () => {
    // Create mock character states with trust values
    // Devon is connected to kai (close_friend) and silas (friend)
    const characters = new Map([
      ['kai', { trust: 8 } as any],
      ['silas', { trust: 6 } as any]
    ])

    // Devon is connected to kai (close_friend: 0.5 transfer)
    const inheritedTrust = calculateInheritedTrust('devon', characters)
    // 8 * 0.5 (close_friend) + 6 * 0.25 (friend) = 4 + 1.5 = 5, but capped at 3
    expect(inheritedTrust).toBeGreaterThan(0)
  })

  it('inherited trust is capped at 3', () => {
    const characters = new Map([
      ['samuel', { trust: 10 } as any],
      ['maya', { trust: 10 } as any],
      ['marcus', { trust: 10 } as any]
    ])

    const inheritedTrust = calculateInheritedTrust('devon', characters)
    expect(inheritedTrust).toBeLessThanOrEqual(3)
  })

  it('calculates ripple targets correctly', () => {
    const ripples = getTrustRippleTargets('samuel', 4) // Samuel gains 4 trust

    expect(ripples.length).toBeGreaterThan(0)
    expect(ripples.some(r => r.characterId === 'maya')).toBe(true)
  })

  it('rival relationships create negative ripples', () => {
    const ripples = getTrustRippleTargets('rohan', 4)
    const mayaRipple = ripples.find(r => r.characterId === 'maya')

    expect(mayaRipple).toBeDefined()
    expect(mayaRipple?.expectedDelta).toBeLessThan(0)
  })

  it('trust transfer rates are correctly ordered', () => {
    expect(TRUST_TRANSFER_RATES.close_friend).toBeGreaterThan(
      TRUST_TRANSFER_RATES.friend
    )
    expect(TRUST_TRANSFER_RATES.friend).toBeGreaterThan(
      TRUST_TRANSFER_RATES.colleague
    )
    expect(TRUST_TRANSFER_RATES.stranger).toBe(0)
    expect(TRUST_TRANSFER_RATES.rival).toBeLessThan(0)
  })
})
