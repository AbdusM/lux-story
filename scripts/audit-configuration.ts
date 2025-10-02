/**
 * Configuration Audit Script
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Detects configuration drift, hardcoded assumptions, and environment inconsistencies
 *
 * Categories:
 * 1. Port/URL hardcoding
 * 2. Environment variable misuse
 * 3. API endpoint inconsistencies
 * 4. Secret exposure risks
 * 5. Package.json vs code alignment
 *
 * Usage: npx tsx scripts/audit-configuration.ts
 * CI/CD: Add to pre-commit or GitHub Actions
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// ============================================================================
// CONFIGURATION
// ============================================================================

interface AuditRule {
  name: string
  category: 'security' | 'consistency' | 'performance' | 'maintainability'
  severity: 'critical' | 'high' | 'medium' | 'low'
  check: () => Promise<AuditFinding[]>
}

interface AuditFinding {
  rule: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  file: string
  line?: number
  issue: string
  recommendation: string
  autofix?: string
}

const IGNORED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'out',
  'coverage',
  '.vercel'
]

const PACKAGE_JSON = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
)

// Extract expected port from package.json
const DEV_SCRIPT = PACKAGE_JSON.scripts?.dev || ''
const EXPECTED_PORT = DEV_SCRIPT.match(/PORT=(\d+)/)?.[1] || '3000'

// ============================================================================
// AUDIT RULES
// ============================================================================

const AUDIT_RULES: AuditRule[] = [
  {
    name: 'hardcoded-localhost-ports',
    category: 'consistency',
    severity: 'high',
    check: async () => {
      const findings: AuditFinding[] = []

      // Search for localhost:XXXX patterns
      const result = execSync(
        `grep -rn "localhost:[0-9]\\+" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=out --exclude-dir=coverage --exclude-dir=.vercel . || true`,
        { encoding: 'utf-8' }
      )

      const lines = result.trim().split('\n').filter(Boolean)

      for (const line of lines) {
        const match = line.match(/^(.+):(\d+):(.+localhost:(\d+).+)$/)
        if (!match) continue

        const [, file, lineNum, content, port] = match

        // Check if port matches expected
        if (port !== EXPECTED_PORT) {
          findings.push({
            rule: 'hardcoded-localhost-ports',
            severity: 'high',
            file: file.replace('./', ''),
            line: parseInt(lineNum),
            issue: `Hardcoded localhost:${port} (expected: ${EXPECTED_PORT})`,
            recommendation: `Replace with localhost:${EXPECTED_PORT} or use environment variable`,
            autofix: content.replace(new RegExp(`localhost:${port}`, 'g'), `localhost:${EXPECTED_PORT}`)
          })
        }
      }

      return findings
    }
  },

  {
    name: 'env-variable-exposure',
    category: 'security',
    severity: 'critical',
    check: async () => {
      const findings: AuditFinding[] = []

      // Check for NEXT_PUBLIC_ prefix on sensitive variables
      const result = execSync(
        `grep -rn "NEXT_PUBLIC_.*\\(TOKEN\\|KEY\\|SECRET\\|PASSWORD\\)" --include="*.ts" --include="*.tsx" --include="*.js" --include=".env*" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=out --exclude-dir=coverage --exclude-dir=.vercel . || true`,
        { encoding: 'utf-8' }
      )

      const lines = result.trim().split('\n').filter(Boolean)

      for (const line of lines) {
        const match = line.match(/^(.+):(\d+):(.+)$/)
        if (!match) continue

        const [, file, lineNum, content] = match

        findings.push({
          rule: 'env-variable-exposure',
          severity: 'critical',
          file: file.replace('./', ''),
          line: parseInt(lineNum),
          issue: 'Sensitive variable exposed with NEXT_PUBLIC_ prefix',
          recommendation: 'Remove NEXT_PUBLIC_ prefix and use server-side only',
          autofix: content.replace(/NEXT_PUBLIC_/g, '')
        })
      }

      return findings
    }
  },

  {
    name: 'env-file-consistency',
    category: 'maintainability',
    severity: 'medium',
    check: async () => {
      const findings: AuditFinding[] = []

      const envExample = path.join(process.cwd(), '.env.example')
      const envLocal = path.join(process.cwd(), '.env.local')

      if (!fs.existsSync(envExample)) {
        findings.push({
          rule: 'env-file-consistency',
          severity: 'medium',
          file: '.env.example',
          issue: '.env.example file missing',
          recommendation: 'Create .env.example as template for new developers'
        })
        return findings
      }

      if (!fs.existsSync(envLocal)) {
        findings.push({
          rule: 'env-file-consistency',
          severity: 'low',
          file: '.env.local',
          issue: '.env.local file missing',
          recommendation: 'Create .env.local from .env.example template'
        })
        return findings
      }

      // Check for keys in .env.local not documented in .env.example
      const exampleVars = new Set(
        fs.readFileSync(envExample, 'utf-8')
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .map(line => line.split('=')[0].trim())
      )

      const localVars = new Set(
        fs.readFileSync(envLocal, 'utf-8')
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .map(line => line.split('=')[0].trim())
      )

      // Check for undocumented variables
      for (const varName of localVars) {
        if (!exampleVars.has(varName) && !exampleVars.has(`# ${varName}`)) {
          findings.push({
            rule: 'env-file-consistency',
            severity: 'medium',
            file: '.env.local',
            issue: `Variable ${varName} not documented in .env.example`,
            recommendation: `Add ${varName}=example-value to .env.example`
          })
        }
      }

      return findings
    }
  },

  {
    name: 'gitignore-coverage',
    category: 'security',
    severity: 'critical',
    check: async () => {
      const findings: AuditFinding[] = []

      const gitignorePath = path.join(process.cwd(), '.gitignore')
      if (!fs.existsSync(gitignorePath)) {
        findings.push({
          rule: 'gitignore-coverage',
          severity: 'critical',
          file: '.gitignore',
          issue: '.gitignore file missing',
          recommendation: 'Create .gitignore to prevent secret exposure'
        })
        return findings
      }

      const gitignore = fs.readFileSync(gitignorePath, 'utf-8')

      // Check critical patterns
      const requiredPatterns = [
        { pattern: '.env*.local', reason: 'Prevents committing secrets' },
        { pattern: '.env.local', reason: 'Prevents committing secrets' },
        { pattern: 'node_modules', reason: 'Prevents committing dependencies' },
        { pattern: '.next', reason: 'Prevents committing build artifacts' }
      ]

      for (const { pattern, reason } of requiredPatterns) {
        if (!gitignore.includes(pattern)) {
          findings.push({
            rule: 'gitignore-coverage',
            severity: 'critical',
            file: '.gitignore',
            issue: `Missing pattern: ${pattern}`,
            recommendation: `Add "${pattern}" to .gitignore (${reason})`
          })
        }
      }

      return findings
    }
  },

  {
    name: 'api-base-url-consistency',
    category: 'consistency',
    severity: 'medium',
    check: async () => {
      const findings: AuditFinding[] = []

      // Find all API base URL definitions
      const result = execSync(
        `grep -rn "API_BASE\\|apiBase\\|baseUrl\\|baseURL" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=out --exclude-dir=coverage --exclude-dir=.vercel . || true`,
        { encoding: 'utf-8' }
      )

      const lines = result.trim().split('\n').filter(Boolean)
      const urlPatterns = new Map<string, string[]>()

      for (const line of lines) {
        const match = line.match(/^(.+):(\d+):(.+)$/)
        if (!match) continue

        const [, file, lineNum, content] = match

        // Extract URL pattern
        const urlMatch = content.match(/['"`](https?:\/\/[^'"`]+)['"`]/)
        if (urlMatch) {
          const url = urlMatch[1]
          if (!urlPatterns.has(url)) {
            urlPatterns.set(url, [])
          }
          urlPatterns.get(url)!.push(`${file}:${lineNum}`)
        }
      }

      // If multiple different base URLs found, flag inconsistency
      if (urlPatterns.size > 3) { // Allow some variance for prod/dev/test
        findings.push({
          rule: 'api-base-url-consistency',
          severity: 'medium',
          file: 'multiple',
          issue: `Found ${urlPatterns.size} different API base URLs`,
          recommendation: 'Consolidate to single configuration source (lib/config.ts)',
          autofix: Array.from(urlPatterns.entries())
            .map(([url, files]) => `  ${url}: ${files.length} instances`)
            .join('\n')
        })
      }

      return findings
    }
  },

  {
    name: 'hardcoded-secrets',
    category: 'security',
    severity: 'critical',
    check: async () => {
      const findings: AuditFinding[] = []

      // Search for potential secrets (long alphanumeric strings)
      const result = execSync(
        `grep -rn "\\(api.*key\\|secret\\|token\\|password\\).*=.*['\\"\\x60][A-Za-z0-9_-]\\{32,\\}['\\"\\x60]" --include="*.ts" --include="*.tsx" --include="*.js" --exclude=".env*" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=out --exclude-dir=coverage --exclude-dir=.vercel -i . || true`,
        { encoding: 'utf-8' }
      )

      const lines = result.trim().split('\n').filter(Boolean)

      for (const line of lines) {
        const match = line.match(/^(.+):(\d+):(.+)$/)
        if (!match) continue

        const [, file, lineNum, content] = match

        // Skip comments
        if (content.trim().startsWith('//') || content.trim().startsWith('*')) {
          continue
        }

        findings.push({
          rule: 'hardcoded-secrets',
          severity: 'critical',
          file: file.replace('./', ''),
          line: parseInt(lineNum),
          issue: 'Potential hardcoded secret detected',
          recommendation: 'Move to environment variable and add to .env.local'
        })
      }

      return findings
    }
  },

  {
    name: 'package-json-alignment',
    category: 'consistency',
    severity: 'low',
    check: async () => {
      const findings: AuditFinding[] = []

      // Check if referenced scripts exist
      const scripts = PACKAGE_JSON.scripts || {}

      for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
        if (typeof scriptCommand !== 'string') continue

        // Check for npx tsx references to files
        const fileMatch = (scriptCommand as string).match(/npx tsx (scripts\/[^ ]+\.ts)/)
        if (fileMatch) {
          const scriptFile = path.join(process.cwd(), fileMatch[1])
          if (!fs.existsSync(scriptFile)) {
            findings.push({
              rule: 'package-json-alignment',
              severity: 'medium',
              file: 'package.json',
              issue: `Script "${scriptName}" references missing file: ${fileMatch[1]}`,
              recommendation: `Create ${fileMatch[1]} or remove script from package.json`
            })
          }
        }
      }

      return findings
    }
  },

  {
    name: 'typescript-config-usage',
    category: 'maintainability',
    severity: 'low',
    check: async () => {
      const findings: AuditFinding[] = []

      // Check if using proper path aliases from tsconfig.json
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
      if (!fs.existsSync(tsconfigPath)) return findings

      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
      const pathAliases = tsconfig.compilerOptions?.paths || {}

      // Check for relative imports that could use aliases
      const result = execSync(
        `grep -rn "from ['\\"\\x60]\\.\\./" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=out --exclude-dir=coverage --exclude-dir=.vercel . || true`,
        { encoding: 'utf-8' }
      )

      const lines = result.trim().split('\n').filter(Boolean)

      if (lines.length > 50) { // Threshold for too many relative imports
        findings.push({
          rule: 'typescript-config-usage',
          severity: 'low',
          file: 'multiple',
          issue: `Found ${lines.length} relative imports that could use path aliases`,
          recommendation: 'Consider using "@/" path alias from tsconfig.json',
          autofix: `Example: import { Component } from '@/components/Component'`
        })
      }

      return findings
    }
  }
]

// ============================================================================
// AUDIT EXECUTION
// ============================================================================

async function runAudit(): Promise<void> {
  console.log('\n' + '='.repeat(70))
  console.log('🔍 CONFIGURATION AUDIT - Grand Central Terminus')
  console.log('='.repeat(70))
  console.log(`\nExpected Dev Port: ${EXPECTED_PORT}`)
  console.log(`Node Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Timestamp: ${new Date().toISOString()}\n`)

  const allFindings: AuditFinding[] = []

  // Run all audit rules
  for (const rule of AUDIT_RULES) {
    process.stdout.write(`\n📋 Running: ${rule.name} (${rule.category})... `)

    try {
      const findings = await rule.check()
      allFindings.push(...findings)

      if (findings.length === 0) {
        console.log('✅ PASS')
      } else {
        console.log(`⚠️  ${findings.length} issue(s)`)
      }
    } catch (error) {
      console.log('❌ ERROR')
      console.error(`   ${error}`)
    }
  }

  // Generate report
  console.log('\n' + '='.repeat(70))
  console.log('📊 AUDIT RESULTS')
  console.log('='.repeat(70))

  const bySeverity = {
    critical: allFindings.filter(f => f.severity === 'critical'),
    high: allFindings.filter(f => f.severity === 'high'),
    medium: allFindings.filter(f => f.severity === 'medium'),
    low: allFindings.filter(f => f.severity === 'low')
  }

  console.log(`\nTotal Issues: ${allFindings.length}`)
  console.log(`  🔴 Critical: ${bySeverity.critical.length}`)
  console.log(`  🟠 High:     ${bySeverity.high.length}`)
  console.log(`  🟡 Medium:   ${bySeverity.medium.length}`)
  console.log(`  🟢 Low:      ${bySeverity.low.length}`)

  // Detailed findings
  if (allFindings.length > 0) {
    console.log('\n' + '='.repeat(70))
    console.log('📝 DETAILED FINDINGS')
    console.log('='.repeat(70))

    for (const severity of ['critical', 'high', 'medium', 'low'] as const) {
      const findings = bySeverity[severity]
      if (findings.length === 0) continue

      console.log(`\n${severity.toUpperCase()} SEVERITY (${findings.length} issues):`)
      console.log('─'.repeat(70))

      for (const finding of findings) {
        console.log(`\n📍 ${finding.rule}`)
        console.log(`   File: ${finding.file}${finding.line ? `:${finding.line}` : ''}`)
        console.log(`   Issue: ${finding.issue}`)
        console.log(`   Fix: ${finding.recommendation}`)

        if (finding.autofix) {
          console.log(`   Autofix: ${finding.autofix.substring(0, 100)}${finding.autofix.length > 100 ? '...' : ''}`)
        }
      }
    }
  }

  // Exit code
  console.log('\n' + '='.repeat(70))

  const criticalCount = bySeverity.critical.length
  const highCount = bySeverity.high.length

  if (criticalCount > 0) {
    console.log('❌ AUDIT FAILED - Critical issues detected')
    console.log('   Fix critical issues before deployment')
    process.exit(1)
  } else if (highCount > 0) {
    console.log('⚠️  AUDIT WARNING - High severity issues detected')
    console.log('   Recommend fixing before deployment')
    process.exit(0) // Don't fail build, but warn
  } else if (allFindings.length > 0) {
    console.log('✅ AUDIT PASSED - Minor issues detected')
    console.log('   Address at your convenience')
    process.exit(0)
  } else {
    console.log('✅ AUDIT PASSED - No issues detected')
    process.exit(0)
  }
}

// Run audit
runAudit().catch(error => {
  console.error('\n❌ Audit execution failed:', error)
  process.exit(1)
})
