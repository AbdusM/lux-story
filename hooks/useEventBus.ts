/**
 * React Hook for Event Bus Integration
 *
 * Provides a convenient way to use the event bus in React components
 * with automatic cleanup and TypeScript support.
 */

import { useCallback, useEffect, useRef, type DependencyList } from 'react'

import { gameEventBus, type EventHandler, type GameEventMap } from '../lib/event-bus'

type SubscriptionConfig = {
  [K in keyof GameEventMap]: {
    event: K
    handler: EventHandler<GameEventMap[K]>
    deps?: DependencyList
  }
}[keyof GameEventMap]

/**
 * Hook for subscribing to events with automatic cleanup
 */
export function useEventBusSubscription<K extends keyof GameEventMap>(
  event: K,
  handler: EventHandler<GameEventMap[K]>,
  _deps: DependencyList = [],
) {
  const handlerRef = useRef(handler)
  const subscriptionIdRef = useRef<string | null>(null)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const wrappedHandler: EventHandler<GameEventMap[K]> = (data) => {
      return handlerRef.current(data)
    }

    const subscriptionId = gameEventBus.on(event, wrappedHandler)
    subscriptionIdRef.current = subscriptionId

    return () => {
      if (!subscriptionIdRef.current) return
      gameEventBus.off(event, subscriptionIdRef.current)
      subscriptionIdRef.current = null
    }
  }, [event])

  return useCallback(() => {
    if (!subscriptionIdRef.current) return
    gameEventBus.off(event, subscriptionIdRef.current)
    subscriptionIdRef.current = null
  }, [event])
}

/**
 * Hook for one-time event subscription
 */
export function useEventBusOnce<K extends keyof GameEventMap>(
  event: K,
  handler: EventHandler<GameEventMap[K]>,
  _deps: DependencyList = [],
) {
  const handlerRef = useRef(handler)
  const subscriptionIdRef = useRef<string | null>(null)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const wrappedHandler: EventHandler<GameEventMap[K]> = (data) => {
      return handlerRef.current(data)
    }

    const subscriptionId = gameEventBus.once(event, wrappedHandler)
    subscriptionIdRef.current = subscriptionId

    return () => {
      if (!subscriptionIdRef.current) return
      gameEventBus.off(event, subscriptionIdRef.current)
      subscriptionIdRef.current = null
    }
  }, [event])

  return subscriptionIdRef.current
}

/**
 * Hook for emitting events
 */
export function useEventBusEmitter() {
  const emit = useCallback(<K extends keyof GameEventMap>(
    event: K,
    data: GameEventMap[K],
  ) => {
    return gameEventBus.emit(event, data)
  }, [])

  const emitSync = useCallback(<K extends keyof GameEventMap>(
    event: K,
    data: GameEventMap[K],
  ) => {
    gameEventBus.emitSync(event, data)
  }, [])

  return { emit, emitSync }
}

/**
 * Hook for event bus metrics
 */
export function useEventBusMetrics() {
  const getMetrics = useCallback(() => {
    return gameEventBus.getMetrics()
  }, [])

  const resetMetrics = useCallback(() => {
    gameEventBus.resetMetrics()
  }, [])

  return { getMetrics, resetMetrics }
}

/**
 * Hook for multiple event subscriptions
 */
export function useEventBusSubscriptions(subscriptions: SubscriptionConfig[]) {
  const unsubscribeFunctions = useRef<Array<() => void>>([])

  useEffect(() => {
    unsubscribeFunctions.current.forEach((unsubscribe) => unsubscribe())
    unsubscribeFunctions.current = []

    const subscribe = <K extends keyof GameEventMap>(
      event: K,
      handler: EventHandler<GameEventMap[K]>,
    ) => {
      const subscriptionId = gameEventBus.on(event, handler)
      unsubscribeFunctions.current.push(() => {
        gameEventBus.off(event, subscriptionId)
      })
    }

    subscriptions.forEach((subscription) => {
      subscribe(subscription.event, subscription.handler)
    })

    return () => {
      unsubscribeFunctions.current.forEach((unsubscribe) => unsubscribe())
      unsubscribeFunctions.current = []
    }
  }, [subscriptions])

  return unsubscribeFunctions.current
}

/**
 * Hook for event bus debugging
 */
export function useEventBusDebug(enabled: boolean = false) {
  useEffect(() => {
    if (!enabled) return

    const logEvent = (event: string, data: unknown) => {
      console.log(`[EventBus] ${event}:`, data)
    }

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
      'system:info',
    ]

    const subscriptionIds = events.map((event) =>
      gameEventBus.on(event, (data) => logEvent(String(event), data)),
    )

    return () => {
      events.forEach((event, index) => {
        gameEventBus.off(event, subscriptionIds[index])
      })
    }
  }, [enabled])
}

export { gameEventBus }
