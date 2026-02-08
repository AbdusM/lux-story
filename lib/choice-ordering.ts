/**
 * Choice Ordering
 *
 * Purpose:
 * - Mitigate UI position bias (top-choice bias) without removing Narrative Gravity.
 * - Provide deterministic ordering per (user, node) so UI is stable across re-renders.
 *
 * Design:
 * - "deterministic_shuffle": deterministic shuffle (ignores gravity weight; used to mitigate ordering bias).
 * - "gravity_strict": sort by gravity weight desc, then stable by key.
 * - "gravity_bucket_shuffle": sort by gravity weight desc, then deterministic shuffle within each weight bucket.
 */

import type { PatternType } from './patterns'
import type { GravityResult } from './narrative-gravity'

export type ChoiceOrderingVariant =
  | 'deterministic_shuffle'
  | 'gravity_strict'
  | 'gravity_bucket_shuffle'

export interface ChoiceForOrdering {
  id?: string
  text: string
  pattern?: PatternType
  gravity?: GravityResult
}

export interface ChoiceOrderingResult<TChoice> {
  orderedChoices: TChoice[]
  meta: {
    variant: ChoiceOrderingVariant
    seed: string
  }
}

function fnv1a32(input: string): number {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stableChoiceKey(choice: ChoiceForOrdering, index: number): string {
  // Prefer explicit ID. Fall back to text so ordering remains stable even for legacy UI choices.
  return choice.id || `${index}:${choice.text}`
}

function deterministicShuffle<T>(items: T[], seedString: string): T[] {
  const rng = mulberry32(fnv1a32(seedString))
  // Fisher-Yates
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

function canonicalChoiceKey(choice: ChoiceForOrdering): string {
  // Prefer explicit ID. Otherwise fall back to text.
  // We intentionally avoid using array index here so ordering is stable even if upstream
  // choice evaluation produces the same set in a different original order.
  return choice.id || choice.text
}

function getGravityWeight(choice: ChoiceForOrdering): number {
  return choice.gravity?.weight ?? 1.0
}

function bucketKey(weight: number): string {
  // Avoid float chaos; gravity weights are small discrete set (e.g. 1.5, 1.0, 0.6).
  return weight.toFixed(2)
}

export function orderChoicesForDisplay<TChoice extends ChoiceForOrdering>(
  choices: readonly TChoice[],
  opts: { variant: ChoiceOrderingVariant; seed: string }
): ChoiceOrderingResult<TChoice> {
  const variant = opts.variant
  const seed = opts.seed

  if (choices.length <= 1) {
    return { orderedChoices: [...choices], meta: { variant, seed } }
  }

  if (variant === 'deterministic_shuffle') {
    // Canonicalize before shuffle so results depend on set membership + seed, not upstream input order.
    const canonical = [...choices]
      .map((c, i) => ({ c, i, k: canonicalChoiceKey(c) }))
      .sort((a, b) => a.k.localeCompare(b.k) || a.i - b.i)
      .map(x => x.c)

    const orderedChoices = deterministicShuffle([...canonical], seed)
    return { orderedChoices, meta: { variant, seed } }
  }

  if (variant === 'gravity_strict') {
    const orderedChoices = [...choices].sort((a, b) => {
      const wA = getGravityWeight(a)
      const wB = getGravityWeight(b)
      if (wA !== wB) return wB - wA
      const kA = stableChoiceKey(a, 0)
      const kB = stableChoiceKey(b, 0)
      return kA.localeCompare(kB)
    })
    return { orderedChoices, meta: { variant, seed } }
  }

  // gravity_bucket_shuffle (default)
  const byWeight = new Map<string, { weight: number; items: TChoice[] }>()
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i]
    const weight = getGravityWeight(choice)
    const key = bucketKey(weight)
    const bucket = byWeight.get(key)
    if (bucket) {
      bucket.items.push(choice)
    } else {
      byWeight.set(key, { weight, items: [choice] })
    }
  }

  // Sort buckets by weight desc
  const buckets = [...byWeight.values()].sort((a, b) => b.weight - a.weight)

  const ordered: TChoice[] = []
  for (const bucket of buckets) {
    if (bucket.items.length <= 1) {
      ordered.push(...bucket.items)
      continue
    }
    const shuffled = deterministicShuffle([...bucket.items], `${seed}|w=${bucketKey(bucket.weight)}`)
    ordered.push(...shuffled)
  }

  return { orderedChoices: ordered, meta: { variant, seed } }
}
