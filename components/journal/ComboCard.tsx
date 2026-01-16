import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Sparkles,
  User,
  Briefcase,
  MessageSquare,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComboProgress } from '@/lib/skill-combo-detector'
import type { SkillComboUnlock } from '@/lib/skill-combos'

interface ComboCardProps {
  progress: ComboProgress
  isExpanded?: boolean
  onToggle?: () => void
}

const UNLOCK_ICONS: Record<SkillComboUnlock['type'], typeof Briefcase> = {
  career: Briefcase,
  dialogue: MessageSquare,
  achievement: Award,
  ability: Sparkles
}

export function ComboCard({ progress, isExpanded, onToggle }: ComboCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const expanded = isExpanded !== undefined ? isExpanded : internalExpanded
  const handleToggle = onToggle || (() => setInternalExpanded(!internalExpanded))

  const { combo, overall, bySkill, isUnlocked } = progress

  // Format skill name for display
  const formatSkillName = (skill: string): string => {
    return skill
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border transition-all duration-200 overflow-hidden",
        isUnlocked
          ? "bg-gradient-to-br from-amber-950/40 via-purple-950/30 to-slate-900/80 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          : "bg-slate-900/60 border-slate-700/50"
      )}
    >
      {/* Header - Always visible */}
      <button
        onClick={handleToggle}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-2xl border",
          isUnlocked
            ? "bg-amber-950/30 border-amber-500/30"
            : "bg-slate-800 border-slate-700"
        )}>
          {isUnlocked ? (
            <span>{combo.icon || '✨'}</span>
          ) : (
            <Lock className="w-5 h-5 text-slate-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={cn(
              "font-bold text-sm leading-tight",
              isUnlocked ? "text-amber-300" : "text-white"
            )}>
              {combo.name}
            </h3>
            {isUnlocked ? (
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 whitespace-nowrap">
                <Unlock className="w-3 h-3" />
                Unlocked
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-500">
                {overall}%
              </span>
            )}
          </div>

          <p className={cn(
            "text-xs leading-relaxed mb-3",
            isUnlocked ? "text-slate-300" : "text-slate-400"
          )}>
            {combo.description}
          </p>

          {/* Skill pills */}
          <div className="flex flex-wrap gap-1.5">
            {combo.skills.map(skill => {
              const skillProgress = bySkill[skill]
              return (
                <span
                  key={skill}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border",
                    skillProgress?.isMet
                      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-800/50 border-slate-700/50 text-slate-400"
                  )}
                >
                  {formatSkillName(skill)}
                  {!skillProgress?.isMet && (
                    <span className="ml-1 opacity-60">
                      ({Math.round(skillProgress?.current || 0)}/{skillProgress?.required || 0})
                    </span>
                  )}
                </span>
              )
            })}
          </div>

          {/* Expand indicator */}
          <div className="flex items-center justify-end mt-2 text-slate-500">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50">
              {/* Progress bars */}
              {!isUnlocked && (
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Progress
                  </h4>
                  {Object.entries(bySkill).map(([skill, data]) => (
                    <div key={skill} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{formatSkillName(skill)}</span>
                        <span className={cn(
                          "font-mono",
                          data.isMet ? "text-emerald-400" : "text-slate-500"
                        )}>
                          {Math.round(data.current)}/{data.required}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            data.isMet
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          )}
                          initial={prefersReducedMotion ? { width: `${data.progress}%` } : { width: 0 }}
                          animate={{ width: `${Math.min(100, data.progress)}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Unlocks */}
              <div className={!isUnlocked ? "" : "pt-4"}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {isUnlocked ? 'Rewards Unlocked' : 'Rewards'}
                </h4>
                <div className="space-y-2">
                  {combo.unlocks.map((unlock, i) => {
                    const Icon = UNLOCK_ICONS[unlock.type]
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-2 text-xs p-2 rounded-lg border",
                          isUnlocked
                            ? "bg-amber-950/20 border-amber-500/20 text-amber-300"
                            : "bg-slate-800/30 border-slate-700/30 text-slate-400"
                        )}
                      >
                        <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-medium">{unlock.description}</div>
                          <div className="text-[10px] uppercase tracking-wider opacity-60 mt-0.5">
                            {unlock.type}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Character hint */}
              {combo.characterHint && !isUnlocked && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                  <User className="w-4 h-4" />
                  <span>Develop with: {combo.characterHint}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
