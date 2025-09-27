#!/usr/bin/env npx tsx

/**
 * AI Content Generation Pipeline
 * Generates dialogue variations at BUILD TIME, not runtime
 * All content is pre-generated and committed to the repository
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { DialogueNode, DialogueContent } from '../lib/dialogue-graph'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GEMINI_API_KEY = 'AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg'
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

interface GenerationRequest {
  nodeId: string
  speaker: string
  context: string
  emotion: string
  previousDialogue?: string
  characterBackground?: string
}

/**
 * Generate dialogue variations using Gemini API
 * This runs at BUILD TIME only
 */
async function generateDialogueVariations(request: GenerationRequest): Promise<DialogueContent[]> {
  const prompt = buildPrompt(request)

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8, // Higher for more variation
          maxOutputTokens: 500,
          topP: 0.9
        }
      })
    })

    if (!response.ok) {
      console.error(`API error for ${request.nodeId}:`, response.status)
      return createFallbackContent(request)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return createFallbackContent(request)
    }

    // Parse the generated variations
    return parseGeneratedContent(text, request)

  } catch (error) {
    console.error(`Generation failed for ${request.nodeId}:`, error)
    return createFallbackContent(request)
  }
}

/**
 * Build the prompt for Gemini
 */
function buildPrompt(request: GenerationRequest): string {
  return `You are writing dialogue for Maya Chen, a 19-year-old pre-med student at UAB in Birmingham, Alabama.

CHARACTER BACKGROUND:
${request.characterBackground || 'First-generation American, parents are immigrants who sacrificed everything for her education. She loves robotics but is studying medicine to please her family.'}

CURRENT CONTEXT:
${request.context}

EMOTIONAL STATE: ${request.emotion}

${request.previousDialogue ? `PREVIOUS DIALOGUE:\n${request.previousDialogue}\n` : ''}

Generate 4 variations of Maya's dialogue for this moment. Each should:
1. Be 2-3 sentences (40-80 words)
2. Reflect her ${request.emotion} emotional state
3. Feel natural for a stressed college student
4. Include specific Birmingham/UAB references when appropriate
5. Show her internal conflict between medicine and robotics when relevant

Format your response as:
VARIATION 1: [dialogue text]
VARIATION 2: [dialogue text]
VARIATION 3: [dialogue text]
VARIATION 4: [dialogue text]

Remember:
- Maya is intelligent but anxious
- She speaks thoughtfully, not casually
- She's torn between duty and passion
- She references real Birmingham locations (UAB, Innovation Depot, Railroad Park)`
}

/**
 * Parse generated text into DialogueContent array
 */
function parseGeneratedContent(text: string, request: GenerationRequest): DialogueContent[] {
  const variations: DialogueContent[] = []
  const lines = text.split('\n')

  for (const line of lines) {
    const match = line.match(/VARIATION \d+:\s*(.+)/)
    if (match && match[1]) {
      const cleanText = match[1].trim()
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/\s+/g, ' ') // Clean whitespace

      if (cleanText.length > 20) { // Minimum viable length
        variations.push({
          text: cleanText,
          emotion: request.emotion as any,
          variation_id: `${request.nodeId}_v${variations.length + 1}_generated`
        })
      }
    }
  }

  // Ensure we have at least one variation
  if (variations.length === 0) {
    return createFallbackContent(request)
  }

  return variations
}

/**
 * Create fallback content if generation fails
 */
function createFallbackContent(request: GenerationRequest): DialogueContent[] {
  return [{
    text: `[Generated content unavailable for ${request.nodeId}]`,
    emotion: request.emotion as any,
    variation_id: `${request.nodeId}_fallback`
  }]
}

/**
 * Process a single node
 */
async function processNode(node: DialogueNode): Promise<DialogueNode> {
  console.log(`Generating variations for: ${node.nodeId}`)

  // Define the context for this node
  const context = getNodeContext(node)

  const variations = await generateDialogueVariations({
    nodeId: node.nodeId,
    speaker: node.speaker,
    context: context,
    emotion: node.content[0]?.emotion || 'neutral',
    characterBackground: "Maya Chen: Pre-med at UAB, loves robotics, parents are immigrants"
  })

  // Add generated variations to existing content
  const enhancedNode: DialogueNode = {
    ...node,
    content: [
      ...node.content, // Keep original
      ...variations    // Add generated
    ]
  }

  // Small delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000))

  return enhancedNode
}

/**
 * Get context description for a node
 */
function getNodeContext(node: DialogueNode): string {
  const contexts: Record<string, string> = {
    'maya_introduction': 'First meeting at Grand Central Terminus, Maya is studying but anxious',
    'maya_anxiety_reveal': 'Maya opens up about her hidden struggles and secret interests',
    'maya_robotics_passion': 'Maya reveals her true passion for robotics, afraid of disappointing family',
    'maya_family_pressure': 'Maya discusses her immigrant parents and their sacrifices',
    'maya_crossroads': 'Maya faces a critical decision between medicine and engineering',
    'maya_chooses_robotics': 'Maya decides to follow her passion for robotics',
    'maya_chooses_hybrid': 'Maya finds a way to combine both medicine and robotics',
    'maya_chooses_self': 'Maya makes her own empowered choice'
  }

  return contexts[node.nodeId] || 'Maya continues the conversation'
}

/**
 * Main execution
 */
async function main() {
  console.log('🤖 AI CONTENT GENERATION PIPELINE')
  console.log('==================================\n')
  console.log('This generates content at BUILD TIME')
  console.log('All variations will be saved to static files\n')

  // Load Maya's dialogue graph
  const mayaGraphPath = path.join(__dirname, '../content/maya-dialogue-graph.ts')

  // Import the nodes (simplified for this example)
  // In production, you'd properly import the TypeScript module
  const { mayaDialogueNodes } = await import('../content/maya-dialogue-graph')

  console.log(`Processing ${mayaDialogueNodes.length} nodes...\n`)

  // Process each node
  const enhancedNodes: DialogueNode[] = []

  for (const node of mayaDialogueNodes) {
    // Only generate for key nodes to save API calls
    const keyNodes = [
      'maya_introduction',
      'maya_anxiety_reveal',
      'maya_robotics_passion',
      'maya_family_pressure',
      'maya_crossroads',
      'maya_chooses_robotics',
      'maya_chooses_hybrid',
      'maya_chooses_self'
    ]

    if (keyNodes.includes(node.nodeId)) {
      const enhanced = await processNode(node)
      enhancedNodes.push(enhanced)
      console.log(`✅ Generated ${enhanced.content.length - 1} new variations for ${node.nodeId}`)
    } else {
      enhancedNodes.push(node)
      console.log(`⏭️  Skipped ${node.nodeId} (not a key node)`)
    }
  }

  // Save the enhanced graph
  const outputPath = path.join(__dirname, '../content/maya-dialogue-enhanced.json')
  const output = {
    version: '1.0.0',
    generated_at: new Date().toISOString(),
    total_nodes: enhancedNodes.length,
    total_variations: enhancedNodes.reduce((sum, n) => sum + n.content.length, 0),
    nodes: enhancedNodes
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))

  console.log('\n==================================')
  console.log('✅ GENERATION COMPLETE\n')
  console.log(`Output saved to: ${outputPath}`)
  console.log(`Total nodes: ${output.total_nodes}`)
  console.log(`Total dialogue variations: ${output.total_variations}`)
  console.log('\nThis content is now static and version-controlled.')
  console.log('No runtime API calls needed!')
}

// Run the script
main().catch(console.error)