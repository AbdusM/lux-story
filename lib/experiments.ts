import { safeStorage } from '@/lib/safe-storage'
import { queueInteractionEventSync, generateActionId } from '@/lib/sync-queue'

export interface ABTest {
  id: string
  variants: string[]
  weights?: number[] // Defaults to equal split
}

export const ASSIGNMENT_VERSION = 'v1'

// Optional registry for app-level lookup.
export const ACTIVE_TESTS: Record<string, ABTest> = {}

function fnv1a32(input: string): number {
  // Deterministic, fast, good-enough spread for bucket assignment.
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    // 32-bit FNV prime
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function normalizeWeights(variants: string[], weights?: number[]): number[] {
  if (!weights || weights.length !== variants.length) {
    return variants.map(() => 1)
  }
  const cleaned = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0))
  const sum = cleaned.reduce((a, b) => a + b, 0)
  if (sum <= 0) return variants.map(() => 1)
  return cleaned
}

function pickWeightedIndex(hash: number, weights: number[]): number {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum <= 0) return 0

  // Deterministic "random" value in [0, sum)
  const x = (hash % 1_000_000) / 1_000_000
  let target = x * sum

  for (let i = 0; i < weights.length; i++) {
    const w = weights[i]
    if (target < w) return i
    target -= w
  }

  return weights.length - 1
}

function storageKey(testId: string, userId: string, assignmentVersion: string): string {
  return `exp:${testId}:${assignmentVersion}:${userId}`
}

export function getAssignment(testId: string, userId: string, assignmentVersion: string = ASSIGNMENT_VERSION): string | null {
  if (typeof window === 'undefined') return null
  const raw = safeStorage.getItem(storageKey(testId, userId, assignmentVersion))
  return raw || null
}

export function assignVariant(testId: string, userId: string, assignmentVersion: string = ASSIGNMENT_VERSION): string {
  const test = ACTIVE_TESTS[testId]
  if (!test) return 'control'
  return assignVariantForTest(test, userId, assignmentVersion)
}

export function assignVariantForTest(test: ABTest, userId: string, assignmentVersion: string = ASSIGNMENT_VERSION): string {
  if (!test?.id) throw new Error('assignVariant: test.id is required')
  if (!userId) throw new Error('assignVariant: userId is required for deterministic assignment')
  if (!assignmentVersion) throw new Error('assignVariant: assignmentVersion is required')
  if (!Array.isArray(test.variants) || test.variants.length === 0) {
    throw new Error(`assignVariant: test "${test.id}" must define at least one variant`)
  }

  const existing = getAssignment(test.id, userId, assignmentVersion)
  if (existing) return existing

  const hash = fnv1a32(`${test.id}:${assignmentVersion}:${userId}`)
  const weights = normalizeWeights(test.variants, test.weights)
  const idx = pickWeightedIndex(hash, weights)
  const variant = test.variants[Math.max(0, Math.min(test.variants.length - 1, idx))]

  // Persist (client only). Server-side calls remain deterministic but not sticky.
  if (typeof window !== 'undefined') {
    safeStorage.setItem(storageKey(test.id, userId, assignmentVersion), variant)

    const now = Date.now()
    queueInteractionEventSync({
      user_id: userId,
      session_id: String(now),
      event_type: 'experiment_assigned',
      payload: {
        event_id: generateActionId(),
        assigned_at_ms: now,
        test_id: test.id,
        variant,
        assignment_version: assignmentVersion,
      },
      occurred_at: new Date(now).toISOString(),
    })
  }

  return variant
}
