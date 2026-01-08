import * as fs from 'fs'
import { detectArchetype } from '../lib/voice-templates/template-archetypes.js'

const files = fs.readdirSync('./content').filter(f => f.endsWith('-dialogue-graph.ts'))

const undetected: string[] = []
for (const file of files) {
  const content = fs.readFileSync('./content/' + file, 'utf-8')
  const textMatches = content.match(/text:\s*['"]([^'"]+)['"]/g) || []
  for (const match of textMatches) {
    const textMatch = match.match(/text:\s*['"]([^'"]+)['"]/)
    if (textMatch) {
      const text = textMatch[1]
      if (text.length > 10 && text.length < 100 && !detectArchetype(text)) {
        undetected.push(text)
      }
    }
  }
}

// Show first word distribution for undetected
const firstWords: Record<string, number> = {}
for (const text of undetected) {
  const firstWord = text.split(/[\s,]/)[0]
  firstWords[firstWord] = (firstWords[firstWord] || 0) + 1
}

const sorted = Object.entries(firstWords).sort((a, b) => b[1] - a[1])
console.log('Undetected patterns by first word (top 25):')
for (const [word, count] of sorted.slice(0, 25)) {
  console.log(`  ${word}: ${count}`)
}

console.log('\n\nSample undetected texts:')
for (const text of undetected.slice(0, 30)) {
  console.log(`  - ${text}`)
}
