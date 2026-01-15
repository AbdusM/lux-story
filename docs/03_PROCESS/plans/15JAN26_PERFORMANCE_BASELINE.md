# MacBook Pro Performance Baseline
## Multi-AI Workflow Documentation

**Date:** January 15, 2026, 12:15 PM
**Context:** All AI tools active (Claude Code x2, Claude Desktop, Antigravity/Gemini)

---

## System Snapshot

| Metric | Value | Status |
|--------|-------|--------|
| RAM Used | 15GB / 16GB | CRITICAL (64MB free) |
| CPU Idle | 3.15% | CRITICAL |
| Load Average | 9.66, 8.49, 8.41 | HIGH |
| Gemini Chrome | 14 procs, 122.8% CPU | PRIMARY BOTTLENECK |
| Regular Chrome | 28 procs, 3.6% CPU | IDLE (not the problem) |
| Node Processes | 29 | MODERATE |
| Claude Processes | 11 | NORMAL |

**Key Correction:** Regular browsing tabs are NOT causing load. Gemini's Playwright
automation is inherently CPU-intensive and is the actual bottleneck.

---

## Top 5 Resource Consumers

### By CPU

| Rank | Process | CPU% | MEM% | Role |
|------|---------|------|------|------|
| 1 | Antigravity Language Server | 127% | 9.7% | Gemini AI backend |
| 2 | Claude Code (this session) | 57.7% | 2.8% | Primary development |
| 3 | Chrome GPU (Gemini browser) | 31.9% | 0.6% | Browser testing GPU |
| 4 | Chrome Renderer (localhost:3005) | 22.6% | 1.0% | Testing lux-story |
| 5 | OrbVoice Simulator | 17.1% | 0.4% | iOS dev (unrelated) |

### By Memory

| Rank | Process | MEM% | MEM (MB) | Role |
|------|---------|------|----------|------|
| 1 | Antigravity Language Server | 9.7% | ~1.5GB | Gemini AI backend |
| 2 | Claude Code (this session) | 2.8% | ~450MB | Primary development |
| 3 | Antigravity Renderer | 1.7% | ~280MB | UI rendering |
| 4 | Chrome (main profile) | 1.5% | ~248MB | Daily browsing |
| 5 | Chrome (testing localhost) | 1.1% | ~180MB | lux-story testing |

---

## Memory Pressure Analysis

```
Physical Memory: 15GB used, 64MB free
Compressor: 412,941 pages (~6.3GB in compressed state)
Swap Activity: 409M swapins, 434M swapouts (HEAVY)
Page Compressions: 3.7B total (HIGH pressure)
```

**Key Insight:** System is under severe memory pressure. The compressor is working hard to keep things running. Swap activity is extremely high.

---

## Process Distribution

| Category | Count | CPU Total | Notes |
|----------|-------|-----------|-------|
| Chrome (all profiles) | 43 | ~100%+ | Includes Gemini test browser |
| Node/npm | 29 | ~10% | Dev servers, tooling |
| Claude | 11 | ~60% | Code + Desktop |
| iOS Simulator | ~15 | ~35% | OrbVoice dev (idle) |

---

## Red Line Thresholds

Based on this baseline, here are the thresholds for maintaining responsiveness:

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| RAM Free | >1GB | 500MB-1GB | <500MB |
| CPU Idle | >20% | 10-20% | <10% |
| Load Avg | <6 | 6-10 | >10 |
| Chrome Procs | <30 | 30-50 | >50 |

**Current Status:** RED across all metrics

---

## Optimization Opportunities

### Immediate (Low Effort, High Impact)

1. **Stop iOS Simulator** - OrbVoice dev not active, ~35% CPU freed
2. ~~**Close Daily Chrome**~~ - NOT NEEDED (only 3.6% CPU, essentially idle)
3. **Headless Testing** - Run Playwright tests without GUI when visuals not needed
4. **Test pacing** - Add 30s pauses between test phases to let CPU recover

### Short-term (Medium Effort)

5. **Consolidate Claude Sessions** - Run single Claude Code session
6. **Close orbdoc dev server** - Not actively developing, frees Node processes
7. ~~**Test browser cleanup**~~ - NOT NEEDED for regular tabs (but Gemini tab cleanup still useful)

### Medium-term (Requires Setup)

7. **Cloud test runner** - Offload browser tests to VM
8. **Resource monitoring daemon** - Alert when approaching red thresholds
9. **Priority scheduling** - `nice` commands to prioritize active AI tool

---

## Workflow Recommendations

### For Best Responsiveness During Testing

```
Before starting Gemini/Antigravity tests:
1. Close iOS Simulator (if not using)
2. Close non-essential Chrome tabs
3. Stop secondary dev servers
4. Consider closing Claude Desktop (optional)

During testing:
- Let Antigravity run uninterrupted
- Avoid heavy operations in Claude Code
- Monitor with lightweight pulse (10s intervals)

After testing:
- Close Gemini test browser
- Review test results
- Resume normal workflow
```

---

## Benchmark Reference Points

| Scenario | Expected CPU Idle | Expected RAM Free |
|----------|-------------------|-------------------|
| Baseline (all AI) | 3% | 64MB |
| Without Simulator | ~15% | ~200MB |
| Single Claude + Gemini | ~25% | ~500MB |
| Optimal testing | ~30% | ~1GB |

---

*Document will be updated as optimization phases progress.*
