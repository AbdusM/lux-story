/**
 * Urban Chamber Pilot Readiness Test
 *
 * Verifies all preparation work for the Urban Chamber pilot:
 * - Character arcs expanded to 30+ nodes
 * - Intersection scenes created and accessible
 * - Career insights integration working
 * - Journey Summary includes career framing
 */

import { describe, it, expect } from 'vitest'
import { GameStateUtils } from '@/lib/character-state'
import { generateJourneyNarrative } from '@/lib/journey-narrative-generator'

// Import all dialogue graphs
import { alexDialogueNodes } from '@/content/alex-dialogue-graph'
import { tessDialogueNodes } from '@/content/tess-dialogue-graph'
import { jordanDialogueNodes } from '@/content/jordan-dialogue-graph'
import { rohanDialogueNodes } from '@/content/rohan-dialogue-graph'
import { samuelDialogueNodes } from '@/content/samuel-dialogue-graph'
import { mayaDialogueNodes } from '@/content/maya-dialogue-graph'
import { devonDialogueNodes } from '@/content/devon-dialogue-graph'

// Import intersection scenes
import { mayaDevonIntersectionNodes } from '@/content/intersection-maya-devon'
import { tessRohanIntersectionNodes } from '@/content/intersection-tess-rohan'
import { alexJordanIntersectionNodes } from '@/content/intersection-alex-jordan'

describe('Urban Chamber Pilot Readiness', () => {
  describe('Character Arc Expansions', () => {
    it('Alex arc should have 30+ nodes', () => {
      expect(alexDialogueNodes.length).toBeGreaterThanOrEqual(30)
      console.log(`✓ Alex: ${alexDialogueNodes.length} nodes`)
    })

    it('Tess arc should have 30+ nodes', () => {
      expect(tessDialogueNodes.length).toBeGreaterThanOrEqual(30)
      console.log(`✓ Tess: ${tessDialogueNodes.length} nodes`)
    })

    it('Jordan arc should have 30+ nodes', () => {
      expect(jordanDialogueNodes.length).toBeGreaterThanOrEqual(30)
      console.log(`✓ Jordan: ${jordanDialogueNodes.length} nodes`)
    })

    it('Rohan arc should have 30+ nodes', () => {
      expect(rohanDialogueNodes.length).toBeGreaterThanOrEqual(30)
      console.log(`✓ Rohan: ${rohanDialogueNodes.length} nodes`)
    })

    it('should have comprehensive content across all arcs', () => {
      const totalNodes =
        alexDialogueNodes.length +
        tessDialogueNodes.length +
        jordanDialogueNodes.length +
        rohanDialogueNodes.length +
        samuelDialogueNodes.length +
        mayaDialogueNodes.length +
        devonDialogueNodes.length

      console.log(`\n📊 Total Content: ${totalNodes} nodes across 7 characters`)
      expect(totalNodes).toBeGreaterThan(200)
    })
  })

  describe('Intersection Scenes', () => {
    it('Maya + Devon intersection exists with correct structure', () => {
      expect(mayaDevonIntersectionNodes).toBeDefined()
      expect(mayaDevonIntersectionNodes.length).toBeGreaterThan(0)

      // Verify trigger requirements
      const introNode = mayaDevonIntersectionNodes.find(n => n.nodeId === 'maya_devon_intro')
      expect(introNode).toBeDefined()
      expect(introNode?.requiredState?.hasGlobalFlags).toContain('met_maya')
      expect(introNode?.requiredState?.hasGlobalFlags).toContain('met_devon')

      console.log(`✓ Maya + Devon: ${mayaDevonIntersectionNodes.length} nodes`)
    })

    it('Tess + Rohan intersection exists with correct structure', () => {
      expect(tessRohanIntersectionNodes).toBeDefined()
      expect(tessRohanIntersectionNodes.length).toBeGreaterThan(0)

      const introNode = tessRohanIntersectionNodes.find(n => n.nodeId === 'tess_rohan_intro')
      expect(introNode).toBeDefined()
      expect(introNode?.requiredState?.hasGlobalFlags).toContain('met_tess')
      expect(introNode?.requiredState?.hasGlobalFlags).toContain('met_rohan')

      console.log(`✓ Tess + Rohan: ${tessRohanIntersectionNodes.length} nodes`)
    })

    it('Alex + Jordan intersection exists with correct structure', () => {
      expect(alexJordanIntersectionNodes).toBeDefined()
      expect(alexJordanIntersectionNodes.length).toBeGreaterThan(0)

      const introNode = alexJordanIntersectionNodes.find(n => n.nodeId === 'alex_jordan_intro')
      expect(introNode).toBeDefined()
      expect(introNode?.requiredState?.hasGlobalFlags).toContain('met_alex')
      expect(introNode?.requiredState?.hasGlobalFlags).toContain('met_jordan')

      console.log(`✓ Alex + Jordan: ${alexJordanIntersectionNodes.length} nodes`)
    })

    it('intersection scenes add completion flags', () => {
      // Maya + Devon should add flags somewhere in the scene
      const mayaDevonFlagsNode = mayaDevonIntersectionNodes
        .find(n => n.onEnter?.some(e => e.addGlobalFlags))

      expect(mayaDevonFlagsNode).toBeDefined()

      // Tess + Rohan should add network flag
      const tessRohanNetworkNode = tessRohanIntersectionNodes
        .find(n => n.onEnter?.some(e => e.addGlobalFlags?.includes('tess_rohan_network')))

      expect(tessRohanNetworkNode).toBeDefined()

      // Alex + Jordan should add flags
      const alexJordanFlagsNode = alexJordanIntersectionNodes
        .find(n => n.onEnter?.some(e => e.addGlobalFlags?.includes('alex_jordan_connected')))

      expect(alexJordanFlagsNode).toBeDefined()

      console.log('✓ Intersection completion flags configured')
    })
  })

  describe('Career Insights Integration', () => {
    it('Journey narrative should include career insights', () => {
      // Create a test game state with patterns
      const gameState = GameStateUtils.createNewGameState('test-pilot-user')

      // Set up character completions
      gameState.globalFlags.add('maya_arc_complete')
      gameState.globalFlags.add('devon_arc_complete')

      // Add pattern data (helping-dominant profile)
      gameState.patterns = {
        helping: 8,
        analytical: 4,
        building: 3,
        patience: 2,
        exploring: 3
      }

      // Add character trust
      const mayaChar = GameStateUtils.createCharacterState('maya')
      mayaChar.trust = 7
      gameState.characters.set('maya', mayaChar)

      const devonChar = GameStateUtils.createCharacterState('devon')
      devonChar.trust = 6
      gameState.characters.set('devon', devonChar)

      // Generate journey narrative
      const narrative = generateJourneyNarrative(gameState)

      // Verify career insights exist
      expect(narrative.careerInsights).toBeDefined()
      expect(narrative.careerInsights).toHaveLength(2) // Primary + secondary

      // Verify primary match is healthcare (helping pattern)
      const primary = narrative.careerInsights?.[0]
      expect(primary?.careerArea).toBe('Healthcare & Service')
      expect(primary?.confidence).toBe(75)
      expect(primary?.birminghamOpportunities).toBeDefined()
      expect(primary?.birminghamOpportunities.length).toBeGreaterThan(0)

      console.log('✓ Career insights generated:')
      narrative.careerInsights?.forEach(insight => {
        console.log(`  - ${insight.careerArea} (${insight.confidence}% match)`)
        console.log(`    Birmingham: ${insight.birminghamOpportunities[0]}`)
      })
    })

    it('different patterns should map to different careers', () => {
      // Test building-dominant profile
      const buildingState = GameStateUtils.createNewGameState('builder-test')
      buildingState.globalFlags.add('maya_arc_complete')
      buildingState.patterns = {
        building: 10,
        analytical: 3,
        helping: 2,
        patience: 1,
        exploring: 2
      }

      const buildingNarrative = generateJourneyNarrative(buildingState)
      const buildingCareer = buildingNarrative.careerInsights?.[0]

      expect(buildingCareer?.careerArea).toBe('Engineering & Making')
      expect(buildingCareer?.confidence).toBe(80)

      // Test analytical-dominant profile
      const analyticalState = GameStateUtils.createNewGameState('analytical-test')
      analyticalState.globalFlags.add('devon_arc_complete')
      analyticalState.patterns = {
        analytical: 9,
        building: 2,
        helping: 1,
        patience: 2,
        exploring: 4
      }

      const analyticalNarrative = generateJourneyNarrative(analyticalState)
      const analyticalCareer = analyticalNarrative.careerInsights?.[0]

      expect(analyticalCareer?.careerArea).toBe('Technology & Research')
      expect(analyticalCareer?.confidence).toBe(70)

      console.log('✓ Pattern → Career mapping verified')
      console.log(`  Building → ${buildingCareer?.careerArea}`)
      console.log(`  Analytical → ${analyticalCareer?.careerArea}`)
    })

    it('Birmingham opportunities should be included for all career paths', () => {
      const patterns = ['helping', 'analytical', 'building', 'patience', 'exploring']

      patterns.forEach(pattern => {
        const state = GameStateUtils.createNewGameState(`${pattern}-test`)
        state.globalFlags.add('maya_arc_complete')
        state.patterns = { [pattern]: 10 }

        const narrative = generateJourneyNarrative(state)
        const insights = narrative.careerInsights || []

        expect(insights.length).toBeGreaterThan(0)

        insights.forEach(insight => {
          expect(insight.birminghamOpportunities).toBeDefined()
          expect(insight.birminghamOpportunities.length).toBeGreaterThan(0)

          // All Birmingham opportunities should reference local orgs
          const hasLocalOrg = insight.birminghamOpportunities.some(opp =>
            opp.includes('UAB') ||
            opp.includes('Birmingham') ||
            opp.includes('Regions') ||
            opp.includes('Innovation') ||
            opp.includes('Children\'s') ||
            opp.includes('Community')
          )
          expect(hasLocalOrg).toBe(true)
        })
      })

      console.log('✓ All patterns have Birmingham-specific opportunities')
    })
  })

  describe('Pilot Readiness Summary', () => {
    it('should generate comprehensive pilot readiness report', () => {
      const report = {
        characterArcs: {
          alex: alexDialogueNodes.length,
          tess: tessDialogueNodes.length,
          jordan: jordanDialogueNodes.length,
          rohan: rohanDialogueNodes.length,
          maya: mayaDialogueNodes.length,
          devon: devonDialogueNodes.length,
          samuel: samuelDialogueNodes.length
        },
        intersectionScenes: {
          mayaDevon: mayaDevonIntersectionNodes.length,
          tessRohan: tessRohanIntersectionNodes.length,
          alexJordan: alexJordanIntersectionNodes.length
        },
        totalContent:
          alexDialogueNodes.length +
          tessDialogueNodes.length +
          jordanDialogueNodes.length +
          rohanDialogueNodes.length +
          mayaDialogueNodes.length +
          devonDialogueNodes.length +
          samuelDialogueNodes.length +
          mayaDevonIntersectionNodes.length +
          tessRohanIntersectionNodes.length +
          alexJordanIntersectionNodes.length,
        careerFraming: 'Integrated into Journey Summary',
        status: 'Ready for Urban Chamber Pilot'
      }

      console.log('\n📋 URBAN CHAMBER PILOT READINESS REPORT')
      console.log('========================================')
      console.log('\n📚 Character Arcs:')
      Object.entries(report.characterArcs).forEach(([char, count]) => {
        const status = count >= 30 ? '✅' : '⚠️ '
        console.log(`  ${status} ${char}: ${count} nodes`)
      })

      console.log('\n🔗 Intersection Scenes:')
      Object.entries(report.intersectionScenes).forEach(([scene, count]) => {
        console.log(`  ✅ ${scene}: ${count} nodes`)
      })

      console.log('\n💼 Career Framing:', report.careerFraming)
      console.log('\n📊 Total Content:', report.totalContent, 'nodes')
      console.log('\n✨ Status:', report.status)
      console.log('========================================\n')

      expect(report.totalContent).toBeGreaterThan(200)
      expect(report.intersectionScenes.mayaDevon).toBeGreaterThan(0)
      expect(report.intersectionScenes.tessRohan).toBeGreaterThan(0)
      expect(report.intersectionScenes.alexJordan).toBeGreaterThan(0)
    })
  })
})
