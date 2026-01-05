import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ExperienceEngine, ActiveExperienceState } from '@/lib/experience-engine'
import { GameState } from '@/lib/character-state'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock } from 'lucide-react'

// Ensure content is loaded
import '@/content/maya-loyalty'
import '@/content/devon-loyalty'

interface ExperienceRendererProps {
    state: ActiveExperienceState
    gameState: GameState
    onChoice: (choiceId: string) => void
}

export function ExperienceRenderer({ state, gameState, onChoice }: ExperienceRendererProps) {
    const step = useMemo(() => ExperienceEngine.getStep(state), [state])

    if (!step) return <div>Loading Experience...</div>

    return (
        <div className="space-y-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="prose prose-invert max-w-none text-lg leading-relaxed text-indigo-100/90 whitespace-pre-wrap"
                >
                    {step.text}
                </motion.div>
            </AnimatePresence>

            <div className="space-y-3 mt-8">
                {step.choices?.map(choice => {
                    const isAllowed = !choice.requiredPattern ||
                        (gameState.patterns[choice.requiredPattern] >= (choice.patternLevel || 3))

                    return (
                        <Button
                            key={choice.id}
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left h-auto py-4 px-5 text-base border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-400 transition-all",
                                !isAllowed && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!isAllowed}
                            onClick={() => onChoice(choice.id)}
                        >
                            <span className="flex-1">{choice.text}</span>
                            {!isAllowed && (
                                <span className="ml-2 text-xs text-red-400 uppercase tracking-wider flex items-center gap-1">
                                    <Brain className="w-3 h-3" />
                                    Requires {choice.requiredPattern} {choice.patternLevel}
                                </span>
                            )}
                        </Button>
                    )
                })}
            </div>

            {step.type === 'timed_challenge' && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-amber-500 text-sm font-inconsolata animate-pulse">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>CRITICAL DECISION REQUIRED</span>
                        </div>
                        <span>{(step.duration || 15000) / 1000}s</span>
                    </div>
                    <div className="h-1 bg-amber-900/30 w-full rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: (step.duration || 15000) / 1000, ease: "linear" }}
                            className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
