# Storyline Audit - Quick Start Guide

## What You Need to Investigate

**The Problem**: User reports story starts with Marcus in the middle of his arc, but code shows Samuel should be the entry point.

**Your Mission**: Use Code Investigator to trace the actual execution flow and identify where the disconnect happens.

## Start Here - Critical Execution Path

### Step 1: Trace from AtmosphericIntro to First Dialogue

1. **Read**: `components/AtmosphericIntro.tsx`
   - Find the `onStart` callback (line ~112-120)
   - What function does it call?

2. **Read**: `components/StatefulGameInterface.tsx`
   - Find `initializeGame()` function (lines 155-247)
   - Trace these specific lines:
     - Line 158-162: How is gameState created?
     - Line 186: What is default characterId?
     - Line 201-205: What does `getSafeStart()` return?

3. **Read**: `lib/graph-registry.ts`
   - Line 179-183: `getSafeStart()` function
   - Confirm it returns 'samuel'

### Step 2: Check Samuel Graph

**Read**: `content/samuel-dialogue-graph.ts`

Key questions:
- What is the `startNodeId`?
- What does the starting node contain?
- Does it have choices leading to Marcus/Tess/Yaquin?

**Expected Structure**:
```typescript
export const samuelDialogueGraph: DialogueGraph = {
  characterName: 'Samuel Washington',
  startNodeId: 'samuel_start', // or whatever it's called
  nodes: new Map([
    ['samuel_start', {
      // Should be hub with choices
      choices: [
        // Links to other character arcs
      ]
    }]
  ])
}
```

### Step 3: Check Game State Initialization

**Read**: `lib/game-state-utils.ts`

Find `createNewGameState()` function:
- What does it set for `currentCharacterId`?
- What does it set for `currentNodeId`?
- Are there hardcoded values?

### Step 4: Git History

Run these commands:

```bash
# Show what commit 63d5bf1 changed
git show 63d5bf1

# Check if getSafeStart was modified recently
git log -p -10 --all -- lib/graph-registry.ts

# Search for "marcus" in entry point code
git log -p -5 --all -S "marcus" -- lib/graph-registry.ts lib/game-state-utils.ts
```

## Red Flags to Look For

1. **Hardcoded Marcus References**:
   - Search for: `'marcus'` or `'Marcus'` in initialization code
   - Check: Is Marcus the default anywhere?

2. **Missing Samuel Hub**:
   - Does Samuel's graph have a proper hub node?
   - Are the choices to other characters implemented?
   - Is Samuel's startNodeId pointing to a valid node?

3. **Incomplete Refactoring**:
   - TODO comments about Samuel
   - Commented-out Samuel references
   - Marcus references in "default" or "fallback" logic

4. **Conditional Overrides**:
   - Any `if (dev || test)` logic that forces Marcus?
   - Environment variables affecting entry point?

## Key Files Priority Order

1. **MUST READ** (Critical path):
   - `components/StatefulGameInterface.tsx` (initialization)
   - `lib/graph-registry.ts` (entry point config)
   - `content/samuel-dialogue-graph.ts` (Samuel hub)
   - `lib/game-state-utils.ts` (state creation)

2. **SHOULD READ** (Supporting evidence):
   - `content/marcus-dialogue-graph.ts` (Marcus entry)
   - `lib/dialogue-graph-navigator.ts` (navigation logic)
   - `components/AtmosphericIntro.tsx` (transition to game)

3. **NICE TO READ** (Context):
   - Test files in `tests/e2e/`
   - Git commit history
   - Configuration files

## How to Report Findings

Use this template in `STORYLINE_AUDIT_REPORT.md`:

```markdown
## Executive Summary

**Actual Entry Point**: [Character] at node [node_id]
**Expected Entry Point**: Samuel at node samuel_start
**Discrepancy**: YES - [Brief explanation]

## Root Cause

[1-2 paragraphs explaining what's actually happening]

File: [path]
Lines: [X-Y]
Code:
```typescript
[relevant snippet]
```

## Evidence

### 1. Initialization Flow
- AtmosphericIntro calls: [function name]
- initializeGame sets: currentCharacterId = [value]
- Fallback uses: getSafeStart() = [value]

### 2. Samuel Hub Status
- Start node: [node_id]
- Node type: [hub/scene/incomplete]
- Choices available: [list]

### 3. What's Broken
[Specific problem with code references]

## Fix Required

[Specific changes needed with file paths]
```

## Testing Your Findings

After you identify the issue, verify by checking:

1. What happens with `localStorage.clear()` + page reload?
2. What does `GameStateManager.createNewGameState()` return?
3. What does `getSafeStart()` return?
4. Does Samuel's start node exist in his graph?

## Time Estimate

- Quick scan: 15-20 minutes
- Deep investigation: 30-45 minutes
- Full report: 60 minutes

**Prioritize accuracy over speed** - we need to find the real issue.

---

Good luck! Focus on tracing the actual code execution, not assumptions.
