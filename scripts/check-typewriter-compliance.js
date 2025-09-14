#!/usr/bin/env node

// Automated typewriter compliance checker
// Run this in CI/CD to catch violations before deployment

import fs from 'fs/promises'
import path from 'path'

async function quickComplianceCheck() {
  const issues = []
  
  try {
    // Check GameInterface.tsx for hardcoded typewriter values
    const gameInterface = await fs.readFile('components/GameInterface.tsx', 'utf8')
    
    // Look for hardcoded typewriter: true (except in shouldUseTypewriter logic)
    const hardcodedTrue = gameInterface.match(/typewriter:\s*true(?!.*shouldUseTypewriter)/g)
    if (hardcodedTrue) {
      issues.push('❌ Found hardcoded typewriter: true in GameInterface.tsx')
    }
    
    // Check for proper shouldUseTypewriter usage
    if (!gameInterface.includes('shouldUseTypewriter(enhancedText, scene.type, speaker)')) {
      issues.push('❌ shouldUseTypewriter function not being called properly')
    }
    
    // Check MESSAGE_TYPES.md exists
    try {
      await fs.access('MESSAGE_TYPES.md')
    } catch {
      issues.push('❌ MESSAGE_TYPES.md documentation missing')
    }
    
    // Report results
    if (issues.length === 0) {
      console.log('✅ Typewriter compliance check passed')
      process.exit(0)
    } else {
      console.log('❌ Typewriter compliance issues found:')
      issues.forEach(issue => console.log(issue))
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Compliance check failed:', error.message)
    process.exit(1)
  }
}

quickComplianceCheck()
