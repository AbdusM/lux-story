#!/usr/bin/env npx tsx

/**
 * Content Authoring Tool
 * CLI for writers to create and manage dialogue nodes
 * Simplifies the process of building branching narratives
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'
import { DialogueNode, DialogueContent, ConditionalChoice } from '../lib/dialogue-graph'
import { StateChange, StateCondition } from '../lib/character-state'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

interface AuthoringSession {
  characterName: string
  nodes: DialogueNode[]
  currentNode?: DialogueNode
}

/**
 * Main CLI interface
 */
async function main() {
  console.log('\n🖋️  GRAND CENTRAL AUTHORING TOOL')
  console.log('================================\n')
  console.log('Welcome! This tool helps you create branching narratives.')
  console.log('Commands:')
  console.log('  new-character  - Start a new character storyline')
  console.log('  load-character - Load existing character for editing')
  console.log('  add-node       - Add a dialogue node')
  console.log('  generate       - Generate AI variations for nodes')
  console.log('  export         - Save storyline to file')
  console.log('  help           - Show this help')
  console.log('  quit           - Exit tool\n')

  const session: AuthoringSession = {
    characterName: '',
    nodes: []
  }

  while (true) {
    const command = await askQuestion('> ')

    if (command === 'quit') {
      console.log('Goodbye!')
      break
    }

    await handleCommand(command, session)
  }

  rl.close()
}

/**
 * Handle user commands
 */
async function handleCommand(command: string, session: AuthoringSession) {
  try {
    switch (command.trim()) {
      case 'new-character':
        await newCharacter(session)
        break

      case 'load-character':
        await loadCharacter(session)
        break

      case 'add-node':
        await addNode(session)
        break

      case 'generate':
        await generateVariations(session)
        break

      case 'export':
        await exportStoryline(session)
        break

      case 'help':
        showHelp()
        break

      case 'list-nodes':
        listNodes(session)
        break

      default:
        console.log('Unknown command. Type "help" for available commands.')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

/**
 * Start a new character storyline
 */
async function newCharacter(session: AuthoringSession) {
  console.log('\n📝 Creating new character storyline...')

  session.characterName = await askQuestion('Character name: ')
  session.nodes = []

  console.log(`\n✅ Started storyline for ${session.characterName}`)
  console.log('Use "add-node" to create dialogue nodes.')
}

/**
 * Load existing character
 */
async function loadCharacter(session: AuthoringSession) {
  const contentDir = path.join(__dirname, '../content')
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('-dialogue-graph.ts'))

  if (files.length === 0) {
    console.log('No existing character files found.')
    return
  }

  console.log('\nAvailable characters:')
  files.forEach((file, i) => {
    const name = file.replace('-dialogue-graph.ts', '')
    console.log(`  ${i + 1}. ${name}`)
  })

  const choice = await askQuestion('Choose character (number): ')
  const index = parseInt(choice) - 1

  if (index >= 0 && index < files.length) {
    const filename = files[index]
    session.characterName = filename.replace('-dialogue-graph.ts', '')

    // Load the nodes (simplified - in production would parse the TypeScript)
    console.log(`\n✅ Loaded ${session.characterName}`)
    console.log('Note: Editing existing characters requires manual file editing for now.')
  } else {
    console.log('Invalid choice.')
  }
}

/**
 * Add a new dialogue node
 */
async function addNode(session: AuthoringSession) {
  if (!session.characterName) {
    console.log('Please create or load a character first.')
    return
  }

  console.log('\n📄 Creating new dialogue node...')

  const nodeId = await askQuestion('Node ID (e.g., maya_introduction): ')
  const speaker = await askQuestion(`Speaker (default: ${session.characterName}): `) || session.characterName
  const text = await askQuestion('Dialogue text: ')
  const emotion = await askQuestion('Emotion (neutral, anxious, happy, sad, confident): ') || 'neutral'

  // Create basic node
  const node: DialogueNode = {
    nodeId,
    speaker,
    content: [{
      text,
      emotion: emotion as any,
      variation_id: `${nodeId}_v1`
    }],
    choices: [],
    tags: [session.characterName.toLowerCase() + '_arc']
  }

  // Add conditions if needed
  const needsConditions = await askQuestion('Does this node require conditions? (y/n): ')
  if (needsConditions.toLowerCase() === 'y') {
    node.requiredState = await createConditions()
  }

  // Add state changes if needed
  const needsChanges = await askQuestion('Does entering this node change state? (y/n): ')
  if (needsChanges.toLowerCase() === 'y') {
    node.onEnter = [await createStateChange()]
  }

  // Add choices
  const needsChoices = await askQuestion('Add choices? (y/n): ')
  if (needsChoices.toLowerCase() === 'y') {
    await addChoices(node)
  }

  session.nodes.push(node)
  console.log(`\n✅ Added node "${nodeId}"`)
}

/**
 * Create state conditions
 */
async function createConditions(): Promise<StateCondition> {
  const condition: StateCondition = {}

  const trustCondition = await askQuestion('Trust requirement (e.g., min:3, max:7, or leave empty): ')
  if (trustCondition) {
    const [type, value] = trustCondition.split(':')
    condition.trust = { [type]: parseInt(value) }
  }

  const flagsRequired = await askQuestion('Required flags (comma-separated, or leave empty): ')
  if (flagsRequired) {
    condition.hasKnowledgeFlags = flagsRequired.split(',').map(f => f.trim())
  }

  const flagsForbidden = await askQuestion('Forbidden flags (comma-separated, or leave empty): ')
  if (flagsForbidden) {
    condition.lacksKnowledgeFlags = flagsForbidden.split(',').map(f => f.trim())
  }

  return condition
}

/**
 * Create state change
 */
async function createStateChange(): Promise<StateChange> {
  const change: StateChange = {}

  const characterId = await askQuestion('Character ID for this change: ')
  if (characterId) {
    change.characterId = characterId
  }

  const trustChange = await askQuestion('Trust change (e.g., +1, -2, or leave empty): ')
  if (trustChange) {
    change.trustChange = parseInt(trustChange)
  }

  const addFlags = await askQuestion('Add knowledge flags (comma-separated, or leave empty): ')
  if (addFlags) {
    change.addKnowledgeFlags = addFlags.split(',').map(f => f.trim())
  }

  const relationshipChange = await askQuestion('Set relationship (stranger/acquaintance/confidant, or leave empty): ')
  if (relationshipChange) {
    change.setRelationshipStatus = relationshipChange as any
  }

  return change
}

/**
 * Add choices to a node
 */
async function addChoices(node: DialogueNode) {
  console.log('\nAdding choices...')

  while (true) {
    const choiceText = await askQuestion('Choice text (or "done" to finish): ')
    if (choiceText === 'done') break

    const nextNodeId = await askQuestion('Next node ID: ')
    const pattern = await askQuestion('Pattern (analytical/helping/building/patience/exploring): ')

    const choice: ConditionalChoice = {
      choiceId: `${node.nodeId}_choice_${node.choices.length + 1}`,
      text: choiceText,
      nextNodeId,
      pattern: pattern as any
    }

    // Add consequence if needed
    const needsConsequence = await askQuestion('Does this choice have consequences? (y/n): ')
    if (needsConsequence.toLowerCase() === 'y') {
      choice.consequence = await createStateChange()
    }

    node.choices.push(choice)
    console.log(`✅ Added choice: "${choiceText}"`)
  }
}

/**
 * Generate AI variations for nodes
 */
async function generateVariations(session: AuthoringSession) {
  if (session.nodes.length === 0) {
    console.log('No nodes to generate variations for.')
    return
  }

  console.log('\n🤖 Generating AI variations...')
  console.log('This will use the existing generate-dialogue-content.ts script.')
  console.log('Make sure your nodes are saved first using "export".')

  // For now, just show the command to run
  console.log('\nRun this command in your terminal:')
  console.log('GEMINI_API_KEY=AIzaSyxxxxx npx tsx scripts/generate-dialogue-content.ts')
}

/**
 * Export storyline to file
 */
async function exportStoryline(session: AuthoringSession) {
  if (!session.characterName || session.nodes.length === 0) {
    console.log('No storyline to export.')
    return
  }

  const filename = `${session.characterName.toLowerCase()}-dialogue-graph.ts`
  const filepath = path.join(__dirname, '../content', filename)

  const content = generateTypeScriptFile(session)

  fs.writeFileSync(filepath, content)
  console.log(`\n✅ Exported to ${filepath}`)
  console.log(`Created ${session.nodes.length} nodes for ${session.characterName}`)
}

/**
 * Generate TypeScript file content
 */
function generateTypeScriptFile(session: AuthoringSession): string {
  const nodes = session.nodes.map(node =>
    `  {\n    nodeId: '${node.nodeId}',\n    speaker: '${node.speaker}',\n    content: [\n      {\n        text: "${node.content[0].text}",\n        emotion: '${node.content[0].emotion}',\n        variation_id: '${node.content[0].variation_id}'\n      }\n    ],\n    choices: ${JSON.stringify(node.choices, null, 4)},\n    tags: ${JSON.stringify(node.tags)}\n  }`
  ).join(',\n\n')

  return `/**
 * ${session.characterName}'s Dialogue Graph
 * Generated by Content Authoring Tool
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'

export const ${session.characterName.toLowerCase()}DialogueNodes: DialogueNode[] = [
${nodes}
]

export const ${session.characterName.toLowerCase()}DialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(${session.characterName.toLowerCase()}DialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: '${session.nodes[0]?.nodeId || 'start'}',
  metadata: {
    title: "${session.characterName}'s Journey",
    author: 'Generated by Authoring Tool',
    createdAt: ${Date.now()},
    lastModified: ${Date.now()},
    totalNodes: ${session.nodes.length},
    totalChoices: ${session.nodes.reduce((sum, node) => sum + node.choices.length, 0)}
  }
}
`
}

/**
 * List current nodes
 */
function listNodes(session: AuthoringSession) {
  if (session.nodes.length === 0) {
    console.log('No nodes created yet.')
    return
  }

  console.log(`\n📋 Nodes for ${session.characterName}:`)
  session.nodes.forEach((node, i) => {
    console.log(`  ${i + 1}. ${node.nodeId} - "${node.content[0].text.substring(0, 50)}..."`)
  })
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
📖 AUTHORING TOOL HELP
====================

Commands:
  new-character  - Start creating a new character's storyline
  load-character - Load an existing character for editing
  add-node       - Add a dialogue node to current character
  list-nodes     - Show all nodes for current character
  generate       - Generate AI variations (requires export first)
  export         - Save current storyline to TypeScript file
  help           - Show this help
  quit           - Exit the tool

Workflow:
1. Use "new-character" to start
2. Use "add-node" to create dialogue nodes
3. Use "export" to save your work
4. Use "generate" to create AI variations
5. Import the generated content into your game

Tips:
- Node IDs should be descriptive (e.g., "maya_robotics_reveal")
- Use trust conditions to gate important content
- Set state changes when characters learn about the player
- Choices should feel meaningful and distinct
`)
}

/**
 * Utility to ask questions
 */
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

// Run the tool
main().catch(console.error)
