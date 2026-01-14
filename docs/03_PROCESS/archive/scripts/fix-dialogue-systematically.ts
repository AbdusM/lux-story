/**
 * Systematic Dialogue Formatter using Gemini API
 * Based on ai_studio_code.ts pattern for progressive dialogue
 *
 * Goal: Ensure all dialogue scenes have proper \n\n breaks for 2-3 line chunks
 * Reference: Pokemon/Visual Novel style progressive text display
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env.local')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

// Read the game file
const gameFilePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
const fileContent = fs.readFileSync(gameFilePath, 'utf-8')

// Extract all scene definitions from the sceneDatabase object
// Pattern matches: 'scene-id': { id: 'scene-id', text: "...", speaker: '...' }
const scenePattern = /'([^']+)':\s*\{\s*id:\s*'[^']+',\s*text:\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*speaker:\s*'([^']+)'/g
const scenes: Array<{
  id: string,
  speaker: string,
  text: string,
  fullMatch: string,
  startIndex: number,
  endIndex: number,
  textStartIndex: number,
  textEndIndex: number
}> = []

let match
while ((match = scenePattern.exec(fileContent)) !== null) {
  const sceneId = match[1]
  const sceneText = match[2]
  const sceneSpeaker = match[3]

  // Find the exact position of the text content within the match
  const textStartInMatch = match[0].indexOf('text: "') + 'text: "'.length
  const textStartIndex = match.index + textStartInMatch
  const textEndIndex = textStartIndex + sceneText.length

  scenes.push({
    id: sceneId,
    speaker: sceneSpeaker,
    text: sceneText,
    fullMatch: match[0],
    startIndex: match.index,
    endIndex: match.index + match[0].length,
    textStartIndex: textStartIndex,
    textEndIndex: textEndIndex
  })
}

console.log(`Found ${scenes.length} scenes to analyze`)

// System prompt for Gemini
const SYSTEM_PROMPT = `You are a dialogue formatter for a narrative game. Your job is to analyze dialogue text and add \\n\\n breaks to create natural reading chunks of 2-3 lines each (roughly 15-30 words per chunk).

CRITICAL RULES:
1. Each chunk should be 2-3 lines of text (15-30 words ideal, max 35 words)
2. Use \\n\\n to separate chunks (creates visual break with Continue button)
3. Break at natural pause points: end of thoughts, emotional beats, dramatic pauses
4. For emotional scenes, shorter chunks (10-20 words) for impact
5. NEVER break mid-sentence unless it's for dramatic effect
6. Preserve any existing \\n\\n breaks that work well
7. Character dialogue should feel conversational, not like reading a textbook

NARRATOR EXCEPTION:
- Narrator/SCENE text can have longer first chunks (up to 50 words) for scene-setting
- But subsequent chunks should still be 20-35 words

EXAMPLES OF GOOD FORMATTING:

Input: "Maya wipes tears from her eyes. Twenty years. Mom learning English while Dad studied for board exams. They'd quiz each other at 2 AM after their shifts. Every dollar saved, every birthday they worked through, every dream they deferred - all so I could be 'successful.' Their love feels like golden handcuffs. How do I honor their sacrifice without sacrificing myself?"

Output: "Maya wipes tears from her eyes.\\n\\n\\"Twenty years. Mom learning English while Dad studied for board exams.\\"\\n\\n\\"They'd quiz each other at 2 AM after their shifts.\\"\\n\\n\\"Every dollar saved, every birthday they worked through, every dream they deferred - all so I could be 'successful.'\\"\\n\\n\\"Their love feels like golden handcuffs. How do I honor their sacrifice without sacrificing myself?\\""

Input: "The platform stretches before you, each section glowing with different colored light. Healthcare pulses with soft blue, while engineering radiates warm orange. Tech shimmers in purple, and far in the distance, you glimpse a green glow from what might be environmental sciences."

Output: "The platform stretches before you, each section glowing with different colored light.\\n\\nHealthcare pulses with soft blue, while engineering radiates warm orange.\\n\\nTech shimmers in purple, and far in the distance, you glimpse a green glow from what might be environmental sciences."

Now format the following dialogue:`

// Function to fix a single scene
async function fixScene(scene: typeof scenes[0]): Promise<string | null> {
  const wordCount = scene.text.split(/\s+/).filter(w => w).length
  const existingBreaks = (scene.text.match(/\\n\\n/g) || []).length
  const chunks = existingBreaks + 1
  const wordsPerChunk = wordCount / chunks

  // Smart skip logic based on average words per chunk
  if (wordsPerChunk < 40 && wordCount > 10) {
    console.log(`  ✓ ${scene.id} well-formatted (${wordCount} words, ${chunks} chunks, avg ${Math.round(wordsPerChunk)} words/chunk)`)
    return null
  }

  // Keep check for very short scenes
  if (wordCount < 40 && chunks === 1) {
    console.log(`  ✓ ${scene.id} is short enough (${wordCount} words)`)
    return null
  }

  console.log(`  ⚡ Fixing ${scene.id} (${wordCount} words, ${chunks} chunks, avg ${Math.round(wordsPerChunk)} words/chunk)`)

  try {
    const prompt = `${SYSTEM_PROMPT}

Scene ID: ${scene.id}
Speaker: ${scene.speaker}
Current text: "${scene.text}"

Format this dialogue with \\n\\n breaks. Return ONLY the formatted text, nothing else.`

    const result = await model.generateContent(prompt)
    const formattedText = result.response.text().trim()

    // Validate the response
    if (!formattedText || formattedText.length < scene.text.length * 0.5) {
      console.log(`  ⚠️  Invalid response for ${scene.id}, skipping`)
      return null
    }

    // Clean up any markdown or quotes Gemini might add
    const cleaned = formattedText
      .replace(/^["'`]|["'`]$/g, '') // Remove wrapping quotes
      .replace(/```[^`]*```/g, '') // Remove code blocks
      .trim()

    // Verify improvement: check if new formatting is actually better
    const newBreaks = (cleaned.match(/\\n\\n/g) || []).length
    const newChunks = newBreaks + 1
    const newWordsPerChunk = wordCount / newChunks

    if (newWordsPerChunk > wordsPerChunk && wordsPerChunk < 50) {
      console.log(`  ⚠️  New formatting worse for ${scene.id} (${Math.round(newWordsPerChunk)} vs ${Math.round(wordsPerChunk)} words/chunk), skipping`)
      return null
    }

    return cleaned
  } catch (error) {
    console.error(`  ❌ Error processing ${scene.id}:`, error)
    return null
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting systematic dialogue formatting with Gemini...\n')

  // Filter to only dialogue scenes (not Narrator)
  const dialogueScenes = scenes.filter(s =>
    s.speaker !== 'Narrator' &&
    s.speaker !== 'SCENE' &&
    s.speaker !== ''
  )

  console.log(`📊 Found ${dialogueScenes.length} dialogue scenes to check\n`)

  // Process in batches to avoid rate limits
  const BATCH_SIZE = 5
  const fixes: Array<{ scene: typeof scenes[0], newText: string }> = []

  for (let i = 0; i < dialogueScenes.length; i += BATCH_SIZE) {
    const batch = dialogueScenes.slice(i, i + BATCH_SIZE)
    console.log(`\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(dialogueScenes.length/BATCH_SIZE)}`)

    const batchResults = await Promise.all(
      batch.map(async (scene) => {
        const fixed = await fixScene(scene)
        if (fixed) {
          return { scene, newText: fixed }
        }
        return null
      })
    )

    // Collect non-null results
    batchResults.forEach(result => {
      if (result) fixes.push(result)
    })

    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < dialogueScenes.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  console.log(`\n✅ Found ${fixes.length} scenes that need fixing\n`)

  if (fixes.length === 0) {
    console.log('🎉 All dialogue scenes are properly formatted!')
    return
  }

  // Apply fixes using precise character indices (more robust than regex replacement)
  console.log('📝 Applying fixes to useSimpleGame.ts...')

  // Sort fixes by position (reverse order to maintain indices)
  fixes.sort((a, b) => b.scene.textStartIndex - a.scene.textStartIndex)

  // Build the new file content by replacing text at exact positions
  let updatedContent = fileContent

  for (const { scene, newText } of fixes) {
    // Direct slice-based replacement using exact indices
    updatedContent =
      updatedContent.slice(0, scene.textStartIndex) +
      newText +
      updatedContent.slice(scene.textEndIndex)

    console.log(`  ✓ Fixed ${scene.id} (${scene.speaker})`)
  }

  // Backup original file
  const backupPath = gameFilePath.replace('.ts', `.backup-${Date.now()}.ts`)
  fs.writeFileSync(backupPath, fileContent, 'utf-8')
  console.log(`\n💾 Backup saved to ${path.basename(backupPath)}`)

  // Write the updated file
  fs.writeFileSync(gameFilePath, updatedContent, 'utf-8')

  console.log('\n🎉 Successfully updated useSimpleGame.ts with formatted dialogue!')
  console.log(`   Fixed ${fixes.length} scenes`)

  // Generate detailed report
  const report = fixes.map(f => {
    const oldBreaks = (f.scene.text.match(/\\n\\n/g) || []).length
    const newBreaks = (f.newText.match(/\\n\\n/g) || []).length
    const wordCount = f.scene.text.split(/\s+/).filter(w => w).length
    return `- ${f.scene.id} (${f.scene.speaker}): ${wordCount} words, ${oldBreaks} → ${newBreaks} breaks`
  }).join('\n')

  const reportContent = `Dialogue Formatting Report
Generated: ${new Date().toISOString()}
Backup: ${path.basename(backupPath)}

Fixed ${fixes.length} scenes:
${report}

Summary:
- Total scenes analyzed: ${dialogueScenes.length}
- Scenes already well-formatted: ${dialogueScenes.length - fixes.length}
- Scenes reformatted: ${fixes.length}
- Success rate: ${((fixes.length / dialogueScenes.length) * 100).toFixed(1)}% needed fixes
`

  fs.writeFileSync('dialogue-fix-report.txt', reportContent, 'utf-8')

  console.log('\n📄 Detailed report saved to dialogue-fix-report.txt')
}

// Run the script
main().catch(console.error)