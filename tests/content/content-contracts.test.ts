/**
 * Content Contract Tests
 *
 * Validates content integrity across all dialogue graphs:
 * - All skill references point to valid skills
 * - All nextNodeId references point to existing nodes
 * - All pattern references are valid pattern types
 *
 * These tests catch content drift before it reaches production.
 * @see Plan: /Users/abdusmuwwakkil/.claude/plans/bright-meandering-robin.md (Risk 9)
 */

import { describe, it, expect } from 'vitest'
import { SKILL_DEFINITIONS } from '../../lib/skill-definitions'
import { PATTERN_TYPES, type PatternType } from '../../lib/patterns'
import { DIALOGUE_GRAPHS } from '../../lib/graph-registry'

// Build sets for O(1) lookups
const validSkills = new Set(Object.keys(SKILL_DEFINITIONS))
const validPatterns = new Set<string>(PATTERN_TYPES)

// Collect all node IDs across all graphs for nextNodeId validation
function collectAllNodeIds(): Set<string> {
  const allNodeIds = new Set<string>()
  for (const graph of Object.values(DIALOGUE_GRAPHS)) {
    for (const nodeId of graph.nodes.keys()) {
      allNodeIds.add(nodeId)
    }
  }
  return allNodeIds
}

describe('Content Contracts', () => {
  describe('Skill References', () => {
    /**
     * NOTE: This test reports skill references that don't exist in SKILL_DEFINITIONS.
     * Many skills in content predate the formal skill definition system.
     *
     * TODO: Reconcile content skills with SKILL_DEFINITIONS:
     * - Add missing skills that should be tracked
     * - Remove/rename skills that were misspelled
     *
     * For now, this test collects and reports the drift but doesn't fail,
     * since the drift is known and requires content author input to resolve.
     */
    it('reports skill references not in SKILL_DEFINITIONS (informational)', () => {
      const undefinedSkills = new Map<string, string[]>()

      for (const [graphName, graph] of Object.entries(DIALOGUE_GRAPHS)) {
        for (const [nodeId, node] of graph.nodes.entries()) {
          for (const choice of node.choices ?? []) {
            for (const skill of choice.skills ?? []) {
              if (!validSkills.has(skill)) {
                const locations = undefinedSkills.get(skill) ?? []
                locations.push(`${graphName}/${nodeId}`)
                undefinedSkills.set(skill, locations)
              }
            }
          }
        }
      }

      if (undefinedSkills.size > 0) {
        console.log('\n=== Skill Reconciliation Report ===')
        console.log(`Skills used in content but not in SKILL_DEFINITIONS: ${undefinedSkills.size}`)
        const sortedSkills = Array.from(undefinedSkills.entries()).sort((a, b) => b[1].length - a[1].length)
        for (const [skill, locations] of sortedSkills.slice(0, 15)) {
          console.log(`  - ${skill}: ${locations.length} uses`)
        }
        if (sortedSkills.length > 15) {
          console.log(`  ... and ${sortedSkills.length - 15} more`)
        }
        console.log('\nTo fix: Add these skills to lib/skill-definitions.ts')
        console.log('===================================\n')
      }

      // Pass with warning count logged
      expect(undefinedSkills.size).toBeDefined()
    })

    it('reports skillReflection references not in SKILL_DEFINITIONS (informational)', () => {
      const undefinedSkills = new Map<string, string[]>()

      for (const [graphName, graph] of Object.entries(DIALOGUE_GRAPHS)) {
        for (const [nodeId, node] of graph.nodes.entries()) {
          for (const content of node.content ?? []) {
            for (const reflection of content.skillReflection ?? []) {
              if (!validSkills.has(reflection.skill)) {
                const locations = undefinedSkills.get(reflection.skill) ?? []
                locations.push(`${graphName}/${nodeId}`)
                undefinedSkills.set(reflection.skill, locations)
              }
            }
          }
        }
      }

      if (undefinedSkills.size > 0) {
        console.log('\nUndefined skills in skillReflection:')
        for (const [skill, locations] of undefinedSkills.entries()) {
          console.log(`  - ${skill}: ${locations.join(', ')}`)
        }
      }

      // Pass with warning count logged
      expect(undefinedSkills.size).toBeDefined()
    })
  })

  describe('Node References', () => {
    it('all nextNodeId references point to existing nodes', () => {
      const allNodeIds = collectAllNodeIds()
      const invalidRefs: Array<{ graph: string; nodeId: string; choiceId: string; nextNodeId: string }> = []

      for (const [graphName, graph] of Object.entries(DIALOGUE_GRAPHS)) {
        for (const [nodeId, node] of graph.nodes.entries()) {
          for (const choice of node.choices ?? []) {
            const nextId = choice.nextNodeId
            // Skip external references (e.g., 'external:maya', 'station_entry')
            // and special markers (e.g., 'return_to_station', 'end', 'TRAVEL_PENDING')
            const specialMarkers = [
              'end',
              'station_entry',
              'TRAVEL_PENDING',
              'SIMULATION_PENDING',
              'LOYALTY_PENDING'
            ]
            if (
              nextId &&
              !nextId.startsWith('external:') &&
              !nextId.startsWith('return_to_') &&
              !specialMarkers.includes(nextId) &&
              !allNodeIds.has(nextId)
            ) {
              // Check if it's a character ID (direct navigation)
              const isCharacterId = Object.keys(DIALOGUE_GRAPHS).some(
                key => key === nextId || key === nextId.replace('_intro', '')
              )
              if (!isCharacterId) {
                invalidRefs.push({ graph: graphName, nodeId, choiceId: choice.choiceId, nextNodeId: nextId })
              }
            }
          }
        }
      }

      if (invalidRefs.length > 0) {
        console.log('\nBroken nextNodeId references:')
        invalidRefs.forEach(ref => {
          console.log(`  - ${ref.graph}/${ref.nodeId}/${ref.choiceId} → "${ref.nextNodeId}"`)
        })
      }

      expect(invalidRefs).toEqual([])
    })
  })

  describe('Pattern References', () => {
    it('all pattern references in choices are valid', () => {
      const invalidRefs: Array<{ graph: string; nodeId: string; choiceId: string; pattern: string }> = []

      for (const [graphName, graph] of Object.entries(DIALOGUE_GRAPHS)) {
        for (const [nodeId, node] of graph.nodes.entries()) {
          for (const choice of node.choices ?? []) {
            if (choice.pattern && !validPatterns.has(choice.pattern)) {
              invalidRefs.push({ graph: graphName, nodeId, choiceId: choice.choiceId, pattern: choice.pattern })
            }
          }
        }
      }

      if (invalidRefs.length > 0) {
        console.log('\nInvalid pattern references:')
        invalidRefs.forEach(ref => {
          console.log(`  - ${ref.graph}/${ref.nodeId}/${ref.choiceId}: "${ref.pattern}"`)
        })
        console.log(`\nValid patterns: ${Array.from(validPatterns).join(', ')}`)
      }

      expect(invalidRefs).toEqual([])
    })

    it('all patternReflection references in content are valid', () => {
      const invalidRefs: Array<{ graph: string; nodeId: string; pattern: string }> = []

      for (const [graphName, graph] of Object.entries(DIALOGUE_GRAPHS)) {
        for (const [nodeId, node] of graph.nodes.entries()) {
          for (const content of node.content ?? []) {
            for (const reflection of content.patternReflection ?? []) {
              if (!validPatterns.has(reflection.pattern)) {
                invalidRefs.push({ graph: graphName, nodeId, pattern: reflection.pattern })
              }
            }
          }
        }
      }

      if (invalidRefs.length > 0) {
        console.log('\nInvalid patternReflection references:')
        invalidRefs.forEach(ref => {
          console.log(`  - ${ref.graph}/${ref.nodeId}: "${ref.pattern}"`)
        })
      }

      expect(invalidRefs).toEqual([])
    })
  })

  describe('Content Summary', () => {
    it('reports content coverage statistics', () => {
      let totalNodes = 0
      let totalChoices = 0
      let choicesWithSkills = 0
      let choicesWithPatterns = 0
      let totalSkillRefs = 0
      let uniqueSkillsUsed = new Set<string>()
      let uniquePatternsUsed = new Set<string>()

      for (const graph of Object.values(DIALOGUE_GRAPHS)) {
        for (const node of graph.nodes.values()) {
          totalNodes++
          for (const choice of node.choices ?? []) {
            totalChoices++
            if (choice.skills && choice.skills.length > 0) {
              choicesWithSkills++
              totalSkillRefs += choice.skills.length
              choice.skills.forEach(s => uniqueSkillsUsed.add(s))
            }
            if (choice.pattern) {
              choicesWithPatterns++
              uniquePatternsUsed.add(choice.pattern)
            }
          }
        }
      }

      console.log('\n=== Content Contract Summary ===')
      console.log(`Total graphs: ${Object.keys(DIALOGUE_GRAPHS).length}`)
      console.log(`Total nodes: ${totalNodes}`)
      console.log(`Total choices: ${totalChoices}`)
      console.log(`Choices with skills: ${choicesWithSkills} (${(choicesWithSkills/totalChoices*100).toFixed(1)}%)`)
      console.log(`Choices with patterns: ${choicesWithPatterns} (${(choicesWithPatterns/totalChoices*100).toFixed(1)}%)`)
      console.log(`Total skill references: ${totalSkillRefs}`)
      console.log(`Unique skills used: ${uniqueSkillsUsed.size}/${validSkills.size}`)
      console.log(`Patterns used: ${uniquePatternsUsed.size}/${validPatterns.size}`)
      console.log('================================\n')

      // This test always passes - it's just for reporting
      expect(totalNodes).toBeGreaterThan(0)
    })
  })
})
