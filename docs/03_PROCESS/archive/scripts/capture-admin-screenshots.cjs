const { chromium } = require('playwright');
const path = require('path');

async function captureAdminScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const screenshotDir = path.join(__dirname, '../docs/screenshots/admin');
  const userId = 'test_low_active_healthy'; // User with most data

  console.log('📸 Capturing Admin Dashboard Screenshots...\n');

  const screenshots = [];
  let successCount = 0;
  let failCount = 0;

  // Helper function to capture with error handling
  async function captureScreenshot(name, description, action) {
    try {
      console.log(`${screenshots.length + 1}. ${description}...`);
      await action();
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `${screenshotDir}/${name}.png`,
        fullPage: true
      });
      screenshots.push({ name, description, success: true });
      successCount++;
      console.log(`   ✅ Captured: ${name}`);
    } catch (error) {
      console.error(`   ❌ Failed: ${description} - ${error.message}`);
      screenshots.push({ name, description, success: false, error: error.message });
      failCount++;
    }
  }

  try {
    // Main Admin Dashboard Screenshots
    await captureScreenshot(
      '01-urgency-triage-all',
      'Main admin dashboard - urgency triage',
      async () => {
        await page.goto('http://localhost:3003/admin', { waitUntil: 'networkidle' });
      }
    );

    await captureScreenshot(
      '02-urgency-triage-all-students',
      'Urgency triage - all students filter',
      async () => {
        await page.selectOption('select', 'all-students');
      }
    );

    await captureScreenshot(
      '03-urgency-triage-critical',
      'Urgency triage - critical only',
      async () => {
        await page.selectOption('select', 'critical');
      }
    );

    await captureScreenshot(
      '04-urgency-triage-high',
      'Urgency triage - high + critical',
      async () => {
        await page.selectOption('select', 'high');
      }
    );

    await captureScreenshot(
      '05-student-journeys-overview',
      'Student journeys tab',
      async () => {
        await page.click('button:has-text("Student Journeys")', { timeout: 10000 });
      }
    );

    await captureScreenshot(
      '06-live-choices-panel',
      'Live choices tab',
      async () => {
        await page.click('button:has-text("Live Choices")', { timeout: 10000 });
      }
    );

    // Student Profile Screenshots - Navigate fresh to avoid state issues
    await captureScreenshot(
      '07-student-skills-overview',
      'Student profile - skills tab',
      async () => {
        await page.goto(`http://localhost:3003/admin/skills?userId=${userId}`, { waitUntil: 'networkidle' });
      }
    );

    await captureScreenshot(
      '08-student-careers-overview',
      'Student profile - careers tab',
      async () => {
        await page.waitForSelector('button:has-text("Careers")', { timeout: 10000 });
        await page.click('button:has-text("Careers")');
      }
    );

    await captureScreenshot(
      '09-student-evidence-overview',
      'Student profile - evidence tab',
      async () => {
        await page.waitForSelector('button:has-text("Evidence")', { timeout: 10000 });
        await page.click('button:has-text("Evidence")');
      }
    );

    await captureScreenshot(
      '10-student-gaps-overview',
      'Student profile - gaps tab',
      async () => {
        await page.waitForSelector('button:has-text("Gaps")', { timeout: 10000 });
        await page.click('button:has-text("Gaps")');
      }
    );

    await captureScreenshot(
      '11-student-action-plan',
      'Student profile - action tab',
      async () => {
        await page.waitForSelector('button:has-text("Action")', { timeout: 10000 });
        await page.click('button:has-text("Action")');
      }
    );

    await captureScreenshot(
      '12-student-2030skills-overview',
      'Student profile - 2030 skills tab',
      async () => {
        await page.waitForSelector('button:has-text("2030 Skills")', { timeout: 10000 });
        await page.click('button:has-text("2030 Skills")');
      }
    );

    await captureScreenshot(
      '13-student-urgency-detail',
      'Student profile - urgency tab',
      async () => {
        await page.waitForSelector('button:has-text("Urgency")', { timeout: 10000 });
        await page.click('button:has-text("Urgency")');
      }
    );

    console.log('\n📊 Screenshot Capture Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📁 Screenshots saved to: ${screenshotDir}`);

    if (failCount > 0) {
      console.log('\n⚠️  Failed Screenshots:');
      screenshots.filter(s => !s.success).forEach(s => {
        console.log(`   - ${s.description}: ${s.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Fatal error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

captureAdminScreenshots();
