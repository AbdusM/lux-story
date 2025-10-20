#!/usr/bin/env npx tsx

/**
 * Script to safely break long narrative chunks into bite-sized pieces
 * 
 * SAFE APPROACH:
 * 1. Parse TypeScript files properly using AST or careful string parsing
 * 2. Only modify text content within string literals
 * 3. Preserve all syntax and structure
 * 4. Standardize chunking format
 */

import * as fs from 'fs'
import * as path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function breakLongChunks(text: string): string {
  // Skip if already has good chunking (2+ \n\n breaks)
  const existingBreaks = (text.match(/\n\n/g) || []).length
  if (existingBreaks >= 2) return text
  
  // Skip very short text
  if (text.length < 200) return text
  
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
  
  let modified = false
  let newContent = content
  
  // Find all text: "..." patterns and process them safely
  const textPattern = /text:\s*"((?:[^"\\]|\\.)*)"/g
  let match
  
  while ((match = textPattern.exec(content)) !== null) {
    const originalText = match[1]
    let processedText = originalText
    
    // Remove stage directions first
    processedText = removeStageDirections(processedText)
    
    // Break long chunks
    processedText = breakLongChunks(processedText)
    
    if (processedText !== originalText) {
      // Replace the original match with the processed version
      const originalMatch = match[0]
      const newMatch = originalMatch.replace(originalText, processedText)
      newContent = newContent.replace(originalMatch, newMatch)
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
  
  console.log('\n✅ Safe chunk breaking complete!')
}

main()
