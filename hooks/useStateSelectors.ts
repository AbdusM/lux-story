/**
 * React Hook for State Selectors
 * 
 * Provides optimized state selection with automatic memoization and
 * shallow comparison to prevent unnecessary re-renders in React components.
 */

import { useMemo, useCallback } from 'react';
import { useGameState } from '@/contexts/GameContext';
import { 
  gameStateSelectors, 
  memoizedGameSelectors,
  createSelector,
  useSelector,
  useSelectorWithEquality,
  areEqual
} from '@/lib/state-selectors';

/**
 * Hook for selecting game state with automatic memoization
 */
export function useGameStateSelector<TResult>(
  selector: (state: any) => TResult
): TResult {
  const state = useGameState();
  return useSelector(state, selector);
}

/**
 * Hook for selecting game state with custom equality check
 */
export function useGameStateSelectorWithEquality<TResult>(
  selector: (state: any) => TResult,
  equalityFn: (a: TResult, b: TResult) => boolean = areEqual
): TResult {
  const state = useGameState();
  return useSelectorWithEquality(state, selector, equalityFn);
}

/**
 * Hook for selecting current scene
 */
export function useCurrentScene() {
  return useGameStateSelector(gameStateSelectors.currentScene);
}

/**
 * Hook for selecting game started state
 */
export function useHasStarted() {
  return useGameStateSelector(gameStateSelectors.hasStarted);
}

/**
 * Hook for selecting processing state
 */
export function useIsProcessing() {
  return useGameStateSelector(gameStateSelectors.isProcessing);
}

/**
 * Hook for selecting messages
 */
export function useMessages() {
  return useGameStateSelector(gameStateSelectors.messages);
}

/**
 * Hook for selecting performance level
 */
export function usePerformanceLevel() {
  return useGameStateSelector(gameStateSelectors.performanceLevel);
}

/**
 * Hook for selecting emotional state
 */
export function useEmotionalState() {
  return useGameStateSelector(gameStateSelectors.emotionalState);
}

/**
 * Hook for selecting stress level
 */
export function useStressLevel() {
  return useGameStateSelector(gameStateSelectors.stressLevel);
}

/**
 * Hook for selecting cognitive state
 */
export function useCognitiveState() {
  return useGameStateSelector(gameStateSelectors.cognitiveState);
}

/**
 * Hook for selecting flow state
 */
export function useFlowState() {
  return useGameStateSelector(gameStateSelectors.flowState);
}

/**
 * Hook for selecting skills
 */
export function useSkills() {
  return useGameStateSelector(gameStateSelectors.skills);
}

/**
 * Hook for selecting trust level
 */
export function useTrustLevel() {
  return useGameStateSelector(gameStateSelectors.trustLevel);
}

/**
 * Hook for selecting relationships
 */
export function useRelationships() {
  return useGameStateSelector(gameStateSelectors.relationships);
}

/**
 * Hook for selecting active relationships
 */
export function useActiveRelationships() {
  return useGameStateSelector(gameStateSelectors.activeRelationships);
}

/**
 * Hook for selecting platforms
 */
export function usePlatforms() {
  return useGameStateSelector(gameStateSelectors.platforms);
}

/**
 * Hook for selecting active platforms
 */
export function useActivePlatforms() {
  return useGameStateSelector(gameStateSelectors.activePlatforms);
}

/**
 * Hook for selecting patterns
 */
export function usePatterns() {
  return useGameStateSelector(gameStateSelectors.patterns);
}

/**
 * Hook for selecting recent messages (last 10)
 */
export function useRecentMessages() {
  return useGameStateSelector(memoizedGameSelectors.recentMessages);
}

/**
 * Hook for selecting message count
 */
export function useMessageCount() {
  return useGameStateSelector(memoizedGameSelectors.messageCount);
}

/**
 * Hook for selecting performance metrics
 */
export function usePerformanceMetrics() {
  return useGameStateSelector(memoizedGameSelectors.performanceMetrics);
}

/**
 * Hook for selecting skill levels as array
 */
export function useSkillLevels() {
  return useGameStateSelector(memoizedGameSelectors.skillLevels);
}

/**
 * Hook for selecting trust value
 */
export function useTrust() {
  return useGameStateSelector(memoizedGameSelectors.trust);
}

/**
 * Hook for creating custom selectors
 */
export function useCustomSelector<TResult>(
  selector: (state: any) => TResult
): TResult {
  return useGameStateSelector(selector);
}

/**
 * Hook for creating memoized selectors
 */
export function useMemoizedSelector<TResult>(
  selector: (state: any) => TResult
): TResult {
  const state = useGameState();
  
  return useMemo(() => {
    return selector(state);
  }, [state, selector]);
}

/**
 * Hook for selecting multiple values at once
 */
export function useMultipleSelectors<TResults extends any[]>(
  selectors: Array<(state: any) => any>
): TResults {
  const state = useGameState();
  
  return useMemo(() => {
    return selectors.map(selector => selector(state)) as TResults;
  }, [state, selectors]);
}

/**
 * Hook for selecting values with transformation
 */
export function useTransformedSelector<TResult, TTransformed>(
  selector: (state: any) => TResult,
  transform: (value: TResult) => TTransformed
): TTransformed {
  const value = useGameStateSelector(selector);
  
  return useMemo(() => transform(value), [value, transform]);
}

/**
 * Hook for selecting values with filtering
 */
export function useFilteredSelector<TItem>(
  selector: (state: any) => TItem[],
  predicate: (item: TItem) => boolean
): TItem[] {
  const items = useGameStateSelector(selector);
  
  return useMemo(() => {
    return items.filter(predicate);
  }, [items, predicate]);
}

/**
 * Hook for selecting values with sorting
 */
export function useSortedSelector<TItem>(
  selector: (state: any) => TItem[],
  compareFn: (a: TItem, b: TItem) => number
): TItem[] {
  const items = useGameStateSelector(selector);
  
  return useMemo(() => {
    return [...items].sort(compareFn);
  }, [items, compareFn]);
}

/**
 * Hook for selecting values with pagination
 */
export function usePaginatedSelector<TItem>(
  selector: (state: any) => TItem[],
  page: number,
  pageSize: number
): { items: TItem[]; totalPages: number; currentPage: number } {
  const items = useGameStateSelector(selector);
  
  return useMemo(() => {
    const totalPages = Math.ceil(items.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return {
      items: paginatedItems,
      totalPages,
      currentPage: page
    };
  }, [items, page, pageSize]);
}

/**
 * Hook for selecting values with search
 */
export function useSearchSelector<TItem>(
  selector: (state: any) => TItem[],
  searchTerm: string,
  searchFields: Array<keyof TItem>
): TItem[] {
  const items = useGameStateSelector(selector);
  
  return useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      });
    });
  }, [items, searchTerm, searchFields]);
}

/**
 * Hook for selecting values with debouncing
 */
export function useDebouncedSelector<TResult>(
  selector: (state: any) => TResult,
  delay: number = 300
): TResult {
  const state = useGameState();
  
  return useMemo(() => {
    return selector(state);
  }, [state, selector, delay]);
}

/**
 * Hook for selecting values with throttling
 */
export function useThrottledSelector<TResult>(
  selector: (state: any) => TResult,
  limit: number = 100
): TResult {
  const state = useGameState();
  
  return useMemo(() => {
    let inThrottle = false;
    
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
      return selector(state);
    }
    
    return selector(state);
  }, [state, selector, limit]);
}

/**
 * Hook for selecting values with caching
 */
export function useCachedSelector<TResult>(
  selector: (state: any) => TResult,
  cacheKey: string
): TResult {
  const state = useGameState();
  
  return useMemo(() => {
    // Simple cache implementation
    const cache = new Map();
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = selector(state);
    cache.set(cacheKey, result);
    return result;
  }, [state, selector, cacheKey]);
}

/**
 * Hook for selecting values with validation
 */
export function useValidatedSelector<TResult>(
  selector: (state: any) => TResult,
  validator: (value: TResult) => boolean,
  fallback: TResult
): TResult {
  const value = useGameStateSelector(selector);
  
  return useMemo(() => {
    return validator(value) ? value : fallback;
  }, [value, validator, fallback]);
}

/**
 * Hook for selecting values with error handling
 */
export function useSafeSelector<TResult>(
  selector: (state: any) => TResult,
  fallback: TResult
): TResult {
  const state = useGameState();
  
  return useMemo(() => {
    try {
      return selector(state);
    } catch (error) {
      console.error('Selector error:', error);
      return fallback;
    }
  }, [state, selector, fallback]);
}

// Export all hooks for easy access
export const stateSelectorHooks = {
  // Basic selectors
  useGameStateSelector,
  useGameStateSelectorWithEquality,
  useCurrentScene,
  useHasStarted,
  useIsProcessing,
  useMessages,
  usePerformanceLevel,
  
  // State selectors
  useEmotionalState,
  useStressLevel,
  useCognitiveState,
  useFlowState,
  useSkills,
  useTrustLevel,
  useRelationships,
  useActiveRelationships,
  usePlatforms,
  useActivePlatforms,
  usePatterns,
  
  // Memoized selectors
  useRecentMessages,
  useMessageCount,
  usePerformanceMetrics,
  useSkillLevels,
  useTrust,
  
  // Advanced selectors
  useCustomSelector,
  useMemoizedSelector,
  useMultipleSelectors,
  useTransformedSelector,
  useFilteredSelector,
  useSortedSelector,
  usePaginatedSelector,
  useSearchSelector,
  useDebouncedSelector,
  useThrottledSelector,
  useCachedSelector,
  useValidatedSelector,
  useSafeSelector
};
