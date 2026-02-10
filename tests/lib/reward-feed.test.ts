import { describe, expect, it } from 'vitest'
import { compressRewardFeedBatch, updateRewardFeed } from '@/lib/reward-feed'
import type { PrismTabId } from '@/lib/prism-tabs'

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

describe('compressRewardFeedBatch', () => {
  it('keeps <=2 items as-is', () => {
    const items = [
      { kind: 'info' as const, title: 'A', detail: 'a' },
      { kind: 'info' as const, title: 'B', detail: 'b' },
    ]
    expect(compressRewardFeedBatch(items, 2)).toEqual(items)
  })

  it('compresses a noisy batch into at most 2 distinct entries via repeats', () => {
    const items = [
      { kind: 'info' as const, title: 'Story progressed', detail: 'No visible changes.' },
      { kind: 'info' as const, title: 'Quest progress', detail: '1/3 completed', prismTab: 'essence' as PrismTabId },
      { kind: 'info' as const, title: 'Objective', detail: "Maya's Path", prismTab: 'essence' as PrismTabId },
      { kind: 'info' as const, title: 'Quest progress', detail: '1/3 completed', prismTab: 'essence' as PrismTabId },
    ]

    const batch = compressRewardFeedBatch(items, 2)
    // Objective should be chosen as the main aggregate (highest priority), repeated.
    const last = batch[batch.length - 1]!
    expect(last.title).toBe('Objective')
    expect(batch.length).toBeGreaterThan(2)

    // When applied, the repeats should merge into a count.
    const now = 1_000
    const feed = updateRewardFeed([], batch, now, { max_items: 3, ttl_ms: 999_999, merge_window_ms: 20_000 })
    expect(feed.length).toBeLessThanOrEqual(2)
    const agg = feed[feed.length - 1]!
    expect(agg.title).toBe('Objective')
    expect(agg.count).toBeGreaterThan(1)
  })
})
