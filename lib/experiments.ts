import { safeStorage } from '@/lib/safe-storage'
import { queueInteractionEventSync } from '@/lib/sync-queue'

export interface ABTest {
  id: string
  variants: readonly string[]
  weights?: readonly number[] // Optional. Defaults to equal split.
  assignmentVersion: string // Required. Controls stickiness + intentional rerolls.
}

export const ACTIVE_TESTS: Record<string, ABTest> = {}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function storageKey(testId: string, assignmentVersion: string, userId: string): string {
  return `exp:${testId}:${assignmentVersion}:${userId}`
}

function hash32(input: string): number {
  // FNV-1a 32-bit.
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function hashToUnitInterval(input: string): number {
  // [0,1)
  return hash32(input) / 0x1_0000_0000
}

function pickVariantDeterministic(test: ABTest, userId: string): string {
  const variants = test.variants
  if (!variants || variants.length === 0) return 'control'

  const r = hashToUnitInterval(`${test.id}|${test.assignmentVersion}|${userId}`)

  const weights = (test.weights && test.weights.length === variants.length)
    ? test.weights
    : variants.map(() => 1)

  const total = weights.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0)
  if (total <= 0) {
    const idx = Math.floor(r * variants.length)
    return variants[Math.min(idx, variants.length - 1)] ?? variants[0]!
  }

  let acc = 0
  const target = r * total
  for (let i = 0; i < variants.length; i++) {
    acc += weights[i]!
    if (target < acc) return variants[i]!
  }
  return variants[variants.length - 1]!
}

export function getAssignment(testId: string, userId: string): string | null {
  const test = ACTIVE_TESTS[testId]
  if (!test) return null
  if (!isBrowser()) return null
  const existing = safeStorage.getItem(storageKey(testId, test.assignmentVersion, userId))
  return existing || null
}

export function assignVariant(testId: string, userId: string): string {
  const test = ACTIVE_TESTS[testId]
  if (!test) return 'control'

  const key = storageKey(testId, test.assignmentVersion, userId)
  const existing = isBrowser() ? safeStorage.getItem(key) : null
  if (existing) return existing

  const v = pickVariantDeterministic(test, userId)
  if (isBrowser()) safeStorage.setItem(key, v)
  return v
}

/**
 * Assign a variant and enqueue telemetry on first assignment (canonical sink: interaction_events).
 * This is dev/prod safe: if localStorage is unavailable (SSR), assignment still returns deterministically.
 */
export function assignVariantAndTrack(args: {
  testId: string
  userId: string
  user_id: string
  session_id: string
  node_id?: string
  character_id?: string
}): { variant: string; assignment_version: string; isNew: boolean } {
  const test = ACTIVE_TESTS[args.testId]
  if (!test) {
    return { variant: 'control', assignment_version: 'unregistered', isNew: false }
  }

  const key = storageKey(args.testId, test.assignmentVersion, args.userId)
  const existing = isBrowser() ? safeStorage.getItem(key) : null
  const variant = existing || pickVariantDeterministic(test, args.userId)
  const isNew = !existing

  if (isBrowser() && !existing) safeStorage.setItem(key, variant)

  if (isNew) {
    queueInteractionEventSync({
      user_id: args.user_id,
      session_id: args.session_id,
      event_type: 'experiment_assigned',
      node_id: args.node_id,
      character_id: args.character_id,
      payload: {
        event_id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        assigned_at_ms: Date.now(),
        test_id: args.testId,
        variant,
        assignment_version: test.assignmentVersion,
      }
    })
  }

  return { variant, assignment_version: test.assignmentVersion, isNew }
}
