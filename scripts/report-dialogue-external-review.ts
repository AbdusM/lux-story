#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS, CHARACTER_IDS } from '../lib/graph-registry'
import { DialogueNode } from '../lib/dialogue-graph'
import { alexJordanIntersectionNodes } from '../content/intersection-alex-jordan'
import { mayaDevonIntersectionNodes } from '../content/intersection-maya-devon'
import { tessRohanIntersectionNodes } from '../content/intersection-tess-rohan'
import { samuelWaitingNodes } from '../content/samuel-waiting-dialogue'
import { gracefulDeclineNodes, enhancedReactionNodes, samuelReflectionNodes } from '../content/reciprocity-engine-v2'
import { mayaReciprocityNodes } from '../content/maya-reciprocity-example'
import { reciprocityQuestions } from '../content/player-questions'
import { LOYALTY_EXPERIENCES } from '../lib/loyalty-experience'

type CharacterTier = 'high' | 'medium' | 'low'

type DialogueGuidelineGraphStats = {
  hardContentIssues?: number
  softContentIssues?: number
  hardMonologueChains?: number
  softMonologueChains?: number
}

type DialogueGuidelineReport = {
  limits?: {
    monologueChainNodesHardMax?: number
    monologueChainWordsHardMax?: number
    monologueChainNodesSoftMax?: number
    monologueChainWordsSoftMax?: number
  }
  byGraph?: Record<string, DialogueGuidelineGraphStats>
}

type UnreachableDialogueNodesReport = {
  by_graph?: Record<string, { unreachable: number }>
  unreachable?: Array<{ graphKey: string; nodeId: string }>
}

type NarrativeSimReport = {
  per_graph?: Record<string, { visited_state_pairs?: number }>
}

type TopRepeatedChoice = {
  text: string
  count: number
}

type CharacterReviewRow = {
  characterId: string
  graphKeys: string[]
  hasRevisitGraph: boolean
  reachability: {
    structuralReachableNodes: number
    structuralReachabilityRatio: number
    hardContentIssuesReachable: number
    softContentIssuesReachable: number
    hardMonologueChainsReachable: number
    softMonologueChainsReachable: number
    narrativeVisitedStatePairs: number
  }
  dialogue: {
    nodes: number
    contentBlocks: number
    avgContentWords: number
    p90ContentWords: number
    hardContentIssues: number
    softContentIssues: number
    hardMonologueChains: number
    softMonologueChains: number
  }
  answers: {
    totalChoices: number
    avgChoiceWords: number
    p90ChoiceWords: number
    longChoices: number
    veryLongChoices: number
    terseChoices: number
    continueChoices: number
    questionChoices: number
    missingPatternChoices: number
    gatedChoices: number
    uniqueChoiceTexts: number
    choiceReuseRatio: number
    topRepeatedChoiceTexts: TopRepeatedChoice[]
  }
  changeComplexity: {
    requiredStateNodes: number
    highFanInNodes: number
    highFanOutNodes: number
    totalEdges: number
  }
  priority: {
    score: number
    tier: CharacterTier
    reasons: string[]
    reachabilityWeightedScore: number
    reachabilityWeightedTier: CharacterTier
    reachabilityWeightedReasons: string[]
  }
}

type DetachedDialogueSourceRow = {
  sourceId: string
  runtimeReachableNow: boolean
  reachableByNavigation: boolean
  devOnly: boolean
  nodes: number
  contentBlocks: number
  choices: number
  hardContentIssues: number
  softContentIssues: number
  hardMonologueChains: number
}

type NonGraphAnswerSourceRow = {
  sourceId: string
  runtimeReachableNow: boolean
  reachableByNavigation: boolean
  devOnly: boolean
  questions: number
  choices: number
  questionHardContent: number
  questionSoftContent: number
  longChoices: number
  veryLongChoices: number
  npcResponseHardContent: number
  npcResponseSoftContent: number
}

type NonGraphExperienceSourceRow = {
  sourceId: string
  runtimeReachableNow: boolean
  reachableByNavigation: boolean
  devOnly: boolean
  experiences: number
  phases: number
  textBlocks: number
  choices: number
  hardContentIssues: number
  softContentIssues: number
  longChoices: number
  veryLongChoices: number
}

type DormantDialogueSourceRow = {
  sourceId: string
  filePath: string
  runtimeReachableNow: boolean
  reachableByNavigation: boolean
  devOnly: boolean
  nodes: number
  contentBlocks: number
  choices: number
  hardContentIssues: number
  softContentIssues: number
  longChoices: number
  veryLongChoices: number
  parseError?: string
}

const NON_CHARACTER_GRAPHS = new Set(['station_entry', 'grand_hall', 'market', 'deep_station'])
const CONTENT_SOFT_WORDS_MAX = 35
const CONTENT_HARD_WORDS_MAX = 90

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim()
}

function stripConditionalBlocks(input: string): string {
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

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1))
  return sorted[idx]
}

function normalizeChoiceText(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim()
}

function isContinueChoice(text: string): boolean {
  const t = normalizeChoiceText(text)
  if (t === '...') return true
  if (t === 'continue') return true
  if (t === '(continue)') return true
  if (t === '[continue]') return true
  if (t.startsWith('(continue)')) return true
  if (t.startsWith('[continue]')) return true
  return false
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function getGraphKeysForCharacter(characterId: string): string[] {
  const keys = [characterId]
  const revisitKey = `${characterId}_revisit`
  if (revisitKey in DIALOGUE_GRAPHS) {
    keys.push(revisitKey)
  }
  return keys
}

function getPriorityTier(score: number): CharacterTier {
  if (score >= 6) return 'high'
  if (score >= 3) return 'medium'
  return 'low'
}

function analyzeContinueChainMetrics(
  nodes: DialogueNode[],
  limits?: DialogueGuidelineReport['limits'],
  isNodeReachable?: (nodeId: string) => boolean,
): {
  hardCount: number
  softCount: number
  hardReachableCount: number
  softReachableCount: number
} {
  const nodeMap = new Map(nodes.map((n) => [n.nodeId, n]))
  const incomingContinueCounts = new Map<string, number>()
  for (const node of nodes) incomingContinueCounts.set(node.nodeId, 0)

  const hardNodeLimit = limits?.monologueChainNodesHardMax ?? 2
  const hardWordLimit = limits?.monologueChainWordsHardMax ?? 180
  const softNodeLimit = limits?.monologueChainNodesSoftMax ?? 2
  const softWordLimit = limits?.monologueChainWordsSoftMax ?? 120

  for (const node of nodes) {
    for (const choice of node.choices ?? []) {
      if (
        !isContinueChoice(choice.text ?? '') ||
        choice.visibleCondition ||
        choice.enabledCondition ||
        !nodeMap.has(choice.nextNodeId)
      ) continue
      incomingContinueCounts.set(
        choice.nextNodeId,
        (incomingContinueCounts.get(choice.nextNodeId) ?? 0) + 1
      )
    }
  }

  let hardCount = 0
  let softCount = 0
  let hardReachableCount = 0
  let softReachableCount = 0
  for (const start of nodes) {
    if (start.choices.length !== 1) continue
    const startChoice = start.choices[0]
    if (
      !isContinueChoice(startChoice.text ?? '') ||
      startChoice.visibleCondition ||
      startChoice.enabledCondition
    ) continue
    if ((incomingContinueCounts.get(start.nodeId) ?? 0) > 0) continue

    let guard = 0
    let chainNodes = 0
    let chainWords = 0
    let current: DialogueNode | undefined = start
    const seen = new Set<string>()
    const path: string[] = []

    while (current && guard < 40) {
      guard++
      if (seen.has(current.nodeId)) break
      seen.add(current.nodeId)
      path.push(current.nodeId)
      chainNodes++
      const maxWords = Math.max(0, ...(current.content ?? []).map((c) => countWords(stripConditionalBlocks(c.text ?? ''))))
      chainWords += maxWords

      if (current.choices.length !== 1) break
      const nextChoice = current.choices[0]
      if (
        !isContinueChoice(nextChoice.text ?? '') ||
        nextChoice.visibleCondition ||
        nextChoice.enabledCondition
      ) break
      current = nodeMap.get(nextChoice.nextNodeId)
    }

    const isHard = chainNodes > hardNodeLimit || chainWords > hardWordLimit
    const isSoft = !isHard && (chainNodes > softNodeLimit || chainWords > softWordLimit)
    if (!isHard && !isSoft) continue

    const reachable = isNodeReachable ? path.every((id) => isNodeReachable(id)) : false
    if (isHard) {
      hardCount++
      if (reachable) hardReachableCount++
    } else {
      softCount++
      if (reachable) softReachableCount++
    }
  }

  return { hardCount, softCount, hardReachableCount, softReachableCount }
}

function analyzeDetachedDialogueSource(sourceId: string, nodes: DialogueNode[]): DetachedDialogueSourceRow {
  let contentBlocks = 0
  let choices = 0
  let hardContentIssues = 0
  let softContentIssues = 0

  for (const node of nodes) {
    for (const content of node.content ?? []) {
      contentBlocks++
      const w = countWords(stripConditionalBlocks(content.text ?? ''))
      if (w > CONTENT_HARD_WORDS_MAX) hardContentIssues++
      else if (w > CONTENT_SOFT_WORDS_MAX) softContentIssues++
    }
    choices += (node.choices ?? []).length
  }

  return {
    sourceId,
    runtimeReachableNow: false,
    reachableByNavigation: false,
    devOnly: false,
    nodes: nodes.length,
    contentBlocks,
    choices,
    hardContentIssues,
    softContentIssues,
    hardMonologueChains: analyzeContinueChainMetrics(nodes).hardCount,
  }
}

function analyzeReciprocityQuestionSource(): NonGraphAnswerSourceRow {
  const questions = Object.values(reciprocityQuestions)

  let questionHardContent = 0
  let questionSoftContent = 0
  let choices = 0
  let longChoices = 0
  let veryLongChoices = 0
  let npcResponseHardContent = 0
  let npcResponseSoftContent = 0

  for (const question of questions) {
    const qWords = countWords(stripConditionalBlocks(question.questionText ?? ''))
    if (qWords > CONTENT_HARD_WORDS_MAX) questionHardContent++
    else if (qWords > CONTENT_SOFT_WORDS_MAX) questionSoftContent++

    for (const choice of question.choices ?? []) {
      choices++
      const cWords = countWords(stripConditionalBlocks(choice.choiceText ?? ''))
      if (cWords >= 16) longChoices++
      if (cWords >= 22) veryLongChoices++

      const responseWords = countWords(stripConditionalBlocks(choice.npcResponse ?? ''))
      if (responseWords > CONTENT_HARD_WORDS_MAX) npcResponseHardContent++
      else if (responseWords > CONTENT_SOFT_WORDS_MAX) npcResponseSoftContent++
    }
  }

  return {
    sourceId: 'player_questions_reciprocity',
    runtimeReachableNow: false,
    reachableByNavigation: false,
    devOnly: false,
    questions: questions.length,
    choices,
    questionHardContent,
    questionSoftContent,
    longChoices,
    veryLongChoices,
    npcResponseHardContent,
    npcResponseSoftContent,
  }
}

function analyzeLoyaltyExperienceSource(): NonGraphExperienceSourceRow {
  const experiences = Object.values(LOYALTY_EXPERIENCES)

  let phases = 0
  let textBlocks = 0
  let choices = 0
  let hardContentIssues = 0
  let softContentIssues = 0
  let longChoices = 0
  let veryLongChoices = 0

  const scoreText = (text: string | undefined): void => {
    if (!text) return
    textBlocks++
    const words = countWords(stripConditionalBlocks(text))
    if (words > CONTENT_HARD_WORDS_MAX) hardContentIssues++
    else if (words > CONTENT_SOFT_WORDS_MAX) softContentIssues++
  }

  for (const exp of experiences) {
    scoreText(exp.introduction)
    scoreText(exp.successEnding?.text)
    scoreText(exp.failureEnding?.text)

    for (const phase of exp.phases ?? []) {
      phases++
      scoreText(phase.situation)
      scoreText(phase.timeContext)

      for (const choice of phase.choices ?? []) {
        choices++
        const choiceWords = countWords(stripConditionalBlocks(choice.text ?? ''))
        if (choiceWords >= 16) longChoices++
        if (choiceWords >= 22) veryLongChoices++
        scoreText(choice.outcome?.feedback)
      }
    }
  }

  return {
    sourceId: 'loyalty_experience_system',
    runtimeReachableNow: true,
    reachableByNavigation: false,
    devOnly: false,
    experiences: experiences.length,
    phases,
    textBlocks,
    choices,
    hardContentIssues,
    softContentIssues,
    longChoices,
    veryLongChoices,
  }
}

function analyzeDormantJsonDialogueSource(sourceId: string, filePath: string): DormantDialogueSourceRow {
  const fullPath = path.join(process.cwd(), filePath)
  if (!fs.existsSync(fullPath)) {
    return {
      sourceId,
      filePath,
      runtimeReachableNow: false,
      reachableByNavigation: false,
      devOnly: false,
      nodes: 0,
      contentBlocks: 0,
      choices: 0,
      hardContentIssues: 0,
      softContentIssues: 0,
      longChoices: 0,
      veryLongChoices: 0,
      parseError: 'file_not_found',
    }
  }

  try {
    const payload = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as { nodes?: Array<Record<string, unknown>> }
    const nodes = payload.nodes ?? []

    let contentBlocks = 0
    let choices = 0
    let hardContentIssues = 0
    let softContentIssues = 0
    let longChoices = 0
    let veryLongChoices = 0

    for (const node of nodes) {
      const content = Array.isArray(node.content) ? node.content : []
      const nodeChoices = Array.isArray(node.choices) ? node.choices : []

      for (const entry of content) {
        const text = typeof (entry as { text?: unknown }).text === 'string'
          ? String((entry as { text?: unknown }).text)
          : ''
        contentBlocks++
        const words = countWords(stripConditionalBlocks(text))
        if (words > CONTENT_HARD_WORDS_MAX) hardContentIssues++
        else if (words > CONTENT_SOFT_WORDS_MAX) softContentIssues++
      }

      for (const choice of nodeChoices) {
        choices++
        const textValue = (choice as { text?: unknown; choiceText?: unknown }).text
          ?? (choice as { text?: unknown; choiceText?: unknown }).choiceText
        const text = typeof textValue === 'string' ? textValue : ''
        const words = countWords(stripConditionalBlocks(text))
        if (words >= 16) longChoices++
        if (words >= 22) veryLongChoices++
      }
    }

    return {
      sourceId,
      filePath,
      runtimeReachableNow: false,
      reachableByNavigation: false,
      devOnly: false,
      nodes: nodes.length,
      contentBlocks,
      choices,
      hardContentIssues,
      softContentIssues,
      longChoices,
      veryLongChoices,
    }
  } catch (error) {
    return {
      sourceId,
      filePath,
      runtimeReachableNow: false,
      reachableByNavigation: false,
      devOnly: false,
      nodes: 0,
      contentBlocks: 0,
      choices: 0,
      hardContentIssues: 0,
      softContentIssues: 0,
      longChoices: 0,
      veryLongChoices: 0,
      parseError: error instanceof Error ? error.message : 'parse_error',
    }
  }
}

function readJsonIfExists<T>(p: string): T | null {
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf8')) as T
}

function buildUnreachableNodeIndex(
  report: UnreachableDialogueNodesReport | null,
): Map<string, Set<string>> {
  const byGraph = new Map<string, Set<string>>()
  for (const node of report?.unreachable ?? []) {
    if (!byGraph.has(node.graphKey)) {
      byGraph.set(node.graphKey, new Set<string>())
    }
    byGraph.get(node.graphKey)!.add(node.nodeId)
  }
  return byGraph
}

function main(): void {
  const guidelinesPath = path.join(process.cwd(), 'docs/qa/dialogue-guidelines-report.json')
  const unreachablePath = path.join(process.cwd(), 'docs/qa/unreachable-dialogue-nodes-report.json')
  const narrativeSimPath = path.join(process.cwd(), 'docs/qa/narrative-sim-report.json')
  const guidelineReport = readJsonIfExists<DialogueGuidelineReport>(guidelinesPath) ?? {}
  const unreachableReport = readJsonIfExists<UnreachableDialogueNodesReport>(unreachablePath)
  const narrativeSimReport = readJsonIfExists<NarrativeSimReport>(narrativeSimPath)
  const hasGuidelineByGraph = Boolean(guidelineReport.byGraph && Object.keys(guidelineReport.byGraph).length > 0)
  const hasUnreachableReport = Boolean(unreachableReport?.unreachable && unreachableReport.unreachable.length >= 0)
  const hasNarrativeSimReport = Boolean(narrativeSimReport?.per_graph && Object.keys(narrativeSimReport.per_graph).length > 0)
  const unreachableByGraph = buildUnreachableNodeIndex(unreachableReport)

  const characterIds = CHARACTER_IDS.filter((id) => !NON_CHARACTER_GRAPHS.has(id))

  const rows: CharacterReviewRow[] = characterIds.map((characterId) => {
    const graphKeys = getGraphKeysForCharacter(characterId)
    const hasRevisitGraph = graphKeys.length > 1

    const nodeRecords: Array<{ graphKey: string; node: DialogueNode }> = []
    for (const key of graphKeys) {
      const graph = DIALOGUE_GRAPHS[key as keyof typeof DIALOGUE_GRAPHS]
      if (!graph) continue
      nodeRecords.push(
        ...Array.from(graph.nodes.values()).map((node) => ({ graphKey: key, node })),
      )
    }
    const nodes = nodeRecords.map((r) => r.node)

    const isStructurallyReachable = (graphKey: string, nodeId: string): boolean => {
      const unreachableSet = unreachableByGraph.get(graphKey)
      if (!unreachableSet) return true
      return !unreachableSet.has(nodeId)
    }

    const contentWordSamples: number[] = []
    let contentBlocks = 0
    let hardContentIssues = 0
    let softContentIssues = 0
    let hardContentIssuesReachable = 0
    let softContentIssuesReachable = 0
    let structuralReachableNodes = 0

    const choiceWordSamples: number[] = []
    let totalChoices = 0
    let longChoices = 0
    let veryLongChoices = 0
    let terseChoices = 0
    let continueChoices = 0
    let questionChoices = 0
    let missingPatternChoices = 0
    let gatedChoices = 0
    const choiceTextCounts = new Map<string, number>()

    const incomingCounts = new Map<string, number>()
    let totalEdges = 0
    let requiredStateNodes = 0
    let highFanOutNodes = 0

    for (const { graphKey, node } of nodeRecords) {
      if (isStructurallyReachable(graphKey, node.nodeId)) {
        structuralReachableNodes++
      }
      if (node.requiredState) requiredStateNodes++

      if ((node.choices ?? []).length >= 5) {
        highFanOutNodes++
      }

      for (const content of node.content ?? []) {
        contentBlocks++
        const words = countWords(stripConditionalBlocks(content.text ?? ''))
        contentWordSamples.push(words)
        if (words > CONTENT_HARD_WORDS_MAX) {
          hardContentIssues++
          if (isStructurallyReachable(graphKey, node.nodeId)) hardContentIssuesReachable++
        } else if (words > CONTENT_SOFT_WORDS_MAX) {
          softContentIssues++
          if (isStructurallyReachable(graphKey, node.nodeId)) softContentIssuesReachable++
        }
      }

      for (const choice of node.choices ?? []) {
        totalEdges++
        totalChoices++
        incomingCounts.set(choice.nextNodeId, (incomingCounts.get(choice.nextNodeId) ?? 0) + 1)

        const normalized = normalizeChoiceText(choice.text ?? '')
        const words = countWords(normalized)
        choiceWordSamples.push(words)
        choiceTextCounts.set(normalized, (choiceTextCounts.get(normalized) ?? 0) + 1)

        if (words >= 16) longChoices++
        if (words >= 22) veryLongChoices++

        const isContinue = isContinueChoice(choice.text ?? '')
        if (isContinue) continueChoices++
        if (!isContinue && words > 0 && words <= 2) terseChoices++
        if ((choice.text ?? '').trim().endsWith('?')) questionChoices++

        if (!choice.pattern) missingPatternChoices++
        if (choice.visibleCondition || choice.enabledCondition) gatedChoices++
      }
    }

    let hardMonologueChains = 0
    let softMonologueChains = 0
    let hardMonologueChainsReachable = 0
    let softMonologueChainsReachable = 0
    let narrativeVisitedStatePairs = 0
    for (const key of graphKeys) {
      narrativeVisitedStatePairs += narrativeSimReport?.per_graph?.[key]?.visited_state_pairs ?? 0

      const graph = DIALOGUE_GRAPHS[key as keyof typeof DIALOGUE_GRAPHS]
      if (graph) {
        const chainMetrics = analyzeContinueChainMetrics(
          Array.from(graph.nodes.values()),
          guidelineReport.limits,
          (nodeId) => isStructurallyReachable(key, nodeId),
        )
        hardMonologueChainsReachable += chainMetrics.hardReachableCount
        softMonologueChainsReachable += chainMetrics.softReachableCount
      }

      const stats = guidelineReport.byGraph?.[key]
      if (stats) {
        hardMonologueChains += stats.hardMonologueChains ?? 0
        softMonologueChains += stats.softMonologueChains ?? 0
        continue
      }
      const graphFallback = DIALOGUE_GRAPHS[key as keyof typeof DIALOGUE_GRAPHS]
      if (!graphFallback) continue
      const chainFallback = analyzeContinueChainMetrics(
        Array.from(graphFallback.nodes.values()),
        guidelineReport.limits,
      )
      hardMonologueChains += chainFallback.hardCount
      softMonologueChains += chainFallback.softCount
    }

    const structuralReachabilityRatio = nodes.length === 0
      ? 0
      : round2(structuralReachableNodes / nodes.length)

    const highFanInNodes = Array.from(incomingCounts.values()).filter((n) => n >= 3).length
    const avgContentWords = contentWordSamples.length === 0 ? 0 : round2(contentWordSamples.reduce((a, b) => a + b, 0) / contentWordSamples.length)
    const p90ContentWords = percentile(contentWordSamples, 90)
    const avgChoiceWords = choiceWordSamples.length === 0 ? 0 : round2(choiceWordSamples.reduce((a, b) => a + b, 0) / choiceWordSamples.length)
    const p90ChoiceWords = percentile(choiceWordSamples, 90)
    const uniqueChoiceTexts = choiceTextCounts.size
    const choiceReuseRatio = totalChoices === 0 ? 0 : round2(1 - uniqueChoiceTexts / totalChoices)

    const topRepeatedChoiceTexts = Array.from(choiceTextCounts.entries())
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text, count }))

    const reasons: string[] = []
    let score = 0

    if (hardMonologueChains > 0) {
      score += 3
      reasons.push('has_hard_monologue_chains')
    }
    if (hardContentIssues >= 8) {
      score += 2
      reasons.push('high_hard_content_density')
    } else if (hardContentIssues >= 3) {
      score += 1
      reasons.push('moderate_hard_content_density')
    }
    if (veryLongChoices >= 5) {
      score += 1
      reasons.push('choice_cognitive_load_high')
    }
    if (totalChoices > 0 && (missingPatternChoices / totalChoices) > 0.25) {
      score += 1
      reasons.push('high_missing_pattern_ratio')
    }
    if (highFanInNodes >= 12) {
      score += 1
      reasons.push('high_change_complexity_fan_in')
    }

    const reachabilityWeightedReasons: string[] = []
    let reachabilityWeightedScore = 0
    if (hardMonologueChainsReachable > 0) {
      reachabilityWeightedScore += 4
      reachabilityWeightedReasons.push('reachable_hard_monologue_chains')
    }
    if (hardContentIssuesReachable >= 8) {
      reachabilityWeightedScore += 2
      reachabilityWeightedReasons.push('reachable_hard_content_density_high')
    } else if (hardContentIssuesReachable >= 3) {
      reachabilityWeightedScore += 1
      reachabilityWeightedReasons.push('reachable_hard_content_density_moderate')
    }
    if (veryLongChoices >= 5) {
      reachabilityWeightedScore += 1
      reachabilityWeightedReasons.push('choice_cognitive_load_high')
    }
    if (highFanInNodes >= 12) {
      reachabilityWeightedScore += 1
      reachabilityWeightedReasons.push('high_change_complexity_fan_in')
    }

    return {
      characterId,
      graphKeys,
      hasRevisitGraph,
      reachability: {
        structuralReachableNodes,
        structuralReachabilityRatio,
        hardContentIssuesReachable,
        softContentIssuesReachable,
        hardMonologueChainsReachable,
        softMonologueChainsReachable,
        narrativeVisitedStatePairs,
      },
      dialogue: {
        nodes: nodes.length,
        contentBlocks,
        avgContentWords,
        p90ContentWords,
        hardContentIssues,
        softContentIssues,
        hardMonologueChains,
        softMonologueChains,
      },
      answers: {
        totalChoices,
        avgChoiceWords,
        p90ChoiceWords,
        longChoices,
        veryLongChoices,
        terseChoices,
        continueChoices,
        questionChoices,
        missingPatternChoices,
        gatedChoices,
        uniqueChoiceTexts,
        choiceReuseRatio,
        topRepeatedChoiceTexts,
      },
      changeComplexity: {
        requiredStateNodes,
        highFanInNodes,
        highFanOutNodes,
        totalEdges,
      },
      priority: {
        score,
        tier: getPriorityTier(score),
        reasons,
        reachabilityWeightedScore,
        reachabilityWeightedTier: getPriorityTier(reachabilityWeightedScore),
        reachabilityWeightedReasons,
      },
    }
  })

  const totals = rows.reduce((acc, row) => {
    acc.nodes += row.dialogue.nodes
    acc.contentBlocks += row.dialogue.contentBlocks
    acc.totalChoices += row.answers.totalChoices
    acc.hardContentIssues += row.dialogue.hardContentIssues
    acc.softContentIssues += row.dialogue.softContentIssues
    acc.hardMonologueChains += row.dialogue.hardMonologueChains
    acc.softMonologueChains += row.dialogue.softMonologueChains
    acc.longChoices += row.answers.longChoices
    acc.veryLongChoices += row.answers.veryLongChoices
    acc.terseChoices += row.answers.terseChoices
    acc.continueChoices += row.answers.continueChoices
    acc.questionChoices += row.answers.questionChoices
    return acc
  }, {
    nodes: 0,
    contentBlocks: 0,
    totalChoices: 0,
    hardContentIssues: 0,
    softContentIssues: 0,
    hardMonologueChains: 0,
    softMonologueChains: 0,
    longChoices: 0,
    veryLongChoices: 0,
    terseChoices: 0,
    continueChoices: 0,
    questionChoices: 0,
  })

  const reachabilityTotals = rows.reduce((acc, row) => {
    acc.structuralReachableNodes += row.reachability.structuralReachableNodes
    acc.hardContentIssuesReachable += row.reachability.hardContentIssuesReachable
    acc.softContentIssuesReachable += row.reachability.softContentIssuesReachable
    acc.hardMonologueChainsReachable += row.reachability.hardMonologueChainsReachable
    acc.softMonologueChainsReachable += row.reachability.softMonologueChainsReachable
    acc.narrativeVisitedStatePairs += row.reachability.narrativeVisitedStatePairs
    return acc
  }, {
    structuralReachableNodes: 0,
    hardContentIssuesReachable: 0,
    softContentIssuesReachable: 0,
    hardMonologueChainsReachable: 0,
    softMonologueChainsReachable: 0,
    narrativeVisitedStatePairs: 0,
  })

  const tierDistribution = rows.reduce((acc, row) => {
    acc[row.priority.tier]++
    return acc
  }, { high: 0, medium: 0, low: 0 } as Record<CharacterTier, number>)

  const tierDistributionReachabilityWeighted = rows.reduce((acc, row) => {
    acc[row.priority.reachabilityWeightedTier]++
    return acc
  }, { high: 0, medium: 0, low: 0 } as Record<CharacterTier, number>)

  const topPriority = [...rows]
    .sort((a, b) => b.priority.score - a.priority.score || b.dialogue.hardContentIssues - a.dialogue.hardContentIssues)
    .slice(0, 10)
    .map((row) => ({
      characterId: row.characterId,
      score: row.priority.score,
      tier: row.priority.tier,
      reasons: row.priority.reasons,
      hardContentIssues: row.dialogue.hardContentIssues,
      hardMonologueChains: row.dialogue.hardMonologueChains,
      veryLongChoices: row.answers.veryLongChoices,
    }))

  const topPriorityReachabilityWeighted = [...rows]
    .sort((a, b) =>
      b.priority.reachabilityWeightedScore - a.priority.reachabilityWeightedScore ||
      b.reachability.hardContentIssuesReachable - a.reachability.hardContentIssuesReachable)
    .slice(0, 10)
    .map((row) => ({
      characterId: row.characterId,
      reachabilityWeightedScore: row.priority.reachabilityWeightedScore,
      reachabilityWeightedTier: row.priority.reachabilityWeightedTier,
      reachabilityWeightedReasons: row.priority.reachabilityWeightedReasons,
      hardContentIssuesReachable: row.reachability.hardContentIssuesReachable,
      hardMonologueChainsReachable: row.reachability.hardMonologueChainsReachable,
      structuralReachabilityRatio: row.reachability.structuralReachabilityRatio,
    }))

  const detachedDialogueSources: DetachedDialogueSourceRow[] = [
    analyzeDetachedDialogueSource('intersection_alex_jordan', alexJordanIntersectionNodes),
    analyzeDetachedDialogueSource('intersection_maya_devon', mayaDevonIntersectionNodes),
    analyzeDetachedDialogueSource('intersection_tess_rohan', tessRohanIntersectionNodes),
    analyzeDetachedDialogueSource('samuel_waiting_nodes', samuelWaitingNodes),
    analyzeDetachedDialogueSource('reciprocity_graceful_decline', gracefulDeclineNodes),
    analyzeDetachedDialogueSource('reciprocity_enhanced_reactions', enhancedReactionNodes),
    analyzeDetachedDialogueSource('reciprocity_samuel_reflections', samuelReflectionNodes),
    analyzeDetachedDialogueSource('maya_reciprocity_example', mayaReciprocityNodes),
  ].map((source) => {
    const classification: Record<string, Pick<DetachedDialogueSourceRow, 'runtimeReachableNow' | 'reachableByNavigation' | 'devOnly'>> = {
      intersection_alex_jordan: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: false },
      intersection_maya_devon: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: false },
      intersection_tess_rohan: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: false },
      samuel_waiting_nodes: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: false },
      reciprocity_graceful_decline: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: true },
      reciprocity_enhanced_reactions: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: true },
      reciprocity_samuel_reflections: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: true },
      maya_reciprocity_example: { runtimeReachableNow: false, reachableByNavigation: false, devOnly: true },
    }
    return {
      ...source,
      ...(classification[source.sourceId] ?? {
        runtimeReachableNow: false,
        reachableByNavigation: false,
        devOnly: false,
      }),
    }
  })

  const nonGraphAnswerSources: NonGraphAnswerSourceRow[] = [analyzeReciprocityQuestionSource()]

  const nonGraphExperienceSources: NonGraphExperienceSourceRow[] = [analyzeLoyaltyExperienceSource()]

  const dormantDialogueSources: DormantDialogueSourceRow[] = [
    analyzeDormantJsonDialogueSource('maya_dialogue_enhanced_json', 'content/maya-dialogue-enhanced.json'),
  ]

  const detachedDialogueTotals = detachedDialogueSources.reduce((acc, s) => {
    acc.nodes += s.nodes
    acc.contentBlocks += s.contentBlocks
    acc.choices += s.choices
    acc.hardContentIssues += s.hardContentIssues
    acc.softContentIssues += s.softContentIssues
    acc.hardMonologueChains += s.hardMonologueChains
    return acc
  }, {
    nodes: 0,
    contentBlocks: 0,
    choices: 0,
    hardContentIssues: 0,
    softContentIssues: 0,
    hardMonologueChains: 0,
  })

  const nonGraphAnswerTotals = nonGraphAnswerSources.reduce((acc, s) => {
    acc.questions += s.questions
    acc.choices += s.choices
    acc.questionHardContent += s.questionHardContent
    acc.questionSoftContent += s.questionSoftContent
    acc.longChoices += s.longChoices
    acc.veryLongChoices += s.veryLongChoices
    acc.npcResponseHardContent += s.npcResponseHardContent
    acc.npcResponseSoftContent += s.npcResponseSoftContent
    return acc
  }, {
    questions: 0,
    choices: 0,
    questionHardContent: 0,
    questionSoftContent: 0,
    longChoices: 0,
    veryLongChoices: 0,
    npcResponseHardContent: 0,
    npcResponseSoftContent: 0,
  })

  const nonGraphExperienceTotals = nonGraphExperienceSources.reduce((acc, s) => {
    acc.experiences += s.experiences
    acc.phases += s.phases
    acc.textBlocks += s.textBlocks
    acc.choices += s.choices
    acc.hardContentIssues += s.hardContentIssues
    acc.softContentIssues += s.softContentIssues
    acc.longChoices += s.longChoices
    acc.veryLongChoices += s.veryLongChoices
    return acc
  }, {
    experiences: 0,
    phases: 0,
    textBlocks: 0,
    choices: 0,
    hardContentIssues: 0,
    softContentIssues: 0,
    longChoices: 0,
    veryLongChoices: 0,
  })

  const dormantDialogueTotals = dormantDialogueSources.reduce((acc, s) => {
    acc.nodes += s.nodes
    acc.contentBlocks += s.contentBlocks
    acc.choices += s.choices
    acc.hardContentIssues += s.hardContentIssues
    acc.softContentIssues += s.softContentIssues
    acc.longChoices += s.longChoices
    acc.veryLongChoices += s.veryLongChoices
    return acc
  }, {
    nodes: 0,
    contentBlocks: 0,
    choices: 0,
    hardContentIssues: 0,
    softContentIssues: 0,
    longChoices: 0,
    veryLongChoices: 0,
  })

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      contentSoftWords: CONTENT_SOFT_WORDS_MAX,
      contentHardWords: CONTENT_HARD_WORDS_MAX,
      choiceLongWords: 16,
      choiceVeryLongWords: 22,
      terseChoiceWordsMax: 2,
      highFanInMin: 3,
      highFanOutMinChoices: 5,
      monologueChain: {
        hardNodesMax: guidelineReport.limits?.monologueChainNodesHardMax ?? 3,
        hardWordsMax: guidelineReport.limits?.monologueChainWordsHardMax ?? 180,
        softNodesMax: guidelineReport.limits?.monologueChainNodesSoftMax ?? 2,
        softWordsMax: guidelineReport.limits?.monologueChainWordsSoftMax ?? 120,
      },
    },
    summary: {
      characters: rows.length,
      totals,
      reachabilityTotals,
      tierDistribution,
      tierDistributionReachabilityWeighted,
      topPriority,
      topPriorityReachabilityWeighted,
    },
    scope: {
      included: {
        characterGraphsFromRegistry: rows.length,
        revisitGraphsIncluded: rows.filter((r) => r.hasRevisitGraph).length,
        hasGuidelineReport: hasGuidelineByGraph,
        hasStructuralReachabilityReport: hasUnreachableReport,
        hasNarrativeSimReport,
      },
      excludedFromPrimaryScoring: {
        detachedDialogueSources,
        detachedDialogueTotals,
        nonGraphAnswerSources,
        nonGraphAnswerTotals,
        nonGraphExperienceSources,
        nonGraphExperienceTotals,
        dormantDialogueSources,
        dormantDialogueTotals,
      },
      caveats: [
        'Primary character scoring uses graph-registry-routable character graphs only.',
        'Reachability weighting uses structural reachability (unreachable-dialogue-nodes report) and narrative sim visit-state counts when available.',
        'Detached dialogue sources may be in prototype/unwired state and are reported separately to prevent false "full corpus" assumptions.',
        'Sentence-overflow style flags from dialogue-guidelines are not used in the character soft-content metric (word-based for comparability).',
        'Continue-chain detection focuses on explicit continue-style links and may undercount non-standard deterministic chain wording.',
      ],
    },
    rows,
  }

  const outPath = path.join(process.cwd(), 'docs/qa/dialogue-external-review-report.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  console.log(`Dialogue external review report written: ${outPath}`)
  if (!hasGuidelineByGraph) {
    console.warn('Dialogue guidelines report missing or incomplete; chain counts used local fallback thresholds.')
  }
  console.log(`Characters: ${rows.length}`)
  console.log(`Priority tiers: high=${tierDistribution.high}, medium=${tierDistribution.medium}, low=${tierDistribution.low}`)
  console.log(`Reachability-weighted tiers: high=${tierDistributionReachabilityWeighted.high}, medium=${tierDistributionReachabilityWeighted.medium}, low=${tierDistributionReachabilityWeighted.low}`)
  console.log(`Hard content issues: ${totals.hardContentIssues}`)
  console.log(`Hard monologue chains: ${totals.hardMonologueChains}`)
  console.log(`Reachable hard content issues: ${reachabilityTotals.hardContentIssuesReachable}`)
  console.log(`Reachable hard monologue chains: ${reachabilityTotals.hardMonologueChainsReachable}`)
  console.log(`Detached dialogue hard issues: ${detachedDialogueTotals.hardContentIssues} content, ${detachedDialogueTotals.hardMonologueChains} chains`)
  console.log(`Non-graph answer long choices: ${nonGraphAnswerTotals.longChoices} (very long: ${nonGraphAnswerTotals.veryLongChoices})`)
  console.log(`Loyalty experience (non-graph) hard issues: ${nonGraphExperienceTotals.hardContentIssues} content`)
  console.log(`Dormant JSON dialogue hard issues: ${dormantDialogueTotals.hardContentIssues} content`)
}

main()
