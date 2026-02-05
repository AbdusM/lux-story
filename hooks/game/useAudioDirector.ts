/**
 * useAudioDirector - Extracted from StatefulGameInterface (Phase 1.1)
 *
 * Owns all audio state and exposes trigger functions for game events.
 * Does NOT own game logic — the orchestrator calls triggers at the right time.
 *
 * Side-effects contract:
 * - Inputs that trigger effects: consequenceEcho changes
 * - State it mutates: isMuted, audioVolume (local audio state only)
 * - Store setters: NONE — audio state is component-local, not in Zustand
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { synthEngine } from '@/lib/audio/synth-engine'
import {
  playPatternSound,
  playTrustSound,
  playIdentitySound,
  playMilestoneSound,
  playEpisodeSound,
  playSound,
  initializeAudio,
  setAudioEnabled,
  SoundType
} from '@/lib/audio-feedback'
import { STORAGE_KEYS } from '@/lib/persistence/storage-keys'

export interface ConsequenceEchoRef {
  soundCue?: SoundType
}

export interface AudioDirectorActions {
  /** Initialize audio context on first user interaction (required for mobile) */
  initialize: () => void
  /** Play sound for a pattern event */
  triggerPatternSound: (patternId: string) => void
  /** Play sound for trust increase */
  triggerTrustSound: () => void
  /** Play sound for identity ceremony (orb milestone, ability unlock, thought unlock, relationship update, voice revelation) */
  triggerIdentitySound: () => void
  /** Play sound for milestone achievement */
  triggerMilestoneSound: () => void
  /** Play sound for episode/session boundary */
  triggerEpisodeSound: () => void
  /** Play arbitrary sound by type */
  triggerSound: (sound: SoundType) => void
  /** Toggle mute state */
  toggleMute: () => void
  /** Set volume (0-100) */
  setVolume: (volume: number) => void
}

export interface AudioDirectorState {
  isMuted: boolean
  audioVolume: number
}

export interface UseAudioDirectorReturn {
  state: AudioDirectorState
  actions: AudioDirectorActions
}

/**
 * @param consequenceEcho - Current consequence echo (triggers sound effect on change)
 * @param onSettingsChanged - Callback when audio settings change (for cloud sync)
 */
export function useAudioDirector(
  consequenceEcho: ConsequenceEchoRef | null,
  onSettingsChanged?: () => void
): UseAudioDirectorReturn {
  // --- State ---
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED) === 'true'
    }
    return false
  })

  const [audioVolume, setAudioVolumeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIO_VOLUME)
      return stored ? parseInt(stored, 10) : 50
    }
    return 50
  })

  // --- Consequence Echo Effect (edge-triggered on echo change) ---
  useEffect(() => {
    if (consequenceEcho?.soundCue) {
      playSound(consequenceEcho.soundCue)
    }
  }, [consequenceEcho])

  // --- Actions (stable references via useCallback) ---
  const initialize = useCallback(() => {
    initializeAudio()
  }, [])

  const triggerPatternSound = useCallback((patternId: string) => {
    playPatternSound(patternId)
  }, [])

  const triggerTrustSound = useCallback(() => {
    playTrustSound()
  }, [])

  const triggerIdentitySound = useCallback(() => {
    playIdentitySound()
  }, [])

  const triggerMilestoneSound = useCallback(() => {
    playMilestoneSound()
  }, [])

  const triggerEpisodeSound = useCallback(() => {
    playEpisodeSound()
  }, [])

  const triggerSound = useCallback((sound: SoundType) => {
    playSound(sound)
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev
      localStorage.setItem(STORAGE_KEYS.AUDIO_MUTED, String(newMuted))
      synthEngine.setMute(newMuted)
      setAudioEnabled(!newMuted)
      onSettingsChanged?.()
      return newMuted
    })
  }, [onSettingsChanged])

  const setVolume = useCallback((volume: number) => {
    setAudioVolumeState(volume)
    localStorage.setItem(STORAGE_KEYS.AUDIO_VOLUME, String(volume))
    onSettingsChanged?.()
  }, [onSettingsChanged])

  // --- Stable return objects ---
  const state = useMemo(() => ({
    isMuted,
    audioVolume
  }), [isMuted, audioVolume])

  const actions = useMemo(() => ({
    initialize,
    triggerPatternSound,
    triggerTrustSound,
    triggerIdentitySound,
    triggerMilestoneSound,
    triggerEpisodeSound,
    triggerSound,
    toggleMute,
    setVolume
  }), [
    initialize,
    triggerPatternSound,
    triggerTrustSound,
    triggerIdentitySound,
    triggerMilestoneSound,
    triggerEpisodeSound,
    triggerSound,
    toggleMute,
    setVolume
  ])

  return { state, actions }
}
