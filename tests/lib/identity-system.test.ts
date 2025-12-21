/**
 * Identity System Tests
 *
 * Verifies the Disco Elysium-style identity mechanics:
 * - Identity thought detection
 * - Pattern extraction
 * - Internalization bonuses
 */

import { describe, it, expect } from 'vitest'
import {
  isIdentityThought,
  extractPatternFromIdentity,
  calculatePatternGain,
  createIdentityOffer,
  IDENTITY_CONSTANTS
} from '@/lib/identity-system'
import type { GameState } from '@/lib/character-state'

// Mock game state factory
function createMockGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    saveVersion: '1.0.0',
    playerId: 'test',
    characters: new Map(),
    globalFlags: new Set(),
    patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
    lastSaved: Date.now(),
    currentNodeId: 'start',
    currentCharacterId: 'samuel',
    thoughts: [],
    episodeNumber: 1,
    sessionStartTime: Date.now(),
    sessionBoundariesCrossed: 0,
    platforms: {},
    careerValues: {
      directImpact: 0,
      systemsThinking: 0,
      dataInsights: 0,
      futureBuilding: 0,
      independence: 0
    },
    mysteries: {
      letterSender: 'unknown',
      platformSeven: 'flickering',
      samuelsPast: 'hidden',
      stationNature: 'unknown'
    },
    time: {
      currentDisplay: "12:00 PM",
      minutesRemaining: 10,
      flowRate: 1,
      isStopped: false
    },
    quietHour: {
      potential: false,
      experienced: []
    },
    items: {
      letter: 'kept',
      discoveredPaths: []
    },
    ...overrides
  } as GameState
}

describe('Identity System', () => {
  describe('isIdentityThought', () => {
    it('should return true for identity thoughts', () => {
      expect(isIdentityThought('identity-analytical')).toBe(true)
      expect(isIdentityThought('identity-patience')).toBe(true)
      expect(isIdentityThought('identity-exploring')).toBe(true)
    })

    it('should return false for non-identity thoughts', () => {
      expect(isIdentityThought('thought-1')).toBe(false)
      expect(isIdentityThought('analytical')).toBe(false)
      expect(isIdentityThought('')).toBe(false)
    })
  })

  describe('extractPatternFromIdentity', () => {
    it('should extract pattern from identity thought ID', () => {
      expect(extractPatternFromIdentity('identity-analytical')).toBe('analytical')
      expect(extractPatternFromIdentity('identity-patience')).toBe('patience')
      expect(extractPatternFromIdentity('identity-exploring')).toBe('exploring')
      expect(extractPatternFromIdentity('identity-helping')).toBe('helping')
      expect(extractPatternFromIdentity('identity-building')).toBe('building')
    })

    it('should return null for non-identity thoughts', () => {
      expect(extractPatternFromIdentity('thought-1')).toBe(null)
      expect(extractPatternFromIdentity('')).toBe(null)
    })
  })

  describe('createIdentityOffer', () => {
    it('should create valid identity offer', () => {
      const offer = createIdentityOffer('analytical')

      expect(offer.pattern).toBe('analytical')
      expect(offer.thoughtId).toBe('identity-analytical')
      expect(offer.internalizeBonus).toBe(IDENTITY_CONSTANTS.INTERNALIZE_BONUS)
      expect(offer.threshold).toBe(IDENTITY_CONSTANTS.OFFERING_THRESHOLD)
    })
  })

  describe('calculatePatternGain', () => {
    it('should return base gain when pattern not internalized', () => {
      const state = createMockGameState()
      const gain = calculatePatternGain(1, 'analytical', state)
      expect(gain).toBe(1)
    })

    it('should apply bonus when pattern is internalized', () => {
      const state = createMockGameState({
        thoughts: [{
          id: 'identity-analytical',
          status: 'internalized',
          lastUpdated: Date.now(),
          progress: 100
        } as any]
      })

      const gain = calculatePatternGain(1, 'analytical', state)
      expect(gain).toBe(1 * (1 + IDENTITY_CONSTANTS.INTERNALIZE_BONUS))
      expect(gain).toBe(1.2) // 1 + 20%
    })

    it('should not apply bonus for different patterns', () => {
      const state = createMockGameState({
        thoughts: [{
          id: 'identity-analytical',
          status: 'internalized',
          lastUpdated: Date.now(),
          progress: 100
        } as any]
      })

      // Patience pattern should not get analytical bonus
      const gain = calculatePatternGain(1, 'patience', state)
      expect(gain).toBe(1)
    })

    it('should not apply bonus for developing thoughts', () => {
      const state = createMockGameState({
        thoughts: [{
          id: 'identity-analytical',
          status: 'developing', // Not internalized yet
          lastUpdated: Date.now(),
          progress: 50
        } as any]
      })

      const gain = calculatePatternGain(1, 'analytical', state)
      expect(gain).toBe(1) // No bonus
    })
  })

  describe('IDENTITY_CONSTANTS', () => {
    it('should have expected threshold values', () => {
      expect(IDENTITY_CONSTANTS.OFFERING_THRESHOLD).toBe(5)
      expect(IDENTITY_CONSTANTS.INTERNALIZE_BONUS).toBe(0.20)
      expect(IDENTITY_CONSTANTS.DISCARD_PENALTY).toBe(0)
    })
  })
})
