#!/usr/bin/env node

/**
 * Fix missing commas after pattern: when skills: follows
 */

import { readFileSync, writeFileSync } from 'fs';

const files = [
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts', 
  'content/jordan-dialogue-graph.ts',
  'content/samuel-dialogue-graph.ts'
];

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let fixed = 0;
  
  // Fix pattern: 'X' followed by skills: (missing comma)
  const regex = /(pattern:\s*['"][^'"]+['"])\n(\s+skills:)/g;
  const newContent = content.replace(regex, (match, p1, p2) => {
    fixed++;
    return `${p1},\n${p2}`;
  });
  
  if (fixed > 0) {
    writeFileSync(file, newContent);
    console.log(`✅ ${file}: Fixed ${fixed} missing commas`);
  } else {
    console.log(`✅ ${file}: No fixes needed`);
  }
});

console.log('\n✅ Syntax fixes complete!');
