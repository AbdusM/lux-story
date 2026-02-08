import { describe, it, expect, beforeEach } from 'vitest'
import { assignVariantForTest, getAssignment, ASSIGNMENT_VERSION, type ABTest } from '@/lib/experiments'

describe('Experiments', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('assignVariant is deterministic and sticky per (testId,userId,assignmentVersion)', () => {
    const t: ABTest = { id: 'rank_card_copy', variants: ['control', 'beta'] }
    const userId = 'user-123'

    const a = assignVariantForTest(t, userId)
    const b = assignVariantForTest(t, userId)
    expect(a).toBe(b)

    const stored = getAssignment(t.id, userId)
    expect(stored).toBe(a)
  })

  it('assignment_version participates in stickiness key (can intentionally reroll)', () => {
    const t: ABTest = { id: 'rank_card_copy', variants: ['control', 'beta'] }
    const userId = 'user-123'

    const v1 = assignVariantForTest(t, userId, 'v1')
    const v2 = assignVariantForTest(t, userId, 'v2')

    // Not guaranteed to differ, but must be independently stored.
    expect(getAssignment(t.id, userId, 'v1')).toBe(v1)
    expect(getAssignment(t.id, userId, 'v2')).toBe(v2)
  })

  it('respects weights (basic sanity over a sample of users)', () => {
    const t: ABTest = { id: 'weighted', variants: ['a', 'b'], weights: [0.8, 0.2] }
    const n = 400
    let aCount = 0

    for (let i = 0; i < n; i++) {
      const userId = `user-${i}`
      const v = assignVariantForTest(t, userId, ASSIGNMENT_VERSION)
      if (v === 'a') aCount++
    }

    const ratio = aCount / n
    expect(ratio).toBeGreaterThan(0.7)
    expect(ratio).toBeLessThan(0.9)
  })
})
