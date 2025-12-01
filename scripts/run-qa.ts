#!/usr/bin/env tsx
/**
 * Comprehensive QA Test Runner
 * 
 * Runs all tests and provides a summary of errors and issues
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface TestResult {
  suite: string
  passed: number
  failed: number
  skipped: number
  errors: string[]
}

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command: string, description: string): { success: boolean; output: string } {
  log(`\n${'='.repeat(60)}`, 'cyan')
  log(`Running: ${description}`, 'blue')
  log(`${'='.repeat(60)}`, 'cyan')
  
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd()
    })
    return { success: true, output }
  } catch (error: any) {
    return { 
      success: false, 
      output: error.stdout || error.stderr || error.message 
    }
  }
}

function parseVitestOutput(output: string): TestResult {
  const lines = output.split('\n')
  const errors: string[] = []
  let passed = 0
  let failed = 0
  let skipped = 0
  
  for (const line of lines) {
    // Count test results
    const passMatch = line.match(/(\d+)\s+passed/)
    if (passMatch) passed = parseInt(passMatch[1])
    
    const failMatch = line.match(/(\d+)\s+failed/)
    if (failMatch) failed = parseInt(failMatch[1])
    
    const skipMatch = line.match(/(\d+)\s+skipped/)
    if (skipMatch) skipped = parseInt(skipMatch[1])
    
    // Collect errors
    if (line.includes('FAIL') || line.includes('Error:') || line.includes('✗')) {
      errors.push(line.trim())
    }
  }
  
  return { suite: 'Unit Tests (Vitest)', passed, failed, skipped, errors }
}

function checkTypeErrors(): { success: boolean; errors: string[] } {
  log(`\n${'='.repeat(60)}`, 'cyan')
  log('Running TypeScript Type Check', 'blue')
  log(`${'='.repeat(60)}`, 'cyan')
  
  try {
    execSync('npx tsc --noEmit', { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd()
    })
    return { success: true, errors: [] }
  } catch (error: any) {
    const output = error.stdout || error.stderr || error.message
    const errorLines = output.split('\n').filter((line: string) => 
      line.includes('error TS') || line.includes('Error:')
    )
    return { success: false, errors: errorLines }
  }
}

function checkLintErrors(): { success: boolean; errors: string[] } {
  log(`\n${'='.repeat(60)}`, 'cyan')
  log('Running ESLint', 'blue')
  log(`${'='.repeat(60)}`, 'cyan')
  
  try {
    execSync('npm run lint', { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd()
    })
    return { success: true, errors: [] }
  } catch (error: any) {
    const output = error.stdout || error.stderr || error.message
    const errorLines = output.split('\n').filter((line: string) => 
      line.trim().length > 0 && !line.includes('npm')
    )
    return { success: false, errors: errorLines }
  }
}

function checkBuildErrors(): { success: boolean; errors: string[] } {
  log(`\n${'='.repeat(60)}`, 'cyan')
  log('Running Build Check', 'blue')
  log(`${'='.repeat(60)}`, 'cyan')
  
  try {
    execSync('npm run build', { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd()
    })
    return { success: true, errors: [] }
  } catch (error: any) {
    const output = error.stdout || error.stderr || error.message
    const errorLines = output.split('\n').filter((line: string) => 
      (line.includes('error') || line.includes('Error') || line.includes('Failed')) && 
      !line.includes('node_modules')
    )
    return { success: false, errors: errorLines.slice(0, 20) } // Limit to first 20 errors
  }
}

async function main() {
  log('\n🚀 Starting Comprehensive QA Test Suite', 'cyan')
  log('='.repeat(60), 'cyan')
  
  const results: TestResult[] = []
  const allErrors: string[] = []
  
  // 1. Type Check
  const typeCheck = checkTypeErrors()
  if (!typeCheck.success) {
    log('\n❌ TypeScript Errors Found:', 'red')
    typeCheck.errors.forEach(err => log(`  ${err}`, 'red'))
    allErrors.push(...typeCheck.errors)
  } else {
    log('\n✅ TypeScript: No errors', 'green')
  }
  
  // 2. Lint Check
  const lintCheck = checkLintErrors()
  if (!lintCheck.success) {
    log('\n❌ Linting Errors Found:', 'red')
    lintCheck.errors.slice(0, 10).forEach(err => log(`  ${err}`, 'red'))
    allErrors.push(...lintCheck.errors.slice(0, 10))
  } else {
    log('\n✅ Linting: No errors', 'green')
  }
  
  // 3. Unit Tests
  const unitTestResult = runCommand('npm run test:run', 'Unit Tests (Vitest)')
  const vitestResult = parseVitestOutput(unitTestResult.output)
  results.push(vitestResult)
  
  if (vitestResult.failed > 0) {
    log(`\n❌ Unit Tests: ${vitestResult.failed} failed`, 'red')
    vitestResult.errors.slice(0, 10).forEach(err => log(`  ${err}`, 'red'))
    allErrors.push(...vitestResult.errors.slice(0, 10))
  } else {
    log(`\n✅ Unit Tests: ${vitestResult.passed} passed`, 'green')
  }
  
  // 4. Build Check
  const buildCheck = checkBuildErrors()
  if (!buildCheck.success) {
    log('\n❌ Build Errors Found:', 'red')
    buildCheck.errors.forEach(err => log(`  ${err}`, 'red'))
    allErrors.push(...buildCheck.errors)
  } else {
    log('\n✅ Build: Successful', 'green')
  }
  
  // Summary
  log(`\n${'='.repeat(60)}`, 'cyan')
  log('📊 QA Test Summary', 'cyan')
  log('='.repeat(60), 'cyan')
  
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)
  const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0)
  
  log(`\nTests: ${totalPassed} passed, ${totalFailed} failed, ${totalSkipped} skipped`, 
    totalFailed > 0 ? 'red' : 'green')
  
  log(`Type Check: ${typeCheck.success ? '✅ Pass' : '❌ Fail'}`, 
    typeCheck.success ? 'green' : 'red')
  log(`Linting: ${lintCheck.success ? '✅ Pass' : '❌ Fail'}`, 
    lintCheck.success ? 'green' : 'red')
  log(`Build: ${buildCheck.success ? '✅ Pass' : '❌ Fail'}`, 
    buildCheck.success ? 'green' : 'red')
  
  const hasFailures = totalFailed > 0 || !typeCheck.success || !lintCheck.success || !buildCheck.success
  
  if (hasFailures) {
    log(`\n${'='.repeat(60)}`, 'red')
    log(`❌ QA Checks Found Issues`, 'red')
    log('='.repeat(60), 'red')
    
    if (totalFailed > 0) {
      log(`\n❌ ${totalFailed} test(s) failed`, 'red')
    }
    if (!typeCheck.success) {
      log(`\n❌ TypeScript errors found`, 'red')
    }
    if (!lintCheck.success) {
      log(`\n❌ Linting errors found`, 'red')
    }
    if (!buildCheck.success) {
      log(`\n❌ Build errors found`, 'red')
    }
    
    if (allErrors.length > 0) {
      log('\nTop Errors:', 'yellow')
      allErrors.slice(0, 20).forEach((err, i) => {
        log(`${i + 1}. ${err.substring(0, 100)}${err.length > 100 ? '...' : ''}`, 'yellow')
      })
      if (allErrors.length > 20) {
        log(`\n... and ${allErrors.length - 20} more errors`, 'yellow')
      }
    }
  } else {
    log(`\n${'='.repeat(60)}`, 'green')
    log('✅ All QA checks passed!', 'green')
    log('='.repeat(60), 'green')
  }
  
  // Exit with error code if any failures
  process.exit(hasFailures ? 1 : 0)
}

main().catch(error => {
  log(`\n❌ QA script failed: ${error.message}`, 'red')
  process.exit(1)
})
