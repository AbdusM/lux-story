'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

type InteractionEventRow = {
  id: string
  user_id: string
  session_id: string
  event_type: string
  node_id: string | null
  character_id: string | null
  ordering_variant: string | null
  ordering_seed: string | null
  payload: Record<string, unknown>
  occurred_at: string
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}

function asNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

type JoinedSelection = {
  occurredAt: string
  userId: string
  nodeId: string | null
  orderingVariant: string | null
  nervousSystemState: string | null
  selectedIndex: number | null
  selectedPattern: string | null
  selectedGravityWeight: number | null
  presentedChoiceCount: number | null
}

export default function AdminTelemetryPage() {
  const [hours, setHours] = useState(24)
  const [limit, setLimit] = useState(4000)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [events, setEvents] = useState<InteractionEventRow[]>([])

  const abortRef = useRef<AbortController | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const params = new URLSearchParams()
      params.set('hours', String(hours))
      params.set('limit', String(limit))
      if (userId.trim()) params.set('userId', userId.trim())

      const res = await fetch(`/api/admin/interaction-events?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      })

      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setError((json && typeof json.error === 'string' && json.error) || `Request failed (${res.status})`)
        setEvents([])
        setConfigured(null)
        return
      }

      if (!json || !isRecord(json)) {
        setError('Invalid response')
        setEvents([])
        setConfigured(null)
        return
      }

      setConfigured(Boolean(json.configured))
      setEvents(Array.isArray(json.events) ? json.events as InteractionEventRow[] : [])
    } catch (e) {
      if (controller.signal.aborted) return
      setError(e instanceof Error ? e.message : 'Failed to fetch telemetry')
      setEvents([])
      setConfigured(null)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [hours, limit, userId])

  useEffect(() => {
    fetchEvents()
    return () => abortRef.current?.abort()
  }, [fetchEvents])

  const analysis = useMemo(() => {
    const presentedByEventId = new Map<string, InteractionEventRow>()
    const presentedEvents = events.filter(e => e.event_type === 'choice_presented')
    for (const e of presentedEvents) {
      const eventId = asString(e.payload?.['event_id'])
      if (eventId) presentedByEventId.set(eventId, e)
    }

    const joinedSelections: JoinedSelection[] = []
    const selectedUiEvents = events.filter(e => e.event_type === 'choice_selected_ui')
    for (const e of selectedUiEvents) {
      const presentedEventId = asString(e.payload?.['presented_event_id'])
      const selectedIndex = asNumber(e.payload?.['selected_index'])
      const presented = presentedEventId ? presentedByEventId.get(presentedEventId) : undefined

      let selectedPattern: string | null = null
      let selectedGravityWeight: number | null = null
      let nervousSystemState: string | null = null
      let presentedChoiceCount: number | null = null

      if (presented) {
        nervousSystemState = asString(presented.payload?.['nervous_system_state'])
        const choices = asArray(presented.payload?.['choices'])
        presentedChoiceCount = choices.length

        if (typeof selectedIndex === 'number' && selectedIndex >= 0 && selectedIndex < choices.length) {
          const row = choices[selectedIndex]
          if (isRecord(row)) {
            selectedPattern = asString(row['pattern'])
            selectedGravityWeight = asNumber(row['gravity_weight'])
          }
        }
      }

      joinedSelections.push({
        occurredAt: e.occurred_at,
        userId: e.user_id,
        nodeId: e.node_id,
        orderingVariant: e.ordering_variant,
        nervousSystemState,
        selectedIndex: typeof selectedIndex === 'number' ? selectedIndex : null,
        selectedPattern,
        selectedGravityWeight,
        presentedChoiceCount,
      })
    }

    const indexCounts = new Map<number, number>()
    const patternFirstCounts = new Map<string, number>()
    const selectedPatternCounts = new Map<string, number>()

    for (const e of presentedEvents) {
      const choices = asArray(e.payload?.['choices'])
      const first = choices[0]
      if (isRecord(first)) {
        const p = asString(first['pattern']) || 'unknown'
        patternFirstCounts.set(p, (patternFirstCounts.get(p) || 0) + 1)
      }
    }

    for (const s of joinedSelections) {
      if (typeof s.selectedIndex === 'number') {
        indexCounts.set(s.selectedIndex, (indexCounts.get(s.selectedIndex) || 0) + 1)
      }
      const p = s.selectedPattern || 'unknown'
      selectedPatternCounts.set(p, (selectedPatternCounts.get(p) || 0) + 1)
    }

    const totalSelections = joinedSelections.length
    const topSlotPicks = indexCounts.get(0) || 0

    const analyticalFirst = patternFirstCounts.get('analytical') || 0
    const totalPresented = presentedEvents.length

    return {
      totalPresented,
      totalSelections,
      topSlotRate: totalSelections > 0 ? topSlotPicks / totalSelections : 0,
      analyticalFirstRate: totalPresented > 0 ? analyticalFirst / totalPresented : 0,
      indexCounts,
      patternFirstCounts,
      selectedPatternCounts,
      joinedSelections,
    }
  }, [events])

  const indexRows = useMemo(() => {
    const rows: Array<{ index: number; count: number; rate: number }> = []
    const total = analysis.totalSelections
    const keys = [...analysis.indexCounts.keys()].sort((a, b) => a - b)
    for (const k of keys) {
      const count = analysis.indexCounts.get(k) || 0
      rows.push({ index: k, count, rate: total > 0 ? count / total : 0 })
    }
    return rows
  }, [analysis.indexCounts, analysis.totalSelections])

  const patternFirstRows = useMemo(() => {
    const rows = [...analysis.patternFirstCounts.entries()]
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
    return rows
  }, [analysis.patternFirstCounts])

  const selectedPatternRows = useMemo(() => {
    const rows = [...analysis.selectedPatternCounts.entries()]
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
    return rows
  }, [analysis.selectedPatternCounts])

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Admin</p>
            <h1 className="text-2xl font-semibold text-white">Telemetry</h1>
            <p className="text-sm text-slate-400">Interaction Events: choice ordering and selection bias signals</p>
          </div>
          <div className="flex gap-2">
            <Link className="rounded bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20" href="/admin/users">Users</Link>
            <Link className="rounded bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20" href="/admin/diagnostics">Diagnostics</Link>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Window (hours)</span>
              <input
                className="w-32 rounded bg-slate-900/60 border border-white/10 px-3 py-2 text-sm"
                type="number"
                min={1}
                max={24 * 30}
                value={hours}
                onChange={e => setHours(parseInt(e.target.value || '24', 10))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Limit</span>
              <input
                className="w-32 rounded bg-slate-900/60 border border-white/10 px-3 py-2 text-sm"
                type="number"
                min={1}
                max={10000}
                value={limit}
                onChange={e => setLimit(parseInt(e.target.value || '4000', 10))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">User ID (optional)</span>
              <input
                className="w-[340px] max-w-full rounded bg-slate-900/60 border border-white/10 px-3 py-2 text-sm"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="player_..."
              />
            </label>
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="rounded bg-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/20 disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            {configured === false && (
              <span className="text-xs text-amber-300">DB not configured (service role missing). Showing empty telemetry.</span>
            )}
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold text-white">Core Metrics</h2>
              <div className="mt-3 grid gap-2 text-sm text-slate-200">
                <div>Choice sets presented: <span className="font-semibold">{analysis.totalPresented}</span></div>
              <div>Selections joined (UI to presented): <span className="font-semibold">{analysis.totalSelections}</span></div>
                <div>Top-slot selection rate: <span className="font-semibold">{Math.round(analysis.topSlotRate * 100)}%</span></div>
                <div>Analytical shown first rate: <span className="font-semibold">{Math.round(analysis.analyticalFirstRate * 100)}%</span></div>
              </div>
            <p className="mt-3 text-xs text-slate-400">
              Note: selection joins require `choice_selected_ui.payload.presented_event_id` matching `choice_presented.payload.event_id`.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold text-white">Selection By Index</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr className="border-b border-white/10">
                    <th className="py-2 text-left">Index</th>
                    <th className="py-2 text-left">Count</th>
                    <th className="py-2 text-left">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {indexRows.length === 0 ? (
                    <tr><td className="py-3 text-slate-500" colSpan={3}>No joined selections</td></tr>
                  ) : indexRows.map(r => (
                    <tr key={r.index} className="border-b border-white/5">
                      <td className="py-2">{r.index}</td>
                      <td className="py-2">{r.count}</td>
                      <td className="py-2">{Math.round(r.rate * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold text-white">Pattern Shown First (Index 0)</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr className="border-b border-white/10">
                    <th className="py-2 text-left">Pattern</th>
                    <th className="py-2 text-left">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {patternFirstRows.length === 0 ? (
                    <tr><td className="py-3 text-slate-500" colSpan={2}>No presented choice sets</td></tr>
                  ) : patternFirstRows.map(r => (
                    <tr key={r.pattern} className="border-b border-white/5">
                      <td className="py-2">{r.pattern}</td>
                      <td className="py-2">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold text-white">Pattern Selected (Joined)</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr className="border-b border-white/10">
                    <th className="py-2 text-left">Pattern</th>
                    <th className="py-2 text-left">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatternRows.length === 0 ? (
                    <tr><td className="py-3 text-slate-500" colSpan={2}>No joined selections</td></tr>
                  ) : selectedPatternRows.map(r => (
                    <tr key={r.pattern} className="border-b border-white/5">
                      <td className="py-2">{r.pattern}</td>
                      <td className="py-2">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-white">Recent Events</h2>
          <p className="mt-1 text-xs text-slate-400">Newest first (trimmed to 50 rows)</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr className="border-b border-white/10">
                  <th className="py-2 text-left">Time</th>
                  <th className="py-2 text-left">User</th>
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Node</th>
                  <th className="py-2 text-left">Ordering</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 50).map(e => (
                  <tr key={e.id} className="border-b border-white/5">
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-300">{new Date(e.occurred_at).toLocaleString()}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-300">{e.user_id.slice(0, 10)}…</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-200">{e.event_type}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-300">{e.node_id || '—'}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-400">{e.ordering_variant || '—'}</td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td className="py-3 text-slate-500" colSpan={5}>No interaction events in this window</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
