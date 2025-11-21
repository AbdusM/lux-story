
import { mayaDialogueNodes } from '../content/maya-dialogue-graph';
import { DialogueNode } from '../lib/dialogue-graph';

// Simple graph structure for validation
interface GraphNode {
  id: string;
  choices: { target: string; text: string }[];
}

function buildGraph(nodes: DialogueNode[]): Map<string, GraphNode> {
  const graph = new Map<string, GraphNode>();
  for (const node of nodes) {
    graph.set(node.nodeId, {
      id: node.nodeId,
      choices: node.choices.map(c => ({ target: c.nextNodeId, text: c.text }))
    });
  }
  return graph;
}

function findLoops(graph: Map<string, GraphNode>) {
  const loops: string[][] = [];
  
  for (const [nodeId, node] of graph.entries()) {
    // Check 1: Direct self-loops (A -> A)
    for (const choice of node.choices) {
      if (choice.target === nodeId) {
        loops.push([nodeId, nodeId]);
      }
    }

    // Check 2: Short cycles (A -> B -> A)
    for (const choice of node.choices) {
      const neighbor = graph.get(choice.target);
      if (neighbor) {
        for (const neighborChoice of neighbor.choices) {
          if (neighborChoice.target === nodeId) {
            loops.push([nodeId, choice.target, nodeId]);
          }
        }
      }
    }
  }
  return loops;
}

async function validate() {
  console.log('🔍 Validating Maya Dialogue Graph for loops...');
  
  const graph = buildGraph(mayaDialogueNodes);
  const loops = findLoops(graph);

  if (loops.length > 0) {
    console.error('❌ Potential Loops Detected (Check if these have state conditions!):');
    loops.forEach(loop => {
      console.log(`  Loop: ${loop.join(' -> ')}`);
      // Check if the choices involved have conditions (manual check needed usually, but we can log context)
      const startNode = mayaDialogueNodes.find(n => n.nodeId === loop[0]);
      const choice = startNode?.choices.find(c => c.nextNodeId === loop[1]);
      if (choice) {
         console.log(`    Choice Text: "${choice.text}"`);
         console.log(`    Conditions: ${JSON.stringify(choice.visibleCondition || 'None')}`);
      }
    });
    process.exit(1);
  } else {
    console.log('✅ No immediate 1-step or 2-step loops found.');
  }
}

validate();
