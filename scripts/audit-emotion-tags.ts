/**
 * Audit Script: Emotion Tags Analysis
 *
 * Verifies emotion tags are present for unlock system to surface
 * Analytical and Helping unlocks show emotion tags, so we need coverage
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface EmotionStats {
  character: string
  totalNodes: number
  totalContentVariations: number
  withEmotions: number
  withoutEmotions: number
  emotionCoverage: number
  emotionTypes: Record<string, number>
  sampleWithout: string[]
}

const contentDir = path.join(__dirname, '../content')
const dialogueFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('-dialogue-graph.ts'))

const stats: EmotionStats[] = []

console.log('🎭 Auditing Emotion Tags...\n')

for (const file of dialogueFiles) {
  const character = file.replace('-dialogue-graph.ts', '')
  const filePath = path.join(contentDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  let totalNodes = 0
  let totalContentVariations = 0
  let withEmotions = 0
  let withoutEmotions = 0
  const emotionTypes: Record<string, number> = {}
  const sampleWithout: string[] = []

  // Count nodes
  const nodeMatches = content.match(/nodeId:\s*["']([^"']+)["']/g)
  totalNodes = nodeMatches ? nodeMatches.length : 0

  // Find content blocks
  let inContentArray = false
  let currentText = ''
  let hasEmotion = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Detect content array start
    if (line.includes('content: [')) {
      inContentArray = true
      continue
    }

    // Detect content array end
    if (inContentArray && line.trim() === ']') {
      inContentArray = false
      continue
    }

    // Inside content variation
    if (inContentArray || line.includes('text:')) {
      // Check for text field
      if (line.includes('text:')) {
        const textMatch = line.match(/text:\s*["'`](.{0,50})/)
        currentText = textMatch ? textMatch[1] : ''
        hasEmotion = false
        totalContentVariations++
      }

      // Check for emotion field
      if (line.includes('emotion:')) {
        hasEmotion = true
        const emotionMatch = line.match(/emotion:\s*["']([^"']+)["']/)
        if (emotionMatch) {
          const emotion = emotionMatch[1]
          emotionTypes[emotion] = (emotionTypes[emotion] || 0) + 1
        }
      }

      // End of content variation (closing brace)
      if (line.trim() === '}' || line.trim() === '},') {
        if (currentText) {
          if (hasEmotion) {
            withEmotions++
          } else {
            withoutEmotions++
            if (sampleWithout.length < 3) {
              sampleWithout.push(currentText)
            }
          }
          currentText = ''
        }
      }
    }
  }

  const coverage = totalContentVariations > 0
    ? Math.round((withEmotions / totalContentVariations) * 100)
    : 0

  stats.push({
    character,
    totalNodes,
    totalContentVariations,
    withEmotions,
    withoutEmotions,
    emotionCoverage: coverage,
    emotionTypes,
    sampleWithout
  })
}

// Generate report
console.log('═'.repeat(70))
console.log('📊 EMOTION TAG COVERAGE BY CHARACTER')
console.log('═'.repeat(70))

stats.sort((a, b) => b.emotionCoverage - a.emotionCoverage)

for (const stat of stats) {
  const statusIcon = stat.emotionCoverage >= 80 ? '✅' : stat.emotionCoverage >= 50 ? '⚠️' : '❌'

  console.log(`\n${statusIcon} ${stat.character.toUpperCase()}`)
  console.log('─'.repeat(70))
  console.log(`   Nodes: ${stat.totalNodes}`)
  console.log(`   Content Variations: ${stat.totalContentVariations}`)
  console.log(`   With Emotions: ${stat.withEmotions} (${stat.emotionCoverage}%)`)
  console.log(`   Without Emotions: ${stat.withoutEmotions}`)

  if (Object.keys(stat.emotionTypes).length > 0) {
    console.log(`\n   Emotion Types Used (${Object.keys(stat.emotionTypes).length}):`)
    const sorted = Object.entries(stat.emotionTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    sorted.forEach(([emotion, count]) => {
      console.log(`      ${emotion}: ${count}`)
    })
  }

  if (stat.sampleWithout.length > 0) {
    console.log(`\n   Sample without emotions:`)
    stat.sampleWithout.forEach(sample => {
      console.log(`      "${sample}..."`)
    })
  }
}

// Overall statistics
const totalVariations = stats.reduce((sum, s) => sum + s.totalContentVariations, 0)
const totalWithEmotions = stats.reduce((sum, s) => sum + s.withEmotions, 0)
const overallCoverage = Math.round((totalWithEmotions / totalVariations) * 100)

console.log('\n\n' + '═'.repeat(70))
console.log('📈 OVERALL STATISTICS')
console.log('═'.repeat(70))
console.log(`Total Content Variations: ${totalVariations}`)
console.log(`With Emotions: ${totalWithEmotions} (${overallCoverage}%)`)
console.log(`Without Emotions: ${totalVariations - totalWithEmotions}`)

// Collect all emotion types
const allEmotions = new Set<string>()
stats.forEach(s => Object.keys(s.emotionTypes).forEach(e => allEmotions.add(e)))
console.log(`\nUnique Emotion Types: ${allEmotions.size}`)
console.log(`Types: ${Array.from(allEmotions).sort().join(', ')}`)

// Recommendations
console.log('\n\n' + '═'.repeat(70))
console.log('💡 RECOMMENDATIONS')
console.log('═'.repeat(70))

if (overallCoverage >= 80) {
  console.log('✅ Excellent emotion coverage! Unlock system will have rich data.')
} else if (overallCoverage >= 50) {
  console.log('⚠️  Good coverage, but could be improved for better unlock experience.')
} else {
  console.log('❌ Low emotion coverage. Consider adding emotions to key dialogue.')
}

const lowCoverage = stats.filter(s => s.emotionCoverage < 50)
if (lowCoverage.length > 0) {
  console.log(`\n⚠️  Characters needing emotion tags:`)
  lowCoverage.forEach(s => {
    console.log(`   - ${s.character}: ${s.emotionCoverage}% coverage`)
  })
}

console.log('\n💡 Unlock System Impact:')
console.log('   - Analytical unlock (25%): Shows emotion tags')
console.log('   - Helping unlock (25%): Shows emotion tags + trust')
console.log('   → More emotions = Better unlock experience')

console.log('')
