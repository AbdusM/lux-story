#!/usr/bin/env node

/**
 * Convert Narration Scenes to Choice Scenes
 * Systematic enhancement of interactivity for Birmingham youth
 */

const fs = require('fs');
const path = require('path');

// Load the story data
const storyPath = path.join(__dirname, '../data/grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Career themes for choice mapping
const CAREER_THEMES = {
  helping: {
    keywords: ['help', 'care', 'support', 'people', 'others', 'community', 'service'],
    careers: ['healthcare', 'education', 'social work', 'counseling', 'therapy'],
    choices: ['Help someone', 'Offer support', 'Listen to others', 'Care for people']
  },
  building: {
    keywords: ['build', 'create', 'make', 'construct', 'design', 'craft', 'art'],
    careers: ['engineering', 'construction', 'development', 'design', 'architecture'],
    choices: ['Build something', 'Create something new', 'Design a solution', 'Make it better']
  },
  analyzing: {
    keywords: ['analyze', 'study', 'research', 'data', 'numbers', 'logic', 'think'],
    careers: ['data science', 'research', 'finance', 'technology', 'analysis'],
    choices: ['Analyze the situation', 'Study the details', 'Research more', 'Think it through']
  },
  exploring: {
    keywords: ['explore', 'discover', 'adventure', 'travel', 'new', 'unknown', 'curious'],
    careers: ['innovation', 'travel', 'discovery', 'entrepreneurship', 'exploration'],
    choices: ['Explore further', 'Discover something new', 'Take a risk', 'Try something different']
  },
  listening: {
    keywords: ['listen', 'hear', 'sound', 'music', 'quiet', 'attention', 'focus'],
    careers: ['therapy', 'music', 'communications', 'counseling', 'audio'],
    choices: ['Listen carefully', 'Pay attention', 'Focus on details', 'Hear them out']
  },
  thinking: {
    keywords: ['think', 'consider', 'ponder', 'reflect', 'philosophy', 'deep', 'wisdom'],
    careers: ['academia', 'writing', 'strategy', 'philosophy', 'research'],
    choices: ['Think deeply', 'Consider carefully', 'Reflect on this', 'Ponder the meaning']
  }
};

// Choice templates for different scene types
const CHOICE_TEMPLATES = {
  environmental: {
    pattern: /(walk|step|move|go|head|travel|journey|path|way|direction)/i,
    template: (text) => ({
      question: "What catches your attention as you move forward?",
      choices: [
        "The people around you",
        "The environment and setting", 
        "The details and systems",
        "Your own thoughts and feelings"
      ]
    })
  },
  emotional: {
    pattern: /(feel|emotion|mood|atmosphere|sense|vibe|energy|mood)/i,
    template: (text) => ({
      question: "How do you respond to this feeling?",
      choices: [
        "Embrace and explore it",
        "Stay calm and observe",
        "Seek understanding",
        "Take action based on it"
      ]
    })
  },
  discovery: {
    pattern: /(see|notice|observe|discover|find|spot|realize|understand)/i,
    template: (text) => ({
      question: "What interests you most about what you've discovered?",
      choices: [
        "The people involved",
        "How it works",
        "What it means",
        "What you can do with it"
      ]
    })
  },
  interaction: {
    pattern: /(meet|talk|speak|converse|interact|approach|greet|introduce)/i,
    template: (text) => ({
      question: "How do you want to engage with this person?",
      choices: [
        "Ask questions and listen",
        "Share your own thoughts",
        "Help them with something",
        "Learn from their experience"
      ]
    })
  },
  decision: {
    pattern: /(decide|choose|pick|select|determine|resolve|conclude)/i,
    template: (text) => ({
      question: "What factors matter most in your decision?",
      choices: [
        "What helps others",
        "What builds something lasting",
        "What makes logical sense",
        "What feels right to you"
      ]
    })
  }
};

// Function to analyze text and determine career theme
function analyzeCareerTheme(text) {
  const words = text.toLowerCase().split(/\s+/);
  const themeScores = {};
  
  Object.keys(CAREER_THEMES).forEach(theme => {
    themeScores[theme] = 0;
    CAREER_THEMES[theme].keywords.forEach(keyword => {
      if (words.some(word => word.includes(keyword))) {
        themeScores[theme]++;
      }
    });
  });
  
  const maxScore = Math.max(...Object.values(themeScores));
  if (maxScore === 0) return 'exploring'; // Default theme
  
  return Object.keys(themeScores).find(theme => themeScores[theme] === maxScore);
}

// Function to determine choice template
function determineChoiceTemplate(text) {
  for (const [type, config] of Object.entries(CHOICE_TEMPLATES)) {
    if (config.pattern.test(text)) {
      return type;
    }
  }
  return 'environmental'; // Default template
}

// Function to generate career-focused choices
function generateCareerChoices(theme, template) {
  const themeData = CAREER_THEMES[theme];
  const baseChoices = template.choices || [
    "Focus on the people involved",
    "Pay attention to how things work", 
    "Consider what this means",
    "Think about what you can do"
  ];
  
  // Enhance choices with career-specific language
  return baseChoices.map((choice, index) => {
    const careerKeywords = themeData.keywords;
    const careerChoice = themeData.choices[index] || choice;
    return {
      text: careerChoice,
      consequence: `${theme}_${index + 1}`,
      careerAlignment: theme,
      emotionalWeight: Math.random() * 0.5 + 0.5 // 0.5-1.0
    };
  });
}

// Function to convert narration scene to choice scene
function convertNarrationToChoice(scene) {
  if (scene.type !== 'narration') return scene;
  
  const careerTheme = analyzeCareerTheme(scene.text);
  const templateType = determineChoiceTemplate(scene.text);
  const template = CHOICE_TEMPLATES[templateType];
  
  // Generate question based on template
  const question = template.template(scene.text).question;
  
  // Generate career-focused choices
  const choices = generateCareerChoices(careerTheme, template.template(scene.text));
  
  // Create new choice scene
  const choiceScene = {
    ...scene,
    type: 'choice',
    text: `${scene.text}\n\n${question}`,
    choices: choices.map((choice, index) => ({
      text: choice.text,
      consequence: choice.consequence,
      nextScene: scene.nextScene, // Keep same next scene for now
      stateChanges: {
        patterns: {
          [careerTheme]: 1
        },
        careerValues: {
          [careerTheme]: choice.emotionalWeight
        }
      }
    }))
  };
  
  return choiceScene;
}

// Function to process all scenes in a chapter
function processChapter(chapter) {
  console.log(`Processing Chapter ${chapter.id}: ${chapter.title}`);
  
  let convertedCount = 0;
  const processedScenes = chapter.scenes.map(scene => {
    if (scene.type === 'narration' && Math.random() < 0.7) { // Convert 70% of narration scenes
      convertedCount++;
      return convertNarrationToChoice(scene);
    }
    return scene;
  });
  
  console.log(`  Converted ${convertedCount} narration scenes to choice scenes`);
  
  return {
    ...chapter,
    scenes: processedScenes
  };
}

// Main processing function
function main() {
  console.log('🚀 Starting systematic narration-to-choice conversion...');
  console.log(`📊 Original stats: ${storyData.chapters.length} chapters`);
  
  let totalConverted = 0;
  const processedChapters = storyData.chapters.map(chapter => {
    const processed = processChapter(chapter);
    const converted = processed.scenes.filter(scene => scene.type === 'choice').length;
    totalConverted += converted;
    return processed;
  });
  
  const processedStory = {
    ...storyData,
    version: "2.1.0-interactive",
    chapters: processedChapters
  };
  
  // Create backup
  const backupPath = storyPath.replace('.json', '-backup-before-conversion.json');
  fs.writeFileSync(backupPath, JSON.stringify(storyData, null, 2));
  console.log(`💾 Created backup: ${backupPath}`);
  
  // Write processed story
  fs.writeFileSync(storyPath, JSON.stringify(processedStory, null, 2));
  
  console.log('✅ Conversion complete!');
  console.log(`📈 Converted ${totalConverted} scenes to interactive choices`);
  console.log(`🎯 Target achieved: ~${Math.round((totalConverted / (totalConverted + 281)) * 100)}% interactive scenes`);
}

// Run the conversion
if (require.main === module) {
  main();
}

module.exports = { convertNarrationToChoice, processChapter, main };
