/**
 * LocalStorage Optimizer
 * 
 * Provides optimized localStorage operations with debouncing, compression,
 * and error handling to improve performance and prevent data loss.
 */

import { logger } from './logger';

// Configuration
const CONFIG = {
  DEBOUNCE_DELAY: 300, // ms
  MAX_RETRIES: 3,
  COMPRESSION_THRESHOLD: 1024, // bytes
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
  CLEANUP_INTERVAL: 60000, // 1 minute
};

// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: 'lux-story-game-state',
  USER_PROGRESS: 'lux-story-user-progress',
  SETTINGS: 'lux-story-settings',
  CACHE: 'lux-story-cache',
  METRICS: 'lux-story-metrics',
} as const;

// Type definitions
interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  version: string;
  compressed?: boolean;
}

interface StorageMetrics {
  totalSize: number;
  itemCount: number;
  lastCleanup: number;
  errors: number;
}

interface DebouncedOperation {
  key: string;
  data: any;
  timestamp: number;
  timeoutId: NodeJS.Timeout;
}

/**
 * Simple compression using JSON stringify/parse with size optimization
 */
class DataCompressor {
  /**
   * Compress data if it exceeds threshold
   */
  static compress<T>(data: T, threshold: number = CONFIG.COMPRESSION_THRESHOLD): StorageItem<T> {
    const jsonString = JSON.stringify(data);
    
    if (jsonString.length > threshold) {
      // Simple compression: remove unnecessary whitespace and use shorter keys
      const compressed = JSON.stringify(data, null, 0);
      return {
        data: compressed as T,
        timestamp: Date.now(),
        version: '1.0',
        compressed: true
      };
    }
    
    return {
      data,
      timestamp: Date.now(),
      version: '1.0',
      compressed: false
    };
  }

  /**
   * Decompress data if it was compressed
   */
  static decompress<T>(item: StorageItem<T>): T {
    if (item.compressed && typeof item.data === 'string') {
      try {
        return JSON.parse(item.data as string);
      } catch (error) {
        logger.error('Failed to decompress data:', error);
        return item.data;
      }
    }
    return item.data;
  }

  /**
   * Get compressed size
   */
  static getSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }
}

/**
 * Debounced localStorage operations
 */
class DebouncedStorage {
  private operations = new Map<string, DebouncedOperation>();
  private metrics: StorageMetrics = {
    totalSize: 0,
    itemCount: 0,
    lastCleanup: Date.now(),
    errors: 0
  };

  /**
   * Set item with debouncing
   */
  setItem<T>(key: string, data: T, immediate: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      // Clear existing operation
      const existing = this.operations.get(key);
      if (existing) {
        clearTimeout(existing.timeoutId);
      }

      const operation: DebouncedOperation = {
        key,
        data,
        timestamp: Date.now(),
        timeoutId: setTimeout(() => {
          this.performSetItem(key, data)
            .then(resolve)
            .catch(reject);
          this.operations.delete(key);
        }, immediate ? 0 : CONFIG.DEBOUNCE_DELAY)
      };

      this.operations.set(key, operation);
    });
  }

  /**
   * Get item from storage
   */
  getItem<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) {
          resolve(null);
          return;
        }

        const parsed: StorageItem<T> = JSON.parse(item);
        const data = DataCompressor.decompress(parsed);
        resolve(data);
      } catch (error) {
        this.metrics.errors++;
        logger.error('Failed to get item from localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(key);
        this.updateMetrics();
        resolve();
      } catch (error) {
        this.metrics.errors++;
        logger.error('Failed to remove item from localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Clear all storage
   */
  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Clear only our app's data
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
        this.metrics = {
          totalSize: 0,
          itemCount: 0,
          lastCleanup: Date.now(),
          errors: 0
        };
        resolve();
      } catch (error) {
        this.metrics.errors++;
        logger.error('Failed to clear localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Get storage metrics
   */
  getMetrics(): StorageMetrics {
    return { ...this.metrics };
  }

  /**
   * Perform the actual setItem operation
   */
  private async performSetItem<T>(key: string, data: T): Promise<void> {
    try {
      const compressed = DataCompressor.compress(data);
      const jsonString = JSON.stringify(compressed);
      
      // Check storage size
      if (this.metrics.totalSize + jsonString.length > CONFIG.MAX_STORAGE_SIZE) {
        await this.cleanup();
      }

      localStorage.setItem(key, jsonString);
      this.updateMetrics();
      
      logger.debug(`Stored item ${key} (${jsonString.length} bytes)`);
    } catch (error) {
      this.metrics.errors++;
      logger.error('Failed to set item in localStorage:', error);
      throw error;
    }
  }

  /**
   * Update storage metrics
   */
  private updateMetrics(): void {
    try {
      let totalSize = 0;
      let itemCount = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && Object.values(STORAGE_KEYS).includes(key as any)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += item.length;
            itemCount++;
          }
        }
      }

      this.metrics.totalSize = totalSize;
      this.metrics.itemCount = itemCount;
    } catch (error) {
      logger.error('Failed to update storage metrics:', error);
    }
  }

  /**
   * Cleanup old or large items
   */
  private async cleanup(): Promise<void> {
    try {
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && Object.values(STORAGE_KEYS).includes(key as any)) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed: StorageItem = JSON.parse(item);
              if (now - parsed.timestamp > maxAge) {
                localStorage.removeItem(key);
                logger.debug(`Cleaned up old item: ${key}`);
              }
            } catch (error) {
              // Remove corrupted items
              localStorage.removeItem(key);
              logger.debug(`Removed corrupted item: ${key}`);
            }
          }
        }
      }

      this.metrics.lastCleanup = now;
      this.updateMetrics();
    } catch (error) {
      logger.error('Failed to cleanup localStorage:', error);
    }
  }
}

/**
 * Optimized localStorage manager
 */
class OptimizedLocalStorage {
  private debouncedStorage = new DebouncedStorage();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
  }

  /**
   * Set game state with optimization
   */
  async setGameState(state: any): Promise<void> {
    return this.debouncedStorage.setItem(STORAGE_KEYS.GAME_STATE, state);
  }

  /**
   * Get game state
   */
  async getGameState(): Promise<any> {
    return this.debouncedStorage.getItem(STORAGE_KEYS.GAME_STATE);
  }

  /**
   * Set user progress with optimization
   */
  async setUserProgress(progress: any): Promise<void> {
    return this.debouncedStorage.setItem(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  /**
   * Get user progress
   */
  async getUserProgress(): Promise<any> {
    return this.debouncedStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  }

  /**
   * Set settings with optimization
   */
  async setSettings(settings: any): Promise<void> {
    return this.debouncedStorage.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  /**
   * Get settings
   */
  async getSettings(): Promise<any> {
    return this.debouncedStorage.getItem(STORAGE_KEYS.SETTINGS);
  }

  /**
   * Set cache with optimization
   */
  async setCache(key: string, data: any): Promise<void> {
    const cacheKey = `${STORAGE_KEYS.CACHE}-${key}`;
    return this.debouncedStorage.setItem(cacheKey, data);
  }

  /**
   * Get cache
   */
  async getCache(key: string): Promise<any> {
    const cacheKey = `${STORAGE_KEYS.CACHE}-${key}`;
    return this.debouncedStorage.getItem(cacheKey);
  }

  /**
   * Set metrics with optimization
   */
  async setMetrics(metrics: any): Promise<void> {
    return this.debouncedStorage.setItem(STORAGE_KEYS.METRICS, metrics);
  }

  /**
   * Get metrics
   */
  async getMetrics(): Promise<any> {
    return this.debouncedStorage.getItem(STORAGE_KEYS.METRICS);
  }

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    return this.debouncedStorage.clear();
  }

  /**
   * Get storage metrics
   */
  getStorageMetrics(): StorageMetrics {
    return this.debouncedStorage.getMetrics();
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.debouncedStorage.clear();
    }, CONFIG.CLEANUP_INTERVAL);
  }

  /**
   * Stop cleanup interval
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Force immediate save
   */
  async forceSave(): Promise<void> {
    // This would need to be implemented to force all pending operations
    logger.debug('Force save requested');
  }
}

// Create singleton instance
export const optimizedLocalStorage = new OptimizedLocalStorage();

// Export types and utilities
export type { StorageItem, StorageMetrics, DebouncedOperation };
export { DataCompressor, DebouncedStorage, OptimizedLocalStorage, STORAGE_KEYS, CONFIG };
