'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, ArrowUpRight, BarChart3, CheckCircle, ClipboardList, Database, AlertTriangle, Radar, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react'
import { AdminUtilityNav } from '@/components/admin/AdminUtilityNav'
import { cn } from '@/lib/utils'
import type {
  AdminStudentInsightsFollowUpActor,
  AdminStudentInsightsFollowUpStatus,
  AdminLaborMarketSignalDatasetSummary,
  AdminLaborMarketSignalReport,
  AdminLaborMarketSignalRowSummary,
  AdminLaborMarketSignalsResponse,
  AdminStudentInsightsFunnelSummary,
  AdminStudentInsightsSummaryResponse,
  AdminStudentInsightsQueueFlag,
  AdminStudentInsightsWorklistResponse,
  AdminStudentInsightsWorklistSummary,
} from '@/lib/types/admin-api'

interface ConsistencyIssue {
  type: 'orphaned_profile' | 'orphaned_player_profile' | 'missing_profile' | 'missing_player_profile' | 'text_fk_mismatch'
  userId: string
  details: string
  autoFixable: boolean
  fixed?: boolean
}

interface ConsistencyReport {
  timestamp: string
  totalUsers: number
  totalProfiles: number
  totalPlayerProfiles: number
  issues: ConsistencyIssue[]
  fixesApplied: number
  healthy: boolean
}

const ISSUE_TYPE_LABELS: Record<ConsistencyIssue['type'], string> = {
  'orphaned_profile': 'Orphaned Profile',
  'orphaned_player_profile': 'Orphaned Player Profile',
  'missing_profile': 'Missing Profile',
  'missing_player_profile': 'Missing Player Profile',
  'text_fk_mismatch': 'TEXT FK Guest User'
}

const ISSUE_TYPE_SEVERITY: Record<ConsistencyIssue['type'], 'error' | 'warning' | 'info'> = {
  'orphaned_profile': 'error',
  'orphaned_player_profile': 'error',
  'missing_profile': 'error',
  'missing_player_profile': 'info',
  'text_fk_mismatch': 'info' // Intentional for multi-tenant
}

const STUDENT_FUNNEL_DAY_OPTIONS = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
] as const

const STUDENT_INSIGHTS_SURFACE_LABELS: Record<string, string> = {
  student_insights_signals: 'Signals',
  student_insights_action_plan: 'Action Plan',
}

const STUDENT_INSIGHTS_QUEUE_FLAG_LABELS: Record<AdminStudentInsightsQueueFlag, string> = {
  needs_review: 'Needs Review',
  needs_outcome_check_in: 'Needs Check-In',
  high_effort_no_interview: 'High Effort / No Interview',
  stalled_without_interview: 'Stalled / No Interview',
}

const STUDENT_INSIGHTS_QUEUE_FLAG_BADGE: Record<AdminStudentInsightsQueueFlag, 'secondary' | 'destructive' | 'outline' | 'default'> = {
  needs_review: 'secondary',
  needs_outcome_check_in: 'outline',
  high_effort_no_interview: 'destructive',
  stalled_without_interview: 'default',
}

const STUDENT_INSIGHTS_FOLLOW_UP_LABELS: Record<AdminStudentInsightsFollowUpStatus, string> = {
  contacted: 'Contacted',
  follow_up_due: 'Follow-Up Due',
  resolved: 'Resolved',
}

function buildWorklistNoteDrafts(summary: AdminStudentInsightsWorklistSummary): Record<string, string> {
  return Object.fromEntries(
    summary.items.map((item) => [item.userId, item.followUpNote ?? '']),
  )
}

function extractFollowUpActor(value: unknown): AdminStudentInsightsFollowUpActor | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const candidate = value as Record<string, unknown>
  const userId = typeof candidate.userId === 'string' ? candidate.userId : null
  if (!userId) return null

  return {
    userId,
    email: typeof candidate.email === 'string' ? candidate.email : null,
    fullName: typeof candidate.fullName === 'string' ? candidate.fullName : null,
  }
}

function formatFollowUpActor(actor: AdminStudentInsightsFollowUpActor | null): string {
  if (!actor) return 'Unknown counselor'
  return actor.fullName || actor.email || actor.userId
}

export default function AdminDiagnosticsPage() {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ConsistencyReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [laborSignalLoading, setLaborSignalLoading] = useState(false)
  const [laborSignalReport, setLaborSignalReport] = useState<AdminLaborMarketSignalReport | null>(null)
  const [laborSignalError, setLaborSignalError] = useState<string | null>(null)
  const [studentInsightsLoading, setStudentInsightsLoading] = useState(false)
  const [studentInsightsSummary, setStudentInsightsSummary] = useState<AdminStudentInsightsFunnelSummary | null>(null)
  const [studentInsightsWorklist, setStudentInsightsWorklist] = useState<AdminStudentInsightsWorklistSummary | null>(null)
  const [studentInsightsError, setStudentInsightsError] = useState<string | null>(null)
  const [studentInsightsDays, setStudentInsightsDays] = useState<number>(30)
  const [queueFlagFilter, setQueueFlagFilter] = useState<'all' | AdminStudentInsightsQueueFlag>('all')
  const [queueFollowUpFilter, setQueueFollowUpFilter] = useState<'all' | 'untracked' | AdminStudentInsightsFollowUpStatus>('all')
  const [worklistSavingUserId, setWorklistSavingUserId] = useState<string | null>(null)
  const [worklistSaveError, setWorklistSaveError] = useState<string | null>(null)
  const [worklistNoteDrafts, setWorklistNoteDrafts] = useState<Record<string, string>>({})

  const runConsistencyCheck = async (autoFix: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/consistency-check?autoFix=${autoFix}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to run consistency check')
      }

      const data: ConsistencyReport = await response.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const errorIssues = report?.issues.filter(i => ISSUE_TYPE_SEVERITY[i.type] === 'error') || []
  const warningIssues = report?.issues.filter(i => ISSUE_TYPE_SEVERITY[i.type] === 'warning') || []
  const infoIssues = report?.issues.filter(i => ISSUE_TYPE_SEVERITY[i.type] === 'info') || []

  const runLaborSignalCheck = useCallback(async () => {
    setLaborSignalLoading(true)
    setLaborSignalError(null)

    try {
      const response = await fetch('/api/admin/labor-market-signals')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to load labor market diagnostics')
      }

      const data: AdminLaborMarketSignalsResponse = await response.json()
      setLaborSignalReport(data.report)
    } catch (err) {
      setLaborSignalError(err instanceof Error ? err.message : 'Unknown error occurred')
      setLaborSignalReport(null)
    } finally {
      setLaborSignalLoading(false)
    }
  }, [])

  const runStudentInsightsCheck = useCallback(async () => {
    setStudentInsightsLoading(true)
    setStudentInsightsError(null)

    try {
      const [summaryResponse, worklistResponse] = await Promise.all([
        fetch(`/api/admin/student-insights-summary?days=${studentInsightsDays}`),
        fetch(`/api/admin/student-insights-worklist?days=${studentInsightsDays}&limit=20`),
      ])

      if (!summaryResponse.ok) {
        const data = await summaryResponse.json()
        throw new Error(data.error || 'Failed to load student insights summary')
      }

      if (!worklistResponse.ok) {
        const data = await worklistResponse.json()
        throw new Error(data.error || 'Failed to load student insights worklist')
      }

      const summaryData: AdminStudentInsightsSummaryResponse = await summaryResponse.json()
      const worklistData: AdminStudentInsightsWorklistResponse = await worklistResponse.json()
      setStudentInsightsSummary(summaryData.summary)
      setStudentInsightsWorklist(worklistData.worklist)
      setWorklistNoteDrafts(buildWorklistNoteDrafts(worklistData.worklist))
      setWorklistSaveError(null)
    } catch (err) {
      setStudentInsightsError(err instanceof Error ? err.message : 'Unknown error occurred')
      setStudentInsightsSummary(null)
      setStudentInsightsWorklist(null)
      setWorklistNoteDrafts({})
    } finally {
      setStudentInsightsLoading(false)
    }
  }, [studentInsightsDays])

  useEffect(() => {
    void runLaborSignalCheck()
  }, [runLaborSignalCheck])

  useEffect(() => {
    void runStudentInsightsCheck()
  }, [runStudentInsightsCheck])

  const filteredWorklistItems = useMemo(() => {
    const items = studentInsightsWorklist?.items ?? []
    return items.filter((item) => {
      const matchesFlag = queueFlagFilter === 'all' || item.flags.includes(queueFlagFilter)
      const matchesFollowUp =
        queueFollowUpFilter === 'all'
          ? true
          : queueFollowUpFilter === 'untracked'
            ? item.followUpStatus === null
            : item.followUpStatus === queueFollowUpFilter

      return matchesFlag && matchesFollowUp
    })
  }, [queueFlagFilter, queueFollowUpFilter, studentInsightsWorklist])

  const handleFollowUpUpdate = useCallback(async (
    userId: string,
    status: AdminStudentInsightsFollowUpStatus,
    noteOverride?: string,
  ) => {
    setWorklistSavingUserId(userId)
    setWorklistSaveError(null)
    const note = (noteOverride ?? worklistNoteDrafts[userId] ?? '').trim()

    try {
      const response = await fetch('/api/admin/action-plan-follow-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          followUp: {
            status,
            ...(note.length > 0 ? { note } : {}),
          },
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update follow-up status')
      }

      const updatedAt = typeof data?.followUp?.updatedAt === 'string'
        ? data.followUp.updatedAt
        : new Date().toISOString()
      const savedNote = typeof data?.followUp?.note === 'string' ? data.followUp.note : ''
      const savedUpdatedBy = extractFollowUpActor(data?.followUp?.updatedBy)

      setStudentInsightsWorklist((current) => {
        if (!current) return current
        return {
          ...current,
          items: current.items.map((item) => (
            item.userId === userId
              ? {
                  ...item,
                  followUpStatus: status,
                  followUpUpdatedAt: updatedAt,
                  followUpNote: savedNote || null,
                  followUpUpdatedBy: savedUpdatedBy,
                }
              : item
          )),
        }
      })
      setWorklistNoteDrafts((current) => ({
        ...current,
        [userId]: savedNote,
      }))
    } catch (error) {
      setWorklistSaveError(error instanceof Error ? error.message : 'Failed to update follow-up status')
    } finally {
      setWorklistSavingUserId(null)
    }
  }, [worklistNoteDrafts])

  const handleFollowUpNoteChange = useCallback((userId: string, value: string) => {
    setWorklistNoteDrafts((current) => ({
      ...current,
      [userId]: value,
    }))
  }, [])

  const handleFollowUpNoteSave = useCallback(async (
    userId: string,
    currentStatus: AdminStudentInsightsFollowUpStatus | null,
  ) => {
    if (!currentStatus) {
      setWorklistSaveError('Set a follow-up status before saving a counselor note.')
      return
    }

    await handleFollowUpUpdate(userId, currentStatus, worklistNoteDrafts[userId] ?? '')
  }, [handleFollowUpUpdate, worklistNoteDrafts])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Diagnostics</h1>
            <p className="text-gray-600 mt-1">Database consistency checks and system health monitoring</p>
          </div>
          <Database className="w-12 h-12 text-blue-600" />
        </div>

        <AdminUtilityNav />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-sky-600" />
              Labor Signal Diagnostics
            </CardTitle>
            <CardDescription>
              Freshness, canonical coverage, alias-only rows, and fallback risk for the labor-market signal layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => void runLaborSignalCheck()}
                disabled={laborSignalLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {laborSignalLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Radar className="w-4 h-4" />
                    Refresh Labor Signals
                  </>
                )}
              </Button>
            </div>

            {laborSignalError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Labor Signal Error</p>
                  <p className="text-sm text-red-700">{laborSignalError}</p>
                </div>
              </div>
            )}

            {laborSignalReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <SignalMetricCard
                    label="Fresh Rows"
                    value={laborSignalReport.totals.freshRows}
                    tone="success"
                    detail={`${laborSignalReport.totals.totalRows} total rows`}
                  />
                  <SignalMetricCard
                    label="Warning Rows"
                    value={laborSignalReport.totals.warningRows}
                    tone={laborSignalReport.totals.warningRows > 0 ? 'warning' : 'neutral'}
                    detail={`Threshold ${laborSignalReport.warningThresholdDays} days`}
                  />
                  <SignalMetricCard
                    label="Urgent Rows"
                    value={laborSignalReport.totals.staleRows + laborSignalReport.totals.invalidTimestampRows}
                    tone={
                      laborSignalReport.totals.staleRows + laborSignalReport.totals.invalidTimestampRows > 0
                        ? 'danger'
                        : 'success'
                    }
                    detail="Stale or invalid timestamps"
                  />
                  <SignalMetricCard
                    label="Fallback Risk"
                    value={laborSignalReport.fallbackRisk.totalMissingCanonicalMatches}
                    tone={
                      laborSignalReport.fallbackRisk.totalMissingCanonicalMatches > 0
                        ? 'danger'
                        : 'success'
                    }
                    detail={`${laborSignalReport.fallbackRisk.aliasOnlyRowCount} alias-only rows`}
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {laborSignalReport.datasets.map((dataset) => (
                    <SignalDatasetCard key={dataset.kind} dataset={dataset} />
                  ))}
                </div>

                <Card className="border-slate-200 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Expirations</CardTitle>
                    <CardDescription>
                      Next dataset rows to age out under the current freshness policy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {laborSignalReport.upcomingExpirations.map((row) => (
                      <SignalRow key={`${row.kind}-${row.summary}`} row={row} />
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">Fallback Coverage</CardTitle>
                    <CardDescription>
                      Canonical lanes missing from curated datasets would fall back to heuristic logic.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {laborSignalReport.fallbackRisk.totalMissingCanonicalMatches === 0 ? (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900 flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-semibold">Canonical coverage is complete.</p>
                          <p>No Birmingham lane currently falls back outside the curated signal maps.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 flex items-start gap-3">
                        <ShieldAlert className="mt-0.5 h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-semibold">Fallback risk detected.</p>
                          <p>
                            {laborSignalReport.fallbackRisk.totalMissingCanonicalMatches} canonical lane matches are missing from the curated datasets.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <FallbackList
                        label="Observed Exposure Missing"
                        items={laborSignalReport.fallbackRisk.observedExposureMissingCareerIds}
                      />
                      <FallbackList
                        label="Entry Friction Missing"
                        items={laborSignalReport.fallbackRisk.entryFrictionMissingCareerIds}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Student Insights Funnel
            </CardTitle>
            <CardDescription>
              Whether nowcasting signals are driving plan and proof behavior (interaction events).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => void runStudentInsightsCheck()}
                  disabled={studentInsightsLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {studentInsightsLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      Refresh Student Funnel
                    </>
                  )}
                </Button>

                <div className="min-w-[170px]">
                  <Select
                    value={String(studentInsightsDays)}
                    onValueChange={(value) => {
                      const parsed = Number.parseInt(value, 10)
                      if (Number.isFinite(parsed)) setStudentInsightsDays(parsed)
                    }}
                  >
                    <SelectTrigger className="bg-white/80">
                      <SelectValue placeholder="Time window" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDENT_FUNNEL_DAY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {studentInsightsSummary && (
                <p className="text-xs text-slate-500">
                  Rows scanned: {studentInsightsSummary.metadata.eventRowsScanned.toLocaleString()} (limit {studentInsightsSummary.eventLimit.toLocaleString()})
                </p>
              )}
            </div>

            {studentInsightsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Student Funnel Error</p>
                  <p className="text-sm text-red-700">{studentInsightsError}</p>
                </div>
              </div>
            )}

            {studentInsightsSummary && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <SignalMetricCard
                    label="Users"
                    value={studentInsightsSummary.totals.uniqueUsers}
                    tone="neutral"
                    detail={`Last ${studentInsightsSummary.days} days`}
                  />
                  <SignalMetricCard
                    label="Signals Shown"
                    value={studentInsightsSummary.totals.counts.recommendationShown}
                    tone="neutral"
                    detail="recommendation_shown"
                  />
                  <SignalMetricCard
                    label="Signals CTR"
                    value={studentInsightsSummary.totals.rates.recommendationCtr}
                    tone={studentInsightsSummary.totals.rates.recommendationCtr > 0 ? 'success' : 'neutral'}
                    detail="% clicked / shown"
                  />
                  <SignalMetricCard
                    label="Plans Completed"
                    value={studentInsightsSummary.totals.counts.taskCompleted}
                    tone={studentInsightsSummary.totals.counts.taskCompleted > 0 ? 'success' : 'neutral'}
                    detail="task_completed"
                  />
                  <SignalMetricCard
                    label="Proof Exported"
                    value={studentInsightsSummary.totals.counts.artifactExported}
                    tone={studentInsightsSummary.totals.counts.artifactExported > 0 ? 'success' : 'neutral'}
                    detail="artifact_exported"
                  />
                  <SignalMetricCard
                    label="Outcome Check-Ins"
                    value={studentInsightsSummary.totals.counts.outcomeCheckInSubmitted}
                    tone={studentInsightsSummary.totals.counts.outcomeCheckInSubmitted > 0 ? 'success' : 'neutral'}
                    detail="outcome_checkin_submitted"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <SignalMetricCard
                    label="Plan Start Rate"
                    value={studentInsightsSummary.totals.rates.startRate}
                    tone={studentInsightsSummary.totals.rates.startRate > 0 ? 'success' : 'neutral'}
                    detail="% started / exposed"
                  />
                  <SignalMetricCard
                    label="Plan Completion"
                    value={studentInsightsSummary.totals.rates.completionRate}
                    tone={studentInsightsSummary.totals.rates.completionRate > 0 ? 'success' : 'neutral'}
                    detail="% completed / started"
                  />
                  <SignalMetricCard
                    label="Export Rate"
                    value={studentInsightsSummary.totals.rates.artifactExportRate}
                    tone={studentInsightsSummary.totals.rates.artifactExportRate > 0 ? 'success' : 'neutral'}
                    detail="% exported / completed"
                  />
                  <SignalMetricCard
                    label="Outcome Rate"
                    value={studentInsightsSummary.totals.rates.outcomeCheckInRate}
                    tone={studentInsightsSummary.totals.rates.outcomeCheckInRate > 0 ? 'success' : 'neutral'}
                    detail="% check-ins / completed"
                  />
                </div>

                <div className="rounded-lg border border-slate-200 bg-white/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">Surface Breakdown</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {studentInsightsSummary.surfaces.map((surface) => {
                      const label = STUDENT_INSIGHTS_SURFACE_LABELS[surface.surface] ?? surface.surface
                      return (
                        <div
                          key={surface.surface}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                            {label}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-slate-500">Users</p>
                              <p className="font-semibold text-slate-900">{surface.uniqueUsers}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Signals Shown</p>
                              <p className="font-semibold text-slate-900">{surface.counts.recommendationShown}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Signals CTR</p>
                              <p className="font-semibold text-slate-900">{surface.rates.recommendationCtr}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Plan Started</p>
                              <p className="font-semibold text-slate-900">{surface.counts.taskStarted}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Plan Completed</p>
                              <p className="font-semibold text-slate-900">{surface.counts.taskCompleted}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Proof Exported</p>
                              <p className="font-semibold text-slate-900">{surface.counts.artifactExported}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Outcome Check-Ins</p>
                              <p className="font-semibold text-slate-900">{surface.counts.outcomeCheckInSubmitted}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {studentInsightsWorklist && (
                  <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.35fr] gap-4">
                    <Card className="border-slate-200 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <BarChart3 className="h-5 w-5 text-emerald-600" />
                          Outcome Snapshot
                        </CardTitle>
                        <CardDescription>
                          Learner-reported momentum from saved 30-day check-ins.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <SignalMetricCard
                            label="Reporters"
                            value={studentInsightsWorklist.outcomeSnapshot.reporters}
                            tone="neutral"
                            detail="saved check-ins"
                          />
                          <SignalMetricCard
                            label="Interview Booked"
                            value={studentInsightsWorklist.outcomeSnapshot.firstInterviewBooked}
                            tone={studentInsightsWorklist.outcomeSnapshot.firstInterviewBooked > 0 ? 'success' : 'neutral'}
                            detail="first interview"
                          />
                          <SignalMetricCard
                            label="Zero-Interview Check-Ins"
                            value={studentInsightsWorklist.outcomeSnapshot.zeroInterviewCheckIns}
                            tone={studentInsightsWorklist.outcomeSnapshot.zeroInterviewCheckIns > 0 ? 'warning' : 'neutral'}
                            detail="reported no interviews"
                          />
                          <SignalMetricCard
                            label="Flagged Learners"
                            value={studentInsightsWorklist.flaggedUsers}
                            tone={studentInsightsWorklist.flaggedUsers > 0 ? 'warning' : 'success'}
                            detail={`${studentInsightsWorklist.totalUsersConsidered} considered`}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Avg applications (30d)</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">
                              {studentInsightsWorklist.outcomeSnapshot.averageApplicationsSubmitted30d}
                            </p>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Avg interviews (30d)</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">
                              {studentInsightsWorklist.outcomeSnapshot.averageInterviewsSecured30d}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(studentInsightsWorklist.flags).map(([flag, count]) => (
                            <div
                              key={flag}
                              className="rounded-lg border border-slate-200 bg-white/80 p-3"
                            >
                              <p className="text-xs text-slate-500">
                                {STUDENT_INSIGHTS_QUEUE_FLAG_LABELS[flag as AdminStudentInsightsQueueFlag]}
                              </p>
                              <p className="mt-1 text-lg font-semibold text-slate-900">{count}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <ClipboardList className="h-5 w-5 text-indigo-600" />
                          Counselor Queue
                        </CardTitle>
                        <CardDescription>
                          Learners who need review or follow-up based on saved plan and check-in signals.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3 md:flex-row md:items-center md:justify-between">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="min-w-[190px]">
                              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                                Flag Filter
                              </p>
                              <Select
                                value={queueFlagFilter}
                                onValueChange={(value) => {
                                  setQueueFlagFilter(value as 'all' | AdminStudentInsightsQueueFlag)
                                }}
                              >
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="All flags" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Flags</SelectItem>
                                  {Object.entries(STUDENT_INSIGHTS_QUEUE_FLAG_LABELS).map(([flag, label]) => (
                                    <SelectItem key={flag} value={flag}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="min-w-[190px]">
                              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                                Follow-Up Filter
                              </p>
                              <Select
                                value={queueFollowUpFilter}
                                onValueChange={(value) => {
                                  setQueueFollowUpFilter(value as 'all' | 'untracked' | AdminStudentInsightsFollowUpStatus)
                                }}
                              >
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="All follow-up states" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Follow-Up States</SelectItem>
                                  <SelectItem value="untracked">Untracked</SelectItem>
                                  {Object.entries(STUDENT_INSIGHTS_FOLLOW_UP_LABELS).map(([status, label]) => (
                                    <SelectItem key={status} value={status}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600">
                            Showing {filteredWorklistItems.length} of {studentInsightsWorklist.items.length} flagged learners
                          </p>
                        </div>

                        {worklistSaveError ? (
                          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {worklistSaveError}
                          </div>
                        ) : null}

                        {filteredWorklistItems.length === 0 ? (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                            No learners match the current queue filters.
                          </div>
                        ) : (
                          filteredWorklistItems.map((item) => (
                            <div
                              key={item.userId}
                              className="rounded-lg border border-slate-200 bg-white/80 p-4"
                            >
                              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="space-y-2">
                                  <div>
                                    <p className="font-semibold text-slate-900">
                                      {item.fullName || item.email || item.userId}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {item.email && item.fullName ? `${item.email} · ` : ''}{item.userId}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {item.flags.map((flag) => (
                                      <Badge key={flag} variant={STUDENT_INSIGHTS_QUEUE_FLAG_BADGE[flag]}>
                                        {STUDENT_INSIGHTS_QUEUE_FLAG_LABELS[flag]}
                                      </Badge>
                                    ))}
                                    <Badge variant="outline">
                                      Review: {item.advisorReviewStatus ? item.advisorReviewStatus.replace('_', ' ') : 'none'}
                                    </Badge>
                                    <Badge variant={item.followUpStatus === 'resolved' ? 'default' : 'outline'}>
                                      Follow-Up: {item.followUpStatus ? STUDENT_INSIGHTS_FOLLOW_UP_LABELS[item.followUpStatus] : 'Untracked'}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-700 md:grid-cols-4">
                                    <div>
                                      <p className="text-xs text-slate-500">Plans Completed</p>
                                      <p className="font-semibold">{item.counts.taskCompleted}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Proof Exported</p>
                                      <p className="font-semibold">{item.counts.artifactExported}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Applications (30d)</p>
                                      <p className="font-semibold">{item.outcomeCheckIn?.applicationsSubmitted30d ?? 0}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500">Interviews (30d)</p>
                                      <p className="font-semibold">{item.outcomeCheckIn?.interviewsSecured30d ?? 0}</p>
                                    </div>
                                  </div>

                                  <p className="text-xs text-slate-500">
                                    {item.outcomeCheckIn
                                      ? `Check-in ${new Date(item.outcomeCheckIn.updatedAt).toLocaleString()} · First interview booked: ${item.outcomeCheckIn.firstInterviewBooked ? 'yes' : 'no'}`
                                      : item.actionPlanUpdatedAt
                                        ? `Plan updated ${new Date(item.actionPlanUpdatedAt).toLocaleString()}`
                                        : item.latestEventAt
                                          ? `Latest event ${new Date(item.latestEventAt).toLocaleString()}`
                                          : 'No recent timestamp'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {item.followUpUpdatedAt
                                      ? `Follow-up updated ${new Date(item.followUpUpdatedAt).toLocaleString()} by ${formatFollowUpActor(item.followUpUpdatedBy)}`
                                      : 'No counselor follow-up status set yet.'}
                                  </p>
                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`follow-up-note-${item.userId}`}
                                      className="text-xs font-medium uppercase tracking-wide text-slate-500"
                                    >
                                      Counselor Note
                                    </label>
                                    <textarea
                                      id={`follow-up-note-${item.userId}`}
                                      value={worklistNoteDrafts[item.userId] ?? ''}
                                      onChange={(event) => handleFollowUpNoteChange(item.userId, event.target.value)}
                                      disabled={worklistSavingUserId === item.userId}
                                      rows={3}
                                      maxLength={2000}
                                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                                      placeholder="Add counselor context, outreach notes, or next-step reminders."
                                    />
                                    <p className="text-xs text-slate-500">
                                      {item.followUpUpdatedBy
                                        ? `Last updated by ${formatFollowUpActor(item.followUpUpdatedBy)}`
                                        : 'No counselor owner recorded yet.'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Button
                                    type="button"
                                    variant={item.followUpStatus === 'contacted' ? 'default' : 'outline'}
                                    size="sm"
                                    className="bg-white"
                                    disabled={worklistSavingUserId === item.userId}
                                    onClick={() => void handleFollowUpUpdate(item.userId, 'contacted')}
                                  >
                                    Contacted
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={item.followUpStatus === 'follow_up_due' ? 'default' : 'outline'}
                                    size="sm"
                                    className="bg-white"
                                    disabled={worklistSavingUserId === item.userId}
                                    onClick={() => void handleFollowUpUpdate(item.userId, 'follow_up_due')}
                                  >
                                    Follow-Up Due
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={item.followUpStatus === 'resolved' ? 'default' : 'outline'}
                                    size="sm"
                                    className="bg-white"
                                    disabled={worklistSavingUserId === item.userId}
                                    onClick={() => void handleFollowUpUpdate(item.userId, 'resolved')}
                                  >
                                    Resolved
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="bg-white"
                                    disabled={worklistSavingUserId === item.userId}
                                    onClick={() => void handleFollowUpNoteSave(item.userId, item.followUpStatus)}
                                  >
                                    Save Note
                                  </Button>
                                  <Button asChild variant="outline" size="sm" className="gap-2 bg-white">
                                    <Link href={`/admin/${encodeURIComponent(item.userId)}/action`}>
                                      Open Learner
                                      <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {studentInsightsSummary.metadata.truncated && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-semibold">Event limit reached.</p>
                      <p>
                        Showing summary derived from the newest {studentInsightsSummary.eventLimit} events. Increase limits if needed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Data Consistency Check</CardTitle>
            <CardDescription>
              Validates relationships between auth.users, profiles, and player_profiles tables.
              Detects orphaned records, missing links, and data drift.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => runConsistencyCheck(false)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Run Check (Read-Only)
                  </>
                )}
              </Button>

              <Button
                onClick={() => runConsistencyCheck(true)}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Run Check + Auto-Fix
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {report && (
          <>
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {report.healthy ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  )}
                  {report.healthy ? 'System Healthy' : 'Issues Detected'}
                </CardTitle>
                <CardDescription>
                  Last checked: {new Date(report.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Auth Users</p>
                    <p className="text-2xl font-bold text-blue-900">{report.totalUsers}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 font-medium">Profiles</p>
                    <p className="text-2xl font-bold text-purple-900">{report.totalProfiles}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">Player Profiles</p>
                    <p className="text-2xl font-bold text-green-900">{report.totalPlayerProfiles}</p>
                  </div>
                  <div className={cn(
                    "p-4 rounded-lg border",
                    report.fixesApplied > 0
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-200"
                  )}>
                    <p className={cn(
                      "text-sm font-medium",
                      report.fixesApplied > 0 ? "text-amber-700" : "text-gray-700"
                    )}>
                      Auto-Fixes Applied
                    </p>
                    <p className={cn(
                      "text-2xl font-bold",
                      report.fixesApplied > 0 ? "text-amber-900" : "text-gray-900"
                    )}>
                      {report.fixesApplied}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues */}
            {report.issues.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detected Issues ({report.issues.length})</CardTitle>
                  <CardDescription>
                    {errorIssues.length > 0 && `${errorIssues.length} critical, `}
                    {warningIssues.length > 0 && `${warningIssues.length} warnings, `}
                    {infoIssues.length > 0 && `${infoIssues.length} informational`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.issues.map((issue, index) => {
                      const severity = ISSUE_TYPE_SEVERITY[issue.type]
                      const Icon = severity === 'error' ? AlertCircle :
                        severity === 'warning' ? AlertTriangle :
                          Database

                      const colorClasses = {
                        error: 'bg-red-50 border-red-200 text-red-900',
                        warning: 'bg-amber-50 border-amber-200 text-amber-900',
                        info: 'bg-blue-50 border-blue-200 text-blue-900'
                      }

                      const iconColorClasses = {
                        error: 'text-red-600',
                        warning: 'text-amber-600',
                        info: 'text-blue-600'
                      }

                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-lg border flex items-start gap-3",
                            colorClasses[severity]
                          )}
                        >
                          <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColorClasses[severity])} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{ISSUE_TYPE_LABELS[issue.type]}</p>
                              {issue.autoFixable && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  Auto-fixable
                                </span>
                              )}
                              {issue.fixed && (
                                <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                                  Fixed
                                </span>
                              )}
                            </div>
                            <p className="text-sm opacity-90 mb-1">{issue.details}</p>
                            <p className="text-xs font-mono opacity-70">User ID: {issue.userId}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-gray-600">
                    No data consistency issues detected. All relationships are healthy.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SignalMetricCard(props: {
  label: string
  value: number
  detail: string
  tone: 'neutral' | 'success' | 'warning' | 'danger'
}) {
  const toneClasses = {
    neutral: 'bg-slate-50 border-slate-200 text-slate-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
  }

  return (
    <div className={cn('rounded-lg border p-4', toneClasses[props.tone])}>
      <p className="text-sm font-medium">{props.label}</p>
      <p className="mt-2 text-2xl font-bold">{props.value}</p>
      <p className="mt-1 text-xs opacity-80">{props.detail}</p>
    </div>
  )
}

function SignalDatasetCard({ dataset }: { dataset: AdminLaborMarketSignalDatasetSummary }) {
  const hasRisk = dataset.staleRows > 0 || dataset.invalidTimestampRows > 0 || dataset.missingCanonicalCareerIds.length > 0

  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">
          {dataset.kind === 'observedExposure' ? 'Observed Exposure' : 'Entry Friction'}
        </CardTitle>
        <CardDescription>
          Coverage {dataset.canonicalCoverageCount}/{dataset.canonicalCareerCount} canonical lanes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500">Canonical coverage</p>
            <p className="font-semibold text-slate-900">{dataset.canonicalCoveragePercent}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500">Alias-only rows</p>
            <p className="font-semibold text-slate-900">{dataset.aliasOnlyRecordCount}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500">Next expiry</p>
            <p className="font-semibold text-slate-900">
              {dataset.nextExpirationDays === null ? 'n/a' : `${dataset.nextExpirationDays}d`}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500">Policy max age</p>
            <p className="font-semibold text-slate-900">{dataset.maxAgeDays}d</p>
          </div>
        </div>

        <div className={cn(
          'rounded-lg border p-3 text-sm',
          hasRisk ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-green-200 bg-green-50 text-green-900',
        )}>
          <p className="font-semibold">{hasRisk ? 'Needs operator attention' : 'Healthy dataset contract'}</p>
          <p className="mt-1">
            {hasRisk
              ? `${dataset.warningRows} warning, ${dataset.staleRows} stale, ${dataset.invalidTimestampRows} invalid timestamp rows.`
              : `All ${dataset.totalRows} rows are inside policy and canonical coverage is complete.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function SignalRow({ row }: { row: AdminLaborMarketSignalRowSummary }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-slate-900">{row.summary}</p>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
          {row.kind === 'observedExposure' ? 'Observed Exposure' : 'Entry Friction'} · {row.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{row.source}</p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>Updated {new Date(row.updatedAtIso).toLocaleDateString()}</span>
        <span>Age {row.ageDays === null ? 'invalid' : `${row.ageDays}d`}</span>
        <span>Expires in {row.daysUntilStale === null ? 'n/a' : `${row.daysUntilStale}d`}</span>
        <span>{row.version}</span>
      </div>
    </div>
  )
}

function FallbackList(props: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="font-semibold text-slate-900">{props.label}</p>
      {props.items.length === 0 ? (
        <p className="mt-1 text-slate-600">None.</p>
      ) : (
        <ul className="mt-2 space-y-1 text-slate-700">
          {props.items.map((item) => (
            <li key={item} className="font-mono text-xs">{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
