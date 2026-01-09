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


export interface BaseSimulationContext {
    label?: string
    content?: string
    displayStyle?: 'text' | 'code' | 'visual'
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
    type: string // Kept as string to allow flexibility, but ideally SimulationType
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
