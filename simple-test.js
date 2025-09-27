/**
 * Simple UX Test - Direct HTTP Testing
 * Tests what we can without browser automation
 */

import fetch from 'node-fetch';

async function testBasicFunctionality() {
    console.log('🧪 Testing Birmingham Career Exploration UX\n');

    // Test 1: Basic connectivity
    try {
        const response = await fetch('http://localhost:3000');
        const html = await response.text();

        console.log('✅ Server responds successfully');
        console.log(`   Status: ${response.status}`);
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);

        // Test 2: Critical content presence
        const criticalChecks = {
            'Title': html.includes('Grand Central Terminus'),
            'Button': html.includes('Begin New Journey'),
            'Narrative': html.includes('Platform 7, Midnight'),
            'Apple Design': html.includes('text-slate-900'),
            'React Hydration': html.includes('__next_f'),
        };

        console.log('\n📋 Content Analysis:');
        Object.entries(criticalChecks).forEach(([check, passed]) => {
            console.log(`   ${passed ? '✅' : '❌'} ${check}: ${passed ? 'Found' : 'Missing'}`);
        });

        // Test 3: Check for potential JS errors in HTML
        const potentialIssues = [];

        if (html.includes('Error') && !html.includes('ErrorBoundary')) {
            potentialIssues.push('Error text found in HTML');
        }

        if (!html.includes('React') && !html.includes('__next')) {
            potentialIssues.push('No React framework detected');
        }

        if (html.includes('404') || html.includes('not found')) {
            potentialIssues.push('404 or not found errors detected');
        }

        // Test 4: Performance indicators
        const performanceMetrics = {
            'HTML Size': `${Math.round(html.length / 1024)}KB`,
            'Script Tags': (html.match(/<script/g) || []).length,
            'CSS Links': (html.match(/<link.*css/g) || []).length,
            'Next.js Chunks': (html.match(/chunks\/[^"]+\.js/g) || []).length
        };

        console.log('\n⚡ Performance Metrics:');
        Object.entries(performanceMetrics).forEach(([metric, value]) => {
            console.log(`   ${metric}: ${value}`);
        });

        console.log('\n🔍 Potential Issues:');
        if (potentialIssues.length === 0) {
            console.log('   ✅ No obvious issues detected in HTML');
        } else {
            potentialIssues.forEach(issue => console.log(`   ❌ ${issue}`));
        }

        // Test 5: API endpoint testing
        console.log('\n🌐 API Endpoint Testing:');

        try {
            const validateResponse = await fetch('http://localhost:3000/api/content/validate', {
                method: 'POST'
            });
            if (validateResponse.ok) {
                console.log('   ✅ Content validation API responsive');
            } else {
                console.log(`   ❌ Content validation API error: ${validateResponse.status}`);
            }
        } catch (error) {
            console.log(`   ❌ Content validation API unreachable: ${error.message}`);
        }

        return {
            status: 'success',
            criticalChecks,
            potentialIssues,
            performanceMetrics
        };

    } catch (error) {
        console.log(`❌ CRITICAL: Cannot connect to localhost:3000`);
        console.log(`   Error: ${error.message}`);
        return { status: 'error', error: error.message };
    }
}

// Manual test observations based on CLAUDE.md
function analyzeKnownIssues() {
    console.log('\n📖 Known Issue Analysis (from CLAUDE.md):');
    console.log('   🚨 "Begin New Journey" Button Not Working');
    console.log('   🔍 Possible causes:');
    console.log('     • React bundler errors blocking JavaScript execution');
    console.log('     • Need to clear .next cache (DONE)');
    console.log('     • useSimpleGame hook state management issue');
    console.log('     • Event handler not properly attached');
    console.log('');
    console.log('   💡 Investigation needed:');
    console.log('     • Browser console errors during button click');
    console.log('     • React state updates in useSimpleGame hook');
    console.log('     • handleStartGame function execution');
    console.log('     • Component re-render after state change');
    console.log('');
}

// Test Devon dialogue issue mentioned in CLAUDE.md
function analyzeDialogueIssues() {
    console.log('📝 Known Dialogue Issues:');
    console.log('   ❓ "Does Devon\'s dialogue still create walls of text?"');
    console.log('   🔍 Text chunking system analysis needed:');
    console.log('     • 150-200 character chunk size');
    console.log('     • Quote stripping logic');
    console.log('     • parseTextWithHierarchy function');
    console.log('     • Sentence boundary detection');
    console.log('');
}

async function runCompleteTest() {
    const result = await testBasicFunctionality();
    analyzeKnownIssues();
    analyzeDialogueIssues();

    console.log('🎯 CRITICAL NEXT STEPS:');
    console.log('   1. Test button click in actual browser');
    console.log('   2. Check browser console for JavaScript errors');
    console.log('   3. Test useSimpleGame hook state changes');
    console.log('   4. Verify dialogue progression works');
    console.log('   5. Test choice selection and continue button');
    console.log('');

    return result;
}

runCompleteTest().catch(console.error);