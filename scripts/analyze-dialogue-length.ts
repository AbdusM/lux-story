// @ts-expect-error - ES2018 regex flag, configure tsconfig if needed
/**
 * Dialogue Length Analyzer
 * 
 * Identifies overly long dialogue nodes that need trimming for chat pacing
 * Generates report showing which nodes exceed chat-friendly lengths
 * 
 * Run: npx tsx scripts/analyze-dialogue-length.ts
 */

import * as fs from 'fs'
import * as path from 'path'

interface LongNode {
  file: string
  nodeId: string
  length: number
  text: string
  lineNumber: number
}

const DIALOGUE_FILES = [
  'content/samuel-dialogue-graph.ts',
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts',
  'content/jordan-dialogue-graph.ts',
]

// Chat-friendly thresholds (Netflix-inspired)
const CHAT_FRIENDLY = 120  // Good pacing
const LONG = 180           // Borderline (7-second max read)
const TOO_LONG = 250       // Definitely needs trimming

function analyzeDialogueFile(filePath: string): LongNode[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const longNodes: LongNode[] = []
  
  // Match text: "..." patterns
  const textPattern = /text:\s*"([^"]+)"/g
  let match: RegExpExecArray | null
  
  while ((match = textPattern.exec(content)) !== null) {
    const text = match[1]
    const textLength = text.replace(/\\n/g, '').length  // Exclude newline escape sequences
    
    if (textLength >= LONG) {
      // Find nodeId by searching backwards from match position
      const beforeMatch = content.substring(0, match.index)
      const nodeIdMatch = beforeMatch.match(/nodeId:\s*'([^']+)'(?!.*nodeId:)/s)
      const lineNumber = beforeMatch.split('\n').length
      
      longNodes.push({
        file: path.basename(filePath),
        nodeId: nodeIdMatch ? nodeIdMatch[1] : 'unknown',
        length: textLength,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        lineNumber
      })
    }
  }
  
  return longNodes
}

function main() {
  console.log('📊 Dialogue Length Analysis Report')
  console.log('=' .repeat(80))
  console.log('')
  console.log(`Chat-friendly: <${CHAT_FRIENDLY} chars`)
  console.log(`Long: ${LONG}-${TOO_LONG} chars (Netflix 7-second limit)`)
  console.log(`Too Long: >${TOO_LONG} chars (needs aggressive trimming)`)
  console.log('')
  console.log('=' .repeat(80))
  console.log('')
  
  const allLongNodes: LongNode[] = []
  const stats: Record<string, { total: number; long: number; tooLong: number }> = {}
  
  for (const file of DIALOGUE_FILES) {
    const filePath = path.join(process.cwd(), file)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`)
      continue
    }
    
    const longNodes = analyzeDialogueFile(filePath)
    allLongNodes.push(...longNodes)
    
    const tooLong = longNodes.filter(n => n.length >= TOO_LONG).length
    const long = longNodes.filter(n => n.length >= LONG && n.length < TOO_LONG).length
    
    stats[file] = { total: longNodes.length, long, tooLong }
    
    console.log(`\n📁 ${file}`)
    console.log(`   Long (${LONG}-${TOO_LONG}): ${long} nodes`)
    console.log(`   Too Long (>${TOO_LONG}): ${tooLong} nodes`)
    console.log(`   Total needs trimming: ${longNodes.length}`)
  }
  
  console.log('')
  console.log('=' .repeat(80))
  console.log('')
  console.log('📋 SUMMARY')
  console.log('')
  
  const totalLong = Object.values(stats).reduce((sum, s) => sum + s.long, 0)
  const totalTooLong = Object.values(stats).reduce((sum, s) => sum + s.tooLong, 0)
  const totalNodes = allLongNodes.length
  
  console.log(`Total nodes needing attention: ${totalNodes}`)
  console.log(`  - Long (${LONG}-${TOO_LONG}): ${totalLong}`)
  console.log(`  - Too Long (>${TOO_LONG}): ${totalTooLong}`)
  console.log('')
  console.log('💡 Recommendation: Target 30-40% word reduction across all long nodes')
  console.log('🎯 Goal: Get majority of nodes under 120 characters for chat pacing')
  console.log('')
  
  // Show top 10 longest for immediate attention
  console.log('=' .repeat(80))
  console.log('')
  console.log('🔥 TOP 10 LONGEST NODES (Priority Targets)')
  console.log('')
  
  const sorted = allLongNodes.sort((a, b) => b.length - a.length).slice(0, 10)
  sorted.forEach((node, idx) => {
    console.log(`${idx + 1}. ${node.file}:${node.lineNumber}`)
    console.log(`   Node: ${node.nodeId}`)
    console.log(`   Length: ${node.length} chars`)
    console.log(`   Preview: "${node.text}"`)
    console.log('')
  })
  
  // Export full list to JSON for systematic trimming
  const reportPath = path.join(process.cwd(), 'dialogue-length-report.json')
  fs.writeFileSync(reportPath, JSON.stringify({
    stats,
    allLongNodes: allLongNodes.sort((a, b) => b.length - a.length),
    thresholds: { CHAT_FRIENDLY, LONG, TOO_LONG },
    generatedAt: new Date().toISOString()
  }, null, 2))
  
  console.log('=' .repeat(80))
  console.log(`\n📄 Full report exported to: dialogue-length-report.json`)
  console.log('')
}

main()

