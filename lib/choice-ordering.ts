/**
 * Choice Ordering
 *
 * Goal: deterministic, bias-auditable choice ordering for UI presentation.
 *
 * We intentionally keep this module small and stable:
 * - Same `(variant, seed, input choices)` => same output order
 * - No async, no side effects
 */

export type ChoiceOrderingVariant = 'deterministic_shuffle' | 'gravity_bucket_shuffle'

type GravityLike = { weight?: number | null; effect?: string | null }
type ChoiceLike = { gravity?: GravityLike | null }

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(items: readonly T[], seedStr: string): T[] {
  const seed = xmur3(seedStr)()
  const rnd = mulberry32(seed)
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function gravityBucket(choice: ChoiceLike): 'attract' | 'neutral' | 'repel' {
  const w = choice.gravity?.weight
  if (typeof w === 'number') {
    if (w > 1.05) return 'attract'
    if (w < 0.95) return 'repel'
  }
  return 'neutral'
}

export function orderChoicesForDisplay<T extends ChoiceLike>(
  choices: readonly T[],
  opts: { variant: ChoiceOrderingVariant; seed: string },
): { orderedChoices: T[] } {
  const { variant, seed } = opts

  if (choices.length <= 1) return { orderedChoices: [...choices] }

  if (variant === 'gravity_bucket_shuffle') {
    const attract: T[] = []
    const neutral: T[] = []
    const repel: T[] = []

    for (const c of choices) {
      const b = gravityBucket(c)
      if (b === 'attract') attract.push(c)
      else if (b === 'repel') repel.push(c)
      else neutral.push(c)
    }

    const ordered = [
      ...seededShuffle(attract, `${seed}:attract`),
      ...seededShuffle(neutral, `${seed}:neutral`),
      ...seededShuffle(repel, `${seed}:repel`),
    ]
    return { orderedChoices: ordered }
  }

  // Default: deterministic shuffle across the whole set.
  return { orderedChoices: seededShuffle(choices, `${seed}:${variant}`) }
}

