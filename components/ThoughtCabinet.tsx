
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, CheckCircle } from "lucide-react"
import { useGameStore } from "@/lib/game-store"
import { getThoughtIcon } from "@/content/thoughts"
import { cn } from "@/lib/utils"
import { springs, stagger } from "@/lib/animations"
import { useMeasure } from "@/hooks/useMeasure"

// =============================================================================
// ACCORDION CONTENT - Smooth measured height animation for expand/collapse
// =============================================================================

interface AccordionContentProps {
  isOpen: boolean
  children: React.ReactNode
}

function AccordionContent({ isOpen, children }: AccordionContentProps) {
  const { ref, bounds } = useMeasure<HTMLDivElement>()

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? bounds.height : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={springs.smooth}
      className="overflow-hidden"
    >
      <div ref={ref}>
        {children}
      </div>
    </motion.div>
  )
}

// Stagger container for thought lists
const listContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger.fast }
  }
}

// Individual thought card animation
const thoughtCard = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy
  }
}

interface ThoughtCabinetProps {
  isOpen: boolean
  onClose: () => void
}

export function ThoughtCabinet({ isOpen, onClose }: ThoughtCabinetProps) {
  const thoughts = useGameStore((state) => state.thoughts)
  const [selectedThoughtId, setSelectedThoughtId] = useState<string | null>(null)

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const activeThoughts = thoughts.filter(t => t.status === 'developing')
  const internalizedThoughts = thoughts.filter(t => t.status === 'internalized')

  const _selectedThought = thoughts.find(t => t.id === selectedThoughtId)

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const panelVariants: import("framer-motion").Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
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

          {/* Slide-over Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">Internal Monologue</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Developing beliefs & worldview</p>
              </div>
              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                aria-label="Close thought cabinet"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
              
              {/* Active Thoughts Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Developing Thoughts
                </h3>
                
                {activeThoughts.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-slate-400 italic text-sm">No thoughts are currently forming.</p>
                  </div>
                ) : (
                  <motion.div
                    className="grid gap-4"
                    variants={listContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {activeThoughts.map(thought => (
                      <motion.div
                        key={thought.id}
                        variants={thoughtCard}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedThoughtId(thought.id === selectedThoughtId ? null : thought.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-colors cursor-pointer relative overflow-hidden group",
                          selectedThoughtId === thought.id
                            ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-600"
                            : "border-slate-200 hover:border-amber-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        )}
                      >
                        {/* Progress Bar - animated with spring */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 bg-amber-400"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: thought.progress / 100 }}
                          transition={springs.smooth}
                          style={{ originX: 0, width: '100%' }}
                        />
                        
                        <div className="flex items-start gap-4 relative z-10">
                          <div className={cn(
                            "p-3 rounded-lg",
                            "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                          )}>
                            {(() => {
                              const Icon = getThoughtIcon(thought.iconName)
                              return <Icon className="w-5 h-5" />
                            })()}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-white">{thought.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 font-mono">
                              {thought.progress}% Formed
                            </p>
                            
                            {/* Expanded Details - Measured height animation */}
                            <AccordionContent isOpen={selectedThoughtId === thought.id}>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                {thought.description}
                              </p>
                              <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 font-medium">
                                <Lock className="w-3 h-3" />
                                <span>Continue exploring this path to internalize</span>
                              </div>
                            </AccordionContent>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </section>

              {/* Internalized Section */}
              <section className="space-y-4 opacity-80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Core Beliefs
                </h3>
                
                {internalizedThoughts.length === 0 ? (
                  <div className="p-4 text-center rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-slate-400 text-xs">No core beliefs established yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {internalizedThoughts.map(thought => (
                      <div 
                        key={thought.id}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3"
                      >
                         <div className="p-2 rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {(() => {
                              const Icon = getThoughtIcon(thought.iconName)
                              return <Icon className="w-4 h-4" />
                            })()}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{thought.title}</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Internalized</p>
                          </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
            
            {/* Footer Tip */}
            <div
              className="flex-shrink-0 p-4 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-200 dark:border-slate-800"
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
            >
               <p className="text-xs text-slate-400">Thoughts shape your dialogue options.</p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
