import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sync-queue', () => ({
  queueInteractionEventSync: vi.fn(),
}))

describe('experiments', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('is deterministic for the same (testId, version, userId)', async () => {
    const exp = await import('@/lib/experiments')

    exp.ACTIVE_TESTS['t1'] = { id: 't1', variants: ['a', 'b', 'c'], assignment_version: 'v1' }

    const v1 = exp.assignVariant('t1', 'user_123')
    const v2 = exp.assignVariant('t1', 'user_123')
    expect(v1).toBe(v2)
  })

  it('is sticky via localStorage and does not reroll if variants change', async () => {
    const exp = await import('@/lib/experiments')

    exp.ACTIVE_TESTS['t1'] = { id: 't1', variants: ['a', 'b'], assignment_version: 'v1' }
    const first = exp.assignVariant('t1', 'user_123')

    // Mutate config: if not sticky, this could change.
    exp.ACTIVE_TESTS['t1'] = { id: 't1', variants: ['x', 'y'], assignment_version: 'v1' }
    const second = exp.assignVariant('t1', 'user_123')

    expect(second).toBe(first)
  })

  it('respects assignment_version in the persistence key (intentional reroll)', async () => {
    const exp = await import('@/lib/experiments')

    exp.ACTIVE_TESTS['t1'] = { id: 't1', variants: ['a', 'b'], assignment_version: 'v1' }
    const v1 = exp.assignVariant('t1', 'user_123')

    exp.ACTIVE_TESTS['t1'] = { id: 't1', variants: ['a', 'b'], assignment_version: 'v2' }
    const v2 = exp.assignVariant('t1', 'user_123')

    // Not guaranteed different, but should be re-assigned under v2 and persisted separately.
    const a1 = exp.getAssignment('t1', 'user_123')
    expect(a1?.assignment_version).toBe('v2')
    expect([v1, v2]).toContain(a1?.variant)
  })

  it('emits experiment_assigned only on first assignment per key', async () => {
    const exp = await import('@/lib/experiments')
    const { queueInteractionEventSync } = await import('@/lib/sync-queue')

    exp.ACTIVE_TESTS['t1'] = { id: 't1', variants: ['a', 'b'], assignment_version: 'v1' }

    exp.assignVariant('t1', 'user_123')
    exp.assignVariant('t1', 'user_123')

    expect(queueInteractionEventSync).toHaveBeenCalledTimes(1)
    const call = (queueInteractionEventSync as any).mock.calls[0][0]
    expect(call.event_type).toBe('experiment_assigned')
    expect(call.user_id).toBe('user_123')
    expect(call.payload.test_id).toBe('t1')
    expect(call.payload.assignment_version).toBe('v1')
  })
})
