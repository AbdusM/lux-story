"use client"

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Lock, ChevronRight, Users, Compass, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs, STAGGER_DELAY } from '@/lib/animations'
import { Quest, QuestStatus } from '@/lib/quest-system'

interface QuestsViewProps {
  quests: Quest[]
  onSelectQuest?: (quest: Quest) => void
}

const statusConfig: Record<QuestStatus, {
  icon: typeof CheckCircle2
  label: string
  color: string
  bgColor: string
}> = {
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/30'
  },
  active: {
    icon: Circle,
    label: 'In Progress',
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/30'
  },
  unlocked: {
    icon: Circle,
    label: 'Available',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30'
  },
  locked: {
    icon: Lock,
    label: 'Locked',
    color: 'text-slate-500',
    bgColor: 'bg-slate-800/50'
  }
}

const typeConfig: Record<Quest['type'], {
  icon: typeof Users
  label: string
}> = {
  character_arc: {
    icon: Users,
    label: 'Character Story'
  },
  discovery: {
    icon: Compass,
    label: 'Discovery'
  },
  return_hook: {
    icon: RefreshCw,
    label: 'Return Visit'
  }
}

function QuestCard({ quest, index, onSelect }: { quest: Quest; index: number; onSelect?: () => void }) {
  const status = statusConfig[quest.status]
  const type = typeConfig[quest.type]
  const StatusIcon = status.icon
  const TypeIcon = type.icon

  const isInteractive = quest.status !== 'locked'

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * STAGGER_DELAY.normal, ...springs.gentle }}
      onClick={isInteractive ? onSelect : undefined}
      disabled={!isInteractive}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-amber-500/50",
        isInteractive && "hover:border-slate-600 cursor-pointer",
        !isInteractive && "cursor-not-allowed opacity-60",
        status.bgColor,
        quest.status === 'locked' ? 'border-slate-700/50' : 'border-slate-700'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn("w-5 h-5 flex-shrink-0", status.color)} />
          <span className={cn(
            "font-medium",
            quest.status === 'locked' ? 'text-slate-400' : 'text-white'
          )}>
            {quest.title}
          </span>
        </div>
        {isInteractive && (
          <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        )}
      </div>

      {/* Description */}
      <p className={cn(
        "mt-2 text-sm leading-relaxed",
        quest.status === 'locked' ? 'text-slate-500' : 'text-slate-300'
      )}>
        {quest.status === 'locked' ? '???' : quest.description}
      </p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <TypeIcon className="w-3.5 h-3.5" />
          <span>{type.label}</span>
        </div>
        <span className={cn("text-xs font-medium", status.color)}>
          {status.label}
        </span>
      </div>

      {/* Reward preview (completed only) */}
      {quest.status === 'completed' && quest.reward && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <p className="text-xs text-emerald-400">
            {quest.reward.description}
          </p>
        </div>
      )}
    </motion.button>
  )
}

export function QuestsView({ quests, onSelectQuest }: QuestsViewProps) {
  // Group quests by status
  const activeQuests = quests.filter(q => q.status === 'active' || q.status === 'unlocked')
  const completedQuests = quests.filter(q => q.status === 'completed')
  const lockedQuests = quests.filter(q => q.status === 'locked')

  return (
    <div className="space-y-6 p-4">
      {/* Active/Available Quests */}
      {activeQuests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3 px-1">
            Active ({activeQuests.length})
          </h3>
          <div className="space-y-3">
            {activeQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                index={idx}
                onSelect={() => onSelectQuest?.(quest)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3 px-1">
            Completed ({completedQuests.length})
          </h3>
          <div className="space-y-3">
            {completedQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                index={idx + activeQuests.length}
                onSelect={() => onSelectQuest?.(quest)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Quests */}
      {lockedQuests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3 px-1">
            Locked ({lockedQuests.length})
          </h3>
          <div className="space-y-3">
            {lockedQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                index={idx + activeQuests.length + completedQuests.length}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {quests.length === 0 && (
        <div className="text-center py-12">
          <Compass className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No quests discovered yet.</p>
          <p className="text-sm text-slate-500 mt-1">
            Talk to Samuel to begin your journey.
          </p>
        </div>
      )}
    </div>
  )
}
