# 🚨 IMMEDIATE ACTION REQUIRED - SECRET ROTATION

**Discovered:** Nov 1, 2025
**Severity:** CRITICAL (P0)
**Time Sensitive:** Complete in next 2 hours

---

## What Happened?

`.env.production` containing API keys was committed to git on Oct 18, 2025, then removed. **Secrets are still in git history.**

**Exposed for 14 days:** October 18 - November 1, 2025

---

## Secrets to Rotate (In Priority Order)

### 1. Supabase Service Role Key (HIGHEST PRIORITY)
⏰ **Do this first** - Full database access exposed

**Steps:**
1. Go to: https://app.supabase.com/project/tavalvqcebosfxamuvlx/settings/api
2. Find "service_role key (secret)"
3. Click "Reset" → Copy new key
4. Update production environment:
   ```bash
   vercel env rm SUPABASE_SERVICE_ROLE_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   # Paste new key when prompted
   ```

**Why critical:** Bypasses ALL database security, full access to student data

---

### 2. Anthropic API Key
⏰ **Do immediately** - Unbounded billing risk

**Steps:**
1. Go to: https://console.anthropic.com/settings/keys
2. Find and revoke key starting with: `sk-ant-api03-7IAvMz...`
3. Create new key
4. Update production:
   ```bash
   vercel env rm ANTHROPIC_API_KEY production
   vercel env add ANTHROPIC_API_KEY production
   # Paste new key
   ```

**Why important:** Exposed key can rack up API charges

---

### 3. Gemini API Key
⏰ **Do immediately** - Unbounded billing risk

**Steps:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find and delete key: `AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg`
3. Create new restricted API key
4. Update production:
   ```bash
   vercel env rm GEMINI_API_KEY production
   vercel env add GEMINI_API_KEY production
   # Paste new key
   ```

---

### 4. Admin Password
⏰ **Do soon** - Currently set to weak "admin"

**Steps:**
1. Generate strong password:
   ```bash
   openssl rand -base64 32
   ```
2. Update production:
   ```bash
   vercel env rm ADMIN_API_TOKEN production
   vercel env add ADMIN_API_TOKEN production
   # Paste generated password
   ```

---

## After Rotating Secrets

### Check for Suspicious Activity:

**Supabase Logs:**
1. Go to: https://app.supabase.com/project/tavalvqcebosfxamuvlx/logs
2. Look for unusual activity Oct 18 - Nov 1
3. Check for unknown IP addresses

**Anthropic Usage:**
1. Go to: https://console.anthropic.com/settings/billing
2. Check usage graph for anomalies

**Gemini Usage:**
1. Go to: https://console.cloud.google.com/apis/dashboard
2. Check Gemini API metrics for spikes

---

## Redeploy Application

After updating all environment variables:

```bash
# Trigger redeployment with new secrets
vercel --prod
```

Or redeploy via Vercel dashboard.

---

## Don't Forget

- [ ] Rotate Supabase service role key
- [ ] Rotate Anthropic API key
- [ ] Rotate Gemini API key
- [ ] Generate new admin password
- [ ] Review logs for suspicious activity
- [ ] Redeploy application
- [ ] Read full SECURITY_INCIDENT_REPORT.md

---

## Questions?

See `SECURITY_INCIDENT_REPORT.md` for complete details, including:
- Full timeline of exposure
- Git history cleanup instructions
- Prevention measures (pre-commit hooks, secret scanning)
- Compliance considerations

---

**Next Steps After Rotation:**
1. Purge .env from git history (instructions in incident report)
2. Install pre-commit hooks to prevent future leaks
3. Enable GitHub secret scanning
4. Implement password hashing in admin auth
