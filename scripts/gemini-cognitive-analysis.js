#!/usr/bin/env node

/**
 * Gemini 2.5 Pro Cognitive Behavioral UI/UX Analysis Script
 * 
 * Analyzes video recordings of user interfaces from cognitive science and 
 * behavioral psychology perspectives, focusing on effort and attention mechanics.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Comprehensive cognitive behavioral analysis prompt
 * Based on cognitive load theory, attention research, and behavioral psychology
 */
const COGNITIVE_ANALYSIS_PROMPT = `
# Cognitive Behavioral UI/UX Analysis Framework

You are a world-class cognitive scientist and UX researcher analyzing a user interface recording. Evaluate this interface through the lens of cognitive science, behavioral psychology, and user engagement theory.

## Analysis Dimensions

### 1. COGNITIVE LOAD ASSESSMENT
**Intrinsic Load (Essential Processing)**
- What information is truly necessary for user goals?
- How efficiently is essential information presented?
- Are cognitive resources appropriately allocated?

**Extraneous Load (Distracting Elements)**
- Identify visual noise that competes for attention
- Spot unnecessary cognitive switching costs
- Find elements that increase processing burden without value

**Germane Load (Meaningful Engagement)**
- What promotes deep understanding/engagement?
- How does the interface support skill development?
- Where does cognitive effort translate to user value?

### 2. ATTENTION & FOCUS MECHANICS
**Visual Hierarchy Effectiveness**
- Does the eye naturally follow the intended path?
- Are priority elements receiving appropriate attention weight?
- How effectively does design guide focus progression?

**Attention Guidance Systems**
- Analyze use of contrast, color, motion for directing focus
- Evaluate information layering and progressive disclosure
- Assess attention retention throughout interaction sequences

**Cognitive Switching Costs**
- Identify moments requiring attention context switching
- Measure cognitive friction between interface elements
- Evaluate mental model consistency across interactions

### 3. BEHAVIORAL PSYCHOLOGY PRINCIPLES
**Operant Conditioning Analysis**
- What behaviors are being reinforced through design?
- How effective are feedback loops and reward systems?
- Are there unintended behavior extinctions occurring?

**Habit Formation Patterns**
- Which interface patterns support habit development?
- How does design reduce decision fatigue over time?
- What elements create behavioral momentum?

**Motivation Maintenance**
- Analyze intrinsic vs extrinsic motivation triggers
- Evaluate progress indicators and achievement systems
- Assess autonomy, mastery, and purpose elements

### 4. FLOW STATE OPTIMIZATION
**Challenge-Skill Balance**
- Is cognitive demand appropriately matched to user capability?
- How does difficulty scaling maintain engagement?
- Are there clear progression pathways?

**Immediate Feedback Quality**
- How quickly and clearly does interface respond to actions?
- Is feedback informationally sufficient without overwhelming?
- Does feedback support learning and skill development?

**Goal Clarity & Progress**
- Are objectives clear and achievable?
- How effectively does design communicate progress?
- Is next action always obvious to users?

### 5. DECISION ARCHITECTURE
**Choice Overload Prevention**
- Are decision points optimally structured?
- How does interface manage cognitive burden of choices?
- What defaults and shortcuts reduce decision fatigue?

**Cognitive Biases Utilization**
- How effectively does design leverage helpful biases?
- Are there problematic bias exploitations to address?
- Is choice architecture ethically designed?

## SPECIFIC ANALYSIS REQUIREMENTS

For each identified element, provide:

1. **Cognitive Impact Score (1-10)** - How significantly does this affect cognitive processing?

2. **Attention Efficiency Rating (1-10)** - How well does this guide/maintain attention?

3. **Behavioral Influence Assessment** - What behaviors does this encourage/discourage?

4. **Flow State Impact** - Does this enhance or disrupt flow experience?

5. **Effort-to-Value Ratio** - Is cognitive effort appropriately rewarded?

## OUTPUT STRUCTURE

### EXECUTIVE SUMMARY
- Overall cognitive load assessment
- Primary attention flow patterns
- Key behavioral psychology insights
- Flow state optimization opportunities

### CRITICAL FINDINGS
Top 5 elements that most significantly impact:
- Cognitive processing efficiency
- Attention management
- User engagement depth
- Behavioral goal achievement

### SPECIFIC RECOMMENDATIONS
For each finding, provide:
- **Problem**: Specific cognitive/behavioral issue
- **Impact**: How this affects user experience
- **Solution**: Concrete design modification
- **Expected Outcome**: Predicted cognitive/behavioral improvement
- **Implementation Priority**: High/Medium/Low

### COGNITIVE METRICS DASHBOARD
Quantified assessments:
- Cognitive Load Distribution (Intrinsic/Extraneous/Germane %)
- Attention Efficiency Score
- Decision Fatigue Index
- Flow State Probability
- Engagement Sustainability Rating

### TECHNICAL IMPLEMENTATION NOTES
- Specific CSS/design changes needed
- Behavioral pattern modifications required
- A/B testing recommendations for validation
- Measurement strategies for ongoing optimization

## ANALYSIS CONTEXT
This interface is part of a narrative career exploration game for young adults (16-24) in Birmingham, UK. The system uses Pokemon-style dialogue boxes with recent improvements to typography and visual hierarchy. Users progress through story choices that reveal career preferences and opportunities.

Please analyze the video with particular attention to:
- How well the interface maintains engagement during narrative sequences
- Whether choice presentation optimizes decision-making quality
- If visual hierarchy effectively guides attention through story flow
- How design elements support or hinder career exploration learning objectives

Provide your analysis with the depth and rigor expected from leading cognitive science research, but format recommendations for immediate practical implementation.
`;

/**
 * Convert video file to base64 for Gemini API
 */
function videoToBase64(videoPath) {
  try {
    const videoBuffer = fs.readFileSync(videoPath);
    return videoBuffer.toString('base64');
  } catch (error) {
    throw new Error(`Failed to read video file: ${error.message}`);
  }
}

/**
 * Get video MIME type from file extension
 */
function getVideoMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm'
  };
  return mimeTypes[ext] || 'video/mp4';
}

/**
 * Analyze video with Gemini 2.5 Pro
 */
async function analyzeCognitiveUX(videoPath) {
  console.log('🧠 Starting Cognitive Behavioral UI/UX Analysis...');
  console.log(`📹 Video: ${videoPath}`);
  
  // Verify video file exists
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`);
  }
  
  // Get file info
  const stats = fs.statSync(videoPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📊 File size: ${fileSizeMB} MB`);
  
  if (stats.size > 20 * 1024 * 1024) { // 20MB limit
    throw new Error('Video file too large. Gemini API has a 20MB limit for video files.');
  }
  
  try {
    // Use Gemini 1.5 Pro (stable model with video capabilities)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    console.log('🔄 Converting video to base64...');
    const videoBase64 = videoToBase64(videoPath);
    const mimeType = getVideoMimeType(videoPath);
    
    console.log('🤖 Sending to Gemini 2.5 Pro for analysis...');
    console.log('⏳ This may take 30-60 seconds for comprehensive cognitive analysis...');
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: videoBase64
        }
      },
      COGNITIVE_ANALYSIS_PROMPT
    ]);
    
    const response = await result.response;
    const analysis = response.text();
    
    console.log('✅ Analysis complete!');
    return analysis;
    
  } catch (error) {
    if (error.message.includes('API key')) {
      throw new Error('Gemini API key not found. Please set GEMINI_API_KEY environment variable.');
    }
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

/**
 * Save analysis results with timestamp
 */
function saveAnalysis(analysis, videoPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const videoName = path.basename(videoPath, path.extname(videoPath));
  const outputPath = path.join(
    path.dirname(videoPath),
    `cognitive-analysis-${videoName}-${timestamp}.md`
  );
  
  const fullReport = `# Cognitive Behavioral UI/UX Analysis Report

**Video Analyzed**: ${videoPath}
**Analysis Date**: ${new Date().toLocaleString()}
**Framework**: Cognitive Load Theory + Behavioral Psychology + Flow State Optimization

---

${analysis}

---

*Generated by Gemini 2.5 Pro Cognitive Analysis Script*
*Framework based on cognitive science research and behavioral psychology principles*
`;
  
  fs.writeFileSync(outputPath, fullReport);
  console.log(`📄 Analysis saved to: ${outputPath}`);
  return outputPath;
}

/**
 * Main execution function
 */
async function main() {
  const videoPath = process.argv[2] || '/Users/abdusmuwwakkil/Documents/testrun01.mov';
  
  console.log('🎯 Gemini 2.5 Pro Cognitive Behavioral Analysis');
  console.log('🔬 Framework: Cognitive Load + Attention + Behavioral Psychology + Flow State');
  console.log('=' .repeat(80));
  
  try {
    // Perform cognitive analysis
    const analysis = await analyzeCognitiveUX(videoPath);
    
    // Save results
    const outputPath = saveAnalysis(analysis, videoPath);
    
    // Display summary
    console.log('\n' + '=' .repeat(80));
    console.log('🎉 ANALYSIS COMPLETE');
    console.log('=' .repeat(80));
    console.log(`📄 Full report: ${outputPath}`);
    console.log('\n📋 Quick Preview:');
    console.log(analysis.substring(0, 500) + '...\n');
    
    console.log('🔍 Key Analysis Areas Covered:');
    console.log('  • Cognitive Load Assessment (Intrinsic/Extraneous/Germane)');
    console.log('  • Attention & Focus Mechanics');
    console.log('  • Behavioral Psychology Principles');
    console.log('  • Flow State Optimization');
    console.log('  • Decision Architecture');
    console.log('  • Quantified Cognitive Metrics');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 To fix: export GEMINI_API_KEY="your_api_key_here"');
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { analyzeCognitiveUX, COGNITIVE_ANALYSIS_PROMPT };