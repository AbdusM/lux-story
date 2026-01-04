
import { stationEntryGraph } from '@/content/station-entry-graph';
import { grandHallGraph } from '@/content/grand-hall-graph';
import { marketGraph } from '@/content/market-graph';
import { deepStationGraph } from '@/content/deep-station-graph';

const allGraphs = [stationEntryGraph, grandHallGraph, marketGraph, deepStationGraph];
const allNodeIds = new Set<string>();

// 1. Collect all Node IDs
console.log("---------------------------------------------------");
console.log("PHASE 6: GRAND INTEGRATION VERIFICATION");
console.log("---------------------------------------------------");
console.log("Collecting Nodes...");

allGraphs.forEach(g => {
    for (const nodeId of g.nodes.keys()) {
        allNodeIds.add(nodeId);
    }
});

console.log(`Total Nodes Found: ${allNodeIds.size}`);

// 2. Build Link Map (Adjacency List)
const links: { from: string, into: string, graph: string }[] = [];

allGraphs.forEach(g => {
    g.nodes.forEach(node => {
        node.choices.forEach(choice => {
            links.push({
                from: node.nodeId,
                into: choice.nextNodeId,
                graph: g.metadata.title
            });
        });
    });
});

// 3. Verify Links (Dead Link Detection)
console.log("\nVerifying Navigation Links...");
let errorCount = 0;
const sectorLinks: string[] = [];

links.forEach(link => {
    if (!allNodeIds.has(link.into)) {
        console.error(`❌ BROKEN LINK: [${link.graph}] Node '${link.from}' -> '${link.into}' (Target not found)`);
        errorCount++;
    } else {
        // Track cross-sector links for summary
        if (!link.from.startsWith(link.into.split('_')[0]) && link.into.includes('sector_')) {
            // Heuristic: check if they belong to different sectors
            // Actually, simplest is just to print them if they look like sector transitions
            if (link.into.startsWith('sector_')) {
                sectorLinks.push(`${link.from} -> ${link.into}`);
            }
        }
    }
});

if (errorCount === 0) {
    console.log("✅ ALL LINKS VALID.");
    console.log("\nSector Integration Map:");
    // Filter duplicates
    const uniqueSectorLinks = Array.from(new Set(sectorLinks));
    uniqueSectorLinks.forEach(l => console.log(`  🔗 ${l}`));
} else {
    console.error(`\n❌ FOUND ${errorCount} BROKEN LINKS.`);
    process.exit(1);
}

console.log("\n---------------------------------------------------");
console.log("INTEGRATION VERIFIED");
console.log("---------------------------------------------------");
