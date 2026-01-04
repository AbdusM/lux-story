import { GameState, PendingCheckIn, StateChange } from './character-state'

/**
 * Check-In Registry
 * Defines which arcs trigger a revisit conversation
 */
export interface CheckInDefinition {
    characterId: string
    triggerFlag: string        // Verified in globalFlags
    delaySessions: number      // How long to wait
    dialogueNodeId: string     // Entry point
    priority: number           // Higher = mentioned first by Samuel
}

export const CHECK_IN_REGISTRY: CheckInDefinition[] = [
    {
        characterId: 'maya',
        triggerFlag: 'maya_arc_complete',
        delaySessions: 1, // Ready immediately next session
        dialogueNodeId: 'maya_revisit_welcome',
        priority: 10
    },
    {
        characterId: 'grace',
        triggerFlag: 'grace_arc_complete',
        delaySessions: 2, // Needs more time
        dialogueNodeId: 'grace_revisit_welcome',
        priority: 8
    },
    {
        characterId: 'devon',
        triggerFlag: 'devon_arc_complete',
        delaySessions: 1,
        dialogueNodeId: 'devon_revisit_welcome',
        priority: 9
    }
]

export class CheckInQueue {
    /**
     * Process Check-Ins on Session Start
     * 1. Detects new completions (adds to queue)
     * 2. Decrements counters on existing queue items
     * 3. Returns a state change to apply
     */
    static processSessionStart(gameState: GameState): Partial<GameState> {
        const newQueue = [...gameState.pendingCheckIns]
        const activeFlags = gameState.globalFlags

        // 1. Detect new completions not yet in queue
        CHECK_IN_REGISTRY.forEach(def => {
            if (activeFlags.has(def.triggerFlag)) {
                // Check if already queued or completed (we need a way to track completion... 
                // usually we check if the flag exists, but here the flag IS the trigger.
                // We need to check if we've already "consumed" this check-in.
                // For now, let's assume if it's not in the queue, we add it. 
                // BUT wait, if we finished it, it won't be in the queue either.
                // FIX: We need a distinctive flag for "Check-In Completed" or check conversation history.

                // Simpler approach: Check if character has the specific 'revisit_welcome' node in history
                const charState = gameState.characters.get(def.characterId)
                const hasVisitedRevisit = charState?.conversationHistory.includes(def.dialogueNodeId)
                const isQueued = newQueue.some(p => p.characterId === def.characterId)

                if (!hasVisitedRevisit && !isQueued) {
                    // Add to queue
                    newQueue.push({
                        characterId: def.characterId,
                        sessionsRemaining: def.delaySessions,
                        dialogueNodeId: def.dialogueNodeId
                    })
                }
            }
        })

        // 2. Decrement counters
        const updatedQueue = newQueue.map(item => ({
            ...item,
            sessionsRemaining: Math.max(0, item.sessionsRemaining - 1)
        }))

        // 3. Update Flags for "Ready" characters
        // This allows the Dialogue Graph to conditionally show choices
        const newFlags = new Set(activeFlags)
        let hasReady = false

        updatedQueue.forEach(item => {
            const flagName = `CheckInReady_${item.characterId}`
            if (item.sessionsRemaining <= 0) {
                newFlags.add(flagName)
                hasReady = true
            } else {
                newFlags.delete(flagName)
            }
        })

        if (hasReady) {
            newFlags.add('has_new_messages')
        } else {
            newFlags.delete('has_new_messages')
        }

        return {
            pendingCheckIns: updatedQueue,
            globalFlags: newFlags
        }
    }

    /**
     * Get all characters who are currently ready to talk (counter <= 0)
     */
    static getAvailableCheckIns(gameState: GameState): PendingCheckIn[] {
        return gameState.pendingCheckIns.filter(item => item.sessionsRemaining <= 0)
    }

    /**
     * Get the highest priority check-in for Samuel to mention
     */
    static getPriorityCheckIn(gameState: GameState): PendingCheckIn | null {
        const available = this.getAvailableCheckIns(gameState)
        if (available.length === 0) return null

        // Sort by registry priority
        return available.sort((a, b) => {
            const defA = CHECK_IN_REGISTRY.find(d => d.characterId === a.characterId)
            const defB = CHECK_IN_REGISTRY.find(d => d.characterId === b.characterId)
            return (defB?.priority || 0) - (defA?.priority || 0)
        })[0]
    }
}
