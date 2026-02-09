# God Mode Usage Guide

**Created:** January 13, 2026
**Purpose:** Quick reference for using God Mode testing utilities
**Audience:** QA testers, developers

---

> NOTE (Feb 9, 2026): This archived guide references the old "AUTO-FALLBACK" behavior. That behavior has been removed and replaced with a single safe **Deadlock Recovery** choice (no gated-content reveal). Current contract docs: `docs/reference/data-dictionary/05-dialogue-system.md`.

## Quick Start

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`

3. Open the browser console (F12 or Cmd+Option+I)

4. Look for the God Mode welcome message:
```
⚠️ God Mode enabled. Use window.godMode.* for testing.
```

5. Type `window.godMode` to see all available commands

---

## Core Commands

### Trust Management

```javascript
// Set character trust (0-10)
window.godMode.setTrust('maya', 10)
window.godMode.setTrust('marcus', 6)

// Get current trust level
window.godMode.getTrust('maya') // Returns: 10
```

### Pattern Management

```javascript
// Set pattern level (0-9)
// analytical, patience, exploring, helping, building
window.godMode.setPattern('analytical', 9) // FLOURISHING
window.godMode.setPattern('helping', 6)    // DEVELOPING

// Get pattern level
window.godMode.getPattern('analytical') // Returns: 9

// Set all patterns to same level
window.godMode.setAllPatterns(5)
```

### Navigation

```javascript
// Jump to specific dialogue node
window.godMode.jumpToNode('maya_vulnerability_arc')

// Jump to character's introduction
window.godMode.jumpToCharacter('maya')

// List all nodes (optionally filter by character)
window.godMode.listNodes() // All nodes
window.godMode.listNodes('samuel') // Only Samuel's nodes

// List all characters
window.godMode.listCharacters()
// Returns: ['samuel', 'maya', 'devon', 'jordan', ...]
```

### Simulation Management

```javascript
// Unlock all simulations at once
window.godMode.unlockAllSimulations()

// Unlock specific character's simulation
window.godMode.unlockSimulation('maya')

// Force add golden prompt flag
window.godMode.forceGoldenPrompt('maya')
```

### Knowledge Flags

```javascript
// Add character-specific knowledge flag
window.godMode.addKnowledgeFlag('maya', 'maya_knows_player_ambitious')

// Add global flag
window.godMode.addGlobalFlag('player_ambitious')

// Check if global flag exists
window.godMode.hasGlobalFlag('maya_simulation_complete')
// Returns: true/false

// Remove global flag
window.godMode.removeGlobalFlag('maya_simulation_complete')

// Clear all global flags
window.godMode.clearAllFlags()
```

### Thought Cabinet

```javascript
// Add thought to cabinet
window.godMode.addThought('career_explorer_thought')

// Internalize thought (mark as learned)
window.godMode.internalizeThought('career_explorer_thought')
```

### Mystery Progression

```javascript
// Set mystery states
window.godMode.setMystery('letterSender', 'samuel')
window.godMode.setMystery('platformSeven', 'revealed')
window.godMode.setMystery('samuelsPast', 'hinted')
window.godMode.setMystery('stationNature', 'metaphor')

// Valid values:
// letterSender: samuel, unknown, player, platform_seven
// platformSeven: hidden, revealed, accessible, completed
// samuelsPast: unknown, hinted, revealed
// stationNature: mystery, liminal, metaphor, revealed
```

### State Query

```javascript
// Get full game state
const state = window.godMode.getGameState()
console.log(state)

// Get character state
const mayaState = window.godMode.getCharacterState('maya')
console.log(mayaState.trust, mayaState.knowledgeFlags)

// Get current dialogue node
const currentNode = window.godMode.getCurrentNode()
console.log(currentNode?.nodeId)
```

### Debug Toggles

```javascript
// Show all choices (even hidden ones)
window.godMode.showHiddenChoices(true) // Requires page refresh

// Skip animations (faster testing)
window.godMode.skipAnimations(true) // Requires page refresh

// Disable
window.godMode.showHiddenChoices(false)
window.godMode.skipAnimations(false)
```

### Utility

```javascript
// Export game state to JSON file
window.godMode.exportState() // Downloads state.json

// Reset all game state (with confirmation)
window.godMode.resetAll()
```

---

## Common Testing Scenarios

### Test Vulnerability Arc Access

```javascript
// Scenario: Vulnerability arcs require trust ≥ 6

// 1. Set trust too low
window.godMode.setTrust('maya', 3)

// 2. Try to access vulnerability arc
window.godMode.jumpToNode('maya_vulnerability_arc')
// Should be blocked or show different content

// 3. Increase trust
window.godMode.setTrust('maya', 7)

// 4. Try again
window.godMode.jumpToNode('maya_vulnerability_arc')
// Should now be accessible
```

### Test Pattern Reflections

```javascript
// Scenario: NPCs acknowledge player's dominant pattern

// 1. Set dominant pattern
window.godMode.setPattern('helping', 8)

// 2. Talk to character who has pattern reflection
window.godMode.jumpToCharacter('marcus')

// 3. NPC dialogue should acknowledge "helping" pattern
```

### Test Simulation Unlocking

```javascript
// Scenario: Unlock all content for full exploration

// 1. Max out all trust levels
window.godMode.listCharacters().forEach(char => {
  window.godMode.setTrust(char, 10)
})

// 2. Max out all patterns
window.godMode.setAllPatterns(9)

// 3. Unlock all simulations
window.godMode.unlockAllSimulations()

// 4. Now all content should be accessible
```

### Test Career Path Affinities

```javascript
// Scenario: Test analytical → technology career path

// 1. Build analytical pattern
window.godMode.setPattern('analytical', 9)

// 2. Develop related skills (via dialogue choices or flags)
window.godMode.addGlobalFlag('critical_thinking_developed')

// 3. Check game state for career affinities
const state = window.godMode.getGameState()
console.log(state.careerValues)
```

### Test Golden Prompts

```javascript
// Scenario: Test nervous system regulation from perfect simulation

// 1. Force golden prompt for a character
window.godMode.forceGoldenPrompt('maya')

// 2. Check if flag was added
window.godMode.hasGlobalFlag('golden_prompt_cursor')
// Should return true

// 3. Check state for nervous system changes
const state = window.godMode.getGameState()
// Should see increased regulation buffer
```

---

## Testing Workflow

### Pre-Test Setup

```javascript
// 1. Export clean state
window.godMode.exportState() // Backup

// 2. Set up test conditions
window.godMode.setTrust('maya', 8)
window.godMode.setPattern('analytical', 6)
window.godMode.addGlobalFlag('test_scenario_active')

// 3. Navigate to test area
window.godMode.jumpToNode('maya_test_node')
```

### During Testing

```javascript
// Quick state checks
window.godMode.getTrust('maya')
window.godMode.getPattern('analytical')
window.godMode.hasGlobalFlag('test_flag')

// Rapid state changes
window.godMode.setTrust('maya', 10)
window.godMode.setPattern('helping', 3)
```

### Post-Test Cleanup

```javascript
// Option 1: Reset everything
window.godMode.resetAll()

// Option 2: Selective cleanup
window.godMode.clearAllFlags()
window.godMode.setAllPatterns(0)
```

---

## Edge Case Testing

### Test Auto-Fallback (Zero Visible Choices)

```javascript
// Scenario: What happens if no choices meet conditions?

// 1. Set impossible conditions
window.godMode.setTrust('maya', 0)
window.godMode.setAllPatterns(0)
window.godMode.clearAllFlags()

// 2. Navigate to node with conditional choices
window.godMode.jumpToNode('node_with_many_conditions')

// 3. System should auto-fallback and show all choices
// Console should warn: "[AUTO-FALLBACK] No visible choices..."
```

### Test State Overflow

```javascript
// Scenario: What happens with extreme values?

// 1. Try to set trust beyond max
window.godMode.setTrust('maya', 999)
// Should clamp to 10 and warn in console

// 2. Try to set pattern beyond max
window.godMode.setPattern('analytical', 100)
// Should clamp to 9 and warn in console
```

### Test Invalid Inputs

```javascript
// All of these should log errors and return false/null:

window.godMode.setTrust('invalid_character', 5)
// Error: Invalid character ID

window.godMode.setPattern('invalid_pattern', 5)
// Error: Invalid pattern

window.godMode.jumpToNode('nonexistent_node')
// Error: Node not found

window.godMode.setMystery('invalid_setting', 'value')
// Error: Invalid mystery setting
```

---

## Console Output Reference

### Success Messages

```
✓ [God Mode] Set maya trust: 2 → 10
✓ [God Mode] Set analytical pattern: 0 → 9
✓ [God Mode] Jumped to node: maya_vulnerability_arc (character: maya)
✓ [God Mode] Unlocked 20 simulations
✓ [God Mode] Added global flag: player_ambitious
```

### Warning Messages

```
⚠ [God Mode] Trust value 15 clamped to valid range [0, 10]: 10
⚠ [God Mode] Node 'typo_node' not found in any dialogue graph
⚠ [God Mode] Invalid value 'wrong' for mystery 'letterSender'. Valid: samuel, unknown, player, platform_seven
```

### Error Messages

```
✗ [God Mode] Invalid character ID: 'fake_char'
✗ [God Mode] Invalid pattern: 'wrong_pattern'. Valid: analytical, patience, exploring, helping, building
✗ [God Mode] Game state not hydrated yet. Start a game first.
```

---

## Tips & Best Practices

### 1. Always Check State First

```javascript
// Before testing, verify current state
const state = window.godMode.getGameState()
if (!state) {
  console.log('Start a game first!')
} else {
  console.log('Current node:', state.currentNodeId)
}
```

### 2. Use List Commands for Discovery

```javascript
// Discover available characters
window.godMode.listCharacters()

// Find nodes for a character
window.godMode.listNodes('maya')

// Search for specific nodes
window.godMode.listNodes('maya').filter(n => n.includes('vulnerability'))
```

### 3. Chain Commands for Complex Scenarios

```javascript
// Set up "experienced player" state
window.godMode.setAllPatterns(6);
['maya', 'marcus', 'devon'].forEach(char => {
  window.godMode.setTrust(char, 8)
});
window.godMode.unlockAllSimulations()
```

### 4. Save Test Presets

```javascript
// Create reusable test functions
function setupAnalyticalPlayer() {
  window.godMode.setPattern('analytical', 9)
  window.godMode.setPattern('patience', 3)
  window.godMode.setTrust('maya', 8)
  window.godMode.setTrust('devon', 7)
  window.godMode.addGlobalFlag('analytical_journey_active')
}

// Run preset
setupAnalyticalPlayer()
```

### 5. Export States for Bug Reports

```javascript
// When you find a bug:
// 1. Export state
window.godMode.exportState()

// 2. Include the downloaded JSON in bug report
// 3. Developers can inspect exact state when bug occurred
```

---

## Keyboard Shortcuts

**Open Console:**
- Mac: `Cmd + Option + I`
- Windows/Linux: `F12` or `Ctrl + Shift + I`

**Clear Console:**
- `Ctrl + L` or type `clear()`

**Previous Command:**
- `↑` (Up arrow)

**Autocomplete:**
- `Tab` (type `window.godMode.` then Tab to see suggestions)

---

## Troubleshooting

### "window.godMode is undefined"

**Cause:** God Mode only loads in development mode

**Solution:**
1. Check you're running `npm run dev` (not production build)
2. Refresh the page
3. Check console for errors during God Mode loading

### "Game state not hydrated yet"

**Cause:** Trying to use God Mode before starting a game

**Solution:**
1. Start a new game first
2. Wait for Samuel's introduction to load
3. Then use God Mode commands

### Changes Don't Appear

**Cause:** Some toggles require page refresh

**Solution:**
- `showHiddenChoices` and `skipAnimations` need page refresh
- All other commands take effect immediately

### State Feels Corrupted

**Solution:**
```javascript
// Nuclear option - reset everything
window.godMode.resetAll()
// Then refresh page
```

---

## See Also

- [God Mode Testing Plan](/docs/03_PROCESS/GOD_MODE_TESTING_PLAN.md) - Comprehensive test scenarios
- [God Mode Implementation Plan](/Users/abdusmuwwakkil/.claude/plans/humble-shimmying-hellman.md) - Technical details

---

**Last Updated:** January 13, 2026
