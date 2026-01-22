#!/usr/bin/env node
/**
 * Dialogue Orphan Node Audit
 *
 * Parses dialogue graph files to find:
 * 1. Orphan nodes (no incoming references)
 * 2. Dead-end nodes (no choices, not marked terminal)
 * 3. Invalid references (nextNodeId to non-existent nodes)
 */

const fs = require('fs')
const path = require('path')

const CONTENT_DIR = path.join(__dirname, '..', 'content')

// Get all dialogue graph files
const dialogueFiles = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('-dialogue-graph.ts'))

console.log('=== ORPHAN NODE AUDIT ===\n')
console.log(`Found ${dialogueFiles.length} dialogue graph files\n`)

const allResults = []

dialogueFiles.forEach(file => {
  const filePath = path.join(CONTENT_DIR, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  const character = file.replace('-dialogue-graph.ts', '')

  // Extract all nodeId definitions
  const nodeIdRegex = /nodeId:\s*['"`]([^'"`]+)['"`]/g
  const nodeIds = new Set()
  let match
  while ((match = nodeIdRegex.exec(content)) !== null) {
    nodeIds.add(match[1])
  }

  // Extract all nextNodeId references
  const nextNodeIdRegex = /nextNodeId:\s*(?:['"`]([^'"`]+)['"`]|samuelEntryPoints\.(\w+))/g
  const references = new Map() // target -> sources
  const allReferences = new Set()

  // Reset regex
  let lineNum = 0
  const lines = content.split('\n')
  lines.forEach((line, idx) => {
    const refMatch = line.match(/nextNodeId:\s*(?:['"`]([^'"`]+)['"`]|samuelEntryPoints\.(\w+))/)
    if (refMatch) {
      const target = refMatch[1] || `samuelEntryPoints.${refMatch[2]}`
      allReferences.add(target)

      // Find source nodeId (look backwards for closest nodeId)
      for (let i = idx; i >= 0; i--) {
        const nodeMatch = lines[i].match(/nodeId:\s*['"`]([^'"`]+)['"`]/)
        if (nodeMatch) {
          if (!references.has(target)) {
            references.set(target, [])
          }
          references.get(target).push(nodeMatch[1])
          break
        }
      }
    }
  })

  // Find orphans (nodes with no incoming references, excluding entry points)
  const orphans = []
  const entryPatterns = ['_introduction', '_intro', '_start', '_entry', '_hub']
  const interruptPatterns = ['_interrupt_', '_challenge_', '_vulnerability_']

  nodeIds.forEach(nodeId => {
    // Check if this node is referenced by any nextNodeId
    const isReferenced = allReferences.has(nodeId)
    const isEntryPoint = entryPatterns.some(p => nodeId.includes(p))
    const isInterruptTarget = interruptPatterns.some(p => nodeId.includes(p))

    if (!isReferenced && !isEntryPoint) {
      orphans.push({
        nodeId,
        type: isInterruptTarget ? 'interrupt_target' : 'orphan'
      })
    }
  })

  // Find dead ends (nodes with choices: [] that aren't marked as terminal)
  const deadEndRegex = /nodeId:\s*['"`]([^'"`]+)['"`][\s\S]*?choices:\s*\[\s*\]/g
  const deadEnds = []
  const terminalPatterns = ['_ending', '_complete', '_exit', 'simulation_', '_loyalty_']

  while ((match = deadEndRegex.exec(content)) !== null) {
    const nodeId = match[1]
    const isTerminal = terminalPatterns.some(p => nodeId.includes(p))
    if (!isTerminal) {
      deadEnds.push(nodeId)
    }
  }

  // Find invalid references (nextNodeId pointing to non-existent local nodes)
  const invalidRefs = []
  allReferences.forEach(ref => {
    // Skip samuel entry points and hub references
    if (ref.startsWith('samuelEntryPoints.') || ref.startsWith('samuel_')) return
    if (ref === 'RETURN' || ref === 'HUB') return

    // Check if reference exists in this file's nodes
    if (!nodeIds.has(ref)) {
      invalidRefs.push(ref)
    }
  })

  const result = {
    character,
    totalNodes: nodeIds.size,
    orphans: orphans.filter(o => o.type === 'orphan').map(o => o.nodeId),
    interruptTargets: orphans.filter(o => o.type === 'interrupt_target').map(o => o.nodeId),
    deadEnds,
    invalidRefs
  }

  allResults.push(result)
})

// Output results
let totalOrphans = 0
let totalDeadEnds = 0
let totalInvalid = 0

console.log('=== RESULTS BY CHARACTER ===\n')

allResults
  .sort((a, b) => b.orphans.length - a.orphans.length)
  .forEach(r => {
    const hasIssues = r.orphans.length > 0 || r.deadEnds.length > 0 || r.invalidRefs.length > 0

    if (hasIssues) {
      console.log(`\n${r.character.toUpperCase()} (${r.totalNodes} nodes)`)
      console.log('─'.repeat(40))

      if (r.orphans.length > 0) {
        console.log(`  🔴 ORPHAN NODES (${r.orphans.length}):`)
        r.orphans.slice(0, 10).forEach(n => console.log(`     - ${n}`))
        if (r.orphans.length > 10) console.log(`     ...and ${r.orphans.length - 10} more`)
        totalOrphans += r.orphans.length
      }

      if (r.interruptTargets.length > 0) {
        console.log(`  🟡 INTERRUPT TARGETS (${r.interruptTargets.length}):`)
        r.interruptTargets.slice(0, 5).forEach(n => console.log(`     - ${n}`))
        if (r.interruptTargets.length > 5) console.log(`     ...and ${r.interruptTargets.length - 5} more`)
      }

      if (r.deadEnds.length > 0) {
        console.log(`  🟠 DEAD ENDS (${r.deadEnds.length}):`)
        r.deadEnds.slice(0, 5).forEach(n => console.log(`     - ${n}`))
        if (r.deadEnds.length > 5) console.log(`     ...and ${r.deadEnds.length - 5} more`)
        totalDeadEnds += r.deadEnds.length
      }

      if (r.invalidRefs.length > 0) {
        console.log(`  ❌ INVALID REFS (${r.invalidRefs.length}):`)
        r.invalidRefs.forEach(n => console.log(`     - ${n}`))
        totalInvalid += r.invalidRefs.length
      }
    }
  })

console.log('\n' + '='.repeat(50))
console.log('SUMMARY')
console.log('='.repeat(50))
console.log(`Total Orphan Nodes: ${totalOrphans}`)
console.log(`Total Dead Ends: ${totalDeadEnds}`)
console.log(`Total Invalid Refs: ${totalInvalid}`)
console.log('')

if (totalOrphans > 0 || totalInvalid > 0) {
  console.log('⚠️  Issues found that need attention')
} else {
  console.log('✅ No critical issues found')
}
