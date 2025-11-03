/**
 * Comprehensive Audit Script
 * Checks for modal transparency and API spam issues
 */

import * as fs from 'fs'
import * as path from 'path'

interface Issue {
  file: string
  line: number
  type: 'modal_opacity' | 'duplicate_api' | 'no_cache'
  severity: 'critical' | 'warning' | 'info'
  description: string
  suggestion: string
}

const issues: Issue[] = []

// Check modal backdrop opacity
function checkModalOpacity(file: string, content: string) {
  const lines = content.split('\n')
  lines.forEach((line, idx) => {
    // Check for low opacity backdrops
    if (line.includes('bg-black/10') && line.includes('fixed inset-0')) {
      issues.push({
        file,
        line: idx + 1,
        type: 'modal_opacity',
        severity: 'critical',
        description: 'Modal backdrop has only 10% opacity (too transparent)',
        suggestion: 'Change bg-black/10 to bg-black/70 for better visibility'
      })
    }

    if (line.includes('bg-black/50') && line.includes('fixed inset-0')) {
      issues.push({
        file,
        line: idx + 1,
        type: 'modal_opacity',
        severity: 'warning',
        description: 'Modal backdrop has 50% opacity (may be too transparent)',
        suggestion: 'Consider bg-black/70 for better modal focus'
      })
    }

    // Check for missing bg-white on cards in modals
    if (line.includes('<Card') && !line.includes('bg-white')) {
      // Check next few lines for Card content in a modal
      const nextLines = lines.slice(idx, idx + 5).join('\n')
      if (lines[idx - 3]?.includes('fixed inset-0')) {
        issues.push({
          file,
          line: idx + 1,
          type: 'modal_opacity',
          severity: 'warning',
          description: 'Modal Card may be transparent (missing bg-white)',
          suggestion: 'Add bg-white class to Card component'
        })
      }
    }
  })
}

// Check for duplicate API calls
function checkDuplicateAPICalls(file: string, content: string) {
  const lines = content.split('\n')

  lines.forEach((line, idx) => {
    // Check for nested .then().then() which might indicate duplication
    if (line.match(/\.then\([^)]*\)\.then\([^)]*\)/)) {
      const context = lines.slice(Math.max(0, idx - 2), idx + 3).join('\n')
      if (context.includes('loadSkillProfile') || context.includes('fetch(')) {
        issues.push({
          file,
          line: idx + 1,
          type: 'duplicate_api',
          severity: 'warning',
          description: 'Nested Promise chains may cause duplicate requests',
          suggestion: 'Review Promise chain structure for potential duplication'
        })
      }
    }

    // Check for catch blocks that retry the same operation
    if (line.includes('.catch(') && idx < lines.length - 5) {
      const catchBlock = lines.slice(idx, idx + 10).join('\n')
      if ((catchBlock.match(/loadSkillProfile/g) || []).length > 1) {
        issues.push({
          file,
          line: idx + 1,
          type: 'duplicate_api',
          severity: 'critical',
          description: 'Catch block calls same function again (duplicate request)',
          suggestion: 'Use single Promise chain with proper error handling'
        })
      }
    }

    // Check for missing caching on profile loads
    if (line.includes('loadSkillProfile(') && !file.includes('skill-profile-adapter.ts')) {
      const prevLines = lines.slice(Math.max(0, idx - 10), idx).join('\n')
      if (!prevLines.includes('cache') && !prevLines.includes('Cache')) {
        issues.push({
          file,
          line: idx + 1,
          type: 'no_cache',
          severity: 'info',
          description: 'Profile load without apparent caching',
          suggestion: 'Consider caching to prevent duplicate requests'
        })
      }
    }
  })
}

// Scan directory recursively
function scanDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // Skip node_modules, .git, etc
      if (!['node_modules', '.git', '.next', 'backup', 'archive'].includes(entry.name)) {
        scanDirectory(fullPath)
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      // Skip test files and config files
      if (!entry.name.includes('.test.') && !entry.name.includes('.config.')) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const relativePath = path.relative(process.cwd(), fullPath)

        checkModalOpacity(relativePath, content)
        checkDuplicateAPICalls(relativePath, content)
      }
    }
  }
}

// Generate report
function generateReport() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗')
  console.log('║  Modal Opacity & API Spam Audit Report                  ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  const critical = issues.filter(i => i.severity === 'critical')
  const warnings = issues.filter(i => i.severity === 'warning')
  const info = issues.filter(i => i.severity === 'info')

  console.log(`📊 Summary:`)
  console.log(`   🔴 Critical: ${critical.length}`)
  console.log(`   🟡 Warnings: ${warnings.length}`)
  console.log(`   🔵 Info: ${info.length}`)
  console.log(`   Total: ${issues.length}\n`)

  if (critical.length > 0) {
    console.log('\n🔴 CRITICAL ISSUES:\n')
    critical.forEach(issue => {
      console.log(`   📁 ${issue.file}:${issue.line}`)
      console.log(`   ❌ ${issue.description}`)
      console.log(`   💡 ${issue.suggestion}\n`)
    })
  }

  if (warnings.length > 0) {
    console.log('\n🟡 WARNINGS:\n')
    warnings.forEach(issue => {
      console.log(`   📁 ${issue.file}:${issue.line}`)
      console.log(`   ⚠️  ${issue.description}`)
      console.log(`   💡 ${issue.suggestion}\n`)
    })
  }

  if (info.length > 0 && info.length < 20) {
    console.log('\n🔵 INFO (less critical):\n')
    info.slice(0, 10).forEach(issue => {
      console.log(`   📁 ${issue.file}:${issue.line}`)
      console.log(`   ℹ️  ${issue.description}`)
      console.log(`   💡 ${issue.suggestion}\n`)
    })
    if (info.length > 10) {
      console.log(`   ... and ${info.length - 10} more info items\n`)
    }
  }

  // Group by file
  console.log('\n📋 Issues by File:\n')
  const byFile = new Map<string, Issue[]>()
  issues.forEach(issue => {
    if (!byFile.has(issue.file)) {
      byFile.set(issue.file, [])
    }
    byFile.get(issue.file)!.push(issue)
  })

  Array.from(byFile.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 15)
    .forEach(([file, fileIssues]) => {
      const criticalCount = fileIssues.filter(i => i.severity === 'critical').length
      const warningCount = fileIssues.filter(i => i.severity === 'warning').length
      const infoCount = fileIssues.filter(i => i.severity === 'info').length

      console.log(`   ${file}`)
      if (criticalCount > 0) console.log(`      🔴 ${criticalCount} critical`)
      if (warningCount > 0) console.log(`      🟡 ${warningCount} warnings`)
      if (infoCount > 0) console.log(`      🔵 ${infoCount} info`)
      console.log()
    })
}

// Run audit
console.log('🔍 Scanning codebase...\n')
scanDirectory(process.cwd())
generateReport()

console.log('\n✅ Audit complete!\n')
