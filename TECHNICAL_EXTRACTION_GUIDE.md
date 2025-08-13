# Technical Extraction Guide
## What to Harvest from Slothman-Chronicles for Lux-Story

*Created: 2025-08-12*

---

## Executive Summary

From 31,000+ lines in slothman-chronicles, we've identified ~500 lines worth extracting. This document provides specific, actionable code snippets that align with Lux-Story's philosophy of radical simplicity.

---

## 1. Progressive Scene Loading (Worth Taking)

### The Problem It Solves:
Loading all scenes upfront wastes memory and slows initial load.

### The Slothman Way (Over-engineered):
```javascript
// 200+ lines with multiple fallbacks, caching, preloading
class AdvancedSceneManager extends Phaser.Scene {
  // ... massive implementation
}
```

### The Extraction for Lux-Story:
```typescript
// Just 15 lines that actually matter
export async function loadScene(sceneName: string) {
  try {
    const module = await import(`./scenes/${sceneName}.tsx`)
    return module.default
  } catch (error) {
    console.warn(`Scene ${sceneName} not found`)
    return null
  }
}

// Usage in Lux-Story:
const nextScene = await loadScene(choice.nextScene)
if (nextScene) setCurrentScene(nextScene)
```

**Benefit**: Lazy loads scenes only when needed
**Cost**: 15 lines
**Worth it**: ✅ Yes

---

## 2. Mobile Optimization Config (Worth Taking)

### The Slothman Way:
```javascript
// 500+ lines across multiple files
class MobileOptimizationSystem {
  // Touch handling, orientation, viewport, performance tiers...
}
```

### The Extraction for Lux-Story:
```typescript
// Just the config that matters
export const mobileConfig = {
  // Viewport handling
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  
  // Touch optimization
  touchAction: 'none',
  
  // Prevent bounce on iOS
  overscrollBehavior: 'none',
  
  // Simple responsive breakpoints
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024
  }
}

// One-line CSS that actually helps
const mobileCSS = `
  body { 
    touch-action: none; 
    overscroll-behavior: none; 
    -webkit-user-select: none;
  }
`
```

**Benefit**: Better mobile experience
**Cost**: 20 lines
**Worth it**: ✅ Yes

---

## 3. Simple Performance Monitor (Maybe)

### The Slothman Way:
```javascript
// 1000+ lines of graphs, charts, metrics
class PerformanceDashboard {
  constructor() {
    this.fps = new FPSCounter()
    this.memory = new MemoryMonitor()
    this.renderTime = new RenderTimeAnalyzer()
    // ... 10 more monitors
  }
}
```

### The Extraction for Lux-Story:
```typescript
// Just enough to catch problems
let lastTime = performance.now()
let frameCount = 0

export function checkPerformance() {
  frameCount++
  const now = performance.now()
  
  if (now - lastTime > 1000) {
    const fps = frameCount
    if (fps < 30 && process.env.NODE_ENV === 'development') {
      console.warn(`Low FPS: ${fps}`)
    }
    frameCount = 0
    lastTime = now
  }
}
```

**Benefit**: Catches performance issues in dev
**Cost**: 15 lines
**Worth it**: ⚠️ Only if performance issues arise

---

## 4. Asset Organization Pattern (Worth Taking)

### The Slothman Way:
```
/assets
  /audio
    /music
      /ambient (50 files)
      /battle (30 files)
    /sfx
      /ui (100 files)
      /environment (200 files)
  /sprites
    /characters (500 files)
    /effects (300 files)
```

### The Extraction for Lux-Story:
```
/public
  /audio
    ambient.mp3 (1 file, if needed)
  /images
    companion.svg (1 file)
```

**Lesson**: Their organization is good, but we don't need 1000 assets for contemplation.

**Benefit**: Clean structure if we add assets
**Cost**: 0 lines (just folders)
**Worth it**: ✅ The pattern, not the assets

---

## 5. Save State Pattern (Already Have Better)

### The Slothman Way:
```javascript
// 300+ lines with versioning, migration, compression
class SaveStateManager {
  async save(state) {
    const compressed = await this.compress(state)
    const encrypted = await this.encrypt(compressed)
    const versioned = this.addVersion(encrypted)
    // ... more steps
  }
}
```

### Our Current Lux-Story Way:
```typescript
// Already perfect at 6 lines
export function saveGame(state: GameState) {
  localStorage.setItem('lux-story', JSON.stringify(state))
}

export function loadGame(): GameState | null {
  const saved = localStorage.getItem('lux-story')
  return saved ? JSON.parse(saved) : null
}
```

**Verdict**: ❌ Keep our simple version

---

## 6. Audio System (Not Needed Yet)

### What Slothman Has:
- 50+ music files
- Advanced spatial audio
- Dynamic music layering
- Crossfading system

### What Lux-Story Needs:
```typescript
// If we add audio, just this:
const audio = new Audio('/audio/ambient.mp3')
audio.loop = true
audio.volume = 0.3
audio.play()
```

**Verdict**: ❌ Don't add until users request it

---

## 7. Error Boundaries (Worth Taking)

### The Extraction for Lux-Story:
```typescript
// React error boundary - actually useful
export class ErrorBoundary extends Component {
  state = { hasError: false }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Refresh to continue.</div>
    }
    return this.props.children
  }
}
```

**Benefit**: Graceful error handling
**Cost**: 12 lines
**Worth it**: ✅ Yes

---

## Implementation Priority

### Immediate (This Week):
1. ✅ Error Boundary - Prevents white screen of death
2. ✅ Mobile Config - Better mobile experience
3. ✅ Asset Structure - Prepare for future

### Only If Needed:
1. ⚠️ Progressive Loading - When we have >10 scenes
2. ⚠️ Performance Check - If users report issues
3. ⚠️ Audio - If users request it

### Never:
1. ❌ 13 AAA Systems
2. ❌ Performance Dashboard
3. ❌ Complex State Management
4. ❌ Animation Systems
5. ❌ Particle Effects

---

## The Extraction Script

```bash
# What we're actually taking from slothman-chronicles:

# 1. Copy mobile config
cp slothman-chronicles/src/config/mobile.js lux-story/lib/mobile-config.ts

# 2. Extract loading pattern (manually - it's 15 lines)

# 3. Note the folder structure (but don't create empty folders)

# That's it. 3 things. ~50 lines total.
```

---

## Code Smells to Avoid

When extracting, reject anything that:

1. **Has more than 3 dependencies**
   ```javascript
   // BAD: From slothman
   import { SystemA, SystemB, SystemC, SystemD } from './systems'
   ```

2. **Needs configuration**
   ```javascript
   // BAD: From slothman
   const config = require('./config/particle-config.json')
   ```

3. **Uses classes when functions work**
   ```javascript
   // BAD: From slothman
   class Manager extends BaseManager implements IManager {}
   
   // GOOD: For lux
   function doThing() {}
   ```

4. **Promises future features**
   ```javascript
   // BAD: From slothman
   // TODO: Add multiplayer support
   prepareForMultiplayer() {}
   ```

---

## Final Checklist

Before extracting anything from slothman-chronicles:

- [ ] Is it less than 50 lines?
- [ ] Does it work without dependencies?
- [ ] Will users notice if we don't add it?
- [ ] Can we build it ourselves in 30 minutes?

If any answer is "No", don't extract it.

---

## Conclusion

From 31,000+ lines in slothman-chronicles, we extract:
- **Mobile config**: 20 lines
- **Scene loading**: 15 lines  
- **Error boundary**: 12 lines
- **Folder pattern**: 0 lines (just knowledge)

**Total extraction: <50 lines**

The real value isn't in the code we take, but in learning what not to build.

---

*"The best code from slothman-chronicles is the code we didn't copy."*