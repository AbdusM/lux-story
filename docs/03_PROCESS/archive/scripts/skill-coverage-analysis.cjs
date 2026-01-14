#!/usr/bin/env node
/**
 * Skill Coverage Analysis
 * Shows collective skill coverage across all characters
 *
 * Run: node scripts/skill-coverage-analysis.cjs
 */

const fs = require('fs');
const path = require('path');

const MAPPINGS_PATH = path.join(__dirname, '../lib/scene-skill-mappings.ts');
const content = fs.readFileSync(MAPPINGS_PATH, 'utf8');

// Extract all skill demonstrations
const skillDemos = {};
const charSkills = {};

const sceneRegex = /'([^']+)':\s*\{[\s\S]*?characterArc:\s*'([^']+)'[\s\S]*?choiceMappings:\s*\{([\s\S]*?)\n\s*\}\s*\}/g;
const choiceRegex = /skillsDemonstrated:\s*\[([^\]]+)\]/g;

let match;
while ((match = sceneRegex.exec(content)) !== null) {
  const [, sceneId, char, choiceMappings] = match;
  if (!charSkills[char]) charSkills[char] = new Set();

  let choiceMatch;
  while ((choiceMatch = choiceRegex.exec(choiceMappings)) !== null) {
    const skills = choiceMatch[1].split(',').map(s => s.trim().replace(/'/g, ''));
    for (const skill of skills) {
      if (skill) {
        charSkills[char].add(skill);
        if (!skillDemos[skill]) skillDemos[skill] = { total: 0, chars: {} };
        skillDemos[skill].total++;
        skillDemos[skill].chars[char] = (skillDemos[skill].chars[char] || 0) + 1;
      }
    }
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('         COLLECTIVE SKILL COVERAGE - All Characters');
console.log('═══════════════════════════════════════════════════════════════\n');

const sortedSkills = Object.entries(skillDemos).sort((a, b) => b[1].total - a[1].total);

console.log('SKILL                 TOTAL  STATUS        DEEP SOURCES');
console.log('─────────────────────────────────────────────────────────────');

let deepSkills = 0;
let totalSkills = sortedSkills.length;

for (const [skill, data] of sortedSkills) {
  const charList = Object.entries(data.chars)
    .filter(([,c]) => c >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([chr, count]) => chr + '(' + count + ')')
    .join(', ');

  const totalPad = String(data.total).padStart(3);
  let status;
  if (data.total >= 10) status = '✓✓ VERY DEEP';
  else if (data.total >= 5) status = '✓ DEEP';
  else if (data.total >= 3) status = '~ okay';
  else status = '✗ shallow';

  if (data.total >= 3) deepSkills++;

  const skillName = skill.length > 21 ? skill.substring(0, 18) + '...' : skill;
  console.log(skillName.padEnd(22) + totalPad + '  ' + status.padEnd(14) + (charList || '(no deep source)'));
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('         COVERAGE SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Total unique skills: ' + totalSkills);
console.log('Skills at deep level (3+): ' + deepSkills + ' (' + Math.round(deepSkills/totalSkills*100) + '%)');
console.log('Total skill demonstrations: ' + sortedSkills.reduce((s, x) => s + x[1].total, 0));

// Character summary
console.log('\nCharacter contribution:');
const charTotals = {};
for (const [skill, data] of sortedSkills) {
  for (const [chr, count] of Object.entries(data.chars)) {
    charTotals[chr] = (charTotals[chr] || 0) + count;
  }
}
const sortedChars = Object.entries(charTotals).sort((a, b) => b[1] - a[1]);
for (const [chr, total] of sortedChars) {
  const barLen = Math.ceil(total / 5);
  let bar = '';
  for (let i = 0; i < barLen; i++) bar += '█';
  console.log('  ' + chr.padEnd(10) + ' ' + bar + ' (' + total + ' skill demos)');
}

// Skill categories breakdown
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('         SKILL TAXONOMY COVERAGE');
console.log('═══════════════════════════════════════════════════════════════\n');

const skillCategories = {
  'Mind (Cognitive)': ['criticalThinking', 'problemSolving', 'systemsThinking', 'digitalLiteracy',
    'technicalLiteracy', 'informationLiteracy', 'strategicThinking', 'creativity', 'curiosity', 'deepWork'],
  'Heart (Emotional)': ['emotionalIntelligence', 'empathy', 'patience', 'culturalCompetence',
    'mentorship', 'encouragement', 'respect'],
  'Voice (Communication)': ['communication', 'collaboration', 'leadership', 'marketing'],
  'Hands (Action)': ['actionOrientation', 'crisisManagement', 'triage', 'courage', 'resilience',
    'riskManagement', 'urgency'],
  'Compass (Values)': ['adaptability', 'learningAgility', 'humility', 'fairness', 'pragmatism',
    'integrity', 'accountability', 'wisdom'],
  'Craft (Professional)': ['timeManagement', 'financialLiteracy', 'curriculumDesign', 'entrepreneurship', 'observation']
};

for (const [category, skills] of Object.entries(skillCategories)) {
  console.log('▸ ' + category + ':');
  for (const skill of skills) {
    const data = skillDemos[skill];
    if (data) {
      const status = data.total >= 10 ? '✓✓' : data.total >= 5 ? '✓' : data.total >= 3 ? '~' : '✗';
      const charList = [...new Set(Object.keys(data.chars))].join(', ');
      console.log('  ' + skill.padEnd(22) + String(data.total).padStart(3) + ' demos ' + status + '  [' + charList + ']');
    } else {
      console.log('  ' + skill.padEnd(22) + '  0 demos ✗  [NOT MAPPED]');
    }
  }
  console.log('');
}
