# Terminus Engineering Principles

Use this command to review and apply the core engineering philosophies that guide LUX Story development. These principles have been extracted from successful delivery patterns across the project.

---

## THE TEN COMMANDMENTS

### 1. Feel Comes First
The experience must feel good within the first 30 seconds. Controls intuitive, actions satisfying. If it doesn't feel right, nothing else matters.

### 2. Friction is Failure
Every moment of confusion is a design failure. Never blame the user. If it needs explanation, redesign it.

### 3. Never Break What Works
Stable foundation, enhance on top. Working systems are sacred. All improvements are content additions, not system changes.

### 4. Confident Complexity
Simple foundation, meaningful depth. Add complexity only where it creates emotional magic. Foundation = simple. Enhancement = depth.

### 5. Honest Architecture
No over-engineering. No new systems unless absolutely necessary. Use existing patterns. If you're building infrastructure, you're probably wrong.

### 6. Show, Don't Tell
The world communicates narrative. Reduce text/tutorials through visual design. Let players discover.

### 7. Respect Player Intelligence
Don't overexplain. Failure teaches, not punishes. Trust the user to figure it out.

### 8. Emotion Over Mechanics
Mechanics serve emotional experience. What players feel matters more than what they do.

### 9. Kill Your Darlings
Remove features that don't serve core loop. Complexity without value is bloat.

### 10. Juice is Not Optional
Feedback for every action. Make simple actions feel powerful.

---

## DEVELOPMENT PHILOSOPHY

### The Surgical Enhancement Approach

```
┌─────────────────────────────────────────────┐
│  STABLE FOUNDATION (Don't Touch)            │
│  • Core engines and systems                 │
│  • State management                         │
│  • Routing and navigation                   │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│  CONTENT LAYER (Enhance Here)               │
│  • Dialogue and narrative                   │
│  • Visual polish and feedback               │
│  • Optional exploration branches            │
└─────────────────────────────────────────────┘
```

### Risk Tiers

| Tier | Risk Level | Examples | Approach |
|------|------------|----------|----------|
| 1 | Low | Adding content, editing text | Just do it |
| 2 | Medium | Changing navigation, trust logic | Test thoroughly |
| 3 | High | Engine changes, state management | Avoid unless critical |

---

## DOCUMENT CONTROL PRINCIPLES

### File Naming Convention
All documentation follows numbered prefixes: `00-`, `01-`, `02-`, etc.
- Enables consistent ordering
- Reduces cognitive load when navigating
- Makes gaps and additions obvious

### Document Hierarchy
```
00-09: Core/Foundation
10-19: Status/Progress
20-29: Planning/Strategy
30-39: Handoffs/Transitions
40-49: Guides/Walkthroughs
90-99: Archive/Reference
```

### Status Tracking Pattern
Every system should have clear coverage metrics:
- `16/16` = Complete
- `10/16` = Partial (list what's missing)
- Tests: Always report count

---

## PRD PROCESS

### Worldbuilding-First Development
Deep lore work becomes the specification document. Every design decision flows from foundational worldbuilding.

### The Trojan Horse Philosophy
Career discovery through contemplation, not examination. The game looks, feels, and plays like a premium indie game, but every interaction invisibly tracks skills.

### PRD Structure
1. **Vision** - What are we building and why?
2. **Problem** - What pain are we solving?
3. **Solution** - How does this solve the problem?
4. **Audience** - Who is this for?
5. **Success Metrics** - How do we know it works?

---

## QUALITY GATES

### Before Every Commit
- [ ] Does this enhance without over-engineering? (Honest Architecture)
- [ ] Does this use existing patterns? (Confident Complexity)
- [ ] Can we roll it back easily? (Risk management)
- [ ] Is production still working? (Never Break What Works)

### Before Every PR
- [ ] All tests passing
- [ ] No new TypeScript errors
- [ ] Mobile rendering verified
- [ ] Line counts manageable

### Before Every Release
- [ ] Full playthrough completed
- [ ] Performance unchanged
- [ ] No regression in existing features

---

## RED FLAGS TO AVOID

### The Iceberg Game
90% of features hidden. Core value invisible until late game.

### Developer's Delight
Features that excite devs but confuse players.

### Progressive Paralysis
Hiding features to "reduce overwhelm" but looking broken.

### Invisible Value Prop
Players don't understand uniqueness.

### Tutorial Crutch
Design by instruction rather than intuition.

### Feature Graveyard
Systems nobody uses.

---

## COMMUNICATION PATTERNS

### Commit Messages
```
<type>: <description>

<body explaining what and why>

<reference to principle if applicable>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### Status Updates
Always include:
- What's complete (with counts)
- What's remaining (with counts)
- Blockers if any

---

## THE MASTER PHILOSOPHY

> "Never break what works, enhance what creates impact."

Every decision filters through this. If you're touching stable systems, you're probably wrong. If you're adding meaningful content, you're probably right.

---

## QUICK REFERENCE

### When Starting Work
1. Check current test count (`npm test`)
2. Read relevant docs
3. Identify what layer you're working in (Foundation vs Content)

### When Stuck
1. Is this over-engineering? Simplify.
2. Can existing patterns solve this? Use them.
3. Will this break what works? Don't.

### When Done
1. Run tests
2. Update docs if needed
3. Commit with clear message
4. Verify production

---

*Last Updated: January 2026*
*Source: Extracted from LUX Story development patterns*
