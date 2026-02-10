import { describe, expect, it } from 'vitest'
import { updateRewardFeed } from '@/lib/reward-feed'

describe('updateRewardFeed', () => {
  it('appends new items and caps length', () => {
    const now = 1_000
    const next = updateRewardFeed([], [
      { kind: 'info', title: 'A' },
      { kind: 'info', title: 'B' },
      { kind: 'info', title: 'C' },
      { kind: 'info', title: 'D' },
    ], now, { max_items: 3, ttl_ms: 999_999, merge_window_ms: 0 })

    expect(next).toHaveLength(3)
    expect(next.map(i => i.title)).toEqual(['B', 'C', 'D'])
  })

  it('merges identical consecutive items within merge window', () => {
    const t0 = 1_000
    const a1 = updateRewardFeed([], [{ kind: 'info', title: 'Story progressed' }], t0, { merge_window_ms: 20_000 })
    const a2 = updateRewardFeed(a1, [{ kind: 'info', title: 'Story progressed' }], t0 + 5_000, { merge_window_ms: 20_000 })
    expect(a2).toHaveLength(1)
    expect(a2[0].count).toBe(2)
  })
})

