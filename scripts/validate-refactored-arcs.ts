/**
 * Validation script for Pokémon-style refactored dialogue arcs
 * Tests Marcus, Tess, and Yaquin for refactor quality metrics
 */

import { marcusDialogueGraph } from '../content/marcus-dialogue-graph'
import { tessDialogueGraph } from '../content/tess-dialogue-graph'
import { yaquinDialogueGraph } from '../content/yaquin-dialogue-graph'

// Valid emotion tags
const VALID_EMOTIONS = [
  'focused', 'tense', 'clinical', 'simulation', 'critical', 'failure',
  'exhausted', 'proud', 'regret', 'reflective', 'analytical', 'conflicted',
  'passionate', 'determined', 'curious', 'inspired', 'vulnerable',
  'anxious', 'excited', 'grateful', 'heavy', 'relieved'
]

// Valid interaction tags
const VALID_INTERACTIONS = ['shake', 'jitter', 'nod', 'bloom', 'ripple', 'big', 'small']

interface ValidationResult {
  arcName: string
  totalNodes: number
  passed: boolean
  errors: string[]
  warnings: string[]
  stats: {
    emotionTags: number
    interactionTags: number
    chatPacingNodes: number
    totalChoices: number
    averageWordCount: number
  }
}

function validateArc(arcName: string, graph: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const stats = {
    emotionTags: 0,
    interactionTags: 0,
    chatPacingNodes: 0,
    totalChoices: 0,
    averageWordCount: 0
  }

  const nodeArray = Array.from(graph.nodes.values())
  const totalNodes = nodeArray.length
  let totalWords = 0

  console.log(`\n${'='.repeat(60)}`)
  console.log(`VALIDATING: ${arcName} Arc (${totalNodes} nodes)`)
  console.log('='.repeat(60))

  nodeArray.forEach((node: any) => {
    // Check text exists
    if (!node.text || node.text.trim().length === 0) {
      errors.push(`${node.id}: Empty text`)
    } else {
      // Count words
      const wordCount = node.text.trim().split(/\s+/).length
      totalWords += wordCount
    }

    // Validate emotion
    if (node.emotion) {
      stats.emotionTags++
      const emotionLower = node.emotion.toLowerCase()
      const isValid = VALID_EMOTIONS.some(valid =>
        emotionLower.includes(valid.toLowerCase())
      )
      if (!isValid) {
        warnings.push(`${node.id}: Unknown emotion "${node.emotion}"`)
      }
    }

    // Validate interaction
    if (node.interaction) {
      stats.interactionTags++
      if (!VALID_INTERACTIONS.includes(node.interaction)) {
        errors.push(`${node.id}: Invalid interaction "${node.interaction}"`)
      }
    }

    // Check chat pacing
    if (node.useChatPacing) {
      stats.chatPacingNodes++
      if (!node.text.includes('|')) {
        warnings.push(`${node.id}: useChatPacing=true but no | separators`)
      }
    }

    // Count choices
    if (node.choices) {
      stats.totalChoices += node.choices.length

      node.choices.forEach((choice: any) => {
        if (!choice.text || choice.text.trim().length === 0) {
          errors.push(`${node.id}: Choice ${choice.choiceId} has empty text`)
        }

        // Validate nextNodeId references
        if (choice.nextNodeId && !graph.nodes.has(choice.nextNodeId)) {
          errors.push(`${node.id}: Choice references missing node "${choice.nextNodeId}"`)
        }
      })
    }
  })

  stats.averageWordCount = Math.round(totalWords / totalNodes)

  // Calculate coverage
  const emotionCoverage = ((stats.emotionTags / totalNodes) * 100).toFixed(1)
  const interactionCoverage = ((stats.interactionTags / totalNodes) * 100).toFixed(1)
  const chatPacingCoverage = ((stats.chatPacingNodes / totalNodes) * 100).toFixed(1)

  console.log(`\n📊 STATISTICS:`)
  console.log(`   Total Nodes: ${totalNodes}`)
  console.log(`   Average Word Count: ${stats.averageWordCount} words/node`)
  console.log(`   Emotion Tags: ${stats.emotionTags}/${totalNodes} (${emotionCoverage}%)`)
  console.log(`   Interaction Tags: ${stats.interactionTags}/${totalNodes} (${interactionCoverage}%)`)
  console.log(`   Chat Pacing: ${stats.chatPacingNodes}/${totalNodes} (${chatPacingCoverage}%)`)
  console.log(`   Total Choices: ${stats.totalChoices}`)

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`)
    errors.forEach(e => console.log(`   - ${e}`))
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`)
    warnings.slice(0, 10).forEach(w => console.log(`   - ${w}`))
    if (warnings.length > 10) {
      console.log(`   ... and ${warnings.length - 10} more warnings`)
    }
  }

  const passed = errors.length === 0

  if (passed) {
    console.log(`\n✅ ${arcName}: VALIDATION PASSED`)
  } else {
    console.log(`\n❌ ${arcName}: VALIDATION FAILED (${errors.length} errors)`)
  }

  return {
    arcName,
    totalNodes,
    passed,
    errors,
    warnings,
    stats
  }
}

// Run validations
console.log('\n' + '='.repeat(60))
console.log('POKÉMON-STYLE REFACTOR - VALIDATION TEST')
console.log('Testing: Marcus, Tess, Yaquin')
console.log('='.repeat(60))

const results: ValidationResult[] = [
  validateArc('Marcus', marcusDialogueGraph),
  validateArc('Tess', tessDialogueGraph),
  validateArc('Yaquin', yaquinDialogueGraph)
]

// Summary
console.log('\n' + '='.repeat(60))
console.log('SUMMARY')
console.log('='.repeat(60))

let totalNodes = 0
let totalErrors = 0
let totalWarnings = 0

console.log('\n| Arc     | Nodes | Avg Words | Emotions | Interactions | Chat Pacing | Errors | Warnings |')
console.log('|---------|-------|-----------|----------|--------------|-------------|--------|----------|')

results.forEach(r => {
  totalNodes += r.totalNodes
  totalErrors += r.errors.length
  totalWarnings += r.warnings.length

  const emotionPct = ((r.stats.emotionTags / r.totalNodes) * 100).toFixed(0)
  const interactionPct = ((r.stats.interactionTags / r.totalNodes) * 100).toFixed(0)
  const pacingPct = ((r.stats.chatPacingNodes / r.totalNodes) * 100).toFixed(0)

  console.log(
    `| ${r.arcName.padEnd(7)} | ${String(r.totalNodes).padEnd(5)} | ${String(r.stats.averageWordCount).padEnd(9)} | ${String(r.stats.emotionTags).padEnd(8)} | ${String(r.stats.interactionTags).padEnd(12)} | ${String(r.stats.chatPacingNodes).padEnd(11)} | ${String(r.errors.length).padEnd(6)} | ${String(r.warnings.length).padEnd(8)} |`
  )
})

console.log('\n📈 TOTALS:')
console.log(`   Total Nodes Validated: ${totalNodes}`)
console.log(`   Total Errors: ${totalErrors}`)
console.log(`   Total Warnings: ${totalWarnings}`)

const allPassed = results.every(r => r.passed)

if (allPassed) {
  console.log('\n✅ ALL REFACTORED ARCS PASSED VALIDATION')
  console.log('Ready for browser testing (emotions, animations, chat pacing)')
  process.exit(0)
} else {
  console.log('\n❌ SOME ARCS FAILED VALIDATION')
  console.log('Fix errors before proceeding to browser tests')
  process.exit(1)
}
