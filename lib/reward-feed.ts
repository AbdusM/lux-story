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

