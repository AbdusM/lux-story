import fs from 'fs';
import path from 'path';

// Quick and dirty parse of the scenes
function auditScenes() {
  const filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  // Find where SIMPLE_SCENES starts and ends
  const startIdx = content.indexOf('const SIMPLE_SCENES = {');
  if (startIdx === -1) {
    console.error("Could not find SIMPLE_SCENES");
    return;
  }

  // Find the closing brace (crude but works for this)
  let braceCount = 0;
  let endIdx = startIdx;
  let inString = false;
  let stringChar = '';

  for (let i = startIdx; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i-1] : '';

    // Handle string boundaries
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }
  }

  const scenesText = content.substring(startIdx, endIdx + 1);

  // Count issues
  let stats = {
    totalScenes: 0,
    missingNext: 0,
    invalidPatterns: [],
    placeholderContent: [],
    consoleWarns: (content.match(/console\.warn/g) || []).length,
    problemScenes: new Set()
  };

  // Valid patterns
  const validPatterns = ['analytical', 'helping', 'building', 'patience'];

  // Find all scene definitions
  const sceneMatches = scenesText.matchAll(/'([^']+)':\s*{/g);
  for (const match of sceneMatches) {
    stats.totalScenes++;
    const sceneId = match[1];

    // Find the scene content
    const sceneStart = match.index + match[0].length;
    let sceneEnd = scenesText.indexOf("'},", sceneStart);
    if (sceneEnd === -1) sceneEnd = scenesText.length;

    const sceneContent = scenesText.substring(sceneStart, sceneEnd);

    // Check choices
    if (sceneContent.includes('choices:')) {
      // Check for missing next
      const choiceBlocks = sceneContent.matchAll(/{([^}]+)}/g);
      for (const block of choiceBlocks) {
        const choiceText = block[1];

        // Missing next?
        if (choiceText.includes('text:') && !choiceText.includes('next:')) {
          stats.missingNext++;
          stats.problemScenes.add(sceneId);
        }

        // Placeholder content?
        if (choiceText.includes('" or "') || choiceText.includes("' or '")) {
          stats.placeholderContent.push(sceneId);
          stats.problemScenes.add(sceneId);
        }

        // Invalid pattern?
        const patternMatch = choiceText.match(/pattern:\s*['"]([^'"]+)['"]/);
        if (patternMatch && !validPatterns.includes(patternMatch[1])) {
          stats.invalidPatterns.push(`${sceneId}: ${patternMatch[1]}`);
          stats.problemScenes.add(sceneId);
        }
      }
    }
  }

  // Generate report
  console.log("\n=== DATA INTEGRITY AUDIT REPORT ===\n");
  console.log(`Total Scenes: ${stats.totalScenes}`);
  console.log(`Console Warnings in Code: ${stats.consoleWarns}`);

  console.log("\n=== CRITICAL ISSUES ===");
  console.log(`❌ Choices missing 'next': ${stats.missingNext}`);
  console.log(`❌ Scenes with placeholder content: ${stats.placeholderContent.length}`);
  console.log(`❌ Invalid patterns: ${stats.invalidPatterns.length}`);

  if (stats.placeholderContent.length > 0) {
    console.log("\n=== SCENES WITH 'OR' PLACEHOLDER TEXT ===");
    stats.placeholderContent.forEach(id => console.log(`  - ${id}`));
  }

  if (stats.invalidPatterns.length > 0) {
    console.log("\n=== INVALID PATTERNS ===");
    stats.invalidPatterns.slice(0, 10).forEach(p => console.log(`  - ${p}`));
  }

  // Health assessment
  const totalIssues = stats.missingNext + stats.placeholderContent.length + stats.invalidPatterns.length;
  const healthScore = Math.max(0, 100 - (totalIssues / stats.totalScenes * 100));

  console.log("\n=== SYSTEM HEALTH ===");
  console.log(`Data Integrity Score: ${healthScore.toFixed(1)}%`);
  console.log(`Scenes with problems: ${stats.problemScenes.size} / ${stats.totalScenes}`);

  console.log("\n=== ASSESSMENT ===");
  if (totalIssues === 0) {
    console.log("✅ No data integrity issues found!");
    console.log("The system's data structure is intact.");
  } else if (totalIssues < 10) {
    console.log("⚠️  Minor issues found - quick fixes needed");
    console.log("Recommendation: Fix these specific issues then proceed");
  } else {
    console.log("🚨 CRITICAL: Major data integrity problems");
    console.log("Recommendation: Comprehensive audit and cleanup required");
  }

  console.log("\n=== ARCHITECTURAL REALITY CHECK ===");
  console.log("You have a static branching narrative with 471+ hardcoded scenes.");
  console.log("Users expect: Dynamic conversation with contextual responses");
  console.log("Users get: Pre-written paths with no acknowledgment of their specific choices");
  console.log("\nOptions:");
  console.log("A. Accept it's a CYOA book, polish the best 50-100 paths (2 weeks)");
  console.log("B. Add Gemini API layer for dynamic responses (4-6 weeks)");
  console.log("C. Rebuild as actual conversation engine (8+ weeks)");
}

auditScenes();