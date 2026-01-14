# December 27 Implementation Plan

**Goal:** Activate dormant capabilities through gameplay and menus (no new overlays).

---

## Completed This Session

### UI Fixes (Earlier)
- [x] Button glow clipping - Added `w-full` and `overflow-x-hidden` to containers
- [x] Narrative text contrast - Removed hardcoded `text-slate-700` from RichTextRenderer.tsx
- [x] Harmonics orb jolt - Reduced from ±20px to ±8px for subtler feedback
- [x] Response container width - Changed to `sm:max-w-3xl lg:max-w-4xl`
- [x] Grammar fix - "Train slows down" → "The train slows down"

### 1. Pattern-Affinity Completion ✅
**File:** `lib/pattern-affinity.ts`

All 11 characters now configured:

| Character | Primary | Secondary | Friction |
|-----------|---------|-----------|----------|
| Samuel | patience | helping | building |
| Maya | building | analytical | helping |
| Devon | analytical | building | helping |
| **Jordan** | exploring | helping | analytical |
| Marcus | helping | patience | analytical |
| Tess | building | analytical | exploring |
| Yaquin | exploring | patience | building |
| **Kai** | building | analytical | patience |
| **Alex** | exploring | building | patience |
| Rohan | patience | exploring | helping |
| **Silas** | analytical | patience | helping |

Each includes resonanceDescriptions and patternUnlocks.

### 2. Skill Modal Enhancement ✅
**File:** `components/constellation/DetailModal.tsx`

Added:
- [x] Animated mastery progress bar
- [x] State badge (Dormant/Awakening/Developing/Strong/Mastered)
- [x] Cluster context badge (Mind/Heart/Voice/Hands/Compass/Craft)
- [x] Smart unlock hints for dormant skills ("Develop through conversations with Maya or Devon")
- [x] Next level indicator ("3 more demonstrations to reach Strong")
- [x] Character synergy hints for unlocked skills

### 3. Mysteries Section in Mind Tab ✅
**Files:** `components/ThoughtCabinet.tsx`, `lib/game-store.ts`

Added:
- [x] `useMysteries` selector in game store
- [x] THE STATION'S MYSTERIES section showing:
  - Samuel's Past (3 states)
  - Platform Seven (5 states)
  - The Letter Sender (6 states)
  - The Station's Nature (4 states)
- [x] Progress dots visualization
- [x] Dynamic hints based on current state

### 4. Abilities Section in Essence Tab ✅
**File:** `components/EssenceSigil.tsx`

Added:
- [x] UNLOCKED ABILITIES section showing pattern-based unlocks
- [x] Pattern badge with color for each ability
- [x] Icon + name + description for each unlocked ability
- [x] "Coming Soon" preview of next 3 abilities to unlock
- [x] Progress indicator showing points needed

### 5. Mystery State Progression System ✅
**Files:** `lib/character-state.ts`, `content/samuel-dialogue-graph.ts`

Added:
- [x] `mysteryChanges` field to `StateChange` interface
- [x] Mystery state application in `applyStateChange()` function
- [x] Example usage: Samuel's backstory node advances `samuelsPast: 'hinted'`

Usage pattern for content authors:
```typescript
onEnter: [
  {
    mysteryChanges: { samuelsPast: 'hinted' }
  }
]
// Or in choice consequences:
consequence: {
  mysteryChanges: { platformSeven: 'flickering' }
}
```

### 6. Codebase Cleanup ✅
**Session:** December 27 (later)

Cleaned unused imports and variables across 15+ files:
- Removed unused `EmotionTag`, `TrustDisplay` imports (hidden for immersion per Expedition 33)
- Removed unused `AchievementStars` import from Journal
- Removed unused `getSkillDescription` function from DetailModal
- Fixed 20+ lint warnings for cleaner codebase
- All lint checks pass, build succeeds

---

## Remaining (Future Sessions)

### Phase 1: Content Enhancement

#### 1.1 Chemistry-Aware Dialogue Variants
Surface `lastReaction` through TEXT, not overlays.

```
[If resonance detected]
Samuel: "That's—" *he pauses, something shifting* "—exactly what I needed to hear."
```

#### 1.2 Timing-Aware Dialogue
Track response timing, affect next node selection.
- Quick response (< 2 sec): Character notices decisiveness
- Long wait (> 15 sec): Character fills silence naturally

### Phase 2: Journal Enhancements

#### 2.1 Abilities Section in Essence Tab
Show unlocked abilities based on pattern thresholds:

| Pattern | 20% | 40% | 60% |
|---------|-----|-----|-----|
| Analytical | Subtext Hints | Pattern Recognition | Deduction Mode |
| Patience | Extended Context | Reflection Access | Time Dilation |
| Exploring | Path Glimpses | Hidden Routes | Map Reveal |
| Helping | Trust Preview | Emotional Memory | Empathy Sense |
| Building | Foundation Bonus | Blueprint View | Construction Mode |

### Phase 3: Invisible Gameplay Systems

#### 3.1 Quiet Hours System
Campfire conversations - NO CHOICES, just listening.
- After act endings
- At trust milestones (5, 8, 10)
- After 30+ minutes without one

#### 3.2 Mystery State Progression
Wire up dialogue to actually progress mystery states.

#### 3.3 Platform Evolution
Activate platform warmth and resonance tracking.

---

## Design Principles (from Expedition 33)

### What NOT to Add
- No pattern percentages during dialogue (only in Journal)
- No trust numbers during dialogue (only in Journal)
- No chemistry calculations visible (surface through TEXT)
- No mystery progress markers during dialogue

### The Test
> "Can a player understand this system without any tutorial or overlay? If the answer is no, we surface it through content, not UI."

---

## Files Modified Today

| File | Changes |
|------|---------|
| `lib/pattern-affinity.ts` | +4 characters (Jordan, Kai, Alex, Silas) |
| `lib/game-store.ts` | +useMysteries selector |
| `lib/character-state.ts` | +mysteryChanges in StateChange, +applyStateChange handler |
| `components/constellation/DetailModal.tsx` | Enhanced SkillDetail with progress, badges, hints |
| `components/ThoughtCabinet.tsx` | Added Mysteries section with MysteryNode component |
| `components/EssenceSigil.tsx` | Added Abilities section with unlock tracking |
| `content/samuel-dialogue-graph.ts` | Example mystery progression (samuelsPast: 'hinted') |

---

## Related Documentation

- `docs/SKILL_MODAL_ENHANCEMENT.md` - Detailed skill modal plan
- `docs/DORMANT_CAPABILITIES_AUDIT.md` - Backend capabilities audit
- `docs/EXPEDITION33_DESIGN_SYNTHESIS.md` - Design principles mapping
