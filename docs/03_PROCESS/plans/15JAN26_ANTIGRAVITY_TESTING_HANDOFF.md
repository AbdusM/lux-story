# Lux Story Web App Testing Handoff

**For:** Gemini with Antigravity Browser Automation
**Date:** January 15, 2026
**Target:** https://lux-story.vercel.app (or localhost:3000)
**Goal:** Comprehensive UI/UX testing with resilient error handling

---

## What is Lux Story?

A dialogue-driven career exploration game where players explore a magical train station, interact with 20 characters, and discover career paths through choices that reveal behavioral patterns.

**Target Audience:** Birmingham youth ages 14-24
**Platform:** Mobile-first web app

---

## Testing Philosophy

### Core Principle: Keep Moving

```
IF error occurs:
  1. Log the error with context
  2. Take a screenshot
  3. Note what was being tested
  4. Move to next test
  5. Circle back to failures at end
```

**DO NOT** get stuck trying to fix one thing. Document and continue.

---

## App URLs to Test

| Environment | URL |
|-------------|-----|
| Production | https://lux-story.vercel.app |
| Local Dev | http://localhost:3000 |

---

## Key Routes to Test

| Route | Purpose | Priority |
|-------|---------|----------|
| `/` | Main game interface | HIGH |
| `/welcome` | Onboarding/intro | HIGH |
| `/profile` | User settings & accessibility | HIGH |
| `/admin` | Admin dashboard (needs auth) | MEDIUM |
| `/student/insights` | Student view of progress | MEDIUM |
| `/test-pixels` | Avatar sprite verification | LOW |
| `/test-voices` | Character voice testing | LOW |

---

## Phase 1: Initial Load & Performance (5 min)

- [ ] App loads without console errors
- [ ] Initial render < 3 seconds
- [ ] No layout shift during load
- [ ] Mobile viewport renders correctly (resize to 375x667)

**Check console:** `browser_console_messages`

**Log any:**
- JavaScript errors
- Failed network requests
- Slow resource loads

---

## Phase 2: Main Game Interface `/` (15 min)

### 2.1 Core Elements
- [ ] Dialogue container visible
- [ ] Character avatar displays
- [ ] Choice buttons appear after dialogue
- [ ] Navigation elements (Journal, Constellation) accessible

### 2.2 Dialogue Flow
- [ ] Text appears with typing animation
- [ ] Thinking indicator shows before responses
- [ ] Dialogue progresses when choices made
- [ ] No text overflow or truncation

### 2.3 Choice Interaction
- [ ] All choice buttons clickable
- [ ] Hover states work
- [ ] Selected choice triggers response
- [ ] Pattern indicators show on choices (colored dots)

### 2.4 Navigation
- [ ] Journal button opens side panel
- [ ] Constellation button opens character map
- [ ] Back navigation works
- [ ] No stuck states

---

## Phase 3: Character Interactions (20 min)

### Characters to Test (Priority Order)

**Tier 1 - Core (test all):**
1. Samuel (Owl) - Hub character, station keeper
2. Maya (Cat) - Tech innovator
3. Marcus (Bear) - Medical tech
4. Rohan (Raven) - Deep tech

**Tier 2 - Secondary (test 2-3):**
5. Devon (Deer) - Systems thinker
6. Tess (Fox) - Education founder
7. Quinn (Hedgehog) - Finance specialist

### For Each Character Test:
- [ ] Introduction dialogue loads
- [ ] Character avatar displays correctly
- [ ] Voice/typing style is distinct
- [ ] Choices lead to different responses
- [ ] Trust progression works (if testable)

---

## Phase 4: Journal & Constellation (10 min)

### 4.1 Journal Panel
- [ ] Opens from nav button
- [ ] Shows player stats/patterns
- [ ] Pattern orbs display (analytical, helping, building, patience, exploring)
- [ ] Skill demonstrations listed
- [ ] Closes properly

### 4.2 Constellation View
- [ ] Character nodes render
- [ ] Connections between characters visible
- [ ] Click on character shows details
- [ ] Zoom/pan works (if applicable)
- [ ] Keyboard navigation (arrow keys)

---

## Phase 5: Profile & Settings `/profile` (10 min)

### 5.1 Tabs to Test
- [ ] Account tab loads
- [ ] Audio settings work
- [ ] Accessibility options available
- [ ] Keyboard shortcuts tab
- [ ] Display settings

### 5.2 Accessibility Features
- [ ] Text size options (default, large, x-large, xx-large)
- [ ] Color blind modes (protanopia, deuteranopia, tritanopia)
- [ ] Reduced motion toggle
- [ ] Cognitive load levels (minimal, reduced, normal, detailed)

### 5.3 Persistence
- [ ] Settings save to localStorage
- [ ] Settings persist on reload

---

## Phase 6: Welcome/Onboarding `/welcome` (5 min)

- [ ] Intro animation plays
- [ ] "Continue as Guest" works
- [ ] Sign in option available
- [ ] Smooth transition to game
- [ ] Accessibility profile selection (if present)

---

## Phase 7: Mobile Responsiveness (10 min)

Test at these viewport sizes:

| Device | Width | Height |
|--------|-------|--------|
| iPhone SE | 375 | 667 |
| iPhone 14 | 390 | 844 |
| iPad | 768 | 1024 |
| Desktop | 1280 | 800 |

### Check for each:
- [ ] No horizontal scroll
- [ ] Touch targets >= 44px
- [ ] Text readable without zoom
- [ ] Choice buttons not cut off at bottom
- [ ] Safe area padding on mobile

---

## Phase 8: Keyboard & Accessibility (10 min)

- [ ] Press `?` to open keyboard shortcuts
- [ ] Tab navigation through choices
- [ ] Enter to select choice
- [ ] Escape to close modals
- [ ] Arrow keys in Constellation
- [ ] Focus indicators visible
- [ ] Screen reader landmarks present

---

## Phase 9: Edge Cases & Error Handling (10 min)

- [ ] Rapid clicking doesn't break state
- [ ] Refreshing mid-dialogue recovers
- [ ] Network offline shows appropriate state
- [ ] Invalid routes show 404 or redirect
- [ ] Long idle time triggers warning modal (5 min)

---

## Error Logging Format

```markdown
### Issue #[N]: [Short Description]
- **Route:** /path
- **Test:** What were you testing?
- **Expected:** What should have happened?
- **Actual:** What actually happened?
- **Console Error:** (if any)
- **Screenshot:** [filename]
- **Severity:** BLOCKER | HIGH | MEDIUM | LOW
- **Status:** LOGGED | RESOLVED
```

---

## Key Components to Document

If you find interesting patterns or behaviors, document:

| Component | Location | Notes |
|-----------|----------|-------|
| `StatefulGameInterface` | Main game container | Core state management |
| `ChatPacedDialogue` | Dialogue display | Typing animations |
| `GameChoices` | Choice buttons | Pattern indicators |
| `Journal` | Side panel | Player stats |
| `ConstellationGraph` | Character map | SVG visualization |
| `InGameSettings` | Gear icon menu | Quick settings |
| `IdleWarningModal` | Timeout warning | 5-min idle detection |

---

## Final Report Template

```markdown
# Lux Story Testing Report - [Date]

## Summary
- **Routes Tested:** X/9
- **Tests Passed:** X
- **Tests Failed:** X
- **Issues Logged:** X

## Route Status

| Route | Status | Issues |
|-------|--------|--------|
| / | PASS/FAIL | #1, #2 |
| /welcome | PASS/FAIL | - |
| /profile | PASS/FAIL | #3 |
| ... | ... | ... |

## Open Issues (by severity)

### BLOCKER
- [list]

### HIGH
- [list]

### MEDIUM
- [list]

## Performance Notes
- Initial load time: Xs
- Largest contentful paint: Xs
- Console errors: X

## Recommendations
1. [Priority fixes]
2. [UX improvements]
3. [Accessibility gaps]
```

---

## Quick Start

1. Navigate to https://lux-story.vercel.app
2. Run `browser_snapshot` to see initial state
3. Start Phase 1, log issues as you go
4. Don't stop for errors - document and continue
5. Complete all phases before circling back
6. Compile final report

Good luck! Goal is comprehensive coverage, not perfection.
