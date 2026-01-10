import { useState, useCallback, useMemo } from 'react'
import { SynesthesiaState, SynesthesiaTarget, SynesthesiaResult, WaveformPoint } from '@/lib/visualizers/synesthesia-types'

interface UseSynesthesiaEngineProps {
    initialState?: SynesthesiaState
    target: SynesthesiaTarget
    width?: number
    height?: number
}

export const useSynesthesiaEngine = ({
    initialState = { tempo: 50, mood: 50, texture: 50 },
    target,
    width = 400,
    height = 150
}: UseSynesthesiaEngineProps): [SynesthesiaState, (s: Partial<SynesthesiaState>) => void, SynesthesiaResult] => {

    const [state, setState] = useState<SynesthesiaState>(initialState)

    const updateState = useCallback((updates: Partial<SynesthesiaState>) => {
        setState(prev => ({ ...prev, ...updates }))
    }, [])

    const resonance = useMemo(() => {
        const tempoDist = Math.abs(state.tempo - target.targetState.tempo)
        const moodDist = Math.abs(state.mood - target.targetState.mood)
        const textureDist = Math.abs(state.texture - target.targetState.texture)

        // Tolerance buffer: If within tolerance, distance is effectively 0
        const effectiveTempoDist = Math.max(0, tempoDist - target.tolerance)
        const effectiveMoodDist = Math.max(0, moodDist - target.tolerance)
        const effectiveTextureDist = Math.max(0, textureDist - target.tolerance)

        const totalDist = effectiveTempoDist + effectiveMoodDist + effectiveTextureDist
        // Max realistic total distance approx 200 (if everything is far off)
        // Score = 100 - (distance / scaling factor)
        // Using scaling factor 1.5 to make it a bit forgiving but require precision
        return Math.max(0, Math.min(100, 100 - (totalDist / 1.5)))
    }, [state, target])

    const waveform = useMemo<WaveformPoint[]>(() => {
        const points: WaveformPoint[] = []
        const centerY = height / 2

        for (let x = 0; x < width; x += 4) {
            // Frequency: tempo 0 (slow) -> 0.02, tempo 100 (fast) -> 0.18
            const frequency = 0.02 + (state.tempo / 100) * 0.16

            // Amplitude: mood 0 (dark/low) -> 10, mood 100 (bright/high) -> 50
            const amplitude = 10 + (state.mood / 100) * 40

            // Noise/Complexity: texture 0 (smooth) -> 0, texture 100 (chaotic) -> 15
            const noiseFactor = (state.texture / 100) * 15

            const baseWave = Math.sin(x * frequency) * amplitude
            const noiseWave = Math.sin(x * 0.3 + (state.texture / 10)) * noiseFactor // texture adds chaotic phase shift

            const y = centerY + baseWave + noiseWave
            points.push({ x, y })
        }
        return points
    }, [state, width, height])

    const isLocked = resonance > 85

    return [state, updateState, { resonance: Math.round(resonance), waveform, isLocked }]
}
