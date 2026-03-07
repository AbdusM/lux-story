'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ACTIVE_TESTS, assignVariant } from '@/lib/experiments'
import {
  GUIDANCE_EXPERIMENT_ID,
  GUIDANCE_ONTOLOGY_VERSION,
  GUIDANCE_RECOMMENDATION_VERSION,
  GUIDANCE_SCHEMA_VERSION,
  type AssistMode,
  type GuidanceEvent,
  type GuidanceInput,
  type GuidancePersistenceRecord,
  type GuidanceRecommendation,
  type GuidanceSessionState,
  type GuidanceSnapshot,
} from '@/lib/guidance/contracts'
import {
  applyGuidanceEvent,
  buildGuidanceRecommendationForTask,
  buildGuidanceSnapshot,
  createEmptyGuidanceRecord,
  mergeGuidanceRecords,
} from '@/lib/guidance/engine'
import {
  clearGuidanceSessionState,
  extractGuidancePlanEnvelope,
  extractRemoteGuidanceRecord,
  extractRemoteGuidanceSnapshot,
  loadGuidanceSessionState,
  loadLocalGuidanceRecord,
  saveGuidanceSessionState,
  mergePlanWithGuidanceRecord,
  saveLocalGuidanceRecord,
} from '@/lib/guidance/storage'
import {
  getAdaptiveGuidanceRolloutConfig,
  GUIDANCE_ASSIGNMENT_VERSION,
  resolveAdaptiveGuidanceVariant,
} from '@/lib/guidance/rollout'
import { queueInteractionEventSync } from '@/lib/sync-queue'
import { ensureUserApiSession } from '@/lib/user-api-session'

const REMOTE_SAVE_DEBOUNCE_MS = 300

function ensureGuidanceExperimentRegistered() {
  const rolloutConfig = getAdaptiveGuidanceRolloutConfig()
  const existing = ACTIVE_TESTS[GUIDANCE_EXPERIMENT_ID]

  if (
    existing &&
    existing.assignment_version === rolloutConfig.assignmentVersion &&
    existing.weights?.[0] === rolloutConfig.weights[0] &&
    existing.weights?.[1] === rolloutConfig.weights[1]
  ) {
    return rolloutConfig
  }

  ACTIVE_TESTS[GUIDANCE_EXPERIMENT_ID] = {
    id: rolloutConfig.experimentId,
    variants: ['control', 'adaptive'],
    weights: rolloutConfig.weights,
    assignment_version: rolloutConfig.assignmentVersion,
  }

  return rolloutConfig
}

function extractPlanObject(rawPlan: unknown): Record<string, unknown> | null {
  if (!rawPlan || typeof rawPlan !== 'object' || Array.isArray(rawPlan)) return null
  return rawPlan as Record<string, unknown>
}

function withAssignedVariant(
  record: GuidancePersistenceRecord,
  experimentVariant: GuidancePersistenceRecord['experimentVariant'],
): GuidancePersistenceRecord {
  const assignmentChanged = record.assignmentVersion !== GUIDANCE_ASSIGNMENT_VERSION

  return {
    ...record,
    experimentVariant,
    assignmentVersion: GUIDANCE_ASSIGNMENT_VERSION,
    schemaVersion: GUIDANCE_SCHEMA_VERSION,
    ontologyVersion: GUIDANCE_ONTOLOGY_VERSION,
    recommendationVersion: GUIDANCE_RECOMMENDATION_VERSION,
    dismissedAtByTaskId: assignmentChanged ? {} : record.dismissedAtByTaskId,
  }
}

function createGuidanceSessionState(
  experimentVariant: GuidancePersistenceRecord['experimentVariant'],
  nowIso: string = new Date().toISOString(),
): GuidanceSessionState {
  return {
    sessionId: `guidance_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    assignmentVersion: GUIDANCE_ASSIGNMENT_VERSION,
    experimentVariant,
    pinnedTaskId: null,
    status: 'active',
    updatedAt: nowIso,
  }
}

function isRemoteGuidanceCurrent(
  remotePlan: Record<string, unknown> | null,
  record: GuidancePersistenceRecord,
  snapshot: GuidanceSnapshot,
): boolean {
  if (!remotePlan) return false

  const remoteRecord = extractRemoteGuidanceRecord(
    extractGuidancePlanEnvelope(remotePlan),
  )
  const remoteSnapshot = extractRemoteGuidanceSnapshot(
    extractGuidancePlanEnvelope(remotePlan),
  )

  return (
    JSON.stringify(remoteRecord) === JSON.stringify(record) &&
    JSON.stringify(remoteSnapshot) === JSON.stringify(snapshot)
  )
}

function queueGuidanceInteractionEvent(options: {
  sessionId: string
  userId: string
  eventType: string
  taskId: string
  sourceSurface: string
  assistMode?: AssistMode | null
  reason?: string | null
}): void {
  queueInteractionEventSync({
    user_id: options.userId,
    session_id: options.sessionId,
    event_type: options.eventType,
    payload: {
      event_id: `${options.eventType}:${options.taskId}:${Date.now()}`,
      task_id: options.taskId,
      source_surface: options.sourceSurface,
      assist_mode: options.assistMode ?? null,
      reason: options.reason ?? null,
      guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
      recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
    },
  })
}

export interface UseAdaptiveGuidanceOptions
  extends Omit<GuidanceInput, 'taskProgress'> {
  surface: string
}

export interface UseAdaptiveGuidanceResult {
  isReady: boolean
  isAdaptive: boolean
  record: GuidancePersistenceRecord
  snapshot: GuidanceSnapshot
  stableNextBestMove: GuidanceRecommendation | null
  selectAssistMode: (taskId: string, assistMode: AssistMode) => void
  trackRecommendationClick: (recommendation: GuidanceRecommendation) => void
  trackTaskEvent: (event: GuidanceEvent) => void
  dismissRecommendation: (taskId: string) => void
}

export function useAdaptiveGuidance(
  options: UseAdaptiveGuidanceOptions,
): UseAdaptiveGuidanceResult {
  const rolloutConfig = useMemo(() => ensureGuidanceExperimentRegistered(), [])

  const [record, setRecord] = useState<GuidancePersistenceRecord>(() =>
    createEmptyGuidanceRecord('adaptive'),
  )
  const [isReady, setIsReady] = useState(false)
  const [remotePlan, setRemotePlan] = useState<Record<string, unknown> | null>(null)
  const [sessionState, setSessionState] = useState<GuidanceSessionState | null>(null)

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentPlanRef = useRef<Record<string, unknown> | null>(null)
  const recordRef = useRef(record)
  const sessionStateRef = useRef<GuidanceSessionState | null>(null)
  const shownRecommendationRef = useRef<string | null>(null)
  const didHydrateRemoteSyncRef = useRef(false)

  currentPlanRef.current = remotePlan
  recordRef.current = record
  sessionStateRef.current = sessionState

  useEffect(() => {
    shownRecommendationRef.current = null
    didHydrateRemoteSyncRef.current = false
    setSessionState(null)
  }, [options.playerId])

  const updateSessionState = useCallback((
    updater: (current: GuidanceSessionState | null) => GuidanceSessionState | null,
  ) => {
    const nextState = updater(sessionStateRef.current)
    sessionStateRef.current = nextState
    setSessionState(nextState)

    if (!options.playerId) return

    if (nextState) {
      saveGuidanceSessionState(
        options.playerId,
        GUIDANCE_ASSIGNMENT_VERSION,
        nextState,
      )
      return
    }

    clearGuidanceSessionState(options.playerId, GUIDANCE_ASSIGNMENT_VERSION)
  }, [options.playerId])

  useEffect(() => {
    const userId = options.playerId
    if (!userId) {
      setRecord(createEmptyGuidanceRecord('adaptive'))
      setSessionState(null)
      setIsReady(true)
      return
    }

    let cancelled = false
    const variant = assignVariant(GUIDANCE_EXPERIMENT_ID, userId)
    const assignedVariant = resolveAdaptiveGuidanceVariant(
      variant === 'control' ? 'control' : 'adaptive',
      rolloutConfig,
    )
    const localRecord = loadLocalGuidanceRecord(userId, GUIDANCE_ASSIGNMENT_VERSION)
    const initialRecord = withAssignedVariant(
      mergeGuidanceRecords(
        localRecord,
        createEmptyGuidanceRecord(assignedVariant),
      ) ?? createEmptyGuidanceRecord(assignedVariant),
      assignedVariant,
    )
    const existingSessionState = loadGuidanceSessionState(
      userId,
      GUIDANCE_ASSIGNMENT_VERSION,
    )
    const initialSessionState =
      existingSessionState &&
      existingSessionState.assignmentVersion === GUIDANCE_ASSIGNMENT_VERSION &&
      existingSessionState.experimentVariant === assignedVariant
        ? existingSessionState
        : createGuidanceSessionState(assignedVariant)

    setRecord(initialRecord)
    setSessionState(initialSessionState)
    saveLocalGuidanceRecord(userId, initialRecord, GUIDANCE_ASSIGNMENT_VERSION)
    saveGuidanceSessionState(
      userId,
      GUIDANCE_ASSIGNMENT_VERSION,
      initialSessionState,
    )
    setIsReady(false)

    const loadRemote = async () => {
      const sessionReady = await ensureUserApiSession(userId)
      if (!sessionReady || cancelled) {
        if (!cancelled) {
          setIsReady(true)
        }
        return
      }

      try {
        const response = await fetch(
          `/api/user/action-plan?userId=${encodeURIComponent(userId)}`,
          { credentials: 'include' },
        )

        if (!response.ok) {
          if (!cancelled) {
            setIsReady(true)
          }
          return
        }

        const body = await response.json()
        if (cancelled) return

        const planObject = extractPlanObject(body?.plan)
        const remoteRecord = extractRemoteGuidanceRecord(
          extractGuidancePlanEnvelope(planObject),
        )
        const mergedRecord = withAssignedVariant(
          mergeGuidanceRecords(initialRecord, remoteRecord) ?? initialRecord,
          assignedVariant,
        )

        setRemotePlan(planObject)
        setRecord(mergedRecord)
        saveLocalGuidanceRecord(userId, mergedRecord, GUIDANCE_ASSIGNMENT_VERSION)
      } catch {
        // Keep local guidance state authoritative if the API is unavailable.
      } finally {
        if (!cancelled) {
          setIsReady(true)
        }
      }
    }

    void loadRemote()

    return () => {
      cancelled = true
    }
  }, [
    options.playerId,
    rolloutConfig.adaptivePercentage,
    rolloutConfig.assignmentVersion,
    rolloutConfig.mode,
  ])

  const snapshot = useMemo(() => {
    const input: GuidanceInput = {
      ...options,
      taskProgress: record.taskProgress,
    }
    return buildGuidanceSnapshot(input, record)
  }, [options, record])

  useEffect(() => {
    if (!options.playerId || !isReady || !remotePlan) return
    if (didHydrateRemoteSyncRef.current) return

    didHydrateRemoteSyncRef.current = true

    if (isRemoteGuidanceCurrent(remotePlan, record, snapshot)) {
      return
    }

    saveLocalGuidanceRecord(options.playerId, record, GUIDANCE_ASSIGNMENT_VERSION)

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(async () => {
      const sessionReady = await ensureUserApiSession(options.playerId)
      if (!sessionReady) return

      const nextPlan = mergePlanWithGuidanceRecord(remotePlan, record, snapshot)

      try {
        const response = await fetch('/api/user/action-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId: options.playerId,
            plan: nextPlan,
          }),
        })

        if (!response.ok) return
        currentPlanRef.current = nextPlan
        setRemotePlan(nextPlan)
      } catch {
        // Hydration sync is best-effort; local state remains authoritative.
      }
    }, REMOTE_SAVE_DEBOUNCE_MS)
  }, [isReady, options.playerId, record, remotePlan, snapshot])

  useEffect(() => {
    if (!options.playerId || !sessionState) return

    saveGuidanceSessionState(
      options.playerId,
      GUIDANCE_ASSIGNMENT_VERSION,
      sessionState,
    )
  }, [options.playerId, sessionState])

  useEffect(() => {
    if (!options.playerId || !isReady) return
    if (record.experimentVariant !== 'adaptive') return
    if (!sessionState || sessionState.status !== 'active') return
    if (sessionState.pinnedTaskId || !snapshot.nextBestMove) return

    updateSessionState((current) => {
      if (!current || current.status !== 'active' || current.pinnedTaskId) {
        return current
      }

      return {
        ...current,
        pinnedTaskId: snapshot.nextBestMove?.taskId ?? null,
        updatedAt: new Date().toISOString(),
      }
    })
  }, [
    isReady,
    options.playerId,
    record.experimentVariant,
    sessionState,
    snapshot.nextBestMove,
    updateSessionState,
  ])

  const stableNextBestMove = useMemo(() => {
    if (record.experimentVariant === 'control') return null
    if (!sessionState || sessionState.status !== 'active') return null

    const pinnedTaskId = sessionState.pinnedTaskId ?? snapshot.nextBestMove?.taskId
    if (!pinnedTaskId) return null

    return buildGuidanceRecommendationForTask(
      pinnedTaskId,
      {
        ...options,
        taskProgress: record.taskProgress,
      },
      record,
    )
  }, [options, record, sessionState, snapshot.nextBestMove])

  useEffect(() => {
    if (!sessionState || sessionState.status !== 'active' || !sessionState.pinnedTaskId) return

    const pinnedTaskId = sessionState.pinnedTaskId

    const pinnedRecommendation = buildGuidanceRecommendationForTask(
      pinnedTaskId,
      {
        ...options,
        taskProgress: record.taskProgress,
      },
      record,
    )

    if (pinnedRecommendation) return

    updateSessionState((current) => {
      if (!current || current.pinnedTaskId !== pinnedTaskId) {
        return current
      }

      return {
        ...current,
        pinnedTaskId: null,
        status: record.dismissedAtByTaskId[pinnedTaskId] ? 'dismissed' : 'completed',
        updatedAt: new Date().toISOString(),
      }
    })
  }, [options, record, sessionState, updateSessionState])

  useEffect(() => {
    if (!options.playerId || !stableNextBestMove || record.experimentVariant === 'control') return

    if (shownRecommendationRef.current === stableNextBestMove.taskId) return
    shownRecommendationRef.current = stableNextBestMove.taskId

    queueGuidanceInteractionEvent({
      sessionId: sessionStateRef.current?.sessionId ?? `guidance_${Date.now()}`,
      userId: options.playerId,
      eventType: 'recommendation_shown',
      taskId: stableNextBestMove.taskId,
      sourceSurface: options.surface,
      reason: stableNextBestMove.reason,
    })
  }, [options.playerId, options.surface, record.experimentVariant, stableNextBestMove])

  const persistRecord = useCallback((
    nextRecord: GuidancePersistenceRecord,
    nextSnapshot: GuidanceSnapshot,
  ) => {
    const userId = options.playerId
    if (!userId) return

    saveLocalGuidanceRecord(userId, nextRecord, GUIDANCE_ASSIGNMENT_VERSION)

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(async () => {
      const sessionReady = await ensureUserApiSession(userId)
      if (!sessionReady) return

      const nextPlan = mergePlanWithGuidanceRecord(
        currentPlanRef.current,
        nextRecord,
        nextSnapshot,
      )

      try {
        const response = await fetch('/api/user/action-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            userId,
            plan: nextPlan,
          }),
        })

        if (!response.ok) return
        currentPlanRef.current = nextPlan
        setRemotePlan(nextPlan)
      } catch {
        // Local persistence remains the primary fallback.
      }
    }, REMOTE_SAVE_DEBOUNCE_MS)
  }, [options.playerId])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  const commitEvent = useCallback((event: GuidanceEvent, interactionEventType: string) => {
    const nextRecord = applyGuidanceEvent(recordRef.current, event)
    const nextSnapshot = buildGuidanceSnapshot(
      {
        ...options,
        taskProgress: nextRecord.taskProgress,
      },
      nextRecord,
    )
    recordRef.current = nextRecord
    setRecord(nextRecord)
    persistRecord(nextRecord, nextSnapshot)

    const currentSession = sessionStateRef.current
    if (currentSession?.pinnedTaskId === event.taskId) {
      if (event.kind === 'dismissed') {
        updateSessionState((session) => {
          if (!session || session.pinnedTaskId !== event.taskId) return session
          return {
            ...session,
            pinnedTaskId: null,
            status: 'dismissed',
            updatedAt: new Date().toISOString(),
          }
        })
      }

      if (event.kind === 'completed' || event.kind === 'artifact_exported') {
        updateSessionState((session) => {
          if (!session || session.pinnedTaskId !== event.taskId) return session
          return {
            ...session,
            pinnedTaskId: null,
            status: 'completed',
            updatedAt: new Date().toISOString(),
          }
        })
      }
    }

    if (options.playerId) {
      queueGuidanceInteractionEvent({
        sessionId: sessionStateRef.current?.sessionId ?? `guidance_${Date.now()}`,
        userId: options.playerId,
        eventType: interactionEventType,
        taskId: event.taskId,
        sourceSurface: options.surface,
        assistMode: event.assistMode ?? null,
      })
    }
  }, [options, options.playerId, options.surface, persistRecord, updateSessionState])

  const selectAssistMode = useCallback((taskId: string, assistMode: AssistMode) => {
    commitEvent(
      {
        taskId,
        kind: 'assist_mode_selected',
        assistMode,
      },
      'assist_mode_selected',
    )
  }, [commitEvent])

  const trackTaskEvent = useCallback((event: GuidanceEvent) => {
    const interactionEventTypeMap: Record<GuidanceEvent['kind'], string> = {
      viewed: 'task_exposed',
      assist_mode_selected: 'assist_mode_selected',
      started: 'task_started',
      completed: 'task_completed',
      dismissed: 'recommendation_dismissed',
      artifact_exported: 'artifact_exported',
    }

    commitEvent(event, interactionEventTypeMap[event.kind])
  }, [commitEvent])

  const dismissRecommendation = useCallback((taskId: string) => {
    commitEvent(
      {
        taskId,
        kind: 'dismissed',
      },
      'recommendation_dismissed',
    )
  }, [commitEvent])

  const trackRecommendationClick = useCallback((recommendation: GuidanceRecommendation) => {
    if (!options.playerId) return

    queueGuidanceInteractionEvent({
      sessionId: sessionStateRef.current?.sessionId ?? `guidance_${Date.now()}`,
      userId: options.playerId,
      eventType: 'recommendation_clicked',
      taskId: recommendation.taskId,
      sourceSurface: options.surface,
      assistMode:
        recordRef.current.taskProgress[recommendation.taskId]?.latestAssistMode ?? null,
      reason: recommendation.reason,
    })
  }, [options.playerId, options.surface])

  return {
    isReady,
    isAdaptive: record.experimentVariant === 'adaptive',
    record,
    snapshot,
    stableNextBestMove,
    selectAssistMode,
    trackRecommendationClick,
    trackTaskEvent,
    dismissRecommendation,
  }
}
