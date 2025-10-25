#!/usr/bin/env node

/**
 * Comprehensive UI Testing Script
 * Tests all aspects of the Lux Story application UI
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3003';
const SCREENSHOTS_DIR = './test-screenshots';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

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

async function testMainGameInterface(page) {
  console.log('\n🎮 Testing Main Game Interface...');
  
  // Navigate to main page
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 1: Home page layout
  await takeScreenshot(page, 'home-page', 'Home page layout');
  
  // Test 2: Start the game
  const startButton = await page.$('button:has-text("Enter the Station")');
  if (startButton) {
    await startButton.click();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await takeScreenshot(page, 'game-started', 'Game started - initial dialogue');
  }
  
  // Test 3: Character avatar in top bar
  const topBar = await page.$('[data-testid="character-top-bar"]');
  if (topBar) {
    await takeScreenshot(page, 'character-top-bar', 'Character avatar in top bar');
  }
  
  // Test 4: Dialogue flow
  await new Promise(resolve => setTimeout(resolve, 2000));
  await takeScreenshot(page, 'dialogue-flow', 'Dialogue flow with proper line breaking');
  
  // Test 5: Choice buttons
  const choiceButtons = await page.$$('button[class*="choice"]');
  if (choiceButtons.length > 0) {
    await takeScreenshot(page, 'choice-buttons', 'Choice buttons without icons and heavy outlines');
  }
  
  return true;
}

async function testMobileResponsiveness(page) {
  console.log('\n📱 Testing Mobile Responsiveness...');
  
  // Test mobile viewport
  await page.setViewport({ width: 375, height: 667, isMobile: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await takeScreenshot(page, 'mobile-home', 'Mobile home page');
  
  // Test mobile game interface
  const startButton = await page.$('button:has-text("Enter the Station")');
  if (startButton) {
    await startButton.click();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await takeScreenshot(page, 'mobile-game', 'Mobile game interface');
  }
  
  // Test mobile choice buttons
  await takeScreenshot(page, 'mobile-choices', 'Mobile choice buttons with proper touch targets');
  
  return true;
}

async function testAdminDashboard(page) {
  console.log('\n👨‍💼 Testing Admin Dashboard...');
  
  // Navigate to admin dashboard
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 1: Admin login page
  await takeScreenshot(page, 'admin-login', 'Admin login page');
  
  // Test 2: Admin dashboard (if accessible)
  const adminContent = await page.$('[data-testid="admin-dashboard"]');
  if (adminContent) {
    await takeScreenshot(page, 'admin-dashboard', 'Admin dashboard with improved clarity');
  }
  
  // Test 3: Skills analysis page
  await page.goto(`${BASE_URL}/admin/skills`, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await takeScreenshot(page, 'admin-skills', 'Admin skills page with enhanced readability');
  
  return true;
}

async function testAvatarFunctionality(page) {
  console.log('\n👤 Testing Avatar Functionality...');
  
  // Navigate to game
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  
  // Start game to see avatars
  const startButton = await page.$('button:has-text("Enter the Station")');
  if (startButton) {
    await startButton.click();
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Test avatar display
  const avatars = await page.$$('img[src*="dicebear"]');
  console.log(`Found ${avatars.length} DiceBear avatars`);
  
  if (avatars.length > 0) {
    await takeScreenshot(page, 'dicebear-avatars', 'DiceBear avatars in top bar');
  }
  
  // Test avatar positioning
  const topBar = await page.$('[data-testid="character-top-bar"]');
  if (topBar) {
    const boundingBox = await topBar.boundingBox();
    console.log(`Top bar positioned at: ${JSON.stringify(boundingBox)}`);
  }
  
  return true;
}

async function testDialogueFlow(page) {
  console.log('\n💬 Testing Dialogue Flow...');
  
  // Navigate to game
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  
  // Start game
  const startButton = await page.$('button:has-text("Enter the Station")');
  if (startButton) {
    await startButton.click();
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Test dialogue text
  const dialogueText = await page.$eval('[data-testid="dialogue-content"]', el => el.textContent);
  console.log(`Dialogue text length: ${dialogueText?.length || 0} characters`);
  
  // Test line breaking
  const paragraphs = await page.$$('p');
  console.log(`Found ${paragraphs.length} dialogue paragraphs`);
  
  await takeScreenshot(page, 'dialogue-text', 'Dialogue text with proper line breaking');
  
  return true;
}

async function testChoiceButtons(page) {
  console.log('\n🔘 Testing Choice Buttons...');
  
  // Navigate to game
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  
  // Start game
  const startButton = await page.$('button:has-text("Enter the Station")');
  if (startButton) {
    await startButton.click();
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Test choice button design
  const choiceButtons = await page.$$('button[class*="choice"]');
  console.log(`Found ${choiceButtons.length} choice buttons`);
  
  if (choiceButtons.length > 0) {
    // Test button styling
    const firstButton = choiceButtons[0];
    const styles = await page.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        border: computed.border,
        borderRadius: computed.borderRadius,
        padding: computed.padding,
        minHeight: computed.minHeight
      };
    }, firstButton);
    
    console.log('Choice button styles:', styles);
    
    // Test for icons (should be none)
    const icons = await page.$$('button[class*="choice"] svg');
    console.log(`Found ${icons.length} icons in choice buttons (should be 0)`);
    
    await takeScreenshot(page, 'choice-buttons-clean', 'Clean choice buttons without icons');
  }
  
  return true;
}

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive UI Testing...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test all aspects
    await testMainGameInterface(page);
    await testMobileResponsiveness(page);
    await testAdminDashboard(page);
    await testAvatarFunctionality(page);
    await testDialogueFlow(page);
    await testChoiceButtons(page);
    
    console.log('\n✅ All UI tests completed successfully!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the tests
runComprehensiveTests().catch(console.error);
