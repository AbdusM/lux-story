import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  DollarSign,
  GraduationCap,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SkillGapBar } from './SkillGapBar'
import type { CareerMatch } from '@/lib/skill-tracker'

interface CareerCardProps {
  career: CareerMatch
  rank: number
  isExpanded?: boolean
  onToggle?: () => void
}

const READINESS_CONFIG = {
  near_ready: {
    label: 'Near Ready',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    icon: CheckCircle2
  },
  developing: {
    label: 'Developing',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    icon: AlertCircle
  },
  exploring: {
    label: 'Exploring',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    icon: Sparkles
  }
}

export function CareerCard({ career, rank, isExpanded, onToggle }: CareerCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const expanded = isExpanded !== undefined ? isExpanded : internalExpanded
  const handleToggle = onToggle || (() => setInternalExpanded(!internalExpanded))

  const readinessConfig = READINESS_CONFIG[career.readiness]
  const ReadinessIcon = readinessConfig.icon

  // Format salary range
  const formatSalary = (amount: number) => {
    if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}k`
    }
    return `$${amount.toLocaleString()}`
  }

  const salaryDisplay = career.salaryRange
    ? `${formatSalary(career.salaryRange[0])} - ${formatSalary(career.salaryRange[1])}`
    : 'Varies'

  // Match score as percentage
  const matchPercent = Math.round(career.matchScore * 100)

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      className={cn(
        "rounded-xl border transition-all duration-200",
        readinessConfig.bgColor,
        readinessConfig.borderColor,
        expanded ? "shadow-lg" : "shadow-sm"
      )}
    >
      {/* Header - Always visible */}
      <button
        onClick={handleToggle}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        {/* Rank badge */}
        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-white">#{rank}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-white text-sm leading-tight">{career.name}</h3>
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1",
              readinessConfig.bgColor,
              readinessConfig.textColor
            )}>
              <ReadinessIcon className="w-3 h-3" />
              {readinessConfig.label}
            </span>
          </div>

          {/* Match score progress ring */}
          <div className="flex items-center gap-3 mt-2">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-700"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="18" cy="18" r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={readinessConfig.textColor}
                  strokeDasharray={`${matchPercent * 0.97} 97`}
                  initial={prefersReducedMotion ? {} : { strokeDasharray: "0 97" }}
                  animate={{ strokeDasharray: `${matchPercent * 0.97} 97` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {matchPercent}%
              </span>
            </div>

            <div className="flex-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 mb-0.5">
                <DollarSign className="w-3 h-3" />
                <span>{salaryDisplay}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                <span>{career.localOpportunities?.length || 0} Birmingham employers</span>
              </div>
            </div>

            {/* Expand/collapse indicator */}
            <div className="text-slate-500">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
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
              {/* Why You Match section */}
              {career.evidenceForMatch && career.evidenceForMatch.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Why You Match
                  </h4>
                  <ul className="space-y-1.5">
                    {career.evidenceForMatch.map((evidence, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skill Gaps */}
              {career.requiredSkills && Object.keys(career.requiredSkills).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Skills Analysis
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(career.requiredSkills).map(([skill, data]) => (
                      <SkillGapBar
                        key={skill}
                        skillName={skill}
                        current={data.current}
                        required={data.required}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Education Paths */}
              {career.educationPaths && career.educationPaths.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Education Pathways
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {career.educationPaths.map((path, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300"
                      >
                        {path}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Birmingham Employers */}
              {career.localOpportunities && career.localOpportunities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Birmingham Employers
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {career.localOpportunities.map((employer, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400"
                      >
                        {employer}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
