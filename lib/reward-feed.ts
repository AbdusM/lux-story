import type { OutcomeItem } from '@/lib/outcome-card'

export type RewardFeedItem = OutcomeItem & {
  id: string
  ts_ms: number
  count?: number
}

export type RewardFeedOptions = {
  max_items: number
  merge_window_ms: number
  ttl_ms: number
}

const DEFAULT_OPTS: RewardFeedOptions = {
  max_items: 3,
  merge_window_ms: 20_000,
  ttl_ms: 5 * 60_000,
}

function stableKey(item: OutcomeItem): string {
  return `${item.kind}|${item.title}|${item.detail ?? ''}|${item.prismTab ?? ''}`
}

function weightForItem(item: OutcomeItem): number {
  // Higher weight = more important to show when batching.
  // Keep rules simple and stable: tests/telemetry depend on this being deterministic.
  const t = item.title
  if (t === 'Objective complete') return 100
  if (t === 'Objective') return 90
  if (t === 'New objective') return 85
  if (t === 'Quest progress') return 80
  if (t === 'Worldview Shift') return 70
  if (t === 'Story progressed') return 0
  return 10
}

/**
 * Reward cadence: collapse noisy batches (e.g. multiple info items from one choice)
 * into at most 2 distinct feed entries, using counts to indicate additional updates.
 *
 * This prevents "banner spam" while staying deterministic and debuggable.
 *
 * Note: We intentionally do NOT invent new text here (no copy drift). We reuse existing
 * item.title/detail and rely on Prism deep links as the detailed drill-down.
 */
export function compressRewardFeedBatch(newItems: OutcomeItem[], maxDistinct = 2): OutcomeItem[] {
  if (!newItems || newItems.length <= maxDistinct) return newItems

  // Choose top-N distinct keys by weight, ties broken by first occurrence.
  const firstIxByKey = new Map<string, number>()
  const bestByKey = new Map<string, { item: OutcomeItem; weight: number; firstIx: number }>()

  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i]!
    const key = stableKey(item)
    const firstIx = firstIxByKey.has(key) ? (firstIxByKey.get(key) as number) : i
    firstIxByKey.set(key, firstIx)
    const w = weightForItem(item)
    const prev = bestByKey.get(key)
    if (!prev || w > prev.weight) {
      bestByKey.set(key, { item, weight: w, firstIx })
    }
  }

  const distinct = Array.from(bestByKey.values()).sort((a, b) => {
    if (a.weight !== b.weight) return b.weight - a.weight
    return a.firstIx - b.firstIx
  })

  const top1 = distinct[0]!.item
  const top2 = distinct.find((d) => stableKey(d.item) !== stableKey(top1))?.item ?? null

  // If everything collapsed to one key, just repeat it; updateRewardFeed will merge counts.
  if (!top2) return Array.from({ length: newItems.length }, () => top1)

  // Two distinct items: show top2 once, then "count-merge" top1 to represent the rest.
  // We encode the batch size via repeats; this becomes `count` on the last item.
  const repeatsForTop1 = Math.max(1, newItems.length - 1)
  return [top2, ...Array.from({ length: repeatsForTop1 }, () => top1)]
}

function hashToBase36(s: string): string {
  // djb2-ish hash; stable across runs.
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i)
  return (h >>> 0).toString(36)
}

export function updateRewardFeed(
  prev: RewardFeedItem[],
  newItems: OutcomeItem[],
  nowMs: number,
  options?: Partial<RewardFeedOptions>
): RewardFeedItem[] {
  const opts: RewardFeedOptions = { ...DEFAULT_OPTS, ...(options || {}) }

  // Prune old items first.
  let feed = prev.filter(i => nowMs - i.ts_ms <= opts.ttl_ms)

  for (const item of newItems) {
    const key = stableKey(item)
    const last = feed.length > 0 ? feed[feed.length - 1] : null
    if (last && stableKey(last) === key && nowMs - last.ts_ms <= opts.merge_window_ms) {
      last.count = (last.count ?? 1) + 1
      last.ts_ms = nowMs
      continue
    }

    feed.push({
      ...item,
      id: `rf:${nowMs}:${hashToBase36(key)}`,
      ts_ms: nowMs,
    })

    if (feed.length > opts.max_items) {
      feed = feed.slice(feed.length - opts.max_items)
    }
  }

  return feed
}
