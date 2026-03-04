'use client'

import { AlertTriangle, CheckCircle2, FileStack } from 'lucide-react'
import { useGameSelectors } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { getConflictProgress, getUnreliableRecordById } from '@/lib/unreliable-narrator-system'

function formatRecordLabel(recordId: string): string {
  const record = getUnreliableRecordById(recordId)
  if (!record) return recordId
  const source = record.sourceFaction.replace('_', ' ')
  return `${source}: ${record.perspective}`
}

export function LoreContradictionsView() {
  const gameState = useGameSelectors.useCoreGameStateHydrated()

  if (!gameState) {
    return (
      <section className="rounded-xl border border-white/10 bg-black/20 p-4 text-slate-300">
        <h3 className="text-sm font-semibold tracking-wide text-slate-200">Contradiction Ledger</h3>
        <p className="mt-2 text-xs text-slate-400">No active run loaded yet.</p>
      </section>
    )
  }

  const progress = getConflictProgress(gameState.archivistState, gameState.globalFlags)
  const resolved = progress.filter((item) => item.isVerified)
  const unresolved = progress.filter((item) => !item.isVerified)
  const ready = unresolved.filter((item) => item.isReady)

  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-4 text-slate-300">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide text-slate-200">Contradiction Ledger</h3>
        <div className="text-xs text-slate-400">
          {resolved.length}/{progress.length} resolved
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2">
          <div className="text-emerald-300 font-semibold">{resolved.length}</div>
          <div className="text-emerald-200/80">Resolved</div>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2">
          <div className="text-amber-300 font-semibold">{ready.length}</div>
          <div className="text-amber-200/80">Ready</div>
        </div>
        <div className="rounded-lg border border-slate-500/30 bg-slate-500/10 p-2">
          <div className="text-slate-200 font-semibold">{unresolved.length}</div>
          <div className="text-slate-300/80">Unresolved</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {unresolved.map((item) => (
          <article key={item.cluster.id} className="rounded-lg border border-white/10 bg-black/25 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-100">{item.cluster.name}</p>
                <p className="mt-1 text-xs text-slate-400">{item.cluster.description}</p>
              </div>
              <div
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                  item.isReady ? 'bg-amber-500/20 text-amber-200' : 'bg-slate-600/30 text-slate-300',
                )}
              >
                {item.isReady ? <AlertTriangle className="h-3 w-3" /> : <FileStack className="h-3 w-3" />}
                {item.isReady ? 'Ready to Verify' : 'Collecting'}
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cn('h-full rounded-full', item.isReady ? 'bg-amber-400' : 'bg-sky-400')}
                style={{ width: `${Math.max(8, Math.round(item.completionRatio * 100))}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {item.collectedCount}/{item.requiredCount} record fragments collected
            </p>

            {item.missingRecordIds.length > 0 && (
              <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                {item.missingRecordIds.slice(0, 2).map((recordId) => (
                  <li key={recordId}>Missing: {formatRecordLabel(recordId)}</li>
                ))}
              </ul>
            )}
          </article>
        ))}

        {resolved.length > 0 && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-100">
            <div className="mb-1 inline-flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Contradictions
            </div>
            <p className="text-emerald-200/90">
              {resolved.map((item) => item.cluster.name).join(', ')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
