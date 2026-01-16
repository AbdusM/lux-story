import React, { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Compass, Target, TrendingUp, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CareerCard } from './CareerCard'
import { createSkillTracker, type CareerMatch } from '@/lib/skill-tracker'
import { generateUserId } from '@/lib/safe-storage'

/**
 * CareerRecommendationsView - Layer 4 of Progressive Skill Revelation
 *
 * Shows players how their demonstrated skills map to Birmingham career pathways
 * with evidence-based recommendations from the SkillTracker system.
 */
export function CareerRecommendationsView() {
  const prefersReducedMotion = useReducedMotion()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Get user ID from safe storage (generates or retrieves consistent ID)
  const userId = useMemo(() => generateUserId(), [])

  // Get career matches from skill tracker
  const { careerMatches, totalDemonstrations } = useMemo(() => {
    const tracker = createSkillTracker(userId)
    const profile = tracker.exportSkillProfile()
    return {
      careerMatches: profile.careerMatches,
      totalDemonstrations: profile.totalDemonstrations
    }
  }, [userId])

  // Count by readiness level
  const readinessCounts = useMemo(() => {
    const counts = { near_ready: 0, developing: 0, exploring: 0 }
    careerMatches.forEach((career: CareerMatch) => {
      counts[career.readiness]++
    })
    return counts
  }, [careerMatches])

  const hasData = totalDemonstrations > 0

  return (
    <div className="relative p-6 pb-20 space-y-6 min-h-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/grid-pattern.svg')] bg-[size:30px_30px]" />

      {/* Header */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-purple-500" />
          <h2 className="text-xs font-bold text-purple-500/80 uppercase tracking-[0.2em] font-mono">
            Career Mapping
          </h2>
        </div>
        <h1 className="text-3xl font-bold text-white font-serif tracking-tight mb-2">
          Career Matches
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
          Based on the skills you've demonstrated in your journey, these Birmingham career pathways align with your strengths.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-4 text-xs font-mono">
          {readinessCounts.near_ready > 0 && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              {readinessCounts.near_ready} Near Ready
            </span>
          )}
          {readinessCounts.developing > 0 && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              {readinessCounts.developing} Developing
            </span>
          )}
          {readinessCounts.exploring > 0 && (
            <span className="flex items-center gap-1.5 text-blue-400/70">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              {readinessCounts.exploring} Exploring
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 space-y-4">
        {!hasData ? (
          // Empty state
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center">
              <Compass className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Your Journey Awaits</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Make choices in conversations to reveal which career paths match your skills and decision-making style.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4" />
              <span>Career matches update as you explore</span>
            </div>
          </motion.div>
        ) : careerMatches.length === 0 ? (
          // No matches yet
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-950/30 border border-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Building Your Profile</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              You've made {totalDemonstrations} skill demonstrations. Keep exploring to unlock personalized career recommendations.
            </p>
          </motion.div>
        ) : (
          // Career cards
          <>
            <div className="space-y-3">
              {careerMatches.map((career: CareerMatch, index: number) => (
                <CareerCard
                  key={career.name}
                  career={career}
                  rank={index + 1}
                  isExpanded={expandedIndex === index}
                  onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                />
              ))}
            </div>

            {/* Footer note */}
            <div className="pt-4 text-center">
              <p className="text-xs text-slate-500 font-mono">
                Based on {totalDemonstrations} skill demonstration{totalDemonstrations !== 1 ? 's' : ''} across your journey
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
