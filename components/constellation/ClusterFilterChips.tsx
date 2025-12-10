"use client"

import { cn } from '@/lib/utils'
import { SKILL_CLUSTERS, type SkillCluster } from '@/lib/constellation/skill-positions'

export type ClusterFilter = SkillCluster | 'all'

interface ClusterFilterChipsProps {
  activeFilter: ClusterFilter
  onFilterChange: (filter: ClusterFilter) => void
  skillCounts?: Record<ClusterFilter, number>
}

// Cluster order for display (excluding 'center' as it's the hub)
const CLUSTER_ORDER: ClusterFilter[] = ['all', 'mind', 'heart', 'voice', 'hands', 'compass', 'craft']

export function ClusterFilterChips({
  activeFilter,
  onFilterChange,
  skillCounts
}: ClusterFilterChipsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
      role="group"
      aria-label="Filter skills by cluster"
    >
      {CLUSTER_ORDER.map(clusterId => {
        const isAll = clusterId === 'all'
        const isActive = activeFilter === clusterId
        const cluster = isAll ? null : SKILL_CLUSTERS[clusterId as SkillCluster]
        const color = isAll ? '#94A3B8' : cluster?.color || '#94A3B8' // slate-400 for "All"
        const count = skillCounts?.[clusterId]

        return (
          <button
            key={clusterId}
            onClick={() => onFilterChange(clusterId)}
            className={cn(
              "flex-shrink-0 min-w-[44px] min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium",
              "transition-all duration-200 flex items-center justify-center gap-2",
              "focus:outline-none focus:ring-2 focus:ring-amber-400/50",
              "touch-manipulation active:scale-95",
              isActive
                ? "text-white shadow-lg"
                : "text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 active:bg-slate-600/50"
            )}
            style={isActive ? {
              backgroundColor: color,
              boxShadow: `0 0 20px ${color}40`
            } : undefined}
            aria-pressed={isActive}
          >
            {isAll ? 'All' : cluster?.name}
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-700 text-slate-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
