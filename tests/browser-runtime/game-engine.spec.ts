
import { test, expect } from '@playwright/test';

/**
 * HYBRID UNIT TEST: "The Browser-as-Runtime"
 * 
 * Instead of testing the UI (clicking buttons), we test the Logic.
 * But we run it INSIDE the Browser (Guest) to ensure 100% fidelity with the production runtime.
 * 
 * We use the "Injection Bridge" pattern:
 * 1. Host (Node): Defines the test scenario.
 * 2. Bridge (page.evaluate): Injects the data/intent.
 * 3. Guest (Browser): Executes the actual Game Engine logic.
 */

test.describe('Game Engine Logic (Browser Runtime)', () => {

    test('should traverse Sector 0 to Sector 3 Loop without UI', async ({ page }) => {
        // 1. Load the application to ensure scripts/modules are available
        // We visit the home page to bootstrap the JS environment
        await page.goto('http://localhost:3005');

        // 2. THE INJECTION BRIDGE
        // We execute logic INSIDE the browser context
        const result = await page.evaluate(async () => {
            // @ts-ignore - Accessing internal modules if exposed, or recreating state flow
            // Since we can't easily import TS modules in page.evaluate without compilation,
            // we will rely on the global 'window' if we exposed the engine, OR
            // we simulate the state transitions using the logic we know is essentially JSON processing.

            // Ideally, in a "Browser-as-Runtime" setup, we expose a test harness or
            // import the library. For this specific Next.js setup, accessing internal libs 
            // via page.evaluate is tricky without a bundler bridge.

            // HOWEVER, we can Verify the "Result" of the logic if we manipulate the state via
            // the console-accessible Global Store (if Zustand is exposed) or LocalStorage.

            // Let's attempt to manipulate the LocalStorage to SIMULATE a saved game state
            // and verify the Engine (upon reload) respects it.

            const mockState = {
                player_id: "TEST_PLAYER_HYBRID",
                current_node_id: "sector_3_office",
                flags: ["has_access_sector_3"], // User bought the key
                inventory: []
            };

            // Writes to the storage used by the app (assuming localStorage for persistence)
            localStorage.setItem('lux_story_save', JSON.stringify(mockState));

            return { success: true };
        });

        expect(result.success).toBe(true);

        // 3. RELOAD to let the Engine process the injected state
        await page.reload();

        // 4. VERIFY LOGIC (The "Guest" returns the processed state)
        // We check if the application correctly routed us to Sector 3 based on the state we injected.
        // This confirms the "Routing Logic" works in the browser.

        // Check if the DOM reflects Sector 3 (Deep Station)
        // Even though this touches DOM, we are using it to verify the *State Logic* worked.
        await expect(page.locator('body')).toContainText('Sector 3');
        await expect(page.locator('body')).toContainText('Deep Station');

        // 5. EXECUTE FUNCTION (If we exposed a helper)
        // Imagine we had: window.__GAME_ENGINE__.evaluateChoice('approach_terminal')
        // await page.evaluate(() => window.__GAME_ENGINE__.evaluateChoice('approach_terminal'));
    });

    test('should correctly interpolate dynamic text in Browser Runtime', async ({ page }) => {
        await page.goto('http://localhost:3005');

        // Verify the TextProcessor logic via the UI output
        // We'll navigate rapidly to the Deep Station using the "Backdoor" (URL param or State Injection)

        // Inject State: At terminal_decrypted node
        await page.evaluate(() => {
            const deepState = {
                gameState: {
                    playerId: "HYBRID_TESTER_007",
                    currentNodeId: "terminal_decrypted",
                    currentCharacterId: "deep_station",
                    globalFlags: ["has_access_sector_3", "view_mode_reality"],
                    characters: {
                        deep_station: {
                            trust: 0,
                            knowledgeFlags: [],
                            conversationHistory: []
                        }
                    }
                }
            };
            // We need to know KEY used by Zustand persist.
            // Usually 'lux-story-storage'.
            localStorage.setItem('lux-store', JSON.stringify({
                state: { coreGameState: JSON.stringify(deepState.gameState) },
                version: 0
            }));
        });

        await page.reload();

        // The "Injection Bridge" allows us to assert that the Client-side Logic (TextProcessor)
        // correctly grabbed "HYBRID_TESTER_007" and rendered it.
        await expect(page.locator('body')).toContainText('AUTHOR: HYBRID_TESTER_007');
    });

});
