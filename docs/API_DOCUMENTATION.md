# API Documentation - Grand Central Terminus

This document provides comprehensive documentation for the core hooks and systems used in Grand Central Terminus.

## Table of Contents

- [Core Hooks](#core-hooks)
- [Game Systems](#game-systems)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)
- [Usage Examples](#usage-examples)

## Core Hooks

### useMessageManager

Manages game messages and provides message display functionality.

```typescript
import { useMessageManager } from '@/hooks/useMessageManager'

const {
  messages,           // Array of current messages
  addMessage,         // Function to add a new message
  addStreamingMessage, // Function to add streaming message
  clearMessages       // Function to clear all messages
} = useMessageManager()
```

**Parameters:**
- `messages`: `GameMessage[]` - Array of current game messages
- `addMessage`: `(message: Omit<GameMessage, 'id'>) => void` - Add a new message
- `addStreamingMessage`: `(message: Omit<StreamingMessage, 'id'>) => void` - Add streaming message
- `clearMessages`: `() => void` - Clear all messages

### useCareerReflection

Tracks user behavior for career reflection triggers.

```typescript
import { useCareerReflection } from '@/hooks/useCareerReflection'

const {
  rapidClicks,        // Number of rapid clicks
  trackClick          // Function to track click events
} = useCareerReflection()
```

**Parameters:**
- `rapidClicks`: `number` - Count of rapid clicks
- `trackClick`: `() => void` - Track a click event

### useEmotionalRegulation

Manages emotional state and provides stress response support.

```typescript
import { useEmotionalRegulation } from '@/hooks/useEmotionalRegulation'

const {
  emotionalState,     // Current emotional state
  trackChoice,        // Track user choices
  trackHesitation,    // Track hesitation patterns
  resetHesitation,    // Reset hesitation count
  getEmotionalSupport, // Get emotional support message
  getVisualAdjustments, // Get visual adjustments
  resetEmotionalState // Reset emotional state
} = useEmotionalRegulation()
```

**Parameters:**
- `emotionalState`: `EmotionalState` - Current emotional state
- `trackChoice`: `(choice: string, timestamp: number) => void` - Track user choice
- `trackHesitation`: `() => void` - Track hesitation
- `resetHesitation`: `() => void` - Reset hesitation count
- `getEmotionalSupport`: `() => EmotionalSupportMessage | null` - Get support message
- `getVisualAdjustments`: `() => VisualAdjustments` - Get visual adjustments
- `resetEmotionalState`: `() => void` - Reset emotional state

### useCognitiveDevelopment

Manages cognitive development and learning optimization.

```typescript
import { useCognitiveDevelopment } from '@/hooks/useCognitiveDevelopment'

const {
  cognitiveState,     // Current cognitive state
  trackChoice,        // Track user choices
  startDecisionTracking, // Start decision tracking
  getMetacognitivePrompt, // Get metacognitive prompt
  getFlowOptimization, // Get flow optimization
  getCognitiveScaffolding, // Get cognitive scaffolding
  getLearningStyleAdaptations, // Get learning adaptations
  resetCognitiveState // Reset cognitive state
} = useCognitiveDevelopment()
```

### useDevelopmentalPsychology

Manages identity formation and cultural responsiveness.

```typescript
import { useDevelopmentalPsychology } from '@/hooks/useDevelopmentalPsychology'

const {
  identityState,      // Current identity state
  culturalContext,    // Cultural context
  trackChoice,        // Track user choices
  getIdentityPrompt,  // Get identity prompt
  getCulturalPrompt,  // Get cultural prompt
  getYouthDevelopmentSupport, // Get youth development support
  getCulturalAdaptations, // Get cultural adaptations
  getIdentityScaffolding, // Get identity scaffolding
  resetDevelopmentalState // Reset developmental state
} = useDevelopmentalPsychology()
```

### useNeuroscience

Manages brain-based learning and neuroplasticity support.

```typescript
import { useNeuroscience } from '@/hooks/useNeuroscience'

const {
  neuralState,        // Current neural state
  trackChoice,        // Track user choices
  getBrainPrompt,     // Get brain optimization prompt
  getBrainOptimization, // Get brain optimization
  getNeuroplasticitySupport, // Get neuroplasticity support
  getNeuralEfficiencyTips, // Get neural efficiency tips
  resetNeuralState    // Reset neural state
} = useNeuroscience()
```

### use2030Skills

Manages future skills development and career path guidance.

```typescript
import { use2030Skills } from '@/hooks/use2030Skills'

const {
  skills,             // Current skills state
  matchingCareerPaths, // Matching career paths
  trackChoice,        // Track user choices
  getSkillPrompt,     // Get skill development prompt
  getSkillsSummary,   // Get skills summary
  getSkillDevelopmentSuggestions, // Get skill suggestions
  getContextualSkillFeedback, // Get contextual feedback
  resetSkills         // Reset skills
} = use2030Skills()
```

## Game Systems

### StoryEngine

Manages story progression and scene loading.

```typescript
import { StoryEngine } from '@/lib/story-engine'

const storyEngine = new StoryEngine()

// Get a specific scene
const scene = storyEngine.getScene('1-1')

// Get next scene
const nextSceneId = storyEngine.getNextScene('1-1')

// Get all scenes
const allScenes = storyEngine.getAllScenes()
```

### PerformanceSystem

Manages game performance and optimization.

```typescript
import { getPerformanceSystem } from '@/lib/performance-system'

const performanceSystem = getPerformanceSystem()

// Get performance level
const level = performanceSystem.getPerformanceLevel()

// Get performance metrics
const metrics = performanceSystem.getMetrics()
```

### GrandCentralState

Manages global game state and platform relationships.

```typescript
import { getGrandCentralState } from '@/lib/grand-central-state'

const grandCentralState = getGrandCentralState()

// Get current state
const state = grandCentralState.getState()

// Update platform warmth
grandCentralState.updatePlatformWarmth('p1', 0.8)
```

## Utility Functions

### HapticFeedback

Provides tactile feedback for mobile interactions.

```typescript
import { hapticFeedback } from '@/lib/haptic-feedback'

// Light feedback for button taps
hapticFeedback.light()

// Medium feedback for important actions
hapticFeedback.medium()

// Heavy feedback for significant events
hapticFeedback.heavy()

// Success pattern
hapticFeedback.success()

// Error pattern
hapticFeedback.error()

// Choice selection
hapticFeedback.choice()

// Story progression
hapticFeedback.storyProgress()
```

### WebShare

Provides sharing functionality for progress and insights.

```typescript
import { webShare } from '@/lib/web-share'

// Share current progress
await webShare.shareProgress(sceneId, sceneText)

// Share career insights
await webShare.shareInsights(['critical thinking', 'communication'])

// Share opportunities
await webShare.shareOpportunities(['Software Engineer', 'Data Analyst'])

// Check if Web Share API is supported
const isSupported = webShare.getSupported()

// Get share button text
const buttonText = webShare.getShareButtonText()
```

### Logger

Provides environment-aware logging.

```typescript
import { logger } from '@/lib/logger'

// Debug logging (only in development)
logger.debug('Debug message')

// Info logging
logger.info('Info message')

// Warning logging
logger.warn('Warning message')

// Error logging
logger.error('Error message')
```

## Type Definitions

### GameMessage

```typescript
interface GameMessage {
  id: string
  speaker: string
  text: string
  type: 'narration' | 'dialogue' | 'whisper' | 'sensation'
  messageWeight: 'primary' | 'secondary' | 'tertiary' | 'critical'
  timestamp?: number
  className?: string
}
```

### Scene

```typescript
interface Scene {
  id: string
  type: 'narration' | 'choice'
  speaker?: string
  text?: string
  choices?: Choice[]
  nextScene?: string
  conditions?: string[]
}
```

### Choice

```typescript
interface Choice {
  text: string
  nextScene: string
  consequences?: string[]
  requirements?: string[]
}
```

### EmotionalState

```typescript
interface EmotionalState {
  stressLevel: 'calm' | 'alert' | 'anxious' | 'overwhelmed'
  hrv: number
  vagalTone: number
  breathingRhythm: 'natural' | 'guided' | 'urgent'
  rapidClicks: number
  hesitationCount: number
  themeJumping: boolean
  emotionalIntensity: number
}
```

### CognitiveState

```typescript
interface CognitiveState {
  flowState: 'struggle' | 'flow' | 'boredom' | 'anxiety'
  challengeLevel: number
  skillLevel: number
  metacognitiveAwareness: number
  executiveFunction: number
  workingMemory: number
  attentionSpan: number
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
}
```

## Usage Examples

### Basic Game Interface

```typescript
import { GameInterface } from '@/components/GameInterface'

function App() {
  return (
    <div className="min-h-screen">
      <GameInterface />
    </div>
  )
}
```

### Custom Hook Usage

```typescript
import { useEmotionalRegulation } from '@/hooks/useEmotionalRegulation'

function MyComponent() {
  const { emotionalState, trackChoice, getVisualAdjustments } = useEmotionalRegulation()
  
  const handleChoice = (choice: string) => {
    trackChoice(choice, Date.now())
    // Handle choice logic
  }
  
  const visualAdjustments = getVisualAdjustments()
  
  return (
    <div style={visualAdjustments.style}>
      {/* Component content */}
    </div>
  )
}
```

### Error Handling

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <GameInterface />
    </ErrorBoundary>
  )
}
```

### Service Worker Registration

```typescript
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'

function App() {
  return (
    <ServiceWorkerProvider>
      <GameInterface />
    </ServiceWorkerProvider>
  )
}
```

## Best Practices

1. **Always use TypeScript** - Define proper interfaces and types
2. **Handle errors gracefully** - Use error boundaries and try-catch blocks
3. **Optimize for mobile** - Test on various devices and screen sizes
4. **Follow Apple design principles** - Maintain consistency and accessibility
5. **Use haptic feedback appropriately** - Enhance user experience without overwhelming
6. **Test thoroughly** - Write tests for all new functionality
7. **Document changes** - Update this documentation when adding new features

## Troubleshooting

### Common Issues

1. **Hooks not working** - Ensure you're using hooks inside React components
2. **TypeScript errors** - Check type definitions and imports
3. **Mobile issues** - Test on actual devices, not just browser dev tools
4. **Performance problems** - Use React DevTools Profiler to identify bottlenecks

### Getting Help

- Check the troubleshooting guide in `/docs`
- Review existing issues on GitHub
- Contact the development team
- Join our Discord community

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing to the project.
