import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('experiments', () => {
  beforeEach(() => {
    vi.resetModules()
    window.localStorage.clear()
  })

  it('assignVariant is deterministic per (testId, assignmentVersion, userId)', async () => {
    const exp = await import('@/lib/experiments')

    exp.ACTIVE_TESTS['t1'] = {
      id: 't1',
      variants: ['control', 'variantA'],
      assignmentVersion: 'v1',
    }

    const a1 = exp.assignVariant('t1', 'user-1')
    const a2 = exp.assignVariant('t1', 'user-1')
    expect(a1).toBe(a2)
  })

  it('weights are respected (zero-weight variant is never selected)', async () => {
    const exp = await import('@/lib/experiments')

    exp.ACTIVE_TESTS['t2'] = {
      id: 't2',
      variants: ['never', 'always'],
      weights: [0, 100],
      assignmentVersion: 'v1',
    }

    for (let i = 0; i < 20; i++) {
      const v = exp.assignVariant('t2', `user-${i}`)
      expect(v).toBe('always')
    }
  })

  it('assignmentVersion controls stickiness (changing version rerolls under new key)', async () => {
    const exp = await import('@/lib/experiments')

    exp.ACTIVE_TESTS['t3'] = {
      id: 't3',
      variants: ['a', 'b', 'c'],
      assignmentVersion: 'v1',
    }

    const v1 = exp.assignVariant('t3', 'user-1')
    exp.ACTIVE_TESTS['t3'] = { ...exp.ACTIVE_TESTS['t3']!, assignmentVersion: 'v2' }
    const v2 = exp.assignVariant('t3', 'user-1')

    // Could coincidentally match, but should be a fresh assignment slot (no stored value).
    // We assert the old stored key is different by checking getAssignment.
    exp.ACTIVE_TESTS['t3'] = { ...exp.ACTIVE_TESTS['t3']!, assignmentVersion: 'v1' }
    expect(exp.getAssignment('t3', 'user-1')).toBe(v1)
    exp.ACTIVE_TESTS['t3'] = { ...exp.ACTIVE_TESTS['t3']!, assignmentVersion: 'v2' }
    expect(exp.getAssignment('t3', 'user-1')).toBe(v2)
  })

  it('assignVariantAndTrack enqueues experiment_assigned only once per assignment', async () => {
    const exp = await import('@/lib/experiments')
    const sync = await import('@/lib/sync-queue')

    exp.ACTIVE_TESTS['t4'] = {
      id: 't4',
      variants: ['control', 'beta'],
      assignmentVersion: 'v1',
    }

    const r1 = exp.assignVariantAndTrack({
      testId: 't4',
      userId: 'user-1',
      user_id: 'user-1',
      session_id: 'sess-1',
      node_id: 'n1',
      character_id: 'samuel',
    })
    expect(r1.isNew).toBe(true)

    const q1 = sync.SyncQueue.getQueue()
    expect(q1.length).toBe(1)
    expect(q1[0]?.type).toBe('interaction_event')
    expect((q1[0]?.data as any)?.event_type).toBe('experiment_assigned')

    const r2 = exp.assignVariantAndTrack({
      testId: 't4',
      userId: 'user-1',
      user_id: 'user-1',
      session_id: 'sess-1',
    })
    expect(r2.isNew).toBe(false)
    expect(sync.SyncQueue.getQueue().length).toBe(1)
  })
})

