"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { stagger, springs } from '@/lib/animations'
import type { SkillWithState } from '@/hooks/useConstellationData'
import { SKILL_CONNECTIONS, SKILL_CLUSTERS, type SkillCluster } from '@/lib/constellation/skill-positions'
import { ClusterFilterChips, type ClusterFilter } from './ClusterFilterChips'

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

// Skill-to-character development hints
const SKILL_CHARACTER_HINTS: Record<string, string[]> = {
  leadership: ['Maya', 'Samuel'],
  courage: ['Kai', 'Maya'],
  criticalThinking: ['Rohan', 'Kai'],
  problemSolving: ['Devon', 'Rohan'],
  systemsThinking: ['Silas', 'Rohan'],
  crisisManagement: ['Silas', 'Kai'],
  triage: ['Silas'],
  digitalLiteracy: ['Rohan', 'Kai'],
  technicalLiteracy: ['Rohan'],
  adaptability: ['Kai', 'Jordan'],
  resilience: ['Kai', 'Jordan'],
  learningAgility: ['Rohan', 'Maya'],
  emotionalIntelligence: ['Devon', 'Maya', 'Jordan'],
  empathy: ['Jordan', 'Devon'],
  patience: ['Samuel', 'Jordan'],
  culturalCompetence: ['Jordan', 'Yaquin'],
  creativity: ['Maya', 'Tess'],
  marketing: ['Maya'],
  communication: ['Samuel', 'Maya', 'Devon'],
  collaboration: ['Devon', 'Jordan'],
  humility: ['Rohan', 'Jordan'],
  fairness: ['Silas', 'Jordan'],
  pragmatism: ['Rohan', 'Samuel'],
  deepWork: ['Rohan'],
  timeManagement: ['Samuel', 'Kai'],
  curriculumDesign: ['Kai'],
  mentorship: ['Samuel'],
  wisdom: ['Samuel', 'Yaquin'],
  observation: ['Tess'],
  curiosity: ['Tess', 'Rohan'],
  integrity: ['Samuel', 'Silas'],
  accountability: ['Kai', 'Samuel'],
  financialLiteracy: ['Devon'],
  actionOrientation: ['Kai', 'Maya'],
  riskManagement: ['Silas', 'Kai'],
  urgency: ['Silas'],
  encouragement: ['Jordan', 'Samuel'],
  respect: ['Samuel', 'Jordan'],
  informationLiteracy: ['Rohan'],
  strategicThinking: ['Maya', 'Silas']
}

export function SkillsView({ skills, onOpenDetail }: SkillsViewProps) {
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
    <div className="h-full flex flex-col">
      {/* Cluster Filter Chips */}
      <div className="flex-shrink-0 border-b border-slate-700/50">
        <ClusterFilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          skillCounts={skillCounts}
        />
      </div>

      {/* SVG Constellation */}
      <div className="flex-1 relative p-4">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-[400px] mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          role="img"
          aria-label={`Skill constellation showing ${filteredSkills.filter(s => s.state !== 'dormant').length} of ${filteredSkills.length} skills${activeFilter !== 'all' ? ` in ${SKILL_CLUSTERS[activeFilter as SkillCluster]?.name || activeFilter} cluster` : ''}`}
        >
          {/* Connection lines */}
          {visibleConnections.map(([from, to]) => {
            const fromPos = getSkillPos(from)
            const toPos = getSkillPos(to)
            if (!fromPos || !toPos) return null

            const fromSkill = skills.find(s => s.id === from)
            const toSkill = skills.find(s => s.id === to)
            const bothDemonstrated = fromSkill?.state !== 'dormant' && toSkill?.state !== 'dormant'
            // Dim connections when filtering to a different cluster
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
                stroke={bothDemonstrated ? 'rgba(251, 191, 36, 0.5)' : 'rgba(71, 85, 105, 0.35)'}
                strokeWidth="0.5"
                strokeDasharray={bothDemonstrated ? '0' : '1 1'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isFiltered ? 0.2 : 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            )
          })}

          {/* Skill nodes */}
          {filteredSkills.map((skill) => {
            const isSelected = selectedId === skill.id
            const baseSize = skill.id === 'communication' ? 5 : 3.5 // Hub is larger
            const size = skill.state === 'mastered' ? baseSize * 1.2 : baseSize

            return (
              <motion.g
                key={skill.id}
                variants={itemVariants}
                className="cursor-pointer"
                onClick={() => setSelectedId(isSelected ? null : skill.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                aria-label={`${skill.name}. ${skill.state === 'dormant' ? 'Not yet demonstrated' : `${skill.state}, ${skill.demonstrationCount} demonstrations`}. ${isSelected ? 'Selected' : 'Tap to select'}`}
                aria-pressed={isSelected}
              >
                {/* Invisible hit area (44px equivalent in viewbox units) */}
                <circle
                  cx={skill.position.x}
                  cy={skill.position.y}
                  r={11}
                  fill="transparent"
                  className="touch-manipulation"
                />

                {/* Mastery aura */}
                {skill.state === 'mastered' && (
                  <motion.circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size + 2}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="0.4"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}

                {/* Main circle */}
                <motion.circle
                  cx={skill.position.x}
                  cy={skill.position.y}
                  r={size}
                  fill={skill.state === 'dormant' ? '#374151' : skill.color}
                  style={{
                    filter: skill.state === 'dormant' ? 'grayscale(100%)' : 'none'
                  }}
                  variants={stateVariants}
                  initial="dormant"
                  animate={skill.state}
                />

                {/* Developing pulse */}
                {skill.state === 'developing' && (
                  <motion.circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size}
                    fill="none"
                    stroke={skill.color}
                    strokeWidth="0.3"
                    animate={{
                      scale: [1, 1.3],
                      opacity: [0.6, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                )}

                {/* Selection ring */}
                {isSelected && (
                  <motion.circle
                    cx={skill.position.x}
                    cy={skill.position.y}
                    r={size + 1.5}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="0.6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  />
                )}
              </motion.g>
            )
          })}

          {/* Cluster labels */}
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

            // Highlight label when filtered to this cluster
            const isActiveCluster = activeFilter === clusterId
            const isDimmed = activeFilter !== 'all' && !isActiveCluster

            return (
              <text
                key={clusterId}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                className={cn(
                  "text-[2.5px] font-medium uppercase tracking-wider transition-all",
                  isActiveCluster && "text-[3px] font-bold",
                  isDimmed ? "fill-slate-700" : "fill-slate-500"
                )}
                style={isActiveCluster ? { fill: cluster.color } : undefined}
              >
                {cluster.name}
              </text>
            )
          })}
        </motion.svg>
      </div>

      {/* Selected skill detail panel - simplified */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-shrink-0 bg-slate-800/80 border-t border-slate-700 p-3"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {/* Simple: name + count + characters who teach it */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
              style={{ backgroundColor: selectedSkill.state === 'dormant' ? '#374151' : selectedSkill.color }}
            >
              {selectedSkill.state === 'dormant' ? '?' : selectedSkill.demonstrationCount}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{selectedSkill.name}</h3>
              {selectedSkill.state === 'dormant' ? (
                <p className="text-xs text-slate-500">Not yet demonstrated</p>
              ) : SKILL_CHARACTER_HINTS[selectedSkill.id] ? (
                <p className="text-xs text-slate-400">
                  Learn from: {SKILL_CHARACTER_HINTS[selectedSkill.id].join(', ')}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  {selectedSkill.demonstrationCount} demonstration{selectedSkill.demonstrationCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
