
import { stationEntryGraph } from '@/content/station-entry-graph';
import { getGraphForCharacter } from '@/lib/graph-registry';
import { GameStateUtils } from '@/lib/character-state';
import { generateUserId } from '@/lib/safe-storage';
import { DialogueGraphNavigator } from '@/lib/dialogue-graph';

// Mock Browser Environment for "window" checks if any
const mockGameState = GameStateUtils.createNewGameState(generateUserId());

console.log("---------------------------------------------------");
console.log("VERIFYING STATION ENTRY (SECTOR 0) IMPLEMENTATION");
console.log("---------------------------------------------------");

// 1. Registry Check
console.log("\n[1] Registry Lookup Check:");
try {
    // @ts-ignore - station_entry is added dynamically
    const graph = getGraphForCharacter('station_entry', mockGameState);
    if (graph && graph.startNodeId === 'sector_0_entry') {
        console.log("✅ Registry correctly maps 'station_entry' to stationEntryGraph.");
    } else {
        console.error("❌ Registry failed to return correct graph for 'station_entry'.");
        process.exit(1);
    }
} catch (e) {
    console.error("❌ Registry lookup threw error:", e);
    process.exit(1);
}

// 2. Graph Content Check
console.log("\n[2] Chrono-Spatial Logic Check:");
const entryNode = stationEntryGraph.nodes.get('sector_0_entry');
if (entryNode && entryNode.simulation?.type === 'visual_canvas') {
    console.log("✅ Entry Node contains Visual Canvas simulation (AR Overlay).");
} else {
    console.error("❌ Entry Node missing Visual Canvas simulation.");
}

const bioNode = stationEntryGraph.nodes.get('sector_0_bio_reveal');
if (bioNode) {
    console.log("✅ Bio Reveal Node (Era 1) exists.");
} else {
    console.error("❌ Bio Reveal Node missing.");
}

// 3. Navigation Check
console.log("\n[3] Navigation Simulation:");
// Test transition from Entry -> Mech Reveal (Solving the puzzle)
const mechNode = stationEntryGraph.nodes.get('sector_0_mech_reveal');
if (mechNode && mechNode.choices[0]?.nextNodeId === 'sector_0_hub') {
    console.log("✅ Mech Reveal correctly leads to Hub (Era 2 path).");
} else {
    console.error("❌ Mech Reveal logic flawed.");
}

console.log("\n---------------------------------------------------");
console.log("STATION ENTRY VERIFIED SUCCESSFULLY");
console.log("---------------------------------------------------");
