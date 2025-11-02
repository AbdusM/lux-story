# SECURITY INCIDENT REPORT - P0 CRITICAL
**Date Discovered:** November 1, 2025
**Incident ID:** SI-2025-11-01-001
**Severity:** CRITICAL (P0)
**Status:** 🚨 ACTIVE - REQUIRES IMMEDIATE ACTION

---

## Executive Summary

Sensitive production credentials were committed to git repository history on **October 18, 2025** (commit `85bd72bbeb10ba9c5278159edd18b40a342dd137`) and subsequently removed on the same day (commit `2d168518be1b7cbdc715bb04635b2549c45e06cd`). However, the secrets remain accessible in git history to anyone with repository access.

**Impact:** HIGH - API keys provide unauthorized access to:
- Anthropic Claude API (unbounded usage billing)
- Google Gemini API (unbounded usage billing)
- Supabase database (full read/write access to all student data)
- Vercel deployment infrastructure

**Blast Radius:** Anyone with git repository access (commits, forks, clones) since Oct 18, 2025

---

## Exposed Credentials

### 1. ANTHROPIC_API_KEY (CRITICAL)
**Value:** `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`
**Service:** Anthropic Claude API
**Impact:**
- Unlimited API usage billed to your account
- Potential data exfiltration via API calls
- Reputation damage if used for abuse
**Action Required:**
1. Immediately rotate key at https://console.anthropic.com/settings/keys
2. Review API usage logs for suspicious activity since Oct 18
3. Enable spend limits

---

### 2. GEMINI_API_KEY (CRITICAL)
**Value:** `AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg`
**Service:** Google Gemini API
**Impact:**
- Unlimited API usage billed to Google Cloud account
- Potential quota exhaustion
**Action Required:**
1. Immediately revoke key at https://console.cloud.google.com/apis/credentials
2. Create new restricted key
3. Review Gemini API usage logs since Oct 18
4. Enable billing alerts

---

### 3. SUPABASE_SERVICE_ROLE_KEY (CRITICAL - HIGHEST PRIORITY)
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdmFsdnFjZWJvc2Z4YW11dmx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI3OTk5MiwiZXhwIjoyMDc0ODU1OTkyfQ.mmbJz9FDU93AcW8wbWyrAlTdYfPP-OLVTc6loG0EseE`
**Service:** Supabase Database (tavalvqcebosfxamuvlx.supabase.co)
**Impact:**
- **BYPASSES ALL ROW LEVEL SECURITY** - Full read/write access to all tables
- Access to student PII (personally identifiable information)
- Ability to modify/delete all user data
- Ability to create admin users
- GDPR/FERPA compliance violation risk
**Action Required:**
1. **IMMEDIATE:** Rotate service role key at https://app.supabase.com/project/tavalvqcebosfxamuvlx/settings/api
2. Review Supabase audit logs for unauthorized access since Oct 18
3. Verify data integrity (no unauthorized modifications)
4. Document incident for compliance (if handling student data)
5. Consider notifying affected users if PII accessed

**Database Access Details:**
- Project: tavalvqcebosfxamuvlx
- URL: https://tavalvqcebosfxamuvlx.supabase.co
- Tables at risk: skill_demonstrations, career_explorations, user_profiles, etc.

---

### 4. VERCEL_OIDC_TOKEN (HIGH)
**Value:** `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9...` (truncated)
**Service:** Vercel Deployment
**Impact:**
- Potential unauthorized deployments
- Access to environment variables
- Token likely expired (issued Oct 2024, expires after 12 hours)
**Action Required:**
1. Review Vercel deployment logs for unauthorized activity
2. Rotate team access tokens
3. Enable 2FA on Vercel account if not already enabled

---

### 5. ADMIN_API_TOKEN (MEDIUM)
**Value:** `"admin"`
**Service:** Internal admin authentication
**Impact:**
- Weak password provides trivial access to admin dashboard
- View all student data
- Modify configurations
**Action Required:**
1. Immediately change to strong password (32+ chars, randomly generated)
2. Implement password hashing (currently plaintext comparison)
3. Review admin access logs since Oct 4 (when password changed to "admin")

---

## Timeline of Events

| Date | Event | Commit |
|------|-------|--------|
| Oct 2, 2025 | Admin API token moved server-side (security fix) | 58616543 |
| Oct 4, 2025 | **Admin password simplified to "admin"** | cee0da67 |
| Oct 18, 2025 10:19 AM | .env.production committed **WITH SECRETS** | 85bd72bb |
| Oct 18, 2025 10:21 AM | .env.production removed from repo | 2d168518 |
| Nov 1, 2025 | **Incident discovered during forensic audit** | Current |

**Exposure Window:** October 18, 2025 - Present (14 days)

---

## Affected Systems

### Confirmed Exposure:
- ✅ Git repository history (commit 85bd72bb)
- ✅ Any clones/forks created after Oct 18
- ✅ CI/CD logs (if .env printed during builds)

### Potential Exposure:
- ⚠️ GitHub/GitLab repository (if pushed to remote)
- ⚠️ Developer machines (local git clones)
- ⚠️ Backup systems
- ⚠️ Code search engines (if public repo)

---

## Immediate Actions Required (Next 2 Hours)

### Priority 1 (Do NOW):
1. ✅ **Rotate Supabase service role key** - https://app.supabase.com/project/tavalvqcebosfxamuvlx/settings/api
2. ✅ **Rotate Anthropic API key** - https://console.anthropic.com/settings/keys
3. ✅ **Rotate Gemini API key** - https://console.cloud.google.com/apis/credentials
4. ✅ **Change admin password to strong value** - Update ADMIN_API_TOKEN in Vercel env vars

### Priority 2 (Next 2 Hours):
5. ⏳ Review Supabase audit logs (Oct 18 - Nov 1)
6. ⏳ Review Anthropic API usage (Oct 18 - Nov 1)
7. ⏳ Review Gemini API usage (Oct 18 - Nov 1)
8. ⏳ Check if repository is public (GitHub/GitLab)
9. ⏳ Update all deployment environments with new keys

### Priority 3 (Next 24 Hours):
10. ⏳ Purge .env files from git history (use BFG Repo-Cleaner)
11. ⏳ Force push cleaned history (coordinate with team)
12. ⏳ Document incident for compliance
13. ⏳ Implement pre-commit hooks to prevent future secrets in git
14. ⏳ Add secret scanning (GitHub Advanced Security or GitGuardian)

---

## Remediation Steps

### Step 1: Rotate All Secrets (IMMEDIATE)

**Anthropic API Key:**
```bash
# 1. Go to https://console.anthropic.com/settings/keys
# 2. Click "Revoke" on exposed key
# 3. Create new key
# 4. Update Vercel environment variables:
vercel env rm ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY production
# Paste new key when prompted
```

**Gemini API Key:**
```bash
# 1. Go to https://console.cloud.google.com/apis/credentials
# 2. Find key: AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg
# 3. Click "Delete"
# 4. Create new API key with restrictions
# 5. Update Vercel:
vercel env rm GEMINI_API_KEY production
vercel env add GEMINI_API_KEY production
```

**Supabase Service Role Key:**
```bash
# 1. Go to https://app.supabase.com/project/tavalvqcebosfxamuvlx/settings/api
# 2. Find "service_role key (secret)"
# 3. Click "Reset" to generate new key
# 4. Copy new key
# 5. Update Vercel:
vercel env rm SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

**Admin Password:**
```bash
# Generate strong password
openssl rand -base64 32

# Update Vercel:
vercel env rm ADMIN_API_TOKEN production
vercel env add ADMIN_API_TOKEN production
# Paste generated password
```

### Step 2: Audit Logs

**Supabase:**
```sql
-- Check for suspicious activity (run in Supabase SQL Editor)
SELECT
  created_at,
  event_type,
  ip_address,
  user_agent
FROM auth.audit_log_entries
WHERE created_at >= '2025-10-18'
ORDER BY created_at DESC;
```

**Anthropic:**
- Check usage dashboard for unusual spikes
- Review API calls for unfamiliar patterns

**Gemini:**
- Check Cloud Console → APIs & Services → Metrics
- Look for usage anomalies

### Step 3: Purge Git History

```bash
# Install BFG Repo-Cleaner
brew install bfg

# Clone fresh copy (mirror)
git clone --mirror https://github.com/your-org/lux-story.git

# Remove .env files from history
cd lux-story.git
bfg --delete-files .env.production

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (COORDINATE WITH TEAM FIRST)
git push --force

# All team members must re-clone:
# git clone https://github.com/your-org/lux-story.git
```

**WARNING:** Force push rewrites history. All collaborators must re-clone.

### Step 4: Prevent Future Incidents

**Add to .gitignore:**
```bash
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore
git add .gitignore
git commit -m "security: prevent .env files in git"
```

**Install pre-commit hook:**
```bash
# Install gitleaks for secret scanning
brew install gitleaks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
gitleaks protect --staged --verbose
EOF

chmod +x .git/hooks/pre-commit
```

**Enable GitHub Secret Scanning (if applicable):**
- Go to repository Settings → Security → Code security and analysis
- Enable "Secret scanning"
- Enable "Push protection"

---

## Compliance Considerations

### FERPA (if handling student education records):
- Potential unauthorized access to education records
- Incident must be documented
- May require notification to institution

### GDPR (if handling EU user data):
- Potential data breach
- Assess if notification required (72-hour rule)
- Document remediation steps

### SOC 2 / ISO 27001:
- Document incident in security log
- Review access controls
- Update incident response plan

---

## Lessons Learned

### Root Causes:
1. **Human error:** .env.production accidentally committed
2. **Missing safeguards:** No pre-commit hooks to detect secrets
3. **Weak password:** Admin password set to "admin" for convenience
4. **No secret scanning:** GitHub Advanced Security not enabled

### Preventive Measures:
1. ✅ Implement pre-commit hooks (gitleaks)
2. ✅ Enable GitHub secret scanning
3. ✅ Add .env to .gitignore (verify)
4. ✅ Use secret management (Vercel env vars, not .env files)
5. ✅ Regular security audits
6. ✅ Developer training on secret management
7. ✅ Implement password hashing (not plaintext)

---

## Contact Information

**Report Created By:** Claude Code Forensic Audit
**Incident Manager:** [TO BE ASSIGNED]
**Security Contact:** [TO BE ASSIGNED]

---

## Status Checklist

- [ ] All secrets rotated
- [ ] Logs reviewed for unauthorized access
- [ ] Data integrity verified
- [ ] Git history purged
- [ ] Pre-commit hooks installed
- [ ] Team notified
- [ ] Compliance documented
- [ ] Preventive measures implemented
- [ ] Incident report filed
- [ ] Post-mortem scheduled

---

**Last Updated:** November 1, 2025
**Next Review:** After all secrets rotated and logs reviewed
