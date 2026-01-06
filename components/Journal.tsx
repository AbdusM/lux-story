import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Users, Zap, Compass, TrendingUp, Sparkles, X, Crown, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useConstellationData } from "@/hooks/useConstellationData"
import { useInsights } from "@/hooks/useInsights"
import { useOrbs } from "@/hooks/useOrbs"
import { useGameSelectors } from "@/lib/game-store"
import { PlayerAvatar } from "./CharacterAvatar"
import { PatternOrb } from "./PatternOrb"
import { HarmonicsView } from "./HarmonicsView"
import { EssenceSigil } from "./EssenceSigil"
import { MasteryView } from "./MasteryView"
import { ThoughtCabinet } from "./ThoughtCabinet"
import { RelationshipWeb } from "./RelationshipWeb"
import { EchoLog } from "./EchoLog"
import { LogSearch } from "./LogSearch"

import { SkillConstellationGraph } from "./constellation/SkillConstellationGraph"
import { SKILL_DEFINITIONS } from "@/lib/skill-definitions"
import { SwipeablePanel } from "@/components/ui/SwipeablePanel"
import { ToolkitView } from "./ToolkitView"
import { OrbDetailPanel } from "./OrbDetailPanel"
import { PatternType } from "@/lib/patterns"

interface JournalProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'harmonics' | 'essence' | 'mastery' | 'mind' | 'stars' | 'toolkit'

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
  const [detailPattern, setDetailPattern] = useState<PatternType | null>(null)

  // Accessibility
  const prefersReducedMotion = useReducedMotion()

  // Data hooks
  const { characters, skills } = useConstellationData()
  const insights = useInsights()
  const { hasNewOrbs, markOrbsViewed } = useOrbs()
  const thoughts = useGameSelectors.useThoughts()
  const coreGameState = useGameSelectors.useCoreGameState()

  // Derive completed arcs from global flags for EchoLog
  const completedArcs = React.useMemo(() => {
    const flags = coreGameState?.globalFlags || []
    return new Set(flags.filter(f => f.endsWith('_arc_complete') || f.endsWith('_complete')))
  }, [coreGameState?.globalFlags])

  // Tab badge indicators
  const hasNewPatterns = hasNewOrbs
  const hasNewSkills = skills.filter(s => s.state !== 'dormant').length > 0
  const hasActiveThoughts = thoughts.length > 0
  const hasMetCharacters = characters.filter(c => c.hasMet).length > 1 // More than just Samuel
  // TODO: Add refined "new ability" tracking. For now, assume no badge or always false.
  const hasNewAbilities = false
  const hasNewTools = hasNewOrbs // Proxy: New patterns likely mean new tools

  // Track which tabs have been viewed this session
  const [viewedTabs, setViewedTabs] = useState<Set<TabId>>(new Set(['harmonics']))

  // Mark tab as viewed when selected
  const handleTabSelect = (tabId: TabId) => {
    setActiveTab(tabId)
    setViewedTabs(prev => new Set([...prev, tabId]))

    // Clear orb notification when viewing Harmonics
    if (tabId === 'harmonics' && hasNewOrbs) {
      markOrbsViewed()
    }
  }

  // Compute badge visibility (show if has content AND not yet viewed)
  const tabBadges: Record<TabId, boolean> = {
    harmonics: hasNewPatterns && !viewedTabs.has('harmonics'),
    essence: hasNewSkills && !viewedTabs.has('essence'),
    mastery: hasNewAbilities && !viewedTabs.has('mastery'),
    mind: hasActiveThoughts && !viewedTabs.has('mind'),
    stars: hasMetCharacters && !viewedTabs.has('stars'),
    toolkit: hasNewTools && !viewedTabs.has('toolkit')
  }


  // Reset detail view when tab changes
  useEffect(() => {
    setDetailSkillId(null)
    setDetailPattern(null)
  }, [activeTab])

  // ... (variants)

  // New Prism Tabs
  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: 'harmonics', label: 'Harmonics', icon: Zap },
    { id: 'essence', label: 'Essence', icon: Compass },
    { id: 'mastery', label: 'Mastery', icon: Crown },
    { id: 'mind', label: 'Mind', icon: TrendingUp },
    { id: 'stars', label: 'Constellation', icon: Sparkles }, // Renamed back to Constellation per user intent? Or "Network"? Let's stick to "Stars" but upgrade content. 
    // Actually user said "Social Constellation" and "Skill Constellation".
    { id: 'toolkit', label: 'Toolkit', icon: Cpu },
  ]

  // Helper for detail view
  const activeSkillDef = detailSkillId ? SKILL_DEFINITIONS[detailSkillId] : null
  const activeSkillState = detailSkillId ? skills.find(s => s.id === detailSkillId) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className="!fixed left-0 top-0 bottom-0 w-full max-w-md glass-panel !rounded-none border-r border-white/10 shadow-2xl z-sticky flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* ... (Header & Tabs unchanged) ... */}

            {/* Header Code ... */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <PlayerAvatar size="lg" />
                <div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-purple-600 font-serif">
                    The Prism
                  </h2>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">
                    {insights?.journey?.stageLabel || 'Beginning'} Resonance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Dominant Pattern Orb - shows player's current tendency */}
                {insights?.decisionStyle?.primaryPattern && (
                  <PatternOrb
                    pattern={insights.decisionStyle.primaryPattern.type}
                    size="sm"
                    celebrate={false}
                  />
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close prism"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Searchable Log - Search through past conversations */}
            <LogSearch />

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={cn(
                    "flex-1 py-4 px-3 text-xs font-medium transition-colors flex flex-col items-center gap-1.5 min-w-[64px] relative",
                    activeTab === tab.id
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5 transition-transform", activeTab === tab.id && "scale-110")} />
                  <span>{tab.label}</span>

                  {/* Badge indicator for new content */}
                  {tabBadges[tab.id] && (
                    <motion.div
                      initial={prefersReducedMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500"
                      style={prefersReducedMotion ? {} : { animation: 'pulse 2s infinite' }}
                    />
                  )}

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
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-black/20">
              {/* Background Grid */}
              <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

              <AnimatePresence mode="wait">
                {activeTab === 'harmonics' && detailPattern ? (
                  <OrbDetailPanel
                    key="orb-detail"
                    patternType={detailPattern}
                    onClose={() => setDetailPattern(null)}
                  />
                ) : activeTab === 'stars' && detailSkillId ? (
                  // --- DETAIL VIEW (THE LIBRARY) ---
                  <SwipeablePanel
                    key="skill-detail"
                    onClose={() => setDetailSkillId(null)}
                    className="absolute inset-0 bg-slate-900/95 z-10 p-6 overflow-y-auto cursor-grab active:cursor-grabbing"
                  >
                    <button
                      onClick={() => setDetailSkillId(null)}
                      className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors mb-6"
                    >
                      <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-900/20 transition-all">
                        <span className="text-sm font-sans relative top-px">←</span>
                      </div>
                      Return to Academy
                    </button>

                    {activeSkillDef && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
                        {/* Header */}
                        <div>
                          <h2 className="text-3xl font-bold text-slate-100 mb-2">{activeSkillDef.title}</h2>
                          <p className="text-lg font-serif italic text-amber-400">
                            "{activeSkillDef.superpowerName}"
                          </p>
                        </div>

                        {/* Level Badge */}
                        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-200">
                              {activeSkillState?.demonstrationCount || 0}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase">Level</div>
                          </div>
                          <div className="h-8 w-px bg-slate-600" />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-slate-300 mb-1">
                              Mastery Progress
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 transition-all duration-1000"
                                style={{ width: `${Math.min(((activeSkillState?.demonstrationCount || 0) / 10) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Definition */}
                        <div className="prose prose-invert">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Definition</h3>
                          <p className="text-slate-300 leading-relaxed text-sm">
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
                    {activeTab === 'harmonics' && <HarmonicsView onOrbSelect={setDetailPattern} />}
                    {activeTab === 'essence' && <EssenceSigil />}
                    {activeTab === 'mastery' && <MasteryView />}
                    {activeTab === 'mind' && <ThoughtCabinet />}
                    {activeTab === 'toolkit' && <ToolkitView />}

                    {activeTab === 'stars' && (
                      <div className="flex-1 flex flex-col">
                        {/* Mode Toggle */}
                        <div className="flex justify-center p-4">
                          <div className="flex bg-slate-800/50 p-1 rounded-full">
                            <button
                              onClick={() => setConstellationMode('social')}
                              className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                constellationMode === 'social'
                                  ? "bg-slate-700 text-white shadow-sm"
                                  : "text-slate-400 hover:text-slate-300"
                              )}
                            >
                              Social
                            </button>
                            <button
                              onClick={() => setConstellationMode('academy')}
                              className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                constellationMode === 'academy'
                                  ? "bg-slate-700 text-white shadow-sm"
                                  : "text-slate-400 hover:text-slate-300"
                              )}
                            >
                              Academy
                            </button>
                          </div>
                        </div>

                        {/* Graph Content */}
                        <div className="flex-1 relative">
                          {constellationMode === 'social' ? (
                            <RelationshipWeb />
                          ) : (
                            <SkillConstellationGraph
                              skills={skills}
                              onOpenDetail={(skill) => setDetailSkillId(skill.id)}
                            />
                          )}
                        </div>

                        {/* Echo Log - shows how choices ripple across characters */}
                        {constellationMode === 'social' && completedArcs.size > 0 && (
                          <EchoLog completedArcs={completedArcs} className="border-t border-white/10" />
                        )}

                        <div className="p-4 text-center space-y-1">
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                            {constellationMode === 'social' ? "Network Topology" : "Skill Matrix"}
                          </p>
                          {constellationMode === 'academy' && (
                            <p className="text-[9px] text-slate-500">
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

            {/* Footer - minimal branding */}
            <div className="p-2 border-t border-white/10 bg-black/20">
              <p className="text-[9px] text-center text-slate-600 font-mono tracking-wider">
                THE PRISM
              </p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}



