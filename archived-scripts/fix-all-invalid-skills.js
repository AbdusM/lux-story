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
  let totalFixed = 0;
  
  // Replace underscore versions with camelCase
  const replacements = [
    ['self_awareness', 'emotional_intelligence'],
    ['active_listening', 'communication'],
    ['systems_thinking', 'critical_thinking'],
    ['critical_thinking', 'criticalThinking'],
    ['emotional_intelligence', 'emotionalIntelligence'],
    ['problem_solving', 'problemSolving'],
    ['digital_literacy', 'digitalLiteracy'],
    ['cultural_competence', 'culturalCompetence'],
    ['financial_literacy', 'financialLiteracy'],
    ['time_management', 'timeManagement']
  ];
  
  replacements.forEach(([from, to]) => {
    const regex = new RegExp(`"${from}"`, 'g');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      content = content.replace(regex, `"${to}"`);
      totalFixed += matches.length;
      console.log(`   ${file}: "${from}" → "${to}" (${matches.length}x)`);
    }
  });
  
  if (totalFixed > 0) {
    writeFileSync(file, content);
    console.log(`✅ ${file}: Fixed ${totalFixed} skill names\n`);
  }
});

console.log('\n✅ All skill names now use correct camelCase format!');
