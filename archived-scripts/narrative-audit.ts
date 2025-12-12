#!/usr/bin/env npx tsx

import fs from 'fs';
import path from 'path';

interface Choice {
  text: string;
  next?: string;
  pattern?: string;
}

interface Scene {
  id: string;
  text: string;
  speaker?: string;
  choices?: Choice[];
  isEnding?: boolean;
}

// Parse the scenes from useSimpleGame.ts
function parseScenes(): Map<string, Scene> {
  const filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract SIMPLE_SCENES object
  const startIdx = content.indexOf('const SIMPLE_SCENES = {');
  const endIdx = content.indexOf('} as const', startIdx);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Could not find SIMPLE_SCENES in file');
  }

  const scenesText = content.substring(startIdx, endIdx + 1);

  // Parse scenes manually (crude but works)
  const scenes = new Map<string, Scene>();
  const sceneMatches = scenesText.matchAll(/'([^']+)':\s*{([^}]+(?:{[^}]+}[^}]+)*)}/g);

  for (const match of sceneMatches) {
    const id = match[1];
    const sceneContent = match[2];

    // Extract text
    const textMatch = sceneContent.match(/text:\s*[`"']([^`"']+)[`"']/);
    const text = textMatch ? textMatch[1] : '';

    // Extract speaker
    const speakerMatch = sceneContent.match(/speaker:\s*[`"']([^`"']+)[`"']/);
    const speaker = speakerMatch ? speakerMatch[1] : undefined;

    // Extract choices
    const choicesMatch = sceneContent.match(/choices:\s*\[([^\]]+)\]/);
    const choices: Choice[] = [];

    if (choicesMatch) {
      const choicesText = choicesMatch[1];
      const choiceMatches = choicesText.matchAll(/{([^}]+)}/g);

      for (const choiceMatch of choiceMatches) {
        const choiceContent = choiceMatch[1];
        const choiceTextMatch = choiceContent.match(/text:\s*[`"']([^`"']+)[`"']/);
        const choiceNextMatch = choiceContent.match(/next:\s*[`"']([^`"']+)[`"']/);
        const choicePatternMatch = choiceContent.match(/pattern:\s*[`"']([^`"']+)[`"']/);

        if (choiceTextMatch) {
          choices.push({
            text: choiceTextMatch[1],
            next: choiceNextMatch ? choiceNextMatch[1] : undefined,
            pattern: choicePatternMatch ? choicePatternMatch[1] : undefined
          });
        }
      }
    }

    scenes.set(id, {
      id,
      text,
      speaker,
      choices,
      isEnding: choices.length === 0
    });
  }

  return scenes;
}

// Analyze narrative patterns
function analyzeNarrative() {
  const scenes = parseScenes();

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('           NARRATIVE CONTENT AUDIT REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Basic statistics
  console.log('📊 BASIC STATISTICS');
  console.log('───────────────────────────');
  console.log(`Total Scenes: ${scenes.size}`);
  console.log(`Ending Scenes: ${Array.from(scenes.values()).filter(s => s.isEnding).length}`);
  console.log(`Branching Scenes: ${Array.from(scenes.values()).filter(s => s.choices && s.choices.length > 0).length}`);

  // Character analysis
  const speakers = new Map<string, number>();
  for (const scene of scenes.values()) {
    if (scene.speaker) {
      const speaker = scene.speaker.split('(')[0].trim();
      speakers.set(speaker, (speakers.get(speaker) || 0) + 1);
    }
  }

  console.log('\n👥 CHARACTER DISTRIBUTION');
  console.log('───────────────────────────');
  for (const [speaker, count] of speakers.entries()) {
    console.log(`${speaker}: ${count} scenes`);
  }

  // Choice analysis
  let totalChoices = 0;
  const choicePatterns = new Map<string, number>();
  const choiceQuality: {good: string[], bad: string[], generic: string[]} = {
    good: [],
    bad: [],
    generic: []
  };

  for (const scene of scenes.values()) {
    if (scene.choices) {
      for (const choice of scene.choices) {
        totalChoices++;

        // Track patterns
        if (choice.pattern) {
          choicePatterns.set(choice.pattern, (choicePatterns.get(choice.pattern) || 0) + 1);
        }

        // Analyze choice quality
        const text = choice.text.toLowerCase();

        // Generic choices (bad)
        if (text.match(/^(yes|no|okay|sure|maybe|continue|next)$/)) {
          choiceQuality.generic.push(choice.text);
        }
        // Good specific choices
        else if (text.length > 30 && text.includes('?')) {
          choiceQuality.good.push(choice.text);
        }
        // Binary/simple choices (not great)
        else if (text.split(' ').length <= 3) {
          choiceQuality.bad.push(choice.text);
        }
      }
    }
  }

  console.log('\n🎯 CHOICE ANALYSIS');
  console.log('───────────────────────────');
  console.log(`Total Choices: ${totalChoices}`);
  console.log(`Average Choices per Scene: ${(totalChoices / scenes.size).toFixed(1)}`);

  console.log('\nPattern Distribution:');
  for (const [pattern, count] of choicePatterns.entries()) {
    console.log(`  ${pattern}: ${count} (${(count/totalChoices*100).toFixed(1)}%)`);
  }

  console.log('\nChoice Quality:');
  console.log(`  ✅ Specific/Thoughtful: ${choiceQuality.good.length} (${(choiceQuality.good.length/totalChoices*100).toFixed(1)}%)`);
  console.log(`  ⚠️  Short/Simple: ${choiceQuality.bad.length} (${(choiceQuality.bad.length/totalChoices*100).toFixed(1)}%)`);
  console.log(`  ❌ Generic: ${choiceQuality.generic.length} (${(choiceQuality.generic.length/totalChoices*100).toFixed(1)}%)`);

  // Content themes
  const themes = {
    career: 0,
    birmingham: 0,
    family: 0,
    education: 0,
    tech: 0,
    healthcare: 0,
    anxiety: 0
  };

  for (const scene of scenes.values()) {
    const text = scene.text.toLowerCase();
    if (text.includes('career') || text.includes('job') || text.includes('work')) themes.career++;
    if (text.includes('birmingham') || text.includes('uab') || text.includes('southern')) themes.birmingham++;
    if (text.includes('family') || text.includes('parent') || text.includes('mother') || text.includes('father')) themes.family++;
    if (text.includes('school') || text.includes('university') || text.includes('college')) themes.education++;
    if (text.includes('tech') || text.includes('code') || text.includes('computer')) themes.tech++;
    if (text.includes('health') || text.includes('medical') || text.includes('doctor')) themes.healthcare++;
    if (text.includes('anxious') || text.includes('worried') || text.includes('scared') || text.includes('overwhelm')) themes.anxiety++;
  }

  console.log('\n📚 CONTENT THEMES');
  console.log('───────────────────────────');
  for (const [theme, count] of Object.entries(themes)) {
    console.log(`${theme}: ${count} scenes (${(count/scenes.size*100).toFixed(1)}%)`);
  }

  // Narrative flow analysis
  console.log('\n🔀 NARRATIVE FLOW');
  console.log('───────────────────────────');

  // Find orphaned scenes (not referenced)
  const referencedScenes = new Set<string>(['start']);
  for (const scene of scenes.values()) {
    if (scene.choices) {
      for (const choice of scene.choices) {
        if (choice.next) {
          referencedScenes.add(choice.next);
        }
      }
    }
  }

  const orphanedScenes = Array.from(scenes.keys()).filter(id => !referencedScenes.has(id));
  console.log(`Orphaned Scenes: ${orphanedScenes.length}`);
  if (orphanedScenes.length > 0 && orphanedScenes.length < 10) {
    orphanedScenes.forEach(id => console.log(`  - ${id}`));
  }

  // Find dead ends (scenes with no choices and no next)
  const deadEnds = Array.from(scenes.values()).filter(s =>
    (!s.choices || s.choices.length === 0) && !s.id.includes('end')
  );
  console.log(`Dead End Scenes: ${deadEnds.length}`);

  // Sample good and bad choices
  console.log('\n💭 CHOICE EXAMPLES');
  console.log('───────────────────────────');

  console.log('\n✅ Good Choices (specific, thoughtful):');
  choiceQuality.good.slice(0, 3).forEach(c => console.log(`  • "${c}"`));

  console.log('\n❌ Poor Choices (generic, low effort):');
  choiceQuality.generic.slice(0, 3).forEach(c => console.log(`  • "${c}"`));

  // Key findings
  console.log('\n🔍 KEY FINDINGS');
  console.log('───────────────────────────');

  const avgTextLength = Array.from(scenes.values())
    .reduce((sum, s) => sum + s.text.length, 0) / scenes.size;

  console.log(`• Average scene text length: ${Math.round(avgTextLength)} characters`);
  console.log(`• Scenes per character: ${(scenes.size / speakers.size).toFixed(1)}`);
  console.log(`• Choice diversity: ${choicePatterns.size} unique patterns`);

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('───────────────────────────');

  if (choiceQuality.generic.length > totalChoices * 0.2) {
    console.log('⚠️  Too many generic choices - needs more specific, contextual options');
  }

  if (themes.birmingham < scenes.size * 0.3) {
    console.log('⚠️  Low Birmingham content - needs more local context');
  }

  if (orphanedScenes.length > 5) {
    console.log('⚠️  Many orphaned scenes - check narrative flow connections');
  }

  if (avgTextLength > 500) {
    console.log('⚠️  Long scene texts - consider breaking into smaller chunks');
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

// Run the audit
analyzeNarrative();