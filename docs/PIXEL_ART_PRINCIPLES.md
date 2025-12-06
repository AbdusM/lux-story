# Pixel Art Principles

Documentation compiled from professional pixel art tutorials for creating game-quality sprites.

**Sources:**
- [PixelJoint Tutorial](https://pixeljoint.com/forum/forum_posts.asp?TID=11299) by cure
- [Derek Yu's Pixel Art Tutorial](https://www.derekyu.com/makegames/pixelart.html)
- [Tsugumo's Classic Tutorial](http://petesqbsite.com/sections/tutorials/tuts/tsugumo/)
- [Gas13 Pixel Art Guide](http://gas13.ru/v3/tutorials/sywtbapa_world_of_sprites.php)

---

## 1. What Makes Pixel Art Different

Pixel art is defined by **control and precision**. The artist must be in control at the level of the single pixel. Every pixel should be purposefully placed.

**NOT pixel art:**
- Using blur, smudge, or smear tools
- Auto-generated gradients
- High color counts from dirty tools
- Oekaki (quick sketches without zoom)

**IS pixel art:**
- Manual placement of pixels
- Deliberate color choices
- Working zoomed in
- Every pixel has purpose

---

## 2. Pixel Clusters (Critical Concept)

> "A single pixel is most of the time near-useless and meaningless if not touching pixels of the same color."

**Key rules:**
- Single pixels = NOISE
- Pixels should "travel in packs"
- Every pixel should belong to a cluster
- The pixel cluster is the unit on which decisions are based

**Exception - Isolated pixels are OK for:**
- Specular highlights (brightest spots)
- Tiny essential details (eyes on small sprites, stars)
- Anti-aliasing buffer pixels

---

## 3. Anti-Aliasing (AA)

AA smooths jagged edges by placing "in-between" colors at corners where line segments meet.

### AA Types

```
NONE        - Hard pixel edges (can look jagged)
FULL        - AA on all edges (can look blurry)
INTERNAL    - AA only inside, hard outline kept
SELECTIVE   - Push AA INTO the outline (best for game sprites)
```

### AA Rules

1. Only use as much AA as needed to smooth the edge
2. Too much AA = blurry, lose crispness
3. Too little AA = still jagged
4. Never AA the outside of a sprite if background is unknown
5. Longer line segments need longer AA segments

### AA Banding (Bad)

When AA segments line up with the lines they're buffering. Avoid this.

---

## 4. Jaggies

Jaggies occur when pixels break up the consistency of a line.

**Causes:**
- Single pixels out of place
- Line segments that don't grow/shrink consistently
- Missing anti-aliasing on curves

**Fixes:**
- Change length of line segments for consistency
- Add anti-aliasing
- Ensure smooth progression: 1-2-3-4-3-2-1 not 1-2-4-1-3

**Line consistency example:**
```
Good: 5-4-3-2-1-2-3-4-5 (smooth curve)
Bad:  5-2-4-1-3-5-2 (jagged, inconsistent)
```

---

## 5. Dithering

Mixing patterns of pixels to achieve different shades without adding colors.

### Types

**50% dither (checkerboard):**
```
X.X.X.X.
.X.X.X.X
X.X.X.X.
```

**25% dither:**
```
X...X...
........
...X...X
........
```

**Stylized dithering:** Small shapes in the pattern

**Interlaced dithering:** Two dithers weave together at borders

**Random dithering:** Generally avoid (creates noise)

### When to Use

- Large areas of single color (skies)
- Rough/bumpy textures (dirt, stone)
- Bridging two colors without adding a new color
- Creating depth on limited palettes

### When NOT to Use

- If dithering covers half your sprite (just add a color)
- If it creates unwanted texture
- If it adds too much noise

---

## 6. Banding (Avoid This)

Banding occurs when pixels line up on the underlying grid, exposing the grid and reducing apparent resolution.

### Types of Banding

**Hugging:** Outline follows shape exactly
```
Bad:  ████
      █  █
      ████
```

**Fat pixels:** Small squares lining up

**Staircase banding:** Large uniform bands

**Skip-one banding:** Even with gaps, mind fills them in

**45-degree banding:** Even single-pixel thick rows can band

---

## 7. Pillow Shading (Avoid This)

Shading by surrounding a central area with increasingly darker bands.

**Why it's wrong:**
- Ignores light source
- Conforms to shape rather than form
- Looks like inflated balloon, not 3D object

**Fix:** Always define a light source (top-left is common) and shade according to how light hits the 3D form, not the 2D shape.

---

## 8. Form and Volume

> "Think about drawings as forms with volume, instead of simply lines and color."

**Key concepts:**
- Forms exist in 3D space
- By shading, you're sculpting out a form
- Visualize character as clay, not pixels
- If you squint, large clusters of light/dark should emerge
- Details should not obscure basic forms

---

## 9. Selective Outlining (Sel-out)

Replacing black outline with lighter colors toward the light source.

**Purpose:**
- More naturalistic look
- Softens segmentation
- Brings out basic form

**Rules:**
- Toward light = lighter outline colors
- Where sprite meets negative space = may remove entirely
- For internal segmentation (muscles, fur) = use shadow colors, not black

**Warning:** Don't AA outline to unknown background color.

---

## 10. Color Palettes

### Why Limited Palettes?

1. **Cohesion** - Same colors reappear, unifying the work
2. **Control** - Easier to manage and adjust
3. **Tradition** - Old games had restrictions (NES: 16 colors, GameBoy: 4)

### Common Sizes

- 4 colors (GameBoy style)
- 16 colors (NES style)
- 32 colors (common modern choice)

### HSL (Hue, Saturation, Luminescence)

**Hue:** Color identity (red, blue, green)
**Saturation:** Intensity (0 = grey, 100 = vivid)
**Luminescence:** Brightness (0 = black, 100 = white)

### Common Mistakes

- **Too much saturation** - Burns the eyes, especially on screens
- **Not enough contrast** - Can't distinguish light/dark
- **Pure black/white** - Causes eye strain, use #1A1A1A and #F0F0F0

---

## 11. Color Ramps

A group of colors that can be used together, arranged by luminosity.

### Straight Ramps (Boring)

Only luminescence changes, hue stays same.
```
Dark Blue → Medium Blue → Light Blue
```

### Hue-Shifted Ramps (Better)

Both hue and luminescence change.
```
Dark Blue-Purple → Medium Blue → Light Blue-Cyan
```

**General rule:**
- Highlights → shift toward warm (yellow)
- Shadows → shift toward cool (blue/purple)

### Shared Colors

- Darkest color often shared across ramps
- Lightest color often shared across ramps
- Neutral mid-tones (browns, greys) can bridge multiple ramps

---

## 12. Contrast and Readability

### Floor/Background Rule

> "You want your floors to look like FLOORS. They shouldn't stand out like a wall."

- Use low contrast for backgrounds
- Player character should always be obvious
- Never make player "search" for their character

### The Squint Test

Squint at your sprite. If you can't tell what it is, contrast is wrong.

### Black Usage

Black brings out other colors. Use it strategically:
- Pure black for outlines (separates sprite from background)
- Never use pure #000000, use #1A1A1A (charcoal)

---

## 13. Small Sprites (32x32 and below)

> "The smaller a sprite gets, the less it looks like what it represents and the more responsibility each pixel has."

### Key Principles

- Use colored shapes, not outlines
- Make compromises (outline vs shading, arms vs head size)
- Chibi/super-deformed designs work well (big heads, expressive eyes)
- Color defines features more than lines

### Mario Example

- Eye = 2 pixels stacked
- Ear = 2 pixels
- Mustache exists to distinguish nose from face
- No outline - color defines everything

---

## 14. Animation Notes

### Eye Animation (Our Approach)

Instead of layering eyes separately, bake them into the sprite:

```
E = Eye white (sclera)
P = Pupil

Open:       EP over EE (2x2 eye)
Half-lid:   Replace top row (EP) with lid color
Closed:     Replace all E and P with lid color
```

This gives pixel-perfect control and avoids layer conflicts.

---

## 15. Quick Reference Checklist

Before finalizing a sprite, check:

- [ ] No isolated single pixels (except highlights)
- [ ] No banding (pixels don't line up)
- [ ] No pillow shading (light source defined)
- [ ] AA applied where needed (not overdone)
- [ ] No jaggies (lines are consistent)
- [ ] Passes squint test (form is clear)
- [ ] No pure black (#000000) or white (#FFFFFF)
- [ ] Readable at target size
- [ ] Character is distinct from background

---

## 16. Tools

**Recommended:**
- Aseprite (most popular, full-featured)
- GraphicsGale (free, Windows)
- Piskel (browser-based, free)
- GameMaker Studio 2 (if making games)

**What to avoid:**
- Blur/smudge tools
- Auto-gradient fills
- High-color automatic tools

---

*Last updated: December 2, 2025*
