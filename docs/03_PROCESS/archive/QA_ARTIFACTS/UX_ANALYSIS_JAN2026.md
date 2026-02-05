# UX Analysis & Engineering Guidance

**Date:** January 22, 2026
**Source:** External UX Review of High-Fidelity Mockups + Internal Analysis
**Status:** For Team Review & Deliberation

---

## Executive Summary

External review identified the application as a **"Life-RPG" Workforce Development Platform** - a Learning Management System disguised as a cyberpunk adventure game. The analysis reveals both significant strengths and critical friction points that could impact user retention and partner trust.

**Core Loop Identified:**
```
Text Adventure (Input) → Skill Analysis (Process) → Evidence Portfolio (Output) → Job Interview (Reward)
```

**Biggest UX Enemy:** "Boxed content" - the large framed narrative card + framed response card reads like a kiosk UI (or game menu) more than a fluid conversation. Premium AI apps use one primary surface where content breathes and controls feel attached to the conversation.

---

## Part 1: Product Identity Analysis

### What Reviewers Correctly Identified

| Aspect | Finding |
|--------|---------|
| **Business Model** | B2B/B2G workforce development for Birmingham/Alabama region |
| **Target Users** | Gen Z students entering workforce (ages 14-24) |
| **Partner Pipeline** | UAB Medical Center, Children's of Alabama, Southern Company |
| **Hidden Curriculum** | Prompt engineering, CRM principles, soft skills |
| **Gamification** | ARG wrapper with stat-gated progression |

### Visual Design Language

- **Aesthetic:** "Cyber-Noir" / "Retro-Futurism"
- **Color Coding:**
  - Amber/Gold → Mastery, Narrative, Lore ("Golden Path")
  - Teal/Cyan → Analytical tools, Systems, Logic
  - Purple → Essence, Intuition, "Voyager" path
- **Typography:** Monospace (narrative) + Sans-Serif (UI)
- **Avatar Style:** 8-bit pixel art in high-res vector UI

---

## Part 2: Strengths Identified

### 1. Immersion
The interface never breaks character. Even standard settings or job listings are flavored as "Resonance" or "Opportunities."

### 2. Motivation Balance
Perfect balance of:
- **Intrinsic:** Uncovering the mystery of The Station
- **Extrinsic:** Getting real-life internships

### 3. Visual Hierarchy
Despite complex aesthetic, primary actions are always highlighted in bright colors (Gold/Teal) against dark background.

### 4. Evidence Mechanic ("Crown Jewel")
"Tap a skill to see your evidence" implies dynamic portfolio building:
- Saves conversation snippets demonstrating skills
- Maps to competency framework
- Exportable for employers

**Critical Note:** This is your make-or-break feature. The B2B pitch to UAB and Children's of Alabama depends on employers trusting that "Helping Level 4" actually means something. Without event-sourced evidence logs tied to rubrics, you're asking partners to trust a number.

### 5. Stat-Gated Progression
- Dialogue options unlocked by pattern levels
- Tools require minimum stats ("REQ: ANALYTICAL 3")
- Creates meaningful progression

### 6. Prompt Engineering as "Loot"
Neural Deck treats productivity tools as "Cybernetic Upgrades":
- Microsoft Copilot, Julius AI, DALL-E 3
- "Golden Artifact" = prompt template
- Makes knowledge assets feel like rewards

### 7. Quick Reply Assessment Benefit
If typing is rare and choices are common, you're essentially running controlled experiments every conversation. Each choice is a data point with clean attribution. Free-text responses are noisier for skill inference. The "typing as power move" framing isn't just UX—it's measurement strategy.

---

## Part 3: Critical Friction Points

### 1. Cognitive Overload (HIGH PRIORITY)

**Problem:** Too much jargon before value is demonstrated.
- "Orbs," "Harmonics," "Essence," "Resonance," "Neural Deck"
- ~10 proprietary terms introduced immediately
- New users may churn in first 90 seconds

**Risk:** A user looking for a job might feel this is "too much game, not enough result" and leave.

**Recommendations:**
- Dual-language system: diegetic term + plain meaning always available
  - Example: "Orbs" also labeled "Skill Credits" in small text
- Progressive reveal: first session exposes only 3-5 concepts
- **First 3 minutes should surface a real-world opportunity unlock as a tease** before introducing any jargon
- Show the value, then earn permission to teach the language

**Glossary Must Include (for each term):**
- Plain meaning
- Why it matters now
- Action ("Earn Orbs by completing a Simulation" / "Open Simulations")

**Instrument:**
- Tooltip opened
- Tooltip opened twice
- Tooltip opened then user exits → confusion signal

**Engineering Need:** Centralized Glossary + Contextual Tooltip system with instrumentation

---

### 2. The "Nested Scroll" Trap (HIGH PRIORITY)

**Problem:** Story inside bordered card with its own scrollbar creates nested scrolling.

**Risk:** High. On mobile, "scroll-within-scroll" is a poor experience. It feels like a web page from 2010, not a modern app like ChatGPT or Claude.

**Why Premium AI Apps Feel Native:**
- One continuous scroll surface
- Content breathes
- Controls feel "attached" to the conversation, not a separate module

**Fix (without losing cyber-noir look):**
- Keep frame styling, but apply it per message (Samuel bubble, user bubble), not as one giant container
- Reduce heavy borders; use softer separators + subtle glow on focus
- Single Scroll Surface: The entire screen should scroll
- Header and Response Deck should be sticky
- Content area should NOT be a nested window
- Dynamic Height: Text bubbles should expand naturally

**Engineering Action:**
```css
/* Single scroll surface */
.transcript {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* No inner scrollbars */
.message-card {
  overflow: visible; /* NOT overflow-y: auto */
}
```

---

### 3. Scroll Anchoring Rules (HIGH PRIORITY)

**Problem:** Moving to one scroll surface is correct, but you must design scroll anchoring rules, or you'll get the classic "Chat app fights me" problem.

**Required Rules:**
- If user is at bottom (within ~80px): auto-scroll during streaming
- If user scrolls up: stop auto-scroll and show a **"Jump to latest"** pill
- When streaming increases height: avoid jumpiness via stable anchors

**Engineering Considerations:**
- Use a "scroll intent" flag (user-driven vs system-driven)
- Handle iOS momentum scroll + overscroll behavior (rubber band) carefully
- For long transcripts, consider lightweight **virtualization** later (not day 1), but plan for it

**Must-Have Affordances:**
- "Jump to latest" pill when user scrolls away from bottom
- "Continue" button when a message is long and you want to pace the narrative

---

### 4. Stat-Gating Frustration (HIGH PRIORITY - Higher than Breadcrumbs)

**Problem:** Level requirements can become rage-inducing friction.
- "REQ: Analytical 3" with no path shown
- "Locked" states are frustrating; "Challenge" states are motivating
- Potential dead ends

**Risk:** If a user wants to try the cool AI tool but is locked out, they need a clear path to unlock it.

**A locked choice MUST show:**
- Lock reason (plain language)
- Progress (e.g., Helping 2/4)
- Suggested path button (deep link to the right sim/tool)

**Example:** "Complete 2 more Logic Puzzles to unlock"

**This is one of the highest ROI changes you can ship.**

**Engineering Need:** Unified Requirement Engine + plain-language lock explanations + deep links

---

### 5. Navigation Depth (MEDIUM PRIORITY)

**Problem:** Modal/deck overlays can become a maze.
- Unclear "where am I?"
- Hard back-navigation
- State loss if modal closes unexpectedly

**Recommendations:**
- Every overlay needs breadcrumb line or "you are here" label
- Consistent gesture model (swipe-down to dismiss, swipe-left to go back)
- Preserve state across navigation

**Engineering Need:** Single navigation contract + state snapshotting per overlay route

---

### 6. Text Density & Typography (MEDIUM PRIORITY)

**Problem:** Text-heavy screens with monospace font.
- Readability issues on smaller screens
- Visual impairment concerns
- Long monospace paragraphs fatigue

**The Scene vs Conversation Tension:**
You're straddling two paradigms: the bordered narrative container feels like a visual novel (scene-based, theatrical), while the chat-style interaction pattern expects a conversation flow. Consider: what if the bordered container is right for narrative beats but you transition to conversation flow for simulation/AI moments? Mode-switching could be intentional rather than a bug.

**Typography Strategy:**
- Use monospace for NPC dialogue and system text (maintains terminal/cyberpunk feel)
- Switch to readable sans-serif for user-facing instructional content and longer educational passages
- Let typography signal "this is story" vs "this is learning"

**Reading Comfort Rules:**
- Target ~30–34 characters per line for monospace body on mobile
- Increase line height (monospace needs it)
- Use paragraph rhythm: more breaks, fewer dense blocks
- Add subtle paragraph reveal rather than pure typewriter for long text
  - Typewriter is great in short bursts, tiring in long ones

**Line Length as Pacing Tool:**
- Comfortable line length for educational content
- Deliberately narrower for atmospheric story beats
- Make pacing a design tool

**Recommendations:**
- Reader mode with adjustable font size, line height
- Optional: "Reader" toggle: Terminal (mono) vs Reader (sans)
- Typewriter effect must have:
  - "Tap to reveal" (always)
  - "Skip animation" setting
  - Accessibility support (reduced motion)

**Contrast:** Ensure grey text is at least WCAG AA compliant (#B0B0B0 or lighter). In bright sunlight, low contrast interface will be invisible.

**Engineering Need:** Single "Text Presentation Controller" for all narrative views

---

### 7. Economy Balance (MEDIUM PRIORITY)

**Problem:** Orb scarcity can feel unfair.
- Skills cost 10-30 Orbs
- User starts with ~7 Orbs
- Early scarcity without clear path

**Risk:** For a workforce development tool, this risks feeling like a paywall rather than a progression system. Your target users aren't gamers grinding for satisfaction; they're students who need to see real progress fast.

**Recommendations:**
- Make early progression fast (first 10 minutes should "pop")
- Avoid "paywall vibes"
- Tie economy to skill mastery, not time spent

**Engineering Need:** Instrumentation for:
- Time to first unlock
- Unlock frequency
- Churn at locked screens
- "I'm stuck" loops

---

### 8. Evidence System Gaps (HIGH PRIORITY)

**Problem:** Portfolio engine is core business value but may be incomplete.

**Requirements for Evidence:**
- Contextual (what was the scenario?)
- Verifiable (what did user do, not what app claims?)
- Exportable (PDF, share link, transcript snippet, rubric score)
- Mapped to competency framework
- Clear marking of user-generated vs AI-assisted

**Critical Requirement: Evidence entries must be rubric-backed, not vibes-backed.**

Define a minimal rubric schema now:
```typescript
interface EvidenceEntry {
  id: string
  skill: string
  level: 1 | 2 | 3 | 4
  criteriaMet: string[]
  evidenceSource: {
    nodeId: string
    choiceId: string
    transcriptSpan: string
  }
  authorship: 'user' | 'assisted'
  timestamp: Date
  verificationStatus: 'verified_by_system' | 'pending'
}
```

You can render this later, but if you don't store it now you'll regret it.

**Evidence Interaction Design:**
"Tap a skill to see your evidence" is brilliant but needs careful interaction design:
- If it's a modal that pops up, you lose context
- If it's an inline expansion, you might break the constellation visualization
- Consider a split-view or slide-over that keeps the skill map visible while showing evidence
- Reinforces the connection between abstract skill and concrete proof

**Engineering Need:** Event-sourced evidence log with rubric scores

---

### 9. Choice Presentation Hierarchy (MEDIUM PRIORITY)

**Problem:** Current choices feel like UI controls, not meaningful narrative moments.

**Choices have different weights narratively:**
| Choice Type | Presentation |
|-------------|--------------|
| Binary pivotal moments | Full-width dramatic buttons |
| Conversational responses | Compact chips |
| Exploratory options | Expandable list in bottom sheet |
| Locked paths | Dimmed with clear unlock hint |

The UI should communicate choice significance before the user reads the text.

**Choice Writing Guidelines:**
- One choice should always be "curious/empathic"
- One should be "direct/action"
- If there are more, hide them behind "More options"
- Style choices as quick-reply chips when short
- When chosen, they animate into a user message bubble
- Keep remaining choices visible briefly as "alternatives" then fade

---

### 10. Thumb Zone & Navigation Ergonomics (MEDIUM PRIORITY)

**Problem:** Current design relies on top-aligned navigation (tabs, close buttons). On modern large phones (iPhone Pro Max, Pixel XL), this is a friction point.

**The "Reach" Problem:**
- Tabs for Harmonics / Essence / Mastery are at the very top
- Users have to shimmy their grip to switch tabs

**Recommendations:**
- Move secondary navigation (tabs) to the bottom of the modal, just above "Home" indicator bar
- OR implement swipe gestures between tabs (swipe left to slide to next)

**The "Close" Interaction:**
- "X" in top right is the hardest touch target on a screen
- **Fix:** Implement "Pull-to-Dismiss" physics
- User should be able to drag entire card/modal downward to close

---

### 11. Cohort/Social Layer (FUTURE)

**Problem:** "ONLINE 3 | OFFLINE 18" implies classroom deployment.

**Considerations:**
- Privacy concerns (show names? counts? pseudonyms?)
- Teacher/admin dashboards (cohort progress, who's stuck)
- Careful "compare to cohort" (can demotivate)

**Engineering Need:** Roles + permissions (student, educator, employer, admin) + privacy defaults

---

### 12. AI Tool Integration (FUTURE)

**Problem:** Neural Deck sends users to external tools with no return path.

**The "Golden Artifact" (prompt template) UX:**
- Currently looks like static text
- Manual select/copy on mobile is clunky

**Fix:**
- One-Tap Copy: Add distinct "Copy" icon/button inside amber box
- Haptic Confirmation: Sharp haptic "click" + button changes to "Copied!" temporarily
- "Fill-in-the-Blank" UI: Small form where user types their concept, app generates final prompt string

**Recommendations:**
- Each tool card needs micro-mission
- App should save artifacts (outputs, revisions, reflections)
- Keep user in-app or provide clear return path

**Engineering Need:** Artifact System (input → output → reflection → evidence tagging)

---

### 13. Global Effects Regression (ADDRESSED)

**Problem:** Atmospheric effects (body classes) can silently break.

**Status:** ✅ FIXED (January 2026)
- Added `EnvironmentalEffects` to `StatefulGameInterface.tsx`
- Created 14 unit tests in `tests/lib/environmental-effects.test.tsx`
- Classes now properly apply/swap/cleanup

---

## Part 4: Mobile Interaction Physics (ChatGPT/Claude Parity)

**Key Finding:** Current UI is aesthetically close to top-tier AI apps, but **interaction physics + scroll model** need work.

### 4.1 The "Alive" Feel - Micro-Feedback

**Problem:** Experience is clean but static between tap → response.

**Add 3 small things:**
1. **Pressed state on choices** (scale 0.98 + quick haptic)
2. **Choice commits into transcript** (this is huge)
3. **Assistant "thinking" affordance** (3-dot / subtle "drift" animation) that matches your lore

This creates the "Anthropic/ChatGPT" sensation of responsiveness.

### 4.2 Haptic Feedback Spec

| Action | Haptic |
|--------|--------|
| Light Tap | When selecting a dialogue choice |
| Heavy Thud | When unlocking a "Mastery" node or leveling up |
| Buzz | When "Drift" or "Glitch" effects happen in story |
| Sharp Click | When copying prompt to clipboard |

### 4.3 Transition Physics

**Modals:** Should not just pop up. They should:
- Slide up from bottom (Sheet)
- OR slide in from side (Deck)
- Reinforces "layer over reality" metaphor

**Text Rendering:** Typewriter effect needs to be skippable with a tap. Do not force users to wait for text to scroll every time.

### 4.4 Narrative Container: Fix Nested Scroll

**Layout Pattern:**
```
┌─────────────────────────────────┐
│ HEADER (sticky)                 │
├─────────────────────────────────┤
│ TRANSCRIPT (overflow-y: auto)   │
│   └─ Message cards (stacked)    │
├─────────────────────────────────┤
│ COMPOSER (sticky)               │
└─────────────────────────────────┘
```

### 4.5 Answer Container: Composer System

**Problem:** "YOUR RESPONSE" zone is a glass panel with scrollable buttons—feels like UI controls, not conversation.

**Recommendations:**

| Change | Description |
|--------|-------------|
| **Quick Reply + Composer model** | Chips above composer bar |
| **Bottom sheet for >3 choices** | No scrollbar in choice panel |
| **Choice animates to transcript** | Tapped choice becomes user message |
| **Tighten vertical space** | Shrink response zone for 2 choices |
| **Keyboard correctness** | Safe-area padding + visualViewport |

**Interaction Model Decision:**
- **Choices-only for most gameplay** (Pokemon/Disco Elysium style)
- **Typing as rare "power move"** (AI simulations, reflections, golden prompts)
- Composer hidden by default, revealed only when narrative enables it

**Composer Strategy:**
Even if typing is rare, keep a slim, disabled composer bar visible with microcopy:
- "Typing unlocked in reflections"
- OR "Respond when prompted"

This prevents bottom UI from shape-shifting too much and helps users understand the interaction model.

### 4.6 Side Menus: Unified Hub System

**Problem:** Multiple icons (book, star, gear, N) create confusion.

**Recommendations:**

| Change | Description |
|--------|-------------|
| **One overlay primitive** | Bottom sheet OR right drawer (pick one) |
| **Single Hub entry** | One header icon opens tabbed hub |
| **Consistent gestures** | Swipe-down to dismiss everywhere |
| **Maintain continuity** | Keep story visible under blur scrim |
| **Hub search** | One search box: "Find skill / dossier / tool / evidence" |

**Premium Pattern - Peek Previews:**
- Tap hub → sheet opens at 40% height showing "recent" (recent evidence, current mystery, next sim)
- Swipe up → full hub
- Swipe down → dismiss

This makes hub feel like a layer over reality, not a hard context switch.

**"Back to story" Affordance:**
When hub is open, users should always feel the story is still "there":
- Blurred story underlay
- Clear sheet header: "Hub"
- Quick close

**Don't let hub tabs each have their own nav rules.** If every tab becomes its own mini-app, you'll reintroduce the maze problem. Keep tab content shallow.

### 4.7 Bottom Sheet Ergonomics

| Rule | Implementation |
|------|----------------|
| Open trigger | Tap "More choices" button |
| Close triggers | Swipe down, tap scrim, select choice |
| Scroll behavior | Sheet scrolls, not parent |
| Max height | 60% viewport |
| Backdrop | Blur + 50% opacity black |
| **Tap height** | **44px+ (ideally 52–60px for thumb comfort)** |
| Safe area | Respect safe area + keyboard avoidance |
| Accessibility | Focus trap, proper aria labels, clear close affordance + swipe-down |

**If top choices are curated, label sections:**
- "Suggested"
- "More options"

### 4.8 "Top-Tier AI App Feel" Checklist

| # | Requirement | Priority |
|---|-------------|----------|
| 1 | Single scroll surface (no inner scrollbars) | HIGH |
| 2 | Choice tap animates into transcript | HIGH |
| 3 | Bottom sheet for "more choices" | HIGH |
| 4 | Lock explanation UI (deep links) | HIGH |
| 5 | One unified Hub overlay | MEDIUM |
| 6 | Keyboard/safe-area correctness | MEDIUM |
| 7 | Streaming response affordances | LOW |

---

## Part 5: Visual Polish & "Juice"

### 5.1 Feedback Loops & Animation

"Juice" is a game design term for non-essential visual feedback that makes interactions feel satisfying.

**Orb Spending:**
When buying a skill, don't just subtract the number.
- Animation: Have the 10 Orbs physically fly from the counter into the skill slot
- Accompanied by sound effect

**Progress Bars:**
In Opportunities screen, the progress bars are static.
- Animation: When user opens screen, bars should animate from 0% to current level
- Draws eye to progress

### 5.2 The "Active Thoughts" Bar

The "Active Thoughts" toast shows "0% Internalized" - this is a progress bar.

**UX Idea:**
- As user makes dialogue choices that align with this thought, bar should visibly fill up in real-time (glimmer/pulse)
- When it hits 100%, it should "lock in" and fly up into user's profile icon
- Makes abstract concept of "learning" feel tangible

### 5.3 Visualizing "The Void" (Background Depth)

The background is currently a static dark texture with stars/particles.

**Parallax Effect:**
- Background layers (stars/grid) should move slightly based on phone's gyroscope
- When user tilts phone, background shifts
- Creates "window-into-another-world" effect

**Depth of Field:**
- When a modal opens (like Skill Tree), background narrative layer should blur significantly
- Focuses attention and reduces visual noise

### 5.4 Radar Chart Utility

Radar charts look cool but are notoriously hard to read for precise data.

**The "Compare" Toggle:**
When viewing a Job Opportunity (like "Nursing"), overlay a ghost outline on the chart showing required stats for that job.

Creates instant visual gap analysis: "Oh, my 'Heart' stat is full, but my 'Hands' stat is only half of what the hospital needs."

### 5.5 Node Map Usability (Constellations)

The constellation maps are dense. On a 6-inch screen, tapping a specific small dot is frustrating ("Fat Finger" problem).

**Recommendations:**
- **Smart Zoom:** Tapping anywhere near a cluster of nodes should auto-zoom into that cluster
- **Snap-to-Node:** Selection reticle should magnetically snap to nearest node as user drags, with light haptic bump as it passes over each one
- **List View Fallback:** Toggle to view data as vertical list (some users cannot parse spatial node maps)

### 5.6 Iconography Consistency

There's a clash in visual language:
- **Avatar:** 8-bit Pixel Art
- **UI Icons:** Ultra-thin vector lines (Harmonics, Essence)
- **Opportunity Icons:** Minimalist solid shapes (Briefcase)

**Options:**
- **Option A:** Make UI icons slightly "pixelated" or "aliased" to match avatar
- **Option B:** Keep UI sleek, but treat pixel avatar as a "glitch" in the system (add scanlines or chromatic aberration effects to avatar) to explain why it looks different

### 5.7 Empty States (Cold Start)

When new user opens "Network" map or "Dossiers", it might be empty.

**Don't just show "No Dossiers."**

**Narrative Fix:**
- Show "Scanning for signals..." animation
- OR "No active traces detected."
- Keep user in immersion even when there is no data yet

### 5.8 Session Continuity Cues

ChatGPT/Claude feel premium because you always know:
- Who's speaking
- What mode you're in
- What's happening next

**For your app:**
- Use a small mode tag under Terminus: e.g. `Conversation • Samuel` / `Simulation • Patient Comfort`
- Keep it diegetic ("SYNC: DRIFTING") but add plain meaning in small text

### 5.9 Status Dot Meaning

Green dot is visually nice, but users will wonder what it means.

**Map it to simple concept:**
- Green = connected / autosaving
- Yellow = drifting (offline-ish)
- Red = paused (no sync)

**Show tiny toast if it changes:** "Sync drifting—saving locally."

That's UI trust, not security.

---

## Part 6: Choice Animation Spec

### 6.1 Persisted "UserMessage" Contract

When a choice is selected, it should create a real message entity in state:

```typescript
interface UserChoiceMessage {
  type: 'user_choice'
  choiceId: string
  displayText: string
  timestamp: Date
  skillTags?: string[]
  wasLocked: false
}
```

This makes replay, evidence, export, and analytics consistent.

### 6.2 Undo/Confirm Semantics

For game flows, consider a small window:
- "Undo" for 2–3 seconds after tapping a choice (optional)
- Reduces rage mis-taps on mobile
- Aligns with premium polish

### 6.3 Animation Sequence

```typescript
// When user taps choice:
1. Choice card scales to 0.95 (feedback)
2. Other choices fade out (opacity 0, 150ms)
3. Selected choice animates:
   - translateY: current → transcript insertion point
   - backgroundColor: choice-color → user-message-color
   - duration: 300ms, easing: ease-out
4. Insert into transcript DOM
5. Show typing indicator after 200ms delay
```

---

## Part 7: Anti-Gaming Protection

### 7.1 Lightweight Detection (No Heavy ML Needed)

Start with:
- Detect rapid repeated patterns ("farming")
- Detect repeated identical selections across sessions
- Cap orb gains per time window per skill
- Prefer *variety* signals over volume

### 7.2 Gentle Mitigation

Mitigation should not feel punitive:
- Diminishing returns
- "Try a different approach to grow this skill"

This keeps game from feeling punitive.

---

## Part 8: Success Metrics & Definition of Done

### 8.1 UX Feel Metrics

| Metric | Target |
|--------|--------|
| Time-to-first-response (tap → first token) | < 200ms |
| Scroll-jank incidents (auto-scroll fighting user) | 0 |
| Choice mis-taps / back-outs from sheet | < 5% |
| Keyboard overlap bugs (composer covered) | 0 |

### 8.2 Product Metrics

| Metric | Target |
|--------|--------|
| Session 1 completion rate (first "chapter") | > 70% |
| "Stuck at locked screen" rate | < 10% |
| Tooltip opens per user | Instrument |
| Tooltip → churn correlation | Instrument |
| Time to first unlock | < 5 min |

### 8.3 Definition of Done per Feature

| Feature | DoD |
|---------|-----|
| Single scroll surface | Zero nested scrollbars in transcript + choices |
| Choice animates to transcript | Choice becomes user message bubble and persists in history |
| Bottom sheet choices | Sheet uses its own scroll, parent doesn't scroll when sheet open |
| Lock explanation | Shows reason + progress + action button |
| Glossary tooltip | Shows meaning + relevance + action |

---

## Part 9: Risk Register

Known risks the team should watch:

| Risk | Mitigation |
|------|------------|
| Auto-scroll fighting user | Scroll intent flag |
| Keyboard overlap on iOS | visualViewport API |
| Nested scroll reintroduced by new component | Code review checklist |
| State loss when closing sheets | State snapshotting |
| Performance regression with long transcripts | Plan for virtualization |
| Accessibility regressions with monospace + low contrast | WCAG AA audit |
| Economy feels like paywall | Early progression tuning |
| Evidence system not rubric-backed | Define schema now |

---

## Part 10: Implementation Spec

### 10.1 Component Tree

```
<GameScreen>
  <StickyHeader />
  <TranscriptScroll>
    <MessageCard type="npc" />
    <MessageCard type="user" />
    <TypingIndicator />
  </TranscriptScroll>
  <StickyFooter>
    <QuickReplies choices={choices.slice(0,3)} />
    <MoreChoicesButton onPress={openSheet} />
    <ComposerBar visible={typingEnabled} />
  </StickyFooter>
  <BottomSheet ref={sheetRef}>
    <ChoiceList choices={allChoices} />
  </BottomSheet>
  <HubSheet ref={hubRef}>
    <HubTabs: Journal | Skills | Tools | Settings />
  </HubSheet>
</GameScreen>
```

### 10.2 State Machine

```
States: idle → choosing → sending → streaming → complete

idle:
  - Show last messages
  - Quick replies visible (if choices exist)
  - Composer hidden (unless typing enabled)

choosing:
  - User taps choice OR opens bottom sheet
  - Highlight selected choice

sending:
  - Animate choice into transcript as user message
  - Collapse/disable remaining choices
  - Show typing indicator

streaming:
  - NPC message appears character-by-character
  - Stop button available (optional)

complete:
  - Full message rendered
  - New choices appear (→ idle)
```

### 10.3 Critical CSS

```css
/* Single scroll surface */
.transcript {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* No inner scrollbars */
.message-card {
  overflow: visible; /* NOT overflow-y: auto */
}

/* Safe area handling */
.sticky-footer {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* Keyboard awareness */
.composer {
  position: sticky;
  bottom: 0;
  /* Use visualViewport API for keyboard handling */
}

/* Minimum tap targets */
.choice-button {
  min-height: 44px; /* 52-60px preferred */
  min-width: 44px;
}
```

### 10.4 Files to Modify

| File | Changes |
|------|---------|
| `StatefulGameInterface.tsx` | Refactor to single-scroll model |
| `GameChoices.tsx` | Add bottom sheet for >3 choices |
| `ChatPacedDialogue.tsx` | Message cards instead of single container |
| `components/ui/BottomSheet.tsx` | New component (or use library) |
| `components/ui/HubSheet.tsx` | Unified overlay for all side panels |
| `lib/ui-constants.ts` | Add sheet heights, animation durations |
| `lib/glossary.ts` | Term definitions with actions |
| `lib/evidence-schema.ts` | Rubric-backed evidence types |

---

## Part 11: Current Implementation Status

### Fully Addressed ✅

| Issue | Solution | Location |
|-------|----------|----------|
| Text accessibility | Tap-to-skip, reduced-motion support | `RichTextRenderer.tsx` |
| Global effects regression | Unit tests for body classes | `environmental-effects.test.tsx` |

### Partially Addressed ⚠️

| Issue | Current State | Gap |
|-------|---------------|-----|
| Navigation depth | State persistence via localStorage/Zustand | No breadcrumbs or "where am I" |
| Evidence mechanic | `SkillTracker` records demonstrations | No export, no rubric scores |
| Stat gating | Pattern requirements on choices | No "why locked" plain-language |
| Economy instrumentation | Pattern system tracks scores | No churn analytics at locked screens |

### Not Yet Built 🔴

| Issue | Notes |
|-------|-------|
| Dual-language glossary | No contextual tooltips for jargon |
| Single scroll surface | Still nested scroll model |
| Choice → transcript animation | Choices don't become messages |
| Bottom sheet for choices | Still inline buttons |
| Unified Hub overlay | Multiple entry points |
| Anti-gaming protection | No pattern farming detection |
| Artifact System | No in-app output capture from external tools |
| Evidence export | No PDF/share functionality |
| Evidence rubric schema | No structured criteria storage |

---

## Part 12: Recommended Sprint Prioritization

### Sprint 1: Feel + Friction (ChatGPT/Claude Parity)

1. **Single scroll surface + scroll anchoring rules**
2. **Choice → transcript animation**
3. **Bottom sheet for >3 choices**
4. **Lock explanation UI (deep links)**

### Sprint 2: Reduce Confusion + Validate Business Value

5. **Glossary tooltips** (with "what to do next")
6. **Evidence schema + first evidence viewer card** (export can come later)

### Sprint 3: Polish + Instrumentation

7. **Navigation breadcrumbs**
8. **Economy instrumentation**
9. **Anti-gaming detection**

### Future (Q2+ 2026)

10. **Cohort features** - Classroom deployment
11. **Artifact System** - External tool integration
12. **Educator Dashboard** - B2B value prop
13. **Evidence export** - PDF generation

---

## Appendix A: Screen-by-Screen Analysis

### Image 1: Narrative Engine
- **Function:** Central hub, presents "The Station" story
- **UX:** Minimal, focuses on text, choice-based interaction
- **Note:** "Fox Theatre Station... Since 1929" reinforces regional theme
- **Issue:** Nested scroll container

### Image 2: Resonance Field (Character Sheet)
- **Function:** Class system ("Weaver," "Anchor," "Voyager")
- **Lock Mechanism:** Requires Orbs to unlock
- **Note:** Gamifies career paths
- **Issue:** Close button in top-right (hard to reach)

### Image 3: Radar Chart (Stats)
- **Function:** RPG stat wheel for soft vs hard skills
- **Visual:** Hexagon shape (stability metaphor)
- **Enhancement:** Add ghost overlay for job requirements

### Image 4: Ability Mastery (Skill Tree)
- **Function:** Spend Orbs to unlock abilities
- **Note:** Tiered mastery (same skill appears at 10 and 30 Orbs)

### Image 5: Opportunities (Real World)
- **Function:** Unlocks job shadowing/volunteering
- **Partners:** UAB Medical Center, Children's of Alabama, Southern Company
- **Gate:** Requires pattern levels ("Helping Lvl 4")
- **Enhancement:** Animate progress bars on load

### Image 6: Mysteries (Quest Tracking)
- **Function:** Tracks narrative threads
- **Note:** "Internalization" mechanic (0% → 100%)
- **Enhancement:** Bar should fill visibly as choices align

### Image 7-8: Neural Deck (Tool Inventory)
- **Function:** Prompt templates as "Cybernetic Upgrades"
- **Tools:** Microsoft Copilot, Julius AI, DALL-E 3
- **Note:** "ONLINE 3 | OFFLINE 18" implies cohort feature
- **Enhancement:** One-tap copy + fill-in-the-blank UI

### Image 9: Simulations
- **Function:** Scenario-based learning
- **Characters:** Maya (Sales), Grace (Healthcare), Tess (Education), Alex (Operations)

### Image 10-11: Constellations
- **Function:** Network map + skill visualization
- **Note:** "Tap a skill to see your evidence"
- **Enhancement:** Smart zoom, snap-to-node, list view fallback

### Image 12: Dossiers (Quest Log)
- **Function:** Standard quest tracking with diegetic labels
- **Note:** "Encrypted" files create curiosity gap
- **Enhancement:** Better empty state ("Scanning for signals...")

---

## Appendix B: Architecture Requests

To enable deeper review, engineering should document:

1. **Navigation Approach** - App Router structure + modal/deck implementation
2. **State Model** - gameState shape + persistence strategy
3. **Evidence Data Model** - Current or planned schema
4. **Unlock/Requirements Engine** - Where rules live
5. **Telemetry Plan** - Events, funnels, drop-offs

---

**Document Author:** Claude Code
**Last Updated:** January 22, 2026
**Status:** Ready for Team Deliberation
