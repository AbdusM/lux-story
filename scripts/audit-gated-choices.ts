/**
 * Audit Script: Gated Choices Analysis
 *
 * Finds all pattern-gated choices and checks if they have fallbacks
 * to ensure no player can get locked out of content.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface GatedChoice {
  file: string
  character: string
  nodeId: string
  choiceText: string
  nextNodeId: string
  gateType: 'visible' | 'enabled'
  patternRequired?: string
  minPatternValue?: number
  hasFallback: boolean
  lineNumber: number
}

const contentDir = path.join(__dirname, '../content')
const dialogueFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('-dialogue-graph.ts'))

const gatedChoices: GatedChoice[] = []
const choicesByDestination: Map<string, GatedChoice[]> = new Map()

console.log('🔍 Auditing Gated Choices...\n')

for (const file of dialogueFiles) {
  const character = file.replace('-dialogue-graph.ts', '')
  const filePath = path.join(contentDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Find all choices with visibleCondition or enabledCondition
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.includes('visibleCondition:') || line.includes('enabledCondition:')) {
      // Extract choice info from preceding lines
      let choiceText = ''
      let nextNodeId = ''
      let choiceId = ''
      let patternRequired = ''
      let minPatternValue = 0

      // Look backwards for choice details
      for (let j = i - 1; j >= Math.max(0, i - 20); j--) {
        if (lines[j].includes('text:')) {
          choiceText = lines[j].match(/text:\s*["'](.+?)["']/)?.[1] || ''
        }
        if (lines[j].includes('nextNodeId:')) {
          nextNodeId = lines[j].match(/nextNodeId:\s*["'](.+?)["']/)?.[1] || ''
        }
        if (lines[j].includes('choiceId:')) {
          choiceId = lines[j].match(/choiceId:\s*["'](.+?)["']/)?.[1] || ''
          break
        }
      }

      // Look forward for pattern condition
      for (let j = i; j < Math.min(lines.length, i + 5); j++) {
        if (lines[j].includes('patterns:')) {
          // Extract pattern and min value
          const patternMatch = lines[j + 1]?.match(/(\w+):\s*{\s*min:\s*(\d+)/)
          if (patternMatch) {
            patternRequired = patternMatch[1]
            minPatternValue = parseInt(patternMatch[2])
          }
        }
      }

      const gatedChoice: GatedChoice = {
        file,
        character,
        nodeId: choiceId.split('_').slice(0, -1).join('_'), // Approximate node ID
        choiceText,
        nextNodeId,
        gateType: line.includes('visibleCondition') ? 'visible' : 'enabled',
        patternRequired,
        minPatternValue,
        hasFallback: false, // We'll check this after collecting all choices
        lineNumber: i + 1
      }

      gatedChoices.push(gatedChoice)

      // Group by destination for fallback detection
      if (!choicesByDestination.has(nextNodeId)) {
        choicesByDestination.set(nextNodeId, [])
      }
      choicesByDestination.get(nextNodeId)!.push(gatedChoice)
    }
  }
}

// Check for fallbacks
// A gated choice has a fallback if there's another choice to the same destination without a gate
for (const [destination, choices] of choicesByDestination.entries()) {
  const gatedChoicesToDest = choices.filter(c => c.patternRequired)
  const ungatedChoicesToDest = choices.filter(c => !c.patternRequired)

  // If there are ungated choices to this destination, mark gated ones as having fallbacks
  if (ungatedChoicesToDest.length > 0) {
    gatedChoicesToDest.forEach(c => c.hasFallback = true)
  }
}

// Generate report
console.log(`Found ${gatedChoices.length} pattern-gated choices:\n`)

const byCharacter = gatedChoices.reduce((acc, choice) => {
  if (!acc[choice.character]) acc[choice.character] = []
  acc[choice.character].push(choice)
  return acc
}, {} as Record<string, GatedChoice[]>)

for (const [character, choices] of Object.entries(byCharacter)) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📖 ${character.toUpperCase()} (${choices.length} gated choices)`)
  console.log('='.repeat(60))

  choices.forEach((choice, idx) => {
    console.log(`\n${idx + 1}. ${choice.choiceText}`)
    console.log(`   → Leads to: ${choice.nextNodeId}`)
    console.log(`   → Gate: ${choice.gateType} | Requires: ${choice.patternRequired} >= ${choice.minPatternValue}`)
    console.log(`   → Has Fallback: ${choice.hasFallback ? '✅ YES' : '❌ NO'}`)
    console.log(`   → Location: ${choice.file}:${choice.lineNumber}`)
  })
}

// Summary statistics
const withFallbacks = gatedChoices.filter(c => c.hasFallback).length
const withoutFallbacks = gatedChoices.filter(c => !c.hasFallback).length

console.log(`\n\n${'='.repeat(60)}`)
console.log('📊 SUMMARY')
console.log('='.repeat(60))
console.log(`Total Gated Choices: ${gatedChoices.length}`)
console.log(`With Fallbacks: ${withFallbacks} ✅`)
console.log(`Without Fallbacks: ${withoutFallbacks} ${withoutFallbacks > 0 ? '⚠️' : '✅'}`)

if (withoutFallbacks > 0) {
  console.log(`\n⚠️  WARNING: ${withoutFallbacks} gated choices have NO fallback paths!`)
  console.log('   Players with low patterns might hit dead ends.\n')

  console.log('Choices needing fallbacks:')
  gatedChoices.filter(c => !c.hasFallback).forEach(choice => {
    console.log(`   - ${choice.character}: "${choice.choiceText}"`)
    console.log(`     ${choice.file}:${choice.lineNumber}`)
  })
} else {
  console.log('\n✅ All gated choices have fallback paths!')
}

console.log('')
