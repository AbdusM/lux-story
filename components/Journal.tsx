"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Compass, TrendingUp, Sparkles, Zap } from "lucide-react"
import { useInsights } from "@/hooks/useInsights"
import { useConstellationData } from "@/hooks/useConstellationData"
import { cn } from "@/lib/utils"
import { durations } from "@/lib/animations"
import { PlayerAvatar } from "@/components/CharacterAvatar"
// Imports for the new components (to be added at top of file)
import { HarmonicsView } from "./HarmonicsView"
import { EssenceSigil } from "./EssenceSigil"
import { ConstellationGraph } from "./constellation/ConstellationGraph"
import { ThoughtCabinet } from "./ThoughtCabinet"
import { AchievementStars } from "./AchievementStars"

// Tab content transition variants
const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: [0.25, 0.46, 0.45, 0.94] as const }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast }
  }
}

interface JournalProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'harmonics' | 'essence' | 'constellation' | 'mind' | 'stars'

export function Journal({ isOpen, onClose }: JournalProps) {
  // "The Prism" Interface
  const [activeTab, setActiveTab] = useState<TabId>('harmonics')

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Data hooks
  const insights = useInsights()
  const { characters } = useConstellationData()

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const panelVariants: import("framer-motion").Variants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  }

  // New Prism Tabs
  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: 'harmonics', label: 'Harmonics', icon: Zap }, // Was Orbs
    { id: 'essence', label: 'Essence', icon: Compass }, // Was Style
    { id: 'constellation', label: 'Constellation', icon: Users }, // Was Connections
    { id: 'mind', label: 'Mind', icon: TrendingUp }, // Was Insights
    { id: 'stars', label: 'Stars', icon: Sparkles }, // New
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed inset-0 bg-slate-900/60 z-[90] backdrop-blur-md"
            onClick={onClose}
          />

          {/* Slide-over Panel (The Prism) */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.2, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) onClose()
            }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col backdrop-blur-xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Prism Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <PlayerAvatar size="lg" />
                <div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-purple-600 font-serif">
                    The Prism
                  </h2>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">
                    {insights.journey.stageLabel} Resonance
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close prism"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 py-4 px-3 text-xs font-medium transition-colors flex flex-col items-center gap-1.5 min-w-[64px] relative",
                    activeTab === tab.id
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5 transition-transform", activeTab === tab.id && "scale-110")} />
                  <span>{tab.label}</span>

                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="prism-tab-active"
                      className="absolute bottom-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-purple-600"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
              <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="min-h-full"
                >
                  {activeTab === 'harmonics' && <HarmonicsView />}
                  {activeTab === 'essence' && <EssenceSigil />}
                  {activeTab === 'constellation' && <ConstellationGraph characters={characters} />}
                  {activeTab === 'mind' && <ThoughtCabinet />}
                  {activeTab === 'stars' && <AchievementStars />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 text-center">
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Nominal
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}



