#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class StoryValidator {
  constructor(storyFilePath) {
    this.storyFilePath = storyFilePath;
    this.storyData = null;
    this.issues = {
      duplicateIds: [],
      selfReferences: [],
      brokenReferences: [],
      missingContent: [],
      invalidStructure: []
    };
  }

  async loadStoryData() {
    try {
      const data = fs.readFileSync(this.storyFilePath, 'utf8');
      const rawData = JSON.parse(data);
      
      // Extract all scenes from chapters
      this.storyData = {
        ...rawData,
        scenes: []
      };
      
      if (rawData.chapters) {
        rawData.chapters.forEach(chapter => {
          if (chapter.scenes) {
            this.storyData.scenes.push(...chapter.scenes);
          }
        });
      }
      
      console.log(`✓ Loaded story data: ${this.storyData.scenes.length} scenes from ${rawData.chapters?.length || 0} chapters`);
    } catch (error) {
      throw new Error(`Failed to load story data: ${error.message}`);
    }
  }

  validateDuplicateIds() {
    const idCounts = new Map();
    
    this.storyData.scenes.forEach((scene, index) => {
      const id = scene.id;
      if (!idCounts.has(id)) {
        idCounts.set(id, []);
      }
      idCounts.get(id).push({ scene, index });
    });

    idCounts.forEach((occurrences, id) => {
      if (occurrences.length > 1) {
        this.issues.duplicateIds.push({
          id,
          count: occurrences.length,
          occurrences: occurrences.map(o => ({
            index: o.index,
            type: o.scene.type,
            speaker: o.scene.speaker,
            nextScene: o.scene.nextScene,
            text: o.scene.text ? o.scene.text.substring(0, 100) + '...' : 'No text'
          }))
        });
      }
    });

    console.log(`⚠️  Found ${this.issues.duplicateIds.length} duplicate scene IDs`);
  }

  validateSelfReferences() {
    this.storyData.scenes.forEach((scene, index) => {
      if (scene.nextScene === scene.id) {
        this.issues.selfReferences.push({
          id: scene.id,
          index,
          type: scene.type,
          speaker: scene.speaker,
          text: scene.text ? scene.text.substring(0, 100) + '...' : 'No text'
        });
      }

      // Check choices for self-references
      if (scene.choices) {
        scene.choices.forEach((choice, choiceIndex) => {
          if (choice.nextScene === scene.id) {
            this.issues.selfReferences.push({
              id: scene.id,
              index,
              type: `choice-${choiceIndex}`,
              choiceText: choice.text,
              nextScene: choice.nextScene
            });
          }
        });
      }
    });

    console.log(`🔄 Found ${this.issues.selfReferences.length} self-referencing scenes`);
  }

  validateReferences() {
    const allIds = new Set(this.storyData.scenes.map(scene => scene.id));
    const referencedIds = new Set();

    this.storyData.scenes.forEach((scene, index) => {
      // Check nextScene references
      if (scene.nextScene) {
        referencedIds.add(scene.nextScene);
        if (!allIds.has(scene.nextScene)) {
          this.issues.brokenReferences.push({
            fromScene: scene.id,
            fromIndex: index,
            missingScene: scene.nextScene,
            type: 'nextScene'
          });
        }
      }

      // Check choice references
      if (scene.choices) {
        scene.choices.forEach((choice, choiceIndex) => {
          if (choice.nextScene) {
            referencedIds.add(choice.nextScene);
            if (!allIds.has(choice.nextScene)) {
              this.issues.brokenReferences.push({
                fromScene: scene.id,
                fromIndex: index,
                missingScene: choice.nextScene,
                type: `choice-${choiceIndex}`,
                choiceText: choice.text
              });
            }
          }
        });
      }
    });

    console.log(`🔗 Found ${this.issues.brokenReferences.length} broken references`);
  }

  validateContent() {
    this.storyData.scenes.forEach((scene, index) => {
      const issues = [];

      if (!scene.id) {
        issues.push('Missing scene ID');
      }

      if (!scene.type) {
        issues.push('Missing scene type');
      }

      if (scene.type === 'dialogue' && !scene.speaker) {
        issues.push('Dialogue scene missing speaker');
      }

      if (!scene.text && !scene.choices) {
        issues.push('Scene has no text or choices');
      }

      if (scene.text && scene.text.trim().length === 0) {
        issues.push('Scene has empty text');
      }

      if (scene.choices) {
        scene.choices.forEach((choice, choiceIndex) => {
          if (!choice.text || choice.text.trim().length === 0) {
            issues.push(`Choice ${choiceIndex} has empty text`);
          }
          if (!choice.nextScene) {
            issues.push(`Choice ${choiceIndex} missing nextScene`);
          }
        });
      }

      if (issues.length > 0) {
        this.issues.missingContent.push({
          id: scene.id,
          index,
          issues
        });
      }
    });

    console.log(`📝 Found ${this.issues.missingContent.length} content issues`);
  }

  generateReport() {
    const report = {
      summary: {
        totalScenes: this.storyData.scenes.length,
        duplicateIds: this.issues.duplicateIds.length,
        selfReferences: this.issues.selfReferences.length,
        brokenReferences: this.issues.brokenReferences.length,
        contentIssues: this.issues.missingContent.length,
        totalIssues: this.issues.duplicateIds.length + 
                    this.issues.selfReferences.length + 
                    this.issues.brokenReferences.length + 
                    this.issues.missingContent.length
      },
      issues: this.issues
    };

    return report;
  }

  async validate() {
    console.log('🔍 Starting story validation...\n');
    
    await this.loadStoryData();
    this.validateDuplicateIds();
    this.validateSelfReferences();
    this.validateReferences();
    this.validateContent();

    const report = this.generateReport();
    
    console.log('\n📊 VALIDATION SUMMARY:');
    console.log(`Total Scenes: ${report.summary.totalScenes}`);
    console.log(`Duplicate IDs: ${report.summary.duplicateIds}`);
    console.log(`Self-References: ${report.summary.selfReferences}`);
    console.log(`Broken References: ${report.summary.brokenReferences}`);
    console.log(`Content Issues: ${report.summary.contentIssues}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);

    // Write detailed report to file
    const reportPath = path.join(path.dirname(this.storyFilePath), 'story-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report written to: ${reportPath}`);

    return report;
  }
}

// CLI usage
async function main() {
  const storyPath = process.argv[2] || '/Users/abdusmuwwakkil/Development/30_lux-story/data/grand-central-story.json';
  
  try {
    const validator = new StoryValidator(storyPath);
    await validator.validate();
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default StoryValidator;