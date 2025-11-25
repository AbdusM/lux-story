# Dialogue Content Change Control Process

This document outlines the systematic process for making changes to dialogue content without breaking the experience.

## Overview

The dialogue system has three layers of protection:
1. **Graph Validator** - Static analysis catches structural errors
2. **Golden Path Tests** - Regression tests catch broken paths
3. **Feature Flags** - Gate new content for safe rollout
4. **Preview Mode** - Visual inspection before deployment

---

## Change Types & Risk Levels

### LOW RISK - Text-only changes
- Editing existing dialogue text (typos, polish, Birmingham details)
- Adding emotion tags
- Adding variation_id values
- **Process**: Edit → Run validator → Commit

### MEDIUM RISK - Condition changes
- Modifying trust gates (min/max values)
- Adding/removing knowledge flags
- Changing visibleCondition on choices
- **Process**: Edit → Run validator → Run golden path tests → Preview → Commit

### HIGH RISK - Structural changes
- Adding new nodes
- Changing nextNodeId references
- Removing nodes
- Adding new choices
- **Process**: Feature flag → Edit → Run validator → Run golden path tests → Preview → QA playthrough → Commit → Enable flag

---

## Step-by-Step Process

### 1. Before Making Changes

```bash
# Verify current state is clean
npm run validate-graphs

# Run existing tests
npm run test:run -- tests/content/golden-paths.test.ts
```

### 2. For Low-Risk Changes (Text Polish)

```bash
# Make your edits in content/*-dialogue-graph.ts

# Validate structure
npm run validate-graphs

# Commit
git add content/
git commit -m "Content: Polish Maya dialogue - add Birmingham details"
```

### 3. For Medium-Risk Changes (Conditions)

```bash
# Make your edits

# Validate structure
npm run validate-graphs

# Run golden path tests
npm run test:run -- tests/content/golden-paths.test.ts

# Preview the affected nodes
# Visit: http://localhost:3005/admin/preview?graph=maya&node=affected_node&trust=5

# Commit
git add .
git commit -m "Content: Adjust Maya trust gates for better pacing"
```

### 4. For High-Risk Changes (New Content)

```bash
# Step 1: Add feature flag
# In lib/feature-flags.ts, add:
# useNewFeatureName: () => getFeatureFlag('CONTENT_FEATURE_NAME', false),

# Step 2: Gate your content
# In the dialogue graph, wrap new content:
# requiredState: {
#   // existing conditions
#   // Plus check: featureFlags.useNewFeatureName()
# }

# Step 3: Make your edits

# Step 4: Validate
npm run validate-graphs
npm run test:run -- tests/content/golden-paths.test.ts

# Step 5: Preview with flag enabled
# In browser console: featureFlags.enable("CONTENT_FEATURE_NAME")
# Visit: http://localhost:3005/admin/preview

# Step 6: Full playthrough test with flag enabled

# Step 7: Commit (flag still disabled by default)
git add .
git commit -m "Content: Add new Maya robotics arc (behind flag)"

# Step 8: Enable flag in production when ready
# Set NEXT_PUBLIC_FF_CONTENT_FEATURE_NAME=true in environment
```

---

## Validation Commands Reference

```bash
# Validate all dialogue graphs
npm run validate-graphs

# Run golden path tests
npm run test:run -- tests/content/golden-paths.test.ts

# Run all content tests
npm run test:run -- tests/content/

# Build to catch TypeScript errors
npm run build
```

---

## Preview Mode Usage

Access: `http://localhost:3005/admin/preview`

### URL Parameters
- `graph` - Graph name (samuel, maya, devon, jordan, etc.)
- `node` - Node ID to preview
- `trust` - Trust level (0-10) for condition evaluation

### Example URLs
```
/admin/preview?graph=maya&node=maya_introduction&trust=0
/admin/preview?graph=maya&node=maya_introduction&trust=5
/admin/preview?graph=samuel&node=samuel_traveler_origin&trust=7
```

### What to Check
- Content renders correctly
- Expected choices are visible at specified trust level
- Choices that should be hidden ARE hidden
- Next node references resolve (shown in choice details)

---

## Common Issues & Solutions

### "Choice points to non-existent node"
**Cause**: `nextNodeId` references a node that doesn't exist
**Fix**: Create the missing node OR fix the reference

### "Orphaned node has no incoming references"
**Cause**: Node exists but nothing points to it
**Fix**: Add a choice pointing to it OR remove the orphaned node

### "Duplicate node ID"
**Cause**: Two nodes have the same `nodeId`
**Fix**: Rename one of them (update all references)

### Golden path test fails after change
**Cause**: A previously working path is now broken
**Action**: Review the change - is the breakage intentional?
- If YES: Update the test to reflect new expected behavior
- If NO: Fix the content to restore the path

---

## Adding New Golden Path Tests

When adding significant new content, add corresponding tests:

```typescript
// tests/content/golden-paths.test.ts

describe('New Feature Golden Path', () => {
  it('should navigate through new content correctly', () => {
    // 1. Start at entry node
    // 2. Make expected choices
    // 3. Verify trust changes
    // 4. Verify end state
  })
})
```

---

## Rollback Process

If a content change breaks production:

```bash
# Identify the breaking commit
git log --oneline content/

# Revert the specific commit
git revert <commit-hash>

# OR if feature-flagged, disable the flag
# Set NEXT_PUBLIC_FF_CONTENT_FEATURE_NAME=false

# Redeploy
npm run deploy:vercel
```

---

## Checklist for Content PRs

- [ ] `npm run validate-graphs` passes
- [ ] `npm run test:run -- tests/content/` passes
- [ ] Previewed affected nodes in admin/preview
- [ ] For HIGH RISK: Behind feature flag
- [ ] For HIGH RISK: Full playthrough completed
- [ ] Commit message describes what changed and why
