"use client"

import { useState } from 'react'
import { useNarrativeAnalysis } from '@/hooks/useNarrativeAnalysis'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Users, BookOpen, AlertTriangle, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Narrative Analysis Display Component
 * Shows comprehensive analysis of story arcs, character journeys, and hook effectiveness
 */
export function NarrativeAnalysisDisplay() {
  const {
    report,
    metrics,
    isAnalyzing,
    getQualityInsights,
    getStrengths,
    getCriticalIssues,
    getRecommendations,
    getPriorityFixes
  } = useNarrativeAnalysis()

  type TabId = 'overview' | 'arcs' | 'characters' | 'recommendations'
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
        <p>Analyzing narrative quality...</p>
      </div>
    )
  }

  if (!report || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
        <BarChart3 className="w-8 h-8 mb-3 opacity-50" />
        <p>No analysis data available</p>
      </div>
    )
  }

  const _qualityInsights = getQualityInsights()
  const strengths = getStrengths()
  const criticalIssues = getCriticalIssues()
  const _recommendations = getRecommendations()
  const priorityFixes = getPriorityFixes()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'arcs', label: 'Story Arcs', icon: BookOpen },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'recommendations', label: 'Actions', icon: Lightbulb }
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Narrative Quality Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Structural analysis of story & character
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            {report.overallScore}
            <span className="text-sm text-slate-600 font-normal">/100</span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Overall Score</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Completion" value={metrics.narrativeCompletion} />
        <MetricCard label="Hook Impact" value={metrics.hookEffectiveness} />
        <MetricCard label="Char. Depth" value={metrics.characterDevelopment} />
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
          {/* OVERVIEW CONTENT */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Priority Insights */}
              <div className="space-y-3">
                {criticalIssues.length > 0 && (
                  <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> Critical Attention
                    </h4>
                    <ul className="space-y-1">
                      {criticalIssues.map((issue, i) => (
                        <li key={i} className="text-xs text-rose-200/70 flex items-start gap-2">
                          <span className="mt-1 w-1 h-1 rounded-full bg-rose-500" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {strengths.length > 0 && (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" /> Core Strengths
                    </h4>
                    <ul className="space-y-1">
                      {strengths.map((str, i) => (
                        <li key={i} className="text-xs text-emerald-200/70 flex items-start gap-2">
                          <span className="mt-1 w-1 h-1 rounded-full bg-emerald-500" />
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ARCS CONTENT */}
          {activeTab === 'arcs' && (
            <motion.div
              key="arcs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {report.storyArcAnalysis.map(arc => (
                <div key={arc.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-slate-200">{arc.name}</h4>
                    <StatusBadge status={arc.status} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Completion</span>
                      <span>{arc.completionPercentage}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500/70"
                        style={{ width: `${arc.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* CHARACTERS CONTENT */}
          {activeTab === 'characters' && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {report.characterJourneyAnalysis.map(char => (
                <div key={char.characterId} className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                    {/* Simple avatar placeholder */}
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-medium text-slate-200">{char.name}</h4>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide font-bold",
                        char.alignment === 'on-track' ? "bg-emerald-950/50 text-emerald-400" : "bg-amber-950/50 text-amber-400"
                      )}>
                        {char.alignment}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{char.emotionalState}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* RECOMMENDATIONS CONTENT */}
          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {priorityFixes.immediate.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Priority Actions</h4>
                  {priorityFixes.immediate.map((fix, i) => (
                    <div key={i} className="p-3 border border-amber-500/20 bg-amber-950/10 rounded-lg flex gap-3">
                      <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-100/80">{fix}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Long Term</h4>
                {priorityFixes.longTerm.map((fix, i) => (
                  <div key={i} className="p-2 border-l-2 border-slate-700 pl-3">
                    <p className="text-xs text-slate-400">{fix}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
      <div className="text-xl font-bold text-white mb-1">{value}%</div>
      <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{label}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    complete: "text-emerald-400 bg-emerald-950/30 border-emerald-500/30",
    resolution: "text-blue-400 bg-blue-950/30 border-blue-500/30",
    active: "text-amber-400 bg-amber-950/30 border-amber-500/30",
  }[status] || "text-slate-400 bg-slate-900 border-slate-700"

  return (
    <span className={cn("text-[9px] px-1.5 py-0.5 rounded-sm border uppercase font-bold tracking-wider", styles)}>
      {status}
    </span>
  )
}

