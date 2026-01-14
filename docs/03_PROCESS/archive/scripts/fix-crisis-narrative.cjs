#!/usr/bin/env node

/**
 * Fix Crisis Narrative Elements
 * Removes crisis language that contradicts contemplative philosophy
 * Replaces urgent/panic language with calm, patient alternatives
 */

const fs = require('fs')
const path = require('path')

// Crisis language replacements
const crisisReplacements = {
  // Urgency and rushing
  'rushing': 'moving with purpose',
  'rush past': 'move past thoughtfully',
  'urgently': 'deliberately',
  'urgent': 'deliberate',
  'hurry': 'move forward',
  'hastily': 'carefully',
  'quickly': 'mindfully',
  'immediately': 'when ready',
  'right away': 'in time',
  'as soon as possible': 'when the moment is right',
  
  // Crisis and emergency language
  'crisis': 'moment of reflection',
  'emergency': 'important moment',
  'alert': 'awareness',
  'warning': 'gentle reminder',
  'danger': 'challenge',
  'threat': 'opportunity for growth',
  'attack': 'transformation',
  'anomaly': 'unexpected discovery',
  'chaos': 'dynamic flow',
  'panic': 'pause for breath',
  'overwhelmed': 'taking in much',
  'stressed': 'processing',
  'anxious': 'anticipating',
  'worried': 'considering',
  
  // Time pressure
  'time pressing': 'time flowing',
  'pressing': 'flowing',
  'pressed for time': 'mindful of time',
  'running out of time': 'time flowing naturally',
  'deadline': 'natural conclusion',
  'due date': 'moment of completion',
  
  // Violence and conflict
  'battle': 'journey',
  'fight': 'navigate',
  'struggle': 'explore',
  'conflict': 'conversation',
  'war': 'transformation',
  'enemy': 'teacher',
  'opponent': 'guide',
  
  // Technical crisis language
  'system failure': 'system evolution',
  'malfunction': 'unexpected behavior',
  'error': 'learning opportunity',
  'bug': 'feature in development',
  'crash': 'pause for reflection',
  'broken': 'in transition',
  'failed': 'learned',
  'failure': 'learning',
  
  // Birmingham-specific crisis fixes
  'crisis hotline': 'support line',
  'emergency services': 'support services',
  'urgent care': 'careful attention',
  'rush hour': 'flowing hour',
  'traffic jam': 'flowing traffic',
  'gridlock': 'momentary pause'
}

// Load the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json')
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'))

console.log('🔍 Analyzing story for crisis language...')

let totalReplacements = 0
let scenesModified = 0

// Function to replace crisis language in text
function replaceCrisisLanguage(text) {
  if (!text || typeof text !== 'string') return text
  
  let modifiedText = text
  let replacements = 0
  
  // Apply all crisis replacements
  for (const [crisis, calm] of Object.entries(crisisReplacements)) {
    const regex = new RegExp(`\\b${crisis}\\b`, 'gi')
    const matches = modifiedText.match(regex)
    if (matches) {
      modifiedText = modifiedText.replace(regex, calm)
      replacements += matches.length
    }
  }
  
  return { text: modifiedText, replacements }
}

// Process all scenes
function processScenes(scenes) {
  for (const scene of scenes) {
    let sceneModified = false
    
    // Process scene text
    if (scene.text) {
      const result = replaceCrisisLanguage(scene.text)
      if (result.replacements > 0) {
        scene.text = result.text
        totalReplacements += result.replacements
        sceneModified = true
      }
    }
    
    // Process choices
    if (scene.choices) {
      for (const choice of scene.choices) {
        if (choice.text) {
          const result = replaceCrisisLanguage(choice.text)
          if (result.replacements > 0) {
            choice.text = result.text
            totalReplacements += result.replacements
            sceneModified = true
          }
        }
      }
    }
    
    // Process dialogue
    if (scene.speaker && scene.text) {
      const result = replaceCrisisLanguage(scene.text)
      if (result.replacements > 0) {
        scene.text = result.text
        totalReplacements += result.replacements
        sceneModified = true
      }
    }
    
    if (sceneModified) {
      scenesModified++
    }
  }
}

// Process the story data - handle different structure
if (storyData.scenes) {
  processScenes(storyData.scenes)
} else if (storyData.chapters) {
  for (const chapter of storyData.chapters) {
    if (chapter.scenes) {
      processScenes(chapter.scenes)
    }
  }
} else {
  console.error('❌ Could not find scenes in story data')
  process.exit(1)
}

// Create backup
const backupPath = path.join(__dirname, '..', 'data', `grand-central-story-backup-crisis-fix-${Date.now()}.json`)
fs.writeFileSync(backupPath, JSON.stringify(storyData, null, 2))
console.log(`📁 Backup created: ${backupPath}`)

// Save the modified story
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2))

console.log('✅ Crisis narrative fixes complete!')
console.log(`📊 Statistics:`)
console.log(`   - Total replacements: ${totalReplacements}`)
console.log(`   - Scenes modified: ${scenesModified}`)
console.log(`   - Backup created: ${backupPath}`)

// Generate a report of changes
const reportPath = path.join(__dirname, '..', 'data', 'crisis-fix-report.json')
const report = {
  timestamp: new Date().toISOString(),
  totalReplacements,
  scenesModified,
  replacements: crisisReplacements,
  backupFile: backupPath
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(`📋 Report saved: ${reportPath}`)

console.log('\n🎯 Crisis language has been transformed into contemplative language!')
console.log('The story now maintains a calm, patient, and reflective tone throughout.')
