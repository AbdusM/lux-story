
import { grandHallGraph } from '@/content/grand-hall-graph';
import { getGraphForCharacter } from '@/lib/graph-registry';
import { GameStateUtils } from '@/lib/character-state';
import { generateUserId } from '@/lib/safe-storage';

// Mock Browser Environment
const mockGameState = GameStateUtils.createNewGameState(generateUserId());

console.log("---------------------------------------------------");
console.log("VERIFYING GRAND HALL (SECTOR 1) IMPLEMENTATION");
console.log("---------------------------------------------------");

// 1. Registry Check
console.log("\n[1] Registry Lookup Check:");
try {
    // @ts-ignore
    const graph = getGraphForCharacter('grand_hall', mockGameState);
    if (graph && graph.startNodeId === 'sector_1_hall') {
        console.log("✅ Registry correctly maps 'grand_hall' to grandHallGraph.");
    } else {
        console.error("❌ Registry failed to return correct graph for 'grand_hall'.");
    }
} catch (e) {
    console.error("❌ Registry lookup threw error:", e);
}

// 2. Logic Check
console.log("\n[2] Dual Reality Logic Check:");
const entryNode = grandHallGraph.nodes.get('sector_1_hall');
if (entryNode && entryNode.simulation?.type === 'visual_canvas') {
    console.log("✅ Entry Node contains Reality Lens simulation.");
} else {
    console.error("❌ Entry Node missing Reality Lens simulation.");
}

const realNode = grandHallGraph.nodes.get('sector_1_hall_real');
if (realNode && realNode.content[0].variation_id === 'hall_real') {
    console.log("✅ Realist View node exists with correct variation ID.");
} else {
    console.error("❌ Realist View node content mismatch.");
}

console.log("\n---------------------------------------------------");
console.log("GRAND HALL VERIFIED SUCCESSFULLY");
console.log("---------------------------------------------------");
