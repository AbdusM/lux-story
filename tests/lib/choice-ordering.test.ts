import { describe, it, expect } from 'vitest'
import { orderChoicesForDisplay } from '@/lib/choice-ordering'

describe('orderChoicesForDisplay', () => {
  it('gravity_strict sorts by weight desc', () => {
    const choices = [
      { id: 'a', text: 'A', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'b', text: 'B', gravity: { weight: 1.5, effect: 'attract' as const } },
      { id: 'c', text: 'C', gravity: { weight: 0.6, effect: 'repel' as const } },
    ]

    const result = orderChoicesForDisplay(choices, { variant: 'gravity_strict', seed: 'seed' })
    expect(result.orderedChoices.map(c => c.id)).toEqual(['b', 'a', 'c'])
  })

  it('gravity_bucket_shuffle is deterministic for same seed', () => {
    const choices = [
      { id: 'a', text: 'A', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'b', text: 'B', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'c', text: 'C', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'd', text: 'D', gravity: { weight: 1.0, effect: 'neutral' as const } },
    ]

    const r1 = orderChoicesForDisplay(choices, { variant: 'gravity_bucket_shuffle', seed: 'user:node' })
    const r2 = orderChoicesForDisplay(choices, { variant: 'gravity_bucket_shuffle', seed: 'user:node' })
    expect(r1.orderedChoices.map(c => c.id)).toEqual(r2.orderedChoices.map(c => c.id))
  })

  it('gravity_bucket_shuffle changes with different seed (highly likely)', () => {
    const choices = [
      { id: 'a', text: 'A', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'b', text: 'B', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'c', text: 'C', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'd', text: 'D', gravity: { weight: 1.0, effect: 'neutral' as const } },
    ]

    const r1 = orderChoicesForDisplay(choices, { variant: 'gravity_bucket_shuffle', seed: 'seed-1' })
    const r2 = orderChoicesForDisplay(choices, { variant: 'gravity_bucket_shuffle', seed: 'seed-2' })

    // Not strictly guaranteed, but extremely likely for 4 items.
    expect(r1.orderedChoices.map(c => c.id)).not.toEqual(r2.orderedChoices.map(c => c.id))
  })

  it('gravity_bucket_shuffle preserves bucket ordering by weight', () => {
    const choices = [
      { id: 'a', text: 'A', gravity: { weight: 1.0, effect: 'neutral' as const } },
      { id: 'b', text: 'B', gravity: { weight: 1.5, effect: 'attract' as const } },
      { id: 'c', text: 'C', gravity: { weight: 1.5, effect: 'attract' as const } },
      { id: 'd', text: 'D', gravity: { weight: 0.6, effect: 'repel' as const } },
    ]

    const result = orderChoicesForDisplay(choices, { variant: 'gravity_bucket_shuffle', seed: 'seed' })
    const weights = result.orderedChoices.map(c => c.gravity?.weight ?? 1.0)
    expect(weights).toEqual([1.5, 1.5, 1.0, 0.6])
  })
})

