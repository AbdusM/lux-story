#!/usr/bin/env node

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
  
  // Fix: skills: [...],\n      }  (trailing comma before closing brace with no next property)
  const regex = /(skills:\s*\[[^\]]+\]),(\s+\})/g;
  const newContent = content.replace(regex, (match, p1, p2) => {
    fixed++;
    return `${p1}${p2}`;
  });
  
  if (fixed > 0) {
    writeFileSync(file, newContent);
    console.log(`✅ ${file}: Removed ${fixed} trailing commas`);
  } else {
    console.log(`✅ ${file}: No trailing commas to fix`);
  }
});

console.log('\n✅ Trailing comma fixes complete!');
