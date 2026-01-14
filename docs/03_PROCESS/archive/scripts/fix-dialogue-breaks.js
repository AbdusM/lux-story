const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

console.log('='.repeat(80));
console.log('FIXING DIALOGUE BREAKS AT NATURAL PAUSE POINTS');
console.log('='.repeat(80));

// Track changes
let changesApplied = 0;

// Function to find natural break point in dialogue
function findNaturalBreak(text) {
  // Natural break indicators
  const breakIndicators = [
    { pattern: "You know what's crazy?", breakBefore: true },
    { pattern: "Look,", breakAfter: true },
    { pattern: "Listen,", breakAfter: true },
    { pattern: "But ", breakBefore: true, minPosition: 50 },
    { pattern: '" ', breakAfter: true }, // End of quoted speech
    { pattern: '? ', breakAfter: true }, // After questions
    { pattern: '. "', breakAfter: true }, // After statement before new quote
  ];
  
  for (const indicator of breakIndicators) {
    const index = text.indexOf(indicator.pattern);
    if (index > -1) {
      if (indicator.minPosition && index < indicator.minPosition) continue;
      
      if (indicator.breakBefore) {
        return {
          part1: text.substring(0, index).trim(),
          part2: text.substring(index).trim(),
          breakPoint: indicator.pattern
        };
      } else if (indicator.breakAfter) {
        const breakIndex = index + indicator.pattern.length;
        return {
          part1: text.substring(0, breakIndex).trim(),
          part2: text.substring(breakIndex).trim(),
          breakPoint: indicator.pattern
        };
      }
    }
  }
  
  return null;
}

// Specific scenes identified from analysis
const scenesToFix = [
  { id: '2-3a2', speaker: 'Maya' },
  { id: '2-3b2', speaker: 'Devon' },
  { id: '2-3c2', speaker: 'Jordan' },
  { id: '2-3d2', speaker: 'Alex' }
];

// Process each chapter
storyData.chapters.forEach(chapter => {
  const scenesToAdd = [];
  
  chapter.scenes.forEach((scene, index) => {
    // Check if this is one of our target scenes
    const targetScene = scenesToFix.find(s => s.id === scene.id);
    
    if (targetScene && scene.text) {
      console.log(`\nProcessing ${scene.id} (${targetScene.speaker}):`);
      console.log(`  Original length: ${scene.text.split(/\s+/).length} words`);
      
      const breakResult = findNaturalBreak(scene.text);
      
      if (breakResult) {
        console.log(`  ✓ Found natural break at: "${breakResult.breakPoint}"`);
        
        // Update original scene with first part
        scene.text = breakResult.part1;
        
        // Create new scene for second part
        const newScene = {
          id: `${scene.id}-natural`,
          type: scene.type,
          speaker: scene.speaker,
          speakerColor: scene.speakerColor,
          speakerIcon: scene.speakerIcon,
          text: breakResult.part2,
          nextScene: scene.nextScene
        };
        
        // Update original scene to point to new scene
        scene.nextScene = newScene.id;
        
        // Mark to add after current scene
        scenesToAdd.push({ afterIndex: index, scene: newScene });
        
        console.log(`  Part 1: ${breakResult.part1.substring(0, 50)}...`);
        console.log(`  Part 2: ${breakResult.part2.substring(0, 50)}...`);
        
        changesApplied++;
      }
    }
  });
  
  // Add new scenes in reverse order to maintain indices
  scenesToAdd.reverse().forEach(item => {
    chapter.scenes.splice(item.afterIndex + 1, 0, item.scene);
  });
});

// Also fix Maya's specific long dialogue about "You know what's crazy?"
storyData.chapters.forEach(chapter => {
  chapter.scenes.forEach(scene => {
    if (scene.speaker === 'Maya' && scene.text && scene.text.includes("You know what's crazy?")) {
      console.log(`\n📍 Found Maya's "You know what's crazy?" dialogue in scene ${scene.id}`);
      
      const breakIndex = scene.text.indexOf("You know what's crazy?");
      if (breakIndex > 20) { // Only break if there's substantial text before
        const part1 = scene.text.substring(0, breakIndex).trim();
        const part2 = scene.text.substring(breakIndex).trim();
        
        // Check if not already split
        const nextScene = chapter.scenes.find(s => s.id === scene.nextScene);
        if (!nextScene || !nextScene.text?.startsWith("You know what's crazy?")) {
          console.log(`  Breaking dialogue at natural pause...`);
          
          // Create continuation scene
          const newSceneId = `${scene.id}-pause`;
          const newScene = {
            id: newSceneId,
            type: 'dialogue',
            speaker: 'Maya',
            speakerColor: scene.speakerColor,
            speakerIcon: scene.speakerIcon,
            text: part2,
            nextScene: scene.nextScene
          };
          
          // Update original scene
          scene.text = part1;
          scene.nextScene = newSceneId;
          
          // Insert new scene
          const sceneIndex = chapter.scenes.findIndex(s => s.id === scene.id);
          chapter.scenes.splice(sceneIndex + 1, 0, newScene);
          
          changesApplied++;
          console.log(`  ✓ Split into natural pause`);
        }
      }
    }
  });
});

if (changesApplied > 0) {
  // Save the updated story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  console.log(`\n✅ Applied ${changesApplied} natural dialogue breaks`);
  console.log('Dialogue now breaks at emotional beats and topic shifts');
} else {
  console.log('\n✅ No dialogue break changes needed');
}