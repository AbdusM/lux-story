import { describe, expect, it } from 'vitest'
import { deriveOrbFillGateReason } from '@/lib/choice-gate-reasons'

describe('Choice Gate Reasons', () => {
  it('derives a canonical orb-fill gate reason with code and progress', () => {
    const r = deriveOrbFillGateReason({
      requiredOrbFill: { pattern: 'analytical', threshold: 80 },
      orbFillLevels: { analytical: 10, building: 0, helping: 0, patience: 0, exploring: 0 },
    })

    expect(r.kind).toBe('locked')
    expect(r.code).toBe('NEEDS_ORB_FILL')
    expect(r.why).toMatch(/Requires/i)
    expect(r.how).toMatch(/To unlock:/i)
    expect(r.progress).toEqual({ current: 10, required: 80 })
  })
})

