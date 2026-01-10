import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSynesthesiaEngine } from '../use-synesthesia-engine'
import { SynesthesiaTarget } from '../../visualizers/synesthesia-types'

describe('useSynesthesiaEngine', () => {
    const mockTarget: SynesthesiaTarget = {
        targetState: {
            tempo: 30,
            mood: 25,
            texture: 20
        },
        tolerance: 10
    }

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useSynesthesiaEngine({ target: mockTarget }))

        expect(result.current[0]).toEqual({ tempo: 50, mood: 50, texture: 50 })
    })

    it('should update state correctly', () => {
        const { result } = renderHook(() => useSynesthesiaEngine({ target: mockTarget }))

        act(() => {
            result.current[1]({ tempo: 75 })
        })

        expect(result.current[0].tempo).toBe(75)
        expect(result.current[0].mood).toBe(50) // Should remain unchanged
    })

    it('should calculate resonance correctly', () => {
        const { result } = renderHook(() => useSynesthesiaEngine({ target: mockTarget }))

        // Initial state (50, 50, 50) is far from target (30, 25, 20)
        // Distance: |50-30| + |50-25| + |50-20| = 20 + 25 + 30 = 75
        // Tolerance: 10 per param. 
        // EffDist: (20-10) + (25-10) + (30-10) = 10 + 15 + 20 = 45
        // Score: 100 - (45 / 1.5) = 100 - 30 = 70

        const initialResonance = result.current[2].resonance
        expect(initialResonance).toBeCloseTo(70, -1) // Relaxed precision for rounding
    })

    it('should lock in when close to target', () => {
        const { result } = renderHook(() => useSynesthesiaEngine({ target: mockTarget }))

        act(() => {
            result.current[1]({
                tempo: 30,
                mood: 25,
                texture: 20
            })
        })

        expect(result.current[2].resonance).toBe(100)
        expect(result.current[2].isLocked).toBe(true)
    })

    it('should generate waveform points', () => {
        const { result } = renderHook(() => useSynesthesiaEngine({ target: mockTarget, width: 100 }))

        const waveform = result.current[2].waveform
        expect(waveform.length).toBeGreaterThan(0)
        expect(waveform[0]).toHaveProperty('x')
        expect(waveform[0]).toHaveProperty('y')
    })
})
