# Antigravity Browser Extension Testing Handoff

**For:** Gemini with Browser Automation (Playwright MCP)
**Date:** January 15, 2026
**Goal:** Comprehensive capability testing with resilient error handling

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

## Error Logging Format

For every issue encountered, log in this format:

```markdown
### Issue #[N]: [Short Description]
- **Test:** What were you testing?
- **Expected:** What should have happened?
- **Actual:** What actually happened?
- **Error Message:** (if any)
- **Screenshot:** [filename or description]
- **Severity:** BLOCKER | HIGH | MEDIUM | LOW
- **Status:** LOGGED | INVESTIGATING | RESOLVED
```

---

## Testing Phases

### Phase 1: Installation & Setup (5 min)

- [ ] Extension loads without errors
- [ ] Extension icon appears in browser toolbar
- [ ] Clicking icon opens popup/panel
- [ ] Any onboarding flow completes
- [ ] Check console for errors: `browser_console_messages`

**If install fails:** Log error, try alternate installation method, continue.

### Phase 2: Core UI Elements (10 min)

For each UI element discovered:
- [ ] Element is visible and accessible
- [ ] Element responds to click/hover
- [ ] Labels/text are readable
- [ ] Icons render correctly

**Approach:**
1. Use `browser_snapshot` to get accessibility tree
2. Systematically click each interactive element
3. Log any that don't respond or error

### Phase 3: Feature Discovery (15 min)

**Goal:** Map all capabilities before deep testing

1. Navigate through all menus/tabs/sections
2. Document each feature found:
   - Feature name
   - Location (how to access)
   - Apparent purpose
   - Input fields/buttons available

**Create a feature inventory:**

| # | Feature | Location | Inputs | Status |
|---|---------|----------|--------|--------|
| 1 | [name]  | [path]   | [list] | FOUND  |

### Phase 4: Systematic Feature Testing (30+ min)

For EACH feature in inventory:

#### Feature: [Name]

**Test 1: Happy Path**
- Input: [what you entered/clicked]
- Expected: [what should happen]
- Result: PASS | FAIL | PARTIAL
- Notes: [observations]

**Test 2: Edge Cases**
- Empty input
- Very long input
- Special characters
- Rapid repeated actions

**Test 3: Error Handling**
- Invalid input
- Network offline (if applicable)
- Interrupted action

### Phase 5: Integration Testing (15 min)

- [ ] Extension interacts with web pages correctly
- [ ] Data persists across browser restart
- [ ] Multiple tabs don't conflict
- [ ] Extension works with different websites

### Phase 6: Performance & Edge Cases (10 min)

- [ ] Memory usage reasonable
- [ ] No UI lag/freezing
- [ ] Handles rapid interactions
- [ ] Recovery from errors

---

## Issue Tracking Template

Use this running log throughout testing:

```markdown
## Issues Log

### Issue #1: [Title]
- **Test:** Phase 2 - Button click
- **Expected:** Modal opens
- **Actual:** Nothing happened
- **Error:** None in console
- **Screenshot:** issue-1-button.png
- **Severity:** MEDIUM
- **Status:** LOGGED

### Issue #2: ...
```

---

## Resolution Phase

After completing all phases, return to logged issues:

1. **Sort by severity** (BLOCKER first)
2. **For each issue:**
   - Re-test to confirm still broken
   - Try alternate approaches
   - Check if related to other issues
   - Document any workarounds found

---

## Commands Reference (Playwright MCP)

| Command | Purpose |
|---------|---------|
| `browser_navigate` | Go to URL |
| `browser_snapshot` | Get accessibility tree (preferred over screenshot) |
| `browser_click` | Click element by ref |
| `browser_type` | Type into field |
| `browser_press_key` | Press keyboard key |
| `browser_console_messages` | Check for JS errors |
| `browser_take_screenshot` | Visual capture |
| `browser_tabs` | Manage tabs |
| `browser_evaluate` | Run custom JS |

---

## Reporting Template

At end of session, compile:

```markdown
# Antigravity Testing Report - [Date]

## Summary
- **Total Features Found:** X
- **Features Tested:** X
- **Tests Passed:** X
- **Tests Failed:** X
- **Issues Logged:** X
- **Issues Resolved:** X

## Feature Status

| Feature | Tests | Pass | Fail | Notes |
|---------|-------|------|------|-------|
| ...     | ...   | ...  | ...  | ...   |

## Open Issues (by severity)

### BLOCKER
- [list]

### HIGH
- [list]

### MEDIUM
- [list]

### LOW
- [list]

## Recommendations
1. [Priority fixes]
2. [Improvements]
3. [Questions for developer]

## Next Steps
- [ ] [action items]
```

---

## Quick Start Checklist

1. [ ] Open browser with Playwright MCP
2. [ ] Navigate to extension or install it
3. [ ] Run `browser_snapshot` to see initial state
4. [ ] Start Phase 1, logging any issues immediately
5. [ ] Keep this document open as reference
6. [ ] Don't stop for errors - log and continue
7. [ ] Complete all phases before circling back
8. [ ] Compile final report

---

## Notes

- **Screenshot naming:** `phase[N]-[feature]-[issue].png`
- **If completely blocked:** Note the blocker, skip to next phase
- **Time box:** Don't spend >5 min on any single issue during testing
- **Ask questions:** If unclear what a feature does, test it anyway and note observations

Good luck! The goal is comprehensive coverage, not perfection on first pass.
