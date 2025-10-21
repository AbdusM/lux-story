# UI/UX Implementation Patterns
*For Interactive Narrative & Educational Games*

## Overview

This guide provides specific implementation patterns and code examples for creating exceptional user experiences in interactive narrative games. Based on analysis of AAA game design standards and proven educational software patterns.

---

## Core Design Patterns

### Pattern 1: Progressive Information Disclosure

**Problem**: Complex game systems overwhelm new players
**Solution**: Introduce information contextually, just when needed

#### Implementation Pattern:

```jsx
// Progressive UI disclosure system
const useProgressiveDisclosure = (systemType, playerProgress) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  
  useEffect(() => {
    // Show system when first needed
    if (playerProgress.needsSystem(systemType) && !isVisible) {
      setIsVisible(true);
      
      // Show tutorial on first encounter
      if (!hasSeenTutorial) {
        showTutorial(systemType);
        setHasSeenTutorial(true);
      }
    }
  }, [playerProgress, systemType]);
  
  return { isVisible, showTutorial: !hasSeenTutorial };
};

// Usage example
const GameHUD = ({ playerState }) => {
  const energySystem = useProgressiveDisclosure('energy', playerState);
  const skillSystem = useProgressiveDisclosure('skills', playerState);
  
  return (
    <div className="game-hud">
      {energySystem.isVisible && (
        <EnergyMeter 
          value={playerState.energy} 
          showTutorial={energySystem.showTutorial}
        />
      )}
      {skillSystem.isVisible && (
        <SkillTracker 
          skills={playerState.skills}
          showTutorial={skillSystem.showTutorial}
        />
      )}
    </div>
  );
};
```

### Pattern 2: Grouped Information Architecture

**Problem**: Scattered UI elements increase cognitive load
**Solution**: Group related information visually and spatially

#### CSS Implementation:

```css
/* Base choice card layout */
.choice-card {
  /* Container stability */
  min-height: 120px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 12px 0;
  
  /* Visual grouping */
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  
  /* Depth and interaction */
  box-shadow: 
    0 3px 0 0 rgba(0, 0, 0, 0.15),
    0 6px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.choice-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 0 0 rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Information hierarchy */
.choice-primary {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 12px;
  color: #1f2937;
}

.choice-consequences {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: auto; /* Push to bottom of flexible container */
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.choice-consequence {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.consequence-cost { color: #dc2626; }
.consequence-reward { color: #059669; }
.consequence-requirement { color: #7c2d12; }
```

#### React Component:

```jsx
const ChoiceCard = ({ 
  choice, 
  onClick, 
  isLocked = false,
  playerResources = {}
}) => {
  const canAfford = choice.costs.every(cost => 
    playerResources[cost.type] >= cost.amount
  );
  
  const meetsRequirements = choice.requirements.every(req =>
    playerResources[req.type] >= req.level
  );
  
  const isSelectable = canAfford && meetsRequirements && !isLocked;
  
  return (
    <div 
      className={cn(
        "choice-card",
        !isSelectable && "choice-card--disabled"
      )}
      onClick={isSelectable ? onClick : undefined}
      role="button"
      tabIndex={isSelectable ? 0 : -1}
      aria-disabled={!isSelectable}
    >
      <div className="choice-primary">
        {choice.text}
      </div>
      
      <div className="choice-consequences">
        {choice.costs.map(cost => (
          <div key={cost.type} className="choice-consequence consequence-cost">
            <Icon type={cost.type} size={16} />
            -{cost.amount}
          </div>
        ))}
        
        {choice.rewards.map(reward => (
          <div key={reward.type} className="choice-consequence consequence-reward">
            <Icon type={reward.type} size={16} />
            +{reward.amount}
          </div>
        ))}
        
        {choice.requirements.map(req => (
          <div key={req.type} className="choice-consequence consequence-requirement">
            <Icon type="lock" size={16} />
            {req.type} Lv.{req.level}
          </div>
        ))}
      </div>
      
      {!isSelectable && (
        <div className="choice-blocker">
          {!canAfford && "Not enough resources"}
          {!meetsRequirements && "Requirements not met"}
          {isLocked && "Unlocked by different choices"}
        </div>
      )}
    </div>
  );
};
```

### Pattern 3: Just-in-Time Learning System

**Problem**: Tutorials interrupt flow and are quickly forgotten
**Solution**: Contextual help that appears exactly when needed

#### Tutorial System Implementation:

```jsx
// Tutorial state management
const useTutorialSystem = () => {
  const [completedTutorials, setCompletedTutorials] = useState(new Set());
  const [activeTutorial, setActiveTutorial] = useState(null);
  
  const triggerTutorial = useCallback((tutorialId, context = {}) => {
    if (completedTutorials.has(tutorialId)) return;
    
    const tutorial = getTutorialContent(tutorialId, context);
    setActiveTutorial(tutorial);
  }, [completedTutorials]);
  
  const completeTutorial = useCallback((tutorialId) => {
    setCompletedTutorials(prev => new Set([...prev, tutorialId]));
    setActiveTutorial(null);
  }, []);
  
  return {
    triggerTutorial,
    completeTutorial,
    activeTutorial,
    hasCompleted: (id) => completedTutorials.has(id)
  };
};

// Contextual tutorial trigger
const TutorialTrigger = ({ 
  tutorialId, 
  condition, 
  context, 
  children 
}) => {
  const { triggerTutorial, hasCompleted } = useTutorialSystem();
  
  useEffect(() => {
    if (condition && !hasCompleted(tutorialId)) {
      triggerTutorial(tutorialId, context);
    }
  }, [condition, tutorialId, context]);
  
  return children;
};

// Usage in game components
const EnergyMeter = ({ value, max }) => {
  return (
    <TutorialTrigger
      tutorialId="energy-system"
      condition={value < max} // First time energy is spent
      context={{ currentEnergy: value, maxEnergy: max }}
    >
      <div className="energy-meter">
        <div className="energy-bar">
          <div 
            className="energy-fill"
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
        <span className="energy-text">{value} / {max}</span>
      </div>
    </TutorialTrigger>
  );
};
```

### Pattern 4: Semantic Typography System

**Problem**: Text lacks visual hierarchy and emphasis
**Solution**: CSS system that automatically styles content by importance

#### CSS Framework:

```css
/* Base semantic typography system */
.semantic-text {
  /* Base properties applied to all semantic text */
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  letter-spacing: 0.01em;
}

/* Priority 1: Critical Actions (highest importance) */
.semantic-critical-action {
  font-size: 1.25rem;
  font-weight: 700;
  color: #dc2626;
  text-shadow: 0 1px 4px rgba(220, 38, 38, 0.3);
  margin: 1rem 0;
  
  /* Attention-getting animation */
  animation: subtle-pulse 2s ease-in-out infinite;
}

/* Priority 2: Important Information */
.semantic-important {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin: 0.75rem 0;
}

/* Priority 3: Standard Content */
.semantic-standard {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin: 0.5rem 0;
}

/* Priority 4: Supporting Information */
.semantic-supporting {
  font-size: 0.9375rem;
  font-weight: 400;
  color: #4b5563;
  font-style: italic;
  margin: 0.375rem 0;
}

/* Priority 5: Background Information */
.semantic-background {
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  opacity: 0.8;
  margin: 0.25rem 0;
}

/* Animation definitions */
@keyframes subtle-pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.9;
    transform: scale(1.02);
  }
}

/* Dark mode variants */
@media (prefers-color-scheme: dark) {
  .semantic-critical-action { color: #fca5a5; }
  .semantic-important { color: #f9fafb; }
  .semantic-standard { color: #e5e7eb; }
  .semantic-supporting { color: #d1d5db; }
  .semantic-background { color: #9ca3af; }
}
```

#### Automatic Content Classification:

```jsx
// Content analysis for automatic semantic classification
const classifyTextContent = (text, context = {}) => {
  // Time-sensitive content
  if (/\b(urgent|now|immediately|hurry)\b/i.test(text)) {
    return 'semantic-critical-action';
  }
  
  // Time markers (important for story pacing)
  if (/\b(\d+:\d+|\d+ minutes?|\d+ hours?)\b/i.test(text)) {
    return 'semantic-important';
  }
  
  // Stakes and consequences
  if (/\b(if you|might|could|perhaps)\b/i.test(text) && 
      /\b(happen|result|consequence)\b/i.test(text)) {
    return 'semantic-supporting';
  }
  
  // Atmospheric description
  if (/\b(the air|wind|shadows|light)\b/i.test(text) &&
      text.length > 50) {
    return 'semantic-background';
  }
  
  // Default to standard
  return 'semantic-standard';
};

// Auto-styling text component
const SmartText = ({ children, forceClass = null, context = {} }) => {
  const semanticClass = forceClass || classifyTextContent(children, context);
  
  return (
    <div className={cn('semantic-text', semanticClass)}>
      {children}
    </div>
  );
};
```

---

## Advanced Patterns

### Pattern 5: Adaptive Difficulty System

**Problem**: Fixed difficulty doesn't match all players
**Solution**: Dynamic adjustment based on player performance

#### Implementation:

```jsx
const useAdaptiveDifficulty = (playerData) => {
  const [difficultyLevel, setDifficultyLevel] = useState(5); // 1-10 scale
  
  const adjustDifficulty = useCallback((playerAction) => {
    const performance = analyzePerformance(playerAction, playerData);
    
    // Adjust based on success/struggle patterns
    if (performance.struggling) {
      setDifficultyLevel(prev => Math.max(1, prev - 0.5));
    } else if (performance.excelling) {
      setDifficultyLevel(prev => Math.min(10, prev + 0.3));
    }
    
    // Log for analytics
    trackDifficultyAdjustment(difficultyLevel, performance);
  }, [playerData]);
  
  const getAdaptedContent = useCallback((baseContent) => {
    return {
      ...baseContent,
      choices: adaptChoiceComplexity(baseContent.choices, difficultyLevel),
      timeLimit: adaptTimeLimit(baseContent.timeLimit, difficultyLevel),
      hints: difficultyLevel < 4 ? generateHints(baseContent) : []
    };
  }, [difficultyLevel]);
  
  return { 
    difficultyLevel, 
    adjustDifficulty, 
    getAdaptedContent 
  };
};

// Complexity adaptation functions
const adaptChoiceComplexity = (choices, difficulty) => {
  if (difficulty < 4) {
    // Simplify: reduce variables per choice
    return choices.map(choice => ({
      ...choice,
      costs: choice.costs.slice(0, 1), // Single resource only
      consequences: simplifyConsequences(choice.consequences)
    }));
  }
  
  if (difficulty > 7) {
    // Complexify: add strategic depth
    return choices.map(choice => ({
      ...choice,
      hiddenConsequences: generateHiddenEffects(choice),
      prerequisites: addPrerequisites(choice)
    }));
  }
  
  return choices; // Standard difficulty
};
```

### Pattern 6: Emotional State Tracking

**Problem**: Games don't respond to player emotional state
**Solution**: Track indicators and adapt experience accordingly

#### Implementation:

```jsx
const useEmotionalStateTracking = () => {
  const [emotionalState, setEmotionalState] = useState({
    frustration: 0,    // 0-10 scale
    engagement: 5,     // 0-10 scale
    confidence: 5,     // 0-10 scale
    lastUpdate: Date.now()
  });
  
  const trackPlayerAction = useCallback((action) => {
    const indicators = analyzeEmotionalIndicators(action);
    
    setEmotionalState(prev => ({
      frustration: Math.max(0, Math.min(10, 
        prev.frustration + indicators.frustrationDelta
      )),
      engagement: Math.max(0, Math.min(10, 
        prev.engagement + indicators.engagementDelta
      )),
      confidence: Math.max(0, Math.min(10, 
        prev.confidence + indicators.confidenceDelta
      )),
      lastUpdate: Date.now()
    }));
  }, []);
  
  const getAdaptedExperience = useCallback(() => {
    const { frustration, engagement, confidence } = emotionalState;
    
    // High frustration adaptations
    if (frustration > 7) {
      return {
        showMoreHints: true,
        simplifyNextChoice: true,
        providePosecutiveReinforcement: true,
        offerBreakActivity: true
      };
    }
    
    // Low engagement adaptations  
    if (engagement < 3) {
      return {
        introduceNewMechanic: true,
        increasePaceActivity: true,
        addSurpriseElement: true,
        checkInWithPlayer: true
      };
    }
    
    // Low confidence adaptations
    if (confidence < 3) {
      return {
        provideSuccessOpportunities: true,
        celebrateSmallWins: true,
        offerGuidedExperience: true,
        showProgressReminder: true
      };
    }
    
    return { normalExperience: true };
  }, [emotionalState]);
  
  return {
    emotionalState,
    trackPlayerAction,
    getAdaptedExperience
  };
};

// Emotional indicator analysis
const analyzeEmotionalIndicators = (action) => {
  let frustrationDelta = 0;
  let engagementDelta = 0;
  let confidenceDelta = 0;
  
  // Fast repeated clicks (potential frustration)
  if (action.type === 'click' && action.timeSinceLastClick < 500) {
    frustrationDelta += 0.5;
    engagementDelta -= 0.2;
  }
  
  // Long pauses before decisions (uncertainty)
  if (action.type === 'choice' && action.decisionTime > 30000) {
    confidenceDelta -= 0.3;
    engagementDelta -= 0.1;
  }
  
  // Quick, confident decisions
  if (action.type === 'choice' && action.decisionTime < 10000) {
    confidenceDelta += 0.2;
    engagementDelta += 0.1;
  }
  
  // Successful outcomes
  if (action.type === 'success') {
    confidenceDelta += 0.4;
    engagementDelta += 0.3;
    frustrationDelta -= 0.2;
  }
  
  // Repeated failures
  if (action.type === 'failure' && action.recentFailures > 2) {
    frustrationDelta += 0.8;
    confidenceDelta -= 0.5;
  }
  
  return { frustrationDelta, engagementDelta, confidenceDelta };
};
```

### Pattern 7: Performance-Aware Animations

**Problem**: Animations stutter or lag on lower-end devices
**Solution**: Adaptive animation system based on device performance

#### Implementation:

```jsx
const usePerformanceAdaptiveAnimations = () => {
  const [performanceLevel, setPerformanceLevel] = useState('high');
  const frameTimeRef = useRef([]);
  
  // Monitor frame times to assess performance
  useEffect(() => {
    let animationFrame;
    let lastTime = performance.now();
    
    const measureFrameTime = (currentTime) => {
      const frameTime = currentTime - lastTime;
      frameTimeRef.current.push(frameTime);
      
      // Keep only recent measurements
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift();
      }
      
      // Analyze performance every second
      if (frameTimeRef.current.length === 60) {
        analyzePerformance();
      }
      
      lastTime = currentTime;
      animationFrame = requestAnimationFrame(measureFrameTime);
    };
    
    animationFrame = requestAnimationFrame(measureFrameTime);
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  
  const analyzePerformance = useCallback(() => {
    const frameTimes = frameTimeRef.current;
    const averageFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
    const targetFrameTime = 16.67; // 60fps
    
    if (averageFrameTime > targetFrameTime * 1.5) {
      setPerformanceLevel('low');
    } else if (averageFrameTime > targetFrameTime * 1.2) {
      setPerformanceLevel('medium');
    } else {
      setPerformanceLevel('high');
    }
  }, []);
  
  const getAnimationConfig = useCallback((animationType) => {
    const configs = {
      low: {
        duration: 150,
        easing: 'ease',
        complexity: 'minimal'
      },
      medium: {
        duration: 250,
        easing: 'ease-out',
        complexity: 'moderate'
      },
      high: {
        duration: 350,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        complexity: 'full'
      }
    };
    
    return configs[performanceLevel];
  }, [performanceLevel]);
  
  return { performanceLevel, getAnimationConfig };
};

// Performance-adaptive component
const AdaptiveAnimatedElement = ({ 
  children, 
  animationType = 'slideIn',
  trigger 
}) => {
  const { getAnimationConfig } = usePerformanceAdaptiveAnimations();
  const config = getAnimationConfig(animationType);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: config.duration / 1000,
        ease: config.easing,
        // Reduce motion complexity on low-performance devices
        type: config.complexity === 'minimal' ? 'tween' : 'spring'
      }}
    >
      {children}
    </motion.div>
  );
};
```

---

## Mobile-Specific Patterns

### Pattern 8: Touch-Optimized Interactions

**Problem**: Desktop interactions don't translate well to mobile
**Solution**: Touch-first interaction design

#### Implementation:

```css
/* Touch-optimized sizing */
.touch-target {
  min-height: 44px; /* iOS Human Interface Guidelines */
  min-width: 44px;
  padding: 12px 16px;
  margin: 4px; /* Prevent accidental touches */
}

/* Touch feedback */
.touch-target:active {
  transform: scale(0.96);
  transition: transform 0.1s ease;
}

/* Larger touch areas for small elements */
.small-interactive::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  z-index: -1;
}

/* Gesture-friendly scrolling */
.scroll-area {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Prevent text selection on interactive elements */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
```

#### React Hook for Touch Interactions:

```jsx
const useTouchOptimized = (ref) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Detect touch capability
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  useEffect(() => {
    const element = ref.current;
    if (!element || !isTouchDevice) return;
    
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
      
      // Add visual feedback
      element.classList.add('touch-active');
    };
    
    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);
      
      // Remove visual feedback
      element.classList.remove('touch-active');
      
      // Cancel click if finger moved too much (scroll gesture)
      if (deltaX > 10 || deltaY > 10) {
        e.preventDefault();
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouchDevice, touchStartPos]);
  
  return { isTouchDevice };
};
```

---

## Accessibility Patterns

### Pattern 9: Comprehensive Accessibility Support

**Problem**: Accessibility often treated as afterthought
**Solution**: Built-in accessibility from the start

#### Screen Reader Support:

```jsx
const AccessibleChoiceCard = ({ 
  choice, 
  index, 
  totalChoices, 
  playerResources,
  onClick 
}) => {
  const canAfford = calculateAffordability(choice, playerResources);
  const ariaLabel = generateAccessibleDescription(choice, canAfford);
  
  return (
    <div
      role="button"
      tabIndex={canAfford ? 0 : -1}
      aria-label={ariaLabel}
      aria-posinset={index + 1}
      aria-setsize={totalChoices}
      aria-disabled={!canAfford}
      onClick={canAfford ? onClick : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && canAfford) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "choice-card",
        !canAfford && "choice-card--disabled"
      )}
    >
      {/* Visual content */}
      <div className="choice-text" aria-hidden="true">
        {choice.text}
      </div>
      
      {/* Screen reader specific content */}
      <div className="sr-only">
        Choice {index + 1} of {totalChoices}. 
        {choice.text}. 
        {formatCostsForScreenReader(choice.costs)}.
        {formatRewardsForScreenReader(choice.rewards)}.
        {canAfford ? 'Available to select.' : 'Not enough resources.'}
      </div>
    </div>
  );
};

// Helper functions
const generateAccessibleDescription = (choice, canAfford) => {
  let description = choice.text;
  
  if (choice.costs.length > 0) {
    description += `. Costs: ${choice.costs.map(c => `${c.amount} ${c.type}`).join(', ')}`;
  }
  
  if (choice.rewards.length > 0) {
    description += `. Rewards: ${choice.rewards.map(r => `${r.amount} ${r.type}`).join(', ')}`;
  }
  
  description += canAfford ? '. Available to select.' : '. Not enough resources.';
  
  return description;
};
```

#### Visual Accessibility:

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  .choice-card {
    border: 3px solid #000000;
    background: #ffffff;
    color: #000000;
  }
  
  .choice-card--disabled {
    border-color: #666666;
    background: #f0f0f0;
    color: #666666;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .choice-card {
    transition: none;
    animation: none;
  }
  
  .animated-element {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus indicators */
.choice-card:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}

/* Text scaling support */
@media (min-resolution: 192dpi) {
  .choice-text {
    font-size: calc(1rem + 0.2vw);
  }
}

/* Color vision accessibility */
.consequence-cost {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 0h8L0 8z' fill='%23dc2626'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
}

.consequence-reward {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpolygon points='4,0 8,8 0,8' fill='%23059669'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
}
```

---

## Testing and Validation Patterns

### Pattern 10: Automated UI Testing

**Problem**: Manual testing doesn't catch all UI issues
**Solution**: Automated testing for critical user paths

#### Implementation:

```jsx
// Test utilities for UI patterns
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Cognitive load testing
describe('Choice Card Cognitive Load', () => {
  test('should not exceed 3 simultaneous variables for age 9-11', () => {
    const choice = {
      text: "Explore the forest path",
      costs: [{ type: 'energy', amount: 10 }],
      rewards: [{ type: 'wisdom', amount: 5 }],
      requirements: [{ type: 'courage', level: 1 }]
    };
    
    render(<ChoiceCard choice={choice} targetAge={10} />);
    
    // Count visible information elements
    const variables = screen.getAllByTestId(/choice-variable/);
    expect(variables.length).toBeLessThanOrEqual(3);
  });
  
  test('should group related information visually', () => {
    const choice = createComplexChoice();
    render(<ChoiceCard choice={choice} />);
    
    const consequencesContainer = screen.getByTestId('choice-consequences');
    const costs = screen.getAllByTestId('consequence-cost');
    const rewards = screen.getAllByTestId('consequence-reward');
    
    // All consequences should be in the same container
    costs.forEach(cost => {
      expect(consequencesContainer).toContainElement(cost);
    });
    rewards.forEach(reward => {
      expect(consequencesContainer).toContainElement(reward);
    });
  });
});

// Accessibility testing
describe('Choice Card Accessibility', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <ChoiceCard choice={createTestChoice()} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('should be keyboard navigable', () => {
    const onChoiceSelect = jest.fn();
    render(
      <ChoiceCard 
        choice={createTestChoice()} 
        onSelect={onChoiceSelect}
      />
    );
    
    const choiceButton = screen.getByRole('button');
    
    // Should be focusable
    choiceButton.focus();
    expect(choiceButton).toHaveFocus();
    
    // Should respond to Enter key
    fireEvent.keyDown(choiceButton, { key: 'Enter' });
    expect(onChoiceSelect).toHaveBeenCalled();
    
    // Should respond to Space key
    fireEvent.keyDown(choiceButton, { key: ' ' });
    expect(onChoiceSelect).toHaveBeenCalledTimes(2);
  });
});

// Performance testing
describe('Choice Card Performance', () => {
  test('should render within performance budget', async () => {
    const startTime = performance.now();
    
    render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <ChoiceCard key={i} choice={createTestChoice()} />
        ))}
      </div>
    );
    
    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });
});
```

---

## Conclusion

These implementation patterns provide a foundation for creating exceptional interactive narrative experiences. They prioritize:

1. **Player Respect**: Every pattern considers cognitive load and user experience
2. **Accessibility**: Built-in support for diverse players and abilities  
3. **Performance**: Optimized for smooth interaction across devices
4. **Maintainability**: Clean, testable code that scales with project growth

**Remember**: These are proven patterns, not rigid rules. Adapt them to your specific project needs while maintaining the core principles of respect for the player and technical excellence.

The goal is creating experiences that feel effortless to use while being sophisticated in their implementation—true craft in interactive design.

---

*These patterns should evolve as new technologies and player expectations emerge. Regularly review and update implementations based on player feedback and industry advancement.*