# God Mode Testing Plan

**Created:** January 13, 2026
**Purpose:** Comprehensive testing plan using God Mode to validate all game features and systems
**Target:** Pre-production QA, system integration verification, edge case discovery

---

## Table of Contents

1. [God Mode Capabilities](#god-mode-capabilities)
2. [Testing Strategy](#testing-strategy)
3. [Test Scenarios by System](#test-scenarios-by-system)
4. [Navigation Paths](#navigation-paths)
5. [Edge Cases & Stress Tests](#edge-cases--stress-tests)
6. [Verification Checklist](#verification-checklist)

---

## God Mode Capabilities

### Current God Mode Features

| Feature | Location | Capability |
|---------|----------|------------|
| **Simulation God View** | Journal → God Mode tab | Click = Samuel transition, Shift+Click = Force mount |
| **Debug Simulation** | `useGameStore().setDebugSimulation()` | Force-load simulation context |
| **Admin Dashboard** | `/admin` | View player analytics, patterns, skills, careers |
| **Test Pages** | `/test-*` routes | Isolated component testing |
| **State Inspector** | Browser DevTools + Zustand | View/modify game state directly |

### God Mode Hooks (To Be Implemented)

These capabilities should be added to enhance testing:

```typescript
// Recommended God Mode additions
interface GodModeControls {
  // State manipulation
  setTrust(characterId: string, value: number): void
  setPattern(pattern: PatternType, level: number): void
  addKnowledgeFlag(flag: string): void
  setNervousSystem(state: 'ventral' | 'sympathetic' | 'dorsal'): void

  // Scene navigation
  jumpToNode(nodeId: string): void
  jumpToCharacter(characterId: string): void
  replayScene(sceneId: string): void

  // Time manipulation
  skipThinkingDelay(): void
  skipTypingAnimation(): void

  // Simulation controls
  unlockAllSimulations(): void
  resetSimulationProgress(simId: string): void
  forceGoldenPrompt(simId: string): void

  // System toggles
  showHiddenChoices(): void
  showStateConditions(): void
  showInterruptWindows(): void
}
```

---

## Testing Strategy

### Three-Phase Approach

**Phase 1: System Verification (2-3 hours)**
- Test each major system in isolation
- Verify core mechanics work as designed
- Identify obvious bugs

**Phase 2: Integration Testing (3-4 hours)**
- Test cross-system interactions
- Verify state changes propagate correctly
- Test edge cases and boundary conditions

**Phase 3: User Journey Testing (2-3 hours)**
- Test complete player paths from start to finish
- Verify narrative coherence
- Test different playstyles (analytical, helping, etc.)

---

## Test Scenarios by System

### 1. Dialogue System (1158 Nodes)

#### Test Cases

**TC-D01: Basic Dialogue Flow**
```
Navigation:
1. Open game → Start new session
2. Progress through Samuel introduction
3. Navigate to Platform 1 (Maya)
4. Complete full dialogue tree

Verify:
- ✅ Dialogue loads without errors
- ✅ Choices appear correctly
- ✅ State changes apply (trust, patterns)
- ✅ Typing animations complete
- ✅ Character emotions display correctly
```

**TC-D02: Conditional Choices (132 Total)**
```
Navigation:
1. Use God Mode to set pattern level: analytical = 6
2. Jump to node with pattern-gated choice
3. Verify choice is visible

Repeat for:
- Trust gates (trust ≥ 6)
- Knowledge flag gates (requires flag)
- Multiple condition gates (trust + pattern)

Verify:
- ✅ Choices show/hide based on conditions
- ✅ Auto-fallback works if zero visible
- ✅ visibleCondition evaluates correctly
```

**TC-D03: Pattern Reflections (113 Total)**
```
Navigation:
1. Set dominant pattern to "helping"
2. Talk to character with pattern reflection
3. Verify NPC acknowledges pattern

Test for each pattern:
- analytical
- patience
- exploring
- helping
- building

Verify:
- ✅ NPC dialogue changes based on pattern
- ✅ altText displays correctly
- ✅ altEmotion applies
- ✅ minLevel threshold respected
```

**TC-D04: Voice Variations (178 Total)**
```
Navigation:
1. Set dominant pattern to "building"
2. View choice with voice variation
3. Verify choice text matches pattern

Verify:
- ✅ Voice variations apply to choices
- ✅ Fallback to base text if no variation
- ✅ Pattern-voice consistency
```

**TC-D05: Trust-Gated Nodes (107 Total)**
```
Setup:
1. Use God Mode to set Maya trust = 2
2. Attempt to access vulnerability arc
3. Verify blocked

Then:
4. Set Maya trust = 6
5. Access vulnerability arc
6. Verify unlocked

Verify:
- ✅ Trust gates work correctly
- ✅ Vulnerability arcs unlock at trust ≥ 6
- ✅ Loyalty experiences unlock at trust ≥ 8
```

---

### 2. Simulations (20 Simulations)

#### Test Cases

**TC-S01: Simulation God View**
```
Navigation:
1. Open Journal → God Mode tab
2. View all 20 simulations
3. Click simulation (Samuel transition)
4. Verify Samuel conductor scene loads
5. Verify simulation mounts

Verify:
- ✅ All 20 simulations appear
- ✅ Icons display correctly
- ✅ Phase indicators accurate
- ✅ Samuel transition works
```

**TC-S02: Force Mount (Shift+Click)**
```
Navigation:
1. Open Journal → God Mode tab
2. Shift+Click simulation
3. Verify simulation mounts immediately (bypass Samuel)

Verify:
- ✅ Simulation loads without Samuel scene
- ✅ isGodMode flag set
- ✅ Debug title appears: "[DEBUG] {title}"
```

**TC-S03: 3-Phase Progression**
```
Test simulation with 3 phases:
1. Complete Introduction phase
2. Verify Application phase unlocks
3. Complete Application phase
4. Verify Mastery phase unlocks

Verify:
- ✅ Phases unlock sequentially
- ✅ Difficulty increases per phase
- ✅ Trust gates apply (trust ≥ 4 for Mastery)
```

**TC-S04: Golden Prompts**
```
Navigation:
1. Force mount simulation
2. Submit perfect solution
3. Verify golden prompt feedback
4. Check nervous system buffer (+30)

Verify:
- ✅ Golden prompt detected
- ✅ Nervous system regulation increases
- ✅ Knowledge flag added: golden_prompt_{type}
```

**TC-S05: Simulation Types (16 Types)**
```
Test each simulation type:
- terminal_coding
- visual_canvas
- chat_negotiation
- dashboard_triage
- system_architecture
- sound_design
- etc. (all 16)

Verify:
- ✅ Simulation loads correct interface
- ✅ Context applies correctly
- ✅ Success detection works
- ✅ Feedback displays
```

---

### 3. Knowledge Flags (508 Flags)

#### Test Cases

**TC-K01: Arc Completions (20 Flags)**
```
Navigation:
1. Complete character dialogue tree
2. Verify arc_complete flag added
3. Check Journal → Character portrait unlocked

Verify:
- ✅ {character}_arc_complete flag set
- ✅ Character portrait appears in Journal
- ✅ Constellation node updates
```

**TC-K02: Simulation Unlocks (20 Flags)**
```
Navigation:
1. Complete simulation
2. Verify {character}_sim_complete flag
3. Check if next simulation unlocks

Verify:
- ✅ Simulation completion flag set
- ✅ Next phase unlocks (if applicable)
- ✅ Constellation edge appears
```

**TC-K03: Vulnerability Reveals (20 Flags)**
```
Setup:
1. Set trust ≥ 6 for character
2. Access vulnerability arc node
3. Verify {character}_vulnerability_revealed flag

Verify:
- ✅ Vulnerability flag added on node enter
- ✅ Journal reflects vulnerability unlocked
- ✅ Trust level maintained
```

**TC-K04: Choice Consequences (50+ Flags)**
```
Navigation:
1. Make choice with consequence flag
2. Verify flag added to state
3. Check if downstream choices unlock

Verify:
- ✅ Choice flags persist
- ✅ Conditional nodes respond to flags
- ✅ Multiple flags combine correctly (AND/OR logic)
```

**TC-K05: Golden Prompts (6 Flags)**
```
Test all golden prompt types:
- golden_prompt_voice
- golden_prompt_midjourney
- golden_prompt_cursor
- golden_prompt_perplexity
- golden_prompt_claude
- golden_prompt_terminal

Verify:
- ✅ Perfect simulation triggers flag
- ✅ Nervous system buffer increases
- ✅ Flag persists across sessions
```

**TC-K06: Skill Combos (30+ Flags)**
```
Navigation:
1. Develop 2+ specific skills
2. Verify combo flag triggers
3. Check career insights update

Test combos:
- combo_healers_path_achieved
- combo_deep_coder_achieved
- combo_systems_thinker_achieved

Verify:
- ✅ Skill threshold detection works
- ✅ Combo flags trigger correctly
- ✅ Career affinities update
```

---

### 4. Interrupts (23 Interrupts)

#### Test Cases

**TC-I01: Interrupt Window Display**
```
Navigation:
1. Progress to node with interrupt window
2. Verify interrupt button appears
3. Verify countdown timer (2-4 seconds)

Verify:
- ✅ Interrupt window displays
- ✅ Timer counts down visually
- ✅ Button shows action text
- ✅ Window auto-dismisses after duration
```

**TC-I02: Interrupt Types (6 Types)**
```
Test each interrupt type:
- connection (6 total)
- silence (7 total)
- encouragement (5 total)
- comfort (3 total)
- grounding (2 total)
- challenge (0 total - not yet implemented)

Verify:
- ✅ Interrupt type displays correctly
- ✅ Action text matches type
- ✅ Target node reachable
```

**TC-I03: Taking Interrupt**
```
Navigation:
1. Wait for interrupt window
2. Click interrupt button before timeout
3. Verify navigation to target node
4. Check trust bonus applied

Verify:
- ✅ Navigation occurs
- ✅ Trust increases (+1 or +2)
- ✅ Consequence applies (if defined)
- ✅ Interrupt state tracked
```

**TC-I04: Missing Interrupt**
```
Navigation:
1. Wait for interrupt window
2. Let timeout expire without clicking
3. Verify normal flow continues
4. Verify no penalty

Verify:
- ✅ missedNodeId used (if defined)
- ✅ Otherwise normal progression
- ✅ No trust penalty
- ✅ No negative consequences
```

**TC-I05: Interrupt Timing**
```
Test interrupt windows:
- 2000ms (shortest)
- 3000ms (medium)
- 4000ms (longest)

Verify:
- ✅ Timer accurate
- ✅ Visual feedback clear
- ✅ Mobile touch targets adequate (44px)
```

---

### 5. Trust System (10 Levels)

#### Test Cases

**TC-T01: Trust Level Progression**
```
Setup:
1. Set trust = 0 (Stranger)
2. Make trust-building choice (+1)
3. Verify trust increases to 1
4. Repeat to test all levels 0-10

Trust levels:
0: Stranger
2: Acquaintance
4: Friendly
6: Close (vulnerability unlocks)
8: Intimate (loyalty unlocks)
10: Bonded (max)

Verify:
- ✅ Trust increments correctly
- ✅ Trust labels update in Journal
- ✅ Voice tone changes with trust
- ✅ Trust caps at 10
```

**TC-T02: Trust-Gated Content**
```
Test trust thresholds:
1. Trust < 6 → Vulnerability arc blocked
2. Trust ≥ 6 → Vulnerability arc unlocked
3. Trust < 8 → Loyalty experience blocked
4. Trust ≥ 8 → Loyalty experience unlocked

Verify:
- ✅ requiredState.trust.min enforced
- ✅ Nodes hide below threshold
- ✅ Nodes appear above threshold
```

**TC-T03: Trust Asymmetry**
```
Setup:
1. Build high trust with Maya (8)
2. Build low trust with Marcus (2)
3. Talk to Maya about Marcus

Verify:
- ✅ Jealousy dialogue appears
- ✅ Curiosity about low-trust characters
- ✅ Concern for player's choices
- ✅ Trust derivatives trigger correctly
```

**TC-T04: Trust Momentum**
```
Setup:
1. Make 3+ trust-building choices in a row
2. Verify momentum bonus

Verify:
- ✅ Consecutive choices tracked
- ✅ Bonus trust awarded (streak ≥ 3)
- ✅ Momentum breaks on neutral choice
```

**TC-T05: Voice Tone Progression**
```
Test voice tone changes:
0-2: Whisper (hesitant)
3-5: Speak (comfortable)
6-7: Declare (confident)
8-9: Proclaim (intimate)
10: Command (bonded)

Verify:
- ✅ Voice tone reflects trust level
- ✅ Typography changes (weight, size)
- ✅ Emotional tone matches trust
```

---

### 6. Patterns (5 Patterns)

#### Test Cases

**TC-P01: Pattern Discovery**
```
Navigation:
1. Start fresh session (patterns = 0)
2. Make "analytical" choice
3. Verify pattern increases
4. Repeat to threshold (3, 6, 9)

Verify:
- ✅ Pattern levels: EMERGING (3), DEVELOPING (6), FLOURISHING (9)
- ✅ Pattern unlock effects trigger
- ✅ Journal updates pattern display
- ✅ Constellation shows pattern
```

**TC-P02: Pattern-Skill Mapping**
```
Test pattern-to-skill associations:
- analytical → criticalThinking, problemSolving, digitalLiteracy, dataDemocratization
- patience → timeManagement, adaptability, emotionalIntelligence, groundedResearch
- exploring → adaptability, creativity, criticalThinking, multimodalCreation
- helping → emotionalIntelligence, collaboration, communication, aiLiteracy
- building → creativity, problemSolving, leadership, agenticCoding, workflowOrchestration

Verify:
- ✅ Skills unlock with patterns
- ✅ Skill levels increase with pattern
- ✅ Cross-pattern skills accumulate
```

**TC-P03: Pattern Reflections**
```
Setup:
1. Set dominant pattern to "helping"
2. Talk to character with pattern reflection
3. Verify NPC acknowledges pattern

Test all 5 patterns:
- analytical
- patience
- exploring
- helping
- building

Verify:
- ✅ 113 total pattern reflections functional
- ✅ NPC dialogue varies by player pattern
- ✅ minLevel threshold respected
```

**TC-P04: Pattern Unlock Effects**
```
Test unlock effects (15 total: 3 levels × 5 patterns):

EMERGING (level 3):
- Visual: Subtle glow
- Audio: Soft chime
- Journal: Pattern icon appears

DEVELOPING (level 6):
- Visual: Pulsing glow
- Audio: Harmonic tone
- Journal: Pattern description unlocks

FLOURISHING (level 9):
- Visual: Radiant aura
- Audio: Full chord
- Journal: Pattern manifesto unlocks

Verify:
- ✅ Visual effects display
- ✅ Audio feedback plays
- ✅ Journal content unlocks
```

**TC-P05: Pattern Balance**
```
Setup:
1. Develop multiple patterns evenly
2. Verify no dominant pattern
3. Check that content doesn't break

Verify:
- ✅ Balanced pattern gameplay supported
- ✅ No pattern required for progression
- ✅ All patterns equally valid
```

---

### 7. Skills (54 Skills)

#### Test Cases

**TC-SK01: Skill Clustering**
```
Verify 7 semantic clusters:
1. MIND (8 skills)
2. HEART (8 skills)
3. VOICE (8 skills)
4. HANDS (8 skills)
5. COMPASS (8 skills)
6. CRAFT (8 skills)
7. CENTER HUB (6 skills)

Verify:
- ✅ All 54 skills documented
- ✅ Clusters organize correctly in Journal
- ✅ Skill metadata complete (name, definition, superpower, manifesto)
```

**TC-SK02: Skill Development**
```
Navigation:
1. Make choice with skill consequence
2. Verify skill level increases
3. Check Journal → Skills tab

Verify:
- ✅ Skill levels increment
- ✅ WEF 2030 alignment displayed
- ✅ Cognitive domain shown
- ✅ Character hints appear (30 skills)
```

**TC-SK03: Skill-to-Career Mapping**
```
Setup:
1. Develop healers_path skills (emotionalIntelligence + communication)
2. Verify career affinity increases for healthcare

Test skill combos:
- combo_healers_path → healthcare affinity
- combo_deep_coder → technology affinity
- combo_systems_thinker → engineering affinity

Verify:
- ✅ Skill combos detected
- ✅ Career affinities update
- ✅ Birmingham opportunities surface
```

---

### 8. Emotions (503 Primary + 180+ Compounds)

#### Test Cases

**TC-E01: Emotion Display**
```
Navigation:
1. Progress through dialogue
2. Verify character emotions display
3. Check emotion subtext (52 mappings)

Test emotions:
- curious → "leaning forward slightly"
- anxious → "fidgeting with hands"
- proud → "standing tall"

Verify:
- ✅ Emotions render correctly
- ✅ Subtext provides observable behavior
- ✅ UI metadata colors apply
```

**TC-E02: Compound Emotions**
```
Test compound emotions (underscore-joined):
- curious_nervous
- proud_vulnerable
- excited_anxious

Verify:
- ✅ Compound emotions validate
- ✅ Multiple emotions combine correctly
- ✅ Unlimited combinations supported
```

**TC-E03: Polyvagal States**
```
Test 3 nervous system states:
1. ventral (safe, social)
2. sympathetic (fight/flight)
3. dorsal (shutdown)

Verify:
- ✅ Nervous system state tracked
- ✅ State influences emotion availability
- ✅ Chemical reactions apply (5 types)
```

---

### 9. Analytics & Events

#### Test Cases

**TC-A01: Event Bus**
```
Setup:
1. Open DevTools console
2. Monitor game events
3. Make choice, build trust, unlock pattern

Verify events fire:
- ✅ game:choice:made
- ✅ game:trust:changed
- ✅ game:pattern:discovered
- ✅ game:simulation:completed
- ✅ 30+ event types functional
```

**TC-A02: Career Analytics**
```
Navigation:
1. Make choices with career implications
2. Open Journal → Insights
3. Verify career affinities display

Test career paths:
- healthcare
- engineering
- technology
- education
- sustainability
- entrepreneurship
- creative
- service

Verify:
- ✅ Pattern-to-career mapping works
- ✅ Birmingham opportunities shown
- ✅ Evidence points accurate
- ✅ Confidence capped at 95%
```

**TC-A03: Admin Dashboard**
```
Navigation:
1. Login to /admin
2. View player analytics
3. Check real-time flow tracking

Verify:
- ✅ Active users on nodes displayed
- ✅ Drop-off heatmap accurate
- ✅ A/B test assignment works
- ✅ Cohort analysis functional
```

---

### 10. Characters (20 NPCs)

#### Test Cases

**TC-C01: Character Tiers**
```
Verify dialogue node targets:
- Hub (Samuel): 150+ nodes
- Core (4 chars): 60+ nodes each
- Primary (4 chars): 40+ nodes each
- Secondary (8 chars): 30+ nodes each
- Extended (4 chars): 20+ nodes each

Verify:
- ✅ All 20 characters accessible
- ✅ Tier targets met (1158 total nodes)
- ✅ Character portraits render
- ✅ Animal types display (18 types)
```

**TC-C02: Relationship Web**
```
Navigation:
1. Open Journal → Constellation
2. View character relationships
3. Verify 8 relationship types

Relationship types:
- mentor_mentee
- peer_professional
- peer_creative
- rivals_friendly
- siblings
- collaborators
- admires
- skeptical

Verify:
- ✅ All relationships mapped
- ✅ Edges display correctly
- ✅ Bidirectional relationships symmetric
```

**TC-C03: Character Simulations**
```
Verify:
- ✅ All 20 characters have simulations
- ✅ Simulations match character expertise
- ✅ Simulation types align (16 types)
```

---

## Navigation Paths

### Path 1: First-Time Player (Analytical Pattern)

```
1. Start game → Samuel introduction
2. Choose analytical responses (3+ times)
3. Navigate to Platform 1 (Maya)
4. Complete Maya dialogue tree
5. Unlock Maya simulation
6. Complete simulation (aim for golden prompt)
7. Build trust to 6 → Unlock vulnerability arc
8. Return to Samuel → Platform selection
9. Navigate to Platform 3 (Devon - systems thinking)
10. Complete Devon dialogue tree
11. Build devon trust to 8 → Unlock loyalty experience
12. Check Journal → Verify:
    - Patterns: analytical (DEVELOPING)
    - Skills: criticalThinking, problemSolving unlocked
    - Career: Technology affinity high
    - Birmingham opportunities: Regions Bank, BBVA Innovation Center
```

### Path 2: Helping-Oriented Player

```
1. Start game → Samuel introduction
2. Choose helping/caring responses (3+ times)
3. Navigate to Platform 1 (Maya) → Choose empathetic responses
4. Build trust quickly with multiple characters
5. Test interrupts (connection, comfort types)
6. Navigate to Platform 2 (Marcus - healthcare)
7. Complete Marcus dialogue + simulation
8. Build Marcus trust to 6 → Vulnerability arc
9. Navigate to Platform 7 (Tess - education)
10. Complete Tess dialogue
11. Check Journal → Verify:
    - Patterns: helping (FLOURISHING)
    - Skills: emotionalIntelligence, communication unlocked
    - Career: Healthcare + Education affinities high
    - Birmingham opportunities: UAB Medical Center, Birmingham City Schools
```

### Path 3: God Mode Power User

```
1. Open Journal → God Mode tab
2. Shift+Click all 20 simulations (force mount)
3. Complete each simulation rapidly
4. Verify all simulation types work
5. Use state inspector to set:
   - All patterns to 9 (FLOURISHING)
   - All character trust to 10 (Bonded)
   - All knowledge flags unlocked
6. Navigate through game
7. Verify:
   - All conditional content visible
   - All interrupts accessible
   - All vulnerability arcs unlocked
   - All loyalty experiences unlocked
8. Check for edge cases:
   - Multiple patterns at max
   - All trust at max
   - All content unlocked simultaneously
```

### Path 4: Edge Case Hunter

```
1. Start game → Immediately open DevTools
2. Set unusual state combinations:
   - Trust = 0 for all characters
   - Patterns = 0 (no choices made)
   - Empty knowledge flags
3. Attempt to navigate
4. Verify graceful degradation:
   - No crashes
   - Auto-fallback shows choices
   - Default content displays
5. Test boundary conditions:
   - Trust > 10 (should cap at 10)
   - Pattern > 9 (should cap at 9)
   - Negative trust (should floor at 0)
6. Test missing data:
   - Invalid character IDs
   - Invalid node IDs
   - Missing simulation configs
7. Verify error handling:
   - Console errors logged
   - User-friendly fallbacks
   - No white screens
```

---

## Edge Cases & Stress Tests

### Edge Case Tests

**EC-01: State Overflow**
```
Test:
1. Set all patterns to 99
2. Set all skills to 100
3. Set all trust to 10
4. Add 500+ knowledge flags

Verify:
- ✅ No UI crashes
- ✅ Journal scrolls correctly
- ✅ Data persists to localStorage
- ✅ Zustand handles large state
```

**EC-02: Zero State**
```
Test:
1. Clear all localStorage
2. Start fresh session
3. Make zero choices
4. Navigate to character

Verify:
- ✅ Default state loads
- ✅ No undefined errors
- ✅ Intro plays correctly
- ✅ First choice appears
```

**EC-03: Rapid State Changes**
```
Test:
1. Use God Mode to rapidly toggle states
2. Change trust 0 → 10 → 0 in 3 seconds
3. Change patterns EMERGING → FLOURISHING → 0
4. Add/remove knowledge flags rapidly

Verify:
- ✅ State updates don't race
- ✅ UI reflects final state
- ✅ No stale data displayed
```

**EC-04: Missing Content**
```
Test:
1. Navigate to node with missing targetNodeId
2. Attempt to load invalid simulation
3. Reference non-existent character

Verify:
- ✅ Graceful error messages
- ✅ Fallback content shown
- ✅ Console warnings logged
- ✅ No game-breaking crashes
```

**EC-05: Mobile Edge Cases**
```
Test on mobile viewport (375px × 667px):
1. Interrupt windows with 44px touch targets
2. Scroll performance with 1000+ messages
3. Journal tabs on small screen
4. Simulation rendering on mobile

Verify:
- ✅ Touch targets adequate
- ✅ No layout shift
- ✅ Scrolling smooth
- ✅ Simulations responsive
```

### Stress Tests

**ST-01: Long Session**
```
Test:
1. Play for 60+ minutes
2. Make 100+ choices
3. Unlock all 20 simulations
4. Build trust with all 20 characters

Verify:
- ✅ No memory leaks
- ✅ Performance stays smooth (60fps)
- ✅ State persists across tab refresh
- ✅ localStorage doesn't overflow (5-10MB limit)
```

**ST-02: Message Overflow**
```
Test:
1. Use God Mode to add 1000+ messages
2. Scroll through message history
3. Add more messages dynamically

Verify:
- ✅ Scroll performance acceptable
- ✅ Virtual scrolling (if implemented)
- ✅ No browser hang
```

**ST-03: Concurrent State Updates**
```
Test:
1. Open game in 2 tabs
2. Make different choices in each tab
3. Refresh both tabs

Verify:
- ✅ State syncs from localStorage
- ✅ Latest write wins
- ✅ No data corruption
```

---

## Verification Checklist

### Pre-Test Setup

- [ ] Clear localStorage
- [ ] Clear browser cache
- [ ] Open DevTools console
- [ ] Enable React DevTools
- [ ] Enable Zustand DevTools
- [ ] Screenshot baseline for visual regression
- [ ] Note current git commit hash

### During Testing

- [ ] Log all bugs in GitHub Issues
- [ ] Screenshot visual bugs
- [ ] Record video of critical bugs
- [ ] Note reproduction steps
- [ ] Track performance metrics (FPS, load times)
- [ ] Monitor console for errors/warnings
- [ ] Check Network tab for failed requests
- [ ] Verify localStorage state after each test

### Post-Test

- [ ] Generate test report (pass/fail by system)
- [ ] Prioritize bugs (P0: blocker, P1: critical, P2: major, P3: minor)
- [ ] Create bug fix branch
- [ ] Re-test fixed bugs
- [ ] Update this testing plan with new edge cases discovered
- [ ] Archive test session data (localStorage export, screenshots)

---

## Test Report Template

```markdown
# God Mode Test Report

**Date:** [Date]
**Tester:** [Name]
**Git Commit:** [Hash]
**Duration:** [Hours]

## Summary

- Total Test Cases: [X]
- Passed: [X]
- Failed: [X]
- Blocked: [X]
- Pass Rate: [X%]

## Failed Tests

### TC-D02: Conditional Choices
**Expected:** Choice should hide when trust < 6
**Actual:** Choice always visible
**Severity:** P1 (Critical)
**Reproduction:**
1. Set trust = 2
2. Navigate to maya_vulnerability_arc
3. Choice incorrectly appears

**Bug Ticket:** #123

## Performance Metrics

- Average FPS: 60fps
- Load time (initial): 1.2s
- Load time (after 1 hour): 1.5s
- Memory usage (start): 120MB
- Memory usage (after 1 hour): 180MB

## Recommendations

1. Fix trust gate evaluation in StateCondition
2. Add visual indicator for hidden choices (dev mode)
3. Improve error logging for missing nodes
```

---

## Quick Reference Commands

### God Mode Shortcuts (To Be Implemented)

```javascript
// In browser console:

// State manipulation
window.godMode.setTrust('maya', 10)
window.godMode.setPattern('analytical', 9)
window.godMode.addFlag('maya_arc_complete')

// Navigation
window.godMode.jumpToNode('maya_vulnerability_arc')
window.godMode.jumpToCharacter('maya')

// Simulation
window.godMode.unlockAllSimulations()
window.godMode.forceGoldenPrompt('maya_simulation')

// Toggles
window.godMode.showHiddenChoices(true)
window.godMode.showStateConditions(true)
window.godMode.skipAnimations(true)

// Export
window.godMode.exportState() // Download JSON
window.godMode.importState(json) // Load JSON

// Reset
window.godMode.resetAll() // Clear all state
```

### Useful Zustand Queries

```javascript
// In browser console:
const store = window.__ZUSTAND_STORE__

// View current state
store.getState()

// View specific state slices
store.getState().coreGameState
store.getState().patterns
store.getState().characterTrust

// Manually update state
store.setState({ debugSimulation: customConfig })
```

---

**Document Control:**
- Location: `/docs/03_PROCESS/`
- Related: `QA_TEST_PLAN.md`, `INTEGRATION_TESTING_GUIDE.md`
- Status: Living document (update as features evolve)

**Last Updated:** January 13, 2026
**Next Review:** Before production release
