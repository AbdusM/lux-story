# Final Deployment Checklist

**Grand Central Terminus - Birmingham Career Exploration**  
**Date:** November 29, 2025  
**Status:** Ready for Production Deployment

---

## Pre-Deployment Verification

### Code Quality ✅
- [x] TypeScript compilation: 0 errors
- [x] ESLint warnings: All critical warnings fixed (15 fixed)
- [x] Security headers: Enabled for production
- [x] Debug logging: Removed from middleware
- [x] Error boundaries: Integrated with Sentry

### Security ✅
- [x] Admin routes: Protected with authentication
- [x] API routes: Proper authorization checks
- [x] Environment variables: Documented and validated
- [x] Sensitive data: Not exposed in client bundle
- [x] RLS policies: Active in database

### Configuration ✅
- [x] Environment variables: All documented in `.env.example`
- [x] Next.js config: Production-ready
- [x] Build process: Successful
- [x] Database migrations: Documented (12 migrations)

---

## Deployment Steps

### Step 1: Environment Variables Setup

**Required Variables (8):**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # SECRET
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ANTHROPIC_API_KEY=sk-ant-api03-...  # SECRET
GEMINI_API_KEY=your_gemini_key  # SECRET
ADMIN_API_TOKEN=your_secure_token  # SECRET (min 32 chars)
```

**Optional Variables (2):**
```bash
SENTRY_DSN=https://...@sentry.io/...  # Recommended
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...  # Recommended
```

**Verification:**
```bash
npm run validate-env
```

### Step 2: Database Migrations

**Verify migrations applied:**
1. Go to Supabase Dashboard → SQL Editor
2. Run verification queries from `docs/03-deployment/02-migration-verification.md`
3. Ensure all 12 migrations are applied

**If migrations missing:**
- Apply via SQL Editor using files in `supabase/migrations/`
- Apply in order (001, 002, 003, etc.)

### Step 3: Build Verification

**Local build test:**
```bash
npm run build
npm run start  # Test production build locally
```

**Expected:**
- Build completes successfully
- No TypeScript errors
- No critical ESLint errors
- Application starts on port 3000

### Step 4: Pre-Deployment Tests

**Run test suite:**
```bash
npm run test:run        # Unit tests
npm run type-check      # TypeScript validation
npm run lint          # ESLint
npm run validate-env    # Environment validation
npm run validate-graphs # Dialogue graph validation
npm run validate-skills # Skills system validation
```

**All tests should pass.**

### Step 5: Deploy to Production

**Option A: Vercel (Recommended)**
```bash
npm run deploy:vercel
```

**Option B: Cloudflare Pages**
```bash
npm run build
npx wrangler pages deploy out --project-name=lux-story
```

### Step 6: Post-Deployment Verification

**Health Checks:**
```bash
# Application health
curl https://your-domain.com/api/health

# Database connectivity
curl https://your-domain.com/api/health/db

# Storage availability
curl https://your-domain.com/api/health/storage
```

**Manual Verification:**
1. Visit production URL
2. Test main game interface
3. Test admin dashboard (`/admin`)
4. Verify authentication works
5. Check all tabs load correctly
6. Verify no console errors
7. Test on mobile device

**Admin Dashboard Verification:**
1. Navigate to `/admin`
2. Login with `ADMIN_API_TOKEN`
3. Verify user list loads
4. Test all tabs (Skills, Careers, Evidence, Gaps, Urgency, Action)
5. Verify data displays correctly
6. Test Family/Research mode toggle

---

## Rollback Plan

If deployment fails:

1. **Revert to previous deployment:**
   - Vercel: Use deployment history to rollback
   - Cloudflare: Redeploy previous build

2. **Check logs:**
   - Vercel: Dashboard → Deployments → View logs
   - Cloudflare: Dashboard → Pages → View logs

3. **Verify environment variables:**
   ```bash
   vercel env ls  # For Vercel
   ```

4. **Database rollback (if needed):**
   - Review migration files for rollback SQL
   - Execute rollback via Supabase SQL Editor

---

## Monitoring Setup

### Sentry (Recommended)

**Setup:**
1. Create Sentry account at https://sentry.io
2. Create Next.js project
3. Copy DSN to environment variables
4. Errors will automatically be captured

**Verify:**
- Trigger a test error
- Check Sentry dashboard for error report

### Health Monitoring

**Endpoints:**
- `/api/health` - Application status
- `/api/health/db` - Database connectivity
- `/api/health/storage` - Storage availability

**Setup uptime monitoring:**
- Use service like UptimeRobot or Pingdom
- Monitor health endpoints every 5 minutes

---

## Post-Deployment Tasks

### Immediate (Within 24 hours)
- [ ] Verify all functionality works
- [ ] Check error logs (Sentry/console)
- [ ] Monitor performance metrics
- [ ] Test on multiple devices/browsers
- [ ] Verify admin dashboard access

### Short-term (Within 1 week)
- [ ] Monitor user feedback
- [ ] Review error reports
- [ ] Check database performance
- [ ] Verify backup procedures
- [ ] Document any issues found

### Ongoing
- [ ] Regular security updates
- [ ] Dependency updates
- [ ] Performance monitoring
- [ ] User analytics review

---

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run type-check`
- Check ESLint errors: `npm run lint`
- Verify all dependencies installed: `npm install`

### Deployment Fails
- Check environment variables are set
- Verify build succeeds locally
- Check deployment logs for specific errors

### Database Connection Issues
- Verify Supabase project is active (not paused)
- Check environment variables match Supabase dashboard
- Test connection via Supabase dashboard

### Admin Dashboard Not Accessible
- Verify `ADMIN_API_TOKEN` is set correctly
- Check middleware is working
- Verify cookie is being set (check browser dev tools)

---

## Success Criteria

Deployment is successful when:

✅ Application loads without errors  
✅ All API endpoints respond correctly  
✅ Admin dashboard accessible and functional  
✅ Database queries work  
✅ Health checks pass  
✅ No console errors in production  
✅ Mobile experience works  
✅ Performance is acceptable (<3s load time)

---

## Support Resources

- **Documentation:** `docs/03-deployment/`
- **Migration Guide:** `docs/03-deployment/02-migration-verification.md`
- **Environment Setup:** `.env.example`
- **Security Guide:** `SECURITY.md`
- **Supabase Setup:** `supabase/README.md`

---

**Ready to Deploy:** ✅ YES  
**Last Verified:** November 29, 2025  
**Build Status:** ✅ Passing  
**Test Status:** ✅ All Critical Tests Passing

---

*This checklist should be reviewed and updated after each deployment.*

