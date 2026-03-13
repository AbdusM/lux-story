import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import shared types
import { SimulationConfig, SimulationResult } from './simulations/types'

// Import specific renderers
import { SystemArchitectureSim } from './simulations/SystemArchitectureSim'
import { MediaStudio } from './simulations/MediaStudio'
import { VisualCanvas } from './simulations/VisualCanvas'
import { DataDashboard } from './simulations/DataDashboard'
import { DataAnalysisSim } from './simulations/DataAnalysisSim'
import { SecureTerminal } from './simulations/SecureTerminal'
import { DiplomacyTable } from './simulations/DiplomacyTable'
import { BotanyGrid } from './simulations/BotanyGrid'
import { PitchDeck } from './simulations/PitchDeck'
import { DataTicker } from './simulations/handshake/DataTicker'
import { humanizeSimulationContextLabel } from './simulations/simulation-copy'

interface SimulationRendererProps {
    simulation: SimulationConfig
    onComplete: (result: SimulationResult) => void
}

type SimulationFrameTheme = {
    label: string
    shellClass: string
    ambientClass: string
    badgeClass: string
    timerActiveClass: string
    timerCriticalClass: string
    actionClass: string
}

function getSimulationFrameTheme(simulation: SimulationConfig): SimulationFrameTheme {
    if (
        simulation.type === 'visual_canvas' ||
        simulation.type === 'architect_3d' ||
        simulation.type === 'creative_direction' ||
        simulation.type === 'audio_studio' ||
        simulation.type === 'news_feed'
    ) {
        return {
            label: 'Studio Session',
            shellClass: 'border-fuchsia-400/20 bg-slate-950 text-slate-100 shadow-[0_0_50px_rgba(217,70,239,0.12)]',
            ambientClass: 'bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]',
            badgeClass: 'border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100',
            timerActiveClass: 'border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100',
            timerCriticalClass: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
            actionClass: 'border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-100 hover:bg-fuchsia-400/15',
        }
    }

    if (
        simulation.type === 'chat_negotiation' ||
        simulation.type === 'conversation_tree' ||
        simulation.type === 'conductor_interface' ||
        simulation.type === 'botany_grid'
    ) {
        return {
            label: 'Live Scenario',
            shellClass: 'border-emerald-400/20 bg-slate-950 text-slate-100 shadow-[0_0_50px_rgba(16,185,129,0.12)]',
            ambientClass: 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]',
            badgeClass: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
            timerActiveClass: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
            timerCriticalClass: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
            actionClass: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15',
        }
    }

    return {
        label: 'Active Case',
        shellClass: 'border-amber-400/20 bg-slate-950 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.12)]',
        ambientClass: 'bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]',
        badgeClass: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
        timerActiveClass: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
        timerCriticalClass: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
        actionClass: 'border-amber-400/25 bg-amber-400/10 text-amber-100 hover:bg-amber-400/15',
    }
}

function normalizeTimerValue(value: number | undefined): number | null {
    if (typeof value !== 'number') return null
    if (!Number.isFinite(value) || value <= 0) return null
    return Math.max(0, Math.ceil(value))
}

function getEffectiveTimeLimit(value: number | undefined): number | null {
    const normalized = normalizeTimerValue(value)
    if (normalized === null) return null
    if (typeof window === 'undefined') return normalized

    const scale = window.__LUX_E2E_SIM_TIME_SCALE__
    if (typeof scale !== 'number' || !Number.isFinite(scale) || scale <= 0 || scale >= 1) {
        return normalized
    }

    return Math.max(1, Math.ceil(normalized * scale))
}

export function SimulationRenderer({ simulation, onComplete }: SimulationRendererProps) {
    const frameTheme = getSimulationFrameTheme(simulation)
    const contextLabel = humanizeSimulationContextLabel(
        typeof simulation.initialContext?.label === 'string' ? simulation.initialContext.label : undefined
    )
    const [status, setStatus] = useState<'active' | 'success' | 'failed' | 'skipped'>('active')
    const [secondsRemaining, setSecondsRemaining] = useState<number | null>(() => getEffectiveTimeLimit(simulation.timeLimit))
    const [completionMeta, setCompletionMeta] = useState<{ timedOut: boolean } | null>(null)

    const completionRef = useRef(false)
    const completionTimerRef = useRef<number | null>(null)
    const deadlineRef = useRef<number | null>(null)

    const formatCountdown = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60)
        const remainder = Math.max(0, seconds % 60)
        return `${minutes}:${String(remainder).padStart(2, '0')}`
    }

    // Reset completion state when a new simulation instance is rendered.
    useEffect(() => {
        completionRef.current = false
        deadlineRef.current = null
        setStatus('active')
        setCompletionMeta(null)
        setSecondsRemaining(getEffectiveTimeLimit(simulation.timeLimit))

        return () => {
            if (completionTimerRef.current !== null) {
                window.clearTimeout(completionTimerRef.current)
                completionTimerRef.current = null
            }
        }
        // NOTE: timeLimit changes should also reset to keep determinism during dev hot reload.
    }, [simulation.type, simulation.title, simulation.taskDescription, simulation.variantId, simulation.timeLimit])

    const handleFailure = useCallback((result: SimulationResult) => {
        if (completionRef.current) return
        completionRef.current = true
        setStatus('failed')
        setCompletionMeta({ timedOut: Boolean(result.timedOut) })
        const normalized: SimulationResult = { ...result, success: false }
        completionTimerRef.current = window.setTimeout(() => {
            onComplete(normalized)
        }, 2000)
    }, [onComplete])

    const handleSuccess = useCallback((result: SimulationResult) => {
        if (result.success === false) {
            handleFailure(result)
            return
        }
        if (completionRef.current) return
        completionRef.current = true
        setStatus('success')
        setCompletionMeta(null)
        const normalized: SimulationResult = {
            ...result,
            success: result.success ?? true,
            timedOut: result.timedOut ?? false,
        }
        completionTimerRef.current = window.setTimeout(() => {
            onComplete(normalized)
        }, 2000)
    }, [handleFailure, onComplete])

    const handleSkip = useCallback(() => {
        if (completionRef.current) return
        completionRef.current = true
        setStatus('skipped')
        setCompletionMeta(null)
        const normalized: SimulationResult = { skipped: true, success: false }
        completionTimerRef.current = window.setTimeout(() => {
            onComplete(normalized)
        }, 1200)
    }, [onComplete])

    // Time limits live here (not inside simulation implementations) so Phase 2/3 nodes can
    // reliably branch into fail follow-ups without each mini-game needing bespoke timers.
    useEffect(() => {
        if (status !== 'active') return
        const limitSeconds = getEffectiveTimeLimit(simulation.timeLimit)
        if (limitSeconds === null) return

        const deadline = Date.now() + limitSeconds * 1000
        deadlineRef.current = deadline

        const tick = () => {
            const remainingMs = (deadlineRef.current ?? deadline) - Date.now()
            const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
            setSecondsRemaining(remainingSeconds)

            if (remainingMs <= 0) {
                handleFailure({ timedOut: true, success: false })
            }
        }

        tick()
        const intervalId = window.setInterval(tick, 250)
        return () => {
            window.clearInterval(intervalId)
        }
    }, [handleFailure, simulation.timeLimit, status])

    const renderContent = () => {
        const effectivePhase = typeof simulation.phase === 'number' ? simulation.phase : 1
        const hasDecisionOptions =
            typeof simulation.initialContext?.content === 'string' &&
            /(^|\n)\s*[A-D]\)\s+\S/.test(simulation.initialContext.content)

        // Phase 2/3 contract: timed sims with explicit A-D options should be graded on that decision,
        // not on a generic placeholder mini-game.
        if (
            effectivePhase >= 2 &&
            typeof simulation.timeLimit === 'number' &&
            Number.isFinite(simulation.timeLimit) &&
            simulation.timeLimit > 0 &&
            hasDecisionOptions
        ) {
            return <DataAnalysisSim config={simulation} onSuccess={handleSuccess} />
        }

        const content = (() => {
            switch (simulation.type) {
                // ... (Cases 1-to-1 matching existing switch)
                case 'system_architecture':
                    return <SystemArchitectureSim config={simulation} onSuccess={handleSuccess} />

                case 'visual_canvas':
                    const canvasVariant = simulation.title.toLowerCase().includes('mural') ? 'art' :
                        simulation.title.toLowerCase().includes('star') || simulation.title.toLowerCase().includes('constellation') ? 'navigation' :
                            'blueprint'
                    return <VisualCanvas config={simulation} onSuccess={handleSuccess} variant={canvasVariant} />

                case 'architect_3d':
                    return <VisualCanvas config={simulation} onSuccess={handleSuccess} variant="navigation" />

                case 'botany_grid':
                    return <BotanyGrid config={simulation} onSuccess={handleSuccess} />

                case 'dashboard_triage': // Marcus/Grace/Silas/Isaiah
                    const triageVariant = simulation.title.toLowerCase().includes('supply') || simulation.title.toLowerCase().includes('route') ? 'logistics' :
                        simulation.title.toLowerCase().includes('soil') || simulation.title.toLowerCase().includes('sensor') ? 'analysis' :
                            'triage'
                    return <DataDashboard config={simulation} onSuccess={handleSuccess} variant={triageVariant} />

                case 'market_visualizer': // Elena
                    return <DataDashboard config={simulation} onSuccess={handleSuccess} variant="market" />

                case 'terminal_coding': // Devon (Phase 1 legacy typing sims)
                    // Placeholder mapping: use the terminal interaction shell until a dedicated coding sim exists.
                    return <SecureTerminal config={simulation} onSuccess={handleSuccess} variant="audit" />

                case 'data_analysis':
                    return <DataAnalysisSim config={simulation} onSuccess={handleSuccess} />

                case 'secure_terminal': {
                    const lower = `${simulation.title} ${simulation.taskDescription}`.toLowerCase()
                    const variant =
                        lower.includes('archive') || lower.includes('timeline') || lower.includes('record')
                            ? 'archive'
                            : (lower.includes('search') || lower.includes('query') || lower.includes('synthesis') || lower.includes('overview'))
                                ? 'query'
                                : 'audit'
                    return <SecureTerminal config={simulation} onSuccess={handleSuccess} variant={variant} />
                }

                case 'data_audit': // Zara
                    return <SecureTerminal config={simulation} onSuccess={handleSuccess} variant="audit" />

                case 'historical_timeline': // Yaquin
                    return <SecureTerminal config={simulation} onSuccess={handleSuccess} variant="archive" />

                case 'audio_studio': // Lira
                case 'news_feed': // Nadia
                    return <MediaStudio config={simulation} onSuccess={handleSuccess} variant={simulation.type as 'audio_studio' | 'news_feed'} />

                case 'chat_negotiation': // Grace/Tess
                    return <DiplomacyTable config={simulation} onSuccess={handleSuccess} variant="negotiation" />

                case 'conversation_tree': // Devon (Older nodes?)
                    return <DiplomacyTable config={simulation} onSuccess={handleSuccess} variant="cognitive" />

                case 'conductor_interface': // Samuel
                    return <DiplomacyTable config={simulation} onSuccess={handleSuccess} variant="operations" />

                case 'prompt_engineering': // Alex
                    // Using SecureTerminal as it handles text/code display best
                    return <SecureTerminal config={simulation} onSuccess={handleSuccess} variant="query" />

                case 'code_refactor': // Marcus
                    return <SecureTerminal config={simulation} onSuccess={handleSuccess} variant="audit" />

                case 'creative_direction': // Quinn
                    return <PitchDeck config={simulation} onSuccess={handleSuccess} />

                // PHASE 5: Handshake Protocol
                case 'data_ticker':
                    return <DataTicker config={simulation} onSuccess={handleSuccess} />

                default:
                    return (
                        <div className="p-8 font-mono text-amber-500">
                            <h3 className="text-xl font-bold mb-4">UNKNOWN SIMULATION TYPE: {simulation.type}</h3>
                            <button
                                onClick={handleSkip}
                                className="px-4 py-2 border border-amber-500 hover:bg-amber-500/20"
                            >
                                Bypass
                            </button>
                        </div>
                    )
            }
        })()

        return content
    }

    // --- INLINE MODE RENDERER ---
    if (simulation.mode === 'inline') {
        return (
            <div
                data-testid="simulation-interface"
                data-simulation-type={simulation.type}
                className={cn("relative w-full overflow-hidden rounded-2xl border bg-black/20", frameTheme.shellClass, simulation.inlineHeight || 'h-48')}
            >
                <div className={cn("absolute inset-0 pointer-events-none opacity-90", frameTheme.ambientClass)} />
                {/* Countdown (Phase 2/3) */}
                {typeof secondsRemaining === 'number' && status === 'active' && (
                    <div
                        className={cn(
                            "absolute top-3 right-3 z-20 rounded-full border px-2.5 py-1 text-[10px] font-mono tracking-widest backdrop-blur-sm",
                            secondsRemaining <= 10
                                ? frameTheme.timerCriticalClass
                                : frameTheme.timerActiveClass
                        )}
                        aria-label="Time remaining"
                    >
                        {formatCountdown(secondsRemaining)}
                    </div>
                )}
                <div className="absolute left-3 top-3 z-20 pointer-events-none">
                    <div className={cn("rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.08em] backdrop-blur-sm", frameTheme.badgeClass)}>
                        {frameTheme.label}
                    </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-10" data-testid={`simulation-${simulation.type}`}>
                    {renderContent()}
                </div>

                {/* Inline Success Overlay - more subtle */}
                <AnimatePresence>
                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 bg-emerald-950/80 flex items-center justify-center backdrop-blur-[2px]"
                        >
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-mono text-sm tracking-wide font-bold">COMPLETE</span>
                            </div>
                        </motion.div>
                    )}
                    {status === 'failed' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 bg-red-950/80 flex items-center justify-center backdrop-blur-[2px]"
                        >
                            <div className="flex items-center gap-2 text-red-300">
                                <X className="w-5 h-5" />
                                <span className="font-mono text-sm tracking-wide font-bold">
                                    {completionMeta?.timedOut ? 'TIME EXPIRED' : 'FAILED'}
                                </span>
                            </div>
                        </motion.div>
                    )}
                    {status === 'skipped' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 bg-amber-950/70 flex items-center justify-center backdrop-blur-[2px]"
                        >
                            <div className="flex items-center gap-2 text-amber-200">
                                <Terminal className="w-5 h-5" />
                                <span className="font-mono text-sm tracking-wide font-bold">BYPASSED</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // --- FULLSCREEN MODE RENDERER (Original God Mode) ---
    return (
        <div
            data-testid="simulation-interface"
            data-simulation-type={simulation.type}
            className={cn(
                "relative z-10 flex min-h-[560px] w-full flex-col overflow-hidden rounded-[28px] border font-sans sm:min-h-[680px]",
                frameTheme.shellClass
            )}
        >
            <div className={cn("absolute inset-0 pointer-events-none opacity-90", frameTheme.ambientClass)} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_36%)]" />

            <div
                className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl select-none"
                data-testid="simulation-shell-header"
            >
                <div className="flex flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-slate-200/75">
                                <span className={cn("rounded-full border px-3 py-1.5 backdrop-blur-sm", frameTheme.badgeClass)}>
                                    {frameTheme.label}
                                </span>
                                {contextLabel && (
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-100/75">
                                        {contextLabel}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-base font-semibold text-white sm:text-xl" data-testid="simulation-frame-title">
                                    {simulation.title}
                                </h2>
                                <p
                                    className="max-w-3xl text-xs leading-relaxed text-slate-200/80 sm:text-[15px]"
                                    data-testid="simulation-frame-brief"
                                >
                                    {simulation.taskDescription}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
                            {typeof secondsRemaining === 'number' && (
                                <div
                                    className={cn(
                                        "rounded-full border px-3 py-1.5 text-[10px] font-mono tracking-[0.18em]",
                                        status !== 'active'
                                            ? "border-white/10 bg-white/5 text-slate-300/70"
                                            : secondsRemaining <= 10
                                                ? frameTheme.timerCriticalClass
                                                : frameTheme.timerActiveClass
                                    )}
                                    aria-label="Time remaining"
                                >
                                    {formatCountdown(secondsRemaining)}
                                </div>
                            )}

                            {simulation.onExit && (
                                <button
                                    onClick={simulation.onExit}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                                        frameTheme.actionClass
                                    )}
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Step back
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 to-transparent" />
                <div className="relative z-10 min-h-full px-3 pb-8 pt-4 sm:px-6 sm:pt-6" data-testid={`simulation-${simulation.type}`}>
                    {renderContent()}
                </div>
            </div>

            {/* FULLSCREEN RESULT OVERLAYS */}
            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-emerald-950/90 flex items-center justify-center backdrop-blur-sm"
                    >
                        <div className="max-w-md rounded-2xl border border-emerald-500/30 bg-black/35 p-8 text-center shadow-2xl">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h2 className="mb-2 text-2xl font-bold text-emerald-100">Sequence complete</h2>
                            <p className="text-sm font-mono text-emerald-100/70">
                                {simulation.successFeedback || "Data synchronized."}
                            </p>
                        </div>
                    </motion.div>
                )}
                {status === 'failed' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-red-950/90 flex items-center justify-center backdrop-blur-sm"
                    >
                        <div className="max-w-md rounded-2xl border border-red-500/30 bg-black/35 p-8 text-center shadow-2xl">
                            <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h2 className="mb-2 text-2xl font-bold text-red-100">
                                {completionMeta?.timedOut ? 'Window closed' : 'Signal lost'}
                            </h2>
                            <p className="text-sm font-mono text-red-100/70">
                                {completionMeta?.timedOut ? "The window closed before you could commit." : "Signal integrity was lost."}
                            </p>
                        </div>
                    </motion.div>
                )}
                {status === 'skipped' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-amber-950/90 flex items-center justify-center backdrop-blur-sm"
                    >
                        <div className="max-w-md rounded-2xl border border-amber-500/30 bg-black/35 p-8 text-center shadow-2xl">
                            <Terminal className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                            <h2 className="mb-2 text-2xl font-bold text-amber-100">Exercise skipped</h2>
                            <p className="text-sm font-mono text-amber-100/70">
                                Continuing without simulation output.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
