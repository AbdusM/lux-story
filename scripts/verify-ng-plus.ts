
import { stationEntryGraph } from '../content/station-entry-graph'
import { StateConditionEvaluator } from '../lib/dialogue-graph'
import { GameStateUtils } from '../lib/character-state'

console.log("---------------------------------------------------");
console.log("VERIFYING NEW GAME+ LOGIC");
console.log("---------------------------------------------------");

// 1. Setup Base State
const baseState = GameStateUtils.createNewGameState('test_user');

// ---------------------------------------------------
// TEST CASE 1: NORMAL ENTRY (No Flag)
// ---------------------------------------------------
console.log("\n[TEST 1] Testing Normal Sector 0 Entry...");

const hubNode = stationEntryGraph.nodes.get('sector_0_hub');
if (!hubNode) {
    console.error("CRITICAL ERROR: 'sector_0_hub' node not found.");
    process.exit(1);
}

// Check which content variation is visible
const normalContent = hubNode.content.find(c => StateConditionEvaluator.evaluate(c.visibleCondition, baseState));

if (normalContent && normalContent.variation_id === 'hub_reentry_v1') {
    console.log("✅ SUCCESS: Found normal content (hub_reentry_v1).");
} else {
    console.error(`❌ FAILURE: Expected 'hub_reentry_v1', got ${normalContent?.variation_id}`);
}

// ---------------------------------------------------
// TEST CASE 2: NG+ ENTRY (With Flag)
// ---------------------------------------------------
console.log("\n[TEST 2] Testing New Game+ Entry (With 'ng_plus_1')...");

const ngState = GameStateUtils.applyStateChange(baseState, {
    addGlobalFlags: ['ng_plus_1']
});

const ngContent = hubNode.content.find(c => StateConditionEvaluator.evaluate(c.visibleCondition, ngState));

if (ngContent && ngContent.variation_id === 'hub_ng_plus_entry') {
    console.log("✅ SUCCESS: Found NG+ content (hub_ng_plus_entry).");
    console.log("✅ SUCCESS: System recognizes 'ng_plus_1' flag correctly.");
} else {
    console.error(`❌ FAILURE: Expected 'hub_ng_plus_entry', got ${ngContent?.variation_id}`);
}

console.log("---------------------------------------------------");
console.log("VERIFICATION COMPLETE");
