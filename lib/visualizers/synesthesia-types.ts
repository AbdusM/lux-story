export interface SynesthesiaState {
    tempo: number      // 0-100 (Speed)
    mood: number       // 0-100 (Tone: Dark <-> Bright)
    texture: number    // 0-100 (Complexity: Sparse <-> Dense)
}

export interface SynesthesiaTarget {
    targetState: SynesthesiaState
    tolerance: number // Percentage tolerance for each parameter
}

export interface WaveformPoint {
    x: number
    y: number
}

export interface SynesthesiaResult {
    resonance: number
    waveform: WaveformPoint[]
    isLocked: boolean
}
