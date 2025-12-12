const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Make Maya's crisis more working-class relevant
const mayaFixes = {
  // Original pre-med overachiever problems → Real Birmingham youth problems
  
  // Scene 2-3a2 - Maya's introduction
  "I failed a big test last week. First F ever. My parents said 'it's fine, try again.' But they don't know I was so stressed I threw up before the test. Been getting good grades for years, now I can't even focus. My hands shake when I try to study.":
    "I lost my job at Target last week. Couldn't afford to miss my shift when my little brother got sick, but somebody had to watch him. Mom works doubles at the hospital. Now I'm behind on my phone bill and my community college application fee is due next week. Everyone says 'just work harder' but I'm already doing homework at 2 AM after my other job.",
  
  // Maya's background
  "My parents moved here from Taiwan in '92. They chose Birmingham because of the medical programs":
    "My mom came here from Mexico when I was little. She chose Birmingham because her sister said there were jobs",
  
  // Maya's pressure
  "Everyone expects me to be a doctor. It's been the plan since I was five":
    "Everyone expects me to be the first to graduate college. But they don't get how expensive it is",
  
  // Maya's current situation
  "I'm taking a gap year to 'reassess.' Really I'm just scared":
    "I'm trying to save up for school while helping at home. It's harder than I thought",
  
  // Maya's doubts
  "What if I'm not smart enough? What if I wasted four years?":
    "What if I can't afford it? What if I pick the wrong major and waste the loans?",
  
  // Maya's family dynamics
  "My parents don't understand. They think I'm being dramatic":
    "My mom doesn't understand. She didn't go to college but thinks it's easy if you just study",
  
  // Maya's career thoughts
  "Maybe I should just go into nursing instead. It's faster":
    "Maybe I should just do the welding program at Jeff State. It pays good and it's only two years",
  
  // Maya's platform description
  "Platform 1 smells like antiseptic and ambition":
    "Platform 1 smells like coffee and early mornings",
};

// Process all scenes to fix Maya's character
let changesCount = 0;

storyData.chapters.forEach(chapter => {
  chapter.scenes.forEach(scene => {
    if (scene.speaker === 'Maya' || (scene.text && scene.text.includes('Maya'))) {
      let originalText = scene.text;
      
      // Apply Maya-specific fixes
      for (const [oldText, newText] of Object.entries(mayaFixes)) {
        if (scene.text && scene.text.includes(oldText)) {
          scene.text = scene.text.replace(oldText, newText);
          changesCount++;
          console.log(`✓ Fixed Maya's crisis in scene ${scene.id}`);
        }
      }
      
      // Additional contextual fixes for Maya
      if (scene.text) {
        scene.text = scene.text
          // Medical references → practical career references
          .replace(/medical school/g, "college")
          .replace(/pre-med/g, "college prep")
          .replace(/MCAT/g, "SAT")
          .replace(/anatomy exam/g, "math test")
          .replace(/organic chemistry/g, "algebra")
          .replace(/residency/g, "apprenticeship")
          .replace(/stethoscope/g, "textbook")
          .replace(/scrubs/g, "work uniform")
          
          // Upper-middle class → working class
          .replace(/private tutors/g, "YouTube videos")
          .replace(/study abroad/g, "summer job")
          .replace(/prep courses/g, "library study groups")
          .replace(/college counselor/g, "guidance counselor who's never available")
          .replace(/trust fund/g, "savings")
          .replace(/parents' expectations/g, "family counting on me")
          
          // Add working-class authenticity
          .replace(/wondering about my path/g, "trying to figure out how to pay for everything")
          .replace(/seeking my purpose/g, "needing a stable job")
          .replace(/finding myself/g, "making ends meet");
        
        if (scene.text !== originalText) {
          changesCount++;
        }
      }
    }
  });
});

// Add new Maya scenes that are more relevant
const newMayaContext = {
  "2-3a3": {
    "id": "2-3a3",
    "type": "dialogue",
    "speaker": "Maya",
    "text": "You know what's crazy? Everyone at school talks about 'following your passion.' Easy to say when your parents can pay for four years of finding yourself. I got one shot at this. If I pick wrong, that's $30,000 in loans for nothing. My cousin's still paying off her art degree while working at Walmart."
  },
  "2-3a4": {
    "id": "2-3a4",
    "type": "dialogue",
    "speaker": "Maya",
    "text": "Platform 1 shows healthcare careers, but not just doctor stuff. There's respiratory therapy at Jeff State - two years, $60K starting. Dental hygiene at UAB. Even medical coding you can learn online while working. Real paths, real paychecks. Not everyone needs to be a brain surgeon."
  }
};

// Save the updated story
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`\n✅ Fixed Maya's character for working-class relatability`);
console.log(`📝 Updated ${changesCount} scenes`);
console.log('👥 Maya now represents:');
console.log('  - First-generation college student');
console.log('  - Working multiple jobs');
console.log('  - Worried about student loans');
console.log('  - Family financial pressures');
console.log('  - Considering trade schools as valid options');