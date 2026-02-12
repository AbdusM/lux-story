#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS, CHARACTER_IDS } from '../lib/graph-registry'
import { CHARACTER_DEPTH } from '../content/character-depth'
import { CHARACTER_ECHOES } from '../lib/consequence-echoes'
import { PATTERN_VOICE_LIBRARY } from '../content/pattern-voice-library'
import { ALL_STORY_ARCS } from '../content/story-arcs'

type PatternKey = 'analytical' | 'helping' | 'building' | 'patience' | 'exploring'

type ConditionBuckets = {
  trust: number
  flags: number
  patterns: number
  knowledge: number
  mystery: number
  combos: number
}

type NarrativeSimReport = {
  per_graph?: Record<string, { expansions?: number }>
}

type RequiredStateGuardingReport = {
  by_graph?: Record<string, { required_state_nodes?: number; unguarded_nodes?: number }>
}

const NON_CHARACTER_GRAPHS = new Set(['station_entry', 'grand_hall', 'market', 'deep_station'])
const PATTERNS: PatternKey[] = ['analytical', 'helping', 'building', 'patience', 'exploring']

function emptyBuckets(): ConditionBuckets {
  return {
    trust: 0,
    flags: 0,
    patterns: 0,
    knowledge: 0,
    mystery: 0,
    combos: 0,
  }
}

function hasAny<T>(value: T[] | undefined): boolean {
  return Array.isArray(value) && value.length > 0
}

function addBuckets(a: ConditionBuckets, b: ConditionBuckets): ConditionBuckets {
  return {
    trust: a.trust + b.trust,
    flags: a.flags + b.flags,
    patterns: a.patterns + b.patterns,
    knowledge: a.knowledge + b.knowledge,
    mystery: a.mystery + b.mystery,
    combos: a.combos + b.combos,
  }
}

function conditionToBuckets(condition: unknown): ConditionBuckets {
  if (!condition || typeof condition !== 'object') return emptyBuckets()
  const c = condition as {
    trust?: unknown
    hasGlobalFlags?: string[]
    lacksGlobalFlags?: string[]
    patterns?: unknown
    hasKnowledgeFlags?: string[]
    lacksKnowledgeFlags?: string[]
    mysteries?: unknown
    requiredCombos?: string[]
  }

  return {
    trust: c.trust ? 1 : 0,
    flags: hasAny(c.hasGlobalFlags) || hasAny(c.lacksGlobalFlags) ? 1 : 0,
    patterns: c.patterns ? 1 : 0,
    knowledge: hasAny(c.hasKnowledgeFlags) || hasAny(c.lacksKnowledgeFlags) ? 1 : 0,
    mystery: c.mysteries ? 1 : 0,
    combos: hasAny(c.requiredCombos) ? 1 : 0,
  }
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch {
    return null
  }
}

function getGraphKeysForCharacter(characterId: string): string[] {
  const keys = [characterId]
  const revisitKey = `${characterId}_revisit`
  if (revisitKey in DIALOGUE_GRAPHS) {
    keys.push(revisitKey)
  }
  return keys
}

function getPatternBalanceWarnings(patternCounts: Record<PatternKey, number>, totalChoices: number): string[] {
  if (totalChoices === 0) return []
  const warnings: string[] = []
  for (const pattern of PATTERNS) {
    const count = patternCounts[pattern]
    if (count === 0) continue
    const pct = (count / totalChoices) * 100
    if (pct < 10) {
      warnings.push(`${pattern}:${pct.toFixed(1)}%`)
    }
  }
  return warnings
}

function riskTier(score: number): 'low' | 'medium' | 'high' {
  if (score >= 6) return 'high'
  if (score >= 3) return 'medium'
  return 'low'
}

function main(): void {
  const qaDir = path.join(process.cwd(), 'docs/qa')
  const narrativeSimReport = readJsonIfExists<NarrativeSimReport>(path.join(qaDir, 'narrative-sim-report.json'))
  const requiredStateGuardingReport = readJsonIfExists<RequiredStateGuardingReport>(path.join(qaDir, 'required-state-guarding-report.json'))

  const characterIds = CHARACTER_IDS.filter((id) => !NON_CHARACTER_GRAPHS.has(id))
  const reportRows = characterIds.map((characterId) => {
    const graphKeys = getGraphKeysForCharacter(characterId)

    let totalNodes = 0
    let totalChoices = 0
    let totalInterruptNodes = 0
    let totalSimulationNodes = 0
    const patternCounts: Record<PatternKey, number> = {
      analytical: 0,
      helping: 0,
      building: 0,
      patience: 0,
      exploring: 0,
    }
    let conditionBuckets = emptyBuckets()

    for (const key of graphKeys) {
      const graph = DIALOGUE_GRAPHS[key as keyof typeof DIALOGUE_GRAPHS]
      if (!graph) continue
      const nodes = Array.from(graph.nodes.values())
      totalNodes += nodes.length
      for (const node of nodes) {
        if (node.simulation) totalSimulationNodes++
        const hasInterrupt = node.tags?.includes('interrupt') || (node.content ?? []).some((content) => Boolean(content.interrupt))
        if (hasInterrupt) totalInterruptNodes++
        for (const choice of node.choices ?? []) {
          totalChoices++
          if (choice.pattern && choice.pattern in patternCounts) {
            patternCounts[choice.pattern as PatternKey]++
          }
          conditionBuckets = addBuckets(conditionBuckets, conditionToBuckets(choice.visibleCondition))
          conditionBuckets = addBuckets(conditionBuckets, conditionToBuckets(choice.enabledCondition))
        }
      }
    }

    const requiredStateCoverage = graphKeys.reduce(
      (acc, key) => {
        const graphStats = requiredStateGuardingReport?.by_graph?.[key]
        if (!graphStats) return acc
        return {
          requiredStateNodes: acc.requiredStateNodes + (graphStats.required_state_nodes ?? 0),
          unguardedNodes: acc.unguardedNodes + (graphStats.unguarded_nodes ?? 0),
        }
      },
      { requiredStateNodes: 0, unguardedNodes: 0 }
    )

    const narrativeSimExpansions = graphKeys.reduce((sum, key) => {
      const graphStats = narrativeSimReport?.per_graph?.[key]
      return sum + (graphStats?.expansions ?? 0)
    }, 0)

    const depth = CHARACTER_DEPTH[characterId]
    const echoes = CHARACTER_ECHOES[characterId]
    const voiceTriggers = PATTERN_VOICE_LIBRARY.filter((v) => v.condition?.characterId === characterId).length
    const storyArcIds = ALL_STORY_ARCS.filter((arc) => arc.requiredCharacters.includes(characterId)).map((arc) => arc.id)

    const depthStats = {
      profile: Boolean(depth),
      vulnerabilities: depth?.vulnerabilities.length ?? 0,
      strengths: depth?.strengths.length ?? 0,
      growthArcs: depth?.growthArcs.length ?? 0,
    }

    const echoStats = {
      profile: Boolean(echoes),
      trustUp: echoes ? Object.values(echoes.trustUp ?? {}).flat().length : 0,
      trustDown: echoes ? Object.values(echoes.trustDown ?? {}).flat().length : 0,
    }

    const patternBalanceWarnings = getPatternBalanceWarnings(patternCounts, totalChoices)
    const riskReasons: string[] = []
    let riskScore = 0

    if (requiredStateCoverage.unguardedNodes > 0) {
      riskScore += 4
      riskReasons.push('required_state_unguarded')
    }
    if (patternBalanceWarnings.length > 0) {
      riskScore += 2
      riskReasons.push('pattern_imbalance')
    }
    if (depthStats.vulnerabilities < 2) {
      riskScore += 1
      riskReasons.push('low_vulnerability_depth')
    }
    if (depthStats.strengths < 2) {
      riskScore += 1
      riskReasons.push('low_strength_depth')
    }
    if (depthStats.growthArcs === 0) {
      riskScore += 1
      riskReasons.push('no_growth_arc')
    }
    if (storyArcIds.length === 0) {
      riskScore += 1
      riskReasons.push('not_in_multi_session_arc')
    }

    return {
      characterId,
      graphKeys,
      hasRevisitGraph: graphKeys.length > 1,
      graph: {
        nodes: totalNodes,
        choices: totalChoices,
        interruptNodes: totalInterruptNodes,
        simulationNodes: totalSimulationNodes,
        requiredStateNodes: requiredStateCoverage.requiredStateNodes,
        unguardedRequiredStateNodes: requiredStateCoverage.unguardedNodes,
        narrativeSimExpansions,
      },
      patternCounts,
      patternBalanceWarnings,
      choiceConditionBuckets: conditionBuckets,
      depth: depthStats,
      echoes: echoStats,
      voiceTriggers,
      storyArcIds,
      riskScore,
      riskTier: riskTier(riskScore),
      riskReasons,
    }
  })

  const totals = reportRows.reduce(
    (acc, row) => {
      acc.nodes += row.graph.nodes
      acc.choices += row.graph.choices
      acc.interruptNodes += row.graph.interruptNodes
      acc.simulationNodes += row.graph.simulationNodes
      acc.requiredStateNodes += row.graph.requiredStateNodes
      acc.unguardedRequiredStateNodes += row.graph.unguardedRequiredStateNodes
      acc.narrativeSimExpansions += row.graph.narrativeSimExpansions
      acc.vulnerabilities += row.depth.vulnerabilities
      acc.strengths += row.depth.strengths
      acc.growthArcs += row.depth.growthArcs
      return acc
    },
    {
      nodes: 0,
      choices: 0,
      interruptNodes: 0,
      simulationNodes: 0,
      requiredStateNodes: 0,
      unguardedRequiredStateNodes: 0,
      narrativeSimExpansions: 0,
      vulnerabilities: 0,
      strengths: 0,
      growthArcs: 0,
    }
  )

  const summary = {
    generatedAt: new Date().toISOString(),
    characters: characterIds.length,
    rows: reportRows.length,
    totals,
    riskDistribution: {
      high: reportRows.filter((row) => row.riskTier === 'high').length,
      medium: reportRows.filter((row) => row.riskTier === 'medium').length,
      low: reportRows.filter((row) => row.riskTier === 'low').length,
    },
    topRisks: reportRows
      .slice()
      .sort((a, b) => b.riskScore - a.riskScore || a.characterId.localeCompare(b.characterId))
      .slice(0, 8)
      .map((row) => ({
        characterId: row.characterId,
        riskScore: row.riskScore,
        riskTier: row.riskTier,
        riskReasons: row.riskReasons,
      })),
  }

  const report = {
    summary,
    rows: reportRows,
  }

  const outputPath = path.join(qaDir, 'character-deep-coverage-report.json')
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf-8')

  console.log(`Character deep coverage report written: ${outputPath}`)
  console.log(`Characters: ${summary.characters}`)
  console.log(`Risk distribution: high=${summary.riskDistribution.high}, medium=${summary.riskDistribution.medium}, low=${summary.riskDistribution.low}`)
}

main()
