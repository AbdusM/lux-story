/**
 * Tests for Pattern System Derivatives
 * Feature IDs: D-001, D-002, D-004, D-007, D-040, D-059, D-096
 */

import { describe, it, expect } from 'vitest'
import {
  // D-001: Trust Decay
  calculateTrustDecayRate,
  calculateCharacterTrustDecay,
  BASE_TRUST_DECAY_RATE,
  PATTERN_DECAY_MODIFIERS,

  // D-002: Pattern-Gated Trust Content
  checkPatternTrustGate,
  getUnlockedGates,
  PATTERN_TRUST_GATES,

  // D-004: Cross-Character Pattern Recognition
  getPatternRecognitionComments,
  PATTERN_RECOGNITION_COMMENTS,

  // D-007: Choice Pattern Previews
  getPatternPreviewStyles,
  getPatternHintText,
  DEFAULT_PATTERN_PREVIEW_CONFIG,

  // D-040: Pattern Evolution Heatmap
  createPatternEvolutionHistory,
  recordPatternEvolution,
  getPatternHeatmapData,

  // D-059: Achievement System
  getEarnedAchievements,
  checkNewAchievements,
  PATTERN_ACHIEVEMENTS,

  // D-096: Voice Conflicts
  shouldTriggerVoiceConflict,
  getActiveVoiceConflicts,
  VOICE_CONFLICTS,

  // Helpers
  calculatePatternBalance
} from '@/lib/pattern-derivatives'

import { PlayerPatterns } from '@/lib/character-state'
import { PATTERN_THRESHOLDS } from '@/lib/patterns'

// ═══════════════════════════════════════════════════════════════════════════
// D-001: PATTERN-INFLUENCED TRUST DECAY RATES
// ═══════════════════════════════════════════════════════════════════════════

describe('D-001: Pattern-Influenced Trust Decay Rates', () => {
  const createPatterns = (dominant: keyof PlayerPatterns, value: number): PlayerPatterns => ({
    analytical: 0,
    patience: 0,
    exploring: 0,
    helping: 0,
    building: 0,
    [dominant]: value
  })

  it('returns base rate when no dominant pattern', () => {
    const patterns: PlayerPatterns = {
      analytical: 1,
      patience: 1,
      exploring: 1,
      helping: 1,
      building: 1
    }
    const rate = calculateTrustDecayRate(patterns)
    expect(rate).toBe(BASE_TRUST_DECAY_RATE)
  })

  it('patience pattern reduces decay by 50%', () => {
    const patterns = createPatterns('patience', 5)
    const rate = calculateTrustDecayRate(patterns)
    expect(rate).toBe(BASE_TRUST_DECAY_RATE * PATTERN_DECAY_MODIFIERS.patience)
    expect(rate).toBeLessThan(BASE_TRUST_DECAY_RATE)
  })

  it('exploring pattern increases decay by 30%', () => {
    const patterns = createPatterns('exploring', 5)
    const rate = calculateTrustDecayRate(patterns)
    expect(rate).toBe(BASE_TRUST_DECAY_RATE * PATTERN_DECAY_MODIFIERS.exploring)
    expect(rate).toBeGreaterThan(BASE_TRUST_DECAY_RATE)
  })

  it('helping pattern reduces decay by 30%', () => {
    const patterns = createPatterns('helping', 5)
    const rate = calculateTrustDecayRate(patterns)
    expect(rate).toBe(BASE_TRUST_DECAY_RATE * PATTERN_DECAY_MODIFIERS.helping)
  })

  it('calculates character trust decay correctly', () => {
    const patterns = createPatterns('patience', 5)
    const decay = calculateCharacterTrustDecay(4, patterns) // 4 sessions absent
    // 4 sessions * (0.5 base * 0.5 patience modifier) = 4 * 0.25 = 1
    expect(decay).toBe(1)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-002: PATTERN-GATED TRUST CONTENT
// ═══════════════════════════════════════════════════════════════════════════

describe('D-002: Pattern-Gated Trust Content', () => {
  it('gate fails when trust is too low', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 10
    }
    const result = checkPatternTrustGate('maya_secret_workshop', 5, patterns) // Trust 5 < 8
    expect(result).toBe(false)
  })

  it('gate fails when pattern is too low', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 3 // Less than required 6
    }
    const result = checkPatternTrustGate('maya_secret_workshop', 10, patterns)
    expect(result).toBe(false)
  })

  it('gate passes when both requirements met', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 8
    }
    const result = checkPatternTrustGate('maya_secret_workshop', 10, patterns)
    expect(result).toBe(true)
  })

  it('returns false for non-existent gate', () => {
    const patterns: PlayerPatterns = {
      analytical: 10,
      patience: 10,
      exploring: 10,
      helping: 10,
      building: 10
    }
    const result = checkPatternTrustGate('nonexistent_gate', 10, patterns)
    expect(result).toBe(false)
  })

  it('getUnlockedGates returns correct gates for character', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 10,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const gates = getUnlockedGates('samuel', 10, patterns)
    expect(gates).toContain('samuel_true_past')
  })

  it('all gates have required fields', () => {
    Object.entries(PATTERN_TRUST_GATES).forEach(([id, gate]) => {
      expect(gate.trustMin).toBeGreaterThan(0)
      expect(gate.patternMin).toBeGreaterThan(0)
      expect(gate.pattern).toBeDefined()
      expect(gate.description).toBeDefined()
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-004: CROSS-CHARACTER PATTERN RECOGNITION
// ═══════════════════════════════════════════════════════════════════════════

describe('D-004: Cross-Character Pattern Recognition', () => {
  it('returns empty when pattern below threshold', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 2, // Below EMERGING (3)
      exploring: 0,
      helping: 0,
      building: 0
    }
    const comments = getPatternRecognitionComments('samuel', patterns)
    expect(comments).toHaveLength(0)
  })

  it('returns comment when pattern reaches threshold', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: PATTERN_THRESHOLDS.DEVELOPING,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const comments = getPatternRecognitionComments('samuel', patterns)
    expect(comments.length).toBeGreaterThan(0)
    expect(comments[0].pattern).toBe('patience')
  })

  it('filters out already shown comments', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: PATTERN_THRESHOLDS.DEVELOPING,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const shown = new Set(['samuel_patience_6'])
    const comments = getPatternRecognitionComments('samuel', patterns, shown)
    expect(comments.every(c => !shown.has(`${c.characterId}_${c.pattern}_${c.threshold}`))).toBe(true)
  })

  it('all comments have required fields', () => {
    PATTERN_RECOGNITION_COMMENTS.forEach(comment => {
      expect(comment.characterId).toBeDefined()
      expect(comment.pattern).toBeDefined()
      expect(comment.threshold).toBeGreaterThan(0)
      expect(comment.comment).toBeDefined()
      expect(comment.emotion).toBeDefined()
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-007: DIALOGUE CHOICE PATTERN PREVIEWS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-007: Dialogue Choice Pattern Previews', () => {
  it('returns empty styles when pattern not developed', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const styles = getPatternPreviewStyles('building', patterns)
    expect(styles).toEqual({})
  })

  it('returns glow styles when pattern developed', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: PATTERN_THRESHOLDS.EMERGING
    }
    const styles = getPatternPreviewStyles('building', patterns)
    expect(styles.boxShadow).toBeDefined()
    expect(styles.borderColor).toBeDefined()
  })

  it('returns empty when disabled', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 10
    }
    const styles = getPatternPreviewStyles('building', patterns, {
      ...DEFAULT_PATTERN_PREVIEW_CONFIG,
      enabled: false
    })
    expect(styles).toEqual({})
  })

  it('returns hint text for developed patterns', () => {
    const patterns: PlayerPatterns = {
      analytical: 5,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const hint = getPatternHintText('analytical', patterns)
    expect(hint).toContain('Weaver')
  })

  it('returns null hint for undeveloped patterns', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const hint = getPatternHintText('analytical', patterns)
    expect(hint).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-040: PATTERN EVOLUTION HEATMAP
// ═══════════════════════════════════════════════════════════════════════════

describe('D-040: Pattern Evolution Heatmap', () => {
  it('creates empty evolution history', () => {
    const history = createPatternEvolutionHistory()
    expect(history.points).toHaveLength(0)
    expect(history.milestones).toHaveLength(0)
    expect(history.patternTotals.analytical).toBe(0)
  })

  it('records pattern evolution correctly', () => {
    let history = createPatternEvolutionHistory()
    history = recordPatternEvolution(history, 'node1', 'maya', 'building', 2, 'Built something')

    expect(history.points).toHaveLength(1)
    expect(history.patternTotals.building).toBe(2)
    expect(history.points[0].delta).toBe(2)
  })

  it('tracks milestone achievements', () => {
    let history = createPatternEvolutionHistory()

    // Add enough to reach EMERGING (3)
    history = recordPatternEvolution(history, 'node1', 'maya', 'building', 3)

    expect(history.milestones).toHaveLength(1)
    expect(history.milestones[0].threshold).toBe('EMERGING')
    expect(history.milestones[0].pattern).toBe('building')
  })

  it('tracks multiple milestones', () => {
    let history = createPatternEvolutionHistory()

    // Add enough to reach DEVELOPING (6) - should trigger both EMERGING and DEVELOPING
    history = recordPatternEvolution(history, 'node1', 'maya', 'building', 6)

    expect(history.milestones).toHaveLength(2)
    expect(history.milestones.map(m => m.threshold)).toContain('EMERGING')
    expect(history.milestones.map(m => m.threshold)).toContain('DEVELOPING')
  })

  it('generates heatmap data grouped by character', () => {
    let history = createPatternEvolutionHistory()
    history = recordPatternEvolution(history, 'node1', 'maya', 'building', 2)
    history = recordPatternEvolution(history, 'node2', 'maya', 'building', 3)
    history = recordPatternEvolution(history, 'node3', 'devon', 'analytical', 4)

    const heatmap = getPatternHeatmapData(history)

    expect(heatmap.get('maya')?.get('building')).toBe(5) // 2 + 3
    expect(heatmap.get('devon')?.get('analytical')).toBe(4)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-059: ACHIEVEMENT SYSTEM WITH PATTERN DIVERSITY
// ═══════════════════════════════════════════════════════════════════════════

describe('D-059: Achievement System with Pattern Diversity', () => {
  it('returns empty array when no achievements earned', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const achievements = getEarnedAchievements(patterns)
    expect(achievements).toHaveLength(0)
  })

  it('detects single pattern mastery achievement', () => {
    const patterns: PlayerPatterns = {
      analytical: PATTERN_THRESHOLDS.FLOURISHING,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const achievements = getEarnedAchievements(patterns)
    const weaverAchievement = achievements.find(a => a.id === 'weaver_awakened')
    expect(weaverAchievement).toBeDefined()
  })

  it('detects balanced approach achievement', () => {
    const patterns: PlayerPatterns = {
      analytical: PATTERN_THRESHOLDS.EMERGING,
      patience: PATTERN_THRESHOLDS.EMERGING,
      exploring: PATTERN_THRESHOLDS.EMERGING,
      helping: 0,
      building: 0
    }
    const achievements = getEarnedAchievements(patterns)
    const balancedAchievement = achievements.find(a => a.id === 'balanced_approach')
    expect(balancedAchievement).toBeDefined()
  })

  it('detects renaissance soul achievement', () => {
    const patterns: PlayerPatterns = {
      analytical: PATTERN_THRESHOLDS.DEVELOPING,
      patience: PATTERN_THRESHOLDS.DEVELOPING,
      exploring: PATTERN_THRESHOLDS.DEVELOPING,
      helping: PATTERN_THRESHOLDS.DEVELOPING,
      building: PATTERN_THRESHOLDS.DEVELOPING
    }
    const achievements = getEarnedAchievements(patterns)
    const renaissanceAchievement = achievements.find(a => a.id === 'renaissance_soul')
    expect(renaissanceAchievement).toBeDefined()
  })

  it('detects new achievements correctly', () => {
    const oldPatterns: PlayerPatterns = {
      analytical: 5,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const newPatterns: PlayerPatterns = {
      analytical: PATTERN_THRESHOLDS.FLOURISHING,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const newAchievements = checkNewAchievements(oldPatterns, newPatterns)
    expect(newAchievements.some(a => a.id === 'weaver_awakened')).toBe(true)
  })

  it('all achievements have required fields', () => {
    PATTERN_ACHIEVEMENTS.forEach(achievement => {
      expect(achievement.id).toBeDefined()
      expect(achievement.name).toBeDefined()
      expect(achievement.description).toBeDefined()
      expect(achievement.icon).toBeDefined()
      expect(typeof achievement.condition).toBe('function')
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-096: PATTERN VOICE CONFLICTS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-096: Pattern Voice Conflicts', () => {
  it('does not trigger conflict when patterns below threshold', () => {
    const patterns: PlayerPatterns = {
      analytical: 2,
      patience: 0,
      exploring: 0,
      helping: 2,
      building: 0
    }
    const conflict = VOICE_CONFLICTS.find(c => c.id === 'help_or_analyze')!
    const shouldTrigger = shouldTriggerVoiceConflict(conflict, patterns)
    expect(shouldTrigger).toBe(false)
  })

  it('triggers conflict when both patterns at threshold', () => {
    const patterns: PlayerPatterns = {
      analytical: PATTERN_THRESHOLDS.DEVELOPING,
      patience: 0,
      exploring: 0,
      helping: PATTERN_THRESHOLDS.DEVELOPING,
      building: 0
    }
    const conflict = VOICE_CONFLICTS.find(c => c.id === 'help_or_analyze')!
    const shouldTrigger = shouldTriggerVoiceConflict(conflict, patterns)
    expect(shouldTrigger).toBe(true)
  })

  it('filters out already shown conflicts', () => {
    const patterns: PlayerPatterns = {
      analytical: PATTERN_THRESHOLDS.DEVELOPING,
      patience: PATTERN_THRESHOLDS.DEVELOPING,
      exploring: PATTERN_THRESHOLDS.DEVELOPING,
      helping: PATTERN_THRESHOLDS.DEVELOPING,
      building: PATTERN_THRESHOLDS.DEVELOPING
    }
    const shown = new Set(['help_or_analyze'])
    const activeConflicts = getActiveVoiceConflicts(patterns, shown)
    expect(activeConflicts.every(c => c.id !== 'help_or_analyze')).toBe(true)
  })

  it('all conflicts have matching voices and resolutions', () => {
    VOICE_CONFLICTS.forEach(conflict => {
      expect(conflict.voices.length).toBeGreaterThanOrEqual(2)
      expect(conflict.resolution.length).toBe(conflict.voices.length)

      // Each voice pattern should have a resolution
      conflict.voices.forEach(voice => {
        const hasResolution = conflict.resolution.some(r => r.pattern === voice.pattern)
        expect(hasResolution).toBe(true)
      })
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('Pattern Balance Calculation', () => {
  it('returns 1 for perfectly balanced patterns', () => {
    const patterns: PlayerPatterns = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5
    }
    const balance = calculatePatternBalance(patterns)
    expect(balance).toBe(1)
  })

  it('returns 1 for zero patterns', () => {
    const patterns: PlayerPatterns = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const balance = calculatePatternBalance(patterns)
    expect(balance).toBe(1)
  })

  it('returns lower value for unbalanced patterns', () => {
    const patterns: PlayerPatterns = {
      analytical: 10,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    const balance = calculatePatternBalance(patterns)
    expect(balance).toBeLessThan(1)
    expect(balance).toBeGreaterThan(0)
  })
})
