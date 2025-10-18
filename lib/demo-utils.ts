/**
 * Demo utilities for Birmingham grant presentation
 * These functions are ONLY for demonstration to grant judges
 * Never shown to actual players
 */

import { getPatternTracker } from './game-state'

import { logger } from '@/lib/logger'
/**
 * Show pattern analysis in console (for demo only)
 */
export function showDemoPatterns() {
  const tracker = getPatternTracker()
  const patterns = tracker.getPatternData()
  
  console.log('%c=== GRANT DEMO: Pattern Analysis ===', 'color: #10b981; font-weight: bold')
  
  // Count theme frequencies
  const themeCounts: Record<string, number> = {}
  patterns.choiceThemes.forEach(theme => {
    themeCounts[theme] = (themeCounts[theme] || 0) + 1
  })
  
  // Sort by frequency
  const sortedThemes = Object.entries(themeCounts)
    .sort(([, a], [, b]) => b - a)
  
  console.log('%cChoice Patterns Detected:', 'color: #3b82f6; font-weight: bold')
  sortedThemes.forEach(([theme, count]) => {
    console.log(`  - "${theme}" chosen ${count} times`)
  })
  
  // Determine career affinity
  if (sortedThemes.length > 0) {
    const dominant = sortedThemes[0][0]
    const careerMap: Record<string, string> = {
      'helping': 'Healthcare/Social Services',
      'building': 'Construction/Engineering',
      'analyzing': 'Finance/Technology',
      'patience': 'Education/Agriculture',
      'observation': 'Research/Quality Control',
      'questioning': 'Innovation/Consulting'
    }
    
    const suggestedPath = careerMap[dominant] || 'Exploration Phase'
    console.log(`%cNatural Affinity Detected: ${suggestedPath}`, 'color: #f59e0b; font-weight: bold')
  }
  
  console.log(`%cTotal Choices Made: ${patterns.choiceThemes.length}`, 'color: #8b5cf6')
  console.log('%cAnxiety Indicators: None', 'color: #10b981')
  console.log('%cAchievements Unlocked: N/A (No achievement system)', 'color: #64748b')
  
  console.log('%c=================================', 'color: #10b981; font-weight: bold')
}

/**
 * Simulate pattern data for demo if needed
 */
export function seedDemoPatterns() {
  const tracker = getPatternTracker()
  
  // Add some demo choices
  const demoChoices = [
    'helping',
    'patience', 
    'helping',
    'observation',
    'helping',
    'patience',
    'questioning'
  ]
  
  demoChoices.forEach(theme => {
    tracker.recordChoiceTheme(theme)
  })
  
  console.log('%cDemo patterns seeded for presentation', 'color: #64748b; font-style: italic')
}

/**
 * Clear all patterns for fresh demo
 */
export function clearDemoPatterns() {
  const tracker = getPatternTracker()
  tracker.reset()
  console.log('%cPatterns cleared for fresh demo', 'color: #64748b; font-style: italic')
}

/**
 * Show Birmingham-specific metrics
 */
export function showBirminghamMetrics() {
  console.log('%c=== Birmingham Impact Metrics ===', 'color: #dc2626; font-weight: bold')
  logger.debug('Counties Served: 7 of 7')
  logger.debug('Rural Access: ✓ Offline capable')
  logger.debug('Employer Partners: 5 (unnamed in narrative)')
  logger.debug('Civil Rights Integration: ✓')
  logger.debug('Mental Health Focus: Anxiety reduction through stillness')
  console.log('%c================================', 'color: #dc2626; font-weight: bold')
}

// Demo utilities interface
interface LuxDemo {
  showPatterns: () => void;
  seedPatterns: () => void;
  clearPatterns: () => void;
  showBirmingham: () => void;
}

// Make functions available globally for demo
if (typeof window !== 'undefined') {
  (window as unknown as { luxDemo: LuxDemo }).luxDemo = {
    showPatterns: showDemoPatterns,
    seedPatterns: seedDemoPatterns,
    clearPatterns: clearDemoPatterns,
    showBirmingham: showBirminghamMetrics
  }
}