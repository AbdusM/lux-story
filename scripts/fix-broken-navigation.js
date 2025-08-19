const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

let fixCount = 0;
const brokenScenes = [];

// Check all scenes for missing nextScene when they should have one
storyData.chapters.forEach(chapter => {
  for (let i = 0; i < chapter.scenes.length; i++) {
    const scene = chapter.scenes[i];
    const nextScene = chapter.scenes[i + 1];
    
    // If this is a narration or dialogue without choices and without nextScene
    if ((scene.type === 'narration' || scene.type === 'dialogue') && 
        !scene.choices && 
        !scene.nextScene &&
        nextScene) {
      
      // Check if the next scene logically follows
      // For split scenes (like 3-6d-1, 3-6d-2), they should connect
      if (scene.id.includes('-') && nextScene.id.includes('-')) {
        const baseId = scene.id.split('-').slice(0, -1).join('-');
        const nextBaseId = nextScene.id.split('-').slice(0, -1).join('-');
        
        if (baseId === nextBaseId) {
          // Same base scene, should connect
          scene.nextScene = nextScene.id;
          fixCount++;
          console.log(`✓ Fixed: ${scene.id} → ${nextScene.id}`);
          continue;
        }
      }
      
      // For scenes ending with a number followed by a scene with different base
      // Like 3-6d-2 should go to next logical scene (3-7)
      if (scene.id.match(/-\d+$/) && !nextScene.id.startsWith(scene.id.split('-')[0] + '-' + scene.id.split('-')[1])) {
        // Find the next major scene
        const majorSceneMatch = nextScene.id.match(/^(\d+-\d+)/);
        if (majorSceneMatch) {
          scene.nextScene = nextScene.id;
          fixCount++;
          console.log(`✓ Fixed: ${scene.id} → ${nextScene.id}`);
        }
      }
      
      // Track scenes that still have no nextScene
      if (!scene.nextScene && scene.type !== 'choice') {
        brokenScenes.push(scene.id);
      }
    }
  }
});

// Specific fixes for known broken paths
const specificFixes = [
  { sceneId: '3-6d-2', nextScene: '3-7' },
  { sceneId: '3-9b-2', nextScene: '3-10' },
  { sceneId: '3-11d-2', nextScene: '3-12' },
  { sceneId: '3-13d-2', nextScene: '3-14' },
  { sceneId: '3-15d-3', nextScene: '3-16' },
  { sceneId: '3-18d-3', nextScene: '3-19' },
  { sceneId: '3-19-final-9', nextScene: '3-19' },
  { sceneId: '3-24d-5', nextScene: '3-25' },
  { sceneId: '3-25-2', nextScene: '3-26' },
  { sceneId: '3-29-1', nextScene: '3-28' }
];

specificFixes.forEach(fix => {
  storyData.chapters.forEach(chapter => {
    const scene = chapter.scenes.find(s => s.id === fix.sceneId);
    if (scene && !scene.nextScene) {
      scene.nextScene = fix.nextScene;
      fixCount++;
      console.log(`✓ Specific fix: ${fix.sceneId} → ${fix.nextScene}`);
    }
  });
});

// Fix any remaining split scenes
storyData.chapters.forEach(chapter => {
  chapter.scenes.forEach((scene, index) => {
    if (!scene.nextScene && !scene.choices && scene.type !== 'choice') {
      // Check if this is a split scene (has hyphen and number at end)
      const splitMatch = scene.id.match(/^(.+)-(\d+)$/);
      if (splitMatch) {
        const baseId = splitMatch[1];
        const partNum = parseInt(splitMatch[2]);
        
        // Look for the next part
        const nextPart = chapter.scenes.find(s => s.id === `${baseId}-${partNum + 1}`);
        if (nextPart) {
          scene.nextScene = nextPart.id;
          fixCount++;
          console.log(`✓ Connected split scene: ${scene.id} → ${nextPart.id}`);
        } else {
          // Look for the next major scene
          const nextMajor = chapter.scenes.find(s => {
            const majorMatch = s.id.match(/^(\d+-\d+)$/);
            return majorMatch && s.id > baseId.split('-')[0] + '-' + baseId.split('-')[1];
          });
          if (nextMajor) {
            scene.nextScene = nextMajor.id;
            fixCount++;
            console.log(`✓ Connected to next major: ${scene.id} → ${nextMajor.id}`);
          }
        }
      }
    }
  });
});

// Save the fixed story
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`\n✅ Fixed ${fixCount} navigation issues`);
if (brokenScenes.length > 0) {
  console.log(`\n⚠️  Scenes still without navigation (may be intentional endings):`, brokenScenes.slice(0, 10));
}