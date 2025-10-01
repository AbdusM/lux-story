#!/usr/bin/env node

/**
 * Skills Dashboard Implementation Analyzer
 *
 * Analyzes the current skills analytics system to identify:
 * - Why careers tab is blank
 * - Why gaps tab is blank
 * - Which content is boilerplate vs. real generated data
 * - How to make the implementation more robust
 * - Recommendations for Gemini-powered enhancements
 *
 * Uses Gemini 2.0 Flash for comprehensive analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg');

class SkillsDashboardAnalyzer {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    this.analysisResults = {
      careersTabIssue: {},
      gapsTabIssue: {},
      dataQuality: {},
      boilerplateIdentification: {},
      robustnessRecommendations: [],
      geminiEnhancements: [],
      overallScore: 0
    };

    // Load skills system codebase
    this.loadCodebase();
  }

  loadCodebase() {
    try {
      console.log('📦 Loading skills analytics codebase...');

      // Core files
      const basePath = path.join(__dirname, '..');

      this.skillTracker = readFileSync(
        path.join(basePath, 'lib/skill-tracker.ts'),
        'utf-8'
      );

      this.skillProfileAdapter = readFileSync(
        path.join(basePath, 'lib/skill-profile-adapter.ts'),
        'utf-8'
      );

      this.singleUserDashboard = readFileSync(
        path.join(basePath, 'components/admin/SingleUserDashboard.tsx'),
        'utf-8'
      );

      this.sceneSkillMappings = readFileSync(
        path.join(basePath, 'lib/scene-skill-mappings.ts'),
        'utf-8'
      );

      this.careerSystem = readFileSync(
        path.join(basePath, 'lib/2030-skills-system.ts'),
        'utf-8'
      );

      console.log('✅ Codebase loaded successfully');
      console.log(`   - skill-tracker.ts: ${this.skillTracker.length} chars`);
      console.log(`   - skill-profile-adapter.ts: ${this.skillProfileAdapter.length} chars`);
      console.log(`   - SingleUserDashboard.tsx: ${this.singleUserDashboard.length} chars`);
      console.log(`   - scene-skill-mappings.ts: ${this.sceneSkillMappings.length} chars`);
      console.log(`   - 2030-skills-system.ts: ${this.careerSystem.length} chars`);
    } catch (error) {
      console.error('❌ Error loading codebase:', error.message);
      process.exit(1);
    }
  }

  async analyzeCareersTabIssue() {
    console.log('\n🔍 Analyzing Careers Tab (Blank Issue)...');

    const prompt = `
Analyze why the Careers tab is showing blank in this skills dashboard implementation.

DASHBOARD COMPONENT (SingleUserDashboard.tsx - relevant sections):
${this.singleUserDashboard.substring(20000, 30000)}

CAREER MATCHING SYSTEM (2030-skills-system.ts - relevant sections):
${this.careerSystem.substring(5000, 15000)}

SKILL PROFILE ADAPTER:
${this.skillProfileAdapter.substring(0, 3000)}

USER REPORT: "Careers tab is blank"

ANALYSIS TASKS:
1. Trace the data flow: How should career matches be generated?
2. Identify where career match data comes from (which function/system)
3. Check if careerMatches array is being populated correctly
4. Identify any conditional rendering that might hide content
5. Find root cause of blank careers tab
6. Provide specific fix recommendations with code snippets

Return analysis in JSON format:
{
  "rootCause": "detailed explanation",
  "dataFlowIssue": "where the data breaks",
  "missingImplementation": ["list of missing pieces"],
  "conditionalRenderingIssues": ["any UI logic issues"],
  "recommendedFixes": [
    {
      "file": "filename",
      "location": "line or function name",
      "issue": "what's wrong",
      "fix": "code snippet to fix it"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(response);

      this.analysisResults.careersTabIssue = analysis;
      console.log('✅ Careers tab analysis complete');
      return analysis;
    } catch (error) {
      console.error('❌ Careers tab analysis failed:', error.message);
      return { error: error.message };
    }
  }

  async analyzeGapsTabIssue() {
    console.log('\n🔍 Analyzing Gaps Tab (Blank Issue)...');

    const prompt = `
Analyze why the Gaps tab is showing blank in this skills dashboard implementation.

DASHBOARD COMPONENT - GAPS TAB SECTION:
${this.singleUserDashboard.substring(30000, 40000)}

SKILL PROFILE ADAPTER:
${this.skillProfileAdapter}

USER REPORT: "Gaps tab is blank"

ANALYSIS TASKS:
1. How should skill gaps be calculated/displayed?
2. Is there a skillGaps array or similar data structure?
3. Check if gap detection logic exists
4. Identify conditional rendering for gaps tab
5. Find root cause of blank gaps tab
6. Recommend implementation approach

Return analysis in JSON format:
{
  "rootCause": "detailed explanation",
  "currentImplementation": "what exists now",
  "missingLogic": ["what's not implemented"],
  "recommendedApproach": "how to implement skill gaps",
  "codeSnippets": [
    {
      "purpose": "what this does",
      "code": "implementation code"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(response);

      this.analysisResults.gapsTabIssue = analysis;
      console.log('✅ Gaps tab analysis complete');
      return analysis;
    } catch (error) {
      console.error('❌ Gaps tab analysis failed:', error.message);
      return { error: error.message };
    }
  }

  async identifyBoilerplateVsReal() {
    console.log('\n🔍 Identifying Boilerplate vs. Real Generated Content...');

    const prompt = `
Analyze this skills dashboard implementation to identify what content is boilerplate vs. real user data.

DASHBOARD COMPONENT:
${this.singleUserDashboard.substring(0, 20000)}

SKILL TRACKER:
${this.skillTracker.substring(0, 3000)}

SCENE SKILL MAPPINGS (sample):
${this.sceneSkillMappings.substring(0, 3000)}

USER REPORT: "Evidence looks good but unclear how much is boilerplate/real generated info. Action looks good but a bit boilerplate. Skills is unclear."

ANALYSIS TASKS:
1. For SKILLS tab: What's hardcoded vs. user-generated?
2. For EVIDENCE tab: What's real gameplay data vs. placeholder?
3. For ACTION tab: What's dynamic vs. static recommendations?
4. Identify all placeholder/boilerplate text
5. Recommend what should be Gemini-generated for personalization

Return analysis in JSON format:
{
  "skillsTab": {
    "boilerplate": ["list of hardcoded elements"],
    "realData": ["list of user-generated elements"],
    "clarity": "how to make it clearer what's real"
  },
  "evidenceTab": {
    "boilerplate": ["hardcoded parts"],
    "realData": ["user gameplay parts"],
    "quality": "assessment of evidence quality"
  },
  "actionTab": {
    "boilerplate": ["generic recommendations"],
    "realData": ["personalized parts"],
    "improvementOpportunities": ["where Gemini could help"]
  },
  "geminiOpportunities": [
    {
      "tab": "which tab",
      "content": "what to generate",
      "prompt": "suggested Gemini prompt approach",
      "value": "why this adds value"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(response);

      this.analysisResults.boilerplateIdentification = analysis;
      console.log('✅ Boilerplate analysis complete');
      return analysis;
    } catch (error) {
      console.error('❌ Boilerplate analysis failed:', error.message);
      return { error: error.message };
    }
  }

  async generateRobustnessRecommendations() {
    console.log('\n🔍 Generating Robustness Recommendations...');

    const prompt = `
Analyze this skills analytics system for robustness and provide comprehensive improvement recommendations.

CURRENT IMPLEMENTATION SUMMARY:
- skill-tracker.ts: Records skill demonstrations from gameplay
- skill-profile-adapter.ts: Converts tracker data to dashboard profiles
- scene-skill-mappings.ts: Maps 44 scenes to 2030 skills framework
- SingleUserDashboard.tsx: 5-tab dashboard (Skills, Careers, Evidence, Gaps, Action)
- 2030-skills-system.ts: Career matching and skill analysis

KNOWN ISSUES:
1. Careers tab is blank
2. Gaps tab is blank
3. Unclear boilerplate vs. real data
4. Skills tab clarity issues

GOAL: Make this a production-ready, robust skills analytics system for Birmingham youth career exploration.

ANALYSIS TASKS:
1. Identify architectural weaknesses
2. Recommend data validation/error handling improvements
3. Suggest testing strategies
4. Propose Gemini-powered enhancements for personalization
5. Recommend Birmingham-specific content integration
6. Suggest UX improvements for clarity

Return analysis in JSON format:
{
  "architecturalImprovements": [
    {
      "area": "what to improve",
      "issue": "current problem",
      "recommendation": "how to fix",
      "priority": "high/medium/low"
    }
  ],
  "dataQualityEnhancements": [
    {
      "aspect": "what data",
      "improvement": "how to improve",
      "implementation": "code approach"
    }
  ],
  "geminiIntegrationOpportunities": [
    {
      "feature": "what to add",
      "geminiModel": "which model (2.0-flash-exp, etc)",
      "promptStrategy": "how to prompt",
      "expectedOutput": "what it generates",
      "valueProposition": "why it matters"
    }
  ],
  "birminghamContext": [
    {
      "enhancement": "what to add",
      "localRelevance": "Birmingham connection",
      "implementation": "how to add it"
    }
  ],
  "uxClarityImprovements": [
    {
      "tab": "which tab",
      "issue": "clarity problem",
      "solution": "how to make clearer"
    }
  ],
  "prioritizedRoadmap": [
    {
      "phase": "1/2/3",
      "tasks": ["list of tasks"],
      "impact": "expected outcome"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(response);

      this.analysisResults.robustnessRecommendations = analysis;
      console.log('✅ Robustness recommendations complete');
      return analysis;
    } catch (error) {
      console.error('❌ Robustness analysis failed:', error.message);
      return { error: error.message };
    }
  }

  async runCompleteAnalysis() {
    console.log('\n🚀 Starting Complete Skills Dashboard Analysis\n');
    console.log('═══════════════════════════════════════════════\n');

    // Run all analyses
    await this.analyzeCareersTabIssue();
    await this.analyzeGapsTabIssue();
    await this.identifyBoilerplateVsReal();
    await this.generateRobustnessRecommendations();

    // Generate overall score
    this.analysisResults.overallScore = this.calculateOverallScore();

    // Save results
    this.saveResults();

    // Print summary
    this.printSummary();
  }

  calculateOverallScore() {
    // Simple scoring: count successful analyses
    let score = 0;
    if (!this.analysisResults.careersTabIssue.error) score += 25;
    if (!this.analysisResults.gapsTabIssue.error) score += 25;
    if (!this.analysisResults.boilerplateIdentification.error) score += 25;
    if (!this.analysisResults.robustnessRecommendations.error) score += 25;
    return score;
  }

  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `skills-dashboard-analysis-${timestamp}.json`;
    const filepath = path.join(__dirname, '../docs', filename);

    try {
      writeFileSync(filepath, JSON.stringify(this.analysisResults, null, 2));
      console.log(`\n💾 Analysis saved to: ${filename}`);
    } catch (error) {
      console.error('❌ Failed to save results:', error.message);
    }
  }

  printSummary() {
    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 SKILLS DASHBOARD ANALYSIS SUMMARY');
    console.log('═══════════════════════════════════════════════\n');

    console.log(`Overall Score: ${this.analysisResults.overallScore}/100\n`);

    // Careers Tab Issue
    if (this.analysisResults.careersTabIssue.rootCause) {
      console.log('🔴 CAREERS TAB ISSUE:');
      console.log(`   Root Cause: ${this.analysisResults.careersTabIssue.rootCause}`);
      console.log(`   Fixes Needed: ${this.analysisResults.careersTabIssue.recommendedFixes?.length || 0}\n`);
    }

    // Gaps Tab Issue
    if (this.analysisResults.gapsTabIssue.rootCause) {
      console.log('🔴 GAPS TAB ISSUE:');
      console.log(`   Root Cause: ${this.analysisResults.gapsTabIssue.rootCause}`);
      console.log(`   Approach: ${this.analysisResults.gapsTabIssue.recommendedApproach}\n`);
    }

    // Boilerplate Analysis
    if (this.analysisResults.boilerplateIdentification.geminiOpportunities) {
      console.log('🤖 GEMINI ENHANCEMENT OPPORTUNITIES:');
      this.analysisResults.boilerplateIdentification.geminiOpportunities.slice(0, 3).forEach(opp => {
        console.log(`   - ${opp.tab}: ${opp.content}`);
      });
      console.log('');
    }

    // Robustness Recommendations
    if (this.analysisResults.robustnessRecommendations.prioritizedRoadmap) {
      console.log('🛠️  PRIORITIZED ROADMAP:');
      this.analysisResults.robustnessRecommendations.prioritizedRoadmap.forEach(phase => {
        console.log(`   Phase ${phase.phase}: ${phase.impact}`);
      });
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('📄 Full analysis saved to docs/ directory');
    console.log('═══════════════════════════════════════════════\n');
  }
}

// Run analysis
const analyzer = new SkillsDashboardAnalyzer();
analyzer.runCompleteAnalysis().catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
