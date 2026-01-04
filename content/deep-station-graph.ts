import { DialogueGraph } from '@/lib/dialogue-graph'

export const deepStationGraph: DialogueGraph = {
    version: '1.0',
    metadata: {
        title: 'Sector 3: The Deep Station',
        author: 'Archivist',
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalNodes: 3,
        totalChoices: 0
    },
    startNodeId: 'sector_3_office',
    nodes: new Map([
        // ==========================================
        // SECTOR 3: THE RECURSIVE ROOM (The Office)
        // ==========================================
        ['sector_3_office', {
            nodeId: 'sector_3_office',
            speaker: 'Narrator',
            content: [{
                text: 'The door opens. You step into Samuel\'s Office... and freeze. It is not an office. It is a rusted, decayed copy of the Airlock where you woke up. The same vents. The same terminal.',
                emotion: 'fear',
                interaction: 'glitch',
                richEffectContext: 'warning'
            }],
            choices: [
                {
                    choiceId: 'approach_terminal',
                    text: 'Approach the terminal',
                    nextNodeId: 'terminal_locked'
                }
            ]
        }],

        ['terminal_locked', {
            nodeId: 'terminal_locked',
            speaker: 'System',
            content: [{
                text: 'ERROR: FILE CORRUPTED. UNEXPECTED AUTHOR SIGNATURE. DECRYPTION REQUIRED.',
                interaction: 'typing',
                richEffectContext: 'executing'
            }],
            choices: [],
            simulation: {
                type: 'visual_canvas', // Or dashboard_triage
                title: 'System Override: Data Recovery',
                taskDescription: 'The log file is fragmented. Realign the data shards to read the signature.',
                initialContext: {
                    label: 'FILE_HEADER',
                    content: 'AUTHOR: ??? | DATE: CYCLE 1',
                    displayStyle: 'code'
                },
                successFeedback: 'DECRYPTION COMPLETE. AUTHOR IDENTIFIED.',
                // In a real implementation, the "Success" of this sim would auto-trigger the next node via engine event
                // For now, we rely on the simulation renderer's "Continue" button which usually maps to a choice or a state update
            }
        }],

        // We need a node that is the "Success State" of the simulation.
        // Use the `dashboard_triage` logic? Or just assume the "Continue" after sim leads here.
        // Since `visual_canvas` usually unlocks a choice... let's add the choice to `terminal_locked` but HIDDEN until sim complete?
        // Actually, `SimulationRenderer` usually handles the transition. 
        // Let's add a `terminal_unlocked` node that the USER manually clicks "View Log" to reach after "Success".

        // REVISION: The `terminal_locked` node options should appear AFTER sim.
        // For this MVP graph, we'll assume the engine allows "Continue" to `terminal_decrypted`.

        ['terminal_decrypted', {
            nodeId: 'terminal_decrypted',
            speaker: 'Terminal',
            content: [{
                text: 'LOG ENTRY #001\nAUTHOR: {{playerId}}\nDATE: CYCLE 1\n\n"I hope the next one finds this. Don\'t trust the windows. The stars aren\'t real."',
                emotion: 'shocked',
                richEffectContext: 'error'
            }],
            choices: [
                {
                    choiceId: 'end_cycle',
                    text: 'Touch the screen',
                    nextNodeId: 'demo_end'
                }
            ]
        }],

        ['demo_end', {
            nodeId: 'demo_end',
            speaker: 'System',
            content: [{
                text: 'CYCLE COMPLETE. REBOOTING ARCHIVIST...',
                interaction: 'glitch',
                richEffectContext: 'error'
            }],
            choices: [
                {
                    choiceId: 'restart_game',
                    text: '[RESTART SIMULATION]',
                    nextNodeId: 'sector_0_entry' // True Loop: Back to Start
                }
            ]
        }]
    ])
}
