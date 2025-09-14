/**
 * Event Bus for Cross-System Communication
 * 
 * Provides a lightweight, type-safe event system for decoupled communication
 * between different parts of the application. Supports both synchronous and
 * asynchronous event handling with proper cleanup and memory management.
 */

export type EventHandler<T = any> = (data: T) => void | Promise<void>;
export type EventMap = Record<string, any>;

interface EventSubscription {
  id: string;
  handler: EventHandler;
  once?: boolean;
  priority?: number;
}

interface EventBusConfig {
  maxListeners?: number;
  enableLogging?: boolean;
  enableMetrics?: boolean;
}

/**
 * Lightweight Event Bus Implementation
 * 
 * Features:
 * - Type-safe event handling with TypeScript generics
 * - Priority-based event handling
 * - One-time event listeners
 * - Automatic cleanup and memory management
 * - Performance metrics and logging
 * - Error handling and recovery
 */
export class EventBus<TEventMap extends EventMap = EventMap> {
  private listeners = new Map<keyof TEventMap, Set<EventSubscription>>();
  private subscriptionId = 0;
  private config: Required<EventBusConfig>;
  private metrics = {
    eventsEmitted: 0,
    eventsHandled: 0,
    errors: 0,
    subscriptions: 0,
    unsubscriptions: 0
  };

  constructor(config: EventBusConfig = {}) {
    this.config = {
      maxListeners: config.maxListeners ?? 100,
      enableLogging: config.enableLogging ?? false,
      enableMetrics: config.enableMetrics ?? false
    };
  }

  /**
   * Subscribe to an event
   */
  on<K extends keyof TEventMap>(
    event: K,
    handler: EventHandler<TEventMap[K]>,
    options: { once?: boolean; priority?: number } = {}
  ): string {
    const subscriptionId = `sub_${++this.subscriptionId}`;
    const subscription: EventSubscription = {
      id: subscriptionId,
      handler,
      once: options.once,
      priority: options.priority ?? 0
    };

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventListeners = this.listeners.get(event)!;
    
    // Check max listeners limit
    if (eventListeners.size >= this.config.maxListeners) {
      console.warn(`EventBus: Maximum listeners (${this.config.maxListeners}) reached for event "${String(event)}"`);
      return subscriptionId;
    }

    eventListeners.add(subscription);
    this.metrics.subscriptions++;

    if (this.config.enableLogging) {
      console.log(`EventBus: Subscribed to "${String(event)}" with ID ${subscriptionId}`);
    }

    return subscriptionId;
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first trigger)
   */
  once<K extends keyof TEventMap>(
    event: K,
    handler: EventHandler<TEventMap[K]>,
    priority?: number
  ): string {
    return this.on(event, handler, { once: true, priority });
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof TEventMap>(event: K, subscriptionId: string): boolean {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return false;

    for (const subscription of eventListeners) {
      if (subscription.id === subscriptionId) {
        eventListeners.delete(subscription);
        this.metrics.unsubscriptions++;

        if (this.config.enableLogging) {
          console.log(`EventBus: Unsubscribed from "${String(event)}" with ID ${subscriptionId}`);
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Emit an event to all subscribers
   */
  async emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): Promise<void> {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.size === 0) {
      if (this.config.enableLogging) {
        console.log(`EventBus: No listeners for event "${String(event)}"`);
      }
      return;
    }

    this.metrics.eventsEmitted++;

    // Sort listeners by priority (higher priority first)
    const sortedListeners = Array.from(eventListeners).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    const toRemove: EventSubscription[] = [];

    if (this.config.enableLogging) {
      console.log(`EventBus: Emitting "${String(event)}" to ${sortedListeners.length} listeners`);
    }

    // Execute listeners
    for (const subscription of sortedListeners) {
      try {
        await subscription.handler(data);
        this.metrics.eventsHandled++;

        // Remove one-time listeners
        if (subscription.once) {
          toRemove.push(subscription);
        }
      } catch (error) {
        this.metrics.errors++;
        console.error(`EventBus: Error in listener for "${String(event)}":`, error);
      }
    }

    // Clean up one-time listeners
    for (const subscription of toRemove) {
      eventListeners.delete(subscription);
    }
  }

  /**
   * Emit an event synchronously (for immediate execution)
   */
  emitSync<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.size === 0) return;

    this.metrics.eventsEmitted++;

    // Sort listeners by priority
    const sortedListeners = Array.from(eventListeners).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    const toRemove: EventSubscription[] = [];

    // Execute listeners synchronously
    for (const subscription of sortedListeners) {
      try {
        subscription.handler(data);
        this.metrics.eventsHandled++;

        if (subscription.once) {
          toRemove.push(subscription);
        }
      } catch (error) {
        this.metrics.errors++;
        console.error(`EventBus: Error in sync listener for "${String(event)}":`, error);
      }
    }

    // Clean up one-time listeners
    for (const subscription of toRemove) {
      eventListeners.delete(subscription);
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners<K extends keyof TEventMap>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<K extends keyof TEventMap>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  /**
   * Get all event names that have listeners
   */
  eventNames(): (keyof TEventMap)[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      eventsEmitted: 0,
      eventsHandled: 0,
      errors: 0,
      subscriptions: 0,
      unsubscriptions: 0
    };
  }

  /**
   * Clean up all listeners and reset state
   */
  destroy(): void {
    this.listeners.clear();
    this.resetMetrics();
  }
}

// Game-specific event types
export interface GameEventMap {
  // Game state events
  'game:state:changed': { state: string; previousState?: string };
  'game:scene:transition': { from: string; to: string; duration?: number };
  'game:message:received': { message: any; timestamp: number };
  'game:message:streaming': { message: any; isComplete: boolean };
  'game:presence:updated': { presence: any };
  'game:trust:changed': { trust: number; delta: number };
  'game:relationship:updated': { relationship: any };
  'game:platform:updated': { platform: any };
  'game:pattern:updated': { pattern: any };
  
  // Game interaction events
  'game:choice:made': { choice: any; timestamp: number; emotionalState: string; cognitiveState: string };
  'game:emotional:stress': { level: string; trigger: string };
  'game:emotional:calm': { level: string; trigger: string };
  'game:cognitive:flow': { state: string; awareness: number };
  'game:skills:updated': { skills: any; totalSkills: any };

  // UI events
  'ui:message:show': { message: any; duration?: number };
  'ui:message:hide': { messageId: string };
  'ui:scene:show': { scene: string; data?: any };
  'ui:scene:hide': { scene: string };
  'ui:animation:start': { animation: string; element?: HTMLElement };
  'ui:animation:complete': { animation: string; element?: HTMLElement };
  'ui:error:show': { error: Error; context?: string };
  'ui:error:hide': { errorId: string };

  // Performance events
  'perf:memory:warning': { usage: number; limit: number };
  'perf:render:slow': { component: string; duration: number };
  'perf:bundle:large': { size: number; threshold: number };
  'perf:choice:slow': { duration: number; choice: string };

  // System events
  'system:error': { error: Error; context: string };
  'system:warning': { message: string; context: string };
  'system:info': { message: string; context: string };
  'system:cleanup': { component: string };
}

// Global event bus instance
export const gameEventBus = new EventBus<GameEventMap>({
  maxListeners: 200,
  enableLogging: process.env.NODE_ENV === 'development',
  enableMetrics: true
});

// React hook for using the event bus
export function useEventBus() {
  return gameEventBus;
}

// Utility functions for common event patterns
export const EventUtils = {
  /**
   * Create a debounced event handler
   */
  debounce<T extends keyof GameEventMap>(
    event: T,
    handler: EventHandler<GameEventMap[T]>,
    delay: number
  ): EventHandler<GameEventMap[T]> {
    let timeoutId: NodeJS.Timeout;
    
    return (data: GameEventMap[T]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(data), delay);
    };
  },

  /**
   * Create a throttled event handler
   */
  throttle<T extends keyof GameEventMap>(
    event: T,
    handler: EventHandler<GameEventMap[T]>,
    limit: number
  ): EventHandler<GameEventMap[T]> {
    let inThrottle = false;
    
    return (data: GameEventMap[T]) => {
      if (!inThrottle) {
        handler(data);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Create a retry mechanism for failed event handlers
   */
  withRetry<T extends keyof GameEventMap>(
    handler: EventHandler<GameEventMap[T]>,
    maxRetries: number = 3,
    delay: number = 1000
  ): EventHandler<GameEventMap[T]> {
    return async (data: GameEventMap[T]) => {
      let retries = 0;
      
      while (retries < maxRetries) {
        try {
          await handler(data);
          return;
        } catch (error) {
          retries++;
          if (retries >= maxRetries) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, delay * retries));
        }
      }
    };
  }
};

// Export types for external use
export type { EventSubscription, EventBusConfig };
