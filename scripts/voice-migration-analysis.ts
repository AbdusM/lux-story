/**
 * Voice Migration Analysis Script
 *
 * Analyzes existing dialogue content to understand:
 * 1. Current voiceVariations coverage
 * 2. Archetype detection rates
 * 3. Migration opportunities
 *
 * Run with: npx tsx scripts/voice-migration-analysis.ts
 */

import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { detectArchetype, getArchetypeNames } from '../lib/voice-templates/template-archetypes'
import { detectArchetypeWithConfidence } from '../lib/voice-templates/template-resolver'
import type { TemplateArchetype } from '../lib/voice-templates/template-types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONTENT_DIR = join(__dirname, '..', 'content')

interface ChoiceInfo {
  file: string
  nodeId: string
  choiceId: string
  text: string
  hasVoiceVariations: boolean
  detectedArchetype: TemplateArchetype | null
  confidence: number
}

interface AnalysisResult {
  totalChoices: number
  withVoiceVariations: number
  withDetectableArchetype: number
  withHighConfidence: number
  byArchetype: Record<TemplateArchetype | 'UNDETECTED', number>
  byFile: Record<string, { total: number; covered: number }>
  gaps: ChoiceInfo[]
}

function analyzeDialogueGraphs(): AnalysisResult {
  const result: AnalysisResult = {
    totalChoices: 0,
    withVoiceVariations: 0,
    withDetectableArchetype: 0,
    withHighConfidence: 0,
    byArchetype: {
      ASK_FOR_DETAILS: 0,
      STAY_SILENT: 0,
      ACKNOWLEDGE_EMOTION: 0,
      EXPRESS_CURIOSITY: 0,
      OFFER_SUPPORT: 0,
      CHALLENGE_ASSUMPTION: 0,
      SHOW_UNDERSTANDING: 0,
      TAKE_ACTION: 0,
      REFLECT_BACK: 0,
      SET_BOUNDARY: 0,
      MAKE_OBSERVATION: 0,
      SIMPLE_CONTINUE: 0,
      AFFIRM_CHOICE: 0,
      SHARE_PERSPECTIVE: 0,
      UNDETECTED: 0
    },
    byFile: {},
    gaps: []
  }

  // Find all dialogue graph files
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('-dialogue-graph.ts'))

  for (const file of files) {
    const filePath = join(CONTENT_DIR, file)
    const content = readFileSync(filePath, 'utf-8')

    // Initialize file stats
    result.byFile[file] = { total: 0, covered: 0 }

    // Extract choices using regex (simpler than full TS parsing)
    const choicePattern = /choices:\s*\[([\s\S]*?)\]/g
    const textPattern = /text:\s*['"`]([^'"`]+)['"`]/g
    const voicePattern = /voiceVariations:\s*\{/

    let match
    while ((match = choicePattern.exec(content)) !== null) {
      const choicesBlock = match[1]

      // Find each choice's text
      let textMatch
      const texts: string[] = []
      while ((textMatch = textPattern.exec(choicesBlock)) !== null) {
        texts.push(textMatch[1])
      }

      for (const text of texts) {
        result.totalChoices++
        result.byFile[file].total++

        // Check for voiceVariations near this text
        const textIndex = content.indexOf(`text: '${text}'`) !== -1
          ? content.indexOf(`text: '${text}'`)
          : content.indexOf(`text: "${text}"`)

        const nearbyContent = textIndex !== -1
          ? content.substring(textIndex, textIndex + 500)
          : ''

        const hasVoiceVariations = voicePattern.test(nearbyContent)

        if (hasVoiceVariations) {
          result.withVoiceVariations++
          result.byFile[file].covered++
        }

        // Detect archetype
        const detection = detectArchetypeWithConfidence(text)

        if (detection.archetype) {
          result.withDetectableArchetype++
          result.byArchetype[detection.archetype]++

          if (detection.confidence >= 0.7) {
            result.withHighConfidence++
            if (!hasVoiceVariations) {
              result.byFile[file].covered++ // Can be covered by template
            }
          }
        } else {
          result.byArchetype.UNDETECTED++

          if (!hasVoiceVariations) {
            result.gaps.push({
              file,
              nodeId: 'unknown',
              choiceId: 'unknown',
              text: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
              hasVoiceVariations: false,
              detectedArchetype: null,
              confidence: 0
            })
          }
        }
      }
    }
  }

  return result
}

function printReport(result: AnalysisResult): void {
  console.log('\n' + '='.repeat(60))
  console.log('VOICE VARIATION MIGRATION ANALYSIS')
  console.log('='.repeat(60) + '\n')

  // Overall stats
  console.log('OVERALL COVERAGE')
  console.log('-'.repeat(40))
  console.log(`Total Choices:              ${result.totalChoices}`)
  console.log(`With voiceVariations:       ${result.withVoiceVariations} (${((result.withVoiceVariations / result.totalChoices) * 100).toFixed(1)}%)`)
  console.log(`Detectable Archetype:       ${result.withDetectableArchetype} (${((result.withDetectableArchetype / result.totalChoices) * 100).toFixed(1)}%)`)
  console.log(`High Confidence (>=70%):    ${result.withHighConfidence} (${((result.withHighConfidence / result.totalChoices) * 100).toFixed(1)}%)`)

  const effectiveCoverage = result.withVoiceVariations + (result.withHighConfidence - result.withVoiceVariations)
  console.log(`\nEffective Coverage:         ${effectiveCoverage} (${((effectiveCoverage / result.totalChoices) * 100).toFixed(1)}%)`)
  console.log(`  (custom voiceVariations + auto-detectable)`)

  // Archetype distribution
  console.log('\n\nARCHETYPE DISTRIBUTION')
  console.log('-'.repeat(40))

  const sortedArchetypes = Object.entries(result.byArchetype)
    .sort((a, b) => b[1] - a[1])

  for (const [archetype, count] of sortedArchetypes) {
    const pct = ((count / result.totalChoices) * 100).toFixed(1)
    const bar = '█'.repeat(Math.round(count / result.totalChoices * 30))
    console.log(`${archetype.padEnd(22)} ${String(count).padStart(4)} (${pct.padStart(5)}%) ${bar}`)
  }

  // Per-file coverage
  console.log('\n\nPER-FILE COVERAGE')
  console.log('-'.repeat(40))

  const sortedFiles = Object.entries(result.byFile)
    .sort((a, b) => (b[1].covered / b[1].total) - (a[1].covered / a[1].total))

  for (const [file, stats] of sortedFiles) {
    const pct = stats.total > 0 ? ((stats.covered / stats.total) * 100).toFixed(0) : '0'
    const charName = file.replace('-dialogue-graph.ts', '')
    console.log(`${charName.padEnd(20)} ${String(stats.covered).padStart(3)}/${String(stats.total).padStart(3)} (${pct.padStart(3)}%)`)
  }

  // Gaps
  if (result.gaps.length > 0) {
    console.log('\n\nTOP GAPS (choices needing attention)')
    console.log('-'.repeat(40))

    for (const gap of result.gaps.slice(0, 15)) {
      console.log(`[${gap.file.replace('-dialogue-graph.ts', '')}] "${gap.text}"`)
    }

    if (result.gaps.length > 15) {
      console.log(`... and ${result.gaps.length - 15} more`)
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(60))
  console.log('MIGRATION SUMMARY')
  console.log('='.repeat(60))

  const needsWork = result.totalChoices - effectiveCoverage
  console.log(`\n✅ Already covered by voiceVariations: ${result.withVoiceVariations}`)
  console.log(`✅ Auto-coverable by templates:        ${result.withHighConfidence - result.withVoiceVariations}`)
  console.log(`⚠️  Needs manual attention:             ${needsWork}`)

  console.log(`\nWith the template system, effective coverage goes from`)
  console.log(`${((result.withVoiceVariations / result.totalChoices) * 100).toFixed(1)}% → ${((effectiveCoverage / result.totalChoices) * 100).toFixed(1)}%`)
  console.log('')
}

// Run the analysis
const result = analyzeDialogueGraphs()
printReport(result)
