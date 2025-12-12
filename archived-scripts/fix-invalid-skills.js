#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const files = [
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts', 
  'content/jordan-dialogue-graph.ts',
  'content/samuel-dialogue-graph.ts'
];

// Map invalid skill names to valid ones based on FutureSkills interface
const skillMapping = {
  'curiosity': 'critical_thinking',  // Curiosity is a form of critical thinking
  'self_awareness': 'emotional_intelligence',  // Self-awareness is part of EI
  'mindfulness': 'emotional_intelligence',  // Mindfulness is emotional regulation
  'integrity': 'leadership',  // Integrity is a leadership quality
  'active_listening': 'communication',  // Active listening is communication
  'systems_thinking': 'critical_thinking',  // Systems thinking is analytical
  'empathy': 'emotional_intelligence'  // Empathy is core EI
};

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let fixed = 0;
  
  Object.entries(skillMapping).forEach(([invalid, valid]) => {
    // Match the invalid skill in a skills array
    const regex = new RegExp(`"${invalid}"`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, `"${valid}"`);
      fixed += matches.length;
      console.log(`   Replaced "${invalid}" → "${valid}" (${matches.length} times)`);
    }
  });
  
  writeFileSync(file, content);
  
  if (fixed > 0) {
    console.log(`✅ ${file}: Fixed ${fixed} invalid skill names\n`);
  }
});

console.log('\n✅ All invalid skill names fixed!');
