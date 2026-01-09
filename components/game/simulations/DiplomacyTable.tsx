import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    Users,
    Network,
    Train,
    ArrowRight,
    Zap,
    Shield,
    MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationComponentProps } from './types'

type DiplomacyVariant = 'negotiation' | 'cognitive' | 'operations'

interface DiplomacyTableProps extends SimulationComponentProps {
    variant?: DiplomacyVariant
}

// Relationship node
interface RelationNode {
    id: string
    label: string
    type: 'person' | 'concept' | 'action'
    x: number
    y: number
    influence: number // 0-100
    active?: boolean
}

// Connection between nodes
interface Connection {
    from: string
    to: string
    strength: 'strong' | 'weak' | 'broken'
    label?: string
}

// Dialogue option
interface DialogueOption {
    id: string
    text: string
    targetNode: string
    effect: 'strengthen' | 'repair' | 'influence'
    points: number
}

/**
 * DiplomacyTable - Relationship and influence simulator
 *
 * Variants:
 * - negotiation: Alex's persuasion/diplomacy
 * - cognitive: Devon's family dynamics mapping
 * - operations: Samuel's station control
 */
export function DiplomacyTable({ onSuccess, variant = 'negotiation' }: DiplomacyTableProps) {
    const [nodes, setNodes] = useState<RelationNode[]>(() => getInitialNodes(variant))
    const [connections, setConnections] = useState<Connection[]>(() => getInitialConnections(variant))
    const [dialogueOptions, _setDialogueOptions] = useState<DialogueOption[]>(() => getDialogueOptions(variant))
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [influence, setInfluence] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [feedback, setFeedback] = useState<string | null>(null)

    // Variant configuration
    const variantConfig = {
        negotiation: {
            title: 'DIPLOMACY TABLE',
            icon: Users,
            color: '#3B82F6',
            targetInfluence: 60,
            successMessage: 'AGREEMENT REACHED',
        },
        cognitive: {
            title: 'COGNITIVE WEB',
            icon: Network,
            color: '#8B5CF6',
            targetInfluence: 60,
            successMessage: 'CONNECTION RESTORED',
        },
        operations: {
            title: 'OPERATIONS CENTER',
            icon: Train,
            color: '#F59E0B',
            targetInfluence: 60,
            successMessage: 'OVERRIDE COMPLETE',
        }
    }

    const currentConfig = variantConfig[variant]
    const Icon = currentConfig.icon

    // Handle dialogue selection
    const selectDialogue = useCallback((optionId: string) => {
        if (isComplete || selectedOptions.includes(optionId)) return

        const option = dialogueOptions.find(o => o.id === optionId)
        if (!option) return

        setSelectedOptions(prev => [...prev, optionId])

        // Apply effect to target node
        setNodes(prev => prev.map(node => {
            if (node.id === option.targetNode) {
                return { ...node, influence: Math.min(100, node.influence + option.points), active: true }
            }
            return node
        }))

        // Update connections if repairing
        if (option.effect === 'repair') {
            setConnections(prev => prev.map(conn => {
                if (conn.to === option.targetNode || conn.from === option.targetNode) {
                    return { ...conn, strength: conn.strength === 'broken' ? 'weak' : 'strong' }
                }
                return conn
            }))
        }

        // Update influence
        const newInfluence = influence + option.points
        setInfluence(newInfluence)

        // Feedback
        if (option.points >= 20) {
            setFeedback('Significant progress!')
        } else if (option.points >= 10) {
            setFeedback('Making headway...')
        }
        setTimeout(() => setFeedback(null), 1500)

        // Check completion
        if (newInfluence >= currentConfig.targetInfluence && !isComplete) {
            setIsComplete(true)
            setTimeout(() => {
                onSuccess({ influence: newInfluence, actionsUsed: selectedOptions.length + 1, variant })
            }, 1500)
        }
    }, [dialogueOptions, selectedOptions, influence, isComplete, currentConfig, onSuccess, variant])

    // Get connection line color
    const getConnectionColor = (strength: Connection['strength']) => {
        switch (strength) {
            case 'strong': return '#34d399'
            case 'weak': return '#fbbf24'
            case 'broken': return '#ef4444'
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
                            {isComplete ? currentConfig.successMessage : "IN PROGRESS"}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Influence</div>
                    <div className="text-xl font-mono text-white">{influence}%</div>
                </div>
            </div>

            {/* Relationship Graph */}
            <div className="relative h-48 bg-black/60 rounded-lg border border-white/10 overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full">
                        <defs>
                            <pattern id="diplo-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                                <circle cx="15" cy="15" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#diplo-grid)" />
                    </svg>
                </div>

                {/* Connection lines */}
                <svg className="absolute inset-0">
                    {connections.map((conn, i) => {
                        const fromNode = nodes.find(n => n.id === conn.from)
                        const toNode = nodes.find(n => n.id === conn.to)
                        if (!fromNode || !toNode) return null

                        return (
                            <g key={i}>
                                <motion.line
                                    x1={`${fromNode.x}%`}
                                    y1={`${fromNode.y}%`}
                                    x2={`${toNode.x}%`}
                                    y2={`${toNode.y}%`}
                                    stroke={getConnectionColor(conn.strength)}
                                    strokeWidth={conn.strength === 'strong' ? 3 : conn.strength === 'weak' ? 2 : 1}
                                    strokeDasharray={conn.strength === 'broken' ? '5 5' : undefined}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                {conn.label && (
                                    <text
                                        x={`${(fromNode.x + toNode.x) / 2}%`}
                                        y={`${(fromNode.y + toNode.y) / 2 - 2}%`}
                                        textAnchor="middle"
                                        className="text-[8px] fill-white/40"
                                    >
                                        {conn.label}
                                    </text>
                                )}
                            </g>
                        )
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map(node => {
                    const NodeIcon = node.type === 'person' ? Users :
                        node.type === 'action' ? Zap : Shield
                    return (
                        <motion.div
                            key={node.id}
                            className={cn(
                                "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1",
                                node.active && "z-10"
                            )}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {/* Node circle */}
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                    node.active ? "bg-emerald-500/30 border-emerald-400" : "bg-slate-800/50 border-slate-600"
                                )}
                                style={{
                                    boxShadow: node.active ? `0 0 20px ${currentConfig.color}40` : undefined
                                }}
                            >
                                <NodeIcon className="w-4 h-4 text-white" />
                            </div>
                            {/* Label */}
                            <div className="text-[10px] text-white/70 text-center max-w-[60px] truncate">
                                {node.label}
                            </div>
                            {/* Influence bar */}
                            <div className="w-12 h-1 bg-black/50 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: currentConfig.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${node.influence}%` }}
                                />
                            </div>
                        </motion.div>
                    )
                })}

                {/* Success Overlay */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                    >
                        <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle2 className="w-12 h-12 mb-2" />
                            <span className="text-lg font-bold tracking-widest">{currentConfig.successMessage}</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-sm text-amber-400"
                    >
                        {feedback}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialogue Options */}
            <div className="space-y-2">
                <div className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    Choose your approach
                </div>
                <div className="space-y-2">
                    {dialogueOptions.map(option => {
                        const isSelected = selectedOptions.includes(option.id)
                        return (
                            <motion.button
                                key={option.id}
                                onClick={() => selectDialogue(option.id)}
                                disabled={isSelected || isComplete}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                                    isSelected
                                        ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-400"
                                        : "bg-black/30 border-white/10 text-white hover:border-white/30"
                                )}
                                whileHover={!isSelected ? { x: 4 } : {}}
                            >
                                <ArrowRight className={cn("w-4 h-4", isSelected ? "text-emerald-400" : "text-white/30")} />
                                <span className="flex-1 text-sm">{option.text}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/50">
                    <span>Progress</span>
                    <span>{influence}% / {currentConfig.targetInfluence}% needed</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: currentConfig.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(influence / currentConfig.targetInfluence) * 100}%` }}
                    />
                </div>
            </div>

            {/* Debug */}
            <button
                onClick={() => {
                    dialogueOptions.forEach((opt, i) => {
                        setTimeout(() => selectDialogue(opt.id), i * 500)
                    })
                }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center"
            >
                [DEBUG] Auto-Negotiate
            </button>
        </div>
    )
}

// Initial nodes per variant
function getInitialNodes(variant: DiplomacyVariant): RelationNode[] {
    switch (variant) {
        case 'negotiation':
            return [
                { id: 'you', label: 'You', type: 'person', x: 20, y: 50, influence: 50 },
                { id: 'director', label: 'Director', type: 'person', x: 80, y: 50, influence: 20 },
                { id: 'data', label: 'Evidence', type: 'concept', x: 50, y: 25, influence: 0 },
                { id: 'students', label: 'Students', type: 'concept', x: 50, y: 75, influence: 30 },
            ]
        case 'cognitive':
            return [
                { id: 'father', label: 'Father', type: 'person', x: 25, y: 40, influence: 30 },
                { id: 'son', label: 'Son', type: 'person', x: 75, y: 40, influence: 30 },
                { id: 'emotion', label: 'Validate', type: 'action', x: 50, y: 25, influence: 0 },
                { id: 'context', label: 'Context', type: 'concept', x: 50, y: 75, influence: 20 },
            ]
        case 'operations':
            return [
                { id: 'control', label: 'Control', type: 'concept', x: 50, y: 25, influence: 80 },
                { id: 'block4', label: 'Block 4', type: 'action', x: 25, y: 60, influence: 0 },
                { id: 'express', label: 'Express', type: 'action', x: 75, y: 60, influence: 0 },
                { id: 'auth', label: 'Auth', type: 'concept', x: 50, y: 85, influence: 50 },
            ]
        default:
            return []
    }
}

// Initial connections per variant
function getInitialConnections(variant: DiplomacyVariant): Connection[] {
    switch (variant) {
        case 'negotiation':
            return [
                { from: 'you', to: 'director', strength: 'weak', label: 'rapport' },
                { from: 'you', to: 'data', strength: 'strong' },
                { from: 'director', to: 'students', strength: 'broken' },
                { from: 'data', to: 'director', strength: 'weak' },
            ]
        case 'cognitive':
            return [
                { from: 'father', to: 'son', strength: 'broken', label: 'trust' },
                { from: 'father', to: 'emotion', strength: 'weak' },
                { from: 'son', to: 'emotion', strength: 'weak' },
                { from: 'context', to: 'father', strength: 'strong' },
                { from: 'context', to: 'son', strength: 'strong' },
            ]
        case 'operations':
            return [
                { from: 'control', to: 'block4', strength: 'strong' },
                { from: 'control', to: 'express', strength: 'broken' },
                { from: 'auth', to: 'control', strength: 'weak' },
                { from: 'block4', to: 'express', strength: 'broken' },
            ]
        default:
            return []
    }
}

// Dialogue options per variant
function getDialogueOptions(variant: DiplomacyVariant): DialogueOption[] {
    switch (variant) {
        case 'negotiation':
            return [
                { id: 'd1', text: '"The placement rate measures employment, not success."', targetNode: 'director', effect: 'influence', points: 20 },
                { id: 'd2', text: '"Let me show you the 6-month retention data."', targetNode: 'data', effect: 'strengthen', points: 25 },
                { id: 'd3', text: '"Students are reaching out for help after graduating."', targetNode: 'students', effect: 'repair', points: 20 },
            ]
        case 'cognitive':
            return [
                { id: 'd1', text: '"What did you hear him say just now?"', targetNode: 'emotion', effect: 'strengthen', points: 25 },
                { id: 'd2', text: '"Can you describe what that felt like?"', targetNode: 'father', effect: 'influence', points: 20 },
                { id: 'd3', text: '"What would it mean if he understood?"', targetNode: 'son', effect: 'repair', points: 20 },
            ]
        case 'operations':
            return [
                { id: 'd1', text: 'INITIATE override_protocol --level=emergency', targetNode: 'auth', effect: 'strengthen', points: 20 },
                { id: 'd2', text: 'UNLOCK block_4 --reason="medical_evac"', targetNode: 'block4', effect: 'repair', points: 25 },
                { id: 'd3', text: 'ROUTE express_line --priority=1', targetNode: 'express', effect: 'repair', points: 20 },
            ]
        default:
            return []
    }
}
