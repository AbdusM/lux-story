#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the useSimpleGame.ts file
const filePath = path.join(__dirname, 'hooks', 'useSimpleGame.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract SIMPLE_SCENES object
const scenesMatch = content.match(/const SIMPLE_SCENES = ({[\s\S]*?})\s*as const/);
if (!scenesMatch) {
  console.error("Could not find SIMPLE_SCENES in file");
  process.exit(1);
}

// Parse the scenes (simplified - this is rough parsing)
const scenesText = scenesMatch[1];
const scenes = {};

// Extract each scene
const sceneMatches = scenesText.matchAll(/(\w+):\s*{([^}]+(?:{[^}]+}[^}]+)*)}/g);
for (const match of sceneMatches) {
  const sceneId = match[1];
  const sceneContent = match[2];
  scenes[sceneId] = sceneContent;
}

console.log("\n=== SCENE DATA INTEGRITY AUDIT ===\n");
console.log(`Total scenes found: ${Object.keys(scenes).length}`);

// Audit results
let missingNext = 0;
let invalidNext = 0;
let placeholderContent = 0;
let invalidPatterns = 0;
let validPatterns = ['analytical', 'helping', 'building', 'patience'];
let brokenScenes = [];
let placeholderScenes = [];

// Check each scene
Object.entries(scenes).forEach(([sceneId, content]) => {
  // Check for choices
  const choicesMatch = content.match(/choices:\s*\[([\s\S]*?)\]/);
  if (choicesMatch) {
    const choicesText = choicesMatch[1];

    // Check each choice
    const choiceMatches = choicesText.matchAll(/{([^}]+)}/g);
    for (const choiceMatch of choiceMatches) {
      const choice = choiceMatch[1];

      // Check for missing next
      if (!choice.includes('next:')) {
        missingNext++;
        brokenScenes.push(`${sceneId} - missing 'next'`);
      }

      // Check for placeholder content (containing " or ")
      if (choice.includes('" or "') || choice.includes("' or '")) {
        placeholderContent++;
        placeholderScenes.push(sceneId);
      }

      // Check pattern validity
      const patternMatch = choice.match(/pattern:\s*['"](\w+)['"]/);
      if (patternMatch && !validPatterns.includes(patternMatch[1])) {
        invalidPatterns++;
        brokenScenes.push(`${sceneId} - invalid pattern: ${patternMatch[1]}`);
      }
    }
  }
});

// Check for console.warn statements
const warningCount = (content.match(/console\.warn/g) || []).length;

// Check validateChoice fallback usage
const validateMatch = content.match(/validateChoice[\s\S]*?getContextualFallback/g);
const hasFallbackLogic = validateMatch ? true : false;

console.log("\n=== CRITICAL ISSUES ===");
console.log(`❌ Choices missing 'next' property: ${missingNext}`);
console.log(`❌ Invalid 'next' references: ${invalidNext}`);
console.log(`❌ Placeholder content (with 'or'): ${placeholderContent}`);
console.log(`❌ Invalid pattern types: ${invalidPatterns}`);
console.log(`⚠️  Console warnings in code: ${warningCount}`);
console.log(`⚠️  Has fallback validation: ${hasFallbackLogic}`);

if (brokenScenes.length > 0) {
  console.log("\n=== BROKEN SCENES (First 10) ===");
  brokenScenes.slice(0, 10).forEach(scene => console.log(`  - ${scene}`));
}

if (placeholderScenes.length > 0) {
  console.log("\n=== SCENES WITH PLACEHOLDER CONTENT ===");
  placeholderScenes.forEach(scene => console.log(`  - ${scene}`));
}

// Calculate health score
const totalChoices = Object.keys(scenes).length * 3; // Estimate 3 choices per scene
const issueCount = missingNext + invalidNext + placeholderContent + invalidPatterns;
const healthScore = Math.max(0, 100 - (issueCount / totalChoices * 100));

console.log("\n=== SYSTEM HEALTH ===");
console.log(`Data Integrity Score: ${healthScore.toFixed(1)}%`);
console.log(`Scenes requiring fixes: ${new Set([...brokenScenes, ...placeholderScenes]).size}`);

// Recommendations
console.log("\n=== RECOMMENDATIONS ===");
if (healthScore < 50) {
  console.log("🚨 CRITICAL: System has major data integrity issues");
  console.log("   - Fix all missing 'next' properties immediately");
  console.log("   - Remove all placeholder content");
  console.log("   - Validate all pattern types");
} else if (healthScore < 80) {
  console.log("⚠️  WARNING: System needs significant cleanup");
  console.log("   - Address broken scene transitions");
  console.log("   - Clean up placeholder content");
} else {
  console.log("✅ System data mostly intact, minor fixes needed");
}

console.log("\n=== ARCHITECTURAL ASSESSMENT ===");
console.log("Current: Static scene-based branching narrative");
console.log("Problem: Users expect dynamic conversation, getting fixed paths");
console.log("Options:");
console.log("  A. Polish as branching story (2 weeks)");
console.log("  B. Add AI layer for dynamic responses (4-6 weeks)");
console.log("  C. Full rebuild with conversation engine (8+ weeks)");