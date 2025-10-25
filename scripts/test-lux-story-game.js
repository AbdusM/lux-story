#!/usr/bin/env node

/**
 * Lux Story Game Testing
 * Focus on core game experience, not LinkDap integration
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

async function testLuxStoryGame() {
  console.log('🎮 Testing Lux Story Game Experience...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Home page and game start
    console.log('\n🏠 Testing Game Home Page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await takeScreenshot(page, 'game-home', 'Lux Story home page');
    
    // Test 2: Start the game
    console.log('\n🎮 Testing Game Start...');
    const startButton = await page.$('button');
    if (startButton) {
      await startButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    await takeScreenshot(page, 'game-started', 'Game started - initial dialogue');
    
    // Test 3: Check for avatar issues (Samuel gender problem)
    console.log('\n👤 Testing Avatar System...');
    const avatars = await page.$$('img[src*="dicebear"]');
    console.log(`Found ${avatars.length} DiceBear avatars`);
    
    // Check for Samuel specifically
    const samuelAvatar = await page.$('img[src*="samuel"]');
    if (samuelAvatar) {
      console.log('✅ Samuel avatar found');
      const src = await samuelAvatar.getAttribute('src');
      console.log(`Samuel avatar URL: ${src}`);
    } else {
      console.log('❌ Samuel avatar not found');
    }
    
    await takeScreenshot(page, 'avatar-system', 'Avatar system check');
    
    // Test 4: Check choice buttons (user reported icon issues)
    console.log('\n🔘 Testing Choice Buttons...');
    const choiceButtons = await page.$$('button');
    console.log(`Found ${choiceButtons.length} buttons`);
    
    // Check for icons in buttons
    const buttonsWithIcons = await page.$$('button svg');
    console.log(`Found ${buttonsWithIcons.length} buttons with icons (user said "we dont need icons for answers")`);
    
    // Check for heavy outlines
    const outlinedButtons = await page.$$('button[class*="border-2"], button[class*="border-4"]');
    console.log(`Found ${outlinedButtons.length} buttons with heavy outlines (user complained about harsh outlines)`);
    
    await takeScreenshot(page, 'choice-buttons', 'Choice buttons design check');
    
    // Test 5: Dialogue flow and line breaking
    console.log('\n💬 Testing Dialogue Flow...');
    const dialogueText = await page.$eval('body', el => el.textContent);
    console.log(`Dialogue text length: ${dialogueText.length} characters`);
    
    // Check for proper line breaking
    const paragraphs = await page.$$('p');
    console.log(`Found ${paragraphs.length} dialogue paragraphs`);
    
    await takeScreenshot(page, 'dialogue-flow', 'Dialogue flow and line breaking');
    
    // Test 6: Mobile experience
    console.log('\n📱 Testing Mobile Experience...');
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await takeScreenshot(page, 'mobile-game', 'Mobile game experience');
    
    // Test 7: Character interactions
    console.log('\n👥 Testing Character Interactions...');
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    const startBtn = await page.$('button');
    if (startBtn) {
      await startBtn.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Look for character names
    const characterNames = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
      elements.map(el => el.textContent).filter(text => text && text.length > 0)
    );
    console.log(`Character names found: ${characterNames.join(', ')}`);
    
    await takeScreenshot(page, 'character-interactions', 'Character interactions and dialogue');
    
    // Test 8: Game performance
    console.log('\n⚡ Testing Game Performance...');
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Check for console errors
    const errors = await page.evaluate(() => {
      return window.console.error ? 'Console errors present' : 'No console errors';
    });
    console.log(`Console status: ${errors}`);
    
    console.log('\n✅ Lux Story game testing completed!');
    
  } catch (error) {
    console.error('❌ Game testing failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the tests
testLuxStoryGame().catch(console.error);
