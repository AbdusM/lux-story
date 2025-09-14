#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class StoryFixer {
  constructor(storyFilePath) {
    this.storyFilePath = storyFilePath;
    this.storyData = null;
    this.fixes = {
      duplicateIds: [],
      selfReferences: [],
      totalFixed: 0
    };
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

  // Generate unique ID for duplicate scenes
  generateUniqueId(originalId, index, chapterId) {
    // If it's already unique, return as-is
    if (!this.isDuplicate(originalId)) {
      return originalId;
    }

    // Try different suffixes until we find a unique one
    let suffix = 1;
    let newId = `${originalId}-${suffix}`;
    
    while (this.isDuplicate(newId)) {
      suffix++;
      newId = `${originalId}-${suffix}`;
    }
    
    return newId;
  }

  // Check if an ID is already used
  isDuplicate(id) {
    let count = 0;
    this.storyData.chapters.forEach(chapter => {
      if (chapter.scenes) {
        chapter.scenes.forEach(scene => {
          if (scene.id === id) {
            count++;
          }
        });
      }
    });
    return count > 1;
  }

  // Fix duplicate IDs by making them unique
  fixDuplicateIds() {
    const idMap = new Map(); // Track original ID -> new unique ID mappings
    
    this.storyData.chapters.forEach((chapter, chapterIndex) => {
      if (chapter.scenes) {
        chapter.scenes.forEach((scene, sceneIndex) => {
          const originalId = scene.id;
          
          if (idMap.has(originalId)) {
            // This is a duplicate, generate unique ID
            const newId = this.generateUniqueId(originalId, sceneIndex, chapter.id);
            scene.id = newId;
            idMap.set(`${originalId}-${sceneIndex}`, newId);
            
            this.fixes.duplicateIds.push({
              originalId,
              newId,
              chapter: chapter.id,
              sceneIndex,
              text: scene.text ? scene.text.substring(0, 50) + '...' : 'No text'
            });
            
            console.log(`✓ Fixed duplicate ID: ${originalId} → ${newId}`);
          } else {
            // First occurrence, keep original ID
            idMap.set(originalId, originalId);
            idMap.set(`${originalId}-${sceneIndex}`, originalId);
          }
        });
      }
    });

    console.log(`✓ Fixed ${this.fixes.duplicateIds.length} duplicate IDs`);
  }

  // Fix self-referencing scenes
  fixSelfReferences() {
    this.storyData.chapters.forEach((chapter, chapterIndex) => {
      if (chapter.scenes) {
        chapter.scenes.forEach((scene, sceneIndex) => {
          // Fix nextScene self-references
          if (scene.nextScene === scene.id) {
            // Find the next scene in sequence
            const nextSceneIndex = sceneIndex + 1;
            if (nextSceneIndex < chapter.scenes.length) {
              const nextScene = chapter.scenes[nextSceneIndex];
              scene.nextScene = nextScene.id;
              
              this.fixes.selfReferences.push({
                sceneId: scene.id,
                originalNextScene: scene.id,
                newNextScene: nextScene.id,
                chapter: chapter.id,
                sceneIndex
              });
              
              console.log(`✓ Fixed self-reference: ${scene.id} → ${nextScene.id}`);
            } else {
              // Last scene in chapter, try to go to next chapter
              const nextChapter = this.storyData.chapters[chapterIndex + 1];
              if (nextChapter && nextChapter.scenes && nextChapter.scenes.length > 0) {
                scene.nextScene = nextChapter.scenes[0].id;
                
                this.fixes.selfReferences.push({
                  sceneId: scene.id,
                  originalNextScene: scene.id,
                  newNextScene: nextChapter.scenes[0].id,
                  chapter: chapter.id,
                  sceneIndex
                });
                
                console.log(`✓ Fixed self-reference: ${scene.id} → ${nextChapter.scenes[0].id} (next chapter)`);
              }
            }
          }

          // Fix choice self-references
          if (scene.choices) {
            scene.choices.forEach((choice, choiceIndex) => {
              if (choice.nextScene === scene.id) {
                // Find the next scene in sequence
                const nextSceneIndex = sceneIndex + 1;
                if (nextSceneIndex < chapter.scenes.length) {
                  const nextScene = chapter.scenes[nextSceneIndex];
                  choice.nextScene = nextScene.id;
                  
                  this.fixes.selfReferences.push({
                    sceneId: scene.id,
                    choiceIndex,
                    originalNextScene: scene.id,
                    newNextScene: nextScene.id,
                    chapter: chapter.id,
                    sceneIndex
                  });
                  
                  console.log(`✓ Fixed choice self-reference: ${scene.id} choice ${choiceIndex} → ${nextScene.id}`);
                }
              }
            });
          }
        });
      }
    });

    console.log(`✓ Fixed ${this.fixes.selfReferences.length} self-references`);
  }

  // Update all references to use new IDs
  updateReferences() {
    const idMap = new Map();
    
    // Build mapping of old IDs to new IDs
    this.fixes.duplicateIds.forEach(fix => {
      idMap.set(fix.originalId, fix.newId);
    });

    // Update all references
    this.storyData.chapters.forEach(chapter => {
      if (chapter.scenes) {
        chapter.scenes.forEach(scene => {
          // Update nextScene references
          if (scene.nextScene && idMap.has(scene.nextScene)) {
            scene.nextScene = idMap.get(scene.nextScene);
          }

          // Update choice references
          if (scene.choices) {
            scene.choices.forEach(choice => {
              if (choice.nextScene && idMap.has(choice.nextScene)) {
                choice.nextScene = idMap.get(choice.nextScene);
              }
            });
          }
        });
      }
    });

    console.log(`✓ Updated all references to use new IDs`);
  }

  // Save the fixed story data
  async saveFixedStory() {
    const backupPath = this.storyFilePath.replace('.json', '-backup-before-fix.json');
    
    // Create backup
    fs.writeFileSync(backupPath, JSON.stringify(this.storyData, null, 2));
    console.log(`✓ Created backup: ${backupPath}`);
    
    // Save fixed story
    fs.writeFileSync(this.storyFilePath, JSON.stringify(this.storyData, null, 2));
    console.log(`✓ Saved fixed story: ${this.storyFilePath}`);
  }

  // Generate fix report
  generateFixReport() {
    const report = {
      summary: {
        duplicateIdsFixed: this.fixes.duplicateIds.length,
        selfReferencesFixed: this.fixes.selfReferences.length,
        totalFixed: this.fixes.duplicateIds.length + this.fixes.selfReferences.length
      },
      fixes: this.fixes
    };

    const reportPath = path.join(path.dirname(this.storyFilePath), 'story-fix-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Fix report written to: ${reportPath}`);

    return report;
  }

  async fix() {
    console.log('🔧 Starting story fixes...\n');
    
    await this.loadStoryData();
    this.fixDuplicateIds();
    this.fixSelfReferences();
    this.updateReferences();
    await this.saveFixedStory();
    
    const report = this.generateFixReport();
    
    console.log('\n📊 FIX SUMMARY:');
    console.log(`Duplicate IDs Fixed: ${report.summary.duplicateIdsFixed}`);
    console.log(`Self-References Fixed: ${report.summary.selfReferencesFixed}`);
    console.log(`Total Issues Fixed: ${report.summary.totalFixed}`);

    return report;
  }
}

// CLI usage
async function main() {
  const storyPath = process.argv[2] || '/Users/abdusmuwwakkil/Development/30_lux-story/data/grand-central-story.json';
  
  try {
    const fixer = new StoryFixer(storyPath);
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

export default StoryFixer;
