# Deployment Checklist
Grand Central Terminus - Birmingham Career Exploration

## Pre-Deployment (1-2 days before)

### Code Quality
- [ ] All tests passing (`npm run test:run`)
- [ ] TypeScript compilation clean (`npm run type-check`)
- [ ] ESLint issues resolved (`npm run lint`)
- [ ] No console.logs in production code (use logger instead)
- [ ] Bundle size within target (<200KB First Load JS)

### Environment Variables
- [ ] All required environment variables documented in `.env.example`
- [ ] Production environment variables set in hosting platform (see **Vercel Setup** below)
- [ ] Sentry DSN configured (if using Sentry)
- [ ] API keys rotated if needed
- [ ] No sensitive data in client-side env vars (no `NEXT_PUBLIC_` for secrets)

#### Vercel Environment Variable Setup
- [ ] **Supabase Variables Set:**
  ```bash
  vercel env add SUPABASE_URL production
  vercel env add SUPABASE_ANON_KEY production
  vercel env add SUPABASE_SERVICE_ROLE_KEY production  # Mark as Secret
  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
  ```
- [ ] **API Keys Set:**
  ```bash
  vercel env add ANTHROPIC_API_KEY production  # Mark as Secret
  vercel env add GEMINI_API_KEY production     # Mark as Secret
  vercel env add ADMIN_API_TOKEN production    # Mark as Secret
  ```
- [ ] **Verify all variables set:**
  ```bash
  vercel env ls  # Should show 8 required variables
  ```
- [ ] **Complete Vercel deployment guide:** See `docs/VERCEL_DEPLOYMENT_GUIDE.md`

### Database
- [ ] **Database backup created** (Supabase Dashboard → Database → Backups)
- [ ] All migrations tested on staging database
- [ ] Database migration scripts reviewed for safety
- [ ] Foreign key constraints verified
- [ ] Row Level Security (RLS) policies tested

### Security
- [ ] Security headers configured
- [ ] CORS policies reviewed
- [ ] API rate limiting in place
- [ ] Authentication flows tested
- [ ] PII handling verified (logging, error reporting)

### Testing
- [ ] Critical user flows tested manually
  - [ ] New user onboarding
  - [ ] Choice selection and progression
  - [ ] Admin dashboard access
  - [ ] Career exploration flow
  - [ ] Skills tracking
- [ ] Mobile responsiveness verified (375px, 768px, 1024px)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Accessibility audit (WCAG AA compliance)

## Deployment Day

### Pre-Deployment Steps
1. [ ] **Create database backup** (if not done in last 24 hours)
   ```bash
   # Supabase Dashboard → Database → Backups → Create Backup
   # Note backup ID: ______________
   ```

2. [ ] **Verify environment variables**
   ```bash
   npm run audit-config  # Validates all required env vars
   ```

3. [ ] **Run full test suite**
   ```bash
   npm run test:run
   npm run type-check
   npm run lint
   ```

4. [ ] **Build production bundle**
   ```bash
   npm run build
   ```

5. [ ] **Check bundle size**
   ```bash
   # Review .next/static/chunks for bundle sizes
   # First Load JS should be <200KB
   ```

### Deployment Execution
1. [ ] **Deploy to production**
   ```bash
   npm run deploy
   # Or: Use hosting platform's deployment UI
   ```

2. [ ] **Verify deployment URL**
   - Production URL: ______________________
   - Deployment time: ____________________

### Post-Deployment Verification (Critical - 15 minutes)

#### Health Checks
- [ ] General health: `https://[your-domain]/api/health`
  - Expected: `{ "status": "healthy" }`
- [ ] Database health: `https://[your-domain]/api/health/db`
  - Expected: `{ "status": "healthy", "checks": {...} }`
- [ ] Storage health: `https://[your-domain]/api/health/storage`
  - Expected: `{ "status": "healthy" }`

#### Critical Path Testing
- [ ] Homepage loads without errors
- [ ] User can start new game session
- [ ] Choices are selectable and progress story
- [ ] Admin dashboard accessible (test credentials)
- [ ] Skills tracking works
- [ ] Career exploration displays

#### Admin Dashboard Verification
- [ ] **Run automated verification:**
  ```bash
  # Local verification first
  npm run verify:admin

  # Then verify production
  VERCEL_URL=https://[your-domain] npm run verify:admin:prod
  ```
- [ ] **Manual admin dashboard test:**
  - [ ] Visit: `https://[your-domain]/admin`
  - [ ] Login with `ADMIN_API_TOKEN` value
  - [ ] Verify users load from Supabase (should see 21+ users)
  - [ ] Check Skills tab displays data
  - [ ] Verify Evidence tab loads correctly
  - [ ] Test Family/Research mode toggle works
- [ ] **Database connectivity confirmed:**
  - [ ] Admin API endpoint working: `/api/admin/skill-data`
  - [ ] Service role key bypassing RLS correctly
  - [ ] User profiles loading from Supabase
  - [ ] No localStorage fallback in production

#### Monitoring
- [ ] Error tracking dashboard (Sentry) - no new critical errors
- [ ] Application logs - no unexpected warnings
- [ ] Database connection pool - within normal limits
- [ ] API response times - <2s for all endpoints

### Post-Deployment (24 hours)

#### Monitoring
- [ ] Check error rates (should be <1%)
- [ ] Review performance metrics
  - [ ] Page load time <3s
  - [ ] Time to Interactive <5s
  - [ ] Core Web Vitals passing
- [ ] Database query performance
- [ ] API endpoint response times

#### User Feedback
- [ ] Monitor user reports/support tickets
- [ ] Check social media for feedback
- [ ] Review analytics for unusual patterns

#### Documentation
- [ ] Update deployment log
- [ ] Document any issues encountered
- [ ] Update runbook with lessons learned

## Rollback Procedure

### When to Rollback
- Critical errors affecting >10% of users
- Database corruption or data loss
- Security vulnerability discovered
- Core functionality broken

### Rollback Steps
1. [ ] **Revert code deployment**
   ```bash
   # Use hosting platform's rollback feature
   # Or: git revert [commit-hash] && git push
   ```

2. [ ] **Restore database if needed**
   ```bash
   # Supabase Dashboard → Database → Backups → Restore
   # Use backup ID from pre-deployment step
   ```

3. [ ] **Verify rollback success**
   - [ ] Health checks passing
   - [ ] Critical paths working
   - [ ] No data loss

4. [ ] **Document incident**
   - What went wrong: ____________________
   - Root cause: _________________________
   - Fix applied: ________________________
   - Prevention: _________________________

## Emergency Contacts

- **On-call Engineer:** [Your contact]
- **Database Admin:** [Your contact]
- **Product Owner:** [Your contact]
- **Sentry Support:** support@sentry.io
- **Supabase Support:** support@supabase.com
- **Hosting Support:** [Your hosting provider]

## Post-Mortem (If Issues Occurred)

- [ ] Incident timeline documented
- [ ] Root cause analysis completed
- [ ] Prevention measures identified
- [ ] Documentation updated
- [ ] Team debriefing scheduled

## Success Criteria

Deployment is considered successful when:
- ✅ All health checks passing
- ✅ Critical user flows working
- ✅ Error rate <1%
- ✅ Performance metrics within targets
- ✅ No data loss or corruption
- ✅ No security incidents
- ✅ User feedback positive

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Sign-off:** _______________ (Lead Engineer)
**Sign-off:** _______________ (Product Owner)
