#!/usr/bin/env node

import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

/**
 * Analyze codebase for typewriter effect usage and compliance with MESSAGE_TYPES.md rules
 */
async function analyzeTypewriterCompliance() {
  try {
    console.log('🔍 Analyzing codebase for typewriter effect compliance...\n')
    
    // Read MESSAGE_TYPES.md rules
    const rulesPath = path.join(process.cwd(), 'MESSAGE_TYPES.md')
    const rules = await fs.readFile(rulesPath, 'utf8')
    
    // Read story data
    const storyPath = path.join(process.cwd(), 'data/grand-central-story.json')
    const storyData = await fs.readFile(storyPath, 'utf8')
    
    // Read component implementation
    const gameInterfacePath = path.join(process.cwd(), 'components/GameInterface.tsx')
    const gameInterface = await fs.readFile(gameInterfacePath, 'utf8')
    
    // Read StoryMessage component
    const storyMessagePath = path.join(process.cwd(), 'components/StoryMessage.tsx')
    const storyMessage = await fs.readFile(storyMessagePath, 'utf8')
    
    // Read useMessageManager hook
    const messageManagerPath = path.join(process.cwd(), 'hooks/useMessageManager.ts')
    const messageManager = await fs.readFile(messageManagerPath, 'utf8')
    
    const analysisPrompt = `
# Typewriter Effect Compliance Analysis

You are a UX/UI expert analyzing a narrative game codebase for compliance with typewriter effect rules.

## Current Rules (from MESSAGE_TYPES.md):
${rules}

## Files to Analyze:

### Story Data:
\`\`\`json
${storyData.slice(0, 10000)}... [truncated for analysis]
\`\`\`

### GameInterface Implementation:
\`\`\`typescript
${gameInterface}
\`\`\`

### StoryMessage Component:
\`\`\`typescript
${storyMessage}
\`\`\`

### Message Manager:
\`\`\`typescript
${messageManager}
\`\`\`

## Analysis Tasks:

### 1. Rule Compliance Audit
- Analyze the \`shouldUseTypewriter\` function in GameInterface.tsx
- Check if it properly implements the 7±2 cognitive chunks principle
- Verify the >85% quoted content rule is correctly implemented
- Identify any logic that violates the "instant for everything else" rule

### 2. Story Content Analysis
- Scan through story scenes and identify potential typewriter usage
- Flag any content that might incorrectly trigger typewriter effect
- Look for letter/note content that should use typewriter
- Check for mixed description+content that should be split

### 3. Scalability Assessment
- Evaluate if current implementation scales across the entire story
- Identify potential edge cases or inconsistencies
- Suggest improvements for maintainability

### 4. Performance Impact
- Assess cognitive load impact of current typewriter usage
- Evaluate user flow disruption potential
- Check for any unnecessary slow-downs in narrative pace

### 5. Implementation Gaps
- Look for hardcoded typewriter: true/false that bypasses the rules
- Check if all message types properly use the shouldUseTypewriter function
- Identify any components that might ignore the typewriter setting

## Expected Output Format:

### ✅ COMPLIANCE STATUS
- Overall compliance score (1-10)
- Key rules being followed correctly
- Implementation strengths

### ⚠️ ISSUES FOUND
- Rule violations with specific file/line references
- Logic inconsistencies
- Potential user experience problems

### 🔧 RECOMMENDATIONS
- Specific code changes needed
- Story content adjustments required
- Architectural improvements for scalability

### 📊 STORY CONTENT AUDIT
- Count of scenes that should use typewriter
- Count of scenes that should be instant
- Any problematic mixed content identified

### 🚀 SCALABILITY IMPROVEMENTS
- Suggested refactoring for better maintainability
- Automated testing approaches
- Future-proofing recommendations

Focus on practical, actionable insights that ensure the 7±2 cognitive chunks principle is maintained throughout the entire narrative experience.
`

    const result = await model.generateContent(analysisPrompt)
    const analysis = result.response.text()
    
    // Save analysis to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outputPath = path.join(process.cwd(), `analysis/typewriter-compliance-${timestamp}.md`)
    
    // Ensure analysis directory exists
    await fs.mkdir(path.join(process.cwd(), 'analysis'), { recursive: true })
    await fs.writeFile(outputPath, analysis)
    
    console.log('📊 TYPEWRITER EFFECT COMPLIANCE ANALYSIS')
    console.log('=' .repeat(50))
    console.log(analysis)
    console.log('=' .repeat(50))
    console.log(`\n💾 Full analysis saved to: ${outputPath}`)
    
    return analysis
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message)
    
    if (error.message.includes('API key')) {
      console.log('\n🔑 Please set your GEMINI_API_KEY environment variable:')
      console.log('export GEMINI_API_KEY=your_api_key_here')
    }
    
    return null
  }
}

/**
 * Create automated check script that can be run in CI/CD
 */
async function createAutomatedCheck() {
  const checkScript = `#!/usr/bin/env node

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
    const hardcodedTrue = gameInterface.match(/typewriter:\\s*true(?!.*shouldUseTypewriter)/g)
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
`
  
  await fs.writeFile('scripts/check-typewriter-compliance.js', checkScript)
  await fs.chmod('scripts/check-typewriter-compliance.js', 0o755)
  
  console.log('✅ Created automated compliance checker: scripts/check-typewriter-compliance.js')
}

// Main execution
async function main() {
  if (process.argv.includes('--check-only')) {
    await createAutomatedCheck()
    return
  }
  
  await analyzeTypewriterCompliance()
  await createAutomatedCheck()
  
  console.log('\n🎯 NEXT STEPS:')
  console.log('1. Review the analysis output above')
  console.log('2. Make recommended code changes')
  console.log('3. Run: node scripts/check-typewriter-compliance.js')
  console.log('4. Add compliance check to your CI/CD pipeline')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}