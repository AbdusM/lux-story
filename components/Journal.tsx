import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Zap, Compass, TrendingUp, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useConstellationData } from "@/hooks/useConstellationData"
import { useInsights } from "@/hooks/useInsights"
import { PlayerAvatar } from "./CharacterAvatar"
import { HarmonicsView } from "./HarmonicsView"
import { EssenceSigil } from "./EssenceSigil"
import { ThoughtCabinet } from "./ThoughtCabinet"
import { AchievementStars } from "./AchievementStars"
import { ConstellationGraph } from "./constellation/ConstellationGraph"
import { SkillConstellationGraph } from "./constellation/SkillConstellationGraph"
import { SKILL_DEFINITIONS } from "@/lib/skill-definitions"
import { SwipeablePanel } from "@/components/ui/SwipeablePanel"

interface JournalProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'harmonics' | 'essence' | 'mind' | 'stars'

const tabContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
} as const

export function Journal({ isOpen, onClose }: JournalProps) {
  // "The Prism" Interface
  const [activeTab, setActiveTab] = useState<TabId>('harmonics')
  const [constellationMode, setConstellationMode] = useState<'social' | 'academy'>('social')
  const [detailSkillId, setDetailSkillId] = useState<string | null>(null)

  // ... (hooks)
  const { characters, skills } = useConstellationData()
  const insights = useInsights()


  // Reset detail view when tab changes
  useEffect(() => {
    setDetailSkillId(null)
  }, [activeTab])

  // ... (variants)

  // New Prism Tabs
  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: 'harmonics', label: 'Harmonics', icon: Zap },
    { id: 'essence', label: 'Essence', icon: Compass },
    { id: 'mind', label: 'Mind', icon: TrendingUp },
    { id: 'stars', label: 'Constellation', icon: Sparkles }, // Renamed back to Constellation per user intent? Or "Network"? Let's stick to "Stars" but upgrade content. 
    // Actually user said "Social Constellation" and "Skill Constellation".
  ]

  // Helper for detail view
  const activeSkillDef = detailSkillId ? SKILL_DEFINITIONS[detailSkillId] : null
  const activeSkillState = detailSkillId ? skills.find(s => s.id === detailSkillId) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ... (Backdrop & Panel code unchanged until Content Area) ... */}
          <motion.div
            // ... (Panel attributes)
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col"
          // ...
          >
            {/* ... (Header & Tabs unchanged) ... */}

            {/* Header Code ... */}
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50/30 dark:bg-slate-900/30">
              {/* Background Grid */}
              <div className="absolute inset-0 bg-grid-slate-200/20 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

              <AnimatePresence mode="wait">
                {activeTab === 'stars' && detailSkillId ? (
                  // --- DETAIL VIEW (THE LIBRARY) ---
                  <SwipeablePanel
                    key="skill-detail"
                    onClose={() => setDetailSkillId(null)}
                    className="absolute inset-0 bg-white dark:bg-slate-900 z-10 p-6 overflow-y-auto cursor-grab active:cursor-grabbing"
                  >
                    <button
                      onClick={() => setDetailSkillId(null)}
                      className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-6"
                    >
                      <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-all">
                        <span className="text-sm font-sans relative top-px">←</span>
                      </div>
                      Return to Academy
                    </button>

                    {activeSkillDef && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
                        {/* Header */}
                        <div>
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{activeSkillDef.title}</h2>
                          <p className="text-lg font-serif italic text-amber-600 dark:text-amber-400">
                            "{activeSkillDef.superpowerName}"
                          </p>
                        </div>

                        {/* Level Badge */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                              {activeSkillState?.demonstrationCount || 0}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase">Level</div>
                          </div>
                          <div className="h-8 w-px bg-slate-200 dark:bg-slate-600" />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                              Mastery Progress
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 transition-all duration-1000"
                                style={{ width: `${Math.min(((activeSkillState?.demonstrationCount || 0) / 10) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Definition */}
                        <div className="prose dark:prose-invert">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Definition</h3>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                            {activeSkillDef.definition}
                          </p>
                        </div>

                        {/* Manifesto */}
                        <div className="bg-slate-900 text-slate-300 p-6 rounded-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-24 h-24" />
                          </div>
                          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Manifesto</h3>
                          <p className="text-lg font-serif leading-relaxed text-white relative z-10">
                            {activeSkillDef.manifesto}
                          </p>
                        </div>
                      </div>
                    )}
                  </SwipeablePanel>
                ) : (
                  // --- STANDARD TABS ---
                  <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-full flex flex-col"
                  >
                    {activeTab === 'harmonics' && <HarmonicsView />}
                    {activeTab === 'essence' && <EssenceSigil />}
                    {activeTab === 'mind' && <ThoughtCabinet />}

                    {activeTab === 'stars' && (
                      <div className="flex-1 flex flex-col">
                        {/* Mode Toggle */}
                        <div className="flex justify-center p-4">
                          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                            <button
                              onClick={() => setConstellationMode('social')}
                              className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                constellationMode === 'social'
                                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                  : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                              Social
                            </button>
                            <button
                              onClick={() => setConstellationMode('academy')}
                              className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                constellationMode === 'academy'
                                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                  : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                              Academy
                            </button>
                          </div>
                        </div>

                        {/* Graph Content */}
                        <div className="flex-1 relative">
                          {constellationMode === 'social' ? (
                            <ConstellationGraph
                              characters={characters}
                            // Social details handled inside graph or can be lifted later. 
                            // For now, ConstellationGraph has its own behavior, 
                            // but ideally we'd show social details similarly? 
                            // User didn't ask to change social, just add skills.
                            />
                          ) : (
                            <SkillConstellationGraph
                              skills={skills}
                              onOpenDetail={(skill) => setDetailSkillId(skill.id)}
                            />
                          )}
                        </div>

                        <div className="p-4 text-center space-y-1">
                          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                            {constellationMode === 'social' ? "Network Topology" : "Skill Matrix"}
                          </p>
                          {constellationMode === 'academy' && (
                            <p className="text-[9px] text-slate-300 dark:text-slate-600">
                              Unlocked: {skills.filter(s => s.state !== 'dormant').length} / {skills.length}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
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



