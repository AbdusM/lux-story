const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

console.log('='.repeat(80));
console.log('TEXT CHUNKING ANALYSIS - COMPREHENSIVE REVIEW');
console.log('='.repeat(80));

// Analysis categories
const analysis = {
  tooLong: [],      // Paragraphs over 100 words
  tooShort: [],     // Paragraphs under 20 words (might be over-split)
  mayaDialogue: [], // All Maya dialogue for review
  openingScenes: [], // First scenes that might be too dense
  naturalBreaks: [], // Scenes that need natural pause points
};

// Helper function to count words
function wordCount(text) {
  return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
}

// Helper function to count sentences
function sentenceCount(text) {
  if (!text) return 0;
  // Split on sentence endings, accounting for dialogue
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.length;
}

// Analyze each scene
storyData.chapters.forEach(chapter => {
  chapter.scenes.forEach(scene => {
    const words = wordCount(scene.text);
    const sentences = sentenceCount(scene.text);
    
    // Track Maya's dialogue specifically
    if (scene.speaker === 'Maya' && scene.text) {
      analysis.mayaDialogue.push({
        id: scene.id,
        words: words,
        sentences: sentences,
        text: scene.text,
        hasNaturalBreak: scene.text.includes('" ') || scene.text.includes('? ') || scene.text.includes('. "')
      });
    }
    
    // Find overly long passages (desktop concern)
    if (words > 100 && scene.type === 'narration') {
      analysis.tooLong.push({
        id: scene.id,
        words: words,
        sentences: sentences,
        preview: scene.text.substring(0, 100) + '...'
      });
    }
    
    // Find overly short passages (might be over-split for mobile)
    if (words < 20 && words > 0 && !scene.id.includes('-')) {
      analysis.tooShort.push({
        id: scene.id,
        words: words,
        text: scene.text
      });
    }
    
    // Check opening scenes for density
    if (scene.id.startsWith('1-1') || scene.id.startsWith('2-1') || scene.id.startsWith('3-1')) {
      analysis.openingScenes.push({
        id: scene.id,
        words: words,
        sentences: sentences,
        sensoryDetails: (scene.text?.match(/smell|touch|feel|hear|see|taste/gi) || []).length
      });
    }
    
    // Find dialogue that could use natural breaks
    if (scene.type === 'dialogue' && scene.text) {
      // Check for multiple topics in one block
      const hasMultipleTopics = 
        (scene.text.includes('Look,') || scene.text.includes('You know') || 
         scene.text.includes('Listen,') || scene.text.includes('But ')) &&
        sentences > 3;
      
      if (hasMultipleTopics) {
        analysis.naturalBreaks.push({
          id: scene.id,
          speaker: scene.speaker,
          sentences: sentences,
          text: scene.text
        });
      }
    }
  });
});

// Generate report
console.log('\n📊 ANALYSIS RESULTS:\n');

// 1. Maya's Dialogue Analysis
console.log('1. MAYA\'S DIALOGUE PATTERNS');
console.log('-'.repeat(40));
const mayaLongDialogue = analysis.mayaDialogue.filter(d => d.words > 60);
if (mayaLongDialogue.length > 0) {
  console.log(`Found ${mayaLongDialogue.length} long Maya dialogues needing breaks:\n`);
  mayaLongDialogue.forEach(d => {
    console.log(`  Scene ${d.id}: ${d.words} words, ${d.sentences} sentences`);
    if (d.hasNaturalBreak) {
      console.log(`    ✓ Has natural break points`);
    } else {
      console.log(`    ⚠️ Needs break points added`);
    }
    // Show where to break
    if (d.text.includes('You know what\'s crazy?')) {
      console.log(`    → Break before "You know what's crazy?"`);
    }
    if (d.text.includes('Look,')) {
      console.log(`    → Break after "Look,"`);
    }
    console.log();
  });
}

// 2. Overly Long Passages
console.log('\n2. OVERLY LONG NARRATIVE BLOCKS (100+ words)');
console.log('-'.repeat(40));
if (analysis.tooLong.length > 0) {
  console.log(`Found ${analysis.tooLong.length} passages that are too long:\n`);
  analysis.tooLong.slice(0, 5).forEach(scene => {
    console.log(`  ${scene.id}: ${scene.words} words, ${scene.sentences} sentences`);
    console.log(`    "${scene.preview}"`);
  });
} else {
  console.log('✓ No overly long passages found');
}

// 3. Over-split Mobile Text
console.log('\n3. POTENTIALLY OVER-SPLIT TEXT (Under 20 words)');
console.log('-'.repeat(40));
const overSplitGroups = {};
analysis.tooShort.forEach(scene => {
  const baseId = scene.id.split('-').slice(0, 2).join('-');
  if (!overSplitGroups[baseId]) {
    overSplitGroups[baseId] = [];
  }
  overSplitGroups[baseId].push(scene);
});

Object.entries(overSplitGroups).slice(0, 5).forEach(([baseId, scenes]) => {
  if (scenes.length > 2) {
    console.log(`  Base scene ${baseId} split into ${scenes.length} tiny chunks:`);
    scenes.forEach(s => {
      console.log(`    - ${s.words} words: "${s.text?.substring(0, 50)}..."`);
    });
  }
});

// 4. Opening Scene Density
console.log('\n4. OPENING SCENE DENSITY CHECK');
console.log('-'.repeat(40));
analysis.openingScenes.forEach(scene => {
  if (scene.words > 60 || scene.sensoryDetails > 3) {
    console.log(`  ${scene.id}: ${scene.words} words, ${scene.sensoryDetails} sensory details`);
    if (scene.sensoryDetails > 3) {
      console.log(`    ⚠️ High sensory density - consider breaking`);
    }
  }
});

// 5. Dialogue Needing Natural Breaks
console.log('\n5. DIALOGUE NEEDING NATURAL BREAK POINTS');
console.log('-'.repeat(40));
analysis.naturalBreaks.slice(0, 10).forEach(scene => {
  console.log(`  ${scene.id} (${scene.speaker}): ${scene.sentences} sentences`);
  
  // Identify break points
  const text = scene.text;
  if (text.includes('You know')) {
    console.log(`    → Break before "You know"`);
  }
  if (text.includes('Look,')) {
    console.log(`    → Break after "Look,"`);
  }
  if (text.includes('But ')) {
    const butIndex = text.indexOf('But ');
    if (butIndex > 50) {
      console.log(`    → Break before "But"`);
    }
  }
  console.log();
});

// 6. Summary Statistics
console.log('\n📈 SUMMARY STATISTICS');
console.log('-'.repeat(40));
let totalScenes = 0;
let totalWords = 0;
let splitScenes = 0;

storyData.chapters.forEach(chapter => {
  chapter.scenes.forEach(scene => {
    totalScenes++;
    totalWords += wordCount(scene.text);
    if (scene.id.includes('-') && scene.id.match(/-\d+$/)) {
      splitScenes++;
    }
  });
});

const avgWords = Math.round(totalWords / totalScenes);
console.log(`Total scenes: ${totalScenes}`);
console.log(`Split scenes (mobile chunks): ${splitScenes}`);
console.log(`Average words per scene: ${avgWords}`);
console.log(`Scenes needing natural breaks: ${analysis.naturalBreaks.length}`);
console.log(`Maya dialogues needing attention: ${mayaLongDialogue.length}`);

// 7. Recommendations
console.log('\n🎯 PRIORITY RECOMMENDATIONS');
console.log('-'.repeat(40));
console.log('1. Add natural breaks to Maya\'s dialogue (not arbitrary splits)');
console.log('2. Merge some over-split mobile chunks (2-3 tiny scenes → 1 scene)');
console.log('3. Break opening narratives at sensory shifts');
console.log('4. Preserve visual hierarchy (borders, colors, icons)');
console.log('5. Use emotion/topic shifts for breaks, not word counts');

// Export findings for next script
const findings = {
  mayaDialoguesToFix: mayaLongDialogue,
  naturalBreaksNeeded: analysis.naturalBreaks,
  overSplitScenes: overSplitGroups,
  openingDensity: analysis.openingScenes.filter(s => s.sensoryDetails > 3)
};

fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'text-analysis-findings.json'),
  JSON.stringify(findings, null, 2)
);

console.log('\n✅ Analysis complete. Findings saved to text-analysis-findings.json');