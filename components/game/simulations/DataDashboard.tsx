import { useState, useEffect, useCallback, ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    Activity,
    TrendingUp,
    AlertTriangle,
    ArrowUp,
    ArrowDown,
    Truck,
    Droplet,
    Heart,
    Thermometer
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationComponentProps, DataItem } from './types'

type DashboardVariant = 'triage' | 'market' | 'logistics' | 'analysis'

interface DataDashboardProps extends SimulationComponentProps {
    variant?: DashboardVariant
}

/**
 * DataDashboard - Real-time data analysis simulator
 *
 * Variants:
 * - triage: Marcus/Grace medical prioritization
 * - market: Elena market stabilization
 * - logistics: Isaiah supply routing
 * - analysis: Silas sensor data analysis
 */
export function DataDashboard({ config, onSuccess, variant = 'triage' }: DataDashboardProps) {
    const [items, setItems] = useState<DataItem[]>([])
    const [decisions, setDecisions] = useState<string[]>([])
    const [score, setScore] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [feedback, setFeedback] = useState<string | null>(null)
    const [usingFallbackData, setUsingFallbackData] = useState(false)

    // Initialize data based on variant or provided context
    useEffect(() => {
        if (config.initialContext?.items && Array.isArray(config.initialContext.items)) {
            setItems(config.initialContext.items as DataItem[])
            setUsingFallbackData(false)
        } else {
            const initialItems = getInitialItems(variant)
            setItems(initialItems)
            setUsingFallbackData(true)
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn('[DataDashboard] Missing initialContext.items; using variant default dataset.', { variant })
            }
        }
    }, [variant, config.initialContext])

    // Variant configuration
    const variantConfig = {
        triage: {
            title: 'TRIAGE BOARD',
            icon: Heart,
            color: '#EF4444',
            targetDecisions: 3,
            actionLabel: 'Prioritize',
            successMessage: 'QUEUE OPTIMIZED',
        },
        market: {
            title: 'MARKET ANALYSIS',
            icon: TrendingUp,
            color: '#10B981',
            targetDecisions: 2,
            actionLabel: 'Stabilize',
            successMessage: 'MARKET STABILIZED',
        },
        logistics: {
            title: 'ROUTE PLANNER',
            icon: Truck,
            color: '#F59E0B',
            targetDecisions: 2,
            actionLabel: 'Approve Route',
            successMessage: 'ROUTES OPTIMIZED',
        },
        analysis: {
            title: 'SENSOR ANALYSIS',
            icon: Thermometer,
            color: '#8B5CF6',
            targetDecisions: 2,
            actionLabel: 'Confirm',
            successMessage: 'ANALYSIS COMPLETE',
        }
    }

    const currentConfig = variantConfig[variant]
    const Icon = currentConfig.icon

    // Check win condition
    const checkCompletion = useCallback((finalScore: number, currentDecisions: string[]) => {
        // Win if player prioritized correctly (got critical items first)
        const minScore = currentConfig.targetDecisions * 2 // At least "high" priority average

        if (finalScore >= minScore && !isComplete) {
            setIsComplete(true)
            setTimeout(() => {
                onSuccess({ score: finalScore, decisions: currentDecisions, variant })
            }, 1000)
        }
    }, [currentConfig.targetDecisions, isComplete, onSuccess, variant])

    // Handle item selection/action
    const handleItemAction = useCallback((itemId: string) => {
        if (isComplete) return

        const item = items.find(i => i.id === itemId)
        if (!item) return

        if (item.priority === 'low') {
            setFeedback('Low priority - Focus on critical items')
            setTimeout(() => setFeedback(null), 1000)
            return
        }

        // Update state
        setDecisions(prev => {
            const newDecisions = [...prev, itemId];

            // Calculate point value
            const points = item.priority === 'critical' ? 3 : item.priority === 'high' ? 2 : 1
            setScore(prevScore => {
                const newScore = prevScore + points;

                // Check completion
                if (newDecisions.length >= currentConfig.targetDecisions) {
                    checkCompletion(newScore, newDecisions);
                }
                return newScore;
            });

            return newDecisions;
        });

        // Remove item from active list (or mark done)
        setItems(prev => prev.filter(i => i.id !== itemId))

        // Feedback
        if (item.priority === 'critical') {
            setFeedback('Critical case handled!')
        } else if (item.priority === 'high') {
            setFeedback('Good prioritization')
        }

        setTimeout(() => setFeedback(null), 1500)

    }, [items, isComplete, currentConfig, checkCompletion])

    // Get priority color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50'
            case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
            case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50'
        }
    }

    return (
        <div className="space-y-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" style={{ color: isComplete ? '#34d399' : currentConfig.color }} />
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs uppercase tracking-widest text-white/50">{currentConfig.title}</div>
                            {usingFallbackData && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300/80 border border-amber-500/20 uppercase tracking-widest font-mono">
                                    Sample
                                </span>
                            )}
                        </div>
                        <div className={cn("text-sm font-medium", isComplete ? "text-emerald-400" : "text-white")}>
                            {isComplete ? currentConfig.successMessage : "ACTIVE"}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Score</div>
                    <div className="text-xl font-mono text-white">{score}</div>
                </div>
            </div>

            {/* Live Metrics Bar */}
            <div className="grid grid-cols-3 gap-2">
                {variant === 'triage' && (
                    <>
                        <MetricCard label="Queue" value={items.filter(i => !i.selected).length} icon={Activity} color="#EF4444" />
                        <MetricCard label="Processed" value={decisions.length} icon={CheckCircle2} color="#10B981" />
                        <MetricCard label="Critical" value={items.filter(i => i.priority === 'critical' && !i.selected).length} icon={AlertTriangle} color="#F59E0B" />
                    </>
                )}
                {variant === 'market' && (
                    <>
                        <MetricCard label="Volatility" value="HIGH" icon={TrendingUp} color="#EF4444" />
                        <MetricCard label="Actions" value={decisions.length} icon={Activity} color="#10B981" />
                        <MetricCard label="Reserve" value="12%" icon={Droplet} color="#3B82F6" />
                    </>
                )}
                {variant === 'logistics' && (
                    <>
                        <MetricCard label="Routes" value={items.length} icon={Truck} color="#F59E0B" />
                        <MetricCard label="Approved" value={decisions.length} icon={CheckCircle2} color="#10B981" />
                        <MetricCard label="Pending" value={items.filter(i => !i.selected).length} icon={AlertTriangle} color="#EF4444" />
                    </>
                )}
                {variant === 'analysis' && (
                    <>
                        <MetricCard label="Sensors" value={items.length} icon={Thermometer} color="#8B5CF6" />
                        <MetricCard label="Verified" value={decisions.length} icon={CheckCircle2} color="#10B981" />
                        <MetricCard label="Anomalies" value={items.filter(i => i.priority === 'critical').length} icon={AlertTriangle} color="#EF4444" />
                    </>
                )}
            </div>

            {/* Data Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: item.selected ? 0.5 : 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border transition-all",
                                item.selected ? "bg-emerald-900/20 border-emerald-500/30" : "bg-black/30 border-white/10 hover:border-white/20",
                                !item.selected && "cursor-pointer"
                            )}
                            onClick={() => handleItemAction(item.id)}
                        >
                            <div className="flex items-center gap-3">
                                {/* Priority Badge */}
                                <div className={cn(
                                    "px-2 py-0.5 text-[10px] uppercase tracking-wider rounded border",
                                    getPriorityColor(item.priority)
                                )}>
                                    {item.priority}
                                </div>
                                <span className={cn("text-sm", item.selected ? "text-white/50 line-through" : "text-white")}>
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Value with trend */}
                                <span className="text-sm font-mono text-white/70">{item.value}</span>
                                {item.trend === 'up' && <ArrowUp className="w-3 h-3 text-red-400" />}
                                {item.trend === 'down' && <ArrowDown className="w-3 h-3 text-emerald-400" />}
                                {/* Action button */}
                                {!item.selected && (
                                    <button
                                        className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                                        onClick={(e) => { e.stopPropagation(); handleItemAction(item.id) }}
                                    >
                                        {currentConfig.actionLabel}
                                    </button>
                                )}
                                {item.selected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Feedback Toast */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-sm text-emerald-400 font-medium"
                    >
                        {feedback}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/50">
                    <span>Progress</span>
                    <span>{decisions.length}/{currentConfig.targetDecisions} decisions</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: currentConfig.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(decisions.length / currentConfig.targetDecisions) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Success Overlay */}
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-lg"
                >
                    <div className="flex flex-col items-center text-emerald-400">
                        <CheckCircle2 className="w-12 h-12 mb-2" />
                        <span className="text-lg font-bold tracking-widest">{currentConfig.successMessage}</span>
                    </div>
                </motion.div>
            )}

            {/* Debug */}
            <button
                onClick={() => {
                    // Auto-complete by selecting critical items
                    const criticalItems = items.filter(i => i.priority === 'critical' || i.priority === 'high')
                    criticalItems.slice(0, currentConfig.targetDecisions).forEach(item => {
                        handleItemAction(item.id)
                    })
                }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center"
            >
                [DEBUG] Auto-Triage
            </button>
        </div>
    )
}

// Metric Card Component
function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: ElementType; color: string }) {
    return (
        <div className="bg-black/30 p-2 rounded border border-white/5">
            <div className="flex items-center gap-1 text-[10px] text-white/50 mb-1">
                <Icon className="w-3 h-3" style={{ color }} />
                {label}
            </div>
            <div className="text-lg font-mono text-white">{value}</div>
        </div>
    )
}

// Generate initial items based on variant
function getInitialItems(variant: DashboardVariant): DataItem[] {
    switch (variant) {
        case 'triage':
            return [
                { id: 't1', label: 'Cardiac Arrest - Bay 3', value: 180, priority: 'critical', trend: 'up' },
                { id: 't2', label: 'Fracture - Bay 7', value: 95, priority: 'medium', trend: 'stable' },
                { id: 't3', label: 'Respiratory Distress', value: 145, priority: 'high', trend: 'up' },
                { id: 't4', label: 'Minor Laceration', value: 72, priority: 'low', trend: 'stable' },
                { id: 't5', label: 'Stroke Symptoms', value: 160, priority: 'critical', trend: 'up' },
            ]
        case 'market':
            return [
                { id: 'm1', label: 'H2O Filters', value: 420, priority: 'critical', trend: 'up' },
                { id: 'm2', label: 'Power Cells', value: 180, priority: 'high', trend: 'up' },
                { id: 'm3', label: 'Food Rations', value: 95, priority: 'medium', trend: 'stable' },
                { id: 'm4', label: 'Medical Supplies', value: 210, priority: 'high', trend: 'up' },
            ]
        case 'logistics':
            return [
                { id: 'l1', label: 'Route Alpha - Sector 9', value: 85, priority: 'critical', trend: 'down' },
                { id: 'l2', label: 'Route Beta - Central', value: 60, priority: 'medium', trend: 'stable' },
                { id: 'l3', label: 'Route Gamma - East Wing', value: 45, priority: 'high', trend: 'up' },
                { id: 'l4', label: 'Route Delta - Emergency', value: 92, priority: 'critical', trend: 'up' },
            ]
        case 'analysis':
            return [
                { id: 'a1', label: 'Moisture Sensor A7', value: 65, priority: 'medium', trend: 'stable' },
                { id: 'a2', label: 'pH Level B3', value: 4.2, priority: 'critical', trend: 'down' },
                { id: 'a3', label: 'Temperature C1', value: 28, priority: 'high', trend: 'up' },
                { id: 'a4', label: 'Nitrogen D5', value: 12, priority: 'medium', trend: 'stable' },
            ]
        default:
            return []
    }
}
