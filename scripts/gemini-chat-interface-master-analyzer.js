#!/usr/bin/env node

/**
 * Comprehensive Chat Interface Master Analyzer
 *
 * Analyzes chat interface consistency, progressive dialogue compliance,
 * content quality, and scalability across all story elements.
 *
 * Ensures perfect, unified experience for scaling to 20 characters/10 career paths.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini AI with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required');
  console.error('💡 Add it to your .env.local file');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

class ChatInterfaceMasterAnalyzer {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.analysisResults = {
      progressiveDialogue: {},
      contentConsistency: {},
      technicalImplementation: {},
      uxExperience: {},
      scalabilityFramework: {},
      overallScore: 0,
      recommendations: []
    };

    // Load current codebase
    this.loadCodebase();
  }

  loadCodebase() {
    try {
      // Load key files for analysis
      const hookPath = path.join(__dirname, '../hooks/useSimpleGame.ts');
      const componentPath = path.join(__dirname, '../components/MinimalGameInterface.tsx');

      this.useSimpleGameContent = readFileSync(hookPath, 'utf-8');
      this.minimalGameInterfaceContent = readFileSync(componentPath, 'utf-8');

      console.log('✅ Codebase loaded successfully');
    } catch (error) {
      console.error('❌ Error loading codebase:', error.message);
      process.exit(1);
    }
  }

  async analyzeProgressiveDialogueCompliance() {
    console.log('\n🔍 Analyzing Progressive Dialogue Compliance...');

    const prompt = `
Analyze this React/TypeScript chat interface implementation for progressive dialogue compliance:

HOOK CODE:
${this.useSimpleGameContent.substring(0, 3000)}...

COMPONENT CODE:
${this.minimalGameInterfaceContent.substring(0, 3000)}...

PROGRESSIVE DIALOGUE REQUIREMENTS:
1. Scenes with \\n\\n breaks should trigger progressive dialogue mode (isShowingDialogue: true)
2. Each chunk should be 15-25 words (3-5 second reading time)
3. Continue button should appear during dialogue progression
4. Choice buttons should only appear after all dialogue chunks are shown
5. Single container rendering (not multiple fragments)
6. Proper state management (currentDialogueIndex, dialogueChunks)

ANALYSIS FOCUS:
- Does parseTextIntoChunks() work correctly?
- Are chunk sizes optimal for engagement?
- Is the UI flow Continue → Continue → Choices working?
- Any violations of single-container principle?
- State management consistency issues?

Provide specific issues found, compliance score (0-100), and improvement recommendations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      this.analysisResults.progressiveDialogue = {
        analysis,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Progressive dialogue compliance analysis complete');
    } catch (error) {
      console.error('❌ Error analyzing progressive dialogue:', error.message);
    }
  }

  async analyzeContentConsistency() {
    console.log('\n🔍 Analyzing Content Consistency Framework...');

    const prompt = `
Analyze this chat interface codebase for content consistency across all story elements:

CODE SAMPLE:
${this.useSimpleGameContent.substring(2000, 5000)}...

CONSISTENCY REQUIREMENTS:
1. Character voice consistency across all scenes
2. Birmingham integration authenticity and local references
3. Choice categorization accuracy (supportive, analytical, challenging, listening)
4. Emotional beat timing and narrative pacing
5. Career exploration effectiveness
6. Pattern recognition consistency

ANALYSIS FOCUS:
- Are character personalities consistent across different scenes?
- Do Birmingham references feel authentic and integrated?
- Are choice categories properly identified and themed?
- Is emotional pacing appropriate for career exploration?
- Are there any inconsistencies in tone or style?
- How well does the pattern recognition system work?

SCALABILITY CONCERN:
How would this consistency hold up with 20 characters and 10 career paths?

Provide specific inconsistencies found, consistency score (0-100), and scaling recommendations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      this.analysisResults.contentConsistency = {
        analysis,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Content consistency analysis complete');
    } catch (error) {
      console.error('❌ Error analyzing content consistency:', error.message);
    }
  }

  async analyzeTechnicalImplementation() {
    console.log('\n🔍 Analyzing Technical Implementation...');

    const prompt = `
Analyze the technical implementation of this progressive dialogue system:

HOOK IMPLEMENTATION:
${this.useSimpleGameContent.substring(5000, 8000)}...

COMPONENT IMPLEMENTATION:
${this.minimalGameInterfaceContent.substring(2000, 4000)}...

TECHNICAL REQUIREMENTS:
1. Proper state management (currentDialogueIndex, isShowingDialogue, dialogueChunks)
2. Efficient text parsing and chunking
3. Clean UI component rendering logic
4. Mobile-optimized text presentation
5. Performance considerations
6. Type safety and error handling

ANALYSIS FOCUS:
- Is the state management clean and efficient?
- Are there potential performance bottlenecks?
- Is the parseTextWithHierarchy() function optimized?
- Are there any memory leaks or inefficiencies?
- How well does it handle edge cases?
- Is the code maintainable for scaling?

Provide technical issues found, implementation score (0-100), and optimization recommendations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      this.analysisResults.technicalImplementation = {
        analysis,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Technical implementation analysis complete');
    } catch (error) {
      console.error('❌ Error analyzing technical implementation:', error.message);
    }
  }

  async analyzeUXExperience() {
    console.log('\n🔍 Analyzing UX/UI Experience...');

    const prompt = `
Analyze the user experience and interface design of this chat interface:

UI COMPONENT CODE:
${this.minimalGameInterfaceContent.substring(1000, 3000)}...

UX/UI REQUIREMENTS:
1. Visual hierarchy and breathing room
2. Information chunking cognitive load
3. Interactive engagement patterns
4. Platform-specific theming consistency
5. Accessibility and screen reader support
6. Mobile-first responsive design

ANALYSIS FOCUS:
- Does the progressive dialogue create better engagement than static blocks?
- Is the visual hierarchy clear and intuitive?
- Are the Continue buttons and choice buttons well-designed?
- Is the cognitive load appropriate for career exploration?
- Are there accessibility issues?
- How does it perform on mobile devices?

ENGAGEMENT METRICS:
- Does this solve the "6/10 static text" problem?
- Does it achieve the Pokemon/Visual Novel experience goal?
- Is the 3-5 second chunk timing optimal?

Provide UX issues found, experience score (0-100), and design improvement recommendations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      this.analysisResults.uxExperience = {
        analysis,
        timestamp: new Date().toISOString()
      };

      console.log('✅ UX/UI experience analysis complete');
    } catch (error) {
      console.error('❌ Error analyzing UX experience:', error.message);
    }
  }

  async analyzeScalabilityFramework() {
    console.log('\n🔍 Analyzing Scalability Architecture...');

    const prompt = `
Analyze the scalability of this chat interface for expansion to 20 characters and 10 career paths:

CURRENT ARCHITECTURE:
${this.useSimpleGameContent.substring(0, 2000)}...

SCALABILITY REQUIREMENTS:
1. Support for 20 unique characters with distinct voices
2. 10 different career path explorations
3. Maintaining consistency across expanded content
4. Performance with significantly more dialogue
5. Content management and quality assurance systems
6. Automated monitoring and compliance checking

ANALYSIS FOCUS:
- Can the current state management handle 20 characters?
- Is the pattern recognition system scalable?
- How will performance be affected with 10x more content?
- Are there architectural bottlenecks?
- What systematic quality control is needed?
- How to ensure consistency at scale?

SYSTEMATIC APPROACH:
- Content validation frameworks
- Automated compliance checking
- Performance optimization strategies
- Quality assurance processes

Provide scalability challenges, architecture score (0-100), and systematic scaling recommendations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      this.analysisResults.scalabilityFramework = {
        analysis,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Scalability framework analysis complete');
    } catch (error) {
      console.error('❌ Error analyzing scalability framework:', error.message);
    }
  }

  async generateOverallAssessment() {
    console.log('\n🔍 Generating Overall Assessment...');

    const prompt = `
Based on these comprehensive analyses, provide an overall assessment:

PROGRESSIVE DIALOGUE: ${this.analysisResults.progressiveDialogue.analysis?.substring(0, 500)}...
CONTENT CONSISTENCY: ${this.analysisResults.contentConsistency.analysis?.substring(0, 500)}...
TECHNICAL IMPLEMENTATION: ${this.analysisResults.technicalImplementation.analysis?.substring(0, 500)}...
UX EXPERIENCE: ${this.analysisResults.uxExperience.analysis?.substring(0, 500)}...
SCALABILITY: ${this.analysisResults.scalabilityFramework.analysis?.substring(0, 500)}...

PROVIDE:
1. Overall quality score (0-100)
2. Top 5 critical issues that must be fixed
3. Top 5 systematic improvements for scaling
4. Implementation priority ranking
5. Timeline estimate for achieving "perfect" consistency

FOCUS ON:
- What prevents this from being a unified, consistent experience?
- What systematic approaches are needed for 20 characters/10 paths?
- How to ensure story master and all elements are PERFECT?
`;

    try {
      const result = await this.model.generateContent(prompt);
      const assessment = result.response.text();

      this.analysisResults.overallAssessment = {
        assessment,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Overall assessment complete');
    } catch (error) {
      console.error('❌ Error generating overall assessment:', error.message);
    }
  }

  generateReport() {
    console.log('\n📊 Generating Comprehensive Report...');

    const report = `# Chat Interface Master Analysis Report

Generated: ${new Date().toISOString()}

## Executive Summary

This comprehensive analysis examines the chat interface implementation for consistency, progressive dialogue compliance, and scalability to support 20 characters and 10 career paths.

## Progressive Dialogue Compliance

${this.analysisResults.progressiveDialogue.analysis || 'Analysis pending...'}

## Content Consistency Framework

${this.analysisResults.contentConsistency.analysis || 'Analysis pending...'}

## Technical Implementation Assessment

${this.analysisResults.technicalImplementation.analysis || 'Analysis pending...'}

## UX/UI Experience Evaluation

${this.analysisResults.uxExperience.analysis || 'Analysis pending...'}

## Scalability Architecture Analysis

${this.analysisResults.scalabilityFramework.analysis || 'Analysis pending...'}

## Overall Assessment & Recommendations

${this.analysisResults.overallAssessment?.assessment || 'Assessment pending...'}

## Next Steps

1. Address critical issues identified in each category
2. Implement systematic quality assurance processes
3. Create automated monitoring for consistency
4. Develop scalability framework for expansion
5. Establish continuous improvement workflow

---
*Generated by Chat Interface Master Analyzer*
*Using Gemini 2.0 Flash for comprehensive AI analysis*
`;

    // Save report
    const reportPath = path.join(__dirname, '../CHAT_INTERFACE_MASTER_ANALYSIS.md');
    writeFileSync(reportPath, report);

    console.log(`✅ Report saved to: ${reportPath}`);
    return reportPath;
  }

  async runFullAnalysis() {
    console.log('🚀 Starting Comprehensive Chat Interface Analysis...');
    console.log('🎯 Goal: Perfect, unified, consistent experience for scaling\n');

    await this.analyzeProgressiveDialogueCompliance();
    await this.analyzeContentConsistency();
    await this.analyzeTechnicalImplementation();
    await this.analyzeUXExperience();
    await this.analyzeScalabilityFramework();
    await this.generateOverallAssessment();

    const reportPath = this.generateReport();

    console.log('\n🎉 Analysis Complete!');
    console.log(`📄 Full report available at: ${reportPath}`);
    console.log('\n🔧 Use insights to achieve perfect story master consistency');

    return this.analysisResults;
  }
}

// Run analysis if called directly
if (process.argv[1] === __filename) {
  const analyzer = new ChatInterfaceMasterAnalyzer();
  analyzer.runFullAnalysis().catch(console.error);
}

export default ChatInterfaceMasterAnalyzer;