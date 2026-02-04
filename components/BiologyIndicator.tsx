"use client"

import { motion } from "framer-motion"
import { Heart, Zap, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { NervousSystemState, ChemicalReaction } from "@/lib/emotions"

interface BiologyIndicatorProps {
  nervousState: NervousSystemState
  lastReaction?: ChemicalReaction | null
  className?: string
  showLabel?: boolean
}

/**
 * BiologyIndicator - Displays nervous system state
 *
 * Three states mapped to polyvagal theory:
 * - ventral_vagal: Safe, social, connected (green heart)
 * - sympathetic: Mobilized, activated (yellow lightning)
 * - dorsal_vagal: Shutdown, conservation (blue moon)
 */
export function BiologyIndicator({
  nervousState,
  lastReaction,
  className,
  showLabel = false
}: BiologyIndicatorProps) {
  const stateConfig = {
    ventral_vagal: {
      icon: Heart,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      glowColor: 'shadow-emerald-500/30',
      label: 'Grounded',
      description: 'Safe & connected'
    },
    sympathetic: {
      icon: Zap,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      glowColor: 'shadow-amber-500/30',
      label: 'Activated',
      description: 'Alert & focused'
    },
    dorsal_vagal: {
      icon: Moon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      glowColor: 'shadow-blue-500/30',
      label: 'Conserving',
      description: 'Rest & reset'
    }
  }

  const config = stateConfig[nervousState]
  const Icon = config.icon

  // Chemical reaction overlay colors
  const reactionGlow = lastReaction ? {
    resonance: 'ring-2 ring-purple-400/50',
    cold_fusion: 'ring-2 ring-cyan-400/50',
    volatility: 'ring-2 ring-red-400/50',
    deep_rooting: 'ring-2 ring-green-400/50',
    shutdown: 'ring-2 ring-slate-400/50'
  }[lastReaction.type] : ''

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.div
        className={cn(
          "relative p-2 rounded-full transition-colors",
          config.bgColor,
          reactionGlow
        )}
        animate={nervousState === 'sympathetic' ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          repeat: nervousState === 'sympathetic' ? Infinity : 0,
          duration: 2,
          ease: 'easeInOut'
        }}
        title={`${config.label}: ${config.description}${lastReaction ? ` | ${lastReaction.description}` : ''}`}
      >
        <Icon className={cn("w-4 h-4", config.color)} />

        {/* Reaction intensity indicator */}
        {lastReaction && lastReaction.intensity > 0.5 && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          />
        )}
      </motion.div>

      {showLabel && (
        <div className="flex flex-col">
          <span className={cn("text-xs font-medium", config.color)}>
            {config.label}
          </span>
          {lastReaction && (
            <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
              {lastReaction.type.replace('_', ' ')}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

/**
 * Compact version for inline use
 */
export function BiologyIndicatorCompact({
  nervousState
}: {
  nervousState: NervousSystemState
}) {
  const icons = {
    ventral_vagal: <Heart className="w-3 h-3 text-emerald-400" />,
    sympathetic: <Zap className="w-3 h-3 text-amber-400" />,
    dorsal_vagal: <Moon className="w-3 h-3 text-blue-400" />
  }

  const labels = {
    ventral_vagal: 'Grounded',
    sympathetic: 'Activated',
    dorsal_vagal: 'Conserving'
  }

  return (
    <span
      className="inline-flex items-center gap-1"
      title={labels[nervousState]}
    >
      {icons[nervousState]}
    </span>
  )
}
