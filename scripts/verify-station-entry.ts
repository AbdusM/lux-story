
import { stationEntryGraph } from '@/content/station-entry-graph';
import { getGraphForCharacter } from '@/lib/graph-registry';
import { GameStateUtils } from '@/lib/character-state';
import { generateUserId } from '@/lib/safe-storage';

// Mock Browser Environment for "window" checks if any
const mockGameState = GameStateUtils.createNewGameState(generateUserId());

console.log("---------------------------------------------------");
console.log("VERIFYING STATION ENTRY (SECTOR 0) IMPLEMENTATION");
console.log("---------------------------------------------------");

// 1. Registry Check
console.log("\n[1] Registry Lookup Check:");
try {
    const graph = getGraphForCharacter('station_entry', mockGameState);
    if (graph && graph.startNodeId === stationEntryGraph.startNodeId) {
        console.log("✅ Registry correctly maps 'station_entry' to stationEntryGraph.");
    } else {
        console.error(`❌ Registry failed to return correct graph for 'station_entry' (expected startNodeId=${stationEntryGraph.startNodeId}).`);
        process.exit(1);
    }
} catch (e) {
    console.error("❌ Registry lookup threw error:", e);
    process.exit(1);
}

// 2. Graph Content Check
console.log("\n[2] Chrono-Spatial Logic Check:");
const entryNode = stationEntryGraph.nodes.get('entry_arrival');
if (entryNode && (entryNode.choices?.length ?? 0) >= 3) {
    console.log("✅ Entry node exists with expected initial branching choices.");
} else {
    console.error("❌ Entry node missing or lacks expected branching choices.");
    process.exit(1);
}

const samuelNode = stationEntryGraph.nodes.get('entry_samuel_intro');
if (samuelNode && (samuelNode.choices?.length ?? 0) > 0) {
    console.log("✅ Samuel anchor node exists and remains interactive.");
} else {
    console.error("❌ Samuel anchor node missing.");
    process.exit(1);
}

// 3. Navigation Check
console.log("\n[3] Navigation Simulation:");
const boothNode = stationEntryGraph.nodes.get('entry_ticket_booth');
const hubExitNode = stationEntryGraph.nodes.get('entry_hub_exit');
if (boothNode?.choices?.some((choice) => choice.nextNodeId === 'entry_samuel_intro')) {
    console.log("✅ Ticket booth path correctly connects to Samuel intro.");
} else {
    console.error("❌ Ticket booth path no longer connects to Samuel intro.");
    process.exit(1);
}

if (hubExitNode?.choices?.some((choice) => choice.nextNodeId === 'sector_1_hall')) {
    console.log("✅ Hub exit correctly routes to Sector 1.");
} else {
    console.error("❌ Hub exit no longer routes to Sector 1.");
    process.exit(1);
}

console.log("\n---------------------------------------------------");
console.log("STATION ENTRY VERIFIED SUCCESSFULLY");
console.log("---------------------------------------------------");
