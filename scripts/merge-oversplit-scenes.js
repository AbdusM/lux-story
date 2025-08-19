const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

console.log('='.repeat(80));
console.log('MERGING OVER-SPLIT MOBILE SCENES');
console.log('='.repeat(80));

// Track changes
let mergeCount = 0;
let totalScenesBefore = 0;
let totalScenesAfter = 0;

// Helper to count words
function wordCount(text) {
  return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
}

// Process each chapter
storyData.chapters.forEach(chapter => {
  totalScenesBefore += chapter.scenes.length;
  
  const mergedScenes = [];
  let i = 0;
  
  while (i < chapter.scenes.length) {
    const scene = chapter.scenes[i];
    
    // Check if this is a split scene (ends with -1, -2, etc.)
    const splitMatch = scene.id.match(/^(.+)-(\d+)$/);
    
    if (splitMatch) {
      const baseId = splitMatch[1];
      const splitNum = parseInt(splitMatch[2]);
      
      // Only process if this is the first split (-1)
      if (splitNum === 1) {
        // Collect all related splits
        const relatedScenes = [scene];
        let nextIndex = i + 1;
        let expectedNum = 2;
        
        while (nextIndex < chapter.scenes.length) {
          const nextScene = chapter.scenes[nextIndex];
          if (nextScene.id === `${baseId}-${expectedNum}`) {
            relatedScenes.push(nextScene);
            nextIndex++;
            expectedNum++;
          } else {
            break;
          }
        }
        
        // Calculate total words if merged
        const totalWords = relatedScenes.reduce((sum, s) => sum + wordCount(s.text), 0);
        
        // Merge logic: 
        // - If total < 60 words and same type, merge all
        // - If 2-3 tiny chunks (< 20 words each), merge them
        // - Keep splits if they're at natural boundaries
        if (totalWords < 60 && relatedScenes.length > 1 && 
            relatedScenes.every(s => s.type === scene.type)) {
          
          console.log(`\nMerging ${relatedScenes.length} chunks of ${baseId}:`);
          console.log(`  Total words when merged: ${totalWords}`);
          
          // Create merged scene
          const mergedScene = {
            id: baseId,
            type: scene.type,
            speaker: scene.speaker,
            speakerColor: scene.speakerColor,
            speakerIcon: scene.speakerIcon,
            text: relatedScenes.map(s => s.text).filter(t => t).join(' '),
            nextScene: relatedScenes[relatedScenes.length - 1].nextScene,
            choices: relatedScenes[relatedScenes.length - 1].choices
          };
          
          // Remove undefined properties
          Object.keys(mergedScene).forEach(key => {
            if (mergedScene[key] === undefined) delete mergedScene[key];
          });
          
          mergedScenes.push(mergedScene);
          i = nextIndex;
          mergeCount++;
          
          console.log(`  ✓ Merged into single scene`);
        } else if (relatedScenes.length > 3 && 
                   relatedScenes.every(s => wordCount(s.text) < 20)) {
          // Merge every 2 scenes if all are tiny
          console.log(`\nPartially merging ${relatedScenes.length} tiny chunks of ${baseId}`);
          
          for (let j = 0; j < relatedScenes.length; j += 2) {
            const scene1 = relatedScenes[j];
            const scene2 = relatedScenes[j + 1];
            
            if (scene2 && scene1.type === scene2.type) {
              const mergedText = [scene1.text, scene2.text].filter(t => t).join(' ');
              const mergedScene = {
                id: j === 0 ? baseId : `${baseId}-${Math.floor(j/2) + 1}`,
                type: scene1.type,
                speaker: scene1.speaker,
                speakerColor: scene1.speakerColor,
                speakerIcon: scene1.speakerIcon,
                text: mergedText,
                nextScene: scene2.nextScene || (relatedScenes[j + 2] ? `${baseId}-${Math.floor((j+2)/2) + 1}` : relatedScenes[relatedScenes.length - 1].nextScene),
                choices: scene2.choices
              };
              
              // Remove undefined properties
              Object.keys(mergedScene).forEach(key => {
                if (mergedScene[key] === undefined) delete mergedScene[key];
              });
              
              mergedScenes.push(mergedScene);
              mergeCount++;
              console.log(`  ✓ Merged chunks ${j+1} and ${j+2}`);
            } else {
              mergedScenes.push(scene1);
              if (scene2 && j === relatedScenes.length - 2) {
                mergedScenes.push(scene2);
              }
            }
          }
          
          i = nextIndex;
        } else {
          // Keep the splits as they are
          relatedScenes.forEach(s => mergedScenes.push(s));
          i = nextIndex;
        }
      } else {
        // This is a middle or end split, skip it (handled above)
        i++;
      }
    } else {
      // Not a split scene, keep as is
      mergedScenes.push(scene);
      i++;
    }
  }
  
  // Fix any broken navigation links
  mergedScenes.forEach((scene, index) => {
    if (scene.nextScene) {
      // Check if nextScene exists in merged list
      const nextExists = mergedScenes.some(s => s.id === scene.nextScene);
      if (!nextExists && index < mergedScenes.length - 1) {
        // Try to find the next logical scene
        const nextScene = mergedScenes[index + 1];
        if (nextScene) {
          console.log(`  Fixing navigation: ${scene.id} → ${nextScene.id}`);
          scene.nextScene = nextScene.id;
        }
      }
    }
  });
  
  chapter.scenes = mergedScenes;
  totalScenesAfter += chapter.scenes.length;
});

// Report results
console.log('\n' + '='.repeat(80));
console.log('MERGE RESULTS:');
console.log('='.repeat(80));
console.log(`Scenes before: ${totalScenesBefore}`);
console.log(`Scenes after: ${totalScenesAfter}`);
console.log(`Scenes merged: ${totalScenesBefore - totalScenesAfter}`);
console.log(`Merge operations: ${mergeCount}`);

if (mergeCount > 0) {
  // Save the updated story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  console.log('\n✅ Successfully merged over-split scenes');
  console.log('Text now flows more naturally without excessive fragmentation');
} else {
  console.log('\n✅ No merging needed');
}