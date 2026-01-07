/**
 * D-026: State-Based Animation Tests
 */

import { describe, it, expect } from 'vitest'
import {
  MOOD_ANIMATION_CONFIGS,
  getAnimationMood,
  getAnimationIntensity,
  getMoodVariants,
  getMoodTransition,
  getStateBasedAnimation,
  getMoodStaggerDelay,
  getPatternAnimationStyle,
  PATTERN_ANIMATION_HINTS,
  type AnimationMood,
  type AnimationContext
} from '@/lib/state-animations'

describe('State-Based Animations (D-026)', () => {
  describe('MOOD_ANIMATION_CONFIGS', () => {
    const moods: AnimationMood[] = [
      'neutral', 'tense', 'warm', 'cautious', 'reflective', 'triumphant', 'vulnerable'
    ]

    it('should have configs for all moods', () => {
      moods.forEach(mood => {
        expect(MOOD_ANIMATION_CONFIGS[mood]).toBeDefined()
        expect(MOOD_ANIMATION_CONFIGS[mood].spring).toBeDefined()
        expect(MOOD_ANIMATION_CONFIGS[mood].duration).toBeGreaterThan(0)
      })
    })

    it('should have valid spring configurations', () => {
      moods.forEach(mood => {
        const config = MOOD_ANIMATION_CONFIGS[mood]
        expect(config.spring.stiffness).toBeGreaterThan(0)
        expect(config.spring.damping).toBeGreaterThan(0)
        expect(config.spring.mass).toBeGreaterThan(0)
      })
    })

    it('should have tense mood with faster duration', () => {
      expect(MOOD_ANIMATION_CONFIGS.tense.duration)
        .toBeLessThan(MOOD_ANIMATION_CONFIGS.neutral.duration)
    })

    it('should have warm mood with slower duration', () => {
      expect(MOOD_ANIMATION_CONFIGS.warm.duration)
        .toBeGreaterThan(MOOD_ANIMATION_CONFIGS.neutral.duration)
    })

    it('should have glow enabled for emotional moods', () => {
      expect(MOOD_ANIMATION_CONFIGS.warm.glow).toBe(true)
      expect(MOOD_ANIMATION_CONFIGS.tense.glow).toBe(true)
      expect(MOOD_ANIMATION_CONFIGS.triumphant.glow).toBe(true)
      expect(MOOD_ANIMATION_CONFIGS.vulnerable.glow).toBe(true)
    })
  })

  describe('getAnimationMood', () => {
    it('should return neutral for empty context', () => {
      expect(getAnimationMood({})).toBe('neutral')
    })

    it('should return triumphant for milestone', () => {
      expect(getAnimationMood({ isMilestone: true })).toBe('triumphant')
    })

    it('should return vulnerable for vulnerability scene', () => {
      expect(getAnimationMood({ isVulnerabilityScene: true })).toBe('vulnerable')
    })

    it('should return tense for confrontation', () => {
      expect(getAnimationMood({ isConfrontation: true })).toBe('tense')
    })

    it('should return warm for high trust', () => {
      expect(getAnimationMood({ trust: 8 })).toBe('warm')
      expect(getAnimationMood({ trust: 10 })).toBe('warm')
    })

    it('should return cautious for low trust', () => {
      expect(getAnimationMood({ trust: 1 })).toBe('cautious')
      expect(getAnimationMood({ trust: 2 })).toBe('cautious')
    })

    it('should detect mood from character emotion', () => {
      expect(getAnimationMood({ characterEmotion: 'angry' })).toBe('tense')
      expect(getAnimationMood({ characterEmotion: 'happy' })).toBe('warm')
      expect(getAnimationMood({ characterEmotion: 'thoughtful' })).toBe('reflective')
    })

    it('should prioritize explicit scene types over trust', () => {
      expect(getAnimationMood({ isMilestone: true, trust: 2 })).toBe('triumphant')
    })
  })

  describe('getAnimationIntensity', () => {
    it('should return normal for undefined patterns', () => {
      expect(getAnimationIntensity(undefined)).toBe('normal')
    })

    it('should return subtle for low pattern total', () => {
      expect(getAnimationIntensity({
        analytical: 2, patience: 2, exploring: 2, helping: 2, building: 2
      })).toBe('subtle')
    })

    it('should return normal for medium pattern total', () => {
      expect(getAnimationIntensity({
        analytical: 4, patience: 4, exploring: 4, helping: 4, building: 4
      })).toBe('normal')
    })

    it('should return pronounced for high pattern total', () => {
      expect(getAnimationIntensity({
        analytical: 8, patience: 8, exploring: 8, helping: 8, building: 8
      })).toBe('pronounced')
    })
  })

  describe('getMoodVariants', () => {
    it('should return valid variant structure', () => {
      const variants = getMoodVariants('neutral')
      expect(variants.initial).toBeDefined()
      expect(variants.animate).toBeDefined()
      expect(variants.exit).toBeDefined()
    })

    it('should include opacity in variants', () => {
      const variants = getMoodVariants('warm')
      expect(variants.initial.opacity).toBeDefined()
      expect(variants.animate.opacity).toBeDefined()
    })

    it('should modify y based on intensity', () => {
      const subtleVariants = getMoodVariants('neutral', 'subtle')
      const pronouncedVariants = getMoodVariants('neutral', 'pronounced')

      expect(Math.abs(pronouncedVariants.initial.y as number))
        .toBeGreaterThan(Math.abs(subtleVariants.initial.y as number))
    })
  })

  describe('getMoodTransition', () => {
    it('should return spring transition', () => {
      const transition = getMoodTransition('neutral')
      expect(transition.type).toBe('spring')
      expect(transition.stiffness).toBeDefined()
      expect(transition.damping).toBeDefined()
    })
  })

  describe('getStateBasedAnimation', () => {
    it('should return complete animation props', () => {
      const animation = getStateBasedAnimation({ trust: 8, isMilestone: false })

      expect(animation.mood).toBeDefined()
      expect(animation.intensity).toBeDefined()
      expect(animation.variants).toBeDefined()
      expect(animation.transition).toBeDefined()
      expect(animation.initial).toBe('initial')
      expect(animation.animate).toBe('animate')
      expect(animation.exit).toBe('exit')
    })
  })

  describe('getMoodStaggerDelay', () => {
    it('should return positive delay', () => {
      expect(getMoodStaggerDelay('neutral')).toBeGreaterThan(0)
    })

    it('should scale with mood duration', () => {
      expect(getMoodStaggerDelay('warm'))
        .toBeGreaterThan(getMoodStaggerDelay('tense'))
    })
  })

  describe('PATTERN_ANIMATION_HINTS', () => {
    it('should have hints for all patterns', () => {
      const patterns = ['analytical', 'patience', 'exploring', 'helping', 'building']
      patterns.forEach(pattern => {
        expect(PATTERN_ANIMATION_HINTS[pattern as keyof typeof PATTERN_ANIMATION_HINTS]).toBeDefined()
      })
    })
  })

  describe('getPatternAnimationStyle', () => {
    it('should return null for low pattern totals', () => {
      expect(getPatternAnimationStyle({
        analytical: 1, patience: 1, exploring: 1, helping: 1, building: 1
      })).toBeNull()
    })

    it('should return style for dominant pattern', () => {
      const style = getPatternAnimationStyle({
        analytical: 6, patience: 1, exploring: 1, helping: 1, building: 1
      })
      expect(style).not.toBeNull()
      expect(style?.preferredMood).toBe('neutral') // analytical preferred mood
    })
  })
})
