// Haptic Feedback for Mobile Interactions
// Provides tactile feedback for better mobile UX

export class HapticFeedback {
  private static instance: HapticFeedback
  private isSupported: boolean = false

  constructor() {
    this.isSupported = this.checkSupport()
  }

  static getInstance(): HapticFeedback {
    if (!HapticFeedback.instance) {
      HapticFeedback.instance = new HapticFeedback()
    }
    return HapticFeedback.instance
  }

  private checkSupport(): boolean {
    if (typeof window === 'undefined') return false
    
    // Check for Vibration API support
    return 'vibrate' in navigator
  }

  // Light haptic feedback for button taps
  light(): void {
    if (!this.isSupported) return
    
    try {
      navigator.vibrate(10) // Very short vibration
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Medium haptic feedback for important actions
  medium(): void {
    if (!this.isSupported) return
    
    try {
      navigator.vibrate(20) // Short vibration
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Heavy haptic feedback for significant events
  heavy(): void {
    if (!this.isSupported) return
    
    try {
      navigator.vibrate([50, 10, 50]) // Pattern: vibrate, pause, vibrate
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Success pattern for positive feedback
  success(): void {
    if (!this.isSupported) return
    
    try {
      navigator.vibrate([20, 10, 20, 10, 20]) // Success pattern
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Error pattern for negative feedback
  error(): void {
    if (!this.isSupported) return
    
    try {
      navigator.vibrate([100, 50, 100]) // Error pattern
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Choice selection pattern
  choice(): void {
    if (!this.isSupported) return
    
    try {
      navigator.vibrate(15) // Quick tap for choice selection
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Story progression pattern
  storyProgress(): void {
    if (!this.isSupported) return
    
    try {
      navigator.vibrate([30, 10, 30]) // Story progression pattern
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Check if haptic feedback is supported
  getSupported(): boolean {
    return this.isSupported
  }
}

// Export singleton instance
export const hapticFeedback = HapticFeedback.getInstance()
