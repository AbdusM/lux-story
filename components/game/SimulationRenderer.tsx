import { useEffect, useRef, useState } from 'react'
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

interface SimulationRendererProps {
    simulation: SimulationConfig
    onComplete: (result: SimulationResult) => void
}

export function SimulationRenderer({ simulation, onComplete }: SimulationRendererProps) {
    const [status, setStatus] = useState<'active' | 'success' | 'failed' | 'skipped'>('active')
    const [secondsRemaining, setSecondsRemaining] = useState<number | null>(() => {
        if (typeof simulation.timeLimit !== 'number') return null
        if (!Number.isFinite(simulation.timeLimit) || simulation.timeLimit <= 0) return null
        return Math.max(0, Math.ceil(simulation.timeLimit))
    })
    const [completionMeta, setCompletionMeta] = useState<{ timedOut: boolean } | null>(null)

    const completionRef = useRef(false)
    const completionTimerRef = useRef<number | null>(null)
    const deadlineRef = useRef<number | null>(null)

    const normalizeTimerValue = (value: number | undefined): number | null => {
        if (typeof value !== 'number') return null
        if (!Number.isFinite(value) || value <= 0) return null
        return Math.max(0, Math.ceil(value))
    }

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
        setSecondsRemaining(normalizeTimerValue(simulation.timeLimit))

        return () => {
            if (completionTimerRef.current !== null) {
                window.clearTimeout(completionTimerRef.current)
                completionTimerRef.current = null
            }
        }
        // NOTE: timeLimit changes should also reset to keep determinism during dev hot reload.
    }, [simulation.type, simulation.title, simulation.taskDescription, simulation.variantId, simulation.timeLimit])

    const handleSuccess = (result: SimulationResult) => {
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
    }

    const handleFailure = (result: SimulationResult) => {
        if (completionRef.current) return
        completionRef.current = true
        setStatus('failed')
        setCompletionMeta({ timedOut: Boolean(result.timedOut) })
        const normalized: SimulationResult = { ...result, success: false }
        completionTimerRef.current = window.setTimeout(() => {
            onComplete(normalized)
        }, 2000)
    }

    const handleSkip = () => {
        if (completionRef.current) return
        completionRef.current = true
        setStatus('skipped')
        setCompletionMeta(null)
        const normalized: SimulationResult = { skipped: true, success: false }
        completionTimerRef.current = window.setTimeout(() => {
            onComplete(normalized)
        }, 1200)
    }

    // Time limits live here (not inside simulation implementations) so Phase 2/3 nodes can
    // reliably branch into fail follow-ups without each mini-game needing bespoke timers.
    useEffect(() => {
        if (status !== 'active') return
        const limitSeconds = normalizeTimerValue(simulation.timeLimit)
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
    }, [simulation.timeLimit, status])

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
                className={cn("relative w-full overflow-hidden rounded-lg bg-black/20 border border-white/5", simulation.inlineHeight || 'h-48')}
            >
                {/* Countdown (Phase 2/3) */}
                {typeof secondsRemaining === 'number' && status === 'active' && (
                    <div
                        className={cn(
                            "absolute top-2 right-2 z-20 rounded border px-2 py-1 text-[10px] font-mono tracking-widest backdrop-blur-sm",
                            secondsRemaining <= 10
                                ? "bg-red-950/40 border-red-500/30 text-red-200"
                                : "bg-black/40 border-amber-500/20 text-amber-200/80"
                        )}
                        aria-label="Time remaining"
                    >
                        {formatCountdown(secondsRemaining)}
                    </div>
                )}

                {/* Minimal Header for Context */}
                {/* <div className="absolute top-0 left-0 right-0 h-6 bg-black/40 flex items-center px-2 z-10 pointer-events-none">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                        Widget // {simulation.type}
                    </span>
                </div> */}

                {/* Content */}
                <div className="absolute inset-0" data-testid={`simulation-${simulation.type}`}>
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
            className="relative z-10 flex min-h-[560px] w-full flex-col overflow-hidden rounded-xl border border-amber-500/20 bg-slate-950 text-slate-200 font-sans shadow-[0_0_40px_rgba(245,158,11,0.12)] sm:min-h-[680px]"
        >
            {/* SATELLITE OS HEADER */}
            <div className="h-12 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-500">
                    <Terminal className="w-4 h-4 text-amber-500" />
                    <span>SIMULATION_CORE // {simulation.type.toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-3">
                    {typeof secondsRemaining === 'number' && (
                        <div
                            className={cn(
                                "rounded border px-2 py-1 text-[10px] font-mono tracking-widest",
                                status !== 'active'
                                    ? "border-white/10 text-slate-400"
                                    : secondsRemaining <= 10
                                        ? "border-red-500/30 text-red-200"
                                        : "border-amber-500/20 text-amber-200/80"
                            )}
                            aria-label="Time remaining"
                        >
                            {formatCountdown(secondsRemaining)}
                        </div>
                    )}

                    {/* GOD MODE EXIT */}
                    {simulation.onExit && (
                        <button
                            onClick={simulation.onExit}
                            className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-500/30 text-red-400 text-xs rounded hover:bg-red-900/40 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            ABORT SIMULATION
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN VIEWPORT */}
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-slate-950">
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />

                {/* Task Context Overlay */}
                <div className="absolute top-4 left-4 z-30 max-w-md pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-xl"
                    >
                        <h3 className="text-sm font-bold text-white mb-1 tracking-wide">{simulation.title}</h3>
                        <p className="text-xs text-white/70 leading-relaxed font-mono">
                            {simulation.taskDescription}
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 min-h-full px-4 pb-8 pt-28 sm:px-6 sm:pt-32" data-testid={`simulation-${simulation.type}`}>
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
                        <div className="text-center p-8 bg-black/40 border border-emerald-500/30 rounded-lg max-w-md">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-emerald-400 mb-2">SEQUENCE COMPLETE</h2>
                            <p className="text-emerald-200/60 font-mono text-sm">
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
                        <div className="text-center p-8 bg-black/40 border border-red-500/30 rounded-lg max-w-md">
                            <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-red-300 mb-2">
                                {completionMeta?.timedOut ? 'TIME EXPIRED' : 'PROTOCOL FAILED'}
                            </h2>
                            <p className="text-red-200/60 font-mono text-sm">
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
                        <div className="text-center p-8 bg-black/40 border border-amber-500/30 rounded-lg max-w-md">
                            <Terminal className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-amber-200 mb-2">BYPASS ENGAGED</h2>
                            <p className="text-amber-200/60 font-mono text-sm">
                                Continuing without simulation output.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
