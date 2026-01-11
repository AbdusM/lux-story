"use client"

import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Heart, Code, Mic, Search, Shield, Palette, Users, BookOpen, Wrench, Zap, Compass,
  CheckCircle2, Lock, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'
import { useSimulations, SimulationWithStatus } from '@/hooks/useSimulations'
import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'

const iconMap = {
  briefcase: Briefcase,
  heart: Heart,
  code: Code,
  mic: Mic,
  search: Search,
  shield: Shield,
  palette: Palette,
  users: Users,
  book: BookOpen,
  wrench: Wrench,
  zap: Zap,
  compass: Compass
}

function SimulationCard({ sim, index, onClose }: { sim: SimulationWithStatus; index: number; onClose?: () => void }) {
  const Icon = iconMap[sim.icon]
  const isLocked = !sim.isAvailable

  const handlePlay = () => {
    if (!sim.isAvailable || sim.isCompleted) return // Or allow replay if completed?
    // ISP: Allow replay if completed for "Mastery" check

    // Close journal
    onClose?.()

    // Navigate to entry node
    useGameStore.getState().updateCoreGameState(state => ({
      ...state,
      currentSceneId: sim.entryNodeId
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ...springs.gentle }}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "border-l-2 p-4 rounded-sm",
        sim.isCompleted
          ? "border-emerald-500/50 bg-emerald-950/10"
          : sim.isAvailable
            ? "border-amber-500/40 bg-slate-950/40 hover:bg-white/5"
            : "border-slate-800 bg-slate-950/20 opacity-50"
      )}
    >
      {/* Completion glow */}
      {sim.isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
      )}

      {/* Marquee ring for available simulations */}
      {sim.isAvailable && !sim.isCompleted && (
        <div className="absolute top-2 right-2 w-5 h-5 pointer-events-none">
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <circle
              cx="10" cy="10" r="8"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="0.75"
              strokeDasharray="2 4"
              className="animate-[spin_6s_linear_infinite]"
              opacity="0.4"
            />
          </svg>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 relative z-10">
        <div className={cn(
          "w-10 h-10 rounded flex items-center justify-center border",
          sim.isCompleted
            ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-400"
            : sim.isAvailable
              ? "bg-amber-950/30 border-amber-500/20 text-amber-400"
              : "bg-slate-900 border-slate-800 text-slate-600"
        )}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              "text-xs font-mono uppercase tracking-widest",
              sim.isCompleted ? "text-emerald-500/70" : sim.isAvailable ? "text-amber-500/70" : "text-slate-600"
            )}>
              {sim.characterName}
            </span>
            {sim.isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            {isLocked && <Lock className="w-3 h-3 text-slate-600" />}
          </div>

          <h3 className={cn(
            "font-bold tracking-tight mb-1",
            sim.isCompleted ? "text-slate-100" : sim.isAvailable ? "text-slate-200" : "text-slate-500"
          )}>
            {sim.title}
          </h3>

          <p className={cn(
            "text-xs",
            sim.isCompleted ? "text-emerald-400/70" : sim.isAvailable ? "text-amber-400/60" : "text-slate-600"
          )}>
            {sim.subtitle}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 pl-[52px]">
        <p className={cn(
          "text-xs leading-relaxed",
          isLocked ? "text-slate-600" : "text-slate-400"
        )}>
          {isLocked ? "Meet this character to unlock their simulation." : sim.description}
        </p>

        {/* Theme tag */}
        {!isLocked && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
              sim.isCompleted
                ? "border-emerald-500/20 text-emerald-400/80 bg-emerald-950/30"
                : "border-amber-500/20 text-amber-400/70 bg-amber-950/20"
            )}>
              {sim.theme}
            </span>

            {sim.aiTool && (
              <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded bg-black/20">
                {sim.aiTool}
              </span>
            )}
          </div>
        )}

        {/* Status indicator / Play Button */}
        {sim.isAvailable && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-400/60">
              <Play className="w-3 h-3" />
              <span className="text-xs font-medium uppercase tracking-wider">
                {sim.isCompleted ? 'Replay Simulation' : 'Available to play'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
              onClick={handlePlay}
            >
              {sim.isCompleted ? 'Revisit' : 'Start'}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function SimulationsArchive({ onClose }: { onClose?: () => void }) {
  const { simulations, completedCount, totalCount } = useSimulations()

  return (
    <div className="p-4 pb-20 space-y-6 min-h-full">
      {/* Header */}
      <header className="flex items-end justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
            Experience Archive
          </h2>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-500 font-mono tracking-tighter">
            SIMULATIONS
          </h1>
        </div>
        <div className="text-right">
          <span className="text-2xs font-mono text-purple-500/60 block mb-0.5">ARCHIVED</span>
          <span className="text-xl font-mono font-bold text-purple-500 leading-none">
            {String(completedCount).padStart(2, '0')}/{String(totalCount).padStart(2, '0')}
          </span>
        </div>
      </header>

      {/* Info text */}
      <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-purple-500/20 pl-3">
        Simulations are immersive experiences where you help characters navigate pivotal moments.
        Each simulation deepens your connection and reveals new perspectives.
      </p>

      {/* Simulation cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {simulations.map((sim, idx) => (
            <SimulationCard key={sim.id} sim={sim} index={idx} onClose={onClose} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {simulations.length === 0 && (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-sm bg-slate-900/20">
          <Compass className="w-8 h-8 text-slate-700 mx-auto mb-3 animate-pulse" />
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
            No simulations available yet
          </p>
        </div>
      )}
    </div>
  )
}
