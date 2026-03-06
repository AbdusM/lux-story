#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const CORE_INPUTS = [
  "docs/reference/data-dictionary/00-index.md",
  "docs/reference/data-dictionary/03-patterns.md",
  "docs/reference/data-dictionary/05-dialogue-system.md",
  "docs/reference/data-dictionary/06-simulations.md",
  "docs/reference/data-dictionary/12-analytics.md",
  "docs/03_PROCESS/archive/ai_analysis/GCT_Patent_Application.md",
  "docs/qa/2026-03-01-doc-reconciliation-status.md",
  "docs/qa/2026-03-02-release-readiness-gate-status.md",
  "docs/qa/user-id-uuid-readiness-report.json",
  "docs/qa/simulation-phase-contract-report.json",
  "docs/qa/character-deep-coverage-report.json",
  "docs/qa/interaction-event-emitter-parity-report.json",
  "docs/qa/choice-dispatch-latency-report.json",
  "docs/qa/choice-processing-latency-report.json",
  "docs/03_PROCESS/RELEASE_READINESS_CHECKLIST.md",
];

const baseArgs = [
  "scripts/ai/gemini.mjs",
  "--confirm",
  "--profile",
  "deep",
  "--model",
  "gemini-3.1-pro-preview",
  "--task",
  ".ai/prompts/game-comprehensive-audit-task.md",
  "--max-output-tokens",
  "7000",
  "--timeout-ms",
  "180000",
];

for (const input of CORE_INPUTS) {
  baseArgs.push("--input", input);
}

const passthrough = process.argv.slice(2);
const result = spawnSync("node", [...baseArgs, ...passthrough], {
  stdio: "inherit",
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
