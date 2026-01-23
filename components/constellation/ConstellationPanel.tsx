"use client"

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import { X, Users, Sparkles, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs, backdrop, panelFromRight, haptics } from '@/lib/animations'
import { useConstellationData, type CharacterWithState, type SkillWithState } from '@/hooks/useConstellationData'
import { getQuestsWithStatus, type Quest } from '@/lib/quest-system'
import { useGameSelectors, useGameStore } from '@/lib/game-store'
import { PeopleView } from './PeopleView'
import { SkillsView } from './SkillsView'
import { QuestsView } from './QuestsView'
import { DetailModal } from './DetailModal'
import { GameErrorBoundary } from '@/components/GameErrorBoundary'

interface ConstellationPanelProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'people' | 'skills' | 'quests'

// Using shared animation variants from lib/animations.ts: backdrop, panelFromRight

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 }
  }
}

type DetailItem =
  | { type: 'character'; item: CharacterWithState }
  | { type: 'skill'; item: SkillWithState }
  | { type: 'quest'; item: Quest }
  | null

export function ConstellationPanel({ isOpen, onClose }: ConstellationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('people')
  const [detailItem, setDetailItem] = useState<DetailItem>(null)
  const data = useConstellationData()



  // Get game state for quest tracking
  const coreGameState = useGameSelectors.useCoreGameState()
  const quests = useMemo(() => {
    if (!coreGameState) return []
    // Reconstruct GameState from serialized form for quest evaluation
    const globalFlags = new Set(coreGameState.globalFlags || [])
    const patterns = coreGameState.patterns || { analytical: 0, helping: 0, building: 0, patience: 0, exploring: 0 }
    const characters = new Map()
    if (coreGameState.characters) {
      coreGameState.characters.forEach(char => {
        characters.set(char.characterId, {
          ...char,
          knowledgeFlags: new Set(char.knowledgeFlags || [])
        })
      })
    }
    const gameState = { globalFlags, patterns, characters } as Parameters<typeof getQuestsWithStatus>[0]
    return getQuestsWithStatus(gameState)
  }, [coreGameState])
  const activeQuestsCount = quests.filter(q => q.status === 'active' || q.status === 'unlocked').length

  // Keyboard navigation handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Arrow keys for tab navigation
      const tabIds: TabId[] = ['people', 'skills', 'quests']
      const currentIndex = tabIds.indexOf(activeTab)

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const direction = e.key === 'ArrowLeft' ? -1 : 1
        const newIndex = (currentIndex + direction + tabIds.length) % tabIds.length
        setActiveTab(tabIds[newIndex])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, activeTab])

  const handleOpenCharacterDetail = (character: CharacterWithState) => {
    setDetailItem({ type: 'character', item: character })
  }

  const handleOpenSkillDetail = (skill: SkillWithState) => {
    setDetailItem({ type: 'skill', item: skill })
  }

  const handleOpenQuestDetail = (quest: Quest) => {
    setDetailItem({ type: 'quest', item: quest })
  }

  const handleCloseDetail = () => {
    setDetailItem(null)
  }

  // Unified Tab Structure
  const tabs: { id: TabId; label: string; icon: typeof Users; count: number }[] = [
    { id: 'people', label: 'Network', icon: Users, count: data.metCharacterIds.length },
    { id: 'skills', label: 'Skills', icon: Sparkles, count: data.demonstratedSkillIds.length },
    { id: 'quests', label: 'Quests', icon: Compass, count: activeQuestsCount }
  ]

  // Navigation Logic (Star Walking)
  const setCurrentScene = useGameStore(state => state.setCurrentScene)

  // Handle travel action (called by button or double-click from Graph)
  const handleTravel = (characterId: string) => {
    // Haptic feedback for travel initiation
    haptics.heavyThud()

    // Brief delay for feedback before closing
    setTimeout(() => {
      // Logic: Travel to the character's 'hub' or 'intro' node
      // We now just send the characterId, and StatefulGameInterface smart-resolves the entry node
      setCurrentScene(characterId)
      onClose() // Close the panel after traveling
    }, 100) // Small delay for haptic to register
  }

  return (
    <GameErrorBoundary componentName="ConstellationPanel">
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdrop}
              className="fixed inset-0 bg-black/50 z-dropdown backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Panel - swipe right to close */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={panelFromRight}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.2 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  haptics.lightTap()
                  onClose()
                }
              }}
              className="fixed right-2 top-2 bottom-2 left-2 sm:left-auto sm:w-full max-w-lg glass-panel-solid !rounded-2xl border border-white/10 shadow-2xl z-sticky flex flex-col overflow-hidden"
              style={{
                // Safe area handled by footer only - prevent nested padding
                paddingRight: 'env(safe-area-inset-right, 0px)'
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Your Journey - Character and Skill Progress"
            >
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-white/5 flex items-center justify-between bg-transparent">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif tracking-wide">Your Journey</h2>
                  <p className="text-sm text-slate-400">Growth, Connections & Tools</p>
                </div>
                <button
                  onClick={onClose}
                  className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-white/5 transition-colors flex items-center justify-center group"
                  aria-label="Close journey panel"
                >
                  <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Tabs with animated indicator - Scrollable for mobile */}
              <div className="flex-shrink-0 flex border-b border-white/5 relative bg-transparent overflow-x-auto no-scrollbar" role="tablist">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={cn(
                      "flex-none py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] relative whitespace-nowrap",
                      activeTab === tab.id
                        ? "text-amber-100"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        activeTab === tab.id
                          ? "bg-amber-500/20 text-amber-200"
                          : "bg-slate-800 text-slate-400"
                      )}>
                        {tab.count}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="constellation-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-purple-600"
                        transition={springs.snappy}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Content - with spacing from header for mobile touch */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2">
                <AnimatePresence mode="wait">


                  {/* NETWORK (People) */}
                  {activeTab === 'people' && (
                    <motion.div
                      key="people"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      className="h-full overflow-y-auto"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      <PeopleView
                        characters={data.characters}
                        onOpenDetail={handleOpenCharacterDetail}
                        onTravel={handleTravel}
                      />
                    </motion.div>
                  )}

                  {/* SKILLS */}
                  {activeTab === 'skills' && (
                    <motion.div
                      key="skills"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      className="h-full overflow-y-auto"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      <SkillsView skills={data.skills} onOpenDetail={handleOpenSkillDetail} />
                    </motion.div>
                  )}



                  {/* QUESTS */}
                  {activeTab === 'quests' && (
                    <motion.div
                      key="quests"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      className="h-full overflow-y-auto"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      <QuestsView quests={quests} onSelectQuest={handleOpenQuestDetail} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div
                className="flex-shrink-0 p-3 bg-transparent text-center border-t border-white/5"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 16px))' }}
              >
                <p className="text-xs text-slate-500">
                  {activeTab === 'people' ? 'Tap a character to see what they taught you' :
                    activeTab === 'skills' ? 'Tap a skill to see your evidence' :
                      'Track your journey through the station'}
                </p>
              </div>
            </motion.div>

            {/* Detail Modal */}
            <DetailModal
              item={detailItem?.item || null}
              type={detailItem?.type || 'character'}
              onClose={handleCloseDetail}
              allCharacters={data.characters}
            />
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
    </GameErrorBoundary>
  )
}
