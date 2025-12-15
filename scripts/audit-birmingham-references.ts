/**
 * Audit Script: Birmingham Location References
 *
 * Verifies Birmingham locations are mentioned in dialogue
 * Exploring unlock shows tooltips for Birmingham locations
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Birmingham locations from unlock-effects.ts
const BIRMINGHAM_LOCATIONS = [
  'UAB',
  'University of Alabama at Birmingham',
  'Innovation Depot',
  'Children\'s of Alabama',
  'Childrens Hospital',
  'Sloss Furnaces',
  'Railroad Park',
  'Vulcan Park',
  'Regions Field',
  'Woodlawn',
  'Covalence',
  'Protective Life',
  'Nucor Steel',
  'Lawson State',
  'Mercedes-Benz'
]

const contentDir = path.join(__dirname, '../content')
const dialogueFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('-dialogue-graph.ts'))

const findings: Record<string, Array<{ character: string; line: number; context: string }>> = {}

console.log('📍 Auditing Birmingham Location References...\n')

// Initialize findings
BIRMINGHAM_LOCATIONS.forEach(loc => findings[loc] = [])

for (const file of dialogueFiles) {
  const character = file.replace('-dialogue-graph.ts', '')
  const filePath = path.join(contentDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    for (const location of BIRMINGHAM_LOCATIONS) {
      if (line.includes(location)) {
        // Get context (extract text if it's in a text field)
        const textMatch = line.match(/text:\s*["'`](.{0,80})/)
        const context = textMatch ? textMatch[1] + '...' : line.trim().substring(0, 80) + '...'

        findings[location].push({
          character,
          line: i + 1,
          context
        })
      }
    }
  }
}

// Generate report
console.log('═'.repeat(70))
console.log('📊 BIRMINGHAM LOCATION REFERENCES')
console.log('═'.repeat(70))

const locationsUsed = BIRMINGHAM_LOCATIONS.filter(loc => findings[loc].length > 0)
const locationsUnused = BIRMINGHAM_LOCATIONS.filter(loc => findings[loc].length === 0)

console.log(`\nLocations Referenced: ${locationsUsed.length}/${BIRMINGHAM_LOCATIONS.length}`)
console.log(`Total References: ${Object.values(findings).reduce((sum, arr) => sum + arr.length, 0)}`)

console.log('\n✅ LOCATIONS USED:')
console.log('─'.repeat(70))

locationsUsed.forEach(location => {
  const refs = findings[location]
  console.log(`\n📍 ${location} (${refs.length} reference${refs.length > 1 ? 's' : ''})`)

  refs.forEach((ref, idx) => {
    if (idx < 2) { // Show first 2 references
      console.log(`   ${ref.character}: "${ref.context}"`)
    }
  })

  if (refs.length > 2) {
    console.log(`   ... and ${refs.length - 2} more`)
  }
})

if (locationsUnused.length > 0) {
  console.log('\n\n❌ LOCATIONS NOT USED:')
  console.log('─'.repeat(70))
  locationsUnused.forEach(loc => console.log(`   - ${loc}`))
}

// Character breakdown
console.log('\n\n═'.repeat(70))
console.log('📊 REFERENCES BY CHARACTER')
console.log('═'.repeat(70))

const byCharacter: Record<string, number> = {}
BIRMINGHAM_LOCATIONS.forEach(loc => {
  findings[loc].forEach(ref => {
    byCharacter[ref.character] = (byCharacter[ref.character] || 0) + 1
  })
})

const sorted = Object.entries(byCharacter).sort((a, b) => b[1] - a[1])

sorted.forEach(([char, count]) => {
  console.log(`${char.padEnd(12)} ${count} reference${count > 1 ? 's' : ''}`)
})

// Recommendations
console.log('\n\n═'.repeat(70))
console.log('💡 RECOMMENDATIONS')
console.log('═'.repeat(70))

const coverage = (locationsUsed.length / BIRMINGHAM_LOCATIONS.length) * 100

if (coverage >= 80) {
  console.log('✅ Excellent Birmingham location coverage!')
  console.log('   Exploring unlock will have rich context to show.')
} else if (coverage >= 50) {
  console.log('⚠️  Good location coverage, but could be enhanced.')
} else {
  console.log('❌ Low location coverage for Birmingham unlock.')
}

console.log('\n💡 Exploring Unlock Impact:')
console.log('   - Shows tooltips when Birmingham locations mentioned')
console.log(`   - Currently: ${locationsUsed.length} locations will trigger tooltips`)
console.log(`   - Unused: ${locationsUnused.length} locations have no mentions`)

if (locationsUnused.length > 0) {
  console.log('\n💡 Consider adding mentions of:')
  locationsUnused.slice(0, 5).forEach(loc => console.log(`   - ${loc}`))
}

console.log('')
