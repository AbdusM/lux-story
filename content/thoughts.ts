
import { LucideIcon, Brain, Leaf, Hammer, Shield, Zap, Heart } from "lucide-react"

export type ThoughtStatus = 'developing' | 'internalized' | 'discarded'

export interface ThoughtDefinition {
  id: string
  title: string
  description: string
  iconName: 'Brain' | 'Leaf' | 'Hammer' | 'Shield' | 'Zap' | 'Heart'
  color: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'slate'
  maxProgress: number // Usually 100
}

export interface ActiveThought extends ThoughtDefinition {
  status: ThoughtStatus
  progress: number
  addedAt: number // Timestamp
  lastUpdated: number // Timestamp
}

export const THOUGHT_REGISTRY: Record<string, ThoughtDefinition> = {
  'industrial-legacy': {
    id: 'industrial-legacy',
    title: 'The Weight of Iron',
    description: 'Birmingham\'s steel history isn\'t just dust; it\'s the foundation. You are starting to see strength in the old structures.',
    iconName: 'Hammer',
    color: 'amber',
    maxProgress: 100
  },
  'green-frontier': {
    id: 'green-frontier',
    title: 'The Green Frontier',
    description: 'Nature is reclaiming the city. You notice how life finds a way through the concrete cracks.',
    iconName: 'Leaf',
    color: 'emerald',
    maxProgress: 100
  },
  'analytical-eye': {
    id: 'analytical-eye',
    title: 'Analytical Eye',
    description: 'You are beginning to deconstruct the world around you, seeking patterns in the chaos.',
    iconName: 'Zap',
    color: 'blue',
    maxProgress: 100
  },
  'community-heart': {
    id: 'community-heart',
    title: 'Community Heart',
    description: 'Success isn\'t solitary. You feel the invisible threads connecting every person in the station.',
    iconName: 'Heart',
    color: 'rose',
    maxProgress: 100
  }
}

// Helper to get icon component
export const getThoughtIcon = (name: string) => {
  switch (name) {
    case 'Brain': return Brain
    case 'Leaf': return Leaf
    case 'Hammer': return Hammer
    case 'Shield': return Shield
    case 'Zap': return Zap
    case 'Heart': return Heart
    default: return Brain
  }
}
