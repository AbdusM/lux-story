"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Compass, TrendingUp, Sparkles } from "lucide-react"
import { useInsights } from "@/hooks/useInsights"
import { useConstellationData } from "@/hooks/useConstellationData"
import { cn } from "@/lib/utils"
import { PATTERN_METADATA, type PatternType } from "@/lib/patterns"

interface JournalProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'style' | 'connections' | 'patterns'

export function Journal({ isOpen, onClose }: JournalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('style')

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

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const panelVariants: import("framer-motion").Variants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  }

  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: 'style', label: 'Your Style', icon: Compass },
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
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">Journal</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {insights.journey.stageLabel} Journey
                </p>
              </div>
              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                aria-label="Close journal"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800" role="tablist">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]",
                    activeTab === tab.id
                      ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* Your Style Tab - Decision Making Profile */}
              {activeTab === 'style' && (
                <div className="space-y-6">
                  {/* Primary Pattern */}
                  {insights.decisionStyle.primaryPattern ? (
                    <div className="space-y-4">
                      <div
                        className={cn(
                          "p-5 rounded-xl border-2",
                          `border-${getPatternColorClass(insights.decisionStyle.primaryPattern.type)}`
                        )}
                        style={{
                          borderColor: PATTERN_METADATA[insights.decisionStyle.primaryPattern.type]?.color || '#f59e0b',
                          backgroundColor: `${PATTERN_METADATA[insights.decisionStyle.primaryPattern.type]?.color}10`
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Sparkles
                            className="w-6 h-6"
                            style={{ color: PATTERN_METADATA[insights.decisionStyle.primaryPattern.type]?.color }}
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              {insights.decisionStyle.primaryPattern.label}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {insights.decisionStyle.primaryPattern.percentage}% of your choices
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {insights.decisionStyle.primaryPattern.description}
                        </p>
                      </div>

                      {/* Secondary Pattern */}
                      {insights.decisionStyle.secondaryPattern && (
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            <span className="font-medium">Also strong in: </span>
                            {insights.decisionStyle.secondaryPattern.label}
                            <span className="text-slate-400 ml-1">
                              ({insights.decisionStyle.secondaryPattern.percentage}%)
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      <Compass className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 italic text-sm">Your decision style is forming...</p>
                      <p className="text-slate-400 text-xs mt-1">Make more choices to reveal your natural approach.</p>
                    </div>
                  )}

                  {/* Choice Patterns */}
                  {insights.choicePatterns.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        What We Notice
                      </h4>
                      {insights.choicePatterns.map((pattern, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <h5 className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                            {pattern.pattern}
                          </h5>
                          <p className="text-xs text-slate-500 mt-1">
                            {pattern.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Connections Tab - Relationships */}
              {activeTab === 'connections' && (
                <div className="space-y-4">
                  {/* Relationship Pattern Insight */}
                  {insights.relationshipPattern && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-4">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {insights.relationshipPattern.pattern}
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                        {insights.relationshipPattern.description}
                      </p>
                    </div>
                  )}

                  {characterEntries.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 italic text-sm">Talk to Samuel to meet your first character.</p>
                      <p className="text-slate-400 text-xs mt-1">Each conversation reveals new connections.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {insights.topRelationships.map((rel) => (
                        <div
                          key={rel.characterId}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className={cn("font-bold", rel.color)}>{rel.name}</h4>
                              <p className="text-xs text-slate-400">{rel.trustLabel}</p>
                            </div>
                            <div className="text-sm font-mono text-slate-600 dark:text-slate-300">
                              {rel.trust > 0 ? '+' : ''}{rel.trust}
                            </div>
                          </div>

                          {/* What they teach */}
                          <p className="text-xs text-slate-500 italic">
                            {rel.name} {rel.description}
                          </p>

                          {/* Trust bar */}
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
                            <div
                              className={cn(
                                "h-full transition-all duration-500 rounded-full",
                                rel.trust > 0 ? "bg-emerald-400" : "bg-rose-400"
                              )}
                              style={{ width: `${Math.min(100, Math.abs(rel.trust) * 10)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Insights Tab - Journey & Patterns */}
              {activeTab === 'patterns' && (
                <div className="space-y-6">
                  {/* Journey Progress */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        insights.journey.stage === 'early' && "bg-blue-100 text-blue-600",
                        insights.journey.stage === 'developing' && "bg-amber-100 text-amber-600",
                        insights.journey.stage === 'experienced' && "bg-emerald-100 text-emerald-600"
                      )}>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-700 dark:text-slate-200">
                          {insights.journey.stageLabel} Journey
                        </h4>
                        <p className="text-xs text-slate-500">
                          {insights.journey.choiceCount} choices made
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {insights.journey.description}
                    </p>
                  </div>

                  {/* Pattern Distribution */}
                  {insights.hasEnoughData && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Your Approach Distribution
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
                            <div
                              key={patternId}
                              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                  {metadata.shortLabel}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {percentage}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: metadata.color
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}

                  {!insights.hasEnoughData && (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 italic text-sm">Keep exploring to see more insights.</p>
                    </div>
                  )}
                </div>
              )}
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

// Helper to get Tailwind color class from pattern type
function getPatternColorClass(pattern: PatternType): string {
  const colorMap: Record<PatternType, string> = {
    analytical: 'blue-500',
    patience: 'green-500',
    exploring: 'purple-500',
    helping: 'pink-500',
    building: 'amber-500'
  }
  return colorMap[pattern] || 'amber-500'
}
