
import { marketGraph } from '../content/market-graph'
import { deepStationGraph } from '../content/deep-station-graph'
import { StateConditionEvaluator } from '../lib/dialogue-graph'
import { GameStateUtils } from '../lib/character-state'

console.log("---------------------------------------------------");
console.log("VERIFYING MARKET TRANSIT GLITCH");
console.log("---------------------------------------------------");

// 1. Setup Base State
const baseState = GameStateUtils.createNewGameState('test_user');

// ---------------------------------------------------
// TEST CASE 1: NORMAL TRANSIT (No Flag)
// ---------------------------------------------------
console.log("\n[TEST 1] Testing Normal Transit (No 'high_density' flag)...");

const transitNode = marketGraph.nodes.get('market_transit_logic');
if (!transitNode) {
    console.error("CRITICAL ERROR: 'market_transit_logic' node not found.");
    process.exit(1);
}

const normalChoices = StateConditionEvaluator.evaluateChoices(transitNode, baseState);
const visibleNormalChoices = normalChoices.filter(c => c.visible);

const routeToHub = visibleNormalChoices.find(c => c.choice.choiceId === 'transit_normal');

if (routeToHub) {
    console.log("✅ SUCCESS: Found 'transit_normal' choice.");
    console.log(`   -> Leads to: ${routeToHub.choice.nextNodeId}`);
    if (routeToHub.choice.nextNodeId !== 'sector_0_hub') {
        console.error(`   ❌ ERROR: Expected 'sector_0_hub', got ${routeToHub.choice.nextNodeId}`);
    }
} else {
    console.error("❌ FAILURE: routing to hub missing.");
}

// ---------------------------------------------------
// TEST CASE 2: GLITCH TRANSIT (With Flag)
// ---------------------------------------------------
console.log("\n[TEST 2] Testing Glitch Transit (With 'high_density' flag)...");

const glitchState = GameStateUtils.applyStateChange(baseState, {
    addGlobalFlags: ['high_density']
});

const glitchChoices = StateConditionEvaluator.evaluateChoices(transitNode, glitchState);
const visibleGlitchChoices = glitchChoices.filter(c => c.visible);

const routeToGlitch = visibleGlitchChoices.find(c => c.choice.choiceId === 'transit_glitch');

if (routeToGlitch) {
    console.log("✅ SUCCESS: Found 'transit_glitch' choice.");
    console.log(`   -> Leads to: ${routeToGlitch.choice.nextNodeId}`);

    // Verify target node exists in Deep Station graph
    if (deepStationGraph.nodes.has(routeToGlitch.choice.nextNodeId)) {
        console.log("✅ SUCCESS: Target node exists in Deep Station graph.");
    } else {
        console.error(`❌ FAILURE: Target node ${routeToGlitch.choice.nextNodeId} NOT FOUND in deep-station-graph.`);
    }

} else {
    console.error("❌ FAILURE: routing to glitch missing.");
}

console.log("---------------------------------------------------");
console.log("VERIFICATION COMPLETE");
