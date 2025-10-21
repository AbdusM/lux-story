# Vercel Deployment Guide
Grand Central Terminus - Birmingham Career Exploration

## Quick Deploy to Vercel

### Prerequisites
- Vercel account (free tier works for development)
- Vercel CLI installed: `npm install -g vercel`
- All required API keys and database credentials

---

## Step 1: Install and Login to Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login
```

---

## Step 2: Configure Environment Variables

### Method A: Using Vercel CLI (Recommended)

```bash
# Set each required variable for production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ANTHROPIC_API_KEY production
vercel env add GEMINI_API_KEY production
vercel env add ADMIN_API_TOKEN production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Optional: Add for all environments (production, preview, development)
vercel env add CHOICE_SIMILARITY_THRESHOLD
# Enter: 0.85

vercel env add ENABLE_SEMANTIC_SIMILARITY
# Enter: false
```

### Method B: Using Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable below:

#### Required Server-Side Variables
| Variable | Value Source | Environment | Secret? |
|----------|-------------|-------------|---------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | Production | No |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon/public key | Production | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key | Production | **Yes** |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | Production | **Yes** |
| `GEMINI_API_KEY` | aistudio.google.com/app/apikey | Production | **Yes** |
| `ADMIN_API_TOKEN` | Use `admin` (or generate secure token with `openssl rand -hex 32`) | Production | **Yes** |

#### Required Client-Side Variables
| Variable | Value Source | Environment | Secret? |
|----------|-------------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Same as SUPABASE_URL | Production | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as SUPABASE_ANON_KEY | Production | No |

#### Optional Production Variables
| Variable | Value | Environment | Secret? |
|----------|-------|-------------|---------|
| `SENTRY_DSN` | sentry.io project settings | Production | No |
| `NEXT_PUBLIC_SENTRY_DSN` | sentry.io project settings | Production | No |
| `CHOICE_SIMILARITY_THRESHOLD` | `0.85` | All | No |
| `ENABLE_SEMANTIC_SIMILARITY` | `false` | All | No |

---

## Step 3: Verify Environment Variables

### Check Variables are Set

```bash
# List all environment variables for your project
vercel env ls

# Expected output:
# Environment Variables
#   SUPABASE_URL                     (Production)
#   SUPABASE_ANON_KEY                (Production)
#   SUPABASE_SERVICE_ROLE_KEY        (Production)
#   ANTHROPIC_API_KEY                (Production)
#   GEMINI_API_KEY                   (Production)
#   ADMIN_API_TOKEN                  (Production)
#   NEXT_PUBLIC_SUPABASE_URL         (Production)
#   NEXT_PUBLIC_SUPABASE_ANON_KEY    (Production)
```

### Pull Environment Variables Locally (Optional)

```bash
# Download production environment variables to .env.local
vercel env pull .env.local

# ⚠️ WARNING: This will overwrite your existing .env.local
# Backup first: cp .env.local .env.local.backup
```

---

## Step 4: Deploy to Vercel

### First-Time Deployment

```bash
# Navigate to project directory
cd /path/to/lux-story

# Deploy to production
vercel --prod

# Follow prompts:
# ? Set up and deploy "~/lux-story"? [Y/n] y
# ? Which scope? [Your Team/Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? lux-story
# ? In which directory is your code located? ./
```

### Subsequent Deployments

```bash
# Deploy to production
vercel --prod

# Or use npm script (validates env first)
npm run deploy:vercel
```

---

## Step 5: Verify Deployment

### Check Deployment Status

```bash
# Get deployment URL
vercel ls

# Expected output:
# lux-story (Production)
#   https://lux-story.vercel.app
#   https://lux-story-git-main-yourteam.vercel.app
```

### Test Critical Endpoints

```bash
# Test health endpoint
curl https://lux-story.vercel.app/api/health

# Test admin API (requires token)
curl https://lux-story.vercel.app/api/admin/skill-data?userId=test_user \
  -H "Authorization: Bearer YOUR_ADMIN_API_TOKEN"

# Test Supabase connection
curl https://lux-story.vercel.app/api/health/db
```

### Verify Admin Dashboard

1. Visit: `https://lux-story.vercel.app/admin`
2. Login with `ADMIN_API_TOKEN` value
3. Verify users load from Supabase
4. Check that Skills tab displays data

---

## Step 6: Automated Verification Script

### Run Production Verification

```bash
# Verify local environment
npm run verify:admin

# Verify production deployment (manual check)
# 1. Visit: https://lux-story.vercel.app/admin
# 2. Login with admin token
# 3. Confirm data loads from Supabase
```

### Expected Output

```
🔍 ADMIN DASHBOARD CONNECTIVITY TEST
════════════════════════════════════════════

✅ Supabase connection established
✅ Service role key working (RLS bypassed)
✅ Admin API endpoint accessible
✅ User profiles loaded: 21 users
✅ Skill summaries retrieved successfully
✅ Career explorations retrieved successfully

════════════════════════════════════════════
✅ ADMIN DASHBOARD PRODUCTION READY
```

---

## Troubleshooting

### Issue: "Missing environment variables" error

**Cause:** Environment variables not set in Vercel or typo in variable names

**Fix:**
```bash
# Check which variables are missing
vercel env ls

# Add missing variables
vercel env add MISSING_VARIABLE_NAME production
```

### Issue: Admin dashboard shows "No users found"

**Cause:** `SUPABASE_SERVICE_ROLE_KEY` not set or incorrect

**Fix:**
```bash
# Verify service role key is set
vercel env ls | grep SERVICE_ROLE

# If missing, add it
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste key from: Supabase Dashboard → Settings → API → service_role

# Redeploy
vercel --prod
```

### Issue: API routes return 404

**Cause:** Using static export (`output: 'export'` in next.config.js)

**Fix:** Ensure `next.config.js` does NOT have `output: 'export'` (Vercel needs API routes):

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  // NO output: 'export' - Vercel handles serverless functions
}
```

### Issue: Database queries fail with RLS errors

**Cause:** Client-side code trying to access restricted data

**Fix:** Ensure admin dashboard uses admin API routes (with service role key):

```typescript
// ✅ Correct: Use admin API route
const response = await fetch(`/api/admin/skill-data?userId=${userId}`)

// ❌ Wrong: Direct client-side Supabase query
const { data } = await supabase.from('player_profiles').select('*')
```

### Issue: "Rate limit exceeded" errors

**Cause:** Too many Gemini/Anthropic API calls

**Fix:**
```bash
# Check API usage in respective dashboards:
# - Anthropic: console.anthropic.com
# - Gemini: aistudio.google.com

# Upgrade to paid tier if needed
# Or add rate limiting to API routes
```

---

## Security Best Practices

### ✅ DO:
- Mark sensitive keys as "Secret" in Vercel Dashboard
- Use different `ADMIN_API_TOKEN` for production vs development
- Rotate API keys quarterly
- Enable Vercel's automatic HTTPS
- Use Vercel's built-in DDoS protection

### ❌ DON'T:
- Expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- Use `NEXT_PUBLIC_` prefix for sensitive keys
- Commit `.env.local` to version control
- Share admin tokens publicly
- Use same admin token across environments

---

## Environment Variable Reference

### Full List with Descriptions

```bash
# ============================================================================
# SUPABASE CONFIGURATION
# ============================================================================

# Server-side Supabase URL (API routes only)
SUPABASE_URL=https://tavalvqcebosfxamuvlx.supabase.co

# Server-side Supabase Anon Key (API routes only)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (CRITICAL - Bypasses RLS for admin operations)
# ⚠️ NEVER expose to client-side code
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Client-side Supabase URL (exposed to browser via NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://tavalvqcebosfxamuvlx.supabase.co

# Client-side Supabase Anon Key (exposed to browser via NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================================================
# AI API CONFIGURATION
# ============================================================================

# Anthropic Claude API Key (for live choice generation)
# Get from: https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Google Gemini API Key (for skill-aware dialogue)
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyxxxxx

# ============================================================================
# ADMIN CONFIGURATION
# ============================================================================

# Admin API Authentication Token
# Generate with: openssl rand -hex 32
# Used for: /app/api/admin/* routes and /admin dashboard login
ADMIN_API_TOKEN=admin

# ============================================================================
# FEATURE FLAGS
# ============================================================================

# Enable semantic similarity for choice filtering (true/false)
ENABLE_SEMANTIC_SIMILARITY=false

# Choice similarity threshold (0.0 to 1.0)
# Higher = more strict filtering
CHOICE_SIMILARITY_THRESHOLD=0.85

# ============================================================================
# MONITORING & ERROR TRACKING (Optional)
# ============================================================================

# Sentry DSN for server-side error tracking
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Sentry DSN for client-side error tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

---

## Quick Command Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Add environment variable
vercel env add VARIABLE_NAME production

# List environment variables
vercel env ls

# Pull environment variables to local .env
vercel env pull .env.local

# Deploy to production
vercel --prod

# View deployment logs
vercel logs https://lux-story.vercel.app

# Rollback to previous deployment
vercel rollback

# Open project in Vercel dashboard
vercel dashboard
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in Vercel
- [ ] Service role key marked as "Secret"
- [ ] Admin token rotated from development value
- [ ] Database migrations applied to production Supabase
- [ ] Local validation passes: `npm run validate-env`
- [ ] Production build succeeds: `npm run build`
- [ ] Deployment complete: `vercel --prod`
- [ ] Admin dashboard accessible: `https://your-app.vercel.app/admin`
- [ ] Users load from Supabase (verify 21+ users)
- [ ] Skills tab displays data correctly
- [ ] No console errors in production

---

## Support

### Resources
- **Vercel Documentation:** https://vercel.com/docs
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables
- **Supabase Documentation:** https://supabase.com/docs
- **Project Issues:** https://github.com/AbdusM/lux-story/issues

### Common Commands

```bash
# View Vercel project settings
vercel project ls

# Check deployment status
vercel ls

# View build logs
vercel logs

# Redeploy (force rebuild)
vercel --prod --force
```

---

**Last Updated:** January 2025
**Deployment Platform:** Vercel (Recommended)
**Database:** Supabase (Production)
