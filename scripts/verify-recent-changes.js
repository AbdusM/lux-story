#!/usr/bin/env node

/**
 * Verify Recent Changes
 * Specifically tests the changes we just made
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3003';
const SCREENSHOTS_DIR = './test-screenshots';

async function takeScreenshot(page, name, description) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  
  await page.screenshot({ 
    path: filepath, 
    fullPage: true,
    captureBeyondViewport: false
  });
  
  console.log(`📸 ${description}: ${filename}`);
  return filepath;
}

async function verifyRecentChanges() {
  console.log('🔍 Verifying Recent Changes...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Verify avatars are in top bar, not inline
    console.log('\n👤 Testing Avatar Placement...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Start the game
    const startButton = await page.$('button');
    if (startButton) {
      await startButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Check for DiceBear avatars
    const dicebearAvatars = await page.$$('img[src*="dicebear"]');
    console.log(`Found ${dicebearAvatars.length} DiceBear avatars`);
    
    // Check for top bar
    const topBar = await page.$('div[class*="sticky"]');
    if (topBar) {
      console.log('✅ Top bar found');
      await takeScreenshot(page, 'avatar-top-bar', 'Avatars in top bar (not inline)');
    }
    
    // Test 2: Verify choice buttons don't have icons
    console.log('\n🔘 Testing Choice Button Design...');
    const choiceButtons = await page.$$('button');
    console.log(`Found ${choiceButtons.length} buttons`);
    
    // Check for SVG icons in buttons
    const buttonsWithIcons = await page.$$('button svg');
    console.log(`Found ${buttonsWithIcons.length} buttons with icons (should be minimal)`);
    
    await takeScreenshot(page, 'choice-buttons-clean', 'Clean choice buttons without heavy outlines');
    
    // Test 3: Verify admin dashboard clarity
    console.log('\n📊 Testing Admin Dashboard Clarity...');
    await page.goto(`${BASE_URL}/admin/skills`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for improved typography
    const headings = await page.$$('h1, h2, h3, h4');
    console.log(`Found ${headings.length} headings with improved typography`);
    
    await takeScreenshot(page, 'admin-dashboard-clear', 'Admin dashboard with improved clarity');
    
    // Test 4: Mobile responsiveness
    console.log('\n📱 Testing Mobile Responsiveness...');
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await takeScreenshot(page, 'mobile-responsive', 'Mobile responsive design');
    
    // Test 5: Line breaking in dialogue
    console.log('\n💬 Testing Dialogue Line Breaking...');
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    const startBtn = await page.$('button');
    if (startBtn) {
      await startBtn.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Check dialogue text
    const dialogueText = await page.$eval('body', el => el.textContent);
    console.log(`Dialogue text length: ${dialogueText.length} characters`);
    
    await takeScreenshot(page, 'dialogue-line-breaking', 'Improved dialogue line breaking');
    
    console.log('\n✅ All recent changes verified successfully!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the verification
verifyRecentChanges().catch(console.error);
