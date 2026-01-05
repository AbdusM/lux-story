# UI Flows Audit: Non-Narrative Elements

**Generated:** December 2024
**Last Updated:** December 2024 (post-cleanup)
**Purpose:** Comprehensive audit of all UI elements that exist outside the main narrative dialogue flow.

---

## Executive Summary

| Category | Active | Admin-Only |
|----------|--------|------------|
| Slide-over Panels | 2 | 0 |
| Full-screen Modals | 2 | 4 |
| Bottom Sheets | 1 | 0 |
| Toasts/Notifications | 0 | 0 |
| Fixed UI Elements | 2 | 0 |
| **TOTAL** | **7** | **4** |

### Recent Cleanup (Dec 2024)
**Deleted 8 unused components:**
- `CharacterTransition.tsx` - never imported
- `PlatformAnnouncement.tsx` - never imported (SessionBoundaryAnnouncement used instead)
- `ThoughtCabinet.tsx` - orphaned (button removed, unreachable)
- `NarrativeFeedback.tsx` - never wired
- `SkillToast.tsx` - disabled as intrusive
- `CareerReflectionHelper.tsx` - never wired
- `OnboardingScreen.tsx` - replaced with discovery learning (Samuel teaches via dialogue)
- `ProgressToast.tsx` - replaced with Journal button glow effect

---

## Z-Index Hierarchy

```
z-[200]  UnlockCelebration (celebration overlay)
z-[120]  DetailModal (bottom sheet content)
z-[110]  DetailModal backdrop
z-[100]  Side panels (Journal, Constellation)
z-[90]   Side panel backdrops
z-60     FrameworkInsights, ActionPlanBuilder (nested modals)
z-50     Primary modals (JourneySummary, Error)
z-10     Fixed header
```

---

## Active UI Elements (7 Total)

### Slide-Over Panels (2)

#### 1. Journal Panel
- **File:** `components/Journal.tsx`
- **Position:** Slides from LEFT
- **z-index:** z-[100] (panel), z-[90] (backdrop)
- **Trigger:** Click BookOpen icon in header
- **Dismissal:** Swipe left, ESC key, backdrop click
- **Contains:** 4 tabs (Orbs, Style, Bonds, Insights)
- **Purpose:** Player progress, patterns, relationships

#### 2. ConstellationPanel
- **File:** `components/constellation/ConstellationPanel.tsx`
- **Position:** Slides from RIGHT
- **z-index:** z-[100] (panel), z-[90] (backdrop)
- **Trigger:** Click Stars icon in header
- **Dismissal:** Swipe right, ESC key, backdrop click
- **Contains:** 2 tabs (People, Skills)
- **Purpose:** Character relationships, skill demonstrations

---

### Full-Screen Modals (2 Active)

#### 3. JourneySummary
- **File:** `components/JourneySummary.tsx`
- **Position:** `fixed inset-0 z-50`
- **Backdrop:** `bg-black/60 backdrop-blur-sm`
- **Trigger:** Click "See Your Journey" at ending
- **Dismissal:** Close button, ESC key
- **Contains:** 6 paginated sections (Opening->Closing)
- **Purpose:** Samuel's personalized narrative summary

#### 5. Error Display
- **File:** `components/StatefulGameInterface.tsx`
- **Position:** `fixed inset-0 z-50`
- **Backdrop:** `bg-black/40 backdrop-blur-sm`
- **Trigger:** `state.error` is set
- **Dismissal:** "Refresh Page" or "Dismiss" buttons
- **Contains:** Error title, message, action buttons
- **Purpose:** Error recovery

---

### Bottom Sheet Modal (1)

#### 6. DetailModal
- **File:** `components/constellation/DetailModal.tsx`
- **Position:** `fixed bottom-0 z-[120]`
- **Backdrop:** `bg-black/60` at z-[110]
- **Max Height:** 50vh (mobile), 60vh (desktop)
- **Trigger:** Tap character/skill in ConstellationPanel
- **Dismissal:** Swipe down, backdrop click, ESC key
- **Contains:** Character or skill detail view
- **Purpose:** Detailed info without leaving constellation

---

### Toasts & Notifications (0 Active)

*ProgressToast removed - replaced by Journal button glow effect when orbs earned.*

---

### Fixed UI Elements (2)

#### 7. Fixed Header
- **File:** `components/StatefulGameInterface.tsx`
- **Position:** Sticky top, z-10
- **Contains:** Title, character info, trust level, action buttons
- **Purpose:** Navigation and status

#### 8. Fixed Choices Panel
- **File:** `components/StatefulGameInterface.tsx`
- **Position:** Fixed bottom
- **Contains:** GameChoices component
- **Purpose:** Player agency

*Configuration Warning Banner removed - Samuel mentions local mode once via dialogue echo.*

---

### Inline Narrative Elements (Not counted as separate UI)

#### SessionBoundaryAnnouncement
- **File:** `components/SessionBoundaryAnnouncement.tsx`
- **Position:** Inline within dialogue card
- **Trigger:** Every 8-12 nodes (session boundary)
- **Contains:** Atmospheric text + "[Continue]" button
- **Purpose:** Natural pause points
- **Note:** Intentionally NOT a modal - maintains narrative immersion

---

## Admin-Only UI Elements (4)

| Element | File | Purpose |
|---------|------|---------|
| ChoiceReviewPanel | `ChoiceReviewPanel.tsx` | Review AI-generated choices |
| FrameworkInsights | `FrameworkInsights.tsx` | Research framework explanations |
| ActionPlanBuilder | `ActionPlanBuilder.tsx` | Goal building interface |
| FutureSkillsSupport | `FutureSkillsSupport.tsx` | 2030 skills guidance |

---

## Retained But Disabled (Types Still Used)

| Element | File | Reason |
|---------|------|--------|
| ExperienceSummary | `ExperienceSummary.tsx` | Types imported by arc-learning-objectives.ts |
| ShareResultCard | `ShareResultCard.tsx` | May be enabled for social features |

---

## UI Patterns Used

### Backdrop Pattern
All modals use semi-transparent black with optional blur:
- Panels: `bg-black/40 backdrop-blur-sm`
- Modals: `bg-black/60-70 backdrop-blur-sm`

### Dismissal Patterns
| Pattern | Components |
|---------|------------|
| ESC key | All major modals |
| Backdrop click | Most modals |
| Swipe gestures | Side panels, bottom sheets |
| Close button (X) | All modals (44px touch target) |
| Auto-dismiss | Toasts |

### Animation Library
- Framer Motion's `AnimatePresence` for enter/exit
- `motion.div` for all animated containers
- Spring physics for swipe gestures

### Mobile Optimization
- Safe area insets: `env(safe-area-inset-bottom)`
- Touch targets: min-w/h-[44px]
- Responsive sizing: `text-xs sm:text-sm`
- Compact spacing: `p-2 sm:p-4`

---

## Files Reference

### Primary Controller
- `components/StatefulGameInterface.tsx`

### Panel Components
- `components/Journal.tsx`
- `components/constellation/ConstellationPanel.tsx`
- `components/constellation/DetailModal.tsx`

### Modal Components
- `components/OnboardingScreen.tsx`
- `components/JourneySummary.tsx`
- `components/FrameworkInsights.tsx`
- `components/ActionPlanBuilder.tsx`

### Toast Components
- `components/ProgressToast.tsx`

### Inline Narrative
- `components/SessionBoundaryAnnouncement.tsx`

### Other (Admin/Future)
- `components/ShareResultCard.tsx`
- `components/FutureSkillsSupport.tsx`
- `components/ChoiceReviewPanel.tsx`
- `components/constellation/UnlockCelebration.tsx`
- `components/ExperienceSummary.tsx` (types only)

---

## Completed Improvements

### OnboardingScreen -> Discovery Learning ✓ DONE
Converted upfront tutorial modal to discovery-based learning:
1. ✓ Removed OnboardingScreen modal
2. ✓ Player earns first orb → sees ProgressToast
3. ✓ Samuel teaches patterns via milestone echo dialogue
4. ✓ Player discovers patterns in Journal through gameplay

This aligns with design principle: "Show, Don't Tell"
