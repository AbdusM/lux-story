"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { stagger, springs } from '@/lib/animations'
import type { SkillWithState } from '@/hooks/useConstellationData'
import { SKILL_CONNECTIONS, SKILL_CLUSTERS, type SkillCluster } from '@/lib/constellation/skill-positions'
import { ClusterFilterChips, type ClusterFilter } from './ClusterFilterChips'
import { SKILL_CHARACTER_HINTS } from '@/lib/skill-definitions'

interface SkillsViewProps {
  skills: SkillWithState[]
  onOpenDetail?: (skill: SkillWithState) => void
}

// Animation variants based on skill state
const stateVariants = {
  dormant: { scale: 0.85, opacity: 0.35 },
  awakening: { scale: 0.95, opacity: 0.6 },
  developing: { scale: 1, opacity: 0.8 },
  strong: { scale: 1.05, opacity: 1 },
  mastered: { scale: 1.1, opacity: 1 }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.1
    }
  }
}

const itemVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.snappy
  }
}

export function SkillsView({ skills, onOpenDetail: _onOpenDetail }: SkillsViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<ClusterFilter>('all')
  const selectedSkill = skills.find(s => s.id === selectedId)

  // Calculate skill counts per cluster (demonstrated only)
  const skillCounts = useMemo(() => {
    const counts: Record<ClusterFilter, number> = {
      all: skills.filter(s => s.state !== 'dormant').length,
      mind: 0,
      heart: 0,
      voice: 0,
      hands: 0,
      compass: 0,
      craft: 0,
      center: 0
    }
    skills.forEach(s => {
      if (s.state !== 'dormant') {
        counts[s.cluster]++
      }
    })
    return counts
  }, [skills])

  // Filter skills based on active cluster
  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') return skills
    return skills.filter(s => s.cluster === activeFilter)
  }, [skills, activeFilter])

  // Get skill position by ID (from filtered or all skills)
  const getSkillPos = (id: string) => skills.find(s => s.id === id)?.position

  // Filter connections to only show demonstrated skills within filter
  const demonstratedIds = new Set(skills.filter(s => s.state !== 'dormant').map(s => s.id))
  const filteredIds = new Set(filteredSkills.map(s => s.id))
  const visibleConnections = SKILL_CONNECTIONS.filter(
    ([from, to]) => {
      // At least one skill must be in filtered view
      const inFilter = filteredIds.has(from) || filteredIds.has(to)
      // At least one skill must be demonstrated
      const hasDemonstrated = demonstratedIds.has(from) || demonstratedIds.has(to)
      return inFilter && hasDemonstrated
    }
  )

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Cluster Filter Chips */}
      <div className="flex-shrink-0 border-b border-slate-800">
        <ClusterFilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          skillCounts={skillCounts}
        />
      </div>

      {/* SVG Constellation */}
      <div className="flex-1 relative p-4 pt-6">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-[400px] mx-auto select-none"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Connection lines (Clean Blueprint Style) */}
          {visibleConnections.map(([from, to]) => {
            const fromPos = getSkillPos(from)
            const toPos = getSkillPos(to)
            if (!fromPos || !toPos) return null

            const fromSkill = skills.find(s => s.id === from)
            const toSkill = skills.find(s => s.id === to)
            const bothDemonstrated = fromSkill?.state !== 'dormant' && toSkill?.state !== 'dormant'

            // Dim connections when filtering
            const isFiltered = activeFilter !== 'all' &&
              fromSkill?.cluster !== activeFilter &&
              toSkill?.cluster !== activeFilter

            return (
              <motion.line
                key={`${from}-${to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="white"
                strokeWidth={bothDemonstrated ? '0.3' : '0.1'}
                className={cn(
                  "transition-all duration-700",
                  bothDemonstrated ? "opacity-40" : "opacity-10"
                )}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isFiltered ? 0.1 : (bothDemonstrated ? 0.4 : 0.1) }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            )
          })}

          {/* Skill nodes (Geometric Purity) */}
          {filteredSkills.map((skill) => {
            const isSelected = selectedId === skill.id
            const baseSize = skill.id === 'communication' ? 5 : 3.5
            const size = skill.state === 'mastered' ? baseSize * 1.1 : baseSize
            const isUnlocked = skill.state !== 'dormant'

            return (
              <motion.g
                key={skill.id}
                variants={itemVariants}
                className={cn("cursor-pointer transition-all duration-300", !isUnlocked && "grayscale opacity-40")}
                onClick={() => setSelectedId(isSelected ? null : skill.id)}
                role="button"
              >
                {/* Hit Area */}
                <circle cx={skill.position.x} cy={skill.position.y} r={10} fill="transparent" />

                {/* Selection Ring (Sharp) */}
                {isSelected && (
                  <circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size + 3}
                    fill="none"
                    stroke="white"
                    strokeWidth="0.2"
                    className="opacity-50"
                  />
                )}

                {/* Main Node (Solid) */}
                <circle
                  cx={skill.position.x}
                  cy={skill.position.y}
                  r={size}
                  fill={isUnlocked ? skill.color : "#475569"}
                  className="transition-colors duration-300"
                />

                {/* Mastery Indicator (Minimal Ring instead of Aura) */}
                {skill.state === 'mastered' && (
                  <circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size + 1}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.2"
                    className="text-amber-400 opacity-60"
                  />
                )}
              </motion.g>
            )
          })}

          {/* Cluster labels (Clean Sans) */}
          {Object.entries(SKILL_CLUSTERS).map(([clusterId, cluster]) => {
            if (clusterId === 'center') return null

            const labelPositions: Record<string, { x: number; y: number }> = {
              mind: { x: 50, y: 5 },
              heart: { x: 8, y: 38 },
              voice: { x: 92, y: 38 },
              hands: { x: 12, y: 80 },
              compass: { x: 88, y: 80 },
              craft: { x: 50, y: 98 }
            }

            const pos = labelPositions[clusterId]
            if (!pos) return null

            const isActiveCluster = activeFilter === clusterId

            return (
              <text
                key={clusterId}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                className={cn(
                  "text-[2.5px] uppercase tracking-widest font-sans transition-all duration-300",
                  isActiveCluster ? "font-bold fill-white" : "font-medium fill-slate-600"
                )}
              >
                {cluster.name}
              </text>
            )
          })}
        </motion.svg>
      </div>

      {/* Selected skill detail panel */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-shrink-0 bg-slate-900 border-t border-slate-800 p-4"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ backgroundColor: selectedSkill.state === 'dormant' ? '#334155' : selectedSkill.color }}
            >
              {selectedSkill.state === 'dormant' ? '' : selectedSkill.demonstrationCount}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-100 truncate tracking-wide">{selectedSkill.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
                {selectedSkill.state === 'dormant' ? 'Locked' : `Level ${selectedSkill.demonstrationCount}`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
