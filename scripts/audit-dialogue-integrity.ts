
import { tessDialogueNodes } from '../content/tess-dialogue-graph.ts';
import { mayaDialogueNodes } from '../content/maya-dialogue-graph.ts';
import { graceDialogueNodes } from '../content/grace-dialogue-graph.ts';
import { alexDialogueNodes } from '../content/alex-dialogue-graph.ts';
import { marcusDialogueNodes } from '../content/marcus-dialogue-graph.ts';
import { kaiDialogueNodes } from '../content/kai-dialogue-graph.ts';
import { elenaDialogueNodes } from '../content/elena-dialogue-graph.ts';
import { samuelEntryPoints } from '../content/samuel-dialogue-graph.ts';

const allGraphs = {
    tess: tessDialogueNodes,
    maya: mayaDialogueNodes,
    grace: graceDialogueNodes,
    alex: alexDialogueNodes,
    marcus: marcusDialogueNodes,
    kai: kaiDialogueNodes,
    elena: elenaDialogueNodes,
};

type AuditResult = {
    character: string;
    brokenLinks: { sourceNode: string; targetId: string; reason: string }[];
    deadEnds: string[];
    loops: string[][];
    unreachable: string[];
};

function auditGraph(character: string, nodes: any[]): AuditResult {
    const nodeMap = new Map(nodes.map(n => [n.nodeId, n]));
    const brokenLinks = [];
    const deadEnds = [];
    const visited = new Set<string>();
    const adjacency = new Map<string, string[]>();

    // 1. Check Links & Dead Ends
    nodes.forEach(node => {
        const exits = [];

        // Check choices
        if (node.choices) {
            node.choices.forEach((choice: any) => {
                if (choice.nextNodeId) {
                    // Special handling for 'RETURN' or global exits
                    if (choice.nextNodeId === 'RETURN' || choice.nextNodeId === 'HUB') return;

                    if (!nodeMap.has(choice.nextNodeId)) {
                        // Check if it leads to Samuel (Hub) or known cross-over
                        if (!choice.nextNodeId.startsWith('samuel_')) {
                            brokenLinks.push({
                                sourceNode: node.nodeId,
                                targetId: choice.nextNodeId,
                                reason: 'Missing Target Node'
                            });
                        }
                    } else {
                        exits.push(choice.nextNodeId);
                    }
                }
            });
        }

        // Check direct transitions (if any - custom logic usually)
        // Some nodes might be "leaves" (endings), which is fine if intentional.
        // If a node has NO choices and isn't marked as an ending/outcome, it's a potential dead end.
        if ((!node.choices || node.choices.length === 0) && !node.tags?.includes('ending')) {
            // Some nodes might rely on external events or simple text-only display? 
            // Usually we want at least one choice to continue.
            deadEnds.push(node.nodeId);
        }

        adjacency.set(node.nodeId, exits);
    });

    // 2. Check Reachability (DFS from Known Entry Points)
    // We'll assume the first node is reachable, plus any 'intro' nodes.
    const entryPoints = nodes.filter(n => n.nodeId.includes('intro') || n.nodeId.includes('start'));
    const stack = entryPoints.map(n => n.nodeId);
    const reachable = new Set<string>(stack);

    while (stack.length > 0) {
        const curr = stack.pop()!;
        const neighbors = adjacency.get(curr) || [];
        neighbors.forEach(next => {
            if (!reachable.has(next)) {
                reachable.add(next);
                stack.push(next);
            }
        });
    }

    const unreachable = nodes.filter(n => !reachable.has(n.nodeId)).map(n => n.nodeId);

    return { character, brokenLinks, deadEnds, loops: [], unreachable };
}

console.log("=== DIALOGUE INTEGRITY AUDIT ===\n");

let totalErrors = 0;

Object.entries(allGraphs).forEach(([char, nodes]) => {
    console.log(`Analyzing ${char.toUpperCase()} (${nodes.length} nodes)...`);
    const result = auditGraph(char, nodes);

    if (result.brokenLinks.length > 0) {
        console.log(`  ❌ BROKEN LINKS (${result.brokenLinks.length}):`);
        result.brokenLinks.forEach(l => console.log(`     - [${l.sourceNode}] -> '${l.targetId}'`));
        totalErrors += result.brokenLinks.length;
    }

    if (result.deadEnds.length > 0) {
        // Filter out known "Sim" nodes or endings
        const realDeadEnds = result.deadEnds.filter(id => !id.includes('simulation') && !id.includes('ending'));
        if (realDeadEnds.length > 0) {
            console.log(`  ⚠️  POTENTIAL DEAD ENDS (${realDeadEnds.length}):`);
            // Limit output
            realDeadEnds.slice(0, 5).forEach(id => console.log(`     - [${id}]`));
            if (realDeadEnds.length > 5) console.log(`     ...and ${realDeadEnds.length - 5} more`);
        }
    }

    // Unreachable check is noisy because of partial files/todo items, so we might skip valid ones
    // console.log(`  ℹ️  Unreachable Nodes: ${result.unreachable.length}`);
    console.log("");
});

if (totalErrors === 0) {
    console.log("✅ NO CRITICAL BROKEN LINKS FOUND.");
} else {
    console.log(`❌ FOUND ${totalErrors} BROKEN LINKS. FIX IMMEDIATELY.`);
    process.exit(1);
}
