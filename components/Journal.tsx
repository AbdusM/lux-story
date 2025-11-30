"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Compass, TrendingUp } from "lucide-react"
import { useGameStore } from "@/lib/game-store"
import { useConstellationData } from "@/hooks/useConstellationData"
import { cn } from "@/lib/utils"

interface JournalProps {
  isOpen: boolean
  onClose: () => void
}

// Character display names and colors
const CHARACTER_INFO: Record<string, { name: string; color: string; role: string }> = {
  'samuel': { name: 'Samuel', color: 'text-amber-600', role: 'Station Master' },
  'maya': { name: 'Maya', color: 'text-blue-600', role: 'Tech Innovator' },
  'devon': { name: 'Devon', color: 'text-orange-600', role: 'Community Builder' },
  'jordan': { name: 'Jordan', color: 'text-purple-600', role: 'Creative Spirit' },
  'kai': { name: 'Kai', color: 'text-teal-600', role: 'Problem Solver' },
  'tess': { name: 'Tess', color: 'text-rose-600', role: 'Mentor' },
  'rohan': { name: 'Rohan', color: 'text-indigo-600', role: 'Analyst' },
  'silas': { name: 'Silas', color: 'text-slate-600', role: 'Historian' },
  'yaquin': { name: 'Yaquin', color: 'text-emerald-600', role: 'Guide' },
}

// Pattern display names
const PATTERN_LABELS: Record<string, string> = {
  exploring: 'Exploration',
  helping: 'Helping Others',
  building: 'Building & Creating',
  analyzing: 'Analysis',
  patience: 'Patience',
  rushing: 'Quick Decisions',
  independence: 'Independence',
}

type TabId = 'relationships' | 'journey' | 'patterns'

export function Journal({ isOpen, onClose }: JournalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('relationships')

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const { characters } = useConstellationData() // Use hook that checks both trust and conversation history
  const choiceHistory = useGameStore((state) => state.choiceHistory)
  const patterns = useGameStore((state) => state.patterns)

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const panelVariants: import("framer-motion").Variants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  }

  const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: 'relationships', label: 'Friends', icon: Users },
    { id: 'journey', label: 'Choices', icon: TrendingUp },
    { id: 'patterns', label: 'Your Style', icon: Compass },
  ]

  // Get characters with trust levels (using hasMet which checks both trust > 0 OR conversation history > 0)
  const characterEntries = characters
    .filter(c => c.hasMet)
    .map(c => [c.id, c.trust] as [string, number])
    .sort(([, a], [, b]) => b - a)

  // Get active patterns (non-zero)
  const activePatterns = Object.entries(patterns)
    .filter(([_, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)

  // Format character name from scene ID for choice context
  const getCharacterFromScene = (sceneId: string): string | null => {
    const match = sceneId.match(/^(samuel|maya|devon|jordan|kai|tess|rohan|silas|yaquin)/i)
    if (match) {
      const name = match[1].toLowerCase()
      return CHARACTER_INFO[name]?.name || name.charAt(0).toUpperCase() + name.slice(1)
    }
    return null
  }

  // Get trust level description
  const getTrustDescription = (trust: number): string => {
    if (trust >= 8) return 'Deep trust'
    if (trust >= 5) return 'Growing connection'
    if (trust >= 2) return 'Getting acquainted'
    if (trust > 0) return 'Just met'
    if (trust < -2) return 'Tension'
    return 'Neutral'
  }

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
            className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-over Panel (from left) - swipe left to close */}
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
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">Journal</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Your story so far</p>
              </div>
              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                aria-label="Close journal"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800" role="tablist">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]",
                    activeTab === tab.id
                      ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* Relationships Tab */}
              {activeTab === 'relationships' && (
                <div className="space-y-4">
                  {characterEntries.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 italic text-sm">Talk to Samuel at the station to meet your first character.</p>
                      <p className="text-slate-400 text-xs mt-1">Each conversation builds trust and reveals new connections.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {characterEntries.map(([charId, trust]) => {
                        const info = CHARACTER_INFO[charId.toLowerCase()] || {
                          name: charId.charAt(0).toUpperCase() + charId.slice(1),
                          color: 'text-slate-600',
                          role: 'Character'
                        }

                        return (
                          <div
                            key={charId}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className={cn("font-bold", info.color)}>{info.name}</h4>
                                <p className="text-xs text-slate-400">{info.role}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-mono text-slate-600 dark:text-slate-300">
                                  {trust > 0 ? '+' : ''}{trust}
                                </div>
                                <p className="text-xs text-slate-400">{getTrustDescription(trust)}</p>
                              </div>
                            </div>

                            {/* Trust bar */}
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full transition-all duration-500 rounded-full",
                                  trust > 0 ? "bg-emerald-400" : "bg-rose-400"
                                )}
                                style={{ width: `${Math.min(100, Math.abs(trust) * 10)}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Journey Tab - Just show meaningful choices */}
              {activeTab === 'journey' && (
                <div className="space-y-4">
                  {choiceHistory.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 italic text-sm">Your choices shape your story.</p>
                      <p className="text-slate-400 text-xs mt-1">Make decisions in conversations to see them here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {choiceHistory.slice(-8).map((record) => {
                        const character = getCharacterFromScene(record.sceneId)
                        const charInfo = character ? CHARACTER_INFO[character.toLowerCase()] : null

                        return (
                          <div
                            key={`${record.sceneId}-${record.timestamp}`}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          >
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              "{record.choice}"
                            </p>
                            {character && (
                              <p className={cn("text-xs mt-2", charInfo?.color || "text-slate-400")}>
                                — talking to {character}
                              </p>
                            )}
                          </div>
                        )
                      })}
                      {choiceHistory.length > 8 && (
                        <p className="text-xs text-slate-400 text-center">
                          {choiceHistory.length} choices made
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Patterns Tab */}
              {activeTab === 'patterns' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    This shows what kind of choices you tend to make!
                  </p>

                  {activePatterns.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      <Compass className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 italic text-sm">Your patterns emerge through your choices.</p>
                      <p className="text-slate-400 text-xs mt-1">Continue your conversations to reveal your natural tendencies.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activePatterns.map(([patternId, value]) => (
                        <div
                          key={patternId}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">
                              {PATTERN_LABELS[patternId] || patternId}
                            </h4>
                            <span className="text-sm font-mono text-amber-600">
                              {value}
                            </span>
                          </div>

                          {/* Pattern bar */}
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 rounded-full"
                              style={{ width: `${Math.min(100, value * 10)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Your choices shape who you become.</p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
