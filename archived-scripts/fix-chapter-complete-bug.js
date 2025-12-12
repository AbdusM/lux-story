const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

console.log('Checking for broken chapter transitions...\n');

// Find scenes that might be incorrectly ending chapters
let issuesFound = 0;
const problematicScenes = [];

// Check each chapter
storyData.chapters.forEach((chapter, chapterIndex) => {
  console.log(`Checking Chapter ${chapter.id}...`);
  
  chapter.scenes.forEach((scene, sceneIndex) => {
    // Check if this scene has no nextScene and no choices, but isn't the last scene
    if (!scene.nextScene && !scene.choices && scene.type !== 'choice') {
      const isLastScene = sceneIndex === chapter.scenes.length - 1;
      const isEndingScene = scene.id.includes('final') || scene.id.includes('end') || scene.id === '3-28';
      
      if (!isLastScene && !isEndingScene) {
        problematicScenes.push({
          chapter: chapter.id,
          scene: scene.id,
          index: sceneIndex,
          text: scene.text?.substring(0, 50) + '...'
        });
        issuesFound++;
      }
    }
    
    // Also check if nextScene points to non-existent scene
    if (scene.nextScene) {
      const nextExists = storyData.chapters.some(ch => 
        ch.scenes.some(s => s.id === scene.nextScene)
      );
      if (!nextExists) {
        console.log(`  ⚠️ Scene ${scene.id} points to non-existent scene: ${scene.nextScene}`);
        issuesFound++;
      }
    }
  });
});

// Report findings
if (problematicScenes.length > 0) {
  console.log('\n❌ Found scenes that might incorrectly trigger "Chapter Complete":');
  problematicScenes.forEach(p => {
    console.log(`  - ${p.scene} in Chapter ${p.chapter}: ${p.text}`);
  });
}

// Check the specific scene mentioned in the bug
const chapter3 = storyData.chapters.find(ch => ch.id === 3);
if (chapter3) {
  // Find the scene with Devon's text
  const devonScene = chapter3.scenes.find(s => 
    s.text && s.text.includes("Devon shows you active project")
  );
  
  if (devonScene) {
    console.log(`\n🔍 Checking the reported stuck scene:`);
    console.log(`  Scene ID: ${devonScene.id}`);
    console.log(`  Has nextScene: ${devonScene.nextScene || 'NO - This is the problem!'}`);
    console.log(`  Has choices: ${devonScene.choices ? 'Yes' : 'No'}`);
    
    // Check the continuation
    if (devonScene.nextScene) {
      const nextScene = chapter3.scenes.find(s => s.id === devonScene.nextScene);
      if (nextScene) {
        console.log(`  Next scene (${devonScene.nextScene}) exists: ✓`);
        console.log(`  Next scene leads to: ${nextScene.nextScene || 'END'}`);
      } else {
        console.log(`  Next scene (${devonScene.nextScene}) exists: ✗ - BROKEN LINK`);
      }
    }
  }
  
  // Find where the game might be getting stuck
  const sceneBeforeStuck = chapter3.scenes.find(s => 
    s.text && s.text.includes("Every beam, every system")
  );
  
  if (sceneBeforeStuck) {
    console.log(`\n🎯 Found the exact stuck point:`);
    console.log(`  Scene: ${sceneBeforeStuck.id}`);
    console.log(`  Current nextScene: ${sceneBeforeStuck.nextScene || 'MISSING'}`);
    
    // Check if this is actually the second paragraph shown
    const prevScene = chapter3.scenes.find(s =>
      s.text && s.text.includes("Pursuing all three opportunities")
    );
    
    if (prevScene) {
      console.log(`\n📍 Previous scene in screenshot:`);
      console.log(`  Scene: ${prevScene.id}`);
      console.log(`  Leads to: ${prevScene.nextScene || 'MISSING'}`);
    }
  }
}

// Look for any scene that matches the screenshot text
const searchTexts = [
  "Pursuing all three opportunities simultaneously",
  "The construction/systems path solidifies"
];

console.log('\n🔎 Searching for exact scenes from screenshot:');
searchTexts.forEach(searchText => {
  storyData.chapters.forEach(chapter => {
    const foundScene = chapter.scenes.find(s => 
      s.text && s.text.includes(searchText)
    );
    if (foundScene) {
      console.log(`\nFound: "${searchText.substring(0, 30)}..."`);
      console.log(`  Scene ID: ${foundScene.id}`);
      console.log(`  Chapter: ${chapter.id}`);
      console.log(`  Next Scene: ${foundScene.nextScene || '❌ MISSING - This causes "Chapter Complete"'}`);
      console.log(`  Has Choices: ${foundScene.choices ? 'Yes' : 'No'}`);
      
      // If no nextScene, this is our problem
      if (!foundScene.nextScene && !foundScene.choices) {
        console.log(`  🚨 THIS IS THE BUG: Scene has no navigation!`);
        
        // Find what should come next
        const sceneIndex = chapter.scenes.findIndex(s => s.id === foundScene.id);
        if (sceneIndex < chapter.scenes.length - 1) {
          const shouldBeNext = chapter.scenes[sceneIndex + 1];
          console.log(`  ✅ FIX: Should lead to ${shouldBeNext.id}`);
          
          // Apply the fix
          foundScene.nextScene = shouldBeNext.id;
          issuesFound++;
        }
      }
    }
  });
});

if (issuesFound > 0) {
  // Save the fixed story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  console.log(`\n✅ Fixed ${issuesFound} navigation issues`);
  console.log('The game should no longer get stuck at "Chapter Complete"');
} else {
  console.log('\n✅ No navigation issues found');
}