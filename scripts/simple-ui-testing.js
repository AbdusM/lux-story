#!/usr/bin/env node

/**
 * Simple UI Testing Script
 * Takes screenshots of all UI aspects
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

async function testAllUI() {
  console.log('🚀 Starting Simple UI Testing...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Home page
    console.log('\n🏠 Testing Home Page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, 'home-page', 'Home page layout');
    
    // Test 2: Start game
    console.log('\n🎮 Testing Game Start...');
    const startButton = await page.$('button');
    if (startButton) {
      await startButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      await takeScreenshot(page, 'game-started', 'Game started');
    }
    
    // Test 3: Mobile view
    console.log('\n📱 Testing Mobile View...');
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, 'mobile-home', 'Mobile home page');
    
    // Test 4: Admin dashboard
    console.log('\n👨‍💼 Testing Admin Dashboard...');
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, 'admin-login', 'Admin login page');
    
    // Test 5: Admin skills page
    console.log('\n📊 Testing Admin Skills...');
    await page.goto(`${BASE_URL}/admin/skills`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, 'admin-skills', 'Admin skills page');
    
    console.log('\n✅ All UI tests completed successfully!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the tests
testAllUI().catch(console.error);
