#!/usr/bin/env node

/**
 * Identify choices that should have skill tags but don't
 * Excludes navigation/continuation choices that legitimately don't need skills
 */

import { readFileSync } from 'fs';

const files = [
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts', 
  'content/jordan-dialogue-graph.ts',
  'content/samuel-dialogue-graph.ts'
];

// Patterns that indicate a choice doesn't need skill tracking
const SKIP_PATTERNS = [
  /^\(Continue\)/i,
  /^\[Continue\]/i,
  /^\[Nod/i,
  /^\[Wait/i,
  /^\[Listen/i,
  /^Return to/i,
  /^Go back/i,
  /^Leave/i,
  /^Stay quiet/i,
  /^\[.*\]$/,  // Generic bracketed actions like [Pause], [Reflect]
];

function shouldSkipChoice(choiceText) {
  return SKIP_PATTERNS.some(pattern => pattern.test(choiceText));
}

console.log('🔍 Identifying choices that need skill tags...\n');

let totalMissing = 0;
let totalSkipped = 0;
let totalNeedsTags = 0;

files.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  
  let currentNodeId = '';
  let currentChoiceId = '';
  let currentChoiceText = '';
  let choiceStartLine = 0;
  let inChoice = false;
  let hasSkills = false;
  
  const choicesNeedingSkills = [];
  
  lines.forEach((line, index) => {
    // Track current node
    if (line.includes('nodeId:')) {
      currentNodeId = line.match(/nodeId:\s*['"]([^'"]+)['"]/)?.[1] || '';
    }
    
    // Track choice blocks
    if (line.includes('choiceId:')) {
      // Check previous choice
      if (inChoice && !hasSkills && currentChoiceId && currentChoiceText) {
        if (shouldSkipChoice(currentChoiceText)) {
          totalSkipped++;
        } else {
          choicesNeedingSkills.push({
            nodeId: currentNodeId,
            choiceId: currentChoiceId,
            text: currentChoiceText,
            line: choiceStartLine + 1
          });
          totalNeedsTags++;
        }
      }
      
      // Start new choice
      currentChoiceId = line.match(/choiceId:\s*['"]([^'"]+)['"]/)?.[1] || '';
      choiceStartLine = index;
      inChoice = true;
      hasSkills = false;
      currentChoiceText = '';
    }
    
    // Get choice text
    if (inChoice && line.includes('text:')) {
      currentChoiceText = line.match(/text:\s*["']([^"']+)["']/)?.[1] || '';
    }
    
    // Check if this choice has skills
    if (inChoice && line.includes('skills:')) {
      hasSkills = true;
    }
    
    // End of choice block
    if (inChoice && line.trim() === '},') {
      if (!hasSkills && currentChoiceId && currentChoiceText) {
        if (shouldSkipChoice(currentChoiceText)) {
          totalSkipped++;
        } else {
          choicesNeedingSkills.push({
            nodeId: currentNodeId,
            choiceId: currentChoiceId,
            text: currentChoiceText,
            line: choiceStartLine + 1
          });
          totalNeedsTags++;
        }
      }
      inChoice = false;
      currentChoiceId = '';
      currentChoiceText = '';
      hasSkills = false;
    }
  });
  
  console.log(`\n📄 ${file.split('/').pop()}:`);
  console.log(`   Choices needing skills: ${choicesNeedingSkills.length}`);
  
  if (choicesNeedingSkills.length > 0) {
    console.log(`   \n   Top 10 examples:`);
    choicesNeedingSkills.slice(0, 10).forEach(choice => {
      console.log(`   - Line ${choice.line}: "${choice.text}" (${choice.choiceId})`);
    });
  }
});

console.log(`\n\n📊 SUMMARY:`);
console.log(`   Total choices without skills: ${totalMissing}`);
console.log(`   Navigation/Continue (skipped): ${totalSkipped}`);
console.log(`   Legitimate choices needing tags: ${totalNeedsTags}`);
console.log(`\n✅ Ready to systematically add skills to these choices!`);

