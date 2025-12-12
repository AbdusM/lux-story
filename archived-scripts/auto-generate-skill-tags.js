#!/usr/bin/env node

/**
 * Auto-generate skill tags for remaining choices
 * Uses pattern-based logic to suggest appropriate skills
 */

import { readFileSync, writeFileSync } from 'fs';

const files = [
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts', 
  'content/jordan-dialogue-graph.ts',
  'content/samuel-dialogue-graph.ts'
];

// Skip patterns - choices that legitimately don't need skills
const SKIP_PATTERNS = [
  /^\(Continue\)/i,
  /^\[Continue\]/i,
  /^\[Nod/i,
  /^\[Wait/i,
  /^\[Listen/i,
  /^\[Pause/i,
  /^\[Reflect/i,
  /^Return to/i,
  /^Go back/i,
  /^Leave/i,
  /^\[.*\]$/,  // Generic bracketed actions
];

// Pattern → Skills mapping
const PATTERN_SKILLS = {
  'exploring': ['communication', 'curiosity'],
  'analytical': ['critical_thinking', 'communication'],
  'helping': ['emotional_intelligence', 'communication'],
  'patience': ['emotional_intelligence', 'communication'],
  'building': ['problem_solving', 'critical_thinking']
};

// Context-based skill enhancement
function enhanceSkills(baseSkills, choiceText, pattern) {
  const skills = [...baseSkills];
  const text = choiceText.toLowerCase();
  
  // Add specific skills based on choice content
  if (text.includes('pattern') || text.includes('connect')) skills.push('critical_thinking');
  if (text.includes('feel') || text.includes('emotion') || text.includes('understand')) skills.push('emotional_intelligence');
  if (text.includes('create') || text.includes('build') || text.includes('design')) skills.push('creativity');
  if (text.includes('solve') || text.includes('fix') || text.includes('problem')) skills.push('problem_solving');
  if (text.includes('together') || text.includes('help') || text.includes('team')) skills.push('collaboration');
  if (text.includes('lead') || text.includes('guide') || text.includes('teach')) skills.push('leadership');
  if (text.includes('adapt') || text.includes('change') || text.includes('flexible')) skills.push('adaptability');
  if (text.includes('listen') || text.includes('hear')) skills.push('active_listening');
  
  // Remove duplicates and return max 3 skills
  return [...new Set(skills)].slice(0, 3);
}

function shouldSkipChoice(choiceText) {
  return SKIP_PATTERNS.some(pattern => pattern.test(choiceText));
}

console.log('🤖 Auto-generating skill tags for remaining choices...\n');

let totalFixed = 0;

files.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  
  let modified = false;
  let fixCount = 0;
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Find choice blocks
    if (line.includes('choiceId:')) {
      const choiceId = line.match(/choiceId:\s*['"]([^'"]+)['"]/)?.[1];
      
      // Look ahead to find text, pattern, and check for skills
      let j = i + 1;
      let choiceText = '';
      let pattern = '';
      let hasSkills = false;
      let closingBrace = -1;
      
      while (j < lines.length && closingBrace === -1) {
        if (lines[j].includes('text:')) {
          choiceText = lines[j].match(/text:\s*["']([^"']+)["']/)?.[1] || '';
        }
        if (lines[j].includes('pattern:')) {
          pattern = lines[j].match(/pattern:\s*['"]([^'"]+)['"]/)?.[1] || '';
        }
        if (lines[j].includes('skills:')) {
          hasSkills = true;
        }
        if (lines[j].trim() === '},') {
          closingBrace = j;
          break;
        }
        j++;
      }
      
      // If no skills and not a skip pattern, add skills
      if (!hasSkills && choiceText && pattern && !shouldSkipChoice(choiceText)) {
        const baseSkills = PATTERN_SKILLS[pattern] || ['communication'];
        const skills = enhanceSkills(baseSkills, choiceText, pattern);
        
        // Find the line with pattern: to insert skills after
        let insertLine = -1;
        for (let k = i; k < closingBrace; k++) {
          if (lines[k].includes('pattern:')) {
            insertLine = k;
            break;
          }
        }
        
        if (insertLine !== -1) {
          const indent = lines[insertLine].match(/^(\s*)/)[1];
          const skillsLine = `${indent}skills: ${JSON.stringify(skills)},`;
          lines.splice(insertLine + 1, 0, skillsLine);
          modified = true;
          fixCount++;
          console.log(`   ✅ Added skills to "${choiceText.substring(0, 50)}..." (${skills.join(', ')})`);
        }
      }
    }
    
    i++;
  }
  
  if (modified) {
    writeFileSync(file, lines.join('\n'));
    console.log(`\n📝 ${file}: Added ${fixCount} skill tags\n`);
    totalFixed += fixCount;
  } else {
    console.log(`\n✅ ${file}: No changes needed\n`);
  }
});

console.log(`\n🎯 TOTAL: Added ${totalFixed} skill tags across all files`);
console.log(`\nRun skill count again to verify 100% coverage!`);

