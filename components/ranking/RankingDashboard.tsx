'use client'

/**
 * RankingDashboard - Unified ranking overview
 *
 * Combines all ranking systems into a single dashboard view.
 * Anime-inspired with cross-system resonance display.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springs, STAGGER_DELAY } from '@/lib/animations'

// Components
import { PatternRankBadge } from './PatternRankBadge'
import { DomainExpertiseCard, CompactDomainBadge } from './CareerExpertiseBadge'
import { ReadinessCard, GradeBadge } from './ChallengeRatingBadge'
import { BillboardCard, StandingBadge } from './StationStandingBadge'
import { ConstellationBadge, SkillStarsRow } from './SkillStarsBadge'
import { EliteStatusCard, EliteTierBadge } from './EliteStatusBadge'

// Types
import type { OrbTier } from '@/lib/orbs'
import type {
  PatternMasteryState,
  CareerExpertiseState,
  PlayerReadiness,
  BillboardState,
  SkillStarsState,
  EliteStatusState
} from '@/lib/ranking/types'

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface RankingDashboardState {
  patternMastery?: {
    tier: OrbTier
    state: PatternMasteryState
  }
  careerExpertise?: CareerExpertiseState
  challengeRating?: PlayerReadiness
  stationStanding?: BillboardState
  skillStars?: SkillStarsState
  eliteStatus?: EliteStatusState
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════

interface CompactOverviewProps {
  state: RankingDashboardState
  className?: string
}

/**
 * Compact row of all ranking indicators
 */
export function CompactRankingOverview({
  state,
  className
}: CompactOverviewProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn('flex items-center flex-wrap gap-2', className)}
      initial={!prefersReducedMotion ? { opacity: 0, y: 5 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      {/* Pattern Mastery */}
      {state.patternMastery && (
        <PatternRankBadge tier={state.patternMastery.tier} size="sm" />
      )}

      {/* Challenge Rating */}
      {state.challengeRating && (
        <GradeBadge grade={state.challengeRating.grade} size="sm" />
      )}

      {/* Station Standing */}
      {state.stationStanding && (
        <StandingBadge
          standing={state.stationStanding.standing}
          size="sm"
        />
      )}

      {/* Skill Stars */}
      {state.skillStars && (
        <ConstellationBadge
          state={state.skillStars}
          size="sm"
          showStars={false}
        />
      )}

      {/* Elite Status */}
      {state.eliteStatus && state.eliteStatus.unlockedDesignations.length > 0 && (
        <EliteTierBadge
          unlockedCount={state.eliteStatus.unlockedDesignations.length}
          size="sm"
        />
      )}

      {/* Top career domains */}
      {state.careerExpertise && Object.values(state.careerExpertise.domains).slice(0, 2).map(d => (
        <CompactDomainBadge
          key={d.domain}
          domain={d.domain}
          level={d.level}
        />
      ))}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════════════════════════════

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-3', className)}>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {subtitle && (
        <p className="text-sm text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

interface RankingDashboardProps {
  state: RankingDashboardState
  layout?: 'grid' | 'list'
  showSections?: {
    patternMastery?: boolean
    careerExpertise?: boolean
    challengeRating?: boolean
    stationStanding?: boolean
    skillStars?: boolean
    eliteStatus?: boolean
  }
  className?: string
}

export function RankingDashboard({
  state,
  layout = 'grid',
  showSections = {
    patternMastery: true,
    careerExpertise: true,
    challengeRating: true,
    stationStanding: true,
    skillStars: true,
    eliteStatus: true
  },
  className
}: RankingDashboardProps) {
  const prefersReducedMotion = useReducedMotion()

  const containerClass = layout === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
    : 'flex flex-col gap-4'

  return (
    <div className={cn('space-y-6', className)}>
      {/* Pattern Mastery Section */}
      {showSections.patternMastery && state.patternMastery && (
        <motion.section
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, ...springs.gentle }}
        >
          <SectionHeader
            title="Pattern Mastery"
            subtitle="Your growth across the five patterns"
          />
          <div className="flex items-start gap-4">
            <PatternRankBadge
              tier={state.patternMastery.tier}
              size="lg"
              showProgress
              progressPercent={30} // Could derive from state
            />
          </div>
        </motion.section>
      )}

      {/* Main Grid/List */}
      <div className={containerClass}>
        {/* Career Expertise */}
        {showSections.careerExpertise && state.careerExpertise && (
          <motion.section
            initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: STAGGER_DELAY.normal, ...springs.gentle }}
          >
            <SectionHeader title="Career Expertise" />
            <div className="space-y-2">
              {Object.values(state.careerExpertise.domains).slice(0, 3).map(expertise => (
                <DomainExpertiseCard
                  key={expertise.domain}
                  expertise={expertise}
                  showEvidence={false}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Challenge Rating */}
        {showSections.challengeRating && state.challengeRating && (
          <motion.section
            initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: STAGGER_DELAY.normal * 2, ...springs.gentle }}
          >
            <SectionHeader title="Challenge Rating" />
            <ReadinessCard
              readiness={state.challengeRating}
              showDimensions
            />
          </motion.section>
        )}

        {/* Station Standing */}
        {showSections.stationStanding && state.stationStanding && (
          <motion.section
            initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: STAGGER_DELAY.normal * 3, ...springs.gentle }}
          >
            <SectionHeader title="Station Standing" />
            <BillboardCard
              state={state.stationStanding}
              showBreakdown
              showHighlights
            />
          </motion.section>
        )}

        {/* Skill Stars */}
        {showSections.skillStars && state.skillStars && (
          <motion.section
            initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: STAGGER_DELAY.normal * 4, ...springs.gentle }}
          >
            <SectionHeader title="Skill Stars" />
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <ConstellationBadge state={state.skillStars} size="md" />
              <div className="mt-4">
                <SkillStarsRow state={state.skillStars} size="md" />
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Elite Status (Full Width) */}
      {showSections.eliteStatus && state.eliteStatus && (
        <motion.section
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: STAGGER_DELAY.normal * 5, ...springs.gentle }}
        >
          <SectionHeader
            title="Elite Status"
            subtitle="Special designations for exceptional achievement"
          />
          <EliteStatusCard
            state={state.eliteStatus}
            showProgress
          />
        </motion.section>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MINI SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

interface MiniRankingSummaryProps {
  state: RankingDashboardState
  className?: string
}

/**
 * Minimal summary for headers or sidebars
 */
export function MiniRankingSummary({
  state,
  className
}: MiniRankingSummaryProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {state.patternMastery && (
        <PatternRankBadge tier={state.patternMastery.tier} size="sm" />
      )}
      {state.skillStars && (
        <span className="text-xs text-slate-400">
          {state.skillStars.totalStars} stars
        </span>
      )}
      {state.eliteStatus && state.eliteStatus.unlockedDesignations.length > 0 && (
        <span className="text-xs text-amber-400">
          {state.eliteStatus.unlockedDesignations.length} elite
        </span>
      )}
    </div>
  )
}

export default RankingDashboard
