# 🔍 Repository Move Verification Checklist

**Use this checklist after moving lux-story to 30_lux-story**

---

## ✅ Step 1: Basic Functionality Check
```bash
cd 30_lux-story
npm install
npm run dev
```

**Expected Results:**
- [ ] No installation errors
- [ ] Dev server starts on localhost:3000
- [ ] No console errors in terminal
- [ ] Game loads in browser without errors

---

## ✅ Step 2: Core Features Test
**In Browser (localhost:3000):**
- [ ] Intro screen displays correctly
- [ ] Character selection (Lux 🦥) works
- [ ] Story progression works (can advance through scenes)
- [ ] Pokemon-style dialogue boxes display properly
- [ ] Character avatars and animations still work
- [ ] No 404 errors in browser console

---

## ✅ Step 3: New Zippy Feature Test
**Test Phase 1 Implementation:**
- [ ] Create test message with speaker: 'Zippy'
- [ ] Zippy appears with butterfly emoji 🦋
- [ ] Zippy text shows blue color styling
- [ ] No errors when Zippy character displays

---

## ✅ Step 4: File Structure Verification
```bash
ls -la
```

**Should Include:**
- [ ] `components/` folder
- [ ] `lib/` folder
- [ ] `app/` folder
- [ ] `styles/` folder
- [ ] `story/` folder
- [ ] `package.json`
- [ ] `next.config.js`
- [ ] `ENHANCEMENT_STRATEGY.md`
- [ ] `REPOSITORY_MOVE_VERIFICATION.md` (this file)

**Important Hidden Files:**
- [ ] `.gitignore` (Next.js specific ignore rules)
- [ ] `.env.local` (local environment variables)
- [ ] `.next/` folder (build cache - can be regenerated)
- [ ] `.vercel/` folder (deployment config)
- [ ] `.DS_Store` (macOS file - safe to ignore)

**Note**: `.next/` and `node_modules/` can be regenerated, but other hidden files contain important configuration.

**⚠️ Security Check for .env.local:**
- [ ] Check `.env.local` content - remove any sensitive keys before git commit
- [ ] Ensure `.env.local` is in `.gitignore` (it should be)
- [ ] Consider creating `.env.example` for documentation if needed

---

## ✅ Step 5: Git Initialization for New Repository
**Since lux-story will be independent, initialize new git repo:**

```bash
git init
git add .
git commit -m "Initial commit: Independent lux-story repository

- Moved from actualizeme parent repo
- Includes Phase 1.1: Zippy character implementation
- All dependencies and configurations included
- Ready for independent development

🦋 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Expected:**
- [ ] New git repository initialized successfully
- [ ] All files committed to initial commit
- [ ] No errors during git init process

**Optional - Add Remote:**
```bash
# If you want to push to GitHub later
git remote add origin https://github.com/[username]/30_lux-story.git
```

---

## ✅ Step 6: Dependencies Check
```bash
npm list --depth=0
```

**Critical Dependencies Should Be Present:**
- [ ] next@15.4.6
- [ ] react@^18
- [ ] typescript@^5
- [ ] tailwindcss@^3
- [ ] All UI components working

---

## 🚨 If Any Checks Fail:

### Build Errors:
```bash
rm -rf .next node_modules/.cache
npm install
npm run dev
```

### Missing Files:
```bash
# Check if files were left behind in actualizeme
ls -la ../21_actualizeme/lux-story/
```

### Git Issues:
```bash
# Verify git remote
git remote -v
# Should point to new repository, not actualizeme
```

---

## ✅ Step 7: Enhancement Strategy Verification
- [ ] `ENHANCEMENT_STRATEGY.md` file exists
- [ ] Can follow Phase 1.2 (CSS animations) safely
- [ ] Todo system is ready for next phases

---

## 🎯 Success Criteria

**All green checkmarks = Ready to continue enhancement phases**

### Next Steps After Successful Move:
1. Commit any remaining changes
2. Begin Phase 1.2: Add Zippy CSS animations
3. Follow incremental enhancement strategy
4. Test each phase thoroughly

---

## 📞 Emergency Rollback

**If major issues occur:**
```bash
# Go back to actualizeme version
cd ../21_actualizeme/lux-story/
npm run dev
# Verify it still works, then debug move issues
```

---

**Note**: This verification ensures the enhanced lux-story works independently and is ready for continued character development without the complexity of the actualizeme parent repository.