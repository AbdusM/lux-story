#!/usr/bin/env node

/**
 * Script to systematically fix mixed narration/dialogue formatting in grand-central-story.json
 * Splits scenes with *narrative actions* into separate narration and dialogue scenes
 */

const fs = require('fs');
const path = require('path');

// Load the story data
const storyPath = path.join(__dirname, '../data/grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Track changes for reporting
let changesCount = 0;
const changeLog = [];

// Process each chapter
storyData.chapters.forEach(chapter => {
  const newScenes = [];
  
  chapter.scenes.forEach((scene, index) => {
    // Check if this is a dialogue scene with mixed narration
    if (scene.type === 'dialogue' && scene.text && scene.text.includes('\n\n*')) {
      // Extract the parts
      const textParts = scene.text.split('\n\n');
      let dialogueBefore = '';
      let narrativeAction = '';
      let dialogueAfter = '';
      
      textParts.forEach(part => {
        if (part.startsWith('*') && part.endsWith('*')) {
          narrativeAction = part.replace(/^\*|\*$/g, '');
        } else if (part.startsWith("'") && part.endsWith("'")) {
          dialogueAfter += (dialogueAfter ? '\n\n' : '') + part;
        } else if (!narrativeAction) {
          dialogueBefore += (dialogueBefore ? '\n\n' : '') + part;
        } else {
          dialogueAfter += (dialogueAfter ? '\n\n' : '') + part;
        }
      });
      
      if (narrativeAction) {
        // Create setup narration scene
        const setupScene = {
          id: scene.id + '1',
          type: 'narration',
          text: narrativeAction
        };
        
        // Create clean dialogue scene
        const dialogueScene = {
          id: scene.id + '2',
          type: 'dialogue',
          speaker: scene.speaker,
          text: (dialogueBefore + (dialogueAfter ? '\n\n' + dialogueAfter : '')).trim()
        };
        
        newScenes.push(setupScene);
        newScenes.push(dialogueScene);
        
        changesCount++;
        changeLog.push({
          original: scene.id,
          setup: setupScene.id,
          dialogue: dialogueScene.id,
          speaker: scene.speaker
        });
        
        console.log(`Fixed scene ${scene.id}: Split into ${setupScene.id} (narration) and ${dialogueScene.id} (dialogue)`);
      } else {
        // No mixed content, keep as is
        newScenes.push(scene);
      }
    } else {
      // Not a dialogue scene or no mixed content
      newScenes.push(scene);
    }
  });
  
  // Update chapter scenes
  chapter.scenes = newScenes;
});

// Now update all scene references
function updateSceneReferences(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.nextScene) {
      changeLog.forEach(change => {
        if (obj.nextScene === change.original) {
          obj.nextScene = change.setup;
          console.log(`Updated reference: ${change.original} -> ${change.setup}`);
        }
      });
    }
    
    // Recursively update nested objects
    Object.values(obj).forEach(value => {
      if (typeof value === 'object') {
        updateSceneReferences(value);
      }
    });
  }
}

// Update all references in the story
storyData.chapters.forEach(chapter => {
  chapter.scenes.forEach(scene => {
    updateSceneReferences(scene);
  });
});

// Save the updated story
const outputPath = path.join(__dirname, '../data/grand-central-story-fixed.json');
fs.writeFileSync(outputPath, JSON.stringify(storyData, null, 2));

console.log(`\n✅ Fixed ${changesCount} scenes with mixed narration/dialogue`);
console.log(`📁 Saved to: ${outputPath}`);
console.log('\nChange log:');
changeLog.forEach(change => {
  console.log(`  ${change.original} -> ${change.setup} (narration) + ${change.dialogue} (${change.speaker})`);
});