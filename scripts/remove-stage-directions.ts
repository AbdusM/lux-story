/**
 * Remove Stage Directions Script
 * 
 * Systematically removes all remaining stage directions from dialogue graphs
 * Stage directions are text in asterisks like *He smiles* or *After a pause*
 * 
 * Run: npx tsx scripts/remove-stage-directions.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const DIALOGUE_FILES = [
  'content/samuel-dialogue-graph.ts',
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts',
  'content/jordan-dialogue-graph.ts',
]

// Patterns to remove
const STAGE_DIRECTION_PATTERNS = [
  // Simple emotional/action stage directions like *He smiles*
  /\*[A-Z][a-z]+ [a-z]+\*\n\n/g,
  /\n\n\*[A-Z][a-z]+ [a-z]+\*\n\n/g,
  /\n\n\*[A-Z][a-z]+ [a-z]+\*/g,
  
  // More complex ones like *He pauses thoughtfully*
  /\*[A-Z][a-z]+ [a-z]+ [a-z]+\*\n\n/g,
  /\n\n\*[A-Z][a-z]+ [a-z]+ [a-z]+\*\n\n/g,
  /\n\n\*[A-Z][a-z]+ [a-z]+ [a-z]+\*/g,
  
  // Even more complex like *He smiles, a quiet satisfaction in his expression*
  /\*[A-Z][a-z]+ [a-z]+[^*]{1,80}\*\n\n/g,
  /\n\n\*[A-Z][a-z]+ [a-z]+[^*]{1,80}\*\n\n/g,
  /\n\n\*[A-Z][a-z]+ [a-z]+[^*]{1,80}\*/g,
  
  // Short directions at start
  /\*[A-Z][a-z]+ [a-z]+[^*]{1,80}\*\n\n/g,
  
  // Single word directions
  /\*Pause\*\n\n/g,
  /\n\n\*Pause\*\n\n/g,
  /\n\n\*Pause\*/g,
  /\*Quiet\*\n\n/g,
  /\n\n\*Quiet\*\n\n/g,
  /\n\n\*Quiet\*/g,
  
  // More specific patterns
  /\*Long pause\*\n\n/g,
  /\n\n\*Long pause\*\n\n/g,
  /\n\n\*Long pause\*/g,
]

function removeStageDirections(content: string): string {
  let cleaned = content
  
  // Apply all patterns
  for (const pattern of STAGE_DIRECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, '')
  }
  
  // Clean up any remaining triple line breaks
  cleaned = cleaned.replace(/\n\n\n+/g, '\n\n')
  
  return cleaned
}

function main() {
  console.log('🎭 Removing stage directions from dialogue graphs...\n')
  
  let totalChanges = 0
  
  for (const file of DIALOGUE_FILES) {
    const filePath = path.join(process.cwd(), file)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`)
      continue
    }
    
    const original = fs.readFileSync(filePath, 'utf-8')
    const cleaned = removeStageDirections(original)
    
    if (original === cleaned) {
      console.log(`✅ ${file} - No changes needed`)
    } else {
      fs.writeFileSync(filePath, cleaned, 'utf-8')
      const changeCount = (original.match(/\*/g) || []).length - (cleaned.match(/\*/g) || []).length
      totalChanges += changeCount / 2 // Each stage direction has 2 asterisks
      console.log(`🔧 ${file} - Removed ~${changeCount / 2} stage directions`)
    }
  }
  
  console.log(`\n✨ Complete! Removed approximately ${totalChanges} stage directions total.`)
  console.log('\n💡 Run tests to verify: npm test content-spoiler-detection')
}

main()

