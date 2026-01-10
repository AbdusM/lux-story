
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Calendar, Lock, ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameSelectors } from '@/lib/game-store'
import { getBirminghamOpportunities, type BirminghamOpportunity as Opportunity } from '@/content/birmingham-opportunities'

const BIRMINGHAM_OPPORTUNITIES = getBirminghamOpportunities().getFilteredOpportunities({})

export function OpportunitiesView() {
    const patterns = useGameSelectors.usePatterns()

    // Sort opportunities: Unlocked first, then by priority/id
    const sortedOpportunities = useMemo(() => {
        return [...BIRMINGHAM_OPPORTUNITIES].sort((a, b) => {
            const aUnlocked = patterns[a.unlockCondition.pattern] >= a.unlockCondition.minLevel
            const bUnlocked = patterns[b.unlockCondition.pattern] >= b.unlockCondition.minLevel

            if (aUnlocked && !bUnlocked) return -1
            if (!aUnlocked && bUnlocked) return 1
            return 0
        })
    }, [patterns])

    const unlockedCount = BIRMINGHAM_OPPORTUNITIES.filter(
        (op: Opportunity) => patterns[op.unlockCondition.pattern] >= op.unlockCondition.minLevel
    ).length

    return (
        <div className="relative p-6 pb-20 space-y-8 min-h-full">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/grid-pattern.svg')] bg-[size:30px_30px]" />

            <header className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xs font-bold text-emerald-500/80 uppercase tracking-[0.2em] font-mono">
                        Real-World Connection
                    </h2>
                </div>
                <h1 className="text-3xl font-bold text-white font-serif tracking-tight mb-2">
                    Opportunities
                </h1>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        AVAILABLE: {unlockedCount}
                    </span>
                    <span className="flex items-center gap-1.5 opacity-60">
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                        LOCKED: {BIRMINGHAM_OPPORTUNITIES.length - unlockedCount}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4 relative z-10">
                {sortedOpportunities.map((opportunity, i) => (
                    <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        index={i}
                        currentLevel={patterns[opportunity.unlockCondition.pattern]}
                    />
                ))}
            </div>
        </div>
    )
}

function OpportunityCard({
    opportunity,
    index,
    currentLevel
}: {
    opportunity: Opportunity,
    index: number,
    currentLevel: number
}) {
    const isUnlocked = currentLevel >= opportunity.unlockCondition.minLevel
    const progress = Math.min(100, (currentLevel / opportunity.unlockCondition.minLevel) * 100)

    // Calculate remaining (roughly, assuming 1 choice = ~0.2-0.5 pattern points, but simpler to just show level gap)
    // Actually, patterns are usually 0-10 scale.

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "relative overflow-hidden rounded-lg border transition-all duration-300",
                isUnlocked
                    ? "bg-slate-900/80 border-slate-700 shadow-sm hover:border-emerald-500/30"
                    : "bg-black/40 border-slate-800/50 opacity-70 grayscale-[0.8]"
            )}
        >
            <div className="p-4 flex gap-4">
                {/* Icon Box */}
                <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border",
                    isUnlocked
                        ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-700"
                )}>
                    {isUnlocked ? <Building2 className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={cn(
                            "font-bold text-sm truncate",
                            isUnlocked ? "text-white" : "text-slate-500"
                        )}>
                            {opportunity.name}
                        </h3>
                        {/* Type Badge */}
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50 whitespace-nowrap">
                            {opportunity.type}
                        </span>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
                        <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {opportunity.organization}
                        </span>
                        {isUnlocked && (
                            <>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {opportunity.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {opportunity.timeCommitment}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description or Unlock Progress */}
                    {isUnlocked ? (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-emerald-500/20 pl-3">
                                {opportunity.description}
                            </p>

                            {/* Unlock Reason */}
                            <div className="flex items-center gap-2 text-[10px] text-emerald-500/70 font-mono">
                                <span className="uppercase font-bold">UNLOCKED VIA:</span>
                                <span className="capitalize">{opportunity.unlockCondition.pattern} Pattern (Lvl {opportunity.unlockCondition.minLevel}+)</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Locked State with Progress */}
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                <span className="font-mono uppercase text-[10px]">Unlock Requirement</span>
                                <span className="font-bold text-slate-600">
                                    {opportunity.unlockCondition.pattern} Lvl {opportunity.unlockCondition.minLevel}
                                </span>
                            </div>

                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-full">
                                <div
                                    className="h-full bg-emerald-900 transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                <span>Current: {currentLevel.toFixed(1)}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </motion.div>
    )
}
