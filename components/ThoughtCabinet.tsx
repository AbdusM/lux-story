"use client"

import { useGameSelectors } from "@/lib/game-store"
import { motion } from "framer-motion"
import { Brain } from "lucide-react"

/**
 * Thought Cabinet
 * Replaces "Mind" tab.
 *
 * Concept: An incubator for ideas.
 * Implementation: Grid of thoughts that progress from 0% to 100% (Internalized).
 * Mobile First: Swipeable cards or compact grid.
 */
export function ThoughtCabinet() {
    // Use selector that derives from coreGameState (single source of truth)
    const thoughts = useGameSelectors.useThoughts()

    // Sort: Internalized (Complete) -> Developing (Active) -> Unknown
    const sortedThoughts = [...thoughts].sort((a, b) => b.progress - a.progress)

    return (
        <div className="p-4 space-y-6">

            {/* Header Stats */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span>{thoughts.length} Thought{thoughts.length !== 1 ? 's' : ''} Active</span>
                <span>{thoughts.filter(t => t.status === 'internalized').length} Internalized</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4">
                {sortedThoughts.length === 0 ? (
                    <div className="py-6 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center text-center px-4 text-slate-400 max-h-[120px]">
                        <Brain className="w-6 h-6 mb-2 opacity-50" />
                        <p className="text-sm">Your mind is clear.</p>
                        <p className="text-xs mt-1 text-slate-500">Choices spark thoughts</p>
                    </div>
                ) : (
                    sortedThoughts.map((thought) => (
                        <ThoughtNode key={thought.id} thought={thought} />
                    ))
                )}
            </div>

        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ThoughtNode({ thought }: { thought: any }) {
    const isInternalized = thought.status === 'internalized'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                relative overflow-hidden rounded-xl p-4 border transition-all
                ${isInternalized
                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }
            `}
        >
            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                <motion.div
                    className={`h-full ${isInternalized ? 'bg-amber-500' : 'bg-blue-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${thought.progress}%` }}
                />
            </div>

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                    className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl
                        ${isInternalized ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}
                    `}
                >
                    {thought.icon || '💡'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-bold ${isInternalized ? 'text-amber-900 dark:text-amber-100' : 'text-slate-700 dark:text-slate-200'}`}>
                            {thought.title}
                        </h4>
                        <span className="text-[10px] font-mono opacity-60">
                            {thought.progress}%
                        </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isInternalized ? thought.internalizedText || thought.description : thought.description}
                    </p>

                    {/* Bonuses */}
                    {isInternalized && thought.bonuses && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {thought.bonuses.map((bonus: string, i: number) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-amber-200/50 text-amber-800 rounded">
                                    {bonus}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
