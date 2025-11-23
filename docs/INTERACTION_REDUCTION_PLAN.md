# Interaction Tag Reduction Plan

## Current Status: ⚠️ OVERUSE

**Total Interaction Tags**: 127 across 106 nodes (119.8% coverage)
- Marcus: 56 interactions (112% of nodes)
- Tess: 43 interactions (153.6% of nodes)
- Yaquin: 28 interactions (100% of nodes)

**Problem**: Interactions are being applied to nearly EVERY node, which dilutes their impact.

---

## Strategic Principle

**Interactions should be RARE and MEMORABLE.**

When players see `shake`, `bloom`, or `jitter` on every other node, these animations become:
- ❌ **Expected** instead of **surprising**
- ❌ **Routine** instead of **impactful**
- ❌ **Background noise** instead of **emotional punctuation**

---

## Target: 30-40% Coverage

**Goal**: 30-40 total interactions across 106 nodes (not 127)

**Breakdown by Arc**:
- Marcus (50 nodes): **15-20 interactions** (currently 56 ❌)
- Tess (28 nodes): **8-11 interactions** (currently 43 ❌)
- Yaquin (28 nodes): **8-11 interactions** (currently 28 ✅)

---

## Strategic Use Cases (Keep These)

### shake (Critical Urgency Only)
**Use For**: Life-or-death moments, critical alarms, major crises
**Marcus Example**: `marcus_the_bubble` - "AIR IN LINE" alarm
**Frequency**: 3-5× per arc maximum
**Current**: Too frequent - reduce 50%

### bloom (Major Breakthroughs Only)
**Use For**: Character's biggest "aha!" moments, paradigm shifts
**Tess Example**: Grant approval realization
**Frequency**: 2-4× per arc maximum
**Current**: Too frequent - reduce 60%

### small (Vulnerability Reveals Only)
**Use For**: Moments of defeat, imposter syndrome, deep vulnerability
**Marcus Example**: Regret about patient death
**Frequency**: 2-4× per arc maximum
**Current**: Appropriate usage

### big (Climactic Triumph Only)
**Use For**: Arc's biggest win, major achievement celebration
**Example**: Launch success, patient saved, grant approved
**Frequency**: 1-2× per arc maximum
**Current**: Good usage

---

## Remove/Reduce These

### nod (Overused)
**Current Problem**: Used for every affirmation/agreement
**Better**: Let emotion tags handle thinking states
**Keep Only**: 1-2 key mentor/wisdom moments per arc
**Reduction**: Remove 80% of nod usage

### jitter (Overused)
**Current Problem**: Used for any nervousness
**Better**: Save for pre-climactic anxiety only
**Keep Only**: 1-2 major anxiety moments (before big decision)
**Reduction**: Remove 70% of jitter usage

### ripple (Rarely Needed)
**Current Problem**: Unclear when to use vs. bloom
**Better**: Reserve for very specific feedback moments
**Keep Only**: 0-1× per arc
**Reduction**: Remove 90% of ripple usage

---

## Reduction Strategy

### Phase 1: Audit Current Usage
```bash
npx tsx scripts/audit-interaction-usage.ts
```

### Phase 2: Identify "Must-Keep" Moments

**For Each Arc, Keep Interactions Only For**:
1. **Opening Hook** (1× - establish tone)
2. **Crisis Moment** (1-2× shake - urgent danger)
3. **Major Breakthrough** (1-2× bloom - paradigm shift)
4. **Vulnerability Reveal** (1-2× small - deep emotional moment)
5. **Climactic Win** (1× big - arc's biggest triumph)

**Total Per Arc**: 5-8 interactions (not 30-50)

### Phase 3: Remove Interactions From

❌ Routine dialogue (no animation needed)
❌ Minor affirmations (nod everywhere)
❌ Small nervousness (jitter everywhere)
❌ Every realization (bloom everywhere)
❌ Generic emphasis (shake for non-urgent moments)

**Rule**: If removing the interaction doesn't hurt the scene, REMOVE IT.

---

## Implementation Guide

### Step 1: Create Backup
```bash
git checkout -b refactor/reduce-interactions
cp content/marcus-dialogue-graph.ts content/marcus-dialogue-graph.backup.ts
```

### Step 2: For Each Node, Ask

1. **Is this a KEY emotional/dramatic moment?**
   - NO → Remove interaction
   - YES → Keep, verify it's the RIGHT interaction

2. **Would this scene work WITHOUT the interaction?**
   - YES → Remove interaction (emotion tag is enough)
   - NO → Keep interaction

3. **How many interactions in the last 5 nodes?**
   - 3+ → Remove this one (too frequent)
   - 0-2 → Can keep if truly impactful

### Step 3: Test Impact

After reducing, play through the arc:
- Do the remaining interactions feel SPECIAL?
- Are you surprised when they happen?
- Do they enhance key moments WITHOUT feeling routine?

---

## Example: Marcus Arc Reduction

### Current: 56 interactions (TOO MANY)

**Keep These 15-20**:
1. `marcus_introduction` - `shake` (establishes urgency)
2. `marcus_the_bubble` - `shake` (CRITICAL alarm moment)
3. `marcus_crisis_decision` - `jitter` (life-or-death choice anxiety)
4. `marcus_patient_saved` - `big` (climactic success)
5. `marcus_regret` - `small` (vulnerability about past failure)
6. `marcus_biomed_realization` - `bloom` (career paradigm shift)
7. ... 9-14 more KEY moments only

**Remove from** (~36-41 nodes):
- All routine `nod` affirmations (keep 1-2 max)
- Most `jitter` nervous moments (keep 1-2 max)
- Generic `shake` emphasis (keep only TRUE emergencies)
- Routine `bloom` insights (keep only MAJOR breakthroughs)

**Result**: 15-20 interactions (30-40% coverage) - each one MEMORABLE

---

## Benefits of Reduction

✅ **Increased Impact**: Remaining interactions feel SPECIAL
✅ **Better Performance**: Fewer animations = smoother experience
✅ **Clearer Intent**: Interactions mark TRULY important moments
✅ **Player Attention**: Animations grab focus when they SHOULD
✅ **Easier Maintenance**: Less to test, less to break

---

## Rollout Plan

**Not Required for Current PR** ✅
- Current refactor focuses on text compression + visual systems
- Interaction reduction can be a FOLLOW-UP task

**Future Sprint**:
1. Create `refactor/reduce-interactions` branch
2. Apply reduction strategy to Marcus (pilot)
3. Playtest to verify impact improvement
4. Apply to Tess and Yaquin
5. Document lessons learned
6. Merge after testing

---

## Key Takeaway

**"If everything is special, nothing is special."**

Interaction animations are like exclamation points!!!
Using them everywhere makes them meaningless!!!
Use sparingly for maximum effect!

**Target**: 30-40% of nodes (not 100%+)

---

**Created**: November 23, 2025
**Status**: ⏭️ Future work (not blocking current PR)
**Priority**: Medium (quality improvement, not critical bug)
