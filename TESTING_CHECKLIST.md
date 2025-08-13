# Local Testing Checklist

Run through this checklist before merging to production.

## Pre-Production Verification

### 🔧 Development Server
- [ ] `npm run dev` starts without errors
- [ ] No ChunkLoadError issues
- [ ] No syntax errors in console
- [ ] Hot reload working properly

### 🎮 Core Game Functionality
- [ ] Character selection works (Lux, Swift, Sage, Buzz)
- [ ] Story progression flows correctly
- [ ] Choices register and affect narrative
- [ ] Scene transitions smooth

### ⚡ Game Systems
- [ ] Energy bar displays and depletes correctly
- [ ] Meditation mechanic activates and restores energy
- [ ] Third Eye ability (Lux) functions properly
- [ ] Character-specific abilities work
- [ ] Save/load system persists progress

### 🎨 Visual & UI
- [ ] All animations play smoothly
- [ ] Character glows/auras display correctly
- [ ] Pokemon-style text boxes render properly
- [ ] Choice hover effects work
- [ ] No layout shifts or broken styles

### 📊 Performance
- [ ] Initial load < 3 seconds
- [ ] No memory leaks after extended play
- [ ] Smooth 60fps during gameplay
- [ ] Bundle size reasonable (< 500KB JS)

### 🏗️ Build & Deployment
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No linting warnings that block build
- [ ] `.env.local` configured properly

### 🔍 Final Checks
- [ ] Test full playthrough of at least one character
- [ ] Check browser console - zero errors
- [ ] Verify localStorage saves work
- [ ] Test on different screen sizes

## Deployment Commands

```bash
# When all checks pass:
git add .
git commit -m "feat: [description of milestone]"
git checkout main
git merge development
git push origin main  # Triggers Cloudflare deployment

# Return to development
git checkout development
```

## Production URL
After push to main, changes deploy to: https://lux-story.pages.dev