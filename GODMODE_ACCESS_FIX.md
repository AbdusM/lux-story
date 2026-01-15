# God Mode Access Control Fix

## Problem
God Mode tab in Journal is exposed to ALL users in production, allowing anyone to bypass normal game progression.

## Solution: Hide Tab in Production

### File: `components/Journal.tsx`

**Before (Line 113-124):**
```typescript
const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: 'harmonics', label: 'Harmonics', icon: Zap },
  { id: 'essence', label: 'Essence', icon: Compass },
  { id: 'mastery', label: 'Mastery', icon: Crown },
  { id: 'opportunities', label: 'Opportunities', icon: Building2 },
  { id: 'mind', label: 'Mind', icon: TrendingUp },
  { id: 'toolkit', label: 'Toolkit', icon: Cpu },
  { id: 'simulations', label: 'Sims', icon: Play },
  { id: 'cognition', label: 'Cognition', icon: Brain },
  { id: 'analysis', label: 'Analysis', icon: TrendingUp },
  { id: 'god_mode', label: 'GOD MODE', icon: AlertTriangle }, // ISP: Exposed for testing
]
```

**After (Add environment check):**
```typescript
const baseTabs: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: 'harmonics', label: 'Harmonics', icon: Zap },
  { id: 'essence', label: 'Essence', icon: Compass },
  { id: 'mastery', label: 'Mastery', icon: Crown },
  { id: 'opportunities', label: 'Opportunities', icon: Building2 },
  { id: 'mind', label: 'Mind', icon: TrendingUp },
  { id: 'toolkit', label: 'Toolkit', icon: Cpu },
  { id: 'simulations', label: 'Sims', icon: Play },
  { id: 'cognition', label: 'Cognition', icon: Brain },
  { id: 'analysis', label: 'Analysis', icon: TrendingUp },
]

// Only show God Mode tab in development
const tabs = process.env.NODE_ENV === 'development'
  ? [...baseTabs, { id: 'god_mode', label: 'GOD MODE', icon: AlertTriangle }]
  : baseTabs
```

**Impact:**
✅ Production users cannot access God Mode tab
✅ Developers still have full access locally
✅ Automated tests can still use `window.godMode` API
✅ No breaking changes

---

## Alternative: Password-Protected Access

If you want QA testers to access God Mode in production:

```typescript
const tabs = (() => {
  const base = [
    { id: 'harmonics', label: 'Harmonics', icon: Zap },
    // ... other tabs ...
  ]

  // Allow God Mode with special URL parameter
  if (process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && window.location.search.includes('godmode=true'))) {
    base.push({ id: 'god_mode', label: 'GOD MODE', icon: AlertTriangle })
  }

  return base
})()
```

Then QA testers can access via: `https://lux-story.vercel.app/?godmode=true`

---

## God Mode Purpose Summary

| Feature | Purpose | Access |
|---------|---------|--------|
| **Browser Console API** | Developer testing, visual tests | Dev only ✅ |
| **God Mode Journal Tab** | Quick simulation access | **Currently: Everyone** ❌ |
| **Recommended** | Developer testing, visual tests | **Dev only** ✅ |

---

## Implementation Time: 2 minutes

