# Lux Story: Text Game UX Development Plan

## Executive Summary

This plan systematically addresses insights from Roadwarden UI/UX research and mobile/browser design principles, mapped against Lux Story's current implementation. Organized into **4 tiers**: Critical (must-have), High Priority (should-have), Enhancement (nice-to-have), and Future Considerations.

**Current Implementation Grade: B+**
- Strong: Touch targets, fixed layout, warm aesthetics, mobile-first mindset
- Gaps: Line length constraints, speaker labels, accessibility audit, progress visualization

---

## Tier 1: CRITICAL (Immediate Impact)

### 1.1 Line Length Constraints — `max-width: 70ch`

**Research Insight**: "45-75 characters per line (66 is the sweet spot)" — Bringhurst, WCAG
**Current State**: NO character-width constraints applied. Text flows to container width.
**Impact**: Eye strain on wide screens, poor reading rhythm

**Implementation**:

```tsx
// components/DialogueDisplay.tsx - Line 109-119
// ADD prose container with character width constraint

return (
  <div
    className={cn(
      "space-y-4 min-h-[120px]",
      "max-w-prose", // ~65ch - Tailwind's prose width
      className
    )}
    key="dialogue-chunks-container"
    style={{ transition: 'none' }}
  >
    {/* content */}
  </div>
)
```

**Or more precise CSS**:
```css
/* app/globals.css */
.prose-width {
  max-width: 70ch;
}

/* Mobile override - allow narrower for small screens */
@media (max-width: 640px) {
  .prose-width {
    max-width: 100%; /* Let container handle it */
  }
}
```

**Files to Modify**:
- `components/DialogueDisplay.tsx:109-119`
- `components/RichTextRenderer.tsx` (wrapper element)
- `app/globals.css` (utility class)

**Verification**: Visual inspection on 1920px+ screens, text should not exceed ~70 characters per line.

---

### 1.2 Speaker Labels with Visual Differentiation

**Research Insight**: "A Steam reviewer compared Roadwarden unfavorably to Disco Elysium: 'I can't really remember people/character's name very quickly, but I don't need to remember those if the game give me name of the character in a dialogue, and color code it.'"
**Current State**: Speaker name exists but NO persistent label above dialogue text. Color differentiation exists in `StoryMessage.tsx` but NOT in main `DialogueDisplay.tsx` flow.
**Impact**: Roadwarden's #1 player complaint

**Implementation**:

```tsx
// components/DialogueDisplay.tsx - Add speaker label

// Character color map (subset - align with existing characterStyles in StoryMessage.tsx)
const SPEAKER_COLORS: Record<string, string> = {
  'Samuel': 'text-amber-700 dark:text-amber-400',
  'Maya': 'text-blue-600 dark:text-blue-400',
  'Devon': 'text-orange-600 dark:text-orange-400',
  'Jordan': 'text-purple-600 dark:text-purple-400',
  'Kai': 'text-teal-600 dark:text-teal-400',
  'Tess': 'text-rose-600 dark:text-rose-400',
  'Rohan': 'text-indigo-600 dark:text-indigo-400',
  'Silas': 'text-slate-600 dark:text-slate-400',
  'Yaquin': 'text-emerald-600 dark:text-emerald-400',
  'Narrator': 'text-stone-500 dark:text-stone-400 italic',
  'You': 'text-stone-700 dark:text-stone-300',
}

// Inside DialogueDisplay component, before content:
{characterName && !isContinuedSpeaker && (
  <div className="mb-2 flex items-center gap-2">
    <span className={cn(
      "text-sm font-semibold uppercase tracking-wider",
      SPEAKER_COLORS[characterName] || 'text-stone-600'
    )}>
      {characterName}
    </span>
  </div>
)}
```

**Files to Modify**:
- `components/DialogueDisplay.tsx` (add speaker label)
- `lib/voice-utils.ts` (centralize color map if needed)

**Verification**: Each dialogue chunk should display speaker name with character-specific color.

---

### 1.3 Contrast Ratio Audit — WCAG 4.5:1 Minimum

**Research Insight**: "WCAG contrast ratios apply regardless of mode: 4.5:1 minimum for normal text"
**Current State**: Using `text-stone-800` on `bg-amber-50/40` — needs verification
**Impact**: Accessibility compliance, readability

**Audit Checklist**:

| Element | Foreground | Background | Expected Ratio | Status |
|---------|------------|------------|----------------|--------|
| Dialogue text | stone-800 (#292524) | amber-50/40 (~#fffbeb66) | 4.5:1+ | VERIFY |
| Narrator text | stone-600 (#57534e) | amber-50/40 | 4.5:1+ | VERIFY |
| Choice buttons | stone-700 (#44403c) | white/80 | 4.5:1+ | VERIFY |
| Header text | slate-700 (#334155) | stone-50/95 | 4.5:1+ | VERIFY |
| Trust labels | varies | stone-50 | 3:1+ (large text) | VERIFY |

**Tools**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools Accessibility panel

**Implementation**: Create script to audit all color combinations:

```bash
# Create audit script
npx create-next-app@latest --example with-tailwindcss contrast-audit
# Or use existing: npx @axe-core/cli http://localhost:3000
```

**Files to Modify**:
- `lib/voice-utils.ts` (adjust colors if failing)
- `app/globals.css` (CSS variable overrides)
- `tailwind.config.ts` (color definitions)

---

### 1.4 Line Height Verification — 1.5× Minimum

**Research Insight**: "Line height requirements: WCAG minimum: 1.5× (150%)"
**Current State**: `leading-relaxed` (1.625) in DialogueDisplay — GOOD
**BUT**: Verify all text areas

**Audit Locations**:

| Component | Current | Required | Status |
|-----------|---------|----------|--------|
| DialogueDisplay | `leading-relaxed` (1.625) | 1.5+ | ✓ PASS |
| GameChoices button | `leading-relaxed` | 1.5+ | ✓ PASS |
| StoryMessage | `leading-[1.7]` | 1.5+ | ✓ PASS |
| RichTextRenderer | inherits | 1.5+ | VERIFY |
| ExperienceSummary | varies | 1.5+ | VERIFY |

**Files to Audit**:
- `components/ExperienceSummary.tsx`
- `components/ThoughtCabinet.tsx`
- `components/ActionPlanBuilder.tsx`
- `components/FrameworkInsights.tsx`

---

## Tier 2: HIGH PRIORITY (Strong Impact)

### 2.1 Font Size Scaling — System Preferences Support

**Research Insight**: "Apple HIG: 17pt for body text. System font scaling support (Dynamic Type on iOS)"
**Current State**: Fixed `text-base` (16px) — does NOT respect system font scaling
**Impact**: Accessibility for vision-impaired users

**Implementation**:

```css
/* app/globals.css - Add at root level */

/* Respect user's font size preferences */
html {
  /* Base size that respects browser settings */
  font-size: 100%; /* 16px default, scales with browser zoom */
}

/* Use rem units throughout for proper scaling */
body {
  font-size: 1rem; /* Inherits from html */
  line-height: 1.5;
}

/* iOS Dynamic Type support */
@supports (font: -apple-system-body) {
  body {
    font: -apple-system-body;
  }
}

/* Ensure text scales properly - WCAG 1.4.4 */
/* Text must be resizable up to 200% without loss of content */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

**Verification**:
1. Change browser font size to 150%
2. Test iOS with Dynamic Type set to largest
3. Verify no text overflow or clipping

---

### 2.2 Touch Target Spacing Audit

**Research Insight**: "Add 8dp spacing between adjacent touch targets to prevent accidental taps"
**Current State**: `gap-3` (12px) in GameChoices — GOOD
**BUT**: Verify all interactive elements

**Audit Checklist**:

| Component | Element | Current Size | Current Gap | Status |
|-----------|---------|--------------|-------------|--------|
| GameChoices | Choice button | 56px×auto | 12px | ✓ PASS |
| Header | Nav buttons | ~40px | 8px+ | VERIFY |
| ExperienceSummary | Action buttons | 48px | varies | VERIFY |
| ThoughtCabinet | List items | varies | varies | VERIFY |

**Files to Audit**:
- `components/StatefulGameInterface.tsx:459-487` (header buttons)
- `components/ExperienceSummary.tsx:186-222` (action buttons)

---

### 2.3 Scroll vs. Confirm Input Separation

**Research Insight**: "Same input for scrolling and confirming (causes accidental selections)" — Switch port failure
**Current State**: Scrollable choices container with clickable buttons inside
**Risk**: On mobile, scroll gesture could accidentally trigger button

**Implementation**:

```tsx
// components/GameChoices.tsx - Add scroll padding and touch delay

<div
  className="max-h-[40vh] overflow-y-auto overscroll-contain"
  style={{
    WebkitOverflowScrolling: 'touch',
    // Prevent accidental taps during scroll
    touchAction: 'pan-y',
  }}
>
  {/* Choice buttons with deliberate tap handling */}
  <Button
    onClick={() => onChoice(choice)}
    // Prevent click if user was scrolling
    onTouchStart={(e) => {
      e.currentTarget.dataset.touchStart = String(Date.now())
    }}
    onTouchEnd={(e) => {
      const start = Number(e.currentTarget.dataset.touchStart || 0)
      const elapsed = Date.now() - start
      // If touch was too quick (scroll momentum), ignore
      if (elapsed < 100) {
        e.preventDefault()
      }
    }}
  >
```

**Alternative (CSS-only)**:
```css
/* Choices container */
.choices-scroll-container {
  overscroll-behavior: contain;
  scroll-snap-type: y proximity;
}

.choice-button {
  scroll-snap-align: start;
  /* Prevent tap during scroll momentum */
  pointer-events: auto;
}
```

---

### 2.4 Notification/Feedback Proximity

**Research Insight**: "Original notifications appeared 'too far away from the most relevant part of the screen' and were 'simply ignored by a focused eye.'"
**Current State**: `NarrativeFeedback` is an overlay — position unclear
**Impact**: Skill toasts may be missed

**Audit**:
- Check `components/NarrativeFeedback.tsx` positioning
- Should appear near choice area or dialogue, not corners

**Implementation**:
```tsx
// Position feedback near the action area, not edges
<div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
  {/* Notification content - centered above choices */}
</div>
```

---

## Tier 3: ENHANCEMENTS (Nice-to-Have)

### 3.1 Progressive Disclosure — Contextual UI

**Research Insight**: "Showing attitude icons and class skills only when relevant reduces visual noise"
**Current State**: Header always shows full character info
**Opportunity**: Collapse non-essential info during active reading

**Implementation Ideas**:
- Auto-hide header during scroll (like Medium.com)
- Show trust level only on change
- Collapse character details on mobile, expand on tap

---

### 3.2 Automatic Journaling System

**Research Insight**: "The automatic recording of conversation details removes memorization burden"
**Current State**: No journal/notes system
**Scope**: FUTURE FEATURE — significant development effort

**Minimal Implementation**:
```tsx
// lib/journal-system.ts
interface JournalEntry {
  timestamp: Date
  characterId: string
  nodeId: string
  keyInsight: string // Auto-extracted from dialogue
  userChoice: string
}

// Auto-record on each choice
function recordJournalEntry(choice: EvaluatedChoice, context: DialogueContent) {
  // Extract key terms from dialogue
  // Store in localStorage/Supabase
}
```

---

### 3.3 Visual Progress Representation

**Research Insight**: "Map as core interface... became 'the heart and soul of the game'" (Sorcery!)
**Current State**: Character selection exists, no journey visualization
**Opportunity**: Show visited characters, relationship arcs

**Minimal Implementation**:
- Add "Journey Map" view to `/student/insights`
- Show character icons with trust levels
- Visualize paths taken vs. available

---

### 3.4 Conversational Pacing — Frequent Small Choices

**Research Insight**: "Conversational rhythm over text walls... sequences ('Approach the guy. Go closer. Talk to him.')"
**Current State**: Dialogue content varies in length
**Audit**: Review dialogue graphs for text wall patterns

**Content Guidelines**:
- No single dialogue chunk > 150 words
- Every 2-3 dialogue nodes should have choice
- Use `|` separator for natural pauses

---

## Tier 4: FUTURE CONSIDERATIONS

### 4.1 Screen Reader Compatibility

**Research Insight**: "Aureus stated directly: 'Roadwarden is not optimized to support players who use text-to-speech hardware'"
**Current State**: Unknown — needs full audit
**Scope**: Significant effort

**Audit Requirements**:
- Test with VoiceOver (iOS/macOS)
- Test with NVDA (Windows)
- Ensure all interactive elements have ARIA labels
- Verify focus management on route changes

---

### 4.2 Dyslexia-Friendly Mode

**Research Insight**: "Sans-serif fonts, 12-14pt minimum, 1.5× line spacing, left-aligned text, avoid italics and ALL CAPS, cream backgrounds"
**Current State**: Space Mono (monospace) — neutral for dyslexia
**Opportunity**: Optional OpenDyslexic font, increased spacing toggle

---

### 4.3 Dark Mode Implementation

**Research Insight**: "Avoid pure white (#FFFFFF) on pure black (#000000). Use off-white text (#FAFAFA) on dark gray (#1E1E1E)"
**Current State**: Light mode only with `dark:` variants defined but unused
**Implementation**: Enable system preference detection

```tsx
// app/layout.tsx
<html className="dark:bg-stone-900">
  <body className="dark:text-stone-100">
```

---

## Implementation Priority Matrix

| Task | Impact | Effort | Priority |
|------|--------|--------|----------|
| 1.1 Line Length (70ch) | High | Low | **DO FIRST** |
| 1.2 Speaker Labels | High | Low | **DO FIRST** |
| 1.3 Contrast Audit | High | Medium | **DO SECOND** |
| 1.4 Line Height Verify | Medium | Low | **DO SECOND** |
| 2.1 Font Scaling | High | Medium | **SPRINT 2** |
| 2.2 Touch Target Audit | Medium | Low | **SPRINT 2** |
| 2.3 Scroll/Confirm Fix | Medium | Medium | **SPRINT 2** |
| 2.4 Feedback Position | Medium | Low | **SPRINT 2** |
| 3.1 Progressive Disclosure | Low | Medium | BACKLOG |
| 3.2 Journal System | Medium | High | BACKLOG |
| 3.3 Progress Map | Medium | High | BACKLOG |
| 3.4 Pacing Audit | Medium | Medium | BACKLOG |
| 4.1 Screen Reader | High | High | FUTURE |
| 4.2 Dyslexia Mode | Medium | Medium | FUTURE |
| 4.3 Dark Mode | Low | Medium | FUTURE |

---

## Verification Protocol

### Automated Tests

```typescript
// tests/e2e/ux-compliance.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Text Game UX Compliance', () => {
  test('line length does not exceed 75 characters', async ({ page }) => {
    await page.goto('/play')
    const dialogueText = await page.locator('[data-testid="dialogue-content"]')
    const width = await dialogueText.evaluate(el => {
      const style = window.getComputedStyle(el)
      return parseFloat(style.maxWidth)
    })
    // 75ch ≈ 600px at 16px base
    expect(width).toBeLessThanOrEqual(700)
  })

  test('touch targets are minimum 44x44px', async ({ page }) => {
    await page.goto('/play')
    const buttons = await page.locator('[data-testid="choice-button"]').all()
    for (const button of buttons) {
      const box = await button.boundingBox()
      expect(box?.height).toBeGreaterThanOrEqual(44)
    }
  })

  test('speaker labels are visible', async ({ page }) => {
    await page.goto('/play')
    await page.click('[data-testid="choice-button"]') // Make choice
    const speaker = await page.locator('[data-testid="speaker-label"]')
    await expect(speaker).toBeVisible()
  })
})
```

### Manual Testing Checklist

- [ ] Text readable at 200% browser zoom
- [ ] No horizontal scroll at 320px viewport
- [ ] All colors pass WCAG 4.5:1 contrast
- [ ] Touch targets accessible with thumb
- [ ] Speaker always identifiable
- [ ] No accidental selections during scroll

---

## Appendix: Research Source Mapping

| Principle | Source | Lux Story Status |
|-----------|--------|------------------|
| 45-75ch line length | Bringhurst, WCAG | ❌ NOT IMPLEMENTED |
| 44×44px touch targets | Apple HIG, Android MD | ✓ IMPLEMENTED |
| 1.5× line height | WCAG 2.1 | ✓ IMPLEMENTED |
| Speaker labels | Roadwarden player feedback | ❌ NOT IMPLEMENTED |
| Warm paper aesthetic | Kindle, A Dark Room | ✓ IMPLEMENTED |
| Fixed header/footer | Claude, ChatGPT pattern | ✓ IMPLEMENTED |
| Progressive disclosure | Roadwarden dev postmortem | ⚠️ PARTIAL |
| Notification proximity | Roadwarden dev postmortem | ⚠️ NEEDS AUDIT |
| Font scaling support | iOS Dynamic Type | ❌ NOT IMPLEMENTED |
| Scroll/confirm separation | Switch port failure analysis | ⚠️ NEEDS VERIFICATION |

---

*Document Version: 1.0*
*Created: 2025-11-28*
*Based on: Roadwarden UI/UX Research & Mobile Design Principles*
