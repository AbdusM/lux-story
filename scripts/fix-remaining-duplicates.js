#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class RemainingDuplicateFixer {
  constructor(storyFilePath) {
    this.storyFilePath = storyFilePath;
    this.storyData = null;
  }

  async loadStoryData() {
    try {
      const data = fs.readFileSync(this.storyFilePath, 'utf8');
      this.storyData = JSON.parse(data);
      console.log(`✓ Loaded story data: ${this.storyData.chapters?.length || 0} chapters`);
    } catch (error) {
      throw new Error(`Failed to load story data: ${error.message}`);
    }
  }

  fixRemainingDuplicates() {
    const idCounts = new Map();
    const idToNewId = new Map();
    
    // First pass: count all IDs and create mapping
    this.storyData.chapters.forEach((chapter, chapterIndex) => {
      if (chapter.scenes) {
        chapter.scenes.forEach((scene, sceneIndex) => {
          const id = scene.id;
          if (!idCounts.has(id)) {
            idCounts.set(id, []);
          }
          idCounts.get(id).push({ chapterIndex, sceneIndex, scene });
        });
      }
    });

    // Second pass: create unique IDs for duplicates
    idCounts.forEach((occurrences, id) => {
      if (occurrences.length > 1) {
        console.log(`Found ${occurrences.length} occurrences of ID: ${id}`);
        occurrences.forEach((occurrence, index) => {
          if (index > 0) { // Keep first occurrence as-is
            const newId = `${id}-${index + 1}`;
            idToNewId.set(`${occurrence.chapterIndex}-${occurrence.sceneIndex}`, newId);
            occurrence.scene.id = newId;
            console.log(`  → Renamed to: ${newId}`);
          }
        });
      }
    });

    // Third pass: update all references
    this.storyData.chapters.forEach((chapter, chapterIndex) => {
      if (chapter.scenes) {
        chapter.scenes.forEach((scene, sceneIndex) => {
          const key = `${chapterIndex}-${sceneIndex}`;
          const newId = idToNewId.get(key);
          
          if (newId) {
            // Update nextScene references
            if (scene.nextScene) {
              // Find if this nextScene was also renamed
              const nextSceneKey = this.findSceneKey(scene.nextScene);
              if (nextSceneKey && idToNewId.has(nextSceneKey)) {
                scene.nextScene = idToNewId.get(nextSceneKey);
              }
            }

            // Update choice references
            if (scene.choices) {
              scene.choices.forEach(choice => {
                if (choice.nextScene) {
                  const nextSceneKey = this.findSceneKey(choice.nextScene);
                  if (nextSceneKey && idToNewId.has(nextSceneKey)) {
                    choice.nextScene = idToNewId.get(nextSceneKey);
                  }
                }
              });
            }
          }
        });
      }
    });

    console.log(`✓ Fixed remaining duplicates`);
  }

  findSceneKey(sceneId) {
    for (let chapterIndex = 0; chapterIndex < this.storyData.chapters.length; chapterIndex++) {
      const chapter = this.storyData.chapters[chapterIndex];
      if (chapter.scenes) {
        for (let sceneIndex = 0; sceneIndex < chapter.scenes.length; sceneIndex++) {
          if (chapter.scenes[sceneIndex].id === sceneId) {
            return `${chapterIndex}-${sceneIndex}`;
          }
        }
      }
    }
    return null;
  }

  async saveFixedStory() {
    fs.writeFileSync(this.storyFilePath, JSON.stringify(this.storyData, null, 2));
    console.log(`✓ Saved fixed story: ${this.storyFilePath}`);
  }

  async fix() {
    console.log('🔧 Fixing remaining duplicates...\n');
    
    await this.loadStoryData();
    this.fixRemainingDuplicates();
    await this.saveFixedStory();
    
    console.log('\n✅ All remaining duplicates fixed!');
  }
}

// CLI usage
async function main() {
  const storyPath = process.argv[2] || '/Users/abdusmuwwakkil/Development/30_lux-story/data/grand-central-story.json';
  
  try {
    const fixer = new RemainingDuplicateFixer(storyPath);
    await fixer.fix();
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default RemainingDuplicateFixer;
