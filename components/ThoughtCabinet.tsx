"use client"

import { useGameSelectors } from "@/lib/game-store"
import { motion, useReducedMotion } from "framer-motion"
import { Brain, Eye, HelpCircle } from "lucide-react"

// Mystery display configuration
const MYSTERY_CONFIG = {
    samuelsPast: {
        name: "Samuel's Past",
        icon: '🦉',
        states: ['hidden', 'hinted', 'revealed'] as const,
        hints: {
            hidden: "Who is Samuel, really?",
            hinted: "He knew my name before I told him...",
            revealed: "The truth about the station keeper"
        }
    },
    platformSeven: {
        name: "Platform Seven",
        icon: '🚉',
        states: ['stable', 'flickering', 'error', 'denied', 'revealed'] as const,
        hints: {
            stable: "Platform 7... something feels off",
            flickering: "The numbers don't match the schedules...",
            error: "The system is glitching",
            denied: "Access denied—but why?",
            revealed: "The truth about Platform 7"
        }
    },
    letterSender: {
        name: "The Letter Sender",
        icon: '✉️',
        states: ['unknown', 'investigating', 'trusted', 'rejected', 'samuel_knows', 'self_revealed'] as const,
        hints: {
            unknown: "Who sent the letter?",
            investigating: "Searching for answers...",
            trusted: "I trust the sender's intentions",
            rejected: "I reject this path",
            samuel_knows: "Samuel knows something",
            self_revealed: "The truth revealed itself"
        }
    },
    stationNature: {
        name: "The Station's Nature",
        icon: '✨',
        states: ['unknown', 'sensing', 'understanding', 'mastered'] as const,
        hints: {
            unknown: "What is this place, really?",
            sensing: "Something isn't ordinary here...",
            understanding: "Beginning to see the truth",
            mastered: "I understand what the station is"
        }
    }
}

/**
 * Thought Cabinet
 * Replaces "Mind" tab.
 *
 * Concept: An incubator for ideas.
 * Implementation: Grid of thoughts that progress from 0% to 100% (Internalized).
 * Mobile First: Swipeable cards or compact grid.
 */
export function ThoughtCabinet() {
    // Accessibility
    const prefersReducedMotion = useReducedMotion()

    // Use selector that derives from coreGameState (single source of truth)
    const thoughts = useGameSelectors.useThoughts()
    const mysteries = useGameSelectors.useMysteries()

    // Sort: Internalized (Complete) -> Developing (Active) -> Unknown
    const sortedThoughts = [...thoughts].sort((a, b) => b.progress - a.progress)

    return (
        <div className="p-4 space-y-6">
            {/* Mysteries Section */}
            {mysteries && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium px-1">
                        <Eye className="w-4 h-4" />
                        <span>THE STATION'S MYSTERIES</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {(Object.keys(MYSTERY_CONFIG) as (keyof typeof MYSTERY_CONFIG)[]).map((key) => {
                            const config = MYSTERY_CONFIG[key]
                            const currentState = mysteries[key]
                            const stateIndex = config.states.indexOf(currentState as never)
                            const progress = Math.round((stateIndex / (config.states.length - 1)) * 100) || 0
                            const hint = config.hints[currentState as keyof typeof config.hints] || "Unknown"

                            return (
                                <MysteryNode
                                    key={key}
                                    name={config.name}
                                    icon={config.icon}
                                    progress={progress}
                                    hint={hint}
                                    totalSteps={config.states.length}
                                    currentStep={stateIndex + 1}
                                />
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Divider */}
            {mysteries && thoughts.length > 0 && (
                <div className="border-t border-slate-800" />
            )}

            {/* Thoughts Section */}
            <div className="space-y-3">
                {/* Header Stats */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        <span>ACTIVE THOUGHTS</span>
                    </div>
                    <span>{thoughts.filter(t => t.status === 'internalized').length} Internalized</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {sortedThoughts.length === 0 ? (
                        <div className="py-8 border border-dashed border-slate-700 rounded-xl flex flex-col items-center text-center px-4">
                            <HelpCircle className={`w-8 h-8 mb-3 text-slate-500 opacity-60 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                            <p className="text-sm text-slate-300">Your mind is clear.</p>
                            <p className="text-xs mt-2 text-slate-500">
                                Moments of insight will collect here as you explore.
                            </p>
                        </div>
                    ) : (
                        sortedThoughts.map((thought) => (
                            <ThoughtNode key={thought.id} thought={thought} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

function MysteryNode({
    name,
    icon,
    progress,
    hint,
    totalSteps,
    currentStep
}: {
    name: string
    icon: string
    progress: number
    hint: string
    totalSteps: number
    currentStep: number
}) {
    const isComplete = progress === 100

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                relative overflow-hidden rounded-xl p-4 border transition-all
                ${isComplete
                    ? 'bg-purple-900/20 border-purple-700/30'
                    : 'bg-slate-900/50 border-slate-800'
                }
            `}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">{icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-bold ${isComplete ? 'text-purple-200' : 'text-slate-200'}`}>
                            {name}
                        </h4>
                        {/* Progress dots */}
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        i < currentStep
                                            ? isComplete ? 'bg-purple-400' : 'bg-amber-500'
                                            : 'bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 italic leading-relaxed">
                        "{hint}"
                    </p>
                </div>
            </div>
        </motion.div>
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
                    ? 'bg-amber-900/20 border-amber-700/30'
                    : 'bg-slate-900/50 border-slate-800'
                }
            `}
        >
            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
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
                        ${isInternalized ? 'bg-amber-900/30 text-amber-400' : 'bg-slate-800 text-slate-400'}
                    `}
                >
                    {thought.icon || '💡'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-bold ${isInternalized ? 'text-amber-200' : 'text-slate-200'}`}>
                            {thought.title}
                        </h4>
                        <span className="text-xs font-mono text-slate-400">
                            {thought.progress}%
                        </span>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed">
                        {isInternalized ? thought.internalizedText || thought.description : thought.description}
                    </p>

                    {/* Bonuses */}
                    {isInternalized && thought.bonuses && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {thought.bonuses.map((bonus: string, i: number) => (
                                <span key={i} className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded">
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
