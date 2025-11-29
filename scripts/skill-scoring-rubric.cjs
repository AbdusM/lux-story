#!/usr/bin/env node
/**
 * Skill Scoring Rubric
 * Calculates depth scores for each character's skill mappings
 *
 * SCORING FORMULA (100 points max):
 * - Scene Coverage (25 pts): scenes / 10 × 25 (cap at 25)
 * - Choice Depth (25 pts): choices / 20 × 25 (cap at 25)
 * - Skill Breadth (25 pts): unique skills / 15 × 25 (cap at 25)
 * - Deep Skills (25 pts): skills with 3+ demos / 8 × 25 (cap at 25)
 *
 * Run: node scripts/skill-scoring-rubric.cjs
 */

const fs = require('fs');
const path = require('path');

const MAPPINGS_PATH = path.join(__dirname, '../lib/scene-skill-mappings.ts');
const content = fs.readFileSync(MAPPINGS_PATH, 'utf8');

const sceneRegex = /'([^']+)':\s*\{[\s\S]*?characterArc:\s*'([^']+)'[\s\S]*?choiceMappings:\s*\{([\s\S]*?)\n\s*\}\s*\}/g;
const choiceRegex = /skillsDemonstrated:\s*\[([^\]]+)\]/g;

const charData = {};

let match;
while ((match = sceneRegex.exec(content)) !== null) {
  const [, sceneId, char, choiceMappings] = match;

  if (!charData[char]) {
    charData[char] = { scenes: 0, choices: 0, skills: {}, uniqueSkills: new Set() };
  }

  charData[char].scenes++;

  let choiceMatch;
  while ((choiceMatch = choiceRegex.exec(choiceMappings)) !== null) {
    charData[char].choices++;
    const skills = choiceMatch[1].split(',').map(s => s.trim().replace(/'/g, ''));
    for (const skill of skills) {
      if (skill) {
        charData[char].uniqueSkills.add(skill);
        charData[char].skills[skill] = (charData[char].skills[skill] || 0) + 1;
      }
    }
  }
}

// Calculate scores
function calcScore(data) {
  const sceneScore = Math.min(25, (data.scenes / 10) * 25);
  const choiceScore = Math.min(25, (data.choices / 20) * 25);
  const breadthScore = Math.min(25, (data.uniqueSkills.size / 15) * 25);

  const deepSkills = Object.values(data.skills).filter(c => c >= 3).length;
  const depthScore = Math.min(25, (deepSkills / 8) * 25);

  return {
    scenes: data.scenes,
    choices: data.choices,
    unique: data.uniqueSkills.size,
    deep: deepSkills,
    sceneScore: Math.round(sceneScore * 10) / 10,
    choiceScore: Math.round(choiceScore * 10) / 10,
    breadthScore: Math.round(breadthScore * 10) / 10,
    depthScore: Math.round(depthScore * 10) / 10,
    total: Math.round((sceneScore + choiceScore + breadthScore + depthScore) * 10) / 10,
    skills: data.skills
  };
}

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('                    CHARACTER DEPTH SCORING RUBRIC');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('\nSCORING FORMULA (100 points max):');
console.log('  • Scene Coverage (25 pts): scenes / 10 × 25');
console.log('  • Choice Depth (25 pts):   choices / 20 × 25');
console.log('  • Skill Breadth (25 pts):  unique skills / 15 × 25');
console.log('  • Deep Skills (25 pts):    skills with 3+ demos / 8 × 25');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const scores = {};
for (const [char, data] of Object.entries(charData)) {
  scores[char] = calcScore(data);
}

const sorted = Object.entries(scores).sort((a, b) => b[1].total - a[1].total);

console.log('CHARACTER   SCENES  CHOICES  UNIQUE  DEEP   SC.PTS  CH.PTS  BR.PTS  DP.PTS  TOTAL');
console.log('────────────────────────────────────────────────────────────────────────────────');

for (const [char, s] of sorted) {
  const status = s.total >= 70 ? '✓' : '✗';
  console.log(
    char.padEnd(11) +
    String(s.scenes).padStart(4) + '    ' +
    String(s.choices).padStart(4) + '    ' +
    String(s.unique).padStart(4) + '   ' +
    String(s.deep).padStart(4) + '   ' +
    String(s.sceneScore).padStart(5) + '   ' +
    String(s.choiceScore).padStart(5) + '   ' +
    String(s.breadthScore).padStart(5) + '   ' +
    String(s.depthScore).padStart(5) + '   ' +
    String(s.total).padStart(5) + ' ' + status
  );
}

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('                    CHARACTERS BELOW 70 - NEEDS IMPROVEMENT');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

for (const [char, s] of sorted) {
  if (s.total < 70) {
    console.log('▸ ' + char.toUpperCase() + ' (Score: ' + s.total + ')');

    const neededPts = 70 - s.total;
    console.log('  Needs: +' + neededPts + ' points to reach 70\n');

    if (s.sceneScore < 25) {
      const neededScenes = Math.ceil((25 - s.sceneScore) / 2.5);
      console.log('  → Add ' + neededScenes + ' more scenes (currently ' + s.scenes + '/10)');
    }
    if (s.choiceScore < 25) {
      const neededChoices = Math.ceil((25 - s.choiceScore) / 1.25);
      console.log('  → Add ' + neededChoices + ' more choices (currently ' + s.choices + '/20)');
    }
    if (s.breadthScore < 25) {
      const neededSkills = Math.ceil((25 - s.breadthScore) / 1.67);
      console.log('  → Cover ' + neededSkills + ' more unique skills (currently ' + s.unique + '/15)');
    }
    if (s.depthScore < 25) {
      const neededDeep = Math.ceil((25 - s.depthScore) / 3.125);
      console.log('  → Deepen ' + neededDeep + ' more skills to 3+ demos (currently ' + s.deep + '/8 deep)');
    }

    const deepList = Object.entries(s.skills)
      .filter(([,c]) => c >= 3)
      .sort((a, b) => b[1] - a[1])
      .map(([sk, c]) => sk + '(' + c + ')');
    console.log('  Current deep skills: ' + (deepList.length ? deepList.join(', ') : 'none'));

    const almostDeep = Object.entries(s.skills)
      .filter(([,c]) => c === 2)
      .map(([sk]) => sk);
    if (almostDeep.length) {
      console.log('  Almost deep (need 1 more): ' + almostDeep.join(', '));
    }
    console.log('');
  }
}

if (sorted.every(([, s]) => s.total >= 70)) {
  console.log('✓ All characters meet the 70-point threshold!\n');
}
