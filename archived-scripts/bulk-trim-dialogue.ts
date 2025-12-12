/**
 * Bulk Dialogue Trimming Script
 * 
 * Applies intelligent trimming patterns to reduce wordiness
 * Based on manual patterns identified during initial trimming:
 * - Remove redundant context/setup
 * - Cut explanatory bloat ("that's the thing", "what I mean is")
 * - Convert full sentences to fragments
 * - Remove repetitive emotional labels
 * 
 * Run: npx tsx scripts/bulk-trim-dialogue.ts --dry-run
 * Apply: npx tsx scripts/bulk-trim-dialogue.ts --apply
 */

import * as fs from 'fs'
import * as path from 'path'

const DIALOGUE_FILES = [
  'content/samuel-dialogue-graph.ts',
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts',
  'content/jordan-dialogue-graph.ts',
]

// Intelligent trimming patterns (safe, semantic-preserving)
const TRIM_RULES = [
  // Redundant emotional framing
  { from: /It's more than okay[—\-,]\s*/gi, to: '' },
  { from: /That's the most important thing you could understand about what just happened\./gi, to: "That's the most important thing." },
  
  // Wordy setup/context
  { from: /Let me (tell you|explain|paint the (full )?picture)[—:,]\s*/gi, to: '' },
  { from: /Fair question\.\s*/gi, to: '' },
  { from: /Here's (what's interesting|the thing)[—:,]\s*/gi, to: '' },
  { from: /The thing is[—:,]\s*/gi, to: '' },
  { from: /What I'm trying to say is[—:,]\s*/gi, to: '' },
  { from: /You know what'?s (funny|interesting|strange)\?\s*/gi, to: '' },
  
  // Redundant clarifications
  { from: /\(that's|that is\) /gi, to: '' },
  { from: / - that's /gi, to: '. ' },
  { from: /\. That means /gi, to: '. ' },
  
  // Wordy comparisons
  { from: /instead of /gi, to: 'not ' },
  { from: /rather than /gi, to: 'not ' },
  { from: /as opposed to /gi, to: 'not ' },
  
  // Explanation after the fact
  { from: /\. Because /gi, to: '. ' },
  { from: /\. And that's /gi, to: '. ' },
  
  // Redundant transitions
  { from: /\\n\\nAnd /g, to: '\\n\\n' },
  { from: /\\n\\nBut /g, to: '\\n\\n' },
  { from: /\\n\\nSo /g, to: '\\n\\n' },
  
  // Wordy questions  
  { from: /Do you (understand|see|know) (what|how|why) I (mean|'m saying)\?/gi, to: '' },
  { from: /Does that make sense\?/gi, to: '' },
  { from: /, (right|you know)\?/gi, to: '?' },
  
  // Triple line breaks from edits
  { from: /\\n\\n\\n+/g, to: '\\n\\n' },
  
  // Multiple spaces
  { from: /  +/g, to: ' ' },
  
  // Clean up orphaned punctuation
  { from: /\s+\./g, to: '.' },
  { from: /\.\s+,/g, to: '.' },
]

function applyTrimRules(text: string): string {
  let trimmed = text
  
  for (const rule of TRIM_RULES) {
    trimmed = trimmed.replace(rule.from, rule.to)
  }
  
  // Final cleanup
  trimmed = trimmed.trim()
  trimmed = trimmed.replace(/^\s+/gm, '')  // Leading whitespace per line
  
  return trimmed
}

function processFile(filePath: string, apply: boolean) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const original = content
  
  // Apply trimming to all text: "..." fields
  const processed = content.replace(
    /text:\s*"([^"]+)"/g,
    (match, capturedText) => {
      const trimmed = applyTrimRules(capturedText)
      // Only replace if it actually reduced length
      return trimmed.length < capturedText.length ? `text: "${trimmed}"` : match
    }
  )
  
  const reduction = original.length - processed.length
  const percentReduction = ((reduction / original.length) * 100).toFixed(1)
  
  if (apply && reduction > 0) {
    fs.writeFileSync(filePath, processed, 'utf-8')
  }
  
  return {
    file: path.basename(filePath),
    before: original.length,
    after: processed.length,
    reduction,
    percent: percentReduction
  }
}

function main() {
  const args = process.argv.slice(2)
  const apply = args.includes('--apply')
  const mode = apply ? '🔧 APPLYING CHANGES' : '🔍 DRY RUN'
  
  console.log(`${mode}: Bulk Dialogue Trimming`)
  console.log('='.repeat(80))
  console.log('')
  
  const results = []
  
  for (const file of DIALOGUE_FILES) {
    const filePath = path.join(process.cwd(), file)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)\n`)
      continue
    }
    
    const result = processFile(filePath, apply)
    results.push(result)
    
    console.log(`📁 ${result.file}`)
    console.log(`   Reduction: ${result.reduction} chars (${result.percent}%)`)
    console.log('')
  }
  
  const totalBefore = results.reduce((sum, r) => sum + r.before, 0)
  const totalAfter = results.reduce((sum, r) => sum + r.after, 0)
  const totalReduction = totalBefore - totalAfter
  const totalPercent = ((totalReduction / totalBefore) * 100).toFixed(1)
  
  console.log('='.repeat(80))
  console.log('')
  console.log('📊 TOTAL IMPACT')
  console.log(`   Total reduction: ${totalReduction} chars (${totalPercent}%)`)
  console.log('')
  
  if (!apply) {
    console.log('💡 To apply changes: npx tsx scripts/bulk-trim-dialogue.ts --apply')
    console.log('⚠️  Review changes before committing!')
  } else {
    console.log('✅ Changes applied')
    console.log('📊 Run analysis: npx tsx scripts/analyze-dialogue-length.ts')
  }
}

main()

