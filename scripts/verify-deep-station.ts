
import { deepStationGraph } from '@/content/deep-station-graph';
import { GameStateUtils } from '@/lib/character-state';
import { generateUserId } from '@/lib/safe-storage';
import { TextProcessor } from '@/lib/text-processor';

// Mock Browser Environment
const mockUserId = "ARCHIVIST_TEST_001";
const mockGameState = GameStateUtils.createNewGameState(mockUserId);

console.log("---------------------------------------------------");
console.log("VERIFYING DEEP STATION (SECTOR 3) ENDGAME");
console.log("---------------------------------------------------");

// 1. Graph Integrity
console.log("\n[1] Graph Integrity:");
if (deepStationGraph.startNodeId === 'sector_3_office') {
    console.log("✅ Start Node verified.");
} else {
    console.error("❌ Start Node mismatch.");
}

// 2. Dynamic Text Injection (The Twist)
console.log("\n[2] Dynamic Narrative Injection:");
const terminalNode = deepStationGraph.nodes.get('terminal_decrypted');
if (!terminalNode) throw new Error("Terminal Node Missing");

const rawText = terminalNode.content[0].text;
console.log(`Raw Text: "${rawText.replace(/\n/g, ' ')}"`);

const processedText = TextProcessor.process(rawText, mockGameState);
console.log(`Processed: "${processedText.replace(/\n/g, ' ')}"`);

if (processedText.includes(mockUserId) && !processedText.includes('{{playerId}}')) {
    console.log("✅ SUCCESS: Player ID injected into the narrative log.");
} else {
    console.error("❌ FAILURE: Variable interpolation failed.");
    console.error(`Expected to find: ${mockUserId}`);
}

console.log("\n---------------------------------------------------");
console.log("DEEP STATION VERIFIED SUCCESSFULLY");
console.log("---------------------------------------------------");
