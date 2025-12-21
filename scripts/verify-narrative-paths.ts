
import fs from 'fs';
import path from 'path';

// Define types for Story structure
interface Choice {
    text: string;
    nextScene: string;
    consequence?: string;
}

interface Scene {
    id: string;
    type: string;
    text: string;
    nextScene?: string; // For narration/dialogue
    choices?: Choice[]; // For choice type
}

interface Chapter {
    id: number;
    title: string;
    scenes: Scene[];
}

interface StoryData {
    chapters: Chapter[];
}

// Load Story Data
const storyPath = path.join(process.cwd(), 'data/grand-central-story.json');
const rawData = fs.readFileSync(storyPath, 'utf-8');
const story: StoryData = JSON.parse(rawData);

// Build Map of All Scenes
const sceneMap = new Map<string, Scene>();
const incomingLinks = new Map<string, number>();

story.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
        if (sceneMap.has(scene.id)) {
            console.error(`[ERROR] Duplicate Scene ID found: ${scene.id}`);
        }
        sceneMap.set(scene.id, scene);
        if (!incomingLinks.has(scene.id)) {
            incomingLinks.set(scene.id, 0);
        }
    });
});

console.log(`Loaded ${sceneMap.size} scenes.`);

// Validation State
const errors: string[] = [];
const warnings: string[] = [];

// 1. Check Link Integrity
sceneMap.forEach(scene => {
    const targets: string[] = [];

    // Collect all outgoing links
    if (scene.nextScene) targets.push(scene.nextScene);
    if (scene.choices) {
        scene.choices.forEach(c => {
            if (c.nextScene) targets.push(c.nextScene);
        });
    }

    // specific handling for "ending" or "reflection" scenes which might not have nextScene
    if (targets.length === 0 && !scene.id.includes('end') && !scene.id.includes('reflection')) {
        warnings.push(`[DEAD END] Scene ${scene.id} ("${scene.text.substring(0, 30)}...") has no outgoing links.`);
    }

    // Verify targets exist
    targets.forEach(targetId => {
        if (!sceneMap.has(targetId)) {
            errors.push(`[BROKEN LINK] Scene ${scene.id} links to missing scene: ${targetId}`);
        } else {
            incomingLinks.set(targetId, (incomingLinks.get(targetId) || 0) + 1);
        }
    });
});

// 2. Check for Orphaned Nodes (reachable only if they are roots)
// We assume '1-1' is the main root.
// New scenarios might be roots too if injected dynamically, but they should be linked from main graph.
// Let's do a BFS from '1-1' to find reachable nodes.

const reachable = new Set<string>();
const queue: string[] = ['1-1'];
reachable.add('1-1');

while (queue.length > 0) {
    const currentId = queue.shift()!;
    const scene = sceneMap.get(currentId);
    if (!scene) continue;

    const targets: string[] = [];
    if (scene.nextScene) targets.push(scene.nextScene);
    if (scene.choices) {
        scene.choices.forEach(c => {
            if (c.nextScene) targets.push(c.nextScene);
        });
    }

    targets.forEach(target => {
        if (!reachable.has(target) && sceneMap.has(target)) {
            reachable.add(target);
            queue.push(target);
        }
    });
}

// Check newly added scenarios (Omari, Marcus, Kael)
// They should be reachable from '1-3d' (Departure Board) presumably.
// Let's check if 'scenario_omari_1' etc are reachable.
const specialRoots = ['scenario_omari_1', 'scenario_marcus_1', 'scenario_kael_1'];
specialRoots.forEach(root => {
    if (!reachable.has(root)) {
        warnings.push(`[UNREACHABLE SCENARIO] ${root} is not linked from the main '1-1' tree.`);
        // Run BFS for them individually to check *their* internal integrity
        const subQueue = [root];
        const subReachable = new Set<string>();
        subReachable.add(root);
        while (subQueue.length > 0) {
            const curr = subQueue.shift()!;
            const sc = sceneMap.get(curr);
            if (!sc) continue;

            let tgs: string[] = [];
            if (sc.nextScene) tgs.push(sc.nextScene);
            if (sc.choices) sc.choices.forEach(c => tgs.push(c.nextScene));

            tgs.forEach(t => {
                if (!subReachable.has(t) && sceneMap.has(t)) {
                    subReachable.add(t);
                    subQueue.push(t);
                }
            });
        }
        console.log(`[INFO] Sub-graph for ${root} contains ${subReachable.size} reachable scenes.`);
    }
});

// Report Orphans
sceneMap.forEach((_, id) => {
    if (!reachable.has(id)) {
        // warnings.push(`[ORPHAN] Scene ${id} is not reachable from 1-1.`); 
        // Too noisy if we have separate modules, but good to know for final polish.
    }
});


// REPORT
console.log('\n--- Narrative Verification Report ---');
if (errors.length > 0) {
    console.error(`FOUND ${errors.length} ERRORS:`);
    errors.forEach(e => console.error(e));
} else {
    console.log('✅ No Broken Links Found.');
}

if (warnings.length > 0) {
    console.warn(`FOUND ${warnings.length} WARNINGS:`);
    warnings.forEach(w => console.warn(w));
} else {
    console.log('✅ No Logic Warnings.');
}

if (errors.length > 0) process.exit(1);
