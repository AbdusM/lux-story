import { EvaluatedChoice } from './dialogue-graph'
import { PatternType, isValidPattern } from './patterns'
import { UIChoice } from './ui-types'
import { ExperienceChoice } from './experience-engine'
import { generateNarrativeLockMessage } from './narrative-locks'

/**
 * OrbFillLevels: Needed for locking logic
 */
export interface OrbFillLevels {
    analytical: number
    helping: number
    building: number
    patience: number
    exploring: number
}

/**
 * OrbFillRequirement: Pattern and threshold for locked choices
 */
interface OrbFillRequirement {
    pattern: PatternType
    threshold: number
}

/**
 * LockStatusResult: Return type for calculateLockStatus
 */
interface LockStatusResult {
    isLocked: boolean
    reason?: 'orb' | 'condition'
    req?: OrbFillRequirement
}

/**
 * ChoiceWithOrbRequirement: Minimal type for choices that may have orb requirements
 */
interface ChoiceWithOrbRequirement {
    requiredOrbFill?: OrbFillRequirement
}


/**
 * ADAPTER: Logic Layer -> Presentation Layer
 * 
 * Transforms an EvaluatedChoice (Logic) into a UIChoice (Presentation).
 * Centralizes all validation, unwrapping, and locking logic.
 */
export function adaptToUIChoice(
    evaluated: EvaluatedChoice,
    orbFillLevels: OrbFillLevels,
    mercyUnlockId: string | null = null
): UIChoice {
    // 1. Unwrap the core logic choice
    const { choice } = evaluated

    // 2. Normalize ID and Consequence
    // Ensure we have a valid string ID for navigation
    const nextNodeId = typeof choice.consequence === 'string'
        ? choice.consequence // Legacy string support
        : choice.nextNodeId || 'invalid_node_id' // Modern object support

    // 3. Calculate Locking Status Centrally
    // We determine here if the choice is locked, so UI is "dumb"
    const isMercy = mercyUnlockId === choice.choiceId
    const { isLocked, reason, req } = calculateLockStatus(choice, orbFillLevels)

    // Mercy overrides locking
    const finalLocked = isLocked && !isMercy

    // TICKET-003: Generate narrative lock message
    let narrativeLockMessage: string | undefined
    let lockProgress: number | undefined
    let lockActionHint: string | undefined

    if (finalLocked && req && isValidPattern(req.pattern)) {
        const currentLevel = orbFillLevels[req.pattern] ?? 0
        const narrative = generateNarrativeLockMessage(
            req.pattern,
            undefined, // TODO: Pass characterId when available
            currentLevel,
            req.threshold
        )
        narrativeLockMessage = narrative.message
        lockProgress = currentLevel
        lockActionHint = narrative.actionHint
    }

    return {
        id: choice.choiceId,
        text: choice.text,
        nextNodeId: nextNodeId,
        pattern: choice.pattern,
        gravity: evaluated.gravity,
        interaction: choice.interaction,
        isLocked: finalLocked,
        lockReason: finalLocked ? reason : undefined,
        requiredOrbFill: req,
        narrativeLockMessage,
        lockProgress,
        lockActionHint
    }
}

/**
 * ADAPTER: Experience Engine -> Presentation Layer
 * 
 * Transforms an ExperienceChoice (Loyalty System) into a UIChoice.
 * Maps 'patternLevel' to 'requiredOrbFill' to enforce consistent locking.
 */
export function adaptExperienceChoiceToUIChoice(
    choice: ExperienceChoice,
    orbFillLevels: OrbFillLevels
): UIChoice {
    // Map internal locking structure
    let req: { pattern: PatternType; threshold: number } | undefined = undefined
    let isLocked = false
    let lockReason: 'orb' | 'condition' | undefined = undefined

    if (choice.requiredPattern) {
        const threshold = choice.patternLevel || 3
        req = {
            pattern: choice.requiredPattern,
            threshold
        }

        const currentLevel = orbFillLevels[choice.requiredPattern] || 0
        if (currentLevel < threshold) {
            isLocked = true
            lockReason = 'orb'
        }
    }

    return {
        id: choice.id,
        text: choice.text,
        nextNodeId: choice.nextStepId, // Direct mapping
        // Experience choices typically don't have interactions/gravity yet, but we could add them
        pattern: choice.requiredPattern, // Use required pattern as the choice's affinity
        isLocked,
        lockReason,
        requiredOrbFill: req
    }
}

/**
 * Internal helper to calculate lock status
 */
function calculateLockStatus(choice: ChoiceWithOrbRequirement, levels: OrbFillLevels): LockStatusResult {
    // Orb Requirement Check
    if (choice.requiredOrbFill) {
        const { pattern, threshold } = choice.requiredOrbFill
        if (!isValidPattern(pattern)) {
            // Invalid pattern - don't lock
            return { isLocked: false }
        }
        const currentLevel = levels[pattern] ?? 0

        if (currentLevel < threshold) {
            return {
                isLocked: true,
                reason: 'orb',
                req: choice.requiredOrbFill
            }
        }
    }

    // Future: Check other conditions if needed

    return { isLocked: false }
}

/**
 * Helper to determine the "Mercy Unlock" choice from a list
 * If all choices are locked, this picks the easiest one to unlock.
 */
export function findMercyUnlockChoice(choices: EvaluatedChoice[], levels: OrbFillLevels): string | null {
    // Check if all visible choices are locked
    const statuses = choices.map(c => ({
        id: c.choice.choiceId,
        ...calculateLockStatus(c.choice, levels)
    }))

    const allLocked = statuses.every(s => s.isLocked)

    if (!allLocked || choices.length === 0) return null

    // Find easiest threshold to unlock
    const sorted = choices
        .map(c => ({
            id: c.choice.choiceId,
            threshold: c.choice.requiredOrbFill?.threshold || 0
        }))
        .sort((a, b) => a.threshold - b.threshold)

    return sorted[0]?.id || null
}
