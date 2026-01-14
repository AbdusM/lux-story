#!/usr/bin/env npx tsx

/**
 * Script to automatically break long narrative chunks into bite-sized pieces
 * 
 * This script:
 * 1. Finds dialogue chunks with 4+ sentences without breaks
 * 2. Breaks them at natural pause points (after periods, questions, exclamations)
 * 3. Preserves existing chunking and formatting
 * 4. Removes any remaining stage directions
 */

import * as fs from 'fs'
import * as path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

interface DialogueNode {
  nodeId: string
  speaker: string
  content: Array<{
    text: string
    emotion: string
    variation_id: string
  }>
  choices?: Array<{
    text: string
  }>
}

function breakLongChunks(text: string): string {
  // Skip if already has good chunking
  if (text.includes('\n\n')) return text
  
  // Skip very short text
  if (text.length < 150) return text
  
  // Count sentences (rough estimate)
  const sentenceCount = (text.match(/[.!?]+/g) || []).length
  if (sentenceCount < 4) return text
  
  // Break at natural pause points
  const sentences = text.split(/([.!?]+\s+)/)
  const chunks: string[] = []
  let currentChunk = ''
  
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i]
    const punctuation = sentences[i + 1] || ''
    
    if (!sentence) continue
    
    const fullSentence = sentence + punctuation
    currentChunk += fullSentence
    
    // Break every 2-3 sentences or at natural pause points
    const chunkSentenceCount = (currentChunk.match(/[.!?]+/g) || []).length
    
    if (chunkSentenceCount >= 2 && (
      fullSentence.includes('.') || 
      fullSentence.includes('?') || 
      fullSentence.includes('!')
    )) {
      chunks.push(currentChunk.trim())
      currentChunk = ''
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks.join('\n\n')
}

function removeStageDirections(text: string): string {
  // Remove stage directions like *He smiles*, *Pause*, etc.
  return text.replace(/\*[^*]+\*/g, '').replace(/\n\s*\n/g, '\n\n').trim()
}

function processFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Extract dialogue nodes using regex
  const nodeRegex = /export const \w+DialogueNodes: DialogueNode\[\] = \[([\s\S]*?)\]/
  const match = content.match(nodeRegex)
  
  if (!match) {
    console.log(`No dialogue nodes found in ${filePath}`)
    return
  }
  
  let modified = false
  let newContent = content
  
  // Process each text field
  const textRegex = /text: "([^"]*(?:\\.[^"]*)*)"/g
  let textMatch
  
  while ((textMatch = textRegex.exec(content)) !== null) {
    const originalText = textMatch[1]
    let processedText = originalText
    
    // Remove stage directions
    processedText = removeStageDirections(processedText)
    
    // Break long chunks
    processedText = breakLongChunks(processedText)
    
    if (processedText !== originalText) {
      newContent = newContent.replace(textMatch[0], `text: "${processedText}"`)
      modified = true
      console.log(`Modified chunk in ${filePath}: ${originalText.substring(0, 50)}...`)
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log(`✅ Updated ${filePath}`)
  } else {
    console.log(`⏭️  No changes needed for ${filePath}`)
  }
}

function main(): void {
  const files = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('-dialogue-graph.ts'))
    .map(file => path.join(CONTENT_DIR, file))
  
  console.log(`Processing ${files.length} dialogue files...`)
  
  for (const file of files) {
    try {
      processFile(file)
    } catch (error) {
      console.error(`Error processing ${file}:`, error)
    }
  }
  
  console.log('\n✅ Chunk breaking complete!')
}

main()
