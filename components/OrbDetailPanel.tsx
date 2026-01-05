"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Sparkles, Lock, CheckCircle2, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
// We'll reuse PatternOrb for the header visual
import { PatternOrb } from "./PatternOrb"
// We need data types
import { PatternType, PATTERN_METADATA } from "@/lib/patterns"
import { usePatternUnlocks } from "@/hooks/usePatternUnlocks"
import { ABILITIES } from "@/lib/abilities"
import { ORB_TIERS } from "@/lib/orbs"
import { SwipeablePanel } from "@/components/ui/SwipeablePanel"

interface OrbDetailPanelProps {
    patternType: PatternType
    onClose: () => void
}

export function OrbDetailPanel({ patternType, onClose }: OrbDetailPanelProps) {
    // 1. Get live data for this pattern (current fill, tier, etc)
    const { orbs } = usePatternUnlocks()
    const orbState = orbs.find(o => o.pattern === patternType)
    const metadata = PATTERN_METADATA[patternType]

    // 2. Get abilities relevant to this pattern
    //    We filter ABILITIES by the explicit 'pattern' field if present,
    //    or fallback by checking if the name/desc implies it (risky). 
    //    Best approach: The implementation plan said we confirmed ABILITIES has 'pattern'.
    //    Let's trust the updated type definition will be there.
    const patternAbilities = useMemo(() => {
        return Object.values(ABILITIES).filter(a => a.pattern === patternType)
            .sort((a, b) => {
                const tierA = ORB_TIERS[a.tier].minOrbs
                const tierB = ORB_TIERS[b.tier].minOrbs
                return tierA - tierB
            })
    }, [patternType])

    // Null guard
    if (!orbState) return null

    return (
        <SwipeablePanel
            onClose={onClose}
            className="absolute inset-0 bg-slate-900/95 z-10 p-6 overflow-y-auto cursor-grab active:cursor-grabbing"
        >
            {/* Header: Back Button */}
            <button
                onClick={onClose}
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors mb-8"
            >
                <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-900/20 transition-all">
                    <span className="text-sm font-sans relative top-px">←</span>
                </div>
                Return to Resonance Field
            </button>

            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Section 1: Hero (The Big Orb) */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        {/* Glow effect matching pattern color */}
                        <div
                            className="absolute inset-0 blur-2xl opacity-20"
                            style={{ backgroundColor: orbState.color }}
                        />
                        <PatternOrb
                            pattern={patternType}
                            size="lg"
                            celebrate={false} // Maybe true if leveled up recently?
                        />
                        {/* Tier Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl">
                            <Crown className="w-3 h-3 text-amber-500" />
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-300">
                                {orbState.label}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 max-w-[260px]">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                            {metadata.label}
                        </h2>
                        <p className="text-sm text-slate-400 font-serif italic">
                            "{metadata.description}"
                        </p>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="w-full max-w-xs space-y-1.5">
                        <div className="flex justify-between text-2xs uppercase font-bold text-slate-500 tracking-wider">
                            <span>Resonance</span>
                            <span>{orbState.fillPercent}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                            <motion.div
                                className="h-full rounded-full relative"
                                style={{ backgroundColor: orbState.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${orbState.fillPercent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Ability Ladder (The Mirror) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Unlocks
                        </h3>
                        <span className="text-2xs text-slate-600 font-mono">
                            {patternAbilities.filter(a => orbState.orbCount >= ORB_TIERS[a.tier].minOrbs).length} / {patternAbilities.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {patternAbilities.map((ability) => {
                            const tierMeta = ORB_TIERS[ability.tier]
                            const isUnlocked = orbState.orbCount >= tierMeta.minOrbs
                            // const isNext = !isUnlocked && orbState.orbCount >= ORB_TIERS['nascent'].minOrbs

                            // Progress calculation for this specific tier
                            // If we have 15 orbs, and tier needs 30. Progress is 15/30 = 50%.
                            // But wait, tiers are cumulative.
                            const progress = Math.min(100, (orbState.orbCount / tierMeta.minOrbs) * 100)
                            const isVeryClose = !isUnlocked && progress > 80

                            return (
                                <div
                                    key={ability.id}
                                    className={cn(
                                        "relative overflow-hidden rounded-lg border p-4 transition-all",
                                        isUnlocked
                                            ? "bg-slate-800/40 border-slate-700/50"
                                            : "bg-slate-900/30 border-white/5 grayscale-[0.5]"
                                    )}
                                >
                                    {/* Active Highlight for Unlocked */}
                                    {isUnlocked && (
                                        <div
                                            className="absolute inset-0 opacity-5 pointer-events-none"
                                            style={{ backgroundColor: orbState.color }}
                                        />
                                    )}

                                    <div className="flex gap-4">
                                        {/* Icon Status */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border shrink-0",
                                            isUnlocked
                                                ? "bg-slate-800 text-amber-400 border-amber-500/30 shadow-lg"
                                                : "bg-slate-900 text-slate-600 border-white/5"
                                        )}>
                                            {isUnlocked ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <Lock className="w-4 h-4" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className={cn(
                                                    "text-sm font-bold truncate pr-2",
                                                    isUnlocked ? "text-slate-200" : "text-slate-500"
                                                )}>
                                                    {ability.name}
                                                </h4>
                                                {!isUnlocked && (
                                                    <span className="text-[9px] uppercase font-bold text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">
                                                        {tierMeta.minOrbs} Orbs
                                                    </span>
                                                )}
                                            </div>

                                            <p className={cn(
                                                "text-xs leading-relaxed",
                                                isUnlocked ? "text-slate-400" : "text-slate-700 blur-[2px]" // Blur locked descriptions for mystery? Spec said "Show name but not description"
                                            )}>
                                                {isUnlocked ? ability.description : "Make choices to reveal..."}
                                            </p>

                                            {/* Progress Bar for Locked Items */}
                                            {!isUnlocked && (
                                                <div className="pt-2">
                                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full transition-all duration-500"
                                                            style={{
                                                                width: `${progress}%`,
                                                                backgroundColor: isVeryClose ? orbState.color : '#334155'
                                                            }}
                                                        />
                                                    </div>
                                                    {isVeryClose && (
                                                        <p className="text-[9px] text-amber-500/80 mt-1 font-medium animate-pulse">
                                                            Close to awakening...
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </SwipeablePanel>
    )
}
