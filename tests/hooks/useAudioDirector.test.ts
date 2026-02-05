import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { STORAGE_KEYS } from '@/lib/persistence/storage-keys'

// Mock audio dependencies before imports
vi.mock('@/lib/audio/synth-engine', () => ({
  synthEngine: {
    setMute: vi.fn(),
  },
}))

vi.mock('@/lib/audio-feedback', () => ({
  playSound: vi.fn(),
  playPatternSound: vi.fn(),
  playTrustSound: vi.fn(),
  playIdentitySound: vi.fn(),
  playMilestoneSound: vi.fn(),
  playEpisodeSound: vi.fn(),
  initializeAudio: vi.fn(),
  setAudioEnabled: vi.fn(),
}))

import { useAudioDirector } from '@/hooks/game/useAudioDirector'
import { synthEngine } from '@/lib/audio/synth-engine'
import {
  playSound,
  playPatternSound,
  playTrustSound,
  playIdentitySound,
  playMilestoneSound,
  playEpisodeSound,
  initializeAudio,
  setAudioEnabled,
} from '@/lib/audio-feedback'

describe('useAudioDirector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // --- State initialization ---

  it('defaults isMuted to false', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    expect(result.current.state.isMuted).toBe(false)
  })

  it('initializes isMuted from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.AUDIO_MUTED, 'true')
    const { result } = renderHook(() => useAudioDirector(null))
    expect(result.current.state.isMuted).toBe(true)
  })

  it('defaults audioVolume to 50', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    expect(result.current.state.audioVolume).toBe(50)
  })

  it('initializes audioVolume from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.AUDIO_VOLUME, '75')
    const { result } = renderHook(() => useAudioDirector(null))
    expect(result.current.state.audioVolume).toBe(75)
  })

  // --- toggleMute ---

  it('toggleMute flips isMuted and persists to localStorage', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    expect(result.current.state.isMuted).toBe(false)

    act(() => { result.current.actions.toggleMute() })

    expect(result.current.state.isMuted).toBe(true)
    expect(localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED)).toBe('true')
    expect(synthEngine.setMute).toHaveBeenCalledWith(true)
    expect(setAudioEnabled).toHaveBeenCalledWith(false)
  })

  it('toggleMute calls onSettingsChanged', () => {
    const onSettingsChanged = vi.fn()
    const { result } = renderHook(() => useAudioDirector(null, onSettingsChanged))

    act(() => { result.current.actions.toggleMute() })

    expect(onSettingsChanged).toHaveBeenCalled()
  })

  // --- setVolume ---

  it('setVolume updates state and localStorage', () => {
    const { result } = renderHook(() => useAudioDirector(null))

    act(() => { result.current.actions.setVolume(80) })

    expect(result.current.state.audioVolume).toBe(80)
    expect(localStorage.getItem(STORAGE_KEYS.AUDIO_VOLUME)).toBe('80')
  })

  it('setVolume calls onSettingsChanged', () => {
    const onSettingsChanged = vi.fn()
    const { result } = renderHook(() => useAudioDirector(null, onSettingsChanged))

    act(() => { result.current.actions.setVolume(60) })

    expect(onSettingsChanged).toHaveBeenCalled()
  })

  // --- Trigger actions delegate to audio-feedback ---

  it('initialize delegates to initializeAudio', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    act(() => { result.current.actions.initialize() })
    expect(initializeAudio).toHaveBeenCalled()
  })

  it('triggerPatternSound delegates to playPatternSound', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    act(() => { result.current.actions.triggerPatternSound('analytical') })
    expect(playPatternSound).toHaveBeenCalledWith('analytical')
  })

  it('triggerTrustSound delegates to playTrustSound', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    act(() => { result.current.actions.triggerTrustSound() })
    expect(playTrustSound).toHaveBeenCalled()
  })

  it('triggerIdentitySound delegates to playIdentitySound', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    act(() => { result.current.actions.triggerIdentitySound() })
    expect(playIdentitySound).toHaveBeenCalled()
  })

  it('triggerMilestoneSound delegates to playMilestoneSound', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    act(() => { result.current.actions.triggerMilestoneSound() })
    expect(playMilestoneSound).toHaveBeenCalled()
  })

  it('triggerEpisodeSound delegates to playEpisodeSound', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    act(() => { result.current.actions.triggerEpisodeSound() })
    expect(playEpisodeSound).toHaveBeenCalled()
  })

  it('triggerSound delegates to playSound', () => {
    const { result } = renderHook(() => useAudioDirector(null))
    act(() => { result.current.actions.triggerSound('trust') })
    expect(playSound).toHaveBeenCalledWith('trust')
  })

  // --- Consequence echo effect ---

  it('plays sound when consequenceEcho has soundCue', () => {
    const echo = { soundCue: 'pattern-analytical' as const }
    renderHook(() => useAudioDirector(echo))
    expect(playSound).toHaveBeenCalledWith('pattern-analytical')
  })

  it('does not play sound when consequenceEcho is null', () => {
    renderHook(() => useAudioDirector(null))
    expect(playSound).not.toHaveBeenCalled()
  })
})
