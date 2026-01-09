import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, User, MessageCircle, Compass, Target, Clock, ShieldAlert, Trophy, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CharacterWithState, SkillWithState } from '@/hooks/useConstellationData'
import type { Quest } from '@/lib/quest-system'
import { CHARACTER_COLORS } from '@/lib/constellation/character-positions'
import { SKILL_DEFINITIONS, SKILL_CHARACTER_HINTS } from '@/lib/skill-definitions'
import { SKILL_CLUSTERS } from '@/lib/constellation/skill-positions'
import { CHARACTER_RELATIONSHIP_WEB } from '@/lib/character-relationships'
import { getLoyaltyExperienceForCharacter } from '@/lib/loyalty-experience'
import { LOYALTY_TRUST_THRESHOLD, LOYALTY_PATTERN_THRESHOLD } from '@/lib/constants'
import { useGameStore } from '@/lib/game-store'
import { PATTERN_METADATA } from '@/lib/patterns'
import type { PatternType } from '@/lib/patterns'
import type { CharacterId } from '@/lib/graph-registry'

interface DetailModalProps {
  item: CharacterWithState | SkillWithState | Quest | null
  type: 'character' | 'skill' | 'quest'
  onClose: () => void
  allCharacters?: CharacterWithState[]
}

// modalVariants kept local - has unique y:50 motion that scaleFade lacks
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

// Using shared backdrop variant from lib/animations.ts

export function DetailModal({ item, type, onClose, allCharacters }: DetailModalProps) {
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
  const isQuest = type === 'quest'

  const character = isCharacter ? (item as CharacterWithState) : null
  const skill = type === 'skill' ? (item as SkillWithState) : null
  const quest = isQuest ? (item as Quest) : null

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-overlay"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed bottom-0 left-0 right-0 z-modal-content max-h-[50vh] sm:max-h-[60vh] overflow-hidden rounded-t-2xl bg-slate-900 border-t border-slate-700 shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={
              isCharacter && character ? `${character.fullName} details` :
                skill ? `${skill.name} skill details` :
                  quest ? `${quest.title} dossier` : 'Details'
            }
          >
            {/* Drag handle */}
            <div className="flex justify-center py-2 bg-slate-900" aria-hidden="true">
              <div className="w-10 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Content */}
            <div
              className="overflow-y-auto max-h-[calc(50vh-40px)] sm:max-h-[calc(60vh-40px)] pb-12 sm:pb-16"
              style={{ scrollbarGutter: 'stable' }}
            >
              {character && (
                <CharacterDetail character={character} onClose={onClose} allCharacters={allCharacters} />
              )}
              {skill && (
                <SkillDetail skill={skill} onClose={onClose} />
              )}
              {quest && (
                <QuestDetail quest={quest} onClose={onClose} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CharacterDetail({ character, onClose, allCharacters }: { character: CharacterWithState; onClose: () => void; allCharacters?: CharacterWithState[] }) {
  const colors = CHARACTER_COLORS[character.color]

  // Get loyalty experience for this character
  const loyaltyExperience = useMemo(() => getLoyaltyExperienceForCharacter(character.id as CharacterId), [character.id])

  // Get player's current patterns and flags for loyalty requirement checking
  const coreGameState = useGameStore(state => state.coreGameState)
  const playerPatterns = (coreGameState?.patterns || {}) as Record<PatternType, number>
  const globalFlags = new Set(coreGameState?.globalFlags || [])

  // Compute loyalty requirement status
  const loyaltyStatus = useMemo(() => {
    if (!loyaltyExperience) return null

    const req = loyaltyExperience.requirements
    const trustMet = character.trust >= req.trustMin
    const patternReq = req.patternRequirement
    const patternLevel = patternReq ? (playerPatterns[patternReq.pattern] || 0) : 0
    const patternMet = patternReq ? patternLevel >= patternReq.minLevel : true
    const arcFlag = req.requiredFlags?.[0] // Usually "{char}_arc_complete"
    const arcMet = arcFlag ? globalFlags.has(arcFlag) : true

    return {
      trustMet,
      trustCurrent: character.trust,
      trustRequired: req.trustMin,
      patternMet,
      patternCurrent: patternLevel,
      patternRequired: patternReq?.minLevel || 0,
      patternType: patternReq?.pattern,
      arcMet,
      allMet: trustMet && patternMet && arcMet
    }
  }, [loyaltyExperience, character.trust, playerPatterns, globalFlags])

  // Get opinions about this character from other characters
  const otherOpinions = useMemo(() => {
    if (!allCharacters) return []

    // Find all relationships where someone has an opinion about this character
    const opinionsAbout = CHARACTER_RELATIONSHIP_WEB.filter(
      edge => edge.toCharacterId === character.id && edge.fromCharacterId !== 'samuel'
    )

    return opinionsAbout
      .map(edge => {
        // Find the character who has the opinion
        const opinionGiver = allCharacters.find(c => c.id === edge.fromCharacterId)
        if (!opinionGiver || !opinionGiver.hasMet) return null

        // Determine which opinion to show based on trust with opinion giver
        // Trust ≥ 6 reveals private opinion (deeper insight)
        const isDeepReveal = opinionGiver.trust >= 6
        const opinion = isDeepReveal ? edge.opinions.privateOpinion : edge.opinions.publicOpinion

        return {
          fromCharacter: opinionGiver,
          opinion,
          sentiment: edge.opinions.sentiment,
          isDeepReveal,
          relationshipType: edge.type
        }
      })
      .filter((o): o is NonNullable<typeof o> => o !== null)
  }, [character.id, allCharacters])

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

          {/* Arc Completion Badge */}
          {character.arcComplete && (
            <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded-full w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-300">Story Complete</span>
            </div>
          )}

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

          {/* Loyalty Experience Requirements */}
          {loyaltyExperience && loyaltyStatus && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Loyalty Experience
              </h3>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <p className="text-sm text-slate-300 mb-3">{loyaltyExperience.description}</p>

                {/* Requirements Checklist */}
                <div className="space-y-2">
                  {/* Trust Requirement */}
                  <div className="flex items-center gap-2">
                    {loyaltyStatus.trustMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                    <span className={cn("text-xs", loyaltyStatus.trustMet ? "text-emerald-400" : "text-slate-400")}>
                      Trust {loyaltyStatus.trustCurrent}/{loyaltyStatus.trustRequired}
                    </span>
                  </div>

                  {/* Pattern Requirement */}
                  {loyaltyStatus.patternType && (
                    <div className="flex items-center gap-2">
                      {loyaltyStatus.patternMet ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                      <span className={cn("text-xs", loyaltyStatus.patternMet ? "text-emerald-400" : "text-slate-400")}>
                        {PATTERN_METADATA[loyaltyStatus.patternType]?.label || loyaltyStatus.patternType} pattern ({loyaltyStatus.patternCurrent}/{loyaltyStatus.patternRequired})
                      </span>
                    </div>
                  )}

                  {/* Arc Completion */}
                  <div className="flex items-center gap-2">
                    {loyaltyStatus.arcMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                    <span className={cn("text-xs", loyaltyStatus.arcMet ? "text-emerald-400" : "text-slate-400")}>
                      Complete {character.name}'s story arc
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 pt-3 border-t border-slate-700">
                  {loyaltyStatus.allMet ? (
                    <span className="text-xs font-medium text-amber-400">Ready to unlock!</span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      {3 - [loyaltyStatus.trustMet, loyaltyStatus.patternMet, loyaltyStatus.arcMet].filter(Boolean).length} requirements remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* What Others Think - Inter-character opinions */}
          {otherOpinions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                What Others Think
              </h3>

              <div className="space-y-2">
                {otherOpinions.map((op) => {
                  const opColors = CHARACTER_COLORS[op.fromCharacter.color]
                  const sentimentColor =
                    op.sentiment === 'positive' ? 'border-emerald-500/30' :
                      op.sentiment === 'negative' ? 'border-red-500/30' :
                        op.sentiment === 'conflicted' ? 'border-amber-500/30' :
                          'border-slate-600'

                  return (
                    <div
                      key={op.fromCharacter.id}
                      className={cn(
                        "p-3 rounded-xl bg-slate-800/50 border-l-2 transition-all",
                        sentimentColor,
                        op.isDeepReveal && "bg-slate-800/70"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                            opColors.bg
                          )}
                        >
                          {op.fromCharacter.name[0]}
                        </div>
                        <span className={cn("text-sm font-medium", opColors.text)}>
                          {op.fromCharacter.name}
                        </span>
                        {op.isDeepReveal && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                            Private
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 italic leading-relaxed">
                        "{op.opinion}"
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SkillDetail({ skill, onClose }: { skill: SkillWithState; onClose: () => void }) {
  const isDormant = skill.state === 'dormant'
  const def = SKILL_DEFINITIONS[skill.id]
  const clusterInfo = SKILL_CLUSTERS[skill.cluster]

  // State labels with meaning
  const stateLabels: Record<string, { label: string; description: string }> = {
    dormant: { label: 'Dormant', description: 'Not yet demonstrated' },
    awakening: { label: 'Awakening', description: 'First spark' },
    developing: { label: 'Developing', description: 'Building foundation' },
    strong: { label: 'Strong', description: 'Consistent practice' },
    mastered: { label: 'Mastered', description: 'Fully integrated' }
  }

  // Next level calculation
  const LEVEL_THRESHOLDS = [1, 2, 5, 10]
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t > skill.demonstrationCount) || 10
  const remaining = nextThreshold - skill.demonstrationCount
  const nextLevelName = nextThreshold === 1 ? 'Awakening' : nextThreshold === 2 ? 'Developing' : nextThreshold === 5 ? 'Strong' : 'Mastery'

  return (
    <div className="p-4 sm:p-6">
      {/* Rich Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{
            backgroundColor: isDormant ? '#334155' : skill.color,
            boxShadow: isDormant ? 'none' : `0 0 20px ${skill.color}40`
          }}
        >
          {isDormant ? (
            <Lock className="w-6 h-6 text-slate-500" />
          ) : (
            <span className="text-white text-xl font-bold font-mono">
              {skill.demonstrationCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">{skill.name}</h2>
          {def && (
            <p className="text-amber-400 font-mono text-xs uppercase tracking-widest mt-1">
              {def.superpowerName}
            </p>
          )}
          {/* Cluster Badge */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
              style={{
                backgroundColor: `${clusterInfo.color}20`,
                color: clusterInfo.color
              }}
            >
              {clusterInfo.name}
            </span>
            <span
              className="text-xs"
              style={{ color: isDormant ? '#64748b' : skill.color }}
            >
              {stateLabels[skill.state]?.label || skill.state}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      {/* Mastery Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs text-slate-500">
          <span>{stateLabels[skill.state]?.description || 'Unknown state'}</span>
          <span>{skill.demonstrationCount}/10</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: isDormant ? '#475569' : skill.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(skill.demonstrationCount * 10, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        {/* Next Level Indicator */}
        {!isDormant && remaining > 0 && (
          <p className="text-xs text-slate-500">
            {remaining} more demonstration{remaining !== 1 ? 's' : ''} to reach {nextLevelName}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Smart Unlock Hints for Dormant Skills */}
        {isDormant && SKILL_CHARACTER_HINTS[skill.id] && (
          <div className="p-3 rounded-lg bg-amber-900/20 border border-amber-500/30">
            <p className="text-amber-400 text-sm">
              <span className="font-bold">How to unlock:</span> Develop through conversations with{' '}
              {SKILL_CHARACTER_HINTS[skill.id].join(' or ')}.
            </p>
          </div>
        )}

        {isDormant && !SKILL_CHARACTER_HINTS[skill.id] && (
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
            <p className="text-slate-400 italic text-sm">
              This capability is currently dormant. Demonstrate it through your choices.
            </p>
          </div>
        )}

        {/* Definition & Scenario (Always Visible) */}
        {def && (
          <div className={cn("space-y-6", isDormant && "opacity-75 grayscale-[0.3]")}>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Core Function
              </h4>
              <p className="text-slate-300 text-base leading-relaxed font-light">
                {def.definition}
              </p>
            </div>

            {/* TACTICAL SCENARIO (Video Game Style Application) */}
            {def.tacticalScenario && (
              <div className="bg-slate-800/80 rounded-lg p-4 border-l-2 border-amber-500">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Tactical Application
                </h4>
                <p className="text-slate-200 text-sm italic">
                  "{def.tacticalScenario}"
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                The Manifesto
              </h4>
              <p className="text-slate-400 italic text-sm border-l-2 border-slate-700 pl-4 py-1">
                "{def.manifesto}"
              </p>
            </div>
          </div>
        )}

        {/* Character Synergy Hint (for unlocked skills) + Practitioners */}
        {SKILL_CHARACTER_HINTS[skill.id] && (
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
              {isDormant ? 'Practitioners' : 'Deepen With'}
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_CHARACTER_HINTS[skill.id].map(name => (
                <span
                  key={name}
                  className={cn(
                    "px-2 py-1 rounded text-xs",
                    isDormant
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-800/80 text-slate-200 border border-slate-700"
                  )}
                >
                  {name}
                </span>
              ))}
            </div>
            {!isDormant && (
              <p className="text-xs text-slate-500 mt-2 italic">
                These characters can help you develop this skill further
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function QuestDetail({ quest, onClose }: { quest: Quest; onClose: () => void }) {
  const isCompleted = quest.status === 'completed'
  const isLocked = quest.status === 'locked'

  return (
    <div className="relative p-6 pt-8">
      {/* Background Watermark */}
      <div className="absolute top-10 right-6 opacity-10 pointer-events-none">
        <Compass className="w-32 h-32 text-amber-500" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 font-mono">
              Mission Dossier // {quest.id.split('_').pop()?.toUpperCase()}
            </h4>
            <h2 className="text-2xl font-bold text-white font-mono tracking-tighter max-w-[80%] leading-tight">
              {quest.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <span className={cn(
            "px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border",
            isCompleted ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" :
              isLocked ? "bg-slate-900 border-slate-700 text-slate-500" :
                "bg-amber-950/40 border-amber-500/30 text-amber-400"
          )}>
            {isCompleted ? 'ARCHIVED' : isLocked ? 'ENCRYPTED' : 'ACTIVE'}
          </span>
          <span className="px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border border-slate-800 bg-slate-900/50 text-slate-400">
            Priority: Standard
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 space-y-6">
        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/20" />

          <p className="text-sm text-slate-300 leading-relaxed font-sans relative z-10">
            {quest.description}
          </p>
        </div>

        {/* Objectives - Dynamic based on quest conditions */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Objectives
          </h3>
          <div className="space-y-2">
            {getQuestObjectives(quest).map((objective, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/40 border border-slate-800/50 rounded-sm">
                <div className={cn("w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center",
                  isCompleted ? "bg-emerald-500 border-emerald-500" : "border-slate-600"
                )}>
                  {isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <p className={cn("text-xs font-medium", isCompleted ? "text-slate-400 line-through" : "text-slate-200")}>
                    {objective}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        {quest.reward && (
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Reward Clearance
            </h3>
            <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                XP
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {quest.reward.type}
                </p>
                <p className="text-xs text-emerald-500/70">
                  {quest.reward.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Metadata */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            LOGGED: 2049.03.15
          </span>
          <span>
            REF: {quest.id}
          </span>
        </div>
      </div>
    </div>
  )
}

// Helper functions

// getStateOrder and getNextMilestone removed - unused

/**
 * Generate dynamic objectives for a quest based on its conditions
 */
function getQuestObjectives(quest: Quest): string[] {
  const objectives: string[] = []

  // Character arc quests
  if (quest.type === 'character_arc' && quest.characterId) {
    objectives.push(`Build trust with ${quest.characterId.charAt(0).toUpperCase() + quest.characterId.slice(1)}`)
    if (quest.completeCondition.hasGlobalFlags) {
      objectives.push(`Complete their story arc`)
    }
  }

  // Discovery quests
  if (quest.type === 'discovery') {
    if (quest.completeCondition.hasGlobalFlags?.includes('station_history_revealed')) {
      objectives.push(`Ask Samuel about the station's past`)
      objectives.push(`Uncover the hidden history`)
    }
    if (quest.completeCondition.minPatterns) {
      objectives.push(`Develop at least one pattern to level 6`)
    }
  }

  // Return hooks
  if (quest.type === 'return_hook') {
    objectives.push(`Revisit the character after completing their arc`)
    objectives.push(`Discover what's changed`)
  }

  // Generic objectives based on conditions
  if (quest.completeCondition.metCharacters?.length) {
    const chars = quest.completeCondition.metCharacters.map(c =>
      c.charAt(0).toUpperCase() + c.slice(1)
    ).join(', ')
    objectives.push(`Meet: ${chars}`)
  }

  if (quest.completeCondition.minTrust?.length) {
    quest.completeCondition.minTrust.forEach(({ characterId, trust }) => {
      objectives.push(`Reach trust level ${trust} with ${characterId.charAt(0).toUpperCase() + characterId.slice(1)}`)
    })
  }

  // Fallback if no specific objectives generated
  if (objectives.length === 0) {
    objectives.push(quest.description.split('.')[0] + '.')
  }

  return objectives
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
    kael: "Kael works in the silence of the deep ocean. He teaches that true focus isn't just about concentration—it's about finding stillness in the most hostile environments.",
    omari: "Omari navigates the high-stakes world of venture capital and social impact. He teaches how to build bridges between resources and need, proving that profit and purpose can scale together.",
    yaquin: "Yaquin harmonizes the ancient with the futuristic. Through his study of cultural patterns, he teaches that true innovation requires a deep respect for the human history that preceded it."
  }
  return descriptions[id] || "A unique perspective on career and growth."
}
