import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { usePullToDismiss, pullToDismissPresets } from "@/hooks/usePullToDismiss"
import { useReaderMode } from "@/hooks/useReaderMode"
import { Users, Zap, Compass, TrendingUp, X, Crown, Cpu, Play, Sparkles, AlertTriangle, Brain, Building2, Type } from "lucide-react"
import { cn } from "@/lib/utils"
import { useConstellationData } from "@/hooks/useConstellationData"
import { useInsights } from "@/hooks/useInsights"
import { useOrbs } from "@/hooks/useOrbs"
import { useGameSelectors, useGameStore } from "@/lib/game-store"
import { PlayerAvatar } from "./CharacterAvatar"
import { PatternOrb } from "./PatternOrb"
import { HarmonicsView } from "./HarmonicsView"
import { EssenceSigil } from "./EssenceSigil"
import { MasteryView } from "./MasteryView"
import { ThoughtCabinet } from "./ThoughtCabinet"
// LogSearch hidden for now
// import { LogSearch } from "./LogSearch"
import { NarrativeAnalysisDisplay } from "./NarrativeAnalysisDisplay"
import { ToolkitView } from "./ToolkitView"
import { SimulationsArchive } from "./SimulationsArchive"
import { SimulationGodView } from "./journal/SimulationGodView"
import { OpportunitiesView } from "./journal/OpportunitiesView"
import { CareerRecommendationsView } from "./journal/CareerRecommendationsView"
import { SkillCombosView } from "./journal/SkillCombosView"
import { OrbDetailPanel } from "./OrbDetailPanel"
import { CognitionView } from "./CognitionView"
import { PatternType } from "@/lib/patterns"
import { ORB_TIERS } from "@/lib/orbs"
import { useSimulations } from "@/hooks/useSimulations"
import { useUserRole } from "@/hooks/useUserRole"
import { PrismTabs } from "./journal/PrismTabs"
import { PrismTabId, getPrismRuntimeTabs } from "@/lib/prism-tabs-config"

interface JournalProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = PrismTabId

const TAB_ICONS: Record<TabId, typeof Users> = {
  harmonics: Zap,
  essence: Compass,
  mastery: Crown,
  careers: TrendingUp,
  combos: Zap,
  opportunities: Building2,
  mind: TrendingUp,
  toolkit: Cpu,
  simulations: Play,
  cognition: Brain,
  analysis: TrendingUp,
  god_mode: AlertTriangle,
}

// Tab content variants - respects prefers-reduced-motion via Framer Motion's global setting
// but we also pass explicit reduced variants for clarity
const tabContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
} as const

const tabContentVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
} as const

export function Journal({ isOpen, onClose }: JournalProps) {
  // "The Prism" Interface
  const [activeTab, setActiveTab] = useState<TabId>('harmonics')
  const [_detailSkillId, setDetailSkillId] = useState<string | null>(null)
  const [detailPattern, setDetailPattern] = useState<PatternType | null>(null)

  // Accessibility
  const prefersReducedMotion = useReducedMotion()
  const { mode: readerMode, toggleMode: toggleReaderMode } = useReaderMode()

  // Sprint 2: Pull-to-dismiss physics
  const { dragProps, onDragEnd } = usePullToDismiss({
    ...pullToDismissPresets.leftPanel,
    onDismiss: onClose,
  })

  // Data hooks
  const { skills } = useConstellationData()
  const insights = useInsights()
  const { hasNewOrbs, markOrbsViewed, balance, tier } = useOrbs()
  const thoughts = useGameSelectors.useThoughts()
  const { availableCount: availableSimulations } = useSimulations()
  const { isEducator, loading: roleLoading } = useUserRole()

  // Tab badge indicators
  const hasNewPatterns = hasNewOrbs
  const hasNewSkills = skills.filter(s => s.state !== 'dormant').length > 0
  const hasActiveThoughts = thoughts.length > 0
  const hasNewTools = hasNewOrbs // Proxy: New patterns likely mean new tools
  const hasNewSimulations = availableSimulations > 0



  // Track which tabs have been viewed this session
  const [viewedTabs, setViewedTabs] = useState<Set<TabId>>(new Set(['harmonics']))

  // New: Badge logic for fixed tabs
  const unlockedAchievementsCount = useGameStore(state => state.unlockedAchievements.length)
  const hasNewAchievements = unlockedAchievementsCount > 0 && !viewedTabs.has('mastery')
  const hasPlayerAnalysis = useInsights() !== null
  const hasAnalysisData = hasPlayerAnalysis && !viewedTabs.has('analysis')
  // Cognition badge: show if we have skills but haven't viewed the tab
  const hasCognitionData = skills.length > 0 && !viewedTabs.has('cognition')
  const hasNewOpportunities = !viewedTabs.has('opportunities') // Simple new indicator for now
  const hasNewCareers = skills.length > 0 && !viewedTabs.has('careers') // Show badge when skills exist
  const hasNewCombos = skills.length > 0 && !viewedTabs.has('combos') // Show badge when skills exist

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
    mastery: hasNewAchievements,
    mind: hasActiveThoughts && !viewedTabs.has('mind'),
    toolkit: hasNewTools && !viewedTabs.has('toolkit'),
    simulations: hasNewSimulations && !viewedTabs.has('simulations'),
    cognition: hasCognitionData,
    analysis: hasAnalysisData,
    god_mode: false,
    opportunities: hasNewOpportunities,
    careers: hasNewCareers,
    combos: hasNewCombos
  }


  // Reset detail view when tab changes
  useEffect(() => {
    setDetailSkillId(null)
    setDetailPattern(null)
  }, [activeTab])

  // ... (variants)

  // Show God Mode tab if:
  // 1. Development mode (always)
  // 2. Production with educator/admin role (authenticated)
  // 3. Production with ?godmode=true URL parameter (fallback for non-authenticated educators)
  const hasGodModeParam = typeof window !== 'undefined' && window.location.search.includes('godmode=true')
  const showGodMode =
    process.env.NODE_ENV === 'development' ||
    (!roleLoading && isEducator) ||
    hasGodModeParam

  const tabs = getPrismRuntimeTabs(showGodMode).map((tab) => ({
    ...tab,
    icon: TAB_ICONS[tab.id],
  }))


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
          {/* Panel - with pull-to-dismiss */}
          <motion.div
            className="!fixed left-2 top-2 bottom-2 right-2 sm:right-auto sm:w-full max-w-md glass-panel-solid !rounded-2xl border border-white/10 shadow-2xl z-sticky flex flex-col overflow-hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            {...dragProps}
            onDragEnd={onDragEnd}
          >
            {/* Drag handle indicator - hints swipe-to-dismiss */}
            <div className="flex justify-center py-2 sm:hidden" aria-hidden="true">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-6 sm:pt-6 pt-2 border-b border-white/5 bg-transparent">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2">
                  {/* Dominant Pattern Orb - shows player's current tendency */}
                  {insights?.decisionStyle?.primaryPattern && (
                    <PatternOrb
                      pattern={insights.decisionStyle.primaryPattern.type}
                      size="sm"
                      celebrate={false}
                    />
                  )}
                  {/* Reader mode toggle - accessibility */}
                  <button
                    onClick={toggleReaderMode}
                    className={cn(
                      "p-2 rounded-full transition-colors reader-mode-toggle",
                      readerMode === 'sans'
                        ? "bg-amber-500/20 text-amber-400"
                        : "hover:bg-white/10 text-slate-400"
                    )}
                    aria-label={`Switch to ${readerMode === 'mono' ? 'sans-serif' : 'monospace'} font`}
                    title={readerMode === 'mono' ? 'Reader mode: easier fonts' : 'Terminal mode: monospace'}
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close prism"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Orb Collection Counter */}
              {balance.totalEarned > 0 && (
                <div className="mt-3 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-950/40 to-purple-950/40 rounded-full border border-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-sm font-bold text-amber-300 tabular-nums">
                      {balance.totalEarned}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      orbs
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                      {ORB_TIERS[tier].label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Searchable Log - Hidden for now
            <LogSearch />
            */}

            <PrismTabs
              tabs={tabs}
              activeTab={activeTab}
              onSelect={handleTabSelect}
              tabBadges={tabBadges}
              prefersReducedMotion={!!prefersReducedMotion}
              variant="top"
              ariaLabel="Prism sections"
            />

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-transparent">
              {/* Background Grid - REMOVED for clean glass aesthetic */}
              {/* <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" /> */}

              <AnimatePresence mode="wait">
                {activeTab === 'harmonics' && detailPattern ? (
                  <div
                    role="tabpanel"
                    id={`prism-panel-${activeTab}`}
                    aria-labelledby={`prism-tab-top-${activeTab}`}
                    className="min-h-full"
                  >
                    <OrbDetailPanel
                      key="orb-detail"
                      patternType={detailPattern}
                      onClose={() => setDetailPattern(null)}
                    />
                  </div>

                ) : (
                  // --- STANDARD TABS ---
                  <motion.div
                    key={activeTab}
                    variants={prefersReducedMotion ? tabContentVariantsReduced : tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-full flex flex-col"
                    role="tabpanel"
                    id={`prism-panel-${activeTab}`}
                    aria-labelledby={`prism-tab-top-${activeTab}`}
                  >
                    {activeTab === 'harmonics' && <HarmonicsView onOrbSelect={setDetailPattern} />}
                    {activeTab === 'essence' && <EssenceSigil />}
                    {activeTab === 'mastery' && <MasteryView />}
                    {activeTab === 'mind' && <ThoughtCabinet />}
                    {activeTab === 'toolkit' && <ToolkitView />}
                    {activeTab === 'simulations' && <SimulationsArchive onClose={onClose} />}
                    {activeTab === 'cognition' && <CognitionView />}
                    {activeTab === 'analysis' && <NarrativeAnalysisDisplay />}
                    {activeTab === 'opportunities' && <OpportunitiesView />}
                    {activeTab === 'careers' && <CareerRecommendationsView />}
                    {activeTab === 'combos' && <SkillCombosView />}
                    {activeTab === 'god_mode' && <SimulationGodView onClose={onClose} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Tabs - Bottom position for thumb zone ergonomics */}
            <PrismTabs
              tabs={tabs}
              activeTab={activeTab}
              onSelect={handleTabSelect}
              tabBadges={tabBadges}
              prefersReducedMotion={!!prefersReducedMotion}
              variant="bottom"
              ariaLabel="Prism sections (bottom)"
            />

            {/* Footer - minimal branding with safe area */}
            <div
              className="flex-shrink-0 py-1.5 border-t border-white/5 bg-transparent"
              style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 4px))' }}
            >
              <p className="text-2xs text-center text-slate-600 font-mono tracking-wider">
                THE PRISM
              </p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
