# Pixel Avatar Specifications - Samuel Washington

> Technical and design documentation for the character avatar system

---

## 1. Overview

The pixel avatar system uses retro-inspired character sprites to represent the 9 characters in Grand Central Terminus. This document details the **Samuel Washington** avatar as the canonical reference for the art style.

### 1.1 Critical Issues with Current Design

| Issue | Problem | Impact |
|-------|---------|--------|
| **Palette Overload** | 9 colors fighting for 256 pixels | Visual noise, no focal point |
| **Competing Focal Points** | Dark ear tufts pull attention from face | Eyes get lost |
| **Undersized Eyes** | 2×2 pixels (should be 15-20% of face) | Lacks mentor warmth |
| **Beak Dominance** | Golden beak with shadow competes with eyes | Wrong focal point |
| **Silhouette Complexity** | Irregular outline doesn't resolve at small scales | Illegible at 32px |

### 1.2 Recommended Direction

**Path B: Expand to 32×32** - More pixels = design can breathe. Maintains pixel art aesthetic while enabling warmth and detail a mentor character needs.

| Approach | Canvas | Colors | Verdict |
|----------|--------|--------|---------|
| Current | 16×16 | 9 | ❌ Cramped, illegible |
| Path A: Simplified | 16×16 | 5 | ⚠️ Clear but less personality |
| **Path B: Expanded** | 32×32 | 10 | ✅ Expressive, future-proof |

---

## 2. Visual Specifications

### 2.1 Canvas & Dimensions

| Property | Value |
|----------|-------|
| Canvas Size | 16×16 pixels (native) |
| Display Size | 32×32px (2x), 48×48px (3x) |
| Aspect Ratio | 1:1 (square) |
| Format | PNG with transparency |
| Color Depth | 8-bit indexed (limited palette) |

### 2.2 Color Palette - Samuel

| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Dark Brown | `#5D4037` | (93, 64, 55) | Ear tufts, outer edges |
| Medium Brown | `#8D6E63` | (141, 110, 99) | Ear inner shading |
| Light Brown | `#A1887F` | (161, 136, 127) | Ear highlights |
| Cream White | `#EFEBE9` | (239, 235, 233) | Face base |
| Warm White | `#FFF8E1` | (255, 248, 225) | Face highlights |
| Golden Yellow | `#FFD54F` | (255, 213, 79) | Beak |
| Dark Yellow | `#FFC107` | (255, 193, 7) | Beak shadow |
| Black | `#212121` | (33, 33, 33) | Pupils |
| Off-White | `#FAFAFA` | (250, 250, 250) | Eye whites (sclera) |

**Total Colors Used:** 9 (intentionally limited for retro aesthetic)

### 2.3 Pixel Grid Breakdown

```
Row 1-2:   [transparent] - clear space above head
Row 3-4:   ████████ - brown ear tufts (pointed, owl-like)
Row 5-6:   ██░░░░██ - ears with face peeking through
Row 7-8:   ░░○░░○░░ - eyes (dark pupils on white)
Row 9-10:  ░░░▼▼░░░ - yellow beak (centered)
Row 11-12: ░░░░░░░░ - lower face/cheeks
Row 13-16: [transparent or minimal] - chin area
```

**Legend:**
- `█` = Brown (ear/hair)
- `░` = Cream/White (face)
- `○` = Eye (black pupil + white sclera)
- `▼` = Yellow (beak)

---

## 3. Anatomical Structure

### 3.1 Head Shape
- **Silhouette:** Rounded rectangle with pointed ear tufts
- **Width:** 12-14 pixels at widest point
- **Height:** 12-14 pixels (ears to chin)

### 3.2 Ear Tufts (Owl Feature)
- **Position:** Top corners of head
- **Shape:** Triangular, pointing upward and outward
- **Pixels:** 3-4 pixels tall, 2-3 pixels wide each
- **Shading:** 3-tone gradient (dark outer → medium → light inner)

### 3.3 Eyes
- **Position:** Upper-middle face, horizontally centered
- **Spacing:** 2-3 pixels between eyes
- **Structure:**
  - Outer ring: Off-white sclera (2×2 or 3×2 pixels)
  - Inner: Black pupil (1×1 or 1×2 pixels)
- **Expression:** Wide, alert, observant (owl-like wisdom)

### 3.4 Beak
- **Position:** Center of face, below eyes
- **Shape:** Downward-pointing triangle or diamond
- **Size:** 2-3 pixels wide, 2 pixels tall
- **Color:** Golden yellow with optional darker shadow pixel

### 3.5 Face/Cheeks
- **Color:** Cream white base
- **Shape:** Rounded, soft edges
- **Shading:** Minimal - 1-2 highlight pixels for dimension

---

## 4. Character Design Rationale

### 4.1 Why an Owl?

Samuel Washington is the **wise conductor and guide** of Grand Central Terminus. The owl motif reinforces:

| Symbolism | Application |
|-----------|-------------|
| **Wisdom** | Samuel offers reflective insights about the player's patterns |
| **Guidance** | Owls see in darkness; Samuel helps players navigate uncertainty |
| **Patience** | Owls wait and observe; Samuel's contemplative nature |
| **Night/Liminal** | Owls inhabit threshold spaces; the station exists between worlds |

### 4.2 Color Psychology

- **Brown tones:** Grounded, stable, trustworthy (mentor archetype)
- **Warm whites:** Approachable, gentle, non-threatening
- **Golden beak:** Wisdom, value, the "golden" advice he offers

### 4.3 Expression

The default expression conveys:
- **Openness:** Wide eyes = receptive, listening
- **Calm:** Neutral beak position = no judgment
- **Presence:** Direct forward gaze = engaged with player

---

## 5. Technical Implementation

### 5.1 File Location
```
/public/avatars/samuel.png
```

### 5.2 Component Usage
```tsx
// CharacterAvatar.tsx
<img
  src="/avatars/samuel.png"
  alt="Samuel Washington avatar"
  className="w-8 h-8 pixelated"
  style={{ imageRendering: 'pixelated' }}
/>
```

### 5.3 CSS for Crisp Scaling
```css
.pixelated {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
```

### 5.4 Responsive Sizes

| Context | Size | Class |
|---------|------|-------|
| Header (mobile) | 24×24px | `w-6 h-6` |
| Header (desktop) | 32×32px | `w-8 h-8` |
| Dialogue speaker | 40×40px | `w-10 h-10` |
| Character select | 48×48px | `w-12 h-12` |
| Profile/detail view | 64×64px | `w-16 h-16` |

---

## 6. Animation Specifications (Future)

### 6.1 Idle Animation
- **Frames:** 2-4
- **Duration:** 2-3 seconds per cycle
- **Motion:** Subtle blink or ear twitch
- **Easing:** Step (no interpolation for pixel art)

### 6.2 Blink Cycle
```
Frame 1 (1.5s): Eyes open (default)
Frame 2 (0.1s): Eyes half-closed
Frame 3 (0.1s): Eyes closed
Frame 4 (0.1s): Eyes half-closed
Frame 5: Return to Frame 1
```

### 6.3 Speaking Animation
- **Frames:** 2-3
- **Duration:** 0.2s per frame
- **Motion:** Beak opens slightly (1-2 pixels down)

---

## 7. Style Guide for Other Characters

Each character follows the same grid but with unique features:

| Character | Animal Motif | Distinguishing Feature | Primary Color |
|-----------|--------------|------------------------|---------------|
| Samuel | Owl | Ear tufts, yellow beak | Brown |
| Maya | Fox | Pointed ears, whiskers | Orange/Red |
| Devon | Cat | Round ears, whiskers | Gray/Blue |
| Jordan | Dog | Floppy ears | Golden/Tan |
| Marcus | Bear | Round ears, broad face | Dark Brown |
| Kai | Rabbit | Long upright ears | White/Pink |
| Tess | Bird | Small beak, crest | Teal/Green |
| Yaquin | Deer | Small antlers/spots | Warm Brown |
| Rohan | Wolf | Pointed ears, muzzle | Gray |
| Silas | Crow | Dark, sharp beak | Black/Purple |

### 7.1 Consistency Rules

1. **Same canvas size** (16×16) for all characters
2. **Limited palette** (8-12 colors max per character)
3. **Eyes at same vertical position** (row 7-8)
4. **Similar face width** (10-12 pixels)
5. **Centered composition** (no off-center faces)

---

## 8. Export Checklist

When creating new avatars:

- [ ] Canvas: 16×16 pixels
- [ ] Background: Transparent
- [ ] Format: PNG-8 or PNG-24
- [ ] Colors: Max 12 per character
- [ ] Anti-aliasing: OFF (hard pixel edges)
- [ ] Test at 2x, 3x, 4x scales
- [ ] Verify `image-rendering: pixelated` looks correct
- [ ] File naming: `{character-id}.png` (lowercase)

---

## 9. Asset Files

### Current
- `/public/avatars/samuel.png` - Samuel Washington (owl)

### Needed
- `/public/avatars/maya.png`
- `/public/avatars/devon.png`
- `/public/avatars/jordan.png`
- `/public/avatars/marcus.png`
- `/public/avatars/kai.png`
- `/public/avatars/tess.png`
- `/public/avatars/yaquin.png`
- `/public/avatars/rohan.png`
- `/public/avatars/silas.png`

---

## 10. References

### Style Inspirations
- Stardew Valley character portraits
- Undertale sprite work
- Celeste pixel art
- Gothicvania asset pack aesthetic

### Tools for Creation
- Aseprite (recommended)
- Piskel (free, web-based)
- GraphicsGale (free)
- Photoshop with pixel grid

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-07 | 1.0 | Initial specification document |

---

## 11. Half-Life Design Principles (Applied to GCT)

From `docs/00_Sprint2/Half Life Opening.md` - principles that inform our ambient events and character systems:

### 11.1 Environmental Storytelling

| Half-Life Technique | GCT Application |
|---------------------|-----------------|
| **Ambient Activity** | Workers, travelers, machinery operating in ambient events |
| **Show Don't Tell** | Pattern sensations ("Curiosity pulls at you") not ("You are curious") |
| **Functional Design** | Station elements serve narrative purpose (platforms = career paths) |
| **Positional Audio** | Character-specific idle events based on who you're with |

### 11.2 Player Agency Within Constraints

| Principle | Implementation |
|-----------|----------------|
| **Limited but Meaningful Choices** | 2-4 dialogue choices, each with pattern tags |
| **Exploration Rewards** | Ambient events reveal station lore when idle |
| **Contextual Learning** | Patterns tracked silently, reflected at key moments |
| **Narrative Integration** | HEV suit → Journal system (diegetic UI) |

### 11.3 Pacing and Escalation

```
Normal State → Foreshadowing → Tension → Payoff
   ↓              ↓              ↓         ↓
Tram Ride    Experiment Setup  Cascade   Aftermath
   ↓              ↓              ↓         ↓
Station Hub  Character Intro   Choices   Farewell/Reflection
```

### 11.4 Voice Acting Principles

From Half-Life's naturalistic dialogue:

- **Workplace Authenticity**: Characters speak like real people (Samuel's soft pauses, Maya's interrupted thoughts)
- **Emotional Progression**: Calm → Concern → Revelation → Reflection
- **Individual Speaking Styles**: Each character has distinct rhythm and vocabulary
- **Context-Sensitive Triggers**: ~1,700 voice lines in Half-Life; our ambient events = similar reactive depth

### 11.5 "The Station Breathes" Connection

Half-Life's Black Mesa feels alive through:
1. **Workers performing tasks** → Our `distant_life` events
2. **Machinery operating** → Our `station_atmosphere` events
3. **Environmental details** → Our `environmental` events
4. **Character idle behaviors** → Our `character_idle` events

**Key Insight**: Half-Life's 15-minute build before disaster = Our contemplative exploration before journey completion. Both trust player patience.

---

*Document prepared for Design and Engineering team collaboration.*
