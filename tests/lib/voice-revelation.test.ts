/**
 * Tests for Voice Revelation System - "Surface the Magic"
 */

import { describe, it, expect } from 'vitest'
import {
  VOICE_REVELATION_ECHOES,
  getVoiceRevelationEcho,
  checkVoiceRevelationTrigger
} from '@/lib/consequence-echoes'
import type { PlayerPatterns } from '@/lib/character-state'

describe('VOICE_REVELATION_ECHOES', () => {
  it('has echoes for all 5 patterns', () => {
    expect(VOICE_REVELATION_ECHOES.analytical).toBeDefined()
    expect(VOICE_REVELATION_ECHOES.patience).toBeDefined()
    expect(VOICE_REVELATION_ECHOES.exploring).toBeDefined()
    expect(VOICE_REVELATION_ECHOES.helping).toBeDefined()
    expect(VOICE_REVELATION_ECHOES.building).toBeDefined()
  })

  it('each pattern has at least 2 echo variations', () => {
    const patterns: (keyof PlayerPatterns)[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

    for (const pattern of patterns) {
      expect(VOICE_REVELATION_ECHOES[pattern].length).toBeGreaterThanOrEqual(2)
    }
  })

  it('all echoes have required properties', () => {
    const patterns: (keyof PlayerPatterns)[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

    for (const pattern of patterns) {
      for (const echo of VOICE_REVELATION_ECHOES[pattern]) {
        expect(echo.text).toBeDefined()
        expect(echo.text.length).toBeGreaterThan(0)
        expect(echo.emotion).toBeDefined()
        expect(echo.timing).toBe('delayed')
      }
    }
  })

  it('echoes mention how others respond to player', () => {
    // Key insight: These echoes should surface that NPCs respond differently
    const patterns: (keyof PlayerPatterns)[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

    for (const pattern of patterns) {
      const allText = VOICE_REVELATION_ECHOES[pattern].map(e => e.text).join(' ')
      // Should mention "respond", "talk to you", "notice", or similar
      const mentionsResponse = /respond|talk to you|notice|sense|pick up|watch how/i.test(allText)
      expect(mentionsResponse).toBe(true)
    }
  })
})

describe('getVoiceRevelationEcho', () => {
  it('returns an echo for valid patterns', () => {
    const patterns: (keyof PlayerPatterns)[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

    for (const pattern of patterns) {
      const echo = getVoiceRevelationEcho(pattern)
      expect(echo).not.toBeNull()
      expect(echo?.text).toBeDefined()
    }
  })

  it('returns one of the available echoes', () => {
    const echoes = new Set<string>()

    // Sample multiple times to see variation
    for (let i = 0; i < 20; i++) {
      const echo = getVoiceRevelationEcho('analytical')
      if (echo) echoes.add(echo.text)
    }

    // Should have gotten at least one echo
    expect(echoes.size).toBeGreaterThan(0)
  })
})

describe('checkVoiceRevelationTrigger', () => {
  it('returns null when already revealed', () => {
    const oldPatterns: PlayerPatterns = { analytical: 4, patience: 2, exploring: 1, helping: 1, building: 1 }
    const newPatterns: PlayerPatterns = { analytical: 6, patience: 2, exploring: 1, helping: 1, building: 1 }

    const result = checkVoiceRevelationTrigger(oldPatterns, newPatterns, true)
    expect(result).toBeNull()
  })

  it('returns pattern when threshold crossed for dominant pattern', () => {
    const oldPatterns: PlayerPatterns = { analytical: 4, patience: 2, exploring: 1, helping: 1, building: 1 }
    const newPatterns: PlayerPatterns = { analytical: 6, patience: 2, exploring: 1, helping: 1, building: 1 }

    const result = checkVoiceRevelationTrigger(oldPatterns, newPatterns, false)
    expect(result).toBe('analytical')
  })

  it('returns null when threshold crossed but not dominant', () => {
    // Patience crosses threshold but analytical is higher
    const oldPatterns: PlayerPatterns = { analytical: 7, patience: 4, exploring: 1, helping: 1, building: 1 }
    const newPatterns: PlayerPatterns = { analytical: 7, patience: 5, exploring: 1, helping: 1, building: 1 }

    const result = checkVoiceRevelationTrigger(oldPatterns, newPatterns, false)
    expect(result).toBeNull()
  })

  it('returns null when no threshold crossed', () => {
    const oldPatterns: PlayerPatterns = { analytical: 3, patience: 2, exploring: 1, helping: 1, building: 1 }
    const newPatterns: PlayerPatterns = { analytical: 4, patience: 2, exploring: 1, helping: 1, building: 1 }

    const result = checkVoiceRevelationTrigger(oldPatterns, newPatterns, false)
    expect(result).toBeNull()
  })

  it('detects threshold crossing for each pattern', () => {
    const patterns: (keyof PlayerPatterns)[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

    for (const pattern of patterns) {
      const oldPatterns: PlayerPatterns = { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 }
      const newPatterns: PlayerPatterns = { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 }

      oldPatterns[pattern] = 4
      newPatterns[pattern] = 6

      const result = checkVoiceRevelationTrigger(oldPatterns, newPatterns, false)
      expect(result).toBe(pattern)
    }
  })

  it('handles tied patterns correctly', () => {
    // Two patterns at same level - neither should trigger
    const oldPatterns: PlayerPatterns = { analytical: 4, patience: 4, exploring: 1, helping: 1, building: 1 }
    const newPatterns: PlayerPatterns = { analytical: 5, patience: 5, exploring: 1, helping: 1, building: 1 }

    const result = checkVoiceRevelationTrigger(oldPatterns, newPatterns, false)
    expect(result).toBeNull()
  })
})
