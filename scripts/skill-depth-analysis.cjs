#!/usr/bin/env node
/**
 * Skill Depth Analysis
 * Shows per-character skill depth breakdown
 *
 * Run: node scripts/skill-depth-analysis.cjs
 */

const fs = require('fs');
const path = require('path');

const MAPPINGS_PATH = path.join(__dirname, '../lib/scene-skill-mappings.ts');
const content = fs.readFileSync(MAPPINGS_PATH, 'utf8');

// Extract all scene mappings
const sceneRegex = /'([^']+)':\s*\{[\s\S]*?characterArc:\s*'([^']+)'[\s\S]*?choiceMappings:\s*\{([\s\S]*?)\n\s*\}\s*\}/g;
const choiceRegex = /skillsDemonstrated:\s*\[([^\]]+)\]/g;

const charStats = {};
const charSkills = {};

let match;
while ((match = sceneRegex.exec(content)) !== null) {
  const [, sceneId, char, choiceMappings] = match;

  if (!charStats[char]) {
    charStats[char] = { scenes: 0, choices: 0, skills: new Set() };
    charSkills[char] = {};
  }

  charStats[char].scenes++;

  // Count choices and extract skills
  let choiceMatch;
  const choiceContent = choiceMappings;
  while ((choiceMatch = choiceRegex.exec(choiceContent)) !== null) {
    charStats[char].choices++;
    const skills = choiceMatch[1].split(',').map(s => s.trim().replace(/'/g, ''));
    for (const skill of skills) {
      if (skill) {
        charStats[char].skills.add(skill);
        charSkills[char][skill] = (charSkills[char][skill] || 0) + 1;
      }
    }
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('         SKILL DEPTH ANALYSIS - Scene Mappings');
console.log('═══════════════════════════════════════════════════════════════\n');

const sorted = Object.entries(charStats).sort((a, b) => b[1].choices - a[1].choices);

console.log('CHARACTER    SCENES  CHOICES  UNIQUE SKILLS');
console.log('─────────────────────────────────────────────────────────────');
for (const [char, stats] of sorted) {
  const scenePad = String(stats.scenes).padStart(3);
  const choicePad = String(stats.choices).padStart(4);
  const skillPad = String(stats.skills.size).padStart(4);
  console.log(char.padEnd(12) + scenePad + '     ' + choicePad + '      ' + skillPad);
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('         SKILL REPETITION DEPTH (times demonstrated)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (const [char, stats] of sorted) {
  console.log('▸ ' + char.toUpperCase() + ':');
  const skillEntries = Object.entries(charSkills[char]).sort((a, b) => b[1] - a[1]);

  if (skillEntries.length === 0) {
    console.log('  (no skill demonstrations mapped)\n');
    continue;
  }

  for (const [skill, count] of skillEntries) {
    const bar = '█'.repeat(Math.min(count, 20));
    const status = count >= 3 ? '✓ DEEP' : count >= 2 ? '~ medium' : '✗ shallow';
    console.log('  ' + skill.padEnd(22) + bar + ' (' + count + ') ' + status);
  }
  console.log('');
}

// Summary of problematic characters
console.log('═══════════════════════════════════════════════════════════════');
console.log('         CHARACTERS NEEDING MORE DEPTH');
console.log('═══════════════════════════════════════════════════════════════\n');

let needsWork = false;
for (const [char, stats] of sorted) {
  const shallowSkills = Object.entries(charSkills[char]).filter(([,c]) => c < 2);
  if (shallowSkills.length > 0 || stats.choices < 5) {
    needsWork = true;
    console.log('⚠ ' + char.toUpperCase() + ':');
    if (stats.choices < 5) {
      console.log('  → Only ' + stats.choices + ' choice mappings (need 5+ for depth)');
    }
    if (shallowSkills.length > 0) {
      console.log('  → Shallow skills (only 1 demo): ' + shallowSkills.map(s => s[0]).join(', '));
    }
    console.log('');
  }
}

if (!needsWork) {
  console.log('✓ All characters have adequate depth!\n');
}
