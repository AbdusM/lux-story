# Journal Side Menu Audit & Real-World Opportunities Tab

**Status:** 📋 DOCUMENTED | Pending AI Studio Implementation
**Date:** January 10, 2026
**QA:** Claude Code

---

## Implementation Scope

**AI Studio will implement:**
1. Fix badge notifications for Mastery, Cognition, Analysis
2. Add unlock hints to Toolkit
3. Create Opportunities tab

**NOT implementing (per user):**
- Hide GOD MODE from production (keep visible)
- Grey locked states for Cognition (skip item 4)

---

## Part 1: Current State Audit

### Tab Overview (9 Current Tabs)

| Tab | Icon | Data Connected | Badge Works | User Clarity | Priority Issues |
|-----|------|----------------|-------------|--------------|-----------------|
| **Harmonics** | Zap | ✅ Full | ✅ Yes | ⭐⭐⭐⭐⭐ | None |
| **Essence** | Compass | ⚠️ Partial | ✅ Yes | ⭐⭐⭐⭐ | Limited preview |
| **Mastery** | Crown | ⚠️ Partial | ❌ DISABLED | ⭐⭐⭐ | No badge, unclear unlocks |
| **Mind** | TrendingUp | ✅ Full | ✅ Yes | ⭐⭐⭐⭐ | Hardcoded mysteries |
| **Toolkit** | Cpu | ✅ Full | ✅ Yes | ⭐⭐⭐⭐⭐ | None (but unlock unclear) |
| **Simulations** | Play | ✅ Full | ✅ Yes | ⭐⭐⭐⭐ | No explanation of sims |
| **Cognition** | Brain | ⚠️ Partial | ❌ DISABLED | ⭐⭐ | Technical jargon, disconnected |
| **Analysis** | TrendingUp | ✅ Full | ❌ DISABLED | ⭐⭐⭐⭐ | Empty state unclear |
| **GOD MODE** | AlertTriangle | ✅ Direct | N/A | ⭐⭐⭐⭐ | Exposed to all (keep for now) |

---

## Part 2: Implementation Requirements

### Task 1: Fix Disabled Badge Notifications

**File:** `components/Journal.tsx`

Three tabs have hardcoded `hasNew: false`:
- Mastery (abilities/achievements)
- Cognition (cognitive domains)
- Analysis (journey insights)

**Fix:** Wire badges to actual state changes:
```typescript
// Mastery: badge when new abilities unlock
const hasNewAbilities = unlockedAbilities.length > previousAbilitiesCount

// Cognition: badge when domain levels up
const hasNewDomainProgress = domains.some(d => d.recentlyLeveledUp)

// Analysis: badge when new insights available
const hasNewInsights = playerAnalysis.hasNewRecommendations
```

### Task 2: Improve Toolkit (AI Tools) Clarity

**File:** `components/ToolkitView.tsx`

**Issue:** Users don't know WHEN/HOW tools unlock.

**Add to locked tools:**
```tsx
{/* Unlock hint for locked tools */}
{!isUnlocked && (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs">
      <span>Progress: {currentLevel}/{requiredLevel}</span>
      <span>{remainingChoices} more {pattern} choices</span>
    </div>
    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500/50" style={{ width: `${progress}%` }} />
    </div>
  </div>
)}
```

### Task 3: Create Opportunities Tab

**New File:** `components/journal/OpportunitiesView.tsx`

**Data Source:** `/content/birmingham-opportunities.ts` (already exists with 25+ opportunities)

**Unlock Conditions:**
| Condition | Unlocks |
|-----------|---------|
| Pattern >= 3 in any | Opportunities matching that pattern |

**UI Design:**
```
┌─────────────────────────────────────────┐
│ 🏢 OPPORTUNITIES                        │
│ Unlocked: X / Total                     │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🏥 UAB Medical Shadow        ✓      │ │
│ │ Healthcare • Job Shadow             │ │
│ │ 8 hours • Birmingham                │ │
│ │ Unlocked via: Helping pattern       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⚡ Regions FinTech [GREYED OUT]     │ │
│ │ Technology • Internship             │ │
│ │ 🔒 Unlock: analytical level 3       │ │
│ │ ░░░░░░░░░░░░ 60% (1 more choice)    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Integration Points:**
1. Add tab to Journal.tsx tabs array with Building2 icon
2. Add TabId type for 'opportunities'
3. Add badge indicator (when pattern >= 3)
4. Render OpportunitiesView in content area

---

## Part 3: Files to Modify

| File | Changes |
|------|---------|
| `components/Journal.tsx` | Add Opportunities tab, fix badge notifications |
| `components/ToolkitView.tsx` | Add unlock progress hints |
| `components/journal/OpportunitiesView.tsx` | NEW - Real-world opportunities tab |

---

## Part 4: Verification (QA by Claude)

After AI Studio implementation:
```bash
npm run type-check
npm test
```

**Manual Testing:**
1. Badge notifications appear for Mastery when abilities unlock
2. Badge notifications appear for Cognition on activity
3. Badge notifications appear for Analysis when data available
4. Toolkit shows progress toward unlocking locked tools
5. Opportunities tab appears in Journal
6. Locked opportunities show progress to unlock
7. Unlocked opportunities expand with details

---

## Part 5: FUTURE PRD GAPS (Documented Only)

### Critical Gaps (Not Implementing Now)
1. **Accessibility** - ARIA roles, keyboard navigation, focus indicators
2. **Analytics/Tracking** - Tab interaction instrumentation
3. **Admin Dashboard** - Journal data for educators/parents

### High Priority Gaps (Not Implementing Now)
4. **Mobile Tab Overflow** - Scroll indicator for 10 tabs
5. **Empty States** - Consistent messaging across tabs
6. **Onboarding** - First-time Journal welcome

### Medium Priority Gaps (Not Implementing Now)
7. **Data Persistence** - Persist viewed tabs across sessions
8. **Success Metrics** - KPIs for feature measurement

---

## Part 6: Design Decisions

### GOD MODE
**Decision:** Keep visible to all players (not gated to development)

### Cognition Tab
**Decision:** Keep current language, skip grey locked states for now

### Opportunities Tab
**Decision:** Always visible. Locked items greyed with unlock progress.

### External Links
**Decision:** No external linking. Show details only.
