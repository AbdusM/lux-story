#!/usr/bin/env node

/**
 * Copy into your repo as scripts/ai/gemini.mjs and adjust DEFAULTS.
 *
 * Usage examples:
 *   node scripts/ai/gemini.mjs --task audit --input docs/spec.md --dry-run
 *   node scripts/ai/gemini.mjs --task plan --input docs/spec.md --confirm
 */

import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DEFAULTS = {
  profile: "balanced",
  configPath: ".ai/gemini.config.json",
  task: null,
};

function hasFlag(argv, flag) {
  return argv.includes(flag);
}

function toArgs(overrides, passthrough = []) {
  const args = [];
  const merged = { ...DEFAULTS, ...overrides };

  if (merged.profile && !hasFlag(passthrough, "--profile")) {
    args.push("--profile", merged.profile);
  }
  if (merged.configPath && !hasFlag(passthrough, "--config")) {
    args.push("--config", merged.configPath);
  }
  if (merged.task && !hasFlag(passthrough, "--task")) {
    args.push("--task", merged.task);
  }

  return args;
}

function main() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  const runtimeScript = path.join(codexHome, "skills", "global-gemini-runtime", "scripts", "gemini-run.mjs");

  const passthrough = process.argv.slice(2);
  const args = [...toArgs({}, passthrough), ...passthrough];

  const result = spawnSync("node", [runtimeScript, ...args], {
    stdio: "inherit",
  });

  if (typeof result.status === "number") {
    process.exit(result.status);
  }

  process.exit(1);
}

main();
