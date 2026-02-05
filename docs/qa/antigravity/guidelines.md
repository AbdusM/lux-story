# Antigravity Browser Navigation Guidelines (Golden Rules)

Purpose: reduce flaky tests, avoid "element not found" errors, and minimize browser window churn.

1. Teleport Rule (Direct URLs)
Prefer direct URLs over multi-click navigation unless the nav itself is under test.
Why: fewer steps means fewer points of failure and faster, more deterministic runs.

2. Single Tab Rule
Use a single tab for the entire run. Do not open new tabs or windows. If a link opens a new tab, close it and return to the original tab.
Why: reduces resource churn and keeps the session deterministic.

3. Accessibility Semantic Targeting
Target elements by accessible labels, roles, or visible text instead of fragile CSS selectors.
Why: accessible attributes are stable and act like an API for the UI.

4. Explicit "Wait for State"
Always wait for a clear readiness signal before interacting.
Why: prevents clicking while hydration or async data is still loading.

5. Visual Landmarking
Confirm you are on the expected page before taking action.
Why: catches 404s or misroutes early and avoids false passes.

6. Interaction "Sandwiches"
Wrap complex actions with a pre-check and post-check.
Why: validates both the action and the resulting state change.

7. Backdoor for Data (When Allowed)
Use execute_browser_javascript or data models for large tables/lists instead of manual counting.
Why: faster and more accurate than OCR or DOM counting.

8. Artifact Awareness
Artifacts are always on, so reduce the number of browser runs.
Why: one session per app minimizes CPU and window churn.

Example prompt (single-session, deterministic):
```text
Navigate to /recipe/123. Wait for the "Ingredients" header to be visible.
Click the "Save" button (Heart icon). Verify the button text changes to "Saved".
Then visit /profile directly and confirm the recipe is listed there.
```
