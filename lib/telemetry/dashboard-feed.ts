/**
 * ISP Telemetry Feed - " The Virtual Socket"
 * 
 * Purpose: Emits real-time bio-state events to the console (and future websocket).
 * Proves the "CEO Dashboard" capability without building the full UI yet.
 */

import { NervousSystemState } from "@/lib/emotions"
import { GameState } from "@/lib/character-state"

export interface TelemetryEvent {
    timestamp: number
    playerId: string
    type: 'BIO_STATE_CHANGE' | 'SKILL_DEMONSTRATION' | 'IDENTITY_SHIFT'
    payload: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDashboardFeed(): Promise<any> {
    try {
        // In a real app, this would fetch from Supabase
        // For now, return mock events
        return MOCK_EVENTS
    } catch (_error) {
        // console.error('Error fetching dashboard feed:', error)
        return []
    }
}

const MOCK_EVENTS = [
    {
        id: '1',
        type: 'user_milestone',
        userId: 'user_123',
        timestamp: new Date().toISOString(),
        data: {
            milestone: 'First Login',
            properties: {
                platform: 'web'
            }
        }
    }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logEvent(eventType: string, data: any) {
    // Mock logging
    // console.log(`[Telemetry] ${eventType}`, data)

    // In dev, also log specific props
    if (data?.properties) {
        // console.log('Props:', data.properties)
    }
}

class DashboardFeed {
    private isConnected: boolean = false

    connect() {
        this.isConnected = true
        // console.log(`[🔋 TELEMETRY] Connection established to "Virtual CEO Dashboard"`) // Commented out as per instruction
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(type: TelemetryEvent['type'], payload: any, gameState: GameState) {
        if (!this.isConnected) this.connect()

        const _event: TelemetryEvent = {
            timestamp: Date.now(),
            playerId: gameState.playerId,
            type,
            payload
        }

        // ISP: Structured logging that mimics a real socket payload
        // console.group(`[📡 EMIT] ${type}`) // Commented out as per instruction
        // console.log(JSON.stringify(event, null, 2)) // Commented out as per instruction

        if (type === 'BIO_STATE_CHANGE') {
            const state = payload.state as NervousSystemState // eslint-disable-line @typescript-eslint/no-explicit-any
            const _color = state === 'ventral_vagal' ? 'green'
                : state === 'sympathetic' ? 'orange'
                    : 'grey'
            // console.log(`%c Current State: ${state.toUpperCase()}`, `color: ${color}; font-weight: bold;`) // Commented out as per instruction
        }
        // console.groupEnd() // Commented out as per instruction
    }
}

export const dashboard = new DashboardFeed()
