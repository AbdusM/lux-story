/**
 * THE LORE MAINFRAME
 * Technical implementation of "The Station History Bible"
 *
 * Philosophy: "The Database is Objective. The Record is Subjective."
 */

export type FactionId = 'engineers' | 'syn_bio' | 'data_flow' | 'station_core'

// ==========================================
// PILLAR V: SENSORY CONSISTENCY
// ==========================================

export interface SensoryProfile {
    // The unique aesthetic signature of this moment/faction
    visual: {
        palette: string[] // Hex codes
        silhouette: string // Description for image gen
        texture: string
    }
    audio: {
        instrumentation: string
        ambience: string
        soundFileId?: string // Optional real asset
    }
    linguistic: {
        namingConvention: string
        tone: string
    }
    // VITAL: The purely text-based fallback for Chat Mode / Accessibility
    textFallback: string // e.g., "[The air vibrates with the heavy percussion of distant pistons.]"
}

// ==========================================
// PILLAR I: THE WORLD DATABASE (Objective)
// ==========================================

export interface LoreEntry {
    id: string
    timelineEra: 'arrival' | 'expansion' | 'logic_cascade' | 'corp_state' | 'current_drift'
    timestamp: number // Year AS (After Station)
    truth: string // The objective fact. e.g. "Pump 7 failed due to lack of maintenance."
    secret: boolean // Is this hidden from standard archives?
    sensorySignature: SensoryProfile // The "vibe" of this truth
}

// ==========================================
// PILLAR IV: THE UNRELIABLE LENS (Subjective)
// ==========================================

export interface UnreliableRecord {
    id: string
    targetLoreId: string // The truth this record is trying to represent (or hide)
    sourceFaction: FactionId
    perspective: string // The biased content. e.g. "Syn-Bio sabotaged us!"
    reliability: number // 0.0 - 1.0 (How close to the truth is this?)
    mediaType: 'text_log' | 'audio_fragment' | 'visual_glitch' | 'data_stream'
}

// ==========================================
// ARCHIVIST STATE (Player Progress)
// ==========================================

export interface ArchivistState {
    // "I have found this dirty fragment"
    collectedRecords: Set<string> // IDs of UnreliableRecords

    // "I have performed the analysis to verify the truth"
    verifiedLore: Set<string> // IDs of LoreEntries

    // "I understand the sensory language of this faction"
    sensoryCalibration: Record<FactionId, number> // 0-100% calibration
}
