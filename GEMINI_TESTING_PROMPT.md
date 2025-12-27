# Gemini Extensive Testing Prompt for Grand Central Terminus

## Context

You are testing **Grand Central Terminus**, a dialogue-driven career exploration game built with Next.js 15. The app is deployed at: `https://lux-story.vercel.app`

The game features:
- Dialogue-driven gameplay (like Pokemon/Disco Elysium)
- 11 unique characters with pixel art avatars
- 5 behavioral patterns tracked through choices (analytical, patience, exploring, helping, building)
- Skills system with 6 clusters (Mind, Voice, Compass, Craft, Hands, Heart)
- Trust/relationship system per character
- Offline-first data sync via SyncQueue

---

## Testing Instructions

Please execute the following test suites and log ALL findings in detail. Use the format:

```
[CATEGORY] [SEVERITY: Critical/High/Medium/Low] Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/recordings if applicable
```

---

## Test Suite 1: Initial Load & First Impressions (30-second rule)

### 1.1 Landing Page
- [ ] Navigate to the root URL
- [ ] Measure time to first meaningful paint
- [ ] Check for any layout shifts during load
- [ ] Verify the "Begin Your Journey" CTA is prominent and clickable
- [ ] Test on mobile viewport (375px width)
- [ ] Test on tablet viewport (768px width)
- [ ] Test on desktop viewport (1440px width)

### 1.2 Game Start Flow
- [ ] Click "Begin Your Journey" / navigate to `/play`
- [ ] Verify the game loads without errors
- [ ] Check for loading states/skeletons
- [ ] Verify Samuel (the owl) appears as the first character
- [ ] Confirm dialogue appears smoothly with typing animation

---

## Test Suite 2: Core Gameplay Loop

### 2.1 Dialogue System
- [ ] Read through initial dialogue with Samuel
- [ ] Verify character avatar displays correctly (32x32 pixel art owl)
- [ ] Check that dialogue text is readable (contrast ratio >= 4.5:1)
- [ ] Verify thinking indicators appear briefly, then dialogue flows
- [ ] Test that long dialogue chunks are properly broken up

### 2.2 Choice System
- [ ] When choices appear, verify they're in the fixed-height container
- [ ] Test selecting each type of choice (if multiple options available)
- [ ] Verify visual feedback on choice selection (ripple, highlight)
- [ ] Check that disabled choices (if any) are visually distinct
- [ ] Test 3-choice layouts - should NOT be 2-2-1 grid orphan pattern

### 2.3 Pattern Recognition
- [ ] Make several choices and verify orb fill animations
- [ ] Open the Journal/side menu
- [ ] Navigate to "Harmonics" view
- [ ] Verify pattern orbs display with correct labels
- [ ] Tap each orb - verify sound plays and haptic feedback (mobile)
- [ ] Check that pattern percentages update after choices

### 2.4 Skill Tracking
- [ ] Navigate to "Essence" view in the Journal
- [ ] Verify the hexagonal soul radar renders
- [ ] Check that skill clusters show 0% if no skills unlocked
- [ ] Make choices that should unlock skills
- [ ] Verify the radar shape updates accordingly

---

## Test Suite 3: Character Interactions

### 3.1 Character Transitions
- [ ] Progress through Samuel's dialogue until another character is mentioned
- [ ] Navigate to a platform (when available)
- [ ] Verify character avatar changes appropriately
- [ ] Check that trust indicator reflects relationship state

### 3.2 Trust System
- [ ] Make supportive choices with a character
- [ ] Verify trust increases (check in Constellation view)
- [ ] Make a choice that might decrease trust
- [ ] Verify the system responds appropriately

---

## Test Suite 4: State Persistence

### 4.1 Local Storage
- [ ] Play for 5+ minutes making various choices
- [ ] Refresh the page (F5 or Cmd+R)
- [ ] Verify game state is restored correctly:
  - Current scene/dialogue position
  - Pattern percentages
  - Skill unlocks
  - Character trust levels
  - Messages history

### 4.2 Session Boundaries
- [ ] Close the browser tab completely
- [ ] Reopen the app
- [ ] Verify "Continue" option appears (if applicable)
- [ ] Check that progress is preserved

### 4.3 Sync Queue (if logged in)
- [ ] Check browser DevTools Network tab
- [ ] Verify API calls to:
  - `/api/user/skill-demonstrations`
  - `/api/user/pattern-demonstrations`
  - `/api/user/relationship-progress`
- [ ] Simulate offline mode (DevTools > Network > Offline)
- [ ] Make a choice while offline
- [ ] Go back online
- [ ] Verify queued actions sync (check Network tab)

---

## Test Suite 5: UI Components

### 5.1 Journal/Side Panel
- [ ] Open the Journal (hamburger menu or swipe)
- [ ] Test all tabs: Mind, Essence, Harmonics, Constellation
- [ ] Verify smooth transitions between tabs
- [ ] Check that empty states show appropriate messages
- [ ] Test closing the panel (X button, swipe, outside click)

### 5.2 Mind View (ThoughtCabinet)
- [ ] Check if thoughts appear after meaningful choices
- [ ] Verify empty state is compact (not 900px of dead space)
- [ ] Test thought card interactions

### 5.3 Constellation View
- [ ] Verify character nodes display correctly
- [ ] Check that connections/lines render between related characters
- [ ] Test zooming/panning (if supported)
- [ ] Tap a character node - verify detail modal appears

### 5.4 Responsive Design
- [ ] Test all views at 320px width (small mobile)
- [ ] Test all views at 375px width (iPhone SE)
- [ ] Test all views at 428px width (iPhone Pro Max)
- [ ] Test all views at 768px width (iPad)
- [ ] Test all views at 1024px width (iPad landscape)
- [ ] Test all views at 1440px width (desktop)
- [ ] Verify safe area padding on notched devices

---

## Test Suite 6: Accessibility

### 6.1 Keyboard Navigation
- [ ] Tab through the entire landing page
- [ ] Tab through choice buttons during gameplay
- [ ] Verify focus indicators are visible
- [ ] Test Enter/Space to activate buttons
- [ ] Test Escape to close modals/panels

### 6.2 Screen Reader (VoiceOver/TalkBack)
- [ ] Enable screen reader
- [ ] Navigate through dialogue
- [ ] Verify choice buttons are announced correctly
- [ ] Check that decorative elements are hidden (aria-hidden)

### 6.3 Reduced Motion
- [ ] Enable "Reduce Motion" in system preferences
- [ ] Verify animations are disabled or simplified
- [ ] Check that the app remains functional

### 6.4 Color Contrast
- [ ] Verify dialogue text contrast >= 4.5:1
- [ ] Check button text contrast
- [ ] Test with color blindness simulator (if available)

---

## Test Suite 7: Error Handling

### 7.1 Network Errors
- [ ] Simulate slow 3G network
- [ ] Verify loading states appear
- [ ] Test with network completely offline
- [ ] Check for graceful error messages

### 7.2 Edge Cases
- [ ] Rapidly click the same choice multiple times
- [ ] Try to navigate away during a transition
- [ ] Test with browser back/forward buttons
- [ ] Resize window during animations

### 7.3 Console Errors
- [ ] Keep DevTools Console open throughout testing
- [ ] Log ANY errors or warnings that appear
- [ ] Note the component/file if visible in stack trace

---

## Test Suite 8: Performance

### 8.1 Lighthouse Audit
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Record scores for:
  - Performance
  - Accessibility
  - Best Practices
  - SEO
- [ ] Note any specific recommendations

### 8.2 Memory
- [ ] Open DevTools Performance Monitor
- [ ] Play for 10+ minutes
- [ ] Check for memory growth (should stabilize, not grow indefinitely)
- [ ] Note the JS Heap size at start and after 10 minutes

### 8.3 Animation Performance
- [ ] Enable "Paint flashing" in DevTools Rendering
- [ ] Trigger various animations (dialogue, choice selection, panel transitions)
- [ ] Look for excessive repaints
- [ ] Check for janky animations (< 60fps)

---

## Test Suite 9: Audio System

### 9.1 Sound Effects
- [ ] Tap pattern orbs - verify sounds play
- [ ] Make choices - check for feedback sounds
- [ ] Verify sounds don't overlap/stack annoyingly
- [ ] Test muting (if control available)

### 9.2 Audio Cleanup
- [ ] Trigger several sounds rapidly
- [ ] Navigate away from the page
- [ ] Verify no audio continues playing
- [ ] Check for audio memory leaks (Performance Monitor)

---

## Test Suite 10: Mobile-Specific

### 10.1 Touch Interactions
- [ ] Verify 44px minimum touch targets
- [ ] Test swipe gestures for panel open/close
- [ ] Check pull-to-refresh behavior (should be disabled or custom)
- [ ] Test double-tap behavior

### 10.2 Viewport Behavior
- [ ] Test with keyboard open (form inputs)
- [ ] Verify content isn't hidden behind keyboard
- [ ] Check orientation changes (portrait <-> landscape)
- [ ] Test with browser address bar visible/hidden

### 10.3 PWA Features (if applicable)
- [ ] Check if "Add to Home Screen" is available
- [ ] Test as installed PWA
- [ ] Verify offline functionality

---

## Findings Log Template

```markdown
## Session: [Date/Time]
### Environment:
- Device: [e.g., iPhone 14 Pro]
- OS: [e.g., iOS 17.2]
- Browser: [e.g., Safari 17]
- Viewport: [e.g., 393x852]

### Critical Issues:
1. [Issue description]
   - Reproduce: [steps]
   - Expected: [behavior]
   - Actual: [behavior]

### High Priority:
1. ...

### Medium Priority:
1. ...

### Low Priority / Polish:
1. ...

### Positive Observations:
- [What worked well]

### Performance Metrics:
- Lighthouse Performance: X/100
- Lighthouse Accessibility: X/100
- Initial Load Time: X.Xs
- JS Heap (start): XMB
- JS Heap (10min): XMB
```

---

## Priority Areas (Based on Recent Fixes)

Pay special attention to these recently-fixed areas:

1. **Pattern/Skill Persistence** - Verify data syncs to database
2. **HarmonicsView** - Check loading state when orbs are empty
3. **EssenceSigil** - Check loading state when skills are empty
4. **Audio Fades** - Verify no infinite loops or memory leaks
5. **ThoughtCabinet** - Verify thoughts update correctly
6. **Choice Grid** - Verify 3-choice layouts aren't orphaned

---

## Expected Behavior Summary

- First meaningful paint: < 2 seconds
- Time to interactive: < 3 seconds
- Dialogue should flow naturally with subtle typing indicators
- Choices should be clear, tappable, and provide feedback
- Side menu should open/close smoothly
- No console errors during normal gameplay
- State should persist across refreshes
- Audio should cleanup properly when navigating away

---

Please execute all test suites and provide a comprehensive findings report. Be thorough but also note what works well - we want to know our strengths as well as weaknesses.
