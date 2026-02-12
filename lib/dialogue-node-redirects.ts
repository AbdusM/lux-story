/**
 * Dialogue Node Redirects
 *
 * Save compatibility contract:
 * - Never reuse removed node IDs for new semantics.
 * - Add old -> new redirects here when topology rewires move/remove nodes.
 * - Remove redirects only after the documented cleanup version.
 */

export type DialogueNodeRedirect = {
  toNodeId: string
  reason: string
  addedAt: string // YYYY-MM-DD
  removeAfterVersion?: string
}

export const DIALOGUE_NODE_REDIRECTS: Record<string, DialogueNodeRedirect> = {
  // Example:
  // old_node_id: {
  //   toNodeId: 'new_node_id',
  //   reason: 'Node split during topology pass',
  //   addedAt: '2026-02-11',
  //   removeAfterVersion: '1.2.0',
  // },
}

export type ResolveDialogueNodeRedirectResult = {
  originalNodeId: string
  resolvedNodeId: string
  path: string[]
  hops: number
  cycleDetected: boolean
  truncated: boolean
}

export function resolveDialogueNodeRedirect(
  nodeId: string,
  maxHops = 8,
): ResolveDialogueNodeRedirectResult {
  const path: string[] = [nodeId]
  const seen = new Set<string>([nodeId])

  let current = nodeId
  let hops = 0
  let cycleDetected = false
  let truncated = false

  while (hops < maxHops) {
    const redirect = DIALOGUE_NODE_REDIRECTS[current]
    if (!redirect) break

    hops++
    const next = redirect.toNodeId
    path.push(next)

    if (seen.has(next)) {
      cycleDetected = true
      current = next
      break
    }

    seen.add(next)
    current = next
  }

  if (hops >= maxHops && DIALOGUE_NODE_REDIRECTS[current]) {
    truncated = true
  }

  return {
    originalNodeId: nodeId,
    resolvedNodeId: current,
    path,
    hops,
    cycleDetected,
    truncated,
  }
}

