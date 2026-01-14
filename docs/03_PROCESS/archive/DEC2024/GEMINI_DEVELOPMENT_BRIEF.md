# Gemini Development Brief - Grand Central Terminus
**Project:** Birmingham Career Exploration Game
**Current Phase:** Sprint 1.2 Complete → Phase 2 Ready
**Date:** November 22, 2025
**Development Status:** Production-Ready Foundation ✅

---

## 🎯 MISSION: Phase 2 - Narrative Excellence

Your mission is to expand the Grand Central Terminus narrative experience by implementing **Phase 2 character arc content** with the same level of quality, depth, and technical excellence established in Phase 1.

---

## 📊 PROJECT CONTEXT

### Current State (What Claude Built)

**Infrastructure (100% Complete):**
- ✅ Next.js 15 with App Router
- ✅ TypeScript strict mode (0 errors)
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Supabase backend (PostgreSQL)
- ✅ State management (Zustand-like patterns)
- ✅ 140/140 unit tests passing (100%)
- ✅ 9/10 E2E tests passing (Playwright)
- ✅ GitHub Actions CI/CD pipeline
- ✅ Graceful degradation (works offline)

**Content Completed (Phase 1):**
- ✅ Marcus arc - Phase 1 (Project Management pathway)
- ✅ Tess arc - Phase 1 (Engineering pathway)
- ✅ Yaquin arc - Phase 1 (Business Strategy pathway)
- ✅ Samuel hub - Central navigation/mentor character
- ✅ Atmospheric intro sequence
- ✅ Admin dashboard with analytics

**Technical Architecture:**
```
/app                    → Next.js 15 App Router
/components            → React components (shadcn/ui)
/content              → Dialogue graphs (TypeScript)
/lib                  → Utilities, state, database
/tests                → Vitest unit + Playwright E2E
/.github/workflows    → CI/CD automation
```

---

## 🎬 YOUR ASSIGNMENT: Phase 2 Character Arc Expansion

### Priority 1: Expand Existing Character Arcs (Phase 2 Content)

**Goal:** Deepen the three main character arcs (Marcus, Tess, Yaquin) by adding Phase 2 content that builds on their Phase 1 introductions.

#### Character: Marcus (Project Management → Crisis Management)

**Phase 1 Recap:** Marcus introduces himself as a project manager dealing with a critical deadline. Player helps him prioritize tasks and handle scope creep.

**Phase 2 Objective:** Crisis escalates - a major stakeholder conflict emerges requiring advanced crisis management skills.

**Required Content:**
1. **New Dialogue Nodes (15-20 nodes minimum):**
   - Stakeholder conflict introduction
   - Multiple resolution approaches (diplomatic, assertive, collaborative)
   - Consequence branches based on Phase 1 trust level
   - Skills demonstration: Crisis communication, stakeholder management, conflict resolution

2. **Learning Objectives to Demonstrate:**
   - `crisis_management` (from lib/learning-objectives-definitions.ts)
   - `stakeholder_management`
   - `communication_under_pressure`
   - `adaptive_leadership`

3. **Trust Dynamics:**
   - High trust (from Phase 1) → Marcus shares insider context, gives better advice
   - Low trust → Marcus is guarded, player must rebuild rapport
   - Trust changes based on Phase 2 choices

4. **Pattern Integration:**
   - Track player patterns: analytical, helping, challenging, observing
   - Adjust Marcus's responses based on accumulated patterns
   - Create branching that rewards consistent patterns

**Technical Implementation:**
- File: `content/marcus-dialogue-graph.ts`
- Add Phase 2 nodes starting from node: `marcus_phase2_entry`
- Follow existing pattern structure (see Phase 1 nodes)
- Ensure proper imports of learning objectives
- Add to dialogue graph registry

#### Character: Tess (Engineering → Technical Leadership)

**Phase 1 Recap:** Tess is debugging a critical system issue. Player helps her troubleshoot and think through technical trade-offs.

**Phase 2 Objective:** Tess faces a technical leadership challenge - needs to guide junior engineers while making architectural decisions.

**Required Content:**
1. **New Dialogue Nodes (15-20 nodes minimum):**
   - Junior engineer struggling with implementation
   - Architecture decision with competing approaches
   - Code review scenario requiring mentorship
   - Technical debt vs. feature velocity dilemma

2. **Learning Objectives to Demonstrate:**
   - `technical_leadership`
   - `mentorship`
   - `system_design`
   - `technical_communication`

3. **Trust Dynamics:**
   - High trust → Tess asks for strategic advice
   - Low trust → Tess keeps it surface-level, technical only
   - Trust affects depth of technical discussions

4. **Pattern Integration:**
   - Analytical players get deeper technical content
   - Helping players get mentorship scenarios
   - Challenging players get debate on approaches

**Technical Implementation:**
- File: `content/tess-dialogue-graph.ts`
- Add Phase 2 nodes starting from: `tess_phase2_entry`
- Include code snippet examples (via dialogue content)
- Demonstrate technical communication skills

#### Character: Yaquin (Business Strategy → Strategic Execution)

**Phase 1 Recap:** Yaquin presents a business opportunity requiring market analysis and strategic thinking.

**Phase 2 Objective:** Strategy is approved, now faces execution challenges - resource constraints, team alignment, competitive pressure.

**Required Content:**
1. **New Dialogue Nodes (15-20 nodes minimum):**
   - Resource allocation dilemma
   - Team resistance to strategy
   - Competitor moves requiring pivot
   - Metrics/KPI discussions

2. **Learning Objectives to Demonstrate:**
   - `strategic_execution`
   - `resource_management`
   - `change_management`
   - `business_metrics`

3. **Trust Dynamics:**
   - High trust → Yaquin shares financial details, strategic concerns
   - Low trust → High-level only, generic advice
   - Trust impacts quality of business insights

4. **Pattern Integration:**
   - Analytical players get data-driven scenarios
   - Helping players get team dynamics scenarios
   - Challenging players get competitive strategy

**Technical Implementation:**
- File: `content/yaquin-dialogue-graph.ts`
- Add Phase 2 nodes starting from: `yaquin_phase2_entry`
- Include business metrics/data in dialogue
- Demonstrate strategic thinking

---

### Priority 2: Enhance Samuel Hub (Mentor/Guide Character)

**Goal:** Make Samuel a more active mentor who helps players reflect on their experiences across all three arcs.

**Required Content:**
1. **Reflection Dialogues (10-15 nodes):**
   - Pattern recognition: "I notice you tend to analyze situations carefully..."
   - Cross-character insights: "Your approach with Marcus was different from Tess..."
   - Career pathway guidance based on accumulated skills
   - Meta-learning: Help player understand their decision-making style

2. **Technical Implementation:**
   - File: `content/samuel-dialogue-graph.ts`
   - Access player's cross-character state
   - Reference specific choices from other arcs
   - Provide meaningful synthesis

---

## 🏗️ TECHNICAL REQUIREMENTS (NON-NEGOTIABLE)

### 1. Code Quality Standards

**TypeScript:**
```typescript
// ✅ ALWAYS use strict typing
interface DialogueNode {
  id: string
  speaker: CharacterName
  content: string
  choices?: DialogueChoice[]
  effects?: StateEffect[]
  requiredState?: StateCondition
}

// ❌ NEVER use 'any'
// ❌ NEVER disable TypeScript checks
```

**Dialogue Graph Structure:**
```typescript
// Follow existing pattern exactly
export const marcusDialogueGraph: DialogueGraph = {
  nodes: {
    marcus_phase2_entry: {
      id: 'marcus_phase2_entry',
      speaker: 'Marcus',
      content: `...`,
      choices: [
        {
          id: 'marcus_phase2_choice1',
          text: '...',
          nextNodeId: 'marcus_phase2_response1',
          pattern: 'analytical',
          skillDemonstration: 'crisis_management',
          effects: {
            trust: { marcus: 2 },
            patterns: { analytical: 1 }
          }
        }
      ]
    }
  },
  entryNodeId: 'marcus_intro'  // Keep existing entry
}
```

### 2. State Management Rules

**Trust System:**
- Range: -10 to +10
- Typical change: ±1 to ±3 per choice
- High-impact moments: ±5 maximum
- Trust affects dialogue availability and depth

**Pattern Tracking:**
```typescript
patterns: {
  analytical: number    // Data-driven, logical
  helping: number      // Supportive, empathetic
  challenging: number  // Questioning, direct
  observing: number    // Listening, reflective
}
```

**Skill Demonstrations:**
- Must reference learning objectives from `lib/learning-objectives-definitions.ts`
- Each Phase 2 arc must demonstrate 4-6 distinct skills
- Skills should build on Phase 1 demonstrations

### 3. Content Guidelines

**Dialogue Quality:**
- Natural, conversational tone
- Show don't tell (demonstrate skills through scenarios, not lectures)
- Realistic professional situations
- Avoid: Lectures, info dumps, unrealistic scenarios
- Length: 50-150 words per dialogue node
- Choices: 2-4 options per decision point

**Choice Design:**
```typescript
// ✅ GOOD: Meaningful alternatives
choices: [
  {
    text: "Focus on the stakeholder relationship first",
    pattern: 'helping',
    skillDemonstration: 'stakeholder_management'
  },
  {
    text: "Analyze the data to find the root cause",
    pattern: 'analytical',
    skillDemonstration: 'problem_solving'
  }
]

// ❌ BAD: Obvious right/wrong answers
choices: [
  { text: "Be a great leader" },  // Too vague
  { text: "Ignore the problem" }  // Unrealistic
]
```

**Branching Complexity:**
- Each Phase 2 arc should have 3-5 major branches
- Branches should reconverge to avoid exponential explosion
- Use state conditions to create meaningful variation within linear structure

### 4. Testing Requirements

**For Each New Arc Content:**

1. **Unit Tests (Required):**
```typescript
// tests/content-validation.test.ts
describe('Marcus Phase 2 Content', () => {
  test('all nodes have valid structure', () => {
    // Validate dialogue graph structure
  })

  test('all choices lead to valid nodes', () => {
    // Check node references
  })

  test('all skills reference valid learning objectives', () => {
    // Verify skill demonstrations
  })
})
```

2. **Manual Testing Checklist:**
- [ ] All dialogue paths are reachable
- [ ] Trust changes work correctly
- [ ] Pattern tracking updates properly
- [ ] Skills are demonstrated clearly
- [ ] No dead ends or infinite loops
- [ ] Content displays properly in UI
- [ ] TypeScript builds with 0 errors

### 5. Integration Points

**Registry Update:**
```typescript
// lib/dialogue-graph-registry.ts
import { marcusDialogueGraph } from '@/content/marcus-dialogue-graph'
import { tessDialogueGraph } from '@/content/tess-dialogue-graph'
import { yaquinDialogueGraph } from '@/content/yaquin-dialogue-graph'

export const dialogueGraphRegistry = {
  marcus: marcusDialogueGraph,
  tess: tessDialogueGraph,
  yaquin: yaquinDialogueGraph,
  samuel: samuelDialogueGraph
}
```

**Admin Dashboard:**
- Phase 2 content should appear in analytics
- Skills demonstrated should increment counters
- Player patterns should be trackable

---

## 📁 FILES YOU'LL MODIFY

### Primary Files (Content):
```
content/marcus-dialogue-graph.ts     → Add Phase 2 nodes
content/tess-dialogue-graph.ts       → Add Phase 2 nodes
content/yaquin-dialogue-graph.ts     → Add Phase 2 nodes
content/samuel-dialogue-graph.ts     → Add reflection content
```

### Supporting Files (May Need Updates):
```
lib/learning-objectives-definitions.ts  → Verify skills exist
lib/scene-skill-mappings.ts           → Map Phase 2 scenes
tests/content-validation.test.ts       → Add Phase 2 validation
```

### DO NOT MODIFY (Unless Critical Bug):
```
components/StatefulGameInterface.tsx   → Core game engine
lib/game-state.ts                      → State management
app/                                   → Next.js routing
```

---

## 🎨 CONTENT WRITING PRINCIPLES

### Narrative Excellence Standards

**1. Show, Don't Tell:**
```typescript
// ✅ GOOD: Demonstrate through scenario
content: `Marcus pulls up a spreadsheet, his jaw tight. "The client just
doubled their feature requests. Launch is in two weeks. My team is already
at capacity." He looks at you. "What would you do?"`

// ❌ BAD: Lecture about skills
content: `Marcus says: "Crisis management is important. You should always
prioritize stakeholder communication and use data-driven decision making."`
```

**2. Authentic Professional Dialogue:**
- Characters speak like real professionals, not textbook examples
- Include realistic details (specific tools, technologies, business metrics)
- Show workplace dynamics (politics, constraints, trade-offs)

**3. Player Agency:**
- Every choice should matter (even if reconverging later)
- Choices should reflect different professional styles, not good/bad options
- Acknowledge player's choices in subsequent dialogue

**4. Skill Demonstration Integration:**
```typescript
// ✅ GOOD: Natural integration
choice: {
  text: "Suggest running a quick A/B test before committing resources",
  pattern: 'analytical',
  skillDemonstration: 'data_driven_decision_making',
  nextNodeId: 'yaquin_approves_data_approach'
}

// ❌ BAD: Forced/artificial
choice: {
  text: "Use the data-driven decision-making skill that employers want",
  // This is meta-gaming, breaks immersion
}
```

---

## 🧪 QUALITY ASSURANCE CHECKLIST

Before submitting your work, verify:

### Technical QA:
- [ ] `npx tsc --noEmit` returns 0 errors
- [ ] `npm run test:run` shows all tests passing
- [ ] `npm run dev` runs without errors
- [ ] Content displays correctly in browser
- [ ] All dialogue paths tested manually
- [ ] State changes work as expected

### Content QA:
- [ ] All character voices are consistent with Phase 1
- [ ] Trust dynamics are meaningful and trackable
- [ ] Skills are demonstrated naturally through scenarios
- [ ] Choices reflect professional competencies, not moral judgments
- [ ] No typos or grammatical errors
- [ ] Content length is appropriate (not too verbose)

### Integration QA:
- [ ] New content registered in dialogue graph registry
- [ ] Admin dashboard shows Phase 2 skills
- [ ] Samuel can reference Phase 2 experiences
- [ ] Cross-character state works correctly

---

## 📝 DELIVERABLES

### What to Submit:

**1. Updated Dialogue Graphs:**
- `content/marcus-dialogue-graph.ts` (Phase 2 added)
- `content/tess-dialogue-graph.ts` (Phase 2 added)
- `content/yaquin-dialogue-graph.ts` (Phase 2 added)
- `content/samuel-dialogue-graph.ts` (enhanced reflections)

**2. Test Coverage:**
- Updated unit tests validating Phase 2 content
- Test results showing all passing

**3. Documentation:**
- Brief narrative summary for each Phase 2 arc (150-300 words)
- List of skills demonstrated in each arc
- Trust dynamics mapping

**4. Implementation Notes:**
- Any edge cases or special considerations
- Recommendations for Phase 3 (if applicable)
- Known limitations or future enhancements

---

## 🎯 SUCCESS CRITERIA

Your work will be considered successful when:

1. ✅ **All TypeScript compiles with 0 errors**
2. ✅ **All existing + new tests pass (140+ tests)**
3. ✅ **Each character has 15-20 new Phase 2 dialogue nodes**
4. ✅ **All Phase 2 content demonstrates 4-6 distinct skills per arc**
5. ✅ **Trust dynamics create meaningful variation in experiences**
6. ✅ **Pattern tracking influences dialogue appropriately**
7. ✅ **Samuel provides meaningful cross-character synthesis**
8. ✅ **Content quality matches Phase 1 standards**
9. ✅ **Manual testing confirms all paths work correctly**
10. ✅ **Admin dashboard accurately tracks Phase 2 engagement**

---

## 🚀 GETTING STARTED

### Step 1: Environment Setup
```bash
cd /Users/abdusmuwwakkil/Development/30_lux-story
npm install
npm run dev  # Verify app runs
npm run test:run  # Verify tests pass
```

### Step 2: Review Existing Content
- Read `content/marcus-dialogue-graph.ts` Phase 1 nodes
- Understand the pattern structure
- Note the voice/tone of each character

### Step 3: Plan Phase 2 Content
- Outline major beats for each character
- Map skill demonstrations to scenarios
- Plan trust dynamic branches

### Step 4: Implement Incrementally
- Start with Marcus Phase 2 (smallest arc)
- Test thoroughly before moving to next character
- Get each arc working before proceeding

### Step 5: Integration & Testing
- Update registry
- Run full test suite
- Manual testing of all new content

---

## 💡 REFERENCES

### Key Files to Study:
```
content/marcus-dialogue-graph.ts       → Phase 1 reference
lib/learning-objectives-definitions.ts → Available skills
lib/game-state.ts                      → State structure
components/StatefulGameInterface.tsx   → How content renders
tests/content-validation.test.ts       → Test patterns
```

### Learning Objectives (Available Skills):
See `lib/learning-objectives-definitions.ts` for complete list including:
- Crisis management
- Technical leadership
- Strategic execution
- Stakeholder management
- Change management
- Problem solving
- Communication
- And 20+ more...

---

## ⚡ PROFESSIONAL DEVELOPMENT STANDARDS

This project follows **rockstar-level software development practices:**

1. **Type Safety First:** No `any`, no type gymnastics
2. **Test-Driven:** All features tested before shipping
3. **Clean Code:** Clear naming, single responsibility, DRY
4. **User Experience:** Every choice matters, every interaction is meaningful
5. **Performance:** Graceful degradation, offline-first where possible
6. **Documentation:** Code explains itself, comments explain why
7. **Maintainability:** Future developers should easily understand your work
8. **Accessibility:** Content should be clear and engaging for all users

---

## 🎓 NARRATIVE DESIGN PHILOSOPHY

**This is NOT a quiz game.** This is an **experiential learning platform** where:
- Players discover career skills through authentic workplace scenarios
- Choices reflect professional competencies and working styles
- Characters are mentors and colleagues, not teachers or test-givers
- Learning happens through doing, not through being told
- Skills are demonstrated implicitly through player actions

**Good Example:**
> Marcus: "The client wants real-time analytics. Our database wasn't designed for that load."
> Choice: "Let's prototype with a read replica and caching layer"
> → Demonstrates system design, technical problem-solving

**Bad Example:**
> Marcus: "What is the definition of system design?"
> → This is a quiz, not experiential learning

---

## 🤝 QUESTIONS? NEED CLARIFICATION?

If you encounter:
- **Technical blocks:** Check existing tests for patterns
- **Content questions:** Review Phase 1 for tone/style guidance
- **Architecture questions:** Prioritize following existing patterns
- **Scope questions:** Start small, expand if time permits

---

## 🏆 FINAL NOTES

You're building on a **production-ready foundation** with:
- 100% unit test coverage
- Clean TypeScript architecture
- Proven state management
- Professional UI/UX

Your Phase 2 content will directly impact how **players discover their career paths**. Make every interaction meaningful. Make every choice matter. Show them what professional excellence looks like.

**Quality over speed. Depth over breadth. Excellence in execution.**

Let's build something remarkable. 🚀

---

**Document Version:** 1.0
**Created:** November 22, 2025
**By:** Claude (Sonnet 4.5)
**For:** Gemini Development Team
**Project:** Grand Central Terminus - Birmingham Career Exploration
