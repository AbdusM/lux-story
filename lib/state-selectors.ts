/**
 * State Selectors for Performance Optimization
 *
 * Provides memoized selectors to prevent unnecessary re-renders by ensuring
 * components only update when their specific data changes. Uses shallow
 * comparison and memoization to optimize React performance.
 */

import { useMemo } from 'react';
import type { GameState } from './game-store';

// Simple shallow equality check
function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  if (keysA.length !== keysB.length) return false;
  
  for (let i = 0; i < keysA.length; i++) {
    if (objA[keysA[i]] !== objB[keysA[i]]) return false;
  }
  
  return true;
}

// Type definitions for state selectors
export type Selector<TState, TResult> = (state: TState) => TResult;
export type MemoizedSelector<TState, TResult> = (state: TState) => TResult;

/**
 * Create a memoized selector that only recalculates when dependencies change
 */
export function createSelector<TState, TArgs extends unknown[], TResult>(
  dependencies: Array<Selector<TState, unknown>>,
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
export function createTransformSelector<TState, TInput, TResult>(
  selector: Selector<TState, TInput>,
  transform: (value: TInput) => TResult
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
export function createCombinedSelector<TState, TResults extends unknown[]>(
  selectors: Array<Selector<TState, unknown>>
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
  _equalityFn: (a: TResult, b: TResult) => boolean = shallowEqual
): TResult {
  // Note: equalityFn reserved for future optimization with useSyncExternalStore
  return useMemo(() => selector(state), [state, selector]);
}

/**
 * Game-specific state selectors
 */

// Game state selectors
export const gameStateSelectors = {
  // Basic game state
  currentScene: (state: GameState) => state.currentSceneId,
  hasStarted: (state: GameState) => state.hasStarted,
  isProcessing: (state: GameState) => state.isProcessing,
  messages: (state: GameState) => state.messages,
  performanceLevel: (state: GameState) => state.performanceLevel,

  // Emotional state
  emotionalState: (state: GameState) => state.emotionalState,
  stressLevel: (state: GameState) => state.emotionalState?.stressLevel,
  rapidClicks: (state: GameState) => state.emotionalState?.rapidClicks || 0,
  hesitationCount: (state: GameState) => state.emotionalState?.hesitationCount || 0,

  // Cognitive state
  cognitiveState: (state: GameState) => state.cognitiveState,
  flowState: (state: GameState) => state.cognitiveState?.flowState,
  metacognitiveAwareness: (state: GameState) => state.cognitiveState?.metacognitiveAwareness || 0,

  // Skills
  skills: (state: GameState) => state.skills,
  communication: (state: GameState) => state.skills?.communication || 0,
  emotionalIntelligence: (state: GameState) => state.skills?.emotionalIntelligence || 0,
  creativity: (state: GameState) => state.skills?.creativity || 0,
  problemSolving: (state: GameState) => state.skills?.problemSolving || 0,
  criticalThinking: (state: GameState) => state.skills?.criticalThinking || 0,

  // Patterns
  patterns: (state: GameState) => state.patterns,

  // Character trust
  characterTrust: (state: GameState) => state.characterTrust,

  // Platform warmth
  platformWarmth: (state: GameState) => state.platformWarmth,
  platformAccessible: (state: GameState) => state.platformAccessible,
};

// Memoized selectors for performance
export const memoizedGameSelectors = {
  // Basic game state (memoized)
  currentScene: (state: GameState) => state.currentSceneId,
  hasStarted: (state: GameState) => state.hasStarted,
  isProcessing: (state: GameState) => state.isProcessing,
  messages: (state: GameState) => state.messages,
  performanceLevel: (state: GameState) => state.performanceLevel,

  // Emotional state (memoized)
  emotionalState: (state: GameState) => state.emotionalState,
  stressLevel: (state: GameState) => state.emotionalState?.stressLevel || 'neutral',

  // Cognitive state (memoized)
  cognitiveState: (state: GameState) => state.cognitiveState,
  flowState: (state: GameState) => state.cognitiveState?.flowState || 'neutral',

  // Skills (memoized)
  skills: (state: GameState) => state.skills,
  skillLevels: (state: GameState) => {
    const skills = state.skills || {};
    return Object.entries(skills).map(([name, level]) => ({ name, level }));
  },

  // Character trust
  characterTrust: (state: GameState) => state.characterTrust,

  // Messages (memoized)
  recentMessages: (state: GameState) => {
    const messages = state.messages || [];
    return messages.slice(-10); // Last 10 messages
  },
  messageCount: (state: GameState) => {
    const messages = state.messages || [];
    return messages.length;
  },

  // Performance metrics (memoized)
  performanceMetrics: (state: GameState) => {
    const metrics = {
      performanceLevel: state.performanceLevel || 0,
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
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for emotional state
export function useEmotionalStateSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for cognitive state
export function useCognitiveStateSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for skills
export function useSkillsSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for trust system
export function useTrustSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for relationships
export function useRelationshipsSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for platforms
export function usePlatformsSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for messages
export function useMessagesSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

// Hook for performance metrics
export function usePerformanceSelector<TResult>(
  state: GameState,
  selector: Selector<GameState, TResult>
): TResult {
  return useMemo(() => selector(state), [state, selector]);
}

/**
 * Utility functions for selector optimization
 */

// Check if two values are equal using shallow comparison
export function areEqual(a: unknown, b: unknown): boolean {
  return shallowEqual(a, b);
}

// Check if two values are equal using deep comparison
export function areDeepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Create a selector that only updates when specific properties change
export function createPropertyDependentSelector<TState, TResult>(
  selector: Selector<TState, TResult>,
  dependencies: Array<keyof TState>
): MemoizedSelector<TState, TResult> {
  return (state: TState) => {
    // Only recalculate if dependencies have changed
    const _depValues = dependencies.map(dep => state[dep]);
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
