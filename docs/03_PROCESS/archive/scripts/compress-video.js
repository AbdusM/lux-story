#!/usr/bin/env node

/**
 * Video Compression Helper for Gemini Analysis
 * 
 * Compresses videos to under 20MB for Gemini API compatibility
 * Uses FFmpeg for optimal compression while maintaining quality
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Check if FFmpeg is installed
 */
async function checkFFmpeg() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version']);
    ffmpeg.on('error', () => resolve(false));
    ffmpeg.on('close', (code) => resolve(code === 0));
  });
}

/**
 * Get video file size in MB
 */
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

/**
 * Compress video using FFmpeg
 */
async function compressVideo(inputPath, outputPath, targetSizeMB = 18) {
  return new Promise((resolve, reject) => {
    console.log(`🎬 Compressing video for Gemini API...`);
    console.log(`📥 Input: ${inputPath} (${getFileSizeMB(inputPath)} MB)`);
    console.log(`📤 Output: ${outputPath}`);
    console.log(`🎯 Target size: <${targetSizeMB} MB`);
    
    // Calculate bitrate for target file size
    // Rough calculation: (target_size_mb * 8 * 1024) / duration_seconds
    // We'll use a conservative bitrate that should work for most UI videos
    const videoBitrate = '800k';  // Conservative bitrate for UI content
    const audioBitrate = '128k';  // Standard audio bitrate
    
    const args = [
      '-i', inputPath,
      '-c:v', 'libx264',           // H.264 codec
      '-b:v', videoBitrate,        // Video bitrate
      '-c:a', 'aac',               // AAC audio codec
      '-b:a', audioBitrate,        // Audio bitrate
      '-preset', 'medium',         // Encoding speed vs compression
      '-crf', '28',                // Quality (18-28 is good range)
      '-movflags', '+faststart',   // Optimize for streaming
      '-y',                        // Overwrite output file
      outputPath
    ];
    
    console.log(`⚙️  FFmpeg command: ffmpeg ${args.join(' ')}`);
    
    const ffmpeg = spawn('ffmpeg', args);
    
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
      // Show progress (FFmpeg outputs to stderr)
      const progressMatch = stderr.match(/time=([0-9:.]+)/);
      if (progressMatch && stderr.includes('frame=')) {
        process.stdout.write(`\r⏳ Processing... ${progressMatch[1]}`);
      }
    });
    
    ffmpeg.on('close', (code) => {
      console.log(''); // New line after progress
      
      if (code === 0) {
        const outputSizeMB = getFileSizeMB(outputPath);
        console.log(`✅ Compression complete!`);
        console.log(`📦 Output size: ${outputSizeMB} MB`);
        
        if (parseFloat(outputSizeMB) <= targetSizeMB) {
          console.log(`🎉 File is ready for Gemini API analysis!`);
        } else {
          console.log(`⚠️  File still too large. Consider further compression.`);
        }
        
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg failed with code ${code}:\n${stderr}`));
      }
    });
    
    ffmpeg.on('error', (error) => {
      reject(new Error(`FFmpeg error: ${error.message}`));
    });
  });
}

/**
 * Main compression function
 */
async function main() {
  const inputPath = process.argv[2] || '/Users/abdusmuwwakkil/Documents/testrun01.mov';
  
  console.log('🎬 Video Compression for Gemini Analysis');
  console.log('=' .repeat(50));
  
  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  // Check current file size
  const currentSizeMB = getFileSizeMB(inputPath);
  console.log(`📊 Current file size: ${currentSizeMB} MB`);
  
  if (parseFloat(currentSizeMB) <= 20) {
    console.log(`✅ File is already under 20MB limit!`);
    console.log(`📄 You can directly use: node scripts/gemini-cognitive-analysis.js "${inputPath}"`);
    process.exit(0);
  }
  
  // Check if FFmpeg is installed
  console.log('🔍 Checking FFmpeg installation...');
  const hasFFmpeg = await checkFFmpeg();
  
  if (!hasFFmpeg) {
    console.error('❌ FFmpeg not found!');
    console.log('💡 Install FFmpeg:');
    console.log('   macOS: brew install ffmpeg');
    console.log('   Ubuntu: sudo apt install ffmpeg');
    console.log('   Windows: Download from https://ffmpeg.org');
    process.exit(1);
  }
  
  console.log('✅ FFmpeg found!');
  
  // Create output path
  const inputDir = path.dirname(inputPath);
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(inputDir, `${inputName}-compressed-for-gemini.mp4`);
  
  try {
    // Compress video
    await compressVideo(inputPath, outputPath);
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 COMPRESSION COMPLETE!');
    console.log('=' .repeat(50));
    console.log(`📁 Compressed file: ${outputPath}`);
    console.log(`📊 Size: ${getFileSizeMB(outputPath)} MB`);
    console.log('\n🔬 Next step - Run cognitive analysis:');
    console.log(`   node scripts/gemini-cognitive-analysis.js "${outputPath}"`);
    
  } catch (error) {
    console.error('❌ Compression failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { compressVideo, checkFFmpeg };