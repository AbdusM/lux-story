# Phase 4: Macro Loop Execution Plan

**For:** Anti Gravity
**QA By:** Opus
**Created:** January 9, 2026

---

## 📋 EXECUTIVE SUMMARY

This plan has **3 Execution Phases** with **4 Checkpoints**. Complete each phase fully before moving to the next.

| Phase | Description | Files Changed | Checkpoint |
|-------|-------------|---------------|------------|
| **A** | Arc Completion Visuals | 3 component files | ✅ Checkpoint 1 |
| **B** | Mystery Breadcrumbs | 20 dialogue files | ✅ Checkpoint 2 |
| **C** | Pattern Endings | 2 new files | ✅ Checkpoint 3 |
| **QA** | Opus reviews & wires | TBD | ✅ Final |

**Total Estimated Work:**
- Phase A: ~30 min
- Phase B: ~2-3 hours (19 files)
- Phase C: ~30 min

---

## 🚨 CRITICAL RULES - READ BEFORE STARTING

### ❌ DO NOT:
| Rule | Why |
|------|-----|
| Modify any file in `lib/` except where specified | Core game logic - very fragile |
| Change function signatures or interfaces | Breaks dependent code |
| Remove or rename existing nodeIds | Breaks save files and navigation |
| Add new dependencies or imports to core files | Creates coupling |
| Touch `StatefulGameInterface.tsx` | Opus will wire it during QA |
| Create new component files unless specified | Scope creep |
| Use `any` type | Type safety required |
| Guess at node IDs or character names | Must match exactly |

### ✅ ALWAYS:
| Rule | When |
|------|------|
| Run `npm run type-check` | After EVERY file save |
| Run `npm test` | Before EVERY commit |
| Copy existing patterns exactly | Then modify values only |
| Search for existing similar code | Before writing new code |
| Stop and ask if unsure | Better than breaking |

---

## 🔄 WORKFLOW FOR EACH FILE

```
┌─────────────────────────────────────────────────────────────┐
│ 1. READ the file first (understand structure)               │
├─────────────────────────────────────────────────────────────┤
│ 2. FIND the exact location (search for anchor text)         │
├─────────────────────────────────────────────────────────────┤
│ 3. ADD code (copy from plan, paste, adjust values)          │
├─────────────────────────────────────────────────────────────┤
│ 4. SAVE the file                                            │
├─────────────────────────────────────────────────────────────┤
│ 5. RUN: npm run type-check                                  │
│    - If PASS → Continue to next file                        │
│    - If FAIL → Fix error BEFORE continuing                  │
├─────────────────────────────────────────────────────────────┤
│ 6. At checkpoint → RUN: npm test                            │
│    - If PASS → Commit and continue                          │
│    - If FAIL → Fix or rollback                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔙 ROLLBACK INSTRUCTIONS

If something breaks and you can't fix it:

### Option 1: Undo Single File
```bash
# Discard changes to specific file
git checkout -- path/to/file.ts
```

### Option 2: Undo All Uncommitted Changes
```bash
# WARNING: Loses all work since last commit
git checkout -- .
```

### Option 3: Revert Last Commit
```bash
# If you committed broken code
git revert HEAD
```

### Option 4: Ask Opus
If you hit a wall, document:
1. What you were trying to do
2. The exact error message
3. Which file(s) you modified

Then stop and wait for guidance.

---

## 🏁 PHASE A: Arc Completion Visuals

**Goal:** Show visual indicator when player completes a character's vulnerability arc.

**Files to modify:**
1. `components/constellation/ConstellationGraph.tsx`
2. `hooks/useConstellationData.ts`
3. `components/constellation/DetailModal.tsx`

**Time estimate:** ~30 minutes

---

### Step A.1: Add Arc Completion Visual to ConstellationGraph

**File:** `components/constellation/ConstellationGraph.tsx`

**What to do:** Add a visual indicator (checkmark or star) for characters whose arc is complete.

**Pattern to follow:** Look at how `char.hasMet` is used for conditional rendering (around line 222).

**Find this code block** (around line 286-288):
```tsx
{/* Center Hub Indicator (Minimal) */}
{isCenter && (
    <circle r={radius + 5} fill="none" stroke="currentColor" strokeWidth="0.1" className="text-amber-500/50" />
)}
```

**Add AFTER it** (before the Label section):
```tsx
{/* Arc Complete Indicator */}
{char.hasMet && char.arcComplete && (
    <g className="arc-complete-badge">
        <circle
            r={radius + 1.8}
            fill="none"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeDasharray="2 1"
            className="opacity-80"
        />
        <text
            x={radius + 2}
            y={-radius - 1}
            textAnchor="middle"
            className="fill-emerald-400 text-[2.5px]"
            style={{ fontSize: '2.5px' }}
        >
            ✓
        </text>
    </g>
)}
```

**Verification:**
```bash
npm run type-check
```

If you get an error about `arcComplete` not existing on type, that's expected - we need to add it to the type. See Step 4.1.2.

---

### Step A.2: Add arcComplete to CharacterWithState

**File:** `hooks/useConstellationData.ts`

**Find the CharacterWithState interface** (search for `export interface CharacterWithState`).

**Add this property** to the interface:
```typescript
arcComplete: boolean
```

**Then find where CharacterWithState objects are created** (search for `hasMet:` to find the mapping function).

**Add the arcComplete computation.** Look for a line like:
```typescript
hasMet: char.trust > 0 || char.conversationHistory.length > 0,
```

**Add after it:**
```typescript
arcComplete: char.knowledgeFlags.includes(`${char.characterId}_arc_complete`),
```

**Verification:**
```bash
npm run type-check
```

---

### Step A.3: Add Arc Completion Message to DetailModal

**File:** `components/constellation/DetailModal.tsx`

**Find the CharacterDetail function** and locate where character info is displayed.

**Find this section** (around line 200-210, the header area):
```tsx
<div className="flex-1 min-w-0">
    <h2 className="text-xl font-bold text-white truncate">
        {character.fullName}
    </h2>
```

**Add AFTER the role/title display, before the trust section:**
```tsx
{/* Arc Completion Badge */}
{character.arcComplete && (
    <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded-full w-fit">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs text-emerald-300">Story Complete</span>
    </div>
)}
```

**Note:** `CheckCircle2` is already imported (we added it in Phase 2).

**Verification:**
```bash
npm run type-check
```

---

## ✅ CHECKPOINT 1: Phase A Complete

**Before continuing, verify ALL of the following:**

```bash
# 1. Type check passes
npm run type-check

# 2. All tests pass
npm test

# 3. No uncommitted changes remain after commit
git status
```

**Commit Phase A:**
```bash
git add components/constellation/ConstellationGraph.tsx hooks/useConstellationData.ts components/constellation/DetailModal.tsx
git commit -m "feat: add arc completion visual indicators in constellation"
```

**✅ Only proceed to Phase B after commit succeeds.**

---

## 🏁 PHASE B: Mystery Breadcrumbs (All 20 Characters)

**Goal:** Add mystery hints to ALL character dialogues that unlock at trust thresholds.

**Files to modify:** 20 dialogue files in `content/`

**Time estimate:** 2-3 hours

**Strategy:**
- Samuel first (7 nodes) - most complex
- Then 19 other characters (2 nodes each) - repetitive pattern

---

### Step B.1: Add Mystery Nodes to Samuel

**File:** `content/samuel-dialogue-graph.ts`

**IMPORTANT:** This file is large (~7000 lines). Be careful. Only ADD nodes, never modify existing ones.

**Find the end of the nodes array** (search for the last `},` before `]` that closes the nodes array, or search for `// END OF NODES`).

**Add these NEW nodes BEFORE the array closes:**

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS - Trust-gated hints about station nature
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'samuel_mystery_hint_1',
        speaker: 'samuel',
        requiredState: {
            trust: { min: 4 }
        },
        content: [
            {
                text: "You ever wonder why folks end up here? At this particular station?\n\nAin't random. Never is.",
                emotion: 'mysterious',
                voiceStyle: 'reflective'
            }
        ],
        choices: [
            {
                choiceId: 'mystery_ask_more',
                text: "What do you mean?",
                nextNodeId: 'samuel_mystery_deflect_1',
                pattern: 'exploring'
            },
            {
                choiceId: 'mystery_accept',
                text: "I think I'm starting to understand.",
                nextNodeId: 'samuel_hub_return',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'samuel_mystery_deflect_1',
        speaker: 'samuel',
        content: [
            {
                text: "Ha. You'll figure it out. Everyone does, eventually.\n\nRight now, focus on the folks here. Their stories... they're connected to yours more than you know.",
                emotion: 'knowing',
                voiceStyle: 'warm'
            }
        ],
        choices: [
            {
                choiceId: 'mystery_understood',
                text: "I'll keep that in mind.",
                nextNodeId: 'samuel_hub_return',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'samuel_mystery_hint_2',
        speaker: 'samuel',
        requiredState: {
            trust: { min: 6 }
        },
        content: [
            {
                text: "The station... it ain't just a place. It's more like a <shake>mirror</shake>.\n\nShows you what you need to see. Not always what you want to.",
                emotion: 'vulnerable',
                voiceStyle: 'reflective'
            }
        ],
        choices: [
            {
                choiceId: 'mystery_mirror_ask',
                text: "A mirror? What am I supposed to see?",
                nextNodeId: 'samuel_mystery_mirror_response',
                pattern: 'exploring'
            },
            {
                choiceId: 'mystery_mirror_reflect',
                text: "I think I've already started seeing it.",
                nextNodeId: 'samuel_mystery_mirror_response',
                pattern: 'analytical'
            }
        ],
        tags: ['mystery', 'revelation']
    },

    {
        nodeId: 'samuel_mystery_mirror_response',
        speaker: 'samuel',
        content: [
            {
                text: "Yourself. Who you really are. Who you could become.\n\nEvery conversation here, every choice... it's all showing you something. Pay attention.",
                emotion: 'knowing',
                voiceStyle: 'mentor'
            }
        ],
        onEnter: [
            { characterId: 'samuel', addKnowledgeFlags: ['mystery_mirror_revealed'] }
        ],
        choices: [
            {
                choiceId: 'return_to_hub',
                text: "Thank you, Samuel.",
                nextNodeId: 'samuel_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'revelation']
    },

    {
        nodeId: 'samuel_mystery_revelation',
        speaker: 'samuel',
        requiredState: {
            trust: { min: 8 },
            knowledge: ['mystery_mirror_revealed']
        },
        content: [
            {
                text: "You've been here a while now. Talked to a lot of folks. Learned their stories.\n\n<bloom>You ready to hear what this place really is?</bloom>",
                emotion: 'serious',
                voiceStyle: 'mentor'
            }
        ],
        choices: [
            {
                choiceId: 'mystery_ready',
                text: "I'm ready.",
                nextNodeId: 'samuel_station_truth',
                pattern: 'patience'
            },
            {
                choiceId: 'mystery_not_yet',
                text: "Not yet. I want to talk to more people first.",
                nextNodeId: 'samuel_hub_return',
                pattern: 'exploring'
            }
        ],
        tags: ['mystery', 'climax']
    },

    {
        nodeId: 'samuel_station_truth',
        speaker: 'samuel',
        content: [
            {
                text: "Grand Central Terminus ain't a train station. Not really.\n\nIt's a <bloom>crossroads</bloom>. A place between who you were and who you're becoming.",
                emotion: 'vulnerable',
                voiceStyle: 'reflective'
            },
            {
                text: "Every person you met here? They're real. Their struggles are real. But you found 'em because <shake>you needed to</shake>.\n\nTheir paths crossed yours for a reason.",
                emotion: 'knowing',
                voiceStyle: 'mentor'
            },
            {
                text: "The patterns you've been building... analytical, helping, building, exploring, patience...\n\nThey ain't just words. They're <bloom>who you are</bloom>. And now you know it.",
                emotion: 'proud',
                voiceStyle: 'warm'
            }
        ],
        onEnter: [
            { characterId: 'samuel', addKnowledgeFlags: ['station_truth_revealed'] }
        ],
        choices: [
            {
                choiceId: 'truth_grateful',
                text: "Thank you for showing me this.",
                nextNodeId: 'samuel_truth_farewell',
                pattern: 'helping'
            },
            {
                choiceId: 'truth_question',
                text: "What happens now?",
                nextNodeId: 'samuel_truth_farewell',
                pattern: 'exploring'
            }
        ],
        tags: ['mystery', 'revelation', 'climax']
    },

    {
        nodeId: 'samuel_truth_farewell',
        speaker: 'samuel',
        content: [
            {
                text: "Now? You take what you learned here and you <bloom>live it</bloom>.\n\nThe station will always be here if you need it. But the real journey... that's out there.",
                emotion: 'warm',
                voiceStyle: 'mentor'
            },
            {
                text: "I'm proud of you. Truly.\n\nNow go. Show the world who you've become.",
                emotion: 'proud',
                voiceStyle: 'warm'
            }
        ],
        onEnter: [
            { characterId: 'samuel', addKnowledgeFlags: ['samuel_farewell_complete'] }
        ],
        choices: [
            {
                choiceId: 'farewell_stay',
                text: "I'd like to stay a little longer.",
                nextNodeId: 'samuel_hub_return'
            },
            {
                choiceId: 'farewell_go',
                text: "Goodbye, Samuel.",
                nextNodeId: 'journey_complete_trigger',
                pattern: 'patience'
            }
        ],
        tags: ['farewell', 'ending']
    },
```

**Verification:**
```bash
npm run type-check
npm test tests/content/dialogue-graphs.test.ts
```

---

### Step B.2: Add Mystery Nodes to Samuel's Entry Points

**File:** `content/samuel-dialogue-graph.ts`

**Find the `samuelEntryPoints` export** (search for `export const samuelEntryPoints`).

**Add these new entry points to the array:**

```typescript
    'samuel_mystery_hint_1',
    'samuel_mystery_hint_2',
    'samuel_mystery_revelation',
```

**These will make the mystery nodes accessible from the hub based on trust level.**

**Verification:**
```bash
npm run type-check
```

---

### Step B.3: Maya Chen (Tech Innovator)

**File:** `content/maya-dialogue-graph.ts`

**Add these nodes before the array closes:**

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'maya_mystery_hint',
        speaker: 'maya',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "Can I tell you something weird?\n\nI've been tracking the patterns here. The platforms, the people who show up. It's not random.",
                emotion: 'curious',
                voiceStyle: 'technical'
            },
            {
                text: "There's an <shake>algorithm</shake> to this place. I just can't figure out who wrote it.",
                emotion: 'intrigued',
                voiceStyle: 'analytical'
            }
        ],
        choices: [
            {
                choiceId: 'maya_mystery_dig',
                text: "Have you found any patterns?",
                nextNodeId: 'maya_mystery_pattern',
                pattern: 'analytical'
            },
            {
                choiceId: 'maya_mystery_dismiss',
                text: "Maybe some things don't need explaining.",
                nextNodeId: 'maya_hub_return',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'maya_mystery_pattern',
        speaker: 'maya',
        content: [
            {
                text: "The people who arrive here... they're all at some kind of crossroads. Career stuff, identity stuff.\n\nAnd they keep meeting exactly the right people to help them figure it out.",
                emotion: 'thoughtful',
                voiceStyle: 'reflective'
            },
            {
                text: "Like you and me. What are the odds we'd meet? And that you'd be exactly the person I needed to talk to?",
                emotion: 'vulnerable',
                voiceStyle: 'warm'
            }
        ],
        onEnter: [
            { characterId: 'maya', addKnowledgeFlags: ['maya_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'maya_mystery_agree',
                text: "I've noticed that too.",
                nextNodeId: 'maya_hub_return',
                pattern: 'exploring'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.4: Marcus Thompson (Medical Tech)

**File:** `content/marcus-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'marcus_mystery_hint',
        speaker: 'marcus',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "You know what's strange? In the hospital, I see patients at their worst. Scared, vulnerable.\n\nBut here... everyone I meet is at a turning point. Not sick, just... <shake>searching</shake>.",
                emotion: 'reflective',
                voiceStyle: 'thoughtful'
            },
            {
                text: "It's like the station collects people who are ready to change.",
                emotion: 'curious',
                voiceStyle: 'warm'
            }
        ],
        choices: [
            {
                choiceId: 'marcus_mystery_agree',
                text: "I feel that too. Like I'm supposed to be here.",
                nextNodeId: 'marcus_mystery_response',
                pattern: 'helping'
            },
            {
                choiceId: 'marcus_mystery_question',
                text: "What do you think it means?",
                nextNodeId: 'marcus_mystery_response',
                pattern: 'exploring'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'marcus_mystery_response',
        speaker: 'marcus',
        content: [
            {
                text: "I don't know. But I've learned not to question when something feels right.\n\nMeeting you felt right. That's enough for me.",
                emotion: 'warm',
                voiceStyle: 'caring'
            }
        ],
        onEnter: [
            { characterId: 'marcus', addKnowledgeFlags: ['marcus_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'marcus_mystery_return',
                text: "I'm glad we met too.",
                nextNodeId: 'marcus_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.5: Devon Kumar (Systems Thinker)

**File:** `content/devon-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'devon_mystery_hint',
        speaker: 'devon',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I've been mapping this place. The platforms, the connections, the flow of people.\n\nIt doesn't follow normal system architecture. It's almost like it... <shake>adapts</shake>.",
                emotion: 'intrigued',
                voiceStyle: 'analytical'
            },
            {
                text: "Every time I think I understand the pattern, it shifts. Like it's responding to something.",
                emotion: 'curious',
                voiceStyle: 'technical'
            }
        ],
        choices: [
            {
                choiceId: 'devon_mystery_dig',
                text: "Responding to what?",
                nextNodeId: 'devon_mystery_theory',
                pattern: 'analytical'
            },
            {
                choiceId: 'devon_mystery_accept',
                text: "Some systems are beyond mapping.",
                nextNodeId: 'devon_hub_return',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'devon_mystery_theory',
        speaker: 'devon',
        content: [
            {
                text: "To us. To what we need.\n\nI know that sounds unscientific. But the data supports it. People here find exactly what they're looking for, even when they don't know they're looking.",
                emotion: 'vulnerable',
                voiceStyle: 'reflective'
            },
            {
                text: "You found me. And... I think I needed to be found.",
                emotion: 'grateful',
                voiceStyle: 'warm'
            }
        ],
        onEnter: [
            { characterId: 'devon', addKnowledgeFlags: ['devon_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'devon_mystery_return',
                text: "Maybe that's how it's supposed to work.",
                nextNodeId: 'devon_hub_return',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.6: Kai Rivera (Safety Specialist)

**File:** `content/kai-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'kai_mystery_hint',
        speaker: 'kai',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "In my line of work, I assess environments for risk. Hazards, escape routes, structural integrity.\n\nThis station? It breaks every rule. And yet... it feels <shake>safe</shake>.",
                emotion: 'puzzled',
                voiceStyle: 'analytical'
            },
            {
                text: "Safer than anywhere I've ever been. How does that make sense?",
                emotion: 'curious',
                voiceStyle: 'reflective'
            }
        ],
        choices: [
            {
                choiceId: 'kai_mystery_explore',
                text: "Maybe safety isn't always about physical structures.",
                nextNodeId: 'kai_mystery_response',
                pattern: 'helping'
            },
            {
                choiceId: 'kai_mystery_agree',
                text: "I feel it too. Something protective about this place.",
                nextNodeId: 'kai_mystery_response',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'kai_mystery_response',
        speaker: 'kai',
        content: [
            {
                text: "Yeah. It's like the station itself is... looking out for us.\n\nI know how that sounds. But after everything I've seen, I've learned to trust my instincts.",
                emotion: 'accepting',
                voiceStyle: 'warm'
            }
        ],
        onEnter: [
            { characterId: 'kai', addKnowledgeFlags: ['kai_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'kai_mystery_return',
                text: "Your instincts brought you here. That says something.",
                nextNodeId: 'kai_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.7: Rohan Patel (Deep Tech)

**File:** `content/rohan-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'rohan_mystery_hint',
        speaker: 'rohan',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I've been thinking about emergence. How complex behaviors arise from simple rules.\n\nThis station... it exhibits emergent properties I can't explain.",
                emotion: 'intrigued',
                voiceStyle: 'technical'
            },
            {
                text: "The conversations here. They <shake>compound</shake>. Each one builds on the last in ways that feel... designed.",
                emotion: 'curious',
                voiceStyle: 'analytical'
            }
        ],
        choices: [
            {
                choiceId: 'rohan_mystery_dig',
                text: "Designed by whom?",
                nextNodeId: 'rohan_mystery_theory',
                pattern: 'analytical'
            },
            {
                choiceId: 'rohan_mystery_accept',
                text: "Maybe design and emergence aren't opposites.",
                nextNodeId: 'rohan_mystery_theory',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'rohan_mystery_theory',
        speaker: 'rohan',
        content: [
            {
                text: "I don't know. But I've stopped needing to know.\n\nSome systems are meant to be experienced, not reverse-engineered. This might be one of them.",
                emotion: 'peaceful',
                voiceStyle: 'reflective'
            }
        ],
        onEnter: [
            { characterId: 'rohan', addKnowledgeFlags: ['rohan_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'rohan_mystery_return',
                text: "That's surprisingly zen for an engineer.",
                nextNodeId: 'rohan_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.8: Tess Williams (Education Founder)

**File:** `content/tess-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'tess_mystery_hint',
        speaker: 'tess',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "You know what the best classrooms have? They make you feel like you belong there.\n\nThis station has that. Everyone who comes through... they're supposed to be here.",
                emotion: 'warm',
                voiceStyle: 'nurturing'
            },
            {
                text: "I've never believed in fate. But I believe in <shake>readiness</shake>. And everyone here is ready for something.",
                emotion: 'knowing',
                voiceStyle: 'mentor'
            }
        ],
        choices: [
            {
                choiceId: 'tess_mystery_ask',
                text: "Ready for what?",
                nextNodeId: 'tess_mystery_response',
                pattern: 'exploring'
            },
            {
                choiceId: 'tess_mystery_agree',
                text: "I think I'm ready too. I just don't know for what yet.",
                nextNodeId: 'tess_mystery_response',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'tess_mystery_response',
        speaker: 'tess',
        content: [
            {
                text: "To become who they're meant to be. That's what education really is—not filling empty vessels, but lighting fires.\n\nThis place? It's full of sparks waiting to catch.",
                emotion: 'inspired',
                voiceStyle: 'passionate'
            }
        ],
        onEnter: [
            { characterId: 'tess', addKnowledgeFlags: ['tess_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'tess_mystery_return',
                text: "You're one of those sparks too.",
                nextNodeId: 'tess_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.9: Yaquin Okonkwo (EdTech Creator)

**File:** `content/yaquin-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'yaquin_mystery_hint',
        speaker: 'yaquin',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I build learning platforms. Adaptive ones that respond to how users interact.\n\nThis station reminds me of my best work. Except I didn't build this, and it's way more sophisticated.",
                emotion: 'amazed',
                voiceStyle: 'technical'
            },
            {
                text: "It's like the whole place is a <shake>learning environment</shake>. And we're all students.",
                emotion: 'intrigued',
                voiceStyle: 'curious'
            }
        ],
        choices: [
            {
                choiceId: 'yaquin_mystery_dig',
                text: "What do you think it's teaching us?",
                nextNodeId: 'yaquin_mystery_response',
                pattern: 'exploring'
            },
            {
                choiceId: 'yaquin_mystery_meta',
                text: "Maybe it's teaching us about ourselves.",
                nextNodeId: 'yaquin_mystery_response',
                pattern: 'analytical'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'yaquin_mystery_response',
        speaker: 'yaquin',
        content: [
            {
                text: "That's exactly it. The curriculum is us. Our choices, our conversations, our growth.\n\nWhoever designed this place... they understood something profound about how people change.",
                emotion: 'respectful',
                voiceStyle: 'reflective'
            }
        ],
        onEnter: [
            { characterId: 'yaquin', addKnowledgeFlags: ['yaquin_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'yaquin_mystery_return',
                text: "I'm glad I'm learning alongside you.",
                nextNodeId: 'yaquin_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.10: Grace Chen (Healthcare Operations)

**File:** `content/grace-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'grace_mystery_hint',
        speaker: 'grace',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "In healthcare, we call it triage. Putting people where they need to be, when they need to be there.\n\nThis station does that automatically. Everyone ends up exactly where they should be.",
                emotion: 'observant',
                voiceStyle: 'analytical'
            },
            {
                text: "It's like an invisible hand guiding the flow. I've never seen anything so <shake>efficient</shake>.",
                emotion: 'impressed',
                voiceStyle: 'professional'
            }
        ],
        choices: [
            {
                choiceId: 'grace_mystery_ask',
                text: "Do you think it's intentional?",
                nextNodeId: 'grace_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'grace_mystery_feel',
                text: "It guided me to you.",
                nextNodeId: 'grace_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'grace_mystery_response',
        speaker: 'grace',
        content: [
            {
                text: "Intentional or not, it works. And in my field, that's what matters.\n\nSome systems don't need to be understood. They need to be appreciated.",
                emotion: 'accepting',
                voiceStyle: 'warm'
            }
        ],
        onEnter: [
            { characterId: 'grace', addKnowledgeFlags: ['grace_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'grace_mystery_return',
                text: "I appreciate meeting you.",
                nextNodeId: 'grace_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.11: Elena Vasquez (Information Science / Archivist)

**File:** `content/elena-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'elena_mystery_hint',
        speaker: 'elena',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I've catalogued thousands of documents. Birth records, death records, everything in between.\n\nBut this station... it doesn't appear in any archive. It's like it exists <shake>outside</shake> normal records.",
                emotion: 'mystified',
                voiceStyle: 'scholarly'
            },
            {
                text: "Places this significant always leave traces. This one doesn't. It's fascinating.",
                emotion: 'intrigued',
                voiceStyle: 'curious'
            }
        ],
        choices: [
            {
                choiceId: 'elena_mystery_dig',
                text: "Have you tried to document it yourself?",
                nextNodeId: 'elena_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'elena_mystery_accept',
                text: "Maybe some things aren't meant to be archived.",
                nextNodeId: 'elena_mystery_response',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'elena_mystery_response',
        speaker: 'elena',
        content: [
            {
                text: "I tried. But every time I write about it, the words feel... incomplete. Like the station is bigger than language.\n\nMaybe it's meant to be experienced, not recorded. That's a new thought for an archivist.",
                emotion: 'humbled',
                voiceStyle: 'reflective'
            }
        ],
        onEnter: [
            { characterId: 'elena', addKnowledgeFlags: ['elena_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'elena_mystery_return',
                text: "Some stories are written in people, not paper.",
                nextNodeId: 'elena_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.12: Alex Park (Supply Chain & Logistics)

**File:** `content/alex-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'alex_mystery_hint',
        speaker: 'alex',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I optimize routes for a living. Getting things from A to B as efficiently as possible.\n\nBut this station doesn't have routes. Or if it does, they change based on who's walking them.",
                emotion: 'puzzled',
                voiceStyle: 'analytical'
            },
            {
                text: "It's like the destination finds you, not the other way around. That breaks every logistics model I know.",
                emotion: 'intrigued',
                voiceStyle: 'curious'
            }
        ],
        choices: [
            {
                choiceId: 'alex_mystery_dig',
                text: "Maybe people aren't packages.",
                nextNodeId: 'alex_mystery_response',
                pattern: 'helping'
            },
            {
                choiceId: 'alex_mystery_analyze',
                text: "What if the station optimizes for something we can't measure?",
                nextNodeId: 'alex_mystery_response',
                pattern: 'analytical'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'alex_mystery_response',
        speaker: 'alex',
        content: [
            {
                text: "Ha. Fair point. Maybe the metric here isn't time or distance. Maybe it's... meaning?\n\nGod, that sounds soft. But I'm starting to think it might be true.",
                emotion: 'vulnerable',
                voiceStyle: 'honest'
            }
        ],
        onEnter: [
            { characterId: 'alex', addKnowledgeFlags: ['alex_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'alex_mystery_return',
                text: "Soft isn't the same as wrong.",
                nextNodeId: 'alex_hub_return',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.13: Jordan Mitchell (Career Navigator)

**File:** `content/jordan-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'jordan_mystery_hint',
        speaker: 'jordan',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I've helped hundreds of people find their career paths. Asked all the standard questions.\n\nBut here? The questions ask themselves. People discover things about themselves just by being here.",
                emotion: 'amazed',
                voiceStyle: 'professional'
            },
            {
                text: "It's like the station is doing my job, but better. And it doesn't even have a methodology.",
                emotion: 'humbled',
                voiceStyle: 'reflective'
            }
        ],
        choices: [
            {
                choiceId: 'jordan_mystery_dig',
                text: "Maybe its methodology is the people themselves.",
                nextNodeId: 'jordan_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'jordan_mystery_feel',
                text: "You helped me discover things too.",
                nextNodeId: 'jordan_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'jordan_mystery_response',
        speaker: 'jordan',
        content: [
            {
                text: "You know what? I think you're right. The station isn't the teacher. We are. It just... brings us together.\n\nEvery conversation here is a kind of guidance session. Including this one.",
                emotion: 'realizing',
                voiceStyle: 'warm'
            }
        ],
        onEnter: [
            { characterId: 'jordan', addKnowledgeFlags: ['jordan_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'jordan_mystery_return',
                text: "Then I'm glad we had this session.",
                nextNodeId: 'jordan_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.14: Silas Brown (Advanced Manufacturing)

**File:** `content/silas-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'silas_mystery_hint',
        speaker: 'silas',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I've worked with my hands my whole life. Metal, wood, machinery. I understand how things are made.\n\nBut this station... I can't figure out how it was built. Or who built it.",
                emotion: 'puzzled',
                voiceStyle: 'practical'
            },
            {
                text: "The architecture doesn't follow any style I know. It's like it <shake>grew</shake> instead of being constructed.",
                emotion: 'mystified',
                voiceStyle: 'observant'
            }
        ],
        choices: [
            {
                choiceId: 'silas_mystery_dig',
                text: "Maybe it did grow. From all of us.",
                nextNodeId: 'silas_mystery_response',
                pattern: 'exploring'
            },
            {
                choiceId: 'silas_mystery_practical',
                text: "Does it matter how it was made, if it works?",
                nextNodeId: 'silas_mystery_response',
                pattern: 'building'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'silas_mystery_response',
        speaker: 'silas',
        content: [
            {
                text: "Heh. You sound like my old foreman. 'Don't ask how the sausage is made, just appreciate the sausage.'\n\nBut yeah. Some things work best when you don't overthink them.",
                emotion: 'accepting',
                voiceStyle: 'practical'
            }
        ],
        onEnter: [
            { characterId: 'silas', addKnowledgeFlags: ['silas_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'silas_mystery_return',
                text: "You've built good things too. That counts.",
                nextNodeId: 'silas_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.15: Asha Desai (Conflict Resolution / Mediator)

**File:** `content/asha-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'asha_mystery_hint',
        speaker: 'asha',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "In mediation, I create safe spaces for difficult conversations. Neutral ground where people can be honest.\n\nThis station... it does that naturally. Everyone here feels safe to be vulnerable.",
                emotion: 'impressed',
                voiceStyle: 'thoughtful'
            },
            {
                text: "I've spent years learning to create that feeling. This place just <shake>has</shake> it.",
                emotion: 'humbled',
                voiceStyle: 'reflective'
            }
        ],
        choices: [
            {
                choiceId: 'asha_mystery_dig',
                text: "Maybe the station learned from people like you.",
                nextNodeId: 'asha_mystery_response',
                pattern: 'helping'
            },
            {
                choiceId: 'asha_mystery_feel',
                text: "You create that feeling too. I've felt it talking with you.",
                nextNodeId: 'asha_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'asha_mystery_response',
        speaker: 'asha',
        content: [
            {
                text: "Thank you for saying that. I think the station amplifies what we bring to it. Our openness, our willingness to connect.\n\nWe make each other safe. The station just gives us the space to do it.",
                emotion: 'warm',
                voiceStyle: 'nurturing'
            }
        ],
        onEnter: [
            { characterId: 'asha', addKnowledgeFlags: ['asha_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'asha_mystery_return',
                text: "You've made me feel safe to share.",
                nextNodeId: 'asha_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.16: Lira Santos (Communications / Sound Design)

**File:** `content/lira-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'lira_mystery_hint',
        speaker: 'lira',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "Listen. Really listen.\n\nThe station has a sound. Not the trains, not the announcements. Underneath all that. A <shake>hum</shake>.",
                emotion: 'focused',
                voiceStyle: 'artistic'
            },
            {
                text: "It changes based on who's here. More conversations, the hum gets richer. Like we're all contributing to one big chord.",
                emotion: 'inspired',
                voiceStyle: 'passionate'
            }
        ],
        choices: [
            {
                choiceId: 'lira_mystery_listen',
                text: "I think I can hear it...",
                nextNodeId: 'lira_mystery_response',
                pattern: 'exploring'
            },
            {
                choiceId: 'lira_mystery_meaning',
                text: "What do you think it means?",
                nextNodeId: 'lira_mystery_response',
                pattern: 'analytical'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'lira_mystery_response',
        speaker: 'lira',
        content: [
            {
                text: "I think we're all instruments. And the station is the concert hall.\n\nEvery conversation, every connection—it's music. You just have to learn to hear it.",
                emotion: 'transcendent',
                voiceStyle: 'poetic'
            }
        ],
        onEnter: [
            { characterId: 'lira', addKnowledgeFlags: ['lira_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'lira_mystery_return',
                text: "You've helped me hear things I never noticed before.",
                nextNodeId: 'lira_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.17: Zara Ahmed (Data Ethics / Artist)

**File:** `content/zara-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'zara_mystery_hint',
        speaker: 'zara',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I study how algorithms shape human behavior. Usually, it's manipulative. Surveillance capitalism, attention hijacking.\n\nBut whatever algorithm runs this place? It's... <shake>kind</shake>.",
                emotion: 'surprised',
                voiceStyle: 'analytical'
            },
            {
                text: "It brings people together without exploiting them. I didn't think that was possible.",
                emotion: 'hopeful',
                voiceStyle: 'reflective'
            }
        ],
        choices: [
            {
                choiceId: 'zara_mystery_dig',
                text: "What makes it different?",
                nextNodeId: 'zara_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'zara_mystery_feel',
                text: "Maybe because it serves us, not the other way around.",
                nextNodeId: 'zara_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'zara_mystery_response',
        speaker: 'zara',
        content: [
            {
                text: "It optimizes for connection, not engagement. For growth, not addiction.\n\nImagine if all technology worked that way. This station gives me hope that it's possible.",
                emotion: 'inspired',
                voiceStyle: 'passionate'
            }
        ],
        onEnter: [
            { characterId: 'zara', addKnowledgeFlags: ['zara_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'zara_mystery_return',
                text: "Maybe you'll build something like it someday.",
                nextNodeId: 'zara_hub_return',
                pattern: 'building'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.18: Quinn Foster (Finance Specialist) - LinkedIn 2026

**File:** `content/quinn-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'quinn_mystery_hint',
        speaker: 'quinn',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "In finance, everything has a value. Assets, liabilities, risk-adjusted returns.\n\nBut the currency here isn't money. It's... <shake>attention</shake>. Real attention. The kind you can't fake.",
                emotion: 'reflective',
                voiceStyle: 'analytical'
            },
            {
                text: "Every conversation here feels like an investment. And the returns are... different.",
                emotion: 'thoughtful',
                voiceStyle: 'honest'
            }
        ],
        choices: [
            {
                choiceId: 'quinn_mystery_dig',
                text: "What kind of returns?",
                nextNodeId: 'quinn_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'quinn_mystery_agree',
                text: "Some investments pay off in ways money can't measure.",
                nextNodeId: 'quinn_mystery_response',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'quinn_mystery_response',
        speaker: 'quinn',
        content: [
            {
                text: "Clarity. Purpose. The feeling that you're exactly where you should be.\n\nMy whole career, I've been measuring the wrong things. This place is teaching me that.",
                emotion: 'vulnerable',
                voiceStyle: 'honest'
            }
        ],
        onEnter: [
            { characterId: 'quinn', addKnowledgeFlags: ['quinn_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'quinn_mystery_return',
                text: "You're not too late to measure what matters.",
                nextNodeId: 'quinn_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.19: Dante Romano (Sales Strategist) - LinkedIn 2026

**File:** `content/dante-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'dante_mystery_hint',
        speaker: 'dante',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I've sold everything. Products, services, ideas. I know how to read people, figure out what they want.\n\nBut this station? It already knows. Before I even ask.",
                emotion: 'impressed',
                voiceStyle: 'confident'
            },
            {
                text: "Every person I meet here needs exactly what I have to offer. And I need what they have. It's the perfect <shake>exchange</shake>.",
                emotion: 'intrigued',
                voiceStyle: 'strategic'
            }
        ],
        choices: [
            {
                choiceId: 'dante_mystery_dig',
                text: "Maybe that's not coincidence.",
                nextNodeId: 'dante_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'dante_mystery_feel',
                text: "Some connections are meant to happen.",
                nextNodeId: 'dante_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'dante_mystery_response',
        speaker: 'dante',
        content: [
            {
                text: "You know what's wild? For once, I'm not trying to close deals. I'm just... connecting. And it feels better than any sale I've ever made.\n\nMaybe that's what the station's selling. Authenticity.",
                emotion: 'vulnerable',
                voiceStyle: 'honest'
            }
        ],
        onEnter: [
            { characterId: 'dante', addKnowledgeFlags: ['dante_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'dante_mystery_return',
                text: "That's a product worth buying.",
                nextNodeId: 'dante_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.20: Nadia Petrova (AI Strategist) - LinkedIn 2026

**File:** `content/nadia-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'nadia_mystery_hint',
        speaker: 'nadia',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I work with AI systems. I've seen what they can do—and what they can't.\n\nThis station operates like the most advanced AI I've ever encountered. But there's no server room. No data center.",
                emotion: 'mystified',
                voiceStyle: 'analytical'
            },
            {
                text: "It's like the intelligence is... <shake>distributed</shake>. In all of us.",
                emotion: 'intrigued',
                voiceStyle: 'technical'
            }
        ],
        choices: [
            {
                choiceId: 'nadia_mystery_dig',
                text: "You mean we're the processing power?",
                nextNodeId: 'nadia_mystery_response',
                pattern: 'analytical'
            },
            {
                choiceId: 'nadia_mystery_feel',
                text: "Maybe intelligence isn't always artificial.",
                nextNodeId: 'nadia_mystery_response',
                pattern: 'patience'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'nadia_mystery_response',
        speaker: 'nadia',
        content: [
            {
                text: "Exactly. The station isn't running ON us—it's running THROUGH us. Our connections are the network.\n\nI've spent my career building artificial systems. This one is beautifully, irreducibly human.",
                emotion: 'awed',
                voiceStyle: 'reflective'
            }
        ],
        onEnter: [
            { characterId: 'nadia', addKnowledgeFlags: ['nadia_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'nadia_mystery_return',
                text: "Maybe the best intelligence is the one we build together.",
                nextNodeId: 'nadia_hub_return',
                pattern: 'building'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

### Step B.21: Isaiah Washington (Nonprofit Leader) - LinkedIn 2026

**File:** `content/isaiah-dialogue-graph.ts`

```typescript
    // ═══════════════════════════════════════════════════════════════
    // MYSTERY BREADCRUMBS
    // ═══════════════════════════════════════════════════════════════

    {
        nodeId: 'isaiah_mystery_hint',
        speaker: 'isaiah',
        requiredState: {
            trust: { min: 5 }
        },
        content: [
            {
                text: "I've spent my life building communities. Bringing people together around shared purpose.\n\nThis station does that effortlessly. No fundraising, no marketing, no struggle for attention. People just... <shake>show up</shake>.",
                emotion: 'amazed',
                voiceStyle: 'passionate'
            },
            {
                text: "And they show up ready. Ready to help. Ready to connect. Ready to change.",
                emotion: 'inspired',
                voiceStyle: 'warm'
            }
        ],
        choices: [
            {
                choiceId: 'isaiah_mystery_dig',
                text: "What do you think draws them here?",
                nextNodeId: 'isaiah_mystery_response',
                pattern: 'exploring'
            },
            {
                choiceId: 'isaiah_mystery_feel',
                text: "Maybe they were always ready. They just needed a place.",
                nextNodeId: 'isaiah_mystery_response',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },

    {
        nodeId: 'isaiah_mystery_response',
        speaker: 'isaiah',
        content: [
            {
                text: "That's beautiful. And I think you're right.\n\nThe station isn't creating community. It's revealing it. Showing us we were connected all along.\n\nThat's the real miracle.",
                emotion: 'moved',
                voiceStyle: 'reflective'
            }
        ],
        onEnter: [
            { characterId: 'isaiah', addKnowledgeFlags: ['isaiah_mystery_noticed'] }
        ],
        choices: [
            {
                choiceId: 'isaiah_mystery_return',
                text: "I'm glad I'm part of this community.",
                nextNodeId: 'isaiah_hub_return',
                pattern: 'helping'
            }
        ],
        tags: ['mystery', 'breadcrumb']
    },
```

---

## Step B.22: Add Hub Return Nodes (If Missing)

**IMPORTANT:** Each mystery node above references a `{character}_hub_return` node. If this node doesn't exist in the character's graph, you need to add it.

**Pattern for hub return node:**

```typescript
    {
        nodeId: '{character}_hub_return',
        speaker: '{character}',
        content: [
            {
                text: "It was good talking with you. Come back anytime.",
                emotion: 'warm',
                voiceStyle: 'friendly'
            }
        ],
        choices: [],  // Empty choices = conversation end, return to hub
        tags: ['farewell']
    },
```

**Check each file:** Search for `hub_return` - if it exists, you're good. If not, add the above pattern with the correct character name.

---

## ✅ CHECKPOINT 2: Phase B Complete

**Before continuing, verify ALL of the following:**

```bash
# 1. Type check passes
npm run type-check

# 2. All tests pass
npm test

# 3. Specifically test dialogue graphs
npm test tests/content/dialogue-graphs.test.ts
```

**Commit Phase B:**
```bash
git add content/*.ts
git commit -m "feat: add mystery breadcrumbs to all 20 characters

- Each character has 2 mystery nodes (hint + response)
- Trust-gated at level 5+
- Adds knowledge flags for tracking
- Connects to station's metaphysical nature
- Total: 38 new dialogue nodes"
```

**✅ Only proceed to Phase C after commit succeeds.**

---

## 🏁 PHASE C: Pattern-Based Ending Framework

**Goal:** Create infrastructure for 5 different endings based on dominant pattern.

**Files to create:**
1. `lib/pattern-endings.ts` - Ending definitions and logic
2. `components/JourneyComplete.tsx` - Ending screen component

**Time estimate:** ~30 minutes

---

### Step C.1: Create Ending Definitions

**File:** `lib/pattern-endings.ts` (NEW FILE)

**Create this new file:**

```typescript
/**
 * Pattern-Based Endings
 *
 * Different ending narratives based on player's dominant pattern.
 * Triggered when player completes the station mystery arc.
 */

import { type PatternType, PATTERN_METADATA } from './patterns'

export interface PatternEnding {
    pattern: PatternType
    title: string
    subtitle: string
    narrative: string[]
    callToAction: string
}

export const PATTERN_ENDINGS: Record<PatternType, PatternEnding> = {
    analytical: {
        pattern: 'analytical',
        title: 'The Clear-Eyed Path',
        subtitle: 'You see the world as it truly is',
        narrative: [
            "You came to Grand Central seeking answers. You found them—not in simple solutions, but in understanding the complex systems that shape our lives.",
            "Your mind cuts through noise to find signal. Where others see chaos, you see patterns. Where others feel lost, you find the logic underneath.",
            "The world needs people who can think clearly, who can analyze problems without flinching from hard truths. That's your gift.",
            "Take it forward. The puzzles out there are waiting for someone like you to solve them."
        ],
        callToAction: "Your analytical mind is your compass. Trust it."
    },

    patience: {
        pattern: 'patience',
        title: 'The Long View',
        subtitle: 'You understand that growth takes time',
        narrative: [
            "You didn't rush through Grand Central. You listened. You waited. You let understanding come in its own time.",
            "In a world obsessed with speed, your patience is revolutionary. You know that the best things—relationships, skills, wisdom—can't be hurried.",
            "The people you met here opened up to you because you gave them space to be themselves. That's rare. That's valuable.",
            "The path ahead is long, but you've proven you can walk it. One step at a time."
        ],
        callToAction: "Your patience is your strength. The world needs your steady presence."
    },

    exploring: {
        pattern: 'exploring',
        title: 'The Curious Soul',
        subtitle: 'You find wonder in every corner',
        narrative: [
            "You came to Grand Central with open eyes and an open mind. Every platform was an adventure. Every conversation, a discovery.",
            "Your curiosity led you to stories others might have missed. You asked the questions no one else thought to ask.",
            "The world is vast and full of mysteries. Most people walk past them without noticing. But not you.",
            "Keep exploring. The best discoveries are still waiting for someone brave enough to look."
        ],
        callToAction: "Your curiosity is your superpower. Never stop asking 'what if?'"
    },

    helping: {
        pattern: 'helping',
        title: 'The Connector',
        subtitle: 'You make others feel seen',
        narrative: [
            "You came to Grand Central and immediately saw the people, not just the station. Their struggles became your concern. Their victories, your joy.",
            "Every conversation you had here made someone feel less alone. That's not nothing—that's everything.",
            "The world is hungry for genuine connection. For someone who listens without judgment. For someone who helps without expecting anything in return.",
            "That's who you are. That's who you've always been."
        ],
        callToAction: "Your empathy is your gift. Share it generously."
    },

    building: {
        pattern: 'building',
        title: 'The Maker',
        subtitle: 'You create things that matter',
        narrative: [
            "You came to Grand Central with hands ready to work. You didn't just observe—you engaged. You built understanding piece by piece.",
            "There's something sacred about making things. About taking raw materials—ideas, relationships, skills—and shaping them into something new.",
            "The world is full of problems waiting for someone to build solutions. Not just talk about them. Actually build them.",
            "That's your calling. Go make something the world hasn't seen yet."
        ],
        callToAction: "Your hands can build the future. Start now."
    }
}

/**
 * Get the ending for a player based on their dominant pattern
 */
export function getPatternEnding(patterns: Record<PatternType, number>): PatternEnding {
    // Find dominant pattern
    let maxPattern: PatternType = 'exploring' // Default
    let maxValue = 0

    for (const [pattern, value] of Object.entries(patterns)) {
        if (value > maxValue) {
            maxValue = value
            maxPattern = pattern as PatternType
        }
    }

    return PATTERN_ENDINGS[maxPattern]
}

/**
 * Check if player is eligible for ending (has completed station mystery)
 */
export function isEligibleForEnding(knowledgeFlags: string[]): boolean {
    return knowledgeFlags.includes('station_truth_revealed')
}
```

**Verification:**
```bash
npm run type-check
```

---

### Step C.2: Create Journey Complete Screen

**File:** `components/JourneyComplete.tsx` (NEW FILE)

**Create this new file:**

```typescript
"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { getPatternEnding, type PatternEnding } from '@/lib/pattern-endings'
import { PATTERN_METADATA, type PatternType } from '@/lib/patterns'
import { cn } from '@/lib/utils'

interface JourneyCompleteProps {
    patterns: Record<PatternType, number>
    onContinue: () => void
    onRestart: () => void
}

export function JourneyComplete({ patterns, onContinue, onRestart }: JourneyCompleteProps) {
    const ending = useMemo(() => getPatternEnding(patterns), [patterns])
    const patternMeta = PATTERN_METADATA[ending.pattern]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="max-w-2xl mx-auto px-6 py-12 text-center"
            >
                {/* Pattern Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="mb-8"
                >
                    <div
                        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${patternMeta.color}20`, border: `2px solid ${patternMeta.color}` }}
                    >
                        <Sparkles className="w-10 h-10" style={{ color: patternMeta.color }} />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    {ending.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-lg text-slate-400 mb-8"
                >
                    {ending.subtitle}
                </motion.p>

                {/* Narrative */}
                <div className="space-y-4 mb-10">
                    {ending.narrative.map((paragraph, index) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + index * 0.3 }}
                            className="text-slate-300 leading-relaxed"
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="text-lg font-medium mb-10"
                    style={{ color: patternMeta.color }}
                >
                    {ending.callToAction}
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={onContinue}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                    >
                        Continue Exploring
                    </button>
                    <button
                        onClick={onRestart}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors"
                    >
                        Start New Journey
                    </button>
                </motion.div>

                {/* Pattern Summary */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                    className="mt-12 pt-8 border-t border-white/10"
                >
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Your Pattern Profile</p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {Object.entries(patterns).map(([pattern, value]) => (
                            <div key={pattern} className="text-center">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1 mx-auto"
                                    style={{
                                        backgroundColor: `${PATTERN_METADATA[pattern as PatternType].color}20`,
                                        border: pattern === ending.pattern ? `2px solid ${PATTERN_METADATA[pattern as PatternType].color}` : 'none'
                                    }}
                                >
                                    <span className="text-xs font-bold" style={{ color: PATTERN_METADATA[pattern as PatternType].color }}>
                                        {value}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-500 capitalize">{pattern}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
```

**Verification:**
```bash
npm run type-check
```

---

## ✅ CHECKPOINT 3: Phase C Complete

**Before continuing, verify ALL of the following:**

```bash
# 1. Type check passes
npm run type-check

# 2. All tests pass
npm test

# 3. Build succeeds
npm run build
```

**Commit Phase C:**
```bash
git add lib/pattern-endings.ts components/JourneyComplete.tsx
git commit -m "feat: add pattern-based ending framework

- 5 pattern-specific endings (analytical, patience, exploring, helping, building)
- JourneyComplete component with animated reveal
- Eligibility check based on station_truth_revealed flag"
```

**✅ Phase C complete. Request QA review from Opus.**

---

## ✅ FINAL CHECKPOINT: QA Review

**DO NOT proceed beyond this point. Opus will:**

1. Review all commits for correctness
2. Wire the JourneyComplete component into StatefulGameInterface
3. Add the `journey_complete_trigger` node routing
4. Test end-to-end flow
5. Make any necessary adjustments

**Your job is done after Phase C commit. Stop here and report completion.**

---

## Summary: All Commits Made

| Phase | Commit Message |
|-------|----------------|
| A | `feat: add arc completion visual indicators in constellation` |
| B | `feat: add mystery breadcrumbs to all 20 characters` |
| C | `feat: add pattern-based ending framework` |

---

## Files Changed Summary

| Phase | File | Action | Risk Level |
|-------|------|--------|------------|
| A | `components/constellation/ConstellationGraph.tsx` | MODIFY | Low |
| A | `hooks/useConstellationData.ts` | MODIFY | Medium |
| A | `components/constellation/DetailModal.tsx` | MODIFY | Low |
| B | `content/samuel-dialogue-graph.ts` | ADD NODES | Medium |
| B | `content/maya-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/marcus-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/devon-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/kai-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/rohan-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/tess-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/yaquin-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/grace-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/elena-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/alex-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/jordan-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/silas-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/asha-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/lira-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/zara-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/quinn-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/dante-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/nadia-dialogue-graph.ts` | ADD NODES | Low |
| B | `content/isaiah-dialogue-graph.ts` | ADD NODES | Low |
| C | `lib/pattern-endings.ts` | CREATE NEW | Low |
| C | `components/JourneyComplete.tsx` | CREATE NEW | Low |

---

## ⚠️ What NOT To Do (Common Mistakes)

| Mistake | Why It's Bad | What To Do Instead |
|---------|--------------|-------------------|
| Modify existing dialogue nodes | Breaks save files, navigation | Only ADD new nodes |
| Change DialogueNode type | Breaks all graphs | Use type as-is |
| Import JourneyComplete into StatefulGameInterface | Complex integration | Opus will do in QA |
| Add journey_complete_trigger node | Requires routing logic | Opus will do in QA |
| Modify lib/game-store.ts | Complex, fragile | Don't touch |
| Fix type errors "creatively" | Causes more errors | Stop and ask Opus |

---

## 🆘 Questions? Stop and Ask

If anything is unclear or you hit an unexpected error:

1. **STOP** - Don't try to fix it creatively
2. **DOCUMENT** - Write down the exact error message
3. **ASK OPUS** - Share what you tried and what failed

**The goal is clean, working code - not speed.**

---

## Quick Reference: Character IDs

Use these exact IDs in your code:

| Character | ID | File |
|-----------|-----|------|
| Samuel | `samuel` | samuel-dialogue-graph.ts |
| Maya | `maya` | maya-dialogue-graph.ts |
| Marcus | `marcus` | marcus-dialogue-graph.ts |
| Devon | `devon` | devon-dialogue-graph.ts |
| Kai | `kai` | kai-dialogue-graph.ts |
| Rohan | `rohan` | rohan-dialogue-graph.ts |
| Tess | `tess` | tess-dialogue-graph.ts |
| Yaquin | `yaquin` | yaquin-dialogue-graph.ts |
| Grace | `grace` | grace-dialogue-graph.ts |
| Elena | `elena` | elena-dialogue-graph.ts |
| Alex | `alex` | alex-dialogue-graph.ts |
| Jordan | `jordan` | jordan-dialogue-graph.ts |
| Silas | `silas` | silas-dialogue-graph.ts |
| Asha | `asha` | asha-dialogue-graph.ts |
| Lira | `lira` | lira-dialogue-graph.ts |
| Zara | `zara` | zara-dialogue-graph.ts |
| Quinn | `quinn` | quinn-dialogue-graph.ts |
| Dante | `dante` | dante-dialogue-graph.ts |
| Nadia | `nadia` | nadia-dialogue-graph.ts |
| Isaiah | `isaiah` | isaiah-dialogue-graph.ts |
