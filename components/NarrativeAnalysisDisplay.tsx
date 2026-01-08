"use client"

import { useState } from 'react'
import { usePlayerAnalysis } from '@/hooks/usePlayerAnalysis'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Users,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Briefcase,
  Award,
  Compass
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPatternColor } from '@/lib/patterns'

/**
 * Player Analysis Display Component
 * Shows real player insights: patterns, relationships, characters, and career growth
 */
export function NarrativeAnalysisDisplay() {
  const {
    insights,
    patternData,
    relationshipsData,
    careerData,
    hasEnoughData
  } = usePlayerAnalysis()

  type TabId = 'overview' | 'relationships' | 'characters' | 'growth'
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  if (!hasEnoughData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
        <Compass className="w-8 h-8 mb-3 opacity-50" />
        <p className="text-sm">Keep exploring to unlock insights</p>
        <p className="text-xs text-slate-600 mt-1">Make a few more choices...</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'relationships', label: 'Bonds', icon: Heart },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'growth', label: 'Growth', icon: Briefcase }
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Your Journey
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {insights.journey?.stageLabel || 'Beginning'} Explorer
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            {patternData.balanceScore}
            <span className="text-sm text-slate-600 font-normal">/100</span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Balance</div>
        </div>
      </div>

      {/* Metrics Grid - Pattern Summary */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Patterns"
          value={Object.values(patternData.patterns).reduce((a, b) => a + b, 0)}
          suffix=""
        />
        <MetricCard
          label="Bonds"
          value={relationshipsData.topBonds.length}
          suffix=""
        />
        <MetricCard
          label="Achievements"
          value={patternData.achievements.length}
          suffix=""
        />
      </div>

      {/* Sub-Navigation */}
      <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={cn(
              "py-3 text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap relative",
              activeTab === tab.id ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="analysis-tab-line"
                className="absolute bottom-0 left-0 right-0 h-px bg-emerald-500"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Decision Style */}
              {insights.decisionStyle?.primaryPattern && (
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                    Your Decision Style
                  </h4>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{
                        backgroundColor: `${getPatternColor(insights.decisionStyle.primaryPattern.type)}20`,
                        borderColor: getPatternColor(insights.decisionStyle.primaryPattern.type),
                        borderWidth: 2
                      }}
                    >
                      {getPatternEmoji(insights.decisionStyle.primaryPattern.type)}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {insights.decisionStyle.primaryPattern.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {insights.decisionStyle.primaryPattern.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pattern Balance */}
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Pattern Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(patternData.patterns).map(([pattern, value]) => (
                    <div key={pattern} className="flex items-center gap-2">
                      <div className="w-20 text-xs text-slate-500 capitalize">{pattern}</div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, value * 10)}%`,
                            backgroundColor: getPatternColor(pattern as keyof typeof patternData.patterns)
                          }}
                        />
                      </div>
                      <div className="w-6 text-xs text-slate-600 text-right">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              {patternData.achievements.length > 0 && (
                <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-lg">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Award className="w-3 h-3" /> Achievements Earned
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {patternData.achievements.slice(0, 5).map(achievement => (
                      <span
                        key={achievement.id}
                        className="text-xs px-2 py-1 bg-amber-900/30 text-amber-200 rounded-full"
                      >
                        {achievement.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* RELATIONSHIPS TAB */}
          {activeTab === 'relationships' && (
            <motion.div
              key="relationships"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Top Bonds */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Strongest Connections
                </h4>
                {relationshipsData.topBonds.length === 0 ? (
                  <p className="text-xs text-slate-500">No bonds formed yet...</p>
                ) : (
                  relationshipsData.topBonds.map((char, i) => (
                    <div
                      key={char.characterId}
                      className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{char.name}</div>
                        <div className="text-xs text-slate-500">
                          Trust: {char.trust}
                        </div>
                      </div>
                      <TrendIndicator trend={char.trend} />
                    </div>
                  ))
                )}
              </div>

              {/* Asymmetry Insights */}
              {relationshipsData.asymmetryInsights.length > 0 && (
                <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">
                    Insight
                  </h4>
                  {relationshipsData.asymmetryInsights.map((insight, i) => (
                    <p key={i} className="text-xs text-blue-200/70">{insight}</p>
                  ))}
                </div>
              )}

              {/* Declining Relationships */}
              {relationshipsData.declining.length > 0 && (
                <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-2">
                    Needs Attention
                  </h4>
                  <div className="space-y-1">
                    {relationshipsData.declining.map(char => (
                      <div key={char.characterId} className="text-xs text-rose-200/70 flex items-center gap-2">
                        <TrendingDown className="w-3 h-3" />
                        {char.name} - Trust declining
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* CHARACTERS TAB */}
          {activeTab === 'characters' && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {relationshipsData.characters
                .filter(c => c.hasMet)
                .sort((a, b) => b.trust - a.trust)
                .map(char => (
                  <div
                    key={char.characterId}
                    className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                      {getCharacterEmoji(char.characterId)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium text-slate-200">{char.name}</h4>
                        <TrendIndicator trend={char.trend} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500/70 rounded-full"
                            style={{ width: `${Math.min(100, char.trust * 10)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 w-8">
                          {char.trust}/10
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Not Met Section */}
              {relationshipsData.characters.filter(c => !c.hasMet).length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                    Not Yet Met
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {relationshipsData.characters
                      .filter(c => !c.hasMet)
                      .map(char => (
                        <span
                          key={char.characterId}
                          className="text-xs px-2 py-1 bg-slate-900 text-slate-600 rounded-full"
                        >
                          {char.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* GROWTH TAB */}
          {activeTab === 'growth' && (
            <motion.div
              key="growth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Career Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Career Alignment
                </h4>
                {careerData.recommendations.length === 0 ? (
                  <p className="text-xs text-slate-500">Keep exploring to discover career matches...</p>
                ) : (
                  careerData.recommendations.map((rec, i) => (
                    <div
                      key={rec.career.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        i === 0
                          ? "bg-emerald-950/20 border-emerald-500/30"
                          : "bg-slate-900/50 border-slate-800"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className={cn(
                            "text-sm font-medium",
                            i === 0 ? "text-emerald-300" : "text-slate-200"
                          )}>
                            {rec.career.name}
                          </h5>
                          <p className="text-xs text-slate-500">{rec.career.sector}</p>
                        </div>
                        <div className={cn(
                          "text-lg font-bold",
                          i === 0 ? "text-emerald-400" : "text-slate-400"
                        )}>
                          {rec.confidenceScore}%
                        </div>
                      </div>
                      {rec.matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rec.matchReasons.slice(0, 2).map((reason, j) => (
                            <span
                              key={j}
                              className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Skill Gaps */}
              {careerData.skillGaps && careerData.skillGaps.gaps.length > 0 && (
                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
                    Skills to Develop
                  </h4>
                  <div className="space-y-2">
                    {careerData.skillGaps.gaps.slice(0, 3).map(gap => (
                      <div key={gap.skillId} className="flex items-center gap-2">
                        <div className="flex-1 text-xs text-slate-300">{gap.skillName}</div>
                        <div className="text-[10px] text-amber-400">
                          {gap.currentLevel}/{gap.requiredLevel}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================
// HELPER COMPONENTS
// ============================================

function MetricCard({ label, value, suffix = '%' }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
      <div className="text-xl font-bold text-white mb-1">
        {value}{suffix}
      </div>
      <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{label}</div>
    </div>
  )
}

function TrendIndicator({ trend }: { trend: string }) {
  if (trend === 'improving') {
    return <TrendingUp className="w-4 h-4 text-emerald-500" />
  }
  if (trend === 'declining') {
    return <TrendingDown className="w-4 h-4 text-rose-500" />
  }
  return <Minus className="w-4 h-4 text-slate-600" />
}

function getPatternEmoji(pattern: string): string {
  const emojis: Record<string, string> = {
    analytical: '🔍',
    patience: '🌿',
    exploring: '🧭',
    helping: '🤝',
    building: '🔧'
  }
  return emojis[pattern] || '✨'
}

function getCharacterEmoji(characterId: string): string {
  const emojis: Record<string, string> = {
    samuel: '🦉',
    maya: '🐱',
    marcus: '🐻',
    kai: '🔥',
    rohan: '🐦',
    devon: '🦌',
    tess: '🦊',
    yaquin: '🐰',
    grace: '💚',
    elena: '📚',
    alex: '🐀',
    jordan: '🧭',
    silas: '🌱',
    asha: '🎨',
    lira: '🎵',
    zara: '📊'
  }
  return emojis[characterId] || '👤'
}
