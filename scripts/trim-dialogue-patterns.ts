/**
 * Dialogue Trimming Script
 * 
 * Applies common word economy patterns to reduce dialogue bloat
 * Based on "cut 30-50%" principle from game dialogue best practices
 * 
 * Run: npx tsx scripts/trim-dialogue-patterns.ts --dry-run
 * Apply: npx tsx scripts/trim-dialogue-patterns.ts --apply
 */

import * as fs from 'fs'
import * as path from 'path'

const DIALOGUE_FILES = [
  'content/samuel-dialogue-graph.ts',
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts',
  'content/jordan-dialogue-graph.ts',
]

// Common bloat patterns to remove/simplify
const TRIM_PATTERNS = [
  // Filler phrases
  { pattern: /\bhonestly,?\s+/gi, replacement: '' },
  { pattern: /\breally,?\s+/gi, replacement: '' },
  { pattern: /\bI mean,?\s+/gi, replacement: '' },
  { pattern: /\byou know,?\s+/gi, replacement: '' },
  { pattern: /\bkind of\s+/gi, replacement: '' },
  { pattern: /\bsort of\s+/gi, replacement: '' },
  
  // Redundant clarifications
  { pattern: /\bHere's the thing[—:]\s+/gi, replacement: '' },
  { pattern: /\bThat's the thing[—:]\s+/gi, replacement: '' },
  { pattern: /\bThe thing is[—:,]\s+/gi, replacement: '' },
  
  // Wordy transitions
  { pattern: /\bLet me (tell you|explain|paint the picture)[—:,]\s+/gi, replacement: '' },
  { pattern: /\bWhat I'm trying to say is[—:,]\s+/gi, replacement: '' },
  { pattern: /\bTo put it simply[—:,]\s+/gi, replacement: '' },
  
  // Redundant emphasis
  { pattern: /\bI think that\s+/gi, replacement: 'I think ' },
  { pattern: /\bI feel like\s+/gi, replacement: '' },
  { pattern: /\bIt's like\s+/gi, replacement: '' },
  
  // Triple line breaks (from edits)
  { pattern: /\\n\\n\\n+/g, replacement: '\\n\\n' },
  
  // Double spaces
  { pattern: /  +/g, replacement: ' ' },
]

function trimDialogue(text: string): string {
  let trimmed = text
  
  for (const { pattern, replacement } of TRIM_PATTERNS) {
    trimmed = trimmed.replace(pattern, replacement)
  }
  
  // Clean up any artifacts
  trimmed = trimmed.replace(/^\s+/, '')  // Leading whitespace
  trimmed = trimmed.replace(/\s+$/, '')  // Trailing whitespace
  trimmed = trimmed.replace(/\s+([.!?,;:])/g, '$1')  // Space before punctuation
  
  return trimmed
}

function processFile(filePath: string, apply: boolean): { before: number; after: number; changeCount: number } {
  const content = fs.readFileSync(filePath, 'utf-8')
  const beforeLength = content.length
  
  // Replace text content while preserving structure
  const processed = content.replace(
    /text:\s*"([^"]+)"/g,
    (match, capturedText) => {
      const trimmed = trimDialogue(capturedText)
      return `text: "${trimmed}"`
    }
  )
  
  const afterLength = processed.length
  const changeCount = beforeLength - afterLength
  
  if (apply && changeCount > 0) {
    fs.writeFileSync(filePath, processed, 'utf-8')
  }
  
  return {
    before: beforeLength,
    after: afterLength,
    changeCount
  }
}

function main() {
  const args = process.argv.slice(2)
  const apply = args.includes('--apply')
  const mode = apply ? '🔧 APPLYING' : '🔍 DRY RUN'
  
  console.log(`${mode}: Dialogue Trimming`)
  console.log('='.repeat(80))
  console.log('')
  
  let totalBefore = 0
  let totalAfter = 0
  
  for (const file of DIALOGUE_FILES) {
    const filePath = path.join(process.cwd(), file)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`)
      continue
    }
    
    const result = processFile(filePath, apply)
    totalBefore += result.before
    totalAfter += result.after
    
    const percentReduction = ((result.changeCount / result.before) * 100).toFixed(1)
    
    console.log(`📁 ${file}`)
    console.log(`   Before: ${result.before} chars`)
    console.log(`   After: ${result.after} chars`)
    console.log(`   Saved: ${result.changeCount} chars (${percentReduction}%)`)
    console.log('')
  }
  
  const totalReduction = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)
  
  console.log('='.repeat(80))
  console.log('')
  console.log('📊 TOTAL IMPACT')
  console.log(`   Before: ${totalBefore} chars`)
  console.log(`   After: ${totalAfter} chars`)
  console.log(`   Reduction: ${totalBefore - totalAfter} chars (${totalReduction}%)`)
  console.log('')
  
  if (!apply) {
    console.log('💡 To apply changes, run: npx tsx scripts/trim-dialogue-patterns.ts --apply')
  } else {
    console.log('✅ Changes applied! Run tests to verify: npm test content-spoiler-detection')
  }
}

main()

