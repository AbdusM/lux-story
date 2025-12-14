"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Compass, TrendingUp, Sparkles, Zap, ChevronDown, ChevronUp } from "lucide-react"
import { useInsights } from "@/hooks/useInsights"
import { useConstellationData } from "@/hooks/useConstellationData"
import { useOrbs } from "@/hooks/useOrbs"
import { usePatternUnlocks, type OrbState } from "@/hooks/usePatternUnlocks"
import { useGameSelectors } from "@/lib/game-store"
import { cn } from "@/lib/utils"
import { PATTERN_METADATA, type PatternType } from "@/lib/patterns"
import { springs, durations } from "@/lib/animations"
import { PlayerAvatar } from "@/components/CharacterAvatar"
import { OrbBalanceMini } from "@/components/orbs"
import { getUnlocksForPattern } from "@/lib/pattern-unlocks"

// Tab content transition variants
const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast }
  }
}

interface JournalProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'orbs' | 'style' | 'connections' | 'patterns'

export function Journal({ isOpen, onClose }: JournalProps) {
  // Default to 'orbs' tab to demonstrate core mechanic (Miyamoto: "demonstrate, don't explain")
  const [activeTab, setActiveTab] = useState<TabId>('orbs')
  const [expandedOrb, setExpandedOrb] = useState<PatternType | null>(null)

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Get insights from the insights engine
  const insights = useInsights()
  const { characters } = useConstellationData()
  const { balance: orbBalance } = useOrbs()
  const { orbs: patternOrbs, totalProgress } = usePatternUnlocks()

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const panelVariants: import("framer-motion").Variants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  }

  // Tabs - Orbs always visible (accessible) but shows "not yet achieved" state before introduction
  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: 'orbs', label: 'Orbs', icon: Zap },
    { id: 'style', label: 'Style', icon: Compass },
    { id: 'connections', label: 'Bonds', icon: Users },
    { id: 'patterns', label: 'Insights', icon: TrendingUp },
  ]

  // Get characters with trust levels
  const characterEntries = characters
    .filter(c => c.hasMet)
    .map(c => [c.id, c.trust] as [string, number])
    .sort(([, a], [, b]) => b - a)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-over Panel (from left) - swipe left to close */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.2, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) onClose()
            }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <PlayerAvatar size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">Your Journal</h2>
                    {orbBalance.totalEarned > 0 && (
                      <OrbBalanceMini balance={orbBalance} />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {insights.journey.stageLabel} Journey
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                aria-label="Close journal"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Tabs with animated underline */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 relative" role="tablist">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] relative",
                    activeTab === tab.id
                      ? "text-amber-600"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="journal-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                      transition={springs.snappy}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Content - Compact padding */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">

              {/* Pattern Orbs Tab - 5 filling orbs */}
              {activeTab === 'orbs' && (
                <motion.div
                  key="orbs-tab"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-3"
                >
                  {/* Overall Progress */}
                  <div className="text-center mb-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Overall Progress</p>
                    <p className="text-2xl font-bold text-amber-600">{totalProgress}%</p>
                  </div>

                  {/* 5 Pattern Orbs */}
                  {patternOrbs.map((orb) => (
                    <OrbCard
                      key={orb.pattern}
                      orb={orb}
                      isExpanded={expandedOrb === orb.pattern}
                      onToggle={() => setExpandedOrb(expandedOrb === orb.pattern ? null : orb.pattern)}
                    />
                  ))}

                  {/* Hint at bottom */}
                  <p className="text-[10px] text-slate-400 text-center pt-2 italic">
                    Make choices to fill your orbs and unlock abilities
                  </p>
                </motion.div>
              )}

              {/* Your Style Tab - Compact */}
              {activeTab === 'style' && (
                <motion.div
                  key="style-tab"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-3"
                >
                  {/* Primary Pattern - Game-like stat card */}
                  {insights.decisionStyle.primaryPattern ? (
                    <>
                      <div
                        className="p-3 rounded-lg border-l-4"
                        style={{
                          borderLeftColor: PATTERN_METADATA[insights.decisionStyle.primaryPattern.type]?.color || '#f59e0b',
                          backgroundColor: `${PATTERN_METADATA[insights.decisionStyle.primaryPattern.type]?.color}08`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles
                              className="w-4 h-4"
                              style={{ color: PATTERN_METADATA[insights.decisionStyle.primaryPattern.type]?.color }}
                            />
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {insights.decisionStyle.primaryPattern.label}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-500">
                            {insights.decisionStyle.primaryPattern.percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 leading-snug">
                          {insights.decisionStyle.primaryPattern.description}
                        </p>
                      </div>

                      {/* Secondary Pattern - inline */}
                      {insights.decisionStyle.secondaryPattern && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
                          <span>Secondary:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {insights.decisionStyle.secondaryPattern.label}
                          </span>
                          <span className="font-mono">
                            {insights.decisionStyle.secondaryPattern.percentage}%
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                      <Compass className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">Make choices to reveal your style</p>
                    </div>
                  )}

                  {/* Choice Patterns - Compact list */}
                  {insights.choicePatterns.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Observations
                      </h4>
                      {insights.choicePatterns.map((pattern, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 text-xs"
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            {pattern.pattern}
                          </span>
                          <span className="text-slate-500 ml-1">— {pattern.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Connections Tab - Compact */}
              {activeTab === 'connections' && (
                <motion.div
                  key="connections-tab"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-2"
                >
                  {/* Relationship Pattern Insight - Compact */}
                  {insights.relationshipPattern && (
                    <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400 text-xs mb-3">
                      <span className="font-medium text-amber-800 dark:text-amber-200">
                        {insights.relationshipPattern.pattern}
                      </span>
                    </div>
                  )}

                  {characterEntries.length === 0 ? (
                    <div className="p-4 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                      <Users className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">Talk to characters to build bonds</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {insights.topRelationships.map((rel) => (
                        <div
                          key={rel.characterId}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            <h4 className={cn("font-bold text-sm flex-1", rel.color)}>{rel.name}</h4>
                            <span className="text-[10px] text-slate-400 uppercase">{rel.trustLabel}</span>
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 w-6 text-right">
                              {rel.trust > 0 ? '+' : ''}{rel.trust}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 italic">{rel.description}</p>
                          {/* Compact trust bar */}
                          <div className="h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                            <div
                              className={cn("h-full rounded-full", rel.trust > 0 ? "bg-emerald-400" : "bg-rose-400")}
                              style={{ width: `${Math.min(100, Math.abs(rel.trust) * 10)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Insights Tab - Compact */}
              {activeTab === 'patterns' && (
                <motion.div
                  key="patterns-tab"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-3"
                >
                  {/* Journey Progress - Compact */}
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                        insights.journey.stage === 'early' && "bg-blue-100 text-blue-600",
                        insights.journey.stage === 'developing' && "bg-amber-100 text-amber-600",
                        insights.journey.stage === 'experienced' && "bg-emerald-100 text-emerald-600"
                      )}>
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                            {insights.journey.stageLabel}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {insights.journey.choiceCount} choices
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{insights.journey.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pattern Distribution - Compact */}
                  {insights.hasEnoughData && (
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Approach
                      </h4>
                      {(Object.entries(insights.raw.patterns) as [string, number][])
                        .filter(([key, value]) =>
                          value > 0 &&
                          ['analytical', 'patience', 'exploring', 'helping', 'building'].includes(key)
                        )
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([patternId, value]) => {
                          const metadata = PATTERN_METADATA[patternId as PatternType]
                          if (!metadata) return null

                          const total = (Object.entries(insights.raw.patterns) as [string, number][])
                            .filter(([k]) => ['analytical', 'patience', 'exploring', 'helping', 'building'].includes(k))
                            .reduce((sum, [, v]) => sum + v, 0)
                          const percentage = total > 0 ? Math.round((value / total) * 100) : 0

                          return (
                            <div key={patternId} className="flex items-center gap-2">
                              <span className="text-xs text-slate-600 dark:text-slate-300 w-20 truncate">
                                {metadata.shortLabel}
                              </span>
                              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${percentage}%`, backgroundColor: metadata.color }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                                {percentage}%
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  )}

                  {!insights.hasEnoughData && (
                    <div className="p-3 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                      <p className="text-slate-400 text-xs">Keep playing to see insights</p>
                    </div>
                  )}
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div
              className="flex-shrink-0 p-4 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-200 dark:border-slate-800"
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
            >
              <p className="text-xs text-slate-400">Your choices reveal who you are.</p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Helper to get Tailwind color class from pattern type (currently unused but kept for future use)
function _getPatternColorClass(pattern: PatternType): string {
  const colorMap: Record<PatternType, string> = {
    analytical: 'blue-500',
    patience: 'green-500',
    exploring: 'purple-500',
    helping: 'pink-500',
    building: 'amber-500'
  }
  return colorMap[pattern] || 'amber-500'
}

/**
 * OrbCard - Displays a single pattern orb with fill progress and unlocks
 */
function OrbCard({ orb, isExpanded, onToggle }: {
  orb: OrbState
  isExpanded: boolean
  onToggle: () => void
}) {
  const allUnlocks = getUnlocksForPattern(orb.pattern)

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all"
      style={{
        borderColor: `${orb.color}40`,
        backgroundColor: `${orb.color}08`,
      }}
    >
      {/* Header - Always visible, clickable */}
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center gap-3 min-h-[60px] hover:bg-white/30 transition-colors"
      >
        {/* Orb Symbol */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${orb.color}20, ${orb.color}40)`,
            boxShadow: orb.fillPercent > 0 ? `0 0 12px ${orb.color}40` : 'none',
          }}
        >
          <span style={{ color: orb.color }}>{orb.symbol}</span>
        </div>

        {/* Label + Progress */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              {orb.label}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {orb.fillPercent}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: orb.color }}
              initial={{ width: 0 }}
              animate={{ width: `${orb.fillPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{orb.tierLabel}</p>
        </div>

        {/* Expand indicator */}
        <div className="text-slate-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content - Unlocks */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
              {/* Tagline */}
              <p className="text-xs italic text-slate-500 mb-2">"{orb.tagline}"</p>

              {/* Unlocks List */}
              {allUnlocks.map((unlock) => {
                const isUnlocked = orb.fillPercent >= unlock.threshold
                const isNext = orb.nextUnlock?.id === unlock.id

                return (
                  <div
                    key={unlock.id}
                    className={cn(
                      "flex items-start gap-2 p-2 rounded-lg text-xs",
                      isUnlocked
                        ? "bg-white/50 dark:bg-slate-800/50"
                        : isNext
                        ? "bg-slate-100/50 dark:bg-slate-800/30"
                        : "opacity-40"
                    )}
                  >
                    {/* Status Icon - only show if unlocked or next */}
                    <span className="text-sm flex-shrink-0 w-4 text-center" style={{ color: isUnlocked ? orb.color : undefined }}>
                      {isUnlocked ? '✓' : isNext ? '◎' : ''}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "font-medium",
                          isUnlocked ? "text-slate-800 dark:text-slate-200" : isNext ? "text-slate-600" : "text-slate-400"
                        )}>
                          {unlock.name}
                        </span>
                        {!isUnlocked && (
                          <span className="text-[10px] text-slate-400">
                            {unlock.threshold}%
                          </span>
                        )}
                      </div>
                      {isUnlocked && (
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {unlock.description}
                        </p>
                      )}
                      {isNext && (
                        <div className="mt-1">
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${orb.progressToNext}%`,
                                backgroundColor: orb.color,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Reach {orb.nextUnlock?.threshold}% to unlock
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
