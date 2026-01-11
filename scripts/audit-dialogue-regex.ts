
import fs from 'fs';
import path from 'path';

// Define paths to content files
const CONTENT_DIR = '/Users/abdusmuwwakkil/Development/30_lux-story/content';
const FILES = [
    'tess-dialogue-graph.ts',
    'maya-dialogue-graph.ts',
    'grace-dialogue-graph.ts',
    'alex-dialogue-graph.ts',
    'marcus-dialogue-graph.ts',
    // 'kai-dialogue-graph.ts', // Kai might be incomplete/different structure
    // 'elena-dialogue-graph.ts'
];

type NodeInfo = {
    id: string;
    exits: string[];
    file: string;
    hasChoices: boolean;
    isEnding: boolean;
};

const allNodes = new Map<string, NodeInfo>();
const brokenLinks: { source: string; target: string; file: string }[] = [];

console.log("=== STATIC REGEX AUDIT ===\n");

FILES.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Skipping missing file: ${file}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Regex strategies to find nodes
    // nodeId: 'foo'
    // nextNodeId: 'bar'

    // We will parse this loosely by splitting segments or finding node blocks
    // This is brittle but avoids the import hell of mixed TS/ESM.

    // Find all nodeIds
    const nodeRegex = /nodeId:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = nodeRegex.exec(content)) !== null) {
        allNodes.set(match[1], {
            id: match[1],
            exits: [],
            file,
            hasChoices: false, // will update later
            isEnding: false
        });
    }
});

console.log(`Found ${allNodes.size} total nodes across ${FILES.length} files.`);

// Now pass 2: Find links
FILES.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');

    // Find links: nextNodeId: 'foo'
    const linkRegex = /nextNodeId:\s*['"]([^'"]+)['"]/g;
    let linkMatch;

    // Context tracking is hard with regex, so we'll just validate target existence globally
    // This won't tell us WHICH node has the broken link easily, but we can infer it.

    // Better approach: Split by "nodeId:" to get chunks?
    const chunks = content.split(/nodeId:\s*['"]/);

    chunks.forEach((chunk, index) => {
        if (index === 0) return; // prelude

        // Extract ID (it was just stripped by split, need to find end of string)
        const idEnd = chunk.indexOf("'");
        const idEndDouble = chunk.indexOf('"');
        const end = (idEnd === -1) ? idEndDouble : (idEndDouble === -1 ? idEnd : Math.min(idEnd, idEndDouble));

        const nodeId = chunk.substring(0, end);

        // Find all nextNodeIds in this chunk
        const nextMatches = [...chunk.matchAll(/nextNodeId:\s*['"]([^'"]+)['"]/g)];

        nextMatches.forEach(m => {
            const target = m[1];
            if (target === 'RETURN' || target === 'HUB' || target.startsWith('samuel_')) return;

            if (!allNodes.has(target)) {
                brokenLinks.push({ source: nodeId, target, file });
            }
        });

        // Check if it has choices (simple heuristics)
        const hasChoices = chunk.includes('choices: [') || chunk.includes('choices:[');
        const isSimulation = chunk.includes('simulation: {');
        const tags = chunk.match(/tags:\s*\[(.*?)\]/);
        const isEnding = tags ? tags[1].includes('ending') : false;

        const info = allNodes.get(nodeId);
        if (info) {
            info.hasChoices = hasChoices;
            info.isEnding = isEnding || isSimulation; // Sim nodes might not have choices defined in same block immediately
        }
    });
});

// Report
if (brokenLinks.length > 0) {
    console.log(`\n❌ FOUND ${brokenLinks.length} BROKEN LINKS:`);
    brokenLinks.forEach(l => {
        console.log(`   [${l.file}] ${l.source} -> '${l.target}' (Target not found)`);
    });
} else {
    console.log("\n✅ No broken links found matching known nodes.");
}

// Dead Ends Check
const deadEnds = [];
allNodes.forEach(node => {
    // A node is a dead end if it has NO nextNodeIds (we'd need better parsing)
    // For now, relies on "hasChoices" flag
    if (!node.hasChoices && !node.isEnding) {
        // Check if it has a direct nextNodeId (some nodes auto-advance)
        // This regex parser is too simple to detect "onEnter -> next" or just "text block -> next" logic often used?
        // Actually most nodes in this system use `choices`.
        deadEnds.push(node);
    }
});

// console.log(`\n⚠️  Potential Dead Ends (No Choices Detected): ${deadEnds.length}`);
// deadEnds.slice(0, 5).forEach(d => console.log(`   [${d.file}] ${d.id}`));

