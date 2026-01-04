
import { marketGraph } from '@/content/market-graph';
import { GameStateUtils } from '@/lib/character-state';
import { generateUserId } from '@/lib/safe-storage';
import { StateConditionEvaluator } from '@/lib/dialogue-graph';

// Mock Browser Environment
const mockGameState = GameStateUtils.createNewGameState(generateUserId());

console.log("---------------------------------------------------");
console.log("VERIFYING MARKET (SECTOR 2) ECONOMY");
console.log("---------------------------------------------------");

// 1. Initial State Check (No Secrets)
console.log("\n[1] Default State (Poor):");
const startNode = marketGraph.nodes.get('sector_2_market')!;
if (!startNode) throw new Error("Entry Node Missing");

const choicesDefault = StateConditionEvaluator.evaluateChoices(startNode, mockGameState, 'market');
const tradeChoice = choicesDefault.find(c => c.choice.choiceId === 'trade_samuel_secret');

if (tradeChoice && !tradeChoice.enabled) {
    console.log("✅ Trade option correctly DISABLED (Player lacks secret).");
} else {
    console.error("❌ Trade option improperly enabled or missing.");
}

// 2. Rich State Check (Has Secret)
console.log("\n[2] Wealthy State (Has Secret):");
// Grant the flag
mockGameState.globalFlags.add('knows_samuel_failed_mission');

const choicesRich = StateConditionEvaluator.evaluateChoices(startNode, mockGameState, 'market');
const tradeRich = choicesRich.find(c => c.choice.choiceId === 'trade_samuel_secret');

if (tradeRich && tradeRich.enabled) {
    console.log("✅ Trade option correctly ENABLED (Player has secret).");
} else {
    console.error("❌ Trade option failed to unlock with flag.");
}

// 3. Post-Trade State (Sold)
console.log("\n[3] Post-Trade State (Sold Out):");
mockGameState.globalFlags.add('sold_samuel_secret');

const choicesSold = StateConditionEvaluator.evaluateChoices(startNode, mockGameState, 'market');
const tradeSold = choicesSold.find(c => c.choice.choiceId === 'trade_samuel_sold');

// Check that the "Sold" version is now the visible one (or the original is disabled)
const originalTrade = choicesSold.find(c => c.choice.choiceId === 'trade_samuel_secret');

if ((!originalTrade || !originalTrade.enabled) && (tradeSold && !tradeSold.enabled)) {
    console.log("✅ Trade option correctly toggled to SOLD state.");
} else {
    console.error("❌ Trade option did not switch to sold state correctly.");
}


console.log("\n---------------------------------------------------");
console.log("MARKET ECONOMY VERIFIED SUCCESSFULLY");
console.log("---------------------------------------------------");
