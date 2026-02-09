import type { DialogueNode } from '@/lib/dialogue-graph'
import { QUARANTINED_NODE_IDS_BY_GRAPH } from './quarantined-node-ids'

function shouldIncludeDraftContent(): boolean {
  // Draft content is excluded by default so "shipped graphs" stay clean.
  // Enable explicitly (dev-only) to inspect quarantined nodes locally.
  return process.env.NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT === 'true'
}

const DRAFT_NODE_ID_SETS: Record<string, ReadonlySet<string>> = Object.fromEntries(
  Object.entries(QUARANTINED_NODE_IDS_BY_GRAPH).map(([graphKey, ids]) => [graphKey, new Set(ids)])
)

export function filterDraftNodes(graphKey: string, nodes: readonly DialogueNode[]): DialogueNode[] {
  if (shouldIncludeDraftContent()) return [...nodes]

  const draftIds = DRAFT_NODE_ID_SETS[graphKey]
  if (!draftIds || draftIds.size === 0) return [...nodes]

  return nodes.filter((n) => !draftIds.has(n.nodeId))
}

export function buildDialogueNodesMap(graphKey: string, nodes: readonly DialogueNode[]): Map<string, DialogueNode> {
  const activeNodes = filterDraftNodes(graphKey, nodes)
  return new Map(activeNodes.map((n) => [n.nodeId, n]))
}
