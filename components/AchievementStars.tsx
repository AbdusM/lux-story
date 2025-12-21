"use client"

import { useGameStore } from "@/lib/game-store"
import { META_ACHIEVEMENTS } from "@/lib/meta-achievements"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Achievement Stars
 * Replaces "Trophies/Achievements" concept via tab "Stars".
 * 
 * Concept: A sky of constellations.
 * Implementation: Grid of stars. Unlocked ones glow.
 */
export function AchievementStars() {
    const unlockedIds = useGameStore(state => state.unlockedAchievements)

    return (
        <div className="p-4 min-h-[400px]">
            <div className="grid grid-cols-3 gap-4">
                {META_ACHIEVEMENTS.map((achievement, index) => {
                    const isUnlocked = unlockedIds.includes(achievement.id)

                    return (
                        <motion.div
                            key={achievement.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative flex flex-col items-center justify-center p-3 text-center"
                        >
                            {/* The Star */}
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-700",
                                isUnlocked
                                    ? "bg-amber-100 dark:bg-amber-900/30 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                                    : "bg-slate-100 dark:bg-slate-800 opacity-20"
                            )}>
                                <span className={cn(
                                    "text-2xl filter",
                                    isUnlocked ? "grayscale-0 drop-shadow-md" : "grayscale blur-[1px]"
                                )}>
                                    {achievement.icon || '⭐'}
                                </span>
                            </div>

                            {/* Star Connector Line (Decoration) */}
                            {index % 3 !== 2 && (
                                <div className="absolute top-9 -right-4 w-8 h-px bg-slate-200 dark:bg-slate-800 opacity-20" />
                            )}

                            {/* Label */}
                            <div className="space-y-1">
                                <p className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                    isUnlocked ? "text-amber-600 dark:text-amber-400" : "text-slate-300 dark:text-slate-700"
                                )}>
                                    {achievement.name}
                                </p>

                                {isUnlocked && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-[9px] text-slate-500 leading-tight"
                                    >
                                        {achievement.description}
                                    </motion.div>
                                )}
                            </div>

                            {/* Locked Tooltip */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] p-2 rounded flex items-center justify-center pointer-events-none">
                                    Locked
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-8 italic">
                The sky remembers what the ground forgets.
            </p>
        </div>
    )
}
