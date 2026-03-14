# Audit History

Last updated: 2026-03-13

This file tracks changes to the audit system itself, not every generated audit report.

## 2026-03-13 - Audit Bible v2 adopted

Status: active

Changes:

- Added canonical audit framework under `docs/audits/`
- Added JSON schema for structured findings and fix queues
- Added recurring runbook for weekly, monthly, and quarterly audits
- Standardized `Observed` vs `Inferred`
- Standardized fix-queue-first output

Repo-specific amendments added at adoption time:

- `issue_type` field to distinguish code defects from runtime/config mismatches and other drift types
- required `prod_verification` for findings that touch deployed behavior
- explicit `hotfix mode` for live incidents
- preferred `E0` / `E1` / `E2` evidence grading overlay

Reason:

Recent production debugging showed that local correctness alone was not enough. The repo needed a repeatable audit system that separates:

- direct observations from inference
- root causes from symptoms
- code defects from runtime/config mismatches
- local verification from production proof

Next review target:

- First monthly run using the new schema
- Confirm whether generated audit reports in `docs/qa/` need a stricter filename convention
