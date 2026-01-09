# Phase 4: Macro Loop Execution Plan

**For:** Anti Gravity
**QA By:** Opus
**Created:** January 9, 2026

---

## CRITICAL RULES - READ FIRST

### DO NOT:
- ❌ Modify any file in `lib/` except where explicitly specified
- ❌ Change function signatures or interfaces
- ❌ Remove or rename existing nodeIds
- ❌ Add new dependencies or imports to core files
- ❌ Touch `StatefulGameInterface.tsx` (it's fragile)
- ❌ Create new component files unless specified
- ❌ Use `any` type - always use proper types

### ALWAYS:
- ✅ Run `npm run type-check` after every file change
- ✅ Run `npm test` before committing
- ✅ Follow existing patterns exactly (copy-paste, then modify)
- ✅ Use existing types from `lib/dialogue-graph.ts`
- ✅ Keep commits small and focused (one task = one commit)

---

## Task 4.1: Character Arc Completion Recognition

**Goal:** Show visual feedback when player completes a character's vulnerability arc.

### Step 4.1.1: Add Arc Completion Visual to ConstellationGraph

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

### Step 4.1.2: Add arcComplete to CharacterWithState

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

### Step 4.1.3: Add Arc Completion Message to DetailModal

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

## Task 4.2: Station Mystery Breadcrumbs

**Goal:** Add mystery hints to Samuel's dialogue that unlock at trust thresholds.

### Step 4.2.1: Add Mystery Hint Nodes to Samuel

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

### Step 4.2.2: Add Mystery Nodes to Samuel's Entry Points

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

## Task 4.3: Pattern-Based Ending Framework

**Goal:** Create infrastructure for 5 different endings based on dominant pattern.

### Step 4.3.1: Create Ending Definitions

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

### Step 4.3.2: Create Journey Complete Screen

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

## Final Verification Checklist

Before requesting QA review, run ALL of these:

```bash
# 1. Type check (must pass with 0 errors)
npm run type-check

# 2. All tests (must pass)
npm test

# 3. Build (must succeed)
npm run build

# 4. Check for any console errors in dev
npm run dev
# Then open http://localhost:3000 and check browser console
```

---

## Commit Strategy

Make **separate commits** for each task:

```bash
# After Task 4.1
git add components/constellation/ConstellationGraph.tsx hooks/useConstellationData.ts components/constellation/DetailModal.tsx
git commit -m "feat: add arc completion visual indicators in constellation"

# After Task 4.2
git add content/samuel-dialogue-graph.ts
git commit -m "feat: add station mystery breadcrumb nodes to Samuel"

# After Task 4.3
git add lib/pattern-endings.ts components/JourneyComplete.tsx
git commit -m "feat: add pattern-based ending framework"
```

---

## Files Changed Summary

| File | Action | Risk Level |
|------|--------|------------|
| `components/constellation/ConstellationGraph.tsx` | MODIFY | Low |
| `hooks/useConstellationData.ts` | MODIFY | Medium |
| `components/constellation/DetailModal.tsx` | MODIFY | Low |
| `content/samuel-dialogue-graph.ts` | ADD NODES ONLY | Medium |
| `lib/pattern-endings.ts` | CREATE NEW | Low |
| `components/JourneyComplete.tsx` | CREATE NEW | Low |

---

## What NOT To Do (Common Mistakes)

1. **Don't modify existing dialogue nodes** - Only ADD new ones
2. **Don't change the DialogueNode type** - Use it as-is
3. **Don't import JourneyComplete into StatefulGameInterface yet** - Opus will do that in QA
4. **Don't add journey_complete_trigger node** - That requires careful integration
5. **Don't modify lib/game-store.ts** - It's complex and fragile

---

## Questions? Stop and Ask

If anything is unclear or you hit an unexpected error:
1. **STOP** - Don't try to fix it creatively
2. **Document** the exact error message
3. **Ask Opus** for guidance before proceeding

The goal is clean, working code - not speed.
