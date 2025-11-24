# Storyline Flow Audit Task

## Context
There's a discrepancy between the perceived storyline flow and what may actually be implemented in the code. We may have moved Marcus engagement up earlier in the development lifecycle but did it incompletely.

## Suspected Issue
- **Expected Flow**: Atmospheric Intro → Samuel (hub) → Player chooses to visit Marcus/Tess/Yaquin
- **Actual Experience**: Story appears to start with Marcus directly, skipping Samuel hub
- **Root Cause**: Possibly incomplete changes from commit `63d5bf1: "Update game entry point to Marcus for testing"`

## Investigation Requirements

Use the Code Investigator tool to thoroughly audit the actual storyline flow as implemented in the codebase.

### 1. Entry Point Analysis

**File: `lib/graph-registry.ts`**
- [ ] Verify `getSafeStart()` function (lines 179-183)
  - Current setting: `characterId: 'samuel'`
  - Check git history: Was this changed and reverted?
- [ ] Check `findCharacterForNode()` logic
- [ ] Verify all character graph registrations

**File: `components/StatefulGameInterface.tsx`**
- [ ] Analyze `initializeGame()` function (lines 155-247)
  - How does it determine starting character?
  - What happens when no save file exists?
  - Trace the fallback logic flow
- [ ] Check `hasSaveFile` state initialization (lines 140-152)
- [ ] Verify `AtmosphericIntro` integration logic

**File: `components/AtmosphericIntro.tsx`**
- [ ] Verify `onStart` callback behavior
- [ ] Check what happens after "Enter the Station" button
- [ ] Confirm sequences array mentions Samuel

### 2. Samuel Hub Implementation

**File: `content/samuel-dialogue-graph.ts`**
- [ ] Verify Samuel's starting node (should be hub/greeting)
- [ ] Check all available choices from Samuel's start
- [ ] Confirm navigation paths to Marcus/Tess/Yaquin
- [ ] List all node IDs and their purposes

**Expected Samuel Hub Flow:**
```
samuel_start
  → Welcome to Grand Central Terminus
  → Choices:
    - Visit Platform 1 (Maya - healthcare)
    - Visit Platform 3 (Marcus - crisis management)
    - Visit Platform 7 (Data/tech)
    - etc.
```

**Questions to Answer:**
- Does Samuel have a proper hub node?
- Are there navigation choices to other characters?
- Is the hub complete or stubbed out?

### 3. Marcus Arc Entry Points

**File: `content/marcus-dialogue-graph.ts`**
- [ ] Identify `startNodeId` for Marcus graph
- [ ] Check if Marcus has multiple entry points
- [ ] Verify how players are supposed to reach Marcus
- [ ] List all incoming navigation paths

**Questions to Answer:**
- Can Marcus be reached ONLY through Samuel?
- Is Marcus's start node the medical crisis scene?
- Are there any direct routes bypassing Samuel?

### 4. Navigation Architecture

**File: `lib/dialogue-graph-navigator.ts`**
- [ ] Check cross-character navigation logic
- [ ] Verify `navigateToCharacter()` implementation
- [ ] Check conditional routing based on game state

**File: `lib/state-condition-evaluator.ts`**
- [ ] Check if any conditions force Marcus as entry point
- [ ] Verify visibility conditions for Samuel's choices
- [ ] Check for any "skip Samuel" logic

### 5. Git History Analysis

Run these commands to trace changes:
```bash
# Check when Marcus was set as entry point
git log --all --grep="entry point" --oneline

# Check getSafeStart changes
git log -p --all -S "getSafeStart" -- lib/graph-registry.ts

# Check if Samuel was ever removed/bypassed
git log -p --all -S "samuel" -- lib/graph-registry.ts

# Find when Marcus testing was enabled
git show 63d5bf1
```

### 6. Test Files Investigation

**File: `tests/e2e/user-flows/*.spec.ts`**
- [ ] Check what the E2E tests expect as starting point
- [ ] Verify if tests start with Samuel or Marcus
- [ ] Check test data setup

### 7. Game State Persistence

**Check localStorage structure:**
- [ ] What does a fresh game state look like?
- [ ] What character/node does `GameStateUtils.createNewGameState()` set?
- [ ] Are there any hardcoded Marcus references?

**File: `lib/game-state-manager.ts`**
- [ ] Check `createNewGameState()` implementation
- [ ] Verify default values for `currentCharacterId`
- [ ] Check `currentNodeId` initialization

### 8. Configuration Files

- [ ] Check `next.config.js` for any routing overrides
- [ ] Check `lib/constants.ts` or similar for entry point configs
- [ ] Look for environment variables affecting flow

## Deliverable Report Format

Create a file: `.gemini-clipboard/STORYLINE_AUDIT_REPORT.md`

Include:

### Executive Summary
- **Actual Entry Point**: [Character/Node]
- **Expected Entry Point**: Samuel hub
- **Discrepancy Found**: Yes/No
- **Root Cause**: [Brief description]

### Detailed Findings

#### 1. Entry Point Configuration
- Current `getSafeStart()` setting
- Git history of changes
- Any conditional overrides

#### 2. Samuel Hub Status
- Is Samuel hub implemented? (Complete/Partial/Missing)
- Available choices from Samuel
- Navigation paths to other characters
- Code snippets showing hub structure

#### 3. Marcus Arc Accessibility
- How is Marcus meant to be reached?
- Is there a direct path bypassing Samuel?
- Entry node analysis

#### 4. Code Flow Diagram
```
[Fresh Start]
  ↓
[AtmosphericIntro]
  ↓
[onStart callback]
  ↓
[???] ← Fill this in
  ↓
[First Interactive Node]
```

#### 5. Incomplete Changes Detected
- List any half-finished refactoring
- Orphaned code references
- Inconsistent configurations

#### 6. Recommendations
- [ ] What needs to be fixed?
- [ ] What should be reverted?
- [ ] What should be completed?

### Code Evidence

Include relevant code snippets with file paths and line numbers for:
- Entry point determination
- Samuel hub implementation (or lack thereof)
- Marcus arc entry configuration
- Any hardcoded bypasses

### Testing Evidence

Show what happens when:
1. User clicks "Enter the Station" in AtmosphericIntro
2. `nuclearReset()` is called and page reloads
3. Fresh browser with no localStorage visits site

## Investigation Priorities

1. **CRITICAL**: Trace exact execution path from AtmosphericIntro.onStart to first dialogue node
2. **HIGH**: Verify Samuel hub exists and is reachable
3. **HIGH**: Check if Marcus is incorrectly set as fallback
4. **MEDIUM**: Review git history for incomplete refactoring
5. **LOW**: Check test expectations

## Success Criteria

The audit is complete when you can definitively answer:

1. What character/node does the game ACTUALLY start at in production?
2. Is Samuel hub implemented and functional?
3. What incomplete changes are causing the discrepancy?
4. What specific code changes are needed to fix the flow?

## Tools to Use

- Code Investigator (primary tool)
- Git log analysis
- File content reading
- Search for key function calls
- Trace execution flow

## Timeline

This is a research task - take the time needed to be thorough. The goal is accuracy, not speed.

---

**Created**: 2025-11-24
**Priority**: HIGH
**Assigned to**: Gemini (Code Investigator)
**Status**: Ready for Investigation
