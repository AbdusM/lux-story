"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertTriangle, Terminal, Activity, Music, Sprout, Network, Lock, Play, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import specific renderers
import { SystemArchitectureSim } from './simulations/SystemArchitectureSim'
import { MediaStudio } from './simulations/MediaStudio'
import { VisualCanvas } from './simulations/VisualCanvas'
import { DataDashboard } from './simulations/DataDashboard'
import { SecureTerminal } from './simulations/SecureTerminal'
import { DiplomacyTable } from './simulations/DiplomacyTable'
import { BotanyGrid } from './simulations/BotanyGrid'
import { PitchDeck } from './simulations/PitchDeck'

export interface SimulationConfig {
    type: string
    title: string
    taskDescription: string
    initialContext: any
    successFeedback: string
    // God Mode / Debug flags
    isGodMode?: boolean
    onExit?: () => void
}

interface SimulationRendererProps {
    simulation: SimulationConfig
    onComplete: (result: any) => void
}

export function SimulationRenderer({ simulation, onComplete }: SimulationRendererProps) {
    const [status, setStatus] = useState<'active' | 'success' | 'failed'>('active')
    const [feedback, setFeedback] = useState<string | null>(null)

    // Auto-fail safety for development
    useEffect(() => {
        /* 
           ISP: In God Mode, we might want to auto-win or tweak params.
           For now, we just let the sim run. 
        */
    }, [])

    const handleSuccess = (result: any) => {
        setStatus('success')
        setTimeout(() => {
            onComplete(result)
        }, 2000)
    }

    // --- RENDERER SWITCH ---
    const renderContent = () => {
        switch (simulation.type) {
            case 'system_architecture':
                return <SystemArchitectureSim config={simulation} onSuccess={handleSuccess} />

            // ISP: The "Generic" Fallbacks (Phase 2 Implementations)
            // For now, we route them to a "Under Construction" or "Generic Terminal" view
            // until we build the specific visualizers.

            case 'visual_canvas': // Kai (blueprint), Asha (art), Rohan (navigation)
                // Determine variant based on title/context
                const canvasVariant = simulation.title.toLowerCase().includes('mural') ? 'art' :
                                      simulation.title.toLowerCase().includes('star') || simulation.title.toLowerCase().includes('constellation') ? 'navigation' :
                                      'blueprint'
                return <VisualCanvas config={simulation} onSuccess={handleSuccess} variant={canvasVariant} />

            case 'architect_3d':  // Jordan - uses navigation variant for route plotting
                return <VisualCanvas config={simulation} onSuccess={handleSuccess} variant="navigation" />

            case 'botany_grid':   // Tess - Hydroponic nutrient optimization
                return <BotanyGrid config={simulation} onSuccess={handleSuccess} />

            case 'dashboard_triage': // Marcus/Grace/Silas/Isaiah
                // Determine variant based on context
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

            case 'chat_negotiation': // Alex
                return <DiplomacyTable config={simulation} onSuccess={handleSuccess} variant="negotiation" />

            case 'conversation_tree': // Devon
                return <DiplomacyTable config={simulation} onSuccess={handleSuccess} variant="cognitive" />

            case 'conductor_interface': // Samuel
                return <DiplomacyTable config={simulation} onSuccess={handleSuccess} variant="operations" />

            case 'creative_direction': // Quinn - Pitch deck builder
                return <PitchDeck config={simulation} onSuccess={handleSuccess} />

            default:
                // Generic Safe Fallback
                return (
                    <div className="p-8 font-mono text-amber-500">
                        <h3 className="text-xl font-bold mb-4">UNKNOWN SIMULATION TYPE: {simulation.type}</h3>
                        <pre className="text-xs bg-black/50 p-4 rounded mb-4">
                            {JSON.stringify(simulation, null, 2)}
                        </pre>
                        <button
                            onClick={() => handleSuccess({ skipped: true })}
                            className="px-4 py-2 border border-amber-500 hover:bg-amber-500/20"
                        >
                            Bypass
                        </button>
                    </div>
                )
        }
    }

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

                {renderContent()}
            </div>

            {/* SUCCESS OVERLAY */}
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
