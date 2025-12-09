
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
  // ============= BUILDING PATTERN THOUGHTS =============
  'industrial-legacy': {
    id: 'industrial-legacy',
    title: 'The Weight of Iron',
    description: 'Birmingham\'s steel history isn\'t just dust; it\'s the foundation. You are starting to see strength in the old structures.',
    iconName: 'Hammer',
    color: 'amber',
    maxProgress: 100
  },
  'hands-on-truth': {
    id: 'hands-on-truth',
    title: 'Hands-On Truth',
    description: 'Theory only takes you so far. Real understanding comes from touching, building, failing, and trying again.',
    iconName: 'Hammer',
    color: 'amber',
    maxProgress: 100
  },
  'maker-mindset': {
    id: 'maker-mindset',
    title: 'The Maker\'s Mindset',
    description: 'Every problem is a project waiting to be built. You find yourself mentally sketching solutions before others finish describing issues.',
    iconName: 'Hammer',
    color: 'amber',
    maxProgress: 100
  },

  // ============= EXPLORING PATTERN THOUGHTS =============
  'green-frontier': {
    id: 'green-frontier',
    title: 'The Green Frontier',
    description: 'Nature is reclaiming the city. You notice how life finds a way through the concrete cracks.',
    iconName: 'Leaf',
    color: 'emerald',
    maxProgress: 100
  },
  'curious-wanderer': {
    id: 'curious-wanderer',
    title: 'The Curious Wanderer',
    description: 'Not all who wander are lost. Some are just gathering data. You\'ve started seeing dead ends as detours, not defeats.',
    iconName: 'Leaf',
    color: 'emerald',
    maxProgress: 100
  },
  'hidden-connections': {
    id: 'hidden-connections',
    title: 'Hidden Connections',
    description: 'The world is full of invisible threads. You\'ve begun noticing how seemingly unrelated things connect in unexpected ways.',
    iconName: 'Leaf',
    color: 'emerald',
    maxProgress: 100
  },

  // ============= ANALYTICAL PATTERN THOUGHTS =============
  'analytical-eye': {
    id: 'analytical-eye',
    title: 'Analytical Eye',
    description: 'You are beginning to deconstruct the world around you, seeking patterns in the chaos.',
    iconName: 'Zap',
    color: 'blue',
    maxProgress: 100
  },
  'pattern-seeker': {
    id: 'pattern-seeker',
    title: 'Pattern Seeker',
    description: 'Where others see noise, you see signal. The world reveals its structure to those who look closely enough.',
    iconName: 'Brain',
    color: 'blue',
    maxProgress: 100
  },
  'question-everything': {
    id: 'question-everything',
    title: 'Question Everything',
    description: 'The first answer is rarely the right one. You\'ve learned to dig deeper, ask "why" one more time.',
    iconName: 'Brain',
    color: 'blue',
    maxProgress: 100
  },

  // ============= HELPING PATTERN THOUGHTS =============
  'community-heart': {
    id: 'community-heart',
    title: 'Community Heart',
    description: 'Success isn\'t solitary. You feel the invisible threads connecting every person in the station.',
    iconName: 'Heart',
    color: 'rose',
    maxProgress: 100
  },
  'empathy-bridge': {
    id: 'empathy-bridge',
    title: 'The Empathy Bridge',
    description: 'Understanding someone else\'s struggle isn\'t weakness. it\'s the first step to making real change.',
    iconName: 'Heart',
    color: 'rose',
    maxProgress: 100
  },
  'collective-strength': {
    id: 'collective-strength',
    title: 'Collective Strength',
    description: 'One person can spark change. Many people can sustain it. You\'re beginning to see leadership as lifting others up.',
    iconName: 'Heart',
    color: 'rose',
    maxProgress: 100
  },

  // ============= PATIENCE PATTERN THOUGHTS =============
  'long-game': {
    id: 'long-game',
    title: 'The Long Game',
    description: 'Some things can\'t be rushed. You\'re learning that the best outcomes often require the most patience.',
    iconName: 'Shield',
    color: 'purple',
    maxProgress: 100
  },
  'steady-hand': {
    id: 'steady-hand',
    title: 'Steady Hand',
    description: 'Panic solves nothing. You\'ve started finding calm in moments that used to feel urgent.',
    iconName: 'Shield',
    color: 'purple',
    maxProgress: 100
  },
  'trust-process': {
    id: 'trust-process',
    title: 'Trust the Process',
    description: 'Growth is invisible until it isn\'t. You\'re learning to trust that today\'s effort becomes tomorrow\'s capability.',
    iconName: 'Shield',
    color: 'purple',
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
