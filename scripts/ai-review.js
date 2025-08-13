#!/usr/bin/env node

/**
 * AI Code Review Script
 * Sends codebase to Google Gemini for analysis
 */

const fs = require('fs')
const path = require('path')

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
const VIDEO_PATH = process.env.VIDEO_PATH || process.argv[2] // Accept video path as argument

// Files to include in review
const REVIEW_FILES = [
  'components/GameInterface.tsx',
  'components/StoryMessage.tsx', 
  'components/ChoiceButtons.tsx',
  'components/LuxCompanion.tsx',
  'hooks/usePatience.ts',
  'hooks/useMessageManager.ts',
  'lib/story-engine.ts',
  'lib/game-state.ts',
  'lib/narrative-enhancements.ts',
  'app/subtle-enhancements.css'
]

// Deep Critical Analysis Framework prompt
const REVIEW_CONTEXT = `
# The Deep Critical Analysis Framework
*For Uncovering What Should Have Been Evident*

## Core Directive

You are a ruthlessly honest systems analyst who specializes in identifying the gap between intention and execution. Your role is not to praise effort or validate good intentions, but to expose contradictions, over-engineering, hidden complexity, and self-deception in this creative work. You operate from a position of skeptical inquiry: if something claims to be simple, prove it's actually complex. If it claims to solve a problem, find the new problems it creates.

## What They CLAIM About Lux Story:
- "Minimal UI, maximum narrative impact"
- "Contemplative, not rushed gameplay"
- "No stats displays, progress bars, or gamification" 
- "Neuroscience principles integrated invisibly"
- "Clean React architecture"
- "Accessibility-first design"
- "Pokemon-style chat interface for familiarity"
- "Patience rewarded with deeper narrative"

## Your Mission:
Apply the Deep Critical Analysis Framework to expose contradictions, hidden complexity, and self-deception in both the CODEBASE and the VIDEO DEMONSTRATION of the actual user experience. Look for gaps between what the code promises and what users actually encounter. Look for:

1. **The Contradiction Hunter**: Features that directly oppose stated philosophy
2. **The Complexity Excavator**: Count every system, rule, decision point
3. **The Euphemism Detector**: Where language does PR work instead of truth
4. **The Problem Generator**: What new problems each "solution" creates
5. **The Theater Spotter**: Performative vs actually functional elements

## Required Output:

### 1. Executive Contradiction Summary
Start with the biggest lie in one devastating sentence.

### 2. The Should-Have-Been-Obvious List  
Bullet point problems any honest review would catch:
- [Find 8-10 specific contradictions between claims and implementation]

### 3. Specific Evidence Mapping
For each major contradiction, use this format:
---
THEY CLAIM: "[Exact quote]"
THEY BUILT: [List specific contradictory elements]
THE TRUTH: [What it actually is]
---

### 4. The Cascading Failure Analysis
Show how their solutions create new problems.

### 5. The Uncomfortable Questions
End with 5-7 questions they're avoiding about their design choices.

Be ruthlessly honest. Count every system. Expose every euphemism. Find every contradiction. This is not about validation - it's about truth.

---

## CODEBASE TO ANALYZE:
`

async function readCodebase() {
  const codebase = []
  
  for (const file of REVIEW_FILES) {
    const filePath = path.join(process.cwd(), file)
    
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      codebase.push(`\n### ${file}\n\`\`\`typescript\n${content}\n\`\`\``)
    } catch (error) {
      console.warn(`⚠️  Could not read ${file}: ${error.message}`)
    }
  }
  
  return codebase.join('\n')
}

async function sendToGemini(prompt, videoPath = null) {
  const parts = [{ text: prompt }]
  
  // Add video if provided
  if (videoPath && fs.existsSync(videoPath)) {
    console.log('📹 Including video analysis...')
    const videoData = fs.readFileSync(videoPath)
    const videoBase64 = videoData.toString('base64')
    
    parts.push({
      inlineData: {
        mimeType: 'video/mp4', // Adjust if different format
        data: videoBase64
      }
    })
  }

  const requestBody = {
    contents: [
      {
        parts: parts
      }
    ],
    generationConfig: {
      temperature: 0.1, // Low temperature for more focused, analytical responses
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192
    },
    systemInstruction: {
      parts: [{
        text: "You are analyzing both code and video. Focus heavily on contradictions between stated philosophy and actual user experience shown in the video."
      }]
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  }

  try {
    const fetch = (await import('node-fetch')).default
    
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody),
      timeout: 300000 // 5 minute timeout for large videos
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error('Unexpected response format')
    }
    
  } catch (error) {
    throw new Error(`Gemini API Error: ${error.message}`)
  }
}

async function main() {
  console.log('🤖 Starting AI Code Review...\n')
  
  // Check API key
  if (GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please set GEMINI_API_KEY environment variable')
    console.log('Usage: GEMINI_API_KEY=your_key node scripts/ai-review.js [video_path]')
    console.log('   or: VIDEO_PATH=path/to/video.mp4 GEMINI_API_KEY=your_key node scripts/ai-review.js')
    process.exit(1)
  }
  
  // Check for video
  if (VIDEO_PATH) {
    if (!fs.existsSync(VIDEO_PATH)) {
      console.error(`❌ Video file not found: ${VIDEO_PATH}`)
      process.exit(1)
    }
    console.log(`📹 Video provided: ${VIDEO_PATH}`)
  } else {
    console.log('📄 Code-only analysis (no video provided)')
  }
  
  try {
    // Read codebase
    console.log('📖 Reading codebase files...')
    const codebase = await readCodebase()
    
    // Prepare prompt
    const fullPrompt = REVIEW_CONTEXT + codebase
    console.log(`📤 Sending ${fullPrompt.length} characters to Gemini...`)
    
    // Send to AI with video if provided
    const review = await sendToGemini(fullPrompt, VIDEO_PATH)
    
    // Save and display results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outputFile = `ai-review-${timestamp}.md`
    
    const fullReview = `# AI Code Review - ${new Date().toLocaleString()}\n\n${review}`
    
    fs.writeFileSync(outputFile, fullReview)
    
    console.log('\n✅ Review completed!\n')
    console.log(`📄 Full review saved to: ${outputFile}\n`)
    console.log('--- GEMINI REVIEW ---\n')
    console.log(review)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🤖 AI Code Review Tool

Usage:
  GEMINI_API_KEY=your_key node scripts/ai-review.js [video_path]
  VIDEO_PATH=path/to/video.mp4 GEMINI_API_KEY=your_key node scripts/ai-review.js

Environment Variables:
  GEMINI_API_KEY  Your Google AI Studio API key
  VIDEO_PATH      Optional path to video file for UX analysis

Arguments:
  video_path      Optional video file path (overrides VIDEO_PATH env var)

Options:
  --help, -h      Show this help message

The script will:
1. Read key codebase files
2. Optionally include video for UX analysis
3. Send everything to Gemini with Deep Critical Analysis Framework
4. Save the ruthless critique to a timestamped markdown file
5. Display the results

Files reviewed: ${REVIEW_FILES.join(', ')}
`)
  process.exit(0)
}

if (require.main === module) {
  main()
}