# Gothicvania Style Analysis & Best Practices

Analysis of professional pixel art from the Gothicvania asset pack to extract actionable guidelines.

**Source:** Gothicvania Collection (Ansimuz)
**Characters Analyzed:** Ninja Girl, Cemetery Hero

---

## 1. Color Ramp Philosophy

### Observed Pattern
Professional sprites use **3-4 tone ramps** per material, not just light/dark:

```
HAIR (Ninja Girl):
Base:      #E8A840 (golden)
Shadow 1:  #C07030 (orange-brown, hue shift toward red)
Shadow 2:  #803820 (deep brown, hue shift toward purple)
Highlight: #F8D060 (bright yellow, hue shift toward yellow)

COAT (Cemetery Hero):
Base:      #6848A0 (purple)
Shadow 1:  #483078 (deep purple, hue shift toward blue)
Shadow 2:  #281848 (near-black purple)
Highlight: #9070C0 (light purple, hue shift toward pink)
```

### The Rule
> **Shadows shift COOL (toward blue/purple). Highlights shift WARM (toward yellow/orange).**

This creates visual depth that flat darkening cannot achieve.

---

## 2. Selective Outlining

### Observed Pattern
NOT every edge uses black outline. Instead:

| Area | Outline Color |
|------|---------------|
| Silhouette (body vs. background) | Black or near-black |
| Hair/fur internal edges | Darkest shade of that color |
| Skin internal edges | Dark skin tone |
| Cloth folds | Dark cloth color |
| Metal/weapons | Can use black for hard edge |

### The Rule
> **Silhouette = black. Interior details = darkest shade of that material.**

This prevents the "coloring book" look where everything is outlined in black.

### Application to Our Avatars
```
FOX EARS:
- Outer edge (vs background): Black #1A1A1A
- Inner ear detail: Dark orange #8B4513

OWL FEATHERS:
- Outer edge: Black #1A1A1A
- Feather texture: Dark brown #3A2D1F
```

---

## 3. Highlight Placement (Specular)

### Observed Pattern
Single bright pixels placed on:
- **Top of head/hair** (light source is usually top-left)
- **Tip of nose**
- **Eye sparkle** (white pixel in pupil)
- **Metallic surfaces** (weapons, buckles)

### The Rule
> **One or two bright pixels at apex of curved surfaces facing light.**

These are the ONLY acceptable single-pixel placements (otherwise single pixels = noise).

### Application to Our Avatars
```
FOX:
- Add single bright orange pixel at top of each ear
- Add eye sparkle (already have white sclera)

OWL:
- Add single bright tan pixel at top of head
- Beak highlight
```

---

## 4. Anti-Aliasing Strategy

### Observed Pattern
Gothicvania uses **internal AA only**:
- Silhouette edges remain hard (for compositing on any background)
- Interior color transitions are smoothed with intermediate colors
- Curves use 1-pixel "buffer" colors at direction changes

### Example (Hair Curve):
```
Without AA:   ████
              █
              █

With AA:      ████
              ▒█    (▒ = intermediate color)
               █
```

### The Rule
> **Never AA the outer silhouette. Always AA interior curves and color transitions.**

---

## 5. Material Differentiation

### Observed Pattern
Each material type has distinct visual language:

| Material | Characteristics |
|----------|-----------------|
| **Skin** | Warm tones, soft gradients, minimal outline |
| **Hair** | Strong highlights, flowing shapes, hue-shifted shadows |
| **Cloth** | Fold shadows, matte finish, medium contrast |
| **Metal** | High contrast, sharp highlights, reflective |
| **Fur/Feathers** | Texture patterns, soft edges, directional marks |

### Application to Our Avatars
```
FOX FUR:
- Soft orange gradients
- Directional marks suggesting fur direction
- Ear tufts with soft interior edges

OWL FEATHERS:
- Layered appearance
- Face disk = smooth, matte
- Body feathers = subtle texture
```

---

## 6. Eye Treatment

### Observed Pattern (Anime Style)
- Large eyes relative to face (chibi proportion)
- White sclera visible
- Dark pupil with single highlight pixel
- Eyelids use skin/fur color, not black

### Eye Structure:
```
  EH        E = White sclera
  EP        P = Black pupil
            H = Highlight (single white pixel IN the pupil)
```

### The Rule
> **Eyes need: sclera + pupil + highlight. Highlight goes IN the pupil, not the sclera.**

---

## 7. Silhouette Test

### Observed Pattern
All Gothicvania characters pass the "silhouette test":
- Fill entire sprite with black
- Shape should still be recognizable
- Key features (weapons, hair, pose) remain readable

### Application
Our avatars should be recognizable as:
- FOX: Triangular ears, pointed muzzle
- OWL: Ear tufts, round face disk, beak

If these features disappear at small sizes, they need to be exaggerated.

---

## 8. Animation Anticipation

### Observed Pattern
Even "idle" animations have:
- Breathing motion (subtle chest/shoulder movement)
- Hair/cloth physics (gentle sway)
- Weight shift (slight lean)

### Application to Our Avatars
Our blink animation is minimal. Consider adding:
- Subtle ear twitch (fox)
- Head bob (owl)
- Breathing (expand/contract body slightly)

---

## 9. Color Count Guidelines

### Observed Pattern
Professional sprites use surprisingly few unique colors:

| Character | Unique Colors |
|-----------|---------------|
| Ninja Girl | ~16 colors |
| Cemetery Hero | ~18 colors |

But they REUSE colors across materials:
- Darkest shadow often shared between hair/clothes
- Highlight colors often shared
- This creates palette cohesion

### Application
Our current 6-8 colors per avatar is fine, but we should:
- Share shadow colors between fur and clothes
- Use same highlight across materials
- Limit to max 12 unique colors

---

## 10. Proportions (Chibi/Super-Deformed)

### Observed Pattern
Gothicvania characters have exaggerated proportions:
- Head: ~40% of body height
- Eyes: ~30% of face width
- Hands/feet: Larger than realistic
- Weapons: Oversized for readability

### Application to Our Avatars
Our 16x16 portraits should emphasize:
- LARGE eyes (2x2 minimum)
- CLEAR ears/tufts (distinctive silhouette)
- PROMINENT nose/beak (species identifier)

---

## Summary: Actionable Changes for Our Avatars

### Immediate (High Impact)
1. Add hue-shifting to shadow colors (shadows → cool)
2. Add highlight pixels to ears/head apex
3. Use dark fur color (not black) for interior edges

### Medium Priority
1. Add eye sparkle (white pixel in pupil)
2. Increase color ramp depth (2 → 3 tones)
3. Apply selective outlining

### Lower Priority
1. Add subtle animation beyond blink (ear twitch, head bob)
2. Refine AA on interior curves
3. Texture patterns for fur/feathers

---

## Reference Palette Extractions

### Ninja Girl Hair Ramp
```css
--hair-highlight: #F8D060;
--hair-base: #E8A840;
--hair-shadow1: #C07030;
--hair-shadow2: #803820;
```

### Cemetery Hero Coat Ramp
```css
--coat-highlight: #9070C0;
--coat-base: #6848A0;
--coat-shadow1: #483078;
--coat-shadow2: #281848;
```

### Suggested Fox Fur Ramp (Hue-Shifted)
```css
--fur-highlight: #F4A030; /* toward yellow */
--fur-base: #E86A17;
--fur-shadow1: #B85510; /* toward red */
--fur-shadow2: #7A3A10; /* toward purple-brown */
```

### Suggested Owl Feather Ramp (Hue-Shifted)
```css
--feather-highlight: #7A6B5A; /* toward warm gray */
--feather-base: #5A4B3A;
--feather-shadow1: #3A2D1F; /* toward cool brown */
--feather-shadow2: #251A10; /* toward blue-black */
```

---

*Document created: December 2, 2025*
*Based on: Gothicvania Collection by Ansimuz*
