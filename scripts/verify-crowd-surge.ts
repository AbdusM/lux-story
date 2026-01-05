
import { marketGraph } from '../content/market-graph'
import { DialogueGraphNavigator, StateConditionEvaluator } from '../lib/dialogue-graph'
import { GameStateUtils } from '../lib/character-state'

console.log("---------------------------------------------------");
console.log("VERIFYING CROWD SURGE LOGIC");
console.log("---------------------------------------------------");

// 1. Setup Base State
const baseState = GameStateUtils.createNewGameState('test_user');
console.log("Base State Created.");

// ---------------------------------------------------
// TEST CASE 1: NORMAL MARKET (No Flag)
// ---------------------------------------------------
console.log("\n[TEST 1] Testing Normal Market Entry (No 'high_density' flag)...");

const entryNodeId = 'market_entry_logic';
const entryNode = marketGraph.nodes.get(entryNodeId);

if (!entryNode) {
    console.error("CRITICAL ERROR: 'market_entry_logic' node not found in graph.");
    process.exit(1);
}

// Evaluate choices for the entry node
const normalChoices = StateConditionEvaluator.evaluateChoices(entryNode, baseState);
const visibleNormalChoices = normalChoices.filter(c => c.visible);

console.log(`Found ${visibleNormalChoices.length} visible choices.`);

const routeToNormal = visibleNormalChoices.find(c => c.choice.choiceId === 'route_to_normal');

if (routeToNormal) {
    console.log("✅ SUCCESS: Found 'route_to_normal' choice.");
    console.log(`   -> Leads to: ${routeToNormal.choice.nextNodeId}`);
    if (routeToNormal.choice.nextNodeId !== 'sector_2_market') {
        console.error(`   ❌ ERROR: Expected behavior is routing to 'sector_2_market', got ${routeToNormal.choice.nextNodeId}`);
    }
} else {
    console.error("❌ FAILURE: Did not find 'route_to_normal' choice.");
}

const routeToCrowdNormal = visibleNormalChoices.find(c => c.choice.choiceId === 'route_to_crowd');
if (routeToCrowdNormal) {
    console.error("❌ FAILURE: Found 'route_to_crowd' choice in normal state (Should be hidden).");
} else {
    console.log("✅ SUCCESS: 'route_to_crowd' is correctly hidden.");
}


// ---------------------------------------------------
// TEST CASE 2: CROWD SURGE (With Flag)
// ---------------------------------------------------
console.log("\n[TEST 2] Testing High Density Market Entry (With 'high_density' flag)...");

// Create state with flag
const crowdState = GameStateUtils.applyStateChange(baseState, {
    addGlobalFlags: ['high_density']
});

if (!crowdState.globalFlags.has('high_density')) {
    console.error("CRITICAL ERROR: Failed to set 'high_density' flag in test state.");
    process.exit(1);
}

const crowdChoices = StateConditionEvaluator.evaluateChoices(entryNode, crowdState);
const visibleCrowdChoices = crowdChoices.filter(c => c.visible);

console.log(`Found ${visibleCrowdChoices.length} visible choices.`);

const routeToCrowd = visibleCrowdChoices.find(c => c.choice.choiceId === 'route_to_crowd');

if (routeToCrowd) {
    console.log("✅ SUCCESS: Found 'route_to_crowd' choice.");
    console.log(`   -> Leads to: ${routeToCrowd.choice.nextNodeId}`);
    if (routeToCrowd.choice.nextNodeId !== 'market_high_density_intro') {
        console.error(`   ❌ ERROR: Expected behavior is routing to 'market_high_density_intro', got ${routeToCrowd.choice.nextNodeId}`);
    }
} else {
    console.error("❌ FAILURE: Did not find 'route_to_crowd' choice.");
}

const routeToNormalCrowd = visibleCrowdChoices.find(c => c.choice.choiceId === 'route_to_normal');
if (routeToNormalCrowd) {
    console.error("❌ FAILURE: Found 'route_to_normal' choice in high density state (Should be hidden).");
} else {
    console.log("✅ SUCCESS: 'route_to_normal' is correctly hidden.");
}

console.log("---------------------------------------------------");

// ---------------------------------------------------
// TEST CASE 3: DYNAMIC DENSITY SIMULATION
// ---------------------------------------------------
import { GameLogic } from '../lib/game-logic'
import { OVERDENSITY_CONSTANTS } from '../lib/overdensity-system'

console.log("\n[TEST 3] Simulating 20 turns to verify density fluctuation...");
// Create fresh state with NO flag
let simState = GameStateUtils.createNewGameState('tester')
// Force start density just below threshold to test trigger
simState.overdensity = 0.75

// Mock a simple choice
const dummyChoice = {
    choice: {
        choiceId: 'wait',
        text: 'Wait',
        nextNodeId: 'market'
    },
    visible: true,
    enabled: true
}

let flagTriggered = false
let flagCleared = false

for (let i = 0; i < 20; i++) {
    const result = GameLogic.processChoice(simState, dummyChoice)
    simState = result.newState

    const hasFlag = simState.globalFlags.has('high_density')
    console.log(`Turn ${i + 1}: Density=${simState.overdensity.toFixed(2)} | Flag=${hasFlag}`)

    if (hasFlag) flagTriggered = true
    if (flagTriggered && !hasFlag) flagCleared = true
}

if (flagTriggered) {
    console.log("✅ PASS: High density flag triggered dynamically.")
} else {
    console.error("❌ FAIL: High density flag never triggered.")
    // process.exit(1) // Warnings for now since it's random walk
}

if (flagCleared) {
    console.log("✅ PASS: High density flag cleared when density dropped.")
}

console.log("VERIFICATION COMPLETE");
