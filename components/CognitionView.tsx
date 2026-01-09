"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Brain, ChevronDown, ChevronUp, Activity, TrendingUp, AlertCircle } from "lucide-react"
import {
  useCognitiveDomains,
  useDomainProgress,
  useIsEngaged
} from "@/hooks/useCognitiveDomains"
import {
  CognitiveDomainId,
  CognitiveDomainScore,
  DOMAIN_METADATA,
  DOMAIN_COLORS,
  getLevelLabel,
  getLevelColor,
  getCoreDomains,
  getAdvancedDomains
} from "@/lib/cognitive-domains"
import { CognitionRadar } from "./constellation/CognitionRadar"
import { springs, STAGGER_DELAY } from "@/lib/animations"

/**
 * CognitionView - Journal tab for cognitive domain assessment
 *
 * Displays DSM-5 inspired cognitive domain scores with:
 * - Radar chart visualization
 * - Domain cards with level indicators
 * - Engagement metrics
 * - Research-validated frequency display
 */
export function CognitionView() {
  const prefersReducedMotion = useReducedMotion()
  const {
    domains,
    engagement,
    strongestDomains,
    developmentAreas,
    nearThreshold,
    profile,
    coreDomains,
    advancedDomains,
    isLoading
  } = useCognitiveDomains()

  const isEngaged = useIsEngaged()
  const [expandedDomain, setExpandedDomain] = useState<CognitiveDomainId | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(true)

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 space-y-4 min-h-[500px] flex flex-col items-center justify-center text-center">
        <Brain className="w-8 h-8 text-slate-600 animate-pulse" />
        <div className="space-y-1">
          <p className="text-sm text-slate-400">Loading cognitive profile...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (engagement.totalDemonstrations === 0) {
    return (
      <div className="p-4 space-y-4 min-h-[500px] flex flex-col items-center justify-center text-center">
        <Brain className="w-8 h-8 text-slate-600" />
        <div className="space-y-1">
          <p className="text-sm text-slate-400">Your cognitive profile is waiting to emerge</p>
          <p className="text-xs text-slate-500">Make choices in conversations to reveal your strengths</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative p-4 space-y-6 min-h-[500px]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
        <svg viewBox="0 0 400 600" className="w-full h-full">
          <defs>
            <radialGradient id="cognition-grad" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="180" r="150" fill="url(#cognition-grad)" />
        </svg>
      </div>

      {/* Header */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
        className="relative z-10 text-center space-y-1"
      >
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
          Cognitive Profile
        </h3>
        <p className="text-xs text-slate-400">
          {profile.averageLevel} • {profile.dominantCategory === 'balanced' ? 'Balanced Growth' :
            profile.dominantCategory === 'core' ? 'Foundation-Focused' : 'Advanced-Focused'}
        </p>
      </motion.div>

      {/* Engagement Indicator */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, scale: 0.95 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springs.gentle, delay: STAGGER_DELAY.normal }}
        className="relative z-10"
      >
        <EngagementBadge
          level={engagement.level}
          activeDays={engagement.activeDaysLast7}
          isEngaged={isEngaged}
        />
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, scale: 0.9 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springs.smooth, delay: STAGGER_DELAY.normal * 2 }}
        className="relative z-10 flex justify-center"
      >
        <CognitionRadar
          domains={domains}
          size={280}
          onDomainClick={(id) => setExpandedDomain(expandedDomain === id ? null : id)}
          highlightedDomain={expandedDomain}
        />
      </motion.div>

      {/* Strongest Domains */}
      {strongestDomains.length > 0 && strongestDomains[0].rawScore > 0 && (
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: STAGGER_DELAY.normal * 3 }}
          className="relative z-10 space-y-2"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            Strongest Areas
          </h4>
          <div className="flex flex-wrap gap-2">
            {strongestDomains.filter(d => d.rawScore > 0).slice(0, 3).map((domain) => (
              <DomainPill key={domain.domainId} domain={domain} variant="strong" />
            ))}
          </div>
        </motion.div>
      )}

      {/* Near Threshold (Close to leveling up) */}
      {nearThreshold.length > 0 && (
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: STAGGER_DELAY.normal * 4 }}
          className="relative z-10 space-y-2"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            Almost There
          </h4>
          <div className="flex flex-wrap gap-2">
            {nearThreshold.slice(0, 3).map((domain) => (
              <DomainPill key={domain.domainId} domain={domain} variant="near" />
            ))}
          </div>
        </motion.div>
      )}

      {/* Core Domains Section */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: STAGGER_DELAY.normal * 5 }}
        className="relative z-10 space-y-3"
      >
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Core Cognitive Domains
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {coreDomains.map((domain, index) => (
            <DomainCard
              key={domain.domainId}
              domain={domain}
              isExpanded={expandedDomain === domain.domainId}
              onToggle={() => setExpandedDomain(
                expandedDomain === domain.domainId ? null : domain.domainId
              )}
              delay={index * STAGGER_DELAY.fast}
            />
          ))}
        </div>
      </motion.div>

      {/* Advanced Domains Section */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: STAGGER_DELAY.normal * 6 }}
        className="relative z-10 space-y-3"
      >
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-300 transition-colors"
        >
          <span>Advanced Domains</span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={springs.smooth}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {advancedDomains.map((domain, index) => (
                  <DomainCard
                    key={domain.domainId}
                    domain={domain}
                    isExpanded={expandedDomain === domain.domainId}
                    onToggle={() => setExpandedDomain(
                      expandedDomain === domain.domainId ? null : domain.domainId
                    )}
                    delay={index * STAGGER_DELAY.fast}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expanded Domain Detail */}
      <AnimatePresence>
        {expandedDomain && (
          <DomainDetailPanel
            domainId={expandedDomain}
            onClose={() => setExpandedDomain(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Sub-Components
// -----------------------------------------------------------------------------

interface EngagementBadgeProps {
  level: string
  activeDays: number
  isEngaged: boolean
}

function EngagementBadge({ level, activeDays, isEngaged }: EngagementBadgeProps) {
  const color = isEngaged ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
    : 'bg-slate-500/20 border-slate-500/30 text-slate-400'

  return (
    <div className={`mx-auto w-fit px-3 py-1.5 rounded-full border ${color} flex items-center gap-2`}>
      <Activity className="w-3 h-3" />
      <span className="text-xs font-medium">
        {activeDays}/7 days active
        {isEngaged && ' • On Track'}
      </span>
    </div>
  )
}

interface DomainPillProps {
  domain: CognitiveDomainScore
  variant: 'strong' | 'near'
}

function DomainPill({ domain, variant }: DomainPillProps) {
  const meta = DOMAIN_METADATA[domain.domainId]
  const color = variant === 'strong' ? 'bg-emerald-500/20 border-emerald-500/30'
    : 'bg-amber-500/20 border-amber-500/30'

  return (
    <div
      className={`px-2 py-1 rounded-full border ${color} flex items-center gap-1.5`}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      <span className="text-xs text-slate-300">{meta.shortName}</span>
    </div>
  )
}

interface DomainCardProps {
  domain: CognitiveDomainScore
  isExpanded: boolean
  onToggle: () => void
  delay?: number
}

function DomainCard({ domain, isExpanded, onToggle, delay = 0 }: DomainCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const meta = DOMAIN_METADATA[domain.domainId]
  const levelColor = getLevelColor(domain.level)
  const levelLabel = getLevelLabel(domain.level)

  return (
    <motion.button
      initial={!prefersReducedMotion ? { opacity: 0, y: 5 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.gentle, delay }}
      onClick={onToggle}
      className={`
        w-full p-3 rounded-lg text-left transition-all
        ${isExpanded
          ? 'bg-white/10 border border-white/20'
          : 'bg-white/5 border border-white/10 hover:bg-white/8'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-200 truncate">
            {meta.shortName}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: levelColor }}
            />
            <span className="text-[10px] text-slate-400">{levelLabel}</span>
          </div>
        </div>

        {/* Confidence Ring */}
        <div className="relative w-8 h-8 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              stroke={meta.color}
              strokeWidth="3"
              strokeDasharray={`${domain.confidence * 97.4} 97.4`}
              strokeLinecap="round"
              style={{ opacity: 0.8 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[8px] text-slate-400">
            {Math.round(domain.confidence * 100)}%
          </span>
        </div>
      </div>
    </motion.button>
  )
}

interface DomainDetailPanelProps {
  domainId: CognitiveDomainId
  onClose: () => void
}

function DomainDetailPanel({ domainId, onClose }: DomainDetailPanelProps) {
  const prefersReducedMotion = useReducedMotion()
  const { domains } = useCognitiveDomains()
  const domain = domains[domainId]
  const meta = DOMAIN_METADATA[domainId]
  const { progress, currentLevel, nextLevel } = useDomainProgress(domainId)

  if (!domain) return null

  return (
    <motion.div
      initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={springs.smooth}
      className="relative z-20 mt-4 p-4 rounded-lg bg-slate-900/90 border border-white/10 backdrop-blur-sm"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Domain header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${meta.color}20` }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{meta.name}</h4>
          <p className="text-xs text-slate-400">{meta.description}</p>
        </div>
      </div>

      {/* Progress to next level */}
      {nextLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{currentLevel}</span>
            <span>{nextLevel}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={springs.smooth}
              className="h-full rounded-full"
              style={{ backgroundColor: meta.color }}
            />
          </div>
        </div>
      )}

      {/* Evidence breakdown */}
      <div className="space-y-2">
        <h5 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Contributing Skills
        </h5>
        <div className="space-y-1">
          {domain.evidence
            .filter(e => e.demonstrationCount > 0)
            .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
            .slice(0, 5)
            .map((evidence) => (
              <div
                key={evidence.skillId}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-300 capitalize">
                  {evidence.skillId.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-slate-500">
                  {evidence.demonstrationCount} demos
                </span>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  )
}
