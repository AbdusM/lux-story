import type { PrismTabId } from '@/lib/prism-tabs'

export type OutcomeItemKind = 'trust' | 'orb' | 'unlock' | 'info'

export type OutcomeItem = {
  kind: OutcomeItemKind
  title: string
  detail?: string
  prismTab?: PrismTabId
}

export type OutcomeCardData = {
  // Used as a stable React key; regenerated per choice.
  id: string
  items: OutcomeItem[]
}

