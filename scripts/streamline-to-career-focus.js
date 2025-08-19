const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Track what we're doing
let totalScenes = 0;
let keptScenes = 0;
let cutScenes = 0;
const cutList = [];

// Essential scenes to ALWAYS keep
const essentialScenes = [
  '1-1',   // Opening
  '1-2',   // First choice
  '1-3b',  // Meet Samuel
  '1-8',   // Platform discovery
  '2-1',   // Chapter 2 start
  '2-3a2', // Maya's crisis (now working-class relevant)
  '2-5',   // Career values exploration
  '2-8',   // Skills assessment
  '2-12',  // Values clarity
  '3-1',   // Chapter 3 start
  '3-2a',  // UAB exploration
  '3-2b',  // Innovation Depot
  '3-2c',  // Regions Bank
  '3-2d',  // Red Mountain Park
  '3-5',   // Career decision point
  '3-8',   // Program selection
  '3-11',  // Birmingham connection
  '3-17',  // Final decision
  '3-20',  // Ending
];

// Scenes that serve career exploration
const careerRelevantKeywords = [
  'career', 'job', 'work', 'skill', 'platform', 'Birmingham', 'UAB', 
  'Innovation Depot', 'program', 'training', 'salary', 'wage', 
  'healthcare', 'technology', 'trades', 'diploma', 'certificate',
  'values', 'strengths', 'interests', 'future', 'path', 'choice',
  'decide', 'opportunity', 'application', 'interview', 'hire'
];

// Function to determine if a scene serves career exploration
function isCareerRelevant(scene) {
  // Always keep essential scenes
  if (essentialScenes.includes(scene.id)) {
    return true;
  }
  
  // Check if it's a choice scene (choices are engaging)
  if (scene.type === 'choice' && scene.choices) {
    // But only if choices relate to career/values
    const hasCareerChoice = scene.choices.some(c => 
      careerRelevantKeywords.some(keyword => 
        c.text.toLowerCase().includes(keyword)
      )
    );
    if (hasCareerChoice) return true;
  }
  
  // Check scene text for career relevance
  const text = (scene.text || '').toLowerCase();
  const hasCareerContent = careerRelevantKeywords.some(keyword => 
    text.includes(keyword)
  );
  
  // Keep character introductions and crises (they're relatable)
  if (scene.speaker && text.includes('fail') || text.includes('struggle') || text.includes('worry')) {
    return true;
  }
  
  // Keep Birmingham-specific content
  if (text.includes('birmingham') || text.includes('alabama')) {
    return true;
  }
  
  // Skip mystical/abstract scenes without career connection
  const mysticalWords = ['cosmic', 'eternal', 'mystical', 'magical', 'shimmer', 'glow', 'ethereal'];
  const tooMystical = mysticalWords.filter(word => text.includes(word)).length > 2;
  
  if (tooMystical && !hasCareerContent) {
    return false;
  }
  
  return hasCareerContent;
}

// Streamline each chapter
const streamlinedStory = {
  title: storyData.title,
  author: storyData.author,
  version: "2.0.0-streamlined",
  chapters: []
};

storyData.chapters.forEach((chapter, chapterIndex) => {
  const streamlinedChapter = {
    id: chapter.id,
    title: chapter.title,
    scenes: []
  };
  
  chapter.scenes.forEach(scene => {
    totalScenes++;
    
    if (isCareerRelevant(scene)) {
      streamlinedChapter.scenes.push(scene);
      keptScenes++;
    } else {
      cutScenes++;
      cutList.push({
        id: scene.id,
        type: scene.type,
        speaker: scene.speaker,
        preview: scene.text ? scene.text.substring(0, 50) + '...' : 'No text'
      });
    }
  });
  
  // Only add chapter if it has scenes
  if (streamlinedChapter.scenes.length > 0) {
    streamlinedStory.chapters.push(streamlinedChapter);
  }
});

// Fix scene connections after cuts
streamlinedStory.chapters.forEach(chapter => {
  chapter.scenes.forEach((scene, index) => {
    if (scene.choices) {
      scene.choices.forEach(choice => {
        // Check if the nextScene still exists
        const nextExists = streamlinedStory.chapters.some(ch => 
          ch.scenes.some(s => s.id === choice.nextScene)
        );
        
        if (!nextExists) {
          // Find the next available scene in sequence
          if (index < chapter.scenes.length - 1) {
            choice.nextScene = chapter.scenes[index + 1].id;
          } else {
            // Jump to next chapter
            const nextChapterIndex = streamlinedStory.chapters.findIndex(ch => ch.id === chapter.id) + 1;
            if (nextChapterIndex < streamlinedStory.chapters.length) {
              choice.nextScene = streamlinedStory.chapters[nextChapterIndex].scenes[0].id;
            }
          }
          console.log(`  → Redirected ${scene.id} choice to ${choice.nextScene}`);
        }
      });
    }
  });
});

// Save the streamlined version
const streamlinedPath = path.join(__dirname, '..', 'data', 'grand-central-story-streamlined.json');
fs.writeFileSync(streamlinedPath, JSON.stringify(streamlinedStory, null, 2));

// Also save a backup of the original
const backupPath = path.join(__dirname, '..', 'data', 'grand-central-story-full-backup.json');
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, JSON.stringify(storyData, null, 2));
}

// Create a report
const report = `# Streamlining Report

## Statistics
- Original scenes: ${totalScenes}
- Kept scenes: ${keptScenes} (${Math.round(keptScenes/totalScenes*100)}%)
- Cut scenes: ${cutScenes} (${Math.round(cutScenes/totalScenes*100)}%)

## Kept Essential Scenes
${essentialScenes.map(id => `- ${id}`).join('\n')}

## Cut Scenes Summary
${cutList.slice(0, 20).map(scene => 
  `- ${scene.id}${scene.speaker ? ` (${scene.speaker})` : ''}: ${scene.preview}`
).join('\n')}
${cutList.length > 20 ? `\n... and ${cutList.length - 20} more scenes` : ''}

## Result
✅ Created streamlined version focused on career exploration
📁 Saved to: data/grand-central-story-streamlined.json
🔒 Backup saved to: data/grand-central-story-full-backup.json
`;

fs.writeFileSync(path.join(__dirname, '..', 'docs', 'STREAMLINING_REPORT.md'), report);

console.log(`\n✂️  Streamlining Complete!`);
console.log(`📊 Cut ${cutScenes} of ${totalScenes} scenes (${Math.round(cutScenes/totalScenes*100)}% reduction)`);
console.log(`🎯 Kept ${keptScenes} career-focused scenes`);
console.log(`📁 Streamlined version: data/grand-central-story-streamlined.json`);
console.log(`💾 Backup saved: data/grand-central-story-full-backup.json`);
console.log(`📋 Full report: docs/STREAMLINING_REPORT.md`);

// Now update the main story file to use streamlined version
console.log('\n🔄 Updating main story file to use streamlined version...');
fs.writeFileSync(storyPath, JSON.stringify(streamlinedStory, null, 2));
console.log('✅ Main story file updated!');