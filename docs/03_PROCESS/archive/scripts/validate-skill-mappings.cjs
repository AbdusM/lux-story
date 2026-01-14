#!/usr/bin/env node
/**
 * Skill Mappings Validator
 * Stringent validation for scene-skill-mappings.ts
 *
 * Run: node scripts/validate-skill-mappings.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPPINGS_PATH = path.join(ROOT, 'lib/scene-skill-mappings.ts');

// Canonical skill taxonomy
const VALID_SKILLS = new Set([
  // Mind
  'criticalThinking', 'problemSolving', 'systemsThinking',
  'digitalLiteracy', 'technicalLiteracy', 'informationLiteracy',
  'strategicThinking', 'creativity', 'curiosity', 'deepWork',
  // Heart
  'emotionalIntelligence', 'empathy', 'patience',
  'culturalCompetence', 'mentorship', 'encouragement', 'respect',
  // Voice
  'communication', 'collaboration', 'leadership', 'marketing',
  // Hands
  'actionOrientation', 'crisisManagement', 'triage',
  'courage', 'resilience', 'riskManagement', 'urgency',
  // Compass
  'adaptability', 'learningAgility', 'humility', 'fairness',
  'pragmatism', 'integrity', 'accountability', 'wisdom',
  // Craft
  'timeManagement', 'financialLiteracy', 'curriculumDesign',
  'entrepreneurship', 'observation'
]);

const CHARACTERS = ['kai', 'rohan', 'silas', 'marcus', 'tess', 'yaquin', 'maya', 'devon', 'jordan', 'samuel'];

let errors = [];
let warnings = [];

console.log('═══════════════════════════════════════════════════════════════');
console.log('         SKILL MAPPINGS VALIDATION');
console.log('═══════════════════════════════════════════════════════════════\n');

// Load mappings
const mappingsContent = fs.readFileSync(MAPPINGS_PATH, 'utf8');

// ============= CHECK 1: Extract and validate skill names =============
console.log('▸ Check 1: Validating skill names...');
const skillMatches = mappingsContent.matchAll(/skillsDemonstrated:\s*\[([^\]]+)\]/g);
let invalidSkills = new Set();
let totalSkillRefs = 0;

for (const match of skillMatches) {
  const skills = match[1].split(',').map(s => s.trim().replace(/'/g, ''));
  for (const skill of skills) {
    if (skill && !VALID_SKILLS.has(skill)) {
      invalidSkills.add(skill);
      errors.push(`Invalid skill: "${skill}"`);
    }
    if (skill) totalSkillRefs++;
  }
}

if (invalidSkills.size === 0) {
  console.log(`  ✓ All ${totalSkillRefs} skill references are valid\n`);
} else {
  console.log(`  ✗ Found ${invalidSkills.size} invalid skills: ${[...invalidSkills].join(', ')}\n`);
}

// ============= CHECK 2: Validate scene IDs exist in dialogue graphs =============
console.log('▸ Check 2: Cross-referencing scene IDs with dialogue graphs...');

const sceneIdRegex = /sceneId:\s*'([^']+)'/g;
const sceneIds = [...mappingsContent.matchAll(sceneIdRegex)].map(m => m[1]);

// Load all dialogue graphs
const allNodeIds = new Set();
const charNodeIds = {};

for (const char of CHARACTERS) {
  const graphPath = path.join(ROOT, `content/${char}-dialogue-graph.ts`);
  if (fs.existsSync(graphPath)) {
    const graphContent = fs.readFileSync(graphPath, 'utf8');
    const nodeIds = [...graphContent.matchAll(/nodeId:\s*'([^']+)'/g)].map(m => m[1]);
    nodeIds.forEach(id => {
      allNodeIds.add(id);
      if (!charNodeIds[char]) charNodeIds[char] = new Set();
      charNodeIds[char].add(id);
    });
  }
}

let orphanedScenes = [];
for (const sceneId of sceneIds) {
  if (!allNodeIds.has(sceneId)) {
    orphanedScenes.push(sceneId);
    warnings.push(`Scene "${sceneId}" not found in any dialogue graph`);
  }
}

if (orphanedScenes.length === 0) {
  console.log(`  ✓ All ${sceneIds.length} scene IDs found in dialogue graphs\n`);
} else {
  console.log(`  ⚠ ${orphanedScenes.length} scenes not found: ${orphanedScenes.slice(0, 5).join(', ')}${orphanedScenes.length > 5 ? '...' : ''}\n`);
}

// ============= CHECK 3: Validate character arc assignments =============
console.log('▸ Check 3: Validating character arc assignments...');

const arcRegex = /characterArc:\s*'([^']+)'/g;
const arcs = [...mappingsContent.matchAll(arcRegex)].map(m => m[1]);
const invalidArcs = arcs.filter(arc => !CHARACTERS.includes(arc));

if (invalidArcs.length === 0) {
  console.log(`  ✓ All character arcs are valid\n`);
} else {
  console.log(`  ✗ Invalid character arcs: ${invalidArcs.join(', ')}\n`);
  errors.push(`Invalid character arcs: ${invalidArcs.join(', ')}`);
}

// ============= CHECK 4: Validate intensity values =============
console.log('▸ Check 4: Validating intensity values...');

const intensityRegex = /intensity:\s*'([^']+)'/g;
const intensities = [...mappingsContent.matchAll(intensityRegex)].map(m => m[1]);
const validIntensities = ['high', 'medium', 'low'];
const invalidIntensities = intensities.filter(i => !validIntensities.includes(i));

if (invalidIntensities.length === 0) {
  console.log(`  ✓ All ${intensities.length} intensity values are valid\n`);
} else {
  console.log(`  ✗ Invalid intensities: ${invalidIntensities.join(', ')}\n`);
  errors.push(`Invalid intensity values: ${invalidIntensities.join(', ')}`);
}

// ============= CHECK 5: Context length validation =============
console.log('▸ Check 5: Validating context descriptions...');

const contextRegex = /context:\s*'([^']+)'/g;
const contexts = [...mappingsContent.matchAll(contextRegex)].map(m => m[1]);
const shortContexts = contexts.filter(c => c.length < 20);

if (shortContexts.length === 0) {
  console.log(`  ✓ All ${contexts.length} context descriptions are adequate length\n`);
} else {
  console.log(`  ⚠ ${shortContexts.length} contexts are too short (<20 chars)\n`);
  warnings.push(`${shortContexts.length} context descriptions are too short`);
}

// ============= CHECK 6: Skill count per choice =============
console.log('▸ Check 6: Checking skills per choice...');

const choiceSkillMatches = mappingsContent.matchAll(/skillsDemonstrated:\s*\[([^\]]+)\]/g);
let overloadedChoices = 0;

for (const match of choiceSkillMatches) {
  const skills = match[1].split(',').filter(s => s.trim());
  if (skills.length > 4) {
    overloadedChoices++;
    warnings.push(`Choice has ${skills.length} skills (recommended max: 4)`);
  }
}

if (overloadedChoices === 0) {
  console.log(`  ✓ No overloaded choices (all have ≤4 skills)\n`);
} else {
  console.log(`  ⚠ ${overloadedChoices} choices have >4 skills\n`);
}

// ============= CHECK 7: Depth metrics =============
console.log('▸ Check 7: Calculating depth metrics...');

const charStats = {};
const charSkills = {};

const sceneRegex = /'([^']+)':\s*\{[\s\S]*?characterArc:\s*'([^']+)'[\s\S]*?choiceMappings:\s*\{([\s\S]*?)\n\s*\}\s*\}/g;
const choiceRegex = /skillsDemonstrated:\s*\[([^\]]+)\]/g;

let match;
while ((match = sceneRegex.exec(mappingsContent)) !== null) {
  const [, sceneId, char, choiceMappings] = match;
  if (!charStats[char]) {
    charStats[char] = { scenes: 0, choices: 0, skills: new Set() };
    charSkills[char] = {};
  }
  charStats[char].scenes++;

  let choiceMatch;
  while ((choiceMatch = choiceRegex.exec(choiceMappings)) !== null) {
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

// Calculate scores
let belowThreshold = [];
for (const [char, stats] of Object.entries(charStats)) {
  const sceneScore = Math.min(25, (stats.scenes / 10) * 25);
  const choiceScore = Math.min(25, (stats.choices / 20) * 25);
  const breadthScore = Math.min(25, (stats.skills.size / 15) * 25);
  const deepSkills = Object.values(charSkills[char]).filter(c => c >= 3).length;
  const depthScore = Math.min(25, (deepSkills / 8) * 25);
  const total = Math.round((sceneScore + choiceScore + breadthScore + depthScore) * 10) / 10;

  if (total < 70) {
    belowThreshold.push({ char, total });
    errors.push(`${char} scores ${total} (below 70 threshold)`);
  }
}

if (belowThreshold.length === 0) {
  console.log(`  ✓ All ${Object.keys(charStats).length} characters score 70+ on depth rubric\n`);
} else {
  console.log(`  ✗ ${belowThreshold.length} characters below threshold:\n`);
  belowThreshold.forEach(b => console.log(`    - ${b.char}: ${b.total}`));
  console.log('');
}

// ============= CHECK 8: Full skill coverage =============
console.log('▸ Check 8: Checking full skill taxonomy coverage...');

const skillCoverage = {};
for (const [char, skills] of Object.entries(charSkills)) {
  for (const [skill, count] of Object.entries(skills)) {
    skillCoverage[skill] = (skillCoverage[skill] || 0) + count;
  }
}

const uncoveredSkills = [...VALID_SKILLS].filter(s => !skillCoverage[s] || skillCoverage[s] < 3);

if (uncoveredSkills.length === 0) {
  console.log(`  ✓ All ${VALID_SKILLS.size} skills have 3+ demonstrations\n`);
} else {
  console.log(`  ⚠ ${uncoveredSkills.length} skills have <3 demos: ${uncoveredSkills.join(', ')}\n`);
  warnings.push(`Skills with insufficient coverage: ${uncoveredSkills.join(', ')}`);
}

// ============= FINAL REPORT =============
console.log('═══════════════════════════════════════════════════════════════');
console.log('         VALIDATION SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✓ ALL CHECKS PASSED\n');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`✗ ERRORS (${errors.length}):`);
    errors.forEach(e => console.log(`  - ${e}`));
    console.log('');
  }
  if (warnings.length > 0) {
    console.log(`⚠ WARNINGS (${warnings.length}):`);
    warnings.forEach(w => console.log(`  - ${w}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.log('VERDICT: FAILED - Fix errors before proceeding\n');
    process.exit(1);
  } else {
    console.log('VERDICT: PASSED WITH WARNINGS - Review recommended\n');
    process.exit(0);
  }
}
