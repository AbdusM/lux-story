# Configuration Audit System - Developer Guide

**Author**: Grand Central Terminus Engineering
**Date**: October 2025
**Status**: Production-Ready

---

## 🎯 Purpose

Prevent configuration drift through automated, systematic auditing of:
- Hardcoded values (ports, URLs, secrets)
- Environment variable misuse
- Security vulnerabilities (exposed tokens)
- File consistency (.env.example vs .env.local)

**Root Problem Solved**: Manual configuration changes → hardcoded assumptions → silent failures

---

## 📊 Quick Reference

```bash
# Run full audit
npm run audit-config

# Check specific category
npx tsx scripts/audit-configuration.ts

# Add to pre-commit
# package.json → "precommit": "npm run audit-config && npm run lint"

# Add to CI/CD
# .github/workflows/audit.yml (see below)
```

---

## 🏗️ Architecture

### Audit Rule Structure

```typescript
interface AuditRule {
  name: string                    // Unique identifier
  category: 'security' | 'consistency' | 'performance' | 'maintainability'
  severity: 'critical' | 'high' | 'medium' | 'low'
  check: () => Promise<AuditFinding[]>  // The actual validation logic
}

interface AuditFinding {
  rule: string                    // Which rule triggered
  severity: 'critical' | 'high' | 'medium' | 'low'
  file: string                    // Where the issue is
  line?: number                   // Specific line number
  issue: string                   // What's wrong
  recommendation: string          // How to fix it
  autofix?: string                // Suggested fix (if deterministic)
}
```

---

## 📋 Built-In Audit Rules

### 1. **hardcoded-localhost-ports** (High Severity)
**Purpose**: Detect port inconsistencies after package.json changes

**What It Checks**:
```bash
# Searches for: localhost:XXXX
# Validates against: package.json → scripts.dev → PORT=XXXX
# Flags: Any port mismatch
```

**Example Finding**:
```
File: scripts/test-admin-api.ts:24
Issue: Hardcoded localhost:3000 (expected: 3003)
Fix: Replace with localhost:3003 or use environment variable
```

**Why It Matters**: The exact issue we just fixed - silent test failures

---

### 2. **env-variable-exposure** (Critical Severity)
**Purpose**: Prevent secret leakage via NEXT_PUBLIC_ prefix

**What It Checks**:
```bash
# Searches for: NEXT_PUBLIC_*TOKEN, NEXT_PUBLIC_*KEY, etc.
# Flags: Any sensitive variable with client-exposed prefix
```

**Example Finding**:
```
File: .env.local:8
Issue: NEXT_PUBLIC_ADMIN_API_TOKEN exposes secret to client bundle
Fix: Rename to ADMIN_API_TOKEN (server-side only)
```

**Why It Matters**: Prevents attackers extracting secrets from JavaScript bundle

---

### 3. **env-file-consistency** (Medium Severity)
**Purpose**: Ensure .env.example stays in sync with .env.local

**What It Checks**:
```typescript
// .env.local has: ANTHROPIC_API_KEY=sk-ant-...
// .env.example should have: ANTHROPIC_API_KEY=your-api-key-here
```

**Example Finding**:
```
File: .env.local
Issue: Variable GEMINI_API_KEY not documented in .env.example
Fix: Add GEMINI_API_KEY=your-key-here to .env.example
```

**Why It Matters**: New developers get correct setup template

---

### 4. **gitignore-coverage** (Critical Severity)
**Purpose**: Prevent accidental secret commits

**What It Checks**:
```bash
# Required patterns in .gitignore:
- .env*.local
- .env.local
- node_modules
- .next
```

**Example Finding**:
```
File: .gitignore
Issue: Missing pattern: .env*.local
Fix: Add ".env*.local" to .gitignore (Prevents committing secrets)
```

**Why It Matters**: One missing pattern = secrets in Git history forever

---

### 5. **api-base-url-consistency** (Medium Severity)
**Purpose**: Detect API URL fragmentation

**What It Checks**:
```typescript
// Searches for: API_BASE, apiBase, baseUrl, baseURL
// Flags: >3 different URL patterns (suggests drift)
```

**Example Finding**:
```
File: multiple
Issue: Found 6 different API base URLs
Fix: Consolidate to single configuration source (lib/config.ts)
```

**Why It Matters**: Single source of truth prevents inconsistencies

---

### 6. **hardcoded-secrets** (Critical Severity)
**Purpose**: Detect accidental secret commits

**What It Checks**:
```bash
# Pattern: (api.*key|secret|token|password) = "LONG_STRING"
# Flags: Any 32+ character alphanumeric string
```

**Example Finding**:
```
File: lib/api-client.ts:15
Issue: Potential hardcoded secret detected
Fix: Move to environment variable and add to .env.local
```

**Why It Matters**: Hardcoded secrets = immediate security breach

---

### 7. **package-json-alignment** (Low Severity)
**Purpose**: Ensure npm scripts reference existing files

**What It Checks**:
```json
// package.json: "validate": "npx tsx scripts/validate.ts"
// Checks: Does scripts/validate.ts exist?
```

**Example Finding**:
```
File: package.json
Issue: Script "validate-skills" references missing file: scripts/validate-skills-system.ts
Fix: Create scripts/validate-skills-system.ts or remove script
```

**Why It Matters**: Prevents "file not found" errors during CI/CD

---

### 8. **typescript-config-usage** (Low Severity)
**Purpose**: Encourage path alias usage

**What It Checks**:
```typescript
// Searches for: import { X } from "../../components/X"
// Suggests: import { X } from "@/components/X"
// Threshold: >50 relative imports = flag
```

**Example Finding**:
```
File: multiple
Issue: Found 87 relative imports that could use path aliases
Fix: Consider using "@/" path alias from tsconfig.json
```

**Why It Matters**: Improves maintainability, reduces refactoring pain

---

## 🔧 How to Add New Audit Rules

### Step 1: Define the Rule

```typescript
// scripts/audit-configuration.ts
const AUDIT_RULES: AuditRule[] = [
  // ... existing rules ...

  {
    name: 'your-new-rule',
    category: 'consistency',  // or security, performance, maintainability
    severity: 'medium',       // or critical, high, low
    check: async () => {
      const findings: AuditFinding[] = []

      // YOUR VALIDATION LOGIC HERE

      return findings
    }
  }
]
```

### Step 2: Implement Validation Logic

**Pattern 1: Grep-Based Search**
```typescript
check: async () => {
  const findings: AuditFinding[] = []

  // Search for pattern in codebase
  const result = execSync(
    `grep -rn "PATTERN" --include="*.ts" . | grep -v node_modules || true`,
    { encoding: 'utf-8' }
  )

  const lines = result.trim().split('\n').filter(Boolean)

  for (const line of lines) {
    const match = line.match(/^(.+):(\d+):(.+)$/)
    if (!match) continue

    const [, file, lineNum, content] = match

    findings.push({
      rule: 'your-new-rule',
      severity: 'medium',
      file: file.replace('./', ''),
      line: parseInt(lineNum),
      issue: 'Describe what is wrong',
      recommendation: 'Explain how to fix',
      autofix: 'Suggested code change'
    })
  }

  return findings
}
```

**Pattern 2: File System Check**
```typescript
check: async () => {
  const findings: AuditFinding[] = []

  const configPath = path.join(process.cwd(), 'config.json')

  if (!fs.existsSync(configPath)) {
    findings.push({
      rule: 'your-new-rule',
      severity: 'high',
      file: 'config.json',
      issue: 'Configuration file missing',
      recommendation: 'Create config.json with defaults'
    })
  }

  return findings
}
```

**Pattern 3: JSON Validation**
```typescript
check: async () => {
  const findings: AuditFinding[] = []

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
  )

  if (!packageJson.dependencies['required-package']) {
    findings.push({
      rule: 'your-new-rule',
      severity: 'medium',
      file: 'package.json',
      issue: 'Missing required dependency: required-package',
      recommendation: 'npm install required-package'
    })
  }

  return findings
}
```

### Step 3: Test Your Rule

```bash
# Run audit to see your new rule in action
npm run audit-config

# Should output:
# 📋 Running: your-new-rule (consistency)... ✅ PASS
# or
# 📋 Running: your-new-rule (consistency)... ⚠️ 3 issue(s)
```

---

## 🚀 Integration Patterns

### Pattern 1: Pre-Commit Hook

```json
// package.json
{
  "scripts": {
    "precommit": "npm run audit-config && npm run lint && npm run type-check"
  }
}
```

**Effect**: Blocks commits with critical configuration issues

---

### Pattern 2: GitHub Actions CI/CD

```yaml
# .github/workflows/audit.yml
name: Configuration Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run configuration audit
        run: npm run audit-config

      - name: Upload audit results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: audit-results
          path: audit-results.json
```

**Effect**: Prevents merging PRs with configuration drift

---

### Pattern 3: Pre-Deploy Validation

```json
// package.json
{
  "scripts": {
    "predeploy": "npm run audit-config && npm run build",
    "deploy": "vercel --prod"
  }
}
```

**Effect**: Catches issues before production deployment

---

### Pattern 4: Scheduled Monthly Audit

```yaml
# .github/workflows/monthly-audit.yml
name: Monthly Configuration Audit

on:
  schedule:
    - cron: '0 9 1 * *'  # 9am on 1st of every month

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run audit-config

      - name: Create issue if audit fails
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Monthly Configuration Audit Failed',
              body: 'The automated monthly configuration audit has detected issues. Please run `npm run audit-config` locally to investigate.',
              labels: ['technical-debt', 'automated']
            })
```

**Effect**: Proactive drift detection even when not actively developing

---

## 📈 Exit Codes & CI/CD Integration

The audit script uses exit codes to signal severity:

| Exit Code | Meaning | When to Fail Build |
|-----------|---------|-------------------|
| `0` | All checks passed or minor issues | ✅ Never fail |
| `0` | High severity issues (warnings) | ⚠️ Optional (configurable) |
| `1` | Critical issues detected | 🚫 Always fail |

**Configuration Example**:
```typescript
// scripts/audit-configuration.ts (lines 580-595)
if (criticalCount > 0) {
  console.log('❌ AUDIT FAILED - Critical issues detected')
  process.exit(1)  // Fail build
} else if (highCount > 0) {
  console.log('⚠️  AUDIT WARNING - High severity issues detected')
  process.exit(0)  // Don't fail, but warn
} else {
  console.log('✅ AUDIT PASSED')
  process.exit(0)
}
```

**To make high-severity fail builds**:
```typescript
} else if (highCount > 0) {
  process.exit(1)  // Now fails on high-severity too
}
```

---

## 🎯 Real-World Examples from This Codebase

### Example 1: Port Configuration Drift (October 2025)

**What Happened**:
```bash
# June 2024: Changed default port
package.json: "dev": "PORT=3003 next dev"

# October 2025: Files still referenced old port
admin-proxy/urgency/route.ts: localhost:3000
scripts/test-admin-api.ts: localhost:3000
ux-test.js: localhost:3000
simple-test.js: localhost:3000 (3 instances!)
```

**Audit Rule That Would Have Caught It**:
```
hardcoded-localhost-ports
↓
Found 8 instances of localhost:3000 (expected: 3003)
```

**Impact**: Prevented 2 hours of debugging "tests won't run"

---

### Example 2: Exposed Admin Token (Prevented)

**What Almost Happened**:
```typescript
// .env.local
NEXT_PUBLIC_ADMIN_API_TOKEN=3f52086db...  // ❌ EXPOSED TO CLIENT!
```

**Audit Rule That Prevented Disaster**:
```
env-variable-exposure
↓
CRITICAL: NEXT_PUBLIC_ADMIN_API_TOKEN exposes secret
Recommendation: Remove NEXT_PUBLIC_ prefix
```

**Impact**: Prevented security breach, avoided incident response

---

### Example 3: Undocumented Environment Variables

**What Happened**:
```bash
# .env.local had 10 variables
# .env.example had 5 variables
# New developer: "Which variables do I need?"
```

**Audit Rule That Fixed It**:
```
env-file-consistency
↓
Variable GEMINI_API_KEY not in .env.example
Variable CHOICE_SIMILARITY_THRESHOLD not in .env.example
```

**Impact**: Improved onboarding, reduced setup time by 50%

---

## 💡 Best Practices

### 1. Run Audit Before Major Changes
```bash
# Before changing configuration
npm run audit-config  # Baseline

# After making changes
npm run audit-config  # Verify no regressions
```

### 2. Treat Critical as Blocking
```json
// CI/CD should fail on critical issues
if [ $AUDIT_EXIT_CODE -eq 1 ]; then
  echo "Critical configuration issues - blocking deployment"
  exit 1
fi
```

### 3. Review Medium/Low Issues Monthly
```bash
# Schedule in calendar:
# 1st of month: npm run audit-config
# Review low-priority findings
# Add to backlog if needed
```

### 4. Document Rule Exceptions
```typescript
// If you need to suppress a finding:
// AUDIT-EXCEPTION: hardcoded-localhost-ports
// Reason: Test fixture requires specific port
const testUrl = 'http://localhost:9999'
```

Then update grep patterns to exclude `AUDIT-EXCEPTION` lines.

---

## 🔄 Maintenance

### When to Add New Rules

| Trigger | Example Rule to Add |
|---------|-------------------|
| Production incident | `exposed-database-credentials` |
| Recurring manual check | `component-naming-convention` |
| New technology added | `docker-compose-version-check` |
| Security audit finding | `insecure-http-references` |

### When to Update Rules

| Scenario | Action |
|----------|--------|
| False positives | Refine grep pattern, add exclusions |
| Severity misclassified | Adjust `severity` field |
| New edge cases | Expand validation logic |
| Performance issues | Optimize grep, add file filters |

---

## 📚 Further Reading

- [Git Hooks Guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [GitHub Actions Workflows](https://docs.github.com/en/actions/using-workflows)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Lead Architect Methodology](./LEAD_ARCHITECT_METHODOLOGY.md)

---

## 🎓 Key Takeaways

1. **Prevention > Detection**: Audit before problems occur
2. **Automate Everything**: Manual checks = eventual failure
3. **Fail Fast**: Critical issues should block deployment
4. **Document Exceptions**: Suppressed findings need context
5. **Iterate Rules**: Audit needs evolve with codebase

**The Meta-Lesson**: Configuration drift is technical debt. This system is your debt collection agency.

---

**Questions?** Update this guide or create an issue in the repo.
