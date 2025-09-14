/**
 * React Hook for Optimized LocalStorage
 * 
 * Provides a React hook interface for the optimized localStorage operations
 * with automatic cleanup and error handling.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { optimizedLocalStorage, StorageMetrics } from '@/lib/localStorage-optimizer';
import { logger } from '@/lib/logger';

/**
 * Hook for game state with localStorage optimization
 */
export function useOptimizedGameState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialized = useRef(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        setIsLoading(true);
        const savedState = await optimizedLocalStorage.getGameState();
        if (savedState) {
          setState(savedState);
        }
      } catch (err) {
        setError(err as Error);
        logger.error('Failed to load game state:', err);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    loadState();
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (!isInitialized.current) return;

    const saveState = async () => {
      try {
        await optimizedLocalStorage.setGameState(state);
        setError(null);
      } catch (err) {
        setError(err as Error);
        logger.error('Failed to save game state:', err);
      }
    };

    saveState();
  }, [state]);

  const updateState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      if (typeof newState === 'function') {
        return (newState as (prev: T) => T)(prevState);
      }
      return newState;
    });
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return {
    state,
    updateState,
    resetState,
    isLoading,
    error
  };
}

/**
 * Hook for user progress with localStorage optimization
 */
export function useOptimizedUserProgress<T>(initialProgress: T) {
  const [progress, setProgress] = useState<T>(initialProgress);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const savedProgress = await optimizedLocalStorage.getUserProgress();
        if (savedProgress) {
          setProgress(savedProgress);
        }
      } catch (err) {
        setError(err as Error);
        logger.error('Failed to load user progress:', err);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    loadProgress();
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    const saveProgress = async () => {
      try {
        await optimizedLocalStorage.setUserProgress(progress);
        setError(null);
      } catch (err) {
        setError(err as Error);
        logger.error('Failed to save user progress:', err);
      }
    };

    saveProgress();
  }, [progress]);

  const updateProgress = useCallback((newProgress: T | ((prev: T) => T)) => {
    setProgress(prevProgress => {
      if (typeof newProgress === 'function') {
        return (newProgress as (prev: T) => T)(prevProgress);
      }
      return newProgress;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  return {
    progress,
    updateProgress,
    resetProgress,
    isLoading,
    error
  };
}

/**
 * Hook for settings with localStorage optimization
 */
export function useOptimizedSettings<T>(initialSettings: T) {
  const [settings, setSettings] = useState<T>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const savedSettings = await optimizedLocalStorage.getSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (err) {
        setError(err as Error);
        logger.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    const saveSettings = async () => {
      try {
        await optimizedLocalStorage.setSettings(settings);
        setError(null);
      } catch (err) {
        setError(err as Error);
        logger.error('Failed to save settings:', err);
      }
    };

    saveSettings();
  }, [settings]);

  const updateSettings = useCallback((newSettings: T | ((prev: T) => T)) => {
    setSettings(prevSettings => {
      if (typeof newSettings === 'function') {
        return (newSettings as (prev: T) => T)(prevSettings);
      }
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
    error
  };
}

/**
 * Hook for cache with localStorage optimization
 */
export function useOptimizedCache<T>(key: string, initialValue: T) {
  const [cache, setCache] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const loadCache = async () => {
      try {
        setIsLoading(true);
        const savedCache = await optimizedLocalStorage.getCache(key);
        if (savedCache) {
          setCache(savedCache);
        }
      } catch (err) {
        setError(err as Error);
        logger.error(`Failed to load cache for key ${key}:`, err);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    loadCache();
  }, [key]);

  useEffect(() => {
    if (!isInitialized.current) return;

    const saveCache = async () => {
      try {
        await optimizedLocalStorage.setCache(key, cache);
        setError(null);
      } catch (err) {
        setError(err as Error);
        logger.error(`Failed to save cache for key ${key}:`, err);
      }
    };

    saveCache();
  }, [key, cache]);

  const updateCache = useCallback((newCache: T | ((prev: T) => T)) => {
    setCache(prevCache => {
      if (typeof newCache === 'function') {
        return (newCache as (prev: T) => T)(prevCache);
      }
      return newCache;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache(initialValue);
  }, [initialValue]);

  return {
    cache,
    updateCache,
    clearCache,
    isLoading,
    error
  };
}

/**
 * Hook for storage metrics
 */
export function useStorageMetrics() {
  const [metrics, setMetrics] = useState<StorageMetrics>({
    totalSize: 0,
    itemCount: 0,
    lastCleanup: 0,
    errors: 0
  });

  const refreshMetrics = useCallback(() => {
    const newMetrics = optimizedLocalStorage.getStorageMetrics();
    setMetrics(newMetrics);
  }, []);

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return {
    metrics,
    refreshMetrics
  };
}

/**
 * Hook for storage management
 */
export function useStorageManagement() {
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearStorage = useCallback(async () => {
    try {
      setIsClearing(true);
      setError(null);
      await optimizedLocalStorage.clear();
      logger.info('Storage cleared successfully');
    } catch (err) {
      setError(err as Error);
      logger.error('Failed to clear storage:', err);
    } finally {
      setIsClearing(false);
    }
  }, []);

  const forceSave = useCallback(async () => {
    try {
      setError(null);
      await optimizedLocalStorage.forceSave();
      logger.info('Force save completed');
    } catch (err) {
      setError(err as Error);
      logger.error('Failed to force save:', err);
    }
  }, []);

  return {
    clearStorage,
    forceSave,
    isClearing,
    error
  };
}

/**
 * Hook for debounced localStorage operations
 */
export function useDebouncedStorage<T>(key: string, initialValue: T, delay: number = 300) {
  const [value, setValue] = useState<T>(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveValue = useCallback(async (newValue: T) => {
    try {
      setIsSaving(true);
      setError(null);
      await optimizedLocalStorage.setCache(key, newValue);
    } catch (err) {
      setError(err as Error);
      logger.error(`Failed to save debounced value for key ${key}:`, err);
    } finally {
      setIsSaving(false);
    }
  }, [key]);

  const debouncedSave = useCallback((newValue: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveValue(newValue);
    }, delay);
  }, [saveValue, delay]);

  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prevValue => {
      const updatedValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevValue)
        : newValue;
      
      debouncedSave(updatedValue);
      return updatedValue;
    });
  }, [debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    value,
    updateValue,
    isSaving,
    error
  };
}

// Export all hooks
export const optimizedLocalStorageHooks = {
  useOptimizedGameState,
  useOptimizedUserProgress,
  useOptimizedSettings,
  useOptimizedCache,
  useStorageMetrics,
  useStorageManagement,
  useDebouncedStorage
};
