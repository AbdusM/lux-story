'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { getPatternEnding } from '@/lib/pattern-endings'
import { getAccessiblePatternColor, type PatternType } from '@/lib/patterns'
import { ArrowLeft } from 'lucide-react'

interface JourneyCompleteProps {
    pattern: PatternType
    onRestart: () => void
}

export function JourneyComplete({ pattern, onRestart }: JourneyCompleteProps) {
    const ending = getPatternEnding(pattern)
    const patternColor = getAccessiblePatternColor(pattern)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 1.5, staggerChildren: 0.3 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
            {/* Dynamic Background Gradient */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 30%, ${patternColor} 0%, transparent 70%)`
                }}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-2xl px-6 py-12 mx-auto text-center"
            >
                {/* Title Section */}
                <motion.div variants={itemVariants} className="mb-12">
                    <div
                        className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-widest uppercase border rounded-full bg-slate-900/50 backdrop-blur-sm"
                        style={{ borderColor: patternColor, color: patternColor }}
                    >
                        Journey Complete
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-serif">
                        {ending.title}
                    </h1>
                    <p className="mt-4 text-xl text-slate-400 font-light">
                        {ending.subtitle}
                    </p>
                </motion.div>

                {/* Narrative Body */}
                <motion.div variants={itemVariants} className="space-y-6 text-lg leading-relaxed text-slate-300">
                    {ending.narrative.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div variants={itemVariants} className="mt-12">
                    <div className="p-6 mb-8 border border-slate-800 rounded-xl bg-slate-900/50 backdrop-blur-md">
                        <p className="text-xl italic font-medium" style={{ color: patternColor }}>
                            "{ending.callToAction}"
                        </p>
                    </div>

                    <Button
                        onClick={onRestart}
                        variant="ghost"
                        className="group text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Return to Station Checkpoint
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}
