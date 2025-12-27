# Skill Modal Enhancement Plan

## Vision
Transform the skill modal from "information display" to "progression interface" - showing players not just what a skill IS, but their journey WITH it.

---

## Current State

The `SkillDetail` in `components/constellation/DetailModal.tsx` shows:
- ✅ Skill name + superpower name
- ✅ Demonstration count (number in circle)
- ✅ Core definition
- ✅ Tactical scenario
- ✅ Manifesto
- ✅ Practitioners (teaching characters)

**Missing:**
- ❌ Progress bar (like character trust has)
- ❌ State label (dormant/awakening/developing/strong/mastered)
- ❌ Smart unlock hints for dormant skills ("Talk to Maya")
- ❌ Cluster context (Mind, Heart, Voice, etc.)
- ❌ Next level indicator
- ❌ Character synergy bonus display

---

## Level Criteria Decision

**Recommendation: Keep demonstration count + Add character synergy display**

| Approach | Pros | Cons |
|----------|------|------|
| Demonstration count only | Simple, existing system | No connection to characters |
| + Character synergy | Meaningful connection, uses existing data | Slight complexity |
| + Challenges/quests | Most engaging | Significant new system needed |

**Decision:** Use demonstration count as base, but DISPLAY character synergy as a hint:
- "You've demonstrated this skill 3 times"
- "💡 Learn faster from: Maya, Devon" (when those characters teach this skill)

This creates perceived depth without new mechanics.

---

## Enhancement Plan

### 1. Add Mastery Progress Bar

Like the character modal's trust bar:

```tsx
{/* Mastery Progress */}
<div className="space-y-2">
  <div className="flex justify-between text-xs text-slate-500">
    <span className="capitalize">{skill.state}</span>
    <span>{skill.demonstrationCount}/10</span>
  </div>
  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
    <motion.div
      className="h-full rounded-full"
      style={{ backgroundColor: skill.color }}
      initial={{ width: 0 }}
      animate={{ width: `${skill.demonstrationCount * 10}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  </div>
</div>
```

### 2. State Labels with Meaning

| State | Count | Label |
|-------|-------|-------|
| dormant | 0 | "Dormant" |
| awakening | 1 | "Awakening" |
| developing | 2-4 | "Developing" |
| strong | 5-9 | "Strong" |
| mastered | 10 | "Mastered" |

### 3. Smart Unlock Hints for Dormant Skills

Replace generic message with actionable guidance:

```tsx
{isDormant && SKILL_CHARACTER_HINTS[skill.id] && (
  <div className="p-3 rounded-lg bg-amber-900/20 border border-amber-500/30">
    <p className="text-amber-400 text-sm">
      <span className="font-bold">How to unlock:</span> Develop through conversations with{' '}
      {SKILL_CHARACTER_HINTS[skill.id].join(' or ')}.
    </p>
  </div>
)}
```

### 4. Cluster Context Badge

Show skill category:

```tsx
import { SKILL_CLUSTERS } from '@/lib/skill-definitions'

<span
  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
  style={{
    backgroundColor: `${SKILL_CLUSTERS[skill.cluster].color}20`,
    color: SKILL_CLUSTERS[skill.cluster].color
  }}
>
  {skill.cluster}
</span>
```

### 5. Next Level Indicator

```tsx
const LEVEL_THRESHOLDS = [1, 2, 5, 10]
const nextThreshold = LEVEL_THRESHOLDS.find(t => t > skill.demonstrationCount) || 10
const remaining = nextThreshold - skill.demonstrationCount

{!isDormant && remaining > 0 && (
  <p className="text-xs text-slate-500 mt-1">
    {remaining} more to reach {nextThreshold === 2 ? 'Developing' : nextThreshold === 5 ? 'Strong' : 'Mastery'}
  </p>
)}
```

### 6. Character Synergy Hint (NEW)

For unlocked skills, show teaching characters as a growth hint:

```tsx
{!isDormant && SKILL_CHARACTER_HINTS[skill.id] && (
  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
    <span>💡</span>
    <span>Deepen with: {SKILL_CHARACTER_HINTS[skill.id].join(', ')}</span>
  </div>
)}
```

---

## File to Modify

**`components/constellation/DetailModal.tsx`**

Target: `SkillDetail` function (lines 207-312)

### Implementation Sequence

1. Import `SKILL_CLUSTERS` (line ~10)
2. Add progress bar after header (after line 247)
3. Add cluster badge in header (line ~237)
4. Replace dormant message with smart hints (lines 251-257)
5. Add next level indicator below progress bar
6. Add character synergy hint for unlocked skills

---

## Design Principles Alignment

| Principle | Implementation |
|-----------|----------------|
| Show, Don't Tell | Progress bar shows mastery visually |
| Accessible Depth | Simple surface (bar), deep info (manifesto) |
| Meaningful Choices | Shows consequences of dialogue choices |
| Juice is Not Optional | Animated progress bar |
| Respect Player Intelligence | No tutorial needed |

---

## Verification Checklist

- [ ] Progress bar animates smoothly
- [ ] State label matches demonstrationCount correctly
- [ ] Dormant skills show "how to unlock" with character names
- [ ] Cluster badge displays with correct color
- [ ] Next level calculation is accurate
- [ ] Character synergy hint shows for unlocked skills
- [ ] Mobile layout remains clean (test on narrow viewport)
- [ ] Build passes

---

## Future Enhancements (Not in this PR)

1. **Skill unlock toast** - Celebration when first demonstrated
2. **Skill timeline** - "First demonstrated Dec 15"
3. **Skill comparison** - Compare your profile to characters
4. **Active challenges** - "Demonstrate critical thinking in your next choice"
