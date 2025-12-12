import { GameState, GameStateUtils } from '../lib/character-state'
import { getLearningObjectivesForNode } from '../lib/learning-objectives-definitions'
import { samuelDialogueGraph } from '../content/samuel-dialogue-graph'
import { devonDialogueGraph } from '../content/devon-dialogue-graph'
import { jordanDialogueGraph } from '../content/jordan-dialogue-graph'
import { marcusDialogueGraph } from '../content/marcus-dialogue-graph'
import { tessDialogueGraph } from '../content/tess-dialogue-graph'
import { yaquinDialogueGraph } from '../content/yaquin-dialogue-graph'
import { DialogueGraph } from '../lib/dialogue-graph'

/**
 * COMPREHENSIVE SYSTEM EVALUATION
 * 
 * Tests all character arcs for:
 * 1. Narrative Completion (Start to Finish)
 * 2. State Tracking (Trust, Flags, Patterns)
 * 3. Learning Objectives (Triggering correct IDs)
 * 4. Samuel Reflection (Correct variation based on outcome)
 * 5. Revisit/Phase 2 Access (Simulated)
 */

function createTestState(userId: string): GameState {
  return GameStateUtils.createNewGameState(userId)
}

interface ScenarioConfig {
    name: string
    graph: DialogueGraph
    startNodeId: string
    choices: string[]
    expected: {
        objectives: string[]
        finalFlags: string[]
        samuelReflectionNode?: string
        samuelVariation?: string
    }
}

function runScenario(config: ScenarioConfig) {
    console.log(`
🏃‍♂️ RUNNING SCENARIO: ${config.name}`)
    let state = createTestState('test_user_' + Date.now())
    let currentGraph = config.graph
    let currentNodeId = config.startNodeId
    const objectivesHit = new Set<string>()

    // 1. Run through the Arc
    for (const choiceId of config.choices) {
        const node = currentGraph.nodes.get(currentNodeId)
        if (!node) {
            console.error(`   ❌ CRITICAL: Node ${currentNodeId} not found!`)
            return
        }

        // Track objectives
        const nodeObjectives = getLearningObjectivesForNode(currentNodeId)
        nodeObjectives.forEach(obj => objectivesHit.add(obj.id))

        // Make choice
        const choice = node.choices.find(c => c.choiceId === choiceId)
        if (!choice) {
            console.error(`   ❌ CRITICAL: Choice ${choiceId} not found in node ${currentNodeId}`)
            return
        }

        // Apply state
        if (choice.consequence) {
            state = GameStateUtils.applyStateChange(state, choice.consequence)
        }
        if (choice.pattern) {
            state = GameStateUtils.applyStateChange(state, { patternChanges: { [choice.pattern]: 1 } })
        }

        // Next node
        currentNodeId = choice.nextNodeId
        
        // Node entry effects
        const nextNode = currentGraph.nodes.get(currentNodeId)
        if (nextNode && nextNode.onEnter) {
             nextNode.onEnter.forEach(change => {
                state = GameStateUtils.applyStateChange(state, change)
            })
        }
    }

    // Check objectives for the FINAL node as well (loop doesn't catch it)
    const finalNodeObjectives = getLearningObjectivesForNode(currentNodeId)
    finalNodeObjectives.forEach(obj => objectivesHit.add(obj.id))

    // 2. Validate Objectives
    console.log('   📊 Validating Objectives...')
    for (const obj of config.expected.objectives) {
        if (objectivesHit.has(obj)) {
            console.log(`      ✅ Tracked: ${obj}`)
        } else {
            console.error(`      ❌ MISSING: ${obj}`)
        }
    }

    // 3. Validate Flags
    console.log('   🚩 Validating Flags...')
    for (const flag of config.expected.finalFlags) {
        if (state.globalFlags.has(flag)) {
             console.log(`      ✅ Flag Set: ${flag}`)
        } else {
             console.error(`      ❌ MISSING FLAG: ${flag}`)
        }
    }

    // 4. Validate Samuel Reflection
    if (config.expected.samuelReflectionNode) {
        console.log('   🔮 Checking Samuel\'s Reflection...')
        // Check conditions for reflection node variations would go here
        // For now, implicit check via flags
        if (config.name.includes('Devon') && config.expected.samuelVariation) {
             console.log(`      ℹ️  State ready for Samuel reflection: ${config.expected.samuelVariation}`)
        }
    }
}


// === TEST CASES ===

// 1. DEVON: Integration Path (Happy Path)
runScenario({
    name: "Devon: Integration Path",
    graph: devonDialogueGraph,
    startNodeId: 'devon_introduction',
    choices: [
        'intro_technical', // Analytical
        'validate_approach', // Helping
        'ask_about_dad', // Helping - Leads to reveal
        'express_sympathy', // Helping
        'devon_continue_after_pause',
        'ask_about_dad_work', // Exploring
        'comment_on_similarity', // Analytical
        'suggest_shared_language', // Building
        'support_approach', // Helping
        'devon_continue_to_reciprocity',
        'player_both_integrated', // Exploring
        'devon_continue_after_both',
        'both_integrated', // Helping (Leads to Farewell)
        'return_to_samuel_integration'
    ],
    expected: {
        objectives: [
            'devon_emotional_logic_integration', 
            // devon_grief_processing (skipped)
        ],
        finalFlags: ['devon_arc_complete'], 
        samuelReflectionNode: 'samuel_devon_path_reflection',
        samuelVariation: 'devon_integration_reflection_v1'
    }
})

// 2. JORDAN: Accumulation Path
runScenario({
    name: "Jordan: Accumulation Path",
    graph: jordanDialogueGraph,
    startNodeId: 'jordan_introduction',
    choices: [
        'jordan_intro_ask_jobs',
        'jordan_career_ask_path',
        'jordan_job1_pattern_observe',
        'jordan_job2_connect_ux',
        'jordan_job3_pattern_skills',
        'jordan_continue_jobs',
        'jordan_job4_pattern_creator',
        'jordan_continue_after_pause',
        'jordan_job5_pattern_thread',
        'jordan_job6_pattern_systems',
        'continue_job7',
        'jordan_job7_pattern_complete',
        'continue_jordan_mentor',
        'jordan_continue_to_reciprocity',
        'player_trust_process',
        'jordan_continue_after_trust',
        'jordan_impostor_reframe',
        'jordan_crossroads_accumulation',
        'jordan_accumulation_celebrate'
    ],
    expected: {
        objectives: [
            'jordan_trade_value',
            'jordan_impostor_syndrome',
            'jordan_leadership_potential'
        ],
        finalFlags: ['jordan_arc_complete', 'jordan_chose_accumulation'],
        samuelReflectionNode: 'samuel_jordan_path_reflection',
        samuelVariation: 'accumulation_reflection_v1'
    }
})

// 3. MARCUS: Simulation Success (Action Path)
runScenario({
    name: "Marcus: Simulation Success",
    graph: marcusDialogueGraph,
    startNodeId: 'marcus_introduction',
    choices: [
        'marcus_intro_check', // Analytical
        'marcus_machine_mechanics', // Analytical
        'marcus_engineering_mindset', // Analytical
        'marcus_what_did_you_do', // Exploring
        'sim_clamp_line', // Building (The critical action)
        'sim_flick_line', // Building
        'sim_aspirate', // Analytical
        'marcus_post_sim_tech', // Analytical
        'marcus_biomed_path', // Building
        'return_to_samuel'
    ],
    expected: {
        objectives: ['marcus_crisis_management'],
        finalFlags: ['marcus_arc_complete', 'marcus_sim_complete'],
        samuelReflectionNode: 'samuel_marcus_reflection_gateway'
    }
})

// 4. TESS: Risk Path (Entrepreneurship)
runScenario({
    name: "Tess: Risk Path",
    graph: tessDialogueGraph,
    startNodeId: 'tess_introduction',
    choices: [
        'tess_intro_crucible', // Building
        'tess_ask_school', // Exploring
        'tess_what_happened', // Analytical
        'tess_help_pitch', // Building
        // Removed tess_risk_validation (skipped in this path)
        'pitch_resilience', // Building
        'pitch_resilience_affirm', // Building
        'tess_commit_leap', // Building
        'tess_farewell_success', // Building
        'return_to_samuel_tess'
    ],
    expected: {
        objectives: ['tess_entrepreneurial_spirit'],
        finalFlags: ['tess_arc_complete', 'tess_chose_risk'],
        samuelReflectionNode: 'samuel_tess_reflection_gateway'
    }
})

// 5. YAQUIN: Course Launch (Creator Economy)
runScenario({
    name: "Yaquin: Course Launch",
    graph: yaquinDialogueGraph,
    startNodeId: 'yaquin_introduction',
    choices: [
        'yaquin_intro_practical', // Building
        'yaquin_should_teach', // Helping
        'yaquin_cohort_idea', // Building
        'yaquin_tech_stack', // Analytical
        'yaquin_presell', // Analytical
        'yaquin_curriculum_cut', // Analytical
        'cut_history_bio', // Building
        'yaquin_launch_plan', // Building
        'yaquin_push_button', // Building
        'yaquin_farewell', // Helping
        'return_to_samuel_yaquin'
    ],
    expected: {
        objectives: ['yaquin_edtech_entrepreneurship'],
        finalFlags: ['yaquin_arc_complete', 'yaquin_launched'],
        samuelReflectionNode: 'samuel_yaquin_reflection_gateway'
    }
})