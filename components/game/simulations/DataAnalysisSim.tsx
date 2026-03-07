import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SimulationComponentProps, SimulationResult } from './types'
import { humanizeSimulationContextLabel } from './simulation-copy'

type ExtractedOption = {
  key: string
  text: string
}

function extractContextPreview(raw: string): string[] {
  if (!raw) return []

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^options:?$/i.test(line))
    .filter((line) => !/^[A-D]\)\s+/.test(line))
    .slice(0, 2)
}

function extractOptions(raw: string): ExtractedOption[] {
  if (!raw) return []

  const options: ExtractedOption[] = []
  const lines = raw.split(/\r?\n/)
  for (const line of lines) {
    const match = /^\s*([A-D])\)\s*(.+?)\s*$/.exec(line)
    if (!match) continue
    const key = match[1].toUpperCase()
    const text = match[2].trim()
    if (!text) continue
    options.push({ key, text })
  }

  // De-dupe by key while preserving order.
  const seen = new Set<string>()
  return options.filter((opt) => {
    if (seen.has(opt.key)) return false
    seen.add(opt.key)
    return true
  })
}

function extractCorrectOptions(successFeedback?: string): string[] | null {
  if (!successFeedback) return null
  const match = /\boptions?\s*([A-D](?:\s*[\+&]\s*[A-D])*)\b/i.exec(successFeedback)
  if (!match?.[1]) return null
  const letters = (match[1].match(/[A-D]/gi) || []).map((value) => value.toUpperCase())
  const deduped = Array.from(new Set(letters))
  return deduped.length > 0 ? deduped : null
}

export function DataAnalysisSim({ config, onSuccess }: SimulationComponentProps) {
  const content = typeof config.initialContext?.content === 'string' ? config.initialContext.content : ''
  const label = humanizeSimulationContextLabel(
    typeof config.initialContext?.label === 'string' ? config.initialContext.label : undefined
  )
  const displayStyle = config.initialContext?.displayStyle ?? 'text'

  const isTimed = typeof config.timeLimit === 'number' && Number.isFinite(config.timeLimit) && config.timeLimit > 0

  const options = useMemo(() => extractOptions(content), [content])
  const correctOptions = useMemo(() => extractCorrectOptions(config.successFeedback), [config.successFeedback])
  const contextPreview = useMemo(() => extractContextPreview(content), [content])

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submission, setSubmission] = useState<'idle' | 'submitting'>('idle')
  const [localError, setLocalError] = useState<string | null>(null)
  const [compactContext, setCompactContext] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(max-width: 640px)').matches
  })
  const [showContext, setShowContext] = useState(() => !compactContext)

  const correctOptionLabel = useMemo(() => (correctOptions ? correctOptions.join('+') : null), [correctOptions])
  const correctOptionTexts = useMemo(() => {
    if (!correctOptions) return []
    return correctOptions
      .map((key) => options.find((opt) => opt.key === key)?.text ?? null)
      .filter((value): value is string => Boolean(value))
  }, [correctOptions, options])

  const canInteract = isTimed && options.length > 0

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const media = window.matchMedia('(max-width: 640px)')
    const syncCompactMode = () => {
      const nextCompact = media.matches
      setCompactContext(nextCompact)
      setShowContext(!nextCompact)
    }

    syncCompactMode()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', syncCompactMode)
      return () => media.removeEventListener('change', syncCompactMode)
    }

    media.addListener(syncCompactMode)
    return () => media.removeListener(syncCompactMode)
  }, [])

  const submit = () => {
    if (!canInteract) return
    if (!selectedOption) {
      setLocalError('Select an option first.')
      return
    }
    setLocalError(null)
    setSubmission('submitting')

    const isCorrect = correctOptions ? correctOptions.includes(selectedOption) : true
    const result: SimulationResult = {
      success: isCorrect,
      score: isCorrect ? 100 : 0,
      data: {
        selectedOption,
        correctOptions,
      },
    }

    onSuccess(result)
  }

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/50">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/70">
                Active choice
              </span>
              {label && (
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-100/85">
                  {label}
                </span>
              )}
            </div>
            <div className="mt-3 text-sm font-medium leading-snug text-white sm:text-[15px]">
              {config.title}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-200/90">{config.taskDescription}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">
            Reference notes
          </div>
          {compactContext && (
            <button
              type="button"
              onClick={() => setShowContext((current) => !current)}
              aria-expanded={showContext}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-200/80 transition-colors hover:bg-white/10"
            >
              {showContext ? 'Hide notes' : 'Open notes'}
            </button>
          )}
        </div>
        {showContext ? (
          <pre
            className={cn(
              'max-h-48 overflow-y-auto whitespace-pre-wrap px-3 py-3 text-sm leading-relaxed text-slate-100',
              displayStyle === 'code' ? 'font-mono text-[12px]' : 'font-sans'
            )}
          >
            {content || '[NO_CONTEXT]'}
          </pre>
        ) : (
          <div className="space-y-2 px-3 py-3 text-sm leading-relaxed text-slate-300/85">
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">Key brief</div>
            {contextPreview.length > 0 ? (
              contextPreview.map((line) => (
                <p key={line}>{line}</p>
              ))
            ) : (
              <p>Open the notes only if you need the fuller record before deciding.</p>
            )}
          </div>
        )}
      </div>

      {options.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/50">
            {canInteract ? 'Make the call' : 'Available responses'}
          </div>
          <div className="grid gap-2">
            {options.map((opt) => {
              const selected = selectedOption === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={!canInteract || submission !== 'idle'}
                  onClick={() => setSelectedOption(opt.key)}
                  aria-pressed={selected}
                  aria-label={`Option ${opt.key}: ${opt.text}`}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors',
                    !canInteract || submission !== 'idle'
                      ? 'cursor-not-allowed border-white/10 bg-black/20 text-white/40'
                      : selected
                        ? 'border-cyan-400/40 bg-cyan-950/30 text-white'
                        : 'border-white/10 bg-black/30 text-white/80 hover:border-white/25 hover:bg-black/40'
                  )}
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-white/10 bg-black/30 font-mono text-xs text-white/80">
                    {opt.key}
                  </span>
                  <span className="text-sm leading-snug">{opt.text}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {canInteract ? (
        <div className="space-y-2">
          {localError && <p className="text-sm text-amber-200/90">{localError}</p>}
          <button
            type="button"
            disabled={submission !== 'idle'}
            onClick={submit}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors',
              submission !== 'idle'
                ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/40'
                : 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100 hover:bg-emerald-900/30'
            )}
            >
            <CheckCircle2 className="h-4 w-4" />
            Lock in your response
          </button>

          {!correctOptions && process.env.NODE_ENV !== 'production' && (
            <p className="text-xs text-white/50">
              Correct option not detected from `successFeedback`. This run will treat any selection as success.
            </p>
          )}
        </div>
      ) : isTimed ? (
        <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-3 text-sm text-red-200/90">
          <div className="flex items-center gap-2 font-semibold">
            <XCircle className="h-4 w-4 text-red-300" />
            Responses unavailable
          </div>
          <p className="mt-1 text-xs text-red-200/80">
            This scenario could not load its response options in time.
          </p>
          {correctOptionLabel && correctOptionTexts.length > 0 && process.env.NODE_ENV !== 'production' && (
            <p className="mt-2 text-xs text-red-200/80">
              Expected: Option {correctOptionLabel} ({correctOptionTexts.join(' | ')})
            </p>
          )}
          <button
            type="button"
            onClick={() => onSuccess({ skipped: true, success: true })}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm font-semibold text-red-100 transition-colors hover:bg-red-900/30"
          >
            <AlertTriangle className="h-4 w-4" />
            Continue
          </button>
        </div>
      ) : null}
    </div>
  )
}
