"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import { X, Users, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConstellationData, type CharacterWithState, type SkillWithState } from '@/hooks/useConstellationData'
import { PeopleView } from './PeopleView'
import { SkillsView } from './SkillsView'
import { DetailModal } from './DetailModal'

interface ConstellationPanelProps {
  isOpen: boolean
  onClose: () => void
}

type TabId = 'people' | 'skills'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const panelVariants: import('framer-motion').Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 }
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
  | null

export function ConstellationPanel({ isOpen, onClose }: ConstellationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('people')
  const [detailItem, setDetailItem] = useState<DetailItem>(null)
  const data = useConstellationData()

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleOpenCharacterDetail = (character: CharacterWithState) => {
    setDetailItem({ type: 'character', item: character })
  }

  const handleOpenSkillDetail = (skill: SkillWithState) => {
    setDetailItem({ type: 'skill', item: skill })
  }

  const handleCloseDetail = () => {
    setDetailItem(null)
  }

  const tabs: { id: TabId; label: string; icon: typeof Users; count: number }[] = [
    { id: 'people', label: 'People', icon: Users, count: data.metCharacterIds.length },
    { id: 'skills', label: 'Skills', icon: Sparkles, count: data.demonstratedSkillIds.length }
  ]

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Panel - swipe right to close */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={panelVariants}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.2 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) onClose()
              }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-slate-900 border-l border-slate-700 shadow-2xl z-[100] flex flex-col"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
              role="dialog"
              aria-modal="true"
              aria-label="Your Journey - Character and Skill Progress"
            >
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/95">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">Your Journey</h2>
                  <p className="text-sm text-slate-400">Connections & growth</p>
                </div>
                <button
                  onClick={onClose}
                  className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center"
                  aria-label="Close constellation view"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex-shrink-0 flex border-b border-slate-700" role="tablist">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={cn(
                      "flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]",
                      activeTab === tab.id
                        ? "text-amber-400 border-b-2 border-amber-400 bg-slate-800/50"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        activeTab === tab.id
                          ? "bg-amber-400/20 text-amber-300"
                          : "bg-slate-700 text-slate-400"
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'people' ? (
                    <motion.div
                      key="people"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      className="h-full overflow-y-auto"
                      style={{ 
                        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      <PeopleView characters={data.characters} onOpenDetail={handleOpenCharacterDetail} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="skills"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      className="h-full overflow-y-auto"
                      style={{ 
                        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      <SkillsView skills={data.skills} onOpenDetail={handleOpenSkillDetail} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div 
                className="flex-shrink-0 p-3 bg-slate-950 text-center border-t border-slate-800"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
              >
                <p className="text-xs text-slate-500">
                  {activeTab === 'people'
                    ? 'Tap a character to see what they taught you'
                    : 'Tap a skill to see your evidence'
                  }
                </p>
              </div>
            </motion.div>

            {/* Detail Modal */}
            <DetailModal
              item={detailItem?.item || null}
              type={detailItem?.type || 'character'}
              onClose={handleCloseDetail}
            />
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
