"use client"

import { type ElementType } from 'react'
import { motion } from 'framer-motion'
import {
    Wrench, DraftingCompass, Music, Activity, Sprout, Users, Shield, Database,
    Terminal, Play, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameStore } from '@/lib/game-store'
import { SIMULATION_REGISTRY, SimulationDefinition } from '@/content/simulation-registry'

// Icon mapping
const iconMap: Record<string, ElementType> = {
    wrench: Wrench,
    draftjs: DraftingCompass,
    music: Music,
    activity: Activity,
    sprout: Sprout,
    users: Users,
    shield: Shield,
    database: Database,
    terminal: Terminal
}

export function SimulationGodView({ onClose }: { onClose?: () => void }) {
    const setDebugSimulation = useGameStore(state => state.setDebugSimulation)

    const handleMount = (sim: SimulationDefinition) => {
        // ISP: The "Context Factory" in action
        // We construct a full SimulationConfig object on the fly
        const debugConfig = {
            type: sim.type,
            title: `[DEBUG] ${sim.title}`,
            taskDescription: sim.defaultContext.taskDescription,
            initialContext: sim.defaultContext.initialContext,
            successFeedback: sim.defaultContext.successFeedback,
            // God Mode specific flags
            isGodMode: true
        }

        setDebugSimulation(debugConfig)
        if (onClose) onClose() // Close Journal to see sim
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="border-b border-amber-900/30 pb-4 mb-6">
                <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    SIMULATION CORE // GOD MODE
                </h2>
                <p className="text-amber-500/60 text-sm mt-1 font-mono">
                    WARNING: FORCE MOUNTING SIMULATIONS BYPASSES NARRATIVE CHECKS.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SIMULATION_REGISTRY.map((sim, index) => {
                    const Icon = iconMap[sim.icon] || Terminal

                    return (
                        <motion.div
                            key={sim.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "relative group overflow-hidden",
                                "bg-slate-950/40 border border-slate-800 hover:border-amber-500/50",
                                "transition-all duration-300 rounded-sm p-4"
                            )}
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-300" />

                            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                                {/* Top Section */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">
                                                {sim.characterId.toUpperCase()} {'//'} {sim.type}
                                            </div>
                                            {/* Phase Indicator */}
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3].map(p => (
                                                    <div
                                                        key={p}
                                                        className={cn(
                                                            "w-2 h-2 rounded-full border",
                                                            p <= (sim.phase || 1)
                                                                ? "bg-amber-500/80 border-amber-400"
                                                                : "bg-slate-800 border-slate-700"
                                                        )}
                                                        title={`Phase ${p}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-slate-200 group-hover:text-amber-200 transition-colors">
                                            {sim.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {sim.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Action */}
                                <button
                                    onClick={() => handleMount(sim)}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider",
                                        "bg-slate-900 border border-slate-700 text-slate-400",
                                        "group-hover:bg-amber-950/30 group-hover:border-amber-500/50 group-hover:text-amber-400",
                                        "transition-all"
                                    )}
                                >
                                    <Play className="w-3 h-3" />
                                    Mount Context
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
