/**
 * Experiments (Deterministic + Sticky)
 *
 * Determinism:
 * - assignment is derived from a stable hash of (test_id + assignment_version + user_id)
 * - optional weights map the hash into a cumulative distribution
 *
 * Stickiness:
 * - first assignment is persisted in localStorage at:
 *   exp:${test_id}:${assignment_version}:${user_id}
 *
 * Telemetry:
 * - on first assignment, emits interaction_event type `experiment_assigned`
 *   via the canonical sink (SyncQueue -> /api/user/interaction-events).
 */

import { queueInteractionEventSync } from '@/lib/sync-queue'
import { GameStateManager } from '@/lib/game-state-manager'

export type ABTest = {
  id: string
  variants: readonly string[]
  weights?: readonly number[]
  assignment_version: string
}

// Mutable registry is fine; keep it small and explicit.
export const ACTIVE_TESTS: Record<string, ABTest> = {}

type StoredAssignment = {
  variant: string
  assigned_at_ms: number
}

function storageKey(testId: string, assignmentVersion: string, userId: string): string {
  return `exp:${testId}:${assignmentVersion}:${userId}`
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

function normalizeWeights(variants: readonly string[], weights?: readonly number[]): number[] | null {
  if (!weights) return null
  if (weights.length !== variants.length) return null

  const cleaned = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0))
  const sum = cleaned.reduce((a, b) => a + b, 0)
  if (sum <= 0) return null
  return cleaned.map((w) => w / sum)
}

function chooseVariantDeterministic(test: ABTest, userId: string): string {
  const key = `${test.id}:${test.assignment_version}:${userId}`
  const h = fnv1a32(key)
  const r = h / 2 ** 32 // [0, 1)

  const weights = normalizeWeights(test.variants, test.weights)
  if (!weights) {
    const idx = h % test.variants.length
    return test.variants[idx] ?? 'control'
  }

  let acc = 0
  for (let i = 0; i < test.variants.length; i++) {
    acc += weights[i]!
    if (r < acc) return test.variants[i]!
  }
  return test.variants[test.variants.length - 1] ?? 'control'
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function bestEffortSessionId(): string {
  try {
    const state = GameStateManager.loadGameState()
    return String(state?.sessionStartTime || Date.now())
  } catch {
    return String(Date.now())
  }
}

function emitAssignmentTelemetry(params: { userId: string; test: ABTest; variant: string }): void {
  if (typeof window === 'undefined') return
  if (!params.userId) return

  const now = Date.now()
  queueInteractionEventSync({
    user_id: params.userId,
    session_id: bestEffortSessionId(),
    event_type: 'experiment_assigned',
    payload: {
      event_id: `exp_${params.test.id}_${params.test.assignment_version}_${now}`,
      assigned_at_ms: now,
      test_id: params.test.id,
      variant: params.variant,
      assignment_version: params.test.assignment_version,
    },
  })
}

export function getAssignment(testId: string, userId: string): { variant: string; assignment_version: string } | null {
  const test = ACTIVE_TESTS[testId]
  if (!test || !userId) return null
  if (typeof window === 'undefined') return null

  const key = storageKey(test.id, test.assignment_version, userId)
  const stored = safeJsonParse<StoredAssignment>(window.localStorage.getItem(key))
  if (stored?.variant) return { variant: stored.variant, assignment_version: test.assignment_version }
  return null
}

export function assignVariant(testId: string, userId: string): string {
  const test = ACTIVE_TESTS[testId]
  if (!test) return 'control'
  if (!userId) return 'control'

  // Sticky: if localStorage already has an assignment for this (test, version, user), use it.
  if (typeof window !== 'undefined') {
    const key = storageKey(test.id, test.assignment_version, userId)
    const stored = safeJsonParse<StoredAssignment>(window.localStorage.getItem(key))
    if (stored?.variant) return stored.variant

    const variant = chooseVariantDeterministic(test, userId)
    const assigned_at_ms = Date.now()
    window.localStorage.setItem(key, JSON.stringify({ variant, assigned_at_ms } satisfies StoredAssignment))

    emitAssignmentTelemetry({ userId, test, variant })
    return variant
  }

  // Server/Node fallback: deterministic but non-sticky.
  return chooseVariantDeterministic(test, userId)
}

