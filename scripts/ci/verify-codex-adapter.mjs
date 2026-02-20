#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const REQUIRED_TRUTH_ORDER = [
  "custom_rules",
  "workflows",
  "repo_state",
  "knowledge",
  "inference"
];

const cwd = process.cwd();
const primaryPath = path.join(cwd, ".agents", "adapters", "codex.adapter.json");
const fallbackPath = path.join(cwd, "docs", "ops", "adapters", "codex.adapter.json");

function exists(filePath) {
  return fs.existsSync(filePath);
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function template(repoId) {
  return {
    adapter_version: 1,
    repo_id: repoId,
    truth_order: REQUIRED_TRUTH_ORDER,
    critical_paths: ["src", "scripts", "docs"],
    required_citation_sources: ["repo:path#Lx-Ly"],
    safe_commands: ["ls", "cat", "rg", "git status", "npm run test"],
    risky_commands: ["npm run deploy", "wrangler deploy", "vercel --prod"],
    forbidden_commands: ["rm -rf /", "git push --force"],
    risky_patterns: ["deploy", "migration", "db:push", "release"],
    forbidden_patterns: ["rm\\s+-rf\\s+/", "git\\s+push\\s+--force", "DROP\\s+TABLE"],
    allowed_domains: ["registry.npmjs.org", "github.com", "api.github.com"],
    ci_gates: ["node scripts/ci/verify-codex-adapter.mjs"],
    capabilities: {
      supports_browser_qa: false,
      supports_kis: false,
      supports_ci: true
    }
  };
}

function validateRegexList(items, label) {
  for (const pattern of items) {
    try {
      new RegExp(pattern);
    } catch {
      fail(`${label} contains invalid regex: ${pattern}`);
    }
  }
}

function loadAdapter() {
  const hasPrimary = exists(primaryPath);
  const hasFallback = exists(fallbackPath);

  if (hasPrimary && hasFallback) {
    fail(`Multiple adapters found: ${primaryPath} and ${fallbackPath}. Keep exactly one.`);
  }

  if (!hasPrimary && !hasFallback) {
    const suggested = path.basename(cwd).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const preview = JSON.stringify(template(suggested), null, 2);
    fail(
      `Adapter missing. Create ${primaryPath}.\\nTemplate:\\n${preview}`
    );
  }

  const resolvedPath = hasPrimary ? primaryPath : fallbackPath;
  const raw = fs.readFileSync(resolvedPath, "utf8");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fail(`Invalid JSON in adapter: ${resolvedPath}`);
  }

  return { resolvedPath, parsed };
}

function validate(adapter, resolvedPath) {
  const requiredKeys = [
    "adapter_version",
    "repo_id",
    "truth_order",
    "critical_paths",
    "required_citation_sources",
    "safe_commands",
    "risky_commands",
    "forbidden_commands",
    "risky_patterns",
    "forbidden_patterns",
    "allowed_domains",
    "ci_gates",
    "capabilities"
  ];

  for (const key of requiredKeys) {
    if (!(key in adapter)) {
      fail(`Missing required key ${key} in ${resolvedPath}`);
    }
  }

  if (adapter.adapter_version !== 1) {
    fail("adapter_version must be 1");
  }

  if (typeof adapter.repo_id !== "string" || adapter.repo_id.trim() === "") {
    fail("repo_id must be a non-empty string");
  }

  if (!isStringArray(adapter.truth_order)) {
    fail("truth_order must be an array of strings");
  }

  if (JSON.stringify(adapter.truth_order) !== JSON.stringify(REQUIRED_TRUTH_ORDER)) {
    fail(`truth_order must exactly equal ${REQUIRED_TRUTH_ORDER.join(", ")}`);
  }

  const stringArrayKeys = [
    "critical_paths",
    "required_citation_sources",
    "safe_commands",
    "risky_commands",
    "forbidden_commands",
    "risky_patterns",
    "forbidden_patterns",
    "allowed_domains",
    "ci_gates"
  ];

  for (const key of stringArrayKeys) {
    if (!isStringArray(adapter[key])) {
      fail(`${key} must be an array of strings`);
    }
  }

  if (adapter.critical_paths.length === 0) {
    fail("critical_paths cannot be empty");
  }

  if (adapter.required_citation_sources.length === 0) {
    fail("required_citation_sources cannot be empty");
  }

  validateRegexList(adapter.risky_patterns, "risky_patterns");
  validateRegexList(adapter.forbidden_patterns, "forbidden_patterns");

  for (const domain of adapter.allowed_domains) {
    if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
      fail(`allowed_domains contains invalid host: ${domain}`);
    }
  }

  if (
    typeof adapter.capabilities !== "object" ||
    adapter.capabilities === null ||
    Array.isArray(adapter.capabilities)
  ) {
    fail("capabilities must be an object");
  }

  const capabilityKeys = ["supports_browser_qa", "supports_kis", "supports_ci"];
  for (const key of capabilityKeys) {
    if (typeof adapter.capabilities[key] !== "boolean") {
      fail(`capabilities.${key} must be boolean`);
    }
  }
}

const { resolvedPath, parsed } = loadAdapter();
validate(parsed, resolvedPath);
console.log(`OK: codex adapter valid (${resolvedPath})`);

