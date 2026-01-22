import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ExperienceEngine, ActiveExperienceState } from '@/lib/experience-engine'
import { GameState } from '@/lib/character-state'
import { cn } from '@/lib/utils'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'
import { GameChoices } from '@/components/GameChoices'
import { adaptExperienceChoiceToUIChoice, OrbFillLevels } from '@/lib/choice-adapter'

// Ensure content is loaded
import '@/content/maya-loyalty'
import '@/content/devon-loyalty'
// Load ALL 20 loyalty experiences via adapter
import '@/lib/loyalty-adapter'

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
                <GameChoices
                    choices={(step.choices || []).map(c => adaptExperienceChoiceToUIChoice(c, gameState.patterns as OrbFillLevels))}
                    onChoice={(choice) => onChoice(choice.id || choice.next || '')}
                    isProcessing={false}
                    playerPatterns={gameState.patterns}
                />
            </div>

            {
                step.type === 'timed_challenge' && (
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
                )
            }
        </div >
    )
}
