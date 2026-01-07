# Lux Story - Comprehensive QA Test Plan

**Version:** 2.0
**Date:** January 7, 2026
**Target:** Browser automation agents (Google Antigravity, Playwright, etc.)

This document provides both human-readable guidance and machine-parseable JSON test cases for comprehensive QA testing.

---

## Part 1: Exploratory Game Testing

### What This Is
A narrative career exploration game set in a magical train station. You play through dialogue with 16 characters, making choices that reveal your behavioral patterns and build trust relationships.

### Your Mission
Explore the game as a curious player would. Progress through conversations, make varied choices, and observe how the game responds.

### Starting Point
- **Production:** [https://lux-story.vercel.app](https://lux-story.vercel.app)
- **Local Dev:** [http://localhost:3005](http://localhost:3005)

### Core Loop to Exercise
1. **Read dialogue** - Characters speak to you with emotional context
2. **Make choices** - Each choice may affect patterns and trust
3. **Watch for feedback** - Glows, sounds, pattern orbs filling
4. **Open Journal** (book icon) - See your stats and progress
5. **Open Constellation** (stars icon) - See character relationships
6. **Return to Samuel** - The owl who guides between conversations

### Things to Try
- [ ] Meet multiple characters (Maya, Devon, Marcus, etc.)
- [ ] Make different types of choices (helpful vs analytical vs exploring)
- [ ] Build trust with a character to unlock deeper conversations
- [ ] Look for "interrupt" moments (quick-time prompts during dialogue)
- [ ] Check if Journal updates after meaningful choices
- [ ] Try the menu options (top-left hamburger)

### What to Report
- Any crashes or error screens
- Dialogue that seems broken or loops unexpectedly
- Choices that don't seem to do anything
- UI elements that are confusing or unresponsive
- Moments that felt satisfying or frustrating (UX quality)
- Missing feedback after important actions

### Interaction Style
- Take your time reading dialogue
- Vary your choice patterns (don't always pick the same type)
- If stuck, look for a "Return to Station" or talk to Samuel
- The game saves automatically - refresh should restore progress

---

## Part 2: JSON Test Suites

Browser automation agents should parse these JSON blocks for structured test execution.

### Selector Reference

```json
{
  "selectors": {
    "data_testid": {
      "intro_title": "[data-testid='intro-title']",
      "intro_cta": "[data-testid='intro-cta']",
      "game_interface": "[data-testid='game-interface']",
      "character_header": "[data-testid='character-header']",
      "dialogue_card": "[data-testid='dialogue-card']",
      "dialogue_content": "[data-testid='dialogue-content']",
      "game_choices": "[data-testid='game-choices']",
      "choice_button": "[data-testid='choice-button']"
    },
    "class_patterns": {
      "journal": "[class*='Journal']",
      "constellation": "[class*='Constellation']",
      "pattern_orb": "[class*='PatternOrb'], .pattern-orb",
      "trust_indicator": "[class*='trust'], [class*='Trust']",
      "avatar": "[class*='avatar'], [class*='Avatar']"
    }
  }
}
```

### Test Suite: Core Mechanics

```json
{
  "test_suite": "core_mechanics",
  "description": "Validate fundamental game systems",
  "cases": [
    {
      "id": "CORE_001",
      "name": "Game Initialization",
      "priority": "P0",
      "steps": [
        "Navigate to entry point URL",
        "Wait for atmospheric intro to appear",
        "Verify intro title is visible",
        "Click begin/start button"
      ],
      "expected": "Game transitions to first dialogue with Samuel",
      "selectors": {
        "intro_title": "[data-testid='intro-title']",
        "intro_cta": "[data-testid='intro-cta']",
        "game_interface": "[data-testid='game-interface']"
      },
      "timeout_ms": 5000
    },
    {
      "id": "CORE_002",
      "name": "Choice Selection",
      "priority": "P0",
      "steps": [
        "Wait for dialogue to complete typing",
        "Identify choice buttons in container",
        "Click any choice button",
        "Wait for transition animation"
      ],
      "expected": "New dialogue node loads, previous choice acknowledged",
      "selectors": {
        "choices_container": "[data-testid='game-choices']",
        "choice_button": "[data-testid='choice-button']",
        "dialogue_card": "[data-testid='dialogue-card']"
      },
      "timeout_ms": 3000
    },
    {
      "id": "CORE_003",
      "name": "Pattern Orb Updates",
      "priority": "P1",
      "steps": [
        "Note current pattern orb states (top of screen)",
        "Make a choice with visible pattern consequence",
        "Observe pattern orbs after choice"
      ],
      "expected": "Relevant pattern orb animates and increases/decreases",
      "selectors": {
        "pattern_orbs": ".pattern-orb, [class*='PatternOrb']",
        "choice_button": "[data-testid='choice-button']"
      },
      "visual_check": true
    },
    {
      "id": "CORE_004",
      "name": "Trust Indicator Updates",
      "priority": "P1",
      "steps": [
        "Engage with any character",
        "Make choices that show trust consequences",
        "Monitor trust indicator in header"
      ],
      "expected": "Trust value changes within [-2, +2] per choice",
      "selectors": {
        "character_header": "[data-testid='character-header']",
        "trust_indicator": "[class*='trust'], [class*='Trust']"
      }
    },
    {
      "id": "CORE_005",
      "name": "Dialogue Typewriter Effect",
      "priority": "P1",
      "steps": [
        "Trigger new dialogue node",
        "Observe text appearing character by character"
      ],
      "expected": "Text types at readable pace (~30-50ms per character), skippable on tap/click",
      "selectors": {
        "dialogue_content": "[data-testid='dialogue-content']"
      },
      "timing_check": {
        "min_duration_ms": 500,
        "max_duration_ms": 8000
      }
    }
  ]
}
```

### Test Suite: Golden Paths

```json
{
  "test_suite": "golden_paths",
  "description": "Critical user journeys that must work flawlessly",
  "cases": [
    {
      "id": "PATH_001",
      "name": "New Game Start to First Character",
      "priority": "P0",
      "character_sequence": ["atmospheric_intro", "samuel", "first_character"],
      "steps": [
        "Load fresh session (clear localStorage if needed)",
        "Complete atmospheric intro",
        "Engage with Samuel's opening dialogue",
        "Make 2-3 choices with Samuel",
        "Receive direction to visit another character",
        "Navigate to directed character's platform"
      ],
      "expected": "Player seamlessly transitions from intro through Samuel to first character",
      "success_indicators": [
        "samuel_intro_completed flag set",
        "First character dialogue loads"
      ],
      "estimated_duration_ms": 120000
    },
    {
      "id": "PATH_002",
      "name": "Trust Progression (3 to 6)",
      "priority": "P0",
      "steps": [
        "Select any character with trust level ~3",
        "Make consistently positive/empathetic choices",
        "Continue until trust reaches 6+",
        "Observe new dialogue options unlocking"
      ],
      "expected": "Trust gate at 5-6 unlocks vulnerability arc content",
      "mechanics_note": "Trust changes range [-2, +2] per choice, typical +1 for aligned choices"
    },
    {
      "id": "PATH_003",
      "name": "Journal System Verification",
      "priority": "P1",
      "steps": [
        "Complete 3+ dialogue exchanges",
        "Open Journal panel (button in game header)",
        "Review entries for recent conversations",
        "Close Journal and verify game state preserved"
      ],
      "expected": "Journal contains entries reflecting player's journey",
      "selectors": {
        "journal_button": "[class*='journal'], button[aria-label*='journal']",
        "journal_panel": "[class*='Journal']"
      }
    },
    {
      "id": "PATH_004",
      "name": "Constellation Navigation",
      "priority": "P1",
      "steps": [
        "Open Constellation panel",
        "Observe character nodes visualized",
        "Click/tap on character node",
        "Verify navigation or info display"
      ],
      "expected": "Constellation shows connected character network, nodes are interactive",
      "selectors": {
        "constellation_button": "[class*='constellation'], button[aria-label*='constellation']",
        "constellation_panel": "[class*='Constellation']"
      }
    },
    {
      "id": "PATH_005",
      "name": "Return to Samuel Hub",
      "priority": "P1",
      "steps": [
        "Complete conversation with any non-Samuel character",
        "Return to Samuel (via navigation or story prompt)",
        "Verify Samuel acknowledges previous conversation"
      ],
      "expected": "Samuel's dialogue reflects player's progress with cross-character memory",
      "mechanics_note": "Samuel is hub character - conversations should reference player history"
    },
    {
      "id": "PATH_006",
      "name": "Save/Continue Flow",
      "priority": "P0",
      "steps": [
        "Progress through several dialogues",
        "Refresh page or navigate away and return",
        "Verify continue option appears",
        "Click continue and verify state restoration"
      ],
      "expected": "Game state persists in localStorage, player resumes where they left off",
      "storage_check": {
        "key_pattern": "lux-story*",
        "storage_type": "localStorage"
      }
    }
  ]
}
```

### Test Suite: UI Validation

```json
{
  "test_suite": "ui_validation",
  "description": "Visual and interaction quality checks",
  "viewport_matrix": [
    { "width": 375, "height": 812, "device": "iPhone X", "priority": "P0" },
    { "width": 390, "height": 844, "device": "iPhone 12/13/14", "priority": "P1" },
    { "width": 768, "height": 1024, "device": "iPad Portrait", "priority": "P1" },
    { "width": 1024, "height": 768, "device": "iPad Landscape", "priority": "P2" },
    { "width": 1280, "height": 800, "device": "Laptop", "priority": "P1" },
    { "width": 1440, "height": 900, "device": "Desktop", "priority": "P0" },
    { "width": 1920, "height": 1080, "device": "Full HD", "priority": "P2" }
  ],
  "cases": [
    {
      "id": "UI_001",
      "name": "Layout Shift Detection",
      "priority": "P0",
      "check_type": "cls",
      "steps": [
        "Load page and wait for full render",
        "Monitor Cumulative Layout Shift during dialogue transitions"
      ],
      "threshold": {
        "max_cls": 0.1,
        "good_cls": 0.05
      },
      "selectors": {
        "dialogue_container": "[data-testid='dialogue-card']",
        "choices_container": "[data-testid='game-choices']"
      }
    },
    {
      "id": "UI_002",
      "name": "Touch Target Sizing",
      "priority": "P0",
      "check_type": "dimensions",
      "elements": [
        {
          "selector": "[data-testid='choice-button']",
          "min_height_px": 44,
          "min_width_px": 44,
          "note": "Apple HIG minimum touch target"
        },
        {
          "selector": "[data-testid='intro-cta']",
          "min_height_px": 48,
          "min_width_px": 120
        }
      ]
    },
    {
      "id": "UI_003",
      "name": "Avatar Rendering",
      "priority": "P1",
      "check_type": "visual",
      "steps": [
        "Navigate to any character dialogue",
        "Inspect character avatar in header"
      ],
      "expected": {
        "dimensions": "32x32 pixels",
        "shape": "circular (border-radius: 50%)",
        "source": "DiceBear API (api.dicebear.com)"
      },
      "selectors": {
        "avatar": "[data-testid='character-header'] img, [class*='avatar']"
      }
    },
    {
      "id": "UI_004",
      "name": "Glass Morphism Effects",
      "priority": "P2",
      "check_type": "visual",
      "steps": [
        "Observe dialogue cards and panels",
        "Verify backdrop blur and transparency effects"
      ],
      "expected": {
        "backdrop_filter": "blur(12px) or similar",
        "background": "rgba with alpha < 1",
        "border": "subtle white/gray border"
      },
      "note": "Glass morphic design is core aesthetic - verify on supported browsers"
    },
    {
      "id": "UI_005",
      "name": "Animation Smoothness",
      "priority": "P1",
      "check_type": "performance",
      "steps": [
        "Trigger dialogue transition",
        "Monitor frame rate during animation"
      ],
      "expected": {
        "min_fps": 30,
        "target_fps": 60,
        "animation_library": "Framer Motion"
      },
      "note": "Animations use Framer Motion - should be GPU-accelerated"
    },
    {
      "id": "UI_006",
      "name": "Text Readability",
      "priority": "P0",
      "check_type": "typography",
      "checks": [
        {
          "element": "dialogue_text",
          "min_font_size_px": 16,
          "max_line_length_ch": 75,
          "line_height_ratio": 1.5
        },
        {
          "element": "choice_button_text",
          "min_font_size_px": 14,
          "font_weight": "medium or higher"
        }
      ]
    },
    {
      "id": "UI_007",
      "name": "Scroll Behavior",
      "priority": "P1",
      "check_type": "interaction",
      "steps": [
        "Load long dialogue content",
        "Scroll within dialogue container",
        "Verify smooth scrolling, no janky behavior"
      ],
      "expected": "Native smooth scrolling, momentum on touch devices"
    }
  ]
}
```

### Test Suite: Accessibility

```json
{
  "test_suite": "accessibility",
  "description": "WCAG 2.1 AA compliance checks",
  "cases": [
    {
      "id": "A11Y_001",
      "name": "Color Contrast",
      "priority": "P0",
      "standard": "WCAG_AA",
      "checks": [
        {
          "element": "body_text",
          "min_ratio": 4.5,
          "note": "Normal text against background"
        },
        {
          "element": "large_text",
          "min_ratio": 3.0,
          "note": "Text 18px+ or 14px+ bold"
        },
        {
          "element": "interactive_elements",
          "min_ratio": 3.0,
          "note": "Buttons, links, controls"
        }
      ]
    },
    {
      "id": "A11Y_002",
      "name": "Reduced Motion Support",
      "priority": "P1",
      "steps": [
        "Enable prefers-reduced-motion in browser/OS",
        "Navigate through app"
      ],
      "expected": "Animations disabled or significantly reduced",
      "css_check": "@media (prefers-reduced-motion: reduce)"
    },
    {
      "id": "A11Y_003",
      "name": "Keyboard Navigation",
      "priority": "P1",
      "steps": [
        "Start at page load",
        "Tab through all interactive elements",
        "Verify focus indicators visible",
        "Use Enter/Space to activate buttons"
      ],
      "expected": "All interactive elements reachable and operable via keyboard"
    },
    {
      "id": "A11Y_004",
      "name": "Screen Reader Labels",
      "priority": "P1",
      "checks": [
        {
          "element": "choice_buttons",
          "attribute": "aria-label or visible text",
          "required": true
        },
        {
          "element": "pattern_orbs",
          "attribute": "aria-label describing pattern",
          "required": true
        },
        {
          "element": "images",
          "attribute": "alt text",
          "required": true
        }
      ]
    },
    {
      "id": "A11Y_005",
      "name": "Focus Management",
      "priority": "P1",
      "steps": [
        "Open modal/panel (Journal, Constellation)",
        "Verify focus moves to modal",
        "Close modal",
        "Verify focus returns to trigger element"
      ],
      "expected": "Focus trapped in modals, restored on close"
    }
  ]
}
```

### Test Suite: Performance

```json
{
  "test_suite": "performance",
  "description": "Load time and runtime performance",
  "cases": [
    {
      "id": "PERF_001",
      "name": "Initial Load Time",
      "priority": "P0",
      "metrics": {
        "fcp_ms": { "good": 1800, "max": 3000 },
        "lcp_ms": { "good": 2500, "max": 4000 },
        "tti_ms": { "good": 3800, "max": 7300 }
      },
      "note": "First Contentful Paint, Largest Contentful Paint, Time to Interactive"
    },
    {
      "id": "PERF_002",
      "name": "Dialogue Transition Speed",
      "priority": "P1",
      "steps": [
        "Click choice button",
        "Measure time until new dialogue starts typing"
      ],
      "threshold_ms": 500,
      "note": "Should feel instant - no perceptible delay"
    },
    {
      "id": "PERF_003",
      "name": "Memory Stability",
      "priority": "P2",
      "steps": [
        "Play through 20+ dialogue exchanges",
        "Monitor JS heap size"
      ],
      "expected": "No significant memory growth (memory leaks)",
      "threshold_mb": {
        "start_max": 50,
        "growth_max": 20
      }
    },
    {
      "id": "PERF_004",
      "name": "Bundle Size",
      "priority": "P2",
      "checks": {
        "initial_js_kb": { "warn": 300, "max": 500 },
        "initial_css_kb": { "warn": 50, "max": 100 }
      },
      "note": "Check via Network tab or Lighthouse"
    }
  ]
}
```

### Test Suite: Error Handling

```json
{
  "test_suite": "error_handling",
  "description": "Graceful degradation and recovery",
  "cases": [
    {
      "id": "ERR_001",
      "name": "Network Offline Behavior",
      "priority": "P1",
      "steps": [
        "Start game normally",
        "Disable network (DevTools - Network - Offline)",
        "Continue making choices"
      ],
      "expected": "Game continues with cached content, localStorage persists state"
    },
    {
      "id": "ERR_002",
      "name": "LocalStorage Unavailable",
      "priority": "P2",
      "steps": [
        "Block localStorage access",
        "Load game"
      ],
      "expected": "Game runs without saving (graceful fallback), no crash"
    },
    {
      "id": "ERR_003",
      "name": "Error Boundary Recovery",
      "priority": "P1",
      "steps": [
        "If a component error occurs",
        "Verify error boundary catches it",
        "Look for recovery UI (retry button)"
      ],
      "expected": "Game shows friendly error message, offers retry",
      "note": "App uses layered error boundaries - page/game/section levels"
    },
    {
      "id": "ERR_004",
      "name": "Invalid Save State Recovery",
      "priority": "P1",
      "steps": [
        "Corrupt localStorage data for game",
        "Reload page"
      ],
      "expected": "Game detects invalid state, offers fresh start"
    }
  ]
}
```

---

## Part 3: Detailed UI/UX Testing Guide

### Visual System Details

#### Pixel Art Avatars (32x32)
- Characters have animal-themed pixel art avatars (Samuel=Owl, Maya=Cat, Marcus=Bear, Devon=Deer)
- [ ] **Check:** Avatars render crisply, no blur or scaling artifacts
- [ ] **Check:** Avatars appear in Journal side panel, NOT in main dialogue header

#### Glass Morphic Containers
- Dialogue cards have semi-transparent backgrounds (85%+ opacity) with subtle blur effects.
- [ ] **Check:** Text is readable against glass backgrounds
- [ ] **Check:** No "color jumping" when containers appear/disappear
- [ ] **Check:** Borders have subtle glow, not harsh lines

#### Pattern Orbs (Top of Screen)
- 5 colored orbs: Analytical, Helping, Building, Patience, Exploring (0-10 scale)
- [ ] **Check:** Orbs fill smoothly when patterns increase
- [ ] **Check:** Hover/tap shows pattern name tooltip
- [ ] **Check:** Dominant pattern orb has subtle glow/pulse

### Animation Details

#### Dialogue Appearance
- Text fades in with slight upward motion, staggered reveal.
- [ ] **Check:** No jarring "pop in" - smooth opacity transition
- [ ] **Check:** Reduced motion preference respected (instant if enabled)

#### Thinking Indicators
- "..." or typing indicator before NPC speaks.
- [ ] **Check:** Indicator doesn't loop forever
- [ ] **Check:** Doesn't reappear between every sentence

#### Choice Buttons
- Hover: Subtle scale (0.98-1.02) and glow. Tap: Immediate feedback, slight press animation.
- [ ] **Check:** 44px minimum touch target height
- [ ] **Check:** No layout shift when choices appear
- [ ] **Check:** Choice container is fixed height (~140px), scrolls if overflow

#### Navigation Highlights
- Nav button gets marquee shimmer effect when something new is available.
- [ ] **Check:** Shimmer is subtle, not distracting
- [ ] **Check:** Shimmer stops after user visits that section

#### Transitions Between Characters
- Smooth fade when switching conversations.
- [ ] **Check:** No flash of white/black between scenes
- [ ] **Check:** Background atmosphere changes appropriately

### Spacing & Layout

#### Safe Areas (Mobile)
- Bottom padding accounts for iOS home indicator.
- [ ] **Check:** Choice buttons aren't cut off at bottom
- [ ] **Check:** Content doesn't hide behind notch

#### Responsive Breakpoints
- Mobile: Single column, full-width dialogue. Tablet+: May show Journal as side panel.
- [ ] **Check:** No horizontal scroll on any screen size
- [ ] **Check:** Text doesn't overflow containers

#### Dialogue Container
- Fixed position footer for choices, scrollable main area for dialogue history.
- [ ] **Check:** Header (character name) stays fixed
- [ ] **Check:** Scrollbar appears only when needed
- [ ] **Check:** `scrollbar-gutter: stable` - no layout shift

#### Touch Targets
- All interactive elements: minimum 44x44px.
- [ ] **Check:** Small icons have expanded tap area
- [ ] **Check:** Close buttons (X) are easy to tap

### Micro-Interactions

#### Trust Changes
- Subtle positive feedback when trust increases.
- [ ] **Check:** Feedback is noticeable but not intrusive
- [ ] **Check:** No jarring modal or popup

#### Pattern Recognition
- Brief glow on relevant orb when choice aligns with pattern.
- [ ] **Check:** Color matches the pattern type
- [ ] **Check:** Animation completes (~300ms), doesn't loop

#### Interrupt Windows (Quick-Time Events)
- Action prompt appears during NPC speech with countdown timer (2-4s).
- [ ] **Check:** Button is clearly visible and tappable
- [ ] **Check:** Timer visual is readable
- [ ] **Check:** Missing interrupt doesn't break flow

#### Menu Interactions
- Hamburger menu (top-left) opens game menu.
- [ ] **Check:** Menu slides in smoothly
- [ ] **Check:** Backdrop dims main content
- [ ] **Check:** Tap outside closes menu

### State Indicators

#### Journal & Constellation Panels
- Shows pattern levels, skills, trust, relationship web.
- [ ] **Check:** Updates in real-time after choices
- [ ] **Check:** Expandable sections animate smoothly
- [ ] **Check:** Close button is accessible
- [ ] **Check:** Characters positioned logically in Constellation

#### Progress Indicators
- Episode/session tracking.
- [ ] **Check:** Clear indication of where player is in journey
- [ ] **Check:** No confusing numbers without context

### Error States

#### Network & Reliability
- [ ] **Check:** Graceful handling if connection drops
- [ ] **Check:** No infinite spinners
- [ ] **Check:** "Try Again" button works if component crashes
- [ ] **Check:** Game state preserved after recovery

#### Empty States
- [ ] **Check:** Helpful messaging for new players (no stats yet)
- [ ] **Check:** Clear call-to-action to start

### Accessibility

#### Color Contrast & Focus
- [ ] **Check:** WCAG AA compliance for body text on glass backgrounds
- [ ] **Check:** Interactive elements distinguishable
- [ ] **Check:** Focus order is logical and visible on all interactive elements

#### Reduced Motion
- [ ] **Check:** `prefers-reduced-motion` respected (animations instant/disabled)
- [ ] **Check:** No vestibular triggers

---

## Part 4: Anti-Patterns & Issue Reporting

### Things That Should NOT Happen
- Layout shifting when dialogue loads
- Choices appearing then repositioning
- Flash of unstyled content (FOUC)
- Text truncated without ellipsis
- Buttons too small to tap accurately
- Animations that loop infinitely
- Color/background transitions on containers
- Full-screen flashes or overlays
- Scroll position jumping unexpectedly
- Multiple spinners/loading states stacking

### Issue Reporting Schema

```json
{
  "issue_template": {
    "test_case_id": "string - e.g., CORE_002",
    "location": {
      "screen": "string - intro/dialogue/journal/etc",
      "component": "string - specific component if known",
      "url": "string - current URL"
    },
    "severity": {
      "level": "enum: blocker|major|minor|polish",
      "definitions": {
        "blocker": "Cannot progress, game broken",
        "major": "Feature not working as expected",
        "minor": "Cosmetic issue, workaround exists",
        "polish": "Nice to have improvement"
      }
    },
    "environment": {
      "viewport": { "width": "number", "height": "number" },
      "browser": "string",
      "os": "string",
      "device": "string if mobile"
    },
    "reproduction": {
      "steps": ["array of steps to reproduce"],
      "frequency": "enum: always|often|sometimes|rare"
    },
    "observed": "string - what happened",
    "expected": "string - what should have happened",
    "evidence": {
      "screenshot_url": "string - optional",
      "video_url": "string - optional",
      "console_errors": ["array of error messages"]
    }
  }
}
```

---

## Part 5: Success Criteria

### Completion Checklist

```json
{
  "completion_criteria": {
    "required": [
      { "id": "C1", "requirement": "Game loads without errors on prod URL", "suite": "core_mechanics" },
      { "id": "C2", "requirement": "Complete intro - Samuel - first character flow", "suite": "golden_paths" },
      { "id": "C3", "requirement": "Make 10+ choices without errors", "suite": "core_mechanics" },
      { "id": "C4", "requirement": "Journal opens and shows entries", "suite": "golden_paths" },
      { "id": "C5", "requirement": "Constellation opens and is interactive", "suite": "golden_paths" },
      { "id": "C6", "requirement": "Pattern orbs visually respond to choices", "suite": "core_mechanics" },
      { "id": "C7", "requirement": "Mobile viewport (375px) - no critical issues", "suite": "ui_validation" },
      { "id": "C8", "requirement": "Desktop viewport (1440px) - no critical issues", "suite": "ui_validation" },
      { "id": "C9", "requirement": "Save/continue flow works", "suite": "golden_paths" },
      { "id": "C10", "requirement": "No P0 bugs found", "suite": "all" }
    ],
    "stretch": [
      { "id": "S1", "requirement": "Complete trust journey 3-6 for any character" },
      { "id": "S2", "requirement": "Test all 7 viewport sizes" },
      { "id": "S3", "requirement": "Verify keyboard navigation works" },
      { "id": "S4", "requirement": "No P1 bugs found" }
    ]
  }
}
```

### Quick Pass Criteria
- [ ] Played through 3+ character conversations
- [ ] Opened/closed Journal and Constellation multiple times
- [ ] Observed pattern orb changes
- [ ] Triggered at least one interrupt opportunity
- [ ] Tested on mobile viewport (375px width)
- [ ] Tested on desktop viewport (1280px+ width)
- [ ] Found no blocking visual bugs
- [ ] Animations feel smooth and intentional

---

## Appendix: Character Reference

| Character | Animal | Role | Tier |
|-----------|--------|------|------|
| Samuel | Owl | Station keeper, wise mentor (Hub) | Core |
| Maya | Cat | Tech Innovator, family pressure | Core |
| Marcus | Bear | Medical Tech, healthcare | Core |
| Kai | - | Safety Specialist | Core |
| Rohan | Raven | Deep Tech, introspective | Core |
| Devon | Deer | Systems Thinker, engineering | Secondary |
| Tess | Fox | Education Founder | Secondary |
| Yaquin | Rabbit | EdTech Creator | Secondary |
| Grace | - | Healthcare Operations | Secondary |
| Elena | - | Information Science / Archivist | Secondary |
| Alex | Rat | Supply Chain & Logistics | Secondary |
| Jordan | - | Career Navigator | Secondary |
| Silas | - | Advanced Manufacturing | Extended |
| Asha | - | Conflict Resolution / Mediator | Extended |
| Lira | - | Communications / Sound Design | Extended |
| Zara | - | Data Ethics / Artist | Extended |

---

**Document Status:** Complete
**Version:** 2.0
**Next Review:** After major feature changes
