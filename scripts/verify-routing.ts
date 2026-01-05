
import { findCharacterForNode } from '../lib/graph-registry'
import { stationEntryGraph } from '../content/sector-0-entry-graph'
import { grandHallGraph } from '../content/grand-hall-graph'

// Mock GameState
const mockState = {
    globalFlags: new Set<string>(),
    trust: 50,
    patterns: {},
    skills: {}
} as any

function verifyRouting() {
    console.log('🔍 Verifying Cross-Graph Routing Logic...')

    // 1. Check Station Entry Graph
    const entryNode = stationEntryGraph.nodes.get('sector_0_hub')
    if (!entryNode) {
        console.error('❌ Failed: sector_0_hub not found in stationEntryGraph')
        process.exit(1)
    }
    console.log('✅ Found sector_0_hub')

    // 2. Check Link to Grand Hall
    const toHallChoice = entryNode.choices.find(c => c.nextNodeId === 'sector_1_hall')
    if (!toHallChoice) {
        console.error('❌ Failed: No choice pointing to sector_1_hall')
        process.exit(1)
    }
    console.log('✅ Found choice pointing to sector_1_hall')

    // 3. Verify Registry Resolution
    const result = findCharacterForNode('sector_1_hall', mockState)
    if (!result) {
        console.error('❌ Failed: Registry could not find sector_1_hall')
        console.log('DEBUG: Available keys might be missing in DIALOGUE_GRAPHS?')
        process.exit(1)
    }

    if (result.characterId !== 'grand_hall') {
        console.error(`❌ Failed: Expected characterId 'grand_hall', got '${result.characterId}'`)
        process.exit(1)
    }

    console.log('✅ Registry resolved sector_1_hall -> grand_hall')
    console.log('🚀 Routing Verification Successful')
}

verifyRouting()
