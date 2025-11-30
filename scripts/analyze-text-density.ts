#!/usr/bin/env npx tsx
/**
 * Text Density Analyzer
 * 
 * Analyzes dialogue nodes across all characters to identify:
 * - Nodes with >80 words (targets for splitting)
 * - Stage directions and actions (to be removed)
 * - Abstract language (to be replaced with concrete)
 * - Word count per node
 * 
 * Usage: npx tsx scripts/analyze-text-density.ts [--character=samuel]
 */

import { DialogueNode } from '../lib/dialogue-graph'
import { samuelDialogueNodes } from '../content/samuel-dialogue-graph'
import { mayaDialogueNodes } from '../content/maya-dialogue-graph'
import { devonDialogueNodes } from '../content/devon-dialogue-graph'
import { jordanDialogueNodes } from '../content/jordan-dialogue-graph'
import { kaiDialogueNodes } from '../content/kai-dialogue-graph'
import { silasDialogueNodes } from '../content/silas-dialogue-graph'
import { marcusDialogueNodes } from '../content/marcus-dialogue-graph'
import { tessDialogueNodes } from '../content/tess-dialogue-graph'
import { rohanDialogueNodes } from '../content/rohan-dialogue-graph'
import { yaquinDialogueNodes } from '../content/yaquin-dialogue-graph'
import { mayaRevisitNodes } from '../content/maya-revisit-graph'
import { yaquinRevisitNodes } from '../content/yaquin-revisit-graph'

interface NodeAnalysis {
  character: string
  nodeId: string
  wordCount: number
  charCount: number
  text: string
  hasStageDirections: boolean
  hasAbstractLanguage: boolean
  issues: string[]
}

// Common stage direction patterns
const STAGE_DIRECTION_PATTERNS = [
  /\*[^*]+\*/g,  // Italic text: *text*
  /_([^_]+)_/g,  // Underscore italic: _text_
  /\bA pause\b/i,
  /\bHis voice breaks?\b/i,
  /\bHer voice breaks?\b/i,
  /\bStudies you\b/i,
  /\bNot judgment\b/i,
  /\bThis isn't just\b/i,
  /\bSomething settles\b/i,
  /\bcarries weight\b/i,
  /\bvoice carries\b/i,
]

// Common abstract phrases to flag
const ABSTRACT_PATTERNS = [
  /\bdiscover about yourself\b/i,
  /\bfind your path\b/i,
  /\bfigure things out\b/i,
  /\bwhat you discover\b/i,
  /\bwhat you learn\b/i,
  /\bmeaningful change\b/i,
  /\bpurpose\b/i,
  /\bjourney\b/i,
  /\btransformation\b/i,
]

function countWords(text: string): number {
  if (!text) return 0
  // Remove markdown/interaction tags for accurate word count
  const cleanText = text
    .replace(/<[^>]+>/g, '')  // Remove HTML-like tags: <bloom>, <shake>
    .replace(/\{\{[^}]+\}\}/g, '')  // Remove conditional blocks: {{patience>=3:...|}}
    .replace(/\*[^*]+\*/g, '')  // Remove italic stage directions
    .replace(/_([^_]+)_/g, '')  // Remove underscore italic
    .trim()
  return cleanText.split(/\s+/).filter(word => word.length > 0).length
}

function hasStageDirections(text: string): boolean {
  return STAGE_DIRECTION_PATTERNS.some(pattern => pattern.test(text))
}

function hasAbstractLanguage(text: string): boolean {
  return ABSTRACT_PATTERNS.some(pattern => pattern.test(text))
}

function findIssues(text: string): string[] {
  const issues: string[] = []
  
  // Check for stage directions
  if (/\*[^*]+\*/.test(text)) {
    issues.push('Contains italic stage directions (*text*)')
  }
  if (/_([^_]+)_/.test(text)) {
    issues.push('Contains underscore italic (_text_)')
  }
  if (/\bA pause\b/i.test(text)) {
    issues.push('Contains "A pause"')
  }
  if (/\b(His|Her) voice breaks?\b/i.test(text)) {
    issues.push('Contains voice break description')
  }
  if (/\bStudies you\b/i.test(text)) {
    issues.push('Contains action "Studies you"')
  }
  if (/\bNot judgment\b/i.test(text)) {
    issues.push('Contains behavioral description')
  }
  
  // Check for abstract language
  if (/\bdiscover about yourself\b/i.test(text)) {
    issues.push('Abstract: "discover about yourself"')
  }
  if (/\bfind your path\b/i.test(text)) {
    issues.push('Abstract: "find your path"')
  }
  if (/\bwhat you discover\b/i.test(text)) {
    issues.push('Abstract: "what you discover"')
  }
  
  return issues
}

function analyzeNode(character: string, node: DialogueNode): NodeAnalysis[] {
  const analyses: NodeAnalysis[] = []
  
  for (const content of node.content || []) {
    const text = content.text || ''
    const wordCount = countWords(text)
    const charCount = text.length
    const hasStage = hasStageDirections(text)
    const hasAbstract = hasAbstractLanguage(text)
    const issues = findIssues(text)
    
    analyses.push({
      character,
      nodeId: node.nodeId,
      wordCount,
      charCount,
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      hasStageDirections: hasStage,
      hasAbstractLanguage: hasAbstract,
      issues
    })
  }
  
  return analyses
}

function analyzeCharacter(name: string, nodes: DialogueNode[]): NodeAnalysis[] {
  const allAnalyses: NodeAnalysis[] = []
  
  for (const node of nodes) {
    allAnalyses.push(...analyzeNode(name, node))
  }
  
  return allAnalyses
}

async function main() {
  const characterFilter = process.argv.find(arg => arg.startsWith('--character='))?.split('=')[1]
  
  console.log('\n📊 Text Density Analysis')
  console.log('═'.repeat(80))
  
  const allCharacters = [
    { name: 'samuel', nodes: samuelDialogueNodes },
    { name: 'maya', nodes: mayaDialogueNodes },
    { name: 'maya-revisit', nodes: mayaRevisitNodes },
    { name: 'devon', nodes: devonDialogueNodes },
    { name: 'jordan', nodes: jordanDialogueNodes },
    { name: 'tess', nodes: tessDialogueNodes },
    { name: 'marcus', nodes: marcusDialogueNodes },
    { name: 'rohan', nodes: rohanDialogueNodes },
    { name: 'yaquin', nodes: yaquinDialogueNodes },
    { name: 'yaquin-revisit', nodes: yaquinRevisitNodes },
    { name: 'kai', nodes: kaiDialogueNodes },
    { name: 'silas', nodes: silasDialogueNodes },
  ]
  
  const charactersToAnalyze = characterFilter
    ? allCharacters.filter(c => c.name === characterFilter)
    : allCharacters
  
  const allAnalyses: NodeAnalysis[] = []
  
  for (const { name, nodes } of charactersToAnalyze) {
    allAnalyses.push(...analyzeCharacter(name, nodes))
  }
  
  // Sort by word count (highest first)
  allAnalyses.sort((a, b) => b.wordCount - a.wordCount)
  
  // Statistics
  const totalNodes = allAnalyses.length
  const nodesOver80 = allAnalyses.filter(a => a.wordCount > 80).length
  const nodesWithStageDirections = allAnalyses.filter(a => a.hasStageDirections).length
  const nodesWithAbstract = allAnalyses.filter(a => a.hasAbstractLanguage).length
  const avgWordCount = allAnalyses.reduce((sum, a) => sum + a.wordCount, 0) / totalNodes
  
  console.log('\n📈 Overall Statistics:')
  console.log('─'.repeat(80))
  console.log(`Total nodes analyzed: ${totalNodes}`)
  console.log(`Average words per node: ${avgWordCount.toFixed(1)}`)
  console.log(`Nodes >80 words: ${nodesOver80} (${((nodesOver80 / totalNodes) * 100).toFixed(1)}%)`)
  console.log(`Nodes with stage directions: ${nodesWithStageDirections} (${((nodesWithStageDirections / totalNodes) * 100).toFixed(1)}%)`)
  console.log(`Nodes with abstract language: ${nodesWithAbstract} (${((nodesWithAbstract / totalNodes) * 100).toFixed(1)}%)`)
  
  // Top offenders (nodes >80 words)
  const topOffenders = allAnalyses.filter(a => a.wordCount > 80).slice(0, 20)
  
  if (topOffenders.length > 0) {
    console.log('\n🔴 Top Offenders (Nodes >80 words):')
    console.log('─'.repeat(80))
    for (const analysis of topOffenders) {
      console.log(`\n[${analysis.character}] ${analysis.nodeId}`)
      console.log(`  Words: ${analysis.wordCount} | Characters: ${analysis.charCount}`)
      if (analysis.issues.length > 0) {
        console.log(`  Issues: ${analysis.issues.join(', ')}`)
      }
      console.log(`  Preview: ${analysis.text}`)
    }
  }
  
  // Nodes with stage directions
  const stageDirectionNodes = allAnalyses.filter(a => a.hasStageDirections).slice(0, 20)
  
  if (stageDirectionNodes.length > 0) {
    console.log('\n⚠️  Nodes with Stage Directions (to remove):')
    console.log('─'.repeat(80))
    for (const analysis of stageDirectionNodes) {
      console.log(`\n[${analysis.character}] ${analysis.nodeId}`)
      console.log(`  Words: ${analysis.wordCount}`)
      console.log(`  Issues: ${analysis.issues.join(', ')}`)
      console.log(`  Preview: ${analysis.text}`)
    }
  }
  
  // Export JSON for comparison
  const output = {
    timestamp: new Date().toISOString(),
    totalNodes,
    avgWordCount: avgWordCount.toFixed(1),
    nodesOver80,
    nodesWithStageDirections,
    nodesWithAbstract,
    topOffenders: topOffenders.map(a => ({
      character: a.character,
      nodeId: a.nodeId,
      wordCount: a.wordCount,
      issues: a.issues
    })),
    allAnalyses: allAnalyses.map(a => ({
      character: a.character,
      nodeId: a.nodeId,
      wordCount: a.wordCount,
      hasStageDirections: a.hasStageDirections,
      hasAbstractLanguage: a.hasAbstractLanguage,
      issues: a.issues
    }))
  }
  
  const filename = characterFilter 
    ? `text-density-analysis-${characterFilter}-${Date.now()}.json`
    : `text-density-analysis-all-${Date.now()}.json`
  
  // Write to file using Node.js fs/promises
  const { writeFile } = await import('fs/promises')
  await writeFile(filename, JSON.stringify(output, null, 2))
  console.log(`\n💾 Analysis saved to: ${filename}`)
  
  console.log('\n' + '═'.repeat(80))
  console.log('✅ Analysis complete')
  console.log('')
}

main()
