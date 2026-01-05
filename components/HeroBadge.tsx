"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    PatternType,
    PATTERN_METADATA
} from '@/lib/patterns'
import { cn } from '@/lib/utils'
import { Brain, Heart, Compass, Hammer, Clock } from 'lucide-react'

interface HeroBadgeProps {
    patterns: Record<PatternType, number>
    className?: string
    compact?: boolean
}

export function HeroBadge({ patterns, className, compact = false }: HeroBadgeProps) {
    // Determine dominant pattern
    const dominant = useMemo(() => {
        let max = 0
        let type: PatternType | null = null

        // Find highest pattern
        for (const [key, value] of Object.entries(patterns)) {
            if (value > max) {
                max = value
                type = key as PatternType
            }
        }

        // Only show if meaningful progress made (> 2 points)
        return max > 2 ? { type: type!, value: max } : null
    }, [patterns])

    if (!dominant) return null

    const metadata = PATTERN_METADATA[dominant.type]

    // Icon mapping
    const Icon = {
        analytical: Brain,
        helping: Heart,
        exploring: Compass,
        building: Hammer,
        patience: Clock
    }[dominant.type]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            key={dominant.type} // Re-animate on type change
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-sm",
                "bg-white/80 dark:bg-black/40",
                // Subtle glow effect matching pattern color
                "transition-colors duration-500",
                className
            )}
            style={{
                borderColor: `${metadata.color}40`, // 25% opacity
                boxShadow: `0 0 10px ${metadata.color}15` // 10% opacity glow
            }}
        >
            <div
                className={cn(
                    "flex items-center justify-center rounded-full text-white w-6 h-6",
                    metadata.tailwindBg
                )}
            >
                <Icon size={14} strokeWidth={2.5} />
            </div>

            <div className="flex flex-col">
                <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    metadata.tailwindText
                )}>
                    {compact ? metadata.shortLabel : metadata.label}
                </span>
                {!compact && (
                    <span className="text-2xs text-muted-foreground leading-none hidden">
                        Lv. {Math.floor(dominant.value)} Archetype
                    </span>
                )}
            </div>

            {/* Progress Ring (Mini) */}
            {!compact && (
                <div className="w-1.5 h-1.5 rounded-full ml-1 animate-pulse"
                    style={{ backgroundColor: metadata.color }}
                />
            )}
        </motion.div>
    )
}
