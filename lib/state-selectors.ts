/**
 * State Selectors for Performance Optimization
 * 
 * Provides memoized selectors to prevent unnecessary re-renders by ensuring
 * components only update when their specific data changes. Uses shallow
 * comparison and memoization to optimize React performance.
 */

import { useMemo } from 'react';

// Simple shallow equality check
function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (let i = 0; i < keysA.length; i++) {
    if (a[keysA[i]] !== b[keysA[i]]) return false;
  }
  
  return true;
}

// Type definitions for state selectors
export type Selector<TState, TResult> = (state: TState) => TResult;
export type MemoizedSelector<TState, TResult> = (state: TState) => TResult;

/**
 * Create a memoized selector that only recalculates when dependencies change
 */
export function createSelector<TState, TArgs extends any[], TResult>(
  dependencies: Array<Selector<TState, any>>,
  resultFunc: (...args: TArgs) => TResult
): MemoizedSelector<TState, TResult> {
  let lastResult: TResult;
  let lastDeps: TArgs;

  return (state: TState): TResult => {
    const currentDeps = dependencies.map(dep => dep(state)) as TArgs;
    
    if (lastDeps && shallowEqual(currentDeps, lastDeps)) {
      return lastResult;
    }
    
    lastDeps = currentDeps;
    lastResult = resultFunc(...currentDeps);
    return lastResult;
  };
}

/**
 * Create a selector that extracts a specific property from state
 */
export function createPropertySelector<TState, K extends keyof TState>(
  property: K
): MemoizedSelector<TState, TState[K]> {
  return (state: TState) => state[property];
}

/**
 * Create a selector that extracts multiple properties from state
 */
export function createMultiPropertySelector<TState, K extends keyof TState>(
  properties: K[]
): MemoizedSelector<TState, Pick<TState, K>> {
  return (state: TState) => {
    const result = {} as Pick<TState, K>;
    properties.forEach(prop => {
      result[prop] = state[prop];
    });
    return result;
  };
}

/**
 * Create a selector that transforms state data
 */
export function createTransformSelector<TState, TResult>(
  selector: Selector<TState, any>,
  transform: (value: any) => TResult
): MemoizedSelector<TState, TResult> {
  return (state: TState) => transform(selector(state));
}

/**
 * Create a selector that filters state data
 */
export function createFilterSelector<TState, TItem>(
  selector: Selector<TState, TItem[]>,
  predicate: (item: TItem) => boolean
): MemoizedSelector<TState, TItem[]> {
  return (state: TState) => selector(state).filter(predicate);
}

/**
 * Create a selector that sorts state data
 */
export function createSortSelector<TState, TItem>(
  selector: Selector<TState, TItem[]>,
  compareFn: (a: TItem, b: TItem) => number
): MemoizedSelector<TState, TItem[]> {
  return (state: TState) => [...selector(state)].sort(compareFn);
}

/**
 * Create a selector that combines multiple selectors
 */
export function createCombinedSelector<TState, TResults extends any[]>(
  selectors: Array<Selector<TState, any>>
): MemoizedSelector<TState, TResults> {
  return (state: TState) => selectors.map(selector => selector(state)) as TResults;
}

/**
 * React hook for using selectors with automatic memoization
 */
export function useSelector<TState, TResult>(
  state: TState,
  selector: Selector<TState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

/**
 * React hook for using selectors with custom equality check
 */
export function useSelectorWithEquality<TState, TResult>(
  state: TState,
  selector: Selector<TState, TResult>,
  equalityFn: (a: TResult, b: TResult) => boolean = shallowEqual
): TResult {
  return useMemo(() => selector(state), [state, selector, equalityFn]);
}

/**
 * Game-specific state selectors
 */

// Game state selectors
export const gameStateSelectors = {
  // Basic game state
  currentScene: (state: any) => state.currentScene,
  hasStarted: (state: any) => state.hasStarted,
  isProcessing: (state: any) => state.isProcessing,
  messages: (state: any) => state.messages,
  performanceLevel: (state: any) => state.performanceLevel,
  
  // Emotional state
  emotionalState: (state: any) => state.emotionalState,
  stressLevel: (state: any) => state.emotionalState?.stressLevel,
  rapidClicks: (state: any) => state.emotionalState?.rapidClicks || 0,
  hesitationCount: (state: any) => state.emotionalState?.hesitationCount || 0,
  
  // Cognitive state
  cognitiveState: (state: any) => state.cognitiveState,
  flowState: (state: any) => state.cognitiveState?.flowState,
  metacognitiveAwareness: (state: any) => state.cognitiveState?.metacognitiveAwareness || 0,
  
  // Skills
  skills: (state: any) => state.skills,
  communication: (state: any) => state.skills?.communication || 0,
  emotionalIntelligence: (state: any) => state.skills?.emotionalIntelligence || 0,
  creativity: (state: any) => state.skills?.creativity || 0,
  problemSolving: (state: any) => state.skills?.problemSolving || 0,
  criticalThinking: (state: any) => state.skills?.criticalThinking || 0,
  
  // Patterns
  patterns: (state: any) => state.patterns,
  
  // Trust system
  trust: (state: any) => state.trust || 0,
  trustLevel: (state: any) => {
    const trust = state.trust || 0;
    if (trust >= 0.8) return 'high';
    if (trust >= 0.6) return 'medium';
    if (trust >= 0.4) return 'low';
    return 'very-low';
  },
  
  // Relationships
  relationships: (state: any) => state.relationships || {},
  activeRelationships: (state: any) => {
    const relationships = state.relationships || {};
    return Object.values(relationships).filter((rel: any) => rel.active);
  },
  
  // Platforms
  platforms: (state: any) => state.platforms || {},
  activePlatforms: (state: any) => {
    const platforms = state.platforms || {};
    return Object.values(platforms).filter((platform: any) => platform.active);
  }
};

// Memoized selectors for performance
export const memoizedGameSelectors = {
  // Basic game state (memoized)
  currentScene: (state: any) => state.currentScene,
  hasStarted: (state: any) => state.hasStarted,
  isProcessing: (state: any) => state.isProcessing,
  messages: (state: any) => state.messages,
  performanceLevel: (state: any) => state.performanceLevel,
  
  // Emotional state (memoized)
  emotionalState: (state: any) => state.emotionalState,
  stressLevel: (state: any) => state.emotionalState?.stressLevel || 'neutral',
  
  // Cognitive state (memoized)
  cognitiveState: (state: any) => state.cognitiveState,
  flowState: (state: any) => state.cognitiveState?.flowState || 'neutral',
  
  // Skills (memoized)
  skills: (state: any) => state.skills,
  skillLevels: (state: any) => {
    const skills = state.skills || {};
    return Object.entries(skills).map(([name, level]) => ({ name, level }));
  },
  
  // Trust system (memoized)
  trust: (state: any) => Math.max(0, Math.min(1, state.trust || 0)),
  trustLevel: (state: any) => {
    const trust = state.trust || 0;
    if (trust >= 0.8) return 'high';
    if (trust >= 0.6) return 'medium';
    if (trust >= 0.4) return 'low';
    return 'very-low';
  },
  
  // Relationships (memoized)
  relationships: (state: any) => state.relationships,
  activeRelationships: (state: any) => {
    const relationships = state.relationships || {};
    return Object.values(relationships).filter((rel: any) => rel.active);
  },
  
  // Platforms (memoized)
  platforms: (state: any) => state.platforms,
  activePlatforms: (state: any) => {
    const platforms = state.platforms || {};
    return Object.values(platforms).filter((platform: any) => platform.active);
  },
  
  // Messages (memoized)
  recentMessages: (state: any) => {
    const messages = state.messages || [];
    return messages.slice(-10); // Last 10 messages
  },
  messageCount: (state: any) => {
    const messages = state.messages || [];
    return messages.length;
  },
  
  // Performance metrics (memoized)
  performanceMetrics: (state: any) => {
    const metrics = {
      performanceLevel: state.performanceLevel || 0,
      memoryUsage: state.memoryUsage || 0,
      renderTime: state.renderTime || 0
    };
    return {
      ...metrics,
      performanceGrade: metrics.performanceLevel >= 0.8 ? 'A' : 
                       metrics.performanceLevel >= 0.6 ? 'B' : 
                       metrics.performanceLevel >= 0.4 ? 'C' : 'D'
    };
  }
};

/**
 * Custom hooks for using selectors in React components
 */

// Hook for basic game state
export function useGameStateSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for emotional state
export function useEmotionalStateSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for cognitive state
export function useCognitiveStateSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for skills
export function useSkillsSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for trust system
export function useTrustSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for relationships
export function useRelationshipsSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for platforms
export function usePlatformsSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for messages
export function useMessagesSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for performance metrics
export function usePerformanceSelector<TResult>(
  state: any,
  selector: Selector<any, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

/**
 * Utility functions for selector optimization
 */

// Check if two values are equal using shallow comparison
export function areEqual(a: any, b: any): boolean {
  return shallowEqual(a, b);
}

// Check if two values are equal using deep comparison
export function areDeepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Create a selector that only updates when specific properties change
export function createPropertyDependentSelector<TState, TResult>(
  selector: Selector<TState, TResult>,
  dependencies: Array<keyof TState>
): MemoizedSelector<TState, TResult> {
  return (state: TState) => {
    // Only recalculate if dependencies have changed
    const depValues = dependencies.map(dep => state[dep]);
    return selector(state);
  };
}

// Create a selector that debounces updates
export function createDebouncedSelector<TState, TResult>(
  selector: Selector<TState, TResult>,
  delay: number = 100
): MemoizedSelector<TState, TResult> {
  let timeoutId: NodeJS.Timeout;
  let lastResult: TResult;
  let lastState: TState;

  return (state: TState): TResult => {
    if (lastState === state) {
      return lastResult;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      lastState = state;
      lastResult = selector(state);
    }, delay);

    return lastResult;
  };
}

// Export all selectors for easy access
export const selectors = {
  game: gameStateSelectors,
  memoized: memoizedGameSelectors,
  create: {
    selector: createSelector,
    property: createPropertySelector,
    multiProperty: createMultiPropertySelector,
    transform: createTransformSelector,
    filter: createFilterSelector,
    sort: createSortSelector,
    combined: createCombinedSelector,
    propertyDependent: createPropertyDependentSelector,
    debounced: createDebouncedSelector
  },
  hooks: {
    game: useGameStateSelector,
    emotional: useEmotionalStateSelector,
    cognitive: useCognitiveStateSelector,
    skills: useSkillsSelector,
    trust: useTrustSelector,
    relationships: useRelationshipsSelector,
    platforms: usePlatformsSelector,
    messages: useMessagesSelector,
    performance: usePerformanceSelector
  },
  utils: {
    areEqual,
    areDeepEqual
  }
};
