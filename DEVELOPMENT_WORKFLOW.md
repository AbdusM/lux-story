# Development Workflow

## 🌿 Branch Strategy

- **`development`** - Active development branch (YOU ARE HERE)
- **`main`** - Production branch (auto-deploys to Cloudflare)

## 📝 Daily Development Flow

```bash
# Start your day
git checkout development
npm run dev
# Make changes, test locally at http://localhost:3000
```

## 🚀 Production Deployment (When Milestone Ready)

### Step 1: Complete Testing Checklist
Run through `TESTING_CHECKLIST.md` thoroughly

### Step 2: Commit Development Changes
```bash
git add .
git commit -m "feat: [milestone description]"
```

### Step 3: Merge to Production
```bash
git checkout main
git merge development --no-ff -m "Release: [milestone name]"
git push origin main  # Auto-deploys to Cloudflare
```

### Step 4: Return to Development
```bash
git checkout development
git merge main  # Keep development in sync
```

## 🛡️ Safety Rules

1. **NEVER** push directly to `main` without testing
2. **ALWAYS** work on `development` branch for changes
3. **TEST** locally before considering production
4. **VERIFY** at https://lux-story.pages.dev after deployment

## 🔄 Current Status

- Working Branch: `development` ✅
- Local Testing: http://localhost:3000
- Production: https://lux-story.pages.dev (only updates on main push)

## 📊 Milestone Tracking

Mark milestones when ready for production:

- [ ] Phase 1: Core game loop and character selection
- [ ] Phase 2: Full story integration
- [ ] Phase 3: Polish and effects
- [ ] Phase 4: Performance optimization
- [ ] Phase 5: Final release candidate