"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CharacterWithState, SkillWithState } from '@/hooks/useConstellationData'
import { CHARACTER_COLORS } from '@/lib/constellation/character-positions'
import { SKILL_CLUSTERS } from '@/lib/constellation/skill-positions'

interface DetailModalProps {
  item: CharacterWithState | SkillWithState | null
  type: 'character' | 'skill'
  onClose: () => void
}

const modalVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

export function DetailModal({ item, type, onClose }: DetailModalProps) {
  // Escape key handler
  useEffect(() => {
    if (!item) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [item, onClose])

  if (!item) return null

  const isCharacter = type === 'character'
  const character = isCharacter ? (item as CharacterWithState) : null
  const skill = !isCharacter ? (item as SkillWithState) : null

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/60 z-[110]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed bottom-0 left-0 right-0 z-[120] max-h-[50vh] sm:max-h-[60vh] overflow-hidden rounded-t-2xl bg-slate-900 border-t border-slate-700 shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={isCharacter && character ? `${character.fullName} details` : skill ? `${skill.name} skill details` : 'Details'}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-2 bg-slate-900" aria-hidden="true">
              <div className="w-10 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(50vh-40px)] sm:max-h-[calc(60vh-40px)]">
              {isCharacter && character && (
                <CharacterDetail character={character} onClose={onClose} />
              )}
              {!isCharacter && skill && (
                <SkillDetail skill={skill} onClose={onClose} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CharacterDetail({ character, onClose }: { character: CharacterWithState; onClose: () => void }) {
  const colors = CHARACTER_COLORS[character.color]

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold",
            colors.bg
          )}
        >
          {character.name[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{character.fullName}</h2>
          <p className="text-slate-400">{character.role}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("text-sm font-medium capitalize", colors.text)}>
              {character.trustState}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-sm text-slate-400">Trust: {character.trust}/10</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Trust bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Relationship Progress</span>
          <span>{character.trust * 10}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", colors.bg)}
            initial={{ width: 0 }}
            animate={{ width: `${character.trust * 10}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Content based on state */}
      {!character.hasMet ? (
        <div className="p-8 text-center rounded-xl bg-slate-800/50 border border-slate-700">
          <Lock className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium">You haven't met {character.name} yet</p>
          <p className="text-sm text-slate-500 mt-2">
            Continue exploring to discover their story
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" />
            What {character.name} Teaches
          </h3>

          {/* Character arc description */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed">
              {getCharacterDescription(character.id)}
            </p>
          </div>

          {/* Milestone markers */}
          <div className="flex gap-2">
            {[2, 5, 8, 10].map((threshold) => (
              <div
                key={threshold}
                className={cn(
                  "flex-1 p-2 rounded-lg text-center text-xs",
                  character.trust >= threshold
                    ? cn(colors.bg, "text-white")
                    : "bg-slate-800 text-slate-500"
                )}
              >
                {threshold === 2 && "Met"}
                {threshold === 5 && "Connected"}
                {threshold === 8 && "Trusted"}
                {threshold === 10 && "Deep Trust"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SkillDetail({ skill, onClose }: { skill: SkillWithState; onClose: () => void }) {
  const cluster = SKILL_CLUSTERS[skill.cluster]
  const isDormant = skill.state === 'dormant'

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isDormant ? '#374151' : skill.color,
            opacity: isDormant ? 0.5 : 1
          }}
        >
          {isDormant ? (
            <Lock className="w-7 h-7 text-slate-500" />
          ) : (
            <span className="text-white text-xl font-bold">
              {skill.demonstrationCount}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{skill.name}</h2>
          <p className="text-slate-400">{cluster.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-sm font-medium capitalize px-2 py-0.5 rounded"
              style={{
                backgroundColor: isDormant ? '#374151' : `${skill.color}30`,
                color: isDormant ? '#9CA3AF' : skill.color
              }}
            >
              {skill.state}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Progress section */}
      {!isDormant && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>{skill.demonstrationCount} demonstrations</span>
            <span>{getNextMilestone(skill.state)}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: skill.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, skill.demonstrationCount * 10)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* State-based content */}
      {isDormant ? (
        <div className="p-8 text-center rounded-xl bg-slate-800/50 border border-slate-700">
          <Lock className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium">Skill not yet demonstrated</p>
          <p className="text-sm text-slate-500 mt-2">
            Make choices that demonstrate {skill.name.toLowerCase()} to unlock this skill
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Skill Progress
          </h3>

          {/* State progression */}
          <div className="flex gap-1">
            {['awakening', 'developing', 'strong', 'mastered'].map((state) => {
              const isActive = getStateOrder(skill.state) >= getStateOrder(state)
              return (
                <div
                  key={state}
                  className={cn(
                    "flex-1 p-2 rounded-lg text-center text-xs capitalize transition-colors",
                    isActive
                      ? "text-white"
                      : "bg-slate-800 text-slate-500"
                  )}
                  style={{
                    backgroundColor: isActive ? skill.color : undefined
                  }}
                >
                  {state}
                </div>
              )
            })}
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed">
              {getSkillDescription(skill.id)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getStateOrder(state: string): number {
  const order: Record<string, number> = {
    dormant: 0,
    awakening: 1,
    developing: 2,
    strong: 3,
    mastered: 4
  }
  return order[state] || 0
}

function getNextMilestone(state: string): string {
  switch (state) {
    case 'awakening': return '5 for Strong'
    case 'developing': return 'Building to Strong'
    case 'strong': return '10 for Mastery'
    case 'mastered': return 'Mastered!'
    default: return ''
  }
}

function getCharacterDescription(id: string): string {
  const descriptions: Record<string, string> = {
    samuel: "Samuel shares wisdom from decades at the station. Through your conversations, he helps you see patterns in human development and understand that career choices are really about discovering who you are.",
    maya: "Maya's journey from immigrant family expectations to biomedical engineering passion shows how to honor your roots while forging your own path. She teaches that passion and practicality can coexist.",
    jordan: "Jordan's winding path through seven different jobs reveals that careers aren't linear. She helps you see how transferable skills connect seemingly unrelated experiences.",
    devon: "Devon integrates analytical thinking with emotional awareness. Through systems engineering and personal loss, he shows that technical excellence and human connection reinforce each other.",
    kai: "Kai demonstrates that safety isn't just about following rules—it's about having the courage to prioritize human life over authority in high-stakes moments.",
    tess: "Tess built an education organization from a vision. She teaches that leadership means holding space for others while pursuing meaningful impact.",
    rohan: "Rohan's deep technical focus shows the value of understanding fundamentals rather than relying on tools. He embodies 'ground truth' thinking.",
    silas: "Silas manages complex systems under pressure. He teaches triage, dependency recognition, and maintaining calm when everything is failing.",
    marcus: "Marcus makes split-second decisions in medical emergencies. He demonstrates that sometimes the right choice has to come before full understanding.",
    yaquin: "Yaquin creates educational experiences that reach learners where they are. She combines curriculum design with market awareness and emotional labor."
  }
  return descriptions[id] || "A unique perspective on career and growth."
}

function getSkillDescription(id: string): string {
  const descriptions: Record<string, string> = {
    criticalThinking: "The ability to analyze situations objectively, question assumptions, and form judgments based on evidence rather than emotion or bias.",
    communication: "Expressing ideas clearly, listening actively, and adapting your message to different audiences and contexts.",
    collaboration: "Working effectively with others, contributing to team goals, and navigating different working styles and perspectives.",
    creativity: "Generating novel ideas, making unexpected connections, and approaching problems from unconventional angles.",
    leadership: "Guiding others toward shared goals, making difficult decisions, and taking responsibility for outcomes.",
    emotionalIntelligence: "Recognizing and managing your own emotions while understanding and responding appropriately to others' feelings.",
    adaptability: "Adjusting your approach when circumstances change, learning from setbacks, and staying effective in uncertain situations.",
    problemSolving: "Identifying issues, analyzing causes, generating solutions, and implementing fixes systematically.",
    resilience: "Recovering from difficulties, maintaining effectiveness under stress, and growing stronger through challenges.",
    courage: "Acting on your values even when it's difficult, speaking up when needed, and taking calculated risks.",
    empathy: "Understanding others' experiences and perspectives, even when different from your own.",
    patience: "Maintaining composure and persistence when progress is slow or obstacles arise.",
    digitalLiteracy: "Understanding and effectively using digital tools, evaluating online information, and navigating digital environments.",
    technicalLiteracy: "Grasping technical concepts, understanding how systems work, and communicating with technical specialists.",
    systemsThinking: "Seeing how parts connect to form wholes, understanding feedback loops, and anticipating ripple effects.",
    crisisManagement: "Staying calm under pressure, prioritizing rapidly, and coordinating responses to emergencies.",
    triage: "Quickly assessing situations to determine priorities and allocate limited resources effectively.",
    learningAgility: "Picking up new skills quickly, applying lessons from one domain to another, and staying curious.",
    humility: "Recognizing your limitations, being open to feedback, and valuing others' contributions.",
    fairness: "Treating people equitably, considering multiple perspectives, and making principled decisions.",
    pragmatism: "Balancing idealism with practical constraints, finding workable solutions, and knowing when good enough is enough.",
    deepWork: "Focusing intensely on cognitively demanding tasks without distraction for extended periods.",
    timeManagement: "Prioritizing tasks, allocating time effectively, and maintaining productivity across competing demands.",
    culturalCompetence: "Understanding and respecting cultural differences, and adapting behavior appropriately across cultural contexts.",
    marketing: "Understanding audiences, crafting compelling messages, and positioning ideas or products effectively.",
    curriculumDesign: "Structuring learning experiences, sequencing content appropriately, and designing for different learner needs.",
    // New skills (14 additions)
    informationLiteracy: "Evaluating sources critically, distinguishing reliable information from misinformation, and synthesizing knowledge from multiple sources.",
    strategicThinking: "Planning for long-term goals, anticipating future challenges, and aligning actions with broader objectives.",
    mentorship: "Guiding others through their development, sharing wisdom from experience, and creating space for growth.",
    encouragement: "Providing support and motivation, recognizing others' efforts, and fostering confidence in their abilities.",
    respect: "Honoring others' dignity, valuing diverse perspectives, and treating people with consideration regardless of differences.",
    wisdom: "Applying accumulated knowledge and experience thoughtfully, seeing beyond surface issues to deeper truths.",
    curiosity: "Actively seeking to understand, asking questions, and maintaining openness to new ideas and perspectives.",
    observation: "Noticing details others miss, reading situations accurately, and gathering information through careful attention.",
    actionOrientation: "Moving from planning to execution, taking initiative, and maintaining momentum toward goals.",
    riskManagement: "Identifying potential threats, evaluating their likelihood and impact, and developing mitigation strategies.",
    urgency: "Recognizing when speed matters, acting decisively under time pressure, and distinguishing urgent from important.",
    integrity: "Aligning actions with values, maintaining consistency between words and deeds, and being honest even when difficult.",
    accountability: "Taking ownership of outcomes, acknowledging mistakes, and following through on commitments.",
    financialLiteracy: "Understanding money management, budgeting effectively, and making informed financial decisions for career and life."
  }
  return descriptions[id] || "A valuable skill for future success."
}
