"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Star, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHARACTER_COLORS } from '@/lib/constellation/character-positions'

type UnlockType = 'character_met' | 'character_trusted' | 'skill_awakened' | 'skill_mastered'

interface UnlockCelebrationProps {
  type: UnlockType
  name: string
  color?: string
  characterColor?: keyof typeof CHARACTER_COLORS
  onComplete?: () => void
}

const celebrationVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2 }
  }
}

const iconVariants: import('framer-motion').Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      delay: 0.1
    }
  }
}

const particleVariants: import('framer-motion').Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    x: [0, Math.cos(i * (Math.PI / 4)) * 60],
    y: [0, Math.sin(i * (Math.PI / 4)) * 60],
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: 'easeOut'
    }
  })
}

function getUnlockMessage(type: UnlockType): { title: string; subtitle: string } {
  switch (type) {
    case 'character_met':
      return { title: 'New Connection', subtitle: 'You met someone new' }
    case 'character_trusted':
      return { title: 'Deep Trust', subtitle: 'A bond strengthened' }
    case 'skill_awakened':
      return { title: 'Skill Awakened', subtitle: 'A new ability emerges' }
    case 'skill_mastered':
      return { title: 'Mastery Achieved', subtitle: 'Excellence demonstrated' }
  }
}

function getIcon(type: UnlockType) {
  switch (type) {
    case 'character_met':
    case 'character_trusted':
      return Users
    case 'skill_awakened':
    case 'skill_mastered':
      return Sparkles
  }
}

export function UnlockCelebration({
  type,
  name,
  color,
  characterColor,
  onComplete
}: UnlockCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const message = getUnlockMessage(type)
  const Icon = getIcon(type)

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete?.(), 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const bgColor = characterColor
    ? CHARACTER_COLORS[characterColor].bg
    : color
    ? undefined
    : 'bg-amber-500'

  const isMastery = type === 'skill_mastered' || type === 'character_trusted'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={celebrationVariants}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
          role="alert"
          aria-live="polite"
          aria-label={`${message.title}: ${name}. ${message.subtitle}`}
        >
          <div
            className={cn(
              "relative px-6 py-4 rounded-2xl shadow-2xl border",
              isMastery
                ? "bg-gradient-to-br from-amber-900/95 to-amber-950/95 border-amber-500/50"
                : "bg-slate-900/95 border-slate-700"
            )}
          >
            {/* Particle effects for mastery */}
            {isMastery && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={particleVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute w-2 h-2"
                  >
                    <Star className="w-full h-full text-amber-400" fill="currentColor" />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                variants={iconVariants}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  bgColor
                )}
                style={color && !characterColor ? { backgroundColor: color } : undefined}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Text */}
              <div>
                <motion.p
                  className={cn(
                    "text-xs font-medium uppercase tracking-wider",
                    isMastery ? "text-amber-400" : "text-slate-400"
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {message.title}
                </motion.p>
                <motion.h3
                  className="text-lg font-bold text-white"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {name}
                </motion.h3>
                <motion.p
                  className="text-sm text-slate-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {message.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Shimmer effect for mastery */}
            {isMastery && (
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: 1,
                    ease: 'easeInOut'
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to manage unlock celebrations queue
interface UnlockEvent {
  id: string
  type: UnlockType
  name: string
  color?: string
  characterColor?: keyof typeof CHARACTER_COLORS
}

export function useUnlockCelebrations() {
  const [queue, setQueue] = useState<UnlockEvent[]>([])
  const [current, setCurrent] = useState<UnlockEvent | null>(null)

  const addCelebration = (event: Omit<UnlockEvent, 'id'>) => {
    const id = `${event.type}-${event.name}-${Date.now()}`
    setQueue(prev => [...prev, { ...event, id }])
  }

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0])
      setQueue(prev => prev.slice(1))
    }
  }, [current, queue])

  const handleComplete = () => {
    setCurrent(null)
  }

  return {
    current,
    addCelebration,
    handleComplete
  }
}
