import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationComponentProps, DataItem } from '../types'

export function DataTicker({ config, onSuccess }: SimulationComponentProps) {
    const [items, setItems] = useState<DataItem[]>([])
    const [stabilizedCount, setStabilizedCount] = useState(0)
    const TARGET_COUNT = 3
    const [missingFeed, setMissingFeed] = useState(false)

    function normalizeItems(raw: unknown): DataItem[] {
        if (!Array.isArray(raw)) return []

        const normalized: DataItem[] = []
        for (const maybe of raw) {
            if (!maybe || typeof maybe !== 'object') continue
            const item = maybe as Partial<DataItem>
            if (!item.id || !item.label || typeof item.value !== 'number') continue

            const priority = item.priority
            const safePriority: DataItem['priority'] =
                priority === 'critical' || priority === 'high' || priority === 'medium' || priority === 'low'
                    ? priority
                    : 'medium'

            const trend = item.trend
            const safeTrend: DataItem['trend'] =
                trend === 'up' || trend === 'down' || trend === 'stable' ? trend : undefined

            normalized.push({
                id: String(item.id),
                label: String(item.label),
                value: item.value,
                priority: safePriority,
                trend: safeTrend,
                selected: Boolean(item.selected),
            })
        }

        return normalized
    }

    // Initialize data from config (preferred). Avoid random "mock" streams in production UX.
    useEffect(() => {
        let loadedItems: DataItem[] = []

        // Preferred: structured items array in initialContext
        loadedItems = normalizeItems((config.initialContext as { items?: unknown } | undefined)?.items)

        // Backward compatibility: parse JSON array from initialContext.content if present
        if (config.initialContext?.content) {
            try {
                const parsed = JSON.parse(config.initialContext.content)
                const parsedItems = normalizeItems(parsed)
                if (loadedItems.length === 0 && parsedItems.length > 0) loadedItems = parsedItems
            } catch (_e) {
                // Not JSON, ignore.
            }
        }

        if (loadedItems.length === 0) {
            setMissingFeed(true)
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn('[DataTicker] Missing initialContext.items; bypass enabled (no synthetic data).')
            }
        } else {
            setMissingFeed(false)
        }

        setItems(loadedItems)
    }, [config.initialContext])

    const handleStabilize = (id: string) => {
        if (stabilizedCount >= TARGET_COUNT) return

        setItems(prev => prev.map(item => {
            if (item.id === id && !item.selected) {
                // Stabilize this item
                const newCount = stabilizedCount + 1
                setStabilizedCount(newCount)

                // Check if complete
                if (newCount >= TARGET_COUNT) {
                    setTimeout(() => {
                        onSuccess({ success: true, score: 100 })
                    }, 500)
                }

                return { ...item, selected: true, value: 50, trend: 'stable' }
            }
            return item
        }))
    }

    return (
        <div className="flex flex-col h-full bg-slate-950/50 relative">
            {missingFeed && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-6 text-center bg-slate-950/70 backdrop-blur-sm">
                    <div className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                        Feed Unavailable
                    </div>
                    <div className="text-sm text-slate-200">
                        This simulation is missing `initialContext.items`.
                    </div>
                    <button
                        type="button"
                        onClick={() => onSuccess({ skipped: true })}
                        className="px-4 py-2 rounded-md border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition-colors text-sm font-medium"
                    >
                        Bypass
                    </button>
                </div>
            )}

            {/* Ticker Content */}
            <div className="flex-1 flex items-center overflow-x-auto no-scrollbar px-4 gap-4">
                {items.map((item) => (
                    <motion.button
                        key={item.id}
                        onClick={() => handleStabilize(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "flex-shrink-0 w-32 h-24 rounded-md border p-3 flex flex-col justify-between transition-colors",
                            item.selected
                                ? "bg-emerald-950/40 border-emerald-500/50"
                                : "bg-slate-900/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800/80"
                        )}
                        disabled={item.selected}
                    >
                        <div className="w-full flex justify-between items-start">
                            <span className={cn("text-[10px] font-mono tracking-wider", item.selected ? "text-emerald-400" : "text-slate-400")}>
                                {item.label}
                            </span>
                            {item.selected ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                                <Activity className="w-3 h-3 text-slate-500" />
                            )}
                        </div>

                        <div className="flex items-end gap-2">
                            <span className={cn("text-2xl font-bold font-mono", item.selected ? "text-emerald-300" : "text-slate-200")}>
                                {item.value}%
                            </span>
                            {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-rose-400 mb-1" />}
                            {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-amber-400 mb-1" />}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Minimal Footer / Progress */}
            <div className="h-6 bg-black/20 flex items-center justify-between px-3 border-t border-white/5">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                    Stabilize Signals
                </span>
                <div className="flex items-center gap-1">
                    {Array.from({ length: TARGET_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                i < stabilizedCount ? "bg-emerald-500" : "bg-slate-700"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
