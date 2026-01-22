import { PatternType } from './patterns'
import { GravityResult } from './narrative-gravity'

/**
 * UIChoice: The Single Source of Truth for Choice Rendering
 * 
 * This interface bridges the gap between the Logic Layer (DialogueGraph)
 * and the Presentation Layer (GameChoices, MobileStackRenderer).
 * 
 * It ensures that UI components receive:
 * 1. Fully resolved data (no strict dependency on Logic types)
 * 2. Flat, simple primitives where possible
 * 3. Pre-calculated logic (locks, visibility)
 */
export interface UIChoice {
    // --- Core Identity ---
    id: string
    text: string

    // --- Navigation ---
    // The strictly resolved next node ID.
    // Replacing 'consequence' object with the actual destination string.
    nextNodeId: string

    // --- Metadata ---
    pattern?: PatternType
    gravity?: GravityResult

    // --- Visuals ---
    interaction?: 'big' | 'small' | 'shake' | 'nod' | 'ripple' | 'bloom' | 'jitter'

    // --- Interaction Gates ---
    // Pre-calculated locking status.
    // UI should NOT calculate this itself.
    isLocked: boolean
    lockReason?: 'orb' | 'condition' | 'mercy'

    // Display details for locks
    requiredOrbFill?: {
        pattern: PatternType
        threshold: number
    }

    // --- TICKET-003: Narrative Lock Framing ---
    // Human-readable lock message that frames gates as relationships
    // Example: "Maya needs to trust your logic more"
    narrativeLockMessage?: string
    // Current progress toward unlock (0-threshold scale)
    lockProgress?: number
    // Optional action hint for unlocking
    lockActionHint?: string
}
