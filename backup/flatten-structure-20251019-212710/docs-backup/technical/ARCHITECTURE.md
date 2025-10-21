# Architecture Documentation

## System Overview

Lux Story is a performance-based career exploration platform built as a static Next.js application with client-side state management and adaptive narrative systems.

## Core Architecture

### Framework Stack

```
┌─────────────────────────────────────────┐
│           Next.js 15.4.6                │
│         (Static Export Mode)            │
├─────────────────────────────────────────┤
│            React 18.3.1                 │
│         (Client Components)             │
├─────────────────────────────────────────┤
│           TypeScript 5.x                │
│         (Strict Mode Enabled)           │
├─────────────────────────────────────────┤
│          Tailwind CSS 3.4               │
│        + shadcn/ui Components           │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Input → GameInterface → Hooks → State → localStorage
     ↓                         ↓        ↓
  Choices              Performance   Patterns
     ↓                    System        ↓
  Story Engine              ↓      Career Discovery
     ↓                   Adaptive       ↓
  Next Scene            Narrative    Revelations
```

## Component Architecture

### Layer 1: Presentation Components

```typescript
components/
├── GameInterface.tsx      // Main game container (355 lines)
├── CharacterIntro.tsx     // Start screen with save detection
├── StoryMessage.tsx       // Message rendering with speaker styles
├── BreathingInvitation.tsx // Mindfulness prompts
├── SilentCompanion.tsx    // Hidden help system
└── ui/                    // shadcn/ui primitives
    ├── button.tsx
    ├── card.tsx
    └── ...
```

### Layer 2: Business Logic Hooks

```typescript
hooks/
├── useGameState.ts         // Core state management
├── useSceneTransitions.ts  // Scene loading and caching
├── useMessageManager.ts    // Message queue and deduplication
├── usePresence.ts          // Time-based revelations
├── usePatternRevelation.ts // Career pattern detection
└── useAdaptiveNarrative.ts // Performance-based adaptations
```

### Layer 3: Core Systems

```typescript
lib/
├── story-engine.ts         // Narrative progression (167 lines)
├── game-state.ts           // State persistence (400+ lines)
├── performance-system.ts   // Behavioral tracking (250 lines)
└── game-constants.ts       // Design tokens and config
```

## Performance System Architecture

### The Equation

```typescript
interface PerformanceMetrics {
  alignment: number      // 0-1: Pattern matching
  consistency: number    // 0-1: Theme stability
  learning: number       // 0-1: Exploration breadth
  patience: number       // 0-1: Time in reflection
  anxiety: number        // 0-1: Rushed choices
  rushing: number        // 0-1: Speed without thought
}

function calculatePerformance(metrics: PerformanceMetrics): number {
  const positive = (alignment * consistency) + (learning * patience)
  const negative = (anxiety * rushing)
  return Math.max(0, Math.min(1, positive - negative))
}
```

### Performance Levels

```typescript
type PerformanceLevel = 
  | 'struggling'  // < 0.3
  | 'exploring'   // 0.3 - 0.5
  | 'flowing'     // 0.5 - 0.7
  | 'mastering'   // > 0.7
```

## State Management

### localStorage Schema

```typescript
// Game State
'lux-game-state': {
  currentScene: string
  choices: Choice[]
  memories: Record<string, any>
  timestamp: number
}

// Performance Metrics
'lux-performance-metrics': {
  alignment: number
  consistency: number
  learning: number
  patience: number
  anxiety: number
  rushing: number
  lastUpdate: number
}

// Pattern Tracking
'lux-patterns': {
  choiceThemes: string[]
  regionVisits: Record<string, number>
  characterInteractions: Record<string, number>
}
```

## Adaptive Systems

### 1. Narrative Adaptation

```typescript
// Based on performance level
function enhanceSceneText(text: string, level: PerformanceLevel): string {
  switch(level) {
    case 'struggling':
      // Add calming additions
      return text + " The forest holds space for your uncertainty."
    case 'flowing':
      // Add affirmations
      return text + " Your rhythm harmonizes with the forest."
    // ...
  }
}
```

### 2. Visual Adaptation

```css
/* Performance-based CSS classes */
.performance-struggling {
  --spacing-multiplier: 1.2;
  --animation-speed: 2s;
  --border-color: var(--purple-400);
}

.performance-mastering {
  --spacing-multiplier: 1;
  --animation-speed: 0.5s;
  --border-color: var(--green-400);
}
```

### 3. Behavioral Adaptation

```typescript
// Breathing invitation frequency
function getBreathingFrequency(level: PerformanceLevel): number {
  const frequencies = {
    struggling: 0.4,  // 40% chance
    exploring: 0.2,   // 20% chance
    flowing: 0.1,     // 10% chance
    mastering: 0.05   // 5% chance
  }
  return frequencies[level]
}
```

## Design System

### Visual Hierarchy

```
┌─────────────────────────────────────────┐
│          Forest Background              │ <- Atmospheric layer
├─────────────────────────────────────────┤
│       Main Card (max-w-3xl)            │ <- Content container
│  ┌───────────────────────────────────┐  │
│  │      Message Area (60vh)          │  │ <- Scrollable narrative
│  │  • Speaker name                   │  │
│  │  • Message text                   │  │
│  │  • Type-specific styling          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Choice Area                  │  │ <- Adaptive grid
│  │  [Choice 1] [Choice 2]            │  │
│  │  [Choice 3] [Choice 4]            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
│       Breathing Invitation              │ <- Optional overlay
└─────────────────────────────────────────┘
```

### Animation System

```css
/* Centralized in styles/animations.css */
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.02); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* CSS Variables for timing */
:root {
  --anim-duration-quick: 200ms;
  --anim-duration-medium: 500ms;
  --anim-duration-slow: 1000ms;
  --anim-ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Color System

```typescript
// Character-specific colors
const characterColors = {
  Lux: '#9370DB',    // Medium Purple
  Swift: '#4CAF50',  // Green
  Sage: '#FF9800',   // Orange
  Buzz: '#00BCD4',   // Cyan
  Zippy: '#E91E63'   // Pink (Birmingham addition)
}

// Performance state colors
const stateColors = {
  struggling: '#7C3AED', // Purple
  exploring: '#3B82F6',  // Blue
  flowing: '#10B981',    // Green
  mastering: '#F59E0B'   // Amber
}
```

## Career Discovery System

### Pattern Recognition

```typescript
// Theme mapping for career discovery
const careerThemes = {
  'helping': ['healthcare', 'education', 'social work'],
  'analyzing': ['data science', 'research', 'finance'],
  'building': ['engineering', 'construction', 'development'],
  'creating': ['design', 'arts', 'media'],
  'organizing': ['management', 'logistics', 'administration'],
  'exploring': ['science', 'travel', 'innovation']
}

// Pattern emergence after 10+ choices
function detectCareerAffinity(themes: string[]): string[] {
  const frequency = countThemeFrequency(themes)
  return getTopCareerMatches(frequency, careerThemes)
}
```

### Birmingham-Specific Content

```typescript
// Regional job market integration
const birminghamCharacters = {
  'Zippy': {
    role: 'Tech Recruiter',
    themes: ['networking', 'innovation', 'growth'],
    dialogue: 'Birmingham style dialogue'
  }
}

// Local employer narratives
const employerScenes = [
  'Regions Bank scenario',
  'UAB Medical storyline',
  'Southern Company challenge'
]
```

## Performance Optimizations

### Build Configuration

```javascript
// next.config.js
{
  output: 'export',           // Static HTML export
  images: { unoptimized: true }, // For static hosting
  reactStrictMode: true,      // Catch side effects
  trailingSlash: true         // Cloudflare Pages compatibility
}
```

### Bundle Optimization

- Tree shaking enabled
- Dynamic imports for large components
- CSS modules for component-specific styles
- Minimal runtime dependencies

### Runtime Performance

- `useMemo` for expensive calculations
- `useCallback` for stable function references
- Debounced localStorage writes
- Virtual scrolling for long message lists (planned)

## Security Considerations

### Client-Side Security

- No sensitive data in localStorage
- Input sanitization for user choices
- XSS prevention through React's built-in escaping
- No external API calls (fully offline capable)

### Privacy

- No user tracking or analytics
- No personal data collection
- All data stays in browser localStorage
- No cookies or third-party scripts

## Testing Strategy

### Unit Testing (Planned)

```typescript
// Example test structure
describe('PerformanceSystem', () => {
  it('calculates performance correctly', () => {
    const metrics = { alignment: 0.8, consistency: 0.7, ... }
    expect(calculatePerformance(metrics)).toBe(0.65)
  })
})
```

### Integration Testing

- Scene transitions
- State persistence
- Performance adaptations
- Pattern recognition

### E2E Testing Scenarios

1. Anxious player journey
2. Patient explorer journey
3. Consistent master journey
4. Save/load functionality

## Deployment Architecture

### Static Hosting

```
GitHub Repository
       ↓
   GitHub Push
       ↓
Cloudflare Pages Build
       ↓
   Static Assets
       ↓
    CDN Edge
       ↓
   User Browser
```

### Environment Variables

```bash
# .env.local (development only)
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_SHOW_METRICS=false
```

## Future Enhancements

### Planned Features

1. **Backend Integration** (Phase 2)
   - User accounts
   - Progress syncing
   - Aggregate analytics

2. **Enhanced Analytics**
   - Career readiness scores
   - Cohort comparisons
   - Teacher dashboards

3. **Content Expansion**
   - More storylines
   - Industry-specific paths
   - Multiplayer scenarios

4. **Accessibility**
   - Screen reader optimization
   - Keyboard-only navigation
   - High contrast mode

### Technical Debt

- Add comprehensive test coverage
- Implement error boundaries
- Add performance monitoring
- Create storybook for components

## Development Workflow

### Branch Strategy

```
main
 ├── career-exploration-birmingham (current)
 ├── feature/multiplayer
 └── feature/analytics
```

### Code Review Checklist

- [ ] TypeScript types complete
- [ ] Hooks properly memoized
- [ ] localStorage updates batched
- [ ] CSS classes follow naming convention
- [ ] Performance impact assessed

## Monitoring & Metrics

### Key Performance Indicators

- Time to First Meaningful Paint: < 1s
- Time to Interactive: < 2s
- Bundle Size: < 200KB
- Lighthouse Score: > 95

### User Engagement Metrics

- Average session duration
- Choice response time distribution
- Performance level distribution
- Pattern emergence rate

---

*Last Updated: January 2025*
*Version: 1.0.0*
*Architecture Owner: Lux Story Team*