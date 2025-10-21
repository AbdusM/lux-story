# Glass Box Urgency Narratives: Quick Reference Card

## 📋 Word Count Limits

| Level    | Words  | Emoji | Timeline      |
|----------|--------|-------|---------------|
| Critical | 15-20  | 🚨    | Today         |
| High     | 20-25  | 🟠    | This week     |
| Medium   | 25-30  | 🟡    | Within 2 weeks|
| Low      | 30-40  | ✅    | Monthly       |

## 📐 Narrative Structure

```
[Emoji] [Problem]. [Hypothesis]. **Action:** [Action] [timeline].
```

### Critical Template
```
🚨 [Student] stopped [activity] [X days] ago [after context].
[Hypothesis]. **Action:** [Action] today.
```

### High Template
```
🟠 [Observation] ([data]). [Hypothesis]. **Action:** [Action] this week.
```

### Medium Template
```
🟡 [Observation]. [Context]. **Action:** [Action] within 2 weeks.
```

### Low Template
```
✅ [Celebration]! [Details]. [Positive context]. **Action:** [Action].
```

## ✅ Validation Checklist

- [ ] Emoji matches severity (🚨🟠🟡✅)
- [ ] Word count within limits
- [ ] Problem stated first (no buried lede)
- [ ] Active voice (not passive)
- [ ] Clear hypothesis or context
- [ ] Bold **Action:** directive
- [ ] Specific timeline included
- [ ] Critical includes "today"

## 🧪 Testing

```bash
# Run all validation tests
npx tsx scripts/test-urgency-narratives.ts

# Expected: 18/18 tests pass
```

## 💻 Code Usage

### TypeScript Validation
```typescript
import { validateNarrative } from '@/lib/urgency-narrative-validator'

const result = validateNarrative(
  "🚨 Student stopped playing 5 days ago. Stuck. **Action:** Reach out today.",
  'critical'
)

if (!result.valid) {
  console.error(result.errors)
}
```

### SQL Generation
```sql
SELECT generate_urgency_narrative(
  'critical',     -- level
  0.85,           -- total_score
  0.90,           -- disengagement
  0.80,           -- confusion
  0.70,           -- stress
  0.60,           -- isolation
  8,              -- days_inactive
  15,             -- total_choices
  3,              -- unique_scenes
  20,             -- total_scenes
  0,              -- relationships
  2,              -- milestones
  0.3,            -- helping_pattern
  'family'        -- view_mode ('family' or 'research')
);
```

## 📊 Quality Gates

### Word Count Enforcement
```typescript
function enforceWordCount(narrative: string, level: UrgencyLevel): void {
  const count = countWords(narrative)
  const limits = WORD_COUNT_LIMITS[level]

  if (count < limits.min || count > limits.max) {
    throw new Error(
      `${level.toUpperCase()} narrative must be ${limits.min}-${limits.max} words (got ${count})`
    )
  }
}
```

### Structure Enforcement
- Critical MUST include "today"
- All MUST include "**Action:**"
- Emoji MUST match severity
- First word MUST be problem/status (not "Urgency level")

## 🎯 Examples by Severity

### Critical (15-20 words)
```
🚨 Student stopped playing 5 days ago after a strong start (8 choices).
Likely stuck or confused. **Action:** Reach out today.
```

### High (20-25 words)
```
🟠 Student's choices show anxiety patterns (4 family conflict scenes).
Anxiety patterns suggest need for support. **Action:** Check in this week.
```

### Medium (25-30 words)
```
🟡 No new careers explored in 2 weeks. Comfortable with current path but
might benefit from broader exploration. **Action:** Gentle nudge to explore
new areas within 2 weeks.
```

### Low (30-40 words)
```
✅ Thriving with balanced exploration! Explored 4 careers, formed 2 relationships,
demonstrating thoughtful decision-making and consistent daily engagement patterns.
Great momentum! **Action:** Monthly check-in to celebrate progress and discuss
future goals.
```

## 🚀 Deployment Commands

### Apply Migration
```bash
supabase db push
```

### Recalculate Scores
```bash
curl -X POST http://localhost:3000/api/admin/urgency \
  -H "Authorization: Bearer $ADMIN_API_TOKEN"
```

### Verify Results
```sql
SELECT
  urgency_level,
  length(urgency_narrative) as words,
  urgency_narrative
FROM player_urgency_scores
ORDER BY urgency_score DESC;
```

## 🔧 Common Issues

### "Narrative too long"
**Problem:** Exceeded word limit
**Fix:** Remove adjectives, combine sentences, use active voice

### "Missing Action directive"
**Problem:** No **Action:** in narrative
**Fix:** Add `**Action:** [specific action] [timeline].`

### "Wrong emoji"
**Problem:** Emoji doesn't match severity
**Fix:** Use correct emoji (🚨 critical, 🟠 high, 🟡 medium, ✅ low)

### "Buried lede"
**Problem:** Problem statement not first
**Fix:** Move problem to first sentence

## 📁 File Locations

| File | Purpose |
|------|---------|
| `supabase/migrations/009_severity_calibrated_urgency_narratives.sql` | Database migration |
| `lib/urgency-narrative-validator.ts` | TypeScript validator |
| `scripts/test-urgency-narratives.ts` | Test suite |
| `docs/URGENCY_NARRATIVE_MIGRATION.md` | Migration guide |
| `docs/URGENCY_NARRATIVES_EXAMPLES.md` | Before/after examples |
| `docs/URGENCY_NARRATIVES_VISUAL_COMPARISON.md` | Visual comparison |

## 🎓 Writing Guidelines

### DO ✅
- Lead with the problem
- Use active voice
- Be specific with data
- Include clear timeline
- Use encouraging tone (Low)
- Use urgent tone (Critical)

### DON'T ❌
- Start with "Urgency level is..."
- Use passive voice
- Bury the action
- Use vague language ("some", "potential")
- Exceed word limits
- Omit **Action:** directive

## 📞 Support

**Documentation:** `/docs/URGENCY_NARRATIVE_MIGRATION.md`
**Tests:** `npx tsx scripts/test-urgency-narratives.ts`
**Issues:** Check word count, structure, emoji, and timeline requirements

---

**Last Updated:** October 3, 2025
**Version:** 1.0
**Status:** Production Ready ✅
