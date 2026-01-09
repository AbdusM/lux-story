"use client"

/**
 * PatternMomentCapture Component
 *
 * Shows WHERE pattern orbs came from - which conversations grew each pattern
 * "47 orbs through 23 moments with Maya"
 * Click to expand and see specific moments
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useGameSelectors } from '@/lib/game-store'
import { getPatternHeatmapData } from '@/lib/pattern-derivatives'
import { getPatternColor, type PatternType, PATTERN_TYPES } from '@/lib/patterns'
import { cn } from '@/lib/utils'

// Character name mapping
const CHARACTER_NAMES: Record<string, string> = {
  samuel: 'Samuel',
  maya: 'Maya',
  marcus: 'Marcus',
  kai: 'Kai',
  rohan: 'Rohan',
  devon: 'Devon',
  tess: 'Tess',
  yaquin: 'Yaquin',
  grace: 'Grace',
  elena: 'Elena',
  alex: 'Alex',
  jordan: 'Jordan',
  silas: 'Silas',
  asha: 'Asha',
  lira: 'Lira',
  zara: 'Zara',
  quinn: 'Quinn',
  dante: 'Dante',
  nadia: 'Nadia',
  isaiah: 'Isaiah',
  station: 'The Station'
}

interface PatternMomentCaptureProps {
  compact?: boolean
}

export function PatternMomentCapture({ compact = false }: PatternMomentCaptureProps) {
  const history = useGameSelectors.usePatternEvolutionHistory()
  const [expandedPattern, setExpandedPattern] = useState<PatternType | null>(null)

  if (!history || history.points.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Your pattern moments will appear as you make choices
      </div>
    )
  }

  // Get heatmap data (pattern growth by character)
  const heatmapData = getPatternHeatmapData(history)

  // Aggregate stats for each pattern
  const patternStats = PATTERN_TYPES.map(pattern => {
    const total = history.patternTotals[pattern] || 0
    const moments = history.points.filter(p => p.pattern === pattern)
    const uniqueCharacters = new Set(moments.map(m => m.characterId))

    // Get top contributors
    const characterContributions: { characterId: string; total: number }[] = []
    heatmapData.forEach((patternMap, characterId) => {
      const contribution = patternMap.get(pattern) || 0
      if (contribution > 0) {
        characterContributions.push({ characterId, total: contribution })
      }
    })
    characterContributions.sort((a, b) => b.total - a.total)

    return {
      pattern,
      total,
      momentCount: moments.length,
      characterCount: uniqueCharacters.size,
      topContributors: characterContributions.slice(0, 3),
      recentMoments: moments.slice(-3).reverse()
    }
  }).filter(s => s.total > 0)

  if (patternStats.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Make choices to start building patterns
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {patternStats.map(stat => {
        const isExpanded = expandedPattern === stat.pattern
        const patternColor = getPatternColor(stat.pattern)
        const patternLabel = stat.pattern.charAt(0).toUpperCase() + stat.pattern.slice(1)

        return (
          <div
            key={stat.pattern}
            className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden"
          >
            {/* Summary row - always visible */}
            <button
              onClick={() => setExpandedPattern(isExpanded ? null : stat.pattern)}
              className="w-full p-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Pattern indicator */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${patternColor}20` }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: patternColor }}
                  />
                </div>

                {/* Pattern name and stats */}
                <div className="text-left">
                  <div className="text-sm font-medium text-white">
                    {patternLabel}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stat.total} orbs through {stat.momentCount} moments
                    {stat.characterCount > 1 && ` with ${stat.characterCount} characters`}
                    {stat.characterCount === 1 && stat.topContributors[0] &&
                      ` with ${CHARACTER_NAMES[stat.topContributors[0].characterId] || stat.topContributors[0].characterId}`
                    }
                  </div>
                </div>
              </div>

              {/* Expand indicator */}
              <div className="text-slate-500">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Expanded detail - character breakdown */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 border-t border-slate-800 pt-3 space-y-3">
                    {/* Character contributions */}
                    <div>
                      <h5 className="text-xs font-medium text-slate-400 mb-2">
                        Growth by Character
                      </h5>
                      <div className="space-y-1.5">
                        {stat.topContributors.map(contrib => {
                          const percentage = (contrib.total / stat.total) * 100
                          return (
                            <div key={contrib.characterId} className="flex items-center gap-2">
                              <div className="w-20 text-xs text-slate-400 truncate">
                                {CHARACTER_NAMES[contrib.characterId] || contrib.characterId}
                              </div>
                              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: patternColor }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <div className="w-8 text-xs text-slate-500 text-right">
                                +{contrib.total}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Recent moments */}
                    {stat.recentMoments.length > 0 && !compact && (
                      <div>
                        <h5 className="text-xs font-medium text-slate-400 mb-2">
                          Recent Moments
                        </h5>
                        <div className="space-y-1">
                          {stat.recentMoments.map((moment, i) => (
                            <div
                              key={`${moment.nodeId}-${moment.timestamp}`}
                              className={cn(
                                "text-xs p-2 rounded bg-slate-800/50",
                                i === 0 && "border-l-2"
                              )}
                              style={i === 0 ? { borderColor: patternColor } : undefined}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">
                                  {CHARACTER_NAMES[moment.characterId] || moment.characterId}
                                </span>
                                <span
                                  className="font-medium"
                                  style={{ color: patternColor }}
                                >
                                  +{moment.delta}
                                </span>
                              </div>
                              {moment.choiceText && (
                                <div className="text-slate-500 mt-1 line-clamp-1">
                                  "{moment.choiceText}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default PatternMomentCapture
