import { z } from 'zod'

import {
  GuidancePersistenceRecordSchema,
  GuidanceSessionStateSchema,
  GuidanceSnapshotSchema,
  type GuidancePersistenceRecord,
  type GuidanceSessionState,
  type GuidanceSnapshot,
} from '@/lib/guidance/contracts'
import { safeStorage } from '@/lib/safe-storage'

const GUIDANCE_STORAGE_KEY_PREFIX = 'lux-guidance:'
const GUIDANCE_SESSION_STORAGE_KEY_PREFIX = 'lux-guidance-session:'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const GuidancePlanEnvelopeSchema = z.object({
  adaptiveGuidance: z.object({
    record: GuidancePersistenceRecordSchema,
    snapshot: GuidanceSnapshotSchema.optional(),
  }).optional(),
}).passthrough()

export type GuidancePlanEnvelope = z.infer<typeof GuidancePlanEnvelopeSchema>

export function getGuidanceStorageKey(
  userId: string,
  assignmentVersion: string,
): string {
  return `${GUIDANCE_STORAGE_KEY_PREFIX}${assignmentVersion}:${userId}`
}

export function loadLocalGuidanceRecord(
  userId: string,
  assignmentVersion: string,
): GuidancePersistenceRecord | null {
  return safeStorage.getValidatedItem(
    getGuidanceStorageKey(userId, assignmentVersion),
    GuidancePersistenceRecordSchema,
  )
}

export function saveLocalGuidanceRecord(
  userId: string,
  record: GuidancePersistenceRecord,
  assignmentVersion: string,
): void {
  safeStorage.setItem(
    getGuidanceStorageKey(userId, assignmentVersion),
    JSON.stringify(record),
  )
}

export function getGuidanceSessionStorageKey(
  userId: string,
  assignmentVersion: string,
): string {
  return `${GUIDANCE_SESSION_STORAGE_KEY_PREFIX}${assignmentVersion}:${userId}`
}

function getValidatedSessionItem<T>(key: string, schema: z.ZodType<T>): T | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const result = schema.safeParse(parsed)
    if (!result.success) return null

    return result.data
  } catch {
    return null
  }
}

export function loadGuidanceSessionState(
  userId: string,
  assignmentVersion: string,
): GuidanceSessionState | null {
  return getValidatedSessionItem(
    getGuidanceSessionStorageKey(userId, assignmentVersion),
    GuidanceSessionStateSchema,
  )
}

export function saveGuidanceSessionState(
  userId: string,
  assignmentVersion: string,
  sessionState: GuidanceSessionState,
): void {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(
      getGuidanceSessionStorageKey(userId, assignmentVersion),
      JSON.stringify(sessionState),
    )
  } catch {
    // Session persistence is best-effort; the hook falls back to in-memory state.
  }
}

export function clearGuidanceSessionState(
  userId: string,
  assignmentVersion: string,
): void {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.removeItem(
      getGuidanceSessionStorageKey(userId, assignmentVersion),
    )
  } catch {
    // Ignore sessionStorage cleanup failures.
  }
}

export function extractGuidancePlanEnvelope(plan: unknown): GuidancePlanEnvelope | null {
  const result = GuidancePlanEnvelopeSchema.safeParse(plan)
  if (!result.success) return null
  return result.data
}

export function extractRemoteGuidanceRecord(plan: unknown): GuidancePersistenceRecord | null {
  return extractGuidancePlanEnvelope(plan)?.adaptiveGuidance?.record ?? null
}

export function extractRemoteGuidanceSnapshot(plan: unknown): GuidanceSnapshot | null {
  return extractGuidancePlanEnvelope(plan)?.adaptiveGuidance?.snapshot ?? null
}

export function mergePlanWithGuidanceRecord(
  existingPlan: Record<string, unknown> | null | undefined,
  record: GuidancePersistenceRecord,
  snapshot?: GuidanceSnapshot,
): Record<string, unknown> {
  const existingAdaptiveGuidance = isPlainObject(existingPlan?.adaptiveGuidance)
    ? existingPlan.adaptiveGuidance
    : {}

  return {
    ...(existingPlan ?? {}),
    adaptiveGuidance: {
      ...existingAdaptiveGuidance,
      record,
      ...(snapshot ? { snapshot } : {}),
    },
  }
}

export function stripGuidanceFromPlan(
  plan: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!isPlainObject(plan)) return {}

  const { adaptiveGuidance: _adaptiveGuidance, ...rest } = plan
  return rest
}
