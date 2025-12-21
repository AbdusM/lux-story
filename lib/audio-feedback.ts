/**
 * Audio Feedback System - Resonance Sprint Edition
 * 
 * ISP UPGRADE: Live Pulse Engine
 * Now modulates frequency and attack based on player's neural state.
 * 
 * Synthesized sounds using Web Audio API (no audio files needed)
 * Mobile-friendly, small bundle, easily customizable
 */

import { EmotionType } from './emotions'

export type SoundType =
  | 'pattern-analytical'
  | 'pattern-patience'
  | 'pattern-exploring'
  | 'pattern-helping'
  | 'pattern-building'
  | 'trust'
  | 'identity'
  | 'milestone'
  | 'episode'
  | 'echo-rohan'
  | 'echo-yaquin'
  | 'echo-kai'

interface SoundConfig {
  frequency: number
  duration: number
  type: OscillatorType
  attack: number
  decay: number
  sustain: number
  release: number
  volume: number
}

// Sound configurations for each type
const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  // Pattern sounds - subtle, satisfying confirmations
  'pattern-analytical': {
    frequency: 440,      // A4 - clear, crisp
    duration: 0.2,
    type: 'sine',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.1,
    volume: 0.15
  },
  'pattern-patience': {
    frequency: 330,      // E4 - lower, calming
    duration: 0.4,
    type: 'sine',
    attack: 0.1,
    decay: 0.15,
    sustain: 0.4,
    release: 0.15,
    volume: 0.12
  },
  'pattern-exploring': {
    frequency: 523,      // C5 - bright, curious
    duration: 0.15,
    type: 'triangle',
    attack: 0.01,
    decay: 0.05,
    sustain: 0.4,
    release: 0.09,
    volume: 0.15
  },
  'pattern-helping': {
    frequency: 392,      // G4 - warm, gentle
    duration: 0.25,
    type: 'sine',
    attack: 0.05,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1,
    volume: 0.12
  },
  'pattern-building': {
    frequency: 349,      // F4 - solid, constructive
    duration: 0.2,
    type: 'square',
    attack: 0.02,
    decay: 0.08,
    sustain: 0.3,
    release: 0.1,
    volume: 0.08
  },

  // Trust sound - positive, affirming chord
  'trust': {
    frequency: 523,      // C5
    duration: 0.4,
    type: 'sine',
    attack: 0.05,
    decay: 0.15,
    sustain: 0.5,
    release: 0.2,
    volume: 0.15
  },

  // Identity sound - profound, ceremonial
  'identity': {
    frequency: 262,      // C4 - deep, resonant
    duration: 0.8,
    type: 'sine',
    attack: 0.1,
    decay: 0.2,
    sustain: 0.6,
    release: 0.3,
    volume: 0.2
  },

  // Milestone sound - triumphant, ascending
  'milestone': {
    frequency: 659,      // E5 - bright, celebratory
    duration: 0.5,
    type: 'triangle',
    attack: 0.02,
    decay: 0.1,
    sustain: 0.6,
    release: 0.28,
    volume: 0.18
  },

  // Episode sound - transitional, resolving
  'episode': {
    frequency: 294,      // D4 - settling, conclusive
    duration: 0.6,
    type: 'sine',
    attack: 0.15,
    decay: 0.2,
    sustain: 0.4,
    release: 0.25,
    volume: 0.15
  },

  // New Resonant Echo Sounds
  'echo-rohan': {
    frequency: 196,      // G3 - deep, mysterious
    duration: 0.5,
    type: 'sawtooth',
    attack: 0.1,
    decay: 0.3,
    sustain: 0.2,
    release: 0.3,
    volume: 0.12
  },
  'echo-yaquin': {
    frequency: 587,      // D5 - bright, eager
    duration: 0.3,
    type: 'triangle',
    attack: 0.05,
    decay: 0.1,
    sustain: 0.5,
    release: 0.15,
    volume: 0.12
  },
  'echo-kai': {
    frequency: 261,      // C4 - reliable, warning-like
    duration: 0.3,
    type: 'square',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1,
    volume: 0.1
  }
}

/**
 * State Modulation Interface
 * Defines how player state influences audio parameters
 */
export interface StateModulation {
  anxiety?: number  // 0-1, modulates pitch/detune (higher = simpler/tensile)
  patience?: number // 0-1, modulates attack (higher = smoother)
  emotion?: EmotionType
}

// Singleton audio context (created on first use)
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      console.warn('Web Audio API not supported')
      return null
    }
  }

  // Resume if suspended (required for mobile after user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  return audioContext
}

/**
 * Modulate audio parameters based on state
 */
function applyModulation(config: SoundConfig, modulation?: StateModulation): SoundConfig {
  if (!modulation) return config

  const modified = { ...config }

  // Anxiety Mod effect: Slight detuning and faster decay (more frantic)
  if (modulation.anxiety !== undefined) {
    const anxietyFactor = Math.max(0, Math.min(1, modulation.anxiety))
    // Slight pitch shift up with anxiety
    modified.frequency = config.frequency * (1 + (anxietyFactor * 0.05))
    // Sharper decay
    modified.decay = config.decay * (1 - (anxietyFactor * 0.3))
  }

  // Patience Mod effect: Slower attack (smoother)
  if (modulation.patience !== undefined) {
    const patienceFactor = Math.max(0, Math.min(1, modulation.patience))
    modified.attack = config.attack + (patienceFactor * 0.1)
  }

  return modified
}

/**
 * Play a synthesized sound with optional state modulation
 * @param sound - The type of sound to play
 * @param modulation - Optional state values to modulate the sound
 */
export function playSound(sound: SoundType, modulation?: StateModulation): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const baseConfig = SOUND_CONFIGS[sound]
  if (!baseConfig) return

  // Apply state-based modulation
  const config = applyModulation(baseConfig, modulation)

  try {
    // Create oscillator
    const oscillator = ctx.createOscillator()
    oscillator.type = config.type
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime)

    // Create gain node for envelope
    const gainNode = ctx.createGain()
    const now = ctx.currentTime

    // ADSR envelope
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(config.volume, now + config.attack)
    gainNode.gain.linearRampToValueAtTime(config.volume * config.sustain, now + config.attack + config.decay)
    gainNode.gain.linearRampToValueAtTime(0, now + config.duration)

    // Connect and play
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + config.duration + 0.1)

    // Cleanup
    oscillator.onended = () => {
      oscillator.disconnect()
      gainNode.disconnect()
    }
  } catch (error) {
    console.warn('Error playing sound:', error)
  }
}

/**
 * Play a pattern sound based on pattern type
 */
export function playPatternSound(pattern: string, modulation?: StateModulation): void {
  const soundMap: Record<string, SoundType> = {
    analytical: 'pattern-analytical',
    patience: 'pattern-patience',
    exploring: 'pattern-exploring',
    helping: 'pattern-helping',
    building: 'pattern-building'
  }

  const sound = soundMap[pattern]
  if (sound) {
    playSound(sound, modulation)
  }
}

/**
 * Play trust increase sound
 */
export function playTrustSound(modulation?: StateModulation): void {
  playSound('trust', modulation)
}

/**
 * Play identity internalization sound (ceremonial)
 */
export function playIdentitySound(): void {
  playSound('identity', { patience: 1.0 }) // Always smooth
}

/**
 * Play milestone achievement sound
 */
export function playMilestoneSound(): void {
  playSound('milestone', { anxiety: 0 }) // Always clear
}

/**
 * Play episode/session boundary sound
 */
export function playEpisodeSound(): void {
  playSound('episode', { patience: 0.8 }) // Highly atmospheric
}

/**
 * Audio settings management
 */
let audioEnabled = true

export function setAudioEnabled(enabled: boolean): void {
  audioEnabled = enabled
}

export function isAudioEnabled(): boolean {
  return audioEnabled
}

/**
 * Wrapper that respects audio settings
 */
export function playSoundIfEnabled(sound: SoundType, modulation?: StateModulation): void {
  if (audioEnabled) {
    playSound(sound, modulation)
  }
}

/**
 * Initialize audio system (call on user interaction)
 * Required for mobile browsers
 */
export function initializeAudio(): void {
  const ctx = getAudioContext()
  if (ctx?.state === 'suspended') {
    ctx.resume()
  }
}

