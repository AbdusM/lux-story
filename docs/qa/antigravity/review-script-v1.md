# Antigravity Review Script v1 — 30_Lux_Story

App: 30_Lux_Story
Scope: entry flow, choice loop, ranking dashboard, save/resume
Reference: docs/qa/antigravity/guidelines.md

How to invoke (copy/paste):
```text
Run Antigravity QA for 30_Lux_Story using docs/qa/antigravity/review-script-v1.md.
Use ONE browser session and ONE context. Do not restart.
Report only at the end.
Base URL: <URL>
Environment: local | staging | prod
Credentials: <if needed>
```

Session Rules:
- Use ONE browser session and ONE context.
- Do not restart the browser between steps.
- Use a SINGLE tab for the entire run.
- Do not open new tabs or windows.
- If a link opens a new tab, close it and return to the original tab.
- Run steps in order without pausing for intermediate reports.
- Report only at the end.
- Artifacts are automatic, so keep this to a single run.

Inputs:
- Base URL:
- Environment: local | staging | prod
- Credentials (if needed):
- Test data (if needed):

Steps:
1. Open Base URL. Confirm entry flow renders.
2. Start a story and make a choice. Confirm progress advances.
3. Continue the choice loop for 2 steps. Confirm state persists.
4. Open ranking dashboard. Confirm data loads.
5. Save progress and reload the page. Confirm resume works.
6. Exit and re-enter. Confirm prior session is available.

Output format:
- Summary: pass/fail counts.
- Findings: each with title, URL, steps, expected, actual, severity.
- Visited pages log: ordered list of URL + purpose + pass/fail.
- Visual inspection log: UI/UX issues, layout breaks, and inconsistencies.
- Notes: perf hiccups, flaky behavior, or unusual waits.
- Artifact markers: note any failures with approximate timestamps.
