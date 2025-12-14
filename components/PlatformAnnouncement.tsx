"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Train, Clock } from "lucide-react"
import { springs } from "@/lib/animations"

interface CharacterAvailability {
  id: string
  name: string
  available: boolean
  status: string  // e.g., "Available", "In conversation", "Away"
}

interface PlatformAnnouncementProps {
  isOpen: boolean
  onCharacterSelect: (characterId: string) => void
  characters: CharacterAvailability[]
  episodeNumber: number
  atmosphericText: string
}

/**
 * Full-screen episode boundary transition
 * Natural "save point" feeling between dialogue sessions
 *
 * Design inspiration:
 * - Zelda: Natural stopping points
 * - Pokemon: Town centers as rest points
 * - Persona: Calendar transitions
 */
export function PlatformAnnouncement({
  isOpen,
  onCharacterSelect,
  characters,
  episodeNumber,
  atmosphericText
}: PlatformAnnouncementProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={springs.smooth}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
      >
        {/* Station Background Illustration - Placeholder */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/station-bg.svg')] bg-cover bg-center" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-8">
          {/* Episode Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, ...springs.smooth }}
            className="space-y-2"
          >
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <Train className="w-5 h-5" />
              <span className="text-sm font-mono uppercase tracking-wider">
                Episode {episodeNumber}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white">
              Grand Central Terminus
            </h2>
          </motion.div>

          {/* Atmospheric Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, ...springs.smooth }}
            className="text-lg text-slate-300 italic leading-relaxed"
          >
            {atmosphericText}
          </motion.p>

          {/* Time Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, ...springs.smooth }}
            className="flex items-center justify-center gap-2 text-slate-400 text-sm"
          >
            <Clock className="w-4 h-4" />
            <span>The evening settles over the platforms</span>
          </motion.div>

          {/* Character Selection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, ...springs.smooth }}
            className="space-y-4"
          >
            <h3 className="text-lg text-slate-200 font-medium">
              Who will you visit next?
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {characters.map((char, index) => (
                <motion.button
                  key={char.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.0 + index * 0.1, ...springs.snappy }}
                  whileHover={{ scale: char.available ? 1.05 : 1 }}
                  whileTap={{ scale: char.available ? 0.95 : 1 }}
                  onClick={() => char.available && onCharacterSelect(char.id)}
                  disabled={!char.available}
                  className={`
                    min-h-[88px] p-4 rounded-xl border-2 transition-all
                    ${char.available
                      ? 'border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer'
                      : 'border-slate-600 bg-slate-800/50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="text-center space-y-1">
                    <div className={`text-base font-bold ${char.available ? 'text-white' : 'text-slate-400'}`}>
                      {char.name}
                    </div>
                    <div className={`text-xs ${char.available ? 'text-amber-300' : 'text-slate-500'}`}>
                      {char.status}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Footer Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, ...springs.smooth }}
            className="text-xs text-slate-500"
          >
            Choose carefully. Your journey continues...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
