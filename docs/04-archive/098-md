# Urgency Narrative Migration Guide

## Overview

Migration 009 implements severity-calibrated Glass Box urgency narratives with strict word count limits and action-oriented language.

## What Changed

### Before (Migration 003)
```
Urgency level is CRITICAL (85%). CRITICAL: Student has been inactive for 8 days.
Strong confusion signals: 15 choices made but only 3 scenes explored (stuck pattern).
High stress indicated by rushing pattern (rapid clicking without reflection).
RECOMMENDED ACTION: Immediate outreach required. Primary factors: severe disengagement,
navigation confusion, stress/rushing.
```
**Word Count:** 47 words
**Issues:** Passive voice, buried lede, too long

### After (Migration 009)
```
🚨 Student stopped playing 8 days ago after a strong start (15 choices).
Likely stuck or confused. **Action:** Reach out today.
```
**Word Count:** 18 words (within 15-20 critical limit)
**Benefits:** Active voice, leads with problem, clear action

## Word Count Limits by Severity

| Level    | Word Limit | Action Timeline | Emoji |
|----------|-----------|-----------------|-------|
| Critical | 15-20     | Today          | 🚨    |
| High     | 20-25     | This week      | 🟠    |
| Medium   | 25-30     | Within 2 weeks | 🟡    |
| Low      | 30-40     | Monthly        | ✅    |

## Narrative Structure

All narratives follow this format:

**[Emoji] [Problem]. [Hypothesis]. **Action:** [Action] [timeline].**

### Critical Example
```
🚨 Student stopped playing 5 days ago after a strong start (8 choices).
Likely stuck or confused. **Action:** Reach out today.
```

### High Example
```
🟠 Student's choices show anxiety patterns (4 family conflict scenes).
Anxiety patterns suggest need for support. **Action:** Check in this week.
```

### Medium Example
```
🟡 No new careers explored in 2 weeks. Comfortable with current path but might
benefit from broader exploration. **Action:** Gentle nudge to explore new areas
within 2 weeks.
```

### Low Example
```
✅ Thriving with balanced exploration! Explored 4 careers, formed 2 relationships,
demonstrating thoughtful decision-making and consistent daily engagement patterns.
Great momentum! **Action:** Monthly check-in to celebrate progress and discuss future goals.
```

## Applying the Migration

### 1. Run the Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply directly
psql $DATABASE_URL -f supabase/migrations/009_severity_calibrated_urgency_narratives.sql
```

### 2. Recalculate Existing Scores

The migration does NOT automatically recalculate existing narratives. To update all existing students:

#### Option A: Via Admin API (Recommended)
```bash
curl -X POST http://localhost:3000/api/admin/urgency \
  -H "Authorization: Bearer $ADMIN_API_TOKEN"
```

#### Option B: Via Database
```sql
DO $$
DECLARE
  v_player RECORD;
BEGIN
  FOR v_player IN SELECT user_id FROM player_profiles LOOP
    PERFORM calculate_urgency_score(v_player.user_id);
  END LOOP;
END $$;

-- Refresh materialized view
SELECT refresh_urgent_students_view();
```

### 3. Verify New Narratives

```sql
SELECT
  user_id,
  urgency_level,
  urgency_narrative,
  length(urgency_narrative) as narrative_length
FROM player_urgency_scores
ORDER BY urgency_score DESC
LIMIT 10;
```

Check that:
- ✅ Critical narratives: 15-20 words, start with 🚨
- ✅ High narratives: 20-25 words, start with 🟠
- ✅ Medium narratives: 25-30 words, start with 🟡
- ✅ Low narratives: 30-40 words, start with ✅

## Future Enhancement: View Mode Support

The narrative generator includes a `p_view_mode` parameter (`'family'` or `'research'`):

```sql
SELECT generate_urgency_narrative(
  'critical',           -- urgency level
  0.85,                 -- total score
  0.90,                 -- disengagement
  0.80,                 -- confusion
  0.70,                 -- stress
  0.60,                 -- isolation
  8,                    -- days inactive
  15,                   -- total choices
  3,                    -- unique scenes
  20,                   -- total scenes
  0,                    -- relationships
  2,                    -- milestones
  0.3,                  -- helping pattern
  'research'            -- view mode: 'family' or 'research'
);
```

Currently defaults to `'family'` mode. To implement research mode:

1. Add `view_mode` column to `player_urgency_scores` table
2. Update `calculate_urgency_score()` to accept view mode parameter
3. Update admin dashboard to toggle between modes
4. Recalculate scores for each mode

## Validation

A TypeScript validator is available for client-side validation:

```typescript
import { validateNarrative } from '@/lib/urgency-narrative-validator'

const result = validateNarrative(
  "🚨 Student stopped playing 5 days ago. Stuck. **Action:** Reach out today.",
  'critical'
)

console.log(result.valid)      // true/false
console.log(result.wordCount)  // 11
console.log(result.errors)     // ["CRITICAL narrative too short: 11 words (min: 15)"]
```

Run validation tests:
```bash
npx tsx scripts/test-urgency-narratives.ts
```

## Rollback

If you need to revert to the old narrative format:

```sql
-- Drop new functions
DROP FUNCTION IF EXISTS generate_urgency_narrative;

-- Restore old calculate_urgency_score from migration 003
-- (See supabase/migrations/003_urgency_triage.sql lines 54-295)
```

## Benefits

1. **Conciseness:** 40-50 words → 15-40 words (severity-calibrated)
2. **Clarity:** Active voice, leads with problem
3. **Actionability:** Clear **Action:** directive with timeline
4. **Consistency:** Structured format across all severity levels
5. **Visual Scanning:** Emoji indicators for quick severity identification
6. **Validation:** Enforced word limits prevent verbose narratives

## Related Files

- **Migration:** `/supabase/migrations/009_severity_calibrated_urgency_narratives.sql`
- **Validator:** `/lib/urgency-narrative-validator.ts`
- **Tests:** `/scripts/test-urgency-narratives.ts`
- **API Route:** `/app/api/admin/urgency/route.ts`
- **Dashboard:** `/components/admin/SingleUserDashboard.tsx`
