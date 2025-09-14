/**
 * React Hook for Event Bus Integration
 * 
 * Provides a convenient way to use the event bus in React components
 * with automatic cleanup and TypeScript support.
 */

import { useEffect, useCallback, useRef } from 'react';
import { gameEventBus, EventHandler, GameEventMap } from '../lib/event-bus';

/**
 * Hook for subscribing to events with automatic cleanup
 */
export function useEventBusSubscription<K extends keyof GameEventMap>(
  event: K,
  handler: EventHandler<GameEventMap[K]>,
  deps: React.DependencyList = []
) {
  const handlerRef = useRef(handler);
  const subscriptionIdRef = useRef<string | null>(null);

  // Update handler ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Subscribe to event
  useEffect(() => {
    const wrappedHandler = (data: GameEventMap[K]) => {
      handlerRef.current(data);
    };

    const subscriptionId = gameEventBus.on(event, wrappedHandler);
    subscriptionIdRef.current = subscriptionId;

    return () => {
      if (subscriptionIdRef.current) {
        gameEventBus.off(event, subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [event, ...deps]);

  // Return unsubscribe function
  const unsubscribe = useCallback(() => {
    if (subscriptionIdRef.current) {
      gameEventBus.off(event, subscriptionIdRef.current);
      subscriptionIdRef.current = null;
    }
  }, [event]);

  return unsubscribe;
}

/**
 * Hook for one-time event subscription
 */
export function useEventBusOnce<K extends keyof GameEventMap>(
  event: K,
  handler: EventHandler<GameEventMap[K]>,
  deps: React.DependencyList = []
) {
  const handlerRef = useRef(handler);
  const subscriptionIdRef = useRef<string | null>(null);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const wrappedHandler = (data: GameEventMap[K]) => {
      handlerRef.current(data);
    };

    const subscriptionId = gameEventBus.once(event, wrappedHandler);
    subscriptionIdRef.current = subscriptionId;

    return () => {
      if (subscriptionIdRef.current) {
        gameEventBus.off(event, subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [event, ...deps]);

  return subscriptionIdRef.current;
}

/**
 * Hook for emitting events
 */
export function useEventBusEmitter() {
  const emit = useCallback(<K extends keyof GameEventMap>(
    event: K,
    data: GameEventMap[K]
  ) => {
    gameEventBus.emit(event, data);
  }, []);

  const emitSync = useCallback(<K extends keyof GameEventMap>(
    event: K,
    data: GameEventMap[K]
  ) => {
    gameEventBus.emitSync(event, data);
  }, []);

  return { emit, emitSync };
}

/**
 * Hook for event bus metrics
 */
export function useEventBusMetrics() {
  const getMetrics = useCallback(() => {
    return gameEventBus.getMetrics();
  }, []);

  const resetMetrics = useCallback(() => {
    gameEventBus.resetMetrics();
  }, []);

  return { getMetrics, resetMetrics };
}

/**
 * Hook for multiple event subscriptions
 */
export function useEventBusSubscriptions(
  subscriptions: Array<{
    event: keyof GameEventMap;
    handler: EventHandler<any>;
    deps?: React.DependencyList;
  }>
) {
  const unsubscribeFunctions = useRef<Array<() => void>>([]);

  useEffect(() => {
    // Clear previous subscriptions
    unsubscribeFunctions.current.forEach(unsubscribe => unsubscribe());
    unsubscribeFunctions.current = [];

    // Create new subscriptions
    subscriptions.forEach(({ event, handler, deps = [] }) => {
      const wrappedHandler = (data: any) => handler(data);
      const subscriptionId = gameEventBus.on(event, wrappedHandler);
      
      const unsubscribe = () => {
        gameEventBus.off(event, subscriptionId);
      };
      
      unsubscribeFunctions.current.push(unsubscribe);
    });

    // Cleanup function
    return () => {
      unsubscribeFunctions.current.forEach(unsubscribe => unsubscribe());
      unsubscribeFunctions.current = [];
    };
  }, [subscriptions]);

  return unsubscribeFunctions.current;
}

/**
 * Hook for event bus debugging
 */
export function useEventBusDebug(enabled: boolean = false) {
  useEffect(() => {
    if (!enabled) return;

    const logEvent = (event: string, data: any) => {
      console.log(`[EventBus] ${event}:`, data);
    };

    // Subscribe to all events for debugging
    const events: Array<keyof GameEventMap> = [
      'game:state:changed',
      'game:scene:transition',
      'game:message:received',
      'game:message:streaming',
      'game:presence:updated',
      'game:trust:changed',
      'ui:message:show',
      'ui:message:hide',
      'ui:scene:show',
      'ui:scene:hide',
      'system:error',
      'system:warning',
      'system:info'
    ];

    const subscriptionIds = events.map(event => 
      gameEventBus.on(event, (data) => logEvent(String(event), data))
    );

    return () => {
      events.forEach((event, index) => {
        gameEventBus.off(event, subscriptionIds[index]);
      });
    };
  }, [enabled]);
}

// Export the event bus instance for direct access
export { gameEventBus };
