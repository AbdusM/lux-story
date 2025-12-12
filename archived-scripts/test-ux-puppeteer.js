/**
 * UX Testing Script - Birmingham Career Exploration
 * Tests core user experience flows including the "Begin New Journey" button issue
 */

import puppeteer from 'puppeteer';

async function testLuxStoryUX() {
    console.log('🚀 Starting UX evaluation of Lux Story app...\n');

    let browser = null;
    let issues = [];
    let successes = [];

    try {
        browser = await puppeteer.launch({
            headless: false, // Show browser for visual confirmation
            defaultViewport: { width: 1280, height: 800 }
        });

        const page = await browser.newPage();

        // Monitor console errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
                console.log('❌ Console Error:', msg.text());
            }
        });

        // Monitor network failures
        page.on('response', response => {
            if (response.status() >= 400) {
                console.log(`❌ Network Error: ${response.status()} ${response.url()}`);
            }
        });

        console.log('📄 Loading localhost:3003...');
        await page.goto('http://localhost:3003', { waitUntil: 'networkidle0' });

        // Test 1: Page loads successfully
        const title = await page.title();
        if (title.includes('Grand Central Terminus')) {
            successes.push('✅ Page loads with correct title');
        } else {
            issues.push('❌ Page title incorrect or missing');
        }

        // Test 2: Button visibility and accessibility
        console.log('🔍 Testing button visibility...');
        const button = await page.$('button:contains("Begin New Journey")');
        if (!button) {
            // Try alternative selectors
            const buttonAlt = await page.$('[class*="Begin New Journey"], button[aria-label*="Begin"], button[title*="Begin"]');
            if (buttonAlt) {
                successes.push('✅ Button found with alternative selector');
            } else {
                // Check if button text exists anywhere
                const buttonText = await page.$eval('body', el => el.innerText.includes('Begin New Journey'));
                if (buttonText) {
                    issues.push('❌ CRITICAL: Button text exists but button not clickable');
                } else {
                    issues.push('❌ CRITICAL: "Begin New Journey" button not found');
                }
            }
        } else {
            successes.push('✅ "Begin New Journey" button visible and accessible');
        }

        // Test 3: Button click functionality
        console.log('🖱️  Testing button click...');
        try {
            // Find button by text content
            await page.waitForSelector('button', { timeout: 5000 });
            const buttons = await page.$$('button');
            let beginButton = null;

            for (let btn of buttons) {
                const text = await page.evaluate(el => el.textContent, btn);
                if (text.includes('Begin New Journey')) {
                    beginButton = btn;
                    break;
                }
            }

            if (beginButton) {
                // Test button click
                console.log('⏳ Clicking "Begin New Journey" button...');
                await beginButton.click();

                // Wait for state change (either new content or error)
                await page.waitForTimeout(2000);

                // Check if we're still on the intro screen
                const stillOnIntro = await page.$eval('body', el =>
                    el.innerText.includes('Begin New Journey')
                );

                if (stillOnIntro) {
                    issues.push('❌ CRITICAL: Button click has no effect - still on intro screen');

                    // Check for JavaScript errors
                    if (consoleErrors.length > 0) {
                        issues.push(`❌ JavaScript errors detected: ${consoleErrors.join(', ')}`);
                    } else {
                        issues.push('❌ Button click failure with no JavaScript errors (React state issue?)');
                    }
                } else {
                    successes.push('✅ Button click successful - game state changed');

                    // Test progression
                    console.log('🎮 Testing game progression...');
                    const hasChoices = await page.$('button');
                    if (hasChoices) {
                        successes.push('✅ Game displays choices after starting');
                    }

                    // Test dialogue rendering
                    const dialogueText = await page.$eval('body', el => el.innerText);
                    if (dialogueText.length > 100) {
                        successes.push('✅ Dialogue/narrative text renders');
                    }
                }
            } else {
                issues.push('❌ CRITICAL: Could not locate "Begin New Journey" button for clicking');
            }

        } catch (error) {
            issues.push(`❌ CRITICAL: Button click test failed - ${error.message}`);
        }

        // Test 4: Text readability and formatting
        console.log('📖 Testing text readability...');
        const bodyStyles = await page.evaluate(() => {
            const body = document.body;
            const computed = window.getComputedStyle(body);
            return {
                fontSize: computed.fontSize,
                lineHeight: computed.lineHeight,
                fontFamily: computed.fontFamily
            };
        });

        successes.push(`✅ Typography: ${bodyStyles.fontSize} ${bodyStyles.fontFamily}`);

        // Test 5: Mobile responsiveness
        console.log('📱 Testing mobile responsiveness...');
        await page.setViewport({ width: 375, height: 667 }); // iPhone SE
        await page.waitForTimeout(1000);

        const mobileButton = await page.$('button');
        if (mobileButton) {
            const buttonRect = await mobileButton.boundingBox();
            if (buttonRect && buttonRect.width > 44 && buttonRect.height > 44) {
                successes.push('✅ Button meets mobile touch target size (44px minimum)');
            } else {
                issues.push('❌ Button too small for mobile touch interaction');
            }
        }

        // Test 6: Check for dev artifacts
        console.log('🔍 Checking for development artifacts...');
        const hasReviewQueue = await page.$eval('body', el =>
            el.innerText.includes('Review Queue') || el.innerText.includes('Debug')
        );

        if (hasReviewQueue) {
            issues.push('❌ Development artifacts visible to users (Review Queue, Debug UI)');
        } else {
            successes.push('✅ No development artifacts visible');
        }

    } catch (error) {
        issues.push(`❌ CRITICAL: Test execution failed - ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    // Generate report
    console.log('\n📊 UX EVALUATION REPORT');
    console.log('========================\n');

    console.log('✅ WORKING WELL:');
    successes.forEach(success => console.log(`  ${success}`));

    console.log('\n❌ ISSUES FOUND:');
    issues.forEach(issue => console.log(`  ${issue}`));

    console.log('\n📈 SUMMARY:');
    console.log(`  Successes: ${successes.length}`);
    console.log(`  Issues: ${issues.length}`);

    if (issues.some(issue => issue.includes('CRITICAL'))) {
        console.log('  🚨 CRITICAL ISSUES DETECTED - IMMEDIATE ACTION REQUIRED');
    } else if (issues.length > 0) {
        console.log('  ⚠️  Issues found but app is functional');
    } else {
        console.log('  🎉 All tests passed!');
    }

    return { successes, issues };
}

// Run the test
testLuxStoryUX().catch(console.error);