"use client"

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    Grid3X3,
    Palette,
    Compass,
    CircleDot,
    Square,
    Triangle,
    Zap,
    Shield,
    AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationConfig } from '../SimulationRenderer'

type CanvasVariant = 'blueprint' | 'art' | 'navigation'

interface VisualCanvasProps {
    config: SimulationConfig
    onSuccess: (result?: any) => void
    variant?: CanvasVariant
}

// Element types for different variants
interface CanvasElement {
    id: string
    type: string
    x: number
    y: number
    connected?: string[]
    color?: string
}

/**
 * VisualCanvas - Multi-purpose visual design simulator
 *
 * Variants:
 * - blueprint: Kai's safety circuit design (drag components, connect)
 * - art: Asha's mural design (color palette, composition)
 * - navigation: Rohan's star chart (plot routes between points)
 */
export function VisualCanvas({ config, onSuccess, variant = 'blueprint' }: VisualCanvasProps) {
    // Shared state
    const [elements, setElements] = useState<CanvasElement[]>([])
    const [selectedTool, setSelectedTool] = useState<string | null>(null)
    const [selectedElement, setSelectedElement] = useState<string | null>(null)
    const [connections, setConnections] = useState<[string, string][]>([])
    const [isComplete, setIsComplete] = useState(false)
    const [score, setScore] = useState(0)

    // Variant-specific configuration
    const variantConfig = {
        blueprint: {
            icon: Grid3X3,
            title: 'BLUEPRINT EDITOR',
            tools: [
                { id: 'sensor', label: 'Sensor', icon: CircleDot, color: '#3B82F6' },
                { id: 'switch', label: 'Switch', icon: Square, color: '#60A5FA' },
                { id: 'relay', label: 'Relay', icon: Triangle, color: '#93C5FD' },
                { id: 'ground', label: 'Ground', icon: Zap, color: '#BFDBFE' },
            ],
            targetScore: 4, // Need 4 components connected properly
            color: '#3B82F6', // Blue
        },
        art: {
            icon: Palette,
            title: 'SEMANTIC CANVAS',
            tools: [
                { id: 'unity', label: 'Unity', icon: CircleDot, color: '#F59E0B' },
                { id: 'growth', label: 'Growth', icon: Triangle, color: '#10B981' },
                { id: 'heritage', label: 'Heritage', icon: Square, color: '#8B5CF6' },
                { id: 'future', label: 'Future', icon: Zap, color: '#06B6D4' },
            ],
            targetScore: 3, // Need 3 meaningful elements
            color: '#F59E0B', // Amber
        },
        navigation: {
            icon: Compass,
            title: 'STAR CHART',
            tools: [
                { id: 'waypoint', label: 'Waypoint', icon: CircleDot, color: '#8B5CF6' },
                { id: 'beacon', label: 'Beacon', icon: Triangle, color: '#A78BFA' },
                { id: 'relay', label: 'Relay', icon: Square, color: '#C4B5FD' },
            ],
            targetScore: 3, // Need 3 connected waypoints
            color: '#8B5CF6', // Purple
        }
    }

    const currentConfig = variantConfig[variant]
    const Icon = currentConfig.icon

    // Place element on canvas
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!selectedTool || isComplete) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        const newElement: CanvasElement = {
            id: `${selectedTool}-${Date.now()}`,
            type: selectedTool,
            x,
            y,
            color: currentConfig.tools.find(t => t.id === selectedTool)?.color
        }

        setElements(prev => [...prev, newElement])

        // Check score
        const newScore = elements.length + 1
        setScore(newScore)

        if (newScore >= currentConfig.targetScore) {
            checkCompletion(newScore)
        }
    }, [selectedTool, elements, currentConfig, isComplete])

    // Connect two elements (for blueprint/navigation)
    const handleElementClick = useCallback((elementId: string, e: React.MouseEvent) => {
        e.stopPropagation()

        if (variant === 'art') return // Art doesn't need connections

        if (selectedElement && selectedElement !== elementId) {
            // Create connection
            setConnections(prev => [...prev, [selectedElement, elementId]])
            setSelectedElement(null)

            // Update score
            const newScore = connections.length + 1
            if (newScore >= currentConfig.targetScore - 1) {
                checkCompletion(elements.length)
            }
        } else {
            setSelectedElement(elementId)
        }
    }, [selectedElement, variant, connections, elements, currentConfig])

    // Check if simulation is complete
    const checkCompletion = useCallback((elementCount: number) => {
        // Blueprint: Need redundant circuit (4+ components, 3+ connections)
        // Art: Need 3+ meaningful elements
        // Navigation: Need connected route (3+ waypoints, 2+ connections)

        let isValid = false

        if (variant === 'blueprint') {
            isValid = elementCount >= 4 && connections.length >= 2
        } else if (variant === 'art') {
            isValid = elementCount >= 3
        } else if (variant === 'navigation') {
            isValid = elementCount >= 3 && connections.length >= 2
        }

        if (isValid && !isComplete) {
            setIsComplete(true)
            setTimeout(() => {
                onSuccess({ elements: elementCount, connections: connections.length, variant })
            }, 1500)
        }
    }, [variant, connections, isComplete, onSuccess])

    // Get element position for connections
    const getElementPosition = (id: string) => {
        const el = elements.find(e => e.id === id)
        return el ? { x: el.x, y: el.y } : null
    }

    return (
        <div className="space-y-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5", isComplete ? "text-emerald-400" : `text-[${currentConfig.color}]`)}
                          style={{ color: isComplete ? undefined : currentConfig.color }} />
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">{currentConfig.title}</div>
                        <div className={cn("text-sm font-medium", isComplete ? "text-emerald-400" : "text-white")}>
                            {isComplete ? "DESIGN COMPLETE" : "IN PROGRESS"}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Elements</div>
                    <div className="text-xl font-mono text-white">
                        {elements.length}/{currentConfig.targetScore}
                    </div>
                </div>
            </div>

            {/* Tool Palette */}
            <div className="flex gap-2 p-2 bg-black/30 rounded-lg border border-white/5">
                {currentConfig.tools.map(tool => {
                    const ToolIcon = tool.icon
                    const isSelected = selectedTool === tool.id
                    return (
                        <button
                            key={tool.id}
                            onClick={() => setSelectedTool(isSelected ? null : tool.id)}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors",
                                isSelected
                                    ? "bg-white/20 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                            )}
                            style={{
                                borderColor: isSelected ? (tool.color || currentConfig.color) : 'transparent',
                                borderWidth: '1px'
                            }}
                        >
                            <ToolIcon className="w-4 h-4" style={{ color: tool.color || currentConfig.color }} />
                            <span className="text-[10px]">{tool.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Canvas Area */}
            <div
                className="relative h-64 bg-black/60 rounded-lg border border-white/10 overflow-hidden cursor-crosshair"
                onClick={handleCanvasClick}
            >
                {/* Grid */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full">
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 pointer-events-none">
                    {connections.map(([from, to], i) => {
                        const fromPos = getElementPosition(from)
                        const toPos = getElementPosition(to)
                        if (!fromPos || !toPos) return null
                        return (
                            <motion.line
                                key={i}
                                x1={`${fromPos.x}%`}
                                y1={`${fromPos.y}%`}
                                x2={`${toPos.x}%`}
                                y2={`${toPos.y}%`}
                                stroke={currentConfig.color}
                                strokeWidth="2"
                                strokeDasharray="4 2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        )
                    })}
                </svg>

                {/* Placed Elements */}
                {elements.map(element => {
                    const tool = currentConfig.tools.find(t => t.id === element.type)
                    const ToolIcon = tool?.icon || CircleDot
                    const isSelected = selectedElement === element.id

                    return (
                        <motion.div
                            key={element.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                                "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer",
                                isSelected ? "ring-2 ring-white" : ""
                            )}
                            style={{
                                left: `${element.x}%`,
                                top: `${element.y}%`,
                                backgroundColor: `${element.color || currentConfig.color}33`,
                                borderColor: element.color || currentConfig.color,
                                borderWidth: '2px'
                            }}
                            onClick={(e) => handleElementClick(element.id, e)}
                        >
                            <ToolIcon className="w-4 h-4" style={{ color: element.color || currentConfig.color }} />
                        </motion.div>
                    )
                })}

                {/* Instruction overlay when empty */}
                {elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
                        Select a tool and click to place
                    </div>
                )}

                {/* Success Overlay */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
                    >
                        <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle2 className="w-12 h-12 mb-2" />
                            <span className="text-lg font-bold tracking-widest">
                                {variant === 'blueprint' ? 'CIRCUIT VERIFIED' :
                                 variant === 'art' ? 'ARTWORK APPROVED' : 'ROUTE PLOTTED'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs text-white/40 px-2">
                <div className="flex items-center gap-2">
                    {variant !== 'art' && (
                        <>
                            <span>Connections: {connections.length}</span>
                            {selectedElement && (
                                <span className="text-amber-400">Click another element to connect</span>
                            )}
                        </>
                    )}
                </div>
                <div>
                    {variant === 'blueprint' && <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Redundancy Check</span>}
                    {variant === 'art' && <span className="flex items-center gap-1"><Palette className="w-3 h-3" /> Semantic Balance</span>}
                    {variant === 'navigation' && <span className="flex items-center gap-1"><Compass className="w-3 h-3" /> Route Integrity</span>}
                </div>
            </div>

            {/* Debug */}
            <button
                onClick={() => {
                    // Auto-place elements for testing
                    const testElements: CanvasElement[] = [
                        { id: 't1', type: currentConfig.tools[0].id, x: 25, y: 30, color: currentConfig.tools[0].color },
                        { id: 't2', type: currentConfig.tools[1].id, x: 50, y: 50, color: currentConfig.tools[1]?.color },
                        { id: 't3', type: currentConfig.tools[2].id, x: 75, y: 30, color: currentConfig.tools[2]?.color },
                        { id: 't4', type: currentConfig.tools[0].id, x: 50, y: 70, color: currentConfig.tools[0].color },
                    ]
                    setElements(testElements)
                    setConnections([['t1', 't2'], ['t2', 't3'], ['t3', 't4']])
                    setScore(4)
                    checkCompletion(4)
                }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center"
            >
                [DEBUG] Auto-Design
            </button>
        </div>
    )
}
