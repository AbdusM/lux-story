export type SimulationType =
    | 'system_architecture'
    | 'visual_canvas'
    | 'architect_3d'
    | 'botany_grid'
    | 'dashboard_triage'
    | 'market_visualizer'
    | 'data_audit'
    | 'historical_timeline'
    | 'audio_studio'
    | 'news_feed'
    | 'chat_negotiation'
    | 'conversation_tree'
    | 'conductor_interface'
    | 'creative_direction'
    | 'data_ticker'
    | 'secure_terminal'
    | 'prompt_engineering'
    | 'code_refactor'
    | 'terminal_coding'
    | 'data_analysis'


export interface BaseSimulationContext {
    label?: string
    content?: string
    displayStyle?: 'text' | 'code' | 'visual' | 'image_placeholder'
    [key: string]: unknown
}

export interface SimulationResult {
    success?: boolean
    skipped?: boolean
    score?: number
    data?: unknown
    [key: string]: unknown
}

export interface SimulationConfig<TContext = BaseSimulationContext> {
    type: SimulationType
    title: string
    taskDescription: string
    initialContext: TContext & { [key: string]: unknown }
    successFeedback?: string
    isGodMode?: boolean
    onExit?: () => void
    mode?: 'fullscreen' | 'inline'
    inlineHeight?: string
}

export interface SimulationComponentProps<TContext = BaseSimulationContext> {
    config: SimulationConfig<TContext>
    onSuccess: (result: SimulationResult) => void
    variant?: string
}

export interface DataItem {
    id: string
    label: string
    value: number
    priority: 'critical' | 'high' | 'medium' | 'low'
    trend?: 'up' | 'down' | 'stable'
    selected?: boolean
}

// ============================================================================
// DISCRIMINATED UNION FOR SIMULATION CONTEXTS (P0 Type Safety Fix)
// ============================================================================

import { SynesthesiaTarget } from '@/lib/visualizers/synesthesia-types'
import { BotanyTarget } from '@/lib/visualizers/botany-types'

/**
 * Base context for all simulations
 */
interface BaseContext {
    label?: string
    content?: string
    displayStyle?: 'text' | 'code' | 'visual' | 'image_placeholder'
    [key: string]: unknown
}

/**
 * Context for audio_studio and news_feed (Synesthesia-based)
 */
export interface SynesthesiaContext extends BaseContext {
    target: SynesthesiaTarget
}

/**
 * Context for botany_grid
 */
export interface BotanyContext extends BaseContext {
    target: BotanyTarget
}

/**
 * Context for dashboard_triage (medical, logistics, etc.)
 */
export interface TriageContext extends BaseContext {
    items?: DataItem[]
}

/**
 * Context for visual_canvas, architect_3d
 */
export interface CanvasContext extends BaseContext {
    variant?: 'blueprint' | 'art' | 'navigation'
}

/**
 * Context for chat_negotiation, conversation_tree
 */
export interface NegotiationContext extends BaseContext {
    variant?: 'diplomacy' | 'sales' | 'therapy' | 'cognitive'
}

/**
 * Context for system_architecture
 */
export interface SystemArchitectureContext extends BaseContext {
    // Servo debugger, PID tuning
}

/**
 * Context for conductor_interface
 */
export interface ConductorContext extends BaseContext {
    // Station operations
}

/**
 * Context for secure_terminal
 */
export interface SecureTerminalContext extends BaseContext {
    // Secure operations
}

/**
 * Context for data_audit, data_ticker
 */
export interface DataContext extends BaseContext {
    // Data analysis
}

/**
 * Context for historical_timeline
 */
export interface TimelineContext extends BaseContext {
    // Historical archive
}

/**
 * Context for creative_direction (pitch decks)
 */
export interface CreativeContext extends BaseContext {
    // Pitch building
}

/**
 * Context for market_visualizer
 */
export interface MarketContext extends BaseContext {
    // Market flow
}

/**
 * Discriminated union of all simulation default contexts
 */
export type SimulationDefaultContext = {
    taskDescription: string
    successFeedback: string
    initialContext:
    | (BaseContext & { type?: 'system_architecture' })
    | (SynesthesiaContext & { type?: 'audio_studio' | 'news_feed' })
    | (BotanyContext & { type?: 'botany_grid' })
    | (TriageContext & { type?: 'dashboard_triage' })
    | (CanvasContext & { type?: 'visual_canvas' | 'architect_3d' })
    | (NegotiationContext & { type?: 'chat_negotiation' | 'conversation_tree' })
    | (ConductorContext & { type?: 'conductor_interface' })
    | (SecureTerminalContext & { type?: 'secure_terminal' })
    | (DataContext & { type?: 'data_audit' | 'data_ticker' })
    | (TimelineContext & { type?: 'historical_timeline' })
    | (CreativeContext & { type?: 'creative_direction' })
    | (MarketContext & { type?: 'market_visualizer' })
}
