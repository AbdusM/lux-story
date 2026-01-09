"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    Terminal,
    Search,
    Database,
    Book,
    AlertTriangle,
    ChevronRight,
    Lock,
    Unlock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationConfig } from '../SimulationRenderer'

type TerminalVariant = 'audit' | 'archive' | 'query'

interface SecureTerminalProps {
    config: SimulationConfig
    onSuccess: (result?: any) => void
    variant?: TerminalVariant
}

interface LogEntry {
    id: string
    timestamp: string
    content: string
    type: 'info' | 'warning' | 'error' | 'success' | 'query'
    anomaly?: boolean
}

interface QueryOption {
    id: string
    label: string
    query: string
    result: string
    revealsAnomaly?: boolean
}

/**
 * SecureTerminal - Code/Query interface simulator
 *
 * Variants:
 * - audit: Zara's dataset anomaly detection
 * - archive: Yaquin's historical research
 * - query: Elena's search refinement
 */
export function SecureTerminal({ config, onSuccess, variant = 'audit' }: SecureTerminalProps) {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [queryOptions, setQueryOptions] = useState<QueryOption[]>([])
    const [selectedQueries, setSelectedQueries] = useState<string[]>([])
    const [anomaliesFound, setAnomaliesFound] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [currentQuery, setCurrentQuery] = useState('')
    const logEndRef = useRef<HTMLDivElement>(null)

    // Variant configuration
    const variantConfig = {
        audit: {
            title: 'DATA AUDIT TERMINAL',
            icon: Database,
            color: '#8B5CF6',
            targetAnomalies: 2,
            prompt: 'audit>',
            successMessage: 'ANOMALIES ISOLATED',
        },
        archive: {
            title: 'ARCHIVE TERMINAL',
            icon: Book,
            color: '#F59E0B',
            targetAnomalies: 2,
            prompt: 'archive>',
            successMessage: 'RECORDS VERIFIED',
        },
        query: {
            title: 'SEARCH TERMINAL',
            icon: Search,
            color: '#10B981',
            targetAnomalies: 2,
            prompt: 'search>',
            successMessage: 'QUERY OPTIMIZED',
        }
    }

    const currentConfig = variantConfig[variant]
    const Icon = currentConfig.icon

    // Initialize
    useEffect(() => {
        const initialLogs = getInitialLogs(variant)
        const options = getQueryOptions(variant)
        setLogs(initialLogs)
        setQueryOptions(options)

        // Simulated typing effect for initial log
        setTimeout(() => {
            addLog({
                id: 'init',
                timestamp: new Date().toISOString().slice(11, 19),
                content: 'System ready. Select query to investigate.',
                type: 'info'
            })
        }, 500)
    }, [variant])

    // Auto-scroll to bottom
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    // Add log entry with typing effect
    const addLog = useCallback((entry: LogEntry) => {
        setIsTyping(true)
        setCurrentQuery(entry.content)

        setTimeout(() => {
            setLogs(prev => [...prev, entry])
            setIsTyping(false)
            setCurrentQuery('')
        }, 300 + entry.content.length * 10)
    }, [])

    // Execute a query
    const executeQuery = useCallback((queryId: string) => {
        const query = queryOptions.find(q => q.id === queryId)
        if (!query || selectedQueries.includes(queryId) || isComplete) return

        setSelectedQueries(prev => [...prev, queryId])

        // Add query log
        addLog({
            id: `q-${queryId}`,
            timestamp: new Date().toISOString().slice(11, 19),
            content: `> ${query.query}`,
            type: 'query'
        })

        // Add result after delay
        setTimeout(() => {
            addLog({
                id: `r-${queryId}`,
                timestamp: new Date().toISOString().slice(11, 19),
                content: query.result,
                type: query.revealsAnomaly ? 'warning' : 'info',
                anomaly: query.revealsAnomaly
            })

            if (query.revealsAnomaly) {
                const newCount = anomaliesFound + 1
                setAnomaliesFound(newCount)

                // Check completion
                if (newCount >= currentConfig.targetAnomalies) {
                    setTimeout(() => {
                        addLog({
                            id: 'complete',
                            timestamp: new Date().toISOString().slice(11, 19),
                            content: `[SUCCESS] ${currentConfig.successMessage}`,
                            type: 'success'
                        })
                        setIsComplete(true)
                        setTimeout(() => {
                            onSuccess({ anomaliesFound: newCount, queriesRun: selectedQueries.length + 1, variant })
                        }, 1500)
                    }, 500)
                }
            }
        }, 800)
    }, [queryOptions, selectedQueries, anomaliesFound, isComplete, currentConfig, addLog, onSuccess, variant])

    // Get log entry color
    const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'error': return 'text-red-400'
            case 'warning': return 'text-amber-400'
            case 'success': return 'text-emerald-400'
            case 'query': return 'text-cyan-400'
            default: return 'text-slate-400'
        }
    }

    return (
        <div className="space-y-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" style={{ color: isComplete ? '#34d399' : currentConfig.color }} />
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">{currentConfig.title}</div>
                        <div className={cn("text-sm font-medium", isComplete ? "text-emerald-400" : "text-white")}>
                            {isComplete ? currentConfig.successMessage : "SEARCHING..."}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-xs uppercase tracking-widest text-white/50">Anomalies</div>
                        <div className="text-xl font-mono text-white">{anomaliesFound}/{currentConfig.targetAnomalies}</div>
                    </div>
                    {isComplete ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
                </div>
            </div>

            {/* Terminal Output */}
            <div className="bg-black rounded-lg border border-white/10 font-mono text-xs overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border-b border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-white/30">{currentConfig.prompt}</span>
                </div>

                {/* Log Output */}
                <div className="p-3 h-40 overflow-y-auto space-y-1">
                    {logs.map((log, i) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn("flex gap-2", getLogColor(log.type))}
                        >
                            <span className="text-slate-600">[{log.timestamp}]</span>
                            <span className={log.anomaly ? 'font-bold' : ''}>
                                {log.anomaly && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                                {log.content}
                            </span>
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex gap-2 text-cyan-400">
                            <span className="text-slate-600">[--:--:--]</span>
                            <span>{currentQuery}<span className="animate-pulse">_</span></span>
                        </div>
                    )}

                    <div ref={logEndRef} />
                </div>
            </div>

            {/* Query Options */}
            <div className="space-y-2">
                <div className="text-xs text-white/50 uppercase tracking-wider">Available Queries</div>
                <div className="grid gap-2">
                    {queryOptions.map(query => {
                        const isSelected = selectedQueries.includes(query.id)
                        return (
                            <motion.button
                                key={query.id}
                                onClick={() => executeQuery(query.id)}
                                disabled={isSelected || isComplete || isTyping}
                                className={cn(
                                    "flex items-center gap-2 p-2 rounded border text-left text-sm transition-all",
                                    isSelected
                                        ? "bg-slate-800/50 border-slate-700 text-slate-500"
                                        : "bg-black/30 border-white/10 text-white hover:border-white/30 hover:bg-black/50"
                                )}
                                whileHover={!isSelected ? { x: 4 } : {}}
                                whileTap={!isSelected ? { scale: 0.98 } : {}}
                            >
                                <ChevronRight className={cn("w-4 h-4", isSelected ? "text-emerald-500" : "text-white/30")} />
                                <div className="flex-1">
                                    <div className="font-medium">{query.label}</div>
                                    <div className="text-xs text-white/40 font-mono">{query.query}</div>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Debug */}
            <button
                onClick={() => {
                    const anomalyQueries = queryOptions.filter(q => q.revealsAnomaly)
                    anomalyQueries.slice(0, currentConfig.targetAnomalies).forEach((q, i) => {
                        setTimeout(() => executeQuery(q.id), i * 1500)
                    })
                }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center"
            >
                [DEBUG] Auto-Query
            </button>
        </div>
    )
}

// Initial log entries
function getInitialLogs(variant: TerminalVariant): LogEntry[] {
    const timestamp = new Date().toISOString().slice(11, 19)
    switch (variant) {
        case 'audit':
            return [
                { id: 'l1', timestamp, content: 'Connecting to DATABASE: H2O_USAGE_Q3', type: 'info' },
                { id: 'l2', timestamp, content: 'Loaded 50,000 rows. 12 flagged entries.', type: 'warning' },
            ]
        case 'archive':
            return [
                { id: 'l1', timestamp, content: 'Accessing ARCHIVE: Historical Records', type: 'info' },
                { id: 'l2', timestamp, content: 'Cross-referencing: "Great Blackout" event', type: 'info' },
                { id: 'l3', timestamp, content: 'Conflicting dates detected.', type: 'warning' },
            ]
        case 'query':
            return [
                { id: 'l1', timestamp, content: 'Search index loaded.', type: 'info' },
                { id: 'l2', timestamp, content: 'Ready for query refinement.', type: 'info' },
            ]
        default:
            return []
    }
}

// Query options per variant
function getQueryOptions(variant: TerminalVariant): QueryOption[] {
    switch (variant) {
        case 'audit':
            return [
                { id: 'q1', label: 'Check timestamps', query: 'SELECT * WHERE timestamp IS NULL', result: '3 entries with null timestamps found.', revealsAnomaly: false },
                { id: 'q2', label: 'Find duplicates', query: 'SELECT * GROUP BY meter_id HAVING COUNT > 1', result: 'ANOMALY: Meter ID 7734 appears 47 times on same hour.', revealsAnomaly: true },
                { id: 'q3', label: 'Compare sectors', query: 'SELECT SUM(usage) GROUP BY sector', result: 'ANOMALY: Zone 3 usage 340% above average.', revealsAnomaly: true },
                { id: 'q4', label: 'Check negatives', query: 'SELECT * WHERE usage < 0', result: 'No negative values found.', revealsAnomaly: false },
            ]
        case 'archive':
            return [
                { id: 'q1', label: 'Check Source A', query: 'VERIFY source="Official Records" date="2042"', result: 'Source A: Government report dated 2042. Status: CERTIFIED.', revealsAnomaly: false },
                { id: 'q2', label: 'Check Source B', query: 'VERIFY source="Maintenance Logs" date="2045"', result: 'Source B: Maintenance log entry. Status: UNVERIFIED.', revealsAnomaly: false },
                { id: 'q3', label: 'Cross-reference logs', query: 'CORRELATE maintenance_logs WITH power_grid', result: 'ANOMALY: Maintenance log backdated. Original timestamp: 2042.', revealsAnomaly: true },
                { id: 'q4', label: 'Check editor history', query: 'SELECT edit_history WHERE doc="Source B"', result: 'ANOMALY: Entry modified 3 years after creation by ADMIN_OVERRIDE.', revealsAnomaly: true },
            ]
        case 'query':
            return [
                { id: 'q1', label: 'Broad search', query: 'SEARCH "water filter" LIMIT 100', result: 'Found 2,340 results. Too broad.', revealsAnomaly: false },
                { id: 'q2', label: 'Add date filter', query: 'SEARCH "water filter" WHERE date > 2025', result: 'Narrowed to 890 results.', revealsAnomaly: false },
                { id: 'q3', label: 'Add location', query: 'SEARCH "water filter" WHERE sector="Residential"', result: 'MATCH: 12 relevant results found.', revealsAnomaly: true },
                { id: 'q4', label: 'Check price spikes', query: 'ANALYZE price_history WHERE change > 200%', result: 'PATTERN: Spike correlates with supply shipment delays.', revealsAnomaly: true },
            ]
        default:
            return []
    }
}
