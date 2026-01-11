import { useState, useEffect } from 'react'
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
    const [status, setStatus] = useState<'active' | 'success' | 'failed'>('active')

    // Auto-fail safety for development
    useEffect(() => {
        /* 
           ISP: In God Mode, we might want to auto-win or tweak params.
           For now, we just let the sim run. 
        */
    }, [])

    const handleSuccess = (result: SimulationResult) => {
        setStatus('success')
        setTimeout(() => {
            onComplete(result)
        }, 2000)
    }

    const renderContent = () => {
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
                                onClick={() => handleSuccess({ skipped: true })}
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
            <div className={cn("relative w-full overflow-hidden rounded-lg bg-black/20 border border-white/5", simulation.inlineHeight || 'h-48')}>
                {/* Minimal Header for Context */}
                {/* <div className="absolute top-0 left-0 right-0 h-6 bg-black/40 flex items-center px-2 z-10 pointer-events-none">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                        Widget // {simulation.type}
                    </span>
                </div> */}

                {/* Content */}
                <div className="absolute inset-0">
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
                </AnimatePresence>
            </div>
        )
    }

    // --- FULLSCREEN MODE RENDERER (Original God Mode) ---
    return (
        <div className="fixed inset-0 z-[60] bg-slate-950 text-slate-200 flex flex-col font-sans">
            {/* SATELLITE OS HEADER */}
            <div className="h-12 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-500">
                    <Terminal className="w-4 h-4 text-amber-500" />
                    <span>SIMULATION_CORE // {simulation.type.toUpperCase()}</span>
                </div>

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

            {/* MAIN VIEWPORT */}
            <div className="flex-1 relative overflow-hidden bg-slate-950">
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

                {renderContent()}
            </div>

            {/* FULLSCREEN SUCCESS OVERLAY */}
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
            </AnimatePresence>
        </div>
    )
}
