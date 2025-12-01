import { useState, useEffect, useCallback, useRef } from 'react'
import type { ShareCardType, ShareCardData } from '@/lib/share-result-generator'
import type { SkillTracker } from '@/lib/skill-tracker'
import type { GameState } from '@/lib/character-state'

interface MilestoneSharePrompt {
  type: ShareCardType
  data: ShareCardData
}

const SESSION_STORAGE_KEY = 'lux-story-share-prompts-dismissed'
const MAX_PROMPTS_PER_SESSION = 2 // Reduced from 3 to be less intrusive
const MIN_TIME_BETWEEN_PROMPTS = 180000 // 3 minutes (increased from 2 minutes)
const PROMPT_DELAY_MS = 2000 // 2 second delay before showing prompt after milestone

/**
 * Hook to detect gameplay milestones and trigger share prompts
 * Prevents spam by limiting prompts per session
 */
export function useMilestoneSharing(
  skillTracker: SkillTracker | null,
  gameState: GameState | null
) {
  const [sharePrompt, setSharePrompt] = useState<MilestoneSharePrompt | null>(null)
  const [dismissedPrompts, setDismissedPrompts] = useState<Set<string>>(new Set())
  const promptsShownRef = useRef(0)
  const lastPromptTimeRef = useRef(0)

  // Load dismissed prompts from sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (stored) {
        const dismissed = JSON.parse(stored) as string[]
        setDismissedPrompts(new Set(dismissed))
      }
    } catch (error) {
      console.warn('Failed to load dismissed prompts:', error)
    }
  }, [])

  // Save dismissed prompts to sessionStorage
  const saveDismissedPrompt = useCallback((promptKey: string) => {
    const newDismissed = new Set(dismissedPrompts)
    newDismissed.add(promptKey)
    setDismissedPrompts(newDismissed)
    
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(Array.from(newDismissed)))
    } catch (error) {
      console.warn('Failed to save dismissed prompt:', error)
    }
  }, [dismissedPrompts])

  // Check if we should show a prompt (rate limiting)
  const shouldShowPrompt = useCallback((promptKey: string): boolean => {
    // Don't show if already dismissed
    if (dismissedPrompts.has(promptKey)) {
      return false
    }

    // Don't show if we've hit the max prompts per session
    if (promptsShownRef.current >= MAX_PROMPTS_PER_SESSION) {
      return false
    }

    // Don't show if we showed a prompt recently
    const now = Date.now()
    if (now - lastPromptTimeRef.current < MIN_TIME_BETWEEN_PROMPTS) {
      return false
    }

    // Don't show if there's already a prompt showing
    if (sharePrompt !== null) {
      return false
    }

    return true
  }, [dismissedPrompts, sharePrompt])

  // Show share prompt with delay to avoid interrupting gameplay
  const showSharePrompt = useCallback((type: ShareCardType, data: ShareCardData) => {
    const promptKey = `${type}-${JSON.stringify(data)}`
    
    if (!shouldShowPrompt(promptKey)) {
      return
    }

    // Delay showing prompt to avoid interrupting immediate gameplay
    setTimeout(() => {
      // Double-check conditions after delay (user might have dismissed another prompt)
      if (shouldShowPrompt(promptKey) && sharePrompt === null) {
        setSharePrompt({ type, data })
        promptsShownRef.current += 1
        lastPromptTimeRef.current = Date.now()
      }
    }, PROMPT_DELAY_MS)
  }, [shouldShowPrompt, sharePrompt])

  // Dismiss current prompt
  const dismissPrompt = useCallback(() => {
    if (sharePrompt) {
      const promptKey = `${sharePrompt.type}-${JSON.stringify(sharePrompt.data)}`
      saveDismissedPrompt(promptKey)
    }
    setSharePrompt(null)
  }, [sharePrompt, saveDismissedPrompt])

  // Handle share action
  const handleShare = useCallback(() => {
    setSharePrompt(null)
  }, [])

  // Check for skill milestones
  const checkSkillMilestones = useCallback(() => {
    if (!skillTracker || !gameState) return

    try {
      const demonstrations = skillTracker.getAllDemonstrations()
      const skillCounts = new Map<string, number>()

      // Count demonstrations per skill
      demonstrations.forEach((demo: any) => {
        if (demo.skillsDemonstrated && Array.isArray(demo.skillsDemonstrated)) {
          demo.skillsDemonstrated.forEach((skill: string) => {
            const count = skillCounts.get(skill) || 0
            skillCounts.set(skill, count + 1)
          })
        }
      })

      // Check for milestone counts (5, 10, 20)
      skillCounts.forEach((count, skillName) => {
        if (count === 5 || count === 10 || count === 20) {
          const level = count >= 20 ? 'advanced' : count >= 10 ? 'proficient' : 'developing'
          showSharePrompt('skill', {
            skillName,
            level,
            count
          })
        }
      })
    } catch (error) {
      console.warn('Failed to check skill milestones:', error)
    }
  }, [skillTracker, gameState, showSharePrompt])

  // Check for character completion
  const checkCharacterCompletion = useCallback((characterId: string, trustLevel: string) => {
    if (!gameState) return

    // Check if this is a high trust level (confidant or ally)
    if (trustLevel === 'confidant' || trustLevel === 'ally') {
      showSharePrompt('character', {
        characterName: characterId,
        trustLevel
      })
    }
  }, [gameState, showSharePrompt])

  // Check for journey milestones
  const checkJourneyMilestones = useCallback(() => {
    if (!skillTracker || !gameState) return

    try {
      const demonstrations = skillTracker.getAllDemonstrations()
      const charactersMet = gameState.characters ? gameState.characters.size : 0

      // Check for milestone combinations
      if (demonstrations.length >= 10 && charactersMet >= 3) {
        showSharePrompt('journey', {
          demonstrations: demonstrations.length,
          charactersMet
        })
      }
    } catch (error) {
      console.warn('Failed to check journey milestones:', error)
    }
  }, [skillTracker, gameState, showSharePrompt])

  return {
    sharePrompt,
    showSharePrompt,
    dismissPrompt,
    handleShare,
    checkSkillMilestones,
    checkCharacterCompletion,
    checkJourneyMilestones
  }
}
