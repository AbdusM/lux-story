import React, { useMemo } from 'react'

import { Lock, Eye, Activity, Zap, Trophy, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameStore, useGameSelectors } from '@/lib/game-store'
import { ABILITIES } from '@/lib/abilities'
import { ORB_TIERS } from '@/lib/orbs'
import { PATTERN_ACHIEVEMENTS, getEarnedAchievements } from '@/lib/pattern-derivatives'

export function MasteryView() {
    const unlockedAbilities = useGameStore(state => state.unlockedAchievements)
    const unlockedIds = new Set(unlockedAbilities || [])
    const coreGameState = useGameSelectors.useCoreGameState()

    // Group abilities by tier for visual hierarchy?
    // Or just a flat grid sorted by tier. Let's do flat grid for now.
    const sortedAbilities = Object.values(ABILITIES).sort((a, b) => {
        // Sort by tier minOrbs
        const tierA = ORB_TIERS[a.tier].minOrbs
        const tierB = ORB_TIERS[b.tier].minOrbs
        return tierA - tierB
    })

    // Icons map
    const icons = {
        subtext_reader: Eye,
        pattern_preview: Activity,
        deep_intuition: Zap
    }

    // Get pattern achievements
    const earnedAchievements = useMemo(() => {
        if (!coreGameState?.patterns) return []
        return getEarnedAchievements(coreGameState.patterns)
    }, [coreGameState?.patterns])

    const earnedIds = new Set(earnedAchievements.map(a => a.id))

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    Ability Mastery
                </h3>
                <p className="text-sm text-slate-400">
                    As your patterns deepen, the station reveals its hidden layers to you.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sortedAbilities.map((ability) => {
                    const isUnlocked = unlockedIds.has(ability.id)
                    const TierIcon = icons[ability.id as keyof typeof icons] || Zap
                    const tierMeta = ORB_TIERS[ability.tier]

                    return (
                        <div
                            key={ability.id}
                            className={cn(
                                "relative group overflow-hidden rounded-lg border p-4 transition-all duration-300",
                                isUnlocked
                                    ? "bg-slate-800/80 border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]"
                                    : "bg-slate-900/50 border-white/5 opacity-70"
                            )}
                        >
                            {isUnlocked && (
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-500/5 pointer-events-none" />
                            )}

                            <div className="flex items-start gap-4 relative z-10">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
                                        isUnlocked
                                            ? "bg-amber-900/20 border-amber-500/50 text-amber-400"
                                            : "bg-slate-800 border-white/10 text-slate-600"
                                    )}
                                >
                                    {isUnlocked ? <TierIcon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4
                                            className={cn(
                                                "font-serif font-bold tracking-wide",
                                                isUnlocked ? "text-slate-100" : "text-slate-500"
                                            )}
                                        >
                                            {ability.name}
                                        </h4>
                                        {!isUnlocked && (
                                            <span className="text-2xs uppercase font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded">
                                                {tierMeta.minOrbs} Orbs
                                            </span>
                                        )}
                                    </div>

                                    <p className={cn("text-xs leading-relaxed", isUnlocked ? "text-slate-300" : "text-slate-600")}>
                                        {ability.description}
                                    </p>

                                    {isUnlocked && (
                                        <div className="pt-2">
                                            <span className="text-xs uppercase tracking-wider text-amber-500/80 font-medium">
                                                Active
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pattern Achievements Section */}
            <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-400" />
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                            Pattern Achievements
                        </h3>
                    </div>
                    <p className="text-sm text-slate-400">
                        Milestones earned through your pattern development.
                    </p>
                    <p className="text-xs text-slate-500">
                        {earnedAchievements.length} / {PATTERN_ACHIEVEMENTS.length} unlocked
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {PATTERN_ACHIEVEMENTS.map((achievement) => {
                        const isEarned = earnedIds.has(achievement.id)

                        return (
                            <div
                                key={achievement.id}
                                className={cn(
                                    "relative overflow-hidden rounded-lg border p-3 transition-all duration-300",
                                    isEarned
                                        ? "bg-purple-950/30 border-purple-500/30"
                                        : "bg-slate-900/30 border-white/5 opacity-50"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-lg">{achievement.icon}</span>
                                    {isEarned && <Star className="w-3 h-3 text-purple-400 fill-purple-400" />}
                                </div>
                                <h4
                                    className={cn(
                                        "text-xs font-bold mb-0.5",
                                        isEarned ? "text-purple-200" : "text-slate-500"
                                    )}
                                >
                                    {achievement.name}
                                </h4>
                                <p
                                    className={cn(
                                        "text-xs leading-tight",
                                        isEarned ? "text-slate-400" : "text-slate-600"
                                    )}
                                >
                                    {achievement.description}
                                </p>
                                {isEarned && achievement.reward && (
                                    <p className="text-xs text-purple-400/80 mt-1.5 italic">
                                        "{achievement.reward}"
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
