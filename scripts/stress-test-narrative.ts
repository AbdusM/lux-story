
import { GameState, GameStateUtils } from '../lib/character-state'
import { StateConditionEvaluator } from '../lib/dialogue-graph'
import { mayaDialogueGraph } from '../content/maya-dialogue-graph'
import { samuelDialogueGraph } from '../content/samuel-dialogue-graph'
import { getLearningObjectivesForNode } from '../lib/learning-objectives-definitions'

/**
 * STRESS TEST: Narrative Engine & Data Integrity
 * 
 * validatest that the "Happy Path" and "Failure Path" both correctly:
 * 1. Update Game State (Trust, Flags)
 * 2. Trigger Learning Objectives
 * 3. Route to the correct Samuel Reflection
 */

function createTestState(): GameState {
  return GameStateUtils.createNewGameState('stress_test_user_' + Date.now())
}

function runScenario(name: string, choices: string[], expectedOutcome: any) {
  console.log(`\n🏃‍♂️ RUNNING SCENARIO: ${name}`)
  let state = createTestState()
  let currentGraph = mayaDialogueGraph
  let currentNodeId = currentGraph.startNodeId
  
  // Track objectives hit
  const objectivesHit = new Set<string>()

  // 1. Run through Maya's Arc
  console.log(`   Starting at: ${currentNodeId}`)
  
  for (const choiceId of choices) {
    const node = currentGraph.nodes.get(currentNodeId)
    if (!node) {
        console.error(`   ❌ CRITICAL: Node ${currentNodeId} not found!`)
        return
    }

    // Check for objectives on entry
    const nodeObjectives = getLearningObjectivesForNode(currentNodeId)
    nodeObjectives.forEach(obj => objectivesHit.add(obj.id))

    // Find choice
    const choice = node.choices.find(c => c.choiceId === choiceId)
    if (!choice) {
      console.error(`   ❌ CRITICAL: Choice ${choiceId} not found in node ${currentNodeId}`)
      // fallback to printing available choices
      console.log(`      Available: ${node.choices.map(c => c.choiceId).join(', ')}`)
      return
    }

    console.log(`   👉 Chose: "${choice.text.substring(0, 40)}"...`)

    // Apply State Changes
    if (choice.consequence) {
      state = GameStateUtils.applyStateChange(state, choice.consequence)
    }
    if (choice.pattern) {
        state = GameStateUtils.applyStateChange(state, { patternChanges: { [choice.pattern]: 1 } })
    }

    // Move to next node
    currentNodeId = choice.nextNodeId
    
    // Handle Node Entry State
    const nextNode = currentGraph.nodes.get(currentNodeId)
    if (nextNode && nextNode.onEnter) {
        nextNode.onEnter.forEach(change => {
            state = GameStateUtils.applyStateChange(state, change)
        })
    }
  }

  // Check Final Node
  console.log(`   🏁 Ended at: ${currentNodeId}`)
  const finalNodeObjectives = getLearningObjectivesForNode(currentNodeId)
  finalNodeObjectives.forEach(obj => objectivesHit.add(obj.id))

  // 2. Validate Objectives
  console.log('   📊 Validating Objectives...')
  if (expectedOutcome.objectives) {
      for (const obj of expectedOutcome.objectives) {
          if (objectivesHit.has(obj)) {
              console.log(`      ✅ Tracked: ${obj}`)
          } else {
              console.error(`      ❌ MISSING: ${obj}`)
          }
      }
  }

  // 3. Validate Samuel's Reflection Logic
  console.log('   🔮 Checking Samuel\'s Reflection...')
  const reflectionNode = samuelDialogueGraph.nodes.get('samuel_maya_path_reflection')
  if (!reflectionNode) throw new Error("Samuel reflection node missing")

  // Evaluate which content variation Samuel would show based on the final state
  // We manually simulate the content selection logic here based on flags
  let selectedVariation = 'default'
  
  // Check for Early Exit variation
  const hasEarlyExitFlag = state.characters.get('maya')?.knowledgeFlags.has('early_connection_made')
  if (hasEarlyExitFlag) {
      selectedVariation = 'early_exit_v1'
  } else if (state.characters.get('maya')?.knowledgeFlags.has('chose_robotics')) {
      selectedVariation = 'robotics_path_v1'
  }

  if (selectedVariation === expectedOutcome.samuelVariation) {
      console.log(`      ✅ Samuel correctly selected: ${selectedVariation}`)
  } else {
      console.error(`      ❌ Samuel Error: Expected ${expectedOutcome.samuelVariation}, got ${selectedVariation}`)
      console.log('         Flags:', Array.from(state.characters.get('maya')?.knowledgeFlags || []))
  }
}

// SCENARIO 1: The "Early Exit" (Low Trust)
// User pushes too hard or disengages, triggering the fallback
runScenario('The "Early Exit" (Low Trust)', [
  'intro_studies', // Analytical
  'studies_notice_deflection', // Call her out
  'family_pressure', // Push on pressure
  'family_tried_talking', // "Have you tried talking?" (Dismissive)
  'acknowledge_pain', // "That sounds painful"
  'rebellion_acknowledge', // "Start small"
  'early_farewell' // Exit loop
], {
  objectives: ['maya_cultural_competence'], // Should track this even on failure
  samuelVariation: 'early_exit_v1'
})

// SCENARIO 2: The "Robotics Success" (High Trust)
// User builds trust and unlocks the full arc
runScenario('The "Robotics Success" (High Trust)', [
  'intro_contradiction', // "Two things at once"
  'anxiety_no_judgment', // "No judgment"
  'reveal_wait', // "Wait" (High EQ)
  'continue_after_silence',
  'hint_encourage', 
  'robotics_practical',
  'hybrid_perfect',
  'crossroads_robotics', // The big choice
  'maya_continue_to_robotics',
  'continue_after_robotics'
], {
  objectives: ['maya_identity_exploration', 'maya_boundary_setting'],
  samuelVariation: 'robotics_path_v1'
})
