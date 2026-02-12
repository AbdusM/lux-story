#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { DialogueNode } from '../lib/dialogue-graph'

type Severity = 'soft' | 'hard'

type ContentIssue = {
  severity: Severity
  graph: string
  nodeId: string
  variationId: string
  words: number
  sentences: number
  message: string
  suggestion: string
}

type MonologueChainIssue = {
  severity: Severity
  graph: string
  path: string[]
  nodes: number
  words: number
  estimatedSeconds: number
  message: string
  suggestion: string
}

type GraphReport = {
  nodes: number
  contentBlocks: number
  hardContentIssues: number
  softContentIssues: number
  hardMonologueChains: number
  softMonologueChains: number
}

const LIMITS = {
  nodeWordsSoftMax: 35,
  nodeWordsHardMax: 90,
  nodeSentencesSoftMax: 3,
  monologueChainNodesSoftMax: 2,
  monologueChainNodesHardMax: 2,
  monologueChainWordsSoftMax: 120,
  monologueChainWordsHardMax: 180,
  wordsPerSecondEstimate: 2.8, // Informational only; not used as a gate.
} as const

const GRAPH_LIMIT_OVERRIDES: Record<string, { nodeWordsHardMax?: number }> = {
  // Mentor voice allowance: slightly longer single blocks, but same chain caps.
  samuel: { nodeWordsHardMax: 110 },
}

function getNodeWordCaps(graphName: string): { softMax: number; hardMax: number } {
  const override = GRAPH_LIMIT_OVERRIDES[graphName]
  return {
    softMax: LIMITS.nodeWordsSoftMax,
    hardMax: override?.nodeWordsHardMax ?? LIMITS.nodeWordsHardMax,
  }
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim()
}

function stripConditionalBlocks(input: string): string {
  // Remove template conditional blocks like {{flag: text|}} for budget analysis.
  let out = input
  let prev = ''
  while (out !== prev) {
    prev = out
    out = out.replace(/\{\{[^{}]*\}\}/g, ' ')
  }
  return normalizeWhitespace(out)
}

function countWords(input: string): number {
  const matches = input.match(/[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?/g)
  return matches ? matches.length : 0
}

function countSentences(input: string): number {
  return input
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length
}

function normalizeChoiceText(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim()
}

function isExplicitContinueChoice(text: string): boolean {
  const t = normalizeChoiceText(text)
  if (t === '...') return true
  if (t === 'continue') return true
  if (t === '(continue)') return true
  if (t === '[continue]') return true
  if (t.startsWith('(continue)')) return true
  if (t.startsWith('[continue]')) return true
  return false
}

function isUnconditionalContinueChoice(choice: DialogueNode['choices'][number]): boolean {
  return (
    Boolean(choice?.text) &&
    isExplicitContinueChoice(choice.text) &&
    !choice.visibleCondition &&
    !choice.enabledCondition
  )
}

function getMaxVariationStats(node: DialogueNode): { words: number; sentences: number; variationId: string } {
  let best = { words: 0, sentences: 0, variationId: 'unknown' }
  for (const content of node.content ?? []) {
    const cleaned = stripConditionalBlocks(content.text ?? '')
    const words = countWords(cleaned)
    const sentences = countSentences(cleaned)
    if (words > best.words) {
      best = {
        words,
        sentences,
        variationId: content.variation_id || 'unknown',
      }
    }
  }
  return best
}

function evaluateMonologueChains(graph: { name: string; nodes: DialogueNode[] }): MonologueChainIssue[] {
  const issues: MonologueChainIssue[] = []
  const nodeMap = new Map(graph.nodes.map((n) => [n.nodeId, n]))
  const incomingContinueCounts = new Map<string, number>()

  for (const node of graph.nodes) incomingContinueCounts.set(node.nodeId, 0)

  for (const node of graph.nodes) {
    for (const choice of node.choices ?? []) {
      if (!isUnconditionalContinueChoice(choice)) continue
      if (!nodeMap.has(choice.nextNodeId)) continue
      incomingContinueCounts.set(
        choice.nextNodeId,
        (incomingContinueCounts.get(choice.nextNodeId) ?? 0) + 1
      )
    }
  }

  for (const start of graph.nodes) {
    if (start.choices.length !== 1 || !isUnconditionalContinueChoice(start.choices[0])) continue
    if ((incomingContinueCounts.get(start.nodeId) ?? 0) > 0) continue

    const visited = new Set<string>()
    const path: string[] = []
    let words = 0
    let current: DialogueNode | undefined = start
    let guard = 0

    while (current && guard < 50) {
      guard++
      if (visited.has(current.nodeId)) break
      visited.add(current.nodeId)
      path.push(current.nodeId)
      words += getMaxVariationStats(current).words

      if (current.choices.length !== 1 || !isUnconditionalContinueChoice(current.choices[0])) break
      const nextId = current.choices[0].nextNodeId
      current = nodeMap.get(nextId)
    }

    if (path.length < 2) continue

    const estimatedSeconds = Number((words / LIMITS.wordsPerSecondEstimate).toFixed(1))
    const hard =
      path.length > LIMITS.monologueChainNodesHardMax ||
      words > LIMITS.monologueChainWordsHardMax
    const soft =
      !hard &&
      (path.length > LIMITS.monologueChainNodesSoftMax || words > LIMITS.monologueChainWordsSoftMax)

    if (!hard && !soft) continue

    issues.push({
      severity: hard ? 'hard' : 'soft',
      graph: graph.name,
      path,
      nodes: path.length,
      words,
      estimatedSeconds,
      message: hard
        ? `Monologue chain exceeds hard cap (${path.length} nodes, ${words} words)`
        : `Monologue chain exceeds soft cap (${path.length} nodes, ${words} words)`,
      suggestion:
        'Break this chain with a meaningful player choice, interruption, action beat, or conflict turn.',
    })
  }

  return issues
}

function main(): void {
  const strict = process.argv.slice(2).includes('--strict')

  const graphs = Object.entries(DIALOGUE_GRAPHS)
    .map(([name, graph]) => ({
      name,
      nodes: Array.from(graph.nodes.values()),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const contentIssues: ContentIssue[] = []
  const chainIssues: MonologueChainIssue[] = []
  const byGraph: Record<string, GraphReport> = {}

  for (const graph of graphs) {
    const wordCaps = getNodeWordCaps(graph.name)
    byGraph[graph.name] = {
      nodes: graph.nodes.length,
      contentBlocks: 0,
      hardContentIssues: 0,
      softContentIssues: 0,
      hardMonologueChains: 0,
      softMonologueChains: 0,
    }

    for (const node of graph.nodes) {
      byGraph[graph.name].contentBlocks += node.content?.length ?? 0

      for (const content of node.content ?? []) {
        const cleaned = stripConditionalBlocks(content.text ?? '')
        const words = countWords(cleaned)
        const sentences = countSentences(cleaned)

        const hardWordOverflow = words > wordCaps.hardMax
        const softWordOverflow = !hardWordOverflow && words > wordCaps.softMax
        const sentenceOverflow = sentences > LIMITS.nodeSentencesSoftMax

        if (!hardWordOverflow && !softWordOverflow && !sentenceOverflow) continue

        const severity: Severity =
          hardWordOverflow ||
          (sentenceOverflow && words > LIMITS.nodeWordsHardMax)
            ? 'hard'
            : 'soft'

        const issue: ContentIssue = {
          severity,
          graph: graph.name,
          nodeId: node.nodeId,
          variationId: content.variation_id || 'unknown',
          words,
          sentences,
          message: hardWordOverflow
            ? `Node text exceeds hard cap (${words} words > ${wordCaps.hardMax})`
            : sentenceOverflow
              ? `Node text uses too many sentences (${sentences} > ${LIMITS.nodeSentencesSoftMax})`
              : `Node text exceeds soft cap (${words} words > ${wordCaps.softMax})`,
          suggestion:
            'Cut 30%, convert explanation into conflict, and force an interaction turn sooner.',
        }
        contentIssues.push(issue)
        if (issue.severity === 'hard') byGraph[graph.name].hardContentIssues++
        else byGraph[graph.name].softContentIssues++
      }
    }

    const graphChainIssues = evaluateMonologueChains(graph)
    for (const issue of graphChainIssues) {
      chainIssues.push(issue)
      if (issue.severity === 'hard') byGraph[graph.name].hardMonologueChains++
      else byGraph[graph.name].softMonologueChains++
    }
  }

  const hardContentIssues = contentIssues.filter((i) => i.severity === 'hard').length
  const softContentIssues = contentIssues.filter((i) => i.severity === 'soft').length
  const hardMonologueChains = chainIssues.filter((i) => i.severity === 'hard').length
  const softMonologueChains = chainIssues.filter((i) => i.severity === 'soft').length

  const report = {
    generatedAt: new Date().toISOString(),
    limits: LIMITS,
    scope: {
      included: {
        graphsFromRegistry: graphs.length,
      },
      graphOverrides: GRAPH_LIMIT_OVERRIDES,
      caveats: [
        'This report scores only graph-registry-routable dialogue graphs (DIALOGUE_GRAPHS).',
        'Detached/non-graph/dormant dialogue sources are tracked separately in dialogue-external-review-report.json.',
        'Monologue chain gating is deterministic and word-based; estimated seconds are informational only.',
      ],
    },
    summary: {
      graphs: graphs.length,
      nodes: graphs.reduce((sum, g) => sum + g.nodes.length, 0),
      contentBlocks: graphs.reduce((sum, g) => sum + g.nodes.reduce((n, node) => n + (node.content?.length ?? 0), 0), 0),
      hardContentIssues,
      softContentIssues,
      hardMonologueChains,
      softMonologueChains,
    },
    byGraph,
    topOffenders: {
      longContent: [...contentIssues]
        .sort((a, b) => b.words - a.words)
        .slice(0, 5000),
      monologueChains: [...chainIssues]
        .sort((a, b) => b.words - a.words)
        .slice(0, 5000),
    },
  }

  const outPath = path.join(process.cwd(), 'docs/qa/dialogue-guidelines-report.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  console.log(`[dialogue-guidelines] report written: ${outPath}`)
  console.log(`[dialogue-guidelines] hard content issues: ${hardContentIssues}`)
  console.log(`[dialogue-guidelines] soft content issues: ${softContentIssues}`)
  console.log(`[dialogue-guidelines] hard monologue chains: ${hardMonologueChains}`)
  console.log(`[dialogue-guidelines] soft monologue chains: ${softMonologueChains}`)

  if (strict && (hardContentIssues > 0 || hardMonologueChains > 0)) {
    console.error('[dialogue-guidelines] strict mode failed')
    process.exit(1)
  }
}

main()
