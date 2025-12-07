# Pixel Avatar Revision Plan

**Date:** December 2, 2025
**Goal:** Apply professional pixel art principles to create premium avatar quality

---

## Part 1: Problem Analysis

### Issues Identified (Consolidated from All Critiques)

| Problem | Source | Severity |
|---------|--------|----------|
| Eyes merge into white blob at 32px | Expert #1 | CRITICAL |
| No hue-shifting in shadows | Gothicvania analysis | HIGH |
| Silhouette not readable at small sizes | Expert #2 | HIGH |
| Too many shadow edge pixels (noise) | Expert #2 | HIGH |
| No highlight pixels (flat look) | Gothicvania analysis | MEDIUM |
| Fox/Owl have different "language" | Expert #2 | MEDIUM |
| Interior uses black outlines | Gothicvania analysis | MEDIUM |
| Shirt/tie/body blend together | Expert #1 | MEDIUM |

---

## Part 2: Current State

### Fox (Devon) - Current Sprite
```
"..BO....OB......",  // 0: Ear tips
"..OOO..OOO......",  // 1: Ear bodies
"..oOOOOOOo......",  // 2: Head top (shadow edges) ← TOO MUCH NOISE
"..OOOOOOOO......",  // 3: Forehead
"..oPEOOEPo......",  // 4: Eyes ← SHADOW EDGES AROUND EYES = BAD
"..oEEOOEEo......",  // 5: Eyes bottom
"...oWWWWo.......",  // 6: Muzzle ← SHADOW FRAME OK
"....WBBW........",  // 7: Nose
"....oWWo........",  // 8: Chin ← UNNECESSARY SHADOW
"....gGGg........",  // 9: Neck
"...gGGGGg.......",  // 10: Shoulders ← TOO MUCH EDGE SHADING
"...GGTGGG.......",  // 11: Tie
"..gGGGGGGg......",  // 12: Body
```

**Diagnosis:** Over-engineered shadow edges create visual noise at small sizes.

### Owl (Rohan) - Current Sprite
```
"...BB....BB.....",  // 0: Ear tufts
"..fFFf..fFFf....",  // 1: Tufts shaded ← TOO COMPLEX
"..fFFFFFFFFf....",  // 2: Head ← TOO MUCH EDGE SHADOW
"..FLLLLLLLLF....",  // 3: Face disk
"..FLPEOOLPELF...",  // 4: Eyes ← EYE STRUCTURE UNCLEAR
"..FLEEYVEELF....",  // 5: Eyes + beak
"...FLLYYLLF.....",  // 6: Beak
"....fFFFFf......",  // 7: Chin
"....sSSSs.......",  // 8: Neck
"...sSSSSSSs.....",  // 9: Suit
"...SSSRRSSS.....",  // 10: Bowtie
"..sSSSSSSSs.....",  // 11: Body
```

**Diagnosis:** Same over-engineering problem. Face disk competes with eyes.

---

## Part 3: Revised Palettes (Hue-Shifted)

### Fox Palette v2
```javascript
const foxPalette = {
  // Fur ramp (hue shifts toward cool in shadows, warm in highlights)
  'H': '#F4A030',  // Highlight (toward yellow) - NEW
  'O': '#E86A17',  // Base orange
  'o': '#B85510',  // Shadow (toward red)
  'd': '#7A3A10',  // Deep shadow (toward purple-brown) - NEW

  // Muzzle
  'W': '#F0F0F0',  // Off-white
  'w': '#D8D0C8',  // Muzzle shadow - NEW

  // Features
  'B': '#1A1A1A',  // Black (nose, pupils)

  // Clothing
  'G': '#4C9F70',  // Green shirt
  'g': '#3D8259',  // Dark green
  'T': '#2D3047',  // Tie (dark blue-gray)

  // Eyes
  'E': '#F0F0F0',  // Eye white (sclera)
  'P': '#1A1A1A',  // Pupil
  'e': '#E86A17',  // Eyelid (fur color)
}
```

### Owl Palette v2
```javascript
const owlPalette = {
  // Feather ramp (hue shifts toward cool in shadows)
  'H': '#7A6B5A',  // Highlight (toward warm gray) - NEW
  'F': '#5A4B3A',  // Base brown
  'f': '#3A2D1F',  // Shadow (toward cool brown)
  'd': '#251A10',  // Deep shadow (toward blue-black) - NEW

  // Face disk
  'L': '#E8DCC8',  // Light tan
  'l': '#D0C4B0',  // Face disk shadow - NEW

  // Features
  'Y': '#FFD700',  // Gold beak
  'y': '#D4B000',  // Beak shadow - NEW
  'B': '#1A1A1A',  // Black (ear tufts)

  // Clothing
  'S': '#3B8EA5',  // Blue suit
  's': '#2D7086',  // Dark blue
  'R': '#D1495B',  // Red bowtie

  // Eyes
  'E': '#F0F0F0',  // Eye white
  'P': '#1A1A1A',  // Pupil
  'e': '#5A4B3A',  // Eyelid (feather color)
}
```

---

## Part 4: Revised Sprites

### Design Principles for Revision

1. **SIMPLIFY** - Remove edge shadows that create noise
2. **HIGHLIGHT** - Add single bright pixels at ear tips/head apex
3. **CLARIFY EYES** - Ensure PE pattern is clear and consistent
4. **SELECTIVE OUTLINE** - Use dark fur color, not black, for interior edges
5. **SILHOUETTE FIRST** - Key features must survive at 32px

### Fox v2 Sprite
```
"..BH...HB.......",  // 0: Ear tips with HIGHLIGHTS
"..BOO..OOB......",  // 1: Ears (black outline, orange fill)
"...OOOOOO.......",  // 2: Head top (CLEAN - no shadow edges)
"..OOOOOOOO......",  // 3: Forehead
"..OPEOOEPOO.....",  // 4: Eyes (P=pupil, E=sclera) CLEAN
"..OEEOOEEOO.....",  // 5: Eye bottom row
"...OOWWOO.......",  // 6: Cheeks + muzzle (SIMPLIFIED)
"....WBBW........",  // 7: Nose
"....WWWW........",  // 8: Chin (CLEAN - no shadow frame)
"....GGGG........",  // 9: Neck/Shirt (DIRECT transition)
"...GGGGGG.......",  // 10: Shirt
"...GGTGGG.......",  // 11: Tie
"..GGGGGGGG......",  // 12: Body
"................",
"................",
"................",
```

**Changes:**
- Added 'H' highlights on ear tips (line 0)
- Removed all 'o' shadow edges from face (cleaner)
- Simplified chin (no shadow frame)
- Direct transition from face to shirt

### Owl v2 Sprite
```
"..HBB..BBH......",  // 0: Ear tufts with HIGHLIGHTS
"..FFFF..FFFF....",  // 1: Tufts bodies (SIMPLIFIED)
"...FFFFFFFF.....",  // 2: Head (CLEAN - no edge shadows)
"..FLLLLLLLLF....",  // 3: Face disk
"..FLPEOOLPELF...",  // 4: Eyes (SAME structure as fox)
"..FLEEYYEELF....",  // 5: Eyes + beak
"...FLLYYLLF.....",  // 6: Beak
"....FFFFFF......",  // 7: Chin (CLEAN)
"....SSSSSS......",  // 8: Suit (DIRECT transition)
"...SSSRRSS......",  // 9: Bowtie
"...SSSSSSSS.....",  // 10
"..SSSSSSSSSS....",  // 11
"................",
"................",
"................",
"................",
```

**Changes:**
- Added 'H' highlights on ear tufts (line 0)
- Removed 'f' shadow edges from head/tufts
- Removed 's' shadow edges from suit
- Cleaner overall

---

## Part 5: Unified Style Rules

Both characters MUST follow these rules:

### Rule 1: Eye Structure
```
..PE..EP..    (Pupil on inside, sclera on outside)
..EE..EE..    (Sclera row below)
```
- P = Black pupil (#1A1A1A)
- E = White sclera (#F0F0F0)
- Always 2x2 per eye
- Pupils face INWARD (toward nose)

### Rule 2: Outline Strategy
| Edge Type | Color |
|-----------|-------|
| Silhouette vs background | Black (#1A1A1A) |
| Ear interior | Dark fur color |
| Face interior | Base fur color |
| Clothing folds | Dark clothing color |

### Rule 3: Highlight Placement
- ONE highlight pixel per ear tip
- Light source: top-left
- Use warmest color in ramp

### Rule 4: Shadow Placement
- Under chin ONLY (separates head from body)
- Do NOT add shadow edges around entire face
- Less is more at 16x16

### Rule 5: Proportions
- Head: rows 0-8 (9 rows)
- Body: rows 9-12 (4 rows)
- Ratio: ~70% head, 30% body

---

## Part 6: Implementation Checklist

### Step 1: Update Palettes
- [ ] Add 'H' highlight color to fox palette
- [ ] Add 'H' highlight color to owl palette
- [ ] Add 'd' deep shadow to both (for future use)
- [ ] Verify all palette colors render correctly

### Step 2: Update Fox Sprite
- [ ] Replace line 0 with highlights
- [ ] Remove shadow edges from lines 2, 4, 5, 6, 8
- [ ] Simplify line 9 transition
- [ ] Verify at 32px

### Step 3: Update Owl Sprite
- [ ] Replace line 0 with highlights
- [ ] Remove shadow edges from lines 1, 2, 7, 8, 9, 11
- [ ] Verify at 32px

### Step 4: Update EYE_CONFIG
- [ ] Verify pupil positions match new sprites
- [ ] Verify sclera positions match new sprites
- [ ] Test blink animation

### Step 5: Visual Verification
- [ ] Screenshot at 32px - readable?
- [ ] Screenshot at 48px - readable?
- [ ] Screenshot at 64px - readable?
- [ ] Screenshot at 96px - detail visible?
- [ ] Silhouette test (fill with black, still recognizable?)

---

## Part 7: Success Criteria

### Must Pass
1. Fox recognizable as "fox" at 32px (ears + muzzle)
2. Owl recognizable as "owl" at 32px (tufts + beak)
3. Eyes visible and expressive at all sizes
4. No visual noise from over-shading
5. Characters feel like same artist made them

### Nice to Have
1. Hue-shifted shadows visible at 64px+
2. Highlight sparkle visible at 48px+
3. Material differentiation (fur vs clothes)

---

## Part 8: Comparison Preview

### Before (Current)
```
Fox:  Too many 'o' shadow edges = noise
Owl:  Too many 'f' shadow edges = noise
Both: Competing details, unclear at small sizes
```

### After (Planned)
```
Fox:  Clean shapes, highlight accents, clear eyes
Owl:  Clean shapes, highlight accents, clear eyes
Both: Unified style, readable at all sizes
```

---

*Plan created: December 2, 2025*
*Ready for implementation*
