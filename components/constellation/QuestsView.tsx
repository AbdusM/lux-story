"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Lock, ChevronRight, Users, Compass, RefreshCw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'
import { Quest, QuestStatus } from '@/lib/quest-system'

interface QuestsViewProps {
  quests: Quest[]
  onSelectQuest?: (quest: Quest) => void
}

const statusConfig: Record<QuestStatus, {
  icon: typeof CheckCircle2
  label: string
  color: string
  borderColor: string
  glowColor: string
}> = {
  completed: {
    icon: CheckCircle2,
    label: 'ARCHIVED',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'
  },
  active: {
    icon: Circle,
    label: 'ACTIVE',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
  },
  unlocked: {
    icon: AlertCircle,
    label: 'AVAILABLE',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    glowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]'
  },
  locked: {
    icon: Lock,
    label: 'ENCRYPTED',
    color: 'text-slate-600',
    borderColor: 'border-slate-800',
    glowColor: ''
  }
}

const typeConfig: Record<Quest['type'], {
  icon: typeof Users
  label: string
}> = {
  character_arc: {
    icon: Users,
    label: 'PERSONNEL FILE'
  },
  discovery: {
    icon: Compass,
    label: 'FIELD REPORT'
  },
  return_hook: {
    icon: RefreshCw,
    label: 'FOLLOW-UP'
  }
}

function QuestCard({ quest, index, onSelect }: { quest: Quest; index: number; onSelect?: () => void }) {
  const status = statusConfig[quest.status]
  const type = typeConfig[quest.type]
  const StatusIcon = status.icon
  const TypeIcon = type.icon

  const isInteractive = quest.status !== 'locked'
  const isCompleted = quest.status === 'completed'

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, ...springs.gentle }}
      onClick={isInteractive ? onSelect : undefined}
      disabled={!isInteractive}
      className={cn(
        "group w-full text-left relative overflow-hidden transition-all duration-300",
        "rounded-sm border-l-2 p-4",
        status.borderColor,
        status.glowColor,
        isInteractive ? "hover:bg-white/5 cursor-pointer" : "cursor-not-allowed opacity-60",
        isCompleted ? "bg-emerald-950/10" : "bg-slate-950/40"
      )}
    >
      {/* Background Tech Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/grid-pattern.svg')] bg-[size:20px_20px]" />

      {/* Scanline Effect for Active Quests */}
      {quest.status === 'active' && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent h-[200%] w-full animate-[scan_4s_linear_infinite] pointer-events-none" />
      )}

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-1.5 rounded-sm bg-black/40 border border-white/5", status.color)}>
            <StatusIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start">
            <span className={cn(
              "text-[10px] font-mono tracking-widest uppercase opacity-70 mb-0.5",
              status.color
            )}>
              {status.label}
            </span>
            <span className={cn(
              "font-bold tracking-wide leading-tight",
              quest.status === 'locked' ? 'text-slate-500 font-mono text-xs' : 'text-slate-100'
            )}>
              {quest.title}
            </span>
          </div>
        </div>

        {isInteractive && (
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform duration-300 group-hover:translate-x-1",
            status.color
          )} />
        )}
      </div>

      {/* Description Body */}
      <div className="mt-3 pl-[34px] relative z-10">
        <p className={cn(
          "text-xs leading-relaxed font-sans",
          quest.status === 'locked' ? 'text-slate-600 font-mono' : 'text-slate-400'
        )}>
          {quest.status === 'locked'
            ? '>> ENCRYPTED DATA SEGMENT. CLEARANCE REQUIRED.'
            : quest.description}
        </p>

        {/* Footer Meta */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <TypeIcon className="w-3 h-3 opacity-70" />
            <span>{type.label}</span>
          </div>

          {/* XP / Reward Hint */}
          {quest.status !== 'locked' && !isCompleted && (
            <span className="text-[9px] font-mono text-slate-600 border border-slate-800 px-1.5 py-0.5 rounded bg-black/20">
              ID: {quest.id.split('_').pop()?.toUpperCase() ?? 'UNK'}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}

export function QuestsView({ quests, onSelectQuest }: QuestsViewProps) {
  // Sort: Active -> Unlocked -> Completed -> Locked
  const sortedQuests = [...quests].sort((a, b) => {
    const score = (s: QuestStatus) => {
      if (s === 'active') return 0
      if (s === 'unlocked') return 1
      if (s === 'completed') return 2
      return 3
    }
    return score(a.status) - score(b.status)
  })

  const activeCount = quests.filter(q => q.status === 'active' || q.status === 'unlocked').length

  return (
    <div className="p-4 pb-20 space-y-6">
      <header className="flex items-end justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
            Mission Log
          </h2>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 font-mono tracking-tighter">
            ACTIVE DOSSIERS
          </h1>
        </div>
        <div className="text-right">
          <span className="text-2xs font-mono text-amber-500/60 block mb-0.5">PENDING</span>
          <span className="text-xl font-mono font-bold text-amber-500 leading-none">
            {String(activeCount).padStart(2, '0')}
          </span>
        </div>
      </header>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedQuests.map((quest, idx) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={idx}
              onSelect={() => onSelectQuest?.(quest)}
            />
          ))}
        </AnimatePresence>

        {quests.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-sm bg-slate-900/20">
            <Compass className="w-8 h-8 text-slate-700 mx-auto mb-3 animate-pulse" />
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
              Data Stream Empty
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

