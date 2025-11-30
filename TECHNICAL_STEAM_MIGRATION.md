# Technical Migration Guide: Web App → Steam Game

**Goal:** Deploy Lux Story as a web-based game on Steam with zero code changes.

---

## 🎯 Recommended Approach: Web Game on Steam (Simplest!)

**Why Web Game:**
- **Zero code changes** (your Next.js app already works!)
- **No Electron overhead** (~100MB saved)
- **Faster startup** (just a browser window)
- **Easier updates** (update web server, Steam auto-updates)
- **Works everywhere** (browser, Steam, same codebase)
- **Steam supports HTML5 games natively** (uses CEF browser)

**Steam's Web Game Support:**
- Steam has built-in Chromium browser (CEF)
- Many successful games are web-based (e.g., many idle games, visual novels)
- Can still integrate Steam SDK (achievements, cloud saves)
- Users get native Steam experience (overlay, friends, etc.)

**When to Consider Electron:**
- Only if you need native system APIs (file system, notifications)
- Only if you want offline-first (but your game already works offline!)
- Only if you want smaller download size (but web is actually smaller)

---

## 📦 Step 1: Prepare Your Web Build

### 1.1 Build Your Next.js App

You already do this! Just make sure your build works:

```bash
npm run build
```

This creates the `out/` directory with all static files.

### 1.2 Test Locally

Serve the build locally to make sure everything works:

```bash
# Option 1: Use serve
npx serve out

# Option 2: Use Python
cd out && python -m http.server 8000

# Option 3: Use Node.js http-server
npx http-server out
```

Visit `http://localhost:8000` and verify the game works.

### 1.3 Ensure Offline Support

Your game should already work offline since it's client-side. But verify:
- [ ] All assets are in the build (images, fonts, etc.)
- [ ] No external API calls that break offline
- [ ] localStorage saves work (they do!)

**That's it!** Your web app is ready for Steam. No code changes needed.

---

## 🎮 Step 2: Steam Setup (Steamworks)

### 2.1 Apply for Steam Direct

1. Go to [Steamworks](https://partner.steamgames.com/)
2. Pay $100 one-time fee (Steam Direct)
3. Get your Steam App ID
4. Access Steamworks partner tools

### 2.2 Create Steam App

1. In Steamworks, create a new app
2. Fill in basic info (name, description)
3. Get your App ID (you'll need this)

### 2.3 Configure as Web Game

In Steamworks, configure your app:

1. **General Settings:**
   - App Type: "Game"
   - Supported Platforms: Windows, Mac, Linux (all work with web!)

2. **Depot Settings:**
   - Create a depot for your game files
   - Upload your `out/` directory contents
   - Set launch options (see below)

3. **Launch Options:**
   - Steam will use its built-in browser (CEF) to run your game
   - Launch command: Just point to your `index.html`
   - No special wrapper needed!

### 2.4 Steam Integration (Optional)

If you want Steam features (achievements, cloud saves), you can add Steam SDK:

```typescript
// lib/steam-integration.ts (optional)
// Only loads if running in Steam

export class SteamIntegration {
  private isSteam: boolean = false;

  constructor() {
    // Check if running in Steam
    this.isSteam = typeof window !== 'undefined' && 
                   (window as any).Steam !== undefined;
  }

  // Initialize Steam (call on app start)
  async initialize(): Promise<boolean> {
    if (!this.isSteam) return false;
    // Initialize Steam SDK
    return true;
  }

  // Unlock achievement (optional)
  unlockAchievement(id: string): void {
    if (!this.isSteam) return;
    // Steam SDK: unlock achievement
  }
}
```

**Note:** Steam integration is optional. Your game works fine without it!

---

## 💾 Step 3: Save System (Already Works!)

### 3.1 Your Current Save System

Your game already uses `localStorage` for saves, which works perfectly in Steam's browser:
- ✅ Saves persist between sessions
- ✅ Works offline
- ✅ No changes needed!

### 3.2 Optional: Steam Cloud Saves

If you want Steam Cloud saves (syncs across devices), you can add it later:

```typescript
// Optional: Add Steam Cloud save support
// Only if you implement Steam SDK integration

async saveToSteamCloud(data: string): Promise<void> {
  if (window.Steam && window.Steam.remoteStorage) {
    await window.Steam.remoteStorage.fileWrite('save.json', data);
  } else {
    // Fallback to localStorage
    localStorage.setItem('lux-save', data);
  }
}
```

**But this is optional!** Your current localStorage saves work fine.

---

## 🎨 Step 4: UI Adjustments (Optional Polish)

### 4.1 Fullscreen Support

Add fullscreen toggle (nice to have):

```typescript
// In your React component
const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
};

// Add keyboard shortcut
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### 4.2 Window Size

Steam will handle window sizing, but you can set preferred size in CSS:

```css
/* Ensure game looks good at common resolutions */
.game-container {
  min-width: 800px;
  min-height: 600px;
  max-width: 1920px;
  max-height: 1080px;
}
```

**That's it!** Your UI already works great for desktop.

---

## 🚀 Step 5: Build & Upload to Steam

### 5.1 Build Your Game

```bash
# Build Next.js app (creates out/ directory)
npm run build
```

### 5.2 Upload to Steam

1. **In Steamworks:**
   - Go to your app's depot
   - Click "Upload Build"
   - Select your `out/` directory
   - Upload all files

2. **Set Launch Options:**
   - Launch command: `index.html` (or just the URL if hosting)
   - Steam will open it in its browser

3. **Create Build:**
   - Create a new build in Steamworks
   - Assign it to your depot
   - Set it as default

### 5.3 Test on Steam

1. **Download Steam SDK** (for testing)
2. **Run in Steam client:**
   - Right-click your app in Steam
   - "Properties" → "Set Launch Options"
   - Test launch
3. **Verify:**
   - ✅ Game launches correctly
   - ✅ UI looks good
   - ✅ Saves work (localStorage)
   - ✅ All features work

---

## 📋 Step 6: Steam Store Page

### 6.1 Store Page Setup

Configure your Steam store page (see `COMMERCIALIZATION_STRATEGY.md` for details):

1. **Store Page Content:**
   - Description
   - Screenshots
   - Trailer
   - Tags (Simulation, Narrative, Relaxing, Choices Matter)

2. **Pricing:**
   - Set your price ($9.99 - $14.99 recommended)
   - Set launch discount (10-20% off)

3. **Release Date:**
   - Set when you're ready to launch
   - Can update as needed

### 6.2 Testing

- Use Steam's "Coming Soon" page to test
- Share with friends for feedback
- Iterate on store page copy

---

## ⚠️ Important Considerations

### Performance
- **Bundle size:** Web game is tiny! Just your `out/` directory (probably <50MB)
- **Memory:** Steam's browser is efficient, no extra overhead
- **Startup time:** Fast! Just opens a browser window

### Updates
- **Easy updates:** Update your web server, Steam auto-updates
- **Or:** Upload new build to Steam depot (Steam handles updates)
- **Both work!** Choose what's easier for you

### Offline Play
- **Already works!** Your game is client-side, works offline
- **Steam offline mode:** Test that game works in Steam offline mode
- **localStorage saves:** Persist even offline

### Platform-Specific
- **All platforms work!** Web game runs on Windows, Mac, Linux automatically
- **No platform-specific builds needed**
- **One build for all platforms!**

### Hosting Options

**Option 1: Host on Your Server**
- Deploy to Cloudflare Pages (you already do this!)
- Steam just opens the URL
- Easy updates (just redeploy)
- Requires internet connection

**Option 2: Package in Steam**
- Upload `out/` directory to Steam depot
- Steam serves files locally
- Works completely offline
- Updates via Steam

**Recommendation:** Start with Option 1 (hosted), switch to Option 2 if needed.

---

## 🎯 Migration Checklist (Super Simple!)

### Phase 1: Prepare Build
- [ ] Run `npm run build` (creates `out/` directory)
- [ ] Test build locally (`npx serve out`)
- [ ] Verify game works offline
- [ ] Check all assets are included

### Phase 2: Steam Setup
- [ ] Apply for Steam Direct ($100)
- [ ] Create Steam app in Steamworks
- [ ] Get Steam App ID
- [ ] Create depot for game files

### Phase 3: Upload to Steam
- [ ] Upload `out/` directory to Steam depot
- [ ] Set launch options (point to `index.html`)
- [ ] Create build in Steamworks
- [ ] Test in Steam client

### Phase 4: Store Page (Optional)
- [ ] Configure store page
- [ ] Add screenshots
- [ ] Add trailer
- [ ] Set pricing

### Phase 5: Launch!
- [ ] Final testing
- [ ] Set release date
- [ ] Launch!

**Total time: 1-2 days (mostly waiting for Steam approval)**

---

## 📚 Resources

- **Steamworks Docs:** https://partner.steamgames.com/doc/home
- **Steam HTML5 Games Guide:** Search Steamworks docs for "web game" or "HTML5"
- **Next.js Static Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports

---

## 💡 Quick Start Commands

```bash
# 1. Build your game (you already do this!)
npm run build

# 2. Test locally
npx serve out

# 3. Upload out/ directory to Steam depot
# (Done via Steamworks web interface)

# 4. That's it! No code changes needed.
```

---

## 🎉 Summary

**You're already 95% done!** Your Next.js app builds to static files, which is exactly what Steam needs.

**What you need to do:**
1. ✅ Build your app (`npm run build`)
2. ✅ Upload `out/` directory to Steam
3. ✅ Configure Steam store page
4. ✅ Launch!

**No Electron. No code changes. No complexity.**

Just upload your web build to Steam and you're done! 🚀
