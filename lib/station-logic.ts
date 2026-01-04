import { GameState } from './character-state'
import { useStationStore } from './station-state'
import { calculateAmbientContext } from '@/content/ambient-descriptions'
import { logger } from './logger'

/**
 * Updates the visual state of the station based on the current game progression.
 * Should be called on initialization and after major narrative events (arc completions).
 */
export function updateStationState(gameState: GameState) {
    const { atmosphere, activeEvents } = calculateAmbientContext(gameState)
    const store = useStationStore.getState()

    // Only update if changed to avoid unnecessary re-renders or log noise
    if (store.atmosphere !== atmosphere) {
        logger.info('Station atmosphere shifting', {
            from: store.atmosphere,
            to: atmosphere
        })
        store.setAtmosphere(atmosphere)
    }

    // Sync active ambient events
    // For now, we just clear and add valid ones. 
    // In a more complex system, we might want to preserve "read" state.
    if (activeEvents.length > 0) {
        store.clearExpiredEvents()
        activeEvents.forEach(event => {
            store.triggerAmbientEvent(event)
        })
    }
}
