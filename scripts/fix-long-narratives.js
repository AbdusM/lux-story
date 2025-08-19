const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

console.log('='.repeat(80));
console.log('FIXING OVERLY LONG NARRATIVE BLOCKS');
console.log('='.repeat(80));

// Helper to count words
function wordCount(text) {
  return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
}

// Track changes
let fixedCount = 0;

// Process each chapter
storyData.chapters.forEach(chapter => {
  const scenesToAdd = [];
  
  chapter.scenes.forEach((scene, index) => {
    const words = wordCount(scene.text);
    
    // Fix scenes over 100 words (especially narratives)
    if (words > 100 && scene.type === 'narration') {
      console.log(`\nFound long narrative: ${scene.id} (${words} words)`);
      
      // Special handling for the 1-10d-1 scene with colored flames
      if (scene.id === '1-10d-1' && scene.text.includes('Blue flames')) {
        console.log('  Special handling for colored flames scene...');
        
        // Split at the bullet points
        const introText = scene.text.substring(0, scene.text.indexOf('- Blue flames'));
        const flamesText = scene.text.substring(scene.text.indexOf('- Blue flames'));
        
        // Update original scene with intro
        scene.text = introText.trim();
        
        // Create new scene for the flames description
        const newScene = {
          id: `${scene.id}-flames`,
          type: 'narration',
          text: flamesText.trim(),
          nextScene: scene.nextScene
        };
        
        scene.nextScene = newScene.id;
        scenesToAdd.push({ afterIndex: index, scene: newScene });
        
        console.log('  ✓ Split at natural boundary (before flame descriptions)');
        fixedCount++;
      }
      // General handling for other long narratives
      else if (scene.text) {
        // Look for natural break points
        const breakPoints = [
          { pattern: '\n\n', name: 'paragraph break' },
          { pattern: '. The ', name: 'scene shift' },
          { pattern: '. You ', name: 'perspective shift' },
          { pattern: '. A ', name: 'new element' }
        ];
        
        let bestBreak = null;
        let bestBreakIndex = -1;
        
        // Find the best break point near the middle
        const targetPosition = scene.text.length / 2;
        
        for (const breakPoint of breakPoints) {
          const index = scene.text.indexOf(breakPoint.pattern);
          if (index > 0 && index < scene.text.length - 50) {
            const distance = Math.abs(index - targetPosition);
            if (bestBreak === null || distance < Math.abs(bestBreakIndex - targetPosition)) {
              bestBreak = breakPoint;
              bestBreakIndex = index;
            }
          }
        }
        
        if (bestBreak && bestBreakIndex > 0) {
          console.log(`  Found natural break: ${bestBreak.name} at position ${bestBreakIndex}`);
          
          const breakIndex = bestBreakIndex + (bestBreak.pattern === '\n\n' ? 2 : bestBreak.pattern.length);
          const part1 = scene.text.substring(0, breakIndex).trim();
          const part2 = scene.text.substring(breakIndex).trim();
          
          if (wordCount(part1) > 20 && wordCount(part2) > 20) {
            // Update original scene
            scene.text = part1;
            
            // Create continuation scene
            const newScene = {
              id: `${scene.id}-cont`,
              type: 'narration',
              text: part2,
              nextScene: scene.nextScene
            };
            
            scene.nextScene = newScene.id;
            scenesToAdd.push({ afterIndex: index, scene: newScene });
            
            console.log(`  ✓ Split into ${wordCount(part1)} + ${wordCount(part2)} words`);
            fixedCount++;
          }
        }
      }
    }
  });
  
  // Add new scenes in reverse order to maintain indices
  scenesToAdd.reverse().forEach(item => {
    chapter.scenes.splice(item.afterIndex + 1, 0, item.scene);
  });
});

// Also check opening scene density
console.log('\n' + '-'.repeat(40));
console.log('CHECKING OPENING SCENE DENSITY:');
console.log('-'.repeat(40));

storyData.chapters.forEach(chapter => {
  const openingScenes = chapter.scenes.filter(s => 
    s.id.startsWith('1-1') || s.id.startsWith('2-1') || s.id.startsWith('3-1')
  );
  
  openingScenes.forEach(scene => {
    if (scene.text) {
      const words = wordCount(scene.text);
      const sensoryWords = (scene.text.match(/smell|touch|feel|hear|see|taste|glow|warm|cold|bright|dark/gi) || []).length;
      
      if (sensoryWords > 3 && words > 60) {
        console.log(`  ${scene.id}: ${words} words, ${sensoryWords} sensory details`);
        console.log(`    Consider breaking at sensory shifts for better pacing`);
      }
    }
  });
});

if (fixedCount > 0) {
  // Save the updated story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  console.log(`\n✅ Fixed ${fixedCount} overly long narrative blocks`);
  console.log('Narratives now break at natural boundaries for better readability');
} else {
  console.log('\n✅ No long narrative fixes needed');
}