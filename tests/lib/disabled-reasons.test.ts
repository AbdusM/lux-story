import { describe, expect, it } from 'vitest'
import { GameStateUtils } from '@/lib/character-state'
import { deriveDisabledReason } from '@/lib/disabled-reasons'

describe('deriveDisabledReason', () => {
  it('returns NEEDS_TRUST when trust is below min', () => {
    const s = GameStateUtils.createNewGameState('t')
    const cs = s.characters.get('samuel')!
    s.characters.set('samuel', { ...cs, trust: 0 })

    const r = deriveDisabledReason({ trust: { min: 2 } }, s, 'samuel')
    expect(r.code).toBe('NEEDS_TRUST')
    expect(r.message).toContain('Need 2 trust')
    expect(r.why).toBe('Requires Trust 2')
    expect(r.how).toMatch(/To unlock:/)
    expect(r.progress).toEqual({ current: 0, required: 2 })
  })

  it('returns NEEDS_RELATIONSHIP when relationship status mismatches', () => {
    const s = GameStateUtils.createNewGameState('t')
    const cs = s.characters.get('samuel')!
    s.characters.set('samuel', { ...cs, relationshipStatus: 'stranger' })

    const r = deriveDisabledReason({ relationship: ['confidant'] }, s, 'samuel')
    expect(r.code).toBe('NEEDS_RELATIONSHIP')
  })

  it('returns NEEDS_GLOBAL_FLAG when required global flag missing', () => {
    const s = GameStateUtils.createNewGameState('t')
    const r = deriveDisabledReason({ hasGlobalFlags: ['flag_x'] }, s, 'samuel')
    expect(r.code).toBe('NEEDS_GLOBAL_FLAG')
    expect(r.message).toContain('flag_x')
    expect(r.why).toContain('flag_x')
    expect(r.how).toMatch(/To unlock:/)
  })

  it('returns BLOCKED_BY_GLOBAL_FLAG when forbidden global flag present', () => {
    const s = GameStateUtils.createNewGameState('t')
    s.globalFlags.add('flag_y')
    const r = deriveDisabledReason({ lacksGlobalFlags: ['flag_y'] }, s, 'samuel')
    expect(r.code).toBe('BLOCKED_BY_GLOBAL_FLAG')
    expect(r.message).toContain('flag_y')
  })

  it('returns NEEDS_KNOWLEDGE_FLAG when required knowledge flag missing', () => {
    const s = GameStateUtils.createNewGameState('t')
    const r = deriveDisabledReason({ hasKnowledgeFlags: ['k_x'] }, s, 'samuel')
    expect(r.code).toBe('NEEDS_KNOWLEDGE_FLAG')
    expect(r.message).toContain('k_x')
  })

  it('returns NEEDS_PATTERN_LEVEL when pattern min not met', () => {
    const s = GameStateUtils.createNewGameState('t')
    const r = deriveDisabledReason({ patterns: { analytical: { min: 3 } } }, s, 'samuel')
    expect(r.code).toBe('NEEDS_PATTERN_LEVEL')
    expect(r.message).toContain('analytical')
    expect(r.why).toContain('analytical')
    expect(r.how).toMatch(/To unlock:/)
    expect(r.progress).toEqual({ current: 0, required: 3 })
  })

  it('returns NEEDS_COMBO when a combo unlock is required', () => {
    const s = GameStateUtils.createNewGameState('t')
    const r = deriveDisabledReason({ requiredCombos: ['combo_1'] }, s, 'samuel')
    expect(r.code).toBe('NEEDS_COMBO')
  })
})
