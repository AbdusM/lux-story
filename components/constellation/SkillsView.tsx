"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { stagger, springs } from '@/lib/animations'
import type { SkillWithState } from '@/hooks/useConstellationData'
import { SKILL_CONNECTIONS, SKILL_CLUSTERS } from '@/lib/constellation/skill-positions'
import { ClusterFilterChips, type ClusterFilter } from './ClusterFilterChips'

interface SkillsViewProps {
  skills: SkillWithState[]
  onOpenDetail?: (skill: SkillWithState) => void
}

// Brass rim color (matches network view)
const RIM_COLOR = "#d97706" // Amber-600

// Animation variants based on skill state (reserved for future use)
const _stateVariants = {
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

export function SkillsView({ skills, onOpenDetail }: SkillsViewProps) {
  const [activeFilter, setActiveFilter] = useState<ClusterFilter>('all')
  // Removed local selectedId/selectedSkill state in favor of global modal

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
          {/* --- DEFINITIONS (Reusable Gradients - matches Network view) --- */}
          <defs>
            {/* Sphere Highlight (Top-Left Shine) */}
            <radialGradient id="skill-sphere-shine" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="20%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Sphere Shadow (Bottom-Right/Edge Depth) */}
            <radialGradient id="skill-sphere-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.6" />
            </radialGradient>
          </defs>

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

          {/* Skill nodes (3D Orb Style - matches Network view) */}
          {filteredSkills.map((skill) => {
            // Skip skills without valid positions (defensive guard)
            if (skill.position?.x === undefined || skill.position?.y === undefined) return null

            const baseSize = skill.id === 'communication' ? 5 : 3.5
            const size = skill.state === 'mastered' ? baseSize * 1.1 : baseSize
            const isUnlocked = skill.state !== 'dormant'
            const isActive = skill.state === 'developing' || skill.state === 'strong' || skill.state === 'mastered'

            return (
              <motion.g
                key={skill.id}
                variants={itemVariants}
                className={cn("cursor-pointer transition-all duration-300")}
                onClick={() => onOpenDetail?.(skill)}
                role="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ opacity: isUnlocked ? 1 : 0.4 }}
              >
                {/* Hit Area */}
                <circle cx={skill.position.x} cy={skill.position.y} r={10} fill="transparent" />

                {/* Outer Ring (Brass Rim - visible when unlocked) */}
                {isUnlocked && (
                  <circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size + 1.2}
                    fill="none"
                    stroke={RIM_COLOR}
                    strokeWidth={isActive ? "0.5" : "0.3"}
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "opacity-90" : "opacity-60"
                    )}
                  />
                )}

                {/* MARQUEE: Scanning Ring (for newly activated or mastered) */}
                {(skill.state === 'awakening' || skill.state === 'mastered') && (
                  <circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size + 3}
                    fill="none"
                    stroke={RIM_COLOR}
                    strokeWidth="0.15"
                    strokeDasharray="1 2.5"
                    className="animate-[spin_8s_linear_infinite] opacity-40"
                  />
                )}

                {/* 1. Base Color Orb */}
                <circle
                  cx={skill.position.x}
                  cy={skill.position.y}
                  r={size}
                  fill={isUnlocked ? skill.color : "#475569"}
                  className="transition-colors duration-300"
                />

                {/* 2. Inner Shadow (Depth) */}
                <circle
                  cx={skill.position.x}
                  cy={skill.position.y}
                  r={size}
                  fill="url(#skill-sphere-shadow)"
                  className="pointer-events-none"
                />

                {/* 3. Top Shine (Gloss) */}
                <circle
                  cx={skill.position.x}
                  cy={skill.position.y}
                  r={size}
                  fill="url(#skill-sphere-shine)"
                  className="pointer-events-none mix-blend-overlay"
                />

                {/* Mastery Indicator (Extra outer glow ring) */}
                {skill.state === 'mastered' && (
                  <circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size + 2}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="0.15"
                    className="opacity-50"
                  />
                )}

                {/* Skill Name Label (visible for demonstrated skills) */}
                {isUnlocked && (
                  <text
                    x={skill.position.x}
                    y={skill.position.y + size + 3}
                    textAnchor="middle"
                    className="fill-slate-300 text-[1.8px] font-medium tracking-wide pointer-events-none"
                    style={{ fontSize: '1.8px' }}
                  >
                    {skill.name}
                  </text>
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
    </div>
  )
}
